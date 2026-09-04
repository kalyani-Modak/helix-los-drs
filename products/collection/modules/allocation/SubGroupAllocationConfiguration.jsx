import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast, HAxiosService, HBox, HLabel, TitleBar, HButtonBar, SearchCommonBox, HAgGrid } from "@helix/component-library";

import { GroupConfigAPI } from "./apiEndpoints";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";

const LOGGED_IN_USER = sessionStorage.getItem("LOGGED_IN_USER") || "SYSTEM";

const SubGroupAllocationConfiguration = ({ selectedGroupCode = null }) => {
    const [subGroupAllocationRows, setSubGroupAllocationRows] = useState([]);
    const intl = useIntl();
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const screenMenuId = location?.state?.menuId;
    const allocationBaseUrl = GroupConfigAPI.Allocation(screenMenuId);
    const gridRef = useRef(null);
    const location = useLocation();
    const screenMenuId =  location.state.menuId;


    /* ================= FETCH SUB GROUPS ================= */
    useEffect(() => {
        fetchSubGroup(selectedGroupCode);
    }, [selectedGroupCode]);

    const fetchSubGroup = useCallback(async (groupCode) => {
        try {
            console.log("Fetching sub groups form parent group code:", groupCode);

            const url = `${allocationBaseUrl}/fetch-sub-group/${groupCode}`;

            const res = await HAxiosService.GET(url);

            // NEW FORMAT: Check for ApiResponse structure
            if (!res?.data?.success) {
                console.warn("API returned error or invalid structure", res?.data);
                toast.error(
                    res?.data?.message ||
                    intl.formatMessage({
                        id: "error.fetchSubGroupsAllocation",
                        defaultMessage: "Error while fetching sub groups data."
                    })
                );
                return;
            }

            // NEW: Data is directly in res.data.data
            const subGroupData = res.data.data || [];

            if (Array.isArray(subGroupData)) {
                setSubGroupAllocationRows(
                    subGroupData.map((item, index) => ({
                        id: `${item.groupCode || item.szGroupCode}-${index}`,
                        groupCode: item.groupCode || item.szGroupCode || "",
                        percentage: item.percentageCapacity || "",
                        maxAllocatedTaskCount: item.maxAllocatedTaskCount || "",
                        mode: "",
                    }))
                );
            }
        } catch (err) {
            console.error("❌ Fetch sub Groups failed:", err);
            toast.error(intl.formatMessage({
                id: "error.fetchsubGroupAllocation",
                defaultMessage: "Error while fetching sub groups data."
            }));
        }
    }, [intl, toast]);

    /* ================= CELL EDIT HANDLER ================= */
    const handleCellEdit = (params) => {
        const { data, colDef, newValue, oldValue } = params;
        if (newValue === oldValue) return;

        setSubGroupAllocationRows((prev) =>
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
    const handleSubGroupAllocationSave = async ({ newRows, updatedRows, deletedRows }) => {
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
            const latestRows = subGroupAllocationRows.map(existingRow => {
                const modifiedRow = rows.find(r => r.id === existingRow.id);
                return modifiedRow || existingRow;
            });

            const totalPercentage = latestRows.reduce((sum, row) => {
                return sum + (Number(row.percentage) || 0);
            }, 0);

            if (totalPercentage > 100) {
                toast.warning(
                    intl.formatMessage({
                        id: "error.invalidPercentage",
                        defaultMessage: "Enter valid percentage"
                    })
                );

                return { success: false };
            }

            const payload = rows.map((row) => ({
                groupCode: row.groupCode,
                parentGroupCode: selectedGroupCode,
                percentageCapacity: Number(row.percentage) || 0,
                maxAllocatedTaskCount: row.maxAllocatedTaskCount,
                modifiedBy: LOGGED_IN_USER,
                mode: row.mode || (newRows.includes(row) ? "N" : "E"),
            }));

            const response = await HAxiosService.POST(`${allocationBaseUrl}/update-sub-groups`, payload);

            // NEW FORMAT: Check response.data.success
            if (response.data && response.data.success) {
                toast.success(response.data.message || intl.formatMessage({
                    id: "success.subGroupAllocationSaved",
                    defaultMessage: "Sub group allocation saved successfully!"
                }));
                fetchSubGroup(selectedGroupCode);
                return { success: true };
            } else {
                toast.error(response.data?.message || intl.formatMessage({
                    id: "error.saveFailed",
                    defaultMessage: "Failed to save sub group allocation."
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


    /* =================SUB-GROUP ALLOCATION COLUMNS ================= */
    const allocationColumns = [
        {
            headerName: "",
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
        },
        {
            headerName: intl.formatMessage({
                id: "label.subGroupAllocationMaster.groupCode",
                defaultMessage: "Group Code"
            }),
            field: "groupCode",
            width: 150,
            editable: true,
        },
        {
            headerName: intl.formatMessage({
                id: "label.subGroupAllocationMaster.percentage",
                defaultMessage: "Percentage"
            }),
            field: "percentage",
            editable: true,
            width: 150,
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
            required: false,
        },
        {
            headerName: intl.formatMessage({
                id: "label.subGroupAllocationMaster.maxAllocatedTaskCount",
                defaultMessage: "Max Allocated Task Count"
            }),
            field: "maxAllocatedTaskCount",
            editable: true,
            width: 170,
            valueParser: (params) => {
                const value = params.newValue;

                if (value === "" || value === null || value === undefined) {
                    return null;   // 👈 IMPORTANT (NOT "")
                }

                const num = Number(value);

                return isNaN(num) ? null : num;
            },

            valueFormatter: (params) => {
                if (params.value === null || params.value === undefined) return "";
                return params.value;
            },
            required: false,
        },
    ];

    const gridStyle = {
        width: "52.5%",
        height: "calc(80vh - 220px)",
        marginTop: "10px",
        margin: "10px auto 0 auto"
    };

    const getDefaultsSubGroupAllocationRow = () => ({
        groupCode: "",
        percentage: "",
        maxAllocatedTaskCount: "",
        mode: "N",
    });

    return (
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center", }}>
            <HBox sx={{ height: 8 }} />
            <TitleBar
                title={intl.formatMessage({
                    id: "label.subGroupAllocationMaster.allocationConfig",
                    defaultMessage: "Group Code : " + selectedGroupCode
                })}
                width="614px"
                backgroundColor="#eaf2ff"
            />
            <HAgGrid
                ref={gridRef}
                rowData={subGroupAllocationRows}
                setRowData={setSubGroupAllocationRows}
                columnDefs={allocationColumns}
                gridStyle={gridStyle}
                pagination
                paginationPageSize={10}
                allowAdd
                allowDelete
                allowUpdate
                onCellValueChanged={handleCellEdit}
                defaultNewRowData={getDefaultsSubGroupAllocationRow}
                onSave={handleSubGroupAllocationSave}
            />
            <HButtonBar
                onSave={() => gridRef.current?.submitChanges?.()}
                onClose={() => navigate("/homelayout/welcomepage")}
                disableToast={{ save: true, close: true }}
            />
        </HBox>
    );
};

SubGroupAllocationConfiguration.propTypes = {
    selectedGroupCode: PropTypes.string
};

export default SubGroupAllocationConfiguration;
