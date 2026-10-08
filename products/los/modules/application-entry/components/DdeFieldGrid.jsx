import { Grid } from "@mui/material";
import {
  HCheckBox,
  HDatePicker,
  HDropdown,
  HBox,
  HLabel,
  HTextField,
  HTextarea,
} from "@helix/component-library";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import { filterVisibleFields } from "../utils/ddeFieldVisibility";
import { resolveDdeLookupKey } from "../hooks/useDdeLookups";
import FieldError from "./FieldError";

const fieldLabelId = (name) => `label.dde.field.${name}`;

const toDropdownOptions = (field, lookups, form = {}) => {
  if (field.optionsDependsOn) {
    const parent = form[field.optionsDependsOn.field];
    return parent ? lookups[field.optionsDependsOn.lookupPrefix + parent] ?? [] : [];
  }
  if (field.optionsMaster) {
    const key = resolveDdeLookupKey(field.optionsMaster);
    return lookups[key] || [];
  }
  return [];
};

const DdeFieldGrid = ({ fields, form, setField, setFields, errors = {}, lookups = {} }) => {
  const visible = filterVisibleFields(fields, form, lookups);
  const err = (name) => errors[name];

  return (
    <Grid
      container
      spacing={1.4}
      alignItems="flex-start"
      sx={{ width: "100%", minWidth: 0 }}
    >
      {visible.map((field) => {
        const width = field.fullWidth ? 12 : 4;
        const labelId = fieldLabelId(field.name);
        const disabled = Boolean(field.disabled);
        const readOnly = disabled;
        const handleChange = (event) => {
          let value = event.target.value;
          if (field.type === "number" && value !== "" && field.max != null) {
            const numericValue = Number(value);
            if (Number.isFinite(numericValue) && numericValue > field.max) {
              value = String(field.max);
            }
          }
          setField(field.name, value);
        };

        return (
          <Grid
            key={field.name}
            size={width}
            sx={
              field.type === "checkbox"
                ? {
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minHeight: 40,
                    pt: 0.25,
                  }
                : undefined
            }
          >
            {field.type === "checkbox" ? (
              <HBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                  width: "100%",
                }}
              >
                <HCheckBox
                  sx={{ width: 20, flexShrink: 0 }}
                  checked={Boolean(form[field.name])}
                  onChange={(e) => setField(field.name, e.target.checked)}
                  disabled={readOnly}
                />
                <HBox sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <HLabel 
                    sx={{color: "text.primary" }}
                    value={labelId}
                    required={Boolean(field.required)}
                    align="left"
                    colon={false}
                  />
                </HBox>
              </HBox>
            ) : (
              <HLabel
                value={labelId}
                required={Boolean(field.required)}
                align="left"
                colon={false}
                sx={{color: "text.primary",whiteSpace: field.name === "totalIncome" ? "nowrap" : "normal"}}
              />
            )}
            {field.type === "select" ? (
              <HDropdown
                name={field.name}
                options={toDropdownOptions(field, lookups, form)}
                placeholder={field.placeholder}
                value={form[field.name] ?? ""}
                onChange={(e) => {
                  const dependents = fields.filter((f) => f.optionsDependsOn?.field === field.name);
                  if (setFields) {
                    // one batched patch: parties update from a stale list, so sequential setField calls would overwrite each other
                    setFields({
                      [field.name]: e.target.value,
                      ...Object.fromEntries(dependents.map((f) => [f.name, ""])),
                    });
                    return;
                  }
                  setField(field.name, e.target.value);
                  dependents.forEach((f) => setField(f.name, ""));
                }}
                disabled={readOnly}
                required={Boolean(field.required)}
                error={Boolean(err(field.name))}
                width="100%"
              />
            ) : null}
            {field.type === "date" ? (
              <HDatePicker
                value={toPickerValue(form[field.name])}
                onChange={(v) => setField(field.name, fromPickerValue(v))}
                disabled={readOnly}
                error={Boolean(err(field.name))}
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
                onChange={handleChange}
                editable={!readOnly}
                disabled={readOnly}
                required={Boolean(field.required)}
                error={Boolean(err(field.name))}
                placeholder={field.placeholder}
                width={field.type === "number" ? "100%" : "100%"}
                type={field.type === "number" ? "number" : "text"}
                fullWidth={field.name === "totalIncome"}
              />
            ) : null}
            <FieldError message={err(field.name)} sx={{ mt: 0.5 }} />
            {field.help ? (
              <HLabel
                value={`label.dde.help.${field.name}`}
                align="left"
                colon={false}
                sx={{ color: "text.secondary", fontSize: 11, mt: 0.25 }}
              />
            ) : null}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DdeFieldGrid;
