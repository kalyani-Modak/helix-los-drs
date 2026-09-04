import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Container, Chip,
  Button
} from "@mui/material";
import { HAxiosService, useToast } from "@helix/component-library"; 
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";

const UserAssignedRoles = () => {
  const toast = useToast();  	
  const { userNameId ,userId} = useParams(); 
  const [userAssignedRoles, setUserRoles] = useState({});
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => {}; // no-op fallback
  }
  const product = sessionStorage.getItem("SEC_PRODUCT");
  const realm = sessionStorage.getItem("SEC_REALM");

  useEffect(() => {
    fetchUserRoles();
  }, []);

   const navigateToHomePage = () => {
   
     navigate(`/homelayout/create-user/${userId}/${userNameId}`);
             
    
  };
  const fetchUserRoles = () => {
    HAxiosService.GET(UserManagementAPI.fetchUsersInRole(realm, userNameId))
      .then((response) => {
        const raw = response?.data || {};
        const normalized = {};
        Object.entries(raw).forEach(([group, roles]) => {
          const list = Array.isArray(roles) ? roles : Object.values(roles || {});
          const names = list.map((r) => (typeof r === "string" ? r : r?.name)).filter(Boolean);
          if (names.length) normalized[group] = names;
        });
        setUserRoles(normalized);
      })
      .catch((error) => {
        console.error("Error fetching user roles:", error);
        toast.error("Failed to load user roles", { autoClose: 100 });
      });
  };
  const handleUnassignRole = (clientId, roleName) => {
    // product must be the role's clientId (group), not session SEC_PRODUCT
    const roleProduct = clientId || product;
    HAxiosService.DELETE(UserManagementAPI.unassign_role(realm, roleProduct, userNameId, roleName))
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, "Role unassigned"), { autoClose: 1000 });
          fetchUserRoles(); 
        } else {
          toast.warn(getApiMsg(response, "Failed to unassign role"), { autoClose: 1500 });
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Error unassigning role";
        toast.error(errorMessage, { autoClose: 1000 });
        console.error("Unassign role error:", error);
      });
  };
  
  return (
    <Container maxWidth="lg" sx={{ marginTop: 1, minHeight: "72.5vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, marginBottom: 2 }}>
        <IconButton sx={{ color: "grey", fontWeight: "bold" }} onClick={navigateToHomePage}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}>
          Roles for : {userNameId}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Roles</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(userAssignedRoles).length > 0 ? (
              Object.entries(userAssignedRoles).map(([group, roles]) =>
                roles.map((role) => (
                  <TableRow key={`${group}-${role}`}>
                  <TableCell sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip label={group} size="small" sx={{ fontWeight: "bold", backgroundColor: "#E0E0E0" }} />
                      {role}
                    </Box>
                    <Button
                      variant="contained" color="primary"
                      onClick={() => handleUnassignRole(group, role)}
                    >
                      Unassign
                    </Button>
                  </TableCell>
                </TableRow>
                
                  
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No roles assigned
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

     </Container>
  );
};

export default UserAssignedRoles;
