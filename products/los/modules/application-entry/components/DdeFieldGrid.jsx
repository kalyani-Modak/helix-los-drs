import { Grid } from "@mui/material";
import {
  HCheckBox,
  HDatePicker,
  HDropdown,
  HLabel,
  HTextField,
  HTextarea,
} from "@helix/component-library";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import { filterVisibleFields } from "../utils/ddeFieldVisibility";
import { resolveDdeLookupKey } from "../hooks/useDdeLookups";

const fieldLabelId = (name) => `label.dde.field.${name}`;

const toDropdownOptions = (field, lookups, form) => {
  if (field.options?.length) {
    return field.options.map((o) => ({ label: o, value: o }));
  }
  if (field.optionsMaster) {
    const key = resolveDdeLookupKey(field.optionsMaster);
    let opts = lookups[key] || [];
    if (field.optionsMasterParentField && form[field.optionsMasterParentField]) {
      const parent = form[field.optionsMasterParentField];
      opts = opts.filter(
        (o) => !o.parent || o.parent === parent || o.parentCode === parent
      );
    }
    return opts;
  }
  return [];
};

const DdeFieldGrid = ({ fields, form, setField, errors = {}, lookups = {} }) => {
  const visible = filterVisibleFields(fields, form);
  const err = (name) => errors[name];

  return (
    <Grid container spacing={1.4} alignItems="flex-start">
      {visible.map((field) => {
        const width = field.fullWidth ? 12 : 4;
        const labelId = fieldLabelId(field.name);
        const disabled = Boolean(field.disabled);
        const readOnly = disabled;

        return (
          <Grid key={field.name} size={width}>
            <HLabel
              value={labelId}
              required={Boolean(field.required)}
              align="left"
              colon={false}
            />
            {field.type === "select" ? (
              <HDropdown
                name={field.name}
                options={toDropdownOptions(field, lookups, form)}
                value={form[field.name] ?? ""}
                onChange={(e) => setField(field.name, e.target.value)}
                disabled={readOnly}
                required={Boolean(field.required)}
                error={Boolean(err(field.name))}
                width="100%"
              />
            ) : null}
            {field.type === "checkbox" ? (
              <HCheckBox
                checked={Boolean(form[field.name])}
                onChange={(e) => setField(field.name, e.target.checked)}
                disabled={readOnly}
              />
            ) : null}
            {field.type === "date" ? (
              <HDatePicker
                value={toPickerValue(form[field.name])}
                onChange={(v) => setField(field.name, fromPickerValue(v))}
                disabled={readOnly}
                width="100%"
              />
            ) : null}
            {field.type === "textarea" ? (
              <HTextarea
                value={form[field.name] ?? ""}
                onChange={(e) => setField(field.name, e.target.value)}
                editable={!readOnly}
                disabled={readOnly}
                error={Boolean(err(field.name))}
                width="100%"
              />
            ) : null}
            {["text", "tel", "email", "number"].includes(field.type) ? (
              <HTextField
                value={form[field.name] ?? ""}
                onChange={(e) => setField(field.name, e.target.value)}
                editable={!readOnly}
                disabled={readOnly}
                required={Boolean(field.required)}
                error={Boolean(err(field.name))}
                width="100%"
                type={field.type === "number" ? "number" : "text"}
              />
            ) : null}
            {field.name === "customerType" && field.help ? (
              <HLabel
                value={`label.dde.help.${field.name}`}
                align="left"
                colon={false}
                sx={{ color: "text.secondary", fontSize: 11, mt: 0.5 }}
              />
            ) : null}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DdeFieldGrid;
