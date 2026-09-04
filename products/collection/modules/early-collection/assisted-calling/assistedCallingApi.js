const BASE_URL = import.meta.env.VITE_ASSISTED_CALLING_BASE_URL || "https://aiassistant.yutrix.io/collassistantapi";
const API_KEY = import.meta.env.VITE_ASSISTED_CALLING_API_KEY || "ebix_918b0035585dba494da93b3781683b9b21c6a3e2fcca5ec0";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      ...headers,
    },
  };
  if (body) opts.body = typeof body === "string" ? body : JSON.stringify(body);

  const res = await fetch(url, opts);
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(json?.message || `Request failed ${res.status}`);
    err.response = json;
    throw err;
  }
  return json;
}

export async function startCall(payload) {
  return request("/call/start", { method: "POST", body: payload });
}

export async function endCall(payload) {
  return request("/call/end", { method: "POST", body: payload });
}

export async function getPtpPrediction(agreementId) {
  return request(`/ptp/predict/${agreementId}`);
}

export async function getTranscriptSummary(sessionId) {
  return request(`/transcript/${sessionId}/summary`);
}

export async function getTranscript(sessionId) {
  return request(`/transcript/${sessionId}`);
}

export default { startCall, endCall, getPtpPrediction, getTranscriptSummary, getTranscript };
