import React from "react";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { HButton, HLabel } from "@helix/component-library";
import PartyRow from "../components/PartyRow";
import SectionBlock from "../components/SectionBlock";

const GuarantorSection = ({ items = [], onAdd, onRemove, onChange }) => {
  const intl = useIntl();
  const rowTitle = intl.formatMessage({
    id: "label.qde.guarantor.item",
    defaultMessage: "Guarantor",
  });

  return (
    <SectionBlock sectionKey="guarantors" titleKey="label.qde.section.guarantor">
      <Grid size={12}>
        <HButton label="label.qde.button.addGuarantor" variant="outlined" size="small" inline onClick={onAdd} />
      </Grid>

      {items.length === 0 ? (
        <Grid size={12}>
          <HLabel value="label.qde.guarantor.empty" align="left" colon={false} />
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

export default GuarantorSection;
