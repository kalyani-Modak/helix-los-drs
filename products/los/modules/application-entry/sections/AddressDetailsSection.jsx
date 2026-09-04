import React from "react";
import { HDropdown, HTextField } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import {
  ADDRESS_TYPES_INDIVIDUAL,
  ADDRESS_TYPES_NON_INDIVIDUAL,
} from "../constants/qdeOptions";

const AddressDetailsSection = ({ form, setField, isNonIndividual, onPincodeLookup }) => {
  const addressTypes = isNonIndividual ? ADDRESS_TYPES_NON_INDIVIDUAL : ADDRESS_TYPES_INDIVIDUAL;

  const handlePincodeChange = (e) => {
    const next = e.target.value;
    setField("pincode", next);
    if (next.length === 6) onPincodeLookup?.(next);
  };

  return (
    <SectionBlock sectionKey="address" titleKey="label.qde.section.address">
      <FieldRow labelKey="label.qde.field.addressType" required>
        <HDropdown
          name="addressType"
          options={addressTypes}
          value={form.addressType}
          onChange={(e) => setField("addressType", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.addr1" required>
        <HTextField
          value={form.addr1}
          onChange={(e) => setField("addr1", e.target.value)}
          editable
          required
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.addr2">
        <HTextField
          value={form.addr2}
          onChange={(e) => setField("addr2", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.addr3">
        <HTextField
          value={form.addr3}
          onChange={(e) => setField("addr3", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.landmark">
        <HTextField
          value={form.landmark}
          onChange={(e) => setField("landmark", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.pincode" required>
        <HTextField
          value={form.pincode}
          onChange={handlePincodeChange}
          onBlur={() => form.pincode && onPincodeLookup?.(form.pincode)}
          editable
          required
          type="number"
          length={6}
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.city">
        <HTextField
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.district">
        <HTextField
          value={form.district}
          onChange={(e) => setField("district", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.state">
        <HTextField
          value={form.state}
          onChange={(e) => setField("state", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.country">
        <HTextField
          value={form.country}
          onChange={(e) => setField("country", e.target.value)}
          editable
          width="100%"
        />
      </FieldRow>
    </SectionBlock>
  );
};

export default AddressDetailsSection;
