import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HAgGrid, HBox, HButton, HButtonBar, HPaper, TitleBar, HBreadCrumb, useToast, HDialog } from "@helix/component-library";
import { BatchMastersAPI, BatchExecutionAPI } from "./apiEndpoints";
import { unwrapCommonResponse } from "./unwrapCommonResponse";
import { useIntl } from "react-intl";



import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BatchScheduleDialog from "./BatchScheduleDialog";
import BatchProcessDialog from "./BatchProcessDialog";
import { formatBatchScheduleSummary } from "./batchScheduleUtils";
 import { useLocation } from "react-router-dom";

import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Chip,
} from "@mui/material";


const toApiExecutionType = (v) => {
  if (v === "Automatic") return "A";
  if (v === "Manual") return "M";
  return v;
};

const fromApiExecutionType = (v) => {
  if (v === "A") return "Automatic";
  if (v === "M") return "Manual";
  return v;
};

const rowToBatchBody = (row) => {
  const exec = toApiExecutionType(row.executionType);
  const clearSchedule = exec === "M";
  return {
    batchCode: row.batchCode,
    batchDesc: row.batchDesc,
    active: row.active === true || row.active === "Y" ? "Y" : row.active || "N",
    nodeId: row.nodeId ?? null,
    partitionType: row.partitionType ?? null,
    executionType: exec,
    scheduleType: clearSchedule ? null : row.scheduleType ?? null,
    periodicUnit: clearSchedule ? null : row.periodicUnit ?? null,
    periodicExecTime: clearSchedule ? null : row.periodicExecTime ?? null,
    periodicExecBetween: clearSchedule ? null : row.periodicExecBetween ?? null,
    executionAt: clearSchedule ? null : row.executionAt ?? null,
    hardDependency: row.hardDependency ?? null,
    hardDepTolerance: row.hardDepTolerance ?? null,
    softDependency: row.softDependency ?? null,
    softDepTolerance: row.softDepTolerance ?? null,
    confirmationRule: row.confirmationRule ?? null,
    autoAbortLimit: row.autoAbortLimit ?? null,
    overrunMailCode: row.overrunMailCode ?? null,
    overrunSetUp: row.overrunSetUp ?? null,
    overdueMailCode: row.overdueMailCode ?? null,
    overdueSetUp: row.overdueSetUp ?? null,
    abortMailCode: row.abortMailCode ?? null,
    abortSetUp: row.abortSetUp ?? null,
    errorMailCode: row.errorMailCode ?? null,
    errorSetUp: row.errorSetUp ?? null,
    partitionCodes: row.partitionCodes ?? null,
    estimatedTime: row.estimatedTime ?? null,
    multiRunnableYn: row.multiRunnableYn ?? null,
    autoScheduleUserId: row.autoScheduleUserId ?? null,
    autoSchedule: row.autoSchedule ?? null,
    autoExecuteUserId: row.autoExecuteUserId ?? null,
    autoExecute: row.autoExecute ?? null,
    neverRunParallelWith: row.neverRunParallelWith ?? null,
    businessUnit: row.businessUnit ?? "All",
    startMailCode: row.startMailCode ?? null,
    startSetUp: row.startSetUp ?? null,
    completionMailCode: row.completionMailCode ?? null,
    completionSetUp: row.completionSetUp ?? null,
  };
};

const STATUS_COLORS = {
  COMPLETED: { color: "#2e7d32", bg: "#e8f5e9" },
  SUCCESS: { color: "#2e7d32", bg: "#e8f5e9" },
  FAILED: { color: "#c62828", bg: "#ffebee" },
  ERROR: { color: "#c62828", bg: "#ffebee" },
  RUNNING: { color: "#1565c0", bg: "#e3f2fd" },
  IN_PROGRESS: { color: "#1565c0", bg: "#e3f2fd" },
  PENDING: { color: "#e65100", bg: "#fff3e0" },
  SKIPPED: { color: "#6a1b9a", bg: "#f3e5f5" },
  TERMINATED: { color: "#b45309", bg: "#fff7ed" },
  ABORTED: { color: "#b45309", bg: "#fff7ed" },
};

const isRunningDisplayStatus = (status) => {
  const upper = (status || "").toUpperCase();
  return upper === "RUNNING" || upper === "IN_PROGRESS" || upper === "STARTED" || upper === "STARTING";
};

// ─── Popup dialog showing all process/partition statuses for a batch ──────────
const BatchStatusDialog = ({ open, onClose, batchCode}) => {
  const [finalStatus, setFinalStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;


  const fetchStatus = useCallback(() => {
    if (!batchCode) return;
    setLoading(true);
    setError(false);
    setFinalStatus(null);
    HAxiosService.GET(BatchExecutionAPI.BatchExecution(screenMenuId) + `/completed/${encodeURIComponent(batchCode)}/partitions`)
      .then((res) => {
        const fs = res?.data?.finalStatus ?? res?.data?.data?.finalStatus ?? null;
        setFinalStatus(fs && typeof fs === "object" ? fs : {});
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [batchCode]);

  useEffect(() => {
    if (!open) return;
    fetchStatus();
  }, [open, fetchStatus]);

  const entries = Object.entries(finalStatus ?? {}).flatMap(([processCode, partitions]) =>
    Object.entries(partitions ?? {}).map(([partitionId, status]) => ({
      processCode,
      partitionId,
      status,
    }))
  );

  return (
    <HDialog disableContentWrapper open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <span>
          Status —{" "}
          <span style={{ fontWeight: 700, color: "#1565c0" }}>{batchCode}</span>
        </span>
        <HButton
          size="small"
          label="label.batchmaster.dialogRefresh"
          onClick={fetchStatus}
          disabled={loading}
          margin="0"
        />
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 120 }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 100 }}>
            <CircularProgress size={32} />
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", color: "#c62828", padding: "24px 0" }}>
            Failed to load status. Please try again.
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div style={{ textAlign: "center", color: "#888", padding: "24px 0" }}>
            No status data available.
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, backgroundColor: "#f5f5f5" } }}>
                <TableCell>Process Code</TableCell>
                <TableCell>Partition</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map(({ processCode, partitionId, status }) => {
                const style = STATUS_COLORS[status?.toUpperCase()] ?? { color: "#333", bg: "#f5f5f5" };
                return (
                  <TableRow key={`${processCode}-${partitionId}`} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                      {processCode}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 13 }}>
                      {partitionId}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          backgroundColor: style.bg,
                          color: style.color,
                          fontWeight: 700,
                          fontSize: 12,
                          border: `1px solid ${style.color}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>

      <DialogActions>
        <HButton label="common.close" onClick={onClose} variant="outlined" size="small" margin="0" />
      </DialogActions>
    </HDialog>
  );
};

// ─── Cell renderer: just a button, dialog handles the fetch ───────────────────
const BatchStatusCell = ({ batchCode, hasCode }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HButton
        size="small"
        label="label.batchmaster.viewStatus"
        disabled={!hasCode}
        margin="0"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (hasCode) setOpen(true);
        }}
      />
      {open && (
        <BatchStatusDialog
          open={open}
          onClose={() => setOpen(false)}
          batchCode={batchCode}
        />
      )}
    </>
  );
};

const BatchMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = useState(["DEFAULT"]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRow, setScheduleRow] = useState(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processDialogRow, setProcessDialogRow] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;
  const [executionStatusMap, setExecutionStatusMap] = useState({});
  const [abortDialogBatchCode, setAbortDialogBatchCode] = useState(null);
  const [abortInProgress, setAbortInProgress] = useState(false);

  const loadExecutionStatuses = useCallback((batches) => {
    if (!Array.isArray(batches) || batches.length === 0) {
      setExecutionStatusMap({});
      return;
    }
    const codes = batches.map((b) => b.batchCode?.trim()).filter(Boolean);
    Promise.all(
      codes.map((code) =>
        HAxiosService.GET(BatchExecutionAPI.BatchExecution(screenMenuId) + `/status/${encodeURIComponent(code)}`)
          .then((res) => {
            const payload = res?.data?.data ?? res?.data ?? {};
            return [code, payload.displayStatus || payload.jobStatus || "IDLE"];
          })
          .catch(() => [code, "IDLE"])
      )
    ).then((entries) => {
      const map = {};
      entries.forEach(([code, status]) => {
        map[code] = status;
      });
      setExecutionStatusMap(map);
    });
  }, []);

  const loadPartitionTypes = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.listPartitionTypes())
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        const types = [...new Set(data.map((t) => t.partitionType).filter(Boolean))];
        setPartitionTypeValues(types.length > 0 ? types : ["DEFAULT"]);
      })
      .catch(() => setPartitionTypeValues(["DEFAULT"]));
  }, []);

  const openScheduleDialog = useCallback((data) => {
    const auto = data.executionType === "Automatic" || data.executionType === "A";
    if (!auto) return;
    setScheduleRow(data);
    setScheduleOpen(true);
  }, []);

  const handleScheduleApply = useCallback(
    (fields) => {
      const gid = scheduleRow?.gridRowId;
      if (gid == null) return;
      gridRef.current?.updateRowFieldsByGridRowId?.(gid, fields);
    },
    [scheduleRow]
  );

  const openProcessDialog = useCallback((data) => {
    if (!data?.batchCode?.trim()) return;
    setProcessDialogRow(data);
    setProcessDialogOpen(true);
  }, []);

  const columnDefs = useMemo(() => {
    const scheduleCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.schedule",
        defaultMessage: "Schedule",
      }),
      colId: "batchScheduleEditor",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 140,
      flex: 1,
      valueGetter: (p) => formatBatchScheduleSummary(p.data),
      cellRenderer: (params) => {
        const auto =
          params.data?.executionType === "Automatic" || params.data?.executionType === "A";
        if (!auto) return "—";
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              height: "100%",
            }}
          >
            <span
              style={{
                fontSize: 12,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1,
                alignSelf: "center",
              }}
            >
              {formatBatchScheduleSummary(params.data)}
            </span>
            <HButton
              size="small"
              label="label.batchmaster.scheduleEdit"
              margin="0"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openScheduleDialog(params.data);
              }}
            />
          </div>
        );
      },
    };

    const processCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.processes",
        defaultMessage: "Processes",
      }),
      colId: "batchProcessEditor",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        const hasCode =
          params.data?.batchCode != null &&
          String(params.data.batchCode).trim() !== "" &&
          !!params.data?.isPersisted;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 8,
              width: "100%",
              height: "100%",
            }}
          >
            <HButton
              size="small"
              label="label.batchmaster.processesEdit"
              margin="0"
              disabled={!hasCode}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openProcessDialog(params.data);
              }}
            />
          </div>
        );
      },
    };

    // ─── Status column ─────────────────────────────────────────────────────────
    const statusCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.status",
        defaultMessage: "Status",
      }),
      colId: "batchStatus",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 150,
      flex: 1,
      valueGetter: () => "",
      cellRenderer: (params) => {
        const batchCode = params.data?.batchCode?.trim();
        const hasCode = !!batchCode && !!params.data?.isPersisted;
        return (
          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <BatchStatusCell batchCode={batchCode} hasCode={hasCode} />
          </div>
        );
      },
    };

    // ─── Action column (Execute or Abort) ──────────────────────────────────────
    const actionCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.action",
        defaultMessage: "Action",
      }),
      colId: "batchAction",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        const batchCode = params.data?.batchCode?.trim();
        const hasCode = !!batchCode && !!params.data?.isPersisted;
        const displayStatus = executionStatusMap[batchCode] || "";
        const running = isRunningDisplayStatus(displayStatus);

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: "100%",
            }}
          >
            {running ? (
              <HButton
                size="small"
                label="label.batchmaster.abort"
                margin="0"
                disabled={!hasCode}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!hasCode) return;
                  setAbortDialogBatchCode(batchCode);
                }}
              />
            ) : (
              <HButton
                size="small"
                label="label.batchmaster.execute"
                margin="0"
                disabled={!hasCode}
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!hasCode) return;
                  try {
                    await HAxiosService.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/run/${encodeURIComponent(batchCode)}`, {});
                    toast.success(
                      intl.formatMessage(
                        {
                          id: "batchmaster.action.executeSuccess",
                          defaultMessage: "Batch '{code}' executed successfully",
                        },
                        { code: batchCode }
                      )
                    );
                    loadExecutionStatuses(
                      rowData.length ? rowData : [{ batchCode }]
                    );
                  } catch (err) {
                    console.error(err);
                    toast.error(
                      intl.formatMessage(
                        {
                          id: "batchmaster.action.executeFailed",
                          defaultMessage: "Failed to execute batch '{code}'",
                        },
                        { code: batchCode }
                      )
                    );
                  }
                }}
              />
            )}
          </div>
        );
      },
    };

    // ─── Retry column ──────────────────────────────────────────────────────────
    const retryCol = {
      headerName: intl.formatMessage({
        id: "label.batchmaster.retry",
        defaultMessage: "Retry",
      }),
      colId: "batchActionRetry",
      sortable: false,
      filter: false,
      editable: false,
      minWidth: 120,
      flex: 0.8,
      valueGetter: () => "",
      cellRenderer: (params) => {
        const batchCode = params.data?.batchCode?.trim();
        const hasCode = !!batchCode && !!params.data?.isPersisted;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              height: "100%",
            }}
          >
            <HButton
              size="small"
              label="label.batchmaster.retry"
              margin="0"
              disabled={!hasCode}
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!hasCode) return;
                try {
                  await HAxiosService.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/retry/${encodeURIComponent(batchCode)}`, {});
                  toast.success(
                    intl.formatMessage(
                      {
                        id: "batchmaster.retry.success",
                        defaultMessage: "Retry started for batch '{code}'",
                      },
                      { code: batchCode }
                    )
                  );
                } catch (err) {
                  console.error(err);
                  toast.error(
                    intl.formatMessage(
                      {
                        id: "batchmaster.retry.failed",
                        defaultMessage: "Failed to retry batch '{code}'",
                      },
                      { code: batchCode }
                    )
                  );
                }
              }}
            />
          </div>
        );
      },
    };

    return [
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.code",
          defaultMessage: "Batch code",
        }),
        field: "batchCode",
        width: 120,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.desc",
          defaultMessage: "Description",
        }),
        field: "batchDesc",
        width: 200,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.active",
          defaultMessage: "Active",
        }),
        field: "active",
        width: 80,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.active === "Y" || params.data.active === true,
        valueSetter: (params) => {
          params.data.active = params.newValue ? "Y" : "N";
          return true;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.partitionType",
          defaultMessage: "Partition type",
        }),
        field: "partitionType",
        width: 150,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.execType",
          defaultMessage: "Execution type",
        }),
        field: "executionType",
        width: 130,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Manual", "Automatic"] },
      },
      scheduleCol,
      processCol,
      statusCol,
      actionCol,
      retryCol,
      {
        headerName: intl.formatMessage({
          id: "label.batchmaster.estimatedTime",
          defaultMessage: "Est. time",
        }),
        field: "estimatedTime",
        width: 100,
        editable: true,
        filter: false,
        type: "numericColumn",
      },
    ];
  }, [intl, partitionTypeValues, openScheduleDialog, openProcessDialog, toast, executionStatusMap, rowData, loadExecutionStatuses]);

  const refreshData = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.BatchMasters(screenMenuId))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        setRowData(
          data.map((item) => ({
            id: item.batchCode,
            ...item,
            executionType: fromApiExecutionType(item.executionType),
            isPersisted: true,
          }))
        );
        loadExecutionStatuses(data);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "batchframework.toast.loadBatchesFailed",
            defaultMessage: "Failed to load batches",
          })
        );
        setRowData([]);
      });
  }, [intl, toast, loadExecutionStatuses]);

  const handleConfirmAbort = useCallback(async () => {
    if (!abortDialogBatchCode) return;
    setAbortInProgress(true);
    try {
      await HAxiosService.POST(BatchExecutionAPI.BatchExecution(screenMenuId) + `/abort/${encodeURIComponent(abortDialogBatchCode)}`, {});
      toast.success(
        intl.formatMessage(
          {
            id: "batchmaster.abort.success",
            defaultMessage: "Batch '{code}' aborted successfully",
          },
          { code: abortDialogBatchCode }
        )
      );
      refreshData();
    } catch (err) {
      console.error(err);
      toast.error(
        intl.formatMessage(
          {
            id: "batchmaster.abort.failed",
            defaultMessage: "Failed to abort batch '{code}'",
          },
          { code: abortDialogBatchCode }
        )
      );
    } finally {
      setAbortInProgress(false);
      setAbortDialogBatchCode(null);
    }
  }, [abortDialogBatchCode, intl, toast, refreshData]);

  useEffect(() => {
    loadPartitionTypes();
  }, [loadPartitionTypes]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      for (const row of deletedRows) {
        if (row.batchCode) {
          await HAxiosService.DELETE(BatchMastersAPI.BatchMasters(screenMenuId) + `/${encodeURIComponent(row.batchCode)}`);
        }
      }
      for (const row of newRows) {
        await HAxiosService.POST(BatchMastersAPI.BatchMasters(screenMenuId), rowToBatchBody(row));
      }
      for (const row of updatedRows) {
        await HAxiosService.PUT(BatchMastersAPI.BatchMasters(screenMenuId) +  `/${encodeURIComponent(row.batchCode)}`, rowToBatchBody(row));
      }
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.batchSaved",
          defaultMessage: "Batch configuration saved",
        })
      );
      refreshData();
      loadPartitionTypes();
      return { success: true };
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.saveFailed",
          defaultMessage: "Save failed",
        })
      );
      return { success: false };
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar
        title={intl.formatMessage({
          id: "label.BatchMaster.title",
          defaultMessage: "Batch configuration",
        })}
      />
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HPaper sx={{ p: 2, width: "100%" }}>
          <HAgGrid
            ref={gridRef}
            key={intl.locale}
            rowData={rowData}
            columnDefs={columnDefs}
            gridStyle={{ width: "100%", height: "420px", marginTop: "20px" }}
            pagination
            paginationPageSize={10}
            sort
            globalSearch={false}
            allowAdd
            allowDelete
            allowUpdate
            rowDragging={false}
            onSave={handleSave}
          />
        </HPaper>
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onReset={() => {
            refreshData();
            loadPartitionTypes();
          }}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>
      <BatchScheduleDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        row={scheduleRow}
        onApply={handleScheduleApply}
      />
      <BatchProcessDialog
        open={processDialogOpen}
        onClose={() => {
          setProcessDialogOpen(false);
          setProcessDialogRow(null);
        }}
        row={processDialogRow}
      />
      <HDialog disableContentWrapper open={!!abortDialogBatchCode} onClose={() => !abortInProgress && setAbortDialogBatchCode(null)}>
        <DialogTitle>
          {intl.formatMessage({
            id: "batchmaster.abort.confirmTitle",
            defaultMessage: "Abort batch",
          })}
        </DialogTitle>
        <DialogContent>
          {intl.formatMessage(
            {
              id: "batchmaster.abort.confirm",
              defaultMessage: "Are you sure you want to abort batch '{code}'?",
            },
            { code: abortDialogBatchCode || "" }
          )}
        </DialogContent>
        <DialogActions>
          <HButton
            size="small"
            label="common.cancel"
            margin="0"
            disabled={abortInProgress}
            onClick={() => setAbortDialogBatchCode(null)}
          />
          <HButton
            size="small"
            label="label.batchmaster.abort"
            margin="0"
            disabled={abortInProgress}
            onClick={handleConfirmAbort}
          />
        </DialogActions>
      </HDialog>
    </Box>
  );
};

export default BatchMaster;
