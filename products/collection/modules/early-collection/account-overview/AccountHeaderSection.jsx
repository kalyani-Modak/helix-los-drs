import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  ContentCopy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchHeaderData } from "../../../../common/slice/accountSlice";
import { displayValue, formatMoney } from "./overviewApiHelpers";

import { HLabel } from "@helix/component-library";
function getRiskLevel(delqDays, odAmount, bucket) {
  const d = Number(delqDays) || 0;
  const od = Number(odAmount) || 0;
  const b = Number(bucket) || 0;
  const score =
    (d > 90 ? 3 : d > 30 ? 2 : 1) +
    (od > 50000 ? 3 : od > 20000 ? 2 : 1) +
    (b > 4 ? 3 : b > 2 ? 2 : 1);
  if (score >= 7) return { emoji: "●", label: "High Risk", color: "error.main" };
  if (score >= 5) return { emoji: "●", label: "Medium Risk", color: "warning.main" };
  return { emoji: "●", label: "Low Risk", color: "success.main" };
}

function HeaderField({ label, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
      {/* <Typography
        variant="caption"
        sx={{ fontSize: 10, color: "text.secondary", fontWeight: 500, flexShrink: 0 }}
      >
        {label}:
      </Typography> */}
      <HLabel 
        value={label}
        sx={{ fontSize: 10, flexShrink: 0 }}
        align="left"
      />
      {/* <Typography
        variant="caption"
        sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}
        noWrap
      >
        {displayValue(value)}
      </Typography> */}
      <HLabel 
        value={displayValue(value)}
        align="left"
        colon={false}
      />
    </Box>
  );
}

function MetricChip({ label, value, variant, pulse, fullWidth }) {
  const palette =
    variant === "danger"
      ? { bg: "error.main", border: "error.light", fg: "error.contrastText" }
      : variant === "warning"
        ? { bg: "warning.main", border: "warning.light", fg: "warning.contrastText" }
        : { bg: "primary.main", border: "primary.light", fg: "primary.contrastText" };
  return (
    <Chip
      size="small"
      label={
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0.75,
            width: fullWidth ? "100%" : "auto",
            minWidth: fullWidth ? 0 : "auto",
          }}
        >
          <Typography component="span" sx={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>
            {label}
          </Typography>
          <Typography component="span" sx={{ fontSize: 11, fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      }
      sx={{
        height: 22,
        borderRadius: 1,
        width: fullWidth ? "100%" : "auto",
        maxWidth: fullWidth ? "100%" : "none",
        "& .MuiChip-label": fullWidth ? { width: "100%", px: 1 } : {},
        bgcolor: (t) =>
          variant === "danger"
            ? `${t.palette.error.main}14`
            : variant === "warning"
              ? `${t.palette.warning.main}18`
              : `${t.palette.primary.main}14`,
        color:
          variant === "danger"
            ? "error.dark"
            : variant === "warning"
              ? "warning.dark"
              : "primary.dark",
        border: 1,
        borderColor: palette.border,
        animation: pulse ? "accountHeaderPulse 1.5s ease-in-out infinite" : "none",
        "@keyframes accountHeaderPulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.72 },
        },
      }}
    />
  );
}

/**
 * Account identity + delinquency strip (no FunctionGroupsBar).
 * Used inside workspace AccountHeader and on the Followup route under FunctionLayout.
 */
export default function AccountHeaderSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRow, headerData, loading, error } = useSelector((s) => s.account);

  useEffect(() => {
    if (selectedRow?.ACNT_SEQNO != null) {
      dispatch(fetchHeaderData(selectedRow));
    }
  }, [dispatch, selectedRow?.ACNT_SEQNO]);

  const risk = useMemo(() => {
    if (!headerData) return { emoji: "", label: "", color: "text.secondary" };
    return getRiskLevel(
      headerData.inOdDays,
      headerData.bdOverdueAmt,
      headerData.szBucketCode != null ? Number(headerData.szBucketCode) : 0
    );
  }, [headerData]);

  const copyAcct = () => {
    const no = headerData?.szLegacyAccountNo;
    if (no) {
      navigator.clipboard?.writeText(String(no));
    }
  };

  if (!selectedRow) {
    return (
      <Box
        sx={{
          mx: 1,
          mt: 0.25,
          mb: 0.5,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "action.hover",
        }}
      >
        <HLabel 
          value={intl.formatMessage({id:"label.no_account.selected", defaultMessage: "No account selected. Open an account from the worklist to see header details."})}
          align="left"
          colon={false}
        />
      </Box>
    );
  }

  if (loading && !headerData) {
    return (
      <Box
        sx={{
          mx: 1,
          mt: 0.25,
          mb: 0.5,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "action.hover",
        }}
      >
        <HLabel 
          value={`Loading header…`}
          align="left"
          colon={false}
        />
      </Box>
    );
  }

  if (error && !headerData) {
    return (
      <Box
        sx={{
          mx: 1,
          mt: 0.25,
          mb: 0.5,
          p: 1.5,
          borderRadius: 1,
          borderLeft: 4,
          borderLeftColor: "error.main",
          bgcolor: "error.lighter",
        }}
      >
        <HLabel 
          value={intl.formatMessage({id:"acc_header.unable.load", defaultMessage: "Unable to load account header."})}
          align="left"
          colon={false}
          color="error"
        />
      </Box>
    );
  }

  const a = headerData || {};
  const name = a.szName || "—";
  const delq = Number(a.inOdDays) || 0;
  const odAmt = a.bdOverdueAmt;
  const osAmt = a.bdOsAmt;
  const bucket = a.szBucketCode != null ? String(a.szBucketCode) : "—";
  const isCritical = delq > 30;
  const bucketNum = Number(a.szBucketCode) || 0;
  const tenor = Number(a.inTenor) || 0;
  const paid = Number(a.inNoOfPaidInstallments) || 0;
  const contractLabel = a.szCardNo ? "Card" : "Active";

  return (
    <Box
      sx={{
        mt: 0.25,
        mb: 0.5,
        borderRadius: 1,
        boxShadow: 1,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
            flex: { xs: "none", md: "0 1 280px" },
            maxWidth: { md: 360 },
            alignSelf: { md: "stretch" },
            bgcolor: `${theme.palette.primary.main}14`,
            px: 2,
            py: 1.25,
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: `${theme.palette.primary.main}22`,
              border: 2,
              borderColor: `${theme.palette.primary.main}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <HLabel 
              value={String(name).charAt(0).toUpperCase()}
              align="center"
              colon={false}
              sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexWrap: "wrap" }}>
              <HLabel 
                value={name}
                align="left"
                colon={false}
                sx={{ fontSize: 12, fontWeight: 700 }}
                noWrap
              />
              <HLabel 
                title={risk.label}
                value={risk.emoji}
                align="left"
                colon={false}
                sx={{ fontSize: 12, color: risk.color }}
              />
              <HLabel 
                value={risk.label}
                align="left"
                colon={false}
                sx={{ color: risk.color }}
                noWrap
              />
              <Chip
                size="small"
                label={contractLabel}
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 600,
                  bgcolor: "success.light",
                  color: "success.dark",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 0.25,
                flexWrap: "nowrap",
                overflow: "hidden",
              }}
            >
              <Tooltip title="Previous account">
                <IconButton 
                  size="small" 
                  aria-label="Previous account"
                  sx={{ 
                    p: 0.5, 
                    mr: 0.5,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <ChevronLeft sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>

              <Typography
                variant="caption"
                sx={{ fontSize: 10, color: "text.secondary", display: "flex", alignItems: "center" }}
              >
                Acct:
                <Box component="span" sx={{ color: "text.primary", fontWeight: 700, ml: 0.5 }}>
                  {displayValue(a.szLegacyAccountNo)}
                </Box>
                <Tooltip title="Copy account number">
                  <IconButton size="small" aria-label="Copy account number" onClick={copyAcct} sx={{ p: 0.25, ml: 0.25 }}>
                    <ContentCopy sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              </Typography>

              <Tooltip title="Next account">
                <IconButton 
                  size="small" 
                  aria-label="Next account"
                  sx={{ 
                    p: 0.5, 
                    ml: 0.5,
                    mr: 1,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 6px rgba(37, 99, 235, 0.4)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <ChevronRight sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Typography variant="caption" sx={{ fontSize: 9, color: "text.secondary", whiteSpace: "nowrap" }}>
                Cust:
                <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {displayValue(a.szLegacyCustomerNo)}
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.75,
            flex: { xs: "none", md: "0 1 280px" },
            minWidth: { md: 220 },
            width: { xs: "100%" },
            px: 1.5,
            py: 1.25,
            bgcolor: "action.hover",
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 0.75, width: "100%" }}>
            <MetricChip
              label="Delinquency days"
              value={`${delq}d`}
              variant={delq > 60 ? "danger" : delq > 30 ? "warning" : "info"}
              pulse={isCritical}
              fullWidth
            />
            <MetricChip
              label="Bkt"
              value={bucket}
              variant={bucketNum > 4 ? "danger" : bucketNum > 2 ? "warning" : "info"}
              fullWidth
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 0.75, width: "100%" }}>
            <MetricChip label="OS" value={formatMoney(osAmt)} variant="warning" fullWidth />
            <MetricChip label="OD" value={formatMoney(odAmt)} variant="warning" pulse={isCritical} fullWidth />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            gap: { xs: 1.25, sm: 1.5 },
            px: 2,
            py: 1.25,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <HeaderField label="Portfolio" value={a.szPortfolioCode} />
              <HeaderField label="Product" value={a.szProductCode} />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <HeaderField label="Loan" value={formatMoney(a.bdLoanAmt)} />
              <HeaderField label="Term" value={tenor ? `${paid}/${tenor}` : "—"} />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <HeaderField label="Collector" value={a.szCollectorCode} />
              <HeaderField label="Workflow" value={a.szWfCode} />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              <HeaderField label="State" value={a.szWfStateCode} />
              <HeaderField label="Asset" value={a.szAssetType} />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "stretch" },
              ml: "auto",
            }}
          >
            <Tooltip title="Close">
              <IconButton size="small" onClick={() => navigate(-1)} sx={{ p: 0.5 }}>
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
