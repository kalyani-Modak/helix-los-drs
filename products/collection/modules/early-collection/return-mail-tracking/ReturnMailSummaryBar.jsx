import React, { useMemo } from "react";
import { Typography, Chip } from "@mui/material";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useIntl } from "react-intl";

import { HBox } from "@helix/component-library";

export default function ReturnMailSummaryBar({ rows }) {
  const intl = useIntl();
  const badCount = useMemo(
    () => (rows || []).filter((r) => String(r?.badMarked || "").toUpperCase() === "Y").length,
    [rows],
  );

  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "nowrap",
        bgcolor: "transparent",
        width: "100%",
      }}
    >
      <HBox
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 0.75,
          bgcolor: "transparent",
          flexShrink: 0,
        }}
      >
        <MailOutlinedIcon sx={{ fontSize: 14, color: "var(--drs-text-muted)" }} />
        <Typography variant="caption" sx={{ fontSize: 11, color: "var(--drs-text-muted)" }}>
          {intl.formatMessage({ id: "label.returnMailTracking.summary.lettersSent" }, { count: (rows || []).length })}
        </Typography>
      </HBox>
      {badCount > 0 ? (
        <Chip
          size="small"
          icon={<WarningAmberOutlinedIcon sx={{ fontSize: "14px !important" }} />}
          label={intl.formatMessage({ id: "label.returnMailTracking.summary.badAddressBadge" }, { count: badCount })}
          color="error"
          variant="outlined"
          sx={{ height: 24, fontSize: 10, flexShrink: 0, "& .MuiChip-label": { px: 0.75 } }}
        />
      ) : null}
    </HBox>
  );
}
