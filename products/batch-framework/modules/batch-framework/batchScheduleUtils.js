/** Maps to CMN_MST_BATCH: scheduleType, periodicUnit, periodicExecTime, periodicExecBetween, executionAt */

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

const SCHEDULE_MODES = ["INTRVL", "TIMES", "DAILY", "MONTHLY"];

export function isValidTimeString(s) {
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

/**
 * Validates schedule form for the selected mode. On failure returns { ok: false, errorId, defaultMessage, field? } for i18n.
 * @param {'INTRVL'|'TIMES'|'DAILY'|'MONTHLY'} mode
 * @param {object} form — same shape as buildScheduleFieldsFromForm
 * @returns {{ ok: true } | { ok: false, errorId: string, defaultMessage: string, field?: string }}
 */
export function validateScheduleForm(mode, form) {
  if (!SCHEDULE_MODES.includes(mode)) {
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
            "Use HH:mm-HH:mm separated by semicolons (e.g. 09:00-11:00;14:00-16:00).",
          ),
          field: "windows",
        };
      }
      const [a, b] = [parts[0].trim(), parts[1].trim()];
      if (!isValidTimeString(a) || !isValidTimeString(b)) {
        return {
          ...err(
            "batchmaster.schedule.error.windowsFormat",
            "Use HH:mm-HH:mm separated by semicolons (e.g. 09:00-11:00;14:00-16:00).",
          ),
          field: "windows",
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
    const parts = String(form.specificTimes ?? "")
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length === 0 || !parts.every(isValidTimeString)) {
      return {
        ...err(
          "batchmaster.schedule.error.specificTimes",
          "Enter at least one time as HH:mm, separated by semicolons.",
        ),
        field: "specificTimes",
      };
    }
    return { ok: true };
  }

  if (mode === "DAILY") {
    const parts = String(form.dailyTime ?? "")
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length !== 1 || !isValidTimeString(parts[0])) {
      return {
        ...err("batchmaster.schedule.error.dailyTime", "Enter exactly one time as HH:mm (e.g. 04:00)."),
        field: "dailyTime",
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

export function formatBatchScheduleSummary(row) {
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

export function inferScheduleMode(row) {
  const st = row?.scheduleType;
  if (st && ["INTRVL", "TIMES", "DAILY", "MONTHLY"].includes(st)) return st;
  return "INTRVL";
}

export function buildScheduleFieldsFromForm(mode, form) {
  const base = {
    scheduleType: mode,
    periodicUnit: null,
    periodicExecTime: null,
    periodicExecBetween: null,
    executionAt: null,
  };
  if (mode === "INTRVL") {
    return {
      ...base,
      periodicUnit: "m",
      periodicExecTime:
        form.intervalMinutes != null && form.intervalMinutes !== ""
          ? Number(form.intervalMinutes)
          : null,
      periodicExecBetween: form.windows?.trim() ? form.windows.trim() : null,
    };
  }
  if (mode === "TIMES") {
    return { ...base, executionAt: form.specificTimes?.trim() ? form.specificTimes.trim() : null };
  }
  if (mode === "DAILY") {
    return { ...base, executionAt: form.dailyTime?.trim() ? form.dailyTime.trim() : null };
  }
  if (mode === "MONTHLY") {
    return {
      ...base,
      periodicExecTime:
        form.monthDay != null && form.monthDay !== "" ? Number(form.monthDay) : null,
      executionAt: form.monthTime?.trim() ? form.monthTime.trim() : null,
    };
  }
  return base;
}
