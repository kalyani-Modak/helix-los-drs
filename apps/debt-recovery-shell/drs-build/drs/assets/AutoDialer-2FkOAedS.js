import { dN as reactExports, ed as useIntl, ct as ar, aX as Kr, q as AutoDialerAPI, dB as jsxRuntimeExports, v as Box, ep as vp, dK as ps, cs as ap, bd as Ng, b0 as Lg, bJ as SaveIcon } from "./index-BhdgJqva.js";
const AutoDialer = () => {
  const [objIsRuleEngBased] = reactExports.useState(false);
  const [objParentRuleEngineFilter, setObjParentRuleEngineFilter] = reactExports.useState(null);
  const [objFilterCode, setObjFilterCode] = reactExports.useState();
  const [objParentFilterProps, setObjParentFilterProps] = reactExports.useState(null);
  const intl = useIntl();
  const toast = ar();
  const [objNoOfFailure, setObjNoOfFailure] = reactExports.useState(3);
  const [objNoOfDays, setObjNoOfDays] = reactExports.useState(7);
  const [loading] = reactExports.useState(false);
  const [errors] = reactExports.useState({
    objNoOfFailure: false,
    objNoOfDays: false
  });
  reactExports.useEffect(() => {
    Kr.POST(AutoDialerAPI.fetchAutoDialerDetails, "").then((resp) => {
      var _a, _b, _c, _d, _e;
      if (((_a = resp.data) == null ? void 0 : _a.status) === "Error") {
        console.error(((_b = resp.data) == null ? void 0 : _b.message) || "Fetch error");
      } else {
        setObjFilterCode((_e = (_d = (_c = resp.data) == null ? void 0 : _c.responseJson) == null ? void 0 : _d.AtdMstConfigData) == null ? void 0 : _e.szFilterCode);
      }
    }).catch((err) => {
      console.error("Fetch error:", err);
    });
  }, []);
  const handleSave = () => {
    const objPayload = {
      lnEntitySeq: null,
      szFilterCode: objFilterCode,
      inSkipMarkNoOfFailure: 0,
      inSkipMarkInNoOfDays: 0,
      szExclusionStartTime: "",
      szExclusionEndTime: "",
      inExclusionFrequency: 0,
      szDownloadNoGoodPhoneYn: "",
      szDownloadSkippedCasesYn: "",
      szDownloadFutureNextActionYn: "",
      szColField1: "",
      szColField2: "",
      szColFlag1: "",
      szColFlag2: "",
      dtColDate1: "",
      dtColDate2: "",
      inColNumber1: objNoOfFailure,
      inColNumber2: objNoOfDays,
      lnColAmount1: 0,
      lnColAmount2: 0,
      szField1: "",
      szField2: "",
      szFlag1: "",
      szFlag2: "",
      dtDate1: "",
      dtDate2: "",
      inNumber1: 0,
      inNumber2: 0,
      lnAmount1: 0,
      lnAmount2: 0,
      szUser: "",
      filterRequestDto: objParentFilterProps
    };
    if (!objIsRuleEngBased) {
      return Kr.POST(
        AutoDialerAPI.submitAutoDialerDetails,
        objPayload
      ).then((resp) => {
        var _a, _b, _c;
        if (((_a = resp.data) == null ? void 0 : _a.status) === "Error") {
          toast.error(((_b = resp.data) == null ? void 0 : _b.message) || "save error");
        } else {
          toast.success(((_c = resp.data) == null ? void 0 : _c.message) || "Changes saved successfully");
        }
      }).catch((err) => {
        console.error("Failed to save changes:", err);
        toast.error("Failed to save changes");
      });
    } else {
      console.log("objParentRuleEngineFilter", objParentRuleEngineFilter);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({ id: "label.AutoDialer.title", defaultMessage: "Auto Dialer" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Box,
      {
        sx: {
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
          px: 1,
          mt: "10px",
          mb: "10px",
          width: "100%",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Number of Failure", disabled: false, required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                value: objNoOfFailure,
                onChange: (e) => setObjNoOfFailure(e.target.value),
                width: "150px",
                editable: true,
                disabled: false,
                required: true,
                error: errors.objNoOfFailure
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "In Number Of Days", disabled: false, required: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                value: objNoOfDays,
                onChange: (e) => setObjNoOfDays(e.target.value),
                width: "150px",
                editable: true,
                disabled: false,
                required: true,
                error: errors.objNoOfDays
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Ng,
      {
        entityCode: "ATD",
        filterCode: objFilterCode,
        filterTitle: "Auto Dialer",
        filterSavedDescription: "Global ATD Filter",
        isPopedUp: false,
        parentFilterProps: setObjParentFilterProps,
        parentRuleEngineFilterProps: setObjParentRuleEngineFilter,
        IsRuleEngBased: objIsRuleEngBased
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "label-textarea-row", sx: { ml: "50px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Lg,
      {
        id: "save-btn",
        label: "button.save",
        startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}),
        onClick: handleSave,
        loading,
        align: "end"
      }
    ) })
  ] });
};
export {
  AutoDialer as default
};
