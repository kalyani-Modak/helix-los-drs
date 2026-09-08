import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

/** REST paths aligned with the LOS quick data entry (QDE) transaction service. */
export const LosQdeAPI = {
  createDraft: () => `${base()}api/los/v1/qde/applications/draft`,
  updateDraft: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}/draft`,
  getByAppNo: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}`,
  submit: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}/submit`,
  verifyPan: () => `${base()}api/los/v1/qde/verify/pan`,
  aadhaarOtpSend: () => `${base()}api/los/v1/qde/verify/aadhaar/otp/send`,
  aadhaarOtpValidate: () => `${base()}api/los/v1/qde/verify/aadhaar/otp/validate`,
  panAadhaarLinkage: () => `${base()}api/los/v1/qde/verify/pan-aadhaar-linkage`,
  ckycTrigger: () => `${base()}api/los/v1/qde/verify/ckyc/trigger`,
  ckycOtpSend: () => `${base()}api/los/v1/qde/verify/ckyc/otp/send`,
  ckycOtpValidate: () => `${base()}api/los/v1/qde/verify/ckyc/otp/validate`,
  digilocker: () => `${base()}api/los/v1/qde/verify/digilocker`,
  mobileOtpSend: () => `${base()}api/los/v1/qde/verify/mobile/otp/send`,
  mobileOtpValidate: () => `${base()}api/los/v1/qde/verify/mobile/otp/validate`,
  pincode: (pin) => `${base()}api/los/v1/qde/pincode/${encodeURIComponent(pin)}`,
};

/** REST paths aligned with the LOS application-entry document upload service. */
export const LosDocumentAPI = {
    LosDocumentAPI: (screenMenuId) => `${getLosQdeApiPath()}los_DocUpload/${screenMenuId}`,
  };
