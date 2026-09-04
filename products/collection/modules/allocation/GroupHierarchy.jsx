import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import AddIcon from "@mui/icons-material/Add";
import { HAxiosService, useToast, HBox, HButtonBar, TitleBar, HBreadCrumb, HTextField, HLabel, HToggle, HButton, HAgGrid } from "@helix/component-library";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { GroupHierarchyAPI } from "./apiEndpoints";
import { getGroupHierarchyColumnDefs } from "./groupHierarchy.columnDefs";
import HierarchyDefinitionDrawer from "./HierarchyDefinitionDrawer";
import { mapRowsFromResponse, buildSavePayload, filterHierarchies, validateHierarchyRow, validateLevels, emptyHierarchyRow,} from "./groupHierarchy.mappers";
import "./group-hierarchy.screen.css";
const GroupHierarchy = () => {
  const location = useLocation();
  const screenMenuId = location.state.menuId;

  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const originalByCodeRef = useRef({});

  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);

  const filteredRows = useMemo(
    () => {
      const base = filterHierarchies(allRows, searchQuery, activeOnly);
      const q = String(searchQuery || "").trim().toLowerCase();
      if (!q) return base;

      const exactCodeMatches = base.filter(
        (r) => String(r.hierarchyCode || "").trim().toLowerCase() === q
      );

      return exactCodeMatches.length > 0 ? exactCodeMatches : base;
    },
    [allRows, searchQuery, activeOnly]
  );

  const handleOpenDefinition = useCallback((row) => {
    setEditingRow({
      ...row,
      levels: Array.isArray(row.levels) ? row.levels : [],
    });
  }, []);

  const columnDefs = useMemo(
    () => getGroupHierarchyColumnDefs(intl, { onOpenDefinition: handleOpenDefinition }),
    [intl, handleOpenDefinition]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await HAxiosService.GET(
        GroupHierarchyAPI.GroupHierarchyDetails(screenMenuId)
      );
      const result = response?.data;

      const responseData = result?.data;
      const hierarchyList = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.objGroupHierarchyResponseDto)
          ? responseData.objGroupHierarchyResponseDto
          : [];

      const mappedRoleOptions = Array.isArray(responseData?.lstHierarchyRoles)
        ? responseData.lstHierarchyRoles.map((item) => {
          const rawKey = String(item?.szi18nDesc || "").trim();
          const fallback = String(item?.szCondition || "").trim();
          const roleToken = rawKey ? rawKey.split(".").pop() : "";
          const label = rawKey
            ? intl.formatMessage({
              id: rawKey,
              defaultMessage: roleToken || fallback || rawKey,
            })
            : fallback;
          return {
            value: label,
            label,
          };
        })
        : [];

      if (result?.success && Array.isArray(hierarchyList)) {
        const rows = mapRowsFromResponse(hierarchyList);
        const byCode = {};
        rows.forEach((r) => {
          byCode[r.hierarchyCode] = {
            ...r,
            levels: (r.levels || []).map((l) => ({ ...l })),
          };
        });
        originalByCodeRef.current = byCode;
        setAllRows(rows);
        setRoleOptions(mappedRoleOptions);
      } else {
        toast.error(
          result?.message ||
          intl.formatMessage({
            id: "message.GroupHierarchy.LoadError",
            defaultMessage: "Error loading group hierarchy.",
          })
        );
        setAllRows([]);
        setRoleOptions([]);
      }
    } catch (err) {
      console.error(err);
      toast.error(
        intl.formatMessage({
          id: "message.GroupHierarchy.LoadError",
          defaultMessage: "Error loading group hierarchy.",
        })
      );
      setAllRows([]);
      setRoleOptions([]);
    } finally {
      setLoading(false);
    }
  }, [intl, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddHierarchy = useCallback(() => {
    const row = {
      ...emptyHierarchyRow(),
      _isNew: true,
      mode: "N",
      active: true,
      levels: [],
    };
    setAllRows((prev) => [...prev, row]);
  }, []);

  const handleDefinitionSave = useCallback(
    (levels) => {
      if (!editingRow) return;
      const gridRowId = editingRow.gridRowId;
      const id = editingRow.id;

      if (gridRowId != null && gridRef.current?.updateRowFieldsByGridRowId) {
        gridRef.current.updateRowFieldsByGridRowId(gridRowId, { levels });
      } else {
        // Fallback before grid assigns gridRowId
        setAllRows((prev) =>
          prev.map((r) => (id && r.id === id ? { ...r, levels } : r))
        );
      }

      toast.success(
        intl.formatMessage(
          {
            id: "message.GroupHierarchy.LevelsUpdated",
            defaultMessage: "Hierarchy levels updated. Click Save to commit changes.",
          },
          { code: editingRow.hierarchyCode || "" }
        )
      );
    },
    [editingRow, intl, toast]
  );

  const handleSave = useCallback(
    async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
      try {
        const currentRows = gridRef.current?.getCurrentData?.() || allRows;

        const findCurrentRow = (r) => {
          return currentRows.find(cr => 
            (cr.id != null && cr.id === r.id) || 
            (cr.gridRowId != null && cr.gridRowId === r.gridRowId) || 
            (cr.hierarchyCode && cr.hierarchyCode === r.hierarchyCode)
          );
        };

        const normalizeRow = (row) => {
          const matched = findCurrentRow(row) || {};
          
          let rawActive = row.active;
          if (rawActive === undefined || rawActive === null || rawActive === "") {
            rawActive = matched.active;
          }
          if (rawActive === undefined || rawActive === null || rawActive === "") {
            rawActive = true;
          }
          
          let finalActive = false;
          if (rawActive === true || rawActive === 1) finalActive = true;
          else if (typeof rawActive === "string") {
            const lower = rawActive.trim().toLowerCase();
            if (["y", "yes", "true", "1", "on"].includes(lower)) finalActive = true;
          }

          return {
            ...matched,
            ...row,
            hierarchyCode: String(row.hierarchyCode || matched.hierarchyCode || "").trim().toUpperCase(),
            description: String(row.description || matched.description || "").trim(),
            active: finalActive,
            levels: Array.isArray(row.levels) ? row.levels : (Array.isArray(matched.levels) ? matched.levels : []),
          };
        };

        const isNew = (row) => row._isNew === true || row.mode === "N";

        const fromUpdatedNew = updatedRows.filter(isNew).map(normalizeRow);
        const fromUpdatedEdit = updatedRows.filter((r) => !isNew(r)).map(normalizeRow);
        const normalizedNew = [...newRows.map(normalizeRow), ...fromUpdatedNew];
        const normalizedUpdated = fromUpdatedEdit;
        const normalizedDeleted = deletedRows
          .filter((r) => !isNew(r))
          .map(normalizeRow);

        // New rows removed via delete are simply dropped (not sent as D)
        const allForDupCheck = (
          gridRef.current?.getCurrentData?.() || allRows
        ).map(normalizeRow);

        for (const row of [...normalizedNew, ...normalizedUpdated]) {
          const err = validateHierarchyRow(row, allForDupCheck);
          if (err) {
            toast.error(
              intl.formatMessage({
                id: err,
                defaultMessage:
                  err === "error.HierarchyCode.mandatory"
                    ? "Hierarchy Code is required."
                    : err === "error.HierarchyDescription.mandatory"
                      ? "Hierarchy Description is required."
                      : "Duplicate hierarchy code.",
              })
            );
            return { success: false };
          }
          const levelErr = validateLevels(row.levels);
          if (levelErr) {
            toast.error(
              intl.formatMessage({
                id: levelErr,
                defaultMessage:
                  levelErr === "error.GroupHierarchy.roleDuplicate"
                    ? "Same role cannot be used in multiple levels."
                    : "Each hierarchy needs at least one complete level (role and approver).",
              })
            );
            return { success: false };
          }
        }

        const payload = buildSavePayload({
          newRows: normalizedNew,
          updatedRows: normalizedUpdated,
          deletedRows: normalizedDeleted,
          originalByCode: originalByCodeRef.current,
        });

        if (payload.length === 0) {
          toast.info(
            intl.formatMessage({
              id: "message.GroupHierarchy.NoChanges",
              defaultMessage: "No changes to save.",
            })
          );
          return { success: true };
        }

        const response = await HAxiosService.POST(
          GroupHierarchyAPI.GroupHierarchyDetails(screenMenuId),
          payload
        );
        const result = response?.data;

        if (response?.status !== 200 || result?.success !== true) {
          if (result?.errors) {
            handleValidationErrors(intl, toast, result.errors);
          } else {
            toast.error(
              result?.message ||
              intl.formatMessage({
                id: "message.GroupHierarchy.SaveError",
                defaultMessage: "Error while saving Group Hierarchy",
              })
            );
          }
          return { success: false };
        }

        toast.success(
          result?.message ||
          intl.formatMessage({
            id: "message.GroupHierarchy.SaveSuccess",
            defaultMessage: "Group Hierarchy saved successfully",
          })
        );
        await loadData();
        return { success: true };
      } catch (err) {
        console.error(err);
        toast.error(
          intl.formatMessage({
            id: "message.GroupHierarchy.SaveError",
            defaultMessage: "Error while saving Group Hierarchy",
          })
        );
        return { success: false };
      }
    },
    [allRows, intl, loadData, toast]
  );

  return (
    <HBox className="group-hierarchy-page">
      <HBox className="group-hierarchy-header-card">
        <HBreadCrumb />
        <TitleBar
          title={intl.formatMessage({
            id: "label.GroupHierarchy.title",
            defaultMessage: "Group Hierarchy",
          })}
        />
        <HLabel
          component="p"
          value={intl.formatMessage({
            id: "label.GroupHierarchy.description",
            defaultMessage:
              "Define named approval / reporting chains that can be attached to groups, settlements and other workflows.",
          })}
          translate={false}
          colon={false}
          align="left"
          sx={{
            margin: "6px 0 0 0",
            padding: 0,
            fontSize: "12px",
            lineHeight: 1.45,
          }}
        />
      </HBox>

      <HBox className="group-hierarchy-toolbar">
        <HBox className="group-hierarchy-search-wrap">
          <HBox className="group-hierarchy-search-label">
            <HLabel
              value={intl.formatMessage({
                id: "label.GroupHierarchy.Search",
                defaultMessage: "Search",
              })}
              colon={false}
            />
          </HBox>
          <HBox className="group-hierarchy-search-field">
            <HTextField
              id="group-hierarchy-search"
              value={searchInput}
              onChange={(e) => {
                const next = e?.target?.value || "";
                setSearchInput(next);
                if (next.trim() === "") {
                  setSearchQuery("");
                }
              }}
              onKeyDown={(e) => {
                if (e?.key === "Enter") {
                  setSearchQuery(searchInput);
                }
              }}
              editable
              placeholder="label.GroupHierarchy.SearchPlaceholder"
              width="260px"
            />
          </HBox>
        </HBox>
        <HBox className="group-hierarchy-active-filter">
          <HToggle
            id="group-hierarchy-active-only"
            label="label.GroupHierarchy.ActiveOnly"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(Boolean(e?.target?.checked))}
            size="small"
          />
        </HBox>
        <HBox className="group-hierarchy-add-wrap">
          <HButton
            label="label.GroupHierarchy.AddHierarchy"
            onClick={handleAddHierarchy}
            startIcon={<AddIcon fontSize="small" />}
            size="small"
            variant="outlined"
          />
        </HBox>
      </HBox>

      <HBox className="group-hierarchy-grid-wrap">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRows}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "57vh", minHeight: "360px" }}
          pagination
          paginationPageSize={10}
          sort
          allowAdd={true}
          allowDelete
          allowUpdate
          addCheckBoxes={false}
          globalSearch={false}
          isLoading={loading}
          gridClassName="drs-list-grid"
          embeddedInSection
          onSave={handleSave}
          overlayNoRowsTemplate={
            searchQuery || activeOnly
              ? intl.formatMessage({
                id: "label.GroupHierarchy.NoMatch",
                defaultMessage: "No hierarchies match the current filter.",
              })
              : intl.formatMessage({
                id: "label.GroupHierarchy.Empty",
                defaultMessage:
                  "No hierarchies yet. Add your first approval chain.",
              })
          }
        />
      </HBox>

      <HButtonBar
        onSave={() => {
          // Ensure newly added rows are part of the change set even if untouched
          const current = gridRef.current?.getCurrentData?.() || [];
          current
            .filter((r) => r._isNew)
            .forEach((r) => {
              if (r.gridRowId != null) {
                gridRef.current.updateRowFieldsByGridRowId(r.gridRowId, {
                  hierarchyCode: r.hierarchyCode ?? "",
                });
              }
            });
          return gridRef.current?.submitChanges?.();
        }}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ close: true }}
      />

      <HierarchyDefinitionDrawer
        open={Boolean(editingRow)}
        hierarchy={editingRow}
        roleOptions={roleOptions}
        onClose={() => setEditingRow(null)}
        onSave={handleDefinitionSave}
      />
    </HBox>
  );
};

export default GroupHierarchy;
