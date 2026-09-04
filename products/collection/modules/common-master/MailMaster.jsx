import { useEffect, useState } from "react";
import { DialogActions, DialogContent, Grid, Typography} from "@mui/material";
import { useIntl } from "react-intl";
import {
  UNSAFE_LocationContext as LocationContext,
  UNSAFE_NavigationContext as NavigationContext,
  UNSAFE_RouteContext as RouteContext,
  useNavigate,
} from "react-router-dom";
import { useToast, HAxiosService, ALIGNMENT, HBox, HButton, HButtonBar, HCheckBox, HDropdown, HLabel, HTextField, HTextarea, SearchCommonBox, TitleBar, useDrsTheme, HBreadCrumb, clearQueryCache, HDialog } from "@helix/component-library";
import { MailMasterAPI } from "./apiEndpoints";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

import TemplateEditorPage from "@utility/TemplateEditorPage";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import { useLocation } from "react-router-dom";

import { gridMailMasterCodeDefObj } from "../../../common/components/SearchGridDefObj";

const ACCESS_PROFILES = ["AAKASH", "Agency", "Checker", "Collections Manager"];


const createInlineNavigator = () => ({
  createHref: (to) => (typeof to === "string" ? to : to?.pathname || ""),
  encodeLocation: (location) => location,
  go: () => {},
  push: () => {},
  replace: () => {},
});

const InlineTemplateEditor = ({ templateId }) => (
  <NavigationContext.Provider
    value={{
      basename: "",
      navigator: createInlineNavigator(),
      static: false,
      future: {},
    }}
  >
    <LocationContext.Provider
      value={{
        location: {
          pathname: "/homelayout/editor",
          search: `?id=${encodeURIComponent(templateId)}&embedded=1`,
          hash: "",
          state: null,
          key: "inline-editor",
        },
        navigationType: "POP",
      }}
    >
      <RouteContext.Provider
        value={{
          outlet: null,
          matches: [
            {
              params: {},
              pathname: "/homelayout/editor",
              pathnameBase: "/homelayout/editor",
              route: { path: "/editor" },
            },
          ],
        }}
      >
        <HBox sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
          <TemplateEditorPage />
        </HBox>
      </RouteContext.Provider>
    </LocationContext.Provider>
  </NavigationContext.Provider>
);

const mapSystemParamOptions = (list = [], intl) =>
  (Array.isArray(list) ? list : [])
    .map((item) => {
      const value =
        item?.value ??
        item?.szCondition ??
        item?.szAmountField ??
        item?.code ??
        "";
      const rawLabel =
        item?.label ??
        item?.szDesc ??
        item?.szDescription ??
        item?.description ??
        value;
      const i18nDefaultMessage = item?.szi18nDesc
        ? item.szi18nDesc
            .split(".")
            .pop()
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : rawLabel;
      return {
        value,
        label: item?.szi18nDesc
          ? intl.formatMessage({
              id: item.szi18nDesc,
              defaultMessage: i18nDefaultMessage,
            })
          : rawLabel,
      };
    })
    .filter((item) => item.value !== "");

const normalizeChannelName = (value) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");

const mapCommTypeOptions = (list = [], intl) =>
  mapSystemParamOptions(list, intl).map((item) => ({
    ...item,
    channel: normalizeChannelName(item.label),
  }));

const mapFeeMasterOptions = (list = []) =>
  (Array.isArray(list) ? list : [])
    .map((item) => ({
      value: item?.value ?? item?.szFeeCode ?? item?.szCondition ?? "",
      label:
        item?.label ??
        item?.szFeeDesc ??
        item?.szDesc ??
        item?.szDescription ??
        item?.szFeeCode ??
        item?.szCondition ??
        "",
    }))
    .filter((item) => item.value !== "");

const mapEntityCodeOptions = (list = []) =>
  (Array.isArray(list) ? list : [])
    .map((item) => ({
      value:
        item?.value ??
        item?.code ??
        item?.szCode ??
        item?.szEntityCode ??
        item?.szCondition ??
        "",
      label:
        item?.label ??
        item?.desc ??
        item?.szDesc ??
        item?.szDescription ??
        item?.description ??
        item?.code ??
        item?.szCode ??
        item?.szEntityCode ??
        item?.szCondition ??
        "",
    }))
    .filter((item) => item.value !== "");

const buildRecipientState = (lstMailAddressee = []) => {
  const autoState = {};
  const manualState = {};
  (Array.isArray(lstMailAddressee) ? lstMailAddressee : []).forEach((item) => {
    const key = item?.szAddresseeType || "";
    const type = (item?.chGenerationType || "").toString().toUpperCase();
    if (!key) return;
    if (type === "A") autoState[key] = true;
    if (type === "M") manualState[key] = true;
  });
  return { autoState, manualState };
};

const getResponseMessage = (response, fallback) =>
  response?.data?.message || response?.data?.msg || fallback;

const TEMPLATE_LANGUAGE_MAP = { en: "en", es: "es", fr: "fr", de: "de" };

const getTemplateLanguageCode = (locale = "en") => {
  const code = String(locale).toLowerCase().replace("_", "-").split("-")[0];
  return TEMPLATE_LANGUAGE_MAP[code] || "en";
};

const MailMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { themeVars, surfaces, text, border, action, colors } = useDrsTheme();
  const [mailCode, setMailCode] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(false);
  const [mailCategory, setMailCategory] = useState("");
  const [entityCode, setEntityCode] = useState("");
  const [commClass, setCommClass] = useState("");
  const [allowAttachment, setAllowAttachment] = useState(false);
  const [dualMailRequired, setDualMailRequired] = useState(false);
  const [applyFee, setApplyFee] = useState("");
  const [usingMethod, setUsingMethod] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [percentOf, setPercentOf] = useState("");
  const [flatAmount, setFlatAmount] = useState("");
  const [costParameters, setCostParameters] = useState({});
  const [autoRecipients, setAutoRecipients] = useState({});
  const [manualRecipients, setManualRecipients] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [commClassOptions, setCommClassOptions] = useState([]);
  const [commTypeOptions, setCommTypeOptions] = useState([]);
  const [applyFeeOptions, setApplyFeeOptions] = useState([]);
  const [usingMethodOptions, setUsingMethodOptions] = useState([]);
  const [percentOfOptions, setPercentOfOptions] = useState([]);
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [entityCodeOptions, setEntityCodeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(true);
  const [isManualMailCodeEntry, setIsManualMailCodeEntry] = useState(false);
  const [autoTrigger, setAutoTrigger] = useState(false);
  const [allowAdhoc, setAllowAdhoc] = useState(false);
  const [searchBoxKey, setSearchBoxKey] = useState(0);
  const [editorTemplateId, setEditorTemplateId] = useState("");
  const [editorTemplateCode, setEditorTemplateCode] = useState("");
  const [editorSubject, setEditorSubject] = useState("");
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const fetchDropdowns = async () => {
    try {
      setLoading(true);
      const response = await HAxiosService.GET(
        MailMasterAPI.MailMaster(screenMenuId),
        {},
      );
      const rj =
        response?.data?.responseJson ||
        response?.data?.data ||
        response?.data ||
        {};
      setCategoryOptions(
        mapSystemParamOptions(rj.lstMailCategory || rj.categoryList, intl),
      );
      setCommClassOptions(
        mapSystemParamOptions(rj.lstCommClass || rj.commClassList, intl),
      );
      setApplyFeeOptions(
        mapFeeMasterOptions(
          rj.lstMailMasterFeeMasterDto ||
            rj.lstFeeMasterEntity ||
            rj.lstFeeMasterEntities ||
            rj.applyFeeList,
        ),
      );
      setUsingMethodOptions(
        mapSystemParamOptions(rj.lstCalctype || rj.usingMethodList, intl),
      );
      setPercentOfOptions(
        mapSystemParamOptions(rj.lstAllocBase || rj.percentOfList, intl),
      );
      setCommTypeOptions(
        mapCommTypeOptions(rj.lstCommType || rj.commTypeList, intl),
      );
      setRecipientOptions(
        mapSystemParamOptions(rj.lstAddressees || rj.addresseeList, intl),
      );
      setEntityCodeOptions(
        mapEntityCodeOptions(
          rj.lstCommunicationEntities ||
            rj.lstCommEntities ||
            rj.communicationEntities ||
            rj.entityList,
        ),
      );
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
      const data = error?.response?.data;
      if (data?.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "error.mailmaster.dropdown.fetch",
            defaultMessage: "Error fetching dropdown data.",
          }),
        );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, [intl]);

  const populateForm = (responseJson) => {
    const wrapper = responseJson || {};
    const mm = wrapper.mailMaster || wrapper;
    const { autoState, manualState } = buildRecipientState(
      wrapper.lstMailAddressee,
    );
    setDescription(mm?.szMailDesc || mm?.szDescription || "");
    setActive((mm?.chActiveYn || mm?.chActive) === "Y");
    setMailCategory(mm?.szMailCategory || "");
    setEntityCode(mm?.szEntityCode || "");
    setCommClass(mm?.chCommunicationClass || mm?.szCommClass || "");
    setAllowAttachment((mm?.chAllowAttachment || mm?.cAllowAttachment) === "Y");
    setDualMailRequired((mm?.chDualMailYn || mm?.chDualMailRequired) === "Y");
    setApplyFee(mm?.szFeeCode || mm?.szApplyFee || "");
    setUsingMethod(mm?.szFeeCalculationType || mm?.szUsingMethod || "");
    setFeeAmount(mm?.flFeePercent ?? mm?.nFeeAmount ?? "");
    setPercentOf(mm?.szAmountField || mm?.szPercentOf || "");
    setFlatAmount(mm?.flFeeAmount ?? mm?.nFlatAmount ?? "");
    setCostParameters(
      (
        wrapper.lstMailTemplateType ||
        wrapper.mailTemplateTypeList ||
        []
      ).reduce((acc, item) => {
        const code = item?.szCode || item?.szCondition || "";
        if (!code) return acc;
        acc[code] = item?.flActionCost != null ? String(item.flActionCost) : "";
        return acc;
      }, {}),
    );
    setAutoRecipients(autoState);
    setManualRecipients(manualState);
    setAutoTrigger(mm?.chAutoTriggerYn === "Y");
    setAllowAdhoc(mm?.chAllowAdhocYn === "Y");
  };

  const fetchMailMasterData = async (code) => {
    if (!code) return;
    try {
      setLoading(true);
      const response = await HAxiosService.GET(
        MailMasterAPI.MailMaster(screenMenuId)+`/getmailmasterdetails?szMailCode=${code}`,
      );
      const isSuccess = response?.data?.status?.toLowerCase() === "success";
      const responseJson = response?.data?.responseJson;
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
      const data = error?.response?.data;
      if (data?.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "error.mailmaster.fetch",
            defaultMessage: "Error fetching mail master data.",
          }),
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
      szMode: mode,
    };
    const lstMailAddressee = [
      ...Object.keys(autoRecipients)
        .filter((k) => autoRecipients[k])
        .map((k) => ({ chGenerationType: "A", szAddresseeType: k })),
      ...Object.keys(manualRecipients)
        .filter((k) => manualRecipients[k])
        .map((k) => ({ chGenerationType: "M", szAddresseeType: k })),
    ];
    const lstMailTemplateType = (
      commTypeOptions.length
        ? commTypeOptions
        : Object.keys(costParameters).map((value) => ({ value, label: value }))
    ).map((item) => ({
      szCode: item.value,
      flActionCost:
        costParameters[item.value] === "" || costParameters[item.value] == null
          ? null
          : parseFloat(costParameters[item.value]),
    }));
    setLoading(true);
    return HAxiosService.POST(MailMasterAPI.MailMaster(screenMenuId), {
      szMailCode: mailCode,
      mailMaster: mailMasterPayload,
      lstMailAddressee,
      lstMailTemplateType,
    })
      .then((response) => {
        if (response?.data?.status?.toLowerCase() === "success") {
          clearQueryCache("MLCDE");
          if (mode === "N") {
            setIsNewRecord(false);
            setIsManualMailCodeEntry(false);
            setSearchBoxKey((prev) => prev + 1);
          }
          return { success: true };
        } else {
          const data = response?.data;
          if (data?.responseJson)
            handleValidationErrors(intl, toast, data.responseJson);
          return { success: false };
        }
      })
      .catch((error) => {
        console.error(error);
        const data = error?.response?.data;
        if (data?.responseJson)
          handleValidationErrors(intl, toast, data.responseJson);
        return { success: false };
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    if (!mailCode) {
      toast.warning(
        intl.formatMessage({
          id: "label.mailmaster.delete.noCode",
          defaultMessage: "Please select a mail code to delete.",
        }),
      );
      return { success: false };
    }
    if (
      window.confirm(
        intl.formatMessage({
          id: "label.mailmaster.delete.confirm",
          defaultMessage: "Are you sure you want to delete this record?",
        }),
      )
    ) {
      setLoading(true);
      return HAxiosService.POST(MailMasterAPI.MailMaster(screenMenuId), {
        szMailCode: mailCode,
        mailMaster: {
          szMailCode: mailCode,
          szMailCategory: mailCategory,
          szMode: "D",
        },
        lstMailAddressee: [],
        lstMailTemplateType: [],
      })
        .then((response) => {
          if (response?.data?.status?.toLowerCase() === "success") {
            handleReset();
            return { success: true };
          } else {
            const data = response?.data;
            if (data?.responseJson)
              handleValidationErrors(intl, toast, data.responseJson);
            return { success: false };
          }
        })
        .catch((error) => {
          console.error(error);
          const data = error?.response?.data;
          if (data?.responseJson)
            handleValidationErrors(intl, toast, data.responseJson);
          return { success: false };
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCreateTemplate = async (templateCode) => {
    if (!mailCode) {
      toast.error(
        intl.formatMessage({
          id: "label.mailmaster.code.required",
          defaultMessage: "Mail code is required.",
        }),
      );
      return;
    }
    const channel =
      commTypeOptions.find((item) => item.value === templateCode)?.channel ||
      normalizeChannelName(templateCode);
    const payload = {
      templateName: `${mailCode}_${String(templateCode).toLowerCase()}`,
      channel,
      moduleId: "COL",
      templateType: "body",
      ...(channel === "SMS" ? { isTextMedia: "Y" } : {}),
    };
    try {
      setLoading(true);
      const response = await HAxiosService.POST(
        MailMasterAPI.MailMaster(screenMenuId)+`/createtemplate`,
        payload,
      );
      const data = response?.data;
      const status = data?.status?.toLowerCase();
      if (status === "success") {
        const templateId = data?.responseJson;
        if (templateId) {
          setEditorTemplateId(templateId);
          setEditorTemplateCode(templateCode);
        } else
          toast.error(
            intl.formatMessage({
              id: "label.mailmaster.template.idNotFound",
              defaultMessage: "Template ID not found.",
            }),
          );
      } else if (status === "failure") {
        const existingTemplateId = data?.responseJson;
        if (existingTemplateId) {
          setEditorTemplateId(existingTemplateId);
          setEditorTemplateCode(templateCode);
        } else {
          toast.error(
            data?.message ||
              intl.formatMessage({
                id: "label.mailmaster.template.createFailed",
                defaultMessage: "Failed to create template.",
              }),
          );
        }
      }
    } catch (error) {
      console.error("Error creating template:", error);
      const data = error?.response?.data;
      if (data?.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "label.mailmaster.template.createError",
            defaultMessage: "Error creating template.",
          }),
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
    if (!editorTemplateId) return;
    if (editorTemplateCode === "M" && !editorSubject.trim()) {
      toast.warning(
        intl.formatMessage({
          id: "label.mailmaster.template.subjectRequired",
          defaultMessage: "Please enter subject before saving.",
        }),
      );
      return;
    }
    try {
      setLoading(true);
      const languageCode = getTemplateLanguageCode(intl.locale || "en");
      const response = await HAxiosService.PUT(
        MailMasterAPI.MailMaster(screenMenuId)+`/saveMailTemplateSubject`,
        {
          szMailCode: mailCode,
          lstMailTemplateType: [
            {
              szCode: editorTemplateCode,
              szTemplateId: editorTemplateId,
              szSubject: editorSubject,
              szLanguage: languageCode,
            },
          ],
        },
      );
      const data = response?.data;
      const status = data?.status?.toLowerCase();
      if (status === "success") {
        window.localStorage.setItem(
          `mail-template-subject:${editorTemplateId}`,
          editorSubject,
        );
        handleEditorClose();
      } else if (data?.responseJson) {
        handleValidationErrors(intl, toast, data.responseJson);
      } else {
        toast.error(
          data?.message ||
            intl.formatMessage({
              id: "label.mailmaster.template.saveFailed",
              defaultMessage: "Save failed.",
            }),
        );
      }
    } catch (error) {
      console.error("Error saving template subject:", error);
      const data = error?.response?.data;
      if (data?.responseJson)
        handleValidationErrors(intl, toast, data.responseJson);
      else
        toast.error(
          intl.formatMessage({
            id: "label.mailmaster.template.saveError",
            defaultMessage: "Error saving template subject.",
          }),
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

  useEffect(() => {
    if (!editorTemplateId) return;
    setEditorSubject(
      window.localStorage.getItem(
        `mail-template-subject:${editorTemplateId}`,
      ) || "",
    );
  }, [editorTemplateId]);

  const recipientKeys = recipientOptions.map((r) => r.value);
  const areAllAutoChecked =
    recipientKeys.length > 0 && recipientKeys.every((k) => autoRecipients[k]);
  const areAllManualChecked =
    recipientKeys.length > 0 && recipientKeys.every((k) => manualRecipients[k]);
  const toggleRecipientColumn = (type, checked) => {
    const next = recipientKeys.reduce(
      (acc, k) => ({ ...acc, [k]: checked }),
      {},
    );
    if (type === "auto") setAutoRecipients(next);
    else setManualRecipients(next);
  };

  const pageSectionSx = { height: "100%", p: 2, border: `1px solid ${border.divider}`, borderRadius: 2, backgroundColor: surfaces.paper, color: text.primary };
  const sectionTitleSx = { mb: 1.5, fontSize: 13, fontWeight: 600, color: text.primary };
const fieldRowSx = { display: "grid", gridTemplateColumns: "160px minmax(0, 1fr)", alignItems: "center", columnGap: "12px", mb: 1.2 };
  const checkboxNoteRowSx = { display: "grid", gridTemplateColumns: "160px 28px minmax(0, 1fr)", alignItems: "center", columnGap: "12px", mb: 1.2 };
const labelSx = { fontSize: 12, fontWeight: 500, color: text.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const noteTextSx = { fontSize: 11, color: text.secondary, lineHeight: 1.5 };
  const templateBtnSx = { minWidth: 0, width: "100%", height: 26, fontSize: 11, fontWeight: 500, textTransform: "none", border: `1.5px solid ${colors.primary}`, color: colors.primary, backgroundColor: surfaces.paper, borderRadius: "3px", p: "0 4px", "&:hover": { backgroundColor: action.hover, borderColor: colors.primaryDark } };
  const templateColumns = `90px repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`;

  return (
    <HBox
      sx={{
        ...themeVars,
        mt: 2,
        background: surfaces.panel,
        color: text.primary,
      }}
    >
      <HBreadCrumb/>
      <TitleBar
        title={intl.formatMessage({
          id: "label.mailmaster.title",
          defaultMessage: "Mail Master",
        })}
      />
      <HBox
        sx={{
          mx: 2.5,
          mb: 2,
          p: 2,
          border: `1px solid ${border.divider}`,
          borderRadius: 2,
          backgroundColor: surfaces.paper,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.mailmaster.MailCode",
                  defaultMessage: "Mail Code",
                })}
                required
                component="span"
                sx={{ flexShrink: 0, whiteSpace: "nowrap", minWidth: 72 }}
              />
              {isManualMailCodeEntry ? (
                <HTextField
                  value={mailCode}
                  onChange={(e) => setMailCode(e?.target?.value ?? e)}
                  editable
                  align={ALIGNMENT.TEXT}
                  width={160}
                />
              ) : (
                <SearchCommonBox
                  apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                  key={searchBoxKey}
                  searchCode="MLCDE"
                  setSelectedValue={handleMailCodeSelect}
                  selectedValue={mailCode}
                  selectedColumn="szMailCode"
                  gridDefObj={gridMailMasterCodeDefObj}
                  gridWidth={350}
                  gridHeight={300}
                  gridNoOfRowsPerPage={2}
                  searchBoxWidth={160}
                  searchBoxHeight={27}
                  searchBoxFontSize={12}
                  error={false}
                />
              )}
              <HButton
                label="label.mailmaster.new"
                variant="contained"
                size="small"
                onClick={handleNewRecord}
                sx={{
                  minWidth: 72,
                  textTransform: "none",
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  "&:hover": {
                    background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                  },
                }}
              />
            </HBox>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.mailmaster.Description",
                  defaultMessage: "Description",
                })}
                component="span"
                sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
              />
              <HBox sx={{ flex: 1, minWidth: 0 }}>
                <HTextField
                  value={description}
                  onChange={(e) => setDescription(e?.target?.value ?? e)}
                  editable
                  align={ALIGNMENT.TEXT}
                  width="100%"
                />
              </HBox>
            </HBox>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <HBox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: { md: "flex-end" },
              }}
            >
              <HLabel
                value={intl.formatMessage({
                  id: "label.mailmaster.Active",
                  defaultMessage: "Active",
                })}
              />
              <HBox sx={{ width: "auto" }}>
                <HCheckBox
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
              </HBox>
            </HBox>
          </Grid>
        </Grid>
      </HBox>

      <HBox sx={{ px: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.config",
                  defaultMessage: "Configuration",
                })}
              </Typography>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.MailCategory",
                    defaultMessage: "Mail Category",
                  })}
                  required
                  sx={labelSx}
                />
                <HDropdown
                  name="mailCategory"
                  value={mailCategory}
                  onChange={(e) => setMailCategory(e.target.value)}
                  options={categoryOptions}
                  placeholder="Select"
                  align={ALIGNMENT.TEXT}
                />
              </HBox>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.Entity",
                    defaultMessage: "Entity",
                  })}
                  sx={labelSx}
                />
                <HDropdown
                  name="entityCode"
                  value={entityCode}
                  onChange={(e) => setEntityCode(e.target.value)}
                  options={entityCodeOptions}
                  placeholder="Select"
                  align={ALIGNMENT.TEXT}
                />
              </HBox>
              <HBox sx={{ ...fieldRowSx, alignItems: "flex-start" }}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.CommunicationClass",
                    defaultMessage: "Communication Class",
                  })}
                  sx={labelSx}
                />
                <HBox>
                  <HDropdown
                    name="commClass"
                    value={commClass}
                    onChange={(e) => setCommClass(e.target.value)}
                    options={commClassOptions}
                    placeholder="Select"
                    align={ALIGNMENT.TEXT}
                  />
                  <Typography
                    sx={{
                      ...noteTextSx,
                      color: colors.accent || colors.primary,
                      mt: 0.5,
                    }}
                  >
                    {intl.formatMessage({
                      id: "label.mailmaster.customerPrefNote",
                      defaultMessage: "Customer preference note",
                    })}
                  </Typography>
                </HBox>
              </HBox>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.AllowAttachment",
                    defaultMessage: "Allow Attachment",
                  })}
                  sx={labelSx}
                />
                <HBox
                  sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
                >
                  <HCheckBox
                    checked={allowAttachment}
                    onChange={(e) => setAllowAttachment(e.target.checked)}
                    label=""
                    margin="0"
                  />
                </HBox>
              </HBox>
              <HBox sx={checkboxNoteRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.DualMailRequired",
                    defaultMessage: "Dual Mail Required",
                  })}
                  sx={labelSx}
                />
                <HBox sx={{ display: "flex", justifyContent: "center" }}>
                  <HCheckBox
                    checked={dualMailRequired}
                    onChange={(e) => setDualMailRequired(e.target.checked)}
                    label=""
                    margin="0"
                  />
                </HBox>
                <HBox
                  sx={{ display: "flex", alignItems: "center", minWidth: 0 }}
                >
                  <Typography
                    sx={{
                      ...noteTextSx,
                      flex: 1,
                      minWidth: 0,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      textOverflow: "clip",
                    }}
                  >
                    {intl.formatMessage({
                      id: "label.mailmaster.dualMailHint",
                      defaultMessage:
                        "Mail will be generated in user specific & default language.",
                    })}
                  </Typography>
                </HBox>
              </HBox>
            </HBox>
          </Grid>

          {/* â”€â”€ Templates â”€â”€ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.templates",
                  defaultMessage: "Templates",
                })}
              </Typography>
              {mailCode && commTypeOptions.length > 0 ? (
                <HBox
                  sx={{
                    border: `1px solid ${border.divider}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    backgroundColor: surfaces.paper,
                  }}
                >
                  <HBox
                    sx={{
                      display: "grid",
                      gridTemplateColumns: templateColumns,
                      backgroundColor: surfaces.panel,
                      borderBottom: `1px solid ${border.divider}`,
                    }}
                  >
                    <HBox
                      sx={{
                        px: 1,
                        py: 0.75,
                        borderRight: `1px solid ${border.divider}`,
                        minHeight: 40,
                      }}
                    />
                    {commTypeOptions.map((type, i) => (
                      <HBox
                        key={type.value}
                        sx={{
                          px: 1,
                          py: 0.75,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          color: text.primary,
                          borderRight:
                            i < commTypeOptions.length - 1
                              ? `1px solid ${border.divider}`
                              : "none",
                        }}
                      >
                        {type.label}
                      </HBox>
                    ))}
                  </HBox>
                  <HBox
                    sx={{
                      display: "grid",
                      gridTemplateColumns: templateColumns,
                      backgroundColor: surfaces.paper,
                    }}
                  >
                    <HBox
                      sx={{
                        px: 1,
                        py: 0.75,
                        display: "flex",
                        alignItems: "center",
                        fontSize: 12,
                        fontWeight: 600,
                        color: colors.primary,
                        borderRight: `1px solid ${border.divider}`,
                        borderTop: `1px solid ${border.divider}`,
                      }}
                    >
                      {intl.formatMessage({
                        id: "label.mailmaster.template.english",
                        defaultMessage: "English",
                      })}
                    </HBox>
                    {commTypeOptions.map((type, i) => (
                      <HBox
                        key={`eng-${type.value}`}
                        sx={{
                          px: 0.75,
                          py: 0.75,
                          display: "flex",
                          alignItems: "center",
                          borderRight:
                            i < commTypeOptions.length - 1
                              ? `1px solid ${border.divider}`
                              : "none",
                          borderTop: `1px solid ${border.divider}`,
                        }}
                      >
                        <HButton
                          variant="outlined"
                          size="small"
                          sx={templateBtnSx}
                          onClick={() => handleCreateTemplate(type.value)}
                          label="label.template"
                        />
                      </HBox>
                    ))}
                  </HBox>
                </HBox>
              ) : (
                <HBox
                  sx={{
                    minHeight: 120,
                    p: 1.5,
                    border: `1px dashed ${border.divider}`,
                    borderRadius: "8px",
                    backgroundColor: surfaces.panel,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={noteTextSx}>
                    {intl.formatMessage({
                      id: "label.mailmaster.templateHint",
                      defaultMessage: "Select a mail code to view templates.",
                    })}
                  </Typography>
                </HBox>
              )}
            </HBox>
          </Grid>

          {/* â”€â”€ Fee â”€â”€ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.fee",
                  defaultMessage: "Fee",
                })}
              </Typography>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.ApplyFee",
                    defaultMessage: "Apply Fee",
                  })}
                  sx={labelSx}
                />
                <HDropdown
                  name="applyFee"
                  value={applyFee}
                  onChange={(e) => setApplyFee(e.target.value)}
                  options={applyFeeOptions}
                  placeholder="Select"
                  align={ALIGNMENT.TEXT}
                />
              </HBox>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.UsingMethod",
                    defaultMessage: "Using Method",
                  })}
                  sx={labelSx}
                />
                <HDropdown
                  name="usingMethod"
                  value={usingMethod}
                  onChange={(e) => setUsingMethod(e.target.value)}
                  options={usingMethodOptions}
                  placeholder="Select"
                  align={ALIGNMENT.TEXT}
                />
              </HBox>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.Amount",
                    defaultMessage: "Amount",
                  })}
                  sx={labelSx}
                />
                <HBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <HTextField
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e?.target?.value ?? e)}
                    editable
                    align={ALIGNMENT.NUMBER}
                    width={90}
                  />
                  <Typography sx={{ fontSize: 12, color: "#555" }}>
                    % of
                  </Typography>
                  <HDropdown
                    name="percentOf"
                    value={percentOf}
                    onChange={(e) => setPercentOf(e.target.value)}
                    options={percentOfOptions}
                    placeholder="Select"
                    align={ALIGNMENT.TEXT}
                    width={170}
                  />
                </HBox>
              </HBox>
              <HBox sx={fieldRowSx}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.mailmaster.FlatAmount",
                    defaultMessage: "Flat Amount",
                  })}
                  sx={labelSx}
                />
                <HTextField
                  value={flatAmount}
                  onChange={(e) => setFlatAmount(e?.target?.value ?? e)}
                  editable
                  align={ALIGNMENT.NUMBER}
                  width={120}
                />
              </HBox>
            </HBox>
          </Grid>

          {/* â”€â”€ Cost Parameters â”€â”€ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.cost",
                  defaultMessage: "Cost Parameters",
                })}
              </Typography>
              <HBox
                sx={{
                  p: 1.5,
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  backgroundColor: surfaces.panel,
                }}
              >
                {mailCode && commTypeOptions.length > 0 ? (
                  <HBox
                    sx={{
                      border: `1px solid ${border.divider}`,
                      backgroundColor: surfaces.paper,
                    }}
                  >
                    <HBox
                      sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`,
                        backgroundColor: surfaces.panel,
                        borderBottom: `1px solid ${border.divider}`,
                      }}
                    >
                      {commTypeOptions.map((type, i) => (
                        <HBox
                          key={`cost-h-${type.value}`}
                          sx={{
                            minHeight: 40,
                            px: 1,
                            py: 0.75,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            fontSize: 12,
                            color: text.primary,
                            borderRight:
                              i < commTypeOptions.length - 1
                                ? `1px solid ${border.divider}`
                                : "none",
                          }}
                        >
                          {type.label}
                        </HBox>
                      ))}
                    </HBox>
                    <HBox
                      sx={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${Math.max(commTypeOptions.length, 1)}, minmax(0, 1fr))`,
                      }}
                    >
                      {commTypeOptions.map((type, i) => (
                        <HBox
                          key={`cost-v-${type.value}`}
                          sx={{
                            px: 0.5,
                            py: 0.5,
                            borderRight:
                              i < commTypeOptions.length - 1
                                ? `1px solid ${border.divider}`
                                : "none",
                          }}
                        >
                          <HTextField
                            value={costParameters[type.value] || ""}
                            onChange={(e) =>
                              setCostParameters((prev) => ({
                                ...prev,
                                [type.value]: e?.target?.value ?? e,
                              }))
                            }
                            editable
                            align={ALIGNMENT.NUMBER}
                            width="100%"
                          />
                        </HBox>
                      ))}
                    </HBox>
                  </HBox>
                ) : null}
                <Typography
                  sx={{
                    ...noteTextSx,
                    fontStyle: "italic",
                    mt: mailCode ? 1 : 0,
                  }}
                >
                  {intl.formatMessage({
                    id: "label.mailmaster.costPlaceholder",
                    defaultMessage:
                      "Enter cost parameters for each communication type.",
                  })}
                </Typography>
              </HBox>
            </HBox>
          </Grid>

          {/* â”€â”€ Recipients â”€â”€ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.recipients",
                  defaultMessage: "Recipients",
                })}
              </Typography>
              <HBox
                sx={{
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: surfaces.paper,
                }}
              >
                <HBox
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    justifyItems: "start",
                    backgroundColor: surfaces.panel,
                    borderBottom: `1px solid ${border.divider}`,
                  }}
                >
                  <HBox
                    sx={{
                      p: 1,
                      borderRight: `1px solid ${border.divider}`,
                      display: "grid",
                      gridTemplateColumns: "auto minmax(0, 1fr)",
                      columnGap: 1,
                      alignItems: "center",
                    }}
                  >
                    <HBox sx={{ width: "auto", flexShrink: 0 }}>
                      <HCheckBox
                        checked={autoTrigger}
                        onChange={(e) => setAutoTrigger(e.target.checked)}
                      />
                    </HBox>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {intl.formatMessage({
                        id: "label.mailmaster.WhenAutoGenerated",
                        defaultMessage: "When Auto Generated",
                      })}
                    </Typography>
                  </HBox>
                  <HBox
                    sx={{
                      p: 1,
                      display: "grid",
                      gridTemplateColumns: "auto minmax(0, 1fr)",
                      columnGap: 1,
                      alignItems: "center",
                    }}
                  >
                    <HBox sx={{ width: "auto", flexShrink: 0 }}>
                      <HCheckBox
                        checked={allowAdhoc}
                        onChange={(e) => setAllowAdhoc(e.target.checked)}
                      />
                    </HBox>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: text.primary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textAlign: "left",
                      }}
                    >
                      {intl.formatMessage({
                        id: "label.mailmaster.AllowManuallySending",
                        defaultMessage: "Allow Manually Sending",
                      })}
                    </Typography>
                  </HBox>
                </HBox>
                <HBox
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    minHeight: 200,
                  }}
                >
                  <HBox sx={{ borderRight: `1px solid ${border.divider}` }}>
                    {recipientOptions.map((recipient, idx) => (
                      <HBox
                        key={recipient.value}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "auto minmax(0, 1fr)",
                          alignItems: "center",
                          px: 1.25,
                          py: 0.75,
                          borderBottom:
                            idx < recipientOptions.length - 1
                              ? `1px solid ${border.divider}`
                              : "none",
                        }}
                      >
                        <HBox sx={{ width: "auto", flexShrink: 0 }}>
                          <HCheckBox
                            checked={autoRecipients[recipient.value] || false}
                            onChange={(e) =>
                              setAutoRecipients((prev) => ({
                                ...prev,
                                [recipient.value]: e.target.checked,
                              }))
                            }
                          />
                        </HBox>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: text.primary,
                            ml: 0.9,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {recipient.label}
                        </Typography>
                      </HBox>
                    ))}
                  </HBox>
                  <HBox>
                    {recipientOptions.map((recipient, idx) => (
                      <HBox
                        key={`manual-${recipient.value}`}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "auto minmax(0, 1fr)",
                          alignItems: "center",
                          px: 1.25,
                          py: 0.75,
                          borderBottom:
                            idx < recipientOptions.length - 1
                              ? `1px solid ${border.divider}`
                              : "none",
                        }}
                      >
                        <HBox sx={{ width: "auto", flexShrink: 0 }}>
                          <HCheckBox
                            checked={manualRecipients[recipient.value] || false}
                            onChange={(e) =>
                              setManualRecipients((prev) => ({
                                ...prev,
                                [recipient.value]: e.target.checked,
                              }))
                            }
                          />
                        </HBox>
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: text.primary,
                            ml: 0.9,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {recipient.label}
                        </Typography>
                      </HBox>
                    ))}
                  </HBox>
                </HBox>
              </HBox>
            </HBox>
          </Grid>

          {/* â”€â”€ Access Control â”€â”€ */}
          <Grid size={{ xs: 12, md: 6 }}>
            <HBox sx={pageSectionSx}>
              <Typography sx={sectionTitleSx}>
                {intl.formatMessage({
                  id: "label.mailmaster.section.accessControl",
                  defaultMessage: "Access Control",
                })}
              </Typography>
              <Typography sx={{ ...noteTextSx, mb: 1.25 }}>
                {intl.formatMessage({
                  id: "label.mailmaster.accessControl.hint",
                  defaultMessage: "Configure access control for mail master.",
                })}
              </Typography>
              <HBox
                sx={{
                  border: `1px solid ${border.divider}`,
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <HBox
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 0.8fr 0.8fr",
                    backgroundColor: surfaces.panel,
                    borderBottom: `1px solid ${border.divider}`,
                  }}
                >
                  <HBox
                    sx={{
                      p: 1,
                      fontWeight: 600,
                      fontSize: 11,
                      borderRight: `1px solid ${border.divider}`,
                    }}
                  >
                    {intl.formatMessage({
                      id: "label.mailmaster.accessControl.profileCode",
                      defaultMessage: "Profile Code",
                    })}
                  </HBox>
                  <HBox
                    sx={{
                      p: 1,
                      fontWeight: 600,
                      fontSize: 11,
                      textAlign: "center",
                      borderRight: `1px solid ${border.divider}`,
                    }}
                  >
                    {intl.formatMessage({
                      id: "label.mailmaster.accessControl.generate",
                      defaultMessage: "Generate",
                    })}
                  </HBox>
                  <HBox
                    sx={{
                      p: 1,
                      fontWeight: 600,
                      fontSize: 11,
                      textAlign: "center",
                    }}
                  >
                    {intl.formatMessage({
                      id: "label.mailmaster.accessControl.editPreview",
                      defaultMessage: "Edit / Preview",
                    })}
                  </HBox>
                </HBox>
                {ACCESS_PROFILES.map((profile) => (
                  <HBox
                    key={profile}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "2fr 0.8fr 0.8fr",
                      borderBottom: `1px solid ${border.divider}`,
                    }}
                  >
                    <HBox sx={{ p: 1, fontSize: 11 }}>{profile}</HBox>
                    <HBox
                      sx={{
                        p: 0.8,
                        textAlign: "center",
                        borderRight: `1px solid ${border.divider}`,
                      }}
                    >
                      <HCheckBox
                        checked={false}
                        onChange={() => {}}
                        label=""
                        margin="0"
                        align="center"
                      />
                    </HBox>
                    <HBox sx={{ p: 0.8, textAlign: "center" }}>
                      <HCheckBox
                        checked={false}
                        onChange={() => {}}
                        label=""
                        margin="0"
                        align="center"
                      />
                    </HBox>
                  </HBox>
                ))}
              </HBox>
            </HBox>
          </Grid>
        </Grid>
      </HBox>

      {/* â”€â”€ Editor Dialog â”€â”€ */}
      <HDialog open={Boolean(editorTemplateId)} onClose={(_, reason) => { if (reason === "backdropClick") return; handleEditorClose(); }} fullWidth maxWidth={false} disableContentWrapper slotProps={{ paper: {
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
            background:
              "linear-gradient(180deg, rgba(248, 251, 253, 0.98) 0%, rgba(239, 246, 250, 0.98) 100%)",
            border: "1px solid #d7e4ee",
            boxShadow: "0 20px 60px rgba(16, 57, 85, 0.24)",
          },
        } }}>
        <DialogContent
          sx={{
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
              overflow: "hidden !important",
            },
            "& [id='onlyoffice-editor'] iframe": {
              height: "100% !important",
            },
          }}
        >
          {editorTemplateCode === "M" && (
            <HBox
              sx={{
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
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: text.primary,
                  mb: 0.75,
                }}
              >
                Subject
              </Typography>
              <HTextarea
                id={`mail-template-subject-${editorTemplateId}`}
                value={editorSubject}
                onChange={(e) => setEditorSubject(e.target.value)}
                placeholder="Enter subject"
                width="100%"
                maxLines={1}
                maxLength={250}
                required
              />
            </HBox>
          )}
          <HBox
            sx={{
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
                overflow: "hidden !important",
              },
            }}
          >
            {editorTemplateId ? (
              <InlineTemplateEditor templateId={editorTemplateId} />
            ) : null}
          </HBox>
        </DialogContent>
        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: surfaces.paper,
            justifyContent: "flex-start",
          }}
        >
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              width: "100%",
            }}
          >
            <HBox sx={{ width: 96 }}>
              <HButton
                variant="outlined"
                onClick={handleEditorClose}
                label="common.buttonBar.close"
                fullWidth
                sx={{
                  borderColor: border.control,
                  color: text.primary,
                  borderRadius: 1.5,
                  px: 2.1,
                  py: 0.8,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: border.hover,
                    backgroundColor: action.hover,
                  },
                }}
              />
            </HBox>
            <HBox sx={{ width: 96 }}>
              <HButton
                variant="contained"
                onClick={handleEditorSave}
                label="common.buttonBar.save"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  px: 2.4,
                  py: 0.8,
                  textTransform: "none",
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
                  boxShadow: `0 10px 22px ${action.soft}`,
                  "&:hover": {
                    background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                  },
                }}
              />
            </HBox>
          </HBox>
        </DialogActions>
      </HDialog>

      {/* â”€â”€ Button Bar â”€â”€ */}
      <HBox sx={{ px: 2.5, py: 2 }}>
        <HButtonBar
          onSave={handleSave}
          onReset={handleReset}
          onDelete={!isNewRecord ? handleDelete : null}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
};

export default MailMaster;
