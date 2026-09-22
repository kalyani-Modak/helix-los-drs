import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

export const LosQdeAPI = {
  createDraft: () => `${base()}los/saveQde`,
  updateDraft: (appNo) =>`${base()}los/updateQde?applicationNo=${encodeURIComponent(appNo)}`,
  fetchQde: (orgId, appNo) =>`${base()}los/fetchQde?orgId=${encodeURIComponent(orgId)}&applicationNo=${encodeURIComponent(appNo)}`,
  fetchQdeByCustomerId: (orgId, customerId) =>`${base()}los/fetchQdeByCustomerId?orgId=${encodeURIComponent(orgId)}&customerId=${encodeURIComponent(customerId)}`,
  fetchQdeByMobile: (orgId, mobile) =>`${base()}los/fetchQdeByMobile?orgId=${encodeURIComponent(orgId)}&mobile=${encodeURIComponent(mobile)}`,
  fetchQdeByAadhaar: (orgId, aadhaarNumber) =>`${base()}los/fetchQdeByAadhaar?orgId=${encodeURIComponent(orgId)}&aadhaarNumber=${encodeURIComponent(aadhaarNumber)}`,
  listApplications: (orgId, { status, page = 0, size = 20 } = {}) =>
  `${base()}los/fetchApplications?orgId=${encodeURIComponent(orgId)}&page=${page}&size=${size}${status ? `&status=${encodeURIComponent(status)}` : ""}`,

};

/** REST paths aligned with the LOS application-entry document upload service. */
export const LosDocumentAPI = {
    LosDocumentAPI: (screenMenuId) => `${getLosQdeApiPath()}los_DocUpload/${screenMenuId}`,
  };
