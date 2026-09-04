import { ed as useIntl, em as useTheme, ct as ar, dN as reactExports, aX as Kr, cr as alpha, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, cJ as dc, bI as SEARCH_API_ENDPOINTS, aW as Kg, bV as Stack, M as Chip, ad as EditIcon, b4 as LockOutlinedIcon, aR as IconButton, O as CloseIcon, N as CircularProgress, i as Alert, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { c as ConfigurationAPI } from "./apiEndpoints-CGlR3-gk.js";
const gridConditionTypeDefObj = [
  { gridMappingName: "szCondition", gridHeaderDesc: "Condition", gridHeaderId: "label.search.condition", gridColumnWidth: 180 },
  { gridMappingName: "szDesc", gridHeaderDesc: "Condition Desc", gridHeaderId: "label.search.conditiontype.description", gridColumnWidth: 200 },
  { gridMappingName: "szParentGroup", gridHeaderDesc: "Parent Group", gridHeaderId: "label.search.conditiontype.parentgroup", gridColumnWidth: 220 },
  { gridMappingName: "cAllowUpdate", gridHeaderDesc: "Allow Update", gridHeaderId: "label.search.conditiontype.allowupdate", gridColumnWidth: 150, gridColumnHeight: 20, hidden: true }
];
function SystemParametersPage() {
  const intl = useIntl();
  const muiTheme = useTheme();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [selectedType, setSelectedType] = reactExports.useState(null);
  const [paramValues, setParamValues] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [searchValue, setSearchValue] = reactExports.useState("");
  const [allowUpdate, setAllowUpdate] = reactExports.useState(false);
  const selectedTypeRef = reactExports.useRef(null);
  const allowUpdateRef = reactExports.useRef(false);
  const resolveLabel = reactExports.useCallback((key) => {
    if (!key) return "—";
    try {
      return intl.formatMessage({ id: key, defaultMessage: key });
    } catch {
      return key;
    }
  }, [intl]);
  const columnDefs = reactExports.useMemo(() => {
    const editable = allowUpdate;
    return [
      {
        field: "szCondition",
        headerName: intl.formatMessage({ id: "label.code", defaultMessage: "Code" }),
        width: 140,
        cellStyle: { fontWeight: 600 },
        suppressSizeToFit: true,
        editable: (params) => {
          var _a, _b;
          if (!editable) return false;
          const isExistingRow = Boolean((_b = (_a = params.data) == null ? void 0 : _a.szCondition) == null ? void 0 : _b.trim());
          return !isExistingRow;
        },
        cellClassRules: {
          "drs-locked-cell": (params) => {
            var _a, _b;
            return editable && Boolean((_b = (_a = params.data) == null ? void 0 : _a.szCondition) == null ? void 0 : _b.trim());
          }
        }
      },
      {
        field: "szDescription",
        headerName: intl.formatMessage({ id: "label.description", defaultMessage: "Description" }),
        flex: 1,
        editable,
        valueGetter: (params) => {
          var _a, _b;
          return editable ? ((_a = params.data) == null ? void 0 : _a.szDescription) ?? "" : resolveLabel((_b = params.data) == null ? void 0 : _b.szi18nDesc);
        }
      }
    ];
  }, [intl, resolveLabel, allowUpdate]);
  const refreshGridData = reactExports.useCallback(async (code, rowMeta) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await Kr.GET(
        `${ConfigurationAPI.fetchSystemParamValues()}?conditionType=${code}`
      );
      const data = response.data;
      const isSuccess = String((data == null ? void 0 : data.status) ?? "").toLowerCase() === "success";
      if (isSuccess) {
        const rows = (data.responseJson ?? []).map((item) => ({
          ...item,
          szDescription: item.szDescription || item.szi18nDesc || "",
          szConditionType: code,
          cAllowUpdate: (rowMeta == null ? void 0 : rowMeta.cAllowUpdate) ?? (allowUpdateRef.current ? "Y" : "N")
        }));
        setParamValues(rows);
      } else {
        setError((data == null ? void 0 : data.message) || "Failed to load parameter values.");
      }
    } catch (err) {
      console.error("fetchSystemParamValues error:", err);
      setError("Error fetching parameter values.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleConditionTypeSelect = reactExports.useCallback(async (conditionTypeCode, row) => {
    if (!conditionTypeCode) return;
    const isAllowUpdate = String((row == null ? void 0 : row.cAllowUpdate) ?? "N").toUpperCase() === "Y";
    const meta = {
      code: conditionTypeCode,
      desc: (row == null ? void 0 : row.szConditionTypeDesc) ?? conditionTypeCode,
      tab: (row == null ? void 0 : row.szParentGroup) ?? "System Tab",
      allowUpdate: isAllowUpdate,
      cAllowUpdate: (row == null ? void 0 : row.cAllowUpdate) ?? "N"
    };
    setSelectedType(meta);
    setAllowUpdate(isAllowUpdate);
    selectedTypeRef.current = meta;
    allowUpdateRef.current = isAllowUpdate;
    setParamValues([]);
    setError(null);
    await refreshGridData(conditionTypeCode, row);
  }, [refreshGridData]);
  const handleSave = reactExports.useCallback(async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    var _a, _b, _c, _d;
    const conditionType = (_a = selectedTypeRef.current) == null ? void 0 : _a.code;
    if (!conditionType) return { success: false };
    if (!allowUpdateRef.current) {
      toast.warning(intl.formatMessage({
        id: "label.systemparams.readonly",
        defaultMessage: "This parameter type is read-only."
      }));
      return { success: false };
    }
    const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => {
      var _a2;
      return {
        szConditionType: conditionType,
        szCondition: (row.szCondition || "").trim(),
        szDescription: (row.szDescription || "").trim(),
        szi18nDescription: row.szi18nDesc ?? "",
        cAllowUpdate: ((_a2 = selectedTypeRef.current) == null ? void 0 : _a2.cAllowUpdate) ?? "N",
        szMode: row.mode
      };
    });
    if (payload.length === 0) {
      toast.info(intl.formatMessage({
        id: "label.systemparams.noChanges",
        defaultMessage: "No changes to save."
      }));
      return { success: false };
    }
    try {
      setIsLoading(true);
      const response = await Kr.POST(
        ConfigurationAPI.saveSystemParamValues(),
        payload
      );
      const data = response.data;
      const isSuccess = String((data == null ? void 0 : data.status) ?? "").toLowerCase() === "success";
      if (isSuccess) {
        toast.success(intl.formatMessage({
          id: "label.systemparams.saveSuccess",
          defaultMessage: "Parameters saved successfully."
        }));
        await refreshGridData(conditionType, {
          cAllowUpdate: ((_b = selectedTypeRef.current) == null ? void 0 : _b.cAllowUpdate) ?? "N"
        });
        return { success: true };
      } else {
        const msg = (data == null ? void 0 : data.message) || "Failed to save parameters.";
        toast.error(msg);
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      console.error("saveSystemParamValues error:", err);
      const msg = ((_d = (_c = err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || "Error saving parameter values.";
      toast.error(msg);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  }, [intl, toast, refreshGridData]);
  const handleButtonBarSave = reactExports.useCallback(() => {
    var _a, _b, _c;
    if ((_a = gridRef.current) == null ? void 0 : _a.api) {
      gridRef.current.api.stopEditing();
    }
    if (typeof ((_b = gridRef.current) == null ? void 0 : _b.save) === "function") {
      gridRef.current.save();
    } else if (typeof ((_c = gridRef.current) == null ? void 0 : _c.submitChanges) === "function") {
      gridRef.current.submitChanges();
    }
  }, []);
  const handleReset = reactExports.useCallback(async () => {
    if (selectedTypeRef.current) {
      await refreshGridData(selectedTypeRef.current.code, {
        cAllowUpdate: selectedTypeRef.current.cAllowUpdate
      });
    }
    return { success: true };
  }, [refreshGridData]);
  const handleClose = () => {
    setSelectedType(null);
    setParamValues([]);
    setAllowUpdate(false);
    setError(null);
    setSearchValue("");
    selectedTypeRef.current = null;
    allowUpdateRef.current = false;
  };
  const panelBorder = `1px solid ${alpha(muiTheme.palette.divider, 1)}`;
  const tabChipSx = {
    height: 22,
    fontSize: 11,
    fontWeight: 500,
    borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
    color: muiTheme.palette.primary.main,
    border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
    "& .MuiChip-label": { px: 1 }
  };
  const readonlyChipSx = {
    height: 22,
    fontSize: 11,
    fontWeight: 500,
    borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.warning.main, 0.08),
    color: muiTheme.palette.warning.dark,
    border: `1px solid ${alpha(muiTheme.palette.warning.main, 0.25)}`,
    "& .MuiChip-label": { px: 1 }
  };
  const editableChipSx = {
    height: 22,
    fontSize: 11,
    fontWeight: 500,
    borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.success.main, 0.08),
    color: muiTheme.palette.success.dark,
    border: `1px solid ${alpha(muiTheme.palette.success.main, 0.25)}`,
    "& .MuiChip-label": { px: 1 }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { styles: { display: "flex", flexDirection: "column", width: "100%", padding: "16px 24px", gap: "16px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { styles: { display: "flex", flexDirection: "column", gap: 4, width: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-breadcrumb-text", children: /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: intl.formatMessage({ id: "label.systemparameters.title", defaultMessage: "System Parameters" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", sx: { color: "text.secondary", fontSize: 14, mb: 0.5 }, children: intl.formatMessage({
        id: "label.systemparameters.description",
        defaultMessage: "Configure system parameters and their values"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { styles: { display: "flex", justifyContent: "center", width: "100%", marginBottom: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "100%", maxWidth: 500 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      dc,
      {
        apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
        searchCode: "CONDITIONTYPE",
        setSelectedValue: handleConditionTypeSelect,
        selectedValue: searchValue,
        selectedColumn: "szCondition",
        gridDefObj: gridConditionTypeDefObj,
        gridWidth: 400,
        gridHeight: 320,
        gridNoOfRowsPerPage: 3,
        searchBoxWidth: "100%",
        searchBoxHeight: 40,
        searchBoxFontSize: 13,
        placeholder: intl.formatMessage({
          id: "label.systemparams.searchPlaceholder",
          defaultMessage: "Find a parameter by name, group, or description..."
        })
      }
    ) }) }),
    selectedType && /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { elevation: 0, sx: { width: "100%", border: panelBorder, borderRadius: 2, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        borderBottom: panelBorder,
        bgcolor: alpha(muiTheme.palette.primary.main, 0.02)
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", alignItems: "center", spacing: 1.5, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 18, fontWeight: 600, color: "text.primary" }, children: selectedType.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: selectedType.tab, size: "small", sx: tabChipSx }),
          allowUpdate ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(EditIcon, { sx: { fontSize: "13px !important" } }),
              label: intl.formatMessage({ id: "label.editable", defaultMessage: "Editable" }),
              size: "small",
              sx: editableChipSx
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LockOutlinedIcon, { sx: { fontSize: "13px !important" } }),
              label: intl.formatMessage({ id: "label.readonly", defaultMessage: "Read-only" }),
              size: "small",
              sx: readonlyChipSx
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { size: "small", onClick: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, { fontSize: "small" }) })
      ] }),
      !isLoading && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 3, py: 1, borderBottom: panelBorder }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { sx: { fontSize: 13, color: "text.secondary" }, children: [
        paramValues.length,
        " ",
        intl.formatMessage({ id: "label.records", defaultMessage: paramValues.length !== 1 ? "records" : "record" })
      ] }) }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 14, color: "text.secondary" }, children: intl.formatMessage({ id: "label.loading", defaultMessage: "Loading..." }) })
      ] }),
      error && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 3, py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { fontSize: 13 }, children: error }) }),
      !isLoading && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { height: "35vh", minHeight: "260px", width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData: paramValues,
          columnDefs,
          gridStyle: { width: "100%", height: "100%" },
          gridClassName: "drs-list-grid",
          embeddedInSection: true,
          pagination: true,
          paginationPageSize: 5,
          globalSearch: false,
          isLoading,
          getRowId: (params) => params.data.szCondition ?? String(Math.random()),
          suppressRowClickSelection: true,
          allowAdd: allowUpdate,
          allowDelete: allowUpdate,
          allowUpdate,
          addCheckBoxes: allowUpdate,
          rowSelection: allowUpdate ? "multiple" : "single",
          onSave: handleSave,
          hideInternalSaveButton: allowUpdate
        },
        `${selectedType.code}-${intl.locale}-${allowUpdate}`
      ) }),
      !isLoading && !error && paramValues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 3, py: 6, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 14, color: "text.secondary" }, children: intl.formatMessage({ id: "label.systemparams.empty", defaultMessage: "No values found for this parameter type." }) }) })
    ] }),
    selectedType && allowUpdate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleButtonBarSave,
        onReset: handleReset,
        disableToast: { reset: true }
      }
    )
  ] });
}
export {
  SystemParametersPage as default
};
