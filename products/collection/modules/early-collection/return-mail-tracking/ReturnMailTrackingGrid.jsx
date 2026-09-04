import React, { useMemo } from "react";
import "./returnMailTrackingGrid.css";
import { Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { HBox, HPaper, HAgGrid } from "@helix/component-library";

import { createReturnMailTrackingColumnDefs } from "./returnMailTrackingColumnDefs.jsx";

/**
 * Return mail tracking list — Interface Delight chrome aligned with mail history / follow-up history grids.
 */
export default function ReturnMailTrackingGrid({ rowData, loading, loadError, onPatchRow, reasonOptions }) {
  const intl = useIntl();

  const columnDefs = useMemo(
    () => createReturnMailTrackingColumnDefs(intl, { onPatchRow, reasonOptions }),
    [intl, onPatchRow, reasonOptions],
  );

  const objCustomGridStyle = {
    width: "100%",
    height: "min(480px, 55vh)",
    minHeight: 280,
    minWidth: 0,
    overflowX: "auto",
    "--ag-borders": "none",
  };

  const rows = rowData || [];
  const empty = !loading && !loadError && !rows.length;
  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "var(--drs-border-divider)",
        bgcolor: "var(--drs-bg-paper)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        width: "100%",
      }}
    >
      <HBox sx={{ flex: 1, minHeight: 0, flexDirection: "column", p: 0 }}>
        {loadError && (
          <Typography variant="caption" sx={{ px: 2, py: 1.5, color: "error.main", fontSize: 11 }}>
            {loadError}
          </Typography>
        )}
        {empty && !loadError && (
          <Typography variant="caption" sx={{ px: 2, py: 1.5, color: "var(--drs-text-muted)", fontSize: 11 }}>
            {intl.formatMessage({ id: "label.returnMailTracking.grid.empty" })}
          </Typography>
        )}
        <HAgGrid
          rowData={rows}
          columnDefs={columnDefs}
          gridStyle={objCustomGridStyle}
          gridClassName="drs-list-grid drs-followup-history-grid drs-return-mail-grid"
          embeddedInSection
          pagination={rows.length > 7}
          paginationPageSize={7}
          sort
          showTitle={false}
          hideInternalSaveButton
          allowAdd={false}
          allowDelete={false}
          allowUpdate={false}
          isLoading={loading}
        />
      </HBox>
    </HPaper>
  );
}
