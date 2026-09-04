import { formatGridDate } from "./paymentBillingFormatters";

function firstDefined(obj, keys) {
  if (!obj) return undefined;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (obj[key] != null && obj[key] !== "") return obj[key];
  }
  return undefined;
}

function num(a, b) {
  const x = a != null && a !== "" ? Number(a) : 0;
  const y = b != null && b !== "" ? Number(b) : 0;
  const nx = Number.isFinite(x) ? x : 0;
  const ny = Number.isFinite(y) ? y : 0;
  return nx + ny;
}

/**
 * Maps Col_Trn_Billing API row (Jackson property names from ColTrnBillingEntity) to billing grid row.
 */
export function mapBillingGridRow(entity, index, locale) {
  const otherDebits = num(entity.bdOtherDebits, entity.bdFeesCharged);
  const billingDate = firstDefined(entity, ["dtBillingDate", "billingDate", "date"]);
  const dueDate = firstDefined(entity, ["dtDueDate", "dueDate", "dtNextDueDate"]);
  return {
    sr: index + 1,
    date: billingDate != null ? formatGridDate(billingDate, locale) : "",
    billAmt: firstDefined(entity, ["bdBillAmount", "billAmt", "billAmount"]),
    dueDate: dueDate != null ? formatGridDate(dueDate, locale) : "",
    dueAmt: firstDefined(entity, ["bdAmountDue", "dueAmt", "dueAmount", "bdNextDueAmt"]),
    prevBalance: firstDefined(entity, ["bdPreviousBalance", "prevBalance", "previousBalance"]),
    freshPurchase: firstDefined(entity, ["bdFreshPurchases", "freshPurchase", "freshPurchases"]),
    otherDebits,
    paymentReceived: firstDefined(entity, ["bdPaymentReceived", "paymentReceived"]),
    otherCredits: firstDefined(entity, ["bdOtherCredits", "otherCredits"]),
  };
}

/**
 * Maps Col_Trn_Schedule API row to installment grid row.
 */
export function mapInstallmentGridRow(entity, locale) {
  const dueDate = firstDefined(entity, ["dtDueDate", "dueDate", "dtNextDueDate"]);
  return {
    sr: firstDefined(entity, ["inInstallmentNo", "installmentNo", "sr"]),
    dueDate: dueDate != null ? formatGridDate(dueDate, locale) : "",
    dueAmount: firstDefined(entity, ["bdInstAmt", "dueAmount", "bdDueAmount", "bdAmountDue"]),
    status: firstDefined(entity, ["szStatus", "status", "installmentStatus"]) ?? "",
    principal: firstDefined(entity, ["bdPrinAmt", "principal", "bdPrincipal"]),
    interest: firstDefined(entity, ["bdIntAmt", "interest", "bdInterest"]),
    other: firstDefined(entity, ["bdOtherAmt", "other", "otherAmount"]),
  };
}
