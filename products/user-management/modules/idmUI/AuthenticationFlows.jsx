import { useEffect, useMemo, useState } from "react";
import {
    CircularProgress,
    Alert,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    useTheme
} from "@mui/material";
import { useNavigate,Link } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, ALIGNMENT, HBox, HLabel, HPaper, HDropdown, HTextField, HButton, HAgGrid, HBreadCrumb, TitleBar, useToast, HDialog } from "@helix/component-library";
import { useIntl } from "react-intl";

const AuthenticationFlows = () => {
    const [authFlows, setAuthFlows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [activeFlow, setActiveFlow] = useState(null);
    const toast = useToast();
    const theme = useTheme();
    const intl = useIntl();
    const navigate = useNavigate();
    const realm = sessionStorage.getItem("SEC_REALM");

    const fetchAuthenticationFlows = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await HAxiosService.GET(UserManagementAPI.fetch_auth_flows());
            if (response.data && Array.isArray(response.data)) {
                setAuthFlows(response.data);
            } else {
                setAuthFlows([]);
            }
        } catch (err) {
            console.error("Error fetching authentication flows:", err);
            setError(err.response?.data?.message || err.message || intl.formatMessage({ id: "error.authFlows.fetchFailed", defaultMessage: "Failed to fetch authentication flows" }));
            toast.error(intl.formatMessage({ id: "error.authFlows.fetchFailed", defaultMessage: "Failed to fetch authentication flows" }), { position: "top-right", autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthenticationFlows();
    }, [realm]);

    const handleMenuOpen = (event, flow) => {
        setMenuAnchor(event.currentTarget);
        setActiveFlow(flow);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setActiveFlow(null);
    };

    // ── Delete dialog ──────────────────────────────────────────────────────────
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const openDeleteDialog = (event, flow) => {
        handleMenuClose();
        setActiveFlow(flow);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // ── Duplicate dialog ───────────────────────────────────────────────────────
    const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
    const [duplicateFormData, setDuplicateFormData] = useState({ newName: '', description: '' });

    const openDuplicateDialog = (event, flow) => {
        handleMenuClose();
        setActiveFlow(flow);
        setDuplicateFormData({
            newName: `${flow.alias} Copy`,
            description: flow.description || '',
        });
        setDuplicateDialogOpen(true);
    };

    const closeDuplicateDialog = () => {
        setDuplicateDialogOpen(false);
        setDuplicateFormData({ newName: '', description: '' });
    };

    const handleDuplicateFormChange = (e) => {
        const { name, value } = e.target;
        setDuplicateFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDuplicate = () => {
        if (!activeFlow) return;
        openDuplicateDialog(null, activeFlow);
    };

    // ── Bind dialog ────────────────────────────────────────────────────────────
    const [bindDialogOpen, setBindDialogOpen] = useState(false);
    const [bindForm, setBindForm] = useState({ bindingType: '' });

    const openBindDialog = (event, flow) => {
        handleMenuClose();
        setActiveFlow(flow);
        setBindForm({ bindingType: '' });
        setBindDialogOpen(true);
    };

    const closeBindDialog = () => {
        setBindDialogOpen(false);
    };

    const handleBindChange = (e) => {
        setBindForm({ bindingType: e.target.value });
    };

    const handleBindSubmit = async () => {
        if (!activeFlow) return;
        if (!bindForm.bindingType) {
            toast.error(intl.formatMessage({ id: "error.authFlows.chooseBindingType", defaultMessage: "Please choose a binding type" }), { position: 'top-right', autoClose: 2000 });
            return;
        }

        try {
            const payload = {
                id: activeFlow.id,
                flowAlias: activeFlow.alias,
                bindingType: bindForm.bindingType,
            };

            const response = await HAxiosService.PUT(UserManagementAPI.bind_auth_flow(), payload);

            if (!response) { closeBindDialog(); return; }

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlows.bound", defaultMessage: "Authentication flow bound" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                closeBindDialog();
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            try { await fetchAuthenticationFlows(); } catch (refreshErr) { console.error('Error refreshing flows after bind:', refreshErr); }
        } catch (err) {
            console.error('Error binding authentication flow:', err);
            toast.error(err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlows.bindFailed", defaultMessage: "Failed to bind authentication flow" }), { position: 'top-right', autoClose: 4000 });
        } finally {
            closeBindDialog();
        }
    };

    const handleDuplicateSubmit = async () => {
        if (!activeFlow || !duplicateFormData.newName.trim()) {
            toast.error(intl.formatMessage({ id: "error.authFlows.nameRequired", defaultMessage: "New name is required" }), { position: 'top-right', autoClose: 2000 });
            return;
        }

        try {
            const payload = {
                flowAlias: activeFlow.alias,
                newName: duplicateFormData.newName.trim(),
                description: duplicateFormData.description.trim(),
            };

            const response = await HAxiosService.POST(UserManagementAPI.duplicate_auth_flow(), payload);

            if (!response) { closeDuplicateDialog(); return; }

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlows.duplicated", defaultMessage: "Authentication flow duplicated" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                closeDuplicateDialog();
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            try { await fetchAuthenticationFlows(); } catch (refreshErr) { console.error('Error refreshing flows after duplicate:', refreshErr); }
        } catch (err) {
            console.error('Error duplicating authentication flow:', err);
            toast.error(err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlows.duplicateFailed", defaultMessage: "Failed to duplicate authentication flow" }), { position: 'top-right', autoClose: 4000 });
        } finally {
            closeDuplicateDialog();
        }
    };

    const handleDelete = async () => {
        if (!activeFlow) return;
        if (activeFlow.builtIn) {
            toast.warning(intl.formatMessage({ id: "error.authFlows.cannotDeleteBuiltIn", defaultMessage: "Built-in flows cannot be deleted" }), { position: 'top-right', autoClose: 2000 });
            closeDeleteDialog();
            return;
        }

        try {
            const response = await HAxiosService.DELETE(UserManagementAPI.delete_auth_flow(activeFlow.id));

            if (!response) { closeDeleteDialog(); return; }

            const msg = getApiMsg(response, intl.formatMessage({ id: "success.authFlows.deleted", defaultMessage: "Authentication flow deleted" }));

            if (!isApiSuccess(response)) {
                toast.error(msg, { position: 'top-right', autoClose: 4000 });
                closeDeleteDialog();
                return;
            }

            toast.success(msg, { position: 'top-right', autoClose: 3000 });
            try { await fetchAuthenticationFlows(); } catch (refreshErr) { console.error('Error refreshing flows after delete:', refreshErr); }
        } catch (err) {
            console.error('Error deleting authentication flow:', err);
            toast.error(err?.response?.data?.msg || err?.message || intl.formatMessage({ id: "error.authFlows.deleteFailed", defaultMessage: "Failed to delete authentication flow" }), { position: 'top-right', autoClose: 4000 });
        } finally {
            closeDeleteDialog();
        }
    };
    // ── HAgGrid column definitions ─────────────────────────────────────────────
    const columnDefs = useMemo(() => [
        {
            headerName: intl.formatMessage({ id: "label.authFlows.table.flowName", defaultMessage: "Flow name" }),
            field: "alias",
            minWidth: 200,
            flex: 2,
            filter: false,
            wrapText: true,
            autoHeight: true,
            cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25, display: "flex", alignItems: "center" },
            cellRenderer: (params) => {
                const flow = params.data;
                return (
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, background: "transparent" }}>
                          <HBox sx={{ display: "flex", alignItems: "center", gap: 1.5, background: "transparent" }}>
                            <Link
                                      to={`/homelayout/authentication-flows/${flow.id}`}
                                      state={location.state}
                                      style={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 13,
                                        color: 'primary.main',
                                        textDecoration: "none",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {flow.alias}
                                    </Link>
                             {flow.builtIn && (
                                 <Chip
                                     label={intl.formatMessage({ id: "label.authFlows.table.builtIn", defaultMessage: "Built-in" })}
                                     size="small"
                                     variant="outlined"
                                     sx={{ height: '22px' }}
                                 />
                             )}
                          </HBox>
                     </HBox>
                );
            },
        },
        {
            headerName: intl.formatMessage({ id: "label.authFlows.table.usedBy", defaultMessage: "Used by" }),
            field: "usedBy",
            minWidth: 180,
            flex: 1.5,
            filter: false,
            wrapText: true,
            autoHeight: true,
            cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25, display: "flex", alignItems: "center" },
            cellRenderer: (params) => {
                const flow = params.data;
                return (
                    <HBox sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", background: "transparent" }}>
                        {flow.usedBy && flow.usedBy.length > 0 ? (
                            flow.usedBy.map((u) => (
                                <Chip
                                    key={u.bindingType}
                                    label={u.bindingType.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    sx={{ height: '22px', fontWeight: 500 }}
                                />
                            ))
                        ) : (
                            <HLabel
                                value="label.authFlows.table.notInUse"
                                colon={false}
                                translate={true}
                                align="left"
                                component="span"
                                sx={{ fontSize: '0.9rem', color: 'text.secondary', fontStyle: 'italic' }}
                            />
                        )}
                    </HBox>
                );
            },
        },
        {
            headerName: intl.formatMessage({ id: "label.authFlows.table.description", defaultMessage: "Description" }),
            field: "description",
            minWidth: 200,
            flex: 2,
            filter: false,
            wrapText: true,
            autoHeight: true,
            cellStyle: { textAlign: ALIGNMENT.TEXT, whiteSpace: "normal", lineHeight: 1.25, display: "flex", alignItems: "center" },
            cellRenderer: (params) => (
                <HLabel
                    value={params.value || '—'}
                    colon={false}
                    translate={false}
                    align="left"
                    component="span"
                    sx={{ fontSize: '0.9rem', color: 'text.secondary', maxWidth: '300px', display: 'block' }}
                />
            ),
        },
        {
            headerName: "",
            field: "actions",
            width: 60,
            sortable: false,
            filter: false,
            resizable: false,
            cellStyle: { textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end" },
            cellRenderer: (params) => {
                const flow = params.data;
                return (
                    <Tooltip title={intl.formatMessage({ id: "label.authFlows.menu.actions", defaultMessage: "Actions" })}>
                        <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, flow)}
                            sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                        >
                            <MoreVert fontSize="small" />
                        </IconButton>
                    </Tooltip>
                );
            },
        },
    ], [navigate, intl]);

    const defaultColDef = {
        sortable: true,
        filter: true,
        floatingFilter: false,
        resizable: true,
        flex: 1,
    };

    const gridStyle = {
        width: "100%",
        height: "100%",
        minWidth: 0,
        overflowX: "hidden",
        "--ag-borders": "none",
    };

    // ── Loading / error / empty states ─────────────────────────────────────────
    if (loading) {
        return (
            <HBox sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <CircularProgress />
            </HBox>
        );
    }

    if (error) {
        return (
            <HBox sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </HBox>
        );
    }

    if (!authFlows || authFlows.length === 0) {
        return (
            <HBox sx={{ p: 2 }}>
                <Alert severity="info">{intl.formatMessage({ id: "label.authFlows.empty.noFlows", defaultMessage: "No authentication flows available" })}</Alert>
            </HBox>
        );
    }

    // ── Main render ────────────────────────────────────────────────────────────
    return (
        <HBox sx={{ p: 1, minHeight: '100vh', mt: 2, display: 'flex', flexDirection: 'column' }}>

            <HBox sx={{ flexShrink: 0, height: "8%", display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <HBreadCrumb />
                <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                    <TitleBar
                        title={intl.formatMessage({
                        id: "label.authFlows.title",
                        defaultMessage: "Authentication Flows",
                        })}
                    />
                </HBox>
            </HBox>

            {/* Grid */}
            <HPaper elevation={0} sx={{ borderRadius: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <HAgGrid
                    rowData={authFlows}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    gridStyle={gridStyle}
                    gridClassName="drs-list-grid"
                    pagination
                    paginationPageSize={10}
                    sort
                />
            </HPaper>

            {/* ── Context Menu ── */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                {activeFlow && (
                    <>
                        {!activeFlow.builtIn && (
                            <MenuItem onClick={() => openDeleteDialog(null, activeFlow)}>
                                <HLabel value="label.authFlows.menu.delete" translate={true} colon={false} sx={{ fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit' }} />
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleDuplicate}>
                            <HLabel value="label.authFlows.menu.duplicate" translate={true} colon={false} sx={{ fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit' }} />
                        </MenuItem>
                        {(!activeFlow.usedBy || activeFlow.usedBy.length === 0) && (
                            <MenuItem onClick={() => openBindDialog(null, activeFlow)}>
                                <HLabel value="label.authFlows.menu.bindFlow" translate={true} colon={false} sx={{ fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit' }} />
                            </MenuItem>
                        )}
                    </>
                )}
            </Menu>

            {/* ── Delete Dialog ── */}
            <HDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="sm"
                fullWidth
                title={intl.formatMessage({ id: "label.authFlows.deleteDialog.title", defaultMessage: "Delete flow" })}
                contentProps={{ sx: { pt: 1 } }}
                actions={
                    <>
                    <HButton
                        label="label.authFlows.button.cancel"
                        onClick={closeDeleteDialog}
                        sx={{ textTransform: 'none', fontWeight: 500 }}
                    />
                    <HButton
                        label="label.authFlows.button.delete"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    />
                    </>
                }
            >
                    <HLabel
                        value={intl.formatMessage({ id: "label.authFlows.deleteDialog.desc", defaultMessage: "Are you sure you want to permanently delete the flow \"{alias}\"? This action cannot be undone." }, { alias: activeFlow?.alias })}
                        colon={false}
                        translate={false}
                        align="left"
                        component="p"
                        sx={{ fontSize: '0.95rem', lineHeight: 1.6, m: 0 }}
                    />
            </HDialog>

            {/* ── Duplicate Dialog ── */}
            <HDialog
                open={duplicateDialogOpen}
                onClose={closeDuplicateDialog}
                maxWidth="sm"
                fullWidth
                title={intl.formatMessage({ id: "label.authFlows.duplicateDialog.title", defaultMessage: "Duplicate flow" })}
                contentProps={{ sx: { pt: 1, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 } }}
                actions={
                    <>
                        <HButton
                            label="label.authFlows.button.cancel"
                            onClick={closeDuplicateDialog}
                            sx={{ textTransform: 'none', fontWeight: 500 }}
                        />
                        <HButton
                            label="label.authFlows.button.duplicate"
                            variant="contained"
                            color="primary"
                            onClick={handleDuplicateSubmit}
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        />
                    </>
                }
            >
                    <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1, background: "transparent" }}>
                        <HLabel
                            value="label.authFlows.duplicateDialog.newName"
                            required
                            colon={false}
                            translate={true}
                            align="left"
                            width="100%"
                            sx={{ fontSize: '13px', fontWeight: 600 }}
                        />
                        <HTextField
                            name="newName"
                            value={duplicateFormData.newName}
                            onChange={handleDuplicateFormChange}
                            editable
                            width="100%"
                            placeholder={intl.formatMessage({ id: "label.authFlows.duplicateDialog.placeholderName", defaultMessage: "Enter new flow name" })}
                        />
                    </HBox>

                    <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, background: "transparent", mt: 2 }}>
                        <HLabel
                            value="label.authFlows.duplicateDialog.description"
                            colon={false}
                            translate={true}
                            align="left"
                            width="100%"
                            sx={{ fontSize: '13px', fontWeight: 600 }}
                        />
                        <HTextField
                            name="description"
                            value={duplicateFormData.description}
                            onChange={handleDuplicateFormChange}
                            editable
                            width="100%"
                            multiline
                            rows={3}
                            placeholder={intl.formatMessage({ id: "label.authFlows.duplicateDialog.placeholderDesc", defaultMessage: "Enter flow description" })}
                        />
                    </HBox>
            </HDialog>

            {/* ── Bind Dialog ── */}
            <HDialog
                open={bindDialogOpen}
                onClose={closeBindDialog}
                maxWidth="sm"
                fullWidth
                title={intl.formatMessage({ id: "label.authFlows.bindDialog.title", defaultMessage: "Bind flow" })}
                contentProps={{ sx: { pt: 1, pb: 2 } }}
                actions={
                    <>
                    <HButton
                        label="label.authFlows.button.cancel"
                        onClick={closeBindDialog}
                        sx={{ textTransform: 'none', fontWeight: 500 }}
                    />
                    <HButton
                        label="label.authFlows.button.save"
                        variant="contained"
                        color="primary"
                        onClick={handleBindSubmit}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    />
                    </>
                }
            >
                    <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                        <HLabel
                            value="label.authFlows.bindDialog.chooseBindingType"
                            required
                            colon={false}
                            translate={true}
                            align="left"
                            width="100%"
                            sx={{ fontSize: '13px', fontWeight: 600 }}
                        />
                        <HDropdown
                            value={bindForm.bindingType}
                            onChange={handleBindChange}
                            width="100%"
                            placeholder={intl.formatMessage({ id: "label.authFlows.bindDialog.chooseBindingType", defaultMessage: "Choose binding type" })}
                            options={[
                                { value: "browserFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.browser", defaultMessage: "Browser flow" }) },
                                { value: "registrationFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.registration", defaultMessage: "Registration flow" }) },
                                { value: "directGrantFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.directGrant", defaultMessage: "Direct grant flow" }) },
                                { value: "resetCredentialsFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.resetCredentials", defaultMessage: "Reset credentials flow" }) },
                                { value: "clientAuthenticationFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.clientAuthentication", defaultMessage: "Client authentication flow" }) },
                                { value: "firstBrokerLoginFlow", label: intl.formatMessage({ id: "label.authFlows.bindingType.firstBrokerLogin", defaultMessage: "First broker login flow" }) },
                            ]}
                        />
                    </HBox>
            </HDialog>
        </HBox>
    );
};

AuthenticationFlows.propTypes = {};

export default AuthenticationFlows;
