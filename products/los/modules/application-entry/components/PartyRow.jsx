import { cloneElement, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useIntl } from "react-intl";
import { HButton, HCheckBox, HDatePicker, HDropdown, HLabel, HTextField, HBox, useDrsTheme, HRadio } from "@helix/component-library";
import { BORROWER_CATEGORIES, ENTITY_TYPES, GENDERS, RELATIONSHIPS } from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import AddressDetailsSection from "../sections/AddressDetailsSection";
import KycCheckSection from "../sections/KycCheckSection";
import SectionBlock from "./SectionBlock";
import FieldError from "./FieldError";
import VerifyLink from "./VerifyLink";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchApplicationDialog from "./SearchApplicationDialog";

const PartyField = ({ label, children, required = false, error, errorSx, sx }) => (
  <HBox sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.5, ...sx }}>
    <HLabel sx={{color: "text.primary" }} value={label} required={required} align="left" colon={false} />
    {children && typeof children === "object" && !Array.isArray(children)
      ? cloneElement(children, { error: Boolean(error) })
      : children}
    <FieldError message={error} sx={errorSx} />
  </HBox>
);

const PartyRow = ({
  party,
  index,
  titleKey,
  onChange,
  onRemove,
  errors = {},
  primaryBorrowerType,
  primaryAddress = {},
  kycHandlers = {},
  onSearchCustomer,
  lookups = {},
}) => {
  const { colors, text, surfaces, border, action } = useDrsTheme();
  const [applicationSearchOpen, setApplicationSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const relationshipOptions = lookups["los.relationship"] || RELATIONSHIPS;
  const genderOptions = lookups["party.gender"] || GENDERS;
  const entityTypeOptions = lookups["los.entitytype"] || ENTITY_TYPES;
  const borrowerCategoryOptions = lookups["los.borrowercategory"] || BORROWER_CATEGORIES;
  const [expanded, setExpanded] = useState(true);
  const isNonIndividual = party.borrowerType === "Non-Individual";
  const individualOnly = primaryBorrowerType === "Individual";
  const partyName = isNonIndividual ? party.entityName : party.firstName;
  const displayName = partyName || "(unnamed)";
  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value || "");
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
  const field = (name, value) => onChange(party.id, name, value);
  const err = (name) => errors[name];
  const intl = useIntl();
  const addressFields = ["addressType", "addr1", "addr2", "addr3", "landmark", "pincode", "city", "district", "state", "country"];
  const addressForm = party.sameAsPrimaryAddress ? primaryAddress : party;

  useEffect(() => {
    if (!party.sameAsPrimaryAddress) return;
    addressFields.forEach((name) => {
      const value = primaryAddress[name] || "";
      if ((party[name] || "") !== value) field(name, value);
    });
  }, [party, primaryAddress]);

  const setPartyField = (name, value) => field(name, value);
  const partyHandlers = Object.fromEntries(
    Object.entries(kycHandlers).filter(([name]) => name.startsWith("on"))
      .map(([name, handler]) => [name, () => handler(party)])
  );
  const partyVerifying = Object.fromEntries(
    Object.entries(kycHandlers).filter(([name]) => name.startsWith("verifying"))
      .map(([name, getter]) => {
        const key = name.replace("verifying", "");
        return [key.charAt(0).toLowerCase() + key.slice(1), getter(party)];
      })
  );
  const partyAadhaarOtpTimer = kycHandlers.aadhaarOtpTimer?.(party) || 0;
  const verifyContact = (name, value, valid) => {
    if (!valid(value)) return;
    field(name, true);
    if (kycHandlers[`onVerify${name === "mobileVerified" ? "Mobile" : "Email"}`]) {
      kycHandlers[`onVerify${name === "mobileVerified" ? "Mobile" : "Email"}`](party);
    }
  };

  const clearParty = () => {
    Object.entries(party).forEach(([name, value]) => {
      if (name === "id" || name === "customerType") return;

      const clearedValue = typeof value === "boolean"
        ? false
        : Array.isArray(value)
          ? []
          : "";

      field(name, clearedValue);
    });
  };

  const searchExistingParty = async (criteria) => {
    setSearchLoading(true);
    try {
      const found = await onSearchCustomer?.(party, criteria);
      if (found) setApplicationSearchOpen(false);
      return found;
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <SectionBlock sectionKey={`party-${party.id}`} titleKey="" noAccordion sx={{ width: "100%" }} >
      <HBox sx={{
        display: "flex",
        alignItems: "center",
        width: "calc(100% + 32px)",
        mx: -2,
        px: 2,
        mb: expanded ? 1 : 0,
        pb: 1,
        boxSizing: "border-box",
        borderBottom: `1px solid ${border.control}`,
      }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
          <HButton
            label=""
            variant="text"
            size="small"
            inline
            startIcon={
              expanded ? (
                <ExpandMoreIcon fontSize="small" />
              ) : (
                <ChevronRightIcon fontSize="small" />
              )
            }
            onClick={() => setExpanded((value) => !value)}
            sx={{ width: "auto", minWidth: "auto", px: 0, flexShrink: 0 }}
          />

          <HLabel sx={{color: "text.primary" }}
            value={`${titleKey} ${index + 1}`}
            translate={false}
            align="left"
            colon={false}
          />

          <HLabel
            value={displayName}
            translate={false}
            align="left"
            colon={false}
            sx={{ fontWeight: 600, color: "text.primary"  }}
          />

          <HLabel
            value="·"
            translate={false}
            align="left"
            colon={false}
          />

          <HLabel
            value={party.borrowerType}
            translate={false}
            align="left"
            colon={false}
          />
        </HBox>

        <HBox sx={{ marginLeft: "auto" }}>
          <HButton
            label="label.qde.button.remove"
            variant="text"
            size="small"
            inline
            onClick={() => onRemove(party.id)}
            startIcon={
              <DeleteOutlineOutlinedIcon fontSize="small" color="error" />
            }
          />
        </HBox>
      </HBox>

      {expanded && <>
      <HBox sx={{ width: "100%", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.5, alignItems: "start", "@media (max-width: 700px)": { gridTemplateColumns: "1fr" } }}>
        <PartyField label="label.qde.field.relationship" required>
          <HDropdown name="relationship" options={relationshipOptions} value={party.relationship || ""} onChange={(e) => field("relationship", e.target.value)} required width="100%" />
        </PartyField>
        <PartyField label="label.qde.field.borrowerType" required>
          {individualOnly ? (
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 32, whiteSpace: "nowrap" }}>
              <HBox sx={{ px: 1, py: 0.25, borderRadius: "6px", backgroundColor: surfaces?.accent || action?.hover, color: colors.primary, fontWeight: 400, fontSize: "13px", whiteSpace: "nowrap", }}>
                Individual
              </HBox>
              <HLabel
                value="Must be Individual when the primary applicant is Individual."
                translate={false}
                align="left"
                colon={false}
                sx={{ color: text.secondary, fontSize: "10px" }}
              />
            </HBox>
          ) : (
            <HBox sx={{ display: "flex", gap: 0, minHeight: 32, width: "fit-content", backgroundColor: surfaces?.accent || action?.hover, borderRadius: "6px", overflow: "hidden", border: `1px solid ${border.control}`, }}>
              <HBox sx={{ px: 1, py: 0.25, alignItems: "center", display: "flex", backgroundColor: !isNonIndividual ? surfaces?.panel : "transparent", color: !isNonIndividual ? colors.primary : text.secondary, fontWeight: 400, fontSize: "13px", whiteSpace: "nowrap", cursor: "pointer", }}
                onClick={() => field("borrowerType", "Individual")}
              >
                Individual
              </HBox>
              <HBox
                sx={{
                  px: 1,
                  py: 0.25,
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: isNonIndividual ? surfaces?.panel : "transparent",
                  color: isNonIndividual ? colors.primary : text.secondary,
                  fontWeight: 400,
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
                onClick={() => field("borrowerType", "Non-Individual")}
              >
                Non-Individual
              </HBox>
            </HBox>
          )}
        </PartyField>
        <HBox sx={{ gridColumn: "1 / -1", width: "100%", minWidth: 0, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr) auto", gap: 1.5, alignItems: "end", "@media (max-width: 700px)": { gridTemplateColumns: "1fr", alignItems: "stretch" } }}>
          <PartyField label="label.qde.field.customerType" required>
            <HBox sx={{ display: "flex", gap: 2, minHeight: 40, alignItems: "center" }}>
              <HRadio label="New" checked={party.customerType === "New"} onChange={() => field("customerType", "New")} />
              <HRadio label="Existing" checked={party.customerType === "Existing"} onChange={() => field("customerType", "Existing")} />
            </HBox>
          </PartyField>

        {party.customerType === "Existing" && (
          <>
            {/* Customer ID with search + clear, as on the primary applicant */}
            <PartyField label="label.qde.field.customerId" required error={err("customerId")} sx={{ gridColumn: "2" }}>
              <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                <HTextField
                  value={party.customerId || ""}
                  onChange={(e) => field("customerId", e.target.value)}
                  editable
                  required
                  error={Boolean(err("customerId"))}
                  placeholder="CUST-XXXXXX"
                  width="100%"
                />
                {/* <HButton label="label.qde.button.search" variant="outlined" size="small" inline sx={{mt:1}} onClick={() => setCustomerSearchOpen(true)} />
                <HButton label="label.qde.button.clear" variant="outlined" size="small" inline sx={{mt:1}} onClick={clearParty} /> */}
              </HBox>
            </PartyField>

              <PartyField label="label.qde.field.searchRecords" sx={{ minWidth: 0 }}>
                <HBox sx={{ position: "relative", display: "flex", alignItems: "center", width: "50%", minWidth: 0,gap: 1.5,}}>
                <HTextField
                  value={party.customerSearch || ""}
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
                  onClick={() => setApplicationSearchOpen(true)}
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
              </PartyField>
              <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5, "@media (max-width: 700px)": { justifyContent: "flex-start", pb: 0 } }}>
                <HButton label="label.qde.button.clear" variant="text" size="small" inline onClick={clearParty} />
              </HBox>
            </>
          )}
        </HBox>

        {isNonIndividual ? (
          <>
            <PartyField label="label.qde.field.entityName" required error={err("entityName")} sx={{ mt: 1 }} errorSx={{ mt: 1.5 }}><HTextField value={party.entityName || ""} onChange={(e) => field("entityName", e.target.value)} editable required width="100%" /></PartyField>
            <PartyField label="label.qde.field.entityType" required error={err("entityType")} sx={{ mt: 1 }}><HDropdown name="entityType" options={entityTypeOptions} value={party.entityType || ""} onChange={(e) => field("entityType", e.target.value)} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.doi" sx={{ mt: 1 }}><HDatePicker value={toPickerValue(party.doi)} onChange={(value) => field("doi", fromPickerValue(value))} width="100%" /></PartyField>
            <PartyField label="GSTIN"><HTextField value={party.gstin || ""} onChange={(e) => field("gstin", e.target.value)} editable width="100%" /></PartyField>
          </>
        ) : (
          <>
            <PartyField label="label.qde.field.firstName" required error={err("firstName")} sx={{ mt: 1.5 }} errorSx={{ mt: 1 }}><HTextField value={party.firstName || ""} onChange={(e) => field("firstName", e.target.value)} editable required type="name" width="100%" sx={{ mb: 0.5 }} /></PartyField>
            <PartyField label="label.qde.field.middleName" sx={{ mt: 1.5 }}><HTextField value={party.middleName || ""} onChange={(e) => field("middleName", e.target.value)} editable type="name" width="100%" /></PartyField>
            <PartyField label="label.qde.field.lastName" required error={err("lastName")} sx={{ mt: 1.5 }} errorSx={{ mt: 1.5 }}><HTextField value={party.lastName || ""} onChange={(e) => field("lastName", e.target.value)} editable required type="name" width="100%" /></PartyField>
            <PartyField label="label.qde.field.gender" required error={err("gender")} sx={{ mt: 1 }}><HDropdown name="gender" options={genderOptions} value={party.gender || ""} onChange={(e) => field("gender", e.target.value)} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.dob" required error={err("dob")} sx={{ mt: 1 }}><HDatePicker value={toPickerValue(party.dob)} onChange={(value) => field("dob", fromPickerValue(value))} required width="100%" /></PartyField>
            <PartyField label="label.qde.field.customerProfile" sx={{ mt: 1 }} ><HDropdown name="category" options={borrowerCategoryOptions} value={party.category || ""} onChange={(e) => field("category", e.target.value)} width="100%" /></PartyField>
          </>
        )}

        <PartyField label="label.qde.field.mobile" required error={err("mobile")} >
          <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
            <HTextField
              value={party.mobile || ""}
              onChange={(e) => {
                field("mobile", e.target.value);
                field("mobileVerified", false);
              }}
              editable
              required
              type="phone"
              length={10}
              width="100%"
              error={Boolean(err("mobile"))}
            />
            {party.mobileVerified ? (
              <HLabel value="Verified" translate={false} colon={false} sx={{ color: "success.main", whiteSpace: "nowrap" }} />
            ) : (
              <VerifyLink
                isValid={isValidMobile(party.mobile)}
                onVerify={() => verifyContact("mobileVerified", party.mobile, isValidMobile)}
              />
            )}
          </HBox>
        </PartyField>
        <PartyField label="label.qde.field.email" required error={err("email")} >
          <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
            <HTextField
              value={party.email || ""}
              onChange={(e) => {
                field("email", e.target.value);
                field("emailVerified", false);
              }}
              editable
              type="email"
              width="100%"
              error={Boolean(err("email"))}
            />
            {party.emailVerified ? (
              <HLabel value="Verified" translate={false} colon={false} sx={{ color: "success.main", whiteSpace: "nowrap" }} />
            ) : (
              <VerifyLink
                isValid={isValidEmail(party.email)}
                onVerify={() => verifyContact("emailVerified", party.email, isValidEmail)}
              />
            )}
          </HBox>
        </PartyField>
      </HBox>

      <HBox sx={{ width: "100%", mt: 3 }}>
        <KycCheckSection
          form={party}
          setField={setPartyField}
          isNonIndividual={isNonIndividual}
          verifying={partyVerifying}
          compact
          sectionKey={`party-${party.id}-kyc`}
          errors={errors}
          showAadhaarImageUpload={false}
          aadhaarOtpTimer={partyAadhaarOtpTimer}
          footerNote={isNonIndividual && (
            <HLabel
              value="Authorised Signatory is captured once per application (at the primary borrower level)."
              translate={false}
              align="left"
              colon={false}
              sx={{ color: text.secondary, fontStyle: "italic", fontSize: "11px", mt: 1 }}
            />
          )}
          {...partyHandlers}
        />
      </HBox>

      <HBox sx={{ position: "relative", width: "100%" }}>
        <HBox sx={{ position: "absolute", top: 10, right: 16, zIndex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
            <HCheckBox
              checked={Boolean(party.sameAsPrimaryAddress)}
              onChange={(event) => {
                const checked = event.target.checked;
                field("sameAsPrimaryAddress", checked);

                if (checked) {
                  addressFields.forEach((name) =>
                    field(name, primaryAddress[name] || "")
                  );
                }
              }}
            />

            <HBox sx={{ whiteSpace: "nowrap" }}>
              <HLabel
                value="Same as Primary Applicant"
                align="left"
                colon={false}
              />
            </HBox>
          </HBox>
          <AddressDetailsSection
            form={addressForm}
            setField={setPartyField}
            isNonIndividual={isNonIndividual}
          readOnly={Boolean(party.sameAsPrimaryAddress)}
          noAccordion
          errors={errors}
          individualOptions={lookups["los.address.type.individual"]}
          nonIndividualOptions={lookups["los.address.type.nonindividual"]}
        />
      </HBox>

      <SearchApplicationDialog
        open={applicationSearchOpen}
        onClose={() => setApplicationSearchOpen(false)}
        onSearch={searchExistingParty}
        loading={searchLoading}
      />
      </>}
    </SectionBlock>
  );
};

export default PartyRow;
