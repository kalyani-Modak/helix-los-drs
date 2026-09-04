import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { TitleBar, HLabel, HTextField, HRadioGroup, HButton, ALIGNMENT, HDialog } from "@helix/component-library";

import { buildScheduleFieldsFromForm, inferScheduleMode, validateScheduleForm } from "./batchScheduleUtils";

/** ~12px to align with `radiogroup.css` (HRadioGroup); scoped here so shared HLabel/HTextField stay unchanged. */
const SCHEDULE_FORM_FIELD_SX = {
  "& .label-field": { fontSize: "12px !important" },
  "& .required-star": { fontSize: "12px !important" },
  "& .custom-textfield .MuiInputBase-input": { fontSize: "12px !important" },
  "& .custom-textfield .MuiOutlinedInput-input": { fontSize: "12px !important" },
  "& .MuiFormHelperText-root": { fontSize: "12px !important" },
};

const SCHEDULE_MODES = [
  {
    value: "INTRVL",
    labelKey: "batchmaster.schedule.mode.interval.short",
    descKey: "batchmaster.schedule.mode.interval",
  },
  {
    value: "TIMES",
    labelKey: "batchmaster.schedule.mode.times.short",
    descKey: "batchmaster.schedule.mode.times",
  },
  {
    value: "DAILY",
    labelKey: "batchmaster.schedule.mode.daily.short",
    descKey: "batchmaster.schedule.mode.daily",
  },
  {
    value: "MONTHLY",
    labelKey: "batchmaster.schedule.mode.monthly.short",
    descKey: "batchmaster.schedule.mode.monthly",
  },
];

const BatchScheduleDialog = ({ open, onClose, row, onApply }) => {
  const intl = useIntl();
  const theme = useTheme();
  const [mode, setMode] = useState("INTRVL");
  const [intervalMinutes, setIntervalMinutes] = useState("15");
  const [windows, setWindows] = useState("09:00-11:00;14:00-16:00;18:00-20:00");
  const [specificTimes, setSpecificTimes] = useState("09:00;11:00");
  const [dailyTime, setDailyTime] = useState("04:00");
  const [monthDay, setMonthDay] = useState("17");
  const [monthTime, setMonthTime] = useState("22:00");
  const [validation, setValidation] = useState(null);

  const radioOptions = useMemo(
    () =>
      SCHEDULE_MODES.map((m) => ({
        value: m.value,
        label: m.labelKey,
      })),
    []
  );

  const selectedModeMeta = useMemo(() => SCHEDULE_MODES.find((m) => m.value === mode), [mode]);

  useEffect(() => {
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

  useEffect(() => {
    setValidation(null);
  }, [mode, intervalMinutes, windows, specificTimes, dailyTime, monthDay, monthTime]);

  const fieldForm = {
    intervalMinutes,
    windows,
    specificTimes,
    dailyTime,
    monthDay,
    monthTime,
  };

  const handleApply = () => {
    const form = fieldForm;
    const result = validateScheduleForm(mode, form);
    if (!result.ok) {
      setValidation(result);
      return;
    }
    const fields = buildScheduleFieldsFromForm(mode, form);
    onApply?.(fields);
    setValidation(null);
    onClose?.();
  };

  const errorMessage =
    validation && !validation.ok
      ? intl.formatMessage({ id: validation.errorId, defaultMessage: validation.defaultMessage })
      : null;

  const labelTypographySx = {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    fontSize: 12,
    lineHeight: 1.4,
    color: theme.palette.text.secondary,
  };

  const paperRadius = theme.shape.borderRadius;
  const topRadius =
    typeof paperRadius === "number" ? `${paperRadius}px` : paperRadius ?? "4px";

  return (
    <HDialog disableContentWrapper open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="batch-schedule-dialog-title" slotProps={{ paper: {
        sx: {
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          overflow: "hidden",
          p: 0,
        },
      } }}>
      <Box
        id="batch-schedule-dialog-title"
        sx={{
          width: "100%",
          "& .title-bar-container": {
            marginTop: 0,
            marginBottom: 0,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <TitleBar title="label.batchmaster.scheduleDialog" width="100%" />
      </Box>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          px: 3,
          py: 1.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : theme.palette.grey[50],
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0.75, flexShrink: 0 }}>
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {intl.formatMessage({
                id: "label.batchmaster.code",
                defaultMessage: "Batch code",
              })}
              :
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {row?.batchCode != null && String(row.batchCode).trim() !== ""
                ? String(row.batchCode).trim()
                : intl.formatMessage({
                    id: "batchmaster.schedule.batchCodeEmpty",
                    defaultMessage: "Not set",
                  })}
            </Typography>
          </Box>
          <Typography
            component="span"
            sx={{
              color: theme.palette.divider,
              flexShrink: 0,
              userSelect: "none",
            }}
            aria-hidden
          >
            |
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 0.75,
              minWidth: 0,
              flex: "1 1 auto",
              overflow: "hidden",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {intl.formatMessage({
                id: "label.batchmaster.desc",
                defaultMessage: "Description",
              })}
              :
            </Typography>
            <Typography
              component="span"
              title={
                row?.batchDesc != null && String(row.batchDesc).trim() !== ""
                  ? String(row.batchDesc).trim()
                  : undefined
              }
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
              }}
            >
              {row?.batchDesc != null && String(row.batchDesc).trim() !== ""
                ? String(row.batchDesc).trim()
                : intl.formatMessage({
                    id: "batchmaster.schedule.batchCodeEmpty",
                    defaultMessage: "Not set",
                  })}
            </Typography>
          </Box>
        </Box>
      </Box>
      <DialogContent sx={{ px: 3, pt: 2, pb: 2 }}>
        <Stack spacing={2} sx={SCHEDULE_FORM_FIELD_SX}>
          {validation && !validation.ok && !validation.field ? (
            <Alert
              severity="error"
              onClose={() => setValidation(null)}
              sx={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif", fontSize: 13 }}
            >
              {errorMessage}
            </Alert>
          ) : null}

          <Box
            sx={{
              "& .hradio-group": { margin: "8px 0 !important" },
            }}
          >
            <HRadioGroup
              label="batchmaster.schedule.kind"
              name="batchScheduleMode"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              options={radioOptions}
              orientation="vertical"
            />
          </Box>

          {selectedModeMeta ? (
            <Typography component="div" sx={{ ...labelTypographySx, pl: 0.5, pr: 1 }}>
              {intl.formatMessage({ id: selectedModeMeta.descKey })}
            </Typography>
          ) : null}

          {mode === "INTRVL" && (
            <Stack spacing={1.5}>
              <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
                <HLabel
                  value="batchmaster.schedule.everyMinutes"
                  width={160}
                  align="left"
                  colon
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <HTextField
                    value={intervalMinutes}
                    editable
                    onChange={(e) => setIntervalMinutes(e.target.value)}
                    width="100%"
                    type="number"
                    inputProps={{ min: 1, max: 1440 }}
                    error={validation?.field === "intervalMinutes"}
                    helperText={validation?.field === "intervalMinutes" ? errorMessage : undefined}
                    align={ALIGNMENT.NUMBER}
                  />
                </Box>
              </Box>
              <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
                <HLabel value="batchmaster.schedule.windows" width={160} align="left" colon />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <HTextField
                    value={windows}
                    editable
                    onChange={(e) => setWindows(e.target.value)}
                    width="100%"
                    error={validation?.field === "windows"}
                    helperText={
                      validation?.field === "windows"
                        ? errorMessage
                        : intl.formatMessage({
                            id: "batchmaster.schedule.helper.windows",
                            defaultMessage: "e.g. 09:00-11:00;14:00-16:00;18:00-20:00",
                          })
                    }
                    align={ALIGNMENT.TEXT}
                  />
                </Box>
              </Box>
            </Stack>
          )}

          {mode === "TIMES" && (
            <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
              <HLabel value="batchmaster.schedule.specificTimes" width={160} align="left" colon />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <HTextField
                  value={specificTimes}
                  editable
                  onChange={(e) => setSpecificTimes(e.target.value)}
                  width="100%"
                  error={validation?.field === "specificTimes"}
                  helperText={
                    validation?.field === "specificTimes"
                      ? errorMessage
                      : intl.formatMessage({
                          id: "batchmaster.schedule.helper.specificTimes",
                          defaultMessage: "e.g. 09:00;11:00",
                        })
                  }
                  align={ALIGNMENT.TEXT}
                />
              </Box>
            </Box>
          )}

          {mode === "DAILY" && (
            <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
              <HLabel value="batchmaster.schedule.dailyAt" width={160} align="left" colon />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <HTextField
                  value={dailyTime}
                  editable
                  onChange={(e) => setDailyTime(e.target.value)}
                  width="100%"
                  error={validation?.field === "dailyTime"}
                  helperText={
                    validation?.field === "dailyTime"
                      ? errorMessage
                      : intl.formatMessage({
                          id: "batchmaster.schedule.helper.dailyAt",
                          defaultMessage: "e.g. 04:00",
                        })
                  }
                  align={ALIGNMENT.TEXT}
                />
              </Box>
            </Box>
          )}

          {mode === "MONTHLY" && (
            <Stack spacing={1.5}>
              <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
                <HLabel value="batchmaster.schedule.dayOfMonth" width={160} align="left" colon />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <HTextField
                    value={monthDay}
                    editable
                    onChange={(e) => setMonthDay(e.target.value)}
                    width="100%"
                    type="number"
                    inputProps={{ min: 1, max: 31 }}
                    error={validation?.field === "monthDay"}
                    helperText={validation?.field === "monthDay" ? errorMessage : undefined}
                    align={ALIGNMENT.NUMBER}
                  />
                </Box>
              </Box>
              <Box className="label-textfield-row" sx={{ alignItems: "flex-start", width: "100%" }}>
                <HLabel value="batchmaster.schedule.monthAt" width={160} align="left" colon />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <HTextField
                    value={monthTime}
                    editable
                    onChange={(e) => setMonthTime(e.target.value)}
                    width="100%"
                    error={validation?.field === "monthTime"}
                    helperText={validation?.field === "monthTime" ? errorMessage : undefined}
                    align={ALIGNMENT.TEXT}
                  />
                </Box>
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1.5,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }}>
          <Box sx={{ width: "auto" }}>
            <HButton label="common.cancel" variant="outlined" onClick={onClose} />
          </Box>
          <Box sx={{ width: "auto" }}>
            <HButton label="common.apply" variant="contained" onClick={handleApply} />
          </Box>
        </Box>
      </DialogActions>
    </HDialog>
  );
};

export default BatchScheduleDialog;
