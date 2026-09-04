import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AxiosClient, HBox, HButtonBar, HLabel, HTextField, SearchCommonBox, TitleBar, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";

import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

import { LeavePlannerAPI } from "./apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { gridCollectorDefObj } from "../../../common/components/SearchGridDefObj";

const FETCH_LEAVE_URL = LeavePlannerAPI.fetchLeaveByCollectorCode();
const SAVE_LEAVE_URL = LeavePlannerAPI.saveLeave();

const LeavePlannerMaster = () => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collectorCode, setCollectorCode] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const intl = useIntl();
  const toast = useToast();

  // ── Fetch leave records for selected collector ─────────────────────
  const handleFetch = async () => {
    if (!collectorCode) {
      toast.error(
        intl.formatMessage({
          id: "error.leaveplanner.collectorcode.required",
          defaultMessage: "Please select a Collector Code.",
        })
      );
      return;
    }

    setLoading(true);
    try {
      const res = await AxiosClient({
        method: "post",
        url: FETCH_LEAVE_URL,
        data: { szCollectorCode: collectorCode },
      });

      // Backend returns: CommonResponseDto { responseJson: List<LeavePlannerDto> }
      // responseJson is a plain array, NOT a map keyed by collectorCode
      const leaveList = res.data?.responseJson ?? [];

      if (leaveList.length > 0) {
        const mapped = leaveList.map((item, index) => ({
          id: item.lnLeaveSeq || `row-${Date.now()}-${index}`,
          lnLeaveSeq: item.lnLeaveSeq ?? null,
          dtLeaveFrom: item.dtLeaveFrom ?? "",
          dtLeaveTo: item.dtLeaveTo ?? "",
          szRemarks: item.szRemarks ?? "",
        }));
        setRowData(mapped);
        toast.success(
          intl.formatMessage({
            id: "leaveplanner.success.datafetch",
            defaultMessage: "Data fetched successfully",
          })
        );
      } else {
        setRowData([]);
        toast.info(
          intl.formatMessage({
            id: "info.leaveplanner.norecords",
            defaultMessage: "No leave records found for this collector",
          })
        );
      }
    } catch (err) {
      console.error("Error fetching leave records:", err);
      toast.error("Error fetching leave records.");
    } finally {
      setLoading(false);
    }
  };

  // ── Save ────────────────
  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    if (!collectorCode) {
      toast.error(
        intl.formatMessage({
          id: "error.leaveplanner.collectorcode.fetchFirst",
          defaultMessage: "Select a Collector Code and fetch the data first.",
        })
      );
      return { success: false };
    }

    const leaveEntries = [
      ...newRows.map((row) => ({
        lnLeaveSeq: null,
        dtLeaveFrom: formatDate(row.dtLeaveFrom),
        dtLeaveTo: formatDate(row.dtLeaveTo),
        szRemarks: row.szRemarks || "",
        szMode: "N",
      })),
      ...updatedRows.map((row) => ({
        lnLeaveSeq: row.lnLeaveSeq,
        dtLeaveFrom: formatDate(row.dtLeaveFrom),
        dtLeaveTo: formatDate(row.dtLeaveTo),
        szRemarks: row.szRemarks || "",
        szMode: "E",
      })),
      ...deletedRows.map((row) => ({
        lnLeaveSeq: row.lnLeaveSeq,
        dtLeaveFrom: formatDate(row.dtLeaveFrom),
        dtLeaveTo: formatDate(row.dtLeaveTo),
        szRemarks: row.szRemarks || "",
        szMode: "D",
      })),
    ];

    if (leaveEntries.length === 0) {
      toast.error("Nothing to save.");
      return { success: false };
    }

    for (const row of [...newRows, ...updatedRows]) {
      if (row.dtLeaveFrom && row.dtLeaveTo) {
        const from = dayjs(row.dtLeaveFrom);
        const to = dayjs(row.dtLeaveTo);
        if (to.isBefore(from)) {
          toast.error(
            intl.formatMessage({
              id: "error.leaveplanner.invaliddates",
              defaultMessage:
                "Leave To date must be greater than or equal to Leave From date",
            })
          );
          return { success: false };
        }
      }
    }

    // Build LeavePlannerWrapperDto: { szCollectorCode, leavePlannerData: { [collectorCode]: [...] } }
    const payload = {
      szCollectorCode: collectorCode,
      leavePlannerData: {
        [collectorCode]: leaveEntries,
      },
    };

    try {
      const res = await AxiosClient({
        method: "post",
        url: SAVE_LEAVE_URL,
        data: payload,
      });

      const data = res?.data;

      if (data?.status === "Failure") {
        if (data?.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            data?.message ||
              intl.formatMessage({
                id: "message.LeavePlanner.error.saveFailed",
                defaultMessage: "Save failed",
              })
          );
        }
        return { success: false };
      }

      if (data?.errors) {
        handleValidationErrors(intl, toast, data.errors);
        return { success: false };
      }

      toast.success(
        intl.formatMessage({
          id: "success.save",
          defaultMessage: "Saved successfully",
        })
      );
      await handleFetch();
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving");
      return { success: false };
    }
  };

  // ── Delete ────────────────
  const handleDelete = (selectedRows) => {
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select at least one row to delete.");
      return;
    }
    const updated = rowData
      .map((row) =>
        selectedRows.includes(row)
          ? row.mode === "N"
            ? null
            : { ...row, mode: "D" }
          : row
      )
      .filter(Boolean);
    setRowData(updated);
  };

  const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === "string") return date.split("T")[0];
    if (date instanceof Date) {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  };

  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: "left",
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.LeaveFrom",
        defaultMessage: "Leave From",
      }),
      field: "dtLeaveFrom",
      width: 150,
      editable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) => (p.value ? formatDate(p.value) : ""),
      valueParser: (p) => {
        if (!p.newValue) return null;
        const date = new Date(p.newValue);
        const offset = date.getTimezoneOffset();
        return new Date(date.getTime() + offset * 60 * 1000);
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.LeaveTo",
        defaultMessage: "Leave To",
      }),
      field: "dtLeaveTo",
      width: 150,
      editable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) => (p.value ? formatDate(p.value) : ""),
      valueParser: (p) => {
        if (!p.newValue) return null;
        const date = new Date(p.newValue);
        const offset = date.getTimezoneOffset();
        return new Date(date.getTime() + offset * 60 * 1000);
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.Remarks",
        defaultMessage: "Remarks",
      }),
      field: "szRemarks",
      width: 150,
      editable: true,
      filter: false,
      flex: 1,
    },
  ];

  const gridStyle = {
    width: "60%",
    height: "50vh",
    margin: "10px auto",
    background: "transparent",
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar
        title={intl.formatMessage({
          id: "label.LeavePlanner.title",
          defaultMessage: "Leave Planner",
        })}
      />

      {/* ── Header Row ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "10px 20px",
        }}
      >
        <HLabel
          value={intl.formatMessage({
            id: "label.LeavePlanner.CollectorCode",
            defaultMessage: "Collector Code",
          })}
        />
        <SearchCommonBox
         apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
          searchCode="COLLCDE"
          setSelectedValue={(dataValue, row) => {
            setCollectorCode(dataValue);
            setCollectorName(row?.szCollectorName || "");
            setRowData([]);
          }}
          selectedValue={collectorCode}
          selectedColumn="szCollectorCode"
          gridDefObj={gridCollectorDefObj}
          gridWidth={300}
          gridHeight={300}
          gridNoOfRowsPerPage={2}
          searchBoxWidth={220}
          searchBoxHeight={30}
          searchBoxFontSize={12}
        />

        <Button
          variant="contained"
          onClick={handleFetch}
          disabled={loading}
          sx={{ width: "100px" }}
        >
          {intl.formatMessage({
            id: "label.common.fetch",
            defaultMessage: "Fetch",
          })}
        </Button>

        <Box sx={{ flex: 1 }} />

        <HLabel
          value={intl.formatMessage({
            id: "label.LeavePlanner.CollectorName",
            defaultMessage: "Collector Name",
          })}
        />
        <HTextField name="collectorName" value={collectorName} sx={{ mt: -1 }} />
      </Box>

      {/* ── Leave Details Grid ── */}
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          rowData={rowData}
          setRowData={setRowData}
          columnDefs={columnDefs}
          gridStyle={gridStyle}
          pagination={true}
          paginationPageSize={10}
          sort={false}
          rowSelection="multiple"
          allowAdd={true}
          allowDelete={true}
          allowUpdate={true}
          onDelete={handleDelete}
          onSave={handleSave}
          getRowId={(params) => params.data.id}
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default LeavePlannerMaster;
