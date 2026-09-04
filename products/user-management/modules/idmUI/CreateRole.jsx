// Updated CreateRole.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HButton, HLabel, HPaper, HTextField, HTextarea, useToast, HDialog } from "@helix/component-library";
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
  boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
  overflow: "hidden",
};

function CreateRole({ open, onClose, onRoleCreated, roleId: propRoleId }) {
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get roleId from props (for dialog) or from URL params (for standalone page)
  const params = useParams();
  const urlRoleId = params.roleId;
  const effectiveRoleId = propRoleId || urlRoleId;

  const [formData, setFormData] = useState({
    roleName: '',
    description: ''
  });
  
  const realm = sessionStorage.getItem('SEC_REALM');
  const product = sessionStorage.getItem("SELECTED_PRODUCT");

  useEffect(() => {
    if (effectiveRoleId && (open || !open)) { // Fetch when dialog opens or on standalone page
      HAxiosService
        .GET(UserManagementAPI.getRole(realm, product, effectiveRoleId))
        .then((response) => {
          if (isHttpSuccess(response)) {
            setFormData((prevData) => ({
              ...prevData,
              roleName: response.data.name || prevData.roleName,
              description: response.data.description || prevData.description,
            }));
          } else {
            toast.error(intl.formatMessage({id: "error.product.role.failFetch",defaultMessage: "Failed to fetch Role data"}), {
              position: 'top-right',
              autoClose: 700,
            });
          }
        })
        .catch((error) => {
          if (error.response && (error.response.status === 403 || error.response.status === 401)) {
            if (!open) navigate('/homelayout/unauthorized');
          } else {
            console.error('Error fetching role:', error);
            toast.error(intl.formatMessage({id: "error.product.role.errorFetch",defaultMessage: "An error occurred while fetching the roles"}), {
              position: 'top-right',
              autoClose: 700,
            });
          }
        });
    }
  }, [effectiveRoleId, open, realm, product, toast, navigate]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open && !effectiveRoleId) {
      setFormData({ roleName: '', description: '' });
    }
  }, [open, effectiveRoleId]);

  const handleDelete = () => {
    if (!effectiveRoleId) return;

    HAxiosService
      .DELETE(UserManagementAPI.delete_role(effectiveRoleId, realm, product))
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({id: "success.product.role.roleDelete",defaultMessage: "Role deleted successfully"})), {
            position: 'top-right',
            autoClose: 1000,
          });
          
          if (open) {
            // If in dialog mode, close and notify parent
            onClose();
            if (onRoleCreated) onRoleCreated();
          } else {
            // If in standalone mode, navigate back
            setTimeout(() => {
              navigate(`/homelayout/client/${product}/#role`);
            }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.role.roleDelete",defaultMessage: "Failed to delete Role"})), {
            position: 'top-right',
            autoClose: 700,
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting the role:', error);
        toast.error(intl.formatMessage({id: "error.product.role.errorDelete",defaultMessage: "An error occurred while deleting the Role"}), {
          position: 'top-right',
          autoClose: 700,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTextArea  = (name, e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { roleName, description } = formData;

    if (!roleName) {
      toast.error(intl.formatMessage({id: "error.product.role.required",defaultMessage: "Role Name is required"}), {
        position: "top-right",
        autoClose: 700,
      });
      return;
    }

    const updatedFormData = {
      realm,
      product,
      roleName,
      description: description || '',
    };

    const method = effectiveRoleId ? 'put' : 'post';

    HAxiosService[method.toUpperCase()](UserManagementAPI.role(), updatedFormData)
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, effectiveRoleId ? intl.formatMessage({id: "success.product.role.update",defaultMessage: "Role updated successfully!"}) : intl.formatMessage({id: "success.product.role.create",defaultMessage: "Role created successfully!"})), {
            position: 'top-right',
            autoClose: 1000,
          });
          
          if (open) {
            // If in dialog mode, close and notify parent
            onClose();
            if (onRoleCreated) onRoleCreated();
          } else {
            // If in standalone mode, navigate back
            setTimeout(() => {
              navigate(`/homelayout/client/${product}/#role`);
            }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.role.failSave",defaultMessage: "Failed to save Role"})), {
            position: "top-right",
            autoClose: 700,
          });
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id: "error.product.role.errorSave",defaultMessage: "An error occurred while saving the Role"}), {
          position: "top-right",
          autoClose: 700,
        });
      });
  };

  const handleClose = () => {
    if (open) {
      onClose();
    } else {
      navigate(`/homelayout/client/${product}/#role`);
    }
  };

  // If used as a dialog
  if (open !== undefined) {
    return (
      <HDialog disableContentWrapper open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: {
          sx: {
            ...paperSx,
            borderRadius: "12px",
          }
        } }}>
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
          <span>{effectiveRoleId ? intl.formatMessage({id: "label.product.role.edit",defaultMessage: "Edit Role"}) : intl.formatMessage({id: "label.product.role.create",defaultMessage: "Create Role"})}</span>
          {effectiveRoleId && (
            <HButton
              label={intl.formatMessage({id: "label.product.role.delete",defaultMessage: "Delete"})}
              onClick={handleDelete}
              sx={{
                ...dangerBtnSx,
                py: 0.5,
                px: 1.5,
                fontSize: "11px",
              }}
            />
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, background: "transparent" }}>
            <HBox sx={{background: "transparent"}}>
              <HLabel
                required={true}
                value={intl.formatMessage({id: "label.product.role.name",defaultMessage: "Role Name"})}
                align="left"
                colon={false}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 0.5,
                }}
              />
              <HTextField
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder={intl.formatMessage({id: "label.product.placeholder.roleName",defaultMessage: "Enter Role Name"})}
                editable={true}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "13px",
                  },
                }}
              />
            </HBox>

            <HBox sx={{background: "transparent"}}>
              <HLabel
                value={intl.formatMessage({id: "label.product.role.desc",defaultMessage: "Description"})}
                align="left"
                colon={false}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  mb: 0.5,
                }}
              />
                
              <HTextarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChangeTextArea("description", e)}
                width='100%'
                multiline
                rows={3}
                placeholder={intl.formatMessage({id: "label.product.placeholder.roleDesc",defaultMessage: "Enter Role Description"})}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "13px",
                  },
                }}
              />
            </HBox>
          </HBox>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <HButton
            label={intl.formatMessage({id: "label.product.role.cancel",defaultMessage: "Cancel"})}
            onClick={handleClose}
            variant="outlined"
          />
          <HButton
            label={effectiveRoleId ? intl.formatMessage({id: "label.product.role.update",defaultMessage: "Update Role"}) : intl.formatMessage({id: "label.product.role.create",defaultMessage: "Create Role"})}
            variant="contained"
            onClick={handleSubmit}
          />
        </DialogActions>
      </HDialog>
    );
  }

  // Standalone page version (fallback)
  return (
    <Container maxWidth="lg" sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      p: { xs: 1, sm: 2, md: 3 },
      boxSizing: "border-box",
    }}>
      <HPaper elevation={0} sx={paperSx}>
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
          <HBox sx={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            pointerEvents: "none"
          }} />
          <HBox sx={{
            position: "absolute",
            right: 40,
            bottom: -35,
            width: 110,
            height: 110,
            borderRadius: "50%",
            pointerEvents: "none"
          }} />
          
          <IconButton
            onClick={handleClose}
            sx={{
              p: 0.5,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <HLabel
            value={effectiveRoleId ? intl.formatMessage({id: "label.product.role.edit",defaultMessage: "Edit Role"}) : intl.formatMessage({id: "label.product.role.create",defaultMessage: "Create Role"})}
            align="left"
            colon={false}
            sx={{
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: 14, sm: 18 },
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flex: 1,
              color: theme.palette.text.primary
            }}
          />
          {effectiveRoleId && (
            <HButton
              label={intl.formatMessage({id: "label.product.role.delRole",defaultMessage: "Delete Role"})}
              onClick={handleDelete}
              sx={dangerBtnSx}
            />
          )}
        </HBox>

        {/* Form Content */}
        <HBox sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <HBox>
              <HLabel
                required={true}
                value={intl.formatMessage({id: "label.product.role.name",defaultMessage: "Role Name"})}
                align="left"
                colon={false}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: colors.text.primary,
                  mb: 1,
                }}
              />
              <HTextField
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder={intl.formatMessage({id: "label.product.placeholder.roleName",defaultMessage: "Enter Role Name"})}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                  },
                }}
              />
            </HBox>

            <HBox>
              <HLabel 
                value={intl.formatMessage({id: "label.product.role.desc",defaultMessage: "Description"})}
                align="left"
                colon={false}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              />
              <HTextarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                editable={true}
                fullWidth
                multiline
                rows={4}
                placeholder={intl.formatMessage({id: "label.product.placeholder.roleDesc",defaultMessage: "Enter Role Description"})}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "14px",
                  },
                }}
              />
            </HBox>

            <HBox sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}>
              <HButton
                label={intl.formatMessage({id: "label.product.role.edit",defaultMessage: "Cancel"})}
                onClick={handleClose}
                variant="outlined"
              />
                
              <HButton
                label={effectiveRoleId ? intl.formatMessage({id: "label.product.role.update",defaultMessage: "Update Role"}) : intl.formatMessage({id: "label.product.role.create",defaultMessage: "Create Role"})}
                variant="contained"
                onClick={handleSubmit}
              />
                
            </HBox>
          </HBox>
        </HBox>
      </HPaper>
    </Container>
  );
}

export default CreateRole;