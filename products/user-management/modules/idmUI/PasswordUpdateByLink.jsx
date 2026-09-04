import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Box,
  Link,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { HAxiosService, useToast } from "@helix/component-library";
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";

// -------------------
// Styles
// -------------------
const inputStyles = {
  mb: 3,
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderRadius: 2,
  input: { color: 'purple' },
  label: { color: 'purple' },
  '& .MuiFilledInput-underline:before': { borderBottomColor: 'purple' },
};

const buttonStyles = {
  py: 1.5,
  fontWeight: 'bold',
  fontSize: '1rem',
  background: 'linear-gradient(90deg, #c788e0ff, #bf05e4ff)',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
  },
};

// -------------------
// Loader Overlay
// -------------------
const LoaderOverlay = ({ active, text }) => {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setDotIndex((prev) => (prev + 1) % 4), 500);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(6px)',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.3s ease-in-out',
      }}
    >
      <CircularProgress
        size={50}
        thickness={4.5}
        sx={{
          color: 'transparent',
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#spinnerGradient)',
            strokeLinecap: 'round',
          },
        }}
      />
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6a11cb" />
            <stop offset="100%" stopColor="#2575fc" />
          </linearGradient>
        </defs>
      </svg>
      {text && (
        <Typography sx={{ mt: 2, color: 'white', fontWeight: 'bold' }}>
          {text}{'.'.repeat(dotIndex)}
        </Typography>
      )}
    </Box>
  );
};

// -------------------
// Error Card
// -------------------
const ErrorCard = ({ message, redirectTo }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.pathname;
    const token = url.split('/').pop();
    if (token) {
      const cleanPath = url.replace(`/${token}`, '');
      window.history.replaceState({}, '', cleanPath);
    }
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', px: 2 }}>
      <Box sx={{ p: 6, borderRadius: 10, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backdropFilter: 'blur(6px)', backgroundColor: 'hsla(0, 0%, 100%, 1.00)', zIndex: 1 }} />
      <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)',
          color: 'white',
          textAlign: 'center',
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 2,
          animation: 'shake 0.6s',
          '@keyframes shake': {
            '0%': { transform: 'translateX(0px)' },
            '25%': { transform: 'translateX(-5px)' },
            '50%': { transform: 'translateX(5px)' },
            '75%': { transform: 'translateX(-5px)' },
            '100%': { transform: 'translateX(0)' },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Link Expired</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{message}</Typography>
        <Link component="button" variant="body2" onClick={() => navigate(redirectTo)} sx={{ color: 'white', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>
          Go Back
        </Link>
      </Paper>
    </Box>
  );
};

// -------------------
// Main Component
// -------------------
function PasswordUpdateByLink() {
  const { realm, token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const tokenValidatedOnce = useRef(false);

  const cleanTokenFromURL = () => {
    if (!token) return;
    const cleanPath = location.pathname.replace(`/${token}`, '');
    window.history.replaceState({}, '', cleanPath);
  };

  const verifyToken = async () => {
    if (!token || !realm) {
      toast.error('Invalid link', { position: 'top-right', autoClose: 2000 });
      setTokenValid(false);
      setLoading(false);
      return;
    }

    sessionStorage.setItem('SEC_REALM', realm);
    if (tokenValidatedOnce.current) return;
    tokenValidatedOnce.current = true;
    setLoading(true);

    try {
      const res = await HAxiosService.POST(
        UserManagementAPI.verify_token_update(),
        { realm, token }
      );
      if (isHttpSuccess(res) && isApiSuccess(res)) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
        toast.error(getApiMsg(res, 'Link expired or invalid'), { position: 'top-right', autoClose: 2000 });
      }
    } catch (err) {
      setTokenValid(false);
      toast.error(err?.response?.data?.message || err.message || 'Unexpected error', { position: 'top-right', autoClose: 2000 });
    } finally {
      cleanTokenFromURL();
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time password match validation
    if (name === 'confirmPassword' || name === 'newPassword') {
      if (name === 'confirmPassword' && value !== formData.newPassword) {
        setConfirmError('Passwords do not match');
      } else if (name === 'newPassword' && formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmError('Passwords do not match');
      } else {
        setConfirmError('');
      }
    }
  };

  const handleSubmit = async () => {
    const { newPassword, confirmPassword } = formData;

    if (!newPassword) {
      toast.error('New Password is required', { position: 'top-right', autoClose: 2000 });
      return;
    }

    if (!confirmPassword) {
      toast.error('Confirm Password is required', { position: 'top-right', autoClose: 2000 });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { position: 'top-right', autoClose: 2000 });
      return;
    }

    setSubmitting(true);
    try {
      const res = await HAxiosService.POST(
        UserManagementAPI.verify_token_update(),
        { realm, token, password: newPassword }
      );
      if (isApiSuccess(res)) {
        toast.success(getApiMsg(res, 'Password updated'), { position: 'top-right', autoClose: 2000 });
        setTimeout(() => navigate(`/${realm}`), 1500);
      } else {
        toast.error(getApiMsg(res, 'Failed to reset password'), { position: 'top-right', autoClose: 2000 });
      }
    } catch {
      toast.error('Error resetting password', { position: 'top-right', autoClose: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [token, realm]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color="secondary" />
      </Container>
    );
  }

  const overlayText = submitting ? 'Updating password' : 'Validating';

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      {!tokenValid ? (
        <ErrorCard message="Your link is invalid or has expired" redirectTo={`/${realm}`} />
      ) : (
        <Paper
          elevation={12}
          sx={{
            p: 5,
            borderRadius: 4,
            color: 'purple',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'bounceFadeIn 0.6s ease-out',
            '@keyframes bounceFadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-20px)' },
              '50%': { opacity: 0.7, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <LoaderOverlay active={loading || submitting} text={overlayText} />
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Reset Password
          </Typography>

          <TextField
            variant="filled"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            sx={inputStyles}
            disabled={loading || submitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" sx={{ color: 'purple' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            variant="filled"
            fullWidth
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(confirmError)}
            helperText={confirmError}
            sx={{ ...inputStyles, mb: 5 }}
            disabled={loading || submitting}
          />

          <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading || submitting} sx={buttonStyles}>
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </Paper>
      )}
    </Container>
  );
}

export default PasswordUpdateByLink;

