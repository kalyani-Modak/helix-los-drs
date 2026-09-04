// GroupFollowupForm.jsx - Updated with checkbox alignment fixed
import React, { useCallback, useEffect, useState } from "react";
import { Button, Collapse, Divider, IconButton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Call from "@mui/icons-material/Call";
import PhoneMissed from "@mui/icons-material/PhoneMissed";
import PhoneDisabled from "@mui/icons-material/PhoneDisabled";
import Smartphone from "@mui/icons-material/Smartphone";
import Block from "@mui/icons-material/Block";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HCheckBox, HDatePicker, HDropdown, HLabel, HPaper, HTextField, HTextarea, SearchCommonBox, useToast } from "@helix/component-library";

import { FollowupAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { formatDateTimeForApi } from "./followupPayloadBuilders";
import { useLocation } from "react-router-dom";

const DISPOSITION_IDS = {
  connected:    "connected",
  no_answer:    "no_answer",
  busy:         "busy",
  switched_off: "switched_off",
  refused:      "refused",
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
    case "success": return theme.palette.success;
    case "warning": return theme.palette.warning;
    case "error":   return theme.palette.error;
    default:        return theme.palette.primary;
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
              ? intl.formatMessage({ id: item.szi18nDesc, defaultMessage: item.szCondition })
              : item.szDesc ?? item.szCondition,
          }
        : null;
    })
    .filter(Boolean);
}

export default function GroupFollowupForm({
  selectedAccounts = [],
  onSuccess,
  onCancel,
}) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();

  const [pickUpRequired, setPickUpRequired] = useState(false);
  const [customerOnWatch, setCustomerOnWatch] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState("");
  const [actionCode, setActionCode] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [generatedPromises, setGeneratedPromises] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const [followupData, setFollowupData] = useState({
    nextAction: "", plannedDate: "", promiseStartDate: "", frequency: "",
    promiseAmount: "", numberOfPromises: "", delinquencyReason: "",
        bestTimeToCall: "",  
  });
  const [partyContactedOptions, setPartyContactedOptions] = useState([]);
  const [delinquencyReasonOptions, setDelinquencyReasonOptions] = useState([]);
  const [objErrors, setObjErrors] = useState({
    action: false, result: false, delinquencyReason: false,
    promiseStartDate: false, frequency: false, promiseAmount: false, numberOfPromises: false,
  });
  const [pickUpData, setPickUpData] = useState({
    szVisitFor: "", szAddressType: "", szContactPerson: "", dtVisitDate: "",
    szPhone: "", szMobile: "", szPickupCollectorGrp: "", szPickupCollector: "",
    bdVisitForAmt: "", szAddress: "",
  });

  const fetchFollowupDropdowns = useCallback(async () => {
    try {
      const response = await HAxiosService.GET(FollowupAPI.Followup(screenMenuId)+`/initializeddropdowns`, {});
      const payload = response?.data?.responseJson || response?.data?.data || response?.data || {};
      setPartyContactedOptions(mapFollowupDropdownOptions(payload.lstPartyContacted, intl));
      setDelinquencyReasonOptions(mapFollowupDropdownOptions(payload.lstDelqReason, intl));
    } catch (error) {
      console.error("Error fetching followup dropdowns:", error);
      toast.error(intl.formatMessage({ id: "error.followup.dropdown.fetch", defaultMessage: "Error fetching dropdown values." }));
    }
  }, [intl, toast]);

  useEffect(() => { fetchFollowupDropdowns(); }, [fetchFollowupDropdowns]);

  useEffect(()=>{

    console.log("GoupFollowupForm ==============================================",screenMenuId);
  },[])

 useEffect(() => {
      if (!selectedDisposition) {
        setActionCode("");
        setResultCode("");
        setFollowupData((prev) => ({ ...prev, nextAction: "", plannedDate: "" }));
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
      plannedDate: addDaysToDate(new Date(), sug.daysAhead),
      }));
    }, [selectedDisposition]);

  const clearFieldError = (field) =>
    setObjErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));

  const isBlank = (v) =>
    v === null || v === undefined || v === "" || (typeof v === "string" && v.trim() === "");

  const updateField = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setFollowupData((prev) => ({ ...prev, [field]: value }));
    if (!isBlank(value)) clearFieldError(field);
  };

  const handleResultSelect = (value, row) => {
    setResultCode(value);
    if (value) clearFieldError("result");
    const rawLimit = row?.iNextActionLimitDays;
    const limit = Number(rawLimit);
    if (rawLimit != null && String(rawLimit).trim() !== "" && Number.isFinite(limit)) {
      setFollowupData((prev) => ({ ...prev, promiseStartDate: addDaysToDate(new Date(), limit) }));
      clearFieldError("promiseStartDate");
    } else {
      setFollowupData((prev) => ({ ...prev, promiseStartDate: "" }));
    }
  };

  const isPtpResult = String(resultCode || "").toUpperCase().includes("PTP");

 // UPDATED: buildBulkPayload with EXACT same followupDto structure as single account
  const buildBulkPayload = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const dtResultFallback = `${y}-${m}-${d}`;

    // Format promises exactly like single account version
    const formattedPromises = generatedPromises.map((p) => ({
      dtPromiseDate: typeof p.dtPromiseDate?.format === "function"
        ? p.dtPromiseDate.format("YYYY-MM-DD")
        : p.dtPromiseDate,
      bdPromiseAmt: p.bdPromiseAmt,
    }));

    // Keep the accounts function EXACTLY as it is - no changes
    const accounts = selectedAccounts.map((account) => ({
      custSeqNo: account.CUST_SEQNO ?? account.custSeqNo ?? null,
      acctSeqNo: account.ACNT_SEQNO ?? account.acctSeqNo ?? account.lnAccountSeqNo ?? null,
      caseSeqNo: account.CASE_SEQNO ?? account.caseSeqNo ?? account.lnCaseSeqNo ?? null,
      allocSeqNo: account.ALLOC_SEQNO ?? account.allocSeqNo ?? account.lnAllocSeqNo ?? null,
      partitionCode: account.PARTITION_CODE ?? account.partitionCode ?? account.szPartitionCode ?? "001",
      userCode: account.userCode ?? account.szUserCode ?? "SYSTEM",
      portfolioCode: account.PRTFL ?? account.portfolioCode ?? account.szPortfolioCode ?? "",
    }));

    return {
      accounts,  // Array of accounts for bulk processing
      followupDto: {  
        szActionCode: actionCode,
        dtAction: formatDateTimeForApi(new Date()),
        szResultCode: resultCode,
        dtResultCode: dtResultFallback,
        szNextActionCode: followupData.nextAction || actionCode,
        dtNextAction: formatDateTimeForApi(followupData.plannedDate),
        szRemark: followupData.bestTimeToCall || "",
        szPartyContacted: followupData.partyContacted || "G",
        szModeContact: followupData.modeOfContact || "E",
        szPlaceContact: followupData.placeOfContact || "M",
        szPersonContacted: followupData.contactPerson || "A",
        szPartitionCode: "001",
        szLogedInUser: "ADMIN",
        szActivity: "FT2",
        szCollectorGrpCode: "T1",
        bdInstallmentODAmt: null,
        bdPaymentAmt: followupData.paymentAmount ? parseFloat(followupData.paymentAmount) : 20000,
        szApplytoAllAcc: applyToAll ? "Y" : "N",
        szPickUpReq: pickUpRequired ? "Y" : "N",
        szWatchFlag: customerOnWatch ? "Y" : "N",
        followupVisitRequestDto: pickUpRequired ? {
          szVisitReference: "10182",
          szVisitFor: pickUpData.szVisitFor || "",
          szContactPerson: pickUpData.szContactPerson || "",
          dtVisitDate: formatDateTimeForApi(pickUpData.dtVisitDate),
          bdVisitForAmt: pickUpData.bdVisitForAmt ? parseFloat(pickUpData.bdVisitForAmt) : "",
          szAddressType: pickUpData.szAddressType || "",
          szRemarks: "Pick up Required to collect the Amount",
          szPickupCollectorGrp: pickUpData.szPickupCollectorGrp || "",
          szPickupCollector: pickUpData.szPickupCollector || "",
          szAddress: pickUpData.szAddress || "",
        } : null,
        dtPromiseStartDate: followupData.promiseStartDate ? formatDateTimeForApi(followupData.promiseStartDate) : null,
        bdPromiseAmount: followupData.promiseAmount ? parseFloat(followupData.promiseAmount) : null,
        szPromiseFrequency: followupData.frequency || "",
        noOfPromises: followupData.numberOfPromises ? parseInt(followupData.numberOfPromises) : null,
        lstPromiseDetailsDtos: formattedPromises,
      },
    };
  };

  const validateAndSubmit = async () => {
    const nextErrors = {
      result: !resultCode,   
    };
    if ( nextErrors.result ) {
      setObjErrors((prev) => ({ ...prev, ...nextErrors }));
      toast.error(intl.formatMessage({
        id: "error.followup.missingFields",
        defaultMessage: "Result are required.",
      }));
      return;
    }

    const payload = buildBulkPayload();
    try {
      const response = await HAxiosService.POST(FollowupAPI.Followup(screenMenuId) + `/group-followup`, payload);
      if (response.status === 202 || response.data?.status === "Success") {
        toast.success(intl.formatMessage(
          { id: "message.followup.groupSaveSuccess", defaultMessage: "Followup initiated for {count} account(s)." },
          { count: selectedAccounts.length },
        ));
        if (onSuccess) onSuccess(selectedAccounts);
      } else {
        toast.error(response.data?.message ?? intl.formatMessage({ id: "error.followup.saveFailed" }));
      }
    } catch (err) {
      console.error("Bulk followup error:", err);
      toast.error(err?.response?.data?.message ?? intl.formatMessage({ id: "error.followup.saveFailed" }));
    }
  };

  const resetForm = () => {
    setPickUpRequired(false);
    setCustomerOnWatch(false);
    setApplyToAll(false);
    setActionCode("");
    setResultCode("");
    setSelectedDisposition("");
    setGeneratedPromises([]);
    setFollowupData({
      nextAction: "", plannedDate: "", promiseStartDate: "", frequency: "",
      promiseAmount: "", numberOfPromises: "", delinquencyReason: "",      bestTimeToCall: "", 
 partyContacted: "",
    });
    setObjErrors({ action: false, result: false, delinquencyReason: false });
    setPickUpData({
      szVisitFor: "", szAddressType: "", szContactPerson: "", dtVisitDate: "",
      szPhone: "", szMobile: "", szPickupCollectorGrp: "", szPickupCollector: "",
      bdVisitForAmt: "", szAddress: "",
    });
  };

  const recordPanelBorder = alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.3 : 0.18);

  const fieldGrid = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    gap: 1.5,
  };

  const fieldCellSx = { display: "flex", flexDirection: "column", minWidth: 0, width: "100%", gap: 0.5 };

  const dateFieldCellSx = {
    minWidth: 0, width: "100%",
    "& .MuiTextField-root": { width: "100% !important" },
    "& .MuiInputBase-root": { fontSize: "0.85rem" },
    "& .MuiInputLabel-root": { fontSize: "0.85rem" },
    "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
  };

  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": { width: "auto" },
    "& .hcheckbox-label": { margin: 0, width: "auto" },
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important", whiteSpace: "nowrap",
    },
    "& .hcheckbox-input": { paddingRight: "0px" },
  };

  const dispositionButtons = [
    { id: DISPOSITION_IDS.connected, labelId: "label.followup.disposition.connected", Icon: Call, tone: "success" },
    { id: DISPOSITION_IDS.no_answer, labelId: "label.followup.disposition.noAnswer", Icon: PhoneMissed, tone: "warning" },
    { id: DISPOSITION_IDS.busy, labelId: "label.followup.disposition.busy", Icon: PhoneDisabled, tone: "primary" },
    { id: DISPOSITION_IDS.switched_off, labelId: "label.followup.disposition.switchedOff", Icon: Smartphone, tone: "error" },
    { id: DISPOSITION_IDS.refused, labelId: "label.followup.disposition.refused", Icon: Block, tone: "error" },
  ];

  return (
    <HBox sx={{ width: "100%", boxSizing: "border-box", flexDirection: "column" }}>

      {/* Quick Disposition Bar */}
      {/* Quick Disposition Bar - Fixed wrapping and spacing */}
<HBox
  sx={{
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
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
    width: "100%",
    boxSizing: "border-box",
  }}
>
  <HLabel
    value={intl.formatMessage({ id: "label.followup.quickDispositionTitle", defaultMessage: "Quick Disposition" })}
    colon={false}
    translate={false}
    align="left"
    component="div"
    color={theme.palette.primary.main}
    sx={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}
  />

  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
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
      {/* Record Follow Up panel */}
      <HPaper
        variant="outlined"
        elevation={0}
        sx={{
          borderRadius: 1.5,
          overflow: "visible",
          borderColor: recordPanelBorder,
          boxShadow: `inset 0 0 0 1px ${recordPanelBorder}`,
          bgcolor: "background.paper",
        }}
      >
        <HBox sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 1.5, borderBottom: "1px solid #7472721a" }}>
          <NearMeOutlinedIcon sx={{ fontSize: 15, color: "primary.main" }} />
          <HLabel
            value={intl.formatMessage({ id: "label.followup.recordTitle", defaultMessage: "Record Follow Up" })}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.15, color: "var(--drs-text-primary)" }}
          />
        </HBox>

        <HBox sx={{ px: 2, pt: 1.5, pb: 1.5, overflow: "visible", position: "relative" }}>
          {/* Row 1: Result, Next Action, Party Contacted */}
          <HBox sx={{ ...fieldGrid, mb: 1.5 }}>
            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" })}
                required colon={false} align="left" width="100%" />
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
                placeholder={intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" })}
                 popperSx={{ zIndex: 1400 }}  // MUI Dialog modal is 1300, so 1400 works
                  gridContainerSx={{ zIndex: 1400 }}
              />
            </HBox>

            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.NextAction", defaultMessage: "Next action" })}
                colon={false} align="left" width="100%"  />
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
                placeholder={intl.formatMessage({ id: "label.followup.NextAction", defaultMessage: "Next Action" })}
              popperSx={{ zIndex: 1400 }}  // MUI Dialog modal is 1300, so 1400 works
              gridContainerSx={{ zIndex: 1400 }}
              />
            </HBox>

            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.PartyContacted", defaultMessage: "Party contacted" })}
                colon={false} align="left" width="100%" />
              <HDropdown
                value={followupData.partyContacted}
                onChange={updateField("partyContacted")}
                options={partyContactedOptions}
                sx={{ width: "100%" }}
                width="100%"
                placeholder={intl.formatMessage({ id: "label.followup.PartyContacted.placeholder", defaultMessage: "Select party contacted" })}
              />
            </HBox>
          </HBox>

          {/* Row 2: Planned Date, Show Limit, Delinquency Reason */}
          <HBox sx={{ ...fieldGrid, mb: 1.5 }}>
            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.PlannedDate", defaultMessage: "Planned date" })}
                colon={false} align="left" width="100%" />
              <HBox sx={dateFieldCellSx}>
                <HDatePicker
                  value={followupData.plannedDate}
                  onChange={(newVal) => setFollowupData((prev) => ({ ...prev, plannedDate: newVal }))}
                  align={ALIGNMENT.DATE}
                  sx={{ width: "100%" }}
                  width="100%"
                />
              </HBox>
            </HBox>

            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.ShowLimit" })}
                colon={false} align="left" width="100%" />
              <HBox sx={dateFieldCellSx}>
                <HDatePicker
                  value={followupData.promiseStartDate}
                  onChange={(newVal) => setFollowupData((prev) => ({ ...prev, promiseStartDate: newVal }))}
                  align={ALIGNMENT.DATE}
                  sx={{ width: "100%" }}
                  width="100%"
                />
              </HBox>
            </HBox>

            <HBox sx={fieldCellSx}>
              <HLabel value={intl.formatMessage({ id: "label.followup.DelinquencyReason", defaultMessage: "Delinquency reason" })}
                 colon={false} align="left" width="100%" />
              <HDropdown
                value={followupData.delinquencyReason}
                onChange={updateField("delinquencyReason")}
                options={delinquencyReasonOptions}
                sx={{ width: "100%" }}
                width="100%"
                placeholder={intl.formatMessage({ id: "label.followup.DelinquencyReason.placeholder", defaultMessage: "Select delinquency reason" })}
              />
            </HBox>
          </HBox>

          {/* Row 3: Notes / Remarks + Checkboxes - Fixed alignment */}
          {/* Row 3: Notes / Remarks + Checkboxes */}
<HBox sx={{ ...fieldGrid, mb: 1.5, alignItems: "center" }}>
  {/* Notes/Remarks - takes 2 columns */}
  <HBox sx={{ gridColumn: { xs: "1", md: "span 2" }, ...fieldCellSx }}>
    <HLabel
      value={intl.formatMessage({ id: "label.followup.NotesRemarks", defaultMessage: "Notes / remarks" })}
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

  {/* Checkboxes container - vertically centered with Notes */}
  <HBox sx={{ ...fieldCellSx, justifyContent: "center" }}>
    <Stack direction="column" spacing={1.5}>
      <HBox sx={checkboxCellSx}>
        <HCheckBox
          checked={applyToAll}
          onChange={(e) => setApplyToAll(e.target.checked)}
          align={ALIGNMENT.LEFT}
          label="label.followup.ApplyToAll"
        />
      </HBox>
      <HBox sx={checkboxCellSx}>
        <HCheckBox
          checked={customerOnWatch}
          onChange={(e) => setCustomerOnWatch(e.target.checked)}
          align={ALIGNMENT.LEFT}
          label={intl.formatMessage({ id: "label.followup.CustomerOnWatch" })}
        />
      </HBox>
    </Stack>
  </HBox>
</HBox>
        </HBox>
      </HPaper>

      {/* PTP section */}
      <Collapse in={isPtpResult} timeout="auto" unmountOnExit>
        <HBox sx={{ mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}>
          <HBox sx={{
            display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.1,
            borderBottom: "1px solid", borderColor: "divider",
            bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[900], 0.03),
          }}>
            <BoltOutlinedIcon sx={{ fontSize: 15, color: "primary.main" }} />
            <HLabel
              value={intl.formatMessage({ id: "label.followup.section.promise", defaultMessage: "Promise to Pay (PTP)" })}
              colon={false}
              translate={false}
              align="left"
              component="div"
              sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.15, color: "var(--drs-text-primary)" }}
            />
          </HBox>
          <HBox sx={{ px: 2, pt: 1.5, pb: 1.5 }}>
            <HBox sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 1.5, alignItems: "flex-end", mb: 1.5 }}>
              <HBox sx={fieldCellSx}>
                <HLabel value="Start Date" required colon={false} align="left" />
                <HDatePicker
                  value={followupData.promiseStartDate}
                  onChange={(v) => { setFollowupData((p) => ({ ...p, promiseStartDate: v })); if (v) clearFieldError("promiseStartDate"); }}
                  error={objErrors.promiseStartDate}
                  sx={{ width: "100%" }}
                />
              </HBox>
              <HBox sx={fieldCellSx}>
                <HLabel value="Frequency" required colon={false} align="left" />
                <HDropdown
                  value={followupData.frequency}
                  onChange={updateField("frequency")}
                  error={objErrors.frequency}
                  options={[
                    { value: "", label: "Select" },
                    { value: "WEEKLY", label: "Weekly" },
                    { value: "MONTHLY", label: "Monthly" },
                  ]}
                  sx={{ width: "100%" }}
                />
              </HBox>
              <HBox sx={fieldCellSx}>
                <HLabel value="Amount" required colon={false} align="left" />
                <HTextField
                  value={followupData.promiseAmount}
                  onChange={updateField("promiseAmount")}
                  error={objErrors.promiseAmount}
                  placeholder="Amount"
                />
              </HBox>
              <HBox sx={fieldCellSx}>
                <HLabel value="No. of Promises" required colon={false} align="left" />
                <HTextField
                  value={followupData.numberOfPromises}
                  onChange={updateField("numberOfPromises")}
                  error={objErrors.numberOfPromises}
                  placeholder="Count"
                />
              </HBox>
              <HButton
                label="Generate"
                variant="contained"
                onClick={() => {
                  const start = followupData.promiseStartDate ? dayjs(followupData.promiseStartDate) : null;
                  const count = Number(followupData.numberOfPromises || 0);
                  const amount = Number(followupData.promiseAmount || 0);
                  if (!start || !count || !amount) {
                    toast.error("Please fill all promise fields");
                    return;
                  }
                  const promises = [];
                  let current = start;
                  for (let i = 0; i < count; i++) {
                    promises.push({ dtPromiseDate: current, bdPromiseAmt: amount });
                    current = followupData.frequency === "WEEKLY" ? current.add(7, "day") : current.add(1, "month");
                  }
                  setGeneratedPromises(promises);
                }}
              />
            </HBox>
            {generatedPromises.map((row, index) => (
              <HBox key={index} sx={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 1, mb: 1 }}>
                <HDatePicker
                  value={row.dtPromiseDate}
                  sx={{ width: "100%" }}
                  onChange={(val) => { const u = [...generatedPromises]; u[index].dtPromiseDate = val; setGeneratedPromises(u); }}
                />
                <HTextField
                  value={row.bdPromiseAmt}
                  placeholder="Amount"
                  width="100%"
                  onChange={(e) => { const u = [...generatedPromises]; u[index].bdPromiseAmt = e.target.value; setGeneratedPromises(u); }}
                />
                <IconButton
                  size="small"
                  onClick={() => setGeneratedPromises((p) => p.filter((_, i) => i !== index))}
                  sx={{ color: "error.main", border: "1px solid", borderColor: "error.light", borderRadius: 1, width: 30, height: 30 }}
                >
                  <DeleteOutline sx={{ fontSize: 18 }} />
                </IconButton>
              </HBox>
            ))}
          </HBox>
        </HBox>
      </Collapse>

      {/* HButtonBar for footer buttons */}
      <HBox sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <HButtonBar
          onSave={validateAndSubmit}
          onReset={resetForm}
          onClose={onCancel}
        />
      </HBox>
    </HBox>
  );
}
