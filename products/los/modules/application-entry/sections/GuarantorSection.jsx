import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { HButton, HLabel } from "@helix/component-library";
import PartyRow from "../components/PartyRow";
import SectionBlock from "../components/SectionBlock";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const GuarantorSection = ({ items = [], onAdd, onRemove, onChange, errors = {}, primaryBorrowerType, kycHandlers, primaryAddress, onSearchCustomer }) => {
  const intl = useIntl();
  const rowTitle = intl.formatMessage({
    id: "label.qde.guarantor.item",
    defaultMessage: "Guarantor",
  });

  return (
    <SectionBlock sectionKey="guarantors" titleKey="label.qde.section.guarantor" subTitleKey="label.qde.section.guarantor.subtitle" count={items.length} icon={<PersonOutlineOutlinedIcon fontSize="small" />}>
      <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HLabel value={
          items.length === 0
            ? intl.formatMessage({ id: "label.qde.guarantor.empty", defaultMessage: "No guarantors added.  Click to add one or more guarantors for this loan." })
            : `${items.length} guarantor${items.length > 1 ? "s" : ""} added.`
        }
          align="left"
          colon={false}
        />
        <HButton label="label.qde.button.addGuarantor" variant="outlined" size="small" inline onClick={onAdd} startIcon={<PersonAddAltIcon fontSize="small" />} />
      </Grid>

      {items.length === 0 ? (
        <Grid size={12}>
          <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           
          </Grid>
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