/**
 * Master-detail layouts aligned with Interface Delight AssetSummaryPanel field order.
 * Summary row uses selectable cards (same UX as Delight); detail uses full row payload from API.
 * Field keys match AssetDetailsService summary maps (AUTO / JEWEL / MACHINE / PROPERTY).
 */

/** @typedef {{ key: string, labelId: string, colSpan?: 1 | 2 | 3, fallbackKeys?: string[] }} DetailFieldDef */

/**
 * @param {string | undefined | null} szAssetType
 * @returns {"AUTO" | "JEWEL" | "MACHINE" | "PROPERTY" | "UNKNOWN"}
 */
export function normalizeAssetType(szAssetType) {
  const u = String(szAssetType ?? "").toUpperCase();
  if (u.includes("AUTO") || u === "AU") return "AUTO";
  if (u.includes("JEWEL")) return "JEWEL";
  if (u.includes("MACHINE") || u.includes("MACHIN")) return "MACHINE";
  if (u.includes("PROPERTY") || u.includes("PROP")) return "PROPERTY";
  return "UNKNOWN";
}

export function getNormalizedTypeFromAsset(asset) {
  return asset?.assetTypeMeta?.normalizedType || normalizeAssetType(asset?.szAssetType);
}

/** @type {DetailFieldDef[]} */
export const AUTO_DETAILS_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szProductType", labelId: "label.AssetSummary.detail.productType", fallbackKeys: ["szAssetType"] },
  { key: "szMake", labelId: "label.AssetSummary.detail.make" },
  { key: "szModel", labelId: "label.AssetSummary.detail.model" },
  { key: "inYearMfg", labelId: "label.AssetSummary.detail.modelYear" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 3 },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" },
];

/** @type {DetailFieldDef[]} */
export const AUTO_IDENTIFICATION_FIELDS = [
  { key: "szEnginNo", labelId: "label.AssetSummary.detail.engineNo" },
  { key: "szEnginCapacity", labelId: "label.AssetSummary.detail.engineCapacity" },
  { key: "szChasisNo", labelId: "label.AssetSummary.detail.chassisNo" },
  { key: "szRegNo", labelId: "label.AssetSummary.detail.registrationNo" },
  { key: "szInsuPolicyNo", labelId: "label.AssetSummary.detail.policyNo" },
  { key: "szInsuCompany", labelId: "label.AssetSummary.detail.insuranceCompany" },
];

/** @type {DetailFieldDef[]} */
export const JEWEL_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "dtValue", labelId: "label.AssetSummary.detail.valuationDate" },
  { key: "szValuer", labelId: "label.AssetSummary.detail.valuer" },
  { key: "szValuerType", labelId: "label.AssetSummary.detail.valuerType" },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" },
];

/** @type {DetailFieldDef[]} */
export const MACHINE_FIELDS = [
  { key: "szMachineName", labelId: "label.AssetSummary.detail.machineName" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "szInvoiceNo", labelId: "label.AssetSummary.detail.invoiceNo" },
  { key: "dtInvoice", labelId: "label.AssetSummary.detail.purchaseDate" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "dtValue", labelId: "label.AssetSummary.detail.valuationDate" },
  { key: "szValuer", labelId: "label.AssetSummary.detail.valuer" },
  { key: "szValuerType", labelId: "label.AssetSummary.detail.valuerType" },
  { key: "inOwnershipPercent", labelId: "label.AssetSummary.detail.ownershipPercent" },
];

/** @type {DetailFieldDef[]} */
export const PROPERTY_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "bdLandArea", labelId: "label.AssetSummary.detail.landArea" },
  { key: "bdBuiltArea", labelId: "label.AssetSummary.detail.builtUpArea" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "bdNorth", labelId: "label.AssetSummary.detail.northBoundaries" },
  { key: "bdEast", labelId: "label.AssetSummary.detail.eastBoundaries" },
  { key: "bdWest", labelId: "label.AssetSummary.detail.westBoundaries" },
  { key: "szFlatNo", labelId: "label.AssetSummary.detail.flatNo" },
  { key: "szFloorNo", labelId: "label.AssetSummary.detail.floorNo" },
  { key: "szPlotNo", labelId: "label.AssetSummary.detail.plotNo" },
  { key: "szSurveyNo", labelId: "label.AssetSummary.detail.citySurveyNo" },
  { key: "szKhasaraNo", labelId: "label.AssetSummary.detail.khasaraNo" },
  { key: "szArea", labelId: "label.AssetSummary.detail.townArea" },
  { key: "szTaluka", labelId: "label.AssetSummary.detail.taluka" },
  { key: "szDistrict", labelId: "label.AssetSummary.detail.district" },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szPropertyNo", labelId: "label.AssetSummary.detail.registrationNo" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" },
];

/**
 * @returns {{ kind: "AUTO_TABS" | "SINGLE", fields?: DetailFieldDef[], identification?: DetailFieldDef[] }}
 */
export function getDetailLayoutForNormalizedType(normalized) {
  switch (normalized) {
    case "AUTO":
      return { kind: "AUTO_TABS", fields: AUTO_DETAILS_FIELDS, identification: AUTO_IDENTIFICATION_FIELDS };
    case "JEWEL":
      return { kind: "SINGLE", fields: JEWEL_FIELDS };
    case "MACHINE":
      return { kind: "SINGLE", fields: MACHINE_FIELDS };
    case "PROPERTY":
      return { kind: "SINGLE", fields: PROPERTY_FIELDS };
    default:
      return { kind: "SINGLE", fields: [] };
  }
}
