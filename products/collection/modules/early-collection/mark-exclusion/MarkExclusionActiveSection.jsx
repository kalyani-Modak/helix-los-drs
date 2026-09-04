import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { OverviewSectionCard, HBox, HButton, useDrsTheme } from "@helix/component-library";

import MarkExclusionRow from "./MarkExclusionRow";
import { markExclusionActiveTableSx } from "./markExclusionStyles";

export default function MarkExclusionActiveSection({
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  loading,
  actionOptions = [],
  categoryOptions = {},
  leafOptions = [],
  reasonOptions = [],
}) {
  const intl = useIntl();
  const navigate = useNavigate();
  const { themeVars, text, border, action } = useDrsTheme();

  const headerAction = (
    <HBox
      sx={{
        background: "transparent",
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
        flexWrap: "wrap",
        minWidth: 0,
        maxWidth: "100%",
        "& > div": { width: "auto !important" },
        "@media (max-width: 700px)": {
          width: "100%",
          justifyContent: "flex-start",
        },
      }}
    >
      <HButton
        type="button"
        variant="outlined"
        size="small"
        startIcon={<VisibilityOutlinedIcon />}
        onClick={() => navigate("/homelayout/exclusionPolicy")}
        sx={{
          ...themeVars,
          minHeight: 28,
          px: 1.25,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "none",
          color: text.primary,
          borderColor: border.control,
          backgroundColor: "var(--drs-button-outline-bg, transparent)",
          "& .MuiButton-startIcon": { mr: 0.5 },
          "& .MuiSvgIcon-root": { fontSize: 15 },
          "&:hover": {
            borderColor: border.hover,
            backgroundColor: action.hover,
          },
        }}
      >
        {intl.formatMessage({
          id: "markExclusion.action.viewPolicy",
          defaultMessage: "View Exclusion Policy",
        })}
      </HButton>
      <HButton
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
        label="markExclusion.action.addExclusion"
        onClick={onAddRow}
        sx={{
          minHeight: 28,
          px: 1.25,
          fontSize: 11,
          fontWeight: 700,
          textTransform: "none",
          "& .MuiButton-startIcon": { mr: 0.5 },
          "& .MuiSvgIcon-root": { fontSize: 16 },
        }}
      />
    </HBox>
  );

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "markExclusion.section.active",
        defaultMessage: "Active Exclusions",
      })}
      loading={loading}
      action={headerAction}
      sx={{ borderRadius: "6px", minWidth: 0, width: "100%" }}
      bodySx={{ p: 0, minHeight: 88, minWidth: 0, width: "100%" }}
    >
      <HBox sx={markExclusionActiveTableSx}>
        <HBox
          sx={{
            display: { xs: "none", sm: "grid" },
            gridTemplateColumns: "var(--mark-exclusion-grid)",
            gap: "8px",
            alignItems: "center",
            minWidth: { sm: 860, lg: 900 },
            minHeight: 48,
            position: "sticky",
            top: 0,
            zIndex: 2,
            px: 1.5,
            background: "var(--drs-bg-panel)",
            borderBottom: 1,
            borderColor: "var(--drs-border-divider)",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--drs-text-secondary)",
            "@media (max-width: 700px)": { display: "none" },
          }}
        >
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.actionType",
              defaultMessage: "Action Type",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.category",
              defaultMessage: "Category",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.leaf",
              defaultMessage: "Leaf",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.exclude",
              defaultMessage: "Exclude",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.from",
              defaultMessage: "From",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.till",
              defaultMessage: "Till",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.reason",
              defaultMessage: "Reason",
            })}
          </HBox>
          <HBox component="span" sx={{ background: "transparent" }}>
            {intl.formatMessage({
              id: "markExclusion.grid.note",
              defaultMessage: "Note",
            })}
          </HBox>
          <HBox component="span" aria-hidden sx={{ background: "transparent" }} />
        </HBox>
        {rows.map((row, idx) => (
          <MarkExclusionRow
            key={row.rowKey}
            row={row}
            rowIndex={idx}
            onChange={onRowChange}
            onRemove={onRemoveRow}
            actionOptions={actionOptions}
            categoryOptions={categoryOptions}
            leafOptions={leafOptions}
            reasonOptions={reasonOptions}
          />
        ))}
      </HBox>
    </OverviewSectionCard>
  );
}
