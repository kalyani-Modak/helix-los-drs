import { useEffect, useState, useMemo, useLayoutEffect, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, FormControl, InputLabel, Select } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SyncIcon from "@mui/icons-material/Sync";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import DnsIcon from "@mui/icons-material/Dns";
import HubIcon from "@mui/icons-material/Hub";
import CloudIcon from "@mui/icons-material/Cloud";
import StorageIcon from "@mui/icons-material/Storage";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";
import { useIntl } from "react-intl";
import { alpha } from "@mui/material/styles";

import { HAxiosService, HBox, TitleBar, HBreadCrumb, HLabel, HButton, HAgGrid, useToast, HDialog } from "@helix/component-library";
import UploadUsers from "./UploadUsers";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary: "#0378A6",
  accent: "#bf0404",
};

// ─── Source helpers ────────────────────────────────────────────────────────────
const hasText = (value) => value != null && String(value).trim() !== "";

const buildUserSource = (providerId, providerName) => {
  const provider = hasText(providerId) ? String(providerId).trim() : "";
  const federation = hasText(providerName) ? String(providerName).trim() : "";
  if (provider && federation) return `${provider}-${federation}`;
  return provider || federation || "";
};

const getProviderTypeFromSource = (source) => {
  if (!hasText(source)) return "";
  const idx = source.indexOf("-");
  return (idx === -1 ? source : source.slice(0, idx)).toUpperCase();
};

const getSourceMeta = (source) => {
  const providerType = getProviderTypeFromSource(source);
  switch (providerType) {
    case "INTERNAL":
      return { icon: PersonIcon, color: colors.primary };
    case "LDAP":
      return { icon: DnsIcon, color: "#7c3aed" };
    case "SAML":
    case "OIDC":
      return { icon: CloudIcon, color: "#0369a1" };
    default:
      return hasText(source)
        ? { icon: HubIcon, color: "#64748b" }
        : { icon: StorageIcon, color: "text.secondary" };
  }
};

const getOptionLabel = (opt, intl) =>
  opt.label ?? intl.formatMessage({ id: opt.id, defaultMessage: opt.defaultMessage });

const getOptionDescription = (opt, intl) =>
  opt.descId
    ? intl.formatMessage({ id: opt.descId, defaultMessage: opt.descDefault })
    : opt.descDefault ?? "";

// ─── Filter options ────────────────────────────────────────────────────────────
const STATUS_FILTER_OPTIONS = [
  {
    value: "",
    id: "label.user.all",
    defaultMessage: "All",
    descId: "label.user.filter.all.status.desc",
    descDefault: "Show all users regardless of status",
    icon: FilterListIcon,
    color: "text.secondary",
  },
  {
    value: "active",
    id: "label.user.active",
    defaultMessage: "Active",
    descId: "label.user.filter.active.desc",
    descDefault: "Users enabled and allowed to sign in",
    icon: CheckCircleIcon,
    color: "#15803d",
  },
  {
    value: "inactive",
    id: "label.user.inactive",
    defaultMessage: "Inactive",
    descId: "label.user.filter.inactive.desc",
    descDefault: "Users disabled by administrator",
    icon: CancelIcon,
    color: "#b91c1c",
  },
];

const LOCK_FILTER_OPTIONS = [
  {
    value: "",
    id: "label.user.all",
    defaultMessage: "All",
    descId: "label.user.filter.all.lock.desc",
    descDefault: "Show all users regardless of lock state",
    icon: FilterListIcon,
    color: "text.secondary",
  },
  {
    value: "locked",
    id: "label.user.locked",
    defaultMessage: "Locked",
    descId: "label.user.filter.locked.desc",
    descDefault: "Users locked due to failed login attempts",
    icon: LockIcon,
    color: "#92400e",
  },
  {
    value: "unlocked",
    id: "label.user.unlocked",
    defaultMessage: "Unlocked",
    descId: "label.user.filter.unlocked.desc",
    descDefault: "Users not currently brute-force locked",
    icon: LockOpenIcon,
    color: "#15803d",
  },
];

const filterSelectSx = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 13,
  height: 34,
  borderRadius: "10px",
  bgcolor: "var(--drs-bg-paper)",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--drs-border-divider)", borderWidth: "1.5px" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
  "& .MuiSelect-select": { display: "flex", alignItems: "center", gap: 6, py: 0.75 },
};

const FilterDropdown = ({ labelId, label, value, onChange, options }) => {
  const intl = useIntl();
  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const SelectedIcon = selected.icon;

  return (
    <FormControl size="small" sx={{ minWidth: 190 }}>
      <InputLabel id={labelId} sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        sx={filterSelectSx}
        renderValue={() => (
          <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <SelectedIcon sx={{ fontSize: 18, color: selected.color }} />
            <span>{getOptionLabel(selected, intl)}</span>
          </HBox>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "10px",
              border: "1px solid var(--drs-border-divider)",
              boxShadow: "0 8px 24px rgba(3,120,166,0.12)",
              mt: 0.5,
            },
          },
        }}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <MenuItem
              key={opt.value || `all-${labelId}`}
              value={opt.value}
              sx={{
                fontFamily: "'Inter', sans-serif",
                py: 1,
                alignItems: "flex-start",
                "&.Mui-selected": { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
                "&.Mui-selected:hover": { bgcolor: (t) => alpha(t.palette.primary.main, 0.12) },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                <Icon sx={{ fontSize: 20, color: opt.color }} />
              </ListItemIcon>
              <ListItemText
                primary={getOptionLabel(opt, intl)}
                secondary={getOptionDescription(opt, intl)}
                primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500 }}
                secondaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "text.secondary" }}
              />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

// ─── Toolbar ───────────────────────────────────────────────────────────────────
const UserToolbar = ({
  searchValue, onSearchChange,
  filterStatus, onFilterStatusChange,
  filterLock, onFilterLockChange,
  filterSource, onFilterSourceChange,
  sourceFilterOptions,
  navigate, onOpenUpload,
}) => {
  const intl = useIntl();

  const statusLabel = intl.formatMessage({ id: "label.user.enable.status", defaultMessage: "Status" });
  const lockLabel   = intl.formatMessage({ id: "label.user.lock.status",   defaultMessage: "Lock" });
  const sourceLabel = intl.formatMessage({ id: "label.user.source",        defaultMessage: "Source" });

  return (
    <HBox sx={{
      px: 2.5, py: 1, display: "flex", alignItems: "center", gap: 1.5,
      borderBottom: "1px solid var(--drs-border-divider)", flexWrap: "wrap",
    }}>
      <HBox sx={{
        display: "flex", alignItems: "center", gap: 0.8,
        bgcolor: "var(--drs-bg-paper)",
        border: "1.5px solid var(--drs-border-divider)",
        borderRadius: "10px", px: 1.5, height: 34, width: 260,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:focus-within": { borderColor: "primary.main", boxShadow: "0 0 0 3px rgba(3,120,166,0.1)" },
      }}>
        <SearchIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search username, name, email…"
          style={{
            border: "none", outline: "none", background: "transparent",
            fontFamily: "'Inter', sans-serif", fontSize: 13,
            color: "var(--drs-text-primary)", width: "100%",
          }}
        />
        {searchValue && (
          <IconButton size="small" onClick={() => onSearchChange("")} sx={{ p: 0.2, color: "text.disabled", "&:hover": { color: "primary.main" } }}>
            <ClearIcon sx={{ fontSize: 14 }} />
          </IconButton>
        )}
      </HBox>

      <HBox sx={{ width: "1px", height: 22, bgcolor: "var(--drs-border-divider)", flexShrink: 0 }} />

      <FilterDropdown
        labelId="user-source-filter-label"
        label={sourceLabel}
        value={filterSource}
        onChange={onFilterSourceChange}
        options={sourceFilterOptions}
      />

      <FilterDropdown
        labelId="user-status-filter-label"
        label={statusLabel}
        value={filterStatus}
        onChange={onFilterStatusChange}
        options={STATUS_FILTER_OPTIONS}
      />

      <FilterDropdown
        labelId="user-lock-filter-label"
        label={lockLabel}
        value={filterLock}
        onChange={onFilterLockChange}
        options={LOCK_FILTER_OPTIONS}
      />

      <HBox sx={{
        ml: "auto", display: "flex", gap: 1, alignItems: "center",
        "& .MuiButton-root": { height: "40px", whiteSpace: "nowrap" },
      }}>
        <HButton
          variant="outlined"
          onClick={onOpenUpload}
          size="small"
          label="label.user.partialimport"
          startIcon={<UploadFileIcon sx={{ fontSize: "15px !important" }} />}
        />
        <HButton
          variant="outlined"
          onClick={() => navigate("/homelayout/upload-federation-users")}
          size="small"
          label="label.user.syncfederation"
          startIcon={<SyncIcon sx={{ fontSize: "15px !important" }} />}
        />
        <HButton
          variant="contained"
          onClick={() => navigate("/homelayout/create-user")}
          size="small"
          label="label.user.createuser"
          startIcon={<PersonAddAltIcon sx={{ fontSize: "15px !important" }} />}
        />
      </HBox>
    </HBox>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const UserScreen = () => {
  const [users, setUsers]                       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [searchValue, setSearchValue]           = useState("");
  const [filterStatus, setFilterStatus]         = useState("");
  const [filterLock, setFilterLock]             = useState("");
  const [filterSource, setFilterSource]         = useState("");
  const [openPwdDialog, setOpenPwdDialog]       = useState(false);
  const [userToForcePwd, setUserToForcePwd]     = useState(null);
  const [openUploadDialog, setOpenUploadDialog]   = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete]         = useState(null);
  const [openToggleDialog, setOpenToggleDialog] = useState(false);
  const [userToToggle, setUserToToggle]         = useState(null);
  const [openLockDialog, setOpenLockDialog]     = useState(false);
  const [userToLock, setUserToLock]             = useState(null);
  const [menuAnchor, setMenuAnchor]             = useState(null);
  const [selectedRow, setSelectedRow]           = useState(null);

  const intl     = useIntl();
  const gridRef  = useRef(null);
  const navigate = useNavigate();
  const realm    = useMemo(() => sessionStorage.getItem("SEC_REALM"), []);
  const toast    = useToast();
  const location = useLocation();

  if (!realm) {
    return (
      <HBox sx={{ mt: 4 }}>
        <HLabel
          value={
            <>
              {intl.formatMessage({
                id: "label.session.expired",
                defaultMessage: "Session expired or invalid. Please "
              })}
              <Link to="/">login again</Link>.
            </>
          }
          colon={false}
          translate={false}
          align="left"
          component="div"
          sx={{
            fontSize: 20,
            color: "error.main",
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </HBox>
    );
  }

  useLayoutEffect(() => {
    if (!realm) window.location.href = "/drs";
  }, [realm]);

  const normalizeUsers = (raw) =>
    (raw || []).map((user, index) => {
      const source = buildUserSource(user.providerId, user.providerName);
      return {
        ...user,
        id:         user.id ?? user.userName ?? index,
        status:     user.active ? "active" : "inactive",
        lockStatus: user.locked ? "locked" : "unlocked",
        locked:     user.locked ?? false,
        source,
      };
    });

  const sourceFilterOptions = useMemo(() => {
    const allOption = {
      value: "",
      id: "label.user.all",
      defaultMessage: "All",
      descId: "label.user.filter.all.source.desc",
      descDefault: "Show users from all sources",
      icon: FilterListIcon,
      color: "text.secondary",
    };

    const uniqueSources = [...new Set(
      (users || []).map((user) => user.source).filter(hasText)
    )].sort((a, b) => a.localeCompare(b));

    const dynamicOptions = uniqueSources.map((source) => {
      const meta = getSourceMeta(source);
      return {
        value: source,
        label: source,
        descDefault: `Show users from ${source}`,
        icon: meta.icon,
        color: meta.color,
      };
    });

    return [allOption, ...dynamicOptions];
  }, [users]);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await HAxiosService.GET(UserManagementAPI.fetch_users(realm));
        if (isMounted) setUsers(normalizeUsers(response.data));
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (realm) fetchUsers();
    return () => { isMounted = false; };
  }, [realm, toast]);

  const refreshUsers = async () => {
    try {
      const response = await HAxiosService.GET(UserManagementAPI.fetch_users(realm));
      setUsers(normalizeUsers(response.data));
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  // ── Filtered rows (search + status + lock + source) ────────────────────────
  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const { firstName = "", lastName = "", email = "", userName = "", status, lockStatus, source } = user;
      const search   = searchValue.toLowerCase();
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      return (
        (fullName.includes(search) ||
          email.toLowerCase().includes(search) ||
          userName.toLowerCase().includes(search)) &&
        (filterStatus ? status === filterStatus : true) &&
        (filterLock ? lockStatus === filterLock : true) &&
        (filterSource ? source === filterSource : true)
      );
    });
  }, [users, searchValue, filterStatus, filterLock, filterSource]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDeleteUser = async (userId) => {
    try {
      const response = await HAxiosService.DELETE(
        UserManagementAPI.delete_user_by_id(userId, realm)
      );
      if (isApiSuccess(response)) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        toast.success(getApiMsg(response, "User deleted"));
      } else {
        toast.error(getApiMsg(response, "Failed to delete user."));
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleForcePasswordChange = async (userId) => {
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.enforceUserToChangePassword(userId)
      );
      if (isApiSuccess(response)) {
        toast.success(getApiMsg(response, "Password reset enforced."));
      } else {
        toast.error(getApiMsg(response, "Failed to enforce password change."));
      }
    } catch (error) {
      toast.error("An error occurred while forcing password change.");
    } finally {
      setOpenPwdDialog(false);
    }
  };

  const handleToggleUserStatus = async () => {
    const row    = userToToggle;
    const enable = !row.active;
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.toggle_user_status(row.id, enable)
      );
      if (isApiSuccess(response)) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === row.id
              ? { ...u, active: enable, status: enable ? "active" : "inactive" }
              : u
          )
        );
        toast.success(getApiMsg(response, "User status updated"));
      } else {
        toast.error(getApiMsg(response, "Failed to update user status."));
      }
    } catch {
      toast.error("An error occurred while updating user status.");
    } finally {
      setOpenToggleDialog(false);
    }
  };

  const handleUnlockUser = async () => {
    const row = userToLock;
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.unlock_user(row.id)
      );
      if (isApiSuccess(response)) {
        setUsers((prev) =>
          prev.map((u) => u.id === row.id ? { ...u, locked: false, lockStatus: "unlocked" } : u)
        );
        toast.success(getApiMsg(response, "User unlocked"));
      } else {
        toast.error(getApiMsg(response, "Failed to unlock user."));
      }
    } catch {
      toast.error("An error occurred while unlocking the user.");
    } finally {
      setOpenLockDialog(false);
    }
  };

  const handleMenuOpen  = (e, row) => { setSelectedRow(row); setMenuAnchor(e.currentTarget); };
  const handleMenuClose = () => setMenuAnchor(null);

  // ── Column definitions ──────────────────────────────────────────────────────
  const columnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.user.username", defaultMessage: "Username" }),
      field: "userName",
      flex: 1,
      filter: false,
      cellRenderer: (params) => (
        <Link
          to={`/homelayout/create-user/${params.data.id}/${params.data.userName}`}
          state={location.state}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: colors.primary,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {params.data.userName}
        </Link>
      ),
    },
    {
      headerName: intl.formatMessage({ id: "label.user.fullname", defaultMessage: "Full Name" }),
      field: "fullName",
      flex: 1.2,
      filter: false,
      valueGetter: (params) => {
        const first = params.data.firstName || "";
        const last  = params.data.lastName  || "";
        return [first, last].filter(Boolean).join(" ") || "—";
      },
    },
    {
      headerName: intl.formatMessage({ id: "label.user.email", defaultMessage: "Email" }),
      field: "email",
      flex: 1.4,
      filter: false,
      valueFormatter: (params) => params.value || "—",
    },
    {
      headerName: intl.formatMessage({ id: "label.user.reportingto", defaultMessage: "Reporting To" }),
      field: "reportingTo",
      flex: 0.9,
      filter: false,
      valueFormatter: (params) => params.value || "—",
    },
    {
      headerName: intl.formatMessage({ id: "label.user.source", defaultMessage: "Source" }),
      field: "source",
      flex: 1,
      sortable: true,
      filter: false,
      valueFormatter: (params) => params.value || "—",
    },
    {
      headerName: intl.formatMessage({ id: "label.user.enable.status", defaultMessage: "Status" }),
      field: "active",
      flex: 0.5,
      sortable: true,
      filter: false,
      cellRenderer: (params) => {
        const isActive = params.value === true;
        const label = isActive
          ? intl.formatMessage({ id: "label.user.active",   defaultMessage: "Active" })
          : intl.formatMessage({ id: "label.user.inactive", defaultMessage: "Inactive" });
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Tooltip title={label} arrow>
              <span style={{ display: "flex", alignItems: "center" }}>
                {isActive
                  ? <CheckCircleIcon sx={{ fontSize: 20, color: "#15803d" }} />
                  : <CancelIcon      sx={{ fontSize: 20, color: "#b91c1c" }} />}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      headerName: intl.formatMessage({ id: "label.user.lock.status", defaultMessage: "Lock" }),
      field: "locked",
      flex: 0.5,
      sortable: true,
      filter: false,
      cellRenderer: (params) => {
        const isLocked = params.value === true;
        const label = isLocked
          ? intl.formatMessage({ id: "label.user.locked",   defaultMessage: "Locked" })
          : intl.formatMessage({ id: "label.user.unlocked", defaultMessage: "Unlocked" });
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Tooltip title={label} arrow>
              <span style={{ display: "flex", alignItems: "center" }}>
                {isLocked
                  ? <LockIcon     sx={{ fontSize: 20, color: "#92400e" }} />
                  : <LockOpenIcon sx={{ fontSize: 20, color: "#15803d" }} />}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      headerName: intl.formatMessage({ id: "label.user.actions", defaultMessage: "Actions" }),
      field: "actions",
      sortable: false,
      filter: false,
      width: 90,
      cellRenderer: (params) => (
        <IconButton
          size="small"
          onClick={(e) => handleMenuOpen(e, params.data)}
          sx={{
            color: "text.disabled",
            transition: "color 0.18s",
            "&:hover": { color: "primary.main", background: (t) => alpha(t.palette.primary.main, 0.08) },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ], [intl]);

  return (
    <HBox>
      <HBreadCrumb />
      <TitleBar title={intl.formatMessage({ id: "label.UserManagement.title", defaultMessage: "Users" })} />

      <HBox sx={{ display: "flex", flexDirection: "column" }}>

        {/* Toolbar — search, status pills, action buttons */}
        <UserToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterLock={filterLock}
          onFilterLockChange={setFilterLock}
          filterSource={filterSource}
          onFilterSourceChange={setFilterSource}
          sourceFilterOptions={sourceFilterOptions}
          navigate={navigate}
          onOpenUpload={() => setOpenUploadDialog(true)}
        />

        {/* AG Grid */}
        <HAgGrid
          ref={gridRef}
          rowData={filteredUsers}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "60vh", "--ag-borders": "none" }}
          gridClassName="drs-list-grid drs-user-grid"
          loading={loading}
          pagination
          paginationPageSize={10}
        />

      </HBox>

      {/* ── Context Menu ──────────────────────────────────────────────────── */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} slotProps={{ paper: {
          sx: {
            borderRadius: "10px",
            border: "1px solid var(--drs-border-divider)",
            boxShadow: `0 8px 24px ${colors.primary}20`,
          },
        } }}>
        <MenuItem
          onClick={() => { handleMenuClose(); setUserToForcePwd(selectedRow); setOpenPwdDialog(true); }}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}
        >
          <ListItemIcon><LockResetIcon fontSize="small" sx={{ color: colors.primary }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            {intl.formatMessage({ id: "label.user.forcepassword", defaultMessage: "Force Password Change" })}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => { handleMenuClose(); setUserToToggle(selectedRow); setOpenToggleDialog(true); }}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}
        >
          <ListItemIcon>
            <BlockIcon
              fontSize="small"
              sx={{ color: selectedRow?.active ? "#b91c1c" : "#15803d" }}
            />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
            {selectedRow?.active
              ? intl.formatMessage({ id: "label.user.disable", defaultMessage: "Disable User" })
              : intl.formatMessage({ id: "label.user.enable",  defaultMessage: "Enable User" })}
          </ListItemText>
        </MenuItem>
        {selectedRow?.locked && (
          <MenuItem
            onClick={() => { handleMenuClose(); setUserToLock(selectedRow); setOpenLockDialog(true); }}
            sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}
          >
            <ListItemIcon>
              <LockOpenIcon fontSize="small" sx={{ color: "#15803d" }} />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
              {intl.formatMessage({ id: "label.user.unlock", defaultMessage: "Unlock User" })}
            </ListItemText>
          </MenuItem>
        )}
        <Divider sx={{ borderColor: "divider" }} />
        <MenuItem
          onClick={() => { handleMenuClose(); setUserToDelete(selectedRow); setOpenDeleteDialog(true); }}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: colors.accent, "&:hover": { background: `${colors.accent}10` } }}
        >
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: colors.accent }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: colors.accent }}>
            {intl.formatMessage({ id: "label.user.delete", defaultMessage: "Delete" })}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
      <HDialog
        disableContentWrapper
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        slotProps={{ paper: { sx: { borderRadius: "16px", border: "1px solid var(--drs-border-divider)", boxShadow: `0 12px 30px ${colors.primary}30` } } }}
        title={intl.formatMessage({ id: "label.user.confirmdelete.title", defaultMessage: "Confirm Deletion" })}
        titleSx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--drs-text-primary)", borderBottom: "1px solid var(--drs-border-divider)" }}
      >
        <DialogContent sx={{ pt: 2.5 }}>
          <HLabel
            value={intl.formatMessage(
              { id: "label.user.confirmdelete.msg", defaultMessage: "Are you sure you want to delete user {name} permanently?" },
              { name: <strong style={{ color: "var(--drs-text-primary)" }}>{userToDelete?.userName}</strong> }
            )}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{ fontSize: 14, color: "var(--drs-text-secondary)" }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <HButton
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            label="label.user.cancel"
          />
          <HButton
            onClick={() => handleDeleteUser(userToDelete?.id)}
            variant="contained"
            disabled={loading}
            label="label.user.delete"
          />
        </DialogActions>
      </HDialog>

      {/* ── Force Password Dialog ─────────────────────────────────────────── */}
      <HDialog
        disableContentWrapper
        open={openPwdDialog}
        onClose={() => setOpenPwdDialog(false)}
        slotProps={{ paper: { sx: { borderRadius: "16px", border: "1px solid var(--drs-border-divider)", boxShadow: `0 12px 30px ${colors.primary}30` } } }}
        title={intl.formatMessage({ id: "label.user.forcepassword.title", defaultMessage: "Force Password Change" })}
        titleSx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--drs-text-primary)", borderBottom: "1px solid var(--drs-border-divider)" }}
      >
        <DialogContent sx={{ pt: 2.5 }}>
          <HLabel
            value={intl.formatMessage(
              { id: "label.user.forcepassword.msg", defaultMessage: "Are you sure you want to force password change for {name}?" },
              { name: <strong style={{ color: "var(--drs-text-primary)" }}>{userToForcePwd?.userName}</strong> }
            )}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{ fontSize: 14, color: "var(--drs-text-secondary)" }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenPwdDialog(false)}
            variant="outlined"
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", borderColor: "var(--drs-border-divider)", color: "var(--drs-text-secondary)", "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" } }}
          >
            {intl.formatMessage({ id: "label.user.cancel", defaultMessage: "Cancel" })}
          </Button>
          <Button
            onClick={() => handleForcePasswordChange(userToForcePwd?.id)}
            variant="contained"
            disabled={loading}
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 4px 12px #f59e0b40", "&:hover": { background: "#d97706" } }}
          >
            {intl.formatMessage({ id: "label.user.confirm", defaultMessage: "Confirm" })}
          </Button>
        </DialogActions>
      </HDialog>

      {/* ── Enable / Disable Dialog ───────────────────────────────────────── */}
      {(() => {
        const willEnable = !userToToggle?.active;
        const accentColor = willEnable ? "#15803d" : "#b45309";
        const gradientBg  = willEnable
          ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
          : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
        const shadowColor = willEnable ? "#16a34a40" : "#f59e0b40";
        return (
          <HDialog
            disableContentWrapper
            open={openToggleDialog}
            onClose={() => setOpenToggleDialog(false)}
            slotProps={{ paper: { sx: { borderRadius: "16px", border: "1px solid var(--drs-border-divider)", boxShadow: `0 12px 30px ${colors.primary}30` } } }}
            title={
              willEnable
                ? intl.formatMessage({ id: "label.user.enable",  defaultMessage: "Enable User" })
                : intl.formatMessage({ id: "label.user.disable", defaultMessage: "Disable User" })
            }
            titleSx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--drs-text-primary)", borderBottom: "1px solid var(--drs-border-divider)" }}
          >
            <DialogContent sx={{ pt: 2.5 }}>
              <HLabel
                value={intl.formatMessage(
                  willEnable
                    ? { id: "label.user.enable.msg",  defaultMessage: "Are you sure you want to enable user {name}?" }
                    : { id: "label.user.disable.msg", defaultMessage: "Are you sure you want to disable user {name}? They will no longer be able to log in." },
                  { name: <strong style={{ color: "var(--drs-text-primary)" }}>{userToToggle?.userName}</strong> }
                )}
                colon={false}
                translate={false}
                align="left"
                component="div"
                sx={{ fontSize: 14, color: "var(--drs-text-secondary)" }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                onClick={() => setOpenToggleDialog(false)}
                variant="outlined"
                sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", borderColor: "var(--drs-border-divider)", color: "var(--drs-text-secondary)", "&:hover": { borderColor: accentColor, bgcolor: "action.hover" } }}
              >
                {intl.formatMessage({ id: "label.user.cancel", defaultMessage: "Cancel" })}
              </Button>
              <Button
                onClick={handleToggleUserStatus}
                variant="contained"
                disabled={loading}
                sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", background: gradientBg, boxShadow: `0 4px 12px ${shadowColor}`, "&:hover": { background: accentColor } }}
              >
                {willEnable
                  ? intl.formatMessage({ id: "label.user.enable",  defaultMessage: "Enable User" })
                  : intl.formatMessage({ id: "label.user.disable", defaultMessage: "Disable User" })}
              </Button>
            </DialogActions>
          </HDialog>
        );
      })()}

      {/* ── Unlock Dialog ─────────────────────────────────────────────────── */}
      <HDialog
        disableContentWrapper
        open={openLockDialog}
        onClose={() => setOpenLockDialog(false)}
        slotProps={{ paper: { sx: { borderRadius: "16px", border: "1px solid var(--drs-border-divider)", boxShadow: `0 12px 30px ${colors.primary}30` } } }}
        title={intl.formatMessage({ id: "label.user.unlock", defaultMessage: "Unlock User" })}
        titleSx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "var(--drs-text-primary)", borderBottom: "1px solid var(--drs-border-divider)" }}
      >
        <DialogContent sx={{ pt: 2.5 }}>
          <HLabel
            value={intl.formatMessage(
              { id: "label.user.unlock.msg", defaultMessage: "Are you sure you want to unlock user {name}? This will clear their brute-force lockout." },
              { name: <strong style={{ color: "var(--drs-text-primary)" }}>{userToLock?.userName}</strong> }
            )}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{ fontSize: 14, color: "var(--drs-text-secondary)" }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenLockDialog(false)}
            variant="outlined"
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", borderColor: "var(--drs-border-divider)", color: "var(--drs-text-secondary)", "&:hover": { borderColor: "#15803d", bgcolor: "action.hover" } }}
          >
            {intl.formatMessage({ id: "label.user.cancel", defaultMessage: "Cancel" })}
          </Button>
          <Button
            onClick={handleUnlockUser}
            variant="contained"
            disabled={loading}
            sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none", background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", boxShadow: "0 4px 12px #16a34a40", "&:hover": { background: "#15803d" } }}
          >
            {intl.formatMessage({ id: "label.user.unlock", defaultMessage: "Unlock User" })}
          </Button>
        </DialogActions>
      </HDialog>

      <UploadUsers
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onImportSuccess={refreshUsers}
      />

    </HBox>
  );
};

export default UserScreen;