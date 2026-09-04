import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, dB as jsxRuntimeExports, v as Box, ep as vp, dK as ps, bH as SE, w as Button, ac as Dt, cy as bu, aX as Kr, cJ as dc, dp as gridStrategyActionDefObj, bI as SEARCH_API_ENDPOINTS } from "./index-BhdgJqva.js";
import { m as StrategyDetailsMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const ActionCodeSearchRenderer = (props) => {
  const { value, node } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
      searchCode: "STRACT",
      setSelectedValue: (dataValue) => node.setDataValue("szActionCode", dataValue || value),
      selectedValue: value,
      selectedColumn: "szactioncode",
      gridDefObj: gridStrategyActionDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 2,
      searchBoxWidth: 125,
      searchBoxHeight: 25,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const StrategyDetails = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [strategyCode, setStrategyCode] = reactExports.useState("");
  const [strategyOptions, setStrategyOptions] = reactExports.useState([]);
  const [rowData, setRowData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [dropdownLoading, setDropdownLoading] = reactExports.useState(true);
  const [iStrategySeqNo, setIStrategySeqNo] = reactExports.useState(null);
  const [holidayOptions, setHolidayOptions] = reactExports.useState([]);
  const [exclusionOptions, setExclusionOptions] = reactExports.useState([]);
  const [referenceDateOptions, setReferenceDateOptions] = reactExports.useState([]);
  const t = (key) => key ? intl.formatMessage({ id: key, defaultMessage: key }) : "";
  const normalize = (item) => ({
    code: item.code ?? "",
    desc: item.szi18nDesc || item.description || ""
  });
  reactExports.useEffect(() => {
    const fetchDropdownOptions = async () => {
      var _a, _b;
      setDropdownLoading(true);
      try {
        const res = await Kr.GET(StrategyDetailsMasterAPI.fetchDropdown());
        if (((_a = res.data) == null ? void 0 : _a.status) === "Success") {
          const rj = res.data.responseJson;
          setHolidayOptions(((rj == null ? void 0 : rj.lstHolidayTreatmentOptions) || []).map(normalize));
          setExclusionOptions(((rj == null ? void 0 : rj.lstOnExclusionOptions) || []).map(normalize));
          setReferenceDateOptions(((rj == null ? void 0 : rj.lstReferenceDateOptions) || []).map(normalize));
        } else {
          toast.error(((_b = res.data) == null ? void 0 : _b.message) || "Failed to load dropdown options");
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        toast.error("Error loading dropdown options");
      } finally {
        setDropdownLoading(false);
      }
    };
    fetchDropdownOptions();
  }, []);
  reactExports.useEffect(() => {
    const fetchStrategyOptions = async () => {
      var _a, _b;
      setLoading(true);
      try {
        const res = await Kr.POST(
          // ✅
          StrategyDetailsMasterAPI.fetchAllStrategyDetails("C"),
          { szType: "C" }
        );
        if (((_a = res.data) == null ? void 0 : _a.status) === "Success") {
          const strategies = res.data.responseJson || [];
          const activeStrategies = strategies.map((item) => ({
            value: item.szStrategyCode || "",
            label: `${item.szStrategyCode} - ${item.szDescription || ""}`,
            description: item.szDescription || "",
            iStrategySeqNo: item.inStrategySeqNo
          }));
          if (activeStrategies.length > 0) {
            setStrategyCode(activeStrategies[0].value);
            setIStrategySeqNo(activeStrategies[0].iStrategySeqNo);
          }
          setStrategyOptions(activeStrategies);
        } else {
          toast.error(
            ((_b = res.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "collection.strategy.load.failed" })
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(intl.formatMessage({ id: "collection.strategy.load.error" }));
      } finally {
        setLoading(false);
      }
    };
    fetchStrategyOptions();
  }, []);
  const handleStrategyChange = (e) => {
    const selected = strategyOptions.find((opt) => opt.value === e.target.value);
    setStrategyCode(e.target.value);
    setIStrategySeqNo(selected == null ? void 0 : selected.iStrategySeqNo);
    setRowData([]);
  };
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: "left",
        filter: false,
        headerName: intl.formatMessage({ id: "collection.grid.select" })
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.SrNo", defaultMessage: "Sr No." }),
        field: "inSrNo",
        width: 80,
        pinned: "left",
        filter: false,
        editable: false,
        valueFormatter: (params) => params.value == null || params.value === "" ? "" : params.value
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.action", defaultMessage: "Action Code" }),
        field: "szActionCode",
        width: 150,
        filter: false,
        editable: false,
        cellRenderer: ActionCodeSearchRenderer
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.action", defaultMessage: "Action Code" }),
        field: "szActionCode",
        width: 110,
        editable: true,
        hide: true
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.onDay", defaultMessage: "On Day" }),
        field: "nOnDay",
        editable: true,
        width: 100,
        filter: false,
        valueFormatter: (params) => params.value == null || params.value === "" ? "" : params.value
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.requiresAuth", defaultMessage: "Requires Authorization" }),
        field: "nRequiresAuthorization",
        editable: true,
        width: 150,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.allocate", defaultMessage: "Allocate" }),
        field: "bAllocate",
        editable: true,
        width: 90,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.dependsOn", defaultMessage: "Depends On" }),
        field: "szDependsOn",
        editable: true,
        width: 120,
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.successors", defaultMessage: "Successors" }),
        field: "szSuccessors",
        editable: true,
        width: 110,
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.phase", defaultMessage: "Phase" }),
        field: "szPhase",
        editable: true,
        width: 80,
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.includeCases", defaultMessage: "Include Cases With" }),
        field: "includeCases",
        width: 150,
        editable: false,
        filter: false,
        cellRenderer: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#1976d2", textDecoration: "underline", fontWeight: 500 }, children: intl.formatMessage({ id: "collection.grid.define" }) })
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.holidayTreatment", defaultMessage: "Holiday Treatment" }),
        field: "szHolidayTreatmentBehavior",
        editable: true,
        width: 150,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: holidayOptions.map((o) => o.code)
        },
        valueFormatter: (params) => {
          const opt = holidayOptions.find((o) => String(o.code) === String(params.value));
          return opt ? t(opt.desc) : params.value ?? "";
        }
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.performOnNWD", defaultMessage: "Perform On NWD" }),
        field: "szPerformOnNWD",
        editable: true,
        width: 150,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        filter: false
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.onExclusion", defaultMessage: "On Exclusion" }),
        field: "szOnExclusion",
        editable: true,
        width: 130,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: exclusionOptions.map((o) => o.code)
        },
        valueFormatter: (params) => {
          const opt = exclusionOptions.find((o) => String(o.code) === String(params.value));
          return opt ? t(opt.desc) : params.value ?? "";
        }
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.referenceDate", defaultMessage: "Reference Date" }),
        field: "szReferenceDate",
        editable: true,
        width: 150,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: referenceDateOptions.map((o) => o.code)
        },
        valueFormatter: (params) => {
          const opt = referenceDateOptions.find((o) => String(o.code) === String(params.value));
          return opt ? t(opt.desc) : params.value ?? "";
        }
      },
      {
        headerName: intl.formatMessage({ id: "collection.grid.excludeCases", defaultMessage: "Exclude Cases With" }),
        field: "excludeCases",
        width: 150,
        editable: false,
        filter: false,
        cellRenderer: () => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#1976d2", textDecoration: "underline", fontWeight: 500 }, children: intl.formatMessage({ id: "collection.grid.define" }) })
      }
    ],
    [intl.locale, holidayOptions, exclusionOptions, referenceDateOptions]
  );
  const gridStyle = { width: "100%", height: "55vh", marginTop: "20px" };
  const handleFetch = async (strategySeqNo = iStrategySeqNo) => {
    var _a, _b, _c;
    try {
      if (!strategyCode && !strategySeqNo) {
        toast.error(intl.formatMessage({ id: "collection.strategy.code.required" }));
        return;
      }
      const seqNo = strategySeqNo || iStrategySeqNo;
      if (!seqNo) {
        toast.error(intl.formatMessage({ id: "collection.strategy.invalid" }));
        return;
      }
      setLoading(true);
      const res = await Kr.POST(
        // ✅
        StrategyDetailsMasterAPI.fetchStrategyDetails(),
        { inStrategySeqNo: seqNo }
      );
      if (((_a = res.data) == null ? void 0 : _a.status) !== "Success") {
        setRowData([]);
        if (((_b = res.data) == null ? void 0 : _b.responseJson) && typeof res.data.responseJson === "object" && !Array.isArray(res.data.responseJson)) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(((_c = res.data) == null ? void 0 : _c.message) || intl.formatMessage({ id: "collection.fetch.failed" }));
        }
        return;
      }
      const scheduleData = res.data.responseJson || [];
      if (!scheduleData.length) {
        setRowData([]);
        toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
        return;
      }
      const sortedData = [...scheduleData].sort((a, b) => (a.inSrNo || 0) - (b.inSrNo || 0));
      const mappedRows = sortedData.map((item, index) => ({
        key: `row-${item.inSrNo}-${item.szActionCode}-${index}`,
        inSrNo: item.inSrNo,
        iwfRuleSeqNo: item.inWfRuleSeqNo,
        szActionCode: item.szActionCode || "",
        nOnDay: item.inDays || 0,
        szPhase: item.szPhase || "",
        szDependsOn: item.szDependsOn || "",
        szSuccessors: item.szSuccessors || "",
        nRequiresAuthorization: item.chAuthRequiredYn === "Y",
        bAllocate: item.chAllocateYn === "Y",
        szPerformOnNWD: item.chPerformOnNxtWrkngDayYn === "Y",
        szHolidayTreatmentBehavior: item.szSkipHoliday || "",
        szOnExclusion: item.szExclusionTreatment || "",
        szReferenceDate: item.szRefDateField || "",
        szAllocateTo: item.szAllocateTo || "",
        bExclude: false
      }));
      setRowData(mappedRows);
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "collection.fetch.error" }));
    } finally {
      setLoading(false);
    }
  };
  const mapRowToDto = (row, szMode) => ({
    szMode,
    inSrNo: row.inSrNo ?? null,
    szPhase: row.szPhase || "",
    szActionCode: row.szActionCode || "",
    inDays: row.nOnDay ? Number(row.nOnDay) : 0,
    szSkipHoliday: row.szHolidayTreatmentBehavior || "",
    chPerformOnNxtWrkngDayYn: row.szPerformOnNWD ? "Y" : "N",
    szExclusionTreatment: row.szOnExclusion || "",
    chAuthRequiredYn: row.nRequiresAuthorization ? "Y" : "N",
    szRefDateField: row.szReferenceDate || "",
    chAllocateYn: row.bAllocate ? "Y" : "N",
    szAllocateTo: row.bAllocate ? row.szAllocateTo || "AGENT" : null,
    szSuccessors: row.szSuccessors || "",
    szDependsOn: row.szDependsOn || ""
  });
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] } = {}) => {
    var _a, _b, _c, _d;
    if (!strategyCode) {
      toast.error(intl.formatMessage({ id: "collection.strategy.code.required" }));
      return { success: false };
    }
    const selectedStrategy = strategyOptions.find((opt) => opt.value === strategyCode);
    const seqNo = selectedStrategy == null ? void 0 : selectedStrategy.iStrategySeqNo;
    if (!seqNo) {
      toast.error(intl.formatMessage({ id: "collection.strategy.invalid" }));
      return { success: false };
    }
    const currentGridRows = ((_a = gridRef.current) == null ? void 0 : _a.getCurrentData()) || [];
    const deletedGridRowIds = new Set(deletedRows.map((r) => r.gridRowId));
    const deletedActionCodes = new Set(deletedRows.map((r) => r.szActionCode));
    const remainingRows = currentGridRows.filter(
      (r) => !r._deleted && !deletedGridRowIds.has(r.gridRowId) && !deletedActionCodes.has(r.szActionCode)
    );
    const newIds = new Set(newRows.map((r) => r.gridRowId));
    const updatedIds = new Set(updatedRows.map((r) => r.gridRowId));
    const remainingDtos = remainingRows.map((r, index) => {
      let mode = "B";
      if (newIds.has(r.gridRowId)) mode = "N";
      else if (updatedIds.has(r.gridRowId)) mode = "E";
      return mapRowToDto({ ...r, inSrNo: index + 1 }, mode);
    });
    const deletedDtos = deletedRows.map((r) => mapRowToDto(r, "D"));
    const lstStrategyDetailsMasterDto = [...deletedDtos, ...remainingDtos];
    if (lstStrategyDetailsMasterDto.length === 0) {
      toast.info(intl.formatMessage({ id: "collection.no.changes" }));
      return { success: false };
    }
    const payload = { inStrategySeqNo: seqNo, lstStrategyDetailsMasterDto };
    try {
      setLoading(true);
      const res = await Kr.POST(
        // ✅
        StrategyDetailsMasterAPI.saveStrategyDetails(),
        payload
      );
      if (((_b = res.data) == null ? void 0 : _b.status) === "Success") {
        toast.success(res.data.message || intl.formatMessage({ id: "collection.save.success" }));
        await handleFetch();
        return { success: true };
      } else {
        if (((_c = res.data) == null ? void 0 : _c.responseJson) && typeof res.data.responseJson === "object" && !Array.isArray(res.data.responseJson)) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(((_d = res.data) == null ? void 0 : _d.message) || intl.formatMessage({ id: "collection.save.failed" }));
        }
        return { success: false };
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(intl.formatMessage({ id: "collection.save.error" }));
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: intl.formatMessage({ id: "collection.strategy.title" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 2, p: "10px 20px", alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "collection.strategy.code" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          name: "strategyCode",
          value: strategyCode,
          onChange: handleStrategyChange,
          options: strategyOptions,
          width: "310px",
          required: true,
          disabled: loading || dropdownLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "contained",
          onClick: () => handleFetch(),
          sx: { width: "180px" },
          disabled: loading || dropdownLoading,
          children: loading || dropdownLoading ? intl.formatMessage({ id: "collection.button.loading" }) : intl.formatMessage({ id: "collection.button.fetch" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          SearchCommonBoxRenderer: ActionCodeSearchRenderer,
          rowData,
          setRowData,
          columnDefs,
          gridStyle,
          pagination: true,
          paginationPageSize: 10,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleSave,
          getRowId: (params) => String(params.data.tempId || params.data.inSrNo || params.data.key),
          suppressHorizontalScroll: false,
          alwaysShowHorizontalScroll: true
        },
        intl.locale
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HButtonBar,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  StrategyDetails as default
};
