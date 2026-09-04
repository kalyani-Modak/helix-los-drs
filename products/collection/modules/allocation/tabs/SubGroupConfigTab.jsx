import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { HAxiosService, useToast, HBox, HLabel, HToggle, SearchCommonBox, HAgGrid } from "@helix/component-library";
import { GroupConfigAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { gridSupervisorCodeDefObj } from "../../../../common/components/SearchGridDefObj.js";

const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const createRowKey = () =>
  `sg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const toEditedMode = (mode) => (mode === "N" ? "N" : "E");

const parseNumberOrEmpty = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const num = Number(value);
  return Number.isNaN(num) ? "" : num;
};

const parseNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const getRowKey = (row) => row?.id ?? row?._rowKey;

const mergeRowsById = (currentRows, { newRows, updatedRows, deletedRows }) => {
  const latestById = new Map(
    currentRows
      .map((r) => [getRowKey(r), r])
      .filter(([key]) => key !== undefined && key !== null)
  );
  deletedRows.forEach((r) => {
    const key = getRowKey(r);
    if (key !== undefined && key !== null) latestById.delete(key);
  });
  [...newRows, ...updatedRows].forEach((r) => {
    const key = getRowKey(r);
    if (key !== undefined && key !== null) latestById.set(key, r);
  });
  return Array.from(latestById.values());
};

const SubGroupConfigTab = forwardRef(function SubGroupConfigTab(
  { selectedGroupCode, parentGroupCode, groupTypeOptions = [] },
  ref
) {
  const [subGroupAllocationRows, setSubGroupAllocationRows] = useState([]);
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const gridRef = useRef(null);

  const isNested = Boolean(parentGroupCode);

  const fetchSubGroup = useCallback(
    async (groupCode) => {
      if (!groupCode || isNested) {
        setSubGroupAllocationRows([]);
        return;
      }
      try {
        const url = `${allocationBaseUrl}/fetch-sub-group/${groupCode}`;
        const res = await HAxiosService.GET(url);

        if (!res?.data?.success) {
          toast.error(
            res?.data?.message ||
            intl.formatMessage({
              id: "error.fetchSubGroupsAllocation",
              defaultMessage: "Error while fetching sub groups data.",
            })
          );
          return;
        }

        const subGroupData = res.data.data || [];
        if (Array.isArray(subGroupData)) {
          setSubGroupAllocationRows(
            subGroupData.map((item, index) => ({
              id: `${item.groupCode || item.szGroupCode}-${index}`,
              _rowKey: createRowKey(),
              groupCode: item.groupCode || item.szGroupCode || "",
              businessUnitCode: item.businessUnitCode || BUSINESS_UNIT_CODE_DEFAULT,
              groupDescription: item.groupDescription || "",
              groupType: item.groupType || item.grouptype || "",
              supervisor: item.supervisor || "",
              activeYn: item.activeYn === "Y" || item.activeYn === true,
              percentage: item.percentageCapacity || "",
              maxAllocatedTaskCount: item.maxAllocatedTaskCount || "",
              mode: "",
            }))
          );
        }
      } catch (err) {
        console.error("Fetch sub Groups failed:", err);
        toast.error(
          intl.formatMessage({
            id: "error.fetchsubGroupAllocation",
            defaultMessage: "Error while fetching sub groups data.",
          })
        );
      }
    },
    [intl, toast, isNested]
  );

  useEffect(() => {
    fetchSubGroup(selectedGroupCode);
  }, [selectedGroupCode, fetchSubGroup]);

  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;

    const rowKey = data?.id ?? data?._rowKey;
    if (!rowKey) return;

    setSubGroupAllocationRows((prev) =>
      prev.map((row) =>
        (row.id ?? row._rowKey) === rowKey
          ? {
            ...row,
            [colDef.field]: newValue,
            mode: toEditedMode(row.mode),
          }
          : row
      )
    );
  };

  const handleSubGroupAllocationSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const rows = [...newRows, ...updatedRows, ...deletedRows];
      if (rows.length === 0) {
        return { success: true };
      }

      const deletedRowKeys = new Set(
        deletedRows.map((r) => r.id ?? r._rowKey)
      );

      const invalidPercentage = rows.find((row) => {
        const rowKey = row.id ?? row._rowKey;
        if (deletedRowKeys.has(rowKey)) return false;
        const percentage = Number(row.percentage);
        return percentage > 100;
      });

      if (invalidPercentage) {
        toast.error(
          intl.formatMessage({
            id: "error.percentageExceeds100",
            defaultMessage: "Percentage cannot be greater than 100!",
          })
        );
        return { success: false };
      }

      const latestRows = mergeRowsById(subGroupAllocationRows, {
        newRows,
        updatedRows,
        deletedRows,
      });

      const totalPercentage = latestRows.reduce(
        (sum, row) => sum + (Number(row.percentage) || 0),
        0
      );

      if (totalPercentage > 100) {
        toast.warning(
          intl.formatMessage({
            id: "error.invalidPercentage",
            defaultMessage: "Enter valid percentage",
          })
        );
        return { success: false };
      }

      const payload = rows.map((row) => {
        const rowKey = row.id ?? row._rowKey;
        const mode = deletedRowKeys.has(rowKey)
          ? "D"
          : row.mode || (newRows.includes(row) ? "N" : "E");

        return {
        groupCode: row.groupCode,
        parentGroupCode: selectedGroupCode,
        businessUnitCode: row.businessUnitCode || BUSINESS_UNIT_CODE_DEFAULT,
        groupDescription: row.groupDescription || "",
        groupType: row.groupType || "",
        supervisor: row.supervisor || "",
        activeYn: row.activeYn ? "Y" : "N",
        percentageCapacity: Number(row.percentage) || 0,
        maxAllocatedTaskCount: row.maxAllocatedTaskCount,
        modifiedBy: LOGGED_IN_USER,
        mode,
      };
      });

      const response = await HAxiosService.POST(
        `${allocationBaseUrl}/update-sub-groups`,
        payload
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ||
          intl.formatMessage({
            id: "success.subGroupAllocationSaved",
            defaultMessage: "Sub group allocation saved successfully!",
          })
        );
        fetchSubGroup(selectedGroupCode);
        return { success: true };
      }

      toast.error(
        response.data?.message ||
        intl.formatMessage({
          id: "error.saveFailed",
          defaultMessage: "Failed to save sub group allocation.",
        })
      );
      return { success: false };
    } catch (err) {
      console.error("Failed to save sub group allocation:", err);
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

  useImperativeHandle(ref, () => ({
    submitChanges: () => {
      if (isNested) return Promise.resolve({ success: true });
      return gridRef.current?.submitChanges?.();
    },
    reload: () => fetchSubGroup(selectedGroupCode),
  }));

  if (isNested) {
    return (
      <div className="group-config-nesting-locked">
        <HLabel
          className="group-config-nesting-locked-title"
          value={intl.formatMessage({
            id: "label.groupAllocationMaster.nestingLocked",
            defaultMessage: "Nesting locked",
          })}
        />
        <p className="group-config-nesting-locked-body">
          {intl.formatMessage(
            {
              id: "label.groupAllocationMaster.nestingLockedHint",
              defaultMessage:
                'This group is already a sub-group of "{code}". Only one level of nesting is supported.',
            },
            { code: parentGroupCode }
          )}
        </p>
      </div>
    );
  }

  const SearchRenderer = (props) => {
    const {
      node,
      column,
      value,
      searchCode,
      selectedColumn,
      gridDefObj,
      searchBoxWidth = 140,
      searchBoxHeight = 25,
      searchBoxFontSize = 11,
    } = props;
    const isInitialized = useRef(false);

    const normalizeSearchValue = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
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

  const allocationColumns = [
    {
      headerName: intl.formatMessage({
        id: "label.subGroupAllocationMaster.groupCode",
        defaultMessage: "Group Code",
      }),
      field: "groupCode",
      flex: 0.8,
      editable: true,
      valueParser: (params) => String(params?.newValue ?? "").toUpperCase(),
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.description",
        defaultMessage: "Description",
      }),
      field: "groupDescription",
      flex: 1,
      editable: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupType",
        defaultMessage: "Group Type",
      }),
      field: "groupType",
      flex: 1,
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
      flex: 1,
      editable: false,
      cellRenderer: (p) => <SearchRenderer {...p} />,
      cellRendererParams: {
        searchCode: "SUPERVISORCD",
        selectedColumn: "collectorcode",
        gridDefObj: gridSupervisorCodeDefObj,
        searchBoxWidth: 160,
        searchBoxHeight: 30,
        searchBoxFontSize: 11,
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.active",
        defaultMessage: "Active",
      }),
      field: "activeYn",
      width: 60,
      editable: false,
      cellStyle: { display: "flex", alignItems: "center" },
      cellRenderer: (p) => (
        <HToggle
          checked={!!p.value}
          onChange={(e) => {
            const next = e.target.checked;
            p.node?.setDataValue?.("activeYn", next);
            if (p.data && p.data.mode !== "N") {
              p.data.mode = "E";
            }
            handleCellEdit({
              data: p.data,
              colDef: { field: "activeYn" },
              newValue: next,
              oldValue: p.value,
            });
          }}
        />
      ),
    },
  ];

  const getDefaultsSubGroupAllocationRow = () => ({
    _rowKey: createRowKey(),
    groupCode: "",
    businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
    groupDescription: "",
    groupType: "",
    supervisor: "",
    activeYn: true,
    percentage: "",
    maxAllocatedTaskCount: "",
    mode: "N",
  });

  return (
    <HBox className="group-config-section">
      <div className="group-config-allocation-header">
        <div>
          <h3 className="group-config-section-title">
            {intl.formatMessage({
              id: "label.subGroupAllocationMaster.subGroupConfig",
              defaultMessage: "Sub Group Configuration",
            })}
          </h3>
          <p className="group-config-allocation-hint">
            {intl.formatMessage(
              {
                id: "label.groupAllocationMaster.subGroupHint",
                defaultMessage:
                  "One level of sub-groups is allowed under this parent. {count} configured.",
              },
              { count: subGroupAllocationRows.length }
            )}
          </p>
        </div>
      </div>

      <HAgGrid
        ref={gridRef}
        rowData={subGroupAllocationRows}
        setRowData={setSubGroupAllocationRows}
        columnDefs={allocationColumns}
        gridStyle={{ width: "100%", height: "320px" }}
        pagination
        paginationPageSize={10}
        allowAdd
        allowDelete
        allowUpdate
        onCellValueChanged={handleCellEdit}
        defaultNewRowData={getDefaultsSubGroupAllocationRow}
        onSave={handleSubGroupAllocationSave}
      />
    </HBox>
  );
});

SubGroupConfigTab.propTypes = {
  selectedGroupCode: PropTypes.string,
  parentGroupCode: PropTypes.string,
};

SubGroupConfigTab.defaultProps = {
  selectedGroupCode: null,
  parentGroupCode: "",
};

export default SubGroupConfigTab;
