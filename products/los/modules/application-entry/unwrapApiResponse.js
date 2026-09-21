export function unwrapApiResponse(res) {
  const body = res?.data;

  if (body && typeof body === "object" && "status" in body) {
    const status = String(body.status).toUpperCase();
   if (status === "SUCCESS") {
      // QDE services answer { status, message, responseJson }; older endpoints use { status, msg, data }.
      return "data" in body ? body.data : body.responseJson;
    }

    const error = new Error(
      body.message || "Request failed"
    );

    error.apiStatus = body.status;
    error.apiMessage = body.message;
    error.apiData = body.responseJson;

    throw error;
  }

  if (typeof res?.status === "number" && res.status >= 400) {
    const error = new Error(
      `Request failed with status ${res.status}`
    );

    error.httpStatus = res.status;
    error.apiData = body;

    throw error;
  }

  return body;
}

export default unwrapApiResponse;