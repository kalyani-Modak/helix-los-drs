export function filterStrategyActionRows(rows, filters) {
  const query = (filters.query || "").trim().toLowerCase();
  const typeFilter = filters.typeFilter || new Set();
  const activeFilter = filters.activeFilter || "all";

  return rows.filter((row) => {
    if (
      query &&
      !String(row.szActionCode || "")
        .toLowerCase()
        .includes(query) &&
      !String(row.szDescription || "")
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }

    if (typeFilter.size > 0 && !typeFilter.has(row.szActionType)) {
      return false;
    }

    if (activeFilter === "active" && !row.chActiveYn) return false;
    if (activeFilter === "inactive" && row.chActiveYn) return false;

    if (filters.hasDependsFilter && !String(row.szDependsOn || "").trim()) {
      return false;
    }

    if (filters.hasSuccessorsFilter && !String(row.szSuccessors || "").trim()) {
      return false;
    }

    if (
      filters.hasFilterFilter &&
      !String(row.szExcludeCasesWith || "").trim() &&
      !String(row.szIncludeCasesWith || "").trim()
    ) {
      return false;
    }

    return true;
  });
}

export function toggleSetValue(currentSet, value) {
  const next = new Set(currentSet);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}
