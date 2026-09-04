import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";
import { HAxiosService, useToast, HAgGrid, HBox, HButton, HButtonBar, HBreadCrumb, HTextField, HCheckBox, TitleBar, FilterMaster, SearchCommonBox, HDialog } from "@helix/component-library";
import { gridCollectorDefObj, gridMailCodeDefObj } from "../../../common/components/SearchGridDefObj";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import { exportToExcel } from "../../../common/utils/exportToExcel";
import { FiDownload } from "react-icons/fi";
import { StrategyActionMasterAPI } from "./apiEndpoints";
import { handleValidationErrors } from "../early-collection/ValidationUtils";
import {
  buildSaveRow,
  extractStrategyActionPayload,
  mapActionTypeOptions,
  mapRowsFromResponse,
  getDefaultStrategyActionRow,
  splitActionTokens,
  joinActionTokens,
  getTypeShortForRow,
} from "./strategy-action-master/strategyActionMaster.mappers";
import {
  filterStrategyActionRows,
  toggleSetValue,
} from "./strategy-action-master/strategyActionMaster.filters";
import StrategyActionAccess from "./strategy-action-master/StrategyActionAccess";
import StrategyActionDetail from "./strategy-action-master/StrategyActionDetail";
// view labels inlined from strategyActionMaster.views.js
const STRATEGY_ACTION_VIEWS = ["grid", "detail"];
const ACCESS_SELECTION_CACHE_KEY = "strategyActionAccessCache";


const STRATEGY_ACTION_VIEW_LABEL_IDS = {
  grid: "label.StrategyActionMaster.view.grid",
  detail: "label.StrategyActionMaster.view.detail",
};

const gridStrategyActionRelationDefObj = [
  {
    gridHeaderDesc: "Action",
    gridMappingName: "code",
    gridColumnWidth: 140,
  },
  {
    gridHeaderDesc: "Description",
    gridMappingName: "description",
    gridColumnWidth: 220,
  },
];

import "./strategy-action-master/strategy-action-master.screen.css";
import { readCache, writeCache } from "@helix/component-library";

function markRowEdited(data) {
  if (data && data.mode !== "N") {
    data.mode = "E";
  }
}

function BoolCheckboxRenderer({ field, params }) {
  const checked = !!params.value;
  return (
    <HCheckBox
      checked={checked}
      label=""
      align="center"
      margin="15px"
      gridMode
      onChange={(e) => {
        params.node.setDataValue(field, e.target.checked);
        markRowEdited(params.data);
      }}
    />
  );
}

function normalizeActionCode(value) {
  return String(value ?? "").trim();
}

function normalizeAccessCode(value) {
  return String(value ?? "").trim().toUpperCase();
}

function getStableRowIdentity(row) {
  const actionCode = normalizeActionCode(row?.szActionCode);
  if (actionCode) return actionCode;
  const id = String(row?.id || "").trim();
  if (id) return id;
  const gridRowId = String(row?.gridRowId || "").trim();
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
  const responseJson = data?.responseJson;
  if (Array.isArray(responseJson?.lstStrategyActionAccess)) {
    return responseJson.lstStrategyActionAccess;
  }
  if (Array.isArray(responseJson)) return responseJson;
  return pickFirstArray(responseJson || data, [
    "accessList",
    "strategyActionAccessList",
    "lstStrategyActionAccess",
    "data",
  ]);
}

function parseRelationshipTokens(value) {
  const parseToken = (token) =>
    String(token ?? "")
      .split(/[.,;|]/)
      .map((part) => part.trim())
      .filter(Boolean);

  if (Array.isArray(value)) {
    return value.flatMap((token) => parseToken(token));
  }

  return parseToken(value);
}

function buildOrderedActionOptions(rows, currentIndex, direction) {
  if (!Array.isArray(rows) || currentIndex < 0) return [];

  const currentCode = normalizeActionCode(rows[currentIndex]?.szActionCode).toLowerCase();
  const candidateRows =
    direction === "dependsOn"
      ? rows.slice(0, currentIndex)
      : rows.slice(currentIndex + 1);

  const seen = new Set();
  const options = [];

  candidateRows.forEach((row) => {
    const code = normalizeActionCode(row?.szActionCode);
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

  const orderIndex = new Map();
  preferredOrder.forEach((code, index) => {
    const normalized = normalizeActionCode(code).toLowerCase();
    if (!normalized || orderIndex.has(normalized)) return;
    orderIndex.set(normalized, index);
  });

  if (orderIndex.size === 0) return rows;

  const ordered = [];
  const remaining = [];

  rows.forEach((row) => {
    const codeKey = normalizeActionCode(row?.szActionCode).toLowerCase();
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
  return (Array.isArray(rows) ? rows : [])
    .map((row) => normalizeActionCode(row?.szActionCode))
    .filter(Boolean)
    .map((code) => code.toLowerCase());
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
    (allowedOptions || []).map((option) => [String(option).toLowerCase(), option]),
  );
  const selectedTokens = parseRelationshipTokens(value);
  const seen = new Set();
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

function isGenerateMailType(actionType, actionTypeOptions) {
  const short = getTypeShortForRow(actionType, actionTypeOptions);
  return short === "GM" || String(actionType || "").toUpperCase() === "GM";
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
  successorsRenderer,
}) {
  const typeValues = actionTypeOptions.map((opt) => opt.value);

  return [
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.action",
        defaultMessage: "Action",
      }),
      field: "szActionCode",
      width: 128,
      minWidth: 120,
      pinned: "left",
      editable: (params) => params.data?.mode === "N",
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.description",
        defaultMessage: "Description",
      }),
      field: "szDescription",
      width: 176,
      minWidth: 160,
      pinned: "left",
      editable: true,
      filter: false,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.actionDefinition",
        defaultMessage: "Action Definition",
      }),
      children: [
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.type",
            defaultMessage: "Type",
          }),
          field: "szActionType",
          width: 180,
          editable: true,
          filter: false,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: typeValues },
          valueFormatter: (params) => {
            const option = actionTypeOptions.find(
              (opt) => opt.value === params.value,
            );
            return option ? option.label : params.value;
          },
        },
        {
          headerName: intl.formatMessage({
            id: "label.StrategyActionMaster.value",
            defaultMessage: "Value",
          }),
          field: "szActionTarget",
          width: 176,
          editable: (params) => !isSearchCommonBoxValueType(params.data?.szActionType, actionTypeOptions),
          filter: false,
          required: true,
          cellRenderer: (params) => {
            if (!isSearchCommonBoxValueType(params.data?.szActionType, actionTypeOptions)) {
              return params.value || "";
            }

            const collectorType = isCollectorValueType(params.data?.szActionType, actionTypeOptions);

            return (
              <SearchCommonBox
                apiEndpoint={SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS()}
                searchCode={getValueSearchCode(params.data?.szActionType, actionTypeOptions)}
                setSelectedValue={(value, selectedRow) => {
                  const nextValue = value || "";
                  const currentValue = params.data?.szActionTarget || "";

                  // SearchCommonBox emits an initial empty callback on mount;
                  // keep fetched value unless user explicitly changes/clears it.
                  const isInitialAutoReset =
                    selectedRow === undefined && nextValue === "" && currentValue !== "";

                  if (isInitialAutoReset || nextValue === currentValue) {
                    return;
                  }

                  params.node.setDataValue("szActionTarget", nextValue);
                  markRowEdited(params.data);
                }}
                selectedValue={params.value || ""}
                selectedColumn={collectorType ? "szCollectorCode" : "szMailCode"}
                gridDefObj={collectorType ? gridCollectorDefObj : gridMailCodeDefObj}
                gridWidth={300}
                gridHeight={300}
                gridNoOfRowsPerPage={5}
                searchBoxWidth="100%"
                searchBoxHeight={30}
                searchBoxFontSize={12}
                placeholder={intl.formatMessage({
                  id: collectorType
                    ? "label.collector.collectorCode.placeholder"
                    : "label.generateMail.mailCode.placeholder",
                  defaultMessage: collectorType ? "Select collector code" : "Select mail code",
                })}
              />
            );
          },
        },
      ],
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.dependsOn",
        defaultMessage: "Depends On",
      }),
      field: "szDependsOn",
      width: 260,
      minWidth: 220,
      editable: false,
      filter: false,
      cellRenderer: dependsOnRenderer,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.successors",
        defaultMessage: "Successors",
      }),
      field: "szSuccessors",
      width: 260,
      minWidth: 220,
      editable: false,
      filter: false,
      cellRenderer: successorsRenderer,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.excludeCases",
        defaultMessage: "Exclude cases with",
      }),
      field: "szExcludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox sx={{ width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }}>
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.define",
              defaultMessage: "Define",
            })}
            size="small"
            margin="0"
            onClick={() =>
              onOpenFilter({
                rowKey: params.data?.id,
                gridRowId: params.data?.gridRowId,
                rowIndex: params.node?.rowIndex,
                actionCode: params.data?.szActionCode,
                field: "szExcludeCasesWith",
                initialValue: params.data?.szExcludeCasesWith || "",
              })
            }
          />
        </HBox>
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.includeCases",
        defaultMessage: "Include cases with",
      }),
      field: "szIncludeCasesWith",
      width: 144,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox sx={{ width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }}>
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.define",
              defaultMessage: "Define",
            })}
            size="small"
            margin="0"
            onClick={() =>
              onOpenFilter({
                rowKey: params.data?.id,
                gridRowId: params.data?.gridRowId,
                rowIndex: params.node?.rowIndex,
                actionCode: params.data?.szActionCode,
                field: "szIncludeCasesWith",
                initialValue: params.data?.szIncludeCasesWith || "",
              })
            }
          />
        </HBox>
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.active",
        defaultMessage: "Active",
      }),
      field: "chActiveYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => (
        <BoolCheckboxRenderer field="chActiveYn" params={params} />
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.auto",
        defaultMessage: "Auto",
      }),
      field: "chAutoActionYn",
      width: 80,
      editable: false,
      filter: false,
      isCheckbox: true,
      cellRenderer: (params) => (
        <BoolCheckboxRenderer field="chAutoActionYn" params={params} />
      ),
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionMaster.accessControl",
        defaultMessage: "Access Control",
      }),
      field: "accessControl",
      width: 150,
      editable: false,
      filter: false,
      cellRenderer: (params) => (
        <HBox sx={{ width: "100%", height: "100%", justifyItems: "center", backgroundColor: "transparent" }}>
          <HButton
            label={intl.formatMessage({
              id: "label.StrategyActionMaster.accessControl",
              defaultMessage: "Access Control",
            })}
            size="small"
            margin="flex-center"
            onClick={() => onOpenAccess(params.data?.szActionCode)}
          />
        </HBox>
      ),
    },
  ];
}

const ACTIVE_FILTER_OPTIONS = ["all", "active", "inactive"];

const VIEW_ICONS = {
  grid: TableChartOutlinedIcon,
  detail: ViewSidebarOutlinedIcon,
};

const STRATEGY_ACTION_FILTER_DEBUG = true;
const FILTER_DEBUG_TAG = "[StrategyActionFilterDebug]";

const StrategyActionMaster = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const toast = useToast();
  const gridRef = useRef(null);
  const accessDialogRef = useRef(null);

  const [allRows, setAllRows] = useState([]);
  const [actionTypeOptions, setActionTypeOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [hasDependsFilter, setHasDependsFilter] = useState(false);
  const [hasSuccessorsFilter, setHasSuccessorsFilter] = useState(false);
  const [hasFilterFilter, setHasFilterFilter] = useState(false);

  const [activeView, setActiveView] = useState("grid");
  const [focusRowId, setFocusRowId] = useState(null);
  const [detailDeletedRows, setDetailDeletedRows] = useState([]);
  const [filterDialog, setFilterDialog] = useState(null);
  const [filterDialogKey, setFilterDialogKey] = useState(null);
  const [filterDraft, setFilterDraft] = useState("");
  const [filterDraftDesc, setFilterDraftDesc] = useState("");
  const [filterDraftCriteria, setFilterDraftCriteria] = useState(null);
  const [filterDraftRuleEngineObj, setFilterDraftRuleEngineObj] = useState(null);
  const [dmnJsons, setDmnJsons] = useState([]);
  const filterDraftRef = useRef("");
  const filterDraftDescRef = useRef("");
  const filterDraftCriteriaRef = useRef(null);
  const filterDraftRuleEngineObjRef = useRef(null);
  const suppressEmptyFilterCallbacksRef = useRef(false);
  const isRelationshipSanitizingRef = useRef(false);
  const [accessDialogActionCode, setAccessDialogActionCode] = useState(null);
  const rowOrderBeforeSaveRef = useRef([]);
  const existingActionCodesRef = useRef(new Set());
  const [filterCriteriaStateByKey, setFilterCriteriaStateByKey] = useState({});
  const filterCriteriaStateByKeyRef = useRef({});

  const writeFilterCriteriaState = useCallback((rowStateKey, field, criteriaPayload) => {
    if (!rowStateKey || !field) return;

    setFilterCriteriaStateByKey((prev) => {
      const currentRowState =
        prev?.[rowStateKey] && typeof prev[rowStateKey] === "object"
          ? prev[rowStateKey]
          : {};
      const next = {
        ...prev,
        [rowStateKey]: {
          ...currentRowState,
          [field]: {
            ruleDesc: String(criteriaPayload?.ruleDesc || ""),
            criteriaDto: Array.isArray(criteriaPayload?.criteriaDto)
              ? criteriaPayload.criteriaDto
              : [],
            ruleEngineObj:
              criteriaPayload?.ruleEngineObj && typeof criteriaPayload.ruleEngineObj === "object"
                ? criteriaPayload.ruleEngineObj
                : null,
          },
        },
      };
      filterCriteriaStateByKeyRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    filterCriteriaStateByKeyRef.current = filterCriteriaStateByKey || {};
  }, [filterCriteriaStateByKey]);

  const collectCurrentGridRows = useCallback((api) => {
    const orderedRows = [];
    if (!api) return orderedRows;

    const displayedCount = typeof api.getDisplayedRowCount === "function"
      ? api.getDisplayedRowCount()
      : 0;

    if (displayedCount > 0 && typeof api.getDisplayedRowAtIndex === "function") {
      for (let index = 0; index < displayedCount; index += 1) {
        const node = api.getDisplayedRowAtIndex(index);
        if (node?.data && !node.data._deleted) {
          orderedRows.push(node.data);
        }
      }
      return orderedRows;
    }

    api.forEachNode((node) => {
      if (node?.data && !node.data._deleted) {
        orderedRows.push(node.data);
      }
    });

    return orderedRows;
  }, []);

  const getRowScopedActionOptions = useCallback(
    (params, direction) => {
      const api = params?.api || gridRef.current?.api;
      const orderedRows = collectCurrentGridRows(api);
      if (!orderedRows.length) return [];

      const currentGridRowId = params?.data?.gridRowId;
      const currentIndex = orderedRows.findIndex(
        (row) => row.gridRowId === currentGridRowId,
      );

      return buildOrderedActionOptions(orderedRows, currentIndex, direction);
    },
    [collectCurrentGridRows],
  );

  const sanitizeGridRelationshipSelections = useCallback(
    (rows) => {
      if (!Array.isArray(rows) || rows.length === 0) return;

      rows.forEach((row, index) => {
        const allowedDependsOn = buildOrderedActionOptions(rows, index, "dependsOn");
        const allowedSuccessors = buildOrderedActionOptions(rows, index, "successors");
        const nextDependsOn = sanitizeRelationshipSelection(row.szDependsOn, allowedDependsOn);
        const nextSuccessors = sanitizeRelationshipSelection(row.szSuccessors, allowedSuccessors);

        if ((row.szDependsOn || "") !== nextDependsOn) {
          gridRef.current?.updateRowFieldsByGridRowId?.(row.gridRowId, {
            szDependsOn: nextDependsOn,
          });
        }

        if ((row.szSuccessors || "") !== nextSuccessors) {
          gridRef.current?.updateRowFieldsByGridRowId?.(row.gridRowId, {
            szSuccessors: nextSuccessors,
          });
        }
      });
    },
    [],
  );

  const buildRelationshipSearchOptions = useCallback(
    (params, direction) => {
      const api = params?.api || gridRef.current?.api;
      const orderedRows = collectCurrentGridRows(api);
      const currentIndex = orderedRows.findIndex(
        (row) => row.gridRowId === params?.data?.gridRowId,
      );
      const codeOptions = buildOrderedActionOptions(orderedRows, currentIndex, direction);

      const codeToDescription = new Map();
      orderedRows.forEach((row) => {
        const code = normalizeActionCode(row?.szActionCode);
        if (!code || codeToDescription.has(code)) return;
        codeToDescription.set(code, String(row?.szDescription || "").trim());
      });

      return codeOptions.map((code) => ({
        code,
        description: codeToDescription.get(code) || "",
      }));
    },
    [collectCurrentGridRows],
  );

  const buildRelationshipRenderer = useCallback(
    (field, direction) => (params) => {
      const api = params?.api || gridRef.current?.api;
      const options = buildRelationshipSearchOptions(params, direction);
      const currentSelection = parseRelationshipTokens(params?.value).filter(
        (token, index, arr) => {
          const tokenKey = String(token || "").trim().toLowerCase();
          if (!tokenKey) return false;
          return arr.findIndex((x) => String(x || "").trim().toLowerCase() === tokenKey) === index;
        },
      );

      // Keep fetched values visible even when they are outside current directional options.
      const optionCodeMap = new Map(
        options.map((opt) => [String(opt.code || "").trim().toLowerCase(), opt]),
      );
      const mergedOptions = [...options];
      currentSelection.forEach((token) => {
        const tokenKey = String(token || "").trim().toLowerCase();
        if (!tokenKey || optionCodeMap.has(tokenKey)) return;
        mergedOptions.push({ code: token, description: "" });
      });

      const optionsKey = mergedOptions.map((opt) => opt.code).join("|");
      const stableRowIdentity = getStableRowIdentity(params?.data);

      return (
        <SearchCommonBox
          key={`${field}-${stableRowIdentity}-${joinActionTokens(currentSelection)}`}
          multiSelect={true}
          searchCode={`${direction}_${stableRowIdentity}_${optionsKey}`}
          customFetchFunction={async () => ({ data: { responseJson: mergedOptions } })}
          setSelectedValue={(selectedCodes) => {
            const nextValue = sanitizeRelationshipSelection(
              selectedCodes,
              mergedOptions.map((opt) => opt.code),
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
          }}
          selectedValue={currentSelection}
          selectedColumn="code"
          gridDefObj={gridStrategyActionRelationDefObj}
          gridWidth={360}
          gridHeight={300}
          gridNoOfRowsPerPage={5}
          searchBoxWidth={220}
          searchBoxHeight={29}
          searchBoxFontSize={11}
          translate={false}
          error={false}
        />
      );
    },
    [buildRelationshipSearchOptions, collectCurrentGridRows, sanitizeGridRelationshipSelections],
  );

  const dependsOnRenderer = useMemo(
    () => buildRelationshipRenderer("szDependsOn", "dependsOn"),
    [buildRelationshipRenderer],
  );

  const successorsRenderer = useMemo(
    () => buildRelationshipRenderer("szSuccessors", "successors"),
    [buildRelationshipRenderer],
  );

  const loadStrategyActions = useCallback(async ({ preferredOrder = null } = {}) => {
    setLoading(true);
    try {
      const response = await HAxiosService.GET(
        StrategyActionMasterAPI.StrategyActionMaster(screenMenuId),
      );
      const result = response?.data || {};
      const payload = extractStrategyActionPayload(result);

      if (!payload) {
        toast.error(
          intl.formatMessage({
            id: "message.StrategyActionMaster.fetchEmpty",
            defaultMessage: "No data received from server.",
          }),
        );
        setAllRows([]);
        return;
      }

      if (Array.isArray(payload.lstStrategyAction)) {
        const mappedRows = mapRowsFromResponse(payload.lstStrategyAction);
        existingActionCodesRef.current = new Set(
          mappedRows
            .map((row) => normalizeActionCode(row?.szActionCode).toLowerCase())
            .filter(Boolean),
        );
        const orderToApply =
          Array.isArray(preferredOrder) && preferredOrder.length > 0
            ? preferredOrder
            : rowOrderBeforeSaveRef.current;
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
          defaultMessage: "Error fetching Strategy Action Master data.",
        }),
      );
      setAllRows([]);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    loadStrategyActions();
  }, [loadStrategyActions]);

  const filterCriteria = useMemo(
    () => ({
      query,
      typeFilter,
      activeFilter,
      hasDependsFilter,
      hasSuccessorsFilter,
      hasFilterFilter,
    }),
    [
      query,
      typeFilter,
      activeFilter,
      hasDependsFilter,
      hasSuccessorsFilter,
      hasFilterFilter,
    ],
  );

  const filteredRows = useMemo(
    () => filterStrategyActionRows(allRows, filterCriteria),
    [allRows, filterCriteria],
  );

  const filteredCount = filteredRows.length;

  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    const hasActiveFilters =
      Boolean(filterCriteria.query?.trim()) ||
      filterCriteria.typeFilter?.size > 0 ||
      filterCriteria.activeFilter !== "all" ||
      filterCriteria.hasDependsFilter ||
      filterCriteria.hasSuccessorsFilter ||
      filterCriteria.hasFilterFilter;

    // Defer grid API updates to avoid triggering React flushSync warnings
    // while ag-grid is still in a render lifecycle.
    const taskId = setTimeout(() => {
      const latestApi = gridRef.current?.api;
      if (!latestApi) return;

      latestApi.setGridOption("isExternalFilterPresent", () => hasActiveFilters);
      latestApi.setGridOption("doesExternalFilterPass", (node) =>
        filterStrategyActionRows([node.data], filterCriteria).length > 0,
      );
      latestApi.onFilterChanged();
    }, 0);

    return () => clearTimeout(taskId);
  }, [filterCriteria, allRows]);

  const handleFilterMasterProps = useCallback((filterData) => {
    const hasRuleDesc = Boolean(String(filterData?.ruleDesc || "").trim());
    const hasCriteria = Array.isArray(filterData?.criteriaDto) && filterData.criteriaDto.length > 0;
    const isEmptyPayload = !hasRuleDesc && !hasCriteria;

    if (suppressEmptyFilterCallbacksRef.current && isEmptyPayload) {
      return;
    }

    if (!isEmptyPayload) {
      suppressEmptyFilterCallbacksRef.current = false;
    }

    const filterText =
      (filterData?.criteriaDto || [])
        .map((item) => item.szDescription)
        .filter(Boolean)
        .join(" ")
        .trim() || filterData?.ruleDesc || "";

    filterDraftRef.current = filterText;
    filterDraftDescRef.current = filterData?.ruleDesc || "";
    filterDraftCriteriaRef.current = filterData || null;
    setFilterDraft(filterText);
    setFilterDraftDesc(filterData?.ruleDesc || "");
    setFilterDraftCriteria(filterData || null);
  }, []);

  const handleFilterMasterRuleEngineProps = useCallback((obj) => {
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

  const getFilterStorageRowKeys = useCallback((
    rowLike,
    fallbackRowKey = null,
    fallbackGridRowId = null,
    fallbackRowIndex = null,
  ) => {
    // Keep row-unique identifiers first to avoid collisions between rows
    // that can share the same action code during edits.
    const fallbackRowIndexNumber = Number(fallbackRowIndex);
    const rowLikeIndexNumber = Number(rowLike?.rowIndex);
    const normalizedRowIndex = Number.isInteger(fallbackRowIndexNumber)
      ? fallbackRowIndexNumber
      : Number.isInteger(rowLikeIndexNumber)
        ? rowLikeIndexNumber
        : null;
    const stableGridRowId = String(
      rowLike?.gridRowId ?? fallbackGridRowId ?? "",
    ).trim();
    const rowIndexStateKey = stableGridRowId
      ? `rowIndex:${stableGridRowId}`
      : normalizedRowIndex != null
        ? `rowIndex:${normalizedRowIndex}`
        : "";

    const keys = [
      rowIndexStateKey,
      rowLike?.filterStorageId,
      rowLike?.gridRowId,
      fallbackGridRowId,
      rowLike?.id,
      fallbackRowKey,
      rowLike?.szActionCode,
    ]
      .map((value) => String(value || "").trim())
      .filter(Boolean);
    const uniqueKeys = Array.from(new Set(keys));
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "getFilterStorageRowKeys", {
        filterStorageId: rowLike?.filterStorageId,
        gridRowId: rowLike?.gridRowId,
        actionCode: rowLike?.szActionCode,
        id: rowLike?.id,
        rowIndexStateKey,
        fallbackRowIndex,
        fallbackRowKey,
        fallbackGridRowId,
        uniqueKeys,
      });
    }
    return uniqueKeys;
  }, []);

  const getPrimaryFilterStorageRowKey = useCallback((rowKeys) => {
    if (!Array.isArray(rowKeys) || rowKeys.length === 0) return null;

    const normalized = rowKeys
      .map((value) => String(value || "").trim())
      .filter(Boolean);

    if (normalized.length === 0) return null;

    // First key is already ordered by row uniqueness priority.
    const primaryKey = normalized[0];
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "getPrimaryFilterStorageRowKey", {
        rowKeys,
        normalized,
        primaryKey,
      });
    }
    return primaryKey;
  }, []);

  const resolveFilterStateRowKey = useCallback((rowKeys) => {

    const normalized = Array.isArray(rowKeys)
      ? rowKeys.map((value) => String(value || "").trim()).filter(Boolean)
      : [];
    if (normalized.length === 0) return null;

    const existingState = filterCriteriaStateByKeyRef.current || {};
    const existingKey = normalized.find((key) =>
      Boolean(existingState?.[key] && typeof existingState[key] === "object"),
    );

    const resolvedKey = existingKey || normalized[0];
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      const resolvedState = existingState?.[resolvedKey] || {};
      const excludeState = resolvedState?.szExcludeCasesWith || null;
      const includeState = resolvedState?.szIncludeCasesWith || null;
      console.log(FILTER_DEBUG_TAG, "resolveFilterStateRowKey", {
        rowKeys,
        normalized,
        existingKey,
        resolvedKey,
        hasExclude: Boolean(excludeState),
        excludeDesc: String(excludeState?.ruleDesc || ""),
        excludeCriteriaCount: Array.isArray(excludeState?.criteriaDto)
          ? excludeState.criteriaDto.length
          : 0,
        hasInclude: Boolean(includeState),
        includeDesc: String(includeState?.ruleDesc || ""),
        includeCriteriaCount: Array.isArray(includeState?.criteriaDto)
          ? includeState.criteriaDto.length
          : 0,
      });
    }

    return resolvedKey;
  }, []);

  const buildFilterStateSnapshot = useCallback((rowKeys) => {
    const resolvedKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedKey) {
      return {
        resolvedKey: null,
        excludeDesc: "",
        excludeCriteriaCount: 0,
        includeDesc: "",
        includeCriteriaCount: 0,
      };
    }

    const rowState = filterCriteriaStateByKeyRef.current?.[resolvedKey] || {};
    const excludeState = rowState?.szExcludeCasesWith || null;
    const includeState = rowState?.szIncludeCasesWith || null;

    return {
      resolvedKey,
      excludeDesc: String(excludeState?.ruleDesc || ""),
      excludeCriteriaCount: Array.isArray(excludeState?.criteriaDto)
        ? excludeState.criteriaDto.length
        : 0,
      includeDesc: String(includeState?.ruleDesc || ""),
      includeCriteriaCount: Array.isArray(includeState?.criteriaDto)
        ? includeState.criteriaDto.length
        : 0,
    };
  }, [resolveFilterStateRowKey]);

  const readPersistedFilterField = useCallback((rowKeys, field) => {

    if (!Array.isArray(rowKeys) || rowKeys.length === 0 || !field) return null;
    const resolvedRowKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedRowKey) return null;

    try {
      const persistedValue = filterCriteriaStateByKeyRef.current?.[resolvedRowKey]?.[field];
      if (!persistedValue) return null;

      const ruleDesc = String(persistedValue?.ruleDesc || "");
      const criteriaDto = Array.isArray(persistedValue?.criteriaDto)
        ? persistedValue.criteriaDto
        : [];
      const ruleEngineObj =
        persistedValue?.ruleEngineObj && typeof persistedValue.ruleEngineObj === "object"
          ? persistedValue.ruleEngineObj
          : null;
      const filterDraft =
        criteriaDto
          .map((item) => item?.szDescription)
          .filter(Boolean)
          .join(" ")
          .trim() || ruleDesc;

      if (STRATEGY_ACTION_FILTER_DEBUG) {
        console.log(FILTER_DEBUG_TAG, "readPersistedFilterField", {
          field,
          resolvedRowKey,
          rowStateFieldKey: `${resolvedRowKey}.${field}`,
          ruleDesc,
          criteriaCount: criteriaDto.length,
        });
      }

      return {
        filterDraft,
        filterDraftDesc: ruleDesc,
        filterDraftCriteria: {
          ruleDesc,
          criteriaDto,
        },
        filterDraftRuleEngineObj: ruleEngineObj,
      };
    } catch (error) {
      console.warn("Unable to read in-memory filter criteria state", error);
      return null;
    }
  }, [resolveFilterStateRowKey]);

  const writePersistedFilterCriteriaJson = useCallback((rowKeys, field, value) => {

    if (!Array.isArray(rowKeys) || rowKeys.length === 0 || !field) return;

    const resolvedRowKey = resolveFilterStateRowKey(rowKeys);
    if (!resolvedRowKey) return;

    const criteriaPayload = {
      ruleDesc: String(value?.ruleDesc || ""),
      criteriaDto: Array.isArray(value?.criteriaDto) ? value.criteriaDto : [],
      ruleEngineObj:
        value?.ruleEngineObj && typeof value.ruleEngineObj === "object"
          ? value.ruleEngineObj
          : null,
    };

    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "writePersistedFilterCriteriaJson", {
        rowKeys,
        resolvedRowKey,
        field,
        rowStateFieldKey: `${resolvedRowKey}.${field}`,
        ruleDesc: criteriaPayload.ruleDesc,
        criteriaCount: criteriaPayload.criteriaDto.length,
      });
    }

    try {
      writeFilterCriteriaState(resolvedRowKey, field, criteriaPayload);
    } catch (error) {
      console.warn("Unable to persist filter criteria state", error);
    }
  }, [resolveFilterStateRowKey, writeFilterCriteriaState]);

  const saveFilterDialogToStorage = useCallback(({
    dialog = filterDialog,
    draft = filterDraft,
    desc = filterDraftDesc,
    criteria = filterDraftCriteria,
    ruleEngineObj = filterDraftRuleEngineObj,
  } = {}) => {

    if (!dialog?.rowKey || !dialog?.field) return;
    const storageRowKeys =
      Array.isArray(dialog?.storageRowKeys) && dialog.storageRowKeys.length > 0
        ? dialog.storageRowKeys
        : [dialog.rowKey];
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "saveFilterDialogToStorage", {
        dialog,
        storageRowKeys,
        draft,
        desc,
      });
    }

    writePersistedFilterCriteriaJson(storageRowKeys, dialog.field, {
      ruleDesc: desc,
      criteriaDto: Array.isArray(criteria?.criteriaDto) ? criteria.criteriaDto : [],
      ruleEngineObj,
    });

    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "saveFilterDialogToStorage.afterWrite", {
        field: dialog.field,
        storageRowKeys,
        snapshot: buildFilterStateSnapshot(storageRowKeys),
      });
    }
  }, [
    buildFilterStateSnapshot,
    filterDialog,
    filterDraft,
    filterDraftCriteria,
    filterDraftDesc,
    filterDraftRuleEngineObj,
    writePersistedFilterCriteriaJson,
  ]);

  const handleCancelFilterDialog = useCallback(() => {
    suppressEmptyFilterCallbacksRef.current = false;
    setFilterDialog(null);
  }, []);

  const handleOpenFilter = useCallback(
    ({ rowKey, gridRowId, rowIndex, actionCode, field, initialValue = "" }) => {

      const row = allRows.find((item) => item.id === rowKey);
      let existingRow = row;
      if (gridRowId != null && gridRef.current?.api) {
        gridRef.current.api.forEachNode((node) => {
          if (node.data?.gridRowId === gridRowId) {
            existingRow = node.data;
          }
        });
      }

      const existingDesc = existingRow
        ? field === "szExcludeCasesWith"
          ? existingRow.szExcludeCasesWithRuleDesc || existingRow.szExcludeCasesWith || ""
          : existingRow.szIncludeCasesWithRuleDesc || existingRow.szIncludeCasesWith || ""
        : "";
      const existingCriteria = existingRow
        ? field === "szExcludeCasesWith"
          ? existingRow.szExcludeCasesWithCriteriaDto
          : existingRow.szIncludeCasesWithCriteriaDto
        : null;
      const existingRuleEngineObj = existingRow
        ? field === "szExcludeCasesWith"
          ? existingRow.szExcludeCasesWithObj
          : existingRow.szIncludeCasesWithObj
        : null;

      const storageRowKeys = getFilterStorageRowKeys(
        existingRow,
        rowKey,
        gridRowId,
        rowIndex,
      );
      const resolvedRowStateKey = resolveFilterStateRowKey(storageRowKeys);
      const dmnStateEntry = dmnJsons.find(
        (entry) =>
          entry?.rowStateKey === resolvedRowStateKey &&
          entry?.field === field,
      );

      const persistedFieldState = readPersistedFilterField(storageRowKeys, field);
      const persistedInitialFilterJson = persistedFieldState?.filterDraftCriteria || null;
      const persistedDraft = persistedFieldState?.filterDraft ?? null;
      const persistedDesc = persistedFieldState?.filterDraftDesc ?? null;
      const persistedCriteria = persistedFieldState?.filterDraftCriteria ?? null;
      const persistedRuleEngineObj = persistedFieldState?.filterDraftRuleEngineObj ?? null;

      const normalizeCriteriaPayload = (criteriaValue, ruleDescValue = "") => {
        if (Array.isArray(criteriaValue)) {
          return {
            ruleDesc: String(ruleDescValue || ""),
            criteriaDto: criteriaValue,
          };
        }

        if (criteriaValue && typeof criteriaValue === "object") {
          return {
            ruleDesc: String(criteriaValue.ruleDesc || ruleDescValue || ""),
            criteriaDto: Array.isArray(criteriaValue.criteriaDto)
              ? criteriaValue.criteriaDto
              : [],
          };
        }

        return {
          ruleDesc: String(ruleDescValue || ""),
          criteriaDto: [],
        };
      };

      const existingCriteriaPayload = normalizeCriteriaPayload(existingCriteria, existingDesc);
      const persistedCriteriaPayload = normalizeCriteriaPayload(persistedCriteria, persistedDesc || existingDesc);

      const hasExistingCriteria = existingCriteriaPayload.criteriaDto.length > 0;
      const hasExistingDesc = Boolean(String(existingDesc || "").trim());
      const shouldPreferExisting = hasExistingCriteria || hasExistingDesc;

      const nextDraft = shouldPreferExisting
        ? initialValue || existingDesc
        : (persistedDraft !== null ? persistedDraft : initialValue || existingDesc);
      const nextDesc = shouldPreferExisting
        ? existingDesc
        : (persistedDesc !== null ? persistedDesc : existingDesc);
      const nextCriteria = shouldPreferExisting
        ? existingCriteriaPayload
        : persistedCriteriaPayload;
      const nextRuleEngineObj = shouldPreferExisting
        ? (existingRuleEngineObj || dmnStateEntry?.dmnContext || null)
        : (persistedRuleEngineObj || dmnStateEntry?.dmnContext || existingRuleEngineObj || null);

      const derivedCriteriaFromRuleEngine = {
        ruleDesc: String(nextRuleEngineObj?.ruleInfo?.ruleDesc || ""),
        criteriaDto: Array.isArray(nextRuleEngineObj?.dmnInfo?.contexts?.[0]?.criteriaDto)
          ? nextRuleEngineObj.dmnInfo.contexts[0].criteriaDto
          : [],
      };
      const hasNextCriteria =
        nextCriteria.criteriaDto.length > 0 ||
        Boolean(String(nextCriteria.ruleDesc || "").trim());
      const hasDerivedCriteria =
        derivedCriteriaFromRuleEngine.criteriaDto.length > 0 ||
        Boolean(String(derivedCriteriaFromRuleEngine.ruleDesc || "").trim());

      const nextInitialFilterJson = hasNextCriteria
        ? nextCriteria
        : hasDerivedCriteria
          ? derivedCriteriaFromRuleEngine
          : (persistedInitialFilterJson || null);

      if (STRATEGY_ACTION_FILTER_DEBUG) {
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
          snapshot: buildFilterStateSnapshot(storageRowKeys),
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
      const resolvedActionCode =
        normalizeActionCode(actionCode) || normalizeActionCode(existingRow?.szActionCode);
      setFilterDialogKey(
        `${resolvedActionCode || rowKey || gridRowId || "row"}-${rowIndex ?? "na"}-${field}`,
      );
      setFilterDialog({
        rowKey,
        gridRowId,
        rowIndex,
        actionCode: resolvedActionCode,
        field,
        storageRowKeys,
        initialFilterJson: nextInitialFilterJson,
        jsonByState: Boolean(dmnStateEntry?.dmnContext),
        dmnJsonByState: dmnStateEntry?.dmnContext || null,
      });
    },
    [allRows, dmnJsons, getFilterStorageRowKeys, readPersistedFilterField, resolveFilterStateRowKey],
  );

  const handleUpdateRow = useCallback((rowId, fields) => {
    setAllRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const mode = row.mode === "N" ? "N" : "E";
        const nextCode = fields.szActionCode ?? row.szActionCode;
        return {
          ...row,
          ...fields,
          id: row.mode === "N" ? nextCode || row.id : row.id,
          mode,
        };
      }),
    );
  }, []);

  const handleToggleDependency = useCallback(
    (rowCode, columnCode) => {
      if (!rowCode || !columnCode || rowCode === columnCode) return;

      setAllRows((prev) => {
        const targetRow = prev.find((item) => item.szActionCode === rowCode);
        const columnRow = prev.find((item) => item.szActionCode === columnCode);
        if (!targetRow || !columnRow) return prev;

        const targetDependsOn = parseRelationshipTokens(targetRow.szDependsOn);
        const targetSuccessors = parseRelationshipTokens(targetRow.szSuccessors);
        const columnDependsOn = parseRelationshipTokens(columnRow.szDependsOn);
        const columnSuccessors = parseRelationshipTokens(columnRow.szSuccessors);

        const isCurrentlyDependency = targetDependsOn.includes(columnCode);

        const updatedTargetDependsOn = isCurrentlyDependency
          ? targetDependsOn.filter((token) => token !== columnCode)
          : [...new Set([...targetDependsOn, columnCode])];

        const updatedTargetSuccessors = targetSuccessors.filter(
          (token) => token !== columnCode,
        );

        return prev.map((row) => {
          if (row.szActionCode !== rowCode) {
            return row;
          }

          return {
            ...row,
            mode: row.mode === "N" ? "N" : "E",
            szDependsOn: joinActionTokens(updatedTargetDependsOn),
            szSuccessors: joinActionTokens(updatedTargetSuccessors),
          };
        });
      });
    },
    [],
  );

  const handleDetailDelete = useCallback((row) => {
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

  const handleOpenAccess = useCallback((actionCode) => {
    if (!actionCode?.trim()) {
      toast.warning(
        intl.formatMessage({
          id: "message.StrategyActionMaster.actionCodeRequired",
          defaultMessage: "Save the action code before configuring access control.",
        }),
      );
      return;
    }
    setAccessDialogActionCode(actionCode);
  }, [intl, toast]);

  const columnDefs = useMemo(
    () =>
      getStrategyActionMasterColumnDefs({
        intl,
        actionTypeOptions,
        onOpenFilter: handleOpenFilter,
        onOpenAccess: handleOpenAccess,
        dependsOnRenderer,
        successorsRenderer,
      }),
    [
      intl,
      actionTypeOptions,
      handleOpenFilter,
      handleOpenAccess,
      dependsOnRenderer,
      successorsRenderer,
    ],
  );

  const hydrateRowWithPersistedFilterState = useCallback(
    (row) => {
      if (!row) return row;

      const rowKey = row.id || row.szActionCode;
      if (!rowKey) return row;

      const storageRowKeys = getFilterStorageRowKeys(
        row,
        rowKey,
        row?.gridRowId,
      );

      const hydrateField = (field) => {
        return readPersistedFilterField(storageRowKeys, field);
      };

      const excludePersisted = hydrateField("szExcludeCasesWith");
      const includePersisted = hydrateField("szIncludeCasesWith");
      const excludeCriteriaFromRow = Array.isArray(row.szExcludeCasesWithCriteriaDto)
        ? row.szExcludeCasesWithCriteriaDto
        : [];
      const excludeCriteriaFromPersisted = Array.isArray(excludePersisted?.filterDraftCriteria?.criteriaDto)
        ? excludePersisted.filterDraftCriteria.criteriaDto
        : [];
      const includeCriteriaFromRow = Array.isArray(row.szIncludeCasesWithCriteriaDto)
        ? row.szIncludeCasesWithCriteriaDto
        : [];
      const includeCriteriaFromPersisted = Array.isArray(includePersisted?.filterDraftCriteria?.criteriaDto)
        ? includePersisted.filterDraftCriteria.criteriaDto
        : [];

      return {
        ...row,
        szExcludeCasesWith:
          row.szExcludeCasesWith || excludePersisted?.filterDraft || "",
        szExcludeCasesWithRuleDesc:
          row.szExcludeCasesWithRuleDesc ||
          excludePersisted?.filterDraftDesc ||
          "",
        szExcludeCasesWithCriteriaDto: excludeCriteriaFromRow.length > 0
          ? excludeCriteriaFromRow
          : excludeCriteriaFromPersisted,
        szExcludeCasesWithObj:
          row.szExcludeCasesWithObj ||
          excludePersisted?.filterDraftRuleEngineObj ||
          null,

        szIncludeCasesWith:
          row.szIncludeCasesWith || includePersisted?.filterDraft || "",
        szIncludeCasesWithRuleDesc:
          row.szIncludeCasesWithRuleDesc ||
          includePersisted?.filterDraftDesc ||
          "",
        szIncludeCasesWithCriteriaDto: includeCriteriaFromRow.length > 0
          ? includeCriteriaFromRow
          : includeCriteriaFromPersisted,
        szIncludeCasesWithObj:
          row.szIncludeCasesWithObj ||
          includePersisted?.filterDraftRuleEngineObj ||
          null,
      };
    },
    [getFilterStorageRowKeys, readPersistedFilterField],
  );

  const persistStrategyActionChanges = useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      try {
        const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
        const resolveSaveMode = (row, fallbackMode) => {
          if (fallbackMode === "D") return "D";

          const actionCodeKey = normalizeActionCode(row?.szActionCode).toLowerCase();
          const existsInFetchedData =
            Boolean(actionCodeKey) && existingActionCodesRef.current.has(actionCodeKey);

          if (fallbackMode === "N" && existsInFetchedData) {
            return "E";
          }

          if (fallbackMode === "E" && !existsInFetchedData && row?.mode === "N") {
            return "N";
          }

          return fallbackMode;
        };

        const hydratedNewRows = newRows.map(hydrateRowWithPersistedFilterState);
        const hydratedUpdatedRows = updatedRows.map(hydrateRowWithPersistedFilterState);
        const hydratedDeletedRows = deletedRows.map(hydrateRowWithPersistedFilterState);
        const liveRows = collectCurrentGridRows(gridRef.current?.api);
        const fallbackRows = Array.isArray(allRows)
          ? allRows.filter((row) => row && !row._deleted)
          : [];
        const orderedSourceRows = liveRows.length > 0 ? liveRows : fallbackRows;
        const liveOrderCodes = extractRowOrderCodes(orderedSourceRows);
        const hasDeletion = hydratedDeletedRows.length > 0;
        const hasOrderChange = !areOrdersEqual(
          liveOrderCodes,
          rowOrderBeforeSaveRef.current,
        );
        const shouldSendFullOrderedPayload = hasOrderChange || hasDeletion;

        const orderedRows = orderedSourceRows;
        const getPayloadRowIdentity = (row) => {
          const byGridRowId = String(row?.gridRowId || "").trim();
          if (byGridRowId) return `grid:${byGridRowId}`.toLowerCase();

          const byId = String(row?.id || "").trim();
          if (byId) return `id:${byId}`.toLowerCase();

          return String(row?.szActionCode || "").trim().toLowerCase();
        };

        const deletedIdentitySet = new Set(
          hydratedDeletedRows
            .map((row) => getPayloadRowIdentity(row))
            .filter(Boolean),
        );

        const orderIndexByRowKey = new Map();
        orderedRows.forEach((row, index) => {
          const rowKey = getPayloadRowIdentity(row);
          if (!rowKey || orderIndexByRowKey.has(rowKey)) return;
          orderIndexByRowKey.set(rowKey, index);
        });

        const toOrderedSaveEntries = (rows, mode) =>
          rows.map((row) => {
            const resolvedMode = resolveSaveMode(row, mode);
            const rowKey = getPayloadRowIdentity(row);
            const orderIndex = orderIndexByRowKey.has(rowKey)
              ? orderIndexByRowKey.get(rowKey)
              : null;
            const saveRow = buildSaveRow(
              row,
              resolvedMode,
              userCode,
              {
                lnStrActSeqNo: Number.isInteger(orderIndex)
                  ? orderIndex + 1
                  : row?.lnStrActSeqNo,
              },
            );
            return { rowKey, saveRow };
          })
            .filter((entry) => {
              if (!entry.rowKey) return true;
              return entry.saveRow?.szMode === "D" || !deletedIdentitySet.has(entry.rowKey);
            });

        const sortSaveEntriesByGridOrder = (entries) =>
          entries
            .map((entry, index) => ({
              ...entry,
              index,
              order: orderIndexByRowKey.has(entry.rowKey)
                ? orderIndexByRowKey.get(entry.rowKey)
                : Number.MAX_SAFE_INTEGER,
            }))
            .sort((a, b) => {
              if (a.order !== b.order) return a.order - b.order;
              return a.index - b.index;
            })
            .map((entry) => entry.saveRow);

        const orderedChangedPayload = sortSaveEntriesByGridOrder([
          ...toOrderedSaveEntries(hydratedNewRows, "N"),
          ...toOrderedSaveEntries(hydratedUpdatedRows, "E"),
        ]);
        const orderedDeletedPayload = sortSaveEntriesByGridOrder(
          toOrderedSaveEntries(hydratedDeletedRows, "D"),
        );
        let payload = [...orderedChangedPayload, ...orderedDeletedPayload];

        if (shouldSendFullOrderedPayload) {
          const orderedLivePayload = orderedSourceRows
            .filter((row) => {
              const rowIdentity = getPayloadRowIdentity(row);
              if (!rowIdentity) return true;
              return !deletedIdentitySet.has(rowIdentity);
            })
            .map((row, index) =>
              buildSaveRow(
                hydrateRowWithPersistedFilterState(row),
                resolveSaveMode(row, row.mode === "N" ? "N" : "E"),
                userCode,
                { lnStrActSeqNo: index + 1 },
              ),
            );
          payload = [...orderedLivePayload, ...orderedDeletedPayload];
        }

        if (payload.length === 0) {
          // Keep master save as a no-op success so access changes can still be persisted.
          return { success: true, masterNoChanges: true };
        }

        const response = await HAxiosService.POST(
          StrategyActionMasterAPI.StrategyActionMaster(screenMenuId),
          payload,
        );
        const result = response?.data || {};
        const status = response?.status ?? 0;

        if (status >= 400) {
          console.error(
            "Strategy Action save rejected:",
            JSON.stringify({ status, result, payload }, null, 2),
          );
          if (result?.errors) {
            handleValidationErrors(intl, toast, result.errors);
            return { success: false };
          }
          toast.error(
            intl.formatMessage({
              id: "error.strategyActionSaveFailed",
              defaultMessage: "Failed to save strategy actions.",
            }),
          );
          return { success: false };
        }

        setDetailDeletedRows([]);
        const nextLiveRows = collectCurrentGridRows(gridRef.current?.api);

        if (nextLiveRows.length > 0) {
          setAllRows(
            nextLiveRows.map((row) => {
              const nextCode = normalizeActionCode(row?.szActionCode);
              return {
                ...row,
                id: nextCode || row.id,
                mode: "",
              };
            }),
          );
          rowOrderBeforeSaveRef.current = extractRowOrderCodes(nextLiveRows);
        } else {
          await loadStrategyActions();
        }
        return { success: true };
      } catch (error) {
        console.error("Failed to save data:", error);
        const data = error?.response?.data;
        if (data) {
          console.error(
            "Strategy Action save error body:",
            JSON.stringify({
              status: error?.response?.status,
              data,
              payloadPreview: {
                entries: [
                  ...(newRows || []),
                  ...(updatedRows || []),
                  ...(deletedRows || []),
                ].map((row) => ({
                  szActionCode: row?.szActionCode,
                  szRuleName: row?.szRuleName,
                })),
              },
            }, null, 2),
          );
        }
        if (data?.errors) {
          handleValidationErrors(intl, toast, data.errors);
        } else {
          toast.error(
            data?.message ||
            intl.formatMessage({
              id: "error.saveData.strategyAction",
              defaultMessage: "Error saving Strategy Action Master.",
            }),
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
      hydrateRowWithPersistedFilterState,
    ],
  );

  const handleGridSave = useCallback(
    async (changeSet) => persistStrategyActionChanges(changeSet),
    [persistStrategyActionChanges],
  );

  const persistStagedAccessSelections = useCallback(async () => {
    const cachedSelectionsByAction = readCache(ACCESS_SELECTION_CACHE_KEY);
    const stagedEntries = Object.entries(
      cachedSelectionsByAction && typeof cachedSelectionsByAction === "object"
        ? cachedSelectionsByAction
        : {},
    ).map(([actionCodeKey, selectedRows]) => ({
      actionCode: actionCodeKey,
      selectedProfileCodes: (Array.isArray(selectedRows) ? selectedRows : [])
        .map((row) => String(row?.profileCode || row?.szGroupId || "").trim())
        .filter(Boolean),
    }));

    if (stagedEntries.length === 0) {
      return { success: true };
    }

    const response = await HAxiosService.GET(
      StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, 'fetchStrategyActionAccess'),
    );
    const accessList = getAccessList(response?.data);
    const normalizedMappings = Array.isArray(accessList) ? accessList : [];

    const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const payload = [];

    stagedEntries.forEach((entry) => {
      const selectedActionCode = normalizeActionCode(entry?.actionCode);
      const actionCodeKey = normalizeAccessCode(selectedActionCode);
      if (!selectedActionCode || !actionCodeKey) return;

      const selectedCodes = new Set(
        (Array.isArray(entry?.selectedProfileCodes) ? entry.selectedProfileCodes : [])
          .map((code) => normalizeAccessCode(code))
          .filter(Boolean),
      );

      const previousMappingsForAction = normalizedMappings
        .filter((item) => normalizeAccessCode(item?.szActionCode) === actionCodeKey)
        .map((item) => String(item?.szGroupId || "").trim())
        .filter(Boolean);

      const previousCodeSet = new Set(
        previousMappingsForAction.map((code) => normalizeAccessCode(code)),
      );

      selectedCodes.forEach((profileCode) => {
        if (previousCodeSet.has(profileCode)) return;
        payload.push({
          szActionCode: selectedActionCode,
          szGroupId: profileCode,
          szUser: userCode,
          szMode: "N",
        });
      });

      previousMappingsForAction.forEach((profileCode) => {
        if (selectedCodes.has(normalizeAccessCode(profileCode))) return;
        payload.push({
          szActionCode: selectedActionCode,
          szGroupId: profileCode,
          szUser: userCode,
          szMode: "D",
        });
      });
    });

    if (payload.length === 0) {
      return { success: true };
    }

    const saveResponse = await HAxiosService.POST(
      StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, 'saveStrategyActionAccess'),
      payload,
    );
    const result = saveResponse?.data || {};
    const status = saveResponse?.status ?? 0;

    if (status >= 400) {
      throw new Error(result?.message || "Failed to save Strategy Action Access.");
    }


    writeCache(ACCESS_SELECTION_CACHE_KEY, {});
    return { success: true };
  }, [intl, toast]);

  const handleMasterSave = useCallback(async () => {
    let masterSaveResult = { success: false };

    if (activeView === "grid") {
      if (!isRelationshipSanitizingRef.current) {
        isRelationshipSanitizingRef.current = true;
        try {
          const orderedRows = collectCurrentGridRows(gridRef.current?.api);
          sanitizeGridRelationshipSelections(orderedRows);
        } finally {
          isRelationshipSanitizingRef.current = false;
        }
      }
      masterSaveResult = (await gridRef.current?.submitChanges?.()) || { success: false };
    } else if (activeView === "detail") {
      const newRows = allRows.filter((row) => row.mode === "N");
      const updatedRows = allRows.filter((row) => row.mode === "E");
      masterSaveResult = await persistStrategyActionChanges({
        newRows,
        updatedRows,
        deletedRows: detailDeletedRows,
      });
    } else {
      toast.info(
        intl.formatMessage({
          id: "message.StrategyActionMaster.noChanges",
          defaultMessage: "No changes to save.",
        }),
      );
      return { success: false };
    }

    if (!masterSaveResult?.success) {
      return masterSaveResult;
    }

    if (accessDialogActionCode && accessDialogRef.current?.submitAccessChanges) {
      await accessDialogRef.current.submitAccessChanges();
    } else {
      try {
        await persistStagedAccessSelections();
      } catch (error) {
        toast.error(
          error?.message ||
          intl.formatMessage({
            id: "message.StrategyActionAccess.saveError",
            defaultMessage: "Failed to save Strategy Action Access.",
          }),
        );
        return { success: false };
      }
    }

    // Always refresh from backend after successful save to show latest persisted values.
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
    toast,
  ]);

  const handleReset = useCallback(async () => {
    setQuery("");
    setTypeFilter(new Set());
    setActiveFilter("all");
    setHasDependsFilter(false);
    setHasSuccessorsFilter(false);
    setHasFilterFilter(false);
    setFocusRowId(null);
    setDetailDeletedRows([]);
    await loadStrategyActions();
    return { success: true };
  }, [loadStrategyActions]);

  const handleNewAction = useCallback(() => {
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

  // Compute ruleName for dialog FilterMaster based on current row's action code
  const filterDialogActionCode = (() => {
    const dialogActionCode = normalizeActionCode(filterDialog?.actionCode);
    if (dialogActionCode) return dialogActionCode;

    if (filterDialog?.gridRowId != null && gridRef.current?.api) {
      let fromGrid = "";
      gridRef.current.api.forEachNode((node) => {
        if (node.data?.gridRowId === filterDialog.gridRowId) {
          fromGrid = normalizeActionCode(node.data?.szActionCode);
        }
      });
      if (fromGrid) return fromGrid;
    }

    if (filterDialog?.rowKey) {
      const fromState = normalizeActionCode(
        allRows.find((r) => r.id === filterDialog.rowKey)?.szActionCode,
      );
      if (fromState) return fromState;
    }

    return "DRAFT";
  })();

  const filterDialogRuleName = filterDialog?.field === "szExcludeCasesWith"
    ? `${filterDialogActionCode}_SA_EX`
    : `${filterDialogActionCode}_SA_IN`;

  const resolveFilterCriteriaPayload = useCallback(({
    desc,
    criteria,
    ruleEngineObj,
    fallbackDesc,
    fallbackCriteria,
    fallbackRuleEngineObj,
  }) => {
    const candidates = [
      Array.isArray(criteria?.criteriaDto) ? criteria.criteriaDto : [],
      Array.isArray(fallbackCriteria?.criteriaDto) ? fallbackCriteria.criteriaDto : [],
    ];

    const criteriaDto = candidates.reduce(
      (best, current) => (current.length > best.length ? current : best),
      [],
    );
    const ruleDesc =
      String(desc || "").trim() ||
      String(fallbackDesc || "").trim() ||
      String(criteria?.ruleDesc || "").trim() ||
      String(fallbackCriteria?.ruleDesc || "").trim() ||
      "";

    return {
      ruleDesc,
      criteriaDto,
    };
  }, []);

  const handleApplyFilterDialog = useCallback(() => {

    if (!filterDialog?.field) return;

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
      fallbackRuleEngineObj: filterDraftRuleEngineObj,
    });

    const getCurrentDialogRow = () => {
      if (filterDialog.gridRowId != null && gridRef.current?.api) {
        let match = null;
        gridRef.current.api.forEachNode((node) => {
          if (node.data?.gridRowId === filterDialog.gridRowId) {
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
    const incomingHasData =
      Boolean(String(latestDraft || "").trim()) ||
      Boolean(String(resolvedCriteriaPayload.ruleDesc || "").trim()) ||
      (Array.isArray(resolvedCriteriaPayload.criteriaDto) &&
        resolvedCriteriaPayload.criteriaDto.length > 0) ||
      Boolean(latestRuleEngineObj);

    const existingFieldState = isExclude
      ? {
        text: String(currentDialogRow?.szExcludeCasesWith || ""),
        desc: String(currentDialogRow?.szExcludeCasesWithRuleDesc || ""),
        criteriaDto: Array.isArray(currentDialogRow?.szExcludeCasesWithCriteriaDto)
          ? currentDialogRow.szExcludeCasesWithCriteriaDto
          : [],
        obj:
          currentDialogRow?.szExcludeCasesWithObj &&
            typeof currentDialogRow.szExcludeCasesWithObj === "object"
            ? currentDialogRow.szExcludeCasesWithObj
            : null,
      }
      : {
        text: String(currentDialogRow?.szIncludeCasesWith || ""),
        desc: String(currentDialogRow?.szIncludeCasesWithRuleDesc || ""),
        criteriaDto: Array.isArray(currentDialogRow?.szIncludeCasesWithCriteriaDto)
          ? currentDialogRow.szIncludeCasesWithCriteriaDto
          : [],
        obj:
          currentDialogRow?.szIncludeCasesWithObj &&
            typeof currentDialogRow.szIncludeCasesWithObj === "object"
            ? currentDialogRow.szIncludeCasesWithObj
            : null,
      };

    const existingHasData =
      Boolean(existingFieldState.text.trim()) ||
      Boolean(existingFieldState.desc.trim()) ||
      existingFieldState.criteriaDto.length > 0 ||
      Boolean(existingFieldState.obj);

    const effectiveDraft =
      !incomingHasData && existingHasData
        ? existingFieldState.text
        : latestDraft;
    const effectiveDesc =
      !incomingHasData && existingHasData
        ? existingFieldState.desc
        : resolvedCriteriaPayload.ruleDesc;
    const effectiveCriteriaDto =
      !incomingHasData && existingHasData
        ? existingFieldState.criteriaDto
        : resolvedCriteriaPayload.criteriaDto;
    const effectiveRuleEngineObj =
      !incomingHasData && existingHasData
        ? existingFieldState.obj
        : latestRuleEngineObj;

    const storageRowKeysForLog =
      Array.isArray(filterDialog?.storageRowKeys) && filterDialog.storageRowKeys.length > 0
        ? filterDialog.storageRowKeys
        : [filterDialog?.rowKey].filter(Boolean);
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "handleApplyFilterDialog.preUpdate", {
        dialog: filterDialog,
        incomingHasData,
        existingHasData,
        latestDraft,
        latestDesc,
        latestCriteriaCount: Array.isArray(resolvedCriteriaPayload.criteriaDto)
          ? resolvedCriteriaPayload.criteriaDto.length
          : 0,
        effectiveDraft,
        effectiveDesc,
        effectiveCriteriaCount: Array.isArray(effectiveCriteriaDto)
          ? effectiveCriteriaDto.length
          : 0,
        storageRowKeysForLog,
        snapshotBeforeApply: buildFilterStateSnapshot(storageRowKeysForLog),
      });
    }

    const updateObj = {
      [filterDialog.field]: effectiveDraft,
      ...(isExclude
        ? {
          szExcludeCasesWithRuleDesc: effectiveDesc,
          szExcludeCasesWithObj: effectiveRuleEngineObj,
          szExcludeCasesWithCriteriaDto: effectiveCriteriaDto,
          szExcludeCasesWithRuleName: filterRuleName,
        }
        : {
          szIncludeCasesWithRuleDesc: effectiveDesc,
          szIncludeCasesWithObj: effectiveRuleEngineObj,
          szIncludeCasesWithCriteriaDto: effectiveCriteriaDto,
          szIncludeCasesWithRuleName: filterRuleName,
        }),
    };

    let resolvedGridRowId = filterDialog.gridRowId;
    if (resolvedGridRowId == null && filterDialog.rowKey && gridRef.current?.api) {
      gridRef.current.api.forEachNode((node) => {
        if (
          node.data?.id === filterDialog.rowKey ||
          node.data?.szActionCode === filterDialog.rowKey
        ) {
          resolvedGridRowId = node.data?.gridRowId;
        }
      });
    }

    let didUpdateGridRow = false;
    if (resolvedGridRowId != null) {
      didUpdateGridRow =
        gridRef.current?.updateRowFieldsByGridRowId?.(
          resolvedGridRowId,
          updateObj,
        ) === true;
    }

    // In detail view, keep parent state as source of truth.
    // In grid view, avoid setAllRows fallback because it can reset HAgGrid change tracking.
    if (
      filterDialog.rowKey &&
      activeView !== "grid" &&
      (resolvedGridRowId == null || !didUpdateGridRow)
    ) {
      setAllRows((prev) =>
        prev.map((row) =>
          row.id === filterDialog.rowKey
            ? {
              ...row,
              ...updateObj,
              mode: row.mode !== "N" ? "E" : row.mode,
            }
            : row,
        ),
      );
    }

    if (activeView === "grid" && !didUpdateGridRow) {
      toast.warning(
        intl.formatMessage({
          id: "message.StrategyActionMaster.gridTrackingFailed",
          defaultMessage: "Unable to track filter changes for this row. Please reopen the filter from grid and apply again.",
        }),
      );
      return;
    }

    const dialogSnapshot = filterDialog;

    const resolvedRowStateKey = resolveFilterStateRowKey(storageRowKeysForLog);
    if (resolvedRowStateKey && filterDialog?.field) {
      const hasAnyFilterData =
        Boolean(String(effectiveDesc || "").trim()) ||
        (Array.isArray(effectiveCriteriaDto) && effectiveCriteriaDto.length > 0) ||
        Boolean(effectiveRuleEngineObj);

      setDmnJsons((prev) => {
        const filtered = prev.filter(
          (entry) =>
            !(entry?.rowStateKey === resolvedRowStateKey && entry?.field === filterDialog.field),
        );

        if (!hasAnyFilterData || !effectiveRuleEngineObj) {
          return filtered;
        }

        return [
          ...filtered,
          {
            rowStateKey: resolvedRowStateKey,
            field: filterDialog.field,
            dmnContext: effectiveRuleEngineObj,
          },
        ];
      });
    }

    saveFilterDialogToStorage({
      dialog: dialogSnapshot,
      draft: effectiveDraft,
      desc: effectiveDesc,
      criteria: {
        ruleDesc: effectiveDesc,
        criteriaDto: Array.isArray(effectiveCriteriaDto) ? effectiveCriteriaDto : [],
      },
      ruleEngineObj: effectiveRuleEngineObj || null,
    });
    if (STRATEGY_ACTION_FILTER_DEBUG) {
      console.log(FILTER_DEBUG_TAG, "handleApplyFilterDialog.postSave", {
        field: dialogSnapshot?.field,
        storageRowKeysForLog,
        snapshotAfterApply: buildFilterStateSnapshot(storageRowKeysForLog),
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
    toast,
  ]);

  const filterDialogTitle =
    filterDialog?.field === "szExcludeCasesWith"
      ? intl.formatMessage({
        id: "label.StrategyActionMaster.excludeCasesDialog",
        defaultMessage: "Exclude Cases With",
      })
      : intl.formatMessage({
        id: "label.StrategyActionMaster.includeCasesDialog",
        defaultMessage: "Include Cases With",
      });

  return (
    <HBox className="strategy-action-master-page">
      <HBox className="strategy-action-master-header-card">
        <HBox className="strategy-action-master-header-row">
          <HBox className="strategy-action-master-header-main">
            <HBreadCrumb />
            <TitleBar title="label.StrategyActionMaster.title" />
            <Typography
              variant="body1"
              className="strategy-action-master-description"
            >
              {intl.formatMessage({
                id: "label.StrategyActionMaster.pageHeaderDescription",
                defaultMessage:
                  "Define strategy actions for Initiate Workflow, Change Workflow and Generate Mail. Used across workflow rules, group rules and strategy action limits.",
              })}
            </Typography>
          </HBox>

          <HBox className="strategy-action-master-view-switcher" role="tablist">
            {STRATEGY_ACTION_VIEWS.map((viewKey) => {
              const ViewIcon = VIEW_ICONS[viewKey];
              const isActive = activeView === viewKey;
              return (
                <button
                  key={viewKey}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`strategy-action-master-view-btn${isActive ? " is-active" : ""}`}
                  onClick={() => setActiveView(viewKey)}
                >
                  <ViewIcon className="strategy-action-master-view-btn-icon" />
                  {intl.formatMessage({
                    id: STRATEGY_ACTION_VIEW_LABEL_IDS[viewKey],
                    defaultMessage: viewKey,
                  })}
                </button>
              );
            })}
          </HBox>
        </HBox>
      </HBox>

      <HBox className="strategy-action-master-toolbar">
        <HBox className="strategy-action-master-search-wrap">
          <HTextField
            id="strategy-action-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            editable
            placeholder="label.StrategyActionMaster.searchPlaceholder"
            width="224px"
          />
        </HBox>

        <HBox className="strategy-action-master-type-chips">
          {actionTypeOptions.map((typeOption) => {
            const isActive = typeFilter.has(typeOption.value);
            const typeShort = String(typeOption.short || "").toLowerCase();

            // Color mapping by type
            const colorMap = {
              iw: { border: "hsl(210 89% 61%)", text: "hsl(210 89% 61%)", activeBg: "hsl(210 100% 90%)", activeText: "hsl(210 89% 40%)" },
              cw: { border: "hsl(270 81% 63%)", text: "hsl(270 81% 63%)", activeBg: "hsl(270 100% 90%)", activeText: "hsl(270 81% 40%)" },
              gm: { border: "hsl(120 73% 55%)", text: "hsl(120 73% 55%)", activeBg: "hsl(120 100% 90%)", activeText: "hsl(120 73% 35%)" },
            };

            const colors = colorMap[typeShort] || colorMap.iw;

            return (
              <HButton
                key={typeOption.value}
                label={typeOption.short || typeOption.label}
                size="small"
                sx={{
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
                    backgroundColor: isActive ? colors.activeBg : `color-mix(in srgb, ${colors.text} 8%, transparent)`,
                  },
                }}
                onClick={() =>
                  setTypeFilter((current) =>
                    toggleSetValue(current, typeOption.value),
                  )
                }
              />
            );
          })}
        </HBox>

        <HBox className="strategy-action-master-active-toggle">
          {ACTIVE_FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`strategy-action-master-active-toggle-btn${activeFilter === option ? " is-active" : ""}`}
              onClick={() => setActiveFilter(option)}
            >
              {intl.formatMessage({
                id: `label.StrategyActionMaster.activeFilter.${option}`,
                defaultMessage: option,
              })}
            </button>
          ))}
        </HBox>

        <HButton
          label={intl.formatMessage({
            id: "label.StrategyActionMaster.hasDependencies",
            defaultMessage: "Has dependencies",
          })}
          size="small"
          className={`strategy-action-master-filter-toggle${hasDependsFilter ? " is-active" : ""}`}
          sx={{
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
              backgroundColor: hasDependsFilter
                ? "hsl(210 100% 90%)"
                : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)",
            },
          }}
          onClick={() => setHasDependsFilter((value) => !value)}
        />
        <HButton
          label={intl.formatMessage({
            id: "label.StrategyActionMaster.hasSuccessors",
            defaultMessage: "Has successors",
          })}
          size="small"
          className={`strategy-action-master-filter-toggle${hasSuccessorsFilter ? " is-active" : ""}`}
          sx={{
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
              backgroundColor: hasSuccessorsFilter
                ? "hsl(210 100% 90%)"
                : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)",
            },
          }}
          onClick={() => setHasSuccessorsFilter((value) => !value)}
        />
        <HButton
          label={intl.formatMessage({
            id: "label.StrategyActionMaster.hasFilter",
            defaultMessage: "Has filter",
          })}
          size="small"
          className={`strategy-action-master-filter-toggle${hasFilterFilter ? " is-active" : ""}`}
          sx={{
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
              backgroundColor: hasFilterFilter
                ? "hsl(210 100% 90%)"
                : "color-mix(in srgb, hsl(210 89% 61%) 8%, transparent)",
            },
          }}
          onClick={() => setHasFilterFilter((value) => !value)}
        />
        <HBox style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <span className="strategy-action-master-count">
            {intl.formatMessage(
              {
                id: "label.StrategyActionMaster.rowCount",
                defaultMessage: "{filtered} of {total} actions",
              },
              { filtered: filteredCount, total: allRows.length },
            )}
          </span>

          {(activeView === "detail" || activeView === "dependencies") && (
            <HButton
              label={intl.formatMessage({ id: "label.StrategyActionMaster.newAction", defaultMessage: "+ New action" })}
              size="small"
              color="primary"
              sx={{
                backgroundColor: "var(--drs-primary-main, hsl(221 83% 53%))",
                color: "var(--drs-primary-contrast, hsl(0 0% 100%))",
                borderColor: "transparent",
                '&:hover': {
                  backgroundColor: "color-mix(in srgb, var(--drs-primary-main, hsl(221 83% 53%)) 90%, transparent)",
                },
              }}
              onClick={handleNewAction}
            />
          )}

          <HButton
            label={intl.formatMessage({ id: "label.StrategyActionMaster.export", defaultMessage: "Export" })}
            size="small"
            onClick={() => exportToExcel(filteredRows || [], "strategy-actions-grid.xlsx")}
            startIcon={<FiDownload size={14} />}
          />
        </HBox>
      </HBox>

      {activeView === "grid" && (
        <HBox className="strategy-action-master-grid-wrap">
          <HAgGrid
            ref={gridRef}
            key={intl.locale}
            rowData={allRows}
            columnDefs={columnDefs}
            gridClassName="drs-list-grid strategy-action-master-grid"
            embeddedInSection
            pagination={false}
            sort
            globalSearch={false}
            allowAdd
            allowDelete
            allowUpdate
            onSave={handleGridSave}
            isLoading={loading}
            hideInternalSaveButton
            rowDragging={true}
          />
        </HBox>
      )}

      {activeView === "detail" && (
        <StrategyActionDetail
          rows={filteredRows}
          allRows={allRows}
          actionTypeOptions={actionTypeOptions}
          focusRowId={focusRowId}
          onFocusRow={setFocusRowId}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDetailDelete}
          onOpenFilter={handleOpenFilter}
        />
      )}

      {/* Dependencies view removed from development scope */}

      <HButtonBar
        onSave={handleMasterSave}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
      />

      <Dialog
        open={Boolean(filterDialog)}
        keepMounted
        fullWidth
        maxWidth="md"
        onClose={handleCancelFilterDialog}
        PaperProps={{ className: "strategy-action-master-filter-dialog" }}
      >
        <DialogTitle className="strategy-action-master-dialog-title">
          {filterDialogTitle}
        </DialogTitle>
        <DialogContent>
          <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', margin: '0 auto' }}>
            <FilterMaster
              key={filterDialogKey || "strategy-action-filter"}
              ruleName={filterDialogRuleName}
              moduleName="COL"
              entityCode="ACNT"
              filterCode={0}
              filterTitle={filterDialogTitle}
              isPopedUp={false}
              // parentFilterProps={handleFilterMasterProps}
              // parentRuleEngineFilterProps={handleFilterMasterRuleEngineProps}
              ruleEngineDmnContext={handleFilterMasterRuleEngineProps}
              jsonByState={Boolean(filterDialog?.jsonByState)}
              dmnJsonByState={filterDialog?.dmnJsonByState || null}
              IsRuleEngBased={true}
              initialFilterJson={filterDialog?.initialFilterJson || null}
              useSession={false}
              compact={false}
            />
          </div>
          <HBox className="strategy-action-master-filter-actions">
            <HButton
              label={intl.formatMessage({
                id: "label.StrategyActionMaster.cancel",
                defaultMessage: "Cancel",
              })}
              onClick={handleCancelFilterDialog}
            />
            <HButton
              label={intl.formatMessage({
                id: "label.StrategyActionMaster.apply",
                defaultMessage: "Apply",
              })}
              color="primary"
              onClick={handleApplyFilterDialog}
            />
          </HBox>
        </DialogContent>
      </Dialog>

      <HDialog
        open={Boolean(accessDialogActionCode)}
        onClose={() => setAccessDialogActionCode(null)}
        disableContentWrapper
        header={
        <div className="strategy-action-master-dialog-title">
          <div className="strategy-action-master-dialog-title-text-wrap">
            <Typography className="strategy-action-master-dialog-title-text" component="span">
              {intl.formatMessage({
                id: "label.StrategyActionMaster.accessControl",
                defaultMessage: "Access Control",
              })}
              {accessDialogActionCode ? ` - ${accessDialogActionCode}` : ""}
            </Typography>
            <Typography className="strategy-action-master-dialog-subtitle" component="p">
              Select access profiles authorised to perform this strategy action.
            </Typography>
          </div>
          <IconButton className="strategy-action-master-dialog-close-btn" onClick={() => setAccessDialogActionCode(null)}>
            <CloseIcon />
          </IconButton>
          </div>
        }
        slotProps={{ paper: { className: "strategy-action-master-dialog" } }}
      >
        <DialogContent
          dividers
          className="strategy-action-master-dialog-content"
        >
          <StrategyActionAccess
            ref={accessDialogRef}
            actionCode={accessDialogActionCode}
            onClose={() => setAccessDialogActionCode(null)}
          />
        </DialogContent>
      </HDialog>
    </HBox>
  );
};

export default StrategyActionMaster;
