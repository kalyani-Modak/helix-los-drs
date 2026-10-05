import { Grid } from "@mui/material";
import { HButton, HCheckBox, HLabel, HTextField } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

const PerfiosSection = ({ form, setField, expanded, onExpandedChange }) => {
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField("perfiosFileName", file.name);
    setField("perfiosUploaded", true);
  };

  return (
    <SectionBlock
      sectionKey="perfios"
      titleKey="label.dde.section.perfios"
      subTitleKey="label.dde.section.perfios.subtitle"
      icon={<AccountBalanceOutlinedIcon fontSize="small" />}
      defaultExpanded={false}
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Grid container spacing={1.4}>
        <Grid size={12}>
          <HLabel value="label.dde.perfios.upload" align="left" colon={false} />
          <input type="file" accept=".pdf,.csv" onChange={onFile} />
        </Grid>
        <Grid size={4}>
          <HLabel value="label.dde.field.perfiosFileName" align="left" colon={false} />
          <HTextField value={form.perfiosFileName || ""} editable={false} width="100%" />
        </Grid>
        <Grid size={4}>
          <HLabel value="label.dde.field.perfiosUploaded" align="left" colon={false} />
          <HCheckBox
            checked={Boolean(form.perfiosUploaded)}
            onChange={(e) => setField("perfiosUploaded", e.target.checked)}
          />
        </Grid>
        <Grid size={4}>
          <HButton
            label="label.dde.perfios.analyse"
            variant="outlined"
            size="small"
            inline
            onClick={() => setField("perfiosUploaded", true)}
          />
        </Grid>
      </Grid>
    </SectionBlock>
  );
};

export default PerfiosSection;
