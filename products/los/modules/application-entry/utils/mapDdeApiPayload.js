import { unwrapApiResponse } from "../unwrapApiResponse";

export const unwrapDdePayload = (response) => {
  const unwrapped = unwrapApiResponse(response);
  return (
    unwrapped?.responseJson ||
    unwrapped?.data ||
    unwrapped?.ddeDetails ||
    unwrapped ||
    {}
  );
};

export const buildDdeSavePayload = (orgId, applicationNo, form) => ({
  szOrgId: orgId,
  szApplicationNo: applicationNo || form.applicationNo || null,
  ddeDetails: { ...form },
  coApplicants: form.coApplicants || [],
  guarantors: form.guarantors || [],
});

export const hydrateDdeFormFromApi = (apiPayload = {}) => {
  const details = apiPayload.ddeDetails || apiPayload;
  return {
    ...details,
    applicationNo: apiPayload.szApplicationNo || details.applicationNo || "",
    coApplicants: apiPayload.coApplicants || details.coApplicants || [],
    guarantors: apiPayload.guarantors || details.guarantors || [],
  };
};
