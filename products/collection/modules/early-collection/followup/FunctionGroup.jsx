import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CreditCard from "@mui/icons-material/CreditCard";
import Send from "@mui/icons-material/Send";
import { useIntl } from "react-intl";

const DEFAULT_TITLE_IDS = {
  core: "label.followup.recordFollowUpTitle",
  promise: "label.followup.section.promise",
  contact: "label.followup.section.contact",
};

/**
 * Interface Delight–style stacked section cards (no accordions): follow-up, promise, contact.
 */
function DelightSectionCard({ titleId, icon: Icon, children, "data-section": dataSection }) {
  const intl = useIntl();
  const theme = useTheme();
  const headerBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.06)
      : alpha(theme.palette.grey[900], 0.035);

  return (
    <Paper
      variant="outlined"
      component="section"
      data-section={dataSection}
      elevation={0}
      sx={{
        borderRadius: 2,
        mb: 2,
        overflow: "hidden",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2,
          bgcolor: headerBg,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {Icon && <Icon sx={{ fontSize: 18, color: "primary.main" }} />}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}>
            {intl.formatMessage({ id: titleId })}
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Paper>
  );
}

export default function FunctionGroup({
  followupSlot,
  promiseSlot,
  contactSlot,
  variant = "followup",
  sectionTitleIds,
}) {
  const titleIds = {
    core: sectionTitleIds?.core ?? DEFAULT_TITLE_IDS.core,
    promise: sectionTitleIds?.promise ?? DEFAULT_TITLE_IDS.promise,
    contact: sectionTitleIds?.contact ?? DEFAULT_TITLE_IDS.contact,
  };

  const idPrefix =
    variant === "changeStrategy"
      ? "change-strategy-fg"
      : variant === "paymentBilling"
        ? "payment-billing-fg"
        : "followup-fg";

  const CoreIcon = variant === "paymentBilling" ? CreditCard : Send;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <DelightSectionCard titleId={titleIds.core} icon={CoreIcon} data-section={`${idPrefix}-core`}>
        {followupSlot}
      </DelightSectionCard>
      <DelightSectionCard titleId={titleIds.promise} data-section={`${idPrefix}-promise`}>
        {promiseSlot}
      </DelightSectionCard>
      <DelightSectionCard titleId={titleIds.contact} data-section={`${idPrefix}-contact`}>
        {contactSlot}
      </DelightSectionCard>
    </Box>
  );
}
