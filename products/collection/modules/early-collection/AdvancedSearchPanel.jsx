import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { IconButton, Divider, Stack, Tooltip, MenuItem, Button, ButtonGroup } from "@mui/material";
import { ALIGNMENT, HBox, HButton, HCheckBox, HDropdown, HLabel, HTextField, SearchCommonBox, HAxiosService } from "@helix/component-library";
import { FiX, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CloseIcon from "@mui/icons-material/Close";
import { withAlpha } from "../../../../apps/debt-recovery-shell/src/colors";

import { ColListingAPI, SearchAPI } from "./apiEndpoints";
import { CollectorMasterAPI } from "../common-master/apiEndpoints";
import { buildSortPayload } from "./SortPanel.jsx";
import { useLocation } from "react-router-dom";
import { userSearchGridDef } from "../../../common/components/SearchGridDefObj.js";


const DEFAULT_ADVANCED_FILTERS = {
  portfolio: "",
  bucket: "",
  status: "",
};

const DEFAULT_ADVANCED_RULE = {
  id: "1",
  connector: "AND",
  field: "",
  operator: "=",
  value: "",
};
const getSavedFilterId = (filter) => filter?.listViewCode || filter?.viewCode || filter?.listViewName || filter?.viewName || "";
const getSavedFilterName = (filter) => filter?.listViewName || filter?.viewName || getSavedFilterId(filter);
export const buildFilterPayload = ({ filterName, advancedFilters = {}, rules = [], entityAttributes = [] }) => {
  const payload = [];

  const getFilterOperator = (operator) => {
    switch (operator) {
      case "LIKE":
        return "LIKE";
      case "is":
        return "EQUALS";
      case "is_not":
        return "NOT_EQUALS";
      case "gt":
        return "GREATER_THAN";
      case "lt":
        return "LESS_THAN";
      default:
        return operator || "=";
    }
  };
  const getUIOperator = (operator) => {
    switch (operator) {
      case "EQUALS":
        return "is";
      case "NOT_EQUALS":
        return "is_not";
      case "GREATER_THAN":
        return "gt";
      case "LESS_THAN":
        return "lt";
      case "LIKE":
        return "LIKE";
      default:
        return operator;
    }
  };

  const addEntry = (key, value, opt = "=", meta = null, condition = null) => {
    const normalizedValue = String(value ?? "").trim();
    if (!key || !normalizedValue) return;

    if (meta?.controlType === "Checkbox" && normalizedValue !== "Y") {
      return;
    }

    const normalizedCondition = String(condition ?? "").trim().toUpperCase();
    const isValidCondition = normalizedCondition === "AND" || normalizedCondition === "OR";

    payload.push({
      key,
      opt,
      value: normalizedValue,
      ...(isValidCondition ? { condition: normalizedCondition } : {}),
    });
  };

  const attributeKeySet = new Set(
    (Array.isArray(entityAttributes) ? entityAttributes : [])
      .map((attr) => String(attr?.szAttributeCode || "").trim())
      .filter(Boolean)
  );

  const attributeMetaMap = new Map(
    (Array.isArray(entityAttributes) ? entityAttributes : []).map((attr) => [
      String(attr?.szAttributeCode || "").trim(),
      { controlType: String(attr?.szControlType || "").trim() || null },
    ])
  );

  Object.entries(advancedFilters || {}).forEach(([key, value]) => {
    const apiKey = attributeKeySet.has(String(key).trim()) ? String(key).trim() : String(key).trim();
    const operator = "=";
    addEntry(apiKey, value, operator, attributeMetaMap.get(apiKey));
  });

  rules.forEach((rule) => {
    const key = String(rule?.field ?? "").trim();
    const value = String(rule?.value ?? "").trim();
    if (!key || !value) return;
    addEntry(key, value, getFilterOperator(rule?.operator), null, rule?.connector || "AND");
  });

  return {
    filterName: String(filterName ?? "").trim(),
    filters: payload.filter((entry) => entry?.key && entry?.value !== undefined),
  };
};

const AdvancedSearchPanel = ({
  colors,
  isMobile,
  panelThemeVars,
  advancedFilters,
  onAdvancedFilterChange,
  rules,
  onRuleChange,
  onAddRule,
  onRemoveRule,
  onReset,
  onClear,
  onClose,
  onSaveFilter = () => { },
  onSearch = () => { },
  sortRules = [],
  onSortRuleChange = () => { },
  onAddSortRule = () => { },
  onRemoveSortRule = () => { },
  searchCriteriaCount = false,
  isLoading = false,
  savedFilters = [],
  attributes = [],
  toast = null,
  onDeleteSavedFilter = () => { },
  entityAttributes = [],
  onApplySavedFilter = null,
}) => {
  const [filterName, setFilterName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedSavedFilterId, setSelectedSavedFilterId] = useState("");
  const [localAddedFilters, setLocalAddedFilters] = useState([]);
  const location = useLocation();
  const screenMenuId = location.state?.menuId;

  const hasFilterName = Boolean(String(filterName ?? "").trim());

  // Build dynamic filters from entityAttributes where szType contains 'Q'
  const dynamicFilters = useMemo(() => {
    if (!Array.isArray(entityAttributes)) return {};

    const filters = {};
    entityAttributes.forEach((attr) => {
      // Check if szType contains 'Q' (quick filter indicator)
      if (attr?.szType?.includes("Q")) {
        const code = attr?.szAttributeCode || "";
        const desc = attr?.szAttributeDesc || "";
        const controlType = String(attr?.szControlType || "").trim();
        const searchCode = String(attr?.szSearchCode || "").trim();

        if (!filters[code]) {
          filters[code] = {
            code,
            desc,
            controlType,
            searchCode,
            values: [], // Will be populated if it's a dropdown type
          };
        }
      }
    });

    return filters;
  }, [entityAttributes]);

  // Parse and apply saved filter
  const handleLoadSavedFilter = useCallback((filterData) => {
    if (!filterData) return;

    try {
      // Parse the filterJson string (may be double-stringified)
      let filters = filterData.filterJson;
      if (typeof filters === "string") {
        filters = JSON.parse(filters);
      }

      // Handle the structure where filterJson wraps an array
      const filterArray = filters.filterJson || filters;

      if (!Array.isArray(filterArray)) return;

      const dynamicFilterCodes = new Set(
        (Array.isArray(entityAttributes) ? entityAttributes : [])
          .filter((attr) => String(attr?.szType || "").includes("A"))
          .map((attr) => String(attr?.szAttributeCode || "").trim())
          .filter(Boolean)
      );
      const newFilters = { ...DEFAULT_ADVANCED_FILTERS };
      const newRules = [];
      let ruleIndex = 0;

      filterArray.forEach((filter) => {
        const { key, opt, value, condition, connector } = filter || {};
        const normalizedKey = String(key ?? "").trim();
        const resolvedKey = (Array.isArray(entityAttributes) ? entityAttributes : []).find((attr) =>
          String(attr?.szAttributeCode || "").trim().toLowerCase() === normalizedKey.toLowerCase() ||
          String(attr?.szAttributeDesc || "").trim().toLowerCase() === normalizedKey.toLowerCase()
        )?.szAttributeCode || normalizedKey;

        const normalizedOpt = String(opt ?? "").trim().toUpperCase();
        const isNormalFilterOperator =
          !opt ||
          ["=", "EQUALS"].includes(normalizedOpt) ||
          normalizedOpt === "=";

        if (isNormalFilterOperator) {
          newFilters[resolvedKey] = value;
          return;
        }
        newRules.push({
          id:
            ruleIndex === 0
              ? DEFAULT_ADVANCED_RULE.id
              : `${Date.now()}-${ruleIndex}`,
          connector: ["AND", "OR"].includes(String(condition || connector || "").toUpperCase())
            ? String(condition || connector).toUpperCase()
            : "AND",
          field: resolvedKey.toUpperCase(),
          operator: getUIOperator(opt),
          value,
        });

        ruleIndex++;
      });
      // Apply the parsed filters
      Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
        onAdvancedFilterChange(filterKey, filterValue);
      });

      // Remove default rule callback first if we have custom rules to load
      if (newRules.length > 0) {
        // Add new rules one by one
        newRules.forEach((rule, idx) => {
          if (idx === 0) {
            // Update the first (default) rule
            onRuleChange(rule.id, "field", rule.field);
            onRuleChange(rule.id, "operator", rule.operator);
            onRuleChange(rule.id, "value", rule.value);
          } else {
            // Add additional rules
            onAddRule();
          }
        });
      } else {
        // No custom rules - reset to default empty rule
        if (rules.length > 0 && rules[0]) {
          onRuleChange(rules[0].id, "field", "");
          onRuleChange(rules[0].id, "operator", "=");
          onRuleChange(rules[0].id, "value", "");
        }
      }
    } catch (error) {
      console.error("Failed to parse saved filter:", error);
    }
  }, [onAdvancedFilterChange, onAddRule, onRuleChange, rules, entityAttributes]);

  useEffect(() => {
    let isMounted = true;

    HAxiosService.GET(CollectorMasterAPI.fetchUsers())
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res?.data?.responseJson)
          ? res.data.responseJson
          : (Array.isArray(res?.data?.data) ? res.data.data : []);
        if (!data.length) {
          setUserOptions([]);
          return;
        }
        setUserOptions(
          data.map((item) => {
            const collector = item?.collectorMasterDto || item || {};
            return {
              value: collector?.szCollectorCode || "",
              label: collector?.szCollectorName || "",
              szCollectorCode: collector?.szCollectorCode || "",
              szCollectorName: collector?.szCollectorName || "",
            };
          }).filter((item) => item.value),
        );
      })
      .catch(() => {
        if (isMounted) {
          setUserOptions([]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveFilter = async () => {
    const trimmedName = String(filterName ?? "").trim();
    if (!trimmedName) return;
    const payload = buildFilterPayload({ filterName: trimmedName, advancedFilters, rules, entityAttributes });
    const sortPayload = buildSortPayload({ sortName: trimmedName, sortRules });
    const viewCode = trimmedName
      .toUpperCase()
      .trim()
      .replace(/\s+/g, "_");

    const dataBody = {
      listId: "ACLST",
      userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      moduleName: "COL",
      viewCode: "ACLST_DEF",
      viewName: trimmedName,
      filterJson: payload?.filters || [],
      sortJson: sortPayload?.sorts || [],
      pageNumber: 1,
      pageSize: 100,
    };

    try {
      const response = await HAxiosService.POST(ColListingAPI.ListView(screenMenuId), dataBody);

      // Create new filter object and add to local list
      const newFilter = {
        listViewCode: viewCode,
        viewCode: viewCode,
        viewName: trimmedName,
        listViewName: trimmedName,
        filterJson: payload?.filters || [],
        sortJson: sortPayload?.sorts || [],
      };

      setLocalAddedFilters((prev) => [...prev, newFilter]);
      setSelectedSavedFilterId(viewCode);
      setFilterName(""); // Clear filter name after save

      toast.success("Filter saved successfully");
    } catch (error) {
      console.error("Failed to save list view:", error);
      toast.error("Failed to save filter");
    }
  };

  const handleDeleteFilter = async () => {
    if (!selectedSavedFilterId) return;

    try {
      const selectedFilter = savedFilters.find((f) => getSavedFilterId(f) === selectedSavedFilterId);
      if (!selectedFilter) return;

      const dataBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: selectedSavedFilterId,
        viewName: "",
        filterJson: [],
        sortJson: [],
        pageNumber: 1,
        pageSize: 100,
      };

      const response = await HAxiosService.DELETE(ColListingAPI.ListView(screenMenuId), dataBody);

      if (response?.data?.status === "SUCCESS") {
        onDeleteSavedFilter(selectedSavedFilterId);
        setSelectedSavedFilterId("");
        toast.success("Filter deleted successfully");
      } else {
        toast.error("Failed to delete filter");
      }
    } catch (error) {
      console.error("Failed to delete filter:", error);
      toast.error("Error deleting filter");
    }
  };

  const handleShareFilter = async () => {
    const selectedFilterId = String(selectedSavedFilterId || "").trim();
    if (!selectedFilterId) {
      toast.error("Please select a saved filter first");
      return;
    }

    const allFilters = [...savedFilters, ...localAddedFilters];
    const selectedFilter = allFilters.find((filter) => getSavedFilterId(filter) === selectedFilterId);
    const listViewCode = selectedFilter?.listViewCode || selectedFilter?.viewCode || selectedFilterId;

    if (!listViewCode) {
      toast.error("Selected filter is missing listViewCode");
      return;
    }

    const sharedUsers = Array.isArray(selectedUsers) ? selectedUsers.filter(Boolean) : [];
    if (!sharedUsers.length) {
      toast.error("Please select at least one user to share with");
      return;
    }

    try {
      const dataBody = {
        listViewCode,
        sharedToUsers: sharedUsers,
        sharedByUser: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      };

      const response = await HAxiosService.POST(ColListingAPI.shareListView(), dataBody);
      const responseStatus = response?.data?.status;
      const responseMessage = response?.data?.message;

      if (responseStatus === "SUCCESS" || response?.data?.statusCode === 200) {
        toast.success(responseMessage || "Filter shared successfully");
      } else if (responseStatus === "PARTIAL_SUCCESS") {
        toast.warning(responseMessage || "View shared with some users, but failed for others");
      } else {
        toast.error(responseMessage || "Failed to share filter");
      }
    } catch (error) {
      console.error("Failed to share filter:", error);
      toast.error("Error sharing filter");
    }
  };

  const operatorOptions = [
    { value: "LIKE", label: "Contains" },
    { value: "is", label: "Is" },
    { value: "is_not", label: "Is Not" },
    { value: "gt", label: "Greater Than" },
    { value: "lt", label: "Less Than" },
  ];

  const sectionTitleStyles = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "var(--drs-text-tertiary, hsl(215, 25%, 27%))",
    fontFamily: "'Inter', sans-serif",
  };

  const sectionBodyStyles = {
    fontSize: 11,
    color: colors.text.secondary,
    fontFamily: "'Inter', sans-serif",
  };

  const advancedRuleFieldOptions = useMemo(
    () => (Array.isArray(attributes) ? attributes : [])
      .filter((attr) => String(attr?.szType || "").includes("A") && String(attr?.szAttributeCode || "").trim())
      .map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes],
  );

  const sortRuleFieldOptions = useMemo(
    () => (Array.isArray(attributes) ? attributes : [])
      .filter((attr) => String(attr?.szType || "").includes("S") && String(attr?.szAttributeCode || "").trim())
      .map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes],
  );

  const sortRuleOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const userSearchFetcher = useCallback(
    async () => ({ data: { responseJson: userOptions } }),
    [userOptions]
  );

  return (
    <HBox
      className="drs-panel-container"
      sx={{
        ...panelThemeVars,
        px: isMobile ? 1.5 : 2,
        py: 2,
        borderBottom: `1px solid var(--drs-border-divider, ${colors.border})`,
        backgroundColor: "var(--drs-bg-panel, #f8fafc)",
        flexShrink: 0,
      }}
    >
      <HBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
        }}
      >
        <HBox sx={{ minWidth: 0, flex: 1 }}>
          <HLabel value="Advanced Search" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
          <HLabel
            value="Narrow the account list with portfolio, bucket, amount ranges, and custom rules."
            translate={false}
            align="left"
            colon={false}
            sx={sectionBodyStyles}
          />
        </HBox>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <HBox
            sx={{
              p: 0.5,
              borderRadius: "10px",
              border: "none",
              backgroundColor: "transparent",
              minWidth: 320,
              maxWidth: 220,
              flexShrink: 0,
            }}
          >
            <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
              <HDropdown
                options={[
                  { label: "Select a saved filter...", value: "" },
                  ...[...savedFilters, ...localAddedFilters].map((filter) => ({
                    label: getSavedFilterName(filter),
                    value: getSavedFilterId(filter),
                  })),
                ]}
                value={selectedSavedFilterId}
                onChange={(event) => {
                  const filterId = event.target.value;
                  setSelectedSavedFilterId(filterId);
                  if (filterId) {
                    const allFilters = [...savedFilters, ...localAddedFilters];
                    const selectedFilter = allFilters.find((f) => getSavedFilterId(f) === filterId);
                    if (selectedFilter) {
                      if (typeof onApplySavedFilter === "function") {
                        onApplySavedFilter(selectedFilter, { runSearch: false });
                      } else {
                        handleLoadSavedFilter(selectedFilter);
                      }
                    }
                  }
                }}
                placeholder="Select a saved filter..."
                width="88%"
              />
              <Tooltip title="Delete selected filter" arrow placement="top">
                <span>
                  <IconButton
                    onClick={handleDeleteFilter}
                    disabled={!selectedSavedFilterId}
                    size="small"
                    sx={{
                      color: colors.accent,
                      "&:hover": {
                        backgroundColor: withAlpha(colors.accent, 0.1),
                      },
                      "&.Mui-disabled": {
                        color: colors.text.light,
                      },
                    }}
                  >
                    <FiTrash2 size={16} />
                  </IconButton>
                </span>
              </Tooltip>
            </HBox>
          </HBox>
          <IconButton onClick={onClose} size="small" sx={{ color: colors.text.light }}>
            <FiX size={16} />
          </IconButton>
        </HBox>
      </HBox>

      <Divider sx={{ borderColor: colors.border, mb: 2 }} />



      <HBox
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
          gap: 1.5,
          "& .MuiInputBase-root": { height: 36, fontSize: 12, borderRadius: "10px" },
          "& .MuiInputLabel-root": { top: -4 },
        }}
      >
        {Object.values(dynamicFilters).map((filter) => (
          <HBox key={filter.code} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <HLabel value={filter.desc} translate={false} align="left" colon={true} />
            <HTextField
              id={filter.code}
              editable
              width="100%"
              value={advancedFilters?.[filter.code] ?? ""}
              onChange={(event) => onAdvancedFilterChange(filter.code, event.target.value)}
              placeholder={`Enter ${filter.desc}`}
            />
          </HBox>
        ))}
      </HBox>
      <Divider sx={{ borderColor: colors.border, my: 2 }} />
      <HBox
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 1.5,
          width: "100%",
          alignItems: "stretch",
          border: isMobile ? "none" : "1px solid var(--drs-border-divider, #e2e8f0)",
          borderRadius: "12px",
          p: isMobile ? 0 : 1,
          backgroundColor: "transparent",
        }}
      >
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, width: isMobile ? "100%" : "50%", borderRight: isMobile ? "none" : "1px solid var(--drs-border-divider, #e2e8f0)", pr: isMobile ? 0 : 1.5 }}>
          <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1, flexWrap: "wrap" }}>
            <HLabel value="DEFINE MORE FILTERS" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
            <HButton
              label="Add Rule"
              variant="outlined"
              size="small"
              inline
              onClick={onAddRule}
              startIcon={<FiPlus size={13} />}
              sx={{ textTransform: "none" }}
            />
          </HBox>

          <Stack spacing={1}>
          {rules.map((rule, index) => (
            <HBox
              key={rule.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "82px minmax(0, 1.05fr) minmax(0, 0.95fr) minmax(0, 1.05fr) 40px",
                gap: 1,
                alignItems: "stretch",
                width: "100%",
              }}
            >
              <HDropdown
                options={[{ label: "AND", value: "AND" }, { label: "OR", value: "OR" }]}
                value={index === 0 ? "AND" : rule.connector}
                onChange={(event) => onRuleChange(rule.id, "connector", event.target.value)}
                placeholder="Connector"
                width="100%"
                disabled={index === 0}
              />
              <HDropdown
                options={[
                  { label: "Select field", value: "" },
                  ...((Array.isArray(attributes) ? attributes : [])
                    .filter((attr) => String(attr?.szType || "").includes("A") && String(attr?.szAttributeCode || "").trim())
                    .map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })))
                ]}
                value={rule.field}
                onChange={(event) => onRuleChange(rule.id, "field", event.target.value)}
                placeholder="Field"
                width="100%"
              />
              <HDropdown
                options={operatorOptions.map((option) => ({ label: option.label, value: option.value }))}
                value={rule.operator}
                onChange={(event) => onRuleChange(rule.id, "operator", event.target.value)}
                placeholder="Operator"
                width="100%"
              />
              <HTextField
                editable
                width="100%"
                value={rule.value}
                onChange={(event) => onRuleChange(rule.id, "value", event.target.value)}
                placeholder="Value"
              />
              <IconButton
                onClick={() => onRemoveRule(rule.id)}
                disabled={rules.length === 1}
                size="small"
                sx={{ color: colors.text.light }}
              >
                <FiTrash2 size={15} />
              </IconButton>
            </HBox>
          ))}
          </Stack>
        </HBox>

        <HBox sx={{ display: "flex", flexDirection: "column", gap: 1, width: isMobile ? "100%" : "50%" }}>
          <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1, flexWrap: "wrap" }}>
            <HLabel value="SORT FILTERS" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
            <HButton
              label="Add Sort Rule"
              variant="outlined"
              size="small"
              inline
              onClick={onAddSortRule}
              startIcon={<FiPlus size={13} />}
              sx={{ textTransform: "none" }}
            />
          </HBox>

          <Stack spacing={1} sx={{ width: "100%" }}>
          {sortRules.map((rule, index) => (
            <HBox
              key={rule.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 36px",
                gap: 0.5,
                alignItems: "center",
                width: "100%",
              }}
            >
              <HDropdown
                options={[{ label: "Select field", value: "" }, ...sortRuleFieldOptions]}
                value={rule.field}
                onChange={(event) => onSortRuleChange(rule.id, "field", event.target.value)}
                placeholder="Field"
                width="100%"
              />
              <ButtonGroup size="small" sx={{ display: "flex", gap: 0, minWidth: 0 }}>
                {sortRuleOptions.map((option) => (
                  <HButton
                    key={option.value}
                    label={option.label}
                    variant={rule.order === option.value ? "contained" : "outlined"}
                    size="small"
                    inline
                    onClick={() => onSortRuleChange(rule.id, "order", option.value)}
                    sx={{
                      textTransform: "none",
                      fontSize: 11,
                      minWidth: 0,
                      flex: 1,
                      borderRadius: option.value === "asc" ? "6px 0 0 6px" : "0 6px 6px 0",
                      backgroundColor: rule.order === option.value ? "var(--drs-accent, #3b82f6)" : "transparent",
                      color: rule.order === option.value ? "white" : "var(--drs-text-primary, #0f172a)",
                      borderColor: "var(--drs-border-default, #e2e8f0)",
                      "&:hover": {
                        backgroundColor: rule.order === option.value ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)",
                      },
                    }}
                  />
                ))}
              </ButtonGroup>
              <IconButton
                onClick={() => onRemoveSortRule(rule.id)}
                disabled={sortRules.length === 1}
                size="small"
                sx={{ color: colors.text.light }}
              >
                <FiTrash2 size={14} />
              </IconButton>
            </HBox>
          ))}
          </Stack>
        </HBox>
      </HBox>

      <Divider sx={{ borderColor: colors.border, my: 1 }} />
      <HBox
        sx={{
          p: 1.25,
          borderRadius: "12px",
          width: "100%",
          maxWidth: 650,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        <HLabel value="Save Filter" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
        <HBox
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 0.75,
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
            {/* Filter Name Section */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
              <HLabel value="Filter Name" translate={false} align="left" colon={true} />

              <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <HTextField
                  editable
                  width="500px"
                  value={filterName}
                  onChange={(event) => setFilterName(event.target.value)}
                  placeholder="Enter Filter Name"
                />

                <HButton
                  label="Save"
                  variant="contained"
                  size="small"
                  inline
                  onClick={handleSaveFilter}
                  disabled={!hasFilterName}
                  startIcon={<SaveIcon />}
                  sx={{
                    minWidth: 90,
                    height: 30,
                    flexShrink: 0,
                  }}
                />
              </HBox>
            </HBox>

            {/* Share to Users Section */}
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 ,mt:-1}}>
              <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 24 }}>
                <HLabel value="Share to Users" translate={false} align="left" colon={true} />
               
              </HBox>

              <HBox sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                <SearchCommonBox
                  searchCode="USER_SEARCH"
                  customFetchFunction={userSearchFetcher}
                  selectedColumn="value"
                  selectedValue={selectedUsers}
                  gridDefObj={userSearchGridDef}
                  setSelectedValue={(values) =>
                    setSelectedUsers(Array.isArray(values) ? values : values ? [values] : [])
                  }
                  gridWidth={360}
                  gridHeight={260}
                  searchBoxWidth="400px"
                  searchBoxHeight="30px"
                  searchBoxFontSize={11}
                  placeholder="Search user"
                  multiSelect={true}
                />

                <HButton
                  label="Share"
                  variant="outlined"
                  size="small"
                  inline
                  onClick={handleShareFilter}
                  disabled={!selectedSavedFilterId || !selectedUsers.length}
                  startIcon={<ShareOutlinedIcon fontSize="inherit" />}
                  sx={{
                    minWidth: 84,
                    height: 32,
                    flexShrink: 0,
                  }}
                />
              </HBox>
            </HBox>
          </HBox>

        </HBox>
      </HBox>
      <Divider sx={{ borderColor: colors.border, my: 1 }} />

      <HBox
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          gap: 1.25,
          mt: 1,
          marginLeft: "auto",
        }}
      >
        <HButton
          label="Search Accounts"
          variant="contained"
          size="small"
          inline
          onClick={() => onSearch({ sortRules })}
          disabled={isLoading}
          startIcon={<SearchIcon />}
          sx={{ height: 36, textTransform: "none" }}
        />
        <HButton
          label="Clear"
          variant="outlined"
          size="small"
          inline
          onClick={onClear || onReset}
          startIcon={<BackspaceIcon />}
          sx={{ height: 36, textTransform: "none", borderColor: colors.border }}
        />

        <HButton
          label="Close"
          variant="outlined"
          color="error"
          size="small"
          inline
          onClick={onClose}
          startIcon={<CloseIcon />}
          sx={{ height: 36, textTransform: "none" }}
        />
      </HBox>
    </HBox>
  );
};

export default React.memo(AdvancedSearchPanel);