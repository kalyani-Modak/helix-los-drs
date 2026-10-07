import { DDE_FIELDS } from "../constants/ddeFieldMetadata";

const cloneSection = (sectionName) =>
  DDE_FIELDS.filter((f) => f.section === sectionName).map((f) => ({ ...f }));

export const RELATIONSHIPS_CO = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Sibling",
  "Business Partner",
  "Other",
];

export const RELATIONSHIPS_GUAR = [
  "Spouse",
  "Father",
  "Mother",
  "Son",
  "Daughter",
  "Sibling",
  "Relative",
  "Friend",
  "Business Partner",
  "Employer",
  "Other",
];

const REPAYMENT_MODES = ["SI", "CEFTS", "Cash deposits", "Cheque"];

export const partyPersonalFields = (variant) => {
  const base = cloneSection("Personal Details");
  const extra = [
    {
      name: "relationship",
      type: "select",
      label: "Relationship with Main Borrower",
      required: true,
      options: variant === "co" ? RELATIONSHIPS_CO : RELATIONSHIPS_GUAR,
      section: "Personal Details",
    },
  ];
  if (variant === "co") {
    extra.push({
      name: "type",
      type: "select",
      label: "Co-Applicant Type",
      required: true,
      options: ["Earning", "Non-Earning"],
      section: "Personal Details",
    });
  }
  return [...base, ...extra];
};

export const partyCurrentAddressFields = () => cloneSection("Current Address");

export const partyPermanentAddressFields = () =>
  cloneSection("Permanent Address").filter((f) => f.name !== "sameAsCurrent");

export const partyEmploymentFields = (isNonEarning) =>
  cloneSection("Employment & Income").map((f) => ({
    ...f,
    section: "Employment Details",
    required: isNonEarning ? false : f.required,
  })).concat([
    {
      name: "totalIncome",
      type: "number",
      min: 0,
      section: "Employment Details",
    },
  ]);

export const partyBankFields = (holderLabel) => [
  {
    name: "bankAccountHolder",
    type: "select",
    label: "Account Holder",
    required: true,
    options: [holderLabel],
    section: "Bank Details",
  },
  {
    name: "bankName",
    type: "select",
    label: "Bank Name",
    required: true,
    optionsMaster: "bank",
    section: "Bank Details",
  },
  {
    name: "bankBranch",
    type: "select",
    label: "Branch",
    required: true,
    optionsMaster: "branch",
    optionsMasterParentField: "bankName",
    help: true,
    section: "Bank Details",
  },
  {
    name: "bankAccountType",
    type: "select",
    label: "Account Type",
    required: true,
    optionsMaster: "accountType",
    section: "Bank Details",
  },
  {
    name: "bankAccountNumber",
    type: "text",
    label: "Account Number",
    required: true,
    maxLength: 30,
    section: "Bank Details",
  },
  {
    name: "bankIsRecovery",
    type: "checkbox",
    label: "Mark as Recovery / Disbursement Account",
    help: true,
    section: "Bank Details",
  },
  {
    name: "repaymentMode",
    type: "select",
    label: "Repayment Mode",
    required: true,
    options: REPAYMENT_MODES,
    section: "Bank Details",
  },
];

export const partySubsections = (variant, isNonEarning) => [
  {
    key: "personal",
    titleKey: "label.dde.section.personal",
    fields: partyPersonalFields(variant),
  },
  {
    key: "currentAddress",
    titleKey: "label.dde.section.currentAddress",
    sameAsPrimaryField: "sameAsPrimaryCurrent",
    fields: partyCurrentAddressFields(),
  },
  {
    key: "permanentAddress",
    titleKey: "label.dde.section.permanentAddress",
    sameAsPrimaryField: "sameAsPrimaryPermanent",
    fields: partyPermanentAddressFields(),
  },
  {
    key: "employment",
    titleKey: "label.dde.section.employmentDetails",
    fields: partyEmploymentFields(isNonEarning),
  },
  {
    key: "bank",
    titleKey: "label.dde.section.bank",
    fields: partyBankFields(variant === "co" ? "Co-Applicant" : "Guarantor"),
  },
];
