const LOGGED_IN_USER_KEY = "LOGGED_IN_USER";

export function getModifiedBy() {
  if (typeof sessionStorage === "undefined") return "SYSTEM";
  return sessionStorage.getItem(LOGGED_IN_USER_KEY) || "SYSTEM";
}

export function mapDtoToRow(dto) {
  const code = dto.szPortfolioCode ?? "";
  return {
    code,
    description: dto.szPortfolioDescription ?? "",
    active: dto.szActive === "Y",
  };
}

/** Normalize various API envelope shapes into the portfolio DTO array. */
export function extractPortfolioListFromPayload(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.responseJson)) return data.responseJson;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.body)) return data.body;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.result)) return data.result;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return extractPortfolioListFromPayload(parsed);
    } catch {
      return [];
    }
  }
  return [];
}

export function mapRowsFromResponse(data) {
  if (!Array.isArray(data)) return [];
  return data.map(mapDtoToRow);
}

export function buildSaveItem({ code, description, active }, mode, szModifiedBy) {
  return {
    szPortfolioCode: String(code ?? "").trim(),
    szPortfolioDescription: String(description ?? "").trim(),
    szActive: active ? "Y" : "N",
    szMode: mode,
    szModifiedBy,
  };
}

export function emptyFormDraft() {
  return { code: "", description: "", active: true };
}
