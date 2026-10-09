import { computeAgeFromDob } from "./ddeFormState";

export const emptyDdeParty = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  relationship: "",
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  aadhaar: "",
  pan: "",
  passport: "",
  dob: "",
  age: "",
  gender: "",
  maritalStatus: "",
  spouseName: "",
  dependents: "",
  nationality: "",
  countryOfBirth: "",
  religion: "",
  education: "",
  residenceStatus: "",
  mobile: "",
  email: "",
  sameAsPrimaryCurrent: false,
  currentAddressLine1: "",
  currentAddressLine2: "",
  currentLandmark: "",
  currentCity: "",
  currentDistrict: "",
  currentProvince: "",
  currentPostalCode: "",
  currentCountry: "",
  sameAsPrimaryPermanent: false,
  permanentAddressLine1: "",
  permanentAddressLine2: "",
  permanentCity: "",
  permanentDistrict: "",
  permanentProvince: "",
  permanentPostalCode: "",
  permanentCountry: "",
  employmentType: "",
  employer: "",
  employerCategory: "",
  industry: "",
  designation: "",
  department: "",
  employeeId: "",
  employmentStatus: "",
  dateOfJoining: "",
  lengthOfServiceYears: "",
  lengthOfServiceMonths: "",
  totalIncome: "",
  bankAccountHolder: "",
  bankName: "",
  bankBranch: "",
  bankAccountType: "",
  bankAccountNumber: "",
  bankIsRecovery: false,
  repaymentMode: "",
  szBnkDtlId: null,
  szTaxDtlId: null,
  perfiosUploaded: false,
});

export const emptyCoApplicant = () => ({
  ...emptyDdeParty(),
  type: "",
});

export const emptyGuarantor = () => emptyDdeParty();

export const partyDisplayName = (row) => {
  const composed = [row.firstName, row.middleName, row.lastName].filter(Boolean).join(" ").trim();
  return composed || String(row.fullName || "").trim();
};

const str = (v) => (v === undefined || v === null ? "" : String(v).trim());

export const borrowerCurrentAddressPatch = (borrower) => ({
  currentAddressLine1: str(borrower.currentAddressLine1),
  currentAddressLine2: str(borrower.currentAddressLine2),
  currentCity: str(borrower.currentCity),
  currentDistrict: str(borrower.currentDistrict),
  currentProvince: str(borrower.currentProvince),
  currentPostalCode: str(borrower.currentPostalCode),
  currentCountry: str(borrower.currentCountry),
});

export const borrowerPermanentAddressPatch = (borrower) => ({
  permanentAddressLine1: str(borrower.permanentAddressLine1),
  permanentAddressLine2: str(borrower.permanentAddressLine2),
  permanentCity: str(borrower.permanentCity),
  permanentDistrict: str(borrower.permanentDistrict),
  permanentProvince: str(borrower.permanentProvince),
  permanentPostalCode: str(borrower.permanentPostalCode),
  permanentCountry: str(borrower.permanentCountry),
});

export const mapQdePartyRecordToDde = (party, borrower, kind = "co") => {
  const individual = party?.individualDetails || {};
  const kyc = party?.kycDetails || {};
  const address = party?.address || {};
  const dob = individual.dtDateOfBirth || party.dob || "";
  const mapped = {
    ...emptyDdeParty(),
    id: party?.szApplicantId || party?.id || emptyDdeParty().id,
    szApplicantId: party?.szApplicantId || null,
    relationship:
      party?.szRelationWithBrwr ||
      party?.szRelationshipWithPrimaryApplicant ||
      party?.relationship ||
      "",
    firstName: individual.szFirstName || party?.firstName || "",
    middleName: individual.szMiddleName || party?.middleName || "",
    lastName: individual.szLastName || party?.lastName || "",
    gender: individual.szGender || party?.gender || "",
    dob,
    age: computeAgeFromDob(dob),
    aadhaar: kyc.szAadhaarNumber || party?.aadhaar || "",
    pan: kyc.szPanNumber || party?.pan || "",
    mobile: party?.szMobile || party?.mobile || "",
    email: party?.szEmail || party?.email || "",
    currentAddressLine1: address.szAddressLine1 || party?.addr1 || "",
    currentAddressLine2: address.szAddressLine2 || party?.addr2 || "",
    currentLandmark: address.szLandmark || party?.landmark || "",
    currentCity: address.szCity || party?.city || "",
    currentDistrict: address.szDistrict || party?.district || "",
    currentProvince: address.szState || party?.state || "",
    currentPostalCode:
      address.iPincode != null ? String(address.iPincode) : party?.pincode != null ? String(party.pincode) : "",
    currentCountry: address.szCountry || party?.country || "India",
  };
  if (kind === "co") {
    return { ...mapped, type: party?.szCoAppType || "" };
  }
  return mapped;
};
