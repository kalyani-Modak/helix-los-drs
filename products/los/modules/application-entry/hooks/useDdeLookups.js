import { useQdeLookups } from "./useQdeLookups";

/** Lookup types for DDE dropdowns. */
export const DDE_LOOKUP_TYPES = [
  "party.title",
  "party.maritalstatus",
  "party.nationality",
  "party.religion",
  "party.education",
  "party.residencestatus",
  "party.address.state",
  "party.address.district",
  "los.pensionertype",
  "los.pensioncreditmode",
  "los.bankname",
  "los.bankaccounttype",
  "los.repaymentmode",
  "los.loanpurpose",
  "los.graceperiodtype",
  "los.repaymentfrequency",
  "los.ratetype",
  "los.repaymentscheduletype",
  "los.graceperiodtype",
  "los.coapplicanttype",
  "los.coapplicant.relationship",
  "los.guarantor.relationship",
  "los.income.type.salaried",
  "los.employmenttype",
  "los.employercategory",
  "los.employmentstatus",
  "los.accountholder.primary",
  "los.accountholder.coapplicant",
  "los.accountholder.guarantor",
  "los.bankbranch.AXIS",
  "los.bankbranch.BOB",
  "los.bankbranch.ICICI",
  "los.bankbranch.IDFC",
  "los.bankbranch.PNB",
  "los.bankbranch.SBI",
  "los.salarycreditmode",
  "los.employer",
  "los.industrysector",
  "los.natureofbusiness",
  "los.businessconstitution",
  "los.profession",
  "los.membershiptype",
  "los.incomeproof",
];

const MASTER_ALIAS = {
  title: "party.title",
  gender: "party.gender",
  maritalStatus: "party.maritalstatus",
  nationality: "party.nationality",
  religion: "party.religion",
  education: "party.education",
  residenceStatus: "party.residencestatus",
  state: "party.address.state",
  district: "party.address.district",
  pensionerType: "los.pensionertype",
  pensionCreditMode: "los.pensioncreditmode",
  bankName: "los.bankname",
  bank: "los.bankname",
  accountType: "los.bankaccounttype",
  repaymentMode: "los.repaymentmode",
  loanPurpose: "los.loanpurpose",
  gracePeriodType: "los.graceperiodtype",
  repaymentFrequency: "los.repaymentfrequency",
  rateType: "los.ratetype",
  repaymentScheduleType: "los.repaymentscheduletype",
  coApplicantType: "los.coapplicanttype",
  coApplicantRelationship: "los.coapplicant.relationship",
  guarantorRelationship: "los.guarantor.relationship",
  salariedIncomeType: "los.income.type.salaried",
  employmentType: "los.employmenttype",
  employerCategory: "los.employercategory",
  employmentStatus: "los.employmentstatus",
  salaryCreditMode: "los.salarycreditmode",
  accountHolderPrimary: "los.accountholder.primary",
  accountHolderCoApplicant: "los.accountholder.coapplicant",
  accountHolderGuarantor: "los.accountholder.guarantor",
  employer: "los.employer",
  industry: "los.industrysector",
  natureOfBusiness: "los.natureofbusiness",
  businessConstitution: "los.businessconstitution",
  profession: "los.profession",
  membershipType: "los.membershiptype",
  incomeProof: "los.incomeproof",
};

export const resolveDdeLookupKey = (optionsMaster) =>
  MASTER_ALIAS[optionsMaster] || optionsMaster;

export function useDdeLookups(orgId) {
  return useQdeLookups(orgId, DDE_LOOKUP_TYPES);
}

/** Lookup types the DDE screen shares with QDE (gender, borrower category, address types). */
export const DDE_SHARED_LOOKUP_TYPES = [
  "party.gender",
  "los.borrowercategory",
  "los.address.type.individual",
  "los.address.type.nonindividual",
];

/** Everything the DDE screen needs up front, so one request (not two) fetches it. */
export const DDE_SCREEN_LOOKUP_TYPES = [
  ...new Set([...DDE_LOOKUP_TYPES, ...DDE_SHARED_LOOKUP_TYPES]),
];

/**
 * All the DDE screen's dropdown lists in ONE request (cached and shared, see lookupCache.js),
 * instead of one request for the DDE types and a second one for the shared types.
 */
export function useDdeScreenLookups(orgId) {
  return useQdeLookups(orgId, DDE_SCREEN_LOOKUP_TYPES);
}

export default useDdeLookups;