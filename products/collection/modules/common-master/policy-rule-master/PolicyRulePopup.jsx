import React, { useState, useEffect, useCallback, useRef } from "react";
import { IconButton, Tooltip, Grid, Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import { ALIGNMENT, HCheckBox, HDropdown, HTextField, HLabel, HBox, SearchCommonBox, HRadio, FilterMaster, useToast, HAxiosService, HDialog } from "@helix/component-library";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { SEARCH_API_ENDPOINTS, getKeycloakApiPath } from "../../../../../shared/config/apiConstants.jsx";
import { DMN_API_ENDPOINTS } from "../../ruleengine/apiEndpoints.jsx";
import { PolicyRuleAPI } from "../apiEndpoints.jsx";
import { gridActionDefObj, gridResultDefObj } from "../../../../common/components/SearchGridDefObj";

const PolicyRulePopup = ({ open, onClose, onSaveSuccess, props }) => {
    const { txtType, szWFCode, txtBaseType, ruleSeqNo } = props || {} ;    
    const intl = useIntl();
    const toast = useToast();
    const navigate = useNavigate();

    const [form, setForm] = useState({ szEventType: "T" });
    const [dropdowns, setDropdowns] = useState({});
    const [filterParams, setFilterParams] = useState([]);
    const [txtRuleSeqNo, setTxtRuleSeqNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({});
    const [searchBoxKey, setSearchBoxKey] = useState(0);

    const [dmnTableRequestDto, setDmnTableRequestDto] = useState(null);

    const handleChange = (id, value) => setForm(prev => ({ ...prev, [id]: value }));

    const [crsSkipOn, setCrsSkipOn] = useState([]);
    const [crsDateFrom, setCrsDateFrom] = useState([]);
    const [crsResultCategories, setCrsResultCategories] = useState([]);
    const [crsActionCategory, setCrsActionCategory] = useState([]);
    const [crsException, setCrsException] = useState([]);
    const [ruleEvents, setRuleEvents] = useState([]);
    
    const isAfterSelected = form.szEventType === "T";
    const isFunctionSelected = form.szEventType === "A";
    // const functionDataRef = useRef([]);
    const [functionData, setFunctionData] = useState([]);

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
        { chk: "chkSetAttribute", txt: "cmbAttributes" },
    ];

    const fetchFunctionItems = useCallback(async () => {
        const url = `${getKeycloakApiPath()}menu`;
        const result = await HAxiosService.GET(url);

        const allFunIds = result?.data?.menus?.["EARLY-COLLECTIONS"]?.hangingFunctions?.filter(item => item.funId)
            ?.flatMap(item => item.children?.map(child => ({
            funId: child.funId,
            funName: intl.formatMessage({
                id: `label.menu.${child.funId}`,
                defaultMessage: child.label
            }),
            label: child.label
        })) || []);
        // functionDataRef.current = allFunIds;
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
        const found = functionData.find(item => item.funId === funId);
        return found?.funName || "";
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
        setForm(prev => {
            let updated = {
                ...prev,
                [field]: checked ? "Y" : "N"
            };
            const mapping = fieldMap.find(f => f.chk === field);
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
        mb: 1.5,
    };

    const sectionCardSx = {
        border: "1px solid #d9e2ec",
        borderRadius: "6px",
        overflow: "hidden",
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
        mb: 1.5,
    };

    const labelColSx = {
        minWidth: 90,
        flexShrink: 0
    };

    const disabledSx = (enabled) => ({
        opacity: enabled ? 0.5 : 1,
        pointerEvents: enabled ? "none" : "auto",
    });

    const buildPayload = () => {
        const payload = {
            ...form,
            dmnTableRequestDto,
            szType: props.txtType,
            szModuleCode: props.txtBaseType,
            szBusinessUnitCode: "EXQ",
        };
        return payload;
    }

    const loadDropdownsData = async () => {
        try {
            setLoading(true);

            const result = await HAxiosService.GET(PolicyRuleAPI.fetchDropdowns(props.screenMenuId));
            const data = result.data.responseJson?.lstHolidayBeh || [];
            const dateFrom = result.data.responseJson?.lstFrom || [];
            const resultCategorty = result.data.responseJson?.lstResultCategory || [];
            const actionCategorty = result.data.responseJson?.lstActionCategory || [];
            const exclusion = result.data.responseJson?.lstExclusion || [];

            setCrsSkipOn(data);
            setCrsDateFrom(dateFrom);
            setCrsResultCategories(resultCategorty);
            setCrsActionCategory(actionCategorty);
            setCrsException(exclusion);
            
        } catch (error) {
            toast.error(
                intl.formatMessage({
                    id: "error.WorkflowRule.errorLoadingPopupData",
                    defaultMessage: "Error loading popup data",
                })
            );
            console.error("Error loading popup data", error);
        } finally {
            setLoading(false);
        }
    };

    const loadRuleData = async () => {
        if (!ruleSeqNo) return;
        try {
            setLoading(true);
            if (ruleSeqNo === null) {
                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.missingSeqNo",
                        defaultMessage: "Rule sequence number is missing.",
                    })
                );
                return;
            }
            const result = await HAxiosService.GET(PolicyRuleAPI.Rule(ruleSeqNo, props.screenMenuId));                    
            if (result) {
                const data = result?.data?.responseJson ;
                setTxtRuleSeqNo(data.iRuleSequenceNo);
                const updatedData = applyAutoCheckbox(data);
                const parsedCondition = parseRuleCondition(data.szRuleCondition);                
                setForm(prev => ({
                    ...prev,
                    ...updatedData,
                    ...parsedCondition
                }));
            }

        } catch (err) {
            toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.errorFetchRule",
                        defaultMessage: "Failed to fetch rule details.",
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
                txtTypeValue: "",
            };
        }

        const regex = /^'\$P!\{(.+?)\}'(=|!=|<=|>=|<|>)'(.+)'$/;
        const match = condition.match(regex);

        if (!match) {
            return {
                cmbType: "",
                cmbCondition: "",
                txtTypeValue: "",
            };
        }

        return {
            cmbType: match[1],
            cmbCondition: match[2],
            txtTypeValue: match[3],
        };
    };

    useEffect(() => {
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
                chkNxtWrkgDay: "N",
            }
        );
        setForm(resetValues);
        setTxtRuleSeqNo("");
        setDmnTableRequestDto(null);
        setSearchBoxKey(prev => prev + 1); // Reset SearchCommonBox if required
    };

    const validateForm = () => {
        const errors = [];
        if (!form.szRuleDesc?.trim()) {
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
        return (
            form.chkStrategyMail === "Y" ||
            form.chkProvisioningAction === "Y" ||
            form.chkChangeWorkflow === "Y" ||
            form.chkNonChangeWorkflow === "Y" ||
            form.chkInitiateWorkflow === "Y" ||
            form.chkNonInitiateWorkflow === "Y" ||
            form.chkMail === "Y" ||
            form.chkPrompt === "Y" ||
            form.chkEscalate === "Y" ||
            form.chkReallocGroup === "Y" ||
            form.chkResetGroup === "Y" ||
            form.chkResetAlloc === "Y" ||
            form.chkCloseWorkflow === "Y" ||
            form.chkNextState === "Y" ||
            form.chkSetAttribute === "Y"
        );
    };

    const handleAdd = async () => {

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
            await HAxiosService.POST(
                PolicyRuleAPI.saveRule(props.screenMenuId),
                payload
            );

            toast.success(
                intl.formatMessage({
                    id: "message.WorkflowRule.resultsSaved",
                    defaultMessage: "Policy saved successfully",
                })
            );
            onSaveSuccess?.();

        } catch (err) {
            toast.error(
                err?.response?.data?.message || 
                    intl.formatMessage({
                        id: "error.WorkflowRule.errorSaving",
                        defaultMessage: "Failed to save rule",
                    })
            );
        }
    };

    const handleUpdate = async () => {
        if (ruleSeqNo === null) {
            toast.error(
                intl.formatMessage({
                    id: "error.WorkflowRule.missingSeqNo",
                    defaultMessage: "Rule sequence number is missing.",
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
            }));
        }
        if (errors.length > 0) {
            toast.error(errors.join("\n"));
            return;
        }
        const payload = buildPayload();
        payload.mode = "U";
        try {
            const result = await HAxiosService.POST(
                PolicyRuleAPI.saveRule(props.screenMenuId),
                payload
            );
            if (result.data.status === 'Success') {
                toast.success(
                    intl.formatMessage({
                        id: "message.WorkflowRule.resultsSaved",
                        defaultMessage: "Policy saved successfully",
                    })
                );
            } else {
                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.errorSaving",
                        defaultMessage: "Failed to save rule",
                    })
                );
            }

            onSaveSuccess?.();

        } catch (err) {
            toast.error(
                err?.response?.data?.message || 
                intl.formatMessage({
                    id: "error.WorkflowRule.errorSaving",
                    defaultMessage: "Failed to save rule",
                })
            );
        }
    };

    const handleDelete = async () => {
        try {
            if (ruleSeqNo === null) {
                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.missingSeqNo",
                        defaultMessage: "Rule sequence number is missing.",
                    })
                );
                return;
            }
            const result = await HAxiosService.DELETE(PolicyRuleAPI.Rule(ruleSeqNo, props.screenMenuId));

            if (result.data.status === "Success") {
                toast.success(
                    intl.formatMessage({
                        id: "message.WorkflowRule.ruleDeleted",
                        defaultMessage: "Rule deleted successfully",
                    })
                );
            } else {
                toast.error(
                    intl.formatMessage({
                        id: "error.WorkflowRule.deleteFailed",
                        defaultMessage: "Failed to delete rule",
                    })
                );
            }
            resetForm();
            onSaveSuccess?.();

        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                intl.formatMessage({
                    id: "error.WorkflowRule.errorSaving",
                    defaultMessage: "Failed to save rule",
                })
            );
        }
    };

    const iconTooltipProps = {
        placement: "top",
        PopperProps: { disablePortal: false },
    };

    return (
        <HDialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            contentProps={{ dividers: true }}
            actions={
                <HBox sx={{ mr: "20px", display: "flex", alignItems: "center" }}>
                    <Tooltip title="Add" {...iconTooltipProps}>
                        <IconButton onClick={handleAdd}><AddIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Update" {...iconTooltipProps}>
                        <IconButton onClick={handleUpdate}><SaveIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" {...iconTooltipProps}>
                        <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Cancel" {...iconTooltipProps}>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Tooltip>
                </HBox>
            }
        >

                {/* ── Description ─────────────────────────────────────── */}
                <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <HLabel
                        value={intl.formatMessage({
                            id: "label.WorkflowRule.description",
                            defaultMessage: "Description",
                        })}
                    />
                    <HBox sx={{ mb: 0.5 }}>
                        <HTextField
                            value={form.szRuleDesc || ""}
                            onChange={(e) =>{handleChange("szRuleDesc", e?.target?.value ?? e)}}
                            editable
                            required="true"
                            align={ALIGNMENT.TEXT}
                            width={1060}
                        />
                    </HBox>
                </HBox>

                {/* ══════════ ROW 1: On Event (left) + Pre-Conditions (right) ══════════ */}
                <Grid container spacing={2} sx={{ mb: 2 }}>

                    {/* ── On Event ── */}
                    <Grid size={{xs:12, md:6}}>
                        <HBox sx={{ ...sectionCardSx, height: "100%" }}>
                            <HBox sx={sectionHeadSx}>
                                {intl.formatMessage({
                                    id: "label.WorkflowRule.section.onEvent",
                                    defaultMessage: "On Event",
                                })}
                            </HBox>

                            {/* Row 1 — ○ After [period] From [date▼] */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HRadio
                                    label=" "
                                    checked={isAfterSelected }
                                    onChange={() => handleChange("szEventType", "T")}
                                />
                                <HLabel sx={{...disabledSx(!isAfterSelected ) }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.after", 
                                        defaultMessage: "After" 
                                    })} 
                                />
                                <HBox sx={{ mb: 0.5 }}>
                                <HTextField sx={{...disabledSx(!isAfterSelected ) }}
                                    value={form.txtPeriod || ""}
                                    onChange={(e) => handleChange("txtPeriod", e?.target?.value ?? e)}
                                    editable 
                                    align={ALIGNMENT.TEXT} 
                                    width={65}
                                />
                                </HBox>
                                <HLabel sx={{...disabledSx(!isAfterSelected ) }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.from", 
                                        defaultMessage: "From" 
                                    })} />
                                <HDropdown
                                    name="szReferenceDateField"
                                    value={form.szReferenceDateField || ""}
                                    onChange={(e) => handleChange("szReferenceDateField", e.target.value)}
                                    options={crsDateFrom.map((type) => ({
                                        value: type.szDescription,
                                        label: type.szCondition
                                            ? intl.formatMessage({
                                                id: type.szCondition,
                                                defaultMessage: type.szDescription
                                            })
                                            : type.szDescription,
                                    }))}
                                    placeholder="Select"
                                    align={ALIGNMENT.TEXT}
                                    sx={{...disabledSx(!isAfterSelected ) }}
                                />
                            </HBox>

                            {/* Row 2 — Holiday behavior */}
                            <HBox sx={{ ...rowSx, display: "flex", px: 2, ml: 6, alignItems: "center", flexWrap: "nowrap", flexDirection: "row", width: "100%" }}>
                                <HBox sx={{ alignItems: "center", display: "flex", flexShrink: 0, }}>
                                    <HBox>
                                        <HLabel sx={{...disabledSx(!isAfterSelected ) }}
                                            value={intl.formatMessage({
                                                id: "label.WorkflowRule.holidayBehavior",
                                                defaultMessage: "Holiday behavior"
                                            })}
                                        />
                                    </HBox>

                                    <HDropdown
                                        name="szSkipOn"
                                        value={form.szSkipOn || ""}
                                        onChange={(e) => handleChange("szSkipOn", e.target.value)}
                                        options={crsSkipOn.map((type) => ({
                                            value: type.szDescription,
                                            label: type.szCondition
                                                ? intl.formatMessage({
                                                    id: type.szCondition,
                                                    defaultMessage: type.szDescription
                                                })
                                                : type.szDescription,
                                        }))}
                                        placeholder="Select"
                                        align={ALIGNMENT.TEXT}
                                        sx={{...disabledSx(!isAfterSelected ) }}
                                    />
                                </HBox>

                                {/* Perform on next working day */}
                                <HBox sx={{ alignItems: "center" }}>
                                    <HLabel sx={{...disabledSx(!isAfterSelected ) }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.nextWorkingDay",
                                            defaultMessage: "Perform on next working day"
                                        })}
                                    />
                                </HBox>
                                <HBox>
                                    <HCheckBox
                                        sx={{ marginTop: "5px", ...disabledSx(!isAfterSelected ) }}
                                        checked={form.chkNxtWrkgDay === "Y" || form.chkNxtWrkgDay === "ON"}
                                        onChange={(e) => handleCheckbox("chkNxtWrkgDay", e.target.checked)}
                                    />
                                </HBox>
                            </HBox>

                            {/* Row 4 — On Function */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HRadio
                                    label=" "
                                    checked={isFunctionSelected}
                                    onChange={() => handleChange("szEventType", "A")}
                                />
                                <HLabel sx={{ ...disabledSx(!isFunctionSelected) }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.onFunction",
                                        defaultMessage: "On Function"
                                    })} />
                                <HBox sx={{ ...disabledSx(!isFunctionSelected) }}>
                                    <SearchCommonBox
                                        key={searchBoxKey}
                                        searchCode="FUNCTIONS"
                                        customFetchFunction={fetchFunctionItems}
                                        setSelectedValue={(val) => {
                                            const selectedItem = functionData.find(item => item.funName === val);
                                            handleChange("szFunctionCode", selectedItem?.funId || "");
                                        }}
                                        selectedValue={getFunNameFromId(form.szFunctionCode)}
                                        selectedColumn="funName"
                                        gridDefObj={gridFunctionDefObj}
                                        gridWidth={300}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={5}
                                        searchBoxWidth={160}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* Row 5 — On Action */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HBox sx={{ minWidth: 85 }}>
                                    <HLabel sx={{ ...disabledSx(!isFunctionSelected) }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.onAction",
                                            defaultMessage: "On Action"
                                        })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(!isFunctionSelected) }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                                        key={searchBoxKey}
                                        searchCode="ACDE"
                                        setSelectedValue={(val) => handleChange("szActionCode", val)}
                                        selectedValue={form.szActionCode || ""}
                                        selectedColumn="SZACTIONCODE"
                                        gridDefObj={gridActionDefObj}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={130}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                                <HDropdown
                                    name="txtActionCategory"
                                    value={form.szActionCategory || ""}
                                    onChange={(e) => handleChange("szActionCategory", e.target.value)}
                                    options={crsActionCategory.map((type) => ({
                                        value: type.szDescription,
                                        label: type.szCode
                                            ? intl.formatMessage({
                                                id: type.szCode,
                                                defaultMessage: type.szDescription
                                            })
                                            : type.szDescription,
                                    }))}
                                    placeholder="Category"
                                    align={ALIGNMENT.TEXT}
                                    sx={{...disabledSx(!isFunctionSelected ) }}
                                />
                            </HBox>

                            {/* Row 6 — On Result */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HBox sx={{ minWidth: 85 }}>
                                    <HLabel sx={{ ...disabledSx(!isFunctionSelected) }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.onResult",
                                            defaultMessage: "On Result"
                                        }
                                        )} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(!isFunctionSelected) }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        key={searchBoxKey}
                                        searchCode="RECDE"
                                        setSelectedValue={(val) => handleChange("szResultCode", val)}
                                        selectedValue={form.szResultCode || ""}
                                        selectedColumn="szResultCode"
                                        gridDefObj={gridResultDefObj}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={130}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                                <HDropdown
                                    name="txtResultCategory"
                                    value={form.szResultCategory || ""}
                                    onChange={(e) => handleChange("szResultCategory", e.target.value)}
                                    options={crsResultCategories.map((type) => ({
                                        value: type.szCategoryDesc,
                                        label: type.szCategoryCode
                                            ? intl.formatMessage({
                                                id: type.szCategoryCode,
                                                defaultMessage: type.szCategoryDesc
                                            })
                                            : type.szCategoryDesc,
                                    }))}
                                    placeholder="Category"
                                    align={ALIGNMENT.TEXT}
                                    sx={{...disabledSx(!isFunctionSelected ) }}
                                />
                            </HBox>

                            {/* Row 7 — And */}
                            <HBox sx={{ ...rowSx, pl: 0, pr: 1, alignItems: "center", gap: 1 }}>
                                <HBox sx={{ minWidth: 70 }}>
                                    <HLabel sx={{...disabledSx(!isFunctionSelected ) }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.and", 
                                            defaultMessage: "And" 
                                    })} />
                                </HBox>
                                <HBox sx={{ width: 180 }}>
                                    <HDropdown
                                        name="cmbType"
                                        value={form.cmbType || ""}
                                        onChange={(e) => handleChange("cmbType", e.target.value)}
                                        // options={dropdowns.crsFuncCondition || []}
                                        options={[
                                            {value: "ACTCONT", label: "Repeat Action Count"},
                                            {value: "ICONSNRCOUNT", label: "Non Reachable Count"},
                                            {value: "SZDELINQREASON", label: "Delinquency Reason"},
                                        ]}
                                        placeholder="Select"
                                        align={ALIGNMENT.TEXT}
                                        width="140px"
                                        sx={{...disabledSx(!isFunctionSelected ) }}
                                    />
                                </HBox>
                                <HBox sx={{ width: 180 }}>
                                    <HDropdown
                                        name="cmbCondition"
                                        value={form.cmbCondition || ""}
                                        onChange={(e) => handleChange("cmbCondition", e.target.value)}
                                        options={[
                                            { value: "=", label: "=" },
                                            { value: "!=", label: "!=" },
                                            { value: "<", label: "<" },
                                            { value: ">", label: ">" },
                                            { value: "<=", label: "<=" },
                                            { value: ">=", label: ">=" },
                                        ]}
                                        placeholder="Op"
                                        align={ALIGNMENT.TEXT}
                                        width="140px"
                                        sx={{...disabledSx(!isFunctionSelected ) }}
                                    />
                                </HBox>
                                <HBox sx={{ width: 180, mb: 0.5 }}>
                                    <HTextField
                                        value={form.txtTypeValue || ""}
                                        onChange={(e) => handleChange("txtTypeValue", e?.target?.value ?? e)}
                                        editable = "true"
                                        align={ALIGNMENT.TEXT}
                                        width="140px"
                                        sx={{...disabledSx(!isFunctionSelected ) }}
                                    />
                                </HBox>
                            </HBox>
                        </HBox>
                    </Grid>

                    {/* ── Pre-Conditions (FilterMaster) ── */}
                    <Grid size={{xs: 12, md: 6}} >
                        <HBox sx={{ ...sectionCardSx, height: "100%" }}>
                            <HBox sx={sectionHeadSx}>
                                {intl.formatMessage({
                                    id: "label.WorkflowRule.preConditions",
                                    defaultMessage: "Pre-Conditions"
                                })}
                            </HBox>
                            <FilterMaster
                                ruleName={form.szRuleDesc}
                                ruleDesc={form.szRuleDesc}
                                moduleName="COL"
                                entityCode="ACNT"
                                filterTitle="Auto Dialer"
                                filterSavedDescription="Global ATD Filter"
                                isPopedUp={false}
                                IsRuleEngBased={true}
                                compact={true}
                                ruleEngineDmnContext={setDmnTableRequestDto}
                            />
                        </HBox>
                    </Grid>

                </Grid>

                {/* ══════════ ROW 2: Strategy Actions (left) + Others (right) ══════════ */}
                <Grid container spacing={2}>

                    {/* ── Strategy Actions ── */}
                    <Grid size={{xs: 12, md: 6}}>
                        <HBox sx={{ ...sectionCardSx, height: "62%" }}>
                            <HBox>
                            <HBox sx={{ ...sectionHeadSx, flex: 1 }}>
                                {intl.formatMessage({
                                    id: "label.WorkflowRule.strategyActions",
                                    defaultMessage: "Strategy Actions"
                                })}
                            </HBox>

                            {/* Strategy Generate Mail */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkStrategyMail === "Y"}
                                    onChange={(e) => handleCheckbox("chkStrategyMail", e.target.checked) }
                                />
                                <HLabel sx={{ ...disabledSx(form.chkStrategyMail === "N") }}
                                    value={intl.formatMessage({ id: "label.WorkflowRule.strategyMail", defaultMessage: "Strategy Generate Mail" })} />
                                {/* <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="SMC"
                                    setSelectedValue={(val) => handleChange("txtStrategyMail", val)}
                                    selectedValue={form.txtStrategyMail || ""}
                                    selectedColumn="SZACTIONCODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={160} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                /> */}
                                <HTextField sx={{ ...disabledSx(form.chkStrategyMail === "N") }}
                                    value={form?.txtStrategyMail || ""}
                                    onChange={(e) => handleChange("txtStrategyMail", e?.target?.value ?? e)}
                                    editable align={ALIGNMENT.TEXT} 
                                    width={160}
                                />
                            </HBox>
                            </HBox>

                            {/* Provisioning Actions */}
                            <HBox sx={{ ...rowSx, px: 2,display: "none" }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkProvisioningAction === "Y"}
                                    onChange={(e) => handleCheckbox("chkProvisioningAction", e.target.checked) }
                                />
                                <HBox>
                                    <HLabel
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.provisioningActions",
                                            defaultMessage: "Provisioning Actions"
                                        })} />
                                </HBox>
                                <HBox sx={{ ml: 2 }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="SPA"
                                        setSelectedValue={(val) => handleChange("txtProvisioningAction", val)}
                                        selectedValue={form.txtProvisioningAction || ""}
                                        selectedColumn="SZACTIONCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} gridHeight={300} gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160} searchBoxHeight={27} searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* indent — Reason */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5, display: "none" }}>
                                <HBox sx={{ minWidth: 50 }}>
                                    <HLabel
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.reason",
                                            defaultMessage: "Reason"
                                        })} />
                                </HBox>
                                <HBox sx={{ ml: 10.5 }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="RSNSC"
                                        setSelectedValue={(val) => handleChange("txtReasonCode", val)}
                                        selectedValue={form.txtReasonCode || ""}
                                        selectedColumn="SZREASONCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} gridHeight={300} gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160} searchBoxHeight={27} searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* Change Workflow to */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkChangeWorkflow === "Y"}
                                    onChange={(e) => handleCheckbox("chkChangeWorkflow", e.target.checked) }
                                />
                                <HLabel sx={{ ...disabledSx(form.chkChangeWorkflow === "N") }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.changeWorkflow",
                                        defaultMessage: "Change Workflow to"
                                    })} />
                                <HBox sx={{ ...disabledSx(form.chkChangeWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="SCW"
                                        setSelectedValue={(val) => handleChange("txtChangeWorkflow", val)}
                                        selectedValue={form.txtChangeWorkflow || ""}
                                        selectedColumn="SZACTIONCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* indent — and allocate to + and start from state (same row) */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5 }}>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{ ...disabledSx(form.chkChangeWorkflow === "N") }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.andAllocateTo",
                                            defaultMessage: "and Allocate to"
                                        })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkChangeWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CWAT"
                                        setSelectedValue={(val) => handleChange("txtCWAllocateTo", val)}
                                        selectedValue={form.txtCWAllocateTo || ""}
                                        selectedColumn="SZCOLLECTORGRPCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{...disabledSx(form.chkChangeWorkflow === "N") }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.andStartFromState", 
                                            defaultMessage: "and Start from state" 
                                    })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkChangeWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CWSS_SFS1"
                                        setSelectedValue={(val) => handleChange("txtCWChangeStateTo", val)}
                                        selectedValue={form.txtCWChangeStateTo || ""}
                                        selectedColumn="SZWFSTATECODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* Initiate Workflow */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkInitiateWorkflow === "Y"}
                                    onChange={(e) => handleCheckbox("chkInitiateWorkflow", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkInitiateWorkflow === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.initiateWorkflow", 
                                        defaultMessage: "Initiate Workflow" 
                                    })} />
                                <HBox sx={{ ...disabledSx(form.chkInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="SIW"
                                        setSelectedValue={(val) => handleChange("txtInitiateWorkflow", val)}
                                        selectedValue={form.txtInitiateWorkflow || ""}
                                        selectedColumn="SZACTIONCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* indent — and allocate to + and start from state */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5 }}>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{ ...disabledSx(form.chkInitiateWorkflow === "N") }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.andAllocateTo",
                                            defaultMessage: "and Allocate to"
                                        })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CWAT_FUN"
                                        setSelectedValue={(val) => handleChange("txtIWAllocateTo", val)}
                                        selectedValue={form.txtIWAllocateTo || ""}
                                        selectedColumn="SZCOLLECTORGRPCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} 
                                        gridHeight={300} 
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140} 
                                        searchBoxHeight={27} 
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{ ...disabledSx(form.chkInitiateWorkflow === "N") }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.andStartFromState",
                                            defaultMessage: "and Start from state"
                                        })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="SWSS_STS"
                                        setSelectedValue={(val) => handleChange("txtIWChangeStateTo", val)}
                                        selectedValue={form.txtIWChangeStateTo || ""}
                                        selectedColumn="SZWFSTATECODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} 
                                        gridHeight={300} 
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140} 
                                        searchBoxHeight={27} 
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                        </HBox>

                        {/* ── Options ── (sits below Others in right column) */}
                        <HBox sx={{ ...sectionCardSx, mt: 2, }}>
                            <HBox sx={sectionHeadSx}>
                                {intl.formatMessage({ 
                                    id: "label.WorkflowRule.options", 
                                    defaultMessage: "Options" 
                                })}
                            </HBox>

                            {/* Auto Action */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HLabel
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.autoAction",
                                        defaultMessage: "Auto Action"
                                    })} />
                                <HBox sx={{ mt: 1, ml: 1 }}>
                                    <HCheckBox sx={{ width: "3%" }}
                                        checked={form.chkAutoAction === "Y" || form.chkAutoAction === "ON"}
                                        onChange={(e) => handleCheckbox("chkAutoAction", e.target.checked)}
                                    />
                                </HBox>
                            </HBox>

                            {/* Phase */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HBox sx={{ minWidth: 40 }}>
                                    <HLabel 
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.phase", 
                                            defaultMessage: "Phase" 
                                    })} />
                                </HBox>
                                <HBox sx={{ ml: 5 }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        key={searchBoxKey}
                                        searchCode="SPS"
                                        setSelectedValue={(val) => handleChange("txtPhase", val)}
                                        selectedValue={form.txtPhase || ""}
                                        selectedColumn="SZCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} 
                                        gridHeight={300} 
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160} 
                                        searchBoxHeight={27} 
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* On Exclusion */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HBox sx={{ minWidth: 75 }}>
                                    <HLabel 
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.onExclusion", 
                                            defaultMessage: "On Exclusion" 
                                    })} />
                                </HBox>
                                <HDropdown
                                    name="cmbException"
                                    value={form.cmbException || ""}
                                    onChange={(e) => handleChange("cmbException", e.target.value)}
                                    options={crsException.map((type) => ({
                                        value: type.szDescription,
                                        label: type.szConditionType
                                            ? intl.formatMessage({
                                                id: type.szConditionType,
                                                defaultMessage: type.szDescription
                                            })
                                            : type.szDescription,
                                    }))}
                                    placeholder="Select"
                                    align={ALIGNMENT.TEXT}
                                />
                            </HBox>

                            <HBox sx={{ pb: 1 }} />
                        </HBox>
                    </Grid>

                    {/* ── Others  ── */}
                    <Grid size={{xs: 12, md: 6}}>

                        <HBox sx={{ ...sectionCardSx, mb: 2 }}>
                            <HBox sx={{ ...sectionHeadSx, flex: 1 }}>
                                {intl.formatMessage({ 
                                    id: "label.WorkflowRule.others", 
                                    defaultMessage: "Others" 
                                })}
                            </HBox>

                            {/* Non Strategy Generate Mail */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkMail === "Y"}
                                    onChange={(e) => handleCheckbox("chkMail", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkMail === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.nonStrategyMail", 
                                        defaultMessage: "Non Strategy Generate Mail" 
                                })} />
                                <HBox sx={{...disabledSx(form.chkMail === "N") }}>
                                <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="QMC"
                                    setSelectedValue={(val) => handleChange("txtMail", val)}
                                    selectedValue={form.txtMail || ""}
                                    selectedColumn="SZMAILCODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={160} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                />
                                </HBox>
                            </HBox>

                            {/* Prompt After */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkPrompt === "Y"}
                                    onChange={(e) => handleCheckbox("chkPrompt", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkPrompt === "N") }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.promptAfter",
                                        defaultMessage: "Prompt After"
                                    })}
                                />
                                <HBox sx={{ mb: 0.5, ...disabledSx(form.chkPrompt === "N") }}>
                                    <HTextField
                                        value={form.txtPrompt || ""}
                                        onChange={(e) => handleChange("txtPrompt", e?.target?.value ?? e)}
                                        editable align={ALIGNMENT.TEXT}
                                        width={50}
                                    />
                                </HBox>
                                <HLabel sx={{...disabledSx(form.chkPrompt === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.forAction", 
                                        defaultMessage: "for Action" 
                                })} />
                                <HBox sx={{...disabledSx(form.chkPrompt === "N") }}>
                                <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="WFR_TPF"
                                    setSelectedValue={(val) => handleChange("txtPromptFor", val)}
                                    selectedValue={form.txtPromptFor || ""}
                                    selectedColumn="SZACTIONCODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={120} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                />
                                </HBox>
                            </HBox>

                            {/* Escalate */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkEscalate === "Y"}
                                    onChange={(e) => handleCheckbox("chkEscalate", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkEscalate === "N") }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.escalate",
                                        defaultMessage: "Escalate"
                                    })} />
                                <HBox sx={{ mb: 0.5, ...disabledSx(form.chkEscalate === "N") }} >
                                    <HTextField
                                        value={form.txtPeriod || ""}
                                        editable={false}
                                        align={ALIGNMENT.TEXT}
                                        width={50}
                                    />
                                </HBox>

                                <HBox sx={{ mb: 0.5 }} >
                                    <HTextField sx={{...disabledSx(form.chkEscalate === "N") }}
                                        value={form.txtEscalate || ""}
                                        onChange={(e) => handleChange("txtEscalate", e?.target?.value ?? e)}
                                        editable 
                                        align={ALIGNMENT.TEXT} width={120}
                                    />
                                </HBox>
                            </HBox>

                            {/* Reallocate To Group */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkReallocGroup === "Y"}
                                    onChange={(e) => handleCheckbox("chkReallocGroup", e.target.checked) }
                                />
                                <HLabel sx={{ ...disabledSx(form.chkReallocGroup === "N") }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.reallocateGroup",
                                        defaultMessage: "Reallocate To Group"
                                    })} />
                                <HBox sx={{ ...disabledSx(form.chkReallocGroup === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CGS"
                                        setSelectedValue={(val) => handleChange("txtReallocGroup", val)}
                                        selectedValue={form.txtReallocGroup || ""}
                                        selectedColumn="SZCOLLECTORGRPCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* Reset Group + Reset Allocation */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkResetGroup === "Y"}
                                    onChange={(e) => handleCheckbox("chkResetGroup", e.target.checked) }
                                />
                                <HLabel 
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.resetGroup", 
                                        defaultMessage: "Reset Group" 
                                })} />
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkResetAlloc === "Y" || form.chkResetAlloc === "ON"}
                                    onChange={(e) => handleCheckbox("chkResetAlloc", e.target.checked)}
                                />
                                <HLabel value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.resetAllocation", 
                                            defaultMessage: "Reset Allocation" 
                                    })} />
                            </HBox>

                            {/* Close Workflow */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkCloseWorkflow === "Y"}
                                    onChange={(e) => handleCheckbox("chkCloseWorkflow", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkCloseWorkflow === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.closeWorkflow", 
                                        defaultMessage: "Close Workflow" 
                                })} />
                            </HBox>

                            {/* indent — and resume from state */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5 }}>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{...disabledSx(form.chkCloseWorkflow === "N") }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.resumeFromState", 
                                            defaultMessage: "and Resume from state" 
                                    })} />
                                </HBox>
                                <HBox sx={{...disabledSx(form.chkCloseWorkflow === "N") }}>
                                <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="WRSS"
                                    setSelectedValue={(val) => handleChange("txtResumeState", val)}
                                    selectedValue={form.txtResumeState || ""}
                                    selectedColumn="SZWFSTATECODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={160} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                />
                                </HBox>
                            </HBox>

                            {/* Change Workflow to (Non) */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkNonChangeWorkflow === "Y"}
                                    onChange={(e) => handleCheckbox("chkNonChangeWorkflow", e.target.checked) }
                                />
                                <HLabel sx={{...disabledSx(form.chkNonChangeWorkflow === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.changeWorkflow", 
                                        defaultMessage: "Change Workflow to" 
                                })} />
                                <HBox sx={{...disabledSx(form.chkNonChangeWorkflow === "N") }}>
                                <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="SCW_CNG"
                                    setSelectedValue={(val) => handleChange("txtNonChangeWorkflow", val)}
                                    selectedValue={form.txtNonChangeWorkflow || ""}
                                    selectedColumn="SZACTIONCODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={160} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                />
                                </HBox>
                            </HBox>

                            {/* indent — and allocate to + and start from state */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5 }}>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{...disabledSx(form.chkNonChangeWorkflow === "N") }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.andAllocateTo", 
                                            defaultMessage: "and Allocate to" 
                                    })} />
                                </HBox>
                                <HBox sx={{...disabledSx(form.chkNonChangeWorkflow === "N") }}>
                                <SearchCommonBox
                                    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                    searchCode="CWAT_NONFUN"
                                    setSelectedValue={(val) => handleChange("txtNonCWAllocateTo", val)}
                                    selectedValue={form.txtNonCWAllocateTo || ""}
                                    selectedColumn="SZCOLLECTORGRPCODE"
                                    gridDefObj={"gridMailCodeDefObj"}
                                    gridWidth={350} 
                                    gridHeight={300} 
                                    gridNoOfRowsPerPage={2}
                                    searchBoxWidth={140} 
                                    searchBoxHeight={27} 
                                    searchBoxFontSize={12}
                                    error={false}
                                />
                                </HBox>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{...disabledSx(form.chkNonChangeWorkflow === "N") }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.andStartFromState", 
                                            defaultMessage: "and Start from state" 
                                    })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkNonChangeWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CWSS_SFS1"
                                        setSelectedValue={(val) => handleChange("txtNonCWChangeStateTo", val)}
                                        selectedValue={form.txtNonCWChangeStateTo || ""}
                                        selectedColumn="SZWFSTATECODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* Initiate Workflow (Non) */}
                            <HBox sx={{ ...rowSx, px: 2 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkNonInitiateWorkflow === "Y"}
                                    onChange={(e) => handleCheckbox("chkNonInitiateWorkflow", e.target.checked) }
                                />
                                <HLabel sx={{ ...disabledSx(form.chkNonInitiateWorkflow === "N") }}
                                    value={intl.formatMessage({
                                        id: "label.WorkflowRule.initiateWorkflow",
                                        defaultMessage: "Initiate Workflow"
                                    })} />
                                <HBox sx={{ ...disabledSx(form.chkNonInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="WFS_CNG"
                                        setSelectedValue={(val) => handleChange("txtNonInitiateWorkflow", val)}
                                        selectedValue={form.txtNonInitiateWorkflow || ""}
                                        selectedColumn="SZWFCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350} 
                                        gridHeight={300} 
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={160} 
                                        searchBoxHeight={27} 
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* indent — and allocate to + and start from state */}
                            <HBox sx={{ ...rowSx, px: 2, pl: 5 }}>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{ ...disabledSx(form.chkNonInitiateWorkflow === "N") }}
                                        value={intl.formatMessage({
                                            id: "label.WorkflowRule.andAllocateTo",
                                            defaultMessage: "and Allocate to"
                                        })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkNonInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="WCGS_FUN"
                                        setSelectedValue={(val) => handleChange("txtNonIWAllocateTo", val)}
                                        selectedValue={form.txtNonIWAllocateTo || ""}
                                        selectedColumn="SZCOLLECTORGRPCODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                                <HBox sx={labelColSx}>
                                    <HLabel sx={{...disabledSx(form.chkNonInitiateWorkflow === "N") }}
                                        value={intl.formatMessage({ 
                                            id: "label.WorkflowRule.andStartFromState", 
                                            defaultMessage: "and Start from state" 
                                    })} />
                                </HBox>
                                <HBox sx={{ ...disabledSx(form.chkNonInitiateWorkflow === "N") }}>
                                    <SearchCommonBox
                                        apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
                                        searchCode="CWSS_SFS1"
                                        setSelectedValue={(val) => handleChange("txtNonIWChangeStateTo1", val)}
                                        selectedValue={form.txtNonIWChangeStateTo1 || ""}
                                        selectedColumn="SZWFSTATECODE"
                                        gridDefObj={"gridMailCodeDefObj"}
                                        gridWidth={350}
                                        gridHeight={300}
                                        gridNoOfRowsPerPage={2}
                                        searchBoxWidth={140}
                                        searchBoxHeight={27}
                                        searchBoxFontSize={12}
                                        error={false}
                                    />
                                </HBox>
                            </HBox>

                            {/* From [attributes▼] [value] */}
                            <HBox sx={{ ...rowSx, px: 2, alignItems: "center", gap: 1 }}>
                                <HCheckBox sx={{ width: "3%" }}
                                    checked={form.chkSetAttribute === "Y"}
                                    onChange={(e) => handleCheckbox("chkSetAttribute", e.target.checked) }
                                />
                                <HLabel sx={{ minWidth: 40, ...disabledSx(form.chkSetAttribute === "N") }}
                                    value={intl.formatMessage({ 
                                        id: "label.WorkflowRule.from", 
                                        defaultMessage: "From" 
                                    })}
                                />
                                <HBox sx={{ width: 180 }}>
                                    <HDropdown
                                        name="cmbAttributes"
                                        value={form.cmbAttributes || ""}
                                        onChange={(e) => handleChange("cmbAttributes", e.target.value)}
                                        options={dropdowns.crsAttributesDetails || []}
                                        placeholder="Select"
                                        align={ALIGNMENT.TEXT}
                                        sx={{...disabledSx(form.chkSetAttribute === "N")}}
                                    />
                                </HBox>
                                <HBox sx={{ width: 180, mb: 0.5 }}>
                                    <HTextField sx={{...disabledSx(form.chkSetAttribute === "N")}}
                                        value={form.txtAttributeValue_val || ""}
                                        onChange={(e) => handleChange("txtAttributeValue_val", e?.target?.value ?? e)}
                                        editable align={ALIGNMENT.TEXT} 
                                        width={140}
                                    />
                                </HBox>
                            </HBox>
                        </HBox>

                    </Grid>
                </Grid>

        </HDialog>
    );
};

export default PolicyRulePopup;