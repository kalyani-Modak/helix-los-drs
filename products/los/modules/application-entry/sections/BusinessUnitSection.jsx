import { HDropdown, HTextField, HBox, HLabel, HRadio } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { APPLICATION_TYPES, PORTFOLIOS } from "../constants/qdeOptions";
import { useIntl } from "react-intl";

const BusinessUnitSection = ({ form, setField }) => {
  const intl = useIntl();

  return (
    <SectionBlock sectionKey="businessUnit" titleKey="label.qde.section.businessUnit" >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 0.5 }}>
        {/* Application Type */}
        <HBox
          sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.applicationType",
              defaultMessage: "Application Type"
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="applicationType"
            options={APPLICATION_TYPES}
            value={form.applicationType || ""}
            onChange={(e) =>
              setField("applicationType", e.target.value)
            }
            required
            width="100%"
          />
        </HBox>

        {/* Portfolio */}
        <HBox
          sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.portfolio",
              defaultMessage: "Portfolio"
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="portfolio"
            options={PORTFOLIOS}
            value={form.portfolio || ""}
            onChange={(e) =>
              setField("portfolio", e.target.value)
            }
            required
            width="100%"
          />
        </HBox>

        {/* Borrower Type */}
        <HBox sx={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <HLabel sx={{ ml: 2 }}
            value={intl.formatMessage({
              id: "label.qde.field.borrowerType",
              defaultMessage: "Borrower Type"
            })}
            required
            align="left"
            colon={false}
          />

          <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
            <HRadio
              label="Individual"
              checked={form.borrowerType === "Individual"}
              onChange={() => setField("borrowerType", "Individual")}
            />

            <HRadio
              label="Non-Individual"
              checked={form.borrowerType === "Non-Individual"}
              onChange={() => setField("borrowerType", "Non-Individual")}
            />
          </HBox>
        </HBox>
      </HBox>

      {/* Customer Type / Existing Customer Fields */}
      <HBox
        sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
        {/* Customer Type */}
        <HBox
          sx={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.customerType",
              defaultMessage: "Customer Type"
            })}
            required
          />

          <HRadio
            label="New"
            checked={form.customerType === "New"}
            onChange={() =>
              setField("customerType", "New")
            }
          />

          <HRadio
            label="Existing"
            checked={form.customerType === "Existing"}
            onChange={() =>
              setField("customerType", "Existing")
            }
          />
        </HBox>

        {form.customerType === "Existing" && (
          <HBox
            sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
            {/* Customer ID */}
            <HBox
              sx={{ width: "25%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.customerId",
                  defaultMessage: "Customer ID"
                })}
                required
                align="left"
                colon={false}
              />

              <HTextField
                value={form.customerId || ""}
                onChange={(e) =>
                  setField("customerId", e.target.value)
                }
                editable
                required
                width="100%"
              />
            </HBox>

            {/* Search Records */}
            <HBox
              sx={{ width: "25%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.searchRecords",
                  defaultMessage: "Search Records"
                })}
                align="left"
                colon={false}
              />

              <HTextField
                value={form.customerId}
                onChange={(e) =>
                  setField("customerId", e.target.value)
                }
                editable
                required
                width="100%"
              />
            </HBox>
          </HBox>
        )}
      </HBox>
    </SectionBlock>
  );
};

export default BusinessUnitSection;
