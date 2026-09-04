import { HDropdown, HRadioGroup, HTextField, HBox } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import {
  APPLICATION_TYPES,
  BORROWER_TYPE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  PORTFOLIOS,
} from "../constants/qdeOptions";

const BusinessUnitSection = ({ form, setField }) => (
  <SectionBlock sectionKey="businessUnit" titleKey="label.qde.section.businessUnit">
    <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 2 }}>
      <FieldRow labelKey="label.qde.field.applicationType" required sx={{ width: "30%", flexShrink: 0 }} >
        <HDropdown
          name="applicationType"
          options={APPLICATION_TYPES}
          value={form.applicationType}
          onChange={(e) => setField("applicationType", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.portfolio" required sx={{ width: "30%", flexShrink: 0 }} >
        <HDropdown
          name="portfolio"
          options={PORTFOLIOS}
          value={form.portfolio}
          onChange={(e) => setField("portfolio", e.target.value)}
          required
          width="100%"
        />
      </FieldRow>
      <HBox sx={{ width: "40%", flexShrink: 0 }}>
        <HRadioGroup
          label="label.qde.field.borrowerType"
          name="borrowerType"
          options={BORROWER_TYPE_OPTIONS}
          value={form.borrowerType}
          onChange={(e) => setField("borrowerType", e.target.value)}
          orientation="horizontal"
          required
        />
      </HBox>
    </HBox>

    <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 2, }}>

      <HBox sx={{ width: "40%", flexShrink: 0 }}>
        <HRadioGroup
          label="label.qde.field.customerType"
          name="customerType"
          options={CUSTOMER_TYPE_OPTIONS}
          value={form.customerType}
          onChange={(e) => setField("customerType", e.target.value)}
          orientation="horizontal"
          required
        />
      </HBox>

      {form.customerType === "Existing" && (
  <HBox
    sx={{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 2,
    }}
  >
    {/* Customer ID */}
    <FieldRow
      labelKey="label.qde.field.customerId"
      required
      sx={{
        width: "25%",
        flexShrink: 0,
      }}
    >
      <HTextField
        value={form.customerId}
        onChange={(e) => setField("customerId", e.target.value)}
        editable
        required
        width="100%"
      />
    </FieldRow>

    {/* Second field / Search Records */}
    <FieldRow
      labelKey="label.qde.field.searchRecords"
      sx={{
        width: "25%",
        flexShrink: 0,
      }}
    >
      <HTextField
        value={form.customerId}
        onChange={(e) => setField("customerId", e.target.value)}
        editable
        required
        width="100%"
      />
    </FieldRow>
  </HBox>
)}  
    </HBox>
  </SectionBlock>
);

export default BusinessUnitSection;
