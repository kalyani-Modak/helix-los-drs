import { HDropdown, HTextField, HBox, HLabel } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { ADDRESS_TYPES_INDIVIDUAL, ADDRESS_TYPES_NON_INDIVIDUAL } from "../constants/qdeOptions";

const AddressDetailsSection = ({ form, setField, isNonIndividual, onPincodeLookup, noAccordion }) => {
  const addressTypes = isNonIndividual ? ADDRESS_TYPES_NON_INDIVIDUAL : ADDRESS_TYPES_INDIVIDUAL;

  const handlePincodeChange = (e) => {
    const next = e.target.value;
    setField("pincode", next);
    if (next.length === 6) onPincodeLookup?.(next);
  };

  return (
    <SectionBlock sectionKey="address" titleKey="label.qde.section.address" noAccordion={noAccordion} >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addressType" required align="left" colon={false} />
          <HDropdown
            name="addressType"
            options={addressTypes}
            value={form.addressType}
            onChange={(e) => setField("addressType", e.target.value)}
            required
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr1" required align="left" colon={false} />
          <HTextField
            value={form.addr1}
            onChange={(e) => setField("addr1", e.target.value)}
            editable
            required
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr2" align="left" colon={false} />
          <HTextField
            value={form.addr2}
            onChange={(e) => setField("addr2", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr3" align="left" colon={false} />
          <HTextField
            value={form.addr3}
            onChange={(e) => setField("addr3", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.landmark" align="left" colon={false} />
          <HTextField
            value={form.landmark}
            onChange={(e) => setField("landmark", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.pincode" required align="left" colon={false} />
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
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.city" align="left" colon={false} sx={{ mt: 1 }} />
          <HTextField
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.district" align="left" colon={false} sx={{ mt: 1 }} />
          <HTextField
            value={form.district}
            onChange={(e) => setField("district", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.state" align="left" colon={false} sx={{ mt: 1 }} />
          <HTextField
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            editable
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.country" align="left" colon={false} sx={{ mt: 1 }} />
          <HTextField
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            editable
            width="100%"
          />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default AddressDetailsSection;