import React, { useMemo } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { ALIGNMENT, HAgGrid } from "@helix/component-library";

const gridStyle = {
  width: "100%",
  height: "min(36vh, 320px)",
  minWidth: "280px",
  overflowX: "auto",
};

const compactHeader = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "0.02em",
  textTransform: "none",
  lineHeight: 1.2,
};

const compactCell = {
  fontSize: "11px",
  lineHeight: 1.35,
  paddingTop: "6px",
  paddingBottom: "6px",
};

/**
 * @param {object} props
 * @param {object[]} props.rowData
 * @param {boolean} props.loading
 * @param {string|null} props.fetchError
 */
export default function StrategyHistoryGrid({ rowData, loading, fetchError }) {
  const intl = useIntl();

  const colDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.date" }),
        field: "dtActivity",
        type: "datetime",
        width: 108,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.DATE, fontFamily: "ui-monospace, monospace" },
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.from" }),
        field: "fromVal",
        flex: 1,
        minWidth: 88,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT },
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.to" }),
        field: "toVal",
        flex: 1,
        minWidth: 88,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT, fontWeight: 500 },
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.till" }),
        field: "tillVal",
        width: 96,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT, fontFamily: "ui-monospace, monospace" },
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.user" }),
        field: "szCollectorCode",
        width: 100,
        filter: false,
        headerStyle: compactHeader,
        cellStyle: { ...compactCell, textAlign: ALIGNMENT.TEXT, fontFamily: "ui-monospace, monospace" },
      },
      {
        headerName: intl.formatMessage({ id: "label.changeStrategy.history.col.note" }),
        field: "note",
        flex: 2,
        minWidth: 140,
        filter: false,
        tooltipField: "note",
        headerStyle: compactHeader,
        cellStyle: {
          ...compactCell,
          textAlign: ALIGNMENT.TEXT,
          whiteSpace: "normal",
        },
        autoHeight: true,
      },
    ],
    [intl],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: false,
      resizable: true,
    }),
    [],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography
        variant="overline"
        sx={{
          display: "block",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "text.secondary",
          lineHeight: 1.2,
        }}
      >
        {intl.formatMessage({ id: "label.changeStrategy.history.title" })}
      </Typography>
      {fetchError && (
        <Typography variant="caption" color="error" sx={{ display: "block" }}>
          {fetchError}
        </Typography>
      )}
      {loading && <LinearProgress sx={{ borderRadius: 1 }} />}
      {!fetchError && !loading && rowData.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {intl.formatMessage({ id: "label.changeStrategy.history.empty" })}
        </Typography>
      )}
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: "8px",
          overflow: "hidden",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "action.hover" : "rgba(15, 23, 42, 0.03)",
        }}
      >
        <HAgGrid
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          gridStyle={gridStyle}
          pagination
          paginationPageSize={8}
          sort
        />
      </Box>
    </Box>
  );
}
