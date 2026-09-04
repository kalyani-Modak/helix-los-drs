import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import { Button, alpha, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { HAxiosService, HBox, HButtonBar, HDatePicker, HDropdown, HLabel, HPaper, HTextField, HTextarea, useToast } from "@helix/component-library";

import { handleValidationErrors } from "./ValidationUtils.jsx";
import { CollateralAPI } from "./apiEndpoints.jsx";
import FunctionLayout from "./FunctionLayout.jsx";
import { useLocation } from "react-router-dom";

const COLLATERAL_TYPES = [
  {
    value: "invoice",
    code: "INVOICE",
    label: { id: "label.collateraldetails.invoice", defaultMessage: "Invoice" },
    title: { id: "label.collateraldetails.invoiceDetails", defaultMessage: "Invoice details" },
    icon: DescriptionOutlinedIcon,
  },
  {
    value: "insurance",
    code: "INSU",
    label: { id: "label.collateraldetails.insurance", defaultMessage: "Insurance" },
    title: { id: "label.collateraldetails.insuranceDetails", defaultMessage: "Insurance Details" },
    icon: ShieldOutlinedIcon,
  },
  {
    value: "share",
    code: "SHARE",
    label: { id: "label.collateraldetails.shares", defaultMessage: "Shares" },
    title: { id: "label.collateraldetails.sharesDetails", defaultMessage: "Shares Details" },
    icon: ShowChartOutlinedIcon,
  },
  {
    value: "pdc",
    code: "PDC",
    label: { id: "label.collateraldetails.pdc", defaultMessage: "Post Dated Cheque" },
    title: { id: "label.collateraldetails.pdcDetails", defaultMessage: "Post Dated Cheque Details" },
    icon: CreditCardOutlinedIcon,
  },
  {
    value: "rcbook",
    code: "RCBOOK",
    label: { id: "label.collateraldetails.rcbook", defaultMessage: "RC Book" },
    title: { id: "label.collateraldetails.rcbookDetails", defaultMessage: "RC Book Details" },
    icon: DirectionsCarOutlinedIcon,
  },
  {
    value: "dpn",
    code: "DPN",
    label: { id: "label.collateraldetails.promissoryNote", defaultMessage: "Promissory Note" },
    title: { id: "label.collateraldetails.promissoryNoteDetails", defaultMessage: "Promissory Note Details" },
    icon: ArticleOutlinedIcon,
  },
];

const decimalFields = new Set([
  "bdValuation",
  "bdlPaymntAmt",
  "bdShareMarketValue",
  "bdShareValue",
]);

function toDecimal(value) {
  if (value == null || value === "") return undefined;
  const numericValue = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function normalizePayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}

function formatDropdownLabel(intl, label, value) {
  const fallback = label && !String(label).startsWith("label.")
    ? label
    : String(value || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!label) return fallback;

  return String(label).startsWith("label.")
    ? intl.formatMessage({ id: label, defaultMessage: fallback })
    : label;
}

function mapSystemParamOptions(items, intl) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const value = item?.szCondition ?? item?.szcondition ?? item?.value ?? "";
      const label = item?.szDesc ?? item?.szdesc ?? item?.szi18nDesc ?? item?.szi18ndesc ?? value;

      return value ? { value, label: formatDropdownLabel(intl, label, value) } : null;
    })
    .filter(Boolean);
}

function mapReasonOptions(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const value = item?.szCondition ?? item?.szcondition ?? "";
      const label = item?.szDesc ?? item?.szdesc ?? value;

      return value ? { value, label } : null;
    })
    .filter(Boolean);
}

function CollateralTypeButton({ option, selected, onClick }) {
  const theme = useTheme();
  const intl = useIntl();
  const Icon = option.icon;
  const label = typeof option.label === "object"
    ? intl.formatMessage(option.label)
    : option.label;

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={<Icon sx={{ fontSize: 16 }} />}
      sx={{
        justifyContent: "flex-start",
        minHeight: 38,
        borderRadius: 1,
        px: 1.4,
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
        textTransform: "none",
        color: selected ? "primary.main" : "text.primary",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.06) : "background.paper",
        boxShadow: selected ? `0 0 0 1px ${theme.palette.primary.main}` : "none",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        },
        "& .MuiButton-startIcon": {
          mr: 1,
          color: selected ? "primary.main" : "text.secondary",
        },
      }}
    >
      {label}
    </Button>
  );
}

function FieldLabel({ label, required }) {
  return (
    <HLabel
      value={label}
      translate={false}
      required={required}
      align="left"
      colon={false}
      sx={{ mb: 0.65, fontSize: 11, fontWeight: 600, color: "text.primary" }}
    />
  );
}

function CollateralField({ field, value, onChange, error }) {
  const width = "100%";

  return (
    <HBox
      sx={{
        background: "transparent",
        minWidth: 0,
        gridColumn: {
          xs: "span 1",
          md: field.span ? `span ${field.span}` : "span 1",
        },
      }}
    >
      <FieldLabel label={field.label} required={field.required} />
      {field.type === "select" && (
        <HDropdown
          name={field.name}
          value={value || ""}
          options={field.options || []}
          width={width}
          placeholder="Select..."
          error={error}
          onChange={(event) => onChange(field.name, event.target.value)}
        />
      )}
      {field.type === "date" && (
        <HDatePicker
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange(field.name, newValue ? newValue.format("YYYY-MM-DD") : "")}
          width={width}
          error={error}
        />
      )}
      {field.type === "textarea" && (
        <HTextarea
          value={value || ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          width={width}
          maxLines={3}
          maxLength={500}
          error={error}
        />
      )}
      {!field.type && (
        <HTextField
          editable
          value={value || ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          width={width}
          error={error}
        />
      )}
      {(field.type === "number" || field.type === "currency") && (
        <HTextField
          editable
          type={field.type}
          value={value || ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          width={width}
          error={error}
        />
      )}
    </HBox>
  );
}

export default function CollateralDetails() {
  const intl = useIntl();
  const toast = useToast();
  const { selectedRow } = useSelector((state) => state.account);
  const [selectedType, setSelectedType] = useState("");
  const [formDataByType, setFormDataByType] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [levelOptions, setLevelOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const selectedOption = useMemo(
    () => COLLATERAL_TYPES.find((option) => option.value === selectedType),
    [selectedType],
  );
  
  const selectedFormData = useMemo(
    () => formDataByType[selectedType] || {},
    [formDataByType, selectedType],
  );

  const handleFieldChange = (fieldName, value) => {
    // Clear the error for this field as soon as the user starts filling it in
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    setFormDataByType((prev) => ({
      ...prev,
      [selectedType]: {
        ...(prev[selectedType] || {}),
        [fieldName]: value,
      },
    }));
  };

  useEffect(() => {
    HAxiosService.GET(`${CollateralAPI.Collaterals(screenMenuId)}`)
      .then((res) => {
        if (res?.data?.status === "Success") {
          const responseData = res.data.responseJson || res.data.responsejson || {};

          setLevelOptions(
            mapSystemParamOptions(responseData.collateralLevel, intl)
          );
          setReasonOptions(
            mapReasonOptions(responseData.collateralReason)
          );
        } else {
          setLevelOptions([]);
          setReasonOptions([]);
        }
      })
      .catch((err) => console.error("Error fetching collateral options", err));
  }, [intl]);

  const commonFields = useMemo(() => [
    { name: "szAcLevel",       label: intl.formatMessage({id: "label.collateraldetails.level", defaultMessage: "Level"}),  type: "select", options: levelOptions },
    { name: "bdValuation",     label: intl.formatMessage({id: "label.collateraldetails.currencyvalue", defaultMessage: "Currency Value"}),  type: "currency" },
    { name: "dtEffectiveDate", label: intl.formatMessage({id: "label.collateraldetails.effdate", defaultMessage: "Effective Date"}), type: "date" },
    { name: "szReason",        label: intl.formatMessage({id: "label.collateraldetails.reason", defaultMessage: "Reason"}), type: "select", options: reasonOptions },
    { name: "szAddInf",        label: intl.formatMessage({id: "label.collateraldetails.addinfo", defaultMessage: "Additional Info"}) },
    { name: "szRemark",        label: intl.formatMessage({id: "label.collateraldetails.remarks", defaultMessage: "Remarks"}), type: "textarea", span: 3 },
  ], [levelOptions, reasonOptions]);

  const FORM_CONFIG = useMemo(() => ({
    invoice: [
      { name: "szDocNo",       label: intl.formatMessage({id: "label.collateraldetails.invoiceNo", defaultMessage: "Invoice No"}),          required: true },
      { name: "szDocDesc",     label: intl.formatMessage({id: "label.collateraldetails.invoiceDesc", defaultMessage: "Invoice Description"}), required: true },
      { name: "bdlPaymntAmt",  label: intl.formatMessage({id: "label.collateraldetails.invoiceAmt", defaultMessage: "Invoice Amount"}),      type: "currency" },
      ...commonFields,
    ],
    insurance: [
      { name: "szDocNo",            label: intl.formatMessage({id: "label.collateraldetails.policyNo", defaultMessage: "Policy No"}),             required: true },
      { name: "szDocDesc",          label: intl.formatMessage({id: "label.collateraldetails.desc", defaultMessage: "Description"}),           required: true },
      { name: "dtValuation",        label: intl.formatMessage({id: "label.collateraldetails.valuationDate", defaultMessage: "Valuation Date"}),        type: "date" },
      { name: "szValuer",           label: intl.formatMessage({id: "label.collateraldetails.valuer", defaultMessage: "Valuer"}) },
      { name: "szValuerType",       label: intl.formatMessage({id: "label.collateraldetails.valuerType", defaultMessage: "ValuerType"}) },
      { name: "dtDocStatus",        label: intl.formatMessage({id: "label.collateraldetails.docStatusDate", defaultMessage: "Document Status Date"}),  type: "date" },
      { name: "szFinanceInstitute", label: intl.formatMessage({id: "label.collateraldetails.finInstitute", defaultMessage: "Finance Institute"}) },
      ...commonFields,
    ],
    share: [
      { name: "szDocNo",           label: intl.formatMessage({id: "label.collateraldetails.certificateNo", defaultMessage: "Certificate No"}),      required: true },
      { name: "szDocDesc",         label: intl.formatMessage({id: "label.collateraldetails.desc", defaultMessage: "Description"}),         required: true },
      { name: "bdShareMarketValue",label: intl.formatMessage({id: "label.collateraldetails.shareMarketValue", defaultMessage: "Share Market Value"}),  type: "currency" },
      { name: "szShareQuantity",   label: intl.formatMessage({id: "label.collateraldetails.noOfShares", defaultMessage: "No of Shares"}),        type: "number" },
      { name: "szShareType",       label: intl.formatMessage({id: "label.collateraldetails.sharetype", defaultMessage: "Share Type"}) },
      { name: "szOwnership",       label: intl.formatMessage({id: "label.collateraldetails.ownership", defaultMessage: "Ownership"}) },
      { name: "szOwnerName",       label: intl.formatMessage({id: "label.collateraldetails.ownerName", defaultMessage: "Owner Name"}) },
      { name: "bdShareValue",      label: intl.formatMessage({id: "label.collateraldetails.shareValue", defaultMessage: "Share Value"}),         type: "currency" },
      { name: "szNameOfCorporate", label: intl.formatMessage({id: "label.collateraldetails.companyName", defaultMessage: "Company Name"}) },
      ...commonFields,
    ],
    pdc: [
      { name: "szDocNo",       label: intl.formatMessage({id: "label.collateraldetails.docNo", defaultMessage: "Document No"}),    required: true },
      { name: "szChequeNo",    label: intl.formatMessage({id: "label.collateraldetails.chequeNo", defaultMessage: "Cheque No"}),      required: true },
      { name: "szDocDesc",     label: intl.formatMessage({id: "label.collateraldetails.desc", defaultMessage: "Description"}),    required: true },
      { name: "bdlPaymntAmt",  label: intl.formatMessage({id: "label.collateraldetails.chequeAmt", defaultMessage: "Cheque Amount"}),  type: "currency" },
      { name: "szPaymentMode", label: intl.formatMessage({id: "label.collateraldetails.pmtMode", defaultMessage: "Payment Mode"}) },
      { name: "dtChequeDt",    label: intl.formatMessage({id: "label.collateraldetails.chequeDate", defaultMessage: "Cheque Date"}),    type: "date" },
      { name: "szBankName",    label: intl.formatMessage({id: "label.collateraldetails.bankName", defaultMessage: "Bank Name"}) },
      { name: "szBranchName",  label: intl.formatMessage({id: "label.collateraldetails.branchName", defaultMessage: "Branch Name"}) },
      ...commonFields,
    ],
    rcbook: [
      { name: "szDocNo",   label: intl.formatMessage({id: "label.collateraldetails.regNo", defaultMessage: "Registration No"}), required: true },
      { name: "szDocDesc", label: intl.formatMessage({id: "label.collateraldetails.desc", defaultMessage: "Description"}),     required: true },
      ...commonFields,
    ],
    dpn: [
      { name: "szDocNo",   label: intl.formatMessage({id: "label.collateraldetails.promNoteNo", defaultMessage: "Promissory Note No"}), required: true },
      { name: "szDocDesc", label: intl.formatMessage({id: "label.collateraldetails.desc", defaultMessage: "Description"}),        required: true },
      ...commonFields,
    ],
  }), [commonFields]);

  const selectedFields = useMemo(
    () => selectedType ? FORM_CONFIG[selectedType] || [] : [],
    [selectedType, FORM_CONFIG]
  );

  const handleReset = () => {
    if (!selectedType) return;
    setFieldErrors({});
    setFormDataByType((prev) => ({
      ...prev,
      [selectedType]: {},
    }));
  };

  const buildSavePayload = () => {
    const collateralData = Object.entries(selectedFormData).reduce((acc, [key, value]) => {
      acc[key] = decimalFields.has(key) ? toDecimal(value) : value;
      return acc;
    }, {});

    return {
      szCtlType: selectedOption?.code,
      collateralData: normalizePayload(collateralData),
    };
  };

  const validateSave = () => {
    if (!selectedType) {
      toast.error(
        intl.formatMessage({
          id: "error.CollateralDetails.collateralTypeRequired",
          defaultMessage: "Collateral type is required.",
        }),
      );
      return false;
    }

    if (!selectedRow?.ACNT_SEQNO) {
      toast.error(
        intl.formatMessage({
          id: "error.CollateralDetails.accountRequired",
          defaultMessage: "Please select an account before saving collateral.",
        }),
      );
      return false;
    }

    // Collect all required fields that are empty
    const errors = {};
    const missingLabels = [];

    selectedFields.forEach((field) => {
      if (field.required) {
        const value = selectedFormData[field.name];
        const isEmpty = value === undefined || value === null || String(value).trim() === "";
        if (isEmpty) {
          errors[field.name] = true;
          missingLabels.push(field.label);
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error(
        intl.formatMessage(
          {
            id: "error.CollateralDetails.requiredFieldsMissing",
            defaultMessage: "{fields} {count, plural, one {is} other {are}} required.",
          },
          {
            fields: missingLabels.join(", "),
            count: missingLabels.length,
          },
        ),
      );
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateSave()) return;

    setSaving(true);
    HAxiosService.POST(CollateralAPI.Collaterals(screenMenuId), buildSavePayload())
      .then((res) => {
        const data = res?.data;
        const status = String(data?.status || "").toLowerCase();
        if (status === "success") {
          toast.success(data?.msg || data?.message || intl.formatMessage({ id: "success.CollateralDetails.saveSuccess", defaultMessage: "Collateral saved successfully." }));
          handleReset();
        } else if (data?.message === "Validation Failed" && data?.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(data?.msg || data?.message || intl.formatMessage({ id: "error.CollateralDetails.saveError", defaultMessage: "Error saving collateral." }));
        }
      })
      .catch((err) => {
        console.log("Save Collateral error:", err);
        toast.error(err?.response?.data?.message || intl.formatMessage({ id: "error.CollateralDetails.saveError", defaultMessage: "Error saving collateral." }));
      })
      .finally(() => setSaving(false));
  };

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.CollateralDetails.title",
        defaultMessage: "Collateral Details",
      })}
      contentPaddingTop={2}
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, background: "transparent" }}>
        <HPaper
          variant="outlined"
          sx={{
            borderRadius: "8px",
            borderColor: "divider",
            p: 2,
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
          }}
        >
          <FieldLabel 
            label={intl.formatMessage({
              id: "label.collateraldetails.collateralType",
              defaultMessage: "Collateral Type",
            })}
            required />
          <HBox
            sx={{
              background: "transparent",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
                lg: "repeat(6, minmax(0, 1fr))",
              },
              gap: 1,
            }}
          >
            {COLLATERAL_TYPES.map((option) => (
              <CollateralTypeButton
                key={option.value}
                option={option}
                selected={selectedType === option.value}
                onClick={() => {
                  setSelectedType(option.value);
                  setFieldErrors({});
                }}
              />
            ))}
          </HBox>
        </HPaper>

        {selectedOption && (
          <HPaper
            variant="outlined"
            sx={{
              borderRadius: "8px",
              borderColor: "divider",
              p: 2,
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
            }}
          >
            <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2, background: "transparent" }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              <HLabel
                value={intl.formatMessage(selectedOption.title)}
                translate={false}
                align="left"
                colon={false}
                sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}
              />
            </HBox>

            <HBox
              sx={{
                background: "transparent",
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                columnGap: 1.5,
                rowGap: 1.65,
              }}
            >
              {selectedFields.map((field) => (
                <CollateralField
                  key={field.name}
                  field={field}
                  value={selectedFormData[field.name]}
                  onChange={handleFieldChange}
                  error={!!fieldErrors[field.name]}
                />
              ))}
            </HBox>
          </HPaper>
        )}
      </HBox>

      {selectedOption && (
        <HButtonBar
          onSave={!saving ? handleSave : undefined}
          onReset={!saving ? handleReset : undefined}
          disableToast={{ save: true, reset: true }}
        />
      )}
    </FunctionLayout>
  );
}
