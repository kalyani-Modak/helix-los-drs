import { em as useTheme, ed as useIntl, dL as qg, cr as alpha, dN as reactExports, dB as jsxRuntimeExports, M as Chip, ac as Dt, dK as ps, cy as bu, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, aX as Kr, aj as FeeDetailsAPI, i as Alert, aW as Kg, c6 as Tabs, b_ as Tab, bV as Stack, b0 as Lg, ck as VisibilityIcon, aM as Grid, cJ as dc, dg as gridFeeCodeDefObj, bI as SEARCH_API_ENDPOINTS, cs as ap, dc as gridChargeReasonDefObj, dI as pp, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
function mapFeeHistoryRow(item, locale) {
  const d = (v) => v ? new Date(v).toLocaleString(locale) : "";
  return {
    RequestDate: d(item.dtCreatedOn),
    RequestFor: item.chRequestFor === "C" ? "CHARGE" : "WAIVE",
    Fee: item.szFeeCode ?? "",
    Amount: item.bdAmount ?? 0,
    RequestBy: item.szCreatedBy ?? "",
    Status: item.szAuthStatus ?? "",
    DecisionBy: item.szModifiedBy ?? "",
    DecisionOn: d(item.dtModifiedOn),
    Downloaded: item.chDownloaded ?? "",
    Acknowledged: item.chAcknowledged ?? ""
  };
}
function mapWaiveRow(item) {
  return {
    PaymentHead: item.szFeeCode || "",
    Paid: item.bdPaidAmount || 0,
    Waived: item.bdWaivedAmount || 0,
    Overdue: item.bdDueAmount || 0,
    NotYetDue: item.bdNydAmount || 0,
    PendingRequests: item.chWaiveable || 0,
    WaiveNow: "",
    Reason: item.szReasonCode || ""
  };
}
function buildChargeReasonCode(chargeReason, remarks, maxLen = 240) {
  const r = String(chargeReason || "").trim();
  const m = String(remarks || "").trim();
  if (!m) return r;
  const combined = `${r} | ${m}`;
  return combined.length > maxLen ? combined.slice(0, maxLen) : combined;
}
function buildWaiveColumnDefs(theme, intl) {
  const right = { textAlign: "right", fontVariantNumeric: "tabular-nums" };
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;
  return [
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Payment Head" }),
      field: "PaymentHead",
      flex: 1,
      editable: false,
      minWidth: 120
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Paid" }),
      field: "Paid",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: theme.palette.text.primary })
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Waived" }),
      field: "Waived",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: success, fontWeight: 600 })
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Overdue" }),
      field: "Overdue",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: error, fontWeight: 600 })
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Not Yet Due" }),
      field: "NotYetDue",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: theme.palette.text.primary })
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Pending Requests" }),
      field: "PendingRequests",
      flex: 1,
      editable: false,
      cellStyle: () => ({ ...right, color: warning, fontWeight: 600 })
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Waive Now" }),
      field: "WaiveNow",
      flex: 1,
      editable: true,
      cellStyle: () => right
    },
    {
      headerName: intl.formatMessage({ id: "label.FeeDetails.Reason" }),
      field: "Reason",
      flex: 1,
      editable: true
    }
  ];
}
function statusChipSx(theme, code) {
  const c = String(code || "").toUpperCase();
  if (c === "APP" || c === "SELF") {
    return {
      bgcolor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.success.light : theme.palette.success.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600
    };
  }
  if (c === "PEND" || c === "NOTR") {
    return {
      bgcolor: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600
    };
  }
  if (c === "REJE") {
    return {
      bgcolor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600
    };
  }
  return {
    bgcolor: alpha(theme.palette.action.hover, 0.12),
    color: theme.palette.text.secondary,
    border: "none",
    fontSize: 10,
    height: 22,
    fontWeight: 600
  };
}
function statusLabel(intl, code) {
  const c = String(code || "").toUpperCase();
  const id = c === "APP" ? "label.FeeDetails.status.APP" : c === "PEND" ? "label.FeeDetails.status.PEND" : c === "REJE" ? "label.FeeDetails.status.REJE" : c === "SELF" ? "label.FeeDetails.status.SELF" : c === "NOTR" ? "label.FeeDetails.status.NOTR" : null;
  if (id) return intl.formatMessage({ id, defaultMessage: code || "—" });
  return code || "—";
}
function FeeRequestHistoryTable({ rows = [], loading = false }) {
  const theme = useTheme();
  const intl = useIntl();
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const currencyPrefix = qg(locale);
  const formatAmount = (n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return `${currencyPrefix}0`;
    return `${currencyPrefix}${v.toLocaleString(locale)}`;
  };
  const dash = "—";
  const cardBorder = alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 0.9);
  const gridStyle = reactExports.useMemo(
    () => ({
      width: "100%",
      height: rows.length > 8 ? "360px" : "320px"
    }),
    [rows.length]
  );
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.history.date", defaultMessage: "RequestDate" }),
        field: "RequestDate",
        flex: 1.15,
        type: "datetime",
        // minWidth: 140,
        filter: false,
        sortable: false,
        cellStyle: { fontSize: 12 }
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Request For", defaultMessage: "RequestFor" }),
        field: "RequestFor",
        flex: 0.95,
        // minWidth: 120,
        filter: false,
        sortable: false,
        cellRenderer: (params) => {
          const isCharge = params.value === "CHARGE" || params.value === "C";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              label: isCharge ? intl.formatMessage({ id: "label.FeeDetails.badge.charge" }) : intl.formatMessage({ id: "label.FeeDetails.badge.waive" }),
              size: "small",
              variant: "outlined",
              sx: {
                height: 22,
                fontSize: 10,
                fontWeight: 600,
                borderColor: alpha(isCharge ? theme.palette.error.main : theme.palette.success.main, 0.35),
                color: isCharge ? theme.palette.error.main : theme.palette.success.main,
                bgcolor: "transparent"
              }
            }
          );
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Fee", defaultMessage: "Fee" }),
        field: "Fee",
        flex: 1,
        // minWidth: 110,
        filter: false,
        sortable: false,
        valueFormatter: (params) => params.value || dash,
        cellStyle: { fontSize: 12 }
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Amount", defaultMessage: "Amount" }),
        field: "Amount",
        // flex: 0.9,
        // minWidth: 110,
        filter: false,
        sortable: false,
        cellStyle: { textAlign: "right", fontWeight: 600 },
        headerClass: "ag-right-aligned-header",
        valueFormatter: (params) => formatAmount(params.value)
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.history.by", defaultMessage: "RequestBy" }),
        field: "RequestBy",
        flex: 1,
        // minWidth: 120,
        filter: false,
        sortable: false,
        valueFormatter: (params) => params.value || dash,
        cellStyle: {
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 12
        }
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Status", defaultMessage: "Status" }),
        field: "Status",
        flex: 0.95,
        // minWidth: 120,
        filter: false,
        sortable: false,
        cellStyle: { fontSize: 12 },
        cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { label: statusLabel(intl, params.value), size: "small", sx: statusChipSx(theme, params.value) })
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Decision By", defaultMessage: "DecisionBy" }),
        field: "DecisionBy",
        flex: 1,
        // minWidth: 120,
        filter: false,
        sortable: false,
        valueFormatter: (params) => {
          var _a;
          return ((_a = params.value) == null ? void 0 : _a.trim()) || dash;
        },
        cellStyle: { fontSize: 12 }
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Decision On", defaultMessage: "DecisionOn" }),
        field: "DecisionOn",
        flex: 1.1,
        type: "date",
        // minWidth: 140,
        filter: false,
        sortable: false,
        cellStyle: { fontSize: 12 }
      }
    ],
    [currencyPrefix, dash, intl, locale, theme]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: cardBorder,
        boxShadow: "none"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { pb: 1, pt: 1.5, px: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({ id: "label.FeeDetails.RequestHistory" }),
            translate: false,
            align: "left",
            colon: false,
            sx: { fontSize: 12, fontWeight: 600, color: "text.primary" }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            rowData: rows,
            columnDefs,
            gridStyle,
            pagination: rows.length > 8,
            paginationPageSize: 8,
            sort: false,
            allowUpdate: false,
            allowAdd: false,
            allowDelete: false,
            hideInternalSaveButton: true,
            showTitle: false,
            embeddedInSection: true,
            isLoading: loading
          }
        ) })
      ]
    }
  );
}
const fieldContainerStyles = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  rowGap: "4px"
};
function delightCardSx(theme) {
  return {
    borderRadius: 2,
    overflow: "hidden",
    // bgcolor: "background.paper",
    border: "1px solid",
    borderColor: alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 0.9),
    boxShadow: "none",
    marginTop: 2
  };
}
const initialCharge = {
  amount: "",
  feeCode: "",
  chargeReason: "",
  remarks: ""
};
const FeeDetails = () => {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const waiveGridRef = reactExports.useRef();
  const { selectedRow } = useSelector((state) => state.account);
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [feeTab, setFeeTab] = reactExports.useState("charge");
  const accountSeqNo = (selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.acnt_seqno);
  const partitionCode = (selectedRow == null ? void 0 : selectedRow.PARTITION_CODE) ?? (selectedRow == null ? void 0 : selectedRow.szPartitionCode) ?? "001";
  const userCode = (selectedRow == null ? void 0 : selectedRow.USER_CODE) ?? sessionStorage.getItem("SEC_USERNAME") ?? "SYSTEM";
  const [chargeDetails, setChargeDetails] = reactExports.useState(initialCharge);
  const [waiveDetails, setWaiveDetails] = reactExports.useState([]);
  const [feeHistory, setFeeHistory] = reactExports.useState([]);
  const [loadingInitial, setLoadingInitial] = reactExports.useState(true);
  const [savingCharge, setSavingCharge] = reactExports.useState(false);
  const [savingWaive, setSavingWaive] = reactExports.useState(false);
  const waiveColumns = reactExports.useMemo(() => buildWaiveColumnDefs(theme, intl), [theme, intl]);
  const fetchFeeHistory = reactExports.useCallback(async () => {
    if (!accountSeqNo) return;
    try {
      const res = await Kr.GET(`${FeeDetailsAPI.FeeDetails(screenMenuId)}`);
      const data = res.data ?? {};
      if (data.status === "Success" && Array.isArray(data.responseJson)) {
        setFeeHistory(data.responseJson.map((item) => mapFeeHistoryRow(item, locale)));
      } else if (data.status === "Failure" && data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        setFeeHistory([]);
      }
    } catch (err) {
      console.error("Fetch fee history error:", err);
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.historyLoad" }));
      setFeeHistory([]);
    }
  }, [accountSeqNo, intl, locale, toast]);
  const fetchWaiveDetails = reactExports.useCallback(async () => {
    if (!accountSeqNo) return;
    try {
      const res = await Kr.GET(
        `${FeeDetailsAPI.FeeDetails(screenMenuId)}/fetchWaiveDetails`
      );
      const data = res.data ?? {};
      if (data.status === "Success" && Array.isArray(data.responseJson)) {
        setWaiveDetails(data.responseJson.map(mapWaiveRow));
      } else if (data.status === "Failure" && data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        setWaiveDetails([]);
      }
    } catch (err) {
      console.error("Fetch waive details error:", err);
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.waiveLoad" }));
      setWaiveDetails([]);
    }
  }, [accountSeqNo, intl, toast]);
  const loadInitial = reactExports.useCallback(async () => {
    if (!accountSeqNo) {
      setWaiveDetails([]);
      setFeeHistory([]);
      setLoadingInitial(false);
      return;
    }
    setLoadingInitial(true);
    await Promise.all([fetchFeeHistory(), fetchWaiveDetails()]);
    setLoadingInitial(false);
  }, [accountSeqNo, fetchFeeHistory, fetchWaiveDetails]);
  reactExports.useEffect(() => {
    loadInitial();
  }, [loadInitial]);
  const handleChargeChange = (field, value) => {
    setChargeDetails((prev) => ({ ...prev, [field]: value }));
  };
  const buildCommonDtoFields = () => ({
    lnReqActivitySeqNo: 0,
    lnAuthActivitySeqNo: 0,
    chDownloaded: "N",
    chAcknowledged: "N",
    szPartitionCode: partitionCode,
    szCreatedBy: userCode,
    dtCreatedOn: (/* @__PURE__ */ new Date()).toISOString(),
    szModifiedBy: userCode,
    dtModifiedOn: (/* @__PURE__ */ new Date()).toISOString()
  });
  const handleChargeFee = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const errors = [];
    if (!((_a = chargeDetails.feeCode) == null ? void 0 : _a.trim())) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.feeCode.mandatory" }));
    }
    if (!((_b = chargeDetails.amount) == null ? void 0 : _b.toString().trim())) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.amount.mandatory" }));
    }
    if (!((_c = chargeDetails.chargeReason) == null ? void 0 : _c.trim())) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.chargeReason.mandatory" }));
    }
    if (((_d = chargeDetails.remarks) == null ? void 0 : _d.trim().length) > 50 || ((_e = chargeDetails.remarks) == null ? void 0 : _e.split("\n").length) > 3) {
      errors.push(
        intl.formatMessage({
          id: "error.feeDetails.remarks.maxLength",
          defaultMessage: "Remarks cannot exceed 50 characters or 3 lines"
        })
      );
    }
    const amt = parseFloat(chargeDetails.amount);
    if (Number.isNaN(amt) || amt <= 0) {
      errors.push(intl.formatMessage({ id: "error.feeDetails.amount.positive" }));
    }
    if (errors.length) {
      errors.forEach((e) => toast.error(e));
      return;
    }
    const szReasonCode = buildChargeReasonCode(chargeDetails.chargeReason, chargeDetails.remarks);
    const feeDetailsRequestDto = [
      {
        szFeeCode: chargeDetails.feeCode.trim(),
        bdAmount: amt,
        chRequestFor: "C",
        szReasonCode,
        ...buildCommonDtoFields()
      }
    ];
    setSavingCharge(true);
    try {
      const response = await Kr.POST(FeeDetailsAPI.FeeDetails(screenMenuId), {
        feeDetailsRequestDto
      });
      const body = response == null ? void 0 : response.data;
      if ((body == null ? void 0 : body.status) === "Success") {
        toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.chargeSuccess" }));
        setChargeDetails(initialCharge);
        await fetchFeeHistory();
        await fetchWaiveDetails();
      } else if ((body == null ? void 0 : body.status) === "Failure" && (body == null ? void 0 : body.message) === "Validation Failed") {
        handleValidationErrors(intl, toast, body.responseJson);
      } else {
        toast.error((body == null ? void 0 : body.message) || intl.formatMessage({ id: "label.FeeDetails.toast.chargeError" }));
      }
    } catch (err) {
      handleValidationErrors(intl, toast, (_g = (_f = err.response) == null ? void 0 : _f.data) == null ? void 0 : _g.responseJson);
      if (!((_i = (_h = err.response) == null ? void 0 : _h.data) == null ? void 0 : _i.responseJson)) {
        toast.error(intl.formatMessage({ id: "label.FeeDetails.toast.chargeError" }));
      }
    } finally {
      setSavingCharge(false);
    }
  };
  const handleWaiveFee = async () => {
    var _a, _b, _c, _d, _e;
    if (!((_a = waiveGridRef.current) == null ? void 0 : _a.api)) {
      toast.error(intl.formatMessage({ id: "label.FeeDetails.error.gridNotReady" }));
      return;
    }
    waiveGridRef.current.api.stopEditing(false);
    const allRows = [];
    waiveGridRef.current.api.forEachNode((node) => {
      allRows.push(node.data);
    });
    const selectedWaive = allRows.filter((item) => item.WaiveNow && parseFloat(item.WaiveNow) > 0);
    if (!selectedWaive.length) {
      toast.error(intl.formatMessage({ id: "error.feeDetails.waiveNow.required" }));
      return;
    }
    const invalidRows = selectedWaive.filter((item) => !item.PaymentHead);
    if (invalidRows.length > 0) {
      toast.error(intl.formatMessage({ id: "error.feeDetails.paymentHead.mandatory" }));
      return;
    }
    const feeDetailsRequestDto = selectedWaive.map((item) => {
      var _a2;
      return {
        szFeeCode: item.PaymentHead,
        bdAmount: parseFloat(item.WaiveNow),
        chRequestFor: "W",
        szReasonCode: ((_a2 = item.Reason) == null ? void 0 : _a2.trim()) || "NA",
        ...buildCommonDtoFields()
      };
    });
    setSavingWaive(true);
    try {
      const response = await Kr.POST(FeeDetailsAPI.FeeDetails(screenMenuId), {
        feeDetailsRequestDto
      });
      const body = response == null ? void 0 : response.data;
      if ((body == null ? void 0 : body.status) === "Success") {
        toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.waiveSuccess" }));
        await fetchFeeHistory();
        await fetchWaiveDetails();
      } else if ((body == null ? void 0 : body.status) === "Failure" && (body == null ? void 0 : body.message) === "Validation Failed") {
        handleValidationErrors(intl, toast, body.responseJson);
      } else {
        toast.error((body == null ? void 0 : body.message) || intl.formatMessage({ id: "label.FeeDetails.toast.waiveError" }));
      }
    } catch (err) {
      handleValidationErrors(intl, toast, (_c = (_b = err.response) == null ? void 0 : _b.data) == null ? void 0 : _c.responseJson);
      if (!((_e = (_d = err.response) == null ? void 0 : _d.data) == null ? void 0 : _e.responseJson)) {
        toast.error(intl.formatMessage({ id: "label.FeeDetails.toast.waiveError" }));
      }
    } finally {
      setSavingWaive(false);
    }
  };
  const handleReset = async () => {
    setChargeDetails(initialCharge);
    setFeeTab("charge");
    await loadInitial();
    toast.success(intl.formatMessage({ id: "label.FeeDetails.toast.resetSuccess" }));
  };
  const handleSave = async () => {
    if (feeTab === "charge") {
      await handleChargeFee();
    } else {
      await handleWaiveFee();
    }
  };
  const gridBoxSx = { width: "100%", minHeight: 220, height: "28vh" };
  const tabBarSx = {
    mt: 1.5,
    minHeight: 32,
    p: 0.5,
    borderRadius: 2,
    width: "fit-content",
    bgcolor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.grey[900], 0.06),
    alignItems: "center",
    "& .MuiTabs-flexContainer": { gap: 0.25, alignItems: "center" },
    "& .MuiTab-root": {
      minHeight: 28,
      py: 0.5,
      px: 1.25,
      fontSize: 11,
      fontWeight: 600,
      textTransform: "none",
      borderRadius: 0.75,
      border: "none",
      minWidth: "auto"
    },
    "& .MuiTabs-indicator": { display: "none" },
    "& .MuiTab-root.Mui-selected": {
      color: "text.primary",
      bgcolor: theme.palette.mode === "dark" ? "background.paper" : alpha(theme.palette.grey[900], 0.06),
      boxShadow: theme.palette.mode === "dark" ? `0 0 0 1px ${alpha(theme.palette.common.white, 0.1)}` : `0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.FeeDetails.Title" }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                  px: { xs: 1.5, sm: 2 },
                  pb: { xs: 1.5, sm: 2 },
                  pt: 0,
                  maxWidth: 1320,
                  mx: "auto",
                  width: "100%"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      flex: 1,
                      minHeight: 0,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      mt: 0
                    },
                    children: [
                      !accountSeqNo ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "info", sx: { mb: 2 }, children: intl.formatMessage({ id: "label.FeeDetails.noAccount" }) }) : null,
                      accountSeqNo ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { elevation: 0, sx: { ...delightCardSx(theme), p: 1.5 }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ps,
                            {
                              value: intl.formatMessage({ id: "label.FeeDetails.feeType" }),
                              translate: false,
                              align: "left",
                              colon: false,
                              sx: { fontSize: 11, fontWeight: 600, color: "text.primary" }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: feeTab, onChange: (_, v) => setFeeTab(v), sx: tabBarSx, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tab, { label: intl.formatMessage({ id: "label.FeeDetails.ChargeFees" }), value: "charge" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tab, { label: intl.formatMessage({ id: "label.FeeDetails.WaiveFees" }), value: "waive" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 1.5, display: feeTab === "charge" ? "block" : "none" }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", justifyContent: "flex-end", sx: { mb: 1.5, mt: -6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Lg,
                              {
                                id: "fee-charge-policy",
                                label: "label.FeeDetails.policy.charge",
                                variant: "outlined",
                                size: "small",
                                align: "right",
                                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityIcon, { sx: { fontSize: "14px !important" } }),
                                sx: {
                                  // color: "black",
                                  borderColor: "lightgrey",
                                  height: 26,
                                  fontSize: "11px",
                                  bgcolor: "transparent",
                                  "&:hover": { borderColor: "grey.400", bgcolor: "rgba(0,0,0,0.04)" }
                                },
                                onClick: () => toast.info(intl.formatMessage({ id: "label.FeeDetails.policy.chargeStub" }))
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 1.5, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "label-textfield-row", sx: fieldContainerStyles, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.FeeDetails.Fee Code", align: "left", colon: false, disabled: false, required: true }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  dc,
                                  {
                                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                                    searchCode: "FEECODE",
                                    setSelectedValue: (dataValue) => handleChargeChange("feeCode", dataValue || ""),
                                    selectedValue: chargeDetails.feeCode,
                                    selectedColumn: "szfeecode",
                                    gridDefObj: gridFeeCodeDefObj,
                                    gridWidth: 450,
                                    gridHeight: 300,
                                    gridNoOfRowsPerPage: 5,
                                    searchBoxWidth: "100%",
                                    searchBoxHeight: 30,
                                    searchBoxFontSize: 11,
                                    error: false
                                  }
                                )
                              ] }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "label-textfield-row", sx: fieldContainerStyles, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.FeeDetails.Amount", align: "left", colon: false, disabled: false, required: true }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ap,
                                  {
                                    value: chargeDetails.amount,
                                    editable: "true",
                                    width: "100%",
                                    onChange: (e) => handleChargeChange("amount", e.target.value),
                                    type: "currency"
                                  }
                                )
                              ] }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "label-textfield-row", sx: fieldContainerStyles, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.FeeDetails.Charge Reason", align: "left", colon: false, disabled: false, required: true }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  dc,
                                  {
                                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                                    searchCode: "FEECH",
                                    setSelectedValue: (dataValue) => handleChargeChange("chargeReason", dataValue || ""),
                                    selectedValue: chargeDetails.chargeReason,
                                    selectedColumn: "szreasondesc",
                                    gridDefObj: gridChargeReasonDefObj,
                                    gridWidth: 450,
                                    gridHeight: 300,
                                    gridNoOfRowsPerPage: 5,
                                    searchBoxWidth: "100%",
                                    searchBoxHeight: 30,
                                    searchBoxFontSize: 11,
                                    error: false
                                  }
                                )
                              ] }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldContainerStyles, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.FeeDetails.Remarks", align: "left", colon: false, disabled: false }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  pp,
                                  {
                                    placeholder: "Enter Remark",
                                    value: chargeDetails.remarks,
                                    onChange: (e) => handleChargeChange("remarks", e.target.value),
                                    maxLines: 3,
                                    width: "100%",
                                    maxLength: 500
                                  }
                                )
                              ] }) })
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 1.5, display: feeTab === "waive" ? "block" : "none" }, children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", justifyContent: "flex-end", sx: { mb: 1.5, mt: -6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Lg,
                              {
                                id: "fee-waive-policy",
                                label: "label.FeeDetails.policy.waive",
                                variant: "outlined",
                                size: "small",
                                align: "right",
                                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(VisibilityIcon, { sx: { fontSize: "14px !important" } }),
                                sx: {
                                  // color: "black",
                                  borderColor: "lightgrey",
                                  height: 26,
                                  fontSize: "11px",
                                  "&:hover": { borderColor: "grey.400", bgcolor: "rgba(0,0,0,0.04)" }
                                },
                                onClick: () => toast.info(intl.formatMessage({ id: "label.FeeDetails.policy.waiveStub" }))
                              }
                            ) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Dt,
                              {
                                sx: {
                                  mt: 0,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  border: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.35 : 0.22)}`,
                                  "& > div": { marginTop: "0 !important" },
                                  "& .ag-root-wrapper": {
                                    border: "none",
                                    borderRadius: 0
                                  }
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  bu,
                                  {
                                    ref: waiveGridRef,
                                    rowData: waiveDetails,
                                    columnDefs: waiveColumns,
                                    gridStyle: gridBoxSx,
                                    allowUpdate: true,
                                    hideInternalSaveButton: true,
                                    allowAdd: false,
                                    allowDelete: false
                                  }
                                )
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FeeRequestHistoryTable, { rows: feeHistory, loading: loadingInitial })
                      ] }) : null
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: accountSeqNo && !savingCharge && !savingWaive ? handleSave : void 0,
                onReset: accountSeqNo ? handleReset : void 0,
                onClose: () => navigate("/homelayout/welcomepage"),
                disableToast: { save: true, reset: true, close: true }
              }
            )
          ]
        }
      )
    }
  );
};
export {
  FeeDetails as default
};
