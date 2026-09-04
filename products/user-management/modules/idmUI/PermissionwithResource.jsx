// Updated PermissionwithResource.jsx
import { useEffect, useState } from 'react';
import {
  IconButton,
  MenuItem,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HTextField, HTextarea, HCheckBox, HButton, useToast, HDialog } from "@helix/component-library";
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
  boxShadow: "0 4px 10px rgba(3,120,166,0.25)",
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
};

const selectSx = {
  borderRadius: "8px",
  fontSize: "12px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
};

const paperSx = {
  borderRadius: { xs: "10px", sm: "14px" },
  boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
  overflow: "hidden",
};

function PermissionwithResource({ open, onClose, onPermissionCreated, permissionId: propPermissionId }) {
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get permissionId from props (for dialog) or from URL params (for standalone page)
  const params = useParams();
  const urlPermissionId = params.permissionResourceId;
  const effectivePermissionId = propPermissionId || urlPermissionId;
  
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => { }; // no-op fallback
  }

  const [formData, setFormData] = useState({
    permissionName: '',
    permissionDescription: '',
    resourceName: [],
    policyNames: [],
  });

  const product = sessionStorage.getItem("SELECTED_PRODUCT");
  const realm = sessionStorage.getItem('SEC_REALM');
  
  const [resourceNames, setResourceNames] = useState([]);
  const [policyNames, setPolicyNames] = useState([]);

  // Fetch policy names — refetch when dialog opens so create/delete stay in sync
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

    if (realm && product && (open === undefined || open)) {
      fetchPolicyNames();
    }
  }, [realm, product, open]);

  // Fetch resource names — refetch when dialog opens so create/delete stay in sync
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

    if (realm && product && (open === undefined || open)) {
      fetchResourceNames();
    }
  }, [realm, product, open]);

  // Fetch permission data if editing
  useEffect(() => {
    if (effectivePermissionId && (open || !open)) {
      HAxiosService
        .GET(UserManagementAPI.permission_data(realm, product, effectivePermissionId))
        .then((response) => {
          const data = response.data;
          setFormData({
            permissionName: data.permissionName || "",
            permissionDescription: data.description || "",
            resourceName: data.resourceNames || [],
            policyNames: data.policyNames || [],
          });
        })
        .catch((error) => {
          console.error('Error fetching permission data:', error);
          toast.error(intl.formatMessage({ id: 'error.product.permission.failFetch', defaultMessage: 'Failed to fetch permission data' }));
        });
    }
  }, [effectivePermissionId, open, realm, product, toast, intl]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open && !effectivePermissionId) {
      setFormData({
        permissionName: '',
        permissionDescription: '',
        resourceName: [],
        policyNames: [],
      });
    }
  }, [open, effectivePermissionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeTextArea = (name, e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const {
      permissionName,
      permissionDescription,
      resourceName,
      policyNames,
    } = formData;

    if (!permissionName || !permissionDescription || !resourceName.length || !policyNames.length) {
      toast.error(intl.formatMessage({ id: 'error.product.permission.required', defaultMessage: 'All fields are required' }), {
        position: "top-right",
        autoClose: 700,
      });
      return;
    }

    const updatedFormData = {
      ...formData,
      product,
      realm,
    };

    try {
      const method = effectivePermissionId ? 'PUT' : 'POST';
      const response = await HAxiosService[method](
        UserManagementAPI.permission_resource(),
        updatedFormData
      );

      if (isApiSuccess(response)) {
        toast.success(getApiMsg(response, effectivePermissionId ? intl.formatMessage({ id: 'success.product.permission.updated', defaultMessage: 'Permission updated successfully!' }) : intl.formatMessage({ id: 'success.product.permission.created', defaultMessage: 'Permission created successfully!' })), {
          position: 'top-right',
          autoClose: 1000,
        });

        if (open) {
          await onPermissionCreated?.();
          onClose();
        } else {
          setTimeout(() => {
            navigate(`/homelayout/client/${product}/#permissions`);
          }, 1500);
        }
      } else {
        toast.error(getApiMsg(response, intl.formatMessage({ id: 'error.product.permission.failSave', defaultMessage: 'Failed to save permission' })));
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      toast.error(intl.formatMessage({ id: 'error.product.permission.errorSave', defaultMessage: 'An error occurred while saving the permission' }));
    }
  };

  const handleDelete = () => {
    if (!effectivePermissionId) return;

    HAxiosService
      .DELETE(UserManagementAPI.delete_permission(effectivePermissionId, realm, product), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({ id: 'success.product.permission.deleted', defaultMessage: 'Permission deleted successfully!' })), {
            position: 'top-right',
            autoClose: 1000,
          });
          
          if (open) {
            onClose();
            if (onPermissionCreated) onPermissionCreated();
          } else {
            setTimeout(() => {
              navigate(`/homelayout/client/${product}/#permissions`);
            }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({ id: 'error.product.permission.failDelete', defaultMessage: 'Failed to delete permission' })));
        }
      })
      .catch((error) => {
        console.error('Error deleting the permission:', error);
        toast.error(intl.formatMessage({ id: 'error.product.permission.errorDelete', defaultMessage: 'An error occurred while deleting the permission' }));
      });
  };

  const handleClose = () => {
    if (open) {
      onClose();
    } else {
      navigate(`/homelayout/client/${product}/#permissions`);
    }
  };

  const fieldCellSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    gap: 0.5,
    background: "transparent"
  };

  const formFields = (isDialog = false) => {
    const labelFontSize = isDialog ? "12px" : "13px";
    const fieldFontSize = isDialog ? "13px" : "14px";

    return (
      <HBox sx={{ display: "flex", flexDirection: "column", gap: isDialog ? 2.5 : 3, background: "transparent" }}>
        {/* Permission Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({ id: "label.product.permission.name", defaultMessage: "Permission Name" })}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="permissionName"
            value={formData.permissionName}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({ id: "label.product.placeholder.permissionName", defaultMessage: "Enter permission name" })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Permission Description */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({ id: "label.product.permission.desc", defaultMessage: "Description" })}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextarea
            name="permissionDescription"
            value={formData.permissionDescription}
            onChange={(e) => handleChangeTextArea("permissionDescription", e)}
            width="100%"
            maxLines={isDialog ? 2 : 3}
            placeholder={intl.formatMessage({ id: "label.product.placeholder.permissionDesc", defaultMessage: "Enter permission description" })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Resource Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({ id: "label.product.permission.resource", defaultMessage: "Resource" })}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <Select
            name="resourceName"
            value={formData.resourceName}
            onChange={handleChange}
            multiple
            size="small"
            fullWidth
            renderValue={(selected) => (
              <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, background: "transparent" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    onDelete={() => {
                      setFormData(prev => ({
                        ...prev,
                        resourceName: prev.resourceName.filter(item => item !== value)
                      }));
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      fontSize: "11px",
                      height: "24px",
                    }}
                  />
                ))}
              </HBox>
            )}
            sx={selectSx}
          >
            {resourceNames.length > 0 ? (
              resourceNames.map((resource) => (
                <MenuItem key={resource} value={resource}>
                  <HCheckBox
                    checked={formData.resourceName.includes(resource)}
                    size="small"
                  />
                  <HLabel
                    value={resource}
                    colon={false}
                    translate={false}
                    align="left"
                    width="100%"
                    sx={{
                      ml: 2,
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{intl.formatMessage({ id: "label.product.permission.noResource", defaultMessage: "No resources available" })}</MenuItem>
            )}
          </Select>
        </HBox>

        {/* Policy Names */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({ id: "label.product.permission.policies", defaultMessage: "Policies" })}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <Select
            name="policyNames"
            value={formData.policyNames || []}
            onChange={handleChange}
            multiple
            size="small"
            fullWidth
            renderValue={(selected) => (
              <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, background: "transparent" }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    onDelete={() => {
                      setFormData(prev => ({
                        ...prev,
                        policyNames: prev.policyNames.filter(item => item !== value)
                      }));
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      fontSize: "11px",
                      height: "24px",
                    }}
                  />
                ))}
              </HBox>
            )}
            sx={selectSx}
          >
            {policyNames.length > 0 ? (
              policyNames.map((policy) => (
                <MenuItem key={policy} value={policy}>
                  <HCheckBox
                    checked={formData.policyNames?.includes(policy)}
                    size="small"
                  />
                  <HLabel
                    value={policy}
                    colon={false}
                    translate={false}
                    align="left"
                    width="100%"
                    sx={{
                      ml: 2,
                      fontSize: "13px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{intl.formatMessage({ id: "label.product.permission.noPolicy", defaultMessage: "No policies available" })}</MenuItem>
            )}
          </Select>
        </HBox>
      </HBox>
    );
  };

  // If used as a dialog
  if (open !== undefined) {
    return (
      <HDialog disableContentWrapper open={open} onClose={handleClose} maxWidth="md" fullWidth slotProps={{ paper: {
          sx: {
            ...paperSx,
            borderRadius: "12px",
            maxHeight: "90vh",
          }
        } }}>
        <DialogTitle sx={{
          background: "var(--drs-grid-header-bg, hsla(215, 20%, 95%, 0.92))",
          color: theme.palette.text.primary,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span>{effectivePermissionId ? intl.formatMessage({ id: 'label.product.permission.edit', defaultMessage: 'Edit Permission' }) : intl.formatMessage({ id: 'label.product.permission.create', defaultMessage: 'Create Permission' })}</span>
          {effectivePermissionId && (
            <HButton
              label={intl.formatMessage({ id: 'label.product.permission.delete', defaultMessage: 'Delete' })}
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

        <DialogContent sx={{ p: 3, overflowY: "auto" }}>
          {formFields(true)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <HButton
            label={intl.formatMessage({ id: 'label.product.permission.cancel', defaultMessage: 'Cancel' })}
            variant="outlined"
            onClick={handleClose}
            sx={{
              fontSize: "12px",
              textTransform: "none",
              fontWeight: 500,
            }}
          />
          <HButton
            label={effectivePermissionId ? intl.formatMessage({ id: 'label.product.permission.update', defaultMessage: 'Update Permission' }) : intl.formatMessage({ id: 'label.product.permission.create', defaultMessage: 'Create Permission' })}
            variant="contained"
            onClick={handleSubmit}
            sx={primaryBtnSx}
          />
        </DialogActions>
      </HDialog>
    );
  }

  // Standalone page version
  return (
    <HBox sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      p: { xs: 1, sm: 2, md: 3 },
      background: "transparent",
      boxSizing: "border-box",
    }}>
      <Container maxWidth="lg">
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
                color: theme.palette.text.primary,
                p: 0.5,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <HLabel
              value={effectivePermissionId ? intl.formatMessage({ id: 'label.product.permission.edit', defaultMessage: 'Edit Permission' }) : intl.formatMessage({ id: 'label.product.permission.create', defaultMessage: 'Create Permission' })}
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

            {effectivePermissionId && (
              <HButton
                label={intl.formatMessage({ id: 'label.product.permission.delete', defaultMessage: 'Delete' })}
                variant="outlined"
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
                label={intl.formatMessage({ id: 'label.product.permission.cancel', defaultMessage: 'Cancel' })}
                variant="outlined"
                onClick={handleClose}
                sx={{
                  fontSize: "13px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              />
              <HButton
                label={effectivePermissionId ? intl.formatMessage({ id: 'label.product.permission.update', defaultMessage: 'Update Permission' }) : intl.formatMessage({ id: 'label.product.permission.create', defaultMessage: 'Create Permission' })}
                variant="contained"
                onClick={handleSubmit}
                sx={primaryBtnSx}
              />
            </HBox>
          </HBox>
        </HPaper>
      </Container>
    </HBox>
  );
}

export default PermissionwithResource;