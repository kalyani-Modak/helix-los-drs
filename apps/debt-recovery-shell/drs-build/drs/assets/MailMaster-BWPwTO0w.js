import { ed as useIntl, ct as ar, eh as useNavigate, $ as $e, dN as reactExports, ef as useLocation, dB as jsxRuntimeExports, ac as Dt, cx as bp, ep as vp, aM as Grid, dK as ps, cs as ap, dD as lE, cJ as dc, dj as gridMailMasterCodeDefObj, bI as SEARCH_API_ENDPOINTS, b0 as Lg, cB as cc, cf as Typography, bH as SE, aY as LE, a7 as DialogContent, dI as pp, a6 as DialogActions, cj as Vg, aX as Kr, bc as NavigationContext, b3 as LocationContext, bF as RouteContext, c9 as TemplateEditorPage, B as BE } from "./index-BhdgJqva.js";
import { M as MailMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const ACCESS_PROFILES = ["AAKASH", "Agency", "Checker", "Collections Manager"];
const createInlineNavigator = () => ({
  createHref: (to) => typeof to === "string" ? to : (to == null ? void 0 : to.pathname) || "",
  encodeLocation: (location) => location,
  go: () => {
  },
  push: () => {
  },
  replace: () => {
  }
});
const InlineTemplateEditor = ({ templateId }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  NavigationContext.Provider,
  {
    value: {
      basename: "",
      navigator: createInlineNavigator(),
      static: false,
      future: {}
    },
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      LocationContext.Provider,
      {
        value: {
          location: {
            pathname: "/homelayout/editor",
            search: `?id=${encodeURIComponent(templateId)}&embedded=1`,
            hash: "",
            state: null,
            key: "inline-editor"
          },
          navigationType: "POP"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          RouteContext.Provider,
          {
            value: {
              outlet: null,
              matches: [
                {
                  params: {},
                  pathname: "/homelayout/editor",
                  pathnameBase: "/homelayout/editor",
                  route: { path: "/editor" }
                }
              ]
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { height: "100%", width: "100%", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateEditorPage, {}) })
          }
        )
      }
    )
  }
);
const mapSystemParamOptions = (list = [], intl) => (Array.isArray(list) ? list : []).map((item) => {
  const value = (item == null ? void 0 : item.value) ?? (item == null ? void 0 : item.szCondition) ?? (item == null ? void 0 : item.szAmountField) ?? (item == null ? void 0 : item.code) ?? "";
  const rawLabel = (item == null ? void 0 : item.label) ?? (item == null ? void 0 : item.szDesc) ?? (item == null ? void 0 : item.szDescription) ?? (item == null ? void 0 : item.description) ?? value;
  const i18nDefaultMessage = (item == null ? void 0 : item.szi18nDesc) ? item.szi18nDesc.split(".").pop().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : rawLabel;
  return {
    value,
    label: (item == null ? void 0 : item.szi18nDesc) ? intl.formatMessage({
      id: item.szi18nDesc,
      defaultMessage: i18nDefaultMessage
    }) : rawLabel
  };
}).filter((item) => item.value !== "");
const normalizeChannelName = (value) => String(value ?? "").trim().toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
const mapCommTypeOptions = (list = [], intl) => mapSystemParamOptions(list, intl).map((item) => ({
  ...item,
  channel: normalizeChannelName(item.label)
}));
const mapFeeMasterOptions = (list = []) => (Array.isArray(list) ? list : []).map((item) => ({
  value: (item == null ? void 0 : item.value) ?? (item == null ? void 0 : item.szFeeCode) ?? (item == null ? void 0 : item.szCondition) ?? "",
  label: (item == null ? void 0 : item.label) ?? (item == null ? void 0 : item.szFeeDesc) ?? (item == null ? void 0 : item.szDesc) ?? (item == null ? void 0 : item.szDescription) ?? (item == null ? void 0 : item.szFeeCode) ?? (item == null ? void 0 : item.szCondition) ?? ""
})).filter((item) => item.value !== "");
const mapEntityCodeOptions = (list = []) => (Array.isArray(list) ? list : []).map((item) => ({
  value: (item == null ? void 0 : item.value) ?? (item == null ? void 0 : item.code) ?? (item == null ? void 0 : item.szCode) ?? (item == null ? void 0 : item.szEntityCode) ?? (item == null ? void 0 : item.szCondition) ?? "",
  label: (item == null ? void 0 : item.label) ?? (item == null ? void 0 : item.desc) ?? (item == null ? void 0 : item.szDesc) ?? (item == null ? void 0 : item.szDescription) ?? (item == null ? void 0 : item.description) ?? (item == null ? void 0 : item.code) ?? (item == null ? void 0 : item.szCode) ?? (item == null ? void 0 : item.szEntityCode) ?? (item == null ? void 0 : item.szCondition) ?? ""
})).filter((item) => item.value !== "");
const buildRecipientState = (lstMailAddressee = []) => {
  const autoState = {};
  const manualState = {};
  (Array.isArray(lstMailAddressee) ? lstMailAddressee : []).forEach((item) => {
    const key = (item == null ? void 0 : item.szAddresseeType) || "";
    const type = ((item == null ? void 0 : item.chGenerationType) || "").toString().toUpperCase();
    if (!key) return;
    if (type === "A") autoState[key] = true;
    if (type === "M") manualState[key] = true;
  });
  return { autoState, manualState };
};
const TEMPLATE_LANGUAGE_MAP = { en: "en", es: "es", fr: "fr", de: "de" };
const getTemplateLanguageCode = (locale = "en") => {
  const code = String(locale).toLowerCase().replace("_", "-").split("-")[0];
  return TEMPLATE_LANGUAGE_MAP[code] || "en";
};
const MailMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { themeVars, surfaces, text, border, action, colors } = $e();
  const [mailCode, setMailCode] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [active, setActive] = reactExports.useState(false);
  const [mailCategory, setMailCategory] = reactExports.useState("");
  const [entityCode, setEntityCode] = reactExports.useState("");
  const [commClass, setCommClass] = reactExports.useState("");
  const [allowAttachment, setAllowAttachment] = reactExports.useState(false);
  const [dualMailRequired, setDualMailRequired] = reactExports.useState(false);
  const [applyFee, setApplyFee] = reactExports.useState("");
  const [usingMethod, setUsingMethod] = reactExports.useState("");
  const [feeAmount, setFeeAmount] = reactExports.useState("");
  const [percentOf, setPercentOf] = reactExports.useState("");
  const [flatAmount, setFlatAmount] = reactExports.useState("");
  const [costParameters, setCostParameters] = reactExports.useState({});
  const [autoRecipients, setAutoRecipients] = reactExports.useState({});
  const [manualRecipients, setManualRecipients] = reactExports.useState({});
  const [categoryOptions, setCategoryOptions] = reactExports.useState([]);
  const [commClassOptions, setCommClassOptions] = reactExports.useState([]);
  const [commTypeOptions, setCommTypeOptions] = reactExports.useState([]);
  const [applyFeeOptions, setApplyFeeOptions] = reactExports.useState([]);
  const [usingMethodOptions, setUsingMethodOptions] = reactExports.useState([]);
  const [percentOfOptions, setPercentOfOptions] = reactExports.useState([]);
  const [recipientOptions, setRecipientOptions] = reactExports.useState([]);
  const [entityCodeOptions, setEntityCodeOptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [isNewRecord, setIsNewRecord] = reactExports.useState(true);
  const [isManualMailCodeEntry, setIsManualMailCodeEntry] = reactExports.useState(false);
  const [autoTrigger, setAutoTrigger] = reactExports.useState(false);
  const [allowAdhoc, setAllowAdhoc] = reactExports.useState(false);
  const [searchBoxKey, setSearchBoxKey] = reactExports.useState(0);
  const [editorTemplateId, setEditorTemplateId] = reactExports.useState("");
  const [editorTemplateCode, setEditorTemplateCode] = reactExports.useState("");
  const [editorSubject, setEditorSubject] = reactExports.useState("");
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const fetchDropdowns = async () => {
    var _a, _b, _c;
    try {
      setLoading(true);
      const response = await Kr.GET(
        MailMasterAPI.MailMaster(screenMenuId),
        {}
      );
      const rj = ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.responseJson) || ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.data) || (response == null ? void 0 : response.data) || {};
      setCategoryOptions(
        mapSystemParamOptions(rj.lstMailCategory || rj.categoryList, intl)
      );
      setCommClassOptions(
        mapSystemParamOptions(rj.lstCommClass || rj.commClassList, intl)
      );
      setApplyFeeOptions(
        mapFeeMasterOptions(
          rj.lstMailMasterFeeMasterDto || rj.lstFeeMasterEntity || rj.lstFeeMasterEntities || rj.applyFeeList
        )
      );
      setUsingMethodOptions(
        mapSystemParamOptions(rj.lstCalctype || rj.usingMethodList, intl)
      );
      setPercentOfOptions(
        mapSystemParamOptions(rj.lstAllocBase || rj.percentOfList, intl)
      );
      setCommTypeOptions(
        mapCommTypeOptions(rj.lstCommType || rj.commTypeList, intl)
      );
      setRecipientOptions(
        mapSystemParamOptions(rj.lstAddressees || rj.addresseeList, intl)
      );
      setEntityCodeOptions(
        mapEntityCodeOptions(
          rj.lstCommunicationEntities || rj.lstCommEntities || rj.communicationEntities || rj.entityList
        )
      );
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
      const data = (_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data;
      if (data == null ? void 0 : data.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "error.mailmaster.dropdown.fetch",
            defaultMessage: "Error fetching dropdown data."
          })
        );
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchDropdowns();
  }, [intl]);
  const populateForm = (responseJson) => {
    const wrapper = responseJson || {};
    const mm = wrapper.mailMaster || wrapper;
    const { autoState, manualState } = buildRecipientState(
      wrapper.lstMailAddressee
    );
    setDescription((mm == null ? void 0 : mm.szMailDesc) || (mm == null ? void 0 : mm.szDescription) || "");
    setActive(((mm == null ? void 0 : mm.chActiveYn) || (mm == null ? void 0 : mm.chActive)) === "Y");
    setMailCategory((mm == null ? void 0 : mm.szMailCategory) || "");
    setEntityCode((mm == null ? void 0 : mm.szEntityCode) || "");
    setCommClass((mm == null ? void 0 : mm.chCommunicationClass) || (mm == null ? void 0 : mm.szCommClass) || "");
    setAllowAttachment(((mm == null ? void 0 : mm.chAllowAttachment) || (mm == null ? void 0 : mm.cAllowAttachment)) === "Y");
    setDualMailRequired(((mm == null ? void 0 : mm.chDualMailYn) || (mm == null ? void 0 : mm.chDualMailRequired)) === "Y");
    setApplyFee((mm == null ? void 0 : mm.szFeeCode) || (mm == null ? void 0 : mm.szApplyFee) || "");
    setUsingMethod((mm == null ? void 0 : mm.szFeeCalculationType) || (mm == null ? void 0 : mm.szUsingMethod) || "");
    setFeeAmount((mm == null ? void 0 : mm.flFeePercent) ?? (mm == null ? void 0 : mm.nFeeAmount) ?? "");
    setPercentOf((mm == null ? void 0 : mm.szAmountField) || (mm == null ? void 0 : mm.szPercentOf) || "");
    setFlatAmount((mm == null ? void 0 : mm.flFeeAmount) ?? (mm == null ? void 0 : mm.nFlatAmount) ?? "");
    setCostParameters(
      (wrapper.lstMailTemplateType || wrapper.mailTemplateTypeList || []).reduce((acc, item) => {
        const code = (item == null ? void 0 : item.szCode) || (item == null ? void 0 : item.szCondition) || "";
        if (!code) return acc;
        acc[code] = (item == null ? void 0 : item.flActionCost) != null ? String(item.flActionCost) : "";
        return acc;
      }, {})
    );
    setAutoRecipients(autoState);
    setManualRecipients(manualState);
    setAutoTrigger((mm == null ? void 0 : mm.chAutoTriggerYn) === "Y");
    setAllowAdhoc((mm == null ? void 0 : mm.chAllowAdhocYn) === "Y");
  };
  const fetchMailMasterData = async (code) => {
    var _a, _b, _c, _d;
    if (!code) return;
    try {
      setLoading(true);
      const response = await Kr.GET(
        MailMasterAPI.MailMaster(screenMenuId) + `/getmailmasterdetails?szMailCode=${code}`
      );
      const isSuccess = ((_b = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) === "success";
      const responseJson = (_c = response == null ? void 0 : response.data) == null ? void 0 : _c.responseJson;
      if (isSuccess && responseJson) {
        populateForm(responseJson);
        setIsNewRecord(false);
        setIsManualMailCodeEntry(false);
      } else {
        handleReset();
        setMailCode(code);
      }
    } catch (error) {
      console.error(error);
      const data = (_d = error == null ? void 0 : error.response) == null ? void 0 : _d.data;
      if (data == null ? void 0 : data.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "error.mailmaster.fetch",
            defaultMessage: "Error fetching mail master data."
          })
        );
      handleReset();
      setMailCode(code);
    } finally {
      setLoading(false);
    }
  };
  const handleMailCodeSelect = (selectedValue) => {
    setIsManualMailCodeEntry(false);
    setMailCode(selectedValue);
    fetchMailMasterData(selectedValue);
  };
  const handleNewRecord = () => {
    handleReset();
    setIsManualMailCodeEntry(true);
  };
  const handleSave = () => {
    const mode = !isNewRecord && mailCode ? "E" : "N";
    const mailMasterPayload = {
      szMailDesc: description,
      szMailCategory: mailCategory,
      szEntityCode: entityCode,
      szFeeCode: applyFee,
      flFeeAmount: flatAmount ? parseFloat(flatAmount) : null,
      chActiveYn: active ? "Y" : "N",
      szFeeCalculationType: usingMethod,
      szAmountField: percentOf,
      flFeePercent: feeAmount ? parseFloat(feeAmount) : null,
      chGeneratedYn: "N",
      chCommunicationClass: commClass,
      chDualMailYn: dualMailRequired ? "Y" : "N",
      chAllowAttachment: allowAttachment ? "Y" : "N",
      chAutoTriggerYn: autoTrigger ? "Y" : "N",
      chAllowAdhocYn: allowAdhoc ? "Y" : "N",
      cOwner: "",
      szMode: mode
    };
    const lstMailAddressee = [
      ...Object.keys(autoRecipients).filter((k) => autoRecipients[k]).map((k) => ({ chGenerationType: "A", szAddresseeType: k })),
      ...Object.keys(manualRecipients).filter((k) => manualRecipients[k]).map((k) => ({ chGenerationType: "M", szAddresseeType: k }))
    ];
    const lstMailTemplateType = (commTypeOptions.length ? commTypeOptions : Object.keys(costParameters).map((value) => ({ value, label: value }))).map((item) => ({
      szCode: item.value,
      flActionCost: costParameters[item.value] === "" || costParameters[item.value] == null ? null : parseFloat(costParameters[item.value])
    }));
    setLoading(true);
    return Kr.POST(MailMasterAPI.MailMaster(screenMenuId), {
      szMailCode: mailCode,
      mailMaster: mailMasterPayload,
      lstMailAddressee,
      lstMailTemplateType
    }).then((response) => {
      var _a, _b;
      if (((_b = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) === "success") {
        BE("MLCDE");
        if (mode === "N") {
          setIsNewRecord(false);
          setIsManualMailCodeEntry(false);
          setSearchBoxKey((prev) => prev + 1);
        }
        return { success: true };
      } else {
        const data = response == null ? void 0 : response.data;
        if (data == null ? void 0 : data.responseJson)
          handleValidationErrors(intl, toast, data.responseJson);
        return { success: false };
      }
    }).catch((error) => {
      var _a;
      console.error(error);
      const data = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data;
      if (data == null ? void 0 : data.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      return { success: false };
    }).finally(() => setLoading(false));
  };
  const handleDelete = () => {
    if (!mailCode) {
      toast.warning(
        intl.formatMessage({
          id: "label.mailmaster.delete.noCode",
          defaultMessage: "Please select a mail code to delete."
        })
      );
      return { success: false };
    }
    if (window.confirm(
      intl.formatMessage({
        id: "label.mailmaster.delete.confirm",
        defaultMessage: "Are you sure you want to delete this record?"
      })
    )) {
      setLoading(true);
      return Kr.POST(MailMasterAPI.MailMaster(screenMenuId), {
        szMailCode: mailCode,
        mailMaster: {
          szMailCode: mailCode,
          szMailCategory: mailCategory,
          szMode: "D"
        },
        lstMailAddressee: [],
        lstMailTemplateType: []
      }).then((response) => {
        var _a, _b;
        if (((_b = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.status) == null ? void 0 : _b.toLowerCase()) === "success") {
          handleReset();
          return { success: true };
        } else {
          const data = response == null ? void 0 : response.data;
          if (data == null ? void 0 : data.responseJson)
            handleValidationErrors(intl, toast, data.responseJson);
          return { success: false };
        }
      }).catch((error) => {
        var _a;
        console.error(error);
        const data = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data;
        if (data == null ? void 0 : data.responseJson)
          handleValidationErrors(intl, toast, data.responseJson);
        return { success: false };
      }).finally(() => setLoading(false));
    }
  };
  const handleCreateTemplate = async (templateCode) => {
    var _a, _b, _c;
    if (!mailCode) {
      toast.error(
        intl.formatMessage({
          id: "label.mailmaster.code.required",
          defaultMessage: "Mail code is required."
        })
      );
      return;
    }
    const channel = ((_a = commTypeOptions.find((item) => item.value === templateCode)) == null ? void 0 : _a.channel) || normalizeChannelName(templateCode);
    const payload = {
      templateName: `${mailCode}_${String(templateCode).toLowerCase()}`,
      channel,
      moduleId: "COL",
      templateType: "body",
      ...channel === "SMS" ? { isTextMedia: "Y" } : {}
    };
    try {
      setLoading(true);
      const response = await Kr.POST(
        MailMasterAPI.MailMaster(screenMenuId) + `/createtemplate`,
        payload
      );
      const data = response == null ? void 0 : response.data;
      const status = (_b = data == null ? void 0 : data.status) == null ? void 0 : _b.toLowerCase();
      if (status === "success") {
        const templateId = data == null ? void 0 : data.responseJson;
        if (templateId) {
          setEditorTemplateId(templateId);
          setEditorTemplateCode(templateCode);
        } else
          toast.error(
            intl.formatMessage({
              id: "label.mailmaster.template.idNotFound",
              defaultMessage: "Template ID not found."
            })
          );
      } else if (status === "failure") {
        const existingTemplateId = data == null ? void 0 : data.responseJson;
        if (existingTemplateId) {
          setEditorTemplateId(existingTemplateId);
          setEditorTemplateCode(templateCode);
        } else {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "label.mailmaster.template.createFailed",
              defaultMessage: "Failed to create template."
            })
          );
        }
      }
    } catch (error) {
      console.error("Error creating template:", error);
      const data = (_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data;
      if (data == null ? void 0 : data.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "label.mailmaster.template.createError",
            defaultMessage: "Error creating template."
          })
        );
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setMailCode("");
    setDescription("");
    setActive(false);
    setMailCategory("");
    setEntityCode("");
    setCommClass("");
    setAllowAttachment(false);
    setDualMailRequired(false);
    setApplyFee("");
    setUsingMethod("");
    setFeeAmount("");
    setPercentOf("");
    setFlatAmount("");
    setCostParameters({});
    setAutoRecipients({});
    setManualRecipients({});
    setIsNewRecord(true);
    setIsManualMailCodeEntry(false);
    setAutoTrigger(false);
    setAllowAdhoc(false);
    setSearchBoxKey((prev) => prev + 1);
    setEditorTemplateId("");
    setEditorTemplateCode("");
  };
  const handleEditorSave = async () => {
    var _a, _b;
    if (!editorTemplateId) return;
    if (editorTemplateCode === "M" && !editorSubject.trim()) {
      toast.warning(
        intl.formatMessage({
          id: "label.mailmaster.template.subjectRequired",
          defaultMessage: "Please enter subject before saving."
        })
      );
      return;
    }
    try {
      setLoading(true);
      const languageCode = getTemplateLanguageCode(intl.locale || "en");
      const response = await Kr.PUT(
        MailMasterAPI.MailMaster(screenMenuId) + `/saveMailTemplateSubject`,
        {
          szMailCode: mailCode,
          lstMailTemplateType: [
            {
              szCode: editorTemplateCode,
              szTemplateId: editorTemplateId,
              szSubject: editorSubject,
              szLanguage: languageCode
            }
          ]
        }
      );
      const data = response == null ? void 0 : response.data;
      const status = (_a = data == null ? void 0 : data.status) == null ? void 0 : _a.toLowerCase();
      if (status === "success") {
        window.localStorage.setItem(
          `mail-template-subject:${editorTemplateId}`,
          editorSubject
        );
        handleEditorClose();
      } else if (data == null ? void 0 : data.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        toast.error(
          (data == null ? void 0 : data.message) || intl.formatMessage({
            id: "label.mailmaster.template.saveFailed",
            defaultMessage: "Save failed."
          })
        );
      }
    } catch (error) {
      console.error("Error saving template subject:", error);
      const data = (_b = error == null ? void 0 : error.response) == null ? void 0 : _b.data;
      if (data == null ? void 0 : data.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "label.mailmaster.template.saveError",
            defaultMessage: "Error saving template subject."
          })
        );
    } finally {
      setLoading(false);
    }
  };
  const handleEditorClose = () => {
    setEditorSubject("");
    setEditorTemplateId("");
    setEditorTemplateCode("");
  };
  reactExports.useEffect(() => {
    if (!editorTemplateId) return;
    setEditorSubject(
      window.localStorage.getItem(
        `mail-template-subject:${editorTemplateId}`
      ) || ""
    );
  }, [editorTemplateId]);
  const recipientKeys = recipientOptions.map((r) => r.value);
  recipientKeys.length > 0 && recipientKeys.every((k) => autoRecipients[k]);
  recipientKeys.length > 0 && recipientKeys.every((k) => manualRecipients[k]);
  const pageSectionSx = { height: "100%", p: 2, border: `1px solid ${border.divider}`, borderRadius: 2, backgroundColor: surfaces.paper, color: text.primary };
  const sectionTitleSx = { mb: 1.5, fontSize: 13, fontWeight: 600, color: text.primary };
  const fieldRowSx = { display: "grid", gridTemplateColumns: "160px minmax(0, 1fr)", alignItems: "center", columnGap: "12px", mb: 1.2 };
  const checkboxNoteRowSx = { display: "grid", gridTemplateColumns: "160px 28px minmax(0, 1fr)", alignItems: "center", columnGap: "12px", mb: 1.2 };
  const labelSx = { fontSize: 12, fontWeight: 500, color: text.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const noteTextSx = { fontSize: 11, color: text.secondary, lineHeight: 1.5 };
  const templateBtnSx = { minWidth: 0, width: "100%", height: 26, fontSize: 11, fontWeight: 500, textTransform: "none", border: `1.5px solid ${colors.primary}`, color: colors.primary, backgroundColor: surfaces.paper, borderRadius: "3px", p: "0 4px", "&:hover": { backgroundColor: action.hover, borderColor: colors.primaryDark } };
  const templateColumns = `90px repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        ...themeVars,
        mt: 2,
        background: surfaces.panel,
        color: text.primary
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          vp,
          {
            title: intl.formatMessage({
              id: "label.mailmaster.title",
              defaultMessage: "Mail Master"
            })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              mx: 2.5,
              mb: 2,
              p: 2,
              border: `1px solid ${border.divider}`,
              borderRadius: 2,
              backgroundColor: surfaces.paper
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, alignItems: "center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.mailmaster.MailCode",
                      defaultMessage: "Mail Code"
                    }),
                    required: true,
                    component: "span",
                    sx: { flexShrink: 0, whiteSpace: "nowrap", minWidth: 72 }
                  }
                ),
                isManualMailCodeEntry ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    value: mailCode,
                    onChange: (e) => {
                      var _a;
                      return setMailCode(((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                    },
                    editable: true,
                    align: lE.TEXT,
                    width: 160
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "MLCDE",
                    setSelectedValue: handleMailCodeSelect,
                    selectedValue: mailCode,
                    selectedColumn: "szMailCode",
                    gridDefObj: gridMailMasterCodeDefObj,
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  },
                  searchBoxKey
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Lg,
                  {
                    label: "label.mailmaster.new",
                    variant: "contained",
                    size: "small",
                    onClick: handleNewRecord,
                    sx: {
                      minWidth: 72,
                      textTransform: "none",
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                      "&:hover": {
                        background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`
                      }
                    }
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 0
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.mailmaster.Description",
                          defaultMessage: "Description"
                        }),
                        component: "span",
                        sx: { flexShrink: 0, whiteSpace: "nowrap" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        value: description,
                        onChange: (e) => {
                          var _a;
                          return setDescription(((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                        },
                        editable: true,
                        align: lE.TEXT,
                        width: "100%"
                      }
                    ) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: { md: "flex-end" }
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ps,
                      {
                        value: intl.formatMessage({
                          id: "label.mailmaster.Active",
                          defaultMessage: "Active"
                        })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      cc,
                      {
                        checked: active,
                        onChange: (e) => setActive(e.target.checked)
                      }
                    ) })
                  ]
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.config",
              defaultMessage: "Configuration"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.MailCategory",
                    defaultMessage: "Mail Category"
                  }),
                  required: true,
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "mailCategory",
                  value: mailCategory,
                  onChange: (e) => setMailCategory(e.target.value),
                  options: categoryOptions,
                  placeholder: "Select",
                  align: lE.TEXT
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.Entity",
                    defaultMessage: "Entity"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "entityCode",
                  value: entityCode,
                  onChange: (e) => setEntityCode(e.target.value),
                  options: entityCodeOptions,
                  placeholder: "Select",
                  align: lE.TEXT
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldRowSx, alignItems: "flex-start" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.CommunicationClass",
                    defaultMessage: "Communication Class"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    name: "commClass",
                    value: commClass,
                    onChange: (e) => setCommClass(e.target.value),
                    options: commClassOptions,
                    placeholder: "Select",
                    align: lE.TEXT
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Typography,
                  {
                    sx: {
                      ...noteTextSx,
                      color: colors.accent || colors.primary,
                      mt: 0.5
                    },
                    children: intl.formatMessage({
                      id: "label.mailmaster.customerPrefNote",
                      defaultMessage: "Customer preference note"
                    })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.AllowAttachment",
                    defaultMessage: "Allow Attachment"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: { display: "flex", alignItems: "center", minWidth: 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    cc,
                    {
                      checked: allowAttachment,
                      onChange: (e) => setAllowAttachment(e.target.checked),
                      label: "",
                      margin: "0"
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: checkboxNoteRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.DualMailRequired",
                    defaultMessage: "Dual Mail Required"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  checked: dualMailRequired,
                  onChange: (e) => setDualMailRequired(e.target.checked),
                  label: "",
                  margin: "0"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: { display: "flex", alignItems: "center", minWidth: 0 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      sx: {
                        ...noteTextSx,
                        flex: 1,
                        minWidth: 0,
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                        textOverflow: "clip"
                      },
                      children: intl.formatMessage({
                        id: "label.mailmaster.dualMailHint",
                        defaultMessage: "Mail will be generated in user specific & default language."
                      })
                    }
                  )
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.templates",
              defaultMessage: "Templates"
            }) }),
            mailCode && commTypeOptions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  border: `1px solid ${border.divider}`,
                  borderRadius: "6px",
                  overflow: "hidden",
                  backgroundColor: surfaces.paper
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: templateColumns,
                        backgroundColor: surfaces.panel,
                        borderBottom: `1px solid ${border.divider}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              px: 1,
                              py: 0.75,
                              borderRight: `1px solid ${border.divider}`,
                              minHeight: 40
                            }
                          }
                        ),
                        commTypeOptions.map((type, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              px: 1,
                              py: 0.75,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              fontSize: 11,
                              fontWeight: 600,
                              color: text.primary,
                              borderRight: i < commTypeOptions.length - 1 ? `1px solid ${border.divider}` : "none"
                            },
                            children: type.label
                          },
                          type.value
                        ))
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: templateColumns,
                        backgroundColor: surfaces.paper
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              px: 1,
                              py: 0.75,
                              display: "flex",
                              alignItems: "center",
                              fontSize: 12,
                              fontWeight: 600,
                              color: colors.primary,
                              borderRight: `1px solid ${border.divider}`,
                              borderTop: `1px solid ${border.divider}`
                            },
                            children: intl.formatMessage({
                              id: "label.mailmaster.template.english",
                              defaultMessage: "English"
                            })
                          }
                        ),
                        commTypeOptions.map((type, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              px: 0.75,
                              py: 0.75,
                              display: "flex",
                              alignItems: "center",
                              borderRight: i < commTypeOptions.length - 1 ? `1px solid ${border.divider}` : "none",
                              borderTop: `1px solid ${border.divider}`
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Lg,
                              {
                                variant: "outlined",
                                size: "small",
                                sx: templateBtnSx,
                                onClick: () => handleCreateTemplate(type.value),
                                label: "label.template"
                              }
                            )
                          },
                          `eng-${type.value}`
                        ))
                      ]
                    }
                  )
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Dt,
              {
                sx: {
                  minHeight: 120,
                  p: 1.5,
                  border: `1px dashed ${border.divider}`,
                  borderRadius: "8px",
                  backgroundColor: surfaces.panel,
                  display: "flex",
                  alignItems: "center"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: noteTextSx, children: intl.formatMessage({
                  id: "label.mailmaster.templateHint",
                  defaultMessage: "Select a mail code to view templates."
                }) })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.fee",
              defaultMessage: "Fee"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.ApplyFee",
                    defaultMessage: "Apply Fee"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "applyFee",
                  value: applyFee,
                  onChange: (e) => setApplyFee(e.target.value),
                  options: applyFeeOptions,
                  placeholder: "Select",
                  align: lE.TEXT
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.UsingMethod",
                    defaultMessage: "Using Method"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "usingMethod",
                  value: usingMethod,
                  onChange: (e) => setUsingMethod(e.target.value),
                  options: usingMethodOptions,
                  placeholder: "Select",
                  align: lE.TEXT
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.Amount",
                    defaultMessage: "Amount"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ap,
                      {
                        value: feeAmount,
                        onChange: (e) => {
                          var _a;
                          return setFeeAmount(((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                        },
                        editable: true,
                        align: lE.NUMBER,
                        width: 90
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 12, color: "#555" }, children: "% of" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SE,
                      {
                        name: "percentOf",
                        value: percentOf,
                        onChange: (e) => setPercentOf(e.target.value),
                        options: percentOfOptions,
                        placeholder: "Select",
                        align: lE.TEXT,
                        width: 170
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldRowSx, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.mailmaster.FlatAmount",
                    defaultMessage: "Flat Amount"
                  }),
                  sx: labelSx
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  value: flatAmount,
                  onChange: (e) => {
                    var _a;
                    return setFlatAmount(((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: true,
                  align: lE.NUMBER,
                  width: 120
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.cost",
              defaultMessage: "Cost Parameters"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  p: 1.5,
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  backgroundColor: surfaces.panel
                },
                children: [
                  mailCode && commTypeOptions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        border: `1px solid ${border.divider}`,
                        backgroundColor: surfaces.paper
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              display: "grid",
                              gridTemplateColumns: `repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`,
                              backgroundColor: surfaces.panel,
                              borderBottom: `1px solid ${border.divider}`
                            },
                            children: commTypeOptions.map((type, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Dt,
                              {
                                sx: {
                                  minHeight: 40,
                                  px: 1,
                                  py: 0.75,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textAlign: "center",
                                  fontSize: 12,
                                  color: text.primary,
                                  borderRight: i < commTypeOptions.length - 1 ? `1px solid ${border.divider}` : "none"
                                },
                                children: type.label
                              },
                              `cost-h-${type.value}`
                            ))
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              display: "grid",
                              gridTemplateColumns: `repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`
                            },
                            children: commTypeOptions.map((type, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Dt,
                              {
                                sx: {
                                  px: 0.5,
                                  py: 0.5,
                                  borderRight: i < commTypeOptions.length - 1 ? `1px solid ${border.divider}` : "none"
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ap,
                                  {
                                    value: costParameters[type.value] || "",
                                    onChange: (e) => setCostParameters((prev) => {
                                      var _a;
                                      return {
                                        ...prev,
                                        [type.value]: ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e
                                      };
                                    }),
                                    editable: true,
                                    align: lE.NUMBER,
                                    width: "100%"
                                  }
                                )
                              },
                              `cost-v-${type.value}`
                            ))
                          }
                        )
                      ]
                    }
                  ) : null,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      sx: {
                        ...noteTextSx,
                        fontStyle: "italic",
                        mt: mailCode ? 1 : 0
                      },
                      children: intl.formatMessage({
                        id: "label.mailmaster.costPlaceholder",
                        defaultMessage: "Enter cost parameters for each communication type."
                      })
                    }
                  )
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.recipients",
              defaultMessage: "Recipients"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: surfaces.paper
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        justifyItems: "start",
                        backgroundColor: surfaces.panel,
                        borderBottom: `1px solid ${border.divider}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Dt,
                          {
                            sx: {
                              p: 1,
                              borderRight: `1px solid ${border.divider}`,
                              display: "grid",
                              gridTemplateColumns: "auto minmax(0, 1fr)",
                              columnGap: 1,
                              alignItems: "center"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                cc,
                                {
                                  checked: autoTrigger,
                                  onChange: (e) => setAutoTrigger(e.target.checked)
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Typography,
                                {
                                  sx: {
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: text.primary,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  },
                                  children: intl.formatMessage({
                                    id: "label.mailmaster.WhenAutoGenerated",
                                    defaultMessage: "When Auto Generated"
                                  })
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Dt,
                          {
                            sx: {
                              p: 1,
                              display: "grid",
                              gridTemplateColumns: "auto minmax(0, 1fr)",
                              columnGap: 1,
                              alignItems: "center"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                cc,
                                {
                                  checked: allowAdhoc,
                                  onChange: (e) => setAllowAdhoc(e.target.checked)
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Typography,
                                {
                                  sx: {
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: text.primary,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "left"
                                  },
                                  children: intl.formatMessage({
                                    id: "label.mailmaster.AllowManuallySending",
                                    defaultMessage: "Allow Manually Sending"
                                  })
                                }
                              )
                            ]
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
                        gridTemplateColumns: "1fr 1fr",
                        minHeight: 200
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { borderRight: `1px solid ${border.divider}` }, children: recipientOptions.map((recipient, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Dt,
                          {
                            sx: {
                              display: "grid",
                              gridTemplateColumns: "auto minmax(0, 1fr)",
                              alignItems: "center",
                              px: 1.25,
                              py: 0.75,
                              borderBottom: idx < recipientOptions.length - 1 ? `1px solid ${border.divider}` : "none"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                cc,
                                {
                                  checked: autoRecipients[recipient.value] || false,
                                  onChange: (e) => setAutoRecipients((prev) => ({
                                    ...prev,
                                    [recipient.value]: e.target.checked
                                  }))
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Typography,
                                {
                                  sx: {
                                    fontSize: 12,
                                    color: text.primary,
                                    ml: 0.9,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  },
                                  children: recipient.label
                                }
                              )
                            ]
                          },
                          recipient.value
                        )) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: recipientOptions.map((recipient, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Dt,
                          {
                            sx: {
                              display: "grid",
                              gridTemplateColumns: "auto minmax(0, 1fr)",
                              alignItems: "center",
                              px: 1.25,
                              py: 0.75,
                              borderBottom: idx < recipientOptions.length - 1 ? `1px solid ${border.divider}` : "none"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "auto", flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                cc,
                                {
                                  checked: manualRecipients[recipient.value] || false,
                                  onChange: (e) => setManualRecipients((prev) => ({
                                    ...prev,
                                    [recipient.value]: e.target.checked
                                  }))
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Typography,
                                {
                                  sx: {
                                    fontSize: 12,
                                    color: text.primary,
                                    ml: 0.9,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                  },
                                  children: recipient.label
                                }
                              )
                            ]
                          },
                          `manual-${recipient.value}`
                        )) })
                      ]
                    }
                  )
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: pageSectionSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: sectionTitleSx, children: intl.formatMessage({
              id: "label.mailmaster.section.accessControl",
              defaultMessage: "Access Control"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { ...noteTextSx, mb: 1.25 }, children: intl.formatMessage({
              id: "label.mailmaster.accessControl.hint",
              defaultMessage: "Configure access control for mail master."
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Dt,
              {
                sx: {
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  overflow: "hidden"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: "2fr 0.8fr 0.8fr",
                        backgroundColor: surfaces.panel,
                        borderBottom: `1px solid ${border.divider}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              p: 1,
                              fontWeight: 600,
                              fontSize: 11,
                              borderRight: `1px solid ${border.divider}`
                            },
                            children: intl.formatMessage({
                              id: "label.mailmaster.accessControl.profileCode",
                              defaultMessage: "Profile Code"
                            })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              p: 1,
                              fontWeight: 600,
                              fontSize: 11,
                              textAlign: "center",
                              borderRight: `1px solid ${border.divider}`
                            },
                            children: intl.formatMessage({
                              id: "label.mailmaster.accessControl.generate",
                              defaultMessage: "Generate"
                            })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              p: 1,
                              fontWeight: 600,
                              fontSize: 11,
                              textAlign: "center"
                            },
                            children: intl.formatMessage({
                              id: "label.mailmaster.accessControl.editPreview",
                              defaultMessage: "Edit / Preview"
                            })
                          }
                        )
                      ]
                    }
                  ),
                  ACCESS_PROFILES.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Dt,
                    {
                      sx: {
                        display: "grid",
                        gridTemplateColumns: "2fr 0.8fr 0.8fr",
                        borderBottom: `1px solid ${border.divider}`
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 1, fontSize: 11 }, children: profile }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Dt,
                          {
                            sx: {
                              p: 0.8,
                              textAlign: "center",
                              borderRight: `1px solid ${border.divider}`
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              cc,
                              {
                                checked: false,
                                onChange: () => {
                                },
                                label: "",
                                margin: "0",
                                align: "center"
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 0.8, textAlign: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          cc,
                          {
                            checked: false,
                            onChange: () => {
                            },
                            label: "",
                            margin: "0",
                            align: "center"
                          }
                        ) })
                      ]
                    },
                    profile
                  ))
                ]
              }
            )
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { open: Boolean(editorTemplateId), onClose: (_, reason) => {
          if (reason === "backdropClick") return;
          handleEditorClose();
        }, fullWidth: true, maxWidth: false, disableContentWrapper: true, slotProps: { paper: {
          sx: {
            display: "flex",
            flexDirection: "column",
            width: "82vw",
            height: "95vh",
            m: 0,
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: 2,
            overflow: "hidden",
            background: "linear-gradient(180deg, rgba(248, 251, 253, 0.98) 0%, rgba(239, 246, 250, 0.98) 100%)",
            border: "1px solid #d7e4ee",
            boxShadow: "0 20px 60px rgba(16, 57, 85, 0.24)"
          }
        } }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DialogContent,
            {
              sx: {
                p: 1,
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                background: surfaces.panel,
                "& [id='onlyoffice-editor']": {
                  height: "100% !important",
                  minHeight: "0 !important",
                  maxHeight: "100% !important",
                  overflow: "hidden !important"
                },
                "& [id='onlyoffice-editor'] iframe": {
                  height: "100% !important"
                }
              },
              children: [
                editorTemplateCode === "M" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      height: 70,
                      minHeight: 90,
                      maxHeight: 90,
                      flexShrink: 0,
                      flexGrow: 0,
                      p: "8px 10px",
                      borderRadius: 2,
                      border: `1px solid ${border.divider}`,
                      backgroundColor: surfaces.paper,
                      boxShadow: `0 4px 12px ${action.soft}`,
                      boxSizing: "border-box",
                      justifyContent: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 13,
                            fontWeight: 700,
                            color: text.primary,
                            mb: 0.75
                          },
                          children: "Subject"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        pp,
                        {
                          id: `mail-template-subject-${editorTemplateId}`,
                          value: editorSubject,
                          onChange: (e) => setEditorSubject(e.target.value),
                          placeholder: "Enter subject",
                          width: "100%",
                          maxLines: 1,
                          maxLength: 250,
                          required: true
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      flex: 1,
                      minHeight: 0,
                      borderRadius: 2,
                      border: `1px solid ${border.divider}`,
                      overflow: "hidden",
                      backgroundColor: surfaces.paper,
                      boxShadow: `0 4px 12px ${action.soft}`,
                      display: "flex",
                      flexDirection: "column",
                      "& [id='onlyoffice-editor']": {
                        height: "100% !important",
                        minHeight: "0 !important",
                        maxHeight: "100% !important",
                        overflow: "hidden !important"
                      }
                    },
                    children: editorTemplateId ? /* @__PURE__ */ jsxRuntimeExports.jsx(InlineTemplateEditor, { templateId: editorTemplateId }) : null
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DialogActions,
            {
              sx: {
                px: 2,
                py: 1.5,
                backgroundColor: surfaces.paper,
                justifyContent: "flex-start"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1.5,
                    width: "100%"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 96 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Lg,
                      {
                        variant: "outlined",
                        onClick: handleEditorClose,
                        label: "common.buttonBar.close",
                        fullWidth: true,
                        sx: {
                          borderColor: border.control,
                          color: text.primary,
                          borderRadius: 1.5,
                          px: 2.1,
                          py: 0.8,
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": {
                            borderColor: border.hover,
                            backgroundColor: action.hover
                          }
                        }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 96 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Lg,
                      {
                        variant: "contained",
                        onClick: handleEditorSave,
                        label: "common.buttonBar.save",
                        fullWidth: true,
                        sx: {
                          borderRadius: 1.5,
                          px: 2.4,
                          py: 0.8,
                          textTransform: "none",
                          fontWeight: 700,
                          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                          boxShadow: `0 10px 22px ${action.soft}`,
                          "&:hover": {
                            background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`
                          }
                        }
                      }
                    ) })
                  ]
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { px: 2.5, py: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSave,
            onReset: handleReset,
            onDelete: !isNewRecord ? handleDelete : null,
            onClose: () => navigate("/homelayout/welcomepage")
          }
        ) })
      ]
    }
  );
};
export {
  MailMaster as default
};
