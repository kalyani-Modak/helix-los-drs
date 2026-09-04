import { ed as useIntl, dB as jsxRuntimeExports, ac as Dt, bH as SE, cB as cc, cg as Ug, cs as ap, aR as IconButton, a1 as DeleteOutlineIcon, cI as dayjs, eh as useNavigate, $ as $e, b0 as Lg, cl as VisibilityOutlined, g as AddIcon, A as AE, dN as reactExports, ct as ar, el as useSelector, ef as useLocation, aX as Kr, b7 as MarkExclusionAPI, bV as Stack, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
const markExclusionGridTemplate = "minmax(96px, 0.95fr) minmax(96px, 0.95fr) minmax(110px, 1fr) 56px minmax(118px, 1fr) minmax(118px, 1fr) minmax(118px, 1fr) minmax(120px, 1fr) 44px";
const markExclusionActiveTableSx = {
  "--mark-exclusion-grid": markExclusionGridTemplate,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  display: "block",
  maxHeight: { xs: "none", sm: 420 },
  overflowX: "auto",
  overflowY: "auto",
  overscrollBehaviorX: "contain",
  overscrollBehaviorY: "contain",
  scrollbarGutter: "stable",
  WebkitOverflowScrolling: "touch",
  background: "var(--drs-bg-paper)"
};
const markExclusionActiveRowSx = {
  display: { xs: "block", sm: "grid" },
  gridTemplateColumns: "var(--mark-exclusion-grid)",
  gap: "8px",
  alignItems: "center",
  minWidth: { xs: 0, sm: 860, lg: 900 },
  px: 1.5,
  py: 1,
  borderBottom: "1px solid var(--drs-border-divider)",
  "@media (max-width: 700px)": {
    minWidth: 0,
    px: 1.5,
    py: 1.25
  }
};
const markExclusionFieldSx = {
  minWidth: 0,
  background: "transparent",
  "& .MuiFormControl-root, & .MuiInputBase-root": {
    width: "100%",
    minWidth: 0
  },
  "@media (max-width: 700px)": {
    display: "grid",
    gridTemplateColumns: "minmax(108px, 0.42fr) minmax(0, 1fr)",
    alignItems: "center",
    gap: "10px",
    py: 0.5,
    "&::before": {
      content: "attr(data-label)",
      color: "var(--drs-text-secondary)",
      fontSize: 10,
      fontWeight: 700
    }
  }
};
const markExclusionBadgeBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 20,
  maxWidth: "100%",
  px: 0.75,
  borderRadius: "4px",
  fontSize: 10,
  fontWeight: 700,
  lineHeight: 1.2,
  whiteSpace: "nowrap"
};
const visuallyHiddenSx = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1
};
function MarkExclusionRow({
  row,
  rowIndex,
  onChange,
  onRemove,
  actionOptions = [],
  categoryOptions = {},
  leafOptions = [],
  reasonOptions = []
}) {
  const intl = useIntl();
  const selectedCategoryOptions = categoryOptions[row.szActionType] || [];
  const hasCategoryOptions = selectedCategoryOptions.length > 0;
  const rowLeafValue = String(row.szActionLeaf || "").trim();
  const selectedLeafOptions = leafOptions.some((option) => option.value === rowLeafValue) ? leafOptions : [
    ...leafOptions,
    ...rowLeafValue ? [{ value: rowLeafValue, label: rowLeafValue }] : []
  ];
  const hasLeafOptions = selectedLeafOptions.length > 0;
  const categoryPlaceholder = intl.formatMessage({
    id: "markExclusion.field.category",
    defaultMessage: "Category"
  });
  const handleDateChange = (field) => (value) => {
    const normalized = value ? dayjs(value).startOf("day") : null;
    onChange(row.rowKey, field, normalized);
  };
  const canRemove = row.lnExclSeqNo == null;
  const labels = {
    actionType: intl.formatMessage({
      id: "markExclusion.grid.actionType",
      defaultMessage: "Action Type"
    }),
    category: intl.formatMessage({
      id: "markExclusion.grid.category",
      defaultMessage: "Category"
    }),
    leaf: intl.formatMessage({
      id: "markExclusion.grid.leaf",
      defaultMessage: "Leaf"
    }),
    exclude: intl.formatMessage({
      id: "markExclusion.grid.exclude",
      defaultMessage: "Exclude"
    }),
    from: intl.formatMessage({
      id: "markExclusion.grid.from",
      defaultMessage: "From"
    }),
    till: intl.formatMessage({
      id: "markExclusion.grid.till",
      defaultMessage: "Till"
    }),
    reason: intl.formatMessage({
      id: "markExclusion.grid.reason",
      defaultMessage: "Reason"
    }),
    note: intl.formatMessage({
      id: "markExclusion.grid.note",
      defaultMessage: "Note"
    })
  };
  const excludeInputId = `mark-exclusion-exclude-${row.rowKey}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        ...markExclusionActiveRowSx,
        ...rowIndex % 2 === 1 ? { background: "var(--drs-bg-panel)" } : { background: "transparent" }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.actionType, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "szActionType",
            options: actionOptions,
            value: row.szActionType,
            onChange: (e) => onChange(row.rowKey, "szActionType", e.target.value),
            placeholder: intl.formatMessage({
              id: "markExclusion.field.actionType",
              defaultMessage: "Type"
            }),
            width: "100%",
            required: true
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.category, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "szActionCategory",
            options: selectedCategoryOptions,
            value: row.szActionCategory,
            onChange: (e) => onChange(row.rowKey, "szActionCategory", e.target.value),
            placeholder: categoryPlaceholder,
            width: "100%",
            required: hasCategoryOptions,
            disabled: !hasCategoryOptions
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.leaf, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "szActionLeaf",
            options: selectedLeafOptions,
            value: rowLeafValue,
            onChange: (e) => onChange(row.rowKey, "szActionLeaf", e.target.value),
            placeholder: intl.formatMessage({
              id: "markExclusion.field.leaf",
              defaultMessage: "Leaf"
            }),
            width: "100%",
            required: true,
            disabled: !hasLeafOptions
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: markExclusionFieldSx, "data-label": labels.exclude, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "label", htmlFor: excludeInputId, sx: visuallyHiddenSx, children: labels.exclude }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              id: excludeInputId,
              checked: row.excluded === true,
              onChange: (e) => onChange(row.rowKey, "excluded", Boolean(e.target.checked)),
              label: "",
              align: "center"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.from, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ug,
          {
            value: row.dtExcludedFrom,
            onChange: handleDateChange("dtExcludedFrom"),
            required: true,
            width: "100%"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.till, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ug,
          {
            value: row.dtExcludedTill,
            onChange: handleDateChange("dtExcludedTill"),
            required: true,
            width: "100%"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.reason, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: "szReasonCode",
            options: reasonOptions,
            value: row.szReasonCode,
            onChange: (e) => onChange(row.rowKey, "szReasonCode", e.target.value),
            placeholder: intl.formatMessage({
              id: "markExclusion.field.reason",
              defaultMessage: "Reason"
            }),
            width: "100%",
            required: true
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: markExclusionFieldSx, "data-label": labels.note, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            name: "szRemarks",
            value: row.szRemarks,
            onChange: (e) => onChange(row.rowKey, "szRemarks", e.target.value),
            placeholder: intl.formatMessage({
              id: "markExclusion.field.note",
              defaultMessage: "Note"
            }),
            width: "100%",
            editable: true
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              background: "transparent",
              display: "flex",
              justifyContent: "center",
              "@media (max-width: 700px)": {
                justifyContent: "flex-end"
              }
            },
            children: canRemove ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              IconButton,
              {
                type: "button",
                size: "small",
                onClick: () => onRemove(row.rowKey),
                "aria-label": intl.formatMessage({
                  id: "markExclusion.action.removeRow",
                  defaultMessage: "Remove row"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { fontSize: "small" })
              }
            ) : null
          }
        )
      ]
    }
  );
}
function MarkExclusionActiveSection({
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  loading,
  actionOptions = [],
  categoryOptions = {},
  leafOptions = [],
  reasonOptions = []
}) {
  const intl = useIntl();
  const navigate = useNavigate();
  const { themeVars, text, border, action } = $e();
  const headerAction = /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
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
          justifyContent: "flex-start"
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            type: "button",
            variant: "outlined",
            size: "small",
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityOutlined, {}),
            onClick: () => navigate("/homelayout/exclusionPolicy"),
            sx: {
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
                backgroundColor: action.hover
              }
            },
            children: intl.formatMessage({
              id: "markExclusion.action.viewPolicy",
              defaultMessage: "View Exclusion Policy"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            variant: "contained",
            size: "small",
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, {}),
            label: "markExclusion.action.addExclusion",
            onClick: onAddRow,
            sx: {
              minHeight: 28,
              px: 1.25,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "none",
              "& .MuiButton-startIcon": { mr: 0.5 },
              "& .MuiSvgIcon-root": { fontSize: 16 }
            }
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "markExclusion.section.active",
        defaultMessage: "Active Exclusions"
      }),
      loading,
      action: headerAction,
      sx: { borderRadius: "6px", minWidth: 0, width: "100%" },
      bodySx: { p: 0, minHeight: 88, minWidth: 0, width: "100%" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: markExclusionActiveTableSx, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
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
              "@media (max-width: 700px)": { display: "none" }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.actionType",
                defaultMessage: "Action Type"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.category",
                defaultMessage: "Category"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.leaf",
                defaultMessage: "Leaf"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.exclude",
                defaultMessage: "Exclude"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.from",
                defaultMessage: "From"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.till",
                defaultMessage: "Till"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.reason",
                defaultMessage: "Reason"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { background: "transparent" }, children: intl.formatMessage({
                id: "markExclusion.grid.note",
                defaultMessage: "Note"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", "aria-hidden": true, sx: { background: "transparent" } })
            ]
          }
        ),
        rows.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MarkExclusionRow,
          {
            row,
            rowIndex: idx,
            onChange: onRowChange,
            onRemove: onRemoveRow,
            actionOptions,
            categoryOptions,
            leafOptions,
            reasonOptions
          },
          row.rowKey
        ))
      ] })
    }
  );
}
function asText(value) {
  const text = String(value ?? "").trim();
  return text || "-";
}
function leafDisplay(value, leafOptions) {
  var _a;
  const code = String(value ?? "").trim();
  if (!code) return "-";
  return ((_a = leafOptions.find((option) => option.value === code)) == null ? void 0 : _a.label) || code;
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
        color: "var(--drs-color-success)"
      },
      label: intl.formatMessage({
        id: "markExclusion.status.approved",
        defaultMessage: "Approved"
      })
    };
  }
  if (["P", "PENDING", "APPROVAL PENDING"].includes(normalized)) {
    return {
      sx: {
        ...markExclusionBadgeBaseSx,
        background: "color-mix(in srgb, var(--drs-color-warning) 18%, transparent)",
        color: "var(--drs-color-warning)"
      },
      label: intl.formatMessage({
        id: "markExclusion.status.approvalPending",
        defaultMessage: "Approval Pending"
      })
    };
  }
  return {
    sx: {
      ...markExclusionBadgeBaseSx,
      background: "color-mix(in srgb, var(--drs-text-secondary) 12%, transparent)",
      color: "var(--drs-text-secondary)"
    },
    label: asText(value) === "-" ? intl.formatMessage({
      id: "markExclusion.status.notAvailable",
      defaultMessage: "Not available"
    }) : asText(value)
  };
}
function MarkExclusionHistoryGrid({
  rowData,
  loading,
  leafOptions = []
}) {
  const intl = useIntl();
  const columns = reactExports.useMemo(
    () => [
      {
        key: "szActionType",
        label: intl.formatMessage({
          id: "markExclusion.grid.actionType",
          defaultMessage: "Action Type"
        }),
        render: (row) => asText(row.szActionType)
      },
      {
        key: "szActionCategory",
        label: intl.formatMessage({
          id: "markExclusion.grid.category",
          defaultMessage: "Category"
        }),
        render: (row) => asText(row.szActionCategory)
      },
      {
        key: "szActionLeaf",
        label: intl.formatMessage({
          id: "markExclusion.grid.leaf",
          defaultMessage: "Leaf"
        }),
        render: (row) => leafDisplay(row.szActionLeaf, leafOptions)
      },
      {
        key: "szRemarks",
        label: intl.formatMessage({
          id: "markExclusion.grid.note",
          defaultMessage: "Note"
        }),
        render: (row) => asText(row.szRemarks)
      },
      {
        key: "szCreatedBy",
        label: intl.formatMessage({
          id: "markExclusion.grid.by",
          defaultMessage: "By"
        }),
        render: (row) => asText(row.szCreatedBy)
      },
      {
        key: "dtExcludedFrom",
        label: intl.formatMessage({
          id: "markExclusion.grid.from",
          defaultMessage: "From"
        }),
        render: (row) => fmtDate(row.dtExcludedFrom)
      },
      {
        key: "dtExcludedTill",
        label: intl.formatMessage({
          id: "markExclusion.grid.till",
          defaultMessage: "Till"
        }),
        render: (row) => fmtDate(row.dtExcludedTill)
      },
      {
        key: "chActive",
        label: intl.formatMessage({
          id: "markExclusion.grid.active",
          defaultMessage: "Active"
        }),
        render: (row) => {
          const active = isActive(row.chActive);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              component: "span",
              sx: {
                ...markExclusionBadgeBaseSx,
                background: active ? "color-mix(in srgb, var(--drs-color-success) 16%, transparent)" : "color-mix(in srgb, var(--drs-text-secondary) 14%, transparent)",
                color: active ? "var(--drs-color-success)" : "var(--drs-text-secondary)"
              },
              children: intl.formatMessage({
                id: active ? "markExclusion.active.yes" : "markExclusion.active.no",
                defaultMessage: active ? "Y" : "N"
              })
            }
          );
        }
      },
      {
        key: "cStatus",
        label: intl.formatMessage({
          id: "markExclusion.grid.status",
          defaultMessage: "Status"
        }),
        render: (row) => {
          const meta = statusMeta(row.cStatus, intl);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: meta.sx, children: meta.label });
        }
      },
      {
        key: "szDecisionBy",
        label: intl.formatMessage({
          id: "markExclusion.grid.decisionBy",
          defaultMessage: "Decision By"
        }),
        render: (row) => asText(row.szDecisionBy)
      },
      {
        key: "dtDecisionDate",
        label: intl.formatMessage({
          id: "markExclusion.grid.decisionDate",
          defaultMessage: "Decision Date"
        }),
        render: (row) => fmtDate(row.dtDecisionDate)
      }
    ],
    [intl, leafOptions]
  );
  const rows = rowData || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AE,
    {
      title: intl.formatMessage({
        id: "markExclusion.section.history",
        defaultMessage: "Exclusion History"
      }),
      loading,
      sx: { borderRadius: "6px", minWidth: 0, width: "100%" },
      bodySx: {
        p: 0,
        minHeight: 120,
        minWidth: 0,
        width: "100%",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Dt,
        {
          sx: {
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
              maxHeight: 460
            }
          },
          children: rows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              component: "table",
              sx: {
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
                  verticalAlign: "middle"
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
                  textOverflow: "ellipsis"
                },
                "& tbody tr:nth-of-type(even)": {
                  background: "color-mix(in srgb, var(--drs-text-secondary) 4%, transparent)"
                },
                "& tbody tr:hover": {
                  background: "var(--drs-hover-bg)"
                },
                "@media (max-width: 700px)": {
                  display: "block",
                  width: "100%",
                  minWidth: 0,
                  tableLayout: "auto",
                  "& thead": {
                    display: "none"
                  },
                  "& tbody, & tr, & td": {
                    display: "block",
                    width: "100%",
                    minWidth: 0
                  },
                  "& tr": {
                    borderBottom: "1px solid var(--drs-border-divider)",
                    px: 1.5,
                    py: 1.25
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
                    whiteSpace: "normal"
                  },
                  "& td::before": {
                    content: "attr(data-label)",
                    color: "var(--drs-text-secondary)",
                    fontSize: 10,
                    fontWeight: 700
                  }
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: col.label }, col.key)) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": col.label, children: col.render(row) }, col.key)) }, row.gridRowId)) })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                minHeight: 112,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                color: "var(--drs-text-secondary)",
                fontSize: 12,
                fontWeight: 600
              },
              children: intl.formatMessage({
                id: "markExclusion.history.empty",
                defaultMessage: "No exclusion history for this account."
              })
            }
          )
        }
      )
    }
  );
}
const MARK_EXCLUSION_ACTION_TYPES = [
  { value: "SMS", labelId: "markExclusion.actionType.sms" },
  { value: "Mail", labelId: "markExclusion.actionType.mail" },
  { value: "Other", labelId: "markExclusion.actionType.other" },
  { value: "Workflow", labelId: "markExclusion.actionType.workflow" }
];
const MARK_EXCLUSION_CATEGORY_BY_TYPE = {
  Workflow: ["Early Collection", "Late Collection"],
  SMS: ["Promotional", "Informational"],
  Mail: ["Promotional", "Informational"],
  Other: ["Promotional", "Informational"]
};
function parseToDayjs(value) {
  if (value == null || value === "") return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;
  if (typeof value === "string") {
    const d2 = dayjs(value);
    return d2.isValid() ? d2 : null;
  }
  if (Array.isArray(value) && value.length >= 3) {
    const d2 = dayjs(new Date(value[0], value[1] - 1, value[2]));
    return d2.isValid() ? d2 : null;
  }
  const d = dayjs(value);
  return d.isValid() ? d : null;
}
function toIsoDate(d) {
  if (d == null) return null;
  const x = dayjs.isDayjs(d) ? d : dayjs(d);
  if (!x.isValid()) return null;
  return x.format("YYYY-MM-DD");
}
function parseResponseJson(raw) {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}
function normalizedKey$1(value) {
  return String(value || "").toLowerCase();
}
function firstArrayByKeys(source, keys) {
  if (!source || typeof source !== "object") return [];
  const wanted = new Set(keys.map(normalizedKey$1));
  for (const [key, value] of Object.entries(source)) {
    if (!wanted.has(normalizedKey$1(key))) continue;
    if (Array.isArray(value)) return value;
    const parsed = parseResponseJson(value);
    if (Array.isArray(parsed)) return parsed;
  }
  for (const value of Object.values(source)) {
    const parsed = parseResponseJson(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const nested = firstArrayByKeys(parsed, keys);
      if (nested.length) return nested;
    }
  }
  return [];
}
function toYesNoFlag(value, fallback = "N") {
  if (value == null || value === "") return fallback;
  const normalized = String(value).trim().toUpperCase();
  if (["Y", "YES", "TRUE", "1", "ACTIVE"].includes(normalized)) return "Y";
  if (["N", "NO", "FALSE", "0", "INACTIVE"].includes(normalized)) return "N";
  return fallback;
}
function getNoteText(entity) {
  return entity.szRemarks || entity.szRemark || entity.szNotes || entity.szNote || entity.remarks || entity.remark || entity.notes || entity.note || entity.REMARKS || entity.REMARK || entity.NOTES || entity.NOTE || "";
}
function getAllowedCategories(actionType) {
  return MARK_EXCLUSION_CATEGORY_BY_TYPE[String(actionType || "").trim()] || [];
}
function normalizeActionCategory(row) {
  const category = String(row.szActionCategory || "").trim();
  if (!category) return "";
  return getAllowedCategories(row.szActionType).includes(category) ? category : "";
}
function mapExclusionEntityToRow(entity) {
  const seq = entity.lnExclSeqNo ?? entity.iExclSeqNo;
  const activeValue = entity.chActive ?? entity.ChActive ?? entity.chactive ?? entity.ChACTIVE ?? entity.Ch_ACTIVE ?? entity.cActive ?? entity.SZ_ACTIVE ?? entity.cExcluded ?? entity.C_EXCLUDED ?? entity.excluded ?? entity.EXCLUDED ?? entity.activeYn ?? entity.ACTIVE_YN;
  return {
    rowKey: seq != null ? `ex-${seq}` : `tmp-${Date.now()}`,
    lnExclSeqNo: seq ?? null,
    szActionType: entity.szActionType || "",
    szActionCategory: entity.szActionCategory || "",
    szActionLeaf: entity.szActionLeaf || entity.szActionCode || "",
    dtExcludedFrom: parseToDayjs(entity.dtExcludedFrom),
    dtExcludedTill: parseToDayjs(entity.dtExcludedTill),
    szReasonCode: entity.szReasonCode || "",
    szRemarks: getNoteText(entity),
    excluded: toYesNoFlag(activeValue, "N") === "Y",
    dirty: false
  };
}
function mapHistoryEntityToGridRow(entity, index) {
  const activeValue = entity.chActive ?? entity.ChActive ?? entity.chactive ?? entity.ChACTIVE ?? entity.Ch_ACTIVE ?? entity.cActive ?? entity.CActive ?? entity.cactive ?? entity.CACTIVE ?? entity.C_ACTIVE ?? entity.szActive ?? entity.SZ_ACTIVE ?? entity.flgActive ?? entity.FLG_ACTIVE ?? entity.active ?? entity.ACTIVE ?? entity.cExcluded ?? entity.C_EXCLUDED ?? entity.excluded ?? entity.EXCLUDED ?? entity.activeYn ?? entity.ACTIVE_YN;
  return {
    gridRowId: entity.lnExclHisSeqNo ?? entity.iExclHisSeqNo ?? entity.lnExclSeqNo ?? entity.iExclSeqNo ?? index,
    szActionType: entity.szActionType || entity.actionType || entity.ACTION_TYPE || "",
    szActionCategory: entity.szActionCategory || entity.actionCategory || entity.ACTION_CATEGORY || "",
    szActionLeaf: entity.szActionLeaf || entity.szActionCode || entity.actionLeaf || entity.actionCode || entity.ACTION_LEAF || entity.ACTION_CODE || "",
    dtExcludedFrom: entity.dtExcludedFrom || entity.excludedFrom || entity.DT_EXCLUDED_FROM,
    dtExcludedTill: entity.dtExcludedTill || entity.excludedTill || entity.DT_EXCLUDED_TILL,
    szReasonCode: entity.szReasonCode || entity.reasonCode || entity.REASON_CODE || "",
    szRemarks: getNoteText(entity),
    chActive: toYesNoFlag(activeValue, "N"),
    cActive: toYesNoFlag(activeValue, "N"),
    cStatus: entity.cStatus || entity.szStatus || entity.status || entity.STATUS || "",
    szCreatedBy: entity.szCreatedBy || entity.createdBy || entity.szUserId || entity.userId || entity.CREATED_BY || "",
    dtCreatedOn: entity.dtCreatedOn || entity.createdOn || entity.DT_CREATED_ON,
    szDecisionBy: entity.szDecisionBy || entity.szApprovedBy || entity.szAuthorizedBy || entity.decisionBy || entity.approvedBy || entity.authorizedBy || entity.DECISION_BY || "",
    dtDecisionDate: entity.dtDecisionDate || entity.dtApprovedOn || entity.dtAuthorizedOn || entity.decisionDate || entity.approvedOn || entity.authorizedOn || entity.DT_DECISION_DATE || ""
  };
}
function normalizeFetchPayload(data) {
  const raw = parseResponseJson(data == null ? void 0 : data.responseJson);
  const payload = raw ?? data;
  if (payload == null) {
    return {
      exclusions: [],
      exclusionHistory: []
    };
  }
  if (Array.isArray(payload)) {
    return {
      exclusions: payload,
      exclusionHistory: []
    };
  }
  if (typeof payload === "object") {
    const ex = firstArrayByKeys(payload, [
      "exclusions",
      "lstExclusion",
      "lstExclusions",
      "lstExclusionDto",
      "lstExclusionDtos",
      "exclusionList",
      "exclusionDtoList",
      "activeExclusions",
      "lstActiveExclusion",
      "lstActiveExclusions"
    ]);
    const his = firstArrayByKeys(payload, [
      "exclusionHistory",
      "exclusionHistories",
      "lstExclusionHistory",
      "lstExclusionHistories",
      "lstExclusionHistoryDto",
      "lstExclusionHistoryDtos",
      "lstExclusionHis",
      "lstExclusionHisDto",
      "lstExclusionHisDtos",
      "exclusionHistoryList",
      "history",
      "historyList",
      "lstHistory",
      "lstHistories"
    ]);
    return {
      exclusions: Array.isArray(ex) ? ex : [],
      exclusionHistory: Array.isArray(his) ? his : []
    };
  }
  return {
    exclusions: [],
    exclusionHistory: []
  };
}
function isApiSuccess(data) {
  if (!data) return false;
  if (data.success === true) return true;
  const s = data.status;
  if (typeof s === "string") return s.toLowerCase() === "success";
  return s === 200 || s === "200";
}
function buildExclusionSaveList(rows) {
  const out = [];
  for (const row of rows) {
    const seq = row.lnExclSeqNo;
    const activeFlag = row.excluded === true ? "Y" : "N";
    const from = toIsoDate(row.dtExcludedFrom);
    const till = toIsoDate(row.dtExcludedTill);
    const base = {
      szActionType: String(row.szActionType || "").trim(),
      szActionCategory: normalizeActionCategory(row),
      szActionLeaf: String(row.szActionLeaf || "").trim(),
      szReasonCode: String(row.szReasonCode || "").trim(),
      szRemarks: String(row.szRemarks || "").trim(),
      dtExcludedFrom: from,
      dtExcludedTill: till,
      chActive: activeFlag
    };
    if (seq == null) {
      out.push({ ...base, szMode: "I" });
    } else if (row.dirty) {
      out.push({ ...base, szMode: "U", lnExclSeqNo: seq });
    }
  }
  return out;
}
function buildFetchWrapper() {
  return {};
}
function buildSaveWrapper(lstExclusionDto) {
  return {
    exclusionRequestDto: {
      lstExclusionDto
    }
  };
}
function newEmptyRow() {
  return {
    rowKey: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    lnExclSeqNo: null,
    szActionType: "",
    szActionCategory: "",
    szActionLeaf: "",
    dtExcludedFrom: null,
    dtExcludedTill: null,
    szReasonCode: "",
    szRemarks: "",
    excluded: true,
    dirty: true
  };
}
function rowNeedsValidation(row) {
  var _a, _b;
  if (!((_a = row.szActionType) == null ? void 0 : _a.trim())) return true;
  const allowedCategories = getAllowedCategories(row.szActionType);
  if (allowedCategories.length > 0 && !normalizeActionCategory(row)) return true;
  if (!String(row.szActionLeaf || "").trim()) return true;
  if (!row.dtExcludedFrom || !row.dtExcludedTill) return true;
  if (!((_b = row.szReasonCode) == null ? void 0 : _b.trim())) return true;
  return false;
}
function isDateOrderInvalid(row) {
  if (!row.dtExcludedFrom || !row.dtExcludedTill) return false;
  const a = dayjs(row.dtExcludedFrom);
  const b = dayjs(row.dtExcludedTill);
  if (!a.isValid() || !b.isValid()) return false;
  return b.isBefore(a, "day");
}
function serializeRowsForCompare(rows) {
  return JSON.stringify(
    (rows || []).map((r) => ({
      rowKey: r.rowKey,
      lnExclSeqNo: r.lnExclSeqNo,
      szActionType: r.szActionType,
      szActionCategory: r.szActionCategory,
      szActionLeaf: r.szActionLeaf,
      szReasonCode: r.szReasonCode,
      szRemarks: r.szRemarks,
      excluded: r.excluded,
      from: toIsoDate(r.dtExcludedFrom),
      till: toIsoDate(r.dtExcludedTill)
    }))
  );
}
function unwrapDropdownPayload(data) {
  var _a;
  const raw = (data == null ? void 0 : data.responseJson) ?? ((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.responseJson) ?? data;
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}
function optionValue(item) {
  if (item == null) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(
    item.szReasonCode || item.szreasontype || item.szReasonType || item.reasonCode || item.reasonType || item.szActionCode || item.szCondition || item.code || item.szCode || item.value || item.label || ""
  );
}
function optionLabel(item, value, intl) {
  var _a;
  if (item && typeof item === "object") {
    const label = item.szReasonDesc || item.szreasondesc || item.reasonDesc || item.reasonDescription || item.szActionDesc || item.szDesc || item.szi18nDesc || item.szi18nDescription || item.szDescription || item.description || item.label || value;
    return ((_a = intl.messages) == null ? void 0 : _a[label]) ? intl.formatMessage({ id: label, defaultMessage: label }) : String(label);
  }
  return value;
}
function normalizedKey(value) {
  return String(value || "").toLowerCase();
}
function findDropdownRows(source, keys) {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== "object") return [];
  const wanted = new Set(keys.map(normalizedKey));
  for (const [key, value] of Object.entries(source)) {
    if (!wanted.has(normalizedKey(key))) continue;
    const parsed = unwrapDropdownPayload(value);
    if (Array.isArray(parsed)) return parsed;
  }
  for (const value of Object.values(source)) {
    const parsed = unwrapDropdownPayload(value);
    if (parsed && typeof parsed === "object") {
      const nested = findDropdownRows(parsed, keys);
      if (nested.length) return nested;
    }
  }
  return [];
}
function mapDropdownOptions(payload, keys, intl) {
  const rows = findDropdownRows(payload, keys);
  if (!Array.isArray(rows)) return [];
  return rows.map((item) => {
    const value = optionValue(item).trim();
    if (!value) return null;
    return {
      value,
      label: optionLabel(item, value, intl)
    };
  }).filter(Boolean);
}
function sortHistoryDesc(rows) {
  return [...rows || []].sort((a, b) => {
    const ta = dayjs(a.dtCreatedOn).valueOf();
    const tb = dayjs(b.dtCreatedOn).valueOf();
    return tb - ta;
  });
}
function MarkExclusion() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);
  const [rows, setRows] = reactExports.useState([]);
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [leafOptions, setLeafOptions] = reactExports.useState([]);
  const [reasonOptions, setReasonOptions] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const snapshotRef = reactExports.useRef("");
  const realmHeaders = reactExports.useMemo(() => {
    const tenantId = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    return {
      "X-Tenant-Id": tenantId,
      TenantId: tenantId,
      tenantId,
      "Content-Type": "application/json"
    };
  }, []);
  const actionOptions = reactExports.useMemo(
    () => MARK_EXCLUSION_ACTION_TYPES.map((o) => ({
      value: o.value,
      label: intl.formatMessage({ id: o.labelId, defaultMessage: o.value })
    })),
    [intl]
  );
  const categoryOptions = reactExports.useMemo(
    () => {
      return Object.entries(MARK_EXCLUSION_CATEGORY_BY_TYPE).reduce(
        (acc, [actionType, categories]) => {
          acc[actionType] = categories.map((value) => ({
            value,
            label: intl.formatMessage({
              id: `markExclusion.category.${String(value).toLowerCase().replace(/\s+/g, "")}`,
              defaultMessage: value
            })
          }));
          return acc;
        },
        {}
      );
    },
    [intl]
  );
  const applyHydration = reactExports.useCallback((exclusions, history) => {
    const mapped = (exclusions || []).map(mapExclusionEntityToRow);
    const his = sortHistoryDesc((history || []).map(mapHistoryEntityToGridRow));
    setRows(mapped);
    setHistoryRows(his);
    snapshotRef.current = serializeRowsForCompare(mapped);
  }, []);
  const loadData = reactExports.useCallback(async () => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      setRows([]);
      setHistoryRows([]);
      setLeafOptions([]);
      setReasonOptions([]);
      snapshotRef.current = serializeRowsForCompare([]);
      return;
    }
    setLoading(true);
    try {
      const body = buildFetchWrapper();
      const res = await Kr.GET(
        MarkExclusionAPI.MarkExclusionApi(screenMenuId),
        body,
        {},
        false,
        realmHeaders
      );
      if (res.status === 204) {
        setLeafOptions([]);
        setReasonOptions([]);
        applyHydration([], []);
        return;
      }
      const data = res.data ?? {};
      if (isApiSuccess(data)) {
        const { exclusions, exclusionHistory } = normalizeFetchPayload(data);
        const nextReasonOptions = mapDropdownOptions(
          unwrapDropdownPayload(data),
          [
            "reasonTypes",
            "lstReasonType",
            "lstReasonTypes",
            "reasons",
            "lstReason",
            "lstReasons",
            "lstReasonMaster",
            "lstReasonMasters"
          ],
          intl
        );
        const nextLeafOptions = mapDropdownOptions(
          unwrapDropdownPayload(data),
          ["leafTypes"],
          intl
        );
        setLeafOptions(nextLeafOptions);
        setReasonOptions(nextReasonOptions);
        applyHydration(exclusions, exclusionHistory);
        return;
      }
      const msg = (data == null ? void 0 : data.message) || "";
      if (String(msg).toLowerCase().includes("no data") || res.status === 404) {
        setLeafOptions([]);
        setReasonOptions([]);
        applyHydration([], []);
        return;
      }
      toast.error(
        msg || intl.formatMessage({
          id: "markExclusion.error.fetch",
          defaultMessage: "Could not load exclusions."
        })
      );
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.fetch",
          defaultMessage: "Could not load exclusions."
        })
      );
    } finally {
      setLoading(false);
    }
  }, [applyHydration, intl, realmHeaders, selectedRow, toast]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const isDirty = reactExports.useMemo(
    () => serializeRowsForCompare(rows) !== snapshotRef.current,
    [rows]
  );
  const handleRowChange = reactExports.useCallback((rowKey, field, value) => {
    setRows(
      (prev) => prev.map((r) => {
        if (r.rowKey !== rowKey) return r;
        const next = { ...r, [field]: value };
        if (r.lnExclSeqNo != null) {
          next.dirty = true;
        }
        if (field === "szActionType") {
          next.szActionCategory = "";
        }
        return next;
      })
    );
  }, []);
  const handleAddRow = reactExports.useCallback(() => {
    setRows((prev) => [...prev, newEmptyRow()]);
  }, []);
  const handleRemoveRow = reactExports.useCallback((rowKey) => {
    setRows((prev) => prev.filter((r) => r.rowKey !== rowKey));
  }, []);
  const handleReset = reactExports.useCallback(async () => {
    await loadData();
    toast.success(
      intl.formatMessage({
        id: "markExclusion.reset.done",
        defaultMessage: "Form reset."
      })
    );
    return { data: { status: "Success", success: true } };
  }, [intl, loadData, toast]);
  const validateForSave = reactExports.useCallback(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.noAccount",
          defaultMessage: "Select an account first."
        })
      );
      return false;
    }
    for (const row of rows) {
      if (rowNeedsValidation(row)) {
        toast.error(
          intl.formatMessage({
            id: "markExclusion.error.requiredFields",
            defaultMessage: "Fill all required fields on each active exclusion row."
          })
        );
        return false;
      }
      if (isDateOrderInvalid(row)) {
        toast.error(
          intl.formatMessage({
            id: "markExclusion.error.dateOrder",
            defaultMessage: "Till date must be on or after From date."
          })
        );
        return false;
      }
    }
    const payload = buildExclusionSaveList(rows);
    if (payload.length === 0) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.nothingToSave",
          defaultMessage: "No changes to save."
        })
      );
      return false;
    }
    return true;
  }, [intl, rows, selectedRow, toast]);
  const handleSave = reactExports.useCallback(async () => {
    if (!validateForSave()) {
      return { data: { status: "Failure", success: false, message: "validation" } };
    }
    const lst = buildExclusionSaveList(rows);
    setSaving(true);
    try {
      const body = buildSaveWrapper(lst);
      const res = await Kr.POST(
        `${MarkExclusionAPI.MarkExclusionApi(screenMenuId)}/saveExclusion`,
        body,
        {},
        false,
        realmHeaders
      );
      const data = res.data ?? {};
      if (res.status === 406 || res.status === 400) {
        toast.error(
          (data == null ? void 0 : data.message) || intl.formatMessage({
            id: "markExclusion.error.saveRejected",
            defaultMessage: "Save was rejected."
          })
        );
        return { data: { status: "Failure", success: false, message: data == null ? void 0 : data.message } };
      }
      if (res.status === 204) {
        toast.warning(
          (data == null ? void 0 : data.message) || intl.formatMessage({
            id: "markExclusion.warn.noChanges",
            defaultMessage: "No changes were saved."
          })
        );
        return { data: { status: "Failure", success: false } };
      }
      if (isApiSuccess(data)) {
        toast.success(
          (data == null ? void 0 : data.message) || intl.formatMessage({
            id: "markExclusion.save.success",
            defaultMessage: "Exclusions saved."
          })
        );
        await loadData();
        return { data: { status: "Success", success: true, message: data == null ? void 0 : data.message } };
      }
      toast.error(
        (data == null ? void 0 : data.message) || intl.formatMessage({
          id: "markExclusion.error.save",
          defaultMessage: "Save failed."
        })
      );
      return { data: { status: "Failure", success: false, message: data == null ? void 0 : data.message } };
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.save",
          defaultMessage: "Save failed."
        })
      );
      return { data: { status: "Failure", success: false } };
    } finally {
      setSaving(false);
    }
  }, [intl, loadData, realmHeaders, rows, toast, validateForSave]);
  const handleSaveWrapped = reactExports.useCallback(async () => {
    if (!isDirty) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.nothingToSave",
          defaultMessage: "No changes to save."
        })
      );
      return { data: { status: "Failure", success: false } };
    }
    if (saving) {
      return { data: { status: "Failure", success: false } };
    }
    return handleSave();
  }, [handleSave, intl, isDirty, saving, toast]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "markExclusion.title",
        defaultMessage: "Mark Exclusion"
      }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Stack,
        {
          spacing: 3,
          sx: {
            px: { xs: 1, sm: 2, md: 2 },
            pb: 10,
            pt: 1,
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            background: "var(--drs-bg-page)",
            "& > *": {
              minWidth: 0
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MarkExclusionActiveSection,
              {
                rows,
                onRowChange: handleRowChange,
                onAddRow: handleAddRow,
                onRemoveRow: handleRemoveRow,
                loading,
                actionOptions,
                categoryOptions,
                leafOptions,
                reasonOptions
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MarkExclusionHistoryGrid,
              {
                rowData: historyRows,
                loading,
                leafOptions
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: handleSaveWrapped,
                onReset: handleReset,
                onClose: () => navigate("/homelayout/welcomepage"),
                disableToast: { save: true, reset: true }
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  MarkExclusion as default
};
