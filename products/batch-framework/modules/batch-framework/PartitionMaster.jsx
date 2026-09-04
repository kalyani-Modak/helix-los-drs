import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HAgGrid, HBox, HButtonBar, HPaper, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { BatchMastersAPI } from "./apiEndpoints";
import { unwrapCommonResponse } from "./unwrapCommonResponse";
import { useIntl } from "react-intl";

import { useNavigate } from "react-router-dom";


import { Box } from "@mui/material";
 import { useLocation } from "react-router-dom";

const rowToPartitionBody = (row) => ({
  partitionCode: row.partitionCode,
  partitionType: row.partitionType,
  description: row.description,
  dependency: row.dependency ?? null,
  active: row.active ?? "Y",
});

const PartitionMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [partitionTypeValues, setPartitionTypeValues] = useState([]);
  
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

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.type",
          defaultMessage: "Partition type",
        }),
        field: "partitionType",
        width: 200,
        editable: true,
        filter: true,
        required: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: partitionTypeValues },
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.code",
          defaultMessage: "Partition code",
        }),
        field: "partitionCode",
        width: 200,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.desc",
          defaultMessage: "Description",
        }),
        field: "description",
        width: 200,
        editable: true,
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitionmaster.active",
          defaultMessage: "Active",
        }),
        field: "active",
        width: 80,
        editable: true,
        filter: false,
        cellDataType: "boolean",
        cellRenderer: "agCheckboxCellRenderer",
        valueGetter: (params) => params.data.active === "Y",
        valueSetter: (params) => {
          params.data.active = params.newValue ? "Y" : "N";
          return true;
        },
      },
    ],
    [intl, partitionTypeValues]
  );

  const refreshData = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.PartitionMaster(screenMenuId))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        setRowData(
          data.map((item) => ({
            id: `${item.partitionCode}|${item.partitionType}`,
            ...item,
            isPersisted: true,
          }))
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "batchframework.toast.loadPartitionsFailed",
            defaultMessage: "Failed to load partitions",
          })
        );
        setRowData([]);
      });
  }, [intl, toast]);

  useEffect(() => {
    loadPartitionTypes();
  }, [loadPartitionTypes]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      await HAxiosService.POST(BatchMastersAPI.PartitionMaster(screenMenuId), {
        created: newRows.map(rowToPartitionBody),
        updated: updatedRows.map(rowToPartitionBody),
        deleted: deletedRows.map((r) => ({
          partitionCode: r.partitionCode,
          partitionType: r.partitionType,
        })),
      });
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.partitionSaved",
          defaultMessage: "Partition master saved",
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
            <HBreadCrumb/>
      <TitleBar
        title={intl.formatMessage({
          id: "label.PartitionMaster.title",
          defaultMessage: "Partition master",
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
            paginationPageSize={8}
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
    </Box>
  );
};

export default PartitionMaster;
