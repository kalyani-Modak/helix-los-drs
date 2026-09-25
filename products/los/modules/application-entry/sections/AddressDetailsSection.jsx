import { HDropdown, HTextField, HBox, HLabel, useToast } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { ADDRESS_TYPES_INDIVIDUAL, ADDRESS_TYPES_NON_INDIVIDUAL } from "../constants/qdeOptions";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const AddressDetailsSection = ({ form, setField, isNonIndividual, noAccordion, errors = {}, readOnly = false }) => {
  const addressTypes = isNonIndividual ? ADDRESS_TYPES_NON_INDIVIDUAL : ADDRESS_TYPES_INDIVIDUAL;
  const err = (name) => errors[name];
  const toast = useToast();

  const handlePincodeChange = (e) => {
  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

    setField("pincode", value);

    if (value === "560001") {
      setField("city", "Pune");
      setField("district", "Pune");
      setField("state", "Maharashtra");
      setField("country", "India");

      toast.success("PIN 560001 found. Location details populated.");
    } else if (value.length === 6) {
      setField("city", "");
      setField("district", "");
      setField("state", "");
      setField("country", "");

      toast.warning(
        `PIN ${value} not found in master. Please enter City / District / State manually.`
      );
    }
  };

  const cityOptions = [
    { label: "Mumbai", value: "Mumbai" },
    { label: "Pune", value: "Pune" },
    { label: "Nashik", value: "Nashik" },
    { label: "Nagpur", value: "Nagpur" },
  ];

  const districtOptions = [
    { label: "Mumbai Suburban", value: "Mumbai Suburban" },
    { label: "Pune", value: "Pune" },
    { label: "Thane", value: "Thane" },
    { label: "Nashik", value: "Nashik" },
  ];

  const stateOptions = [
    { label: "Maharashtra", value: "Maharashtra" },
    { label: "Gujarat", value: "Gujarat" },
    { label: "Karnataka", value: "Karnataka" },
    { label: "Delhi", value: "Delhi" },
  ];

  const countryOptions = [
    { label: "India", value: "India" },
    { label: "United States", value: "United States" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Australia", value: "Australia" },
  ];

  return (
    <SectionBlock sectionKey="address" titleKey="label.qde.section.address" subTitleKey="label.qde.section.address.subtitle" icon={<LocationOnOutlinedIcon fontSize="small" />} noAccordion={noAccordion} >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addressType" required align="left" colon={false} />
          <HDropdown
            name="addressType"
            options={addressTypes}
            value={form.addressType}
            onChange={(e) => setField("addressType", e.target.value)}
            disabled={readOnly}
            required
            error={Boolean(err("addressType"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr1" required align="left" colon={false} />
          <HTextField
            value={form.addr1}
            onChange={(e) => setField("addr1", e.target.value)}
            editable={!readOnly}
            disabled={readOnly}
            required
            error={Boolean(err("addr1"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr2" align="left" colon={false} />
          <HTextField
            value={form.addr2}
            onChange={(e) => setField("addr2", e.target.value)}
            editable={!readOnly}
            disabled={readOnly}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.addr3" align="left" colon={false} />
          <HTextField
            value={form.addr3}
            onChange={(e) => setField("addr3", e.target.value)}
            editable={!readOnly}
            disabled={readOnly}
            width="100%"
          />
        </HBox>

        {/* Landmark — mandatory only for Individual applicants, matching PartyRow's rule */}
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.landmark" required={!isNonIndividual} align="left" colon={false} />
          <HTextField
            value={form.landmark}
            onChange={(e) => setField("landmark", e.target.value)}
            editable={!readOnly}
            disabled={readOnly}
            required={!isNonIndividual}
            error={Boolean(err("landmark"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel
            value="label.qde.field.pincode"
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.pincode || ""}
            onChange={handlePincodeChange}
            editable={!readOnly}
            disabled={readOnly}
            required
            width="100%"
            placeholder="560001"
          />

          {form.pincode && form.pincode.length < 6 ? (
            <HLabel
              value="Postal code must be 6 digits"
              align="left"
              colon={false}
              sx={{ color: "error.main", mt: 1 }}
            />
          ) : (
            <HLabel
              value="Indian 6-digit PIN — auto-populates City, District, State, Country."
              align="left"
              colon={false}
              sx={{ mt: 1}}
            />
          )}
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.city" align="left" colon={false} sx={{ mt: 1 }} />
          <HDropdown
            name="city"
            options={cityOptions}
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            disabled={readOnly}
            width="100%"
            placeholder="Select city"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.district" align="left" colon={false} sx={{ mt: 1 }} />
          <HDropdown
            name="district"
            options={districtOptions}
            value={form.district}
            onChange={(e) => setField("district", e.target.value)}
            disabled={readOnly}
            width="100%"
            placeholder="Select district"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.state" align="left" colon={false} sx={{ mt: 1 }} />
          <HDropdown
            name="state"
            options={stateOptions}
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
            disabled={readOnly}
            width="100%"
            placeholder="Select state"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.country" align="left" colon={false} sx={{ mt: 1 }} />
          <HDropdown
            name="country"
            options={countryOptions}
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            disabled={readOnly}
            width="100%"
            placeholder="Select country"
          />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default AddressDetailsSection;