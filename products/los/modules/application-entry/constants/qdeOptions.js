/** Non-lookup defaults and configuration for the QDE screen. */
export const DEFAULT_PORTFOLIO = "HL";
export const DEFAULT_LOAN_TYPE = "TERM";

/** Verification lifecycle values persisted on the form. */
export const VERIFICATION_STATUS = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  FAILED: "Failed",
};

const STATUS_LABEL_KEYS = {
  Pending: "label.qde.status.pending",
  Verified: "label.qde.status.verified",
  Failed: "label.qde.status.failed",
};

/** Maps a persisted verification status to its i18n key for HLabel. */
export const statusLabelKey = (status) =>
  STATUS_LABEL_KEYS[status] || "label.qde.status.notStarted";

/* -------------------------------------------------------------------------- */
/* Borrower / Customer                                                       */
/* -------------------------------------------------------------------------- */

export const BORROWER_TYPE_NON_INDIVIDUAL = "Non-Individual";