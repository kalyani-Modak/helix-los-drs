export function mapReasonTextToKey(text, reasonOptions = []) {
  if (!text) return "";

  const normalizedText = String(text).toLowerCase().trim();

  const match = reasonOptions.find(
    (item) =>
      String(item.label).toLowerCase().trim() === normalizedText ||
      String(item.i18nKey || "").toLowerCase().trim() === normalizedText
  );

  return match ? match.value : "";
}

export function formatReasonKey(reasonOptions, key) {
  if (!key) return "";

  const match = reasonOptions.find((item) => item.value === key);

  return match ? match.label : "";
}
