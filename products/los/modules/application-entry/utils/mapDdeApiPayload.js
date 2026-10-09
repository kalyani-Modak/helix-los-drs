import { unwrapApiResponse } from "../unwrapApiResponse";
import {
  buildDdeSectionsSavePayload,
  hydrateFormFromDdeGet,
} from "./mapDdeSectionsApi";

export const unwrapDdePayload = (response) => {
  if (
    response &&
    typeof response === "object" &&
    ("szApplicationNo" in response ||
      Array.isArray(response.parties) ||
      Array.isArray(response.applicants))
  ) {
    return response;
  }

  const unwrapped = unwrapApiResponse(response);
  const payload = unwrapped?.responseJson || unwrapped?.data || unwrapped || response;
  return payload && typeof payload === "object" ? payload : {};
};

/** POST body for DDE sections save. */
export const buildDdeSavePayload = (orgId, form, lookups) =>
  buildDdeSectionsSavePayload(orgId, form, lookups);

/** Maps GET `/dde/application/{appNo}/sections` into flat form state. */
export const hydrateDdeFormFromApi = (apiPayload = {}, lookups) =>
  hydrateFormFromDdeGet(apiPayload, lookups);
