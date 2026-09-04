import React from "react";
import { Box, Typography } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useIntl } from "react-intl";
import StrategyHistoryGrid from "./StrategyHistoryGrid.jsx";

const delightStackGap = 2.5;

/**
 * Interface Delight–aligned single column: info strip → form → history (all in one scroll).
 * @param {object} props
 * @param {React.ReactNode} props.form — strategy update fields
 * @param {object[]} props.historyRows
 * @param {boolean} props.historyLoading
 * @param {string|null} props.historyError
 */
export default function ChangeStrategyDetails({ form, historyRows, historyLoading, historyError }) {
  const intl = useIntl();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: delightStackGap,
        p: 2,
        maxWidth: { xs: "100%", sm: 672 },
        width: "100%",
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          p: 1.5,
          borderRadius: "8px",
          border: 1,
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "action.hover" : "rgba(15, 23, 42, 0.06)",
        }}
      >
        <InfoOutlined sx={{ fontSize: 14, color: "text.secondary", mt: "2px", flexShrink: 0 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          <Typography sx={{ fontSize: "11px", lineHeight: 1.45, color: "text.secondary" }}>
            {intl.formatMessage({ id: "label.changeStrategy.info.line1" })}
          </Typography>
          <Typography sx={{ fontSize: "11px", lineHeight: 1.45, color: "text.secondary" }}>
            {intl.formatMessage({ id: "label.changeStrategy.info.line2" })}
          </Typography>
        </Box>
      </Box>

      {form}

      <StrategyHistoryGrid
        rowData={historyRows}
        loading={Boolean(historyLoading)}
        fetchError={historyError}
      />
    </Box>
  );
}
