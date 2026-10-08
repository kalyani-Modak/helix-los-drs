import { DDE_PENSIONER, DDE_SALARIED, DDE_SENP, DDE_SEP } from "../constants/ddeSections";

const matchesEquals = (actual, expected) => {
  if (Array.isArray(expected)) {
    return expected.some((v) => matchesEquals(actual, v));
  }
  if (expected === true || expected === false) {
    return Boolean(actual) === expected;
  }
  return String(actual ?? "") === String(expected ?? "");
};

const expectedLookupCodes = (condition, lookups) => {
  if (!condition.lookupMaster) return condition.equals;
  const labels = Array.isArray(condition.equals) ? condition.equals : [condition.equals];
  const options = lookups?.[condition.lookupMaster] || [];
  const codes = labels
    .map((label) => options.find((option) => option.label === label)?.value)
    .filter((value) => value != null);
  return Array.isArray(condition.equals)
    ? codes
    : codes[0] ?? "__missing_lookup_code__";
};

export const isDdeFieldVisible = (field, values, lookups) => {
  if (
    field.showIf &&
    !matchesEquals(
      values[field.showIf.field],
      expectedLookupCodes(field.showIf, lookups)
    )
  ) {
    return false;
  }
  if (
    field.alsoShowIf &&
    !matchesEquals(
      values[field.alsoShowIf.field],
      expectedLookupCodes(field.alsoShowIf, lookups)
    )
  ) {
    return false;
  }
  return true;
};

export const filterVisibleFields = (fields, values, lookups) =>
  fields.filter((f) => isDdeFieldVisible(f, values, lookups));

export const isDdeSectionVisible = (sectionConfig, values) => {
  if (sectionConfig.custom === "perfios") {
    return true;
  }
  if (sectionConfig.key === "borrowerCategory") {
    return true;
  }
  if (sectionConfig.sectionFilter === "Employment & Income" || sectionConfig.sectionFilter === "Income Details") {
    return values.customerType === DDE_SALARIED;
  }
  if (sectionConfig.sectionFilter === "Self-Employed Professional") {
    return values.customerType === DDE_SEP;
  }
  if (sectionConfig.sectionFilter === "Self-Employed Business") {
    return values.customerType === DDE_SENP;
  }
  if (sectionConfig.sectionFilter === "Pensioner Income") {
    return values.customerType === DDE_PENSIONER;
  }
  return true;
};
