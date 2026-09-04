import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { HBox, HPaper, ALIGNMENT, HAgGrid } from "@helix/component-library";
import Groups from "@mui/icons-material/Groups";
import { useIntl } from "react-intl";
import { useTheme } from "@mui/material/styles";

import { useOverviewSection } from "../account-overview/useOverviewSection";
import { OverviewAPI } from "../apiEndpoints";
import { hasSelectedAccount } from "../account-overview/overviewRequestBody";
import { useLocation } from "react-router-dom";

const mapLinkedLoanRow = (row) => ({
  agreementNo: row?.szLegacyAccountNo || row?.szLegacyAccountNo || "—",
  currentDelqDays: row?.inOdDays ?? row?.iOdDays ?? "—",
  currentAmount: row?.bdOverdueAmt ?? row?.bdOverdueAmt ?? row?.bgOsAmt ?? row?.fOsAmt ?? 0,
  peakDelqDays: row?.inPeakOdDays ?? row?.iPeakOdDays ?? "—",
  peakAmount: row?.bdPeakOverdueAmt ?? row?.fPeakOverdueAmt ?? 0,
  currentBucket: row?.szBucketCode ?? "—",
  promiseTaken: row?.szPromiseTaken ?? row?.promiseTaken ?? "—",
  promiseBroken: row?.szPromiseBroken ?? row?.promiseBroken ?? "—",
  nextBucketDate: row?.szNextBucketDate ?? "—",
  nextBucketDaysLeft: row?.lnNextBucketDaysLeft ?? row?.nextBucketDaysLeft ?? 0,
});

export default function CustomerGroupSummarySection({ groupAccounts }) {
  const intl = useIntl();
  const theme = useTheme();
  const { selectedRow } = useSelector((state) => state.account);
  const accountReady = hasSelectedAccount(selectedRow);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getLinkedLoanDetails(screenMenuId),
    accountReady,
  );

  const rows = useMemo(() => {
    if (groupAccounts && groupAccounts.length) return groupAccounts;
    if (!data) return [];
    if (Array.isArray(data)) return data.map(mapLinkedLoanRow);
    return [mapLinkedLoanRow(data)];
  }, [data, groupAccounts]);

  const rowData = useMemo(() => (groupAccounts && groupAccounts.length ? groupAccounts : rows), [groupAccounts, rows]);

  const columnDefs = useMemo(() => {
    const fontFamily = theme.typography.fontFamily;
    const compactHeader = {
      fontSize: "10px",
      fontWeight: 600,
      fontFamily,
      letterSpacing: "0.02em",
    };
    const baseCell = {
      fontSize: "11px",
      fontFamily,
      lineHeight: 1.45,
    };

    return [
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.agreement" }),
        field: "agreementNo",
        flex: 1.2,
        minWidth: 140,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: {
          ...baseCell,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          color: theme.palette.primary.main,
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.delqDays" }),
        field: "currentDelqDays",
        flex: 0.5,
        minWidth: 80,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.currentAmt" }),
        field: "currentAmount",
        flex: 0.65,
        minWidth: 100,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.NUMBER },
        cellStyle: {
          ...baseCell,
          textAlign: "right",
          fontWeight: 600,
          color: theme.palette.error.main,
        },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`,
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.peakDays" }),
        field: "peakDelqDays",
        flex: 0.5,
        minWidth: 80,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.peakAmt" }),
        field: "peakAmount",
        flex: 0.6,
        minWidth: 90,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.NUMBER },
        cellStyle: { ...baseCell, textAlign: "right" },
        valueFormatter: (p) => `₹${Number(p.value || 0).toLocaleString()}`,
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.ptp" }),
        field: "promiseTaken",
        flex: 0.4,
        minWidth: 56,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.STATUS },
        cellStyle: { ...baseCell, textAlign: "center" },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.broken" }),
        field: "promiseBroken",
        flex: 0.45,
        minWidth: 64,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.STATUS },
        cellStyle: {
          ...baseCell,
          textAlign: "center",
          color: theme.palette.error.main,
          fontWeight: 600,
        },
      },
      {
        headerName: intl.formatMessage({ id: "label.customerInformation.group.bucket" }),
        field: "currentBucket",
        flex: 0.4,
        minWidth: 56,
        filter: false,
        sort: false,
        headerStyle: { ...compactHeader, textAlign: ALIGNMENT.STATUS },
        cellStyle: { ...baseCell, textAlign: "center" },
      },
      {
        colId: "nextBucketSummary",
        headerName: intl.formatMessage({ id: "label.customerInformation.group.nextBucket" }),
        flex: 1,
        minWidth: 120,
        filter: false,
        sort: false,
        headerStyle: compactHeader,
        cellStyle: { ...baseCell, color: theme.palette.text.primary },
        valueGetter: (p) => {
          const g = p.data;
          if (!g) return "";
          if (g.nextBucketDate === "—") return "—";
          return `${g.nextBucketDate} (${g.nextBucketDaysLeft}d)`;
        },
      },
    ];
  }, [intl, theme]);

  if (!rowData || rowData.length === 0) {
    return (
      <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
          <Groups sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
            {intl.formatMessage({ id: "label.customerInformation.section.groupSummary" })}
          </Typography>
        </HBox>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          {loading ? intl.formatMessage({ id: "label.customerInformation.group.loading", defaultMessage: "Loading linked loans..." }) : intl.formatMessage({ id: "label.customerInformation.group.empty" })}
        </Typography>
      </HPaper>
    );
  }

  return (
    <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", overflow: "hidden" }}>
      <HBox sx={{ px: 2, py: 1.25, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 0.75 }}>
          <Groups sx={{ fontSize: 18, color: "primary.main" }} />
          {intl.formatMessage({ id: "label.customerInformation.section.groupSummary" })}
        </Typography>
      </HBox>
      <HBox sx={{ px: 0, mt: -0.5 }}>
        <HAgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          gridClassName="drs-list-grid drs-accounts-table-chrome"
          gridStyle={{ width: "100%", height: 140, minHeight: 120 }}
          pagination={false}
          sort={false}
          allowAdd={false}
          allowDelete={false}
          allowUpdate={false}
          hideInternalSaveButton
          showTitle={false}
        />
      </HBox>
    </HPaper>
  );
}
