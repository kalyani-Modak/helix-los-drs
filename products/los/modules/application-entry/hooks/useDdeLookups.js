import { useQdeLookups } from "./useQdeLookups";

/** Lookup types for DDE dropdowns. */
export const DDE_LOOKUP_TYPES = [
  "party.title",
  "party.maritalstatus",
  "party.nationality",
  "party.religion",
  "party.education",
  "party.residencestatus",
  "party.gender",
  "los.state",
  "los.employmenttype",
  "los.employercategory",
  "los.industry",
  "los.creditmode",
  "los.bank",
  "los.branch",
  "los.accounttype",
  "los.loanpurpose",
  "los.document",
];

const MASTER_ALIAS = {
  title: "party.title",
  gender: "party.gender",
  maritalStatus: "party.maritalstatus",
  nationality: "party.nationality",
  religion: "party.religion",
  education: "party.education",
  residenceStatus: "party.residencestatus",
  state: "los.state",
  employmentType: "los.employmenttype",
  employerCategory: "los.employercategory",
  industry: "los.industry",
  creditMode: "los.creditmode",
  bank: "los.bank",
  branch: "los.branch",
  accountType: "los.accounttype",
  loanPurpose: "los.loanpurpose",
  document: "los.document",
};

export const resolveDdeLookupKey = (optionsMaster) =>
  MASTER_ALIAS[optionsMaster] || optionsMaster;

export function useDdeLookups(orgId) {
  return useQdeLookups(orgId, DDE_LOOKUP_TYPES);
}

export default useDdeLookups;