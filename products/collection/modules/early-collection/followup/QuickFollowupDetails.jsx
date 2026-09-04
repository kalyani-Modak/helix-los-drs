            
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Collapse, Divider, IconButton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HCheckBox, HDatePicker, HDropdown, HLabel, HPaper, HTextField, HTextarea, SearchCommonBox, useToast } from "@helix/component-library";

import { FollowupAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import PickUp from "../PickUp";
import { buildUpdateFollowupRequest } from "./followupPayloadBuilders";
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { gridActionDefObj, gridResultDefObj } from "../../../../common/components/SearchGridDefObj";
import { width } from "@mui/system";

function addDaysToDate(base, days) {
  return dayjs(base).add(days, "day");
}

function mapFollowupDropdownOptions(list = [], intl) {
  return (Array.isArray(list) ? list : [])
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = item.szCondition ?? "";
      return value
        ? {
            value,
            label: item.szi18nDesc
              ? intl.formatMessage({
                  id: item.szi18nDesc,
                  defaultMessage: item.szCondition,
                })
              : item.szDesc ?? item.szCondition,
          }
        : null;
    })
    .filter(Boolean);
}

export default function QuickFollowupDetails({ onSaved, onCloseCompact }) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const locale = navigator.language;
  const recordPanelBorder = alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.3 : 0.18,
  );
  const [pickUpRequired, setPickUpRequired] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [actionCode, setActionCode] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [generatedPromises, setGeneratedPromises] = useState([]);
  const [loading , setLoading]=useState(false)
    const location = useLocation();
  const screenMenuId =  location.state.menuId;
  const [followupData, setFollowupData] = useState({
    nextAction: "",
    nextActionDate: "",
    promiseStartDate: "",
    frequency: "",
    promiseAmount: "",
    numberOfPromises: "",
    delinquencyReason: "",
    bestTimeToCall: "",
    partyContacted: "",
    modeOfContact: "",
    placeOfContact: "",
    contactPerson: "",
  });
  const [partyContactedOptions, setPartyContactedOptions] = useState([]);
  const [delinquencyReasonOptions, setDelinquencyReasonOptions] = useState([]);
  const [objErrors, setObjErrors] = useState({
    action: false,
    result: false,
    delinquencyReason: false,
    promiseStartDate: false,
    frequency: false,
    promiseAmount: false,
    numberOfPromises: false,
    generatedPromises: false,
  });
  const [pickUpData, setPickUpData] = useState({
    szVisitFor: "",
    szAddressType: "",
    szContactPerson: "",
    dtVisitDate: "",
    szPhone: "",
    szMobile: "",
    szPickupCollectorGrp: "",
    szPickupCollector: "",
    bdVisitForAmt: "",
    szAddress: "",
  });

  const fetchFollowupDropdowns = useCallback(async () => {
    try {
      const response = await HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/initializeddropdowns`, {});
      const payload =
        response?.data?.responseJson || response?.data?.data || response?.data || {};

      setPartyContactedOptions(
        mapFollowupDropdownOptions(payload.lstPartyContacted, intl),
      );
      setDelinquencyReasonOptions(
        mapFollowupDropdownOptions(payload.lstDelqReason, intl),
      );
    } catch (error) {
      console.error("Error fetching followup dropdowns:", error);
      toast.error(
        intl.formatMessage({
          id: "error.followup.dropdown.fetch",
          defaultMessage: "Error fetching followup dropdown values.",
        }),
      );
    }
  }, [intl]);

  useEffect(() => {
    fetchFollowupDropdowns();
  }, [fetchFollowupDropdowns]);

  useEffect(()=>{
console.log("QuickFollowupdetails=======================================================",screenMenuId);
  },[])


  const clearFieldError = (field) => {
    setObjErrors((prev) =>
      prev[field] ? { ...prev, [field]: false } : prev,
    );
  };

  const isBlank = (value) =>
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && value.trim() === "");

  const updateField = (field, errorField = field) => (event) => {
    const value = event?.target?.value ?? event;
    setFollowupData((prev) => ({ ...prev, [field]: value }));
    if (!isBlank(value)) {
      clearFieldError(errorField);
    }
  };

  const handleResultSelect = (value, row) => {
    setResultCode(value); // ← this drives isPtpResult
    if (value) clearFieldError("result");

    const rawLimitDays = row?.iNextActionLimitDays;
    const nextActionLimitDays = Number(rawLimitDays);
    if (
      rawLimitDays !== undefined &&
      rawLimitDays !== null &&
      String(rawLimitDays).trim() !== "" &&
      Number.isFinite(nextActionLimitDays)
    ) {
      setFollowupData((prev) => ({
        ...prev,
        promiseStartDate: addDaysToDate(new Date(), nextActionLimitDays),
      }));
      clearFieldError("promiseStartDate");
    } else {
      setFollowupData((prev) => ({
        ...prev,
        promiseStartDate: "",
      }));
    }
  };

  const isPtpResult = String(resultCode || "")
    .toUpperCase()
    .includes("PTP");

  useEffect(() => {
    if (isPtpResult) return;
    setObjErrors((prev) => ({
      ...prev,
      promiseStartDate: false,
      frequency: false,
      promiseAmount: false,
      numberOfPromises: false,
      generatedPromises: false,
    }));
  }, [isPtpResult]);

  const validateFollowupFields = async () => {
    const nextErrors = {
      result: !resultCode,
    promiseStartDate: isPtpResult && isBlank(followupData.promiseStartDate),
    promiseAmount: isPtpResult && isBlank(followupData.promiseAmount),
    };

   const hasErrors = Object.values(nextErrors).some(Boolean);

if (hasErrors) {
      setObjErrors((prev) => ({ ...prev, ...nextErrors }));
      toast.error(
        intl.formatMessage({
          id: "label.followup.requiredActionResult",
          defaultMessage: "All required fields must be filled.",
        }),
      );
      return false;
    }

    const formattedGeneratedPromises = generatedPromises.map((p) => ({
      ...p,
      dtPromiseDate:
        p.dtPromiseDate && typeof p.dtPromiseDate.format === "function"
          ? p.dtPromiseDate.format("YYYY-MM-DD")
          : p.dtPromiseDate,
    }));

    const requestData = buildUpdateFollowupRequest({
      actionCode,
      resultCode,
      followupData,
      pickUpRequired,
      pickUpData,
      generatedPromises: formattedGeneratedPromises,
    });

    try {
      setLoading(true)
      const res = await HAxiosService.POST(
        FollowupAPI.Followup(screenMenuId) + `/updateFollowup`,
        requestData,
      );
      if (res.data?.status?.toLowerCase() === "success") {
        toast.success(
          res.data.msg ||
            intl.formatMessage({
              id: "label.followup.saveSuccess",
              defaultMessage: "Followup saved successfully",
            }),
        );
        setLoading(false)
        resetForm()
        if (typeof onSaved === "function") onSaved();
        setObjErrors({ action: false, result: false, delinquencyReason: false });
        return true;
      }

      toast.error(
        res.data?.msg ||
          intl.formatMessage({
            id: "label.followup.saveFailed",
            defaultMessage: "Failed to save followup",
          }),
      );
      setLoading(false)
      return false;
    } catch (err) {
      setLoading(false)
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          intl.formatMessage({
            id: "label.followup.saveError",
            defaultMessage: "Error saving followup",
          }),
      );
      return false;
    }
  };

  const handleSubmit = () => validateFollowupFields();

    const resetForm = () => {
    setPickUpRequired(false);
    setActionCode("");
    setResultCode("");
    setSelectedDisposition("");
    setObjErrors({ action: false, result: false, delinquencyReason: false });
    setFollowupData({
      nextAction: "",
      nextActionDate: "",
      promiseStartDate: "",
      frequency: "",
      promiseAmount: "",
      numberOfPromises: "",
      delinquencyReason: "",
      bestTimeToCall: "",
      partyContacted: "",
      modeOfContact: "",
      placeOfContact: "",
      contactPerson: "",
    });
  };

  const fieldGrid = {
    display: "grid",
    gridTemplateColumns:"1fr",
    gap: 1.5,
  };

  const dateFieldCellSx = {
    minWidth: 0,
    width: "100%",
    "& .MuiTextField-root": {
      width: "100% !important",
    },
    "& .MuiInputBase-root": {
      // height: "34px !important",
      fontSize: "0.85rem",
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.1rem",
    },
  };
  const uniformFieldSx = {
    "& .MuiInputBase-root": {
      // height: "36px",
    },
  };

  // ADD THIS:
  const fieldCellSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    gap: 0.5,
  };

  const promiseFields = (
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          alignItems: "baseline",
          mb: 1.5,
        }}
      >
        {/* Start Date */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.promise.startDate",
            })}
            required
            colon={false}
            align="left"
            width="100%"
          />
          <HBox sx={dateFieldCellSx}>
              <HDatePicker
                value={followupData.promiseStartDate}
                onChange={(newVal) =>
                  {
                    setFollowupData((prev) => ({
                      ...prev,
                      promiseStartDate: newVal,
                    }));
                    if (newVal) clearFieldError("promiseStartDate");
                  }
                }
                error={objErrors.promiseStartDate}
                required
                sx={{ width: "100%" }}
                width="100%"
              />
          </HBox>
        </HBox>

        {/* Promise Amount */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({ id: "label.followup.promise.amount" })}
            required
            colon={false}
            align="left"
            width="100%"
          />
          <HTextField
            // sx={{ ...uniformFieldSx, width: "100%" }}
            width="100%"
            value={followupData.promiseAmount}
            onChange={updateField("promiseAmount")}
            editable
            error={objErrors.promiseAmount}
            required
            placeholder={intl.formatMessage({
              id: "label.followup.promise.amount",
            })}
            type="number"
          />
        </HBox>
      </HBox>
  );

  return (
    <HBox
      sx={{
        mb: 2,
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "visible",
      }}
    >
      <HPaper
        variant="outlined"
        elevation={0}
        sx={{
          borderRadius: 1.5,
          overflow: "hidden",
          borderColor: recordPanelBorder,
          boxShadow: `inset 0 0 0 1px ${recordPanelBorder}`,
          bgcolor: "background.paper",
        }}
      >
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 3,
            py: 1.5,
            borderBottom: "1px solid #7472721a",
          }}
        >
          <AssignmentIcon sx={{ fontSize: 15, color: "primary.main" }} /> 

          <HLabel
            value={intl.formatMessage({
              id: "label.followup.quickFollowupTitle",
              defaultMessage: "Quick Follow Up",
            })}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--drs-text-primary)",
            }}
          />
           <CloseIcon
              onClick={onCloseCompact}
              sx={{ fontSize: 18, cursor: 'pointer', ml: 'auto' }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            />
        </HBox>

        <HBox sx={{ px: 2, pt: 1.5, pb: 1.5 }}>
          <HBox sx={{ ...fieldGrid, mb: 1.5 }}>
            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                width: "100%",
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.followup.Result",
                  defaultMessage: "Result",
                })}
                required
                colon={false}
                align="left"
                width="100%"
              />
              <SearchCommonBox
                apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                searchCode="RECDE"
                setSelectedValue={handleResultSelect}
                selectedValue={resultCode}
                selectedColumn="szResultCode"
                gridDefObj={gridResultDefObj}
                gridWidth={280}
                gridHeight={300}
                gridNoOfRowsPerPage={2}
                searchBoxWidth="100%"
                searchBoxHeight={30}
                searchBoxFontSize={12}
                error={objErrors.result}
                placeholder={intl.formatMessage({
                  id: "label.followup.Result",
                  defaultMessage: "Result",
                })}
              />
            </HBox>
          {/* Content */}
         {isPtpResult && <HBox>{promiseFields}</HBox>}

            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                width: "100%",
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.followup.NextAction",
                  defaultMessage: "Next action",
                })}
                colon={false}
                align="left"
                width="100%"
              />
              <SearchCommonBox
                apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                searchCode="ACDE"
                setSelectedValue={(value) => {
                  setActionCode(value);
                  setFollowupData((prev) => ({ ...prev, nextAction: value }));
                  if (value) clearFieldError("action");
                }}
                selectedValue={actionCode}
                selectedColumn="SZACTIONCODE"
                gridDefObj={gridActionDefObj}
                gridWidth={280}
                gridHeight={300}
                gridNoOfRowsPerPage={2}
                searchBoxWidth="100%"
                searchBoxHeight={30}
                searchBoxFontSize={12}
                error={objErrors.action}
                placeholder={intl.formatMessage({
                  id: "label.followup.NextAction",
                  defaultMessage: "Next Action",
                })}
              />
            </HBox>

                <HBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                            width: "100%",
                          }}
                        >
                          <HLabel
                            value={intl.formatMessage({
                              id: "label.followup.nextActionDate",
                              defaultMessage: "Next Action date",
                            })}
                            colon={false}
                            align="left"
                            width="100%"
                          />
                          <HBox sx={dateFieldCellSx}>
                            <HDatePicker
                              value={followupData.nextActionDate}
                              onChange={(newVal) =>
                                setFollowupData((prev) => ({
                                  ...prev,
                                  nextActionDate: newVal,
                                }))
                              }
                              align={ALIGNMENT.DATE}
                              sx={{ width: "100%" }}
                              width="100%"
                            />
                          </HBox>
                        </HBox>

            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                width: "100%",
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.followup.PartyContacted",
                  defaultMessage: "Party contacted",
                })}
                colon={false}
                align="left"
                width="100%"
              />
              <HDropdown
                value={followupData.partyContacted}
                onChange={updateField("partyContacted")}
                options={partyContactedOptions}
                sx={{ width: "100%" }}
                width="100%"
                placeholder={intl.formatMessage({
                  id: "label.followup.PartyContacted.placeholder",
                  defaultMessage: "Select party contacted",
                })}
              />
            </HBox>
          </HBox>
          <HBox sx={{ mb: 1.5 }}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.NotesRemarks",
                defaultMessage: "Notes / remarks",
              })}
              colon={false}
              align="left"
              width="100%"
            />
            <HTextarea
              value={followupData.bestTimeToCall}
              onChange={updateField("bestTimeToCall")}
              width="100%"
              maxLines={2}
              placeholder={intl.formatMessage({
                id: "label.followup.NotesRemarks",
              })}
              translate={false}
            />
          </HBox>
           <HButton
              disabled={loading}
              size="small"
              label={intl.formatMessage({
                id: "button.save",
              })}
              margin="0"
              variant="contained"
              onClick={handleSubmit}
              sx={{ width: '100%' }}
              />
        </HBox>
      </HPaper>
    </HBox>
  );
}
