/**
 * Declarative field groups per backend asset type (AssetDetailsService filter lists).
 * Keys match AssetRequestDto / entity JSON from fetchAssetSummary.
 */

export function normalizeAssetApiType(sz) {
  const u = String(sz || "").trim().toUpperCase();
  if (["AUTO", "AU", "A", "AUTOMOBILE", "VEHICLE"].includes(u) || u.includes("AUTOMOBILE")) return "AUTO";
  if (["MACHINE", "MACHINERY", "MACH", "MACHY", "MCH", "MC", "MA", "M"].includes(u) || u.includes("MACHIN")) {
    return "MACHINE";
  }
  if (["JEWEL", "JEWELRY", "JEWELLERY", "JEWELLARY", "JEW", "JWL", "JW", "JE", "J"].includes(u) || u.includes("JEWEL")) {
    return "JEWEL";
  }
  if (["PROPERTY", "PROP", "PR", "P"].includes(u) || u.includes("PROP")) return "PROPERTY";
  return u;
}

/** @returns {{ titleKey: string, fields: { key: string, labelKey: string, required?: boolean, control?: string, options?: { label: string, value: string }[] }[] }[]} */
export function getFieldSectionsForAssetType(apiType) {
  const t = normalizeAssetApiType(apiType);
  switch (t) {
    case "AUTO":
      return [
        {
          titleKey: "label.Assets.Asset Details",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No", required: true },
            { key: "szAssetType", labelKey: "Product Type", required: true },
            { key: "szMake", labelKey: "label.Assets.Make" },
            { key: "szModel", labelKey: "label.Assets.Model" },
            { key: "inYearMfg", labelKey: "label.Assets.Model Year" },
            { key: "szDesc", labelKey: "label.Assets.Description" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] },
          ],
        },
        {
          titleKey: "label.Assets.Asset Identification",
          fields: [
            { key: "szEnginNo", labelKey: "label.Assets.Engine No" },
            { key: "szEnginCapacity", labelKey: "label.addAsset.engineCapacity" },
            { key: "szChasisNo", labelKey: "label.Assets.Chassis No" },
            { key: "szInvoiceNo", labelKey: "label.Assets.Invoice No" },
            { key: "szRegNo", labelKey: "label.Assets.Registration No" },
            { key: "szInsuPolicyNo", labelKey: "label.Assets.Policy No" },
            { key: "szInsuCompany", labelKey: "label.Assets.Insurance Company" },
          ],
        },
      ];
    case "MACHINE":
      return [
        {
          titleKey: "label.Assets.Add New Machinery",
          fields: [
            { key: "szMachineName", labelKey: "Machinery Name", required: true },
            { key: "szDesc", labelKey: "Machinery Description" },
            { key: "szInvoiceNo", labelKey: "label.Assets.Invoice No" },
            { key: "dtInvoice", labelKey: "Purchase Date", control: "date" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "dtValue", labelKey: "label.Assets.Date of Valuation", control: "date" },
            { key: "szValuer", labelKey: "label.Assets.Valuer" },
            { key: "szValuerType", labelKey: "Type Of Valuer" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] },
          ],
        },
      ];
    case "JEWEL":
      return [
        {
          titleKey: "label.Assets.Add New Jewellery",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No" },
            { key: "szDesc", labelKey: "Jewellery Description" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value", required: true },
            { key: "dtValue", labelKey: "label.Assets.Date of Valuation", control: "date" },
            { key: "szValuer", labelKey: "label.Assets.Valuer" },
            { key: "szValuerType", labelKey: "Type of Valuer" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] },
          ],
        },
      ];
    case "PROPERTY":
      return [
        {
          titleKey: "label.Assets.Add New Property",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No" },
            { key: "szDesc", labelKey: "label.Assets.Description" },
            { key: "bdLandArea", labelKey: "Land Area (Size)" },
            { key: "bdBuiltArea", labelKey: "label.addAsset.builtUpArea" },
            { key: "bdNorth", labelKey: "label.addAsset.northBoundaries" },
            { key: "bdEast", labelKey: "label.addAsset.eastBoundaries" },
            { key: "bdWest", labelKey: "label.addAsset.westBoundaries" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "szFlatNo", labelKey: "Flat/House No", required: true },
            { key: "szFloorNo", labelKey: "label.addAsset.floorNo" },
            { key: "szPlotNo", labelKey: "label.addAsset.plotNo" },
            { key: "szSurveyNo", labelKey: "City Survey No", required: true },
            { key: "szKhasaraNo", labelKey: "label.addAsset.khasaraNo" },
            { key: "szCity", labelKey: "Town/Area" },
            { key: "szTaluka", labelKey: "label.addAsset.taluka" },
            { key: "szDistrict", labelKey: "label.addAsset.district" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szRegNo", labelKey: "label.Assets.Registration No" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] },
          ],
        },
      ];
    default:
      return [];
  }
}

export function validateAssetPayload(apiType, data, intl) {
  const t = normalizeAssetApiType(apiType);
  const msg = (id) => intl.formatMessage({ id });

  const isEmpty = (v) => v === undefined || v === null || String(v).trim() === "";

  if (t === "AUTO") {
    if (isEmpty(data?.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data?.szAssetCode)) return msg("error.asset.assetCode.mandatory");
  }
  if (t === "MACHINE") {
    if (isEmpty(data?.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data?.szMachineName)) return msg("error.asset.machineName.mandatory");
  }
  if (t === "JEWEL") {
    if (isEmpty(data?.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data?.bdCurrentValue)) return msg("error.asset.currentValue.mandatory");
  }
  if (t === "PROPERTY") {
    if (isEmpty(data?.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data?.szFlatNo)) return msg("error.asset.flatNo.mandatory");
    if (isEmpty(data?.szSurveyNo)) return msg("error.asset.surveyNo.mandatory");
  }
  return null;
}
