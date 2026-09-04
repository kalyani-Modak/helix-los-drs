import { cV as generateUtilityClass, cW as generateUtilityClasses, dN as reactExports, eb as useDefaultProps, dB as jsxRuntimeExports, c5 as Tablelvl2Context, cC as clsx, cE as composeClasses, d$ as styled, em as useTheme, ed as useIntl, ct as ar, dL as qg, el as useSelector, ef as useLocation, h as AgeingAPI, aX as Kr, cr as alpha, v as Box, bV as Stack, b0 as Lg, N as CircularProgress, i as Alert, c2 as TableContainer, bg as Paper, b$ as Table, c3 as TableHead, c4 as TableRow, c1 as TableCell, c0 as TableBody, M as Chip, cf as Typography, al as FiAlertTriangle, cc as Tooltip, aR as IconButton } from "./index-BhdgJqva.js";
import { I as InfoOutlined } from "./InfoOutlined-CYfU0mk7.js";
import { T as TrendingDownIcon } from "./TrendingDown-ukTIlt78.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
function getTableFooterUtilityClass(slot) {
  return generateUtilityClass("MuiTableFooter", slot);
}
generateUtilityClasses("MuiTableFooter", ["root"]);
const useUtilityClasses = (ownerState) => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ["root"]
  };
  return composeClasses(slots, getTableFooterUtilityClass, classes);
};
const TableFooterRoot = styled("tfoot", {
  name: "MuiTableFooter",
  slot: "Root"
})({
  display: "table-footer-group"
});
const tablelvl2 = {
  variant: "footer"
};
const defaultComponent = "tfoot";
const TableFooter = /* @__PURE__ */ reactExports.forwardRef(function TableFooter2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiTableFooter"
  });
  const {
    className,
    component = defaultComponent,
    ...other
  } = props;
  const ownerState = {
    ...props,
    component
  };
  const classes = useUtilityClasses(ownerState);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tablelvl2Context.Provider, {
    value: tablelvl2,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableFooterRoot, {
      as: component,
      className: clsx(classes.root, className),
      ref,
      role: component === defaultComponent ? null : "rowgroup",
      ownerState,
      ...other
    })
  });
});
function parseAmount(raw) {
  if (raw == null || raw === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}
function mapResponseToRows(responseJson) {
  if (!Array.isArray(responseJson)) return [];
  const byCode = /* @__PURE__ */ new Map();
  for (const item of responseJson) {
    const code = String(item.szBucketCode ?? item.sz_bucket_code ?? "").trim();
    const desc = String(item.szBucketDesc ?? item.sz_bucket_desc ?? "").trim();
    const amt = parseAmount(item.fodAmount ?? item.fod_amount);
    const key = code || `__row_${byCode.size}`;
    const prev = byCode.get(key);
    if (prev) {
      byCode.set(key, { bucketCode: code || prev.bucketCode, description: desc || prev.description, amount: prev.amount + amt });
    } else {
      byCode.set(key, { bucketCode: code, description: desc, amount: amt });
    }
  }
  return Array.from(byCode.values()).map((r, idx) => ({
    srNo: idx + 1,
    bucketCode: r.bucketCode,
    description: r.description,
    amount: r.amount
  }));
}
function segmentBackground(srNo, theme) {
  if (srNo === 1) return theme.palette.success.main;
  if (srNo <= 3) return theme.palette.warning.main;
  return theme.palette.error.main;
}
function BucketDistributionCard({ rows, totalSum, intl, locale, currencyPrefix, theme }) {
  const headerBg = theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.grey[900], 0.035);
  const tooltipTitle = intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.tooltip" });
  const infoAria = intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.tooltip" });
  const segments = reactExports.useMemo(() => {
    if (!totalSum || totalSum <= 0) return [];
    return rows.map((row) => {
      const amt = Number(row.amount) || 0;
      const pct = totalSum > 0 ? amt / totalSum * 100 : 0;
      return { row, amt, pct };
    }).filter(({ amt, pct }) => amt > 0 && pct > 0);
  }, [rows, totalSum]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { variant: "outlined", elevation: 0, sx: { borderRadius: 2, borderColor: "divider", mb: 2, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        sx: {
          py: 1.25,
          px: 2,
          bgcolor: headerBg,
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", alignItems: "center", spacing: 0.75, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", sx: { fontWeight: 600, fontSize: "0.75rem", color: "text.primary" }, children: intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.title" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: tooltipTitle, arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { size: "small", "aria-label": infoAria, sx: { p: 0.25, color: "text.secondary" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(InfoOutlined, { sx: { fontSize: 14 } }) }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { px: 2, pb: 1.5, pt: 1.5 }, children: !totalSum || totalSum <= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11, color: "text.secondary" }, children: intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.emptyBar" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", gap: "4px", height: 32, borderRadius: 1, overflow: "hidden" }, children: segments.map(({ row, amt, pct }) => {
        const tip = /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.25, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 600, fontSize: 11 }, children: row.description || row.bucketCode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 11 }, children: `${currencyPrefix}${amt.toLocaleString(locale)} (${Math.round(pct)}%)` })
        ] });
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: tip, arrow: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Box,
          {
            component: "span",
            sx: {
              width: `${pct}%`,
              minWidth: pct > 0 ? 24 : 0,
              height: "100%",
              bgcolor: segmentBackground(row.srNo, theme),
              display: "block",
              transition: "width 0.2s ease"
            }
          }
        ) }, row.srNo);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "space-between", mt: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 10, color: "text.secondary" }, children: intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.axisStart" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontSize: 10, color: "text.secondary", textAlign: "right", maxWidth: "50%" }, noWrap: true, children: intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.axisEnd" }) })
      ] })
    ] }) })
  ] });
}
function AgeingSummaryCards({ totalOverdue, currentBucket, rollBackAmount, intl, locale, currencyPrefix, theme }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 2, mb: 2, flexWrap: { xs: "wrap", md: "nowrap" } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { variant: "outlined", sx: { flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }, children: "TOTAL OVERDUE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h5", sx: { color: theme.palette.error.main, fontWeight: 700, mt: 0.5 }, children: [
        currencyPrefix,
        totalOverdue.toLocaleString(locale)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { variant: "outlined", sx: { flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }, children: "CURRENT BUCKET" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h5", sx: { color: "text.primary", fontWeight: 700, mt: 0.5 }, children: currentBucket })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { variant: "outlined", sx: { flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }, children: "TO ROLL BACK 1 BUCKET" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDownIcon, { sx: { color: theme.palette.success.main, fontSize: 22 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "h5", sx: { color: theme.palette.success.main, fontWeight: 700 }, children: [
          currencyPrefix,
          rollBackAmount.toLocaleString(locale)
        ] })
      ] })
    ] })
  ] });
}
const AgeingDetails = () => {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const locale = navigator.language;
  const currencyPrefix = qg(locale);
  const { selectedRow } = useSelector((state) => state.account);
  const accountSeqNo = (selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) ?? (selectedRow == null ? void 0 : selectedRow.acnt_seqno);
  const partitionCode = (selectedRow == null ? void 0 : selectedRow.PARTITION_CODE) || (selectedRow == null ? void 0 : selectedRow.szPartitionCode) || "001";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [surface, setSurface] = reactExports.useState(null);
  const formatCurrencyCell = reactExports.useCallback(
    (amount) => {
      if (!amount || amount === 0) {
        return intl.formatMessage({ id: "label.AgeingDetails.dash" });
      }
      const formatted = Number(amount).toLocaleString(locale);
      return `${currencyPrefix}${formatted}`;
    },
    [currencyPrefix, intl, locale]
  );
  const loadAgeing = reactExports.useCallback(async () => {
    var _a;
    if (!accountSeqNo) {
      setRows([]);
      setSurface("noAccount");
      setLoading(false);
      return;
    }
    setLoading(true);
    setSurface(null);
    const payload = {
      szPartitionCode: String(partitionCode),
      szAccountSeqNo: Number(accountSeqNo) || accountSeqNo,
      inPageNumber: 0
    };
    try {
      const url = AgeingAPI.AgeingDetails(screenMenuId);
      const res = await Kr.GET(url, {
        params: payload
      });
      const status = res.status;
      const data = res.data ?? {};
      if (status === 204 || data.status === "Failure" && String(data.message || "").toLowerCase().includes("no data")) {
        setRows([]);
        setSurface("empty");
        return;
      }
      if (status >= 400) {
        setRows([]);
        setSurface("load");
        return;
      }
      if (data.status === "Success" && Array.isArray(data.responseJson)) {
        const mapped = mapResponseToRows(data.responseJson);
        setRows(mapped);
        setSurface(mapped.length === 0 ? "empty" : null);
        return;
      }
      setRows([]);
      setSurface("load");
      (_a = toast == null ? void 0 : toast.warning) == null ? void 0 : _a.call(toast, intl.formatMessage({ id: "label.AgeingDetails.error.unexpected" }));
      console.warn("AgeingDetails: unexpected response shape", data);
    } catch (e) {
      setRows([]);
      setSurface("load");
      console.error("AgeingDetails API error", e);
    } finally {
      setLoading(false);
    }
  }, [accountSeqNo, intl, partitionCode, toast]);
  reactExports.useEffect(() => {
    loadAgeing();
  }, [loadAgeing]);
  const totalAllBuckets = reactExports.useMemo(() => rows.reduce((s, r) => s + (Number(r.amount) || 0), 0), [rows]);
  const worstBucketRow = reactExports.useMemo(() => [...rows].reverse().find((r) => r.amount > 0), [rows]);
  const rollbackBucketNumber = (worstBucketRow == null ? void 0 : worstBucketRow.bucketCode) ? Number(worstBucketRow.bucketCode) : null;
  const currentBucketStr = (selectedRow == null ? void 0 : selectedRow.szBucket) || (selectedRow == null ? void 0 : selectedRow.BKT) || (worstBucketRow == null ? void 0 : worstBucketRow.bucketCode) || "-";
  const rollBackAmt = reactExports.useMemo(() => {
    if (rows.length >= 2) {
      const last = Number(rows[rows.length - 1].amount) || 0;
      const secondLast = Number(rows[rows.length - 2].amount) || 0;
      return Math.abs(last - secondLast);
    }
    return rows.length === 1 ? Number(rows[0].amount) || 0 : 0;
  }, [rows]);
  const totalToBucketOne = reactExports.useMemo(() => {
    if (rows.length >= 2) {
      const last = Number(rows[rows.length - 1].amount) || 0;
      const first = Number(rows[0].amount) || 0;
      return Math.abs(last - first);
    }
    return rows.length === 1 ? Number(rows[0].amount) || 0 : 0;
  }, [rows]);
  const headerBg = theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.grey[900], 0.06);
  const zebraBg = theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.04) : alpha(theme.palette.grey[900], 0.04);
  const tableAria = intl.formatMessage({ id: "label.AgeingDetails.table.aria" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.AgeingDetails.title" }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Box,
        {
          className: "drs-page-container",
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
            Box,
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
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", justifyContent: "flex-end", sx: { mb: 1, flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Lg,
                  {
                    id: "ageing-refresh",
                    label: "label.AgeingDetails.refresh",
                    variant: "outlined",
                    size: "small",
                    onClick: () => loadAgeing(),
                    disabled: loading || !accountSeqNo,
                    loading,
                    align: "right"
                  }
                ) }),
                loading && rows.length === 0 && accountSeqNo && surface !== "noAccount" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", justifyContent: "center", alignItems: "center", py: 4 }, "aria-busy": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 32, "aria-label": intl.formatMessage({ id: "label.AgeingDetails.loading" }) }) }) : null,
                surface === "noAccount" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "info", sx: { mb: 2 }, children: intl.formatMessage({ id: "label.AgeingDetails.noAccount" }) }) : null,
                surface === "load" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 2 }, children: intl.formatMessage({ id: "label.AgeingDetails.error.loadFailed" }) }) : null,
                surface === "empty" && !loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "info", sx: { mb: 2 }, children: intl.formatMessage({ id: "label.AgeingDetails.empty" }) }) : null,
                !loading && rows.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AgeingSummaryCards,
                    {
                      totalOverdue: totalAllBuckets,
                      currentBucket: currentBucketStr,
                      rollBackAmount: rollBackAmt,
                      intl,
                      locale,
                      currencyPrefix,
                      theme
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BucketDistributionCard,
                    {
                      rows,
                      totalSum: totalAllBuckets,
                      intl,
                      locale,
                      currencyPrefix,
                      theme
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableContainer, { component: Paper, variant: "outlined", sx: { borderRadius: 2, borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", "aria-label": tableAria, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { bgcolor: headerBg }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 11, fontWeight: 600, width: 64 }, children: intl.formatMessage({ id: "label.AgeingDetails.SrNo" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 11, fontWeight: 600 }, children: intl.formatMessage({ id: "label.AgeingDetails.Bucket Code" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 11, fontWeight: 600 }, children: intl.formatMessage({ id: "label.AgeingDetails.Bucket Description" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", sx: { fontSize: 11, fontWeight: 600, width: 140 }, children: intl.formatMessage({ id: "label.AgeingDetails.Amount" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 11, fontWeight: 600, width: 100 }, children: intl.formatMessage({ id: "label.AgeingDetails.Status" }) })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((row, i) => {
                      const isZebra = i % 2 === 1;
                      const amt = Number(row.amount) || 0;
                      const amountColor = amt > 0 ? theme.palette.error.main : theme.palette.text.secondary;
                      const amountWeight = 600;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { bgcolor: isZebra ? zebraBg : "transparent" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 12, fontWeight: 500, color: "text.primary" }, children: row.srNo }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 12, fontFamily: "ui-monospace, monospace", color: "text.primary" }, children: row.bucketCode || intl.formatMessage({ id: "label.AgeingDetails.dash" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 12, color: "text.primary" }, children: row.description }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { align: "right", sx: { fontSize: 12, fontWeight: amountWeight, color: amountColor }, children: formatCurrencyCell(amt) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontSize: 12 }, children: row.srNo === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Chip,
                          {
                            size: "small",
                            color: "success",
                            variant: "filled",
                            label: intl.formatMessage({ id: "label.AgeingDetails.status.current" }),
                            sx: { height: 22, fontSize: 10, fontWeight: 600 }
                          }
                        ) : amt > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Chip,
                          {
                            label: intl.formatMessage({ id: "label.AgeingDetails.status.overdue" }),
                            size: "small",
                            color: "error",
                            sx: { height: 22, fontSize: 10, fontWeight: 600 }
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { component: "span", variant: "caption", sx: { fontSize: 10, color: "text.secondary" }, children: intl.formatMessage({ id: "label.AgeingDetails.dash" }) }) })
                      ] }, `${row.bucketCode}-${row.srNo}`);
                    }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 3, sx: { fontSize: 12, fontWeight: 600, color: "text.primary" }, children: intl.formatMessage({ id: "label.AgeingDetails.totalOverdueFooter" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TableCell,
                        {
                          align: "right",
                          sx: {
                            fontSize: 12,
                            fontWeight: 700,
                            color: totalAllBuckets > 0 ? theme.palette.error.main : theme.palette.text.secondary
                          },
                          children: totalAllBuckets > 0 ? `${currencyPrefix}${totalAllBuckets.toLocaleString(locale)}` : intl.formatMessage({ id: "label.AgeingDetails.dash" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, {})
                    ] }) })
                  ] }) }),
                  rollbackBucketNumber != null && rollbackBucketNumber > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", alignItems: "center", spacing: 1, sx: { mb: 0.5 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FiAlertTriangle, { size: 18, style: { color: theme.palette.warning.main, flexShrink: 0 } }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }, children: intl.formatMessage({ id: "label.ageingDetails.rollbackGuidance", defaultMessage: "Rollback Guidance" }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { sx: { fontSize: "0.875rem", color: "text.secondary", pl: "26px" }, children: [
                      intl.formatMessage({ id: "label.ageingDetails.collecting", defaultMessage: "Collecting" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { component: "span", sx: { fontWeight: 600, color: theme.palette.primary.main }, children: [
                        currencyPrefix,
                        rollBackAmt.toLocaleString(locale)
                      ] }),
                      " ",
                      intl.formatMessage({ id: "label.ageingDetails.rollbackExplanation", defaultMessage: "will move the account from Bucket" }),
                      " ",
                      rollbackBucketNumber,
                      " ",
                      intl.formatMessage({ id: "label.ageingDetails.toBucket", defaultMessage: "to Bucket" }),
                      " ",
                      rollbackBucketNumber - 1,
                      ".",
                      " ",
                      intl.formatMessage({ id: "label.ageingDetails.total", defaultMessage: "Total" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { component: "span", sx: { fontWeight: 600, color: theme.palette.primary.main }, children: [
                        currencyPrefix,
                        totalToBucketOne.toLocaleString(locale)
                      ] }),
                      " ",
                      intl.formatMessage({ id: "label.ageingDetails.needToBring", defaultMessage: "needed to bring to Bucket 1" }),
                      "."
                    ] })
                  ] }) : null
                ] }) : null
              ]
            }
          )
        }
      )
    }
  );
};
export {
  AgeingDetails as default
};
