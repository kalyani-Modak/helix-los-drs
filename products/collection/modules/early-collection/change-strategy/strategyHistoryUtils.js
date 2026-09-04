/**
 * Stamp / change-strategy saves write this prefix via CommonAccountDataService (function STMPSTR).
 * @see helix-coll-earlyCollections StampStrategiesService
 */
export const STAMP_STRATEGY_SYSTEM_REMARK_MARKER = "Next Collection Strategy";

/**
 * @param {unknown[]} dtoList — previousActivityDetailsDto list
 */
export function filterStampStrategyHistoryRows(dtoList) {
  if (!Array.isArray(dtoList)) return [];
  return dtoList.filter((item) =>
    String(item?.szSystemRemark || "").includes(STAMP_STRATEGY_SYSTEM_REMARK_MARKER),
  );
}
