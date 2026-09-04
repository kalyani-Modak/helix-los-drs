/**
 * Business rule: only collection address types are editable.
 * Backend may return varying labels (e.g. "Collection Address", "Collections").
 */
export function isEditableAddressType(szAddressType) {
  return isCollectionAddressType(szAddressType);
}

export function isCollectionAddressType(szAddressType) {
  if (szAddressType == null) return false;
  const n = String(szAddressType).trim().toLowerCase().replace(/\s+/g, " ");
  if (!n) return false;
  if (n === "cu") return true;
  if (n === "co") return true;
  if (n === "collection address") return true;
  if (n === "collections") return true;
  if (n.includes("collection") && n.includes("address")) return true;
  return n === "collection" || n.endsWith("collection address");
}
