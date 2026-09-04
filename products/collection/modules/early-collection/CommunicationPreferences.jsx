import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { Save } from "@mui/icons-material";
import { useToast, HAxiosService, HButton, HDropdown, HLabel, HTextField, HAgGrid } from "@helix/component-library";

import FunctionLayout from "./FunctionLayout";
import { use } from "react";


const CommunicationPreferences = () => {
  const intl = useIntl();
  const toast = useToast();
  const [language, setLanguage] = useState("Select a Value");

  const customGridStyle = {
    width: "100%",
    height: "28vh",
    minWidth: "600px",
    overflowX: "auto",
  };

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0')
  }));

  // Use useMemo for rows data to re-render when intl changes
  const initialRows = useMemo(
    () => [
      {
        szMailType: intl.formatMessage({ id: "label.MailType.Email" }),
        allow: false,
        bestTimeHH: "",
        bestTimeMM: "",
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
      {
        szMailType: intl.formatMessage({ id: "label.MailType.Letter" }),
        allow: false,
        bestTimeHH: "",
        bestTimeMM: "",
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
      {
        szMailType: intl.formatMessage({ id: "label.MailType.SMS" }),
        allow: false,
        bestTimeHH: "",
        bestTimeMM: "",
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
      {
        szMailType: intl.formatMessage({ id: "label.MailType.Voice Broadcast" }),
        allow: false,
        bestTimeHH: "",
        bestTimeMM: "",
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
    ],
    [intl]
  );

  const [rows, setRows] = useState(initialRows);

  // Update rows when intl changes
  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);
  
  // Use useMemo for column definitions to re-render when intl changes
  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.MailType.Email Type",
        }),
        field: "szMailType",
        flex: 1,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.allow",
        }),
        field: "allow",
        flex: 1,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "allow", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Best Time (HH:MM)",
        }),
        field: "bestTime",
        flex: 1.5,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          const rowData = params.data;
          
          return (
            <div style={{ display: "flex", alignItems: "center", gap: "4px", width: "100%" }}>
              <select
                value={rowData.bestTimeHH || ""}
                disabled={isDisabled}
                onChange={(e) => handleCellValueChange(rowIndex, "bestTimeHH", e.target.value)}
                style={{
                  flex: 1,
                  padding: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: isDisabled ? "#f5f5f5" : "white",
                }}
              >
                <option value="">HH</option>
                {hours.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
              <span>:</span>
              <select
                value={rowData.bestTimeMM || ""}
                disabled={isDisabled}
                onChange={(e) => handleCellValueChange(rowIndex, "bestTimeMM", e.target.value)}
                style={{
                  flex: 1,
                  padding: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: isDisabled ? "#f5f5f5" : "white",
                }}
              >
                <option value="">MM</option>
                {minutes.map((minute) => (
                  <option key={minute.value} value={minute.value}>
                    {minute.label}
                  </option>
                ))}
              </select>
            </div>
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Mon",
        }),
        field: "Mon",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Mon", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Tue",
        }),
        field: "Tue",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Tue", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Wed",
        }),
        field: "Wed",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Wed", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Thu",
        }),
        field: "Thu",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Thu", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Fri",
        }),
        field: "Fri",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Fri", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Sat",
        }),
        field: "Sat",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Sat", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Sun",
        }),
        field: "Sun",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return (
            <input
              type="checkbox"
              checked={params.value || false}
              disabled={isDisabled}
              onChange={(e) =>
                handleCellValueChange(rowIndex, "Sun", e.target.checked)
              }
            />
          );
        },
        editable: false,
      },
    ], 
    [intl, hours, minutes]
  );

  const handleCellValueChange = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: value,
      };

      // If 'allow' is unchecked, reset all other fields for that row
      if (field === "allow" && !value) {
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          bestTimeHH: "",
          bestTimeMM: "",
          Mon: false,
          Tue: false,
          Wed: false,
          Thu: false,
          Fri: false,
          Sat: false,
          Sun: false,
        };
      }

      return updatedRows;
    });
  };

  const handleSave = async () => {
    try {
      const requestData = {
        communicationPreferencesDto: {
          preferences: rows.map((row) => ({
            mailType: row.szMailType,
            isAllowed: row.allow ? "Y" : "N",
            bestTime: row.bestTimeHH && row.bestTimeMM ? `${row.bestTimeHH}:${row.bestTimeMM}` : "",
            weekDays: {
              monday: row.Mon ? "Y" : "N",
              tuesday: row.Tue ? "Y" : "N",
              wednesday: row.Wed ? "Y" : "N",
              thursday: row.Thu ? "Y" : "N",
              friday: row.Fri ? "Y" : "N",
              saturday: row.Sat ? "Y" : "N",
              sunday: row.Sun ? "Y" : "N",
            },
          })),
        },
      };

      const response = await HAxiosService.POST(
        "/api/communication-preferences/save",
        requestData
      );

      if (response.data.status === "200") {
        toast.success(
          intl.formatMessage({
            id: "success.CommunicationPreferences.saved",
          })
        );
      } else {
        toast.error(response.data.message || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving communication preferences:", error);
      toast.error("Error saving communication preferences");
    }
  };

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.CommunicationPreferences.title" })}
    >
      <Box sx={{ display: "flex", gap: 1, p: 1, mb: 2 }}>
        <Box className="label-textfield-row">
          <HLabel
            value={intl.formatMessage({
              id: "label.CommunicationPreferences.Language",
            })}
          />
          <HDropdown
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { label: "English", value: "English" },
              { label: "Hindi", value: "Hindi" },
              { label: "Tamil", value: "Tamil" },
              { label: "Marathi", value: "Marathi" },
            ]}
          />
        </Box>

        <Box className="label-textfield-row">
          <HLabel
            value={intl.formatMessage({
              id: "label.CommunicationPreferences.Contact No",
            })}
          />
          <HTextField editable={true} />
        </Box>

        <Box className="label-textfield-row">
          <HLabel
            value={intl.formatMessage({
              id: "label.CommunicationPreferences.Email Id",
            })}
          />
          <HTextField editable={true} />
        </Box>
      </Box>

      <HAgGrid
        rowData={rows}
        columnDefs={columnDefs}
        gridStyle={customGridStyle}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, mr: 2 }}>
        <HButton
          id="save-btn"
          label="button.save"
          startIcon={<Save />}
          onClick={handleSave}
          align="end"
        />
      </Box>

    </FunctionLayout>
  );
};

export default CommunicationPreferences;
