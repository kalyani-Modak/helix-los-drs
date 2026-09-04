import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
const UpdatableField = ({ label, value }) => (
  <Box className="info-field-container">
    <Typography className="info-field-label">
      {label}:
    </Typography>
    <TextField
      size="small"
      fullWidth
      variant="outlined"
      className="info-field-input"
    />
  </Box>
);

export default UpdatableField;
