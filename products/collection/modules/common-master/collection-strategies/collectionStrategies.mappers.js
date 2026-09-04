// import { deriveChannelFromAction } from "./collectionStrategyConstants.js";

export const STRATEGY_TYPE_COLLECTION = "C";

export const formatApiDate = (value) => {
  if (!value) return "";
  const str = String(value);
  return str.length >= 10 ? str.slice(0, 10) : str;
};

export const deriveStatusLabel = (cActiveYn) =>
  cActiveYn === "N" ? "Inactive" : "Active";

export const mapStrategyListFromApi = (item) => {
  const cActiveYn = item?.cactiveYn === "N" ? "N" : "Y";
  return {
    inStrategySeqNo: item?.inStrategySeqNo ?? null,
    szStrategyCode: item?.szStrategyCode ?? "",
    szDescription: item?.szDescription ?? "",
    szType: item?.szType ?? STRATEGY_TYPE_COLLECTION,
    cActiveYn,
    statusLabel: deriveStatusLabel(cActiveYn),
    versionNo: 1,
    effectiveFrom: formatApiDate(item?.dtCreatedOn) || "",
  };
};

export const mapScheduleRowFromApi = (item, index) => {
  const actionCode = item.szActionCode || "";
  // Add this line - try to get szChannel from the API response
  const actionType = item.szActionType || item.szactiontype || item.szChannel || "";

  let nOnDay = 0;
  if (item.inDays !== undefined && item.inDays !== null && item.inDays !== "") {
    const parsed = Number(item.inDays);
    nOnDay = isNaN(parsed) ? 0 : parsed;
  }

  return {
    key: `row-${item.inSrNo}-${actionCode}-${index}`,
    inSrNo: item.inSrNo,
    iwfRuleSeqNo: item.inWfRuleSeqNo,
    szActionCode: actionCode,
    szChannel: "", // Add this line
    nOnDay: nOnDay,
    szPhase: item.szPhase || "",
    szDependsOn: item.szDependsOn || "",
    szSuccessors: item.szSuccessors || "",
    nRequiresAuthorization: item.chAuthRequiredYn === "Y",
    bAllocate: item.chAllocateYn === "Y",
    szPerformOnNWD: item.chPerformOnNxtWrkngDayYn === "Y",
    szHolidayTreatmentBehavior: item.szSkipHoliday || "",
    szOnExclusion: item.szExclusionTreatment || "",
    szReferenceDate: item.szRefDateField || "",
    szAllocateTo: item.szAllocateTo || "",
  };
};

export const mapScheduleRowToDto = (row, szMode, inSrNo) => ({
  szMode,
  inSrNo: inSrNo ?? row.inSrNo ?? null,
  szPhase: row.szPhase || "",
  szActionCode: row.szActionCode || "",
  inDays: row.nOnDay ? Number(row.nOnDay) : 0,
  szSkipHoliday: row.szHolidayTreatmentBehavior || "",
  chPerformOnNxtWrkngDayYn: row.szPerformOnNWD ? "Y" : "N",
  szExclusionTreatment: row.szOnExclusion || "",
  chAuthRequiredYn: row.nRequiresAuthorization ? "Y" : "N",
  szRefDateField: row.szReferenceDate || "",
  chAllocateYn: row.szAllocateTo || row.bAllocate ? "Y" : "N",
  szAllocateTo: row.szAllocateTo || (row.bAllocate ? "AGENT" : null),
  szSuccessors: row.szSuccessors || "",
  szDependsOn: row.szDependsOn || "",
});

export const parseActionList = (value) =>
  (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const buildDependencyMatrix = (rows) => {
  const actions = Array.from(
    new Set(rows.map((r) => r.szActionCode).filter(Boolean))
  );
  return { actions, rows };
};

export const findStrategyInList = (strategies = [], strategyCode) => {
  return strategies.find(
    (item) =>
      item?.szStrategyCode?.trim().toUpperCase() ===
      strategyCode?.trim().toUpperCase()
  );
};

export const mapHeaderToDto = (header) => {
  return {
    szStrategyCode: header.szStrategyCode,
    szType: header.szType || 'COLLECTION',
    szDescription: header.szDescription,
    szInclFilterCode: header.szInclFilterCode,
    szExclFilterCode: header.szExclFilterCode,
    szEntFilterCode: header.szEntFilterCode,
    szExtFilterCode: header.szExtFilterCode,
    cActiveYn: header.cActiveYn ? 'Y' : 'N',
    dtEffectiveFrom: header.effectiveFrom,
    dtEffectiveTo: header.effectiveTo,
    szRemarks: header.remarks || header.changeReason,
    inVersionNo: header.versionNo || 1
  };
};


export const emptyHeader = () => ({
  szStrategyCode: '',
  szType: 'COLLECTION',
  szDescription: '',
  cActiveYn: true,
  effectiveFrom: '',
  effectiveTo: '',
  remarks: '',
  changeReason: '',
  versionNo: 1,
  szCreatedBy: '',
  dtCreatedOn: null,
  szModifiedBy: '',
  dtModifiedOn: null,
  inStrategySeqNo: null
});

export const mapHeaderFromApi = (apiData) => {
  return {
    szStrategyCode: apiData.szStrategyCode,
    szType: apiData.szType,
    szDescription: apiData.szDescription,
    szInclFilterCode: apiData.szInclFilterCode || '',
    szExclFilterCode: apiData.szExclFilterCode || '',
    szEntFilterCode: apiData.szEntFilterCode || '',
    szExtFilterCode: apiData.szExtFilterCode || '',
    cActiveYn: apiData.cActiveYn === 'Y' || apiData.cActiveYn === true || apiData.cactiveYn === 'Y' || apiData.cactiveYn === true,
    effectiveFrom: apiData.dtEffectiveFrom,
    effectiveTo: apiData.dtEffectiveTo,
    remarks: apiData.szRemarks || '',
    changeReason: apiData.szRemarks || '',
    versionNo: apiData.inVersionNo || 1,
    szCreatedBy: apiData.szCreatedBy,
    dtCreatedOn: apiData.dtCreatedOn,
    szModifiedBy: apiData.szModifiedBy,
    dtModifiedOn: apiData.dtModifiedOn,
    inStrategySeqNo: apiData.inStrategySeqNo,

  };
};