import { mapQdePartyRecordToDde } from "./ddePartyState";
import { DDE_SALARIED, normalizeDdeCustomerType } from "../constants/ddeSections";

/** Maps QDE form/API shape into Detailed Data Entry borrower fields. */
export const mapQdeToDdePrefill = (qde = {}) => {
  const profile = qde.profile || qde.borrowerCategory || "";
  return {
    customerType: normalizeDdeCustomerType(profile) || DDE_SALARIED,
    firstName: qde.firstName || "",
    middleName: qde.middleName || "",
    lastName: qde.lastName || "",
    aadhaar: qde.aadhaar || "",
    pan: qde.pan || "",
    dob: qde.dob || "",
    gender: qde.gender || "",
    mobile: qde.mobile || "",
    email: qde.email || "",
    currentAddressLine1: qde.addr1 || "",
    currentAddressLine2: qde.addr2 || "",
    currentLandmark: qde.landmark || "",
    currentCity: qde.city || "",
    currentDistrict: qde.district || "",
    currentProvince: qde.state || "",
    currentPostalCode: qde.pincode != null ? String(qde.pincode) : "",
    currentCountry: qde.country || "India",
    loanAmount: qde.loanAmount || "",
    tenureMonths: qde.tenure || qde.tenureMonths || "",
    taxPayerTin: qde.pan || "",
  };
};

export const mapQdePartiesToDde = (parties = [], kind = "co", borrower = {}) =>
  (parties || []).map((p) => mapQdePartyRecordToDde(p, borrower, kind));
