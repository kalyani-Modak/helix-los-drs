/**
 * Configurable address field list for Return Mail Tracking until the canonical
 * address table / API contract is finalized. Swap `getAddressFieldsForUi` or
 * `buildAddressPayloadPatch` when the backend is ready without touching screen JSX.
 */

const FIELD_KEYS = [
  "address1",
  "address2",
  "address3",
  "address4",
  "area",
  "city",
  "state",
  "zip",
];

/**
 * @returns {{ name: string, componentType: "HTextField", valueKey: string, optional: boolean }[]}
 */
export function getAddressFieldsForUi() {
  return FIELD_KEYS.map((valueKey) => ({
    name: `label.returnMailTracking.address.${valueKey}`,
    componentType: "HTextField",
    valueKey,
    optional: true,
  }));
}

/**
 * @param {Record<string, string>} formSlice — keys: address1…zip as used by ReturnMailAddressSection
 * @returns {{ addressLines: Record<string, string>, meta: { source: string } }}
 */
export function buildAddressPayloadPatch(formSlice) {
  const addressLines = {};
  for (const k of FIELD_KEYS) {
    addressLines[k] = formSlice[k] != null ? String(formSlice[k]) : "";
  }
  return {
    addressLines,
    meta: { source: "return-mail-tracking-placeholder" },
  };
}
