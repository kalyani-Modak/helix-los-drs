import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { IconButton, Divider, Stack, Tooltip, ButtonGroup } from "@mui/material";
import { HBox, HButton, HDropdown, HLabel, HTextField, HAxiosService } from "@helix/component-library";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CloseIcon from "@mui/icons-material/Close";
import { withAlpha } from "../../../../apps/debt-recovery-shell/src/colors";

import { ColListingAPI } from "./apiEndpoints";
import { useLocation } from "react-router-dom";
const DEFAULT_SORT_RULE = {
  id: "1",
  field: "",
  order: "asc",
};

const getSavedSortId = (sort) => sort?.listViewCode || sort?.viewCode || sort?.listViewName || sort?.viewName || "";
const getSavedSortName = (sort) => sort?.listViewName || sort?.viewName || getSavedSortId(sort);

export const buildSortPayload = ({ sortName, sortRules = [] }) => {
  const payload = [];

  const addEntry = (key, order = "asc") => {
    const normalizedKey = String(key ?? "").trim();
    if (!normalizedKey) return;
    payload.push({ key, order });
  };

  sortRules.forEach((rule) => {
    const field = String(rule?.field ?? "").trim();
    const order = String(rule?.order ?? "asc").trim();
    if (!field) return;
    addEntry(field, order);
  });

  return {
    sortName: String(sortName ?? "").trim(),
    sorts: payload.filter((entry) => entry?.key),
  };
};

const SortPanel = ({
  colors,
  isMobile,
  panelThemeVars,
  sortRules = [],
  onSortRuleChange,
  onAddSortRule,
  onRemoveSortRule,
  onClose,
  onClear = () => { },
  onSaveSort = () => { },
  onApplySort = () => { },
  isLoading = false,
  savedSorts = [],
  attributes = [],
  toast = null,
  onDeleteSavedSort = () => { },
  entityAttributes = [],
  onReplaceSortRules = null,
}) => {
  const [sortName, setSortName] = useState("");
  const [selectedSavedSortId, setSelectedSavedSortId] = useState("");
  const [localAddedSorts, setLocalAddedSorts] = useState([]);
  const location = useLocation();
  const screenMenuId = location.state?.menuId;

  const hasSortName = Boolean(String(sortName ?? "").trim());

  // Parse and apply saved sort
  const handleLoadSavedSort = useCallback((sortData) => {
    if (!sortData) return;

    try {
      // Parse the sortJson string (may be double-stringified)
      let sorts = sortData.sortJson;
      if (typeof sorts === "string") {
        sorts = JSON.parse(sorts);
      }

      // Handle the structure where sortJson wraps an array
      const sortArray = sorts.sortJson || sorts;

      if (!Array.isArray(sortArray)) return;
      const newRules = [];
      let ruleIndex = 0;

      sortArray.forEach((sort) => {
        const { key, order } = sort;
        if (!key) return;
        newRules.push({
          id:
            ruleIndex === 0
              ? DEFAULT_SORT_RULE.id
              : `${Date.now()}-${ruleIndex}`,
          field: key.toUpperCase(),
          order: order || "asc",
        });

        ruleIndex++;
      });
      if (typeof onReplaceSortRules === "function") {
        onReplaceSortRules(newRules);
        return;
      }

      // Fallback: apply the parsed sort rules one by one
      if (newRules.length > 0) {
        newRules.forEach((rule, idx) => {
          if (idx === 0) {
            onSortRuleChange(rule.id, "field", rule.field);
            onSortRuleChange(rule.id, "order", rule.order);
          } else {
            onAddSortRule();
          }
        });
      } else {
        if (sortRules.length > 0 && sortRules[0]) {
          onSortRuleChange(sortRules[0].id, "field", "");
          onSortRuleChange(sortRules[0].id, "order", "asc");
        }
      }
    } catch (error) {
      console.error("Failed to parse saved sort:", error);
    }
  }, [onReplaceSortRules, onSortRuleChange, onAddSortRule, sortRules]);

  const handleSaveSort = async () => {
    const trimmedName = String(sortName ?? "").trim();
    if (!trimmedName) return;
    const payload = buildSortPayload({ sortName: trimmedName, sortRules });
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
      sortJson: payload?.sorts || [],
      filterJson: [],
      pageNumber: 1,
      pageSize: 100,
    };

    try {
      const response = await HAxiosService.POST(ColListingAPI.ListView(screenMenuId), dataBody);

      // Create new sort object and add to local list
      const newSort = {
        listViewCode: viewCode,
        viewCode: viewCode,
        viewName: trimmedName,
        listViewName: trimmedName,
        sortJson: payload?.sorts || [],
      };

      setLocalAddedSorts((prev) => [...prev, newSort]);
      setSelectedSavedSortId(viewCode);
      setSortName(""); // Clear sort name after save

      toast.success("Sort saved successfully");
    } catch (error) {
      console.error("Failed to save sort:", error);
      toast.error("Failed to save sort");
    }
  };

  const handleDeleteSort = async () => {
    if (!selectedSavedSortId) return;

    try {
      const allSorts = [...savedSorts, ...localAddedSorts];
      const selectedSort = allSorts.find((s) => getSavedSortId(s) === selectedSavedSortId);
      if (!selectedSort) return;

      const dataBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: selectedSavedSortId,
        viewName: "",
        sortJson: [],
        filterJson: [],
        pageNumber: 1,
        pageSize: 100,
      };

      const response = await HAxiosService.DELETE(ColListingAPI.ListView(screenMenuId), dataBody);

      if (response?.data?.status === "SUCCESS") {
        onDeleteSavedSort(selectedSavedSortId);
        setSelectedSavedSortId("");
        toast.success("Sort deleted successfully");
      } else {
        toast.error("Failed to delete sort");
      }
    } catch (error) {
      console.error("Failed to delete sort:", error);
      toast.error("Error deleting sort");
    }
  };

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

  const sortFieldOptions = useMemo(
    () => (Array.isArray(attributes) ? attributes : [])
      .filter((attr) => String(attr?.szType || "").includes("S") && String(attr?.szAttributeCode || "").trim())
      .map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes],
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
          gap: 1,
          mb: 2,
        }}
      >
        <HBox sx={{ minWidth: 0, flex: 1 }}>
          <HLabel value="Sort Options" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
          <HLabel
            value="Define sort rules to organize the account list by multiple fields."
            translate={false}
            align="left"
            colon={false}
            sx={sectionBodyStyles}
          />
        </HBox>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
          {(savedSorts.length > 0 || localAddedSorts.length > 0) && (
            <HBox
              sx={{
                p: 0.5,
                borderRadius: "10px",
                border: "none",
                backgroundColor: "transparent",
                minWidth: 300,
                maxWidth: 340,
                flexShrink: 0,
              }}
            >
              <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                <HDropdown
                  options={[
                    { label: "Select a saved sort...", value: "" },
                    ...[...savedSorts, ...localAddedSorts].map((sort) => ({
                      label: getSavedSortName(sort),
                      value: getSavedSortId(sort),
                    })),
                  ]}
                  value={selectedSavedSortId}
                  onChange={(event) => {
                    const sortId = event.target.value;
                    setSelectedSavedSortId(sortId);
                    if (sortId) {
                      const allSorts = [...savedSorts, ...localAddedSorts];
                      const selectedSort = allSorts.find((s) => getSavedSortId(s) === sortId);
                      if (selectedSort) {
                        handleLoadSavedSort(selectedSort);
                      }
                    }
                  }}
                  placeholder="Select a saved sort..."
                  width="88%"
                />
                <Tooltip title="Delete selected sort" arrow placement="top">
                  <span>
                    <IconButton
                      onClick={handleDeleteSort}
                      disabled={!selectedSavedSortId}
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
          )}
          <IconButton onClick={onClose} size="small" sx={{ color: colors.text.light }}>
            <FiX size={16} />
          </IconButton>
        </HBox>
      </HBox>

      <Divider sx={{ borderColor: colors.border, mb: 2 }} />

      <HBox>
        <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <HLabel value="SORT RULES" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
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

        <Stack spacing={1}>
          {sortRules.map((rule, index) => (
            <HBox
              key={rule.id}
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 36px",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <HDropdown
                options={[{ label: "Select field", value: "" }, ...sortFieldOptions]}
                value={rule.field}
                onChange={(event) => onSortRuleChange(rule.id, "field", event.target.value)}
                placeholder="Field"
                width="100%"
              />
              <ButtonGroup size="small" aria-label="sort order" sx={{display: "flex", gap: 0, minWidth: 0 }}>
                <HButton
                  label="Ascending"
                  variant={rule.order === "asc" ? "contained" : "outlined"}
                  size="small"
                  inline
                  onClick={() => onSortRuleChange(rule.id, "order", "asc")}
                  sx={{
                    textTransform: "none",
                    fontSize: 11,
                    minWidth: 0,
                    flex: 1,
                    borderRadius: "6px 0 0 6px",
                    backgroundColor: rule.order === "asc" ? "var(--drs-accent, #3b82f6)" : "transparent",
                    color: rule.order === "asc" ? "white" : "var(--drs-text-primary, #0f172a)",
                    borderColor: "var(--drs-border-default, #e2e8f0)",
                    "&:hover": {
                      backgroundColor: rule.order === "asc" ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)",
                    },
                  }}
                />
                <HButton
                  label="Descending"
                  variant={rule.order === "desc" ? "contained" : "outlined"}
                  size="small"
                  inline
                  onClick={() => onSortRuleChange(rule.id, "order", "desc")}
                  sx={{
                    textTransform: "none",
                    fontSize: 11,
                    minWidth: 0,
                    flex: 1,
                    borderRadius: "0 6px 6px 0",
                    backgroundColor: rule.order === "desc" ? "var(--drs-accent, #3b82f6)" : "transparent",
                    color: rule.order === "desc" ? "white" : "var(--drs-text-primary, #0f172a)",
                    borderColor: "var(--drs-border-default, #e2e8f0)",
                    "&:hover": {
                      backgroundColor: rule.order === "desc" ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)",
                    },
                  }}
                />
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
        <HLabel value="Save Sort" translate={false} align="left" colon={false} sx={sectionTitleStyles} />
        <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 3, width: "100%", flexWrap: "wrap" }}>
          <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 260 }}>
            <HLabel value="Sort Name" translate={false} align="left" colon={true} />
            <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <HTextField
                editable
                width="100%"
                value={sortName}
                onChange={(event) => setSortName(event.target.value)}
                placeholder="Enter sort name"
              />
              <HButton
                label="Save"
                variant="contained"
                size="small"
                inline
                onClick={handleSaveSort}
                disabled={!hasSortName}
                startIcon={<SaveIcon />}
                sx={{ minWidth: 90, height: 30, flexShrink: 0 }}
              />
            </HBox>
          </HBox>
        </HBox>
      </HBox>

      <Divider sx={{ borderColor: colors.border, my: 1 }} />

      <HBox sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", gap: 1.25, mt: 1, marginLeft: "auto", flexWrap: "wrap" }}>
        <HButton
          label="Apply Sort"
          variant="contained"
          size="small"
          inline
          onClick={onApplySort}
          disabled={isLoading}
          startIcon={<SearchIcon />}
          sx={{ height: 36, textTransform: "none" }}
        />
        <HButton
          label="Clear"
          variant="outlined"
          size="small"
          inline
          onClick={onClear}
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

export default React.memo(SortPanel);