import { Box, Typography, TextField } from "@mui/material";

const InfoField = ({ label, value }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 1,
        mb: 0.5,
      }}
    >
      <Typography
        sx={{
          minWidth: "120px",
          fontWeight: 500,
          fontSize: "12px",
          textAlign: "right",
        }}
      >
        {label}:
      </Typography>
      <TextField
        value={value}
        size="small"
        InputProps={{ readOnly: true }}
        variant="outlined"
        sx={{
          width: "200px",
          "& .MuiInputBase-root": {
            height: "18px",
            fontSize: "12px",
          },
          "& .MuiOutlinedInput-input": {
            padding: "2px 4px",
          },
        }}
      />
    </Box>
  );

  export default InfoField;