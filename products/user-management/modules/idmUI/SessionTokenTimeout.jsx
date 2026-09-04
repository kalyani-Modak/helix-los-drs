import { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  InputAdornment,
  LinearProgress,
  Stack,
} from "@mui/material";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import {
  HAxiosService,
  HBox,
  HButton,
  HDropdown,
  HLabel,
  HPaper,
  HTextField,
  HToggle,
  HBreadCrumb,
  TitleBar,
  HTabs,
  HTab,
  useToast,
  useDrsTheme,
  withAlpha,
} from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, getApiMsg } from "./apiResponse";

const TAB_SESSION = 0;
const TAB_TOKEN = 1;

const colors = {
  primary: "var(--drs-color-primary)",
  secondary: "var(--drs-color-secondary)",
  accent: "var(--drs-color-accent)",
  card: "var(--drs-bg-paper)",
  text: {
    primary: "var(--drs-text-primary)",
    secondary: "var(--drs-text-secondary)",
    light: "var(--drs-text-secondary)",
    muted: "var(--drs-text-tertiary, var(--drs-text-secondary))",
  },
  border: "var(--drs-border-divider)",
};

const idmLayoutColors = {
  primary: colors.primary,
  secondary: colors.secondary,
  border: colors.border,
  cardBg: colors.card,
  text: {
    secondary: colors.text.secondary,
    muted: colors.text.muted,
  },
};

const TIME_UNITS = [
  { value: "SECONDS", labelKey: "label.sessionTimeout.unit.seconds", defaultLabel: "Seconds" },
  { value: "MINUTES", labelKey: "label.sessionTimeout.unit.minutes", defaultLabel: "Minutes" },
  { value: "HOURS", labelKey: "label.sessionTimeout.unit.hours", defaultLabel: "Hours" },
  { value: "DAYS", labelKey: "label.sessionTimeout.unit.days", defaultLabel: "Days" },
];

const DEFAULT_UNIT = "MINUTES";

const durationFieldSx = {
  width: "100%",
  minWidth: 0,
  mb:3,
  "& .MuiOutlinedInput-root": {
    fontFamily: "inherit",
    fontSize: 12,
    borderRadius: "8px",
    background: "transparent",
    pr: 0,
    overflow: "hidden",
  },
  "& .MuiInputLabel-root": { fontFamily: "inherit", fontSize: 12 },
  "& .MuiFormHelperText-root": {
    fontFamily: "inherit",
    fontSize: 11,
    lineHeight: 1.45,
    color: idmLayoutColors.text.muted,
  },
  "& .MuiInputAdornment-root": {
    height: "auto",
    maxHeight: "none",
    alignSelf: "stretch",
    ml: 0,
    mr: 0,
  },
};

const unitSelectSx = {
  fontFamily: "inherit",
  fontSize: 12,
  height: "100%",
  minWidth: 150,
  borderLeft: `1px solid ${idmLayoutColors.border}`,
  borderRadius: 0,
  bgcolor: "var(--drs-bg-hover, rgba(0, 0, 0, 0.03))",
  "& .MuiSelect-select": {
    py: 1,
    px: 1.25,
    pr: "28px !important",
    display: "flex",
    alignItems: "center",
  },
  "& fieldset": { border: "none" },
  "&:hover": {
    bgcolor: "var(--drs-hover-bg)",
  },
};

const durationCellSx = {
  minWidth: 0,
  width: "100%",
};

const FIELD_TYPE = {
  DURATION: "duration",
  BOOLEAN: "boolean",
  TEXT: "text",
  SELECT: "select",
};

const SIGNATURE_ALGORITHMS = [
  "RS256", "RS384", "RS512",
  "ES256", "ES384", "ES512",
  "PS256", "PS384", "PS512",
  "HS256", "HS384", "HS512",
];

const TOKEN_FIELD_GROUPS = [
  {
    titleKey: "label.sessionTimeout.group.general",
    defaultTitle: "General",
    descriptionKey: "label.sessionTimeout.group.general.desc",
    defaultDescription: "Default token signing and OAuth 2.0 device / pushed-authorization settings.",
    fields: [
      {
        key: "defaultSignatureAlgorithm",
        type: FIELD_TYPE.SELECT,
        labelKey: "label.sessionTimeout.field.defaultSignatureAlgorithm",
        defaultLabel: "Default Signature Algorithm",
        descriptionKey: "label.sessionTimeout.field.defaultSignatureAlgorithm.desc",
        defaultDescription: "Algorithm used to sign access and ID tokens. RS256 is the most common choice.",
        options: SIGNATURE_ALGORITHMS,
      },
      {
        key: "oauth2DeviceCodeLifespan",
        labelKey: "label.sessionTimeout.field.oauth2DeviceCodeLifespan",
        defaultLabel: "OAuth 2.0 Device Code Lifespan",
        descriptionKey: "label.sessionTimeout.field.oauth2DeviceCodeLifespan.desc",
        defaultDescription: "Maximum time before a device code and user code pair expires. A relatively short value is recommended.",
      },
      {
        key: "oauth2DevicePollingInterval",
        labelKey: "label.sessionTimeout.field.oauth2DevicePollingInterval",
        defaultLabel: "OAuth 2.0 Device Polling Interval",
        descriptionKey: "label.sessionTimeout.field.oauth2DevicePollingInterval.desc",
        defaultDescription: "Minimum time in seconds the client should wait between polling requests to the token endpoint.",
      },
      {
        key: "shortVerificationUri",
        type: FIELD_TYPE.TEXT,
        labelKey: "label.sessionTimeout.field.shortVerificationUri",
        defaultLabel: "Short verification_uri in Device Authorization flow",
        descriptionKey: "label.sessionTimeout.field.shortVerificationUri.desc",
        defaultDescription: "Optional shorter verification URL shown to users during device authorization (for example, https://example.com/device).",
      },
      {
        key: "parRequestUriLifespan",
        labelKey: "label.sessionTimeout.field.parRequestUriLifespan",
        defaultLabel: "Lifetime of the Request URI for Pushed Authorization Request",
        descriptionKey: "label.sessionTimeout.field.parRequestUriLifespan.desc",
        defaultDescription: "How long a pushed-authorization request URI stays valid. The default is usually 1 minute.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.refreshTokens",
    defaultTitle: "Refresh tokens",
    descriptionKey: "label.sessionTimeout.group.refreshTokens.desc",
    defaultDescription: "Controls whether a new refresh token is issued on each refresh request.",
    fields: [
      {
        key: "revokeRefreshToken",
        type: FIELD_TYPE.BOOLEAN,
        labelKey: "label.sessionTimeout.field.revokeRefreshToken",
        defaultLabel: "Revoke Refresh Token",
        descriptionKey: "label.sessionTimeout.field.revokeRefreshToken.desc",
        defaultDescription: "When enabled, each refresh request issues a new refresh token and invalidates the previous one.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.accessTokens",
    defaultTitle: "Access tokens",
    descriptionKey: "label.sessionTimeout.group.accessTokens.desc",
    defaultDescription: "Lifespan of access tokens and related client login timeout.",
    fields: [
      {
        key: "accessTokenLifespan",
        labelKey: "label.sessionTimeout.field.accessTokenLifespan",
        defaultLabel: "Access Token Lifespan",
        descriptionKey: "label.sessionTimeout.field.accessTokenLifespan.desc",
        defaultDescription: "Maximum time before an access token expires. Shorter than SSO Session Idle is recommended.",
        dynamicDescription: true,
      },
      {
        key: "accessTokenLifespanForImplicitFlow",
        labelKey: "label.sessionTimeout.field.accessTokenLifespanForImplicitFlow",
        defaultLabel: "Access Token Lifespan For Implicit Flow",
        descriptionKey: "label.sessionTimeout.field.accessTokenLifespanForImplicitFlow.desc",
        defaultDescription: "Maximum time before an access token issued during the implicit OAuth flow expires.",
      },
      {
        key: "accessCodeLifespan",
        labelKey: "label.sessionTimeout.field.accessCodeLifespan",
        defaultLabel: "Client Login Timeout",
        descriptionKey: "label.sessionTimeout.field.accessCodeLifespan.desc",
        defaultDescription: "Maximum time a client has to finish the login process. The default is usually 30 seconds.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.actionTokens",
    defaultTitle: "Action tokens",
    descriptionKey: "label.sessionTimeout.group.actionTokens.desc",
    defaultDescription: "Default lifespans for user- and admin-initiated action links.",
    fields: [
      {
        key: "actionTokenGeneratedByUserLifespan",
        labelKey: "label.sessionTimeout.field.actionTokenGeneratedByUserLifespan",
        defaultLabel: "User-Initiated Action Lifespan",
        descriptionKey: "label.sessionTimeout.field.actionTokenGeneratedByUserLifespan.desc",
        defaultDescription: "Default maximum time before a user-initiated action token expires (for example, verify email).",
      },
      {
        key: "actionTokenGeneratedByAdminLifespan",
        labelKey: "label.sessionTimeout.field.actionTokenGeneratedByAdminLifespan",
        defaultLabel: "Default Admin-Initiated Action Lifespan",
        descriptionKey: "label.sessionTimeout.field.actionTokenGeneratedByAdminLifespan.desc",
        defaultDescription: "Default maximum time before an administrator-initiated action token expires.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.overrideActionTokens",
    defaultTitle: "Override Action Tokens",
    descriptionKey: "label.sessionTimeout.group.overrideActionTokens.desc",
    defaultDescription: "Optional per-action overrides. Leave blank to inherit the default User-Initiated Action Lifespan.",
    fields: [
      {
        key: "actionTokenVerifyEmail",
        labelKey: "label.sessionTimeout.field.actionTokenVerifyEmail",
        defaultLabel: "Email Verification",
        descriptionKey: "label.sessionTimeout.field.actionTokenVerifyEmail.desc",
        defaultDescription: "Override lifespan for email verification links sent to users.",
      },
      {
        key: "actionTokenIdpVerifyAccount",
        labelKey: "label.sessionTimeout.field.actionTokenIdpVerifyAccount",
        defaultLabel: "IdP account email verification",
        descriptionKey: "label.sessionTimeout.field.actionTokenIdpVerifyAccount.desc",
        defaultDescription: "Override lifespan for identity-provider account email verification links.",
      },
      {
        key: "actionTokenForgotPassword",
        labelKey: "label.sessionTimeout.field.actionTokenForgotPassword",
        defaultLabel: "Forgot password",
        descriptionKey: "label.sessionTimeout.field.actionTokenForgotPassword.desc",
        defaultDescription: "Override lifespan for forgot-password / reset-credentials links.",
      },
      {
        key: "actionTokenExecuteActions",
        labelKey: "label.sessionTimeout.field.actionTokenExecuteActions",
        defaultLabel: "Execute actions",
        descriptionKey: "label.sessionTimeout.field.actionTokenExecuteActions.desc",
        defaultDescription: "Override lifespan for execute-actions links sent to users.",
      },
    ],
  },
];

const SESSION_FIELD_GROUPS = [
  {
    titleKey: "label.sessionTimeout.group.ssoSession",
    defaultTitle: "SSO Session Settings",
    descriptionKey: "label.sessionTimeout.group.ssoSession.desc",
    defaultDescription: "Shared sign-on session limits across all applications. SSO Session Max should be greater than or equal to SSO Session Idle.",
    fields: [
      {
        key: "ssoSessionIdleTimeout",
        labelKey: "label.sessionTimeout.field.ssoSessionIdleTimeout",
        defaultLabel: "SSO Session Idle",
        descriptionKey: "label.sessionTimeout.field.ssoSessionIdleTimeout.desc",
        defaultDescription: "Time a session may remain idle before it expires.",
      },
      {
        key: "ssoSessionMaxLifespan",
        labelKey: "label.sessionTimeout.field.ssoSessionMaxLifespan",
        defaultLabel: "SSO Session Max",
        descriptionKey: "label.sessionTimeout.field.ssoSessionMaxLifespan.desc",
        defaultDescription: "Maximum time before a session expires, regardless of activity.",
      },
      {
        key: "ssoSessionIdleTimeoutRememberMe",
        labelKey: "label.sessionTimeout.field.ssoSessionIdleTimeoutRememberMe",
        defaultLabel: "SSO Session Idle Remember Me",
        descriptionKey: "label.sessionTimeout.field.ssoSessionIdleTimeoutRememberMe.desc",
        defaultDescription: "Same as SSO Session Idle when the user selected Remember Me at login.",
      },
      {
        key: "ssoSessionMaxLifespanRememberMe",
        labelKey: "label.sessionTimeout.field.ssoSessionMaxLifespanRememberMe",
        defaultLabel: "SSO Session Max Remember Me",
        descriptionKey: "label.sessionTimeout.field.ssoSessionMaxLifespanRememberMe.desc",
        defaultDescription: "Same as SSO Session Max when the user selected Remember Me at login.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.clientSession",
    defaultTitle: "Client session settings",
    descriptionKey: "label.sessionTimeout.group.clientSession.desc",
    defaultDescription: "Per-client session limits. Set 0 to inherit the matching SSO session timeout.",
    fields: [
      {
        key: "clientSessionIdleTimeout",
        labelKey: "label.sessionTimeout.field.clientSessionIdleTimeout",
        defaultLabel: "Client Session Idle",
        descriptionKey: "label.sessionTimeout.field.clientSessionIdleTimeout.desc",
        defaultDescription: "Time a client session may remain idle before it expires. 0 inherits SSO Session Idle.",
      },
      {
        key: "clientSessionMaxLifespan",
        labelKey: "label.sessionTimeout.field.clientSessionMaxLifespan",
        defaultLabel: "Client Session Max",
        descriptionKey: "label.sessionTimeout.field.clientSessionMaxLifespan.desc",
        defaultDescription: "Maximum client session lifetime. 0 inherits SSO Session Max.",
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.offlineSession",
    defaultTitle: "Offline session settings",
    descriptionKey: "label.sessionTimeout.group.offlineSession.desc",
    defaultDescription: "Offline sessions require the offline_access scope.",
    showOfflineMaxToggle: true,
    fields: [
      {
        key: "offlineSessionIdleTimeout",
        labelKey: "label.sessionTimeout.field.offlineSessionIdleTimeout",
        defaultLabel: "Offline Session Idle",
        descriptionKey: "label.sessionTimeout.field.offlineSessionIdleTimeout.desc",
        defaultDescription: "Time an offline session may remain idle before it expires.",
      },
      {
        key: "offlineSessionMaxLifespan",
        labelKey: "label.sessionTimeout.field.offlineSessionMaxLifespan",
        defaultLabel: "Offline Session Max",
        descriptionKey: "label.sessionTimeout.field.offlineSessionMaxLifespan.desc",
        defaultDescription: "Maximum offline session lifetime. Applies when Offline Session Max Limited is enabled.",
        showWhenOfflineMaxEnabled: true,
      },
    ],
  },
  {
    titleKey: "label.sessionTimeout.group.loginSettings",
    defaultTitle: "Login settings",
    descriptionKey: "label.sessionTimeout.group.loginSettings.desc",
    defaultDescription: "Timeouts while a user completes sign-in or a required login action.",
    fields: [
      {
        key: "accessCodeLifespanLogin",
        labelKey: "label.sessionTimeout.field.accessCodeLifespanLogin",
        defaultLabel: "Login timeout",
        descriptionKey: "label.sessionTimeout.field.accessCodeLifespanLogin.desc",
        defaultDescription: "Maximum time a user has to complete the login process.",
      },
      {
        key: "accessCodeLifespanUserAction",
        labelKey: "label.sessionTimeout.field.accessCodeLifespanUserAction",
        defaultLabel: "Login action timeout",
        descriptionKey: "label.sessionTimeout.field.accessCodeLifespanUserAction.desc",
        defaultDescription: "Maximum time a user has to complete a required action during login (for example, update password).",
      },
    ],
  },
];

const collectDurationFields = (groups) =>
  groups.flatMap((group) =>
    group.fields.filter((field) => (field.type ?? FIELD_TYPE.DURATION) === FIELD_TYPE.DURATION)
  );

const ALL_DURATION_FIELDS = [
  ...collectDurationFields(TOKEN_FIELD_GROUPS),
  ...collectDurationFields(SESSION_FIELD_GROUPS),
];

const emptyDuration = () => ({ value: "", unit: DEFAULT_UNIT });

const EMPTY_FORM = Object.fromEntries(ALL_DURATION_FIELDS.map((field) => [field.key, emptyDuration()]));

const formatDurationLabel = (duration, intl) => {
  const raw = (duration?.value ?? "").trim();
  if (!raw) {
    return null;
  }
  const units = TIME_UNITS;
  const unitObj = units.find((item) => item.value === duration.unit);
  const unit = unitObj ? intl.formatMessage({ id: unitObj.labelKey, defaultMessage: unitObj.defaultLabel }) : duration.unit;
  const value = Number(raw);
  const unitLabel = value === 1 ? unit.replace(/s$/, "") : unit.toLowerCase();
  return `${raw} ${unitLabel}`;
};

const resolveFieldDescription = (field, form, intl) => {
  if (field.key === "accessTokenLifespan" && field.dynamicDescription) {
    const ssoIdle = formatDurationLabel(form.ssoSessionIdleTimeout, intl);
    if (ssoIdle) {
      return intl.formatMessage(
        { id: "label.sessionTimeout.recommendation", defaultMessage: "It is recommended for this value to be shorter than the SSO session idle timeout: {ssoIdle}" },
        { ssoIdle }
      );
    }
  }
  return intl.formatMessage({ id: field.descriptionKey, defaultMessage: field.defaultDescription });
};

const textFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    fontFamily: "inherit",
    fontSize: 12,
    borderRadius: "8px",
    background: "transparent",
  },
  "& .MuiInputLabel-root": { fontFamily: "inherit", fontSize: 12 },
  "& .MuiFormHelperText-root": {
    fontFamily: "inherit",
    fontSize: 11,
    lineHeight: 1.45,
    color: idmLayoutColors.text.muted,
  },
};

const selectFieldSx = {
  width: "100%",
  fontFamily: "inherit",
  fontSize: 12,
  borderRadius: "8px",
  background: "transparent",
};


const IdmFormSection = ({ title, description, children }) => (
  <HBox
    sx={{
      width: "100%",
      p: 2,
      borderRadius: 1,
      border: `1px solid ${colors.border}`,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      overflow: "hidden",
      bgcolor: colors.card,
    }}
  >
    <HLabel
      value={title}
      translate={false}
      colon={false}
      align="left"
      sx={{
        display: "block",
        width: "100%",
        color: colors.text.primary,
        fontWeight: 800,
        fontSize: { xs: "0.85rem", sm: "0.95rem" },
        lineHeight: 1.35,
      }}
    />
    {description ? (
      <HLabel
        value={description}
        translate={false}
        colon={false}
        align="left"
        sx={{
          display: "block",
          width: "100%",
          color: colors.text.secondary,
          fontSize: 13,
          lineHeight: 1.5,
          mt: -0.5,
        }}
      />
    ) : null}
    <HBox sx={{ width: "100%", flexDirection: "column", gap: 1.5, background: "transparent" }}>
      {children}
    </HBox>
  </HBox>
);

const IdmPanel = ({ title, description, children }) => (
  <HPaper elevation={0} sx={{ width: "100%", overflow: "hidden" }}>
    <HBox sx={{ flexDirection: "column", background: "transparent" }}>
      <HLabel
        value={title}
        translate={false}
        colon={false}
        align="left"
        sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.22rem" }, color: colors.text.primary }}
      />
      {description ? (
        <HLabel
          value={description}
          translate={false}
          colon={false}
          align="left"
          sx={{ lineHeight: 1.75, color: colors.text.secondary, fontSize: "0.875rem" }}
        />
      ) : null}
    </HBox>
    <HBox sx={{ py: 2, background: "transparent" }}>{children}</HBox>
  </HPaper>
);

const IdmTabPanel = ({ active, children }) => {
  if (!active) return null;
  return <HBox sx={{ width: "100%" }}>{children}</HBox>;
};

const BooleanToggleRow = ({ label, description, checked, disabled, onChange }) => (
  <HBox
    sx={{
      width: "100%",
      boxSizing: "border-box",
      p: 2,
      borderRadius: "8px",
      border: `1px solid ${colors.border}`,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 1.5,
      background: "transparent",
      "& .htoggle-wrapper": {
        width: "auto !important",
        flex: "0 0 auto",
        mt: 0.25,
      },
      "& .htoggle-label": {
        m: 0,
      },
      "& .MuiFormControlLabel-root": {
        m: 0,
        alignItems: "center",
      },
    }}
  >
    <HToggle
      checked={checked}
      onChange={(e) => onChange(Boolean(e?.target?.checked))}
      disabled={disabled}
      label=""
      align="left"
    />
    <HBox
      sx={{
        flex: "1 1 auto",
        minWidth: 0,
        flexDirection: "column",
        background: "transparent",
        gap: 0.25,
      }}
    >
      <HLabel
        value={label}
        translate={false}
        colon={false}
        align="left"
        sx={{
          display: "block",
          width: "100%",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.4,
          color: colors.text.primary,
        }}
      />
      {description ? (
        <HLabel
          value={description}
          translate={false}
          colon={false}
          align="left"
          sx={{
            display: "block",
            width: "100%",
            fontFamily: "inherit",
            fontSize: 11,
            lineHeight: 1.5,
            color: colors.text.light,
          }}
        />
      ) : null}
    </HBox>
  </HBox>
);

const DurationFieldRow = ({
  fieldKey,
  label,
  description,
  duration,
  disabled,
  onValueChange,
  onUnitChange,
}) => {
  const intl = useIntl();
  return (
    <HBox sx={durationCellSx}>
      <HTextField
        label={label}
        value={duration.value}
        onChange={(e) => onValueChange(fieldKey, e.target.value)}
        type="number"
        editable
        disabled={disabled}
        helperText={description}
        sx={durationFieldSx}
        size="small"
        inputProps={{ min: 0, step: 1 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ p: 0, m: 0, height: "100%" }}>
              <HDropdown
                options={TIME_UNITS.map((unit) => ({
                  label: intl.formatMessage({ id: unit.labelKey, defaultMessage: unit.defaultLabel }),
                  value: unit.value,
                }))}
                value={duration.unit}
                onChange={(e) => onUnitChange(fieldKey, e.target.value)}
                disabled={disabled}
                placeholder=""
                width="100%"
                sx={unitSelectSx}
              />
            </InputAdornment>
          ),
        }}
      />
    </HBox>
  );
};

const chunkFields = (fields, size = 2) => {
  const rows = [];
  for (let i = 0; i < fields.length; i += size) {
    rows.push(fields.slice(i, i + size));
  }
  return rows;
};

const renderFieldGrid = (fields, form, isLoading, isSaving, onValueChange, onUnitChange, booleanState, onBooleanChange, textState, onTextChange, selectState, onSelectChange, intl) => (
  <Stack spacing={2} sx={{ width: "100%" }}>
    {chunkFields(fields.filter((field) => !field.showWhenOfflineMaxEnabled || booleanState.offlineSessionMaxLifespanEnabled), 2).map((pair) => {
      const hasBoolean = pair.some((field) => (field.type ?? FIELD_TYPE.DURATION) === FIELD_TYPE.BOOLEAN);
      return (
      <HBox
        key={pair.map((f) => f.key).join("-")}
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: hasBoolean || pair.length === 1 ? "1fr" : "1fr 1fr",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {pair.map((field) => {
          const type = field.type ?? FIELD_TYPE.DURATION;
          if (type === FIELD_TYPE.BOOLEAN) {
            return (
              <HBox key={field.key} sx={{ width: "100%", gridColumn: "1 / -1" }}>
                <BooleanToggleRow
                  label={intl.formatMessage({ id: field.labelKey, defaultMessage: field.defaultLabel })}
                  description={intl.formatMessage({ id: field.descriptionKey, defaultMessage: field.defaultDescription })}
                  checked={Boolean(booleanState[field.key])}
                  disabled={isLoading || isSaving}
                  onChange={(value) => onBooleanChange(field.key, value)}
                />
              </HBox>
            );
          }
          if (type === FIELD_TYPE.TEXT) {
            return (
              <HTextField
                key={field.key}
                label={intl.formatMessage({ id: field.labelKey, defaultMessage: field.defaultLabel })}
                value={textState[field.key] ?? ""}
                onChange={(e) => onTextChange(field.key, e.target.value)}
                disabled={isLoading || isSaving}
                helperText={intl.formatMessage({ id: field.descriptionKey, defaultMessage: field.defaultDescription })}
                sx={textFieldSx}
                size="small"
                fullWidth
              />
            );
          }
          if (type === FIELD_TYPE.SELECT) {
            const dropdownOptions = (field.options ?? []).map((opt) => ({
              label: opt,
              value: opt,
            }));
            return (
              <Box key={field.key}>
                <HDropdown
                  options={dropdownOptions}
                  value={selectState[field.key] ?? ""}
                  onChange={(e) => onSelectChange(field.key, e.target.value)}
                  disabled={isLoading || isSaving}
                  placeholder={intl.formatMessage({ id: field.labelKey, defaultMessage: field.defaultLabel })}
                  width="100%"
                />
                <HLabel
                  value={intl.formatMessage({ id: field.descriptionKey, defaultMessage: field.defaultDescription })}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{ fontFamily: "inherit", fontSize: 11, color: colors.text.light, mt: 0.5 }}
                />
              </Box>
            );
          }
          return (
            <DurationFieldRow
              key={field.key}
              fieldKey={field.key}
              label={intl.formatMessage({ id: field.labelKey, defaultMessage: field.defaultLabel })}
              description={resolveFieldDescription(field, form, intl)}
              duration={form[field.key] ?? emptyDuration()}
              disabled={isLoading || isSaving}
              onValueChange={onValueChange}
              onUnitChange={onUnitChange}
            />
          );
        })}
      </HBox>
      );
    })}
  </Stack>
);

const SessionTokenTimeout = () => {
  const [tab, setTab] = useState(TAB_SESSION);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadedForm, setLoadedForm] = useState(EMPTY_FORM);
  const [booleanState, setBooleanState] = useState({
    revokeRefreshToken: false,
    offlineSessionMaxLifespanEnabled: false,
  });
  const [loadedBooleanState, setLoadedBooleanState] = useState({
    revokeRefreshToken: false,
    offlineSessionMaxLifespanEnabled: false,
  });
  const [textState, setTextState] = useState({ shortVerificationUri: "" });
  const [loadedTextState, setLoadedTextState] = useState({ shortVerificationUri: "" });
  const [selectState, setSelectState] = useState({ defaultSignatureAlgorithm: "RS256" });
  const [loadedSelectState, setLoadedSelectState] = useState({ defaultSignatureAlgorithm: "RS256" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const toast = useToast();
  const intl = useIntl();
  const { colors: themeColors } = useDrsTheme();

  const busy = isLoading || isSaving;

  const loadSettings = useCallback(async () => {
    const loadFallback = intl.formatMessage({
      id: "error.sessionTimeout.load",
      defaultMessage: "Failed to load session and token timeouts.",
    });
    try {
      setIsLoading(true);
      const response = await HAxiosService.GET(UserManagementAPI.fetch_session_token_timeout());
      if (isApiSuccess(response) && response.data) {
        const next = { ...EMPTY_FORM };
        ALL_DURATION_FIELDS.forEach(({ key }) => {
          const duration = response.data[key];
          next[key] = {
            value: duration?.value == null ? "" : String(duration.value),
            unit: duration?.unit ?? DEFAULT_UNIT,
          };
        });
        setForm(next);
        setLoadedForm(next);
        const nextBoolean = {
          revokeRefreshToken: Boolean(response.data.revokeRefreshToken),
          offlineSessionMaxLifespanEnabled: Boolean(response.data.offlineSessionMaxLifespanEnabled),
        };
        setBooleanState(nextBoolean);
        setLoadedBooleanState(nextBoolean);
        const nextText = { shortVerificationUri: response.data.shortVerificationUri ?? "" };
        setTextState(nextText);
        setLoadedTextState(nextText);
        const nextSelect = {
          defaultSignatureAlgorithm: response.data.defaultSignatureAlgorithm ?? "RS256",
        };
        setSelectState(nextSelect);
        setLoadedSelectState(nextSelect);
      } else {
        toast.error(getApiMsg(response, loadFallback));
      }
    } catch (error) {
      toast.error(getApiMsg(error?.response, loadFallback));
    } finally {
      setIsLoading(false);
    }
  }, [toast, intl]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleValueChange = (key, value) => {
    if (value === "") {
      setForm((prev) => ({
        ...prev,
        [key]: { ...prev[key], value: "" },
      }));
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: String(Math.floor(parsed)),
      },
    }));
  };

  const handleUnitChange = (key, unit) => {
    setForm((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        unit,
      },
    }));
  };

  const handleBooleanChange = (key, value) => {
    setBooleanState((prev) => ({ ...prev, [key]: value }));
  };

  const handleTextChange = (key, value) => {
    setTextState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key, value) => {
    setSelectState((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = () => {
    const payload = {};
    if (booleanState.revokeRefreshToken !== loadedBooleanState.revokeRefreshToken) {
      payload.revokeRefreshToken = booleanState.revokeRefreshToken;
    }
    if (booleanState.offlineSessionMaxLifespanEnabled !== loadedBooleanState.offlineSessionMaxLifespanEnabled) {
      payload.offlineSessionMaxLifespanEnabled = booleanState.offlineSessionMaxLifespanEnabled;
    }
    if (selectState.defaultSignatureAlgorithm !== loadedSelectState.defaultSignatureAlgorithm) {
      payload.defaultSignatureAlgorithm = selectState.defaultSignatureAlgorithm;
    }
    if (textState.shortVerificationUri !== loadedTextState.shortVerificationUri) {
      payload.shortVerificationUri = textState.shortVerificationUri;
    }
    ALL_DURATION_FIELDS.forEach(({ key }) => {
      const current = form[key] ?? emptyDuration();
      const loaded = loadedForm[key] ?? emptyDuration();
      const raw = (current.value ?? "").trim();
      const loadedRaw = (loaded.value ?? "").trim();
      if (raw !== loadedRaw || (raw !== "" && current.unit !== loaded.unit)) {
        payload[key] = {
          value: Number(raw),
          unit: current.unit ?? DEFAULT_UNIT,
        };
      }
    });
    return payload;
  };

  const hasChanges = () => {
    const durationChanged = ALL_DURATION_FIELDS.some(({ key }) => {
      const current = form[key] ?? emptyDuration();
      const loaded = loadedForm[key] ?? emptyDuration();
      return (current.value ?? "").trim() !== (loaded.value ?? "").trim()
        || ((current.value ?? "").trim() !== "" && current.unit !== loaded.unit);
    });
    const booleanChanged =
      booleanState.revokeRefreshToken !== loadedBooleanState.revokeRefreshToken
      || booleanState.offlineSessionMaxLifespanEnabled !== loadedBooleanState.offlineSessionMaxLifespanEnabled;
    const textChanged = textState.shortVerificationUri !== loadedTextState.shortVerificationUri;
    const selectChanged =
      selectState.defaultSignatureAlgorithm !== loadedSelectState.defaultSignatureAlgorithm;
    return durationChanged || booleanChanged || textChanged || selectChanged;
  };

  const handleSave = async () => {
    const payload = buildPayload();
    if (!hasChanges()) {
      toast.error(intl.formatMessage({ id: "error.sessionTimeout.noChanges", defaultMessage: "Change at least one setting before saving." }));
      return;
    }
    const saveFallback = intl.formatMessage({
      id: "error.sessionTimeout.save",
      defaultMessage: "Failed to update session and token timeouts.",
    });
    const saveSuccess = intl.formatMessage({
      id: "success.sessionTimeout.save",
      defaultMessage: "Session and token timeouts updated successfully.",
    });
    try {
      setIsSaving(true);
      const response = await HAxiosService.PUT(
        UserManagementAPI.update_session_token_timeout(),
        payload
      );
      if (isApiSuccess(response)) {
        // Keep current form as the saved baseline (avoids remount/reload races after PUT).
        setLoadedForm(form);
        setLoadedBooleanState(booleanState);
        setLoadedTextState(textState);
        setLoadedSelectState(selectState);
        toast.success(String(getApiMsg(response, saveSuccess)));
      } else {
        toast.error(String(getApiMsg(response, saveFallback)));
      }
    } catch (error) {
      toast.error(String(getApiMsg(error?.response, saveFallback)));
    } finally {
      setIsSaving(false);
    }
  };

  const renderFieldGroups = (groups) => (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      {groups.map((group) => (
        <IdmFormSection
          key={group.titleKey}
          title={intl.formatMessage({ id: group.titleKey, defaultMessage: group.defaultTitle })}
          description={intl.formatMessage({ id: group.descriptionKey, defaultMessage: group.defaultDescription })}
        >
          {group.showOfflineMaxToggle && (
            <BooleanToggleRow
              label={intl.formatMessage({ id: "label.sessionTimeout.offlineMaxLimited", defaultMessage: "Offline Session Max Limited" })}
              description={intl.formatMessage({ id: "label.sessionTimeout.offlineMaxLimited.desc", defaultMessage: "When enabled, Offline Session Max limits offline session lifetime. When disabled, offline sessions do not expire by maximum lifetime." })}
              checked={booleanState.offlineSessionMaxLifespanEnabled}
              disabled={isLoading || isSaving}
              onChange={(value) => handleBooleanChange("offlineSessionMaxLifespanEnabled", value)}
            />
          )}
          {renderFieldGrid(
            group.fields,
            form,
            isLoading,
            isSaving,
            handleValueChange,
            handleUnitChange,
            booleanState,
            handleBooleanChange,
            textState,
            handleTextChange,
            selectState,
            handleSelectChange,
            intl
          )}
        </IdmFormSection>
      ))}
    </Stack>
  );

  return (
    <div>
      <HBox
        sx={{
          boxSizing: "border-box",
          flexDirection: "column",
          alignItems: "stretch",
          mt: 2,
        }}
      >
            <HPaper
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* ── Breadcrumb & TitleBar Header ── */}
              <HBox
                sx={{
                  px: 2.5,
                  py: 1,
                  display: "flex",
                  flexShrink: 0,
                  flexDirection: "column",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <HBreadCrumb />
                <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <TitleBar
                    title={intl.formatMessage({
                      id: "label.sessionTimeout.title",
                      defaultMessage: "Session & Token Settings",
                    })}
                  />
                </HBox>
              </HBox>

              {busy && (
                <LinearProgress
                  sx={{
                    height: 4,
                    bgcolor: withAlpha(themeColors.primary, 0.1),
                    "& .MuiLinearProgress-bar": {
                      backgroundSize: "200% auto",
                      borderRadius: 1,
                    },
                  }}
                />
              )}

              <HTabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                TabIndicatorProps={{ sx: { display: "none" } }}
                sx={{
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.25,
                  borderBottom: `1px solid ${colors.border}`,
                  minHeight: 52,
                  gap: 0.75,
                  "& .MuiTabs-flexContainer": { gap: 0.75 },
                  "& .MuiTab-root": {
                    fontFamily: "inherit",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: { xs: "0.78rem", sm: "0.84rem" },
                    minHeight: 40,
                    py: 0.75,
                    px: 1.75,
                    color: colors.text.primary,
                    borderRadius: 99,
                    border: "1px solid transparent",
                    "&:hover": {
                      background: "var(--drs-button-outline-bg, transparent)",
                      borderColor: "var(--drs-control-hover-border, currentColor)",
                    },
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: colors.text.primary,
                    background: "var(--drs-button-primary-bg, transparent)",
                    fontWeight: 800,
                    borderColor: "transparent",
                    boxShadow: `0 4px 16px ${withAlpha(themeColors.primary, 0.35)}`,
                  },
                  "& .MuiTab-iconWrapper": {
                    opacity: 0.95,
                  },
                }}
              >
                <HTab
                  icon={<HistoryToggleOffOutlinedIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={intl.formatMessage({ id: "label.sessionTimeout.tab.sessions", defaultMessage: "Sessions" })}
                />
                <HTab
                  icon={<VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label={intl.formatMessage({ id: "label.sessionTimeout.tab.tokens", defaultMessage: "Tokens" })}
                />
              </HTabs>

              <HBox
                sx={{
                  p: { xs: 2, sm: 3 },
                  flex: 1,
                  width: "100%",
                  boxSizing: "border-box",
                  flexDirection: "column",
                  alignItems: "stretch",
                  background: "transparent",
                }}
              >
                {isLoading ? (
                  <HBox sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                    <CircularProgress size={36} sx={{ color: themeColors.primary }} />
                  </HBox>
                ) : (
                  <>
                    <IdmTabPanel active={tab === TAB_SESSION}>
                      <Stack spacing={3} sx={{ width: "100%", height: "100%" }}>
                        <IdmPanel
                          overline={intl.formatMessage({ id: "label.sessionTimeout.tab.sessions", defaultMessage: "Sessions" })}
                          title={intl.formatMessage({ id: "label.sessionTimeout.tab.sessions", defaultMessage: "Sessions" })}
                          accent="secondary"
                          description={intl.formatMessage({ id: "label.sessionTimeout.group.ssoSession.desc", defaultMessage: "Configure sign-in session duration, idle timeouts, offline access, and login step limits." })}
                        >
                          {renderFieldGroups(SESSION_FIELD_GROUPS)}
                        </IdmPanel>
                      </Stack>
                    </IdmTabPanel>

                    <IdmTabPanel active={tab === TAB_TOKEN}>
                      <Stack spacing={3} sx={{ width: "100%" }}>
                        <IdmPanel
                          overline={intl.formatMessage({ id: "label.sessionTimeout.tab.tokens", defaultMessage: "Tokens" })}
                          title={intl.formatMessage({ id: "label.sessionTimeout.tab.tokens", defaultMessage: "Tokens" })}
                          accent="primary"
                          description={intl.formatMessage({ id: "label.sessionTimeout.group.accessTokens.desc", defaultMessage: "Configure token signing, refresh behavior, access-token duration, and one-time action link expiry." })}
                        >
                          {renderFieldGroups(TOKEN_FIELD_GROUPS)}
                        </IdmPanel>
                      </Stack>
                    </IdmTabPanel>
                  </>
                )}
              </HBox>

              <HBox
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <HButton
                  variant="outlined"
                  onClick={loadSettings}
                  disabled={busy}
                  label="label.sessionTimeout.btn.refresh"
                />
                <HButton
                  variant="contained"
                  onClick={handleSave}
                  disabled={busy}
                  loading={isSaving}
                  label="label.sessionTimeout.btn.save"
                />
              </HBox>
            </HPaper>
      </HBox>
    </div>
  );
};

export default SessionTokenTimeout;
