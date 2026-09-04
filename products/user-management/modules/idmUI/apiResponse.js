/**
 * Shared HTTP / API response helpers for user-management UI.
 * Supports REST status codes: 200, 201 Created, 204 No Content.
 */

export function isHttpSuccess(response) {
  return !!response && typeof response.status === "number"
    && response.status >= 200 && response.status < 300;
}

/**
 * True when the call succeeded: any 2xx, including 204 (empty body).
 * If body has status, SUCCESS wins; FAILURE fails; missing status on 2xx is success.
 */
export function isApiSuccess(response) {
  if (!isHttpSuccess(response)) return false;
  if (response.status === 204) return true;
  const status = response?.data?.status;
  if (status == null || status === "") return true;
  const normalized = String(status).toUpperCase();
  if (normalized === "FAILURE") return false;
  return normalized === "SUCCESS";
}

export function getApiMsg(response, fallback = "Success") {
  const data = response?.data;
  if (data == null) return fallback;
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return fallback;
    try {
      return getApiMsg({ data: JSON.parse(trimmed) }, trimmed);
    } catch {
      return trimmed;
    }
  }
  return data.msg || data.message || data.errorDescription || data.error || fallback;
}

/**
 * Parse error message from a blob body, plain object, or axios-like response
 * (e.g. failures when responseType is "blob").
 */
export async function getApiMsgFromBlob(payload, fallback = "Request failed") {
  if (payload == null) return fallback;

  if (!(payload instanceof Blob)) {
    if (typeof payload === "object") {
      return getApiMsg({ data: payload }, fallback);
    }
    return getApiMsg({ data: payload }, fallback);
  }

  try {
    const text = await payload.text();
    if (!text) return fallback;
    try {
      return getApiMsg({ data: JSON.parse(text) }, fallback);
    } catch {
      return text.trim() || fallback;
    }
  } catch {
    return fallback;
  }
}
