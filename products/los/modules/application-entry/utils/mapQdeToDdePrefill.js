import { mapQdePartyRecordToDde } from "./ddePartyState";

/** Maps QDE form/API shape into Detailed Data Entry borrower fields. */
export const mapQdeToDdePrefill = (qde = {}) => {
  const profile = qde.profile || qde.borrowerCategory || "";
  const customerTypeMap = {
    Salaried: "Salaried",
    SALARIED: "Salaried",
    SEP: "Self Employed Professional (SEP)",
    SENP: "Self Employed Non-Professional (SENP)",
    Pensioner: "Pensioner",
  };

  return {
    customerType: customerTypeMap[profile] || profile || "Salaried",
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
