import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HAgGrid, HBox, HButtonBar, HPaper, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { BatchMastersAPI } from "./apiEndpoints";
import { unwrapCommonResponse } from "./unwrapCommonResponse";
import { useIntl } from "react-intl";
import { useNavigate,useLocation } from "react-router-dom";
import { Box } from "@mui/material";

const rowToProcessBody = (row) => ({
  processId: row.processId != null && row.processId !== "" ? Number(row.processId) : null,
  processName: row.processName ?? null,
  processDesc: row.processDesc ?? null,
  estimatedTime: row.estimatedTime ?? null,
  skipProcess: row.skipProcess ?? "N",
  mandatory: row.mandatory ?? "Y",
  invokeType: row.invokeType ?? "API",
  serviceName: row.serviceName ?? null,
  apiPathOrTopic: row.apiPathOrTopic ?? null,
  parameters: row.parameters ?? null,
  partitionType: row.partitionType ?? "DEFAULT",
});

const ProcessMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = useState(["DEFAULT"]);
  const [serviceNameValues, setServiceNameValues] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const loadPartitionTypes = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.listPartitionTypes(screenMenuId))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        const types = [...new Set(data.map((t) => t.partitionType).filter(Boolean))];
        setPartitionTypeValues(types.length > 0 ? types : ["DEFAULT"]);
      })
      .catch(() => {
        setPartitionTypeValues(["DEFAULT"]);
      });
  }, []);

  const loadServiceNames = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.ProcessMaster(screenMenuId) + `/configured-services`)
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        const names = [...new Set(data.map((s) => s.serviceName).filter(Boolean))];
        setServiceNameValues(names);
      })
      .catch(() => {
        setServiceNameValues([]);
      });
  }, []);

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.id",
          defaultMessage: "Process Id",
        }),
        field: "processId",
        width: 110,
        editable: true,
        filter: false,
        type: "numericColumn",
        required: true,
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
          id: "label.processmaster.name",
          defaultMessage: "Name",
        }),
        field: "processName",
        width: 160,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.desc",
          defaultMessage: "Description",
        }),
        field: "processDesc",
        width: 180,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.invokeType",
          defaultMessage: "Type",
        }),
        field: "invokeType",
        width: 100,
        editable: true,
        filter: false,
        required: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["API", "Event"] },
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.serviceName",
          defaultMessage: "Service name",
        }),
        field: "serviceName",
        width: 160,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: serviceNameValues },
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.apiPathOrTopic",
          defaultMessage: "API Path / Topic Name",
        }),
        field: "apiPathOrTopic",
        width: 220,
        editable: true,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.params",
          defaultMessage: "Parameters",
        }),
        field: "parameters",
        width: 200,
        editable: true,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.processmaster.partitionType",
          defaultMessage: "Partition type",
        }),
        field: "partitionType",
        width: 160,
        editable: true,
        filter: false,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues },
      },
    ],
    [intl, partitionTypeValues, serviceNameValues]
  );

  const refreshData = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.ProcessMaster(screenMenuId))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        setRowData(
          data.map((item) => ({
            id: String(item.processId),
            ...item,
            isPersisted: true,
          }))
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "batchframework.toast.loadProcessesFailed",
            defaultMessage: "Failed to load processes",
          })
        );
        setRowData([]);
      });
  }, [intl, toast]);

  useEffect(() => {
    loadPartitionTypes();
    loadServiceNames();
  }, [loadPartitionTypes, loadServiceNames]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      for (const row of deletedRows) {
        if (row.processId != null) {
          await HAxiosService.DELETE(BatchMastersAPI.ProcessMaster(screenMenuId) + `/${row.processId}`);
        }
      }
      for (const row of newRows) {
        await HAxiosService.POST(BatchMastersAPI.ProcessMaster(screenMenuId), rowToProcessBody(row));
      }
      for (const row of updatedRows) {
        await HAxiosService.PUT(BatchMastersAPI.ProcessMaster(screenMenuId) + `/${row.processId}`, rowToProcessBody(row));
      }
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.processSaved",
          defaultMessage: "Process master saved",
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
          id: "label.ProcessMaster.title",
          defaultMessage: "Process master",
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
            loadServiceNames();
          }}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default ProcessMaster;
