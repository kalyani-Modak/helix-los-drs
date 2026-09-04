import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast, HAxiosService, HBox, HLabel, TitleBar, HButtonBar, SearchCommonBox, HAgGrid } from "@helix/component-library";

import { GroupConfigAPI } from "./apiEndpoints";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { gridGroupCodeDefObj, gridUserCodeDefObj } from "../../../common/components/SearchGridDefObj";

const gridGroupCodeDefObj = [
  {
    gridMappingName: "groupcode",
    gridHeaderDesc: "Group Code",
    gridHeaderId: "label.search.group.code",
    gridColumnWidth: 150,
    gridColumnHeight: 20,
  },
  {
    gridMappingName: "groupdescription",
    gridHeaderDesc: "Group Name",
    gridHeaderId: "label.search.group.name",
    gridColumnWidth: 250,
    gridColumnHeight: 20,
  },
];

/* ================= CONSTANTS ================= */
const MODULE_CODE_DEFAULT = "COL";
const BUSINESS_UNIT_CODE_DEFAULT = "EXQ";
const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";

const AllocationConfiguration = ({ selectedGroupCode = null }) => {
    const [allocationRows, setAllocationRows] = useState([]);
    const intl = useIntl();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const screenMenuId = location?.state?.menuId;
    const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
    const groupUsersBaseUrl = `${allocationBaseUrl.slice(
        0,
        allocationBaseUrl.lastIndexOf("/")
    )}/group-users/${screenMenuId}`;
    const gridRef = useRef(null);
    const location = useLocation();
    const screenMenuId =  location.state.menuId;

    const getFetchAllocationUrl = useCallback(
        () => `${groupUsersBaseUrl}/fetch`,
        [groupUsersBaseUrl]
    );

    const getUsersByGroupUrl = useCallback(
        (groupCode) => `${groupUsersBaseUrl}/group/${groupCode}`,
        [groupUsersBaseUrl]
    );

    const getSaveUsersUrl = useCallback(
        () => `${groupUsersBaseUrl}/save`,
        [groupUsersBaseUrl]
    );

    /* ================= User SearchCommonBox ================= */
    const UserCodeSearchRenderer = (props) => {
        const { value, node } = props;
    
        return (
          <SearchCommonBox
            apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
            searchCode="USERCD"
            setSelectedValue={(dataValue) =>
              node.setDataValue("userCode", dataValue || value)
            }
    
            selectedValue={value}
            selectedColumn="collectorcode"
            gridDefObj={gridUserCodeDefObj}
            gridWidth={450}
            gridHeight={300}
            gridNoOfRowsPerPage={5}
            searchBoxWidth={120}
            searchBoxHeight={25}
            searchBoxFontSize={11}
            error={false}
          />
        );
      };

    /* ================= FETCH ALLOCATIONS ================= */
    useEffect(() => {
        fetchAllocationsForGroup(selectedGroupCode);
    }, [selectedGroupCode]);

    const fetchAllocationsForGroup = useCallback(async (groupCode) => {
        try {
            console.log("🔍 Fetching allocations for group:", groupCode || "ALL");

            const url = groupCode
                ? getUsersByGroupUrl(groupCode)
                : getFetchAllocationUrl();

            const res = await HAxiosService.GET(url);

            // NEW FORMAT: Check for ApiResponse structure
            if (!res?.data?.success) {
                console.warn("API returned error or invalid structure", res?.data);
                toast.error(
                    res?.data?.message ||
                    intl.formatMessage({
                        id: "error.fetchAllocation",
                        defaultMessage: "Error while fetching Allocation data."
                    })
                );
                return;
            }

            // NEW: Data is directly in res.data.data
            const userData = res.data.data || [];

            if (Array.isArray(userData)) {
                setAllocationRows(
                    userData.map((item, index) => ({
                        id: `${item.groupCode || item.szGroupCode}-${item.userCode || item.szUserCode}-${index}`,
                        groupCode: item.groupCode || item.szGroupCode || "",
                        userCode: item.userCode || item.szUserCode || item.userName || "",
                        percentage: item.percentageCapacity || item.percentage || "",
                        cActiveYn: item.cActiveYn === "Y" || item.cActiveYn === true,
                        mode: "",
                    }))
                );

                console.log(`✅ Loaded ${userData.length} allocations for group: ${groupCode || 'ALL'}`);
            }
        } catch (err) {
            console.error("❌ Fetch Allocation failed:", err);
            toast.error(intl.formatMessage({
                id: "error.fetchAllocation",
                defaultMessage: "Error while fetching Allocation data."
            }));
        }
    }, [intl, toast, getUsersByGroupUrl, getFetchAllocationUrl]);

    /* ================= CELL EDIT HANDLER ================= */
    const handleCellEdit = (params) => {
        const { data, colDef, newValue, oldValue } = params;
        if (newValue === oldValue) return;

        setAllocationRows((prev) =>
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
    const handleAllocationSave = async ({ newRows, updatedRows, deletedRows }) => {
        try {
            const rows = [...newRows, ...updatedRows, ...deletedRows];

            // ✅ VALIDATE: Check if any percentage is greater than 100
            const invalidPercentage = rows.find(row => {
                const percentage = Number(row.percentage);
                return percentage > 100;
            });

            if (invalidPercentage) {
                toast.error(intl.formatMessage({
                    id: "error.percentageExceeds100",
                    defaultMessage: "Percentage cannot be greater than 100!"
                }));
                return { success: false };
            }

            // ✅ VALIDATE: Check total percentage per group doesn't exceed 100
            const groupTotals = {};

            // First, get all existing allocations for affected groups
            const affectedGroups = [...new Set(rows.map(row => row.groupCode))];

            for (const groupCode of affectedGroups) {
                if (!groupCode) continue;

                // Fetch all allocations for this group
                const url = getUsersByGroupUrl(groupCode);
                const res = await HAxiosService.GET(url);

                // NEW FORMAT: Get data from res.data.data
                const userData = res.data?.data || [];

                // Calculate total from existing data
                let total = 0;
                userData.forEach(item => {
                    const percentage = Number(item.percentageCapacity || item.percentage || 0);
                    total += percentage;
                });

                // Subtract old values and add new values for rows being updated
                rows.forEach(row => {
                    if (row.groupCode === groupCode) {
                        // Find the original row
                        const originalRow = allocationRows.find(r => r.id === row.id);
                        if (originalRow && row.mode === "E") {
                            // Subtract old percentage, add new one
                            total -= Number(originalRow.percentage || 0);
                        }
                        total += Number(row.percentage || 0);
                    }
                });

                groupTotals[groupCode] = total;
            }

            // Check if any group's total exceeds 100%
            const exceededGroup = Object.entries(groupTotals).find(([group, total]) => total > 100);

            if (exceededGroup) {
                toast.error(intl.formatMessage({
                    id: "error.totalPercentageExceeds100",
                    defaultMessage: `Total percentage for group ${exceededGroup[0]} cannot exceed 100%! Current total: ${exceededGroup[1].toFixed(2)}%`
                }));
                return { success: false };
            }

            const payload = rows.map((row) => ({
                moduleCode: MODULE_CODE_DEFAULT,
                businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
                groupCode: row.groupCode || selectedGroupCode,
                userCode: row.userCode || "",
                percentageCapacity: Number(row.percentage) || 0,
                activeYn: row.cActiveYn ? "Y" : "N",
                createdBy: LOGGED_IN_USER,
                modifiedBy: LOGGED_IN_USER,
                mode: row.mode || (newRows.includes(row) ? "N" : "E"),
            }));

            const response = await HAxiosService.POST(getSaveUsersUrl(), payload);
            
            // NEW FORMAT: Check response.data.success
            if (response.data && response.data.success) {
                toast.success(response.data.message || intl.formatMessage({
                    id: "success.allocationSaved",
                    defaultMessage: "Allocation saved successfully!"
                }));
                fetchAllocationsForGroup(selectedGroupCode);
                return { success: true };
            } else {
                toast.error(response.data?.message || intl.formatMessage({
                    id: "error.saveFailed",
                    defaultMessage: "Failed to save allocation."
                }));
                return { success: false };
            }
        } catch (err) {
            console.error("❌ Failed to save data:", err);
            toast.error(err.response?.data?.message || intl.formatMessage({
                id: "error.saveData",
                defaultMessage: "Error while saving data."
            }));
            return { success: false };
        }
    };


    /* ================= ALLOCATION COLUMNS ================= */
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
                defaultMessage: "Group Code"
            }),
            field: "groupCode",
            editable: true,
            hide: true,
        },
        {
            headerName: intl.formatMessage({
                id: "label.groupAllocationMaster.user",
                defaultMessage: "User"
            }),
            field: "userCode",
            editable: false,
            width: 205,
            required: true,
            cellRenderer: UserCodeSearchRenderer
        },
         {
            headerName: intl.formatMessage({
                id: "label.groupAllocationMaster.percentage",
                defaultMessage: "Percentage"
            }),
            field: "percentage",
            editable: true,
            width: 200,
            cellEditor: "agTextCellEditor",
            valueParser: (params) => {
                // Add null check for params
                if (!params) return "";
                
                const value = params.newValue;
                if (value === "" || value === null || value === undefined) {
                    return "";
                }
                const num = Number(value);
                return isNaN(num) ? "" : num;
            },
            valueFormatter: (params) => {
                // Add null check for params
                if (!params) return "";
                
                if (params.value === "" || params.value === null || params.value === undefined) {
                    return "";
                }
                return params.value;
            },
            cellStyle: (params) => {
                // FIX: Add null/undefined check for params
                if (!params || params.value === undefined || params.value === null) {
                    return null;
                }
                
                // Check if value is not empty string
                if (params.value !== "" && params.value !== undefined && params.value !== null) {
                    // Convert to number and validate
                    const numValue = Number(params.value);
                    
                    // Check if it's a valid number and within range
                    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                        return { backgroundColor: '#ffcccc' };
                    }
                }
                return null;
            },
            required: true, // ✅ This field is required
        },
    ];

    const gridStyle = {
        width: "45%",
        height: "calc(80vh - 220px)",
        marginTop: "10px",
        margin: "10px auto 0 auto"  
    };

    const getDefaultAllocationRow = () => ({
        moduleCode: MODULE_CODE_DEFAULT,
        businessUnitCode: BUSINESS_UNIT_CODE_DEFAULT,
        groupCode: selectedGroupCode,
        userCode: "",
        percentage: "",
        cActiveYn: true,
        mode: "N",
    });

    return (
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0 ,  alignItems: "center",   }}>
            <HBox sx={{ height: 8 }} />
            <TitleBar
                title={intl.formatMessage({
                    id: "label.groupAllocationMaster.allocationConfig",
                    defaultMessage: "Group Code : " + selectedGroupCode
                })}
                width="527px"
                backgroundColor="#eaf2ff"
            />
            <HAgGrid
            ref={gridRef}
            rowData={allocationRows}
            setRowData={setAllocationRows}
            columnDefs={allocationColumns}
            gridStyle={gridStyle}
            pagination
            paginationPageSize={10}
            allowAdd
            allowDelete
            allowUpdate
            onCellValueChanged={handleCellEdit}
            defaultNewRowData={getDefaultAllocationRow}
            onSave={handleAllocationSave}
        />
            <HButtonBar
                onSave={() => gridRef.current?.submitChanges?.()}
                onClose={() => navigate("/homelayout/welcomepage")}
                disableToast={{ save: true, close: true }}
            />
        </HBox>
    );
};

AllocationConfiguration.propTypes = {
    selectedGroupCode: PropTypes.string,
};

export default AllocationConfiguration;
