
/**
 * Static option/configuration values for the
 * Detailed Data Entry (DDE) screen.
 */

/* -------------------------------------------------------------------------- */
/* OCR Upload                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Maximum OCR document upload size.
 *
 * 10 MB
 */
export const OCR_MAX_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Accepted OCR document/file types.
 *
 * Use these values directly with the file input / upload component.
 */
export const OCR_ACCEPT = {
  PDF: "application/pdf",
  JPEG: "image/jpeg",
  JPG: "image/jpg",
  PNG: "image/png",
};

/**
 * Combined accept string for HTML file inputs.
 *
 * Example:
 *
 * <input type="file" accept={OCR_ACCEPT_STRING} />
 */
export const OCR_ACCEPT_STRING = Object.values(OCR_ACCEPT).join(",");


/* -------------------------------------------------------------------------- */
/* OCR Upload Status                                                          */
/* -------------------------------------------------------------------------- */

export const UPLOAD_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
};


/* -------------------------------------------------------------------------- */
/* DDE Personal Details                                                       */
/* -------------------------------------------------------------------------- */

export const DDE_FIELD_NAMES = {
  PROFILE: "profile",
  TITLE: "title",
  FIRST_NAME: "firstName",
  MIDDLE_NAME: "middleName",
  LAST_NAME: "lastName",
  AADHAAR: "aadhaar",
  PAN: "pan",
  PASSPORT_NO: "passportNo",
  DOB: "dob",
  GENDER: "gender",
  MARITAL_STATUS: "maritalStatus",
  SPOUSE_NAME: "spouseName",
  DEPENDENTS: "dependents",
  NATIONALITY: "nationality",
  COUNTRY_OF_BIRTH: "countryOfBirth",
  RELIGION: "religion",
  EDUCATION_LEVEL: "educationLevel",
  RESIDENCE_STATUS: "residenceStatus",
  MOBILE: "mobile",
  EMAIL: "email",
};


/* -------------------------------------------------------------------------- */
/* Verification                                                               */
/* -------------------------------------------------------------------------- */

export const DDE_VERIFICATION_STATUS = {
  NOT_STARTED: "Not Started",
  PENDING: "Pending",
  VERIFIED: "Verified",
  FAILED: "Failed",
};


/* -------------------------------------------------------------------------- */
/* Employment / Income                                                        */
/* -------------------------------------------------------------------------- */

export const EMPLOYMENT_TYPES = [
  { label: "Salaried", value: "Salaried" },
  {
    label: "Self Employed Professional",
    value: "Self Employed Professional",
  },
  {
    label: "Self Employed Non Professional",
    value: "Self Employed Non Professional",
  },
  { label: "Business", value: "Business" },
  { label: "Agriculturist", value: "Agriculturist" },
  { label: "Other", value: "Other" },
];

export const INCOME_FREQUENCIES = [
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
  { label: "Half Yearly", value: "Half Yearly" },
  { label: "Yearly", value: "Yearly" },
];


/* -------------------------------------------------------------------------- */
/* Address                                                                    */
/* -------------------------------------------------------------------------- */

export const DDE_ADDRESS_TYPES = [
  { label: "Current Residence", value: "Current Residence" },
  { label: "Permanent", value: "Permanent" },
  { label: "Office", value: "Office" },
  { label: "Communication", value: "Communication" },
];


/* -------------------------------------------------------------------------- */
/* Common Yes / No                                                             */
/* -------------------------------------------------------------------------- */

export const YES_NO_OPTIONS = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" },
];

