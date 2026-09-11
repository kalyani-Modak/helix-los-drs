import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { HButton, HLabel } from "@helix/component-library";
import PartyRow from "../components/PartyRow";
import SectionBlock from "../components/SectionBlock";

const CoApplicantSection = ({ items = [], onAdd, onRemove, onChange }) => {
  const intl = useIntl();
  const rowTitle = intl.formatMessage({
    id: "label.qde.coApplicant.item",
    defaultMessage: "Co-applicant",
  });

  return (
    <SectionBlock sectionKey="coApplicants" titleKey="label.qde.section.coApplicant">
      <Grid size={12}>
        <HButton label="label.qde.button.addCoApplicant" variant="outlined" size="small" inline onClick={onAdd} />
      </Grid>

      {items.length === 0 ? (
        <Grid size={12}>
          <HLabel value="label.qde.coApplicant.empty" align="left" colon={false} />
        </Grid>
      ) : (
        items.map((party, index) => (
          <PartyRow
            key={party.id}
            party={party}
            index={index}
            titleKey={rowTitle}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))
      )}
    </SectionBlock>
  );
};

export default CoApplicantSection;
