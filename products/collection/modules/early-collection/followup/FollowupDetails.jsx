import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Collapse, Divider, IconButton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Call from "@mui/icons-material/Call";
import PhoneMissed from "@mui/icons-material/PhoneMissed";
import PhoneDisabled from "@mui/icons-material/PhoneDisabled";
import Smartphone from "@mui/icons-material/Smartphone";
import Block from "@mui/icons-material/Block";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HCheckBox, HDatePicker, HDropdown, HLabel, HPaper, HTextField, HTextarea, SearchCommonBox, useToast } from "@helix/component-library";

import { FollowupAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import PickUp from "../PickUp";
import { buildUpdateFollowupRequest } from "./followupPayloadBuilders";

import { gridActionDefObj, gridResultDefObj } from "../../../../common/components/SearchGridDefObj";
const DISPOSITION_IDS = {
  connected: "connected",
  no_answer: "no_answer",
  busy: "busy",
  switched_off: "switched_off",
  refused: "refused",
  promise_to_pay: "promise_to_pay",
};

const AUTO_SUGGESTIONS = {
  [DISPOSITION_IDS.connected]: { nextAction: "oc", daysAhead: 3, resultCode: "CN" },
  [DISPOSITION_IDS.no_answer]: { nextAction: "oc", daysAhead: 1, resultCode: "NA" },
  [DISPOSITION_IDS.busy]: { nextAction: "oc", daysAhead: 0, resultCode: "NC" },
  [DISPOSITION_IDS.switched_off]: { nextAction: "sms", daysAhead: 1, resultCode: "CNT" },
  [DISPOSITION_IDS.refused]: { nextAction: "escalate", daysAhead: 2, resultCode: "RTP" },
  [DISPOSITION_IDS.promise_to_pay]: { nextAction: "oc", daysAhead: 0, resultCode: "PTP" },
};

function addDaysToDate(base, days) {
  return dayjs(base).add(days, "day");
}

function dispositionTonePalette(theme, tone) {
  switch (tone) {
    case "success":
      return theme.palette.success;
    case "warning":
      return theme.palette.warning;
    case "error":
      return theme.palette.error;
    default:
      return theme.palette.primary;
  }
}

function dispositionButtonSx(theme, tone, active) {
  const pal = dispositionTonePalette(theme, tone);
  const main = pal.main;
  const fg = theme.palette.mode === "dark" ? pal.light : pal.dark;
  return {
    textTransform: "none",
    fontSize: 11,
    fontWeight: 500,
    minHeight: 28,
    maxHeight: 28,
    px: 1.25,
    py: 0,
    lineHeight: 1.2,
    borderRadius: 1.5,
    border: `1px solid ${alpha(main, 0.3)}`,
    bgcolor: alpha(main, active ? 0.24 : 0.1),
    color: fg,
    boxShadow: "none",
    "& .MuiButton-startIcon": { mr: 0.5, ml: -0.25 },
    "&:hover": {
      bgcolor: alpha(main, active ? 0.28 : 0.18),
      borderColor: alpha(main, 0.45),
    },
    ...(active && {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
    }),
  };
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

export default function FollowupDetails({ onSaved }) {
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
  const recordPanelHeaderBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.08)
      : alpha(theme.palette.grey[900], 0.03);

  const [pickUpRequired, setPickUpRequired] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [actionCode, setActionCode] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [generatedPromises, setGeneratedPromises] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;
  const attemptToday = 3;
  const maxAttempts = 5;
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
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
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
      const response = await HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/initializeddropdowns`, {}, {}, false, {}, { cache: true, cacheKey: "FollowupDetails" });
      const payload =
        response?.data?.responseJson || response?.data?.data || response?.data || {};

      setPartyContactedOptions(
        mapFollowupDropdownOptions(payload.lstPartyContacted, intl),
      );
      setDelinquencyReasonOptions(
        mapFollowupDropdownOptions(payload.lstDelqReason, intl),
      );
      setAddressTypeOptions(
        mapFollowupDropdownOptions(payload.lstAddressTypes, intl),
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


  const dispositionButtons = useMemo(
    () => [
      {
        id: DISPOSITION_IDS.connected,
        labelId: "label.followup.disposition.connected",
        Icon: Call,
        tone: "success",
      },
      {
        id: DISPOSITION_IDS.no_answer,
        labelId: "label.followup.disposition.noAnswer",
        Icon: PhoneMissed,
        tone: "warning",
      },
      {
        id: DISPOSITION_IDS.busy,
        labelId: "label.followup.disposition.busy",
        Icon: PhoneDisabled,
        tone: "primary",
      },
      {
        id: DISPOSITION_IDS.switched_off,
        labelId: "label.followup.disposition.switchedOff",
        Icon: Smartphone,
        tone: "error",
      },
      {
        id: DISPOSITION_IDS.refused,
        labelId: "label.followup.disposition.refused",
        Icon: Block,
        tone: "error",
      },
      {
        id: DISPOSITION_IDS.promise_to_pay,
        labelId: "label.followup.disposition.ptp",
        Icon: BoltOutlinedIcon,
        tone: "success",
      },
    ],
    [],
  );

  // ── ONLY CHANGE: disposition now also sets actionCode and clears on deselect ──
  useEffect(() => {
    if (!selectedDisposition) {
      setActionCode("");
      setResultCode("");
      setFollowupData((prev) => ({ ...prev, nextAction: "", nextActionDate: "" }));
      return;
    }
    const sug = AUTO_SUGGESTIONS[selectedDisposition];
    if (!sug) return;
    const planned = addDaysToDate(new Date(), sug.daysAhead);
    setActionCode(sug.nextAction);
    if (sug.resultCode) {
      setResultCode(sug.resultCode);
      clearFieldError("result");
    }
    setFollowupData((prev) => ({
      ...prev,
      nextAction: sug.nextAction,
      nextActionDate: planned,
    }));
  }, [selectedDisposition]);
  // ─────────────────────────────────────────────────────────────────────────────

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
    };

    if (nextErrors.result) {
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
      applyToAllAccounts: isActive3,
      generatedPromises: formattedGeneratedPromises,
    });

    try {
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
      return false;
    } catch (err) {
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
    setIsActive2(false);
    setIsActive3(false);
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
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    gap: 1.5,
  };

  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": {
      width: "auto",
    },
    "& .hcheckbox-label": {
      margin: 0,
      width: "auto",
      // gap: "2px !important",
    },
    "& .hcheckbox-label.MuiFormControlLabel-root": {
      // gap: "2px !important",
    },
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important",
      whiteSpace: "nowrap",
    },
    "& .hcheckbox-input": {
      paddingRight: "0px",
    },
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
  const inputSx = {
    "& .MuiInputBase-root": {
      // height: "36px", // same for all
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
    <HBox>
      {/* PROMISE SCHEDULE */}
        <HLabel
          value={intl.formatMessage({ id: "label.followup.promise.scheduleTitle" })}
          colon={false}
          translate={false}
          align="left"
          component="div"
          sx={{
            fontSize: "0.72rem",
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.2,
          }}
        />

      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
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

        {/* Frequency */}
        <HBox sx={fieldCellSx}>
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.promise.frequency",
              })}
              required
            colon={false}
            align="left"
            width="100%"
          />
          <HDropdown
            value={followupData.frequency}
            onChange={(e) => updateField("frequency")(
              e
            )}
            options={[
              {
                label: intl.formatMessage({
                  id: "label.followup.promise.frequency.select",
                }),
                value: "",
              },
              {
                label: intl.formatMessage({
                  id: "label.followup.promise.frequency.weekly",
                }),
                value: "WEEKLY",
              },
              {
                label: intl.formatMessage({
                  id: "label.followup.promise.frequency.monthly",
                }),
                value: "MONTHLY",
              },
              ]}
              error={objErrors.frequency}
              required
              sx={{ width: "100%" }}
              width="100%"
              placeholder={intl.formatMessage({
                id: "label.followup.promise.frequency.placeholder",
                defaultMessage: "Select frequency",
              })}
            />
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
            sx={{ ...uniformFieldSx, width: "100%" }}
            width="100%"
            value={followupData.promiseAmount}
            onChange={updateField("promiseAmount")}
            editable
            error={objErrors.promiseAmount}
            required
            placeholder={intl.formatMessage({
              id: "label.followup.promise.amount",
            })}
          />
        </HBox>

        {/* No. of Promises */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.promise.numberOfPromises",
            })}
            required
            colon={false}
            align="left"
            width="100%"
          />
          <HTextField
            sx={{ ...uniformFieldSx, width: "100%" }}
            width="100%"
            value={followupData.numberOfPromises}
            onChange={updateField("numberOfPromises")}
            editable
            error={objErrors.numberOfPromises}
            required
            placeholder={intl.formatMessage({
              id: "label.followup.promise.numberOfPromises",
            })}
          />
        </HBox>

        {/* Generate — aligned to bottom, with dummy label space */}
        <HBox sx={fieldCellSx}>
          {/* Dummy label space to match the height of other fields' labels */}
          <HBox sx={{ height: "0.4rem" }} />
          <HButton
            label={intl.formatMessage({
              id: "label.followup.promise.generate",
            })}
            variant="contained"
            sx={{ height: "36px", whiteSpace: "nowrap", width: "100%" }}
            onClick={() => {
              const start = followupData.promiseStartDate
                ? dayjs(followupData.promiseStartDate)
                : null;
              const count = Number(followupData.numberOfPromises || 0);
              const amount = Number(followupData.promiseAmount || 0);

              const nextErrors = {
                promiseStartDate: !start,
                frequency: isBlank(followupData.frequency),
                promiseAmount: !amount,
                numberOfPromises: !count,
              };

              if (Object.values(nextErrors).some(Boolean)) {
                setObjErrors((prev) => ({ ...prev, ...nextErrors }));
                toast.error(
                  intl.formatMessage({
                    id: "label.followup.promise.fillRequired",
                  }),
                );
                return;
              }

              clearFieldError("promiseStartDate");
              clearFieldError("frequency");
              clearFieldError("promiseAmount");
              clearFieldError("numberOfPromises");
              clearFieldError("generatedPromises");

              const promises = [];
              let current = start;

              for (let i = 0; i < count; i++) {
                promises.push({
                  dtPromiseDate: current,
                  bdPromiseAmt: amount,
                });

                current =
                  followupData.frequency === "WEEKLY"
                    ? current.add(7, "day")
                    : current.add(1, "month");
              }

              setGeneratedPromises(promises);
            }}
          />
        </HBox>
      </HBox>

      <Divider sx={{ my: 1.5 }} />

      {/* PAYMENT COMMITMENT */}
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: 1.5,
          alignItems: "center",
          mb: 1,
        }}
      >
        <HLabel
          value={intl.formatMessage({
            id: "label.followup.promise.commitmentTitle",
          })}
          colon={false}
          align="left"
          width="auto"
        />
        <HBox />
        <HBox />
        <HBox /> {/* empty spacers */}
        <HButton
          label={intl.formatMessage({ id: "label.followup.promise.addRow" })}
          size="small"
          variant="outlined"
          sx={{
            textTransform: "none",
            fontSize: "0.7rem",
            whiteSpace: "nowrap",
          }}
          onClick={() =>
            setGeneratedPromises((prev) => [
              ...prev,
              { dtPromiseDate: dayjs(), bdPromiseAmt: "" },
            ])
          }
        />
      </HBox>

      {generatedPromises.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "text.disabled",
            py: 2,
          }}
        >
          {intl.formatMessage({ id: "label.followup.promise.emptyState" })}
        </Typography>
      ) : (
        <HBox sx={{ mt: 1 }}>
          {generatedPromises.map((row, index) => (
            <HBox
              key={index}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr auto",
                gap: 1,
                mb: 1,
              }}
            >
              <HDatePicker
                value={row.dtPromiseDate}
                onChange={(val) => {
                  const updated = [...generatedPromises];
                  updated[index].dtPromiseDate = val;
                  setGeneratedPromises(updated);
                }}
                sx={{ width: "100%" }}
              />

              <HTextField
                value={row.bdPromiseAmt}
                onChange={(e) => {
                  const updated = [...generatedPromises];
                  updated[index].bdPromiseAmt = e.target.value;
                  setGeneratedPromises(updated);
                }}
                editable
                placeholder="Amount"
                width="100%"
                sx={{ width: "100%" }}
              />

              <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconButton
                  aria-label={intl.formatMessage({ id: "label.followup.promise.delete" })}
                  onClick={() => {
                    setGeneratedPromises((prev) =>
                      prev.filter((_, i) => i !== index),
                    );
                  }}
                  size="small"
                  sx={{
                    color: "error.main",
                    border: "1px solid",
                    borderColor: "error.light",
                    borderRadius: 1,
                    width: 30,
                    height: 30,
                    bgcolor: "background.paper",
                    "&:hover": {
                      bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                      borderColor: "error.main",
                    },
                  }}
                >
                  <DeleteOutline sx={{ fontSize: 18 }} />
                </IconButton>
              </HBox>
            </HBox>
          ))}
        </HBox>
      )}
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
      <HBox
        sx={{
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 1.5,
          px: 1.5,
          py: 0.75,
          mb: 1.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? alpha(t.palette.common.white, 0.04)
              : alpha(t.palette.grey[500], 0.08),
          overflowX: "auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          flexShrink={0}
        >
          <Call sx={{ fontSize: 13, color: "primary.main" }} />
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              whiteSpace: "nowrap",
              color: "text.primary",
            }}
          >
            {intl.formatMessage({
              id: "label.followup.contactAttemptIntro",
              defaultMessage: "Contact attempt",
            })}{" "}
            <HBox
              component="span"
              sx={{ color: "primary.main", fontWeight: 700 }}
            >
              {attemptToday}
            </HBox>{" "}
            {intl.formatMessage({
              id: "label.followup.contactAttemptOf",
              defaultMessage: "of",
            })}{" "}
            <HBox component="span" sx={{ fontWeight: 700 }}>
              {maxAttempts}
            </HBox>{" "}
            {intl.formatMessage({
              id: "label.followup.contactAttemptToday",
              defaultMessage: "today",
            })}
          </Typography>
          <Stack direction="row" spacing={0.4}>
            {Array.from({ length: maxAttempts }).map((_, i) => (
              <HBox
                key={i}
                sx={{
                  width: 22,
                  height: 5,
                  borderRadius: 999,
                  bgcolor: (t) =>
                    i < attemptToday
                      ? t.palette.primary.main
                      : alpha(t.palette.text.primary, 0.12),
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.8 }} />

        <HLabel
          value={intl.formatMessage({
            id: "label.followup.quickDispositionTitle",
            defaultMessage: "Quick Disposition",
          })}
          colon={false}
          translate={false}
          align="left"
          component="div"
          color={theme.palette.primary.main}
          sx={{
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        />

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flex: "1 1 auto", minWidth: 0, flexWrap: "nowrap" }}
        >
          {dispositionButtons.map(({ id, labelId, Icon, tone }) => {
            const active = selectedDisposition === id;
            return (
              <Button
                key={id}
                disableElevation
                variant="text"
                onClick={() => setSelectedDisposition(active ? "" : id)}
                startIcon={<Icon sx={{ fontSize: 12 }} />}
                sx={dispositionButtonSx(theme, tone, active)}
              >
                {intl.formatMessage({ id: labelId })}
              </Button>
            );
          })}
        </Stack>
      </HBox>

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
          <NearMeOutlinedIcon sx={{ fontSize: 15, color: "primary.main" }} />
          <HLabel
            value={intl.formatMessage({
              id: "label.followup.recordTitle",
              defaultMessage: "Record Follow Up",
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
                gridWidth={350}
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
                searchBoxzIndex={1000}
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
                gridWidth={350}
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
                searchBoxzIndex={1000}
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
                  id: "label.followup.NextActionDate",
                  defaultMessage: "Next Action Date",
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
                value={intl.formatMessage({ id: "label.followup.ShowLimit" })}
                colon={false}
                align="left"
                width="100%"
              />
              <HBox sx={dateFieldCellSx}>
                <HDatePicker
                  value={followupData.promiseStartDate}
                  onChange={(newVal) =>
                    setFollowupData((prev) => ({
                      ...prev,
                      promiseStartDate: newVal,
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
                  id: "label.followup.DelinquencyReason",
                  defaultMessage: "Delinquency reason",
                })}
                colon={false}
                align="left"
                width="100%"
              />
              <HDropdown
                value={followupData.delinquencyReason}
                onChange={updateField("delinquencyReason")}
                options={delinquencyReasonOptions}
                error={objErrors.delinquencyReason}
                sx={{ width: "100%" }}
                width="100%"
                placeholder={intl.formatMessage({
                  id: "label.followup.DelinquencyReason.placeholder",
                  defaultMessage: "Select delinquency reason",
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
              maxLines={3}
              placeholder={intl.formatMessage({
                id: "label.followup.NotesRemarks",
              })}
              translate={false}
            />
          </HBox>

          <HBox
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
              mb: 1.5,
              width: "100%",
            }}
          >
            <HBox sx={checkboxCellSx}>
              <HCheckBox
                checked={pickUpRequired}
                onChange={(e) => setPickUpRequired(e.target.checked)}
                align={ALIGNMENT.LEFT}
                label="label.followup.PickUpRequired"
              />
            </HBox>

            <HBox sx={checkboxCellSx}>
              <HCheckBox
                checked={isActive3}
                onChange={(e) => setIsActive3(e.target.checked)}
                align={ALIGNMENT.LEFT}
                label="label.followup.ApplyToAll"
              />
            </HBox>

            <HBox sx={{ ...checkboxCellSx, gap: 0.5 }}>
              <HCheckBox
                checked={isActive2}
                onChange={(e) => setIsActive2(e.target.checked)}
                align={ALIGNMENT.LEFT}
                label= {intl.formatMessage({ id: "label.followup.CustomerOnWatch" })}
                Icon={<VisibilityOutlinedIcon
                sx={{ fontSize: 13, color: "warning.main" }}
              />}
              />
            </HBox>

            <HBox
              sx={{ display: "flex", justifyContent: "flex-end", ml: "auto" }}
            >
              <HButton
                label="label.followup.promisePolicy"
                variant="text"
                size="small"
                startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 14 }} />}
                align="left"
                sx={{
                  textTransform: "none",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  minWidth: "fit-content",
                }}
              />
            </HBox>
          </HBox>
        </HBox>
      </HPaper>
      <Collapse in={isPtpResult} timeout="auto" unmountOnExit>
        <HBox
          sx={{
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Header (same style as Pickup/Record Followup) */}
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.1,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? alpha(t.palette.common.white, 0.04)
                  : alpha(t.palette.grey[900], 0.03),
            }}
          >
            <BoltOutlinedIcon sx={{ fontSize: 15, color: "primary.main" }} />
            <HLabel
              value={intl.formatMessage({
                id: "label.followup.section.promise",
                defaultMessage: "Promise to Pay (PTP)",
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
          </HBox>

          {/* Content */}
          <HBox sx={{ px: 2, pt: 1.5, pb: 1.5 }}>{promiseFields}</HBox>
        </HBox>
      </Collapse>
      <Collapse in={pickUpRequired} timeout="auto" unmountOnExit>
        <HBox
          sx={{
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            bgcolor: "background.paper",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <PickUp
            pickUpData={pickUpData}
            setPickUpData={setPickUpData}
            embedded
            addressTypeOptions={addressTypeOptions}
          />
        </HBox>
      </Collapse>
      <HBox sx={{ position: "relative", zIndex: 2000 }}>
        <HButtonBar
          onSave={handleSubmit}
          onReset={resetForm}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
}
