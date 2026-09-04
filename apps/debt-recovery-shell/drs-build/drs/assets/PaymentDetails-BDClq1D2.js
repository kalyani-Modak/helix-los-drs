import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, em as useTheme, dN as reactExports, dL as qg, ac as Dt, W as CreditCard, i as Alert, aW as Kg, dK as ps, bu as RE, cw as bE, cr as alpha, dD as lE, cy as bu, M as Chip, N as CircularProgress, el as useSelector, ef as useLocation, aX as Kr, bh as PaymentAPI, bf as OverviewAPI, dH as parseOverviewResponse, v as Box } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { C as CalendarMonth } from "./CalendarMonth-oWMivZYB.js";
const Receipt = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M18 17H6v-2h12zm0-4H6v-2h12zm0-4H6V7h12zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2z"
}));
const PAYMENT_GRID_DELIGHT = {
  success: "hsl(142, 71%, 45%)",
  mutedForeground: "hsl(215, 14%, 46%)"
};
function toPaymentNumber(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const n = cleaned !== "" ? Number(cleaned) : 0;
  return Number.isFinite(n) ? n : 0;
}
function sumPaymentAmounts(rows) {
  if (!Array.isArray(rows)) return 0;
  return rows.reduce((acc, row) => {
    return acc + toPaymentNumber(row == null ? void 0 : row.bdAmount);
  }, 0);
}
function formatGridDate(value, locale) {
  if (value == null || value === "") return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale || void 0);
}
const DASH = "-";
const TAB_PAYMENTS = 0;
const TAB_INSTALLMENTS = 1;
const TAB_BILLING = 2;
const tabbedAgGridStyle = {
  width: "100%",
  height: "min(48vh, 480px)",
  minWidth: "600px"
};
const tabbedBillingGridStyle = {
  width: "100%",
  height: "min(48vh, 480px)",
  minWidth: "640px"
};
function firstDefined$1(obj, keys) {
  if (!obj) return void 0;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (obj[key] != null && obj[key] !== "") return obj[key];
  }
  return void 0;
}
function formatMoneyCompact(value, locale) {
  const n = value != null && value !== "" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return DASH;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}
function GridMessage({ loading, message }) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          background: "transparent"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 32 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.paymentBilling.loading", colon: false, align: "center" })
        ]
      }
    );
  }
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ps,
    {
      value: message,
      translate: false,
      colon: false,
      align: "left",
      sx: { mb: 1, fontSize: "0.8125rem" }
    }
  );
}
function SummaryIcon({ icon: Icon, tone }) {
  const theme = useTheme();
  const paletteKey = tone === "success" ? "success" : tone === "error" ? "error" : "primary";
  const main = theme.palette[paletteKey].main;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      sx: {
        width: 32,
        height: 32,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        backgroundColor: alpha(main, 0.12)
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 16, color: main } })
    }
  );
}
function SummaryCard({ icon, tone, label, value, helper, valueColor }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "outlined", sx: { borderRadius: 2, p: 1.5, minHeight: 76 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1.25, background: "transparent" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryIcon, { icon, tone }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, background: "transparent" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: label,
          colon: false,
          align: "left",
          sx: {
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.08em"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value,
          translate: false,
          colon: false,
          align: "left",
          sx: {
            fontSize: "0.875rem",
            fontWeight: 700,
            color: valueColor || "text.primary"
          }
        }
      ),
      helper ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: helper,
          translate: false,
          colon: false,
          align: "left",
          sx: { fontSize: "10px", fontWeight: 400, mt: 0.25 }
        }
      ) : null
    ] })
  ] }) });
}
function makeCurrencyFormatter(locale) {
  return (params) => {
    const prefix = qg(locale);
    const value = params.value ?? 0;
    return `${prefix}${value}`;
  };
}
function PaymentBillingTabPanel({
  paymentRowData = [],
  paymentLoading,
  fetchErrorMessage,
  locale,
  paymentTotalElements,
  paymentDatasource,
  paymentPageSize = 10,
  installmentRowData = [],
  installmentLoading,
  installmentInfo,
  installmentTotalElements,
  installmentDatasource,
  installmentPageSize = 10,
  billingRowData = [],
  billingLoading,
  billingInfo,
  billingTotalElements,
  billingDatasource,
  billingPageSize = 10
}) {
  const intl = useIntl();
  const theme = useTheme();
  const [activeTab, setActiveTab] = reactExports.useState(TAB_PAYMENTS);
  const tabsSx = {
    minHeight: 44,
    px: 0.5,
    bgcolor: theme.palette.mode === "dark" ? "action.selected" : "grey.100",
    borderRadius: 999,
    alignItems: "center",
    "& .MuiTab-root": {
      minHeight: 36,
      py: 0.75,
      px: 2,
      mr: 1,
      fontSize: "0.8125rem",
      textTransform: "none",
      fontWeight: 500,
      letterSpacing: "0.01em",
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      borderRadius: 999,
      color: "text.secondary",
      bgcolor: "transparent",
      transition: "background-color 150ms ease, color 150ms ease",
      "&:hover": {
        bgcolor: theme.palette.action.hover
      },
      "&.Mui-selected": {
        color: "text.primary",
        fontWeight: 600,
        bgcolor: theme.palette.background.paper
      }
    },
    "& .MuiTabs-flexContainer": {
      alignItems: "center"
    },
    "& .MuiTabs-indicator": {
      display: "none"
    }
  };
  const cardSx = {
    borderRadius: 2,
    overflow: "hidden",
    borderColor: "divider",
    border: 1,
    borderStyle: "solid",
    bgcolor: "background.paper"
  };
  const panelPadding = (loading, rowCount) => loading && rowCount === 0 ? 2 : 0;
  const panelBg = theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(15, 23, 42, 0.03)";
  const paymentCount = Number.isFinite(Number(paymentTotalElements)) ? Number(paymentTotalElements) : paymentRowData.length;
  const installmentCount = Number.isFinite(Number(installmentTotalElements)) ? Number(installmentTotalElements) : installmentRowData.length;
  const billingCount = Number.isFinite(Number(billingTotalElements)) ? Number(billingTotalElements) : billingRowData.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
        background: "transparent"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Kg,
          {
            variant: "outlined",
            sx: {
              borderRadius: 999,
              borderColor: "divider",
              bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.100",
              mb: 1,
              px: 0.5,
              py: 0.5
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              RE,
              {
                value: activeTab,
                onChange: (_, next) => setActiveTab(next),
                variant: "standard",
                sx: tabsSx,
                TabIndicatorProps: { style: { display: "none" } },
                "aria-label": intl.formatMessage({ id: "label.paymentBilling.tabs.aria" }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(bE, { label: `${intl.formatMessage({ id: "label.paymentBilling.section.payment" })} (${paymentCount})` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(bE, { label: `${intl.formatMessage({ id: "label.paymentBilling.section.installments" })} (${installmentCount})` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(bE, { label: `${intl.formatMessage({ id: "label.paymentBilling.section.billing" })} (${billingCount})` })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { pt: 1.5, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "transparent" }, children: [
          activeTab === TAB_PAYMENTS ? /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "outlined", sx: cardSx, component: "section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: panelPadding(paymentLoading, paymentRowData.length), bgcolor: panelBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PaymentSectionGrid,
            {
              paymentRowData,
              paymentLoading,
              fetchErrorMessage,
              locale,
              agGridStyle: tabbedAgGridStyle,
              paymentDatasource,
              paymentPageSize
            }
          ) }) }) : null,
          activeTab === TAB_INSTALLMENTS ? /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "outlined", sx: cardSx, component: "section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: panelPadding(installmentLoading, installmentRowData.length), bgcolor: panelBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            InstallmentSectionGrid,
            {
              installmentRowData,
              installmentLoading,
              installmentInfo,
              locale,
              agGridStyle: tabbedAgGridStyle,
              installmentDatasource,
              installmentPageSize
            }
          ) }) }) : null,
          activeTab === TAB_BILLING ? /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "outlined", sx: cardSx, component: "section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: panelPadding(billingLoading, billingRowData.length), bgcolor: panelBg }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            BillingSectionGrid,
            {
              billingRowData,
              billingLoading,
              billingInfo,
              locale,
              agGridStyle: tabbedBillingGridStyle,
              billingDatasource,
              billingPageSize
            }
          ) }) }) : null
        ] })
      ]
    }
  );
}
function PaymentAndBilling({
  paymentRowData = [],
  fetchErrorMessage,
  infoMessage,
  selectedRow,
  locale
}) {
  const intl = useIntl();
  const theme = useTheme();
  const totalPaid = reactExports.useMemo(() => sumPaymentAmounts(paymentRowData), [paymentRowData]);
  const nextDueAmount = firstDefined$1(selectedRow, [
    "bdNextDueAmt",
    "BD_NEXT_DUE_AMT",
    "bdNydAmount",
    "NYD_AMOUNT"
  ]);
  const nextDueDate = firstDefined$1(selectedRow, [
    "dtNextDueDate",
    "DT_NEXT_DUE_DATE",
    "dtNextDue"
  ]);
  const paidInst = firstDefined$1(selectedRow, ["inPaidInst", "IN_PAID_INST", "paidInst"]);
  const totalInst = firstDefined$1(selectedRow, ["inTotalInst", "IN_TOTAL_INST", "totalInst"]);
  const nextDueAmountStr = nextDueAmount != null ? `${qg(locale)}${formatMoneyCompact(nextDueAmount, intl.locale)}` : DASH;
  const nextDueDateStr = nextDueDate != null ? formatGridDate(nextDueDate, intl.locale) : null;
  const installmentProgressStr = paidInst != null && totalInst != null ? intl.formatMessage(
    { id: "label.paymentBilling.summary.installmentsRatio" },
    { paid: paidInst, total: totalInst }
  ) : DASH;
  const totalPaidDisplay = `${qg(locale)}${formatMoneyCompact(totalPaid, intl.locale)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", width: "100%", background: "transparent" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
          mb: 2,
          background: "transparent"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SummaryCard,
            {
              icon: CreditCard,
              tone: "success",
              label: "label.paymentBilling.summary.totalPaid",
              value: totalPaidDisplay,
              valueColor: PAYMENT_GRID_DELIGHT.success
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SummaryCard,
            {
              icon: CalendarMonth,
              tone: "error",
              label: "label.paymentBilling.summary.nextDue",
              value: nextDueAmountStr,
              valueColor: theme.palette.error.main,
              helper: nextDueDateStr ? intl.formatMessage(
                { id: "label.paymentBilling.summary.nextDueOnDate" },
                { date: nextDueDateStr }
              ) : intl.formatMessage({ id: "label.paymentBilling.summary.notAvailable" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SummaryCard,
            {
              icon: Receipt,
              tone: "primary",
              label: "label.paymentBilling.summary.installments",
              value: installmentProgressStr,
              helper: intl.formatMessage({ id: "label.paymentBilling.summary.paidSuffix" })
            }
          )
        ]
      }
    ),
    fetchErrorMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "error", sx: { mb: 1.5 }, children: fetchErrorMessage }) : null,
    infoMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { severity: "info", sx: { mb: 1.5 }, children: infoMessage }) : null
  ] });
}
function PaymentSectionGrid({
  paymentRowData = [],
  paymentLoading,
  fetchErrorMessage,
  locale,
  agGridStyle,
  paymentDatasource,
  paymentPageSize = 10
}) {
  const intl = useIntl();
  const theme = useTheme();
  const paymentColumnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.Payment.SrNo" }),
        field: "srNo",
        maxWidth: 120,
        cellStyle: { textAlign: lE.NUMBER, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agNumberColumnFilter"
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.TransactionDate" }),
        field: "dtTranDate",
        type: "date",
        flex: 1,
        cellStyle: { textAlign: lE.DATE, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agDateColumnFilter"
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.ValueDate" }),
        field: "dtValueDate",
        type: "date",
        flex: 1,
        cellStyle: { textAlign: lE.DATE, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agDateColumnFilter"
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.Amount" }),
        field: "bdAmount",
        flex: 1,
        cellStyle: {
          textAlign: lE.CURRENCY,
          fontSize: "12px",
          fontWeight: 600,
          color: PAYMENT_GRID_DELIGHT.success
        },
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: makeCurrencyFormatter(locale)
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.TransactionCode" }),
        field: "szTransactionCode",
        flex: 1,
        cellStyle: {
          textAlign: lE.TEXT,
          fontSize: "12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          color: theme.palette.text.primary
        },
        sortable: true,
        filter: "agTextColumnFilter"
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.Narration" }),
        field: "szNarration",
        flex: 1,
        cellStyle: { textAlign: lE.TEXT, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.mutedForeground },
        sortable: true,
        filter: "agTextColumnFilter",
        tooltipField: "szNarration",
        cellRenderer: (params) => {
          const value = params.value;
          if (value && String(value).length > 50) return `${String(value).substring(0, 50)}...`;
          return value;
        }
      }
    ],
    [intl, locale, theme.palette.text.primary]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { background: "transparent" }, children: [
    !fetchErrorMessage && paymentRowData.length === 0 && !paymentLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GridMessage, { message: intl.formatMessage({ id: "label.paymentBilling.empty.payments" }) }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        rowData: paymentRowData,
        columnDefs: paymentColumnDefs,
        gridStyle: agGridStyle ?? tabbedAgGridStyle,
        rowModelType: "infinite",
        datasource: paymentDatasource,
        cacheBlockSize: paymentPageSize,
        maxBlocksInCache: 2,
        pagination: true,
        paginationPageSize: paymentPageSize,
        domLayout: "normal",
        sort: true,
        allowUpdate: false,
        hideInternalSaveButton: true
      }
    )
  ] });
}
function InstallmentSectionGrid({
  installmentRowData = [],
  installmentLoading,
  installmentInfo,
  locale,
  agGridStyle,
  installmentDatasource,
  installmentPageSize = 10
}) {
  const intl = useIntl();
  const theme = useTheme();
  const installmentColumnDefs = reactExports.useMemo(
    () => [
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.sr" }), field: "sr", maxWidth: 100, cellStyle: { textAlign: lE.NUMBER, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.dueDate" }), field: "dueDate", type: "date", flex: 1, cellStyle: { textAlign: lE.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.dueAmount" }), field: "dueAmount", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      {
        headerName: intl.formatMessage({ id: "label.paymentBilling.installments.status" }),
        field: "status",
        flex: 1,
        cellStyle: { textAlign: lE.TEXT, fontSize: "12px" },
        cellRenderer: (params) => {
          const rawValue = params.value;
          const normalizedValue = String(rawValue ?? "").trim();
          const key = normalizedValue.toLowerCase();
          if (!normalizedValue || key === "null" || key === "undefined" || key === "n/a") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: DASH });
          }
          const statusMap = {
            paid: {
              label: "Paid",
              sx: {
                color: "#22c55e",
                bgcolor: "#e8f8ef"
              }
            },
            pd: {
              label: "Paid",
              sx: {
                color: "#22c55e",
                bgcolor: "#e8f8ef"
              }
            },
            overdue: {
              label: "Overdue",
              sx: {
                color: "#ef4444",
                bgcolor: "#fdecec"
              }
            },
            ovd: {
              label: "Overdue",
              sx: {
                color: "#ef4444",
                bgcolor: "#fdecec"
              }
            },
            upcoming: {
              label: "Upcoming",
              sx: {
                color: "#f59e0b",
                bgcolor: "#fff4e5"
              }
            },
            upc: {
              label: "Upcoming",
              sx: {
                color: "#f59e0b",
                bgcolor: "#fff4e5"
              }
            }
          };
          const statusConfig = statusMap[key];
          if (!statusConfig) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Chip,
              {
                label: normalizedValue,
                size: "small",
                sx: {
                  fontSize: "11px",
                  fontWeight: 600,
                  height: 24,
                  borderRadius: "999px",
                  color: "#475569",
                  bgcolor: "#eef2f7"
                }
              }
            );
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Chip,
            {
              label: statusConfig.label,
              size: "small",
              sx: {
                fontSize: "11px",
                fontWeight: 600,
                height: 24,
                borderRadius: "999px",
                ...statusConfig.sx
              }
            }
          );
        }
      },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.principal" }), field: "principal", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.interest" }), field: "interest", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.other" }), field: "other", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) }
    ],
    [intl, locale, theme.palette.text.primary]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { background: "transparent" }, children: [
    installmentInfo && !installmentLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GridMessage, { message: installmentInfo }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        rowData: installmentRowData,
        columnDefs: installmentColumnDefs,
        gridStyle: agGridStyle ?? tabbedAgGridStyle,
        rowModelType: "infinite",
        datasource: installmentDatasource,
        cacheBlockSize: installmentPageSize,
        maxBlocksInCache: 2,
        pagination: true,
        paginationPageSize: installmentPageSize,
        domLayout: "normal",
        sort: true,
        allowUpdate: false,
        hideInternalSaveButton: true
      }
    )
  ] });
}
function BillingSectionGrid({
  billingRowData = [],
  billingLoading,
  billingInfo,
  locale,
  agGridStyle,
  billingDatasource,
  billingPageSize = 10
}) {
  const intl = useIntl();
  const theme = useTheme();
  const billingColumnDefs = reactExports.useMemo(
    () => [
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.sr" }), field: "sr", maxWidth: 90, cellStyle: { textAlign: lE.NUMBER, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.date" }), field: "date", type: "date", flex: 1, cellStyle: { textAlign: lE.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.billAmt" }), field: "billAmt", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.dueDate" }), field: "dueDate", type: "date", flex: 1, cellStyle: { textAlign: lE.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.dueAmt" }), field: "dueAmt", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.error.main }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.prevBal" }), field: "prevBalance", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.freshPurchase" }), field: "freshPurchase", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.otherDebits" }), field: "otherDebits", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.paymentRcvd" }), field: "paymentReceived", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.success }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.otherCredits" }), field: "otherCredits", flex: 1, cellStyle: { textAlign: lE.CURRENCY, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.success }, valueFormatter: makeCurrencyFormatter(locale) }
    ],
    [intl, locale, theme.palette.error.main, theme.palette.text.primary]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { background: "transparent" }, children: [
    billingInfo && !billingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GridMessage, { message: billingInfo }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        rowData: billingRowData,
        columnDefs: billingColumnDefs,
        gridStyle: agGridStyle ?? tabbedBillingGridStyle,
        rowModelType: "infinite",
        datasource: billingDatasource,
        cacheBlockSize: billingPageSize,
        maxBlocksInCache: 2,
        pagination: true,
        paginationPageSize: billingPageSize,
        domLayout: "normal",
        sort: true,
        allowUpdate: false,
        hideInternalSaveButton: true
      }
    )
  ] });
}
function firstDefined(obj, keys) {
  if (!obj) return void 0;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (obj[key] != null && obj[key] !== "") return obj[key];
  }
  return void 0;
}
function num(a, b) {
  const x = a != null && a !== "" ? Number(a) : 0;
  const y = b != null && b !== "" ? Number(b) : 0;
  const nx = Number.isFinite(x) ? x : 0;
  const ny = Number.isFinite(y) ? y : 0;
  return nx + ny;
}
function mapBillingGridRow(entity, index, locale) {
  const otherDebits = num(entity.bdOtherDebits, entity.bdFeesCharged);
  const billingDate = firstDefined(entity, ["dtBillingDate", "billingDate", "date"]);
  const dueDate = firstDefined(entity, ["dtDueDate", "dueDate", "dtNextDueDate"]);
  return {
    sr: index + 1,
    date: billingDate != null ? formatGridDate(billingDate, locale) : "",
    billAmt: firstDefined(entity, ["bdBillAmount", "billAmt", "billAmount"]),
    dueDate: dueDate != null ? formatGridDate(dueDate, locale) : "",
    dueAmt: firstDefined(entity, ["bdAmountDue", "dueAmt", "dueAmount", "bdNextDueAmt"]),
    prevBalance: firstDefined(entity, ["bdPreviousBalance", "prevBalance", "previousBalance"]),
    freshPurchase: firstDefined(entity, ["bdFreshPurchases", "freshPurchase", "freshPurchases"]),
    otherDebits,
    paymentReceived: firstDefined(entity, ["bdPaymentReceived", "paymentReceived"]),
    otherCredits: firstDefined(entity, ["bdOtherCredits", "otherCredits"])
  };
}
function mapInstallmentGridRow(entity, locale) {
  const dueDate = firstDefined(entity, ["dtDueDate", "dueDate", "dtNextDueDate"]);
  return {
    sr: firstDefined(entity, ["inInstallmentNo", "installmentNo", "sr"]),
    dueDate: dueDate != null ? formatGridDate(dueDate, locale) : "",
    dueAmount: firstDefined(entity, ["bdInstAmt", "dueAmount", "bdDueAmount", "bdAmountDue"]),
    status: firstDefined(entity, ["szStatus", "status", "installmentStatus"]) ?? "",
    principal: firstDefined(entity, ["bdPrinAmt", "principal", "bdPrincipal"]),
    interest: firstDefined(entity, ["bdIntAmt", "interest", "bdInterest"]),
    other: firstDefined(entity, ["bdOtherAmt", "other", "otherAmount"])
  };
}
const DEFAULT_GRID_PAGE_SIZE = 10;
function buildPageRequest(pageNumber, size) {
  return {
    pageNumber,
    size,
    pageSize: size
  };
}
function extractTotalElements(res, fallbackLength = 0) {
  var _a, _b;
  const body = res == null ? void 0 : res.data;
  const raw = Number(
    (body == null ? void 0 : body.totalElements) ?? (body == null ? void 0 : body.totalCount) ?? ((_a = body == null ? void 0 : body.responseJson) == null ? void 0 : _a.totalElements) ?? ((_b = body == null ? void 0 : body.responseJson) == null ? void 0 : _b.totalCount) ?? fallbackLength
  );
  return Number.isFinite(raw) ? raw : fallbackLength;
}
function parseListResponse(res, intl) {
  if (res.status === 204) {
    return { rows: [], info: intl.formatMessage({ id: "label.paymentBilling.info.noContent" }) };
  }
  const body = res.data;
  const responseJson = body == null ? void 0 : body.responseJson;
  const rows = Array.isArray(responseJson) ? responseJson : Array.isArray(responseJson == null ? void 0 : responseJson.content) ? responseJson.content : null;
  if ((body == null ? void 0 : body.status) === "Success" && Array.isArray(rows)) {
    return {
      rows,
      info: rows.length === 0 ? intl.formatMessage({ id: "label.paymentBilling.info.noRows" }) : ""
    };
  }
  return {
    rows: [],
    info: (body == null ? void 0 : body.message) || intl.formatMessage({ id: "label.paymentBilling.error.unexpectedResponse" })
  };
}
const PaymentDetails = () => {
  const intl = useIntl();
  const [paymentRowData, setPaymentRowData] = reactExports.useState([]);
  const [installmentRowData, setInstallmentRowData] = reactExports.useState([]);
  const [billingRowData, setBillingRowData] = reactExports.useState([]);
  const [accountDetails, setAccountDetails] = reactExports.useState({});
  const [paymentLoading, setPaymentLoading] = reactExports.useState(true);
  const [installmentLoading, setInstallmentLoading] = reactExports.useState(true);
  const [billingLoading, setBillingLoading] = reactExports.useState(true);
  const [fetchErrorMessage, setFetchErrorMessage] = reactExports.useState("");
  const [infoMessage, setInfoMessage] = reactExports.useState("");
  const [installmentInfo, setInstallmentInfo] = reactExports.useState("");
  const [billingInfo, setBillingInfo] = reactExports.useState("");
  const [paymentTotalElements, setPaymentTotalElements] = reactExports.useState(0);
  const [installmentTotalElements, setInstallmentTotalElements] = reactExports.useState(0);
  const [billingTotalElements, setBillingTotalElements] = reactExports.useState(0);
  const { selectedRow } = useSelector((state) => state.account);
  const locale = navigator.language || "en-IN";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const loadAccountPaymentData = reactExports.useCallback(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      setPaymentLoading(false);
      setInstallmentLoading(false);
      setBillingLoading(false);
      setFetchErrorMessage(
        intl.formatMessage({ id: "label.paymentBilling.error.noAccount" })
      );
      setPaymentRowData([]);
      setInstallmentRowData([]);
      setBillingRowData([]);
      setPaymentTotalElements(0);
      setInstallmentTotalElements(0);
      setBillingTotalElements(0);
      setAccountDetails({});
      return;
    }
    setPaymentLoading(true);
    setInstallmentLoading(true);
    setBillingLoading(true);
    setFetchErrorMessage("");
    setInfoMessage("");
    setInstallmentInfo("");
    setBillingInfo("");
    setAccountDetails({});
    Promise.allSettled([
      Kr.GET(PaymentAPI.Payment(screenMenuId), buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      Kr.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchInstallmentDetails`, buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      Kr.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchBillingDetails`, buildPageRequest(1, DEFAULT_GRID_PAGE_SIZE)),
      Kr.GET(OverviewAPI.getAccountDetails())
    ]).then((results) => {
      const [payResult, instResult, billResult, accountResult] = results;
      if (payResult.status === "fulfilled") {
        const res = payResult.value;
        const { rows, info } = parseListResponse(res, intl);
        const enriched = rows.map((item, index) => ({
          srNo: index + 1,
          ...item,
          szLogedInUser: "ADMIN",
          szresultcod: ""
        }));
        setPaymentRowData(enriched);
        setPaymentTotalElements(extractTotalElements(res, enriched.length));
        setInfoMessage(info);
        setFetchErrorMessage("");
      } else {
        setPaymentRowData([]);
        setPaymentTotalElements(0);
        setInfoMessage("");
        setFetchErrorMessage(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }
      if (instResult.status === "fulfilled") {
        const res = instResult.value;
        const { rows, info } = parseListResponse(res, intl);
        setInstallmentRowData(rows.map((e) => mapInstallmentGridRow(e, intl.locale)));
        setInstallmentTotalElements(extractTotalElements(res, rows.length));
        setInstallmentInfo(info);
      } else {
        setInstallmentRowData([]);
        setInstallmentTotalElements(0);
        setInstallmentInfo(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }
      if (billResult.status === "fulfilled") {
        const res = billResult.value;
        const { rows, info } = parseListResponse(res, intl);
        setBillingRowData(
          rows.map((e, index) => mapBillingGridRow(e, index, intl.locale))
        );
        setBillingTotalElements(extractTotalElements(res, rows.length));
        setBillingInfo(info);
      } else {
        setBillingRowData([]);
        setBillingTotalElements(0);
        setBillingInfo(
          intl.formatMessage({ id: "label.paymentBilling.error.generic" })
        );
      }
      if (accountResult.status === "fulfilled" && accountResult.value) {
        try {
          const { data } = parseOverviewResponse(accountResult.value);
          setAccountDetails(data || {});
        } catch {
          setAccountDetails({});
        }
      } else {
        setAccountDetails({});
      }
    }).finally(() => {
      setPaymentLoading(false);
      setInstallmentLoading(false);
      setBillingLoading(false);
    });
  }, [intl, selectedRow]);
  reactExports.useEffect(() => {
    loadAccountPaymentData();
  }, [loadAccountPaymentData]);
  const paymentDatasource = reactExports.useMemo(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) return null;
    return {
      getRows: async (params) => {
        var _a, _b;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        try {
          const res = await Kr.GET(PaymentAPI.Payment(screenMenuId), buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((item, index) => ({
            srNo: startRow + index + 1,
            ...item,
            szLogedInUser: "ADMIN",
            szresultcod: ""
          }));
          const total = extractTotalElements(res, mappedRows.length);
          setPaymentRowData(mappedRows);
          setPaymentTotalElements(total);
          setInfoMessage(info);
          setFetchErrorMessage("");
          (_a = params.successCallback) == null ? void 0 : _a.call(params, mappedRows, total);
        } catch {
          setPaymentRowData([]);
          setPaymentTotalElements(0);
          setFetchErrorMessage(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          (_b = params.failCallback) == null ? void 0 : _b.call(params);
        }
      }
    };
  }, [intl, selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO]);
  const installmentDatasource = reactExports.useMemo(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) return null;
    return {
      getRows: async (params) => {
        var _a, _b;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        try {
          const res = await Kr.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchInstallmentDetails`, buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((e) => mapInstallmentGridRow(e, intl.locale));
          const total = extractTotalElements(res, mappedRows.length);
          setInstallmentRowData(mappedRows);
          setInstallmentTotalElements(total);
          setInstallmentInfo(info);
          (_a = params.successCallback) == null ? void 0 : _a.call(params, mappedRows, total);
        } catch {
          setInstallmentRowData([]);
          setInstallmentTotalElements(0);
          setInstallmentInfo(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          (_b = params.failCallback) == null ? void 0 : _b.call(params);
        }
      }
    };
  }, [intl, selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO]);
  const billingDatasource = reactExports.useMemo(() => {
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) return null;
    return {
      getRows: async (params) => {
        var _a, _b;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || DEFAULT_GRID_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        try {
          const res = await Kr.GET(`${PaymentAPI.Payment(screenMenuId)}/fetchBillingDetails`, buildPageRequest(pageNumber, size));
          const { rows, info } = parseListResponse(res, intl);
          const mappedRows = rows.map((e, index) => mapBillingGridRow(e, startRow + index, intl.locale));
          const total = extractTotalElements(res, mappedRows.length);
          setBillingRowData(mappedRows);
          setBillingTotalElements(total);
          setBillingInfo(info);
          (_a = params.successCallback) == null ? void 0 : _a.call(params, mappedRows, total);
        } catch {
          setBillingRowData([]);
          setBillingTotalElements(0);
          setBillingInfo(intl.formatMessage({ id: "label.paymentBilling.error.generic" }));
          (_b = params.failCallback) == null ? void 0 : _b.call(params);
        }
      }
    };
  }, [intl, selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.paymentBilling.pageTitle" }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Box,
        {
          sx: {
            px: { xs: 1.5, sm: 2 },
            pb: { xs: 1.5, sm: 2 },
            pt: 0,
            maxWidth: 1320,
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PaymentAndBilling,
              {
                paymentRowData,
                installmentRowData,
                billingRowData,
                fetchErrorMessage,
                infoMessage,
                selectedRow: { ...selectedRow, ...accountDetails },
                locale
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PaymentBillingTabPanel,
              {
                paymentRowData,
                paymentLoading,
                fetchErrorMessage,
                locale,
                paymentTotalElements,
                paymentDatasource,
                paymentPageSize: DEFAULT_GRID_PAGE_SIZE,
                installmentRowData,
                installmentLoading,
                installmentInfo,
                installmentTotalElements,
                installmentDatasource,
                installmentPageSize: DEFAULT_GRID_PAGE_SIZE,
                billingRowData,
                billingLoading,
                billingInfo,
                billingTotalElements,
                billingDatasource,
                billingPageSize: DEFAULT_GRID_PAGE_SIZE
              }
            )
          ]
        }
      )
    }
  );
};
export {
  PaymentDetails as default
};
