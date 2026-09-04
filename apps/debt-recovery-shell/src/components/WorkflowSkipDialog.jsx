import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export function WorkflowSkipDialog({ open, busy, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Skip Workflow Activity</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to skip the current activity? The workflow will move to the next configured
          activity. This action should only be performed by authorized users.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={busy} className="drs-themed-button">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="warning"
          disabled={busy}
          className="drs-themed-button"
        >
          {busy ? "Skipping…" : "Skip"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default WorkflowSkipDialog;
