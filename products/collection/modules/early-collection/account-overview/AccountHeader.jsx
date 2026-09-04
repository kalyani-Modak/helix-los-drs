import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme, Divider
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
import FunctionGroupsBar from "./FunctionGroupsBar";
import { createBucketToneScale } from "../../../../../apps/debt-recovery-shell/src/colors";
import { useColorTheme, ThemeSelectionProvider } from "../../../../../apps/debt-recovery-shell/src/themeSelectionConfig";
import { useIntl } from "react-intl";

import { HBox, HLabel } from "@helix/component-library";
const sectionShellSx = {
  border: 1,
  borderColor: "divider",
  borderRadius: 2,
  overflow: "hidden",
  bgcolor: "background.paper",
};

function AccountHeaderChrome({ children }) {
  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 0.25,
      }}
    >
      <HBox component="section" aria-label="Account header" sx={sectionShellSx}>
        {children}
      </HBox>

      <HBox component="section" aria-label="Account functions" sx={sectionShellSx}>
        <FunctionGroupsBar embedded />
      </HBox>
    </HBox>
  );
}

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
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, backgroundColor: "transparent"  }}>
      <HLabel 
        value={label}
        align="left"
        sx={{ fontSize: 10, flexShrink: 0 }}
      />
      <Typography
        variant="caption"
        sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}
        noWrap
      >
        {displayValue(value)}
      </Typography>
    </HBox>
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
        <HBox
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 0.75,
            width: fullWidth ? "100%" : "auto",
            minWidth: fullWidth ? 0 : "auto",
            backgroundColor: "transparent",
          }}
        >
          <Typography component="span" sx={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>
            {label}
          </Typography>
          <Typography component="span" sx={{ fontSize: 11, fontWeight: 700 }}>
            {value}
          </Typography>
        </HBox>
      }
      sx={{
        height: "50%",
        minHeight: 22,
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

export default function AccountHeader() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRow, headerData, loading, error } = useSelector((s) => s.account);
  const { colors } = useColorTheme();
const intl = useIntl();

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
      <AccountHeaderChrome>
        <HBox
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
            value={intl.formatMessage({ id: "label.accountHeader.noSelectionHint", defaultMessage: "No account selected. Open an account from the worklist to see header details." })}
            align="left"
            colon={false}
          />
        </HBox>
      </AccountHeaderChrome>
    );
  }

  if (loading && !headerData) {
    return (
      <AccountHeaderChrome>
        <HBox
          sx={{
            mx: 1,
            mt: 0.25,
            mb: 0.5,
            p: 1.5,
            borderRadius: 1,
            //bgcolor: "action.hover",
          }}
        >
          <HLabel 
            value={intl.formatMessage({ id: "label.load.header", defaultMessage: "Loading header…" })}
            align="left"
            sx={{ fontSize: 10, flexShrink: 0 }}
            colon={false}
          />
        </HBox>
      </AccountHeaderChrome>
    );
  }

  if (error && !headerData) {
    return (
      <AccountHeaderChrome>
        <HBox
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
            value={intl.formatMessage({ id: "label.unable.loadingHeader", defaultMessage: "Unable to load account header." })}
            align="left"
            colon={false}
            variant="caption"
          />
        </HBox>
      </AccountHeaderChrome>
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
  const bucketTones = createBucketToneScale(colors, 12);
  const bucketTone = bucketTones[Math.min(Math.max(bucketNum, 0), 11)];
  const bucketPalette = {
    bg: bucketTone.background,
    border: bucketTone.border,
    text: bucketTone.text,
  };

  return (
    <AccountHeaderChrome>
      <HBox
        sx={{
          mt: 0.25,
          mb: 0.5,
          borderRadius: 1,
          boxShadow: 1,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <HBox
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
        {/* Section 1 — Customer name and related identity */}
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
            alignSelf: { md: "stretch" },
            bgcolor: `${theme.palette.primary.main}14`,
            px: 2,
            py: 1.25,
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
          }}
        >
          <HBox
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
              align="left"
              sx={{ fontSize: 14, fontWeight: 700, color: "primary.main" }}
              colon={false}
            />
          </HBox>
          <HBox sx={{ minWidth: 0, backgroundColor: "transparent"}}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 0.25, flexWrap: "wrap", backgroundColor: "transparent" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700 }} noWrap>
                {name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: risk.color }} title={risk.label}>
                {risk.emoji}
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: 600, color: risk.color }}>
                {risk.label}
              </Typography>
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
            </HBox>
            <HBox
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 0.25,
                flexWrap: "nowrap",   // 🚀 prevents line break
                overflow: "hidden",
                backgroundColor: "transparent",
              }}
            >
              {/* Previous */}
              <Tooltip title="Previous account">
                <IconButton 
                  size="small" 
                  aria-label="Previous account"
                  sx={{ 
                    p: 0.5, 
                    mr: 0.25,
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#ef4444',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
                      color: '#dc2626',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <ChevronLeft sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>

              {/* Account No */}
              <Typography variant="caption" sx={{ fontSize: 10, color: "text.secondary", display: "flex", alignItems: "center" }}>
                Acct:
                <HBox component="span" sx={{ color: "text.primary", fontWeight: 700, ml: 0.5, backgroundColor: "transparent" }}>
                  {displayValue(a.szLegacyAccountNo)}
                </HBox>
                <Tooltip title="Copy account number">
                  <IconButton size="small" aria-label="Copy account number" onClick={copyAcct} sx={{ p: 0.25, ml: 0.25 }}>
                    <ContentCopy sx={{ fontSize: 12 }} />
                  </IconButton>
                </Tooltip>
              </Typography>

              {/* Next */}
              <Tooltip title="Next account">
                <IconButton 
                  size="small" 
                  aria-label="Next account"
                  sx={{ 
                    p: 0.5, 
                    ml: 0.25,
                    mr: 0.5,
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    color: '#3b82f6',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)',
                      color: '#2563eb',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <ChevronRight sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>
              {/* Customer No */}
              <Typography
                variant="caption"
                sx={{ fontSize: 9, color: "text.secondary", whiteSpace: "nowrap" }}
              >
                Cust:
                <HBox component="span" sx={{ fontWeight: 600, color: "text.primary", backgroundColor: "transparent" }}>
                  {displayValue(a.szLegacyCustomerNo)}
                </HBox>
              </Typography>
            </HBox>
          </HBox>
        </HBox>

        {/* Section 2 — Redesigned Layout */}
        <HBox
          sx={{
            display: "flex",
            flexDirection: "row",
            flex: { xs: "none", md: "0 0 220px" },
            // minWidth: { md: 260 },
            width: { xs: "100%" },
            px: 1.25,
            py: 0.75,
            // bgcolor: "action.hover",
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
            gap: 0.5,
            alignItems: "stretch",
          }}
        >
          {/* LEFT SIDE: Combined Bucket + Delinquency */}
          <HBox
            sx={{
              flex: "0 0 52px",        // ↓ reduced width
              width: 52,
              height: 52,              // ✅ makes it square
              borderRadius: 1,
              border: 1,
              px: 0.4,
              py: 0.4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // center content vertically
              alignItems: "center",
              gap: 0.1,
              borderColor: bucketPalette.border,
              background: bucketPalette.bg,
            }}
          >
            <HLabel 
              value={`Bucket`}
              sx={{ fontSize: 10, color: bucketPalette.text,lineHeight: 1 }}
                colon={false}
                align="center"
              />

            <HLabel 
              value={bucket}
              sx={{
                fontSize: 18,
                  fontWeight: 900,
                  color: bucketPalette.text,
                }}
                colon={false}
                align="center"
              />

            <HLabel 
              value={`Delq ${delq}d`}
              align="left"
              sx={{
                fontSize: 8,
                fontWeight: 550,
                lineHeight: 1,
                textAlign: 'center',
                color: bucketPalette.text,
              }}
              colon={false}
            />
          </HBox>

          {/* RIGHT SIDE: OS + OD */}
          <HBox
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 0.75,
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              minWidth: 0,
              backgroundColor: "transparent",
            }}
          >
            <MetricChip
              label="OS"
              value={formatMoney(osAmt)}
              variant="warning"
              fullWidth
            />

            <MetricChip
              label="OD"
              value={formatMoney(odAmt)}
              variant="danger"
              pulse={isCritical}
              fullWidth
            />
          </HBox>
        </HBox>

        {/* Section 3 — data rows (vertically centered) + nav strip on the right */}
        <HBox
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
            // bgcolor: `${theme.palette.primary.main}14`,
          }}
        >
          <HBox
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.75, // reduced gap
              flexWrap: "wrap", // optional for responsiveness
              backgroundColor: "transparent",
            }}
          >
            {/* Column 1 */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.25, backgroundColor: "transparent" }}>
              <HeaderField label="Portfolio" value={a.szPortfolioCode} />
              <HeaderField label="Product" value={a.szProductCode} />
            </HBox>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Column 2 */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.25, backgroundColor: "transparent" }}>
              <HeaderField label="Loan" value={formatMoney(a.bdLoanAmt)} />
              <HeaderField label="Term" value={tenor ? `${paid}/${tenor}` : "—"} />
            </HBox>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Column 3 */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.25, backgroundColor: "transparent" }}>
              <HeaderField label="Collector" value={a.szCollectorCode} />
              <HeaderField label="Workflow" value={a.szWfCode} />
            </HBox>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Column 4 */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.25, backgroundColor: "transparent" }}>
              <HeaderField label="State" value={a.szWfStateCode} />
              <HeaderField label="Asset" value={a.szAssetType} />
            </HBox>
          </HBox>
          <HBox
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              flexShrink: 0,
              alignSelf: { xs: "stretch", sm: "stretch" },
              ml: "auto",
              backgroundColor: "transparent",
            }}
          >
            <Tooltip title="Close">
              <IconButton size="small" onClick={() => navigate("/homelayout/listView", { replace: true, state: {} })} sx={{ p: 0.5 }}>
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </HBox>
        </HBox>
      </HBox>
      </HBox>
    </AccountHeaderChrome>
  );
}
