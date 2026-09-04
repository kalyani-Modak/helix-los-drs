import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Alert, IconButton, Chip, Tooltip, Breadcrumbs, Link, MenuItem, Menu, Dialog, DialogTitle,
    DialogContent, DialogActions} from "@mui/material";
import { HAxiosService, HBox, HLabel, HPaper, HButton, HDropdown, HAgGrid, useToast } from "@helix/component-library";
import { Add, CallSplit, DeleteOutline } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import { useIntl } from "react-intl";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";
import AddStepDialog from './AddStepDialog';
import AddSubFlowDialog from './AddSubFlowDialog';

const requirementColors = {
    REQUIRED: "success",
    ALTERNATIVE: "warning",
    DISABLED: "default",
    CONDITIONAL: "info"
};

function flattenExecutions(executions) {
    // Recursively flatten executions into a list with indentation level
    const result = [];
    function walk(list, level) {
        for (const exec of list) {
            result.push({ ...exec, _level: level });
            if (exec.authenticationFlow && exec.executions?.length > 0) {
                walk(exec.executions, level + 1);
            }
        }
    }
    walk(executions, 0);
    return result;
}

const AuthenticationFlowDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const intl = useIntl();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [flow, setFlow] = useState(null);
    
    const [updatingExecutionId, setUpdatingExecutionId] = useState(null);
    const [addMenuAnchor, setAddMenuAnchor] = useState(null);
    const [addMenuExecution, setAddMenuExecution] = useState(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [availableProviders, setAvailableProviders] = useState(null);
    
    const [addDialogParentExecution, setAddDialogParentExecution] = useState(null);
    const [addSubFlowDialogOpen, setAddSubFlowDialogOpen] = useState(false);
    const [availableFormProviders, setAvailableFormProviders] = useState(null);
    
    const [addSubFlowDialogParentExecution, setAddSubFlowDialogParentExecution] = useState(null);
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
    const [executionToDelete, setExecutionToDelete] = useState(null);

    const loadFlowDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `${UserManagementAPI.fetch_auth_flows()}/${id}`;
            const response = await HAxiosService.GET(url);
            if (response?.data) {
                setFlow(response.data);
            } else {
                setError(intl.formatMessage({ id: "error.authFlowDetails.noData", defaultMessage: "No data returned" }));
            }
        } catch (err) {
            console.error('Error fetching flow details:', err);
            const errMsg = err?.response?.data?.msg || err.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to fetch flow details" });
            setError(errMsg);
            toast.error(errMsg, { position: "top-right", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadFlowDetails();
    }, [id]);

    const handleRequirementChange = async (execution, newRequirement) => {
        if (!execution || !flow) return;
        setUpdatingExecutionId(execution.id);
        const payload = {
            id: execution.id,
            requirement: newRequirement,
            displayName: execution.displayName,
            requirementChoices: execution.requirementChoices || [],
            configurable: execution.configurable || false,
            providerId: execution.providerId,
            parentFlow: execution.parentFlow,
            level: execution.level,
            index: execution.index,
            priority: execution.priority,
            authFlowAlias: flow.alias,
        };

        try {
            const response = await HAxiosService.PUT(UserManagementAPI.update_execution(), payload);

            // Axios interceptor may return null for handled failures
            if (!response) return;

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlowDetails.executionUpdated", defaultMessage: "Execution updated" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            // Refresh details to reflect change
            await loadFlowDetails();
        } catch (err) {
            console.error('Error updating execution requirement:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to update execution" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
        } finally {
            setUpdatingExecutionId(null);
        }
    };

    const handleOpenDeleteConfirm = (execution) => {
        setExecutionToDelete(execution);
        setDeleteConfirmDialogOpen(true);
    };

    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmDialogOpen(false);
        setExecutionToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!executionToDelete?.id) {
            handleCloseDeleteConfirm();
            return;
        }

        try {
            const response = await HAxiosService.DELETE(UserManagementAPI.delete_execution(executionToDelete.id));

            // Axios interceptor may return null for handled failures
            if (!response) return;

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlowDetails.executionDeleted", defaultMessage: "Execution deleted" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                handleCloseDeleteConfirm();
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            handleCloseDeleteConfirm();
            await loadFlowDetails();
        } catch (err) {
            console.error('Error deleting execution:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to delete execution" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
            handleCloseDeleteConfirm();
        }
    };

    const handleAddMenuOpen = (event, execution) => {
        setAddMenuAnchor(event.currentTarget);
        setAddMenuExecution(execution);
    };

    const handleAddMenuClose = () => {
        setAddMenuAnchor(null);
        setAddMenuExecution(null);
    };

    const fetchProvidersAndOpen = async (parentExecution) => {
        setAvailableProviders(null);
        setAddDialogParentExecution(parentExecution || null);
        // Close any small add menu immediately
        handleAddMenuClose();
        try {
            const response = await HAxiosService.GET(UserManagementAPI.fetch_authenticator_providers());
            if (!response) return; // handled by interceptor
            const providers = response?.data || [];
            setAvailableProviders(providers);
            setAddDialogOpen(true);
        } catch (err) {
            console.error('Error fetching providers for Add Step:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to fetch providers" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
        }
    };

    const handleAddAction = (type) => {
        if (!addMenuExecution) return;
        if (type === 'Add step') {
            fetchProvidersAndOpen(addMenuExecution);
            return;
        }
        if (type === 'Add sub-flow') {
            fetchFormProvidersAndOpen(addMenuExecution);
            return;
        }
        handleAddMenuClose();
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
        setAvailableProviders(null);
        setAddDialogParentExecution(null);
    };

    const handleAddSubFlowDialogClose = () => {
        setAddSubFlowDialogOpen(false);
        setAvailableFormProviders(null);
        setAddSubFlowDialogParentExecution(null);
    };

    const fetchFormProvidersAndOpen = async (parentExecution) => {
        setAvailableFormProviders(null);
        setAddSubFlowDialogParentExecution(parentExecution || null);
        // Close any small add menu immediately
        handleAddMenuClose();
        try {
            const response = await HAxiosService.GET(UserManagementAPI.fetch_form_providers());
            if (!response) return; // handled by interceptor
            const providers = response?.data || [];
            setAvailableFormProviders(providers);
            setAddSubFlowDialogOpen(true);
        } catch (err) {
            console.error('Error fetching form providers for Add Sub-flow:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to fetch form providers" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
        }
    };

    const handleAddDialogAdd = async (selectedProvider) => {
        if (!selectedProvider) {
            handleAddDialogClose();
            return;
        }

        if (!flow?.alias) {
            toast.error(intl.formatMessage({ id: "error.authFlowDetails.flowUnavailable", defaultMessage: "Flow data unavailable; cannot add execution" }), { position: 'top-right', autoClose: 4000 });
            handleAddDialogClose();
            return;
        }

        try {
            const providerId = selectedProvider.providerId || selectedProvider.id || selectedProvider.name;
            // If adding from a specific execution (sub-flow), send that execution's displayName
            // as the flowAlias. Otherwise send the main flow.alias
            const aliasToSend = addDialogParentExecution?.displayName ?? flow.alias;
            const payload = {
                flowAlias: aliasToSend,
                provider: providerId,
            };

            const response = await HAxiosService.POST(UserManagementAPI.create_execution(), payload);

            // Axios interceptor may return null for handled failures
            if (!response) return;

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlowDetails.executionAdded", defaultMessage: "Execution added successfully" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            handleAddDialogClose();
            await loadFlowDetails();
        } catch (err) {
            console.error('Error adding execution:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to add execution" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
        }
    };

    const handleAddSubFlowDialogAdd = async (selectedFormProvider) => {
        if (!selectedFormProvider) {
            handleAddSubFlowDialogClose();
            return;
        }

        if (!flow?.alias) {
            toast.error(intl.formatMessage({ id: "error.authFlowDetails.subFlowUnavailable", defaultMessage: "Flow data unavailable; cannot add sub-flow" }), { position: 'top-right', autoClose: 4000 });
            handleAddSubFlowDialogClose();
            return;
        }

        try {
            // Get providerId from the first form provider in the response
            const formProviderId = availableFormProviders?.length > 0 ? availableFormProviders[0].id : '';
            
            // Map flowType to backend type: Generic -> basic-flow, Form -> client-flow
            const typeToSend = selectedFormProvider.flowType === 'Form' ? 'client-flow' : 'basic-flow';
            
            // Determine parentFlowAlias: if adding from an execution, use that execution's displayName; otherwise use main flow alias
            const parentFlowAliasToSend = addSubFlowDialogParentExecution?.displayName ?? flow.alias;
            
            const payload = {
                flowAlias: selectedFormProvider.name,
                description: selectedFormProvider.description,
                providerId: formProviderId,
                type: typeToSend,
                parentFlowAlias: parentFlowAliasToSend,
            };

            const response = await HAxiosService.POST(UserManagementAPI.create_subflow(), payload);

            // Axios interceptor may return null for handled failures
            if (!response) return;

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlowDetails.subFlowAdded", defaultMessage: "Sub-flow added successfully" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            handleAddSubFlowDialogClose();
            await loadFlowDetails();
        } catch (err) {
            console.error('Error adding sub-flow:', err);
            const errMsg = err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlowDetails.fetchFailed", defaultMessage: "Failed to add sub-flow" });
            toast.error(errMsg, { position: 'top-right', autoClose: 4000 });
        }
    };

    let rows = [];
    if (flow && Array.isArray(flow.executions)) {
        // Build a tree structure for nested flows
        const buildTree = (execs, parentId) => {
            return execs
                .filter(e => e.parentFlow === parentId)
                .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                .map(e => ({
                    ...e,
                    executions: e.authenticationFlow ? buildTree(execs, e.flowId) : []
                }));
        };
        const tree = buildTree(flow.executions, flow.id);
        rows = flattenExecutions(tree);
    }

    const objColDefs = useMemo(
        () => [
            {
                headerName: intl.formatMessage({ id: "label.authFlowDetails.colSteps", defaultMessage: "Steps" }),
                field: "displayName",
                minWidth: 350,
                flex: 2,
                cellRenderer: (params) => {
                    const data = params.data;
                    if (!data) return null;
                    const level = data._level || 0;

                    return (
                        <HBox sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: level * 3, height: '100%', width: '100%', background: 'transparent' }}>
                            <HBox sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', cursor: 'default', background: 'transparent' }}>
                                <HLabel
                                    value="⋮⋮"
                                    translate={false}
                                    colon={false}
                                    sx={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px', userSelect: 'none', color: 'text.secondary' }}
                                />
                            </HBox>
                            <HBox sx={{ display: 'flex', flexDirection: 'column', flex: 1, py: 0.5, justifyContent: 'center', background: 'transparent' }}>
                                <HLabel
                                    value={data.displayName}
                                    translate={false}
                                    colon={false}
                                    align="left"
                                    sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary', mb: 0.25 }}
                                />
                                {data.description && (
                                    <HLabel
                                        value={data.description}
                                        translate={false}
                                        colon={false}
                                        align="left"
                                        sx={{ display: 'block', fontSize: '0.75rem', lineHeight: 1.2, color: 'text.secondary' }}
                                    />
                                )}
                            </HBox>
                            <HBox sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto', mr: 2, background: 'transparent' }}>
                                {data.authenticationFlow && (
                                    <Chip 
                                        label={intl.formatMessage({ id: "label.authFlowDetails.subFlow", defaultMessage: "Sub-flow" })} 
                                        size="small" 
                                        variant="outlined" 
                                        sx={{ height: '22px', fontSize: '0.75rem', fontWeight: 500 }} 
                                    />
                                )}
                                {data.configurable && (
                                    <Chip 
                                        label={intl.formatMessage({ id: "label.authFlowDetails.configurable", defaultMessage: "Configurable" })} 
                                        size="small" 
                                        color="primary" 
                                        variant="filled" 
                                        sx={{ height: '22px', fontSize: '0.75rem', fontWeight: 600 }} 
                                    />
                                )}
                            </HBox>
                        </HBox>
                    );
                },
                autoHeight: true,
            },
            {
                headerName: intl.formatMessage({ id: "label.authFlowDetails.colRequirement", defaultMessage: "Requirement" }),
                field: "requirement",
                minWidth: 200,
                flex: 1.2,
                cellRenderer: (params) => {
                    const exec = params.data;
                    if (!exec) return null;

                    const formatReq = (req) => {
                        if (!req) return '';
                        const lower = req.toLowerCase();
                        return intl.formatMessage({ 
                            id: `label.authFlowDetails.requirement.${lower}`, 
                            defaultMessage: req.charAt(0) + lower.slice(1) 
                        });
                    };

                    if (exec.requirementChoices && exec.requirementChoices.length > 0) {
                        const options = exec.requirementChoices.map((choice) => ({
                            value: choice,
                            label: formatReq(choice)
                        }));
                        return (
                            <HBox sx={{ display: 'flex', alignItems: 'center', height: '100%', background: 'transparent', gap: 1 }}>
                                <HDropdown
                                    value={exec.requirement || ''}
                                    onChange={(e) => handleRequirementChange(exec, e.target.value)}
                                    options={options}
                                    disabled={updatingExecutionId === exec.id}
                                    width="160px"
                                />
                                {updatingExecutionId === exec.id && <CircularProgress size={14} />}
                            </HBox>
                        );
                    }

                    const labelVal = formatReq(exec.requirement);
                    return (
                        <HBox sx={{ display: 'flex', alignItems: 'center', height: '100%', background: 'transparent' }}>
                            <Chip 
                                label={labelVal} 
                                color={requirementColors[exec.requirement] || 'default'} 
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        </HBox>
                    );
                },
                autoHeight: true,
            },
            {
                headerName: "",
                field: "actions",
                minWidth: 100,
                flex: 0.5,
                cellRenderer: (params) => {
                    const exec = params.data;
                    if (!exec) return null;

                    return (
                        <HBox sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, height: '100%', background: 'transparent' }}>
                            {exec.authenticationFlow && (
                                <Tooltip title={intl.formatMessage({ id: "label.authFlowDetails.addTooltip", defaultMessage: "Add step or sub-flow" })}>
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleAddMenuOpen(e, exec)}
                                        sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                                    >
                                        <Add fontSize="small" sx={{ color: 'primary.main' }} />
                                    </IconButton>
                                </Tooltip>
                            )}

                            <Tooltip title={intl.formatMessage({ id: "label.authFlowDetails.deleteTooltip", defaultMessage: "Delete execution" })}>
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleOpenDeleteConfirm(exec)}
                                    sx={{ '&:hover': { backgroundColor: 'rgba(244,67,54,0.08)' } }}
                                >
                                    <DeleteOutline fontSize="small" sx={{ color: '#f44336' }} />
                                </IconButton>
                            </Tooltip>
                        </HBox>
                    );
                },
                cellStyle: { display: "flex", justifyContent: "flex-end", alignItems: "center" },
                sortable: false,
                filter: false,
            }
        ],
        [intl, updatingExecutionId, handleRequirementChange, handleAddMenuOpen, handleOpenDeleteConfirm]
    );

    const objDefaultColDef = {
        sortable: true,
        filter: false,
        resizable: true,
        flex: 1,
    };

    const objCustomGridStyle = {
        width: "100%",
        height: "100%",
        minWidth: 0,
        overflowX: "hidden",
        "--ag-borders": "none",
    };

    return (
        <HBox sx={{ p: 3, minHeight: '100vh' }}>
            {(() => {
                if (loading) {
                    return (
                        <HBox display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                            <CircularProgress />
                        </HBox>
                    );
                }
                if (error) {
                    return (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    );
                }
                if (!flow) {
                    return null;
                }
                return (
                    <>
                        {/* Breadcrumb Navigation */}
                        <Breadcrumbs sx={{ mb: 4 }}>
                            <Link 
                                component="button" 
                                variant="body2" 
                                onClick={() => navigate('/homelayout/authentication-flows')}
                                sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                            >
                                {intl.formatMessage({ id: "label.authFlowDetails.breadcrumbAuth", defaultMessage: "Authentication" })}
                            </Link>
                            <HLabel
                                value="label.authFlowDetails.breadcrumbFlowDetails"
                                colon={false}
                                align="left"
                                sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.secondary' }}
                            />
                        </Breadcrumbs>

                        {/* Flow Header with Title and Status */}
                        <HBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, pb: 3, borderBottom: '2px solid #e8e8e8', background: 'transparent' }}>
                            <HBox sx={{ background: 'transparent' }}>
                                <HBox sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'transparent' }}>
                                    <HLabel
                                        value={flow.alias}
                                        translate={false}
                                        colon={false}
                                        align="left"
                                        sx={{ fontSize: '1.5rem', fontWeight: 650, color: 'text.primary' }}
                                    />
                                    {flow.builtIn && (
                                        <Chip 
                                            label={intl.formatMessage({ id: "label.authFlowDetails.builtIn", defaultMessage: "Built-in" })} 
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ height: '24px', fontWeight: 500 }} 
                                        />
                                    )}
                                    {flow.topLevel && (
                                        <Chip 
                                            label={intl.formatMessage({ id: "label.authFlowDetails.topLevel", defaultMessage: "Top level" })} 
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ height: '24px', fontWeight: 500 }} 
                                        />
                                    )}
                                </HBox>
                                <HLabel
                                    value={flow.description || intl.formatMessage({ id: "label.authFlowDetails.noDescription", defaultMessage: "No description provided" })}
                                    translate={false}
                                    colon={false}
                                    align="left"
                                    sx={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'text.secondary' }}
                                />
                            </HBox>
                        </HBox>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <HButton 
                                label="label.authFlowDetails.addStep"
                                variant="outlined" 
                                size="medium"
                                startIcon={<Add />}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                onClick={() => fetchProvidersAndOpen(null)}
                            />
                            <HButton 
                                label="label.authFlowDetails.addSubFlow"
                                variant="outlined" 
                                size="medium"
                                startIcon={<CallSplit />}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                onClick={() => fetchFormProvidersAndOpen(null)}
                            />
                        </Stack>

                        {/* Steps Grid */}
                        <HPaper 
                            variant="outlined" 
                            elevation={0} 
                            sx={{ 
                                borderRadius: 1, 
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                p: 0,
                                overflow: 'hidden',
                                mb: 3
                            }}
                        >
                            <HAgGrid
                                rowData={rows}
                                columnDefs={objColDefs}
                                defaultColDef={objDefaultColDef}
                                gridStyle={objCustomGridStyle}
                                gridClassName="drs-list-grid drs-auth-flow-details-grid"
                                embeddedInSection
                                pagination
                                paginationPageSize={10}
                            />
                        </HPaper>

                        {/* Add Menu for authenticationFlow rows */}
                        <Menu
                            anchorEl={addMenuAnchor}
                            open={Boolean(addMenuAnchor)}
                            onClose={handleAddMenuClose}
                        >
                            <MenuItem onClick={() => handleAddAction('Add step')}>
                                {intl.formatMessage({ id: "label.authFlowDetails.addStep", defaultMessage: "Add step" })}
                            </MenuItem>
                            <MenuItem onClick={() => handleAddAction('Add sub-flow')}>
                                {intl.formatMessage({ id: "label.authFlowDetails.addSubFlow", defaultMessage: "Add sub-flow" })}
                            </MenuItem>
                        </Menu>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={deleteConfirmDialogOpen}
                            onClose={handleCloseDeleteConfirm}
                            aria-labelledby="delete-dialog-title"
                            maxWidth="sm"
                            fullWidth
                        >
                            <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 700, fontSize: '1.1rem', pb: 2 }}>
                                {intl.formatMessage({ id: "label.authFlowDetails.deleteTitle", defaultMessage: "Delete Execution" })}
                            </DialogTitle>
                            <DialogContent sx={{ pt: 1 }}>
                                <HLabel
                                    value="label.authFlowDetails.deleteConfirmMessage"
                                    colon={false}
                                    align="left"
                                    sx={{ fontSize: '0.95rem', lineHeight: 1.6, mb: 2, color: 'text.secondary' }}
                                />
                                {executionToDelete && (
                                    <HLabel
                                        value={executionToDelete.displayName}
                                        translate={false}
                                        colon={false}
                                        align="left"
                                        sx={{ mt: 1, fontWeight: 600, color: 'text.secondary', px: 2, py: 1, backgroundColor: 'action.hover', borderRadius: 1, display: 'block' }}
                                    />
                                )}
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 2, gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                <HButton 
                                    onClick={handleCloseDeleteConfirm} 
                                    variant="outlined"
                                    label="label.authFlowDetails.cancel"
                                    sx={{ textTransform: 'none', fontWeight: 500 }} 
                                />
                                <HButton 
                                    onClick={handleConfirmDelete} 
                                    variant="contained" 
                                    color="error" 
                                    label="label.authFlowDetails.delete"
                                    sx={{ textTransform: 'none', fontWeight: 600 }} 
                                />
                            </DialogActions>
                        </Dialog>
                        {/* Add Step Dialog (fetches providers before opening) */}
                        <AddStepDialog
                            open={addDialogOpen}
                            onClose={handleAddDialogClose}
                            providers={availableProviders}
                            parentExecution={addDialogParentExecution}
                            onAdd={handleAddDialogAdd}
                        />
                        {/* Add Sub-Flow Dialog (fetches form providers before opening) */}
                        <AddSubFlowDialog
                            open={addSubFlowDialogOpen}
                            onClose={handleAddSubFlowDialogClose}
                            formProviders={availableFormProviders}
                            parentExecution={addSubFlowDialogParentExecution}
                            onAdd={handleAddSubFlowDialogAdd}
                        />
                    </>
                );
            })()}
        </HBox>
    );
};

export default AuthenticationFlowDetails;
