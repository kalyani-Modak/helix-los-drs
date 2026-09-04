import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, aT as Inventory2, bR as SettingsOutlined, a9 as DirectionsCar, dN as reactExports, aW as Kg, b0 as Lg, dK as ps, cs as ap, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, aX as Kr, l as AssetSummaryAPI, m as AssetsAPI, cf as Typography, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { D as DiamondOutlined } from "./DiamondOutlined-BT-0jzD2.js";
const Apartment = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M17 11V3H7v4H3v14h8v-4h2v4h8V11zM7 19H5v-2h2zm0-4H5v-2h2zm0-4H5V9h2zm4 4H9v-2h2zm0-4H9V9h2zm0-4H9V5h2zm4 8h-2v-2h2zm0-4h-2V9h2zm0-4h-2V5h2zm4 12h-2v-2h2zm0-4h-2v-2h2z"
}));
function normalizeAssetType(szAssetType) {
  const u = String(szAssetType ?? "").toUpperCase();
  if (u.includes("AUTO") || u === "AU") return "AUTO";
  if (u.includes("JEWEL")) return "JEWEL";
  if (u.includes("MACHINE") || u.includes("MACHIN")) return "MACHINE";
  if (u.includes("PROPERTY") || u.includes("PROP")) return "PROPERTY";
  return "UNKNOWN";
}
function getNormalizedTypeFromAsset(asset) {
  var _a;
  return ((_a = asset == null ? void 0 : asset.assetTypeMeta) == null ? void 0 : _a.normalizedType) || normalizeAssetType(asset == null ? void 0 : asset.szAssetType);
}
const AUTO_DETAILS_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szProductType", labelId: "label.AssetSummary.detail.productType", fallbackKeys: ["szAssetType"] },
  { key: "szMake", labelId: "label.AssetSummary.detail.make" },
  { key: "szModel", labelId: "label.AssetSummary.detail.model" },
  { key: "inYearMfg", labelId: "label.AssetSummary.detail.modelYear" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 3 },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" }
];
const AUTO_IDENTIFICATION_FIELDS = [
  { key: "szEnginNo", labelId: "label.AssetSummary.detail.engineNo" },
  { key: "szEnginCapacity", labelId: "label.AssetSummary.detail.engineCapacity" },
  { key: "szChasisNo", labelId: "label.AssetSummary.detail.chassisNo" },
  { key: "szRegNo", labelId: "label.AssetSummary.detail.registrationNo" },
  { key: "szInsuPolicyNo", labelId: "label.AssetSummary.detail.policyNo" },
  { key: "szInsuCompany", labelId: "label.AssetSummary.detail.insuranceCompany" }
];
const JEWEL_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "dtValue", labelId: "label.AssetSummary.detail.valuationDate" },
  { key: "szValuer", labelId: "label.AssetSummary.detail.valuer" },
  { key: "szValuerType", labelId: "label.AssetSummary.detail.valuerType" },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" }
];
const MACHINE_FIELDS = [
  { key: "szMachineName", labelId: "label.AssetSummary.detail.machineName" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "szInvoiceNo", labelId: "label.AssetSummary.detail.invoiceNo" },
  { key: "dtInvoice", labelId: "label.AssetSummary.detail.purchaseDate" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "dtValue", labelId: "label.AssetSummary.detail.valuationDate" },
  { key: "szValuer", labelId: "label.AssetSummary.detail.valuer" },
  { key: "szValuerType", labelId: "label.AssetSummary.detail.valuerType" },
  { key: "inOwnershipPercent", labelId: "label.AssetSummary.detail.ownershipPercent" }
];
const PROPERTY_FIELDS = [
  { key: "szAssetCode", labelId: "label.AssetSummary.detail.refNo" },
  { key: "szDesc", labelId: "label.AssetSummary.detail.description", colSpan: 2 },
  { key: "bdLandArea", labelId: "label.AssetSummary.detail.landArea" },
  { key: "bdBuiltArea", labelId: "label.AssetSummary.detail.builtUpArea" },
  { key: "bdCurrentValue", labelId: "label.AssetSummary.detail.value" },
  { key: "bdNorth", labelId: "label.AssetSummary.detail.northBoundaries" },
  { key: "bdEast", labelId: "label.AssetSummary.detail.eastBoundaries" },
  { key: "bdWest", labelId: "label.AssetSummary.detail.westBoundaries" },
  { key: "szFlatNo", labelId: "label.AssetSummary.detail.flatNo" },
  { key: "szFloorNo", labelId: "label.AssetSummary.detail.floorNo" },
  { key: "szPlotNo", labelId: "label.AssetSummary.detail.plotNo" },
  { key: "szSurveyNo", labelId: "label.AssetSummary.detail.citySurveyNo" },
  { key: "szKhasaraNo", labelId: "label.AssetSummary.detail.khasaraNo" },
  { key: "szArea", labelId: "label.AssetSummary.detail.townArea" },
  { key: "szTaluka", labelId: "label.AssetSummary.detail.taluka" },
  { key: "szDistrict", labelId: "label.AssetSummary.detail.district" },
  { key: "szOwner", labelId: "label.AssetSummary.detail.owner" },
  { key: "szPropertyNo", labelId: "label.AssetSummary.detail.registrationNo" },
  { key: "szOwnerType", labelId: "label.AssetSummary.detail.ownerType" }
];
function getDetailLayoutForNormalizedType(normalized) {
  switch (normalized) {
    case "AUTO":
      return { kind: "AUTO_TABS", fields: AUTO_DETAILS_FIELDS, identification: AUTO_IDENTIFICATION_FIELDS };
    case "JEWEL":
      return { kind: "SINGLE", fields: JEWEL_FIELDS };
    case "MACHINE":
      return { kind: "SINGLE", fields: MACHINE_FIELDS };
    case "PROPERTY":
      return { kind: "SINGLE", fields: PROPERTY_FIELDS };
    default:
      return { kind: "SINGLE", fields: [] };
  }
}
const page = "_page_1vq17_2";
const summaryLoading = "_summaryLoading_1vq17_12";
const summaryLoadingLabel = "_summaryLoadingLabel_1vq17_22";
const summarySpinner = "_summarySpinner_1vq17_28";
const cardGridWrap = "_cardGridWrap_1vq17_45";
const cardGridWrapBusy = "_cardGridWrapBusy_1vq17_50";
const cardGridBusyOverlay = "_cardGridBusyOverlay_1vq17_54";
const cardGrid = "_cardGrid_1vq17_45";
const assetCard = "_assetCard_1vq17_88";
const assetCardActive = "_assetCardActive_1vq17_115";
const assetCardIconWrap = "_assetCardIconWrap_1vq17_123";
const assetCardIconWrapActive = "_assetCardIconWrapActive_1vq17_134";
const assetCardIcon = "_assetCardIcon_1vq17_123";
const assetCardText = "_assetCardText_1vq17_148";
const assetCardType = "_assetCardType_1vq17_153";
const assetCardCode = "_assetCardCode_1vq17_165";
const detailCard = "_detailCard_1vq17_176";
const detailHeader = "_detailHeader_1vq17_184";
const detailTitle = "_detailTitle_1vq17_192";
const codeBadge = "_codeBadge_1vq17_200";
const detailBody = "_detailBody_1vq17_210";
const tabsRoot = "_tabsRoot_1vq17_214";
const detailFieldGrid = "_detailFieldGrid_1vq17_221";
const span2 = "_span2_1vq17_228";
const span3 = "_span3_1vq17_232";
const fieldBlock = "_fieldBlock_1vq17_236";
const bannerError = "_bannerError_1vq17_249";
const bannerMuted = "_bannerMuted_1vq17_256";
const floatingBarSlot = "_floatingBarSlot_1vq17_263";
const styles = {
  page,
  summaryLoading,
  summaryLoadingLabel,
  summarySpinner,
  cardGridWrap,
  cardGridWrapBusy,
  cardGridBusyOverlay,
  cardGrid,
  assetCard,
  assetCardActive,
  assetCardIconWrap,
  assetCardIconWrapActive,
  assetCardIcon,
  assetCardText,
  assetCardType,
  assetCardCode,
  detailCard,
  detailHeader,
  detailTitle,
  codeBadge,
  detailBody,
  tabsRoot,
  detailFieldGrid,
  span2,
  span3,
  fieldBlock,
  bannerError,
  bannerMuted,
  floatingBarSlot
};
function pickIcon(asset) {
  switch (getNormalizedTypeFromAsset(asset)) {
    case "AUTO":
      return DirectionsCar;
    case "JEWEL":
      return DiamondOutlined;
    case "MACHINE":
      return SettingsOutlined;
    case "PROPERTY":
      return Apartment;
    default:
      return Inventory2;
  }
}
function isSameAsset(a, b) {
  if (!a || !b) return false;
  const sa = a.lnAssetSeqNo;
  const sb = b.lnAssetSeqNo;
  if (sa != null && sb != null) return sa === sb;
  return a === b;
}
function AssetSummaryCardPicker({
  assets,
  loading,
  selectedAsset,
  onSelect
}) {
  const intl = useIntl();
  if (!(assets == null ? void 0 : assets.length)) {
    if (loading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.summaryLoading, "aria-busy": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.summarySpinner, "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.summaryLoadingLabel, children: intl.formatMessage({ id: "label.AssetSummary.cards.loading" }) })
      ] });
    }
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `${styles.cardGridWrap} ${loading ? styles.cardGridWrapBusy : ""}`,
      "aria-busy": loading ? "true" : "false",
      children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.cardGridBusyOverlay, "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.summarySpinner }) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: styles.cardGrid,
            role: "list",
            "aria-label": intl.formatMessage({ id: "label.AssetSummary.cards.ariaList" }),
            children: assets.map((asset, index) => {
              var _a;
              const Icon = pickIcon(asset);
              const active = isSameAsset(selectedAsset, asset);
              const key = asset.lnAssetSeqNo ?? `asset-${index}`;
              const typeLabel = String(((_a = asset.assetTypeMeta) == null ? void 0 : _a.label) ?? asset.szAssetType ?? "").trim() || "-";
              const descriptionLabel = String(asset.szDesc ?? "").trim() || "-";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  role: "listitem",
                  className: `${styles.assetCard} ${active ? styles.assetCardActive : ""}`,
                  onClick: () => onSelect(asset),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(asset);
                    }
                  },
                  tabIndex: 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `${styles.assetCardIconWrap} ${active ? styles.assetCardIconWrapActive : ""}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: styles.assetCardIcon, "aria-hidden": true })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.assetCardText, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.assetCardType, children: typeLabel }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.assetCardCode, children: descriptionLabel })
                    ] })
                  ]
                },
                key
              );
            })
          }
        )
      ]
    }
  );
}
function formatDisplayValue(val) {
  if (val == null) return "";
  if (typeof val === "object") return JSON.stringify(val);
  const s = String(val);
  if (s.includes("T") && s.length >= 10 && /\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.replace("T", " ").replace(/\.\d+Z?$/, "").substring(0, 19);
  }
  return s;
}
function getFieldValue(data, fieldDef) {
  var _a;
  const ownValue = data == null ? void 0 : data[fieldDef.key];
  if (ownValue != null && ownValue !== "") return ownValue;
  const fallbackKey = (_a = fieldDef.fallbackKeys) == null ? void 0 : _a.find((key) => {
    const fallbackValue = data == null ? void 0 : data[key];
    return fallbackValue != null && fallbackValue !== "";
  });
  return fallbackKey ? data[fallbackKey] : ownValue;
}
function DetailField({ fieldDef, value }) {
  const display = formatDisplayValue(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.fieldBlock, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: fieldDef.labelId, align: "left", colon: false }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { editable: false, value: display, translate: false, width: "100%" })
  ] });
}
function FieldGrid({ fields, data }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.detailFieldGrid, children: fields.map((f) => {
    const span = f.colSpan === 3 ? styles.span3 : f.colSpan === 2 ? styles.span2 : "";
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: span, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DetailField, { fieldDef: f, value: getFieldValue(data, f) }) }, f.key);
  }) });
}
function AssetDetailPanel({ selectedAsset }) {
  var _a;
  const intl = useIntl();
  const [autoTab, setAutoTab] = reactExports.useState("details");
  const normalized = reactExports.useMemo(
    () => getNormalizedTypeFromAsset(selectedAsset),
    [selectedAsset]
  );
  const layout = reactExports.useMemo(() => getDetailLayoutForNormalizedType(normalized), [normalized]);
  if (!selectedAsset) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "outlined", elevation: 0, className: styles.detailCard, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.detailBody, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.bannerMuted, children: intl.formatMessage({ id: "label.AssetSummary.detail.selectRow" }) }) }) });
  }
  const typeLabel = String(((_a = selectedAsset.assetTypeMeta) == null ? void 0 : _a.label) ?? selectedAsset.szAssetType ?? "");
  const code = String(selectedAsset.szAssetCode ?? "");
  if (normalized === "UNKNOWN") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, className: styles.detailCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.detailHeader, children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles.detailTitle, children: intl.formatMessage({ id: "label.AssetSummary.detail.unsupportedTitle" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.detailBody, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.bannerMuted, children: intl.formatMessage(
        { id: "label.AssetSummary.detail.unsupportedBody" },
        { type: typeLabel }
      ) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Kg, { variant: "outlined", elevation: 0, className: styles.detailCard, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.detailHeader, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles.detailTitle, children: intl.formatMessage(
        { id: "label.AssetSummary.detail.titleWithType" },
        { type: typeLabel }
      ) }),
      code ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.codeBadge, children: code }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.detailBody, children: layout.kind === "AUTO_TABS" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.tabsRoot, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: "label.AssetSummary.tab.assetDetails",
            variant: autoTab === "details" ? "contained" : "outlined",
            size: "small",
            onClick: () => setAutoTab("details"),
            sx: { minHeight: 28, fontSize: 10, textTransform: "none" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: "label.AssetSummary.tab.assetIdentification",
            variant: autoTab === "identification" ? "contained" : "outlined",
            size: "small",
            onClick: () => setAutoTab("identification"),
            sx: { minHeight: 28, fontSize: 10, textTransform: "none" }
          }
        )
      ] }),
      autoTab === "details" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGrid, { fields: layout.fields, data: selectedAsset }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGrid, { fields: layout.identification, data: selectedAsset })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FieldGrid, { fields: layout.fields, data: selectedAsset }) })
  ] });
}
function normalizeComparableAssetType(value) {
  return String(value ?? "").trim().toUpperCase().replace(/^LABEL\.ASSET\./, "").replace(/[\s_-]+/g, "");
}
function formatAssetTypeTileLabel(apiCode, intl, szDesc) {
  const raw = intl.formatMessage({ id: szDesc, defaultMessage: szDesc || apiCode });
  return String(raw).split(/\s+/).map((w) => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : "").filter(Boolean).join(" ");
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
function getAssetTypeList(payload) {
  return Array.isArray(payload) ? payload : findListByKey(payload, ["assettype", "asset"]);
}
function buildAssetTypeMeta(item, intl) {
  const labelId = (item == null ? void 0 : item.szi18nDesc) || (item == null ? void 0 : item.szDesc) || "";
  const code = String(
    (item == null ? void 0 : item.szCondition) ?? (item == null ? void 0 : item.value) ?? (item == null ? void 0 : item.szCode) ?? (item == null ? void 0 : item.code) ?? (item == null ? void 0 : item.id) ?? ""
  ).trim();
  const label = formatAssetTypeTileLabel(code, intl, labelId);
  return {
    code,
    labelId,
    label,
    normalizedType: normalizeAssetType(`${code} ${labelId} ${label}`)
  };
}
function findAssetTypeMeta(assetType, assetTypeMetas) {
  const assetTypeKey = normalizeComparableAssetType(assetType);
  return assetTypeMetas.find((meta) => {
    var _a;
    const keys = [
      meta.code,
      meta.label,
      meta.labelId,
      (_a = meta.labelId) == null ? void 0 : _a.split(".").pop()
    ];
    return keys.some((key) => normalizeComparableAssetType(key) === assetTypeKey) || normalizeAssetType(assetType) === meta.normalizedType;
  }) ?? null;
}
function enrichRow(item, index, assetTypeMetas) {
  const assetTypeMeta = findAssetTypeMeta(item == null ? void 0 : item.szAssetType, assetTypeMetas);
  return {
    ...item,
    assetTypeMeta,
    gridRowId: item.lnAssetSeqNo ?? index
  };
}
function isSuccessStatus(data) {
  if (!data) return false;
  const s = data.status;
  if (typeof s === "string") return s.toLowerCase() === "success";
  return s === 200 || s === "200";
}
function AssetSummaryScreen() {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const [rowData, setRowData] = reactExports.useState([]);
  const [assetTypeMetas, setAssetTypeMetas] = reactExports.useState([]);
  const [summaryLoading2, setSummaryLoading] = reactExports.useState(false);
  const [summaryError, setSummaryError] = reactExports.useState(null);
  const [selectedAsset, setSelectedAsset] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const loadSummary = reactExports.useCallback(
    async (preserveSeqNo) => {
      var _a, _b;
      if (!selectedRow) {
        setRowData([]);
        setSelectedAsset(null);
        setSummaryError(null);
        setSummaryLoading(false);
        return;
      }
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const res = await Kr.GET(
          `${AssetSummaryAPI.AssetSummary(screenMenuId)}/fetchAssetSummary`
        );
        const data = res.data;
        if (isSuccessStatus(data) && Array.isArray(data.responseJson)) {
          const mapped = data.responseJson.map(
            (item, idx) => enrichRow(item, idx, assetTypeMetas)
          );
          setRowData(mapped);
          if (preserveSeqNo != null) {
            const found = mapped.find((r) => r.lnAssetSeqNo === preserveSeqNo);
            setSelectedAsset(found ?? (mapped[0] ?? null));
          } else {
            setSelectedAsset(mapped[0] ?? null);
          }
        } else if ((data == null ? void 0 : data.status) === "Failure" && (data == null ? void 0 : data.message) === "Validation Failed") {
          setRowData([]);
          setSelectedAsset(null);
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          setRowData([]);
          setSelectedAsset(null);
          setSummaryError(null);
        }
      } catch (error) {
        console.error("Asset Summary fetch error:", error);
        setRowData([]);
        setSelectedAsset(null);
        setSummaryError(
          intl.formatMessage({ id: "label.AssetSummary.error.loadFailed" })
        );
        toast.error(
          ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "label.AssetSummary.error.network" })
        );
      } finally {
        setSummaryLoading(false);
      }
    },
    [assetTypeMetas, selectedRow, intl, toast]
  );
  reactExports.useEffect(() => {
    let cancelled = false;
    Kr.GET(AssetsAPI.Assets(screenMenuId)).then((res) => {
      const data = res.data;
      const assetTypeList = getAssetTypeList(data == null ? void 0 : data.responseJson);
      if (!cancelled && isSuccessStatus(data) && Array.isArray(assetTypeList)) {
        setAssetTypeMetas(assetTypeList.map((item) => buildAssetTypeMeta(item, intl)));
      }
    }).catch((error) => {
      console.error("Asset type fetch error:", error);
    });
    return () => {
      cancelled = true;
    };
  }, [intl]);
  reactExports.useEffect(() => {
    loadSummary(void 0);
  }, [selectedRow, loadSummary]);
  const handleRefresh = reactExports.useCallback(() => {
    const seq = selectedAsset == null ? void 0 : selectedAsset.lnAssetSeqNo;
    return loadSummary(seq);
  }, [loadSummary, selectedAsset == null ? void 0 : selectedAsset.lnAssetSeqNo]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.AssetSummary.title" }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.page, children: [
        !selectedRow ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: styles.bannerMuted, children: intl.formatMessage({ id: "label.AssetSummary.noAccount" }) }) : null,
        summaryError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: styles.bannerError, children: summaryError }) : null,
        selectedRow && !summaryLoading2 && rowData.length === 0 && !summaryError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: styles.bannerMuted, children: intl.formatMessage({ id: "label.AssetSummary.empty" }) }) : null,
        selectedRow ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          AssetSummaryCardPicker,
          {
            assets: rowData,
            loading: summaryLoading2,
            selectedAsset,
            onSelect: setSelectedAsset
          }
        ) : null,
        selectedRow ? /* @__PURE__ */ jsxRuntimeExports.jsx(AssetDetailPanel, { selectedAsset }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.floatingBarSlot, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onReset: handleRefresh,
            onClose: () => navigate("/homelayout/welcomepage"),
            disableToast: { reset: true, close: true }
          }
        ) })
      ] })
    }
  );
}
export {
  AssetSummaryScreen as default
};
