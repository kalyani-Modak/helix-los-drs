import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { useIntl } from "react-intl";
import { HBox, HLabel, HPaper, HAgGrid } from "@helix/component-library";

import { createMailHistoryColDefs, mailHistoryDefaultColDef } from "./generateMailGridDef";

/**
 * Correspondence history from {@code COL_TRN_MAIL} (server) or empty state.
 * @param {{
 *   rowData?: object[],
 *   datasource?: object | null,
 *   cacheBlockSize?: number,
 *   maxBlocksInCache?: number,
 *   totalElements?: number,
 *   loading?: boolean,
 *   loadError?: string | null,
 * }} props
 */
export default function MailHistoryGrid({
  rowData,
  datasource = null,
  cacheBlockSize = 10,
  maxBlocksInCache = 2,
  totalElements = 0,
  loading = false,
  loadError = null,
}) {
  const intl = useIntl();

  const columnDefs = useMemo(() => createMailHistoryColDefs(intl), [intl]);
  const defaultColDef = useMemo(() => mailHistoryDefaultColDef(), []);

  const objCustomGridStyle = {
    width: "100%",
    height: "min(360px, 32vh)",
    minHeight: 220,
    minWidth: "280px",
    overflowX: "auto",
    "--ag-borders": "none",
  };

  const rows = rowData || [];
  const count = Number(totalElements) > 0 ? Number(totalElements) : rows.length;
  const useInfinite = !!datasource;
  const empty = !loading && !loadError && count === 0;

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
      }}
    >
      <HBox
        sx={{
          py: 1.5,
          px: 2,
          flexShrink: 0,
          bgcolor: "var(--drs-grid-header-bg)",
          borderBottom: 1,
          borderColor: "var(--drs-border-divider)",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, bgcolor: "transparent" }}>
          <MailOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
          <HLabel
            value="label.generateMail.history.title"
            colon={false}
            translate
            align="left"
            component="div"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--drs-text-primary)",
            }}
          />
        </HBox>
        <Typography
          variant="caption"
          sx={{ fontSize: 10, color: "var(--drs-text-muted)" }}
        >
          {intl.formatMessage({ id: "label.generateMail.history.count" }, { count })}
        </Typography>
      </HBox>
      <HBox sx={{ flex: 1, minHeight: 0, flexDirection: "column", p: 0 }}>
        {loading && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1.5,
              color: "var(--drs-text-muted)",
              fontSize: 11,
            }}
          >
            {intl.formatMessage({ id: "label.generateMail.history.loading" })}
          </Typography>
        )}
        {loadError && (
          <Typography variant="caption" sx={{ px: 2, py: 1.5, color: "error.main", fontSize: 11 }}>
            {loadError}
          </Typography>
        )}
        {empty && (
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1.5,
              color: "var(--drs-text-muted)",
              fontSize: 11,
            }}
          >
            {intl.formatMessage({ id: "label.generateMail.history.empty" })}
          </Typography>
        )}
        <HAgGrid
          rowData={useInfinite ? undefined : rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridStyle={objCustomGridStyle}
          gridClassName="drs-list-grid drs-generate-mail-history-grid"
          embeddedInSection
          rowModelType={useInfinite ? "infinite" : "clientSide"}
          datasource={useInfinite ? datasource : undefined}
          cacheBlockSize={useInfinite ? cacheBlockSize : undefined}
          maxBlocksInCache={useInfinite ? maxBlocksInCache : undefined}
          pagination={count > 0}
          paginationPageSize={cacheBlockSize}
          domLayout="normal"
          sort
          isLoading={loading}
        />
      </HBox>
    </HPaper>
  );
}
