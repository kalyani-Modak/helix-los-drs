import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, ListItemIcon,
  ListItemText, Chip, 
  useTheme} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import { MdDevices } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { UserManagementAPI } from "./apiEndpoints";
import { HAxiosService, HAgGrid, HBox, HButton, HPaper, HLabel, HTextField, HBreadCrumb, TitleBar, HDropdown, useToast, HDialog } from "@helix/component-library";
import { useIntl } from "react-intl";

// ─── Design Tokens (matches PasswordManager) ─────────────────────────────────
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  accentDark: '#a30404',
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

// ─── Shared AG Grid defaults ──────────────────────────────────────────────────
const defaultColDef = {
  sortable: true,
  filter: false,
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

const ShowSessionScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const toast = useToast();
  const realm = sessionStorage.getItem("SEC_REALM");
  const intl = useIntl();
  const theme = useTheme();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await HAxiosService.GET(
          UserManagementAPI.fetch_all_users_sessions(realm)
        );
        const sanitized = (response.data || []).map((s) => ({
          ...s,
          start: typeof s.start === "number" ? s.start : null,
          lastAccess: typeof s.lastAccess === "number" ? s.lastAccess : null,
          clients: s.clients || {},
        }));
        setSessions(sanitized);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        toast.error("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };
    if (realm) fetchSessions();
  }, [realm]);

  const clientAppNames = useMemo(() => {
    const names = new Set();
    sessions.forEach((s) => {
      Object.values(s.clients || {}).forEach((val) => names.add(val));
    });
    return ["All", ...Array.from(names)];
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
        session.ipAddress?.toLowerCase().includes(searchValue.toLowerCase());
      const matchesClient =
        selectedClient === "All" ||
        Object.values(session.clients || {}).includes(selectedClient);
      return matchesSearch && matchesClient;
    });
  }, [sessions, searchValue, selectedClient]);

  const handleMenuOpen = (e, row) => {
    setSelectedRow(row);
    setMenuAnchor(e.currentTarget);
  };
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogoutSession = async () => {
    try {
      if (selectedRow?.id && realm) {
        await HAxiosService.DELETE(
          UserManagementAPI.forcefully_logout_single_user_session(realm, selectedRow.id)
        );
        toast.success(intl.formatMessage({ id: "label.session.logoutSuccess", defaultMessage: "Session logged out successfully." }));
        setSessions((prev) => prev.filter((s) => s.id !== selectedRow.id));
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "label.session.logoutUnsuccess", defaultMessage: "Failed to logged out session." }));
    } finally {
      setOpenLogoutDialog(false);
    }
  };

  const handleLogoutAllUsers = async () => {
    if (!realm) return;
    if (!window.confirm(intl.formatMessage({ id: "label.session.logoutSure", defaultMessage: "Are you sure you want to logout all users?" }))) return;
    try {
      await HAxiosService.DELETE(UserManagementAPI.forcefully_logout_all_users_sessions(realm));
      toast.success(intl.formatMessage({ id: "label.session.users.logoutSuccessful", defaultMessage: "All users have been logged out successfully." }));
      setSessions([]);
    } catch (error) {
      console.error("Failed to logout all users.", error);
      toast.error(intl.formatMessage({ id: "label.session.users.logoutUnsuccess", defaultMessage: "Failed to logout all users." }));
    }
  };

  // ─── AG Grid column definitions ────────────────────────────────────────────
  const columnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.session.username", defaultMessage: "Username" }),
      field: "username",
      minWidth: 130,
      flex: 1,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: 1.25 },
    },
    {
      headerName: intl.formatMessage({ id: "label.session.started", defaultMessage: "Started" }),
      field: "start",
      minWidth: 140,
      flex: 1,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: 1.25 },
      type: "datetime"
    },
    {
      headerName: intl.formatMessage({ id: "label.session.lastAccess", defaultMessage: "Last Access" }),
      field: "lastAccess",
      minWidth: 140,
      flex: 1,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: 1.25 },
      type: "datetime"
    },
    {
      headerName: intl.formatMessage({ id: "label.session.ipAddress", defaultMessage: "IP Address" }),
      field: "ipAddress",
      minWidth: 130,
      flex: 1,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: 1.25, color: colors.text.light },
    },
    {
      headerName: intl.formatMessage({ id: "label.session.clients", defaultMessage: "Clients" }),
      field: "clients",
      minWidth: 150,
      flex: 1.2,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: "normal", lineHeight: 1.25 },
      valueFormatter: ({ value }) => {
        if (!value || typeof value !== "object") return "N/A";
        const names = Object.values(value);
        return names.length ? names.join(", ") : "N/A";
      },
    },
    {
      headerName: intl.formatMessage({ id: "label.session.actions", defaultMessage: "Actions" }),
      field: "actions",
      sortable: false,
      filter: false,
      width: 80,
      cellRenderer: ({ data }) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, data)}
          sx={{
            color: colors.text.muted,
            transition: 'color 0.18s',
            '&:hover': { color: colors.primary, background: `${colors.primary}12` },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ], [intl]);

  return (
    <div>
      <HBox
        sx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          mt: 2
        }}
      >
        {/* Container replacement — full width xl */}
        <div>
          <HBox
            sx={{
              width: '100%',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <HPaper
              elevation={2}
              sx={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >

              {/* ── Animated gradient header ── */}
              <HBox
                sx={{
                  px: 3,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Breadcrumb + TitleBar */}
                <HBox sx={{ flexShrink: 0 }}>
                  <HBreadCrumb />
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                    <HBox
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MdDevices size={20} />
                    </HBox>
                    <TitleBar
                      title={intl.formatMessage({
                        id: "label.session.title",
                        defaultMessage: "Active Sessions",
                      })}
                    />
                  </HBox>
                </HBox>

                {/* Session count badge */}
                {sessions.length > 0 && (
                  <Chip
                    icon={<FiUsers size={13} style={{ marginLeft: 6 }} />}
                    label={`${filteredSessions.length} ${filteredSessions.length === 1 ? intl.formatMessage({ id: "label.session", defaultMessage: "Session" }) : intl.formatMessage({ id: "label.sessions", defaultMessage: "Sessions" })} Active`}
                    size="small"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  />
                )}
              </HBox>

              {/* ── Toolbar row ── */}
              <HBox
                sx={{
                  px: 3,
                  py: 1.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                {/* Search */}
                <HTextField
                  variant="outlined"
                  size="small"
                  placeholder={intl.formatMessage({ id: "label.session.search", defaultMessage: "Search by username or IP" })}
                  editable={true}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  sx={{
                    width: 280,
                    '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif", fontSize: 13 },
                  }}
                />

                {/* Filter by App */}
                <HDropdown
                  options={clientAppNames.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  placeholder={intl.formatMessage({
                    id: "label.session.filterByApp",
                    defaultMessage: "Filter by App",
                  })}
                  width={{ xs: "100%", sm: 200, md: 220 }}
                  sx={{ mb: { xs: -1, sm: -1 } }}
                />

                {/* Logout All — pushed to right */}
                <HBox sx={{ml: "auto"}}>
                    <HButton
                      label={intl.formatMessage({ id: "label.session.logoutAll", defaultMessage: "Logout All" })}
                      variant="contained"
                      onClick={handleLogoutAllUsers}
                      startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                    />
                </HBox>
              </HBox>

              {/* ── HAgGrid ── */}
              <HBox
                sx={{
                  flex: 1,
                  minHeight: 0,
                  px: 2,
                  py: 1.5,
                }}
              >
                <HAgGrid
                  rowData={filteredSessions}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  gridStyle={gridStyle}
                  gridClassName="drs-list-grid drs-sessions-grid"
                  embeddedInSection
                  pagination
                  paginationPageSize={10}
                  sort
                  loading={loading}
                  getRowId={({ data }) => data.id}
                />
              </HBox>

            </HPaper>
          </HBox>
        </div>

        {/* ── Context Menu ── */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} slotProps={{ paper: {
            sx: {
              borderRadius: '10px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 8px 24px ${colors.primary}20`,
              fontFamily: "'Inter', sans-serif",
            },
          } }}>
          <MenuItem
            onClick={() => { handleMenuClose(); setOpenLogoutDialog(true); }}
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: colors.accent,
              '&:hover': { background: `${colors.accent}10` },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: colors.accent }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              Logout Session
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* ── Confirm Logout Dialog ── */}
        <HDialog disableContentWrapper open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} slotProps={{ paper: {
            sx: {
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              boxShadow: `0 12px 30px ${colors.primary}30`,
              fontFamily: "'Inter', sans-serif",
            },
          } }}>
          <DialogTitle
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            {intl.formatMessage({ id: "label.session.confirmLogout", defaultMessage: "Confirm Logout" })}
          </DialogTitle>
          <DialogContent sx={{ pt: 2.5 }}>
            <HLabel
              // value={
              //   <>
              //     Are you sure you want to logout this session for user{" "}
              //     <strong style={{ color: theme.palette.text.primary }}>{selectedRow?.username}</strong>?
              //   </>
              // }
              value={intl.formatMessage(
                {
                  id: "label.sessions.logoutDialog.confirmMessage",
                  defaultMessage: "Are you sure you want to logout this session for user <strong>{username}</strong>?",
                },
                {
                  username: selectedRow?.username,
                  strong: (chunks) => (
                    <strong style={{ color: theme.palette.text.primary }}>{chunks}</strong>
                  ),
                }
              )}
              colon={false}
              translate={false}
              align="left"
              component="div"
              sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: theme.palette.text.secondary }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <HButton
              label={intl.formatMessage({ id: "label.session.cancel", defaultMessage: "Cancel" })}
              variant="outlined"
              onClick={() => setOpenLogoutDialog(false)}
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '8px',
              }}
            />
            <HButton
              label={intl.formatMessage({ id: "label.session.logout", defaultMessage: "Logout" })}
              variant="contained"
              onClick={handleLogoutSession}
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                borderRadius: '8px',
              }}
            />
          </DialogActions>
        </HDialog>

      </HBox>
    </div>
  );
};

export default ShowSessionScreen;