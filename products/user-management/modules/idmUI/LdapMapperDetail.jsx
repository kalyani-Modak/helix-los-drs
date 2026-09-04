import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Link, CircularProgress, Breadcrumbs, Tooltip, Divider, Chip, useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { useIntl } from "react-intl";
import { FiSave, FiMap } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { UserManagementAPI } from "./apiEndpoints";
import { HAxiosService, HBox, HLabel, HPaper, HButton, HDropdown, HTextField, HToggle, useToast } from "@helix/component-library";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  accentDark: '#a30404',
  background: {
    start: '#f8fafc',
    gradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  cardBg: 'rgba(255, 255, 255, 0.98)',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  hover: '#f1f5f9',
};

const fieldSx = {
  '& .MuiInputBase-root': { fontFamily: "'Inter', sans-serif", fontSize: 14, borderRadius: '8px' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.border },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primaryLight },
  '& .MuiInputLabel-root': { fontFamily: "'Inter', sans-serif", fontSize: 13 },
};

// ─── MapperField ──────────────────────────────────────────────────────────────
const MapperField = ({ property, value = "", onChange }) => {
  const intl = useIntl();
  const theme = useTheme();
  const getLabel = (label) => label || property.name;

  const renderTextField = (placeholder) => (
    <HTextField
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      width="100%"
      translate={false}
      editable
    />
  );

  const renderField = () => {
    switch (property.type) {
      case "String":
      case "UserProfileAttributeList":
        return renderTextField(property.helpText || intl.formatMessage({ id: "ldapMapper.field.placeholder.typeKey", defaultMessage: "Type a key" }));
      case "boolean":
        return (
          <HBox sx={{ display: "flex", alignItems: "center", gap: 1.5, background: 'transparent' }}>
            <HToggle
              label={value ? "ldapMapper.field.switch.on" : "ldapMapper.field.switch.off"}
              checked={value === true || value === "true"}
              onChange={(e) => onChange(e.target.checked)}
              size="small"
            />
          </HBox>
        );
      case "List":
        const dropdownOptions = property.options?.map((opt) => ({ value: opt, label: opt })) || [];
        const placeholderText = intl.formatMessage(
          { id: "ldapMapper.field.placeholder.selectOption", defaultMessage: "Select {label}" },
          { label: getLabel(property.label) }
        );
        return (
          <HDropdown
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            options={dropdownOptions}
            width="100%"
            placeholder={placeholderText}
          />
        );
      default:
        return renderTextField(
          property.helpText ||
          intl.formatMessage(
            { id: "ldapMapper.field.placeholder.enterValue", defaultMessage: "Enter {label}" },
            { label: getLabel(property.label) }
          )
        );
    }
  };

  return (
    <HBox sx={{ mb: 3, background: 'transparent' }}>
      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1, background: 'transparent' }}>
        <HLabel
          value={getLabel(property.label)}
          translate={false}
          required={property.required}
          align="left"
          colon={false}
          sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: theme.palette.text.secondary }}
        />
        {property.helpText && (
          <Tooltip title={property.helpText} arrow>
            <InfoIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, cursor: "help" }} />
          </Tooltip>
        )}
      </HBox>
      {renderField()}
    </HBox>
  );
};

MapperField.propTypes = {
  property: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    helpText: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

// ─── LdapMapperDetail ─────────────────────────────────────────────────────────
const LdapMapperDetail = () => {
  const { providerId, mapperTypeId, mapperId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const theme = useTheme();

  const isEditMode = mapperId && mapperId !== "new";
  const isCreateMode = mapperTypeId && mapperTypeId !== "new" && !isEditMode;

  const [mapperName, setMapperName] = useState("");
  const [selectedMapperType, setSelectedMapperType] = useState(mapperTypeId || "");
  const [mapperTypes, setMapperTypes] = useState([]);
  const [loadingMapperTypes, setLoadingMapperTypes] = useState(!isEditMode);
  const [mapperConfig, setMapperConfig] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isCreateMode || isEditMode) fetchMapperTypes();
  }, [providerId, isCreateMode, isEditMode]);

  useEffect(() => {
    if (isEditMode) fetchMapperDetails();
  }, [providerId, mapperId, isEditMode]);

  const fetchMapperTypes = async () => {
    setLoadingMapperTypes(true);
    try {
      const response = await HAxiosService.GET(UserManagementAPI.fetch_ldap_mapper_types(providerId));
      setMapperTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching LDAP mapper types:", error);
      toast.error(intl.formatMessage({ id: "ldapMapper.toast.loadFailed", defaultMessage: "Failed to load mapper types." }));
    } finally {
      setLoadingMapperTypes(false);
    }
  };

  const fetchMapperDetails = async () => {
    setLoading(true);
    try {
      const response = await HAxiosService.GET(
        UserManagementAPI.ldap_mapper_by_id(providerId, mapperId)
      );
      const mapperData = response.data;
      setMapperName(mapperData.name || "");
      setSelectedMapperType(mapperData.providerId || "");
      const normalizedConfig = {};
      if (mapperData.config) {
        Object.keys(mapperData.config).forEach((key) => {
          const value = mapperData.config[key];
          if (Array.isArray(value) && value.length > 0) {
            const firstVal = value[0];
            if (firstVal === "true") normalizedConfig[key] = true;
            else if (firstVal === "false") normalizedConfig[key] = false;
            else normalizedConfig[key] = firstVal;
          } else if (Array.isArray(value)) {
            normalizedConfig[key] = "";
          } else {
            normalizedConfig[key] = value || "";
          }
        });
      }
      setMapperConfig(normalizedConfig);
    } catch (error) {
      console.error("Error fetching mapper details:", error);
      toast.error(intl.formatMessage({ id: "ldapMapper.toast.loadDetailsFailed", defaultMessage: "Failed to load mapper details." }));
    } finally {
      setLoading(false);
    }
  };

  const handleMapperTypeChange = (e) => {
    setSelectedMapperType(e.target.value);
    setMapperConfig({});
  };

  const handlePropertyChange = (propertyName, value) => {
    setMapperConfig((prev) => ({ ...prev, [propertyName]: value }));
  };

  const handleSave = async () => {
    if (!mapperName.trim()) { toast.error(intl.formatMessage({ id: "ldapMapper.toast.nameRequired", defaultMessage: "Please enter a mapper name." })); return; }
    if (!selectedMapperType) { toast.error(intl.formatMessage({ id: "ldapMapper.toast.typeRequired", defaultMessage: "Please select a mapper type." })); return; }

    setSaving(true);
    try {
      const formattedConfig = {};
      Object.keys(mapperConfig).forEach((key) => {
        const value = mapperConfig[key];
        if (typeof value === "boolean") formattedConfig[key] = [value ? "true" : "false"];
        else if (Array.isArray(value)) formattedConfig[key] = value;
        else if (value === "" || value === null || value === undefined) formattedConfig[key] = [""];
        else formattedConfig[key] = [String(value)];
      });

      if (isEditMode) {
        await HAxiosService.PUT(
          UserManagementAPI.ldap_mapper_by_id(providerId, mapperId),
          { name: mapperName, providerId: selectedMapperType, config: formattedConfig }
        );
        toast.success(intl.formatMessage({ id: "ldapMapper.toast.updated", defaultMessage: "Mapper updated successfully!" }));
      } else {
        await HAxiosService.POST(
          UserManagementAPI.fetch_ldap_mappers(providerId),
          { name: mapperName, providerId: selectedMapperType, config: formattedConfig }
        );
        toast.success(intl.formatMessage({ id: "ldapMapper.toast.created", defaultMessage: "Mapper created successfully!" }));
      }
      navigate(`/homelayout/ldap-providers/${providerId}`);
    } catch (error) {
      console.error("Error saving mapper:", error);
      toast.error(error.response?.data?.message || intl.formatMessage({ id: "ldapMapper.toast.saveFailed", defaultMessage: "Failed to save mapper." }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(`/homelayout/ldap-providers/${providerId}`);

  if (loading || (isCreateMode && loadingMapperTypes)) {
    return (
      <HBox sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress sx={{ color: colors.primary }} />
      </HBox>
    );
  }

  const selectedMapperTypeObj = mapperTypes.find((mt) => mt.id === selectedMapperType);
  const pageTitle = isEditMode
    ? intl.formatMessage({ id: "ldapMapper.title.edit", defaultMessage: "Edit Mapper: {name}" }, { name: mapperName })
    : intl.formatMessage({ id: "ldapMapper.title.create", defaultMessage: "Create new mapper" });

  let saveButtonLabel;
  if (saving) saveButtonLabel = "ldapMapper.button.saving";
  else if (isEditMode) saveButtonLabel = "ldapMapper.button.update";
  else saveButtonLabel = "ldapMapper.button.save";

  return (
    <div>
      <HBox sx={{ minHeight: '100vh', py: 3, display: 'flex', flexDirection: 'column' }}>
        
        <Container maxWidth="md">
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2.5 }}>
            {[
              { id: 'ldapMapper.breadcrumb.federation', defaultVal: 'User federation', path: '/homelayout/ldap-providers' },
              { id: 'ldapMapper.breadcrumb.settings', defaultVal: 'Settings', path: `/homelayout/ldap-providers/${providerId}` },
              { id: 'ldapMapper.breadcrumb.mapperDetails', defaultVal: 'Mapper details', path: `/homelayout/ldap-providers/${providerId}` },
            ].map((crumb) => (
              <Link key={crumb.id} component="button" variant="body2" onClick={() => navigate(crumb.path)}
                sx={{ cursor: 'pointer', color: colors.primary, fontFamily: "'Inter', sans-serif", fontSize: 13, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                <HLabel value={crumb.id} translate={true} colon={false} sx={{ cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }} />
              </Link>
            ))}
          </Breadcrumbs>

          <div>
            <HPaper elevation={0} sx={{
              borderRadius: '16px',
              // backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 12px 30px -10px ${colors.primary}40`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Gradient header */}
              <HBox sx={{
                px: 3, py: 1.8,
                backgroundSize: '300% 300%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'transparent' }}>
                  <HBox sx={{
                    width: 34, height: 34, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiMap size={18} />
                  </HBox>
                  <HLabel value={pageTitle} translate={false} colon={false} align="left" sx={{ fontWeight: 700, fontFamily: "'Inter', sans-serif", fontSize: 17, color: theme.palette.text.primary, textTransform: 'uppercase', letterSpacing: 0.8 }} />
                </HBox>
                {isEditMode && (
                  <Chip
                    label="Edit Mode"
                    size="small"
                    sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12 }}
                  />
                )}
              </HBox>

              {/* Form body */}
              <HBox sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                {/* Name Field */}
                <HBox sx={{ mb: 2, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                  <HLabel value="ldapMapper.field.name" translate={true} required={true} align="left" colon={false} sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: theme.palette.text.secondary, mb: 1, display: 'block' }} />
                  <HTextField
                    value={mapperName}
                    onChange={(e) => setMapperName(e.target.value)}
                    placeholder="ldapMapper.field.placeholder.name"
                    disabled={isEditMode}
                    editable={!isEditMode}
                    width="100%"
                    translate={true}
                  /> 
                </HBox>

                <Divider sx={{ my: 2, borderColor: colors.border }} />

                {/* Mapper Type */}
                <HBox sx={{ mb: 2, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
                  <HLabel value="ldapMapper.field.mapperType" translate={true} required={true} align="left" colon={false} sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: theme.palette.text.secondary, mb: 1, display: 'block' }} />
                  <HDropdown
                    value={selectedMapperType}
                    onChange={handleMapperTypeChange}
                    disabled={isEditMode}
                    placeholder={intl.formatMessage({ id: "ldapMapper.field.placeholder.selectType", defaultMessage: "Select a mapper type" })}
                    options={mapperTypes.map((mt) => ({ value: mt.id, label: mt.id }))}
                    width="100%"
                  />
                </HBox>

                {/* Dynamic Properties */}
                {selectedMapperTypeObj?.properties?.length > 0 && (
                  <>
                    <Divider sx={{ my: 2, borderColor: colors.border }} />
                    <HLabel
                      value="ldapMapper.header.configuration"
                      translate={true}
                      colon={false}
                      align="left"
                      sx={{
                        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13,
                        color: theme.palette.text.primary, textTransform: 'uppercase', letterSpacing: 0.8, mb: 2.5, display: 'block',
                      }}
                    />
                    {selectedMapperTypeObj.properties.map((property) => (
                      <MapperField
                        key={property.name}
                        property={property}
                        value={mapperConfig[property.name]}
                        onChange={(value) => handlePropertyChange(property.name, value)}
                      />
                    ))}
                  </>
                )}
              </HBox>

              {/* Footer buttons */}
              <HBox sx={{
                px: 2, py: 1,
                borderTop: `1px solid ${colors.border}`,
                display: 'flex', justifyContent: 'flex-end',
                alignItems: 'center', gap: 1.5,
              }}>
                <HButton
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving || !mapperName.trim() || !selectedMapperType}
                  loading={saving}
                  startIcon={saving ? null : <FiSave size={14} />}
                  label={saveButtonLabel}
                  sx={{
                    textTransform: 'none', fontFamily: "'Inter', sans-serif",
                    fontWeight: 600, borderRadius: '8px', px: 2, py: 0.85, fontSize: 14,
                  }}
                />
                <HButton
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<MdClose size={15} />}
                  label="ldapMapper.button.cancel"
                  sx={{
                    textTransform: 'none', fontFamily: "'Inter', sans-serif",
                    fontWeight: 600, borderRadius: '8px', px: 2, py: 0.85, fontSize: 14,
                  }}
                />
              </HBox>
            </HPaper>
          </div>
        </Container>
      </HBox>
    </div>
  );
};

LdapMapperDetail.propTypes = {};
export default LdapMapperDetail;
