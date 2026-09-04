import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import { HAxiosService, useToast, HBox, SearchCommonBox, HAgGrid } from "@helix/component-library";
import { GroupConfigAPI } from "../apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { gridUserCodeDefObj } from "../../../../common/components/SearchGridDefObj";

const MODULE_CODE_DEFAULT = "COL";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";

const toEditedMode = (mode) => (mode === "N" ? "N" : "E");

const parseNumberOrEmpty = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const num = Number(value);
  return Number.isNaN(num) ? "" : num;
};

const mergeRowsById = (currentRows, { newRows, updatedRows, deletedRows }) => {
  const latestById = new Map(currentRows.map((r) => [r.id, r]));
  deletedRows.forEach((r) => latestById.delete(r.id));
  [...newRows, ...updatedRows].forEach((r) => latestById.set(r.id, r));
  return Array.from(latestById.values());
};

const AllocationConfigTab = forwardRef(function AllocationConfigTab(
  { selectedGroupCode },
  ref
) {
  const [allocationRows, setAllocationRows] = useState([]);
  const intl = useIntl();
  const toast = useToast();
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
  const groupUsersBaseUrl = `${allocationBaseUrl.slice(
    0,
    allocationBaseUrl.lastIndexOf("/")
  )}/group-users/${screenMenuId}`;
  const gridRef = useRef(null);
  const searchInitKeysRef = useRef(new Set());

  const getUsersByGroupUrl = useCallback(
    (groupCode) => `${groupUsersBaseUrl}/group/${groupCode}`,
    [groupUsersBaseUrl]
  );

  const getSaveUsersUrl = useCallback(
    () => `${groupUsersBaseUrl}/save`,
    [groupUsersBaseUrl]
  );

  const UserCodeSearchRenderer = (props) => {
    const { value, node } = props;
    const isInitialized = useRef(false);

    const normalizeSearchValue = (raw) => {
      if (raw == null) return "";
      if (typeof raw === "string") return raw;
      if (typeof raw === "number" || typeof raw === "boolean") {
        return String(raw);
      }
      if (typeof raw === "object") {
        if (typeof raw.szcollectorcode === "string") return raw.szcollectorcode;
        if (typeof raw.collectorcode === "string") return raw.collectorcode;
        if (typeof raw.szcollectorname === "string") return raw.szcollectorname;
        if (typeof raw.usercode === "string") return raw.usercode;
        if (typeof raw.value === "string") return raw.value;
        if (typeof raw.code === "string") return raw.code;
        return "";
      }
      return "";
    };

    const handleSetValue = (dataValue) => {
      if (!isInitialized.current) {
        isInitialized.current = true;
        return;
      }
      const newValue = normalizeSearchValue(dataValue);
      node.setDataValue("userCode", newValue);
      if (node.data?.mode !== "N") node.data.mode = "E";
    };

    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
        searchCode="USERCD"
        setSelectedValue={handleSetValue}
        selectedValue={normalizeSearchValue(value)}
        selectedColumn="collectorcode"
        gridDefObj={gridUserCodeDefObj}
        gridWidth={450}
        gridHeight={300}
        gridNoOfRowsPerPage={5}
        searchBoxWidth={140}
        searchBoxHeight={30}
        searchBoxFontSize={11}
        error={false}
      />
    );
  };

  const fetchAllocationsForGroup = useCallback(
    async (groupCode) => {
      if (!groupCode) {
        setAllocationRows([]);
        return;
      }
      try {
        const url = getUsersByGroupUrl(groupCode);
        const res = await HAxiosService.GET(url);

        if (!res?.data?.success) {
          toast.error(
            res?.data?.message ||
            intl.formatMessage({
              id: "error.fetchAllocation",
              defaultMessage: "Error while fetching Allocation data.",
            })
          );
          return;
        }

        const userData = res.data.data || [];
        if (Array.isArray(userData)) {
          setAllocationRows(
            userData.map((item, index) => ({
              id: `${item.groupCode || item.szGroupCode}-${item.userCode || item.szUserCode}-${index}`,
              groupCode: item.groupCode || item.szGroupCode || groupCode,
              userCode: item.userCode || item.szUserCode || item.userName || "",
              percentage: item.percentageCapacity || item.percentage || "",
              mode: "",
            }))
          );
        }
      } catch (err) {
        console.error("Fetch Allocation failed:", err);
        toast.error(
          intl.formatMessage({
            id: "error.fetchAllocation",
            defaultMessage: "Error while fetching Allocation data.",
          })
        );
      }
    },
    [intl, toast, getUsersByGroupUrl]
  );

  useEffect(() => {
    fetchAllocationsForGroup(selectedGroupCode);
  }, [selectedGroupCode, fetchAllocationsForGroup]);

  const totalPercentage = useMemo(
    () =>
      allocationRows.reduce(
        (sum, row) => sum + (Number(row.percentage) || 0),
        0
      ),
    [allocationRows]
  );

  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;

    setAllocationRows((prev) =>
      prev.map((row) =>
        row.id === data.id
          ? {
            ...row,
            [colDef.field]: newValue,
            mode: toEditedMode(row.mode),
          }
          : row
      )
    );
  };

  const handleAllocationSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  }) => {
    try {
      const rows = [...newRows, ...updatedRows, ...deletedRows];
      if (rows.length === 0) {
        return { success: true };
      }

      const deletedRowIds = new Set(deletedRows.map((r) => r.id));

      const invalidPercentage = rows.find((row) => {
        if (deletedRowIds.has(row.id)) return false;
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

      const latest = mergeRowsById(allocationRows, {
        newRows,
        updatedRows,
        deletedRows,
      });
      const total = latest.reduce(
        (sum, row) => sum + (Number(row.percentage) || 0),
        0
      );

      if (total > 100) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.totalPercentageExceeds100",
              defaultMessage:
                "Total percentage cannot exceed 100%! Current total: {total}%",
            },
            { total: total.toFixed(2) }
          )
        );
        return { success: false };
      }

      const payload = rows.map((row) => {
        const mode = deletedRowIds.has(row.id)
          ? "D"
          : row.mode || (newRows.includes(row) ? "N" : "E");

        return {
          moduleCode: MODULE_CODE_DEFAULT,
          businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
          groupCode: row.groupCode || selectedGroupCode,
          userCode: row.userCode || "",
          percentageCapacity: Number(row.percentage) || 0,
          createdBy: LOGGED_IN_USER,
          modifiedBy: LOGGED_IN_USER,
          mode,
        };
      });

      const response = await HAxiosService.POST(
        getSaveUsersUrl(),
        payload
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ||
          intl.formatMessage({
            id: "success.allocationSaved",
            defaultMessage: "Allocation saved successfully!",
          })
        );
        fetchAllocationsForGroup(selectedGroupCode);
        return { success: true };
      }

      toast.error(
        response.data?.message ||
        intl.formatMessage({
          id: "error.saveFailed",
          defaultMessage: "Failed to save allocation.",
        })
      );
      return { success: false };
    } catch (err) {
      console.error("Failed to save allocation:", err);
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
    submitChanges: () => gridRef.current?.submitChanges?.(),
    reload: () => fetchAllocationsForGroup(selectedGroupCode),
  }));

  const allocationColumns = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupCode",
        defaultMessage: "Group Code",
      }),
      field: "groupCode",
      editable: false,
      hide: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.user",
        defaultMessage: "User",
      }),
      field: "userCode",
      editable: false,
      flex: 1,
      required: true,
      cellRenderer: (p) => <UserCodeSearchRenderer {...p} />,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.percentage",
        defaultMessage: "Percentage",
      }),
      field: "percentage",
      editable: true,
      flex: 1,
      required: true,
      cellEditor: "agTextCellEditor",
      valueParser: (params) => {
        if (!params) return "";
        return parseNumberOrEmpty(params.newValue);
      },
    },
  ];

  const getDefaultAllocationRow = () => ({
    moduleCode: MODULE_CODE_DEFAULT,
    businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
    groupCode: selectedGroupCode,
    userCode: "",
    percentage: "",
    mode: "N",
  });

  return (
    <HBox className="group-config-section">
      <HBox className="group-config-allocation-header">
        <HBox>
          <h3 className="group-config-allocation-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 700 }}>
              {intl.formatMessage({
                id: "label.groupAllocationMaster.groupCodePrefix",
                defaultMessage: "Group Code",
              })}
            </span>
            <span style={{ fontWeight: 700 }}>
              {selectedGroupCode || "—"}
            </span>
          </h3>
          <p className="group-config-allocation-hint">
            {intl.formatMessage({
              id: "label.groupAllocationMaster.allocationHint",
              defaultMessage:
                "Distribute accounts across users. Total must not exceed 100%.",
            })}
          </p>
        </HBox>
      </HBox>

      <HAgGrid
        ref={gridRef}
        rowData={allocationRows}
        setRowData={setAllocationRows}
        columnDefs={allocationColumns}
        gridStyle={{ width: "100%", height: "320px" }}
        pagination
        paginationPageSize={10}
        allowAdd
        allowDelete
        allowUpdate
        onCellValueChanged={handleCellEdit}
        defaultNewRowData={getDefaultAllocationRow}
        onSave={handleAllocationSave}
      />

      <HBox
        className={`group-config-allocation-total${totalPercentage === 100 ? " is-ok" : " is-warn"
          }`}
      >
        {intl.formatMessage(
          {
            id: "label.groupAllocationMaster.allocationTotal",
            defaultMessage: "Total: {total}%",
          },
          { total: totalPercentage }
        )}
      </HBox>
    </HBox>
  );
});

AllocationConfigTab.propTypes = {
  selectedGroupCode: PropTypes.string,
};

AllocationConfigTab.defaultProps = {
  selectedGroupCode: null,
};

export default AllocationConfigTab;
