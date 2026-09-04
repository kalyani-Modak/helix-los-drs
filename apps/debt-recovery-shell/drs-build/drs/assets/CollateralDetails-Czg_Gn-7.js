import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, ct as ar, el as useSelector, dN as reactExports, ef as useLocation, a3 as DescriptionOutlinedIcon, bT as ShieldOutlined, k as ArticleOutlinedIcon, aX as Kr, T as CollateralAPI, ac as Dt, aW as Kg, aU as Inventory2OutlinedIcon, dK as ps, cj as Vg, em as useTheme, w as Button, cr as alpha, bH as SE, cg as Ug, cI as dayjs, dI as pp, cs as ap } from "./index-BhdgJqva.js";
import { D as DirectionsCarOutlinedIcon } from "./DirectionsCarOutlined-DySRdIvz.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
const CreditCardOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"
}));
const ShowChartOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "m3.5 18.49 6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"
}));
const COLLATERAL_TYPES = [
  {
    value: "invoice",
    code: "INVOICE",
    label: { id: "label.collateraldetails.invoice", defaultMessage: "Invoice" },
    title: { id: "label.collateraldetails.invoiceDetails", defaultMessage: "Invoice details" },
    icon: DescriptionOutlinedIcon
  },
  {
    value: "insurance",
    code: "INSU",
    label: { id: "label.collateraldetails.insurance", defaultMessage: "Insurance" },
    title: { id: "label.collateraldetails.insuranceDetails", defaultMessage: "Insurance Details" },
    icon: ShieldOutlined
  },
  {
    value: "share",
    code: "SHARE",
    label: { id: "label.collateraldetails.shares", defaultMessage: "Shares" },
    title: { id: "label.collateraldetails.sharesDetails", defaultMessage: "Shares Details" },
    icon: ShowChartOutlinedIcon
  },
  {
    value: "pdc",
    code: "PDC",
    label: { id: "label.collateraldetails.pdc", defaultMessage: "Post Dated Cheque" },
    title: { id: "label.collateraldetails.pdcDetails", defaultMessage: "Post Dated Cheque Details" },
    icon: CreditCardOutlinedIcon
  },
  {
    value: "rcbook",
    code: "RCBOOK",
    label: { id: "label.collateraldetails.rcbook", defaultMessage: "RC Book" },
    title: { id: "label.collateraldetails.rcbookDetails", defaultMessage: "RC Book Details" },
    icon: DirectionsCarOutlinedIcon
  },
  {
    value: "dpn",
    code: "DPN",
    label: { id: "label.collateraldetails.promissoryNote", defaultMessage: "Promissory Note" },
    title: { id: "label.collateraldetails.promissoryNoteDetails", defaultMessage: "Promissory Note Details" },
    icon: ArticleOutlinedIcon
  }
];
const decimalFields = /* @__PURE__ */ new Set([
  "bdValuation",
  "bdlPaymntAmt",
  "bdShareMarketValue",
  "bdShareValue"
]);
function toDecimal(value) {
  if (value == null || value === "") return void 0;
  const numericValue = Number(String(value).replaceAll(",", ""));
  return Number.isFinite(numericValue) ? numericValue : void 0;
}
function normalizePayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== void 0 && value !== null && value !== "")
  );
}
function formatDropdownLabel(intl, label, value) {
  const fallback = label && !String(label).startsWith("label.") ? label : String(value || "").toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
  if (!label) return fallback;
  return String(label).startsWith("label.") ? intl.formatMessage({ id: label, defaultMessage: fallback }) : label;
}
function mapSystemParamOptions(items, intl) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const value = (item == null ? void 0 : item.szCondition) ?? (item == null ? void 0 : item.szcondition) ?? (item == null ? void 0 : item.value) ?? "";
    const label = (item == null ? void 0 : item.szDesc) ?? (item == null ? void 0 : item.szdesc) ?? (item == null ? void 0 : item.szi18nDesc) ?? (item == null ? void 0 : item.szi18ndesc) ?? value;
    return value ? { value, label: formatDropdownLabel(intl, label, value) } : null;
  }).filter(Boolean);
}
function mapReasonOptions(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    const value = (item == null ? void 0 : item.szCondition) ?? (item == null ? void 0 : item.szcondition) ?? "";
    const label = (item == null ? void 0 : item.szDesc) ?? (item == null ? void 0 : item.szdesc) ?? value;
    return value ? { value, label } : null;
  }).filter(Boolean);
}
function CollateralTypeButton({ option, selected, onClick }) {
  const theme = useTheme();
  const intl = useIntl();
  const Icon = option.icon;
  const label = typeof option.label === "object" ? intl.formatMessage(option.label) : option.label;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      variant: "outlined",
      onClick,
      startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 16 } }),
      sx: {
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
          bgcolor: alpha(theme.palette.primary.main, 0.06)
        },
        "& .MuiButton-startIcon": {
          mr: 1,
          color: selected ? "primary.main" : "text.secondary"
        }
      },
      children: label
    }
  );
}
function FieldLabel({ label, required }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ps,
    {
      value: label,
      translate: false,
      required,
      align: "left",
      colon: false,
      sx: { mb: 0.65, fontSize: 11, fontWeight: 600, color: "text.primary" }
    }
  );
}
function CollateralField({ field, value, onChange, error }) {
  const width = "100%";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        background: "transparent",
        minWidth: 0,
        gridColumn: {
          xs: "span 1",
          md: field.span ? `span ${field.span}` : "span 1"
        }
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { label: field.label, required: field.required }),
        field.type === "select" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SE,
          {
            name: field.name,
            value: value || "",
            options: field.options || [],
            width,
            placeholder: "Select...",
            error,
            onChange: (event) => onChange(field.name, event.target.value)
          }
        ),
        field.type === "date" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Ug,
          {
            value: value ? dayjs(value) : null,
            onChange: (newValue) => onChange(field.name, newValue ? newValue.format("YYYY-MM-DD") : ""),
            width,
            error
          }
        ),
        field.type === "textarea" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          pp,
          {
            value: value || "",
            onChange: (event) => onChange(field.name, event.target.value),
            width,
            maxLines: 3,
            maxLength: 500,
            error
          }
        ),
        !field.type && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            editable: true,
            value: value || "",
            onChange: (event) => onChange(field.name, event.target.value),
            width,
            error
          }
        ),
        (field.type === "number" || field.type === "currency") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            editable: true,
            type: field.type,
            value: value || "",
            onChange: (event) => onChange(field.name, event.target.value),
            width,
            error
          }
        )
      ]
    }
  );
}
function CollateralDetails() {
  const intl = useIntl();
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const [selectedType, setSelectedType] = reactExports.useState("");
  const [formDataByType, setFormDataByType] = reactExports.useState({});
  const [fieldErrors, setFieldErrors] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const [levelOptions, setLevelOptions] = reactExports.useState([]);
  const [reasonOptions, setReasonOptions] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const selectedOption = reactExports.useMemo(
    () => COLLATERAL_TYPES.find((option) => option.value === selectedType),
    [selectedType]
  );
  const selectedFormData = reactExports.useMemo(
    () => formDataByType[selectedType] || {},
    [formDataByType, selectedType]
  );
  const handleFieldChange = (fieldName, value) => {
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
        ...prev[selectedType] || {},
        [fieldName]: value
      }
    }));
  };
  reactExports.useEffect(() => {
    Kr.GET(`${CollateralAPI.Collaterals(screenMenuId)}`).then((res) => {
      var _a;
      if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "Success") {
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
    }).catch((err) => console.error("Error fetching collateral options", err));
  }, [intl]);
  const commonFields = reactExports.useMemo(() => [
    { name: "szAcLevel", label: intl.formatMessage({ id: "label.collateraldetails.level", defaultMessage: "Level" }), type: "select", options: levelOptions },
    { name: "bdValuation", label: intl.formatMessage({ id: "label.collateraldetails.currencyvalue", defaultMessage: "Currency Value" }), type: "currency" },
    { name: "dtEffectiveDate", label: intl.formatMessage({ id: "label.collateraldetails.effdate", defaultMessage: "Effective Date" }), type: "date" },
    { name: "szReason", label: intl.formatMessage({ id: "label.collateraldetails.reason", defaultMessage: "Reason" }), type: "select", options: reasonOptions },
    { name: "szAddInf", label: intl.formatMessage({ id: "label.collateraldetails.addinfo", defaultMessage: "Additional Info" }) },
    { name: "szRemark", label: intl.formatMessage({ id: "label.collateraldetails.remarks", defaultMessage: "Remarks" }), type: "textarea", span: 3 }
  ], [levelOptions, reasonOptions]);
  const FORM_CONFIG = reactExports.useMemo(() => ({
    invoice: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.invoiceNo", defaultMessage: "Invoice No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.invoiceDesc", defaultMessage: "Invoice Description" }), required: true },
      { name: "bdlPaymntAmt", label: intl.formatMessage({ id: "label.collateraldetails.invoiceAmt", defaultMessage: "Invoice Amount" }), type: "currency" },
      ...commonFields
    ],
    insurance: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.policyNo", defaultMessage: "Policy No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.desc", defaultMessage: "Description" }), required: true },
      { name: "dtValuation", label: intl.formatMessage({ id: "label.collateraldetails.valuationDate", defaultMessage: "Valuation Date" }), type: "date" },
      { name: "szValuer", label: intl.formatMessage({ id: "label.collateraldetails.valuer", defaultMessage: "Valuer" }) },
      { name: "szValuerType", label: intl.formatMessage({ id: "label.collateraldetails.valuerType", defaultMessage: "ValuerType" }) },
      { name: "dtDocStatus", label: intl.formatMessage({ id: "label.collateraldetails.docStatusDate", defaultMessage: "Document Status Date" }), type: "date" },
      { name: "szFinanceInstitute", label: intl.formatMessage({ id: "label.collateraldetails.finInstitute", defaultMessage: "Finance Institute" }) },
      ...commonFields
    ],
    share: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.certificateNo", defaultMessage: "Certificate No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.desc", defaultMessage: "Description" }), required: true },
      { name: "bdShareMarketValue", label: intl.formatMessage({ id: "label.collateraldetails.shareMarketValue", defaultMessage: "Share Market Value" }), type: "currency" },
      { name: "szShareQuantity", label: intl.formatMessage({ id: "label.collateraldetails.noOfShares", defaultMessage: "No of Shares" }), type: "number" },
      { name: "szShareType", label: intl.formatMessage({ id: "label.collateraldetails.sharetype", defaultMessage: "Share Type" }) },
      { name: "szOwnership", label: intl.formatMessage({ id: "label.collateraldetails.ownership", defaultMessage: "Ownership" }) },
      { name: "szOwnerName", label: intl.formatMessage({ id: "label.collateraldetails.ownerName", defaultMessage: "Owner Name" }) },
      { name: "bdShareValue", label: intl.formatMessage({ id: "label.collateraldetails.shareValue", defaultMessage: "Share Value" }), type: "currency" },
      { name: "szNameOfCorporate", label: intl.formatMessage({ id: "label.collateraldetails.companyName", defaultMessage: "Company Name" }) },
      ...commonFields
    ],
    pdc: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.docNo", defaultMessage: "Document No" }), required: true },
      { name: "szChequeNo", label: intl.formatMessage({ id: "label.collateraldetails.chequeNo", defaultMessage: "Cheque No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.desc", defaultMessage: "Description" }), required: true },
      { name: "bdlPaymntAmt", label: intl.formatMessage({ id: "label.collateraldetails.chequeAmt", defaultMessage: "Cheque Amount" }), type: "currency" },
      { name: "szPaymentMode", label: intl.formatMessage({ id: "label.collateraldetails.pmtMode", defaultMessage: "Payment Mode" }) },
      { name: "dtChequeDt", label: intl.formatMessage({ id: "label.collateraldetails.chequeDate", defaultMessage: "Cheque Date" }), type: "date" },
      { name: "szBankName", label: intl.formatMessage({ id: "label.collateraldetails.bankName", defaultMessage: "Bank Name" }) },
      { name: "szBranchName", label: intl.formatMessage({ id: "label.collateraldetails.branchName", defaultMessage: "Branch Name" }) },
      ...commonFields
    ],
    rcbook: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.regNo", defaultMessage: "Registration No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.desc", defaultMessage: "Description" }), required: true },
      ...commonFields
    ],
    dpn: [
      { name: "szDocNo", label: intl.formatMessage({ id: "label.collateraldetails.promNoteNo", defaultMessage: "Promissory Note No" }), required: true },
      { name: "szDocDesc", label: intl.formatMessage({ id: "label.collateraldetails.desc", defaultMessage: "Description" }), required: true },
      ...commonFields
    ]
  }), [commonFields]);
  const selectedFields = reactExports.useMemo(
    () => selectedType ? FORM_CONFIG[selectedType] || [] : [],
    [selectedType, FORM_CONFIG]
  );
  const handleReset = () => {
    if (!selectedType) return;
    setFieldErrors({});
    setFormDataByType((prev) => ({
      ...prev,
      [selectedType]: {}
    }));
  };
  const buildSavePayload = () => {
    const collateralData = Object.entries(selectedFormData).reduce((acc, [key, value]) => {
      acc[key] = decimalFields.has(key) ? toDecimal(value) : value;
      return acc;
    }, {});
    return {
      szCtlType: selectedOption == null ? void 0 : selectedOption.code,
      collateralData: normalizePayload(collateralData)
    };
  };
  const validateSave = () => {
    if (!selectedType) {
      toast.error(
        intl.formatMessage({
          id: "error.CollateralDetails.collateralTypeRequired",
          defaultMessage: "Collateral type is required."
        })
      );
      return false;
    }
    if (!(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO)) {
      toast.error(
        intl.formatMessage({
          id: "error.CollateralDetails.accountRequired",
          defaultMessage: "Please select an account before saving collateral."
        })
      );
      return false;
    }
    const errors = {};
    const missingLabels = [];
    selectedFields.forEach((field) => {
      if (field.required) {
        const value = selectedFormData[field.name];
        const isEmpty = value === void 0 || value === null || String(value).trim() === "";
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
            defaultMessage: "{fields} {count, plural, one {is} other {are}} required."
          },
          {
            fields: missingLabels.join(", "),
            count: missingLabels.length
          }
        )
      );
      return false;
    }
    return true;
  };
  const handleSave = () => {
    if (!validateSave()) return;
    setSaving(true);
    Kr.POST(CollateralAPI.Collaterals(screenMenuId), buildSavePayload()).then((res) => {
      const data = res == null ? void 0 : res.data;
      const status = String((data == null ? void 0 : data.status) || "").toLowerCase();
      if (status === "success") {
        toast.success((data == null ? void 0 : data.msg) || (data == null ? void 0 : data.message) || intl.formatMessage({ id: "success.CollateralDetails.saveSuccess", defaultMessage: "Collateral saved successfully." }));
        handleReset();
      } else if ((data == null ? void 0 : data.message) === "Validation Failed" && (data == null ? void 0 : data.responseJson)) {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        toast.error((data == null ? void 0 : data.msg) || (data == null ? void 0 : data.message) || intl.formatMessage({ id: "error.CollateralDetails.saveError", defaultMessage: "Error saving collateral." }));
      }
    }).catch((err) => {
      var _a, _b;
      console.log("Save Collateral error:", err);
      toast.error(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "error.CollateralDetails.saveError", defaultMessage: "Error saving collateral." }));
    }).finally(() => setSaving(false));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FunctionLayout,
    {
      title: intl.formatMessage({
        id: "label.CollateralDetails.title",
        defaultMessage: "Collateral Details"
      }),
      contentPaddingTop: 2,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2, background: "transparent" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Kg,
            {
              variant: "outlined",
              sx: {
                borderRadius: "8px",
                borderColor: "divider",
                p: 2,
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  FieldLabel,
                  {
                    label: intl.formatMessage({
                      id: "label.collateraldetails.collateralType",
                      defaultMessage: "Collateral Type"
                    }),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      background: "transparent",
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                        lg: "repeat(6, minmax(0, 1fr))"
                      },
                      gap: 1
                    },
                    children: COLLATERAL_TYPES.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CollateralTypeButton,
                      {
                        option,
                        selected: selectedType === option.value,
                        onClick: () => {
                          setSelectedType(option.value);
                          setFieldErrors({});
                        }
                      },
                      option.value
                    ))
                  }
                )
              ]
            }
          ),
          selectedOption && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Kg,
            {
              variant: "outlined",
              sx: {
                borderRadius: "8px",
                borderColor: "divider",
                p: 2,
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, mb: 2, background: "transparent" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Inventory2OutlinedIcon, { sx: { fontSize: 16, color: "primary.main" } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage(selectedOption.title),
                      translate: false,
                      align: "left",
                      colon: false,
                      sx: { fontSize: 13, fontWeight: 700, color: "text.primary" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      background: "transparent",
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, minmax(0, 1fr))"
                      },
                      columnGap: 1.5,
                      rowGap: 1.65
                    },
                    children: selectedFields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CollateralField,
                      {
                        field,
                        value: selectedFormData[field.name],
                        onChange: handleFieldChange,
                        error: !!fieldErrors[field.name]
                      },
                      field.name
                    ))
                  }
                )
              ]
            }
          )
        ] }),
        selectedOption && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: !saving ? handleSave : void 0,
            onReset: !saving ? handleReset : void 0,
            disableToast: { save: true, reset: true }
          }
        )
      ]
    }
  );
}
export {
  CollateralDetails as default
};
