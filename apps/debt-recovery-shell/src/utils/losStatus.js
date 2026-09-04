/** Status colors/labels for LOS application & workflow status chips (Application list page). */
export const DASHBOARD_STATUS_COLORS = {
  total: "#64748b",
  completed: "#4CAF50",
  inProgress: "#2196F3",
  pending: "#FFC107",
  error: "#FF9800",
  rejected: "#F44336",
};

export function workflowStatusColor(status) {
  const s = String(status || "").toUpperCase();
  if (s === "COMPLETED") return DASHBOARD_STATUS_COLORS.completed;
  if (s === "IN_PROGRESS") return DASHBOARD_STATUS_COLORS.inProgress;
  if (s === "PENDING") return DASHBOARD_STATUS_COLORS.pending;
  if (s === "ERROR") return DASHBOARD_STATUS_COLORS.error;
  if (s === "REJECTED") return DASHBOARD_STATUS_COLORS.rejected;
  return DASHBOARD_STATUS_COLORS.total;
}

export function workflowStatusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "IN_PROGRESS") return "In Progress";
  if (s === "COMPLETED") return "Completed";
  if (s === "PENDING") return "Pending";
  if (s === "ERROR") return "Error";
  if (s === "REJECTED") return "Rejected";
  return status;
}
