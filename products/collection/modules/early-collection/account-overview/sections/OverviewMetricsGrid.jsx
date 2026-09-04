import React from "react";
import { CalendarMonth, Insights, Payments, PhoneInTalk } from "@mui/icons-material";
import { HBox, HLabel, HPaper } from "@helix/component-library";
import { formatDate, formatRelativeDays } from "../overviewApiHelpers";

function MetricCard({ icon: Icon, label, value, caption, accent, glow = accent, loading = false }) {
  return (
    <HPaper
      loading={loading}
      variant="outlined"
      sx={{
        p: 1,
        borderRadius: 1.25,
        borderColor: `${accent}26`,
        boxShadow: "none",
        minHeight: 52,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <HBox
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: `${accent}14`,
          color: accent,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 15 }} />
      </HBox>

      <HBox sx={{ flexShrink: 1, minWidth: 0 }}>
        <HLabel
          value={label}
          sx={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, lineHeight: 1 }}
          colon={false}
          align="left"
        />
        <HLabel
          value={caption}
          sx={{ fontSize: 9, lineHeight: 1.3, mt: 0.3 }}
          colon={false}
          align="left"
        />
      </HBox>

      <HLabel
        value={value}
        sx={{ fontSize: 15, fontWeight: 800, color: accent, lineHeight: 1, flexShrink: 0, ml: 13 }}
        colon={false}
      />
    </HPaper>
  );
}

export default function OverviewMetricsGrid({
  intl,
  dtLastPymt,
  daysSinceContact,
  latestActivityDate,
  ptpStats,
  avgResolutionDays,
  delqStartDate,
  summaryLoading,
  activitiesLoading,
}) {
  const lastPaymentGap = dtLastPymt
    ? Math.floor((new Date() - new Date(dtLastPymt)) / (1000 * 60 * 60 * 24))
    : null;
  const contactRisk =
    daysSinceContact == null
      ? null
      : daysSinceContact > 10
      ? {
          label: intl.formatMessage({ id: "label.Overview.hero.cold", defaultMessage: "Cold" }),
          bg: "#fee2e2",
          color: "#dc2626",
        }
      : {
          label: intl.formatMessage({ id: "label.Overview.hero.fresh", defaultMessage: "Fresh" }),
          bg: "#dcfce7",
          color: "#15803d",
        };

  return (
    <HBox
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gap: 0.75,
      }}
    >
      <MetricCard
        icon={Payments}
        label={intl.formatMessage({ id: "label.Overview.hero.last_payment", defaultMessage: "Last Payment" })}
        value={formatDate(dtLastPymt)}
        caption={formatRelativeDays(dtLastPymt, intl.formatMessage)}
        accent="#2563eb"
        glow="#0ea5e9"
        loading={summaryLoading}
        highlight={
          lastPaymentGap != null && lastPaymentGap > 30
            ? {
                label: intl.formatMessage({ id: "label.Overview.hero.overdue", defaultMessage: "Overdue" }),
                bg: "#fee2e2",
                color: "#dc2626",
              }
            : {
                label: intl.formatMessage({ id: "label.Overview.hero.recent", defaultMessage: "Recent" }),
                bg: "#dbeafe",
                color: "#1d4ed8",
              }
        }
      />
      <MetricCard
        icon={PhoneInTalk}
        label={intl.formatMessage({ id: "label.Overview.hero.days_since_contact", defaultMessage: "Days Since Contact" })}
        value={daysSinceContact == null ? "--" : String(daysSinceContact)}
        caption={
          latestActivityDate
            ? intl.formatMessage({ id: "label.Overview.hero.last_touch", defaultMessage: "Last touch {date}" }, { date: formatDate(latestActivityDate) })
            : intl.formatMessage({ id: "label.Overview.hero.no_recent_activity", defaultMessage: "No recent activity" })
        }
        accent="#f59e0b"
        glow="#fb7185"
        loading={activitiesLoading}
        highlight={contactRisk}
      />
      <MetricCard
        icon={Insights}
        label={intl.formatMessage({
          id: "label.Overview.hero.ptp_success_rate",
          defaultMessage: "PTP Success Rate",
        })}
        value={ptpStats.rate != null ? `${ptpStats.rate}%` : "--"}
        caption={
          ptpStats.total > 0
            ? intl.formatMessage(
                {
                  id: "label.Overview.hero.ptp_caption",
                  defaultMessage: "{kept} kept of {total} promises",
                },
                { kept: ptpStats.kept, total: ptpStats.total }
              )
            : intl.formatMessage({
                id: "label.Overview.hero.ptp_no_data",
                defaultMessage: "No PTP data available",
              })
        }
        accent="#22c55e"
        glow="#14b8a6"
        loading={summaryLoading}
        highlight={
          ptpStats.rate == null
            ? null
            : ptpStats.rate >= 70
            ? { label: intl.formatMessage({ id: "label.Overview.hero.reliable", defaultMessage: "Reliable" }), bg: "#dcfce7", color: "#15803d" }
            : ptpStats.rate >= 40
            ? { label: intl.formatMessage({ id: "label.Overview.hero.moderate", defaultMessage: "Moderate" }), bg: "#fef3c7", color: "#b45309" }
            : { label: intl.formatMessage({ id: "label.Overview.hero.low_ptp", defaultMessage: "Low" }), bg: "#fee2e2", color: "#dc2626" }
        }
      />

      <MetricCard
        icon={CalendarMonth}
        label={intl.formatMessage({
          id: "label.Overview.hero.avg_resolution_time",
          defaultMessage: "Avg Resolution Time",
        })}
        value={avgResolutionDays != null ? String(avgResolutionDays) : "--"}
        caption={
          avgResolutionDays != null
            ? intl.formatMessage(
                {
                  id: "label.Overview.hero.avg_resolution_caption",
                  defaultMessage: "days since {date}",
                },
                { date: formatDate(delqStartDate) }
              )
            : intl.formatMessage({
                id: "label.Overview.hero.avg_resolution_no_data",
                defaultMessage: "No delinquency start date",
              })
        }
        accent="#7c3aed"
        glow="#ec4899"
        loading={summaryLoading}
        highlight={
          avgResolutionDays == null
            ? null
            : avgResolutionDays <= 30
            ? { label: intl.formatMessage({ id: "label.Overview.hero.fast", defaultMessage: "Fast" }), bg: "#dcfce7", color: "#15803d" }
            : avgResolutionDays <= 90
            ? { label: intl.formatMessage({ id: "label.Overview.hero.moderate", defaultMessage: "Moderate" }), bg: "#fef3c7", color: "#b45309" }
            : { label: intl.formatMessage({ id: "label.Overview.hero.slow", defaultMessage: "Slow" }), bg: "#fee2e2", color: "#dc2626" }
        }
      />
    </HBox>
  );
}
