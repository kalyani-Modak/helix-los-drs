import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import FormatListBulletedOutlined from "@mui/icons-material/FormatListBulletedOutlined";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import Tooltip from "@mui/material/Tooltip";
import { HAxiosService, useToast, HBox, HButton, HButtonBar, HDropdown, HTextField, HToggle, TitleBar, HBreadCrumb, SearchCommonBox, HAgGrid, HLabel } from "@helix/component-library";
import { GroupConfigAPI } from "./apiEndpoints.jsx";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import GroupConfigDrawer from "./GroupConfigDrawer";
import "./group-allocation-master.screen.css";

const MODULE_CODE_DEFAULT = "COL";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";

const gridSupervisorCodeDefObj = [
  {
    gridMappingName: "collectorcode",
    gridHeaderDesc: "Collector Code",
    gridHeaderId: "label.search.collector.code",
    gridColumnWidth: 180,
    gridColumnHeight: 20,
  },
  {
    gridMappingName: "collectorname",
    gridHeaderDesc: "Collector Name",
    gridHeaderId: "label.search.collector.name",
    gridColumnWidth: 350,
    gridColumnHeight: 20,
  },
];

const mapApiGroupToRow = (item, index) => ({
  id: item.groupCode || `row-${index}`,
  groupCode: item.groupCode || "",
  groupDescription: item.groupDescription || "",
  priority: item.priority ?? "",
  level: item.level ?? "",
  activeYn: item.activeYn === "Y",
  grouptype: item.groupType || "",
  supervisor: item.supervisor || "",
  exceptiongroup: item.exceptionGroup === "Y",
  allocationtype: item.allocationType || "",
  parentGroupCode: item.parentGroupCode || "",
  parentYn: item.parentYn === "Y",
  maxAllocatedTaskCount: item.maxAllocatedTaskCount ?? "",
  percentageCapacity: item.percentageCapacity ?? "",
  mode: "",
});

const createEmptyGroup = () => ({
  id: `new-${Date.now()}`,
  moduleCode: MODULE_CODE_DEFAULT,
  businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
  groupCode: "",
  groupDescription: "",
  priority: "",
  level: "",
  grouptype: "",
  supervisor: "",
  exceptiongroup: false,
  allocationtype: "",
  activeYn: true,
  mode: "N",
  _isDraftNew: true,
  parentGroupCode: "",
  parentYn: false,
});

const UppercaseTextEditor = forwardRef(function UppercaseTextEditor(props, ref) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select?.();
  }, []);

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return (inputRef.current?.value || "").toUpperCase();
    },
  }));

  return (
    <input
      ref={inputRef}
      className="ag-input-field-input ag-text-field-input"
      style={{ width: "100%", height: "100%", textTransform: "uppercase" }}
      defaultValue={props.value || ""}
    />
  );
});

const GroupAllocationMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const gridRef = useRef(null);
  const subGridRefs = useRef(new Map());
  const allocationRef = useRef(null);
  const subGroupRef = useRef(null);
  const hasFetchedOnceRef = useRef(false);

  const [allGroups, setAllGroups] = useState([]);
  const allGroupsRef = useRef(allGroups);
  useEffect(() => {
    allGroupsRef.current = allGroups;
  }, [allGroups]);
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [allocationTypeOptions, setAllocationTypeOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [withSubsOnly, setWithSubsOnly] = useState(false);
  const [expandedParentIds, setExpandedParentIds] = useState(() => new Set());
  const expandedParentIdsRef = useRef(expandedParentIds);
  useEffect(() => {
    expandedParentIdsRef.current = expandedParentIds;
  }, [expandedParentIds]);
  const [drawerGroupId, setDrawerGroupId] = useState(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState("group");

  const syncAllGroups = useCallback((updater) => {
    setAllGroups((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      allGroupsRef.current = next;
      return next;
    });
  }, []);

  const withEditedMode = (mode) => (mode !== "N" ? "E" : mode);

  const upsertRowField = useCallback((rowData, field, value) => {
    const normalizedValue =
      field === "groupCode" && typeof value === "string"
        ? value.toUpperCase()
        : value;

    syncAllGroups((prev) => {
      const idx = prev.findIndex((g) => g.id === rowData.id);
      if (idx === -1) {
        return [
          ...prev,
          {
            ...rowData,
            [field]: normalizedValue,
            mode: "N",
          },
        ];
      }

      const next = [...prev];
      next[idx] = {
        ...next[idx],
        [field]: normalizedValue,
        _isDraftNew: false,
        mode: withEditedMode(next[idx].mode),
      };

      if (field === "groupCode" && !next[idx].parentGroupCode) {
        const newCode = (normalizedValue || "").trim();
        return next.map((g) =>
          g.parentRowId === rowData.id ? { ...g, parentGroupCode: newCode } : g
        );
      }

      return next;
    });
  }, [syncAllGroups]);

  const subsByParentId = useMemo(() => {
    const map = new Map();
    allGroups.forEach((g) => {
      if (g.mode === "D" || g._deleted) return;
      if (!g.parentGroupCode && !g.parentRowId) return;

      let parentId = g.parentRowId;
      if (!parentId && g.parentGroupCode) {
        const parent = allGroups.find(
          (p) => !p.parentGroupCode && !p.parentRowId && p.groupCode === g.parentGroupCode
        );
        parentId = parent?.id;
      }
      if (!parentId) return;

      const arr = map.get(parentId) ?? [];
      arr.push(g);
      map.set(parentId, arr);
    });
    return map;
  }, [allGroups]);

  const parents = useMemo(() => {
    const liveRows = allGroups.filter((g) => {
      if (g.mode === "D" || g._deleted) return false;
      const isBlankDraft =
        g._isDraftNew === true &&
        !String(g.groupCode || "").trim() &&
        !String(g.groupDescription || "").trim() &&
        !String(g.grouptype || "").trim() &&
        !String(g.supervisor || "").trim();
      return !isBlankDraft;
    });
    return liveRows.filter((g) => !g.parentGroupCode && !g.parentRowId);
  }, [allGroups]);

  const filteredParents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parents.filter((g) => {
      if (
        q &&
        ![g.groupCode, g.groupDescription, g.supervisor].some((s) =>
          s?.toLowerCase().includes(q)
        )
      ) {
        return false;
      }
      if (typeFilter !== "all" && g.grouptype !== typeFilter) return false;
      if (activeOnly && !g.activeYn) return false;
      if (withSubsOnly && !(subsByParentId.get(g.id)?.length)) return false;
      return true;
    });
  }, [parents, search, typeFilter, activeOnly, withSubsOnly, subsByParentId]);

  const displayRows = useMemo(() => {
    const rows = [];
    filteredParents.forEach((parent) => {
      const isExpanded = expandedParentIds.has(parent.id);
      const subs = subsByParentId.get(parent.id) || [];
      const subCount = subs.length;

      rows.push({
        ...parent,
        __isSubPanel: false,
        _isExpanded: isExpanded,
        _subCount: subCount
      });

      if (isExpanded) {
        rows.push({
          id: `subpanel-${parent.id}`,
          __isSubPanel: true,
          parentGroupCode: parent.groupCode,
          parentRowId: parent.id,
          parent,
          _subs: subs,
          // Mirror parent values so HAgGrid required-field validation skips this layout row.
          groupCode: parent.groupCode || "",
          groupDescription: parent.groupDescription || "",
          supervisor: parent.supervisor || "",
          grouptype: parent.grouptype || "",
          activeYn: parent.activeYn,
        });
      }
    });
    return rows;
  }, [filteredParents, expandedParentIds, subsByParentId]);

  const drawerGroup = useMemo(
    () => allGroups.find((g) => g.id === drawerGroupId) ?? null,
    [allGroups, drawerGroupId]
  );

  const drawerSubCount = drawerGroup
    ? subsByParentId.get(drawerGroup.id)?.length || 0
    : 0;

  const fetchGroupConfig = useCallback(async () => {
    try {
      const res = await HAxiosService.GET(allocationBaseUrl);


      if (!res?.data?.success) {
        toast.error(
          res?.data?.message ||
          intl.formatMessage({
            id: "error.fetchGroupConfig",
            defaultMessage: "Error while fetching Group Configuration.",
          })
        );
        return;
      }

      const responseData = res.data.data;
      if (!responseData) return;

      if (Array.isArray(responseData.lstGroupConfig)) {
        setGroupTypeOptions(
          responseData.lstGroupConfig.map((item) => ({
            label: item.szDesc,
            value: item.szCondition,
          }))
        );
      }

      if (Array.isArray(responseData.allocationTypes)) {
        setAllocationTypeOptions(
          responseData.allocationTypes.map((item) => ({
            label: item.szDesc,
            value: item.szCondition,
          }))
        );
      }

      if (Array.isArray(responseData.objGroupConfigDto)) {
        const mappedRows = responseData.objGroupConfigDto.map((item, index) =>
          mapApiGroupToRow(item, index)
        );
        setAllGroups(mappedRows);
        allGroupsRef.current = mappedRows;
      }
    } catch (err) {
      toast.error(
        intl.formatMessage({
          id: "error.fetchGroupConfig",
          defaultMessage: "Error while fetching Group Configuration.",
        })
      );
    }
  }, [intl, toast]);

  useEffect(() => {
    if (hasFetchedOnceRef.current) return;
    hasFetchedOnceRef.current = true;
    fetchGroupConfig();
  }, [fetchGroupConfig]);

  const toggleExpand = useCallback((parentId) => {
    if (!parentId) return;
    setExpandedParentIds((prev) => {
      const next = new Set(prev);
      if (next.has(parentId)) next.delete(parentId);
      else next.add(parentId);
      return next;
    });
  }, []);

  const openConfigure = useCallback((group, tab = "group") => {
    if (group?.id) {
      setDrawerInitialTab(tab);
      setDrawerGroupId(group.id);
    }
  }, []);

  const handleDeleteSubGroup = useCallback((sub) => {
    if (sub.mode === "N") {
      syncAllGroups((prev) => prev.filter((g) => g.id !== sub.id));
      return;
    }
    syncAllGroups((prev) =>
      prev.map((g) =>
        g.id === sub.id ? { ...g, mode: "D", _deleted: true } : g
      )
    );
  }, [syncAllGroups]);

  const formatGroupType = useCallback(
    (value) => {
      const opt = groupTypeOptions.find((o) => o.value === value);
      return opt ? opt.label : value || "";
    },
    [groupTypeOptions]
  );

  const handleNewGroup = () => {
    const empty = createEmptyGroup();
    syncAllGroups((prev) => [empty, ...prev]);
    setDrawerGroupId(empty.id);
  };

  const handleAddSubGroup = useCallback((parent) => {
    if (!parent?.id) return;

    const parentCode = parent.groupCode?.trim() || "";
    const empty = {
      ...createEmptyGroup(),
      parentRowId: parent.id,
      parentGroupCode: parentCode,
      grouptype: parent.grouptype || "",
      supervisor: parent.supervisor || "",
      allocationtype: parent.allocationtype || "",
      mode: "N",
    };
    syncAllGroups((prev) => [...prev, empty]);
    setExpandedParentIds((prev) => new Set(prev).add(parent.id));
  }, [syncAllGroups]);

  const handleSubGroupFieldChange = useCallback((rowData, field, value) => {
    upsertRowField(rowData, field, value);
  }, [upsertRowField]);

  const handleDrawerGroupChange = useCallback((updated) => {
    syncAllGroups((prev) =>
      prev.map((g) =>
        g.id === updated.id
          ? {
            ...updated,
            _isDraftNew: false,
          }
          : g
      )
    );
  }, [syncAllGroups]);

  const handleDrawerClose = useCallback(() => {
    const currentId = drawerGroupId;
    if (!currentId) {
      setDrawerGroupId(null);
      return;
    }

    syncAllGroups((prev) =>
      prev.filter((g) => {
        if (g.id !== currentId) return true;

        const isUntouchedDraft =
          g.mode === "N" &&
          g._isDraftNew === true &&
          !String(g.groupCode || "").trim() &&
          !String(g.groupDescription || "").trim() &&
          !String(g.grouptype || "").trim() &&
          !String(g.supervisor || "").trim();

        return !isUntouchedDraft;
      })
    );

    setDrawerGroupId(null);
  }, [drawerGroupId, syncAllGroups]);

  const collectDirtyRows = useCallback(() => {
    const groups = allGroupsRef.current;
    const isDirtyNewRow = (g) => {
      if (g.mode !== "N") return false;
      const isSubGroup = Boolean(g.parentRowId || g.parentGroupCode?.trim());
      if (isSubGroup) {
        return Boolean(
          g.groupCode?.trim() || g.groupDescription?.trim() || g.grouptype
        );
      }
      return Boolean(
        g.groupCode?.trim() || g.groupDescription?.trim() || g.grouptype
      );
    };

    const dirty = {
      newRows: groups.filter(isDirtyNewRow),
      updatedRows: groups.filter((g) => g.mode === "E"),
      deletedRows: groups.filter((g) => g.mode === "D" || g._deleted),
    };

    return dirty;
  }, []);

  const registerSubGrid = useCallback((parentId, parentCode, node) => {
    if (node) {
      subGridRefs.current.set(parentId, { grid: node, parentCode });
      return;
    }
    subGridRefs.current.delete(parentId);
  }, []);

  const syncSubGridsToAllGroups = useCallback(() => {
    subGridRefs.current.forEach(({ grid, parentCode }, parentId) => {
      const api = grid?.api;
      if (!api) return;

      const rows = [];
      api.forEachNode((node) => {
        if (node?.data) rows.push(node.data);
      });
      if (!rows.length) return;

      syncAllGroups((prev) => {
        const parent = prev.find((g) => g.id === parentId);
        const resolvedParentCode = (parent?.groupCode || parentCode || "").trim();
        const nextById = new Map(rows.map((r) => [r.id, r]));

        const merged = prev.map((g) => {
          if (!nextById.has(g.id)) return g;
          const row = nextById.get(g.id);
          return {
            ...g,
            ...row,
            parentRowId: parentId,
            parentGroupCode: (
              row.parentGroupCode ||
              resolvedParentCode ||
              g.parentGroupCode ||
              ""
            ).trim(),
            mode: g.mode === "N" ? "N" : "E",
          };
        });

        rows.forEach((row) => {
          if (!merged.some((g) => g.id === row.id)) {
            merged.push({
              ...row,
              parentRowId: parentId,
              parentGroupCode: resolvedParentCode,
              mode: row.mode || "N",
            });
          }
        });

        return merged;
      });
    });
  }, [syncAllGroups]);

  const flushPendingGridEdits = useCallback(async () => {
    document.activeElement?.blur?.();
    gridRef.current?.api?.stopEditing?.(false);
    subGridRefs.current.forEach(({ grid }) => {
      grid?.api?.stopEditing?.(false);
    });
    await new Promise((resolve) => setTimeout(resolve, 50));
    syncSubGridsToAllGroups();
  }, [syncSubGridsToAllGroups]);

  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (!data || newValue === oldValue) return;
    upsertRowField(data, colDef.field, newValue);
  };

  const buildSavePayload = (rows) =>
    rows.map((row) => {
      const parentCode = row.parentGroupCode?.trim() || null;
      const isSubGroup = Boolean(parentCode);

      return {
        moduleCode: MODULE_CODE_DEFAULT,
        businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
        groupCode: row.groupCode?.trim(),
        groupDescription: row.groupDescription?.trim() || "",
        priority:
          row.priority === "" || row.priority === null || row.priority === undefined
            ? null
            : Number(row.priority),
        level:
          row.level === "" || row.level === null || row.level === undefined
            ? null
            : Number(row.level),
        groupType: row.grouptype || null,
        supervisor: row.supervisor?.trim() || null,
        allocationType: row.allocationtype || null,
        exceptionGroup: row.exceptiongroup ? "Y" : "N",
        activeYn: row.activeYn ? "Y" : "N",
        hierarchyCode: row.hierarchyCode || "",
        mode: row.mode || "E",
        user: LOGGED_IN_USER,
        parentGroupCode: isSubGroup ? parentCode : null,
        parentYn: isSubGroup
          ? "N"
          : row.parentYn
            ? "Y"
            : (subsByParentId.get(row.id)?.length || 0) > 0
              ? "Y"
              : "N",
      };
    });

  const handleGroupSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const byId = new Map();
      newRows.forEach((row) => byId.set(row.id, { ...row, mode: "N" }));
      updatedRows.forEach((row) => {
        if (!byId.has(row.id)) byId.set(row.id, { ...row, mode: "E" });
      });
      deletedRows.forEach((row) => byId.set(row.id, { ...row, mode: "D" }));
      const rows = Array.from(byId.values());

      // Filter out new rows that are completely empty so they don't block saving
      const rowsToProcess = rows
        .filter((r) => {
          if (r.mode === "N" && !r.groupCode?.trim() && !r.groupDescription?.trim()) {
            return false;
          }
          return true;
        })
        .map((r) => {
          const stateRow = allGroupsRef.current.find((g) => g.id === r.id);
          const parentFromRow = stateRow?.parentRowId || r.parentRowId;
          const parentCodeFromId = parentFromRow
            ? allGroupsRef.current.find((p) => p.id === parentFromRow)?.groupCode?.trim()
            : "";
          const parentCode = (
            r.parentGroupCode ??
            stateRow?.parentGroupCode ??
            parentCodeFromId ??
            ""
          ).trim();
          return parentCode ? { ...r, parentGroupCode: parentCode } : r;
        });

      if (rowsToProcess.length === 0) {
        return { success: true };
      }

      const invalidRow = rowsToProcess.find((r) => {
        if (r.mode === "D") return false;
        if (!r.groupCode?.trim() || !r.groupDescription?.trim() || !r.grouptype) {
          return true;
        }
        const stateRow = allGroupsRef.current.find((g) => g.id === r.id);
        const isSubGroup = Boolean(
          (r.parentGroupCode ?? stateRow?.parentGroupCode ?? "").trim() ||
          stateRow?.parentRowId ||
          r.parentRowId
        );
        const resolvedParentCode = (
          r.parentGroupCode ??
          stateRow?.parentGroupCode ??
          (stateRow?.parentRowId || r.parentRowId
            ? allGroupsRef.current
              .find((p) => p.id === (stateRow?.parentRowId || r.parentRowId))
              ?.groupCode
            : "") ??
          ""
        ).trim();
        return isSubGroup && !resolvedParentCode;
      });

      if (invalidRow) {
        toast.error(
          intl.formatMessage({
            id: "error.missingRequiredGroupFields",
            defaultMessage:
              "Please fill in all required fields (Group Code, Description, Group Type) before saving.",
          })
        );
        return { success: false };
      }

      const payload = buildSavePayload(rowsToProcess);

      const response = await HAxiosService.POST(
        allocationBaseUrl,
        payload
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ||
          intl.formatMessage({
            id: "success.groupConfigSaved",
            defaultMessage: "Group configuration saved successfully!",
          })
        );
        const expandedSnapshot = new Set(expandedParentIdsRef.current);
        const expandedGroupCodes = [...expandedSnapshot]
          .map((id) => allGroupsRef.current.find((g) => g.id === id)?.groupCode?.trim())
          .filter(Boolean);
        await fetchGroupConfig();
        const restoredExpanded = new Set();
        allGroupsRef.current.forEach((g) => {
          if (expandedSnapshot.has(g.id)) {
            restoredExpanded.add(g.id);
          } else if (g.groupCode && expandedGroupCodes.includes(g.groupCode)) {
            restoredExpanded.add(g.id);
          }
        });
        setExpandedParentIds(restoredExpanded);
        return { success: true };
      }

      toast.error(
        response.data?.message ||
        intl.formatMessage({
          id: "error.groupConfigSaveFailed",
          defaultMessage: "Failed to save group configuration.",
        })
      );
      return { success: false };
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        intl.formatMessage({
          id: "error.saveData",
          defaultMessage: "Error while saving data.",
        })
      );
      return { success: false };
    }
  };

  const runTabSaves = async () => {
    if (!drawerGroupId) return { success: true };

    const currentDrawerGroup = allGroupsRef.current.find(
      (g) => g.id === drawerGroupId
    );
    const isExistingGroup = Boolean(
      currentDrawerGroup &&
      currentDrawerGroup.mode !== "N" &&
      currentDrawerGroup.groupCode?.trim()
    );

    // Skip tab-level update APIs for brand-new unsaved groups.
    if (!isExistingGroup) {
      return { success: true };
    }

    if (allocationRef.current?.submitChanges) {
      const allocationResult = await allocationRef.current.submitChanges();
      if (allocationResult?.success === false) {
        return { success: false };
      }
    }
    if (subGroupRef.current?.submitChanges) {
      const subGroupResult = await subGroupRef.current.submitChanges();
      if (subGroupResult?.success === false) {
        return { success: false };
      }
    }
    return { success: true };
  };

  const handleMainGridSave = async (gridArgs) => {
    const { newRows = [], updatedRows = [], deletedRows = [] } = gridArgs || {};
    const stateDirty = collectDirtyRows();

    const merge = (arr1, arr2) => {
      const map = new Map();
      arr1.forEach(r => map.set(r.id, r));
      arr2.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    };

    const finalNew = merge(stateDirty.newRows, newRows);
    const finalUpd = merge(stateDirty.updatedRows, updatedRows);
    const finalDel = merge(stateDirty.deletedRows, deletedRows);

    if (!finalNew.length && !finalUpd.length && !finalDel.length) {
      await fetchGroupConfig();
      return { success: true };
    }

    return handleGroupSave({ newRows: finalNew, updatedRows: finalUpd, deletedRows: finalDel });
  };

  const handlePageSave = async () => {
    await flushPendingGridEdits();

    const tabResult = await runTabSaves();
    if (tabResult.success === false) return { success: false };

    if (gridRef.current?.submitChanges) {
      const res = await gridRef.current.submitChanges();
      if (res && res.success === false) return { success: false };
      return res;
    }

    return handleMainGridSave();
  };

  const handleDrawerSave = async () => {
    await flushPendingGridEdits();

    const tabResult = await runTabSaves();
    if (tabResult.success === false) return { success: false };

    if (gridRef.current?.submitChanges) {
      const res = await gridRef.current.submitChanges();
      if (res && res.success === false) return { success: false };
      setDrawerGroupId(null);
      return res;
    }

    const result = await handleMainGridSave();
    if (result?.success) {
      setDrawerGroupId(null);
    }
    return result;
  };

  const handleRefresh = useCallback(async () => {
    setDrawerGroupId(null);
    await fetchGroupConfig();
    return { success: true };
  }, [fetchGroupConfig]);

  const SearchRenderer = (props) => {
    const {
      value,
      node,
      column,
      searchCode,
      selectedColumn,
      gridDefObj,
      searchBoxWidth = 120,
      searchBoxHeight = 25,
      searchBoxFontSize = 11,
    } = props;
    const isInitialized = useRef(false);

    const normalizeSearchValue = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") {
        return String(raw);
      }
      if (typeof raw === "object") {
        if (typeof raw.value === "string") return raw.value;
        if (typeof raw.code === "string") return raw.code;
        if (typeof raw.collectorcode === "string") return raw.collectorcode;
        if (typeof raw.hierarchycode === "string") return raw.hierarchycode;
        return "";
      }
      return "";
    };

    if (!node || !column) return null;

    const handleSetValue = (dataValue) => {
      if (!isInitialized.current) {
        isInitialized.current = true;
        return;
      }
      const newValue = normalizeSearchValue(dataValue);
      node.setDataValue(column.getColId(), newValue);
      if (node.data?.mode !== "N") node.data.mode = "E";

      const field = column.getColId();
      if (!field || !node.data) return;
      upsertRowField(node.data, field, newValue);
    };

    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
        searchCode={searchCode}
        selectedValue={normalizeSearchValue(value)}
        selectedColumn={selectedColumn}
        gridDefObj={gridDefObj}
        gridWidth={450}
        gridHeight={300}
        gridNoOfRowsPerPage={5}
        searchBoxWidth={searchBoxWidth}
        searchBoxHeight={searchBoxHeight}
        searchBoxFontSize={searchBoxFontSize}
        error={false}
        setSelectedValue={handleSetValue}
      />
    );
  };

  const subGroupColumnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.code",
        defaultMessage: "Code",
      }),
      field: "groupCode",
      minWidth: 120,
      flex: 1,
      editable: (p) => p.data?.mode === "N",
      cellEditor: UppercaseTextEditor,
      valueSetter: (params) => {
        const next = String(params.newValue ?? "").toUpperCase();
        params.data.groupCode = next;
        return true;
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.description",
        defaultMessage: "Description",
      }),
      field: "groupDescription",
      minWidth: 250,
      flex: 2,
      editable: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupType",
        defaultMessage: "Group Type",
      }),
      field: "grouptype",
      width: 150,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: groupTypeOptions.map((o) => o.value),
      },
      valueFormatter: (p) =>
        groupTypeOptions.find((o) => o.value === p.value)?.label ?? p.value,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.supervisor",
        defaultMessage: "Supervisor",
      }),
      field: "supervisor",
      width: 150,
      editable: false,
      cellRenderer: (p) => <SearchRenderer {...p} />,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRendererParams: {
        searchCode: "SUPERVISORCD",
        selectedColumn: "collectorcode",
        gridDefObj: gridSupervisorCodeDefObj,
        searchBoxWidth: 130,
        searchBoxHeight: 26,
        searchBoxFontSize: 11,
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.active",
        defaultMessage: "Active",
      }),
      field: "activeYn",
      width: 80,
      editable: true,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRenderer: (p) => (
        <HToggle
          checked={!!p.value}
          onChange={(e) => {
            const next = e.target.checked;
            p.node?.setDataValue?.("activeYn", next);
            handleSubGroupFieldChange(p.data, "activeYn", next);
          }}
        />
      ),
    },
    {
      headerName: "",
      field: "__actions",
      width: 56,
      sortable: false,
      filter: false,
      editable: false,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      cellRenderer: (p) => {
        const sub = p.data;
        if (!sub) return null;

        const canDelete = sub.mode !== "D" && !sub._deleted;
        const deleteLabel = intl.formatMessage({
          id: "label.groupAllocationMaster.delete",
          defaultMessage: "Delete",
        });

        return (
          <HBox className="group-allocation-master-sub-actions group-allocation-sub-action-cell">
            <Tooltip title={deleteLabel} arrow placement="top">
              <span>
                <button
                  type="button"
                  className="group-allocation-sub-action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSubGroup(sub);
                  }}
                  title={deleteLabel}
                  aria-label={deleteLabel}
                  disabled={!canDelete}
                >
                  <DeleteOutlined
                    className="group-allocation-sub-delete-icon"
                    fontSize="small"
                  />
                </button>
              </span>
            </Tooltip>
          </HBox>
        );
      },
    },
  ], [intl, groupTypeOptions, handleSubGroupFieldChange, handleDeleteSubGroup]);

  const SubGroupPanelRenderer = useCallback(
    (params) => {
      const parent = params?.data?.parent;
      if (!parent) return null;

      const subs = (params.data._subs || []).filter(
        (g) => g.mode !== "D" && !g._deleted
      );

      return (
        <HBox className="group-allocation-master-subpanel" style={{ minWidth: "1200px" }}>
          <HBox className="group-allocation-master-subpanel-header">
            <HBox className="group-allocation-master-subpanel-title" style={{ backgroundColor: "transparent" }}>
              <span className="group-allocation-master-subpanel-icon">⊞</span>
              <span>
                {intl.formatMessage({
                  id: "label.groupAllocationMaster.subGroupsOf",
                  defaultMessage: "Sub-groups of",
                })}
              </span>
              <span className="group-allocation-master-subpanel-code">
                {parent.groupCode}
              </span>
              <span className="group-allocation-master-subpanel-muted">
                · {subs.length}{" "}
                {intl.formatMessage({
                  id: "label.groupAllocationMaster.items",
                  defaultMessage: "items",
                })}
              </span>
            </HBox>
            <span
              className="group-allocation-master-add-sub-link"
              onClick={() => handleAddSubGroup(parent)}
            >
              + {intl.formatMessage({
                id: "label.groupAllocationMaster.addSubGroup",
                defaultMessage: "Add sub-group",
              })}
            </span>
          </HBox>

          {subs.length === 0 ? (
            <HBox className="group-allocation-master-subpanel-empty">
              {intl.formatMessage({
                id: "label.groupAllocationMaster.noSubGroupsDesc",
                defaultMessage:
                  "No sub-groups yet. Sub-groups inherit type & supervisor from the parent but can be customised.",
              })}
            </HBox>
          ) : (
            <HBox className="group-allocation-master-sub-grid-wrap">
              <HAgGrid
                ref={(node) => registerSubGrid(parent.id, parent.groupCode, node)}
                rowData={subs}
                disableToast={{ validation: true }}
                setRowData={(updater) => {
                  const next =
                    typeof updater === "function" ? updater(subs) : updater;
                  const nextRowsRaw = Array.isArray(next) ? next : [];
                  const nextRows = nextRowsRaw.map((row, index) => ({
                    ...row,
                    id: row.id || `sub-${parent.id}-${Date.now()}-${index}`,
                    // Keep existing rows persisted (mode "") and mark only brand-new rows as "N".
                    mode: row.mode ?? (row.id ? "" : "N"),
                    groupCode:
                      typeof row.groupCode === "string"
                        ? row.groupCode.toUpperCase()
                        : row.groupCode,
                    parentRowId: parent.id,
                    parentGroupCode: (row.parentGroupCode || parent.groupCode || "").trim(),
                    grouptype: row.grouptype || parent.grouptype || "",
                    supervisor: row.supervisor || parent.supervisor || "",
                    allocationtype: row.allocationtype || parent.allocationtype || "",
                    activeYn: typeof row.activeYn === "boolean" ? row.activeYn : true,
                  }));
                  const nextById = new Map(nextRows.map((r) => [r.id, r]));
                  syncAllGroups((prev) => {
                    const merged = prev.map((g) => {
                      if (!nextById.has(g.id)) return g;
                      const nextRow = nextById.get(g.id);
                      return {
                        ...g,
                        ...nextRow,
                        parentRowId: parent.id,
                        parentGroupCode: (
                          nextRow.parentGroupCode ||
                          parent.groupCode ||
                          g.parentGroupCode ||
                          ""
                        ).trim(),
                        mode: g.mode !== "N" ? "E" : g.mode,
                      };
                    });

                    nextRows.forEach((row) => {
                      if (!merged.find((g) => g.id === row.id)) {
                        merged.push(row);
                      }
                    });
                    return merged;
                  });
                }}
                columnDefs={subGroupColumnDefs}
                gridStyle={{ width: "100%", height: "260px" }}
                rowHeight={40}
                stopEditingWhenCellsLoseFocus={true}
                onCellValueChanged={(params) => {
                  const field = params?.colDef?.field;
                  if (!params?.data || !field || field === "__actions") return;
                  if (params.data.mode !== "N") {
                    params.data.mode = "E";
                  }
                }}
                getRowId={(params) => params.data.id}
                pagination
                paginationPageSize={5}
              />
            </HBox>
          )}
        </HBox>
      );
    },
    [
      intl,
      groupTypeOptions,
      openConfigure,
      handleDeleteSubGroup,
      handleAddSubGroup,
      registerSubGrid,
      subGroupColumnDefs
    ]
  );

  const ExpandCellRenderer = useCallback(
    (params) => {
      if (!params?.data || params.data.__isSubPanel) return null;

      const code = params.data?.groupCode;
      const isExpanded = !!params.data._isExpanded;

      return (
        <button
          type="button"
          className="group-allocation-master-expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(params.data.id);
          }}
          title={isExpanded ? "Collapse sub-groups" : "Expand sub-groups"}
        >
          {isExpanded ? (
            <span className="group-allocation-master-expand-glyph" aria-hidden="true">⌄</span>
          ) : (
            <span className="group-allocation-master-expand-glyph" aria-hidden="true">›</span>
          )}
        </button>
      );
    },
    [toggleExpand]
  );

  const GroupCodeCellRenderer = useCallback(
    (params) => {
      if (!params?.data || params.data.__isSubPanel) return null;

      const code = params.data?.groupCode;

      if (params.data?.mode === "N") {
        return params.value || "";
      }

      return (
        <span
          className="group-allocation-master-code-link"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(params.data.id);
          }}
        >
          {code}
        </span>
      );
    },
    [toggleExpand]
  );

  const SubGroupsCellRenderer = useCallback(
    (params) => {
      if (!params?.data || params.data.__isSubPanel) return null;
      const count = params.data._subCount || 0;
      return (
        <span
          className={`group-allocation-master-subcount${count === 0 ? " is-empty" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (count === 0) {
              handleAddSubGroup(params.data);
            } else {
              toggleExpand(params.data.id);
            }
          }}
        >
          <FormatListBulletedOutlined
            aria-hidden="true"
            style={{ marginRight: 6, fontSize: 14 }}
          />
          {count > 0
            ? intl.formatMessage(
              {
                id: "label.groupAllocationMaster.subGroupCount",
                defaultMessage: "{count} sub-groups",
              },
              { count }
            )
            : intl.formatMessage({
              id: "label.groupAllocationMaster.addSubGroup",
              defaultMessage: "Add sub-group",
            })}
        </span>
      );
    },
    [toggleExpand, intl, handleAddSubGroup]
  );

  const ActiveToggleRenderer = useCallback((params) => {
    if (!params?.data || params.data.__isSubPanel) return null;

    return (
      <HToggle
        checked={!!params.value}
        onChange={(e) => {
          const next = e.target.checked;
          params.node?.setDataValue?.("activeYn", next);
          if (params.data && params.data.mode !== "N") {
            params.data.mode = "E";
          }
          handleCellEdit({
            data: params.data,
            colDef: { field: "activeYn" },
            newValue: next,
            oldValue: params.value,
          });
        }}
      />
    );
  }, []);

  const ConfigureCellRenderer = useCallback(
    (params) => {
      if (!params?.data || params.data.__isSubPanel) return null;
      return (
        <span
          className="group-allocation-master-link-btn"
          onClick={(e) => {
            e.stopPropagation();
            openConfigure(params.data, "group");
          }}
        >
          <TuneOutlined aria-hidden="true" style={{ marginRight: 6, fontSize: 14 }} />
          {intl.formatMessage({
            id: "label.groupAllocationMaster.configure",
            defaultMessage: "Configure",
          })}
        </span>
      );
    },
    [openConfigure, intl]
  );

  const isMainGridDataRow = (params) =>
    Boolean(params?.data && !params.data.__isSubPanel);

  const groupConfigColumns = useMemo(
    () => [
      {
        headerName: "",
        width: 40,
        sortable: false,
        filter: false,
        editable: false,
        suppressNavigable: true,
        colSpan: (params) => (params?.data?.__isSubPanel ? 20 : 1),
        cellRenderer: (params) => {
          if (params?.data?.__isSubPanel && params.data.parent) {
            return SubGroupPanelRenderer(params);
          }
          return ExpandCellRenderer(params);
        },
        autoHeight: true,
        cellStyle: (params) =>
          params?.data?.__isSubPanel
            ? {
              padding: 0,
              border: "none",
              background: "transparent",
              overflow: "visible",
            }
            : {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.code",
          defaultMessage: "Code",
        }),
        field: "groupCode",
        width: 120,
        editable: (params) =>
          !params?.data?.__isSubPanel && params?.data?.mode === "N",
        cellEditor: UppercaseTextEditor,
        required: isMainGridDataRow,
        filter: false,
        cellRenderer: GroupCodeCellRenderer,
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.description",
          defaultMessage: "Description",
        }),
        field: "groupDescription",
        editable: (params) => !params?.data?.__isSubPanel,
        required: isMainGridDataRow,
        width: 280,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.groupType",
          defaultMessage: "Type",
        }),
        field: "grouptype",
        width: 170,
        editable: (params) => !params?.data?.__isSubPanel,
        cellEditor: "agSelectCellEditor",
        filter: false,
        cellEditorParams: {
          values: groupTypeOptions.map((o) => o.value),
        },
        valueFormatter: (params) => formatGroupType(params.value),
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.supervisor",
          defaultMessage: "Supervisor",
        }),
        field: "supervisor",
        width: 160,
        editable: false,
        required: isMainGridDataRow,
        filter: false,
        cellRenderer: (params) => {
          if (!params?.data || params.data.__isSubPanel) return null;
          return <SearchRenderer {...params} />;
        },
        cellRendererParams: {
          searchCode: "SUPERVISORCD",
          selectedColumn: "collectorcode",
          gridDefObj: gridSupervisorCodeDefObj,
          searchBoxWidth: 130,
          searchBoxHeight: 27,
          searchBoxFontSize: 11,
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.subGroups",
          defaultMessage: "Sub-Groups",
        }),
        field: "__subGroups",
        width: 180,
        editable: false,
        sortable: false,
        filter: false,
        cellRenderer: SubGroupsCellRenderer,
        cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" },
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.active",
          defaultMessage: "Active",
        }),
        field: "activeYn",
        width: 80,
        editable: false,
        filter: false,
        cellRenderer: ActiveToggleRenderer,
      },
      {
        headerName: intl.formatMessage({
          id: "label.groupAllocationMaster.configure",
          defaultMessage: "Configure",
        }),
        field: "__configure",
        width: 150,
        editable: false,
        sortable: false,
        filter: false,
        cellRenderer: ConfigureCellRenderer,
      },
    ],
    [
      intl,
      groupTypeOptions,
      ExpandCellRenderer,
      GroupCodeCellRenderer,
      SubGroupsCellRenderer,
      ConfigureCellRenderer,
      ActiveToggleRenderer,
      SubGroupPanelRenderer,
      formatGroupType,
    ]
  );

  const typeFilterOptions = useMemo(
    () => [
      {
        value: "all",
        label: intl.formatMessage({
          id: "label.groupAllocationMaster.allTypes",
          defaultMessage: "All types",
        }),
      },
      ...groupTypeOptions,
    ],
    [groupTypeOptions, intl]
  );

  const getDefaultGroupConfigRow = () => createEmptyGroup();

  const getRowClass = (params) =>
    params?.data?.__isSubPanel ? "group-allocation-master-subpanel-row" : "";

  return (
    <HBox className="group-allocation-master-page">
      <HBox className="group-allocation-master-header-card">
        <HBreadCrumb />
        <HBox className="group-allocation-master-header-row">
          <HBox className="group-allocation-master-title-block">
            <TitleBar
              title={intl.formatMessage({
                id: "label.groupAllocationMaster.title",
                defaultMessage: "Group Master",
              })}
            />
            <HLabel
              component="p"
              className="group-allocation-master-subtitle"
              value={intl.formatMessage({
                id: "label.groupAllocationMaster.subtitle",
                defaultMessage:
                  "Configure collection groups. Expand a row to manage its sub-groups inline, or open Configure / Allocation Rule for detailed setup.",
              })}
              translate={false}
              colon={false}
              align="left"
            />
          </HBox>
          <HButton
            label={intl.formatMessage({
              id: "label.groupAllocationMaster.newGroup",
              defaultMessage: "+ New Group",
            })}
            onClick={handleNewGroup}
          />
        </HBox>
      </HBox>

      <HBox className="group-allocation-master-toolbar">
        <HBox className="group-allocation-master-search-wrap">
          <HTextField
            id="group-master-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            editable
            width="100%"
            placeholder="label.groupAllocationMaster.searchPlaceholder"
          />
        </HBox>

        <HBox className="group-allocation-master-type-filter">
          <HDropdown
            name="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={typeFilterOptions}
            width="160px"
          />
        </HBox>

        <HButton
          onClick={() => setActiveOnly(!activeOnly)}
          type="secondary"
          style={{
            backgroundColor: activeOnly ? "#e3f2fd" : undefined,
            color: activeOnly ? "#1976d2" : undefined,
            borderColor: activeOnly ? "#90caf9" : undefined,
          }}
          label={intl.formatMessage({
            id: "label.groupAllocationMaster.activeOnly",
            defaultMessage: "Active only",
          })}
        />

        <HButton
          onClick={() => setWithSubsOnly(!withSubsOnly)}
          type="secondary"
          style={{
            backgroundColor: withSubsOnly ? "#e3f2fd" : undefined,
            color: withSubsOnly ? "#1976d2" : undefined,
            borderColor: withSubsOnly ? "#90caf9" : undefined,
          }}
          label={intl.formatMessage({
            id: "label.groupAllocationMaster.hasSubGroups",
            defaultMessage: "Has sub-groups",
          })}
        />

        <span className="group-allocation-master-count">
          {intl.formatMessage(
            {
              id: "label.groupAllocationMaster.filterCount",
              defaultMessage: "{filtered} of {total} groups",
            },
            {
              filtered: filteredParents.length,
              total: parents.length,
            }
          )}
        </span>
      </HBox>

      <HBox className="group-allocation-master-content">
        <HBox className="group-allocation-master-grid-wrap">
          <HAgGrid
            ref={gridRef}
            rowData={displayRows}
            setRowData={(updater) => {
              const next =
                typeof updater === "function" ? updater(displayRows) : updater;
              const dataRowsRaw = next.filter((r) => !r.__isSubPanel);
              const dataRows = dataRowsRaw.map((row, index) => ({
                ...row,
                id: row.id || `new-${Date.now()}-${index}`,
                mode: row.mode || "N",
              }));
              const nextById = new Map(dataRows.map((r) => [r.id, r]));

              syncAllGroups((prev) => {
                const merged = prev.map((g) => {
                  const wasDisplayed = displayRows.some(d => d.id === g.id && !d.__isSubPanel);
                  if (wasDisplayed && !nextById.has(g.id)) {
                    return { ...g, mode: "D" };
                  }
                  if (!nextById.has(g.id)) return g;
                  const nextRow = nextById.get(g.id);
                  return {
                    ...g,
                    ...nextRow,
                    mode: nextRow.mode || g.mode || "N",
                  };
                });

                dataRows.forEach((row) => {
                  if (!merged.find((g) => g.id === row.id)) {
                    merged.push(row);
                  }
                });
                return merged;
              });
            }}
            columnDefs={groupConfigColumns}
            pagination
            paginationPageSize={20}
            allowDelete
            allowUpdate
            onSave={handleMainGridSave}
            rowSelection="multiple"
            onCellValueChanged={handleCellEdit}
            defaultNewRowData={getDefaultGroupConfigRow}
            getRowClass={getRowClass}
            getRowId={(params) => params.data.id}
            gridClassName="drs-list-grid"
            embeddedInSection
          />
        </HBox>

        <HButtonBar
          onSave={handlePageSave}
          onReset={handleRefresh}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>

      <GroupConfigDrawer
        open={Boolean(drawerGroup)}
        onClose={handleDrawerClose}
        onSave={handleDrawerSave}
        group={drawerGroup}
        hasSubGroups={drawerSubCount > 0}
        groupTypeOptions={groupTypeOptions}
        allocationTypeOptions={allocationTypeOptions}
        onGroupChange={handleDrawerGroupChange}
        allocationRef={allocationRef}
        subGroupRef={subGroupRef}
        initialTab={drawerInitialTab}
      />
    </HBox>
  );
};

export default GroupAllocationMaster;
