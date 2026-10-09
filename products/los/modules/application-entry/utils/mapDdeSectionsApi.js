import { computeAgeFromDob } from "./ddeFormState";
import { emptyCoApplicant, emptyDdeParty, emptyGuarantor } from "./ddePartyState";
import { DDE_INCOME_SOURCES } from "../constants/ddeIncomeSources";
import { normalizeDdeCustomerType } from "../constants/ddeSections";

const yn = (value) => (value === true || value === "Y" ? "Y" : value === false || value === "N" ? "N" : value ?? "");
const toNum = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const str = (v) => (v == null ? "" : String(v));
const empty = (v) => v === "" || v == null;

const mapBankFromApi = (bank) => {
  if (!bank) return {};
  return {
    szBnkDtlId: bank.szBnkDtlId || null,
    bankAccountHolder: bank.szAccHolder || "",
    bankName: bank.szBankId || "",
    bankBranch: bank.szBranchId || "",
    bankAccountType: bank.szAccType || "",
    bankAccountNumber: bank.szAccNo || "",
    bankIsRecovery: bank.cRecoveryDisbAcc === "Y",
    repaymentMode: bank.szRepayMode || "",
    perfiosUploaded: bank.cperfiosuploaded === "Y",
  };
};

const mapEmploymentFromApi = (employmentDetails = []) => {
  const emp = Array.isArray(employmentDetails) ? employmentDetails[0] : employmentDetails;
  if (!emp || typeof emp !== "object") return {};
  return {
    employmentType: emp.szEmploymentType || "",
    employer: emp.szEmployerName || "",
    employerCategory: emp.szEmpoyerCategory || emp.szEmployerCategory || "",
    industry: emp.szIndustrySector || "",
    designation: emp.szDesignation || "",
    department: emp.szDepartment || "",
    employeeId: emp.szEmpNo || "",
    employmentStatus: emp.szEmpStatus || "",
    dateOfJoining: emp.dtDateOfJoining || "",
    lengthOfServiceMonths: emp.iMonthOfService != null ? String(emp.iMonthOfService) : "",
    totalIncome: emp.fTotalIncAmt != null ? String(emp.fTotalIncAmt) : "",
  };
};

const mapIncomeFromApi = (incomeDetails = [], lookups = {}) => {
  const row = Array.isArray(incomeDetails) ? incomeDetails[0] : incomeDetails;
  if (!row?.incomeDetails) return {};
  const inc = row.incomeDetails;
  const patch = {
    salaryCreditMode: inc.szSalaryCreditMode || "",
    grossMonthlyIncome: inc.fGrossMonthlyIncome != null ? String(inc.fGrossMonthlyIncome) : "",
    netMonthlyIncome: inc.fNetMonthlyIncome != null ? String(inc.fNetMonthlyIncome) : "",
    finalConsideredIncome:
      inc.fFinalConsideredIncome != null ? String(inc.fFinalConsideredIncome) : "",
    salaryBank: inc.szSalaryBank || "",
    salaryDate: inc.dtSalaryDate || "",
    epfEtfApplicable: inc.cEPF_ETFApplicable === "Y",
  };
  const assoc = row.incomeDetailsAssociations || [];
  assoc.forEach((a) => {
    const incomeTypeLabel = (lookups["los.income.type.salaried"] || [])
      .find((option) => option.value === a.szincomeType)?.label;
    const def = DDE_INCOME_SOURCES.find(
      (source) => source.apiType === incomeTypeLabel || source.apiType === a.szincomeType
    );
    if (!def) return;
    if (def.include) patch[def.include] = a.cIncludeYN === "Y";
    const hasMonthlyValues = [a.fmonth1, a.fmonth2, a.fmonth3].some(
      (value) => value != null && value !== ""
    );
    const hasLegacyAverage = a.fAvgAmount != null && Number(a.fAvgAmount) !== 0;
    def.months.forEach((monthField, index) => {
      const monthValue = a[`fmonth${index + 1}`];
      patch[monthField] =
        hasMonthlyValues
          ? monthValue != null && monthValue !== ""
            ? String(monthValue)
            : ""
          : hasLegacyAverage
            ? String(a.fAvgAmount)
            : "";
    });
    if (hasMonthlyValues) {
      const average =
        Math.round(
          (def.months.reduce((sum, monthField) => {
            const value = patch[monthField];
            return sum + (value === "" ? 0 : Number(value) || 0);
          }, 0) /
            3) *
            100
        ) / 100;
      patch[def.amount] = String(average);
    } else if (a.fAvgAmount != null) {
      patch[def.amount] = String(a.fAvgAmount);
    }
    if (def.consideration) {
      patch[def.consideration] = "100";
    }
  });
  return patch;
};

const mapTaxFromApi = (taxDetails = []) => {
  const row = Array.isArray(taxDetails) ? taxDetails[0] : taxDetails;
  if (!row?.taxDetails) return {};
  const tax = row.taxDetails;
  const patch = {
    szTaxDtlId: tax.sztaxdtlid || null,
    taxPayerTin: tax.szTIN || "",
    taxFileNumber: tax.szTaxFileNo || "",
    taxAssessedBy: tax.szAssessAuthority || "",
    taxReturnsFiledOnTime: tax.cAllTaxReturnFiled === "Y",
    taxDuesOutstanding: tax.cAnyOutstandingDue === "Y",
    taxOutstandingAmount: tax.fOutstandingAmt != null ? String(tax.fOutstandingAmt) : "",
  };
  const years = ["taxYear1", "taxYear2", "taxYear3"];
  (row.taxDetailsAssociations || []).slice(0, 3).forEach((a, i) => {
    const prefix = years[i];
    patch[`${prefix}StatutoryIncome`] = a.fStatIncYear != null ? String(a.fStatIncYear) : "";
    patch[`${prefix}AssessableIncome`] = a.fAssIncYear != null ? String(a.fAssIncYear) : "";
    patch[`${prefix}TaxPaid`] = a.fTaxPaidYear != null ? String(a.fTaxPaidYear) : "";
    patch[`${prefix}AssocId`] = a.sztaxdtlassocid || null;
  });
  return patch;
};

const mapIndividualToForm = (party, lookups) => {
  const individual = party.individualDetails || {};
  const kyc = party.kycDetails || {};
  const address = party.address || {};
  const dob = individual.dtDateOfBirth || "";
  return {
    szApplicantId: party.szApplicantId || null,
    customerType: normalizeDdeCustomerType(individual.szApplicantCategory),
    firstName: individual.szFirstName || "",
    middleName: individual.szMiddleName || "",
    lastName: individual.szLastName || "",
    gender: individual.szGender || "",
    dob,
    age: computeAgeFromDob(dob),
    maritalStatus: individual.szMaritalStats || "",
    education: party.szEduLevel || "",
    residenceStatus: party.szResiStatus || "",
    countryOfBirth: party.szBirthCountry || "",
    aadhaar: kyc.szAadhaarNumber || "",
    pan: kyc.szPanNumber || "",
    mobile: party.szMobile || "",
    email: party.szEmail || "",
    currentAddressLine1: address.szAddressLine1 || "",
    currentAddressLine2: address.szAddressLine2 || "",
    currentCity: address.szCity || "",
    currentDistrict: address.szDistrict || "",
    currentProvince: address.szState || "",
    currentPostalCode: address.iPincode != null ? String(address.iPincode) : "",
    currentCountry: address.szCountry || "",
    sameAsCurrent: address.szperaddrsameascuraddyn === "Y",
  };
};

export const mapDdePartyFromApi = (party, kind = "co", lookups = {}) => {
  const base = kind === "co" ? emptyCoApplicant() : emptyGuarantor();
  const bank = (party.bankDetails || [])[0];
  const mapped = {
    ...base,
    ...mapIndividualToForm(party, lookups),
    id: party.szApplicantId || base.id,
    relationship: party.szRelationWithBrwr || "",
    type: party.szCoAppType || "",
    ...mapBankFromApi(bank),
    ...mapEmploymentFromApi(party.employmentDetails),
    ...mapIncomeFromApi(party.incomeDetails, lookups),
    ...mapTaxFromApi(party.taxDetails),
  };
  if (kind !== "co") delete mapped.type;
  return mapped;
};

export const hydrateFormFromDdeGet = (apiPayload = {}, lookups = {}) => {
  const parties = apiPayload.parties || [];
  const primary =
    parties.find((p) => p.szApplicantType === "PRIMARY_APPLICANT") || parties[0] || {};
  const loanRow = (apiPayload.loanDetails || [])[0] || {};

  const borrower = {
    ...mapIndividualToForm(primary, lookups),
    applicationNo: apiPayload.szApplicationNo || "",
    homePhone: apiPayload.szHomePhone || "",
    officePhone: apiPayload.szOffPhone || "",
    alternateMobile: apiPayload.szAltMobile || "",
    officeEmail: apiPayload.szOffEmail || "",
    personalEmail: apiPayload.szPerEmail || "",
    loanAmount: loanRow.fAppliedAmount != null ? String(loanRow.fAppliedAmount) : "",
    tenureMonths: loanRow.iAppliedTenor != null ? String(loanRow.iAppliedTenor) : "",
    loanPurposePrimary: loanRow.szPriLoanPurpose || "",
    repaymentScheduleType: loanRow.szRepayScedType || "",
    ...mapBankFromApi((primary.bankDetails || [])[0]),
    ...mapEmploymentFromApi(primary.employmentDetails),
    ...mapIncomeFromApi(primary.incomeDetails, lookups),
    ...mapTaxFromApi(primary.taxDetails),
  };

  const coApplicants = parties
    .filter((p) => p.szApplicantType === "CO_APPLICANT")
    .map((p) => mapDdePartyFromApi(p, "co", lookups));
  const guarantors = parties
    .filter((p) => p.szApplicantType === "GUARANTOR")
    .map((p) => mapDdePartyFromApi(p, "guarantor", lookups));

  const ddeMeta = {
    applicationDetails: {
      szAppType: apiPayload.szAppType,
      szBorrType: apiPayload.szBorrType,
      szCustType: apiPayload.szCustType,
      szPortfolioCode: apiPayload.szPortfolioCode,
      szSourceChannel: apiPayload.szSourceChannel,
      szSourceLocation: apiPayload.szSourceLocation,
      szServiceLocation: apiPayload.szServiceLocation,
    },
    loanDetailsRow: { ...loanRow },
    primaryApplicantId: primary.szApplicantId || null,
  };

  return {
    ...borrower,
    coApplicants,
    guarantors,
    ddeMeta,
  };
};

const buildPartySection = (partyRow, applicationNo, isPrimary, borrowerForm) => {
  const src = isPrimary ? borrowerForm : partyRow;
  const applicantId = isPrimary
    ? borrowerForm.ddeMeta?.primaryApplicantId || partyRow.szApplicantId
    : partyRow.szApplicantId;

  return {
    szBorrowerType: "INDIVIDUAL",
    szCustomerType: "NEW",
    szApplicantId: applicantId || null,
    szApplicationNo: applicationNo,
    individualDetails: {
      szFirstName: str(src.firstName),
      szMiddleName: str(src.middleName),
      szLastName: str(src.lastName),
      szGender: str(src.gender),
      dtDateOfBirth: str(src.dob) || null,
      szApplicantCategory: str(src.customerType),
      szEduLevel: str(src.education),
      szResiStatus: str(src.residenceStatus),
      szStaffYn: "N",
    },
    address: {
      szAddressType: "Current",
      szAddressLine1: str(src.currentAddressLine1),
      szAddressLine2: str(src.currentAddressLine2),
      szLandmark: "",
      szCity: str(src.currentCity),
      szDistrict: str(src.currentDistrict),
      szState: str(src.currentProvince),
      iPincode: toNum(src.currentPostalCode),
      szCountry: str(src.currentCountry),
      szperaddrsameascuraddyn: src.sameAsCurrent ? "Y" : "N",
    },
    szMobile: str(src.mobile),
    szEmail: str(src.email),
    kycDetails: {
      szPanNumber: str(src.pan),
      szAadhaarNumber: str(src.aadhaar),
    },
  };
};

const buildBankDetails = (src, applicationNo, applicantId) => {
  if (
    empty(src.bankName) &&
    empty(src.bankAccountNumber) &&
    empty(src.bankBranch)
  ) {
    return [];
  }
  return [
    {
      szBnkDtlId: src.szBnkDtlId || null,
      szApplicationNo: applicationNo,
      szApplicantId: applicantId,
      szAccHolder: str(src.bankAccountHolder),
      szBankId: str(src.bankName),
      szBranchId: str(src.bankBranch),
      szAccType: str(src.bankAccountType),
      szAccNo: str(src.bankAccountNumber),
      cRecoveryDisbAcc: yn(src.bankIsRecovery),
      szRepayMode: str(src.repaymentMode),
      cperfiosuploaded: yn(src.perfiosUploaded) || "N",
    },
  ];
};

const buildEmploymentSection = (src, applicantId) => ({
  employmentDetails: {
    szEmploymentType: str(src.employmentType),
    szEmployerName: str(src.employer),
    szApplicantId: applicantId,
    szEmpoyerCategory: str(src.employerCategory),
    szIndustrySector: str(src.industry),
    szDesignation: str(src.designation),
    szDepartment: str(src.department),
    szEmpNo: str(src.employeeId),
    szEmpStatus: str(src.employmentStatus),
    dtDateOfJoining: str(src.dateOfJoining) || null,
    iMonthOfService: toNum(src.lengthOfServiceMonths),
    fTotalIncAmt: toNum(src.totalIncome),
  },
});

const buildIncomeSection = (src, applicantId, lookups) => {
  const incomeTypeOptions = lookups["los.income.type.salaried"] || [];
  const associations = DDE_INCOME_SOURCES.map((def) => {
    const amount = toNum(src[def.amount]);
    const included = def.include ? src[def.include] : amount != null;
    const incomeType = def.apiType === "Other Income"
      ? def.apiType
      : incomeTypeOptions.find((option) => option.label === def.apiType)?.value;
    return {
      cIncludeYN: included ? "Y" : "N",
      szincomeType: incomeType,
      fmonth1: toNum(src[def.months[0]]),
      fmonth2: toNum(src[def.months[1]]),
      fmonth3: toNum(src[def.months[2]]),
      fAvgAmount: amount,
      iconsiderationPer: 100,
      fmonthlyConsidered: included && amount != null ? amount : 0,
    };
  }).filter((a) => a.szincomeType && (a.cIncludeYN === "Y" || a.fAvgAmount != null));

  return {
    incomeDetails: {
      szApplicantId: applicantId,
      szSalaryCreditMode: str(src.salaryCreditMode),
      fGrossMonthlyIncome: toNum(src.grossMonthlyIncome),
      fNetMonthlyIncome: toNum(src.netMonthlyIncome),
      fFinalConsideredIncome: toNum(src.finalConsideredIncome),
      szSalaryBank: str(src.salaryBank),
      dtSalaryDate: str(src.salaryDate) || null,
      cEPF_ETFApplicable: yn(src.epfEtfApplicable),
    },
    incomeDetailsAssociations: associations,
  };
};

const buildTaxSection = (src, applicantId) => {
  const associations = [1, 2, 3].map((i) => ({
    sztaxdtlassocid: src[`taxYear${i}AssocId`] || null,
    fStatIncYear: toNum(src[`taxYear${i}StatutoryIncome`]),
    fAssIncYear: toNum(src[`taxYear${i}AssessableIncome`]),
    fTaxPaidYear: toNum(src[`taxYear${i}TaxPaid`]),
  }));

  return {
    taxDetails: {
      sztaxdtlid: src.szTaxDtlId || null,
      szApplicantId: applicantId,
      szTIN: str(src.taxPayerTin),
      szTaxFileNo: str(src.taxFileNumber),
      szAssessAuthority: str(src.taxAssessedBy),
      cAllTaxReturnFiled: yn(src.taxReturnsFiledOnTime),
      cAnyOutstandingDue: yn(src.taxDuesOutstanding),
      fOutstandingAmt: toNum(src.taxOutstandingAmount),
    },
    taxDetailsAssociations: associations,
  };
};

const buildApplicantSaveEntry = (applicantId, src, applicationNo, isPrimary, borrowerForm, lookups) => ({
  szApplicantId: applicantId,
  sections: {
    party: buildPartySection(src, applicationNo, isPrimary, borrowerForm),
    bankDetails: buildBankDetails(src, applicationNo, applicantId),
    employment: buildEmploymentSection(src, applicantId),
    incomeDetails: buildIncomeSection(src, applicantId, lookups),
    taxDetails: buildTaxSection(src, applicantId),
  },
});

/** POST `/dde/application/{applicationNo}/sections` body. */
export const buildDdeSectionsSavePayload = (orgId, applicationNo, form, lookups = {}) => {
  const meta = form.ddeMeta || {};
  const appDetails = meta.applicationDetails || {};
  const loanTemplate = meta.loanDetailsRow || {};

  const applicants = [];
  const primaryId = meta.primaryApplicantId;
  if (primaryId) {
    applicants.push(buildApplicantSaveEntry(primaryId, form, applicationNo, true, form, lookups));
  }

  const isServerApplicantId = (id) =>
    id && /^APP/i.test(String(id)) && !String(id).includes("-");

  (form.coApplicants || []).forEach((party) => {
    const applicantId = party.szApplicantId || party.id;
    if (!isServerApplicantId(applicantId)) return;
    applicants.push(buildApplicantSaveEntry(applicantId, party, applicationNo, false, form, lookups));
  });

  (form.guarantors || []).forEach((party) => {
    const applicantId = party.szApplicantId || party.id;
    if (!isServerApplicantId(applicantId)) return;
    applicants.push(buildApplicantSaveEntry(applicantId, party, applicationNo, false, form, lookups));
  });

  return {
    szOrgId: orgId,
    applicationDetails: {
      szAppType: appDetails.szAppType ?? "N",
      szBorrType: appDetails.szBorrType ?? "INDIVIDUAL",
      szCustType: appDetails.szCustType ?? "NEW",
      szPortfolioCode: appDetails.szPortfolioCode ?? "HL",
      szSourceChannel: appDetails.szSourceChannel ?? "",
      szSourceLocation: appDetails.szSourceLocation ?? "",
      szServiceLocation: appDetails.szServiceLocation ?? "",
      szAltMobile: str(form.alternateMobile),
      szOffEmail: str(form.officeEmail),
      szPerEmail: str(form.personalEmail),
    },
    loanDetails: [
      {
        szProductCode: loanTemplate.szProductCode ?? "",
        cPrimaryAccountYn: loanTemplate.cPrimaryAccountYn ?? "Y",
        szCurrencyCode: loanTemplate.szCurrencyCode ?? "INR",
        fAppliedAmount: toNum(form.loanAmount),
        iAppliedTenor: toNum(form.tenureMonths),
        szTenorUnit: loanTemplate.szTenorUnit ?? "MONTH",
        fInterestRate: loanTemplate.fInterestRate ?? null,
        szSchemeCode: loanTemplate.szSchemeCode ?? "",
        szLoanType: loanTemplate.szLoanType ?? "",
        szPriLoanPurpose: str(form.loanPurposePrimary),
        szRepayScedType: str(form.repaymentScheduleType),
      },
    ],
    applicants,
  };
};
