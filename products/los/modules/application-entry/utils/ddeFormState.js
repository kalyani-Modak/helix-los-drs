import { DDE_FIELDS } from "../constants/ddeFieldMetadata";
import { DDE_INCOME_SOURCES } from "../constants/ddeIncomeSources";

export const createEmptyDdeForm = () => {
  const form = {
    applicationNo: "",
    coApplicants: [],
    guarantors: [],
    perfiosFileName: "",
    ddeMeta: { applicationDetails: {}, loanDetailsRow: {}, primaryApplicantId: null },
  };
  DDE_FIELDS.forEach((f) => {
    if (form[f.name] !== undefined) return;
    if (f.type === "checkbox") {
      form[f.name] = false;
    } else {
      form[f.name] = "";
    }
  });
  DDE_INCOME_SOURCES.forEach((source) => {
    source.months.forEach((monthField) => {
      form[monthField] = "";
    });
  });
  return form;
};

export const computeAgeFromDob = (dob) => {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age >= 0 && age < 150 ? String(age) : "";
};
