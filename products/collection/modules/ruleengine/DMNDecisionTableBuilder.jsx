import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Container,
  IconButton,
  MenuItem,
  Card,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Menu,
  ListItemIcon,
  Checkbox,
  Typography,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TableRowsIcon from '@mui/icons-material/TableRows';
import RuleIcon from '@mui/icons-material/Rule';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import ModuleIcon from '@mui/icons-material/ViewModule';
import InfoIcon from '@mui/icons-material/Info';
import { useToast, HAxiosService, SearchCommonBox, HButtonBar, HDropdown, HBox, HPaper, HButton, HLabel, HCheckBox, useDrsTheme, HAgGrid, HDialog } from "@helix/component-library";
import { buildDMNPayload } from "./dmnUtils";
import { v4 as uuidv4 } from "uuid";
import { useIntl } from "react-intl";
import PropTypes from 'prop-types';
import { DMN_API_ENDPOINTS } from "./apiEndpoints";


// Enhanced color palette matching AccountList

import { gridActionDefObj } from "../../../common/components/SearchGridDefObj";

import { useNavigate } from "react-router-dom";
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  secondaryLight: '#a8d173',
  secondaryDark: '#6b9c2c',
  accentLight: '#f44336',
  accentDark: '#a30404',
  background: {
    start: '#f8fafc',
    end: '#f1f5f9',
    gradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  cardBg: 'rgba(255, 255, 255, 0.98)',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
    muted: '#94a3b8'
  },
  border: '#e2e8f0',
  hover: '#f1f5f9',
  highlight: '#ffd966',
  highlightLight: '#fff3cd',
  appBarGradient: 'linear-gradient(135deg, #0378A6 0%, #025a8c 50%, #01406b 100%)',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  inputBg: '#e6f3ff',
  outputBg: '#d6f8da',
};

const SearchCommonBoxRenderer = (props) => {
  SearchCommonBoxRenderer.propTypes = {
    value: PropTypes.any,
    searchCode: PropTypes.string,
    colDef: PropTypes.shape({
      field: PropTypes.string,
      width: PropTypes.number,
    }),
    node: PropTypes.shape({
      setDataValue: PropTypes.func.isRequired,
    }).isRequired,
  };

  const { value, colDef, searchCode } = props;
  const fieldName = colDef?.field;

  return (
    <SearchCommonBox
      searchCode={searchCode}
      selectedValue={value}
      selectedColumn="SZACTIONCODE"
      gridDefObj={gridActionDefObj}
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={5}
      searchBoxWidth={colDef?.width - 30 || 100}
      searchBoxHeight={25}
      error={false}
      setSelectedValue={(dataValue) =>
        props.node.setDataValue(fieldName, dataValue || value)
      }
    />
  );
};

const DMNDecisionTableBuilder = ({
  showRuleMetaInfo,
  rulename,  
  ruleDesc,
  modulename,
  version,
  entityName,
  dmnType,
  inputbtnName,
  outputbtnName,
  outputAttributes,
  onSubmit,
  openGrid,
  editMode = false,
}) => {
  const theme = useTheme();
  const { isDark } = useDrsTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [hitPolicy, setHitPolicy] = useState("FIRST");
  const hitPolicyOptions = useMemo(() => [    
    { label: intl.formatMessage({ id: "dmn.hitPolicy.all", defaultMessage: "All (Collects output from multiple match)" }), value: "RULE ORDER" },
    { label: intl.formatMessage({ id: "dmn.hitPolicy.first", defaultMessage: "First (Stop at first match)" }), value: "FIRST" },
  ], [intl]);
  const [activeInputColumns, setActiveInputColumns] = useState([]);
  const [activeOutputColumns, setActiveOutputColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [anchorCondition, setAnchorCondition] = useState(null);
  const [anchorResult, setAnchorResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);  
  const toast = useToast();
  const [ruleName, setRuleName] = useState("");
  const [ruledesc, setRuledesc] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [entity, setEntity] = useState("");
  const [dmntype, setDmntype] = useState("");
  const [inputAttributes, setInputAttributes] = useState([]);
  const [initialData, setInitialData] = useState({
    entityName: "",
    hitPolicy: "FIRST",
    inputs: [],
    outputs: [],
    rules: [],
  });
  const [showDecisionTable, setShowDecisionTable] = useState(true);
  const [DmnInsertHelpOpen, setDmnInsertHelpOpen] = useState(false);
  const [isExistingRule, setIsExistingRule] = useState(false);
  const navigate = useNavigate();

  DMNDecisionTableBuilder.propTypes = {
    showRuleMetaInfo: PropTypes.bool,
    inputbtnName: PropTypes.string,
    outputbtnName: PropTypes.string,
    rulename: PropTypes.string,
    ruleDesc: PropTypes.string,
    modulename: PropTypes.string,
    version: PropTypes.number,
    dmnType: PropTypes.string,
    entityName: PropTypes.string,
    outputAttributes: PropTypes.array,
    onSubmit: PropTypes.func,
    openGrid: PropTypes.func,
    editMode: PropTypes.bool,
  };

  // load entity attributes after moduleName and entity are set
  useEffect(() => {
    setRuleName(rulename);
    setModuleName(modulename);
    setDmntype(dmnType);
    setEntity(entityName);
    setRuledesc(ruleDesc);
    console.log("Setting ruleName, moduleName, and entityName for DMN rule: ", rulename, modulename, entityName);
  }, [modulename, entityName]);

  // fetch rule details and set initial data
  useEffect(() => {
    if (ruleName && moduleName) {
      handleFileContent(ruleName, moduleName);
    }
  }, [ruleName, moduleName]);

  
  // cleanedData fetched payload
  const transformDmnResponse = (response) => {
    if (!response?.data) return null;
    const { errors, ...cleanedData } = response.data;
    console.log("Cleaned DMN json data :", cleanedData);
    return cleanedData;
  };

  const handleFileContent = async (ruleName, moduleName) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (version) {
        console.log("Fetching DMN file content for ruleName:", ruleName, "moduleName:", moduleName, "version:", version);
        response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDmnFileContent, { params: { ruleName, moduleName, version } });
      }
      else {
        console.log("Fetching latest DMN file content for ruleName:", ruleName, "moduleName:", moduleName);
        response = await HAxiosService.GET(DMN_API_ENDPOINTS.getLatestDmnFileContent, { params: { ruleName, moduleName } });
      }

      if (!response.data.success && response.data.errors[0] === `No JSON content found for ruleName ${ruleName} Module: ${moduleName}`) {
        toast.info(intl.formatMessage({ id: "dmn.toast.noDmnFound", defaultMessage: "No DMN rule found. You can add a new rule." }));
        console.log("No DMN rule found for ruleName:", ruleName, "moduleName:", moduleName);
        console.log("Add new rule");
        handleEntity(moduleName, entity);
        setIsExistingRule(false); 
        setIsLoading(false);
        return;
      }
      let jsonData = transformDmnResponse(response.data);
      console.log("Fetched DMN json data for ruleName:", ruleName, "moduleName:", moduleName);
      console.log("Raw DMN response:", jsonData);

      if (jsonData.ruleInfo.moduleName && jsonData.ruleInfo.entityName) {
        const requestData = { entityName: jsonData.ruleInfo.entityName, moduleName: jsonData.ruleInfo.moduleName };
        const entityResponse = await HAxiosService.GET(
          DMN_API_ENDPOINTS.getEntityData(),
          { params: requestData }
        );        
        setRuledesc(jsonData.ruleInfo.ruleDesc || ruleDesc);
        setEntity(jsonData.ruleInfo.entityName);
        setDmntype(jsonData.ruleInfo.dmnType);
        setHitPolicy(jsonData.ruleInfo.hitPolicy);
 
        const newInputAttributes = entityResponse?.data?.data?.map((attribute) => {
          const typeStr = typeof attribute.type === "string" ? attribute.type.toLowerCase() : "";
          return {
            name: attribute.name,
            attributeCode: attribute.attributeCode,
            type: typeStr === "numeric" ? "number" : typeStr,
            controlType: attribute.controlType,
            searchcode: attribute.searchCode,
            options: attribute.options || []
          };
        });
        setInputAttributes(newInputAttributes);
        console.log("Mapped Input attributes for mapping:", newInputAttributes);
        console.log("inputAttributes state before mapping:", inputAttributes);
        // Create a mapping from input attributeCode to input description

        const attributeCodeToDescMap = {};
        for (const attr of jsonData.ruleInfo.inputs || []) {
          attributeCodeToDescMap[attr.code] = attr.name;
        }

        // Create a mapping from output code to output description
        const outputCodeToDescMap = {};
        for (const output of jsonData.ruleInfo.outputs || []) {
          const outputCode = output.code;
          outputCodeToDescMap[outputCode] = output.name;
        }

        // Now map jsonData.inputs using the fetched attributes
        const updatedInputs = jsonData.ruleInfo.inputs.map(input => {
          const inputCode = input.code;
          const matchingAttribute = newInputAttributes.find(
            attr => attr.attributeCode === inputCode
          );

          if (matchingAttribute) {
            return {
              ...input,
              name: matchingAttribute.name,
              attributeCode: inputCode,
              type: input.type
            };
          }

          return {
            ...input,
            attributeCode: inputCode
          };
        });

        console.log("Mapped Inputs with descriptions:", inputAttributes);
        // Also transform the rules to use descriptions instead of codes
        const updatedRules = jsonData.dmnInfo.rules.map(rule => {
          const transformedInputs = {};
          const transformedOutputs = {};

          // Transform each input key in the rule
          const inputKeys = Object.keys(rule.inputs || {});
          for (const key of inputKeys) {
            const description = attributeCodeToDescMap[key] || key;
            transformedInputs[description] = rule.inputs[key];
          }

          // Transform each output key in the rule
          const outputKeys = Object.keys(rule.outputs || {});
          for (const key of outputKeys) {
            const description = outputCodeToDescMap[key] || key;
            transformedOutputs[description] = rule.outputs[key];
          }

          return {
            ...rule,
            inputs: transformedInputs,
            outputs: transformedOutputs
          };
        });

        const updatedJsonData = {
          ...jsonData,
          ruleInfo: {
            ...jsonData.ruleInfo,
            inputs: updatedInputs
            },
          dmnInfo: {
            ...jsonData.dmnInfo,
            rules: updatedRules
          }          
        };

        console.log("Final updated jsonData after mapping:", updatedJsonData);
        
        setInitialData(()=>{
               return { 
                    entityName: updatedJsonData.ruleInfo.entityName,
                    hitPolicy: updatedJsonData.ruleInfo.hitPolicy,
                    inputs: updatedJsonData.ruleInfo.inputs || [],
                    outputs: updatedJsonData.ruleInfo.outputs || [],
                    rules: updatedJsonData.dmnInfo.rules || [],}
               }           
        );
        setIsExistingRule(true); 
        toast.success(intl.formatMessage({ id: "dmn.toast.fetchedSuccess", defaultMessage: "Rules fetched successfully." }));
      } else {
        console.warn("moduleName or entityName is undefined in JSON data", jsonData.moduleName, jsonData.entityName);
        
        setInitialData(()=>{
               return { 
                    entityName: jsonData.ruleInfo.entityName,
                    hitPolicy: jsonData.ruleInfo.hitPolicy,
                    inputs: jsonData.ruleInfo.inputs || [],
                    outputs: jsonData.ruleInfo.outputs || [],
                    rules: jsonData.dmnInfo.rules || [],}
               }           
        );
        setIsExistingRule(true); 
        toast.success(intl.formatMessage({ id: "dmn.toast.fetchedSuccess", defaultMessage: "Rules fetched successfully." }));
      }
    } catch (error) {
      console.error("Failed to check rule against existing rules:", error);
      setError(error.message || intl.formatMessage({ id: "dmn.error.loadFailed", defaultMessage: "Failed to load rule data" }));
      toast.error(intl.formatMessage({ id: "dmn.error.checkFailed", defaultMessage: "Failed to check rule against existing rules" }));
      setShowDecisionTable(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {

    if (!initialData) return;

    const mergedInputs =
      initialData.inputs?.map((i) => {
        const fullDef = inputAttributes.find((a) => a.name === i.name);
        return { ...i, ...fullDef };
      }) || [];
    setActiveInputColumns(mergedInputs);
    let mergedOutputs = [];

    if (isExistingRule) {
      // Take outputs from fetched JSON
      mergedOutputs =
        initialData.outputs?.map((o) => {
          const fullDef = outputAttributes.filter(Boolean).find((a) => a.name === o.name);
          return { ...o, ...fullDef };
        }) || [];
    } else {
      // New rule take all outputAttributes from parent
      mergedOutputs = outputAttributes || [];
    }
    setActiveOutputColumns(mergedOutputs);

    const loadedRows = [];
    let loadedDefault = null;

    for (const rule of initialData.rules) {
      if (rule.otherwise) {
        loadedDefault = { id: "default", ...rule.outputs };
      } else {
        loadedRows.push({
          id: uuidv4(),
          ...rule.inputs,
          ...rule.outputs,
        });
      }
    }

    setRows(loadedRows.map((row, index) => ({ ...row, ruleNumber: index + 1 })));
  }, [initialData, inputAttributes, outputAttributes, isExistingRule]);

  const handleEntity = async (moduleName, entityName) => {
    try {
      const requestData = { moduleName, entityName };
      const response = await HAxiosService.GET(
        DMN_API_ENDPOINTS.getEntityData(),
        { params: requestData }
      );

      const newInputAttributes = response?.data?.data?.map((attribute) => {
        const typeStr = typeof attribute.type === "string" ? attribute.type.toLowerCase() : "";
        return {
          name: attribute.name,
          attributeCode: attribute.attributeCode,
          type: typeStr === "numeric" ? "number" : typeStr,
          controlType: attribute.controlType,
          searchcode: attribute.searchCode,
          options: attribute.options || []
        };
      });
      setInputAttributes(newInputAttributes);
      console.log("Mapped Input attributes :", inputAttributes);
    } catch (error) {
      console.error("Failed to fetch entity data:", error);
      toast.error(intl.formatMessage({ id: "dmn.error.fetchEntityFailed", defaultMessage: "Failed to fetch entity data" }));
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleAddRow();
      }
      if (e.shiftKey && e.key === "Delete") {
        e.preventDefault();
        const focused = document.activeElement?.closest('[role="row"]');
        if (focused) {
          const rowId = focused.dataset.id;
          if (rowId) {
            handleRemoveRow(rowId);
          }
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        const defaultRow = document.querySelector(
          '[data-id="default"] input, [data-id="default"] select'
        );
        defaultRow?.focus();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [rows]);

  // handle output attributes
  const availableOutputAttributes = useMemo(() => {
    return (isExistingRule
      ? initialData?.outputs
      : outputAttributes) || [];
  }, [isExistingRule, initialData, outputAttributes]);

  // Visible columns sync
  useEffect(() => {
    setVisibleColumns([
      ...activeInputColumns.map((c) => c.name),
      ...activeOutputColumns.filter(Boolean).map((c) => c.name),
    ]);
  }, [activeInputColumns, activeOutputColumns]);

  // Row Management
  const handleAddRow = () => {
    if (activeInputColumns.length === 0 && activeOutputColumns.length === 0) {
      toast.error(intl.formatMessage({ id: "dmn.toast.addColumnPrompt", defaultMessage: "Please add at least one column before adding rules." }));
      return;
    }
    const initData = {};
    for (const attr of [...activeInputColumns, ...activeOutputColumns]) {
      initData[attr.name] = "";
    }
    setRows([...rows, { id: uuidv4(), ruleNumber: rows.length + 1, ...initData }]);
    toast.success(intl.formatMessage({ id: "dmn.toast.rowAdded", defaultMessage: "New row added" }));
  };

  const handleRemoveRow = (rowId) => {
    const updatedRows = rows.filter(row => row.id !== rowId).map((row, index) => ({ ...row, ruleNumber: index + 1 }));
    setRows(updatedRows);
    toast.info(intl.formatMessage({ id: "dmn.toast.rowRemoved", defaultMessage: "Row removed" }));
  };

  // Condition & Result Menus
  const handleOpenConditionMenu = (e) => setAnchorCondition(e.currentTarget);
  const handleCloseConditionMenu = () => setAnchorCondition(null);
  const handleOpenResultMenu = (e) => setAnchorResult(e.currentTarget);
  const handleCloseResultMenu = () => setAnchorResult(null);

  const handleToggleColumn = (type, name) => {
    if (type === "input") {
      setActiveInputColumns((prev) => {
        const exists = prev.find((c) => c.name === name);
        return exists
          ? prev.filter((c) => c.name !== name)
          : [...prev, inputAttributes.find((a) => a.name === name)];
      });
      toast.info(intl.formatMessage(
        { id: "dmn.toast.conditionChanged", defaultMessage: "{name} {status} conditions" },
        {
          name,
          status: activeInputColumns.find((c) => c.name === name)
            ? intl.formatMessage({ id: "dmn.status.removedFrom", defaultMessage: "removed from" })
            : intl.formatMessage({ id: "dmn.status.addedTo", defaultMessage: "added to" })
        }
      ));
    } else {
      setActiveOutputColumns((prev) => {
        const exists = prev.find((c) => c.name === name);
        if (exists) {
          return prev.filter((c) => c.name !== name);
        }

        const found = availableOutputAttributes.find((a) => a.name === name);
        return found ? [...prev, found] : prev;
      });
      toast.info(intl.formatMessage(
        { id: "dmn.toast.resultChanged", defaultMessage: "{name} {status} results" },
        {
          name,
          status: activeOutputColumns.find((c) => c.name === name)
            ? intl.formatMessage({ id: "dmn.status.removedFrom", defaultMessage: "removed from" })
            : intl.formatMessage({ id: "dmn.status.addedTo", defaultMessage: "added to" })
        }
      ));
    }
  };

  const handleClearSelection = (type) => {
    if (type === "input") {
      setActiveInputColumns([]);
      toast.info(intl.formatMessage({ id: "dmn.toast.conditionsCleared", defaultMessage: "All conditions cleared" }));
    } else {
      setActiveOutputColumns([]);
      toast.info(intl.formatMessage({ id: "dmn.toast.resultsCleared", defaultMessage: "All results cleared" }));
    }
  };

  const createColumnDef = (
    attr,
    prefix,
    editMode,
    isInput,
  ) => {
    const columnDef = {
      field: attr.name,
      headerName: `${attr.name} (${attr.type})`,
      width: 200,
      sortable: false,
      editable: !!editMode,
      headerTooltip: `${prefix}: ${attr.name}`,
      cellStyle: (params) => { 
        return {
          backgroundColor: isInput
            ? "var(--drs-search-bg)"
            : "var(--drs-soft-accent)",
          fontFamily: "'Inter', sans-serif",
          fontSize: isMobile ? "13px" : "14px",
        };
      },
      headerClass: 'custom-header',
    };

    // for searchCommonBox Ag-Grid cell editable: false 
    if (attr.controlType === "SEARCH") {      
      return {
        ...columnDef,
        editable: false,
        sortable: false,
        cellRenderer: SearchCommonBoxRenderer,
        cellRendererParams: {
          searchCode: attr.searchcode,
        },
      };
    }

    if (attr.options && attr.options.length > 0) {      
      columnDef.cellEditor = "agSelectCellEditor";

      // show labels in dropdown
      columnDef.cellEditorParams = {
        values: attr.options.map(opt => opt.value)
      };

      // display label in grid
      columnDef.valueFormatter = (params) => {
        const found = attr.options.find(o => o.value === params.value);
        return found ? found.label : params.value;
      };

      // ensure saved value is actual value
      columnDef.valueParser = (params) => {
        return params.newValue;
      };
    }

    if(attr?.type?.toUpperCase()=="BOOLEAN"){
      return {
        ...columnDef,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
        editable: true,
        valueGetter: (params) => {
          return params.data?.[attr.name] === true || params.data?.[attr.name] === "true";
        },
        valueSetter: (params) => {          
          params.data[attr.name] = !!params.newValue;
          return true;
        }    
      };
    };
    return columnDef;
  };

  const columns = useMemo(() => {
    const cols = [];

    // Input columns
    for (let index = 0; index < activeInputColumns.length; index++) {
      const attr = activeInputColumns[index];
      if (!visibleColumns.includes(attr.name)) continue;

      const prefix = index === 0
        ? intl.formatMessage({ id: "dmn.when", defaultMessage: "When" })
        : intl.formatMessage({ id: "dmn.and", defaultMessage: "And" });

      cols.push(createColumnDef(attr, prefix, editMode, true));
    }

    // Output columns
    for (let index = 0; index < activeOutputColumns.length; index++) {
      const attr = activeOutputColumns[index];
      if (!attr?.name) continue;
      if (!visibleColumns.includes(attr.name)) continue;

      const prefix = index === 0
        ? intl.formatMessage({ id: "dmn.then", defaultMessage: "Then" })
        : intl.formatMessage({ id: "dmn.and", defaultMessage: "And" });

      cols.push(createColumnDef(attr, prefix, editMode, false));
    }
    return cols;
  }, [activeInputColumns, activeOutputColumns, visibleColumns, intl, editMode, isMobile, isDark]);

  // Submit =============

  const handleSubmit = async ({ newRows, updatedRows, deletedRows }) => {

    // Start with previous rows
    let updatedRowsState = [...rows];
    // Add new rows
    if (newRows && newRows.length > 0) {
      console.log("New Rows:", newRows);
      updatedRowsState = [...updatedRowsState, ...newRows.map(row => ({ ...row, id: row.id || uuidv4() }))];
    }

    // Update rows
    if (updatedRows && updatedRows.length > 0) {
      console.log("Updated Rows:", updatedRows);
      updatedRowsState = updatedRowsState.map(row => {
        const updated = updatedRows.find(u => u.id === row.id);
        return updated ? { ...row, ...updated } : row;
      });
    }

    // Remove deleted rows
    if (deletedRows && deletedRows.length > 0) {
      console.log("Deleted Rows:", deletedRows);
      updatedRowsState = updatedRowsState.filter(row => !deletedRows.some(d => d.id === row.id));
    }

    // Renumber ruleNumber sequentially
    updatedRowsState = updatedRowsState.map((row, index) => ({ ...row, ruleNumber: index + 1 }));

    // Map to DMN rule format for payload
    const dmnRows = updatedRowsState.map((row) => {
      const result = {};      
      
      const allOutputColumns = isExistingRule
        ? activeOutputColumns
        : outputAttributes; // include all outputs for new rule

      const attrs = [...activeInputColumns, ...allOutputColumns];

      for (const attr of attrs) {        
        const value = row[attr.name];
        if (attr.type?.toUpperCase() === "BOOLEAN") {
          result[attr.name] = value === true || value === "true";
        } else {
          result[attr.name] = value ?? "";
        }
      }
      result.ruleNumber = row.ruleNumber;
      return result;
    });    

    // Update local state
    setRows(updatedRowsState);

    // Build payload
    const payload = buildDMNPayload({
      ruleName,
      ruleDesc: ruledesc,
      moduleName,
      dmnType: dmntype,
      entityName: entity,
      hitPolicy,
      activeInputColumns,
      activeOutputColumns: isExistingRule ? activeOutputColumns : outputAttributes,
      rows: dmnRows,
    });
    console.log("Payload:", payload);

    try {
      await onSubmit(handleTransformPayload(payload));
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "dmn.error.saveFailed", defaultMessage: "Error while saving data." }));
    }
  };

  // handle transform payload on save
  const handleTransformPayload = (payload) => {

    // Create mapping from description to attributeCode
    const descToCodeMap = {};
    for (const input of payload.ruleInfo.inputs) {
      descToCodeMap[input.name] = input.attributeCode; //|| input.code || input.name 
    }

    // Create mapping from output description to attributeCode
    const outputDescToCodeMap = {};
    for (const output of payload.ruleInfo.outputs) {
      outputDescToCodeMap[output.name] = output.code; // output.attributeCode ||   || output.name
    }

    // Ensure each input carries both display name and attribute code
    const updatedInputs = payload.ruleInfo.inputs.map(input => {
  
      return {
        name: input.name,
        code: input.attributeCode,
        type: input.type
      };
    });

    // Ensure each output carries both display name and attribute code
    const updatedOutputs = payload.ruleInfo.outputs.map(output => {
      return {
        ...output,
        name: output.name,
        code: output.code,
        type: output.type,
        options: output.options?.map(({ label, value }) => ({ label, value })) || []
      };
    });

    // Transform rules back to codes
    const updatedRules = payload.dmnInfo.rules.map(rule => {
      const updatedRuleInputs = {};
      for (const [key, value] of Object.entries(rule.inputs || {})) {
        const attributeCode = descToCodeMap[key] || key;
        updatedRuleInputs[attributeCode] = value;
      }

      const updatedRuleOutputs = {};
      for (const [key, value] of Object.entries(rule.outputs || {})) {
        const attributeCode = outputDescToCodeMap[key] || key;
        updatedRuleOutputs[attributeCode] = value;
      }

      return {
        ...rule,
        inputs: updatedRuleInputs,
        outputs: updatedRuleOutputs,
      };
    });

    // Replace the payload (final transformed payload)
    const updatedPayload = {
      ...payload,
      ruleInfo: {
          ...payload.ruleInfo,
          inputs: updatedInputs,
          outputs: updatedOutputs

      },
      dmnInfo: {
        rules: updatedRules
      },
    };
    console.log("Updated payload for save:", updatedPayload);
    return updatedPayload;
  };

  
   const objDefaultColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    cellStyle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: isMobile ? "13px" : "14px",
      padding: isMobile ? "4px 8px" : "8px 12px",
    },
    headerClass: 'custom-header',
  };
  // grid style data
  const objCustomGridStyle = {
    width: "100%",
    height: isMobile ? "50vh" : "100%",
    minWidth: isMobile ? "100%" : "600px",
    overflowX: "auto",
  };

  const gridRef = useRef(); 

  // Render loading state
  if (isLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <HPaper sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          borderRadius: '16px',
        }}>
          <CircularProgress sx={{ color: colors.primary }} />
          <HLabel
            value={intl.formatMessage({ id: "dmn.loading.ruleData", defaultMessage: "Loading rule data..." })}
            colon={false}
            align="center"
            sx={{
              color: colors.text.secondary,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </HPaper>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          sx={{
            borderRadius: '12px',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Render
  return (
      <HBox sx={{ 
        minHeight: "100vh",
        py: 3,
        background: "transparent",
      }}>
            <HPaper
              elevation={2}
              sx={{
                borderRadius: '16px',
                boxShadow: `0 4px 20px ${colors.primary}15`,
                overflow: 'hidden',
              }}
            >
              {showDecisionTable && (
                <HBox sx={{ background: "transparent" }}>
                  {/* Header with Gradient */}
                  {showRuleMetaInfo && (
                    <HBox
                      sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: isMobile ? "wrap" : "nowrap",
                        background: colors.appBarGradient,
                      }}
                    >
                      <HBox sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', background: "transparent" }}>
                        <Chip
                          icon={<RuleIcon />}
                          label={intl.formatMessage({ id: "dmn.chip.rule", defaultMessage: "Rule: {ruleName}" }, { ruleName })}
                          sx={{
                            fontWeight: 500,
                            '& .MuiChip-icon': { color: '#fff' }
                          }}
                        />
                        <Chip
                          icon={<ModuleIcon />}
                          label={intl.formatMessage({ id: "dmn.chip.module", defaultMessage: "Module: {moduleName}" }, { moduleName })}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            '& .MuiChip-icon': { color: '#fff' }
                          }}
                        />
                        <Chip
                          icon={<BusinessIcon />}
                          label={intl.formatMessage({ id: "dmn.chip.entity", defaultMessage: "Entity: {entity}" }, { entity })}
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            '& .MuiChip-icon': { color: '#fff' }
                          }}
                        />
                      </HBox>
                      <IconButton
                        onClick={(e) => {
                          setDmnInsertHelpOpen(false);
                          openGrid(e);
                        }}
                        sx={{ color: '#fff' }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </HBox>
                  )}

                  {/* Toolbar */}
                  <HBox sx={{ 
                    display: "flex", 
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    borderBottom: `1px solid ${colors.border}`,
                    flexWrap: isMobile ? "wrap" : "nowrap",
                    background: "transparent",
                  }}>
                    <HDropdown
                      name="hitPolicy"
                      value={hitPolicy}
                      onChange={(e) => setHitPolicy(e.target.value)}
                      options={hitPolicyOptions}
                      placeholder={intl.formatMessage({ id: "dmn.dropdown.selectHitPolicy", defaultMessage: "Select Hit Policy..." })}
                      width={isMobile ? "100%" : "200px"}
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />

                    <HButton
                      variant="outlined"
                      size="small"
                      startIcon={<CategoryIcon />}
                      onClick={handleOpenConditionMenu}
                      disabled={!editMode}
                      inline={true}
                      label={inputbtnName || intl.formatMessage({ id: "dmn.conditions", defaultMessage: "Conditions" })}
                      sx={{
                        borderColor: colors.border,
                        color: theme.palette.text.secondary,
                        textTransform: 'none',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    
                    <Menu anchorEl={anchorCondition} open={Boolean(anchorCondition)} onClose={handleCloseConditionMenu} slotProps={{ paper: {
                        sx: {
                          borderRadius: '12px',
                          mt: 1,
                          boxShadow: `0 4px 20px ${colors.primary}20`,
                        }
                      } }}>
                      <HBox sx={{ px: 2, py: 1, borderBottom: `1px solid ${colors.border}`, background: "transparent" }}>
                        <HLabel
                          value={intl.formatMessage({ id: "dmn.menu.selectConditions", defaultMessage: "Select Conditions" })}
                          colon={false}
                          align="left"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        />
                      </HBox>
                      {inputAttributes.map((attr) => (
                        <MenuItem 
                          key={attr.name} 
                          onClick={() => handleToggleColumn("input", attr.name)} 
                          disabled={!editMode}
                          sx={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <ListItemIcon>
                            <HCheckBox 
                              checked={activeInputColumns.some((a) => a.name === attr.name)} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={attr.name} 
                            secondary={attr.type}
                            primaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <MenuItem 
                        onClick={() => handleClearSelection("input")} 
                        disabled={!editMode}
                        sx={{ color: colors.error }}
                      >
                        {intl.formatMessage({ id: "dmn.menu.clearSelection", defaultMessage: "Clear selection" })}
                      </MenuItem>
                    </Menu>

                    <HButton
                      variant="outlined"
                      size="small"
                      startIcon={<TableRowsIcon />}
                      onClick={handleOpenResultMenu}
                      disabled={!editMode}
                      inline={true}
                      label={outputbtnName || intl.formatMessage({ id: "dmn.results", defaultMessage: "Results" })}
                      sx={{
                        borderColor: colors.border,
                        color: theme.palette.text.secondary,
                        textTransform: 'none',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />

                    <Menu anchorEl={anchorResult} open={Boolean(anchorResult)} onClose={handleCloseResultMenu} slotProps={{ paper: {
                        sx: {
                          borderRadius: '12px',
                          mt: 1,
                          boxShadow: `0 4px 20px ${colors.primary}20`,
                        }
                      } }}>
                      <HBox sx={{ px: 2, py: 1, borderBottom: `1px solid ${colors.border}`, background: "transparent" }}>
                        <HLabel
                          value={intl.formatMessage({ id: "dmn.menu.selectResults", defaultMessage: "Select Results" })}
                          colon={false}
                          align="left"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        />
                      </HBox>
                      {availableOutputAttributes.filter(Boolean).map((attr) => (
                        <MenuItem 
                          key={attr.name} 
                          onClick={() => handleToggleColumn("output", attr.name)} 
                          disabled={!editMode}
                          sx={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <ListItemIcon>
                            <Checkbox 
                              checked={!!activeOutputColumns.filter(Boolean).some((a) => a.name === attr.name)} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={attr.name} 
                            secondary={attr.type}
                            primaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </MenuItem>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <MenuItem 
                        onClick={() => handleClearSelection("output")} 
                        disabled={!editMode}
                        sx={{ color: colors.error }}
                      >
                        {intl.formatMessage({ id: "dmn.menu.clearSelection", defaultMessage: "Clear selection" })}
                      </MenuItem>
                    </Menu>

                    <HBox flexGrow={1} sx={{ background: "transparent" }} />                    

                    <Tooltip title={intl.formatMessage({ id: "dmn.tooltip.insertHelp", defaultMessage: "DMN Insert Help" })}>
                      <IconButton 
                        onClick={() => setDmnInsertHelpOpen(true)}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={intl.formatMessage({ id: "dmn.tooltip.shortcuts", defaultMessage: "Keyboard Shortcuts (?)" })}>
                      <IconButton 
                        onClick={() => setShortcutsOpen(true)}
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <KeyboardIcon />
                      </IconButton>
                    </Tooltip>
                  </HBox>                 

                  {/* Decision Table */}
                  <HBox sx={{ 
                    p: 2,
                    background: "transparent",
                  }}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, background: "transparent", width: "100%" }}>
                    {columns.length > 0 ? (
                      <HAgGrid
                        ref={gridRef}
                        rowData={rows}
                        columnDefs={columns}
                        gridStyle={objCustomGridStyle}
                        defaultColDef={objDefaultColDef}
                        pagination={true}
                        paginationPageSize={isMobile ? 5 : 10}
                        gridClassName="drs-list-grid"
                        sort={true}
                        allowAdd={!!editMode}
                        allowDelete={!!editMode}
                        onSave={editMode ? handleSubmit : undefined}
                        addCheckBoxes={true}
                        allowUpdate={!!editMode}
                        hideInternalSaveButton={!editMode}
                        SearchCommonBoxRenderer={SearchCommonBoxRenderer}
                      />
                    ) : (
                      <HBox sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '200px',
                        borderRadius: '12px',
                        border: `1px dashed ${colors.border}`,
                        background: "transparent",
                      }}>
                        <HLabel
                          value={intl.formatMessage({ id: "dmn.emptyTableMsg", defaultMessage: "Select conditions and results to build your decision table" })}
                          colon={false}
                          align="center"
                          sx={{
                            color: theme.palette.text.secondary,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        />
                      </HBox>
                    )}
                      <HButtonBar
                        onSave={editMode ? () => gridRef.current?.submitChanges?.() : undefined}
                        onClose={() => navigate("/homelayout/welcomepage")}
                        disableToast={{ save: true, close: true }}
                      />
                    </HBox>
                  </HBox>                 

                  {/* Shortcuts Dialog */}
                  <HDialog disableContentWrapper open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} slotProps={{ paper: {
                      sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                      }
                    } }}>
                    <DialogTitle sx={{                       
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: "'Inter', sans-serif",
                      width: "350px",
                      background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
                      color: theme.palette.text.primary,
                    }}>
                      <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, background: "transparent" }}>
                        <KeyboardIcon />
                        {intl.formatMessage({ id: "dmn.dialog.shortcutsTitle", defaultMessage: "Keyboard Shortcuts" })}
                      </HBox>
                      <IconButton onClick={() => setShortcutsOpen(false)} sx={{ color: theme.palette.text.primary }}>
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 2 }}>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Ctrl + Enter" 
                            secondary={intl.formatMessage({ id: "dmn.shortcut.createRule", defaultMessage: "Create a new rule" })}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Shift + Delete" 
                            secondary={intl.formatMessage({ id: "dmn.shortcut.deleteRow", defaultMessage: "Delete focused row" })}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="?" 
                            secondary={intl.formatMessage({ id: "dmn.shortcut.openHelp", defaultMessage: "Open help dialog" })}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                      </List>
                    </DialogContent>
                  </HDialog>

                  {/* DMN Insert Help Dialog */}
                  <HDialog disableContentWrapper open={DmnInsertHelpOpen} onClose={() => setDmnInsertHelpOpen(false)} slotProps={{ paper: {
                      sx: {
                        borderRadius: '16px',
                        overflow: 'hidden',
                      }
                    } }}>
                    <DialogTitle sx={{                       
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: "'Inter', sans-serif",
                      width: "350px",
                      background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
                      color: theme.palette.text.primary,
                    }}>
                      <HBox  sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,                        
                          background: "transparent",
                        }}>
                        <InfoIcon />
                        {intl.formatMessage({ id: "dmn.dialog.insertHelpTitle", defaultMessage: "DMN Insert Help" })}
                      </HBox>
                      <IconButton onClick={() => setDmnInsertHelpOpen(false)} sx={{ color: theme.palette.text.primary }}>
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 2 }}>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.number", defaultMessage: "Number" })} 
                            secondary="10, !=10, >10, >=10, <10, <=10,not(100,200)"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.multiNumber", defaultMessage: "multi Number" })} 
                            secondary="10,20,30"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.rangeNumber", defaultMessage: "Range (Number)" })} 
                            secondary="[1..30]"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.string", defaultMessage: "String" })} 
                            secondary="AL, !=AL, not(AL,HL)"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                         <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.multiString", defaultMessage: "Multi String" })} 
                            secondary={'"AL", "HL", "CL"'}
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.date", defaultMessage: "Date" })} 
                            secondary="YYYY-MM-DD, e.g., 2025-01-15"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary={intl.formatMessage({ id: "dmn.type.boolean", defaultMessage: "Boolean" })} 
                            secondary="true, false"
                            primaryTypographyProps={{ fontWeight: 600 }}
                            secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </ListItem>
                      </List>
                    </DialogContent>
                  </HDialog>
                </HBox>
              )}
            </HPaper>
      </HBox>
  );
};

export default DMNDecisionTableBuilder;
