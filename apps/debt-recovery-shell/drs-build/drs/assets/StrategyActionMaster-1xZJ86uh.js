import { cH as createSvgIcon, dB as jsxRuntimeExports, eo as utils, er as writeSync, dN as reactExports, ed as useIntl, ef as useLocation, ct as ar, dC as kl, aX as Kr, be as Ol, ac as Dt, cy as bu, b0 as Lg, cs as ap, bH as SE, cJ as dc, dd as gridCollectorDefObj, di as gridMailCodeDefObj, bI as SEARCH_API_ENDPOINTS, bd as Ng, cB as cc, dK as ps, eh as useNavigate, cx as bp, ep as vp, cf as Typography, ap as FiDownload, cj as Vg, a5 as Dialog, a8 as DialogTitle, a7 as DialogContent, aY as LE, aR as IconButton, O as CloseIcon } from "./index-BhdgJqva.js";
import { l as StrategyActionMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
const TableChartOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M20 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 2v3H5V5zm-5 14h-5v-9h5zM5 10h3v9H5zm12 9v-9h3v9z"
}));
const ViewSidebarOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M2 4v16h20V4zm18 4.67h-2.5V6H20zm-2.5 2H20v2.67h-2.5zM4 6h11.5v12H4zm13.5 12v-2.67H20V18z"
}));
function exportToExcel(records, fileName = "export.xlsx", sheetName = "Sheet1") {
  try {
    const data = Array.isArray(records) ? records : [records];
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    try {
      const keys = Array.from(
        new Set(
          records.reduce((acc, r) => acc.concat(Object.keys(r || {})), [])
        )
      );
      const csv = [keys.join(",")].concat(
        (records || []).map((r) => keys.map((k) => JSON.stringify((r == null ? void 0 : r[k]) ?? "")).join(","))
      ).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/\.xlsx$/, ".csv");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
    }
  }
}
const ynToBool = (value) => value === "Y" || value === true;
const boolToYn = (value) => value ? "Y" : "N";
function extractStrategyActionPayload(data) {
  var _a;
  if (data == null) return null;
  if (data.responseJson != null) return data.responseJson;
  if (((_a = data.data) == null ? void 0 : _a.responseJson) != null) return data.data.responseJson;
  return data;
}
function mapActionTypeOptions(lstActionType) {
  if (!Array.isArray(lstActionType)) return [];
  return lstActionType.map((item) => ({
    label: item.szDesc ?? item.szCondition ?? "",
    value: item.szCondition ?? "",
    short: getTypeShortLabel(item.szDesc ?? item.szCondition ?? "")
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
  var _a, _b, _c, _d;
  if (Array.isArray((_a = dmnRequest == null ? void 0 : dmnRequest.dmnInfo) == null ? void 0 : _a.criteriaDto)) {
    return dmnRequest.dmnInfo.criteriaDto;
  }
  if (Array.isArray((_d = (_c = (_b = dmnRequest == null ? void 0 : dmnRequest.dmnInfo) == null ? void 0 : _b.contexts) == null ? void 0 : _c[0]) == null ? void 0 : _d.criteriaDto)) {
    return dmnRequest.dmnInfo.contexts[0].criteriaDto;
  }
  return [];
}
function resolveFilterTextFromCriteria(criteriaDto, ruleDesc) {
  const fromCriteria = (criteriaDto || []).map((item) => item == null ? void 0 : item.szDescription).filter(Boolean).join(" ").trim();
  return fromCriteria || String(ruleDesc || "").trim();
}
function buildDmnInfoPayload(dmnObj, fallbackCriteriaDto) {
  var _a, _b;
  const existingDmnInfo = (dmnObj == null ? void 0 : dmnObj.dmnInfo) && typeof dmnObj.dmnInfo === "object" ? dmnObj.dmnInfo : {};
  const contextCriteriaDto = Array.isArray((_b = (_a = existingDmnInfo == null ? void 0 : existingDmnInfo.contexts) == null ? void 0 : _a[0]) == null ? void 0 : _b.criteriaDto) ? existingDmnInfo.contexts[0].criteriaDto : [];
  const rootCriteriaDto = Array.isArray(existingDmnInfo == null ? void 0 : existingDmnInfo.criteriaDto) ? existingDmnInfo.criteriaDto : [];
  const fallbackCriteria = Array.isArray(fallbackCriteriaDto) ? fallbackCriteriaDto : [];
  const criteriaDto = contextCriteriaDto.length > 0 ? contextCriteriaDto : rootCriteriaDto.length > 0 ? rootCriteriaDto : fallbackCriteria;
  const contexts = Array.isArray(existingDmnInfo == null ? void 0 : existingDmnInfo.contexts) ? existingDmnInfo.contexts : [];
  if (contexts.length > 0) {
    return {
      ...existingDmnInfo,
      rules: (existingDmnInfo == null ? void 0 : existingDmnInfo.rules) ?? null,
      contexts: contexts.map(
        (ctx, index) => index === 0 ? {
          ...ctx && typeof ctx === "object" ? ctx : {},
          criteriaDto
        } : ctx
      )
    };
  }
  if (criteriaDto.length > 0) {
    return {
      ...existingDmnInfo,
      rules: (existingDmnInfo == null ? void 0 : existingDmnInfo.rules) ?? null,
      contexts: [
        {
          id: "CE1",
          variable: {},
          literalExpression: {},
          includeInOutput: true,
          criteriaDto
        }
      ]
    };
  }
  return {
    ...existingDmnInfo,
    rules: (existingDmnInfo == null ? void 0 : existingDmnInfo.rules) ?? null
  };
}
function hasDmnCriteria(dmnInfo) {
  if (Array.isArray(dmnInfo == null ? void 0 : dmnInfo.criteriaDto) && dmnInfo.criteriaDto.length > 0) {
    return true;
  }
  if (Array.isArray(dmnInfo == null ? void 0 : dmnInfo.contexts)) {
    return dmnInfo.contexts.some(
      (ctx) => Array.isArray(ctx == null ? void 0 : ctx.criteriaDto) && ctx.criteriaDto.length > 0
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
  fallbackCriteriaDto
}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const dmnObj = type === "exclude" ? row == null ? void 0 : row.szExcludeCasesWithObj : row == null ? void 0 : row.szIncludeCasesWithObj;
  const criteriaDto = Array.isArray(fallbackCriteriaDto) ? fallbackCriteriaDto : [];
  const ruleInfo = {
    ...(dmnObj == null ? void 0 : dmnObj.ruleInfo) || {},
    ruleName: ((_a = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _a.ruleName) || fallbackRuleName || "",
    ruleDesc: ((_b = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _b.ruleDesc) || fallbackRuleDesc || "",
    moduleName: ((_c = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _c.moduleName) || "COL",
    dmnType: ((_d = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _d.dmnType) || "CRITERIA_BUILDER",
    entityName: ((_e = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _e.entityName) || "ACNT",
    hitPolicy: ((_f = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _f.hitPolicy) == null ? null : dmnObj.ruleInfo.hitPolicy,
    inputs: Array.isArray((_g = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _g.inputs) ? dmnObj.ruleInfo.inputs : [],
    outputs: Array.isArray((_h = dmnObj == null ? void 0 : dmnObj.ruleInfo) == null ? void 0 : _h.outputs) ? dmnObj.ruleInfo.outputs : []
  };
  const dmnInfo = buildDmnInfoPayload(dmnObj, criteriaDto);
  const hasRuleDesc = String(ruleInfo.ruleDesc || "").trim().length > 0;
  const hasCriteria = hasDmnCriteria(dmnInfo);
  if (!hasRuleDesc && !hasCriteria) return null;
  if (!ruleInfo.ruleName) {
    ruleInfo.ruleName = type === "exclude" ? `${actionCode}_SA_EX` : `${actionCode}_SA_IN`;
  }
  return {
    ruleInfo,
    dmnInfo
  };
}
function mapRowsFromResponse(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item, index) => {
    var _a, _b, _c, _d;
    const dmnList = Array.isArray(item.dmnTableRequestDto) ? item.dmnTableRequestDto : [];
    const excludeDmn = dmnList.find(
      (dmn) => {
        var _a2;
        return String(((_a2 = dmn == null ? void 0 : dmn.ruleInfo) == null ? void 0 : _a2.ruleName) || "").toUpperCase().endsWith("_SA_EX");
      }
    );
    const includeDmn = dmnList.find(
      (dmn) => {
        var _a2;
        return String(((_a2 = dmn == null ? void 0 : dmn.ruleInfo) == null ? void 0 : _a2.ruleName) || "").toUpperCase().endsWith("_SA_IN");
      }
    );
    const excludeCriteria = resolveCriteriaDtoFromDmnRequest(excludeDmn);
    const includeCriteria = resolveCriteriaDtoFromDmnRequest(includeDmn);
    const excludeRuleDesc = ((_a = excludeDmn == null ? void 0 : excludeDmn.ruleInfo) == null ? void 0 : _a.ruleDesc) || "";
    const includeRuleDesc = ((_b = includeDmn == null ? void 0 : includeDmn.ruleInfo) == null ? void 0 : _b.ruleDesc) || "";
    const excludeText = item.szExclFilterCode || item.szExcludeCasesWith || resolveFilterTextFromCriteria(excludeCriteria, excludeRuleDesc) || "";
    const includeText = item.szInclFilterCode || item.szIncludeCasesWith || resolveFilterTextFromCriteria(includeCriteria, includeRuleDesc) || "";
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
      szExcludeCasesWithRuleName: ((_c = excludeDmn == null ? void 0 : excludeDmn.ruleInfo) == null ? void 0 : _c.ruleName) || "",
      szIncludeCasesWith: includeText,
      szIncludeCasesWithRuleDesc: includeRuleDesc,
      szIncludeCasesWithCriteriaDto: includeCriteria,
      szIncludeCasesWithObj: includeDmn || null,
      szIncludeCasesWithRuleName: ((_d = includeDmn == null ? void 0 : includeDmn.ruleInfo) == null ? void 0 : _d.ruleName) || "",
      chActiveYn: ynToBool(item.chActiveYn),
      chAutoActionYn: ynToBool(item.chAutoActionYn),
      mode: ""
    };
  });
}
function buildSaveRow(row, mode, _legacyArg = null, options = {}) {
  const actionCode = (row.szActionCode ?? "").trim();
  const optionSeq = Number(options == null ? void 0 : options.lnStrActSeqNo);
  const rowSeq = Number(row == null ? void 0 : row.lnStrActSeqNo);
  const lnStrActSeqNo = Number.isFinite(optionSeq) ? optionSeq : Number.isFinite(rowSeq) ? rowSeq : null;
  const excludeCriteria = Array.isArray(row.szExcludeCasesWithCriteriaDto) ? row.szExcludeCasesWithCriteriaDto : [];
  const includeCriteria = Array.isArray(row.szIncludeCasesWithCriteriaDto) ? row.szIncludeCasesWithCriteriaDto : [];
  const excludeRequest = buildDmnFilterRequest({
    row,
    actionCode,
    type: "exclude",
    fallbackRuleName: row == null ? void 0 : row.szExcludeCasesWithRuleName,
    fallbackRuleDesc: row == null ? void 0 : row.szExcludeCasesWithRuleDesc,
    fallbackCriteriaDto: excludeCriteria
  });
  const includeRequest = buildDmnFilterRequest({
    row,
    actionCode,
    type: "include",
    fallbackRuleName: row == null ? void 0 : row.szIncludeCasesWithRuleName,
    fallbackRuleDesc: row == null ? void 0 : row.szIncludeCasesWithRuleDesc,
    fallbackCriteriaDto: includeCriteria
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
    dmnTableRequestDto
  };
}
function splitActionTokens(value) {
  if (value == null || value === "") return [];
  return String(value).split(/[,;|]/).map((token) => token.trim()).filter(Boolean);
}
function joinActionTokens(tokens) {
  if (!Array.isArray(tokens) || tokens.length === 0) return "";
  return tokens.join(", ");
}
function getTypeShortForRow(actionType, actionTypeOptions) {
  const option = actionTypeOptions.find((opt) => opt.value === actionType);
  return (option == null ? void 0 : option.short) || (option == null ? void 0 : option.label) || actionType || "";
}
function getDefaultStrategyActionRow() {
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
    mode: "N"
  };
}
function filterStrategyActionRows(rows, filters) {
  const query = (filters.query || "").trim().toLowerCase();
  const typeFilter = filters.typeFilter || /* @__PURE__ */ new Set();
  const activeFilter = filters.activeFilter || "all";
  return rows.filter((row) => {
    if (query && !String(row.szActionCode || "").toLowerCase().includes(query) && !String(row.szDescription || "").toLowerCase().includes(query)) {
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
    if (filters.hasFilterFilter && !String(row.szExcludeCasesWith || "").trim() && !String(row.szIncludeCasesWith || "").trim()) {
      return false;
    }
    return true;
  });
}
function toggleSetValue(currentSet, value) {
  const next = new Set(currentSet);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}
class InvalidTokenError extends Error {
}
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }
  let decoded;
  try {
    decoded = base64UrlDecode(part);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
  }
  try {
    return JSON.parse(decoded);
  } catch (e) {
    throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
  }
}
const ACCESS_SELECTION_CACHE_KEY$1 = "strategyActionAccessCache";
const normalizeValue = (value) => String(value ?? "").trim().toUpperCase();
const ALLOWED_AUDIENCE_ROLE_KEYS = /* @__PURE__ */ new Set([
  "EARLY-COLLECTIONS"
]);
const getSingleActionCode = (value) => {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }
  return String(value ?? "").split(/[.,;|]/).map((item) => item.trim()).filter(Boolean)[0] || "";
};
const pickFirstArray$1 = (source, keys) => {
  if (!source || typeof source !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }
  return [];
};
const getAccessList$1 = (data) => {
  if (Array.isArray(data)) return data;
  const responseJson = data == null ? void 0 : data.responseJson;
  if (Array.isArray(responseJson == null ? void 0 : responseJson.lstStrategyActionAccess)) {
    return responseJson.lstStrategyActionAccess;
  }
  if (Array.isArray(responseJson)) return responseJson;
  return pickFirstArray$1(responseJson || data, [
    "accessList",
    "strategyActionAccessList",
    "lstStrategyActionAccess",
    "data"
  ]);
};
const getRolesFromToken = () => {
  const token = sessionStorage.getItem("SEC_TOKEN");
  let payload = null;
  try {
    payload = token ? jwtDecode(token) : null;
  } catch {
    payload = null;
  }
  if (!payload || typeof payload !== "object") return [];
  const audList = Array.isArray(payload == null ? void 0 : payload.aud) ? payload.aud : (payload == null ? void 0 : payload.aud) ? [payload.aud] : [];
  const allowedAudienceKeys = new Set(
    audList.map((aud) => String(aud || "").trim()).filter((aud) => ALLOWED_AUDIENCE_ROLE_KEYS.has(aud))
  );
  const roleSet = /* @__PURE__ */ new Set();
  const pushRoles = (roles) => {
    if (!Array.isArray(roles)) return;
    roles.forEach((role) => {
      const code = String(role || "").trim();
      if (code) roleSet.add(code);
    });
  };
  if ((payload == null ? void 0 : payload.resource_access) && typeof payload.resource_access === "object") {
    allowedAudienceKeys.forEach((clientKey) => {
      var _a, _b;
      pushRoles((_b = (_a = payload.resource_access) == null ? void 0 : _a[clientKey]) == null ? void 0 : _b.roles);
    });
  }
  return Array.from(roleSet).map((role) => ({
    name: role,
    description: ""
  }));
};
const StrategyActionAccess = reactExports.forwardRef(({
  actionCode,
  onClose
}, ref) => {
  var _a;
  const intl = useIntl();
  const location = useLocation();
  const screenMenuId = (_a = location == null ? void 0 : location.state) == null ? void 0 : _a.menuId;
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const inFlightRef = reactExports.useRef(false);
  const [rowData, setRowData] = reactExports.useState([]);
  const [previousSavedCodes, setPreviousSavedCodes] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loadingData, setLoadingData] = reactExports.useState(false);
  const [availableRoles, setAvailableRoles] = reactExports.useState([]);
  const [accessMappings, setAccessMappings] = reactExports.useState([]);
  const [hasLoadedMappings, setHasLoadedMappings] = reactExports.useState(false);
  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionAccess.profileCode",
        defaultMessage: "Profile Code"
      }),
      field: "profileCode",
      flex: 1,
      editable: false,
      filter: false
    }
  ];
  const buildSavedCodesForAction = reactExports.useCallback((selectedActionCode, mappings) => {
    const normalizedActionCode = normalizeValue(selectedActionCode);
    return new Set(
      (Array.isArray(mappings) ? mappings : []).filter(
        (item) => normalizeValue(item == null ? void 0 : item.szActionCode) === normalizedActionCode
      ).map((item) => normalizeValue(item == null ? void 0 : item.szGroupId)).filter(Boolean)
    );
  }, []);
  const getCachedSelectedProfileCodes = reactExports.useCallback((selectedActionCode) => {
    const cacheData = kl(ACCESS_SELECTION_CACHE_KEY$1);
    console.log("Cached access selection data:", cacheData);
    const actionKey = normalizeValue(selectedActionCode);
    const selectedRows = cacheData && typeof cacheData === "object" ? cacheData[actionKey] : void 0;
    if (!Array.isArray(selectedRows)) {
      return null;
    }
    const selectedCodes = selectedRows.map((row) => String((row == null ? void 0 : row.profileCode) || (row == null ? void 0 : row.szGroupId) || "").trim()).filter(Boolean);
    return selectedCodes;
  }, []);
  const applySelectionForAction = reactExports.useCallback((selectedActionCode, roles, mappings, cachedProfileCodes) => {
    const hasCachedSelection = Array.isArray(cachedProfileCodes);
    const savedCodes = hasCachedSelection ? new Set(
      cachedProfileCodes.map((code) => normalizeValue(code)).filter(Boolean)
    ) : buildSavedCodesForAction(selectedActionCode, mappings);
    const mappedData = (Array.isArray(roles) ? roles : []).map((role) => {
      const profileCode = String(
        role.name || role.profileCode || role.szGroupId || ""
      ).trim();
      return {
        profileCode,
        availableTo: role.description || role.availableTo || "",
        isChecked: savedCodes.has(normalizeValue(profileCode))
      };
    });
    setRowData(mappedData);
    setPreviousSavedCodes(savedCodes);
  }, [buildSavedCodesForAction]);
  const loadAccessData = reactExports.useCallback(async (force = false) => {
    if (!force && hasLoadedMappings) return;
    if (inFlightRef.current) return;
    try {
      inFlightRef.current = true;
      setLoadingData(true);
      const response = await Kr.GET(
        StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, "fetchStrategyActionAccess")
      );
      const data = response == null ? void 0 : response.data;
      const accessList = getAccessList$1(data);
      const nextMappings = Array.isArray(accessList) ? accessList : [];
      setAccessMappings(nextMappings);
      setHasLoadedMappings(true);
    } catch (error) {
      console.error("Error fetching saved access data:", error);
      setRowData([]);
      setPreviousSavedCodes(/* @__PURE__ */ new Set());
      setHasLoadedMappings(true);
      toast.error(
        intl.formatMessage({
          id: "message.StrategyActionAccess.fetchError",
          defaultMessage: "Error fetching saved access data."
        })
      );
    } finally {
      inFlightRef.current = false;
      setLoadingData(false);
    }
  }, [hasLoadedMappings, intl, toast]);
  reactExports.useEffect(() => {
    const rolesFromToken = getRolesFromToken();
    setAvailableRoles(rolesFromToken);
  }, []);
  reactExports.useEffect(() => {
    const selectedActionCode = getSingleActionCode(actionCode);
    if (!selectedActionCode) {
      setRowData([]);
      setPreviousSavedCodes(/* @__PURE__ */ new Set());
      return;
    }
    if (availableRoles.length === 0) {
      setRowData([]);
      setPreviousSavedCodes(/* @__PURE__ */ new Set());
      return;
    }
    const cachedSelectedProfileCodes = getCachedSelectedProfileCodes(selectedActionCode);
    applySelectionForAction(
      selectedActionCode,
      availableRoles,
      accessMappings,
      cachedSelectedProfileCodes
    );
    if (!hasLoadedMappings) {
      loadAccessData(true);
    }
  }, [accessMappings, actionCode, applySelectionForAction, availableRoles, getCachedSelectedProfileCodes, hasLoadedMappings, loadAccessData]);
  reactExports.useEffect(() => {
    var _a2;
    if (rowData.length > 0 && ((_a2 = gridRef.current) == null ? void 0 : _a2.api)) {
      setTimeout(() => {
        gridRef.current.api.deselectAll();
        gridRef.current.api.forEachNode((node) => {
          if (previousSavedCodes.has(normalizeValue(node.data.profileCode))) {
            node.setSelected(true, false);
          }
        });
      }, 100);
    }
  }, [rowData, previousSavedCodes]);
  const categorizeChangedRows = (currentSelected) => {
    const newProfileCodes = new Set(currentSelected.map((row) => normalizeValue(row.profileCode)));
    const normalizedActionCode = normalizeValue(getSingleActionCode(actionCode));
    const previousMappingsForAction = accessMappings.filter((item) => normalizeValue(item == null ? void 0 : item.szActionCode) === normalizedActionCode).map((item) => String((item == null ? void 0 : item.szGroupId) || "").trim()).filter(Boolean);
    const previousMappingCodeSet = new Set(
      previousMappingsForAction.map((code) => normalizeValue(code))
    );
    const rowsToCreate = currentSelected.filter(
      (row) => !previousMappingCodeSet.has(normalizeValue(row.profileCode))
    );
    const rowsToDelete = previousMappingsForAction.filter((code) => !newProfileCodes.has(normalizeValue(code))).map((profileCode) => ({
      profileCode,
      availableTo: "",
      isChecked: false
    }));
    return { rowsToCreate, rowsToDelete };
  };
  const buildPayload = (rowsToCreate, rowsToDelete) => {
    const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const selectedActionCode = getSingleActionCode(actionCode);
    if (!selectedActionCode) return [];
    const createPayload = rowsToCreate.map((row) => {
      var _a2;
      return {
        szActionCode: selectedActionCode,
        szGroupId: (_a2 = row.profileCode) == null ? void 0 : _a2.trim(),
        szUser: userCode,
        szMode: "N"
      };
    });
    const deletePayload = rowsToDelete.map((row) => {
      var _a2;
      return {
        szActionCode: selectedActionCode,
        szGroupId: (_a2 = row.profileCode) == null ? void 0 : _a2.trim(),
        szUser: userCode,
        szMode: "D"
      };
    });
    return [...createPayload, ...deletePayload];
  };
  const saveAccessChanges = reactExports.useCallback(async () => {
    var _a2, _b, _c, _d, _e, _f;
    try {
      const currentSelected = ((_c = (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.api) == null ? void 0 : _b.getSelectedRows) == null ? void 0 : _c.call(_b)) || [];
      const { rowsToCreate, rowsToDelete } = categorizeChangedRows(currentSelected);
      if (rowsToCreate.length === 0 && rowsToDelete.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.StrategyActionAccess.noChanges",
            defaultMessage: "No changes to save."
          })
        );
        return false;
      }
      const payload = buildPayload(rowsToCreate, rowsToDelete);
      if (!payload.length) {
        toast.info(
          intl.formatMessage({
            id: "message.StrategyActionAccess.noChanges",
            defaultMessage: "No changes to save."
          })
        );
        return false;
      }
      const response = await Kr.POST(
        StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, "saveStrategyActionAccess"),
        payload
      );
      const result = (response == null ? void 0 : response.data) || {};
      if ((response == null ? void 0 : response.status) >= 400) {
        throw new Error((result == null ? void 0 : result.message) || "Save failed");
      }
      await loadAccessData(true);
      (_f = (_e = (_d = gridRef.current) == null ? void 0 : _d.api) == null ? void 0 : _e.deselectAll) == null ? void 0 : _f.call(_e);
      return true;
    } catch (error) {
      toast.error(
        (error == null ? void 0 : error.message) || intl.formatMessage({
          id: "message.StrategyActionAccess.saveError",
          defaultMessage: "Failed to save Strategy Action Access."
        })
      );
      return false;
    }
  }, [categorizeChangedRows, intl, loadAccessData, toast]);
  reactExports.useImperativeHandle(ref, () => ({
    submitAccessChanges: saveAccessChanges
  }), [saveAccessChanges]);
  const handleDone = reactExports.useCallback(() => {
    var _a2, _b, _c;
    const selectedActionCode = getSingleActionCode(actionCode);
    if (!selectedActionCode) {
      if (typeof onClose === "function") onClose();
      return;
    }
    const normalizedActionCode = normalizeValue(selectedActionCode);
    const cacheData = kl(ACCESS_SELECTION_CACHE_KEY$1);
    const nextCacheData = cacheData && typeof cacheData === "object" ? { ...cacheData } : {};
    nextCacheData[normalizedActionCode] = ((_c = (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.api) == null ? void 0 : _b.getSelectedRows) == null ? void 0 : _c.call(_b)) || [];
    Ol(ACCESS_SELECTION_CACHE_KEY$1, nextCacheData);
    if (typeof onClose === "function") {
      onClose();
    }
  }, [actionCode, onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-access-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData,
        setRowData,
        loading: loadingData,
        domLayout: "normal",
        columnDefs,
        gridClassName: "strategy-action-master-access-grid",
        pagination: true,
        paginationPageSize: 6,
        sort: true,
        globalSearch: false,
        suppressRowClickSelection: true,
        rowSelection: "multiple",
        allowAdd: false,
        allowDelete: false,
        allowUpdate: false,
        hideInternalSaveButton: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-access-actions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Lg,
      {
        label: intl.formatMessage({
          id: "label.StrategyActionAccess.done",
          defaultMessage: "Done"
        }) || "Done",
        variant: "contained",
        color: "primary",
        onClick: handleDone
      }
    ) })
  ] });
});
StrategyActionAccess.displayName = "StrategyActionAccess";
const gridStrategyActionRelationDefObj$1 = [
  {
    gridHeaderDesc: "Action",
    gridMappingName: "code",
    gridColumnWidth: 140
  },
  {
    gridHeaderDesc: "Description",
    gridMappingName: "description",
    gridColumnWidth: 220
  }
];
function normalizeActionCode$1(value) {
  return String(value ?? "").trim();
}
function buildOrderedActionOptions$1(rows, currentIndex, direction) {
  var _a;
  if (!Array.isArray(rows) || currentIndex < 0) return [];
  const currentCode = normalizeActionCode$1((_a = rows[currentIndex]) == null ? void 0 : _a.szActionCode).toLowerCase();
  const candidateRows = direction === "dependsOn" ? rows.slice(0, currentIndex) : rows.slice(currentIndex + 1);
  const seen = /* @__PURE__ */ new Set();
  const options = [];
  candidateRows.forEach((row) => {
    const code = normalizeActionCode$1(row == null ? void 0 : row.szActionCode);
    const codeKey = code.toLowerCase();
    if (!code || codeKey === currentCode || seen.has(codeKey)) return;
    seen.add(codeKey);
    options.push(code);
  });
  return options;
}
function sanitizeRelationshipSelection$1(value, allowedOptions) {
  const allowedMap = new Map(
    (allowedOptions || []).map((option) => [String(option).toLowerCase(), option])
  );
  const selectedTokens = parseRelationshipTokens$1(value);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  selectedTokens.forEach((token) => {
    const tokenKey = String(token || "").trim().toLowerCase();
    if (!tokenKey || seen.has(tokenKey) || !allowedMap.has(tokenKey)) return;
    seen.add(tokenKey);
    normalized.push(allowedMap.get(tokenKey));
  });
  return joinActionTokens(normalized);
}
function parseRelationshipTokens$1(value) {
  const parseToken = (token) => String(token ?? "").split(/[.,;|]/).map((part) => part.trim()).filter(Boolean);
  if (Array.isArray(value)) {
    return value.flatMap((token) => parseToken(token));
  }
  return parseToken(value);
}
const DetailSection = ({ title, children }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "strategy-action-master-detail-section", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "strategy-action-master-detail-section-title", children: title }),
  children
] });
const DetailField = ({ label, required, hint, children, className = "" }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: `strategy-action-master-detail-field ${className}`.trim(), children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: label, required, colon: false, translate: false, align: "left" }),
  children,
  hint ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "strategy-action-master-detail-hint", children: hint }) : null
] });
const TypeBadge = ({ actionType, actionTypeOptions }) => {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  if (!short) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-type-badge", children: short });
};
function isSearchCommonBoxValueType$1(actionType, actionTypeOptions) {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  return short === "GM" || short === "CW";
}
function getValueSearchCode$1(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW" ? "COLLCDE" : "MAILCODE";
}
function isCollectorValueType$1(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW";
}
const StrategyActionDetail = ({
  rows,
  allRows,
  actionTypeOptions,
  focusRowId,
  onFocusRow,
  onUpdateRow,
  onDeleteRow,
  onOpenFilter
}) => {
  const intl = useIntl();
  const [listQuery, setListQuery] = reactExports.useState("");
  const listedRows = reactExports.useMemo(() => {
    const query = listQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) => String(row.szActionCode || "").toLowerCase().includes(query) || String(row.szDescription || "").toLowerCase().includes(query)
    );
  }, [rows, listQuery]);
  const activeRow = reactExports.useMemo(() => {
    if (!listedRows.length) return null;
    return listedRows.find((row) => row.id === focusRowId) || listedRows[0];
  }, [listedRows, focusRowId]);
  reactExports.useEffect(() => {
    if (activeRow && activeRow.id !== focusRowId) {
      onFocusRow(activeRow.id);
    }
  }, [activeRow, focusRowId, onFocusRow]);
  const typeDropdownOptions = reactExports.useMemo(
    () => actionTypeOptions.map((opt) => ({
      value: opt.value,
      label: opt.label
    })),
    [actionTypeOptions]
  );
  const updateActive = (fields) => {
    if (!activeRow) return;
    onUpdateRow(activeRow.id, fields);
  };
  const orderedRowsForRelations = reactExports.useMemo(() => {
    if (Array.isArray(allRows) && allRows.length > 0) return allRows;
    return rows;
  }, [allRows, rows]);
  const relationOptionRows = reactExports.useMemo(() => {
    if (!activeRow || !Array.isArray(orderedRowsForRelations)) return { dependsOn: [], successors: [] };
    const currentIndex = orderedRowsForRelations.findIndex((row) => row.id === activeRow.id);
    const codeToDescription = /* @__PURE__ */ new Map();
    orderedRowsForRelations.forEach((row) => {
      const code = normalizeActionCode$1(row == null ? void 0 : row.szActionCode);
      if (!code || codeToDescription.has(code)) return;
      codeToDescription.set(code, String((row == null ? void 0 : row.szDescription) || "").trim());
    });
    const toOptionRows = (codes) => codes.map((code) => ({
      code,
      description: codeToDescription.get(code) || ""
    }));
    return {
      dependsOn: toOptionRows(buildOrderedActionOptions$1(orderedRowsForRelations, currentIndex, "dependsOn")),
      successors: toOptionRows(buildOrderedActionOptions$1(orderedRowsForRelations, currentIndex, "successors"))
    };
  }, [activeRow, orderedRowsForRelations]);
  const dependsOnTokens = parseRelationshipTokens$1(activeRow == null ? void 0 : activeRow.szDependsOn);
  const successorsTokens = parseRelationshipTokens$1(activeRow == null ? void 0 : activeRow.szSuccessors);
  const safeDependsOnTokens = reactExports.useMemo(
    () => splitActionTokens(sanitizeRelationshipSelection$1(dependsOnTokens, relationOptionRows.dependsOn.map((opt) => opt.code))),
    [dependsOnTokens, relationOptionRows.dependsOn]
  );
  const safeSuccessorsTokens = reactExports.useMemo(
    () => splitActionTokens(sanitizeRelationshipSelection$1(successorsTokens, relationOptionRows.successors.map((opt) => opt.code))),
    [successorsTokens, relationOptionRows.successors]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "strategy-action-master-detail-list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-list-search", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          id: "strategy-action-detail-list-search",
          value: listQuery,
          onChange: (e) => setListQuery(e.target.value),
          editable: true,
          placeholder: "label.StrategyActionMaster.detail.listSearchPlaceholder",
          width: "100%"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-list-items", children: listedRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "strategy-action-master-detail-empty", children: intl.formatMessage({
        id: "label.StrategyActionMaster.detail.noActions",
        defaultMessage: "No actions match the current filters."
      }) }) : listedRows.map((row) => {
        const isActive = row.id === (activeRow == null ? void 0 : activeRow.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: `strategy-action-master-detail-list-item${isActive ? " is-active" : ""}`,
            onClick: () => onFocusRow(row.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `strategy-action-master-detail-status-dot${row.chActiveYn ? " is-active" : ""}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-list-item-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-list-item-title", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-action-code", children: row.szActionCode || intl.formatMessage({
                    id: "label.StrategyActionMaster.detail.untitled",
                    defaultMessage: "(untitled)"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    TypeBadge,
                    {
                      actionType: row.szActionType,
                      actionTypeOptions
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-list-desc", children: row.szDescription || "—" })
              ] }),
              row.mode === "E" || row.mode === "N" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-dirty-dot" }) : null
            ]
          },
          row.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-form-wrap", children: !activeRow ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-empty-form", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: intl.formatMessage({
      id: "label.StrategyActionMaster.detail.selectAction",
      defaultMessage: "Select a strategy action to edit."
    }) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-form", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "strategy-action-master-detail-form-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-form-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "strategy-action-master-detail-form-title", children: activeRow.szActionCode || intl.formatMessage({
              id: "label.StrategyActionMaster.detail.untitled",
              defaultMessage: "(untitled)"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypeBadge,
              {
                actionType: activeRow.szActionType,
                actionTypeOptions
              }
            ),
            !activeRow.chActiveYn ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-inactive-badge", children: intl.formatMessage({
              id: "label.StrategyActionMaster.detail.inactive",
              defaultMessage: "Inactive"
            }) }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginLeft: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: intl.formatMessage({
                id: "label.StrategyActionMaster.detail.delete",
                defaultMessage: "Delete"
              }),
              size: "small",
              className: "strategy-action-master-detail-delete-btn",
              onClick: () => onDeleteRow(activeRow)
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "strategy-action-master-detail-form-subtitle", children: activeRow.szDescription || intl.formatMessage({
          id: "label.StrategyActionMaster.detail.noDescription",
          defaultMessage: "No description"
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailSection,
        {
          title: intl.formatMessage({
            id: "label.StrategyActionMaster.detail.section.identity",
            defaultMessage: "Identity"
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-grid-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.action",
                  defaultMessage: "Action"
                }),
                required: true,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    id: "strategy-action-detail-code",
                    value: activeRow.szActionCode,
                    onChange: (e) => updateActive({ szActionCode: e.target.value }),
                    editable: activeRow.mode === "N",
                    width: "100%"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.description",
                  defaultMessage: "Description"
                }),
                required: true,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    id: "strategy-action-detail-description",
                    value: activeRow.szDescription,
                    onChange: (e) => updateActive({ szDescription: e.target.value }),
                    editable: true,
                    width: "100%"
                  }
                )
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailSection,
        {
          title: intl.formatMessage({
            id: "label.StrategyActionMaster.actionDefinition",
            defaultMessage: "Action Definition"
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-grid-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.type",
                  defaultMessage: "Type"
                }),
                required: true,
                hint: intl.formatMessage({
                  id: "label.StrategyActionMaster.detail.typeHint",
                  defaultMessage: "Determines where this action is available across rules."
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    name: "strategy-action-detail-type",
                    value: activeRow.szActionType,
                    onChange: (e) => updateActive({ szActionType: e.target.value }),
                    options: typeDropdownOptions,
                    width: "100%"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.value",
                  defaultMessage: "Value"
                }),
                required: true,
                children: isSearchCommonBoxValueType$1(activeRow.szActionType, actionTypeOptions) ? (() => {
                  const collectorType = isCollectorValueType$1(activeRow.szActionType, actionTypeOptions);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    dc,
                    {
                      apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                      searchCode: getValueSearchCode$1(activeRow.szActionType, actionTypeOptions),
                      setSelectedValue: (value) => {
                        updateActive({ szActionTarget: value || "" });
                      },
                      selectedValue: activeRow.szActionTarget || "",
                      selectedColumn: collectorType ? "szCollectorCode" : "szMailCode",
                      gridDefObj: collectorType ? gridCollectorDefObj : gridMailCodeDefObj,
                      gridWidth: 300,
                      gridHeight: 300,
                      gridNoOfRowsPerPage: 5,
                      searchBoxWidth: "100%",
                      searchBoxHeight: 30,
                      searchBoxFontSize: 12,
                      placeholder: intl.formatMessage({
                        id: collectorType ? "label.collector.collectorCode.placeholder" : "label.generateMail.mailCode.placeholder",
                        defaultMessage: collectorType ? "Select collector code" : "Select mail code"
                      })
                    }
                  );
                })() : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ap,
                  {
                    id: "strategy-action-detail-target",
                    value: activeRow.szActionTarget,
                    onChange: (e) => updateActive({ szActionTarget: e.target.value }),
                    editable: true,
                    width: "100%"
                  }
                )
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailSection,
        {
          title: intl.formatMessage({
            id: "label.StrategyActionMaster.detail.section.dependencies",
            defaultMessage: "Dependencies"
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-grid-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.dependsOn",
                  defaultMessage: "Depends On"
                }),
                hint: intl.formatMessage({
                  id: "label.StrategyActionMaster.detail.dependsOnHint",
                  defaultMessage: "This action only executes after the selected predecessor actions."
                }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    dc,
                    {
                      multiSelect: true,
                      searchCode: `detail_depends_${(activeRow == null ? void 0 : activeRow.id) || "row"}`,
                      placeholder: intl.formatMessage({
                        id: "label.StrategyActionMaster.detail.placeholder.dependsOn",
                        defaultMessage: "Select depends on"
                      }),
                      customFetchFunction: async () => ({ data: { responseJson: relationOptionRows.dependsOn } }),
                      setSelectedValue: (selectedCodes) => {
                        const nextValue = sanitizeRelationshipSelection$1(
                          selectedCodes,
                          relationOptionRows.dependsOn.map((opt) => opt.code)
                        );
                        updateActive({ szDependsOn: nextValue });
                      },
                      selectedValue: safeDependsOnTokens,
                      selectedColumn: "code",
                      gridDefObj: gridStrategyActionRelationDefObj$1,
                      gridWidth: 360,
                      gridHeight: 300,
                      gridNoOfRowsPerPage: 5,
                      searchBoxWidth: 260,
                      searchBoxHeight: 30,
                      searchBoxFontSize: 12,
                      translate: false,
                      error: false
                    },
                    `detail-depends-${activeRow == null ? void 0 : activeRow.id}-${safeDependsOnTokens.join("|")}`
                  ),
                  safeDependsOnTokens.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-token-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-token", children: joinActionTokens(safeDependsOnTokens) }) }) : null
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.successors",
                  defaultMessage: "Successors"
                }),
                hint: intl.formatMessage({
                  id: "label.StrategyActionMaster.detail.successorsHint",
                  defaultMessage: "This action will be skipped if any successor action has already executed."
                }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    dc,
                    {
                      multiSelect: true,
                      searchCode: `detail_successors_${(activeRow == null ? void 0 : activeRow.id) || "row"}`,
                      placeholder: intl.formatMessage({
                        id: "label.StrategyActionMaster.detail.placeholder.successors",
                        defaultMessage: "Select successors"
                      }),
                      customFetchFunction: async () => ({ data: { responseJson: relationOptionRows.successors } }),
                      setSelectedValue: (selectedCodes) => {
                        const nextValue = sanitizeRelationshipSelection$1(
                          selectedCodes,
                          relationOptionRows.successors.map((opt) => opt.code)
                        );
                        updateActive({ szSuccessors: nextValue });
                      },
                      selectedValue: safeSuccessorsTokens,
                      selectedColumn: "code",
                      gridDefObj: gridStrategyActionRelationDefObj$1,
                      gridWidth: 360,
                      gridHeight: 300,
                      gridNoOfRowsPerPage: 5,
                      searchBoxWidth: 260,
                      searchBoxHeight: 30,
                      searchBoxFontSize: 12,
                      translate: false,
                      error: false
                    },
                    `detail-successors-${activeRow == null ? void 0 : activeRow.id}-${safeSuccessorsTokens.join("|")}`
                  ),
                  safeSuccessorsTokens.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-token-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-detail-token", children: joinActionTokens(safeSuccessorsTokens) }) }) : null
                ]
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailSection,
        {
          title: intl.formatMessage({
            id: "label.StrategyActionMaster.detail.section.filters",
            defaultMessage: "Filters"
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-grid-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                className: "strategy-action-master-detail-filter-field",
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.excludeCases",
                  defaultMessage: "Exclude cases with"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-filter-row is-stacked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ng,
                  {
                    ruleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_EX`,
                    moduleName: "COL",
                    entityCode: "ACNT",
                    filterTitle: intl.formatMessage({ id: "label.StrategyActionMaster.excludeCases", defaultMessage: "Exclude cases with" }),
                    isPopedUp: false,
                    parentFilterProps: (filterData) => {
                      const humanText = (filterData == null ? void 0 : filterData.ruleDesc) && String(filterData.ruleDesc).trim() || ((filterData == null ? void 0 : filterData.criteriaDto) || []).map((i) => i.szDescription).filter(Boolean).join(" ").trim();
                      updateActive({
                        szExcludeCasesWith: humanText,
                        szExcludeCasesWithRuleDesc: (filterData == null ? void 0 : filterData.ruleDesc) || "",
                        szExcludeCasesWithCriteriaDto: (filterData == null ? void 0 : filterData.criteriaDto) || [],
                        szExcludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_EX`
                      });
                    },
                    parentRuleEngineFilterProps: (obj) => {
                      updateActive({
                        szExcludeCasesWithObj: obj,
                        szExcludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_EX`
                      });
                    },
                    ruleEngineDmnContext: (dmnContextJson) => {
                      updateActive({
                        szExcludeCasesWithObj: dmnContextJson,
                        szExcludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_EX`
                      });
                    },
                    IsRuleEngBased: true,
                    compact: true
                  }
                ) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                className: "strategy-action-master-detail-filter-field",
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.includeCases",
                  defaultMessage: "Include cases with"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-detail-filter-row is-stacked", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ng,
                  {
                    ruleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_IN`,
                    moduleName: "COL",
                    entityCode: "ACNT",
                    filterTitle: intl.formatMessage({ id: "label.StrategyActionMaster.includeCases", defaultMessage: "Include cases with" }),
                    isPopedUp: false,
                    parentFilterProps: (filterData) => {
                      const humanText = (filterData == null ? void 0 : filterData.ruleDesc) && String(filterData.ruleDesc).trim() || ((filterData == null ? void 0 : filterData.criteriaDto) || []).map((i) => i.szDescription).filter(Boolean).join(" ").trim();
                      updateActive({
                        szIncludeCasesWith: humanText,
                        szIncludeCasesWithRuleDesc: (filterData == null ? void 0 : filterData.ruleDesc) || "",
                        szIncludeCasesWithCriteriaDto: (filterData == null ? void 0 : filterData.criteriaDto) || [],
                        szIncludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_IN`
                      });
                    },
                    parentRuleEngineFilterProps: (obj) => {
                      updateActive({
                        szIncludeCasesWithObj: obj,
                        szIncludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_IN`
                      });
                    },
                    ruleEngineDmnContext: (dmnContextJson) => {
                      updateActive({
                        szIncludeCasesWithObj: dmnContextJson,
                        szIncludeCasesWithRuleName: `${(activeRow == null ? void 0 : activeRow.szActionCode) || (activeRow == null ? void 0 : activeRow.id) || "DRAFT"}_SA_IN`
                      });
                    },
                    IsRuleEngBased: true,
                    compact: true
                  }
                ) })
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DetailSection,
        {
          title: intl.formatMessage({
            id: "label.StrategyActionMaster.detail.section.behaviour",
            defaultMessage: "Access & Behaviour"
          }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-detail-grid-2", sx: { gap: 10 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.active",
                  defaultMessage: "Active"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    className: "strategy-action-detail-checkbox",
                    checked: !!activeRow.chActiveYn,
                    label: intl.formatMessage({
                      id: activeRow.chActiveYn ? "label.StrategyActionMaster.detail.activeOn" : "label.StrategyActionMaster.detail.activeOff",
                      defaultMessage: activeRow.chActiveYn ? "Action is active" : "Action is disabled"
                    }),
                    onChange: (e) => updateActive({ chActiveYn: e.target.checked })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.auto",
                  defaultMessage: "Auto"
                }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    className: "strategy-action-detail-checkbox",
                    checked: !!activeRow.chAutoActionYn,
                    label: intl.formatMessage({
                      id: activeRow.chAutoActionYn ? "label.StrategyActionMaster.detail.autoOn" : "label.StrategyActionMaster.detail.autoOff",
                      defaultMessage: activeRow.chAutoActionYn ? "Runs automatically by engine" : "Engine will not auto-trigger"
                    }),
                    onChange: (e) => updateActive({ chAutoActionYn: e.target.checked })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetailField,
              {
                label: intl.formatMessage({
                  id: "label.StrategyActionMaster.accessControl",
                  defaultMessage: "Access Control"
                }),
                children: (activeRow == null ? void 0 : activeRow.szActionCode) ? /* @__PURE__ */ jsxRuntimeExports.jsx(StrategyActionAccess, { actionCode: activeRow.szActionCode }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "strategy-action-master-detail-hint", children: intl.formatMessage({
                  id: "label.StrategyActionMaster.detail.accessControlHint",
                  defaultMessage: "Save action code to configure access control."
                }) })
              }
            )
          ] })
        }
      )
    ] }) })
  ] });
};
const STRATEGY_ACTION_VIEWS = ["grid", "detail"];
const ACCESS_SELECTION_CACHE_KEY = "strategyActionAccessCache";
const STRATEGY_ACTION_VIEW_LABEL_IDS = {
  grid: "label.StrategyActionMaster.view.grid",
  detail: "label.StrategyActionMaster.view.detail"
};
const gridStrategyActionRelationDefObj = [
  {
    gridHeaderDesc: "Action",
    gridMappingName: "code",
    gridColumnWidth: 140
  },
  {
    gridHeaderDesc: "Description",
    gridMappingName: "description",
    gridColumnWidth: 220
  }
];
function markRowEdited(data) {
  if (data && data.mode !== "N") {
    data.mode = "E";
  }
}
function BoolCheckboxRenderer({ field, params }) {
  const checked = !!params.value;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    cc,
    {
      checked,
      label: "",
      align: "center",
      margin: "15px",
      gridMode: true,
      onChange: (e) => {
        params.node.setDataValue(field, e.target.checked);
        markRowEdited(params.data);
      }
    }
  );
}
function normalizeActionCode(value) {
  return String(value ?? "").trim();
}
function normalizeAccessCode(value) {
  return String(value ?? "").trim().toUpperCase();
}
function getStableRowIdentity(row) {
  const actionCode = normalizeActionCode(row == null ? void 0 : row.szActionCode);
  if (actionCode) return actionCode;
  const id = String((row == null ? void 0 : row.id) || "").trim();
  if (id) return id;
  const gridRowId = String((row == null ? void 0 : row.gridRowId) || "").trim();
  return gridRowId || "row";
}
function pickFirstArray(source, keys) {
  if (!source || typeof source !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }
  return [];
}
function getAccessList(data) {
  if (Array.isArray(data)) return data;
  const responseJson = data == null ? void 0 : data.responseJson;
  if (Array.isArray(responseJson == null ? void 0 : responseJson.lstStrategyActionAccess)) {
    return responseJson.lstStrategyActionAccess;
  }
  if (Array.isArray(responseJson)) return responseJson;
  return pickFirstArray(responseJson || data, [
    "accessList",
    "strategyActionAccessList",
    "lstStrategyActionAccess",
    "data"
  ]);
}
function parseRelationshipTokens(value) {
  const parseToken = (token) => String(token ?? "").split(/[.,;|]/).map((part) => part.trim()).filter(Boolean);
  if (Array.isArray(value)) {
    return value.flatMap((token) => parseToken(token));
  }
  return parseToken(value);
}
function buildOrderedActionOptions(rows, currentIndex, direction) {
  var _a;
  if (!Array.isArray(rows) || currentIndex < 0) return [];
  const currentCode = normalizeActionCode((_a = rows[currentIndex]) == null ? void 0 : _a.szActionCode).toLowerCase();
  const candidateRows = direction === "dependsOn" ? rows.slice(0, currentIndex) : rows.slice(currentIndex + 1);
  const seen = /* @__PURE__ */ new Set();
  const options = [];
  candidateRows.forEach((row) => {
    const code = normalizeActionCode(row == null ? void 0 : row.szActionCode);
    const codeKey = code.toLowerCase();
    if (!code || codeKey === currentCode || seen.has(codeKey)) {
      return;
    }
    seen.add(codeKey);
    options.push(code);
  });
  return options;
}
function reorderRowsByActionCode(rows, preferredOrder) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  if (!Array.isArray(preferredOrder) || preferredOrder.length === 0) return rows;
  const orderIndex = /* @__PURE__ */ new Map();
  preferredOrder.forEach((code, index) => {
    const normalized = normalizeActionCode(code).toLowerCase();
    if (!normalized || orderIndex.has(normalized)) return;
    orderIndex.set(normalized, index);
  });
  if (orderIndex.size === 0) return rows;
  const ordered = [];
  const remaining = [];
  rows.forEach((row) => {
    const codeKey = normalizeActionCode(row == null ? void 0 : row.szActionCode).toLowerCase();
    if (orderIndex.has(codeKey)) {
      ordered.push({ row, index: orderIndex.get(codeKey) });
    } else {
      remaining.push(row);
    }
  });
  ordered.sort((a, b) => a.index - b.index);
  return [...ordered.map((entry) => entry.row), ...remaining];
}
function extractRowOrderCodes(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => normalizeActionCode(row == null ? void 0 : row.szActionCode)).filter(Boolean).map((code) => code.toLowerCase());
}
function areOrdersEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (String(left[index] || "") !== String(right[index] || "")) {
      return false;
    }
  }
  return true;
}
function sanitizeRelationshipSelection(value, allowedOptions) {
  const allowedMap = new Map(
    (allowedOptions || []).map((option) => [String(option).toLowerCase(), option])
  );
  const selectedTokens = parseRelationshipTokens(value);
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  selectedTokens.forEach((token) => {
    const tokenKey = String(token || "").trim().toLowerCase();
    if (!tokenKey || seen.has(tokenKey) || !allowedMap.has(tokenKey)) {
      return;
    }
    seen.add(tokenKey);
    normalized.push(allowedMap.get(tokenKey));
  });
  return joinActionTokens(normalized);
}
function isSearchCommonBoxValueType(actionType, actionTypeOptions) {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  return short === "GM" || short === "CW";
}
function getValueSearchCode(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW" ? "COLLCDE" : "MAILCODE";
}
function isCollectorValueType(actionType, actionTypeOptions) {
  const short = String(getTypeShortForRow(actionType, actionTypeOptions) || "").toUpperCase();
  const normalized = short || String(actionType || "").toUpperCase();
  return normalized === "CW";
}
function getStrategyActionMasterColumnDefs({
  intl,
  actionTypeOptions,
  onOpenFilter,
  onOpenAccess,
  dependsOnRenderer,
  successorsRenderer
}) {
  const typeValues = actionTypeOptions.map((opt) => opt.value);
  return [
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.action",
        defaultMessage: "Action"
      }),
      field: "szActionCode",
      width: 128,
      minWidth: 120,
      pinned: "left",
      editable: (params) => {
        var _a;
        return ((_a = params.data) == null ? void 0 : _a.mode) === "N";
      },
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.description",
        defaultMessage: "Description"
      }),
      field: "szDescription",
      width: 176,
      minWidth: 160,
      pinned: "left",
      editable: true,
      filter: false,
      required: true
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.actionDefinition",
        defaultMessage: "Action Definition"
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.type",
            defaultMessage: "Type"
          }),
          field: "szActionType",
          width: 180,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: typeValues },
          valueFormatter: (params) => {
            const option = actionTypeOptions.find(
              (opt) => opt.value === params.value
            );
            return option ? option.label : params.value;
          }
        },
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.value",
            defaultMessage: "Value"
          }),
          field: "szActionTarget",
          width: 176,
          editable: (params) => {
            var _a;
            return !isSearchCommonBoxValueType((_a = params.data) == null ? void 0 : _a.szActionType, actionTypeOptions);
          },
          filter: false,
          required: true,
          cellRenderer: (params) => {
            var _a, _b, _c;
            if (!isSearchCommonBoxValueType((_a = params.data) == null ? void 0 : _a.szActionType, actionTypeOptions)) {
              return params.value || "";
            }
            const collectorType = isCollectorValueType((_b = params.data) == null ? void 0 : _b.szActionType, actionTypeOptions);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              dc,
              {
                apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                searchCode: getValueSearchCode((_c = params.data) == null ? void 0 : _c.szActionType, actionTypeOptions),
                setSelectedValue: (value, selectedRow) => {
                  var _a2;
                  const nextValue = value || "";
                  const currentValue = ((_a2 = params.data) == null ? void 0 : _a2.szActionTarget) || "";
                  const isInitialAutoReset = selectedRow === void 0 && nextValue === "" && currentValue !== "";
                  if (isInitialAutoReset || nextValue === currentValue) {
                    return;
                  }
                  params.node.setDataValue("szActionTarget", nextValue);
                  markRowEdited(params.data);
                },
                selectedValue: params.value || "",
                selectedColumn: collectorType ? "szCollectorCode" : "szMailCode",
                gridDefObj: collectorType ? gridCollectorDefObj : gridMailCodeDefObj,
                gridWidth: 300,
                gridHeight: 300,
                gridNoOfRowsPerPage: 5,
                searchBoxWidth: "100%",
                searchBoxHeight: 30,
                searchBoxFontSize: 12,
                placeholder: intl.formatMessage({
                  id: collectorType ? "label.collector.collectorCode.placeholder" : "label.generateMail.mailCode.placeholder",
                  defaultMessage: collectorType ? "Select collector code" : "Select mail code"
                })
              }
            );
          }
        }
      ]
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.dependsOn",
        defaultMessage: "Depends On"
      }),
      field: "szDependsOn",
      width: 260,
      minWidth: 220,
      editable: false,
      filter: false,
      cellRenderer: dependsOnRenderer
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.successors",
        defaultMessage: "Successors"
      }),
      field: "szSuccessors",
      width: 260,
      minWidth: 220,
      editable: false,
      filter: false,
      cellRenderer: successorsRenderer
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.excludeCases",
        defaultMessage: "Exclude cases with"
      }),
      field: "szExcludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.define",
            defaultMessage: "Define"
          }),
          size: "small",
          margin: "0",
          onClick: () => {
            var _a, _b, _c, _d, _e;
            return onOpenFilter({
              rowKey: (_a = params.data) == null ? void 0 : _a.id,
              gridRowId: (_b = params.data) == null ? void 0 : _b.gridRowId,
              rowIndex: (_c = params.node) == null ? void 0 : _c.rowIndex,
              actionCode: (_d = params.data) == null ? void 0 : _d.szActionCode,
              field: "szExcludeCasesWith",
              initialValue: ((_e = params.data) == null ? void 0 : _e.szExcludeCasesWith) || ""
            });
          }
        }
      ) })
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.includeCases",
        defaultMessage: "Include cases with"
      }),
      field: "szIncludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.define",
            defaultMessage: "Define"
          }),
          size: "small",
          margin: "0",
          onClick: () => {
            var _a, _b, _c, _d, _e;
            return onOpenFilter({
              rowKey: (_a = params.data) == null ? void 0 : _a.id,
              gridRowId: (_b = params.data) == null ? void 0 : _b.gridRowId,
              rowIndex: (_c = params.node) == null ? void 0 : _c.rowIndex,
              actionCode: (_d = params.data) == null ? void 0 : _d.szActionCode,
              field: "szIncludeCasesWith",
              initialValue: ((_e = params.data) == null ? void 0 : _e.szIncludeCasesWith) || ""
            });
          }
        }
      ) })
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.active",
        defaultMessage: "Active"
      }),
      field: "chActiveYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(BoolCheckboxRenderer, { field: "chActiveYn", params })
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.auto",
        defaultMessage: "Auto"
      }),
      field: "chAutoActionYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(BoolCheckboxRenderer, { field: "chAutoActionYn", params })
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.accessControl",
        defaultMessage: "Access Control"
      }),
      field: "accessControl",
      width: 150,
      editable: false,
      filter: false,
      cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.accessControl",
            defaultMessage: "Access Control"
          }),
          size: "small",
          margin: "flex-center",
          onClick: () => {
            var _a;
            return onOpenAccess((_a = params.data) == null ? void 0 : _a.szActionCode);
          }
        }
      ) })
    }
  ];
}
const ACTIVE_FILTER_OPTIONS = ["all", "active", "inactive"];
const VIEW_ICONS = {
  grid: TableChartOutlinedIcon,
  detail: ViewSidebarOutlinedIcon
};
const STRATEGY_ACTION_FILTER_DEBUG = true;
const FILTER_DEBUG_TAG = "[StrategyActionFilterDebug]";
const StrategyActionMaster = () => {
  var _a;
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = (_a = location == null ? void 0 : location.state) == null ? void 0 : _a.menuId;
  const toast = ar();
  const gridRef = reactExports.useRef(null);
  const accessDialogRef = reactExports.useRef(null);
  const [allRows, setAllRows] = reactExports.useState([]);
  const [actionTypeOptions, setActionTypeOptions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [query, setQuery] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState(() => /* @__PURE__ */ new Set());
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [hasDependsFilter, setHasDependsFilter] = reactExports.useState(false);
  const [hasSuccessorsFilter, setHasSuccessorsFilter] = reactExports.useState(false);
  const [hasFilterFilter, setHasFilterFilter] = reactExports.useState(false);
  const [activeView, setActiveView] = reactExports.useState("grid");
  const [focusRowId, setFocusRowId] = reactExports.useState(null);
  const [detailDeletedRows, setDetailDeletedRows] = reactExports.useState([]);
  const [filterDialog, setFilterDialog] = reactExports.useState(null);
  const [filterDialogKey, setFilterDialogKey] = reactExports.useState(null);
  const [filterDraft, setFilterDraft] = reactExports.useState("");
  const [filterDraftDesc, setFilterDraftDesc] = reactExports.useState("");
  const [filterDraftCriteria, setFilterDraftCriteria] = reactExports.useState(null);
  const [filterDraftRuleEngineObj, setFilterDraftRuleEngineObj] = reactExports.useState(null);
  const [dmnJsons, setDmnJsons] = reactExports.useState([]);
  const filterDraftRef = reactExports.useRef("");
  const filterDraftDescRef = reactExports.useRef("");
  const filterDraftCriteriaRef = reactExports.useRef(null);
  const filterDraftRuleEngineObjRef = reactExports.useRef(null);
  const suppressEmptyFilterCallbacksRef = reactExports.useRef(false);
  const isRelationshipSanitizingRef = reactExports.useRef(false);
  const [accessDialogActionCode, setAccessDialogActionCode] = reactExports.useState(null);
  const rowOrderBeforeSaveRef = reactExports.useRef([]);
  const existingActionCodesRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const [filterCriteriaStateByKey, setFilterCriteriaStateByKey] = reactExports.useState({});
  const filterCriteriaStateByKeyRef = reactExports.useRef({});
  const writeFilterCriteriaState = reactExports.useCallback((rowStateKey, field, criteriaPayload) => {
    if (!rowStateKey || !field) return;
    setFilterCriteriaStateByKey((prev) => {
      const currentRowState = (prev == null ? void 0 : prev[rowStateKey]) && typeof prev[rowStateKey] === "object" ? prev[rowStateKey] : {};
      const next = {
        ...prev,
        [rowStateKey]: {
          ...currentRowState,
          [field]: {
            ruleDesc: String((criteriaPayload == null ? void 0 : criteriaPayload.ruleDesc) || ""),
            criteriaDto: Array.isArray(criteriaPayload == null ? void 0 : criteriaPayload.criteriaDto) ? criteriaPayload.criteriaDto : [],
            ruleEngineObj: (criteriaPayload == null ? void 0 : criteriaPayload.ruleEngineObj) && typeof criteriaPayload.ruleEngineObj === "object" ? criteriaPayload.ruleEngineObj : null
          }
        }
      };
      filterCriteriaStateByKeyRef.current = next;
      return next;
    });
  }, []);
  reactExports.useEffect(() => {
    filterCriteriaStateByKeyRef.current = filterCriteriaStateByKey || {};
  }, [filterCriteriaStateByKey]);
  const collectCurrentGridRows = reactExports.useCallback((api) => {
    const orderedRows = [];
    if (!api) return orderedRows;
    const displayedCount = typeof api.getDisplayedRowCount === "function" ? api.getDisplayedRowCount() : 0;
    if (displayedCount > 0 && typeof api.getDisplayedRowAtIndex === "function") {
      for (let index = 0; index < displayedCount; index += 1) {
        const node = api.getDisplayedRowAtIndex(index);
        if ((node == null ? void 0 : node.data) && !node.data._deleted) {
          orderedRows.push(node.data);
        }
      }
      return orderedRows;
    }
    api.forEachNode((node) => {
      if ((node == null ? void 0 : node.data) && !node.data._deleted) {
        orderedRows.push(node.data);
      }
    });
    return orderedRows;
  }, []);
  reactExports.useCallback(
    (params, direction) => {
      var _a2, _b;
      const api = (params == null ? void 0 : params.api) || ((_a2 = gridRef.current) == null ? void 0 : _a2.api);
      const orderedRows = collectCurrentGridRows(api);
      if (!orderedRows.length) return [];
      const currentGridRowId = (_b = params == null ? void 0 : params.data) == null ? void 0 : _b.gridRowId;
      const currentIndex = orderedRows.findIndex(
        (row) => row.gridRowId === currentGridRowId
      );
      return buildOrderedActionOptions(orderedRows, currentIndex, direction);
    },
    [collectCurrentGridRows]
  );
  const sanitizeGridRelationshipSelections = reactExports.useCallback(
    (rows) => {
      if (!Array.isArray(rows) || rows.length === 0) return;
      rows.forEach((row, index) => {
        var _a2, _b, _c, _d;
        const allowedDependsOn = buildOrderedActionOptions(rows, index, "dependsOn");
        const allowedSuccessors = buildOrderedActionOptions(rows, index, "successors");
        const nextDependsOn = sanitizeRelationshipSelection(row.szDependsOn, allowedDependsOn);
        const nextSuccessors = sanitizeRelationshipSelection(row.szSuccessors, allowedSuccessors);
        if ((row.szDependsOn || "") !== nextDependsOn) {
          (_b = (_a2 = gridRef.current) == null ? void 0 : _a2.updateRowFieldsByGridRowId) == null ? void 0 : _b.call(_a2, row.gridRowId, {
            szDependsOn: nextDependsOn
          });
        }
        if ((row.szSuccessors || "") !== nextSuccessors) {
          (_d = (_c = gridRef.current) == null ? void 0 : _c.updateRowFieldsByGridRowId) == null ? void 0 : _d.call(_c, row.gridRowId, {
            szSuccessors: nextSuccessors
          });
        }
      });
    },
    []
  );
  const buildRelationshipSearchOptions = reactExports.useCallback(
    (params, direction) => {
      var _a2;
      const api = (params == null ? void 0 : params.api) || ((_a2 = gridRef.current) == null ? void 0 : _a2.api);
      const orderedRows = collectCurrentGridRows(api);
      const currentIndex = orderedRows.findIndex(
        (row) => {
          var _a3;
          return row.gridRowId === ((_a3 = params == null ? void 0 : params.data) == null ? void 0 : _a3.gridRowId);
        }
      );
      const codeOptions = buildOrderedActionOptions(orderedRows, currentIndex, direction);
      const codeToDescription = /* @__PURE__ */ new Map();
      orderedRows.forEach((row) => {
        const code = normalizeActionCode(row == null ? void 0 : row.szActionCode);
        if (!code || codeToDescription.has(code)) return;
        codeToDescription.set(code, String((row == null ? void 0 : row.szDescription) || "").trim());
      });
      return codeOptions.map((code) => ({
        code,
        description: codeToDescription.get(code) || ""
      }));
    },
    [collectCurrentGridRows]
  );
  const buildRelationshipRenderer = reactExports.useCallback(
    (field, direction) => (params) => {
      var _a2;
      const api = (params == null ? void 0 : params.api) || ((_a2 = gridRef.current) == null ? void 0 : _a2.api);
      const options = buildRelationshipSearchOptions(params, direction);
      const currentSelection = parseRelationshipTokens(params == null ? void 0 : params.value).filter(
        (token, index, arr) => {
          const tokenKey = String(token || "").trim().toLowerCase();
          if (!tokenKey) return false;
          return arr.findIndex((x) => String(x || "").trim().toLowerCase() === tokenKey) === index;
        }
      );
      const optionCodeMap = new Map(
        options.map((opt) => [String(opt.code || "").trim().toLowerCase(), opt])
      );
      const mergedOptions = [...options];
      currentSelection.forEach((token) => {
        const tokenKey = String(token || "").trim().toLowerCase();
        if (!tokenKey || optionCodeMap.has(tokenKey)) return;
        mergedOptions.push({ code: token, description: "" });
      });
      const optionsKey = mergedOptions.map((opt) => opt.code).join("|");
      const stableRowIdentity = getStableRowIdentity(params == null ? void 0 : params.data);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        dc,
        {
          multiSelect: true,
          searchCode: `${direction}_${stableRowIdentity}_${optionsKey}`,
          customFetchFunction: async () => ({ data: { responseJson: mergedOptions } }),
          setSelectedValue: (selectedCodes) => {
            const nextValue = sanitizeRelationshipSelection(
              selectedCodes,
              mergedOptions.map((opt) => opt.code)
            );
            params.node.setDataValue(field, nextValue);
            markRowEdited(params.data);
            if (!isRelationshipSanitizingRef.current) {
              isRelationshipSanitizingRef.current = true;
              try {
                sanitizeGridRelationshipSelections(collectCurrentGridRows(api));
              } finally {
                isRelationshipSanitizingRef.current = false;
              }
            }
          },
          selectedValue: currentSelection,
          selectedColumn: "code",
          gridDefObj: gridStrategyActionRelationDefObj,
          gridWidth: 360,
          gridHeight: 300,
          gridNoOfRowsPerPage: 5,
          searchBoxWidth: 220,
          searchBoxHeight: 29,
          searchBoxFontSize: 11,
          translate: false,
          error: false
        },
        `${field}-${stableRowIdentity}-${joinActionTokens(currentSelection)}`
      );
    },
    [buildRelationshipSearchOptions, collectCurrentGridRows, sanitizeGridRelationshipSelections]
  );
  const dependsOnRenderer = reactExports.useMemo(
    () => buildRelationshipRenderer("szDependsOn", "dependsOn"),
    [buildRelationshipRenderer]
  );
  const successorsRenderer = reactExports.useMemo(
    () => buildRelationshipRenderer("szSuccessors", "successors"),
    [buildRelationshipRenderer]
  );
  const loadStrategyActions = reactExports.useCallback(async ({ preferredOrder = null } = {}) => {
    setLoading(true);
    try {
      const response = await Kr.GET(
        StrategyActionMasterAPI.StrategyActionMaster(screenMenuId)
      );
      const result = (response == null ? void 0 : response.data) || {};
      const payload = extractStrategyActionPayload(result);
      if (!payload) {
        toast.error(
          intl.formatMessage({
            id: "message.StrategyActionMaster.fetchEmpty",
            defaultMessage: "No data received from server."
          })
        );
        setAllRows([]);
        return;
      }
      if (Array.isArray(payload.lstStrategyAction)) {
        const mappedRows = mapRowsFromResponse(payload.lstStrategyAction);
        existingActionCodesRef.current = new Set(
          mappedRows.map((row) => normalizeActionCode(row == null ? void 0 : row.szActionCode).toLowerCase()).filter(Boolean)
        );
        const orderToApply = Array.isArray(preferredOrder) && preferredOrder.length > 0 ? preferredOrder : rowOrderBeforeSaveRef.current;
        const nextRows = reorderRowsByActionCode(mappedRows, orderToApply);
        setAllRows(nextRows);
        rowOrderBeforeSaveRef.current = extractRowOrderCodes(nextRows);
      }
      if (Array.isArray(payload.lstActionType)) {
        setActionTypeOptions(mapActionTypeOptions(payload.lstActionType));
      }
    } catch (error) {
      console.error("Fetch Strategy Action Master failed:", error);
      toast.error(
        intl.formatMessage({
          id: "message.StrategyActionMaster.fetchError",
          defaultMessage: "Error fetching Strategy Action Master data."
        })
      );
      setAllRows([]);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    loadStrategyActions();
  }, [loadStrategyActions]);
  const filterCriteria = reactExports.useMemo(
    () => ({
      query,
      typeFilter,
      activeFilter,
      hasDependsFilter,
      hasSuccessorsFilter,
      hasFilterFilter
    }),
    [
      query,
      typeFilter,
      activeFilter,
      hasDependsFilter,
      hasSuccessorsFilter,
      hasFilterFilter
    ]
  );
  const filteredRows = reactExports.useMemo(
    () => filterStrategyActionRows(allRows, filterCriteria),
    [allRows, filterCriteria]
  );
  const filteredCount = filteredRows.length;
  reactExports.useEffect(() => {
    var _a2, _b, _c;
    const api = (_a2 = gridRef.current) == null ? void 0 : _a2.api;
    if (!api) return;
    const hasActiveFilters = Boolean((_b = filterCriteria.query) == null ? void 0 : _b.trim()) || ((_c = filterCriteria.typeFilter) == null ? void 0 : _c.size) > 0 || filterCriteria.activeFilter !== "all" || filterCriteria.hasDependsFilter || filterCriteria.hasSuccessorsFilter || filterCriteria.hasFilterFilter;
    const taskId = setTimeout(() => {
      var _a3;
      const latestApi = (_a3 = gridRef.current) == null ? void 0 : _a3.api;
      if (!latestApi) return;
      latestApi.setGridOption("isExternalFilterPresent", () => hasActiveFilters);
      latestApi.setGridOption(
        "doesExternalFilterPass",
        (node) => filterStrategyActionRows([node.data], filterCriteria).length > 0
      );
      latestApi.onFilterChanged();
    }, 0);
    return () => clearTimeout(taskId);
  }, [filterCriteria, allRows]);
  reactExports.useCallback((filterData) => {
    const hasRuleDesc = Boolean(String((filterData == null ? void 0 : filterData.ruleDesc) || "").trim());
    const hasCriteria = Array.isArray(filterData == null ? void 0 : filterData.criteriaDto) && filterData.criteriaDto.length > 0;
    const isEmptyPayload = !hasRuleDesc && !hasCriteria;
    if (suppressEmptyFilterCallbacksRef.current && isEmptyPayload) {
      return;
    }
    if (!isEmptyPayload) {
      suppressEmptyFilterCallbacksRef.current = false;
    }
    const filterText = ((filterData == null ? void 0 : filterData.criteriaDto) || []).map((item) => item.szDescription).filter(Boolean).join(" ").trim() || (filterData == null ? void 0 : filterData.ruleDesc) || "";
    filterDraftRef.current = filterText;
    filterDraftDescRef.current = (filterData == null ? void 0 : filterData.ruleDesc) || "";
    filterDraftCriteriaRef.current = filterData || null;
    setFilterDraft(filterText);
    setFilterDraftDesc((filterData == null ? void 0 : filterData.ruleDesc) || "");
    setFilterDraftCriteria(filterData || null);
  }, []);
  const handleFilterMasterRuleEngineProps = reactExports.useCallback((obj) => {
    if (suppressEmptyFilterCallbacksRef.current && !obj) {
      return;
    }
    if (obj) {
      console.log("======", obj);
      suppressEmptyFilterCallbacksRef.current = false;
    }
    filterDraftRuleEngineObjRef.current = obj || null;
    setFilterDraftRuleEngineObj(obj || null);
  }, []);
  const getFilterStorageRowKeys = reactExports.useCallback((rowLike, fallbackRowKey = null, fallbackGridRowId = null, fallbackRowIndex = null) => {
    const fallbackRowIndexNumber = Number(fallbackRowIndex);
    const rowLikeIndexNumber = Number(rowLike == null ? void 0 : rowLike.rowIndex);
    const normalizedRowIndex = Number.isInteger(fallbackRowIndexNumber) ? fallbackRowIndexNumber : Number.isInteger(rowLikeIndexNumber) ? rowLikeIndexNumber : null;
    const stableGridRowId = String(
      (rowLike == null ? void 0 : rowLike.gridRowId) ?? fallbackGridRowId ?? ""
    ).trim();
    const rowIndexStateKey = stableGridRowId ? `rowIndex:${stableGridRowId}` : normalizedRowIndex != null ? `rowIndex:${normalizedRowIndex}` : "";
    const keys = [
      rowIndexStateKey,
      rowLike == null ? void 0 : rowLike.filterStorageId,
      rowLike == null ? void 0 : rowLike.gridRowId,
      fallbackGridRowId,
      rowLike == null ? void 0 : rowLike.id,
      fallbackRowKey,
      rowLike == null ? void 0 : rowLike.szActionCode
    ].map((value) => String(value || "").trim()).filter(Boolean);
    const uniqueKeys = Array.from(new Set(keys));
    {
      console.log(FILTER_DEBUG_TAG, "getFilterStorageRowKeys", {
        filterStorageId: rowLike == null ? void 0 : rowLike.filterStorageId,
        gridRowId: rowLike == null ? void 0 : rowLike.gridRowId,
        actionCode: rowLike == null ? void 0 : rowLike.szActionCode,
        id: rowLike == null ? void 0 : rowLike.id,
        rowIndexStateKey,
        fallbackRowIndex,
        fallbackRowKey,
        fallbackGridRowId,
        uniqueKeys
      });
    }
    return uniqueKeys;
  }, []);
  reactExports.useCallback((rowKeys) => {
    if (!Array.isArray(rowKeys) || rowKeys.length === 0) return null;
    const normalized = rowKeys.map((value) => String(value || "").trim()).filter(Boolean);
    if (normalized.length === 0) return null;
    const primaryKey = normalized[0];
    {
      console.log(FILTER_DEBUG_TAG, "getPrimaryFilterStorageRowKey", {
        rowKeys,
        normalized,
        primaryKey
      });
    }
    return primaryKey;
  }, []);
  const resolveFilterStateRowKey = reactExports.useCallback((rowKeys) => {
    const normalized = Array.isArray(rowKeys) ? rowKeys.map((value) => String(value || "").trim()).filter(Boolean) : [];
    if (normalized.length === 0) return null;
    const existingState = filterCriteriaStateByKeyRef.current || {};
    const existingKey = normalized.find(
      (key) => Boolean((existingState == null ? void 0 : existingState[key]) && typeof existingState[key] === "object")
    );
    const resolvedKey = existingKey || normalized[0];
    {
      const resolvedState = (existingState == null ? void 0 : existingState[resolvedKey]) || {};
      const excludeState = (resolvedState == null ? void 0 : resolvedState.szExcludeCasesWith) || null;
      const includeState = (resolvedState == null ? void 0 : resolvedState.szIncludeCasesWith) || null;
      console.log(FILTER_DEBUG_TAG, "resolveFilterStateRowKey", {
        rowKeys,
        normalized,
        existingKey,
        resolvedKey,
        hasExclude: Boolean(excludeState),
        excludeDesc: String((excludeState == null ? void 0 : excludeState.ruleDesc) || ""),
        excludeCriteriaCount: Array.isArray(excludeState == null ? void 0 : excludeState.criteriaDto) ? excludeState.criteriaDto.length : 0,
        hasInclude: Boolean(includeState),
        includeDesc: String((includeState == null ? void 0 : includeState.ruleDesc) || ""),
        includeCriteriaCount: Array.isArray(includeState == null ? void 0 : includeState.criteriaDto) ? includeState.criteriaDto.length : 0
      });
    }
    return resolvedKey;
  }, []);
  const buildFilterStateSnapshot = reactExports.useCallback((rowKeys) => {
    var _a2;
    const resolvedKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedKey) {
      return {
        resolvedKey: null,
        excludeDesc: "",
        excludeCriteriaCount: 0,
        includeDesc: "",
        includeCriteriaCount: 0
      };
    }
    const rowState = ((_a2 = filterCriteriaStateByKeyRef.current) == null ? void 0 : _a2[resolvedKey]) || {};
    const excludeState = (rowState == null ? void 0 : rowState.szExcludeCasesWith) || null;
    const includeState = (rowState == null ? void 0 : rowState.szIncludeCasesWith) || null;
    return {
      resolvedKey,
      excludeDesc: String((excludeState == null ? void 0 : excludeState.ruleDesc) || ""),
      excludeCriteriaCount: Array.isArray(excludeState == null ? void 0 : excludeState.criteriaDto) ? excludeState.criteriaDto.length : 0,
      includeDesc: String((includeState == null ? void 0 : includeState.ruleDesc) || ""),
      includeCriteriaCount: Array.isArray(includeState == null ? void 0 : includeState.criteriaDto) ? includeState.criteriaDto.length : 0
    };
  }, [resolveFilterStateRowKey]);
  const readPersistedFilterField = reactExports.useCallback((rowKeys, field) => {
    var _a2, _b;
    if (!Array.isArray(rowKeys) || rowKeys.length === 0 || !field) return null;
    const resolvedRowKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedRowKey) return null;
    try {
      const persistedValue = (_b = (_a2 = filterCriteriaStateByKeyRef.current) == null ? void 0 : _a2[resolvedRowKey]) == null ? void 0 : _b[field];
      if (!persistedValue) return null;
      const ruleDesc = String((persistedValue == null ? void 0 : persistedValue.ruleDesc) || "");
      const criteriaDto = Array.isArray(persistedValue == null ? void 0 : persistedValue.criteriaDto) ? persistedValue.criteriaDto : [];
      const ruleEngineObj = (persistedValue == null ? void 0 : persistedValue.ruleEngineObj) && typeof persistedValue.ruleEngineObj === "object" ? persistedValue.ruleEngineObj : null;
      const filterDraft2 = criteriaDto.map((item) => item == null ? void 0 : item.szDescription).filter(Boolean).join(" ").trim() || ruleDesc;
      if (STRATEGY_ACTION_FILTER_DEBUG) {
        console.log(FILTER_DEBUG_TAG, "readPersistedFilterField", {
          field,
          resolvedRowKey,
          rowStateFieldKey: `${resolvedRowKey}.${field}`,
          ruleDesc,
          criteriaCount: criteriaDto.length
        });
      }
      return {
        filterDraft: filterDraft2,
        filterDraftDesc: ruleDesc,
        filterDraftCriteria: {
          ruleDesc,
          criteriaDto
        },
        filterDraftRuleEngineObj: ruleEngineObj
      };
    } catch (error) {
      console.warn("Unable to read in-memory filter criteria state", error);
      return null;
    }
  }, [resolveFilterStateRowKey]);
  const writePersistedFilterCriteriaJson = reactExports.useCallback((rowKeys, field, value) => {
    if (!Array.isArray(rowKeys) || rowKeys.length === 0 || !field) return;
    const resolvedRowKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedRowKey) return;
    const criteriaPayload = {
      ruleDesc: String((value == null ? void 0 : value.ruleDesc) || ""),
      criteriaDto: Array.isArray(value == null ? void 0 : value.criteriaDto) ? value.criteriaDto : [],
      ruleEngineObj: (value == null ? void 0 : value.ruleEngineObj) && typeof value.ruleEngineObj === "object" ? value.ruleEngineObj : null
    };
    {
      console.log(FILTER_DEBUG_TAG, "writePersistedFilterCriteriaJson", {
        rowKeys,
        resolvedRowKey,
        field,
        rowStateFieldKey: `${resolvedRowKey}.${field}`,
        ruleDesc: criteriaPayload.ruleDesc,
        criteriaCount: criteriaPayload.criteriaDto.length
      });
    }
    try {
      writeFilterCriteriaState(resolvedRowKey, field, criteriaPayload);
    } catch (error) {
      console.warn("Unable to persist filter criteria state", error);
    }
  }, [resolveFilterStateRowKey, writeFilterCriteriaState]);
  const saveFilterDialogToStorage = reactExports.useCallback(({
    dialog = filterDialog,
    draft = filterDraft,
    desc = filterDraftDesc,
    criteria = filterDraftCriteria,
    ruleEngineObj = filterDraftRuleEngineObj
  } = {}) => {
    if (!(dialog == null ? void 0 : dialog.rowKey) || !(dialog == null ? void 0 : dialog.field)) return;
    const storageRowKeys = Array.isArray(dialog == null ? void 0 : dialog.storageRowKeys) && dialog.storageRowKeys.length > 0 ? dialog.storageRowKeys : [dialog.rowKey];
    {
      console.log(FILTER_DEBUG_TAG, "saveFilterDialogToStorage", {
        dialog,
        storageRowKeys,
        draft,
        desc
      });
    }
    writePersistedFilterCriteriaJson(storageRowKeys, dialog.field, {
      ruleDesc: desc,
      criteriaDto: Array.isArray(criteria == null ? void 0 : criteria.criteriaDto) ? criteria.criteriaDto : [],
      ruleEngineObj
    });
    {
      console.log(FILTER_DEBUG_TAG, "saveFilterDialogToStorage.afterWrite", {
        field: dialog.field,
        storageRowKeys,
        snapshot: buildFilterStateSnapshot(storageRowKeys)
      });
    }
  }, [
    buildFilterStateSnapshot,
    filterDialog,
    filterDraft,
    filterDraftCriteria,
    filterDraftDesc,
    filterDraftRuleEngineObj,
    writePersistedFilterCriteriaJson
  ]);
  const handleCancelFilterDialog = reactExports.useCallback(() => {
    suppressEmptyFilterCallbacksRef.current = false;
    setFilterDialog(null);
  }, []);
  const handleOpenFilter = reactExports.useCallback(
    ({ rowKey, gridRowId, rowIndex, actionCode, field, initialValue = "" }) => {
      var _a2, _b, _c, _d, _e;
      const row = allRows.find((item) => item.id === rowKey);
      let existingRow = row;
      if (gridRowId != null && ((_a2 = gridRef.current) == null ? void 0 : _a2.api)) {
        gridRef.current.api.forEachNode((node) => {
          var _a3;
          if (((_a3 = node.data) == null ? void 0 : _a3.gridRowId) === gridRowId) {
            existingRow = node.data;
          }
        });
      }
      const existingDesc = existingRow ? field === "szExcludeCasesWith" ? existingRow.szExcludeCasesWithRuleDesc || existingRow.szExcludeCasesWith || "" : existingRow.szIncludeCasesWithRuleDesc || existingRow.szIncludeCasesWith || "" : "";
      const existingCriteria = existingRow ? field === "szExcludeCasesWith" ? existingRow.szExcludeCasesWithCriteriaDto : existingRow.szIncludeCasesWithCriteriaDto : null;
      const existingRuleEngineObj = existingRow ? field === "szExcludeCasesWith" ? existingRow.szExcludeCasesWithObj : existingRow.szIncludeCasesWithObj : null;
      const storageRowKeys = getFilterStorageRowKeys(
        existingRow,
        rowKey,
        gridRowId,
        rowIndex
      );
      const resolvedRowStateKey = resolveFilterStateRowKey(storageRowKeys);
      const dmnStateEntry = dmnJsons.find(
        (entry) => (entry == null ? void 0 : entry.rowStateKey) === resolvedRowStateKey && (entry == null ? void 0 : entry.field) === field
      );
      const persistedFieldState = readPersistedFilterField(storageRowKeys, field);
      const persistedInitialFilterJson = (persistedFieldState == null ? void 0 : persistedFieldState.filterDraftCriteria) || null;
      const persistedDraft = (persistedFieldState == null ? void 0 : persistedFieldState.filterDraft) ?? null;
      const persistedDesc = (persistedFieldState == null ? void 0 : persistedFieldState.filterDraftDesc) ?? null;
      const persistedCriteria = (persistedFieldState == null ? void 0 : persistedFieldState.filterDraftCriteria) ?? null;
      const persistedRuleEngineObj = (persistedFieldState == null ? void 0 : persistedFieldState.filterDraftRuleEngineObj) ?? null;
      const normalizeCriteriaPayload = (criteriaValue, ruleDescValue = "") => {
        if (Array.isArray(criteriaValue)) {
          return {
            ruleDesc: String(ruleDescValue || ""),
            criteriaDto: criteriaValue
          };
        }
        if (criteriaValue && typeof criteriaValue === "object") {
          return {
            ruleDesc: String(criteriaValue.ruleDesc || ruleDescValue || ""),
            criteriaDto: Array.isArray(criteriaValue.criteriaDto) ? criteriaValue.criteriaDto : []
          };
        }
        return {
          ruleDesc: String(ruleDescValue || ""),
          criteriaDto: []
        };
      };
      const existingCriteriaPayload = normalizeCriteriaPayload(existingCriteria, existingDesc);
      const persistedCriteriaPayload = normalizeCriteriaPayload(persistedCriteria, persistedDesc || existingDesc);
      const hasExistingCriteria = existingCriteriaPayload.criteriaDto.length > 0;
      const hasExistingDesc = Boolean(String(existingDesc || "").trim());
      const shouldPreferExisting = hasExistingCriteria || hasExistingDesc;
      const nextDraft = shouldPreferExisting ? initialValue || existingDesc : persistedDraft !== null ? persistedDraft : initialValue || existingDesc;
      const nextDesc = shouldPreferExisting ? existingDesc : persistedDesc !== null ? persistedDesc : existingDesc;
      const nextCriteria = shouldPreferExisting ? existingCriteriaPayload : persistedCriteriaPayload;
      const nextRuleEngineObj = shouldPreferExisting ? existingRuleEngineObj || (dmnStateEntry == null ? void 0 : dmnStateEntry.dmnContext) || null : persistedRuleEngineObj || (dmnStateEntry == null ? void 0 : dmnStateEntry.dmnContext) || existingRuleEngineObj || null;
      const derivedCriteriaFromRuleEngine = {
        ruleDesc: String(((_b = nextRuleEngineObj == null ? void 0 : nextRuleEngineObj.ruleInfo) == null ? void 0 : _b.ruleDesc) || ""),
        criteriaDto: Array.isArray((_e = (_d = (_c = nextRuleEngineObj == null ? void 0 : nextRuleEngineObj.dmnInfo) == null ? void 0 : _c.contexts) == null ? void 0 : _d[0]) == null ? void 0 : _e.criteriaDto) ? nextRuleEngineObj.dmnInfo.contexts[0].criteriaDto : []
      };
      const hasNextCriteria = nextCriteria.criteriaDto.length > 0 || Boolean(String(nextCriteria.ruleDesc || "").trim());
      const hasDerivedCriteria = derivedCriteriaFromRuleEngine.criteriaDto.length > 0 || Boolean(String(derivedCriteriaFromRuleEngine.ruleDesc || "").trim());
      const nextInitialFilterJson = hasNextCriteria ? nextCriteria : hasDerivedCriteria ? derivedCriteriaFromRuleEngine : persistedInitialFilterJson || null;
      {
        console.log(FILTER_DEBUG_TAG, "handleOpenFilter", {
          rowKey,
          gridRowId,
          rowIndex,
          actionCode,
          field,
          initialValue,
          existingDesc,
          storageRowKeys,
          persistedFieldState,
          selectedDraft: nextDraft,
          selectedDesc: nextDesc,
          shouldPreferExisting,
          snapshot: buildFilterStateSnapshot(storageRowKeys)
        });
      }
      setFilterDraft(nextDraft);
      setFilterDraftDesc(nextDesc);
      setFilterDraftCriteria(nextCriteria);
      setFilterDraftRuleEngineObj(nextRuleEngineObj);
      filterDraftRef.current = nextDraft;
      filterDraftDescRef.current = nextDesc;
      filterDraftCriteriaRef.current = nextCriteria;
      filterDraftRuleEngineObjRef.current = nextRuleEngineObj;
      suppressEmptyFilterCallbacksRef.current = true;
      const resolvedActionCode = normalizeActionCode(actionCode) || normalizeActionCode(existingRow == null ? void 0 : existingRow.szActionCode);
      setFilterDialogKey(
        `${resolvedActionCode || rowKey || gridRowId || "row"}-${rowIndex ?? "na"}-${field}`
      );
      setFilterDialog({
        rowKey,
        gridRowId,
        rowIndex,
        actionCode: resolvedActionCode,
        field,
        storageRowKeys,
        initialFilterJson: nextInitialFilterJson,
        jsonByState: Boolean(dmnStateEntry == null ? void 0 : dmnStateEntry.dmnContext),
        dmnJsonByState: (dmnStateEntry == null ? void 0 : dmnStateEntry.dmnContext) || null
      });
    },
    [allRows, dmnJsons, getFilterStorageRowKeys, readPersistedFilterField, resolveFilterStateRowKey]
  );
  const handleUpdateRow = reactExports.useCallback((rowId, fields) => {
    setAllRows(
      (prev) => prev.map((row) => {
        if (row.id !== rowId) return row;
        const mode = row.mode === "N" ? "N" : "E";
        const nextCode = fields.szActionCode ?? row.szActionCode;
        return {
          ...row,
          ...fields,
          id: row.mode === "N" ? nextCode || row.id : row.id,
          mode
        };
      })
    );
  }, []);
  reactExports.useCallback(
    (rowCode, columnCode) => {
      if (!rowCode || !columnCode || rowCode === columnCode) return;
      setAllRows((prev) => {
        const targetRow = prev.find((item) => item.szActionCode === rowCode);
        const columnRow = prev.find((item) => item.szActionCode === columnCode);
        if (!targetRow || !columnRow) return prev;
        const targetDependsOn = parseRelationshipTokens(targetRow.szDependsOn);
        const targetSuccessors = parseRelationshipTokens(targetRow.szSuccessors);
        parseRelationshipTokens(columnRow.szDependsOn);
        parseRelationshipTokens(columnRow.szSuccessors);
        const isCurrentlyDependency = targetDependsOn.includes(columnCode);
        const updatedTargetDependsOn = isCurrentlyDependency ? targetDependsOn.filter((token) => token !== columnCode) : [.../* @__PURE__ */ new Set([...targetDependsOn, columnCode])];
        const updatedTargetSuccessors = targetSuccessors.filter(
          (token) => token !== columnCode
        );
        return prev.map((row) => {
          if (row.szActionCode !== rowCode) {
            return row;
          }
          return {
            ...row,
            mode: row.mode === "N" ? "N" : "E",
            szDependsOn: joinActionTokens(updatedTargetDependsOn),
            szSuccessors: joinActionTokens(updatedTargetSuccessors)
          };
        });
      });
    },
    []
  );
  const handleDetailDelete = reactExports.useCallback((row) => {
    if (!row) return;
    if (row.mode === "N") {
      setAllRows((prev) => prev.filter((item) => item.id !== row.id));
    } else {
      setDetailDeletedRows((prev) => [...prev, { ...row, mode: "D" }]);
      setAllRows((prev) => prev.filter((item) => item.id !== row.id));
    }
    if (focusRowId === row.id) {
      setFocusRowId(null);
    }
  }, [focusRowId]);
  const handleOpenAccess = reactExports.useCallback((actionCode) => {
    if (!(actionCode == null ? void 0 : actionCode.trim())) {
      toast.warning(
        intl.formatMessage({
          id: "message.StrategyActionMaster.actionCodeRequired",
          defaultMessage: "Save the action code before configuring access control."
        })
      );
      return;
    }
    setAccessDialogActionCode(actionCode);
  }, [intl, toast]);
  const columnDefs = reactExports.useMemo(
    () => getStrategyActionMasterColumnDefs({
      intl,
      actionTypeOptions,
      onOpenFilter: handleOpenFilter,
      onOpenAccess: handleOpenAccess,
      dependsOnRenderer,
      successorsRenderer
    }),
    [
      intl,
      actionTypeOptions,
      handleOpenFilter,
      handleOpenAccess,
      dependsOnRenderer,
      successorsRenderer
    ]
  );
  const hydrateRowWithPersistedFilterState = reactExports.useCallback(
    (row) => {
      var _a2, _b;
      if (!row) return row;
      const rowKey = row.id || row.szActionCode;
      if (!rowKey) return row;
      const storageRowKeys = getFilterStorageRowKeys(
        row,
        rowKey,
        row == null ? void 0 : row.gridRowId
      );
      const hydrateField = (field) => {
        return readPersistedFilterField(storageRowKeys, field);
      };
      const excludePersisted = hydrateField("szExcludeCasesWith");
      const includePersisted = hydrateField("szIncludeCasesWith");
      const excludeCriteriaFromRow = Array.isArray(row.szExcludeCasesWithCriteriaDto) ? row.szExcludeCasesWithCriteriaDto : [];
      const excludeCriteriaFromPersisted = Array.isArray((_a2 = excludePersisted == null ? void 0 : excludePersisted.filterDraftCriteria) == null ? void 0 : _a2.criteriaDto) ? excludePersisted.filterDraftCriteria.criteriaDto : [];
      const includeCriteriaFromRow = Array.isArray(row.szIncludeCasesWithCriteriaDto) ? row.szIncludeCasesWithCriteriaDto : [];
      const includeCriteriaFromPersisted = Array.isArray((_b = includePersisted == null ? void 0 : includePersisted.filterDraftCriteria) == null ? void 0 : _b.criteriaDto) ? includePersisted.filterDraftCriteria.criteriaDto : [];
      return {
        ...row,
        szExcludeCasesWith: row.szExcludeCasesWith || (excludePersisted == null ? void 0 : excludePersisted.filterDraft) || "",
        szExcludeCasesWithRuleDesc: row.szExcludeCasesWithRuleDesc || (excludePersisted == null ? void 0 : excludePersisted.filterDraftDesc) || "",
        szExcludeCasesWithCriteriaDto: excludeCriteriaFromRow.length > 0 ? excludeCriteriaFromRow : excludeCriteriaFromPersisted,
        szExcludeCasesWithObj: row.szExcludeCasesWithObj || (excludePersisted == null ? void 0 : excludePersisted.filterDraftRuleEngineObj) || null,
        szIncludeCasesWith: row.szIncludeCasesWith || (includePersisted == null ? void 0 : includePersisted.filterDraft) || "",
        szIncludeCasesWithRuleDesc: row.szIncludeCasesWithRuleDesc || (includePersisted == null ? void 0 : includePersisted.filterDraftDesc) || "",
        szIncludeCasesWithCriteriaDto: includeCriteriaFromRow.length > 0 ? includeCriteriaFromRow : includeCriteriaFromPersisted,
        szIncludeCasesWithObj: row.szIncludeCasesWithObj || (includePersisted == null ? void 0 : includePersisted.filterDraftRuleEngineObj) || null
      };
    },
    [getFilterStorageRowKeys, readPersistedFilterField]
  );
  const persistStrategyActionChanges = reactExports.useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      var _a2, _b, _c, _d;
      try {
        const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
        const resolveSaveMode = (row, fallbackMode) => {
          if (fallbackMode === "D") return "D";
          const actionCodeKey = normalizeActionCode(row == null ? void 0 : row.szActionCode).toLowerCase();
          const existsInFetchedData = Boolean(actionCodeKey) && existingActionCodesRef.current.has(actionCodeKey);
          if (fallbackMode === "N" && existsInFetchedData) {
            return "E";
          }
          if (fallbackMode === "E" && !existsInFetchedData && (row == null ? void 0 : row.mode) === "N") {
            return "N";
          }
          return fallbackMode;
        };
        const hydratedNewRows = newRows.map(hydrateRowWithPersistedFilterState);
        const hydratedUpdatedRows = updatedRows.map(hydrateRowWithPersistedFilterState);
        const hydratedDeletedRows = deletedRows.map(hydrateRowWithPersistedFilterState);
        const liveRows = collectCurrentGridRows((_a2 = gridRef.current) == null ? void 0 : _a2.api);
        const fallbackRows = Array.isArray(allRows) ? allRows.filter((row) => row && !row._deleted) : [];
        const orderedSourceRows = liveRows.length > 0 ? liveRows : fallbackRows;
        const liveOrderCodes = extractRowOrderCodes(orderedSourceRows);
        const hasDeletion = hydratedDeletedRows.length > 0;
        const hasOrderChange = !areOrdersEqual(
          liveOrderCodes,
          rowOrderBeforeSaveRef.current
        );
        const shouldSendFullOrderedPayload = hasOrderChange || hasDeletion;
        const orderedRows = orderedSourceRows;
        const getPayloadRowIdentity = (row) => {
          const byGridRowId = String((row == null ? void 0 : row.gridRowId) || "").trim();
          if (byGridRowId) return `grid:${byGridRowId}`.toLowerCase();
          const byId = String((row == null ? void 0 : row.id) || "").trim();
          if (byId) return `id:${byId}`.toLowerCase();
          return String((row == null ? void 0 : row.szActionCode) || "").trim().toLowerCase();
        };
        const deletedIdentitySet = new Set(
          hydratedDeletedRows.map((row) => getPayloadRowIdentity(row)).filter(Boolean)
        );
        const orderIndexByRowKey = /* @__PURE__ */ new Map();
        orderedRows.forEach((row, index) => {
          const rowKey = getPayloadRowIdentity(row);
          if (!rowKey || orderIndexByRowKey.has(rowKey)) return;
          orderIndexByRowKey.set(rowKey, index);
        });
        const toOrderedSaveEntries = (rows, mode) => rows.map((row) => {
          const resolvedMode = resolveSaveMode(row, mode);
          const rowKey = getPayloadRowIdentity(row);
          const orderIndex = orderIndexByRowKey.has(rowKey) ? orderIndexByRowKey.get(rowKey) : null;
          const saveRow = buildSaveRow(
            row,
            resolvedMode,
            userCode,
            {
              lnStrActSeqNo: Number.isInteger(orderIndex) ? orderIndex + 1 : row == null ? void 0 : row.lnStrActSeqNo
            }
          );
          return { rowKey, saveRow };
        }).filter((entry) => {
          var _a3;
          if (!entry.rowKey) return true;
          return ((_a3 = entry.saveRow) == null ? void 0 : _a3.szMode) === "D" || !deletedIdentitySet.has(entry.rowKey);
        });
        const sortSaveEntriesByGridOrder = (entries) => entries.map((entry, index) => ({
          ...entry,
          index,
          order: orderIndexByRowKey.has(entry.rowKey) ? orderIndexByRowKey.get(entry.rowKey) : Number.MAX_SAFE_INTEGER
        })).sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.index - b.index;
        }).map((entry) => entry.saveRow);
        const orderedChangedPayload = sortSaveEntriesByGridOrder([
          ...toOrderedSaveEntries(hydratedNewRows, "N"),
          ...toOrderedSaveEntries(hydratedUpdatedRows, "E")
        ]);
        const orderedDeletedPayload = sortSaveEntriesByGridOrder(
          toOrderedSaveEntries(hydratedDeletedRows, "D")
        );
        let payload = [...orderedChangedPayload, ...orderedDeletedPayload];
        if (shouldSendFullOrderedPayload) {
          const orderedLivePayload = orderedSourceRows.filter((row) => {
            const rowIdentity = getPayloadRowIdentity(row);
            if (!rowIdentity) return true;
            return !deletedIdentitySet.has(rowIdentity);
          }).map(
            (row, index) => buildSaveRow(
              hydrateRowWithPersistedFilterState(row),
              resolveSaveMode(row, row.mode === "N" ? "N" : "E"),
              userCode,
              { lnStrActSeqNo: index + 1 }
            )
          );
          payload = [...orderedLivePayload, ...orderedDeletedPayload];
        }
        if (payload.length === 0) {
          return { success: true, masterNoChanges: true };
        }
        const response = await Kr.POST(
          StrategyActionMasterAPI.StrategyActionMaster(screenMenuId),
          payload
        );
        const result = (response == null ? void 0 : response.data) || {};
        const status = (response == null ? void 0 : response.status) ?? 0;
        if (status >= 400) {
          console.error(
            "Strategy Action save rejected:",
            JSON.stringify({ status, result, payload }, null, 2)
          );
          if (result == null ? void 0 : result.errors) {
            handleValidationErrors(intl, toast, result.errors);
            return { success: false };
          }
          toast.error(
            intl.formatMessage({
              id: "error.strategyActionSaveFailed",
              defaultMessage: "Failed to save strategy actions."
            })
          );
          return { success: false };
        }
        setDetailDeletedRows([]);
        const nextLiveRows = collectCurrentGridRows((_b = gridRef.current) == null ? void 0 : _b.api);
        if (nextLiveRows.length > 0) {
          setAllRows(
            nextLiveRows.map((row) => {
              const nextCode = normalizeActionCode(row == null ? void 0 : row.szActionCode);
              return {
                ...row,
                id: nextCode || row.id,
                mode: ""
              };
            })
          );
          rowOrderBeforeSaveRef.current = extractRowOrderCodes(nextLiveRows);
        } else {
          await loadStrategyActions();
        }
        return { success: true };
      } catch (error) {
        console.error("Failed to save data:", error);
        const data = (_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data;
        if (data) {
          console.error(
            "Strategy Action save error body:",
            JSON.stringify({
              status: (_d = error == null ? void 0 : error.response) == null ? void 0 : _d.status,
              data,
              payloadPreview: {
                entries: [
                  ...newRows || [],
                  ...updatedRows || [],
                  ...deletedRows || []
                ].map((row) => ({
                  szActionCode: row == null ? void 0 : row.szActionCode,
                  szRuleName: row == null ? void 0 : row.szRuleName
                }))
              }
            }, null, 2)
          );
        }
        if (data == null ? void 0 : data.errors) {
          handleValidationErrors(intl, toast, data.errors);
        } else {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "error.saveData.strategyAction",
              defaultMessage: "Error saving Strategy Action Master."
            })
          );
        }
        return { success: false };
      }
    },
    [
      collectCurrentGridRows,
      allRows,
      intl,
      toast,
      loadStrategyActions,
      hydrateRowWithPersistedFilterState
    ]
  );
  const handleGridSave = reactExports.useCallback(
    async (changeSet) => persistStrategyActionChanges(changeSet),
    [persistStrategyActionChanges]
  );
  const persistStagedAccessSelections = reactExports.useCallback(async () => {
    const cachedSelectionsByAction = kl(ACCESS_SELECTION_CACHE_KEY);
    const stagedEntries = Object.entries(
      cachedSelectionsByAction && typeof cachedSelectionsByAction === "object" ? cachedSelectionsByAction : {}
    ).map(([actionCodeKey, selectedRows]) => ({
      actionCode: actionCodeKey,
      selectedProfileCodes: (Array.isArray(selectedRows) ? selectedRows : []).map((row) => String((row == null ? void 0 : row.profileCode) || (row == null ? void 0 : row.szGroupId) || "").trim()).filter(Boolean)
    }));
    if (stagedEntries.length === 0) {
      return { success: true };
    }
    const response = await Kr.GET(
      StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, "fetchStrategyActionAccess")
    );
    const accessList = getAccessList(response == null ? void 0 : response.data);
    const normalizedMappings = Array.isArray(accessList) ? accessList : [];
    const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const payload = [];
    stagedEntries.forEach((entry) => {
      const selectedActionCode = normalizeActionCode(entry == null ? void 0 : entry.actionCode);
      const actionCodeKey = normalizeAccessCode(selectedActionCode);
      if (!selectedActionCode || !actionCodeKey) return;
      const selectedCodes = new Set(
        (Array.isArray(entry == null ? void 0 : entry.selectedProfileCodes) ? entry.selectedProfileCodes : []).map((code) => normalizeAccessCode(code)).filter(Boolean)
      );
      const previousMappingsForAction = normalizedMappings.filter((item) => normalizeAccessCode(item == null ? void 0 : item.szActionCode) === actionCodeKey).map((item) => String((item == null ? void 0 : item.szGroupId) || "").trim()).filter(Boolean);
      const previousCodeSet = new Set(
        previousMappingsForAction.map((code) => normalizeAccessCode(code))
      );
      selectedCodes.forEach((profileCode) => {
        if (previousCodeSet.has(profileCode)) return;
        payload.push({
          szActionCode: selectedActionCode,
          szGroupId: profileCode,
          szUser: userCode,
          szMode: "N"
        });
      });
      previousMappingsForAction.forEach((profileCode) => {
        if (selectedCodes.has(normalizeAccessCode(profileCode))) return;
        payload.push({
          szActionCode: selectedActionCode,
          szGroupId: profileCode,
          szUser: userCode,
          szMode: "D"
        });
      });
    });
    if (payload.length === 0) {
      return { success: true };
    }
    const saveResponse = await Kr.POST(
      StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, "saveStrategyActionAccess"),
      payload
    );
    const result = (saveResponse == null ? void 0 : saveResponse.data) || {};
    const status = (saveResponse == null ? void 0 : saveResponse.status) ?? 0;
    if (status >= 400) {
      throw new Error((result == null ? void 0 : result.message) || "Failed to save Strategy Action Access.");
    }
    Ol(ACCESS_SELECTION_CACHE_KEY, {});
    return { success: true };
  }, [intl, toast]);
  const handleMasterSave = reactExports.useCallback(async () => {
    var _a2, _b, _c, _d;
    let masterSaveResult = { success: false };
    if (activeView === "grid") {
      if (!isRelationshipSanitizingRef.current) {
        isRelationshipSanitizingRef.current = true;
        try {
          const orderedRows = collectCurrentGridRows((_a2 = gridRef.current) == null ? void 0 : _a2.api);
          sanitizeGridRelationshipSelections(orderedRows);
        } finally {
          isRelationshipSanitizingRef.current = false;
        }
      }
      masterSaveResult = await ((_c = (_b = gridRef.current) == null ? void 0 : _b.submitChanges) == null ? void 0 : _c.call(_b)) || { success: false };
    } else if (activeView === "detail") {
      const newRows = allRows.filter((row) => row.mode === "N");
      const updatedRows = allRows.filter((row) => row.mode === "E");
      masterSaveResult = await persistStrategyActionChanges({
        newRows,
        updatedRows,
        deletedRows: detailDeletedRows
      });
    } else {
      toast.info(
        intl.formatMessage({
          id: "message.StrategyActionMaster.noChanges",
          defaultMessage: "No changes to save."
        })
      );
      return { success: false };
    }
    if (!(masterSaveResult == null ? void 0 : masterSaveResult.success)) {
      return masterSaveResult;
    }
    if (accessDialogActionCode && ((_d = accessDialogRef.current) == null ? void 0 : _d.submitAccessChanges)) {
      await accessDialogRef.current.submitAccessChanges();
    } else {
      try {
        await persistStagedAccessSelections();
      } catch (error) {
        toast.error(
          (error == null ? void 0 : error.message) || intl.formatMessage({
            id: "message.StrategyActionAccess.saveError",
            defaultMessage: "Failed to save Strategy Action Access."
          })
        );
        return { success: false };
      }
    }
    await loadStrategyActions();
    return masterSaveResult;
  }, [
    activeView,
    accessDialogActionCode,
    allRows,
    collectCurrentGridRows,
    detailDeletedRows,
    intl,
    loadStrategyActions,
    persistStagedAccessSelections,
    persistStrategyActionChanges,
    sanitizeGridRelationshipSelections,
    toast
  ]);
  const handleReset = reactExports.useCallback(async () => {
    setQuery("");
    setTypeFilter(/* @__PURE__ */ new Set());
    setActiveFilter("all");
    setHasDependsFilter(false);
    setHasSuccessorsFilter(false);
    setHasFilterFilter(false);
    setFocusRowId(null);
    setDetailDeletedRows([]);
    await loadStrategyActions();
    return { success: true };
  }, [loadStrategyActions]);
  const handleNewAction = reactExports.useCallback(() => {
    const newRow = getDefaultStrategyActionRow();
    if (actionTypeOptions && actionTypeOptions.length > 0) {
      newRow.szActionType = actionTypeOptions[0].value;
    }
    setAllRows((prev) => [newRow, ...prev]);
    if (activeView !== "dependencies") {
      setActiveView("detail");
    }
    setFocusRowId(newRow.id);
  }, [actionTypeOptions, activeView]);
  const filterDialogActionCode = (() => {
    var _a2, _b;
    const dialogActionCode = normalizeActionCode(filterDialog == null ? void 0 : filterDialog.actionCode);
    if (dialogActionCode) return dialogActionCode;
    if ((filterDialog == null ? void 0 : filterDialog.gridRowId) != null && ((_a2 = gridRef.current) == null ? void 0 : _a2.api)) {
      let fromGrid = "";
      gridRef.current.api.forEachNode((node) => {
        var _a3, _b2;
        if (((_a3 = node.data) == null ? void 0 : _a3.gridRowId) === filterDialog.gridRowId) {
          fromGrid = normalizeActionCode((_b2 = node.data) == null ? void 0 : _b2.szActionCode);
        }
      });
      if (fromGrid) return fromGrid;
    }
    if (filterDialog == null ? void 0 : filterDialog.rowKey) {
      const fromState = normalizeActionCode(
        (_b = allRows.find((r) => r.id === filterDialog.rowKey)) == null ? void 0 : _b.szActionCode
      );
      if (fromState) return fromState;
    }
    return "DRAFT";
  })();
  const filterDialogRuleName = (filterDialog == null ? void 0 : filterDialog.field) === "szExcludeCasesWith" ? `${filterDialogActionCode}_SA_EX` : `${filterDialogActionCode}_SA_IN`;
  const resolveFilterCriteriaPayload = reactExports.useCallback(({
    desc,
    criteria,
    ruleEngineObj,
    fallbackDesc,
    fallbackCriteria,
    fallbackRuleEngineObj
  }) => {
    const candidates = [
      Array.isArray(criteria == null ? void 0 : criteria.criteriaDto) ? criteria.criteriaDto : [],
      Array.isArray(fallbackCriteria == null ? void 0 : fallbackCriteria.criteriaDto) ? fallbackCriteria.criteriaDto : []
    ];
    const criteriaDto = candidates.reduce(
      (best, current) => current.length > best.length ? current : best,
      []
    );
    const ruleDesc = String(desc || "").trim() || String(fallbackDesc || "").trim() || String((criteria == null ? void 0 : criteria.ruleDesc) || "").trim() || String((fallbackCriteria == null ? void 0 : fallbackCriteria.ruleDesc) || "").trim() || "";
    return {
      ruleDesc,
      criteriaDto
    };
  }, []);
  const handleApplyFilterDialog = reactExports.useCallback(() => {
    var _a2, _b, _c;
    if (!(filterDialog == null ? void 0 : filterDialog.field)) return;
    const isExclude = filterDialog.field === "szExcludeCasesWith";
    const filterRuleName = filterDialogRuleName;
    const latestDraft = filterDraftRef.current;
    const latestDesc = filterDraftDescRef.current;
    const latestCriteria = filterDraftCriteriaRef.current;
    const latestRuleEngineObj = filterDraftRuleEngineObjRef.current;
    const resolvedCriteriaPayload = resolveFilterCriteriaPayload({
      desc: latestDesc,
      criteria: latestCriteria,
      ruleEngineObj: latestRuleEngineObj,
      fallbackDesc: filterDraftDesc,
      fallbackCriteria: filterDraftCriteria,
      fallbackRuleEngineObj: filterDraftRuleEngineObj
    });
    const getCurrentDialogRow = () => {
      var _a3;
      if (filterDialog.gridRowId != null && ((_a3 = gridRef.current) == null ? void 0 : _a3.api)) {
        let match = null;
        gridRef.current.api.forEachNode((node) => {
          var _a4;
          if (((_a4 = node.data) == null ? void 0 : _a4.gridRowId) === filterDialog.gridRowId) {
            match = node.data;
          }
        });
        if (match) return match;
      }
      if (filterDialog.rowKey) {
        return allRows.find((row) => row.id === filterDialog.rowKey) || null;
      }
      return null;
    };
    const currentDialogRow = getCurrentDialogRow();
    const incomingHasData = Boolean(String(latestDraft || "").trim()) || Boolean(String(resolvedCriteriaPayload.ruleDesc || "").trim()) || Array.isArray(resolvedCriteriaPayload.criteriaDto) && resolvedCriteriaPayload.criteriaDto.length > 0 || Boolean(latestRuleEngineObj);
    const existingFieldState = isExclude ? {
      text: String((currentDialogRow == null ? void 0 : currentDialogRow.szExcludeCasesWith) || ""),
      desc: String((currentDialogRow == null ? void 0 : currentDialogRow.szExcludeCasesWithRuleDesc) || ""),
      criteriaDto: Array.isArray(currentDialogRow == null ? void 0 : currentDialogRow.szExcludeCasesWithCriteriaDto) ? currentDialogRow.szExcludeCasesWithCriteriaDto : [],
      obj: (currentDialogRow == null ? void 0 : currentDialogRow.szExcludeCasesWithObj) && typeof currentDialogRow.szExcludeCasesWithObj === "object" ? currentDialogRow.szExcludeCasesWithObj : null
    } : {
      text: String((currentDialogRow == null ? void 0 : currentDialogRow.szIncludeCasesWith) || ""),
      desc: String((currentDialogRow == null ? void 0 : currentDialogRow.szIncludeCasesWithRuleDesc) || ""),
      criteriaDto: Array.isArray(currentDialogRow == null ? void 0 : currentDialogRow.szIncludeCasesWithCriteriaDto) ? currentDialogRow.szIncludeCasesWithCriteriaDto : [],
      obj: (currentDialogRow == null ? void 0 : currentDialogRow.szIncludeCasesWithObj) && typeof currentDialogRow.szIncludeCasesWithObj === "object" ? currentDialogRow.szIncludeCasesWithObj : null
    };
    const existingHasData = Boolean(existingFieldState.text.trim()) || Boolean(existingFieldState.desc.trim()) || existingFieldState.criteriaDto.length > 0 || Boolean(existingFieldState.obj);
    const effectiveDraft = !incomingHasData && existingHasData ? existingFieldState.text : latestDraft;
    const effectiveDesc = !incomingHasData && existingHasData ? existingFieldState.desc : resolvedCriteriaPayload.ruleDesc;
    const effectiveCriteriaDto = !incomingHasData && existingHasData ? existingFieldState.criteriaDto : resolvedCriteriaPayload.criteriaDto;
    const effectiveRuleEngineObj = !incomingHasData && existingHasData ? existingFieldState.obj : latestRuleEngineObj;
    const storageRowKeysForLog = Array.isArray(filterDialog == null ? void 0 : filterDialog.storageRowKeys) && filterDialog.storageRowKeys.length > 0 ? filterDialog.storageRowKeys : [filterDialog == null ? void 0 : filterDialog.rowKey].filter(Boolean);
    {
      console.log(FILTER_DEBUG_TAG, "handleApplyFilterDialog.preUpdate", {
        dialog: filterDialog,
        incomingHasData,
        existingHasData,
        latestDraft,
        latestDesc,
        latestCriteriaCount: Array.isArray(resolvedCriteriaPayload.criteriaDto) ? resolvedCriteriaPayload.criteriaDto.length : 0,
        effectiveDraft,
        effectiveDesc,
        effectiveCriteriaCount: Array.isArray(effectiveCriteriaDto) ? effectiveCriteriaDto.length : 0,
        storageRowKeysForLog,
        snapshotBeforeApply: buildFilterStateSnapshot(storageRowKeysForLog)
      });
    }
    const updateObj = {
      [filterDialog.field]: effectiveDraft,
      ...isExclude ? {
        szExcludeCasesWithRuleDesc: effectiveDesc,
        szExcludeCasesWithObj: effectiveRuleEngineObj,
        szExcludeCasesWithCriteriaDto: effectiveCriteriaDto,
        szExcludeCasesWithRuleName: filterRuleName
      } : {
        szIncludeCasesWithRuleDesc: effectiveDesc,
        szIncludeCasesWithObj: effectiveRuleEngineObj,
        szIncludeCasesWithCriteriaDto: effectiveCriteriaDto,
        szIncludeCasesWithRuleName: filterRuleName
      }
    };
    let resolvedGridRowId = filterDialog.gridRowId;
    if (resolvedGridRowId == null && filterDialog.rowKey && ((_a2 = gridRef.current) == null ? void 0 : _a2.api)) {
      gridRef.current.api.forEachNode((node) => {
        var _a3, _b2, _c2;
        if (((_a3 = node.data) == null ? void 0 : _a3.id) === filterDialog.rowKey || ((_b2 = node.data) == null ? void 0 : _b2.szActionCode) === filterDialog.rowKey) {
          resolvedGridRowId = (_c2 = node.data) == null ? void 0 : _c2.gridRowId;
        }
      });
    }
    let didUpdateGridRow = false;
    if (resolvedGridRowId != null) {
      didUpdateGridRow = ((_c = (_b = gridRef.current) == null ? void 0 : _b.updateRowFieldsByGridRowId) == null ? void 0 : _c.call(
        _b,
        resolvedGridRowId,
        updateObj
      )) === true;
    }
    if (filterDialog.rowKey && activeView !== "grid" && (resolvedGridRowId == null || !didUpdateGridRow)) {
      setAllRows(
        (prev) => prev.map(
          (row) => row.id === filterDialog.rowKey ? {
            ...row,
            ...updateObj,
            mode: row.mode !== "N" ? "E" : row.mode
          } : row
        )
      );
    }
    if (activeView === "grid" && !didUpdateGridRow) {
      toast.warning(
        intl.formatMessage({
          id: "message.StrategyActionMaster.gridTrackingFailed",
          defaultMessage: "Unable to track filter changes for this row. Please reopen the filter from grid and apply again."
        })
      );
      return;
    }
    const dialogSnapshot = filterDialog;
    const resolvedRowStateKey = resolveFilterStateRowKey(storageRowKeysForLog);
    if (resolvedRowStateKey && (filterDialog == null ? void 0 : filterDialog.field)) {
      const hasAnyFilterData = Boolean(String(effectiveDesc || "").trim()) || Array.isArray(effectiveCriteriaDto) && effectiveCriteriaDto.length > 0 || Boolean(effectiveRuleEngineObj);
      setDmnJsons((prev) => {
        const filtered = prev.filter(
          (entry) => !((entry == null ? void 0 : entry.rowStateKey) === resolvedRowStateKey && (entry == null ? void 0 : entry.field) === filterDialog.field)
        );
        if (!hasAnyFilterData || !effectiveRuleEngineObj) {
          return filtered;
        }
        return [
          ...filtered,
          {
            rowStateKey: resolvedRowStateKey,
            field: filterDialog.field,
            dmnContext: effectiveRuleEngineObj
          }
        ];
      });
    }
    saveFilterDialogToStorage({
      dialog: dialogSnapshot,
      draft: effectiveDraft,
      desc: effectiveDesc,
      criteria: {
        ruleDesc: effectiveDesc,
        criteriaDto: Array.isArray(effectiveCriteriaDto) ? effectiveCriteriaDto : []
      },
      ruleEngineObj: effectiveRuleEngineObj || null
    });
    {
      console.log(FILTER_DEBUG_TAG, "handleApplyFilterDialog.postSave", {
        field: dialogSnapshot == null ? void 0 : dialogSnapshot.field,
        storageRowKeysForLog,
        snapshotAfterApply: buildFilterStateSnapshot(storageRowKeysForLog)
      });
    }
    suppressEmptyFilterCallbacksRef.current = false;
    setFilterDialog(null);
  }, [
    buildFilterStateSnapshot,
    filterDialog,
    filterDialogRuleName,
    activeView,
    intl,
    resolveFilterStateRowKey,
    resolveFilterCriteriaPayload,
    saveFilterDialogToStorage,
    toast
  ]);
  const filterDialogTitle = (filterDialog == null ? void 0 : filterDialog.field) === "szExcludeCasesWith" ? intl.formatMessage({
    id: "label.StrategyActionMaster.excludeCasesDialog",
    defaultMessage: "Exclude Cases With"
  }) : intl.formatMessage({
    id: "label.StrategyActionMaster.includeCasesDialog",
    defaultMessage: "Include Cases With"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-header-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-header-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-header-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: "label.StrategyActionMaster.title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Typography,
          {
            variant: "body1",
            className: "strategy-action-master-description",
            children: intl.formatMessage({
              id: "label.StrategyActionMaster.pageHeaderDescription",
              defaultMessage: "Define strategy actions for Initiate Workflow, Change Workflow and Generate Mail. Used across workflow rules, group rules and strategy action limits."
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-view-switcher", role: "tablist", children: STRATEGY_ACTION_VIEWS.map((viewKey) => {
        const ViewIcon = VIEW_ICONS[viewKey];
        const isActive = activeView === viewKey;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": isActive,
            className: `strategy-action-master-view-btn${isActive ? " is-active" : ""}`,
            onClick: () => setActiveView(viewKey),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ViewIcon, { className: "strategy-action-master-view-btn-icon" }),
              intl.formatMessage({
                id: STRATEGY_ACTION_VIEW_LABEL_IDS[viewKey],
                defaultMessage: viewKey
              })
            ]
          },
          viewKey
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-search-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ap,
        {
          id: "strategy-action-search",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          editable: true,
          placeholder: "label.StrategyActionMaster.searchPlaceholder",
          width: "224px"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-type-chips", children: actionTypeOptions.map((typeOption) => {
        const isActive = typeFilter.has(typeOption.value);
        const typeShort = String(typeOption.short || "").toLowerCase();
        const colorMap = {
          iw: { border: "hsl(210 89% 61%)", text: "hsl(210 89% 61%)", activeBg: "hsl(210 100% 90%)", activeText: "hsl(210 89% 40%)" },
          cw: { border: "hsl(270 81% 63%)", text: "hsl(270 81% 63%)", activeBg: "hsl(270 100% 90%)", activeText: "hsl(270 81% 40%)" },
          gm: { border: "hsl(120 73% 55%)", text: "hsl(120 73% 55%)", activeBg: "hsl(120 100% 90%)", activeText: "hsl(120 73% 35%)" }
        };
        const colors = colorMap[typeShort] || colorMap.iw;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: typeOption.short || typeOption.label,
            size: "small",
            sx: {
              minHeight: "28px",
              padding: "0 12px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "999px",
              border: `1px solid ${isActive ? "transparent" : colors.border}`,
              backgroundColor: isActive ? colors.activeBg : "hsl(0 0% 100%)",
              color: isActive ? colors.activeText : colors.text,
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: isActive ? colors.activeBg : `color-mix(in srgb, ${colors.text} 8%, transparent)`
              }
            },
            onClick: () => setTypeFilter(
              (current) => toggleSetValue(current, typeOption.value)
            )
          },
          typeOption.value
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-active-toggle", children: ACTIVE_FILTER_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: `strategy-action-master-active-toggle-btn${activeFilter === option ? " is-active" : ""}`,
          onClick: () => setActiveFilter(option),
          children: intl.formatMessage({
            id: `label.StrategyActionMaster.activeFilter.${option}`,
            defaultMessage: option
          })
        },
        option
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.hasDependencies",
            defaultMessage: "Has dependencies"
          }),
          size: "small",
          className: `strategy-action-master-filter-toggle${hasDependsFilter ? " is-active" : ""}`,
          sx: {
            minHeight: "28px",
            padding: "0 12px",
            fontSize: "11px",
            fontWeight: 600,
            borderRadius: "999px",
            border: `1px solid ${hasDependsFilter ? "transparent" : "hsl(210 89% 61%)"}`,
            backgroundColor: hasDependsFilter ? "hsl(210 100% 90%)" : "hsl(0 0% 100%)",
            color: hasDependsFilter ? "hsl(210 89% 40%)" : "hsl(210 89% 61%)",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: hasDependsFilter ? "hsl(210 100% 90%)" : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)"
            }
          },
          onClick: () => setHasDependsFilter((value) => !value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.hasSuccessors",
            defaultMessage: "Has successors"
          }),
          size: "small",
          className: `strategy-action-master-filter-toggle${hasSuccessorsFilter ? " is-active" : ""}`,
          sx: {
            minHeight: "28px",
            padding: "0 12px",
            fontSize: "11px",
            fontWeight: 600,
            borderRadius: "999px",
            border: `1px solid ${hasSuccessorsFilter ? "transparent" : "hsl(210 89% 61%)"}`,
            backgroundColor: hasSuccessorsFilter ? "hsl(210 100% 90%)" : "hsl(0 0% 100%)",
            color: hasSuccessorsFilter ? "hsl(210 89% 40%)" : "hsl(210 89% 61%)",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: hasSuccessorsFilter ? "hsl(210 100% 90%)" : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)"
            }
          },
          onClick: () => setHasSuccessorsFilter((value) => !value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Lg,
        {
          label: intl.formatMessage({
            id: "label.StrategyActionMaster.hasFilter",
            defaultMessage: "Has filter"
          }),
          size: "small",
          className: `strategy-action-master-filter-toggle${hasFilterFilter ? " is-active" : ""}`,
          sx: {
            minHeight: "28px",
            padding: "0 12px",
            fontSize: "11px",
            fontWeight: 600,
            borderRadius: "999px",
            border: `1px solid ${hasFilterFilter ? "transparent" : "hsl(210 89% 61%)"}`,
            backgroundColor: hasFilterFilter ? "hsl(210 100% 90%)" : "hsl(0 0% 100%)",
            color: hasFilterFilter ? "hsl(210 89% 40%)" : "hsl(210 89% 61%)",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: hasFilterFilter ? "hsl(210 100% 90%)" : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)"
            }
          },
          onClick: () => setHasFilterFilter((value) => !value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { style: { marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strategy-action-master-count", children: intl.formatMessage(
          {
            id: "label.StrategyActionMaster.rowCount",
            defaultMessage: "{filtered} of {total} actions"
          },
          { filtered: filteredCount, total: allRows.length }
        ) }),
        (activeView === "detail" || activeView === "dependencies") && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: intl.formatMessage({ id: "label.StrategyActionMaster.newAction", defaultMessage: "+ New action" }),
            size: "small",
            color: "primary",
            sx: {
              backgroundColor: "var(--drs-primary-main, hsl(221 83% 53%))",
              color: "var(--drs-primary-contrast, hsl(0 0% 100%))",
              borderColor: "transparent",
              "&:hover": {
                backgroundColor: "color-mix(in srgb, var(--drs-primary-main, hsl(221 83% 53%)) 90%, transparent)"
              }
            },
            onClick: handleNewAction
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            label: intl.formatMessage({ id: "label.StrategyActionMaster.export", defaultMessage: "Export" }),
            size: "small",
            onClick: () => exportToExcel(filteredRows || [], "strategy-actions-grid.xlsx"),
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiDownload, { size: 14 })
          }
        )
      ] })
    ] }),
    activeView === "grid" && /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "strategy-action-master-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      bu,
      {
        ref: gridRef,
        rowData: allRows,
        columnDefs,
        gridClassName: "drs-list-grid strategy-action-master-grid",
        embeddedInSection: true,
        pagination: false,
        sort: true,
        globalSearch: false,
        allowAdd: true,
        allowDelete: true,
        allowUpdate: true,
        onSave: handleGridSave,
        isLoading: loading,
        hideInternalSaveButton: true,
        rowDragging: true
      },
      intl.locale
    ) }),
    activeView === "detail" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      StrategyActionDetail,
      {
        rows: filteredRows,
        allRows,
        actionTypeOptions,
        focusRowId,
        onFocusRow: setFocusRowId,
        onUpdateRow: handleUpdateRow,
        onDeleteRow: handleDetailDelete,
        onOpenFilter: handleOpenFilter
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: handleMasterSave,
        onReset: handleReset,
        onClose: () => navigate("/homelayout/welcomepage")
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dialog,
      {
        open: Boolean(filterDialog),
        keepMounted: true,
        fullWidth: true,
        maxWidth: "md",
        onClose: handleCancelFilterDialog,
        PaperProps: { className: "strategy-action-master-filter-dialog" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "strategy-action-master-dialog-title", children: filterDialogTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", maxWidth: "100%", boxSizing: "border-box", margin: "0 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Ng,
              {
                ruleName: filterDialogRuleName,
                moduleName: "COL",
                entityCode: "ACNT",
                filterCode: 0,
                filterTitle: filterDialogTitle,
                isPopedUp: false,
                ruleEngineDmnContext: handleFilterMasterRuleEngineProps,
                jsonByState: Boolean(filterDialog == null ? void 0 : filterDialog.jsonByState),
                dmnJsonByState: (filterDialog == null ? void 0 : filterDialog.dmnJsonByState) || null,
                IsRuleEngBased: true,
                initialFilterJson: (filterDialog == null ? void 0 : filterDialog.initialFilterJson) || null,
                useSession: false,
                compact: false
              },
              filterDialogKey || "strategy-action-filter"
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "strategy-action-master-filter-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: intl.formatMessage({
                    id: "label.StrategyActionMaster.cancel",
                    defaultMessage: "Cancel"
                  }),
                  onClick: handleCancelFilterDialog
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: intl.formatMessage({
                    id: "label.StrategyActionMaster.apply",
                    defaultMessage: "Apply"
                  }),
                  color: "primary",
                  onClick: handleApplyFilterDialog
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LE,
      {
        open: Boolean(accessDialogActionCode),
        onClose: () => setAccessDialogActionCode(null),
        disableContentWrapper: true,
        header: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "strategy-action-master-dialog-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "strategy-action-master-dialog-title-text-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { className: "strategy-action-master-dialog-title-text", component: "span", children: [
              intl.formatMessage({
                id: "label.StrategyActionMaster.accessControl",
                defaultMessage: "Access Control"
              }),
              accessDialogActionCode ? ` - ${accessDialogActionCode}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { className: "strategy-action-master-dialog-subtitle", component: "p", children: "Select access profiles authorised to perform this strategy action." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { className: "strategy-action-master-dialog-close-btn", onClick: () => setAccessDialogActionCode(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) })
        ] }),
        slotProps: { paper: { className: "strategy-action-master-dialog" } },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogContent,
          {
            dividers: true,
            className: "strategy-action-master-dialog-content",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              StrategyActionAccess,
              {
                ref: accessDialogRef,
                actionCode: accessDialogActionCode,
                onClose: () => setAccessDialogActionCode(null)
              }
            )
          }
        )
      }
    )
  ] });
};
export {
  StrategyActionMaster as default
};
