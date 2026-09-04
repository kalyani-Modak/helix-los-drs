import { ed as useIntl, em as useTheme, dN as reactExports, dB as jsxRuntimeExports, aY as LE, v as Box, ep as vp, cf as Typography, a7 as DialogContent, bV as Stack, i as Alert, es as yE, dK as ps, cs as ap, dD as lE, a6 as DialogActions, b0 as Lg, ct as ar, eh as useNavigate, ef as useLocation, aX as Kr, cx as bp, ac as Dt, aW as Kg, cy as bu, cj as Vg, a8 as DialogTitle, N as CircularProgress, b$ as Table, c3 as TableHead, c4 as TableRow, c1 as TableCell, c0 as TableBody, M as Chip } from "./index-BhdgJqva.js";
import { B as BatchExecutionAPI, a as BatchMastersAPI, u as unwrapCommonResponse } from "./apiEndpoints-B3TJTOpa.js";
import { B as BatchProcessGridPanel } from "./BatchProcessGridPanel-8LjsATn8.js";
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;
const SCHEDULE_MODES$1 = ["INTRVL", "TIMES", "DAILY", "MONTHLY"];
function isValidTimeString(s) {
  if (s == null || typeof s !== "string") return false;
  return TIME_RE.test(s.trim());
}
function timeToMinutes(t) {
  const m = String(t).trim().match(TIME_RE);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}
function err(errorId, defaultMessage) {
  return { ok: false, errorId, defaultMessage };
}
function validateScheduleForm(mode, form) {
  if (!SCHEDULE_MODES$1.includes(mode)) {
    return err("batchmaster.schedule.error.mode", "Select a valid schedule type.");
  }
  if (mode === "INTRVL") {
    const raw = String(form.intervalMinutes ?? "").trim();
    if (!raw) {
      return { ...err("batchmaster.schedule.error.intervalMinutes", "Enter minutes between 1 and 1440."), field: "intervalMinutes" };
    }
    const n = Number(raw);
    if (!Number.isFinite(n) || n !== Math.floor(n) || n < 1 || n > 1440) {
      return { ...err("batchmaster.schedule.error.intervalMinutes", "Enter minutes between 1 and 1440."), field: "intervalMinutes" };
    }
    const w = String(form.windows ?? "").trim();
    if (!w) {
      return { ...err("batchmaster.schedule.error.windowsRequired", "Enter at least one time window."), field: "windows" };
    }
    const segments = w.split(";").map((s) => s.trim()).filter(Boolean);
    if (segments.length === 0) {
      return { ...err("batchmaster.schedule.error.windowsRequired", "Enter at least one time window."), field: "windows" };
    }
    for (const seg of segments) {
      const parts = seg.split("-");
      if (parts.length !== 2) {
        return {
          ...err(
            "batchmaster.schedule.error.windowsFormat",
            "Use HH:mm-HH:mm separated by semicolons (e.g. 09:00-11:00;14:00-16:00)."
          ),
          field: "windows"
        };
      }
      const [a, b] = [parts[0].trim(), parts[1].trim()];
      if (!isValidTimeString(a) || !isValidTimeString(b)) {
        return {
          ...err(
            "batchmaster.schedule.error.windowsFormat",
            "Use HH:mm-HH:mm separated by semicolons (e.g. 09:00-11:00;14:00-16:00)."
          ),
          field: "windows"
        };
      }
      const ma = timeToMinutes(a);
      const mb = timeToMinutes(b);
      if (ma == null || mb == null || mb <= ma) {
        return { ...err("batchmaster.schedule.error.windowOrder", "Each window must start before it ends (same day)."), field: "windows" };
      }
    }
    return { ok: true };
  }
  if (mode === "TIMES") {
    const parts = String(form.specificTimes ?? "").split(";").map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0 || !parts.every(isValidTimeString)) {
      return {
        ...err(
          "batchmaster.schedule.error.specificTimes",
          "Enter at least one time as HH:mm, separated by semicolons."
        ),
        field: "specificTimes"
      };
    }
    return { ok: true };
  }
  if (mode === "DAILY") {
    const parts = String(form.dailyTime ?? "").split(";").map((p) => p.trim()).filter(Boolean);
    if (parts.length !== 1 || !isValidTimeString(parts[0])) {
      return {
        ...err("batchmaster.schedule.error.dailyTime", "Enter exactly one time as HH:mm (e.g. 04:00)."),
        field: "dailyTime"
      };
    }
    return { ok: true };
  }
  if (mode === "MONTHLY") {
    const rawDay = String(form.monthDay ?? "").trim();
    if (!rawDay) {
      return { ...err("batchmaster.schedule.error.monthDay", "Enter a day of month from 1 to 31."), field: "monthDay" };
    }
    const d = Number(rawDay);
    if (!Number.isFinite(d) || d !== Math.floor(d) || d < 1 || d > 31) {
      return { ...err("batchmaster.schedule.error.monthDay", "Enter a day of month from 1 to 31."), field: "monthDay" };
    }
    const mt = String(form.monthTime ?? "").trim();
    if (!isValidTimeString(mt)) {
      return { ...err("batchmaster.schedule.error.monthTime", "Enter a time as HH:mm (e.g. 22:00)."), field: "monthTime" };
    }
    return { ok: true };
  }
  return err("batchmaster.schedule.error.mode", "Select a valid schedule type.");
}
function formatBatchScheduleSummary(row) {
  if (!row) return "—";
  const ex = row.executionType;
  if (ex === "Manual" || ex === "M") return "—";
  const st = row.scheduleType;
  if (!st) return "…";
  if (st === "INTRVL") {
    const m = row.periodicExecTime != null ? row.periodicExecTime : "?";
    const w = row.periodicExecBetween || "";
    return w ? `Every ${m}m (${w})` : `Every ${m}m`;
  }
  if (st === "TIMES") return `At: ${row.executionAt || ""}`;
  if (st === "DAILY") return `Daily ${row.executionAt || ""}`;
  if (st === "MONTHLY") {
    const d = row.periodicExecTime != null ? row.periodicExecTime : "?";
    return `Monthly ${d} @ ${row.executionAt || ""}`;
  }
  return String(st);
}
function inferScheduleMode(row) {
  const st = row == null ? void 0 : row.scheduleType;
  if (st && ["INTRVL", "TIMES", "DAILY", "MONTHLY"].includes(st)) return st;
  return "INTRVL";
}
function buildScheduleFieldsFromForm(mode, form) {
  var _a, _b, _c, _d;
  const base = {
    scheduleType: mode,
    periodicUnit: null,
    periodicExecTime: null,
    periodicExecBetween: null,
    executionAt: null
  };
  if (mode === "INTRVL") {
    return {
      ...base,
      periodicUnit: "m",
      periodicExecTime: form.intervalMinutes != null && form.intervalMinutes !== "" ? Number(form.intervalMinutes) : null,
      periodicExecBetween: ((_a = form.windows) == null ? void 0 : _a.trim()) ? form.windows.trim() : null
    };
  }
  if (mode === "TIMES") {
    return { ...base, executionAt: ((_b = form.specificTimes) == null ? void 0 : _b.trim()) ? form.specificTimes.trim() : null };
  }
  if (mode === "DAILY") {
    return { ...base, executionAt: ((_c = form.dailyTime) == null ? void 0 : _c.trim()) ? form.dailyTime.trim() : null };
  }
  if (mode === "MONTHLY") {
    return {
      ...base,
      periodicExecTime: form.monthDay != null && form.monthDay !== "" ? Number(form.monthDay) : null,
      executionAt: ((_d = form.monthTime) == null ? void 0 : _d.trim()) ? form.monthTime.trim() : null
    };
  }
  return base;
}
const SCHEDULE_FORM_FIELD_SX = {
  "& .label-field": { fontSize: "12px !important" },
  "& .required-star": { fontSize: "12px !important" },
  "& .custom-textfield .MuiInputBase-input": { fontSize: "12px !important" },
  "& .custom-textfield .MuiOutlinedInput-input": { fontSize: "12px !important" },
  "& .MuiFormHelperText-root": { fontSize: "12px !important" }
};
const SCHEDULE_MODES = [
  {
    value: "INTRVL",
    labelKey: "batchmaster.schedule.mode.interval.short",
    descKey: "batchmaster.schedule.mode.interval"
  },
  {
    value: "TIMES",
    labelKey: "batchmaster.schedule.mode.times.short",
    descKey: "batchmaster.schedule.mode.times"
  },
  {
    value: "DAILY",
    labelKey: "batchmaster.schedule.mode.daily.short",
    descKey: "batchmaster.schedule.mode.daily"
  },
  {
    value: "MONTHLY",
    labelKey: "batchmaster.schedule.mode.monthly.short",
    descKey: "batchmaster.schedule.mode.monthly"
  }
];
const BatchScheduleDialog = ({ open, onClose, row, onApply }) => {
  const intl = useIntl();
  const theme = useTheme();
  const [mode, setMode] = reactExports.useState("INTRVL");
  const [intervalMinutes, setIntervalMinutes] = reactExports.useState("15");
  const [windows, setWindows] = reactExports.useState("09:00-11:00;14:00-16:00;18:00-20:00");
  const [specificTimes, setSpecificTimes] = reactExports.useState("09:00;11:00");
  const [dailyTime, setDailyTime] = reactExports.useState("04:00");
  const [monthDay, setMonthDay] = reactExports.useState("17");
  const [monthTime, setMonthTime] = reactExports.useState("22:00");
  const [validation, setValidation] = reactExports.useState(null);
  const radioOptions = reactExports.useMemo(
    () => SCHEDULE_MODES.map((m) => ({
      value: m.value,
      label: m.labelKey
    })),
    []
  );
  const selectedModeMeta = reactExports.useMemo(() => SCHEDULE_MODES.find((m) => m.value === mode), [mode]);
  reactExports.useEffect(() => {
    if (!open || !row) return;
    const m = inferScheduleMode(row);
    setMode(m);
    setIntervalMinutes(row.periodicExecTime != null ? String(row.periodicExecTime) : "15");
    setWindows(row.periodicExecBetween || "09:00-11:00;14:00-16:00;18:00-20:00");
    setSpecificTimes(row.executionAt || "09:00;11:00");
    setDailyTime(row.executionAt || "04:00");
    setMonthDay(row.periodicExecTime != null ? String(row.periodicExecTime) : "17");
    setMonthTime(row.executionAt || "22:00");
    setValidation(null);
  }, [open, row]);
  reactExports.useEffect(() => {
    setValidation(null);
  }, [mode, intervalMinutes, windows, specificTimes, dailyTime, monthDay, monthTime]);
  const fieldForm = {
    intervalMinutes,
    windows,
    specificTimes,
    dailyTime,
    monthDay,
    monthTime
  };
  const handleApply = () => {
    const form = fieldForm;
    const result = validateScheduleForm(mode, form);
    if (!result.ok) {
      setValidation(result);
      return;
    }
    const fields = buildScheduleFieldsFromForm(mode, form);
    onApply == null ? void 0 : onApply(fields);
    setValidation(null);
    onClose == null ? void 0 : onClose();
  };
  const errorMessage = validation && !validation.ok ? intl.formatMessage({ id: validation.errorId, defaultMessage: validation.defaultMessage }) : null;
  const labelTypographySx = {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    fontSize: 12,
    lineHeight: 1.4,
    color: theme.palette.text.secondary
  };
  const paperRadius = theme.shape.borderRadius;
  const topRadius = typeof paperRadius === "number" ? `${paperRadius}px` : paperRadius ?? "4px";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, maxWidth: "sm", fullWidth: true, "aria-labelledby": "batch-schedule-dialog-title", slotProps: { paper: {
    sx: {
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      overflow: "hidden",
      p: 0
    }
  } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        id: "batch-schedule-dialog-title",
        sx: {
          width: "100%",
          "& .title-bar-container": {
            marginTop: 0,
            marginBottom: 0,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.batchmaster.scheduleDialog", width: "100%" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        role: "status",
        "aria-live": "polite",
        sx: {
          px: 3,
          py: 1.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : theme.palette.grey[50]
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 2,
              width: "100%",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0.75, flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Typography,
                  {
                    component: "span",
                    sx: {
                      fontSize: 12,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      whiteSpace: "nowrap"
                    },
                    children: [
                      intl.formatMessage({
                        id: "label.batchmaster.code",
                        defaultMessage: "Batch code"
                      }),
                      ":"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Typography,
                  {
                    component: "span",
                    sx: {
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap"
                    },
                    children: (row == null ? void 0 : row.batchCode) != null && String(row.batchCode).trim() !== "" ? String(row.batchCode).trim() : intl.formatMessage({
                      id: "batchmaster.schedule.batchCodeEmpty",
                      defaultMessage: "Not set"
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  component: "span",
                  sx: {
                    color: theme.palette.divider,
                    flexShrink: 0,
                    userSelect: "none"
                  },
                  "aria-hidden": true,
                  children: "|"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 0.75,
                    minWidth: 0,
                    flex: "1 1 auto",
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Typography,
                      {
                        component: "span",
                        sx: {
                          fontSize: 12,
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          flexShrink: 0,
                          whiteSpace: "nowrap"
                        },
                        children: [
                          intl.formatMessage({
                            id: "label.batchmaster.desc",
                            defaultMessage: "Description"
                          }),
                          ":"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Typography,
                      {
                        component: "span",
                        title: (row == null ? void 0 : row.batchDesc) != null && String(row.batchDesc).trim() !== "" ? String(row.batchDesc).trim() : void 0,
                        sx: {
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.4
                        },
                        children: (row == null ? void 0 : row.batchDesc) != null && String(row.batchDesc).trim() !== "" ? String(row.batchDesc).trim() : intl.formatMessage({
                          id: "batchmaster.schedule.batchCodeEmpty",
                          defaultMessage: "Not set"
                        })
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { sx: { px: 3, pt: 2, pb: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 2, sx: SCHEDULE_FORM_FIELD_SX, children: [
      validation && !validation.ok && !validation.field ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Alert,
        {
          severity: "error",
          onClose: () => setValidation(null),
          sx: { fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontSize: 13 },
          children: errorMessage
        }
      ) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Box,
        {
          sx: {
            "& .hradio-group": { margin: "8px 0 !important" }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            yE,
            {
              label: "batchmaster.schedule.kind",
              name: "batchScheduleMode",
              value: mode,
              onChange: (e) => setMode(e.target.value),
              options: radioOptions,
              orientation: "vertical"
            }
          )
        }
      ),
      selectedModeMeta ? /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { component: "div", sx: { ...labelTypographySx, pl: 0.5, pr: 1 }, children: intl.formatMessage({ id: selectedModeMeta.descKey }) }) : null,
      mode === "INTRVL" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 1.5, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "batchmaster.schedule.everyMinutes",
              width: 160,
              align: "left",
              colon: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: intervalMinutes,
              editable: true,
              onChange: (e) => setIntervalMinutes(e.target.value),
              width: "100%",
              type: "number",
              inputProps: { min: 1, max: 1440 },
              error: (validation == null ? void 0 : validation.field) === "intervalMinutes",
              helperText: (validation == null ? void 0 : validation.field) === "intervalMinutes" ? errorMessage : void 0,
              align: lE.NUMBER
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "batchmaster.schedule.windows", width: 160, align: "left", colon: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: windows,
              editable: true,
              onChange: (e) => setWindows(e.target.value),
              width: "100%",
              error: (validation == null ? void 0 : validation.field) === "windows",
              helperText: (validation == null ? void 0 : validation.field) === "windows" ? errorMessage : intl.formatMessage({
                id: "batchmaster.schedule.helper.windows",
                defaultMessage: "e.g. 09:00-11:00;14:00-16:00;18:00-20:00"
              }),
              align: lE.TEXT
            }
          ) })
        ] })
      ] }),
      mode === "TIMES" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "batchmaster.schedule.specificTimes", width: 160, align: "left", colon: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            value: specificTimes,
            editable: true,
            onChange: (e) => setSpecificTimes(e.target.value),
            width: "100%",
            error: (validation == null ? void 0 : validation.field) === "specificTimes",
            helperText: (validation == null ? void 0 : validation.field) === "specificTimes" ? errorMessage : intl.formatMessage({
              id: "batchmaster.schedule.helper.specificTimes",
              defaultMessage: "e.g. 09:00;11:00"
            }),
            align: lE.TEXT
          }
        ) })
      ] }),
      mode === "DAILY" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "batchmaster.schedule.dailyAt", width: 160, align: "left", colon: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ap,
          {
            value: dailyTime,
            editable: true,
            onChange: (e) => setDailyTime(e.target.value),
            width: "100%",
            error: (validation == null ? void 0 : validation.field) === "dailyTime",
            helperText: (validation == null ? void 0 : validation.field) === "dailyTime" ? errorMessage : intl.formatMessage({
              id: "batchmaster.schedule.helper.dailyAt",
              defaultMessage: "e.g. 04:00"
            }),
            align: lE.TEXT
          }
        ) })
      ] }),
      mode === "MONTHLY" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 1.5, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "batchmaster.schedule.dayOfMonth", width: 160, align: "left", colon: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: monthDay,
              editable: true,
              onChange: (e) => setMonthDay(e.target.value),
              width: "100%",
              type: "number",
              inputProps: { min: 1, max: 31 },
              error: (validation == null ? void 0 : validation.field) === "monthDay",
              helperText: (validation == null ? void 0 : validation.field) === "monthDay" ? errorMessage : void 0,
              align: lE.NUMBER
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", sx: { alignItems: "flex-start", width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "batchmaster.schedule.monthAt", width: 160, align: "left", colon: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1, minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: monthTime,
              editable: true,
              onChange: (e) => setMonthTime(e.target.value),
              width: "100%",
              error: (validation == null ? void 0 : validation.field) === "monthTime",
              helperText: (validation == null ? void 0 : validation.field) === "monthTime" ? errorMessage : void 0,
              align: lE.TEXT
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogActions,
      {
        sx: {
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1.5,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lg, { label: "common.cancel", variant: "outlined", onClick: onClose }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lg, { label: "common.apply", variant: "contained", onClick: handleApply }) })
        ] })
      }
    )
  ] });
};
const BatchProcessDialog = ({ open, onClose, row }) => {
  const intl = useIntl();
  const theme = useTheme();
  const panelRef = reactExports.useRef(null);
  const paperRadius = theme.shape.borderRadius;
  const topRadius = typeof paperRadius === "number" ? `${paperRadius}px` : paperRadius ?? "4px";
  const batchCodeTrim = (row == null ? void 0 : row.batchCode) != null && String(row.batchCode).trim() !== "" ? String(row.batchCode).trim() : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, maxWidth: "xl", fullWidth: true, "aria-labelledby": "batch-process-dialog-title", slotProps: { paper: {
    sx: {
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      overflow: "hidden",
      p: 0,
      width: { xs: "98vw", sm: "min(98vw, 1200px)" },
      maxWidth: "1200px !important",
      maxHeight: "101vh",
      display: "flex",
      flexDirection: "column"
    }
  } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        id: "batch-process-dialog-title",
        sx: {
          width: "100%",
          flexShrink: 0,
          "& .title-bar-container": {
            marginTop: 0,
            marginBottom: 0,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.batchmaster.batchProcessDialog", width: "100%" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Box,
      {
        role: "status",
        "aria-live": "polite",
        sx: {
          px: 3,
          py: 1.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : theme.palette.grey[50],
          flexShrink: 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            sx: {
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 2,
              width: "100%",
              minWidth: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0.75, flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Typography,
                  {
                    component: "span",
                    sx: {
                      fontSize: 12,
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                      whiteSpace: "nowrap"
                    },
                    children: [
                      intl.formatMessage({
                        id: "label.batchmaster.code",
                        defaultMessage: "Batch code"
                      }),
                      ":"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Typography,
                  {
                    component: "span",
                    sx: {
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap"
                    },
                    children: batchCodeTrim || intl.formatMessage({
                      id: "batchmaster.schedule.batchCodeEmpty",
                      defaultMessage: "Not set"
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Typography,
                {
                  component: "span",
                  sx: {
                    color: theme.palette.divider,
                    flexShrink: 0,
                    userSelect: "none"
                  },
                  "aria-hidden": true,
                  children: "|"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Box,
                {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: 0.75,
                    minWidth: 0,
                    flex: "1 1 auto",
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Typography,
                      {
                        component: "span",
                        sx: {
                          fontSize: 12,
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          flexShrink: 0,
                          whiteSpace: "nowrap"
                        },
                        children: [
                          intl.formatMessage({
                            id: "label.batchmaster.desc",
                            defaultMessage: "Description"
                          }),
                          ":"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Typography,
                      {
                        component: "span",
                        title: (row == null ? void 0 : row.batchDesc) != null && String(row.batchDesc).trim() !== "" ? String(row.batchDesc).trim() : void 0,
                        sx: {
                          fontSize: 13,
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.4
                        },
                        children: (row == null ? void 0 : row.batchDesc) != null && String(row.batchDesc).trim() !== "" ? String(row.batchDesc).trim() : intl.formatMessage({
                          id: "batchmaster.schedule.batchCodeEmpty",
                          defaultMessage: "Not set"
                        })
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContent,
      {
        sx: {
          px: 3,
          pt: 1,
          pb: 2,
          flex: "1 1 auto",
          overflow: "auto",
          minHeight: 0
        },
        children: open && row ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          BatchProcessGridPanel,
          {
            ref: panelRef,
            batchCode: batchCodeTrim,
            gridMinHeight: "min(52vh, 520px)",
            hideInternalSaveButton: true
          },
          `bp-${String(row.gridRowId ?? "")}-${batchCodeTrim || "new"}`
        ) : null
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogActions,
      {
        sx: {
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1.5,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          flexShrink: 0
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "common.save",
              variant: "contained",
              onClick: () => {
                var _a, _b;
                return (_b = (_a = panelRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
              }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lg, { label: "common.close", variant: "contained", onClick: onClose }) })
        ] })
      }
    )
  ] });
};
const toApiExecutionType = (v) => {
  if (v === "Automatic") return "A";
  if (v === "Manual") return "M";
  return v;
};
const fromApiExecutionType = (v) => {
  if (v === "A") return "Automatic";
  if (v === "M") return "Manual";
  return v;
};
const rowToBatchBody = (row) => {
  const exec = toApiExecutionType(row.executionType);
  const clearSchedule = exec === "M";
  return {
    batchCode: row.batchCode,
    batchDesc: row.batchDesc,
    active: row.active === true || row.active === "Y" ? "Y" : row.active || "N",
    nodeId: row.nodeId ?? null,
    partitionType: row.partitionType ?? null,
    executionType: exec,
    scheduleType: clearSchedule ? null : row.scheduleType ?? null,
    periodicUnit: clearSchedule ? null : row.periodicUnit ?? null,
    periodicExecTime: clearSchedule ? null : row.periodicExecTime ?? null,
    periodicExecBetween: clearSchedule ? null : row.periodicExecBetween ?? null,
    executionAt: clearSchedule ? null : row.executionAt ?? null,
    hardDependency: row.hardDependency ?? null,
    hardDepTolerance: row.hardDepTolerance ?? null,
    softDependency: row.softDependency ?? null,
    softDepTolerance: row.softDepTolerance ?? null,
    confirmationRule: row.confirmationRule ?? null,
    autoAbortLimit: row.autoAbortLimit ?? null,
    overrunMailCode: row.overrunMailCode ?? null,
    overrunSetUp: row.overrunSetUp ?? null,
    overdueMailCode: row.overdueMailCode ?? null,
    overdueSetUp: row.overdueSetUp ?? null,
    abortMailCode: row.abortMailCode ?? null,
    abortSetUp: row.abortSetUp ?? null,
    errorMailCode: row.errorMailCode ?? null,
    errorSetUp: row.errorSetUp ?? null,
    partitionCodes: row.partitionCodes ?? null,
    estimatedTime: row.estimatedTime ?? null,
    multiRunnableYn: row.multiRunnableYn ?? null,
    autoScheduleUserId: row.autoScheduleUserId ?? null,
    autoSchedule: row.autoSchedule ?? null,
    autoExecuteUserId: row.autoExecuteUserId ?? null,
    autoExecute: row.autoExecute ?? null,
    neverRunParallelWith: row.neverRunParallelWith ?? null,
    businessUnit: row.businessUnit ?? "All",
    startMailCode: row.startMailCode ?? null,
    startSetUp: row.startSetUp ?? null,
    completionMailCode: row.completionMailCode ?? null,
    completionSetUp: row.completionSetUp ?? null
  };
};
const STATUS_COLORS = {
  COMPLETED: { color: "#2e7d32", bg: "#e8f5e9" },
  SUCCESS: { color: "#2e7d32", bg: "#e8f5e9" },
  FAILED: { color: "#c62828", bg: "#ffebee" },
  ERROR: { color: "#c62828", bg: "#ffebee" },
  RUNNING: { color: "#1565c0", bg: "#e3f2fd" },
  IN_PROGRESS: { color: "#1565c0", bg: "#e3f2fd" },
  PENDING: { color: "#e65100", bg: "#fff3e0" },
  SKIPPED: { color: "#6a1b9a", bg: "#f3e5f5" },
  TERMINATED: { color: "#b45309", bg: "#fff7ed" },
  ABORTED: { color: "#b45309", bg: "#fff7ed" }
};
const isRunningDisplayStatus = (status) => {
  const upper = (status || "").toUpperCase();
  return upper === "RUNNING" || upper === "IN_PROGRESS" || upper === "STARTED" || upper === "STARTING";
};
const BatchStatusDialog = ({ open, onClose, batchCode }) => {
  const [finalStatus, setFinalStatus] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const fetchStatus = reactExports.useCallback(() => {
    if (!batchCode) return;
    setLoading(true);
    setError(false);
    setFinalStatus(null);
    Kr.GET(BatchExecutionAPI.BatchExecution(screenMenuId) + `/completed/${encodeURIComponent(batchCode)}/partitions`).then((res) => {
      var _a, _b, _c;
      const fs = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.finalStatus) ?? ((_c = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.data) == null ? void 0 : _c.finalStatus) ?? null;
      setFinalStatus(fs && typeof fs === "object" ? fs : {});
    }).catch(() => setError(true)).finally(() => setLoading(false));
  }, [batchCode]);
  reactExports.useEffect(() => {
    if (!open) return;
    fetchStatus();
  }, [open, fetchStatus]);
  const entries = Object.entries(finalStatus ?? {}).flatMap(
    ([processCode, partitions]) => Object.entries(partitions ?? {}).map(([partitionId, status]) => ({
      processCode,
      partitionId,
      status
    }))
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, maxWidth: "sm", fullWidth: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Status —",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700, color: "#1565c0" }, children: batchCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          size: "small",
          label: "label.batchmaster.dialogRefresh",
          onClick: fetchStatus,
          disabled: loading,
          margin: "0"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { dividers: true, sx: { minHeight: 120 }, children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", height: 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 32 }) }),
      error && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#c62828", padding: "24px 0" }, children: "Failed to load status. Please try again." }),
      !loading && !error && entries.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", color: "#888", padding: "24px 0" }, children: "No status data available." }),
      !loading && !error && entries.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { size: "small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { sx: { "& th": { fontWeight: 700, backgroundColor: "#f5f5f5" } }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: "Process Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: "Partition" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: entries.map(({ processCode, partitionId, status }) => {
          const style = STATUS_COLORS[status == null ? void 0 : status.toUpperCase()] ?? { color: "#333", bg: "#f5f5f5" };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { hover: true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontFamily: "monospace", fontSize: 13 }, children: processCode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { sx: { fontFamily: "monospace", fontSize: 13 }, children: partitionId }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Chip,
              {
                label: status,
                size: "small",
                sx: {
                  backgroundColor: style.bg,
                  color: style.color,
                  fontWeight: 700,
                  fontSize: 12,
                  border: `1px solid ${style.color}`
                }
              }
            ) })
          ] }, `${processCode}-${partitionId}`);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogActions, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lg, { label: "common.close", onClick: onClose, variant: "outlined", size: "small", margin: "0" }) })
  ] });
};
const BatchStatusCell = ({ batchCode, hasCode }) => {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Lg,
      {
        size: "small",
        label: "label.batchmaster.viewStatus",
        disabled: !hasCode,
        margin: "0",
        onClick: (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (hasCode) setOpen(true);
        }
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchStatusDialog,
      {
        open,
        onClose: () => setOpen(false),
        batchCode
      }
    )
  ] });
};
const BatchMaster = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = reactExports.useState(["DEFAULT"]);
  const [scheduleOpen, setScheduleOpen] = reactExports.useState(false);
  const [scheduleRow, setScheduleRow] = reactExports.useState(null);
  const [processDialogOpen, setProcessDialogOpen] = reactExports.useState(false);
  const [processDialogRow, setProcessDialogRow] = reactExports.useState(null);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [executionStatusMap, setExecutionStatusMap] = reactExports.useState({});
  const [abortDialogBatchCode, setAbortDialogBatchCode] = reactExports.useState(null);
  const [abortInProgress, setAbortInProgress] = reactExports.useState(false);
  const loadExecutionStatuses = reactExports.useCallback((batches) => {
    if (!Array.isArray(batches) || batches.length === 0) {
      setExecutionStatusMap({});
      return;
    }
    const codes = batches.map((b) => {
      var _a;
      return (_a = b.batchCode) == null ? void 0 : _a.trim();
    }).filter(Boolean);
    Promise.all(
      codes.map(
        (code) => Kr.GET(BatchExecutionAPI.BatchExecution(screenMenuId) + `/status/${encodeURIComponent(code)}`).then((res) => {
          var _a;
          const payload = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.data) ?? (res == null ? void 0 : res.data) ?? {};
          return [code, payload.displayStatus || payload.jobStatus || "IDLE"];
        }).catch(() => [code, "IDLE"])
      )
    ).then((entries) => {
      const map = {};
      entries.forEach(([code, status]) => {
        map[code] = status;
      });
      setExecutionStatusMap(map);
    });
  }, []);
  const loadPartitionTypes = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.listPartitionTypes()).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      const types = [...new Set(data.map((t) => t.partitionType).filter(Boolean))];
      setPartitionTypeValues(types.length > 0 ? types : ["DEFAULT"]);
    }).catch(() => setPartitionTypeValues(["DEFAULT"]));
  }, []);
  const openScheduleDialog = reactExports.useCallback((data) => {
    const auto = data.executionType === "Automatic" || data.executionType === "A";
    if (!auto) return;
    setScheduleRow(data);
    setScheduleOpen(true);
  }, []);
  const handleScheduleApply = reactExports.useCallback(
    (fields) => {
      var _a, _b;
      const gid = scheduleRow == null ? void 0 : scheduleRow.gridRowId;
      if (gid == null) return;
      (_b = (_a = gridRef.current) == null ? void 0 : _a.updateRowFieldsByGridRowId) == null ? void 0 : _b.call(_a, gid, fields);
    },
    [scheduleRow]
  );
  const openProcessDialog = reactExports.useCallback((data) => {
    var _a;
    if (!((_a = data == null ? void 0 : data.batchCode) == null ? void 0 : _a.trim())) return;
    setProcessDialogRow(data);
    setProcessDialogOpen(true);
  }, []);
  const columnDefs = reactExports.useMemo(() => {
    const scheduleCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.schedule",
        defaultMessage: "Schedule"
      }),
      colId: "batchScheduleEditor",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 140,
      flex: 1,
      valueGetter: (p) => formatBatchScheduleSummary(p.data),
      cellRenderer: (params) => {
        var _a, _b;
        const auto = ((_a = params.data) == null ? void 0 : _a.executionType) === "Automatic" || ((_b = params.data) == null ? void 0 : _b.executionType) === "A";
        if (!auto) return "—";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              height: "100%"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: 12,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    alignSelf: "center"
                  },
                  children: formatBatchScheduleSummary(params.data)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  size: "small",
                  label: "label.batchmaster.scheduleEdit",
                  margin: "0",
                  onClick: (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openScheduleDialog(params.data);
                  }
                }
              )
            ]
          }
        );
      }
    };
    const processCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.processes",
        defaultMessage: "Processes"
      }),
      colId: "batchProcessEditor",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        var _a, _b;
        const hasCode = ((_a = params.data) == null ? void 0 : _a.batchCode) != null && String(params.data.batchCode).trim() !== "" && !!((_b = params.data) == null ? void 0 : _b.isPersisted);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
              width: "100%",
              height: "100%"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                size: "small",
                label: "label.batchmaster.processesEdit",
                margin: "0",
                disabled: !hasCode,
                onClick: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openProcessDialog(params.data);
                }
              }
            )
          }
        );
      }
    };
    const statusCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.status",
        defaultMessage: "Status"
      }),
      colId: "batchStatus",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 150,
      flex: 1,
      valueGetter: () => "",
      cellRenderer: (params) => {
        var _a, _b, _c;
        const batchCode = (_b = (_a = params.data) == null ? void 0 : _a.batchCode) == null ? void 0 : _b.trim();
        const hasCode = !!batchCode && !!((_c = params.data) == null ? void 0 : _c.isPersisted);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", height: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BatchStatusCell, { batchCode, hasCode }) });
      }
    };
    const actionCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.action",
        defaultMessage: "Action"
      }),
      colId: "batchAction",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        var _a, _b, _c;
        const batchCode = (_b = (_a = params.data) == null ? void 0 : _a.batchCode) == null ? void 0 : _b.trim();
        const hasCode = !!batchCode && !!((_c = params.data) == null ? void 0 : _c.isPersisted);
        const displayStatus = executionStatusMap[batchCode] || "";
        const running = isRunningDisplayStatus(displayStatus);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: "100%"
            },
            children: running ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                size: "small",
                label: "label.batchmaster.abort",
                margin: "0",
                disabled: !hasCode,
                onClick: (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!hasCode) return;
                  setAbortDialogBatchCode(batchCode);
                }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                size: "small",
                label: "label.batchmaster.execute",
                margin: "0",
                disabled: !hasCode,
                onClick: async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!hasCode) return;
                  try {
                    await Kr.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/run/${encodeURIComponent(batchCode)}`, {});
                    toast.success(
                      intl.formatMessage(
                        {
                          id: "batchmaster.action.executeSuccess",
                          defaultMessage: "Batch '{code}' executed successfully"
                        },
                        { code: batchCode }
                      )
                    );
                    loadExecutionStatuses(
                      rowData.length ? rowData : [{ batchCode }]
                    );
                  } catch (err2) {
                    console.error(err2);
                    toast.error(
                      intl.formatMessage(
                        {
                          id: "batchmaster.action.executeFailed",
                          defaultMessage: "Failed to execute batch '{code}'"
                        },
                        { code: batchCode }
                      )
                    );
                  }
                }
              }
            )
          }
        );
      }
    };
    const retryCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.retry",
        defaultMessage: "Retry"
      }),
      colId: "batchActionRetry",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        var _a, _b, _c;
        const batchCode = (_b = (_a = params.data) == null ? void 0 : _a.batchCode) == null ? void 0 : _b.trim();
        const hasCode = !!batchCode && !!((_c = params.data) == null ? void 0 : _c.isPersisted);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: "100%"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                size: "small",
                label: "label.batchmaster.retry",
                margin: "0",
                disabled: !hasCode,
                onClick: async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!hasCode) return;
                  try {
                    await Kr.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/retry/${encodeURIComponent(batchCode)}`, {});
                    toast.success(
                      intl.formatMessage(
                        {
                          id: "batchmaster.retry.success",
                          defaultMessage: "Retry started for batch '{code}'"
                        },
                        { code: batchCode }
                      )
                    );
                  } catch (err2) {
                    console.error(err2);
                    toast.error(
                      intl.formatMessage(
                        {
                          id: "batchmaster.retry.failed",
                          defaultMessage: "Failed to retry batch '{code}'"
                        },
                        { code: batchCode }
                      )
                    );
                  }
                }
              }
            )
          }
        );
      }
    };
    return [
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.code",
          defaultMessage: "Batch code"
        }),
        field: "batchCode",
        width: 120,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.desc",
          defaultMessage: "Description"
        }),
        field: "batchDesc",
        width: 200,
        editable: true,
        filter: false,
        required: true
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.active",
          defaultMessage: "Active"
        }),
        field: "active",
        width: 80,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.active === "Y" || params.data.active === true,
        valueSetter: (params) => {
          params.data.active = params.newValue ? "Y" : "N";
          return true;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.partitionType",
          defaultMessage: "Partition type"
        }),
        field: "partitionType",
        width: 150,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues }
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.execType",
          defaultMessage: "Execution type"
        }),
        field: "executionType",
        width: 130,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Manual", "Automatic"] }
      },
      scheduleCol,
      processCol,
      statusCol,
      actionCol,
      retryCol,
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.estimatedTime",
          defaultMessage: "Est. time"
        }),
        field: "estimatedTime",
        width: 100,
        editable: true,
        filter: false,
        type: "numericColumn"
      }
    ];
  }, [intl, partitionTypeValues, openScheduleDialog, openProcessDialog, toast, executionStatusMap, rowData, loadExecutionStatuses]);
  const refreshData = reactExports.useCallback(() => {
    Kr.GET(BatchMastersAPI.BatchMasters(screenMenuId)).then((res) => {
      const payload = unwrapCommonResponse(res);
      const data = Array.isArray(payload) ? payload : [];
      setRowData(
        data.map((item) => ({
          id: item.batchCode,
          ...item,
          executionType: fromApiExecutionType(item.executionType),
          isPersisted: true
        }))
      );
      loadExecutionStatuses(data);
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.loadBatchesFailed",
          defaultMessage: "Failed to load batches"
        })
      );
      setRowData([]);
    });
  }, [intl, toast, loadExecutionStatuses]);
  const handleConfirmAbort = reactExports.useCallback(async () => {
    if (!abortDialogBatchCode) return;
    setAbortInProgress(true);
    try {
      await Kr.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/abort/${encodeURIComponent(abortDialogBatchCode)}`, {});
      toast.success(
        intl.formatMessage(
          {
            id: "batchmaster.abort.success",
            defaultMessage: "Batch '{code}' aborted successfully"
          },
          { code: abortDialogBatchCode }
        )
      );
      refreshData();
    } catch (err2) {
      console.error(err2);
      toast.error(
        intl.formatMessage(
          {
            id: "batchmaster.abort.failed",
            defaultMessage: "Failed to abort batch '{code}'"
          },
          { code: abortDialogBatchCode }
        )
      );
    } finally {
      setAbortInProgress(false);
      setAbortDialogBatchCode(null);
    }
  }, [abortDialogBatchCode, intl, toast, refreshData]);
  reactExports.useEffect(() => {
    loadPartitionTypes();
  }, [loadPartitionTypes]);
  reactExports.useEffect(() => {
    refreshData();
  }, [refreshData]);
  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      for (const row of deletedRows) {
        if (row.batchCode) {
          await Kr.DELETE(BatchMastersAPI.BatchMasters(screenMenuId) + `/${encodeURIComponent(row.batchCode)}`);
        }
      }
      for (const row of newRows) {
        await Kr.POST(BatchMastersAPI.BatchMasters(screenMenuId), rowToBatchBody(row));
      }
      for (const row of updatedRows) {
        await Kr.PUT(BatchMastersAPI.BatchMasters(screenMenuId) + `/${encodeURIComponent(row.batchCode)}`, rowToBatchBody(row));
      }
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.batchSaved",
          defaultMessage: "Batch configuration saved"
        })
      );
      refreshData();
      loadPartitionTypes();
      return { success: true };
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.saveFailed",
          defaultMessage: "Save failed"
        })
      );
      return { success: false };
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.BatchMaster.title",
          defaultMessage: "Batch configuration"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { p: 2, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          columnDefs,
          gridStyle: { width: "100%", height: "420px", marginTop: "20px" },
          pagination: true,
          paginationPageSize: 10,
          sort: true,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          rowDragging: false,
          onSave: handleSave
        },
        intl.locale
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onReset: () => {
            refreshData();
            loadPartitionTypes();
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, reset: true, close: true }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchScheduleDialog,
      {
        open: scheduleOpen,
        onClose: () => setScheduleOpen(false),
        row: scheduleRow,
        onApply: handleScheduleApply
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      BatchProcessDialog,
      {
        open: processDialogOpen,
        onClose: () => {
          setProcessDialogOpen(false);
          setProcessDialogRow(null);
        },
        row: processDialogRow
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open: !!abortDialogBatchCode, onClose: () => !abortInProgress && setAbortDialogBatchCode(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: intl.formatMessage({
        id: "batchmaster.abort.confirmTitle",
        defaultMessage: "Abort batch"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { children: intl.formatMessage(
        {
          id: "batchmaster.abort.confirm",
          defaultMessage: "Are you sure you want to abort batch '{code}'?"
        },
        { code: abortDialogBatchCode || "" }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogActions, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            size: "small",
            label: "common.cancel",
            margin: "0",
            disabled: abortInProgress,
            onClick: () => setAbortDialogBatchCode(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            size: "small",
            label: "label.batchmaster.abort",
            margin: "0",
            disabled: abortInProgress,
            onClick: handleConfirmAbort
          }
        )
      ] })
    ] })
  ] });
};
export {
  BatchMaster as default
};
