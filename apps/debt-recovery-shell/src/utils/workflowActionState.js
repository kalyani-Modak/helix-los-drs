/**
 * @typedef {Object} WorkflowActionState
 * @property {string} workflowStatus
 * @property {boolean} canRetry
 * @property {boolean} canSkip
 */

/**
 * @param {import("../api/losApi").LosApplication|null} app
 * @returns {WorkflowActionState}
 */
export function resolveWorkflowActionState(app) {
  const ws = (app?.workflowStatus ?? "IN_PROGRESS").toUpperCase();
  const appStatus = (app?.status ?? "").toUpperCase();
  const isTerminal =
    ws === "COMPLETED" ||
    ws === "REJECTED" ||
    ws === "CANCELLED" ||
    appStatus.includes("REJECT") ||
    appStatus.includes("CANCEL");

  return {
    workflowStatus: ws,
    canRetry: (ws === "ERROR" || Boolean(app?.hasRetryableJobs)) && !isTerminal,
    canSkip: (ws === "IN_PROGRESS" || ws === "ERROR" || ws === "PENDING") && !isTerminal,
  };
}
