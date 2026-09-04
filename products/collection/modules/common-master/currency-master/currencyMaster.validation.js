function parseOptionalNumber(str) {
  if (str == null || String(str).trim() === "") return { ok: true, value: null };
  const n = Number(str);
  if (!Number.isFinite(n)) {
    return { ok: false };
  }
  return { ok: true, value: n };
}

/**
 * @param {object} formDraft
 * @param {import('react-intl').IntlShape} intl
 * @param {{ uiMode: string, existingCodes: Set<string> }} options
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateCurrencyForm(formDraft, intl, options) {
  const { uiMode, existingCodes } = options;

  const code = String(formDraft.szCurrencyCode ?? "").trim();
  const name = String(formDraft.szCurrencyName ?? "").trim();
  const symbol = String(formDraft.szSymbol ?? "").trim();

  if (!code) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.CurrencyCode.mandatory",
        defaultMessage: "Currency code is required.",
      }),
    };
  }
  if (!name) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.CurrencyName.mandatory",
        defaultMessage: "Currency name is required.",
      }),
    };
  }
  if (!symbol) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "error.Symbol.mandatory",
        defaultMessage: "Symbol is required.",
      }),
    };
  }

  if (uiMode === "new" && existingCodes.has(code.toUpperCase())) {
    return {
      ok: false,
      message: intl.formatMessage({
        id: "validation.currencyMaster.duplicateCode",
        defaultMessage: "A currency with this code already exists.",
      }),
    };
  }

  const rateFields = [
    { key: "bdRate", id: "validation.currencyMaster.invalidRate" },
    { key: "bdBuyingRate", id: "validation.currencyMaster.invalidBuyingRate" },
    { key: "bdSellingRate", id: "validation.currencyMaster.invalidSellingRate" },
  ];

  for (const { key, id } of rateFields) {
    const r = parseOptionalNumber(formDraft[key]);
    if (!r.ok) {
      return {
        ok: false,
        message: intl.formatMessage({
          id,
          defaultMessage: "Enter a valid number.",
        }),
      };
    }
  }

  return { ok: true };
}
