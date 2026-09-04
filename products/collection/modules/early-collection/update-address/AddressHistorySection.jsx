import React from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { useIntl } from "react-intl";

import { HBox, HLabel, HPaper, useDrsTheme } from "@helix/component-library";
function combinedHistoryAddress(row) {
  return `${row?.szAddress1 || ""} ${row?.szAddress2 || ""} ${row?.szAddress3 || ""} ${row?.szAddress4 || ""}`.trim();
}

function formatChangedOn(val) {
  if (val == null || val === "") return "";
  if (typeof val === "string") return val.length >= 10 ? val.slice(0, 10) : val;
  if (Array.isArray(val) && val.length >= 3) {
    const [y, m, d] = val;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? String(val) : d.toISOString().slice(0, 10);
}

export default function AddressHistorySection({ rowData, loading }) {
  const intl = useIntl();
  const { surfaces, text, border, colors } = useDrsTheme();
  const rows = rowData || [];

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: "0 0 8px 8px",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden",
      }}
    >
      <HBox sx={{ px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <HistoryOutlined sx={{ fontSize: 16, color: colors.primary }} />
        <HLabel
          value={intl.formatMessage({ id: "label.UpdateAddress.Update Address History", defaultMessage: "Update History" })}
          translate={false}
          colon={false}
          align="left"
          sx={{ fontWeight: 700, fontSize: 13, color: text.primary }}
        />
      </HBox>
      <HBox sx={{ px: 2, pb: 1.5 }}>
        <Table size="small" aria-label="address update history">
          <TableHead>
            <TableRow sx={{ bgcolor: surfaces.panel }}>
              {["Contact", "Type", "Address", "City", "Zip", "Changed"].map((head) => (
                <TableCell key={head} sx={{ py: 0.75, fontSize: 11, color: text.secondary, borderBottomColor: border.divider }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 2 }}>
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, background: "transparent" }}>
                    <CircularProgress size={18} />
                    <HLabel
                      value={intl.formatMessage({ id: "label.common.loading", defaultMessage: "Loading..." })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{ fontSize: 12 }}
                    />
                  </HBox>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row, index) => (
                <TableRow key={`${row.szAddressType || "history"}-${index}`}>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.primary }}>{row.szContactPerson || row.szCreatedBy || "-"}</TableCell>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.primary }}>{row.szAddressType || "-"}</TableCell>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.secondary }}>{combinedHistoryAddress(row) || "-"}</TableCell>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.primary }}>{row.szCity || "-"}</TableCell>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.primary, fontFamily: "ui-monospace, monospace" }}>{row.szZip || "-"}</TableCell>
                  <TableCell sx={{ py: 0.85, fontSize: 11, color: text.primary }}>{formatChangedOn(row.dtCreatedOn)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 2, fontSize: 12, color: text.secondary }}>
                  {intl.formatMessage({ id: "label.updateAddress.noHistoryRows", defaultMessage: "No update history available." })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </HBox>
    </HPaper>
  );
}
