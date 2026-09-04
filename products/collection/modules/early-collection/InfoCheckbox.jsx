import React from "react";
import { Box, Typography, Checkbox } from "@mui/material";

const InfoCheckbox = ({ label, checked, onChange }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mb: 1,
      flexWrap: "nowrap",
      width: "100%",
    }}
  >
    <Typography
      className="info-field-label"
    >
      {label}:
    </Typography>

    <Checkbox
      checked={checked}
      onChange={onChange}
      size="small"
      sx={{ padding: "0 4px", height: "20px" }}
    />
  </Box>
);

export default InfoCheckbox;
