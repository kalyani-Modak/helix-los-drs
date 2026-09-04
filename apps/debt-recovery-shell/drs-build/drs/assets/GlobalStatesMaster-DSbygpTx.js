import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, cf as Typography, cs as ap, b0 as Lg, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { W as WfStateMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
function getGlobalStatesMasterColumnDefs(intl) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.GlobalStatesMaster.stateCode",
        defaultMessage: "State"
      }),
      field: "szStateCode",
      width: 200,
      minWidth: 160,
      filter: false,
      required: true,
      sortable: true,
      editable: (params) => {
        var _a, _b;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N" || ((_b = params.data) == null ? void 0 : _b.szMode) === "N";
      },
      valueSetter: (params) => {
        params.data.szStateCode = (params.newValue || "").toUpperCase();
        return true;
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.GlobalStatesMaster.description",
        defaultMessage: "Description"
      }),
      field: "szDesc",
      flex: 1,
      minWidth: 200,
      editable: true,
      filter: false,
      required: true,
      sortable: true
    }
  ];
}
function extractWfStateListFromPayload(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.responseJson)) return data.responseJson;
  if (Array.isArray(data.data)) return data.data;
  return [];
}
function mapRowsFromResponse(list) {
  if (!Array.isArray(list)) return [];
  return list.map((dto) => ({
    szStateCode: dto.szStateCode != null ? String(dto.szStateCode).trim() : "",
    szDesc: dto.szDesc != null ? String(dto.szDesc).trim() : "",
    szMode: "E"
  }));
}
function buildSaveRow(row, mode) {
  return {
    szStateCode: (row.szStateCode ?? "").trim(),
    szDesc: (row.szDesc ?? "").trim(),
    szMode: mode
  };
}
function filterRowsByStateAndDesc(rows, stateFilter, descFilter) {
  const stateQ = (stateFilter ?? "").trim().toLowerCase();
  const descQ = (descFilter ?? "").trim().toLowerCase();
  if (!stateQ && !descQ) {
    return rows;
  }
  return rows.filter((row) => {
    const code = (row.szStateCode ?? "").toLowerCase();
    const desc = (row.szDesc ?? "").toLowerCase();
    const okState = !stateQ || code.includes(stateQ);
    const okDesc = !descQ || desc.includes(descQ);
    return okState && okDesc;
  });
}
const GlobalStatesMasterScreen = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [allRows, setAllRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [stateFilterDraft, setStateFilterDraft] = reactExports.useState("");
  const [descFilterDraft, setDescFilterDraft] = reactExports.useState("");
  const [appliedFilters, setAppliedFilters] = reactExports.useState({ state: "", desc: "" });
  const location = useLocation();
  const menuId = location.state.menuId;
  const columnDefs = reactExports.useMemo(
    () => getGlobalStatesMasterColumnDefs(intl),
    [intl, intl.locale]
  );
  const filteredRows = reactExports.useMemo(
    () => filterRowsByStateAndDesc(allRows, appliedFilters.state, appliedFilters.desc),
    [allRows, appliedFilters]
  );
  const loadWfStates = reactExports.useCallback(async () => {
    var _a;
    setLoading(true);
    try {
      const res = await Kr.GET(WfStateMasterAPI.WfStates(menuId));
      const payload = res == null ? void 0 : res.data;
      const status = res == null ? void 0 : res.status;
      const isOk = typeof status === "number" && status >= 200 && status < 300;
      if (!isOk || (payload == null ? void 0 : payload.status) === "Failure") {
        toast.error(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.fetchError",
            defaultMessage: "Error while fetching global states."
          })
        );
        setAllRows([]);
        return [];
      }
      const list = extractWfStateListFromPayload(payload);
      const rows = mapRowsFromResponse(list);
      setAllRows(rows);
      return rows;
    } catch (err) {
      console.error(err);
      const data = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data;
      if ((data == null ? void 0 : data.errors) || (data == null ? void 0 : data.responseJson)) {
        handleValidationErrors(intl, toast, data.errors || data.responseJson);
      } else {
        toast.error(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.fetchError",
            defaultMessage: "Error while fetching global states."
          })
        );
      }
      setAllRows([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadWfStates();
  }, [loadWfStates]);
  const handleApplyFilters = () => {
    setAppliedFilters({
      state: stateFilterDraft.trim(),
      desc: descFilterDraft.trim()
    });
  };
  const handleClearFilters = () => {
    setStateFilterDraft("");
    setDescFilterDraft("");
    setAppliedFilters({ state: "", desc: "" });
  };
  const validateActiveRows = (rows) => {
    for (const row of rows) {
      const code = (row.szStateCode ?? "").trim();
      const desc = (row.szDesc ?? "").trim();
      if (!code) {
        toast.error(
          intl.formatMessage({
            id: "error.GlobalStatesMaster.codeMandatory",
            defaultMessage: "State code is mandatory"
          })
        );
        return false;
      }
      if (!desc) {
        toast.error(
          intl.formatMessage({
            id: "error.GlobalStatesMaster.descMandatory",
            defaultMessage: "Description is mandatory"
          })
        );
        return false;
      }
    }
    const seen = /* @__PURE__ */ new Set();
    for (const row of rows) {
      const key = (row.szStateCode ?? "").trim().toUpperCase();
      if (seen.has(key)) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.GlobalStatesMaster.duplicateCode",
              defaultMessage: "Duplicate state code: {code}"
            },
            { code: (row.szStateCode ?? "").trim() }
          )
        );
        return false;
      }
      seen.add(key);
    }
    return true;
  };
  const handleGridSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a;
      const activeRows = [...newRows, ...updatedRows];
      if (!validateActiveRows(activeRows)) {
        return { success: false };
      }
      const payload = [
        ...newRows.map((row) => buildSaveRow(row, "N")),
        ...updatedRows.map((row) => buildSaveRow(row, "E")),
        ...deletedRows.map((row) => buildSaveRow(row, "D"))
      ];
      if (payload.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.GlobalStatesMaster.noChanges",
            defaultMessage: "No changes to save."
          })
        );
        return { success: false };
      }
      try {
        const res = await Kr.POST(WfStateMasterAPI.WfStates(menuId), payload);
        const data = res == null ? void 0 : res.data;
        if ((data == null ? void 0 : data.status) === "Success") {
          await loadWfStates();
          return { success: true };
        }
        if ((data == null ? void 0 : data.errors) || (data == null ? void 0 : data.responseJson)) {
          handleValidationErrors(intl, toast, data.errors || data.responseJson);
          return { success: false };
        }
        return { success: false };
      } catch (err) {
        const data = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data;
        if ((data == null ? void 0 : data.errors) || (data == null ? void 0 : data.responseJson)) {
          handleValidationErrors(intl, toast, data.errors || data.responseJson);
        }
        return { success: false };
      }
    },
    [intl, toast, loadWfStates]
  );
  const handleReset = async () => {
    handleClearFilters();
    await loadWfStates();
    return { success: true };
  };
  Boolean(appliedFilters.state || appliedFilters.desc);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "global-states-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "global-states-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        vp,
        {
          title: intl.formatMessage({
            id: "label.GlobalStatesMaster.title",
            defaultMessage: "Global States"
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body1", className: "global-states-master-description", children: intl.formatMessage({
        id: "label.GlobalStatesMaster.pageHeaderDescription",
        defaultMessage: "Workflow stages of an account. State movement rules are configured in the Workflows screen."
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "global-states-master-filter-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "global-states-master-filter-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "global-states-master-filter-label", children: intl.formatMessage({
          id: "label.GlobalStatesMaster.stateFilter",
          defaultMessage: "State"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "global-states-master-filter-input", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            id: "global-states-filter-state",
            value: stateFilterDraft,
            onChange: (e) => setStateFilterDraft(e.target.value),
            editable: true,
            placeholder: "label.GlobalStatesMaster.stateFilterPlaceholder",
            width: "176px"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "global-states-master-filter-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "global-states-master-filter-label", children: intl.formatMessage({
          id: "label.GlobalStatesMaster.descriptionFilter",
          defaultMessage: "Description"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "global-states-master-filter-input-desc", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            id: "global-states-filter-desc",
            value: descFilterDraft,
            onChange: (e) => setDescFilterDraft(e.target.value),
            editable: true,
            placeholder: "label.GlobalStatesMaster.descriptionFilterPlaceholder",
            width: "224px"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "global-states-master-filter-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          sx: { height: "30px", mt: 0.5, minWidth: "80px" },
          label: intl.formatMessage({
            id: "label.GlobalStatesMaster.fetch",
            defaultMessage: "Fetch"
          }),
          onClick: handleApplyFilters
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "global-states-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: filteredRows,
        columnDefs,
        gridClassName: "drs-list-grid global-states-master-grid",
        embeddedInSection: true,
        pagination: true,
        paginationPageSize: 10,
        sort: true,
        allowAdd: true,
        allowUpdate: true,
        allowDelete: true,
        globalSearch: false,
        isLoading: loading,
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
        onReset: handleReset,
        onClose: () => navigate("/homelayout/welcomepage")
      }
    )
  ] });
};
export {
  GlobalStatesMasterScreen as default
};
