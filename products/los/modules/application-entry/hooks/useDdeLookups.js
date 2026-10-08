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
  "los.repaymentfrequency",
  "los.ratetype",
  "los.repaymentscheduletype",
  "los.coapplicanttype",
  "los.coapplicant.relationship",
  "los.guarantor.relationship",
  "los.income.type.salaried",
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
  repaymentFrequency: "los.repaymentfrequency",
  rateType: "los.ratetype",
  repaymentScheduleType: "los.repaymentscheduletype",
  coApplicantType: "los.coapplicanttype",
  coApplicantRelationship: "los.coapplicant.relationship",
  guarantorRelationship: "los.guarantor.relationship",
  salariedIncomeType: "los.income.type.salaried",
};

export const resolveDdeLookupKey = (optionsMaster) =>
  MASTER_ALIAS[optionsMaster] || optionsMaster;

export function useDdeLookups(orgId) {
  return useQdeLookups(orgId, DDE_LOOKUP_TYPES);
}

export default useDdeLookups;