import React from "react";
import { Chip } from "@mui/material";
import { AccountTree } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { formatDate } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HBox, HLabel, OverviewSectionCard } from "@helix/component-library";
export default function WorkflowSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getWorkFlowDetails(),
    accountReady
  );
  const d = data || {};
  const type = d.chTrunkYN === "Y"
    ? intl.formatMessage({ id: "label.Overview.workflow.primary", defaultMessage: "Primary" })
    : d.chTrunkYN === "N"
      ? intl.formatMessage({ id: "label.Overview.workflow.secondary", defaultMessage: "Secondary" })
      : "--";

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.workflow_details",
        defaultMessage: "Workflow Details",
      })}
      icon={AccountTree}
      accentColor="#2563eb"
      subtitle={intl.formatMessage({
        id: "label.Overview.workflow.subtitle",
        defaultMessage: "Current workflow ownership and progress state for the selected account.",
      })}
      loading={loading}
      error={error}
      minHeight={70}
      emptyMinHeight={48}
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, overflowX: "auto" }}>
        <HBox
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 1,
            pb: 0.75,
            borderBottom: "1px solid rgba(26, 71, 155, 0.10)",
            minWidth: 560,
          }}
        >
          {[
            intl.formatMessage({ id: "label.Overview.workflow.type", defaultMessage: "Type" }),
            intl.formatMessage({ id: "label.Overview.fields.workflow", defaultMessage: "Workflow" }),
            intl.formatMessage({ id: "label.Overview.workflow.state", defaultMessage: "State" }),
            intl.formatMessage({ id: "label.Overview.fields.start_date", defaultMessage: "Start Date" }),
            intl.formatMessage({ id: "label.Overview.fields.collector", defaultMessage: "Collector" }),
          ].map((label) => (
            <HLabel 
              key={label}
              value={label}
              sx={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}
              colon={false}
              align="left"
            />
          ))}
        </HBox>

        <HBox
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 1,
            alignItems: "center",
            minWidth: 560,
          }}
        >
          <Chip
            size="small"
            label={type}
            sx={{
              width: "fit-content",
              height: 24,
              bgcolor: type === "Primary" ? "#dcfce7" : "#fee2e2",
              color: type === "Primary" ? "#16a34a" : "#dc2626",
              fontWeight: 700,
            }}
          />
          <HLabel 
              value={d.szWfCode || "--"}
              sx={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}
              colon={false}
              align="left"
            />
          <HLabel 
              value={d.szWfStateCode || "--"}
              sx={{ fontSize: 13, fontWeight: 700 }}
              colon={false}
              align="left"
            />
          <HLabel 
              value={formatDate(d.dtWfDate)}
              sx={{ fontSize: 13, fontWeight: 700 }}
              colon={false}
              align="left"
            />
          <Chip
            size="small"
            label={d.szCollectorCode || "--"}
            sx={{
              width: "fit-content",
              height: 22,
              bgcolor: "#e0f2fe",
              color: "#0369a1",
              fontSize: 11,
              fontWeight: 800,
            }}
          />
        </HBox>
      </HBox>
    </OverviewSectionCard>
  );
}
