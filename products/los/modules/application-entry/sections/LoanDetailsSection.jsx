import { ALIGNMENT, HDropdown, HTextField, HBox, HLabel } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { LOAN_TYPES, PRODUCTS, SCHEMES } from "../constants/qdeOptions";

const LoanDetailsSection = ({ form, setField }) => (
  <SectionBlock sectionKey="loan" titleKey="label.qde.section.loan" >
    <HBox
      sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2 }} >
      {/* Loan Type */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
        <HLabel
          value="label.qde.field.loanType"
          required
          align="left"
          colon={false}
        />

        <HDropdown
          name="loanType"
          options={LOAN_TYPES}
          value={form.loanType}
          onChange={(e) => setField("loanType", e.target.value)}
          required
          width="100%"
        />
      </HBox>

      {/* Product */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
        <HLabel
          value="label.qde.field.product"
          required
          align="left"
          colon={false}
        />

        <HDropdown
          name="product"
          options={PRODUCTS}
          value={form.product}
          onChange={(e) => setField("product", e.target.value)}
          required
          width="100%"
        />
      </HBox>

      {/* Scheme */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
        <HLabel
          value="label.qde.field.scheme"
          align="left"
          colon={false}
        />

        <HDropdown
          name="scheme"
          options={SCHEMES}
          value={form.scheme}
          onChange={(e) => setField("scheme", e.target.value)}
          width="100%"
        />
      </HBox>

      {/* Loan Amount */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
        <HLabel
          value="label.qde.field.loanAmount"
          required
          align="left"
          colon={false}
        />

        <HTextField
          value={form.loanAmount}
          onChange={(e) => setField("loanAmount", e.target.value)}
          editable
          required
          type="currency"
          align={ALIGNMENT.NUMBER}
          width="100%"
        />
      </HBox>

      {/* Tenure */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel
          value="label.qde.field.tenure"
          required
          align="left"
          colon={false}
        />

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
      </HBox>

      {/* Rate */}
      <HBox
        sx={{
          width: {
            xs: "100%",
            sm: "calc(50% - 8px)",
            md: "calc(33.333% - 10.67px)",
          }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }} >
        <HLabel
          value="label.qde.field.rate"
          align="left"
          colon={false}
        />

        <HTextField
          value={form.rate}
          onChange={(e) => setField("rate", e.target.value)}
          editable
          type="number"
          length={5}
          align={ALIGNMENT.NUMBER}
          width="100%"
        />
      </HBox>
    </HBox>
  </SectionBlock>
);

export default LoanDetailsSection;
