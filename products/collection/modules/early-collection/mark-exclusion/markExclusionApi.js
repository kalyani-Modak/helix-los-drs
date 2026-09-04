import dayjs from "dayjs";

import { MARK_EXCLUSION_CATEGORY_BY_TYPE } from "./markExclusionConstants.js";

function parseToDayjs(value) {
  if (value == null || value === "") return null;
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;
  if (typeof value === "string") {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }
  if (Array.isArray(value) && value.length >= 3) {
    const d = dayjs(new Date(value[0], value[1] - 1, value[2]));
    return d.isValid() ? d : null;
  }
  const d = dayjs(value);
  return d.isValid() ? d : null;
}

function toIsoDate(d) {
  if (d == null) return null;
  const x = dayjs.isDayjs(d) ? d : dayjs(d);
  if (!x.isValid()) return null;
  return x.format("YYYY-MM-DD");
}

function parseResponseJson(raw) {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

function normalizedKey(value) {
  return String(value || "").toLowerCase();
}

function firstArrayByKeys(source, keys) {
  if (!source || typeof source !== "object") return [];
  const wanted = new Set(keys.map(normalizedKey));

  for (const [key, value] of Object.entries(source)) {
    if (!wanted.has(normalizedKey(key))) continue;
    if (Array.isArray(value)) return value;
    const parsed = parseResponseJson(value);
    if (Array.isArray(parsed)) return parsed;
  }

  for (const value of Object.values(source)) {
    const parsed = parseResponseJson(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const nested = firstArrayByKeys(parsed, keys);
      if (nested.length) return nested;
    }
  }

  return [];
}

function toYesNoFlag(value, fallback = "N") {
  if (value == null || value === "") return fallback;
  const normalized = String(value).trim().toUpperCase();
  if (["Y", "YES", "TRUE", "1", "ACTIVE"].includes(normalized)) return "Y";
  if (["N", "NO", "FALSE", "0", "INACTIVE"].includes(normalized)) return "N";
  return fallback;
}

function getNoteText(entity) {
  return (
    entity.szRemarks ||
    entity.szRemark ||
    entity.szNotes ||
    entity.szNote ||
    entity.remarks ||
    entity.remark ||
    entity.notes ||
    entity.note ||
    entity.REMARKS ||
    entity.REMARK ||
    entity.NOTES ||
    entity.NOTE ||
    ""
  );
}

function getAllowedCategories(actionType) {
  return MARK_EXCLUSION_CATEGORY_BY_TYPE[String(actionType || "").trim()] || [];
}

function normalizeActionCategory(row) {
  const category = String(row.szActionCategory || "").trim();
  if (!category) return "";
  return getAllowedCategories(row.szActionType).includes(category) ? category : "";
}

/**
 * @param {object} entity — ExclusionEntity JSON
 * @returns {object} UI row
 */
export function mapExclusionEntityToRow(entity) {
  const seq = entity.lnExclSeqNo ?? entity.iExclSeqNo;
  const activeValue =
    entity.chActive ??
    entity.ChActive ??
    entity.chactive ??
    entity.ChACTIVE ??
    entity.Ch_ACTIVE ??
    entity.cActive ??
    entity.SZ_ACTIVE ??
    entity.cExcluded ??
    entity.C_EXCLUDED ??
    entity.excluded ??
    entity.EXCLUDED ??
    entity.activeYn ??
    entity.ACTIVE_YN;

  return {
    rowKey: seq != null ? `ex-${seq}` : `tmp-${Date.now()}`,
    lnExclSeqNo: seq ?? null,
    szActionType: entity.szActionType || "",
    szActionCategory: entity.szActionCategory || "",
    szActionLeaf: entity.szActionLeaf || entity.szActionCode || "",
    dtExcludedFrom: parseToDayjs(entity.dtExcludedFrom),
    dtExcludedTill: parseToDayjs(entity.dtExcludedTill),
    szReasonCode: entity.szReasonCode || "",
    szRemarks: getNoteText(entity),
    excluded: toYesNoFlag(activeValue, "N") === "Y",
    dirty: false,
  };
}

/**
 * @param {object} entity — ExclusionHistoryEntity JSON
 */
export function mapHistoryEntityToGridRow(entity, index) {
  const activeValue =
    entity.chActive ??
    entity.ChActive ??
    entity.chactive ??
    entity.ChACTIVE ??
    entity.Ch_ACTIVE ??
    entity.cActive ??
    entity.CActive ??
    entity.cactive ??
    entity.CACTIVE ??
    entity.C_ACTIVE ??
    entity.szActive ??
    entity.SZ_ACTIVE ??
    entity.flgActive ??
    entity.FLG_ACTIVE ??
    entity.active ??
    entity.ACTIVE ??
    entity.cExcluded ??
    entity.C_EXCLUDED ??
    entity.excluded ??
    entity.EXCLUDED ??
    entity.activeYn ??
    entity.ACTIVE_YN;

  return {
    gridRowId:
      entity.lnExclHisSeqNo ??
      entity.iExclHisSeqNo ??
      entity.lnExclSeqNo ??
      entity.iExclSeqNo ??
      index,
    szActionType: entity.szActionType || entity.actionType || entity.ACTION_TYPE || "",
    szActionCategory:
      entity.szActionCategory ||
      entity.actionCategory ||
      entity.ACTION_CATEGORY ||
      "",
    szActionLeaf:
      entity.szActionLeaf ||
      entity.szActionCode ||
      entity.actionLeaf ||
      entity.actionCode ||
      entity.ACTION_LEAF ||
      entity.ACTION_CODE ||
      "",
    dtExcludedFrom: entity.dtExcludedFrom || entity.excludedFrom || entity.DT_EXCLUDED_FROM,
    dtExcludedTill: entity.dtExcludedTill || entity.excludedTill || entity.DT_EXCLUDED_TILL,
    szReasonCode: entity.szReasonCode || entity.reasonCode || entity.REASON_CODE || "",
    szRemarks: getNoteText(entity),
    chActive: toYesNoFlag(activeValue, "N"),
    cActive: toYesNoFlag(activeValue, "N"),
    cStatus: entity.cStatus || entity.szStatus || entity.status || entity.STATUS || "",
    szCreatedBy:
      entity.szCreatedBy ||
      entity.createdBy ||
      entity.szUserId ||
      entity.userId ||
      entity.CREATED_BY ||
      "",
    dtCreatedOn: entity.dtCreatedOn || entity.createdOn || entity.DT_CREATED_ON,
    szDecisionBy:
      entity.szDecisionBy ||
      entity.szApprovedBy ||
      entity.szAuthorizedBy ||
      entity.decisionBy ||
      entity.approvedBy ||
      entity.authorizedBy ||
      entity.DECISION_BY ||
      "",
    dtDecisionDate:
      entity.dtDecisionDate ||
      entity.dtApprovedOn ||
      entity.dtAuthorizedOn ||
      entity.decisionDate ||
      entity.approvedOn ||
      entity.authorizedOn ||
      entity.DT_DECISION_DATE ||
      "",
  };
}

/**
 * Extract exclusions + history from CommonResponseDto.responseJson or direct payload.
 */
export function normalizeFetchPayload(data) {
  const raw = parseResponseJson(data?.responseJson);
  const payload = raw ?? data;
  if (payload == null) {
    return {
      exclusions: [],
      exclusionHistory: [],
    };
  }

  if (Array.isArray(payload)) {
    return {
      exclusions: payload,
      exclusionHistory: [],
    };
  }

  if (typeof payload === "object") {
    const ex = firstArrayByKeys(payload, [
      "exclusions",
      "lstExclusion",
      "lstExclusions",
      "lstExclusionDto",
      "lstExclusionDtos",
      "exclusionList",
      "exclusionDtoList",
      "activeExclusions",
      "lstActiveExclusion",
      "lstActiveExclusions",
    ]);
    const his = firstArrayByKeys(payload, [
      "exclusionHistory",
      "exclusionHistories",
      "lstExclusionHistory",
      "lstExclusionHistories",
      "lstExclusionHistoryDto",
      "lstExclusionHistoryDtos",
      "lstExclusionHis",
      "lstExclusionHisDto",
      "lstExclusionHisDtos",
      "exclusionHistoryList",
      "history",
      "historyList",
      "lstHistory",
      "lstHistories",
    ]);
    return {
      exclusions: Array.isArray(ex) ? ex : [],
      exclusionHistory: Array.isArray(his) ? his : [],
    };
  }

  return {
    exclusions: [],
    exclusionHistory: [],
  };
}

export function isApiSuccess(data) {
  if (!data) return false;
  if (data.success === true) return true;
  const s = data.status;
  if (typeof s === "string") return s.toLowerCase() === "success";
  return s === 200 || s === "200";
}

/**
 * Build lstExclusionDto entries for save (only rows that need server work).
 * @param {Array<object>} rows — UI rows from MarkExclusion state
 */
export function buildExclusionSaveList(rows) {
  const out = [];

  for (const row of rows) {
    const seq = row.lnExclSeqNo;
    const activeFlag = row.excluded === true ? "Y" : "N";
    const from = toIsoDate(row.dtExcludedFrom);
    const till = toIsoDate(row.dtExcludedTill);
    const base = {
      szActionType: String(row.szActionType || "").trim(),
      szActionCategory: normalizeActionCategory(row),
      szActionLeaf: String(row.szActionLeaf || "").trim(),
      szReasonCode: String(row.szReasonCode || "").trim(),
      szRemarks: String(row.szRemarks || "").trim(),
      dtExcludedFrom: from,
      dtExcludedTill: till,
      chActive: activeFlag,
    };

    if (seq == null) {
      out.push({ ...base, szMode: "I" });
    } else if (row.dirty) {
      out.push({ ...base, szMode: "U", lnExclSeqNo: seq });
    }
  }

  return out;
}

export function buildFetchWrapper() {
  return {};
}

export function buildSaveWrapper(lstExclusionDto) {
  return {
    exclusionRequestDto: {
      lstExclusionDto,
    },
  };
}

export function newEmptyRow() {
  return {
    rowKey: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    lnExclSeqNo: null,
    szActionType: "",
    szActionCategory: "",
    szActionLeaf: "",
    dtExcludedFrom: null,
    dtExcludedTill: null,
    szReasonCode: "",
    szRemarks: "",
    excluded: true,
    dirty: true,
  };
}

export function rowNeedsValidation(row) {
  if (!row.szActionType?.trim()) return true;
  const allowedCategories = getAllowedCategories(row.szActionType);
  if (allowedCategories.length > 0 && !normalizeActionCategory(row)) return true;
  if (!String(row.szActionLeaf || "").trim()) return true;
  if (!row.dtExcludedFrom || !row.dtExcludedTill) return true;
  if (!row.szReasonCode?.trim()) return true;
  return false;
}

export function isDateOrderInvalid(row) {
  if (!row.dtExcludedFrom || !row.dtExcludedTill) return false;
  const a = dayjs(row.dtExcludedFrom);
  const b = dayjs(row.dtExcludedTill);
  if (!a.isValid() || !b.isValid()) return false;
  return b.isBefore(a, "day");
}

export function serializeRowsForCompare(rows) {
  return JSON.stringify(
    (rows || []).map((r) => ({
      rowKey: r.rowKey,
      lnExclSeqNo: r.lnExclSeqNo,
      szActionType: r.szActionType,
      szActionCategory: r.szActionCategory,
      szActionLeaf: r.szActionLeaf,
      szReasonCode: r.szReasonCode,
      szRemarks: r.szRemarks,
      excluded: r.excluded,
      from: toIsoDate(r.dtExcludedFrom),
      till: toIsoDate(r.dtExcludedTill),
    })),
  );
}
