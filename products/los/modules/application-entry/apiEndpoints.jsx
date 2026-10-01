import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

export const LosQdeAPI = {
  createDraft: () => `${base()}los/saveQde`,
  updateQde: () => `${base()}los/updateQde`,
  /** GET one application as a full QdeWrapperDto (org + application number). */
  fetchQde: (orgId, appNo) =>
    `${base()}los/fetchQde?orgId=${encodeURIComponent(orgId)}&applicationNo=${encodeURIComponent(appNo)}`,
  /** GET the latest application that has this mobile number on any of its parties. */
  fetchQdeByMobile: (orgId, mobile) =>
    `${base()}los/fetchQdeByMobile?orgId=${encodeURIComponent(orgId)}&mobile=${encodeURIComponent(mobile)}`,
  /** GET the latest application that has this Aadhaar number on any of its parties. */
  fetchQdeByAadhaar: (orgId, aadhaarNumber) =>
    `${base()}los/fetchQdeByAadhaar?orgId=${encodeURIComponent(orgId)}&aadhaarNumber=${encodeURIComponent(aadhaarNumber)}`,
  /** GET the latest application that has this customer ID on any of its parties. */
  fetchQdeByCustomerId: (orgId, customerId) =>
    `${base()}los/fetchQdeByCustomerId?orgId=${encodeURIComponent(orgId)}&customerId=${encodeURIComponent(customerId)}`,
  /** GET a page of lightweight application summaries for an organisation. */
  listApplications: (orgId, { status, page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set("status", status);
    return `${base()}los/applications/${encodeURIComponent(orgId)}?${params.toString()}`;
  },
  /** GET active values for one or more lookup types in one call, grouped by type. */
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
  stages: () => `${base()}api/los/v1/documents/masters/stages`,
  customerTypes: (borrowerType) =>
    `${base()}api/los/v1/documents/masters/customer-types${
      borrowerType ? `?borrowerType=${encodeURIComponent(borrowerType)}` : ""
    }`,
  waiveReasons: () => `${base()}api/los/v1/documents/masters/waive-reasons`,
  checklist: (stage, customerType) =>
    `${base()}api/los/v1/documents/checklist?stage=${encodeURIComponent(stage)}&customerType=${encodeURIComponent(
      customerType
    )}`,
  getByAppNo: (appNo, stage, customerType, applicableFor) => {
    const params = new URLSearchParams({ stage, customerType });
    if (applicableFor) params.set("applicableFor", applicableFor);
    return `${base()}api/los/v1/documents/applications/${encodeURIComponent(appNo)}?${params.toString()}`;
  },
  save: (appNo) => `${base()}api/los/v1/documents/applications/${encodeURIComponent(appNo)}`,
  upload: (appNo, itemId) =>
    `${base()}api/los/v1/documents/applications/${encodeURIComponent(appNo)}/files?itemId=${encodeURIComponent(
      itemId
    )}`,
  deleteItem: (appNo, itemId) =>
    `${base()}api/los/v1/documents/applications/${encodeURIComponent(appNo)}/items/${encodeURIComponent(itemId)}`,
  file: (appNo, itemId) =>
    `${base()}api/los/v1/documents/applications/${encodeURIComponent(appNo)}/items/${encodeURIComponent(itemId)}/file`,
};

export default LosQdeAPI;
