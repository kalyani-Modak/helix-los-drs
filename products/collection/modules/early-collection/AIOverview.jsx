import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Chip, CircularProgress, Stack, alpha, useTheme } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SchoolIcon from "@mui/icons-material/School";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, HBox, HLabel, HPaper, OverviewSectionCard, useDrsTheme, useToast } from "@helix/component-library";

import { AIPredictAPI } from "./apiEndpoints";

import {
  formatDate,
} from "./account-overview/overviewApiHelpers.js";
import OverviewMetricsCards from "./components/OverviewMetricsCards.jsx";
import { Insights } from "@mui/icons-material";
const TIMELINE_ICONS = [AccessTimeIcon, AttachMoneyIcon, ErrorOutlineIcon, SchoolIcon, CardGiftcardIcon];
const TIMELINE_COLORS = ["#f44336", "#ff9800", "#ff5252", "#6d5dfc", "#ff8a50"];

function firstDefined(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function toNumberOrValue(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : value;
}

function toPercent(value) {
  const numeric = typeof value === "string" ? Number(value.replace("%", "").trim()) : Number(value);
  if (!Number.isFinite(numeric)) return null;
  const percent = numeric > 0 && numeric <= 1 ? numeric * 100 : numeric;
  return Math.max(0, Math.min(100, Math.round(percent)));
}


function normalizeTimeline(payload, formatMessage) {
  const raw =
    payload?.timeline ||
    payload?.journey ||
    payload?.factors ||
    payload?.reason ||
    payload?.reasons ||
    payload?.risk_factors;

  if (!Array.isArray(raw) || raw.length === 0) return [];

  return raw.map((item, index) => {
    const fallbackRiskDriver = formatMessage
      ? formatMessage(
          {
            id: "label.aiPrediction.riskDriverFallback",
            defaultMessage: "Risk driver {index}",
          },
          { index: index + 1 },
        )
      : `Risk driver ${index + 1}`;
    const text =
      typeof item === "string"
        ? item
        : item?.text || item?.description || item?.reason || item?.title || item?.message || fallbackRiskDriver;

    return {
      text,
      icon: TIMELINE_ICONS[index % TIMELINE_ICONS.length],
      color: item?.color || TIMELINE_COLORS[index % TIMELINE_COLORS.length],
    };
  });
}

function normalizePrediction(payload, formatMessage) {
  if (!payload || typeof payload !== "object") return null;
  const source = payload;
  const probability = toPercent(
    firstDefined(source, [
      "payment_probability",
      "paymentProbability",
      "paymentProb",
      "probability",
      "score",
      "risk_score",
      "riskScore",
    ]),
  );
  const riskLevel =
    firstDefined(source, ["risk_level", "riskLevel", "level"]);
  const recommendedAction =
    firstDefined(source, [
      "recommended_action",
      "recommendedAction",
      "action",
      "next_best_action",
      "nextBestAction",
    ]);
  const confidence = toPercent(firstDefined(source, ["action_confidence", "confidence", "confidence_score", "confidenceScore"]));

  return {
    probability,
    riskLevel: riskLevel ? String(riskLevel).toUpperCase() : "",
    recommendedAction: recommendedAction ? String(recommendedAction).toUpperCase() : "",
    confidence,
    timeline: normalizeTimeline(source, formatMessage),
  };
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function flattenObject(value, prefix = "") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      return flattenObject(child, nextKey);
    }
    return [{ key: nextKey, value: child }];
  });
}

function RiskGauge({ value }) {
  const theme = useTheme();
  const intl = useIntl();
  const { mode } = useDrsTheme();
  const gaugeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const gaugeColor = gaugeValue >= 70 ? theme.palette.success.main : gaugeValue >= 40 ? theme.palette.warning.main : theme.palette.error.main;
  const trackColor = alpha(theme.palette.divider, mode === "dark" ? 0.42 : 0.26);
  const needleAngle = -105 + gaugeValue * 2.1;
  const [animatedNeedleAngle, setAnimatedNeedleAngle] = useState(-105);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimatedNeedleAngle(needleAngle);
    });
    return () => cancelAnimationFrame(frame);
  }, [needleAngle]);

  return (
    <HBox
      sx={{ width: "100%", maxWidth: 160, ml: 0, mr: "auto", pt: 0.4 }}
      aria-label={intl.formatMessage(
        {
          id: "label.aiPrediction.paymentProbabilityAria",
          defaultMessage: "Payment probability {value}%",
        },
        { value: gaugeValue },
      )}
    >
      <HBox sx={{ position: "relative", height: 86, overflow: "hidden" }}>
        <HBox
          sx={{
            height: 160,
            borderRadius: "50%",
            background: `conic-gradient(from 255deg, ${theme.palette.error.main} 0deg, ${theme.palette.warning.main} 78deg, ${theme.palette.success.main} 210deg, ${trackColor} 210deg)`,
            HBoxShadow: `inset 0 0 0 1px ${alpha(theme.palette.divider, 0.55)}`,
          }}
        />
        <HBox
          sx={{
            position: "absolute",
            inset: 13,
            bottom: -82,
            borderRadius: "50%",
            bgcolor: "background.paper",
          }}
        />
        <HBox
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 12,
            width: 4,
            height: 58,
            borderRadius: 999,
            bgcolor: gaugeColor,
            transformOrigin: "50% 100%",
            transform: `translateX(-50%) rotate(${animatedNeedleAngle}deg)`,
            transition: "transform 950ms cubic-bezier(0.22, 1, 0.36, 1)",
            boxShadow: `0 0 12px ${alpha(gaugeColor, mode === "dark" ? 0.5 : 0.35)}`,
          }}
        />
        <HBox
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 6,
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: gaugeColor,
            transform: "translateX(-50%)",
            border: `2px solid ${theme.palette.background.paper}`,
          }}
        />
      </HBox>
      <HLabel align="center" colon={false} value={value == null ? "-" : `${value}%`} sx={{ mt: -0.2, color: gaugeColor, fontSize: 15, fontWeight: 800 }} />
    </HBox>
  );
}

function CenterMetric({ label, children }) {
  const { action, border } = useDrsTheme();
  return (
    <HBox
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: 1.25,
        border: "1px solid",
        borderColor: border.divider,
        bgcolor: action.hover,
        px: 1,
        py: 0.6,
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}
    >
      <HLabel colon={false} value={label} sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", letterSpacing: 0.15 }} />
      <HBox sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", minHeight: 20 }}>
        {children}
      </HBox>
    </HBox>
  );
}

function RiskScoreCard({ prediction, intl }) {
  const theme = useTheme();
  const { surfaces } = useDrsTheme();
  const riskColor =
    prediction.riskLevel === "HIGH" ? theme.palette.error.main : prediction.riskLevel === "MEDIUM" ? theme.palette.warning.main : theme.palette.success.main;

  return (
    <HBox sx={{ px: { xs: 1, md: 1.35 }, py: 0, minHeight: 164 }}>
      <Stack spacing={0.55}>
        <HBox
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            p: 0.75,
            bgcolor: surfaces.panel,
          }}
        >
          <HBox sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <HBox
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                boxShadow: "0 4px 10px rgba(37, 99, 235, 0.25)",
              }}
            >
              <AttachMoneyIcon sx={{ fontSize: 12 }} />
            </HBox>
            <HLabel
              align="left"
              colon={false}
              value={intl.formatMessage({
                id: "label.aiPrediction.paymentProbability",
                defaultMessage: "Payment Probability",
              })}
              sx={{ fontSize: 12, fontWeight: 700 }}
            />
          </HBox>
          <HBox
            sx={{
              mt: 0.5,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "160px minmax(0, 1fr)" },
              alignItems: "start",
              gap: 0.75,
            }}
          >
            <RiskGauge value={prediction.probability} />
            <Stack spacing={0.5} sx={{ width: "100%", maxWidth: 220, ml: "auto", justifySelf: "end" }}>
              <CenterMetric label={intl.formatMessage({ id: "label.aiPrediction.riskLevel", defaultMessage: "Risk Level" })}>
                <HLabel colon={false} value={prediction.riskLevel || "-"} sx={{ fontSize: 13, fontWeight: 900, color: riskColor }} />
              </CenterMetric>
              <CenterMetric label={intl.formatMessage({ id: "label.aiPrediction.confidence", defaultMessage: "Confidence" })}>
                <HLabel colon={false} value={prediction.confidence == null ? "-" : `${prediction.confidence}%`} sx={{ color: riskColor, fontSize: 14, fontWeight: 900 }} />
              </CenterMetric>
            </Stack>
          </HBox>
        </HBox>
        {prediction.recommendedAction ? (
          <CenterMetric label={intl.formatMessage({ id: "label.aiPrediction.recommendedAction", defaultMessage: "Recommended Action" })}>
            <HLabel colon={false} value={prediction.recommendedAction} sx={{ color: "text.primary", fontSize: 13, fontWeight: 900 }} />
          </CenterMetric>
        ) : null}
      </Stack>
    </HBox>
  );
}

function ApiContextCard({ payload, intl }) {
  const hiddenKeys = new Set([
    "customer_id",
    "customer_type",
    "payment_probability",
    "risk_level",
    "recommended_action",
    "action_confidence",
    "reason",
  ]);
  const rows = flattenObject(payload).filter((row) => {
    const topLevelKey = row.key.split(".")[0];
    return !hiddenKeys.has(topLevelKey);
  });

  if (!rows.length) return null;

  return (
    <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 1, borderColor: "divider", p: 1.1, maxWidth: 2100, mx: "auto", mt: 1.1 }}>
      <HLabel
        colon={false}
        value={intl.formatMessage({ id: "label.aiPrediction.apiContext", defaultMessage: "API Context" })}
        sx={{ fontSize: 13, fontWeight: 800, mb: 1 }}
      />
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(180px, 0.35fr) minmax(0, 0.65fr)" },
          gap: 0.75,
        }}
      >
        {rows.map((row) => (
          <React.Fragment key={row.key}>
            <HLabel colon={false} value={row.key} sx={{ fontSize: 11, color: "text.secondary", fontWeight: 700, minWidth: 0, wordBreak: "break-word" }} />
            <HLabel
              component="pre"
              colon={false}
              value={formatValue(row.value)}
              sx={{
                m: 0,
                fontFamily: "inherit",
                fontSize: 11,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                color: "text.primary",
              }}
            />
          </React.Fragment>
        ))}
      </HBox>
    </HPaper>
  );
}

function PaymentPredictionCard({ prediction, intl }) {
  return (
    <OverviewSectionCard
      title={intl.formatMessage({ id: "label.aiPrediction.riskDrivers", defaultMessage: "Risk Drivers" })}
      icon={Insights}
      accentColor="#2563eb"
      minHeight={164}
      bodySx={{ p: 1 }}
      sx={{
        borderRadius: 2,
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <RiskDriversCardContent timeline={prediction.timeline} intl={intl} />
    </OverviewSectionCard>
  );
}

function RiskDriversCardContent({ timeline, intl }) {
  return (
    <Stack
      spacing={0.8}
      sx={{
        maxHeight: 190,
        overflowY: "auto",
        pr: 0.25,
        "&::-webkit-scrollbar": {
          width: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(100, 116, 139, 0.45)",
          borderRadius: 999,
        },
      }}
    >
      {timeline.length ? timeline.map((item, index) => {
        const Icon = item.icon;
        return (
          <HBox
            key={`${item.text}-${index}`}
            sx={{
              display: "flex",
              gap: 0.75,
              alignItems: "flex-start",
              px: 0.8,
              py: 0.7,
              borderRadius: 1.25,
              bgcolor: alpha(item.color, 0.05),
              borderLeft: `3px solid ${alpha(item.color, 0.75)}`,
            }}
          >
            <HBox
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                bgcolor: alpha(item.color, 0.12),
                color: item.color,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                mt: 0.1,
              }}
            >
              <Icon sx={{ fontSize: 12 }} />
            </HBox>
            <HLabel colon={false} value={item.text} sx={{ fontSize: 10, lineHeight: 1.3, color: "text.primary", fontWeight: 500, minWidth: 0, wordBreak: "break-word" }} />
          </HBox>
        );
      }) : (
        <HLabel
          colon={false}
          value={intl.formatMessage({
            id: "label.aiPrediction.noTimeline",
            defaultMessage: "No timeline context returned by the API.",
          })}
          sx={{ fontSize: 10, fontWeight: 500, color: "text.secondary", lineHeight: 1.3 }}
        />
      )}
    </Stack>
  );
}

export default function AIOverview() {
  const theme = useTheme();
  const { surfaces, border, action } = useDrsTheme();
  const intl = useIntl();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasNoData, setHasNoData] = useState(false);
  const [rawPrediction, setRawPrediction] = useState(null);

  const requestData = useMemo(() => selectedRow || {}, [selectedRow]);
  const prediction = useMemo(() => normalizePrediction(rawPrediction, intl.formatMessage), [intl, rawPrediction]);
  const summaryLoading = false;
  const activitiesLoading = false;

  const latestActivityDate = null;
  const daysSinceContact = null;
  const dtLastPymt = null;
  const ptpStats = null;

  // Avg Resolution Time: days from delinquency start → last payment
  const avgResolutionDays = useMemo(() => {
    const start = null;
    const end = dtLastPymt;
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
    const diff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  }, [dtLastPymt]);

  const noDataMessage = intl.formatMessage({
    id: "label.aiPrediction.noData",
    defaultMessage: "No data available or insufficient data.",
  });
  const serviceNotStartedMessage = intl.formatMessage({
    id: "label.aiPrediction.serviceNotStarted",
    defaultMessage: "Prediction service is not started. Please start the service and try again.",
  });

  const loadPrediction = useCallback(async () => {
    if (!selectedRow) {
      setError("");
      setHasNoData(true);
      setRawPrediction(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasNoData(false);
       const commonDtoRes = await HAxiosService.POST(AIPredictAPI.fetchCommonDTO(), requestData);

       const commonDto = {
       customer_id: commonDtoRes.data.PARTITION_CODE,
       customer_seq_no: commonDtoRes.data.CUST_SEQNO,
       account_seq_no: commonDtoRes.data.ACNT_SEQNO,
       case_seq_no: commonDtoRes.data.CASE_SEQNO,
       partition_code: commonDtoRes.data.PARTITION_CODE,
     };


      const res = await HAxiosService.POST(AIPredictAPI.predict(), commonDto);

 
      if (!res) {
        throw new Error("AI prediction request failed.");
      }
      const payload = res?.data?.responseJson || res?.data?.data || res?.data;
      if (!payload || (typeof payload === "object" && !Array.isArray(payload) && Object.keys(payload).length === 0)) {
        setRawPrediction(null);
        setHasNoData(true);
        return;
      }
      setRawPrediction(payload);
    } catch (err) {
      console.error("AI prediction API error", err);
      setHasNoData(false);
      const isServiceDown =
        !err.response ||
        err.code === "ERR_NETWORK" ||
        String(err.message || "").toLowerCase().includes("network error") ||
        String(err.message || "").toLowerCase().includes("failed to fetch") ||
        String(err.message || "").toLowerCase().includes("econnrefused");

      const message = isServiceDown
        ? serviceNotStartedMessage
        : err.response?.data?.message ||
          err.response?.data?.msg ||
          intl.formatMessage({
            id: "label.aiPrediction.error",
            defaultMessage: "Error generating AI prediction.",
          });
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [intl, requestData, selectedRow, serviceNotStartedMessage, toast]);

  useEffect(() => {
    loadPrediction();
  }, [loadPrediction]);

  const gridSx = {
    display: "grid",
    gap: 1.75,
    px: 0,
    py: 0.25,
  };
  const panelBackground = surfaces.panel;
  const panelShadow = `0 10px 24px ${action.soft}`;

  return (
          <HBox
        sx={gridSx}
      >
        {loading && !rawPrediction ? (
          <HBox sx={{ minHeight: 180, display: "grid", placeItems: "center" }}>
            <CircularProgress size={28} />
          </HBox>
        ) : (
          <>
            <HBox
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
                gap: 0.75,
                width: "100%",
                maxWidth: "100%",
                mx: 0,
                alignItems: "stretch",
              }}
            >
              {prediction ? (
                <HPaper
                  variant="outlined"
                  elevation={0}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    borderRadius: 2,
                    borderColor: border.divider,
                    bgcolor: panelBackground,
                    background: panelBackground,
                    boxShadow: panelShadow,
                  }}
                >
                  <RiskScoreCard prediction={prediction} intl={intl} />
                  <PaymentPredictionCard prediction={prediction} intl={intl} />
                </HPaper>
              ) : (
                <HPaper variant="outlined" elevation={0} sx={{ p: 1.1, borderRadius: 2, borderColor: border.divider, bgcolor: panelBackground, background: panelBackground, boxShadow: panelShadow }}>
                  {error ? (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {error}
                    </Alert>
                  ) : null}
                  {!error && hasNoData ? (
                    <Alert severity="info" sx={{ mb: 1 }}>
                      {noDataMessage}
                    </Alert>
                  ) : null}
                  {!error && !hasNoData ? (
                    <HLabel
                      colon={false}
                      value={intl.formatMessage({
                        id: "label.aiPrediction.runHint",
                        defaultMessage: "Run AI to view prediction details returned by the API.",
                      })}
                      sx={{ fontSize: 13, color: "text.secondary" }}
                    />
                  ) : null}
                </HPaper>
              )}
              <HPaper
                variant="outlined"
                elevation={0}
                sx={{
                  borderRadius: 2,
                  borderColor: border.divider,
                  bgcolor: panelBackground,
                  background: panelBackground,
                  boxShadow: panelShadow,
                }}
              >
                <OverviewMetricsCards
                  intl={intl}
                  dtLastPymt={dtLastPymt}
                  daysSinceContact={daysSinceContact}
                  latestActivityDate={latestActivityDate}
                  ptpStats={ptpStats}
                  avgResolutionDays={avgResolutionDays}
                  delqStartDate={null}
                  summaryLoading={summaryLoading}
                  activitiesLoading={activitiesLoading}
                />
                
              </HPaper>
            </HBox>
            {prediction ? <ApiContextCard payload={rawPrediction} intl={intl} /> : null}
          </>
        )}
      </HBox>
  );
}
