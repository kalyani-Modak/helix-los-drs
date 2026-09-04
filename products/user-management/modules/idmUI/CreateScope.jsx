// Updated CreateScope.jsx
import { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HTextField, HButton, useToast, HDialog } from "@helix/component-library";
import { useIntl } from 'react-intl';

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
  py: 0.8,
  px: 2.5,
};

const dangerBtnSx = {
  background: "#E05A5A",
  color: "#fff",
  fontWeight: 600,
  fontSize: "12px",
  borderRadius: "8px",
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(224,90,90,0.25)",
  py: 0.8,
  px: 2.5,
  "&:hover": {
    background: "#c44b4b",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 16px rgba(224,90,90,0.35)",
  },
  transition: "all 0.2s ease",
};

const paperSx = {
  borderRadius: { xs: "10px", sm: "14px" },
  overflow: "hidden",
};

function CreateScope({ open, onClose, onScopeCreated, scopeId: propScopeId }) {
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get scopeId from props (for dialog) or from URL params (for standalone page)
  const params = useParams();
  const urlScopeId = params.scopeId;
  const effectiveScopeId = propScopeId || urlScopeId;

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => { }; // no-op fallback
  }

  const realm = sessionStorage.getItem('SEC_REALM');
  const product = sessionStorage.getItem("SELECTED_PRODUCT");

  const [formData, setFormData] = useState({
    scopeName: '',
    scopeDisplayName: ''
  });

  // Fetch scope data if editing
  useEffect(() => {
    if (effectiveScopeId && (open || !open)) {
      HAxiosService
        .GET(UserManagementAPI.getScope(realm, product, effectiveScopeId))
        .then((response) => {
          if (isHttpSuccess(response)) {
            setFormData((prevData) => ({
              ...prevData,
              scopeName: response.data.name || prevData.scopeName,
              scopeDisplayName: response.data.displayName || prevData.scopeDisplayName,
            }));
          } else {
            toast.error(intl.formatMessage({id: "error.product.scope.failFetch", defaultMessage: "Failed to fetch scope data"}));
          }
        })
        .catch((error) => {
          console.error('Error fetching scope data:', error);
          toast.error(intl.formatMessage({id: "error.product.scope.errorFetch", defaultMessage: "An error occured while fetching the scope data"}));
        });
    }
  }, [effectiveScopeId, open, realm, product, toast]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open && !effectiveScopeId) {
      setFormData({ scopeName: '', scopeDisplayName: '' });
    }
  }, [open, effectiveScopeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { scopeName, scopeDisplayName } = formData;

    if (!scopeName || !scopeDisplayName) {
      toast.error(intl.formatMessage({
        id: "error.product.scope.required",
        defaultMessage: "All fields are required"
      }), { position: "top-right", autoClose: 700 });
      return;
    }

    const updatedFormData = { ...formData, product, realm };
    const method = effectiveScopeId ? 'put' : 'post';

    HAxiosService[method.toUpperCase()](UserManagementAPI.scope(), updatedFormData)
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, effectiveScopeId ? intl.formatMessage({id: "success.product.scope.updated", defaultMessage: "Scope Updated Successfully!"}) : intl.formatMessage({id: "success.product.scope.created", defaultMessage: "Scope Created Successfully!"})), {
            position: 'top-right', autoClose: 1000,
          });

          if (open) {
            onClose();
            if (onScopeCreated) onScopeCreated();
          } else {
            setTimeout(() => { navigate(`/homelayout/client/${product}/#scopes`); }, 1500);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.scope.failSave", defaultMessage: "Failed to save scope"})));
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id: "error.product.scope.errorSave", defaultMessage: "An error occured while saving the scope"}));
      });
  };

  const handleDelete = () => {
    if (!effectiveScopeId) return;

    HAxiosService
      .DELETE(UserManagementAPI.delete_scope(effectiveScopeId, realm, product))
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({id: "success.product.scope.deleted", defaultMessage: "Scope Deleted Successfully!"})), { position: 'top-right', autoClose: 1000 });

          if (open) {
            onClose();
            if (onScopeCreated) onScopeCreated();
          } else {
            setTimeout(() => { navigate(`/homelayout/client/${product}/#scopes`); }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.scope.failDelete", defaultMessage: "Failed to delete scope"})));
        }
      })
      .catch((error) => {
        console.error('Error deleting the scope:', error);
        toast.error(intl.formatMessage({id: "error.product.scope.errorDelete", defaultMessage: "An error occured while deleting the scope"}));
      });
  };

  const handleClose = () => {
    if (open) {
      onClose();
    } else {
      navigate(`/homelayout/client/${product}/#scopes`);
    }
  };

  // Shared field cell style (matching FollowupDetails pattern)
  const fieldCellSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    gap: 0.5,
    background: "transparent"
  };

  // ==================== Shared Form Fields ====================
  const formFields = (isDialog = false) => {
    const labelFontSize = isDialog ? "12px" : "13px";
    const fieldFontSize = isDialog ? "13px" : "14px";

    return (
      <HBox sx={{ display: "flex", flexDirection: "column", gap: isDialog ? 2.5 : 3, background: "transparent" }}>

        {/* Scope Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.scope.name", defaultMessage: "Scope Name"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="scopeName"
            value={formData.scopeName}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.product.placeholder.scopeName", defaultMessage: "Enter Scope Name"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Display Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.scope.displayName", defaultMessage: "Display Name"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="scopeDisplayName"
            value={formData.scopeDisplayName}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.product.placeholder.displayName", defaultMessage: "Enter Display Name"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>
      </HBox>
    );
  };

  // ==================== Dialog Mode ====================
  if (open !== undefined) {
    return (
      <HDialog disableContentWrapper open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { ...paperSx, borderRadius: "12px" } } }}>
        <DialogTitle sx={{
          color: theme.palette.text.primary,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))"
        }}>
          <span>{effectiveScopeId ? intl.formatMessage({id: "label.product.scope.edit", defaultMessage: "Edit Scope"}) : intl.formatMessage({id: "label.product.scope.create", defaultMessage: "Create Scope"})}</span>
          {effectiveScopeId && (
            <HButton 
              label={intl.formatMessage({id: "label.product.scope.delete", defaultMessage: "Delete"})}
              onClick={handleDelete} 
              sx={{ ...dangerBtnSx, py: 0.5, px: 1.5, fontSize: "11px" }}
            />
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {formFields(true)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <HButton
            variant="outlined"
            label={intl.formatMessage({id: "label.product.scope.cancel", defaultMessage: "Cancel"})}
            onClick={handleClose}
            sx={{
              fontSize: "12px",
              textTransform: "none",
              fontWeight: 500,
            }}
          />
          <HButton 
            label={effectiveScopeId ? intl.formatMessage({id: "label.product.scope.update", defaultMessage: "Update Scope"}) : intl.formatMessage({id: "label.product.scope.create", defaultMessage: "Create Scope"})}
            variant="contained" 
            onClick={handleSubmit} 
            sx={primaryBtnSx}
          />
        </DialogActions>
      </HDialog>
    );
  }

  // ==================== Standalone Page Mode ====================
  return (
    <HBox sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      p: { xs: 1, sm: 2, md: 3 },
      boxSizing: "border-box",
    }}>
      <HPaper
        elevation={0}
        sx={{ ...paperSx, maxWidth: "lg", mx: "auto", width: "100%" }}
      >
        {/* Gradient Header */}
        <HBox sx={{
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.2, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          position: "relative",
          overflow: "hidden",
        }}>
          <HBox sx={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <HBox sx={{ position: "absolute", right: 40, bottom: -35, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <IconButton
            onClick={handleClose}
            sx={{ color: "#fff", p: 0.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>

          <HLabel
            value={effectiveScopeId ? intl.formatMessage({id: "label.product.scope.edit", defaultMessage: "Edit Scope"}) : intl.formatMessage({id: "label.product.scope.create", defaultMessage: "Create Scope"}) }
            colon={false}
            translate={false}
            align="left"
            component="div"
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: 14, sm: 18 },
              color: theme.palette.text.primary,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flex: 1,
            }}
          />

          {effectiveScopeId && (
            <HButton 
            label={intl.formatMessage({id: "label.product.scope.deleteScope", defaultMessage: "Delete Scope"})}
              onClick={handleDelete} 
              sx={dangerBtnSx}
            />
          )}
        </HBox>

        {/* Form Content */}
        <HBox sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {formFields(false)}

          {/* Action Buttons */}
          <HBox sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <HButton
              variant="outlined"
              label={intl.formatMessage({id: "label.product.scope.cancel", defaultMessage: "Cancel"})}
              onClick={handleClose}
              sx={{
                fontSize: "13px",
                textTransform: "none",
                fontWeight: 500,
              }}
            />
            <Button 
            label={effectiveScopeId ? intl.formatMessage({id: "label.product.scope.update", defaultMessage: "Update Scope"}) : intl.formatMessage({id: "label.product.scope.create", defaultMessage: "Create Scope"})}
            variant="contained" 
            onClick={handleSubmit} 
            sx={primaryBtnSx}
            />
          </HBox>
        </HBox>
      </HPaper>
    </HBox>
  );
}

export default CreateScope;