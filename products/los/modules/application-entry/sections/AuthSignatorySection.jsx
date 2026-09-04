import { HButton, HDatePicker, HLabel, HTextField,HBox } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import { fromPickerValue, toPickerValue } from "../dateHelpers";

/** Rendered only for non-individual borrowers. */
const AuthSignatorySection = ({
  form,
  setField,
  onVerifyAsMobile,
  onVerifyAsEmail,
  verifyingMobile = false,
}) => (
  <SectionBlock sectionKey="authSignatory" titleKey="label.qde.section.authSignatory">
    <FieldRow labelKey="label.qde.field.firstName" required>
      <HTextField
        value={form.asFirstName}
        onChange={(e) => setField("asFirstName", e.target.value)}
        editable
        required
        type="name"
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.middleName">
      <HTextField
        value={form.asMiddleName}
        onChange={(e) => setField("asMiddleName", e.target.value)}
        editable
        type="name"
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.lastName" required>
      <HTextField
        value={form.asLastName}
        onChange={(e) => setField("asLastName", e.target.value)}
        editable
        required
        type="name"
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.dob">
      <HDatePicker
        value={toPickerValue(form.asDob)}
        onChange={(value) => setField("asDob", fromPickerValue(value))}
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.designation" required>
      <HTextField
        value={form.asDesignation}
        onChange={(e) => setField("asDesignation", e.target.value)}
        editable
        required
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.mobile" required>
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <HTextField
            value={form.asMobile}
            onChange={(e) => setField("asMobile", e.target.value)}
            editable
            required
            type="phone"
            length={10}
            width="160px"
          />
          <HButton
            label="label.qde.button.verify"
            variant="outlined"
            size="small"
            inline
            loading={verifyingMobile}
            disabled={!form.asMobile}
            onClick={onVerifyAsMobile}
          />
        </HBox>
        <HLabel
          value={form.asMobileVerified ? "label.qde.status.verified" : "label.qde.status.pending"}
          align="left"
          colon={false}
        />
      </HBox>
    </FieldRow>

    <FieldRow labelKey="label.qde.field.email">
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <HTextField
            value={form.asEmail}
            onChange={(e) => setField("asEmail", e.target.value)}
            editable
            width="200px"
          />
          <HButton
            label="label.qde.button.verify"
            variant="outlined"
            size="small"
            inline
            disabled={!form.asEmail}
            onClick={onVerifyAsEmail}
          />
        </HBox>
        <HLabel
          value={form.asEmailVerified ? "label.qde.status.verified" : "label.qde.status.pending"}
          align="left"
          colon={false}
        />
      </HBox>
    </FieldRow>
  </SectionBlock>
);

export default AuthSignatorySection;
