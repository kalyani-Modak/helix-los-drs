import { useEffect } from "react";
import {
  HDropdown,
  HTextField,
  HBox,
  HLabel,
  HCheckBox,
  useToast,
} from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";


const ADDRESS_FIELDS = [
  "addr1",
  "addr2",
  "city",
  "district",
  "state",
  "pincode",
  "country",
];

const fieldBoxSx = {
  width: "33.333%",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
  boxSizing: "border-box",
  paddingRight: "14px",
  marginBottom: "10px",
};

const rowSx = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: "12px 16px 8px 16px",
  boxSizing: "border-box",
};

/* ---------- One address block (used for Current & Permanent).
   Defined at module level so it is not re-created on every render
   (which would make inputs lose focus while typing). ---------- */
const AddressFields = ({
  prefix,
  address,
  setAddressField,
  errors,
  disabled,
  onPincodeChange,
  lookups,
}) => {
  const err = (field) => errors[`${prefix}.${field}`];
  const pincode = address.pincode || "";

  return (
    <>
      {/* Address Line 1 */}
      <HBox sx={fieldBoxSx}>
        <HLabel value="Address Line 1" required align="left" colon={false} />
        <HTextField
          value={address.addr1 || ""}
          onChange={(e) => setAddressField("addr1", e.target.value)}
          editable={!disabled}
          disabled={disabled}
          required
          error={Boolean(err("addr1"))}
          width="100%"
        />
      </HBox>

      {/* Address Line 2 */}
      <HBox sx={fieldBoxSx}>
        <HLabel value="Address Line 2" align="left" colon={false} />
        <HTextField
          value={address.addr2 || ""}
          onChange={(e) => setAddressField("addr2", e.target.value)}
          editable={!disabled}
          disabled={disabled}
          error={Boolean(err("addr2"))}
          width="100%"
        />
      </HBox>

      {/* City */}
      <HBox sx={fieldBoxSx}>
        <HLabel
          value="City"
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name={`${prefix}-city`}
          options={[]}
          value={address.city || ""}
          onChange={(e) => setAddressField("city", e.target.value)}
          disabled={disabled}
          required
          error={Boolean(err("city"))}
          width="100%"
          placeholder="Select city"
        />
      </HBox>

      {/* District */}
      <HBox sx={fieldBoxSx}>
        <HLabel
          value="District"
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name={`${prefix}-district`}
          options={lookups["party.address.district"] || []}
          value={address.district || ""}
          onChange={(e) => setAddressField("district", e.target.value)}
          disabled={disabled}
          required
          error={Boolean(err("district"))}
          width="100%"
          placeholder="Select district"
        />
      </HBox>

      {/* State */}
      <HBox sx={fieldBoxSx}>
        <HLabel
          value="State"
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name={`${prefix}-state`}
          options={lookups["party.address.state"] || []}
          value={address.state || ""}
          onChange={(e) => setAddressField("state", e.target.value)}
          disabled={disabled}
          required
          error={Boolean(err("state"))}
          width="100%"
          placeholder="Select state"
        />
      </HBox>
       {/* Postal Code */}
      <HBox sx={fieldBoxSx}>
        <HLabel value="Postal Code" required align="left" colon={false} />
        <HTextField
          value={pincode}
          onChange={onPincodeChange}
          editable={!disabled}
          disabled={disabled}
          required
          error={Boolean(err("pincode"))}
          width="100%"
          placeholder="560001"
        />
      </HBox>

      {/* Country */}
      <HBox sx={fieldBoxSx}>
        <HLabel
          value="Country"
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name={`${prefix}-country`}
          options={[]}
          value={address.country || ""}
          onChange={(e) => setAddressField("country", e.target.value)}
          disabled={disabled}
          required
          error={Boolean(err("country"))}
          width="100%"
          placeholder="Select country"
        />
      </HBox>
    </>
  );
};

/* ---------- Main component ---------- */
const DdeAddressDetailsSection = ({
  form,
  setField,
  errors = {},
  readOnly = false,
  lookups = {},
}) => {
  const toast = useToast();
  const currentAddress = form?.currentAddress || {};
  const permanentAddress = form?.permanentAddress || {};
  const sameAsCurrent = Boolean(permanentAddress.sameAsCurrent);

  const setCurrentAddressField = (field, value) =>
    setField(`currentAddress.${field}`, value);

  const setPermanentAddressField = (field, value) =>
    setField(`permanentAddress.${field}`, value);

  /* PIN handler factory – same behaviour as AddressDetailsSection */
  const makePincodeHandler = (setAddressField) => (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setAddressField("pincode", value);

    if (value.length === 6) {
      setAddressField("city", "");
      setAddressField("district", "");
      setAddressField("state", "");
      setAddressField("country", "");
      toast.warning(
        `No location lookup is available for PIN ${value}.`,
      );
    }
  };

  /* HCheckBox – tolerate either an event or a boolean being passed */
  const handleSameAddressChange = (e) => {
    const checked = typeof e === "boolean" ? e : e?.target?.checked;
    setField("permanentAddress.sameAsCurrent", Boolean(checked));

    if (checked) {
      ADDRESS_FIELDS.forEach((f) =>
        setPermanentAddressField(f, currentAddress[f] || ""),
      );
    }
  };

  /* Keep permanent address in sync while "same as current" is ticked */
  useEffect(() => {
    if (!sameAsCurrent) return;
    ADDRESS_FIELDS.forEach((f) => {
      const src = currentAddress[f] || "";
      if ((permanentAddress[f] || "") !== src) {
        setPermanentAddressField(f, src);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sameAsCurrent,
    currentAddress.addr1,
    currentAddress.addr2,
    currentAddress.city,
    currentAddress.district,
    currentAddress.state,
    currentAddress.pincode,
    currentAddress.country,
  ]);

  return (
    <>
      {/* ================= CURRENT ADDRESS ================= */}
      <SectionBlock
        sectionKey="currentAddress"
        titleKey="Current Address"
        icon={<LocationOnOutlinedIcon fontSize="small" />}
        noAccordion={false}
      >
        <HBox sx={rowSx}>
          <AddressFields
            prefix="currentAddress"
            address={currentAddress}
            setAddressField={setCurrentAddressField}
            errors={errors}
            disabled={readOnly}
            onPincodeChange={makePincodeHandler(setCurrentAddressField)}
            lookups={lookups}
          />
        </HBox>
      </SectionBlock>

      {/* ================= PERMANENT ADDRESS ================= */}
      <SectionBlock
        sectionKey="permanentAddress"
        titleKey="Permanent Address"
        icon={<LocationOnOutlinedIcon fontSize="small" />}
        noAccordion={false}
      >
        <HBox sx={rowSx}>
          <HBox
            sx={{
              ...fieldBoxSx,
              flexDirection: "row",
              alignItems: "center",
              minHeight: "58px",
            }}
          >
            <HCheckBox
              label="Permanent address same as current address"
              checked={sameAsCurrent}
              onChange={handleSameAddressChange}
              disabled={readOnly}
            />
          </HBox>

          <AddressFields
            prefix="permanentAddress"
            address={permanentAddress}
            setAddressField={setPermanentAddressField}
            errors={errors}
            disabled={readOnly || sameAsCurrent}
            onPincodeChange={makePincodeHandler(setPermanentAddressField)}
            lookups={lookups}
          />
        </HBox>
      </SectionBlock>
    </>
  );
};

export default DdeAddressDetailsSection;
