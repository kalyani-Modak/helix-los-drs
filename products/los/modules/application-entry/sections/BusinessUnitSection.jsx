import { HDropdown, HTextField, HBox, HLabel, HRadio, HButton } from "@helix/component-library";
import { IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import SectionBlock from "../components/SectionBlock";
import { APPLICATION_TYPES, PORTFOLIOS } from "../constants/qdeOptions";
import { useIntl } from "react-intl";

const BusinessUnitSection = ({ form, setField, errors = {}, onOpenApplicationSearch, onClearApplicationNo }) => {
  const intl = useIntl();
  const err = (name) => errors[name];

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
            error={Boolean(err("applicationType"))}
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
            error={Boolean(err("portfolio"))}
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
          <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 2 }}>
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
                error={Boolean(err("customerId"))}
                width="100%"
              />
            </HBox>

            {/* Search Records — pop search that opens the "Search Existing Applications" dialog */}
            <HBox sx={{ width: "25%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.searchRecords",
                  defaultMessage: "Search Records"
                })}
                align="left"
                colon={false}
              />

              <HBox sx={{ position: "relative", display: "flex", alignItems: "center", width: "100%", minWidth: 0 }}>
                <HTextField
                  value={form.applicationNo || ""}
                  editable={false}
                  placeholder={intl.formatMessage({
                    id: "label.qde.placeholder.searchRecords",
                    defaultMessage: "Open search popup...",
                  })}
                  width="100%"
                />

                <IconButton
                  aria-label={intl.formatMessage({
                    id: "label.qde.button.search",
                    defaultMessage: "Search",
                  })}
                  title={intl.formatMessage({
                    id: "label.qde.button.search",
                    defaultMessage: "Search",
                  })}
                  onClick={() => onOpenApplicationSearch?.()}
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "primary.main",
                    backgroundColor: "background.paper",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </HBox>
            </HBox>
            <HBox sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 2.3 }}>
              <HButton label="label.qde.button.clear" variant="text" size="small" inline align="right" onClick={() => onClearApplicationNo?.()} />
            </HBox>
          </HBox>
        )}
      </HBox>
    </SectionBlock>
  );
};

export default BusinessUnitSection;