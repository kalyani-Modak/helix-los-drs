import React from "react";
import { Box, Grid } from "@mui/material";
import { HButton, HLabel, HTextField } from "@helix/component-library";
import FieldRow from "./FieldRow";

/**
 * One co-applicant / guarantor entry: the minimum identifying set captured at
 * quick data entry, plus its remove action.
 */
const PartyRow = ({ party, index, titleKey, onChange, onRemove }) => (
  <Grid size={12}>
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
      <HLabel value={`${titleKey} ${index + 1}`} translate={false} align="left" colon={false} />
      <HButton
        label="label.qde.button.remove"
        variant="text"
        size="small"
        inline
        onClick={() => onRemove(party.id)}
      />
    </Box>
    <Grid container spacing={2}>
      <FieldRow labelKey="label.qde.field.firstName" size={{ xs: 12, sm: 6, md: 3 }}>
        <HTextField
          value={party.firstName}
          onChange={(e) => onChange(party.id, "firstName", e.target.value)}
          editable
          type="name"
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.lastName" size={{ xs: 12, sm: 6, md: 3 }}>
        <HTextField
          value={party.lastName}
          onChange={(e) => onChange(party.id, "lastName", e.target.value)}
          editable
          type="name"
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.mobile" size={{ xs: 12, sm: 6, md: 3 }}>
        <HTextField
          value={party.mobile}
          onChange={(e) => onChange(party.id, "mobile", e.target.value)}
          editable
          type="phone"
          length={10}
          width="100%"
        />
      </FieldRow>

      <FieldRow labelKey="label.qde.field.pan" size={{ xs: 12, sm: 6, md: 3 }}>
        <HTextField
          value={party.pan}
          onChange={(e) => onChange(party.id, "pan", e.target.value.toUpperCase())}
          editable
          length={10}
          width="100%"
        />
      </FieldRow>
    </Grid>
  </Grid>
);

export default PartyRow;
