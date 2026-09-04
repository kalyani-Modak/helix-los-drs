import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast, HAxiosService, HBox, HButtonBar, SearchCommonBox, HAgGrid } from "@helix/component-library";

import { GroupConfigAPI } from "./apiEndpoints.jsx";
import { useIntl } from "react-intl";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { gridSupervisorCodeDefObj } from "../../../common/components/SearchGridDefObj";

const MODULE_CODE_DEFAULT = "COL";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";



/* ================= CELL RENDERERS (Moved outside component) ================= */
const ExceptionGroupCellRenderer = ({ value, node, data }) => (
  <input
    type="checkbox"
    checked={!!value}
    onChange={() => {
      node.setDataValue("szexceptiongroup", !value);
      data.szexceptiongroup = !value;
      if (data.mode !== "N") data.mode = "E";
    }}
    style={{ cursor: "pointer" }}
  />
);

ExceptionGroupCellRenderer.propTypes = {
  value: PropTypes.bool,
  node: PropTypes.shape({
    setDataValue: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    szexceptiongroup: PropTypes.bool,
    mode: PropTypes.string,
  }).isRequired,
};

const ActiveCellRenderer = ({ value, node, data }) => (
  <input
    type="checkbox"
    checked={!!value}
    onChange={() => {
      node.setDataValue("activeYn", !value);
      data.activeYn = !value;
      if (data.mode !== "N") data.mode = "E";
    }}
    style={{ cursor: "pointer" }}
  />
);

ActiveCellRenderer.propTypes = {
  value: PropTypes.bool,
  node: PropTypes.shape({
    setDataValue: PropTypes.func.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    activeYn: PropTypes.bool,
    mode: PropTypes.string,
  }).isRequired,
};


const GroupConfiguration = ({ onGroupCodeClick }) => {
  const [groupConfigRows, setGroupConfigRows] = useState([]);
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [allocationTypeOptions, setAllocationTypeOptions] = useState([]);
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const ALLOCATION_BASE_URL = GroupConfigAPI.Allocation(screenMenuId);

  //search render  for supervisor and hierarchy code
  const SearchRenderer = (props) => {
    const {
      value,
      node,
      column,
      searchCode,
      selectedColumn,
      gridDefObj,
      gridWidth = 450,
      gridHeight = 300,
      gridNoOfRowsPerPage = 5,
      searchBoxWidth = 120,
      searchBoxHeight = 25,
      searchBoxFontSize = 11,
    } = props;
    const isInitialized = useRef(false);

    const normalizeSearchValue = useCallback((raw) => {
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
    }, []);

    const handleSetValue = useCallback((dataValue) => {
      console.log("SearchCommonBox setSelectedValue called with:", dataValue);
      if (!isInitialized.current) {
        isInitialized.current = true;
        return; // ignore the init call, keep existing value
      }
      // Now, any call with falsy value means the user cleared the field
      const newValue = normalizeSearchValue(dataValue);
      node.setDataValue(column.getColId(), newValue);
    }, [node, column, normalizeSearchValue]);


    return (
      <SearchCommonBox
        apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
        searchCode={searchCode}
        selectedValue={normalizeSearchValue(value)}
        selectedColumn={selectedColumn}
        gridDefObj={gridDefObj}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
        gridNoOfRowsPerPage={gridNoOfRowsPerPage}
        searchBoxWidth={searchBoxWidth}
        searchBoxHeight={searchBoxHeight}
        searchBoxFontSize={searchBoxFontSize}
        error={false}
        setSelectedValue={handleSetValue}
      />
    );
  };

  /* ================= FETCH GROUP CONFIGURATION ================= */
  useEffect(() => {
    fetchGroupConfig();
  }, []);

  const fetchGroupConfig = async () => {
    try {
      const res = await HAxiosService.GET(ALLOCATION_BASE_URL);

      console.log("📥 Full API Response:", res.data);

      // ✅ Fixed: Use optional chaining instead of && operator
      if (!res.data?.success) {
        console.warn("API returned error or invalid structure", res.data);
        toast.error(
          res.data?.message ||
          intl.formatMessage({
            id: "error.fetchGroupConfig",
            defaultMessage: "Error while fetching Group Configuration.",
          })
        );
        return;
      }

      // Data is in res.data.data
      const responseData = res.data.data;

      if (!responseData) {
        console.warn("No data in response");
        return;
      }

      // Handle lstGroupConfig (Group Types)
      if (Array.isArray(responseData.lstGroupConfig)) {
        const groupTypes = responseData.lstGroupConfig.map((item) => ({
          label: item.szDesc,
          value: item.szCondition,
        }));
        console.log("✅ Group Type Options:", groupTypes);
        setGroupTypeOptions(groupTypes);
      }

      // Handle lstAllocationType (Allocation Types)
      if (Array.isArray(responseData.allocationTypes)) {
        const allocationTypes = responseData.allocationTypes.map((item) => ({
          label: item.szDesc,
          value: item.szCondition,
        }));
        console.log("✅ Allocation Type Options:", allocationTypes);
        setAllocationTypeOptions(allocationTypes);
      }

      // Handle objGroupConfigDto
      if (Array.isArray(responseData.objGroupConfigDto)) {
        const mapped = responseData.objGroupConfigDto.map((item, index) => {
          console.log(`🔍 Backend item ${index}:`, item);

          return {
            id: item.groupCode || `row-${index}`,
            groupCode: item.groupCode || "",
            groupDescription: item.groupDescription || "",
            activeYn: item.activeYn === "Y",
            hierarchyCode: item.hierarchyCode || "",
            grouptype: item.groupType || "",
            supervisor: item.supervisor || "",
            exceptiongroup: item.exceptionGroup === "Y",
            allocationtype: item.allocationType || "",
            parentGroupCode: item.parentGroupCode || "",
            parentYn: item.parentYn === "Y",
            mode: "",
          };
        });

        console.log("✅ Mapped Group Config rows:", mapped);
        setGroupConfigRows(mapped);
      }
    } catch (err) {
      console.error("❌ Fetch Group Config failed:", err);
      toast.error(
        intl.formatMessage({
          id: "error.fetchGroupConfig",
          defaultMessage: "Error while fetching Group Configuration.",
        })
      );
    }
  };

  /* ================= CELL EDIT HANDLER ================= */
  const handleCellEdit = (params) => {
    const { data, colDef, newValue, oldValue } = params;
    if (newValue === oldValue) return;

    setGroupConfigRows((prev) =>
      prev.map((row) =>
        row.id === data.id
          ? {
            ...row,
            [colDef.field]: newValue,
            mode: row.mode !== "N" ? "E" : row.mode,
          }
          : row
      )
    );
  };

  /* ================= SAVE HANDLER ================= */
  const handleGroupSave = async ({ newRows, updatedRows, deletedRows }) => {
    try {
      const rows = [...newRows, ...updatedRows, ...deletedRows];
      console.log("row == ", rows);
      const payload = rows.map((row) => ({
        moduleCode: MODULE_CODE_DEFAULT,
        businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
        groupCode: row.groupCode?.trim(),
        groupDescription: row.groupDescription?.trim() || "",
        groupType: row.grouptype || "",
        supervisor: row.supervisor?.trim() || null,
        allocationType: row.allocationtype || "",
        exceptionGroup: row.exceptiongroup ? "Y" : "N",
        activeYn: row.activeYn ? "Y" : "N",
        hierarchyCode: row.hierarchyCode || "",
        mode: row.mode || "E",
        user: LOGGED_IN_USER,
        parentGroupCode: row.parentGroupCode?.trim() || null,
        parentYn: row.parentYn ? "Y" : "N",
      }));

      console.log("💾 Saving payload:", payload);

      const response = await HAxiosService.POST(ALLOCATION_BASE_URL, payload);

      // ✅ Fixed: Use optional chaining instead of && operator
      if (response.data?.success) {
        toast.success(
          response.data.message ||
          intl.formatMessage({
            id: "success.groupConfigSaved",
            defaultMessage: "Group configuration saved successfully!",
          })
        );
        fetchGroupConfig();
        return { success: true };
      } else {
        toast.error(
          response.data?.message ||
          intl.formatMessage({
            id: "error.groupConfigSaveFailed",
            defaultMessage: "Failed to save group configuration.",
          })
        );
        return { success: false };
      }
    } catch (err) {
      console.error("❌ Failed to save data:", err);
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

  /* ================= HANDLE GROUP CODE CLICK ================= */
  const handleGroupCodeClickInternal = useCallback(
    (params) => {
      const { groupCode, parentYn } = params.data;

      onGroupCodeClick?.({
        groupCode,
        parentYn,
      });
    },
    [onGroupCodeClick]
  );
  /* ================= GROUP CONFIGURATION COLUMNS ================= */
  const groupConfigColumns = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 40,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupCode",
        defaultMessage: "Group Code",
      }),
      field: "groupCode",
      width: 120,
      editable: (params) => params.data.mode === "N",
      required: true,
      filter: false,
      cellStyle: {
        color: "#1976d2",
        textDecoration: "underline",
        cursor: "pointer",
        fontWeight: "500",
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.description",
        defaultMessage: "Description",
      }),
      field: "groupDescription",
      editable: true,
      required: true,
      width: 140,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.supervisor",
        defaultMessage: "Supervisor",
      }),
      field: "supervisor",
      width: 200,
      editable: false,
      required: true,
      filter: false,
      cellRenderer: SearchRenderer,
      cellRendererParams: {
        searchCode: "SUPERVISORCD",
        selectedColumn: "collectorcode",
        gridDefObj: gridSupervisorCodeDefObj,
        searchBoxWidth: 150,
        searchBoxHeight: 27,
        searchBoxFontSize: 11,
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.parentGroupCode",
        defaultMessage: "Parent Group Code",
      }),
      field: "parentGroupCode",
      width: 140,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.parentYn",
        defaultMessage: "Parent Yn",
      }),
      field: "parentYn",
      width: 100,
      editable: false,
      filter: false,
      cellRenderer: "agCheckboxCellRenderer"
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.hierarchyCode",
        defaultMessage: "Hierarchy Code"
      }),
      field: "hierarchyCode",
      width: 140,
      editable: true,
      filter: false,
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.groupType",
        defaultMessage: "Group Type",
      }),
      field: "grouptype",
      width: 140,
      editable: true,
      cellEditor: "agSelectCellEditor",
      filter: false,
      cellEditorParams: {
        values: groupTypeOptions.map((o) => o.value),
      },
      valueFormatter: (params) => {
        const opt = groupTypeOptions.find((o) => o.value === params.value);
        return opt ? opt.label : params.value;
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.allocationType",
        defaultMessage: "Allocation Type",
      }),
      field: "allocationtype",
      width: 150,
      editable: true,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: allocationTypeOptions.map((option) => option.value),
      },
      valueFormatter: (params) => {
        const option = allocationTypeOptions.find((opt) => opt.value === params.value);
        return option ? option.label : params.value;
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.exceptionGroup",
        defaultMessage: "Exception Group",
      }),
      field: "exceptiongroup",
      width: 140,
      editable: false,
      filter: false,
      cellRenderer: ExceptionGroupCellRenderer, // ✅ Fixed: Use external component
    },
    {
      headerName: intl.formatMessage({
        id: "label.groupAllocationMaster.active",
        defaultMessage: "Active",
      }),
      field: "activeYn",
      width: 75,
      editable: false,
      filter: false,
      cellRenderer: ActiveCellRenderer, // ✅ Fixed: Use external component
    },
  ];

  const gridStyle = { width: "94%", height: "calc(100vh - 220px)", marginTop: "10px", margin: "10px auto 0 auto" };

  const onGridReady = (params) => {
    console.log("Grid is ready");
  };

  const getDefaultGroupConfigRow = () => ({
    moduleCode: MODULE_CODE_DEFAULT,
    businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
    groupCode: "",
    groupDescription: "",
    hierarchyCode: "",
    grouptype: "",
    supervisor: "",
    exceptiongroup: false,
    allocationtype: "",
    active: true,
    mode: "N",
    parentGroupCode: "",
    parentYn: false,
  });

  return (
    <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <HAgGrid
        ref={gridRef}
        rowData={groupConfigRows}
        setRowData={setGroupConfigRows}
        columnDefs={groupConfigColumns}
        gridStyle={gridStyle}
        pagination
        paginationPageSize={10}
        allowAdd
        allowDelete
        allowUpdate
        onCellValueChanged={handleCellEdit}
        onSave={handleGroupSave}
        onGridReady={onGridReady}
        defaultNewRowData={getDefaultGroupConfigRow}
        onClickMapping={{ groupCode: handleGroupCodeClickInternal }}
      />
      <HButtonBar
        onSave={() => gridRef.current?.submitChanges?.()}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, close: true }}
      />
    </HBox>
  );
};

// ✅ Fixed: Added PropTypes validation for onGroupCodeClick
GroupConfiguration.propTypes = {
  onGroupCodeClick: PropTypes.func,
};

export default GroupConfiguration;
