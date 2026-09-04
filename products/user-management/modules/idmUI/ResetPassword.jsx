import { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { HAxiosService, useToast, HDialog } from "@helix/component-library";
import { useParams,useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserManagementAPI } from "./apiEndpoints";

function ResetPassword() {
  const { userId, userNameId } = useParams();
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => {}; // no-op fallback
  }
  const toast = useToast();  
  const [credentials, setCredentials] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const realm = sessionStorage.getItem("SEC_REALM");

  useEffect(() => {
    const fetchUserCredentials = async () => {
      try {
        const response = await HAxiosService.GET(
          UserManagementAPI.get_user_credentials(realm, userId)
        );
        setCredentials(response.data);
      } catch (error) {
        console.error("Error fetching user credentials:", error);
        toast.error("Failed to fetch user credentials", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    };

    fetchUserCredentials();
  }, [realm, userId]);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill out all fields", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    const requestData = {
      id: userId,
      password,
      realm,
      action: "UPDATE_PASSWORD",
    };
  
    try {
      const response = await HAxiosService.PUT(UserManagementAPI.reset_password(), requestData); 
      const { msg, status } = response.data;

      if (status === "SUCCESS") {
        toast.success(msg || "Password reset successfully", {
          position: "top-right",
          autoClose: 1000,
        });
        setOpenDialog(false);
      }  else {
        let errorMessage = "Failed to reset password";
      
        try {
          const parsedMessage = JSON.parse(response.data.message); 
          if (parsedMessage.error_description) {
            errorMessage = parsedMessage.error_description;
          }
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.msg || "Failed to reset password", {
        position: "top-right",
        autoClose: 1000,
      });
    }
};

  const navigateToHomePage = () => {
    //navigate(`/homelayout/users`);
     navigate(`/homelayout/create-user/${userId}/${userNameId}`);
             
    
  };

  const openPasswordResetDialog = () => setOpenDialog(true);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 1, minHeight: "72.5vh" }}>
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
          Reset Password For: {userNameId}
        </Typography>
      </Box>

      {credentials && credentials.length > 0 ? (
  <Grid container spacing={2} sx={{ marginBottom: "20px", marginTop: "2rem" }}>
    <Grid size={12}>
      <Paper sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Grid size={4}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Type:
            </Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Created Date:
            </Typography>
          </Grid>
          
        </Grid>

        <Grid container spacing={2} sx={{ marginTop: 1 }}>
          <Grid size={4}>
            <Typography variant="body2">{credentials[0].type}</Typography>
          </Grid>
          <Grid size={4}>
            <Typography variant="body2">
              {new Date(credentials[0].createdDate).toLocaleString()}
            </Typography>
          </Grid>
          <Grid size={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={openPasswordResetDialog}
          >
            Reset Password
          </Button>
        </Grid>
        </Grid>

      
      </Paper>
    </Grid>
  </Grid>
) : (
  <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
    <Button
      className="primary"
      variant="contained"
      color="primary"
      onClick={openPasswordResetDialog}
    >
      Reset Password
    </Button>
  </Box>
)}

      <HDialog disableContentWrapper open={openDialog} onClose={(e, reason) => { if (reason === "backdropClick") { e.stopPropagation(); } else { setOpenDialog(false); } }} slotProps={{ paper: {
          sx: {
            padding: "20px",
            borderRadius: "6px",
            minWidth: "400px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          },
        } }}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            type={showPassword ? "text" : "password"}
            label="New Password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            variant="standard"
            InputProps={{
              disableUnderline: false,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            variant="standard"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            margin="normal"
            InputProps={{
              disableUnderline: false,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained" color="primary"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained" color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </HDialog>

     </Container>
  );
}

export default ResetPassword;
