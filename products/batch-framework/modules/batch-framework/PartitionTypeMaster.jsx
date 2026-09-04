import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HAgGrid, HBox, HButtonBar, HPaper, TitleBar, HBreadCrumb, useToast } from "@helix/component-library";
import { BatchMastersAPI } from "./apiEndpoints";
import { unwrapCommonResponse } from "./unwrapCommonResponse";
import { useIntl } from "react-intl";
import { Box } from "@mui/material";
import { useNavigate,useLocation } from "react-router-dom";

const rowToPartitionTypeBody = (row) => ({
  partitionType: row.partitionType,
  description: row.description,
  active: row.active ?? "Y",
});

const PartitionTypeMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.partitiontypemaster.type",
          defaultMessage: "Partition type",
        }),
        field: "partitionType",
        width: 180,
        editable: (params) => params.data?.mode === "N",
        filter: false,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.partitiontypemaster.desc",
          defaultMessage: "Description",
        }),
        field: "description",
        width: 280,
        editable: true,
        filter: false,
        required: true,
      },
      // WITH this:
      {
        headerName: intl.formatMessage({
          id: "label.partitiontypemaster.active",
          defaultMessage: "Active",
        }),
        field: "active",
        width: 90,
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
    [intl]
  );

  const refreshData = useCallback(() => {
    HAxiosService.GET(BatchMastersAPI.listPartitionTypes(screenMenuId))
      .then((res) => {
        const payload = unwrapCommonResponse(res);
        const data = Array.isArray(payload) ? payload : [];
        setRowData(
          data.map((item) => ({
            id: String(item.partitionType),
            ...item,
            isPersisted: true,
          }))
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "batchframework.toast.loadPartitionTypesFailed",
            defaultMessage: "Failed to load partition types",
          })
        );
        setRowData([]);
      });
  }, [intl, toast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    try {
      await HAxiosService.POST(BatchMastersAPI.updatePartitionTypes(screenMenuId), {
        created: newRows.map(rowToPartitionTypeBody),
        updated: updatedRows.map(rowToPartitionTypeBody),
        deleted: deletedRows.map((r) => ({ partitionType: r.partitionType })),
      });
      toast.success(
        intl.formatMessage({
          id: "batchframework.toast.partitionTypesSaved",
          defaultMessage: "Partition types saved",
        })
      );
      refreshData();
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
          id: "label.PartitionTypeMaster.title",
          defaultMessage: "Partition types",
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
          onReset={() => refreshData()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default PartitionTypeMaster;
