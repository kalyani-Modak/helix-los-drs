import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
const InfoFieldWithButton = ({ label, value, onChange, onButtonClick, buttonLabel = "..." }) => (
  <Box className="info-field-container">
    <Typography className="info-field-label">{label}:</Typography>
    <TextField value={value || ""} onChange={onChange} size="small" variant="outlined" className="info-field-input" />
    <Button variant="contained" size="small" onClick={onButtonClick} className="info-button">
      {buttonLabel}
    </Button>
  </Box>
);

export default InfoFieldWithButton;
