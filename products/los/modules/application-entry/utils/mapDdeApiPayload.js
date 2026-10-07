import { unwrapApiResponse } from "../unwrapApiResponse";
import {
  buildDdeSectionsSavePayload,
  hydrateFormFromDdeGet,
} from "./mapDdeSectionsApi";

export const unwrapDdePayload = (response) => {
  const unwrapped = unwrapApiResponse(response);
  return unwrapped?.responseJson || unwrapped?.data || unwrapped || {};
};

/** POST body for DDE sections save. */
export const buildDdeSavePayload = (orgId, applicationNo, form) =>
  buildDdeSectionsSavePayload(orgId, applicationNo, form);

/** Maps GET `/dde/application/{appNo}/sections` into flat form state. */
export const hydrateDdeFormFromApi = (apiPayload = {}) => hydrateFormFromDdeGet(apiPayload);
