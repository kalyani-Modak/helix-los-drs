import { eh as useNavigate, dN as reactExports, ed as useIntl, ct as ar, dB as jsxRuntimeExports, v as Box, cx as bp, ep as vp, dK as ps, cJ as dc, dd as gridCollectorDefObj, bI as SEARCH_API_ENDPOINTS, w as Button, cs as ap, ac as Dt, cy as bu, cj as Vg, cv as as, cI as dayjs } from "./index-BhdgJqva.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { L as LeavePlannerAPI } from "./apiEndpoints-CGlR3-gk.js";
const FETCH_LEAVE_URL = LeavePlannerAPI.fetchLeaveByCollectorCode();
const SAVE_LEAVE_URL = LeavePlannerAPI.saveLeave();
const LeavePlannerMaster = () => {
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [collectorCode, setCollectorCode] = reactExports.useState("");
  const [collectorName, setCollectorName] = reactExports.useState("");
  const intl = useIntl();
  const toast = ar();
  const handleFetch = async () => {
    var _a;
    if (!collectorCode) {
      toast.error(
        intl.formatMessage({
          id: "error.leaveplanner.collectorcode.required",
          defaultMessage: "Please select a Collector Code."
        })
      );
      return;
    }
    setLoading(true);
    try {
      const res = await as({
        method: "post",
        url: FETCH_LEAVE_URL,
        data: { szCollectorCode: collectorCode }
      });
      const leaveList = ((_a = res.data) == null ? void 0 : _a.responseJson) ?? [];
      if (leaveList.length > 0) {
        const mapped = leaveList.map((item, index) => ({
          id: item.lnLeaveSeq || `row-${Date.now()}-${index}`,
          lnLeaveSeq: item.lnLeaveSeq ?? null,
          dtLeaveFrom: item.dtLeaveFrom ?? "",
          dtLeaveTo: item.dtLeaveTo ?? "",
          szRemarks: item.szRemarks ?? ""
        }));
        setRowData(mapped);
        toast.success(
          intl.formatMessage({
            id: "leaveplanner.success.datafetch",
            defaultMessage: "Data fetched successfully"
          })
        );
      } else {
        setRowData([]);
        toast.info(
          intl.formatMessage({
            id: "info.leaveplanner.norecords",
            defaultMessage: "No leave records found for this collector"
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
  const handleSave = async ({ newRows, updatedRows, deletedRows }) => {
    var _a, _b;
    if (!collectorCode) {
      toast.error(
        intl.formatMessage({
          id: "error.leaveplanner.collectorcode.fetchFirst",
          defaultMessage: "Select a Collector Code and fetch the data first."
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
        szMode: "N"
      })),
      ...updatedRows.map((row) => ({
        lnLeaveSeq: row.lnLeaveSeq,
        dtLeaveFrom: formatDate(row.dtLeaveFrom),
        dtLeaveTo: formatDate(row.dtLeaveTo),
        szRemarks: row.szRemarks || "",
        szMode: "E"
      })),
      ...deletedRows.map((row) => ({
        lnLeaveSeq: row.lnLeaveSeq,
        dtLeaveFrom: formatDate(row.dtLeaveFrom),
        dtLeaveTo: formatDate(row.dtLeaveTo),
        szRemarks: row.szRemarks || "",
        szMode: "D"
      }))
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
              defaultMessage: "Leave To date must be greater than or equal to Leave From date"
            })
          );
          return { success: false };
        }
      }
    }
    const payload = {
      szCollectorCode: collectorCode,
      leavePlannerData: {
        [collectorCode]: leaveEntries
      }
    };
    try {
      const res = await as({
        method: "post",
        url: SAVE_LEAVE_URL,
        data: payload
      });
      const data = res == null ? void 0 : res.data;
      if ((data == null ? void 0 : data.status) === "Failure") {
        if (data == null ? void 0 : data.responseJson) {
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          toast.error(
            (data == null ? void 0 : data.message) || intl.formatMessage({
              id: "message.LeavePlanner.error.saveFailed",
              defaultMessage: "Save failed"
            })
          );
        }
        return { success: false };
      }
      if (data == null ? void 0 : data.errors) {
        handleValidationErrors(intl, toast, data.errors);
        return { success: false };
      }
      toast.success(
        intl.formatMessage({
          id: "success.save",
          defaultMessage: "Saved successfully"
        })
      );
      await handleFetch();
      return { success: true };
    } catch (err) {
      toast.error(((_b = (_a = err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Error saving");
      return { success: false };
    }
  };
  const handleDelete = (selectedRows) => {
    if (!selectedRows || selectedRows.length === 0) {
      toast.error("Please select at least one row to delete.");
      return;
    }
    const updated = rowData.map(
      (row) => selectedRows.includes(row) ? row.mode === "N" ? null : { ...row, mode: "D" } : row
    ).filter(Boolean);
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
      pinned: "left"
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.LeaveFrom",
        defaultMessage: "Leave From"
      }),
      field: "dtLeaveFrom",
      width: 150,
      editable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) => p.value ? formatDate(p.value) : "",
      valueParser: (p) => {
        if (!p.newValue) return null;
        const date = new Date(p.newValue);
        const offset = date.getTimezoneOffset();
        return new Date(date.getTime() + offset * 60 * 1e3);
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.LeaveTo",
        defaultMessage: "Leave To"
      }),
      field: "dtLeaveTo",
      width: 150,
      editable: true,
      filter: false,
      cellEditor: "agDateCellEditor",
      valueFormatter: (p) => p.value ? formatDate(p.value) : "",
      valueParser: (p) => {
        if (!p.newValue) return null;
        const date = new Date(p.newValue);
        const offset = date.getTimezoneOffset();
        return new Date(date.getTime() + offset * 60 * 1e3);
      }
    },
    {
      headerName: intl.formatMessage({
        id: "label.LeavePlanner.Remarks",
        defaultMessage: "Remarks"
      }),
      field: "szRemarks",
      width: 150,
      editable: true,
      filter: false,
      flex: 1
    }
  ];
  const gridStyle = {
    width: "60%",
    height: "50vh",
    margin: "10px auto",
    background: "transparent"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      vp,
      {
        title: intl.formatMessage({
          id: "label.LeavePlanner.title",
          defaultMessage: "Leave Planner"
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Box,
      {
        sx: {
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: "10px 20px"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.LeavePlanner.CollectorCode",
                defaultMessage: "Collector Code"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            dc,
            {
              apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
              searchCode: "COLLCDE",
              setSelectedValue: (dataValue, row) => {
                setCollectorCode(dataValue);
                setCollectorName((row == null ? void 0 : row.szCollectorName) || "");
                setRowData([]);
              },
              selectedValue: collectorCode,
              selectedColumn: "szCollectorCode",
              gridDefObj: gridCollectorDefObj,
              gridWidth: 300,
              gridHeight: 300,
              gridNoOfRowsPerPage: 2,
              searchBoxWidth: 220,
              searchBoxHeight: 30,
              searchBoxFontSize: 12
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "contained",
              onClick: handleFetch,
              disabled: loading,
              sx: { width: "100px" },
              children: intl.formatMessage({
                id: "label.common.fetch",
                defaultMessage: "Fetch"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { flex: 1 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.LeavePlanner.CollectorName",
                defaultMessage: "Collector Name"
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { name: "collectorName", value: collectorName, sx: { mt: -1 } })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          rowData,
          setRowData,
          columnDefs,
          gridStyle,
          pagination: true,
          paginationPageSize: 10,
          sort: false,
          rowSelection: "multiple",
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          onDelete: handleDelete,
          onSave: handleSave,
          getRowId: (params) => params.data.id
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          disableToast: { save: true, close: true }
        }
      )
    ] })
  ] });
};
export {
  LeavePlannerMaster as default
};
