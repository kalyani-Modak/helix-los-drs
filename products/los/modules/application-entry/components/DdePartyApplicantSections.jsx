import { Grid } from "@mui/material";
import { HCheckBox, HLabel } from "@helix/component-library";
import DdeFieldGrid from "./DdeFieldGrid";
import SectionBlock from "./SectionBlock";
import { partySubsections } from "../utils/ddePartyFields";
import {
  borrowerCurrentAddressPatch,
  borrowerPermanentAddressPatch,
} from "../utils/ddePartyState";
import { computeAgeFromDob } from "../utils/ddeFormState";

const DdePartyApplicantSections = ({
  party,
  variant,
  borrower,
  onUpdate,
  lookups,
  expandedSections,
  onSectionExpandedChange,
}) => {
  const isNonEarning =
    variant === "co" &&
    (lookups?.["los.coapplicanttype"] || []).find((option) => option.value === party.type)
      ?.label === "Non-Earning";

  const setPartyField = (name, value) => {
    if (name === "dob") {
      onUpdate({ dob: value, age: computeAgeFromDob(value) });
      return;
    }
    if (name === "aadhaar") {
      onUpdate({ aadhaar: String(value ?? "").replace(/\D/g, "").slice(0, 12) });
      return;
    }
    if (name === "pan") {
      onUpdate({ pan: String(value ?? "").toUpperCase().slice(0, 10) });
      return;
    }
    onUpdate({ [name]: value });
  };

  const toggleSameAsPrimary = (field, checked) => {
    if (field === "sameAsPrimaryCurrent") {
      onUpdate({
        sameAsPrimaryCurrent: checked,
        ...(checked ? borrowerCurrentAddressPatch(borrower) : {}),
      });
      return;
    }
    onUpdate({
      sameAsPrimaryPermanent: checked,
      ...(checked ? borrowerPermanentAddressPatch(borrower) : {}),
    });
  };

  const values = {
    ...party,
    bankAccountHolder:
      party.bankAccountHolder || (variant === "co" ? "Co-Applicant" : "Guarantor"),
  };

  return (
    <>
      {partySubsections(variant, isNonEarning).map((subsection) => {
        const sectionKey = `${variant}-${party.id}-${subsection.key}`;
        return (
          <div key={subsection.key}>
            {subsection.sameAsPrimaryField ? (
              <Grid
                size={12}
                container
                alignItems="center"
                spacing={0.5}
                sx={{ mb: 1 }}
              >
                <HCheckBox
                  sx={{ width: 20, flexShrink: 0 }}
                  checked={Boolean(party[subsection.sameAsPrimaryField])}
                  onChange={(e) =>
                    toggleSameAsPrimary(subsection.sameAsPrimaryField, e.target.checked)
                  }
                />
                <HLabel
                  value="label.dde.party.sameAsPrimary"
                  align="left"
                  colon={false}
                  sx={{ whiteSpace: "nowrap" }}
                />
              </Grid>
            ) : null}
            <SectionBlock
              sectionKey={sectionKey}
              titleKey={subsection.titleKey}
              defaultExpanded
              expanded={expandedSections[sectionKey]}
              onExpandedChange={(expanded) => onSectionExpandedChange(sectionKey, expanded)}
            >
              {isNonEarning && subsection.key === "employment" ? (
                <Grid size={12}>
                  <HLabel value="label.dde.party.nonEarningHint" align="left" colon={false} />
                </Grid>
              ) : null}
              <DdeFieldGrid
                fields={subsection.fields}
                form={values}
                setField={setPartyField}
                lookups={lookups}
              />
            </SectionBlock>
          </div>
        );
      })}
    </>
  );
};

export default DdePartyApplicantSections;
