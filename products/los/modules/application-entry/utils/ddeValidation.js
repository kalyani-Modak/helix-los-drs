import { filterVisibleFields } from "./ddeFieldVisibility";
import { DDE_FIELDS } from "../constants/ddeFieldMetadata";

export const validateDdeForm = (values, intl, lookups) => {
  const errors = {};
  const message = (id, fallback) =>
    intl.formatMessage({ id, defaultMessage: fallback });

  filterVisibleFields(DDE_FIELDS, values, lookups).forEach((field) => {
    if (field.disabled) return;
    const raw = values[field.name];
    const empty =
      raw === undefined ||
      raw === null ||
      raw === "" ||
      (field.type === "checkbox" && raw !== true && field.required);

    if (field.required && empty) {
      const fieldLabel = message(
        `label.dde.field.${field.name}`,
        field.label || field.name
      );
      errors[field.name] = message(
        `label.dde.validation.required.${field.name}`,
        `${fieldLabel} is required.`
      );
    }

    if (!empty && field.pattern) {
      const re = new RegExp(field.pattern);
      if (!re.test(String(raw))) {
        errors[field.name] = message(
          "label.dde.validation.invalid",
          "Invalid value."
        );
      }
    }

    if (!empty && field.min != null && Number(raw) < field.min) {
      errors[field.name] = message(
        "label.dde.validation.min",
        `Minimum value is ${field.min}.`
      );
    }
    if (!empty && field.max != null && Number(raw) > field.max) {
      errors[field.name] = message(
        "label.dde.validation.max",
        `Maximum value is ${field.max}.`
      );
    }
  });

  return errors;
};
