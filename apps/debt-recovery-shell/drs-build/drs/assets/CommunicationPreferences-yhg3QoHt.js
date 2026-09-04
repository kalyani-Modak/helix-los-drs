import { ed as useIntl, ct as ar, dN as reactExports, bx as React, dB as jsxRuntimeExports, v as Box, dK as ps, bH as SE, cs as ap, cy as bu, b0 as Lg, bJ as SaveIcon, aX as Kr } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
const CommunicationPreferences = () => {
  const intl = useIntl();
  const toast = ar();
  const [language, setLanguage] = reactExports.useState("Select a Value");
  const customGridStyle = {
    width: "100%",
    height: "28vh",
    minWidth: "600px",
    overflowX: "auto"
  };
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0")
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0")
  }));
  const initialRows = reactExports.useMemo(
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
        Sun: false
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
        Sun: false
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
        Sun: false
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
        Sun: false
      }
    ],
    [intl]
  );
  const [rows, setRows] = reactExports.useState(initialRows);
  React.useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);
  const columnDefs = reactExports.useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.MailType.Email Type"
        }),
        field: "szMailType",
        flex: 1
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.allow"
        }),
        field: "allow",
        flex: 1,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              onChange: (e) => handleCellValueChange(rowIndex, "allow", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Best Time (HH:MM)"
        }),
        field: "bestTime",
        flex: 1.5,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          const rowData = params.data;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px", width: "100%" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: rowData.bestTimeHH || "",
                disabled: isDisabled,
                onChange: (e) => handleCellValueChange(rowIndex, "bestTimeHH", e.target.value),
                style: {
                  flex: 1,
                  padding: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: isDisabled ? "#f5f5f5" : "white"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "HH" }),
                  hours.map((hour) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: hour.value, children: hour.label }, hour.value))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ":" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: rowData.bestTimeMM || "",
                disabled: isDisabled,
                onChange: (e) => handleCellValueChange(rowIndex, "bestTimeMM", e.target.value),
                style: {
                  flex: 1,
                  padding: "4px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: isDisabled ? "#f5f5f5" : "white"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "MM" }),
                  minutes.map((minute) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: minute.value, children: minute.label }, minute.value))
                ]
              }
            )
          ] });
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Mon"
        }),
        field: "Mon",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Mon", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Tue"
        }),
        field: "Tue",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Tue", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Wed"
        }),
        field: "Wed",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Wed", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Thu"
        }),
        field: "Thu",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Thu", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Fri"
        }),
        field: "Fri",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Fri", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Sat"
        }),
        field: "Sat",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Sat", e.target.checked)
            }
          );
        },
        editable: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.CommunicationPreferences.Sun"
        }),
        field: "Sun",
        flex: 0.7,
        cellRenderer: (params) => {
          const rowIndex = params.node.rowIndex;
          const isDisabled = !params.data.allow;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: params.value || false,
              disabled: isDisabled,
              onChange: (e) => handleCellValueChange(rowIndex, "Sun", e.target.checked)
            }
          );
        },
        editable: false
      }
    ],
    [intl, hours, minutes]
  );
  const handleCellValueChange = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: value
      };
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
          Sun: false
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
              sunday: row.Sun ? "Y" : "N"
            }
          }))
        }
      };
      const response = await Kr.POST(
        "/api/communication-preferences/save",
        requestData
      );
      if (response.data.status === "200") {
        toast.success(
          intl.formatMessage({
            id: "success.CommunicationPreferences.saved"
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.CommunicationPreferences.title" }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", gap: 1, p: 1, mb: 2 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.CommunicationPreferences.Language"
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SE,
              {
                name: "language",
                value: language,
                onChange: (e) => setLanguage(e.target.value),
                options: [
                  { label: "English", value: "English" },
                  { label: "Hindi", value: "Hindi" },
                  { label: "Tamil", value: "Tamil" },
                  { label: "Marathi", value: "Marathi" }
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.CommunicationPreferences.Contact No"
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { editable: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { className: "label-textfield-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({
                  id: "label.CommunicationPreferences.Email Id"
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ap, { editable: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            rowData: rows,
            columnDefs,
            gridStyle: customGridStyle
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", justifyContent: "flex-end", mt: 2, mr: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            id: "save-btn",
            label: "button.save",
            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}),
            onClick: handleSave,
            align: "end"
          }
        ) })
      ]
    }
  );
};
export {
  CommunicationPreferences as default
};
