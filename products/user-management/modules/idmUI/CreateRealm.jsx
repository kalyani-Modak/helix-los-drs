import React, { useState, useEffect } from 'react';
import { HAxiosService, useToast } from "@helix/component-library";
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Container,
  Grid,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, getApiMsg } from "./apiResponse";

function CreateRealm() {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => {}; // no-op fallback
  }
  const toast = useToast();
  const { realmId } = useParams();
  const [formData, setFormData] = useState({
    realmName: '',
  });

  const  product =sessionStorage.getItem("SELECTED_PRODUCT");

  useEffect(() => {
    if (realmId) {
      HAxiosService
        .GET(UserManagementAPI.realms())
        .then((response) => {
          const realms = Array.isArray(response.data) ? response.data : [];
          const match = realms.find((r) => r === realmId || r?.realm === realmId || r?.id === realmId || r?.name === realmId);
          if (match) {
            setFormData((prevData) => ({
              ...prevData,
              realmName: typeof match === "string" ? match : (match.name || match.realm || prevData.realmName),
            }));
          } else {
            toast.error('Failed to fetch realm data', {
              position: 'top-right',
              autoClose: 700,
            });
          }
        })
        .catch((error) => {
          if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            Navigate('/homelayout/unauthorized');
          } else {
            console.error('Error submitting the form:', error);
            toast.error('An error occurred while saving the realm', {
              position: 'top-right',
              autoClose: 700,
            });
          }
        });
    }
  }, [realmId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { realmName } = formData;
    const updatedFormData = {
        realm : realmName
    };

    if (!realmName) {
      toast.error('All fields are required', {
        position: "top-right",
        autoClose: 700,
      });
      return;
    }

    if (realmId) {
      toast.error('Realm update is not supported', {
        position: "top-right",
        autoClose: 700,
      });
      return;
    }

    HAxiosService.POST(UserManagementAPI.realm(), updatedFormData)
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, realmId ? 'realm updated successfully!' : 'realm created successfully!'), {
            position: 'top-right',
            autoClose: 1000,
          });
          setTimeout(() => {
         navigate("/homelayout/welcomepage");
          }, 2000);
        } else {
          toast.error(getApiMsg(response, 'Failed to save realm'), {
            position: "top-right",
            autoClose: 700,
          });
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error('An error occurred while saving the realm', {
          position: "top-right",
          autoClose: 700,
        });
      });
  };

  const navigateToHomePage = () => {
  
    navigate("/homelayout/welcomepage")
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "72.5vh" }}
      >
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
            Create realm
          </Typography>
        </Box>

        <Grid container spacing={2} marginTop="1rem">
          {Object.keys(formData).map((key) => (
            <React.Fragment key={key}>
              <Grid style={{ display: 'flex', alignItems: 'center' }} size={3}>
                <Typography variant="subtitle1" marginLeft="4rem" fontWeight="Semibold" fontStyle="Open Sans">
                  {key}:
                </Typography>
              </Grid>
              <Grid size={9}>
                <TextField
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                  InputProps={{ disableUnderline: false }}
                  sx={{ marginBottom: "8px" }}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "19px" }}>
          <Button
            color="primary" onClick={handleSubmit} variant="contained"
          >Save realm</Button>
        </Box>
      </Container>

  );
}

export default CreateRealm;
