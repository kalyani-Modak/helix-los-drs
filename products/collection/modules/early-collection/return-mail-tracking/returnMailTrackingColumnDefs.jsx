import React from "react";
import { Checkbox, Typography } from "@mui/material";
import dayjs from "dayjs";
import { ALIGNMENT, HDropdown, HDatePicker, HBox } from "@helix/component-library";
import {
  compactHeaderStyle,
  descCell,
  mutedTextCellStyle,
  primaryCell,
  textCellStyle,
} from "./returnMailTrackingGridDef";

function rowAlert(params) {
  const r = String(params.data?.returned ?? "").toUpperCase();
  const b = String(params.data?.badMarked ?? "").toUpperCase();
  return r === "Y" || b === "Y";
}

function wrapRules(col) {
  return {
    ...col,
    filter: false,
    headerStyle: compactHeaderStyle,
    cellClassRules: {
      "drs-return-mail-row-alert": (params) => rowAlert(params),
    },
  };
}

/**
 * @param {import("react-intl").IntlShape} intl
 * @param {{ onPatchRow: (mailSeqNo: string|number, patch: object) => void, reasonOptions: { value: string, label: string }[] }} ctx
 */
export function createReturnMailTrackingColumnDefs(intl, ctx) {
  const { onPatchRow, reasonOptions } = ctx;

  return [
    wrapRules({
      headerName: "#",
      maxWidth: 52,
      minWidth: 44,
      flex: 0,
      sortable: false,
      valueGetter: (p) => (p.node != null ? p.node.rowIndex + 1 : ""),
      cellStyle: mutedTextCellStyle(ALIGNMENT.TEXT),
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.mailCode" }),
      field: "mailCode",
      minWidth: 88,
      flex: 0.85,
      cellStyle: { ...descCell, textAlign: ALIGNMENT.TEXT },
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.name" }),
      field: "name",
      minWidth: 110,
      flex: 1,
      wrapText: true,
      cellStyle: textCellStyle(ALIGNMENT.TEXT),
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.mailingAddress" }),
      field: "mailingAddress",
      minWidth: 200,
      flex: 1.4,
      wrapText: true,
      cellStyle: mutedTextCellStyle(ALIGNMENT.TEXT),
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.type" }),
      field: "mailType",
      minWidth: 72,
      flex: 0.65,
      cellStyle: mutedTextCellStyle(ALIGNMENT.TEXT),
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.sendDate" }),
      field: "sendDate",
      minWidth: 100,
      flex: 0.85,
      cellStyle: textCellStyle(ALIGNMENT.DATE),
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.badAddress" }),
      field: "badMarked",
      minWidth: 96,
      maxWidth: 110,
      flex: 0,
      sortable: false,
      headerStyle: { ...compactHeaderStyle, textAlign: "center" },
      cellStyle: { textAlign: "center", fontSize: "11px" },
      cellRenderer: (params) => {
        const id = params.data?.mailSeqNo;
        if (id == null) return null;
        const checked = String(params.data?.badMarked || "").toUpperCase() === "Y";
        return (
          <HBox
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              bgcolor: "transparent",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              size="small"
              checked={checked}
              onChange={(e) => {
                e.stopPropagation();
                onPatchRow(id, { badMarked: e.target.checked ? "Y" : "N" });
              }}
              sx={{ p: 0.25 }}
            />
          </HBox>
        );
      },
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.returnCol" }),
      field: "returned",
      minWidth: 72,
      maxWidth: 88,
      flex: 0,
      sortable: false,
      headerStyle: { ...compactHeaderStyle, textAlign: "center" },
      cellStyle: { textAlign: "center", fontSize: "11px" },
      cellRenderer: (params) => {
        const id = params.data?.mailSeqNo;
        if (id == null) return null;
        const bad = String(params.data?.badMarked || "").toUpperCase() === "Y";
        const checked = String(params.data?.returned || "").toUpperCase() === "Y";
        return (
          <HBox
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              bgcolor: "transparent",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              size="small"
              checked={checked}
              disabled={!bad}
              onChange={(e) => {
                e.stopPropagation();
                onPatchRow(id, { returned: e.target.checked ? "Y" : "N" });
              }}
              sx={{ p: 0.25 }}
            />
          </HBox>
        );
      },
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.returnDate" }),
      field: "returnDate",
      minWidth: 130,
      flex: 0.9,
      sortable: false,
      cellRenderer: (params) => {
        const id = params.data?.mailSeqNo;
        if (id == null) return null;
        const bad = String(params.data?.badMarked || "").toUpperCase() === "Y";
        if (!bad) {
          return (
            <Typography variant="caption" sx={{ fontSize: 11, color: "var(--drs-text-muted)" }}>
              —
            </Typography>
          );
        }
        const val = params.data?.returnDate || "";
        return (
          <HBox onClick={(e) => e.stopPropagation()} sx={{ py: 0.25, width: "100%", bgcolor: "transparent" }}>
            <HDatePicker
              value={val ? dayjs(val) : null}
              onChange={(v) => {
                onPatchRow(id, { returnDate: v ? dayjs(v).format("YYYY-MM-DD") : "" });
              }}
              format="MM/DD/YYYY"
              width="100%"
            />
          </HBox>
        );
      },
    }),
    wrapRules({
      headerName: intl.formatMessage({ id: "label.returnMailTracking.grid.reason" }),
      field: "returnReasonKey",
      minWidth: 160,
      flex: 1.1,
      sortable: false,
      cellRenderer: (params) => {
        const id = params.data?.mailSeqNo;
        if (id == null) return null;
        const bad = String(params.data?.badMarked || "").toUpperCase() === "Y";
        if (!bad) {
          return (
            <Typography variant="caption" sx={{ fontSize: 11, color: "var(--drs-text-muted)" }}>
              —
            </Typography>
          );
        }
        return (
          <HBox onClick={(e) => e.stopPropagation()} sx={{ py: 0.25, width: "100%", bgcolor: "transparent" }}>
            <HDropdown
              name={`reason-${id}`}
              options={reasonOptions}
              value={params.data?.returnReasonKey || ""}
              onChange={(e) => {
                onPatchRow(id, { returnReasonKey: e.target.value || "" });
              }}
              placeholder={intl.formatMessage({ id: "label.returnMailTracking.details.returnReason.placeholder" })}
              width="100%"
            />
          </HBox>
        );
      },
    }),
  ];
}
