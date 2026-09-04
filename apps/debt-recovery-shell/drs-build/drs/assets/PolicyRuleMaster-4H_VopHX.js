import { ed as useIntl, ct as ar, eh as useNavigate, dN as reactExports, d4 as getKeycloakApiPath, aX as Kr, dB as jsxRuntimeExports, aY as LE, ac as Dt, dK as ps, cs as ap, dD as lE, aM as Grid, dA as jg, bH as SE, cB as cc, cJ as dc, da as gridActionDefObj, bI as SEARCH_API_ENDPOINTS, dm as gridResultDefObj, bd as Ng, cc as Tooltip, aR as IconButton, g as AddIcon, bJ as SaveIcon, a0 as DeleteIcon, O as CloseIcon, ef as useLocation, cx as bp, ep as vp, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { h as PolicyRuleAPI } from "./apiEndpoints-CGlR3-gk.js";
const PolicyRulePopup = ({ open, onClose, onSaveSuccess, props }) => {
  const { txtType, szWFCode, txtBaseType, ruleSeqNo } = props || {};
  const intl = useIntl();
  const toast = ar();
  useNavigate();
  const [form, setForm] = reactExports.useState({ szEventType: "T" });
  const [dropdowns, setDropdowns] = reactExports.useState({});
  const [filterParams, setFilterParams] = reactExports.useState([]);
  const [txtRuleSeqNo, setTxtRuleSeqNo] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [searchParams, setSearchParams] = reactExports.useState({});
  const [searchBoxKey, setSearchBoxKey] = reactExports.useState(0);
  const [dmnTableRequestDto, setDmnTableRequestDto] = reactExports.useState(null);
  const handleChange = (id, value) => setForm((prev) => ({ ...prev, [id]: value }));
  const [crsSkipOn, setCrsSkipOn] = reactExports.useState([]);
  const [crsDateFrom, setCrsDateFrom] = reactExports.useState([]);
  const [crsResultCategories, setCrsResultCategories] = reactExports.useState([]);
  const [crsActionCategory, setCrsActionCategory] = reactExports.useState([]);
  const [crsException, setCrsException] = reactExports.useState([]);
  const [ruleEvents, setRuleEvents] = reactExports.useState([]);
  const isAfterSelected = form.szEventType === "T";
  const isFunctionSelected = form.szEventType === "A";
  const [functionData, setFunctionData] = reactExports.useState([]);
  const fieldMap = [
    { chk: "chkStrategyMail", txt: "txtStrategyMail" },
    { chk: "chkProvisioningAction", txt: "txtProvisioningAction" },
    { chk: "chkChangeWorkflow", txt: "txtChangeWorkflow" },
    { chk: "chkInitiateWorkflow", txt: "txtInitiateWorkflow" },
    { chk: "chkMail", txt: "txtMail" },
    { chk: "chkPrompt", txt: "txtPrompt" },
    { chk: "chkReallocGroup", txt: "txtReallocGroup" },
    { chk: "chkNonChangeWorkflow", txt: "txtNonChangeWorkflow" },
    { chk: "chkNonInitiateWorkflow", txt: "txtNonInitiateWorkflow" },
    { chk: "chkEscalate", txt: "txtEscalate" },
    { chk: "chkCloseWorkflow", txt: "txtCloseWorkflow" },
    { chk: "chkNonChangeWorkflow", txt: "txtNonChangeWorkflow" },
    { chk: "chkNonInitiateWorkflow", txt: "txtNonInitiateWorkflow" },
    { chk: "chkSetAttribute", txt: "cmbAttributes" }
  ];
  const fetchFunctionItems = reactExports.useCallback(async () => {
    var _a, _b, _c, _d, _e;
    const url = `${getKeycloakApiPath()}menu`;
    const result = await Kr.GET(url);
    const allFunIds = (_e = (_d = (_c = (_b = (_a = result == null ? void 0 : result.data) == null ? void 0 : _a.menus) == null ? void 0 : _b["EARLY-COLLECTIONS"]) == null ? void 0 : _c.hangingFunctions) == null ? void 0 : _d.filter((item) => item.funId)) == null ? void 0 : _e.flatMap((item) => {
      var _a2;
      return ((_a2 = item.children) == null ? void 0 : _a2.map((child) => ({
        funId: child.funId,
        funName: intl.formatMessage({
          id: `label.menu.${child.funId}`,
          defaultMessage: child.label
        }),
        label: child.label
      }))) || [];
    });
    setFunctionData(allFunIds);
    return {
      data: {
        responseJson: allFunIds
      }
    };
  }, []);
  const gridFunctionDefObj = [
    {
      gridHeaderDesc: intl.formatMessage({
        id: "label.function.name",
        defaultMessage: "Function Code"
      }),
      gridMappingName: "funName",
      gridColumnWidth: 280
    }
  ];
  const getFunNameFromId = (funId) => {
    const found = functionData.find((item) => item.funId === funId);
    return (found == null ? void 0 : found.funName) || "";
  };
  const applyAutoCheckbox = (data) => {
    const updated = { ...data };
    fieldMap.forEach(({ chk, txt }) => {
      if (data[txt]) {
        updated[chk] = "Y";
      }
    });
    return updated;
  };
  const handleCheckbox = (field, checked) => {
    setForm((prev) => {
      let updated = {
        ...prev,
        [field]: checked ? "Y" : "N"
      };
      const mapping = fieldMap.find((f) => f.chk === field);
      if (!checked && mapping) {
        updated[mapping.txt] = "";
      }
      return updated;
    });
  };
  const rowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 1.5
  };
  const sectionCardSx = {
    border: "1px solid #d9e2ec",
    borderRadius: "6px",
    overflow: "hidden"
  };
  const sectionHeadSx = {
    display: "flex",
    alignItems: "center",
    px: 2,
    py: 0.75,
    fontSize: "12px",
    fontWeight: "bold",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    mb: 1.5
  };
  const labelColSx = {
    minWidth: 90,
    flexShrink: 0
  };
  const disabledSx = (enabled) => ({
    opacity: enabled ? 0.5 : 1,
    pointerEvents: enabled ? "none" : "auto"
  });
  const buildPayload = () => {
    const payload = {
      ...form,
      dmnTableRequestDto,
      szType: props.txtType,
      szModuleCode: props.txtBaseType,
      szBusinessUnitCode: "EXQ"
    };
    return payload;
  };
  const loadDropdownsData = async () => {
    var _a, _b, _c, _d, _e;
    try {
      setLoading(true);
      const result = await Kr.GET(PolicyRuleAPI.fetchDropdowns(props.screenMenuId));
      const data = ((_a = result.data.responseJson) == null ? void 0 : _a.lstHolidayBeh) || [];
      const dateFrom = ((_b = result.data.responseJson) == null ? void 0 : _b.lstFrom) || [];
      const resultCategorty = ((_c = result.data.responseJson) == null ? void 0 : _c.lstResultCategory) || [];
      const actionCategorty = ((_d = result.data.responseJson) == null ? void 0 : _d.lstActionCategory) || [];
      const exclusion = ((_e = result.data.responseJson) == null ? void 0 : _e.lstExclusion) || [];
      setCrsSkipOn(data);
      setCrsDateFrom(dateFrom);
      setCrsResultCategories(resultCategorty);
      setCrsActionCategory(actionCategorty);
      setCrsException(exclusion);
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "error.WorkflowRule.errorLoadingPopupData",
          defaultMessage: "Error loading popup data"
        })
      );
      console.error("Error loading popup data", error);
    } finally {
      setLoading(false);
    }
  };
  const loadRuleData = async () => {
    var _a;
    if (!ruleSeqNo) return;
    try {
      setLoading(true);
      if (ruleSeqNo === null) {
        toast.error(
          intl.formatMessage({
            id: "error.WorkflowRule.missingSeqNo",
            defaultMessage: "Rule sequence number is missing."
          })
        );
        return;
      }
      const result = await Kr.GET(PolicyRuleAPI.Rule(ruleSeqNo, props.screenMenuId));
      if (result) {
        const data = (_a = result == null ? void 0 : result.data) == null ? void 0 : _a.responseJson;
        setTxtRuleSeqNo(data.iRuleSequenceNo);
        const updatedData = applyAutoCheckbox(data);
        const parsedCondition = parseRuleCondition(data.szRuleCondition);
        setForm((prev) => ({
          ...prev,
          ...updatedData,
          ...parsedCondition
        }));
      }
    } catch (err) {
      toast.error(
        intl.formatMessage({
          id: "error.WorkflowRule.errorFetchRule",
          defaultMessage: "Failed to fetch rule details."
        })
      );
    } finally {
      setLoading(false);
    }
  };
  const parseRuleCondition = (condition) => {
    if (!condition) {
      return {
        cmbType: "",
        cmbCondition: "",
        txtTypeValue: ""
      };
    }
    const regex = /^'\$P!\{(.+?)\}'(=|!=|<=|>=|<|>)'(.+)'$/;
    const match = condition.match(regex);
    if (!match) {
      return {
        cmbType: "",
        cmbCondition: "",
        txtTypeValue: ""
      };
    }
    return {
      cmbType: match[1],
      cmbCondition: match[2],
      txtTypeValue: match[3]
    };
  };
  reactExports.useEffect(() => {
    if (!open) {
      resetForm();
      return;
    }
    loadDropdownsData();
    if (ruleSeqNo) {
      loadRuleData();
    } else {
      resetForm();
    }
  }, [open, ruleSeqNo]);
  const resetForm = () => {
    const resetValues = fieldMap.reduce(
      (acc, { chk }) => {
        acc[chk] = "N";
        return acc;
      },
      {
        szEventType: "T",
        chkAutoAction: "N",
        chkResetGroup: "N",
        chkResetAlloc: "N",
        chkNxtWrkgDay: "N"
      }
    );
    setForm(resetValues);
    setTxtRuleSeqNo("");
    setDmnTableRequestDto(null);
    setSearchBoxKey((prev) => prev + 1);
  };
  const validateForm = () => {
    var _a;
    const errors = [];
    if (!((_a = form.szRuleDesc) == null ? void 0 : _a.trim())) {
      errors.push(
        intl.formatMessage({
          id: "error.WorkflowRule.descriptionMandatory",
          defaultMessage: "Description is mandatory."
        })
      );
    }
    if (form.szEventType === "A" && form.cmbType != null && form.cmbCondition == null) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.operatorempty",
          defaultMessage: "Please select an Operator."
        })
      );
    }
    if (form.chkStrategyMail === "Y" && !form.txtStrategyMail) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectStrategyMail",
          defaultMessage: "Select Strategy Mail"
        })
      );
    }
    if (form.chkProvisioningAction === "Y" && !form.txtProvisioningAction) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.SelectProvisioningAction",
          defaultMessage: "Select Provisioning Action."
        })
      );
    }
    if (form.chkChangeWorkflow === "Y" && !form.txtChangeWorkflow) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectChangeWorkflow",
          defaultMessage: "Select Change Workflow."
        })
      );
    }
    if (form.chkNonChangeWorkflow === "Y" && !form.txtNonChangeWorkflow) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectNonChangeWorkflow",
          defaultMessage: "Select Non Change Workflow."
        })
      );
    }
    if (form.chkInitiateWorkflow === "Y" && !form.txtInitiateWorkflow) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectInitiateWorkflow",
          defaultMessage: "Select Initiate Workflow."
        })
      );
    }
    if (form.chkNonInitiateWorkflow === "Y" && !form.txtNonInitiateWorkflow) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectNonInitiateWorkflow",
          defaultMessage: "Select Non Initiate Workflow."
        })
      );
    }
    if (form.chkMail === "Y" && !form.txtMail) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectMail",
          defaultMessage: "Select Mail."
        })
      );
    }
    if (form.chkPrompt === "Y" && !form.txtPrompt) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.enterPrompt",
          defaultMessage: "Please enter Prompt."
        })
      );
    }
    if (form.chkReallocGroup === "Y" && !form.txtReallocGroup) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectReallocationGroup",
          defaultMessage: "Select Reallocation Group."
        })
      );
    }
    if (form.chkNextState === "Y" && !form.txtNextState) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectNextState",
          defaultMessage: "Select Next State."
        })
      );
    }
    if (form.chkCoallocGroup === "Y" && !form.txtCoallocGroup) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.selectCoallocationGroup",
          defaultMessage: "Select Coallocation Group."
        })
      );
    }
    if (form.chkSetAttribute === "Y" && !form.txtAttributeValue_val) {
      errors.push(
        intl.formatMessage({
          id: "message.WorkflowRule.attributeValue",
          defaultMessage: "Please enter Attribute Value."
        })
      );
    }
    return errors;
  };
  const hasAnyOperation = () => {
    return form.chkStrategyMail === "Y" || form.chkProvisioningAction === "Y" || form.chkChangeWorkflow === "Y" || form.chkNonChangeWorkflow === "Y" || form.chkInitiateWorkflow === "Y" || form.chkNonInitiateWorkflow === "Y" || form.chkMail === "Y" || form.chkPrompt === "Y" || form.chkEscalate === "Y" || form.chkReallocGroup === "Y" || form.chkResetGroup === "Y" || form.chkResetAlloc === "Y" || form.chkCloseWorkflow === "Y" || form.chkNextState === "Y" || form.chkSetAttribute === "Y";
  };
  const handleAdd = async () => {
    var _a, _b;
    const errors = validateForm();
    if (!hasAnyOperation()) {
      errors.push(
        intl.formatMessage({
          id: "error.WorkflowRule.provideOperation",
          defaultMessage: "Please provide atleast one operation to perform."
        })
      );
    }
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
    const payload = buildPayload();
    payload.mode = "I";
    try {
      await Kr.POST(
        PolicyRuleAPI.saveRule(props.screenMenuId),
        payload
      );
      toast.success(
        intl.formatMessage({
          id: "message.WorkflowRule.resultsSaved",
          defaultMessage: "Policy saved successfully"
        })
      );
      onSaveSuccess == null ? void 0 : onSaveSuccess();
    } catch (err) {
      toast.error(
        ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.WorkflowRule.errorSaving",
          defaultMessage: "Failed to save rule"
        })
      );
    }
  };
  const handleUpdate = async () => {
    var _a, _b;
    if (ruleSeqNo === null) {
      toast.error(
        intl.formatMessage({
          id: "error.WorkflowRule.missingSeqNo",
          defaultMessage: "Rule sequence number is missing."
        })
      );
      return;
    }
    const errors = validateForm();
    if (!hasAnyOperation()) {
      errors.push(
        intl.formatMessage({
          id: "error.WorkflowRule.provideOperation",
          defaultMessage: "Please provide atleast one operation to perform."
        })
      );
    }
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
    const payload = buildPayload();
    payload.mode = "U";
    try {
      const result = await Kr.POST(
        PolicyRuleAPI.saveRule(props.screenMenuId),
        payload
      );
      if (result.data.status === "Success") {
        toast.success(
          intl.formatMessage({
            id: "message.WorkflowRule.resultsSaved",
            defaultMessage: "Policy saved successfully"
          })
        );
      } else {
        toast.error(
          intl.formatMessage({
            id: "error.WorkflowRule.errorSaving",
            defaultMessage: "Failed to save rule"
          })
        );
      }
      onSaveSuccess == null ? void 0 : onSaveSuccess();
    } catch (err) {
      toast.error(
        ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.WorkflowRule.errorSaving",
          defaultMessage: "Failed to save rule"
        })
      );
    }
  };
  const handleDelete = async () => {
    var _a, _b;
    try {
      if (ruleSeqNo === null) {
        toast.error(
          intl.formatMessage({
            id: "error.WorkflowRule.missingSeqNo",
            defaultMessage: "Rule sequence number is missing."
          })
        );
        return;
      }
      const result = await Kr.DELETE(PolicyRuleAPI.Rule(ruleSeqNo, props.screenMenuId));
      if (result.data.status === "Success") {
        toast.success(
          intl.formatMessage({
            id: "message.WorkflowRule.ruleDeleted",
            defaultMessage: "Rule deleted successfully"
          })
        );
      } else {
        toast.error(
          intl.formatMessage({
            id: "error.WorkflowRule.deleteFailed",
            defaultMessage: "Failed to delete rule"
          })
        );
      }
      resetForm();
      onSaveSuccess == null ? void 0 : onSaveSuccess();
    } catch (err) {
      toast.error(
        ((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.WorkflowRule.errorSaving",
          defaultMessage: "Failed to save rule"
        })
      );
    }
  };
  const iconTooltipProps = {
    placement: "top",
    PopperProps: { disablePortal: false }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    LE,
    {
      open,
      onClose,
      maxWidth: "lg",
      fullWidth: true,
      contentProps: { dividers: true },
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mr: "20px", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Add", ...iconTooltipProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: handleAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Update", ...iconTooltipProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: handleUpdate, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Delete", ...iconTooltipProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: handleDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteIcon, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Cancel", ...iconTooltipProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) }) })
      ] }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.WorkflowRule.description",
                defaultMessage: "Description"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: form.szRuleDesc || "",
              onChange: (e) => {
                var _a;
                handleChange("szRuleDesc", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
              },
              editable: true,
              required: "true",
              align: lE.TEXT,
              width: 1060
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, sx: { mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionCardSx, height: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: sectionHeadSx, children: intl.formatMessage({
              id: "label.WorkflowRule.section.onEvent",
              defaultMessage: "On Event"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                jg,
                {
                  label: " ",
                  checked: isAfterSelected,
                  onChange: () => handleChange("szEventType", "T")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isAfterSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.after",
                    defaultMessage: "After"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  sx: { ...disabledSx(!isAfterSelected) },
                  value: form.txtPeriod || "",
                  onChange: (e) => {
                    var _a;
                    return handleChange("txtPeriod", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: true,
                  align: lE.TEXT,
                  width: 65
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isAfterSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.from",
                    defaultMessage: "From"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "szReferenceDateField",
                  value: form.szReferenceDateField || "",
                  onChange: (e) => handleChange("szReferenceDateField", e.target.value),
                  options: crsDateFrom.map((type) => ({
                    value: type.szDescription,
                    label: type.szCondition ? intl.formatMessage({
                      id: type.szCondition,
                      defaultMessage: type.szDescription
                    }) : type.szDescription
                  })),
                  placeholder: "Select",
                  align: lE.TEXT,
                  sx: { ...disabledSx(!isAfterSelected) }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, display: "flex", px: 2, ml: 6, alignItems: "center", flexWrap: "nowrap", flexDirection: "row", width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { alignItems: "center", display: "flex", flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(!isAfterSelected) },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.holidayBehavior",
                      defaultMessage: "Holiday behavior"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    name: "szSkipOn",
                    value: form.szSkipOn || "",
                    onChange: (e) => handleChange("szSkipOn", e.target.value),
                    options: crsSkipOn.map((type) => ({
                      value: type.szDescription,
                      label: type.szCondition ? intl.formatMessage({
                        id: type.szCondition,
                        defaultMessage: type.szDescription
                      }) : type.szDescription
                    })),
                    placeholder: "Select",
                    align: lE.TEXT,
                    sx: { ...disabledSx(!isAfterSelected) }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isAfterSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.nextWorkingDay",
                    defaultMessage: "Perform on next working day"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { marginTop: "5px", ...disabledSx(!isAfterSelected) },
                  checked: form.chkNxtWrkgDay === "Y" || form.chkNxtWrkgDay === "ON",
                  onChange: (e) => handleCheckbox("chkNxtWrkgDay", e.target.checked)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                jg,
                {
                  label: " ",
                  checked: isFunctionSelected,
                  onChange: () => handleChange("szEventType", "A")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isFunctionSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.onFunction",
                    defaultMessage: "On Function"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(!isFunctionSelected) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  searchCode: "FUNCTIONS",
                  customFetchFunction: fetchFunctionItems,
                  setSelectedValue: (val) => {
                    const selectedItem = functionData.find((item) => item.funName === val);
                    handleChange("szFunctionCode", (selectedItem == null ? void 0 : selectedItem.funId) || "");
                  },
                  selectedValue: getFunNameFromId(form.szFunctionCode),
                  selectedColumn: "funName",
                  gridDefObj: gridFunctionDefObj,
                  gridWidth: 300,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 5,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                },
                searchBoxKey
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 85 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isFunctionSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.onAction",
                    defaultMessage: "On Action"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(!isFunctionSelected) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                  searchCode: "ACDE",
                  setSelectedValue: (val) => handleChange("szActionCode", val),
                  selectedValue: form.szActionCode || "",
                  selectedColumn: "SZACTIONCODE",
                  gridDefObj: gridActionDefObj,
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 130,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                },
                searchBoxKey
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "txtActionCategory",
                  value: form.szActionCategory || "",
                  onChange: (e) => handleChange("szActionCategory", e.target.value),
                  options: crsActionCategory.map((type) => ({
                    value: type.szDescription,
                    label: type.szCode ? intl.formatMessage({
                      id: type.szCode,
                      defaultMessage: type.szDescription
                    }) : type.szDescription
                  })),
                  placeholder: "Category",
                  align: lE.TEXT,
                  sx: { ...disabledSx(!isFunctionSelected) }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 85 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isFunctionSelected) },
                  value: intl.formatMessage(
                    {
                      id: "label.WorkflowRule.onResult",
                      defaultMessage: "On Result"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(!isFunctionSelected) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "RECDE",
                  setSelectedValue: (val) => handleChange("szResultCode", val),
                  selectedValue: form.szResultCode || "",
                  selectedColumn: "szResultCode",
                  gridDefObj: gridResultDefObj,
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 130,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                },
                searchBoxKey
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "txtResultCategory",
                  value: form.szResultCategory || "",
                  onChange: (e) => handleChange("szResultCategory", e.target.value),
                  options: crsResultCategories.map((type) => ({
                    value: type.szCategoryDesc,
                    label: type.szCategoryCode ? intl.formatMessage({
                      id: type.szCategoryCode,
                      defaultMessage: type.szCategoryDesc
                    }) : type.szCategoryDesc
                  })),
                  placeholder: "Category",
                  align: lE.TEXT,
                  sx: { ...disabledSx(!isFunctionSelected) }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, pl: 0, pr: 1, alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 70 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(!isFunctionSelected) },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.and",
                    defaultMessage: "And"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 180 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "cmbType",
                  value: form.cmbType || "",
                  onChange: (e) => handleChange("cmbType", e.target.value),
                  options: [
                    { value: "ACTCONT", label: "Repeat Action Count" },
                    { value: "ICONSNRCOUNT", label: "Non Reachable Count" },
                    { value: "SZDELINQREASON", label: "Delinquency Reason" }
                  ],
                  placeholder: "Select",
                  align: lE.TEXT,
                  width: "140px",
                  sx: { ...disabledSx(!isFunctionSelected) }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 180 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "cmbCondition",
                  value: form.cmbCondition || "",
                  onChange: (e) => handleChange("cmbCondition", e.target.value),
                  options: [
                    { value: "=", label: "=" },
                    { value: "!=", label: "!=" },
                    { value: "<", label: "<" },
                    { value: ">", label: ">" },
                    { value: "<=", label: "<=" },
                    { value: ">=", label: ">=" }
                  ],
                  placeholder: "Op",
                  align: lE.TEXT,
                  width: "140px",
                  sx: { ...disabledSx(!isFunctionSelected) }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 180, mb: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  value: form.txtTypeValue || "",
                  onChange: (e) => {
                    var _a;
                    return handleChange("txtTypeValue", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: "true",
                  align: lE.TEXT,
                  width: "140px",
                  sx: { ...disabledSx(!isFunctionSelected) }
                }
              ) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionCardSx, height: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: sectionHeadSx, children: intl.formatMessage({
              id: "label.WorkflowRule.preConditions",
              defaultMessage: "Pre-Conditions"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Ng,
              {
                ruleName: form.szRuleDesc,
                ruleDesc: form.szRuleDesc,
                moduleName: "COL",
                entityCode: "ACNT",
                filterTitle: "Auto Dialer",
                filterSavedDescription: "Global ATD Filter",
                isPopedUp: false,
                IsRuleEngBased: true,
                compact: true,
                ruleEngineDmnContext: setDmnTableRequestDto
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionCardSx, height: "62%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...sectionHeadSx, flex: 1 }, children: intl.formatMessage({
                  id: "label.WorkflowRule.strategyActions",
                  defaultMessage: "Strategy Actions"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    cc,
                    {
                      sx: { width: "3%" },
                      checked: form.chkStrategyMail === "Y",
                      onChange: (e) => handleCheckbox("chkStrategyMail", e.target.checked)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ps,
                    {
                      sx: { ...disabledSx(form.chkStrategyMail === "N") },
                      value: intl.formatMessage({ id: "label.WorkflowRule.strategyMail", defaultMessage: "Strategy Generate Mail" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      sx: { ...disabledSx(form.chkStrategyMail === "N") },
                      value: (form == null ? void 0 : form.txtStrategyMail) || "",
                      onChange: (e) => {
                        var _a;
                        return handleChange("txtStrategyMail", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                      },
                      editable: true,
                      align: lE.TEXT,
                      width: 160
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, display: "none" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    sx: { width: "3%" },
                    checked: form.chkProvisioningAction === "Y",
                    onChange: (e) => handleCheckbox("chkProvisioningAction", e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.provisioningActions",
                      defaultMessage: "Provisioning Actions"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ml: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "SPA",
                    setSelectedValue: (val) => handleChange("txtProvisioningAction", val),
                    selectedValue: form.txtProvisioningAction || "",
                    selectedColumn: "SZACTIONCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5, display: "none" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 50 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.reason",
                      defaultMessage: "Reason"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ml: 10.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "RSNSC",
                    setSelectedValue: (val) => handleChange("txtReasonCode", val),
                    selectedValue: form.txtReasonCode || "",
                    selectedColumn: "SZREASONCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    sx: { width: "3%" },
                    checked: form.chkChangeWorkflow === "Y",
                    onChange: (e) => handleCheckbox("chkChangeWorkflow", e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkChangeWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.changeWorkflow",
                      defaultMessage: "Change Workflow to"
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "SCW",
                    setSelectedValue: (val) => handleChange("txtChangeWorkflow", val),
                    selectedValue: form.txtChangeWorkflow || "",
                    selectedColumn: "SZACTIONCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkChangeWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.andAllocateTo",
                      defaultMessage: "and Allocate to"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "CWAT",
                    setSelectedValue: (val) => handleChange("txtCWAllocateTo", val),
                    selectedValue: form.txtCWAllocateTo || "",
                    selectedColumn: "SZCOLLECTORGRPCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 140,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkChangeWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.andStartFromState",
                      defaultMessage: "and Start from state"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "CWSS_SFS1",
                    setSelectedValue: (val) => handleChange("txtCWChangeStateTo", val),
                    selectedValue: form.txtCWChangeStateTo || "",
                    selectedColumn: "SZWFSTATECODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 140,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    sx: { width: "3%" },
                    checked: form.chkInitiateWorkflow === "Y",
                    onChange: (e) => handleCheckbox("chkInitiateWorkflow", e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkInitiateWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.initiateWorkflow",
                      defaultMessage: "Initiate Workflow"
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "SIW",
                    setSelectedValue: (val) => handleChange("txtInitiateWorkflow", val),
                    selectedValue: form.txtInitiateWorkflow || "",
                    selectedColumn: "SZACTIONCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkInitiateWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.andAllocateTo",
                      defaultMessage: "and Allocate to"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "CWAT_FUN",
                    setSelectedValue: (val) => handleChange("txtIWAllocateTo", val),
                    selectedValue: form.txtIWAllocateTo || "",
                    selectedColumn: "SZCOLLECTORGRPCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 140,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    sx: { ...disabledSx(form.chkInitiateWorkflow === "N") },
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.andStartFromState",
                      defaultMessage: "and Start from state"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "SWSS_STS",
                    setSelectedValue: (val) => handleChange("txtIWChangeStateTo", val),
                    selectedValue: form.txtIWChangeStateTo || "",
                    selectedColumn: "SZWFSTATECODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 140,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionCardSx, mt: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: sectionHeadSx, children: intl.formatMessage({
                id: "label.WorkflowRule.options",
                defaultMessage: "Options"
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.autoAction",
                      defaultMessage: "Auto Action"
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 1, ml: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    sx: { width: "3%" },
                    checked: form.chkAutoAction === "Y" || form.chkAutoAction === "ON",
                    onChange: (e) => handleCheckbox("chkAutoAction", e.target.checked)
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 40 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.phase",
                      defaultMessage: "Phase"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ml: 5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                    searchCode: "SPS",
                    setSelectedValue: (val) => handleChange("txtPhase", val),
                    selectedValue: form.txtPhase || "",
                    selectedColumn: "SZCODE",
                    gridDefObj: "gridMailCodeDefObj",
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: 160,
                    searchBoxHeight: 27,
                    searchBoxFontSize: 12,
                    error: false
                  },
                  searchBoxKey
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { minWidth: 75 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.WorkflowRule.onExclusion",
                      defaultMessage: "On Exclusion"
                    })
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    name: "cmbException",
                    value: form.cmbException || "",
                    onChange: (e) => handleChange("cmbException", e.target.value),
                    options: crsException.map((type) => ({
                      value: type.szDescription,
                      label: type.szConditionType ? intl.formatMessage({
                        id: type.szConditionType,
                        defaultMessage: type.szDescription
                      }) : type.szDescription
                    })),
                    placeholder: "Select",
                    align: lE.TEXT
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { pb: 1 } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionCardSx, mb: 2 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...sectionHeadSx, flex: 1 }, children: intl.formatMessage({
              id: "label.WorkflowRule.others",
              defaultMessage: "Others"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkMail === "Y",
                  onChange: (e) => handleCheckbox("chkMail", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkMail === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.nonStrategyMail",
                    defaultMessage: "Non Strategy Generate Mail"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkMail === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "QMC",
                  setSelectedValue: (val) => handleChange("txtMail", val),
                  selectedValue: form.txtMail || "",
                  selectedColumn: "SZMAILCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkPrompt === "Y",
                  onChange: (e) => handleCheckbox("chkPrompt", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkPrompt === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.promptAfter",
                    defaultMessage: "Prompt After"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: 0.5, ...disabledSx(form.chkPrompt === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  value: form.txtPrompt || "",
                  onChange: (e) => {
                    var _a;
                    return handleChange("txtPrompt", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: true,
                  align: lE.TEXT,
                  width: 50
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkPrompt === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.forAction",
                    defaultMessage: "for Action"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkPrompt === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "WFR_TPF",
                  setSelectedValue: (val) => handleChange("txtPromptFor", val),
                  selectedValue: form.txtPromptFor || "",
                  selectedColumn: "SZACTIONCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 120,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkEscalate === "Y",
                  onChange: (e) => handleCheckbox("chkEscalate", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkEscalate === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.escalate",
                    defaultMessage: "Escalate"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: 0.5, ...disabledSx(form.chkEscalate === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  value: form.txtPeriod || "",
                  editable: false,
                  align: lE.TEXT,
                  width: 50
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mb: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  sx: { ...disabledSx(form.chkEscalate === "N") },
                  value: form.txtEscalate || "",
                  onChange: (e) => {
                    var _a;
                    return handleChange("txtEscalate", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: true,
                  align: lE.TEXT,
                  width: 120
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkReallocGroup === "Y",
                  onChange: (e) => handleCheckbox("chkReallocGroup", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkReallocGroup === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.reallocateGroup",
                    defaultMessage: "Reallocate To Group"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkReallocGroup === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "CGS",
                  setSelectedValue: (val) => handleChange("txtReallocGroup", val),
                  selectedValue: form.txtReallocGroup || "",
                  selectedColumn: "SZCOLLECTORGRPCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkResetGroup === "Y",
                  onChange: (e) => handleCheckbox("chkResetGroup", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.resetGroup",
                    defaultMessage: "Reset Group"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkResetAlloc === "Y" || form.chkResetAlloc === "ON",
                  onChange: (e) => handleCheckbox("chkResetAlloc", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: intl.formatMessage({
                id: "label.WorkflowRule.resetAllocation",
                defaultMessage: "Reset Allocation"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkCloseWorkflow === "Y",
                  onChange: (e) => handleCheckbox("chkCloseWorkflow", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkCloseWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.closeWorkflow",
                    defaultMessage: "Close Workflow"
                  })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkCloseWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.resumeFromState",
                    defaultMessage: "and Resume from state"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkCloseWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "WRSS",
                  setSelectedValue: (val) => handleChange("txtResumeState", val),
                  selectedValue: form.txtResumeState || "",
                  selectedColumn: "SZWFSTATECODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkNonChangeWorkflow === "Y",
                  onChange: (e) => handleCheckbox("chkNonChangeWorkflow", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.changeWorkflow",
                    defaultMessage: "Change Workflow to"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "SCW_CNG",
                  setSelectedValue: (val) => handleChange("txtNonChangeWorkflow", val),
                  selectedValue: form.txtNonChangeWorkflow || "",
                  selectedColumn: "SZACTIONCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.andAllocateTo",
                    defaultMessage: "and Allocate to"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "CWAT_NONFUN",
                  setSelectedValue: (val) => handleChange("txtNonCWAllocateTo", val),
                  selectedValue: form.txtNonCWAllocateTo || "",
                  selectedColumn: "SZCOLLECTORGRPCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 140,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.andStartFromState",
                    defaultMessage: "and Start from state"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonChangeWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "CWSS_SFS1",
                  setSelectedValue: (val) => handleChange("txtNonCWChangeStateTo", val),
                  selectedValue: form.txtNonCWChangeStateTo || "",
                  selectedColumn: "SZWFSTATECODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 140,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkNonInitiateWorkflow === "Y",
                  onChange: (e) => handleCheckbox("chkNonInitiateWorkflow", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.initiateWorkflow",
                    defaultMessage: "Initiate Workflow"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "WFS_CNG",
                  setSelectedValue: (val) => handleChange("txtNonInitiateWorkflow", val),
                  selectedValue: form.txtNonInitiateWorkflow || "",
                  selectedColumn: "SZWFCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 160,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, pl: 5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.andAllocateTo",
                    defaultMessage: "and Allocate to"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "WCGS_FUN",
                  setSelectedValue: (val) => handleChange("txtNonIWAllocateTo", val),
                  selectedValue: form.txtNonIWAllocateTo || "",
                  selectedColumn: "SZCOLLECTORGRPCODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 140,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: labelColSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.andStartFromState",
                    defaultMessage: "and Start from state"
                  })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...disabledSx(form.chkNonInitiateWorkflow === "N") }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                dc,
                {
                  apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
                  searchCode: "CWSS_SFS1",
                  setSelectedValue: (val) => handleChange("txtNonIWChangeStateTo1", val),
                  selectedValue: form.txtNonIWChangeStateTo1 || "",
                  selectedColumn: "SZWFSTATECODE",
                  gridDefObj: "gridMailCodeDefObj",
                  gridWidth: 350,
                  gridHeight: 300,
                  gridNoOfRowsPerPage: 2,
                  searchBoxWidth: 140,
                  searchBoxHeight: 27,
                  searchBoxFontSize: 12,
                  error: false
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...rowSx, px: 2, alignItems: "center", gap: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                cc,
                {
                  sx: { width: "3%" },
                  checked: form.chkSetAttribute === "Y",
                  onChange: (e) => handleCheckbox("chkSetAttribute", e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ps,
                {
                  sx: { minWidth: 40, ...disabledSx(form.chkSetAttribute === "N") },
                  value: intl.formatMessage({
                    id: "label.WorkflowRule.from",
                    defaultMessage: "From"
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 180 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SE,
                {
                  name: "cmbAttributes",
                  value: form.cmbAttributes || "",
                  onChange: (e) => handleChange("cmbAttributes", e.target.value),
                  options: dropdowns.crsAttributesDetails || [],
                  placeholder: "Select",
                  align: lE.TEXT,
                  sx: { ...disabledSx(form.chkSetAttribute === "N") }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: 180, mb: 0.5 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  sx: { ...disabledSx(form.chkSetAttribute === "N") },
                  value: form.txtAttributeValue_val || "",
                  onChange: (e) => {
                    var _a;
                    return handleChange("txtAttributeValue_val", ((_a = e == null ? void 0 : e.target) == null ? void 0 : _a.value) ?? e);
                  },
                  editable: true,
                  align: lE.TEXT,
                  width: 140
                }
              ) })
            ] })
          ] }) })
        ] })
      ]
    }
  );
};
const RULES_PAGE_SIZE = 10;
const PolicyRule = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [openPopup, setOpenPopup] = reactExports.useState(false);
  const [ruleSeqNo, setRuleSeqNo] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const columnDefs = reactExports.useMemo(() => [
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.ceventtype",
        defaultMessage: " "
      }),
      field: "cEventType",
      flex: 0.5
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.szprefiltercode",
        defaultMessage: " "
      }),
      field: "szPreFiltercode",
      flex: 0.5
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.cdeletedyn",
        defaultMessage: " "
      }),
      field: "cDeletedYN",
      flex: 0.5
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.description",
        defaultMessage: "Description"
      }),
      field: "szRuleDesc",
      flex: 4,
      editable: true,
      filter: false,
      required: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.changewhat",
        defaultMessage: "Change What"
      }),
      field: "chwht",
      flex: 2,
      editable: true,
      filter: false,
      required: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.changeTo",
        defaultMessage: "Change To"
      }),
      field: "chto",
      flex: 1.5,
      editable: true,
      filter: false,
      required: false
    },
    {
      headerName: intl.formatMessage({
        id: "label.workflowRule.edit",
        defaultMessage: " "
      }),
      field: "edit",
      flex: 1.5,
      editable: false,
      filter: false,
      required: false
    }
  ], [intl.locale]);
  const queryObject = {
    txtType: "G",
    szWFCode: "code",
    txtBaseType: "A"
  };
  const policyRuleDatasource = reactExports.useMemo(() => {
    return {
      getRows: async (params) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
        const startRow = Number(params == null ? void 0 : params.startRow) || 0;
        const endRow = Number(params == null ? void 0 : params.endRow) || POLICY_RULE_PAGE_SIZE;
        const size = Math.max(1, endRow - startRow);
        const pageNumber = Math.floor(startRow / size) + 1;
        const param = ["A", "EXQ", "G"];
        if (param.length !== 3) {
          toast.error(
            intl.formatMessage({
              id: "error.WorkflowRule.missingParameter",
              defaultMessage: "Required parameters are missing"
            })
          );
          (_a = params.successCallback) == null ? void 0 : _a.call(params, [], 0);
          setRowData([]);
          return;
        }
        setLoading(true);
        try {
          const result = await Kr.GET(
            PolicyRuleAPI.fetchGridData(
              ...param,
              screenMenuId,
              pageNumber,
              size
            )
          );
          if (((_b = result == null ? void 0 : result.data) == null ? void 0 : _b.status) !== "Success") {
            toast.error(
              intl.formatMessage({
                id: (_c = result == null ? void 0 : result.data) == null ? void 0 : _c.message,
                defaultMessage: (_d = result == null ? void 0 : result.data) == null ? void 0 : _d.message
              })
            );
            (_e = params.failCallback) == null ? void 0 : _e.call(params);
            setRowData([]);
            return;
          }
          console.log("------------- ", result);
          const rows = ((_g = (_f = result == null ? void 0 : result.data) == null ? void 0 : _f.responseJson) == null ? void 0 : _g.content) || [];
          const total = ((_i = (_h = result == null ? void 0 : result.data) == null ? void 0 : _h.responseJson) == null ? void 0 : _i.totalElements) || 0;
          const mappedRows = rows.map((item) => ({
            ...item,
            edit: "Edit"
          }));
          setRowData(mappedRows);
          (_j = params.successCallback) == null ? void 0 : _j.call(params, mappedRows, total);
        } catch (error) {
          console.error(error);
          toast.error(
            intl.formatMessage({
              id: "error.WorkflowRule.failedGridData",
              defaultMessage: "Failed to fetch grid data."
            })
          );
          setRowData([]);
          (_k = params.failCallback) == null ? void 0 : _k.call(params);
        } finally {
          setLoading(false);
        }
      }
    };
  }, [intl, screenMenuId, toast]);
  const handleEdit = (data) => {
    setRuleSeqNo(data.iRuleSequenceNo);
    setOpenPopup(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.WorkflowRule.title",
          defaultMessage: "Policy Rules"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          columnDefs,
          datasource: policyRuleDatasource,
          cacheBlockSize: RULES_PAGE_SIZE,
          onClickMapping: {
            edit: (params) => handleEdit(params.data)
          },
          gridStyle: { width: "100%", height: "320px" },
          rowModelType: "infinite",
          pagination: true,
          paginationPageSize: RULES_PAGE_SIZE,
          sort: true,
          globalSearch: false,
          rowDragging: false,
          addCheckBoxes: true,
          openPopupNewRow: () => setOpenPopup(true),
          allowAdd: true,
          allowUpdate: true,
          allowDelete: true,
          isLoading: loading
        },
        intl.locale
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage")
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PolicyRulePopup,
        {
          open: openPopup,
          onClose: () => {
            setOpenPopup(false);
            setRuleSeqNo(null);
          },
          onSaveSuccess: policyRuleDatasource,
          props: {
            ...queryObject,
            ruleSeqNo,
            screenMenuId
          }
        }
      )
    ] })
  ] });
};
export {
  PolicyRule as default
};
