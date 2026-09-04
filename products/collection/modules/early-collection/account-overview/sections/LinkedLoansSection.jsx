import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import { Link } from "@mui/icons-material";
import { useOverviewSection } from "../useOverviewSection";
import { OverviewAPI } from "../../apiEndpoints";
import { hasSelectedAccount } from "../overviewRequestBody";
import { displayValue, formatMoney } from "../overviewApiHelpers";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { HLabel, OverviewSectionCard } from "@helix/component-library";
export default function LinkedLoansSection() {
  const { selectedRow } = useSelector((s) => s.account);
  const intl = useIntl();
  const accountReady = hasSelectedAccount(selectedRow);
  const { loading, data, error } = useOverviewSection(
    OverviewAPI.getLinkedLoanDetails(),
    accountReady
  );
  const rows = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <OverviewSectionCard
      title={intl.formatMessage({
        id: "label.Overview.sections.linked_loans",
        defaultMessage: "Linked Loans",
      })}
      icon={Link}
      loading={loading}
      error={error}
      minHeight={rows.length <= 1 ? 58 : 80}
      emptyMinHeight={44}
    >
      {!loading && !error && rows.length === 0 ? (
        <HLabel value={intl.formatMessage({
            id: "label.Overview.linked_loans.empty",
            defaultMessage: "No linked loans.",
          })}
          colon={false}
          align='left'
        />
      ) : (
        <Table size="small" sx={{ "& td, & th": { fontSize: 11, py: 0.5 } }}>
          <TableHead>
            <TableRow>
              <TableCell>{intl.formatMessage({ id: "label.Overview.linked_loans.account", defaultMessage: "Account" })}</TableCell>
              <TableCell>{intl.formatMessage({ id: "label.Overview.fields.portfolio", defaultMessage: "Portfolio" })}</TableCell>
              <TableCell align="right">{intl.formatMessage({ id: "label.Overview.linked_loans.os_amount", defaultMessage: "OS Amt" })}</TableCell>
              <TableCell align="right">{intl.formatMessage({ id: "label.Overview.linked_loans.od_principal", defaultMessage: "OD Prin" })}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{displayValue(r.szLegacyAccountNo)}</TableCell>
                <TableCell>{displayValue(r.szPortfolioCode)}</TableCell>
                <TableCell align="right">{formatMoney(r.bgOsAmt)}</TableCell>
                <TableCell align="right">{formatMoney(r.bgOverDueprinAmt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </OverviewSectionCard>
  );
}
