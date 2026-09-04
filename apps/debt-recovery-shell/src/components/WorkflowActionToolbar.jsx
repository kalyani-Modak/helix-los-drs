import { useState } from "react";
import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import * as losApi from "../api/losApi";
import { resolveWorkflowActionState } from "../utils/workflowActionState";
import { WorkflowSkipDialog } from "./WorkflowSkipDialog";

/**
 * @typedef {Object} SelectedActivityForActions
 * @property {string} activityId
 * @property {string} [activityName]
 * @property {string} [activityType]
 * @property {string} [status]
 */

function extractApiError(e) {
  if (e && typeof e === "object" && "response" in e) {
    const resp = e.response;
    if (resp?.data?.message) return resp.data.message;
  }
  return e instanceof Error ? e.message : String(e);
}

function statusUpper(status) {
  return (status ?? "").toUpperCase().trim().replace(/[\s-]+/g, "_");
}

function isRunningOrWaiting(status) {
  const s = statusUpper(status);
  return (
    s === "ACTIVE" ||
    s === "IN_PROGRESS" ||
    s === "RUNNING" ||
    s === "PENDING" ||
    s === "WAITING" ||
    s === "SUSPENDED"
  );
}

function isFailedStatus(status) {
  const s = statusUpper(status);
  return s === "ERROR" || s === "FAILED" || s === "REJECTED";
}

function isUserTaskType(activityType) {
  const t = (activityType ?? "").toLowerCase();
  return t.includes("usertask") || t === "user";
}

/** Flowable System Activity = external worker / service task (topic dummysys). */
function isSystemActivityType(activityType) {
  const t = (activityType ?? "").toLowerCase();
  return (
    t.includes("externalworkerservicetask") ||
    t.includes("external") ||
    t.includes("servicetask") ||
    t === "service"
  );
}

function isCompletableActivityType(activityType) {
  return isUserTaskType(activityType) || isSystemActivityType(activityType);
}

/**
 * @param {{
 *   app: losApi.LosApplication|null,
 *   appNo: string|undefined,
 *   onReload: () => Promise<void>,
 *   showCompleteTask?: boolean,
 *   onCompleteTask?: () => Promise<void>,
 *   busy?: boolean,
 *   processInstanceId?: string|null,
 *   requireActivitySelection?: boolean,
 *   selectedActivity?: SelectedActivityForActions|null,
 *   onClearSelection?: () => void,
 *   trailingActions?: import("react").ReactNode,
 * }} props
 */
export function WorkflowActionToolbar({
  app,
  appNo,
  onReload,
  showCompleteTask,
  onCompleteTask,
  busy: externalBusy,
  processInstanceId,
  requireActivitySelection = false,
  selectedActivity = null,
  onClearSelection,
  trailingActions,
}) {
  const [retrying, setRetrying] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const { canRetry, canSkip } = resolveWorkflowActionState(app);
  const isError = (app?.workflowStatus ?? "").toUpperCase() === "ERROR";
  const isCompleted = (app?.workflowStatus ?? "").toUpperCase() === "COMPLETED";
  const busy = externalBusy || retrying || skipping;

  const hasSelection = Boolean(selectedActivity?.activityId);
  const selectionGateOk = !requireActivitySelection || hasSelection;

  const selectedIsRunning = isRunningOrWaiting(selectedActivity?.status);
  const selectedIsFailed =
    isFailedStatus(selectedActivity?.status) ||
    (isError && selectedActivity?.activityId === app?.failedActivityId);
  const selectedIsCompletableType = isCompletableActivityType(selectedActivity?.activityType);

  const canCompleteSelected =
    selectionGateOk &&
    !busy &&
    !isError &&
    !isCompleted &&
    (!requireActivitySelection
      ? Boolean(app?.currentTaskId)
      : selectedIsCompletableType && selectedIsRunning);

  const canSkipSelected =
    canSkip && selectionGateOk && !busy && (!requireActivitySelection || selectedIsRunning || selectedIsFailed);

  // Retry: prefer selected activity, else recorded failed activity, else first retryable job element.
  const canRetrySelected = canRetry && !busy;

  async function onRetry() {
    if (!appNo) return;
    setRetrying(true);
    setToast(null);
    try {
      const activityId =
        selectedActivity?.activityId ||
        app?.failedActivityId ||
        app?.retryableActivityIds?.[0] ||
        null;
      const res = await losApi.retryApplication(appNo, processInstanceId, activityId);
      setToast({ severity: "success", text: res.message || "Workflow activity retried successfully." });
      onClearSelection?.();
      await onReload();
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
    } finally {
      setRetrying(false);
    }
  }

  async function onSkipConfirm() {
    if (!appNo) return;
    setSkipping(true);
    setToast(null);
    try {
      const res = await losApi.skipApplication(
        appNo,
        undefined,
        processInstanceId,
        requireActivitySelection ? selectedActivity?.activityId : undefined,
      );
      setToast({
        severity: "success",
        text:
          res.message ||
          `Skipped ${res.skippedActivityName ?? "activity"} → ${res.nextActivityName ?? "next activity"}`,
      });
      setSkipOpen(false);
      onClearSelection?.();
      await onReload();
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
    } finally {
      setSkipping(false);
    }
  }

  return (
    <div className="los-workflow-action-toolbar">
      <Stack
        direction="row"
        spacing={0.75}
        flexWrap="nowrap"
        useFlexGap
        alignItems="center"
        className="los-quick-actions"
      >
        {showCompleteTask && onCompleteTask && (
          <Button
            size="small"
            variant="contained"
            color="success"
            className="drs-themed-button"
            disabled={!canCompleteSelected}
            title={
              requireActivitySelection && !hasSelection
                ? "Select a running user task or system activity on the diagram"
                : requireActivitySelection && hasSelection && !selectedIsCompletableType
                  ? "Complete applies to user tasks and system activities"
                  : undefined
            }
            onClick={() => void onCompleteTask()}
          >
            {externalBusy ? "Working…" : "Complete task"}
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          color="warning"
          className="drs-themed-button"
          disabled={!canRetrySelected}
          title={
            requireActivitySelection && !hasSelection
              ? "Select the failed activity on the diagram"
              : undefined
          }
          onClick={() => void onRetry()}
          startIcon={retrying ? <CircularProgress size={14} color="inherit" /> : <ReplayOutlinedIcon />}
        >
          {retrying ? "Retrying…" : "Retry"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          className="drs-themed-button"
          disabled={!canSkipSelected}
          title={
            requireActivitySelection && !hasSelection
              ? "Select a running activity on the diagram to skip"
              : undefined
          }
          onClick={() => setSkipOpen(true)}
          startIcon={skipping ? <CircularProgress size={14} /> : <SkipNextOutlinedIcon />}
        >
          {skipping ? "Skipping…" : "Skip"}
        </Button>
        {trailingActions}
      </Stack>

      {toast && (
        <Alert
          severity={toast.severity}
          className="los-workflow-action-toolbar__toast"
          sx={{ mt: 1, mb: 0, borderRadius: 2 }}
          onClose={() => setToast(null)}
        >
          {toast.text}
        </Alert>
      )}

      <WorkflowSkipDialog
        open={skipOpen}
        busy={skipping}
        onClose={() => setSkipOpen(false)}
        onConfirm={() => void onSkipConfirm()}
      />
    </div>
  );
}

export default WorkflowActionToolbar;
