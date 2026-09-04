import React from "react";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useIntl } from "react-intl";
import { isCollectionAddressType, isEditableAddressType } from "./addressEditable";

import { HBox, HDropdown, HLabel, HPaper, HTextField, useDrsTheme } from "@helix/component-library";
function Field({ label, required, value, onChange, editable, error, type = "text", children }) {
  return (
    <HBox sx={{ minWidth: 0, background: "transparent" }}>
      <HLabel
        value={label}
        translate={false}
        colon={false}
        required={required}
        align="left"
        sx={{ mb: 0.45, fontSize: 11, fontWeight: 600 }}
      />
      {children || (
        <HTextField
          width="100%"
          editable={editable}
          disabled={false}
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          type={type}
          required={required}
          error={Boolean(error)}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: 30,
              borderRadius: "5px",
            },
            "& .MuiInputBase-input": {
              py: 0.25,
              fontSize: 12,
            },
          }}
        />
      )}
    </HBox>
  );
}

export default function AddressDetailsSection({ draftDetails, onFieldChange, fieldErrors, addressTypeForRule }) {
  const intl = useIntl();
  const { surfaces, text, border, colors } = useDrsTheme();
  const hasAddressType = Boolean(draftDetails?.szAddressType);
  const editable = isEditableAddressType(addressTypeForRule ?? draftDetails?.szAddressType);

  if (!hasAddressType) return null;

  const t = (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback });
  const hasExistingAddressKey = Boolean(draftDetails.lnAddressSeq || draftDetails.lnSNo);
  const isCollection = isCollectionAddressType(draftDetails.szAddressType);
  const showRequired = editable && isCollection;
  const title = editable
    ? !isCollection
      ? `${t("label.updateAddress.updateAddress", "Update Address")} - ${draftDetails.szAddressType}`
      : hasExistingAddressKey
      ? t("label.updateAddress.updateCollectionsAddress", "Update Collections Address")
      : t("label.updateAddress.addNewCollectionsAddress", "Add New Collections Address")
    : `${t("label.UpdateAddress.Address details", "Address Details")} - ${draftDetails.szAddressType}`;
  const currentAddressType = draftDetails.szAddressType || "Collections";
  const addressTypeOptions = [{ label: currentAddressType, value: currentAddressType }];

  return (
    <HPaper
      variant="outlined"
      elevation={0}
      sx={{
        borderRadius: "8px",
        borderColor: border.divider,
        boxShadow: 1,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <HBox sx={{ px: 2, pt: 1.5, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <EditOutlined sx={{ fontSize: 16, color: colors.primary }} />
        <HLabel
          value={title}
          translate={false}
          colon={false}
          align="left"
          sx={{ fontWeight: 700, fontSize: 13, color: text.primary, flex: 1 }}
        />
        {!editable ? (
          <HLabel
            value={t("label.updateAddress.readOnly", "Read Only")}
            translate={false}
            colon={false}
            align="center"
            sx={{
              px: 1,
              py: 0.35,
              borderRadius: "999px",
              backgroundColor: surfaces.panel,
              fontSize: 10,
              fontWeight: 700,
            }}
          />
        ) : null}
      </HBox>

      <HBox
        sx={{
          px: 2,
          pb: 2,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          columnGap: 2,
          rowGap: 1.45,
          background: "transparent",
        }}
      >
        <HBox sx={{ gridColumn: "1 / -1", background: "transparent" }}>
          <Field
            label={t("label.UpdateAddress.Address Type", "Address Type")}
            required={showRequired}
            value={draftDetails.szAddressType}
            editable={false}
            error={fieldErrors.szAddressType}
          >
            <HDropdown
              value={draftDetails.szAddressType || "Collections"}
              options={addressTypeOptions}
              onChange={(e) => onFieldChange("szAddressType", e.target.value)}
              readOnly={hasExistingAddressKey || !editable}
              required={showRequired}
              width="100%"
              error={Boolean(fieldErrors.szAddressType)}
            />
          </Field>
        </HBox>

        <Field
          label={t("label.UpdateAddress.Contact Person", "Contact Person")}
          required={showRequired}
          value={draftDetails.szContactPerson}
          editable={editable}
          onChange={(value) => onFieldChange("szContactPerson", value)}
          error={fieldErrors.szContactPerson}
        />
        <Field
          label={t("label.UpdateAddress.Address line 1", "Address 1")}
          required={showRequired}
          value={draftDetails.szAddress1}
          editable={editable}
          onChange={(value) => onFieldChange("szAddress1", value)}
          error={fieldErrors.szAddress1}
        />
        <Field
          label={t("label.UpdateAddress.Address line 2", "Address 2")}
          value={draftDetails.szAddress2}
          editable={editable}
          onChange={(value) => onFieldChange("szAddress2", value)}
          error={fieldErrors.szAddress2}
        />
        <Field
          label={t("label.UpdateAddress.Address line 3", "Address 3")}
          value={draftDetails.szAddress3}
          editable={editable}
          onChange={(value) => onFieldChange("szAddress3", value)}
        />
        <Field
          label={t("label.UpdateAddress.Address line 4", "Address 4")}
          value={draftDetails.szAddress4}
          editable={editable}
          onChange={(value) => onFieldChange("szAddress4", value)}
        />
        <Field
          label={t("label.UpdateAddress.City", "City")}
          required={showRequired}
          value={draftDetails.szCity}
          editable={editable}
          onChange={(value) => onFieldChange("szCity", value)}
          error={fieldErrors.szCity}
        />
        <Field
          label={t("label.UpdateAddress.State", "State")}
          required={showRequired}
          value={draftDetails.szState}
          editable={editable}
          onChange={(value) => onFieldChange("szState", value)}
          error={fieldErrors.szState}
        />
        <Field
          label={t("label.UpdateAddress.Country", "Country")}
          required={showRequired}
          value={draftDetails.szCountry || "India"}
          editable={editable}
          onChange={(value) => onFieldChange("szCountry", value)}
          error={fieldErrors.szCountry}
        />
        <Field
          label={t("label.UpdateAddress.Zip", "Zip")}
          required={showRequired}
          value={draftDetails.szZip}
          editable={editable}
          onChange={(value) => onFieldChange("szZip", value)}
          error={fieldErrors.szZip}
        />
        <Field
          label={t("label.UpdateAddress.Mobile No", "Mobile")}
          required={showRequired}
          value={draftDetails.szMobileNo}
          editable={editable}
          onChange={(value) => onFieldChange("szMobileNo", value)}
          error={fieldErrors.szMobileNo}
          type="phone"
        />
        <Field
          label={t("label.UpdateAddress.Email", "Email")}
          value={draftDetails.szMailId}
          editable={editable}
          onChange={(value) => onFieldChange("szMailId", value)}
        />
        <Field
          label={t("label.UpdateAddress.Phone 1", "Telephone")}
          value={draftDetails.szPhone1}
          editable={editable}
          onChange={(value) => onFieldChange("szPhone1", value)}
          type="phone"
        />
        <Field
          label={t("label.UpdateAddress.Fax", "Fax")}
          value={draftDetails.szFax}
          editable={editable}
          onChange={(value) => onFieldChange("szFax", value)}
        />
      </HBox>
    </HPaper>
  );
}
