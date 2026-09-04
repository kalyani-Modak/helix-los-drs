import { dN as reactExports, ed as useIntl, ct as ar, ef as useLocation, dB as jsxRuntimeExports, cJ as dc, dk as gridProcessIdDefObj, bI as SEARCH_API_ENDPOINTS, aX as Kr, v as Box, cy as bu } from "./index-BhdgJqva.js";
import { a as BatchMastersAPI, u as unwrapCommonResponse } from "./apiEndpoints-B3TJTOpa.js";
const parseDepIds = (depProcessIds) => {
  if (depProcessIds == null || String(depProcessIds).trim() === "") return [];
  return String(depProcessIds).split(",").map((s) => s.trim()).filter(Boolean).map((s) => Number(s)).filter((n) => !Number.isNaN(n));
};
const ProcessIdSearchRenderer = (props) => {
  const { value, node } = props;
  let pid = Number(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      apiEndpoint: SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK(),
      searchCode: "PROCESSID",
      setSelectedValue: (dataValue, row) => {
        pid = Number(dataValue);
        node.setDataValue("processId", String(dataValue) || value);
        if (row == null ? void 0 : row.szProcessName) {
          node.setDataValue("processName", row.szProcessName);
        }
        if (row == null ? void 0 : row.szInvokeType) {
          node.setDataValue("invokeType", row.szInvokeType);
        }
        if (row == null ? void 0 : row.szServiceName) {
          node.setDataValue("serviceName", row.szServiceName);
        }
        if (row == null ? void 0 : row.szApiPathOrTopic) {
          node.setDataValue("apiPathOrTopic", row.szApiPathOrTopic);
        }
        if (row == null ? void 0 : row.szParameters) {
          node.setDataValue("parameters", row.szParameters);
        }
      },
      selectedValue: pid,
      selectedColumn: "iProcessId",
      gridDefObj: gridProcessIdDefObj,
      gridWidth: 300,
      gridHeight: 300,
      gridNoOfRowsPerPage: 5,
      searchBoxWidth: 120,
      searchBoxHeight: 30,
      searchBoxFontSize: 11,
      error: false
    }
  );
};
const rowToBatchProcessBody = (row, batchCode) => ({
  batchCode,
  processId: Number(row.processId),
  serialNo: row.serialNo != null ? Number(row.serialNo) : null,
  processName: row.processName ?? null,
  processDesc: row.processDesc ?? null,
  invokeType: row.invokeType ?? "API",
  serviceName: row.serviceName ?? null,
  apiPathOrTopic: row.apiPathOrTopic ?? null,
  partitionType: row.partitionType ?? null,
  parameters: row.parameters ?? null,
  depProcessIds: null,
  dependentProcessIds: parseDepIds(row.dependentProcessIds),
  estimatedTime: row.estimatedTime ?? null,
  skipProcess: row.skipProcess ?? "N",
  mandatory: row.mandatory ?? "Y"
});
const BatchProcessGridPanel = reactExports.forwardRef(function BatchProcessGridPanel2({ batchCode, gridMinHeight = "420px", hideInternalSaveButton = false }, ref) {
  const intl = useIntl();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const location = useLocation();
  location.state.menuId;
  const code = (batchCode == null ? void 0 : batchCode.trim()) ?? "";
  const DependentProcessSearchRenderer = reactExports.useCallback(
    (props) => {
      const { value, node, data } = props;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        dc,
        {
          multiSelect: true,
          apiEndpoint: SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK(),
          searchCode: "PROCESSID",
          setSelectedValue: (selectedIds) => {
            const filtered = selectedIds.filter(
              (id) => String(id).trim() !== String((data == null ? void 0 : data.processId) ?? "").trim()
            );
            if (filtered.length < selectedIds.length) {
              toast.warning(
                intl.formatMessage({
                  id: "batchframework.toast.dependentProcessSameAsProcess",
                  defaultMessage: "Dependent process cannot be same as process id"
                })
              );
            }
            node.setDataValue("dependentProcessIds", filtered);
          },
          selectedValue: value,
          selectedColumn: "iProcessId",
          gridDefObj: gridProcessIdDefObj,
          gridWidth: 350,
          gridHeight: 300,
          gridNoOfRowsPerPage: 5,
          searchBoxWidth: 350,
          searchBoxHeight: 30,
          searchBoxFontSize: 11,
          translate: false,
          error: false
        }
      );
    },
    [intl, toast]
  );
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.processId",
          defaultMessage: "Process id"
        }),
        field: "processId",
        width: 160,
        editable: false,
        filter: false,
        required: true,
        type: "numericColumn",
        cellRenderer: ProcessIdSearchRenderer,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.serial",
          defaultMessage: "Serial"
        }),
        field: "serialNo",
        width: 80,
        editable: true,
        filter: false,
        type: "numericColumn",
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.name",
          defaultMessage: "Name"
        }),
        field: "processName",
        width: 150,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.depIds",
          defaultMessage: "Dependent processes (comma-separated ids)"
        }),
        field: "dependentProcessIds",
        width: 380,
        editable: false,
        filter: false,
        cellRenderer: DependentProcessSearchRenderer,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.invokeType",
          defaultMessage: "Type"
        }),
        field: "invokeType",
        width: 100,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["API", "Event"] }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.serviceName",
          defaultMessage: "Service name"
        }),
        field: "serviceName",
        width: 150,
        editable: true,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.apiPathOrTopic",
          defaultMessage: "API path / topic name"
        }),
        field: "apiPathOrTopic",
        width: 220,
        editable: true,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.params",
          defaultMessage: "Parameters"
        }),
        field: "parameters",
        width: 180,
        editable: true,
        filter: false
      },
      // WITH these:
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.skip",
          defaultMessage: "Skip"
        }),
        field: "skipProcess",
        width: 70,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.skipProcess === "Y",
        valueSetter: (params) => {
          params.data.skipProcess = params.newValue ? "Y" : "N";
          return true;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.mandatory",
          defaultMessage: "Mandatory"
        }),
        field: "mandatory",
        width: 90,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.mandatory === "Y",
        valueSetter: (params) => {
          params.data.mandatory = params.newValue ? "Y" : "N";
          return true;
        }
      }
    ],
    [DependentProcessSearchRenderer, intl]
  );
  const loadBatchProcesses = reactExports.useCallback(() => {
    if (!code) {
      setRowData([]);
      return;
    }
    Kr.GET(BatchMastersAPI.BatchProcesses(code, "EC-BatchProcessMaster")).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      setRowData(
        data.map((item) => ({
          id: String(item.processId),
          ...item,
          dependentProcessIds: item.dependentProcessIds || item.depProcessIds,
          isPersisted: true
        }))
      );
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.loadBatchProcessesFailed",
          defaultMessage: "Failed to load batch processes"
        })
      );
      setRowData([]);
    });
  }, [code, intl, toast]);
  reactExports.useImperativeHandle(
    ref,
    () => ({
      submitChanges: () => {
        var _a, _b;
        return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
      },
      reload: () => loadBatchProcesses()
    }),
    [loadBatchProcesses]
  );
  reactExports.useEffect(() => {
    loadBatchProcesses();
  }, [loadBatchProcesses]);
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    var _a;
    if (!code) {
      toast.warning(
        intl.formatMessage({
          id: "batchframework.toast.enterBatchBeforeSave",
          defaultMessage: "Enter batch code and load before saving"
        })
      );
      return { success: false };
    }
    try {
      const response2 = await Kr.POST(BatchMastersAPI.BatchProcesses(code, "EC-BatchProcessMaster"), {
        deletedProcessIds: deletedRows.map((row) => row.processId).filter((id) => id != null),
        created: newRows.map((row) => rowToBatchProcessBody(row, code)),
        updated: updatedRows.map((row) => rowToBatchProcessBody(row, code))
      });
      if (((_a = response2.data.status) == null ? void 0 : _a.toLowerCase()) === "success") {
        toast.success(
          intl.formatMessage({
            id: "batchframework.toast.batchProcessSaved",
            defaultMessage: "Batch processes saved"
          })
        );
        return { success: true };
      }
      return { success: false, message: response2.data.message };
      loadBatchProcesses();
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.saveFailed",
          defaultMessage: "Save failed"
        })
      );
      return { success: false, message: response.data.message };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    bu,
    {
      ref: gridRef,
      rowData,
      columnDefs,
      gridStyle: { width: "100%", height: "100%", marginTop: "12px" },
      pagination: true,
      paginationPageSize: 10,
      sort: true,
      globalSearch: false,
      allowAdd: true,
      allowDelete: true,
      allowUpdate: true,
      rowDragging: false,
      onSave: handleSave,
      hideInternalSaveButton
    },
    intl.locale
  ) });
});
export {
  BatchProcessGridPanel as B
};
