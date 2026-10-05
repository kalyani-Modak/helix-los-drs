const matchesEquals = (actual, expected) => {
  if (Array.isArray(expected)) {
    return expected.some((v) => matchesEquals(actual, v));
  }
  if (expected === true || expected === false) {
    return Boolean(actual) === expected;
  }
  return String(actual ?? "") === String(expected ?? "");
};

export const isDdeFieldVisible = (field, values) => {
  if (field.showIf && !matchesEquals(values[field.showIf.field], field.showIf.equals)) {
    return false;
  }
  if (field.alsoShowIf && !matchesEquals(values[field.alsoShowIf.field], field.alsoShowIf.equals)) {
    return false;
  }
  return true;
};

export const filterVisibleFields = (fields, values) =>
  fields.filter((f) => isDdeFieldVisible(f, values));

export const isDdeSectionVisible = (sectionConfig, values) => {
  if (sectionConfig.custom === "perfios") {
    return true;
  }
  if (sectionConfig.key === "borrowerCategory") {
    return true;
  }
  if (sectionConfig.sectionFilter === "Employment & Income" || sectionConfig.sectionFilter === "Income Details") {
    return values.customerType === "Salaried";
  }
  if (sectionConfig.sectionFilter === "Self-Employed Professional") {
    return values.customerType === "Self Employed Professional (SEP)";
  }
  if (sectionConfig.sectionFilter === "Self-Employed Business") {
    return values.customerType === "Self Employed Non-Professional (SENP)";
  }
  if (sectionConfig.sectionFilter === "Pensioner Income") {
    return values.customerType === "Pensioner";
  }
  return true;
};
