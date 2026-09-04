import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import {
  AccessTimeOutlined,
  AutorenewOutlined,
  CheckCircleOutline,
  PendingOutlined,
  RestoreOutlined,
  ShieldOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HCheckBox, HBox, HButtonBar, HDropdown, HLabel, HPaper, HTextarea, useDrsTheme, HAgGrid, useToast } from "@helix/component-library";



import FunctionLayout from "./FunctionLayout.jsx";
import { AuthorizationAPI } from "./apiEndpoints.jsx";
import { handleValidationErrors } from "./ValidationUtils.jsx";
import { useLocation } from "react-router-dom";

const AUTH_HISTORY_PAGE_SIZE = 15;

function safeString(value) {
  return String(value ?? "").trim();
}

function firstDefined(item, keys) {
  for (const key of keys) {
    const value = item?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "")
      return value;
  }
  return "";
}

function firstMeaningfulText(item, keys) {
  const value = safeString(firstDefined(item, keys));
  if (!value || /^[A-Z0-9]$/.test(value)) return "";
  return value;
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
  const s = normalizeStatus(item?.szAuthStatus || "");
  const d = normalizeStatus(item?.approvalStatus || "");

  if (s === "auth" || s === "rej" || d === "auth" || d === "rej") {
    return "history";
  }

  return "pending";
}

function mapAuthorizationRow(item, index) {
  return {
    id:
      safeString(item?.lnHisAuthSeqNo) ||
      safeString(item?.lnAuthSeqNo) ||
      `row-${index}`,

    raw: item,

    statusCategory: getStatusCategory(item),

    authType: item?.szAuthorizationForDesc || "-",

    requestedOn: item?.dtRequestedOn || "-",

    requestedBy: item?.szRequestBy || "-",

    doneReq: `${item?.inAuthDone || 0}/${item?.inNoOfAuthRequired || 0}`,

    profileReq: item?.szProfileCodes || "-",

    details: item?.szSystemRemark || "-",

    requestFor: item?.szSystemRemark || "-",

    policyLabel: item?.szAuthorizationForDesc || "",

    decision: "",

    authTypeLabel: item?.szAuthTypeYn === "H" ? "Hierarchy Based" : "Single",

    authorizedBy: item?.szCreatedBy || "-",

    decisionDate: item?.dtCreatedOn || "-",

    statusBadge: item?.szAuthStatus || "",
  };
}

function extractPendingRows(responseJson) {
  if (!responseJson || typeof responseJson !== "object") return [];
  const pendingSourceRaw =
    responseJson.lstPending ?? responseJson.responseJson?.lstPending ?? responseJson;
  if (Array.isArray(pendingSourceRaw)) return pendingSourceRaw;
  if (Array.isArray(pendingSourceRaw?.content)) return pendingSourceRaw.content;
  return [];
}

function extractHistoryRows(responseJson) {
  if (!responseJson || typeof responseJson !== "object")
    return { history: [], historyTotal: 0 };
  const historySource =
    responseJson.lstHistory ?? responseJson.responseJson?.lstHistory ?? responseJson;
  const history = Array.isArray(historySource)
    ? historySource
    : Array.isArray(historySource?.content)
      ? historySource.content
      : [];
  const historyTotalRaw = Number(
    responseJson.totalHistoryElements ??
      responseJson.totalElements ??
      responseJson.responseJson?.totalHistoryElements ??
      responseJson.responseJson?.totalElements ??
      historySource?.totalElements ??
      history.length,
  );
  return {
    history,
    historyTotal: Number.isFinite(historyTotalRaw) ? historyTotalRaw : history.length,
  };
}

function StatCard({ card }) {
  const { colors, border, text } = useDrsTheme();
  const Icon = card.icon;
  const palette = {
    warning: colors?.warning || "#f59e0b",
    success: colors?.success || "#22c55e",
    error: colors?.error || "#ef4444",
    info: colors?.primary || "#2563eb",
  };
  const color = palette[card.tone] || "#64748b";

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        px: 1.25,
        py: 0.75,
        borderRadius: 2,
        borderColor: border.divider,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <HBox
        sx={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          color,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 15 }} />
      </HBox>
      <HLabel
        value={card.label}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 11, color: text.secondary, fontWeight: 500, flex: 1 }}
      />
      <HLabel
        value={String(card.value)}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 14, fontWeight: 700, color: text.primary }}
      />
    </HPaper>
  );
}

function RequestTypeChip({ value, active }) {
  return (
    <HBox
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: active ? "primary.main" : "divider",
        width: "fit-content",
      }}
    >
      <HLabel
        value={value}
        translate={true}
        align="left"
        colon={false}
        sx={{ fontSize: 11, fontWeight: 600 }}
      />
    </HBox>
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

  return (
    <HBox
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 24,
        px: 1,
        borderRadius: 999,
        border: "1px solid",
        borderColor: color || "divider",
        width: "fit-content",
      }}
    >
      <HLabel
        value={label}
        translate={false}
        align="left"
        colon={false}
        sx={{ fontSize: 11, fontWeight: 600, color: color || "text.primary" }}
      />
    </HBox>
  );
}

export default function Authorization() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const { selectedRow } = useSelector((state) => state.account);
  const { text, border } = useDrsTheme();
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const allocationSeqNo =
    selectedRow?.ALLOC_SEQNO ?? selectedRow?.allocSeqNo;
  const partitionCode =
    selectedRow?.PARTITION_CODE ??
    selectedRow?.szPartitionCode ??
    "001";

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [pendingRows, setPendingRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [historyTotalElements, setHistoryTotalElements] = useState(0);
  const [historyRefreshVersion, setHistoryRefreshVersion] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [decisionValue, setDecisionValue] = useState("");
  const [notesValue, setNotesValue] = useState("");

  const loggedInUser = useMemo(
    () =>
      sessionStorage.getItem("SEC_USERNAME") ||
      sessionStorage.getItem("LOGGED_IN_USER") ||
      "SYSTEM",
    [],
  );

  const decisionOptions = useMemo(
    () => [
      {
        value: "Approve",
        label: intl.formatMessage({
          id: "label.authorization.decision.approve",
          defaultMessage: "Approve",
        }),
      },
      {
        value: "Reject",
        label: intl.formatMessage({
          id: "label.authorization.decision.reject",
          defaultMessage: "Reject",
        }),
      },
    ],
    [intl],
  );

  const translateLabelValue = useCallback(
    (value) => {
      const label = safeString(value);
      if (!label) return "";
      if (/^label\./.test(label))
        return intl.formatMessage({ id: label, defaultMessage: label });
      return label;
    },
    [intl],
  );

  const loadAuthorizations = useCallback(async () => {
    if (!allocationSeqNo) {
      setPendingRows([]);
      setHistoryRows([]);
      setHistoryTotalElements(0);
      setSelectedRowIds(new Set());
      setLoadError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const res = await HAxiosService.GET(
        `${AuthorizationAPI.Authorizations(screenMenuId)}/findPendingAuthorizationByAllocSeqNo`,
        {
          params: {
            lnAllocSeqNo: allocationSeqNo,
            szPartitionCode: partitionCode || "001",
          },
        },
      );
      const data = res.data ?? {};
      const success =
        typeof data.status === "string"
          ? data.status.toLowerCase() === "success"
          : res.status >= 200 && res.status < 300;
      const pending = extractPendingRows(data.responseJson);
      const mappedPending = pending.map((item, i) => ({
        ...mapAuthorizationRow(item, i),
        statusCategory: "pending",
      }));
      const rows = [...mappedPending];

      if (success) {
        const translateRows = (rows) =>
          rows.map((row) => ({
            ...row,
            authType: translateLabelValue(row.authType),
            policyLabel: translateLabelValue(row.policyLabel),
            details: translateLabelValue(row.details),
            requestFor: translateLabelValue(row.requestFor),
          }));
        setPendingRows(translateRows(mappedPending));
        setHistoryRows([]);
        try {
          const historyMetaRes = await HAxiosService.GET(
            `${AuthorizationAPI.Authorizations(screenMenuId)}/findAuthorizationHistoryByAllocSeqNo`,
            {
              params: {
                lnAllocSeqNo: allocationSeqNo,
                szPartitionCode: partitionCode || "001",
                pageNumber: 1,
                size: 1,
                pageSize: 1,
              },
            },
          );
          const historyMetaData = historyMetaRes?.data ?? {};
          const historyMetaSuccess =
            typeof historyMetaData.status === "string"
              ? historyMetaData.status.toLowerCase() === "success"
              : historyMetaRes?.status >= 200 && historyMetaRes?.status < 300;
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
            Array.from(currentIds || []).filter((id) =>
              rows.some((r) => r.id === id),
            ),
          );
          return nextIds.size > 0
            ? nextIds
            : rows[0]
              ? new Set([rows[0].id])
              : new Set();
        });
      } else {
        setPendingRows([]);
        setHistoryRows([]);
        setHistoryTotalElements(0);
        setSelectedRowIds(new Set());
        setLoadError(
          safeString(data.message || data.msg) ||
            intl.formatMessage({
              id: "label.authorization.loadFailed",
              defaultMessage: "Failed to load authorizations.",
            }),
        );
      }
    } catch (error) {
      setPendingRows([]);
      setHistoryRows([]);
      setHistoryTotalElements(0);
      setSelectedRowIds(new Set());
      const msg =
        error?.response?.data?.message ||
        intl.formatMessage({
          id: "label.authorization.loadFailed",
          defaultMessage: "Failed to load authorizations.",
        });
      setLoadError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [allocationSeqNo, partitionCode, intl, toast]);

  useEffect(() => {
    loadAuthorizations();
  }, [loadAuthorizations]);

  const historyDatasource = useMemo(() => {
    if (!allocationSeqNo) return null;

    return {
      getRows: async (params) => {
        const startRow = Number(params?.startRow) || 0;
        const endRow = Number(params?.endRow) || AUTH_HISTORY_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;

        try {
          const res = await HAxiosService.GET(
            `${AuthorizationAPI.Authorizations(screenMenuId)}/findAuthorizationHistoryByAllocSeqNo`,
            {
              params: {
                lnAllocSeqNo: allocationSeqNo,
                szPartitionCode: partitionCode || "001",
                pageNumber,
                size,
                pageSize: size,
              },
            },
          );

          const data = res?.data ?? {};
          const success =
            typeof data.status === "string"
              ? data.status.toLowerCase() === "success"
              : res?.status >= 200 && res?.status < 300;

          if (!success) {
            params.failCallback?.();
            return;
          }

          const { history, historyTotal } = extractHistoryRows(data.responseJson);
          const mappedHistory = history.map((item, i) => ({
            ...mapAuthorizationRow(item, startRow + i),
            statusCategory: "history",
          }));
          const translatedHistory = mappedHistory.map((row) => ({
            ...row,
            authType: translateLabelValue(row.authType),
            policyLabel: translateLabelValue(row.policyLabel),
            details: translateLabelValue(row.details),
            requestFor: translateLabelValue(row.requestFor),
          }));

          setHistoryTotalElements(historyTotal);
          params.successCallback?.(translatedHistory, historyTotal);
        } catch (error) {
          const msg =
            error?.response?.data?.message ||
            intl.formatMessage({
              id: "label.authorization.loadFailed",
              defaultMessage: "Failed to load authorizations.",
            });
          setLoadError(msg);
          toast.error(msg);
          params.failCallback?.();
        }
      },
    };
  }, [allocationSeqNo, partitionCode, translateLabelValue, intl, toast, historyRefreshVersion]);

  const counts = useMemo(() => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const summary = {
      pending: pendingRows.length,
      approved: 0,
      rejected: 0,
      Reverted: 0,
    };
    const seen = new Set();

    historyRows.forEach((row) => {
      if (!row?.id || seen.has(row.id)) return;
      seen.add(row.id);
      const authStatus = normalizeStatus(
        row.raw?.szAuthStatus || row.statusBadge || "",
      );
      const revertFlag = normalizeFlag(
        row.raw?.szRevertYn || row.raw?.cRevertYn || "",
      );

      if (
        revertFlag === "y" ||
        authStatus === "canc" ||
        authStatus.includes("cancel")
      ) {
        summary.Reverted += 1;
        return;
      }
      if (authStatus === "rej" || authStatus.includes("reject")) {
        summary.rejected += 1;
        return;
      }
      if (authStatus === "auth" || authStatus.includes("appr")) {
        const decisionDateStr = toComparableDate(
          row.raw?.dtCreatedOn ??
            row.raw?.dtDecisionOn ??
            row.raw?.dtAuthorizedOn ??
            row.raw?.dtApprovedOn ??
            "",
        );
        if (decisionDateStr === todayStr) summary.approved += 1;
      }
    });
    return summary;
  }, [historyRows, pendingRows.length]);

  const isPendingTab = tabIndex === 0;
  const filteredRows = useMemo(
    () => (isPendingTab ? pendingRows : historyRows),
    [historyRows, pendingRows, tabIndex],
  );

  const currentTabLabel = isPendingTab
    ? "Authorization Requests"
    : "Authorization History";

  const gridOverlayNoRowsTemplate = useMemo(() => {
    const message = isPendingTab
      ? intl.formatMessage({
          id: "label.authorization.table.emptyPending",
          defaultMessage: "No pending authorization requests found.",
        })
      : intl.formatMessage({
          id: "label.authorization.table.emptyHistory",
          defaultMessage: "No authorization history found.",
        });
    return `<span style="display:block;padding:16px;color:${text.secondary};font-size:12px;">${message}</span>`;
  }, [intl, isPendingTab, text.secondary]);

  const toggleSelectedRow = useCallback(
    (rowId) => {
      if (!isPendingTab) return;
      setSelectedRowIds((currentIds) => {
        const nextIds = new Set(currentIds || []);
        nextIds.has(rowId) ? nextIds.delete(rowId) : nextIds.add(rowId);
        return nextIds;
      });
    },
    [isPendingTab],
  );

  const selectedAuthorizations = useMemo(
    () => filteredRows.filter((row) => selectedRowIds.has(row.id)),
    [filteredRows, selectedRowIds],
  );

  const handleGridRowClicked = useCallback(
    (params) => {
      if (!isPendingTab || !params?.data?.id) return;
      if (params.event?.target?.closest('[data-authorization-checkbox="true"]'))
        return;
      toggleSelectedRow(params.data.id);
    },
    [isPendingTab, toggleSelectedRow],
  );

  const authorizationColumnDefs = useMemo(() => {
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
          justifyContent: "center",
        }),
        cellRenderer: (params) => {
          const active = Boolean(
            params?.data?.id && selectedRowIds.has(params.data.id),
          );
          return (
            <HBox
              data-authorization-checkbox="true"
              component="button"
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                toggleSelectedRow(params.data.id);
              }}
              sx={{
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
                  outlineOffset: 1,
                },
              }}
            >
              <HCheckBox checked={active} onChange={() => {}} label="" />
            </HBox>
          );
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.type",
          defaultMessage: "Auth Type",
        }),
        field: "authType",
        flex: 1.1,
        minWidth: 140,
        editable: false,
        filter: false,
        cellRenderer: (params) => (
          <RequestTypeChip
            value={params?.value || "-"}
            active={Boolean(
              params?.data?.id && selectedRowIds.has(params.data.id),
            )}
          />
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requested",
          defaultMessage: "Requested On",
        }),
        field: "requestedOn",
        width: 120,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.by",
          defaultMessage: "Requested By",
        }),
        field: "requestedBy",
        width: 130,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.doneReq",
          defaultMessage: "Done/Required",
        }),
        field: "doneReq",
        width: 100,
        editable: false,
        filter: false,
        cellStyle: { fontWeight: 600 },
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.profileReq",
          defaultMessage: "Profile Required",
        }),
        field: "profileReq",
        flex: 0.95,
        minWidth: 150,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.details",
          defaultMessage: "Details",
        }),
        field: "details",
        flex: 1.6,
        minWidth: 260,
        editable: false,
        filter: false,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        cellRenderer: (params) => (
          <HBox
            sx={{
              background: "transparent",
              alignItems: "center",
              width: "100%",
            }}
          >
            <HLabel
              value={safeString(params?.data?.details) || "-"}
              translate={false}
              align="left"
              colon={false}
              sx={{
                fontSize: 11,
                color: text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </HBox>
        ),
        tooltipValueGetter: (params) =>
          safeString(params?.data?.details) || "-",
      },
    ];

    const historyColumns = [
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.date",
          defaultMessage: "Date",
        }),
        field: "requestedOn",
        width: 120,
        editable: false,
        filter: false,
        type: "date",
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requestedBy",
          defaultMessage: "Requested By",
        }),
        field: "requestedBy",
        width: 130,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.requestFor",
          defaultMessage: "Request For",
        }),
        field: "requestFor",
        flex: 1.6,
        minWidth: 220,
        editable: false,
        filter: false,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        },
        cellRenderer: (params) => (
          <HBox
            sx={{
              background: "transparent",
              alignItems: "center",
              width: "100%",
            }}
          >
            <HLabel
              value={safeString(params?.data?.requestFor) || "-"}
              translate={false}
              align="left"
              colon={false}
              sx={{
                fontSize: 11,
                color: text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </HBox>
        ),
        tooltipValueGetter: (params) =>
          safeString(params?.data?.requestFor) || "-",
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.status",
          defaultMessage: "Status",
        }),
        field: "statusBadge",
        width: 130,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => (
          <StatusBadge rawStatus={params?.data?.statusBadge} />
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.authorizedBy",
          defaultMessage: "Authorized By",
        }),
        field: "authorizedBy",
        width: 140,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.decisionDate",
          defaultMessage: "Decision Date",
        }),
        field: "decisionDate",
        width: 130,
        editable: false,
        filter: false,
        type: "date",
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.authTypeLabel",
          defaultMessage: "Auth Type",
        }),
        field: "authTypeLabel",
        width: 145,
        editable: false,
        filter: false,
        cellStyle: { display: "flex", alignItems: "center" },
        cellRenderer: (params) => (
          <HBox
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <HLabel
              value={safeString(params?.value) || "-"}
              translate={false}
              align="left"
              colon={false}
              sx={{ fontSize: 11, fontWeight: 500 }}
            />
          </HBox>
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.authorization.table.doneReq",
          defaultMessage: "Done/Req",
        }),
        field: "doneReq",
        width: 100,
        editable: false,
        filter: false,
        cellStyle: { fontWeight: 600 },
      },
    ];

    return isPendingTab ? pendingColumns : historyColumns;
  }, [intl, isPendingTab, selectedRowIds, text.primary, toggleSelectedRow]);

  useEffect(() => {
    gridRef.current?.api?.refreshCells({ force: true });
  }, [selectedRowIds, tabIndex]);

  useEffect(() => {
    if (!isPendingTab) {
      setSelectedRowIds(new Set());
      return;
    }
    if (!filteredRows.length) {
      setSelectedRowIds(new Set());
      return;
    }
    setSelectedRowIds((currentIds) => {
      const nextIds = new Set(
        Array.from(currentIds || []).filter((id) =>
          filteredRows.some((row) => row.id === id),
        ),
      );
      return nextIds.size > 0 ? nextIds : new Set([filteredRows[0].id]);
    });
  }, [filteredRows, isPendingTab]);

  useEffect(() => {
    const nextDecision = selectedAuthorizations[0]?.decision || "";
    setDecisionValue(
      decisionOptions.some((o) => o.value === nextDecision) ? nextDecision : "",
    );
    setNotesValue("");
  }, [decisionOptions, selectedAuthorizations]);

  const summaryCards = useMemo(
    () => [
      {
        label: intl.formatMessage({
          id: "label.authorization.pending",
          defaultMessage: "Pending",
        }),
        value: counts.pending,
        tone: "warning",
        icon: PendingOutlined,
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.approved",
          defaultMessage: "Approved Today",
        }),
        value: counts.approved,
        tone: "success",
        icon: CheckCircleOutline,
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.rejected",
          defaultMessage: "Rejected",
        }),
        value: counts.rejected,
        tone: "error",
        icon: AutorenewOutlined,
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.Reverted",
          defaultMessage: "Reverted",
        }),
        value: counts.Reverted,
        tone: "info",
        icon: RestoreOutlined,
      },
    ],
    [counts.approved, counts.Reverted, counts.pending, counts.rejected, intl],
  );

  const statusTabs = useMemo(
    () => [
      {
        label: intl.formatMessage({
          id: "label.authorization.tab.pending",
          defaultMessage: "Pending",
        }),
        count: pendingRows.length,
        icon: ShieldOutlined,
      },
      {
        label: intl.formatMessage({
          id: "label.authorization.tab.history",
          defaultMessage: "History",
        }),
        count: historyTotalElements,
        icon: AccessTimeOutlined,
      },
    ],
    [historyTotalElements, intl, pendingRows.length],
  );

  const handleSave = useCallback(async () => {
    if (!selectedAuthorizations.length) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.noRowSelected",
          defaultMessage: "Please select an authorization request.",
        }),
      );
      return { success: false };
    }
    const pendingSelected = selectedAuthorizations.filter(
      (row) => row.statusCategory === "pending",
    );
    if (!pendingSelected.length) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.saveOnlyPending",
          defaultMessage: "Only pending authorization requests can be saved.",
        }),
      );
      return { success: false };
    }
    const authStatus = getDecisionStatusCode(decisionValue);
    const remark = safeString(notesValue);
    if (!authStatus) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.decisionRequired",
          defaultMessage: "Please select an authorization decision.",
        }),
      );
      return { success: false };
    }
    if (!remark) {
      toast.error(
        intl.formatMessage({
          id: "label.authorization.notesRequired",
          defaultMessage: "Please enter authorization notes.",
        }),
      );
      return { success: false };
    }

    const payload = {
      lstAuthorizationDtos: pendingSelected.map((row) => {
        const baseRow = row.raw || {};
        const currentDone = Number(firstDefined(baseRow, ["inAuthDone"])) || 0;
        const requiredAuth =
          Number(firstDefined(baseRow, ["inNoOfAuthRequired"])) || 0;
        const nextDone = currentDone + 1;
        return {
          ...baseRow,
          lnAuthSeqNo: baseRow?.lnAuthSeqNo ?? null,
          lnAllocSeqNo:
            firstDefined(baseRow, ["lnAllocSeqNo"]) || allocationSeqNo || null,
          lnReqActivitySeqNo:
            firstDefined(baseRow, ["lnReqActivitySeqNo"]) || null,
          szPartitionCode:
            firstDefined(baseRow, ["szPartitionCode"]) ||
            partitionCode ||
            "001",
          szAuthorizationFor:
            firstDefined(baseRow, ["szAuthorizationFor"]) || "",
          szAuthorizationForDesc:
            firstDefined(baseRow, ["szAuthorizationForDesc"]) || row.authType,
          szRequestBy: firstDefined(baseRow, ["szRequestBy"]) || "",
          szRemark: firstDefined(baseRow, ["szRemark"]) || "",
          inAuthLevel: firstDefined(baseRow, ["inAuthLevel"]) || null,
          szAuthPendingWith: loggedInUser,
          inAuthDone:
            requiredAuth > 0 ? Math.min(nextDone, requiredAuth) : nextDone,
          inNoOfAuthRequired: requiredAuth || 1,
          lnAuthorizationPolicySeqNo:
            firstDefined(baseRow, ["lnAuthorizationPolicySeqNo"]) || null,
          szMultiAuthYn: firstDefined(baseRow, ["szMultiAuthYn"]) || "N",
          szProfileCodes: firstDefined(baseRow, ["szProfileCodes"]) || null,
          szProfilesAuthorized:
            firstDefined(baseRow, ["szProfilesAuthorized"]) || null,
          lnAnpExecLogSeqNo: firstDefined(baseRow, ["lnAnpExecLogSeqNo"]) || 0,
          szAnpStatus: firstDefined(baseRow, ["szAnpStatus"]) || "N",
          lnPrimaryAuthSeqNo:
            firstDefined(baseRow, ["lnPrimaryAuthSeqNo"]) || null,
          szRecommendYn: firstDefined(baseRow, ["szRecommendYn"]) || "N",
          inNoOfRecommendation:
            firstDefined(baseRow, ["inNoOfRecommendation"]) || 0,
          szMode: "E",
          szAuthStatus: authStatus,
          szDecisionRemark: remark,
          lnDecisionActivitySeqNo:
            firstDefined(baseRow, ["lnDecisionActivitySeqNo"]) ||
            firstDefined(baseRow, ["lnReqActivitySeqNo"]) ||
            null,
        };
      }),
    };

    try {
      const res = await HAxiosService.PUT(
        AuthorizationAPI.Authorizations(screenMenuId),
        payload,
      );
      const data = res?.data ?? {};
      const success =
        typeof data.status === "string"
          ? data.status.toLowerCase() === "success"
          : res?.status >= 200 && res?.status < 300;
      if (success) {
        await loadAuthorizations();
        return { success: true };
      }
      data.responseJson
        ? handleValidationErrors(intl, toast, data.responseJson)
        : toast.error(
            data.message ||
              intl.formatMessage({
                id: "label.authorization.saveFailed",
                defaultMessage: "Failed to update authorization.",
              }),
          );
      return { success: false };
    } catch (error) {
      const responseJson = error?.response?.data?.responseJson;
      responseJson
        ? handleValidationErrors(intl, toast, responseJson)
        : toast.error(
            error?.response?.data?.message ||
              intl.formatMessage({
                id: "label.authorization.saveFailed",
                defaultMessage: "Failed to update authorization.",
              }),
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
    toast,
  ]);

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.authorization.title",
        defaultMessage: "Authorization",
      })}
      contentPaddingTop={0}
      scrollMode="auto"
    >
      <HBox
        sx={{
          p: { xs: 1.5, md: 2 },
          flexDirection: "column",
          gap: 1.5,
          minHeight: "100%",
        }}
      >
        {!selectedRow && (
          <HLabel
            value={intl.formatMessage({
              id: "label.authorization.noAccount",
              defaultMessage:
                "Select an account to view authorization requests.",
            })}
            translate={false}
            align="left"
            colon={false}
            sx={{ fontSize: 12, color: text.secondary }}
          />
        )}
        {loadError && (
          <HLabel
            value={loadError}
            translate={false}
            align="left"
            colon={false}
            sx={{ fontSize: 12, color: "error.main" }}
          />
        )}

        <HBox
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1,
            margin: "0px",
          }}
        >
          {summaryCards.map((card) => (
            <StatCard key={card.label} card={card} />
          ))}
        </HBox>

        <HBox
          sx={{
            borderRadius: 0,
            overflow: "hidden",
          }}
        >
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 0.5,
              py: 0.5,
              width: "fit-content",
              borderRadius: "8px",
              flexWrap: "wrap",
              marginTop: 1,
            }}
          >
            {statusTabs.map((tab, idx) => {
              const active = idx === tabIndex;
              const Icon = tab.icon;
              return (
                <HBox
                  key={tab.label}
                  component="button"
                  onClick={() => setTabIndex(idx)}
                  sx={{
                    textTransform: "none",
                    height: 28,
                    px: 1.25,
                    border: "1px solid",
                    borderColor: active ? "primary.main" : "transparent",
                    borderRadius: 1.5,
                    boxShadow: active
                      ? "0 1px 2px rgba(15,23,42,0.08)"
                      : "none",
                    cursor: "pointer",
                    outline: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 14,
                      color: active ? "primary.main" : text.secondary,
                      mr: 0.5,
                      flexShrink: 0,
                    }}
                  />
                  <HLabel
                    value={`${tab.label} (${tab.count})`}
                    translate={false}
                    align="left"
                    colon={false}
                    sx={{
                      fontSize: 11,
                      color: active ? "primary.main" : text.secondary,
                      fontWeight: active ? 700 : 600,
                      lineHeight: 1,
                    }}
                  />
                </HBox>
              );
            })}
          </HBox>

          <HBox sx={{ px: 0, pt: 0.5, pb: 0.25 }}>
            <HLabel
              value={currentTabLabel}
              translate={false}
              align="left"
              colon={false}
              sx={{ fontSize: 13, fontWeight: 700, color: text.primary }}
            />
          </HBox>

          <HBox
            sx={{ px: 0, pb: 0.5, "& > div": { marginTop: "0 !important" } }}
          >
            <HAgGrid
              key={isPendingTab ? "authorization-pending" : `authorization-history-${allocationSeqNo || "none"}-${historyRefreshVersion}`}
              ref={gridRef}
              rowData={isPendingTab ? filteredRows : historyRows}
              columnDefs={authorizationColumnDefs}
              gridStyle={{
                width: "100%",
                minWidth: "100%",
                height: isPendingTab ? "min(420px, 46vh)" : "min(400px, 40vh)",
              }}
              rowModelType={isPendingTab ? "clientSide" : "infinite"}
              datasource={isPendingTab ? undefined : historyDatasource}
              cacheBlockSize={isPendingTab ? undefined : AUTH_HISTORY_PAGE_SIZE}
              maxBlocksInCache={isPendingTab ? undefined : 2}
              pagination={true}
              paginationPageSize={AUTH_HISTORY_PAGE_SIZE}
              domLayout="normal"
              sort={true}
              allowUpdate={false}
              isLoading={loading && filteredRows.length === 0}
              hideInternalSaveButton
              onRowClicked={handleGridRowClicked}
              embeddedInSection
              overlayNoRowsTemplate={gridOverlayNoRowsTemplate}
            />
          </HBox>
        </HBox>

        {isPendingTab && (
          <HPaper
            variant="outlined"
            elevation={0}
            sx={{
              borderRadius: 2,
              borderColor: border.divider,
              p: 2,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <HBox
              sx={{
                gridColumn: "1 / -1",
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <WarningAmberOutlined sx={{ fontSize: 18, color: "#f59e0b" }} />
              <HLabel
                value={intl.formatMessage({
                  id: "label.authorization.takeDecision",
                  defaultMessage: "Take Decision",
                })}
                translate={false}
                align="left"
                colon={false}
                sx={{ fontSize: 14, fontWeight: 700, color: text.primary }}
              />
              <HLabel
                value={`${selectedAuthorizations.length} selected`}
                translate={false}
                align="left"
                colon={false}
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "primary.main",
                  px: 1,
                  py: 0.35,
                  borderRadius: 999,
                }}
              />
            </HBox>

            <HBox
              sx={{
                flexDirection: "column",
                gap: 0.75,
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.authorization.decision",
                  defaultMessage: "Authorization Decision",
                })}
                translate={false}
                align="left"
                colon={false}
                required
                sx={{ fontSize: 12, fontWeight: 600 }}
              />
              <HBox sx={{ mt: 0.75 }}>
                <HDropdown
                  name="authorizationDecision"
                  value={decisionValue}
                  onChange={(e) => setDecisionValue(e.target.value)}
                  options={decisionOptions}
                  placeholder={intl.formatMessage({
                    id: "label.authorization.decision.placeholder",
                    defaultMessage: "Select decision",
                  })}
                  width="100%"
                  fullwidth
                />
              </HBox>
            </HBox>

            <HBox
              sx={{
                flexDirection: "column",
                gap: 0.75,
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.authorization.notes",
                  defaultMessage: "Notes",
                })}
                translate={false}
                align="left"
                colon={false}
                required
                sx={{ fontSize: 12, fontWeight: 600 }}
              />
              <HBox sx={{ mt: 0.75 }}>
                <HTextarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  width="100%"
                  rows={2}
                  placeholder={intl.formatMessage({
                    id: "label.authorization.notes.placeholder",
                    defaultMessage: "Enter authorization notes...",
                  })}
                />
              </HBox>
            </HBox>
          </HPaper>
        )}
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={loadAuthorizations}
        onClose={() => navigate("/homelayout/welcomepage")}
      />
    </FunctionLayout>
  );
}
