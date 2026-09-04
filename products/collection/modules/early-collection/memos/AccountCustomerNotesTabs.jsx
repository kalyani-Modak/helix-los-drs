import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { alpha, useTheme } from "@mui/material/styles";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { HAgGrid, HBox, HPaper, HTab, HTabs } from "@helix/component-library";


import { createMemosColumnDefs } from "./memosColumnDefs";
import { memosFontFamily, memosTextSx } from "./memosStyles";

const gridStyle = {
  width: "100%",
  height: 260,
  minWidth: 0,
};

const transparentSurface = {
  bgcolor: "transparent",
  background: "transparent",
  backgroundColor: "transparent",
  boxShadow: "none",
};

/**
 * @param {object} props
 * @param {number} props.historyTab — 0 account, 1 customer
 * @param {(n: number) => void} props.setHistoryTab
 * @param {object[]} props.accountRows
 * @param {object[]} props.customerRows
 * @param {boolean} props.loadingAccount
 * @param {boolean} props.loadingCustomer
 */
export default function AccountCustomerNotesTabs({
  historyTab,
  setHistoryTab,
  accountRows,
  customerRows,
  loadingAccount,
  loadingCustomer,
  accountTotalElements,
  customerTotalElements,
  accountDatasource,
  customerDatasource,
  notesPageSize = 7,
  refreshVersion = 0,
}) {
  const intl = useIntl();
  const theme = useTheme();

  const columnDefs = useMemo(() => createMemosColumnDefs(intl, theme), [intl, theme]);

  const accountLabel = intl.formatMessage({ id: "label.memos.tab.accountNotes" });
  const customerLabel = intl.formatMessage({ id: "label.memos.tab.customerNotes" });
  const accountCount = Number.isFinite(Number(accountTotalElements))
    ? Number(accountTotalElements)
    : accountRows.length;
  const customerCount = Number.isFinite(Number(customerTotalElements))
    ? Number(customerTotalElements)
    : customerRows.length;

  const tabScrollSx = useMemo(
    () => ({
      maxHeight: 260,
      overflow: "auto",
      width: "100%",
      ...transparentSurface,
      "& .ag-header": {
        backgroundColor: alpha(
          theme.palette.text.primary,
          theme.palette.mode === "dark" ? 0.08 : 0.06
        ),
      },
      "& .ag-header-cell": {
        fontSize: "10px",
        fontWeight: 600,
        color: theme.palette.text.primary,
      },
    }),
    [theme]
  );

  const tabsSx = useMemo(
    () => ({
      minHeight: 36,
      borderColor: "divider",
      "& .MuiTabs-indicator": {
        backgroundColor: "primary.main",
      },
      "& .MuiTab-root": {
        minHeight: 28,
        ...memosTextSx,
        textTransform: "none",
        fontWeight: 600,
        color: "text.secondary",
        borderRadius: "6px",
        px: 1.25,
      },
      "& .MuiTab-root.Mui-selected": {
        color: "primary.main",
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.16 : 0.06),
      },
    }),
    [theme]
  );

  const renderTabLabel = (label, count, Icon) => (
    <HBox
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.55,
        fontFamily: memosFontFamily,
      }}
    >
      <Icon sx={{ fontSize: 14 }} />
      <HBox
        component="span"
        sx={{ ...memosTextSx, color: "inherit", fontWeight: 600 }}
      >
        {label}
      </HBox>
      <HBox
        component="span"
        sx={{
          minWidth: 18,
          height: 18,
          px: 0.65,
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.22 : 0.08),
          color: "text.secondary",
          fontFamily: memosFontFamily,
          fontSize: "10px",
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {count}
      </HBox>
    </HBox>
  );

  return (
    <HPaper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <HBox
        sx={{
          ...transparentSurface,
          px: 2,
          pb: 1.25,
          pt: 1,
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <HTabs
          value={historyTab}
          onChange={(_, v) => setHistoryTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={tabsSx}
        >
          <HTab
            label={renderTabLabel(accountLabel, accountCount, AccountCircleOutlinedIcon)}
            id="memos-tab-account"
            aria-controls="memos-panel-account"
          />
          <HTab
            label={renderTabLabel(customerLabel, customerCount, GroupsOutlinedIcon)}
            id="memos-tab-customer"
            aria-controls="memos-panel-customer"
          />
        </HTabs>
      </HBox>

      {historyTab === 0 ? (
        <HBox
          id="memos-panel-account"
          role="tabpanel"
          aria-labelledby="memos-tab-account"
          sx={tabScrollSx}
        >
          <HAgGrid
            key={`memos-account-${refreshVersion}`}
            rowData={accountRows}
            columnDefs={columnDefs}
            gridStyle={gridStyle}
            rowModelType="infinite"
            datasource={accountDatasource}
            cacheBlockSize={notesPageSize}
            maxBlocksInCache={2}
            pagination
            paginationPageSize={notesPageSize}
            domLayout="normal"
            sort
            isLoading={loadingAccount}
            embeddedInSection
            showTitle={false}
          />
        </HBox>
      ) : (
        <HBox
          id="memos-panel-customer"
          role="tabpanel"
          aria-labelledby="memos-tab-customer"
          sx={tabScrollSx}
        >
          <HAgGrid
            key={`memos-customer-${refreshVersion}`}
            rowData={customerRows}
            columnDefs={columnDefs}
            gridStyle={gridStyle}
            rowModelType="infinite"
            datasource={customerDatasource}
            cacheBlockSize={notesPageSize}
            maxBlocksInCache={2}
            pagination
            paginationPageSize={notesPageSize}
            domLayout="normal"
            sort
            isLoading={loadingCustomer}
            embeddedInSection
            showTitle={false}
          />
        </HBox>
      )}
    </HPaper>
  );
}
