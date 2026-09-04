export function extractWfStateListFromPayload(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.responseJson)) return data.responseJson;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export function mapRowsFromResponse(list) {
  if (!Array.isArray(list)) return [];
  return list.map((dto) => ({
    szStateCode: dto.szStateCode != null ? String(dto.szStateCode).trim() : "",
    szDesc: dto.szDesc != null ? String(dto.szDesc).trim() : "",
    szMode: "E",
  }));
}

export function buildSaveRow(row, mode) {
  return {
    szStateCode: (row.szStateCode ?? "").trim(),
    szDesc: (row.szDesc ?? "").trim(),
    szMode: mode,
  };
}
