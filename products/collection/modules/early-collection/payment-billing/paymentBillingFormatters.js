/** Interface Delight token references (light theme) for comments only. */
// success: hsl(142, 71%, 45%)  muted-foreground: hsl(215, 14%, 46%)  destructive: hsl(0, 72%, 51%)

export const PAYMENT_GRID_DELIGHT = {
  success: "hsl(142, 71%, 45%)",
  mutedForeground: "hsl(215, 14%, 46%)",
  destructive: "hsl(0, 72%, 51%)",
};

function toPaymentNumber(value) {
  if (value == null || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const n = cleaned !== "" ? Number(cleaned) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function sumPaymentAmounts(rows) {
  if (!Array.isArray(rows)) return 0;
  return rows.reduce((acc, row) => {
    return acc + toPaymentNumber(row?.bdAmount);
  }, 0);
}

export function formatGridDate(value, locale) {
  if (value == null || value === "") return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale || undefined);
}
