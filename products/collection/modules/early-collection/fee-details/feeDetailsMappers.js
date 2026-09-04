/**
 * Maps col-accountmanagement fee history API rows to CommonAgGrid row shape.
 */
export function mapFeeHistoryRow(item, locale) {
  const d = (v) => (v ? new Date(v).toLocaleString(locale) : "");
  return {
    RequestDate: d(item.dtCreatedOn),
    RequestFor: item.chRequestFor === "C" ? "CHARGE" : "WAIVE",
    Fee: item.szFeeCode ?? "",
    Amount: item.bdAmount ?? 0,
    RequestBy: item.szCreatedBy ?? "",
    Status: item.szAuthStatus ?? "",
    DecisionBy: item.szModifiedBy ?? "",
    DecisionOn: d(item.dtModifiedOn),
    Downloaded: item.chDownloaded ?? "",
    Acknowledged: item.chAcknowledged ?? "",
  };
}

/**
 * Maps fetchWaiveDetails API rows to CommonAgGrid row shape.
 */
export function mapWaiveRow(item) {
  return {
    PaymentHead: item.szFeeCode || "",
    Paid: item.bdPaidAmount || 0,
    Waived: item.bdWaivedAmount || 0,
    Overdue: item.bdDueAmount || 0,
    NotYetDue: item.bdNydAmount || 0,
    PendingRequests: item.chWaiveable || 0,
    WaiveNow: "",
    Reason: item.szReasonCode || "",
  };
}

/**
 * Builds szReasonCode for charge: structured reason plus optional remarks (single DTO field).
 */
export function buildChargeReasonCode(chargeReason, remarks, maxLen = 240) {
  const r = String(chargeReason || "").trim();
  const m = String(remarks || "").trim();
  if (!m) return r;
  const combined = `${r} | ${m}`;
  return combined.length > maxLen ? combined.slice(0, maxLen) : combined;
}
