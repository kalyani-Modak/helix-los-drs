import { ed as useIntl, dN as reactExports, dD as lE, dB as jsxRuntimeExports, v as Box, cf as Typography, b1 as LinearProgress, cy as bu, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, aX as Kr, bW as StampStrategiesAPI, aM as Grid, cJ as dc, dq as gridStrategyCodeDefObj, bI as SEARCH_API_ENDPOINTS, cg as Ug, cs as ap, dI as pp, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { I as InfoOutlined } from "./InfoOutlined-CYfU0mk7.js";
const gridStyle = {
  width: "100%",
  height: "min(36vh, 320px)",
  minWidth: "280px",
  overflowX: "auto"
};
const compactHeader = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textTransform: "none",
  lineHeight: 1.2
};
const compactCell = {
  fontSize: "11px",
  lineHeight: 1.35,
  paddingTop: "6px",
  paddingBottom: "6px"
};
function StrategyHistoryGrid({ rowData, loading, fetchError }) {
  const intl = useIntl();
  const colDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.date" }),
        field: "dtActivity",
        type: "datetime",
        width: 108,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: lE.DATE, fontFamily: "ui-monospace, monospace" }
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.from" }),
        field: "fromVal",
        flex: 1,
        minWidth: 88,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.to" }),
        field: "toVal",
        flex: 1,
        minWidth: 88,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: lE.TEXT, fontWeight: 500 }
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.till" }),
        field: "tillVal",
        width: 96,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: lE.TEXT, fontFamily: "ui-monospace, monospace" }
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.user" }),
        field: "szCollectorCode",
        width: 100,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: lE.TEXT, fontFamily: "ui-monospace, monospace" }
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.note" }),
        field: "note",
        flex: 2,
        minWidth: 140,
        filter: false,
        tooltipField: "note",
        headerStyle: compactHeader,
        cellStyle: {
          ...compactCell,
          textAlign: lE.TEXT,
          whiteSpace: "normal"
        },
        autoHeight: true
      }
    ],
    [intl]
  );
  const defaultColDef = reactExports.useMemo(
    () => ({
      sortable: true,
      filter: false,
      resizable: true
    }),
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 1 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Typography,
      {
        variant: "overline",
        sx: {
          display: "block",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "text.secondary",
          lineHeight: 1.2
        },
        children: intl.formatMessage({ id: "label.changeStrategy.history.title" })
      }
    ),
    fetchError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block" }, children: fetchError }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx(LinearProgress, { sx: { borderRadius: 1 } }),
    !fetchError && !loading && rowData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "text.secondary", sx: { display: "block" }, children: intl.formatMessage({ id: "label.changeStrategy.history.empty" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          border: 1,
          borderColor: "divider",
          borderRadius: "8px",
          overflow: "hidden",
          bgcolor: (theme) => theme.palette.mode === "dark" ? "action.hover" : "rgba(15, 23, 42, 0.03)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            rowData,
            columnDefs: colDefs,
            defaultColDef,
            gridStyle,
            pagination: true,
            paginationPageSize: 8,
            sort: true
          }
        )
      }
    )
  ] });
}
const delightStackGap = 2.5;
function ChangeStrategyDetails({ form, historyRows, historyLoading, historyError }) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Box,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        gap: delightStackGap,
        p: 2,
        maxWidth: { xs: "100%", sm: 672 },
        width: "100%",
        mx: "auto",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 1.5,
              borderRadius: "8px",
              border: 1,
              borderColor: "divider",
              bgcolor: (theme) => theme.palette.mode === "dark" ? "action.hover" : "rgba(15, 23, 42, 0.06)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoOutlined, { sx: { fontSize: 14, color: "text.secondary", mt: "2px", flexShrink: 0 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 0.25 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: "11px", lineHeight: 1.45, color: "text.secondary" }, children: intl.formatMessage({ id: "label.changeStrategy.info.line1" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: "11px", lineHeight: 1.45, color: "text.secondary" }, children: intl.formatMessage({ id: "label.changeStrategy.info.line2" }) })
              ] })
            ]
          }
        ),
        form,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StrategyHistoryGrid,
          {
            rowData: historyRows,
            loading: Boolean(historyLoading),
            fetchError: historyError
          }
        )
      ]
    }
  );
}
const STAMP_STRATEGY_SYSTEM_REMARK_MARKER = "Next Collection Strategy";
function filterStampStrategyHistoryRows(dtoList) {
  if (!Array.isArray(dtoList)) return [];
  return dtoList.filter(
    (item) => String((item == null ? void 0 : item.szSystemRemark) || "").includes(STAMP_STRATEGY_SYSTEM_REMARK_MARKER)
  );
}
const labelSx = {
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: 1.35,
  display: "block",
  mb: 0.5
};
const hintSx = {
  fontSize: "10px",
  color: "text.secondary",
  mt: 0.5,
  pl: 0.25,
  lineHeight: 1.35
};
const sectionTitleSx = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "text.secondary",
  textTransform: "uppercase",
  mb: 1
};
function FieldStack({ label, required, children, hintId, intl }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { component: "label", sx: labelSx, children: [
      label,
      required ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { component: "span", sx: { color: "error.main", ml: 0.25 }, children: "*" }) : null
    ] }),
    children,
    hintId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: hintSx, children: intl.formatMessage({ id: hintId }) }) : null
  ] });
}
const StampStrategies = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [collectionStrategy, setCollectionStrategy] = reactExports.useState("");
  const [exposureStrategy, setExposureStrategy] = reactExports.useState("");
  const [collectionStrategySeq, setCollectionStrategySeq] = reactExports.useState("");
  const [exposureStrategySeq, setExposureStrategySeq] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [formData, setFormData] = reactExports.useState({
    revisionStrategy: "",
    budgetStrategy: "",
    collectionTillDate: null,
    exposureTillDate: null,
    revisionTillDate: null,
    budgetTillDate: null,
    notes: ""
  });
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [historyLoading, setHistoryLoading] = reactExports.useState(false);
  const [historyError, setHistoryError] = reactExports.useState(null);
  const [historyReloadKey, setHistoryReloadKey] = reactExports.useState(0);
  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };
  const handleDateChange = (field) => (newVal) => {
    setFormData((prev) => ({ ...prev, [field]: newVal }));
  };
  const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === "string") return date.split("T")[0];
    let d = date;
    if (d.$d) d = d.$d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const resetForm = () => {
    setCollectionStrategy("");
    setCollectionStrategySeq("");
    setExposureStrategy("");
    setExposureStrategySeq("");
    setFormData({
      revisionStrategy: "",
      budgetStrategy: "",
      collectionTillDate: null,
      exposureTillDate: null,
      revisionTillDate: null,
      budgetTillDate: null,
      notes: ""
    });
  };
  const mapHistoryForGrid = reactExports.useCallback(
    (dtoList) => {
      const na = intl.formatMessage({ id: "label.changeStrategy.history.na" });
      const filtered = filterStampStrategyHistoryRows(dtoList);
      return filtered.map((item) => ({
        dtActivity: item.dtActivity || "",
        fromVal: item.szActivity || na,
        toVal: na,
        tillVal: na,
        szCollectorCode: item.szCollectorCode || "",
        note: item.szRemark || item.szSystemRemark || ""
      }));
    },
    [intl]
  );
  const loadStrategyHistory = reactExports.useCallback(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      setHistoryRows([]);
      setHistoryError(null);
      return;
    }
    setHistoryLoading(true);
    setHistoryError(null);
    console.log(">>>>>>>>>screenMenuId", screenMenuId);
    Kr.GET(StampStrategiesAPI.fetchStrategyHistory(0, 100, screenMenuId)).then((res) => {
      var _a;
      const dto = (_a = res.data) == null ? void 0 : _a.previousActivityDetailsDto;
      if (Array.isArray(dto)) {
        setHistoryRows(mapHistoryForGrid(dto));
      } else {
        setHistoryRows([]);
        setHistoryError(
          intl.formatMessage({ id: "label.changeStrategy.history.loadUnexpected" })
        );
      }
    }).catch((err) => {
      var _a, _b;
      console.error(err);
      setHistoryRows([]);
      setHistoryError(
        ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "label.changeStrategy.history.loadFailed" })
      );
    }).finally(() => setHistoryLoading(false));
  }, [selectedRow, mapHistoryForGrid, intl]);
  reactExports.useEffect(() => {
    loadStrategyHistory();
  }, [loadStrategyHistory, historyReloadKey]);
  const handleSave = async () => {
    const requestData = {
      stampStrategiesDto: {
        lnNextCollStrategy: collectionStrategySeq,
        dtNextCollStrategyTill: formatDate(formData.collectionTillDate),
        lnNextExpStrategy: exposureStrategySeq,
        dtNextExpStrategyTill: formatDate(formData.exposureTillDate),
        lnNextCLRevStrategy: formData.revisionStrategy,
        dtNextCLRevStrategyTill: formatDate(formData.revisionTillDate),
        lnNextBudgStrategy: formData.budgetStrategy,
        dtNextBudgStrategyTill: formatDate(formData.budgetTillDate),
        szRemarks: (formData.notes || "").trim()
      }
    };
    return Kr.PUT(StampStrategiesAPI.updateStrategiesDetails(screenMenuId), requestData).then(
      (res) => {
        var _a, _b;
        if (((_a = res.data.status) == null ? void 0 : _a.toLowerCase()) === "success") {
          toast.success(
            res.data.msg || intl.formatMessage({ id: "label.changeStrategy.saveSuccess" })
          );
          resetForm();
          setHistoryReloadKey((k) => k + 1);
        } else {
          if ((_b = res.data) == null ? void 0 : _b.responseJson) {
            handleValidationErrors(intl, toast, res.data.responseJson);
          } else {
            toast.error(
              res.data.msg || intl.formatMessage({ id: "label.changeStrategy.saveError" })
            );
          }
        }
        return res;
      },
      (err) => {
        var _a, _b, _c, _d;
        if ((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson) {
          handleValidationErrors(intl, toast, err.response.data.responseJson);
        } else {
          toast.error(
            ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({ id: "label.changeStrategy.saveError" })
          );
        }
        throw err;
      }
    );
  };
  const searchBoxCompact = {
    searchBoxWidth: "100%",
    searchBoxHeight: 32,
    searchBoxFontSize: 12
  };
  const formContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", flexDirection: "column", gap: 2.5 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({ id: "label.changeStrategy.section.collectionExposure" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldStack,
        {
          label: intl.formatMessage({ id: "label.stamp.strategies.collectionStrategy" }),
          required: true,
          intl,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            dc,
            {
              apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
              searchCode: "COLSTRCDE",
              setSelectedValue: (value) => setCollectionStrategy(value),
              onRowSelect: (row) => setCollectionStrategySeq((row == null ? void 0 : row.ISTRATEGYSEQNO) ?? ""),
              selectedValue: collectionStrategy,
              selectedColumn: "SZSTRATEGYCODE",
              gridDefObj: gridStrategyCodeDefObj,
              gridWidth: 400,
              gridHeight: 400,
              gridNoOfRowsPerPage: 2,
              ...searchBoxCompact
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldStack,
        {
          label: intl.formatMessage({ id: "label.stamp.strategies.tillDate" }),
          intl,
          hintId: "label.changeStrategy.form.tillHint",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Ug,
            {
              value: formData.collectionTillDate,
              onChange: handleDateChange("collectionTillDate"),
              align: lE.DATE,
              format: "MM/DD/YYYY"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldStack,
        {
          label: intl.formatMessage({ id: "label.stamp.strategies.exposureStrategy" }),
          required: true,
          intl,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            dc,
            {
              apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
              searchCode: "EXPSTRCDE",
              setSelectedValue: (value) => setExposureStrategy(value),
              onRowSelect: (row) => setExposureStrategySeq((row == null ? void 0 : row.ISTRATEGYSEQNO) ?? ""),
              selectedValue: exposureStrategy,
              selectedColumn: "SZSTRATEGYCODE",
              gridDefObj: gridStrategyCodeDefObj,
              gridWidth: 350,
              gridHeight: 300,
              gridNoOfRowsPerPage: 2,
              ...searchBoxCompact
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldStack, { label: intl.formatMessage({ id: "label.stamp.strategies.tillDate" }), intl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Ug,
        {
          value: formData.exposureTillDate,
          onChange: handleDateChange("exposureTillDate"),
          align: lE.DATE,
          format: "MM/DD/YYYY"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { ...sectionTitleSx, mt: 0.5 }, children: intl.formatMessage({ id: "label.changeStrategy.section.revisionBudget" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldStack,
        {
          label: intl.formatMessage({ id: "label.stamp.strategies.revisionStrategy" }),
          intl,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: formData.revisionStrategy,
              onChange: handleInputChange("revisionStrategy"),
              editable: true,
              align: lE.TEXT
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldStack, { label: intl.formatMessage({ id: "label.stamp.strategies.tillDate" }), intl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Ug,
        {
          value: formData.revisionTillDate,
          onChange: handleDateChange("revisionTillDate"),
          align: lE.DATE,
          format: "MM/DD/YYYY"
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldStack,
        {
          label: intl.formatMessage({ id: "label.stamp.strategies.budgetStrategy" }),
          intl,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: formData.budgetStrategy,
              onChange: handleInputChange("budgetStrategy"),
              editable: true,
              align: lE.TEXT
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, sm: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldStack, { label: intl.formatMessage({ id: "label.stamp.strategies.tillDate" }), intl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Ug,
        {
          value: formData.budgetTillDate,
          onChange: handleDateChange("budgetTillDate"),
          align: lE.DATE,
          format: "MM/DD/YYYY"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { container: true, spacing: 1.5, sx: { mt: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: 12, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FieldStack, { label: intl.formatMessage({ id: "label.changeStrategy.form.notes" }), intl, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "100%", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        pp,
        {
          id: "change-strategy-notes",
          value: formData.notes,
          onChange: handleInputChange("notes"),
          placeholder: intl.formatMessage({ id: "label.changeStrategy.form.notesPlaceholder" }),
          maxLines: 4,
          maxLength: 500,
          width: "100%",
          height: 88
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { ...hintSx, mt: 0.75 }, children: intl.formatMessage({ id: "label.changeStrategy.form.notesHint" }) })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(FunctionLayout, { title: intl.formatMessage({ id: "label.changeStrategy.title" }), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.default"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Box,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              pb: 10
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChangeStrategyDetails,
              {
                form: formContent,
                historyRows,
                historyLoading,
                historyError
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSave,
        onReset: resetForm,
        onClose: () => navigate("/homelayout/welcomepage"),
        disableToast: { save: true }
      }
    )
  ] });
};
export {
  StampStrategies as default
};
