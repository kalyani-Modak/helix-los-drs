import { cloneElement, useEffect } from "react";
import {
  HButton,
  HCheckBox,
  HDatePicker,
  HDropdown,
  HLabel,
  HRadio,
  HTextField,
  HBox,
} from "@helix/component-library";
import { BORROWER_CATEGORIES, ENTITY_TYPES, GENDERS } from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import AddressDetailsSection from "../sections/AddressDetailsSection";
import KycCheckSection from "../sections/KycCheckSection";
import SectionBlock from "./SectionBlock";

const PartyField = ({ label, children, required = false, error, sx }) => (
  <HBox sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.5, ...sx }}>
    <HLabel value={label} required={required} align="left" colon={false} />
    {children && typeof children === "object" && !Array.isArray(children)
      ? cloneElement(children, { error })
      : children}
  </HBox>
);

const PartyRow = ({
  party,
  index,
  titleKey,
  onChange,
  onRemove,
  errors = {},
  primaryBorrowerType,
  primaryAddress = {},
  kycHandlers = {},
}) => {
  const isNonIndividual = party.borrowerType === "Non-Individual";
  const individualOnly = primaryBorrowerType === "Individual";
  const field = (name, value) => onChange(party.id, name, value);
  const err = (name) => errors[name];
  const addressFields = ["addressType", "addr1", "addr2", "addr3", "landmark", "pincode", "city", "district", "state", "country"];
  const addressForm = party.sameAsPrimaryAddress ? primaryAddress : party;

  useEffect(() => {
    if (!party.sameAsPrimaryAddress) return;
    addressFields.forEach((name) => {
      const value = primaryAddress[name] || "";
      if ((party[name] || "") !== value) field(name, value);
    });
  }, [party, primaryAddress]);

  const setPartyField = (name, value) => field(name, value);
  const partyHandlers = Object.fromEntries(
    Object.entries(kycHandlers).filter(([name]) => name.startsWith("on"))
      .map(([name, handler]) => [name, () => handler(party)])
  );
  const partyVerifying = Object.fromEntries(
    Object.entries(kycHandlers).filter(([name]) => name.startsWith("verifying"))
      .map(([name, getter]) => {
        const key = name.replace("verifying", "");
        return [key.charAt(0).toLowerCase() + key.slice(1), getter(party)];
      })
  );

  return (
    <SectionBlock sectionKey={`party-${party.id}`} titleKey="" noAccordion>
      <HBox sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 1 }}>
        <HLabel value={`${titleKey} ${index + 1}`} translate={false} align="left" colon={false} />
        <HButton label="label.qde.button.remove" variant="text" size="small" inline onClick={() => onRemove(party.id)} />
      </HBox>

      <HBox sx={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2, alignItems: "start", "@media (max-width: 700px)": { gridTemplateColumns: "1fr" } }}>
        <PartyField label="label.qde.field.relationship"><HTextField value={party.relationship || ""} onChange={(e) => field("relationship", e.target.value)} editable width="100%" /></PartyField>
        <PartyField label="label.qde.field.borrowerType" required>
          <HBox sx={{ display: "flex", gap: 2, minHeight: 40 }}>
            <HRadio label="Individual" checked={!isNonIndividual} onChange={() => field("borrowerType", "Individual")} />
            <HRadio label="Non-Individual" checked={isNonIndividual} disabled={individualOnly} onChange={() => field("borrowerType", "Non-Individual")} />
          </HBox>
        </PartyField>
        <PartyField label="label.qde.field.customerType" required sx={{ gridColumn: "1" }}>
          <HBox sx={{ display: "flex", gap: 2, minHeight: 40 }}>
            <HRadio label="New" checked={party.customerType === "New"} onChange={() => field("customerType", "New")} />
            <HRadio label="Existing" checked={party.customerType === "Existing"} onChange={() => field("customerType", "Existing")} />
          </HBox>
        </PartyField>

        {party.customerType === "Existing" && (
          <>
            <PartyField label="label.qde.field.customerId" required error={Boolean(err("customerId"))} sx={{ gridColumn: "2" }}><HTextField value={party.customerId || ""} onChange={(e) => field("customerId", e.target.value)} editable required width="100%" /></PartyField>
            <PartyField label="label.qde.field.searchRecords" sx={{ gridColumn: "3" }}><HTextField value={party.customerSearch || ""} onChange={(e) => field("customerSearch", e.target.value)} editable width="100%" /></PartyField>
          </>
        )}

        {party.customerType !== "Existing" && (
          <HBox sx={{ gridColumn: "2 / -1", minHeight: 40 }} />
        )}

        {isNonIndividual ? (
          <>
            <PartyField label="label.qde.field.entityName" required error={Boolean(err("entityName"))}><HTextField value={party.entityName || ""} onChange={(e) => field("entityName", e.target.value)} editable required width="100%" /></PartyField>
            <PartyField label="label.qde.field.entityType" required><HDropdown name="entityType" options={ENTITY_TYPES} value={party.entityType || ""} onChange={(e) => field("entityType", e.target.value)} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.doi"><HDatePicker value={toPickerValue(party.doi)} onChange={(value) => field("doi", fromPickerValue(value))} width="100%" /></PartyField>
          </>
        ) : (
          <>
            <PartyField label="label.qde.field.firstName" required error={Boolean(err("firstName"))}><HTextField value={party.firstName || ""} onChange={(e) => field("firstName", e.target.value)} editable required type="name" width="100%" /></PartyField>
            <PartyField label="label.qde.field.middleName"><HTextField value={party.middleName || ""} onChange={(e) => field("middleName", e.target.value)} editable type="name" width="100%" /></PartyField>
            <PartyField label="label.qde.field.lastName" required error={Boolean(err("lastName"))}><HTextField value={party.lastName || ""} onChange={(e) => field("lastName", e.target.value)} editable required type="name" width="100%" /></PartyField>
            <PartyField label="label.qde.field.gender" required><HDropdown name="gender" options={GENDERS} value={party.gender || ""} onChange={(e) => field("gender", e.target.value)} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.dob" required><HDatePicker value={toPickerValue(party.dob)} onChange={(value) => field("dob", fromPickerValue(value))} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.customerProfile"><HDropdown name="category" options={BORROWER_CATEGORIES} value={party.category || ""} onChange={(e) => field("category", e.target.value)} width="100%" /></PartyField>
          </>
        )}

        <PartyField label="label.qde.field.mobile" required error={Boolean(err("mobile"))}><HTextField value={party.mobile || ""} onChange={(e) => field("mobile", e.target.value)} editable required type="phone" length={10} width="100%" /></PartyField>
        <PartyField label="label.qde.field.email" required error={Boolean(err("email"))}><HTextField value={party.email || ""} onChange={(e) => field("email", e.target.value)} editable required type="email" width="100%" /></PartyField>
      </HBox>

      <HBox sx={{ width: "100%", mt: 3 }}>
        <KycCheckSection
          form={party}
          setField={setPartyField}
          isNonIndividual={isNonIndividual}
          verifying={partyVerifying}
          compact
          sectionKey={`party-${party.id}-kyc`}
          errors={errors}
          {...partyHandlers}
        />
      </HBox>

      <HBox sx={{ position: "relative", width: "100%" }}>
        <HBox
  sx={{
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <HCheckBox
    checked={Boolean(party.sameAsPrimaryAddress)}
    onChange={(event) => {
      const checked = event.target.checked;
      field("sameAsPrimaryAddress", checked);

      if (checked) {
        addressFields.forEach((name) =>
          field(name, primaryAddress[name] || "")
        );
      }
    }}
  />

  <HBox sx={{ whiteSpace: "nowrap" }}>
    <HLabel
      value="Same as Primary Applicant"
      align="left"
      colon={false}
    />
  </HBox>
</HBox>
        <AddressDetailsSection
          form={addressForm}
          setField={setPartyField}
          isNonIndividual={isNonIndividual}
          readOnly={Boolean(party.sameAsPrimaryAddress)}
          noAccordion
          errors={errors}
        />
      </HBox>
    </SectionBlock>
  );
};

export default PartyRow;
