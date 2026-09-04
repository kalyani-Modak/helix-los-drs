import React from "react";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { HDatePicker, HDropdown, HLabel, HTextField, useDrsTheme } from "@helix/component-library";

import { getFieldSectionsForAssetType } from "./addAssetFieldConfig";

import styles from "./addAssetScreen.module.css";

/**
 * Renders dynamic asset fields. Per Interface Delight: label above control in each grid cell (space-y-1), gap-3 grid.
 */
export default function AddAssetFormFields({ apiAssetType, data, onChange, readOnly, ownerTypeOptions = [] }) {
  const intl = useIntl();
  const { text } = useDrsTheme();
  const sections = getFieldSectionsForAssetType(apiAssetType);

  const handleField = (key) => (e) => {
    onChange(key, e.target.value);
  };

  const handleDateField = (key) => (value) => {
    onChange(key, value);
  };

  const getDateValue = (value) => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };

  const renderControl = (field) => {
    const isNumericField = /^(bd|in|ln)/i.test(field.key);

    if (field.control === "date") {
      return (
        <HDatePicker
          value={getDateValue(data[field.key])}
          onChange={handleDateField(field.key)}
          required={field.required}
          width="100%"
          disabled={readOnly}
        />
      );
    }

    if (field.control === "select") {
      const options = field.key === "szOwnerType" ? ownerTypeOptions : field.options || [];
      return (
        <HDropdown
          name={field.key}
          value={data[field.key] || ""}
          onChange={handleField(field.key)}
          options={options}
          readOnly={readOnly}
          width="100%"
        />
      );
    }

    return (
      <HTextField
        editable={!readOnly}
        required={field.required}
        type={isNumericField ? "number" : "text"}
        value={data[field.key] != null && data[field.key] !== "" ? String(data[field.key]) : ""}
        onChange={handleField(field.key)}
      />
    );
  };

  if (!apiAssetType || sections.length === 0) {
    return null;
  }

  return (
    <div className={styles.sectionStack}>
      {sections.map((section) => (
        <div key={section.titleKey} className={styles.formSectionBlock}>
          <div className={styles.subsectionTitle}>
            {intl.formatMessage({ id: section.titleKey })}
          </div>
          <div className={styles.fieldGrid}>
            {section.fields.map((field) => (
              <div key={field.key} className={styles.fieldCell}>
                <HLabel
                  value={field.labelKey}
                  required={field.required}
                  align="left"
                  colon={false}
                  color={text.secondary}
                />
                <div className={styles.fieldControl}>
                  {renderControl(field)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
