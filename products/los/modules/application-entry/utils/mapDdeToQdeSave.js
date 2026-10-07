const toNumberOrNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const nullIfEmpty = (value) => {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
};

/** Maps a Detailed Data Entry party row to `PartyDto` for `saveQde`. */
export const mapDdePartyToQdeDto = (party, role = "CO_APPLICANT") => {
  const isGuarantor = role === "GUARANTOR";
  const applicantId = party.szApplicantId || null;
  const clientId = party.id && !party.szApplicantId ? party.id : null;

  return {
    szApplicantId: applicantId || (clientId && clientId.length > 20 ? clientId : null),
    szBorrowerType: "INDIVIDUAL",
    szCustomerType: null,
    szCustomerId: null,
    szRelationshipWithPrimaryApplicant: nullIfEmpty(party.relationship),

    individualDetails: {
      szFirstName: nullIfEmpty(party.firstName),
      szMiddleName: nullIfEmpty(party.middleName),
      szLastName: nullIfEmpty(party.lastName),
      szGender: nullIfEmpty(party.gender),
      dtDateOfBirth: nullIfEmpty(party.dob),
      szFatherName: null,
      szMotherName: null,
      szApplicantCategory: null,
      szStaffYn: null,
      szPreApprovedYn: null,
    },

    nonIndividualDetails: null,
    szMobile: nullIfEmpty(party.mobile),
    szEmail: nullIfEmpty(party.email),

    kycDetails: {
      szPanNumber: nullIfEmpty(party.pan),
      szUrnNo: null,
      szAadhaarNumber: nullIfEmpty(party.aadhaar),
      szPanVerificationStatus: null,
      szPanAadhaarLinkageStatus: null,
      szCkycNumber: null,
      szCkycVerificationStatus: null,
      szDigiLockerDocumentId: null,
      szDigiLockerVerificationStatus: null,
      szAadhaarVerificationStatus: null,
      szAadhaarOtpReference: null,
      szGstNumber: null,
      szCin: null,
      szShopAct: null,
    },

    address: {
      szAddressType: "CURRENT",
      szAddressLine1: nullIfEmpty(party.currentAddressLine1),
      szAddressLine2: nullIfEmpty(party.currentAddressLine2),
      szAddressLine3: null,
      szLandmark: null,
      iPincode: toNumberOrNull(party.currentPostalCode),
      szCity: nullIfEmpty(party.currentCity),
      szDistrict: nullIfEmpty(party.currentDistrict),
      szState: nullIfEmpty(party.currentProvince),
      szCountry: nullIfEmpty(party.currentCountry) || "INDIA",
    },

    authorisedSignatory: null,
    authorisedSignatoryKyc: null,
  };
};

/** Merge DDE borrower + parties into an existing QDE wrapper for `saveQde`. */
export const mergeDdeFormIntoQdeWrapper = (qdeWrapper, form, orgId, applicationNo) => {
  const base = qdeWrapper && typeof qdeWrapper === "object" ? { ...qdeWrapper } : {};
  const applicant = base.applicantDetails || {};
  const individual = applicant.individualDetails || {};
  const address = applicant.address || {};
  const loan = base.loanDetails || {};
  const sourcing = base.sourcingDetails || {};
  const kyc = applicant.kycDetails || {};

  const mergedApplicant = {
    ...applicant,
    szMobile: nullIfEmpty(form.mobile) ?? applicant.szMobile,
    szEmail: nullIfEmpty(form.email) ?? applicant.szEmail,
    individualDetails: {
      ...individual,
      szFirstName: nullIfEmpty(form.firstName) ?? individual.szFirstName,
      szMiddleName: nullIfEmpty(form.middleName) ?? individual.szMiddleName,
      szLastName: nullIfEmpty(form.lastName) ?? individual.szLastName,
      szGender: nullIfEmpty(form.gender) ?? individual.szGender,
      dtDateOfBirth: nullIfEmpty(form.dob) ?? individual.dtDateOfBirth,
      szApplicantCategory: nullIfEmpty(form.customerType) ?? individual.szApplicantCategory,
    },
    kycDetails: {
      ...kyc,
      szPanNumber: nullIfEmpty(form.pan) ?? kyc.szPanNumber,
      szAadhaarNumber: nullIfEmpty(form.aadhaar) ?? kyc.szAadhaarNumber,
    },
    address: {
      ...address,
      szAddressLine1: nullIfEmpty(form.currentAddressLine1) ?? address.szAddressLine1,
      szAddressLine2: nullIfEmpty(form.currentAddressLine2) ?? address.szAddressLine2,
      szCity: nullIfEmpty(form.currentCity) ?? address.szCity,
      szDistrict: nullIfEmpty(form.currentDistrict) ?? address.szDistrict,
      szState: nullIfEmpty(form.currentProvince) ?? address.szState,
      iPincode: toNumberOrNull(form.currentPostalCode) ?? address.iPincode,
      szCountry: nullIfEmpty(form.currentCountry) ?? address.szCountry,
    },
  };

  return {
    ...base,
    szOrgId: orgId,
    szApplicationNo: applicationNo || base.szApplicationNo || null,
    applicationControl: base.applicationControl || {
      szApplicationType: null,
      szPortfolioCode: null,
      szBorrowerType: "INDIVIDUAL",
      szCustomerType: "NEW",
    },
    applicantDetails: mergedApplicant,
    coApplicants: (form.coApplicants || []).map((p) => mapDdePartyToQdeDto(p, "CO_APPLICANT")),
    guarantors: (form.guarantors || []).map((p) => mapDdePartyToQdeDto(p, "GUARANTOR")),
    loanDetails: {
      ...loan,
      fAppliedAmount: toNumberOrNull(form.loanAmount) ?? loan.fAppliedAmount,
      iAppliedTenor: toNumberOrNull(form.tenureMonths) ?? loan.iAppliedTenor,
    },
    sourcingDetails: sourcing,
  };
};
