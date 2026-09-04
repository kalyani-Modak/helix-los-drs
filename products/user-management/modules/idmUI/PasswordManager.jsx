import { useState, useEffect } from "react";
import { MenuItem, Select, IconButton, Divider, CircularProgress,
  Chip, Skeleton, Tooltip } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { MdSecurity, MdClose } from "react-icons/md";
import { FiShield, FiCheckCircle, FiLock, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import passwordPolicies from "@resources/passwordPolicies.json";
import { UserManagementAPI } from "./apiEndpoints";
import { isHttpSuccess } from "./apiResponse";
import { HAxiosService, HBox, HButton, HPaper, HLabel, HTextField, TitleBar, HBreadCrumb, HToggle, useToast } from "@helix/component-library";
import { useTheme } from "@mui/material/styles";
import { useIntl } from "react-intl";

// ─── Design Tokens (matches AccountList) ─────────────────────────────────────
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  accentDark: '#a30404',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  hover: '#f1f5f9',
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <HBox
    sx={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr 44px',
      alignItems: 'center',
      gap: 2,
      px: 2.5,
      py: 1.5,
    }}
  >
    <Skeleton variant="text" width="70%" height={24} sx={{ borderRadius: '6px' }} />
    <Skeleton variant="rounded" width="100%" height={36} sx={{ borderRadius: '8px' }} />
    <Skeleton variant="circular" width={32} height={32} />
  </HBox>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ intl, theme }) => (
  <HBox
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 7,
      gap: 1.5,
    }}
  >
    <HBox
      sx={{
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <FiShield size={28} color={colors.primary} />
    </HBox>
    <HLabel
      value={intl.formatMessage({ id: "label.password.noPolicyConfig",defaultMessage: "No policies configured"})}
      colon={false}
      translate={false}
      align="left"
      component="div"
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 15,
        color: theme.palette.text.secondary,
      }}
    />
    <HLabel
      value={intl.formatMessage({ id: "label.password.useDropdown",defaultMessage: "Use the dropdown above to add a password policy."})}
      colon={false}
      translate={false}
      align="left"
      component="div"
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: theme.palette.text.secondary,
      }}
    />
  </HBox>
);

// ─── Component ────────────────────────────────────────────────────────────────
const PasswordManager = () => {
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [policyFields, setPolicyFields] = useState({});
  const [keycloakPolicyKeys, setKeycloakPolicyKeys] = useState({});
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [policyValues, setPolicyValues] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const realm = sessionStorage.getItem("SEC_REALM");
  const toast = useToast();
  const navigate = useNavigate();
  const theme = useTheme();
  const intl = useIntl();

  // ── All original logic preserved ──────────────────────────────────────────
  useEffect(() => {
    setAvailablePolicies(passwordPolicies.availablePolicies);
    setPolicyFields(passwordPolicies.policyFields);
    setKeycloakPolicyKeys(passwordPolicies.keycloakPolicyKeys);
  }, []);

  useEffect(() => {
    if (Object.keys(keycloakPolicyKeys).length > 0) {
      fetchExistingPolicies();
    }
  }, [keycloakPolicyKeys]);

  const fetchExistingPolicies = async () => {
    if (!realm) return;
    try {
      setIsLoading(true);
      const response = await HAxiosService.GET(UserManagementAPI.fetch_password_policies(realm));
      if (isHttpSuccess(response)) {
        const policyArray = response.data.split(" and ");
        const selected = [];
        const policyValuesMap = {};
        policyArray.forEach((policyString) => {
          const match = policyString.match(/(.+?)\((.*?)\)/);
          let keycloakKey, value;
          if (match) {
            keycloakKey = match[1];
            value = match[2];
          } else {
            keycloakKey = policyString.trim();
            value = "";
          }
          const policyName = Object.keys(keycloakPolicyKeys).find(
            (name) => keycloakPolicyKeys[name] === keycloakKey
          );
          if (policyName) {
            selected.push(policyName);
            policyValuesMap[policyName] = value;
          }
        });
        setSelectedPolicies(selected);
        setPolicyValues(policyValuesMap);
      }
    } catch (error) {
      console.error("Error fetching existing policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPolicy = (event) => {
    const selectedPolicy = event.target.value;
    if (!selectedPolicies.includes(selectedPolicy)) {
      setSelectedPolicies([...selectedPolicies, selectedPolicy]);
      // Toggle-locked policies always start enabled — matching Keycloak's
      // default behavior. Fields with a defined defaultValue (e.g. Hashing
      // Algorithm, which Keycloak itself defaults to "argon2") start there too.
      const isToggleLocked = policyFields[selectedPolicy]?.toggleLocked;
      const defaultValue = policyFields[selectedPolicy]?.defaultValue;
      const initialValue = isToggleLocked ? true : (defaultValue !== undefined ? defaultValue : "");
      setPolicyValues({ ...policyValues, [selectedPolicy]: initialValue });
    }
  };

  const handlePolicyValueChange = (policy, value) => {
    // Guard: toggle-locked policies can never be changed from the UI,
    // even if an onChange somehow fires.
    if (policyFields[policy]?.toggleLocked) return;
    setPolicyValues({ ...policyValues, [policy]: value });
  };

  const handleRemovePolicy = (policy) => {
    // Toggle-locked policies can still be removed from the selected list
    // freely — only the on/off toggle itself is locked.
    setSelectedPolicies(selectedPolicies.filter((p) => p !== policy));
    const updatedValues = { ...policyValues };
    delete updatedValues[policy];
    setPolicyValues(updatedValues);
  };

  const handleSavePolicies = async () => {
    const formattedPolicy = selectedPolicies
      .map((policy) => {
        const keycloakKey = keycloakPolicyKeys[policy];
        const value = policyValues[policy];
        return value ? `${keycloakKey}(${value})` : keycloakKey;
      })
      .join(" and ");

    if (!realm) {
      toast.error(intl.formatMessage({ id: "error.password.realmUndefined", defaultMessage: "Realm is not defined." }));
      return;
    }

    try {
      setIsSaving(true);
      const response = await HAxiosService.PUT(
        UserManagementAPI.update_password_policy(realm),
        { passwordPolicy: formattedPolicy }
      );

      if (isHttpSuccess(response)) {
        toast.success(intl.formatMessage({ id: "label.password.updated", defaultMessage: "Password policy updated successfully!" }));
        fetchExistingPolicies();
      } else {
        toast.error(intl.formatMessage({ id: "error.password.update", defaultMessage: "Failed to update password policy." }));
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      toast.error(error.response?.data?.message || intl.formatMessage({ id: "error.password.updatePolicy", defaultMessage: "Failed to update policy" }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReloadPolicies = () => {
    // Discards any unsaved local edits and re-fetches the currently saved
    // policy from Keycloak — same purpose as the Reload button in Keycloak's
    // own admin console.
    fetchExistingPolicies();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <HBox
        sx={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          mt: 2
        }}
      >
        {/* Container replacement — centred, max-width md ≈ 900px */}
        <div>
          <HBox
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <HPaper
              elevation={2}
              sx={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >

              {/* ── header bar ── */}
              <HBox
                sx={{
                  px: 3,
                  py: 1.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Breadcrumb + TitleBar */}
                <HBox sx={{ flexShrink: 0 }}>
                  <HBreadCrumb />
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                                
                    <HBox
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MdSecurity size={20} />
                    </HBox>
                    <TitleBar
                      title={intl.formatMessage({
                        id: "label.password.title",
                        defaultMessage: "Password Manager",
                      })}
                    />
                  </HBox>
                </HBox>

                {/* Policy count badge */}
                {selectedPolicies.length > 0 && (
                  <Chip
                    icon={<FiCheckCircle size={13} style={{ marginLeft: 6 }} />}
                    label={`${selectedPolicies.length} ${selectedPolicies.length === 1 ? intl.formatMessage({ id: "label.password.policy", defaultMessage: "Policy" }) : intl.formatMessage({ id: "label.password.policies", defaultMessage: "Policies" })} Active`}
                    size="small"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  />
                )}
              </HBox>

              {/* ── Add Policy row ── */}
              <HBox
                sx={{
                  px: 3,
                  py: 1.6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <HLabel
                  value={intl.formatMessage({ id: "label.password.addPolicy", defaultMessage: "Add Policy" })}
                  translate={false}
                  align="left"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: theme.palette.text.secondary,
                    whiteSpace: 'nowrap',
                  }}
                />

                <Select
                  value=""
                  onChange={handleSelectPolicy}
                  displayEmpty
                  size="small"
                  sx={{
                    minWidth: 240,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    borderRadius: '8px',
                  }}
                >
                  <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: theme.palette.text.secondary }}>
                    {intl.formatMessage({
                    id: "label.password.selectPolicyPlaceholder",
                    defaultMessage: "Select a policy to add",
                  })}
                  </MenuItem>
                  {availablePolicies.map((policy) => (
                    <MenuItem
                      key={policy}
                      value={policy}
                      disabled={selectedPolicies.includes(policy)}
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        '&.Mui-disabled': { opacity: 0.45 },
                      }}
                    >
                      {policy}
                    </MenuItem>
                  ))}
                </Select>

                {/* <HDropdown
                  options={availablePolicies.map((policy) => ({
                    value: policy,
                    label: policy,
                    disabled: selectedPolicies.includes(policy),
                  }))}
                  value=""
                  onChange={handleSelectPolicy}
                  placeholder={intl.formatMessage({
                    id: "label.password.selectPolicyPlaceholder",
                    defaultMessage: "Select a policy to add",
                  })}
                  width={240}
                /> */}

                {/* Loading indicator */}
                {isLoading && (
                  <HBox sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                    <CircularProgress size={14} />
                    <HLabel
                      value={intl.formatMessage({ id: "label.password.loading", defaultMessage: "Loading..." })}
                      colon={false}
                      translate={false}
                      align="left"
                      component="div"
                      sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: theme.palette.text.secondary }}
                    />
                  </HBox>
                )}

                {/* Reload — discards local edits and re-fetches the saved policy, same as Keycloak's own admin console */}
                <Tooltip title={intl.formatMessage({ id: "label.password.reloadTooltip", defaultMessage: "Reload saved policy (discards unsaved changes)" })} placement="top">
                  <span style={{ marginLeft: isLoading ? 0 : 'auto' }}>
                    <IconButton
                      onClick={handleReloadPolicies}
                      size="small"
                      disabled={isLoading || isSaving}
                      sx={{
                        color: colors.text.secondary,
                        '&:hover': {
                          color: colors.primary,
                          background: `${colors.primary}12`,
                        },
                      }}
                    >
                      <FiRefreshCw size={16} />
                    </IconButton>
                  </span>
                </Tooltip>
              </HBox>

              {/* ── Policy rows ── */}
              <HBox
                sx={{
                  px: 1,
                  py: selectedPolicies.length > 0 ? 1.5 : 0,
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {isLoading ? (
                  [1, 2, 3].map((i) => <SkeletonRow key={i} />)
                ) : selectedPolicies.length === 0 ? (
                  <EmptyState intl={intl} theme={theme} />
                ) : (
                  <>
                    {/* Column headers */}
                    <HBox
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '220px 1fr 44px',
                        gap: 2,
                        px: 2.5,
                        pb: 1,
                      }}
                    >
                      {['Policy', 'Value', ''].map((h) => (
                        <HLabel
                          key={h}
                          value={h}
                          colon={false}
                          translate={false}
                          align="left"
                          component="div"
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 11,
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.8,
                          }}
                        />
                      ))}
                    </HBox>

                    <Divider sx={{ mx: 2.5, mb: 1, borderColor: colors.border }} />

                    {selectedPolicies.map((policy, idx) => {
                      const isToggleLocked = policyFields[policy]?.toggleLocked;
                      return (
                      <div key={policy}>
                        <HBox
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '220px 1fr 44px',
                            alignItems: 'center',
                            gap: 2,
                            px: 2.5,
                            py: 1.4,
                            mx: 0.5,
                            borderRadius: '10px',
                          }}
                        >
                          {/* Policy name */}
                          <HLabel
                            value={policy}
                            colon={false}
                            translate={false}
                            align="left"
                            component="div"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 600,
                              fontSize: 14,
                              color: theme.palette.text.primary,
                            }}
                          />

                           {/* Value input */}
                           {policyFields[policy]?.type === 'boolean' ? (
                             isToggleLocked ? (
                               <Tooltip
                                 title={intl.formatMessage({
                                   id: "label.password.toggleLockedTooltip",
                                   defaultMessage: "This policy works as expected but cannot be toggled — same as in Keycloak's own admin console.",
                                 })}
                                 placement="top"
                               >
                                 <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'not-allowed' }}>
                                   <HToggle
                                     checked={true}
                                     disabled
                                     label={intl.formatMessage({ id: "label.password.enabled", defaultMessage: "Enabled" })}
                                   />
                                   <FiLock size={13} color={colors.text.muted} />
                                 </span>
                               </Tooltip>
                             ) : (
                             <HToggle
                               checked={policyValues[policy] === 'true' || policyValues[policy] === true}
                               onChange={(e) => handlePolicyValueChange(policy, e.target.checked)}
                               label={policyValues[policy] === 'true' || policyValues[policy] === true ? 'label.password.enabled' : 'label.password.disabled'}
                             />
                             )
                           ) : policyFields[policy]?.type === 'select' ? (
                             <Select
                               value={policyValues[policy] || policyFields[policy]?.defaultValue || ''}
                               onChange={(e) => handlePolicyValueChange(policy, e.target.value)}
                               size="small"
                               fullWidth
                               sx={{
                                 fontFamily: "'Inter', sans-serif",
                                 fontSize: 14,
                                 borderRadius: '8px',
                               }}
                             >
                               {(policyFields[policy]?.options || []).map((option) => (
                                 <MenuItem
                                   key={option}
                                   value={option}
                                   sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}
                                 >
                                   {option}
                                 </MenuItem>
                               ))}
                             </Select>
                           ) : (
                            <HTextField
                              placeholder={policyFields[policy]?.label}
                              type={policyFields[policy]?.type}
                              size="small"
                              editable={true}
                              value={policyValues[policy] || ''}
                              onChange={(e) => handlePolicyValueChange(policy, e.target.value)}
                              fullWidth
                            />
                          )}

                          {/* Remove button */}
                          <Tooltip title={intl.formatMessage({ id: "label.password.removePolicy", defaultMessage: "Remove Policy" })} placement="top">
                            <IconButton
                              onClick={() => handleRemovePolicy(policy)}
                              size="small"
                              sx={{
                                color: colors.accent,
                                '&:hover': {
                                  color: colors.accentDark,
                                  transform: 'scale(1.18)',
                                  background: `${colors.accent}12`,
                                },
                              }}
                            >
                              <RemoveCircleOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </HBox>
                      </div>
                      );
                    })}
                  </>
                )}
              </HBox>

              {/* ── Footer / Save ── */}
              <HBox
                sx={{
                  px: 3,
                  py: 2,
                  borderTop: `1px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {selectedPolicies.length > 0 && (
                  <HLabel
                    value={`${selectedPolicies.length} ${selectedPolicies.length === 1 ? intl.formatMessage({ id: "label.password.policy", defaultMessage: "Policy" }) : intl.formatMessage({ id: "label.password.policies", defaultMessage: "Policies" })} configured`}
                    colon={false}
                    translate={false}
                    align="left"
                    component="div"
                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: theme.palette.text.secondary }}
                  />
                )}

                <HButton
                  label={isSaving ? intl.formatMessage({ id: "label.password.saving", defaultMessage: "Saving..." }) : intl.formatMessage({ id: "label.password.savePolicy", defaultMessage: "Save Policy" })}
                  variant="contained"
                  onClick={handleSavePolicies}
                  disabled={isSaving || isLoading}
                  startIcon={
                    isSaving
                      ? <CircularProgress size={15} sx={{ color: '#fff' }} />
                      : <FiCheckCircle size={15} />
                  }
                  sx={{
                    textTransform: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    px: 3,
                    py: 0.85,
                    fontSize: 14,
                  }}
                />

                <HButton
                  label={intl.formatMessage({ id: "label.password.close", defaultMessage: "Close" })}
                  variant="outlined"
                  onClick={() => navigate("/homelayout/welcomepage")}
                  startIcon={<MdClose size={15} />}
                  sx={{
                    textTransform: 'none',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    px: 3,
                    py: 0.85,
                    fontSize: 14,
                  }}
                />
              </HBox>

            </HPaper>
          </HBox>
        </div>
      </HBox>
    </div>
  );
};

export default PasswordManager;