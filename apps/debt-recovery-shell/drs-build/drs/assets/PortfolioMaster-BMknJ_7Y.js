import { ed as useIntl, eh as useNavigate, ct as ar, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, dK as ps, cs as ap, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { i as PortfolioAPI } from "./apiEndpoints-CGlR3-gk.js";
/* empty css                                 */
const LOGGED_IN_USER_KEY = "LOGGED_IN_USER";
function getModifiedBy() {
  if (typeof sessionStorage === "undefined") return "SYSTEM";
  return sessionStorage.getItem(LOGGED_IN_USER_KEY) || "SYSTEM";
}
function mapDtoToRow(dto) {
  const code = dto.szPortfolioCode ?? "";
  return {
    code,
    description: dto.szPortfolioDescription ?? "",
    active: dto.szActive === "Y"
  };
}
function extractPortfolioListFromPayload(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.responseJson)) return data.responseJson;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.body)) return data.body;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.result)) return data.result;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return extractPortfolioListFromPayload(parsed);
    } catch {
      return [];
    }
  }
  return [];
}
function mapRowsFromResponse(data) {
  if (!Array.isArray(data)) return [];
  return data.map(mapDtoToRow);
}
function buildSaveItem({ code, description, active }, mode, szModifiedBy) {
  return {
    szPortfolioCode: String(code ?? "").trim(),
    szPortfolioDescription: String(description ?? "").trim(),
    szActive: active ? "Y" : "N",
    szMode: mode,
    szModifiedBy
  };
}
function emptyFormDraft() {
  return { code: "", description: "", active: true };
}
function filterRowsBySearch(rows, query) {
  const q = String(query ?? "").trim().toLowerCase();
  if (!q) return rows;
  return rows.filter(
    (r) => String(r.code ?? "").toLowerCase().includes(q) || String(r.description ?? "").toLowerCase().includes(q)
  );
}
function getPortfolioMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.PortfolioCode",
        defaultMessage: "Portfolio Code"
      }),
      field: "code",
      flex: 0.45,
      editable: false,
      sortable: true,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.Description",
        defaultMessage: "Description"
      }),
      field: "description",
      flex: 1,
      editable: true,
      required: true,
      sortable: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.PortfolioMaster.Active",
        defaultMessage: "Active"
      }),
      field: "active",
      flex: 0.25,
      editable: true,
      sortable: true,
      cellRenderer: "agCheckboxCellRenderer"
    }
  ];
}
const PortfolioMaster = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [allRows, setAllRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [uiMode, setUiMode] = reactExports.useState("idle");
  const [formDraft, setFormDraft] = reactExports.useState(() => emptyFormDraft());
  const [formSnapshot, setFormSnapshot] = reactExports.useState(null);
  const location = useLocation();
  const menuId = location.state.menuId;
  const columnDefs = reactExports.useMemo(() => getPortfolioMasterColumnDefs(intl), [intl, intl.locale]);
  const filteredRows = reactExports.useMemo(
    () => filterRowsBySearch(allRows, searchQuery),
    [allRows, searchQuery]
  );
  const loadPortfolios = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const res = await Kr.GET(PortfolioAPI.Portfolio(menuId));
      if (res == null) {
        setAllRows([]);
        return [];
      }
      const status = res.status;
      const payloadList = extractPortfolioListFromPayload(res.data);
      if (status === 406) {
        setAllRows([]);
        return [];
      }
      const isOk = typeof status === "number" && status >= 200 && status < 300;
      if (!isOk) {
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.load",
            defaultMessage: "Unable to load portfolio records."
          })
        );
        setAllRows([]);
        return [];
      }
      const rows = mapRowsFromResponse(payloadList);
      setAllRows(rows);
      return rows;
    } catch (err) {
      console.error(err);
      toast.error(
        intl.formatMessage({
          id: "error.portfolio.load",
          defaultMessage: "Unable to load portfolio records."
        })
      );
      setAllRows([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);
  const resetToBaseline = reactExports.useCallback(async () => {
    setSearchQuery("");
    setUiMode("idle");
    setFormDraft(emptyFormDraft());
    setFormSnapshot(null);
    await loadPortfolios();
  }, [loadPortfolios]);
  const parseSaveSuccess = (res) => {
    var _a;
    if (!res) return false;
    if (res.status >= 400) return false;
    const st = (_a = res.data) == null ? void 0 : _a.status;
    if (typeof st === "string" && st.toLowerCase() === "success") return true;
    return res.status === 200 && res.data != null;
  };
  const handleGridSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a;
      const allChanged = [...newRows, ...updatedRows, ...deletedRows];
      if (allChanged.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "info.portfolio.noChanges",
            defaultMessage: "No changes to save."
          })
        );
        return;
      }
      for (const row of [...newRows, ...updatedRows]) {
        if (!String(row.code ?? "").trim()) {
          toast.error(
            intl.formatMessage({
              id: "validation.portfolio.codeRequired",
              defaultMessage: "Portfolio code is required."
            })
          );
          return { success: false };
        }
        if (!String(row.description ?? "").trim()) {
          toast.error(
            intl.formatMessage({
              id: "validation.portfolio.descriptionRequired",
              defaultMessage: "Description is required."
            })
          );
          return;
        }
      }
      const szModifiedBy = getModifiedBy();
      const normalize = (row) => ({
        code: row.code,
        description: String(row.description ?? "").trim(),
        active: Boolean(row.active)
      });
      const payload = [
        ...newRows.map((r) => buildSaveItem(normalize(r), "N", szModifiedBy)),
        ...updatedRows.map((r) => buildSaveItem(normalize(r), "E", szModifiedBy)),
        ...deletedRows.map((r) => buildSaveItem(normalize(r), "D", szModifiedBy))
      ];
      try {
        const res = await Kr.PUT(PortfolioAPI.Portfolio(menuId), payload);
        if (!parseSaveSuccess(res)) {
          toast.error(
            ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.message) || intl.formatMessage({
              id: "error.portfolio.save",
              defaultMessage: "Save failed."
            })
          );
          return { success: false };
        }
        await loadPortfolios();
        setUiMode("idle");
        const cleared = emptyFormDraft();
        setFormDraft({ ...cleared });
        setFormSnapshot(null);
        return { success: true };
      } catch (err) {
        console.error(err);
        toast.error(
          intl.formatMessage({
            id: "error.portfolio.save",
            defaultMessage: "Save failed."
          })
        );
        return { success: false };
      }
    },
    [intl, loadPortfolios, toast]
  );
  const handleClose = reactExports.useCallback(() => {
    navigate("/homelayout/welcomepage");
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: intl.formatMessage({ id: "label.PortfolioMaster.title", defaultMessage: "Portfolio Master" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: "portfolio-master-description", children: intl.formatMessage({
        id: "label.PortfolioMaster.subtitle",
        defaultMessage: "Pre-defined loan portfolios. Activate or deactivate portfolios used across products and buckets."
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-toolbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "portfolio-master-search-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-search-label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({ id: "label.PortfolioMaster.searchLabel", defaultMessage: "Search" }), colon: false }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "portfolio-master-search-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          id: "portfolio-master-search",
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
        gridStyle: { width: "100%", height: "57vh", minHeight: "360px" },
        pagination: true,
        paginationPageSize: 10,
        sort: true,
        allowAdd: false,
        allowDelete: false,
        allowUpdate: true,
        globalSearch: false,
        isLoading: loading,
        gridClassName: "drs-list-grid",
        embeddedInSection: true,
        onSave: handleGridSave
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
          resetToBaseline();
        },
        onClose: handleClose
      }
    )
  ] });
};
export {
  PortfolioMaster as default
};
