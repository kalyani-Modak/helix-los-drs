import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  IconButton, Fade, InputAdornment,
  CircularProgress, Chip, TextField, MenuItem
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import ArrowBackIcon           from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon       from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon       from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon       from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon        from "@mui/icons-material/LockOutlined";
import SaveOutlinedIcon        from "@mui/icons-material/SaveOutlined";
import SearchIcon              from "@mui/icons-material/Search";
import LockResetIcon           from "@mui/icons-material/LockReset";
import AssignmentIndIcon       from "@mui/icons-material/AssignmentInd";
import Visibility              from "@mui/icons-material/Visibility";
import VisibilityOff           from "@mui/icons-material/VisibilityOff";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon    from "@mui/icons-material/AddCircleOutline";
import { useIntl } from "react-intl";
import { useParams, useNavigate } from "react-router-dom";
import { UserManagementAPI } from "./apiEndpoints";
import { ClientDetailsAPI }  from "./apiEndpoints";
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { gridReportToDefObj }  from "../../../common/components/SearchGridDefObj";
import { HAxiosService, HAgGrid, useDrsTheme, SearchCommonBox, HBox, HButton, HTextField, HLabel, HPaper, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";

const getInputSx = (theme) => ({
  '& .MuiInputBase-root': {
    fontFamily:"'Inter',sans-serif", fontSize:13, borderRadius:'8px', height:36,
    bgcolor: theme.palette.background.paper,
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: "divider" },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.primary.main, 0.48) },
  '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main, borderWidth:'1.5px' },
  '& .MuiInputAdornment-root svg': { fontSize:15, color: theme.palette.text.secondary },
});

/** Unwrap map payloads from axios / gateway wrappers. */
const unwrapRoleMap = (payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};
  if (payload.responseJson && typeof payload.responseJson === "object" && !Array.isArray(payload.responseJson)) {
    return payload.responseJson;
  }
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data) && !payload.status) {
    return payload.data;
  }
  // Drop non-client wrapper keys if present alongside real client maps
  const skip = new Set(["status", "msg", "message"]);
  const entries = Object.entries(payload).filter(([k, v]) => !skip.has(k) && Array.isArray(v));
  if (entries.length) return Object.fromEntries(entries);
  return payload;
};

/** Available roles: Map<clientId, Role[]> → Role[] with name/id. */
const normalizeAvailableRoles = (payload) => {
  const map = unwrapRoleMap(payload);
  const out = {};
  Object.entries(map).forEach(([group, roles]) => {
    if (!Array.isArray(roles)) return;
    out[group] = roles
      .map((r, idx) => {
        if (typeof r === "string") return { id: `${group}-${r}`, name: r, description: "" };
        if (r && typeof r === "object" && r.name) {
          return { id: r.id || `${group}-${r.name}-${idx}`, name: r.name, description: r.description || "" };
        }
        return null;
      })
      .filter(Boolean);
  });
  return out;
};

/** Assigned roles: Map<clientId, Set|string[]|Role[]> → Map<clientId, string[]>. */
const normalizeAssignedRoles = (payload) => {
  const map = unwrapRoleMap(payload);
  const out = {};
  Object.entries(map).forEach(([group, roles]) => {
    const list = Array.isArray(roles)
      ? roles
      : roles && typeof roles === "object"
        ? Object.values(roles)
        : [];
    const names = list
      .map((r) => (typeof r === "string" ? r : r?.name))
      .filter(Boolean);
    if (names.length) out[group] = names;
  });
  return out;
};

// ── Field label — uppercase, muted, compact ──────────────────────────────────
const FL = ({ label }) => {
  const theme = useTheme();
  return (
    <HLabel
      value={label}
      translate={false}
      colon={false}
      align="left"
      sx={{
        fontFamily: "'Inter',sans-serif",
        fontWeight: 700,
        fontSize: 10.5,
        color: theme.palette.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        mb: 0.4,
      }}
    />
  );
};

// ── Section heading with icon, label, and a faint rule ───────────────────────
const SectionHeading = ({ icon, label }) => {
  const theme = useTheme();
  return (
    <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <HBox
        sx={{
          width: 26, height: 26, borderRadius: '7px',
          background: alpha(theme.palette.primary.main, 0.12),
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 14 } })}
      </HBox>
      <HLabel
        value={label}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontFamily: "'Inter',sans-serif",
          fontWeight: 700,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      />
      <HBox sx={{ flex: 1, height: '1px', background: alpha(theme.palette.primary.main, 0.2) }} />
    </HBox>
  );
};

// ── Sidebar navigation item ───────────────────────────────────────────────────
const NavItem = ({ icon, label, active, onClick }) => {
  const theme = useTheme();
  return (
    <HBox
      onClick={onClick}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.2,
        px: 2, py: 1, mx: 1, mb: 0.5, borderRadius: '10px', cursor: 'pointer',
        background: active ? alpha(theme.palette.primary.main, 0.16) : 'transparent',
        borderLeft: active ? `3px solid ${theme.palette.common.white}` : '3px solid transparent',
        transition: 'all 0.18s',
      }}
    >
      <HBox sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </HBox>
      {/* Nav label — HLabel with conditional weight/color for active state */}
      <HLabel
        value={label}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontFamily: "'Inter',sans-serif",
          fontWeight: active ? 700 : 500,
          fontSize: 12.5,
        }}
      />
      {active && (
        <HBox sx={{ ml: 'auto', width: 6, height: 6, borderRadius: '50%', background: theme.palette.common.white }} />
      )}
    </HBox>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
function CreateUser() {
  const theme   = useTheme();
  const palette = theme.palette;
  const iSx     = getInputSx(theme);
  const toast    = useToast();
  const intl    = useIntl();
  const navigate = useNavigate();
  const { userId, userNameId } = useParams();
  const realm    = sessionStorage.getItem("SEC_REALM");
  const product  = sessionStorage.getItem("SEC_PRODUCT");

  const [activeSection, setActiveSection] = useState('details');

  // form
  const [users, setUsers]       = useState([]);
  const [formData, setFormData] = useState({ userName:"", email:"", firstName:"", lastName:"", password:"", reportingTo:"", userType:"INTERNAL" });

  // roles
  const [roleGroups, setRoleGroups]                     = useState({});
  const [roleSearch, setRoleSearch]                     = useState("");
  const [selectedRolesByGroup, setSelectedRolesByGroup] = useState({});
  const [rolesLoading, setRolesLoading]                 = useState(false);
  const [assignLoading, setAssignLoading]               = useState(false);

  // assigned
  const [assignedRoles, setAssignedRoles]   = useState({});
  const [assignedLoading, setAssignedLoading] = useState(false);

  // password
  const [credentials, setCredentials]     = useState(null);
  const [password, setPassword]           = useState("");
  const [confirmPwd, setConfirmPwd]       = useState("");
  const [showPwd, setShowPwd]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [pwdLoading, setPwdLoading]       = useState(false);
  const { themeVars, text } = useDrsTheme();

  // ── Data fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (userId) {
      HAxiosService.GET(UserManagementAPI.get_user_data(userId, realm))
        .then(r=>{ if(isHttpSuccess(r)) setFormData(p=>({...p,...r.data})); })
        .catch(()=>toast.error("Error fetching user data"));
    }
  }, [userId, realm]);

  useEffect(() => {
    if (userId) {
      setRolesLoading(true);
      HAxiosService.GET(ClientDetailsAPI.ROLES(realm))
        .then((r) => setRoleGroups(normalizeAvailableRoles(r?.data)))
        .catch(() => toast.error("Failed to load roles"))
        .finally(() => setRolesLoading(false));
    }
  }, [userId, realm]);

  useEffect(() => {
    if (userId) {
      HAxiosService.GET(UserManagementAPI.get_user_credentials(realm, userId))
        .then(r=>setCredentials(r.data)).catch(()=>{});
    }
  }, [userId, realm]);

  const fetchAssignedRoles = () => {
    if (!userId) return;
    setAssignedLoading(true);
    HAxiosService.GET(UserManagementAPI.fetchUsersInRole(realm, userNameId))
      .then((r) => setAssignedRoles(normalizeAssignedRoles(r?.data)))
      .catch(() => toast.error("Failed to load assigned roles"))
      .finally(() => setAssignedLoading(false));
  };
  useEffect(()=>{ if(userId) fetchAssignedRoles(); },[userId]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const hChange = key => e => setFormData(p=>({...p,[key]:e.target.value}));

  const handleSubmit = () => {
    const {userName,email,firstName,lastName,password:pw,userType} = formData;
    if(!userName||!email||!firstName||!lastName||!userType||(!pw&&!userId)){ toast.error("All fields required"); return; }
    const method = userId?"PUT":"POST";
    const data   = userId?{...formData,realm,id:userId}:{...formData,realm};
    HAxiosService[method](UserManagementAPI.user(), data)
      .then(r=>{
        if(isApiSuccess(r)){ toast.success(getApiMsg(r,"Saved")); setTimeout(()=>navigate("/homelayout/users"),1000); }
        else toast.error(getApiMsg(r, "Failed to create user"));
      }).catch(()=>{});// suppressed — .then() already handles all response cases since validateStatus accepts all statuses
  };

  const handleRoleToggle = (name, group) => {
    setSelectedRolesByGroup(p=>{
      const cur=p[group]||[];
      const upd=cur.includes(name)?cur.filter(r=>r!==name):[...cur,name];
      return upd.length>0?{...p,[group]:upd}:Object.fromEntries(Object.entries(p).filter(([k])=>k!==group));
    });
  };

const getUsers = useCallback(async () => {
  try {
    const response = await HAxiosService.GET(
      UserManagementAPI.fetch_users(realm)
    );
    // Wrap response in responseJson format expected by SearchCommonBox
    return {
      data: {
        responseJson: response.data || []
      }
    };
  } catch (e) {
    console.error("Error fetching users:", e);
    return {
      data: {
        responseJson: []
      }
    };
  }
}, [realm]);

  const handleAssignRoles = () => {
    if(!Object.keys(selectedRolesByGroup).length){ toast.warn("Select at least one role"); return; }
    setAssignLoading(true);
    HAxiosService.POST(UserManagementAPI.assign_role(),{realm,userName:userNameId,roles:selectedRolesByGroup})
      .then(r=>{
        if(isApiSuccess(r)){ toast.success(getApiMsg(r,"Roles assigned")); setSelectedRolesByGroup({}); fetchAssignedRoles(); }
        else toast.error(getApiMsg(r,"Failed"));
      }).catch(()=>toast.error("Error")).finally(()=>setAssignLoading(false));
  };

  const handleUnassign = (clientId, roleName) => {
    // Backend expects product = Keycloak clientId of the role group, not session SEC_PRODUCT
    const roleProduct = clientId || product;
    HAxiosService.DELETE(UserManagementAPI.unassign_role(realm, roleProduct, userNameId, roleName))
      .then((r) => {
        if (isApiSuccess(r)) {
          toast.success(getApiMsg(r, "Role unassigned"));
          fetchAssignedRoles();
        } else toast.warn(getApiMsg(r, "Failed"));
      })
      .catch(() => toast.error("Error unassigning role"));
  };

  const handleResetPwd = () => {
    if(!password||!confirmPwd){ toast.error("Fill all fields"); return; }
    if(password!==confirmPwd){ toast.error("Passwords don't match"); return; }
    setPwdLoading(true);
    HAxiosService.PUT(UserManagementAPI.reset_password(),{id:userId,password,realm,action:"UPDATE_PASSWORD"})
      .then(r=>{
        if(isApiSuccess(r)){ toast.success(getApiMsg(r,"Password reset")); setPassword(""); setConfirmPwd(""); }
        else toast.error("Failed to reset password");
      }).catch(()=>toast.error("Failed")).finally(()=>setPwdLoading(false));
  };

  // ── Derived data ─────────────────────────────────────────────────────────────
  const roleRows = useMemo(() => {
    const rows = [];
    const q = roleSearch.toLowerCase();
    Object.entries(roleGroups).forEach(([group, roles]) => {
      (roles || [])
        .filter((r) => (r?.name || "").toLowerCase().includes(q))
        .forEach((r) =>
          rows.push({
            id: `${group}-${r.id || r.name}`,
            name: r.name,
            description: r.description || "—",
            group,
          })
        );
    });
    return rows;
  }, [roleGroups, roleSearch]);

  const selectedCount  = Object.values(selectedRolesByGroup).flat().length;
  const assignedCount  = Object.values(assignedRoles).flat().length;

  // ── Role grid column defs ─────────────────────────────────────────────────
  const roleColumnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.createUser.roleName", defaultMessage: "Role Name" }),
      field: "name",
      flex: 1,
      filter: false,
      cellRenderer: (params) => (
        // HLabel as inline cell renderer — matches FollowupDetails text style
        <HLabel
          value={params.value}
          translate={false}
          colon={false}
          align="left"
          sx={{
            fontFamily: "'Inter',sans-serif",
            fontSize: 13,
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "label.createUser.roleDesc", defaultMessage: "Description" }),
      field: "description",
      flex: 1.4,
      filter: false,
      cellStyle: { fontSize: 12 },
    },
    {
      headerName: intl.formatMessage({ id: "label.createUser.roleGroup", defaultMessage: "Group" }),
      field: "group",
      width: 150,
      filter: false,
      cellStyle: { fontSize: 12 },
    },
    {
      headerName: intl.formatMessage({ id: "label.createUser.roleAction", defaultMessage: "Action" }),
      field: "action",
      width: 130,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const isSel = selectedRolesByGroup[params.data.group]?.includes(params.data.name) || false;
        return (
          <HButton
            size="small"
            translate={false}
            label={isSel ? intl.formatMessage({ id: "label.createUser.remove", defaultMessage: "Remove" }) : intl.formatMessage({ id: "label.createUser.add", defaultMessage: "Add" })}
            onClick={() => handleRoleToggle(params.data.name, params.data.group)}
            startIcon={isSel ? <RemoveCircleOutlineIcon sx={{ fontSize: 12 }} /> : <AddCircleOutlineIcon sx={{ fontSize: 12 }} />}
            sx={{
              fontFamily: "'Inter',sans-serif",
              fontWeight: 600, fontSize: 11, textTransform: 'none',
              height: 30, px: 1.2, borderRadius: '6px', minWidth: 0,
              color: isSel ? palette.error.main : palette.primary.main,
              background: isSel ? alpha(palette.error.main, 0.12) : alpha(palette.primary.main, 0.1),
              '&:hover': { background: isSel ? alpha(palette.error.main, 0.18) : alpha(palette.primary.main, 0.15) },
            }}
          />
        );
      },
    },
  ], [intl, palette.text.primary, palette.text.secondary, palette.primary.main, palette.error.main, selectedRolesByGroup]);

  const navItems = [
    { key:'details',  label:intl.formatMessage({id: "label.createUser.userDetails", defaultMessage: "User Details"}),   icon:<BadgeOutlinedIcon  sx={{fontSize:16}}/> },
    { key:'roles',    label:intl.formatMessage({id: "label.createUser.roleMapping", defaultMessage: "Role Mapping"}),   icon:<AssignmentIndIcon  sx={{fontSize:16}}/> },
    { key:'assigned', label:intl.formatMessage({id: "label.createUser.assignedRoles", defaultMessage: "Assigned Roles"}), icon:<AssignmentIndIcon  sx={{fontSize:16}}/> },
    { key:'password', label:intl.formatMessage({id: "label.createUser.resetPassword", defaultMessage: "Reset Password"}), icon:<LockResetIcon      sx={{fontSize:16}}/> },
  ].filter(n=>userId||n.key==='details');

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Fade in timeout={500}>
      <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <HBox sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── Breadcrumb + TitleBar ── */}
          <HBox sx={{ flexShrink: 0, height: '8%' }}>
            <HBreadCrumb />
            <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <IconButton
                onClick={() => navigate("/homelayout/users")}
                size="small"
                sx={{
                  borderRadius: '7px', p: 0.5,
                  '&:hover': { background: alpha(palette.primary.main, 0.18) },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <TitleBar
                title={userId
                  ? intl.formatMessage({ id: "label.user.editUser", defaultMessage: "Edit User" })
                  : intl.formatMessage({ id: "label.user.createUser", defaultMessage: "Create User" })
                }
              />
              {userId && (
                <HLabel
                  value={userNameId}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{
                    fontFamily: "'Inter',sans-serif",
                    fontSize: 13,
                  }}
                />
              )}
            </HBox>
          </HBox>

          {/* ── Body ── */}
          <HBox sx={{ flex: 1, display: 'flex', overflow: 'hidden', bgcolor: palette.primary.main, }}>

            {/* Sidebar */}
            {userId && (
              <HBox sx={{
                width: 210, flexShrink: 0,
                display: 'flex', flexDirection: 'column',
                boxShadow: '2px 0 12px rgba(0,0,0,0.12)',
              }}>
                {/* Avatar block */}
                <HBox sx={{ px: 2, pb: 2, mb: 0, flexDirection: 'column', background: "var(--drs-button-outline-bg, transparent)",}}>
                  <HBox sx={{
                    width: 44, height: 44, borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1,
                  }}>
                    {/* Initials — HLabel as avatar text */}
                    <HLabel
                      value={`${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 800,
                        fontSize: 18,
                      }}
                    />
                  </HBox>

                  {/* Full name */}
                  <HLabel
                    value={`${formData.firstName} ${formData.lastName}`}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      lineHeight: 1.3,
                    }}
                  />

                  {/* Email */}
                  <HLabel
                    value={formData.email}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 11,
                    }}
                  />

                  {assignedCount > 0 && (
                    <Chip
                      label={`${assignedCount} role${assignedCount > 1 ? 's' : ''}`}
                      size="small"
                      sx={{
                        mt: 0.8, height: 18,
                        fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600,
                      }}
                    />
                  )}
                </HBox>
                {/* <Divider sx={{mb: 0}}/> */}

                {/* Nav items */}
                <HBox sx={{ flex: 1, pt: 0, flexDirection: 'column', background: "var(--drs-button-outline-bg, transparent)", }}>
                  {navItems.map(n => (
                    <NavItem
                      key={n.key}
                      icon={n.icon}
                      label={n.label}
                      active={activeSection === n.key}
                      onClick={() => setActiveSection(n.key)}
                    />
                  ))}
                </HBox>

                {/* Sidebar footer note */}
                <HBox sx={{ px: 2, pt: 0, borderTop: '1px solid rgba(255,255,255,0.1)', background: "var(--drs-button-outline-bg, transparent)" }}>
                  <HLabel
                    value={intl.formatMessage({ id: "label.createUser.requiredfields", defaultMessage: "* Required Fields" })}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 10.5,
                    }}
                  />
                </HBox>
              </HBox>
            )}

            {/* ── Content area ── */}
            <HBox sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* Section title strip */}
              <HBox sx={{
                px: 3, py: 1.2,
                borderBottom: `1px solid ${alpha(palette.divider, 1)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
              }}>
                <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {navItems.find(n => n.key === activeSection) && React.cloneElement(
                    navItems.find(n => n.key === activeSection).icon,
                    { sx: { fontSize: 17} }
                  )}
                  {/* Active section title — HLabel matching panel header style */}
                  <HLabel
                    value={navItems.find(n => n.key === activeSection)?.label}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: palette.text.primary,
                    }}
                  />
                </HBox>

                {activeSection === 'roles' && selectedCount > 0 && (
                  <HButton
                    variant="contained"
                    size="small"
                    translate={false}
                    label={assignLoading ? 'Assigning…' : `Assign ${selectedCount} Role${selectedCount > 1 ? 's' : ''}`}
                    onClick={handleAssignRoles}
                    disabled={assignLoading}
                    sx={{
                      fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12,
                      borderRadius: '7px', textTransform: 'none', height: 30, px: 2,
                      background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                      boxShadow: `0 3px 8px ${alpha(palette.primary.main, 0.35)}`,
                    }}
                  />
                )}
              </HBox>

              {/* ── Scrollable content ── */}
              <HBox sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2.5 }}>

                {/* ══ USER DETAILS ══ */}
                {activeSection === 'details' && (
                  <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SectionHeading icon={<BadgeOutlinedIcon />} label={intl.formatMessage({ id: "label.createUser.identity", defaultMessage: "Identity" })} />

                    <HBox sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))' },
                      gap: 4,
                      alignItems: 'start',
                    }}>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.name", defaultMessage: "Username *" })} />
                        <HTextField
                          value={formData.userName} onChange={hChange("userName")} editable={true}
                          fullWidth size="small" placeholder={intl.formatMessage({ id: "label.placeholder.username", defaultMessage: "Enter Username" })}
                          InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment> }}
                          sx={{ width: '100%' }} width="100%"
                        />
                      </HBox>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.emailaddress", defaultMessage: "Email Address *" })} />
                        <HTextField
                          value={formData.email} onChange={hChange("email")} editable={true}
                          fullWidth size="small" type="email" placeholder={intl.formatMessage({ id: "label.placeholder.email", defaultMessage: "Enter Email" })}
                          InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon /></InputAdornment> }}
                          sx={{ width: '100%' }} width="100%"
                        />
                      </HBox>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.firstname", defaultMessage: "First Name *" })} />
                        <HTextField
                          value={formData.firstName} onChange={hChange("firstName")} editable={true}
                          fullWidth size="small" placeholder={intl.formatMessage({ id: "label.placeholder.firstname", defaultMessage: "Enter First Name" })}
                          sx={{ width: '100%' }} width="100%"
                        />
                      </HBox>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.lastname", defaultMessage: "Last Name *" })} />
                        <HTextField
                          value={formData.lastName} onChange={hChange("lastName")} editable={true}
                          fullWidth size="small" placeholder={intl.formatMessage({ id: "label.placeholder.lastname", defaultMessage: "Enter Last Name" })}
                          sx={{ width: '100%' }} width="100%"
                        />
                      </HBox>
                      {!userId && (
                        <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <FL label={intl.formatMessage({ id: "label.createUser.password", defaultMessage: "Password *" })} />
                          <HTextField
                            value={formData.password} onChange={hChange("password")} editable={true}
                            fullWidth size="small" type="password" placeholder={intl.formatMessage({ id: "label.placeholder.password", defaultMessage: "Set Password" })}
                            InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment> }}
                            sx={{ width: '100%' }} width="100%"
                          />
                        </HBox>
                      )}
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.userType", defaultMessage: "User Type *" })} />
                        <TextField
                          select
                          value={formData.userType}
                          onChange={hChange("userType")}
                          fullWidth
                          size="small"
                          placeholder={intl.formatMessage({ id: "label.placeholder.userType", defaultMessage: "Select User Type" })}
                          InputProps={{ startAdornment:<InputAdornment position="start"><PersonOutlineIcon/></InputAdornment> }}
                          sx={iSx}
                        >
                          <MenuItem value="INTERNAL">Internal</MenuItem>
                          <MenuItem value="EXTERNAL">External</MenuItem>
                        </TextField>
                      </HBox>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.reportingto", defaultMessage: "Reporting To" })} />
                        <SearchCommonBox
                          customFetchFunction={getUsers}
                          searchCode="USERNAME"
                          setSelectedValue={(value) => setFormData((prev) => ({ ...prev, reportingTo: value }))}
                          selectedValue={formData.reportingTo}
                          selectedColumn="userName"
                          gridDefObj={gridReportToDefObj}
                          gridWidth={350}
                          gridHeight={300}
                          gridNoOfRowsPerPage={5}
                          searchBoxWidth="100%"
                          searchBoxHeight={30}
                          searchBoxFontSize={12}
                          placeholder={intl.formatMessage({ id: "label.placeholder.reportingto", defaultMessage: "Select Reporting To" })}
                        />
                      </HBox>
                    </HBox>

                    {/* Save / Update footer */}
                    <HBox sx={{
                      mt: 3, pt: 2,
                      borderTop: `1px solid ${alpha(palette.divider, 1)}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <HLabel
                        value={intl.formatMessage({ id: "label.createUser.requiredfields", defaultMessage: "* Required Fields" })}
                        translate={false}
                        colon={false}
                        align="left"
                        sx={{
                          fontFamily: "'Inter',sans-serif",
                          fontSize: 11,
                          color: palette.text.secondary,
                        }}
                      />
                      <HBox sx={{ display: 'flex', gap: 1, alignItems: "center", "& .MuiButton-root": {
                            height: "40px", whiteSpace: "nowrap"}
                      }}>
                        <HButton
                          variant="outlined"
                          onClick={() => navigate("/homelayout/users")}
                          size="large"
                          translate={false}
                          label={intl.formatMessage({ id: "label.createUser.cancel", defaultMessage: "Cancel" })}
                        />
                        <HButton
                          variant="contained"
                          onClick={handleSubmit}
                          size="large"
                          translate={false}
                          label={userId ? intl.formatMessage({ id: "label.createUser.updateUser", defaultMessage: "Update User" }) : intl.formatMessage({ id: "label.user.saveUser", defaultMessage: "Save User" })}
                          startIcon={<SaveOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                          sx={{
                            fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 12,
                            borderRadius: '7px', textTransform: 'none', height: 40, px: 2,
                          }}
                        />
                      </HBox>
                    </HBox>
                  </HBox>
                )}

              {/* ══ ROLE MAPPING ══ */}
              {activeSection==='roles' && (
                  <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SectionHeading icon={<AssignmentIndIcon />} label={intl.formatMessage({ id: "label.createUser.availableRoles", defaultMessage: "Available Roles" })} />

                    <HBox sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      mb: 1.5, flexWrap: 'wrap', gap: 1,
                    }}>
                      {/* Search bar */}
                      <HBox sx={{
                        display: 'flex', alignItems: 'center', gap: 0.8,
                        border: "divider",
                        borderRadius: '8px', px: 1.2, height: 34, minWidth: 260,
                        transition: 'all 0.2s',
                        '&:focus-within': {
                          borderColor: palette.primary.main,
                          boxShadow: `0 0 0 2px ${alpha(palette.primary.main, 0.15)}`,
                        },
                      }}>
                        <SearchIcon sx={{ fontSize: 14, color: palette.text.secondary }} />
                        <input
                          value={roleSearch}
                          onChange={e => setRoleSearch(e.target.value)}
                          placeholder={intl.formatMessage({ id: "label.placeholder.searchRoles", defaultMessage: "Search Roles..." })}
                          style={{
                            border: 'none', outline: 'none', background: 'transparent',
                            fontFamily: "'Inter',sans-serif", fontSize: 12.5,
                            color: palette.text.primary, width: '100%',
                          }}
                        />
                      </HBox>

                      {selectedCount > 0 && (
                        <Chip
                          label={`${selectedCount} selected`}
                          size="small"
                          sx={{
                            fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 11.5,
                            bgcolor: alpha(palette.primary.main, 0.12),
                            border: `1px solid ${alpha(palette.primary.main, 0.3)}`,
                          }}
                        />
                      )}
                    </HBox>

                    {rolesLoading ? (
                      <HBox sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress size={32} />
                      </HBox>
                    ) : (
                      // HPaper replaces the bare MUI Paper for the roles grid wrapper
                      <HPaper
                        elevation={0}
                        sx={{
                          border: `1px solid ${alpha(palette.divider, 1)}`,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          bgcolor: "background.paper",
                        }}
                      >
                        <HAgGrid
                          rowData={roleRows}
                          columnDefs={roleColumnDefs}
                          gridStyle={{ width: '100%', height: '100%', '--ag-borders': 'none' }}
                          gridClassName="drs-list-grid drs-role-mapping-grid"
                          loading={rolesLoading}
                          pagination
                          paginationPageSize={10}
                        />
                      </HPaper>
                    )}
                  </HBox>
                )}

                {/* ══ ASSIGNED ROLES ══ */}
                {activeSection === 'assigned' && (
                  <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SectionHeading icon={<AssignmentIndIcon />} label={intl.formatMessage({ id: "label.createUser.assignedRoles", defaultMessage: "Assigned Roles" })} />

                    {assignedLoading ? (
                      <HBox sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress size={32} />
                      </HBox>
                    ) : Object.keys(assignedRoles).length === 0 ? (
                      // Empty state
                      <HBox sx={{
                        py: 8, textAlign: 'center',
                        border: `1px solid ${alpha(palette.divider, 1)}`,
                        borderRadius: '12px',
                      }}>
                        <AssignmentIndIcon sx={{ fontSize: 44, color: palette.text.secondary, mb: 1 }} />
                        <HLabel
                          value={intl.formatMessage({ id: "label.createUser.noRoles", defaultMessage: "No roles assigned yet" })}
                          translate={false}
                          colon={false}
                          align="center"
                          sx={{
                            fontFamily: "'Inter',sans-serif",
                            fontSize: 13.5,
                            color: palette.text.secondary,
                          }}
                        />
                      </HBox>
                    ) : (
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {Object.entries(assignedRoles).map(([group, roles]) => (
                          <HBox key={group} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                            {/* Group heading — HLabel styled like FollowupDetails section labels */}
                            <HLabel
                              value={group}
                              translate={false}
                              colon={false}
                              align="left"
                              sx={{
                                fontFamily: "'Inter',sans-serif",
                                fontWeight: 700,
                                fontSize: 11.5,
                                color: palette.text.secondary,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                mb: 1,
                              }}
                            />
                            <HBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                              {(roles || []).map(role => (
                                <HBox
                                  key={role}
                                  sx={{
                                    display: 'flex', alignItems: 'center', gap: 0.8,
                                    px: 1.5, py: 0.5, borderRadius: '8px',
                                    border: `1px solid ${alpha(palette.divider, 1)}`,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  {/* Role name chip text — HLabel */}
                                  <HLabel
                                    value={role}
                                    translate={false}
                                    colon={false}
                                    align="left"
                                    sx={{
                                      fontFamily: "'Inter',sans-serif",
                                      fontSize: 12.5,
                                      color: palette.text.primary,
                                      fontWeight: 500,
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleUnassign(group, role)}
                                    sx={{ p: 0.2, color: palette.text.secondary, '&:hover': { color: palette.error.main } }}
                                  >
                                    <RemoveCircleOutlineIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </HBox>
                              ))}
                            </HBox>
                          </HBox>
                        ))}
                      </HBox>
                    )}
                  </HBox>
                )}

              {/* ══ RESET PASSWORD ══ */}
              {activeSection==='password' && (
                <HBox sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <SectionHeading icon={<LockResetIcon/>} label={intl.formatMessage({ id: "label.createUser.resetPassword", defaultMessage: "Reset Password" })}/>

                    {credentials && credentials.length > 0 && (
                      // HPaper replaces the inline-styled MUI Paper for credentials info card
                      <HPaper
                        elevation={0}
                        sx={{
                          p: 2, mb: 2.5,
                          border: `1px solid ${alpha(palette.divider, 1)}`,
                          borderRadius: '10px',
                          display: 'flex',
                          gap: 3,
                          bgcolor: "background.paper",
                        }}
                      >
                        <HBox sx={{ background: "transparent" }}>
                          {/* "Type" meta label */}
                          <HLabel
                            value={intl.formatMessage({ id: "label.createUser.type", defaultMessage: "Type" })}
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{
                              fontFamily: "'Inter',sans-serif",
                              fontSize: 11, fontWeight: 700,
                              color: palette.text.secondary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              mb: 0.3,
                            }}
                          />
                          {/* "Type" value */}
                          <HLabel
                            value={credentials[0].type}
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{
                              fontFamily: "'Inter',sans-serif",
                              fontSize: 13,
                              color: palette.text.primary,
                            }}
                          />
                        </HBox>

                        <HBox sx={{ background: "transparent" }}>
                          {/* "Last Set" meta label */}
                          <HLabel
                            value={intl.formatMessage({ id: "label.createUser.lastSet", defaultMessage: "Last Set" })}
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{
                              fontFamily: "'Inter',sans-serif",
                              fontSize: 11, fontWeight: 700,
                              color: palette.text.secondary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              mb: 0.3,
                            }}
                          />
                          {/* "Last Set" value */}
                          <HLabel
                            value={new Date(credentials[0].createdDate).toLocaleString()}
                            translate={false}
                            colon={false}
                            align="left"
                            sx={{
                              fontFamily: "'Inter',sans-serif",
                              fontSize: 13,
                              color: palette.text.primary,
                            }}
                          />
                        </HBox>
                      </HPaper>
                    )}

                    <HBox sx={{ display: 'grid', gap: 2 }}>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.newPassword", defaultMessage: "New Password" })} />
                        <HTextField
                          value={password} onChange={e => setPassword(e.target.value)}
                          editable={true}
                          fullWidth size="small"
                          type={showPwd ? "text" : "password"}
                          placeholder={intl.formatMessage({ id: "label.placeholder.newPassword", defaultMessage: "Enter New Password" })}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowPwd(v => !v)} sx={{ p: 0.3 }}>
                                  {showPwd ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ ...iSx, width: '100%' }} width="100%"
                        />
                      </HBox>
                      <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <FL label={intl.formatMessage({ id: "label.createUser.confirmPassword", defaultMessage: "Confirm Password" })} />
                        <HTextField
                          value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                          editable={true}
                          fullWidth size="small"
                          type={showConfirm ? "text" : "password"}
                          placeholder={intl.formatMessage({ id: "label.placeholder.confirmPassword", defaultMessage: "Confirm New Password" })}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setShowConfirm(v => !v)} sx={{ p: 0.3 }}>
                                  {showConfirm ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ ...iSx, width: '100%' }} width="100%"
                        />
                      </HBox>
                    </HBox>

                    <HBox sx={{ mt: 2 }}>
                      <HButton
                        variant="contained"
                        onClick={handleResetPwd}
                        disabled={pwdLoading}
                        translate={false}
                        label={pwdLoading ? intl.formatMessage({ id: "label.createUser.resetting", defaultMessage: "Resetting..." }) : intl.formatMessage({ id: "label.createUser.resetPassword", defaultMessage: "Reset Password" })}
                        startIcon={<LockResetIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{
                          fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 13,
                          borderRadius: '8px', textTransform: 'none', height: 34, px: 3,
                        }}
                      />
                    </HBox>
                  </HBox>
                )}

              </HBox>
            </HBox>
          </HBox>
        </HBox>
      </div>
    </Fade>
  );
}

export default CreateUser;
