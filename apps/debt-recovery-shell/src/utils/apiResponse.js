/**
 * Shared HTTP / API response helper for the Workflow Registry feature.
 * Mirrors products/user-management/modules/idmUI/apiResponse.js so this
 * feature behaves the same way as the rest of DRS: HAxiosService resolves
 * (rather than throws) on non-2xx responses, so callers must check status
 * explicitly. This turns a non-2xx / FAILURE response into a thrown Error,
 * so pages that already do `try { await masterApi.xxx() } catch {}` keep
 * working exactly as before, unchanged.
 */

function isHttpSuccess(response) {
  return !!response && typeof response.status === "number"
    && response.status >= 200 && response.status < 300;
}

function apiErrorMessage(response, fallback) {
  const data = response?.data;
  if (data == null) return fallback;
  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed || fallback;
  }
  return data.message || data.error || data.errorDescription || data.msg || fallback;
}

/**
 * Unwraps an HAxiosService response: returns `response.data` on success,
 * throws an Error (with the backend's message when available) otherwise.
 */
export function unwrapApiResponse(response, fallbackErrorMsg = "Request failed") {
  if (!isHttpSuccess(response)) {
    throw new Error(apiErrorMessage(response, fallbackErrorMsg));
  }
  const status = response?.data?.status;
  if (status != null && String(status).toUpperCase() === "FAILURE") {
    throw new Error(apiErrorMessage(response, fallbackErrorMsg));
  }
  return response.data;
}
