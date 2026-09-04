import React, { useMemo } from "react";
import { Box, Chip, alpha, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { getCurrencyPrefixByLocale, HBox, HLabel, HAgGrid } from "@helix/component-library";


function statusChipSx(theme, code) {
  const c = String(code || "").toUpperCase();
  if (c === "APP" || c === "SELF") {
    return {
      bgcolor: alpha(theme.palette.success.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.success.light : theme.palette.success.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600,
    };
  }
  if (c === "PEND" || c === "NOTR") {
    return {
      bgcolor: alpha(theme.palette.warning.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600,
    };
  }
  if (c === "REJE") {
    return {
      bgcolor: alpha(theme.palette.error.main, 0.12),
      color: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark,
      border: "none",
      fontSize: 10,
      height: 22,
      fontWeight: 600,
    };
  }
  return {
    bgcolor: alpha(theme.palette.action.hover, 0.12),
    color: theme.palette.text.secondary,
    border: "none",
    fontSize: 10,
    height: 22,
    fontWeight: 600,
  };
}

function statusLabel(intl, code) {
  const c = String(code || "").toUpperCase();
  const id =
    c === "APP"
      ? "label.FeeDetails.status.APP"
      : c === "PEND"
        ? "label.FeeDetails.status.PEND"
        : c === "REJE"
          ? "label.FeeDetails.status.REJE"
          : c === "SELF"
            ? "label.FeeDetails.status.SELF"
            : c === "NOTR"
              ? "label.FeeDetails.status.NOTR"
              : null;
  if (id) return intl.formatMessage({ id, defaultMessage: code || "—" });
  return code || "—";
}

export default function FeeRequestHistoryTable({ rows = [], loading = false }) {
  const theme = useTheme();
  const intl = useIntl();
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const currencyPrefix = getCurrencyPrefixByLocale(locale);

  const formatAmount = (n) => {
    const v = Number(n);
    if (Number.isNaN(v)) return `${currencyPrefix}0`;
    return `${currencyPrefix}${v.toLocaleString(locale)}`;
  };

  const dash = "\u2014";

  const cardBorder = alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 0.9);

  const gridStyle = useMemo(
    () => ({
      width: "100%",
      height: rows.length > 8 ? "360px" : "320px",
    }),
    [rows.length],
  );

  const columnDefs = useMemo(
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
          return (
                      <Chip
                        label={
                          isCharge
                            ? intl.formatMessage({ id: "label.FeeDetails.badge.charge" })
                            : intl.formatMessage({ id: "label.FeeDetails.badge.waive" })
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 22,
                          fontSize: 10,
                          fontWeight: 600,
                          borderColor: alpha(isCharge ? theme.palette.error.main : theme.palette.success.main, 0.35),
                          color: isCharge ? theme.palette.error.main : theme.palette.success.main,
                          bgcolor: "transparent",
                        }}
                      />
          );
        },
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
        valueFormatter: (params) => formatAmount(params.value),
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
          fontSize: 12,
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Status", defaultMessage: "Status" }),
        field: "Status",
        flex: 0.95,
        // minWidth: 120,
        filter: false,
        sortable: false,
        cellStyle: { fontSize: 12 },
        cellRenderer: (params) => (
          <Chip label={statusLabel(intl, params.value)} size="small" sx={statusChipSx(theme, params.value)} />
        ),
      },
      {
        headerName: intl.formatMessage({ id: "label.FeeDetails.Decision By", defaultMessage: "DecisionBy" }),
        field: "DecisionBy",
        flex: 1,
        // minWidth: 120,
        filter: false,
        sortable: false,
        valueFormatter: (params) => params.value?.trim() || dash,
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
      },
    ],
    [currencyPrefix, dash, intl, locale, theme],
  );

  return (
    <HBox
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: cardBorder,
        boxShadow: "none",
      }}
    >
      <HBox sx={{ pb: 1, pt: 1.5, px: 2 }}>
        <HLabel
          value={intl.formatMessage({ id: "label.FeeDetails.RequestHistory" })}
          translate={false}
          align="left"
          colon={false}
          sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}
        />
      </HBox>
      <HBox sx={{ px: 0 }}>
        <HAgGrid
          rowData={rows}
          columnDefs={columnDefs}
          gridStyle={gridStyle}
          pagination={rows.length > 8}
          paginationPageSize={8}
          sort={false}
          allowUpdate={false}
          allowAdd={false}
          allowDelete={false}
          hideInternalSaveButton
          showTitle={false}
          embeddedInSection
          isLoading={loading}
          // gridClassName="drs-accounts-table-chrome"
        />
      </HBox>
    </HBox>
  );
}
