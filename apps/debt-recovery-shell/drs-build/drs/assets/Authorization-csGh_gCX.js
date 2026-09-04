import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, el as useSelector, $ as $e, ef as useLocation, aX as Kr, o as AuthorizationAPI, cI as dayjs, ac as Dt, cB as cc, dK as ps, I as CheckCircleOutline, bT as ShieldOutlined, cy as bu, aW as Kg, bH as SE, dI as pp, cj as Vg } from "./index-BhdgJqva.js";
import { A as AccessTimeOutlined } from "./AccessTimeOutlined-Cg2of2l-.js";
import { A as AutorenewOutlinedIcon } from "./AutorenewOutlined-BEkg8ZAd.js";
import { W as WarningAmberOutlined } from "./WarningAmberOutlined-Dk2s5JuY.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const PendingOutlined = createSvgIcon([/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8"
}, "0"), /* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "7",
  cy: "12",
  r: "1.5"
}, "1"), /* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "12",
  cy: "12",
  r: "1.5"
}, "2"), /* @__PURE__ */ jsxRuntimeExports.jsx("circle", {
  cx: "17",
  cy: "12",
  r: "1.5"
}, "3")]);
const RestoreOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M13 3c-4.97 0-9 4.03-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9m-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"
}));
const AUTH_HISTORY_PAGE_SIZE = 15;
function safeString(value) {
  return String(value ?? "").trim();
}
function firstDefined(item, keys) {
  for (const key of keys) {
    const value = item == null ? void 0 : item[key];
    if (value !== void 0 && value !== null && String(value).trim() !== "")
      return value;
  }
  return "";
}
function toComparableDate(value) {
  if (!value) return "";
  const text = safeString(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parsed = dayjs(text);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}
function normalizeStatus(value) {
  return safeString(value).toLowerCase();
}
function normalizeFlag(value) {
  return normalizeStatus(value).replace(/[^a-z0-9]/g, "");
}
function getDecisionStatusCode(decision) {
  const n = safeString(decision).toLowerCase();
  if (n === "approve") return "AUTH";
  if (n === "reject") return "REJ";
  return "";
}
function getStatusCategory(item) {
  const s = normalizeStatus((item == null ? void 0 : item.szAuthStatus) || "");
  const d = normalizeStatus((item == null ? void 0 : item.approvalStatus) || "");
  if (s === "auth" || s === "rej" || d === "auth" || d === "rej") {
    return "history";
  }
  return "pending";
}
function mapAuthorizationRow(item, index) {
  return {
    id: safeString(item == null ? void 0 : item.lnHisAuthSeqNo) || safeString(item == null ? void 0 : item.lnAuthSeqNo) || `row-${index}`,
    raw: item,
    statusCategory: getStatusCategory(item),
    authType: (item == null ? void 0 : item.szAuthorizationForDesc) || "-",
    requestedOn: (item == null ? void 0 : item.dtRequestedOn) || "-",
    requestedBy: (item == null ? void 0 : item.szRequestBy) || "-",
    doneReq: `${(item == null ? void 0 : item.inAuthDone) || 0}/${(item == null ? void 0 : item.inNoOfAuthRequired) || 0}`,
    profileReq: (item == null ? void 0 : item.szProfileCodes) || "-",
    details: (item == null ? void 0 : item.szSystemRemark) || "-",
    requestFor: (item == null ? void 0 : item.szSystemRemark) || "-",
    policyLabel: (item == null ? void 0 : item.szAuthorizationForDesc) || "",
    decision: "",
    authTypeLabel: (item == null ? void 0 : item.szAuthTypeYn) === "H" ? "Hierarchy Based" : "Single",
    authorizedBy: (item == null ? void 0 : item.szCreatedBy) || "-",
    decisionDate: (item == null ? void 0 : item.dtCreatedOn) || "-",
    statusBadge: (item == null ? void 0 : item.szAuthStatus) || ""
  };
}
function extractPendingRows(responseJson) {
  var _a;
  if (!responseJson || typeof responseJson !== "object") return [];
  const pendingSourceRaw = responseJson.lstPending ?? ((_a = responseJson.responseJson) == null ? void 0 : _a.lstPending) ?? responseJson;
  if (Array.isArray(pendingSourceRaw)) return pendingSourceRaw;
  if (Array.isArray(pendingSourceRaw == null ? void 0 : pendingSourceRaw.content)) return pendingSourceRaw.content;
  return [];
}
function extractHistoryRows(responseJson) {
  var _a, _b, _c;
  if (!responseJson || typeof responseJson !== "object")
    return { history: [], historyTotal: 0 };
  const historySource = responseJson.lstHistory ?? ((_a = responseJson.responseJson) == null ? void 0 : _a.lstHistory) ?? responseJson;
  const history = Array.isArray(historySource) ? historySource : Array.isArray(historySource == null ? void 0 : historySource.content) ? historySource.content : [];
  const historyTotalRaw = Number(
    responseJson.totalHistoryElements ?? responseJson.totalElements ?? ((_b = responseJson.responseJson) == null ? void 0 : _b.totalHistoryElements) ?? ((_c = responseJson.responseJson) == null ? void 0 : _c.totalElements) ?? (historySource == null ? void 0 : historySource.totalElements) ?? history.length
  );
  return {
    history,
    historyTotal: Number.isFinite(historyTotalRaw) ? historyTotalRaw : history.length
  };
}
function StatCard({ card }) {
  const { colors, border, text } = $e();
  const Icon = card.icon;
  const palette = {
    warning: (colors == null ? void 0 : colors.warning) || "#f59e0b",
    success: (colors == null ? void 0 : colors.success) || "#22c55e",
    error: (colors == null ? void 0 : colors.error) || "#ef4444",
    info: (colors == null ? void 0 : colors.primary) || "#2563eb"
  };
  const color = palette[card.tone] || "#64748b";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        borderColor: border.divider,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 1
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              color,
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 15 } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: card.label,
            translate: false,
            align: "left",
            colon: false,
            sx: { fontSize: 11, color: text.secondary, fontWeight: 500, flex: 1 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: String(card.value),
            translate: false,
            align: "left",
            colon: false,
            sx: { fontSize: 14, fontWeight: 700, color: text.primary }
          }
        )
      ]
    }
  );
}
function RequestTypeChip({ value, active }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: active ? "primary.main" : "divider",
        width: "fit-content"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value,
          translate: true,
          align: "left",
          colon: false,
          sx: { fontSize: 11, fontWeight: 600 }
        }
      )
    }
  );
}
function StatusBadge({ rawStatus }) {
  const s = normalizeStatus(rawStatus || "");
  let label, color;
  if (s === "auth" || s.includes("auth") || s.includes("appr")) {
    label = "Authorised";
    color = "#22c55e";
  } else if (s === "rej" || s.includes("reject")) {
    label = "Rejected";
    color = "#ef4444";
  } else if (s === "canc" || s.includes("cancel") || s.includes("revert")) {
    label = "Reverted";
    color = "#6366f1";
  } else {
    label = "-";
    color = null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: color || "divider",
        width: "fit-content"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: label,
          translate: false,
          align: "left",
          colon: false,
          sx: { fontSize: 11, fontWeight: 600, color: color || "text.primary" }
        }
      )
    }
  );
}
function Authorization() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const { selectedRow } = useSelector((state) => state.account);
  const { text, border } = $e();
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const allocationSeqNo = (selectedRow == null ? void 0 : selectedRow.ALLOC_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.allocSeqNo);
  const partitionCode = (selectedRow == null ? void 0 : selectedRow.PARTITION_CODE) ?? (selectedRow == null ? void 0 : selectedRow.szPartitionCode) ?? "001";
  const [loading, setLoading] = reactExports.useState(false);
  const [loadError, setLoadError] = reactExports.useState("");
  const [pendingRows, setPendingRows] = reactExports.useState([]);
  const [historyRows, setHistoryRows] = reactExports.useState([]);
  const [historyTotalElements, setHistoryTotalElements] = reactExports.useState(0);
  const [historyRefreshVersion, setHistoryRefreshVersion] = reactExports.useState(0);
  const [tabIndex, setTabIndex] = reactExports.useState(0);
  const [selectedRowIds, setSelectedRowIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [decisionValue, setDecisionValue] = reactExports.useState("");
  const [notesValue, setNotesValue] = reactExports.useState("");
  const loggedInUser = reactExports.useMemo(
    () => sessionStorage.getItem("SEC_USERNAME") || sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM",
    []
  );
  const decisionOptions = reactExports.useMemo(
    () => [
      {
        value: "Approve",
        label: intl.formatMessage({
          id: "label.authorization.decision.approve",
          defaultMessage: "Approve"
        })
      },
      {
        value: "Reject",
        label: intl.formatMessage({
          id: "label.authorization.decision.reject",
          defaultMessage: "Reject"
        })
      }
    ],
    [intl]
  );
  const translateLabelValue = reactExports.useCallback(
    (value) => {
      const label = safeString(value);
      if (!label) return "";
      if (/^label\./.test(label))
        return intl.formatMessage({ id: label, defaultMessage: label });
      return label;
    },
    [intl]
  );
  const loadAuthorizations = reactExports.useCallback(async () => {
    var _a, _b;
    if (!allocationSeqNo) {
      setPendingRows([]);
      setHistoryRows([]);
      setHistoryTotalElements(0);
      setSelectedRowIds(/* @__PURE__ */ new Set());
      setLoadError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const res = await Kr.GET(
        `${AuthorizationAPI.Authorizations(screenMenuId)}/findPendingAuthorizationByAllocSeqNo`,
        {
          params: {
            lnAllocSeqNo: allocationSeqNo,
            szPartitionCode: partitionCode || "001"
          }
        }
      );
      const data = res.data ?? {};
      const success = typeof data.status === "string" ? data.status.toLowerCase() === "success" : res.status >= 200 && res.status < 300;
      const pending = extractPendingRows(data.responseJson);
      const mappedPending = pending.map((item, i) => ({
        ...mapAuthorizationRow(item, i),
        statusCategory: "pending"
      }));
      const rows = [...mappedPending];
      if (success) {
        const translateRows = (rows2) => rows2.map((row) => ({
          ...row,
          authType: translateLabelValue(row.authType),
          policyLabel: translateLabelValue(row.policyLabel),
          details: translateLabelValue(row.details),
          requestFor: translateLabelValue(row.requestFor)
        }));
        setPendingRows(translateRows(mappedPending));
        setHistoryRows([]);
        try {
          const historyMetaRes = await Kr.GET(
            `${AuthorizationAPI.Authorizations(screenMenuId)}/findAuthorizationHistoryByAllocSeqNo`,
            {
              params: {
                lnAllocSeqNo: allocationSeqNo,
                szPartitionCode: partitionCode || "001",
                pageNumber: 1,
                size: 1,
                pageSize: 1
              }
            }
          );
          const historyMetaData = (historyMetaRes == null ? void 0 : historyMetaRes.data) ?? {};
          const historyMetaSuccess = typeof historyMetaData.status === "string" ? historyMetaData.status.toLowerCase() === "success" : (historyMetaRes == null ? void 0 : historyMetaRes.status) >= 200 && (historyMetaRes == null ? void 0 : historyMetaRes.status) < 300;
          if (historyMetaSuccess) {
            const { historyTotal } = extractHistoryRows(historyMetaData.responseJson);
            setHistoryTotalElements(historyTotal);
          } else {
            setHistoryTotalElements(0);
          }
        } catch {
          setHistoryTotalElements(0);
        }
        setHistoryRefreshVersion((v) => v + 1);
        setSelectedRowIds((currentIds) => {
          const nextIds = new Set(
            Array.from(currentIds || []).filter(
              (id) => rows.some((r) => r.id === id)
            )
          );
          return nextIds.size > 0 ? nextIds : rows[0] ? /* @__PURE__ */ new Set([rows[0].id]) : /* @__PURE__ */ new Set();
        });
      } else {
        setPendingRows([]);
        setHistoryRows([]);
        setHistoryTotalElements(0);
        setSelectedRowIds(/* @__PURE__ */ new Set());
        setLoadError(
          safeString(data.message || data.msg) || intl.formatMessage({
            id: "label.authorization.loadFailed",
            defaultMessage: "Failed to load authorizations."
          })
        );
      }
    } catch (error) {
      setPendingRows([]);
      setHistoryRows([]);
      setHistoryTotalElements(0);
      setSelectedRowIds(/* @__PURE__ */ new Set());
      const msg = ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
        id: "label.authorization.loadFailed",
        defaultMessage: "Failed to load authorizations."
      });
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [allocationSeqNo, partitionCode, intl, toast]);
  reactExports.useEffect(() => {
    loadAuthorizations();
  }, [loadAuthorizations]);
  const historyDatasource = reactExports.useMemo(() => {
    if (!allocationSeqNo) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || AUTH_HISTORY_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        try {
          const res = await Kr.GET(
            `${AuthorizationAPI.Authorizations(screenMenuId)}/findAuthorizationHistoryByAllocSeqNo`,
            {
              params: {
                lnAllocSeqNo: allocationSeqNo,
                szPartitionCode: partitionCode || "001",
                pageNumber,
                size,
                pageSize: size
              }
            }
          );
          const data = (res == null ? void 0 : res.data) ?? {};
          const success = typeof data.status === "string" ? data.status.toLowerCase() === "success" : (res == null ? void 0 : res.status) >= 200 && (res == null ? void 0 : res.status) < 300;
          if (!success) {
            (_a = params.failCallback) == null ? void 0 : _a.call(params);
            return;
          }
          const { history, historyTotal } = extractHistoryRows(data.responseJson);
          const mappedHistory = history.map((item, i) => ({
            ...mapAuthorizationRow(item, startRow + i),
            statusCategory: "history"
          }));
          const translatedHistory = mappedHistory.map((row) => ({
            ...row,
            authType: translateLabelValue(row.authType),
            policyLabel: translateLabelValue(row.policyLabel),
            details: translateLabelValue(row.details),
            requestFor: translateLabelValue(row.requestFor)
          }));
          setHistoryTotalElements(historyTotal);
          (_b = params.successCallback) == null ? void 0 : _b.call(params, translatedHistory, historyTotal);
        } catch (error) {
          const msg = ((_d = (_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
            id: "label.authorization.loadFailed",
            defaultMessage: "Failed to load authorizations."
          });
          setLoadError(msg);
          toast.error(msg);
          (_e = params.failCallback) == null ? void 0 : _e.call(params);
        }
      }
    };
  }, [allocationSeqNo, partitionCode, translateLabelValue, intl, toast, historyRefreshVersion]);
  const counts = reactExports.useMemo(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const summary = {
      pending: pendingRows.length,
      approved: 0,
      rejected: 0,
      Reverted: 0
    };
    const seen = /* @__PURE__ */ new Set();
    historyRows.forEach((row) => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!(row == null ? void 0 : row.id) || seen.has(row.id)) return;
      seen.add(row.id);
      const authStatus = normalizeStatus(
        ((_a = row.raw) == null ? void 0 : _a.szAuthStatus) || row.statusBadge || ""
      );
      const revertFlag = normalizeFlag(
        ((_b = row.raw) == null ? void 0 : _b.szRevertYn) || ((_c = row.raw) == null ? void 0 : _c.cRevertYn) || ""
      );
      if (revertFlag === "y" || authStatus === "canc" || authStatus.includes("cancel")) {
        summary.Reverted += 1;
        return;
      }
      if (authStatus === "rej" || authStatus.includes("reject")) {
        summary.rejected += 1;
        return;
      }
      if (authStatus === "auth" || authStatus.includes("appr")) {
        const decisionDateStr = toComparableDate(
          ((_d = row.raw) == null ? void 0 : _d.dtCreatedOn) ?? ((_e = row.raw) == null ? void 0 : _e.dtDecisionOn) ?? ((_f = row.raw) == null ? void 0 : _f.dtAuthorizedOn) ?? ((_g = row.raw) == null ? void 0 : _g.dtApprovedOn) ?? ""
        );
        if (decisionDateStr === todayStr) summary.approved += 1;
      }
    });
    return summary;
  }, [historyRows, pendingRows.length]);
  const isPendingTab = tabIndex === 0;
  const filteredRows = reactExports.useMemo(
    () => isPendingTab ? pendingRows : historyRows,
    [historyRows, pendingRows, tabIndex]
  );
  const currentTabLabel = isPendingTab ? "Authorization Requests" : "Authorization History";
  const gridOverlayNoRowsTemplate = reactExports.useMemo(() => {
    const message = isPendingTab ? intl.formatMessage({
      id: "label.authorization.table.emptyPending",
      defaultMessage: "No pending authorization requests found."
    }) : intl.formatMessage({
      id: "label.authorization.table.emptyHistory",
      defaultMessage: "No authorization history found."
    });
    return `<span style="display:block;padding:16px;color:${text.secondary};font-size:12px;">${message}</span>`;
  }, [intl, isPendingTab, text.secondary]);
  const toggleSelectedRow = reactExports.useCallback(
    (rowId) => {
      if (!isPendingTab) return;
      setSelectedRowIds((currentIds) => {
        const nextIds = new Set(currentIds || []);
        nextIds.has(rowId) ? nextIds.delete(rowId) : nextIds.add(rowId);
        return nextIds;
      });
    },
    [isPendingTab]
  );
  const selectedAuthorizations = reactExports.useMemo(
    () => filteredRows.filter((row) => selectedRowIds.has(row.id)),
    [filteredRows, selectedRowIds]
  );
  const handleGridRowClicked = reactExports.useCallback(
    (params) => {
      var _a, _b, _c;
      if (!isPendingTab || !((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.id)) return;
      if ((_c = (_b = params.event) == null ? void 0 : _b.target) == null ? void 0 : _c.closest('[data-authorization-checkbox="true"]'))
        return;
      toggleSelectedRow(params.data.id);
    },
    [isPendingTab, toggleSelectedRow]
  );
  const authorizationColumnDefs = reactExports.useMemo(() => {
    const pendingColumns = [
      {
        headerName: "",
        field: "__select__",
        width: 52,
        suppressMenu: true,
        filter: false,
        sortable: false,
        editable: false,
        cellStyle: () => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }),
        cellRenderer: (params) => {
          var _a;
          const active = Boolean(
            ((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.id) && selectedRowIds.has(params.data.id)
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              "data-authorization-checkbox": "true",
              component: "button",
              type: "button",
              onMouseDown: (e) => e.stopPropagation(),
              onClick: (e) => {
                e.stopPropagation();
                toggleSelectedRow(params.data.id);
              },
              sx: {
                border: 0,
                background: "transparent",
                p: 0.5,
                width: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 1,
                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.main",
                  outlineOffset: 1
                }
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(cc, { checked: active, onChange: () => {
              }, label: "" })
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.type",
          defaultMessage: "Auth Type"
        }),
        field: "authType",
        flex: 1.1,
        minWidth: 140,
        editable: false,
        filter: false,
        cellRenderer: (params) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            RequestTypeChip,
            {
              value: (params == null ? void 0 : params.value) || "-",
              active: Boolean(
                ((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.id) && selectedRowIds.has(params.data.id)
              )
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requested",
          defaultMessage: "Requested On"
        }),
        field: "requestedOn",
        width: 120,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.by",
          defaultMessage: "Requested By"
        }),
        field: "requestedBy",
        width: 130,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.doneReq",
          defaultMessage: "Done/Required"
        }),
        field: "doneReq",
        width: 100,
        editable: false,
        filter: false,
        cellStyle: { fontWeight: 600 }
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.profileReq",
          defaultMessage: "Profile Required"
        }),
        field: "profileReq",
        flex: 0.95,
        minWidth: 150,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.details",
          defaultMessage: "Details"
        }),
        field: "details",
        flex: 1.6,
        minWidth: 260,
        editable: false,
        filter: false,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        },
        cellRenderer: (params) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                background: "transparent",
                alignItems: "center",
                width: "100%"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: safeString((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.details) || "-",
                  translate: false,
                  align: "left",
                  colon: false,
                  sx: {
                    fontSize: 11,
                    color: text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }
                }
              )
            }
          );
        },
        tooltipValueGetter: (params) => {
          var _a;
          return safeString((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.details) || "-";
        }
      }
    ];
    const historyColumns = [
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.date",
          defaultMessage: "Date"
        }),
        field: "requestedOn",
        width: 120,
        editable: false,
        filter: false,
        type: "date"
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requestedBy",
          defaultMessage: "Requested By"
        }),
        field: "requestedBy",
        width: 130,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requestFor",
          defaultMessage: "Request For"
        }),
        field: "requestFor",
        flex: 1.6,
        minWidth: 220,
        editable: false,
        filter: false,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start"
        },
        cellRenderer: (params) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Dt,
            {
              sx: {
                background: "transparent",
                alignItems: "center",
                width: "100%"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: safeString((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.requestFor) || "-",
                  translate: false,
                  align: "left",
                  colon: false,
                  sx: {
                    fontSize: 11,
                    color: text.primary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }
                }
              )
            }
          );
        },
        tooltipValueGetter: (params) => {
          var _a;
          return safeString((_a = params == null ? void 0 : params.data) == null ? void 0 : _a.requestFor) || "-";
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.status",
          defaultMessage: "Status"
        }),
        field: "statusBadge",
        width: 130,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => {
          var _a;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { rawStatus: (_a = params == null ? void 0 : params.data) == null ? void 0 : _a.statusBadge });
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.authorizedBy",
          defaultMessage: "Authorized By"
        }),
        field: "authorizedBy",
        width: 140,
        editable: false,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.decisionDate",
          defaultMessage: "Decision Date"
        }),
        field: "decisionDate",
        width: 130,
        editable: false,
        filter: false,
        type: "date"
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.authTypeLabel",
          defaultMessage: "Auth Type"
        }),
        field: "authTypeLabel",
        width: 145,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "inline-flex",
              alignItems: "center",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: safeString(params == null ? void 0 : params.value) || "-",
                translate: false,
                align: "left",
                colon: false,
                sx: { fontSize: 11, fontWeight: 500 }
              }
            )
          }
        )
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.doneReq",
          defaultMessage: "Done/Req"
        }),
        field: "doneReq",
        width: 100,
        editable: false,
        filter: false,
        cellStyle: { fontWeight: 600 }
      }
    ];
    return isPendingTab ? pendingColumns : historyColumns;
  }, [intl, isPendingTab, selectedRowIds, text.primary, toggleSelectedRow]);
  reactExports.useEffect(() => {
    var _a, _b;
    (_b = (_a = gridRef.current) == null ? void 0 : _a.api) == null ? void 0 : _b.refreshCells({ force: true });
  }, [selectedRowIds, tabIndex]);
  reactExports.useEffect(() => {
    if (!isPendingTab) {
      setSelectedRowIds(/* @__PURE__ */ new Set());
      return;
    }
    if (!filteredRows.length) {
      setSelectedRowIds(/* @__PURE__ */ new Set());
      return;
    }
    setSelectedRowIds((currentIds) => {
      const nextIds = new Set(
        Array.from(currentIds || []).filter(
          (id) => filteredRows.some((row) => row.id === id)
        )
      );
      return nextIds.size > 0 ? nextIds : /* @__PURE__ */ new Set([filteredRows[0].id]);
    });
  }, [filteredRows, isPendingTab]);
  reactExports.useEffect(() => {
    var _a;
    const nextDecision = ((_a = selectedAuthorizations[0]) == null ? void 0 : _a.decision) || "";
    setDecisionValue(
      decisionOptions.some((o) => o.value === nextDecision) ? nextDecision : ""
    );
    setNotesValue("");
  }, [decisionOptions, selectedAuthorizations]);
  const summaryCards = reactExports.useMemo(
    () => [
      {
        label: intl.formatMessage({
          id: "label.authorization.pending",
          defaultMessage: "Pending"
        }),
        value: counts.pending,
        tone: "warning",
        icon: PendingOutlined
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.approved",
          defaultMessage: "Approved Today"
        }),
        value: counts.approved,
        tone: "success",
        icon: CheckCircleOutline
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.rejected",
          defaultMessage: "Rejected"
        }),
        value: counts.rejected,
        tone: "error",
        icon: AutorenewOutlinedIcon
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.Reverted",
          defaultMessage: "Reverted"
        }),
        value: counts.Reverted,
        tone: "info",
        icon: RestoreOutlined
      }
    ],
    [counts.approved, counts.Reverted, counts.pending, counts.rejected, intl]
  );
  const statusTabs = reactExports.useMemo(
    () => [
      {
        label: intl.formatMessage({
          id: "label.authorization.tab.pending",
          defaultMessage: "Pending"
        }),
        count: pendingRows.length,
        icon: ShieldOutlined
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.tab.history",
          defaultMessage: "History"
        }),
        count: historyTotalElements,
        icon: AccessTimeOutlined
      }
    ],
    [historyTotalElements, intl, pendingRows.length]
  );
  const handleSave = reactExports.useCallback(async () => {
    var _a, _b, _c, _d;
    if (!selectedAuthorizations.length) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.noRowSelected",
          defaultMessage: "Please select an authorization request."
        })
      );
      return { success: false };
    }
    const pendingSelected = selectedAuthorizations.filter(
      (row) => row.statusCategory === "pending"
    );
    if (!pendingSelected.length) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.saveOnlyPending",
          defaultMessage: "Only pending authorization requests can be saved."
        })
      );
      return { success: false };
    }
    const authStatus = getDecisionStatusCode(decisionValue);
    const remark = safeString(notesValue);
    if (!authStatus) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.decisionRequired",
          defaultMessage: "Please select an authorization decision."
        })
      );
      return { success: false };
    }
    if (!remark) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.notesRequired",
          defaultMessage: "Please enter authorization notes."
        })
      );
      return { success: false };
    }
    const payload = {
      lstAuthorizationDtos: pendingSelected.map((row) => {
        const baseRow = row.raw || {};
        const currentDone = Number(firstDefined(baseRow, ["inAuthDone"])) || 0;
        const requiredAuth = Number(firstDefined(baseRow, ["inNoOfAuthRequired"])) || 0;
        const nextDone = currentDone + 1;
        return {
          ...baseRow,
          lnAuthSeqNo: (baseRow == null ? void 0 : baseRow.lnAuthSeqNo) ?? null,
          lnAllocSeqNo: firstDefined(baseRow, ["lnAllocSeqNo"]) || allocationSeqNo || null,
          lnReqActivitySeqNo: firstDefined(baseRow, ["lnReqActivitySeqNo"]) || null,
          szPartitionCode: firstDefined(baseRow, ["szPartitionCode"]) || partitionCode || "001",
          szAuthorizationFor: firstDefined(baseRow, ["szAuthorizationFor"]) || "",
          szAuthorizationForDesc: firstDefined(baseRow, ["szAuthorizationForDesc"]) || row.authType,
          szRequestBy: firstDefined(baseRow, ["szRequestBy"]) || "",
          szRemark: firstDefined(baseRow, ["szRemark"]) || "",
          inAuthLevel: firstDefined(baseRow, ["inAuthLevel"]) || null,
          szAuthPendingWith: loggedInUser,
          inAuthDone: requiredAuth > 0 ? Math.min(nextDone, requiredAuth) : nextDone,
          inNoOfAuthRequired: requiredAuth || 1,
          lnAuthorizationPolicySeqNo: firstDefined(baseRow, ["lnAuthorizationPolicySeqNo"]) || null,
          szMultiAuthYn: firstDefined(baseRow, ["szMultiAuthYn"]) || "N",
          szProfileCodes: firstDefined(baseRow, ["szProfileCodes"]) || null,
          szProfilesAuthorized: firstDefined(baseRow, ["szProfilesAuthorized"]) || null,
          lnAnpExecLogSeqNo: firstDefined(baseRow, ["lnAnpExecLogSeqNo"]) || 0,
          szAnpStatus: firstDefined(baseRow, ["szAnpStatus"]) || "N",
          lnPrimaryAuthSeqNo: firstDefined(baseRow, ["lnPrimaryAuthSeqNo"]) || null,
          szRecommendYn: firstDefined(baseRow, ["szRecommendYn"]) || "N",
          inNoOfRecommendation: firstDefined(baseRow, ["inNoOfRecommendation"]) || 0,
          szMode: "E",
          szAuthStatus: authStatus,
          szDecisionRemark: remark,
          lnDecisionActivitySeqNo: firstDefined(baseRow, ["lnDecisionActivitySeqNo"]) || firstDefined(baseRow, ["lnReqActivitySeqNo"]) || null
        };
      })
    };
    try {
      const res = await Kr.PUT(
        AuthorizationAPI.Authorizations(screenMenuId),
        payload
      );
      const data = (res == null ? void 0 : res.data) ?? {};
      const success = typeof data.status === "string" ? data.status.toLowerCase() === "success" : (res == null ? void 0 : res.status) >= 200 && (res == null ? void 0 : res.status) < 300;
      if (success) {
        await loadAuthorizations();
        return { success: true };
      }
      data.responseJson ? handleValidationErrors(intl, toast, data.responseJson) : toast.error(
        data.message || intl.formatMessage({
          id: "label.authorization.saveFailed",
          defaultMessage: "Failed to update authorization."
        })
      );
      return { success: false };
    } catch (error) {
      const responseJson = (_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.responseJson;
      responseJson ? handleValidationErrors(intl, toast, responseJson) : toast.error(
        ((_d = (_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || intl.formatMessage({
          id: "label.authorization.saveFailed",
          defaultMessage: "Failed to update authorization."
        })
      );
      return { success: false };
    }
  }, [
    allocationSeqNo,
    decisionValue,
    intl,
    loadAuthorizations,
    loggedInUser,
    notesValue,
    partitionCode,
    selectedAuthorizations,
    toast
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.authorization.title",
        defaultMessage: "Authorization"
      }),
      contentPaddingTop: 0,
      scrollMode: "auto",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              p: { xs: 1.5, md: 2 },
              flexDirection: "column",
              gap: 1.5,
              minHeight: "100%"
            },
            children: [
              !selectedRow && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.authorization.noAccount",
                    defaultMessage: "Select an account to view authorization requests."
                  }),
                  translate: false,
                  align: "left",
                  colon: false,
                  sx: { fontSize: 12, color: text.secondary }
                }
              ),
              loadError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: loadError,
                  translate: false,
                  align: "left",
                  colon: false,
                  sx: { fontSize: 12, color: "error.main" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: {
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(4, minmax(0, 1fr))"
                    },
                    gap: 1,
                    margin: "0px"
                  },
                  children: summaryCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { card }, card.label))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    borderRadius: 0,
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Dt,
                      {
                        sx: {
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: 0.5,
                          py: 0.5,
                          width: "fit-content",
                          borderRadius: "8px",
                          flexWrap: "wrap",
                          marginTop: 1
                        },
                        children: statusTabs.map((tab, idx) => {
                          const active = idx === tabIndex;
                          const Icon = tab.icon;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Dt,
                            {
                              component: "button",
                              onClick: () => setTabIndex(idx),
                              sx: {
                                textTransform: "none",
                                height: 28,
                                px: 1.25,
                                border: "1px solid",
                                borderColor: active ? "primary.main" : "transparent",
                                borderRadius: 1.5,
                                boxShadow: active ? "0 1px 2px rgba(15,23,42,0.08)" : "none",
                                cursor: "pointer",
                                outline: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                transition: "all 0.15s ease"
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Icon,
                                  {
                                    sx: {
                                      fontSize: 14,
                                      color: active ? "primary.main" : text.secondary,
                                      mr: 0.5,
                                      flexShrink: 0
                                    }
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ps,
                                  {
                                    value: `${tab.label} (${tab.count})`,
                                    translate: false,
                                    align: "left",
                                    colon: false,
                                    sx: {
                                      fontSize: 11,
                                      color: active ? "primary.main" : text.secondary,
                                      fontWeight: active ? 700 : 600,
                                      lineHeight: 1
                                    }
                                  }
                                )
                              ]
                            },
                            tab.label
                          );
                        })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 0, pt: 0.5, pb: 0.25 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: currentTabLabel,
                        translate: false,
                        align: "left",
                        colon: false,
                        sx: { fontSize: 13, fontWeight: 700, color: text.primary }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Dt,
                      {
                        sx: { px: 0, pb: 0.5, "& > div": { marginTop: "0 !important" } },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          bu,
                          {
                            ref: gridRef,
                            rowData: isPendingTab ? filteredRows : historyRows,
                            columnDefs: authorizationColumnDefs,
                            gridStyle: {
                              width: "100%",
                              minWidth: "100%",
                              height: isPendingTab ? "min(420px, 46vh)" : "min(400px, 40vh)"
                            },
                            rowModelType: isPendingTab ? "clientSide" : "infinite",
                            datasource: isPendingTab ? void 0 : historyDatasource,
                            cacheBlockSize: isPendingTab ? void 0 : AUTH_HISTORY_PAGE_SIZE,
                            maxBlocksInCache: isPendingTab ? void 0 : 2,
                            pagination: true,
                            paginationPageSize: AUTH_HISTORY_PAGE_SIZE,
                            domLayout: "normal",
                            sort: true,
                            allowUpdate: false,
                            isLoading: loading && filteredRows.length === 0,
                            hideInternalSaveButton: true,
                            onRowClicked: handleGridRowClicked,
                            embeddedInSection: true,
                            overlayNoRowsTemplate: gridOverlayNoRowsTemplate
                          },
                          isPendingTab ? "authorization-pending" : `authorization-history-${allocationSeqNo || "none"}-${historyRefreshVersion}`
                        )
                      }
                    )
                  ]
                }
              ),
              isPendingTab && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Kg,
                {
                  variant: "outlined",
                  elevation: 0,
                  sx: {
                    borderRadius: 2,
                    borderColor: border.divider,
                    p: 2,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))"
                    },
                    gap: 2
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Dt,
                      {
                        sx: {
                          gridColumn: "1 / -1",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(WarningAmberOutlined, { sx: { fontSize: 18, color: "#f59e0b" } }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: intl.formatMessage({
                                id: "label.authorization.takeDecision",
                                defaultMessage: "Take Decision"
                              }),
                              translate: false,
                              align: "left",
                              colon: false,
                              sx: { fontSize: 14, fontWeight: 700, color: text.primary }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: `${selectedAuthorizations.length} selected`,
                              translate: false,
                              align: "left",
                              colon: false,
                              sx: {
                                fontSize: 10,
                                fontWeight: 600,
                                color: "primary.main",
                                px: 1,
                                py: 0.35,
                                borderRadius: 999
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Dt,
                      {
                        sx: {
                          flexDirection: "column",
                          gap: 0.75
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: intl.formatMessage({
                                id: "label.authorization.decision",
                                defaultMessage: "Authorization Decision"
                              }),
                              translate: false,
                              align: "left",
                              colon: false,
                              required: true,
                              sx: { fontSize: 12, fontWeight: 600 }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.75 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SE,
                            {
                              name: "authorizationDecision",
                              value: decisionValue,
                              onChange: (e) => setDecisionValue(e.target.value),
                              options: decisionOptions,
                              placeholder: intl.formatMessage({
                                id: "label.authorization.decision.placeholder",
                                defaultMessage: "Select decision"
                              }),
                              width: "100%",
                              fullwidth: true
                            }
                          ) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Dt,
                      {
                        sx: {
                          flexDirection: "column",
                          gap: 0.75
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: intl.formatMessage({
                                id: "label.authorization.notes",
                                defaultMessage: "Notes"
                              }),
                              translate: false,
                              align: "left",
                              colon: false,
                              required: true,
                              sx: { fontSize: 12, fontWeight: 600 }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 0.75 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            pp,
                            {
                              value: notesValue,
                              onChange: (e) => setNotesValue(e.target.value),
                              width: "100%",
                              rows: 2,
                              placeholder: intl.formatMessage({
                                id: "label.authorization.notes.placeholder",
                                defaultMessage: "Enter authorization notes..."
                              })
                            }
                          ) })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: loadAuthorizations,
            onClose: () => navigate("/homelayout/welcomepage")
          }
        )
      ]
    }
  );
}
export {
  Authorization as default
};
