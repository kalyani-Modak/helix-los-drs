/**
 * Normalizes API note history rows for Memos grids (date display + optional sticky flag passthrough).
 */

function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toCellText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(toCellText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    return String(
      value.label ||
        value.value ||
        value.name ||
        value.description ||
        value.message ||
        value.code ||
        ""
    );
  }
  return String(value);
}

const NOTE_TYPE_LABEL_IDS = {
  C: "label.Memos.InteractionType.Call",
  P: "label.Memos.InteractionType.PersonalVisit",
  L: "label.Memos.InteractionType.Letter",
  F: "label.Memos.InteractionType.Fax",
  E: "label.Memos.InteractionType.Email",
  O: "label.Memos.InteractionType.Other",
};

const NOTE_TYPE_FALLBACKS = {
  C: "Call",
  P: "Personal Visit",
  L: "Letter",
  F: "Fax",
  E: "Email",
  O: "Other",
};

export function formatNoteType(value, intl) {
  const text = toCellText(value).trim();
  const code = text.toUpperCase();
  const labelId = NOTE_TYPE_LABEL_IDS[code];

  if (!labelId) return text;

  return intl?.formatMessage
    ? intl.formatMessage({ id: labelId, defaultMessage: NOTE_TYPE_FALLBACKS[code] })
    : NOTE_TYPE_FALLBACKS[code];
}

/**
 * @param {unknown} dtNote — LocalDate string, ISO string, [y,m,d], or LocalDateTime-like object
 * @returns {string}
 */
export function formatDtNote(dtNote) {
  if (dtNote == null || dtNote === "") return "";

  if (typeof dtNote === "string") {
    const s = dtNote.trim();
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) {
        return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
      }
    }
    return s;
  }

  if (Array.isArray(dtNote) && dtNote.length >= 3) {
    const [y, m, d, h = 0, min = 0] = dtNote;
    return `${y}-${pad2(m)}-${pad2(d)} ${pad2(h)}:${pad2(min)}`;
  }

  if (typeof dtNote === "object" && dtNote !== null) {
    if ("year" in dtNote && "month" in dtNote && "day" in dtNote) {
      const { year, monthValue, month, dayOfMonth, day, hour = 0, minute = 0 } = dtNote;
      const mo = monthValue ?? month ?? 1;
      const da = dayOfMonth ?? day ?? 1;
      return `${year}-${pad2(mo)}-${pad2(da)} ${pad2(hour)}:${pad2(minute)}`;
    }
  }

  return String(dtNote);
}

/**
 * @param {object} item — raw API row
 * @returns {object} row for HAgGrid
 */
export function mapNotesHistoryRow(item) {
  if (!item || typeof item !== "object") {
    return {
      dtDisplay: "",
      szCreatedBy: "",
      szLogedInUser: "",
      szNoteType: "",
      szNotes: toCellText(item),
      szresultcod: "",
    };
  }
  const dtNote = item.dtNote || item.dtCreated || item.dtCreatedOn || item.createdDate || item.createdOn;
  const szCreatedBy = item.szCreatedBy || item.szLogedInUser || item.szLoggedInUser || item.createdBy;
  const szNoteType = item.szNoteType || item.szInteractionType || item.interactionType || item.noteType;
  const szNotes = item.szNotes || item.notes || item.note || item.memo;

  return {
    ...item,
    dtDisplay: formatDtNote(dtNote),
    szCreatedBy: toCellText(szCreatedBy),
    szLogedInUser: toCellText(item.szLogedInUser || szCreatedBy),
    szNoteType: toCellText(szNoteType),
    szNotes: toCellText(szNotes),
    szresultcod: toCellText(item.szresultcod),
  };
}

/**
 * @param {unknown} payload — responseJson from API
 * @returns {object[]}
 */
export function mapNotesHistoryPayload(payload) {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
      ? payload.content
      : payload?.customerNotesList ||
        payload?.customerNotesDtoList ||
        payload?.notesList ||
        payload?.accountNotes ||
        payload?.customerNotes ||
        payload?.data ||
        payload?.rows ||
        [];

  if (!Array.isArray(rows)) return [];
  return rows.map(mapNotesHistoryRow);
}
