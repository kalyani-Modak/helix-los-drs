import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, LinearProgress, Paper, Typography } from "@mui/material";
import {
  AccessTime,
  MonitorHeart,
  PhoneInTalk,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HLabel, HPaper, OverviewSectionCard } from "@helix/component-library";
import { PreviousActivitiesAPI, OverviewAPI, FollowupAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { useOverviewSection } from "../useOverviewSection";
import OverviewMetricsGrid from "./OverviewMetricsGrid";
import {
  formatDate,
  formatMoney,
  getDaysSince,
} from "../overviewApiHelpers";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function scoreColor(score) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function healthBadge(score) {
  if (score >= 85) return { label: "Excellent", bg: "#dcfce7", color: "#15803d" };
  if (score >= 70) return { label: "Good", bg: "#e9fdf0", color: "#19a04b" };
  if (score >= 50) return { label: "Fair", bg: "#fef3c7", color: "#b45309" };
  return { label: "Poor", bg: "#fee2e2", color: "#dc2626" };
}

function activityTone(activity = "", index = 0, intl) {
  const value = String(activity).toLowerCase();
  if (value.includes("payment") || value.includes("promise")) {
    return {
      color: "#16a34a",
      bg: "#dcfce7",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.success", defaultMessage: "success" }),
    };
  }
  if (value.includes("visit")) {
    return {
      color: "#2563eb",
      bg: "#dbeafe",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.planned", defaultMessage: "planned" }),
    };
  }
  if (value.includes("sms") || value.includes("email") || value.includes("call")) {
    return {
      color: "#7c3aed",
      bg: "#ede9fe",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.contact", defaultMessage: "contact" }),
    };
  }
  const fallback = [
    {
      color: "#f59e0b",
      bg: "#fef3c7",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.progress", defaultMessage: "progress" }),
    },
    {
      color: "#0f766e",
      bg: "#ccfbf1",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.update", defaultMessage: "update" }),
    },
    {
      color: "#db2777",
      bg: "#fce7f3",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.review", defaultMessage: "review" }),
    },
    {
      color: "#1d4ed8",
      bg: "#dbeafe",
      label: intl.formatMessage({ id: "label.Overview.hero.activity_tone.action", defaultMessage: "action" }),
    },
  ];
  return fallback[index % fallback.length];
}

export default function OverviewHeroSection() {
  const { selectedRow, headerData } = useSelector((s) => s.account);
  const navigate = useNavigate();
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { data: summaryData, loading: summaryLoading } = useOverviewSection(
    OverviewAPI.fetchCollectionSummary(),
    accountReady
  );
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [followupHistory, setFollowupHistory] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    let active = true;
    if (!accountReady) {
      setActivities([]);
      setActivitiesLoading(false);
      return undefined;
    }

    setActivitiesLoading(true);
    HAxiosService.POST(PreviousActivitiesAPI.fetchPrevious(0, 6))
      .then((res) => {
        const rows = Array.isArray(res?.data?.previousActivityDetailsDto)
          ? res.data.previousActivityDetailsDto
          : [];

        const sorted = [...rows].sort((a, b) => {
          const left = new Date(b?.dtActivity || 0).getTime();
          const right = new Date(a?.dtActivity || 0).getTime();
          return left - right;
        });

        if (active) {
          setActivities(sorted);
          setActivitiesLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setActivities([]);
          setActivitiesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [accountReady]);

  useEffect(() => {
    let active = true;
    if (!accountReady) {
      setAccountDetails(null);
      return undefined;
    }

    HAxiosService.POST(OverviewAPI.getAccountDetails())
      .then((res) => {
        if (active) setAccountDetails(res?.data ?? null);
      })
      .catch(() => {
        if (active) setAccountDetails(null);
      });

    return () => { active = false; };
  }, [accountReady]);

  useEffect(() => {
    let active = true;
    if (!accountReady) { setFollowupHistory([]); return undefined; }

    HAxiosService.GET(FollowupAPI.Followup(screenMenuId) + `/fetchFollowupHisForAcct`)
      .then((res) => {
        const rows = Array.isArray(res?.data?.responseJson)
          ? res.data.responseJson
          : [];
        const sorted = [...rows].sort((a, b) =>
          new Date(b?.dtAction || 0) - new Date(a?.dtAction || 0)
        );
        if (active) setFollowupHistory(sorted);
      })
      .catch(() => { if (active) setFollowupHistory([]); });

    return () => { active = false; };
  }, [accountReady]);

  const latestActivity = activities[0] || null;
  const daysSinceContact = getDaysSince(latestActivity?.dtActivity);
  const odDays = Number(headerData?.inOdDays) || 0;
  const dtLastPymt = accountDetails?.dtLastPymt ?? null;
  const lastPaymentGap = getDaysSince(dtLastPymt);
  // PTP Success Rate: total PTPs vs PTPs that had a follow-up (dtNextAction set = kept)
  const ptpStats = useMemo(() => {
    const ptpRows = followupHistory.filter(
      (a) => String(a?.szResultCode || "").toUpperCase() === "PTP"
    );
    const total = ptpRows.length;
    const kept = ptpRows.filter((a) => Boolean(a?.dtNextAction)).length;
    const rate = total > 0 ? Math.round((kept / total) * 100) : null;
    return { total, kept, rate };
  }, [followupHistory]);

  // Avg Resolution Time: days from delinquency start → last payment
  const avgResolutionDays = useMemo(() => {
    const start = summaryData?.dtDelqStart;
    const end = dtLastPymt;
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
    const diff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  }, [summaryData?.dtDelqStart, dtLastPymt]);

  // Contact Response: ratio of successful/RPC contacts
  // "OC" = Outgoing Connected (Right Party Contact), treat as successful
  const contactResponseScore = useMemo(() => {
    if (followupHistory.length === 0) return 5; // neutral default
    const successful = followupHistory.filter((a) => {
      const result = String(a?.szResultCode || "").toUpperCase();
      return result === "OC"; // Right Party / Successful contact
    }).length;
    const rate = successful / followupHistory.length; // 0–1
    return clamp(Math.round(rate * 10), 1, 10);
  }, [followupHistory]);

  const health = useMemo(() => {
    const paymentHistory = clamp(10 - Math.floor((lastPaymentGap ?? 180) / 15), 1, 10);
    const delinquencyRisk = clamp(10 - Math.floor(odDays / 10), 1, 10);
    // Contact Response: successful/RPC contacts ratio from follow-up history
    const contactResponse = contactResponseScore;
    // PTP Compliance: PTPs kept vs total PTPs registered
    const ptpCompliance = ptpStats.rate != null
    ? clamp(Math.round(ptpStats.rate / 10), 1, 10)
    : 5;
    const total = Math.round(
      ((paymentHistory + delinquencyRisk + contactResponse + ptpCompliance) / 40) * 100
    );
    return {
      total,
      metrics: [
        { label: intl.formatMessage({ id: "label.Overview.health.payment_history", defaultMessage: "Payment History" }), value: paymentHistory, color: "#22c55e" },
        { label: intl.formatMessage({ id: "label.Overview.health.delinquency_risk", defaultMessage: "Delinquency Risk" }), value: delinquencyRisk, color: "#f59e0b" },
        { label: intl.formatMessage({ id: "label.Overview.health.contact_response", defaultMessage: "Contact Response" }), value: contactResponse, color: "#2563eb" },
        { label: intl.formatMessage({ id: "label.Overview.health.ptp_compliance", defaultMessage: "PTP Compliance" }), value: ptpCompliance, color: "#7c3aed" },
      ],
    };
  }, [contactResponseScore, intl, lastPaymentGap, odDays, ptpStats]);

  const healthTone = healthBadge(health.total);

  return (
    <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.9 }}>
      <OverviewMetricsGrid
        intl={intl}
        dtLastPymt={dtLastPymt}
        daysSinceContact={daysSinceContact}
        latestActivityDate={latestActivity?.dtActivity}
        ptpStats={ptpStats}
        avgResolutionDays={avgResolutionDays}
        delqStartDate={summaryData?.dtDelqStart}
        summaryLoading={summaryLoading}
        activitiesLoading={activitiesLoading}
      />

      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.5fr) minmax(320px, 1fr)" },
          gap: 0.9,
        }}
      >
        <OverviewSectionCard
          title={intl.formatMessage({ id: "label.Overview.hero.activity_timeline", defaultMessage: "Activity Timeline" })}
          icon={AccessTime}
          accentColor="#2563eb"
          subtitle={intl.formatMessage({
            id: "label.Overview.hero.activity_timeline_subtitle",
            defaultMessage: "Recent customer touchpoints across calls, reminders and recovery actions.",
          })}
          minHeight={102}
        >
          <HBox loading={activitiesLoading} sx={{ width: "100%", height: "100%", minHeight: activitiesLoading ? 100 : "auto", display: "flex", flexDirection: "column" }}>
          {activities.length === 0 ? (
            <HLabel
              value={intl.formatMessage({
                id: "label.Overview.hero.activity_empty",
                defaultMessage: "No recent activity is available for this account.",
              })}
              colon={false}
              align="left"
            />
          ) : (
            <HBox sx={{ display: "grid", gridTemplateColumns: `repeat(${activities.length}, minmax(106px, 1fr))`, gap: 0.65, overflowX: "auto" }}>
              {activities.map((item, index) => {
                const tone = activityTone(item?.szActivity, index, intl);
                return (
                  <HBox key={`${item?.dtActivity || "activity"}-${index}`} sx={{ position: "relative", minWidth: 0, background:"transparent" }}>
                    {index < activities.length - 1 ? (
                      <HBox
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: "calc(50% + 12px)",
                          right: "calc(-50% + 12px)",
                          height: 2,
                          bgcolor: "#dbe7ff",
                        }}
                      />
                    ) : null}
                    <HBox sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.45, background:"transparent" }}>
                      <HBox
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: tone.bg,
                          color: tone.color,
                          border: "2px solid #fff",
                          boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        <PhoneInTalk sx={{ fontSize: 11 }} />
                      </HBox>
                      <HLabel
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          lineHeight: 1.15,
                        }}
                        value={item?.szActivity || intl.formatMessage({ id: "label.Overview.hero.activity", defaultMessage: "Activity" })}
                        colon={false}
                        align="center"
                      />
                      <Chip
                        size="small"
                        label={tone.label}
                        sx={{
                          height: 16,
                          fontSize: 8,
                          textTransform: "capitalize",
                          bgcolor: tone.bg,
                          color: tone.color,
                          fontWeight: 700,
                          boxShadow: `0 4px 10px ${tone.color}18`,
                        }}
                      />
                      <HLabel 
                        value={item?.szRemark || item?.szSystemRemark || intl.formatMessage({ id: "label.Overview.hero.no_remarks", defaultMessage: "No remarks" })}
                        colon={false}
                        align="center"
                        sx={{ fontSize: 9, lineHeight: 1.15 }}
                      />
                      <HLabel
                        value={formatDate(item?.dtActivity)}
                        sx={{ fontSize: 8 }}
                        colon={false}
                        align="center"
                      />
                    </HBox>
                  </HBox>
                );
              })}
            </HBox>
          )}
          </HBox>
        </OverviewSectionCard>

        <OverviewSectionCard
          title={intl.formatMessage({ id: "label.Overview.hero.health_score", defaultMessage: "Health Score" })}
          icon={MonitorHeart}
          accentColor="#1d4ed8"
          subtitle={intl.formatMessage({
            id: "label.Overview.hero.health_score_subtitle",
            defaultMessage: "A quick recovery-readiness pulse based on payment, contact and delinquency trends.",
          })}
          minHeight={102}
          bodySx={{ display: "flex", flex: 1 }}
        >
          <HBox
            loading={summaryLoading}
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "stretch" },
              justifyContent: "space-between",
              flex: 1,
              width: "100%",
              height: "100%",
            }}
          >
            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 72,
                flexShrink: 0,
                alignSelf: { xs: "flex-start", sm: "center" },
              }}
            >
              <HBox
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "50%",
                  border: `5px solid ${scoreColor(health.total)}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  color: scoreColor(health.total),
                  boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.9)",
                }}
              >
                <HLabel
                  value={health.total}
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: scoreColor(health.total),
                  }}
                  colon={false}
                  align="center"
                />

                <HLabel
                  value={`/100`}
                  sx={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: scoreColor(health.total),
                    lineHeight: 1,
                  }}
                  colon={false}
                  align="center"
                />
              </HBox>

              <HLabel
                value={healthTone.label}
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  mt: 0.45,
                  color: scoreColor(health.total),
                  lineHeight: 1,
                  textAlign: "center",
                }}
                colon={false}
                align="center"
              />
            </HBox>

            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 0.55,
                flex: 1,
                minWidth: 0,
                height: "100%",
              }}
            >
              {health.metrics.map((metric) => (
                <HBox key={metric.label}>
                  <HBox sx={{ display: "grid", gridTemplateColumns: "auto minmax(90px, 1fr) auto", alignItems: "center", gap: 0.75 }}>
                    <HLabel
                      value={metric.label}
                      sx={{ fontSize: 10, fontWeight: 600}}
                      colon={false}
                      align="center"
                    />
                    <LinearProgress
                      variant="determinate"
                      value={metric.value * 10}
                      sx={{
                        width: "100%",
                        height: 4,
                        borderRadius: 999,
                        bgcolor: "#e9eef8",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          bgcolor: metric.color,
                        },
                      }}
                    />
                    <HLabel colon={false} sx={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }} value={`${metric.value}/10`}/>
                  </HBox>
                </HBox>
              ))}
            </HBox>
          </HBox>
        </OverviewSectionCard>
      </HBox>
    </HBox>
  );
}
