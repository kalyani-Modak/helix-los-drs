import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { HAxiosService, HBox, HButton, HLabel, useDrsTheme, HAgGrid, useToast } from "@helix/component-library";
import { IntegrationFrameworkAPI } from "./apiEndpoints";

import { useIntl } from "react-intl";
import { fontSize } from "@mui/system";


const DataTable = ({ data, onDelete }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [page, setPage] = useState(0);
  const toast = useToast();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const intl = useIntl();
  const { surfaces, text, colors } = useDrsTheme();
  const gridRef = useRef();

  const rowData = data.map(item => ({
    jsonData: JSON.stringify(item),
    originalData: item,
  }));


  const handleRetry = async () => {
    const selectedRows = gridRef.current.api
      .getSelectedRows()
      .map((row) => row.originalData);

    if (selectedRows.length === 0) {
      toast.error(intl.formatMessage({
        id: "error.select.row",
        defaultMessage: "Please select at least one row to retry."
      }));
      return;
    }

    const modifiedTopicName = `${localStorage.getItem("topicName")}_retryTopic`;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("topicName", modifiedTopicName);
      formDataToSend.append("rowData", JSON.stringify(selectedRows));
      await HAxiosService.POST(IntegrationFrameworkAPI.sendRetryData, formDataToSend, {}, false, { "Content-Type": "multipart/form-data" });

      const formDataToSend1 = new FormData();
      formDataToSend1.append("topicName", modifiedTopicName);
      formDataToSend1.append("rowData", JSON.stringify(selectedRows));
      await HAxiosService.POST(IntegrationFrameworkAPI.deleteData, formDataToSend1, {}, false, { "Content-Type": "multipart/form-data" });

      toast.success(intl.formatMessage({
        id: "success.sent.delete",
        defaultMessage: "Data sent and deleted successfully"
      }));

      onDelete(); // Refresh data after deletion
    } catch (error) {
      console.error("Error during retry:", error);
      toast.error(intl.formatMessage({
        id: "error.fetch.retry",
        defaultMessage: "An error occurred during retry."
      }));
    }
  };


  const columnDefs = [
    {
      headerName:intl.formatMessage({id:"label.column.data",defaultMessage: "Data"}),
      field: "jsonData",
      flex: 1,
      editable: false,
    },
  ];

  if (!data || data.length === 0) {
    return (
      <HLabel
        value={intl.formatMessage({ id: "label.no.data", defaultMessage: "No data available" })}
        colon={false}
        color="text.secondary"
        sx={{ textAlign: "center", mt: 2, fontSize: "14px" }}
      />
    );
  }

  return (
    <>
      <HBox
        sx={{
          display: "flex",
          justifyContent: "end",
          bgcolor: "transparent"
        }}
      >
        <HButton
          label={selectAll ?
                 intl.formatMessage({ id: "label.retry.all", defaultMessage: "Retry All Selected Data" })
                 : intl.formatMessage({ id: "label.retry.selected", defaultMessage: "Retry selected data" })}
          variant="outlined"
          onClick={handleRetry}
          size="small"
        />
      </HBox>
      <HBox
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
          bgcolor: "transparent"
        }}
      >
        <HAgGrid
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          allowUpdate={false}
          allowAdd={false}
          allowDelete={false}
          addCheckBoxes={true}
          sort={false}
        />
      </HBox>
    </>
  );
};

export default DataTable;
