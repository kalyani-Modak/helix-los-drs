import dayjs from "dayjs";

const GRID_KEYS = new Set(["gridRowId", "key"]);

export function stripGridMetadata(row) {
  if (!row || typeof row !== "object") return {};
  const out = { ...row };
  GRID_KEYS.forEach((k) => {
    delete out[k];
  });
  Object.entries(out).forEach(([key, value]) => {
    if (dayjs.isDayjs(value)) {
      out[key] = value.isValid() ? value.format("YYYY-MM-DD") : null;
    }
  });
  return out;
}

/**
 * @param {{ selectedRow: object, assetType: string, assetData: object, lnAssetSeqNo?: number|null }} params
 */
export function buildSaveAssetPayload({ selectedRow, assetType, assetData, lnAssetSeqNo }) {
  const payload = {
    assetType,
    assetData: stripGridMetadata(assetData),
  };
  if (lnAssetSeqNo != null && lnAssetSeqNo !== "" && lnAssetSeqNo !== 0) {
    payload.lnAssetSeqNo = lnAssetSeqNo;
  }
  return payload;
}
