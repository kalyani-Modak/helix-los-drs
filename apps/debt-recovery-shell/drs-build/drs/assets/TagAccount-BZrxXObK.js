import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, em as useTheme, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, ef as useLocation, aX as Kr, c8 as TagAccountAPI, dD as lE, M as Chip, ac as Dt, cf as Typography, bV as Stack, dK as ps, cs as ap, b0 as Lg, g as AddIcon, c7 as Tag, cr as alpha, aW as Kg, aR as IconButton, a1 as DeleteOutlineIcon, ai as ExpandMoreIcon, S as Collapse, cy as bu, cj as Vg, v as Box } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const RefreshOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
}));
const SUGGESTED_TAGS = [
  "VIP",
  "Dispute",
  "Legal Review",
  "Skip Trace",
  "Hardship",
  "Fraud",
  "Deceased",
  "Bankruptcy",
  "Settlement"
];
const HISTORY_PAGE_SIZE = 4;
function makeRowId(prefix, idx) {
  return `${prefix}-${idx}-${Math.random().toString(36).slice(2, 9)}`;
}
function mapFetchRows(responseData) {
  const responseJson = responseData == null ? void 0 : responseData.responseJson;
  const raw = Array.isArray(responseJson) ? responseJson : Array.isArray(responseJson == null ? void 0 : responseJson.content) ? responseJson.content : [];
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => ({
    id: item.szTag != null ? `${item.szTag}-${index}` : makeRowId("srv", index),
    szTag: item.szTag ?? "",
    szRemark: item.szRemark ?? "",
    szCollectorCode: item.szCollectorCode ?? "",
    dtModifiedOn: item.dtModifiedOn ?? "",
    szMode: item.szMode ?? "",
    fromServer: true
  }));
}
function extractTotalElements(responseData, fallback = 0) {
  const responseJson = responseData == null ? void 0 : responseData.responseJson;
  const total = Number(
    (responseData == null ? void 0 : responseData.totalElements) ?? (responseData == null ? void 0 : responseData.totalCount) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalCount) ?? fallback
  );
  return Number.isFinite(total) ? total : fallback;
}
function addIdToSet(set, id) {
  const next = new Set(set);
  next.add(id);
  return next;
}
function removeIdFromSet(set, id) {
  const next = new Set(set);
  next.delete(id);
  return next;
}
function isSuccessPayload(data) {
  if (!data) return false;
  const s = data.status;
  return s === "Success" || s === 200 || s === "200";
}
function getActionChipSx(mode, theme) {
  if (mode === "added") {
    return {
      height: 20,
      fontSize: 10,
      fontWeight: 600,
      borderRadius: "999px",
      bgcolor: alpha(theme.palette.primary.main, 0.08),
      color: theme.palette.primary.main,
      border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
      "& .MuiChip-label": { px: 0.9 }
    };
  }
  if (mode === "removed") {
    return {
      height: 20,
      fontSize: 10,
      fontWeight: 600,
      borderRadius: "999px",
      bgcolor: alpha(theme.palette.error.main, 0.08),
      color: theme.palette.error.main,
      border: `1px solid ${alpha(theme.palette.error.main, 0.35)}`,
      "& .MuiChip-label": { px: 0.9 }
    };
  }
  return {
    height: 20,
    fontSize: 10,
    fontWeight: 600,
    borderRadius: "999px",
    bgcolor: alpha(theme.palette.text.primary, 0.06),
    color: theme.palette.text.secondary,
    border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
    "& .MuiChip-label": { px: 0.9 }
  };
}
function TagAccountDetails() {
  const intl = useIntl();
  const theme = useTheme();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);
  const [activeTags, setActiveTags] = reactExports.useState([]);
  const [historyTags, setHistoryTags] = reactExports.useState([]);
  const [newTag, setNewTag] = reactExports.useState("");
  const [newRemark, setNewRemark] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [fetchError, setFetchError] = reactExports.useState(null);
  const [historyError, setHistoryError] = reactExports.useState(null);
  const [historyTotalElements, setHistoryTotalElements] = reactExports.useState(0);
  const [historyOpen, setHistoryOpen] = reactExports.useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = reactExports.useState(0);
  const [deletedTagIds, setDeletedTagIds] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const serverBaselineRef = reactExports.useRef([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  const loadTags = reactExports.useCallback(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      setActiveTags([]);
      setHistoryTags([]);
      setHistoryTotalElements(0);
      serverBaselineRef.current = [];
      setDeletedTagIds(/* @__PURE__ */ new Set());
      return;
    }
    setLoading(true);
    setFetchError(null);
    setHistoryError(null);
    const handleResponse = (response, target) => {
      const httpStatus = response == null ? void 0 : response.status;
      const objData = response == null ? void 0 : response.data;
      if (httpStatus === 204) {
        if (target === "active") {
          serverBaselineRef.current = [];
          setActiveTags([]);
          setDeletedTagIds(/* @__PURE__ */ new Set());
        } else {
          setHistoryTags([]);
          setHistoryTotalElements(0);
        }
        return;
      }
      if ((objData == null ? void 0 : objData.status) === "Failure" && (objData == null ? void 0 : objData.message) === "Validation Failed") {
        handleValidationErrors(intl, toast, objData.responseJson);
        const msg = intl.formatMessage({
          id: target === "active" ? "label.tagaccount.fetchValidation" : "label.tagaccount.historyFetchValidation",
          defaultMessage: target === "active" ? "Could not load tags due to validation errors." : "Could not load tag history due to validation errors."
        });
        if (target === "active") setFetchError(msg);
        else setHistoryError(msg);
        return;
      }
      if (!isSuccessPayload(objData)) {
        const msg = (objData == null ? void 0 : objData.message) || intl.formatMessage({
          id: target === "active" ? "label.tagaccount.fetchFailed" : "label.tagaccount.historyFetchFailed",
          defaultMessage: target === "active" ? "Failed to fetch tag details." : "Failed to fetch tag history."
        });
        toast.warn(msg);
        if (target === "active") setFetchError(msg);
        else setHistoryError(msg);
        return;
      }
      const list = mapFetchRows(objData);
      if (target === "active") {
        const baseline = list.map((r) => ({
          szTag: r.szTag,
          szRemark: r.szRemark,
          szCollectorCode: r.szCollectorCode,
          dtModifiedOn: r.dtModifiedOn
        }));
        serverBaselineRef.current = baseline;
        setActiveTags(list);
        setDeletedTagIds(/* @__PURE__ */ new Set());
      } else {
        setHistoryTags(list);
        setHistoryTotalElements(extractTotalElements(objData, list.length));
        setHistoryRefreshKey((prev) => prev + 1);
      }
    };
    Promise.allSettled([
      Kr.GET(TagAccountAPI.TagAccount(screenMenuId) + `/fetchActiveTag`),
      Kr.GET(TagAccountAPI.TagAccount(screenMenuId))
    ]).then(([activeResult, historyResult]) => {
      if (activeResult.status === "fulfilled") {
        handleResponse(activeResult.value, "active");
      } else {
        console.error("TagAccount active fetch:", activeResult.reason);
        const msg = intl.formatMessage({
          id: "label.tagaccount.fetchNetwork",
          defaultMessage: "Error while fetching tag data."
        });
        toast.error(msg);
        setFetchError(msg);
      }
      if (historyResult.status === "fulfilled") {
        handleResponse(historyResult.value, "history");
      } else {
        console.error("TagAccount history fetch:", historyResult.reason);
        const msg = intl.formatMessage({
          id: "label.tagaccount.historyFetchNetwork",
          defaultMessage: "Error while fetching tag history."
        });
        toast.error(msg);
        setHistoryError(msg);
      }
    }).catch((err) => {
      console.error("TagAccount fetch:", err);
      const msg = intl.formatMessage({
        id: "label.tagaccount.fetchNetwork",
        defaultMessage: "Error while fetching tag data."
      });
      toast.error(msg);
      setFetchError(msg);
      setHistoryError(msg);
    }).finally(() => setLoading(false));
  }, [intl, selectedRow, toast]);
  reactExports.useEffect(() => {
    loadTags();
  }, [loadTags]);
  const visibleActiveTags = reactExports.useMemo(
    () => activeTags.filter((t) => !deletedTagIds.has(t.id)),
    [activeTags, deletedTagIds]
  );
  const historyRowData = reactExports.useMemo(
    () => historyTags.map((r, i) => ({
      id: r.id ?? `h-${i}`,
      szTag: r.szTag,
      szRemark: r.szRemark,
      szCollectorCode: r.szCollectorCode || (r.fromServer ? "" : userCode),
      dtModifiedOn: r.dtModifiedOn || "",
      szMode: r.fromServer ? r.szMode || "—" : "N"
    })),
    [historyTags, userCode]
  );
  const historyDatasource = reactExports.useMemo(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || HISTORY_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        setHistoryError(null);
        try {
          const response = await Kr.GET(TagAccountAPI.TagAccount(screenMenuId), {
            lstTagDetails: [],
            pageNumber,
            size,
            pageSize: size
          });
          const objData = response == null ? void 0 : response.data;
          if ((objData == null ? void 0 : objData.status) === "Failure" && (objData == null ? void 0 : objData.message) === "Validation Failed") {
            handleValidationErrors(intl, toast, objData.responseJson);
            const msg = intl.formatMessage({
              id: "label.tagaccount.historyFetchValidation",
              defaultMessage: "Could not load tag history due to validation errors."
            });
            setHistoryError(msg);
            (_a = params.failCallback) == null ? void 0 : _a.call(params);
            return;
          }
          if (!isSuccessPayload(objData)) {
            const msg = (objData == null ? void 0 : objData.message) || intl.formatMessage({
              id: "label.tagaccount.historyFetchFailed",
              defaultMessage: "Failed to fetch tag history."
            });
            setHistoryError(msg);
            (_b = params.failCallback) == null ? void 0 : _b.call(params);
            return;
          }
          const list = mapFetchRows(objData);
          const mappedRows = list.map((r, i) => ({
            id: r.id ?? `h-${startRow + i}`,
            szTag: r.szTag,
            szRemark: r.szRemark,
            szCollectorCode: r.szCollectorCode || (r.fromServer ? "" : userCode),
            dtModifiedOn: r.dtModifiedOn || "",
            szMode: r.fromServer ? r.szMode || "—" : "N"
          }));
          const total = extractTotalElements(objData, mappedRows.length);
          setHistoryTags(list);
          setHistoryTotalElements(total);
          (_c = params.successCallback) == null ? void 0 : _c.call(params, mappedRows, total);
        } catch (error) {
          console.error("TagAccount history fetch:", error);
          const msg = intl.formatMessage({
            id: "label.tagaccount.historyFetchNetwork",
            defaultMessage: "Error while fetching tag history."
          });
          setHistoryError(msg);
          (_d = params.failCallback) == null ? void 0 : _d.call(params);
        }
      }
    };
  }, [intl, selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO, toast, userCode]);
  const usedSuggestions = reactExports.useMemo(() => {
    const taken = new Set(visibleActiveTags.map((t) => t.szTag.trim().toLowerCase()));
    return SUGGESTED_TAGS.filter((s) => !taken.has(s.toLowerCase()));
  }, [visibleActiveTags]);
  const addTag = reactExports.useCallback(
    (tagName) => {
      const value = (tagName ?? newTag).trim();
      if (!value) {
        toast.error(
          intl.formatMessage({
            id: "label.tagaccount.tagRequired",
            defaultMessage: "Tag Name is required to add a tag."
          })
        );
        return;
      }
      if (visibleActiveTags.some((t) => t.szTag.trim().toLowerCase() === value.toLowerCase())) {
        toast.warn(
          intl.formatMessage({
            id: "label.tagaccount.duplicateTag",
            defaultMessage: "This tag already exists on the account."
          })
        );
        return;
      }
      setActiveTags((prev) => [
        ...prev,
        {
          id: makeRowId("new", prev.length),
          szTag: value,
          szRemark: newRemark.trim(),
          szCollectorCode: "",
          szMode: "",
          fromServer: false
        }
      ]);
      setNewTag("");
      setNewRemark("");
    },
    [intl, newRemark, newTag, toast, visibleActiveTags]
  );
  const removeTag = reactExports.useCallback((id) => {
    setActiveTags((prev) => {
      const row = prev.find((t) => t.id === id);
      if (!row) return prev;
      if (!row.fromServer) {
        setDeletedTagIds((current) => removeIdFromSet(current, id));
        return prev.filter((t) => t.id !== id);
      }
      setDeletedTagIds((current) => addIdToSet(current, id));
      return prev;
    });
  }, []);
  const canRemove = reactExports.useCallback(
    (row) => {
      if (!row.fromServer) return true;
      const collector = (row.szCollectorCode || "").trim();
      if (!collector) return true;
      return collector.toUpperCase() === userCode.trim().toUpperCase();
    },
    [userCode]
  );
  const buildSaveList = reactExports.useCallback(() => {
    const deletes = activeTags.filter((t) => t.fromServer && deletedTagIds.has(t.id)).map((t) => ({
      szTag: t.szTag,
      szRemark: t.szRemark || "",
      szCollectorCode: t.szCollectorCode || "",
      szMode: "D"
    }));
    const inserts = activeTags.filter((t) => !t.fromServer && !deletedTagIds.has(t.id)).map((t) => ({
      szTag: t.szTag.trim(),
      szRemark: t.szRemark || "",
      szCollectorCode: userCode,
      szMode: "N"
    }));
    return [...inserts, ...deletes];
  }, [activeTags, deletedTagIds, userCode]);
  const resetForm = reactExports.useCallback(() => {
    const baseline = serverBaselineRef.current || [];
    setDeletedTagIds(/* @__PURE__ */ new Set());
    setActiveTags(
      baseline.map((b, i) => ({
        id: b.szTag != null ? `${b.szTag}-${i}` : makeRowId("srv", i),
        szTag: b.szTag ?? "",
        szRemark: b.szRemark ?? "",
        szCollectorCode: b.szCollectorCode ?? "",
        szMode: "",
        fromServer: true
      }))
    );
    setNewTag("");
    setNewRemark("");
    setFetchError(null);
  }, []);
  const persistTags = reactExports.useCallback(() => {
    if (loading || saving) {
      return Promise.resolve();
    }
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(
        intl.formatMessage({
          id: "label.tagaccount.noAccountSelected",
          defaultMessage: "No account selected."
        })
      );
      return Promise.resolve();
    }
    const invalidNew = activeTags.filter(
      (t) => !t.fromServer && (!t.szTag || !t.szTag.trim())
    );
    if (invalidNew.length > 0) {
      toast.error(
        intl.formatMessage({
          id: "label.tagaccount.tagRequired",
          defaultMessage: "Tag Name is required to add a tag."
        })
      );
      return Promise.reject(new Error("validation"));
    }
    const lstTagDetails = buildSaveList();
    if (lstTagDetails.length === 0) {
      toast.info(
        intl.formatMessage({
          id: "label.tagaccount.noChanges",
          defaultMessage: "No changes to save."
        })
      );
      return Promise.resolve();
    }
    const payload = {
      lstTagDetails
    };
    setSaving(true);
    return Kr.PUT(TagAccountAPI.TagAccount(screenMenuId), payload).then((objResponse) => {
      const objResData = objResponse == null ? void 0 : objResponse.data;
      if ((objResData == null ? void 0 : objResData.status) === "Failure" && (objResData == null ? void 0 : objResData.message) === "Validation Failed") {
        handleValidationErrors(intl, toast, objResData.responseJson);
        throw new Error("validation");
      }
      if (isSuccessPayload(objResData)) {
        toast.success(
          objResData.message || intl.formatMessage({
            id: "label.tagaccount.saveSuccess",
            defaultMessage: "Changes saved successfully."
          })
        );
        loadTags();
        return objResData;
      }
      const errMsg = (objResData == null ? void 0 : objResData.message) || intl.formatMessage({
        id: "label.tagaccount.saveFailed",
        defaultMessage: "Failed to save changes."
      });
      toast.error(errMsg);
      throw new Error(errMsg);
    }).catch((err) => {
      if ((err == null ? void 0 : err.message) !== "validation") {
        console.error("TagAccount save:", err);
        toast.error(
          intl.formatMessage({
            id: "label.tagaccount.saveNetwork",
            defaultMessage: "Error while saving data."
          })
        );
      }
      throw err;
    }).finally(() => setSaving(false));
  }, [
    buildSaveList,
    intl,
    loadTags,
    loading,
    saving,
    selectedRow,
    activeTags,
    toast
  ]);
  const historyColumnDefs = reactExports.useMemo(
    () => [
      {
        flex: 1,
        headerName: intl.formatMessage({
          id: "label.tagaccount.col.action",
          defaultMessage: "Action"
        }),
        field: "szMode",
        editable: false,
        cellRenderer: (params) => {
          const raw = String((params == null ? void 0 : params.value) || "").trim().toUpperCase();
          const isAdded = raw === "N" || raw === "NEW";
          const isRemoved = raw === "D" || raw === "DELETE";
          const label = isAdded ? intl.formatMessage({
            id: "label.tagaccount.modeAdded",
            defaultMessage: "Added"
          }) : isRemoved ? intl.formatMessage({
            id: "label.tagaccount.modeRemoved",
            defaultMessage: "Removed"
          }) : (params == null ? void 0 : params.value) || "-";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              size: "small",
              label,
              sx: (chipTheme) => getActionChipSx(isAdded ? "added" : isRemoved ? "removed" : "default", chipTheme)
            }
          );
        },
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.tagaccount.col.tag",
          defaultMessage: "Tag"
        }),
        field: "szTag",
        flex: 1,
        editable: false,
        cellStyle: { textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({
          id: "label.tagaccount.col.user",
          defaultMessage: "User"
        }),
        field: "szCollectorCode",
        flex: 1,
        editable: false,
        cellStyle: { textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({
          id: "label.tagaccount.col.dateTime",
          defaultMessage: "Date & Time"
        }),
        field: "dtModifiedOn",
        type: "dateTime",
        flex: 1.2,
        editable: false,
        cellStyle: { textAlign: lE.TEXT }
      },
      {
        headerName: intl.formatMessage({
          id: "label.tagaccount.remarks",
          defaultMessage: "Remarks"
        }),
        field: "szRemark",
        flex: 1,
        editable: false,
        cellStyle: { textAlign: lE.TEXT }
      }
    ],
    [intl, theme]
  );
  const historyGridStyle = reactExports.useMemo(
    () => ({
      width: "100%",
      minHeight: 250,
      maxHeight: 400,
      height: 250
    }),
    []
  );
  const sectionLabelSx = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "text.secondary"
  };
  if (!selectedRow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "body2", color: "text.secondary", children: intl.formatMessage({
      id: "label.tagaccount.noAccountSelected",
      defaultMessage: "No account selected. Open an account from the worklist to manage tags."
    }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 2, sm: 3 },
              // ← horizontal padding left & right
              py: { xs: 1.5, sm: 2 },
              // ← vertical padding top & bottom
              pb: 2
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 1, sx: { maxWidth: 1320, mx: "auto" }, children: [
              fetchError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", children: fetchError }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.tagaccount.addNewTag",
                      defaultMessage: "Add New Tag"
                    }),
                    colon: false,
                    translate: false,
                    align: "left",
                    component: "div",
                    color: theme.palette.primary.main,
                    sx: sectionLabelSx
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Stack,
                  {
                    direction: { xs: "column", sm: "row" },
                    spacing: 1,
                    alignItems: { xs: "stretch", sm: "center" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          value: newTag,
                          onChange: (e) => setNewTag(e.target.value),
                          editable: true,
                          width: "100%",
                          placeholder: intl.formatMessage({
                            id: "label.tagaccount.tagPlaceholder",
                            defaultMessage: "Enter tag name"
                          }),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") addTag();
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          value: newRemark,
                          onChange: (e) => setNewRemark(e.target.value),
                          editable: true,
                          width: "100%",
                          placeholder: intl.formatMessage({
                            id: "label.tagaccount.remarkPlaceholder",
                            defaultMessage: "Remark (optional)"
                          }),
                          onKeyDown: (e) => {
                            if (e.key === "Enter") addTag();
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flexShrink: 0, ml: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Lg,
                        {
                          id: "tagaccount-add",
                          label: "label.tagaccount.addButton",
                          size: "small",
                          variant: "contained",
                          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { sx: { fontSize: 12 } }),
                          onClick: () => addTag(),
                          disabled: loading || saving,
                          sx: { mt: 1 }
                        }
                      ) })
                    ]
                  }
                ),
                usedSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.75,
                      mt: 0.5
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 10,
                            color: "text.secondary",
                            mr: 0.5,
                            width: "100%"
                          },
                          children: intl.formatMessage({
                            id: "label.tagaccount.suggestions",
                            defaultMessage: "Suggestions:"
                          })
                        }
                      ),
                      usedSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Chip,
                        {
                          size: "small",
                          variant: "outlined",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Dt,
                            {
                              component: "span",
                              sx: {
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.25,
                                fontSize: 11
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { sx: { fontSize: 12 } }),
                                s
                              ]
                            }
                          ),
                          onClick: () => addTag(s),
                          sx: {
                            borderStyle: "dashed",
                            height: 26,
                            cursor: "pointer",
                            "& .MuiChip-label": { px: 1 }
                          }
                        },
                        s
                      ))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage(
                      {
                        id: "label.tagaccount.accountTagsCount",
                        defaultMessage: "Account Tags ({count})"
                      },
                      { count: visibleActiveTags.length }
                    ),
                    colon: false,
                    translate: false,
                    align: "left",
                    component: "div",
                    color: theme.palette.primary.main,
                    sx: sectionLabelSx
                  }
                ),
                visibleActiveTags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    loading,
                    sx: {
                      py: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tag,
                        {
                          sx: {
                            fontSize: 28,
                            color: alpha(theme.palette.text.secondary, 0.35),
                            mb: 1
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 12, color: "text.secondary" }, children: intl.formatMessage({
                        id: "label.tagaccount.emptyTitle",
                        defaultMessage: "No tags assigned to this account"
                      }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 10,
                            color: "text.secondary",
                            mt: 0.5,
                            opacity: 0.75
                          },
                          children: intl.formatMessage({
                            id: "label.tagaccount.emptyHint",
                            defaultMessage: "Use the form above or click a suggestion to add one"
                          })
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { spacing: 0.75, children: visibleActiveTags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Kg,
                  {
                    variant: "outlined",
                    sx: {
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: t.fromServer ? "background.paper" : alpha(theme.palette.primary.main, 0.06),
                      borderColor: t.fromServer ? "divider" : alpha(theme.palette.primary.main, 0.25)
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Chip,
                        {
                          label: t.szTag,
                          size: "small",
                          color: t.fromServer ? "default" : "primary",
                          sx: {
                            "& .MuiChip-label": { fontSize: 11, fontWeight: 600 }
                          }
                        }
                      ),
                      t.fromServer ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            flex: 1,
                            fontSize: 12,
                            color: "text.secondary",
                            minWidth: 0
                          },
                          noWrap: true,
                          children: t.szRemark || "—"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          id: `tag-remark-${t.id}`,
                          value: t.szRemark,
                          onChange: (e) => {
                            const v = e.target.value;
                            setActiveTags(
                              (prev) => prev.map(
                                (x) => x.id === t.id ? { ...x, szRemark: v } : x
                              )
                            );
                          },
                          editable: true,
                          width: "100%",
                          size: "small"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 10,
                            fontFamily: "ui-monospace, monospace",
                            color: "text.secondary",
                            opacity: 0.7,
                            flexShrink: 0,
                            ml: "auto"
                          },
                          children: t.szCollectorCode || userCode
                        }
                      ),
                      canRemove(t) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          size: "small",
                          "aria-label": "remove tag",
                          onClick: () => removeTag(t.id),
                          disabled: loading || saving,
                          sx: { color: "error.main", opacity: 0.85 },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } })
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 9,
                            fontStyle: "italic",
                            color: "text.secondary",
                            flexShrink: 0
                          },
                          children: intl.formatMessage({
                            id: "label.tagaccount.otherUser",
                            defaultMessage: "other user"
                          })
                        }
                      )
                    ]
                  },
                  t.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      cursor: "pointer",
                      userSelect: "none"
                    },
                    onClick: () => setHistoryOpen((prev) => !prev),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshOutlinedIcon,
                        {
                          sx: { fontSize: 13, color: "text.secondary" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ps,
                        {
                          value: intl.formatMessage(
                            {
                              id: "label.tagaccount.historyTitleCount",
                              defaultMessage: "Tag History ({count})"
                            },
                            { count: historyTotalElements }
                          ),
                          colon: false,
                          translate: false,
                          align: "left",
                          component: "div",
                          color: theme.palette.primary.main,
                          sx: sectionLabelSx
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ExpandMoreIcon,
                        {
                          sx: {
                            fontSize: 16,
                            color: "text.secondary",
                            ml: "auto",
                            transform: historyOpen ? "rotate(0deg)" : "rotate(-90deg)",
                            transition: "transform 0.2s"
                          }
                        }
                      )
                    ]
                  }
                ),
                historyError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", children: historyError }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Collapse, { in: historyOpen, sx: { mt: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: "-14px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  bu,
                  {
                    rowData: historyRowData,
                    columnDefs: historyColumnDefs,
                    gridStyle: historyGridStyle,
                    rowModelType: "infinite",
                    datasource: historyDatasource,
                    cacheBlockSize: HISTORY_PAGE_SIZE,
                    maxBlocksInCache: 2,
                    pagination: true,
                    paginationPageSize: HISTORY_PAGE_SIZE,
                    domLayout: "normal",
                    sort: true,
                    globalSearch: false,
                    allowAdd: false,
                    allowDelete: false,
                    allowUpdate: false,
                    rowDragging: false,
                    addCheckBoxes: false,
                    hideInternalSaveButton: true,
                    isLoading: loading,
                    showTitle: false
                  },
                  `tag-history-${(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) || "none"}-${historyRefreshKey}`
                ) }) })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: persistTags,
            onReset: resetForm,
            onClose: () => navigate("/homelayout/welcomepage"),
            disableToast: { save: true, reset: true, close: true }
          }
        )
      ]
    }
  );
}
const TagAccount = () => {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      breadcrumbMid: intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection"
      }),
      title: intl.formatMessage({
        id: "label.tagaccount.header",
        defaultMessage: "Tag Account"
      }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Box,
        {
          sx: {
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            width: "100%"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(TagAccountDetails, {})
        }
      )
    }
  );
};
export {
  TagAccount as default
};
