import React from "react";
import { ALIGNMENT, HDropdown, HTextField } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import { LOAN_TYPES, PRODUCTS, SCHEMES } from "../constants/qdeOptions";

const LoanDetailsSection = ({ form, setField }) => (
  <SectionBlock sectionKey="loan" titleKey="label.qde.section.loan">
    <FieldRow labelKey="label.qde.field.loanType" required>
      <HDropdown
        name="loanType"
        options={LOAN_TYPES}
        value={form.loanType}
        onChange={(e) => setField("loanType", e.target.value)}
        required
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.product" required>
      <HDropdown
        name="product"
        options={PRODUCTS}
        value={form.product}
        onChange={(e) => setField("product", e.target.value)}
        required
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.scheme">
      <HDropdown
        name="scheme"
        options={SCHEMES}
        value={form.scheme}
        onChange={(e) => setField("scheme", e.target.value)}
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.loanAmount" required>
      <HTextField
        value={form.loanAmount}
        onChange={(e) => setField("loanAmount", e.target.value)}
        editable
        required
        type="currency"
        align={ALIGNMENT.NUMBER}
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.tenure" required>
      <HTextField
        value={form.tenure}
        onChange={(e) => setField("tenure", e.target.value)}
        editable
        required
        type="number"
        length={3}
        align={ALIGNMENT.NUMBER}
        width="100%"
      />
    </FieldRow>

    <FieldRow labelKey="label.qde.field.rate">
      <HTextField
        value={form.rate}
        onChange={(e) => setField("rate", e.target.value)}
        editable
        type="number"
        length={5}
        align={ALIGNMENT.NUMBER}
        width="100%"
      />
    </FieldRow>
  </SectionBlock>
);

export default LoanDetailsSection;
