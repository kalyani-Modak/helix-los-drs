import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

export const LosQdeAPI = {
  createDraft: () => `${base()}los/saveQde`,
  updateDraft: (appNo) =>`${base()}los/updateQde?applicationNo=${encodeURIComponent(appNo)}`,
  fetchQde: (orgId, appNo) =>`${base()}los/fetchQde?orgId=${encodeURIComponent(orgId)}&applicationNo=${encodeURIComponent(appNo)}`,
  fetchQdeByMobile: (orgId, mobile) =>`${base()}los/fetchQdeByMobile?orgId=${encodeURIComponent(orgId)}&mobile=${encodeURIComponent(mobile)}`,
  fetchQdeByAadhaar: (orgId, aadhaarNumber) =>`${base()}los/fetchQdeByAadhaar?orgId=${encodeURIComponent(orgId)}&aadhaarNumber=${encodeURIComponent(aadhaarNumber)}`,
  listApplications: (orgId, { status, page = 0, size = 20 } = {}) =>
  `${base()}los/fetchApplications?orgId=${encodeURIComponent(orgId)}&page=${page}&size=${size}${status ? `&status=${encodeURIComponent(status)}` : ""}`,

  // submit: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}/submit`,
  // verifyPan: () => `${base()}api/los/v1/qde/verify/pan`,
  // aadhaarOtpSend: () => `${base()}api/los/v1/qde/verify/aadhaar/otp/send`,
  // aadhaarOtpValidate: () => `${base()}api/los/v1/qde/verify/aadhaar/otp/validate`,
  // panAadhaarLinkage: () => `${base()}api/los/v1/qde/verify/pan-aadhaar-linkage`,
  // ckycTrigger: () => `${base()}api/los/v1/qde/verify/ckyc/trigger`,
  // ckycOtpSend: () => `${base()}api/los/v1/qde/verify/ckyc/otp/send`,
  // ckycOtpValidate: () => `${base()}api/los/v1/qde/verify/ckyc/otp/validate`,
  // digilocker: () => `${base()}api/los/v1/qde/verify/digilocker`,
  // mobileOtpSend: () => `${base()}api/los/v1/qde/verify/mobile/otp/send`,
  // mobileOtpValidate: () => `${base()}api/los/v1/qde/verify/mobile/otp/validate`,
  // pincode: (pin) => `${base()}api/los/v1/qde/pincode/${encodeURIComponent(pin)}`,
};

/** REST paths aligned with the LOS application-entry document upload service. */
export const LosDocumentAPI = {
    LosDocumentAPI: (screenMenuId) => `${getLosQdeApiPath()}los_DocUpload/${screenMenuId}`,
  };
