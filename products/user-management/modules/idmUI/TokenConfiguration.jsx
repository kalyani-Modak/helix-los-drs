import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {
  Box, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Chip, Alert, Grid, Collapse, Divider, FormHelperText,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import { useIntl } from "react-intl";
import { HAxiosService, HBox, HButton, HDropdown, HLabel, HPaper, HTextField, HToggle, HAgGrid, HBreadCrumb, TitleBar, useDrsTheme, useToast, withAlpha, HDialog } from "@helix/component-library";
import { FiKey, FiPlus, FiAlertTriangle, FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { UserManagementAPI, ClientDetailsAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";


const ghostBtn = {
  textTransform: 'none',
  fontWeight: 600, fontSize: 12, borderRadius: '6px', px: 1.8, py: 0.45, boxShadow: 'none',
};

const paperSx = {
  borderRadius: '12px',
  backgroundColor: 'var(--drs-bg-paper)',
  border: '1px solid var(--drs-border-divider)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};


const JSON_TYPES_FALLBACK = ['String', 'long', 'int', 'boolean'];
const MAPPER_TYPE_USER_ATTRIBUTE = 'USER_ATTRIBUTE';
const MAPPER_TYPE_AUDIENCE = 'AUDIENCE';

const MAPPER_TYPE_DETAILS = {
  [MAPPER_TYPE_USER_ATTRIBUTE]: {
    icon: PersonOutlineOutlinedIcon,
    description: 'Map a user profile attribute into access, ID, and userinfo token claims.',
    helper: 'Mapper name and claim name are set from the selected attribute.',
  },
  [MAPPER_TYPE_AUDIENCE]: {
    icon: CampaignOutlinedIcon,
    description: 'Add a client to the token aud claim for downstream API validation.',
    helper: 'Creates a Keycloak audience mapper on the selected client.',
  },
};

const dialogFieldSx = {
  '& .MuiOutlinedInput-root': {
     fontSize: 12, borderRadius: '6px',
  },
  '& .MuiInputLabel-root': {  fontSize: 12 },
};

const dialogSectionTitleSx = {
  fontSize: 12, fontWeight: 700,
  color: 'var(--drs-text-primary)', lineHeight: 1.4,
};

const dialogSectionSubtitleSx = {
  fontSize: 11, color: 'var(--drs-text-secondary)',
  mt: 0.35, lineHeight: 1.5,
};

const dialogStepBadgeSx = {
   fontSize: 10, fontWeight: 700,
  color: "var(--drs-button-primary-bg, transparent)", background: "var(--drs-button-outline-bg, transparent)",
  borderRadius: '4px', px: 0.75, py: 0.15, mr: 1, flexShrink: 0,
};

const extractApiError = (err) =>
  err?.response?.data?.message
  || err?.response?.data?.errorMessage
  || err?.response?.data?.error
  || err?.message;

const StatusBadge = ({ enabled }) => {
  const intl = useIntl();
  const { colors } = useDrsTheme();
  return (
    <HBox sx={{ display: 'flex', alignItems: 'center', gap: 0.6, background: 'transparent', mt: 1 }}>
      <HBox sx={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: enabled ? colors.secondary : colors.text.light,
        boxShadow: enabled ? `0 0 0 3px ${withAlpha(colors.secondary, 0.15)}` : 'none',
      }} />
      <HLabel
        value={enabled 
          ? intl.formatMessage({ id: "label.tokenConfig.badge.enabled", defaultMessage: "Enabled" }) 
          : intl.formatMessage({ id: "label.tokenConfig.badge.disabled", defaultMessage: "Disabled" })}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
          color: enabled ? colors.secondary : colors.text.light,
        }}
      />
    </HBox>
  );
};

const TypeChip = ({ type }) => {
  const intl = useIntl();
  const { colors } = useDrsTheme();
  return (
    <Chip
      label={type === 'scope' 
        ? intl.formatMessage({ id: "label.tokenConfig.mapperType.scope", defaultMessage: "Scope" }) 
        : intl.formatMessage({ id: "label.tokenConfig.mapperType.mapper", defaultMessage: "Mapper" })}
      size="small"
      sx={{
        fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, height: 22,
        background: type === 'scope' ? withAlpha(colors.primary, 0.08) : withAlpha(colors.secondary, 0.09),
        color: type === 'scope' ? colors.primary : colors.secondary,
        border: `1px solid ${type === 'scope' ? withAlpha(colors.primary, 0.21) : withAlpha(colors.secondary, 0.31)}`,
      }}
    />
  );
};

const StatCard = ({ label, value, accent }) => {
  const { colors } = useDrsTheme();
  return (
  <HPaper sx={{
    px: 2, py: 1.5, flex: 1, minWidth: 120,
    borderTop: `3px solid ${accent}`,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    background: "var(--drs-button-outline-bg, transparent)",
  }}>
    <HLabel
      value={label}
      translate={false}
      colon={false}
      align="left"
      sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
    />
    <HLabel
      value={String(value)}
      translate={false}
      colon={false}
      align="left"
      sx={{ fontFamily: "'Inter',sans-serif", fontSize: 22, fontWeight: 700, mt: 0.3 }}
    />
  </HPaper>
  );
};

const SectionPanel = ({
  icon, title, subtitle, count, search, onSearchChange,
  expanded, onToggleExpanded, children,
}) => {
  const intl = useIntl();
  const theme = useTheme();
  const { colors } = useDrsTheme();
  return (
    <HPaper sx={{ mb: 2.5, overflow: 'hidden', borderRadius: '10px', border: `1px solid ${colors.border}` }}>
      <HBox
        onClick={onToggleExpanded}
        sx={{
          px: 2, py: 1.4, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap',
          borderBottom: expanded ? `1px solid ${colors.border}` : 'none',
        }}
      >
        <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1, background: 'transparent' }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onToggleExpanded(); }}
            sx={{ color: colors.primary, p: 0.5 }}
          >
            {expanded ? <ExpandLessIcon sx={{ fontSize: 20 }} /> : <ExpandMoreIcon sx={{ fontSize: 20 }} />}
          </IconButton>
          <HBox sx={{
            width: 36, height: 36, borderRadius: '8px', flexShrink: 0,
            background: `linear-gradient(135deg, ${withAlpha(colors.primary, 0.09)}, ${withAlpha(colors.primaryLight, 0.07)})`,
            border: `1px solid ${withAlpha(colors.primary, 0.13)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </HBox>
          <HBox sx={{ minWidth: 0, flexDirection: 'column', background: 'transparent' }}>
            <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', background: 'transparent' }}>
              <HLabel
                value={title}
                translate={false}
                colon={false}
                align="left"
                sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 14, color: theme.palette.text.primary }}
              />
              <Chip label={count} size="small" sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, height: 20, background: withAlpha(colors.primary, 0.07), color: colors.primary }} />
            </HBox>
            <HLabel
              value={subtitle}
              translate={false}
              colon={false}
              align="left"
              sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: theme.palette.text.secondary, mt: 0.2 }}
            />
          </HBox>
        </HBox>
        <HTextField
          size="small"
          placeholder={intl.formatMessage({ id: "label.tokenConfig.search", defaultMessage: "Search…" })}
          value={search}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onSearchChange(e.target.value)}
          editable
          InputProps={{
            startAdornment: (
                <HBox sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                  <FiSearch size={13} color={theme.palette.text.secondary} />
                </HBox>
            ),
          }}
        />
      </HBox>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <HBox sx={{ p: 2, pt: 1.5, flexDirection: 'column', background: 'transparent' }}>
          {children}
        </HBox>
      </Collapse>
    </HPaper>
  );
};

const MapperKindChip = ({ mapperType }) => {
  const intl = useIntl();
  const { colors } = useDrsTheme();
  const isAudience = mapperType === MAPPER_TYPE_AUDIENCE;
  return (
    <Chip
      label={isAudience 
        ? intl.formatMessage({ id: "label.tokenConfig.mapperType.audience", defaultMessage: "Audience" }) 
        : intl.formatMessage({ id: "label.tokenConfig.mapperType.userAttribute", defaultMessage: "User Attribute" })}
      size="small"
      sx={{
        fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, height: 22,
        background: isAudience ? withAlpha(colors.primary, 0.08) : withAlpha(colors.secondary, 0.09),
        color: isAudience ? colors.primary : colors.secondary,
        border: `1px solid ${isAudience ? withAlpha(colors.primary, 0.21) : withAlpha(colors.secondary, 0.31)}`,
      }}
    />
  );
};

const mapperDetailsText = (row) => {
  if (row.mapperType === MAPPER_TYPE_AUDIENCE) {
    const parts = [];
    if (row.includedClientAudience) parts.push(`Client: ${row.includedClientAudience}`);
    if (row.includedCustomAudience) parts.push(`Custom: ${row.includedCustomAudience}`);
    return parts.length ? parts.join(' · ') : (row.description || '—');
  }
  if (row.jsonType) return `Claim: ${row.name} · JSON: ${row.jsonType}`;
  return row.description || '—';
};

const defaultColDef = {
  sortable: true,
  filter: false,
  resizable: true,
};

const ConfigTable = ({ rows, onToggle, onMenuOpen, emptyMessage, updatingId, showMapperKind }) => {
  const intl = useIntl();
  const theme = useTheme();
  const { colors } = useDrsTheme();
  
  const colDefs = useMemo(() => {
    const cols = [
      {
        headerName: intl.formatMessage({ id: "label.tokenConfig.type", defaultMessage: "Type" }),
        field: "type",
        width: 100,
        cellRenderer: (params) => <TypeChip type={params.value} />,
      },
    ];

    if (showMapperKind) {
      cols.push({
        headerName: intl.formatMessage({ id: "label.tokenConfig.mapperKind", defaultMessage: "Mapper kind" }),
        field: "mapperType",
        width: 130,
        cellRenderer: (params) => <MapperKindChip mapperType={params.value || MAPPER_TYPE_USER_ATTRIBUTE} />,
      });
    }

    cols.push({
      headerName: intl.formatMessage({ id: "label.tokenConfig.name", defaultMessage: "Name" }),
      field: "name",
      flex: 1,
      cellStyle: { fontWeight: 600, color: colors.text.primary },
    });

    cols.push({
      headerName: showMapperKind 
        ? intl.formatMessage({ id: "label.tokenConfig.details", defaultMessage: "Details" }) 
        : intl.formatMessage({ id: "label.tokenConfig.description", defaultMessage: "Description" }),
      field: showMapperKind ? "details" : "description",
      flex: 1.5,
      valueGetter: (params) => showMapperKind ? mapperDetailsText(params.data) : (params.data?.description || '—'),
      cellStyle: { color: colors.text.light },
    });

    cols.push({
      headerName: intl.formatMessage({ id: "label.tokenConfig.status", defaultMessage: "Status" }),
      field: "status",
      width: 100,
      cellRenderer: (params) => {
        const enabled = params.value === 'enabled';
        return <StatusBadge enabled={enabled} />;
      },
    });

    cols.push({
      headerName: intl.formatMessage({ id: "label.tokenConfig.enabled", defaultMessage: "Enabled" }),
      field: "status",
      width: 90,
      cellRenderer: (params) => {
        const row = params.data;
        const enabled = params.value === 'enabled';
        const isUpdating = updatingId === row?.id;
        return isUpdating ? (
          <CircularProgress size={18} sx={{ color: colors.primary }} />
        ) : (
          <HToggle
            size="small"
            checked={enabled}
            onChange={() => onToggle(row)}
          />
        );
      },
    });

    cols.push({
      headerName: "",
      field: "actions",
      width: 60,
      sortable: false,
      cellRenderer: (params) => (
        <IconButton size="small" onClick={(e) => onMenuOpen(e, params.data)}
          sx={{ color: colors.text.light, '&:hover': { color: colors.primary, background: withAlpha(colors.primary, 0.06) } }}
        >
          <MoreVertIcon sx={{ fontSize: 15 }} />
        </IconButton>
      ),
    });

    return cols;
  }, [intl, showMapperKind, updatingId, onToggle, onMenuOpen, colors, theme]);

  return (
    <div style={{ width: "100%" }}>
      {rows.length === 0 ? (
        <HBox sx={{ ...paperSx, py: 5, textAlign: 'center' }}>
          <HLabel
            value={emptyMessage}
            translate={false}
            colon={false}
            align="center"
            sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: theme.palette.text.secondary }}
          />
        </HBox>
      ) : (
        <HAgGrid
          rowData={rows}
          columnDefs={colDefs}
          gridStyle={{
            width: "100%",
            height: "auto",
          }}
          pagination
          paginationPageSize={10}
          gridClassName="drs-list-grid"
          defaultColDef={defaultColDef}
          domLayout={rows.length > 5 ? undefined : "autoHeight"}
        />
      )}
    </div>
  );
};

const MapperTypeOptionCard = ({ type, selected, onSelect, disabled }) => {
  const { colors, text } = useDrsTheme();
  const meta = MAPPER_TYPE_DETAILS[type.value] || MAPPER_TYPE_DETAILS[MAPPER_TYPE_USER_ATTRIBUTE];
  const Icon = meta.icon;
  return (
    <HBox
      component="button"
      type="button"
      onClick={() => !disabled && onSelect(type.value)}
      disabled={disabled}
      sx={{
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        p: 1.5,
        m: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: `1px solid ${selected ? "var(--drs-control-hover-border, currentColor)" : colors.border}`,
        borderRadius: '10px',
        opacity: disabled ? 0.55 : 1,
        boxSizing: 'border-box',
        outline: 'none',
        '&:hover': disabled ? {} : {
          borderColor: "var(--drs-control-hover-border, currentColor)",
        },
        '&:focus-visible': {
          borderColor: "var(--drs-control-hover-border, currentColor)",
          boxShadow: `0 0 0 3px ${withAlpha(colors.primary, 0.12)}`,
        },
      }}
    >
      <HBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: 1 }}>
        <HBox sx={{
          width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
          background: "var(--drs-button-outline-bg, transparent)",
          border: `1px solid ${"var(--drs-control-hover-border, currentColor)" + '35'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon sx={{ fontSize: 19, color: "var(--drs-control-hover-border, currentColor)" }} />
        </HBox>
        <HBox sx={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          background: selected ? "var(--drs-control-hover-border, currentColor)" : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <HBox sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: text.inverse }} />}
        </HBox>
      </HBox>

      <HBox sx={{ minWidth: 0, flex: 1, flexDirection: 'column', background: 'transparent' }}>
        <HLabel
          value={type.label}
          translate={false}
          colon={false}
          align="left"
          sx={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13, color: colors.text.primary, lineHeight: 1.35 }}
        />
        <HLabel
          value={meta.description}
          translate={false}
          colon={false}
          align="left"
          sx={{
            fontFamily: "'Inter',sans-serif", fontSize: 11, color: colors.text.light, mt: 0.45, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        />
      </HBox>
    </HBox>
  );
};

const DialogFormSection = ({ step, title, subtitle, children }) => (
  <HBox sx={{ width: '100%', flexDirection: 'column', background: 'transparent' }}>
    <HBox sx={{ mb: 1.25, flexDirection: 'column', background: 'transparent' }}>
      <HBox sx={{ display: 'flex', alignItems: 'center', mb: subtitle ? 0.3 : 0, background: 'transparent' }}>
        <HBox component="span" sx={dialogStepBadgeSx}>{step}</HBox>
        <HLabel
          value={title}
          translate={false}
          colon={false}
          align="left"
          sx={dialogSectionTitleSx}
        />
      </HBox>
      {subtitle && (
        <HLabel
          value={subtitle}
          translate={false}
          colon={false}
          align="left"
          sx={{ ...dialogSectionSubtitleSx, pl: '2.1rem' }}
        />
      )}
    </HBox>
    <HBox sx={{ pl: '2.1rem', flexDirection: 'column', background: 'transparent' }}>{children}</HBox>
  </HBox>
);

const MapperPreviewRow = ({ label, value }) => {
  const { colors } = useDrsTheme();
  return (
  <HBox sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.55, background: 'transparent' }}>
    <HLabel
      value={label}
      translate={false}
      colon={false}
      align="left"
      sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: colors.text.light, flexShrink: 0 }}
    />
    <HLabel
      value={value || '—'}
      translate={false}
      colon={false}
      align="left"
      sx={{
        fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
        color: colors.text.primary, wordBreak: 'break-word',
      }}
    />
  </HBox>
  );
};

const TokenConfiguration = () => {
  const toast = useToast();
  const intl = useIntl();
  const theme = useTheme();
  const { surfaces, text, border, action, colors } = useDrsTheme();
  const realm = sessionStorage.getItem('SEC_REALM');

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(sessionStorage.getItem('SELECTED_PRODUCT') || '');
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [scopeSearch, setScopeSearch] = useState('');
  const [mapperSearch, setMapperSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addMapperOpen, setAddMapperOpen] = useState(false);
  const [savingMapper, setSavingMapper] = useState(false);
  const [mapperForm, setMapperForm] = useState({
    mapperType: MAPPER_TYPE_USER_ATTRIBUTE,
    userAttribute: '',
    jsonType: 'String',
    includedClientAudience: '',
    includedCustomAudience: '',
  });
  const [userAttributes, setUserAttributes] = useState([]);
  const [mapperTypes, setMapperTypes] = useState([]);
  const [jsonTypes, setJsonTypes] = useState(JSON_TYPES_FALLBACK);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [loadingMapperMeta, setLoadingMapperMeta] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [scopesExpanded, setScopesExpanded] = useState(true);
  const [mappersExpanded, setMappersExpanded] = useState(true);
  const deleteInProgressRef = useRef(false);

  const loadClients = useCallback(async () => {
    if (!realm) return;
    setLoadingClients(true);
    try {
      const res = await HAxiosService.GET(ClientDetailsAPI.GET_CLIENTS_BY_REALM(realm));
      setClients(res.data || []);
    } catch {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.loadClientsError", defaultMessage: "Failed to load clients." }));
    } finally {
      setLoadingClients(false);
    }
  }, [realm, toast, intl]);

  const loadConfigs = useCallback(async (selectedClientId) => {
    if (!selectedClientId) {
      setConfigs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await HAxiosService.GET(UserManagementAPI.fetch_token_config(selectedClientId));
      const items = Array.isArray(res.data) ? res.data.filter(Boolean) : [];
      setConfigs(items);
    } catch {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.loadConfigsError", defaultMessage: "Failed to load token configuration." }));
      setConfigs([]);
    } finally {
      setLoading(false);
    }
  }, [toast, intl]);

  useEffect(() => { loadClients(); }, [loadClients]);
  useEffect(() => { loadConfigs(clientId); }, [clientId, loadConfigs]);

  useEffect(() => {
    setScopesExpanded(true);
    setMappersExpanded(true);
  }, [clientId]);

  const clientOptions = useMemo(() => {
    return clients.map((c) => ({
      label: c.clientId,
      value: c.clientId,
    }));
  }, [clients]);

  const scopes = useMemo(() => {
    const q = scopeSearch.trim().toLowerCase();
    return configs
      .filter((c) => c?.type === 'scope')
      .filter((c) => !q || c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
  }, [configs, scopeSearch]);

  const mappers = useMemo(() => {
    const q = mapperSearch.trim().toLowerCase();
    return configs
      .filter((c) => c?.type === 'mapper')
      .filter((c) => !q
        || c.name?.toLowerCase().includes(q)
        || c.description?.toLowerCase().includes(q)
        || c.mapperType?.toLowerCase().includes(q)
        || c.includedClientAudience?.toLowerCase().includes(q)
        || c.includedCustomAudience?.toLowerCase().includes(q));
  }, [configs, mapperSearch]);

  const existingMapperNames = useMemo(
    () => new Set(mappers.map((m) => (m.name || '').toLowerCase())),
    [mappers],
  );

  const existingAudienceClients = useMemo(
    () => new Set(
      mappers
        .filter((m) => m.mapperType === MAPPER_TYPE_AUDIENCE && m.includedClientAudience)
        .map((m) => m.includedClientAudience.toLowerCase()),
    ),
    [mappers],
  );

  const availableAttributes = useMemo(
    () => userAttributes.filter((attr) => !existingMapperNames.has(attr.toLowerCase())),
    [userAttributes, existingMapperNames],
  );

  const availableAudienceClients = useMemo(
    () => clients.filter((c) => c.clientId && !existingAudienceClients.has(c.clientId.toLowerCase())),
    [clients, existingAudienceClients],
  );

  const isAudienceMapper = mapperForm.mapperType === MAPPER_TYPE_AUDIENCE;
  const isDialogLoading = loadingMapperMeta || (isAudienceMapper ? loadingClients : loadingAttributes);
  const mapperTypeLabel = (value) => mapperTypes.find((t) => t.value === value)?.label
    || (value === MAPPER_TYPE_AUDIENCE ? 'Audience' : 'User Attribute');
  const activeMapperMeta = MAPPER_TYPE_DETAILS[mapperForm.mapperType] || MAPPER_TYPE_DETAILS[MAPPER_TYPE_USER_ATTRIBUTE];

  const enabledCount = configs.filter((c) => c?.status === 'enabled').length;

  const canDeleteRow = (row) => {
    if (!row) return false;
    if (row.type === 'mapper') return true;
    return row.deletable === true;
  };

  const loadUserAttributes = useCallback(async () => {
    setLoadingAttributes(true);
    try {
      const res = await HAxiosService.GET(UserManagementAPI.fetch_token_config_user_attributes());
      setUserAttributes(res.data || []);
    } catch {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.loadAttributesError", defaultMessage: "Failed to load user attributes." }));
      setUserAttributes([]);
    } finally {
      setLoadingAttributes(false);
    }
  }, [toast, intl]);

  const loadMapperMetadata = useCallback(async () => {
    setLoadingMapperMeta(true);
    try {
      const res = await HAxiosService.GET(UserManagementAPI.fetch_token_config_mapper_types());
      const types = res.data?.mapperTypes || [];
      const typesFromApi = Array.isArray(types) ? types : [];
      setMapperTypes(typesFromApi);
      const jsonFromApi = res.data?.jsonTypes;
      setJsonTypes(Array.isArray(jsonFromApi) && jsonFromApi.length ? jsonFromApi : JSON_TYPES_FALLBACK);
    } catch {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.loadMapperTypesError", defaultMessage: "Failed to load mapper types." }));
      setMapperTypes([
        { value: MAPPER_TYPE_USER_ATTRIBUTE, label: 'User Attribute' },
        { value: MAPPER_TYPE_AUDIENCE, label: 'Audience' },
      ]);
      setJsonTypes(JSON_TYPES_FALLBACK);
    } finally {
      setLoadingMapperMeta(false);
    }
  }, [toast, intl]);

  const openAddMapperDialog = () => {
    setMapperForm({
      mapperType: MAPPER_TYPE_USER_ATTRIBUTE,
      userAttribute: '',
      jsonType: 'String',
      includedClientAudience: '',
      includedCustomAudience: '',
    });
    setAddMapperOpen(true);
    loadUserAttributes();
    loadMapperMetadata();
  };

  const handleMapperTypeChange = (typeValue) => {
    setMapperForm({
      mapperType: typeValue,
      userAttribute: '',
      jsonType: jsonTypes[0] || 'String',
      includedClientAudience: '',
      includedCustomAudience: '',
    });
  };

  const handleClientChange = (e) => {
    const id = e.target.value;
    setClientId(id);
    sessionStorage.setItem('SELECTED_PRODUCT', id);
  };

  const handleToggle = async (row) => {
    if (!row?.id || !clientId || updatingId) return;
    const enable = row.status !== 'enabled';
    setUpdatingId(row.id);
    try {
      await HAxiosService.PUT(UserManagementAPI.update_token_config_status(clientId, row.id, row.type, enable));
      await loadConfigs(clientId);
      toast.success(intl.formatMessage(
        { id: "label.tokenConfig.toast.updateStatusSuccess", defaultMessage: "{name} {status} successfully." },
        { name: row.name, status: enable ? 'enabled' : 'disabled' }
      ));
    } catch (err) {
      toast.error(extractApiError(err) || `Failed to update ${row.name}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
  if (!deleteTarget || !clientId || deleteInProgressRef.current) return;

  deleteInProgressRef.current = true;
  setDeleteConfirmOpen(false);
  setDeleting(true);

  try {
    if (deleteTarget.type === 'scope') {
      const response = await HAxiosService.DELETE(
        UserManagementAPI.delete_token_config_scope(clientId, deleteTarget.id),
      );

      if (isApiSuccess(response)) {
        toast.warning(intl.formatMessage(
          { id: "label.tokenConfig.toast.deleteScopeWarning", defaultMessage: "Scope \"{name}\" can't be removed from client." },
          { name: deleteTarget.name }
        ));
      } else {
        toast.error(getApiMsg(response, `Failed to delete ${deleteTarget.name}.`));
      }
    } else {
      const response = await HAxiosService.DELETE(
        UserManagementAPI.delete_token_config_mapper(clientId, deleteTarget.id),
      );

      if (isApiSuccess(response)) {
        setConfigs((prev) => prev.filter((c) => c.id !== deleteTarget.id));

        toast.success(getApiMsg(response, intl.formatMessage(
          { id: "label.tokenConfig.toast.deleteMapperSuccess", defaultMessage: "Mapper \"{name}\" deleted successfully." },
          { name: deleteTarget.name }
        )));
      } else {
        toast.error(getApiMsg(response, `Failed to delete ${deleteTarget.name}.`));
      }
    }
  } catch (err) {
    toast.error(extractApiError(err) || `Failed to delete ${deleteTarget.name}.`);
  } finally {
    setDeleting(false);
    deleteInProgressRef.current = false;
    setDeleteTarget(null);
    setSelectedRow(null);
  }
};

  const handleAddMapper = async () => {
    if (!clientId) {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.selectClientError", defaultMessage: "Please select a client." }));
      return;
    }

    if (isAudienceMapper) {
      if (!mapperForm.includedClientAudience.trim()) {
        toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.selectAudienceError", defaultMessage: "Please select an audience client." }));
        return;
      }
      const audienceName = `audience-${mapperForm.includedClientAudience.trim()}`.toLowerCase();
      if (existingMapperNames.has(audienceName)) {
        toast.error(intl.formatMessage(
          { id: "label.tokenConfig.toast.audienceExistsError", defaultMessage: "Audience mapper for \"{client}\" already exists." },
          { client: mapperForm.includedClientAudience }
        ));
        return;
      }
    } else if (!mapperForm.userAttribute.trim()) {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.attributeRequiredError", defaultMessage: "Please select a user attribute." }));
      return;
    } else if (existingMapperNames.has(mapperForm.userAttribute.trim().toLowerCase())) {
      toast.error(intl.formatMessage(
        { id: "label.tokenConfig.toast.mapperExistsError", defaultMessage: "Mapper \"{name}\" already exists for this client." },
        { name: mapperForm.userAttribute }
      ));
      return;
    }

    setSavingMapper(true);
    try {
      const payload = isAudienceMapper
        ? {
          mapperType: MAPPER_TYPE_AUDIENCE,
          includedClientAudience: mapperForm.includedClientAudience.trim(),
          includedCustomAudience: mapperForm.includedCustomAudience.trim() || undefined,
        }
        : {
          mapperType: MAPPER_TYPE_USER_ATTRIBUTE,
          userAttribute: mapperForm.userAttribute.trim(),
          jsonType: mapperForm.jsonType,
        };

      const res = await HAxiosService.POST(UserManagementAPI.add_token_config_mapper(clientId), payload);
      if (res.data) {
        setConfigs((prev) => [...prev, res.data]);
      } else {
        await loadConfigs(clientId);
      }
      toast.success(intl.formatMessage({ id: "label.tokenConfig.toast.createMapperSuccess", defaultMessage: "Mapper created successfully." }));
      setAddMapperOpen(false);
      setMapperForm({
        mapperType: MAPPER_TYPE_USER_ATTRIBUTE,
        userAttribute: '',
        jsonType: 'String',
        includedClientAudience: '',
        includedCustomAudience: '',
      });
    } catch (err) {
      toast.error(extractApiError(err) || intl.formatMessage({ id: "label.tokenConfig.toast.createMapperError", defaultMessage: "Failed to create mapper." }));
    } finally {
      setSavingMapper(false);
    }
  };

  const openDeleteMenu = () => {
    const row = selectedRow;
    setAnchorEl(null);
    setSelectedRow(null);
    if (!row) return;
    if (!canDeleteRow(row)) {
      toast.error(intl.formatMessage({ id: "label.tokenConfig.toast.cannotDeleteScopeError", defaultMessage: "This scope cannot be removed. Disable it first." }));
      return;
    }
    setDeleteTarget(row);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteConfirmOpen(false);
    setDeleteTarget(null);
    setSelectedRow(null);
  };

  const deleteDialogMessage = deleteTarget?.type === 'scope'
    ? <>Remove client scope <strong>{deleteTarget.name}</strong> from <strong>{clientId}</strong>? This cannot be undone.</>
    : <>Permanently delete protocol mapper <strong>{deleteTarget?.name}</strong>? This will remove the mapper from client <strong>{clientId}</strong> and cannot be undone.</>;

  const audienceOptions = useMemo(() => {
    return availableAudienceClients.map((c) => ({
      label: c.clientId,
      value: c.clientId,
    }));
  }, [availableAudienceClients]);

  const attributeOptions = useMemo(() => {
    return availableAttributes.map((attr) => ({
      label: attr,
      value: attr,
    }));
  }, [availableAttributes]);

  const jsonTypeOptions = useMemo(() => {
    return jsonTypes.map((t) => ({
      label: t,
      value: t,
    }));
  }, [jsonTypes]);

  const selectedAttr = mapperForm.userAttribute.trim();
  const selectedAudience = mapperForm.includedClientAudience.trim();
  const canSubmitMapper = isAudienceMapper
    ? Boolean(selectedAudience) && availableAudienceClients.some((c) => c.clientId === selectedAudience)
    : Boolean(selectedAttr) && availableAttributes.includes(selectedAttr);
  const hasNoMapperOptions = isAudienceMapper
    ? !loadingClients && availableAudienceClients.length === 0
    : !loadingAttributes && availableAttributes.length === 0;

  return (
    <div>
      <HBox sx={{ mt: 2 }}>
          <div>
            <HBox
              sx={{
                ...paperSx,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* Header */}
              <HBox sx={{
                px: 2.5,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${colors.border}`,
                flexWrap: 'wrap',
                gap: 2,
              }}>
                <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0, background: "transparent" }}>
                  <HBreadCrumb />
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", background: "transparent" }}>
                    <TitleBar
                      title={intl.formatMessage({
                        id: "label.tokenConfig.title",
                        defaultMessage: "Token Configuration",
                      })}
                    />
                  </HBox>
                  <HBox
                    sx={{mt: -1}}
                  >
                    <HLabel
                      value={intl.formatMessage({ id: "label.tokenConfig.subtitle", defaultMessage: "Manage client scopes and protocol mappers for OIDC tokens" })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{
                        fontSize: 11,
                        color: colors.text.light,
                        display: { xs: 'none', sm: 'inline-block' },
                        ml: 1,
                      }}
                    />
                  </HBox>
                </HBox>
                <HButton variant="outlined" startIcon={<FiPlus size={12} />} disabled={!clientId}
                  onClick={openAddMapperDialog}
                  label="label.tokenConfig.addMapper"
                  sx={{ ...ghostBtn, flexShrink: 0 }}
                />
              </HBox>

              <HBox
                sx={{
                  p: 2.5,
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  background: "transparent",
                }}
              >
                {/* Client selector */}
                <HBox sx={{ width: "100%", background: "transparent" }}>
                  <HDropdown
                    options={clientOptions}
                    value={clientId}
                    onChange={handleClientChange}
                    disabled={loadingClients}
                    placeholder={intl.formatMessage({ id: "label.tokenConfig.selectClient", defaultMessage: "Select client" })}
                    width="260px"
                  />
                </HBox>

                {!clientId ? (
                  <HBox
                    sx={{
                      ...paperSx,
                      width: "100%",
                      minHeight: { xs: 220, sm: 260 },
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      px: 3,
                      py: { xs: 4, sm: 5 },
                      gap: 1,
                      background: "transparent",
                    }}
                  >
                    <FiKey size={32} color={colors.primary} style={{ opacity: 0.5 }} />
                    <HLabel
                      value={intl.formatMessage({ id: "label.tokenConfig.selectClientToBegin", defaultMessage: "Select a client to begin" })}
                      translate={false}
                      colon={false}
                      align="center"
                      sx={{ fontWeight: 600, fontSize: 14, color: text.primary, mt: 0.5 }}
                    />
                    <HLabel
                      value={intl.formatMessage({ id: "label.tokenConfig.chooseClientDesc", defaultMessage: "Choose a client application to configure token scopes and mappers." })}
                      translate={false}
                      colon={false}
                      align="center"
                      sx={{
                        fontSize: 12,
                        color: text.secondary,
                        maxWidth: 420,
                        lineHeight: 1.5,
                      }}
                    />
                  </HBox>
                ) : loading ? (
                  <HBox
                    sx={{
                      width: "100%",
                      minHeight: { xs: 180, sm: 220 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      background: "transparent",
                    }}
                  >
                    <CircularProgress size={28} sx={{ color: colors.primary }} />
                    <HLabel
                      value={intl.formatMessage({ id: "label.tokenConfig.loading", defaultMessage: "Loading configuration…" })}
                      translate={false}
                      colon={false}
                      align="center"
                      sx={{ fontSize: 12, color: text.secondary }}
                    />
                  </HBox>
                ) : (
                  <>
                    <Grid container spacing={1} sx={{ mb: 1.5, mt: 2 }}>
                      <Grid size={{ xs: 6, sm: 3 }}><StatCard label={intl.formatMessage({ id: "label.tokenConfig.stat.total", defaultMessage: "Total" })} value={configs.length} accent={colors.primary} /></Grid>
                      <Grid size={{ xs: 6, sm: 3 }}><StatCard label={intl.formatMessage({ id: "label.tokenConfig.stat.scopes", defaultMessage: "Scopes" })} value={scopes.length} accent={colors.primaryLight} /></Grid>
                      <Grid size={{ xs: 6, sm: 3 }}><StatCard label={intl.formatMessage({ id: "label.tokenConfig.stat.mappers", defaultMessage: "Mappers" })} value={mappers.length} accent={colors.secondary} /></Grid>
                      <Grid size={{ xs: 6, sm: 3 }}><StatCard label={intl.formatMessage({ id: "label.tokenConfig.stat.enabled", defaultMessage: "Enabled" })} value={enabledCount} accent="#2ecc71" /></Grid>
                    </Grid>

                    <SectionPanel
                      icon={<LayersOutlinedIcon sx={{ fontSize: 18, color: colors.primary }} />}
                      title={intl.formatMessage({ id: "label.tokenConfig.clientScopes", defaultMessage: "Client Scopes" })}
                      subtitle={intl.formatMessage({ id: "label.tokenConfig.scopesSubtitle", defaultMessage: "Default and optional scopes assigned to this client" })}
                      count={scopes.length}
                      search={scopeSearch}
                      onSearchChange={setScopeSearch}
                      expanded={scopesExpanded}
                      onToggleExpanded={() => setScopesExpanded((v) => !v)}
                    >
                      <ConfigTable
                        rows={scopes}
                        onToggle={handleToggle}
                        onMenuOpen={(e, row) => { e.stopPropagation(); setAnchorEl(e.currentTarget); setSelectedRow(row); }}
                        emptyMessage={intl.formatMessage({ id: "label.tokenConfig.emptyScopes", defaultMessage: "No client scopes assigned." })}
                        updatingId={updatingId}
                      />
                    </SectionPanel>

                    <SectionPanel
                      icon={<TuneOutlinedIcon sx={{ fontSize: 18, color: colors.secondary }} />}
                      title={intl.formatMessage({ id: "label.tokenConfig.protocolMappers", defaultMessage: "Protocol Mappers" })}
                      subtitle={intl.formatMessage({ id: "label.tokenConfig.mappersSubtitle", defaultMessage: "User attribute and audience mappers for OIDC tokens" })}
                      count={mappers.length}
                      search={mapperSearch}
                      onSearchChange={setMapperSearch}
                      expanded={mappersExpanded}
                      onToggleExpanded={() => setMappersExpanded((v) => !v)}
                    >
                      <ConfigTable
                        rows={mappers}
                        onToggle={handleToggle}
                        onMenuOpen={(e, row) => { e.stopPropagation(); setAnchorEl(e.currentTarget); setSelectedRow(row); }}
                        emptyMessage={intl.formatMessage({ id: "label.tokenConfig.emptyMappers", defaultMessage: "No protocol mappers configured. Use Add mapper to create one." })}
                        updatingId={updatingId}
                        showMapperKind
                      />
                    </SectionPanel>
                  </>
                )}
              </HBox>
            </HBox>
          </div>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { borderRadius: '8px', border: `1px solid ${colors.border}`, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 150 } } }}>
          <MenuItem onClick={openDeleteMenu} disabled={deleting || !selectedRow || !canDeleteRow(selectedRow)}
            sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: theme.palette.text.primary, py: 0.9 }}
          >
            {selectedRow?.type === 'scope'
              ? intl.formatMessage({ id: "label.tokenConfig.deleteDialog.removeBtn", defaultMessage: "Remove scope" })
              : intl.formatMessage({ id: "label.tokenConfig.deleteDialog.deleteBtn", defaultMessage: "Delete mapper" })}
          </MenuItem>
        </Menu>

        <HDialog disableContentWrapper open={deleteConfirmOpen} onClose={closeDeleteDialog}
          slotProps={{
            paper: {
              sx: {
                borderRadius: "16px",
                border: `1px solid ${border.divider}`,
                boxShadow: `0 12px 30px ${withAlpha(colors.primary, 0.19)}`,
                overflow: "hidden", minWidth: 400
              }
            }
          }}
        >
          <DialogTitle sx={{
            fontWeight: 700,
            fontSize: 16,
            color: text.primary,
            borderBottom: `1px solid ${border.divider}`,
          }}>
            <HBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'transparent' }}>
              <HLabel
                value={deleteTarget?.type === 'scope'
                  ? intl.formatMessage({ id: "label.tokenConfig.deleteDialog.removeScope", defaultMessage: "Remove Client Scope" })
                  : intl.formatMessage({ id: "label.tokenConfig.deleteDialog.deleteMapper", defaultMessage: "Delete Protocol Mapper" })}
                translate={false}
                colon={false}
                align="left"
                sx={{  fontWeight: 700, fontSize: 15 }}
              />
              <IconButton size="small" onClick={closeDeleteDialog} sx={{ color: 'text.secondary' }}>
                <MdClose size={18} />
              </IconButton>
            </HBox>
          </DialogTitle>
          <DialogContent sx={{ pt: 2.5, px: 2.5 }}>
            <HBox sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', background: 'transparent' }}>
              <Box sx={{ mt: 0.2 }}><FiAlertTriangle size={16} color={colors.accent} /></Box>
              <HBox sx={{  fontSize: 13, color: text.secondary, lineHeight: 1.6, background: 'transparent' }}>
                {deleteDialogMessage}
              </HBox>
            </HBox>
          </DialogContent>
          <DialogActions sx={{
            px: 3,
            pb: 2,
            gap: 1,
            borderTop: `1px solid ${border.divider}`,
          }}>
            <HButton
              onClick={closeDeleteDialog}
              variant="outlined"
              label="label.tokenConfig.deleteDialog.cancel"
            />
            <HButton
              onClick={handleDelete}
              disabled={deleting || !deleteTarget}
              variant="contained"
              label={deleteTarget?.type === 'scope'
                ? intl.formatMessage({ id: "label.tokenConfig.deleteDialog.removeBtn", defaultMessage: "Remove scope" })
                : intl.formatMessage({ id: "label.tokenConfig.deleteDialog.deleteBtn", defaultMessage: "Delete mapper" })}
              startIcon={deleting ? <CircularProgress size={12} sx={{ color: text.inverse }} /> : null}
              
            />
          </DialogActions>
        </HDialog>

        <HDialog disableContentWrapper open={addMapperOpen} onClose={() => !savingMapper && setAddMapperOpen(false)} maxWidth="sm" fullWidth scroll="paper" slotProps={{ paper: {
            sx: {
              borderRadius: "16px",
              border: `1px solid ${border.divider}`,
              boxShadow: `0 12px 30px ${withAlpha(colors.primary, 0.19)}`,
              overflow: "hidden",
              maxWidth: 520,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            },
          }}}
        >
          <DialogTitle sx={{
            fontWeight: 700,
            fontSize: 16,
            color: text.primary,
            borderBottom: `1px solid ${border.divider}`,
          }}>
            <HBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', background: 'transparent' }}>
              <HBox sx={{ minWidth: 0, flexDirection: 'column', background: 'transparent' }}>
                <HLabel
                  value={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.title", defaultMessage: "Add Protocol Mapper" })}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{  fontWeight: 700, fontSize: 15 }}
                />
                {clientId && (
                  <HLabel
                    value={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.client", defaultMessage: "Client: {client}" }, { client: clientId })}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{  fontSize: 11, color: text.secondary, mt: 0.4, lineHeight: 1.4 }}
                  />
                )}
              </HBox>
              <IconButton
                size="small"
                onClick={() => setAddMapperOpen(false)}
                disabled={savingMapper}
                sx={{ color: 'text.secondary', flexShrink: 0 }}
              >
                <MdClose size={18} />
              </IconButton>
            </HBox>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              p: 0,
              flex: 1,
              overflowY: 'auto',
              '&.MuiDialogContent-dividers': {
                borderTop: `1px solid ${colors.border}`,
                borderBottom: `1px solid ${colors.border}`,
              },
            }}
          >
            <HBox sx={{ px: 2, py: 2 }}>
              {isDialogLoading ? (
                <HBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 7, gap: 1.5 }}>
                  <CircularProgress size={26} sx={{ color: colors.primary }} />
                  <HLabel
                    value={intl.formatMessage({ id: "label.tokenConfig.loading", defaultMessage: "Loading configuration…" })}
                    translate={false}
                    colon={false}
                    align="center"
                    sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.text.light }}
                  />
                </HBox>
              ) : (
                <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <DialogFormSection
                    step="1"
                    title={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.step1Title", defaultMessage: "Select mapper type" })}
                    subtitle={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.step1Subtitle", defaultMessage: "Choose how this protocol mapper will enrich OIDC tokens." })}
                  >
                    <HBox sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 1.5 }}>
                      {(mapperTypes.length ? mapperTypes : [
                        { value: MAPPER_TYPE_USER_ATTRIBUTE, label: 'User Attribute' },
                        { value: MAPPER_TYPE_AUDIENCE, label: 'Audience' },
                      ]).map((type) => (
                        <MapperTypeOptionCard
                          key={type.value}
                          type={type}
                          selected={mapperForm.mapperType === type.value}
                          onSelect={handleMapperTypeChange}
                          disabled={savingMapper}
                        />
                      ))}
                    </HBox>
                  </DialogFormSection>

                  <Divider />

                  <DialogFormSection
                    step="2"
                    title={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.step2Title", defaultMessage: "Configure {type} mapper" }, { type: mapperTypeLabel(mapperForm.mapperType).toLowerCase() })}
                    subtitle={activeMapperMeta.helper}
                  >
                    {hasNoMapperOptions && (
                      <Alert severity="warning" sx={{ mb: 2, fontFamily: "'Inter',sans-serif", fontSize: 11, borderRadius: '8px' }}>
                        {isAudienceMapper
                          ? intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.noOptionsAudience", defaultMessage: "All realm clients already have audience mappers on this client." })
                          : intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.noOptionsAttribute", defaultMessage: "All user profile attributes already have mappers on this client." })}
                      </Alert>
                    )}

                    {isAudienceMapper ? (
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <HLabel
                            value={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.includedClientAudience", defaultMessage: "Included client audience" })}
                            required
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600, color: theme.palette.text.secondary }}
                          />
                          <HDropdown
                            options={audienceOptions}
                            value={mapperForm.includedClientAudience}
                            onChange={(e) => setMapperForm((f) => ({ ...f, includedClientAudience: e.target.value }))}
                            disabled={availableAudienceClients.length === 0}
                            placeholder={availableAudienceClients.length === 0
                              ? intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.noClientsAvailable", defaultMessage: "No clients available" })
                              : intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.includedClientAudience", defaultMessage: "Included client audience" })}
                            width="100%"
                          />
                          <FormHelperText sx={{ fontFamily: "'Inter',sans-serif", fontSize: 10, mx: 0 }}>
                            {intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.includedClientAudienceHelper", defaultMessage: "Client ID added to the token aud claim" })}
                          </FormHelperText>
                        </HBox>

                        <HTextField
                          size="small"
                          fullWidth
                          label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.customAudience", defaultMessage: "Included custom audience (optional)" })}
                          placeholder={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.customAudiencePlaceholder", defaultMessage: "e.g. my-api-audience" })}
                          value={mapperForm.includedCustomAudience}
                          onChange={(e) => setMapperForm((f) => ({ ...f, includedCustomAudience: e.target.value }))}
                          editable
                          helperText={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.customAudienceHelper", defaultMessage: "Additional static audience value, if required by your resource server" })}
                          FormHelperTextProps={{ sx: { fontFamily: "'Inter',sans-serif", fontSize: 10, mx: 0, background: surfaces.paper } }}
                          sx={dialogFieldSx}
                        />
                      </HBox>
                    ) : (
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <HLabel
                            value={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.userAttribute", defaultMessage: "User attribute" })}
                            required
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{  fontSize: 12, fontWeight: 600, color: text.primary }}
                          />
                          <HDropdown
                            options={attributeOptions}
                            value={mapperForm.userAttribute}
                            onChange={(e) => setMapperForm((f) => ({ ...f, userAttribute: e.target.value }))}
                            disabled={availableAttributes.length === 0}
                            placeholder={availableAttributes.length === 0
                              ? intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.noClientsAvailable", defaultMessage: "No attributes available" })
                              : intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.userAttribute", defaultMessage: "User attribute" })}
                            width="100%"
                          />
                          <FormHelperText sx={{  fontSize: 10, mx: 0 }}>
                            {intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.userAttributeHelper", defaultMessage: "From Keycloak user profile configuration" })}
                          </FormHelperText>
                        </HBox>

                        <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <HLabel
                            value={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.jsonType", defaultMessage: "JSON type" })}
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{  fontSize: 12, fontWeight: 600, color: text.primary }}
                          />
                          <HDropdown
                            options={jsonTypeOptions}
                            value={mapperForm.jsonType}
                            onChange={(e) => setMapperForm((f) => ({ ...f, jsonType: e.target.value }))}
                            width="100%"
                          />
                          <FormHelperText sx={{  fontSize: 10, mx: 0 }}>
                            {intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.jsonTypeHelper", defaultMessage: "Data type of the claim in the issued token" })}
                          </FormHelperText>
                        </HBox>
                      </HBox>
                    )}
                  </DialogFormSection>

                  {(isAudienceMapper ? selectedAudience : selectedAttr) && (
                    <>
                      <Divider />
                      <DialogFormSection step="3" title={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.previewTitle", defaultMessage: "Preview" })} subtitle={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.previewSubtitle", defaultMessage: "Review mapper settings before creating." })}>
                        <HBox sx={{ ...paperSx, p: 2, bgcolor: surfaces.paper, flexDirection: 'column' }}>
                          {isAudienceMapper ? (
                            <>
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.name", defaultMessage: "Mapper name" })} value={`audience-${selectedAudience}`} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.protocolMapper", defaultMessage: "Protocol mapper" })} value="oidc-audience-mapper" />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.includedAudience", defaultMessage: "Included client audience" })} value={selectedAudience} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.customAudience", defaultMessage: "Custom audience" })} value={mapperForm.includedCustomAudience.trim() || '—'} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.accessTokenClaim", defaultMessage: "Access token claim" })} value="Yes" />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.idTokenClaim", defaultMessage: "ID token claim" })} value="No" />
                            </>
                          ) : (
                            <>
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.name", defaultMessage: "Mapper name" })} value={selectedAttr} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.protocolMapper", defaultMessage: "Protocol mapper" })} value="oidc-usermodel-attribute-mapper" />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.claimName", defaultMessage: "Claim name" })} value={selectedAttr} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.userAttribute", defaultMessage: "User attribute" })} value={selectedAttr} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.jsonType", defaultMessage: "JSON type" })} value={mapperForm.jsonType} />
                              <MapperPreviewRow label={intl.formatMessage({ id: "label.tokenConfig.addMapperDialog.preview.claimDest", defaultMessage: "Access / ID / Userinfo" })} value="Enabled" />
                            </>
                          )}
                        </HBox>
                      </DialogFormSection>
                    </>
                  )}
                </HBox>
              )}
            </HBox>
          </DialogContent>

          <DialogActions sx={{
            px: 3,
            pb: 2,
            gap: 1,
            borderTop: `1px solid ${border.divider}`,
          }}>
            <HButton
              onClick={() => setAddMapperOpen(false)}
              disabled={savingMapper}
              variant="outlined"
              label="label.tokenConfig.deleteDialog.cancel"
            />
            <HButton
              onClick={handleAddMapper}
              disabled={savingMapper || isDialogLoading || !canSubmitMapper || hasNoMapperOptions}
              variant="contained"
              startIcon={savingMapper ? null : <FiPlus size={12} />}
              loading={savingMapper}
              label={savingMapper ? "label.tokenConfig.addMapperDialog.creatingBtn" : `Create ${mapperTypeLabel(mapperForm.mapperType)} mapper`}
              sx={{
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '8px',
                textTransform: 'none',
                px: 2.2,
                '&.Mui-disabled': { opacity: 0.6 },
              }}
            />
          </DialogActions>
        </HDialog>
      </HBox>
    </div>
  );
};

export default TokenConfiguration;
