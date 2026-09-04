import { ed as useIntl, em as useTheme, $ as $e, dN as reactExports, ef as useLocation, aN as GroupsOutlinedIcon, aX as Kr, bb as MemosAPI, dB as jsxRuntimeExports, aW as Kg, ac as Dt, dK as ps, bH as SE, cB as cc, a3 as DescriptionOutlinedIcon, u as BoltOutlinedIcon, dI as pp, cr as alpha, bu as RE, cw as bE, cy as bu, ct as ar, eh as useNavigate, el as useSelector, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { A as AccountCircleOutlinedIcon, b as memosTextSx, m as memosFontFamily, a as memosGridFontSize } from "./memosStyles-D5VJ0eS1.js";
const transparentSurface$1 = {
  bgcolor: "transparent",
  background: "transparent",
  backgroundColor: "transparent",
  boxShadow: "none"
};
function getNoteTypeValue(item) {
  if (item == null) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(
    item.szCondition || item.code || item.szNoteType || item.szCode || item.value || item.label || ""
  );
}
function getNoteTypeLabel(item, value, intl) {
  var _a;
  if (item && typeof item === "object") {
    const label = item.szi18nDesc || item.szi18nDescription || item.szI18nDesc || item.szI18nDescription || item.szDesc || item.szDescription || item.description || item.label || item.szNoteType || value;
    return ((_a = intl.messages) == null ? void 0 : _a[label]) ? intl.formatMessage({ id: label, defaultMessage: label }) : String(label);
  }
  return value;
}
function mapCustomerNotesTypes(payload, intl) {
  const rows = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.customerNotesTypes) || (payload == null ? void 0 : payload.customerNotesTypeList) || (payload == null ? void 0 : payload.notesTypes) || (payload == null ? void 0 : payload.data) || (payload == null ? void 0 : payload.rows) || [];
  if (!Array.isArray(rows)) return [];
  return rows.map((item) => {
    const value = getNoteTypeValue(item).trim();
    if (!value) return null;
    return {
      value,
      label: getNoteTypeLabel(item, value, intl)
    };
  }).filter(Boolean);
}
function AddNotesForm({
  accountCustLevel,
  setAccountCustLevel,
  interactionType,
  setInteractionType,
  isSticky,
  setIsSticky,
  notes,
  setNotes,
  stickyPreviewText
}) {
  const intl = useIntl();
  const theme = useTheme();
  const { themeVars, surfaces, text, border } = $e();
  const [interactionOptions, setInteractionOptions] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const stickyBannerSx = reactExports.useMemo(
    () => ({
      mb: 0,
      mt: 0.25,
      px: 1.25,
      py: 0.75,
      width: "100%",
      borderRadius: "5px",
      border: 1,
      borderColor: theme.palette.warning.main,
      bgcolor: theme.palette.mode === "dark" ? surfaces.paper : "#fff",
      boxShadow: "none"
    }),
    [surfaces.paper, theme]
  );
  const levelOptions = reactExports.useMemo(
    () => [
      {
        value: "A",
        label: intl.formatMessage({ id: "label.memos.level.account" }),
        Icon: AccountCircleOutlinedIcon
      },
      {
        value: "C",
        label: intl.formatMessage({ id: "label.memos.level.customer" }),
        Icon: GroupsOutlinedIcon
      }
    ],
    [intl]
  );
  reactExports.useEffect(() => {
    let active = true;
    Kr.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotesTypes`).then((res) => {
      var _a;
      if (!active) return;
      const payload = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) ?? (res == null ? void 0 : res.data);
      setInteractionOptions(mapCustomerNotesTypes(payload, intl));
    }).catch(() => {
      if (active) setInteractionOptions([]);
    });
    return () => {
      active = false;
    };
  }, [intl.locale]);
  const levelHint = accountCustLevel === "A" ? intl.formatMessage({ id: "label.memos.levelHint.account" }) : intl.formatMessage({ id: "label.memos.levelHint.customer" });
  const stickyNoteText = stickyPreviewText || intl.formatMessage({ id: "label.memos.noLatestStickyNote" });
  const optionsBoxSx = {
    ...themeVars,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
    minHeight: 32,
    px: 0.75,
    border: 1,
    borderColor: border.divider,
    borderRadius: "5px",
    bgcolor: surfaces.input,
    "&:hover": {
      borderColor: border.hover
    }
  };
  const stickyHintSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.4,
    mt: 0.5,
    color: theme.palette.warning.dark,
    ...memosTextSx,
    lineHeight: 1.2,
    "& .MuiSvgIcon-root": {
      fontSize: 13,
      color: theme.palette.warning.main
    }
  };
  const formGridSx = {
    ...transparentSurface$1,
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    columnGap: 2,
    rowGap: 2.25,
    width: "100%"
  };
  const fieldStackSx = {
    ...transparentSurface$1,
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    minWidth: 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Kg,
    {
      elevation: 0,
      sx: {
        ...themeVars,
        borderRadius: "8px",
        border: 1,
        borderColor: "divider",
        bgcolor: surfaces.paper,
        width: "100%",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...transparentSurface$1, px: 2, py: 2.25, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: formGridSx, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldStackSx, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.memos.field.level",
              translate: true,
              colon: false,
              align: "left",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "accountCustLevel",
              value: accountCustLevel,
              onChange: (e) => setAccountCustLevel(e.target.value),
              options: levelOptions,
              placeholder: intl.formatMessage({ id: "label.memos.level.placeholder" }),
              width: "100%",
              StartIcon: AccountCircleOutlinedIcon
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "p", sx: { m: 0, mt: 0.25, ...memosTextSx, color: text.secondary }, children: levelHint })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldStackSx, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.Memos.Interaction Type",
              translate: true,
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "interactionType",
              value: interactionType,
              onChange: (e) => setInteractionType(e.target.value),
              options: interactionOptions,
              placeholder: intl.formatMessage({ id: "label.memos.interaction.placeholder" }),
              width: "100%"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldStackSx, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.memos.options", translate: true, colon: false, align: "left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: optionsBoxSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            cc,
            {
              id: "memosStickyNote",
              label: "label.memos.markStickyNote",
              checked: isSticky,
              onChange: (e) => setIsSticky(e.target.checked),
              Icon: DescriptionOutlinedIcon,
              labelGap: "4px"
            }
          ) }),
          isSticky ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { component: "p", sx: { m: 0, ...stickyHintSx }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BoltOutlinedIcon, {}),
            intl.formatMessage({ id: "label.memos.stickyPinnedHint" })
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...transparentSurface$1, gridColumn: "1 / -1", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              ...transparentSurface$1,
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              gap: 1
            },
            children: isSticky ? /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { elevation: 0, sx: stickyBannerSx, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...transparentSurface$1, flexDirection: "column", alignItems: "stretch", gap: 0.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  component: "p",
                  sx: {
                    fontSize: "11px",
                    fontFamily: memosFontFamily,
                    fontWeight: 600,
                    m: 0,
                    color: theme.palette.warning.dark
                  },
                  children: intl.formatMessage({ id: "label.memos.latestStickyTitle" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  component: "p",
                  sx: {
                    fontSize: "11px",
                    fontFamily: memosFontFamily,
                    m: 0,
                    fontStyle: "italic",
                    color: theme.palette.warning.dark
                  },
                  children: [
                    '"',
                    stickyNoteText,
                    '"'
                  ]
                }
              )
            ] }) }) : null
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...transparentSurface$1, gridColumn: "1 / -1", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...transparentSurface$1, width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.Memos.Notes",
              translate: true,
              colon: false,
              align: "left",
              required: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            pp,
            {
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: isSticky ? "label.memos.notes.placeholder.sticky" : "label.memos.notes.placeholder",
              width: "100%",
              maxLines: 4
            }
          )
        ] }) })
      ] }) })
    }
  );
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function toCellText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(toCellText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return String(
      value.label || value.value || value.name || value.description || value.message || value.code || ""
    );
  }
  return String(value);
}
const NOTE_TYPE_LABEL_IDS = {
  C: "label.Memos.InteractionType.Call",
  P: "label.Memos.InteractionType.PersonalVisit",
  L: "label.Memos.InteractionType.Letter",
  F: "label.Memos.InteractionType.Fax",
  E: "label.Memos.InteractionType.Email",
  O: "label.Memos.InteractionType.Other"
};
const NOTE_TYPE_FALLBACKS = {
  C: "Call",
  P: "Personal Visit",
  L: "Letter",
  F: "Fax",
  E: "Email",
  O: "Other"
};
function formatNoteType(value, intl) {
  const text = toCellText(value).trim();
  const code = text.toUpperCase();
  const labelId = NOTE_TYPE_LABEL_IDS[code];
  if (!labelId) return text;
  return (intl == null ? void 0 : intl.formatMessage) ? intl.formatMessage({ id: labelId, defaultMessage: NOTE_TYPE_FALLBACKS[code] }) : NOTE_TYPE_FALLBACKS[code];
}
function formatDtNote(dtNote) {
  if (dtNote == null || dtNote === "") return "";
  if (typeof dtNote === "string") {
    const s = dtNote.trim();
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) {
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
      }
    }
    return s;
  }
  if (Array.isArray(dtNote) && dtNote.length >= 3) {
    const [y, m, d, h = 0, min = 0] = dtNote;
    return `${y}-${pad2(m)}-${pad2(d)} ${pad2(h)}:${pad2(min)}`;
  }
  if (typeof dtNote === "object" && dtNote !== null) {
    if ("year" in dtNote && "month" in dtNote && "day" in dtNote) {
      const { year, monthValue, month, dayOfMonth, day, hour = 0, minute = 0 } = dtNote;
      const mo = monthValue ?? month ?? 1;
      const da = dayOfMonth ?? day ?? 1;
      return `${year}-${pad2(mo)}-${pad2(da)} ${pad2(hour)}:${pad2(minute)}`;
    }
  }
  return String(dtNote);
}
function mapNotesHistoryRow(item) {
  if (!item || typeof item !== "object") {
    return {
      dtDisplay: "",
      szCreatedBy: "",
      szLogedInUser: "",
      szNoteType: "",
      szNotes: toCellText(item),
      szresultcod: ""
    };
  }
  const dtNote = item.dtNote || item.dtCreated || item.dtCreatedOn || item.createdDate || item.createdOn;
  const szCreatedBy = item.szCreatedBy || item.szLogedInUser || item.szLoggedInUser || item.createdBy;
  const szNoteType = item.szNoteType || item.szInteractionType || item.interactionType || item.noteType;
  const szNotes = item.szNotes || item.notes || item.note || item.memo;
  return {
    ...item,
    dtDisplay: formatDtNote(dtNote),
    szCreatedBy: toCellText(szCreatedBy),
    szLogedInUser: toCellText(item.szLogedInUser || szCreatedBy),
    szNoteType: toCellText(szNoteType),
    szNotes: toCellText(szNotes),
    szresultcod: toCellText(item.szresultcod)
  };
}
function mapNotesHistoryPayload(payload) {
  const rows = Array.isArray(payload) ? payload : Array.isArray(payload == null ? void 0 : payload.content) ? payload.content : (payload == null ? void 0 : payload.customerNotesList) || (payload == null ? void 0 : payload.customerNotesDtoList) || (payload == null ? void 0 : payload.notesList) || (payload == null ? void 0 : payload.accountNotes) || (payload == null ? void 0 : payload.customerNotes) || (payload == null ? void 0 : payload.data) || (payload == null ? void 0 : payload.rows) || [];
  if (!Array.isArray(rows)) return [];
  return rows.map(mapNotesHistoryRow);
}
function createMemosColumnDefs(intl, theme) {
  const muted = theme.palette.text.secondary;
  const primary = theme.palette.text.primary;
  const zebraOdd = alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.08 : 0.04);
  const baseZebra = (params) => {
    var _a;
    return {
      backgroundColor: ((_a = params == null ? void 0 : params.node) == null ? void 0 : _a.rowIndex) != null && params.node.rowIndex % 2 === 1 ? zebraOdd : "transparent",
      fontSize: memosGridFontSize,
      lineHeight: 1.35,
      fontFamily: memosFontFamily
    };
  };
  return [
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Date Time" }),
      field: "dtDisplay",
      valueGetter: (params) => {
        var _a;
        return toCellText((_a = params.data) == null ? void 0 : _a.dtDisplay);
      },
      flex: 1,
      minWidth: 140,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: muted,
        fontWeight: 400
      })
    },
    {
      headerName: intl.formatMessage({
        id: "label.NotesHistory.Collector Name"
      }),
      field: "szCreatedBy",
      valueGetter: (params) => {
        var _a, _b;
        return toCellText(((_a = params.data) == null ? void 0 : _a.szCreatedBy) || ((_b = params.data) == null ? void 0 : _b.szLogedInUser));
      },
      flex: 1,
      minWidth: 120,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 600
      })
    },
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Notes Type" }),
      field: "szNoteType",
      valueGetter: (params) => {
        var _a;
        return formatNoteType((_a = params.data) == null ? void 0 : _a.szNoteType, intl);
      },
      flex: 1,
      minWidth: 140,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 400
      })
    },
    {
      headerName: intl.formatMessage({ id: "label.NotesHistory.Notes" }),
      field: "szNotes",
      valueGetter: (params) => {
        var _a;
        return toCellText((_a = params.data) == null ? void 0 : _a.szNotes);
      },
      flex: 2,
      minWidth: 200,
      sortable: true,
      cellStyle: (params) => ({
        ...baseZebra(params),
        color: primary,
        fontWeight: 400
      })
    }
  ];
}
const gridStyle = {
  width: "100%",
  height: 260,
  minWidth: 0
};
const transparentSurface = {
  bgcolor: "transparent",
  background: "transparent",
  backgroundColor: "transparent",
  boxShadow: "none"
};
function AccountCustomerNotesTabs({
  historyTab,
  setHistoryTab,
  accountRows,
  customerRows,
  loadingAccount,
  loadingCustomer,
  accountTotalElements,
  customerTotalElements,
  accountDatasource,
  customerDatasource,
  notesPageSize = 7,
  refreshVersion = 0
}) {
  const intl = useIntl();
  const theme = useTheme();
  const columnDefs = reactExports.useMemo(() => createMemosColumnDefs(intl, theme), [intl, theme]);
  const accountLabel = intl.formatMessage({ id: "label.memos.tab.accountNotes" });
  const customerLabel = intl.formatMessage({ id: "label.memos.tab.customerNotes" });
  const accountCount = Number.isFinite(Number(accountTotalElements)) ? Number(accountTotalElements) : accountRows.length;
  const customerCount = Number.isFinite(Number(customerTotalElements)) ? Number(customerTotalElements) : customerRows.length;
  const tabScrollSx = reactExports.useMemo(
    () => ({
      maxHeight: 260,
      overflow: "auto",
      width: "100%",
      ...transparentSurface,
      "& .ag-header": {
        backgroundColor: alpha(
          theme.palette.text.primary,
          theme.palette.mode === "dark" ? 0.08 : 0.06
        )
      },
      "& .ag-header-cell": {
        fontSize: "10px",
        fontWeight: 600,
        color: theme.palette.text.primary
      }
    }),
    [theme]
  );
  const tabsSx = reactExports.useMemo(
    () => ({
      minHeight: 36,
      borderColor: "divider",
      "& .MuiTabs-indicator": {
        backgroundColor: "primary.main"
      },
      "& .MuiTab-root": {
        minHeight: 28,
        ...memosTextSx,
        textTransform: "none",
        fontWeight: 600,
        color: "text.secondary",
        borderRadius: "6px",
        px: 1.25
      },
      "& .MuiTab-root.Mui-selected": {
        color: "primary.main",
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.06)
      }
    }),
    [theme]
  );
  const renderTabLabel = (label, count, Icon) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      component: "span",
      sx: {
        display: "inline-flex",
        alignItems: "center",
        gap: 0.55,
        fontFamily: memosFontFamily
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 14 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            component: "span",
            sx: { ...memosTextSx, color: "inherit", fontWeight: 600 },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            component: "span",
            sx: {
              minWidth: 18,
              height: 18,
              px: 0.65,
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.08),
              color: "text.secondary",
              fontFamily: memosFontFamily,
              fontSize: "10px",
              fontWeight: 600,
              lineHeight: 1
            },
            children: count
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      elevation: 0,
      sx: {
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        width: "100%",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              ...transparentSurface,
              px: 2,
              pb: 1.25,
              pt: 1,
              width: "100%",
              borderBottom: 1,
              borderColor: "divider"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              RE,
              {
                value: historyTab,
                onChange: (_, v) => setHistoryTab(v),
                variant: "scrollable",
                scrollButtons: "auto",
                sx: tabsSx,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    bE,
                    {
                      label: renderTabLabel(accountLabel, accountCount, AccountCircleOutlinedIcon),
                      id: "memos-tab-account",
                      "aria-controls": "memos-panel-account"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    bE,
                    {
                      label: renderTabLabel(customerLabel, customerCount, GroupsOutlinedIcon),
                      id: "memos-tab-customer",
                      "aria-controls": "memos-panel-customer"
                    }
                  )
                ]
              }
            )
          }
        ),
        historyTab === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            id: "memos-panel-account",
            role: "tabpanel",
            "aria-labelledby": "memos-tab-account",
            sx: tabScrollSx,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              bu,
              {
                rowData: accountRows,
                columnDefs,
                gridStyle,
                rowModelType: "infinite",
                datasource: accountDatasource,
                cacheBlockSize: notesPageSize,
                maxBlocksInCache: 2,
                pagination: true,
                paginationPageSize: notesPageSize,
                domLayout: "normal",
                sort: true,
                isLoading: loadingAccount,
                embeddedInSection: true,
                showTitle: false
              },
              `memos-account-${refreshVersion}`
            )
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            id: "memos-panel-customer",
            role: "tabpanel",
            "aria-labelledby": "memos-tab-customer",
            sx: tabScrollSx,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              bu,
              {
                rowData: customerRows,
                columnDefs,
                gridStyle,
                rowModelType: "infinite",
                datasource: customerDatasource,
                cacheBlockSize: notesPageSize,
                maxBlocksInCache: 2,
                pagination: true,
                paginationPageSize: notesPageSize,
                domLayout: "normal",
                sort: true,
                isLoading: loadingCustomer,
                embeddedInSection: true,
                showTitle: false
              },
              `memos-customer-${refreshVersion}`
            )
          }
        )
      ]
    }
  );
}
const NOTES_PAGE_SIZE = 7;
function pickLatestNoteSnippet(rows) {
  const latest = pickLatestGridNote(rows);
  return latest ? toStickySnippet(latest) : null;
}
function toDateTime(value) {
  if (value == null || value === "") return null;
  if (Array.isArray(value) && value.length >= 3) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    const time2 = new Date(year, Number(month) - 1, day, hour, minute, second).getTime();
    return Number.isNaN(time2) ? null : time2;
  }
  if (typeof value === "object") {
    const { year, monthValue, month, dayOfMonth, day, hour = 0, minute = 0, second = 0 } = value;
    if (year && (monthValue || month) && (dayOfMonth || day)) {
      const time2 = new Date(year, Number(monthValue ?? month) - 1, dayOfMonth ?? day, hour, minute, second).getTime();
      return Number.isNaN(time2) ? null : time2;
    }
    return null;
  }
  const normalized = String(value).trim().replace(" ", "T");
  const time = new Date(normalized).getTime();
  return Number.isNaN(time) ? null : time;
}
function getRowTime(row) {
  return toDateTime(row == null ? void 0 : row.dtNote) ?? toDateTime(row == null ? void 0 : row.dtCreated) ?? toDateTime(row == null ? void 0 : row.dtCreatedOn) ?? toDateTime(row == null ? void 0 : row.createdDate) ?? toDateTime(row == null ? void 0 : row.createdOn) ?? toDateTime(row == null ? void 0 : row.dtDisplay);
}
function pickLatestGridNote(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  let latest = null;
  rows.forEach((row, index) => {
    if (!row || !row.szNotes) return;
    const text = String(row.szNotes).trim();
    if (!text) return;
    const time = getRowTime(row);
    if (!latest || time != null && latest.time == null || time != null && latest.time != null && time > latest.time || time != null && latest.time != null && time === latest.time && index < latest.index || time == null && latest.time == null && index < latest.index) {
      latest = { text, time, index };
    }
  });
  return (latest == null ? void 0 : latest.text) || null;
}
function toStickySnippet(text) {
  if (!text) return null;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}
function buildCustomerNotesDto({
  szNoteType = "",
  szNotes = "",
  szIsStickyNote = "N",
  szAccountCustLevel = "A"
} = {}) {
  return {
    szNoteType,
    szNotes,
    szIsStickyNote,
    szAccountCustLevel
  };
}
function MemosContent() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [accountCustLevel, setAccountCustLevel] = reactExports.useState("A");
  const [interactionType, setInteractionType] = reactExports.useState("");
  const [isSticky, setIsSticky] = reactExports.useState(false);
  const [notes, setNotes] = reactExports.useState("");
  const [historyTab, setHistoryTab] = reactExports.useState(0);
  const [accountRows, setAccountRows] = reactExports.useState([]);
  const [customerRows, setCustomerRows] = reactExports.useState([]);
  const [loadingAccount, setLoadingAccount] = reactExports.useState(false);
  const [loadingCustomer, setLoadingCustomer] = reactExports.useState(false);
  const [accountTotalElements, setAccountTotalElements] = reactExports.useState(0);
  const [customerTotalElements, setCustomerTotalElements] = reactExports.useState(0);
  const [refreshVersion, setRefreshVersion] = reactExports.useState(0);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const extractRowsAndTotal = reactExports.useCallback((res) => {
    const body = res == null ? void 0 : res.data;
    const responseJson = body == null ? void 0 : body.responseJson;
    const rows = mapNotesHistoryPayload(responseJson);
    const total = Number(
      (body == null ? void 0 : body.totalElements) ?? (body == null ? void 0 : body.totalCount) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalCount) ?? rows.length
    );
    return {
      rows,
      total: Number.isFinite(total) ? total : rows.length
    };
  }, []);
  const loadGrids = reactExports.useCallback(() => {
    if (!selectedRow) {
      setAccountRows([]);
      setCustomerRows([]);
      setAccountTotalElements(0);
      setCustomerTotalElements(0);
      setLoadingAccount(false);
      setLoadingCustomer(false);
      return;
    }
    const accPayload = {
      "customerNotesDto.szAccountCustLevel": "A",
      "customerNotesDto.szNoteType": "",
      "customerNotesDto.szNotes": "",
      "customerNotesDto.szIsStickyNote": "N",
      pageNumber: 1,
      size: NOTES_PAGE_SIZE,
      pageSize: NOTES_PAGE_SIZE
    };
    const custPayload = {
      "customerNotesDto.szAccountCustLevel": "C",
      "customerNotesDto.szNoteType": "",
      "customerNotesDto.szNotes": "",
      "customerNotesDto.szIsStickyNote": "N",
      pageNumber: 1,
      size: NOTES_PAGE_SIZE,
      pageSize: NOTES_PAGE_SIZE
    };
    setLoadingAccount(true);
    setLoadingCustomer(true);
    console.log("accPayload being sent:", accPayload);
    Promise.allSettled([
      Kr.GET(MemosAPI.MemosApi(screenMenuId), { params: accPayload }),
      Kr.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotes`, { params: custPayload })
    ]).then(([accResult, custResult]) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const accRes = accResult.status === "fulfilled" ? accResult.value : (_a = accResult.reason) == null ? void 0 : _a.response;
      const custRes = custResult.status === "fulfilled" ? custResult.value : (_b = custResult.reason) == null ? void 0 : _b.response;
      if (accResult.status === "fulfilled" && ((_c = accRes == null ? void 0 : accRes.data) == null ? void 0 : _c.status) !== "Failure") {
        const { rows, total } = extractRowsAndTotal(accRes);
        setAccountRows(rows);
        setAccountTotalElements(total);
      } else {
        setAccountRows([]);
        setAccountTotalElements(0);
      }
      if (custResult.status === "fulfilled" && ((_d = custRes == null ? void 0 : custRes.data) == null ? void 0 : _d.status) !== "Failure") {
        const { rows, total } = extractRowsAndTotal(custRes);
        setCustomerRows(rows);
        setCustomerTotalElements(total);
      } else {
        setCustomerRows([]);
        setCustomerTotalElements(0);
      }
      const fetchFailed = accResult.status === "rejected" || custResult.status === "rejected" || ((_e = accRes == null ? void 0 : accRes.data) == null ? void 0 : _e.status) === "Failure" || ((_f = custRes == null ? void 0 : custRes.data) == null ? void 0 : _f.status) === "Failure";
      const validationFailed = ((_g = accRes == null ? void 0 : accRes.data) == null ? void 0 : _g.message) === "Validation Failed" || ((_h = custRes == null ? void 0 : custRes.data) == null ? void 0 : _h.message) === "Validation Failed";
      if (fetchFailed && !validationFailed) {
        toast.error(intl.formatMessage({ id: "error.NotesHistory" }));
      }
    }).catch(() => {
      toast.error(intl.formatMessage({ id: "error.NotesHistory" }));
    }).finally(() => {
      setLoadingAccount(false);
      setLoadingCustomer(false);
    });
  }, [extractRowsAndTotal, intl, selectedRow, toast]);
  reactExports.useEffect(() => {
    loadGrids();
  }, [loadGrids, refreshVersion]);
  const accountDatasource = reactExports.useMemo(() => {
    if (!selectedRow) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e, _f;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || NOTES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        const accPayload = {
          "customerNotesDto.szAccountCustLevel": "A",
          pageNumber,
          size,
          pageSize: size
        };
        setLoadingAccount(true);
        try {
          const res = await Kr.GET(MemosAPI.MemosApi(screenMenuId), { params: accPayload });
          if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "Failure") {
            if (((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) === "Validation Failed") {
              handleValidationErrors(intl, toast, (_c = res == null ? void 0 : res.data) == null ? void 0 : _c.responseJson);
            }
            (_d = params.failCallback) == null ? void 0 : _d.call(params);
            return;
          }
          const { rows, total } = extractRowsAndTotal(res);
          setAccountRows(rows);
          setAccountTotalElements(total);
          (_e = params.successCallback) == null ? void 0 : _e.call(params, rows, total);
        } catch {
          (_f = params.failCallback) == null ? void 0 : _f.call(params);
        } finally {
          setLoadingAccount(false);
        }
      }
    };
  }, [extractRowsAndTotal, intl, selectedRow, toast, refreshVersion]);
  const customerDatasource = reactExports.useMemo(() => {
    if (!selectedRow) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e, _f;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || NOTES_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        const custPayload = {
          "customerNotesDto.szAccountCustLevel": "C",
          pageNumber,
          size,
          pageSize: size
        };
        setLoadingCustomer(true);
        try {
          const res = await Kr.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotes`, { params: custPayload });
          if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "Failure") {
            if (((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) === "Validation Failed") {
              handleValidationErrors(intl, toast, (_c = res == null ? void 0 : res.data) == null ? void 0 : _c.responseJson);
            }
            (_d = params.failCallback) == null ? void 0 : _d.call(params);
            return;
          }
          const { rows, total } = extractRowsAndTotal(res);
          setCustomerRows(rows);
          setCustomerTotalElements(total);
          (_e = params.successCallback) == null ? void 0 : _e.call(params, rows, total);
        } catch {
          (_f = params.failCallback) == null ? void 0 : _f.call(params);
        } finally {
          setLoadingCustomer(false);
        }
      }
    };
  }, [extractRowsAndTotal, intl, selectedRow, toast, refreshVersion]);
  const stickyPreviewText = reactExports.useMemo(() => {
    if (!isSticky) return null;
    return pickLatestNoteSnippet(accountCustLevel === "A" ? accountRows : customerRows);
  }, [isSticky, accountCustLevel, accountRows, customerRows]);
  const populateLatestGridNote = reactExports.useCallback(
    (level) => {
      const rows = level === "A" ? accountRows : customerRows;
      setNotes(pickLatestGridNote(rows) || "");
    },
    [accountRows, customerRows]
  );
  const handleAccountCustLevelChange = reactExports.useCallback(
    (level) => {
      setAccountCustLevel(level);
      if (isSticky) {
        populateLatestGridNote(level);
      }
    },
    [isSticky, populateLatestGridNote]
  );
  const handleStickyChange = reactExports.useCallback(
    (checked) => {
      setIsSticky(checked);
      if (checked) {
        populateLatestGridNote(accountCustLevel);
      } else {
        setNotes("");
      }
    },
    [accountCustLevel, populateLatestGridNote]
  );
  const resetForm = reactExports.useCallback(() => {
    setAccountCustLevel("A");
    setInteractionType("");
    setIsSticky(false);
    setNotes("");
  }, []);
  const handleSubmit = reactExports.useCallback(() => {
    const trimmedNotes = (notes || "").trim();
    const trimmedType = (interactionType || "").trim();
    if (!trimmedType) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredInteraction" }));
      return;
    }
    if (!trimmedNotes) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredNote" }));
      return;
    }
    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "error.memos.noAccount" }));
      return;
    }
    const requestData = {
      customerNotesDto: buildCustomerNotesDto({
        szNoteType: trimmedType,
        szNotes: trimmedNotes,
        szIsStickyNote: isSticky ? "Y" : "N",
        szAccountCustLevel: accountCustLevel
      })
    };
    return Kr.POST(`${MemosAPI.MemosApi(screenMenuId)}/addNotes`, requestData).then((res) => {
      var _a, _b, _c, _d;
      const status = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) ?? (res == null ? void 0 : res.status);
      const message = ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.message) ?? ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.responseMessage);
      const isSuccess = status === 200 || status === "200" || String(status).trim().toLowerCase() === "success" || typeof message === "string" && String(message).trim().toLowerCase() === "success";
      if (isSuccess) {
        toast.success(intl.formatMessage({ id: "success.Memos.saved" }));
        const savedRow = mapNotesHistoryPayload([
          {
            dtNote: (/* @__PURE__ */ new Date()).toISOString(),
            szCreatedBy: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
            szNoteType: trimmedType,
            szNotes: trimmedNotes,
            szIsStickyNote: isSticky ? "Y" : "N",
            szAccountCustLevel: accountCustLevel
          }
        ])[0];
        if (accountCustLevel === "A") {
          setAccountRows((rows) => [savedRow, ...rows]);
          setHistoryTab(0);
        } else {
          setCustomerRows((rows) => [savedRow, ...rows]);
          setHistoryTab(1);
        }
        setNotes("");
        setRefreshVersion((v) => v + 1);
      } else if (status === "Failure" || message === "Validation Failed") {
        handleValidationErrors(intl, toast, (_d = res == null ? void 0 : res.data) == null ? void 0 : _d.responseJson);
      } else {
        toast.error(intl.formatMessage({ id: "error.Memos.failed" }));
      }
    }).catch(() => {
      toast.error(intl.formatMessage({ id: "error.Saving.Memos" }));
    });
  }, [
    accountCustLevel,
    interactionType,
    intl,
    isSticky,
    notes,
    selectedRow,
    toast
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "Memos", defaultMessage: "Memos" }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 10, sm: 11 },
            pt: 1,
            width: "100%",
            boxSizing: "border-box",
            bgcolor: "background.default",
            color: "text.primary",
            fontFamily: memosFontFamily,
            backgroundImage: "none"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                  maxWidth: "100%",
                  flex: 1,
                  minHeight: 0,
                  bgcolor: "transparent",
                  background: "transparent",
                  backgroundColor: "transparent",
                  boxShadow: "none"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AddNotesForm,
                    {
                      accountCustLevel,
                      setAccountCustLevel: handleAccountCustLevelChange,
                      interactionType,
                      setInteractionType,
                      isSticky,
                      setIsSticky: handleStickyChange,
                      notes,
                      setNotes,
                      stickyPreviewText
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AccountCustomerNotesTabs,
                    {
                      historyTab,
                      setHistoryTab,
                      accountRows,
                      customerRows,
                      loadingAccount,
                      loadingCustomer,
                      accountTotalElements,
                      customerTotalElements,
                      accountDatasource,
                      customerDatasource,
                      notesPageSize: NOTES_PAGE_SIZE,
                      refreshVersion
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  position: "relative",
                  zIndex: 2e3,
                  bgcolor: "transparent",
                  background: "transparent",
                  backgroundColor: "transparent",
                  boxShadow: "none"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Vg,
                  {
                    onSave: handleSubmit,
                    onReset: resetForm,
                    onClose: () => navigate("/homelayout/welcomepage")
                  }
                )
              }
            )
          ]
        }
      )
    }
  );
}
export {
  MemosContent as default
};
