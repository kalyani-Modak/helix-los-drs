/**
 * UI guard: account context is established via AccountList → createAccountContext;
 * transaction screens must not send selectedRow fields in API bodies.
 * @param {object|null|undefined} selectedRow
 * @returns {boolean}
 */
export function hasSelectedAccount(selectedRow) {
  return selectedRow?.ACNT_SEQNO != null && selectedRow?.ACNT_SEQNO !== "";
}

/** Portfolios that use property asset API instead of auto list. */
const PROPERTY_PORTFOLIO_PREFIXES = ["HL", "ML", "PL", "PR"];

export function isPropertyPortfolio(portfolioCode) {
  const p = String(portfolioCode || "").toUpperCase();
  if (!p) return false;
  return PROPERTY_PORTFOLIO_PREFIXES.some((prefix) => p.startsWith(prefix));
}