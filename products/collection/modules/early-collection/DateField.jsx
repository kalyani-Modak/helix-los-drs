import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DateField = ({
  label,
  value,
  onChange,
  onButtonClick,
  buttonLabel = "..."
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        flexWrap: "nowrap",
      }}
    >
      <Typography
        sx={{
          width: "160px",
          fontWeight: 500,
          fontSize: "13px",
          whiteSpace: "nowrap",
          mr: 1,
        }}
      >
        {label}:
      </Typography>

      <DatePicker
        slotProps={{
          textField: {
            size: "small",
            variant: "outlined",
            sx: {
              width: "130px",
              height: "20px",
              "& .MuiInputBase-root": {
                height: "20px",
                minHeight: "20px",
                fontSize: "15px",
              },
              "& .MuiOutlinedInput-input": {
                height: "20px",
                padding: "0 4px",
                fontSize: "15px",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "14px",
              },
              "& .MuiIconButton-root": {
                padding: 0,
                width: "20px",
                height: "20px",
              },
              mr: 1,
            },
          },
        }}
      />
    </Box>
  </LocalizationProvider>
);

export default DateField;
