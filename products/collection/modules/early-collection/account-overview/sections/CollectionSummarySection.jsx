import React from "react";
import { BarChart } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { formatMoney, formatDate } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, OverviewField, OverviewSectionCard } from "@helix/component-library";
export default function CollectionSummarySection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.fetchCollectionSummary(),
    accountReady
  );
  const d = data || {};
  const watchActive = String(d.szWatchFlag || "").toUpperCase() === "Y";

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.collection_summary",
        defaultMessage: "Collection Summary",
      })}
      icon={BarChart}
      accentColor="#2563eb"
      subtitle={intl.formatMessage({
        id: "label.Overview.collection_summary.subtitle",
        defaultMessage: "Recovery summary, watch controls and peak delinquency indicators.",
      })}
      loading={loading}
      error={error}
    >
      <HBox
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        }}
      >
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.special_code", defaultMessage: "Special Code" })} value={d.szSpecialCode} valueSx={{ color: "#7c3aed" }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.delinquency_reason", defaultMessage: "Delq. Reason" })} value={d.szDelinquencyReason} valueSx={{ color: "#b45309" }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.peak_delinquency_days", defaultMessage: "Peak Delq. Days" })} value={d.inPeakODdays} valueSx={{ color: Number(d.inPeakODdays) > 60 ? "#dc2626" : "#16213e" }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.times_in_collection", defaultMessage: "Times In Collection" })} value={d.inTimesInCollection} valueSx={{ color: "#0f766e" }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.watch_flag", defaultMessage: "Watch Flag" })} value={watchActive ? "Y" : d.szWatchFlag} valueSx={{ color: watchActive ? "#dc2626" : "#16213e", fontWeight: 800 }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.peak_od_amount", defaultMessage: "Peak OD Amount" })} value={formatMoney(d.flPeakOverdueAmt)} valueSx={{ color: "#1d4ed8" }} />
        <OverviewField label={intl.formatMessage({ id: "label.Overview.fields.delinquency_start_date", defaultMessage: "Delq. Start Date" })} value={formatDate(d.dtDelqStart)} valueSx={{ color: "#ec4899" }} />
      </HBox>
    </OverviewSectionCard>
  );
}
