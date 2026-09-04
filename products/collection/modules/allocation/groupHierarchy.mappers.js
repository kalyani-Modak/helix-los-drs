/**
 * Group Hierarchy mappers — API ↔ UI and dirty-diff save payloads.
 */

export function emptyHierarchyRow() {
  return {
    id: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    hierarchyCode: "",
    description: "",
    active: true,
    levels: [],
    businessUnitCode: "EXQ",
  };
}

export function newLevel(levelNumber) {
  return {
    id: `l_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    level: levelNumber,
    roleLabel: "",
    approverUserCode: "",
    approverName: "",
    approvalLimit: null,
    slaHours: null,
  };
}

export function mapRowsFromResponse(list = []) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    id: item.hierarchyCode || `gh_${Math.random().toString(36).slice(2, 8)}`,
    hierarchyCode: item.hierarchyCode ?? "",
    description: item.description ?? "",
    active: item.active !== false && item.active !== "N",
    businessUnitCode: item.businessUnitCode ?? "EXQ",
    levels: (item.levels || []).map((l, idx) => ({
      id: `l_${item.hierarchyCode}_${l.level ?? idx + 1}`,
      level: l.level ?? idx + 1,
      roleLabel: l.roleLabel ?? "",
      approverUserCode: l.approverUserCode ?? "",
      approverName: l.approverName ?? "",
      approvalLimit: l.approvalLimit ?? null,
      slaHours: l.slaHours ?? null,
    })),
  }));
}

export function getModifiedBy() {
  return (
    sessionStorage.getItem("SEC_USERNAME") ||
    sessionStorage.getItem("LOGGED_IN_USER") ||
    "SYSTEM"
  );
}

function normalizeLevel(level, index) {
  return {
    level: level.level ?? index + 1,
    roleLabel: String(level.roleLabel ?? "").trim(),
    approverUserCode: String(level.approverUserCode ?? "").trim(),
    approverName: String(level.approverName ?? "").trim(),
    approvalLimit:
      level.approvalLimit === "" || level.approvalLimit == null
        ? null
        : Number(level.approvalLimit),
    slaHours:
      level.slaHours === "" || level.slaHours == null
        ? null
        : Number(level.slaHours),
  };
}

function mapLevelSave(level, mode, previousApproverUserCode = null) {
  const payload = {
    ...normalizeLevel(level, (level.level || 1) - 1),
    mode,
  };
  if (previousApproverUserCode) {
    payload.previousApproverUserCode = previousApproverUserCode;
  }
  return payload;
}

function buildLevelDiff(originalLevels = [], currentLevels = []) {
  const result = [];
  const origByKey = new Map();
  originalLevels.forEach((l) => {
    const key = `${l.level}::${l.approverUserCode}`;
    origByKey.set(key, l);
    // also index by level for reorder/approver-change detection
    if (!origByKey.has(`level:${l.level}`)) {
      origByKey.set(`level:${l.level}`, l);
    }
  });

  const usedOrigKeys = new Set();

  currentLevels.forEach((curr, idx) => {
    const normalized = normalizeLevel(curr, idx);
    const levelKey = `level:${normalized.level}`;
    const origAtLevel = origByKey.get(levelKey);

    if (!origAtLevel) {
      result.push(mapLevelSave(normalized, "N"));
      return;
    }

    const origKey = `${origAtLevel.level}::${origAtLevel.approverUserCode}`;
    usedOrigKeys.add(origKey);
    usedOrigKeys.add(levelKey);

    const approverChanged =
      String(origAtLevel.approverUserCode || "") !== normalized.approverUserCode;

    const changed =
      approverChanged ||
      String(origAtLevel.roleLabel || "") !== normalized.roleLabel ||
      String(origAtLevel.approverName || "") !== normalized.approverName ||
      Number(origAtLevel.approvalLimit ?? NaN) !== Number(normalized.approvalLimit ?? NaN) ||
      Number(origAtLevel.slaHours ?? NaN) !== Number(normalized.slaHours ?? NaN);

    if (changed) {
      result.push(
        mapLevelSave(
          normalized,
          "E",
          approverChanged ? origAtLevel.approverUserCode : null
        )
      );
    } else {
      // still send E so header propagation has explicit levels when needed
      result.push(mapLevelSave(normalized, "E"));
    }
  });

  originalLevels.forEach((orig) => {
    const stillPresent = currentLevels.some(
      (c) => Number(c.level) === Number(orig.level)
    );
    if (!stillPresent) {
      result.push(
        mapLevelSave(
          {
            level: orig.level,
            roleLabel: orig.roleLabel || "-",
            approverUserCode: orig.approverUserCode,
            approverName: orig.approverName || "",
            approvalLimit: orig.approvalLimit,
            slaHours: orig.slaHours,
          },
          "D"
        )
      );
    }
  });

  return result;
}

/**
 * Build hierarchical save payload from HAgGrid change sets + original snapshot.
 */
export function buildSavePayload({
  newRows = [],
  updatedRows = [],
  deletedRows = [],
  originalByCode = {},
}) {
  const createdBy = getModifiedBy();
  const payload = [];

  newRows.forEach((row) => {
    const levels = (row.levels || []).map((l, i) =>
      mapLevelSave(normalizeLevel(l, i), "N")
    );
    payload.push({
      hierarchyCode: String(row.hierarchyCode ?? "").trim().toUpperCase(),
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "N",
      createdBy,
      levels,
    });
  });

  updatedRows.forEach((row) => {
    const code = String(row.hierarchyCode ?? "").trim().toUpperCase();
    const original = originalByCode[code] || originalByCode[row.id];
    const originalLevels = original?.levels || [];
    const levelDiff = buildLevelDiff(originalLevels, row.levels || []);

    payload.push({
      hierarchyCode: code,
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "E",
      createdBy,
      levels: levelDiff.length > 0 ? levelDiff : (row.levels || []).map((l, i) =>
        mapLevelSave(normalizeLevel(l, i), "E")
      ),
    });
  });

  deletedRows.forEach((row) => {
    payload.push({
      hierarchyCode: String(row.hierarchyCode ?? "").trim().toUpperCase(),
      description: String(row.description ?? "").trim(),
      active: Boolean(row.active),
      mode: "D",
      createdBy,
      levels: [],
    });
  });

  return payload;
}

export function filterHierarchies(rows, searchQuery, activeOnly) {
  const q = String(searchQuery || "").trim().toLowerCase();
  return (rows || []).filter((r) => {
    if (activeOnly && !r.active) return false;
    if (!q) return true;
    return (
      String(r.hierarchyCode || "").toLowerCase().includes(q) ||
      String(r.description || "").toLowerCase().includes(q)
    );
  });
}

export function validateHierarchyRow(row, allRows = []) {
  const code = String(row.hierarchyCode ?? "").trim();
  if (!code) return "error.HierarchyCode.mandatory";
  const desc = String(row.description ?? "").trim();
  if (!desc) return "error.HierarchyDescription.mandatory";
  const dup = allRows.find(
    (r) =>
      r.id !== row.id &&
      String(r.hierarchyCode || "").trim().toUpperCase() === code.toUpperCase()
  );
  if (dup) return "error.HierarchyCode.duplicate";
  return null;
}

export function validateLevels(levels = []) {
  if (!levels.length) return "error.GroupHierarchy.levelsRequired";

  const seenRoles = new Set();
  for (const level of levels) {
    const roleKey = String(level?.roleLabel || "").trim().toUpperCase();
    if (!roleKey) continue;
    if (seenRoles.has(roleKey)) {
      return "error.GroupHierarchy.roleDuplicate";
    }
    seenRoles.add(roleKey);
  }

  const invalid = levels.find(
    (l) => !String(l.roleLabel || "").trim() || !String(l.approverUserCode || "").trim()
  );
  if (invalid) return "error.GroupHierarchy.levelIncomplete";
  return null;
}

export function definitionLabel(row, intl) {
  const n = row?.levels?.length || 0;
  if (n === 0) {
    return intl.formatMessage({
      id: "label.GroupHierarchy.DefineLevels",
      defaultMessage: "+ Define levels",
    });
  }
  const top = row.levels[0]?.roleLabel || row.levels[0]?.approverName || "";
  return intl.formatMessage(
    {
      id: "label.GroupHierarchy.LevelsSummary",
      defaultMessage: "{count} levels{top}",
    },
    {
      count: n,
      top: top ? ` · Top: ${top}` : "",
    }
  );
}
