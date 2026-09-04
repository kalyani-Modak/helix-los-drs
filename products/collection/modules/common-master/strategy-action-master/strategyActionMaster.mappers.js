const ynToBool = (value) => value === "Y" || value === true;

const boolToYn = (value) => (value ? "Y" : "N");

export function extractStrategyActionPayload(data) {
  if (data == null) return null;
  if (data.responseJson != null) return data.responseJson;
  if (data.data?.responseJson != null) return data.data.responseJson;
  return data;
}

export function mapActionTypeOptions(lstActionType) {
  if (!Array.isArray(lstActionType)) return [];
  return lstActionType.map((item) => ({
    label: item.szDesc ?? item.szCondition ?? "",
    value: item.szCondition ?? "",
    short: getTypeShortLabel(item.szDesc ?? item.szCondition ?? ""),
  }));
}

function getTypeShortLabel(desc) {
  const normalized = String(desc || "").toLowerCase();
  if (normalized.includes("initiate")) return "IW";
  if (normalized.includes("change")) return "CW";
  if (normalized.includes("mail") || normalized.includes("generate")) return "GM";
  return String(desc || "").slice(0, 2).toUpperCase();
}

function resolveCriteriaDtoFromDmnRequest(dmnRequest) {
  if (Array.isArray(dmnRequest?.dmnInfo?.criteriaDto)) {
    return dmnRequest.dmnInfo.criteriaDto;
  }
  if (Array.isArray(dmnRequest?.dmnInfo?.contexts?.[0]?.criteriaDto)) {
    return dmnRequest.dmnInfo.contexts[0].criteriaDto;
  }
  return [];
}

function resolveFilterTextFromCriteria(criteriaDto, ruleDesc) {
  const fromCriteria = (criteriaDto || [])
    .map((item) => item?.szDescription)
    .filter(Boolean)
    .join(" ")
    .trim();
  return fromCriteria || String(ruleDesc || "").trim();
}

function buildDmnInfoPayload(dmnObj, fallbackCriteriaDto) {
  const existingDmnInfo =
    dmnObj?.dmnInfo && typeof dmnObj.dmnInfo === "object"
      ? dmnObj.dmnInfo
      : {};

  const contextCriteriaDto = Array.isArray(existingDmnInfo?.contexts?.[0]?.criteriaDto)
    ? existingDmnInfo.contexts[0].criteriaDto
    : [];
  const rootCriteriaDto = Array.isArray(existingDmnInfo?.criteriaDto)
    ? existingDmnInfo.criteriaDto
    : [];
  const fallbackCriteria = Array.isArray(fallbackCriteriaDto) ? fallbackCriteriaDto : [];

  const criteriaDto =
    contextCriteriaDto.length > 0
      ? contextCriteriaDto
      : rootCriteriaDto.length > 0
        ? rootCriteriaDto
        : fallbackCriteria;

  const contexts = Array.isArray(existingDmnInfo?.contexts)
    ? existingDmnInfo.contexts
    : [];

  if (contexts.length > 0) {
    return {
      ...existingDmnInfo,
      rules: existingDmnInfo?.rules ?? null,
      contexts: contexts.map((ctx, index) =>
        index === 0
          ? {
              ...(ctx && typeof ctx === "object" ? ctx : {}),
              criteriaDto,
            }
          : ctx,
      ),
    };
  }

  if (criteriaDto.length > 0) {
    return {
      ...existingDmnInfo,
      rules: existingDmnInfo?.rules ?? null,
      contexts: [
        {
          id: "CE1",
          variable: {},
          literalExpression: {},
          includeInOutput: true,
          criteriaDto,
        },
      ],
    };
  }

  return {
    ...existingDmnInfo,
    rules: existingDmnInfo?.rules ?? null,
  };
}

function hasDmnCriteria(dmnInfo) {
  if (Array.isArray(dmnInfo?.criteriaDto) && dmnInfo.criteriaDto.length > 0) {
    return true;
  }
  if (Array.isArray(dmnInfo?.contexts)) {
    return dmnInfo.contexts.some(
      (ctx) => Array.isArray(ctx?.criteriaDto) && ctx.criteriaDto.length > 0,
    );
  }
  return false;
}

function buildDmnFilterRequest({
  row,
  actionCode,
  type,
  fallbackRuleName,
  fallbackRuleDesc,
  fallbackCriteriaDto,
}) {
  const dmnObj =
    type === "exclude"
      ? row?.szExcludeCasesWithObj
      : row?.szIncludeCasesWithObj;

  const criteriaDto = Array.isArray(fallbackCriteriaDto)
    ? fallbackCriteriaDto
    : [];

  const ruleInfo = {
    ...(dmnObj?.ruleInfo || {}),
    ruleName:
      dmnObj?.ruleInfo?.ruleName || fallbackRuleName || "",
    ruleDesc:
      dmnObj?.ruleInfo?.ruleDesc || fallbackRuleDesc || "",
    moduleName: dmnObj?.ruleInfo?.moduleName || "COL",
    dmnType: dmnObj?.ruleInfo?.dmnType || "CRITERIA_BUILDER",
    entityName: dmnObj?.ruleInfo?.entityName || "ACNT",
    hitPolicy:
      dmnObj?.ruleInfo?.hitPolicy == null
        ? null
        : dmnObj.ruleInfo.hitPolicy,
    inputs: Array.isArray(dmnObj?.ruleInfo?.inputs)
      ? dmnObj.ruleInfo.inputs
      : [],
    outputs: Array.isArray(dmnObj?.ruleInfo?.outputs)
      ? dmnObj.ruleInfo.outputs
      : [],
  };

  const dmnInfo = buildDmnInfoPayload(dmnObj, criteriaDto);

  const hasRuleDesc = String(ruleInfo.ruleDesc || "").trim().length > 0;
  const hasCriteria = hasDmnCriteria(dmnInfo);
  if (!hasRuleDesc && !hasCriteria) return null;

  // Keep a deterministic fallback rule name to let backend identify include/exclude entries.
  if (!ruleInfo.ruleName) {
    ruleInfo.ruleName = type === "exclude"
      ? `${actionCode}_SA_EX`
      : `${actionCode}_SA_IN`;
  }

  return {
    ruleInfo,
    dmnInfo,
  };
}

export function mapRowsFromResponse(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => {
    const dmnList = Array.isArray(item.dmnTableRequestDto)
      ? item.dmnTableRequestDto
      : [];

    const excludeDmn = dmnList.find((dmn) =>
      String(dmn?.ruleInfo?.ruleName || "").toUpperCase().endsWith("_SA_EX"),
    );
    const includeDmn = dmnList.find((dmn) =>
      String(dmn?.ruleInfo?.ruleName || "").toUpperCase().endsWith("_SA_IN"),
    );

    const excludeCriteria = resolveCriteriaDtoFromDmnRequest(excludeDmn);
    const includeCriteria = resolveCriteriaDtoFromDmnRequest(includeDmn);

    const excludeRuleDesc = excludeDmn?.ruleInfo?.ruleDesc || "";
    const includeRuleDesc = includeDmn?.ruleInfo?.ruleDesc || "";

    const excludeText =
      item.szExclFilterCode ||
      item.szExcludeCasesWith ||
      resolveFilterTextFromCriteria(excludeCriteria, excludeRuleDesc) ||
      "";
    const includeText =
      item.szInclFilterCode ||
      item.szIncludeCasesWith ||
      resolveFilterTextFromCriteria(includeCriteria, includeRuleDesc) ||
      "";

    return {
      id: item.szActionCode || `row-${index}`,
      lnStrActSeqNo: item.lnStrActSeqNo ?? index + 1,
      szActionCode: item.szActionCode || "",
      szDescription: item.szDescription || "",
      szActionType: item.szActionType || "",
      szActionTarget: item.szActionTarget || "",
      szDependsOn: item.szDependsOn || "",
      szSuccessors: item.szSuccessors || "",
      szExcludeCasesWith: excludeText,
      szExcludeCasesWithRuleDesc: excludeRuleDesc,
      szExcludeCasesWithCriteriaDto: excludeCriteria,
      szExcludeCasesWithObj: excludeDmn || null,
      szExcludeCasesWithRuleName: excludeDmn?.ruleInfo?.ruleName || "",
      szIncludeCasesWith: includeText,
      szIncludeCasesWithRuleDesc: includeRuleDesc,
      szIncludeCasesWithCriteriaDto: includeCriteria,
      szIncludeCasesWithObj: includeDmn || null,
      szIncludeCasesWithRuleName: includeDmn?.ruleInfo?.ruleName || "",
      chActiveYn: ynToBool(item.chActiveYn),
      chAutoActionYn: ynToBool(item.chAutoActionYn),
      mode: "",
    };
  });
}

export function buildSaveRow(row, mode, _legacyArg = null, options = {}) {
  const actionCode = (row.szActionCode ?? "").trim();
  const optionSeq = Number(options?.lnStrActSeqNo);
  const rowSeq = Number(row?.lnStrActSeqNo);
  const lnStrActSeqNo = Number.isFinite(optionSeq)
    ? optionSeq
    : Number.isFinite(rowSeq)
      ? rowSeq
      : null;
  const excludeCriteria = Array.isArray(row.szExcludeCasesWithCriteriaDto)
    ? row.szExcludeCasesWithCriteriaDto
    : [];
  const includeCriteria = Array.isArray(row.szIncludeCasesWithCriteriaDto)
    ? row.szIncludeCasesWithCriteriaDto
    : [];

  const excludeRequest = buildDmnFilterRequest({
    row,
    actionCode,
    type: "exclude",
    fallbackRuleName: row?.szExcludeCasesWithRuleName,
    fallbackRuleDesc: row?.szExcludeCasesWithRuleDesc,
    fallbackCriteriaDto: excludeCriteria,
  });

  const includeRequest = buildDmnFilterRequest({
    row,
    actionCode,
    type: "include",
    fallbackRuleName: row?.szIncludeCasesWithRuleName,
    fallbackRuleDesc: row?.szIncludeCasesWithRuleDesc,
    fallbackCriteriaDto: includeCriteria,
  });

  const dmnTableRequestDto = [excludeRequest, includeRequest].filter(Boolean);

  return {
    szActionCode: actionCode,
    szDescription: (row.szDescription ?? "").trim(),
    szActionType: row.szActionType || "",
    szActionTarget: (row.szActionTarget ?? "").trim(),
    lnStrActSeqNo,
    szDependsOn: (row.szDependsOn ?? "").trim(),
    szSuccessors: (row.szSuccessors ?? "").trim(),
    chActiveYn: boolToYn(row.chActiveYn),
    chAutoActionYn: boolToYn(row.chAutoActionYn),
    szMode: mode,
    dmnTableRequestDto,
  };
}

export function splitActionTokens(value) {
  if (value == null || value === "") return [];
  return String(value)
    .split(/[,;|]/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function joinActionTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return "";
  return tokens.join(", ");
}

export function getTypeShortForRow(actionType, actionTypeOptions) {
  const option = actionTypeOptions.find((opt) => opt.value === actionType);
  return option?.short || option?.label || actionType || "";
}

export function getDefaultStrategyActionRow() {
  return {
    id: `new-${Date.now()}`,
    szActionCode: "",
    szDescription: "",
    szActionType: "",
    szActionTarget: "",
    szDependsOn: "",
    szSuccessors: "",
    szExcludeCasesWith: "",
    szIncludeCasesWith: "",
    chActiveYn: true,
    chAutoActionYn: false,
    mode: "N",
  };
}
