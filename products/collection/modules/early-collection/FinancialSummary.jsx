import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import TrendingUp from "@mui/icons-material/TrendingUp";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, ALIGNMENT, HBox, HLabel, HPaper, useDrsTheme, HAgGrid, getCurrencyPrefixByLocale } from "@helix/component-library";


import { FinancialSummaryAPI } from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";


import { useLocation } from "react-router-dom";
const DASH = "\u2013";

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function firstDefined(obj, keys) {
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    if (obj[k] != null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

/**
 * Normalizes API row (camelCase or legacy sz/bd prefixes) into view model.
 */
function mapFinancialSummaryRow(item, index) {
  const odAmt = num(firstDefined(item, ["bdOdAmount", "bdOdAmt"]));
  const nydAmt = num(firstDefined(item, ["bdNYDAmount", "bdNydAmount"]));
  const osAmt = num(firstDefined(item, ["bdOsAmount", "bdOSAmount", "szOsAmount"]));
  const paidAmt = num(firstDefined(item, ["bdPaidAmount", "szPaidAmount"]));
  const waivedAmt = num(firstDefined(item, ["bdWaivedAmount", "szWaivedAmount"]));
  const totalRaw = firstDefined(item, ["bdTotalAmount", "szTotalAmount"]);
  const totalFromApi = totalRaw != null && totalRaw !== "" ? num(totalRaw) : null;
  const computedTotal = odAmt + nydAmt + osAmt + paidAmt + waivedAmt;
  const totalAmt =
    totalFromApi !== null && Number.isFinite(totalFromApi) ? totalFromApi : computedTotal;

  const feeType = String(firstDefined(item, ["szFeeType", "feeType"]) ?? "").trim();
  const feeDescRaw = firstDefined(item, ["szFeeDesc", "szFeeDescription", "feeDescription"]);
  const feeDescription = feeDescRaw != null ? String(feeDescRaw).trim() : "";

  return {
    srNo: index + 1,
    feeType,
    feeDescription,
    odAmt,
    nydAmt,
    osAmt,
    paidAmt,
    waivedAmt,
    totalAmt,
  };
}

function extractRowsFromResponse(data) {
  if (!data) return null;
  const raw = data.responseJson ?? data.responsejson;
  if (Array.isArray(raw)) return raw;
  return null;
}

function SummaryMetricCard({ label, valueText, valueColor, endAdornment, borderColor }) {
  return (
    <HPaper
      variant="outlined"
      sx={{
        borderRadius: "8px",
        borderColor,
        px: 1.5,
        py: 1.25,
        minHeight: 68,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0.35,
        boxShadow: 1,
      }}
    >
      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 16, background: "transparent" }}>
        <HLabel
          component="p"
          value={label}
          translate={false}
          colon={false}
          align="left"
          sx={{
            fontSize: 10,
            lineHeight: 1.2,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "text.secondary",
            flex: 1,
          }}
        />
        {endAdornment}
      </HBox>
      <HLabel
        value={valueText}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontWeight: 800,
          fontSize: "1.125rem",
          lineHeight: 1.2,
          color: valueColor,
        }}
      />
    </HPaper>
  );
}

const FinancialSummary = () => {
  const intl = useIntl();
  const { theme, surfaces, text, border } = useDrsTheme();
  const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
  const { selectedRow } = useSelector((state) => state.account);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const accountKey = selectedRow?.ACNT_SEQNO ?? selectedRow?.acnt_seqno;

  const formatCurrency = useCallback(
    (amount) => {
      const prefix = getCurrencyPrefixByLocale(locale);
      const n = num(amount);
      return `${prefix}${n.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
    },
    [locale]
  );

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        odAmt: acc.odAmt + r.odAmt,
        nydAmt: acc.nydAmt + r.nydAmt,
        osAmt: acc.osAmt + r.osAmt,
        paidAmt: acc.paidAmt + r.paidAmt,
        waivedAmt: acc.waivedAmt + r.waivedAmt,
        totalAmt: acc.totalAmt + r.totalAmt,
      }),
      { odAmt: 0, nydAmt: 0, osAmt: 0, paidAmt: 0, waivedAmt: 0, totalAmt: 0 }
    );
  }, [rows]);

  const gridRowData = useMemo(() => {
    if (!rows.length) return [];
    const footerLabel = intl.formatMessage({ id: "label.financialSummary.footer.total" });
    const footerRow = {
      _footer: true,
      gridRowId: "financial-summary-footer",
      srNo: "",
      feeType: "",
      feeDescription: footerLabel,
      odAmt: totals.odAmt,
      nydAmt: totals.nydAmt,
      osAmt: totals.osAmt,
      paidAmt: totals.paidAmt,
      waivedAmt: totals.waivedAmt,
      totalAmt: totals.totalAmt,
    };
    return [...rows, footerRow];
  }, [rows, totals, intl]);

  const compactCell = useMemo(
    () => ({
      fontSize: "12px",
      lineHeight: "38px",
      fontFamily: "'Inter', sans-serif",
    }),
    []
  );

  const columnDefs = useMemo(() => {
    const { error, warning, success } = theme.palette;
    const secondary = text.secondary;
    const primary = text.primary;
    const headerStyle = {
      backgroundColor: surfaces.panel,
      color: text.secondary,
      fontSize: "11px",
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
    };

    const fmt = (amount) => {
      const prefix = getCurrencyPrefixByLocale(locale);
      const n = num(amount);
      return `${prefix}${n.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
    };

    const naLabel = intl.formatMessage({ id: "label.common.na", defaultMessage: "N/A" });

    return [
      {
        headerName: intl.formatMessage({ id: "label.common.srNo" }),
        field: "srNo",
        width: 72,
        filter: false,
        sortable: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT },
        cellRenderer: (params) => {
          if (params.data?._footer) return null;
          return <span style={{ color: primary }}>{params.data?.srNo}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.feeType" }),
        field: "feeType",
        flex: 1,
        minWidth: 88,
        filter: false,
        headerStyle,
        cellStyle: {
          ...compactCell,
          textAlign: ALIGNMENT.TEXT,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontWeight: 500,
        },
        cellRenderer: (params) => {
          if (params.data?._footer) return null;
          const v = params.data?.feeType;
          return (
            <span style={{ color: v ? primary : secondary }}>
              {v || DASH}
            </span>
          );
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.feeDescription" }),
        field: "feeDescription",
        flex: 1,
        minWidth: 120,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT },
        cellRenderer: (params) => {
          const d = params.data;
          if (d?._footer) {
            return <span style={{ fontWeight: 600, color: primary }}>{d.feeDescription}</span>;
          }
          const v = d?.feeDescription;
          return <span style={{ color: primary }}>{v || naLabel}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.odAmt" }),
        field: "odAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.odAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: error.main }}>{fmt(v)}</span>;
          }
          if (v <= 0) {
            return <span style={{ fontWeight: 500, color: secondary }}>{DASH}</span>;
          }
          return <span style={{ fontWeight: 500, color: error.main }}>{fmt(v)}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.nydAmt" }),
        field: "nydAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.nydAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: warning.main }}>{fmt(v)}</span>;
          }
          if (v <= 0) {
            return <span style={{ color: secondary }}>{DASH}</span>;
          }
          return <span style={{ color: warning.main }}>{fmt(v)}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.osAmt" }),
        field: "osAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.osAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: primary }}>{fmt(v)}</span>;
          }
          if (v <= 0) {
            return <span style={{ fontWeight: 500, color: secondary }}>{DASH}</span>;
          }
          return <span style={{ fontWeight: 500, color: primary }}>{fmt(v)}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.paidAmt" }),
        field: "paidAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.paidAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: success.main }}>{fmt(v)}</span>;
          }
          return <span style={{ color: success.main }}>{fmt(v)}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.waivedAmt" }),
        field: "waivedAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.waivedAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: primary }}>{fmt(v)}</span>;
          }
          if (v <= 0) {
            return <span style={{ color: primary }}>{DASH}</span>;
          }
          return <span style={{ color: primary }}>{fmt(v)}</span>;
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.common.totalAmt" }),
        field: "totalAmt",
        flex: 1,
        minWidth: 100,
        filter: false,
        headerStyle,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.CURRENCY },
        cellRenderer: (params) => {
          const d = params.data;
          const v = num(d?.totalAmt);
          if (d?._footer) {
            return <span style={{ fontWeight: 700, color: primary }}>{fmt(v)}</span>;
          }
          return <span style={{ fontWeight: 600, color: primary }}>{fmt(v)}</span>;
        },
      },
    ];
  }, [compactCell, intl, locale, surfaces.panel, text.primary, text.secondary, theme.palette]);

  useEffect(() => {
    if (accountKey == null || accountKey === "") {
      setRows([]);
      setIsEmpty(false);
      setErrorMessage(intl.formatMessage({ id: "label.financialSummary.error.noAccount" }));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);
    setIsEmpty(false);

    HAxiosService.GET(FinancialSummaryAPI.FinancialSummary(screenMenuId))
      .then((res) => {
        if (cancelled) return;

        if (res.status === 204) {
          setRows([]);
          setIsEmpty(true);
          return;
        }

        if (res.status < 200 || res.status >= 300) {
          setRows([]);
          setIsEmpty(false);
          setErrorMessage(intl.formatMessage({ id: "label.financialSummary.error.generic" }));
          return;
        }

        const data = res.data;
        const list = extractRowsFromResponse(data);

        if (list != null) {
          if (list.length === 0) {
            setRows([]);
            setIsEmpty(true);
            return;
          }
          const mapped = list.map((item, index) => mapFinancialSummaryRow(item, index));
          setRows(mapped);
          setIsEmpty(false);
          return;
        }

        const statusOk = typeof data?.status === "string" && data.status.toLowerCase() === "success";
        if (!statusOk && data?.message) {
          setRows([]);
          setIsEmpty(false);
          setErrorMessage(String(data.message));
          return;
        }

        setRows([]);
        setIsEmpty(false);
        setErrorMessage(intl.formatMessage({ id: "label.financialSummary.error.unexpected" }));
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setIsEmpty(false);
        setErrorMessage(intl.formatMessage({ id: "label.financialSummary.error.generic" }));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accountKey, intl]);

  const title = intl.formatMessage({ id: "label.earlyCollection.financialSummary" });

  const gridStyle = useMemo(
    () => ({
      width: "100%",
      minHeight: 260,
      height: "min(52vh, 520px)",
    }),
    []
  );

  return (
    <FunctionLayout title={title}>
      <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          height: "100%",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <HBox
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "auto",
            pt: 1,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            background: "transparent",
          }}
        >
          {loading && (
            <HBox
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                py: 4,
                background: "transparent",
              }}
            >
              <CircularProgress size={32} aria-label={intl.formatMessage({ id: "label.financialSummary.loading" })} />
              <HLabel
                value={intl.formatMessage({ id: "label.financialSummary.loading" })}
                translate={false}
                colon={false}
                align="center"
                sx={{ fontSize: 13 }}
              />
            </HBox>
          )}

          {!loading && errorMessage && !rows.length && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {!loading && !errorMessage && isEmpty && (
            <HLabel
              value={intl.formatMessage({ id: "label.financialSummary.empty" })}
              translate={false}
              colon={false}
              align="center"
              sx={{ py: 3, fontSize: 13 }}
            />
          )}

          {!loading && rows.length > 0 && (
            <>
              <HBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                  gap: 1.5,
                  background: "transparent",
                }}
              >
                <SummaryMetricCard
                  label={intl.formatMessage({ id: "label.financialSummary.card.totalOd" })}
                  valueText={formatCurrency(totals.odAmt)}
                  valueColor={theme.palette.error.main}
                  borderColor={border.divider}
                />
                <SummaryMetricCard
                  label={intl.formatMessage({ id: "label.financialSummary.card.outstanding" })}
                  valueText={formatCurrency(totals.osAmt)}
                  valueColor={theme.palette.warning.main}
                  borderColor={border.divider}
                />
                <SummaryMetricCard
                  label={intl.formatMessage({ id: "label.financialSummary.card.totalPaid" })}
                  valueText={formatCurrency(totals.paidAmt)}
                  valueColor={theme.palette.success.main}
                  borderColor={border.divider}
                />
                <SummaryMetricCard
                  label={intl.formatMessage({ id: "label.financialSummary.card.totalAmount" })}
                  valueText={formatCurrency(totals.totalAmt)}
                  valueColor={text.primary}
                  borderColor={border.divider}
                  endAdornment={<TrendingUp sx={{ fontSize: 12, color: text.secondary }} aria-hidden />}
                />
              </HBox>

              <HPaper variant="outlined" sx={{ borderRadius: "8px", borderColor: border.divider, overflow: "hidden" }}>
                <HBox sx={{ px: 2, pt: 1.5, pb: 1, background: surfaces.paper }}>
                  <HLabel
                    value={intl.formatMessage({ id: "label.financialSummary.section.paymentHeadBreakdown" })}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{ fontSize: "0.75rem", fontWeight: 700, color: text.primary }}
                  />
                </HBox>
                <HBox
                  sx={{
                    px: 1,
                    pb: 1,
                    background: surfaces.paper,
                    "& .ag-row.ag-row-level-0:last-child": {
                      borderTopWidth: 1,
                      borderTopStyle: "solid",
                      borderTopColor: border.divider,
                    },
                  }}
                >
                  <HAgGrid
                    rowData={gridRowData}
                    columnDefs={columnDefs}
                    gridStyle={gridStyle}
                    pagination={false}
                    sort={false}
                    hideInternalSaveButton
                  />
                </HBox>
              </HPaper>
            </>
          )}
        </HBox>
      </HBox>
    </FunctionLayout>
  );
};

export default FinancialSummary;
