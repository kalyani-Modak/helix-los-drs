import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

export const LosQdeAPI = {
  createDraft: () => `${base()}los/saveQde`,
  updateQde: () => `${base()}los/updateQde`,
  fetchQde: (orgId, appNo) =>
    `${base()}los/fetchQde?orgId=${encodeURIComponent(orgId)}&applicationNo=${encodeURIComponent(appNo)}`,
  fetchQdeByMobile: (orgId, mobile) =>
    `${base()}los/fetchQdeByMobile?orgId=${encodeURIComponent(orgId)}&mobile=${encodeURIComponent(mobile)}`,
  fetchQdeByPanNumber: (orgId, panNumber) =>
    `${base()}los/fetchQdeByPanNumber?orgId=${encodeURIComponent(orgId)}&panNumber=${encodeURIComponent(panNumber)}`,
  fetchQdeByCustomerId: (orgId, customerId) =>
    `${base()}los/fetchQdeByCustomerId?orgId=${encodeURIComponent(orgId)}&customerId=${encodeURIComponent(customerId)}`,
  listApplications: (orgId, { status, page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    return `${base()}los/applications/${encodeURIComponent(orgId)}?${params.toString()}`;
  },
  fetchLookups: (orgId, types) =>
    `${base()}los/lookups/${encodeURIComponent(orgId)}?types=${encodeURIComponent(types.join(","))}`,
  updateDraft: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}/draft`,
  getByAppNo: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}`,
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

  export const LosDdeAPI = {
    fetchDde : (ORG_ID, appNo)=> `${getLosQdeApiPath()}los_DDE/${screenMenuId}`,
    updateDde : (appNo)=> `${getLosQdeApiPath()}los_DDE/${screenMenuId}`,
    saveDde : ()=> `${getLosQdeApiPath()}los_DDE/${screenMenuId}`,

  };