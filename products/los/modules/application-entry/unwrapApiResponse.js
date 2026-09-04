/**
 * Normalizes the QDE envelope `{ status, msg, data }`.
 * `status: "SUCCESS"` returns `data`; anything else throws with the server message.
 * Bodies without the envelope are returned as-is so raw endpoints keep working.
 *
 * @param {import('axios').AxiosResponse} res
 * @returns {*} the `data` member, or the raw response body
 */
export function unwrapApiResponse(res) {
  const body = res?.data;

  if (body && typeof body === "object" && "status" in body) {
    const status = String(body.status).toUpperCase();
    if (status === "SUCCESS") {
      return body.data;
    }
    const error = new Error(body.msg || body.message || "Request failed");
    error.apiStatus = body.status;
    error.apiMessage = body.msg || body.message;
    error.apiData = body.data;
    throw error;
  }

  // HAxiosService.POST/PUT use `validateStatus: () => true`, so transport failures
  // arrive here as a normal resolution and still have to be surfaced as errors.
  if (typeof res?.status === "number" && res.status >= 400) {
    const error = new Error(`Request failed with status ${res.status}`);
    error.httpStatus = res.status;
    error.apiData = body;
    throw error;
  }

  return body;
}

export default unwrapApiResponse;
