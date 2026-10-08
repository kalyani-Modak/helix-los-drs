
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

/* -------------------------------------------------------------------------- */
/* Address                                                                    */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/* Common Yes / No                                                             */
/* -------------------------------------------------------------------------- */
