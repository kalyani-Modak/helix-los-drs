import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import GppGoodIcon from "@mui/icons-material/GppGood";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useIntl } from "react-intl";
import { HAxiosService, HBox, HButton, HPaper, HDropdown, HLabel, HTextField, HBreadCrumb, TitleBar, HTabs, HTab, useDrsTheme, useToast, withAlpha } from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";

const TAB_HEADERS = 0;
const TAB_BRUTE_FORCE = 1;

const BRUTE_FORCE_MODE = {
  DISABLED: "DISABLED",
  LOCKOUT_PERMANENTLY: "LOCKOUT_PERMANENTLY",
  LOCKOUT_TEMPORARILY: "LOCKOUT_TEMPORARILY",
  LOCKOUT_PERMANENTLY_AND_TEMPORARILY: "LOCKOUT_PERMANENTLY_AND_TEMPORARILY",
};

const WAIT_TIME_STRATEGY = {
  MULTIPLE: "MULTIPLE",
  LINEAR: "LINEAR",
};

const DURATION_UNITS = {
  SECONDS: "SECONDS",
  MINUTES: "MINUTES",
  HOURS: "HOURS",
  DAYS: "DAYS",
};

const DEFAULT_HEADERS = {
  contentSecurityPolicyReportOnly: "",
  referrerPolicy: "",
  contentSecurityPolicy: "",
  strictTransportSecurity: "",
  xframeOptions: "",
  xrobotsTag: "",
  xxssprotection: "",
  xcontentTypeOptions: "",
};

const DEFAULT_BRUTE_FORCE = {
  bruteForceProtected: false,
  permanentLockout: false,
  maxFailureWaitSeconds: 0,
  waitIncrementSeconds: 0,
  quickLoginCheckMilliSeconds: 0,
  minimumQuickLoginWaitSeconds: 0,
  maxDeltaTimeSeconds: 0,
  failureFactor: 0,
  maxTemporaryLockouts: 0,
};

const toNumberOrZero = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return parsed;
};

const deriveBruteForceMode = (form) => {
  if (!form?.bruteForceProtected) {
    return BRUTE_FORCE_MODE.DISABLED;
  }

  if (form?.permanentLockout && Number(form?.maxTemporaryLockouts) > 0) {
    return BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY_AND_TEMPORARILY;
  }

  if (form?.permanentLockout) {
    return BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY;
  }

  return BRUTE_FORCE_MODE.LOCKOUT_TEMPORARILY;
};

const getVisibleBruteForceFields = (mode) => {
  switch (mode) {
    case BRUTE_FORCE_MODE.DISABLED:
      return [];
    case BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY:
      return [
        "failureFactor",
        "quickLoginCheckMilliSeconds",
        "minimumQuickLoginWaitSeconds",
      ];
    case BRUTE_FORCE_MODE.LOCKOUT_TEMPORARILY:
      return [
        "failureFactor",
        "strategy",
        "waitIncrementSeconds",
        "maxFailureWaitSeconds",
        "maxDeltaTimeSeconds",
        "quickLoginCheckMilliSeconds",
        "minimumQuickLoginWaitSeconds",
      ];
    case BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY_AND_TEMPORARILY:
      return [
        "failureFactor",
        "maxTemporaryLockouts",
        "strategy",
        "waitIncrementSeconds",
        "maxFailureWaitSeconds",
        "maxDeltaTimeSeconds",
        "quickLoginCheckMilliSeconds",
        "minimumQuickLoginWaitSeconds",
      ];
    default:
      return [];
  }
};

const HEADER_FIELDS = [
  {
    key: "xframeOptions",
    labelKey: "label.securityDefences.headers.xframeOptions",
    labelDefault: "X-Frame-Options",
  },
  {
    key: "contentSecurityPolicy",
    labelKey: "label.securityDefences.headers.contentSecurityPolicy",
    labelDefault: "Content-Security-Policy",
  },
  {
    key: "contentSecurityPolicyReportOnly",
    labelKey: "label.securityDefences.headers.contentSecurityPolicyReportOnly",
    labelDefault: "Content-Security-Policy-Report-Only",
  },
  {
    key: "xcontentTypeOptions",
    labelKey: "label.securityDefences.headers.xcontentTypeOptions",
    labelDefault: "X-Content-Type-Options",
  },
  {
    key: "xrobotsTag",
    labelKey: "label.securityDefences.headers.xrobotsTag",
    labelDefault: "X-Robots-Tag",
  },
  {
    key: "xxssprotection",
    labelKey: "label.securityDefences.headers.xxssprotection",
    labelDefault: "X-XSS-Protection",
  },
  {
    key: "strictTransportSecurity",
    labelKey: "label.securityDefences.headers.strictTransportSecurity",
    labelDefault: "Strict-Transport-Security",
  },
  {
    key: "referrerPolicy",
    labelKey: "label.securityDefences.headers.referrerPolicy",
    labelDefault: "Referrer-Policy",
  },
];

const BRUTE_FORCE_FIELDS = {
  failureFactor: {
    labelKey: "label.securityDefences.bruteForce.failureFactor",
    labelDefault: "Max Login Failures",
  },
  waitIncrementSeconds: {
    labelKey: "label.securityDefences.bruteForce.waitIncrementSeconds",
    labelDefault: "Wait Increment",
  },
  quickLoginCheckMilliSeconds: {
    labelKey: "label.securityDefences.bruteForce.quickLoginCheckMilliSeconds",
    labelDefault: "Quick Login Check Milli Seconds",
  },
  minimumQuickLoginWaitSeconds: {
    labelKey: "label.securityDefences.bruteForce.minimumQuickLoginWaitSeconds",
    labelDefault: "Minimum Quick Login Wait",
  },
  maxFailureWaitSeconds: {
    labelKey: "label.securityDefences.bruteForce.maxFailureWaitSeconds",
    labelDefault: "Max Wait",
  },
  maxDeltaTimeSeconds: {
    labelKey: "label.securityDefences.bruteForce.maxDeltaTimeSeconds",
    labelDefault: "Failure Reset Time",
  },
  maxTemporaryLockouts: {
    labelKey: "label.securityDefences.bruteForce.maxTemporaryLockouts",
    labelDefault: "Max Temporary Lockouts",
  },
  strategy: {
    labelKey: "label.securityDefences.bruteForce.strategy",
    labelDefault: "Strategy to increase wait time",
  },
};

const BRUTE_FORCE_DISPLAY_ORDER = [
  "failureFactor",
  "maxTemporaryLockouts",
  "strategy",
  "waitIncrementSeconds",
  "maxFailureWaitSeconds",
  "maxDeltaTimeSeconds",
  "quickLoginCheckMilliSeconds",
  "minimumQuickLoginWaitSeconds",
];

const PLUS_MINUS_FIELDS = new Set([
  "failureFactor",
  "quickLoginCheckMilliSeconds",
  "maxTemporaryLockouts",
]);

const DURATION_FIELDS = new Set([
  "waitIncrementSeconds",
  "maxFailureWaitSeconds",
  "maxDeltaTimeSeconds",
  "minimumQuickLoginWaitSeconds",
]);

const getDurationUnitOptions = (fieldKey, t) => {
  if (fieldKey === "waitIncrementSeconds") {
    return [
      { label: t("label.securityDefences.unit.minutes", "Minutes"), value: DURATION_UNITS.MINUTES },
      { label: t("label.securityDefences.unit.seconds", "Seconds"), value: DURATION_UNITS.SECONDS },
      { label: t("label.securityDefences.unit.hours", "Hours"), value: DURATION_UNITS.HOURS },
      { label: t("label.securityDefences.unit.days", "Days"), value: DURATION_UNITS.DAYS },
    ];
  }

  if (fieldKey === "maxFailureWaitSeconds") {
    return [
      { label: t("label.securityDefences.unit.seconds", "Seconds"), value: DURATION_UNITS.SECONDS },
      { label: t("label.securityDefences.unit.minutes", "Minutes"), value: DURATION_UNITS.MINUTES },
      { label: t("label.securityDefences.unit.hours", "Hours"), value: DURATION_UNITS.HOURS },
      { label: t("label.securityDefences.unit.days", "Days"), value: DURATION_UNITS.DAYS },
    ];
  }

  if (fieldKey === "maxDeltaTimeSeconds") {
    return [
      { label: t("label.securityDefences.unit.hours", "Hours"), value: DURATION_UNITS.HOURS },
      { label: t("label.securityDefences.unit.minutes", "Minutes"), value: DURATION_UNITS.MINUTES },
      { label: t("label.securityDefences.unit.seconds", "Seconds"), value: DURATION_UNITS.SECONDS },
      { label: t("label.securityDefences.unit.days", "Days"), value: DURATION_UNITS.DAYS },
    ];
  }

  return [
    { label: t("label.securityDefences.unit.seconds", "Seconds"), value: DURATION_UNITS.SECONDS },
    { label: t("label.securityDefences.unit.minutes", "Minutes"), value: DURATION_UNITS.MINUTES },
    { label: t("label.securityDefences.unit.hours", "Hours"), value: DURATION_UNITS.HOURS },
    { label: t("label.securityDefences.unit.days", "Days"), value: DURATION_UNITS.DAYS },
  ];
};

const toSeconds = (value, unit) => {
  const parsed = toNumberOrZero(value);
  if (unit === DURATION_UNITS.DAYS) return parsed * 86400;
  if (unit === DURATION_UNITS.MINUTES) return parsed * 60;
  if (unit === DURATION_UNITS.HOURS) return parsed * 3600;
  return parsed;
};

const fromSeconds = (value, unit) => {
  const parsed = toNumberOrZero(value);
  if (unit === DURATION_UNITS.DAYS) return Math.floor(parsed / 86400);
  if (unit === DURATION_UNITS.MINUTES) return Math.floor(parsed / 60);
  if (unit === DURATION_UNITS.HOURS) return Math.floor(parsed / 3600);
  return parsed;
};

const pickInitialDuration = (valueInSeconds, preferredUnit) => {
  if (preferredUnit === DURATION_UNITS.DAYS && valueInSeconds % 86400 === 0) {
    return { value: String(fromSeconds(valueInSeconds, DURATION_UNITS.DAYS)), unit: DURATION_UNITS.DAYS };
  }
  if (preferredUnit === DURATION_UNITS.MINUTES && valueInSeconds % 60 === 0) {
    return { value: String(fromSeconds(valueInSeconds, DURATION_UNITS.MINUTES)), unit: DURATION_UNITS.MINUTES };
  }
  if (preferredUnit === DURATION_UNITS.HOURS && valueInSeconds % 3600 === 0) {
    return { value: String(fromSeconds(valueInSeconds, DURATION_UNITS.HOURS)), unit: DURATION_UNITS.HOURS };
  }
  return { value: String(toNumberOrZero(valueInSeconds)), unit: DURATION_UNITS.SECONDS };
};

const SecurityDefences = () => {
  const intl = useIntl();
  const toast = useToast();
  const { surfaces, text, border, colors } = useDrsTheme();

  const [tab, setTab] = useState(TAB_HEADERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [headersForm, setHeadersForm] = useState(DEFAULT_HEADERS);
  const [loadedHeadersForm, setLoadedHeadersForm] = useState(DEFAULT_HEADERS);

  const [bruteForceForm, setBruteForceForm] = useState(DEFAULT_BRUTE_FORCE);
  const [loadedBruteForceForm, setLoadedBruteForceForm] = useState(DEFAULT_BRUTE_FORCE);
  const [bruteForceMode, setBruteForceMode] = useState(BRUTE_FORCE_MODE.DISABLED);
  const [waitTimeStrategy, setWaitTimeStrategy] = useState(WAIT_TIME_STRATEGY.MULTIPLE);
  const [durationFields, setDurationFields] = useState({
    waitIncrementSeconds: { value: "", unit: DURATION_UNITS.MINUTES },
    maxFailureWaitSeconds: { value: "", unit: DURATION_UNITS.SECONDS },
    maxDeltaTimeSeconds: { value: "", unit: DURATION_UNITS.HOURS },
    minimumQuickLoginWaitSeconds: { value: "", unit: DURATION_UNITS.SECONDS },
  });
  const visibleBruteForceFields = useMemo(() => getVisibleBruteForceFields(bruteForceMode), [bruteForceMode]);

  const t = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [headersResponse, bruteForceResponse] = await Promise.all([
        HAxiosService.GET(UserManagementAPI.fetch_security_defence_headers()),
        HAxiosService.GET(UserManagementAPI.fetch_brute_force_detection()),
      ]);

      const headersData = headersResponse?.data || {};
      const bruteData = bruteForceResponse?.data || {};

      const nextHeaders = {
        ...DEFAULT_HEADERS,
        ...headersData,
      };
      const nextBruteForce = {
        ...DEFAULT_BRUTE_FORCE,
        ...bruteData,
      };

      setHeadersForm(nextHeaders);
      setLoadedHeadersForm(nextHeaders);
      setBruteForceForm(nextBruteForce);
      setLoadedBruteForceForm(nextBruteForce);
      setBruteForceMode(deriveBruteForceMode(nextBruteForce));
      setWaitTimeStrategy(nextBruteForce.bruteForceStrategy || WAIT_TIME_STRATEGY.MULTIPLE);
      setDurationFields({
        waitIncrementSeconds: pickInitialDuration(nextBruteForce.waitIncrementSeconds, DURATION_UNITS.MINUTES),
        maxFailureWaitSeconds: pickInitialDuration(nextBruteForce.maxFailureWaitSeconds, DURATION_UNITS.SECONDS),
        maxDeltaTimeSeconds: pickInitialDuration(nextBruteForce.maxDeltaTimeSeconds, DURATION_UNITS.HOURS),
        minimumQuickLoginWaitSeconds: pickInitialDuration(nextBruteForce.minimumQuickLoginWaitSeconds, DURATION_UNITS.SECONDS),
      });
    } catch (error) {
      console.error("Failed to load security defence settings", error);
      toast.error(t("error.securityDefences.load", "Failed to load security defence settings."));
    } finally {
      setLoading(false);
    }
  }, [toast, intl]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const hasHeaderChanges = useMemo(
    () => JSON.stringify(headersForm) !== JSON.stringify(loadedHeadersForm),
    [headersForm, loadedHeadersForm]
  );

  const hasBruteForceChanges = useMemo(
    () => {
      const normalizedCurrent = {
        ...bruteForceForm,
        bruteForceStrategy: waitTimeStrategy,
        waitIncrementSeconds: toSeconds(durationFields.waitIncrementSeconds.value, durationFields.waitIncrementSeconds.unit),
        maxFailureWaitSeconds: toSeconds(durationFields.maxFailureWaitSeconds.value, durationFields.maxFailureWaitSeconds.unit),
        maxDeltaTimeSeconds: toSeconds(durationFields.maxDeltaTimeSeconds.value, durationFields.maxDeltaTimeSeconds.unit),
        minimumQuickLoginWaitSeconds: toSeconds(durationFields.minimumQuickLoginWaitSeconds.value, durationFields.minimumQuickLoginWaitSeconds.unit),
      };
      return JSON.stringify(normalizedCurrent) !== JSON.stringify(loadedBruteForceForm);
    },
    [bruteForceForm, loadedBruteForceForm, durationFields, waitTimeStrategy]
  );

  const handleHeadersTextChange = (field, value) => {
    setHeadersForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBruteForceNumberChange = (field, value) => {
    if (value === "") {
      setBruteForceForm((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    if (!/^\d+$/.test(value)) {
      return;
    }
    setBruteForceForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBruteForceModeChange = (modeValue) => {
    setBruteForceMode(modeValue);
    setBruteForceForm((prev) => {
      const next = { ...prev };
      if (modeValue === BRUTE_FORCE_MODE.DISABLED) {
        next.bruteForceProtected = false;
        next.permanentLockout = false;
        next.maxTemporaryLockouts = 0;
      } else if (modeValue === BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY) {
        next.bruteForceProtected = true;
        next.permanentLockout = true;
        next.maxTemporaryLockouts = 0;
      } else if (modeValue === BRUTE_FORCE_MODE.LOCKOUT_TEMPORARILY) {
        next.bruteForceProtected = true;
        next.permanentLockout = false;
        next.maxTemporaryLockouts = 0;
      } else {
        next.bruteForceProtected = true;
        next.permanentLockout = true;
        const currentTemporaryLockouts = Number(next.maxTemporaryLockouts);
        if (currentTemporaryLockouts > 0) {
          next.maxTemporaryLockouts = currentTemporaryLockouts;
        } else {
          next.maxTemporaryLockouts = 3;
        }
      }
      return next;
    });
  };

  const handleDurationFieldValueChange = (field, value) => {
    if (value !== "" && !/^\d+$/.test(value)) {
      return;
    }
    setDurationFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
      },
    }));
  };

  const handleDurationFieldUnitChange = (field, unit) => {
    setDurationFields((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        unit,
      },
    }));
  };

  const handlePlusMinusFieldStep = (field, delta) => {
    setBruteForceForm((prev) => {
      const nextValue = Math.max(0, toNumberOrZero(prev[field]) + delta);
      return {
        ...prev,
        [field]: nextValue,
      };
    });
  };

  const handleDurationFieldStep = (field, delta) => {
    setDurationFields((prev) => {
      const current = toNumberOrZero(prev[field].value);
      const nextValue = Math.max(0, current + delta);
      return {
        ...prev,
        [field]: {
          ...prev[field],
          value: String(nextValue),
        },
      };
    });
  };

  const buildBruteForcePayload = () => ({
    ...bruteForceForm,
    bruteForceStrategy: waitTimeStrategy,
    maxFailureWaitSeconds: toSeconds(durationFields.maxFailureWaitSeconds.value, durationFields.maxFailureWaitSeconds.unit),
    waitIncrementSeconds: toSeconds(durationFields.waitIncrementSeconds.value, durationFields.waitIncrementSeconds.unit),
    quickLoginCheckMilliSeconds: toNumberOrZero(bruteForceForm.quickLoginCheckMilliSeconds),
    minimumQuickLoginWaitSeconds: toSeconds(durationFields.minimumQuickLoginWaitSeconds.value, durationFields.minimumQuickLoginWaitSeconds.unit),
    maxDeltaTimeSeconds: toSeconds(durationFields.maxDeltaTimeSeconds.value, durationFields.maxDeltaTimeSeconds.unit),
    failureFactor: toNumberOrZero(bruteForceForm.failureFactor),
    maxTemporaryLockouts: toNumberOrZero(bruteForceForm.maxTemporaryLockouts),
  });

  const handleSaveHeaders = async () => {
    if (!hasHeaderChanges) {
      toast.error(t("error.securityDefences.noChanges", "Change at least one setting before saving."));
      return;
    }

    setSaving(true);
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.update_security_defence_headers(),
        headersForm
      );

      if (response?.status >= 200 && response?.status < 300) {
        const successMsg = response?.data?.msg || t("success.securityDefences.headers", "Security Headers Updated Successfully!!");
        toast.success(successMsg);
        const normalized = { ...DEFAULT_HEADERS, ...headersForm };
        setLoadedHeadersForm(normalized);
      } else {
        toast.error(t("error.securityDefences.headers", "Failed to update security headers."));
      }
    } catch (error) {
      console.error("Failed to save headers", error);
      toast.error(t("error.securityDefences.headers", "Failed to update security headers."));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBruteForce = async () => {
    if (!hasBruteForceChanges) {
      toast.error(t("error.securityDefences.noChanges", "Change at least one setting before saving."));
      return;
    }

    const payload = buildBruteForcePayload();

    setSaving(true);
    try {
      const response = await HAxiosService.PUT(
        UserManagementAPI.update_brute_force_detection(),
        payload
      );

      if (response?.status >= 200 && response?.status < 300) {
        const successMsg = response?.data?.msg || t("success.securityDefences.bruteForce", "Brute Force Detection Updated Successfully!!");
        toast.success(successMsg);
        const normalized = { ...DEFAULT_BRUTE_FORCE, ...payload };
        setBruteForceForm(normalized);
        setLoadedBruteForceForm(normalized);
        setWaitTimeStrategy(normalized.bruteForceStrategy || WAIT_TIME_STRATEGY.MULTIPLE);
        setDurationFields({
          waitIncrementSeconds: pickInitialDuration(normalized.waitIncrementSeconds, DURATION_UNITS.MINUTES),
          maxFailureWaitSeconds: pickInitialDuration(normalized.maxFailureWaitSeconds, DURATION_UNITS.SECONDS),
          maxDeltaTimeSeconds: pickInitialDuration(normalized.maxDeltaTimeSeconds, DURATION_UNITS.HOURS),
          minimumQuickLoginWaitSeconds: pickInitialDuration(normalized.minimumQuickLoginWaitSeconds, DURATION_UNITS.SECONDS),
        });
      } else {
        toast.error(t("error.securityDefences.bruteForce", "Failed to update brute force detection settings."));
      }
    } catch (error) {
      console.error("Failed to save brute force detection", error);
      toast.error(t("error.securityDefences.bruteForce", "Failed to update brute force detection settings."));
    } finally {
      setSaving(false);
    }
  };

  const renderHeadersSection = () => (
    <Stack spacing={2.25} sx={{ width: "100%" }}>
      <HPaper elevation={0} sx={{ width: "100%", backdropFilter: "blur(12px)", overflow: "hidden" }}>
        <HBox sx={{ position: "relative", overflow: "hidden", flexDirection: "column" }}>
          <HLabel
            value={t("label.securityDefences.headers.title", "Security Headers")}
            translate={false}
            colon={false}
            align="left"
            sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.22rem" }, color: text.primary }}
          />
        </HBox>
        <HBox sx={{ py: 2 }}>
          <HBox
            sx={{
              width: "100%",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: "10px",
              border: `1px solid ${border.divider}`,
              bgcolor: surfaces.paper,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflow: "hidden",
            }}
          >
            <HBox sx={{ flexDirection: "column", gap: 0.5, background: "transparent" }}>
              <HLabel
                value={t("label.securityDefences.headers.formTitle", "Header Configuration")}
                translate={false}
                colon={false}
                align="left"
                sx={{ display: "block", color: text.primary, fontWeight: 700, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              />
            </HBox>
            <HBox sx={{ flexDirection: "column", width: "100%", background: "transparent" }}>
          <Stack spacing={2.5} sx={{ width: "100%" }}>
            <Box
              sx={{
                border: `1px solid ${withAlpha(colors.primary, 0.14)}`,
                borderRadius: 2,
                p: { xs: 2, sm: 2.75 },
                background: `linear-gradient(180deg, ${withAlpha(colors.primary, 0.05)} 0%, transparent 100%)`,
              }}
            >
              <HLabel
                value={t("label.securityDefences.headers.browserSecurity", "Browser Security Headers")}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  mb: 1.5,
                }}
              />
              <HBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  columnGap: { xs: 2, sm: 2.75 },
                  rowGap: { xs: 2, sm: 2.5 },
                  alignItems: "start",
                  width: "100%",
                }}
              >
                {HEADER_FIELDS.filter((field) =>
                  [
                    "xframeOptions",
                    "xcontentTypeOptions",
                    "xrobotsTag",
                    "xxssprotection",
                    "strictTransportSecurity",
                    "referrerPolicy",
                  ].includes(field.key)
                ).map((field) => (
                  <Box key={field.key}>
                    <HTextField
                      label={t(field.labelKey, field.labelDefault)}
                      value={headersForm[field.key]}
                      onChange={(e) => handleHeadersTextChange(field.key, e.target.value)}
                      editable
                      size="small"
                      fullWidth
                    />
                  </Box>
                ))}
              </HBox>
            </Box>

            <Box
              sx={{
                border: `1px solid ${withAlpha(colors.accent, 0.16)}`,
                borderRadius: 2,
                p: { xs: 2, sm: 2.75 },
                background: `linear-gradient(180deg, ${withAlpha(colors.accent, 0.04)} 0%, transparent 100%)`,
              }}
            >
              <HLabel
                value={t("label.securityDefences.headers.csp", "Content Security Policy")}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  mb: 1.5,
                }}
              />
              <HBox sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: { xs: 2, sm: 2.5 }, width: "100%" }}>
                {HEADER_FIELDS.filter((field) =>
                  ["contentSecurityPolicy", "contentSecurityPolicyReportOnly"].includes(field.key)
                ).map((field) => (
                  <Box key={field.key}>
                    <HTextField
                      label={t(field.labelKey, field.labelDefault)}
                      value={headersForm[field.key]}
                      onChange={(e) => handleHeadersTextChange(field.key, e.target.value)}
                      editable
                      size="small"
                      fullWidth
                    />
                  </Box>
                ))}
              </HBox>
            </Box>
          </Stack>
            </HBox>
          </HBox>
        </HBox>
      </HPaper>
    </Stack>
  );

  const renderBruteForceSection = () => (
    <Stack spacing={2.25} sx={{ width: "100%" }}>
      <HPaper elevation={0} sx={{ width: "100%", backdropFilter: "blur(12px)", overflow: "hidden" }}>
        <HBox sx={{ position: "relative", overflow: "hidden", flexDirection: "column" }}>
          <HLabel
            value={t("label.securityDefences.bruteForce.title", "Brute Force Detection")}
            translate={false}
            colon={false}
            align="left"
            sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.22rem" }, color: text.primary }}
          />
        </HBox>
        <HBox sx={{ py: 2 }}>
          <HBox
            sx={{
              width: "100%",
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: "10px",
              border: `1px solid ${border.divider}`,
              bgcolor: surfaces.paper,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              overflow: "hidden",
            }}
          >
            <HBox sx={{ flexDirection: "column", gap: 0.5, background: "transparent" }}>
              <HLabel
                value={t("label.securityDefences.bruteForce.formTitle", "Brute Force Policy")}
                translate={false}
                colon={false}
                align="left"
                sx={{ display: "block", color: text.primary, fontWeight: 700, fontSize: { xs: "0.9rem", sm: "1rem" } }}
              />
            </HBox>
            <HBox sx={{ flexDirection: "column", width: "100%", background: "transparent" }}>
          <Box
            sx={{
              p: { xs: 2, sm: 2.75 },
              borderRadius: 2,
              border: `1px solid ${withAlpha(colors.primary, 0.2)}`,
              background: `linear-gradient(130deg, ${withAlpha(colors.primary, 0.08)} 0%, ${withAlpha(colors.accent, 0.06)} 100%)`,
              mb: 2.75,
            }}
          >
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <GppGoodIcon sx={{ color: colors.primary, fontSize: 18 }} />
              <HLabel
                value={t("label.securityDefences.bruteForce.mode", "Brute Force Mode")}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontWeight: 700,
                  color: text.primary,
                }}
              />
            </HBox>

            <Box sx={{ width: { xs: "100%", sm: 420 }, maxWidth: "100%" }}>
              <HDropdown
                options={[
                {
                  label: t("label.securityDefences.bruteForce.mode.disabled", "Disabled"),
                  value: BRUTE_FORCE_MODE.DISABLED,
                },
                {
                  label: t("label.securityDefences.bruteForce.mode.lockoutPermanently", "Lockout Permanently"),
                  value: BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY,
                },
                {
                  label: t("label.securityDefences.bruteForce.mode.lockoutTemporarily", "Lockout Temporarily"),
                  value: BRUTE_FORCE_MODE.LOCKOUT_TEMPORARILY,
                },
                {
                  label: t(
                    "label.securityDefences.bruteForce.mode.lockoutPermanentlyAndTemporary",
                    "Lockout Permanently after Temporary Lockout"
                  ),
                  value: BRUTE_FORCE_MODE.LOCKOUT_PERMANENTLY_AND_TEMPORARILY,
                },
                ]}
                value={bruteForceMode}
                onChange={(e) => handleBruteForceModeChange(e.target.value)}
                disabled={saving || loading}
                width="100%"
              />
            </Box>

          </Box>

          {visibleBruteForceFields.length > 0 && (
            <Box
              sx={{
                border: `1px solid ${withAlpha(colors.primary, 0.14)}`,
                borderRadius: 2,
                p: { xs: 2, sm: 2.75 },
                background: `linear-gradient(180deg, ${withAlpha(colors.primary, 0.05)} 0%, transparent 100%)`,
              }}
            >
              <HBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(290px, 1fr))" },
                  columnGap: { xs: 2, sm: 2.75 },
                  rowGap: { xs: 2, sm: 2.6 },
                  alignItems: "start",
                  width: "100%",
                }}
              >
                {BRUTE_FORCE_DISPLAY_ORDER.filter((fieldKey) =>
                  visibleBruteForceFields.includes(fieldKey)
                ).map((fieldKey) => {
                  const fieldMeta = BRUTE_FORCE_FIELDS[fieldKey];

                  if (fieldKey === "strategy") {
                    return (
                      <Box key={fieldKey} sx={{ width: "100%" }}>
                        <HLabel
                          value={t(fieldMeta.labelKey, fieldMeta.labelDefault)}
                          translate={false}
                          colon={false}
                          align="left"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            mb: 0.75,
                          }}
                        />
                        <HDropdown
                          options={[
                            {
                              label: t("label.securityDefences.bruteForce.strategy.multiple", "Multiple"),
                              value: WAIT_TIME_STRATEGY.MULTIPLE,
                            },
                            {
                              label: t("label.securityDefences.bruteForce.strategy.linear", "Linear"),
                              value: WAIT_TIME_STRATEGY.LINEAR,
                            },
                          ]}
                          value={waitTimeStrategy}
                          onChange={(e) => setWaitTimeStrategy(e.target.value)}
                          disabled={saving || loading}
                          width="100%"
                        />
                      </Box>
                    );
                  }

                  if (
                    DURATION_FIELDS.has(fieldKey)
                  ) {
                    const unitOptions = getDurationUnitOptions(fieldKey, t);

                    return (
                      <Box key={fieldKey} sx={{ width: "100%" }}>
                        <HLabel
                          value={t(fieldMeta.labelKey, fieldMeta.labelDefault)}
                          translate={false}
                          colon={false}
                          align="left"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            mb: 0.75,
                          }}
                        />
                        <HBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "minmax(118px, 150px) minmax(132px, 164px)",
                            gap: 1,
                            alignItems: "end",
                            justifyContent: "start",
                          }}
                        >
                          <HBox sx={{ display: "grid", gridTemplateColumns: "minmax(88px, 116px) 30px", gap: 0.65, alignItems: "stretch" }}>
                            <HTextField
                              value={String(durationFields[fieldKey].value ?? "")}
                              onChange={(e) => handleDurationFieldValueChange(fieldKey, e.target.value)}
                              editable
                              size="small"
                              fullWidth
                            />
                            <HBox
                              sx={{
                                display: "grid",
                                gridTemplateRows: "1fr 1fr",
                                gap: 0.2,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleDurationFieldStep(fieldKey, 1)}
                                disabled={saving || loading}
                                sx={{ border: `1px solid ${withAlpha(colors.primary, 0.2)}`, borderRadius: 1, p: 0.05 }}
                              >
                                <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDurationFieldStep(fieldKey, -1)}
                                disabled={saving || loading}
                                sx={{ border: `1px solid ${withAlpha(colors.primary, 0.2)}`, borderRadius: 1, p: 0.05 }}
                              >
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </HBox>
                          </HBox>
                          <HDropdown
                            options={unitOptions}
                            value={durationFields[fieldKey].unit}
                            onChange={(e) => handleDurationFieldUnitChange(fieldKey, e.target.value)}
                            disabled={saving || loading}
                            width="100%"
                          />
                        </HBox>
                      </Box>
                    );
                  }

                  if (PLUS_MINUS_FIELDS.has(fieldKey)) {
                    return (
                      <Box key={fieldKey} sx={{ width: "100%" }}>
                        <HLabel
                          value={t(fieldMeta.labelKey, fieldMeta.labelDefault)}
                          translate={false}
                          colon={false}
                          align="left"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            mb: 0.75,
                          }}
                        />
                        <HBox
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "30px minmax(88px, 116px) 30px",
                            gap: 0.65,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handlePlusMinusFieldStep(fieldKey, -1)}
                            disabled={saving || loading}
                            sx={{ border: `1px solid ${withAlpha(colors.primary, 0.2)}`, borderRadius: 1, p: 0.05 }}
                          >
                            <RemoveIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                          <HTextField
                            value={String(bruteForceForm[fieldKey] ?? "")}
                            onChange={(e) => handleBruteForceNumberChange(fieldKey, e.target.value)}
                            editable
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            size="small"
                            onClick={() => handlePlusMinusFieldStep(fieldKey, 1)}
                            disabled={saving || loading}
                            sx={{ border: `1px solid ${withAlpha(colors.primary, 0.2)}`, borderRadius: 1, p: 0.05 }}
                          >
                            <AddIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </HBox>
                      </Box>
                    );
                  }

                  return (
                    <Box key={fieldKey} sx={{ width: "100%" }}>
                      <HLabel
                        value={t(fieldMeta.labelKey, fieldMeta.labelDefault)}
                        translate={false}
                        colon={false}
                        align="left"
                        sx={{
                          fontWeight: 700,
                          fontSize: 12,
                          mb: 0.75,
                        }}
                      />
                      <HTextField
                        value={String(bruteForceForm[fieldKey] ?? "")}
                        onChange={(e) => handleBruteForceNumberChange(fieldKey, e.target.value)}
                        editable
                        size="small"
                        sx={{ maxWidth: 180 }}
                      />
                    </Box>
                  );
                })}
              </HBox>
            </Box>
          )}
            </HBox>
          </HBox>
        </HBox>
      </HPaper>
    </Stack>
  );

  const handleSaveClick = () => {
    if (tab === TAB_HEADERS) {
      handleSaveHeaders();
      return;
    }
    handleSaveBruteForce();
  };

  const renderActiveTabContent = () => {
    if (tab === TAB_HEADERS) {
      return (
        <HBox sx={{ width: "100%" }}>
          {renderHeadersSection()}
        </HBox>
      );
    }

    return (
      <HBox sx={{ width: "100%" }}>
        {renderBruteForceSection()}
      </HBox>
    );
  };

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
          <HBox
            sx={{
              px: 2.5,
              py: 1,
              display: "flex",
              flexShrink: 0,
              flexDirection: "column",
              borderBottom: `1px solid ${border.divider}`,
            }}
          >
            <HBreadCrumb />
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
              <TitleBar
                title={t("label.securityDefences.title", "Security Defences")}
              />
            </HBox>
          </HBox>

          {(loading || saving) && (
            <LinearProgress
              sx={{
                height: 4,
                bgcolor: withAlpha(colors.primary, 0.1),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 1,
                },
              }}
            />
          )}

          <HTabs
            value={tab}
            onChange={(_, nextTab) => setTab(nextTab)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ sx: { display: "none" } }}
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              py: 1.25,
              borderBottom: `1px solid ${border.divider}`,
              minHeight: 52,
              gap: 0.75,
              "& .MuiTabs-flexContainer": { gap: 0.75 },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: { xs: "0.78rem", sm: "0.84rem" },
                minHeight: 40,
                py: 0.75,
                px: 1.75,
                color: text.primary,
                borderRadius: 99,
                border: "1px solid transparent",
                "&:hover": {
                  background: "var(--drs-button-outline-bg, transparent)",
                  borderColor: "var(--drs-control-hover-border, currentColor)",
                },
              },
              "& .MuiTab-root.Mui-selected": {
                color: text.inverse,
                background: "var(--drs-button-primary-bg)",
                fontWeight: 800,
                borderColor: "transparent",
                boxShadow: `0 4px 16px ${withAlpha(colors.primary, 0.35)}`,
              },
            }}
          >
            <HTab
              icon={<GppGoodIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={t("label.securityDefences.tab.headers", "Headers")}
            />
            <HTab
              icon={<BugReportIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={t("label.securityDefences.tab.bruteForce", "Brute Force Detection")}
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
            {loading && (
              <HBox sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress size={36} sx={{ color: colors.primary }} />
              </HBox>
            )}
            {!loading && renderActiveTabContent()}
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
              borderTop: `1px solid ${border.divider}`,
            }}
          >
            <HButton
              variant="outlined"
              onClick={loadSettings}
              disabled={loading || saving}
              label={t("label.securityDefences.btn.refresh", "Refresh")}
            />
            <HButton
              variant="contained"
              onClick={handleSaveClick}
              disabled={loading || saving}
              loading={saving}
              label={t("label.securityDefences.btn.save", "Save Changes")}
            />
          </HBox>
        </HPaper>
      </HBox>
    </div>
  );
};

export default SecurityDefences;
