import React, { useMemo, useState } from "react";
import { Alert, Chip, CircularProgress, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import CreditCard from "@mui/icons-material/CreditCard";
import Receipt from "@mui/icons-material/Receipt";
import { useIntl } from "react-intl";
import { getCurrencyPrefixByLocale, ALIGNMENT, HBox, HLabel, HPaper, HTab, HTabs, HAgGrid } from "@helix/component-library";

import {
  PAYMENT_GRID_DELIGHT,
  formatGridDate,
  sumPaymentAmounts,
} from "./paymentBillingFormatters";


const DASH = "-";
const TAB_PAYMENTS = 0;
const TAB_INSTALLMENTS = 1;
const TAB_BILLING = 2;

const tabbedAgGridStyle = {
  width: "100%",
  height: "min(48vh, 480px)",
  minWidth: "600px",
};

const tabbedBillingGridStyle = {
  width: "100%",
  height: "min(48vh, 480px)",
  minWidth: "640px",
};

function firstDefined(obj, keys) {
  if (!obj) return undefined;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (obj[key] != null && obj[key] !== "") return obj[key];
  }
  return undefined;
}

function formatMoneyCompact(value, locale) {
  const n = value != null && value !== "" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return DASH;
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

function GridMessage({ loading, message }) {
  if (loading) {
    return (
      <HBox
        sx={{
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          background: "transparent",
        }}
      >
        <CircularProgress size={32} />
        <HLabel value="label.paymentBilling.loading" colon={false} align="center" />
      </HBox>
    );
  }

  if (!message) return null;

  return (
    <HLabel
      value={message}
      translate={false}
      colon={false}
      align="left"
      sx={{ mb: 1, fontSize: "0.8125rem" }}
    />
  );
}

function SummaryIcon({ icon: Icon, tone }) {
  const theme = useTheme();
  const paletteKey = tone === "success" ? "success" : tone === "error" ? "error" : "primary";
  const main = theme.palette[paletteKey].main;

  return (
    <HBox
      sx={{
        width: 32,
        height: 32,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        backgroundColor: alpha(main, 0.12),
      }}
    >
      <Icon sx={{ fontSize: 16, color: main }} />
    </HBox>
  );
}

function SummaryCard({ icon, tone, label, value, helper, valueColor }) {
  return (
    <HPaper variant="outlined" sx={{ borderRadius: 2, p: 1.5, minHeight: 76 }}>
      <HBox sx={{ display: "flex", alignItems: "center", gap: 1.25, background: "transparent" }}>
        <SummaryIcon icon={icon} tone={tone} />
        <HBox sx={{ minWidth: 0, background: "transparent" }}>
          <HLabel
            value={label}
            colon={false}
            align="left"
            sx={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          />
          <HLabel
            value={value}
            translate={false}
            colon={false}
            align="left"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: valueColor || "text.primary",
            }}
          />
          {helper ? (
            <HLabel
              value={helper}
              translate={false}
              colon={false}
              align="left"
              sx={{ fontSize: "10px", fontWeight: 400, mt: 0.25 }}
            />
          ) : null}
        </HBox>
      </HBox>
    </HPaper>
  );
}

function makeCurrencyFormatter(locale) {
  return (params) => {
    const prefix = getCurrencyPrefixByLocale(locale);
    const value = params.value ?? 0;
    return `${prefix}${value}`;
  };
}

export function PaymentBillingTabPanel({
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
  billingPageSize = 10,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(TAB_PAYMENTS);

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
        bgcolor: theme.palette.action.hover,
      },
      "&.Mui-selected": {
        color: "text.primary",
        fontWeight: 600,
        bgcolor: theme.palette.background.paper,
      },
    },
    "& .MuiTabs-flexContainer": {
      alignItems: "center",
    },
    "& .MuiTabs-indicator": {
      display: "none",
    },
  };

  const cardSx = {
    borderRadius: 2,
    overflow: "hidden",
    borderColor: "divider",
    border: 1,
    borderStyle: "solid",
    bgcolor: "background.paper",
  };

  const panelPadding = (loading, rowCount) => (loading && rowCount === 0 ? 2 : 0);
  const panelBg =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.03)"
      : "rgba(15, 23, 42, 0.03)";
  const paymentCount = Number.isFinite(Number(paymentTotalElements))
    ? Number(paymentTotalElements)
    : paymentRowData.length;
  const installmentCount = Number.isFinite(Number(installmentTotalElements))
    ? Number(installmentTotalElements)
    : installmentRowData.length;
  const billingCount = Number.isFinite(Number(billingTotalElements))
    ? Number(billingTotalElements)
    : billingRowData.length;

  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
        background: "transparent",
      }}
    >
      <HPaper
        variant="outlined"
        sx={{
          borderRadius: 999,
          borderColor: "divider",
          bgcolor: theme.palette.mode === "dark" ? "background.paper" : "grey.100",
          mb: 1,
          px: 0.5,
          py: 0.5,
        }}
      >
        <HTabs
          value={activeTab}
          onChange={(_, next) => setActiveTab(next)}
          variant="standard"
          sx={tabsSx}
          TabIndicatorProps={{ style: { display: "none" } }}
          aria-label={intl.formatMessage({ id: "label.paymentBilling.tabs.aria" })}
        >
          <HTab label={`${intl.formatMessage({ id: "label.paymentBilling.section.payment" })} (${paymentCount})`} />
          <HTab label={`${intl.formatMessage({ id: "label.paymentBilling.section.installments" })} (${installmentCount})`} />
          <HTab label={`${intl.formatMessage({ id: "label.paymentBilling.section.billing" })} (${billingCount})`} />
        </HTabs>
      </HPaper>

      <HBox sx={{ pt: 1.5, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "transparent" }}>
        {activeTab === TAB_PAYMENTS ? (
          <HPaper variant="outlined" sx={cardSx} component="section">
            <HBox sx={{ p: panelPadding(paymentLoading, paymentRowData.length), bgcolor: panelBg }}>
              <PaymentSectionGrid
                paymentRowData={paymentRowData}
                paymentLoading={paymentLoading}
                fetchErrorMessage={fetchErrorMessage}
                locale={locale}
                agGridStyle={tabbedAgGridStyle}
                paymentDatasource={paymentDatasource}
                paymentPageSize={paymentPageSize}
              />
            </HBox>
          </HPaper>
        ) : null}

        {activeTab === TAB_INSTALLMENTS ? (
          <HPaper variant="outlined" sx={cardSx} component="section">
            <HBox sx={{ p: panelPadding(installmentLoading, installmentRowData.length), bgcolor: panelBg }}>
              <InstallmentSectionGrid
                installmentRowData={installmentRowData}
                installmentLoading={installmentLoading}
                installmentInfo={installmentInfo}
                locale={locale}
                agGridStyle={tabbedAgGridStyle}
                installmentDatasource={installmentDatasource}
                installmentPageSize={installmentPageSize}
              />
            </HBox>
          </HPaper>
        ) : null}

        {activeTab === TAB_BILLING ? (
          <HPaper variant="outlined" sx={cardSx} component="section">
            <HBox sx={{ p: panelPadding(billingLoading, billingRowData.length), bgcolor: panelBg }}>
              <BillingSectionGrid
                billingRowData={billingRowData}
                billingLoading={billingLoading}
                billingInfo={billingInfo}
                locale={locale}
                agGridStyle={tabbedBillingGridStyle}
                billingDatasource={billingDatasource}
                billingPageSize={billingPageSize}
              />
            </HBox>
          </HPaper>
        ) : null}
      </HBox>
    </HBox>
  );
}

export default function PaymentAndBilling({
  paymentRowData = [],
  fetchErrorMessage,
  infoMessage,
  selectedRow,
  locale,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const totalPaid = useMemo(() => sumPaymentAmounts(paymentRowData), [paymentRowData]);

  const nextDueAmount = firstDefined(selectedRow, [
    "bdNextDueAmt",
    "BD_NEXT_DUE_AMT",
    "bdNydAmount",
    "NYD_AMOUNT",
  ]);
  const nextDueDate = firstDefined(selectedRow, [
    "dtNextDueDate",
    "DT_NEXT_DUE_DATE",
    "dtNextDue",
  ]);
  const paidInst = firstDefined(selectedRow, ["inPaidInst", "IN_PAID_INST", "paidInst"]);
  const totalInst = firstDefined(selectedRow, ["inTotalInst", "IN_TOTAL_INST", "totalInst"]);

  const nextDueAmountStr =
    nextDueAmount != null
      ? `${getCurrencyPrefixByLocale(locale)}${formatMoneyCompact(nextDueAmount, intl.locale)}`
      : DASH;
  const nextDueDateStr = nextDueDate != null ? formatGridDate(nextDueDate, intl.locale) : null;
  const installmentProgressStr =
    paidInst != null && totalInst != null
      ? intl.formatMessage(
          { id: "label.paymentBilling.summary.installmentsRatio" },
          { paid: paidInst, total: totalInst },
        )
      : DASH;
  const totalPaidDisplay = `${getCurrencyPrefixByLocale(locale)}${formatMoneyCompact(totalPaid, intl.locale)}`;

  return (
    <HBox sx={{ display: "flex", flexDirection: "column", width: "100%", background: "transparent" }}>
      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
          mb: 2,
          background: "transparent",
        }}
      >
        <SummaryCard
          icon={CreditCard}
          tone="success"
          label="label.paymentBilling.summary.totalPaid"
          value={totalPaidDisplay}
          valueColor={PAYMENT_GRID_DELIGHT.success}
        />
        <SummaryCard
          icon={CalendarMonth}
          tone="error"
          label="label.paymentBilling.summary.nextDue"
          value={nextDueAmountStr}
          valueColor={theme.palette.error.main}
          helper={
            nextDueDateStr
              ? intl.formatMessage(
                  { id: "label.paymentBilling.summary.nextDueOnDate" },
                  { date: nextDueDateStr },
                )
              : intl.formatMessage({ id: "label.paymentBilling.summary.notAvailable" })
          }
        />
        <SummaryCard
          icon={Receipt}
          tone="primary"
          label="label.paymentBilling.summary.installments"
          value={installmentProgressStr}
          helper={intl.formatMessage({ id: "label.paymentBilling.summary.paidSuffix" })}
        />
      </HBox>

      {fetchErrorMessage ? (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {fetchErrorMessage}
        </Alert>
      ) : null}
      {infoMessage ? (
        <Alert severity="info" sx={{ mb: 1.5 }}>
          {infoMessage}
        </Alert>
      ) : null}
    </HBox>
  );
}

export function PaymentSectionGrid({
  paymentRowData = [],
  paymentLoading,
  fetchErrorMessage,
  locale,
  agGridStyle,
  paymentDatasource,
  paymentPageSize = 10,
}) {
  const intl = useIntl();
  const theme = useTheme();

  const paymentColumnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.Payment.SrNo" }),
        field: "srNo",
        maxWidth: 120,
        cellStyle: { textAlign: ALIGNMENT.NUMBER, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.TransactionDate" }),
        field: "dtTranDate",
        type: "date",
        flex: 1,
        cellStyle: { textAlign: ALIGNMENT.DATE, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agDateColumnFilter",
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.ValueDate" }),
        field: "dtValueDate",
        type: "date",
        flex: 1,
        cellStyle: { textAlign: ALIGNMENT.DATE, fontSize: "12px", color: theme.palette.text.primary },
        sortable: true,
        filter: "agDateColumnFilter",
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.Amount" }),
        field: "bdAmount",
        flex: 1,
        cellStyle: {
          textAlign: ALIGNMENT.CURRENCY,
          fontSize: "12px",
          fontWeight: 600,
          color: PAYMENT_GRID_DELIGHT.success,
        },
        sortable: true,
        filter: "agNumberColumnFilter",
        valueFormatter: makeCurrencyFormatter(locale),
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.TransactionCode" }),
        field: "szTransactionCode",
        flex: 1,
        cellStyle: {
          textAlign: ALIGNMENT.TEXT,
          fontSize: "12px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          color: theme.palette.text.primary,
        },
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: intl.formatMessage({ id: "label.Payment.Narration" }),
        field: "szNarration",
        flex: 1,
        cellStyle: { textAlign: ALIGNMENT.TEXT, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.mutedForeground },
        sortable: true,
        filter: "agTextColumnFilter",
        tooltipField: "szNarration",
        cellRenderer: (params) => {
          const value = params.value;
          if (value && String(value).length > 50) return `${String(value).substring(0, 50)}...`;
          return value;
        },
      },
    ],
    [intl, locale, theme.palette.text.primary],
  );

  return (
    <HBox sx={{ background: "transparent" }}>
      {!fetchErrorMessage && paymentRowData.length === 0 && !paymentLoading ? (
        <GridMessage message={intl.formatMessage({ id: "label.paymentBilling.empty.payments" })} />
      ) : null}
      <HAgGrid
        rowData={paymentRowData}
        columnDefs={paymentColumnDefs}
        gridStyle={agGridStyle ?? tabbedAgGridStyle}
        rowModelType="infinite"
        datasource={paymentDatasource}
        cacheBlockSize={paymentPageSize}
        maxBlocksInCache={2}
        pagination
        paginationPageSize={paymentPageSize}
        domLayout="normal"
        sort
        allowUpdate={false}
        hideInternalSaveButton
      />
    </HBox>
  );
}

export function InstallmentSectionGrid({
  installmentRowData = [],
  installmentLoading,
  installmentInfo,
  locale,
  agGridStyle,
  installmentDatasource,
  installmentPageSize = 10,
}) {
  const intl = useIntl();
  const theme = useTheme();

  const installmentColumnDefs = useMemo(
    () => [
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.sr" }), field: "sr", maxWidth: 100, cellStyle: { textAlign: ALIGNMENT.NUMBER, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.dueDate" }), field: "dueDate", type: "date", flex: 1, cellStyle: { textAlign: ALIGNMENT.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.dueAmount" }), field: "dueAmount", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      {
        headerName: intl.formatMessage({ id: "label.paymentBilling.installments.status" }),
        field: "status",
        flex: 1,
        cellStyle: { textAlign: ALIGNMENT.TEXT, fontSize: "12px" },
        cellRenderer: (params) => {
          const rawValue = params.value;
          const normalizedValue = String(rawValue ?? "").trim();
          const key = normalizedValue.toLowerCase();

          if (!normalizedValue || key === "null" || key === "undefined" || key === "n/a") {
            return <span>{DASH}</span>;
          }

          const statusMap = {
            paid: {
              label: "Paid",
              sx: {
                color: "#22c55e",
                bgcolor: "#e8f8ef",
              },
            },
            pd: {
              label: "Paid",
              sx: {
                color: "#22c55e",
                bgcolor: "#e8f8ef",
              },
            },
            overdue: {
              label: "Overdue",
              sx: {
                color: "#ef4444",
                bgcolor: "#fdecec",
              },
            },
            ovd: {
              label: "Overdue",
              sx: {
                color: "#ef4444",
                bgcolor: "#fdecec",
              },
            },
            upcoming: {
              label: "Upcoming",
              sx: {
                color: "#f59e0b",
                bgcolor: "#fff4e5",
              },
            },
            upc: {
              label: "Upcoming",
              sx: {
                color: "#f59e0b",
                bgcolor: "#fff4e5",
              },
            },
          };

          const statusConfig = statusMap[key];
          if (!statusConfig) {
            return (
              <Chip
                label={normalizedValue}
                size="small"
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  height: 24,
                  borderRadius: "999px",
                  color: "#475569",
                  bgcolor: "#eef2f7",
                }}
              />
            );
          }

          return (
            <Chip
              label={statusConfig.label}
              size="small"
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                height: 24,
                borderRadius: "999px",
                ...statusConfig.sx,
              }}
            />
          );
        },
      },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.principal" }), field: "principal", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.interest" }), field: "interest", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.installments.other" }), field: "other", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
    ],
    [intl, locale, theme.palette.text.primary],
  );

  return (
    <HBox sx={{ background: "transparent" }}>
      {installmentInfo && !installmentLoading ? <GridMessage message={installmentInfo} /> : null}
      <HAgGrid
        rowData={installmentRowData}
        columnDefs={installmentColumnDefs}
        gridStyle={agGridStyle ?? tabbedAgGridStyle}
        rowModelType="infinite"
        datasource={installmentDatasource}
        cacheBlockSize={installmentPageSize}
        maxBlocksInCache={2}
        pagination
        paginationPageSize={installmentPageSize}
        domLayout="normal"
        sort
        allowUpdate={false}
        hideInternalSaveButton
      />
    </HBox>
  );
}

export function BillingSectionGrid({
  billingRowData = [],
  billingLoading,
  billingInfo,
  locale,
  agGridStyle,
  billingDatasource,
  billingPageSize = 10,
}) {
  const intl = useIntl();
  const theme = useTheme();

  const billingColumnDefs = useMemo(
    () => [
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.sr" }), field: "sr", maxWidth: 90, cellStyle: { textAlign: ALIGNMENT.NUMBER, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.date" }), field: "date", type: "date", flex: 1, cellStyle: { textAlign: ALIGNMENT.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.billAmt" }), field: "billAmt", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.dueDate" }), field: "dueDate", type: "date", flex: 1, cellStyle: { textAlign: ALIGNMENT.DATE, fontSize: "12px", color: theme.palette.text.primary } },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.dueAmt" }), field: "dueAmt", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.error.main }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.prevBal" }), field: "prevBalance", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.freshPurchase" }), field: "freshPurchase", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.otherDebits" }), field: "otherDebits", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: theme.palette.text.primary }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.paymentRcvd" }), field: "paymentReceived", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.success }, valueFormatter: makeCurrencyFormatter(locale) },
      { headerName: intl.formatMessage({ id: "label.paymentBilling.billing.otherCredits" }), field: "otherCredits", flex: 1, cellStyle: { textAlign: ALIGNMENT.CURRENCY, fontSize: "12px", color: PAYMENT_GRID_DELIGHT.success }, valueFormatter: makeCurrencyFormatter(locale) },
    ],
    [intl, locale, theme.palette.error.main, theme.palette.text.primary],
  );

  return (
    <HBox sx={{ background: "transparent" }}>
      {billingInfo && !billingLoading ? <GridMessage message={billingInfo} /> : null}
      <HAgGrid
        rowData={billingRowData}
        columnDefs={billingColumnDefs}
        gridStyle={agGridStyle ?? tabbedBillingGridStyle}
        rowModelType="infinite"
        datasource={billingDatasource}
        cacheBlockSize={billingPageSize}
        maxBlocksInCache={2}
        pagination
        paginationPageSize={billingPageSize}
        domLayout="normal"
        sort
        allowUpdate={false}
        hideInternalSaveButton
      />
    </HBox>
  );
}
