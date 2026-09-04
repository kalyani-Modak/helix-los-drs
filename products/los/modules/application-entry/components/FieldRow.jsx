import { Box, Grid } from "@mui/material";
import { HLabel } from "@helix/component-library";

const DEFAULT_SIZE = { xs: 12, sm: 6, md: 4 };

const FieldRow = ({ labelKey, required = false, size = DEFAULT_SIZE, children }) => (
  <Grid size={size}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
      <HLabel value={labelKey} required={required} align="left" colon={false} />
      {children}
    </Box>
  </Grid>
);

export default FieldRow;
