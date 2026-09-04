import React from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import { useIntl } from "react-intl";
import { isEditableAddressType } from "./addressEditable";

import { HBox, HButton, HLabel, HPaper, useDrsTheme } from "@helix/component-library";
function combinedAddress(row) {
  return `${row?.szAddress1 || ""} ${row?.szAddress2 || ""} ${row?.szAddress3 || ""} ${row?.szAddress4 || ""}`.trim();
}

export default function AddressSummarySection({ rowData, loading, onSelectAddress, onAddCollectionsAddress, selectedAddressKey, getAddressKey }) {
  const intl = useIntl();
  const { surfaces, text, border, action, colors } = useDrsTheme();
  const rows = rowData || [];

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: "8px 8px 0 0",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden",
        borderBottom: 0,
      }}
    >
      <HBox sx={{ px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <PlaceOutlined sx={{ fontSize: 16, color: colors.primary }} />
        <HLabel
          value={intl.formatMessage({ id: "label.UpdateAddress.Address summary", defaultMessage: "Address Summary" })}
          translate={false}
          colon={false}
          align="left"
          sx={{ fontWeight: 700, fontSize: 13, flex: 1, color: text.primary }}
        />
        <HBox sx={{ width: "auto", background: "transparent", "& .hbutton-wrapper": { width: "auto" } }}>
          <HButton
            label="Add Collections Address"
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: 14 }} />}
            onClick={onAddCollectionsAddress}
            sx={{ height: 26, borderRadius: "6px", fontSize: 11, px: 1.25, whiteSpace: "nowrap" }}
          />
        </HBox>
      </HBox>

      <TableContainer sx={{ px: 2, pb: 1.5 }}>
        <Table size="small" aria-label="address summary">
          <TableHead>
            <TableRow sx={{ bgcolor: surfaces.panel }}>
              {["Type", "Address", "City", "State", "Zip"].map((head) => (
                <TableCell key={head} sx={{ py: 0.75, fontSize: 11, color: text.secondary, borderBottomColor: border.divider }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 2 }}>
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
              rows.map((row, index) => {
                const addressKey = getAddressKey?.(row) ?? `${row.szAddressType || "address"}-${index}`;
                const selected = selectedAddressKey != null && addressKey === selectedAddressKey;

                return (
                  <TableRow
                    hover
                    key={addressKey}
                    selected={selected}
                    onClick={() => onSelectAddress?.(row)}
                    sx={{
                      cursor: "pointer",
                      "&.Mui-selected": {
                        bgcolor: action.selected,
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: action.hover,
                      },
                    }}
                  >
                    <TableCell sx={{ py: 0.9, fontSize: 12, color: colors.primary, fontWeight: 600 }}>
                      {row.szAddressType || "-"}
                      {isEditableAddressType(row.szAddressType) ? (
                        <EditOutlined sx={{ ml: 0.5, fontSize: 12, verticalAlign: "middle", color: text.secondary }} />
                      ) : null}
                    </TableCell>
                    <TableCell sx={{ py: 0.9, fontSize: 12, color: text.secondary }}>{combinedAddress(row) || "-"}</TableCell>
                    <TableCell sx={{ py: 0.9, fontSize: 12, color: text.primary }}>{row.szCity || "-"}</TableCell>
                    <TableCell sx={{ py: 0.9, fontSize: 12, color: text.primary }}>{row.szState || "-"}</TableCell>
                    <TableCell sx={{ py: 0.9, fontSize: 12, color: text.primary, fontFamily: "ui-monospace, monospace" }}>{row.szZip || "-"}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 2, fontSize: 12, color: text.secondary }}>
                  {intl.formatMessage({ id: "label.updateAddress.noAddressRows", defaultMessage: "No addresses available." })}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </HPaper>
  );
}
