function hasSelectedAccount(selectedRow) {
  return (selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) != null && (selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) !== "";
}
const PROPERTY_PORTFOLIO_PREFIXES = ["HL", "ML", "PL", "PR"];
function isPropertyPortfolio(portfolioCode) {
  const p = String(portfolioCode || "").toUpperCase();
  if (!p) return false;
  return PROPERTY_PORTFOLIO_PREFIXES.some((prefix) => p.startsWith(prefix));
}
export {
  hasSelectedAccount as h,
  isPropertyPortfolio as i
};
