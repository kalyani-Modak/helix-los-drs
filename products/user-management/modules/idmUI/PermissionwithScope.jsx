import React, { useEffect, useState } from "react";
import { HAxiosService, useToast } from "@helix/component-library";
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Box,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams,useNavigate } from "react-router-dom";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";

function PermissionwithScope() {
  const toast = useToast();  	
  const { permissionScopeId } = useParams();
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => {}; // no-op fallback
  }
  const [formData, setFormData] = useState({
    permissionName: "",
    permissionDescription: "",
    resourceName: "role",
    scopeNames: [],
    policyNames: [],
  });
  const realm =  sessionStorage.getItem('SEC_REALM');
  const  product =sessionStorage.getItem("SELECTED_PRODUCT");
  const [resourceNames, setResourceNames] = useState([]);
  const [policyNames, setPolicyNames] = useState([]);

  const [scopeNames, setScopeNames] = useState([]);

  const fetchScopeNames = () => {
  
    HAxiosService.GET(UserManagementAPI.fetch_scopes(realm, product))
      .then((response) => {
        console.log("response scope", response);
  
        const { data } = response;
  
        if (data) {
          setScopeNames(data);
        } else {
          console.warn("No data received.");
        }
      })
      .catch((error) => {
        console.error("Error fetching scope names:", error);
      });
  };
  
  useEffect(() => {
    if (realm && product) {
      fetchScopeNames();
    }
  }, [realm, product]);

  useEffect(() => {
    const fetchResourceNames = () => {
      HAxiosService
        .GET(UserManagementAPI.fetch_resources(realm, product))
        .then((response) => {
          const { data } = response;
          if (data) {
            setResourceNames(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching resource names:', error);
        });
    };

    if (realm && product) {
      fetchResourceNames();
    }
  }, [realm, product]);

  useEffect(() => {
    const fetchPolicyNames = () => {
      HAxiosService
        .GET(UserManagementAPI.fetch_policies(realm, product))
        .then((response) => {
          const { data } = response;
          if (data) {
            setPolicyNames(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching policy names:', error);
        });
    };

    if (realm && product) {
      fetchPolicyNames();
    }
  }, [realm, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      permissionName,
      permissionDescription,
      policyNames,
    } = formData;
  
        const updatedFormData = {
      ...formData,
      product,
      realm,
    };
  
    console.log("Permission with Scope Data in updatedFormData:", updatedFormData);
  
    if (
      !permissionName ||
      !permissionDescription ||
      !resourceNames.length ||  
      !scopeNames.length ||    
      !policyNames.length      
    ) {
      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 700,
      });
      return;
    }
    
    try {
      const response = await HAxiosService.POST(
        UserManagementAPI.permission_scope(),
        updatedFormData,
        {},
        false,
        {
            "Content-Type": "application/json",
        }
      );
      if (isApiSuccess(response)) {
        toast.success(getApiMsg(response, "Permission with scope created successfully!"), {
          position: "top-right",
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate(`/homelayout/client/${product}/#permissions`);
        }, 1500);
      } else {
        toast.error(getApiMsg(response, "Failed to create permission with scope"), {
          position: "top-right",
          autoClose: 700,
        });
      }
  
      console.log("Response Data of Permission with scope :", response.data);
    } catch (error) {
      console.error("Error submitting the form:", error);
  
      toast.error("An error occurred while creating the permission with scope", {
        position: "top-right",
        autoClose: 700,
      });
    }
  };
  const handleDelete = () => {
    if (!permissionScopeId) return;

    HAxiosService
      .DELETE(UserManagementAPI.delete_permission(permissionScopeId, realm, product))
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, 'resource deleted successfully!'), {
            position: 'top-right',
            autoClose: 1000,
          });
          setTimeout(() => {
            navigate(`/homelayout/client/${product}/#permissions`);
          }, 2000);
        } else {
          toast.error(getApiMsg(response, 'Failed to delete resource'), {
            position: 'top-right',
            autoClose: 700,
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting the resource:', error);
        toast.error('An error occurred while deleting the resource', {
          position: 'top-right',
          autoClose: 700,
        });
      });
  };
  const navigateToHomePage = () => {
    navigate(`/homelayout/client/${product}/#permissions`);
  };
  function formatLabel(label) {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
  return (
  <Container maxWidth="lg">
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", 
        marginBottom: "16px", 
        position: "relative", 
      }}
    >
      <IconButton
        sx={{
          height: 35,
          width: 35,
          color: "grey",
          fontWeight: "bold",
        }}
        onClick={navigateToHomePage}
      >
        <ArrowBackIcon />
      </IconButton>

      <Typography
        variant="h6"
        sx={{
          position: "absolute", 
          left: "50%",
          transform: "translateX(-50%)", 
          fontWeight: "bold",
          fontFamily: "Montserrat",
        }}
      >
          Permission With Scope
          </Typography>
    </Box>

     
        <Grid container spacing={2}>
          {Object.keys(formData).map((key) => (
            <React.Fragment key={key}>
              <Grid style={{ display: "flex", alignItems: "center" }} size={3}>
                <Typography
                  variant="subtitle1"
                  marginLeft="1rem"
                  fontWeight="Semibold"
                  fontStyle="Open Sans"
                >
                  {formatLabel(key)}:
                </Typography>
              </Grid>
              <Grid size={9}>
                {key === "resourceName" ? (
                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  >
                    <Select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      style={{
                        borderRadius: 4,
                        height: "2.1rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {resourceNames.length > 0 ? (
                        resourceNames.map((resource) => (
                          <MenuItem key={resource} value={resource} style={{ fontSize: "0.7rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",}}>
                            {resource}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No resources available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                ) : key === "scopeNames" ? (
                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  >
                    <Select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      multiple
                      renderValue={(selected) => selected.join(", ")}
                      style={{
                        borderRadius: 4,
                        height: "2.1rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {scopeNames.length > 0 ? (
                        scopeNames.map((scope) => (
                          <MenuItem key={scope.id} value={scope.name}>
                            <Checkbox
                              checked={formData[key].includes(scope.name)}
                              style={{
                                padding: "0px",
                                transform: "scale(0.5)",
                              }}
                            />

                            <ListItemText
                              primary={scope.name}
                              primaryTypographyProps={{
                                style: {
                                  fontSize: "0.8rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                ) : key === "policyNames" ? (
                  <FormControl
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                  >
                    <Select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      multiple
                      renderValue={(selected) => selected.join(", ")}
                      style={{
                        borderRadius: 4,
                        height: "2.1rem",
                        fontSize: "0.8rem",
                      }}
                    >
                    
                    {policyNames.length > 0 ? (
                        policyNames.map((policy) => (
                          <MenuItem key={policy} value={policy}>
                            <Checkbox
                              checked={formData[key].includes(policy)}
                              style={{
                                padding: "0px",
                                transform: "scale(0.5)",
                              }}
                            />

                            <ListItemText
                              primary={policy}
                              primaryTypographyProps={{
                                style: {
                                  fontSize: "0.8rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                            />
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No options available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                    InputProps={{
                      disableUnderline: false,
                    }}
                    sx={{
                      marginBottom: "8px",
                    }}
                  />
                )}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "19px",
          }}
        >
          <Button variant="contained" color="primary"  onClick={handleSubmit}>create</Button>
        </Box>
      </Container>
      );
}

export default PermissionwithScope;

