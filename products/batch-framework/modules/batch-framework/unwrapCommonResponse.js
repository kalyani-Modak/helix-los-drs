/**
 * Normalizes API payloads: CommonResponseDto { status, message, responseJson } or raw body.
 * @param {import('axios').AxiosResponse} res
 * @returns {*} responseJson or res.data
 */
export function unwrapCommonResponse(res) {
  const d = res?.data;
  if (d && typeof d === "object" && "status" in d && "responseJson" in d) {
    if (String(d.status).toLowerCase() === "failure") {
      const err = new Error(d.message || "Request failed");
      err.apiMessage = d.message;
      throw err;
    }
    return d.responseJson;
  }
  return d;
}
