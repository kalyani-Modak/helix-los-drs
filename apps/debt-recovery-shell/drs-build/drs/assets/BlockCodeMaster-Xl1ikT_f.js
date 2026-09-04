import { dN as reactExports, ed as useIntl, ct as ar, eh as useNavigate, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, dK as ps, cs as ap, cy as bu, cj as Vg, aX as Kr } from "./index-BhdgJqva.js";
import { B as BlockCodeMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
/* empty css                                 */
function getBlockcodeMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.BlockCode",
        defaultMessage: "Block Code"
      }),
      field: "szBlockCode",
      flex: 0.45,
      filter: false,
      required: true,
      editable: (params) => {
        var _a, _b;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N" || ((_b = params.data) == null ? void 0 : _b.szMode) === "N";
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.Description",
        defaultMessage: "Block Code Description"
      }),
      field: "szBlockDesc",
      editable: true,
      flex: 1,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.BlockCodeMaster.Active",
        defaultMessage: "Active"
      }),
      field: "chActiveYn",
      flex: 0.25,
      editable: true,
      filter: false,
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      valueGetter: (params) => params.data.chActiveYn === "Y",
      valueSetter: (params) => {
        params.data.chActiveYn = params.newValue ? "Y" : "N";
        return true;
      }
    }
  ];
}
function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) => String(r.szBlockCode ?? "").toLowerCase().includes(q) || String(r.szBlockDesc ?? "").toLowerCase().includes(q)
  );
}
const BlockCodeMaster = () => {
  const [rowData, setRowData] = reactExports.useState([]);
  const [selectedType, setSelectedType] = reactExports.useState("BLKCD");
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const columnDefs = reactExports.useMemo(() => getBlockcodeMasterColumnDefs(intl), [intl, intl.locale]);
  const filteredRows = reactExports.useMemo(
    () => filterRowsBySearch(rowData, searchQuery),
    [rowData, searchQuery]
  );
  const fetchBlockCodeDetails = async (type) => {
    var _a, _b;
    try {
      const res = await Kr.GET(
        BlockCodeMasterAPI.BlockCode(screenMenuId) + `?szBlockCodeType=${type}`
      );
      const data = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) || [];
      if (!Array.isArray(data)) {
        setRowData([]);
        return;
      }
      setRowData(
        data.map((row) => {
          var _a2;
          return {
            ...row,
            szMode: "E",
            chActiveYn: ((_a2 = row.chActiveYn) == null ? void 0 : _a2.trim()) === "Y" ? "Y" : "N"
          };
        })
      );
    } catch (error) {
      const data = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b.data;
      if (data == null ? void 0 : data.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "error.blockCode.fetchFailed",
            defaultMessage: "Failed to fetch block codes"
          })
        );
      }
      setRowData([]);
    }
  };
  reactExports.useEffect(() => {
    fetchBlockCodeDetails(selectedType);
  }, [selectedType]);
  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = []
  }) => {
    var _a;
    try {
      const mappedRows = [
        ...newRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "N"
        })),
        ...updatedRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "E"
        })),
        ...deletedRows.map((row) => ({
          szBlockCode: row.szBlockCode,
          szBlockDesc: row.szBlockDesc,
          chActiveYn: row.chActiveYn || "N",
          szMode: "D"
        }))
      ];
      if (mappedRows.length === 0) {
        toast.warning("No changes to save");
        return;
      }
      const payload = {
        szBlockCodeType: selectedType,
        lstBlockCodeMasterDto: mappedRows
      };
      console.log("Final Payload:", payload);
      const res = await Kr.POST(
        BlockCodeMasterAPI.BlockCode(screenMenuId),
        payload
      );
      const data = res == null ? void 0 : res.data;
      if ((data == null ? void 0 : data.status) !== "Success") {
        if (data == null ? void 0 : data.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "error.blockCode.saveFailed",
              defaultMessage: "Block Code Save failed"
            })
          );
        }
        return { success: false };
      }
      fetchBlockCodeDetails(selectedType);
      return { success: true };
    } catch (e) {
      const data = (_a = e == null ? void 0 : e.response) == null ? void 0 : _a.data;
      if (data == null ? void 0 : data.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
        return { success: false };
      }
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.BlockCodeMaster.title",
            defaultMessage: "Block Code Master"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Typography,
        {
          variant: "body1",
          className: "portfolio-master-description",
          children: intl.formatMessage({
            id: "label.BlockCodeMaster.subtitle",
            defaultMessage: "Define block codes for credit cards. Codes must match host system values."
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-toolbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-search-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-search-label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.BlockCodeMaster.search",
            defaultMessage: "Search block codes"
          }),
          colon: false
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-search-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          id: "blockcode-master-search",
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          editable: true,
          placeholder: "label.PortfolioMaster.searchPlaceholder",
          width: "260px"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: filteredRows,
        columnDefs,
        isLoading: true,
        gridStyle: {
          width: "100%",
          height: "55vh",
          minHeight: "360px"
        },
        pagination: true,
        paginationPageSize: 10,
        allowAdd: true,
        allowUpdate: true,
        allowDelete: true,
        gridClassName: "drs-list-grid",
        embeddedInSection: true,
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
        onClose: () => navigate("/homelayout/welcomepage"),
        disableToast: { close: true }
      }
    )
  ] });
};
export {
  BlockCodeMaster as default
};
