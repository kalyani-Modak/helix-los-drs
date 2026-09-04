import React from "react";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton } from "@mui/material";

import { HBox, HCheckBox, HDatePicker, HDropdown, HTextField } from "@helix/component-library";

import { markExclusionActiveRowSx, markExclusionFieldSx } from "./markExclusionStyles";

const visuallyHiddenSx = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
};

export default function MarkExclusionRow({
  row,
  rowIndex,
  onChange,
  onRemove,
  actionOptions = [],
  categoryOptions = {},
  leafOptions = [],
  reasonOptions = [],
}) {
  const intl = useIntl();

  const selectedCategoryOptions = categoryOptions[row.szActionType] || [];
  const hasCategoryOptions = selectedCategoryOptions.length > 0;
  const rowLeafValue = String(row.szActionLeaf || "").trim();
  const selectedLeafOptions = leafOptions.some((option) => option.value === rowLeafValue)
    ? leafOptions
    : [
        ...leafOptions,
        ...(rowLeafValue ? [{ value: rowLeafValue, label: rowLeafValue }] : []),
      ];
  const hasLeafOptions = selectedLeafOptions.length > 0;
  const categoryPlaceholder = intl.formatMessage({
    id: "markExclusion.field.category",
    defaultMessage: "Category",
  });

  const handleDateChange = (field) => (value) => {
    const normalized = value ? dayjs(value).startOf("day") : null;
    onChange(row.rowKey, field, normalized);
  };

  const canRemove = row.lnExclSeqNo == null;
  const labels = {
    actionType: intl.formatMessage({
      id: "markExclusion.grid.actionType",
      defaultMessage: "Action Type",
    }),
    category: intl.formatMessage({
      id: "markExclusion.grid.category",
      defaultMessage: "Category",
    }),
    leaf: intl.formatMessage({
      id: "markExclusion.grid.leaf",
      defaultMessage: "Leaf",
    }),
    exclude: intl.formatMessage({
      id: "markExclusion.grid.exclude",
      defaultMessage: "Exclude",
    }),
    from: intl.formatMessage({
      id: "markExclusion.grid.from",
      defaultMessage: "From",
    }),
    till: intl.formatMessage({
      id: "markExclusion.grid.till",
      defaultMessage: "Till",
    }),
    reason: intl.formatMessage({
      id: "markExclusion.grid.reason",
      defaultMessage: "Reason",
    }),
    note: intl.formatMessage({
      id: "markExclusion.grid.note",
      defaultMessage: "Note",
    }),
  };
  const excludeInputId = `mark-exclusion-exclude-${row.rowKey}`;

  return (
    <HBox
      sx={{
        ...markExclusionActiveRowSx,
        ...(rowIndex % 2 === 1
          ? { background: "var(--drs-bg-panel)" }
          : { background: "transparent" }),
      }}
    >
      <HBox sx={markExclusionFieldSx} data-label={labels.actionType}>
        <HDropdown
          name="szActionType"
          options={actionOptions}
          value={row.szActionType}
          onChange={(e) => onChange(row.rowKey, "szActionType", e.target.value)}
          placeholder={intl.formatMessage({
            id: "markExclusion.field.actionType",
            defaultMessage: "Type",
          })}
          width="100%"
          required
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.category}>
        <HDropdown
          name="szActionCategory"
          options={selectedCategoryOptions}
          value={row.szActionCategory}
          onChange={(e) => onChange(row.rowKey, "szActionCategory", e.target.value)}
          placeholder={categoryPlaceholder}
          width="100%"
          required={hasCategoryOptions}
          disabled={!hasCategoryOptions}
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.leaf}>
        <HDropdown
          name="szActionLeaf"
          options={selectedLeafOptions}
          value={rowLeafValue}
          onChange={(e) => onChange(row.rowKey, "szActionLeaf", e.target.value)}
          placeholder={intl.formatMessage({
            id: "markExclusion.field.leaf",
            defaultMessage: "Leaf",
          })}
          width="100%"
          required
          disabled={!hasLeafOptions}
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.exclude}>
        <HBox component="label" htmlFor={excludeInputId} sx={visuallyHiddenSx}>
          {labels.exclude}
        </HBox>
        <HCheckBox
          id={excludeInputId}
          checked={row.excluded === true}
          onChange={(e) => onChange(row.rowKey, "excluded", Boolean(e.target.checked))}
          label=""
          align="center"
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.from}>
        <HDatePicker
          value={row.dtExcludedFrom}
          onChange={handleDateChange("dtExcludedFrom")}
          required
          width="100%"
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.till}>
        <HDatePicker
          value={row.dtExcludedTill}
          onChange={handleDateChange("dtExcludedTill")}
          required
          width="100%"
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.reason}>
        <HDropdown
          name="szReasonCode"
          options={reasonOptions}
          value={row.szReasonCode}
          onChange={(e) => onChange(row.rowKey, "szReasonCode", e.target.value)}
          placeholder={intl.formatMessage({
            id: "markExclusion.field.reason",
            defaultMessage: "Reason",
          })}
          width="100%"
          required
        />
      </HBox>
      <HBox sx={markExclusionFieldSx} data-label={labels.note}>
        <HTextField
          name="szRemarks"
          value={row.szRemarks}
          onChange={(e) => onChange(row.rowKey, "szRemarks", e.target.value)}
          placeholder={intl.formatMessage({
            id: "markExclusion.field.note",
            defaultMessage: "Note",
          })}
          width="100%"
          editable
        />
      </HBox>
      <HBox
        sx={{
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          "@media (max-width: 700px)": {
            justifyContent: "flex-end",
          },
        }}
      >
        {canRemove ? (
          <IconButton
            type="button"
            size="small"
            onClick={() => onRemove(row.rowKey)}
            aria-label={intl.formatMessage({
              id: "markExclusion.action.removeRow",
              defaultMessage: "Remove row",
            })}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        ) : null}
      </HBox>
    </HBox>
  );
}
