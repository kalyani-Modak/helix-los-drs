import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, ac as Dt, aW as Kg, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { a as BatchMastersAPI, u as unwrapCommonResponse } from "./apiEndpoints-B3TJTOpa.js";
const rowToPartitionBody = (row) => ({
  partitionCode: row.partitionCode,
  partitionType: row.partitionType,
  description: row.description,
  dependency: row.dependency ?? null,
  active: row.active ?? "Y"
});
const PartitionMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = reactExports.useState([]);
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
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.type",
          defaultMessage: "Partition type"
        }),
        field: "partitionType",
        width: 200,
        editable: true,
        filter: true,
        required: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues }
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.code",
          defaultMessage: "Partition code"
        }),
        field: "partitionCode",
        width: 200,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.desc",
          defaultMessage: "Description"
        }),
        field: "description",
        width: 200,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.active",
          defaultMessage: "Active"
        }),
        field: "active",
        width: 80,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.active === "Y",
        valueSetter: (params) => {
          params.data.active = params.newValue ? "Y" : "N";
          return true;
        }
      }
    ],
    [intl, partitionTypeValues]
  );
  const refreshData = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.PartitionMaster(screenMenuId)).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      setRowData(
        data.map((item) => ({
          id: `${item.partitionCode}|${item.partitionType}`,
          ...item,
          isPersisted: true
        }))
      );
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.loadPartitionsFailed",
          defaultMessage: "Failed to load partitions"
        })
      );
      setRowData([]);
    });
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadPartitionTypes();
  }, [loadPartitionTypes]);
  reactExports.useEffect(() => {
    refreshData();
  }, [refreshData]);
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      await Kr.POST(BatchMastersAPI.PartitionMaster(screenMenuId), {
        created: newRows.map(rowToPartitionBody),
        updated: updatedRows.map(rowToPartitionBody),
        deleted: deletedRows.map((r) => ({
          partitionCode: r.partitionCode,
          partitionType: r.partitionType
        }))
      });
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.partitionSaved",
          defaultMessage: "Partition master saved"
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
          id: "label.PartitionMaster.title",
          defaultMessage: "Partition master"
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
          paginationPageSize: 8,
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
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, reset: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  PartitionMaster as default
};
