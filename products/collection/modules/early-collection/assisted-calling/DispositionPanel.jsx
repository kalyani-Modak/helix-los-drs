import React, { useCallback, useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { HBox, HLabel, HPaper, HDropdown, HTextField, HTextarea, HButton, SearchCommonBox, HDatePicker, HAxiosService, useToast } from "@helix/component-library";
import { gridActionDefObj, gridResultDefObj } from "../../../../common/components/SearchGridDefObj";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { FollowupAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { buildUpdateFollowupRequest } from "../followup/followupPayloadBuilders";
import { useAssistedCallingUI } from "./useAssistedCallingUI";
import { useLocation } from "react-router-dom";

/** Reusable label + field column wrapper */
const FieldCell = ({ label, children, required = false }) => (
  <HBox sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      minWidth: 0,
      width: "100%",
      background: "transparent",
    }}
  >
    <HLabel
      value={label}
      colon={false}
      align="left"
      required={required}
      translate
      sx={{ fontSize: 10, fontWeight: 500 }}
    />
    {children}
  </HBox>
);

const EMPTY_FORM = {
  nextAction: "",
  nextActionDate: "",
  promiseStartDate: "",
  promiseAmount: "",
  notes: "",
};

const extractSummaryText = (summary) => {
  if (Array.isArray(summary)) {
    return summary
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          return item?.text || item?.summary || item?.content || item?.value || "";
        }
        return "";
      })
      .filter(Boolean)
      .join(" | ");
  }

  return typeof summary === "string" ? summary : "";
};

const parseSummaryDate = (value) => {
  if (!value) return null;

  const trimmed = String(value).trim();
  const normalized = trimmed.toLowerCase();

  if (normalized === "today") return dayjs();
  if (normalized === "tomorrow") return dayjs().add(1, "day");

  const inDaysMatch = normalized.match(/in\s+(\d+)\s+days?/i);
  if (inDaysMatch) return dayjs().add(Number(inDaysMatch[1]), "day");

  const dateCandidates = [
    "YYYY-MM-DD",
    "DD/MM/YYYY",
    "DD-MM-YYYY",
    "MM/DD/YYYY",
    "YYYY/MM/DD",
    "D MMM YYYY",
    "D MMMM YYYY",
    "MMM D YYYY",
    "MMMM D YYYY",
  ];

  for (const format of dateCandidates) {
    const parsed = dayjs(trimmed, format, true);
    if (parsed.isValid()) return parsed;
  }

  return null;
};

const normalizeResultCode = (value) => {
  if (value == null) return "";

  const trimmed = String(value).trim();
  if (!trimmed) return "";

  const cleaned = trimmed.replace(/[^a-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) return "";

  let compactCode = "";

  if (words.length === 1) {
    compactCode = cleaned.slice(0, 5);
  } else {
    compactCode = words
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 5);
  }

  return compactCode.toUpperCase();
};

const parseAmountValue = (value) => {
  if (value == null) return null;

  const normalized = String(value)
    .toLowerCase()
    .replace(/[,$€£₹]/g, "")
    .trim();

  if (!normalized) return null;

  const amountMatch = normalized.match(/^([0-9]+(?:\.[0-9]+)?)\s*([kmb])?$/i);
  if (!amountMatch) return null;

  const baseAmount = Number(amountMatch[1]);
  if (!Number.isFinite(baseAmount)) return null;

  const unit = (amountMatch[2] || "").toLowerCase();
  const multiplier = unit === "k" ? 1000 : unit === "m" ? 1000000 : unit === "b" ? 1000000000 : 1;

  return baseAmount * multiplier;
};

const extractDispositionDataFromPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const disposition = payload?.disposition || payload?.data?.disposition || payload?.summary?.disposition || null;
  if (!disposition || typeof disposition !== "object") return null;

  const result = {};

  const resultCode = disposition?.result || disposition?.resultCode || disposition?.resultCodeValue || null;
  if (resultCode) {
    const normalizedResultCode = normalizeResultCode(resultCode);
    if (normalizedResultCode) {
      result.resultCode = normalizedResultCode;
    }
  }

  const nextAction = disposition?.nextAction || disposition?.action || disposition?.actionCode || null;
  if (nextAction) {
    result.nextAction = String(nextAction);
  }

  const promiseDateValue = disposition?.promiseStartDate || disposition?.promiseDate || disposition?.date || disposition?.nextActionDate || null;
  if (promiseDateValue) {
    const parsedDate = parseSummaryDate(String(promiseDateValue));
    if (parsedDate?.isValid()) {
      result.promiseStartDate = parsedDate;
      result.nextActionDate = parsedDate;
    }
  }

  const promiseAmount = disposition?.amount || disposition?.promiseAmount || null;
  if (promiseAmount) {
    result.promiseAmount = String(promiseAmount);
  }

  const notes = disposition?.notes || disposition?.reason || disposition?.summary || disposition?.szRemark || disposition?.remark || null;
  if (notes) {
    result.notes = String(notes);
    result.szRemark = String(notes);
  }

  const paymentSchedule = disposition?.paymentSchedule || disposition?.paymentScheduleList || null;
  if (paymentSchedule && Array.isArray(paymentSchedule) && paymentSchedule.length) {
    // normalize to { date, amount }
    const normalizedSchedule = paymentSchedule
      .map((it) => {
        if (!it) return null;
        const date = it.date || it.dtPromiseDate || it.promiseDate || it.promiseStartDate || null;
        const amount = it.amount ?? it.bdPromiseAmt ?? it.promiseAmount ?? null;
        if (!date) return null;
        return { date: String(date), amount: amount };
      })
      .filter(Boolean);

    result.paymentSchedule = normalizedSchedule;

    if (normalizedSchedule.length > 1) {
      const totalPromiseAmount = normalizedSchedule.reduce((sum, row) => {
        const numericAmount = parseAmountValue(row?.amount);
        return Number.isFinite(numericAmount) ? sum + numericAmount : sum;
      }, 0);

      if (totalPromiseAmount > 0) {
        result.promiseAmount = String(totalPromiseAmount);
      }
    }
  }

  return Object.keys(result).length ? result : null;
};

const extractFollowupDataFromSummary = (summary) => {
  const summaryText = extractSummaryText(summary);
  if (!summaryText) return null;

  const result = {};

  const amountMatch = summaryText.match(/(?:ptp|promise|payment|amount|amt)[^\d$€£₹]*([\$€£₹]?\s*[0-9][0-9,]*(?:\.\d{1,2})?)/i);
  if (amountMatch) {
    result.promiseAmount = amountMatch[1].replace(/,/g, "").trim();
  }

  const promiseDateMatch = summaryText.match(/(?:promise|ptp|payment|due|next action|follow[- ]?up|callback|call back)[^\d]{0,20}(\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[a-z]+\s+\d{1,2},?\s+\d{4}|today|tomorrow|in\s+\d+\s+days?)/i);
  if (promiseDateMatch) {
    const parsedDate = parseSummaryDate(promiseDateMatch[1]);
    if (parsedDate?.isValid()) {
      result.promiseStartDate = parsedDate;
    }
  }

  const nextActionDateMatch = summaryText.match(/(?:next action|follow[- ]?up|callback|call back|date)[^\d]{0,20}(\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{4}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[a-z]+\s+\d{1,2},?\s+\d{4}|today|tomorrow|in\s+\d+\s+days?)/i);
  if (nextActionDateMatch) {
    const parsedDate = parseSummaryDate(nextActionDateMatch[1]);
    if (parsedDate?.isValid()) {
      result.nextActionDate = parsedDate;
    }
  }

  if (/\bptp\b|promise to pay|promise/i.test(summaryText)) {
    result.resultCode = "PTP";
  }

  if (!result.notes) {
    result.notes = summaryText;
  }

  return Object.keys(result).length ? result : null;
};

/**
 * Disposition panel — lets the agent record the call outcome.
 * Uses the same API flow as QuickFollowupDetails (FollowupAPI.updateFollowup).
 *
 * @param {object}   props
 * @param {function} [props.onSave]  – called after successful save
 * @param {function} [props.onReset] – called after Reset button clicked
 */
const DispositionPanel = ({ onSave, onReset, summary = [], resetKey = 0, nextActionData = null }) => {
  const intl = useIntl();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);
  const { resetDisposition, callActive } = useAssistedCallingUI();

  // ── Field state ──────────────────────────────────────────────────────
  const [actionCode, setActionCode] = useState("");
  const [resultCode, setResultCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [followupData, setFollowupData] = useState(EMPTY_FORM);
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const [objErrors, setObjErrors] = useState({
    action: false,
    result: false,
    promiseStartDate: false,
    promiseAmount: false,
  });

  // editable promises to send to API (matches lstPromiseDetailsDtos shape in Followup)
  const [generatedPromises, setGeneratedPromises] = useState([]);
  const [paymentSchedule, setPaymentSchedule] = useState([]);
  const [disableUntilCallStart, setDisableUntilCallStart] = useState(false);

  const summaryText = extractSummaryText(summary);

  useEffect(() => {
    if (resetKey > 0) {
      handleReset();
      return;
    }
  }, [resetKey]);

  useEffect(() => {
    const parsedDispositionData = extractDispositionDataFromPayload(nextActionData);
    const parsedSummaryData = !parsedDispositionData ? extractFollowupDataFromSummary(summaryText) : null;
    const sourceData = parsedDispositionData || parsedSummaryData;
    if (!sourceData) return;

    setFollowupData((prev) => {
      const nextValue = { ...prev };
      if (!prev.promiseAmount && sourceData.promiseAmount) {
        nextValue.promiseAmount = sourceData.promiseAmount;
      }
      if (!prev.promiseStartDate && sourceData.promiseStartDate) {
        nextValue.promiseStartDate = sourceData.promiseStartDate;
      }
      if (!prev.nextActionDate && sourceData.nextActionDate) {
        nextValue.nextActionDate = sourceData.nextActionDate;
      }
      if (!prev.notes && sourceData.notes) {
        nextValue.notes = sourceData.notes;
      }
      return nextValue;
    });

    if (!resultCode && sourceData.resultCode) {
      const normalizedResultCode = normalizeResultCode(sourceData.resultCode);
      if (normalizedResultCode) {
        setResultCode(normalizedResultCode);
        clearFieldError("result");
      }
    }

    if (!actionCode && sourceData.nextAction) {
      clearFieldError("action");
    }

    // if disposition provided a paymentSchedule, initialize editable promises
    if (parsedDispositionData && Array.isArray(parsedDispositionData.paymentSchedule)) {
      const ps = parsedDispositionData.paymentSchedule.map((p) => ({
        date: p.date,
        amount: p.amount,
      }));
      setPaymentSchedule(ps);
      const initial = ps.map((p) => ({
        dtPromiseDate: p.date && dayjs(p.date).isValid() ? dayjs(p.date) : p.date,
        bdPromiseAmt: p.amount ?? "",
      }));
      setGeneratedPromises(initial);
      // populate first promise fields if not already set
      if (!followupData.promiseStartDate && parsedDispositionData.paymentSchedule[0]?.date) {
        const d = parsedDispositionData.paymentSchedule[0].date;
        const parsed = parseSummaryDate(d) || dayjs(d);
        if (parsed?.isValid()) setFollowupData((prev) => ({ ...prev, promiseStartDate: parsed }));
      }
      if (!followupData.promiseAmount) {
        if (parsedDispositionData.promiseAmount) {
          setFollowupData((prev) => ({ ...prev, promiseAmount: parsedDispositionData.promiseAmount }));
        } else if (parsedDispositionData.paymentSchedule[0]?.amount) {
          setFollowupData((prev) => ({ ...prev, promiseAmount: parsedDispositionData.paymentSchedule[0].amount }));
        }
      }
    }
  }, [nextActionData, summaryText, resultCode, actionCode]);

  // ── Derived: is the selected result a PTP? ───────────────────────────
  const isPtpResult = String(resultCode || "")
    .toUpperCase()
    .includes("PTP");

  // Clear PTP-related errors when result changes away from PTP
  useEffect(() => {
    if (isPtpResult) return;
    setObjErrors((prev) => ({
      ...prev,
      promiseStartDate: false,
      promiseAmount: false,
    }));
  }, [isPtpResult]);

  // ── Helpers ──────────────────────────────────────────────────────────
  const clearFieldError = (field) => {
    setObjErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  const updateField = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setFollowupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResultSelect = (value, row) => {
    setResultCode(value);
    if (value) clearFieldError("result");

    // Auto-fill promise date based on iNextActionLimitDays if present
    const rawDays = row?.iNextActionLimitDays;
    const limitDays = Number(rawDays);
    if (
      rawDays !== undefined &&
      rawDays !== null &&
      String(rawDays).trim() !== "" &&
      Number.isFinite(limitDays)
    ) {
      setFollowupData((prev) => ({
        ...prev,
        promiseStartDate: dayjs(new Date()).add(limitDays, "day"),
      }));
      clearFieldError("promiseStartDate");
    } else {
      setFollowupData((prev) => ({ ...prev, promiseStartDate: "" }));
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setActionCode("");
    setResultCode("");
    setFollowupData(EMPTY_FORM);
    setObjErrors({ action: false, result: false, promiseStartDate: false, promiseAmount: false });
    resetDisposition();
    if (typeof onReset === "function") onReset();
  };

  // ── Save / submit ─────────────────────────────────────────────────────
  const handleSave = async () => {
    const nextErrors = {
      result: !resultCode,
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
      return;
    }

    // Auto-populate generatedPromises for PTP results
    let promisesToSend = [];
    if (isPtpResult && followupData.promiseStartDate && followupData.promiseAmount) {
      // prefer explicit editable generatedPromises state when user modified schedule
      if (generatedPromises && generatedPromises.length) {
        promisesToSend = generatedPromises.map((p) => ({
          dtPromiseDate: p.dtPromiseDate && typeof p.dtPromiseDate.format === "function" ? p.dtPromiseDate.format("YYYY-MM-DD") : p.dtPromiseDate,
          bdPromiseAmt: p.bdPromiseAmt,
        }));
      } else if (paymentSchedule && paymentSchedule.length) {
        promisesToSend = paymentSchedule.map((p) => ({
          dtPromiseDate: p.date && dayjs(p.date).isValid() ? dayjs(p.date).format("YYYY-MM-DD") : p.date,
          bdPromiseAmt: p.amount,
        }));
      } else {
        promisesToSend = [
          {
            dtPromiseDate:
              followupData.promiseStartDate && typeof followupData.promiseStartDate.format === "function"
                ? followupData.promiseStartDate.format("YYYY-MM-DD")
                : followupData.promiseStartDate,
            bdPromiseAmt: followupData.promiseAmount,
          },
        ];
      }
    }

    const requestData = buildUpdateFollowupRequest({
      selectedRow,
      actionCode,
      resultCode,
      followupData,
      summary: summaryText,
      pickUpRequired: false,
      pickUpData: {},
      generatedPromises: promisesToSend,
      nextActionPayload: nextActionData,
    });

    try {
      setLoading(true);
      const res = await HAxiosService.POST(FollowupAPI.Followup(screenMenuId) + `/updateFollowup`, requestData);
      if (res.data?.status?.toLowerCase() === "success") {
        toast.success(
          res.data.msg ||
          intl.formatMessage({
            id: "label.followup.saveSuccess",
            defaultMessage: "Followup saved successfully",
          }),
        );
        handleReset();
        // disable Save until a new call is started
        setDisableUntilCallStart(true);
        if (typeof onSave === "function") onSave();
      } else {
        toast.error(
          res.data?.msg ||
          intl.formatMessage({
            id: "label.followup.saveFailed",
            defaultMessage: "Failed to save followup",
          }),
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "label.followup.saveError",
          defaultMessage: "Error saving followup",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  // Re-enable Save when a call is started
  useEffect(() => {
    if (callActive) {
      setDisableUntilCallStart(false);
    }
  }, [callActive]);

  // ── Date picker sx ────────────────────────────────────────────────────
  const dateFieldSx = {
    minWidth: 0,
    width: "100%",
    "& .MuiTextField-root": { width: "100% !important" },
    "& .MuiInputBase-root": { fontSize: "0.85rem" },
    "& .MuiInputLabel-root": { fontSize: "0.85rem" },
    "& .MuiSvgIcon-root": { fontSize: "1.1rem" },
  };

  return (
    <HPaper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          background: "transparent",
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
        <HLabel
          value="label.assistedCalling.disposition"
          colon={false}
          align="left"
          sx={{ fontSize: 12, fontWeight: 700 }}
          translate
        />
      </HBox>

      {/* Row 1: Result | PTP Amount | PTP Date */}
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 1,
          mb: 1,
        }}
      >
        <FieldCell label="label.followup.Result" required>
          <HTextField
            value={resultCode}
            onChange={(event) => {
              const nextValue = event?.target?.value ?? "";
              setResultCode(nextValue);
              if (nextValue) clearFieldError("result");
            }}
            placeholder={intl.formatMessage({
              id: "label.followup.Result",
              defaultMessage: "Result",
            })}
            editable
            width="100%"
          />
        </FieldCell>

        {/* PTP Amount — always visible, not required */}
        <FieldCell label="label.assistedCalling.ptpAmount">
          <HTextField
            value={followupData.promiseAmount}
            onChange={updateField("promiseAmount")}
            type="number"
            placeholder={intl.formatMessage({
              id: "label.assistedCalling.ptpAmount",
              defaultMessage: "PTP Amount",
            })}
            editable
            width="100%"
          />
        </FieldCell>

        {/* PTP Date — always visible, not required */}
        <FieldCell label="label.assistedCalling.ptpDate">
          <HBox sx={dateFieldSx}>
            <HDatePicker
              value={followupData.promiseStartDate}
              onChange={(newVal) =>
                setFollowupData((prev) => ({ ...prev, promiseStartDate: newVal }))
              }
              sx={{ width: "100%" }}
              width="100%"
            />
          </HBox>
        </FieldCell>
      </HBox>

      {/* Row 2: Next Action | Next Action Date */}
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          mb: 1,
        }}
      >
        <FieldCell label="label.followup.NextAction">
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
        </FieldCell>

        <FieldCell label="label.followup.NextActionDate">
          <HBox sx={dateFieldSx}>
            <HDatePicker
              value={followupData.nextActionDate}
              onChange={(newVal) =>
                setFollowupData((prev) => ({ ...prev, nextActionDate: newVal }))
              }
              sx={{ width: "100%" }}
              width="100%"
            />
          </HBox>
        </FieldCell>
      </HBox>

      {/* PTP Schedule (editable rows) */}
      {isPtpResult && (
        <>
          <HBox sx={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 1, mb: 1 }}>
            <HLabel value={intl.formatMessage({ id: "label.followup.promiseDetails", defaultMessage: "Promise Details" })} colon={false} align="left" />
            <HBox />
            <HButton
              label={intl.formatMessage({ id: "label.followup.promise.addRow" })}
              size="small"
              variant="outlined"
              onClick={() => setGeneratedPromises((prev) => [...prev, { dtPromiseDate: dayjs(), bdPromiseAmt: "" }])}
            />
          </HBox>

          {generatedPromises.length === 0 ? (
            <div style={{ textAlign: "center", color: "#666", padding: 8 }}>{intl.formatMessage({ id: "label.followup.promise.emptyState" })}</div>
          ) : (
            generatedPromises.map((row, index) => (
              <HBox key={index} sx={{ display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 1, mb: 1 }}>
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
                  placeholder={intl.formatMessage({ id: "label.followup.ptpCol.amount", defaultMessage: "Amount" })}
                  width="100%"
                />

                <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconButton
                    aria-label={intl.formatMessage({ id: "label.followup.promise.delete", defaultMessage: "Delete" })}
                    onClick={() => setGeneratedPromises((prev) => prev.filter((_, i) => i !== index))}
                    size="small"
                    sx={{ color: "error.main" }}
                  >
                    &times;
                  </IconButton>
                </HBox>
              </HBox>
            ))
          )}
        </>
      )}

      {/* Row 3: Notes — full width */}
      <HBox sx={{ mb: 1 }}>
        <FieldCell label="label.followup.NotesRemarks">
          <HTextarea
            value={followupData.notes}
            onChange={updateField("notes")}
            placeholder={intl.formatMessage({
              id: "label.followup.NotesRemarks",
              defaultMessage: "Notes / remarks",
            })}
            maxLines={2}
            translate={false}
            width="100%"
          />
        </FieldCell>
      </HBox>

      {/* Action buttons */}
      <HBox sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <HButton
          label="common.buttonBar.reset"
          size="small"
          variant="outlined"
          startIcon={<RestartAltOutlinedIcon sx={{ fontSize: 14 }} />}
          onClick={handleReset}
          inline
        />
        <HButton
          label="button.save"
          size="small"
          variant="contained"
          startIcon={<SaveOutlinedIcon sx={{ fontSize: 14 }} />}
          onClick={handleSave}
          disabled={loading || disableUntilCallStart}
          inline
        />
      </HBox>
    </HPaper>
  );
};

export default DispositionPanel;
