/** Turns a plain string list into the `{ label, value }` shape HDropdown expects. */
export const toOptions = (values = []) => values.map((v) => ({ label: v, value: v }));

export const APPLICATION_TYPES = [
  { label: "Balance Transfer", value: "BLTR" },
  { label: "New", value: "N" },
  { label: "Top Up", value: "TOPUP" },
];

export const PORTFOLIOS = [{ label: "Home Loan", value: "HL" }];

export const DEFAULT_PORTFOLIO = "HL";
export const DEFAULT_LOAN_TYPE = "Term Loan";

export const GENDERS = [
  { label: "Female", value: "F" },
  { label: "Male", value: "M" },
  { label: "Transgender", value: "T" },
];

export const Profiles = toOptions(["Salaried", "SENP", "SEP"]);

/** Also used as "Customer Profile" on Co-Applicant/Guarantor rows — same field, same lookup type. */
export const BORROWER_CATEGORIES = [
  { label: "Salaried", value: "SAL" },
  { label: "SENP", value: "SENP" },
  { label: "SEP", value: "SEP" },
];

export const ADDRESS_TYPES_INDIVIDUAL = [
  { label: "Current", value: "CURR" },
  { label: "Office", value: "OFF" },
  { label: "Others", value: "OTH" },
  { label: "Permanent", value: "PERM" },
];

export const ADDRESS_TYPES_NON_INDIVIDUAL = toOptions([
  "Registered Office",
  "Corporate Office",
  "Factory",
  "Branch",
  "Communication",
]);

export const CHANNELS = [
  { label: "Branch", value: "BRANCH" },
  { label: "Dealer", value: "Dealer" },
  { label: "DSA", value: "DSA" },
  { label: "RM", value: "RM" },
];

export const RELATIONSHIPS = [
  { label: "Brother", value: "BROTHER" },
  { label: "Daughter", value: "DAUGHTER" },
  { label: "Director", value: "DIRECTOR" },
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Other", value: "OTHER" },
  { label: "Partner", value: "PARTNER" },
  { label: "Sister", value: "SISTER" },
  { label: "Son", value: "SON" },
  { label: "Spouse", value: "SPOUSE" },
];

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
export const PRODUCTS = [
  { label: "HL Fixed", value: "HLFIXED" },
  { label: "HL Floating", value: "HLFLOAT" },
];

export const SCHEMES = [
  { label: "Standard", value: "STD" },
  { label: "Promotional", value: "PROMO" },
];

export const BRANCHES = [
  { label: "Bengaluru - MG Road", value: "BLR-MGROAD" },
  { label: "Bengaluru - Whitefield", value: "BLR-WHITEFIELD" },
  { label: "Bengaluru - Koramangala", value: "BLR-KORAMANGALA" },
  { label: "Bengaluru - Indiranagar", value: "BLR-INDIRANAGAR" },
  { label: "Chennai - T Nagar", value: "CHN-TNAGAR" },
  { label: "Chennai - Anna Nagar", value: "CHN-ANNANAGAR" },
  { label: "Chennai - Adyar", value: "CHN-ADYAR" },
  { label: "Chennai - Velachery", value: "CHN-VELACHERY" },
  { label: "Delhi - Connaught Place", value: "DEL-CP" },
  { label: "Delhi - Saket", value: "DEL-SAKET" },
  { label: "Delhi - Dwarka", value: "DEL-DWARKA" },
  { label: "Delhi - Rohini", value: "DEL-ROHINI" },
  { label: "Kolkata - Park Street", value: "KOL-PARKSTREET" },
  { label: "Kolkata - Salt Lake", value: "KOL-SALTLAKE" },
  { label: "Kolkata - Ballygunge", value: "KOL-BALLYGUNGE" },
  { label: "Kolkata - New Town", value: "KOL-NEWTOWN" },
  { label: "Hyderabad - Banjara Hills", value: "HYD-BANJARAHILLS" },
  { label: "Hyderabad - Gachibowli", value: "HYD-GACHIBOWLI" },
  { label: "Hyderabad - Secunderabad", value: "HYD-SECUNDERABAD" },
  { label: "Hyderabad - Hitech City", value: "HYD-HITECHCITY" },
  { label: "Mumbai - Fort", value: "MUM-FORT" },
  { label: "Mumbai - Andheri", value: "MUM-ANDHERI" },
  { label: "Mumbai - Bandra", value: "MUM-BANDRA" },
  { label: "Mumbai - Lower Parel", value: "MUM-LOWERPAREL" },
  { label: "Pune - Camp", value: "PUN-CAMP" },
  { label: "Pune - Kothrud", value: "PUN-KOTHRUD" },
  { label: "Pune - Hinjewadi", value: "PUN-HINJEWADI" },
  { label: "Pune - Viman Nagar", value: "PUN-VIMANNAGAR" },
];

export const LOAN_TYPES = [{ label: "Term Loan", value: "TERM" }];

export const OCR_DOC_TYPES = [{ label: "Application Form", value: "APPFORM" }];

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

export const statusLabelKey = (status) => STATUS_LABEL_KEYS[status] || "label.qde.status.notStarted";
