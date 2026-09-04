import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { HAxiosService, HAgGrid, SearchCommonBox, useToast } from "@helix/component-library";
import { BatchMastersAPI } from "./apiEndpoints";
import { unwrapCommonResponse } from "./unwrapCommonResponse";
import { useIntl } from "react-intl";


import { SEARCH_API_ENDPOINTS } from "@shared/config/apiConstants.jsx";

import { gridProcessIdDefObj } from "../../../common/components/SearchGridDefObj";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const parseDepIds = (depProcessIds) => {
  if (depProcessIds == null || String(depProcessIds).trim() === "") return [];
  return String(depProcessIds)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => !Number.isNaN(n));
};


const ProcessIdSearchRenderer = (props) => {
  const { value, node } = props;
  let pid=Number(value);
  return (
    <SearchCommonBox
      apiEndpoint={SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK()}
      searchCode="PROCESSID"
      setSelectedValue={(dataValue, row) => { 
        pid=Number(dataValue);
        node.setDataValue("processId", String(dataValue) || value);
        if (row?.szProcessName) {
          node.setDataValue("processName", row.szProcessName);
        }
        if (row?.szInvokeType) {
          node.setDataValue("invokeType", row.szInvokeType);
        }
        if (row?.szServiceName) {
          node.setDataValue("serviceName", row.szServiceName);
        }
        if (row?.szApiPathOrTopic) {
          node.setDataValue("apiPathOrTopic", row.szApiPathOrTopic);
        }
        if (row?.szParameters) {
          node.setDataValue("parameters", row.szParameters);
        }
      }}
      selectedValue={pid}
      selectedColumn="iProcessId"
      gridDefObj={gridProcessIdDefObj}
      gridWidth={300}
      gridHeight={300}
      gridNoOfRowsPerPage={5}
      searchBoxWidth={120}
      searchBoxHeight={30}
      searchBoxFontSize={11}
      error={false}
    />
  );
};

export const rowToBatchProcessBody = (row, batchCode) => ({
  batchCode,
  processId: Number(row.processId),
  serialNo: row.serialNo != null ? Number(row.serialNo) : null,
  processName: row.processName ?? null,
  processDesc: row.processDesc ?? null,
  invokeType: row.invokeType ?? "API",
  serviceName: row.serviceName ?? null,
  apiPathOrTopic: row.apiPathOrTopic ?? null,
  partitionType: row.partitionType ?? null,
  parameters: row.parameters ?? null,
  depProcessIds:null,
  dependentProcessIds: parseDepIds(row.dependentProcessIds),
  estimatedTime: row.estimatedTime ?? null,
  skipProcess: row.skipProcess ?? "N",
  mandatory: row.mandatory ?? "Y",
});

/**
 * @param {{ batchCode: string, gridMinHeight?: string | number, hideInternalSaveButton?: boolean }} props
 */
const BatchProcessGridPanel = forwardRef(function BatchProcessGridPanel(
  { batchCode, gridMinHeight = "420px", hideInternalSaveButton = false },
  ref
) {
  const intl = useIntl();
  const toast = useToast();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const code = batchCode?.trim() ?? "";
  const DependentProcessSearchRenderer = useCallback(
    (props) => {
      const { value, node, data } = props;

      return (
        <SearchCommonBox
          multiSelect={true}
          apiEndpoint={SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK()}
          searchCode="PROCESSID"
          setSelectedValue={(selectedIds) => {
            // selectedIds is an array of iProcessId values returned by SearchCommonBox multiSelect
            const filtered = selectedIds.filter(
              (id) => String(id).trim() !== String(data?.processId ?? "").trim()
            );

            if (filtered.length < selectedIds.length) {
              toast.warning(
                intl.formatMessage({
                  id: "batchframework.toast.dependentProcessSameAsProcess",
                  defaultMessage: "Dependent process cannot be same as process id",
                })
              );
            }
           node.setDataValue("dependentProcessIds", filtered);
          }}
          selectedValue={value}
          selectedColumn="iProcessId"
          gridDefObj={gridProcessIdDefObj}
          gridWidth={350}
          gridHeight={300}
          gridNoOfRowsPerPage={5}
          searchBoxWidth={350}
          searchBoxHeight={30}
          searchBoxFontSize={11}
          translate={false}
          error={false}
        />
      );
    },
    [intl, toast]
  );



  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.processId",
          defaultMessage: "Process id",
        }),
        field: "processId",
        width: 160,
        editable: false,
        filter: false,
        required: true,
        type: "numericColumn",
        cellRenderer: ProcessIdSearchRenderer,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.serial",
          defaultMessage: "Serial",
        }),
        field: "serialNo",
        width: 80,
        editable: true,
        filter: false,
        type: "numericColumn",
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.name",
          defaultMessage: "Name",
        }),
        field: "processName",
        width: 150,
        editable: false,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.depIds",
          defaultMessage: "Dependent processes (comma-separated ids)",
        }),
        field: "dependentProcessIds",
        width: 380,
        editable: false,
        filter: false,
        cellRenderer: DependentProcessSearchRenderer,
        valueFormatter: (params) => {
          if (params.value == null || params.value === "") return "";
          const num = Number(params.value);
          return isNaN(num) ? "" : String(num);
        },
        valueParser: (params) => {
          if (params.newValue === "" || params.newValue == null) return null;
          const num = Number(params.newValue);
          return isNaN(num) ? null : num;
        },
      
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.invokeType",
          defaultMessage: "Type",
        }),
        field: "invokeType",
        width: 100,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["API", "Event"] },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.serviceName",
          defaultMessage: "Service name",
        }),
        field: "serviceName",
        width: 150,
        editable: true,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.apiPathOrTopic",
          defaultMessage: "API path / topic name",
        }),
        field: "apiPathOrTopic",
        width: 220,
        editable: true,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.params",
          defaultMessage: "Parameters",
        }),
        field: "parameters",
        width: 180,
        editable: true,
        filter: false,
      },
      // WITH these:
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.skip",
          defaultMessage: "Skip",
        }),
        field: "skipProcess",
        width: 70,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.skipProcess === "Y",
        valueSetter: (params) => {
          params.data.skipProcess = params.newValue ? "Y" : "N";
          return true;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.batchprocess.mandatory",
          defaultMessage: "Mandatory",
        }),
        field: "mandatory",
        width: 90,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.mandatory === "Y",
        valueSetter: (params) => {
          params.data.mandatory = params.newValue ? "Y" : "N";
          return true;
        },
      },
    ],
    [DependentProcessSearchRenderer, intl]
  );

  const loadBatchProcesses = useCallback(() => {
    if (!code) {
      setRowData([]);
      return;
    }
    HAxiosService.GET(BatchMastersAPI.BatchProcesses(code,"EC-BatchProcessMaster"))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        setRowData(
          data.map((item) => ({
            id: String(item.processId),
            ...item,
            dependentProcessIds:
            item.dependentProcessIds ||
              item.depProcessIds ,
            isPersisted: true,
          }))
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "batchframework.toast.loadBatchProcessesFailed",
            defaultMessage: "Failed to load batch processes",
          })
        );
        setRowData([]);
      });
  }, [code, intl, toast]);

  useImperativeHandle(
    ref,
    () => ({
      submitChanges: () => gridRef.current?.submitChanges?.(),
      reload: () => loadBatchProcesses(),
    }),
    [loadBatchProcesses]
  );

  useEffect(() => {
    loadBatchProcesses();
  }, [loadBatchProcesses]);

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    if (!code) {
      toast.warning(
        intl.formatMessage({
          id: "batchframework.toast.enterBatchBeforeSave",
          defaultMessage: "Enter batch code and load before saving",
        })
      );
      return { success: false };
    }
    try {
     const response= await HAxiosService.POST(BatchMastersAPI.BatchProcesses(code,"EC-BatchProcessMaster"), {
        deletedProcessIds: deletedRows
          .map((row) => row.processId)
          .filter((id) => id != null),
        created: newRows.map((row) => rowToBatchProcessBody(row, code)),
        updated: updatedRows.map((row) => rowToBatchProcessBody(row, code)),
      });
       if (response.data.status?.toLowerCase() === "success") {
              toast.success(
        intl.formatMessage({
          id: "batchframework.toast.batchProcessSaved",
          defaultMessage: "Batch processes saved",
        })
      );
      return { success: true };
       }
       return { success: false, message:response.data.message}
      loadBatchProcesses();

    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "batchframework.toast.saveFailed",
          defaultMessage: "Save failed",
        })
      );
      return { success: false,message:response.data.message };
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <HAgGrid
        ref={gridRef}
        key={intl.locale}
        rowData={rowData}
        columnDefs={columnDefs}
        gridStyle={{ width: "100%", height:"100%", marginTop: "12px" }}
        pagination
        paginationPageSize={10}
        sort
        globalSearch={false}
        allowAdd
        allowDelete
        allowUpdate
        rowDragging={false}
        onSave={handleSave}
        hideInternalSaveButton={hideInternalSaveButton}
      />
    </Box>
  );
});

export default BatchProcessGridPanel;
