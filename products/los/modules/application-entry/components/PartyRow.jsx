import { useState } from "react";
import { HButton, HLabel, HTextField, HBox, HDropdown, HDatePicker } from "@helix/component-library";
import AddressDetailsSection from "../sections/AddressDetailsSection";
import AuthSignatoryKycSection from "../sections/AuthSignatoryKycSection";
import { BORROWER_CATEGORIES, ENTITY_TYPES, GENDERS, Profiles } from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import { useIntl } from "react-intl";
import SectionBlock from "../components/SectionBlock";

const PartyRow = ({ party, index, titleKey, onChange, onRemove }) => {
  const [form, setField] = useState({});
  const isNonIndividual = true;
  const intl = useIntl();

  return (
    <SectionBlock sectionKey="" titleKey="" noAccordion= "true">
      <HBox sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: 1, mb: 1 }}>
      <HLabel value={`${titleKey} ${index + 1}`} translate={false} align="left" colon={false} />
      <HButton
        label="label.qde.button.remove"
        variant="text"
        size="small"
        inline
        onClick={() => onRemove(party.id)}
      />
    </HBox>
    <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.firstName",
            defaultMessage: "First Name"
          })}
          required
          align="left"
          colon={false}
        />
        <HTextField
          value={form.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
          editable
          required
          type="name"
          width="100%"
        />
      </HBox>

      {/* Middle Name */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.middleName",
            defaultMessage: "Middle Name"
          })}
          align="left"
          colon={false}
        />
        <HTextField
          value={form.middleName}
          onChange={(e) => setField("middleName", e.target.value)}
          editable
          type="name"
          width="100%"
        />
      </HBox>

      {/* Last Name */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.lastName",
            defaultMessage: "Last Name"
          })}
          required
          align="left"
          colon={false}
        />
        <HTextField
          value={form.lastName}
          onChange={(e) => setField("lastName", e.target.value)}
          editable
          required
          type="name"
          width="100%"
        />
      </HBox>

      {/* Gender */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.gender",
            defaultMessage: "Gender"
          })}
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name="gender"
          options={GENDERS}
          value={form.gender}
          onChange={(e) => setField("gender", e.target.value)}
          required
          width="100%"
        />
      </HBox>

      {/* Date of Birth */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.dob",
            defaultMessage: "Date of Birth"
          })}
          required
          align="left"
          colon={false}
        />
        <HDatePicker
          value={toPickerValue(form.dob)}
          onChange={(value) => setField("dob", fromPickerValue(value))}
          required
          width="100%"
        />
      </HBox>

      {/* Customer Profile */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.custProfile",
            defaultMessage: "Customer Profile"
          })}
          required
          align="left"
          colon={false}
        />
        <HDropdown
          name="custProfile"
          options={Profiles}
          value={form.custProfile}
          onChange={(e) => setField("custProfile", e.target.value)}
          required
          width="100%"
        />
      </HBox>

      {/* Mobile Number */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 3 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.mobile",
            defaultMessage: "Mobile Number"
          })}
          required
          align="left"
          colon={false}
        />
        <HTextField
          value={form.mobile}
          onChange={(e) => setField("mobile", e.target.value)}
          editable
          required
          type="phone"
          length={10}
          width="100%"
        />
      </HBox>

      {/* Email */}
      <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.qde.field.email",
            defaultMessage: "Email"
          })}
          required
          align="left"
          colon={false}
        />
        <HTextField
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          editable
          required
          type="email"
          width="100%"
        />
      </HBox>

      {isNonIndividual ? (
        <>
          <AuthSignatoryKycSection
            form={form}
            setField={setField}
            verifying={true}
            onVerifyAsPan={true}
            onSendAsAadhaarOtp={true}
            onValidateAsAadhaarOtp={true}
            onCheckAsPanAadhaarLink={true}
            // verifying={verifying}
            // onVerifyAsPan={handleVerifyAsPan}
            // onSendAsAadhaarOtp={handleSendAsAadhaarOtp}
            // onValidateAsAadhaarOtp={handleValidateAsAadhaarOtp}
            // onCheckAsPanAadhaarLink={handleCheckAsPanAadhaarLink}
            noAccordion={true}
          />
        </>
      ) : null}

      <AddressDetailsSection
        form={form}
        setField={""}
        isNonIndividual={isNonIndividual}
        onPincodeLookup={""}
        noAccordion={true}
      />
    </HBox>
    </SectionBlock>
  )
};

export default PartyRow;