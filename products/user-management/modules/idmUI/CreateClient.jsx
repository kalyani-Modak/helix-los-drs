import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery,
  useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconDropdown from './IconDropdown';
import { ClientDetailsAPI } from "./apiEndpoints";
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HLabel, HPaper, HTextField, HTextarea, HButton, useToast, HDialog } from "@helix/component-library";
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
  transition: "all 0.2s ease",
};

const paperSx = {
  borderRadius: { xs: "10px", sm: "14px" },
  boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
  overflow: "hidden",
};

function CreateClient({ open, onClose, onClientCreated, clientId: propClientId }) {
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get clientId from props (for dialog) or from URL params (for standalone page)
  const params = useParams();
  const urlClientId = params.clientId1;
  const effectiveClientId = propClientId || urlClientId;

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => { }; // no-op fallback
  }

  const [formData, setFormData] = useState({
    clientId: '',
    name: '',
    description: '',
    uris: [''],
    iconName: ''
  });

  const realm = sessionStorage.getItem('SEC_REALM');

  // Fetch client data if editing
  useEffect(() => {
    if (effectiveClientId && (open || !open)) {
      HAxiosService.GET(ClientDetailsAPI.GET_CLIENT_BY_ID(realm, effectiveClientId))
        .then((response) => {
          if (isHttpSuccess(response)) {
            const clientData = response.data;
            setFormData({
              clientId: clientData.clientId || '',
              name: clientData.name || '',
              description: clientData.description || '',
              uris: clientData.redirectUris?.length ? clientData.redirectUris : [''],
              iconName: clientData.iconName || '',
            });
          } else {
            toast.error(intl.formatMessage({id: "error.product.client.failFetch", defaultMessage:"Failed to fetch client data"}));
          }
        })
        .catch((error) => {
          console.error('Error fetching client data:', error);
          toast.error(intl.formatMessage({id: "error.product.client.errorFetch", defaultMessage:"An error occurred while fetching client data"}));
        });
    }
  }, [effectiveClientId, open, realm, toast]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open && !effectiveClientId) {
      setFormData({ clientId: '', name: '', description: '', uris: [''], iconName: '' });
    }
  }, [open, effectiveClientId]);

  const handleDelete = () => {
    if (!effectiveClientId) return;

    HAxiosService
      .DELETE(ClientDetailsAPI.DELETE_CLIENT(effectiveClientId, realm))
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({id: "success.product.client.deleted", defaultMessage:"Client Deleted successfully!"})), { position: 'top-right', autoClose: 1000 });

          if (open) {
            onClose();
            if (onClientCreated) onClientCreated({ action: "deleted" });
          } else {
            setTimeout(() => { navigate("/homelayout/clients"); }, 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.client.failDelete", defaultMessage:"Failed to delete client"})));
        }
      })
      .catch((error) => {
        console.error('Error deleting the client:', error);
        toast.error(intl.formatMessage({id: "error.product.client.errorDelete", defaultMessage:"An error occurred while deleting the client"}));
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeTextArea  = (name, e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUriChange = (index, value) => {
    const updatedUris = [...formData.uris];
    updatedUris[index] = value;
    setFormData((prev) => ({ ...prev, uris: updatedUris }));
  };

  const handleSubmit = () => {
    const { clientId, name, description, uris, iconName } = formData;

    if (!clientId || !name || !description || uris.some(uri => !uri.trim())) {
      toast.error(intl.formatMessage({id: "error.product.client.required", defaultMessage:"All fields are required"}), { position: "top-right", autoClose: 700 });
      return;
    }

    const payload = { clientId, realm, name, description, redirectUris: uris.join(", "), iconName };
    const method = effectiveClientId ? 'put' : 'post';

    HAxiosService[method.toUpperCase()](ClientDetailsAPI.CREATE_OR_UPDATE_CLIENT(), payload)
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, effectiveClientId ? intl.formatMessage({id: "success.product.client.updated", defaultMessage:"Client Updated successfully!"}) : intl.formatMessage({id: "success.product.client.created", defaultMessage:"Client Created successfully!"})), {
            position: 'top-right', autoClose: 1000,
          });

          if (open) {
            onClose();
            if (onClientCreated) {
              onClientCreated({ action: effectiveClientId ? "updated" : "created" });
            }
          } else {
            setTimeout(() => { navigate("/homelayout/clients"); }, 1500);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.client.failSave", defaultMessage:"Failed to save client"})));
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id: "error.product.client.errorSave", defaultMessage:"An error occurred while saving the client"}));
      });
  };

  const addUri = () => {
    setFormData((prev) => ({ ...prev, uris: [...prev.uris, ''] }));
  };

  const removeUri = (index) => {
    const updatedUris = formData.uris.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, uris: updatedUris.length ? updatedUris : [''] }));
  };

  const handleClose = () => {
    if (open) {
      onClose();
    } else {
      navigate("/homelayout/clients");
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

        {/* Client ID */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.client.id", defaultMessage:"Client ID"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="clientId"
            value={formData.clientId}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.product.placeholder.clientId", defaultMessage: "Enter Client Id"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.client.name", defaultMessage:"Client Name"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextField
            name="name"
            value={formData.name}
            onChange={handleChange}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.product.placeholder.clientName", defaultMessage: "Enter Name"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* Description */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.client.desc", defaultMessage:"Description"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HTextarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChangeTextArea("description", e)}
            editable
            width="100%"
            multiline
            rows={isDialog ? 2 : 3}
            placeholder={intl.formatMessage({id: "label.product.placeholder.clientDesc", defaultMessage: "Enter Description"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: fieldFontSize,
              },
            }}
          />
        </HBox>

        {/* URIs */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.client.uris", defaultMessage:"URIs"})}
            required
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, background: "transparent" }}>
            {formData.uris.map((uri, index) => (
              <HBox key={index} sx={{ display: "flex", gap: 1, alignItems: "center", background: "transparent" }}>
                <HTextField
                  value={uri}
                  onChange={(e) => handleUriChange(index, e.target.value)}
                  editable
                  fullWidth
                  placeholder={intl.formatMessage({id: "label.product.placeholder.clientUri", defaultMessage: "Enter URI"})}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: fieldFontSize,
                    },
                  }}
                />
                {formData.uris.length > 1 && (
                  <IconButton
                    onClick={() => removeUri(index)}
                    size="small"
                    sx={{ color: colors.danger, '&:hover': { backgroundColor: `${colors.danger}10` } }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </HBox>
            ))}
            <HButton
              label={intl.formatMessage({id: "label.product.client.addUri", defaultMessage:"Add URI"})}
              onClick={addUri}
              startIcon={<AddIcon />}
              sx={{
                fontSize: "12px",
                textTransform: "none",
                fontWeight: 500,
                alignSelf: "flex-start",
                mt: 1,
              }}
            />
          </HBox>
        </HBox>

        {/* Icon Name */}
        <HBox sx={fieldCellSx}>
          <HLabel
            value={intl.formatMessage({id: "label.product.client.iconName", defaultMessage:"Icon Name"})}
            colon={false}
            translate={false}
            align="left"
            width="100%"
            sx={{ fontSize: labelFontSize, fontWeight: 600, color: theme.palette.text.primary }}
          />
          <IconDropdown
            value={formData.iconName}
            onChange={(value) => setFormData({ ...formData, iconName: value })}
          />
        </HBox>
      </HBox>
    );
  };

  // ==================== Dialog Mode ====================
  if (open !== undefined) {
    return (
      <HDialog disableContentWrapper open={open} onClose={handleClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { ...paperSx, borderRadius: "12px", maxHeight: "90vh" } } }}>
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
          <span>{effectiveClientId ? intl.formatMessage({id: "label.product.client.edit", defaultMessage:"Edit Product"}) : intl.formatMessage({id: "label.product.client.create", defaultMessage:"Create Product"})}</span>
          {effectiveClientId && (
            <HButton 
            label={intl.formatMessage({id: "label.product.client.delete", defaultMessage:"Delete"})}
            onClick={handleDelete} 
            sx={{ ...dangerBtnSx, py: 0.5, px: 1.5, fontSize: "11px" }}
            />
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowY: "auto" }}>
          {formFields(true)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <HButton
            label={intl.formatMessage({id: "label.product.client.cancel", defaultMessage:"Cancel"})}
            onClick={handleClose}
            variant="outlined"
            sx={{
              fontSize: "12px",
              textTransform: "none",
              fontWeight: 500,
            }}
          /> 
          <HButton 
            label={effectiveClientId ? intl.formatMessage({id: "label.product.client.update", defaultMessage:"Update Product"}) : intl.formatMessage({id: "label.product.client.create", defaultMessage:"Create Product"})} 
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
            value={effectiveClientId ? intl.formatMessage({id: "label.product.client.edit", defaultMessage:"Edit Product"}) : intl.formatMessage({id: "label.product.client.create", defaultMessage:"Create Product"})}
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

          {effectiveClientId && (
            <HButton 
            label={intl.formatMessage({id: "label.product.client.delete", defaultMessage:"Delete"})}
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
              label={intl.formatMessage({id: "label.product.client.cancel", defaultMessage:"Cancel"})}
              variant="outlined"
              onClick={handleClose}
              sx={{
                fontSize: "13px",
                textTransform: "none",
                fontWeight: 500,
              }}
            />
              
            <HButton 
            label={effectiveClientId ? intl.formatMessage({id: "label.product.client.update", defaultMessage:"Update Product"}) : intl.formatMessage({id: "label.product.client.create", defaultMessage:"Create Product"})}
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

export default CreateClient;