/**
 * Maps Flowable / technical workflow errors to short business-friendly UI text.
 * Full technical messages should remain in server logs only.
 */
const MAX_LEN = 100;

export function toFriendlyWorkflowError(technical) {
  const t = (technical ?? "").trim();
  if (!t || t === "—") return "";

  const lower = t.toLowerCase();
  let friendly;

  if (
    lower.includes("no outgoing sequence flow") ||
    lower.includes("could be selected for continuing") ||
    (lower.includes("exclusive gateway") && lower.includes("sequence flow"))
  ) {
    friendly = "Unable to determine the next workflow step.";
  } else if (
    lower.includes("condition") &&
    (lower.includes("sequence flow") || lower.includes("gateway") || lower.includes("outgoing"))
  ) {
    friendly = "Workflow routing condition not satisfied.";
  } else if (
    includesAny(lower, [
      "unknown property",
      "cannot resolve identifier",
      "property not found",
      "couldn't resolve",
      "could not resolve",
      "el1008e",
      "el1007e",
    ]) ||
    (lower.includes("variable") && includesAny(lower, ["missing", "null", "unknown", "resolve"]))
  ) {
    friendly = includesAny(lower, ["apprej", "approve", "approval", "decision"])
      ? "Approval decision is missing."
      : "Required workflow variable is missing.";
  } else if (
    includesAny(lower, ["apprej", "approval decision"]) ||
    (lower.includes("approve") && lower.includes("expression"))
  ) {
    friendly = "Approval decision is missing.";
  } else if (
    includesAny(lower, ["connection refused", "timed out", "timeout", "connectexception", "unavailable"])
  ) {
    friendly = "External system is temporarily unavailable.";
  } else if (lower.includes("script") && includesAny(lower, ["exception", "error", "failed"])) {
    friendly = "Workflow script failed to complete.";
  } else if (lower.includes("deadletter") || lower.includes("retries have been exhausted")) {
    friendly = "Workflow activity failed after all retries.";
  } else if (t.length <= MAX_LEN && !looksTechnical(lower)) {
    friendly = t;
  } else {
    friendly = "Workflow activity failed.";
  }

  return friendly.length <= MAX_LEN ? friendly : `${friendly.slice(0, MAX_LEN - 1).trim()}…`;
}

/** Display value for Error Details column — friendly text or em dash. */
export function formatErrorDetailsColumn(technical) {
  const friendly = toFriendlyWorkflowError(technical);
  return friendly || "—";
}

function includesAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n));
}

function looksTechnical(lower) {
  return (
    lower.includes("execution[") ||
    lower.includes("org.flowable") ||
    lower.includes("exception") ||
    lower.includes("gateway_") ||
    lower.includes("activity_") ||
    lower.includes("continuing the process") ||
    lower.length > MAX_LEN
  );
}
