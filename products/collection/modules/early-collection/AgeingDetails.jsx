import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, HBox, HButton, useToast, getCurrencyPrefixByLocale } from "@helix/component-library";

import { AgeingAPI } from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";

import { FiAlertTriangle } from "react-icons/fi";
import { useLocation } from "react-router-dom";



function parseAmount(raw) {
  if (raw == null || raw === "") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/** Merge duplicate bucket codes by summing amounts (defensive for view/id quirks). */
function mapResponseToRows(responseJson) {
  if (!Array.isArray(responseJson)) return [];
  const byCode = new Map();
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
    amount: r.amount,
  }));
}

/** Interface Delight–style segment colour: current bucket success, mid warning, older error. */
function segmentBackground(srNo, theme) {
  if (srNo === 1) return theme.palette.success.main;
  if (srNo <= 3) return theme.palette.warning.main;
  return theme.palette.error.main;
}

function BucketDistributionCard({ rows, totalSum, intl, locale, currencyPrefix, theme }) {
  const headerBg =
    theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.grey[900], 0.035);
  const tooltipTitle = intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.tooltip" });
  const infoAria = intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.tooltip" });

  const segments = useMemo(() => {
    if (!totalSum || totalSum <= 0) return [];
    return rows
      .map((row) => {
        const amt = Number(row.amount) || 0;
        const pct = totalSum > 0 ? (amt / totalSum) * 100 : 0;
        return { row, amt, pct };
      })
      .filter(({ amt, pct }) => amt > 0 && pct > 0);
  }, [rows, totalSum]);

  return (
    <Paper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", mb: 2, overflow: "hidden" }}>
      <Box
        sx={{
          py: 1.25,
          px: 2,
          bgcolor: headerBg,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.75rem", color: "text.primary" }}>
            {intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.title" })}
          </Typography>
          <Tooltip title={tooltipTitle} arrow placement="top">
            <IconButton size="small" aria-label={infoAria} sx={{ p: 0.25, color: "text.secondary" }}>
              <InfoOutlined sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Box sx={{ px: 2, pb: 1.5, pt: 1.5 }}>
        {!totalSum || totalSum <= 0 ? (
          <Typography variant="caption" sx={{ fontSize: 11, color: "text.secondary" }}>
            {intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.emptyBar" })}
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: "4px", height: 32, borderRadius: 1, overflow: "hidden" }}>
              {segments.map(({ row, amt, pct }) => {
                const tip = (
                  <Stack spacing={0.25}>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 11 }}>
                      {row.description || row.bucketCode}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 11 }}>
                      {`${currencyPrefix}${amt.toLocaleString(locale)} (${Math.round(pct)}%)`}
                    </Typography>
                  </Stack>
                );
                return (
                  <Tooltip key={row.srNo} title={tip} arrow>
                    <Box
                      component="span"
                      sx={{
                        width: `${pct}%`,
                        minWidth: pct > 0 ? 24 : 0,
                        height: "100%",
                        bgcolor: segmentBackground(row.srNo, theme),
                        display: "block",
                        transition: "width 0.2s ease",
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
              <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                {intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.axisStart" })}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary", textAlign: "right", maxWidth: "50%" }} noWrap>
                {intl.formatMessage({ id: "label.AgeingDetails.bucketDistribution.axisEnd" })}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}

function AgeingSummaryCards({ totalOverdue, currentBucket, rollBackAmount, intl, locale, currencyPrefix, theme }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: { xs: "wrap", md: "nowrap" } }}>
      <Paper variant="outlined" sx={{ flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          TOTAL OVERDUE
        </Typography>
        <Typography variant="h5" sx={{ color: theme.palette.error.main, fontWeight: 700, mt: 0.5 }}>
          {currencyPrefix}{totalOverdue.toLocaleString(locale)}
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          CURRENT BUCKET
        </Typography>
        <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 700, mt: 0.5 }}>
          {currentBucket}
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ flex: 1, minWidth: { xs: "100%", md: "30%" }, p: 2, borderRadius: 2, borderColor: "divider" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          TO ROLL BACK 1 BUCKET
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <TrendingDownIcon sx={{ color: theme.palette.success.main, fontSize: 22 }} />
          <Typography variant="h5" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
            {currencyPrefix}{rollBackAmount.toLocaleString(locale)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

const AgeingDetails = () => {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();
  const locale = navigator.language;
  const currencyPrefix = getCurrencyPrefixByLocale(locale);
  const { selectedRow } = useSelector((state) => state.account);

  const accountSeqNo = selectedRow?.ACNT_SEQNO ?? selectedRow?.acnt_seqno;
  const partitionCode = selectedRow?.PARTITION_CODE || selectedRow?.szPartitionCode || "001";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  /** null | 'load' | 'empty' | 'noAccount' */
  const [surface, setSurface] = useState(null);

  const formatCurrencyCell = useCallback(
    (amount) => {
      if (!amount || amount === 0) {
        return intl.formatMessage({ id: "label.AgeingDetails.dash" });
      }
      const formatted = Number(amount).toLocaleString(locale);
      return `${currencyPrefix}${formatted}`;
    },
    [currencyPrefix, intl, locale]
  );

  const loadAgeing = useCallback(async () => {
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
      inPageNumber: 0,
    };

    try {
      const url = AgeingAPI.AgeingDetails(screenMenuId);
      const res = await HAxiosService.GET(url, {
    params: payload
  });
      const status = res.status;
      const data = res.data ?? {};

      if (status === 204 || (data.status === "Failure" && String(data.message || "").toLowerCase().includes("no data"))) {
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
      toast?.warning?.(intl.formatMessage({ id: "label.AgeingDetails.error.unexpected" }));
      // eslint-disable-next-line no-console
      console.warn("AgeingDetails: unexpected response shape", data);
    } catch (e) {
      setRows([]);
      setSurface("load");
      // eslint-disable-next-line no-console
      console.error("AgeingDetails API error", e);
    } finally {
      setLoading(false);
    }
  }, [accountSeqNo, intl, partitionCode, toast]);

  useEffect(() => {
    loadAgeing();
  }, [loadAgeing]);

  const totalAllBuckets = useMemo(() => rows.reduce((s, r) => s + (Number(r.amount) || 0), 0), [rows]);

  const worstBucketRow = useMemo(() => [...rows].reverse().find(r => r.amount > 0), [rows]);
  const rollbackBucketNumber = worstBucketRow?.bucketCode ? Number(worstBucketRow.bucketCode) : null;
  const currentBucketStr = selectedRow?.szBucket || selectedRow?.BKT || worstBucketRow?.bucketCode || "-";

  const rollBackAmt = useMemo(() => {
    if (rows.length >= 2) {
      const last = Number(rows[rows.length - 1].amount) || 0;
      const secondLast = Number(rows[rows.length - 2].amount) || 0;
      return Math.abs(last - secondLast);
    }
    return rows.length === 1 ? (Number(rows[0].amount) || 0) : 0;
  }, [rows]);

  const totalToBucketOne = useMemo(() => {
    if (rows.length >= 2) {
      const last = Number(rows[rows.length - 1].amount) || 0;
      const first = Number(rows[0].amount) || 0;
      return Math.abs(last - first);
    }
    return rows.length === 1 ? (Number(rows[0].amount) || 0) : 0;
  }, [rows]);

  const headerBg = theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.grey[900], 0.06);
  const zebraBg = theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.04) : alpha(theme.palette.grey[900], 0.04);

  const tableAria = intl.formatMessage({ id: "label.AgeingDetails.table.aria" });

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.AgeingDetails.title" })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <Box
        className="drs-page-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          px: { xs: 1.5, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
          pt: 0,
          maxWidth: 1320,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            mt: 0,
          }}
        >
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1, flexShrink: 0 }}>
            <HButton
              id="ageing-refresh"
              label="label.AgeingDetails.refresh"
              variant="outlined"
              size="small"
              onClick={() => loadAgeing()}
              disabled={loading || !accountSeqNo}
              loading={loading}
              align="right"
            />
          </Stack>

          {loading && rows.length === 0 && accountSeqNo && surface !== "noAccount" ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }} aria-busy="true">
              <CircularProgress size={32} aria-label={intl.formatMessage({ id: "label.AgeingDetails.loading" })} />
            </Box>
          ) : null}

          {surface === "noAccount" ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {intl.formatMessage({ id: "label.AgeingDetails.noAccount" })}
            </Alert>
          ) : null}

          {surface === "load" ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {intl.formatMessage({ id: "label.AgeingDetails.error.loadFailed" })}
            </Alert>
          ) : null}

          {surface === "empty" && !loading ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {intl.formatMessage({ id: "label.AgeingDetails.empty" })}
            </Alert>
          ) : null}

          {!loading && rows.length > 0 ? (
            <Stack spacing={0}>
              <AgeingSummaryCards
                totalOverdue={totalAllBuckets}
                currentBucket={currentBucketStr}
                rollBackAmount={rollBackAmt}
                intl={intl}
                locale={locale}
                currencyPrefix={currencyPrefix}
                theme={theme}
              />
              <BucketDistributionCard
                rows={rows}
                totalSum={totalAllBuckets}
                intl={intl}
                locale={locale}
                currencyPrefix={currencyPrefix}
                theme={theme}
              />
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: "divider" }}>
                <Table size="small" aria-label={tableAria}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: headerBg }}>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600, width: 64 }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.SrNo" })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.Bucket Code" })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600 }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.Bucket Description" })}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 11, fontWeight: 600, width: 140 }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.Amount" })}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, fontWeight: 600, width: 100 }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.Status" })}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => {
                      const isZebra = i % 2 === 1;
                      const amt = Number(row.amount) || 0;
                      const amountColor = amt > 0 ? theme.palette.error.main : theme.palette.text.secondary;
                      const amountWeight = 600;
                      return (
                        <TableRow key={`${row.bucketCode}-${row.srNo}`} sx={{ bgcolor: isZebra ? zebraBg : "transparent" }}>
                          <TableCell sx={{ fontSize: 12, fontWeight: 500, color: "text.primary" }}>{row.srNo}</TableCell>
                          <TableCell sx={{ fontSize: 12, fontFamily: "ui-monospace, monospace", color: "text.primary" }}>
                            {row.bucketCode || intl.formatMessage({ id: "label.AgeingDetails.dash" })}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, color: "text.primary" }}>{row.description}</TableCell>
                          <TableCell align="right" sx={{ fontSize: 12, fontWeight: amountWeight, color: amountColor }}>
                            {formatCurrencyCell(amt)}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>
                            {row.srNo === 1 ? (
                              <Chip
                                size="small"
                                color="success"
                                variant="filled"
                                label={intl.formatMessage({ id: "label.AgeingDetails.status.current" })}
                                sx={{ height: 22, fontSize: 10, fontWeight: 600 }}
                              />
                            ) : amt > 0 ? (
                              <Chip
                                label={intl.formatMessage({ id: "label.AgeingDetails.status.overdue" })}
                                size="small"
                                color="error"
                                sx={{ height: 22, fontSize: 10, fontWeight: 600 }}
                              />
                            ) : (
                              <Typography component="span" variant="caption" sx={{ fontSize: 10, color: "text.secondary" }}>
                                {intl.formatMessage({ id: "label.AgeingDetails.dash" })}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}>
                        {intl.formatMessage({ id: "label.AgeingDetails.totalOverdueFooter" })}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: totalAllBuckets > 0 ? theme.palette.error.main : theme.palette.text.secondary,
                        }}
                      >
                        {totalAllBuckets > 0
                          ? `${currencyPrefix}${totalAllBuckets.toLocaleString(locale)}`
                          : intl.formatMessage({ id: "label.AgeingDetails.dash" })}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
              {rollbackBucketNumber != null && rollbackBucketNumber > 1 ? (
                <Box sx={{ mt: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <FiAlertTriangle size={18} style={{ color: theme.palette.warning.main, flexShrink: 0 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}>
                      {intl.formatMessage({ id: "label.ageingDetails.rollbackGuidance", defaultMessage: "Rollback Guidance" })}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", pl: "26px" }}>
                    {intl.formatMessage({ id: "label.ageingDetails.collecting", defaultMessage: "Collecting" })}{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {currencyPrefix}{rollBackAmt.toLocaleString(locale)}
                    </Box>{" "}
                    {intl.formatMessage({ id: "label.ageingDetails.rollbackExplanation", defaultMessage: "will move the account from Bucket" })} {rollbackBucketNumber} {intl.formatMessage({ id: "label.ageingDetails.toBucket", defaultMessage: "to Bucket" })} {rollbackBucketNumber - 1}.{" "}
                    {intl.formatMessage({ id: "label.ageingDetails.total", defaultMessage: "Total" })}{" "}
                    <Box component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      {currencyPrefix}{totalToBucketOne.toLocaleString(locale)}
                    </Box>{" "}
                    {intl.formatMessage({ id: "label.ageingDetails.needToBring", defaultMessage: "needed to bring to Bucket 1" })}.
                  </Typography>
                </Box>
              ) : null}
            </Stack>
          ) : null}
        </Box>
      </Box>
    </FunctionLayout>
  );
};

export default AgeingDetails;
