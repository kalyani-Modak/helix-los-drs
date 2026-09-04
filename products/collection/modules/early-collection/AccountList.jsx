import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useTheme, useMediaQuery, Container, IconButton, CircularProgress, Alert, Button, Stack, Tooltip, DialogTitle, DialogContent, MenuItem, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { ColListingAPI} from "./apiEndpoints";
import { useDispatch } from "react-redux";
import { setSelectedRow, fetchHeaderData } from "../../../common/slice/accountSlice";
import CollectorDashboardRecharts from "./CollectorDashboardRecharts";
import { useColorTheme } from "../../../../apps/debt-recovery-shell/src/themeSelectionConfig.jsx";
import { getBucketToneIndex, mixColors, withAlpha } from "../../../../apps/debt-recovery-shell/src/colors";
import { HAxiosService, HBox, HButton, HDropdown, HLabel, HPaper, HTextField, ALIGNMENT, ListGridFramework, useToast, HDialog } from "@helix/component-library";

import AdvancedSearchPanel from "./AdvancedSearchPanel.jsx";
import {buildFilterPayload} from "./AdvancedSearchPanel.jsx";
import SortPanel from "./SortPanel.jsx";
import { FunctionFrameworkAPI } from "./apiEndpoints";
import GroupFollowupPopup from "./followup/GroupFollowPopup";
import GroupTagPopup from "./tag-account/GroupTagPopup";
import GroupMemosPopup from "./memos/GroupMemosPopup";

// Modern icon imports
import {
  MdSearch,
  MdClear,
  MdClose,
} from "react-icons/md";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiShield,
  FiTrendingUp,
  FiAnchor,
  FiLink,
  FiStar,
  FiTag,
  FiUsers,
  FiRefreshCw,
  FiFileText,
  FiMessageSquare,
  FiX,
  FiEye,
  FiPlus,
  FiSliders,
  FiTrash2,
  FiPhone,
  FiDownload,
} from "react-icons/fi";


const listGridOuterStyle = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  maxWidth: "100%",
};
const ACCOUNTLIST_BACKEND_PAGE_SIZE = 100;
const getSavedFilterId = (filter) => filter?.listViewCode || filter?.viewCode || filter?.listViewName || filter?.viewName || "";
const getSavedFilterName = (filter) => filter?.listViewName || filter?.viewName || getSavedFilterId(filter);

function extractPlainRowData(row) {
  if (!row || typeof row !== "object") return {};

  // If row is an AG Grid RowNode, the actual data is on row.data
  const source = row?.data ?? row;

  // Copy only primitive-valued own properties — skips AG Grid internals
  return Object.fromEntries(
    Object.entries(source).filter(([key, val]) => {
      // Skip AG Grid internal keys
      if (key.startsWith("__")) return false;
      if (key === "__rowNode") return false;
      // Keep only serialisable values
      const t = typeof val;
      return t === "string" || t === "number" || t === "boolean" || val === null || val === undefined;
    })
  );
}

// Modern icon mapping
const ICON_CONFIG = (colors) => ({
  ESCLYN: {
    header: { icon: FiAlertCircle, color: colors.accent, tooltip: "Escalation Status" },
    cell: {
      Y: { icon: FiAlertCircle, color: colors.accent, tooltip: "Escalated", animation: "pulse" },
      default: { icon: FiAlertCircle, color: colors.text.light, tooltip: "Not Escalated", animation: "none" }
    }
  },
  AUTHYN: {
    header: { icon: FiShield, color: colors.primary, tooltip: "Authorization Status" },
    cell: {
      Y: { icon: FiCheckCircle, color: colors.secondary, tooltip: "Authorized", animation: "bounce" },
      N: { icon: FiAlertCircle, color: colors.accent, tooltip: "Not Authorized", animation: "none" },
      default: { icon: FiShield, color: colors.text.light, tooltip: "Unknown", animation: "none" }
    }
  },
  RESOL_TYP: {
    header: { icon: FiTrendingUp, color: colors.secondary, tooltip: "Resolution Type" },
    cell: {
      S: { icon: FiStar, color: colors.primary, tooltip: "Stabilized", animation: "spin" },
      N: { icon: FiCheckCircle, color: colors.secondary, tooltip: "Normalized", animation: "bounce" },
      F: { icon: FiLink, color: colors.accentLight, tooltip: "Follow-up", animation: "pulse" },
      B: { icon: FiAnchor, color: colors.accent, tooltip: "Broken", animation: "shake" },
      default: { icon: FiTrendingUp, color: colors.text.light, tooltip: "Unknown", animation: "none" }
    }
  }
});

const ICON_COLUMN_CODES = ["ESCLYN", "AUTHYN", "RESOL_TYP"];

/* Interface Delight HoverActions: text-success, text-primary, text-warning, text-foreground + hover:bg-accent */
const DELIGHT_ACTION_COLORS = {
  light: {
    call: "hsl(142, 71%, 45%)", /* --success */
    sms: "hsl(221, 83%, 53%)", /* --primary */
    followUp: "hsl(38, 92%, 50%)", /* --warning */
    view: "hsl(220, 20%, 10%)", /* --foreground */
    hoverBg: "hsl(221, 83%, 96%)", /* --accent */
  },
  dark: {
    call: "hsl(142, 71%, 50%)",
    sms: "hsl(221, 83%, 70%)",
    followUp: "hsl(38, 92%, 55%)",
    view: "hsl(210, 20%, 92%)",
    hoverBg: "hsl(221, 50%, 15%)", /* --accent dark */
  },
};

const STATUS_COLUMN_CODES = ["AUTHYN", "ESCLYN", "RESOL_TYP"];

const AVATAR_COLORS = [
  { bg: "rgba(37, 99, 235, 0.12)", fg: "#2563eb" },
  { bg: "rgba(34, 197, 94, 0.14)", fg: "#16a34a" },
  { bg: "rgba(245, 158, 11, 0.16)", fg: "#d97706" },
  { bg: "rgba(239, 68, 68, 0.14)", fg: "#dc2626" },
  { bg: "rgba(100, 116, 139, 0.16)", fg: "#475569" },
];

const getInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

const getAvatarPalette = (seed = "") => {
  const total = Array.from(String(seed)).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[total % AVATAR_COLORS.length];
};

const getRowValue = (row, keys = []) => {
  const match = keys.find((key) => row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "");
  return match ? row[match] : "";
};

const findAttribute = (attributes, matcher) => attributes.find((attr) => matcher(attr?.szAttributeCode, attr?.szAttributeDesc));

const isAccountNoField = (code = "", desc = "") => code === "ACT_NO" || /account\s*no/i.test(desc);
const isCustomerNoField = (code = "", desc = "") => code === "CUST_NO" || /customer\s*no/i.test(desc);
const isNameField = (code = "", desc = "") => /name/i.test(desc) || ["CUST_NM", "NAME", "CUSTOMER_NAME"].includes(code);
const isPortfolioField = (code = "", desc = "") => code === "PRTFL" || /portfolio/i.test(desc);
const isBucketField = (code = "", desc = "") => code === "BKT" || /bucket/i.test(desc);
const isOsAmountField = (code = "", desc = "") => code === "OS_AMT" || /\bos amount\b|outstanding/i.test(desc);
const isOdAmountField = (code = "", desc = "") => ["OD_AMT", "OVD_AMT"].includes(code) || /overdue amount|\bod amount\b/i.test(desc);

const StatusCell = ({ row, iconConfig }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, width: "100%" }}>
    {STATUS_COLUMN_CODES.map((code) => {
      const config = iconConfig?.[code]?.cell;
      const iconCfg = config?.[row?.[code]] || config?.default;
      const Icon = iconCfg?.icon;
      if (!Icon) return null;
      return (
        <Tooltip key={code} title={iconCfg.tooltip} arrow placement="top">
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0 }}>
            <Icon size={15} color={iconCfg.color} />
          </Box>
        </Tooltip>
      );
    })}
  </Box>
);

const NameCell = ({ value, row }) => {

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.1, minWidth: 0, width: "100%" }}>

      <HLabel
        value={value || "--"}
        translate={false}
        align="left"
        colon={false}
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--drs-text-primary, hsl(220, 20%, 10%))",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      />
    </Box>
  );
};

/** Trailing Actions column (not from API template) — aligned with Interface Delight HoverActions */
const AccountListActionsCell = ({ params, intl, onView, onFollowUp, onCall, onSms, isDark }) => {
  const row = params?.data;
  if (!row) return null;

  const pal = isDark ? DELIGHT_ACTION_COLORS.dark : DELIGHT_ACTION_COLORS.light;

  const actionBtn = (Icon, titleId, defaultTitle, onClick, iconColor) => (
    <Tooltip title={intl.formatMessage({ id: titleId, defaultMessage: defaultTitle })} arrow placement="top">
      <span>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClick();
          }}
          sx={{
            p: 0.35,
            color: iconColor,
            "&:hover": {
              color: iconColor,
              bgcolor: pal.hoverBg,
            },
          }}
        >
          <Icon size={14} />
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box
      className="drs-actions-cell"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        className="drs-actions-inner"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.125,
        }}
      >
        {actionBtn(FiPhone, "label.listview.action.call", "Call", onCall, pal.call)}
        {actionBtn(FiMessageSquare, "label.listview.action.sms", "SMS", onSms, pal.sms)}
        {actionBtn(FiFileText, "label.listview.action.followUp", "Follow Up", onFollowUp, pal.followUp)}
        {actionBtn(FiEye, "label.listview.action.view", "View", onView, pal.view)}
      </Box>
    </Box>
  );
};

const BULK_ACTIONS = [
  { key: "tag", label: "Tag", icon: FiTag, path: "/homelayout/tagAccount" },
  { key: "allocate", label: "Allocate", icon: FiUsers, path: "/homelayout/reallocateCase" },
  { key: "strategy", label: "Strategy", icon: FiRefreshCw, path: "/homelayout/stampStrategies" },
  { key: "followup", label: "Follow Up", icon: FiFileText, path: "/homelayout/followup/followup" },
  { key: "memo", label: "Memo", icon: FiMessageSquare, path: "/homelayout/memos" },
  
];

// Translation keys
const TRANSLATION_KEYS = {
  "Account No": "label.listview.accountNo",
  "Customer No": "label.listview.customerNo",
  "Name": "label.listview.name",
  "Portfolio": "label.listview.portfolio",
  "Bucket": "label.listview.bucket",
  "OS Amount": "label.listview.osAmount",
  "Overdue Amount": "label.listview.overdueAmount",
  "Collector Code": "label.listview.collectorCode",
  "Action Code": "label.listview.actionCode",
  "ESCLYN": "label.listview.esc",
  "AUTHYN": "label.listview.auth",
  "RESOL_TYP": "label.listview.res",
  "Accounts List": "label.accounts.list",
  Actions: "label.listview.actions",
};

const DEFAULT_ADVANCED_FILTERS = {};

const buildAdvancedFiltersState = (entityAttributes = []) => {
  const quickFilterAttributes = (Array.isArray(entityAttributes) ? entityAttributes : []).filter((attr) =>
    String(attr?.szType || "").includes("Q") && String(attr?.szAttributeCode || "").trim()
  );

  return quickFilterAttributes.reduce((acc, attr) => {
    acc[String(attr.szAttributeCode).trim()] = "";
    return acc;
  }, {});
};

const DEFAULT_ADVANCED_RULE = {
  id: "1",
  connector: "AND",
  field: "",
  operator: "=",
  value: "",
};


const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();

const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

const mergeSavedViews = (savedViews = []) => {
  const merged = new Map();

  (Array.isArray(savedViews) ? savedViews : []).forEach((item) => {
    const id = item?.listViewCode || item?.viewCode || item?.listViewName || item?.viewName || "";
    if (!id) return;

    const existing = merged.get(id) || {
      ...item,
      listViewCode: item?.listViewCode || item?.viewCode || id,
      viewCode: item?.viewCode || item?.listViewCode || id,
      listViewName: item?.listViewName || item?.viewName || id,
      viewName: item?.viewName || item?.listViewName || id,
    };

    existing.filterJson = existing.filterJson || item.filterJson || null;
    existing.sortJson = existing.sortJson || item.sortJson || null;

    merged.set(id, existing);
  });

  return Array.from(merged.values());
};

const getAdvancedFilterCount = (filters, rules) => {
  const filledBaseFilters = Object.values(filters).filter((value) => String(value ?? "").trim() !== "").length;
  const filledRules = rules.filter((rule) => rule.field && String(rule.value ?? "").trim() !== "").length;
  return filledBaseFilters + filledRules;
};



const normalizeAttributeKey = (value = "") => String(value ?? "").trim().toLowerCase();

const resolveAttributeCode = (entityAttributes = [], key) => {
  const normalizedKey = normalizeAttributeKey(key);
  const match = (Array.isArray(entityAttributes) ? entityAttributes : []).find((attr) => {
    return (
      normalizeAttributeKey(attr?.szAttributeCode) === normalizedKey ||
      normalizeAttributeKey(attr?.szAttributeDesc) === normalizedKey
    );
  });

  return match?.szAttributeCode || String(key ?? "").toUpperCase();
};

const normalizeSavedFilterOperator = (operator) => {
  const normalized = String(operator ?? "").trim().toUpperCase();

  switch (normalized) {
    case "=":
    case "EQUALS":
      return "is";
    case "!=":
    case "NOT_EQUALS":
      return "is_not";
    case ">":
    case "GREATER_THAN":
      return "gt";
    case "<":
    case "LESS_THAN":
      return "lt";
    case "CONTAINS":
    case "LIKE":
      return "LIKE";
    default:
      return normalized || "LIKE";
  }
};

const parseSavedFilterCriteria = (filterData, entityAttributes = []) => {
  if (!filterData) return null;

  const parseJsonValue = (value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  let filters = parseJsonValue(filterData.filterJson);
  const filterArray = filters?.filterJson || filters;
  if (!Array.isArray(filterArray)) return null;

  const nextFilters = buildAdvancedFiltersState(entityAttributes);
  const nextRules = [];

  filterArray.forEach((filter, index) => {
    const { key, opt, value } = filter || {};
    if (!key || value === undefined) return;

    const resolvedKey = resolveAttributeCode(entityAttributes, key);
    const normalizedOpt = String(opt ?? "").trim().toUpperCase();
    const isNormalFilterOperator = ["=", "EQUALS"].includes(normalizedOpt);

    if (isNormalFilterOperator) {
      nextFilters[resolvedKey] = value;
      return;
    }

    nextRules.push({
      id: `${Date.now()}-${index}`,
      connector: "AND",
      field: String(resolvedKey).toUpperCase(),
      operator: normalizeSavedFilterOperator(opt),
      value,
    });
  });

  const rawSortJson = parseJsonValue(filterData?.sortJson);
  const savedSortRules = Array.isArray(rawSortJson)
    ? rawSortJson
        .map((rule) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          field: String(rule?.key ?? "").trim().toUpperCase(),
          order: String(rule?.order ?? "asc").trim().toLowerCase() || "asc",
        }))
        .filter((rule) => rule.field)
    : Array.isArray(rawSortJson?.sortJson)
      ? rawSortJson.sortJson
          .map((rule) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            field: String(rule?.key ?? "").trim().toUpperCase(),
            order: String(rule?.order ?? "asc").trim().toLowerCase() || "asc",
          }))
          .filter((rule) => rule.field)
      : [];

  return {
    advancedFilters: nextFilters,
    advancedRules: nextRules.length ? nextRules : [DEFAULT_ADVANCED_RULE],
    sortRules: savedSortRules.length ? savedSortRules : [{ id: "1", field: "", order: "asc" }],
  };
};



const AccountList = ({ language }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const toast = useToast();
  const [columnDefs, setColumnDefs] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("account_no");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_ADVANCED_FILTERS);
  const [advancedRules, setAdvancedRules] = useState([DEFAULT_ADVANCED_RULE]);
  const [advancedSortRules, setAdvancedSortRules] = useState([{ id: "1", field: "", order: "asc" }]);
  const [sortRules, setSortRules] = useState([{ id: "1", field: "", order: "asc" }]);
  const [savedSorts, setSavedSorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridCacheBlockSize, setGridCacheBlockSize] = useState(ACCOUNTLIST_BACKEND_PAGE_SIZE);
  const [bulkSelectedRows, setBulkSelectedRows] = useState([]);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;
  
  // ========== OPTIMIZED: Single state for group operations ==========
  // Group Popup State - using a single state for all group operations
  const [groupPopupState, setGroupPopupState] = useState({
    open: false,
    type: null, // 'followup', 'tag', 'memo'
    selectedAccounts: []
  });
  // ========== END OPTIMIZED ==========

  const [savedFilters, setSavedFilters] = useState([]);
  const [selectedSavedFilterId, setSelectedSavedFilterId] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [entityAttributes, setEntityAttributes] = useState([]);

  const gridApiRef = useRef(null);
  const allRowsRef = useRef([]);
  const totalRecordsRef = useRef(0);
  const isSearchAppliedRef = useRef(false);

  const intl = useIntl();
  const navigate = useNavigate();

  /** Same flow as former "My Dashboard" toolbar button — opened from shell via location state */
  useEffect(() => {
    if (location.state?.openCollectorDashboard) {
      setDashboardOpen(true);
      navigate("/homelayout/listView", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const { colors } = useColorTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const panelThemeVars = useMemo(() => {
    if (!isDarkMode) return {};

    return {
      "--drs-bg-panel": mixColors(mixColors("#1f2937", colors.secondaryDark, 0.52), colors.primaryDark, 0.3),
      "--drs-bg-input": mixColors(mixColors("#111827", colors.secondaryDark, 0.3), colors.primaryDark, 0.18),
      "--drs-border-divider": mixColors("#334155", colors.primary, 0.28),
      "--drs-control-border": withAlpha(colors.primaryLight, 0.38),
      "--drs-control-hover-border": colors.primaryLight,
      "--drs-hover-bg": withAlpha(colors.primary, 0.18),
      "--drs-button-outline-bg": withAlpha(colors.primary, 0.12),
      "--drs-button-outline-hover": withAlpha(colors.primary, 0.2),
      "--drs-button-outline-text": colors.primaryLight,
      "--drs-text-secondary": mixColors("#cbd5e1", colors.secondaryLight, 0.42),
      "--drs-text-tertiary": mixColors("#94a3b8", colors.secondaryLight, 0.35),
    };
  }, [colors, isDarkMode]);

  // Debug logging
  useEffect(() => {
    console.log('AccountList State:', {
      columnDefsLength: columnDefs.length,
      allRowsLength: allRows.length,
      filteredRowsLength: filteredRows.length,
      searchTerm,
      isLoading,
      error
    });
  }, [columnDefs, allRows, filteredRows, searchTerm, isLoading, error]);

  const getAlignmentForColumn = useCallback((code, desc) => {
    const fieldName = (desc || code || "").toLowerCase().trim();
    if (/(amount|balance|amt|price|value)\b/i.test(fieldName)) return "right";
    if (/(bucket|status|escalation|authorization|resolution|state)\b/i.test(fieldName)) return "center";
    return "left";
  }, []);

  const fieldMap = useMemo(
    () => ({
      account_no: ["ACT_NO"],
      customer_no: ["CUST_NO"],
      name: ["NAME", "CUST_NM", "CUSTOMER_NAME"],
      portfolio: ["PRTFL"],
      bucket: ["BKT"],
      od_amount: ["OD_AMT", "OVD_AMT"],
      os_amount: ["OS_AMT"],
      auth: ["AUTHYN"],
      escalation: ["ESCLYN"],
      resolution: ["RESOL_TYP"],
    }),
    []
  );

  const getValueFormatterForColumn = useCallback((code, desc) => {
    const fieldName = (desc || code || "").toLowerCase().trim();
    if (ICON_COLUMN_CODES.includes(code)) return undefined;
    if (/amount|balance|amt|price|value/i.test(fieldName)) {
      return (params) =>
        params.value != null
          ? new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
          }).format(params.value).replace('₹', '₹ ')
          : "";
    }
    return undefined;
  }, []);

  const prepareAccountContext = useCallback((row) => {
    if (!row) return;
    dispatch(setSelectedRow(row));
    dispatch(fetchHeaderData(row));
  }, [dispatch]);

  const handleViewAccount = useCallback((row) => {
    prepareAccountContext(row);
    const storedFunIdItems = localStorage.getItem("SEC_MENUS_FUNID_ITEMS");

    const requestPayload = {
      ...row,
      CLIENT_NAME: "EARLY-COLLECTIONS",
      SEC_MENUS_FUNID_ITEMS: storedFunIdItems
        ? JSON.parse(storedFunIdItems)
        : [],
    };
    ////Need to keep this data in backed in accountContext.--venkatesh.balla
    HAxiosService.POST(FunctionFrameworkAPI.createAccountContext(), requestPayload)

      .then((res) => {
        if (res.data?.status === "SUCCESS") {
          sessionStorage.setItem("SEC_ACTIVE_MENU_ID", "ECF-overview");
          navigate("/homelayout/OverView", {
                        state: {
                            menuId: "ECF-overview",
                            parentIds: ['EC-ListView', 'ECF-Financials'],
                        },
                    });
        } else {
          console.error("Menu function response error", res);
        }
      })
      .catch((err) => {
        console.error("Menu function error", err);
      })
  }, [navigate, prepareAccountContext]);

  const handleFollowUp = useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/followup/followup", {
      state: { selectedAccounts: [row], fromList: true },
    });
  }, [navigate, prepareAccountContext]);

  const handleTag = useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/tagAccount", {
      state: { selectedAccounts: [row] },
    });
  }, [navigate, prepareAccountContext]);

  const handleMemo = useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/memos", {
      state: { selectedAccounts: [row] },
    });
  }, [navigate, prepareAccountContext]);

  const handleCall = useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/call");
  }, [navigate, prepareAccountContext]);

  const handleSms = useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/sms");
  }, [navigate, prepareAccountContext]);

  const handleAccountClick = useCallback((params) => {
    handleViewAccount(params?.data);
  }, [handleViewAccount]);

  const evaluateRule = useCallback((row, rule) => {
    if (!rule.field || !String(rule.value ?? "").trim()) return true;

    const candidateKeys = fieldMap[rule.field.toLowerCase()] || [rule.field];
    const rawValue = getRowValue(row, candidateKeys);
    const actual = normalizeValue(rawValue);
    const expected = normalizeValue(rule.value);

    if (rule.operator === "gt" || rule.operator === "lt") {
      const actualNumber = parseNumericValue(rawValue);
      const expectedNumber = parseNumericValue(rule.value);
      if (actualNumber === null || expectedNumber === null) return false;
      return rule.operator === "gt" ? actualNumber > expectedNumber : actualNumber < expectedNumber;
    }

    if (rule.operator === "is") return actual === expected;
    if (rule.operator === "is_not") return actual !== expected;
    return actual.includes(expected);
  }, [fieldMap]);

  const filterData = useCallback((data, searchValue, selectedField, filters, rules) => {
    const trimmedSearch = searchValue.trim();
    const hasSearch = Boolean(trimmedSearch);

    return data.filter((row) => {
      const matchesSearch = !hasSearch || (() => {
        const lowercasedSearch = trimmedSearch.toLowerCase();
        if (selectedField === "all") {
          return Object.values(row).some((value) => {
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(lowercasedSearch);
          });
        }

        const candidateKeys = fieldMap[selectedField] || [];
        return candidateKeys.some((key) => String(row?.[key] ?? "").toLowerCase().includes(lowercasedSearch));
      })();

      if (!matchesSearch) return false;

      const portfolioValue = normalizeValue(getRowValue(row, fieldMap.portfolio));
      const bucketValue = normalizeValue(getRowValue(row, fieldMap.bucket));
      const authValue = normalizeValue(getRowValue(row, fieldMap.auth));
      const odValue = parseNumericValue(getRowValue(row, fieldMap.od_amount));
      const osValue = parseNumericValue(getRowValue(row, fieldMap.os_amount));

      if (filters.portfolio && !portfolioValue.includes(normalizeValue(filters.portfolio))) return false;
      if (filters.bucket && bucketValue !== normalizeValue(filters.bucket)) return false;
      if (filters.status && authValue !== normalizeValue(filters.status)) return false;
      if (filters.odMin && (odValue === null || odValue < Number(filters.odMin))) return false;
      if (filters.odMax && (odValue === null || odValue > Number(filters.odMax))) return false;
      if (filters.osMin && (osValue === null || osValue < Number(filters.osMin))) return false;
      if (filters.osMax && (osValue === null || osValue > Number(filters.osMax))) return false;

      const activeRules = rules.filter((rule) => rule.field && String(rule.value ?? "").trim() !== "");
      if (!activeRules.length) return true;

      return activeRules.reduce((result, rule, index) => {
        const current = evaluateRule(row, rule);
        if (index === 0) return current;
        return rule.connector === "OR" ? result || current : result && current;
      }, true);
    });
  }, [evaluateRule, fieldMap]);

  const searchCriteriaCount = useMemo(() => {
    return Boolean(searchTerm.trim()) || getAdvancedFilterCount(advancedFilters, advancedRules) > 0;
  }, [advancedFilters, advancedRules, searchTerm]);

  const displayRows = useMemo(() => {
    const rows = isSearchApplied ? filteredRows : allRows;
    return Array.isArray(rows) ? rows : [];
  }, [isSearchApplied, filteredRows, allRows]);

  const searchFieldOptions = useMemo(
    () => [
      { value: "account_no", label: "Account No" },
      { value: "customer_no", label: "Customer No" },
      { value: "name", label: "Name" },
    ],
    []
  );

  const savedFilterOptions = useMemo(
    () => savedFilters.map((filter) => ({ value: getSavedFilterId(filter), label: getSavedFilterName(filter) })).filter((option) => option.value),
    [savedFilters]
  );

  const pageSizeOptions = useMemo(
    () => [5, 10, 15, 20].map((size) => ({ value: size, label: String(size) })),
    []
  );

  useEffect(() => {
    if (!isSearchApplied) {
      setFilteredRows(allRows);
    }
  }, [allRows, isSearchApplied]);

  useEffect(() => {
    allRowsRef.current = Array.isArray(allRows) ? allRows : [];
  }, [allRows]);

  useEffect(() => {
    totalRecordsRef.current = Number(totalRecords) || 0;
  }, [totalRecords]);

  useEffect(() => {
    isSearchAppliedRef.current = isSearchApplied;
  }, [isSearchApplied]);

  // AG Grid cannot change between the infinite and client-side row models in
  // place. Remount only when that mode changes—not when the row count changes.
  const gridModeKey = isSearchApplied ? "search-results" : "infinite-list";

  const isAnyPanelOpen = isAdvancedSearchOpen || isAdvancedSortOpen;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getSearchFieldKeys = useCallback((field) => {
    const map = {
      account_no: ["ACT_NO"],
      customer_no: ["CUST_NO"],
      name: ["NAME", "CUST_NM", "CUSTOMER_NAME"],
    };
    return map[field] || [];
  }, []);

  const buildSortJson = useCallback((rules = sortRules) => {
    return (Array.isArray(rules) ? rules : [])
      .filter((rule) => String(rule?.field ?? "").trim())
      .map((rule) => ({
        key: String(rule.field ?? "").trim().toUpperCase(),
        order: String(rule.order ?? "asc").trim().toLowerCase(),
      }));
  }, [sortRules]);

  const buildSearchPayload = useCallback((overrides = {}) => {
    const search = overrides.searchTerm !== undefined ? overrides.searchTerm : searchTerm;
    const field = overrides.searchField !== undefined ? overrides.searchField : searchField;
    const filters = overrides.advancedFilters !== undefined ? overrides.advancedFilters : advancedFilters;
    const rules = overrides.advancedRules !== undefined ? overrides.advancedRules : advancedRules;
    const sortRuleSet = overrides.sortRules !== undefined ? overrides.sortRules : sortRules;

    const payload = buildFilterPayload({ filterName: "", advancedFilters: filters, rules, entityAttributes });
    const trimmedSearch = String(search ?? "").trim();
    const filterList = [...payload.filters];

    if (trimmedSearch) {
      if (field === "all") {
        filterList.push({ key: "GLOBAL_SEARCH", opt: "LIKE", value: trimmedSearch });
      } else {
        const keys = getSearchFieldKeys(field);
        if (keys.length) {
          keys.forEach((key) => {
            filterList.push({ key, opt: "LIKE", value: trimmedSearch });
          });
        } else {
          filterList.push({ key: field, opt: "LIKE", value: trimmedSearch });
        }
      }
    }

    return {
      listId: "ACLST",
      userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      moduleName: "COL",
      viewCode: "ACLST_DEF",
      viewName: "Default View",
      filterJson: filterList,
      sortJson: buildSortJson(sortRuleSet),
      pageNumber: 1,
      pageSize: ACCOUNTLIST_BACKEND_PAGE_SIZE,
    };
  }, [advancedFilters, advancedRules, buildSortJson, getSearchFieldKeys, searchField, searchTerm, sortRules]);

  const fetchTotalCount = useCallback(async (payload) => {
    try {
      const response = await HAxiosService.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListDataCount`, { params: payload });
      const raw = response?.data?.responseJson;
      const resolvedTotal = Number(
        response?.data?.totalCount ??
        raw?.totalCount ??
        raw?.count ??
        raw?.total ??
        raw ??
        0
      );
      return Number.isFinite(resolvedTotal) && resolvedTotal > 0 ? resolvedTotal : 0;
    } catch (error) {
      console.warn("Failed to fetch list data count", error);
      return 0;
    }
  }, []);

  const resolveDynamicBlockSize = useCallback(() => {
    // Keep cache block aligned to backend page size so page mapping stays stable.
    return ACCOUNTLIST_BACKEND_PAGE_SIZE;
  }, []);

  const hasActualSearchCriteria = useCallback((overrides = {}) => {
    const search = overrides.searchTerm !== undefined ? overrides.searchTerm : searchTerm;
    const filters = overrides.advancedFilters !== undefined ? overrides.advancedFilters : advancedFilters;
    const rules = overrides.advancedRules !== undefined ? overrides.advancedRules : advancedRules;
    const sortRuleSet = overrides.sortRules !== undefined ? overrides.sortRules : sortRules;

    const hasSearchText = String(search ?? "").trim().length > 0;
    const hasAdvancedFilters = Object.values(filters || {}).some((value) => String(value ?? "").trim().length > 0);
    const hasAdvancedRules = Array.isArray(rules) && rules.some((rule) => String(rule?.field ?? "").trim() && String(rule?.value ?? "").trim());
    const hasSortRules = Array.isArray(sortRuleSet) && sortRuleSet.some((rule) => String(rule?.field ?? "").trim());

    return hasSearchText || hasAdvancedFilters || hasAdvancedRules || hasSortRules;
  }, [advancedFilters, advancedRules, searchTerm, sortRules]);

  const handleSearchAccounts = useCallback(async (overrides = {}) => {
    const shouldKeepSearchState = overrides.resetView !== true;
    const shouldAllowEmptySearch = overrides.resetView === true;

    if (!shouldAllowEmptySearch && !hasActualSearchCriteria(overrides)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const requestBody = buildSearchPayload(overrides);

    try {
      const totalFromCountApi = await fetchTotalCount(requestBody);
      const response = await HAxiosService.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: requestBody });
      if (response?.data?.status === "SUCCESS") {
        const rows = response.data.responseJson ?? [];
        const total = totalFromCountApi || response.data.totalCount || rows.length;
        setAllRows(rows);
        setFilteredRows(rows);
        setIsSearchApplied(shouldKeepSearchState);
        setTotalRecords(total);
        setGridCacheBlockSize(resolveDynamicBlockSize(total, pageSize));
        setIsAdvancedSearchOpen(false);
      } else {
         setAllRows([]);
         setTotalRecords(0);
         setGridCacheBlockSize(resolveDynamicBlockSize(0, pageSize));
       // setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Search request failed", error);
      setError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [buildSearchPayload, hasActualSearchCriteria, fetchTotalCount, resolveDynamicBlockSize, pageSize]);

  const applySavedFilter = useCallback((selectedFilter, options = {}) => {
    if (!selectedFilter) return;

    try {
      const parsedCriteria = parseSavedFilterCriteria(selectedFilter, entityAttributes);
      if (!parsedCriteria) return;

      setSelectedSavedFilterId(getSavedFilterId(selectedFilter));
      setSearchTerm("");
      setSearchField("account_no");
      setAdvancedFilters(parsedCriteria.advancedFilters);
      setAdvancedRules(parsedCriteria.advancedRules);
      setAdvancedSortRules(parsedCriteria.sortRules || [{ id: "1", field: "", order: "asc" }]);

      if (options.runSearch !== false) {
        handleSearchAccounts({
          searchTerm: "",
          searchField: "account_no",
          advancedFilters: parsedCriteria.advancedFilters,
          advancedRules: parsedCriteria.advancedRules,
          sortRules: parsedCriteria.sortRules || [{ id: "1", field: "", order: "asc" }],
        });
      }
    } catch (error) {
      console.error("Failed to apply saved filter:", error);
    }
  }, [entityAttributes, handleSearchAccounts]);

  const handleSavedFilterChange = useCallback((event) => {
    const filterId = event.target.value;
    if (!filterId) {
      return;
    }

    const selectedFilter = savedFilters.find((filter) => getSavedFilterId(filter) === filterId);
    applySavedFilter(selectedFilter);
  }, [applySavedFilter, savedFilters]);

  const handleDeleteSavedFilter = useCallback((filterId) => {
    setSavedFilters((prev) => prev.filter((filter) => getSavedFilterId(filter) !== filterId));
  }, []);

  const handleAdvancedFilterChange = useCallback((key, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleRuleChange = useCallback((id, key, value) => {
    setAdvancedRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule)));
  }, []);
  

  const handleAddRule = useCallback(() => {
    setAdvancedRules((prev) => [
      ...prev,
      {
        ...DEFAULT_ADVANCED_RULE,
        id: `${Date.now()}-${prev.length + 1}`,
      },
    ]);
  }, []);

  const handleRemoveRule = useCallback((id) => {
    setAdvancedRules((prev) => (prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id)));
  }, []);

  const handleAdvancedSortRuleChange = useCallback((id, key, value) => {
    setAdvancedSortRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule)));
  }, []);

  const handleAddAdvancedSortRule = useCallback(() => {
    setAdvancedSortRules((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        field: "",
        order: "asc",
      },
    ]);
  }, []);

  const handleRemoveAdvancedSortRule = useCallback((id) => {
    setAdvancedSortRules((prev) => (prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id)));
  }, []);

  const handleSortRuleChange = useCallback((id, key, value) => {
    setSortRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule)));
  }, []);

  const handleReplaceSortRules = useCallback((nextRules = []) => {
    const normalizedRules = Array.isArray(nextRules) && nextRules.length
      ? nextRules.map((rule, index) => ({
          id: rule?.id || `sort-${Date.now()}-${index + 1}`,
          field: String(rule?.field ?? "").trim(),
          order: String(rule?.order ?? "asc").trim().toLowerCase() || "asc",
        }))
      : [{ id: "1", field: "", order: "asc" }];

    setSortRules(normalizedRules);
  }, []);

  const handleAddSortRule = useCallback(() => {
    setSortRules((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        field: "",
        order: "asc",
      },
    ]);
  }, []);

  const handleRemoveSortRule = useCallback((id) => {
    setSortRules((prev) => (prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id)));
  }, []);

  const handleDeleteSavedSort = useCallback((sortId) => {
    setSavedSorts((prev) => prev.filter((sort) => (sort?.listViewCode || sort?.viewCode) !== sortId));
  }, []);

  const handleClearAdvancedSearch = useCallback(() => {
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules([{ id: "1", field: "", order: "asc" }]);
  }, [entityAttributes]);

  const handleClearAdvancedSearchAndSort = useCallback(() => {
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules([{ id: "1", field: "", order: "asc" }]);
  }, [entityAttributes]);

  const handleClearSort = useCallback(() => {
    setSortRules([{ id: "1", field: "", order: "asc" }]);
  }, []);

  const handleApplySort = useCallback(() => {
    setIsAdvancedSortOpen(false);
    handleSearchAccounts({ sortRules });
  }, [handleSearchAccounts, sortRules]);

  const resetAllFilters = useCallback(async () => {
    const clearedSortRules = [{ id: "1", field: "", order: "asc" }];

    setSearchTerm("");
    setSearchField("account_no");
    setSelectedSavedFilterId("");
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules(clearedSortRules);
    setSortRules(clearedSortRules);
    setIsAdvancedSearchOpen(false);
    setIsAdvancedSortOpen(false);
    setIsSearchApplied(false);
    setFilteredRows([]);

    await handleSearchAccounts({
      searchTerm: "",
      searchField: "account_no",
      advancedFilters: buildAdvancedFiltersState(entityAttributes),
      advancedRules: [DEFAULT_ADVANCED_RULE],
      sortRules: clearedSortRules,
      resetView: true,
    });
  }, [entityAttributes, handleSearchAccounts]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Fetch column metadata and initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First fetch column metadata
        const templateBody = { listId: "ACLST", userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM", moduleName: "COL", defViewCode: "ACLST_DEF"};
        const templateResponse = await HAxiosService.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListTemplate`, { params: templateBody });

        if (templateResponse?.data?.status === "SUCCESS") {
          const fetchedAttributes = templateResponse.data.responseJson?.listView?.[0]?.lstAttribute || [];
          const fetchedEntityAttributes = templateResponse.data.responseJson?.listEntityAttribute || [];
          setAttributes(fetchedAttributes);
          setEntityAttributes(fetchedEntityAttributes);
          setAdvancedFilters(buildAdvancedFiltersState(fetchedEntityAttributes));
          const quickFilterOptions = fetchedEntityAttributes.filter((attr) => String(attr?.szType || "").includes("Q"));
          const iconCfg = ICON_CONFIG(colors);

          const savedViews = Array.isArray(templateResponse.data.responseJson?.savedFilters)
            ? templateResponse.data.responseJson.savedFilters
            : [];

          const mergedSavedViews = mergeSavedViews(savedViews);
          const filteredSavedViews = mergedSavedViews.filter((item) =>
            item?.filterJson != null && String(item.filterJson).trim() !== ""
          );
          const sortedSavedViews = mergedSavedViews.filter((item) =>
            item?.sortJson != null &&
            String(item.sortJson).trim() !== "" &&
            (!item?.filterJson || String(item.filterJson).trim() === "")
          );

          setSavedFilters(filteredSavedViews);
          setSavedSorts(sortedSavedViews);

          const buildColumn = (attr, overrides = {}) => {
            if (!attr) return null;
            const translationKey =
              TRANSLATION_KEYS[attr.szAttributeCode] ||
              TRANSLATION_KEYS[attr.szAttributeDesc] ||
              attr.szAttributeDesc;
            const alignment = getAlignmentForColumn(attr.szAttributeCode, attr.szAttributeDesc);
            const valueFormatter = getValueFormatterForColumn(attr.szAttributeCode, attr.szAttributeDesc);

            return {
              field: attr.szAttributeCode,
              headerName: intl.formatMessage({ id: translationKey, defaultMessage: attr.szAttributeDesc }),
              sortable: true,
              filter: true,
              resizable: true,
              hide: attr.szType === "H",
              tooltipValueGetter: (params) => {
                const originalValue = params.data?.[attr.szAttributeCode];
                return `${attr.szAttributeDesc}: ${originalValue || "N/A"}`;
              },
              valueFormatter,
              cellStyle: {
                textAlign: alignment,
                fontFamily: alignment === "right" ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" : undefined,
              },
              width: isMobile ? 110 : 132,
              minWidth: isMobile ? 84 : 96,
              ...overrides,
            };
          };

          const accountNoAttr = findAttribute(fetchedAttributes, isAccountNoField);
          const customerNoAttr = findAttribute(fetchedAttributes, isCustomerNoField);
          const nameAttr = findAttribute(fetchedAttributes, isNameField);
          const portfolioAttr = findAttribute(fetchedAttributes, isPortfolioField);
          const bucketAttr = findAttribute(fetchedAttributes, isBucketField);
          const osAmountAttr = findAttribute(fetchedAttributes, isOsAmountField);
          const odAmountAttr = findAttribute(fetchedAttributes, isOdAmountField);

          const gridColumns = [
            {
              colId: "drs_status",
              field: "drs_status",
              headerName: intl.formatMessage({
                id: "label.listview.status",
                defaultMessage: "Status",
              }),
              sortable: false,
              filter: false,
              resizable: false,
              suppressMenu: true,
              headerClass: "ag-center-aligned-header",
              width: 90,
              minWidth: 90,
              maxWidth: 90,
              cellStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
              },
              cellRenderer: (params) => <StatusCell row={params.data} iconConfig={iconCfg} />,
            },
            buildColumn(accountNoAttr, {
              flex: 1,
              minWidth: 120,
              cellClass: "drs-account-no-cell",
              cellStyle: {
                fontWeight: 500,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "2px 6px"
              }
            }),
            buildColumn(customerNoAttr, {
              flex: 1,
              minWidth: 120,
              cellClass: "drs-customer-no-cell",
              cellStyle: {
                fontWeight: 400,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "2px 6px"
              }
            }),
            buildColumn(nameAttr, {
              flex: 1,
              minWidth: 140,
              cellStyle: {
                color: "var(--drs-text-primary, #0f172a)",
                fontWeight: 500,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
              },
              cellRenderer: (params) => <NameCell value={params.value} row={params.data} />,
            }),
            buildColumn(portfolioAttr, {
              flex: 1,
              minWidth: 104,
              cellStyle: {
                color: "var(--drs-text-secondary, #334155)",
                fontWeight: 400,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
              }
            }),
            buildColumn(bucketAttr, {
              width: 96,
              minWidth: 96,
              headerClass: "ag-center-aligned-header",
              cellClass: "drs-bucket-cell",
              cellStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              cellRenderer: (params) => {
                const bucketTone = getBucketToneIndex(params.value, 12);
                return (
                  <span className={`drs-bucket-badge drs-bucket-tone-${bucketTone}`}>
                    {params.value}
                  </span>
                );
              },
            }),
            buildColumn(osAmountAttr, {
              flex: 1,
              minWidth: 120,
              headerClass: "ag-right-aligned-header",
              cellClass: "ag-right-aligned-cell",
              cellStyle: (params) => {
                const isHighRisk = params.data && params.data.BKT && Number(params.data.BKT) > 6;
                return {
                  textAlign: "right",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: isHighRisk ? "var(--destructive, #ef4444) !important" : "var(--drs-text-primary, #0f172a)",
                  fontSize: "12px",
                  fontWeight: isHighRisk ? 600 : 400,
                };
              }
            }),
            buildColumn(odAmountAttr, {
              flex: 1,
              minWidth: 130,
              headerClass: "ag-right-aligned-header",
              cellClass: "ag-right-aligned-cell",
              cellStyle: (params) => {
                const isHighRisk = params.data && params.data.BKT && Number(params.data.BKT) > 6;
                return {
                  textAlign: "right",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: isHighRisk ? "var(--destructive, #ef4444) !important" : "var(--drs-text-primary, #0f172a)",
                  fontSize: "12px",
                  fontWeight: isHighRisk ? 600 : 400,
                };
              }
            }),
          ].filter(Boolean);

          gridColumns.push({
            colId: "drs_actions",
            field: "drs_actions",
            headerName: intl.formatMessage({
              id: "label.listview.actions",
              defaultMessage: "Actions",
            }),
            sortable: false,
            filter: false,
            resizable: true,
            headerClass: "ag-center-aligned-header",
            suppressMenu: true,
            suppressAutoSize: true,
            cellClass: "drs-actions-col-wrap",
            width: 96,
            minWidth: 96,
            maxWidth: 96,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
              overflow: "visible",
            },
            cellRenderer: (params) => (
              <AccountListActionsCell
                params={params}
                intl={intl}
                isDark={theme.palette.mode === "dark"}
                onView={() => handleViewAccount(params.data)}
                onFollowUp={() => handleFollowUp(params.data)}
                onCall={() => handleCall(params.data)}
                onSms={() => handleSms(params.data)}
              />
            ),
          });

          setColumnDefs(gridColumns);

          // Then fetch initial data
          const dataBody = {
            listId: "ACLST",
            userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
            moduleName: "COL",
            viewCode: "ACLST_DEF",
            viewName: "Default View",
            filterJson: [],
            sortJson: [],
            pageNumber: 1,
            pageSize: ACCOUNTLIST_BACKEND_PAGE_SIZE,
          };

          const totalFromCountApi = await fetchTotalCount(dataBody);

          const dataResponse = await HAxiosService.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: dataBody });

          if (dataResponse?.data?.status === "SUCCESS") {
            const rows = dataResponse.data.responseJson ?? [];
            const total = totalFromCountApi || dataResponse.data.totalCount || rows.length;
            setAllRows(rows);
            setTotalRecords(total);
            setGridCacheBlockSize(resolveDynamicBlockSize(total, pageSize));
          } else {
            setAllRows([]);
            setTotalRecords(0);
            setGridCacheBlockSize(resolveDynamicBlockSize(0, pageSize));
            //setError('Failed to fetch data');
          }
        } else {
          setError('Failed to fetch column metadata');
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    language,
    intl,
    getAlignmentForColumn,
    getValueFormatterForColumn,
    isMobile,
    handleViewAccount,
    handleFollowUp,
    handleCall,
    handleSms,
    theme.palette.mode,
    fetchTotalCount,
    resolveDynamicBlockSize,
  ]);

  // Load more data function for infinite scroll
  const loadMoreData = useCallback(async (startRow, endRow) => {
    try {
      const backendPageSize = ACCOUNTLIST_BACKEND_PAGE_SIZE;
      const pageNumber = Math.floor(startRow / backendPageSize) + 1;

      const requestBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: "ACLST_DEF",
        viewName: "Default View",
        filterJson: [],
        sortJson: [],
        pageNumber,
        pageSize: backendPageSize,
      };

      const response = await HAxiosService.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: requestBody });

      if (response?.data?.status === "SUCCESS") {
        const newRows = response.data.responseJson ?? [];
        const latestTotal = response.data.totalCount || totalRecords;

        setAllRows(prevRows => {
          const updatedRows = [...prevRows];
          newRows.forEach((row, index) => {
            updatedRows[startRow + index] = row;
          });
          return updatedRows;
        });

        if (latestTotal && latestTotal !== totalRecords) {
          setTotalRecords(latestTotal);
          setGridCacheBlockSize(resolveDynamicBlockSize(latestTotal, pageSize));
        }

        return { success: true, rows: newRows, total: latestTotal || totalRecords };
      }else {
            return { success: true, rows: [], total: 0 };
      }
      
    } catch (error) {
      console.error("Failed to load more data", error);
      return { success: false };
    }
  }, [totalRecords, resolveDynamicBlockSize]);

  useEffect(() => {
    setGridCacheBlockSize(resolveDynamicBlockSize(totalRecords, pageSize));
  }, [pageSize, totalRecords, resolveDynamicBlockSize]);

  // Create datasource for infinite scrolling
  const datasource = useMemo(() => ({
    getRows: async (params) => {
      const { startRow, endRow } = params;
      console.log('Datasource getRows:', { startRow, endRow });

      // Search/filter results are bound via rowData; never refetch unfiltered pages here.
      if (isSearchAppliedRef.current) {
        const rowsSnapshot = allRowsRef.current;
        params.successCallback(
          rowsSnapshot.slice(startRow, endRow),
          totalRecordsRef.current
        );
        return;
      }

      const rowsSnapshot = allRowsRef.current;
      const totalSnapshot = totalRecordsRef.current;
      const requestedSize = Math.max(0, endRow - startRow);

      // Serve from cache only when the whole requested segment is present.
      // IMPORTANT: sparse arrays skip holes in .every(), so validate index-by-index.
      const hasFullSegment = (() => {
        if (!Array.isArray(rowsSnapshot) || rowsSnapshot.length < endRow) return false;
        for (let i = startRow; i < endRow; i += 1) {
          if (!(i in rowsSnapshot)) return false;
          const row = rowsSnapshot[i];
          if (row === undefined || row === null) return false;
        }
        return true;
      })();

      if (hasFullSegment) {
        const existingRows = rowsSnapshot.slice(startRow, endRow);
        if (existingRows.length !== requestedSize) {
          const result = await loadMoreData(startRow, endRow);
          if (result.success) {
            params.successCallback(result.rows, result.total);
          } else {
            params.failCallback();
          }
          return;
        }
        console.log('Returning existing rows:', existingRows.length);
        params.successCallback(existingRows, totalSnapshot);
        return;
      }

      // Load more data
      console.log('Loading more data...');
      const result = await loadMoreData(startRow, endRow);
      if (result.success) {
        params.successCallback(result.rows, result.total);
      } else {
        params.failCallback();
      }
    }
  }), [loadMoreData]);

  // The infinite model owns unsearched rows.  Keep this value stable while its
  // cache is being filled so a newly loaded block does not reset that cache.
  const gridRowData = isSearchApplied ? displayRows : null;

  useEffect(() => {
    const api = gridApiRef.current;
    if (!api) return;

    api.paginationSetPageSize?.(pageSize);
    if (isSearchApplied) {
      api.setGridOption?.("datasource", null);
      api.setGridOption?.("rowData", gridRowData);
    } else {
      api.setGridOption?.("rowData", null);
      api.setGridOption?.("datasource", datasource);
      api.purgeInfiniteCache?.();
    }
    api.paginationGoToFirstPage?.();
  }, [pageSize, datasource, isSearchApplied, gridRowData]);

  const handleBulkSelectionChange = useCallback((rows) => {
    setBulkSelectedRows(Array.isArray(rows) ? rows : []);
  }, []);

  const handleGridApiReady = useCallback((api) => {
    gridApiRef.current = api;
  }, []);

  const clearBulkSelection = useCallback(() => {
    gridApiRef.current?.deselectAll?.();
    setBulkSelectedRows([]);
  }, []);

  // ========== OPTIMIZED: Single handleBulkNavigate with unified state ==========
  const handleBulkNavigate = useCallback(
    (path, actionKey) => {
      const plainAccounts = bulkSelectedRows.map(extractPlainRowData);
      
      // For followup, tag, and memo - open the group popup with unified state
      if (actionKey === "followup" || actionKey === "tag" || actionKey === "memo") {
        setGroupPopupState({
          open: true,
          type: actionKey,
          selectedAccounts: plainAccounts
        });
        return;
      }
      
      // For other bulk actions, navigate directly
      navigate(path, {
        state: { selectedAccounts: plainAccounts },
      });
    },
    [navigate, bulkSelectedRows],
  );
  // ========== END OPTIMIZED ==========

  // ========== OPTIMIZED: Single close handler for all group popups ==========
  const handleCloseGroupPopup = useCallback(() => {
    setGroupPopupState({
      open: false,
      type: null,
      selectedAccounts: []
    });
  }, []);
  // ========== END OPTIMIZED ==========

  // ========== OPTIMIZED: Single success handler for all group popups ==========
  const handleGroupSuccess = useCallback((processedAccounts) => {
    console.log(`Group ${groupPopupState.type} completed for`, processedAccounts?.length, 'accounts');
    handleCloseGroupPopup();
    // Clear bulk selection
    if (gridApiRef.current) {
      gridApiRef.current.deselectAll();
    }
    setBulkSelectedRows([]);
  }, [groupPopupState.type, handleCloseGroupPopup]);
  // ========== END OPTIMIZED ==========

  useEffect(() => {
    gridApiRef.current?.deselectAll?.();
    setBulkSelectedRows([]);
    // Reset group popup state when search/filters change
    setGroupPopupState({
      open: false,
      type: null,
      selectedAccounts: []
    });
  }, [searchTerm, searchField, advancedFilters, advancedRules]);

  const gridConfig = useMemo(
    () => ({
      ...(isSearchApplied
        ? { rowData: gridRowData, datasource: null }
        : { rowData: null, datasource }),
      columnDefs,
      onClickMapping: { ACT_NO: handleAccountClick },
      paginationPageSize: pageSize,
      cacheBlockSize: gridCacheBlockSize,
      fixColumns: isMobile ? 2 : 5,
      gridStyle: listGridOuterStyle,
      iconConfig: ICON_CONFIG(colors),
      shellColors: colors,
      enableBulkRowSelection: true,
      enableRowExpandDetail: true,
      onBulkSelectionChange: handleBulkSelectionChange,
      onGridApiReady: handleGridApiReady,
      useAccountsTableChrome: true,
      listLabel: intl.formatMessage({ id: "label.accounts.list.short", defaultMessage: "Accounts" }),
    }),
    [isSearchApplied, gridRowData, datasource, columnDefs, pageSize, gridCacheBlockSize, isMobile, handleAccountClick, colors, handleBulkSelectionChange, handleGridApiReady, intl]
  );

  // Add a refresh effect when filteredRows changes
  useEffect(() => {
    console.log('Filtered rows updated:', filteredRows.length);
    // This will trigger the grid to update via the rowData prop
  }, [filteredRows]);

  console.log('Grid config:', {
    useDatasource: !searchTerm,
    rowDataLength: searchTerm ? filteredRows.length : 'N/A',
    columnDefsLength: columnDefs.length
  });

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading data: {error}
        </Alert>
      </Box>
    );
  }

  return (
      <HBox
        className="drs-page-container"
        sx={{
          backgroundColor: "var(--drs-bg-default, #ffffff)",
          minHeight: 0,
          flex: "1 1 auto",
          height: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          py: 0.5,
          position: "relative",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            px: isMobile ? 0.75 : 1,
            position: "relative",
            flex: 1,
            height: "100%",
            minHeight: 0,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
            <HBox sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "100%" }}>
              <HPaper
                elevation={0}
                sx={{
                  borderRadius: 0,
                  backgroundColor: "var(--drs-bg-panel, #f8fafc)",
                  border: "none",
                  overflow: "visible",
                  height: "100%",
                  flex: 1,
                  minHeight: 0,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    mx: 0,
                    mt: 1,
                    borderRadius: "10px",
                    border: `1px solid var(--drs-border-divider, ${colors.border})`,
                    backgroundColor: "var(--drs-bg-paper, #ffffff)",
                    overflow: "hidden",
                    boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <Box
                    sx={{
                      ...panelThemeVars,
                      px: 2,
                      py: 1.1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1.5,
                      backgroundColor:isDarkMode ?"var(--drs-bg-panel, #f8fafc)" : "#ffffff",
                      minHeight: 48,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", justifyContent: "start", width: "100%" }}>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center", minWidth: 0 }}>
                        <HDropdown
                          name="searchField"
                          value={searchField}
                          onChange={(event) => setSearchField(event.target.value || "account_no")}
                          options={searchFieldOptions}
                          placeholder="All Fields"
                          disabled={isLoading}
                          width={isMobile ? "100%" : "160px"}
                          sx={{ "&& .MuiInputBase-root": { height: "36px !important"}, "& .MuiSelect-select": { py: "8px !important" } }}
                        />
                      </Box>
                      <Box sx={{ height: 36,width:300, display: "flex", alignItems: "center", flex: "0 1 auto" }}>
                          <HTextField
                          className="drs-themed-textfield drs-themed-searchfield"
                          placeholder="Search accounts..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          editable
                          disabled={isLoading}
                          startAdornment={<MdSearch size={16} color={colors.text.light} />}
                          width={isMobile ? "100%" : "520px"}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 36,
                              fontSize: 12,
                              borderRadius: "10px",
                              backgroundColor: "var(--drs-bg-default, #ffffff)",
                              color: "var(--drs-text-primary, #0f172a)",
                            },
                            "& .MuiInputBase-input": {
                              py: 0.5,
                              "&::placeholder": {
                                color: "var(--drs-text-secondary, #64748b)",
                                opacity: 0.8,
                              },
                            },
                          }}
                          InputProps={{
                            endAdornment: searchTerm ? (
                              <IconButton onClick={clearSearch} size="small">
                                <MdClear size={16} />
                              </IconButton>
                            ) : undefined,
                          }}
                        />
                      </Box>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center" }}>
                        <HButton
                          label="Search"
                          variant="contained"
                          size="small"
                          onClick={() => handleSearchAccounts()}
                          disabled={isLoading}
                          startIcon={<MdSearch size={20} />}
                          sx={{ height: 36,width: "100%", borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }}
                        />
                      </Box>
                      <Divider orientation="vertical" flexItem sx={{ my: 0, mx: 0.5, height: 36, alignSelf: "center" }} />
                      <Box sx={{ height: 36, display: "flex", alignItems: "center" }}>
                        <HButton
                          label={`Advanced Search${getAdvancedFilterCount(advancedFilters, advancedRules) > 0
                            ? ` (${getAdvancedFilterCount(advancedFilters, advancedRules)})`
                            : ""}`}
                          variant={isAdvancedSearchOpen ? "contained" : "outlined"}
                          size="small"
                          onClick={() => {
                            setIsAdvancedSearchOpen((prev) => !prev);
                            setIsAdvancedSortOpen(false);
                          }}
                          startIcon={<FiSliders size={14} />}
                          endIcon={<FiChevronDown size={14} />}
                          sx={{ height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }}
                        />
                      </Box>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center" }}>
                        <HButton
                          label="Sort"
                          variant={isAdvancedSortOpen ? "contained" : "outlined"}
                          size="small"
                          onClick={() => {
                            setIsAdvancedSortOpen((prev) => !prev);
                            setIsAdvancedSearchOpen(false);
                          }}
                          startIcon={<FiSliders size={14} />}
                          endIcon={<FiChevronDown size={14} />}
                          sx={{ height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }}
                        />
                      </Box>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center" }}>
                        <HButton
                          label="Reset"
                          variant="outlined"
                          size="small"
                          onClick={resetAllFilters}
                          disabled={!searchCriteriaCount && !isSearchApplied}
                          sx={{ height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }}
                        />
                      </Box>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center" }}>
                        <HButton
                          label="Export"
                          variant="outlined"
                          size="small"
                          onClick={() => { }}
                          startIcon={<FiDownload size={14} />}
                          sx={{ height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }}
                        />
                      </Box>
                      <Box sx={{ height: 36, display: "flex", alignItems: "center", minWidth: 0 }}>
                        <HDropdown
                          name="savedFilter"
                          value={selectedSavedFilterId}
                          onChange={handleSavedFilterChange}
                          options={savedFilterOptions}
                          placeholder="Saved filters"
                          disabled={isLoading || savedFilterOptions.length === 0}
                          width={isMobile ? "100%" : "150px"}
                          sx={{ "&& .MuiInputBase-root": { height: "36px !important"}, "& .MuiSelect-select": { py: "8px !important" } }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 1.5,
                        py: 0.4,
                        borderTop: `1px solid var(--drs-border-divider, ${colors.border})`,
                      }}
                    >
                      <CircularProgress size={14} sx={{ mr: 1, color: colors.primary }} />
                      <HLabel
                        value="Loading data..."
                        translate={false}
                        align="left"
                        colon={false}
                        sx={{
                          color: "var(--drs-text-secondary, hsl(215, 14%, 46%))",
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: 11,
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    maxWidth: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    overflow: "auto",
                    bgcolor: "inherit",
                    height: "100%",
                    pt: 1,
                    boxSizing: "border-box",
                    }}
                  >
                    {isAdvancedSearchOpen && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: "10px",
                        border: `1px solid var(--drs-border-divider, ${colors.border})`,
                        backgroundColor: "var(--drs-bg-paper, #ffffff)",
                        boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)",
                      }}
                    >
                      <AdvancedSearchPanel
                        colors={colors}
                        isMobile={isMobile}
                        panelThemeVars={panelThemeVars}
                        advancedFilters={advancedFilters}
                        onAdvancedFilterChange={handleAdvancedFilterChange}
                        rules={advancedRules}
                        onRuleChange={handleRuleChange}
                        onAddRule={handleAddRule}
                        onRemoveRule={handleRemoveRule}
                        onReset={handleClearAdvancedSearch}
                        onClear={handleClearAdvancedSearchAndSort}
                        onClose={() => setIsAdvancedSearchOpen(false)}
                        onSearch={handleSearchAccounts}
                        searchCriteriaCount={searchCriteriaCount}
                        isLoading={isLoading}
                        savedFilters={savedFilters}
                        attributes={entityAttributes}
                        toast={toast}
                        onDeleteSavedFilter={handleDeleteSavedFilter}
                        entityAttributes={entityAttributes}
                        onApplySavedFilter={applySavedFilter}
                        sortRules={advancedSortRules}
                        onSortRuleChange={handleAdvancedSortRuleChange}
                        onAddSortRule={handleAddAdvancedSortRule}
                        onRemoveSortRule={handleRemoveAdvancedSortRule}
                      />
                    </Box>
                  )}

                  {isAdvancedSortOpen && (
                    <Box
                      sx={{
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: "10px",
                        border: `1px solid var(--drs-border-divider, ${colors.border})`,
                        backgroundColor: "var(--drs-bg-paper, #ffffff)",
                        boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)",
                      }}
                    >
                      <SortPanel
                        colors={colors}
                        isMobile={isMobile}
                        panelThemeVars={panelThemeVars}
                        sortRules={sortRules}
                        onSortRuleChange={handleSortRuleChange}
                        onAddSortRule={handleAddSortRule}
                        onRemoveSortRule={handleRemoveSortRule}
                        onClose={() => setIsAdvancedSortOpen(false)}
                        onApplySort={handleApplySort}
                        onClear={handleClearSort}
                        isLoading={isLoading}
                        savedSorts={savedSorts}
                        attributes={entityAttributes}
                        toast={toast}
                        onDeleteSavedSort={handleDeleteSavedSort}
                        entityAttributes={entityAttributes}
                        onReplaceSortRules={handleReplaceSortRules}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      flex: isAnyPanelOpen ? "0 0 auto" : 1,
                      minHeight: isAnyPanelOpen ? (isMobile ? 520 : 620) : 0,
                      maxWidth: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      backgroundColor: "var(--drs-bg-paper, #ffffff)",
                      borderRadius: "10px",
                      border: `1px solid var(--drs-border-divider, ${colors.border})`,
                      boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    <Box
                      sx={{
                        flexShrink: 0,
                        px: 1.5,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1,
                        borderBottom: `1px solid var(--drs-border-divider, ${colors.border})`,
                        backgroundColor: isDarkMode ?"var(--drs-bg-panel, #f8fafc)" : "#ffffff",
                      }}
                    >
                      <HLabel
                        value={`${totalRecords || displayRows.length} ${intl.formatMessage({ id: "label.accounts.short", defaultMessage: "accounts" })}`}
                        translate={false}
                        align="left"
                        colon={false}
                        sx={{
                          fontWeight: 600,
                          fontFamily: "'Inter', system-ui, sans-serif",
                          fontSize: 12,
                          color: "var(--drs-text-primary, hsl(220, 20%, 10%))",
                          whiteSpace: "nowrap",
                        }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HLabel
                          value="Rows:"
                          translate={false}
                          align="left"
                          colon={false}
                          sx={{
                            fontSize: 12,
                            color: "var(--drs-text-secondary, hsl(215, 14%, 46%))",
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}
                        />
                        <HDropdown
                          name="pageSize"
                          value={pageSize}
                          onChange={(event) => setPageSize(Number(event.target.value) || 15)}
                          options={pageSizeOptions}
                          placeholder="Rows"
                          width="86px"
                        />
                      </Box>
                    </Box>

                    {isLoading && allRows.length === 0 ? (
                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        minHeight: 200,
                        background: "inherit",
                        gap: 1.25
                      }}>
                        <CircularProgress size={24} sx={{ color: colors.primary }} />
                        <HLabel
                          value={intl.formatMessage({ id: "label.loading", defaultMessage: "Loading accounts..." })}
                          translate={false}
                          align="left"
                          colon={false}
                          sx={{
                            color: colors.text.secondary,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    ) : columnDefs.length > 0 ? (
                      <Box
                        sx={{
                          flex: 1,
                          minHeight: isAnyPanelOpen ? (isMobile ? 520 : 620) : 0,
                          maxWidth: "100%",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "inherit",
                          height: "100%",
                        }}
                      >
                      <ListGridFramework key={gridModeKey} {...gridConfig} />
                      {bulkSelectedRows.length > 0 && (
                        <Box
                          sx={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                            px: 2,
                            py: 1,
                            bgcolor: colors.primary,
                            color: "#fff",
                            borderTop: `1px solid ${colors.primaryDark}`,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
                            <HLabel
                              value={`${bulkSelectedRows.length} ${bulkSelectedRows.length === 1 ? "account" : "accounts"} selected`}
                              translate={false}
                              align="left"
                              colon={false}
                              sx={{ fontSize: 13, fontWeight: 600, color: "#fff" }}
                            />
                            <Box
                              sx={{
                                width: "1px",
                                height: 20,
                                bgcolor: "rgba(255,255,255,0.25)",
                                display: { xs: "none", sm: "block" },
                              }}
                            />
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {BULK_ACTIONS.map(({ key, label, icon: Icon, path }) => (
                                <Button
                                  key={key}
                                  size="small"
                                  onClick={() => handleBulkNavigate(path, key)}
                                  startIcon={<Icon size={13} />}
                                  sx={{
                                    color: "#fff",
                                    textTransform: "none",
                                    fontSize: 11,
                                    fontWeight: 500,
                                    minHeight: 28,
                                    px: 1,
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                                  }}
                                >
                                  {label}
                                </Button>
                              ))}
                            </Stack>
                          </Stack>
                          <Button
                            size="small"
                            onClick={clearBulkSelection}
                            startIcon={<FiX size={14} />}
                            sx={{
                              color: "#fff",
                              textTransform: "none",
                              fontSize: 11,
                              minHeight: 28,
                              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                            }}
                          >
                            Clear
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "300px",
                      background: colors.cardBg,
                    }}>
                      <HLabel
                        value="No columns defined"
                        translate={false}
                        align="left"
                        colon={false}
                        sx={{
                          color: colors.text.secondary,
                          fontFamily: "'Inter', sans-serif",
                          fontSize: isMobile ? "15px" : "16px",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  )}
                  </Box>
                </Box>
              </HPaper>
            </HBox>
          <HDialog open={dashboardOpen} onClose={() => setDashboardOpen(false)} maxWidth="xl" fullWidth disableContentWrapper>
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: colors.appBarGradient,
                color: "#fff",
                px: 3,
                py: 1.5,
              }}
              
            >
              Collector Performance Dashboard
              <IconButton onClick={() => setDashboardOpen(false)} sx={{ color: "#fff" }} aria-label="Close">
                <MdClose />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <CollectorDashboardRecharts isMobile={isMobile} />
            </DialogContent>
          </HDialog>

          {/* ========== OPTIMIZED: Single group popup rendering based on type ========== */}
          {/* Group Followup Popup */}
          <GroupFollowupPopup
            open={groupPopupState.open && groupPopupState.type === "followup"}
            onClose={handleCloseGroupPopup}
            selectedAccounts={groupPopupState.selectedAccounts}
            gridApiRef={gridApiRef}
            onSuccess={handleGroupSuccess}
          />

          {/* Group Tag Popup */}
          <GroupTagPopup
            open={groupPopupState.open && groupPopupState.type === "tag"}
            onClose={handleCloseGroupPopup}
            selectedAccounts={groupPopupState.selectedAccounts}
            gridApiRef={gridApiRef}
            onSuccess={handleGroupSuccess}
          />

          {/* Group Memo Popup */}
          <GroupMemosPopup
            open={groupPopupState.open && groupPopupState.type === "memo"}
            onClose={handleCloseGroupPopup}
            selectedAccounts={groupPopupState.selectedAccounts}
            gridApiRef={gridApiRef}
            onSuccess={handleGroupSuccess}
          />
          {/* ========== END OPTIMIZED ========== */}
        </Container>
      </HBox>
  );
};

AccountList.propTypes = {
  language: PropTypes.string,
};

export default React.memo(AccountList);
