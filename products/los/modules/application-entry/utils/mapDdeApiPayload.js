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
export const buildDdeSavePayload = (orgId, applicationNo, form, lookups) =>
  buildDdeSectionsSavePayload(orgId, applicationNo, form, lookups);

/** Maps GET `/dde/application/{appNo}/sections` into flat form state. */
export const hydrateDdeFormFromApi = (apiPayload = {}, lookups) =>
  hydrateFormFromDdeGet(apiPayload, lookups);
