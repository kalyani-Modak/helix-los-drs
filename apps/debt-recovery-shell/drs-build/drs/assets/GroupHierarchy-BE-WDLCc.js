import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, ac as Dt, dK as ps, b0 as Lg, g as AddIcon, bH as SE, cJ as dc, bI as SEARCH_API_ENDPOINTS, a1 as DeleteOutlineIcon, cm as WarningAmberIcon, bt as PropTypes, ct as ar, dN as reactExports, aQ as IE, O as CloseIcon, L as ChevronRightIcon, aY as LE, cf as Typography, ef as useLocation, eh as useNavigate, aX as Kr, cx as bp, ep as vp, cs as ap, bG as Rp, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { b as GroupHierarchyAPI } from "./apiEndpoints-BEKhabSg.js";
const ArrowDownwardIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z"
}));
const ArrowUpwardIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z"
}));
function emptyHierarchyRow() {
  return {
    id: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    hierarchyCode: "",
    description: "",
    active: true,
    levels: [],
    businessUnitCode: "EXQ"
  };
}
function newLevel(levelNumber) {
  return {
    id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    level: levelNumber,
    roleLabel: "",
    approverUserCode: "",
    approverName: "",
    approvalLimit: null,
    slaHours: null
  };
}
function mapRowsFromResponse(list = []) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    id: item.hierarchyCode || `gh_${Math.random().toString(36).slice(2, 8)}`,
    hierarchyCode: item.hierarchyCode ?? "",
    description: item.description ?? "",
    active: item.active !== false && item.active !== "N",
    businessUnitCode: item.businessUnitCode ?? "EXQ",
    levels: (item.levels || []).map((l, idx) => ({
      id: `l_${item.hierarchyCode}_${l.level ?? idx + 1}`,
      level: l.level ?? idx + 1,
      roleLabel: l.roleLabel ?? "",
      approverUserCode: l.approverUserCode ?? "",
      approverName: l.approverName ?? "",
      approvalLimit: l.approvalLimit ?? null,
      slaHours: l.slaHours ?? null
    }))
  }));
}
function getModifiedBy() {
  return sessionStorage.getItem("SEC_USERNAME") || sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";
}
function normalizeLevel(level, index) {
  return {
    level: level.level ?? index + 1,
    roleLabel: String(level.roleLabel ?? "").trim(),
    approverUserCode: String(level.approverUserCode ?? "").trim(),
    approverName: String(level.approverName ?? "").trim(),
    approvalLimit: level.approvalLimit === "" || level.approvalLimit == null ? null : Number(level.approvalLimit),
    slaHours: level.slaHours === "" || level.slaHours == null ? null : Number(level.slaHours)
  };
}
function mapLevelSave(level, mode, previousApproverUserCode = null) {
  const payload = {
    ...normalizeLevel(level, (level.level || 1) - 1),
    mode
  };
  if (previousApproverUserCode) {
    payload.previousApproverUserCode = previousApproverUserCode;
  }
  return payload;
}
function buildLevelDiff(originalLevels = [], currentLevels = []) {
  const result = [];
  const origByKey = /* @__PURE__ */ new Map();
  originalLevels.forEach((l) => {
    const key = `${l.level}::${l.approverUserCode}`;
    origByKey.set(key, l);
    if (!origByKey.has(`level:${l.level}`)) {
      origByKey.set(`level:${l.level}`, l);
    }
  });
  const usedOrigKeys = /* @__PURE__ */ new Set();
  currentLevels.forEach((curr, idx) => {
    const normalized = normalizeLevel(curr, idx);
    const levelKey = `level:${normalized.level}`;
    const origAtLevel = origByKey.get(levelKey);
    if (!origAtLevel) {
      result.push(mapLevelSave(normalized, "N"));
      return;
    }
    const origKey = `${origAtLevel.level}::${origAtLevel.approverUserCode}`;
    usedOrigKeys.add(origKey);
    usedOrigKeys.add(levelKey);
    const approverChanged = String(origAtLevel.approverUserCode || "") !== normalized.approverUserCode;
    const changed = approverChanged || String(origAtLevel.roleLabel || "") !== normalized.roleLabel || String(origAtLevel.approverName || "") !== normalized.approverName || Number(origAtLevel.approvalLimit ?? NaN) !== Number(normalized.approvalLimit ?? NaN) || Number(origAtLevel.slaHours ?? NaN) !== Number(normalized.slaHours ?? NaN);
    if (changed) {
      result.push(
        mapLevelSave(
          normalized,
          "E",
          approverChanged ? origAtLevel.approverUserCode : null
        )
      );
    } else {
      result.push(mapLevelSave(normalized, "E"));
    }
  });
  originalLevels.forEach((orig) => {
    const stillPresent = currentLevels.some(
      (c) => Number(c.level) === Number(orig.level)
    );
    if (!stillPresent) {
      result.push(
        mapLevelSave(
          {
            level: orig.level,
            roleLabel: orig.roleLabel || "-",
            approverUserCode: orig.approverUserCode,
            approverName: orig.approverName || "",
            approvalLimit: orig.approvalLimit,
            slaHours: orig.slaHours
          },
          "D"
        )
      );
    }
  });
  return result;
}
function buildSavePayload({
  newRows = [],
  updatedRows = [],
  deletedRows = [],
  originalByCode = {}
}) {
  const createdBy = getModifiedBy();
  const payload = [];
  newRows.forEach((row) => {
    const levels = (row.levels || []).map(
      (l, i) => mapLevelSave(normalizeLevel(l, i), "N")
    );
    payload.push({
      hierarchyCode: String(row.hierarchyCode ?? "").trim().toUpperCase(),
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "N",
      createdBy,
      levels
    });
  });
  updatedRows.forEach((row) => {
    const code = String(row.hierarchyCode ?? "").trim().toUpperCase();
    const original = originalByCode[code] || originalByCode[row.id];
    const originalLevels = (original == null ? void 0 : original.levels) || [];
    const levelDiff = buildLevelDiff(originalLevels, row.levels || []);
    payload.push({
      hierarchyCode: code,
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "E",
      createdBy,
      levels: levelDiff.length > 0 ? levelDiff : (row.levels || []).map(
        (l, i) => mapLevelSave(normalizeLevel(l, i), "E")
      )
    });
  });
  deletedRows.forEach((row) => {
    payload.push({
      hierarchyCode: String(row.hierarchyCode ?? "").trim().toUpperCase(),
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "D",
      createdBy,
      levels: []
    });
  });
  return payload;
}
function filterHierarchies(rows, searchQuery, activeOnly) {
  const q = String(searchQuery || "").trim().toLowerCase();
  return (rows || []).filter((r) => {
    if (activeOnly && !r.active) return false;
    if (!q) return true;
    return String(r.hierarchyCode || "").toLowerCase().includes(q) || String(r.description || "").toLowerCase().includes(q);
  });
}
function validateHierarchyRow(row, allRows = []) {
  const code = String(row.hierarchyCode ?? "").trim();
  if (!code) return "error.HierarchyCode.mandatory";
  const desc = String(row.description ?? "").trim();
  if (!desc) return "error.HierarchyDescription.mandatory";
  const dup = allRows.find(
    (r) => r.id !== row.id && String(r.hierarchyCode || "").trim().toUpperCase() === code.toUpperCase()
  );
  if (dup) return "error.HierarchyCode.duplicate";
  return null;
}
function validateLevels(levels = []) {
  if (!levels.length) return "error.GroupHierarchy.levelsRequired";
  const seenRoles = /* @__PURE__ */ new Set();
  for (const level of levels) {
    const roleKey = String((level == null ? void 0 : level.roleLabel) || "").trim().toUpperCase();
    if (!roleKey) continue;
    if (seenRoles.has(roleKey)) {
      return "error.GroupHierarchy.roleDuplicate";
    }
    seenRoles.add(roleKey);
  }
  const invalid = levels.find(
    (l) => !String(l.roleLabel || "").trim() || !String(l.approverUserCode || "").trim()
  );
  if (invalid) return "error.GroupHierarchy.levelIncomplete";
  return null;
}
function definitionLabel(row, intl) {
  var _a, _b, _c;
  const n = ((_a = row == null ? void 0 : row.levels) == null ? void 0 : _a.length) || 0;
  if (n === 0) {
    return intl.formatMessage({
      id: "label.GroupHierarchy.DefineLevels",
      defaultMessage: "+ Define levels"
    });
  }
  const top = ((_b = row.levels[0]) == null ? void 0 : _b.roleLabel) || ((_c = row.levels[0]) == null ? void 0 : _c.approverName) || "";
  return intl.formatMessage(
    {
      id: "label.GroupHierarchy.LevelsSummary",
      defaultMessage: "{count} levels{top}"
    },
    {
      count: n,
      top: top ? ` · Top: ${top}` : ""
    }
  );
}
function getGroupHierarchyColumnDefs(intl, { onOpenDefinition } = {}) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.HierarchyCode",
        defaultMessage: "Hierarchy Code"
      }),
      field: "hierarchyCode",
      flex: 0.9,
      editable: (params) => {
        var _a, _b;
        return ((_a = params.data) == null ? void 0 : _a._isNew) === true || ((_b = params.data) == null ? void 0 : _b.mode) === "N";
      },
      required: true,
      valueSetter: (params) => {
        const next = String(params.newValue ?? "").toUpperCase();
        params.data.hierarchyCode = next;
        return true;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.HierarchyDescription",
        defaultMessage: "Hierarchy Description"
      }),
      field: "description",
      flex: 1.4,
      editable: true,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.Definition",
        defaultMessage: "Definition"
      }),
      field: "definition",
      flex: 1.1,
      editable: false,
      sortable: false,
      cellRenderer: (params) => {
        if (!(params == null ? void 0 : params.data)) return "";
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "group-hierarchy-definition-link",
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenDefinition == null ? void 0 : onOpenDefinition(params.data);
            },
            children: definitionLabel(params.data, intl)
          }
        );
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.Active",
        defaultMessage: "Active"
      }),
      field: "active",
      flex: 0.45,
      editable: true,
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      valueSetter: (params) => {
        const val = params.newValue;
        if (typeof val === "boolean") {
          params.data.active = val;
        } else {
          const str = String(val ?? "").trim().toLowerCase();
          params.data.active = ["y", "yes", "true", "1", "on"].includes(str);
        }
        return true;
      }
    }
  ];
}
const renumber = (rows) => rows.map((r, i) => ({ ...r, level: i + 1 }));
const approverGridDefObj = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 130,
    gridColumnHeight: 20
  },
  {
    gridMappingName: "szcollectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 170,
    gridColumnHeight: 20
  }
];
const LevelLadder = ({ levels, roleOptions = [], onChange, warnings = {} }) => {
  const intl = useIntl();
  const move = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= levels.length) return;
    const copy = [...levels];
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    onChange(renumber(copy));
  };
  const patch = (id, partial) => onChange(levels.map((l) => l.id === id ? { ...l, ...partial } : l));
  const remove = (id) => onChange(renumber(levels.filter((l) => l.id !== id)));
  const add = () => onChange([...levels, newLevel(levels.length + 1)]);
  if (levels.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.GroupHierarchy.NoLevelsYet",
            defaultMessage: "No levels defined yet."
          }),
          colon: false
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: "label.GroupHierarchy.AddFirstLevel",
          onClick: add,
          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { fontSize: "small" }),
          size: "small",
          variant: "outlined"
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-ladder-connector", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "group-hierarchy-ladder-list", children: levels.map((lvl, idx) => {
      const warn = warnings[lvl.id];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: `group-hierarchy-ladder-item${warn ? " is-warn" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `group-hierarchy-ladder-dot${idx === 0 ? " is-top" : ""}`,
                "aria-hidden": true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-card-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-level-badge", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: `L${lvl.level}` }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-fields", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-field", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.GroupHierarchy.Role",
                          defaultMessage: "Role / Designation"
                        }),
                        colon: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SE,
                      {
                        id: `gh-role-${lvl.id}`,
                        name: `gh-role-${lvl.id}`,
                        options: roleOptions,
                        value: lvl.roleLabel || "",
                        onChange: (e) => {
                          var _a;
                          return patch(lvl.id, { roleLabel: ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) || "" });
                        },
                        placeholder: intl.formatMessage({
                          id: "label.GroupHierarchy.RolePlaceholder",
                          defaultMessage: "Select role"
                        }),
                        width: "100%"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-field", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.GroupHierarchy.Approver",
                          defaultMessage: "Approver"
                        }),
                        colon: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      dc,
                      {
                        apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
                        searchCode: "USERCD",
                        selectedValue: lvl.approverUserCode || "",
                        selectedColumn: "collectorcode",
                        gridDefObj: approverGridDefObj,
                        gridWidth: 260,
                        gridHeight: 220,
                        gridNoOfRowsPerPage: 5,
                        searchBoxWidth: "100%",
                        searchBoxHeight: 28,
                        searchBoxFontSize: 12,
                        setSelectedValue: (code, row) => {
                          if (!code && !row && lvl.approverUserCode) {
                            return;
                          }
                          patch(lvl.id, {
                            approverUserCode: code || "",
                            approverName: (row == null ? void 0 : row.szcollectorname) || (row == null ? void 0 : row.collectorname) || (row == null ? void 0 : row.name) || code || ""
                          });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-actions", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "group-hierarchy-icon-btn",
                      disabled: idx === 0,
                      onClick: () => move(idx, -1),
                      "aria-label": intl.formatMessage({
                        id: "label.GroupHierarchy.MoveUp",
                        defaultMessage: "Move up"
                      }),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpwardIcon, { fontSize: "inherit" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "group-hierarchy-icon-btn",
                      disabled: idx === levels.length - 1,
                      onClick: () => move(idx, 1),
                      "aria-label": intl.formatMessage({
                        id: "label.GroupHierarchy.MoveDown",
                        defaultMessage: "Move down"
                      }),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownwardIcon, { fontSize: "inherit" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "group-hierarchy-icon-btn is-danger",
                      onClick: () => remove(lvl.id),
                      "aria-label": intl.formatMessage({
                        id: "label.GroupHierarchy.RemoveLevel",
                        defaultMessage: "Remove level"
                      }),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { fontSize: "inherit" })
                    }
                  )
                ] })
              ] }),
              warn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-ladder-warn", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WarningAmberIcon, { fontSize: "inherit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: warn })
              ] }) : null
            ] })
          ]
        },
        lvl.id
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-ladder-add", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Lg,
      {
        label: "label.GroupHierarchy.AddLevel",
        onClick: add,
        startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { fontSize: "small" }),
        size: "small",
        variant: "outlined"
      }
    ) })
  ] });
};
LevelLadder.propTypes = {
  levels: PropTypes.array.isRequired,
  roleOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  warnings: PropTypes.object
};
const HierarchyDefinitionDrawer = ({ open, hierarchy, roleOptions = [], onClose, onSave }) => {
  const intl = useIntl();
  const toast = ar();
  const [levels, setLevels] = reactExports.useState([]);
  const [dirty, setDirty] = reactExports.useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (open && hierarchy) {
      setLevels((hierarchy.levels || []).map((l) => ({ ...l })));
      setDirty(false);
      setConfirmDiscardOpen(false);
    }
  }, [open, hierarchy]);
  const warnings = reactExports.useMemo(() => {
    const w = {};
    const seenUsers = /* @__PURE__ */ new Map();
    levels.forEach((l) => {
      if (!l.roleLabel && !l.approverUserCode) return;
      if (!l.approverUserCode) {
        w[l.id] = intl.formatMessage({
          id: "label.GroupHierarchy.WarnPickApprover",
          defaultMessage: "Pick an approver"
        });
      } else if (seenUsers.has(l.approverUserCode)) {
        w[l.id] = intl.formatMessage(
          {
            id: "label.GroupHierarchy.WarnDuplicateApprover",
            defaultMessage: "Same approver as L{level}"
          },
          { level: seenUsers.get(l.approverUserCode) }
        );
      } else {
        seenUsers.set(l.approverUserCode, String(l.level));
      }
    });
    for (let i = 0; i < levels.length - 1; i++) {
      const cur = levels[i];
      const nxt = levels[i + 1];
      if (cur.approvalLimit != null && nxt.approvalLimit != null && Number(cur.approvalLimit) < Number(nxt.approvalLimit)) {
        if (!w[cur.id]) {
          w[cur.id] = intl.formatMessage({
            id: "label.GroupHierarchy.WarnLimitLower",
            defaultMessage: "Limit lower than a subordinate level"
          });
        }
      }
    }
    return w;
  }, [levels, intl]);
  const handleChange = (next) => {
    setLevels(next);
    setDirty(true);
  };
  const attemptClose = () => {
    if (dirty) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose == null ? void 0 : onClose();
  };
  const handleCancelDiscard = () => {
    setConfirmDiscardOpen(false);
  };
  const handleConfirmDiscard = () => {
    setConfirmDiscardOpen(false);
    onClose == null ? void 0 : onClose();
  };
  const handleSave = () => {
    const err = validateLevels(levels);
    if (err) {
      toast.error(
        intl.formatMessage({
          id: err,
          defaultMessage: err === "error.GroupHierarchy.levelsRequired" ? "At least one level is required." : err === "error.GroupHierarchy.roleDuplicate" ? "Same role cannot be used in multiple levels." : "Each level requires role and approver."
        })
      );
      return;
    }
    onSave == null ? void 0 : onSave(levels);
    onClose == null ? void 0 : onClose();
  };
  if (!hierarchy) return null;
  const warnCount = Object.keys(warnings).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    IE,
    {
      anchor: "right",
      open,
      onClose: attemptClose,
      className: "group-hierarchy-drawer",
      PaperProps: { className: "group-hierarchy-drawer-paper" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-drawer-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-drawer-title-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage(
                  {
                    id: "label.GroupHierarchy.DefineTitle",
                    defaultMessage: "Define hierarchy — {code}"
                  },
                  { code: hierarchy.hierarchyCode || "…" }
                ),
                colon: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hierarchy-drawer-subtitle", children: hierarchy.description || "" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "group-hierarchy-icon-btn",
              onClick: attemptClose,
              "aria-label": intl.formatMessage({
                id: "label.GroupHierarchy.Cancel",
                defaultMessage: "Cancel"
              }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, { fontSize: "small" })
            }
          )
        ] }),
        levels.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-chip-strip", children: levels.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-chip-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hierarchy-chip", children: l.roleLabel || `L${l.level}` }),
          i < levels.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRightIcon, { className: "group-hierarchy-chip-sep", fontSize: "inherit" }) : null
        ] }, l.id)) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-drawer-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "group-hierarchy-drawer-helper", children: intl.formatMessage({
            id: "label.GroupHierarchy.LevelHelper",
            defaultMessage: "Level 1 is the highest authority in the chain. Approvals escalate downward through the levels until fully signed off."
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LevelLadder,
            {
              levels,
              roleOptions,
              onChange: handleChange,
              warnings
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-drawer-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-drawer-footer-status", children: warnCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "group-hierarchy-footer-warn", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WarningAmberIcon, { fontSize: "inherit" }),
            intl.formatMessage(
              {
                id: "label.GroupHierarchy.IssuesToReview",
                defaultMessage: "{count} issues to review"
              },
              { count: warnCount }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hierarchy-footer-muted", children: intl.formatMessage(
            {
              id: "label.GroupHierarchy.LevelsConfigured",
              defaultMessage: "{count} levels configured"
            },
            { count: levels.length }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-drawer-footer-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                label: "label.GroupHierarchy.Cancel",
                onClick: attemptClose,
                size: "small",
                variant: "text"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                label: "label.GroupHierarchy.SaveHierarchy",
                onClick: handleSave,
                size: "small",
                variant: "contained",
                disabled: levels.length === 0
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          LE,
          {
            open: confirmDiscardOpen,
            onClose: handleCancelDiscard,
            "aria-labelledby": "group-hierarchy-discard-title",
            title: intl.formatMessage({
              id: "label.GroupHierarchy.UnsavedChanges",
              defaultMessage: "Unsaved changes"
            }),
            titleProps: { id: "group-hierarchy-discard-title" },
            actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "label.GroupHierarchy.Cancel",
                  onClick: handleCancelDiscard,
                  size: "small",
                  variant: "text"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "label.GroupHierarchy.Discard",
                  onClick: handleConfirmDiscard,
                  size: "small",
                  variant: "contained"
                }
              )
            ] }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", children: intl.formatMessage({
              id: "message.GroupHierarchy.DiscardLevelChanges",
              defaultMessage: "Discard unsaved changes to this hierarchy?"
            }) })
          }
        )
      ]
    }
  );
};
HierarchyDefinitionDrawer.propTypes = {
  open: PropTypes.bool,
  hierarchy: PropTypes.object,
  roleOptions: PropTypes.array,
  onClose: PropTypes.func,
  onSave: PropTypes.func
};
const GroupHierarchy = () => {
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const originalByCodeRef = reactExports.useRef({});
  const [allRows, setAllRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [activeOnly, setActiveOnly] = reactExports.useState(false);
  const [editingRow, setEditingRow] = reactExports.useState(null);
  const [roleOptions, setRoleOptions] = reactExports.useState([]);
  const filteredRows = reactExports.useMemo(
    () => {
      const base = filterHierarchies(allRows, searchQuery, activeOnly);
      const q = String(searchQuery || "").trim().toLowerCase();
      if (!q) return base;
      const exactCodeMatches = base.filter(
        (r) => String(r.hierarchyCode || "").trim().toLowerCase() === q
      );
      return exactCodeMatches.length > 0 ? exactCodeMatches : base;
    },
    [allRows, searchQuery, activeOnly]
  );
  const handleOpenDefinition = reactExports.useCallback((row) => {
    setEditingRow({
      ...row,
      levels: Array.isArray(row.levels) ? row.levels : []
    });
  }, []);
  const columnDefs = reactExports.useMemo(
    () => getGroupHierarchyColumnDefs(intl, { onOpenDefinition: handleOpenDefinition }),
    [intl, handleOpenDefinition]
  );
  const loadData = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const response = await Kr.GET(
        GroupHierarchyAPI.GroupHierarchyDetails(screenMenuId)
      );
      const result = response == null ? void 0 : response.data;
      const responseData = result == null ? void 0 : result.data;
      const hierarchyList = Array.isArray(responseData) ? responseData : Array.isArray(responseData == null ? void 0 : responseData.objGroupHierarchyResponseDto) ? responseData.objGroupHierarchyResponseDto : [];
      const mappedRoleOptions = Array.isArray(responseData == null ? void 0 : responseData.lstHierarchyRoles) ? responseData.lstHierarchyRoles.map((item) => {
        const rawKey = String((item == null ? void 0 : item.szi18nDesc) || "").trim();
        const fallback = String((item == null ? void 0 : item.szCondition) || "").trim();
        const roleToken = rawKey ? rawKey.split(".").pop() : "";
        const label = rawKey ? intl.formatMessage({
          id: rawKey,
          defaultMessage: roleToken || fallback || rawKey
        }) : fallback;
        return {
          value: label,
          label
        };
      }) : [];
      if ((result == null ? void 0 : result.success) && Array.isArray(hierarchyList)) {
        const rows = mapRowsFromResponse(hierarchyList);
        const byCode = {};
        rows.forEach((r) => {
          byCode[r.hierarchyCode] = {
            ...r,
            levels: (r.levels || []).map((l) => ({ ...l }))
          };
        });
        originalByCodeRef.current = byCode;
        setAllRows(rows);
        setRoleOptions(mappedRoleOptions);
      } else {
        toast.error(
          (result == null ? void 0 : result.message) || intl.formatMessage({
            id: "message.GroupHierarchy.LoadError",
            defaultMessage: "Error loading group hierarchy."
          })
        );
        setAllRows([]);
        setRoleOptions([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        intl.formatMessage({
          id: "message.GroupHierarchy.LoadError",
          defaultMessage: "Error loading group hierarchy."
        })
      );
      setAllRows([]);
      setRoleOptions([]);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadData();
  }, [loadData]);
  const handleAddHierarchy = reactExports.useCallback(() => {
    const row = {
      ...emptyHierarchyRow(),
      _isNew: true,
      mode: "N",
      active: true,
      levels: []
    };
    setAllRows((prev) => [...prev, row]);
  }, []);
  const handleDefinitionSave = reactExports.useCallback(
    (levels) => {
      var _a;
      if (!editingRow) return;
      const gridRowId = editingRow.gridRowId;
      const id = editingRow.id;
      if (gridRowId != null && ((_a = gridRef.current) == null ? void 0 : _a.updateRowFieldsByGridRowId)) {
        gridRef.current.updateRowFieldsByGridRowId(gridRowId, { levels });
      } else {
        setAllRows(
          (prev) => prev.map((r) => id && r.id === id ? { ...r, levels } : r)
        );
      }
      toast.success(
        intl.formatMessage(
          {
            id: "message.GroupHierarchy.LevelsUpdated",
            defaultMessage: "Hierarchy levels updated. Click Save to commit changes."
          },
          { code: editingRow.hierarchyCode || "" }
        )
      );
    },
    [editingRow, intl, toast]
  );
  const handleSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a, _b, _c, _d;
      try {
        const currentRows = ((_b = (_a = gridRef.current) == null ? void 0 : _a.getCurrentData) == null ? void 0 : _b.call(_a)) || allRows;
        const findCurrentRow = (r) => {
          return currentRows.find(
            (cr) => cr.id != null && cr.id === r.id || cr.gridRowId != null && cr.gridRowId === r.gridRowId || cr.hierarchyCode && cr.hierarchyCode === r.hierarchyCode
          );
        };
        const normalizeRow = (row) => {
          const matched = findCurrentRow(row) || {};
          let rawActive = row.active;
          if (rawActive === void 0 || rawActive === null || rawActive === "") {
            rawActive = matched.active;
          }
          if (rawActive === void 0 || rawActive === null || rawActive === "") {
            rawActive = true;
          }
          let finalActive = false;
          if (rawActive === true || rawActive === 1) finalActive = true;
          else if (typeof rawActive === "string") {
            const lower = rawActive.trim().toLowerCase();
            if (["y", "yes", "true", "1", "on"].includes(lower)) finalActive = true;
          }
          return {
            ...matched,
            ...row,
            hierarchyCode: String(row.hierarchyCode || matched.hierarchyCode || "").trim().toUpperCase(),
            description: String(row.description || matched.description || "").trim(),
            active: finalActive,
            levels: Array.isArray(row.levels) ? row.levels : Array.isArray(matched.levels) ? matched.levels : []
          };
        };
        const isNew = (row) => row._isNew === true || row.mode === "N";
        const fromUpdatedNew = updatedRows.filter(isNew).map(normalizeRow);
        const fromUpdatedEdit = updatedRows.filter((r) => !isNew(r)).map(normalizeRow);
        const normalizedNew = [...newRows.map(normalizeRow), ...fromUpdatedNew];
        const normalizedUpdated = fromUpdatedEdit;
        const normalizedDeleted = deletedRows.filter((r) => !isNew(r)).map(normalizeRow);
        const allForDupCheck = (((_d = (_c = gridRef.current) == null ? void 0 : _c.getCurrentData) == null ? void 0 : _d.call(_c)) || allRows).map(normalizeRow);
        for (const row of [...normalizedNew, ...normalizedUpdated]) {
          const err = validateHierarchyRow(row, allForDupCheck);
          if (err) {
            toast.error(
              intl.formatMessage({
                id: err,
                defaultMessage: err === "error.HierarchyCode.mandatory" ? "Hierarchy Code is required." : err === "error.HierarchyDescription.mandatory" ? "Hierarchy Description is required." : "Duplicate hierarchy code."
              })
            );
            return { success: false };
          }
          const levelErr = validateLevels(row.levels);
          if (levelErr) {
            toast.error(
              intl.formatMessage({
                id: levelErr,
                defaultMessage: levelErr === "error.GroupHierarchy.roleDuplicate" ? "Same role cannot be used in multiple levels." : "Each hierarchy needs at least one complete level (role and approver)."
              })
            );
            return { success: false };
          }
        }
        const payload = buildSavePayload({
          newRows: normalizedNew,
          updatedRows: normalizedUpdated,
          deletedRows: normalizedDeleted,
          originalByCode: originalByCodeRef.current
        });
        if (payload.length === 0) {
          toast.info(
            intl.formatMessage({
              id: "message.GroupHierarchy.NoChanges",
              defaultMessage: "No changes to save."
            })
          );
          return { success: true };
        }
        const response = await Kr.POST(
          GroupHierarchyAPI.GroupHierarchyDetails(screenMenuId),
          payload
        );
        const result = response == null ? void 0 : response.data;
        if ((response == null ? void 0 : response.status) !== 200 || (result == null ? void 0 : result.success) !== true) {
          if (result == null ? void 0 : result.errors) {
            handleValidationErrors(intl, toast, result.errors);
          } else {
            toast.error(
              (result == null ? void 0 : result.message) || intl.formatMessage({
                id: "message.GroupHierarchy.SaveError",
                defaultMessage: "Error while saving Group Hierarchy"
              })
            );
          }
          return { success: false };
        }
        toast.success(
          (result == null ? void 0 : result.message) || intl.formatMessage({
            id: "message.GroupHierarchy.SaveSuccess",
            defaultMessage: "Group Hierarchy saved successfully"
          })
        );
        await loadData();
        return { success: true };
      } catch (err) {
        console.error(err);
        toast.error(
          intl.formatMessage({
            id: "message.GroupHierarchy.SaveError",
            defaultMessage: "Error while saving Group Hierarchy"
          })
        );
        return { success: false };
      }
    },
    [allRows, intl, loadData, toast]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.GroupHierarchy.title",
            defaultMessage: "Group Hierarchy"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          component: "p",
          value: intl.formatMessage({
            id: "label.GroupHierarchy.description",
            defaultMessage: "Define named approval / reporting chains that can be attached to groups, settlements and other workflows."
          }),
          translate: false,
          colon: false,
          align: "left",
          sx: {
            margin: "6px 0 0 0",
            padding: 0,
            fontSize: "12px",
            lineHeight: 1.45
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "group-hierarchy-search-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-search-label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({
              id: "label.GroupHierarchy.Search",
              defaultMessage: "Search"
            }),
            colon: false
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-search-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            id: "group-hierarchy-search",
            value: searchInput,
            onChange: (e) => {
              var _a;
              const next = ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) || "";
              setSearchInput(next);
              if (next.trim() === "") {
                setSearchQuery("");
              }
            },
            onKeyDown: (e) => {
              if ((e == null ? void 0 : e.key) === "Enter") {
                setSearchQuery(searchInput);
              }
            },
            editable: true,
            placeholder: "label.GroupHierarchy.SearchPlaceholder",
            width: "260px"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-active-filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Rp,
        {
          id: "group-hierarchy-active-only",
          label: "label.GroupHierarchy.ActiveOnly",
          checked: activeOnly,
          onChange: (e) => {
            var _a;
            return setActiveOnly(Boolean((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.checked));
          },
          size: "small"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-add-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: "label.GroupHierarchy.AddHierarchy",
          onClick: handleAddHierarchy,
          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { fontSize: "small" }),
          size: "small",
          variant: "outlined"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "group-hierarchy-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: filteredRows,
        columnDefs,
        gridStyle: { width: "100%", height: "57vh", minHeight: "360px" },
        pagination: true,
        paginationPageSize: 10,
        sort: true,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        addCheckBoxes: false,
        globalSearch: false,
        isLoading: loading,
        gridClassName: "drs-list-grid",
        embeddedInSection: true,
        onSave: handleSave,
        overlayNoRowsTemplate: searchQuery || activeOnly ? intl.formatMessage({
          id: "label.GroupHierarchy.NoMatch",
          defaultMessage: "No hierarchies match the current filter."
        }) : intl.formatMessage({
          id: "label.GroupHierarchy.Empty",
          defaultMessage: "No hierarchies yet. Add your first approval chain."
        })
      },
      intl.locale
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: () => {
          var _a, _b, _c, _d;
          const current = ((_b = (_a = gridRef.current) == null ? void 0 : _a.getCurrentData) == null ? void 0 : _b.call(_a)) || [];
          current.filter((r) => r._isNew).forEach((r) => {
            if (r.gridRowId != null) {
              gridRef.current.updateRowFieldsByGridRowId(r.gridRowId, {
                hierarchyCode: r.hierarchyCode ?? ""
              });
            }
          });
          return (_d = (_c = gridRef.current) == null ? void 0 : _c.submitChanges) == null ? void 0 : _d.call(_c);
        },
        onClose: () => navigate("/homelayout/welcomepage"),
        disableToast: { close: true }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HierarchyDefinitionDrawer,
      {
        open: Boolean(editingRow),
        hierarchy: editingRow,
        roleOptions,
        onClose: () => setEditingRow(null),
        onSave: handleDefinitionSave
      }
    )
  ] });
};
export {
  GroupHierarchy as default
};
