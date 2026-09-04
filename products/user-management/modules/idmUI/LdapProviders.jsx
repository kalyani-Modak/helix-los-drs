import { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Divider,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FiServer, FiPlus, FiAlertTriangle, FiWifi, FiChevronRight } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HButton, HBreadCrumb, TitleBar, useToast, HDialog } from "@helix/component-library";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const colors = {
  primary: '#0378A6', secondary: '#8dbf41', accent: '#bf0404',
  primaryLight: '#4aa3d9', primaryDark: '#025a8c', accentDark: '#a30404',
  bg: { page: 'linear-gradient(145deg,#f8fafc 0%,#f1f5f9 100%)', surface: '#f8fafc' },
  card: 'rgba(255,255,255,0.99)',
  text: { primary: '#0f172a', secondary: '#334155', light: '#64748b', muted: '#94a3b8' },
  border: '#e2e8f0', hover: '#f1f5f9',
};

const paperSx = {
  borderRadius: '1px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04),0 2px 8px rgba(3,120,166,0.06)',
};

// ─── StatusBadge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ enabled }) => (
  <HBox sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
    <HBox sx={{
      width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
      background: enabled ? colors.secondary : colors.text.muted,
      boxShadow: enabled ? `0 0 0 3px ${colors.secondary}25` : 'none',
    }} />
    <HLabel
      value={enabled ? 'ldapProviders.status.enabled' : 'ldapProviders.status.disabled'}
      colon={false}
      translate={true}
      align="left"
      component="span"
      sx={{
        fontFamily: "'Inter',sans-serif",
        fontSize: 11,
        fontWeight: 600,
        color: enabled ? colors.secondary : colors.text.muted,
      }}
    />
  </HBox>
);

// ─── ProviderCard ──────────────────────────────────────────────────────────────
const ProviderCard = ({ provider, onMenuOpen, navigate }) => {
  const intl = useIntl();
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);

  let providerLabel = "LDAP";
  if (provider.providerId) {
    providerLabel = provider.providerId.replaceAll(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
  }

  return (
    <div>
      <HBox
        onClick={() => navigate(`/homelayout/ldap-providers/${provider.id}`)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          ...paperSx,
          cursor: 'pointer',
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 4px 18px rgba(3,120,166,0.14),0 1px 4px rgba(3,120,166,0.08)'
            : paperSx.boxShadow,
        }}
      >
        {/* Top accent bar */}
        <HBox sx={{
          height: 3,
          }}
        />

        <HBox sx={{ p: 2 }}>
          {/* Header row */}
          <HBox sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flex: 1, minWidth: 0 }}>
              {/* Icon */}
              <HBox sx={{
                width: 34, height: 34, borderRadius: '8px', flexShrink: 0,
                border: `1px solid ${colors.primary}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiServer size={16} />
              </HBox>

              {/* Name + type */}
              <HBox sx={{ minWidth: 0 }}>
                <HLabel
                  value={provider.name || intl.formatMessage({ id: "ldapProviders.fallbackName", defaultMessage: "LDAP Provider" })}
                  colon={false}
                  translate={false}
                  align="left"
                  component="div"
                  sx={{
                    fontFamily: "'Inter',sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color:theme.palette.text.primary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                />
                <HLabel
                  value={providerLabel}
                  colon={false}
                  translate={false}
                  align="left"
                  component="div"
                  sx={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 11,
                    color: theme.palette.text.secondary,
                    mt: 0.2,
                  }}
                />
              </HBox>
            </HBox>

            {/* Menu trigger */}
            <IconButton
              size="small"
              onClick={(e) => onMenuOpen(e, provider.id)}
              sx={{
                width: 24, height: 24, color: colors.text.muted, flexShrink: 0, ml: 0.5,
                '&:hover': { color: colors.primary, background: `${colors.primary}10` },
              }}
            >
              <MoreVertIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </HBox>

          <Divider sx={{ borderColor: colors.border, mb: 1.5 }} />

          {/* Footer row */}
          <HBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <StatusBadge enabled={provider.enabled} />
            <HBox sx={{
              display: 'flex', alignItems: 'center', gap: 0.4,
              color: hovered ? colors.primary : colors.text.muted,
            }}>
              <HLabel
                value="ldapProviders.button.configure"
                colon={false}
                translate={true}
                align="left"
                component="span"
                sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600 }}
              />
              <FiChevronRight size={12} />
            </HBox>
          </HBox>
        </HBox>
      </HBox>
    </div>
  );
};

// ─── LdapProviders ─────────────────────────────────────────────────────────────
const LdapProviders = () => {
  const [ldapProviders, setLdapProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const deleteInProgressRef = useRef(false);
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const r = await HAxiosService.GET(UserManagementAPI.fetch_ldap_providers());
        if (isMounted) setLdapProviders((r.data || []).map((p, i) => ({ ...p, id: p.id ?? i })));
      } catch { toast.error(intl.formatMessage({ id: "ldapProviders.toast.loadFailed", defaultMessage: "Failed to load LDAP providers." })); }
      finally { if (isMounted) setLoading(false); }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async () => {
    if (deleteInProgressRef.current) return;
    deleteInProgressRef.current = true;
    setDeleteConfirmOpen(false);
    setDeleting(true);
    try {
      const response = await HAxiosService.DELETE(`${UserManagementAPI.fetch_ldap_providers()}/${selectedProviderId}`);
      if (isApiSuccess(response)) {
        setLdapProviders(p => p.filter(x => x.id !== selectedProviderId));
        toast.success(getApiMsg(response, intl.formatMessage({ id: "ldapProviders.toast.deleted", defaultMessage: "LDAP provider deleted successfully." })));
      } else {
        toast.error(getApiMsg(response, intl.formatMessage({ id: "ldapProviders.toast.deleteFailed", defaultMessage: "Failed to delete LDAP provider." })));
      }
    } catch { toast.error(intl.formatMessage({ id: "ldapProviders.toast.deleteFailed", defaultMessage: "Failed to delete LDAP provider." })); }
    finally { setDeleting(false); deleteInProgressRef.current = false; setSelectedProviderId(null); }
  };

  const enabledCount = ldapProviders.filter(p => p.enabled).length;

  return (
    <div>
      <HBox sx={{ height: '100%', mt: 2, display: 'flex', flexDirection: 'column', width: '100%' }}>

        {/* ── Breadcrumbs and TitleBar ── */}
        <HBox sx={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          <HBreadCrumb />
          <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, flexWrap: "wrap", gap: 2 }}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HBox
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `1px solid ${colors.border}`,
                }}
              >
                <FiServer size={16} color={colors.primary} />
              </HBox>
              <TitleBar
                title={intl.formatMessage({
                  id: "ldapProviders.title",
                  defaultMessage: "LDAP Providers",
                })}
              />

              {/* Count badges */}
              {!loading && ldapProviders.length > 0 && (
                <HBox sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.8, flexShrink: 0, ml: 1 }}>
                  <HBox sx={{
                    px: 0.9, py: 0.15, borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    background: 'rgba(255,255,255,0.7)',
                  }}>
                    <HLabel
                      value={`${ldapProviders.length} ${intl.formatMessage({ id: "ldapProviders.badge.total", defaultMessage: "total" })}`}
                      colon={false}
                      translate={false}
                      align="left"
                      component="span"
                      sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: colors.text.secondary }}
                    />
                  </HBox>
                  {enabledCount > 0 && (
                    <HBox sx={{
                      px: 0.9, py: 0.15, borderRadius: '8px',
                      border: `1px solid ${colors.secondary}33`,
                      background: `${colors.secondary}11`,
                    }}>
                      <HLabel
                        value={`${enabledCount} ${intl.formatMessage({ id: "ldapProviders.badge.active", defaultMessage: "active" })}`}
                        colon={false}
                        translate={false}
                        align="left"
                        component="span"
                        sx={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: colors.secondary }}
                      />
                    </HBox>
                  )}
                </HBox>
              )}
            </HBox>

            {/* Right: Add provider button */}
            <HButton
              variant="contained"
              startIcon={<FiPlus size={12} />}
              onClick={() => navigate("/homelayout/ldap-providers/new")}
              label="ldapProviders.button.add"
              sx={{
                textTransform: 'none',
                fontFamily: "'Inter',sans-serif",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: '6px',
                px: 2,
                py: 0.55,
                boxShadow: 'none',
              }}
            />
          </HBox>
        </HBox>

        {/* ── Centered content wrapper ── */}
        <HBox sx={{ mx: "auto", width: "100%" }}>
          <div style={{ width: "100%" }}>
            <HPaper elevation={0} sx={{ ...paperSx, overflow: 'hidden' }}>
              {/* ── Body ── */}
              <HBox sx={{ p: 2.5, minHeight: "100%" }}>
                {loading ? (
                  <HBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5, width: '100%' }}>
                    <CircularProgress size={26} />
                    <HLabel
                      value="ldapProviders.status.loading"
                      colon={false}
                      translate={true}
                      align="left"
                      component="span"
                      sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.text.muted }}
                    />
                  </HBox>
                ) : ldapProviders.length === 0 ? (
                  <HBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 7, gap: 1.5, width: '100%' }}>
                    {/* Empty state icon */}
                    <HBox sx={{
                      width: 52, height: 52, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FiWifi size={22} color={colors.primary} />
                    </HBox>

                    {/* Empty state text */}
                    <HBox sx={{ textAlign: 'center' }}>
                      <HLabel
                        value="ldapProviders.empty.title"
                        colon={false}
                        translate={true}
                        align="center"
                        component="div"
                        sx={{
                          fontFamily: "'Inter',sans-serif",
                          fontWeight: 700,
                          fontSize: 14,
                          mb: 0.5,
                        }}
                      />
                      <HLabel
                        value="ldapProviders.empty.desc"
                        colon={false}
                        translate={true}
                        align="left"
                        component="div"
                        sx={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: colors.text.muted }}
                      />
                    </HBox>

                    {/* Add first provider button */}
                    <HButton
                      label="ldapProviders.button.addFirst"
                      variant="contained"
                      startIcon={<FiPlus size={13} />}
                      onClick={() => navigate("/homelayout/ldap-providers/new")}
                      sx={{
                        textTransform: 'none',
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 600,
                        borderRadius: '6px',
                        px: 2.5,
                        py: 0.6,
                        fontSize: 13,
                        mt: 0.5,
                      }}
                    />
                  </HBox>
                ) : (
                  <HBox sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' },
                    gap: 2,
                    width: '100%',
                  }}>
                    {ldapProviders.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        navigate={navigate}
                        onMenuOpen={(e, id) => {
                          e.stopPropagation();
                          setAnchorEl(e.currentTarget);
                          setSelectedProviderId(id);
                        }}
                      />
                    ))}
                  </HBox>
                )}
              </HBox>
            </HPaper>
          </div>
        </HBox>

        {/* ── Context Menu ── */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: {
            sx: {
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              minWidth: 140,
            },
          } }}>
          <MenuItem
            onClick={() => { setAnchorEl(null); setDeleteConfirmOpen(true); }}
            disabled={deleting}
            sx={{
              fontFamily: "'Inter',sans-serif",
              fontSize: 12,
              color: colors.accent,
              py: 0.9,
              '&:hover': { background: `${colors.accent}08` },
            }}
          >
            <HLabel value="ldapProviders.menu.delete" translate={true} colon={false} sx={{ fontSize: 'inherit', color: 'inherit', fontFamily: 'inherit' }} />
          </MenuItem>
        </Menu>

        {/* ── Delete Confirm Dialog ── */}
        <HDialog
          open={deleteConfirmOpen}
          onClose={() => { setDeleteConfirmOpen(false); setSelectedProviderId(null); }}
          title={intl.formatMessage({ id: "ldapProviders.dialog.deleteTitle", defaultMessage: "Delete LDAP Provider" })}
          actions={(
            <>
            <HButton
              label="ldapProviders.button.cancel"
              variant="outlined"
              onClick={() => { setDeleteConfirmOpen(false); setSelectedProviderId(null); }}
            />
            <HButton
              label="ldapProviders.button.delete"
              variant="contained"
              onClick={handleDelete}
              disabled={deleting}
              loading={deleting}
              sx={{
                textTransform: 'none',
                fontFamily: "'Inter',sans-serif",
                fontWeight: 600,
                borderRadius: '6px',
                px: 2.5,
                py: 0.6,
                fontSize: 12,
                background: colors.accent,
                boxShadow: 'none',
                '&:hover': { background: colors.accentDark },
              }}
            />
            </>
          )}
        >
            <HBox sx={{ display: 'flex', gap: 1.2, background:"transparent" }}>
              <HBox sx={{ color: colors.accent, mt: 0.2, flexShrink: 0, background:"transparent" }}>
                <FiAlertTriangle size={15} />
              </HBox>
              <HLabel
                value="ldapProviders.dialog.deleteDesc"
                colon={false}
                translate={true}
                align="left"
                component="p"
                sx={{
                  fontFamily: "'Inter',sans-serif",
                  fontSize: 13,
                  // color: colors.text.secondary,
                  lineHeight: 1.65,
                  m: 0,
                }}
              />
            </HBox>
        </HDialog>
      </HBox>
    </div>
  );
};

export default LdapProviders;
