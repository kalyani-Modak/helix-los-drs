import { useState, useContext, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Card,
  Fade,
  Zoom,
} from "@mui/material";
import { SessionContext, HAxiosService, HBox, HButton, HLabel, HTextField, useToast, HDialog } from "@helix/component-library";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import QRCodeDisplay from "./QRCodeDisplay";
import { UserManagementAPI } from "./apiEndpoints";
import { isHttpSuccess } from "./apiResponse";
import { useNavigate, useLocation } from 'react-router-dom';
import { useInRouterContext } from "react-router-dom";
import login_screen from "@images/login_screen.png";
import Alhilal_Login from "@images/Al-hilal_Login.png";
import ADCB_Login from "@images/ADCB_Login.png";
import kbank_logo from "@images/kbank.png";
import ADCB_logo from "@images/ADCB.png";
import AlHilal_logo from "@images/Al-Hilal.png";

import { useIntl } from "react-intl";

// Constants
const OTP_TIMER_INTERVAL = 1000;
const OTP_AUTO_CLOSE_DURATION = 700;
const TOAST_AUTO_CLOSE_DURATION = 1000;
const SUCCESS_TOAST_DURATION = 2000;

// Color palettes
const colorPalettes = {
  ADCB: {
    primary: '#0378A6',      // Vibrant blue
    secondary: '#8dbf41',     // Fresh green
    accent: '#bf0404',        // Energetic red
    primaryLight: '#4aa3d9',
    primaryDark: '#025a8c',
    secondaryLight: '#a8d173',
    secondaryDark: '#6b9c2c',
    accentLight: '#f44336',
    accentDark: '#a30404',
    background: {
      start: '#f0f9ff',
      end: '#e6f3e6',
      gradient: 'linear-gradient(145deg, #f8faff 0%, #f0f9f0 100%)'
    },
    cardBg: 'rgba(255, 255, 255, 0.95)',
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      light: '#64748b'
    }
  },

  'AL-HILAL':  {
    primary: '#1B98A0',      // Teal blue
    secondary: '#5FADB7',     // Soft teal
    accent: '#E5A25A',        // Sandy orange
    primaryLight: '#3AA9B1',
    primaryDark: '#0E7A82',
    secondaryLight: '#7FBFC9',
    secondaryDark: '#3F8E98',
    accentLight: '#EAB77C',
    accentDark: '#C4843D',
    background: {
      start: '#E3F2F5',
      end: '#D1E9ED',
      gradient: 'linear-gradient(145deg, #E6F4F7 0%, #D4EAEE 100%)'
    },
    cardBg: 'rgba(255, 255, 255, 0.95)',
    text: {
      primary: '#1C3B40',
      secondary: '#2F5E66',
      light: '#52828C'
    }
  }
};

// Default palette fallback
const defaultPalette = colorPalettes.ADCB;

const shellPalette = {
  navy: "#0b1726",
  blue: "#2563eb",
  blueDeep: "#173f86",
  cyan: "#06b6d4",
  mint: "#00d6b2",
  white: "#f8fafc",
  border: "rgba(148, 163, 184, 0.18)",
};

const shellFeatures = [
  { label: "Real-time Analytics Dashboard", icon: <AssessmentOutlinedIcon fontSize="small" /> },
  { label: "Multi-tenant Organization Support", icon: <GroupsOutlinedIcon fontSize="small" /> },
  { label: "Enterprise Security & Compliance", icon: <SecurityOutlinedIcon fontSize="small" /> },
  { label: "Global Multi-currency Operations", icon: <PublicOutlinedIcon fontSize="small" /> },
];

const shellStats = [
  { value: "150+", label: "INSTITUTIONS" },
  { value: "$2.4B", label: "RECOVERED" },
  { value: "99.9%", label: "UPTIME" },
];

const LoginScreen = () => {
  // Hooks
  if (!useInRouterContext()) {
    console.error("LoginScreen rendered outside of Router!");
  }
  
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const { login } = useContext(SessionContext);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const otpInputRef = useRef(null);
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  const routeRealmCode = location?.state?.realmCode;
  console.log("Route Realm Code:", routeRealmCode);
  const routeRealmDesc = location?.state?.realmDesc;
  const realmRaw = String(routeRealmCode || "").trim().toUpperCase();
  const realmDetailsRaw = routeRealmDesc
    ? JSON.stringify({ code: realmRaw, desc: routeRealmDesc })
    : "";

  const realm = realmRaw;
  const isRealmSelectionRoute = location.pathname === "/" || location.pathname === "/drs" || location.pathname === "/drs/";

  useEffect(() => {
    if (!realm && !isRealmSelectionRoute) {
     handleBackToOrganizations();
    }
  }, [navigate, realm, isRealmSelectionRoute]);

  const getRealmLabel = () => {
    if (!realm) return "Selected organization";

    if (routeRealmDesc) {
      return routeRealmDesc ? `${realm} - ${routeRealmDesc}` : realm;
    }

    try {
      const parsed = realmDetailsRaw ? JSON.parse(realmDetailsRaw) : null;
      const list = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.realms)
          ? parsed.realms
          : Array.isArray(parsed?.data)
            ? parsed.data
            : parsed && typeof parsed === "object"
              ? [parsed]
              : [];

      const matchingRealm = list.find((item) => {
        const code = String(item?.code || item?.realm || item?.name || item?.id || "")
          .trim()
          .toUpperCase();
        return code === realm;
      });

      const description = matchingRealm?.desc || matchingRealm?.description || matchingRealm?.realmDesc || matchingRealm?.label || "";
      return description ? `${realm} - ${description}` : realm;
    } catch (error) {
      console.warn("Unable to parse realm details for display", error);
      return realm;
    }
  };

  const realmLabel = getRealmLabel();
  const orgBadge = realm ? realm.slice(0, 2).toUpperCase() : "OR";

  // Logo selector
  const getLogo = () => {
    if (realm === "ADCB") return ADCB_logo;
    if (realm === "AL-HILAL") return AlHilal_logo;
    return kbank_logo;
  };

  // Logo selector
  const getLoginImage = () => {
    if (realm === "ADCB") return ADCB_Login;
    if (realm === "AL-HILAL") return Alhilal_Login;
    return login_screen;
  };

  const colors = colorPalettes[realm] || defaultPalette;
  const cardLogo = getLogo();
  const loginImage = getLoginImage();

  // State for gradient animation
  const [gradientPosition, setGradientPosition] = useState(0);
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  // State
  const [formData, setFormData] = useState({
    user: "",
    password: "",
    realm: realm,
    action: "LOGIN"
  });
  
  const [errors, setErrors] = useState({ user: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apps, setApps] = useState([]);
  const [tempPassword, setTempPassword] = useState(false);

  const handleBackToOrganizations = useCallback(() => {
    sessionStorage.removeItem("SEC_REALM");
    navigate("/", { replace: true });
  }, [navigate]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Focus QR-code OTP input when the QR OTP step opens
  useEffect(() => {
    if (otpStep && otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 0);
    }
  }, [otpStep]);

  // Helper functions
  const formatTime = useCallback((seconds) => `${seconds}s`, []);
  
  const validateOtp = useCallback((otpValue) => {
    if (!otpValue) return "OTP is required";
    if (!/^\d+$/.test(otpValue)) return "OTP must contain only numbers";
    return "";
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startOtpTimer = useCallback((expiryTime) => {
    clearTimer();
    setOtpTimer(expiryTime);
    setCanResendOtp(false);

    timerRef.current = setInterval(() => {
      setOtpTimer((prevTime) => {
        if (prevTime <= 1) {
          clearTimer();
          setCanResendOtp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, OTP_TIMER_INTERVAL);
  }, [clearTimer]);

  // Event handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleLoginSuccess = useCallback((data) => {
    const { token, refreshToken, expiresIn, product, menus, products, id, msg } = data;
    login(formData.user, { accessToken: token, refreshToken, expiresIn }, menus);
    sessionStorage.setItem("SEC_USERNAME", formData.user);
    sessionStorage.setItem("SEC_PRODUCT", product);
    sessionStorage.setItem("SEC_ID", id);
    if (menus) sessionStorage.setItem("SEC_MENUS", JSON.stringify(menus));
    if (products) sessionStorage.setItem("SEC_PRODUCTS", JSON.stringify(products));
    if (rememberMe) sessionStorage.setItem("SEC_REMEMBER_ME", "true");
    // toast.success(msg || "Welcome to Debt Recovery Suite!");
    navigate("/homelayout/dashboard");
  }, [formData.user, login, navigate, rememberMe, toast]);

  const handleTempPassword = useCallback(() => {
    setTempPassword(true);
    setShowResetDialog(true);
    setSubmitting(false);
  }, []);

  const handleAuthErrors = useCallback((response) => {
    const errorMessage = response.data?.message || "Invalid username or password.";
    setErrorMsg(errorMessage);
    setSubmitting(false);
    toast.error(errorMessage);
  }, [toast]);

  const handleServerError = useCallback((response) => {
    setErrorMsg(response.data?.message || "Server error occurred.");
    setSubmitting(false);
  }, []);

  const handleOtpSetup = useCallback((response) => {
    setQrCodeUrl(response.data.qrCodeUrl);
    setApps(response.data.apps || []);
    setOtpStep(true);
    toast.info("Please follow the setup instructions below", {
      position: "top-right",
      autoClose: OTP_AUTO_CLOSE_DURATION,
    });
  }, [toast]);

  const handleOtpVerification = useCallback((response, isResend) => {
    setOtpRequired(true);
    const expiryTime = response.data.otpExpiresIn || 30;
    startOtpTimer(expiryTime);

    if (!isResend) {
      toast.info("OTP is required. Please enter the OTP sent to your Email.", {
        position: "top-right",
        autoClose: OTP_AUTO_CLOSE_DURATION,
      });
    }
  }, [startOtpTimer, toast]);

  const handleLogin = useCallback(async (e, isResend = false) => {
    e.preventDefault();
    setErrorMsg("");

    // Validate form fields
    const newErrors = {
      user: !formData.user.trim(),
      password: !formData.password.trim(),
    };
    
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { user, password, realm, action } = formData;
      const payload = {
        user,
        password,
        realm,
        action,
        ...(otpRequired && { otp })
      };
      sessionStorage.setItem("SEC_REALM", realm);
      const response = await HAxiosService.POST(
         UserManagementAPI.login(),
        payload,
      );

      // Handle different response scenarios
      if (response.data?.tempPassword) {
        handleTempPassword();
        return;
      }

      if (response.status === 401) {
        handleAuthErrors(response);
        return;
      } 
      
      if (response.status === 500) {
        handleServerError(response);
        return;
      }

      const { status, message, qrCodeUrl: responseQrUrl } = response.data;

      if (status === "SUCCESS" && message === "OTP_REQUIRED") {
        if (responseQrUrl && responseQrUrl !== "null") {
          handleOtpSetup(response);
        } else {
          handleOtpVerification(response, isResend);
        }
        return;
      }

      if (response.data.token && response.data.refreshToken && response.data.expiresIn) {
        handleLoginSuccess(response.data);
      } else {
        setErrorMsg(response.data.message || "Login failed");
      }

    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [formData, otpRequired, handleAuthErrors, handleServerError, handleOtpSetup, handleOtpVerification, handleLoginSuccess, handleTempPassword]);

  const handleOtpSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validation = validateOtp(otp);
    
    if (validation) {
      setOtpError(validation);
      return;
    }
    
    setSubmitting(true);
    try {
      const { user, password, realm } = formData;
      const payload = { 
        user, 
        password, 
        realm, 
        action: "LOGIN", 
        otp: otp.trim() 
      };
      
      const response = await HAxiosService.POST(UserManagementAPI.login(), payload);

      if (response.data?.tempPassword) {
        handleTempPassword();
        return;
      }

      if (response.data.status === "FAILURE" || !response.data.token) {
        const message = response.data.message || "Invalid OTP";
        setErrorMsg(message);
        setOtp("");
        setSubmitting(false);
        return;
      }

      if (isHttpSuccess(response) && response.data.token) {
        handleLoginSuccess(response.data);
      } else {
        const message = response.data.message || "Invalid credentials or OTP";
        setErrorMsg(message);
      }
    } catch (err) {
      console.error("OTP validation error:", err);
      setErrorMsg("An error occurred while verifying OTP.");
    } finally {
      setSubmitting(false);
    }
  }, [otp, formData, validateOtp, handleLoginSuccess, handleTempPassword]);

  const handleResendOtp = useCallback(async () => {
    if (!canResendOtp) return;

    setOtp("");
    setOtpError("");
    
    const event = { preventDefault: () => {} };
    await handleLogin(event, true);
    
    toast.info("OTP has been resent to your device", {
      position: "top-right",
      autoClose: OTP_AUTO_CLOSE_DURATION,
    });
  }, [canResendOtp, handleLogin, toast]);

  const handlePasswordReset = useCallback(() => {
    if (!oldPassword.trim()) {
      toast.error("Old password is required", {
        position: "top-right",
        autoClose: TOAST_AUTO_CLOSE_DURATION,
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: TOAST_AUTO_CLOSE_DURATION,
      });
      return;
    }

    setSubmitting(true);
    const resetData = {
      username: formData.user,
      realm: formData.realm,
      oldPassword: oldPassword,
      newPassword: newPassword,
      otp: otp,
    };

    HAxiosService.PUT(UserManagementAPI.reset_password_login(), resetData)
      .then((response) => {
        if (response.data.status === "SUCCESS") {
          // Reset all form states
          setShowResetDialog(false);
          setFormData({
            user: "",
            password: "",
            realm: realm || "",
            action: "LOGIN",
          });
          setErrors({ user: false, password: false });
          setErrorMsg("");
          setOtpRequired(false);
          setOtpStep(false);
          setOtp("");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTempPassword(false);
          
          toast.success("Password reset successful. Please login with your new password.", {
            position: "top-right",
            autoClose: SUCCESS_TOAST_DURATION,
          });
        } else {
          toast.error(response.data.message || "Failed to reset password", {
            position: "top-right",
            autoClose: TOAST_AUTO_CLOSE_DURATION,
          });
        }
      })
      .catch((error) => {
        console.error("Password reset error:", error);
        const message = error.response?.data?.message ||
          "An error occurred during password reset.";
        toast.error(message, {
          position: "top-right",
          autoClose: TOAST_AUTO_CLOSE_DURATION,
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  }, [oldPassword, newPassword, confirmPassword, formData.user, formData.realm, otp, toast]);

  // Memoized values - Enhanced header with gradient
  const headerStyles = useMemo(() => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "8px 16px" : "12px 40px",
    background: `linear-gradient(90deg, 
      ${colors.primary} 0%, 
      ${colors.secondary} 50%, 
      ${colors.primary} 100%)`,
    height: isMobile ? 56 : 64,
    flexShrink: 0,
    zIndex: 10,
    boxShadow: `0 4px 20px ${colors.primary}40`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(90deg, 
        transparent 0%, 
        rgba(255,255,255,0.2) 50%, 
        transparent 100%)`,
      transform: `translateX(${gradientPosition - 100}%)`,
      transition: "transform 0.3s ease",
      pointerEvents: "none",
    }
  }), [isMobile, gradientPosition, colors]);

  // Main layout with vibrant background
  const mainContentStyles = useMemo(() => ({
    flex: 1,
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isMobile ? 2 : 4,
    padding: isMobile ? 2 : 4,
    background: colors.background.gradient,
    height: `calc(100vh - ${isMobile ? 56 : 64}px)`,
    overflow: "hidden",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(${gradientPosition}deg, 
        ${colors.primary}10 0%, 
        ${colors.secondary}10 50%, 
        ${colors.accent}10 100%)`,
      pointerEvents: "none",
    }
  }), [isMobile, gradientPosition, colors]);

  // Illustration section with floating animation
  const imageBoxStyles = useMemo(() => ({
    flex: 1.22,
    display: isMobile ? "none" : "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    zIndex: 2
  }), [isMobile]);

  // Enhanced image styles with border radius
  const imageStyles = {
    width: "90%",
    maxWidth: 500,
    maxHeight: "90%",
    objectFit: "contain",
    filter: `drop-shadow(0 20px 30px ${colors.primary}40)`,
    // Border radius and additional styling
    borderRadius: "32px 8px 32px 8px", // Asymmetric modern border radius
    border: `3px solid ${colors.secondary}30`,
    boxShadow: `0 25px 40px -15px ${colors.primary}60, 
                0 10px 20px -10px ${colors.secondary}40,
                inset 0 0 0 1px ${colors.primary}10`,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    background: `linear-gradient(145deg, ${colors.primary}05, ${colors.secondary}05)`,
    padding: "4px", // Creates a subtle inner border effect
    "&:hover": {
      transform: "scale(1.02) translateY(-5px)",
      boxShadow: `0 30px 50px -15px ${colors.primary}80, 
                  0 15px 30px -10px ${colors.secondary}60,
                  inset 0 0 0 2px ${colors.secondary}40`,
      borderColor: colors.secondary,
    }
  };

  // Login card section
  const formBoxStyles = useMemo(() => ({
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    px: isMobile ? 2 : 0,
    zIndex: 2,
  }), [isMobile]);

  // Card with dynamic gradient based on active color
  const getActiveGradient = useCallback(() => {
    const colorCycle = [
      `radial-gradient(circle at ${gradientPosition}% 30%, ${colors.primary}15, ${colors.cardBg} 70%)`,
      `radial-gradient(circle at ${gradientPosition}% 70%, ${colors.secondary}15, ${colors.cardBg} 70%)`,
      `radial-gradient(circle at ${gradientPosition}% 50%, ${colors.accent}15, ${colors.cardBg} 70%)`,
    ];
    return colorCycle[Math.floor(activeColorIndex / 10) % 3];
  }, [gradientPosition, activeColorIndex, colors]);

  const cardStyles = useMemo(() => ({
    width: "100%",
    maxWidth: 400,
    borderRadius: 4,
    padding: isMobile ? 2 : 3,
    background: getActiveGradient(),
    boxShadow: `0 25px 50px -12px ${colors.primary}40, 0 0 0 1px ${colors.primary}20`,
    height: "auto",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${colors.primary}30`,
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      boxShadow: `0 30px 60px -12px ${colors.primary}60, 0 0 0 2px ${colors.primary}40`,
      // transform: "translateY(-2px)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(125deg, 
        ${colors.primary}20 0%, 
        ${colors.secondary}10 ${gradientPosition}%, 
        ${colors.accent}20 100%)`,
      pointerEvents: "none",
      zIndex: 1,
    }
  }), [isMobile, gradientPosition, getActiveGradient, colors]);

  const cardContentStyles = {
    p: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    position: "relative",
    zIndex: 2,
  };

  const formContainerStyles = {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 1.5 : 2,
    height: "100%",
    overflow: "hidden",
  };

  const logoCircleStyles = {
    width: isMobile ? 70 : 90,
    height: isMobile ? 70 : 90,
    borderRadius: "50%",
    background: "#ffffff",
    border: `3px solid ${colors.secondary}`,
    boxShadow: `0 8px 20px ${colors.primary}40`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isMobile ? 0.5 : 1,
    transition: "all 0.3s ease",
  };

  // Logo container with enhanced styling
  const logoContainerStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    mb: isMobile ? 1 : 1.5,
    flexShrink: 0,
    position: "relative",
    zIndex: 3,
  };

  const logoImageStyles = {
    width: isMobile ? 70 : 90,
    height: isMobile ? 70 : 90,
    objectFit: "contain",
    borderRadius: "50%",
    background: "#ffffff",
    border: `3px solid ${colors.secondary}`,
    boxShadow: `0 8px 20px ${colors.primary}40`,
    transition: "all 0.3s ease",
  };

  // Dark input styling for the compact login shell.
  const textFieldStyles = {
  width: "100%",
  flexShrink: 0,
  "& .MuiOutlinedInput-root": {
    height: 46,
    borderRadius: "8px",
    color: shellPalette.white,
    backgroundColor: "#0c121a",
    fontSize: 14.5,
    transition: "border-color 0.2s ease",
    "&:hover": { backgroundColor: "#0c121a" },
    "&.Mui-focused": { backgroundColor: "#0c121a" },
  },
  // Target the notched outline directly
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(148, 163, 184, 0.14)",
    borderRadius: "8px",
    // Collapse the notch/legend so no gap appears
    "& legend": { display: "none" },
    top: 0,
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(148, 163, 184, 0.28)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: shellPalette.blue,
    borderWidth: "1.5px",
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ef4444",
  },
  "& input": {
    color: shellPalette.white,
    caretColor: shellPalette.cyan,
    padding: "0 14px",
    height: 46,
    boxSizing: "border-box",
  },
  "& input::placeholder": {
    color: "#8d98a8",
    opacity: 1,
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #0c121a inset",
    WebkitTextFillColor: shellPalette.white,
    caretColor: shellPalette.white,
    borderRadius: "8px",
  },
  "& input:-webkit-autofill:hover": {
    WebkitBoxShadow: "0 0 0 100px #0c121a inset",
    WebkitTextFillColor: shellPalette.white,
  },
  "& input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 100px #0c121a inset",
    WebkitTextFillColor: shellPalette.white,
  },
};

  const renderLoginForm = () => (
    <Fade in={true} timeout={300}>
      <form onSubmit={otpRequired ? handleOtpSubmit : handleLogin} style={{ width: "100%" }}>
        <Box>
          <Button
            type="button"
            onClick={handleBackToOrganizations}
            startIcon={<KeyboardBackspaceIcon />}
            sx={{
              p: 0,
              minWidth: 0,
              color: "#8d98a8",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent", color: shellPalette.white },
            }}
          >
            Back to organizations
          </Button>

          <Box
            sx={{
              mt: 2.8,
              width: "fit-content",
              maxWidth: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.2,
              py: 0.8,
              borderRadius: "8px",
              color: shellPalette.mint,
              backgroundColor: "rgba(0, 214, 178, 0.12)",
              border: "1px solid rgba(0, 214, 178, 0.2)",
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "6px",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                backgroundColor: shellPalette.mint,
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              {orgBadge}
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
              {realmLabel}
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              mt: 3,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: { xs: 25, sm: 27 },
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: "-0.25px",
            }}
          >
            Welcome back
          </Typography>
          <Typography sx={{ mt: 0.8, color: "#9aa6b6", fontSize: 14.5 }}>
            Sign in to your account
          </Typography>

          <Box sx={{ mt: 2.9 }}>
            {errorMsg && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  color: "#fecaca",
                  backgroundColor: "rgba(127, 29, 29, 0.24)",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  "& .MuiAlert-icon": { color: "#fca5a5" },
                }}
              >
                {errorMsg}
              </Alert>
            )}

            <Typography sx={{ mb: 0.8, color: "#a5afbd", fontSize: 12.5 }}>
              Username
            </Typography>
            <TextField
              name="user"
              value={formData.user}
              onChange={handleChange}
              placeholder="Enter username"
              error={errors.user}
              fullWidth
              autoComplete="username"
              sx={textFieldStyles}
            />

            <Typography sx={{ mt: 2, mb: 0.8, color: "#a5afbd", fontSize: 12.5 }}>
              Password
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              error={errors.password}
              fullWidth
              autoComplete="current-password"
              sx={textFieldStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      edge="end"
                      sx={{ color: "#657286", mr: -0.4 }}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {otpRequired && (
              <>
                <Typography sx={{ mt: 2, mb: 0.8, color: "#a5afbd", fontSize: 12.5 }}>
                  OTP
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  error={!!otpError}
                  sx={textFieldStyles}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.8 }}>
                  <Typography
                    onClick={canResendOtp ? handleResendOtp : undefined}
                    sx={{
                      color: canResendOtp ? "#2f7df6" : "#657286",
                      cursor: canResendOtp ? "pointer" : "default",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    role={canResendOtp ? "button" : undefined}
                    tabIndex={canResendOtp ? 0 : undefined}
                  >
                    Resend OTP {otpTimer > 0 && `in ${formatTime(otpTimer)}`}
                  </Typography>
                </Box>
              </>
            )}

            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    size="small"
                    sx={{
                      p: 0.3,
                      color: "#3a4655",
                      "&.Mui-checked": { color: shellPalette.blue },
                    }}
                  />
                }
                label="Remember me"
                sx={{
                  m: 0,
                  color: "#8d98a8",
                  ".MuiFormControlLabel-label": { fontSize: 12.5 },
                }}
              />
              <Button
                type="button"
                onClick={() => toast.info("Please contact your administrator to reset your password.")}
                sx={{
                  p: 0,
                  minWidth: 0,
                  color: "#2f7df6",
                  fontSize: 12.5,
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "transparent", color: "#60a5fa" },
                }}
              >
                Forgot password?
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{
                mt: 3,
                height: 48,
                borderRadius: "8px",
                backgroundColor: shellPalette.blueDeep,
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { backgroundColor: "#1d4ed8", boxShadow: "none" },
                "&.Mui-disabled": {
                  backgroundColor: shellPalette.blueDeep,
                  color: "rgba(255, 255, 255, 0.38)",
                },
              }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : "Sign In"}
            </Button>
          </Box>

          <Divider sx={{ my: 4, borderColor: "rgba(148, 163, 184, 0.12)" }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "rgba(148, 163, 184, 0.28)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 15 }} />
            <Typography sx={{ fontSize: 12 }}>Secure login - Powered by Ebix</Typography>
          </Box>
        </Box>
      </form>
    </Fade>
  );

  const renderLegacyLoginForm = () => (
    <Fade in={true} timeout={600}>
      <form onSubmit={otpRequired ? handleOtpSubmit : handleLogin} style={{ width: "100%", height: "100%" }}>
        <Box sx={formContainerStyles}>
          <Box sx={logoContainerStyles}>
            <Zoom in={true} style={{ transitionDelay: "100ms" }}>
              <Box sx={logoCircleStyles}>
                <Box
                  component="img"
                  src={cardLogo}
                  alt="Realm Logo"
                  sx={logoImageStyles}
                />
              </Box>
            </Zoom>

            <Typography
              variant={isMobile ? "body2" : "body1"}
              fontWeight={600}
              textAlign="center"
              sx={{
                color: colors.primary,
                textShadow: `0 1px 2px ${colors.primary}20`,
                fontSize: isMobile ? "1rem" : "1.1rem",
              }}
            >
              Welcome {realm ? `to ${realm}` : ""}!
            </Typography>

            <Typography variant="caption" sx={{ color: colors.text.secondary }}>
              Please enter your credentials
            </Typography>
          </Box>
          {/* Form Fields - Compact spacing */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: isMobile ? 1.5 : 2, flexShrink: 0 }}>
            <TextField 
              label="Username" 
              name="user" 
              value={formData.user} 
              onChange={handleChange} 
              error={errors.user} 
              helperText={errors.user ? "Username is required" : " "}
              fullWidth
              size="small"
              sx={textFieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: colors.primary, fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password ? "Password is required" : " "}
              fullWidth
              size="small"
              sx={textFieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: colors.secondary, fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      edge="end"
                      sx={{ color: colors.primary }}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {otpRequired && (
              <>
                <TextField 
                  fullWidth 
                  label="OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)} 
                  error={!!otpError} 
                  helperText={otpError || " "}
                  size="small"
                  sx={textFieldStyles}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography
                    variant="caption"
                    onClick={canResendOtp ? handleResendOtp : undefined}
                    sx={{
                      color: canResendOtp ? colors.accent : colors.text.light,
                      cursor: canResendOtp ? "pointer" : "default",
                      fontWeight: canResendOtp ? 500 : 400,
                      transition: "color 0.2s ease",
                      "&:hover": canResendOtp ? {
                        color: colors.accentDark,
                      } : {},
                    }}
                    role={canResendOtp ? "button" : undefined}
                    tabIndex={canResendOtp ? 0 : undefined}
                  >
                    Resend OTP {otpTimer > 0 && `in ${formatTime(otpTimer)}`}
                  </Typography>
                </Box>
              </>
            )}
            
            {errorMsg && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2, 
                  py: 0,
                  backgroundColor: `${colors.accent}10`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}30`,
                  '& .MuiAlert-icon': {
                    color: colors.accent,
                  }
                }}
                size="small"
              >
                {errorMsg}
              </Alert>
            )}
          </Box>

          {/* Button and Footer - Fixed at bottom */}
          <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="small"
              sx={{
                py: 1,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                boxShadow: `0 4px 15px ${colors.primary}60`,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255,255,255,0.3) 50%, 
                    transparent 100%)`,
                  transform: `translateX(${gradientPosition - 100}%)`,
                  transition: "transform 0.3s ease",
                },
                "&:disabled": {
                  background: "#e0e0e0",
                }
              }}
              disabled={submitting}
            >
              {submitting ? "Processing…" : "Sign In"}
            </Button>

            <Typography 
              variant="caption" 
              sx={{ color: colors.text.light, textAlign: "center" }}
            >
              Secure login • Powered by Ebix
            </Typography>
          </Box>
        </Box>
      </form>
    </Fade>
  );

  const renderOtpForm = () => (
    <Fade in={true} timeout={600}>
      <form onSubmit={handleOtpSubmit} style={{ width: "100%", height: "100%" }}>
        <Box sx={formContainerStyles}>
          {/* Logo */}
          <Box sx={logoContainerStyles}>
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <Box sx={logoCircleStyles}>
                <Box
                  component="img"
                  src={cardLogo}
                  alt={`${realm || 'Ebix'} Logo`}
                  sx={logoImageStyles}
                />
              </Box>
            </Zoom>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              fontWeight={600} 
              sx={{ color: colors.secondary }}
            >
              Two-Factor Auth
            </Typography>
          </Box>

          {/* OTP Content - Compact */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexShrink: 0 }}>
            <Typography variant="caption" sx={{ color: colors.text.secondary }} textAlign="center">
              Scan QR Code with authenticator app:
            </Typography>
            
            {apps?.length > 0 && (
              <Box>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {apps.map((app, idx) => (
                    <li key={idx}>
                      <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 500 }}>
                        • {app}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
            
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              p: 1,
              background: `linear-gradient(135deg, #ffffff, ${colors.secondary}10)`,
              borderRadius: 3,
              boxShadow: `0 4px 12px ${colors.primary}20`,
              border: `1px solid ${colors.primary}20`,
            }}>
              <QRCodeDisplay url={qrCodeUrl} />
            </Box>
            
            <TextField
              inputRef={otpInputRef}
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setOtpError(validateOtp(e.target.value));
              }}
              error={!!otpError}
              helperText={otpError || " "}
              size="small"
              sx={textFieldStyles}
            />
            
            {errorMsg && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: `${colors.accent}10`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}30`,
                  '& .MuiAlert-icon': {
                    color: colors.accent,
                  }
                }} 
                size="small"
              >
                {errorMsg}
              </Alert>
            )}
          </Box>

          {/* Buttons */}
          <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1, flexShrink: 0 }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting || !otp || !!otpError}
              fullWidth
              size="small"
              sx={{
                py: 1,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
                background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                boxShadow: `0 4px 15px ${colors.primary}60`,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255,255,255,0.3) 50%, 
                    transparent 100%)`,
                  transform: `translateX(${gradientPosition - 100}%)`,
                  transition: "transform 0.3s ease",
                },
                "&:hover": {
                  background: `linear-gradient(90deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`,
                  boxShadow: `0 6px 20px ${colors.primary}80`,
                  transform: "translateY(-2px)",
                  "&::before": {
                    transform: `translateX(${gradientPosition}%)`,
                  }
                },
                "&:disabled": {
                  background: "#e0e0e0",
                }
              }}
            >
              {submitting ? "Verifying…" : "Verify OTP"}
            </Button>

            <Button 
              onClick={() => {
                setOtpStep(false);
                setOtpRequired(false);
                setOtp("");
              }}
              size="small"
              sx={{ 
                textTransform: "none",
                color: colors.text.secondary,
                fontSize: "0.8rem",
                transition: "color 0.2s ease",
                "&:hover": { color: colors.primary }
              }}
            >
              ← Back to Login
            </Button>
          </Box>
        </Box>
      </form>
    </Fade>
  );

  return (
    <>
        <Card
          ref={cardRef}
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 448,
            mt: { md: -0.5 },
            p: { xs: 3, sm: 4 },
            mr: { md: 14 },
            transform: { md: "translateX(74px)" },
            borderRadius: "8px",
            color: shellPalette.white,
            backgroundColor: "rgba(15, 25, 36, 0.96)",
            border: `1px solid ${shellPalette.border}`,
            boxShadow: "0 28px 70px rgba(0, 0, 0, 0.28)",
          }}
        >
          {!otpStep ? renderLoginForm() : renderOtpForm()}
        </Card>

      {/* Reset Password Dialog with enhanced styling */}
      <HDialog disableContentWrapper open={showResetDialog} onClose={() => setShowResetDialog(false)} fullScreen={isMobile} maxWidth="xs" fullWidth slotProps={{ paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            p: isMobile ? 1.5 : 2,
            border: `1px solid ${colors.primary}20`,
          }
        } }}>
        <DialogTitle sx={{ pb: 1, px: 0 }}>
          <HLabel
            value={intl.formatMessage({id: "label.login.resetPassword", defaultMessage: "Reset Password"})}
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{
              fontSize: isMobile ? "0.875rem" : "1rem",
              fontWeight: 600,
              color: colors.primary,
            }}
          />
        </DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <HBox sx={{ mb: 2 }}>
            <HTextField
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              editable
              width="100%"
              type="password"
              placeholder={intl.formatMessage({id: "label.login.placeholder.oldPassword", defaultMessage: "Old Password"})}
            />
          </HBox>
          <HBox sx={{ mb: 2 }}>
            <HTextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              editable
              width="100%"
              type="password"
              placeholder={intl.formatMessage({id: "label.login.placeholder.newPassword", defaultMessage: "New Password"})}
            />
          </HBox>
          <HBox>
            <HTextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              editable
              width="100%"
              type="password"
              placeholder={intl.formatMessage({id: "label.login.placeholder.confirmPassword", defaultMessage: "Confirm Password"})}
            />
          </HBox>
        </DialogContent>
        <DialogActions sx={{ p: 0, pt: 1 }}>
          <HButton
            label={intl.formatMessage({id: "label.login.cancel", defaultMessage: "Cancel"})}
            variant="outlined"
            size="small"
            onClick={() => setShowResetDialog(false)}
          />
          <HButton
            label={submitting ? intl.formatMessage({id: "label.login.resetting", defaultMessage: "Resetting..."}) : intl.formatMessage({id: "label.login.reset", defaultMessage: "Reset"})}
            variant="contained"
            size="small"
            disabled={submitting}
            onClick={handlePasswordReset}
          />
        </DialogActions>
      </HDialog>
    </>
  );
};

export default LoginScreen;