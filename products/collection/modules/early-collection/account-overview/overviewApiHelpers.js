/**
 * @param {unknown} v
 * @returns {string}
 */
export function displayValue(v) {
  if (v == null || v === "") return "—";
  if (typeof v === "object" && v !== null && "toString" in v) {
    const s = String(v);
    if (s !== "[object Object]") return s;
  }
  return String(v);
}

/**
 * @param {unknown} n
 * @returns {string}
 */
export function formatMoney(n) {
  if (n == null || n === "") return "—";
  const num = Number(n);
  if (Number.isNaN(num)) return displayValue(n);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * @param {unknown} d
 * @returns {string}
 */
export function formatDate(d) {
  if (d == null || d === "") return "—";
  if (typeof d === "string") return d.length >= 10 ? d.slice(0, 10) : d;
  return String(d);
}

/**
 * Axios response from HAxiosService.POST — unwrap OverviewResponse-style body.
 * @param {import('axios').AxiosResponse} res
 * @returns {{ data: unknown }}
 */
export function parseOverviewResponse(res) {
  const httpStatus = res?.status ?? 0;
  if (httpStatus < 200 || httpStatus >= 300) {
    const msg = res?.data?.message || `Request failed (${httpStatus})`;
    throw new Error(msg);
  }
  if (httpStatus === 204 || httpStatus === 205) {
    return { data: null };
  }
  const body = res?.data;
  if (!body || typeof body !== "object") {
    throw new Error("Invalid response");
  }
  const appStatus = body.status;
  if (typeof appStatus === "number" && appStatus >= 400) {
    throw new Error(body.message || "Request failed");
  }
  return { data: body.data };
}

/**
 * @param {unknown} d
 * @returns {string}
 */
export function formatDateTime(d) {
  if (d == null || d === "") return "--";
  const raw = String(d).replace("T", " ").replace(/\.\d+$/, "");
  return raw.length > 16 ? raw.slice(0, 16) : raw;
}

/**
 * @param {unknown} d
 * @returns {number|null}
 */
export function getDaysSince(d) {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs < 0 ? 0 : Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * @param {unknown} d
 * @returns {string}
 */
export function formatRelativeDays(d) {
  const days = getDaysSince(d);
  if (days == null) return "--";
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

/**
 * @param {unknown} phone
 * @returns {string}
 */
export function getPhoneDigits(phone) {
  return String(phone ?? "").replace(/\D/g, "");
}

/**
 * @param {unknown} phone
 * @param {string} countryCode
 * @returns {string}
 */
export function formatPhoneWithCountryCode(phone, countryCode = "+91") {
  const digits = getPhoneDigits(phone);
  if (!digits) return "—";

  const normalizedCountryCode = String(countryCode || "+91").trim();
  const countryDigits = normalizedCountryCode.replace(/\D/g, "");

  if (countryDigits && digits.startsWith(countryDigits)) {
    return `+${digits}`;
  }

  return `${normalizedCountryCode}${digits}`;
}

/**
 * @param {unknown} phone
 * @param {string} countryCode
 * @returns {string}
 */
export function getPhoneHref(phone, countryCode = "+91") {
  const formattedPhone = formatPhoneWithCountryCode(phone, countryCode);
  return formattedPhone === "—" ? "" : `tel:${formattedPhone}`;
}

/**
 * @param {unknown} phone
 * @param {string} countryCode
 * @returns {string}
 */
export function formatDialerPhoneNumber(phone, countryCode = "+91") {
  const digits = getPhoneDigits(phone);
  if (!digits) return "";

  const countryDigits = String(countryCode || "+91").replace(/\D/g, "") || "91";
  if (digits.startsWith(countryDigits)) {
    return digits;
  }
  return `${countryDigits}${digits}`;
}
