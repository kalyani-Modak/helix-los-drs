import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, ef as useLocation, aX as Kr, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, dK as ps, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { P as PhasesAPI } from "./apiEndpoints-CGlR3-gk.js";
function buildPhaseMasterColumnDefs(formatMessage) {
  return [
    {
      headerName: formatMessage({
        id: "label.PhaseMaster.Code",
        defaultMessage: "Code"
      }),
      field: "szCondition",
      required: true,
      width: 180,
      editable: true,
      filter: false,
      sortable: true
    },
    {
      headerName: formatMessage({
        id: "label.PhaseMaster.Description",
        defaultMessage: "Description"
      }),
      field: "szDescription",
      flex: 1,
      minWidth: 220,
      required: true,
      editable: true,
      filter: false,
      sortable: true
    }
  ];
}
const DESCRIPTION_KEY_PREFIX = "label.PhaseMaster.phase.";
function resolveDescription(intl, rawValue) {
  if (!rawValue) return { display: "", isI18nKey: false };
  const trimmed = rawValue.trim();
  const looksLikeKey = /^\S+\./.test(trimmed);
  if (!looksLikeKey) {
    return { display: trimmed, isI18nKey: false };
  }
  try {
    const translated = intl.formatMessage(
      { id: trimmed, defaultMessage: "__MISS__" }
    );
    if (translated !== "__MISS__") {
      return { display: translated, isI18nKey: true };
    }
  } catch {
  }
  let extracted;
  if (trimmed.startsWith(DESCRIPTION_KEY_PREFIX)) {
    extracted = trimmed.slice(DESCRIPTION_KEY_PREFIX.length).trim();
  } else {
    const lastDot = trimmed.lastIndexOf(".");
    extracted = lastDot !== -1 ? trimmed.slice(lastDot + 1).trim() : trimmed;
  }
  return { display: extracted || trimmed, isI18nKey: false };
}
function normalizeRows(intl, payload) {
  const raw = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.responseJson) ?? (payload == null ? void 0 : payload.data) ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const rawDesc = (item.szDescription ?? "").trim();
    const { display, isI18nKey } = resolveDescription(intl, rawDesc);
    return {
      ...item,
      szCondition: (item.szCondition ?? "").trim(),
      szDescription: display,
      _rawDescription: rawDesc,
      _isPlainDescription: !isI18nKey,
      key: (item.szCondition ?? "").trim() || `row-${index}`,
      mode: "E"
    };
  });
}
function findDuplicateCodes(rows) {
  const seen = /* @__PURE__ */ new Set();
  const dupes = /* @__PURE__ */ new Set();
  rows.forEach((r) => {
    const code = (r.szCondition ?? "").trim().toLowerCase();
    if (code) {
      if (seen.has(code)) dupes.add(r.szCondition.trim());
      else seen.add(code);
    }
  });
  return [...dupes];
}
function Phases() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [originalRowData, setOriginalRowData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [isFetched, setIsFetched] = reactExports.useState(false);
  const location = useLocation();
  const ScreenMenuId = location.state.menuId;
  const formatMessage = reactExports.useCallback(
    (opts) => intl.formatMessage(opts),
    [intl]
  );
  const columnDefs = reactExports.useMemo(
    () => buildPhaseMasterColumnDefs(formatMessage),
    [formatMessage]
  );
  const handleFetch = reactExports.useCallback(async () => {
    try {
      setLoading(true);
      const res = await Kr.GET(PhasesAPI.Phases(ScreenMenuId));
      const body = (res == null ? void 0 : res.data) ?? {};
      const rows = normalizeRows(intl, body);
      setRowData(rows);
      setOriginalRowData(rows);
      setIsFetched(true);
      if (rows.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "label.PhaseMaster.noData",
            defaultMessage: "No Phases Found."
          })
        );
      }
    } catch {
      setIsFetched(false);
      setRowData([]);
      setOriginalRowData([]);
      toast.error(
        intl.formatMessage({
          id: "label.PhaseMaster.fetchError",
          defaultMessage: "Error while fetching Phases."
        })
      );
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    handleFetch();
  }, [handleFetch]);
  const handleCellEdit = reactExports.useCallback((params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;
    setRowData(
      (prev) => prev.map((row) => {
        if (row.key !== data.key) return row;
        const updated = {
          ...row,
          [colDef.field]: newValue,
          mode: row.mode !== "N" ? "E" : row.mode
        };
        if (colDef.field === "szDescription") {
          updated._rawDescription = newValue;
          updated._isPlainDescription = true;
        }
        return updated;
      })
    );
  }, []);
  const handleAddRow = reactExports.useCallback(
    (newRow) => ({
      ...newRow,
      key: newRow.key || `new-${Date.now()}-${Math.random()}`,
      szCondition: newRow.szCondition ?? "",
      szDescription: newRow.szDescription ?? "",
      _rawDescription: newRow.szDescription ?? "",
      _isPlainDescription: true,
      mode: "N"
    }),
    []
  );
  const toBackendRow = reactExports.useCallback((row) => {
    const descriptionToSend = row.mode === "N" || row._isPlainDescription ? (row.szDescription ?? "").trim() : (row._rawDescription ?? row.szDescription ?? "").trim();
    return {
      szCondition: (row.szCondition ?? "").trim(),
      szDescription: descriptionToSend,
      szMode: row.mode
    };
  }, []);
  const handleSave = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a;
      const hasChanges = [...newRows, ...updatedRows, ...deletedRows].length > 0;
      if (!hasChanges) {
        toast.info(
          intl.formatMessage({
            id: "info.no.changes.save",
            defaultMessage: "No changes to save."
          })
        );
        return;
      }
      const allActiveRows = [...rowData, ...newRows].filter(
        (r) => !deletedRows.some((d) => d.key === r.key)
      );
      const duplicates = findDuplicateCodes(allActiveRows);
      if (duplicates.length > 0) {
        toast.error(
          intl.formatMessage(
            {
              id: "label.PhaseMaster.duplicateCode",
              defaultMessage: "Duplicate Phase code: {code}"
            },
            { code: duplicates.join(", ") }
          )
        );
        return { success: false };
      }
      try {
        setLoading(true);
        const payload = [
          ...newRows.map(toBackendRow),
          ...updatedRows.map(toBackendRow),
          ...deletedRows.map(toBackendRow)
        ];
        const res = await Kr.POST(PhasesAPI.Phases(ScreenMenuId), payload);
        const body = (res == null ? void 0 : res.data) ?? {};
        if (body.status === "Success") {
          await handleFetch();
          return { success: true };
        }
        if (((_a = body.message) == null ? void 0 : _a.toLowerCase()) === "validation failed") {
          handleValidationErrors(intl, toast, body.errors);
          return { success: false };
        }
        return { success: false };
      } catch (e) {
        toast.error(
          intl.formatMessage({
            id: "label.PhaseMaster.saveError",
            defaultMessage: "Error while saving Phase."
          })
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [handleFetch, intl, rowData, toast, toBackendRow]
  );
  const handleReset = reactExports.useCallback(() => {
    setRowData([...originalRowData]);
    return { success: true };
  }, [originalRowData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "phase-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.PhaseMaster.title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: intl.formatMessage({
            id: "label.PhaseMaster.titleDesc",
            defaultMessage: "Define the phases of an account life-cycle, stamped on accounts via collection strategy."
          }),
          align: "left",
          colon: false
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "phase-master-grid-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridClassName: "drs-phase-master-grid",
          gridStyle: { width: "100%", height: "55vh", minHeight: "360px" },
          embeddedInSection: true,
          pagination: true,
          paginationPageSize: 10,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onSave: handleSave,
          onAddRow: handleAddRow,
          onCellValueChanged: handleCellEdit,
          getRowId: (params) => params.data.key,
          isLoading: loading,
          hideInternalSaveButton: true
        },
        intl.locale
      ),
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
    ] })
  ] });
}
export {
  Phases as default
};
