import { em as useTheme, dN as reactExports, ed as useIntl, dB as jsxRuntimeExports, aY as LE, v as Box, cf as Typography, cy as bu, cc as Tooltip, aR as IconButton, O as CloseIcon, bJ as SaveIcon, eh as useNavigate, ct as ar, ef as useLocation, aX as Kr, e as ActionMasterAPI, ac as Dt, cx as bp, ep as vp, dK as ps, b0 as Lg, cs as ap, bH as SE, cj as Vg, cJ as dc, dg as gridFeeCodeDefObj, bI as SEARCH_API_ENDPOINTS } from "./index-BhdgJqva.js";
const ActionResultDialog = ({
  open,
  parentType,
  parentData,
  mappingList = [],
  onClose,
  onSave
}) => {
  const theme = useTheme();
  const gridRef = reactExports.useRef(null);
  const intl = useIntl();
  const selectionAppliedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!open || !mappingList.length) {
      selectionAppliedRef.current = false;
      return;
    }
    const applySelection = () => {
      var _a;
      const api = (_a = gridRef.current) == null ? void 0 : _a.api;
      if (!api) return false;
      const rowsCount = api.getDisplayedRowCount();
      if (rowsCount === 0 && mappingList.length > 0) {
        return false;
      }
      api.deselectAll();
      const nodesToSelect = [];
      api.forEachNode((node) => {
        if (node.data.chSelected === "Y") {
          nodesToSelect.push(node);
        }
      });
      if (nodesToSelect.length) {
        api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
      }
      selectionAppliedRef.current = true;
      return true;
    };
    if (selectionAppliedRef.current) return;
    if (applySelection()) return;
    const delays = [50, 100, 200];
    let attempts = 0;
    let timeoutId;
    const tryAgain = () => {
      if (applySelection()) return;
      attempts++;
      if (attempts < delays.length) {
        timeoutId = setTimeout(tryAgain, delays[attempts]);
      }
    };
    timeoutId = setTimeout(tryAgain, delays[0]);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, mappingList]);
  const columnDefs = reactExports.useMemo(() => {
    if (parentType === "ACTION") {
      return [
        {
          headerName: intl.formatMessage({
            id: "label.ActionResultDialog.ResultCode",
            defaultMessage: "Result Code"
          }),
          field: "szResultCode",
          width: 150,
          filter: false
        },
        {
          headerName: intl.formatMessage({
            id: "label.ActionResultDialog.ResultName",
            defaultMessage: "Result Name"
          }),
          field: "szResultName",
          flex: 1,
          filter: false
        }
      ];
    }
    return [
      {
        headerName: intl.formatMessage({
          id: "label.ActionResultDialog.ActionCode",
          defaultMessage: "Action Code"
        }),
        field: "szActionCode",
        width: 150,
        filter: false
      },
      {
        headerName: intl.formatMessage({
          id: "label.ActionResultDialog.ActionDescription",
          defaultMessage: "Action Description"
        }),
        field: "szActionDesc",
        flex: 1,
        filter: false
      }
    ];
  }, [parentType, intl.locale]);
  const handleSave = () => {
    var _a;
    const selectedRows = ((_a = gridRef.current) == null ? void 0 : _a.api.getSelectedRows()) || [];
    const selectedCodes = selectedRows.map(
      (row) => parentType === "ACTION" ? row.szResultCode : row.szActionCode
    );
    if (parentType === "ACTION") {
      onSave({
        szActionCode: parentData.szActionCode,
        selectedResults: selectedCodes
      });
    } else {
      onSave({
        szResultCode: parentData.szResultCode,
        selectedActions: selectedCodes
      });
    }
  };
  if (!parentData) return null;
  const dialogTitle = parentType === "ACTION" ? intl.formatMessage({
    id: "label.ActionResultDialog.PossibleResults"
  }) : intl.formatMessage({
    id: "label.ActionResultDialog.AvailableActions"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    LE,
    {
      open,
      onClose,
      maxWidth: "sm",
      fullWidth: true,
      header: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bar-container", sx: { py: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-bar-text", children: dialogTitle }) }),
      contentProps: { dividers: true },
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { mr: "20px", display: "flex", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Cancel", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { title: "Save", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: handleSave, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}) }) })
      ] }),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box,
          {
            className: "title-bar-container",
            sx: { display: "flex", alignItems: "center", gap: 4, mb: 1, px: 1.5, py: 0.75, borderRadius: "4px" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Typography,
                {
                  variant: "subtitle2",
                  sx: { display: "flex", alignItems: "center", gap: 0.5 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Box,
                      {
                        component: "span",
                        className: "title-bar-text",
                        sx: { fontWeight: 600 },
                        children: [
                          parentType === "ACTION" ? intl.formatMessage({
                            id: "label.ActionResultDialog.ActionCode"
                          }) : intl.formatMessage({
                            id: "label.ActionResultDialog.ResultCode"
                          }),
                          ":"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { component: "span", sx: { color: theme.palette.text.secondary }, children: parentType === "ACTION" ? parentData.szActionCode : parentData.szResultCode })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Typography,
                {
                  variant: "subtitle2",
                  sx: { display: "flex", alignItems: "center", gap: 0.5 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Box,
                      {
                        component: "span",
                        className: "title-bar-text",
                        sx: { fontWeight: 600 },
                        children: [
                          intl.formatMessage({
                            id: "label.ActionResultDialog.Description"
                          }),
                          ":"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { component: "span", sx: { color: theme.palette.text.secondary }, children: parentType === "ACTION" ? parentData.szActionDesc : parentData.szResultName })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          bu,
          {
            ref: gridRef,
            rowData: mappingList,
            columnDefs,
            addCheckBoxes: true,
            pagination: true,
            paginationPageSize: 5,
            sort: true,
            allowAdd: false,
            allowDelete: false,
            allowUpdate: false,
            hideInternalSaveButton: true,
            gridStyle: { width: "100%", height: "250px" }
          }
        )
      ]
    }
  );
};
const EMPTY_FILTER = {
  action: "",
  description: "",
  actionType: "",
  party: "",
  mode: "",
  place: ""
};
function feeMethodNeeds(method) {
  const m = method || "None";
  return {
    flat: m === "Flat Only" || m === "Flat + %" || m === "Maximum of flat & %" || m === "Minimum of flat & %",
    pct: m === "% Only" || m === "Flat + %" || m === "Maximum of flat & %" || m === "Minimum of flat & %",
    base: m !== "None" && m !== "Flat Only"
  };
}
function rowMatchesFilter(data, f) {
  if (!data || data._deleted) return true;
  const code = String(data.szActionCode || "").toLowerCase();
  const desc = String(data.szActionDesc || "").toLowerCase();
  if (f.action && !code.includes(String(f.action).toLowerCase().trim())) return false;
  if (f.description && !desc.includes(String(f.description).toLowerCase().trim())) return false;
  if (f.actionType && String(data.szActionName || "") !== f.actionType) return false;
  if (f.party && String(data.szPartyContacted || "") !== f.party) return false;
  if (f.mode && String(data.szModeContact || "") !== f.mode) return false;
  if (f.place && String(data.szPlaceContact || "") !== f.place) return false;
  return true;
}
const FeeCodeSearchRenderer = (props) => {
  const { value, node } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    dc,
    {
      apiEndpoint: SEARCH_API_ENDPOINTS.COMMON_MASTER(),
      searchCode: "FEECODE",
      setSelectedValue: (dataValue) => node.setDataValue("szFeeCode", dataValue || value),
      selectedValue: value,
      selectedColumn: "szfeecode",
      gridDefObj: gridFeeCodeDefObj,
      gridWidth: 350,
      gridHeight: 300,
      gridNoOfRowsPerPage: 2,
      searchBoxWidth: 125,
      searchBoxHeight: 35,
      searchBoxFontSize: 12,
      error: false
    }
  );
};
const GlobalActions = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const gridRef = reactExports.useRef(null);
  const [rowData, setRowData] = reactExports.useState([]);
  const [openResultPopup, setOpenResultPopup] = reactExports.useState(false);
  const [selectedAction, setSelectedAction] = reactExports.useState(null);
  const [resultsList, setResultsList] = reactExports.useState([]);
  const [filtersOpen, setFiltersOpen] = reactExports.useState(false);
  const [filterDraft, setFilterDraft] = reactExports.useState(EMPTY_FILTER);
  const [appliedFilter, setAppliedFilter] = reactExports.useState(EMPTY_FILTER);
  const [dropdownOptions, setDropdownOptions] = reactExports.useState({});
  const toast = ar();
  const ResultsActiveRequestDto = { chActive: "Y" };
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  reactExports.useEffect(() => {
    const fetchDropdowns = async () => {
      var _a;
      try {
        const res = await Kr.GET(
          ActionMasterAPI.ActionMaster(screenMenuId) + `/initialFetch`
        );
        const data = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) || {};
        const mappedOptions = Object.fromEntries(
          Object.entries(data).map(([key, list]) => [
            key,
            [
              ...key !== "ACTION_TYPE" ? [{ value: "", label: "None" }] : [],
              ...(list || []).map((item) => ({
                value: item.szCondition,
                label: item.szi18nDesc ? intl.formatMessage({
                  id: item.szi18nDesc,
                  defaultMessage: item.szi18nDesc
                }) : item.szi18nDesc
              }))
            ]
          ])
        );
        setDropdownOptions(mappedOptions);
      } catch (err) {
        toast.error("Failed to load dropdowns");
      }
    };
    fetchDropdowns();
  }, [intl, toast]);
  const allOption = reactExports.useMemo(
    () => ({
      value: "",
      label: intl.formatMessage({
        id: "label.globalActions.filterAll",
        defaultMessage: "All"
      })
    }),
    [intl.locale]
  );
  const actionTypeFilterOptions = reactExports.useMemo(
    () => [allOption, ...dropdownOptions.ACTION_TYPE || []],
    [allOption, dropdownOptions.ACTION_TYPE]
  );
  const partyFilterOptions = reactExports.useMemo(
    () => [allOption, ...dropdownOptions.ADDRESSEES || []],
    [allOption, dropdownOptions.ADDRESSEES]
  );
  const modeFilterOptions = reactExports.useMemo(
    () => [allOption, ...dropdownOptions.CONTACTMODE || []],
    [allOption, dropdownOptions.CONTACTMODE]
  );
  reactExports.useMemo(
    () => [allOption, ...dropdownOptions.CONTACTPLACE || []],
    [allOption, dropdownOptions.CONTACTPLACE]
  );
  const filteredRows = reactExports.useMemo(() => {
    return rowData.filter(
      (row) => rowMatchesFilter(row, appliedFilter)
    );
  }, [rowData, appliedFilter]);
  const handleResultClick = reactExports.useCallback(
    (actionRow) => {
      if (!(actionRow == null ? void 0 : actionRow.isPersisted)) {
        toast.warning(
          intl.formatMessage({
            id: "label.actionmaster.saveBeforeMapping",
            defaultMessage: "Please save the Action before mapping results"
          })
        );
        return;
      }
      setSelectedAction(actionRow);
      const requestBody = {
        szActionCode: actionRow.szActionCode
      };
      Kr.GET(ActionMasterAPI.ActionMaster(screenMenuId) + `/fetchActionResults?szActionCode=${requestBody.szActionCode}`).then((res) => {
        var _a, _b;
        const resultArray = ((_a = res.data) == null ? void 0 : _a.responseJson) || ((_b = res.data) == null ? void 0 : _b.data) || res.data || [];
        setResultsList(resultArray);
        setOpenResultPopup(true);
      }).catch(() => {
        toast.error(
          intl.formatMessage({
            id: "label.actionmaster.fetchResultsError",
            defaultMessage: "Failed to fetch results"
          })
        );
      });
    },
    [toast, intl]
  );
  const handleSaveResults = (payload) => {
    Kr.POST(ActionMasterAPI.ActionMaster(screenMenuId), payload).then(() => {
      toast.success(
        intl.formatMessage({
          id: "label.actionmaster.resultsSaved",
          defaultMessage: "Results saved successfully"
        })
      );
      setOpenResultPopup(false);
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "label.actionmaster.saveResultsError",
          defaultMessage: "Failed to save results"
        })
      );
    });
  };
  const refreshData = () => Kr.GET(ActionMasterAPI.ActionMaster(screenMenuId) + `?chActive=${ResultsActiveRequestDto.chActive}`).then((res) => {
    const { data: responseData } = res;
    let dataArray = [];
    if (Array.isArray(responseData)) {
      dataArray = responseData;
    } else if (Array.isArray(responseData.responseJson)) {
      dataArray = responseData.responseJson;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      dataArray = responseData.data;
    }
    if (dataArray.length > 0) {
      const enrichedData = dataArray.map((item, index) => ({
        id: item.szActionCode || index + 1,
        ...item,
        bdFlatFeeAmt: item.bdflatFeeAmt || item.bdFlatFeeAmt,
        bdFeePercent: item.bdfeePercent || item.bdFeePercent,
        szFeeBaseAmt: item.szfeeBaseAmt || item.szFeeBaseAmt || "",
        bdActionCost: item.bdactionCost || item.bdActionCost,
        chNextAction: item.chNextAction === "Y" || item.chNextAction === true,
        chAuthYn: item.chAuthYn === "Y" || item.chAuthYn === true,
        chActive: item.chActive === "Y" || item.chActive === true,
        szActionDesc: item.szActionDesc,
        isPersisted: true
      }));
      setRowData(enrichedData);
    } else {
      toast.info(
        intl.formatMessage({
          id: "label.actionmaster.noData",
          defaultMessage: "No data found."
        })
      );
      setRowData([]);
    }
  }).catch(() => {
    toast.error(
      intl.formatMessage({
        id: "label.actionmaster.fetchError",
        defaultMessage: "Error while fetching Actions."
      })
    );
    setRowData([]);
  });
  reactExports.useEffect(() => {
    refreshData();
  }, []);
  const handleReset = () => {
    refreshData();
    return { success: true };
  };
  const handleSave = ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    var _a, _b;
    const gridRows = ((_b = (_a = gridRef.current) == null ? void 0 : _a.getCurrentData) == null ? void 0 : _b.call(_a)) || [];
    const seenCodes = /* @__PURE__ */ new Set();
    for (const row of gridRows) {
      if (!row || row._deleted) continue;
      const code = String(row.szActionCode || "").trim();
      if (!code) continue;
      if (seenCodes.has(code)) {
        toast.error(
          intl.formatMessage({
            id: "label.globalActions.duplicateActionCode",
            defaultMessage: "Duplicate action code for this grid."
          })
        );
        return Promise.resolve({ success: false });
      }
      seenCodes.add(code);
    }
    const enrichRow = (row, mode) => ({
      ...row,
      szMode: mode,
      chActive: row.chActive === true || row.chActive === "Y" ? "Y" : "N",
      chNextAction: row.chNextAction === true || row.chNextAction === "Y" ? "Y" : "N",
      chAuthYn: row.chAuthYn === true || row.chAuthYn === "Y" ? "Y" : "N",
      chReminder: row.chReminder,
      chGlobalYn: "Y",
      chSpecifyTime: row.chSpecifyTime,
      szFeeCode: row.szFeeCode,
      szFeeMethod: row.szFeeMethod,
      bdFlatFeeAmt: row.bdFlatFeeAmt,
      bdFeePercent: row.bdFeePercent,
      szFeeBaseAmt: row.szFeeBaseAmt,
      bdActionCost: row.bdActionCost
    });
    const enrichedRows = [
      ...newRows.map((row) => enrichRow(row, "N")),
      ...updatedRows.map((row) => enrichRow(row, "E")),
      ...deletedRows.map((row) => ({ ...row, szMode: "D" }))
    ];
    return Kr.POST(ActionMasterAPI.ActionMaster(screenMenuId), enrichedRows).then((response) => {
      const resData = response.data;
      if (resData && (resData.status === "200" || resData.status === 200) && resData.responseJson && (resData.responseJson.statusCode === "200" || resData.responseJson.statusCode === 200)) {
        refreshData();
        return { success: true };
      }
      toast.error(
        resData.message || intl.formatMessage({
          id: "label.actionmaster.saveFailed",
          defaultMessage: "Failed to save changes."
        })
      );
      return { success: false };
    }).catch(() => {
      toast.error(
        intl.formatMessage({
          id: "label.actionmaster.saveError",
          defaultMessage: "Error while saving data."
        })
      );
      return { success: false };
    });
  };
  const columnDefs = reactExports.useMemo(() => {
    const makeFormatter = (options) => (params) => {
      const opt = options.find((o) => o.value === params.value);
      return opt ? opt.label : params.value ?? "";
    };
    return [
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.identity",
          defaultMessage: "Identity"
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.actionCode",
              defaultMessage: "Code"
            }),
            field: "szActionCode",
            width: 120,
            editable: true,
            filter: false,
            required: true
          },
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.description",
              defaultMessage: "Description"
            }),
            field: "szActionDesc",
            width: 150,
            editable: true,
            filter: false,
            required: true
          },
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.actionType",
              defaultMessage: "Action Type"
            }),
            field: "szActionName",
            width: 170,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.ACTION_TYPE || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.ACTION_TYPE || []),
            required: true
          }
        ]
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.fees",
          defaultMessage: "Fees"
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            field: "szFeeCode",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.code",
              defaultMessage: "Fee Code"
            }),
            cellRenderer: FeeCodeSearchRenderer,
            width: 180,
            editable: false,
            filter: false
          },
          {
            field: "szFeeMethod",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.method",
              defaultMessage: "Fee Method"
            }),
            width: 110,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CALCTYPE || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.CALCTYPE || [])
          },
          {
            field: "bdFlatFeeAmt",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.flat",
              defaultMessage: "Flat"
            }),
            width: 70,
            editable: (p) => {
              var _a;
              return feeMethodNeeds((_a = p.data) == null ? void 0 : _a.szFeeMethod).flat;
            },
            filter: false,
            cellEditor: "agNumberCellEditor"
          },
          {
            field: "bdFeePercent",
            headerName: intl.formatMessage({
              id: "label.globalActions.col.percent",
              defaultMessage: "%"
            }),
            width: 70,
            editable: (p) => {
              var _a;
              return feeMethodNeeds((_a = p.data) == null ? void 0 : _a.szFeeMethod).pct;
            },
            filter: false,
            cellEditor: "agNumberCellEditor"
          },
          {
            field: "szFeeBaseAmt",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.baseamount",
              defaultMessage: "Base Amount"
            }),
            width: 130,
            editable: (p) => {
              var _a;
              return feeMethodNeeds((_a = p.data) == null ? void 0 : _a.szFeeMethod).base;
            },
            cellEditor: "agSelectCellEditor",
            filter: false,
            cellEditorParams: {
              values: (dropdownOptions.BASEAMT || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.BASEAMT || [])
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.cost",
              defaultMessage: "Cost"
            }),
            field: "bdActionCost",
            width: 70,
            editable: true,
            filter: false,
            cellEditor: "agNumberCellEditor",
            valueParser: (params) => {
              if (params.newValue === "" || params.newValue === null || params.newValue === void 0) {
                return 0;
              }
              const num = Number(params.newValue);
              return Number.isNaN(num) ? 0 : num;
            },
            valueFormatter: (params) => params.value === null || params.value === void 0 ? "" : params.value
          }
        ]
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.behaviour",
          defaultMessage: "Behaviour"
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.next.action",
              defaultMessage: "Next Action"
            }),
            field: "chNextAction",
            width: 110,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer"
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.Auth",
              defaultMessage: "Auth Reqd"
            }),
            field: "chAuthYn",
            width: 100,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer"
          }
        ]
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.contact",
          defaultMessage: "Contact"
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szpartycontacted",
              defaultMessage: "Party Contacted"
            }),
            field: "szPartyContacted",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.ADDRESSEES || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.ADDRESSEES || [])
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szmodecontact",
              defaultMessage: "Mode Contacted"
            }),
            field: "szModeContact",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CONTACTMODE || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.CONTACTMODE || [])
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szplacecontact",
              defaultMessage: "Place Contacted"
            }),
            field: "szPlaceContact",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CONTACTPLACE || []).map((o) => o.value)
            },
            valueFormatter: makeFormatter(dropdownOptions.CONTACTPLACE || [])
          }
        ]
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.status",
          defaultMessage: "Status"
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.active",
              defaultMessage: "Active"
            }),
            field: "chActive",
            width: 80,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer"
          }
        ]
      }
      /* {
        headerName: intl.formatMessage({
          id: "label.actionmaster.PossibleResults",
          defaultMessage: "Possible Results",
        }),
        colId: "possibleResults",
        width: 140,
        editable: false,
        filter: false,
        cellRenderer: (params) => {
          const isDisabled = !params.data?.isPersisted;
          return (
            <button
              type="button"
              className="ga-results-link"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) handleResultClick(params.data);
              }}
            >
              {intl.formatMessage({
                id: "label.actionmaster.edit",
                defaultMessage: "Edit",
              })}
            </button>
          );
        },
       },*/
    ];
  }, [intl, handleResultClick, dropdownOptions]);
  const overlayNoRowsTemplate = intl.formatMessage({
    id: "label.globalActions.noRowsMatch",
    defaultMessage: "No actions match your filter."
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "ga-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "action-master-header-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(bp, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { styles: { display: "flex", width: "100%", justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(vp, { title: intl.formatMessage({ id: "label.globalActions.title", defaultMessage: "Global Actions" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({
                id: "label.globalActions.description",
                defaultMessage: "Manual actions a collector can take. Configure fees, contact info, and authorisation behaviour."
              }),
              align: "left",
              colon: false
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { styles: { marginTop: "8px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Lg,
          {
            variant: "outlined",
            size: "small",
            label: intl.formatMessage({ id: "label.globalActions.filtersToggle", defaultMessage: "Filters" }),
            onClick: () => setFiltersOpen((o) => !o)
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { styles: { display: "flex", flexDirection: "column" }, children: [
      filtersOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { className: "ga-filter-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", marginBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.globalActions.filterAction",
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              name: "filterAction",
              editable: true,
              value: filterDraft.action,
              width: "100%",
              onChange: (e) => setFilterDraft((d) => ({ ...d, action: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", marginBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.globalActions.filterDescription",
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              name: "filterDescription",
              editable: true,
              value: filterDraft.description,
              width: "100%",
              onChange: (e) => setFilterDraft((d) => ({ ...d, description: e.target.value }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.globalActions.filterActionType",
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "filterActionType",
              options: actionTypeFilterOptions,
              value: filterDraft.actionType,
              onChange: (e) => setFilterDraft((d) => ({ ...d, actionType: e.target.value })),
              width: "100%"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.globalActions.filterParty",
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "filterParty",
              options: partyFilterOptions,
              value: filterDraft.party,
              onChange: (e) => setFilterDraft((d) => ({ ...d, party: e.target.value })),
              width: "100%"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: "label.globalActions.filterMode",
              colon: false,
              align: "left"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SE,
            {
              name: "filterMode",
              options: modeFilterOptions,
              value: filterDraft.mode,
              onChange: (e) => setFilterDraft((d) => ({ ...d, mode: e.target.value })),
              width: "100%"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { styles: { display: "flex", gap: "5px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              size: "small",
              align: "right",
              label: intl.formatMessage({
                id: "label.globalActions.fetch",
                defaultMessage: "Fetch"
              }),
              onClick: () => {
                setAppliedFilter({ ...filterDraft });
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              variant: "text",
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}),
              onClick: () => {
                setFilterDraft(EMPTY_FILTER);
                setAppliedFilter(EMPTY_FILTER);
              }
            }
          )
        ] })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { className: "ga-grid-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        bu,
        {
          ref: gridRef,
          SearchCommonBoxRenderer: FeeCodeSearchRenderer,
          rowData: filteredRows,
          columnDefs,
          gridStyle: { width: "100%", height: "min(50vh, 520px)" },
          pagination: true,
          paginationPageSize: 5,
          sort: true,
          globalSearch: false,
          allowAdd: true,
          allowDelete: true,
          allowUpdate: true,
          rowDragging: false,
          onSave: handleSave,
          embeddedInSection: true,
          overlayNoRowsTemplate
        },
        intl.locale
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Vg,
        {
          onSave: () => {
            var _a, _b;
            return (_b = (_a = gridRef.current) == null ? void 0 : _a.submitChanges) == null ? void 0 : _b.call(_a);
          },
          onClose: () => navigate("/homelayout/welcomepage"),
          onReset: handleReset
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ActionResultDialog,
      {
        open: openResultPopup,
        onClose: () => setOpenResultPopup(false),
        parentType: "ACTION",
        parentData: selectedAction,
        mappingList: resultsList,
        onSave: handleSaveResults
      }
    )
  ] });
};
export {
  GlobalActions as default
};
