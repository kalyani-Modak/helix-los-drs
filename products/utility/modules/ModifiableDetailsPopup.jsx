import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions";
import TuneIcon from "@mui/icons-material/Tune";
import PercentIcon from "@mui/icons-material/Percent";
import BarChartIcon from "@mui/icons-material/BarChart";
import InfoIcon from "@mui/icons-material/Info";

export default function ModifiableDetailsPopup({
  open,
  onClose,
  data,
  onChange,
}) {
  const [activeForm, setActiveForm] = useState(null);
  const [formValues, setFormValues] = useState({});

  const formTitles = {
    EMIROUNDING: "EMI Rounding",
    OTHERROUNDING: "Other Rounding",
    ADJUSTMENT: "Adjustment",
    INTEREST: "Interest Calculation",
    BPI: "BPI",
    OTHER: "Other",
  };
  const menuOptions = [
    { key: "EMIROUNDING", label: "EMI Rounding", icon: <CalculateIcon /> },
    {
      key: "OTHERROUNDING",
      label: "Other’s Rounding",
      icon: <FunctionsIcon />,
    },
    { key: "ADJUSTMENT", label: "Adjustment", icon: <TuneIcon /> },
    { key: "INTEREST", label: "Interest Calculation", icon: <PercentIcon /> },
    { key: "BPI", label: "BPI", icon: <BarChartIcon /> },
    { key: "OTHER", label: "Other Information", icon: <InfoIcon /> },
  ];

  // When popup opens, load parent data
  React.useEffect(() => {
    if (open) {
      let initial = {};
      Object.values(formFields).forEach((fields) => {
        fields.forEach((field) => {
          initial[field.name] = data?.[field.name] ?? field.defaultValue ?? "";
        });
      });

      setFormValues(initial);
    }
  }, [open, data]);

  // Reset to main screen whenever popup closes
  const handleClose = () => {
    setActiveForm(null);
    setFormValues({});
    onClose();
  };

  // Handle changes
  const handleChange = (fieldName, value) => {
    setFormValues((prev) => {
      const updated = { ...prev, [fieldName]: value };
      return updated;
    });
  };

  // Save → push changes to parent
  const handleSave = () => {
    onChange(formValues); // update parent state
    setActiveForm(null); // return to main screen
  };

  // Reset form to default values of the active form
  const handleSetDefault = () => {
    if (!activeForm) return;

    const defaults = {};
    formFields[activeForm].forEach((field) => {
      defaults[field.name] = field.defaultValue || "";
    });

    setFormValues((prev) => ({
      ...prev,
      ...defaults,
    }));
  };

  // Field groups
  const formFields = {
    EMIROUNDING: [
      {
        name: "EMI_ro",
        label: "EMI Rounding",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "Yes" },
          { value: "2", label: "No" },
        ],
      },
      {
        name: "EMI_ro_part",
        label: "EMI Rounding Part",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Integer" },
          { value: "2", label: "Decimal" },
        ],
      },
      {
        name: "EMI_ro_to",
        label: "EMI Rounding To",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "Upper" },
          { value: "2", label: "Lower" },
          { value: "3", label: "Proper" },
        ],
      },
      {
        name: "EMI_unit_ro",
        label: "EMI Rounding Unit",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "1" },
          { value: "10", label: "10" },
          { value: "100", label: "100" },
          { value: "1000", label: "1000" },
        ],
      },
    ],
    OTHERROUNDING: [
      {
        name: "Others_ro",
        label: "Others rounding",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "Yes" },
          { value: "0", label: "No" },
        ],
      },
      {
        name: "Others_ro_part",
        label: "Others rounding part",
        type: "select",
        defaultValue: "2",
        options: [
          { value: "1", label: "Integer" },
          { value: "2", label: "Decimal" },
        ],
      },
      {
        name: "Others_ro_to",
        label: "Others rounding to",
        type: "select",
        defaultValue: "3",
        options: [
          { value: "1", label: "Upper" },
          { value: "2", label: "Lower" },
          { value: "3", label: "Proper" },
        ],
      },
      {
        name: "Others_unit_ro",
        label: "Others unit rounding",
        type: "select",
        defaultValue: "100",
        options: [
          { value: "1", label: "1" },
          { value: "10", label: "10" },
          { value: "100", label: "100" },
          { value: "1000", label: "1000" },
        ],
      },
    ],
    ADJUSTMENT: [
      {
        name: "EMI_OP",
        label: "EMI Option Value",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "Provide threshold as input" },
          { value: "3", label: "Always creation of new row" },
        ],
      },
      {
        name: "ADJ",
        label: "Adjustment",
        type: "select",
        defaultValue: "1",
        options: [
          { value: "1", label: "Add to EMI" },
          // { value: "2", label: "Keep EMI same and adjust to interest" },
        ],
      },
      {
        name: "ONBASIS",
        label: "Onbasis Value",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "Nearest option" },
          { value: "1", label: "Percent Basis" },
          { value: "2", label: "Amount Basis" },
        ],
      },
      {
        name: "THRESH",
        label: "Thresh Value",
        type: "text",
        defaultValue: 50,
      },
    ],
    INTEREST: [
      {
        name: "IB",
        label: "Interest Basis",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "30/360" },
          { value: "1", label: "actual/actual" },
          { value: "2", label: "7/52" },
          { value: "3", label: "actual/360" },
          { value: "4", label: "actual/365" },
        ],
      },
      {
        name: "EMI_IB",
        label: "EMI Basis",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "30/360" },
          { value: "1", label: "actual/actual" },
          { value: "2", label: "7/52" },
          { value: "3", label: "actual/360" },
          { value: "4", label: "actual/365" },
        ],
      },
      {
        name: "IT",
        label: "interest Type",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "Fixed" },
          { value: "1", label: "Variable" },
          { value: "2", label: "Flat" },
        ],
      },
      {
        name: "INT_CAL",
        label: "Int Cal Method",
        type: "select",
        defaultValue: "C",
        options: [
          { value: "S", label: "Simple" },
          { value: "C", label: "Compound" },
        ],
      },
      {
        name: "INT_AMORT",
        label: "Int Amort",
        type: "select",
        defaultValue: "N",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
    ],
    BPI: [
      {
        name: "BPI_Recovery",
        label: "BPI Recovery",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "With first installment" },
          { value: "1", label: "Upfront" },
        ],
      },
      {
        name: "BPI_B",
        label: "BPI Method",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "30/360" },
          { value: "1", label: "actual/actual" },
          { value: "2", label: "7/52" },
          { value: "3", label: "actual/360" },
          { value: "4", label: "actual/365" },
        ],
      },
      {
        name: "BPI_CAP_YN",
        label: "BPI Capitalize",
        type: "select",
        defaultValue: "N",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
      {
        name: "REDUCE__",
        label: "Reduce BPI",
        type: "select",
        defaultValue: "Y",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
      {
        name: "PAY_FIRST",
        label: "Pay First",
        type: "select",
        defaultValue: "Y",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
      {
        name: "ADDINT",
        label: "Additional Int. Amt.",
        type: "text",
        defaultValue: 0,
      },
    ],
    OTHER: [
      {
        name: "AT",
        label: "Amort Type",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "Reducing Balance" },
          { value: "1", label: "Rule of 78" },
          { value: "2", label: "Equatorial" },
        ],
      },
      {
        name: "Int_Only",
        label: "Int Only",
        type: "select",
        defaultValue: 0,
        options: [
          { value: 0, label: "No" },
          { value: 1, label: "Yes" },
        ],
      },
      {
        name: "REST",
        label: "REST Frequency",
        type: "select",
        defaultValue: "12",
        options: [
          { value: "1", label: "Weekly" },
          { value: "2", label: "Bi-Weekly" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
          { value: "26", label: "Fortnightly" },
          { value: "52", label: "Weekly" },
          { value: "360", label: "Daily" },
        ],
      },
      {
        name: "compFreq",
        label: "Comp Freq",
        type: "select",
        defaultValue: "12",
        options: [
          { value: "1", label: "Weekly" },
          { value: "2", label: "Bi-Weekly" },
          { value: "4", label: "Quarterly" },
          { value: "12", label: "Monthly" },
          { value: "26", label: "Fortnightly" },
          { value: "52", label: "Weekly" },
        ],
      },
      {
        name: "INST",
        label: "Installment Type",
        type: "select",
        defaultValue: "0",
        options: [
          { value: "0", label: "Equated Installment" },
          { value: "1", label: "Interest only" },
          { value: "2", label: "Equated Principal" },
        ],
      },
      {
        name: "EOM",
        label: "End of Month",
        type: "select",
        defaultValue: "N",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
      {
        name: "SOM",
        label: "Start of Mon",
        type: "select",
        defaultValue: "N",
        options: [
          { value: "Y", label: "Yes" },
          { value: "N", label: "No" },
        ],
      },
      { name: "PRECISION_VALUE", label: "Precision", type: "text" },
      {
        name: "EQUATEDPRINFRQ",
        label: "Eq.PrinFreq",
        type: "text",
        defaultValue: "4",
      },
      // { name: "TDS_PER", label: "Tds Percentage", type: "text" },
      // {
      //   name: "DEDUCT_TDS",
      //   label: "Deduct TDS",
      //   type: "select",
      //   defaultValue: false,
      //   options: [
      //     { value: true, label: "Yes" },
      //     { value: false, label: "No" },
      //   ],
      // },
    ],
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#e8f2ff",
          color: "#4880FF",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        {activeForm ? formTitles[activeForm] : "Modifiable Parameters"}
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {!activeForm && (
          <Grid container spacing={2}>
            {menuOptions.map((option) => (
              <Grid key={option.key} size={{ xs: 12, sm: 6 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      transform: "translateY(-2px)",
                      transition: "0.3s",
                    },
                  }}
                >
                  <CardActionArea onClick={() => setActiveForm(option.key)}>
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                      }}
                    >
                      <div style={{ color: "#4880FF" }}>{option.icon}</div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeForm && (
          <Grid container spacing={2}>
            {formFields[activeForm].map((field) => (
              <Grid key={field.name} size={{ xs: 12, sm: 6 }}>
                {field.type === "select" ? (
                  <FormControl variant="outlined" sx={{ minWidth: 130 }}>
                    <TextField
                      select
                      fullWidth
                      label={field.label}
                      variant="outlined"
                      size="small"
                      value={formValues[field.name] || field.defaultValue || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      {field.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                ) : (
                  <FormControl variant="outlined" sx={{ minWidth: 130 }}>
                    <TextField
                      fullWidth
                      label={field.label}
                      variant="outlined"
                      size="small"
                      value={formValues[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      disabled={
                        field.name === "EQUATEDPRINFRQ" &&
                        formValues.INST !== "2"
                      }
                    />
                  </FormControl>
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: activeForm ? "space-between" : "flex-end", // space-between when form is open
        }}
      >
        {activeForm ? (
          <>
            {/* Left side → Set Default */}
            <Button
              variant="outlined"
              sx={{ borderColor: "#4880FF", color: "#4880FF" }}
              onClick={() => {
                handleSetDefault();
              }}
            >
              Reset
            </Button>

            {/* Right side → Back / Save & Close */}
            <div>
              <Button
                variant="outlined"
                sx={{ borderColor: "#4880FF", color: "#4880FF", mr: 1 }}
                onClick={() => setActiveForm(null)}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  handleSave();
                }}
                sx={{ backgroundColor: "#4880FF", color: "#fff", mr: 1 }}
              >
                Save & Close
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="outlined"
            sx={{ borderColor: "#4880FF", color: "#4880FF" }}
            onClick={handleClose}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ModifiableDetailsPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
