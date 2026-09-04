import { useState, useRef, useEffect, useMemo } from "react";
import {
  Checkbox,
  DialogContent,
  DialogContentText,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserManagementAPI } from "./apiEndpoints";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload } from "react-icons/md";
import { FiUpload, FiUsers } from "react-icons/fi";
import { useIntl } from "react-intl";
import { HAxiosService, HBreadCrumb, TitleBar, HBox, HButton, HLabel, HAgGrid, HDialog, useToast, useDrsTheme, withAlpha } from "@helix/component-library";
import { downloadSampleFile } from "./downloadSampleFile";
import SampleTemplateSection from "./SampleTemplateSection";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  accentDark: '#a30404',
  background: {
    start: '#f8fafc',
    end: '#f1f5f9',
    gradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  cardBg: 'rgba(255, 255, 255, 0.98)',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  hover: '#f1f5f9',
  appBarGradient: 'linear-gradient(135deg, #0378A6 0%, #025a8c 50%, #01406b 100%)',
};

// ─── Shared dialog paper / title / button sx ──────────────────────────────────
const dialogPaperProps = {
  sx: {
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 12px 30px ${colors.primary}30`,
  },
};

const dialogTitleSx = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  fontSize: 16,
  color: colors.text.primary,
  borderBottom: `1px solid ${colors.border}`,
};

const dialogBtnOutlinedSx = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: "8px",
  textTransform: "none",
  borderColor: colors.border,
  color: colors.text.secondary,
  "&:hover": { borderColor: colors.primaryLight, background: colors.hover },
};

// ─── Shared AG Grid style ─────────────────────────────────────────────────────
const baseGridStyle = {
  width: "100%",
  minWidth: 0,
  overflowX: "hidden",
  "--ag-borders": "none",
  border: "1px solid #dde8f5",
  borderRadius: "8px",
};

const defaultColDef = {
  sortable: true,
  filter: false,
  resizable: true,
  flex: 1,
};

// ─── Component ────────────────────────────────────────────────────────────────
const UploadFederationUsers = () => {
  const { surfaces, text, border, action, colors: drsColors } = useDrsTheme();
  const theme = useTheme();
  const intl = useIntl();
  const [selectedFile, setSelectedFile] = useState(null);
  const [validatedRows, setValidatedRows] = useState([]);
  const [syncedUsers, setSyncedUsers] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [federations, setFederations] = useState([]);
  const toast = useToast();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const canUpload = federations.some((federation) => federation.enabled);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const federationsColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.federation.name", defaultMessage: "Name" }),
      field: "name",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.provider", defaultMessage: "Provider" }),
      field: "providerId",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.status", defaultMessage: "Status" }),
      field: "enabled",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => {
        const enabled = params.value;
        return (
          <Chip
            label={enabled ? intl.formatMessage({ id: "label.federation.enabled", defaultMessage: "Enabled" }) : intl.formatMessage({ id: "label.federation.disabled", defaultMessage: "Disabled" })}
            size="small"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              bgcolor: enabled ? "#dcfce7" : "#fee2e2",
              color: enabled ? "#16a34a" : colors.accent,
              border: `1px solid ${enabled ? "#bbf7d0" : "#fecaca"}`,
            }}
          />
        );
      }
    }
  ], [intl]);

  const syncedRows = useMemo(() => {
    return Object.entries(syncedUsers).flatMap(([provider, users]) =>
      users.map((user) => ({ ...user, provider }))
    );
  }, [syncedUsers]);

  const syncedColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.federation.provider", defaultMessage: "Provider" }),
      field: "provider",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.username", defaultMessage: "Username" }),
      field: "username",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.firstName", defaultMessage: "First Name" }),
      field: "firstName",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.lastName", defaultMessage: "Last Name" }),
      field: "lastName",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.email", defaultMessage: "Email" }),
      field: "email",
      sortable: true,
      flex: 1.5,
    }
  ], [intl]);

  const previewColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.federation.select", defaultMessage: "Select" }),
      field: "status",
      width: 90,
      flex: 0,
      cellRenderer: (params) => (
        <Checkbox
          checked={!!params.value}
          disabled
          color="primary"
          size="small"
          sx={{ p: 0 }}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.username", defaultMessage: "Username" }),
      field: "username",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.role", defaultMessage: "Role" }),
      field: "role",
      sortable: true,
      flex: 1,
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.status", defaultMessage: "Status" }),
      field: "status",
      sortable: true,
      flex: 1,
      cellRenderer: (params) => {
        const isValid = params.value;
        return (
          <Chip
            label={isValid ? intl.formatMessage({ id: "label.user.active", defaultMessage: "Valid" }) : intl.formatMessage({ id: "label.user.inactive", defaultMessage: "Invalid" })}
            size="small"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              bgcolor: isValid ? "#dcfce7" : "#fee2e2",
              color: isValid ? "#16a34a" : colors.accent,
              border: `1px solid ${isValid ? "#bbf7d0" : "#fecaca"}`,
            }}
          />
        );
      }
    },
    {
      headerName: intl.formatMessage({ id: "label.federation.remark", defaultMessage: "Remark" }),
      field: "statusDescription",
      sortable: true,
      flex: 1.5,
    }
  ], [intl]);

  const handleDialogClose = (setter) => (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setter(false);
    }
  };

  useEffect(() => {
    const fetchFederations = async () => {
      try {
        const response = await HAxiosService.GET(
          UserManagementAPI.get_user_federations(),
        );
        if (response.data && Array.isArray(response.data)) {
          setFederations(response.data);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || intl.formatMessage({ id: "error.federation.fetch", defaultMessage: "Failed to fetch federation names" }),
        );
      }
    };
    fetchFederations();
  }, [toast]);

  useEffect(() => {
    if (!canUpload) {
      setSelectedFile(null);
      setValidatedRows([]);
      setSyncedUsers({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [canUpload]);

  const handleFileSelect = (event) => {
    if (!canUpload) return;

    const file = event.target.files[0];
    if (!file) return;
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (!validTypes.includes(file.type) || (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls"))) {
      toast.error(intl.formatMessage({ id: "error.federation.invalid.file", defaultMessage: "Invalid file. Please upload a valid Excel file (.xlsx or .xls)" }));
      return;
    }
    if (file.size === 0) {
      toast.error(intl.formatMessage({ id: "error.federation.empty.file", defaultMessage: "Uploaded file is Empty!" }));
      return;
    }
    setSelectedFile(file);
    setValidatedRows([]);
    setSyncedUsers({});
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setValidatedRows([]);
    setSyncedUsers({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!canUpload) {
      toast.warning(intl.formatMessage({ id: "error.federation.noProviders", defaultMessage: "No federation providers available. Upload is disabled." }));
      return;
    }
    if (!selectedFile) {
      toast.error(intl.formatMessage({ id: "error.federation.upload.file", defaultMessage: "Please upload a file" }));
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await HAxiosService.POST(
        UserManagementAPI.validate_upload_federation_users(),
        formData,
        {},
        false,
        { "Content-Type": "multipart/form-data" },
      );
      if (response.data && Array.isArray(response.data)) {
        const normalizedRows = response.data.map((row) => ({
          ...row,
          status: row.status ?? false,
          statusDescription: row.statusDescription ?? "Not Accepted",
        }));
        setValidatedRows(normalizedRows);
        setDialogOpen(true);
        setSyncedUsers({});
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || intl.formatMessage({ id: "error.federation.validateFailed", defaultMessage: "Failed to validate bulk users" }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadSample = (fileName) =>
    downloadSampleFile(fileName, toast);
  const handleConfirmSave = async () => {
    const validUsers = validatedRows.filter((row) => row.status);
    if (validUsers.length === 0) {
      toast.warning(intl.formatMessage({ id: "error.federation.noValidUsers", defaultMessage: "No valid users to sync" }));
      return;
    }
    setIsConfirming(true);
    const usersToSync = validUsers.map((row) => ({
      username: row.username,
      role: row.role,
      status: row.status,
      statusDescription: row.statusDescription,
    }));
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.sync_selected_federation_users(),
        usersToSync,
      );
      if (response.data) setSyncedUsers(response.data);
      toast.success(intl.formatMessage({ id: "success.users.synced", defaultMessage: "Valid users synced successfully!" }));
      setConfirmOpen(false);
      setDialogOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          intl.formatMessage({ id: "error.users.sync", defaultMessage: "Error syncing Users" }),
      );
    }
    setIsConfirming(false);
  };

  const totalSyncedUsers = Object.values(syncedUsers).reduce(
    (acc, arr) => acc + arr.length,
    0,
  );

  const dialogPaperProps = { sx: {
    borderRadius: "16px",
    border: `1px solid ${border.divider}`,
    boxShadow: `0 12px 30px ${withAlpha(drsColors.primary, 0.19)}`,
    overflow: "hidden",
  } };
  const dialogTitleSx = {
    fontWeight: 700,
    fontSize: 16,
    color: text.primary,
    borderBottom: `1px solid ${border.divider}`,
  };
  const dialogBtnOutlined = {
    fontWeight: 600,
    fontSize: 13,
    borderRadius: "8px",
    textTransform: "none",
    borderColor: border.divider,
    color: text.secondary,
    "&:hover": {
      borderColor: "var(--drs-control-hover-border)",
      bgcolor: action.hover,
    },
  };
  const dialogBtnPrimary = {
    fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none",
    boxShadow: `0 4px 12px ${withAlpha(drsColors.primary, 0.25)}`,
  };

  return (
    <HBox>
      <HBox sx={{ display: "flex", flexDirection: "column" }}>
          <HBox
            sx={{
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${border.divider}`,
            }}
          >
            <HBreadCrumb />
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
              <IconButton
                onClick={() => navigate("/homelayout/users")}
                size="small"
                sx={{
                  color: text.secondary,
                  borderRadius: "8px",
                  border: `1px solid ${border.divider}`,
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <TitleBar
                title={intl.formatMessage({
                  id: "label.federation.upload",
                  defaultMessage: "Upload and Sync Federation Users",
                })}
              />
            </HBox>

            {federations.length > 0 && (
              <Chip
                icon={<FiUsers size={13} style={{ marginLeft: 6 }} />}
                label={intl.formatMessage(
                  { id: "label.federation.count", defaultMessage: "{count} {count, plural, one {Federation} other {Federations}}" },
                  { count: federations.length }
                )}
                size="small"
                sx={{
                  color: theme.palette.text.primary,
                  
                  fontWeight: 600,
                  fontSize: 12,
                  border: `1px solid ${withAlpha(drsColors.primary, 0.2)}`,
                }}
              />
            )}
          </HBox>

          {/* ── Federations table ── */}
          <HBox
            sx={{
              px: 3,
              py: 2.5,
              borderBottom: `1px solid ${border.divider}`,
              bgcolor: surfaces.paper,
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <HLabel
              value="label.federation.userprovider"
              translate={true}
              colon={false}
              align="left"
              sx={{ fontWeight: 700, fontSize: 15, color: text.primary, mb: 1.5 }}
            />

            {federations.length > 0 ? (
              <HAgGrid
                rowData={federations}
                columnDefs={federationsColDefs}
                gridStyle={{
                  width: "100%",
                  border: `1px solid ${border.divider}`,
                  borderRadius: "10px",
                }}
                gridClassName="drs-list-grid"
                pagination
                paginationPageSize={5}
                defaultColDef={defaultColDef}
                domLayout="autoHeight"
              />
            ) : (
              <HLabel
                value="label.federation.unavailable"
                translate={true}
                colon={false}
                align="left"
                sx={{ fontSize: 13, color: "text.disabled" }}
              />
            )}
          </HBox>

          {/* ── Upload section ── */}
          <HBox sx={{ px: 3, py: 2.5, flexDirection: "column", alignItems: "stretch" }}>
            <HLabel
              value="label.federation.excel"
              translate={true}
              colon={false}
              align="left"
              sx={{ fontWeight: 700, fontSize: 15, color: text.primary, mb: 0.5 }}
            />
            <HLabel
              value="label.federation.select.excel"
              translate={true}
              colon={false}
              align="left"
              sx={{ fontSize: 13, color: text.secondary, mb: 2 }}
            />

            <SampleTemplateSection
              fileName="LDAP_FEDERATION_USER_UPLOAD_TEMPLATE_V1.xlsx"
              templateLabel={intl.formatMessage({ id: "label.federation.templateLabel", defaultMessage: "LDAP Federation User Upload Template" })}
              onDownload={handleDownloadSample}
              description={intl.formatMessage({ id: "label.federation.templateDesc", defaultMessage: "Download the federation user template, populate usernames and roles, then upload the file below." })}
            />

            {!canUpload && (
              <HLabel
                value="label.federation.noProvidersConfigured"
                translate={true}
                colon={false}
                align="left"
                sx={{ fontSize: 13, color: colors.accent, mb: 2, fontWeight: 600 }}
              />
            )}

            <HBox
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
                opacity: canUpload ? 1 : 0.55,
              }}
            >
              <HButton
                variant="outlined"
                disabled={!canUpload}
                startIcon={<FiUpload size={14} />}
                onClick={handleBrowseClick}
                label="label.federation.browse"
              />
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".xlsx,.xls"
                disabled={!canUpload}
                onChange={handleFileSelect}
              />

              <HButton
                variant="outlined"
                onClick={handleClearFile}
                disabled={!canUpload || !selectedFile}
                label="label.federation.clear"
              />

              <HLabel
                value={selectedFile ? selectedFile.name : "label.federation.file.unselected"}
                translate={true}
                colon={false}
                align="left"
                sx={{
                  fontSize: 13,
                  color: selectedFile ? text.primary : text.tertiary,
                  flexGrow: 1,
                  fontStyle: selectedFile ? "normal" : "italic",
                }}
              />

              <HButton
                onClick={handleUpload}
                disabled={!canUpload || !selectedFile || isUploading}
                variant="contained"
                label={isUploading ? "label.federation.validating" : "label.federation.validate"}
                startIcon={
                  isUploading ? (
                    <CircularProgress size={14} sx={{ color: "#fff" }} />
                  ) : (
                    <MdCloudUpload size={16} />
                  )
                }
                sx={{ ...dialogBtnPrimary, px: 3 }}
              />
            </HBox>
          </HBox>
      </HBox>

      {/* ── Preview / Synced Dialog ── */}
      <HDialog
        disableContentWrapper
        open={dialogOpen}
        onClose={handleDialogClose(setDialogOpen)}
        maxWidth="md"
        fullWidth
        title={
          Object.keys(syncedUsers).length > 0
            ? intl.formatMessage(
                { id: "label.federation.syncedUsersTitle", defaultMessage: "Synced Users from {fileName} (Providers: {providersCount}, Total: {totalCount})" },
                { fileName: selectedFile?.name ?? "", providersCount: Object.keys(syncedUsers).length, totalCount: totalSyncedUsers }
              )
            : intl.formatMessage(
                { id: "label.federation.previewUsersTitle", defaultMessage: "Preview Users from {fileName}" },
                { fileName: selectedFile?.name ?? "" }
              )
        }
        titleSx={dialogTitleSx}
        actions={
          Object.keys(syncedUsers).length === 0 ? (
            <>
              <HButton
                variant="outlined"
                onClick={() => setDialogOpen(false)}
                label="label.federation.close"
                sx={dialogBtnOutlined}
              />
              <HButton
                variant="contained"
                onClick={() => setConfirmOpen(true)}
                label="label.federation.submit"
                sx={dialogBtnPrimary}
              />
            </>
          ) : (
            <HButton
              variant="outlined"
              onClick={() => setDialogOpen(false)}
              label="label.federation.close"
              sx={dialogBtnOutlined}
            />
          )
        }
        slotProps={{ paper: dialogPaperProps }}
      >
        <DialogContent sx={{ pt: 2 }}>
          {Object.keys(syncedUsers).length > 0 ? (
            <HAgGrid
              rowData={syncedRows}
              columnDefs={syncedColDefs}
              gridStyle={{
                width: "100%",
                border: `1px solid ${border.divider}`,
                borderRadius: "10px",
              }}
              gridClassName="drs-list-grid"
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          ) : (
            <HAgGrid
              rowData={validatedRows}
              columnDefs={previewColDefs}
              gridStyle={{
                width: "100%",
                border: `1px solid ${border.divider}`,
                borderRadius: "10px",
              }}
              gridClassName="drs-list-grid"
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
            />
          )}
        </DialogContent>
      </HDialog>

      {/* ── Confirm Save Dialog ── */}
      <HDialog
        disableContentWrapper
        open={confirmOpen}
        onClose={handleDialogClose(setConfirmOpen)}
        title={intl.formatMessage({ id: "label.federation.confirmSync", defaultMessage: "Confirm Sync" })}
        titleSx={dialogTitleSx}
        actions={
          <>
          <HButton
            variant="outlined"
            onClick={() => setConfirmOpen(false)}
            label="label.federation.cancel"
            sx={dialogBtnOutlined}
          />
          <HButton
            variant="contained"
            onClick={handleConfirmSave}
            disabled={isConfirming}
            label={isConfirming ? "label.federation.processing" : "label.federation.confirm"}
            startIcon={
              isConfirming && (
                <CircularProgress size={14} sx={{ color: "#fff" }} />
              )
            }
            sx={dialogBtnPrimary}
          />
          </>
        }
        slotProps={{ paper: dialogPaperProps }}
      >
        <DialogContent sx={{ pt: 2.5 }}>
          <DialogContentText
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: text.secondary,
            }}
          >
            {intl.formatMessage({ id: "label.federation.confirmSyncMsg", defaultMessage: "Only valid users will be synced. Are you sure you want to sync all valid users?" })}
          </DialogContentText>
        </DialogContent>
      </HDialog>
    </HBox>
  );
};

export default UploadFederationUsers;
