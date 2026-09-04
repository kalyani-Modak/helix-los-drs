/** Matches Interface Delight DocumentsPanel acceptedFormats + max size hint. */
export const UPLOAD_ACCEPT = ".csv,.doc,.docx,.jpg,.jpeg,.pdf,.xls,.xlsx";

export const UPLOAD_MAX_BYTES = 20 * 1024 * 1024;

/** i18n key suffixes under label.uploadDocument.type.* */
export const DOCUMENT_TYPE_I18N_KEYS = [
  "identityProof",
  "addressProof",
  "incomeProof",
  "bankStatement",
  "paymentReceipt",
  "legalNotice",
  "settlementLetter",
  "authorizationLetter",
  "insuranceDocument",
  "vehicleDocument",
  "other",
];

const DOCUMENT_TYPE_DEFAULT_LABELS = {
  identityProof: "Identity Proof",
  addressProof: "Address Proof",
  incomeProof: "Income Proof",
  bankStatement: "Bank Statement",
  paymentReceipt: "Payment Receipt",
  legalNotice: "Legal Notice",
  settlementLetter: "Settlement Letter",
  authorizationLetter: "Authorization Letter",
  insuranceDocument: "Insurance Document",
  vehicleDocument: "Vehicle Document",
  other: "Other",
};

export function buildDefaultDocumentTypeOptions(intl) {
  return DOCUMENT_TYPE_I18N_KEYS.map((key) => {
    const id = `label.uploadDocument.type.${key}`;
    const label = intl.formatMessage({
      id,
      defaultMessage: DOCUMENT_TYPE_DEFAULT_LABELS[key] || key,
    });
    return { value: label, label };
  });
}
