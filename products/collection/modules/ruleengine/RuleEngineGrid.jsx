import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useToast, HAxiosService, ALIGNMENT, HCheckBox, HAgGrid, HDialog } from "@helix/component-library";
import { DMN_API_ENDPOINTS } from "./apiEndpoints";

import { 
  Container, 
  Card, 
  Button, 
  DialogTitle, 
  DialogActions, 
  DialogContent,
  Box, 
  Typography,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import RuleIcon from '@mui/icons-material/Rule';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import ModuleIcon from '@mui/icons-material/ViewModule';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

// Import the RuleMetaInfo component (adjust path as needed)
import RuleMetaInfo from './RuleMetaInfo';

import './styles/RuleEngineGrid.css'; // External CSS



// Status badge component (unchanged)
const StatusBadge = ({ isPublished }) => {
  const status = isPublished ? 'published' : 'draft';
  const Icon = isPublished ? CheckCircleIcon : WarningIcon;

  return (
    <Box className={`status-badge ${status}`}>
      <Icon sx={{ fontSize: 14 }} />
      <span>{isPublished ? 'Published' : 'Draft'}</span>
    </Box>
  );
};

StatusBadge.propTypes = {
  isPublished: PropTypes.bool.isRequired,
};

// Modern icon mapping for rule types
const RULE_TYPE_ICONS = {
  'DECISION': { icon: MergeTypeIcon, color: 'var(--primary)' },
  'DRD': { icon: FilePresentIcon, color: 'var(--secondary)' },
  'BKM': { icon: CheckCircleIcon, color: 'var(--success)' },
  'default': { icon: FilePresentIcon, color: 'var(--text-light)' }
};

const RuleEngineGrid = ({ openDMN }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const toast = useToast();
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [open, setOpen] = useState(false);
  const [entity, setEntity] = useState(null);
  const [dmnType, setDmnType] = useState(null);
  const [versionRows, setVersionRows] = useState([]);
  
  // State for RuleMetaInfo dialog
  const [metaInfoOpen, setMetaInfoOpen] = useState(false);

  // Enhanced columns with modern styling (unchanged)
  const columns = useMemo(() => [
    { 
      field: "ruleName", 
      headerName: "Rule Name", 
      width: 200,
      cellClass: 'rule-engine-cell-name',
      headerComponentParams: {
        icon: RuleIcon,
        color: 'var(--primary)',
        tooltip: "Rule Name"
      }
    },
    { 
      field: "dmnType", 
      headerName: "Type", 
      width: 150,
      cellRenderer: (params) => {
        const iconConfig = RULE_TYPE_ICONS[params.value] || RULE_TYPE_ICONS.default;
        const Icon = iconConfig.icon;
        return (
          <Box className="rule-engine-cell-type">
            <Icon sx={{ fontSize: 16, color: iconConfig.color }} />
            <span>{params.value}</span>
          </Box>
        );
      },
      headerComponentParams: {
        icon: CategoryIcon,
        color: 'var(--secondary)',
        tooltip: "Rule Type"
      }
    },
    { 
      field: "entity", 
      headerName: "Entity", 
      width: 200,
      cellClass: 'rule-engine-cell-entity',
      headerComponentParams: {
        icon: BusinessIcon,
        color: 'var(--accent)',
        tooltip: "Entity"
      }
    },
    { 
      field: "module", 
      headerName: "Module", 
      width: 150,
      cellClass: 'rule-engine-cell-module',
      headerComponentParams: {
        icon: ModuleIcon,
        color: 'var(--primary-light)',
        tooltip: "Module"
      }
    },
    {
      field: "edit",
      headerName: "Actions",
      width: 100,
      cellRenderer: (params) => (
        <Box className="rule-engine-action-buttons">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRuleVersion(
                params.data.ruleName, 
                params.data.module, 
                params.data.entity, 
                params.data.dmnTypeCode, 
                params.data.currentVersion, 
                params.data.publishedVersion
              );
            }}
            className="rule-engine-edit-button"
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      ),
      headerComponentParams: {
        icon: EditIcon,
        color: 'var(--text-secondary)',
        tooltip: "Actions"
      }
    },
    { 
      field: "currentVersion", 
      headerName: "Current Version", 
      width: 120,
      cellClass: 'rule-engine-cell-version',
    },
    { 
      field: "publishedVersion", 
      headerName: "Published Version", 
      width: 130,
      cellClass: 'rule-engine-cell-published',
    },
    { 
      field: "publishedBy", 
      headerName: "Published By", 
      width: 120,
      cellClass: 'rule-engine-cell-published-by',
      headerComponentParams: {
        icon: PersonIcon,
        color: 'var(--text-secondary)',
        tooltip: "Published By"
      }
    },
    { 
      field: "createdBy", 
      headerName: "Created By", 
      width: 120,
      cellClass: 'rule-engine-cell-created-by',
      headerComponentParams: {
        icon: PersonIcon,
        color: 'var(--text-secondary)',
        tooltip: "Created By"
      }
    },
    { 
      field: "createdDate", 
      headerName: "Created Date", 
      width: 120,
      cellRenderer: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      },
      cellClass: 'rule-engine-cell-created-date',
      headerComponentParams: {
        icon: EventIcon,
        color: 'var(--text-secondary)',
        tooltip: "Created Date"
      }
    },
    {
      field: "isPublish",
      headerName: "Status",
      editable: false,
      width: 120,
      cellRenderer: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%'
        }}>
          <StatusBadge isPublished={params.value} />
        </Box>
      ),
      headerComponentParams: {
        icon: PublishIcon,
        color: 'var(--success)',
        tooltip: "Publication Status"
      }
    },
  ], []);

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

  const Versioncolumns = [
    { 
      field: "version", 
      headerName: "Version", 
      width: 124,
      cellClass: 'rule-engine-cell-version',
    },
    { 
      field: "isPublished", 
      headerName: "Status", 
      width: 150,
      cellRenderer: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <StatusBadge isPublished={params.value} />
        </Box>
      )
    },
    { 
      field: "edit", 
      headerName: "Actions", 
      width: 120,
      cellRenderer: (params) => (
        <IconButton
          size="small"
          onClick={() => handleEditRule(
            selectedRule, 
            selectedModule, 
            entity, 
            dmnType,
            params.data.version
          )}
          className="rule-engine-edit-button"
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )
    }
  ];

  const objDefaultVersionColDef = {
    sortable: false,
    filter: false,
    floatingFilter: false,
    resizable: false,
    cellStyle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: "13px",
      padding: "4px 8px",
    }
  };

  useEffect(() => {    
    handleFileData();  
  }, []); 

  // Filter function for search
  const filterData = useCallback((data, searchValue) => {
    if (!searchValue.trim()) return data;
    
    const lowercasedSearch = searchValue.toLowerCase().trim();
    
    return data.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowercasedSearch);
      });
    });
  }, []);

  // Apply filter whenever searchTerm or rows change
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = filterData(rows, searchTerm);
      setFilteredRows(filtered);
    } else {
      setFilteredRows(rows);
    }
  }, [rows, searchTerm, filterData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleFileData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDMNFileNames);
      console.log("response", response);
      
      let fileList = response.data;
      
      fileList = fileList.map((item, idx) => ({
        ...item,
        id: item.id || idx + 1,
        // display value
        dmnType: item.typeDescription, 
        //  enum
        dmnTypeCode: item.type,        
        edit: "Edit",
        isPublish: item.isPublish || false,
        createdDate: item.createdDate || new Date().toISOString(),
      }));
      
      setRows(fileList);
      toast.success("Loaded rule files successfully.");
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to load rule files.");
      toast.error("Failed to load rule files.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRuleClick = (params) => {
    console.log(`Opening rule in read mode — Rule Name: ${params.data.ruleName}, Module: ${params.data.module}, DmnType: ${params.data.dmnTypeCode}, Entity: ${params.data.entity}`);
    openDMN(params.data.ruleName, params.data.module, params.data.dmnTypeCode, params.data.entity, false);
  };

  const handleEditRule = (rulename, module, entity, dmnTypeCode, version) => {
    console.log(`Opening rule in edit mode — Rule Name: ${rulename}, Module: ${module}, Entity: ${entity}, DmnType: ${dmnTypeCode}, Version: ${version}`);
    setOpen(false);
    openDMN(rulename, module, dmnTypeCode, entity, version, true);
  };

  const handleRuleVersion = async (rulename, modulename, entity, dmnTypeCode, currentVersion, publishedVersion) => {
    try {
      const response = await HAxiosService.GET(DMN_API_ENDPOINTS.getDMNRuleVersions,
        {
          params: {
            ruleName: rulename,
            moduleName: modulename
          }
        }
      );

      console.log('Rule version response', response.data.data);
      
      const versionsWithEdit = response.data.data.map((item, index) => ({
        ...item,
        id: index + 1,
        edit: "Edit"
      }));
      
      setVersionRows(versionsWithEdit);
      setSelectedRule(rulename);
      setSelectedModule(modulename);
      setEntity(entity);
      setDmnType(dmnTypeCode);
      
      if (currentVersion !== publishedVersion) {
        handleEditRule(rulename, modulename, entity, dmnTypeCode, currentVersion);
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch rule versions", error);
      toast.error("Failed to load rule versions.");
    }
  };

  const handleRefresh = () => {
    handleFileData();
  };

  // Open the RuleMetaInfo dialog
  const handleNewRule = () => {
    setMetaInfoOpen(true);
  };

  // Handle submission from RuleMetaInfo
  const handleMetaInfoSubmit = (metaInfo) => {
    console.log('Meta info submitted:', metaInfo);
    toast.success('Rule meta information saved!');
    setMetaInfoOpen(false);
    // Optionally, you can now call openDMN with the new rule info
    openDMN(metaInfo.ruleName, metaInfo.moduleName, metaInfo.type, metaInfo.entityName,null, true, metaInfo);
  };

  const handleMetaInfoCancel = () => {
    setMetaInfoOpen(false);
  };

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
          Error loading data: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box className="rule-engine-container">
        <Container maxWidth="xl" sx={{ px: isMobile ? 2 : 3 }}>
          <Zoom in={true} style={{ transitionDelay: '150ms' }}>
            <Paper
              elevation={2}
              className="rule-engine-paper"
            >
              {/* Header Section */}
              <Box className="rule-engine-header">
                {/* Left Title */}
                <Typography className="rule-engine-title">
                  Rule Engine
                </Typography>

                {/* Center Search */}
                <Box className="rule-engine-search">
                  <TextField
                    variant="outlined"
                    placeholder="Search rules..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ fontSize: 18, color: 'var(--text-light)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton onClick={clearSearch} size="small">
                            <ClearIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                {/* Right Action Buttons */}
                <Box className="rule-engine-actions">
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="rule-engine-refresh-btn"
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewRule}
                    className="rule-engine-new-btn"
                  >
                    New Rule
                  </Button>
                </Box>
              </Box>

              {/* Loading Indicator */}
              {isLoading && (
                <Box className="rule-engine-loading">
                  <CircularProgress size={16} sx={{ color: 'var(--primary)' }} />
                  <Typography className="rule-engine-loading-text">
                    Loading rules...
                  </Typography>
                </Box>
              )}
              
              {/* Search Results Count */}
              {searchTerm && !isLoading && (
                <Box className="rule-engine-search-results">
                  <Typography className="rule-engine-search-results-text">
                    Found {filteredRows.length} matching {filteredRows.length === 1 ? 'rule' : 'rules'}
                  </Typography>
                </Box>
              )}

              {/* Grid Section */}
              <Box className="rule-engine-grid-section">
                {isLoading && rows.length === 0 ? (
                  <Box className="rule-engine-empty-state">
                    <CircularProgress sx={{ color: 'var(--primary)' }} />
                    <Typography className="rule-engine-empty-state-text">
                      Loading rules...
                    </Typography>
                  </Box>
                ) : rows.length > 0 ? (
                  <HAgGrid 
                    rowData={searchTerm ? filteredRows : rows}
                    columnDefs={columns} 
                    defaultColDef={objDefaultColDef} 
                    gridStyle={{ width: "100%", height: isMobile ? "65vh" : "70vh", minWidth: isMobile ? "100%" : "900px", overflowX: "auto", borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 12px 30px -10px rgba(3, 120, 166, 0.25)" }} 
                    pagination={true} 
                    paginationPageSize={isMobile ? 10 : 20}
                    sort={true} 
                    addCheckBoxes={true} 
                    allowDelete={true} 
                    rowDragging={false} 
                    hideInternalSaveButton={true}
                    onClickMapping={{ 
                      ruleName: handleRuleClick,
                    }} 
                  />
                ) : (
                  <Box className="rule-engine-empty-state">
                    <Typography className="rule-engine-empty-state-text">
                      No rules available. Click "New Rule" to create one.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Zoom>

          {/* Version Management Dialog (unchanged) */}
          <HDialog disableContentWrapper open={open} onClose={() => setOpen(false)} maxWidth="sm" slotProps={{ paper: {
              className: 'rule-engine-dialog-paper'
            } }}>
            <DialogTitle className="rule-engine-dialog-title">
              <Box className="rule-engine-dialog-title-text">
                <MergeTypeIcon />
                Version Management
              </Box>
              <IconButton onClick={() => setOpen(false)} className="rule-engine-dialog-close">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent className="rule-engine-dialog-content">
              <Box className="rule-engine-dialog-info">
                <Typography className="rule-engine-dialog-details">
                  Rule: <strong>{selectedRule}</strong> | 
                  Module: <strong>{selectedModule}</strong>
                </Typography>
              </Box>

              <HAgGrid 
                rowData={versionRows}
                columnDefs={Versioncolumns} 
                defaultColDef={objDefaultVersionColDef} 
                gridStyle={{ width: isMobile ? "100%" : "400px", height: "250px", minWidth: isMobile ? "100%" : "350px", overflowX: "auto", borderRadius: "12px", border: "1px solid var(--border)" }}
                sort={false}  
                pagination={versionRows.length > 5}
                paginationPageSize={5}
              />
            </DialogContent>

            <Divider className="rule-engine-dialog-divider" />
            
            {/* <DialogActions className="rule-engine-dialog-actions">
              <Button 
                onClick={() => setOpen(false)} 
                className="cancel-button"
              >
                Cancel
              </Button>
            </DialogActions> */}
          </HDialog>

          {/* ===== NEW: RuleMetaInfo Dialog with constrained width ===== */}
          <HDialog disableContentWrapper
            open={metaInfoOpen}
            onClose={handleMetaInfoCancel}
            className="rule-engine-meta-dialog"
          >
            <RuleMetaInfo
              onSubmitMetaInfo={handleMetaInfoSubmit}
              onCancel={handleMetaInfoCancel}
            />
          </HDialog>
        </Container>
      </Box>
    </Fade>
  );
};

export default RuleEngineGrid;
