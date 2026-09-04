import React, { useState, useEffect} from "react";
import { AxiosClient } from "@helix/component-library";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  MenuItem,
  Typography,
  Box,
  Paper,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TableChart, Calculate, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import ModifiableDetailsPopup from "./ModifiableDetailsPopup";
import AmortPopup from "./AmortPopup";
const BASE_URL = "http://10.141.182.196:8086/aayu-service/v1/amortization";

// Create a custom theme
const theme = createTheme({
  palette: {
    secondary: {
      main: "#4880FF",
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
  },
});

const formFields = {
  EMIROUNDING: [
    { name: "EMI_ro", label: "EMI Rounding", type: "select", options: [{ value: "1", label: "Yes" }, { value: "2", label: "No" }] },
    { name: "EMI_ro_part", label: "EMI Rounding Part", type: "select", options: [{ value: "1", label: "Integer" }, { value: "2", label: "Decimal" }] },
    { name: "EMI_ro_to", label: "EMI Rounding To", type: "select", options: [{ value: "1", label: "Upper" }, { value: "2", label: "Lower" }, { value: "3", label: "Proper" }] },
    { name: "EMI_unit_ro", label: "EMI Rounding Unit", type: "select", options: [{ value: "1", label: "1" }, { value: "10", label: "10" }, { value: "100", label: "100" }, { value: "1000", label: "1000" }] },
  ],
  OTHERROUNDING: [
    { name: "Others_ro", label: "Others rounding", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }] },
    { name: "Others_ro_part", label: "Others rounding part", type: "select", options: [{ value: "1", label: "Integer" }, { value: "2", label: "Decimal" }] },
    { name: "Others_ro_to", label: "Others rounding to", type: "select", options: [{ value: "1", label: "Upper" }, { value: "2", label: "Lower" }, { value: "3", label: "Proper" }] },
    { name: "Others_unit_ro", label: "Others unit rounding", type: "select", options: [{ value: "1", label: "1" }, { value: "10", label: "10" }, { value: "100", label: "100" }, { value: "1000", label: "1000" }] },
  ],
  ADJUSTMENT: [
    { name: "EMI_OP", label: "Emi Option Value", type: "select", options: [{ value: "1", label: "Provide threshold as input" }, { value: "3", label: "Always creation of new row" }] },
    { name: "ADJ", label: "Adjustment", type: "select", options: [{ value: "1", label: "Add to EMI" }] },
    { name: "ONBASIS", label: "Onbasis Value", type: "select", options: [{ value: "0", label: "Nearest option" }, { value: "1", label: "Percent Basis" }, { value: "2", label: "Amount Basis" }] },
    { name: "THRESH", label: "Thresh Value", type: "text" },
  ],
  INTEREST: [
    { name: "IB", label: "Interest Basis", type: "select", options: [{ value: "0", label: "30/360" }, { value: "1", label: "actual/actual" }, { value: "2", label: "7/52" }, { value: "3", label: "actual/360" }, { value: "4", label: "actual/365" }] },
    { name: "EMI_IB", label: "Emi Basis", type: "select", options: [{ value: "0", label: "30/360" }, { value: "1", label: "actual/actual" }, { value: "2", label: "7/52" }, { value: "3", label: "actual/360" }, { value: "4", label: "actual/365" }] },
    { name: "IT", label: "interest Type", type: "select", options: [{ value: "0", label: "Fixed" }, { value: "1", label: "Variable" }, { value: "2", label: "Flat" }] },
    { name: "INT_CAL", label: "Int Cal Method", type: "select", options: [{ value: "S", label: "Simple" }, { value: "C", label: "Compound" }] },
    { name: "INT_AMORT", label: "Int Amort", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
  ],
  BPI: [
    { name: "BPI_Recovery", label: "BPI Recovery", type: "select", options: [{ value: "0", label: "With first installment" }, { value: "1", label: "Upfront" }] },
    { name: "BPI_B", label: "BPI Method", type: "select", options: [{ value: "0", label: "30/360" }, { value: "1", label: "actual/actual" }, { value: "2", label: "7/52" }, { value: "3", label: "actual/360" }, { value: "4", label: "actual/365" }] },
    { name: "BPI_CAP_YN", label: "Bpi Capitalize", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
    { name: "REDUCE__", label: "Reduce Bpi", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
    { name: "PAY_FIRST", label: "Pay First", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
    { name: "ADDINT", label: "Additional Int. Amt.", type: "text"},
  ],
  OTHER: [
    { name: "AT", label: "Amort Type", type: "select", options: [{ value: "0", label: "Reducing Balance" }, { value: "1", label: "Rule of 78" }, { value: "2", label: "Equatorial" }] },
    { name: "Int_Only", label: "Int Only", type: "select", options: [{ value: 0, label: "No" }, { value: 1, label: "Yes" }] },
    { name: "REST", label: "REST Frequency", type: "select", options: [{ value: "1", label: "Weekly" }, { value: "2", label: "Bi-Weekly" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" }, { value: "26", label: "Fortnightly" }, { value: "52", label: "Weekly" }, { value: "360", label: "Daily" }] },
    { name: "compFreq", label: "Comp Freq", type: "select", options: [{ value: "1", label: "Weekly" }, { value: "2", label: "Bi-Weekly" }, { value: "4", label: "Quarterly" }, { value: "12", label: "Monthly" }, { value: "26", label: "Fortnightly" }, { value: "52", label: "Weekly" }] },
    { name: "INST", label: "Installment Type", type: "select", options: [{ value: "0", label: "Equated Installment" }, { value: "1", label: "Interest only" }, { value: "2", label: "Equated Principal" }] },
    { name: "EOM", label: "End of Month", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
    { name: "SOM", label: "Start of Mon", type: "select", options: [{ value: "Y", label: "Yes" }, { value: "N", label: "No" }] },
    { name: "PRECISION_VALUE", label: "Precision", type: "text" },
    { name: "EQUATEDPRINFRQ", label: "Eq.PrinFreq", type: "text" },
  ],
};
const variationFormFields = {
  BALLOON: [
    { name: "BPadjust", label: "BP Adjust", type: "select", options: [{ value: "0", label: "Adjusted EMI" },{ value: "1", label: "Adjust EMI" },{ value: "2", label: "Adjust Tenor" },] },
    { name: "BPmonth", label: "BP Installment" },
    { name: "BPAmount", label: "BP Amount" },
  ],
  STEP: [
    { name: "stepmode", label: "Step Mode", type: "select", options: [{ value: "0", label: "Step Up" },{ value: "1", label: "Step Down" },] },
    { name: "stepadjust", label: "Step Adjust", type: "select", options: [{ value: "0", label: "Adjusted EMI" },{ value: "1", label: "Adjust EMI" },{ value: "2", label: "Adjust Tenor" },] },
    { name: "stepbasis", label: "Step Basis", type: "select", options: [{ value: "0", label: "Amount" },{ value: "1", label: "Percentage" },{ value: "2", label: "Step Absolute" },{ value: "3", label: "Step Principal" },] },
    { name: "stepby", label: "Step By" },
    { name: "frm_month", label: "Step From Installment" },
    { name: "to_month", label: "Step To Installment" },
  ],
  SKIP: [
    { name: "skipadjust", label: "Skip Adjust", type: "select", options: [{ value: "0", label: "Adjusted EMI" },{ value: "1", label: "Adjust EMI" },{ value: "2", label: "Adjust Tenor" },] },
    { name: "skipfrm_month", label: "Skip From Installment" },
    { name: "no_month", label: "No. of Months" },
    { name: "skipcapital", label: "Skip Capital", type: "select", options: [{ value: "N", label: "No" },{ value: "Y", label: "Yes" },{ value: "P", label: "Interest Payable" },{ value: "A", label: "Accumulative" },{ value: "C", label: "Cumulative" },] },
    { name: "skippartpay", label: "Skip Part Pay", type: "select", defaultValue: "N", options: [{ value: "N", label: "No" },{ value: "Y", label: "Yes" },] },
    { name: "skippartialpay_in", label: "Skip Part Pay In", type: "select", defaultValue: "N", options: [{ value: "A", label: "Amount" },{ value: "P", label: "Percentage" },] },
    { name: "skippartint", label: "Skip Part Pay Interest" },
  ],
  LASTBALLOON: [
    { name: "BP_Lastpayamt", label: "BP Last Pay Amount" },
  ],
};

const defaultModifiableDetails = {
  // EMI ROUNDING
  EMI_unit_ro: "1",
  EMI_ro_to: "1",
  EMI_ro_part: "2",
  EMI_ro: "1",
  // OTHER ROUNDING
  Others_unit_ro: "100",
  Others_ro_to: "3",
  Others_ro: "1",
  Others_ro_part: "2",
  // ADJUSTMENT
  THRESH: 50,
  EMI_OP: "1",
  ONBASIS: "0",
  ADJ: "1",
  // INTEREST
  Int_Only: 0,
  INT_AMORT: "N",
  ADDINT: 0,
  interestrate: 0,
  INT_CAL: "C",
  IB: "0",
  EMI_IB: "0",
  IT: "0",
  // BPI
  BPI_Recovery: "0",
  BPI_B: "0",
  BPI_CAP_YN: "N",
  REDUCE__: "Y",
  PAY_FIRST: "Y",
  // OTHER
  AT: "0",
  REST: "12",
  compFreq: "12",
  INST: "0",
  EOM: "N",
  SOM: "N",
  PRECISION_VALUE: null,
  EQUATEDPRINFRQ: "4",
  // TDS_PER: null,
  // DEDUCT_TDS: false,
  LAST_EMI_CONST: null,
  LAST_INST_RO: null,
};

export default function AayuSimulator() {
  const [formData, setFormData] = useState({
    tenor: "",
    emi: "",
    rate: 8.5,
    loan_amount: "",
    frequency: "12",
    T_IN: 1,
    DOD: dayjs(), // today's date
    DOC: dayjs().add(1, "month"), // +1 month
    dateformat: "MM/DD/YYYY",
  });

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : null;
  };
  const buildPayload = () => {
    const basePayload = {
      T: Number(formData.tenor) || 0,
      emi: Number(formData.emi) || 0,
      R: Number(formData.rate),
      P: Number(formData.loan_amount),
      F: String(formData.frequency),
      T_IN: String(formData.T_IN),
      DOD: formatDate(formData.DOD),
      DOC: formatDate(formData.DOC),
      dateformat: formData.dateformat,
    };
    // Separate EMI_ADJ fields from modifiableDetails
    const { THRESH, EMI_OP, ONBASIS, ADJ, ...rest } = {
      ...defaultModifiableDetails,
      ...modifiableDetails,
    };

    const payload = {
      ...basePayload,
      ...rest,
      EMI_ADJ: {
        THRESH,
        EMI_OP,
        ONBASIS,
        ADJ,
      },
    }; 
  
  if (savedVariations.BP && Object.keys(savedVariations.BP).length > 0) {
    payload.BP = savedVariations.BP;
  }
  
  if (savedVariations.Step_EMI && Object.keys(savedVariations.Step_EMI).length > 0) {
    payload.Step_EMI = savedVariations.Step_EMI;
  }
  
  if (savedVariations.Skip_EMI && Object.keys(savedVariations.Skip_EMI).length > 0) {
    payload.Skip_EMI = savedVariations.Skip_EMI;
  }
  
  if (savedVariations.BP_Lastpayamt && savedVariations.BP_Lastpayamt !== 0) {
    payload.BP_Lastpayamt = savedVariations.BP_Lastpayamt;
  }
  return payload;
  };

  const [openModifiableDetails, setOpenModifiableDetails] = useState(false);
  const [expandedModifiableDetails, setExpandedModifiableDetails] = useState(false); // Default to expanded
  const [amortData, setAmortData] = useState(null);
  const [openAmortPopup, setOpenAmortPopup] = useState(false);
  const [calculatedEmi, setCalculatedEmi] = useState(null);
  const [showEmi, setShowEmi] = useState(false);
  const [openJsonPopup, setOpenJsonPopup] = useState(false);
  const [jsonPayload, setJsonPayload] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "error", "success", "warning", "info"
  });
  const [includeVariation, setIncludeVariation] = useState(false);
  if(includeVariation){
    console.log("Variations included!");
  }
  const [modifiableDetails, setModifiableDetails] = useState(
    defaultModifiableDetails
  );

  const [variationDetails, setVariationDetails] = useState({
    BP: {},
    Step_EMI: {},
    Skip_EMI: {
      skippartpay: "N",
      skipcapital: "N"
    },
    BP_Lastpayamt: 0,
  });
  const [expandedVariation, setExpandedVariation] = useState(true);
  const [expandedBP, setExpandedBP] = useState(false);
  const [expandedStep, setExpandedStep] = useState(false);
  const [expandedSkip, setExpandedSkip] = useState(false);
  const [expandedLastPay, setExpandedLastPay] = useState(false);
  const [hasBPData, setHasBPData] = useState(false);
  const [hasStepData, setHasStepData] = useState(false);
  const [hasSkipData, setHasSkipData] = useState(false);
  const [hasLastPayData, setHasLastPayData] = useState(false);
  const [selectedVariationType, setSelectedVariationType] = useState("");
  const [calculatedTenor, setCalculatedTenor] = useState(null);
  const [savedVariations, setSavedVariations] = useState({
  BP: {},
  Step_EMI: {},
  Skip_EMI: {},
  BP_Lastpayamt: 0,
});
if(expandedBP || expandedStep || expandedSkip || expandedLastPay){
  console.log("At least one variation section is expanded.");
}
const [editingState, setEditingState] = useState({
  isEditing: false,
  type: null,
  key: null
});
const [globalAdjust, setGlobalAdjust] = useState("0"); // Default to "Adjusted EMI"
// Function to update global adjust and sync all variations
const updateGlobalAdjust = (value) => {
  setGlobalAdjust(value);  
  if (variationDetails.BP) {
    updateBPData("BPadjust", value);
  }
  if (variationDetails.Step_EMI) {
    updateStepData("stepadjust", value);
  }
  if (variationDetails.Skip_EMI) {
    updateSkipData("skipadjust", value);
  } 
  // Update all saved variations
  const updatedVariations = { ...savedVariations };  
  // Update BP variations
  if (updatedVariations.BP) {
    Object.keys(updatedVariations.BP).forEach(key => {
      updatedVariations.BP[key] = {
        ...updatedVariations.BP[key],
        BPadjust: value
      };
    });
  }  
  // Update Step_EMI variations
  if (updatedVariations.Step_EMI) {
    Object.keys(updatedVariations.Step_EMI).forEach(key => {
      updatedVariations.Step_EMI[key] = {
        ...updatedVariations.Step_EMI[key],
        stepadjust: value
      };
    });
  }  
  // Update Skip_EMI variations
  if (updatedVariations.Skip_EMI) {
    Object.keys(updatedVariations.Skip_EMI).forEach(key => {
      updatedVariations.Skip_EMI[key] = {
        ...updatedVariations.Skip_EMI[key],
        skipadjust: value
      };
    });
  }  
  setSavedVariations(updatedVariations);
};

useEffect(() => {
  checkBPData();
  checkStepData();
  checkSkipData();
  checkLastPayData();
}, [variationDetails]);

// Update your clear functions to use the functional update pattern
const clearBPData = () => {
  setVariationDetails(prev => ({
    ...prev,
    BP: {}
  }));
  setHasBPData(false);
  setEditingState({ isEditing: false, type: null, key: null }); // Reset editing state
};

const clearStepData = () => {
  setVariationDetails(prev => ({
    ...prev,
    Step_EMI: {}
  }));
  setHasStepData(false);
  setEditingState({ isEditing: false, type: null, key: null }); // Reset editing state
};

const clearSkipData = () => {
  setVariationDetails(prev => ({
    ...prev,
    Skip_EMI: {}
  }));
  setHasSkipData(false);
  setEditingState({ isEditing: false, type: null, key: null }); // Reset editing state
};

const clearLastPayData = () => {
  setVariationDetails(prev => ({
    ...prev,
    BP_Lastpayamt: 0
  }));
  setHasLastPayData(false);
};

const saveBPData = () => {
  if (!globalAdjust || !variationDetails.BP?.BPmonth || !variationDetails.BP?.BPAmount) {
    showSnackbar("Please fill all required BP fields","error");
    return;
  }

  // Check for overlapping variations
  const bpInstallment = parseInt(variationDetails.BP.BPmonth);
  if (isOverlappingVariation(bpInstallment, bpInstallment, 'BP')) {
    showSnackbar(`Cannot add BP on installment ${bpInstallment} - already has another variation`, "error");
    return;
  }

  const currentAdjustValue = globalAdjust;
  const updatedBPRecords = { ...savedVariations.BP };

  if (editingState.isEditing && editingState.type === 'BP') {
    // Update the record being edited
    updatedBPRecords[editingState.key] = {
      ...variationDetails.BP,
      BPadjust: currentAdjustValue
    };
    
    // Update ALL other BP records to have the same adjust value
    Object.keys(updatedBPRecords).forEach(key => {
      if (key !== editingState.key) {
        updatedBPRecords[key] = {
          ...updatedBPRecords[key],
          BPadjust: currentAdjustValue
        };
      }
    });
    
    // Clear editing state
    setEditingState({ isEditing: false, type: null, key: null });
  } else {
    // Add new record
    const newRecordKey = `R${Object.keys(updatedBPRecords || {}).length + 1}`;
    updatedBPRecords[newRecordKey] = {
      ...variationDetails.BP,
      BPadjust: currentAdjustValue
    };
    
    // Update ALL existing records to have the same adjust value
    Object.keys(updatedBPRecords).forEach(key => {
      if (key !== newRecordKey) {
        updatedBPRecords[key] = {
          ...updatedBPRecords[key],
          BPadjust: currentAdjustValue
        };
      }
    });
  }

  setSavedVariations(prev => ({
    ...prev,
    BP: updatedBPRecords
  }));

  setIncludeVariation(true);
  clearBPData();
  showSnackbar(`BP saved successfully!`, "success");
};

const saveStepData = () => {
  if (!globalAdjust || !variationDetails.Step_EMI?.stepby || !variationDetails.Step_EMI?.frm_month || !variationDetails.Step_EMI?.to_month
    || !variationDetails.Step_EMI?.stepmode || variationDetails.Step_EMI?.stepbasis === undefined
  ) {
    showSnackbar("Please fill all required Step EMI fields","error");
    return;
  }
  // Check for overlapping variations
  const fromInstallment = parseInt(variationDetails.Step_EMI.frm_month);
  const toInstallment = parseInt(variationDetails.Step_EMI.to_month);
  if (isOverlappingVariation(fromInstallment, toInstallment, 'Step_EMI')) {
    showSnackbar(`Cannot add Step EMI from installment ${fromInstallment} to ${toInstallment} - overlaps with another variation`, "error");
    return;
  }
  const currentAdjustValue = globalAdjust;
  const updatedStepRecords = { ...savedVariations.Step_EMI };

  if (editingState.isEditing && editingState.type === 'Step_EMI') {
    // Update the record being edited
    updatedStepRecords[editingState.key] = {
      ...variationDetails.Step_EMI,
      stepadjust: currentAdjustValue
    };    
    // Update ALL other Step records to have the same adjust value
    Object.keys(updatedStepRecords).forEach(key => {
      if (key !== editingState.key) {
        updatedStepRecords[key] = {
          ...updatedStepRecords[key],
          stepadjust: currentAdjustValue
        };
      }
    });    
    // Clear editing state
    setEditingState({ isEditing: false, type: null, key: null });
  } else {
    // Add new record
    const newRecordKey = `R${Object.keys(updatedStepRecords || {}).length + 1}`;
    updatedStepRecords[newRecordKey] = {
      ...variationDetails.Step_EMI,
      stepadjust: currentAdjustValue
    };
    
    // Update ALL existing records to have the same adjust value
    Object.keys(updatedStepRecords).forEach(key => {
      if (key !== newRecordKey) {
        updatedStepRecords[key] = {
          ...updatedStepRecords[key],
          stepadjust: currentAdjustValue
        };
      }
    });
  }
  setSavedVariations(prev => ({
    ...prev,
    Step_EMI: updatedStepRecords
  }));

  setIncludeVariation(true);
  clearStepData();
  showSnackbar(`Step EMI saved successfully!`, "success");
};

const saveSkipData = () => {
  const skipData = variationDetails.Skip_EMI || {};  
  // Base required fields for all cases
  const baseRequiredFields = globalAdjust && skipData.skipfrm_month && skipData.no_month && 
                            skipData.skipcapital && skipData.skippartpay !== undefined;

  // Conditional validation based on Skip Part Pay value
  let hasAllRequiredFields = baseRequiredFields;
  
  if (skipData.skippartpay === "Y") {
    hasAllRequiredFields = baseRequiredFields && skipData.skippartialpay_in && skipData.skippartint;
  }

  if (!hasAllRequiredFields) {
    showSnackbar("Please fill all required Skip EMI fields","error");
    return;
  }
  // Check for overlapping variations
  const fromInstallment = parseInt(variationDetails.Skip_EMI.skipfrm_month);
  const noOfMonths = parseInt(variationDetails.Skip_EMI.no_month);
  const toInstallment = fromInstallment + noOfMonths - 1;
  
  if (isOverlappingVariation(fromInstallment, toInstallment, 'Skip_EMI')) {
    showSnackbar(`Cannot add Skip EMI from installment ${fromInstallment} to ${toInstallment} - overlaps with another variation`, "error");
    return;
  }
  const currentAdjustValue = globalAdjust;
  const updatedSkipRecords = { ...savedVariations.Skip_EMI };

  if (editingState.isEditing && editingState.type === 'Skip_EMI') {
    // Update the existing record being edited
    const editedRecord = { ...variationDetails.Skip_EMI };    
    // Ensure conditional fields are properly handled
    if (editedRecord.skippartpay === "N") {
      // Clear conditional fields for "N" records
      editedRecord.skippartialpay_in = "";
      editedRecord.skippartint = "";
    }
    
    updatedSkipRecords[editingState.key] = {
      ...editedRecord,
      skipadjust: currentAdjustValue
    };   
    // Clear editing state
    setEditingState({ isEditing: false, type: null, key: null });
  } else {
    // Add new record
    const newRecordKey = `R${Object.keys(updatedSkipRecords || {}).length + 1}`;
    const newRecord = { ...variationDetails.Skip_EMI };    
    // Ensure conditional fields are properly handled for new records
    if (newRecord.skippartpay === "N") {
      newRecord.skippartialpay_in = "";
      newRecord.skippartint = "";
    }    
    updatedSkipRecords[newRecordKey] = {
      ...newRecord,
      skipadjust: currentAdjustValue
    };
  }
  // Update ALL Skip records to use the global adjust value
  Object.keys(updatedSkipRecords).forEach(key => {
    updatedSkipRecords[key] = {
      ...updatedSkipRecords[key],
      skipadjust: currentAdjustValue
    };
  });

  setSavedVariations(prev => ({
    ...prev,
    Skip_EMI: updatedSkipRecords
  }));

  setIncludeVariation(true);
  clearSkipData();
  showSnackbar(`Skip EMI ${editingState.isEditing ? 'updated' : 'saved'} successfully!`, "success");
};

const saveLastPayData = () => {
  if (hasLastPayData) {
    setSavedVariations(prev => ({
      ...prev,
      BP_Lastpayamt: variationDetails.BP_Lastpayamt
    }));
    setIncludeVariation(true);
    clearLastPayData();
    showSnackbar("BP Last Payment saved successfully!", "success");
  }
};

  const checkBPData = () => {
  const bp = variationDetails.BP || {};
  const hasData = bp.BPmonth && globalAdjust && bp.BPAmount;
  setHasBPData(!!hasData);
};

const checkStepData = () => {
  const step = variationDetails.Step_EMI || {};
  const hasData = step.stepmode && globalAdjust && step.stepbasis && 
                  step.stepby && step.frm_month && step.to_month;
  setHasStepData(!!hasData);
};

const checkSkipData = () => {
  const skip = variationDetails.Skip_EMI || {};  
  // Base required fields
  let hasData = globalAdjust && skip.skipfrm_month && skip.no_month && 
                skip.skipcapital && skip.skippartpay; 
  // Only require these fields if Skip Part Pay is "Y"
  if (skip.skippartpay === "Y") {
    hasData = hasData && skip.skippartialpay_in && skip.skippartint;
  }  
  console.log("Skip Data Check:", { 
    globalAdjust, 
    skipfrm_month: skip.skipfrm_month, 
    no_month: skip.no_month,
    skipcapital: skip.skipcapital,
    skippartpay: skip.skippartpay,
    skippartialpay_in: skip.skippartialpay_in,
    skippartint: skip.skippartint,
    hasData 
  });  
  setHasSkipData(!!hasData);
};

const checkLastPayData = () => {
  setHasLastPayData(!!variationDetails.BP_Lastpayamt && variationDetails.BP_Lastpayamt !== 0);
};
  const updateBPData = (field, value) => {
  setVariationDetails(prev => ({
    ...prev,
    BP: {
      ...prev.BP,
      [field]: value
    }
  }));
};

const updateStepData = (field, value) => {
  setVariationDetails(prev => ({
    ...prev,
    Step_EMI: {
      ...prev.Step_EMI,
      [field]: value
    }
  }));
};

const updateSkipData = (field, value) => {
  setVariationDetails(prev => ({
    ...prev,
    Skip_EMI: {
      ...prev.Skip_EMI,
      [field]: value
    }
  }));
};

const getTotalInstallments = () => {
  const { tenor, emi } = formData;
  
  if (tenor && Number(tenor) !== 0) {
    return parseInt(tenor);
  } else if (emi && Number(emi) !== 0 && amortData && amortData.length > 0) {
    return amortData.length;
  }
  return 0;
};

const getInstallmentOptions = (type, currentFrom = null, currentTo = null, editingKey = null) => {
  const { tenor, emi } = formData;
  let totalInstallments = 0;

  if (tenor && Number(tenor) !== 0) totalInstallments = parseInt(tenor);
  else if (emi && amortData?.length > 0) totalInstallments = amortData.length;
  else return [];

  const isStep = type === "Step_EMI";
  const isSkip = type === "Skip_EMI";
  const isBalloon = type === "BP";
  let original = null;

  if (isStep) {
    original = savedVariations.Step_EMI?.[editingKey];
  } else if (isSkip) {
    original = savedVariations.Skip_EMI?.[editingKey];
  }
  const isEditing = Boolean(editingKey);

  const getRange = (i) => {
    if (isStep && isEditing && original) {
      return i >= +original.frm_month && i <= +original.to_month;
    }
    if (isSkip && isEditing && original) {
      const end = +original.skipfrm_month + +original.no_month - 1;
      return i >= +original.skipfrm_month && i <= end;
    }
    return false;
  };

  const options = Array.from({ length: totalInstallments }, (_, idx) => {
    const i = idx + 1;
    const withinRange = getRange(i);
    let disabled = false;

    if (!withinRange) {
      if (isStep) disabled = isOverlappingVariation(i, i, "Step_EMI", editingKey);
      else if (isSkip) disabled = isOverlappingVariation(i, i, "Skip_EMI", editingKey);
      else if (isBalloon) disabled = isOverlappingVariation(i, i, "BP", editingKey);
    }

    return {
      value: i.toString(),
      label: `Installment ${i}`,
      disabled,
      reason: disabled ? "Overlaps with existing variation" : "",
    };
  });

  return options;
};

const isOverlappingVariation = (
  fromInstallment,
  toInstallment,
  currentType,
  editingKey = null
) => {
  const ranges = {
    BP: (item) => {
      const month = parseInt(item.BPmonth);
      return { from: month, to: month };
    },
    Step_EMI: (item) => ({
      from: parseInt(item.frm_month),
      to: parseInt(item.to_month),
    }),
    Skip_EMI: (item) => {
      const start = parseInt(item.skipfrm_month);
      const months = parseInt(item.no_month);
      return { from: start, to: start + months - 1 };
    },
  };

  const getRange = ranges[currentType];
  if (!getRange) return false;

  // helper: check if two ranges overlap
  const isOverlap = (a1, a2, b1, b2) => !(a2 < b1 || a1 > b2);

  // reusable loop for checking overlaps
  const checkGroup = (groupType, skipSelf = false) => {
    const group = savedVariations[groupType] || {};

    const convert = ranges[groupType];

    for (const [key, item] of Object.entries(group)) {
      if (skipSelf && editingKey === key) continue;
      if (editingState.isEditing && editingState.key === key && editingState.type === groupType) continue;

      const { from: grpFrom, to: grpTo } = convert(item);

      if (isOverlap(fromInstallment, toInstallment, grpFrom, grpTo)) {
        return true;
      }
    }
    return false;
  };

  // 1️⃣ Same-type overlaps (skip current record)
  if (checkGroup(currentType, true)) return true;

  // 2️⃣ Other types overlaps
  const otherTypes = ["BP", "Step_EMI", "Skip_EMI"].filter(
    (t) => t !== currentType
  );

  for (const type of otherTypes) {
    if (checkGroup(type, false)) return true;
  }

  return false;
};

const getSkipCapitalOptions = () => {
  const skippartpay = variationDetails.Skip_EMI?.skippartpay;
  
  const baseOptions = [
    { value: "N", label: "No/Interest Free" },
    { value: "Y", label: "Yes/Interest Capitalized" },
    { value: "P", label: "Interest Payable" }
  ];
  
  if (skippartpay === "Y") {
    return [
      ...baseOptions,
      { value: "A", label: "Accumulative" },
      { value: "C", label: "Cumulative" }
    ];
  }
  
  return baseOptions;
};
const getButtonText = () => {
  const { tenor, emi } = formData;
  
  if (emi && (!tenor || Number(tenor) === 0)) {
    return "Calculate Tenor";
  } else if (tenor && (!emi || Number(emi) === 0)) {
    return "Calculate EMI";
  } else {
    return "Calculate EMI"; // default
  }
};

const handleEditVariation = (type, key, data) => {
  setEditingState({ isEditing: true, type, key });

  const updateAdjustIfNeeded = (adjustValue) => {
    if (adjustValue && adjustValue !== globalAdjust) {
      updateGlobalAdjust(adjustValue);
    }
  };

  const processors = {
    BP: () => {
      setVariationDetails({ BP: data });
      updateAdjustIfNeeded(data.BPadjust);
    },

    Step_EMI: () => {
      setVariationDetails({ Step_EMI: data });
      updateAdjustIfNeeded(data.stepadjust);
    },

    Skip_EMI: () => {
      const editedData =
        data.skippartpay === "N"
          ? {
              ...data,
              skippartialpay_in: "",
              skippartint: "",
            }
          : data;
      setVariationDetails({ Skip_EMI: editedData });
      updateAdjustIfNeeded(data.skipadjust);
    },

    BP_Lastpayamt: () => {
      setVariationDetails({ BP_Lastpayamt: data });
    },
  };
  // Execute the correct processor
  if (processors[type]) processors[type]();
  // Expansion map (removes repeated if statements)
  const expansionMap = {
    BP: setExpandedBP,
    Step_EMI: setExpandedStep,
    Skip_EMI: setExpandedSkip,
    BP_Lastpayamt: setExpandedLastPay,
  };
  // Trigger expansion
  expansionMap[type]?.(true);
};


const handleDeleteVariation = (type, key) => {
  setSavedVariations(prev => {
    if (type === 'BP_Lastpayamt') {
      return {
        ...prev,
        BP_Lastpayamt: 0
      };
    } else {
      return {
        ...prev,
        [type]: Object.keys(prev[type]).reduce((acc, currKey) => {
          if (currKey !== key) {
            acc[currKey] = prev[type][currKey];
          }
          return acc;
        }, {})
      };
    }
  });
  showSnackbar(`${key} deleted successfully!`, "success");
};

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const frequencies = [
    { value: 52, label: "Weekly(52)" },
    { value: 26, label: "Bi-Weekly(26)" },
    { value: 12, label: "Monthly(12)" },
    { value: 6, label: "Bi-Monthly(6)" },
    { value: 4, label: "Quarterly(4)" },
    { value: 2, label: "Half-Yearly(2)" },
    { value: 1, label: "Yearly(1)" },
    { value: 3, label: "Every 4 Months(3)" },
    { value: 365, label: "Daily(365)" },
  ];

  const tenorTypes = [
    { value: 0, label: "Years" },
    { value: 1, label: "Months" },
    { value: 4, label: "Installments" },
  ];

  useEffect(() => {
  // Only fetch if all required fields are present and not already fetched for these values
  if (
    formData.loan_amount &&
    formData.rate &&
    (formData.tenor || formData.emi)
  ) {
    // Optionally, debounce or check if values changed before calling
    (async () => {
      try {
        const payload = buildPayload();
        const response = await AxiosClient.post(
          `${BASE_URL}/amortschedule`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        setAmortData(response.data);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    })();
  }
}, [formData.loan_amount, formData.rate, formData.tenor, formData.emi]);

  const handleChange = (field, value) => {
  let validValue = value;

  switch (field) {
    case "loan_amount": {
      if (value > 5000000) {
        showSnackbar("Loan amount cannot exceed ₹50 Lacs");
        validValue = 5000000;
      }
      break;
    }

    case "tenor": {
      const tenorMax = getSliderConfig(formData.T_IN).max;
      if (value > tenorMax) {
        showSnackbar(`Tenor cannot exceed ${tenorMax}`);
        validValue = tenorMax;
      }
      break;
    }

    case "rate": {
      if (value > 35) {
        showSnackbar("Rate of Interest cannot exceed 35%");
        validValue = 35;
      }
      break;
    }

    default:
      break;
  }

  setFormData((prev) => ({ ...prev, [field]: validValue }));
};


  const handleClearEmiTenor = () => {
    setFormData((prev) => ({ ...prev, emi: "", tenor: "" }));
    setShowEmi(false);
  };

  const handleClearEmi = () => {
    setFormData((prev) => ({ ...prev }));
    setCalculatedEmi(null);
    setCalculatedTenor(null);
    setShowEmi(false);
  };

  const handleCalculateEmi = async () => {
  const { tenor, emi } = formData;

  const shouldCalculateTenor = emi && (!tenor || Number(tenor) === 0);
  const shouldCalculateEmi = tenor && (!emi || Number(emi) === 0);

  // ------------------------------------------
  // Helper: show both values entered warning
  // ------------------------------------------
  const warnBothEntered = () => {
    showSnackbar(
      <span>
        Both EMI and Tenor are already entered.{" "}
        <button
          type="button"
          onClick={handleClearEmiTenor}
          style={{
            color: "#4880FF",
            cursor: "pointer",
            fontWeight: 600,
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            textDecoration: "underline",
          }}
        >
          Clear
        </button>{" "}
        to calculate the other.
      </span>,
      "warning"
    );
  };

  if (!shouldCalculateTenor && !shouldCalculateEmi && emi && tenor) {
    warnBothEntered();
    return;
  }

  const buildRequiredFields = () => {
    const req = {
      loan_amount: "Loan Amount",
      rate: "Rate of Interest",
    };

    if (shouldCalculateTenor) req.emi = "EMI";
    if (shouldCalculateEmi) req.tenor = "Tenor";
    if (!shouldCalculateEmi && !shouldCalculateTenor) {
      req.tenor = "Tenor";
      req.emi = "EMI";
    }
    return req;
  };

  const validateFields = (required) => {
    const missing = Object.entries(required)
      .filter(([key]) => !formData[key] || Number(formData[key]) === 0)
      .map(([, label]) => label);

    if (missing.length === 0) return true;

    const target = shouldCalculateTenor ? "Tenor" : "EMI";
    const missingText = missing.join(" and ");

    showSnackbar(`Please enter ${missingText} to calculate ${target}.`, "error");
    return false;
  };

  const requiredFields = buildRequiredFields();
  if (!validateFields(requiredFields)) return;

  try {
    const payload = buildPayload();
    const response = await AxiosClient.post(
      `${BASE_URL}/amortschedule`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const data = response?.data;
    if (!Array.isArray(data) || data.length === 0) {
      showSnackbar("Backend did not return valid schedule data.");
      return;
    }

    if (shouldCalculateTenor) {
      setCalculatedTenor(data.length);
    } else {
      setCalculatedEmi(Number(data[0].EMI));
    }

    setShowEmi(true);
  } catch (error) {
    console.error("Error calculating:", error);
    const message = shouldCalculateTenor ? "Tenor" : "EMI";
    showSnackbar(`Something went wrong while calculating ${message}!`);
  }
};

  const handleGenerate = async () => {
  const { loan_amount, tenor, emi, rate } = formData;
  // ✅ Simplified validation
  const missingMandatory = !loan_amount || (!tenor && !emi) || !rate;
  if (missingMandatory) {
    showSnackbar("Please enter the mandatory details first.", "error");
    return;
  }
  try {
    const payload = buildPayload();
    console.log("Final payload sent:", payload);

    const { data } = await AxiosClient.post(
      `${BASE_URL}/amortschedule`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    setAmortData(data);
    setOpenAmortPopup(true);
    // ✅ Reduced nested branching
    if (data?.length > 0) {
      const firstEmi = Number(data[0].EMI);
      setCalculatedEmi(firstEmi);
      setShowEmi(false);
    } else {
      showSnackbar("Backend did not return valid schedule data.");
    }

  } catch (error) {
    console.error("Error calculating EMI:", error);
    // ✅ Inline smart extraction using optional chaining + nullish coalescing
    const errorData = error.response?.data;
    let errorMessage =
      (Array.isArray(errorData) && errorData[0]?.errorMessage) ??
      (typeof errorData === "object" && errorData?.errorMessage) ??
      (typeof errorData === "string" && errorData) ??
      (error.request
        ? "No response received from server. Please check your connection."
        : "Something went wrong while calculating EMI!");

    showSnackbar(errorMessage, "error");
  }
};


  const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(value); // Indian style (e.g. 50,00,000)
  };

  const getChangedModifiableDetails = () => {
  const changes = {};
  for (const key in modifiableDetails) {
    if (
      modifiableDetails[key] !== defaultModifiableDetails[key] &&
      modifiableDetails[key] !== "" && // ignore empty
      modifiableDetails[key] !== null // ignore null
    ) {
      changes[key] = modifiableDetails[key];
    }
  }
  return changes;
  };

  function getFieldLabel(fieldName) {
  for (const group of Object.values(formFields)) {
    const field = group.find((f) => f.name === fieldName);
    if (field) return field.label;
  }
  return fieldName;
  }

function getFieldValueLabel(fieldName, value) {
  for (const group of Object.values(formFields)) {
    const field = group.find((f) => f.name === fieldName);
    if (field && field.type === "select") {
      const opt = field.options.find((o) => String(o.value) === String(value));
      return opt ? opt.label : value;
    }
  }
  return value;
  }

function getVariationFieldValueLabel(fieldName, value) {
  for (const group of Object.values(variationFormFields)) {
    const field = group.find((f) => f.name === fieldName);
    if (field && field.type === "select") {
      const opt = field.options.find((o) => String(o.value) === String(value));
      return opt ? opt.label : value;
    }
  }
  return value;
}
const generateMarks = (min, max) => {
  return [
    { value: min, label: `${min}` },
    { value: max, label: `${max}` },
  ];
};

const getSliderColor = (value, min, max) => {
  const percent = (value - min) / (max - min); // 0 → 1
  // Teal (hsl(180, 80%, 40%)) → Indigo (hsl(275, 80%, 45%))
  const tealHue = 180;
  const indigoHue = 275;
  const hue = tealHue + (indigoHue - tealHue) * percent;
  return `hsl(${hue}, 80%, 45%)`;
};

const roiMarks = [
  { value: 1, label: "1%" },
  { value: 35, label: "35%" }
];

// Loan amount marks: min=10,000, mid=25 Lacs (2,500,000), max=50 Lacs (5,000,000)
const loanMarks = [
  { value: 0, label: "10,000" },
  { value: 5000000, label: "50 Lacs" },
];

// Function to get slider config based on T_IN
const getSliderConfig = (tenorIn) => {
  switch (tenorIn) {
    case 1: // Monthly
      return { max: 360, marks: generateMarks(1, 360) };
    case 4: // Installments
      return { max: 999, marks: generateMarks(1, 999) };
    case 0: // Yearly
      return { max: 30, marks: generateMarks(1, 30) };
    default:
      return { max: 120, marks: generateMarks(1, 120) }; 
  }
};
const sliderConfig = getSliderConfig(formData.T_IN);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            p: 3,
            mt: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 1100,
              borderRadius: 2,
              backgroundColor: "#fff",
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                mb: 3,
                pb: 1,
                borderBottom: "2px solid",
                borderColor: "secondary.main",
              }}
            >
              <Grid>
                <Typography variant="h5" color="secondary">
                  Repayment Schedule Engine
                </Typography>
              </Grid>

              <Grid>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  onClick={() => setOpenModifiableDetails(true)}
                >
                  Modifiable Details
                </Button>
                <ModifiableDetailsPopup
                  open={openModifiableDetails}
                  data={modifiableDetails}
                  onChange={setModifiableDetails}
                  onClose={() => setOpenModifiableDetails(false)}
                />
                  {!showEmi ? (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    startIcon={<Calculate />}
                    onClick={handleCalculateEmi}
                  >
                    {getButtonText()}
                  </Button>
                ) : (
                  <TextField
                    value={(()=>{
                      if(calculatedEmi){
                        return `EMI: ${calculatedEmi.toFixed(2)}`;
                      }
                      else if(calculatedTenor){
                        let unit;
                        if(formData.T_IN === 0){
                          unit = "years";
                        } else if(formData.T_IN === 1){
                          unit = "months";
                        } else {
                          unit = "installments";
                        }
                        return `Tenor: ${calculatedTenor} ${unit}`;
                      }
                      return "";
                    })()}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    InputProps={{ 
                      readOnly: true, 
                      endAdornment: ( 
                      <IconButton onClick={handleClearEmi} 
                        edge="end" 
                        size="small" 
                      >
                         ✕ 
                      </IconButton>
                      ), 
                      style: {
                      color: "#4880FF", 
                      fontWeight: 600,
                      }, 
                    }}
                    sx={{
                      width: 180,
                      "& .MuiOutlinedInput-root": {
                        height: 36,
                        "& fieldset": {
                          borderColor: "#4880FF",
                        },
                        "&:hover fieldset": {
                          borderColor: "#4880FF",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4880FF",
                        },
                      },
                    }}
                  />
                )}
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    onClick={() => {
                      setJsonPayload(buildPayload());
                      setOpenJsonPopup(true);
                    }}
                  >
                    Input JSON
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="medium"
                    startIcon={<TableChart />}
                    onClick={handleGenerate}
                  >
                    Generate
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
              {/* Row 1 */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <Slider
                  value={Number(formData.loan_amount) || 0}
                  onChange={(e, value) => handleChange("loan_amount", value)}
                  min={0}
                  max={5000000} // adjust max loan amount as needed
                  step={10000}
                  valueLabelDisplay="auto"
                  marks={loanMarks}
                  sx={{ width: "35%",mr: 2,
                    "& .MuiSlider-track": {
                      backgroundColor: getSliderColor(Number(formData.loan_amount) || 10000, 10000, 5000000),
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: getSliderColor(Number(formData.loan_amount) || 10000, 10000, 5000000),
                    },
                  }}
                />
                <TextField
                  size="small"
                  value={formatNumber(formData.loan_amount)} // show with commas
                  onChange={(e) => {
                    // Remove commas before saving raw value
                    const rawValue = e.target.value.replace(/,/g, "");
                    handleChange("loan_amount", rawValue);
                  }}
                  variant="outlined"
                  label="Loan Amount"
                  sx={{ width: "35%",ml: 2 }}
                  slotProps={{ input:{step: 5000, min: 0}, }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Slider
                  value={Number(formData.tenor) || 1}
                  onChange={(e, value) => handleChange("tenor", value)}
                  min={1}
                  max={sliderConfig.max}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={sliderConfig.marks}
                  sx={{ width: "35%", mr: 2, mt: 1,
                    "& .MuiSlider-track": {
                      backgroundColor: getSliderColor(Number(formData.tenor) || 1, 1, sliderConfig.max),
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: getSliderColor(Number(formData.tenor) || 1, 1, sliderConfig.max),
                    },
                   }}
                />
                <TextField
                  size="small"
                  value={formData.tenor}
                  onChange={(e) => handleChange("tenor", e.target.value)}
                  variant="outlined"
                  label="Tenor"
                  sx={{ width: "17.5%", ml: 2, mt: 1 }}
                  slotProps={{ input:{step: 1, min: 1}, }}
                />
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Tenor In"
                  value={formData.T_IN ?? 1} // default Monthly = 1
                  onChange={(e) => handleChange("T_IN", Number(e.target.value))}
                  slotProps={{
                    input: {
                    tabIndex: -1, // disable tab focus
                    },
                  }}
                  sx={{ width: "16%", ml: 2, mt: 1 }}
                >
                  {tenorTypes.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Slider
                  value={Number(formData.rate) || 1}
                  onChange={(e, value) => handleChange("rate", value)}
                  min={1}
                  max={35}
                  step={0.01}
                  marks={roiMarks}
                  valueLabelDisplay="auto"
                  sx={{ width: "35%",mr: 2, mt: 1,
                    "& .MuiSlider-track": {
                      backgroundColor: getSliderColor(Number(formData.rate) || 1, 1, 35),
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: getSliderColor(Number(formData.rate) || 1, 1, 35),
                    },
                   }}
                />
                 <TextField
                    fullWidth
                    required
                    size="small"
                    label="Rate of Interest(in %)"
                    value={formData.rate}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers and decimals
                      if (value === "" || /^(\d{0,2})(\.\d{0,5})?$/.test(value)) {
                        handleChange("rate", value);
                      }
                    }}
                    variant="outlined"
                    slotProps={{
                      input: {
                        inputMode: "decimal",
                        pattern: "\\d{0,2}(\\.\\d{0,5})?",
                        min: 0,
                        max: 35,
                        step: 0.01,
                      },
                    }}
                    sx={{
                      "& input": { textAlign: "left" },
                      width: "15%", ml: 2, mt: 1
                    }}
                  /> 
                  <TextField
                  fullWidth
                  required={!formData.tenor} // required only if Tenor is empty
                  size="small"
                  label="EMI"
                  type="number"
                  value={formData.emi}
                  onChange={(e) => handleChange("emi", e.target.value)}
                  variant="outlined"
                  disabled={!!formData.tenor} // disable if Tenor entered
                  sx={{ width: "18.5%", ml: 2, mt: 1 }}
                />               
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl variant="outlined" sx={{ minWidth: 170 }}>
                  <TextField
                    select
                    size="small"
                    label="Frequency"
                    value={formData.frequency}
                    defaultValue="12"
                    required
                    onChange={(e) => handleChange("frequency", e.target.value)}
                    variant="outlined"
                    sx={{ width: "220px", mt: 1 }}
                    slotProps={{
                      select: {
                        MenuProps: {
                          PaperProps: {
                            style: { maxHeight: 300 },
                          },
                        },
                      },
                    }}
                  >
                    {frequencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
                <DatePicker
                  label="Disbursement Date"
                  value={formData.DOD}
                  required
                  format="DD-MMM-YYYY"
                  onChange={(newValue) => handleChange("DOD", newValue)}
                  sx={{ width: "24%", ml: 2, mt: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      size: "small",
                    },
                  }}
                />
                <DatePicker
                  required
                  format="DD-MMM-YYYY"
                  label="Installment Start Date"
                  value={formData.DOC}
                  onChange={(newValue) => handleChange("DOC", newValue)}
                  sx={{ width: "24%", ml: 2, mt: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      size: "small",
                    },
                  }}
                />
              </Grid>

            {/* Buttons */}
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2, borderColor: "#4880FF" }} />                
              {/* Modifiable Details Summary */}
              {Object.keys(getChangedModifiableDetails()).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box 
                  sx={{ 
                    width: "95%",
                    border: "1px solid rgb(245, 247, 250)",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    mb: 2,
                    background: "rgb(245, 247, 250)",
                    "&:hover": { background: "#E3F0FF" },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                  onClick={() => setExpandedModifiableDetails(!expandedModifiableDetails)}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#4880FF",
                      fontSize: 18,
                      letterSpacing: 0.5,
                    }}
                  >
                    Modifiable Details Summary
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModifiableDetails(defaultModifiableDetails);
                      }}
                      sx={{ minWidth: 90 }}
                    >
                      Reset
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedModifiableDetails(!expandedModifiableDetails);
                      }}
                      sx={{
                        backgroundColor: "#4880FF",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#3669CC",
                        },
                      }}
                    >
                      {expandedModifiableDetails ? 
                        <KeyboardArrowUp /> : 
                        <KeyboardArrowDown />
                      }
                    </IconButton>
                  </Box>
                </Box>

                {/* Expandable Content */}
                {expandedModifiableDetails && (
                  <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, mt: 1, width: "95%" }}>
                    {(() => {
                      const entries = Object.entries(getChangedModifiableDetails());
                      const columns = 4;
                      const rows = Math.ceil(entries.length / columns);
                      const grid = Array.from({ length: columns }, (_, colIdx) =>
                        Array.from({ length: rows }, (_, rowIdx) => {
                          const entryIdx = rowIdx + colIdx * rows;
                          return entries[entryIdx];
                        })
                      );
                      return (
                        <Grid container spacing={2}>
                          {grid.map((col) => (
                            <Grid key={col[0]?.id || col[0]?.name} size={12 / columns}>
                              {col.map(
                                (pair) =>
                                  pair && (
                                    <Box
                                      key={pair.id || pair.name}
                                      sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}
                                    >
                                      <Typography sx={{ fontWeight: 550 }}>
                                        {getFieldLabel(pair[0])} :
                                      </Typography>
                                      <Typography>{getFieldValueLabel(pair[0], pair[1])}</Typography>
                                    </Box>
                                  )
                              )}
                            </Grid>
                          ))}
                        </Grid>
                      );
                    })()}
                  </Paper>
                )}
              </Box>
            )}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  width: "95%",
                  border: "1px solid rgb(245, 247, 250)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  mb: 2,
                  background: "rgb(245, 247, 250)",
                  "&:hover": { background: "#E3F0FF" }
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#4880FF",
                      fontSize: 18,
                      letterSpacing: 0.5,
                    }}
                  >
                    Variation Details
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 'auto' }}>
                    {/* Variation Type Dropdown */}
                    <TextField
                      fullWidth
                      size="small"
                      label="Variation Type"
                      sx={{ width: "240px", mr: 1 }}
                      select
                      value={selectedVariationType || ""}
                      onChange={(e) => setSelectedVariationType(e.target.value)}
                    >
                      <MenuItem value="All Variations">All Variations</MenuItem>
                      <MenuItem value="BP">Balloon Payments (BP)</MenuItem>
                      <MenuItem value="Step_EMI">Step EMI</MenuItem>
                      <MenuItem value="Skip_EMI">Skip EMI</MenuItem>
                      <MenuItem value="BP_Lastpayamt">Bullet Amount</MenuItem>
                    </TextField>
                    <TextField
                      fullWidth
                      size="small"
                      label="Adjustment Method"
                      sx={{ width: "150px", mr: 1 }}
                      select
                      value={globalAdjust}
                      onChange={(e) => updateGlobalAdjust(e.target.value)}
                    >
                      <MenuItem value="0">Adjusted EMI</MenuItem>
                      <MenuItem value="1">Adjust EMI</MenuItem>
                      <MenuItem value="2">Adjust Tenor</MenuItem>
                    </TextField>
                  </Box>
                  <IconButton
                    onClick={() => setExpandedVariation(!expandedVariation)}
                    sx={{
                      backgroundColor: "#4880FF",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": {
                        backgroundColor: "#3669CC",
                      },
                    }}
                  >
                    {expandedVariation ? 
                      <KeyboardArrowUp sx={{ fontSize: 20 }} /> : 
                      <KeyboardArrowDown sx={{ fontSize: 20 }} />
                    }
                  </IconButton>
                </Box>                
              </Box>

              {/* Expanded Variation Details Content */}
              {expandedVariation && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2 }}> 
                  
                  {/* Dynamic Variation Fields based on selection */}
                  {selectedVariationType && (
                    <Box sx={{ mb: 3 }}>
                      {/* Balloon Payments Section */}
                      {selectedVariationType === "BP" && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h7" sx={{ fontWeight: 600, color: "#4880FF" }}>
                              Balloon Payments (BP)
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {hasBPData && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={clearBPData}
                                >
                                  Clear
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={saveBPData}
                                disabled={!hasBPData}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                          
                          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                            <TextField
                              fullWidth
                              select
                              size="small"
                              label="BP Installment"
                              sx={{ mr: 1, width: "25%" }}
                              value={variationDetails.BP?.BPmonth || ""}
                              onChange={(e) => {
                                updateBPData("BPmonth", e.target.value);
                                const installment = parseInt(e.target.value);
                                if (installment && isOverlappingVariation(installment, installment, 'BP', editingState.key)) {
                                  showSnackbar(`Installment ${installment} already has another variation`, "warning");
                                }
                                checkBPData();
                              }}
                            >
                              {getInstallmentOptions('BP', null, null, editingState.key).map(option => (
                                <MenuItem 
                                  key={option.value} 
                                  value={option.value}
                                  disabled={option.disabled}
                                  sx={{
                                    ...(option.disabled && {
                                      color: 'text.disabled',
                                      backgroundColor: 'action.disabledBackground'
                                    })
                                  }}
                                >
                                  {option.label}
                                  {option.disabled && " (Overlapping)"}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              fullWidth
                              size="small"
                              label="BP Amount"
                              type="text"
                              sx={{ mr: 1, width: "25%" }}
                              value={variationDetails.BP?.BPAmount || ""}
                              onChange={(e) => {
                                updateBPData("BPAmount", e.target.value);
                                checkBPData();
                              }}
                            />
                          </Grid>
                        </Box>
                      )}

                      {/* Step EMI Section */}
                      {selectedVariationType === "Step_EMI" && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h7" sx={{ fontWeight: 600, color: "#4880FF" }}>
                              Step EMI
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {hasStepData && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearStepData();
                                  }}
                                >
                                  Clear
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={saveStepData}
                                disabled={!hasStepData}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                          
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                select
                                size="small"
                                label="Step Mode"
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Step_EMI?.stepmode || ""}
                                onChange={(e) => {
                                  updateStepData("stepmode", e.target.value);
                                  checkStepData();
                                }}
                              >
                                <MenuItem value="0">Step Up</MenuItem>
                                <MenuItem value="1">Step Down</MenuItem>
                              </TextField>
                              <TextField
                                fullWidth
                                size="small"
                                label="Step Basis"
                                select
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Step_EMI?.stepbasis || ""}
                                onChange={(e) => {
                                  updateStepData("stepbasis", e.target.value);
                                  checkStepData();
                                }}
                              >
                                <MenuItem value="0">Amount</MenuItem>
                                <MenuItem value="1">Percentage</MenuItem>
                                <MenuItem value="2">Step Absolute</MenuItem>
                                <MenuItem value="3">Step Principal</MenuItem>
                              </TextField>
                              <TextField
                                fullWidth
                                size="small"
                                label="Step By"
                                type="text"
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Step_EMI?.stepby || ""}
                                onChange={(e) => {
                                  updateStepData("stepby", e.target.value);
                                  checkStepData();
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                select
                                size="small"
                                label="From Installment"
                                sx={{ mr: 1, width: "25%", mt: 2 }}
                                value={variationDetails.Step_EMI?.frm_month || ""}
                                onChange={(e) => {
                                  updateStepData("frm_month", e.target.value);
                                  const from = parseInt(e.target.value);
                                  const to = parseInt(variationDetails.Step_EMI?.to_month);
                                  if (from && to && from > to) {
                                    // Auto-adjust to installment if from > to
                                    updateStepData("to_month", e.target.value);
                                  }
                                  if (from && to && isOverlappingVariation(from, to, 'Step_EMI', editingState.key)) {
                                    showSnackbar(`Installments ${from}-${to} overlap with another variation`, "warning");
                                  }
                                  checkStepData();
                                }}
                              >
                                {getInstallmentOptions('Step_EMI', 
                                  variationDetails.Step_EMI?.frm_month, 
                                  variationDetails.Step_EMI?.to_month, 
                                  editingState?.key || null
                                ).map(option => (
                                  <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                    disabled={option.disabled}
                                    sx={{
                                      ...(option.disabled && {
                                        color: 'text.disabled',
                                        backgroundColor: 'action.disabledBackground'
                                      })
                                    }}
                                  >
                                    {option.label}
                                    {option.disabled && " (Overlapping)"}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <TextField
                                fullWidth
                                select
                                size="small"
                                label="To Installment"
                                sx={{ mr: 1, width: "25%", mt: 2 }}
                                value={variationDetails.Step_EMI?.to_month || ""}
                                onChange={(e) => {
                                  updateStepData("to_month", e.target.value);
                                  const from = parseInt(variationDetails.Step_EMI?.frm_month);
                                  const to = parseInt(e.target.value);
                                  if (from && to && isOverlappingVariation(from, to, 'Step_EMI', editingState.key)) {
                                    showSnackbar(`Installments ${from}-${to} overlap with another variation`, "warning");
                                  }
                                  checkStepData();
                                }}
                              >
                                {getInstallmentOptions('Step_EMI', 
                                  variationDetails.Step_EMI?.frm_month, 
                                  variationDetails.Step_EMI?.to_month, 
                                  editingState?.key || null
                                ).map(option => {
                                  const from = parseInt(variationDetails.Step_EMI?.frm_month);
                                  const disabled = !from || parseInt(option.value) < from || option.disabled;
                                  
                                  return (
                                    <MenuItem 
                                      key={option.value} 
                                      value={option.value}
                                      disabled={disabled}
                                      sx={{
                                        ...(disabled && {
                                          color: 'text.disabled',
                                          backgroundColor: 'action.disabledBackground'
                                        })
                                      }}
                                    >
                                      {option.label}
                                      {disabled && from && parseInt(option.value) < from ? (
                                        <span> (Must be ≥ From)</span>
                                      ) : null}
                                      {disabled && option.disabled ? (
                                        <span> (Overlapping)</span>
                                      ) : null}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </Grid>
                          </Box>
                      )}

                      {/* Skip EMI Section */}
                      {selectedVariationType === "Skip_EMI" && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h7" sx={{ fontWeight: 600, color: "#4880FF" }}>
                              Skip EMI
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {hasSkipData && (
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={clearSkipData}
                                >
                                  Clear
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={saveSkipData}
                                disabled={!hasSkipData}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                          
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                select
                                size="small"
                                label="From Installment"
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Skip_EMI?.skipfrm_month || ""}
                                onChange={(e) => {
                                  updateSkipData("skipfrm_month", e.target.value);
                                  const from = parseInt(e.target.value);
                                  const months = parseInt(variationDetails.Skip_EMI?.no_month);
                                  if (from && months) {
                                    const to = from + months - 1;
                                    if (isOverlappingVariation(from, to, 'Skip_EMI', editingState.key)) {
                                      showSnackbar(`Installments ${from}-${to} overlap with another variation`, "warning");
                                    }
                                  }
                                  checkSkipData();
                                }}
                              >
                                {getInstallmentOptions('Skip_EMI', 
                                  variationDetails.Skip_EMI?.skipfrm_month, 
                                  variationDetails.Skip_EMI?.no_month, 
                                  editingState.key
                                ).map(option => (
                                  <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                    disabled={option.disabled}
                                    sx={{
                                      ...(option.disabled && {
                                        color: 'text.disabled',
                                        backgroundColor: 'action.disabledBackground'
                                      })
                                    }}
                                  >
                                    {option.label}
                                    {option.disabled && " (Overlapping)"}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <TextField
                                fullWidth
                                size="small"
                                label="No. of Months"
                                type="number"
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Skip_EMI?.no_month || ""}
                                onChange={(e) => {
                                  updateSkipData("no_month", e.target.value);
                                  const from = parseInt(variationDetails.Skip_EMI?.skipfrm_month);
                                  const months = parseInt(e.target.value);
                                  if (from && months) {
                                    const to = from + months - 1;
                                    const totalInstallments = getTotalInstallments();
                                    if (to > totalInstallments) {
                                      showSnackbar(`Skip period exceeds total tenor of ${totalInstallments} months`, "warning");
                                    } else if (isOverlappingVariation(from, to, 'Skip_EMI', editingState.key)) {
                                      showSnackbar(`Installments ${from}-${to} overlap with another variation`, "warning");
                                    }
                                  }
                                  checkSkipData();
                                }}
                                slotProps={{ input:{min: 1, max: formData.tenor}, }}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                label="Skip Part Pay"
                                select
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.Skip_EMI?.skippartpay || ""}
                                onChange={(e) => {
                                  const newSkippartpay = e.target.value;
                                  const currentData = variationDetails.Skip_EMI || {};                               
                                  let updatedData = {
                                    ...currentData,
                                    skippartpay: newSkippartpay
                                  };                                
                                  if (newSkippartpay === "N") {
                                    updatedData = {
                                      ...updatedData,
                                      skippartialpay_in: "",
                                      skippartint: ""
                                    };
                                  }                                
                                  setVariationDetails(prev => ({
                                    ...prev,
                                    Skip_EMI: updatedData
                                  }));                                
                                  checkSkipData();
                                }}
                              >
                                <MenuItem value="N">No</MenuItem>
                                <MenuItem value="Y">Yes</MenuItem>
                              </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Skip Capital"
                                select
                                sx={{ mr: 1, width: "25%", mt: 2 }}
                                value={variationDetails.Skip_EMI?.skipcapital || ""}
                                onChange={(e) => {
                                  updateSkipData("skipcapital", e.target.value);
                                  checkSkipData();
                                }}
                              >
                                {getSkipCapitalOptions().map(option => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                              {/* Conditional fields for Skip Part Pay */}
                              {variationDetails.Skip_EMI?.skippartpay === "Y" && (
                              <>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Skip Part Pay In"
                                    select
                                    sx={{ mr: 1, width: "25%", mt: 2 }}
                                    value={variationDetails.Skip_EMI?.skippartialpay_in || ""}
                                    onChange={(e) => {
                                      updateSkipData("skippartialpay_in", e.target.value);
                                      checkSkipData();
                                    }}
                                  >
                                    <MenuItem value="P">Percentage</MenuItem>
                                    <MenuItem value="A">Amount</MenuItem>
                                  </TextField>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Skip Part Pay Interest"
                                    type="text"
                                    sx={{ mr: 1, width: "25%", mt: 2 }}
                                    value={variationDetails.Skip_EMI?.skippartint || ""}
                                    onChange={(e) => {
                                      updateSkipData("skippartint", e.target.value);
                                      checkSkipData();
                                    }}
                                  />
                              </>
                            )}
                            </Grid>
                        </Box>
                      )}

                      {/* BP Last Payment Amount Section */}
                      {selectedVariationType === "BP_Lastpayamt" && (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h7" sx={{ fontWeight: 600, color: "#4880FF" }}>
                              BP Last Payment Amount
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {hasLastPayData && (
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={clearLastPayData}
                                >
                                  Clear
                                </Button>
                              )}
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={saveLastPayData}
                                disabled={!hasLastPayData}
                              >
                                Save
                              </Button>
                            </Box>
                          </Box>
                          
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                              <TextField
                                fullWidth
                                size="small"
                                label="BP Last Pay Amount"
                                type="text"
                                sx={{ mr: 1, width: "25%" }}
                                value={variationDetails.BP_Lastpayamt || ""}
                                onChange={(e) => {
                                  setVariationDetails(prev => ({
                                    ...prev,
                                    BP_Lastpayamt: e.target.value
                                  }));
                                  checkLastPayData();
                                }}
                              />
                            </Grid>
                        </Box>
                      )}
                    </Box>
                  )}
                  {/* Saved Variations - Show filtered data based on selection */}                  
                  {/* Balloon Payments Table - Show when selected or when showing all */}
                  {(selectedVariationType === "All Variations" || selectedVariationType === "BP") && Object.keys(savedVariations.BP || {}).length > 0 && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="h7" sx={{ fontWeight: 600, mb: 2, color: "#4880FF" }}>
                        Saved Balloon Payments
                      </Typography>
                      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Record</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>BP Adjust</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>BP Installment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>BP Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(savedVariations.BP).map(([key, bpData]) => (
                                <TableRow key={key} hover>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("BPadjust", bpData.BPadjust)}</TableCell>
                                  <TableCell>{bpData.BPmonth}</TableCell>
                                  <TableCell>{bpData.BPAmount}</TableCell>
                                  <TableCell sx={{ width: '80px' }}>
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => {
                                        handleEditVariation('BP', key, bpData);
                                        setSelectedVariationType("BP"); // Switch to BP variation
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteVariation('BP', key)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  )}

                  {/* Step EMI Table - Show when selected or when showing all */}
                  {(selectedVariationType === "All Variations" || selectedVariationType === "Step_EMI") && Object.keys(savedVariations.Step_EMI || {}).length > 0 && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="h7" sx={{ fontWeight: 600, mb: 1, color: "#4880FF" }}>
                        Saved Step EMI
                      </Typography>
                      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Record</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Step Mode</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Step Adjust</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Step Basis</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Step By</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>From Installment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>To Installment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(savedVariations.Step_EMI).map(([key, stepData]) => (
                                <TableRow key={key} hover>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("stepmode", stepData.stepmode)}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("stepadjust", stepData.stepadjust)}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("stepbasis", stepData.stepbasis)}</TableCell>
                                  <TableCell>{stepData.stepby}</TableCell>
                                  <TableCell>{stepData.frm_month}</TableCell>
                                  <TableCell>{stepData.to_month}</TableCell>
                                  <TableCell sx={{ width: '80px' }}>
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => {
                                        handleEditVariation('Step_EMI', key, stepData);
                                        setSelectedVariationType("Step_EMI"); // Switch to Step EMI variation
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteVariation('Step_EMI', key)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  )}

                  {/* Skip EMI Table - Show when selected or when showing all */}
                  {(selectedVariationType === "All Variations" || selectedVariationType === "Skip_EMI") && Object.keys(savedVariations.Skip_EMI || {}).length > 0 && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="h7" sx={{ fontWeight: 600, mb: 1, color: "#4880FF" }}>
                        Saved Skip EMI
                      </Typography>
                      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Record</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Skip Adjust</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>From Installment</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>No. of Months</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Skip Part Pay</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Skip Capital</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Skip Part Pay In</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Skip Part Pay Interest</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(savedVariations.Skip_EMI).map(([key, skipData]) => (
                                <TableRow key={key} hover>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("skipadjust", skipData.skipadjust)}</TableCell>
                                  <TableCell>{skipData.skipfrm_month}</TableCell>
                                  <TableCell>{skipData.no_month}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("skippartpay", skipData.skippartpay)}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("skipcapital", skipData.skipcapital)}</TableCell>
                                  <TableCell>{getVariationFieldValueLabel("skippartialpay_in", skipData.skippartialpay_in)}</TableCell>
                                  <TableCell>{skipData.skippartint}</TableCell>
                                  <TableCell sx={{ width: '80px' }}>
                                    <IconButton 
                                      size="small" 
                                      color="primary"
                                      onClick={() => {
                                        handleEditVariation('Skip_EMI', key, skipData);
                                        setSelectedVariationType("Skip_EMI"); // Switch to Skip EMI variation
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                      size="small" 
                                      color="error"
                                      onClick={() => handleDeleteVariation('Skip_EMI', key)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  )}

                  {/* BP Last Payment - Show when selected or when showing all */}
                  {(selectedVariationType === "All Variations" || selectedVariationType === "BP_Lastpayamt") && savedVariations.BP_Lastpayamt !== undefined && savedVariations.BP_Lastpayamt !== null && savedVariations.BP_Lastpayamt !== 0 && (
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="h7" sx={{ fontWeight: 600, mb: 1, color: "#4880FF" }}>
                        Saved BP Last Payment
                      </Typography>
                      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 1 }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>BP Last Pay Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow hover>
                                <TableCell>{savedVariations.BP_Lastpayamt}</TableCell>
                                <TableCell sx={{ width: '80px' }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => {
                                      handleEditVariation('BP_Lastpayamt', 'R1', savedVariations.BP_Lastpayamt);
                                      setSelectedVariationType("BP_Lastpayamt"); // Switch to BP Last Payment variation
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteVariation('BP_Lastpayamt', 'R1')}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <AmortPopup
              open={openAmortPopup}
              onClose={() => setOpenAmortPopup(false)}
              data={amortData}
              tenor={formData.tenor}
              roi={formData.rate}
              tenorIn={
                tenorTypes.find((t) => t.value === Number(formData.T_IN))
                  ?.label || ""
              }
              variations={savedVariations}
            />
            <Dialog
              open={openJsonPopup}
              onClose={() => setOpenJsonPopup(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Input JSON Payload</DialogTitle>
              <DialogContent dividers>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    maxHeight: 350,
                    overflow: "auto",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {JSON.stringify(jsonPayload, null, 2)}
                  </pre>
                </Paper>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenJsonPopup(false)}
                  color="secondary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Box>
      </LocalizationProvider>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
