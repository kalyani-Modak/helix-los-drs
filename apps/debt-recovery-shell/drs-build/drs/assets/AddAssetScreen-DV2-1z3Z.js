import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, $ as $e, dK as ps, cg as Ug, bH as SE, cs as ap, cI as dayjs, aW as Kg, b0 as Lg, aT as Inventory2, bR as SettingsOutlined, ct as ar, eh as useNavigate, el as useSelector, dN as reactExports, ef as useLocation, aX as Kr, m as AssetsAPI, ac as Dt, cf as Typography, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { D as DiamondOutlined } from "./DiamondOutlined-BT-0jzD2.js";
import { D as DirectionsCarOutlinedIcon } from "./DirectionsCarOutlined-DySRdIvz.js";
const ApartmentOutlined = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M17 11V3H7v4H3v14h8v-4h2v4h8V11zM7 19H5v-2h2zm0-4H5v-2h2zm0-4H5V9h2zm4 4H9v-2h2zm0-4H9V9h2zm0-4H9V5h2zm4 8h-2v-2h2zm0-4h-2V9h2zm0-4h-2V5h2zm4 12h-2v-2h2zm0-4h-2v-2h2z"
}));
function normalizeAssetApiType(sz) {
  const u = String(sz || "").trim().toUpperCase();
  if (["AUTO", "AU", "A", "AUTOMOBILE", "VEHICLE"].includes(u) || u.includes("AUTOMOBILE")) return "AUTO";
  if (["MACHINE", "MACHINERY", "MACH", "MACHY", "MCH", "MC", "MA", "M"].includes(u) || u.includes("MACHIN")) {
    return "MACHINE";
  }
  if (["JEWEL", "JEWELRY", "JEWELLERY", "JEWELLARY", "JEW", "JWL", "JW", "JE", "J"].includes(u) || u.includes("JEWEL")) {
    return "JEWEL";
  }
  if (["PROPERTY", "PROP", "PR", "P"].includes(u) || u.includes("PROP")) return "PROPERTY";
  return u;
}
function getFieldSectionsForAssetType(apiType) {
  const t = normalizeAssetApiType(apiType);
  switch (t) {
    case "AUTO":
      return [
        {
          titleKey: "label.Assets.Asset Details",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No", required: true },
            { key: "szAssetType", labelKey: "Product Type", required: true },
            { key: "szMake", labelKey: "label.Assets.Make" },
            { key: "szModel", labelKey: "label.Assets.Model" },
            { key: "inYearMfg", labelKey: "label.Assets.Model Year" },
            { key: "szDesc", labelKey: "label.Assets.Description" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] }
          ]
        },
        {
          titleKey: "label.Assets.Asset Identification",
          fields: [
            { key: "szEnginNo", labelKey: "label.Assets.Engine No" },
            { key: "szEnginCapacity", labelKey: "label.addAsset.engineCapacity" },
            { key: "szChasisNo", labelKey: "label.Assets.Chassis No" },
            { key: "szInvoiceNo", labelKey: "label.Assets.Invoice No" },
            { key: "szRegNo", labelKey: "label.Assets.Registration No" },
            { key: "szInsuPolicyNo", labelKey: "label.Assets.Policy No" },
            { key: "szInsuCompany", labelKey: "label.Assets.Insurance Company" }
          ]
        }
      ];
    case "MACHINE":
      return [
        {
          titleKey: "label.Assets.Add New Machinery",
          fields: [
            { key: "szMachineName", labelKey: "Machinery Name", required: true },
            { key: "szDesc", labelKey: "Machinery Description" },
            { key: "szInvoiceNo", labelKey: "label.Assets.Invoice No" },
            { key: "dtInvoice", labelKey: "Purchase Date", control: "date" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "dtValue", labelKey: "label.Assets.Date of Valuation", control: "date" },
            { key: "szValuer", labelKey: "label.Assets.Valuer" },
            { key: "szValuerType", labelKey: "Type Of Valuer" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] }
          ]
        }
      ];
    case "JEWEL":
      return [
        {
          titleKey: "label.Assets.Add New Jewellery",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No" },
            { key: "szDesc", labelKey: "Jewellery Description" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value", required: true },
            { key: "dtValue", labelKey: "label.Assets.Date of Valuation", control: "date" },
            { key: "szValuer", labelKey: "label.Assets.Valuer" },
            { key: "szValuerType", labelKey: "Type of Valuer" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] }
          ]
        }
      ];
    case "PROPERTY":
      return [
        {
          titleKey: "label.Assets.Add New Property",
          fields: [
            { key: "szAssetCode", labelKey: "Reference No" },
            { key: "szDesc", labelKey: "label.Assets.Description" },
            { key: "bdLandArea", labelKey: "Land Area (Size)" },
            { key: "bdBuiltArea", labelKey: "label.addAsset.builtUpArea" },
            { key: "bdNorth", labelKey: "label.addAsset.northBoundaries" },
            { key: "bdEast", labelKey: "label.addAsset.eastBoundaries" },
            { key: "bdWest", labelKey: "label.addAsset.westBoundaries" },
            { key: "bdCurrentValue", labelKey: "label.Assets.Value" },
            { key: "szFlatNo", labelKey: "Flat/House No", required: true },
            { key: "szFloorNo", labelKey: "label.addAsset.floorNo" },
            { key: "szPlotNo", labelKey: "label.addAsset.plotNo" },
            { key: "szSurveyNo", labelKey: "City Survey No", required: true },
            { key: "szKhasaraNo", labelKey: "label.addAsset.khasaraNo" },
            { key: "szCity", labelKey: "Town/Area" },
            { key: "szTaluka", labelKey: "label.addAsset.taluka" },
            { key: "szDistrict", labelKey: "label.addAsset.district" },
            { key: "szOwner", labelKey: "label.addAsset.owner" },
            { key: "szRegNo", labelKey: "label.Assets.Registration No" },
            { key: "szOwnerType", labelKey: "Owner Type", control: "select", options: [] }
          ]
        }
      ];
    default:
      return [];
  }
}
function validateAssetPayload(apiType, data, intl) {
  const t = normalizeAssetApiType(apiType);
  const msg = (id) => intl.formatMessage({ id });
  const isEmpty = (v) => v === void 0 || v === null || String(v).trim() === "";
  if (t === "AUTO") {
    if (isEmpty(data == null ? void 0 : data.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data == null ? void 0 : data.szAssetCode)) return msg("error.asset.assetCode.mandatory");
  }
  if (t === "MACHINE") {
    if (isEmpty(data == null ? void 0 : data.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data == null ? void 0 : data.szMachineName)) return msg("error.asset.machineName.mandatory");
  }
  if (t === "JEWEL") {
    if (isEmpty(data == null ? void 0 : data.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data == null ? void 0 : data.bdCurrentValue)) return msg("error.asset.currentValue.mandatory");
  }
  if (t === "PROPERTY") {
    if (isEmpty(data == null ? void 0 : data.szAssetType)) return msg("error.asset.assetType.mandatory");
    if (isEmpty(data == null ? void 0 : data.szFlatNo)) return msg("error.asset.flatNo.mandatory");
    if (isEmpty(data == null ? void 0 : data.szSurveyNo)) return msg("error.asset.surveyNo.mandatory");
  }
  return null;
}
const scrollBody = "_scrollBody_sw60v_4";
const stack = "_stack_sw60v_13";
const entryColumn = "_entryColumn_sw60v_37";
const sectionStack = "_sectionStack_sw60v_45";
const formSectionBlock = "_formSectionBlock_sw60v_52";
const card = "_card_sw60v_56";
const cardContent = "_cardContent_sw60v_63";
const sectionLabel = "_sectionLabel_sw60v_68";
const sectionLabelRequired = "_sectionLabelRequired_sw60v_78";
const typeSection = "_typeSection_sw60v_83";
const typeGrid = "_typeGrid_sw60v_89";
const formHeader = "_formHeader_sw60v_147";
const formHeaderTitle = "_formHeaderTitle_sw60v_154";
const subsectionTitle = "_subsectionTitle_sw60v_163";
const fieldGrid = "_fieldGrid_sw60v_182";
const fieldCell = "_fieldCell_sw60v_195";
const fieldControl = "_fieldControl_sw60v_203";
const mutedNote = "_mutedNote_sw60v_216";
const primaryIcon = "_primaryIcon_sw60v_227";
const barWrap = "_barWrap_sw60v_231";
const styles = {
  scrollBody,
  stack,
  entryColumn,
  sectionStack,
  formSectionBlock,
  card,
  cardContent,
  sectionLabel,
  sectionLabelRequired,
  typeSection,
  typeGrid,
  formHeader,
  formHeaderTitle,
  subsectionTitle,
  fieldGrid,
  fieldCell,
  fieldControl,
  mutedNote,
  primaryIcon,
  barWrap
};
function AddAssetFormFields({ apiAssetType, data, onChange, readOnly, ownerTypeOptions = [] }) {
  const intl = useIntl();
  const { text } = $e();
  const sections = getFieldSectionsForAssetType(apiAssetType);
  const handleField = (key) => (e) => {
    onChange(key, e.target.value);
  };
  const handleDateField = (key) => (value) => {
    onChange(key, value);
  };
  const getDateValue = (value) => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };
  const renderControl = (field) => {
    const isNumericField = /^(bd|in|ln)/i.test(field.key);
    if (field.control === "date") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Ug,
        {
          value: getDateValue(data[field.key]),
          onChange: handleDateField(field.key),
          required: field.required,
          width: "100%",
          disabled: readOnly
        }
      );
    }
    if (field.control === "select") {
      const options = field.key === "szOwnerType" ? ownerTypeOptions : field.options || [];
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SE,
        {
          name: field.key,
          value: data[field.key] || "",
          onChange: handleField(field.key),
          options,
          readOnly,
          width: "100%"
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ap,
      {
        editable: !readOnly,
        required: field.required,
        type: isNumericField ? "number" : "text",
        value: data[field.key] != null && data[field.key] !== "" ? String(data[field.key]) : "",
        onChange: handleField(field.key)
      }
    );
  };
  if (!apiAssetType || sections.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.sectionStack, children: sections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formSectionBlock, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.subsectionTitle, children: intl.formatMessage({ id: section.titleKey }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.fieldGrid, children: section.fields.map((field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.fieldCell, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ps,
        {
          value: field.labelKey,
          required: field.required,
          align: "left",
          colon: false,
          color: text.secondary
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.fieldControl, children: renderControl(field) })
    ] }, field.key)) })
  ] }, section.titleKey)) });
}
function TypeIcon({ apiCode, formType }) {
  const t = normalizeAssetApiType(formType || apiCode);
  if (t === "AUTO") return /* @__PURE__ */ jsxRuntimeExports.jsx(DirectionsCarOutlinedIcon, { fontSize: "small" });
  if (t === "MACHINE") return /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsOutlined, { fontSize: "small" });
  if (t === "JEWEL") return /* @__PURE__ */ jsxRuntimeExports.jsx(DiamondOutlined, { fontSize: "small" });
  if (t === "PROPERTY") return /* @__PURE__ */ jsxRuntimeExports.jsx(ApartmentOutlined, { fontSize: "small" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Inventory2, { fontSize: "small" });
}
function typeTileSx(selected) {
  return {
    justifyContent: "flex-start",
    gap: "8px",
    minHeight: 38,
    padding: "10px 12px",
    borderRadius: "8px",
    borderColor: selected ? "var(--drs-color-primary, #2563eb)" : "var(--drs-border-divider, #e2e8f0)",
    backgroundColor: selected ? "var(--drs-action-selected, rgba(37, 99, 235, 0.12))" : "var(--drs-bg-paper, #ffffff)",
    boxShadow: selected ? "0 0 0 2px var(--drs-soft-accent, rgba(37, 99, 235, 0.2))" : "none",
    color: selected ? "var(--drs-color-primary-dark, #1d4ed8)" : "var(--drs-text-primary, #141923)",
    fontSize: "12px",
    fontWeight: selected ? 600 : 500,
    lineHeight: 1.25,
    textTransform: "none",
    "& .MuiButton-startIcon": {
      color: selected ? "var(--drs-color-primary, #2563eb)" : "var(--drs-text-secondary, #64748b)",
      marginLeft: 0,
      marginRight: "8px"
    },
    "&:hover": {
      borderColor: "var(--drs-control-hover-border, #2563eb)",
      backgroundColor: selected ? "var(--drs-action-selected, rgba(37, 99, 235, 0.12))" : "var(--drs-hover-bg, rgba(37, 99, 235, 0.08))",
      boxShadow: selected ? "0 0 0 2px var(--drs-soft-accent, rgba(37, 99, 235, 0.2))" : "none"
    }
  };
}
function AddAssetEntrySection({
  assetTypeOptions,
  selectedApiCode,
  selectedFormType,
  onSelectType,
  entryData,
  onEntryChange,
  ownerTypeOptions
}) {
  const intl = useIntl();
  const titleForType = () => {
    const opt = assetTypeOptions.find((o) => o.apiCode === selectedApiCode);
    if (!opt) return intl.formatMessage({ id: "label.addAsset.entry.addNewAsset" });
    return intl.formatMessage({ id: "label.addAsset.entry.addNewType" }, { type: opt.label });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.entryColumn, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { className: styles.card, elevation: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardContent, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.typeSection, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.sectionLabel, children: [
        intl.formatMessage({ id: "label.Assets.Asset Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.sectionLabelRequired, children: " *" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.typeGrid, children: assetTypeOptions.map((opt) => {
        const selected = selectedApiCode === opt.apiCode;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            variant: "outlined",
            size: "small",
            fullWidth: true,
            label: opt.label,
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeIcon, { apiCode: opt.apiCode, formType: opt.formType }),
            onClick: () => onSelectType(opt.apiCode),
            sx: typeTileSx(selected)
          },
          opt.apiCode
        );
      }) })
    ] }) }) }),
    selectedApiCode && /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { className: styles.card, elevation: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.cardContent, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.formHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Inventory2, { className: styles.primaryIcon, fontSize: "small" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.formHeaderTitle, children: titleForType() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AddAssetFormFields,
        {
          apiAssetType: selectedFormType || selectedApiCode,
          data: entryData,
          onChange: onEntryChange,
          readOnly: false,
          ownerTypeOptions
        }
      )
    ] }) })
  ] });
}
const GRID_KEYS = /* @__PURE__ */ new Set(["gridRowId", "key"]);
function stripGridMetadata(row) {
  if (!row || typeof row !== "object") return {};
  const out = { ...row };
  GRID_KEYS.forEach((k) => {
    delete out[k];
  });
  Object.entries(out).forEach(([key, value]) => {
    if (dayjs.isDayjs(value)) {
      out[key] = value.isValid() ? value.format("YYYY-MM-DD") : null;
    }
  });
  return out;
}
function buildSaveAssetPayload({ selectedRow, assetType, assetData, lnAssetSeqNo }) {
  const payload = {
    assetType,
    assetData: stripGridMetadata(assetData)
  };
  return payload;
}
function formatAssetTypeTileLabel(apiCode, intl, szDesc, szi18nDesc) {
  var _a;
  const labelKey = szi18nDesc || szDesc;
  const raw = ((_a = intl.messages) == null ? void 0 : _a[labelKey]) ? intl.formatMessage({ id: labelKey, defaultMessage: szDesc || apiCode }) : szDesc || apiCode;
  return String(raw).split(/\s+/).map((w) => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : "").filter(Boolean).join(" ");
}
function mapApiDropdownOptions(list = [], intl) {
  return (Array.isArray(list) ? list : []).map((item) => {
    var _a;
    if (!item || typeof item !== "object") return null;
    const value = String(
      item.szCondition ?? item.value ?? item.szCode ?? item.code ?? item.id ?? ""
    ).trim();
    if (!value) return null;
    const labelSource = item.szi18nDesc ?? item.szDesc ?? item.label ?? item.description ?? item.name ?? value;
    const label = typeof labelSource === "string" && ((_a = intl.messages) == null ? void 0 : _a[labelSource]) ? intl.formatMessage({ id: labelSource, defaultMessage: item.szDesc || value }) : labelSource;
    return { value, label: String(label) };
  }).filter(Boolean);
}
function findListByKey(payload, matchers) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const entries = Object.entries(payload);
  const found = entries.find(([key, value]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return Array.isArray(value) && matchers.some((matcher) => normalizedKey.includes(matcher));
  });
  return found ? found[1] : [];
}
function findOwnerTypeList(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const directKeys = [
    "addressees",
    "ownerType",
    "ownerTypes",
    "lstOwnerType",
    "lstOwnerTypes",
    "ownerTypeList",
    "lstAssetOwnerType"
  ];
  const direct = directKeys.find((key) => Array.isArray(payload[key]));
  if (direct) return payload[direct];
  return findListByKey(payload, ["ownertype"]);
}
function isApiSuccess(res) {
  var _a;
  const s = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status;
  return typeof s === "string" && s.toLowerCase() === "success";
}
function AddAssetScreen() {
  var _a;
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [assetTypeOptions, setAssetTypeOptions] = reactExports.useState([]);
  const [ownerTypeOptions, setOwnerTypeOptions] = reactExports.useState([]);
  const [selectedApiCode, setSelectedApiCode] = reactExports.useState("");
  const [entryData, setEntryData] = reactExports.useState({});
  const [saving, setSaving] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const loadAssetTypes = reactExports.useCallback(() => {
    return Kr.GET(AssetsAPI.Assets(screenMenuId)).then((res) => {
      var _a2;
      const payload = ((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.responseJson) ?? {};
      const assetTypeList = Array.isArray(payload) ? payload : findListByKey(payload, ["assettype", "asset"]);
      const ownerTypeList = findOwnerTypeList(payload);
      if (isApiSuccess(res) && Array.isArray(assetTypeList)) {
        const options = assetTypeList.map((item) => {
          const apiCode = String(item.szCondition || "").trim();
          return {
            apiCode,
            formType: normalizeAssetApiType(`${apiCode} ${item.szDesc || ""}`),
            label: formatAssetTypeTileLabel(apiCode, intl, item.szDesc, item.szi18nDesc)
          };
        });
        setAssetTypeOptions(options);
        setOwnerTypeOptions(mapApiDropdownOptions(ownerTypeList, intl));
      } else {
        toast.warn(intl.formatMessage({ id: "label.addAsset.warn.noAssetTypes" }));
      }
    }).catch((err) => {
      var _a2, _b;
      console.error(err);
      toast.error(((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "label.addAsset.error.fetchTypes" }));
    });
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadAssetTypes();
  }, [loadAssetTypes, intl.locale]);
  reactExports.useEffect(() => {
    setEntryData({});
    setSelectedApiCode("");
  }, [selectedRow]);
  const onSelectType = (apiCode) => {
    setSelectedApiCode(apiCode);
    setEntryData({ szAssetType: apiCode });
  };
  const onEntryChange = (key, value) => {
    setEntryData((prev) => ({ ...prev, [key]: value }));
  };
  const resetAll = () => {
    setEntryData({});
    setSelectedApiCode("");
    return Promise.resolve({ data: { status: "Success" } });
  };
  const handleSaveNew = () => {
    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "label.addAsset.error.noAccount" }));
      return Promise.reject(new Error("no account"));
    }
    if (!selectedApiCode) {
      toast.error(intl.formatMessage({ id: "error.asset.assetType.mandatory" }));
      return Promise.reject(new Error("type"));
    }
    const selectedOption = assetTypeOptions.find((opt) => opt.apiCode === selectedApiCode);
    const apiAssetType = (selectedOption == null ? void 0 : selectedOption.apiCode) || selectedApiCode;
    const validationType = (selectedOption == null ? void 0 : selectedOption.formType) || apiAssetType;
    const err = validateAssetPayload(validationType, entryData, intl);
    if (err) {
      toast.error(err);
      return Promise.reject(new Error("validation"));
    }
    setSaving(true);
    const payload = buildSaveAssetPayload({
      selectedRow,
      assetType: apiAssetType,
      assetData: entryData,
      lnAssetSeqNo: null
    });
    return Kr.POST(AssetsAPI.Assets(screenMenuId), payload).then((res) => {
      if (isApiSuccess(res)) {
        setEntryData({});
        setSelectedApiCode("");
        return { success: true };
      }
      if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        toast.error(res.data.msg || intl.formatMessage({ id: "label.addAsset.error.save" }));
      }
      return Promise.reject(new Error("save"));
    }).catch((err2) => {
      var _a2;
      console.error(err2);
      if ((err2 == null ? void 0 : err2.message) !== "save" && (err2 == null ? void 0 : err2.message) !== "validation") {
        const data = (_a2 = err2.response) == null ? void 0 : _a2.data;
        if ((data == null ? void 0 : data.message) === "Validation Failed" && (data == null ? void 0 : data.responseJson)) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error((data == null ? void 0 : data.message) || (data == null ? void 0 : data.msg) || intl.formatMessage({ id: "label.addAsset.error.save" }));
        }
      }
      throw err2;
    }).finally(() => setSaving(false));
  };
  const canSaveNew = selectedRow && selectedApiCode && !saving;
  const { themeVars, surfaces, text } = $e();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.addAsset.screenTitle" }),
      contentPaddingTop: 0,
      scrollMode: "contain",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            ...themeVars,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            width: "100%",
            bgcolor: surfaces.panel,
            color: text.primary
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.scrollBody, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.stack, children: !selectedRow ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.card, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardContent, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: styles.mutedNote, children: intl.formatMessage({ id: "label.addAsset.error.noAccount" }) }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              AddAssetEntrySection,
              {
                assetTypeOptions,
                selectedApiCode,
                selectedFormType: ((_a = assetTypeOptions.find((opt) => opt.apiCode === selectedApiCode)) == null ? void 0 : _a.formType) || selectedApiCode,
                onSelectType,
                entryData,
                onEntryChange,
                ownerTypeOptions
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.barWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: canSaveNew ? handleSaveNew : void 0,
                onReset: (selectedApiCode || Object.keys(entryData).length > 0) && !saving ? resetAll : void 0,
                onClose: () => navigate("/homelayout/welcomepage"),
                disableToast: { close: true }
              }
            ) })
          ]
        }
      )
    }
  );
}
export {
  AddAssetScreen as default
};
