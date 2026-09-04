import { bx as React, dB as jsxRuntimeExports, cJ as dc, dp as gridStrategyActionDefObj, bI as SEARCH_API_ENDPOINTS, dh as gridGroupCodeDefObj, aX as Kr, ed as useIntl, ct as ar, eh as useNavigate, ej as useParams, dN as reactExports, ef as useLocation, dM as reactDomExports, ac as Dt, cx as bp, b0 as Lg, j as ArrowBackIcon, ep as vp, bu as RE, cw as bE, cj as Vg, dK as ps, cs as ap, cB as cc, cg as Ug, dD as lE, bH as SE, dI as pp, cy as bu, bd as Ng, cI as dayjs } from "./index-BhdgJqva.js";
import { C as CollectionStrategiesAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { e as emptyHeader, c as mapScheduleRowFromApi, S as STRATEGY_TYPE_COLLECTION, f as findStrategyInList, m as mapHeaderFromApi, b as buildDependencyMatrix, p as parseActionList, a as mapHeaderToDto, d as mapScheduleRowToDto } from "./collection-strategies.screen-BOkNL2r3.js";
const actionTypeCache = /* @__PURE__ */ new Map();
const GroupCodeSearchRenderer = (props) => {
  const { value, node } = props;
  const handleSetGroupSelectedValue = (dataValue, selectedRow) => {
    if (selectedRow && selectedRow.szgroupcode) {
      node.setDataValue("szAllocateTo", selectedRow.szgroupcode);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      apiEndpoint: SEARCH_API_ENDPOINTS.ALLOCATION(),
      searchCode: "GRPCD",
      setSelectedValue: handleSetGroupSelectedValue,
      selectedValue: value,
      selectedColumn: "szgroupcode",
      gridDefObj: gridGroupCodeDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 2,
      searchBoxWidth: "100%",
      searchBoxHeight: 30,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const ActionCodeSearchRenderer = (props) => {
  const { value, node } = props;
  React.useEffect(() => {
    if (value && node) {
      const fetchActionType = async () => {
        var _a, _b;
        try {
          const response = await Kr.POST(
            SEARCH_API_ENDPOINTS.COMMON_MASTER(),
            {
              searchCode: "STRACT",
              szactioncode: value
            }
          );
          if (((_a = response.data) == null ? void 0 : _a.status) === "Success" && ((_b = response.data) == null ? void 0 : _b.responseJson)) {
            const data = response.data.responseJson;
            const matchedItem = Array.isArray(data) ? data.find((item) => item.szactioncode === value) : null;
            if (matchedItem && matchedItem.szactiontype) {
              actionTypeCache.set(value, matchedItem.szactiontype);
              node.setDataValue("szChannel", matchedItem.szactiontype);
            }
          }
        } catch (error) {
          console.error("Error fetching action type:", error);
        }
      };
      fetchActionType();
    }
  }, [value, node]);
  const handleSetSelectedValue = (dataValue, selectedRow) => {
    if (selectedRow && selectedRow.szactiontype) {
      actionTypeCache.set(selectedRow.szactioncode, selectedRow.szactiontype);
      node.setDataValue("szChannel", selectedRow.szactiontype);
      node.setDataValue("szActionCode", selectedRow.szactioncode);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
      searchCode: "STRACT",
      setSelectedValue: handleSetSelectedValue,
      selectedValue: value,
      selectedColumn: "szactioncode",
      gridDefObj: gridStrategyActionDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 2,
      searchBoxWidth: "100%",
      searchBoxHeight: 30,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const DependsOnSearchRenderer = (props) => {
  const { value, node } = props;
  const getSelectedValues = (val) => {
    if (!val) return [];
    return val.split(",").map((item) => item.trim()).filter(Boolean);
  };
  const formatDependentIds = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return "";
    return selectedIds.join(",");
  };
  const handleSetSelectedValue = (selectedIds) => {
    const formattedValue = formatDependentIds(selectedIds);
    node.setDataValue("szDependsOn", formattedValue);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      multiSelect: true,
      apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
      searchCode: "STRACT",
      setSelectedValue: handleSetSelectedValue,
      selectedValue: getSelectedValues(value),
      selectedColumn: "szactioncode",
      gridDefObj: gridStrategyActionDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 5,
      searchBoxWidth: "100%",
      searchBoxHeight: 30,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const SuccessorOnSearchRenderer = (props) => {
  const { value, node } = props;
  const getSelectedValues = (val) => {
    if (!val) return [];
    return val.split(",").map((item) => item.trim()).filter(Boolean);
  };
  const formatDependentIds = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return "";
    return selectedIds.join(",");
  };
  const handleSetSelectedValue = (selectedIds) => {
    const formattedValue = formatDependentIds(selectedIds);
    node.setDataValue("szSuccessors", formattedValue);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      multiSelect: true,
      apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
      searchCode: "STRACT",
      setSelectedValue: handleSetSelectedValue,
      selectedValue: getSelectedValues(value),
      selectedColumn: "szactioncode",
      gridDefObj: gridStrategyActionDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 5,
      searchBoxWidth: "100%",
      searchBoxHeight: 30,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const getCollectionStrategiesColumnDefs = (intl, holidayOptions, exclusionOptions, referenceDateOptions, phaseOptions, t) => [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 48,
    pinned: "left",
    filter: false,
    sortable: false,
    suppressMenu: true
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.action",
      defaultMessage: "Action"
    }),
    field: "szActionCode",
    width: 140,
    pinned: "left",
    filter: false,
    editable: false,
    cellRenderer: ActionCodeSearchRenderer
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.channel",
      defaultMessage: "Channel"
    }),
    field: "szChannel",
    width: 130,
    filter: false,
    editable: false
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.onDay",
      defaultMessage: "On Day"
    }),
    field: "nOnDay",
    editable: true,
    width: 90,
    filter: false,
    cellEditor: "agTextCellEditor",
    // Accept empty value and parse numeric input; preserve old value on invalid input
    valueParser: (params) => {
      const v = params.newValue;
      if (v === null || v === void 0 || String(v).trim() === "") return null;
      const num = Number(String(v).trim());
      return isNaN(num) ? params.oldValue : num;
    },
    valueFormatter: (params) => {
      if (params.value === null || params.value === void 0 || params.value === "") return "";
      return String(params.value);
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.refDate",
      defaultMessage: "Ref Date"
    }),
    field: "szReferenceDate",
    editable: true,
    width: 150,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...referenceDateOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = referenceDateOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.auth",
      defaultMessage: "Auth"
    }),
    field: "nRequiresAuthorization",
    editable: true,
    width: 80,
    cellDataType: "boolean",
    cellRenderer: "agCheckboxCellRenderer",
    filter: false
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.allocate",
      defaultMessage: "Allocate"
    }),
    field: "szAllocateTo",
    width: 140,
    pinned: "left",
    editable: false,
    cellRenderer: GroupCodeSearchRenderer
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.holiday",
      defaultMessage: "Holiday"
    }),
    field: "szHolidayTreatmentBehavior",
    editable: true,
    width: 150,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...holidayOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = holidayOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.onExcl",
      defaultMessage: "On Excl."
    }),
    field: "szOnExclusion",
    editable: true,
    width: 120,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...exclusionOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = exclusionOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.phase",
      defaultMessage: "Phase"
    }),
    field: "szPhase",
    editable: true,
    width: 130,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: {
      values: ["", ...phaseOptions.map((o) => o.code)]
    },
    valueFormatter: (params) => {
      const opt = phaseOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    }
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.dependsOn",
      defaultMessage: "Depends On"
    }),
    field: "szDependsOn",
    editable: false,
    width: 190,
    filter: false,
    cellRenderer: DependsOnSearchRenderer
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.successor",
      defaultMessage: "Successor"
    }),
    field: "szSuccessors",
    editable: false,
    width: 190,
    filter: false,
    cellRenderer: SuccessorOnSearchRenderer
  },
  {
    headerName: intl.formatMessage({ id: "label.Payment.SrNo", defaultMessage: "Sr No." }),
    field: "inSrNo",
    width: 70,
    filter: false,
    editable: false,
    hide: true,
    valueFormatter: (params) => params.value == null || params.value === "" ? "" : params.value
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.performOnNWD",
      defaultMessage: "Perform On NWD"
    }),
    field: "szPerformOnNWD",
    editable: true,
    width: 130,
    hide: true,
    cellDataType: "boolean",
    cellRenderer: "agCheckboxCellRenderer",
    filter: false
  }
];
const collectionStrategiesGridStyle = { width: "100%", height: "50vh" };
const emptyScheduleRow = () => ({
  key: `new-${Date.now()}`,
  tempId: `new-${Date.now()}`,
  szActionCode: "",
  szChannel: "",
  nOnDay: "",
  szReferenceDate: "",
  nRequiresAuthorization: false,
  szAllocateTo: "",
  bAllocate: false,
  szHolidayTreatmentBehavior: "",
  szOnExclusion: "",
  szPhase: "",
  szDependsOn: "",
  szSuccessors: "",
  szPerformOnNWD: false
});
const TAB_BASIC = "basic";
const TAB_SCHEDULE = "schedule";
const TAB_VISUAL = "visual";
const TAB_ENTRY = "entry";
const TAB_EXIT = "exit";
const TAB_EXCLUSION = "exclusion";
const TAB_RULES = "rules";
const TAB_DEPS = "deps";
const LIST_PATH = "/homelayout/collectionStrategies";
const CollectionStrategyEditScreen = () => {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { strategyCode: strategyCodeParam } = useParams();
  const gridRef = reactExports.useRef(null);
  const strategyCode = decodeURIComponent(strategyCodeParam || "");
  const isNew = strategyCode.toLowerCase() === "new";
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const [activeTab, setActiveTab] = reactExports.useState(TAB_BASIC);
  const [header, setHeader] = reactExports.useState(emptyHeader);
  const [rowData, setRowData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [dropdownLoading, setDropdownLoading] = reactExports.useState(false);
  const [changeReason, setChangeReason] = reactExports.useState("");
  const [copyFromVersion, setCopyFromVersion] = reactExports.useState("");
  const [entryCriteria, setEntryCriteria] = reactExports.useState([]);
  const [exitCriteria, setExitCriteria] = reactExports.useState([]);
  const [exclusionCriteria, setExclusionCriteria] = reactExports.useState([]);
  const [holidayOptions, setHolidayOptions] = reactExports.useState([]);
  const [exclusionOptions, setExclusionOptions] = reactExports.useState([]);
  const [referenceDateOptions, setReferenceDateOptions] = reactExports.useState([]);
  const [phaseOptions, setPhaseOptions] = reactExports.useState([]);
  const [entryDmnContext, setEntryDmnContext] = reactExports.useState(null);
  const [exitDmnContext, setExitDmnContext] = reactExports.useState(null);
  const [exclusionDmnContext, setExclusionDmnContext] = reactExports.useState(null);
  const translateMessage = reactExports.useCallback(
    (key) => key ? intl.formatMessage({ id: key, defaultMessage: key }) : "",
    [intl]
  );
  const getDateValue = (dateStr) => {
    if (!dateStr) return null;
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed : null;
  };
  const updateHeader = reactExports.useCallback((field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  }, []);
  const versionOptions = reactExports.useMemo(() => {
    if (isNew || !header.versionNo || header.versionNo <= 1) return [];
    return Array.from({ length: header.versionNo - 1 }, (_, index) => {
      const versionNo = index + 1;
      return { value: String(versionNo), label: `v${versionNo}` };
    });
  }, [header.versionNo, isNew]);
  const fetchScheduleRows = reactExports.useCallback(async (seqNo) => {
    var _a2;
    const res = await Kr.GET(
      `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/fetchStrategyDetails?inStrategySeqNo=${seqNo}`
    );
    if (((_a2 = res.data) == null ? void 0 : _a2.status) !== "Success") {
      setRowData([]);
      return [];
    }
    const scheduleData = res.data.responseJson || [];
    const sorted = [...scheduleData].sort(
      (a, b) => (a.inSrNo || 0) - (b.inSrNo || 0)
    );
    const mapped = sorted.map(mapScheduleRowFromApi);
    setRowData(mapped);
    return mapped;
  }, []);
  const loadStrategy = reactExports.useCallback(async () => {
    var _a2;
    if (!strategyCode) {
      toast.error(
        intl.formatMessage({
          id: "collection.strategy.code.required"
        })
      );
      navigate(LIST_PATH, {
        state: {
          menuId: screenMenuId
        }
      });
      return;
    }
    if (isNew) {
      setHeader(emptyHeader());
      setRowData([]);
      setEntryCriteria([]);
      setExitCriteria([]);
      setExclusionCriteria([]);
      setCopyFromVersion("");
      setChangeReason("");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = `${CollectionStrategiesAPI.StrategyMasterDetails(
        screenMenuId
      )}?szType=${STRATEGY_TYPE_COLLECTION}`;
      const res = await Kr.GET(url);
      if (res.data.status !== "Success") {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.invalid"
          })
        );
        return;
      }
      const strategyList = ((_a2 = res.data.responseJson) == null ? void 0 : _a2.content) ?? [];
      const match = findStrategyInList(strategyList, strategyCode);
      if (!match) {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.invalid"
          })
        );
        navigate(LIST_PATH, {
          state: {
            menuId: screenMenuId
          }
        });
        return;
      }
      const mappedHeader = mapHeaderFromApi(match);
      setHeader(mappedHeader);
      setChangeReason(mappedHeader.remarks || "");
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "collection.fetch.error"
        })
      );
    } finally {
      setLoading(false);
    }
  }, [strategyCode, isNew, screenMenuId, intl, navigate, toast]);
  const translateKey = (t, key) => {
    if (!key) return key;
    let translated = t(key);
    if (translated === key) {
      const allKeys = Object.keys(intl.messages || {});
      const matchedKey = allKeys.find((k) => k.toLowerCase() === key.toLowerCase());
      if (matchedKey) {
        translated = t(matchedKey);
      }
    }
    return translated;
  };
  const loadScheduleData = reactExports.useCallback(async () => {
    var _a2, _b, _c, _d, _e;
    console.log("loadScheduleData called", {
      inStrategySeqNo: header.inStrategySeqNo,
      isNew,
      activeTab
    });
    if (!header.inStrategySeqNo) {
      console.log("No strategy seq no found");
      toast.error(
        intl.formatMessage({ id: "collection.strategy.invalid" })
      );
      return;
    }
    try {
      setLoading(true);
      const initialApiUrl = CollectionStrategiesAPI.StrategyDetails(screenMenuId);
      const initialRes = await Kr.GET(initialApiUrl);
      if (((_a2 = initialRes.data) == null ? void 0 : _a2.status) === "Success" && ((_b = initialRes.data) == null ? void 0 : _b.responseJson)) {
        const responseJson = initialRes.data.responseJson;
        if (responseJson.lstHolidayTreatmentOptions) {
          const mappedHolidayOptions = responseJson.lstHolidayTreatmentOptions.map((item) => ({
            code: item.code,
            desc: translateKey(translateMessage, item.description)
          }));
          setHolidayOptions(mappedHolidayOptions);
          console.log("Holiday options set:", mappedHolidayOptions);
        }
        if (responseJson.lstOnExclusionOptions) {
          const mappedExclusionOptions = responseJson.lstOnExclusionOptions.map((item) => ({
            code: item.code,
            desc: translateKey(translateMessage, item.description)
          }));
          setExclusionOptions(mappedExclusionOptions);
          console.log("Exclusion options set:", mappedExclusionOptions);
        }
        if (responseJson.lstReferenceDateOptions) {
          const mappedReferenceDateOptions = responseJson.lstReferenceDateOptions.map((item) => ({
            code: item.code,
            desc: translateKey(translateMessage, item.description)
          }));
          setReferenceDateOptions(mappedReferenceDateOptions);
          console.log("Reference date options set:", mappedReferenceDateOptions);
        }
        if (responseJson.lstPhasesOptions) {
          const mappedPhaseOptions = responseJson.lstPhasesOptions.map((item) => ({
            code: item.code,
            desc: translateKey(translateMessage, item.description)
          }));
          setPhaseOptions(mappedPhaseOptions);
          console.log("Phase options set:", mappedPhaseOptions);
        }
      }
      const apiUrl = `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/fetchStrategyDetails?inStrategySeqNo=${header.inStrategySeqNo}`;
      const res = await Kr.GET(
        apiUrl
      );
      if (((_c = res.data) == null ? void 0 : _c.status) === "Success") {
        const scheduleData = res.data.responseJson || [];
        console.log("Schedule data received:", scheduleData);
        if (scheduleData.length === 0) {
          toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
          setRowData([]);
        } else {
          const sorted = [...scheduleData].sort(
            (a, b) => (a.inSrNo || 0) - (b.inSrNo || 0)
          );
          const mapped = sorted.map(mapScheduleRowFromApi);
          console.log("Mapped rows:", mapped);
          setRowData(mapped);
        }
      } else {
        console.error("API returned error:", res.data);
        if (res.status === 204 || ((_d = res.data) == null ? void 0 : _d.status) === "Failure") {
          toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
          setRowData([]);
        } else {
          toast.error(
            ((_e = res.data) == null ? void 0 : _e.message) || intl.formatMessage({ id: "collection.schedule.load.error" })
          );
          setRowData([]);
        }
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error(
        intl.formatMessage({ id: "collection.schedule.load.error" })
      );
      setRowData([]);
    } finally {
      setLoading(false);
    }
  }, [header.inStrategySeqNo, toast, intl, isNew, activeTab]);
  reactExports.useEffect(() => {
    if (activeTab === TAB_SCHEDULE && header.inStrategySeqNo && !isNew && rowData.length === 0) {
      loadScheduleData();
    } else {
      console.log("❌ Conditions NOT met, skipping loadScheduleData");
    }
  }, [activeTab, header.inStrategySeqNo, isNew, rowData.length, loadScheduleData]);
  reactExports.useEffect(() => {
    loadStrategy();
  }, [loadStrategy]);
  const columnDefs = reactExports.useMemo(
    () => getCollectionStrategiesColumnDefs(
      intl,
      holidayOptions,
      exclusionOptions,
      referenceDateOptions,
      phaseOptions,
      translateMessage
    ),
    [intl, holidayOptions, exclusionOptions, referenceDateOptions, phaseOptions, translateMessage]
  );
  const visualRows = reactExports.useMemo(
    () => [...rowData].sort((a, b) => (a.nOnDay || 0) - (b.nOnDay || 0)),
    [rowData]
  );
  const dependencyMatrix = reactExports.useMemo(
    () => buildDependencyMatrix(rowData),
    [rowData]
  );
  const handleScheduleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  } = {}) => {
    var _a2, _b, _c, _d;
    const seqNo = header.inStrategySeqNo;
    if (!seqNo) {
      toast.error(
        intl.formatMessage({ id: "collection.strategy.invalid" })
      );
      return { success: false };
    }
    const currentGridRows = ((_a2 = gridRef.current) == null ? void 0 : _a2.getCurrentData()) || [];
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
      return mapScheduleRowToDto(
        { ...r, inSrNo: index + 1 },
        mode,
        index + 1
      );
    });
    const deletedDtos = deletedRows.map(
      (r) => mapScheduleRowToDto(r, "D")
    );
    const lstStrategyDetailsMasterDto = [...deletedDtos, ...remainingDtos];
    if (lstStrategyDetailsMasterDto.length === 0) {
      toast.info(intl.formatMessage({ id: "collection.no.changes" }));
      return { success: false };
    }
    const payload = {
      inStrategySeqNo: seqNo,
      lstStrategyDetailsMasterDto
    };
    try {
      setLoading(true);
      const res = await Kr.POST(
        CollectionStrategiesAPI.StrategyDetails(screenMenuId),
        payload
      );
      if (((_b = res.data) == null ? void 0 : _b.status) === "Success") {
        loadScheduleData();
        fetchScheduleRows();
        toast.success(
          res.data.message || intl.formatMessage({ id: "collection.save.success" })
        );
        return { success: true };
      }
      if (((_c = res.data) == null ? void 0 : _c.responseJson) && typeof res.data.responseJson === "object" && !Array.isArray(res.data.responseJson)) {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        toast.error(
          ((_d = res.data) == null ? void 0 : _d.message) || intl.formatMessage({ id: "collection.save.failed" })
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "collection.save.error" }));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  const handleSaveAll = () => {
    var _a2, _b;
    if (isNew) {
      toast.info(
        intl.formatMessage({
          id: "message.CollectionStrategies.createNotAvailable"
        })
      );
      return;
    }
    (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
  };
  const handleSaveDmn = reactExports.useCallback(
    async (szCriteria, dmnRequestContext) => {
      var _a2;
      if (!dmnRequestContext) {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.criteria.required"
          })
        );
        return { success: false };
      }
      const dmnPayload = {
        szScreenName: szCriteria,
        szStrategyCode: strategyCode,
        szType: STRATEGY_TYPE_COLLECTION,
        dmnTableRequestDto: dmnRequestContext
      };
      try {
        setLoading(true);
        const res = await Kr.POST(
          `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/saveCriteria`,
          dmnPayload
        );
        if (((_a2 = res.data) == null ? void 0 : _a2.status) === "Success") {
          toast.success(
            res.data.message || intl.formatMessage({ id: "collection.save.success" })
          );
          return { success: true };
        }
      } catch (error) {
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [intl, toast]
  );
  const handleSaveEntryCriteria = reactExports.useCallback(
    () => handleSaveDmn(TAB_ENTRY, entryDmnContext),
    [handleSaveDmn, entryDmnContext]
  );
  const handleSaveExitCriteria = reactExports.useCallback(
    () => handleSaveDmn(TAB_EXIT, exitDmnContext),
    [handleSaveDmn, exitDmnContext]
  );
  const handleSaveExclusionCriteria = reactExports.useCallback(
    () => handleSaveDmn(TAB_EXCLUSION, exclusionDmnContext),
    [handleSaveDmn, exclusionDmnContext]
  );
  const handleTopSave = reactExports.useCallback(() => {
    switch (activeTab) {
      case TAB_SCHEDULE:
        handleSaveAll();
        break;
      case TAB_ENTRY:
        handleSaveEntryCriteria();
        break;
      case TAB_EXIT:
        handleSaveExitCriteria();
        break;
      case TAB_EXCLUSION:
        handleSaveExclusionCriteria();
        break;
    }
  }, [activeTab, handleSaveAll, handleSaveEntryCriteria, handleSaveExitCriteria, handleSaveExclusionCriteria]);
  const displayCode = isNew ? header.szStrategyCode : strategyCode || header.szStrategyCode;
  const editTitle = isNew ? intl.formatMessage({ id: "label.CollectionStrategies.addTitle" }) : intl.formatMessage(
    { id: "label.CollectionStrategies.editTitle" },
    { code: displayCode }
  );
  const renderBasicInfo = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-basic-grid", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({ id: "collection.strategy.code" }),
        required: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        id: "collection-strategy-code",
        value: isNew ? header.szStrategyCode : displayCode,
        editable: isNew,
        onChange: (e) => updateHeader(
          "szStrategyCode",
          String(e.target.value || "").toUpperCase()
        ),
        width: "100%"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.description"
        }),
        required: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        id: "collection-strategy-description",
        value: header.szDescription,
        editable: true,
        onChange: (e) => updateHeader("szDescription", e.target.value),
        width: "100%"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "6px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.active"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "6px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      cc,
      {
        checked: header.cActiveYn,
        disabled: false,
        onChange: (e) => updateHeader("cActiveYn", e.target.checked)
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.versionNo"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        id: "collection-strategy-version",
        value: `v${header.versionNo || 1}`,
        editable: false,
        width: "120px"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.effectiveFrom"
        }),
        required: true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "15px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Ug,
      {
        value: getDateValue(header.effectiveFrom),
        onChange: (newVal) => {
          const formattedDate = newVal && newVal.isValid ? newVal.format("YYYY-MM-DD") : "";
          updateHeader("effectiveFrom", formattedDate);
        },
        align: lE.DATE,
        width: "100%",
        required: true,
        disabled: false
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.effectiveTo"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "5px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        id: "collection-strategy-effective-to",
        value: header.effectiveTo || "—",
        editable: false,
        width: "100%"
      }
    ) }),
    !isNew && versionOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.CollectionStrategies.copyFromVersion"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          id: "collection-strategy-copy-version",
          value: copyFromVersion,
          onChange: (e) => setCopyFromVersion(e.target.value),
          options: versionOptions,
          placeholder: "label.CollectionStrategies.copyFromVersionPlaceholder",
          width: "100%"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({
          id: "label.CollectionStrategies.changeReason"
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "10px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-change-reason-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      pp,
      {
        id: "collection-strategy-remarks",
        value: changeReason,
        onChange: (e) => setChangeReason(e.target.value),
        placeholder: "label.CollectionStrategies.changeReasonPlaceholder",
        maxLines: 3,
        width: "100%"
      }
    ) }) })
  ] });
  const handleAddScheduleRow = reactExports.useCallback(() => {
    const defaults = emptyScheduleRow();
    if (referenceDateOptions.length) {
      defaults.szReferenceDate = referenceDateOptions[0].code;
    }
    if (holidayOptions.length) {
      defaults.szHolidayTreatmentBehavior = holidayOptions[0].code;
    }
    if (exclusionOptions.length) {
      defaults.szOnExclusion = exclusionOptions[0].code;
    }
    const newIndex = rowData.length;
    reactDomExports.flushSync(() => {
      setRowData((prev) => [...prev, defaults]);
    });
    setTimeout(() => {
      var _a2;
      try {
        const api = (_a2 = gridRef.current) == null ? void 0 : _a2.api;
        if (api) {
          api.startEditingCell({
            rowIndex: newIndex,
            colKey: "szActionCode"
          });
        }
      } catch (err) {
        console.warn("Could not auto-focus new row action cell:", err);
      }
    }, 50);
  }, [referenceDateOptions, holidayOptions, exclusionOptions, rowData.length]);
  const renderScheduleTab = () => {
    const SearchRendererWrapper = (props) => {
      var _a2;
      const colId = (_a2 = props.column) == null ? void 0 : _a2.colId;
      if (colId === "szDependsOn") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(DependsOnSearchRenderer, { ...props });
      } else if (colId === "szSuccessorOn") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SuccessorOnSearchRenderer, { ...props });
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ActionCodeSearchRenderer, { ...props });
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-schedule-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-schedule-toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: "label.CollectionStrategies.schedule.addRow",
            onClick: handleAddScheduleRow,
            variant: "outlined",
            inline: true
          }
        ),
        rowData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "collection-strategies-schedule-hint", children: intl.formatMessage({
          id: "label.CollectionStrategies.noSchedule"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-grid-host", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            ref: gridRef,
            SearchCommonBoxRenderer: SearchRendererWrapper,
            rowData,
            setRowData,
            columnDefs,
            gridStyle: collectionStrategiesGridStyle,
            paginationgetColDef: true,
            paginationPageSize: 10,
            globalSearch: false,
            allowAdd: true,
            allowDelete: true,
            allowUpdate: true,
            onSave: handleScheduleSave,
            getRowId: (params) => String(
              params.data.tempId || params.data.inSrNo || params.data.key
            ),
            suppressHorizontalScroll: false,
            alwaysShowHorizontalScroll: true
          },
          intl.locale
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: () => {
              var _a2, _b;
              return (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.submitChanges) == null ? void 0 : _b.call(_a2);
            },
            onClose: () => navigate("/homelayout/welcomepage")
          }
        )
      ] })
    ] });
  };
  const renderEntryCriteriaTab = () => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-criteria-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ng,
    {
      ruleName: (header == null ? void 0 : header.szStrategyCode) ? `Col_Str_Ent_${header.szStrategyCode}` : "CollectionStrategiesEntry",
      moduleName: "COL",
      entityCode: "ACNT",
      filterTitle: "Entry Criteria",
      filterSavedDescription: "Collection Strategy Entry Filter",
      isPopedUp: false,
      IsRuleEngBased: true,
      ruleEngineDmnContext: (dmnContext) => {
        setEntryDmnContext(dmnContext);
      }
    }
  ) });
  const renderExitCriteriaTab = () => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-criteria-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ng,
    {
      ruleName: (header == null ? void 0 : header.szStrategyCode) ? `Col_Str_Exit_${header.szStrategyCode}` : "CollectionStrategiesExit_",
      moduleName: "COL",
      entityCode: "ACNT",
      filterTitle: "Exit Criteria",
      filterSavedDescription: "Collection Strategy Exit Filter",
      isPopedUp: false,
      IsRuleEngBased: true,
      ruleEngineDmnContext: (dmnContext) => {
        setExitDmnContext(dmnContext);
      }
    }
  ) });
  const renderExclusionCriteriaTab = () => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-criteria-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ng,
    {
      ruleName: (header == null ? void 0 : header.szStrategyCode) ? `Col_Str_Excl_${header.szStrategyCode}` : "CollectionStrategiesExclusion_",
      moduleName: "COL",
      entityCode: "ACNT",
      filterTitle: "Exclusion Criteria",
      filterSavedDescription: "Collection Strategy Exclusion Filter",
      isPopedUp: false,
      IsRuleEngBased: true,
      ruleEngineDmnContext: (dmnContext) => {
        setExclusionDmnContext(dmnContext);
      }
    }
  ) });
  const renderVisualSchedule = () => {
    if (!visualRows.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "collection-strategies-empty", children: intl.formatMessage({
        id: "label.CollectionStrategies.noSchedule"
      }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "collection-strategies-visual-list", children: visualRows.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "collection-strategies-visual-row",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "collection-strategies-visual-day", children: intl.formatMessage(
            { id: "label.CollectionStrategies.dayLabel" },
            { day: row.nOnDay ?? 0 }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "collection-strategies-visual-action", children: row.szActionCode }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "collection-strategies-visual-meta", children: [
            row.szPhase ? `${row.szPhase} · ` : "",
            row.szReferenceDate || ""
          ] })
        ]
      },
      row.key
    )) });
  };
  const renderDependencies = () => {
    const { actions } = dependencyMatrix;
    if (actions.length < 2) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "collection-strategies-empty", children: intl.formatMessage({
        id: "label.CollectionStrategies.depsMinActions"
      }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "collection-strategies-deps-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: intl.formatMessage({
          id: "label.CollectionStrategies.depsAction"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: intl.formatMessage({ id: "collection.grid.dependsOn" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: intl.formatMessage({ id: "collection.grid.successors" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: actions.map((action) => {
        const row = rowData.find((r) => r.szActionCode === action);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: parseActionList(row == null ? void 0 : row.szDependsOn).join(", ") || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: parseActionList(row == null ? void 0 : row.szSuccessors).join(", ") || "—" })
        ] }, action);
      }) })
    ] });
  };
  const handleSaveBasicInfo = async () => {
    var _a2, _b, _c, _d, _e;
    if (!header.szStrategyCode) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.strategyCode.required"
        })
      );
      return;
    }
    if (!header.szDescription) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.description.required"
        })
      );
      return;
    }
    if (!header.effectiveFrom) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.effectiveFrom.required"
        })
      );
      return;
    }
    try {
      setLoading(true);
      const payload = mapHeaderToDto({
        ...header,
        remarks: changeReason || header.remarks || ""
      });
      payload.szType = STRATEGY_TYPE_COLLECTION;
      const res = isNew ? await Kr.POST(
        CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId),
        payload
      ) : await Kr.PUT(
        CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId),
        payload
      );
      if (((_a2 = res.data) == null ? void 0 : _a2.status) === "Success") {
        toast.success(
          res.data.message || intl.formatMessage({
            id: isNew ? "collection.save.success" : "collection.update.success"
          })
        );
        if (isNew && ((_c = (_b = res.data) == null ? void 0 : _b.responseJson) == null ? void 0 : _c.szStrategyCode)) {
          const newCode = res.data.responseJson.szStrategyCode;
          navigate(
            `/homelayout/collectionStrategies/${encodeURIComponent(newCode)}`,
            {
              state: {
                menuId: screenMenuId
              }
            }
          );
        } else {
          await loadStrategy();
        }
        return { success: true };
      }
      if ((_d = res.data) == null ? void 0 : _d.responseJson) {
        if (typeof res.data.responseJson === "object" && !Array.isArray(res.data.responseJson)) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data.message || intl.formatMessage({
              id: isNew ? "collection.save.failed" : "collection.update.failed"
            })
          );
        }
      } else {
        toast.error(
          ((_e = res.data) == null ? void 0 : _e.message) || intl.formatMessage({
            id: isNew ? "collection.save.failed" : "collection.update.failed"
          })
        );
      }
      return { success: false };
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: isNew ? "collection.save.error" : "collection.update.error"
        })
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-edit-title-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowBackIcon, {}),
            onClick: () => navigate(LIST_PATH, {
              state: {
                menuId: screenMenuId
              }
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "collection-strategies-edit-title-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: editTitle }),
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "collection-strategies-version-badge", children: [
            "v",
            header.versionNo || 1
          ] })
        ] }),
        activeTab !== TAB_BASIC && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: "common.buttonBar.save",
            onClick: handleTopSave,
            variant: "contained",
            color: "primary",
            inline: true
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-tabs-host", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      RE,
      {
        value: activeTab,
        onChange: (_, value) => setActiveTab(value),
        variant: "scrollable",
        scrollButtons: "auto",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.basic"
              }),
              value: TAB_BASIC
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.schedule"
              }),
              value: TAB_SCHEDULE
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.visual"
              }),
              value: TAB_VISUAL
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.entry"
              }),
              value: TAB_ENTRY
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.exit"
              }),
              value: TAB_EXIT
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.exclusion"
              }),
              value: TAB_EXCLUSION
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.rules"
              }),
              value: TAB_RULES
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bE,
            {
              label: intl.formatMessage({
                id: "label.CollectionStrategies.tab.dependencies"
              }),
              value: TAB_DEPS
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "collection-strategies-tab-panel", children: loading || dropdownLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "collection-strategies-empty", children: intl.formatMessage({ id: "collection.button.loading" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      activeTab === TAB_BASIC && renderBasicInfo(),
      activeTab === TAB_SCHEDULE && renderScheduleTab(),
      activeTab === TAB_VISUAL && renderVisualSchedule(),
      activeTab === TAB_ENTRY && renderEntryCriteriaTab(),
      activeTab === TAB_EXIT && renderExitCriteriaTab(),
      activeTab === TAB_EXCLUSION && renderExclusionCriteriaTab(),
      activeTab === TAB_RULES && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "collection-strategies-rules-note", children: intl.formatMessage({
        id: "label.CollectionStrategies.rulesNote"
      }) }),
      activeTab === TAB_DEPS && renderDependencies()
    ] }) }),
    activeTab === TAB_BASIC && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleSaveBasicInfo,
        onClose: () => navigate(LIST_PATH, {
          state: {
            menuId: screenMenuId
          }
        }),
        disableToast: { save: true, close: true }
      }
    )
  ] });
};
export {
  CollectionStrategyEditScreen as default
};
