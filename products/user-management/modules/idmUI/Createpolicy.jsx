// Updated CreatePolicy.jsx
import { useEffect, useState } from 'react';
import { IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, useMediaQuery, useTheme, MenuItem, Select } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import { KeyCloakAPI, PolicyAPI } from './apiEndpoints';
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HDropdown, HTextField, HTextarea, HCheckBox, HButton, useToast, HDialog } from "@helix/component-library";
import { useIntl } from 'react-intl';

// ==================== Color Palette ====================
const colors = {
  primary: "#0378A6",
  secondary: "#2FBF71",
  primaryLight: "#79cff1",
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

function CreatePolicy({ open, onClose, onPolicyCreated, policyId: propPolicyId }) {
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get policyId from props (for dialog) or from URL params (for standalone page)
  const params = useParams();
  const urlPolicyId = params.policyId;
  const effectivePolicyId = propPolicyId || urlPolicyId;

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => { }; // no-op fallback
  }

  const [formData, setFormData] = useState({
    policyName: '',
    policyDescription: '',
    policyType: 'role',
    policyLogic: 'POSITIVE',
    roleNames: [],
  });

  const [roleNames, setRoleNames] = useState([]);
  const realm = sessionStorage.getItem('SEC_REALM');
  const product = sessionStorage.getItem("SELECTED_PRODUCT");

  // Fetch roles for selection — refetch when dialog opens so create/delete stay in sync
  useEffect(() => {
    const fetchRoles = () => {
      HAxiosService.GET(KeyCloakAPI.GET_ROLES(realm, product))
        .then((response) => {
          const { data } = response;
          if (data) {
            const productKey = Object.keys(data)[0];
            if (data[productKey]) {
              setRoleNames(data[productKey]);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
        });
    };

    if (realm && product && (open === undefined || open)) {
      fetchRoles();
    }
  }, [realm, product, open]);

  // Fetch policy data if editing
  useEffect(() => {
    if (effectivePolicyId && (open || !open)) {
      HAxiosService
        .GET(PolicyAPI.GET_POLICY_BY_ID(realm, product, effectivePolicyId))
        .then((response) => {
          if (isHttpSuccess(response)) {
            const data = response.data;

            const rolesConfig = data.config?.roles
              ? JSON.parse(data.config.roles)
              : [];
            const roleNames = rolesConfig.map((role) => role.name);

            setFormData((prevData) => ({
              ...prevData,
              policyName: data.name || prevData.policyName,
              policyDescription: data.description || prevData.policyDescription,
              policyType: data.type || prevData.policyType,
              policyLogic: data.logic || prevData.policyLogic,
              roleNames: roleNames || prevData.roleNames,
            }));
          } else {
            toast.error(intl.formatMessage({id: "error.product.policy.failFetch", defaultMessage:"Failed to fetch policy data"}));
          }
        })
        .catch((error) => {
          console.error("Error fetching policy data:", error);
          toast.error(intl.formatMessage({id: "error.product.policy.errorFetch", defaultMessage:"An error occurred while fetching policy data"}));
        });
    }
  }, [effectivePolicyId, open, realm, product, toast]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open && !effectivePolicyId) {
      setFormData({
        policyName: '',
        policyDescription: '',
        policyType: 'role',
        policyLogic: 'POSITIVE',
        roleNames: [],
      });
    }
  }, [open, effectivePolicyId]);

  const handleChange = (e) => {
    const {name, value } = e.target;
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
    const { policyName, policyDescription, policyType, policyLogic, roleNames } = formData;

    if (!policyName || !policyDescription || !policyType || !policyLogic || roleNames.length === 0) {
      toast.error(intl.formatMessage({id: "error.product.policy.required", defaultMessage:"All fields are required"}), {
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

    const method = effectivePolicyId ? 'put' : 'post';
    HAxiosService[method.toUpperCase()](KeyCloakAPI.SAVE_POLICY(), updatedFormData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, effectivePolicyId ? intl.formatMessage({id: "success.product.policy.updated", defaultMessage:"Policy Updated successfully!"}) : intl.formatMessage({id: "success.product.policy.created", defaultMessage:"Policy created successfully!"})), {
            position: 'top-right',
            autoClose: 1000,
          });

          if (open) {
            onClose();
            if (onPolicyCreated) onPolicyCreated();
          } else {
            setTimeout(() => {
              navigate(`/homelayout/client/${product}/#policy`);
            }, 1500);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.policy.failSave", defaultMessage:"Failed to save policy"})));
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id: "error.product.policy.errorSave", defaultMessage:"An error occurred while saving the policy"}));
      });
  };

  const handleDelete = () => {
    if (!effectivePolicyId) return;

    HAxiosService
      .DELETE(KeyCloakAPI.DELETE_POLICY(effectivePolicyId, realm, product), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({id: "success.product.policy.deleted", defaultMessage:"Policy Deleted successfully!"})), {
            position: 'top-right',
            autoClose: 1000,
          });

          if (open) {
            onClose();
            if (onPolicyCreated) onPolicyCreated();
          } else {
            setTimeout(() => {
              navigate(`/homelayout/client/${product}/#policy`);
            }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.policy.failDelete", defaultMessage:"Failed to delete policy"})));
        }
      })
      .catch((error) => {
        console.error('Error deleting the policy:', error);
        toast.error(intl.formatMessage({id: "error.product.policy.errorDelete", defaultMessage:"An error occurred while deleting the policy"}));
      });
  };

  const handleClose = () => {
    if (open) {
      onClose();
    } else {
      navigate(`/homelayout/client/${product}/#policy`);
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
  // Rendered identically in both dialog and standalone, only wrapper differs.
  const formFields = (isDialog = false) => {
    const labelFontSize = isDialog ? "12px" : "13px";
    const fieldFontSize = isDialog ? "13px" : "14px";

    return (
      <HBox sx={{ display: "flex", flexDirection: "column", gap: isDialog ? 2.5 : 3, background: "transparent" }}>

        {/* Policy Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.policy.name", defaultMessage:"Policy Name"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="policyName"
            value={formData.policyName}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.product.placeholder.policyName", defaultMessage:"Enter Policy Name"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Policy Description */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.policy.desc", defaultMessage:"Policy Description"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextarea
            name="policyDescription"
            value={formData.policyDescription}
            onChange={(e) => handleChangeTextArea("policyDescription", e)}
            width="100%"
            maxLines={isDialog ? 2 : 3}
            placeholder={intl.formatMessage({id: "label.product.placeholder.policyDesc", defaultMessage:"Enter Policy Description"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Policy Type - Read Only */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.policy.type", defaultMessage:"Policy Type"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            value="role"
            editable={false}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Policy Logic */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.policy.logic", defaultMessage:"Policy Logic"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HDropdown
            name="policyLogic"
            value={formData.policyLogic}
            onChange={handleChange}
            options={[
              { value: "POSITIVE", label: "POSITIVE" },
              { value: "NEGATIVE", label: "NEGATIVE" },
            ]}
            width="100%"
            placeholder={intl.formatMessage({id: "label.product.placeholder.policyLogic", defaultMessage:"Select Policy Logic"})}
            sx={selectSx}
          />
        </HBox>

        {/* Roles - multi-select (keeping MUI Select for multi + checkbox + chip pattern) */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.policy.roles", defaultMessage:"Roles"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <Select
            name="roleNames"
            value={formData.roleNames || []}
            onChange={handleChange}
            multiple
            size="small"
            fullWidth
            renderValue={(selected) => (
              <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    size="small"
                    onDelete={() => {
                      setFormData(prev => ({
                        ...prev,
                        roleNames: prev.roleNames.filter(item => item !== value)
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
            {roleNames.length > 0 ? (
              roleNames.map((role) => (
                <MenuItem key={role.name} value={role.name}>
                  <HCheckBox
                    checked={formData.roleNames?.includes(role.name)}
                    size="small"
                    sx={{
                      color: colors.primary,
                      '&.Mui-checked': { color: colors.primary },
                    }}
                  />
                  <HLabel
                    value={role.name}
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
              <MenuItem disabled>{intl.formatMessage({id: "label.product.policy.notAvailable", defaultMessage:"No Roles available"})}</MenuItem>
            )}
          </Select>
        </HBox>
      </HBox>
    );
  };

  // ==================== Dialog Mode ====================
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
          <span>{effectivePolicyId ? 'Edit Policy' : 'Create Policy'}</span>
          {effectivePolicyId && (
            <HButton
              label={intl.formatMessage({id: "label.product.policy.delete", defaultMessage:"Delete"})}
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
            label={intl.formatMessage({id: "label.product.policy.cancel", defaultMessage:"Cancel"})}
            variant="outlined"
            onClick={handleClose}
            sx={{
              fontSize: "12px",
              textTransform: "none",
              fontWeight: 500,
            }}
          />
          <HButton
            label={effectivePolicyId ? intl.formatMessage({id: "label.product.policy.update", defaultMessage:"Update Policy"}) : intl.formatMessage({id: "label.product.policy.create", defaultMessage:"Create Policy"})}
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
      background: "transparent"
    }}>
      <HPaper
        elevation={0}
        sx={{
          ...paperSx,
          maxWidth: "lg",
          mx: "auto",
          width: "100%",
        }}
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
              color: "#fff",
              p: 0.5,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <HLabel
            value={effectivePolicyId ? intl.formatMessage({id: "label.product.policy.edit", defaultMessage:"Edit Policy"}) : intl.formatMessage({id: "label.product.policy.create", defaultMessage:"Create Policy"})}
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

          {effectivePolicyId && (
            <HButton
              label={intl.formatMessage({id: "label.product.policy.deletePolicy", defaultMessage:"Delete Policy"})}
              variant="outlined"
              onClick={handleDelete}
            />         
          )}
        </HBox>

        {/* Form Content */}
        <HBox sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {formFields(false)}

          {/* Action Buttons */}
          <HBox sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <HButton
              label={intl.formatMessage({id: "label.product.policy.cancel", defaultMessage:"Cancel"})}
              variant="outlined"
              onClick={handleClose}
              sx={{
                fontSize: "13px",
                textTransform: "none",
                fontWeight: 500,
              }}
            /> 
            <HButton
              label={effectivePolicyId ? intl.formatMessage({id: "label.product.policy.update", defaultMessage:"Update Policy"}) : intl.formatMessage({id: "label.product.policy.create", defaultMessage:"Create Policy"})}
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

export default CreatePolicy;