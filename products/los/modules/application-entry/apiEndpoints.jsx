import { getLosQdeApiPath } from "@shared/config/apiConstants";

const base = () => {
  const u = getLosQdeApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

/** Screen function id (shell menu / function security). */
export const DDE_SCREEN_MENU_ID = "ECF-DetailedDataEntry";

export const LosQdeAPI = {
  createDraft: () => `${base()}los/saveQde`,
  updateQde: () => `${base()}los/updateQde`,
  fetchQde: (orgId, appNo) =>
    `${base()}los/fetchQde?orgId=${encodeURIComponent(orgId)}&applicationNo=${encodeURIComponent(appNo)}`,
  fetchQdeByMobile: (orgId, mobile) =>
    `${base()}los/fetchQdeByMobile?orgId=${encodeURIComponent(orgId)}&mobile=${encodeURIComponent(mobile)}`,
  fetchQdeByPanNumber: (orgId, panNumber) =>
    `${base()}los/fetchQdeByPanNumber?orgId=${encodeURIComponent(orgId)}&panNumber=${encodeURIComponent(panNumber)}`,
  fetchQdeByAadhaar: (orgId, aadhaarNumber) =>
    `${base()}los/fetchQdeByAadhaar?orgId=${encodeURIComponent(orgId)}&aadhaarNumber=${encodeURIComponent(aadhaarNumber)}`,
  fetchQdeByCustomerId: (orgId, customerId) =>
    `${base()}los/fetchQdeByCustomerId?orgId=${encodeURIComponent(orgId)}&customerId=${encodeURIComponent(customerId)}`,
  listApplications: (orgId, { status, page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ orgId, page: String(page), size: String(size) });
    if (status) params.set("status", status);
    return `${base()}los/fetchApplications?${params.toString()}`;
  },
  fetchLookups: (orgId, types) =>
    `${base()}los/lookups/${encodeURIComponent(orgId)}?types=${encodeURIComponent(types.join(","))}`,
  updateDraft: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}/draft`,
  getByAppNo: (appNo) => `${base()}api/los/v1/qde/applications/${encodeURIComponent(appNo)}`,
};

/** REST paths aligned with helix-los-application-entry document upload controller. */
export const LosDocumentAPI = {
  LosDocumentAPI: (screenMenuId = "ECF-DocumentUpload") =>
    `${base()}los_DocUpload/${screenMenuId}`,
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

/**
 * Detailed Data Entry — `GET|POST .../dde/application/{applicationNo}/sections`
 * (see helix-los-application-entry DDE contract).
 */
export const LosDdeAPI = {
  sectionsUrl: (applicationNo) =>
    `${base()}dde/application/${encodeURIComponent(applicationNo)}/sections`,
  /** @deprecated use sectionsUrl — kept for menu URI hints */
  screenBase: () => `${base()}dde/application`,
  fetchDdeSections: (applicationNo) => LosDdeAPI.sectionsUrl(applicationNo),
  saveDdeSections: (applicationNo) => LosDdeAPI.sectionsUrl(applicationNo),
};

export default LosQdeAPI;
