import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, ac as Dt, aW as Kg, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { a as BatchMastersAPI, u as unwrapCommonResponse } from "./apiEndpoints-B3TJTOpa.js";
const rowToProcessBody = (row) => ({
  processId: row.processId != null && row.processId !== "" ? Number(row.processId) : null,
  processName: row.processName ?? null,
  processDesc: row.processDesc ?? null,
  estimatedTime: row.estimatedTime ?? null,
  skipProcess: row.skipProcess ?? "N",
  mandatory: row.mandatory ?? "Y",
  invokeType: row.invokeType ?? "API",
  serviceName: row.serviceName ?? null,
  apiPathOrTopic: row.apiPathOrTopic ?? null,
  parameters: row.parameters ?? null,
  partitionType: row.partitionType ?? "DEFAULT"
});
const ProcessMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = reactExports.useState(["DEFAULT"]);
  const [serviceNameValues, setServiceNameValues] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const loadPartitionTypes = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.listPartitionTypes(screenMenuId)).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      const types = [...new Set(data.map((t) => t.partitionType).filter(Boolean))];
      setPartitionTypeValues(types.length > 0 ? types : ["DEFAULT"]);
    }).catch(() => {
      setPartitionTypeValues(["DEFAULT"]);
    });
  }, []);
  const loadServiceNames = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.ProcessMaster(screenMenuId) + `/configured-services`).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      const names = [...new Set(data.map((s) => s.serviceName).filter(Boolean))];
      setServiceNameValues(names);
    }).catch(() => {
      setServiceNameValues([]);
    });
  }, []);
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.id",
          defaultMessage: "Process Id"
        }),
        field: "processId",
        width: 110,
        editable: true,
        filter: false,
        type: "numericColumn",
        required: true,
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
          id: "label.processmaster.name",
          defaultMessage: "Name"
        }),
        field: "processName",
        width: 160,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.desc",
          defaultMessage: "Description"
        }),
        field: "processDesc",
        width: 180,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.invokeType",
          defaultMessage: "Type"
        }),
        field: "invokeType",
        width: 100,
        editable: true,
        filter: false,
        required: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["API", "Event"] }
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.serviceName",
          defaultMessage: "Service name"
        }),
        field: "serviceName",
        width: 160,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: serviceNameValues }
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.apiPathOrTopic",
          defaultMessage: "API Path / Topic Name"
        }),
        field: "apiPathOrTopic",
        width: 220,
        editable: true,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.params",
          defaultMessage: "Parameters"
        }),
        field: "parameters",
        width: 200,
        editable: true,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.partitionType",
          defaultMessage: "Partition type"
        }),
        field: "partitionType",
        width: 160,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues }
      }
    ],
    [intl, partitionTypeValues, serviceNameValues]
  );
  const refreshData = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.ProcessMaster(screenMenuId)).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      setRowData(
        data.map((item) => ({
          id: String(item.processId),
          ...item,
          isPersisted: true
        }))
      );
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.loadProcessesFailed",
          defaultMessage: "Failed to load processes"
        })
      );
      setRowData([]);
    });
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadPartitionTypes();
    loadServiceNames();
  }, [loadPartitionTypes, loadServiceNames]);
  reactExports.useEffect(() => {
    refreshData();
  }, [refreshData]);
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      for (const row of deletedRows) {
        if (row.processId != null) {
          await Kr.DELETE(BatchMastersAPI.ProcessMaster(screenMenuId) + `/${row.processId}`);
        }
      }
      for (const row of newRows) {
        await Kr.POST(BatchMastersAPI.ProcessMaster(screenMenuId), rowToProcessBody(row));
      }
      for (const row of updatedRows) {
        await Kr.PUT(BatchMastersAPI.ProcessMaster(screenMenuId) + `/${row.processId}`, rowToProcessBody(row));
      }
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.processSaved",
          defaultMessage: "Process master saved"
        })
      );
      refreshData();
      loadPartitionTypes();
      return { success: true };
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.saveFailed",
          defaultMessage: "Save failed"
        })
      );
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.ProcessMaster.title",
          defaultMessage: "Process master"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { p: 2, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "100%", height: "420px", marginTop: "20px" },
          pagination: true,
          paginationPageSize: 10,
          sort: true,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          rowDragging: false,
          onSave: handleSave
        },
        intl.locale
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onReset: () => {
            refreshData();
            loadPartitionTypes();
            loadServiceNames();
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, reset: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  ProcessMaster as default
};
