import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";

import { HBox, OverviewSectionCard } from "@helix/component-library";

import { markExclusionBadgeBaseSx } from "./markExclusionStyles";

function asText(value) {
  const text = String(value ?? "").trim();
  return text || "-";
}

function leafDisplay(value, leafOptions) {
  const code = String(value ?? "").trim();
  if (!code) return "-";
  return leafOptions.find((option) => option.value === code)?.label || code;
}

function fmtDate(value) {
  if (value == null || value === "") return "-";
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD") : "-";
}

function isActive(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  return ["Y", "YES", "TRUE", "1", "ACTIVE"].includes(normalized);
}

function statusMeta(value, intl) {
  const normalized = String(value ?? "").trim().toUpperCase();

  if (["A", "Y", "APPROVED"].includes(normalized)) {
    return {
      sx: {
        ...markExclusionBadgeBaseSx,
        background: "color-mix(in srgb, var(--drs-color-success) 16%, transparent)",
        color: "var(--drs-color-success)",
      },
      label: intl.formatMessage({
        id: "markExclusion.status.approved",
        defaultMessage: "Approved",
      }),
    };
  }

  if (["P", "PENDING", "APPROVAL PENDING"].includes(normalized)) {
    return {
      sx: {
        ...markExclusionBadgeBaseSx,
        background: "color-mix(in srgb, var(--drs-color-warning) 18%, transparent)",
        color: "var(--drs-color-warning)",
      },
      label: intl.formatMessage({
        id: "markExclusion.status.approvalPending",
        defaultMessage: "Approval Pending",
      }),
    };
  }

  return {
    sx: {
      ...markExclusionBadgeBaseSx,
      background: "color-mix(in srgb, var(--drs-text-secondary) 12%, transparent)",
      color: "var(--drs-text-secondary)",
    },
    label:
      asText(value) === "-"
        ? intl.formatMessage({
            id: "markExclusion.status.notAvailable",
            defaultMessage: "Not available",
          })
        : asText(value),
  };
}

export default function MarkExclusionHistoryGrid({
  rowData,
  loading,
  leafOptions = [],
}) {
  const intl = useIntl();
  const columns = useMemo(
    () => [
      {
        key: "szActionType",
        label: intl.formatMessage({
          id: "markExclusion.grid.actionType",
          defaultMessage: "Action Type",
        }),
        render: (row) => asText(row.szActionType),
      },
      {
        key: "szActionCategory",
        label: intl.formatMessage({
          id: "markExclusion.grid.category",
          defaultMessage: "Category",
        }),
        render: (row) => asText(row.szActionCategory),
      },
      {
        key: "szActionLeaf",
        label: intl.formatMessage({
          id: "markExclusion.grid.leaf",
          defaultMessage: "Leaf",
        }),
        render: (row) => leafDisplay(row.szActionLeaf, leafOptions),
      },
      {
        key: "szRemarks",
        label: intl.formatMessage({
          id: "markExclusion.grid.note",
          defaultMessage: "Note",
        }),
        render: (row) => asText(row.szRemarks),
      },
      {
        key: "szCreatedBy",
        label: intl.formatMessage({
          id: "markExclusion.grid.by",
          defaultMessage: "By",
        }),
        render: (row) => asText(row.szCreatedBy),
      },
      {
        key: "dtExcludedFrom",
        label: intl.formatMessage({
          id: "markExclusion.grid.from",
          defaultMessage: "From",
        }),
        render: (row) => fmtDate(row.dtExcludedFrom),
      },
      {
        key: "dtExcludedTill",
        label: intl.formatMessage({
          id: "markExclusion.grid.till",
          defaultMessage: "Till",
        }),
        render: (row) => fmtDate(row.dtExcludedTill),
      },
      {
        key: "chActive",
        label: intl.formatMessage({
          id: "markExclusion.grid.active",
          defaultMessage: "Active",
        }),
        render: (row) => {
          const active = isActive(row.chActive);
          return (
            <HBox
              component="span"
              sx={{
                ...markExclusionBadgeBaseSx,
                background: active
                  ? "color-mix(in srgb, var(--drs-color-success) 16%, transparent)"
                  : "color-mix(in srgb, var(--drs-text-secondary) 14%, transparent)",
                color: active
                  ? "var(--drs-color-success)"
                  : "var(--drs-text-secondary)",
              }}
            >
              {intl.formatMessage({
                id: active ? "markExclusion.active.yes" : "markExclusion.active.no",
                defaultMessage: active ? "Y" : "N",
              })}
            </HBox>
          );
        },
      },
      {
        key: "cStatus",
        label: intl.formatMessage({
          id: "markExclusion.grid.status",
          defaultMessage: "Status",
        }),
        render: (row) => {
          const meta = statusMeta(row.cStatus, intl);
          return (
            <HBox component="span" sx={meta.sx}>
              {meta.label}
            </HBox>
          );
        },
      },
      {
        key: "szDecisionBy",
        label: intl.formatMessage({
          id: "markExclusion.grid.decisionBy",
          defaultMessage: "Decision By",
        }),
        render: (row) => asText(row.szDecisionBy),
      },
      {
        key: "dtDecisionDate",
        label: intl.formatMessage({
          id: "markExclusion.grid.decisionDate",
          defaultMessage: "Decision Date",
        }),
        render: (row) => fmtDate(row.dtDecisionDate),
      },
    ],
    [intl, leafOptions],
  );

  const rows = rowData || [];

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "markExclusion.section.history",
        defaultMessage: "Exclusion History",
      })}
      loading={loading}
      sx={{ borderRadius: "6px", minWidth: 0, width: "100%" }}
      bodySx={{
        p: 0,
        minHeight: 120,
        minWidth: 0,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <HBox
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          display: "block",
          maxHeight: { xs: 420, sm: 360, md: 300 },
          overflowX: "auto",
          overflowY: "auto",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "contain",
          scrollbarGutter: "stable",
          WebkitOverflowScrolling: "touch",
          background: "var(--drs-bg-paper)",
          "@media (max-width: 700px)": {
            maxHeight: 460,
          },
        }}
      >
        {rows.length > 0 ? (
          <HBox
            component="table"
            sx={{
              width: "100%",
              minWidth: { xs: 0, sm: 1400 },
              borderCollapse: "collapse",
              tableLayout: "fixed",
              "& th": {
                height: 48,
                px: 2,
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: "var(--drs-bg-panel)",
                borderBottom: "1px solid var(--drs-border-divider)",
                color: "var(--drs-text-secondary)",
                fontSize: 10,
                fontWeight: 600,
                textAlign: "left",
                verticalAlign: "middle",
              },
              "& td": {
                height: 54,
                px: 2,
                borderBottom: "1px solid var(--drs-border-divider)",
                color: "var(--drs-text-primary)",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.3,
                textAlign: "left",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "& tbody tr:nth-of-type(even)": {
                background: "color-mix(in srgb, var(--drs-text-secondary) 4%, transparent)",
              },
              "& tbody tr:hover": {
                background: "var(--drs-hover-bg)",
              },
              "@media (max-width: 700px)": {
                display: "block",
                width: "100%",
                minWidth: 0,
                tableLayout: "auto",
                "& thead": {
                  display: "none",
                },
                "& tbody, & tr, & td": {
                  display: "block",
                  width: "100%",
                  minWidth: 0,
                },
                "& tr": {
                  borderBottom: "1px solid var(--drs-border-divider)",
                  px: 1.5,
                  py: 1.25,
                },
                "& td": {
                  display: "grid",
                  gridTemplateColumns: "minmax(108px, 0.42fr) minmax(0, 1fr)",
                  alignItems: "center",
                  gap: "10px",
                  height: "auto",
                  minHeight: 32,
                  px: 0,
                  py: 0.5,
                  borderBottom: 0,
                  whiteSpace: "normal",
                },
                "& td::before": {
                  content: "attr(data-label)",
                  color: "var(--drs-text-secondary)",
                  fontSize: 10,
                  fontWeight: 700,
                },
              },
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.gridRowId}>
                  {columns.map((col) => (
                    <td key={col.key} data-label={col.label}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </HBox>
        ) : (
          <HBox
            sx={{
              minHeight: 112,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              color: "var(--drs-text-secondary)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {intl.formatMessage({
              id: "markExclusion.history.empty",
              defaultMessage: "No exclusion history for this account.",
            })}
          </HBox>
        )}
      </HBox>
    </OverviewSectionCard>
  );
}
