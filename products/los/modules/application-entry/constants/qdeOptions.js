/**
 * Static option sets for the quick data entry screen.
 *
 * HDropdown renders `{ label, value }` objects and does not translate the label,
 * so these carry display text (they are master data placeholders until the
 * corresponding master APIs are wired). HRadioGroup, on the other hand, passes
 * `label` through react-intl, so radio options carry i18n keys.
 */

/** Turns a plain string list into the `{ label, value }` shape HDropdown expects. */
export const toOptions = (values = []) => values.map((v) => ({ label: v, value: v }));

export const APPLICATION_TYPES = toOptions(["New", "Balance Transfer", "Top Up"]);

export const PORTFOLIOS = toOptions([
  "Home Loan",
  "Loan Against Property",
  "Personal Loan",
  "Business Loan",
  "Auto Loan",
  "Gold Loan",
]);

export const DEFAULT_PORTFOLIO = "Home Loan";

export const GENDERS = toOptions(["Male", "Female", "Transgender", "Other"]);

export const Profiles = toOptions(["Salaried", "SENP", "SEP"]);

export const BORROWER_CATEGORIES = toOptions([
  "General",
  "Priority Sector",
  "Salaried",
  "Self Employed Professional",
  "Self Employed Non Professional",
  "Agriculturist",
  "Senior Citizen",
  "Staff",
]);

export const ADDRESS_TYPES_INDIVIDUAL = toOptions([
  "Permanent",
  "Current Residence",
  "Office",
  "Communication",
  "Native",
]);

export const ADDRESS_TYPES_NON_INDIVIDUAL = toOptions([
  "Registered Office",
  "Corporate Office",
  "Factory",
  "Branch",
  "Communication",
]);

export const CHANNELS = toOptions(["Branch", "DSA", "RM", "Dealer", "Connector", "Tele Sales"]);

export const ENTITY_TYPES = toOptions([
  "Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership",
  "Private Limited Company",
  "Public Limited Company",
  "Trust",
  "Society",
  "HUF",
  "Association of Persons",
]);

/** Products offered under the default Home Loan portfolio. */
export const PRODUCTS = toOptions([
  "Home Loan - Purchase",
  "Home Loan - Construction",
  "Home Loan - Plot Purchase",
  "Home Loan - Improvement",
  "Home Loan - Extension",
  "Home Loan - Balance Transfer",
]);

export const SCHEMES = [
  { label: "HL Prime - Salaried", value: "HL-PRIME-SAL" },
  { label: "HL Prime - Self Employed", value: "HL-PRIME-SE" },
  { label: "HL Affordable Housing", value: "HL-AFFORD" },
  { label: "PMAY - CLSS", value: "HL-PMAY-CLSS" },
  { label: "HL Balance Transfer Plus", value: "HL-BT-PLUS" },
];

export const BRANCHES = [
  { label: "Mumbai - Fort", value: "BR-MUM-001" },
  { label: "Mumbai - Andheri East", value: "BR-MUM-002" },
  { label: "Pune - Shivaji Nagar", value: "BR-PNQ-001" },
  { label: "Bengaluru - Koramangala", value: "BR-BLR-001" },
  { label: "Delhi - Connaught Place", value: "BR-DEL-001" },
  { label: "Chennai - T Nagar", value: "BR-MAA-001" },
  { label: "Hyderabad - Banjara Hills", value: "BR-HYD-001" },
];

export const LOAN_TYPES = toOptions([
  "Term Loan",
  "Overdraft",
  "Cash Credit",
  "Bullet Repayment",
  "Drop Line Overdraft",
]);

export const OCR_DOC_TYPES = toOptions([
  "Application Form",
  "PAN Card",
  "Aadhaar Card",
  "Passport",
  "Voter ID",
  "Driving Licence",
  "Bank Statement",
]);

/** Radio option sets — `label` is resolved through react-intl by HRadio. */
// export const BORROWER_TYPE_OPTIONS = [
//   { value: "Individual", label: "label.qde.option.individual" },
//   { value: "Non-Individual", label: "label.qde.option.nonIndividual" },
// ];

// export const CUSTOMER_TYPE_OPTIONS = [
//   { value: "New", label: "label.qde.option.new" },
//   { value: "Existing", label: "label.qde.option.existing" },
// ];

// export const YES_NO_OPTIONS = [
//   { value: "Y", label: "label.qde.option.yes" },
//   { value: "N", label: "label.qde.option.no" },
// ];

/** Verification lifecycle values persisted on the form. */
export const VERIFICATION_STATUS = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  FAILED: "Failed",
};

const STATUS_LABEL_KEYS = {
  Pending: "label.qde.status.pending",
  Verified: "label.qde.status.verified",
  Failed: "label.qde.status.failed",
};

/** Maps a persisted verification status to its i18n key for HLabel. */
export const statusLabelKey = (status) => STATUS_LABEL_KEYS[status] || "label.qde.status.notStarted";

export const BORROWER_TYPE_NON_INDIVIDUAL = "Non-Individual";
