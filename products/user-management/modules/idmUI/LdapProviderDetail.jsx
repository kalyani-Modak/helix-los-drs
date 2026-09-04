import { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Container,
  MenuItem,
  CircularProgress,
  Menu, Tooltip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Chip, Card, CardContent, useTheme} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoIcon from "@mui/icons-material/Info";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync";
import KeyIcon from "@mui/icons-material/Key";
import CachedIcon from "@mui/icons-material/Cached";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";
import { useIntl } from "react-intl";
import { FiServer, FiAlertTriangle } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HButton, HDropdown, HTextField, HToggle, HAgGrid, useToast, HDialog } from "@helix/component-library";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const colors = {
  primary: '#0378A6', secondary: '#8dbf41', accent: '#bf0404',
  primaryLight: '#4aa3d9', primaryDark: '#025a8c', accentDark: '#a30404',
  bg: { page: 'linear-gradient(145deg,#f8fafc 0%,#f1f5f9 100%)', surface: '#f8fafc', input: '#fff' },
  card: 'rgba(255,255,255,0.99)',
  text: { primary: '#0f172a', secondary: '#334155', light: '#64748b', muted: '#94a3b8' },
  border: '#e2e8f0', hover: '#f1f5f9',
};

const fieldSx = {
  '& .MuiInputBase-root': { fontFamily: "'Inter',sans-serif", fontSize: 13, borderRadius: '6px', backgroundColor: colors.bg.input },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryLight },
  '& .MuiInputLabel-root': { fontFamily: "'Inter',sans-serif", fontSize: 12 },
  '& .MuiOutlinedInput-input': { padding: '7px 10px', fontSize: 13 },
};
const roFieldSx = { ...fieldSx, '& .MuiInputBase-root': { ...fieldSx['& .MuiInputBase-root'], backgroundColor: colors.bg.surface } };
const labelSx = { fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, mb: 0.6, display: 'block' };

const primaryBtnSx = {
  textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600,
  borderRadius: '6px', px: 2.5, py: 0.55, fontSize: 12,
  boxShadow: '0 2px 8px rgba(3,120,166,0.28)',
};
const outlinedBtnSx = {
  textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600,
  borderRadius: '6px', px: 2.5, py: 0.55, fontSize: 12,
};
const cancelBtnSx = {
  textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600,
  borderRadius: '6px', px: 2.5, py: 0.55, fontSize: 12,
};
const dangerBtnSx = {
  textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600,
  borderRadius: '6px', px: 2.5, py: 0.55, fontSize: 12,
};
const neutralBtnSx = {
  textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600,
  borderRadius: '6px', px: 2.5, py: 0.55, fontSize: 12,
};
const cardBaseSx = {
  borderRadius: '10px', backgroundColor: colors.card, border: `1px solid ${colors.border}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 2px 8px rgba(3,120,166,0.05)',
};

// ─── Reusable field components ────────────────────────────────────────────────
const CF = ({ label, value = "", readOnly = false, onChange = null, tooltip = null, required = false, translate = true, color }) => (
  <HBox sx={{ mb: 1.8, background: 'transparent' }}>
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.6, background: 'transparent' }}>
      <HLabel value={label} translate={translate} required={required} align="left" colon={false} sx={labelSx} />
      {tooltip && <Tooltip title={tooltip} arrow><InfoIcon sx={{ fontSize: 13, color: color, cursor: "help" }} /></Tooltip>}
    </HBox>
    <HTextField
      value={value}
      onChange={e => onChange?.(e.target.value)}
      disabled={readOnly}
      editable={!readOnly}
      required={required}
      width="100%"
    />
  </HBox>
);
CF.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), readOnly: PropTypes.bool, onChange: PropTypes.func, tooltip: PropTypes.string, required: PropTypes.bool, translate: PropTypes.bool };

const TF = ({ label, checked = false, onChange, tooltip = null, translate = true, color }) => (
  <HBox sx={{ mb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", px: 1.2, py: 0.8, borderRadius: '6px', background: 'transparent' }}>
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.6, background: 'transparent' }}>
      <HLabel value={label} translate={translate} colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, color }} />
      {tooltip && <Tooltip title={tooltip} arrow><InfoIcon sx={{ fontSize: 13, color: colors.text.muted, cursor: "help" }} /></Tooltip>}
    </HBox>
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.8, background: 'transparent' }}>
      <HToggle
        label={checked ? "ON" : "OFF"}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        size="small"
      />
    </HBox>
  </HBox>
);
TF.propTypes = { label: PropTypes.string.isRequired, checked: PropTypes.bool, onChange: PropTypes.func.isRequired, tooltip: PropTypes.string, translate: PropTypes.bool };

const SF = ({ label, value = "", options = [], onChange = null, tooltip = null, required = false, translate = true, color='#000000' }) => (
  <HBox sx={{ mb: 1.8, background: 'transparent' }}>
    <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.6, background: 'transparent' }}>
      <HLabel value={label} translate={translate} required={required} colon={false} sx={labelSx} />
      {tooltip && <Tooltip title={tooltip} arrow><InfoIcon sx={{ fontSize: 13, color: color, cursor: "help" }} /></Tooltip>}
    </HBox>
    <HDropdown
      value={value}
      onChange={e => onChange?.(e.target.value)}
      options={options}
      width="100%"
    />
  </HBox>
);
SF.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), options: PropTypes.array, onChange: PropTypes.func, tooltip: PropTypes.string, required: PropTypes.bool, translate: PropTypes.bool };

// ─── Gradient dialog title ────────────────────────────────────────────────────
const GDT = ({ children, onClose }) => (
  <DialogTitle sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, px: 2.5, py: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {children}
    {onClose && <IconButton size="small" onClick={onClose} sx={{ borderRadius: '6px', width: 24, height: 24 }}><MdClose size={13} /></IconButton>}
  </DialogTitle>
);

// ─── Section card definitions ─────────────────────────────────────────────────
const SECTIONS = [
  { key: 'connection',    label: 'ldapProvider.section.connection',      icon: LinkIcon,   bg: '#ffffff', iconColor: '#0378A6', bullets: ['ldapProvider.bullet.connection.1', 'ldapProvider.bullet.connection.2', 'ldapProvider.bullet.connection.3'] },
  { key: 'sync_kerberos', label: 'ldapProvider.section.syncKerberos', icon: SyncIcon,   bg: '#ffffff', iconColor: '#5a8c20', bullets: ['ldapProvider.bullet.sync.1', 'ldapProvider.bullet.sync.2', 'ldapProvider.bullet.sync.3', 'ldapProvider.bullet.sync.4'] },
  { key: 'searching',     label: 'ldapProvider.section.searching',  icon: SearchIcon, bg: '#ffffff', iconColor: '#338059', bullets: ['ldapProvider.bullet.search.1', 'ldapProvider.bullet.search.2', 'ldapProvider.bullet.search.3'] },
  { key: 'auth',          label: 'ldapProvider.section.auth',  icon: KeyIcon,    bg: '#ffffff', iconColor: '#a17841', bullets: ['ldapProvider.bullet.auth.1', 'ldapProvider.bullet.auth.2', 'ldapProvider.bullet.auth.3'] },
  { key: 'cache',         label: 'ldapProvider.section.cache',           icon: CachedIcon, bg: '#ffffff', iconColor: '#bf0404', bullets: ['ldapProvider.bullet.cache.1', 'ldapProvider.bullet.cache.2', 'ldapProvider.bullet.cache.3'] },
  { key: 'advanced',      label: 'ldapProvider.section.advanced',      icon: TuneIcon,   bg: '#ffffff', iconColor: '#0378A6', bullets: ['ldapProvider.bullet.advanced.1', 'ldapProvider.bullet.advanced.2', 'ldapProvider.bullet.advanced.3'] },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const LdapProviderDetail = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const theme = useTheme();
  const isCreate = providerId === "new";

  // ── State ─────────────────────────────────────────────────────────────────
  const [ldapProvider, setLdapProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unsavedConfirmOpen, setUnsavedConfirmOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Mappers state
  const [mappers, setMappers] = useState([]);
  const [loadingMappers, setLoadingMappers] = useState(false);
  const [searchMappers, setSearchMappers] = useState("");
  const [mapperTypes, setMapperTypes] = useState([]);
  const [loadingMapperTypes, setLoadingMapperTypes] = useState(false);
  const [mapperTypeDialogOpen, setMapperTypeDialogOpen] = useState(false);
  const [mapperActionAnchor, setMapperActionAnchor] = useState(null);
  const [selectedMapperForDelete, setSelectedMapperForDelete] = useState(null);
  const [mapperDeleteConfirmOpen, setMapperDeleteConfirmOpen] = useState(false);

  // Connection test state
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingAuthentication, setTestingAuthentication] = useState(false);
  const testConnectionRef = useRef(false);
  const testAuthRef = useRef(false);

  // Which section popup is open — null means none
  // Opening a popup does NOT trigger a save. It's just a UI panel for editing formData.
  const [activeSection, setActiveSection] = useState(null);

  // Tab: 0 = Settings, 1 = Mappers
  const [activeTab, setActiveTab] = useState(0);

  // For create mode: show general options popup automatically
  const [createDialogOpen, setCreateDialogOpen] = useState(isCreate);

  // Single source of truth for all form data
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [providerName, setProviderName] = useState("");
  const [originalProviderName, setOriginalProviderName] = useState("");

  const tips = {
    connectionUrl: "The LDAP server connection URL",
    vendor: "The LDAP vendor type",
    startTls: "Enable StartTLS for secure connection",
    useTruststoreSpi: "Use the truststore SPI",
    connectionPooling: "Enable connection pooling",
    usersDn: "The base DN where users are located",
    usernameLDAPAttribute: "The LDAP attribute that maps to username",
    importEnabled: "Allow importing users from LDAP",
  };

  const objMappersColDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({ id: "ldapProvider.field.displayName", defaultMessage: "Name" }),
        field: "name",
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => {
          const mapper = params.data;
          if (!mapper) return null;
          return (
            <HBox sx={{ display: 'flex', alignItems: 'center', height: '100%', background: 'transparent' }}>
              <span
                onClick={() => navigate(`/homelayout/ldap-providers/${providerId}/mappers/${mapper.id}`)}
                style={{
                  fontFamily: "'Inter',sans-serif",
                  fontWeight: 700,
                  fontSize: '13px',
                  color: colors.primary,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                {mapper.name}
              </span>
            </HBox>
          );
        }
      },
      {
        headerName: intl.formatMessage({ id: "ldapProvider.field.vendor", defaultMessage: "Type" }),
        field: "providerId",
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => {
          const mapper = params.data;
          if (!mapper) return null;
          return (
            <HBox sx={{ display: 'flex', alignItems: 'center', height: '100%', background: 'transparent' }}>
              <Chip
                label={mapper.providerId}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 12,
                  fontFamily: "'Inter',sans-serif",
                  borderRadius: '6px',
                  background: `${colors.primary}10`,
                  color: colors.primary,
                  border: `1px solid ${colors.primary}22`,
                  fontWeight: 600,
                  '& .MuiChip-label': { px: '8px' }
                }}
              />
            </HBox>
          );
        }
      },
      {
        headerName: "",
        field: "actions",
        minWidth: 60,
        maxWidth: 80,
        cellRenderer: (params) => {
          const mapper = params.data;
          if (!mapper) return null;
          return (
            <HBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', background: 'transparent' }}>
              <IconButton
                size="small"
                onClick={e => {
                  setMapperActionAnchor(e.currentTarget);
                  setSelectedMapperForDelete(mapper);
                }}
                sx={{
                  width: 24,
                  height: 24,
                  color: theme.palette.text.secondary,
                  '&:hover': { color: colors.primary, background: `${colors.primary}10` }
                }}
              >
                <MoreVertIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </HBox>
          );
        },
        cellStyle: { display: "flex", justifyContent: "center", alignItems: "center" },
        sortable: false,
        filter: false,
      }
    ],
    [navigate, providerId, intl]
  );

  // ── Load provider ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isCreate) {
      const dc = { enabled:["true"],vendor:["ad"],connectionUrl:[""],startTls:["false"],useTruststoreSpi:["always"],connectionPooling:["false"],connectionTimeout:[""],authType:["simple"],bindDn:[""],bindCredential:[""],editMode:["UNSYNCED"],usersDn:[""],usernameLDAPAttribute:["cn"],rdnLDAPAttribute:["cn"],uuidLDAPAttribute:["objectGUID"],userObjectClasses:["person, organizationalPerson, user"],customUserSearchFilter:[""],searchScope:["1"],readTimeout:[""],pagination:["true"],referral:[""],importEnabled:["true"],syncRegistrations:["false"],batchSizeForSync:[""],allowKerberosAuthentication:["false"],useKerberosForPasswordAuthentication:["false"],cachePolicy:["DEFAULT"],usePasswordModifyExtendedOp:["false"],validatePasswordPolicy:["false"],trustEmail:["false"],connectionTrace:["false"],changedSyncPeriod:["-1"],fullSyncPeriod:["-1"] };
      setLdapProvider({ name: "", config: dc });
      setFormData(dc);
      setOriginalData(structuredClone(dc));
      setLoading(false);
    } else {
      (async () => {
        try {
          const r = await HAxiosService.GET(`${UserManagementAPI.fetch_ldap_providers()}/${providerId}`);
          if (r.data) {
            setLdapProvider(r.data);
            setFormData(r.data.config || {});
            setOriginalData(structuredClone(r.data.config || {}));
            setProviderName(r.data.name || "");
            setOriginalProviderName(r.data.name || "");
          }
        } catch { toast.error(intl.formatMessage({ id: "ldapProvider.toast.loadFailed", defaultMessage: "Failed to load LDAP provider details." })); }
        finally { setLoading(false); }
      })();
    }
  }, [providerId]);

  // Track dirty state — just checks if anything in formData or name changed vs original
  useEffect(() => {
    setHasChanges(
      JSON.stringify(formData) !== JSON.stringify(originalData) ||
      providerName !== originalProviderName
    );
  }, [formData, originalData, providerName, originalProviderName]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const gv = k => { const v = formData[k]; return Array.isArray(v) ? v[0] || "" : v || ""; };
  const gb = k => { const v = formData[k]; return Array.isArray(v) ? v[0] === "true" : v === "true" || v === true; };

  // These only update local state — NO API call
  const hi = (f, v) => setFormData(p => ({ ...p, [f]: [v] }));
  const ht = (f, c) => setFormData(p => ({ ...p, [f]: [c ? "true" : "false"] }));

  // ── Single global save — fires ONE API call ───────────────────────────────
  const handleSave = async () => {
    if (!hasChanges && !isCreate) { toast.info(intl.formatMessage({ id: "ldapProvider.toast.noChanges", defaultMessage: "No changes to save." })); return; }
    if (isCreate && !providerName.trim()) { toast.error(intl.formatMessage({ id: "ldapProvider.toast.nameRequired", defaultMessage: "Provider name is required." })); return; }

    setSaving(true);
    try {
      const payload = { name: providerName, config: formData };

      if (isCreate) {
        await HAxiosService.POST(UserManagementAPI.fetch_ldap_providers(), payload);
        toast.success(intl.formatMessage({ id: "ldapProvider.toast.created", defaultMessage: "LDAP provider created." }));
        setTimeout(() => navigate("/homelayout/ldap-providers"), 1000);
      } else {
        await HAxiosService.PUT(
          `${UserManagementAPI.fetch_ldap_providers()}/${providerId}`,
          { ...ldapProvider, ...payload }
        );
        toast.success(intl.formatMessage({ id: "ldapProvider.toast.saved", defaultMessage: "Settings saved." }));

        // Sync original state so hasChanges resets to false
        setOriginalData(structuredClone(formData));
        setOriginalProviderName(providerName);
        setLdapProvider(p => ({ ...p, name: providerName }));

        // Refetch to stay in sync
        try {
          const r = await HAxiosService.GET(`${UserManagementAPI.fetch_ldap_providers()}/${providerId}`);
          if (r.data) {
            setLdapProvider(r.data);
            setFormData(r.data.config || {});
            setOriginalData(structuredClone(r.data.config || {}));
            setProviderName(r.data.name || "");
            setOriginalProviderName(r.data.name || "");
          }
        } catch (e) { console.warn("Refetch warning", e); }
      }
    } catch { toast.error(intl.formatMessage({ id: "ldapProvider.toast.saveFailed", defaultMessage: "Failed to save LDAP provider." })); }
    finally { setSaving(false); }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteConfirmOpen(false); setSaving(true);
    try {
      const response = await HAxiosService.DELETE(`${UserManagementAPI.fetch_ldap_providers()}/${providerId}`);
      if (isApiSuccess(response)) {
        toast.success(getApiMsg(response, intl.formatMessage({ id: "ldapProvider.toast.deleted", defaultMessage: "Provider deleted." })));
        setTimeout(() => navigate("/homelayout/ldap-providers"), 1000);
      } else {
        toast.error(getApiMsg(response, intl.formatMessage({ id: "ldapProvider.toast.deleteFailed", defaultMessage: "Failed to delete provider." })));
      }
    } catch { toast.error(intl.formatMessage({ id: "ldapProvider.toast.deleteFailed", defaultMessage: "Failed to delete provider." })); }
    finally { setSaving(false); }
  };

  const handleMapperDelete = async () => {
    if (!selectedMapperForDelete) return;
    setMapperDeleteConfirmOpen(false); setSaving(true);
    try {
      const response = await HAxiosService.DELETE(UserManagementAPI.ldap_mapper_by_id(providerId, selectedMapperForDelete.id));
      if (isApiSuccess(response)) {
        toast.success(getApiMsg(response, intl.formatMessage({ id: "ldapProvider.toast.mapperDeleted", defaultMessage: "Mapper deleted." })));
        setSelectedMapperForDelete(null);
        fetchMappers();
      } else {
        toast.error(getApiMsg(response, intl.formatMessage({ id: "ldapProvider.toast.mapperDeleteFailed", defaultMessage: "Failed to delete mapper." })));
      }
    } catch (e) { toast.error(e.response?.data?.message || intl.formatMessage({ id: "ldapProvider.toast.mapperDeleteFailed", defaultMessage: "Failed to delete mapper." })); }
    finally { setSaving(false); }
  };

  // ── Mappers ───────────────────────────────────────────────────────────────
  const fetchMappers = async () => {
    setLoadingMappers(true);
    try {
      const r = await HAxiosService.GET(UserManagementAPI.fetch_ldap_mappers(providerId));
      setMappers(r.data || []);
    } catch { toast.error(intl.formatMessage({ id: "ldapProvider.toast.loadMappersFailed", defaultMessage: "Failed to load mappers." })); }
    finally { setLoadingMappers(false); }
  };

  const fetchMapperTypes = async () => {
    setLoadingMapperTypes(true);
    try {
      const r = await HAxiosService.GET(UserManagementAPI.fetch_ldap_mapper_types(providerId));
      setMapperTypes(r.data || []);
    } catch { toast.error(intl.formatMessage({ id: "ldapProvider.toast.loadMapperTypesFailed", defaultMessage: "Failed to load mapper types." })); }
    finally { setLoadingMapperTypes(false); }
  };

  // ── Test connection/auth ──────────────────────────────────────────────────
  const handleTestConnection = async () => {
    if (testConnectionRef.current) return;
    testConnectionRef.current = true; setTestingConnection(true);
    try {
      const r = await HAxiosService.GET(UserManagementAPI.test_ldap_connection({ connectionUrl: gv("connectionUrl"), bindDn: gv("bindDn"), bindCredential: gv("bindCredential"), useTruststoreSpi: gv("useTruststoreSpi"), connectionTimeout: gv("connectionTimeout"), startTls: gv("startTls"), authType: gv("authType"), action: "testConnection", componentId: providerId }));
      if (isApiSuccess(r)) toast.success(intl.formatMessage({ id: "ldapProvider.toast.connectionSuccess", defaultMessage: "Connection successful!" }));
    } catch (e) { toast.error(e?.response?.data?.message || intl.formatMessage({ id: "ldapProvider.toast.connectionFailed", defaultMessage: "Failed to test connection." })); }
    finally { setTestingConnection(false); testConnectionRef.current = false; }
  };

  const handleTestAuthentication = async () => {
    if (testAuthRef.current) return;
    testAuthRef.current = true; setTestingAuthentication(true);
    try {
      const r = await HAxiosService.GET(UserManagementAPI.test_ldap_connection({ connectionUrl: gv("connectionUrl"), bindDn: gv("bindDn"), bindCredential: gv("bindCredential"), useTruststoreSpi: gv("useTruststoreSpi"), connectionTimeout: gv("connectionTimeout"), startTls: gv("startTls"), authType: gv("authType"), action: "testAuthentication", componentId: providerId }));
      if (isApiSuccess(r)) toast.success(intl.formatMessage({ id: "ldapProvider.toast.authSuccess", defaultMessage: "Authentication successful!" }));
    } catch (e) { toast.error(e?.response?.data?.message || intl.formatMessage({ id: "ldapProvider.toast.authFailed", defaultMessage: "Failed to test authentication." })); }
    finally { setTestingAuthentication(false); testAuthRef.current = false; }
  };

  // ── Open section popup (mappers also loads data) ──────────────────────────
  const openSection = async (key) => {
    setActiveSection(key);
  };

  // Load mappers when switching to Mappers tab
  useEffect(() => {
    if (activeTab === 1 && !isCreate) fetchMappers();
  }, [activeTab]);

  // ── Section content (edits formData only, never calls API) ────────────────
  const renderSectionContent = (key) => {
    switch (key) {
      case 'connection': return (
        <HBox sx={{ pt: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <CF label="ldapProvider.field.connectionUrl" value={gv("connectionUrl")} tooltip={tips.connectionUrl} onChange={v => hi("connectionUrl", v)} required color={theme.palette.text.secondary}/>
          <TF label="ldapProvider.field.startTls" checked={gb("startTls")} tooltip={tips.startTls} onChange={c => ht("startTls", c)} color={theme.palette.text.secondary}/>
          <SF label="ldapProvider.field.useTruststoreSpi" value={gv("useTruststoreSpi")} tooltip={tips.useTruststoreSpi} options={[{ value: "always", label: "Always" }, { value: "never", label: "Never" }]} onChange={v => hi("useTruststoreSpi", v)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.connectionPooling" checked={gb("connectionPooling")} onChange={c => ht("connectionPooling", c)} color={theme.palette.text.secondary} />
          <CF label="ldapProvider.field.connectionTimeout" value={gv("connectionTimeout")} onChange={v => hi("connectionTimeout", v)} color={theme.palette.text.secondary}/>
          <HButton variant="outlined" size="small" onClick={handleTestConnection} loading={testingConnection} label="ldapProvider.button.testConnection" sx={{ ...outlinedBtnSx, mt: 0.5 }} />
        </HBox>
      );
      case 'auth': return (
        <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <SF label="ldapProvider.field.authType" value={gv("authType")} options={[{ value: "simple", label: "simple" }, { value: "none", label: "none" }]} onChange={v => hi("authType", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.bindDn" value={gv("bindDn")} onChange={v => hi("bindDn", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.bindCredential" value={gv("bindCredential")} onChange={v => hi("bindCredential", v)} color={theme.palette.text.secondary} required />
          <HButton variant="outlined" size="small" onClick={handleTestAuthentication} loading={testingAuthentication} label="ldapProvider.button.testAuthentication" sx={{ ...outlinedBtnSx, mt: 0.5 }} />
        </HBox>
      );
      case 'searching': return (
        <HBox sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px', pt: 1, background: 'transparent' }}>
          <SF label="ldapProvider.field.editMode" value={gv("editMode")} options={[{ value: "UNSYNCED", label: "UNSYNCED" }, { value: "READ_ONLY", label: "READ_ONLY" }, { value: "WRITABLE", label: "WRITABLE" }]} onChange={v => hi("editMode", v)} color={theme.palette.text.secondary} />
          <CF label="ldapProvider.field.usersDn" value={gv("usersDn")} tooltip={tips.usersDn} onChange={v => hi("usersDn", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.usernameLDAPAttribute" value={gv("usernameLDAPAttribute")} tooltip={tips.usernameLDAPAttribute} onChange={v => hi("usernameLDAPAttribute", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.rdnLDAPAttribute" value={gv("rdnLDAPAttribute")} onChange={v => hi("rdnLDAPAttribute", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.uuidLDAPAttribute" value={gv("uuidLDAPAttribute")} onChange={v => hi("uuidLDAPAttribute", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.userObjectClasses" value={gv("userObjectClasses")} onChange={v => hi("userObjectClasses", v)} color={theme.palette.text.secondary} required />
          <CF label="ldapProvider.field.customUserSearchFilter" value={gv("customUserSearchFilter")} onChange={v => hi("customUserSearchFilter", v)} color={theme.palette.text.secondary} />
          <SF label="ldapProvider.field.searchScope" value={gv("searchScope")} options={[{ value: "1", label: intl.formatMessage({ id: "ldapProvider.searchScope.oneLevel", defaultMessage: "One Level" }) }, { value: "2", label: intl.formatMessage({ id: "ldapProvider.searchScope.subtree", defaultMessage: "Subtree" }) }]} onChange={v => hi("searchScope", v)} color={theme.palette.text.secondary} />
          <CF label="ldapProvider.field.readTimeout" value={gv("readTimeout")} onChange={v => hi("readTimeout", v)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.pagination" checked={gb("pagination")} onChange={c => ht("pagination", c)} color={theme.palette.text.secondary} />
          <CF label="ldapProvider.field.referral" value={gv("referral")} onChange={v => hi("referral", v)} color={theme.palette.text.secondary} />
        </HBox>
      );
      case 'sync_kerberos': return (
        <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <HLabel value="ldapProvider.header.connection" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 11, color: theme.palette.text.primary, textTransform: 'uppercase', letterSpacing: 0.7, mb: 1.2 }} />
          <TF label="ldapProvider.field.importEnabled" checked={gb("importEnabled")} tooltip={tips.importEnabled} onChange={c => ht("importEnabled", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.syncRegistrations" checked={gb("syncRegistrations")} onChange={c => ht("syncRegistrations", c)} color={theme.palette.text.secondary} />
          <CF label="ldapProvider.field.batchSizeForSync" value={gv("batchSizeForSync")} onChange={v => hi("batchSizeForSync", v)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.periodicFullSync" checked={gb("fullSyncPeriod")} onChange={c => ht("fullSyncPeriod", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.periodicChangedSync" checked={gb("changedSyncPeriod")} onChange={c => ht("changedSyncPeriod", c)} color={theme.palette.text.secondary} />
          <Divider sx={{ my: 2 }} />
          <HLabel value="ldapProvider.header.kerberos" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 11, color: theme.palette.text.primary, textTransform: 'uppercase', letterSpacing: 0.7, mb: 1.2 }} />
          <TF label="ldapProvider.field.allowKerberosAuthentication" checked={gb("allowKerberosAuthentication")} onChange={c => ht("allowKerberosAuthentication", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.useKerberosForPasswordAuthentication" checked={gb("useKerberosForPasswordAuthentication")} onChange={c => ht("useKerberosForPasswordAuthentication", c)} color={theme.palette.text.secondary}/>
        </HBox>
      );
      case 'cache': return (
        <SF label="ldapProvider.field.cachePolicy" value={gv("cachePolicy")} options={[{ value: "DEFAULT", label: "DEFAULT" }, { value: "EVICT_DAILY", label: "EVICT_DAILY" }, { value: "EVICT_WEEKLY", label: "EVICT_WEEKLY" }, { value: "MAX_LIFESPAN", label: "MAX_LIFESPAN" }]} onChange={v => hi("cachePolicy", v)} color={theme.palette.text.secondary} />
      );
      case 'advanced': return (
        <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
          <TF label="ldapProvider.field.usePasswordModifyExtendedOp" checked={gb("usePasswordModifyExtendedOp")} onChange={c => ht("usePasswordModifyExtendedOp", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.validatePasswordPolicy" checked={gb("validatePasswordPolicy")} onChange={c => ht("validatePasswordPolicy", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.trustEmail" checked={gb("trustEmail")} onChange={c => ht("trustEmail", c)} color={theme.palette.text.secondary} />
          <TF label="ldapProvider.field.connectionTrace" checked={gb("connectionTrace")} onChange={c => ht("connectionTrace", c)} color={theme.palette.text.secondary}/>
          <HButton variant="outlined" size="small" label="ldapProvider.button.queryExtensions" sx={{ ...outlinedBtnSx, mt: 0.5 }} />
        </HBox>
      );
      case 'mappers': return renderMappersContent();
      default: return null;
    }
  };

  // ── Mappers table ─────────────────────────────────────────────────────────
  const renderMappersContent = () => {
    const filtered = mappers.filter(m => m.name.toLowerCase().includes(searchMappers.toLowerCase()));
    return (
      <HBox sx={{ display: 'flex', flexDirection: 'column' }}>
        <HBox sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: { xs: 'stretch', sm: 'center' }, flexWrap: 'wrap', mb: 2 }}>
          <HTextField 
            placeholder="ldapProvider.header.searchMappers" 
            value={searchMappers} 
            onChange={e => setSearchMappers(e.target.value)} 
            width="100%" 
            translate={true}
            sx={{ flex: 1, minWidth: 180 }} 
          />
          <HBox sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
            <HButton variant="contained" onClick={async () => { await fetchMapperTypes(); setMapperTypeDialogOpen(true); }} label="ldapProvider.button.addMapper" />
            <HButton variant="outlined" onClick={fetchMappers} label="ldapProvider.button.refresh" />
          </HBox>
        </HBox>
        {loadingMappers ? (
          <HBox sx={{ display: 'flex', justifyContent: 'center', py: 4, background: 'transparent' }}>
            <CircularProgress size={22} sx={{ color: colors.primary }} />
          </HBox>
        ) : (
          <HPaper
            variant="outlined"
            elevation={0}
            sx={{
              borderRadius: 2,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              p: 0,
              overflow: 'hidden',
              mb: 1
            }}
          >
            <HAgGrid
              rowData={filtered}
              columnDefs={objMappersColDefs}
              defaultColDef={{
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
              }}
              gridStyle={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                overflowX: "hidden",
                "--ag-borders": "none",
              }}
              embeddedInSection
              pagination
              paginationPageSize={5}
              gridClassName="drs-list-grid"
              overlayNoRowsTemplate={`<span class="ag-overlay-loading-center">${intl.formatMessage({ id: "ldapProvider.msg.noMappers", defaultMessage: "No mappers found." })}</span>`}
            />
          </HPaper>
        )}
        <Menu anchorEl={mapperActionAnchor} open={Boolean(mapperActionAnchor)} onClose={() => { setMapperActionAnchor(null); setSelectedMapperForDelete(null); }} slotProps={{ paper: { sx: { borderRadius: '8px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 130 } } }}>
          <MenuItem onClick={() => { setMapperDeleteConfirmOpen(true); setMapperActionAnchor(null); }}
            sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.accent, py: 0.9, '&:hover': { background: `${colors.accent}08` } }}
          >
            {intl.formatMessage({ id: "ldapProvider.button.delete", defaultMessage: "Delete" })}
          </MenuItem>
        </Menu>
      </HBox>
    );
  };

  if (loading) return (
    <HBox sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "300px", background: colors.bg.page, gap: 1.5 }}>
      <CircularProgress size={26} sx={{ color: colors.primary }} />
      <HLabel value="ldapProvider.msg.loading" translate={true} colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.text.muted }} />
    </HBox>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <HBox sx={{
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          py: 2,
          boxSizing: 'border-box',
        }}>
        

        <Container maxWidth="lg" sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
          }}>

          {/* ── Page header ── */}
          <div>
            <HBox sx={{ ...cardBaseSx, overflow: 'hidden', mb: 2.5, display: 'flex', flexDirection: 'column' }}>
              {/* Gradient wrapper — title row only */}
              <HBox sx={{ display: 'flex', flexDirection: 'column' }}>

                {/* Title row */}
                <HBox sx={{ px: 2.5, py: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5, background: 'transparent' }}>
                  <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1.2, background: 'transparent' }}>
                    <Tooltip title={intl.formatMessage({ id: "ldapProvider.msg.breadcrumbsProviders", defaultMessage: "LDAP Providers" })} placement="bottom">
                      <IconButton size="small" onClick={() => hasChanges ? setUnsavedConfirmOpen(true) : navigate("/homelayout/ldap-providers")}
                        sx={{ borderRadius: '6px', width: 28, height: 28 }}
                      >
                        <ArrowBackIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                    <HBox sx={{ width: 30, height: 30, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiServer size={15} />
                    </HBox>
                    <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                      <HLabel
                        value={isCreate ? "ldapProvider.header.newProvider" : (originalProviderName || "LDAP Provider")}
                        translate={isCreate}
                        colon={false}
                        align="left"
                        sx={{ fontWeight: 700, fontFamily: "'Inter',sans-serif", fontSize: 14, color: theme.palette.text.primary, textTransform: 'uppercase', letterSpacing: 0.8, lineHeight: 1.2 }}
                      />
                      {!isCreate && <HLabel value="ldapProvider.header.providerConfig" translate={true} colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: theme.palette.text.secondary, lineHeight: 1.2 }} />}
                    </HBox>
                  </HBox>

                  <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', background: 'transparent' }}>
                    {/* Enabled toggle */}
                    <HBox sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 1.2, height: 30, borderRadius: '6px', justifyContent: 'center' }}>
                      <HToggle label={gb("enabled") ? "label.authFlowDetails.requirement.enabled" : "label.authFlowDetails.requirement.disabled"} checked={gb("enabled")} onChange={e => ht("enabled", e.target.checked)} size="small" />
                    </HBox>

                    {/* Action menu (existing only) */}
                    {!isCreate && (
                      <>
                        <HButton variant="outlined" endIcon={<MoreVertIcon sx={{ fontSize: 13 }} />} onClick={e => setAnchorEl(e.currentTarget)} size="small"
                          label="ldapProvider.button.action"
                          sx={{ textTransform: 'none', fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 11, borderRadius: '6px', height: 30 }}
                        />
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { borderRadius: '8px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 130 } } }}>
                          <MenuItem onClick={() => { setAnchorEl(null); setDeleteConfirmOpen(true); }} disabled={saving}
                            sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.accent, py: 0.9, '&:hover': { background: `${colors.accent}08` } }}
                          >
                            {intl.formatMessage({ id: "ldapProvider.button.delete", defaultMessage: "Delete" })}
                          </MenuItem>
                        </Menu>
                        {/* Save button — aligned with Action & Enabled */}
                        <HButton
                          variant="contained"
                          onClick={handleSave}
                          loading={saving}
                          startIcon={saving ? null : <SaveIcon sx={{ fontSize: 13 }} />}
                          label={saving ? 'ldapProvider.button.saving' : 'ldapProvider.button.save'}
                          sx={{
                            textTransform: 'none',
                            fontFamily: "'Inter',sans-serif",
                            fontWeight: 600,
                            fontSize: 11,
                            borderRadius: '6px',
                            px: 2,
                            height: 30,
                            boxShadow: 'none',
                          }}
                        />
                      </>
                    )}
                  </HBox>
                </HBox>
              </HBox>

              {/* ── Tabs row — outside gradient, white background ── */}
              {!isCreate && (
                <HBox sx={{ px: 2.5, py: 1, borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {[
                    { label: 'ldapProvider.header.settings', defaultVal: 'Settings' },
                    { label: 'ldapProvider.header.mappers', defaultVal: 'Mappers' }
                  ].map((tab, i) => (
                    <HBox key={tab.label} onClick={() => setActiveTab(i)}
                      sx={{
                        px: 2, py: 0.4, cursor: 'pointer', fontSize: 12,
                        fontFamily: "'Inter',sans-serif", fontWeight: 600,
                        borderRadius: '20px',
                        border: `1.5px solid ${activeTab === i ? colors.primary : colors.border}`,
                        background: activeTab === i ? colors.primary : 'transparent',
                        color: activeTab === i ? '#fff' : colors.text.muted,
                        transition: 'all 0.18s ease',
                        userSelect: 'none',
                      }}
                    >
                      <HLabel value={tab.label} translate={true} colon={false} sx={{ color: 'inherit', fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', cursor: 'pointer' }} />
                    </HBox>
                  ))}
                </HBox>
              )}
            </HBox>
          </div>

          {/* ── Scrollable content area ── */}
          <HBox sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            py: 0.5,
            display: 'flex',
            flexDirection: 'column',
            '&::-webkit-scrollbar': { width: '5px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: `${colors.primary}35`, borderRadius: '99px' },
            '&::-webkit-scrollbar-thumb:hover': { background: `${colors.primary}65` },
          }}>

          {/* ── Section cards (existing provider only, Settings tab) ── */}
          {!isCreate && activeTab === 0 && (
            <HBox sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
              alignItems: 'stretch',
              background: 'transparent'
            }}>
              {SECTIONS.map((sec, idx) => {
                const IconComp = sec.icon;
                return (
                  <div key={sec.key}>
                    {(sec.key === 'cache' || sec.key === 'advanced' || sec.key === 'auth') ? (
                      <Card sx={{
                        borderRadius: '16px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}>
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                          {/* Icon badge + title */}
                          <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.8, background: 'transparent' }}>
                            <HBox sx={{ width: 38, height: 38, borderRadius: '10px', background: `${sec.iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconComp sx={{ color: sec.iconColor, fontSize: 20 }} />
                            </HBox>
                            <HLabel value={sec.label} translate={true} colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: theme.palette.text.primary }} />
                          </HBox>

                          {/* Cache inline */}
                          {sec.key === 'cache' && (
                            <>
                              <HBox sx={{ mb: 1.5, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
                                {[
                                  'DEFAULT — inherits the global cache settings',
                                  'EVICT_DAILY — clears cache at a set time each day',
                                  'EVICT_WEEKLY — clears cache on a specific day each week',
                                  'MAX_LIFESPAN — entries expire after a fixed duration',
                                ].map((point, i) => (
                                  <HBox key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3, background: 'transparent' }}>
                                    <span style={{ color: theme.palette.text.secondary }}>•</span>
                                    <HLabel value={point} translate={false} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: theme.palette.text.secondary }} />
                                  </HBox>
                                ))}
                              </HBox>
                              <HLabel value="ldapProvider.field.cachePolicy" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, color: theme.palette.text.secondary, mb: 0.6 }} />
                              <HDropdown
                                value={gv("cachePolicy")}
                                onChange={e => hi("cachePolicy", e.target.value)}
                                options={[
                                  { value: 'DEFAULT', label: 'DEFAULT' },
                                  { value: 'EVICT_DAILY', label: 'EVICT_DAILY' },
                                  { value: 'EVICT_WEEKLY', label: 'EVICT_WEEKLY' },
                                  { value: 'MAX_LIFESPAN', label: 'MAX_LIFESPAN' },
                                ]}
                                width="100%"
                              />

                            </>
                          )}

                          {/* Auth inline — select + 2 fields + test button */}
                          {sec.key === 'auth' && (
                            <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                              <HBox sx={{ mb: 1.5, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
                                <HLabel value="ldapProvider.field.authType" translate={true} required={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, color: theme.palette.text.secondary, mb: 0.6 }} />
                                <HDropdown
                                  value={gv("authType")}
                                  onChange={e => hi("authType", e.target.value)}
                                  options={[
                                    { value: 'simple', label: 'simple' },
                                    { value: 'none', label: 'none' },
                                  ]}
                                  width="100%"
                                />
                              </HBox>
                              {[
                                { label: 'ldapProvider.field.bindDn', key: 'bindDn', required: true },
                                { label: 'ldapProvider.field.bindCredential', key: 'bindCredential', required: true },
                              ].map(f => (
                                <HBox key={f.key} sx={{ mb: 1.5, background: 'transparent', display: 'flex', flexDirection: 'column' }}>
                                  <HLabel value={f.label} translate={true} required={f.required} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: 12, color: theme.palette.text.secondary, mb: 0.6 }} />
                                  <HTextField
                                    value={gv(f.key)}
                                    onChange={e => hi(f.key, e.target.value)}
                                    editable={true}
                                    required={f.required}
                                    width="100%"
                                  />
                                </HBox>
                              ))}
                              <HButton
                                variant="outlined" size="small" fullWidth
                                onClick={handleTestAuthentication}
                                disabled={testingAuthentication}
                                loading={testingAuthentication}
                                label={testingAuthentication ? intl.formatMessage({id: "label.ldap.testing", defaultMessage: "Testing..."}) : intl.formatMessage({id: "label.ldap.testAuth", defaultMessage: "Test authentication"})}
                                sx={{
                                  mt: 2, textTransform: 'none',
                                  fontFamily: "'Inter',sans-serif", fontWeight: 600,
                                  fontSize: 11, borderRadius: '6px',
                                  py: 0.4,
                                }}
                              />
                            </HBox>
                          )}

                          {/* Advanced inline — 4 compact toggles + query button */}
                          {sec.key === 'advanced' && (
                            <HBox sx={{ display: 'flex', flexDirection: 'column', flex: 1, background: 'transparent' }}>
                              {[
                                { label: 'ldapProvider.field.usePasswordModifyExtendedOp', key: 'usePasswordModifyExtendedOp' },
                                { label: 'ldapProvider.field.validatePasswordPolicy', key: 'validatePasswordPolicy' },
                                { label: 'ldapProvider.field.trustEmail', key: 'trustEmail' },
                                { label: 'ldapProvider.field.connectionTrace', key: 'connectionTrace' },
                              ].map(item => (
                                <HBox key={item.key} sx={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  px: 1, py: 0.5, mb: 0.6, background: 'transparent'
                                }}>
                                  <HLabel value={item.label} translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, color: theme.palette.text.secondary }} />
                                  <HBox sx={{ display: 'flex', alignItems: 'center', gap: 0.4, background: 'transparent' }}>
                                    <HToggle
                                      label={gb(item.key) ? 'ON' : 'OFF'}
                                      checked={gb(item.key)}
                                      onChange={e => ht(item.key, e.target.checked)}
                                      size="small"
                                    />
                                  </HBox>
                                </HBox>
                              ))}
                              {/* Fix 3: compact button, mt:auto pushes to bottom */}
                              <HButton
                                variant="outlined"
                                size="small"
                                fullWidth
                                label="ldapProvider.button.queryExtensions"
                                sx={{
                                  mt: 2, pt: 0.8, textTransform: 'none',
                                  fontFamily: "'Inter',sans-serif", fontWeight: 600,
                                  fontSize: 11, borderRadius: '6px',
                                  py: 0.4,
                                }}
                              />
                            </HBox>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      /* All other cards — click to open popup, full height, flex column */
                      <Card
                        onClick={() => openSection(sec.key)}
                        sx={{
                          cursor: 'pointer',
                          borderRadius: '16px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', borderColor: `${sec.iconColor}40` },
                        }}
                      >
                        <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
                          {/* Icon badge + title */}
                          <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1, background: 'transparent' }}>
                            <HBox sx={{ width: 38, height: 38, borderRadius: '10px', background: `${sec.iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconComp sx={{ color: sec.iconColor, fontSize: 20 }} />
                            </HBox>
                            <HLabel value={sec.label} translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 15, color: theme.palette.text.primary }} />
                          </HBox>
                          {/* Bullet points */}
                          <HBox sx={{ mt: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                            {sec.bullets.map((b, bi) => (
                              <HBox key={bi} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'transparent' }}>
                                <span style={{ color: theme.palette.text.secondary }}>•</span>
                                <HLabel value={b} translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: theme.palette.text.secondary }} />
                              </HBox>
                            ))}
                          </HBox>
                          {/* Manage → pinned to bottom */}
                          <HBox sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'flex-end', background: 'transparent' }}>
                            <HLabel
                              value={intl.formatMessage({id: "ldapProvider.label.manage", defaultMessage: "Manage →"})}
                              translate={false} colon={false}
                              sx={{
                              fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700,
                              color: sec.iconColor,
                              whiteSpace: 'nowrap',
                              }}
                            />
                          </HBox>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}
            </HBox>
          )}

          {/* ── Mappers tab content (inline, no dialog) ── */}
          {!isCreate && activeTab === 1 && (
            <HBox sx={{
              overflow: 'hidden',
              borderRadius: '10px',
              border: `1px solid ${colors.border}`,
              p: 2
            }}>
              {renderMappersContent()}
            </HBox>
          )}

          </HBox>{/* end scrollable content area */}

        </Container>

        {/* ── Create mode: General Options popup (auto-opens, must complete to proceed) ── */}
        <HDialog disableContentWrapper open={isCreate && createDialogOpen} onClose={() => {}} disableEscapeKeyDown maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden', background: 'background.paper' } } }}>
          <GDT>{intl.formatMessage({ id: "ldapProvider.header.newProvider", defaultMessage: "New LDAP Provider" })}</GDT>
          <DialogContent sx={{ p: 2.5 }}>
            <HLabel value="ldapProvider.msg.newProviderDesc" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: theme.palette.text.secondary, mb: 2 }} />
            <CF label="ldapProvider.field.displayName" value={providerName} onChange={v => setProviderName(v)} required color={theme.palette.text.secondary}/>
            <SF label="ldapProvider.field.vendor" value={gv("vendor")}
              options={[{ value: "ad", label: "Active Directory" }, { value: "rhds", label: "Red Hat Directory Server" }, { value: "tivoli", label: "Tivoli" }, { value: "edirectory", label: "eDirectory" }]}
              onChange={v => hi("vendor", v)} tooltip={tips.vendor} required color={theme.palette.text.secondary}
            />
          </DialogContent>
          <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${colors.border}`, gap: 1, justifyContent: 'flex-end' }}>
            <HButton variant="contained"
              onClick={() => {
                if (!providerName.trim()) { toast.error(intl.formatMessage({ id: "ldapProvider.toast.nameRequired", defaultMessage: "Provider name is required." })); return; }
                if (!gv("vendor")) { toast.error(intl.formatMessage({ id: "ldapProvider.toast.vendorRequired", defaultMessage: "Please select a vendor." })); return; }
                setCreateDialogOpen(false);
                handleSave();
              }}
              loading={saving}
              disabled={saving}
              startIcon={saving ? null : <SaveIcon sx={{ fontSize: 14 }} />}
              sx={primaryBtnSx}
              label="ldapProvider.button.createProvider"
            />
            <HButton onClick={() => navigate("/homelayout/ldap-providers")} sx={cancelBtnSx} startIcon={<MdClose size={12} />} label="ldapProvider.button.cancel" />
          </DialogActions>
        </HDialog>

        {/* ── Section popups — editing only updates formData, no API call ── */}
        {SECTIONS.filter(s => s.key !== 'mappers' && s.key !== 'cache' && s.key !== 'advanced' && s.key !== 'auth').map(sec => (
          <HDialog disableContentWrapper key={sec.key} open={activeSection === sec.key} onClose={() => setActiveSection(null)} maxWidth={sec.key === 'searching' ? 'md' : 'sm'} fullWidth slotProps={{ paper: { sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' } } }}>
            <GDT onClose={() => setActiveSection(null)}>{intl.formatMessage({ id: sec.label, defaultMessage: sec.label })}</GDT>
            <DialogContent sx={{ p: 2.5, pt: 3 }}>
              {renderSectionContent(sec.key)}
            </DialogContent>
            {/* Close only — no Save button here. Save is global. */}
            <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${colors.border}`, bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <HLabel value="ldapProvider.msg.stagedChanges" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: theme.palette.text.secondary }} />
              <HButton variant="outlined" onClick={() => setActiveSection(null)} sx={neutralBtnSx} label="ldapProvider.button.done" />
            </DialogActions>
          </HDialog>
        ))}

        {/* ── Mapper type selection ── */}
        <HDialog disableContentWrapper open={mapperTypeDialogOpen} onClose={() => setMapperTypeDialogOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' } } }}>
          <GDT onClose={() => setMapperTypeDialogOpen(false)}>{intl.formatMessage({ id: "ldapProvider.header.selectMapperType", defaultMessage: "Select Mapper Type" })}</GDT>
          <DialogContent sx={{ p: 0, minHeight: '320px' }}>
            {loadingMapperTypes ? (
              <HBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}><CircularProgress size={22} sx={{ color: colors.primary }} /></HBox>
            ) : !mapperTypes?.length ? (
              <HBox sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '280px' }}><HLabel value="ldapProvider.msg.noMapperTypes" translate={true} colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: theme.palette.text.secondary }} /></HBox>
            ) : (
              <HBox sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 1.5, p: 2.5, overflowY: 'auto', maxHeight: '480px', background: 'transparent' }}>
                {mapperTypes.map((mt, idx) => (
                  <div key={mt.id}>
                    <HPaper elevation={0}
                      onClick={() => { navigate(`/homelayout/ldap-providers/${providerId}/mappers/new/${mt.id}`); setMapperTypeDialogOpen(false); setActiveSection(null); }}
                      sx={{ p: 2, cursor: 'pointer', border: `1px solid ${colors.border}`, borderRadius: '8px', overflow: 'hidden', backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 1, transition: 'all 0.15s', '&:hover': { backgroundColor: `${colors.primary}04`, borderColor: colors.primary, boxShadow: `0 4px 14px ${colors.primary}12` } }}
                    >
                      <HBox sx={{ height: 2, borderRadius: '1px', mb: 0.5 }} />
                      <HLabel
                        sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, color: theme.palette.text.primary, fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}
                        value={mt.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                        translate={false}
                        colon={false}
                        align="left"
                      />
                      <HLabel
                        sx={{ fontFamily: "'Inter',sans-serif", color: theme.palette.text.secondary, fontSize: 12, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        value={mt.helpText || "No description available"}
                        translate={false}
                        colon={false}
                        align="left"
                      />
                      {mt.properties?.length > 0 && (
                        <HLabel
                          value={intl.formatMessage({ id: "ldapProvider.msg.configsCount" }, { count: mt.properties.length, plural: mt.properties.length === 1 ? "" : "s" })}
                          translate={false}
                          colon={false}
                          sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: theme.palette.text.secondary, borderTop: `1px solid ${colors.border}`, pt: 0.8, mt: 0.5 }}
                        />
                      )}
                    </HPaper>
                  </div>
                ))}
              </HBox>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: `1px solid ${colors.border}`, bgcolor: 'background.paper' }}>
            <HButton onClick={() => setMapperTypeDialogOpen(false)} sx={neutralBtnSx} label="ldapProvider.button.cancel" />
          </DialogActions>
        </HDialog>

        {/* ── Unsaved changes confirmation dialog ── */}
        <HDialog disableContentWrapper open={unsavedConfirmOpen} onClose={() => setUnsavedConfirmOpen(false)} slotProps={{ paper: { sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden', minWidth: 360 } } }}>
          <GDT onClose={() => setUnsavedConfirmOpen(false)}>{intl.formatMessage({ id: "ldapProvider.header.unsavedChanges", defaultMessage: "Unsaved Changes" })}</GDT>
          <DialogContent sx={{ pt: 2.5, pb: 1, px: 2.5 }}>
            <HBox sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', background: 'transparent' }}>
              <HBox sx={{ color: colors.accent, mt: 0.2, flexShrink: 0, background: 'transparent' }}><FiAlertTriangle size={15} /></HBox>
              <HBox sx={{ display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                <HLabel value="ldapProvider.msg.unsavedSub" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: theme.palette.text.primary, mb: 0.5 }} />
                <HLabel value="ldapProvider.msg.unsavedMessage" translate={true} colon={false} align="left" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: theme.palette.text.secondary, lineHeight: 1.65 }} />
              </HBox>
            </HBox>
          </DialogContent>
          <DialogActions sx={{ px: 2.5, py: 1.8, gap: 1, borderTop: `1px solid ${colors.border}` }}>
            <HButton onClick={async () => { setUnsavedConfirmOpen(false); await handleSave(); navigate("/homelayout/ldap-providers"); }} variant="outlined" sx={neutralBtnSx} label="ldapProvider.button.saveClose" />
            <HButton onClick={() => { setUnsavedConfirmOpen(false); navigate("/homelayout/ldap-providers"); }} variant="contained" sx={dangerBtnSx} label="ldapProvider.button.leaveAnyway" />
          </DialogActions>
        </HDialog>

        {/* ── Delete dialogs ── */}
        {[
          { open: deleteConfirmOpen, onClose: () => setDeleteConfirmOpen(false), title: "ldapProvider.header.deleteProvider", body: "ldapProvider.msg.deleteProviderMessage", translateBody: true, onConfirm: handleDelete },
          { open: mapperDeleteConfirmOpen, onClose: () => { setMapperDeleteConfirmOpen(false); setSelectedMapperForDelete(null); }, title: "ldapProvider.header.deleteMapper", body: intl.formatMessage({ id: "ldapProvider.msg.deleteMapperConfirm" }, { name: selectedMapperForDelete?.name || "" }), translateBody: false, onConfirm: handleMapperDelete },
        ].map(d => (
          <HDialog disableContentWrapper key={d.title} open={d.open} onClose={d.onClose} slotProps={{ paper: { sx: { borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden', minWidth: 360 } } }}>
            <GDT onClose={d.onClose}>{intl.formatMessage({ id: d.title, defaultMessage: d.title })}</GDT>
            <DialogContent sx={{ pt: 2.5, pb: 1, px: 2.5 }}>
              <HBox sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', background: 'transparent' }}>
                <HBox sx={{ color: colors.accent, mt: 0.2, flexShrink: 0, background: 'transparent' }}><FiAlertTriangle size={15} /></HBox>
                <HLabel value={d.body} translate={d.translateBody} align="left" colon={false} sx={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: theme.palette.text.secondary, lineHeight: 1.65 }} />
              </HBox>
            </DialogContent>
            <DialogActions sx={{ px: 2.5, py: 1.8, gap: 1, borderTop: `1px solid ${colors.border}` }}>
              <HButton onClick={d.onClose} sx={neutralBtnSx} variant="outlined" label="ldapProvider.button.cancel" />
              <HButton onClick={d.onConfirm} loading={saving} variant="contained" sx={dangerBtnSx} label="ldapProvider.button.delete" />
            </DialogActions>
          </HDialog>
        ))}
      </HBox>
    </div>
  );
}

export default LdapProviderDetail;