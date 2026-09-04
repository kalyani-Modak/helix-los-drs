import { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  MenuItem,
} from "@mui/material";
import { HAxiosService, HDialog } from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";

function SessionLimitManager() {
  const realm = sessionStorage.getItem("SEC_REALM");
  const [type, setType] = useState("default");
  const [limit, setLimit] = useState("");
  const [fetchedLimit, setFetchedLimit] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchLimit = async () => {
    try {
      const response = await HAxiosService.GET(
        UserManagementAPI.getSessionLimit(type)
      );
      setFetchedLimit(response.data);
    } catch (error) {
      toast.error("Failed to fetch session limit", { autoClose: 1000 });
      setFetchedLimit(null);
    }
  };

 const handleSubmit = async () => {
  if (!limit || !realm || !type) {
    toast.error("All fields are required", { autoClose: 1000 });
    return;
  }

  try {
    const targetUrl =
      type === "ldap"
        ? UserManagementAPI.setLdapSessionLimit(limit)
        : UserManagementAPI.setDefaultSessionLimit(limit);
    const response = await HAxiosService.PUT(targetUrl);
    setOpenDialog(false);
    setFetchedLimit(response.data);
  } catch (error) {
    toast.error("Failed to set session limit", { autoClose: 1000 });
  }
};


  return (
    <Container maxWidth="lg" sx={{ marginTop: 2, minHeight: "72.5vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Session Limit Configuration
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper sx={{ padding: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={8}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  size="small"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="default">default</MenuItem>
                  <MenuItem value="ldap">ldap</MenuItem>
                </TextField>
              </Grid>
              <Grid size={4}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={fetchLimit}
                >
                  Fetch Limit
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {fetchedLimit && (
          <Grid size={12}>
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="body1">
                Current Limit for <strong>{fetchedLimit.type}</strong>:{" "}
                {fetchedLimit.limit}
              </Typography>
            </Paper>
          </Grid>
        )}

        <Grid sx={{ textAlign: "center", marginTop: 2 }} size={12}>
          <Button
            variant="contained"
            className="primary"
            onClick={() => setOpenDialog(true)}
          >
            Set Limit
          </Button>
        </Grid>
      </Grid>

      <HDialog disableContentWrapper open={openDialog} onClose={() => setOpenDialog(false)} title="Set Session Limit">
        <DialogContent>
          <TextField
            fullWidth
            label="Limit (in characters)"
            size="small"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </HDialog>

      </Container>
  );
}

export default SessionLimitManager;
