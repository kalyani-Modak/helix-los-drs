import { Grid } from "@mui/material";
import { HButton, HLabel } from "@helix/component-library";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SectionBlock from "../components/SectionBlock";
import DdeFieldGrid from "../components/DdeFieldGrid";
import { DDE_FIELDS } from "../constants/ddeFieldMetadata";

const emptyParty = (variant) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  relationship: "",
  ...(variant === "co" ? { type: "Earning" } : {}),
});

const PARTY_EXTRA = {
  co: [
    {
      name: "relationship",
      type: "select",
      label: "Relationship with Main Borrower",
      required: true,
      options: ["Spouse", "Father", "Mother", "Son", "Daughter", "Sibling", "Business Partner", "Other"],
    },
    {
      name: "type",
      type: "select",
      label: "Co-Applicant Type",
      required: true,
      options: ["Earning", "Non-Earning"],
    },
  ],
  guarantor: [
    {
      name: "relationship",
      type: "select",
      label: "Relationship to Primary Applicant",
      required: true,
      options: [
        "Spouse",
        "Father",
        "Mother",
        "Son",
        "Daughter",
        "Sibling",
        "Relative",
        "Friend",
        "Business Partner",
        "Employer",
        "Other",
      ],
    },
  ],
};

const partyFields = (variant) => [
  ...PARTY_EXTRA[variant],
  ...DDE_FIELDS.filter((f) => f.section === "Personal Details").slice(0, 12),
  ...DDE_FIELDS.filter((f) => f.section === "Current Address"),
];

const DdePartyListSection = ({
  variant,
  titleKey,
  subTitleKey,
  items = [],
  onAdd,
  onRemove,
  onChange,
  lookups,
  expanded,
  onExpandedChange,
}) => {
  const updateParty = (id, name, value) => {
    onChange(
      items.map((p) => (p.id === id ? { ...p, [name]: value } : p))
    );
  };

  return (
    <SectionBlock
      sectionKey={variant === "co" ? "ddeCoApplicants" : "ddeGuarantors"}
      titleKey={titleKey}
      subTitleKey={subTitleKey}
      count={items.length}
      icon={<PersonOutlineOutlinedIcon fontSize="small" />}
      defaultExpanded={false}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Grid container spacing={1.4}>
      <Grid size={12}>
        <HLabel
          value={
            items.length === 0
              ? variant === "co"
                ? "label.dde.coApplicant.empty"
                : "label.dde.guarantor.empty"
              : "label.dde.party.count"
          }
          align="left"
          colon={false}
        />
        <HButton
          label={variant === "co" ? "label.dde.button.addCoApplicant" : "label.dde.button.addGuarantor"}
          variant="outlined"
          size="small"
          inline
          onClick={() => onAdd(emptyParty(variant))}
          startIcon={<PersonAddAltIcon fontSize="small" />}
        />
      </Grid>
      {items.map((party, index) => (
        <Grid key={party.id} size={12}>
          <HLabel value={`${variant === "co" ? "Co-applicant" : "Guarantor"} ${index + 1}`} align="left" colon={false} />
          <DdeFieldGrid
            fields={partyFields(variant)}
            form={party}
            setField={(name, value) => updateParty(party.id, name, value)}
            lookups={lookups}
          />
          <HButton
            label="label.dde.button.removeParty"
            variant="text"
            size="small"
            inline
            onClick={() => onRemove(party.id)}
          />
        </Grid>
      ))}
      </Grid>
    </SectionBlock>
  );
};

export default DdePartyListSection;
