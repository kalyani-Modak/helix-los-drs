import React from "react";
import Download from "@mui/icons-material/Download";
import { ALIGNMENT, HButton } from "@helix/component-library";
import {
  compactHeaderStyle,
  descCell,
  mutedTextCellStyle,
  primaryCell,
  textCellStyle,
} from "../return-mail-tracking/returnMailTrackingGridDef";

function wrap(col) {
  return {
    ...col,
    filter: false,
    headerStyle: compactHeaderStyle,
  };
}

/**
 * @param {import("react-intl").IntlShape} intl
 * @param {{ onDownload: (row: object) => void, downloading?: boolean }} ctx
 */
export function createUploadDocumentColumnDefs(intl, ctx) {
  const { onDownload, downloading = false } = ctx;

  return [
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.documentType" }),
      field: "documentType",
      minWidth: 120,
      flex: 1,
      cellStyle: textCellStyle(ALIGNMENT.TEXT),
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.file" }),
      field: "fileName",
      minWidth: 180,
      flex: 1.25,
      cellStyle: { ...descCell, textAlign: ALIGNMENT.TEXT },
      cellRenderer: (params) => {
        const name = params.data?.fileName ?? "";
        const size = params.data?.fileSize ?? "";
        const rowData = params.data;
        
        if (!name) return "";
        
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onDownload && !downloading) {
                  onDownload(rowData);
                }
              }}
              style={{
                color: downloading ? "#ccc" : "var(--drs-primary)",
                cursor: downloading ? "not-allowed" : "pointer",
                textDecoration: "underline",
                fontSize: "11px",
                fontWeight: 600,
              }}
              title={intl.formatMessage({ id: "label.uploadDocument.downloadFile" })}
            >
              {name}
            </a>
            {!downloading && onDownload && (
              <Download
                sx={{
                  fontSize: 14,
                  color: "var(--drs-primary)",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.7 },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(rowData);
                }}
              />
            )}
            {size && (
              <span style={{ fontWeight: 400, color: "var(--drs-text-muted)", fontSize: "10px" }}>
                ({size})
              </span>
            )}
          </div>
        );
      },
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.referenceNo" }),
      field: "referenceNo",
      minWidth: 110,
      flex: 0.85,
      cellStyle: textCellStyle(ALIGNMENT.TEXT),
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.remarks" }),
      field: "remarks",
      minWidth: 140,
      flex: 1,
      cellStyle: mutedTextCellStyle(ALIGNMENT.TEXT),
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.date" }),
      field: "date",
      minWidth: 96,
      flex: 0.65,
      cellStyle: textCellStyle(ALIGNMENT.DATE),
      valueFormatter: (params) => {
        if (!params.value) return "";
        try {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        } catch (e) {
          return params.value;
        }
      },
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.user" }),
      field: "user",
      minWidth: 100,
      flex: 0.85,
      cellStyle: textCellStyle(ALIGNMENT.TEXT),
    }),
  ];
}
