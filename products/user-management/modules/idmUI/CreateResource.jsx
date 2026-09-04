import { useEffect, useState } from 'react';
import { IconButton, FormControl, Select, MenuItem, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, useMediaQuery, useTheme, Container} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';
import { UserManagementAPI } from './apiEndpoints';
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";
import { HAxiosService, HBox, HButton, HLabel, HPaper, HTextField, HCheckBox, useToast, HDialog } from "@helix/component-library";
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

const selectSx = {
  borderRadius: "8px",
  fontSize: "12px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.primary },
};

// ==================== Shared field wrapper sx (matching FollowupDetails fieldCellSx) ====================
const fieldCellSx = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  width: "100%",
  gap: 0.5,
  background: "transparent"
};

// ==================== Shared HTextField sx ====================
const textFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "13px",
    "&.Mui-focused fieldset": { borderColor: colors.primary },
  },
};

function CreateResource({ open, onClose, onResourceCreated, resourceId: propResourceId }) {
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const params = useParams();
  const urlResourceId = params.resourceId;
  const effectiveResourceId = propResourceId || urlResourceId;

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn("getNavigate called outside Router context");
    navigate = () => { };
  }

  const realm = sessionStorage.getItem('SEC_REALM');
  const product = sessionStorage.getItem("SELECTED_PRODUCT");

  const [formData, setFormData] = useState({
    resourceName: '',
    displayName: '',
    scopeNames: [],
    uris: [''],
  });

  const [scopeNames, setScopeNames] = useState([]);

  const fetchScopeNames = () => {
    HAxiosService.GET(UserManagementAPI.fetch_scopes(realm, product))
      .then((response) => {
        if (response.data) setScopeNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching scope names:", error);
      });
  };

  useEffect(() => {
    // Refetch scopes whenever dialog opens so newly created/deleted scopes appear
    if (realm && product && (open === undefined || open)) {
      fetchScopeNames();
    }
  }, [realm, product, open]);

  useEffect(() => {
    if (effectiveResourceId && (open || !open)) {
      HAxiosService.GET(UserManagementAPI.get_resource_data(realm, product, effectiveResourceId))
        .then((response) => {
          if (isHttpSuccess(response)) {
            const scopeNames = response.data.scopes ? response.data.scopes.map(scope => scope.name) : [];
            setFormData((prevData) => ({
              ...prevData,
              resourceName: response.data.name || prevData.resourceName,
              displayName: response.data.displayName || prevData.displayName,
              scopeNames: scopeNames || prevData.scopeNames,
              uris: response.data.uris && response.data.uris.length > 0 ? response.data.uris : [''],
            }));
          } else {
            toast.error(intl.formatMessage({id: "error.product.resource.failFetch",defaultMessage: "Failed to fetch resource data"}));
          }
        })
        .catch((error) => {
          console.error('Error fetching resource data:', error);
          toast.error(intl.formatMessage({id: "error.product.resource.errorFetch",defaultMessage: "An error occurred while fetching the resource data"}));
        });
    }
  }, [effectiveResourceId, open, realm, product, toast]);

  useEffect(() => {
    if (!open && !effectiveResourceId) {
      setFormData({ resourceName: '', displayName: '', scopeNames: [], uris: [''] });
    }
  }, [open, effectiveResourceId]);

  const handleSubmit = () => {
    const { resourceName, displayName, scopeNames, uris } = formData;
    if (!resourceName || !displayName || scopeNames.length === 0 || uris.some(uri => uri.trim() === '')) {
      toast.error(intl.formatMessage({id: "error.product.resource.required",defaultMessage: "All fields are required"}), { position: "top-right", autoClose: 700 });
      return;
    }
    const updatedFormData = { ...formData, product, realm, uris: uris.filter(uri => uri.trim() !== '') };
    const method = effectiveResourceId ? 'put' : 'post';
    HAxiosService[method.toUpperCase()](UserManagementAPI.resource(), updatedFormData)
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, effectiveResourceId ? intl.formatMessage({id: "success.product.resource.updated",defaultMessage: "Resource updated successfully!"}) : intl.formatMessage({id: "success.product.resource.created",defaultMessage: "Resource created successfully!"})), { position: 'top-right', autoClose: 1000 });
          if (open) {
            onClose();
            if (onResourceCreated) onResourceCreated();
          } else {
            setTimeout(() => navigate(`/homelayout/client/${product}/#resources`), 1500);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.resource.failSave",defaultMessage: "Failed to save resource"})));
        }
      })
      .catch((error) => {
        console.error('Error submitting the form:', error);
        toast.error(intl.formatMessage({id: "error.product.resource.errorSave",defaultMessage: "An error occured while saving the resource"}));
      });
  };

  const handleDelete = () => {
    if (!effectiveResourceId) return;
    HAxiosService.DELETE(UserManagementAPI.delete_resource(effectiveResourceId, realm, product), { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (isApiSuccess(response)) {
          toast.success(getApiMsg(response, intl.formatMessage({id: "success.product.resource.deleted",defaultMessage: "Resource deleted successfully!"})), { position: 'top-right', autoClose: 1000 });
          if (open) {
            onClose();
            if (onResourceCreated) onResourceCreated();
          } else {
            setTimeout(() => navigate(`/homelayout/client/${product}/#resources`), 2000);
          }
        } else {
          toast.error(getApiMsg(response, intl.formatMessage({id: "error.product.resource.delete",defaultMessage: "Failed to delete resource"})));
        }
      })
      .catch((error) => {
        console.error('Error deleting the resource:', error);
        toast.error(intl.formatMessage({id: "error.product.resource.failDelete",defaultMessage: "An error occurred while deleting the resource"}));
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'scopeNames') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name.startsWith('uris-')) {
      const index = parseInt(name.split('-')[1]);
      const updatedUris = [...formData.uris];
      updatedUris[index] = value;
      setFormData((prev) => ({ ...prev, uris: updatedUris }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      navigate(`/homelayout/client/${product}/#resources`);
    }
  };

  // ── Shared scope chip renderValue ──
  const scopeRenderValue = (selected) => (
    <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {selected.map((value) => (
        <Chip
          key={value}
          label={value}
          size="small"
          onDelete={() => setFormData(prev => ({ ...prev, scopeNames: prev.scopeNames.filter(item => item !== value) }))}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            background: `${colors.primaryLight}20`,
            border: `1px solid ${colors.primaryLight}`,
            fontSize: "11px",
            height: "24px",
          }}
        />
      ))}
    </HBox>
  );

  // ── Shared scope menu items ──
  const scopeMenuItems = scopeNames.length > 0
    ? scopeNames.map((scope) => (
        <MenuItem key={scope.id} value={scope.name}>
          <HCheckBox
            checked={formData.scopeNames.includes(scope.name)}
            size="small"
            sx={{ color: colors.primary, '&.Mui-checked': { color: colors.primary } }}
          />
          <HLabel
            value={scope.name}
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
    : [<MenuItem key="no-scopes" disabled>{intl.formatMessage({id: "label.product.resource.noScope",defaultMessage: "No scopes available"})}</MenuItem>];

  // ── Shared form body used in both dialog and standalone ──
  const formBody = (
    <HBox sx={{ display: "flex", flexDirection: "column", gap: 2.5, background: "transparent" }}>

      {/* Resource Name */}
      <HBox sx={fieldCellSx}>
        <HLabel
          value={intl.formatMessage({id: "label.product.resource.name",defaultMessage: "Resource Name"})}
          required
          colon={false}
          translate={false}
          align="left"
          width="100%"
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }}
        />
        <HTextField
          name="resourceName"
          value={formData.resourceName}
          onChange={handleChange}
          editable
          width="100%"
          placeholder={intl.formatMessage({id: "label.product.placeholder.resourceName",defaultMessage: "Enter Resource name"})}
          sx={textFieldSx}
        />
      </HBox>

      {/* Display Name */}
      <HBox sx={fieldCellSx}>
        <HLabel
          value={intl.formatMessage({id: "label.product.resource.displayName",defaultMessage: "Display Name"})}
          required
          colon={false}
          translate={false}
          align="left"
          width="100%"
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }}
        />
        <HTextField
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          editable
          width="100%"
          placeholder="Enter display name"
          sx={textFieldSx}
        />
      </HBox>

      {/* Authorization Scope — kept as MUI Select (multi-select with checkbox + chip renderValue, no HDropdown equivalent) */}
      <HBox sx={fieldCellSx}>
        <HLabel
          value={intl.formatMessage({id: "label.product.resource.authScope",defaultMessage: "Authorization Scope"})}
          required
          colon={false}
          translate={false}
          align="left"
          width="100%"
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: theme.palette.text.primary }}
        />
        <FormControl fullWidth size="small">
          <Select
            name="scopeNames"
            value={formData.scopeNames}
            onChange={handleChange}
            multiple
            renderValue={scopeRenderValue}
            sx={selectSx}
          >
            {scopeMenuItems}
          </Select>
        </FormControl>
      </HBox>

      {/* URIs */}
      <HBox sx={fieldCellSx}>
        <HLabel
          value={intl.formatMessage({id: "label.product.resource.uri",defaultMessage: "URIs"})}
          required
          colon={false}
          translate={false}
          align="left"
          width="100%"
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: theme.palette.text.secondary }}
        />
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, background: "transparent" }}>
          {formData.uris.map((uri, index) => (
            <HBox key={index} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <HTextField
                name={`uris-${index}`}
                value={uri}
                onChange={handleChange}
                editable
                width="100%"
                placeholder="Enter URI"
                sx={textFieldSx}
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
            label={intl.formatMessage({id: "label.product.resource.addUri",defaultMessage: "Add URI"})}
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
    </HBox>
  );

  // ================== DIALOG MODE ==================
  if (open !== undefined) {
    return (
      <HDialog disableContentWrapper open={open} onClose={handleClose} maxWidth="md" fullWidth slotProps={{ paper: {
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
            overflow: "hidden",
            maxHeight: "90vh",
            borderColor: theme.palette.text.secondary
          }
        } }}>
        {/* Dialog Header */}
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
          <HLabel
            value={effectiveResourceId ? intl.formatMessage({id: "label.product.resource.edit",defaultMessage: "Edit Resource"}) : intl.formatMessage({id: "label.product.resource.create",defaultMessage: "Create Resource"})}
            colon={false}
            translate={false}
            align="left"
            component="span"
            sx={{ fontWeight: 700, fontSize: "16px", fontFamily: "'Inter', sans-serif" }}
          />
          {effectiveResourceId && (
            <HButton
              label={intl.formatMessage({id: "label.product.resource.delete",defaultMessage: "Delete"})}
              variant="contained"
              onClick={handleDelete}
              sx={{ ...dangerBtnSx, py: 0.5, px: 1.5, fontSize: "11px" }}
            />
          )}
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflowY: "auto" }}>
          {formBody}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, gap: 1 }}>
          <HButton
            label={intl.formatMessage({id: "label.product.resource.cancel",defaultMessage: "Cancel"})}
            variant="outlined"
            onClick={handleClose}
          />
          <HButton
            label={effectiveResourceId ? intl.formatMessage({id: "label.product.resource.update",defaultMessage: "Update Resource"}) : intl.formatMessage({id: "label.product.resource.create",defaultMessage: "Create Resource"})}
            variant="contained"
            onClick={handleSubmit}
            sx={primaryBtnSx}
          />
        </DialogActions>
      </HDialog>
    );
  }

  // ================== STANDALONE PAGE MODE ==================
  return (
    <HBox sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      p: { xs: 1, sm: 2, md: 3 },
      boxSizing: "border-box",
    }}>
      <Container maxWidth="lg">
        <HPaper elevation={0} sx={{
          borderRadius: { xs: "10px", sm: "14px" },
          boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
          overflow: "hidden",
        }}>

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
              right: 40,
              bottom: -35,
              width: 110,
              height: 110,
              borderRadius: "50%",
              pointerEvents: "none",
            }} />

            <IconButton
              onClick={handleClose}
              sx={{ p: 0.5 }}
            >
              <ArrowBackIcon />
            </IconButton>

            <HLabel
              value={effectiveResourceId ? intl.formatMessage({id: "label.product.resource.edit",defaultMessage: "Edit Resource"}) : intl.formatMessage({id: "label.product.resource.create",defaultMessage: "Create Resource"})}
              colon={false}
              translate={false}
              align="left"
              component="div"
              sx={{
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: 14, sm: 18 },
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                flex: 1,
              }}
            />

            {effectiveResourceId && (
              <HButton
                label={intl.formatMessage({id: "label.product.resource.delete",defaultMessage: "Delete Resource"})}
                variant="contained"
                onClick={handleDelete}
                sx={dangerBtnSx}
              />
            )}
          </HBox>

          {/* Form Content */}
          <HBox sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {formBody}

            {/* Action Buttons */}
            <HBox sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
              <HButton
                label={intl.formatMessage({id: "label.product.resource.cancel",defaultMessage: "Cancel"})}
                variant="outlined"
                onClick={handleClose}
                sx={{
                  fontSize: "13px",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              />
              <HButton
                label={effectiveResourceId ? intl.formatMessage({id: "label.product.resource.update",defaultMessage: "Update Resource"}) : intl.formatMessage({id: "label.product.resource.create",defaultMessage: "Create Resource"})}
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

export default CreateResource;