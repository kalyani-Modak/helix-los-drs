import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { HButton, HLabel } from "@helix/component-library";
import PartyRow from "../components/PartyRow";
import SectionBlock from "../components/SectionBlock";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const CoApplicantSection = ({ items = [], onAdd, onRemove, onChange, errors = {}, primaryBorrowerType, kycHandlers, primaryAddress, onSearchCustomer, lookups }) => {
  const intl = useIntl();
  const rowTitle = intl.formatMessage({
    id: "label.qde.coApplicant.item",
    defaultMessage: "Co-applicant",
  });

  return (
    <SectionBlock sectionKey="coApplicants"
      titleKey="label.qde.section.coApplicant"
      subTitleKey="label.qde.section.coApplicant.subtitle"
      count={items.length}
      icon={<PersonOutlineOutlinedIcon fontSize="small" />}>
      <Grid size={12} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HLabel value={
          items.length === 0
            ? intl.formatMessage({ id: "label.qde.coApplicant.empty", defaultMessage: "No co-applicants added.  Click to add one or more co-applicants for this loan." })
            : `${items.length} co-applicant${items.length > 1 ? "s" : ""} added.`
        }
          align="left"
          colon={false}
        />
        <HButton label="label.qde.button.addCoApplicant" variant="outlined" size="small" inline onClick={onAdd} startIcon={<PersonAddAltIcon fontSize="small" />} />
      </Grid>

      {items.length === 0 ? (
        <Grid size={12}>
          {/* <HLabel value="label.qde.coApplicant.empty" align="left" colon={false} /> */}
        </Grid>
      ) : (
        items.map((party, index) => (
          <Grid
            key={party.id}
            size={12}
            sx={{ width: "100%", minWidth: 0, maxWidth: "100%", boxSizing: "border-box" }}>
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
              lookups={lookups}
            />
          </Grid>
        ))
      )}
    </SectionBlock>
  );
};

export default CoApplicantSection;