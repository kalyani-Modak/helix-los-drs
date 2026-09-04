import React from "react";
import { Chip, Stack, Typography, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIntl } from "react-intl";
import { HBox, HPaper, HDialog } from "@helix/component-library";
import GroupFollowupForm from "./GroupFollowupForm";

// Slide transition from right to left
const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function GroupFollowupPopup({
  open,
  onClose,
  selectedAccounts = [],
  onSuccess,
  gridApiRef,
}) {
  const intl = useIntl();

  return (
    <HDialog disableContentWrapper open={open} onClose={onClose} slots={{ transition: Transition }} slotProps={{ paper: {
        sx: {
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          margin: 0,
          borderRadius: 0,
          width: { xs: "100%", sm: 500, md: 600 },
          maxWidth: "90vw",
          height: "100vh",
          maxHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        },
      } }}>
      <HPaper
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Stack direction="column" spacing={0.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {intl.formatMessage({
              id: "label.followup.bulk.title",
              defaultMessage: "Group Follow Up",
            })}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip
              label={`${selectedAccounts.length} ${intl.formatMessage({
                id: "label.followup.bulk.accounts",
                defaultMessage: "Accounts Selected",
              })}`}
              size="small"
              color="primary"
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="caption" color="text.secondary">
              {selectedAccounts
                .slice(0, 3)
                .map((acc) => acc.ACT_NO ?? acc.ACNT_SEQNO ?? "")
                .filter(Boolean)
                .join(",  ")}
              {selectedAccounts.length > 3 && ` +${selectedAccounts.length - 3} more`}
            </Typography>
          </Stack>
        </Stack>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </HPaper>

      <HPaper sx={{ p: 0, overflowY: "auto", flex: 1 }}>
        {open && (
          <GroupFollowupForm
            selectedAccounts={selectedAccounts}
            onSuccess={(processedAccounts) => {
              if (onSuccess) onSuccess(processedAccounts);
              onClose();
            }}
            onCancel={onClose}
            gridApiRef={gridApiRef}
          />
        )}
      </HPaper>
    </HDialog>
  );
}
