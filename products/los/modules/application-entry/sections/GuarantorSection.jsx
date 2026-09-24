import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { HButton, HLabel } from "@helix/component-library";
import PartyRow from "../components/PartyRow";
import SectionBlock from "../components/SectionBlock";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const GuarantorSection = ({ items = [], onAdd, onRemove, onChange, errors = {}, primaryBorrowerType, kycHandlers, primaryAddress, onSearchCustomer }) => {
  const intl = useIntl();
  const rowTitle = intl.formatMessage({
    id: "label.qde.guarantor.item",
    defaultMessage: "Guarantor",
  });

  return (
    <SectionBlock sectionKey="guarantors" titleKey="label.qde.section.guarantor" subTitleKey="label.qde.section.guarantor.subtitle" icon={<PersonOutlineOutlinedIcon fontSize="small" />}>
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
            errors={errors[party.id] || {}}
            primaryBorrowerType={primaryBorrowerType}
            kycHandlers={kycHandlers}
            primaryAddress={primaryAddress}
            onSearchCustomer={onSearchCustomer}
          />
        ))
      )}
    </SectionBlock>
  );
};

export default GuarantorSection;