import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Storage as DatabaseIcon,
  Label as TypeIcon,
  Category as BoxIcon,
  GridView as GridIcon,
  ListAlt as ListIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  ToggleOn as ToggleIcon,
  CalendarToday as CalendarIcon,
  Input as InputIcon,
  MenuBook as ContextIcon,
} from '@mui/icons-material';
import { DMN_API_ENDPOINTS } from "./apiEndpoints";
import { HAxiosService, HButton, HDropdown, HTextField, useToast, HDialog } from "@helix/component-library";


import './styles/RuleMetaInfo.css';

const INITIAL_META_INFO = {
  ruleName: '',
  ruleDesc: '',
  moduleName: 'COL',
  type: '',
  entityName: '',
  outputAttributes: []
};

const INITIAL_OUTPUT_ATTRIBUTE = {
  name: '',
  code: '',
  type: '',
  controlType: '',
  searchcode: '',
  options: []
};

// Reusable form field components
const FormField = ({ label, name, value, onChange, required = true, icon: Icon }) => (
  <Box className="form-row">
    <Box className="form-label">
      {Icon && <Icon sx={{ fontSize: 18, color: 'var(--primary)' }} />}
      <Typography className="form-label-text">{label}</Typography>
    </Box>
    <Box className="form-field">
      <HTextField
        name={name}
        value={value}
        editable
        required={required}
        onChange={onChange}
        width={200}
        className="h-text-field-root"
      />
    </Box>
  </Box>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  icon: PropTypes.elementType
};

const DropdownField = ({ label, name, value, options, onChange, required = true, icon: Icon }) => (
  <Box className="form-row">
    <Box className="form-label">
      {Icon && <Icon sx={{ fontSize: 18, color: 'var(--primary)' }} />}
      <Typography className="form-label-text">{label}</Typography>
    </Box>
    <Box className="form-field">
      <HDropdown
        name={name}
        value={value}
        options={options}
        onChange={onChange}
        required={required}
        width={200}
        className="h-dropdown-root"
      />
    </Box>
  </Box>
);

DropdownField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  icon: PropTypes.elementType
};

const RuleMetaInfo = ({ onSubmitMetaInfo, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const toast = useToast();  
  const [metaInfo, setMetaInfo] = useState(INITIAL_META_INFO);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [attributeType, setAttributeType] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentOutputAttribute, setCurrentOutputAttribute] = useState(INITIAL_OUTPUT_ATTRIBUTE);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [ruleTypeOptions, setRuleTypeOptions] = useState([]);
  const [dataTypeOptions, setDataTypeOptions] = useState([]);
  const [entityOptions, setEntityOptions] = useState([]);

  // Fetch entity options on mount
  useEffect(() => {
    if (!metaInfo.moduleName) return;
    let cancelled = false;
    const fetchEntities = async () => {
      try {
        const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getEntityNames(), {
          params: { moduleName: metaInfo.moduleName }
        });

        if (cancelled) return;

        const entities = response.data?.data?.map(entity => ({
          label: entity.entityName,
          value: entity.entityCode
        })) || [];

        setEntityOptions(entities);

        // Clear only if current selection is no longer valid
        setMetaInfo((prev) => {
          if (cancelled) return prev;
          const isStillValid = entities.some((e) => e.value === prev.entityName);
          return isStillValid ? prev : { ...prev, entityName: '' };
        });

      } catch (error) {
        console.error("Error fetching entities:", error);
        toast.error("Failed to load entities");
      }
    };
    fetchEntities();
    return () => {
      cancelled = true;
    };
  }, [metaInfo.moduleName, toast]);

  
  // Fetch modules on mount
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getModuleNames);
        const modules = response.data.map(module => ({
          label: module,
          value: module
        }));
        setModuleOptions(modules);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules");
      }
    };
    fetchModules();
  }, [toast]);

  // Fetch rule types on mount
  useEffect(() => {
    const fetchRuleTypes = async () => {
      try {
        const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDmnTypes);
         if (response.data?.success) {
          const types = response.data.data || [];
          const ruleTypes = types.map(type => ({
            label: type.displayName,
            value: type.code
          }));
          setRuleTypeOptions(ruleTypes);
          return;
        }
        else {
          throw new Error(response.data?.message || 'Failed to load rule types');
        }              

      } catch (error) {
        console.error("Error fetching rule types:", error);
        toast.error("Failed to load rule types");
      }
    };
    fetchRuleTypes();
  }, [toast]);

  // Fetch data types on mount
  useEffect(() => {
    const fetchDataTypes = async () => {
      try {
        const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDmnDataTypes);
         if (response.data?.success) {
          const types = response.data.data || [];
          const dataTypes = types.map(type => ({
            label: type.displayName,
            value: type.displayName
          }));
          setDataTypeOptions(dataTypes);
          return;
        }
        else {
          throw new Error(response.data?.message || 'Failed to load data types');
        }

      } catch (error) {
        console.error("Error fetching data types:", error);
        toast.error("Failed to load data types");
      }
    };
    fetchDataTypes();
  }, [toast]);

  const isDecisionTable = useMemo(() => metaInfo.type === ruleTypeOptions.find(t => t.label === "Decision Table")?.value, [metaInfo.type, ruleTypeOptions]);
  console.log("isDecisionTable:", isDecisionTable);
  const handleMetaInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setMetaInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const { ruleName, moduleName, type, entityName, outputAttributes } = metaInfo;
    if (!ruleName || !moduleName || !type || !entityName) {
      toast.warn('Please fill all required fields.');
      return;
    }
    
    if(isDecisionTable){
      if (outputAttributes.length > 0) {
        onSubmitMetaInfo(metaInfo);
      } else {
        toast.warn('Please fill all required fields and add at least one output attribute.');
      }
    } else {
      onSubmitMetaInfo(metaInfo);
    }
  }, [metaInfo, onSubmitMetaInfo, toast]);

  // Output attribute handlers
  const resetAttributeForm = useCallback(() => {
    setCurrentOutputAttribute(INITIAL_OUTPUT_ATTRIBUTE);
    setAttributeType(null);
    setEditingIndex(null);
  }, []);

  const handleOpenDialog = useCallback(() => {
    resetAttributeForm();
    setIsDialogOpen(true);
  }, [resetAttributeForm]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    resetAttributeForm();
  }, [resetAttributeForm]);

  const handleAttributeChange = useCallback((e) => {
    const { name, value } = e.target;
    setCurrentOutputAttribute(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAttributeTypeChange = useCallback((type) => {
    setAttributeType(type);
    setCurrentOutputAttribute(prev => ({
      ...prev,
      controlType: type === 'webCombo' ? 'SEARCH' : '',
      searchcode: type === 'webCombo' ? prev.searchcode : '',
      options: type === 'options' ? prev.options : []
    }));
  }, []);

  const handleSaveAttribute = useCallback(() => {
    const { name, code, type, searchcode, options } = currentOutputAttribute;

    if (!name || !code || !type) {
      toast.warn('Please fill all required fields (Name, Code, Type)');
      return;
    }

    if (attributeType === 'webCombo' && !searchcode) {
      toast.warn('Please enter searchcode for Web Combo');
      return;
    }

    if (attributeType === 'options') {
      if (options.length === 0) {
        toast.warn('Please add at least one option');
        return;
      }
      if (options.some(option => !option.label || !option.value)) {
        toast.warn('Please fill all option fields (Label, Value)');
        return;
      }
    }

    setMetaInfo(prev => ({
      ...prev,
      outputAttributes: editingIndex !== null
        ? prev.outputAttributes.map((attr, idx) => idx === editingIndex ? currentOutputAttribute : attr)
        : [...prev.outputAttributes, currentOutputAttribute]
    }));

    handleCloseDialog();
  }, [currentOutputAttribute, attributeType, editingIndex, handleCloseDialog, toast]);

  const handleEditAttribute = useCallback((index) => {
    const attribute = metaInfo.outputAttributes[index];
    setCurrentOutputAttribute(attribute);
    
    if (attribute.controlType === 'SEARCH') {
      setAttributeType('webCombo');
    } else if (attribute.options?.length > 0) {
      setAttributeType('options');
    }
    
    setEditingIndex(index);
    setIsDialogOpen(true);
  }, [metaInfo.outputAttributes]);

  const handleDeleteAttribute = useCallback((index) => {
    setMetaInfo(prev => ({
      ...prev,
      outputAttributes: prev.outputAttributes.filter((_, i) => i !== index)
    }));
  }, []);

  const handleAddOption = useCallback(() => {
    setCurrentOutputAttribute(prev => ({
      ...prev,
      options: [...prev.options, { id: Date.now(), label: '', value: '' }]
    }));
  }, []);

  const handleOptionChange = useCallback((index, field, value) => {
    setCurrentOutputAttribute(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => 
        idx === index ? { ...opt, [field]: value } : opt
      )
    }));
  }, []);

  const handleRemoveOption = useCallback((index) => {
    setCurrentOutputAttribute(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index)
    }));
  }, []);

  const renderOutputAttributesList = () => (
    <Fade in={true} timeout={500}>
      <Box className="output-attributes-container">
        <Typography className="output-attributes-title">
          <SettingsIcon sx={{ fontSize: 16, color: 'var(--primary)' }} />
          Output Attributes:
        </Typography>
        <List dense>
          {metaInfo.outputAttributes.map((attr, index) => {
            let optionLabel = '';
            if (attr.controlType === 'SEARCH') {
              optionLabel = ' - Web Combo';
            } else if (attr.options?.length > 0) {
              optionLabel = ' - Options';
            }
            return (
              <ListItem
                key={attr.code || index}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleEditAttribute(index)}
                      size="small"
                      className="edit-button"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteAttribute(index)}
                      size="small"
                      className="delete-button"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
                className="output-attribute-item"
              >
                <ListItemText
                  primary={
                    <Typography className="output-attribute-primary">
                      {attr.name} ({attr.code})
                    </Typography>
                  }
                  secondary={
                    <Typography className="output-attribute-secondary">
                      Type: {attr.type}{optionLabel}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Fade>
  );

  const renderWebComboFields = () => (
    <Fade in={true} timeout={300}>
      <Box>
        <Box className="form-row">
          <Box className="form-label">
            <InputIcon sx={{ fontSize: 18, color: 'var(--primary)' }} />
            <Typography className="form-label-text">ControlType</Typography>
          </Box>
          <Box className="form-field">
            <HTextField
              value="SEARCH"
              editable={false}
              required
              width={200}
              className="h-text-field-root"
            />
          </Box>
        </Box>
        <Box className="form-row">
          <Box className="form-label">
            <CodeIcon sx={{ fontSize: 18, color: 'var(--primary)' }} />
            <Typography className="form-label-text">Searchcode</Typography>
          </Box>
          <Box className="form-field">
            <HTextField
              name="searchcode"
              value={currentOutputAttribute.searchcode}
              editable
              required
              onChange={handleAttributeChange}
              width={200}
              className="h-text-field-root"
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );

  const renderOptionsFields = () => (
    <Box>
      {currentOutputAttribute.options.map((option, index) => (
        <Fade in={true} timeout={300} key={option.id}>
          <Box className="option-item">
            <Box className="option-item-header">
              <IconButton
                size="small"
                onClick={() => handleRemoveOption(index)}
                className="option-remove-button"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box className="option-row">
              <Typography className="option-label">Label</Typography>
              <Box className="option-field">
                <HTextField
                  value={option.label}
                  editable
                  required
                  onChange={(e) => handleOptionChange(index, 'label', e.target.value)}
                  width={200}
                  className="h-text-field-root"
                />
              </Box>
            </Box>
            <Box className="option-row">
              <Typography className="option-label">Value</Typography>
              <Box className="option-field">
                <HTextField
                  value={option.value}
                  editable
                  required
                  onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
                  width={200}
                  className="h-text-field-root"
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      ))}

      <Box className="add-option-button-container">
        <HButton
          label="Add Option"
          type="button"
          onClick={handleAddOption}
          size="small"
          startIcon={<AddIcon />}
          sx={{
            background: 'var(--secondary)',
            color: '#fff',
            height: '36px',
            '&:hover': { background: 'var(--secondary-dark)' }
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box className="rule-meta-container">
        <Zoom in={true} style={{ transitionDelay: '150ms' }}>
          <Paper
            elevation={0}
            className="rule-meta-paper"
            sx={isMobile ? { width: '95%' } : {}}
          >
            <Box className="rule-meta-header">
              <Typography className="rule-meta-header-title">
                <SettingsIcon sx={{ fontSize: 20 }} />
                Rule Meta
              </Typography>
            </Box>

            <Box className="rule-meta-content">
              <form onSubmit={handleSubmit}>
                <FormField
                  label="Rule Name"
                  name="ruleName"
                  value={metaInfo.ruleName}
                  onChange={handleMetaInfoChange}
                  icon={DescriptionIcon}
                />
                <FormField
                  label="Rule Desc"
                  name="ruleDesc"
                  value={metaInfo.ruleDesc}
                  onChange={handleMetaInfoChange}
                  icon={DescriptionIcon}
                />

                {/* Rule Type dropdown – NO icon, uses imported enum options */}
                <DropdownField
                  label="Rule Type"
                  name="type"
                  value={metaInfo.type}
                  options={ruleTypeOptions}
                  onChange={handleMetaInfoChange}
                  icon={GridIcon}
                  required
                />

                <DropdownField
                  label="Module Name"
                  name="moduleName"
                  value={metaInfo.moduleName}
                  options={moduleOptions}
                  onChange={handleMetaInfoChange}
                  icon={DatabaseIcon}
                />

                <DropdownField
                  label="Entity Name"
                  name="entityName"
                  value={metaInfo.entityName}
                  options={entityOptions}
                  onChange={handleMetaInfoChange}
                  icon={BoxIcon}
                  required
                />

                {metaInfo.outputAttributes.length > 0 && renderOutputAttributesList()}

                <Divider className="custom-divider" />

                <Box className="action-buttons">
                  {isDecisionTable && (
                    <HButton
                      label="Output"
                      type="button"
                      onClick={handleOpenDialog}
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{
                        background: 'var(--secondary)',
                        color: '#fff',
                        height: '36px',
                        '&:hover': { background: 'var(--secondary-dark)' }
                      }}
                    />
                  )}
                  <HButton
                    label="Continue"
                    type="submit"
                    size="small"
                    sx={{
                      background: 'var(--primary)',
                      color: '#fff',
                      height: '36px',
                      '&:hover': { background: 'var(--primary-dark)' }
                    }}
                  />
                  <HButton
                    label="Cancel"
                    type="button"
                    size="small"
                    onClick={onCancel}
                    sx={{
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                      height: '36px',
                      textTransform: 'none',
                      fontFamily: "'Inter', sans-serif",
                      '&:hover': { background: 'rgba(148, 163, 184, 0.1)' }
                    }}
                  />
                </Box>
              </form>
            </Box>
          </Paper>
        </Zoom>

        <HDialog disableContentWrapper open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" slotProps={{ paper: { className: 'rule-meta-dialog-paper' } }}>
          <DialogTitle className="dialog-header">
            <Box className="dialog-header-content">
              <Typography className="dialog-title">
                <SettingsIcon sx={{ fontSize: 18 }} />
                {editingIndex !== null ? 'Edit Output Attribute' : 'Add Output Attribute'}
              </Typography>
              <IconButton onClick={handleCloseDialog} className="dialog-close-button">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <Box className="dialog-content">
            <FormField
              label="Name"
              name="name"
              value={currentOutputAttribute.name}
              onChange={handleAttributeChange}
              icon={DescriptionIcon}
            />
            <FormField
              label="Code"
              name="code"
              value={currentOutputAttribute.code}
              onChange={handleAttributeChange}
              icon={CodeIcon}
            />

            {/* Data Type dropdown – NO icon, uses imported enum options */}
            <DropdownField
              label="Type"
              name="type"
              value={currentOutputAttribute.type}
              options={dataTypeOptions}
              onChange={handleAttributeChange}
              icon={TypeIcon}
              required
            />

            <Box className="attribute-type-radio-group">
              <Box className="radio-option">
                <input
                  type="radio"
                  checked={attributeType === 'webCombo'}
                  onChange={() => handleAttributeTypeChange('webCombo')}
                  id="webCombo"
                  name="attributeType"
                />
                <label htmlFor="webCombo">Web Combo</label>
              </Box>
              <Box className="radio-option">
                <input
                  type="radio"
                  checked={attributeType === 'options'}
                  onChange={() => handleAttributeTypeChange('options')}
                  id="options"
                  name="attributeType"
                />
                <label htmlFor="options">Options</label>
              </Box>
            </Box>

            {attributeType === 'webCombo' && renderWebComboFields()}
            {attributeType === 'options' && renderOptionsFields()}
          </Box>

          <Box className="dialog-actions">
            <HButton
              label="Save"
              type="button"
              onClick={handleSaveAttribute}
              size="small"
              sx={{
                background: 'var(--primary)',
                color: '#fff',
                height: '36px',
                '&:hover': { background: 'var(--primary-dark)' }
              }}
            />
            <HButton
              label="Cancel"
              type="button"
              onClick={handleCloseDialog}
              size="small"
              sx={{
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                height: '36px',
                '&:hover': { background: 'var(--hover)' }
              }}
            />
          </Box>
        </HDialog>
      </Box>
    </Fade>
  );
};

RuleMetaInfo.propTypes = {
  onSubmitMetaInfo: PropTypes.func,
  onCancel: PropTypes.func,
};

export default RuleMetaInfo;
