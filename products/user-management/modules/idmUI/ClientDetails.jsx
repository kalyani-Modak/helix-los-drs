import { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { ClientDetailsAPI } from "./apiEndpoints";
import CreateRole from "./CreateRole";
import CreateResource from "./CreateResource";
import CreatePolicy from "./Createpolicy";
import PermissionwithResource from "./PermissionwithResource";
import CreateScope from "./CreateScope";
import CreateClient from "./CreateClient"; // Import CreateClient
import { HAxiosService, HBox, HTabs, HTab, HTextField, HButton, HLabel, HAgGrid, useToast } from "@helix/component-library";

// ==================== Color Palette ====================
const colors = {
  primary: "#0378A6",
  secondary: "#2FBF71",
  primaryLight: "#79cff1",
  primaryDark: "#025a8c",
  secondaryLight: "#43da87",
  text: { primary: "#1a2b3c", secondary: "#5f6c7b" },
  danger: "#E05A5A",
};

// ==================== Reusable Styles ====================
const primaryBtnSx = {
  fontWeight: 600,
  fontSize: "12px",
  borderRadius: "8px",
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(3,120,166,0.25)",
  py: 0.8,
  px: 2.5,
  mt: 1,
};

function ClientDetails({ onProductChanged }) {
  const { clientId1 } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ---------------- State ------------------
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAuthSubTab, setSelectedAuthSubTab] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [resourceSearchTerm, setResourceSearchTerm] = useState("");
  const [policySearchTerm, setPolicySearchTerm] = useState("");
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [scopeSearchTerm, setScopeSearchTerm] = useState("");

  const [roles, setRoles] = useState([]);
  const [resourceNames, setResourceNames] = useState([]);
  const [policyNames, setPolicyNames] = useState([]);
  const [permissionNames, setPermissionNames] = useState([]);
  const [scopeNames, setScopeNames] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  // Dialog States
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  
  const [scopeDialogOpen, setScopeDialogOpen] = useState(false);
  const [selectedScope, setSelectedScope] = useState(null);
  
  // Client Dialog State for Settings tab
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  const [loadingResources, setLoadingResources] = useState(false);
  const [loadingPolicy, setLoadingPolicy] = useState(false);
  const [loadingPermission, setLoadingPermission] = useState(false);
  const [loadingScopes, setLoadingScopes] = useState(false);

  // ---------------- Session ------------------
  const realm = sessionStorage.getItem("SEC_REALM");
  const product = sessionStorage.getItem("SELECTED_PRODUCT");

  // ---------------- Fetch helpers ------------------
  const get = (url) => HAxiosService.GET(url);

  // ------------- Fetch data on mount --------------
  useEffect(() => {
    const loadInit = async () => {
      try {
        const [roleRes, resourceRes, policyRes, permRes, scopeRes] = await Promise.all([
          get(ClientDetailsAPI.ROLES(realm, product)),
          get(ClientDetailsAPI.RESOURCES(realm, product)),
          get(ClientDetailsAPI.POLICIES(realm, product)),
          get(ClientDetailsAPI.PERMISSIONS(realm, product)),
          get(ClientDetailsAPI.SCOPES(realm, product)),
        ]);

        if (roleRes?.data) {
          const firstKey = Object.keys(roleRes.data)[0];
          setRoles(roleRes.data[firstKey] || []);
        }

        setResourceNames(resourceRes?.data || []);
        setPolicyNames(policyRes?.data || []);
        setPermissionNames(permRes?.data || []);
        setScopeNames(scopeRes?.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load client data");
      }
    };

    if (realm && product) {
      loadInit();
    }
  }, [realm, product, toast]);

  // -------- Handle tab & hash sync --------------
  useEffect(() => {
    const hash = location.hash;
    if (hash === "#roles") setSelectedTab(0);
    else if (hash === "#authorization") setSelectedTab(1);
    else if (hash === "#resources") { setSelectedTab(1); setSelectedAuthSubTab(0); }
    else if (hash === "#policy") { setSelectedTab(1); setSelectedAuthSubTab(1); }
    else if (hash === "#permissions") { setSelectedTab(1); setSelectedAuthSubTab(2); }
    else if (hash === "#scopes") { setSelectedTab(1); setSelectedAuthSubTab(3); }
    else if (hash === "#settings") setSelectedTab(2);
  }, [location.hash]);

  const handleTabChange = (_e, val) => {
    setSelectedTab(val);

    if (val === 0) {
      navigate("#roles", { replace: true });
    } else if (val === 1) {
      navigate("#authorization", { replace: true });
    } else if (val === 2) {
      navigate("#settings", { replace: true });
    }
  };

  const handleAuthSubTabChange = (_e, val) => {
    setSelectedAuthSubTab(val);
    const anchors = ["#resources", "#policy", "#permissions", "#scopes"];
    navigate(anchors[val], { replace: true });
  };

  // ---------------- HAgGrid rowData & columnDefs ----------------
  const rolesRowData = useMemo(() => {
    return roles.filter(r => (r.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [roles, searchTerm]);

  const rolesColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.product.role", defaultMessage: "Role" }),
      field: "name",
      flex: 1,
      minWidth: 150,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
    },
    {
      headerName: intl.formatMessage({ id: "label.product.desc", defaultMessage: "Description" }),
      field: "description",
      flex: 2,
      minWidth: 250,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
      valueFormatter: (params) => params.value || intl.formatMessage({ id: "label.createUser.roleDesc", defaultMessage: "No description" }),
    }
  ], [intl]);

  const resourcesRowData = useMemo(() => {
    const filtered = resourceNames.filter(r =>
      (r || "").toLowerCase().includes(resourceSearchTerm.toLowerCase())
    );
    return filtered.map(r => ({ name: r }));
  }, [resourceNames, resourceSearchTerm]);

  const resourcesColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.product.resource", defaultMessage: "Resource" }),
      field: "name",
      flex: 1,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
    }
  ], [intl]);

  const policiesRowData = useMemo(() => {
    const filtered = policyNames.filter(p =>
      (p || "").toLowerCase().includes(policySearchTerm.toLowerCase())
    );
    return filtered.map(p => ({ name: p }));
  }, [policyNames, policySearchTerm]);

  const policiesColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.product.policy", defaultMessage: "Policy" }),
      field: "name",
      flex: 1,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
    }
  ], [intl]);

  const permissionsRowData = useMemo(() => {
    const filtered = permissionNames.filter((name) =>
      (name || "").toLowerCase().includes(permissionSearchTerm.toLowerCase())
    );
    return filtered.map(name => ({ name }));
  }, [permissionNames, permissionSearchTerm]);

  const permissionsColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.product.permissionName", defaultMessage: "Permission Name" }),
      field: "name",
      flex: 1,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
    }
  ], [intl]);

  const scopesRowData = useMemo(() => {
    return scopeNames.filter(s =>
      (s.displayName || "").toLowerCase().includes(scopeSearchTerm.toLowerCase())
    );
  }, [scopeNames, scopeSearchTerm]);

  const scopesColDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.product.scope", defaultMessage: "Scope" }),
      field: "name",
      flex: 1,
      cellStyle: { cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: "13px" },
    }
  ], [intl]);

  // ------------- Role Dialog Handlers ---------------
  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const handleRoleCreated = async () => {
    // Refresh roles data
    try {
      const roleRes = await get(ClientDetailsAPI.ROLES(realm, product));
      if (roleRes?.data) {
        const firstKey = Object.keys(roleRes.data)[0];
        setRoles(roleRes.data[firstKey] || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh roles");
    }
  };

  // ------------- Resource Dialog Handlers ---------------
  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
    setResourceDialogOpen(true);
  };

  const handleResourceDialogClose = () => {
    setResourceDialogOpen(false);
    setSelectedResource(null);
  };

  const handleResourceCreated = async () => {
    // Refresh resources data
    try {
      const resourceRes = await get(ClientDetailsAPI.RESOURCES(realm, product));
      setResourceNames(resourceRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh resources");
    }
  };

  // ------------- Policy Dialog Handlers ---------------
  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
    setPolicyDialogOpen(true);
  };

  const handlePolicyDialogClose = () => {
    setPolicyDialogOpen(false);
    setSelectedPolicy(null);
  };

  const handlePolicyCreated = async () => {
    // Refresh policies data
    try {
      const policyRes = await get(ClientDetailsAPI.POLICIES(realm, product));
      setPolicyNames(policyRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh policies");
    }
  };

  // ------------- Permission Dialog Handlers ---------------
  const handlePermissionClick = (permission) => {
    setSelectedPermission(permission);
    setPermissionDialogOpen(true);
  };

  const handlePermissionDialogClose = () => {
    setPermissionDialogOpen(false);
    setSelectedPermission(null);
  };

  const handlePermissionCreated = async () => {
    // Refresh permissions data
    try {
      const permRes = await get(ClientDetailsAPI.PERMISSIONS(realm, product));
      setPermissionNames(permRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh permissions");
    }
  };

  // ------------- Scope Dialog Handlers ---------------
  const handleScopeClick = (scope) => {
    setSelectedScope(scope);
    setScopeDialogOpen(true);
  };

  const handleScopeDialogClose = () => {
    setScopeDialogOpen(false);
    setSelectedScope(null);
  };

  const handleScopeCreated = async () => {
    // Refresh scopes data
    try {
      const scopeRes = await get(ClientDetailsAPI.SCOPES(realm, product));
      setScopeNames(scopeRes?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to refresh scopes");
    }
  };

  // ------------- Client Dialog Handlers ---------------
  const handleClientDialogOpen = () => {
    setClientDialogOpen(true);
  };

  const handleClientDialogClose = () => {
    setClientDialogOpen(false);
  };

  const handleClientUpdated = async (result) => {
    // Forward action so parent can clear selection on delete and refresh Product dropdown only
    if (onProductChanged) {
      await onProductChanged(result);
    }
  };

  // ------------ UI helpers --------------
  const paginated = (arr) => arr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Stats for roles and permissions
  const totalRoles = roles.length;
  const totalResources = resourceNames.length;
  const totalPolicies = policyNames.length;
  const totalPermissions = permissionNames.length;
  const totalScopes = scopeNames.length;

  // ---------------- Render ----------------
  return (
    <HBox sx={{
      flexGrow: 1,
      minHeight: "72.5vh",
      borderRadius: { xs: "10px", sm: "14px" },
      boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
      overflow: "hidden",
    }}>
      {/* Stats Bar - matching AccessMenu style */}
      <HBox sx={{
        px: { xs: 1.5, sm: 2, md: 3 },
        py: 1.5,
        borderBottom: "1px solid #edf2f8",
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        alignItems: "center",
      }}>
        <HBox sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.6,
          py: 0.5,
          px: 1.5,
          borderRadius: "20px",
          background: "rgba(3,120,166,0.07)",
          border: "1px solid rgba(3,120,166,0.15)",
        }}>
          <HBox sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
          }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary, fontSize: "11px" }}>
            {intl.formatMessage({ id: "label.product.role", defaultMessage: "Roles" })}: <strong style={{ color: colors.primary }}>{totalRoles}</strong>
          </Typography>
        </HBox>

        <HBox sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.6,
          py: 0.5,
          px: 1.5,
          borderRadius: "20px",
          background: "rgba(47,191,113,0.07)",
          border: "1px solid rgba(47,191,113,0.2)",
        }}>
          <HBox sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
          }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary, fontSize: "11px" }}>
            {intl.formatMessage({ id: "label.product.resource", defaultMessage: "Resources" })}: <strong style={{ color: colors.secondary }}>{totalResources}</strong>
          </Typography>
        </HBox>

        <HBox sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.6,
          py: 0.5,
          px: 1.5,
          borderRadius: "20px",
          background: "rgba(245,166,35,0.07)",
          border: "1px solid rgba(245,166,35,0.2)",
        }}>
          <HBox sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#F5A623",
          }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: colors.text.secondary, fontSize: "11px" }}>
            {intl.formatMessage({ id: "label.product.policy", defaultMessage: "Policies" })}: <strong style={{ color: "#F5A623" }}>{totalPolicies}</strong>
          </Typography>
        </HBox>

        <HBox sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.6,
          py: 0.5,
          px: 1.5,
          borderRadius: "20px",
          border: "1px solid rgba(224,90,90,0.2)",
        }}>
          <HBox sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#E05A5A",
          }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary, fontSize: "11px" }}>
            {intl.formatMessage({ id: "label.product.permissionName", defaultMessage: "Permissions" })}: <strong style={{ color: "#E05A5A" }}>{totalPermissions}</strong>
          </Typography>
        </HBox>

        <HBox sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.6,
          py: 0.5,
          px: 1.5,
          borderRadius: "20px",
          border: "1px solid rgba(121,207,241,0.2)",
        }}>
          <HBox sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
          }} />
          <Typography sx={{ fontFamily: "'Inter', sans-serif", color: theme.palette.text.secondary, fontSize: "11px" }}>
            {intl.formatMessage({ id: "label.product.scope", defaultMessage: "Scopes" })}: <strong style={{ color: colors.primaryLight }}>{totalScopes}</strong>
          </Typography>
        </HBox>
      </HBox>

      <AppBar position="sticky" sx={{
        boxShadow: "0 2px 8px rgba(3,120,166,0.1)",
        background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
      }}>
        <HTabs
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{
            sx: {
              height: 3,
            }
          }}
          sx={{
            "& .MuiTab-root": {
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              fontFamily: "'Inter', sans-serif",
              background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
            },
            "& .Mui-selected": {
              fontWeight: 700,
            },
          }}
        >
          <HTab label={intl.formatMessage({ id: "label.product.role", defaultMessage: "Roles" })} />
          <HTab label={intl.formatMessage({ id: "label.menu.ECF-Authorization", defaultMessage: "Authorization" })} />
          <HTab label={intl.formatMessage({ id: "label.product.settings", defaultMessage: "Setting" })} />
        </HTabs>
      </AppBar>

      <HBox sx={{ p: { xs: 1.5, sm: 2, md: 3 }, background: "transparent", width: "100%" }}>
        {/* ================== ROLES TAB ==================*/}
        {selectedTab === 0 && (
          <>
            <HBox sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 1.5,
              mb: 2,
              background: "transparent",
              width: "100%",
            }}>
              <HTextField
                placeholder={intl.formatMessage({ id: "label.placeholder.searchRoles", defaultMessage: "Search Roles" })}
                value={searchTerm}
                editable
                onChange={e => setSearchTerm(e.target.value)}
                sx={{
                  flex: 1,
                  maxWidth: { xs: "100%", sm: "300px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "13px",
                  },
                }}
              />
              <HButton
                variant="contained"
                onClick={() => {
                  setSelectedRole(null);
                  setRoleDialogOpen(true);
                }}
                sx={primaryBtnSx}
                label="label.product.createRole"
              />
            </HBox>

            <HLabel
              value={intl.formatMessage({ id: "label.product.rolesFor", defaultMessage: "Roles for {product}" }, { product })}
              colon={false}
              translate={false}
              align="left"
              sx={{
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                color: theme.palette.text.primary,
                fontSize: "14px",
                mb: 1,
                display: "block",
              }}
            />

            <HAgGrid
              rowData={rolesRowData}
              columnDefs={rolesColDefs}
              gridStyle={{ width: "100%" }}
              gridClassName="drs-list-grid"
              embeddedInSection
              pagination
              paginationPageSize={5}
              sort
              onRowClicked={(event) => handleRoleClick(event.data)}
            />
          </>
        )}

        {/* ================== AUTHORIZATION TAB ==================*/}
        {selectedTab === 1 && (
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, background: "transparent", width: "100%" }}>
            <HTabs
              value={selectedAuthSubTab}
              onChange={handleAuthSubTabChange}
              variant="scrollable"
              sx={{
                borderRadius: "8px",
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": {
                    fontWeight: 600,
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                },
              }}
            >
              <HTab label={intl.formatMessage({ id: "label.product.resource", defaultMessage: "Resources" })} />
              <HTab label={intl.formatMessage({ id: "label.product.policy", defaultMessage: "Policy" })} />
              <HTab label={intl.formatMessage({ id: "label.product.permissionName", defaultMessage: "Permissions" })} />
              <HTab label={intl.formatMessage({ id: "label.product.scope", defaultMessage: "Scopes" })} />
            </HTabs>

            {/* ---------- Resources SubTab ---------- */}
            {selectedAuthSubTab === 0 && (
              <>
                <HBox sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                  background: "transparent",
                }}>
                  <HTextField
                    placeholder={intl.formatMessage({ id: "label.product.placeholder.searchResources", defaultMessage: "Search Resources" })}
                    value={resourceSearchTerm}
                    editable
                    onChange={e => setResourceSearchTerm(e.target.value)}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", sm: 350 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "13px",
                      },
                    }}
                  />
                  <HButton
                    variant="contained"
                    onClick={() => {
                      setSelectedResource(null);
                      setResourceDialogOpen(true);
                    }}
                    sx={primaryBtnSx}
                    label="label.product.createResource"
                  />
                </HBox>

                <HLabel
                  value={intl.formatMessage({ id: "label.product.resourcesFor", defaultMessage: "Resources for {product}" }, { product })}
                  colon={false}
                  translate={false}
                  align="left"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                    mb: 1,
                  }}
                />

                <HAgGrid
                  rowData={resourcesRowData}
                  columnDefs={resourcesColDefs}
                  gridStyle={{ width: "100%" }}
                  gridClassName="drs-list-grid"
                  embeddedInSection
                  pagination
                  paginationPageSize={5}
                  sort
                  onRowClicked={(event) => handleResourceClick(event.data.name)}
                />
              </>
            )}

            {/* ---------- Policy SubTab ---------- */}
            {selectedAuthSubTab === 1 && (
              <>
                <HBox sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                  background: "transparent",
                }}>
                  <HTextField
                    placeholder={intl.formatMessage({ id: "label.product.placeholder.searchPolicy", defaultMessage: "Search Policy" })}
                    value={policySearchTerm}
                    editable
                    onChange={e => setPolicySearchTerm(e.target.value)}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", sm: 350 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "13px",
                      },
                    }}
                  />
                  <HButton
                    variant="contained"
                    onClick={() => {
                      setSelectedPolicy(null);
                      setPolicyDialogOpen(true);
                    }}
                    sx={primaryBtnSx}
                    label="label.product.createPolicy"
                  />
                </HBox>

                <HLabel
                  value={intl.formatMessage({ id: "label.product.policiesFor", defaultMessage: "Policies for {product}" }, { product })}
                  colon={false}
                  translate={false}
                  align="left"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                    mb: 1,
                  }}
                />

                <HAgGrid
                  rowData={policiesRowData}
                  columnDefs={policiesColDefs}
                  gridStyle={{ width: "100%" }}
                  gridClassName="drs-list-grid"
                  embeddedInSection
                  pagination
                  paginationPageSize={5}
                  sort
                  onRowClicked={(event) => handlePolicyClick(event.data.name)}
                />
              </>
            )}

            {/* ---------- Permissions SubTab ---------- */}
            {selectedAuthSubTab === 2 && (
              <>
                <HBox sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                  background: "transparent",
                }}>
                  <HTextField
                    placeholder={intl.formatMessage({ id: "label.product.placeholder.searchPermission", defaultMessage: "Search Permission" })}
                    value={permissionSearchTerm}
                    editable
                    onChange={e => setPermissionSearchTerm(e.target.value)}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", sm: 350 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "13px",
                      },
                    }}
                  />
                  <HButton
                    variant="contained"
                    onClick={() => {
                      setSelectedPermission(null);
                      setPermissionDialogOpen(true);
                    }}
                    sx={primaryBtnSx}
                    label="label.product.createPermission"
                  />
                </HBox>

                <HLabel
                  value={intl.formatMessage({ id: "label.product.permissionsFor", defaultMessage: "Permissions for {product}" }, { product })}
                  colon={false}
                  translate={false}
                  align="left"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                    mb: 1,
                  }}
                />

                <HAgGrid
                  rowData={permissionsRowData}
                  columnDefs={permissionsColDefs}
                  gridStyle={{ width: "100%" }}
                  gridClassName="drs-list-grid"
                  embeddedInSection
                  pagination
                  paginationPageSize={5}
                  sort
                  onRowClicked={(event) => handlePermissionClick(event.data.name)}
                />
              </>
            )}

            {/* ---------- Scopes SubTab ---------- */}
            {selectedAuthSubTab === 3 && (
              <>
                <HBox sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                  alignItems: { xs: "stretch", sm: "center" },
                  mb: 2,
                  background: "transparent",
                }}>
                  <HTextField
                    placeholder={intl.formatMessage({ id: "label.product.placeholder.searchScope", defaultMessage: "Search Scope" })}
                    value={scopeSearchTerm}
                    editable
                    onChange={e => setScopeSearchTerm(e.target.value)}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", sm: 350 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "13px",
                      },
                    }}
                  />
                  <HButton
                    variant="contained"
                    onClick={() => {
                      setSelectedScope(null);
                      setScopeDialogOpen(true);
                    }}
                    sx={primaryBtnSx}
                    label="label.product.createScope"
                  />
                </HBox>

                <HLabel
                  value={intl.formatMessage({ id: "label.product.scopesFor", defaultMessage: "Scopes for {product}" }, { product })}
                  colon={false}
                  translate={false}
                  align="left"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    color: theme.palette.text.primary,
                    fontSize: "14px",
                    mb: 1,
                  }}
                />

                <HAgGrid
                  rowData={scopesRowData}
                  columnDefs={scopesColDefs}
                  gridStyle={{ width: "100%" }}
                  gridClassName="drs-list-grid"
                  embeddedInSection
                  pagination
                  paginationPageSize={5}
                  sort
                  onRowClicked={(event) => handleScopeClick(event.data)}
                />
              </>
            )}
          </HBox>
        )}

        {/* ================== SETTINGS TAB ==================*/}
        {selectedTab === 2 && (
          <HBox sx={{ 
            p: 3, 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: 3,
            background: "transparent",
            width: "100%",
          }}>
            <HLabel
              value={intl.formatMessage({ id: "label.product.settings", defaultMessage: "Product Settings" })}
              colon={false}
              translate={false}
              align="center"
              sx={{
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                color: theme.palette.text.primary,
                fontSize: "16px",
              }}
            />
            
            <HButton
              variant="contained"
              onClick={handleClientDialogOpen}
              sx={{
                ...primaryBtnSx,
                minWidth: "200px",
              }}
              label="label.product.editProduct"
            />
            
            <HLabel
              value={intl.formatMessage({
                id: "label.product.clickEditProduct",
                defaultMessage: "Click the button above to edit the product details including name, description, URIs, and icon."
              })}
              colon={false}
              translate={false}
              align="left"
              sx={{
                fontFamily: "'Inter', sans-serif",
                color: theme.palette.text.secondary,
                fontSize: "13px",
                textAlign: "center",
                maxWidth: "500px",
              }}
            />
          </HBox>
        )}
      </HBox>

      {/* Role Dialog */}
      <CreateRole
        open={roleDialogOpen}
        onClose={handleRoleDialogClose}
        onRoleCreated={handleRoleCreated}
        roleId={selectedRole?.name}
      />

      {/* Resource Dialog */}
      <CreateResource
        open={resourceDialogOpen}
        onClose={handleResourceDialogClose}
        onResourceCreated={handleResourceCreated}
        resourceId={selectedResource}
      />

      {/* Policy Dialog */}
      <CreatePolicy
        open={policyDialogOpen}
        onClose={handlePolicyDialogClose}
        onPolicyCreated={handlePolicyCreated}
        policyId={selectedPolicy}
      />

      {/* Permission Dialog */}
      <PermissionwithResource
        open={permissionDialogOpen}
        onClose={handlePermissionDialogClose}
        onPermissionCreated={handlePermissionCreated}
        permissionId={selectedPermission}
      />

      {/* Scope Dialog */}
      <CreateScope
        open={scopeDialogOpen}
        onClose={handleScopeDialogClose}
        onScopeCreated={handleScopeCreated}
        scopeId={selectedScope?.name}
      />

      {/* Client Settings Dialog */}
      <CreateClient
        open={clientDialogOpen}
        onClose={handleClientDialogClose}
        onClientCreated={handleClientUpdated}
        clientId={product}
      />
    </HBox>
  );
}

export default ClientDetails;