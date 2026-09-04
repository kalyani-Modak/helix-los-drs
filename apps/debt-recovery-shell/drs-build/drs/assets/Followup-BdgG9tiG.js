import { cH as createSvgIcon, dB as jsxRuntimeExports, ed as useIntl, em as useTheme, ct as ar, el as useSelector, ac as Dt, dK as ps, cr as alpha, bH as SE, dD as lE, cs as ap, cg as Ug, C as CE, aX as Kr, cM as fetchCustomerAddressAPI, eh as useNavigate, dN as reactExports, ef as useLocation, aG as FollowupAPI, t as Block, u as BoltOutlinedIcon, b0 as Lg, cI as dayjs, aa as Divider, cf as Typography, aR as IconButton, a1 as DeleteOutlineIcon, bV as Stack, w as Button, aW as Kg, cJ as dc, dm as gridResultDefObj, bI as SEARCH_API_ENDPOINTS, da as gridActionDefObj, dI as pp, cB as cc, cl as VisibilityOutlined, a3 as DescriptionOutlinedIcon, S as Collapse, cj as Vg, cz as buildUpdateFollowupRequest, cy as bu, aM as Grid } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { C as Call } from "./Call-DxIyuu8_.js";
import { a as PhoneMissed, P as PhoneDisabled, S as Smartphone, N as NearMeOutlinedIcon } from "./Smartphone-b9hlPxr7.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { H as HistoryOutlined } from "./HistoryOutlined-CWU8xApR.js";
import { A as AccessTimeOutlined } from "./AccessTimeOutlined-Cg2of2l-.js";
const LocalShippingOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zm-.5 1.5 1.96 2.5H17V9.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"
}));
const PickUp = ({ pickUpData, setPickUpData, embedded = false, addressTypeOptions = [] }) => {
  const intl = useIntl();
  useTheme();
  const toast = ar();
  const { selectedRow } = useSelector((state) => state.account);
  const handleChange = (field) => (e) => {
    var _a;
    const newVal = ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e;
    if (field === "szAddressType") {
      if (newVal === null || newVal === void 0 || String(newVal).trim() === "") {
        setPickUpData((prev) => ({
          ...prev,
          szAddressType: "",
          szContactPerson: "",
          szAddress: "",
          szPhone: "",
          szMobile: ""
        }));
        return;
      }
      const requestData = {
        szAddressType: newVal
      };
      Kr.POST(
        fetchCustomerAddressAPI.fetchCustomerAddress,
        requestData
      ).then((res) => {
        var _a2;
        const { status, message, responseJson } = res.data || {};
        if ((status == null ? void 0 : status.toLowerCase()) === "success") {
          const address = ((_a2 = res.data) == null ? void 0 : _a2.responseJson) ?? {};
          setPickUpData((prev) => ({
            ...prev,
            szAddressType: newVal,
            szContactPerson: address.szContactPerson || "",
            szAddress: address.szAddress1 || "",
            szPhone: address.szPhone1 || "",
            szMobile: address.szMobileNo || ""
          }));
          return;
        }
        if ((status == null ? void 0 : status.toLowerCase()) === "failure" && message === "Validation Failed") {
          handleValidationErrors(intl, toast, responseJson);
          return;
        }
        toast.error(message || "Failed to fetch customer address");
      }).catch((err) => {
        var _a2, _b;
        console.error("API Error", err);
        toast.error(
          ((_b = (_a2 = err.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Unable to fetch customer address"
        );
      });
      return;
    }
    setPickUpData((prev) => ({ ...prev, [field]: newVal }));
  };
  const fieldWrapperSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%"
  };
  const formContent = /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { width: "100%", boxSizing: "border-box" }, children: [
    embedded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.1,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[900], 0.03)
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            LocalShippingOutlinedIcon,
            {
              sx: { fontSize: 14, color: "primary.main" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.followup.pickupDetailsTitle",
                defaultMessage: "Pick up details"
              }),
              colon: false,
              align: "left",
              component: "div",
              sx: {
                fontSize: "0.875rem",
                fontWeight: 700,
                lineHeight: 1.2
              }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "grid",
          gap: 1.5,
          px: embedded ? 2.5 : 0,
          pt: embedded ? 1.5 : 0,
          pb: embedded ? 1.5 : 0,
          width: "100%",
          boxSizing: "border-box"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              sx: {
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: { xs: "1fr", lg: "repeat(4, minmax(0, 1fr))" }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.VisitFor"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SE,
                    {
                      name: "visitFor",
                      value: pickUpData.szVisitFor,
                      onChange: handleChange("szVisitFor"),
                      options: [{ label: "Pick Up", value: "P" }],
                      required: false,
                      disabled: false,
                      readOnly: false,
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.VisitFor.placeholder"
                      }),
                      width: "100%",
                      fullWidth: true,
                      align: lE.TEXT
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.AddressType"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SE,
                    {
                      name: "addressType",
                      value: pickUpData.szAddressType,
                      onChange: handleChange("szAddressType"),
                      options: addressTypeOptions,
                      required: false,
                      disabled: false,
                      readOnly: false,
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.AddressType.placeholder"
                      }),
                      width: "100%",
                      fullWidth: true,
                      align: lE.TEXT
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.ContactPerson"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szContactPerson || "",
                      onChange: handleChange("szContactPerson"),
                      editable: true,
                      disabled: false,
                      required: false,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.ContactPerson"
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.Address"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szAddress || "",
                      onChange: handleChange("szAddress"),
                      editable: true,
                      disabled: false,
                      required: false,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.Address"
                      })
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              sx: {
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(6, minmax(0, 1fr))"
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({ id: "label.followup.PickUp.Phone" }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szPhone || "",
                      onChange: handleChange("szPhone"),
                      editable: true,
                      disabled: false,
                      required: false,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.Phone"
                      }),
                      type: "number"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({ id: "label.followup.PickUp.Mobile" }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szMobile || "",
                      onChange: handleChange("szMobile"),
                      editable: true,
                      disabled: false,
                      required: false,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.Mobile"
                      }),
                      type: "number"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.RequestDate"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Ug,
                    {
                      value: pickUpData.dtVisitDate,
                      onChange: (newValue) => setPickUpData((prev) => ({
                        ...prev,
                        dtVisitDate: newValue
                      })),
                      align: lE.DATE,
                      sx: { width: "100%" },
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.RequestDate"
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({ id: "label.followup.PickUp.Amount" }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.bdVisitForAmt ?? "",
                      onChange: handleChange("bdVisitForAmt"),
                      editable: true,
                      disabled: false,
                      required: false,
                      align: lE.NUMBER,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.Amount"
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.ToGroup"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szPickupCollectorGrp,
                      onChange: handleChange("szPickupCollectorGrp"),
                      required: false,
                      disabled: false,
                      editable: true,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.ToGroup"
                      })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldWrapperSx, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.PickUp.ToCollector"
                      }),
                      disabled: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      value: pickUpData.szPickupCollector,
                      onChange: handleChange("szPickupCollector"),
                      required: false,
                      disabled: false,
                      editable: true,
                      align: lE.TEXT,
                      width: "100%",
                      placeholder: intl.formatMessage({
                        id: "label.followup.PickUp.ToCollector"
                      }),
                      cd: true
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
  if (embedded) {
    return formContent;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CE,
    {
      title: intl.formatMessage({ id: "label.followup.PickUp" }),
      detailsHeight: 120,
      children: formContent
    }
  );
};
const DISPOSITION_IDS = {
  connected: "connected",
  no_answer: "no_answer",
  busy: "busy",
  switched_off: "switched_off",
  refused: "refused",
  promise_to_pay: "promise_to_pay"
};
const AUTO_SUGGESTIONS = {
  [DISPOSITION_IDS.connected]: { nextAction: "oc", daysAhead: 3, resultCode: "CN" },
  [DISPOSITION_IDS.no_answer]: { nextAction: "oc", daysAhead: 1, resultCode: "NA" },
  [DISPOSITION_IDS.busy]: { nextAction: "oc", daysAhead: 0, resultCode: "NC" },
  [DISPOSITION_IDS.switched_off]: { nextAction: "sms", daysAhead: 1, resultCode: "CNT" },
  [DISPOSITION_IDS.refused]: { nextAction: "escalate", daysAhead: 2, resultCode: "RTP" },
  [DISPOSITION_IDS.promise_to_pay]: { nextAction: "oc", daysAhead: 0, resultCode: "PTP" }
};
function addDaysToDate(base, days) {
  return dayjs(base).add(days, "day");
}
function dispositionTonePalette(theme, tone) {
  switch (tone) {
    case "success":
      return theme.palette.success;
    case "warning":
      return theme.palette.warning;
    case "error":
      return theme.palette.error;
    default:
      return theme.palette.primary;
  }
}
function dispositionButtonSx(theme, tone, active) {
  const pal = dispositionTonePalette(theme, tone);
  const main = pal.main;
  const fg = theme.palette.mode === "dark" ? pal.light : pal.dark;
  return {
    textTransform: "none",
    fontSize: 11,
    fontWeight: 500,
    minHeight: 28,
    maxHeight: 28,
    px: 1.25,
    py: 0,
    lineHeight: 1.2,
    borderRadius: 1.5,
    border: `1px solid ${alpha(main, 0.3)}`,
    bgcolor: alpha(main, active ? 0.24 : 0.1),
    color: fg,
    boxShadow: "none",
    "& .MuiButton-startIcon": { mr: 0.5, ml: -0.25 },
    "&:hover": {
      bgcolor: alpha(main, active ? 0.28 : 0.18),
      borderColor: alpha(main, 0.45)
    },
    ...active && {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`
    }
  };
}
function mapFollowupDropdownOptions(list = [], intl) {
  return (Array.isArray(list) ? list : []).map((item) => {
    if (!item || typeof item !== "object") return null;
    const value = item.szCondition ?? "";
    return value ? {
      value,
      label: item.szi18nDesc ? intl.formatMessage({
        id: item.szi18nDesc,
        defaultMessage: item.szCondition
      }) : item.szDesc ?? item.szCondition
    } : null;
  }).filter(Boolean);
}
function FollowupDetails({ onSaved }) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);
  const recordPanelBorder = alpha(
    theme.palette.primary.main,
    theme.palette.mode === "dark" ? 0.3 : 0.18
  );
  theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.08) : alpha(theme.palette.grey[900], 0.03);
  const [pickUpRequired, setPickUpRequired] = reactExports.useState(false);
  const [isActive2, setIsActive2] = reactExports.useState(false);
  const [isActive3, setIsActive3] = reactExports.useState(false);
  const [selectedDisposition, setSelectedDisposition] = reactExports.useState("");
  const [actionCode, setActionCode] = reactExports.useState("");
  const [resultCode, setResultCode] = reactExports.useState("");
  const [generatedPromises, setGeneratedPromises] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const attemptToday = 3;
  const maxAttempts = 5;
  const [followupData, setFollowupData] = reactExports.useState({
    nextAction: "",
    nextActionDate: "",
    promiseStartDate: "",
    frequency: "",
    promiseAmount: "",
    numberOfPromises: "",
    delinquencyReason: "",
    bestTimeToCall: "",
    partyContacted: "",
    modeOfContact: "",
    placeOfContact: "",
    contactPerson: ""
  });
  const [partyContactedOptions, setPartyContactedOptions] = reactExports.useState([]);
  const [delinquencyReasonOptions, setDelinquencyReasonOptions] = reactExports.useState([]);
  const [addressTypeOptions, setAddressTypeOptions] = reactExports.useState([]);
  const [objErrors, setObjErrors] = reactExports.useState({
    action: false,
    result: false,
    delinquencyReason: false,
    promiseStartDate: false,
    frequency: false,
    promiseAmount: false,
    numberOfPromises: false,
    generatedPromises: false
  });
  const [pickUpData, setPickUpData] = reactExports.useState({
    szVisitFor: "",
    szAddressType: "",
    szContactPerson: "",
    dtVisitDate: "",
    szPhone: "",
    szMobile: "",
    szPickupCollectorGrp: "",
    szPickupCollector: "",
    bdVisitForAmt: "",
    szAddress: ""
  });
  const fetchFollowupDropdowns = reactExports.useCallback(async () => {
    var _a, _b;
    try {
      const response = await Kr.GET(FollowupAPI.Followup(screenMenuId) + `/initializeddropdowns`, {}, {}, false, {}, { cache: true, cacheKey: "FollowupDetails" });
      const payload = ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.responseJson) || ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.data) || (response == null ? void 0 : response.data) || {};
      setPartyContactedOptions(
        mapFollowupDropdownOptions(payload.lstPartyContacted, intl)
      );
      setDelinquencyReasonOptions(
        mapFollowupDropdownOptions(payload.lstDelqReason, intl)
      );
      setAddressTypeOptions(
        mapFollowupDropdownOptions(payload.lstAddressTypes, intl)
      );
    } catch (error) {
      console.error("Error fetching followup dropdowns:", error);
      toast.error(
        intl.formatMessage({
          id: "error.followup.dropdown.fetch",
          defaultMessage: "Error fetching followup dropdown values."
        })
      );
    }
  }, [intl]);
  reactExports.useEffect(() => {
    fetchFollowupDropdowns();
  }, [fetchFollowupDropdowns]);
  const dispositionButtons = reactExports.useMemo(
    () => [
      {
        id: DISPOSITION_IDS.connected,
        labelId: "label.followup.disposition.connected",
        Icon: Call,
        tone: "success"
      },
      {
        id: DISPOSITION_IDS.no_answer,
        labelId: "label.followup.disposition.noAnswer",
        Icon: PhoneMissed,
        tone: "warning"
      },
      {
        id: DISPOSITION_IDS.busy,
        labelId: "label.followup.disposition.busy",
        Icon: PhoneDisabled,
        tone: "primary"
      },
      {
        id: DISPOSITION_IDS.switched_off,
        labelId: "label.followup.disposition.switchedOff",
        Icon: Smartphone,
        tone: "error"
      },
      {
        id: DISPOSITION_IDS.refused,
        labelId: "label.followup.disposition.refused",
        Icon: Block,
        tone: "error"
      },
      {
        id: DISPOSITION_IDS.promise_to_pay,
        labelId: "label.followup.disposition.ptp",
        Icon: BoltOutlinedIcon,
        tone: "success"
      }
    ],
    []
  );
  reactExports.useEffect(() => {
    if (!selectedDisposition) {
      setActionCode("");
      setResultCode("");
      setFollowupData((prev) => ({ ...prev, nextAction: "", nextActionDate: "" }));
      return;
    }
    const sug = AUTO_SUGGESTIONS[selectedDisposition];
    if (!sug) return;
    const planned = addDaysToDate(/* @__PURE__ */ new Date(), sug.daysAhead);
    setActionCode(sug.nextAction);
    if (sug.resultCode) {
      setResultCode(sug.resultCode);
      clearFieldError("result");
    }
    setFollowupData((prev) => ({
      ...prev,
      nextAction: sug.nextAction,
      nextActionDate: planned
    }));
  }, [selectedDisposition]);
  const clearFieldError = (field) => {
    setObjErrors(
      (prev) => prev[field] ? { ...prev, [field]: false } : prev
    );
  };
  const isBlank = (value) => value === null || value === void 0 || value === "" || typeof value === "string" && value.trim() === "";
  const updateField = (field, errorField = field) => (event) => {
    var _a;
    const value = ((_a = event == null ? void 0 : event.target) == null ? void 0 : _a.value) ?? event;
    setFollowupData((prev) => ({ ...prev, [field]: value }));
    if (!isBlank(value)) {
      clearFieldError(errorField);
    }
  };
  const handleResultSelect = (value, row) => {
    setResultCode(value);
    if (value) clearFieldError("result");
    const rawLimitDays = row == null ? void 0 : row.iNextActionLimitDays;
    const nextActionLimitDays = Number(rawLimitDays);
    if (rawLimitDays !== void 0 && rawLimitDays !== null && String(rawLimitDays).trim() !== "" && Number.isFinite(nextActionLimitDays)) {
      setFollowupData((prev) => ({
        ...prev,
        promiseStartDate: addDaysToDate(/* @__PURE__ */ new Date(), nextActionLimitDays)
      }));
      clearFieldError("promiseStartDate");
    } else {
      setFollowupData((prev) => ({
        ...prev,
        promiseStartDate: ""
      }));
    }
  };
  const isPtpResult = String(resultCode || "").toUpperCase().includes("PTP");
  reactExports.useEffect(() => {
    if (isPtpResult) return;
    setObjErrors((prev) => ({
      ...prev,
      promiseStartDate: false,
      frequency: false,
      promiseAmount: false,
      numberOfPromises: false,
      generatedPromises: false
    }));
  }, [isPtpResult]);
  const validateFollowupFields = async () => {
    var _a, _b, _c, _d, _e;
    const nextErrors = {
      result: !resultCode
    };
    if (nextErrors.result) {
      setObjErrors((prev) => ({ ...prev, ...nextErrors }));
      toast.error(
        intl.formatMessage({
          id: "label.followup.requiredActionResult",
          defaultMessage: "All required fields must be filled."
        })
      );
      return false;
    }
    const formattedGeneratedPromises = generatedPromises.map((p) => ({
      ...p,
      dtPromiseDate: p.dtPromiseDate && typeof p.dtPromiseDate.format === "function" ? p.dtPromiseDate.format("YYYY-MM-DD") : p.dtPromiseDate
    }));
    const requestData = buildUpdateFollowupRequest({
      actionCode,
      resultCode,
      followupData,
      pickUpRequired,
      pickUpData,
      applyToAllAccounts: isActive3,
      generatedPromises: formattedGeneratedPromises
    });
    try {
      const res = await Kr.POST(
        FollowupAPI.Followup(screenMenuId) + `/updateFollowup`,
        requestData
      );
      if (((_b = (_a = res.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) === "success") {
        toast.success(
          res.data.msg || intl.formatMessage({
            id: "label.followup.saveSuccess",
            defaultMessage: "Followup saved successfully"
          })
        );
        if (typeof onSaved === "function") onSaved();
        setObjErrors({ action: false, result: false, delinquencyReason: false });
        return true;
      }
      toast.error(
        ((_c = res.data) == null ? void 0 : _c.msg) || intl.formatMessage({
          id: "label.followup.saveFailed",
          defaultMessage: "Failed to save followup"
        })
      );
      return false;
    } catch (err) {
      console.error(err);
      toast.error(
        ((_e = (_d = err.response) == null ? void 0 : _d.data) == null ? void 0 : _e.message) || intl.formatMessage({
          id: "label.followup.saveError",
          defaultMessage: "Error saving followup"
        })
      );
      return false;
    }
  };
  const handleSubmit = () => validateFollowupFields();
  const resetForm = () => {
    setPickUpRequired(false);
    setIsActive2(false);
    setIsActive3(false);
    setActionCode("");
    setResultCode("");
    setSelectedDisposition("");
    setObjErrors({ action: false, result: false, delinquencyReason: false });
    setFollowupData({
      nextAction: "",
      nextActionDate: "",
      promiseStartDate: "",
      frequency: "",
      promiseAmount: "",
      numberOfPromises: "",
      delinquencyReason: "",
      bestTimeToCall: "",
      partyContacted: "",
      modeOfContact: "",
      placeOfContact: "",
      contactPerson: ""
    });
  };
  const fieldGrid = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    gap: 1.5
  };
  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": {
      width: "auto"
    },
    "& .hcheckbox-label": {
      margin: 0,
      width: "auto"
      // gap: "2px !important",
    },
    "& .hcheckbox-label.MuiFormControlLabel-root": {
      // gap: "2px !important",
    },
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important",
      whiteSpace: "nowrap"
    },
    "& .hcheckbox-input": {
      paddingRight: "0px"
    }
  };
  const dateFieldCellSx = {
    minWidth: 0,
    width: "100%",
    "& .MuiTextField-root": {
      width: "100% !important"
    },
    "& .MuiInputBase-root": {
      // height: "34px !important",
      fontSize: "0.85rem"
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem"
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.1rem"
    }
  };
  const uniformFieldSx = {
    "& .MuiInputBase-root": {
      // height: "36px",
    }
  };
  const fieldCellSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    gap: 0.5
  };
  const promiseFields = /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ps,
      {
        value: intl.formatMessage({ id: "label.followup.promise.scheduleTitle" }),
        colon: false,
        translate: false,
        align: "left",
        component: "div",
        sx: {
          fontSize: "0.72rem",
          fontWeight: 700,
          mb: 1,
          lineHeight: 1.2
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: 1.5,
          alignItems: "baseline",
          mb: 1.5
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.followup.promise.startDate"
                }),
                required: true,
                colon: false,
                align: "left",
                width: "100%"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: dateFieldCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Ug,
              {
                value: followupData.promiseStartDate,
                onChange: (newVal) => {
                  setFollowupData((prev) => ({
                    ...prev,
                    promiseStartDate: newVal
                  }));
                  if (newVal) clearFieldError("promiseStartDate");
                },
                error: objErrors.promiseStartDate,
                required: true,
                sx: { width: "100%" },
                width: "100%"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.followup.promise.frequency"
                }),
                required: true,
                colon: false,
                align: "left",
                width: "100%"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SE,
              {
                value: followupData.frequency,
                onChange: (e) => updateField("frequency")(
                  e
                ),
                options: [
                  {
                    label: intl.formatMessage({
                      id: "label.followup.promise.frequency.select"
                    }),
                    value: ""
                  },
                  {
                    label: intl.formatMessage({
                      id: "label.followup.promise.frequency.weekly"
                    }),
                    value: "WEEKLY"
                  },
                  {
                    label: intl.formatMessage({
                      id: "label.followup.promise.frequency.monthly"
                    }),
                    value: "MONTHLY"
                  }
                ],
                error: objErrors.frequency,
                required: true,
                sx: { width: "100%" },
                width: "100%",
                placeholder: intl.formatMessage({
                  id: "label.followup.promise.frequency.placeholder",
                  defaultMessage: "Select frequency"
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.followup.promise.amount" }),
                required: true,
                colon: false,
                align: "left",
                width: "100%"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                sx: { ...uniformFieldSx, width: "100%" },
                width: "100%",
                value: followupData.promiseAmount,
                onChange: updateField("promiseAmount"),
                editable: true,
                error: objErrors.promiseAmount,
                required: true,
                placeholder: intl.formatMessage({
                  id: "label.followup.promise.amount"
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.followup.promise.numberOfPromises"
                }),
                required: true,
                colon: false,
                align: "left",
                width: "100%"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                sx: { ...uniformFieldSx, width: "100%" },
                width: "100%",
                value: followupData.numberOfPromises,
                onChange: updateField("numberOfPromises"),
                editable: true,
                error: objErrors.numberOfPromises,
                required: true,
                placeholder: intl.formatMessage({
                  id: "label.followup.promise.numberOfPromises"
                })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { height: "0.4rem" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                label: intl.formatMessage({
                  id: "label.followup.promise.generate"
                }),
                variant: "contained",
                sx: { height: "36px", whiteSpace: "nowrap", width: "100%" },
                onClick: () => {
                  const start = followupData.promiseStartDate ? dayjs(followupData.promiseStartDate) : null;
                  const count = Number(followupData.numberOfPromises || 0);
                  const amount = Number(followupData.promiseAmount || 0);
                  const nextErrors = {
                    promiseStartDate: !start,
                    frequency: isBlank(followupData.frequency),
                    promiseAmount: !amount,
                    numberOfPromises: !count
                  };
                  if (Object.values(nextErrors).some(Boolean)) {
                    setObjErrors((prev) => ({ ...prev, ...nextErrors }));
                    toast.error(
                      intl.formatMessage({
                        id: "label.followup.promise.fillRequired"
                      })
                    );
                    return;
                  }
                  clearFieldError("promiseStartDate");
                  clearFieldError("frequency");
                  clearFieldError("promiseAmount");
                  clearFieldError("numberOfPromises");
                  clearFieldError("generatedPromises");
                  const promises = [];
                  let current = start;
                  for (let i = 0; i < count; i++) {
                    promises.push({
                      dtPromiseDate: current,
                      bdPromiseAmt: amount
                    });
                    current = followupData.frequency === "WEEKLY" ? current.add(7, "day") : current.add(1, "month");
                  }
                  setGeneratedPromises(promises);
                }
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { my: 1.5 } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
          gap: 1.5,
          alignItems: "center",
          mb: 1
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.followup.promise.commitmentTitle"
              }),
              colon: false,
              align: "left",
              width: "auto"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, {}),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: intl.formatMessage({ id: "label.followup.promise.addRow" }),
              size: "small",
              variant: "outlined",
              sx: {
                textTransform: "none",
                fontSize: "0.7rem",
                whiteSpace: "nowrap"
              },
              onClick: () => setGeneratedPromises((prev) => [
                ...prev,
                { dtPromiseDate: dayjs(), bdPromiseAmt: "" }
              ])
            }
          )
        ]
      }
    ),
    generatedPromises.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Typography,
      {
        sx: {
          textAlign: "center",
          fontSize: "0.75rem",
          color: "text.disabled",
          py: 2
        },
        children: intl.formatMessage({ id: "label.followup.promise.emptyState" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 1 }, children: generatedPromises.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "grid",
          gridTemplateColumns: "2fr 2fr auto",
          gap: 1,
          mb: 1
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Ug,
            {
              value: row.dtPromiseDate,
              onChange: (val) => {
                const updated = [...generatedPromises];
                updated[index].dtPromiseDate = val;
                setGeneratedPromises(updated);
              },
              sx: { width: "100%" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: row.bdPromiseAmt,
              onChange: (e) => {
                const updated = [...generatedPromises];
                updated[index].bdPromiseAmt = e.target.value;
                setGeneratedPromises(updated);
              },
              editable: true,
              placeholder: "Amount",
              width: "100%",
              sx: { width: "100%" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              "aria-label": intl.formatMessage({ id: "label.followup.promise.delete" }),
              onClick: () => {
                setGeneratedPromises(
                  (prev) => prev.filter((_, i) => i !== index)
                );
              },
              size: "small",
              sx: {
                color: "error.main",
                border: "1px solid",
                borderColor: "error.light",
                borderRadius: 1,
                width: 30,
                height: 30,
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: (t) => alpha(t.palette.error.main, 0.08),
                  borderColor: "error.main"
                }
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } })
            }
          ) })
        ]
      },
      index
    )) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        mb: 2,
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        overflow: "visible"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 1.5,
              px: 1.5,
              py: 0.75,
              mb: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[500], 0.08),
              overflowX: "auto",
              width: "100%",
              boxSizing: "border-box"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Stack,
                {
                  direction: "row",
                  alignItems: "center",
                  spacing: 0.75,
                  flexShrink: 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Call, { sx: { fontSize: 13, color: "primary.main" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Typography,
                      {
                        sx: {
                          fontSize: 11,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          color: "text.primary"
                        },
                        children: [
                          intl.formatMessage({
                            id: "label.followup.contactAttemptIntro",
                            defaultMessage: "Contact attempt"
                          }),
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Dt,
                            {
                              component: "span",
                              sx: { color: "primary.main", fontWeight: 700 },
                              children: attemptToday
                            }
                          ),
                          " ",
                          intl.formatMessage({
                            id: "label.followup.contactAttemptOf",
                            defaultMessage: "of"
                          }),
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { component: "span", sx: { fontWeight: 700 }, children: maxAttempts }),
                          " ",
                          intl.formatMessage({
                            id: "label.followup.contactAttemptToday",
                            defaultMessage: "today"
                          })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", spacing: 0.4, children: Array.from({ length: maxAttempts }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Dt,
                      {
                        sx: {
                          width: 22,
                          height: 5,
                          borderRadius: 999,
                          bgcolor: (t) => i < attemptToday ? t.palette.primary.main : alpha(t.palette.text.primary, 0.12)
                        }
                      },
                      i
                    )) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { orientation: "vertical", flexItem: true, sx: { mx: 0.8 } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.followup.quickDispositionTitle",
                    defaultMessage: "Quick Disposition"
                  }),
                  colon: false,
                  translate: false,
                  align: "left",
                  component: "div",
                  color: theme.palette.primary.main,
                  sx: {
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Stack,
                {
                  direction: "row",
                  spacing: 0.5,
                  sx: { flex: "1 1 auto", minWidth: 0, flexWrap: "nowrap" },
                  children: dispositionButtons.map(({ id, labelId, Icon, tone }) => {
                    const active = selectedDisposition === id;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        disableElevation: true,
                        variant: "text",
                        onClick: () => setSelectedDisposition(active ? "" : id),
                        startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 12 } }),
                        sx: dispositionButtonSx(theme, tone, active),
                        children: intl.formatMessage({ id: labelId })
                      },
                      id
                    );
                  })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Kg,
          {
            variant: "outlined",
            elevation: 0,
            sx: {
              borderRadius: 1.5,
              overflow: "hidden",
              borderColor: recordPanelBorder,
              boxShadow: `inset 0 0 0 1px ${recordPanelBorder}`,
              bgcolor: "background.paper"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    px: 3,
                    py: 1.5,
                    borderBottom: "1px solid #7472721a"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(NearMeOutlinedIcon, { sx: { fontSize: 15, color: "primary.main" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.followup.recordTitle",
                          defaultMessage: "Record Follow Up"
                        }),
                        colon: false,
                        translate: false,
                        align: "left",
                        component: "div",
                        sx: {
                          fontSize: 12,
                          fontWeight: 700,
                          lineHeight: 1.15,
                          color: "var(--drs-text-primary)"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldGrid, mb: 1.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.followup.Result",
                              defaultMessage: "Result"
                            }),
                            required: true,
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          dc,
                          {
                            apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                            searchCode: "RECDE",
                            setSelectedValue: handleResultSelect,
                            selectedValue: resultCode,
                            selectedColumn: "szResultCode",
                            gridDefObj: gridResultDefObj,
                            gridWidth: 350,
                            gridHeight: 300,
                            gridNoOfRowsPerPage: 2,
                            searchBoxWidth: "100%",
                            searchBoxHeight: 30,
                            searchBoxFontSize: 12,
                            error: objErrors.result,
                            placeholder: intl.formatMessage({
                              id: "label.followup.Result",
                              defaultMessage: "Result"
                            }),
                            searchBoxzIndex: 1e3
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.followup.NextAction",
                              defaultMessage: "Next action"
                            }),
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          dc,
                          {
                            apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                            searchCode: "ACDE",
                            setSelectedValue: (value) => {
                              setActionCode(value);
                              setFollowupData((prev) => ({ ...prev, nextAction: value }));
                              if (value) clearFieldError("action");
                            },
                            selectedValue: actionCode,
                            selectedColumn: "SZACTIONCODE",
                            gridDefObj: gridActionDefObj,
                            gridWidth: 350,
                            gridHeight: 300,
                            gridNoOfRowsPerPage: 2,
                            searchBoxWidth: "100%",
                            searchBoxHeight: 30,
                            searchBoxFontSize: 12,
                            error: objErrors.action,
                            placeholder: intl.formatMessage({
                              id: "label.followup.NextAction",
                              defaultMessage: "Next Action"
                            }),
                            searchBoxzIndex: 1e3
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.followup.PartyContacted",
                              defaultMessage: "Party contacted"
                            }),
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SE,
                          {
                            value: followupData.partyContacted,
                            onChange: updateField("partyContacted"),
                            options: partyContactedOptions,
                            sx: { width: "100%" },
                            width: "100%",
                            placeholder: intl.formatMessage({
                              id: "label.followup.PartyContacted.placeholder",
                              defaultMessage: "Select party contacted"
                            })
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldGrid, mb: 1.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.followup.NextActionDate",
                              defaultMessage: "Next Action Date"
                            }),
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: dateFieldCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Ug,
                          {
                            value: followupData.nextActionDate,
                            onChange: (newVal) => setFollowupData((prev) => ({
                              ...prev,
                              nextActionDate: newVal
                            })),
                            align: lE.DATE,
                            sx: { width: "100%" },
                            width: "100%"
                          }
                        ) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({ id: "label.followup.ShowLimit" }),
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: dateFieldCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Ug,
                          {
                            value: followupData.promiseStartDate,
                            onChange: (newVal) => setFollowupData((prev) => ({
                              ...prev,
                              promiseStartDate: newVal
                            })),
                            align: lE.DATE,
                            sx: { width: "100%" },
                            width: "100%"
                          }
                        ) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ps,
                          {
                            value: intl.formatMessage({
                              id: "label.followup.DelinquencyReason",
                              defaultMessage: "Delinquency reason"
                            }),
                            colon: false,
                            align: "left",
                            width: "100%"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SE,
                          {
                            value: followupData.delinquencyReason,
                            onChange: updateField("delinquencyReason"),
                            options: delinquencyReasonOptions,
                            error: objErrors.delinquencyReason,
                            sx: { width: "100%" },
                            width: "100%",
                            placeholder: intl.formatMessage({
                              id: "label.followup.DelinquencyReason.placeholder",
                              defaultMessage: "Select delinquency reason"
                            })
                          }
                        )
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mb: 1.5 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      value: intl.formatMessage({
                        id: "label.followup.NotesRemarks",
                        defaultMessage: "Notes / remarks"
                      }),
                      colon: false,
                      align: "left",
                      width: "100%"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    pp,
                    {
                      value: followupData.bestTimeToCall,
                      onChange: updateField("bestTimeToCall"),
                      width: "100%",
                      maxLines: 3,
                      placeholder: intl.formatMessage({
                        id: "label.followup.NotesRemarks"
                      }),
                      translate: false
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 3,
                      alignItems: "center",
                      mb: 1.5,
                      width: "100%"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: checkboxCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        cc,
                        {
                          checked: pickUpRequired,
                          onChange: (e) => setPickUpRequired(e.target.checked),
                          align: lE.LEFT,
                          label: "label.followup.PickUpRequired"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: checkboxCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        cc,
                        {
                          checked: isActive3,
                          onChange: (e) => setIsActive3(e.target.checked),
                          align: lE.LEFT,
                          label: "label.followup.ApplyToAll"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...checkboxCellSx, gap: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        cc,
                        {
                          checked: isActive2,
                          onChange: (e) => setIsActive2(e.target.checked),
                          align: lE.LEFT,
                          label: intl.formatMessage({ id: "label.followup.CustomerOnWatch" }),
                          Icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            VisibilityOutlined,
                            {
                              sx: { fontSize: 13, color: "warning.main" }
                            }
                          )
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Dt,
                        {
                          sx: { display: "flex", justifyContent: "flex-end", ml: "auto" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Lg,
                            {
                              label: "label.followup.promisePolicy",
                              variant: "text",
                              size: "small",
                              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionOutlinedIcon, { sx: { fontSize: 14 } }),
                              align: "left",
                              sx: {
                                textTransform: "none",
                                fontSize: "0.8rem",
                                whiteSpace: "nowrap",
                                minWidth: "fit-content"
                              }
                            }
                          )
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collapse, { in: isPtpResult, timeout: "auto", unmountOnExit: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[900], 0.03)
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BoltOutlinedIcon, { sx: { fontSize: 15, color: "primary.main" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.followup.section.promise",
                          defaultMessage: "Promise to Pay (PTP)"
                        }),
                        colon: false,
                        translate: false,
                        align: "left",
                        component: "div",
                        sx: {
                          fontSize: 12,
                          fontWeight: 700,
                          lineHeight: 1.15,
                          color: "var(--drs-text-primary)"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2, pt: 1.5, pb: 1.5 }, children: promiseFields })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Collapse, { in: pickUpRequired, timeout: "auto", unmountOnExit: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              bgcolor: "background.paper",
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PickUp,
              {
                pickUpData,
                setPickUpData,
                embedded: true,
                addressTypeOptions
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSubmit,
            onReset: resetForm,
            onClose: () => navigate("/homelayout/welcomepage")
          }
        ) })
      ]
    }
  );
}
const FollowupHistory = ({ reloadFlag }) => {
  const { selectedRow } = useSelector((state) => state.account);
  const intl = useIntl();
  const PAGE_SIZE = 7;
  const [objRowData, setObjRowData] = reactExports.useState([]);
  const [fetchError, setFetchError] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const objColDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.followup.Date", defaultMessage: "Date" }),
        field: "dtAction",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.DATE, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.User", defaultMessage: "User" }),
        field: "szLogedInUser",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Action", defaultMessage: "Action" }),
        field: "szActionCode",
        minWidth: 120,
        flex: 1.2,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" }),
        field: "szResultCode",
        minWidth: 120,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.NextDate", defaultMessage: "Next Date" }),
        field: "dtNextAction",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.DATE, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.Remark", defaultMessage: "Remarks" }),
        field: "szRemark",
        minWidth: 180,
        flex: 1.5,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      }
    ],
    [intl]
  );
  const objDefaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: false,
    resizable: true,
    flex: 1
  };
  const objCustomGridStyle = {
    width: "100%",
    height: "32vh",
    minWidth: 0,
    overflowX: "hidden",
    "--ag-borders": "none"
  };
  const datasource = reactExports.useMemo(() => {
    if (!selectedRow) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        setFetchError(null);
        try {
          const res = await Kr.GET(FollowupAPI.Followup(screenMenuId) + `/fetchFollowupHisForAcct`, {
            pageNumber,
            size,
            pageSize: size
          });
          const statusOk = typeof ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "string" && res.data.status.toLowerCase() === "success";
          const responseJson = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.responseJson;
          const rows = Array.isArray(responseJson) ? responseJson : Array.isArray(responseJson == null ? void 0 : responseJson.content) ? responseJson.content : [];
          const mappedRows = rows.map((item) => ({
            ...item,
            szLogedInUser: item.szLogedInUser || "ADMIN"
          }));
          const totalElementsRaw = Number(
            ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.totalElements) ?? ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.totalCount) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalCount) ?? mappedRows.length
          );
          const lastRow = Number.isFinite(totalElementsRaw) ? totalElementsRaw : mappedRows.length;
          if (statusOk) {
            setObjRowData(mappedRows);
            (_e = params.successCallback) == null ? void 0 : _e.call(params, mappedRows, lastRow);
            return;
          }
          setObjRowData([]);
          setFetchError(
            ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.msg) || intl.formatMessage({
              id: "label.followup.historyLoadUnexpected",
              defaultMessage: "Could not load follow-up history."
            })
          );
          (_g = params.failCallback) == null ? void 0 : _g.call(params);
        } catch (error) {
          console.error("Failed to fetch follow-up history", error);
          setObjRowData([]);
          setFetchError(
            ((_i = (_h = error == null ? void 0 : error.response) == null ? void 0 : _h.data) == null ? void 0 : _i.message) || intl.formatMessage({
              id: "label.followup.historyLoadFailed",
              defaultMessage: "Failed to load follow-up history."
            })
          );
          (_j = params.failCallback) == null ? void 0 : _j.call(params);
        }
      }
    };
  }, [intl, reloadFlag, selectedRow]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "var(--drs-border-divider)",
        bgcolor: "var(--drs-bg-paper)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              py: 1.5,
              px: 2,
              flexShrink: 0,
              bgcolor: "var(--drs-grid-header-bg)",
              borderBottom: 1,
              borderColor: "var(--drs-border-divider)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, bgcolor: "transparent" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryOutlined, { sx: { fontSize: 14, color: "primary.main" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.followup.History",
                    defaultMessage: "Follow Up History"
                  }),
                  colon: false,
                  translate: false,
                  align: "left",
                  component: "div",
                  sx: {
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: "var(--drs-text-primary)"
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { p: 0, flex: 1, minHeight: 0 }, children: [
          fetchError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block", mb: 1 }, children: fetchError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bu,
            {
              rowData: objRowData,
              columnDefs: objColDefs,
              defaultColDef: objDefaultColDef,
              gridStyle: objCustomGridStyle,
              gridClassName: "drs-list-grid drs-followup-history-grid",
              embeddedInSection: true,
              rowModelType: "infinite",
              datasource,
              cacheBlockSize: PAGE_SIZE,
              maxBlocksInCache: 2,
              pagination: true,
              paginationPageSize: PAGE_SIZE,
              domLayout: "normal",
              sort: true
            },
            `followup-history-${(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) || "none"}-${reloadFlag ? "1" : "0"}`
          )
        ] })
      ]
    }
  );
};
function PtpHistoryGrid({ reloadFlag }) {
  const { selectedRow } = useSelector((state) => state.account);
  const intl = useIntl();
  const PAGE_SIZE = 5;
  const [rowData, setRowData] = reactExports.useState([]);
  const [fetchError, setFetchError] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const colDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.takenOn", defaultMessage: "Taken on" }),
        field: "dtCreatedOn",
        type: "datetime",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.DATE, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.promiseDate", defaultMessage: "Promise date" }),
        field: "dtPromise",
        type: "date",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.DATE, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.amount", defaultMessage: "Amount" }),
        field: "bdPromiseAmt",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.NUMBER, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.status", defaultMessage: "Status" }),
        field: "szDesc",
        minWidth: 140,
        flex: 1.6,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.pmtDate", defaultMessage: "Pmt date" }),
        field: "dtPayment",
        type: "date",
        minWidth: 110,
        flex: 1.1,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.DATE, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.pmtAmt", defaultMessage: "Pmt amt" }),
        field: "bdPaymentAmt",
        minWidth: 90,
        flex: 0.95,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.NUMBER, whiteSpace: "normal", lineHeight: 1.25 }
      },
      {
        headerName: intl.formatMessage({ id: "label.followup.ptpCol.by", defaultMessage: "By" }),
        field: "szCollectorCode",
        minWidth: 120,
        flex: 1.2,
        filter: false,
        wrapText: true,
        autoHeight: true,
        cellStyle: { textAlign: lE.TEXT, whiteSpace: "normal", lineHeight: 1.25 }
      }
    ],
    [intl]
  );
  const defaultColDef = reactExports.useMemo(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: false,
      resizable: true,
      flex: 1
    }),
    []
  );
  const gridStyle = {
    width: "100%",
    height: "32vh",
    minWidth: 0,
    overflowX: "hidden",
    "--ag-borders": "none"
  };
  const datasource = reactExports.useMemo(() => {
    if (!selectedRow) return null;
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        setFetchError(null);
        try {
          const res = await Kr.GET(FollowupAPI.Followup(screenMenuId) + `/getPromiseHistory`, {
            pageNumber,
            size,
            pageSize: size
          });
          const ok = typeof ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.status) === "string" && res.data.status.toLowerCase() === "success";
          const responseJson = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.responseJson;
          const rows = Array.isArray(responseJson) ? responseJson : Array.isArray(responseJson == null ? void 0 : responseJson.content) ? responseJson.content : Array.isArray((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.data) ? res.data.data : [];
          const totalElementsRaw = Number(
            ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.totalElements) ?? ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.totalCount) ?? (responseJson == null ? void 0 : responseJson.totalElements) ?? (responseJson == null ? void 0 : responseJson.totalCount) ?? rows.length
          );
          const lastRow = Number.isFinite(totalElementsRaw) ? totalElementsRaw : rows.length;
          if (ok) {
            setRowData(rows);
            (_f = params.successCallback) == null ? void 0 : _f.call(params, rows, lastRow);
            return;
          }
          setRowData([]);
          setFetchError(
            ((_g = res == null ? void 0 : res.data) == null ? void 0 : _g.msg) || intl.formatMessage({
              id: "label.followup.ptpHistoryLoadUnexpected",
              defaultMessage: "Could not load PTP history."
            })
          );
          (_h = params.failCallback) == null ? void 0 : _h.call(params);
        } catch (err) {
          console.error(err);
          setRowData([]);
          setFetchError(
            ((_j = (_i = err == null ? void 0 : err.response) == null ? void 0 : _i.data) == null ? void 0 : _j.message) || intl.formatMessage({
              id: "label.followup.ptpHistoryLoadFailed",
              defaultMessage: "Failed to load PTP history."
            })
          );
          (_k = params.failCallback) == null ? void 0 : _k.call(params);
        }
      }
    };
  }, [intl, reloadFlag, selectedRow]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Kg,
    {
      variant: "outlined",
      elevation: 0,
      sx: {
        borderRadius: 1.5,
        overflow: "hidden",
        borderColor: "var(--drs-border-divider)",
        bgcolor: "var(--drs-bg-paper)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              py: 1.5,
              px: 2,
              flexShrink: 0,
              bgcolor: "var(--drs-grid-header-bg)",
              borderBottom: 1,
              borderColor: "var(--drs-border-divider)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, bgcolor: "transparent" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccessTimeOutlined, { sx: { fontSize: 14, color: "primary.main" } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.followup.ptpHistoryTitle",
                    defaultMessage: "PTP History"
                  }),
                  colon: false,
                  translate: false,
                  align: "left",
                  component: "div",
                  sx: {
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: "var(--drs-text-primary)"
                  }
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { p: 0, flex: 1, minHeight: 0 }, children: [
          fetchError && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block", mb: 1 }, children: fetchError }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            bu,
            {
              rowData,
              columnDefs: colDefs,
              defaultColDef,
              gridStyle,
              gridClassName: "drs-list-grid drs-followup-history-grid",
              embeddedInSection: true,
              rowModelType: "infinite",
              datasource,
              cacheBlockSize: PAGE_SIZE,
              maxBlocksInCache: 2,
              pagination: true,
              paginationPageSize: PAGE_SIZE,
              domLayout: "normal",
              sort: true
            },
            `ptp-history-${(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO) || "none"}-${reloadFlag ? "1" : "0"}`
          )
        ] })
      ]
    }
  );
}
const Followup = () => {
  const intl = useIntl();
  const [reloadFlag, setReloadFlag] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.followup.title" }),
      breadcrumbMid: intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection"
      }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 1.5, sm: 2 },
            pt: 1,
            width: "100%",
            boxSizing: "border-box",
            background: "var(--drs-bg-page)",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            position: "relative"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FollowupDetails, { onSaved: () => setReloadFlag((v) => !v) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, alignItems: "stretch", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PtpHistoryGrid, { reloadFlag }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FollowupHistory, { reloadFlag }) })
            ] })
          ]
        }
      )
    }
  );
};
export {
  Followup as default
};
