import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { HAxiosService, HBreadCrumb, SearchCommonBox, HBox, HButton, HButtonBar, HDropdown, HLabel, HTextField, TitleBar, HAgGrid, useToast } from "@helix/component-library";
import { ActionMasterAPI } from "../apiEndpoints.jsx";
import { useIntl } from "react-intl";

import ActionResultDialog from "../ActionResultDialog.jsx";
import { useNavigate } from "react-router-dom";

import { gridFeeCodeDefObj } from "../../../../common/components/SearchGridDefObj";

import "./globalActions.css";
import CloseIcon from "@mui/icons-material/Close";
import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { useLocation } from "react-router-dom";
const EMPTY_FILTER = {
  action: "",
  description: "",
  actionType: "",
  party: "",
  mode: "",
  place: "",
};

function feeMethodNeeds(method) {
  const m = method || "None";
  return {
    flat:
      m === "Flat Only" ||
      m === "Flat + %" ||
      m === "Maximum of flat & %" ||
      m === "Minimum of flat & %",
    pct:
      m === "% Only" ||
      m === "Flat + %" ||
      m === "Maximum of flat & %" ||
      m === "Minimum of flat & %",
    base: m !== "None" && m !== "Flat Only",
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
  return (
    <SearchCommonBox
      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
      searchCode="FEECODE"
      setSelectedValue={(dataValue) =>
        node.setDataValue("szFeeCode", dataValue || value)
      }
      selectedValue={value}
      selectedColumn="szfeecode"
      gridDefObj={gridFeeCodeDefObj}
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={2}
      searchBoxWidth={125}
      searchBoxHeight={35}
      searchBoxFontSize={12}
      error={false}
    />
  );
};

const GlobalActions = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [openResultPopup, setOpenResultPopup] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [resultsList, setResultsList] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(EMPTY_FILTER);
  const [appliedFilter, setAppliedFilter] = useState(EMPTY_FILTER);
  const [dropdownOptions, setDropdownOptions] = useState({});
  const toast = useToast();
  const ResultsActiveRequestDto = { chActive: "Y" };
     	
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await HAxiosService.GET(
          ActionMasterAPI.ActionMaster(screenMenuId)+`/initialFetch`
        );

        const data = res?.data?.responseJson || {};

        const mappedOptions = Object.fromEntries(
          Object.entries(data).map(([key, list]) => [
            key,
            [
              ...(key !== "ACTION_TYPE"
                ? [{ value: "", label: "None" }]
                : []),
              ...(list || []).map((item) => ({
                value: item.szCondition,
                label: item.szi18nDesc
                  ? intl.formatMessage({
                    id: item.szi18nDesc,
                    defaultMessage: item.szi18nDesc,
                  })
                  : item.szi18nDesc,
              })),
            ],
          ])
        );

        setDropdownOptions(mappedOptions);
      } catch (err) {
        toast.error("Failed to load dropdowns");
      }
    };

    fetchDropdowns();
  }, [intl, toast]);

  const allOption = useMemo(
    () => ({
      value: "",
      label: intl.formatMessage({
        id: "label.globalActions.filterAll",
        defaultMessage: "All",
      }),
    }),
    [intl.locale]
  );

  const actionTypeFilterOptions = useMemo(
    () => [allOption, ...(dropdownOptions.ACTION_TYPE || []),],
    [allOption,dropdownOptions.ACTION_TYPE]
  );

  const partyFilterOptions = useMemo(
    () => [allOption, ...(dropdownOptions.ADDRESSEES || []),],
    [allOption,dropdownOptions.ADDRESSEES]
  );

  const modeFilterOptions = useMemo(
   () => [allOption, ...(dropdownOptions.CONTACTMODE || []),],
    [allOption,dropdownOptions.CONTACTMODE]
  );

  const placeFilterOptions = useMemo(
   () => [allOption, ...(dropdownOptions.CONTACTPLACE || []),],
    [allOption,dropdownOptions.CONTACTPLACE]
  );


  const filteredRows = useMemo(() => {
  return rowData.filter((row) =>
    rowMatchesFilter(row, appliedFilter)
  );
}, [rowData, appliedFilter]);

 
 

  const handleResultClick = useCallback(
    (actionRow) => {
      if (!actionRow?.isPersisted) {
        toast.warning(
          intl.formatMessage({
            id: "label.actionmaster.saveBeforeMapping",
            defaultMessage: "Please save the Action before mapping results",
          })
        );
        return;
      }

      setSelectedAction(actionRow);

      const requestBody = {
        szActionCode: actionRow.szActionCode,
      };

      HAxiosService.GET(ActionMasterAPI.ActionMaster(screenMenuId)+`/fetchActionResults?szActionCode=${requestBody.szActionCode}`)
        .then((res) => {
          const resultArray =
            res.data?.responseJson || res.data?.data || res.data || [];

          setResultsList(resultArray);
          setOpenResultPopup(true);
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              id: "label.actionmaster.fetchResultsError",
              defaultMessage: "Failed to fetch results",
            })
          );
        });
    },
    [toast, intl]
  );

  const handleSaveResults = (payload) => {
    HAxiosService.POST(ActionMasterAPI.ActionMaster(screenMenuId), payload)
      .then(() => {
        toast.success(
          intl.formatMessage({
            id: "label.actionmaster.resultsSaved",
            defaultMessage: "Results saved successfully",
          })
        );
        setOpenResultPopup(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "label.actionmaster.saveResultsError",
            defaultMessage: "Failed to save results",
          })
        );
      });
  };

  const refreshData = () =>
    HAxiosService.GET(ActionMasterAPI.ActionMaster(screenMenuId)+`?chActive=${ResultsActiveRequestDto.chActive}`)
      .then((res) => {
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
            isPersisted: true,
          }));
          setRowData(enrichedData);
        } else {
          toast.info(
            intl.formatMessage({
              id: "label.actionmaster.noData",
              defaultMessage: "No data found.",
            })
          );
          setRowData([]);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "label.actionmaster.fetchError",
            defaultMessage: "Error while fetching Actions.",
          })
        );
        setRowData([]);
      });

  useEffect(() => {
    refreshData();
  }, []);

  const handleReset = () => {
    refreshData();
    return { success: true };
  };

  const handleSave = ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
    const gridRows = gridRef.current?.getCurrentData?.() || [];
    const seenCodes = new Set();
    for (const row of gridRows) {
      if (!row || row._deleted) continue;
      const code = String(row.szActionCode || "").trim();
      if (!code) continue;
      if (seenCodes.has(code)) {
        toast.error(
          intl.formatMessage({
            id: "label.globalActions.duplicateActionCode",
            defaultMessage: "Duplicate action code for this grid.",
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
      chNextAction:
        row.chNextAction === true || row.chNextAction === "Y" ? "Y" : "N",
      chAuthYn: row.chAuthYn === true || row.chAuthYn === "Y" ? "Y" : "N",
      chReminder: row.chReminder,
      chGlobalYn: "Y",
      chSpecifyTime: row.chSpecifyTime,
      szFeeCode: row.szFeeCode,
      szFeeMethod: row.szFeeMethod,
      bdFlatFeeAmt: row.bdFlatFeeAmt,
      bdFeePercent: row.bdFeePercent,
      szFeeBaseAmt: row.szFeeBaseAmt,
      bdActionCost: row.bdActionCost,
    });

    const enrichedRows = [
      ...newRows.map((row) => enrichRow(row, "N")),
      ...updatedRows.map((row) => enrichRow(row, "E")),
      ...deletedRows.map((row) => ({ ...row, szMode: "D" })),
    ];

    return HAxiosService.POST(ActionMasterAPI.ActionMaster(screenMenuId), enrichedRows)
      .then((response) => {
        const resData = response.data;
        if (
          resData &&
          (resData.status === "200" || resData.status === 200) &&
          resData.responseJson &&
          (resData.responseJson.statusCode === "200" ||
            resData.responseJson.statusCode === 200)
        ) {
          refreshData();
          return { success: true };
        }
        toast.error(
          resData.message ||
          intl.formatMessage({
            id: "label.actionmaster.saveFailed",
            defaultMessage: "Failed to save changes.",
          })
        );
        return { success: false };
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            id: "label.actionmaster.saveError",
            defaultMessage: "Error while saving data.",
          })
        );
        return { success: false };
      });
  };

  const columnDefs = useMemo(() => {
   
    const makeFormatter = (options) => (params) => {
      const opt = options.find((o) => o.value === params.value);
      return opt? opt.label: (params.value ?? "");
    };

    return [
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.identity",
          defaultMessage: "Identity",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.actionCode",
              defaultMessage: "Code",
            }),
            field: "szActionCode",
            width: 120,
            editable: true,
            filter: false,
            required: true,
          },
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.description",
              defaultMessage: "Description",
            }),
            field: "szActionDesc",
            width: 150,
            editable: true,
            filter: false,
            required: true,
          },
          {
            headerName: intl.formatMessage({
              id: "label.globalActions.col.actionType",
              defaultMessage: "Action Type",
            }),
            field: "szActionName",
            width: 170,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.ACTION_TYPE || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.ACTION_TYPE || []),
            required: true,
          },
        ],
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.fees",
          defaultMessage: "Fees",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            field: "szFeeCode",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.code",
              defaultMessage: "Fee Code",
            }),
            cellRenderer: FeeCodeSearchRenderer,
            width: 180,
            editable: false,
            filter: false,
          },
          {
            field: "szFeeMethod",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.method",
              defaultMessage: "Fee Method",
            }),
            width: 110,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CALCTYPE || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.CALCTYPE || []),
          },
          {
            field: "bdFlatFeeAmt",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.flat",
              defaultMessage: "Flat",
            }),
            width: 70,
            editable: (p) => feeMethodNeeds(p.data?.szFeeMethod).flat,
            filter: false,
            cellEditor: "agNumberCellEditor",
          },
          {
            field: "bdFeePercent",
            headerName: intl.formatMessage({
              id: "label.globalActions.col.percent",
              defaultMessage: "%",
            }),
            width: 70,
            editable: (p) => feeMethodNeeds(p.data?.szFeeMethod).pct,
            filter: false,
            cellEditor: "agNumberCellEditor",
          },
          {
            field: "szFeeBaseAmt",
            headerName: intl.formatMessage({
              id: "label.actionmaster.fee.baseamount",
              defaultMessage: "Base Amount",
            }),
            width: 130,
            editable: (p) => feeMethodNeeds(p.data?.szFeeMethod).base,
            cellEditor: "agSelectCellEditor",
            filter: false,
            cellEditorParams: {
              values: (dropdownOptions.BASEAMT || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.BASEAMT || []),
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.cost",
              defaultMessage: "Cost",
            }),
            field: "bdActionCost",
            width: 70,
            editable: true,
            filter: false,
            cellEditor: "agNumberCellEditor",
            valueParser: (params) => {
              if (
                params.newValue === "" ||
                params.newValue === null ||
                params.newValue === undefined
              ) {
                return 0;
              }
              const num = Number(params.newValue);
              return Number.isNaN(num) ? 0 : num;
            },
            valueFormatter: (params) =>
              params.value === null || params.value === undefined
                ? ""
                : params.value,
          },
        ],
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.behaviour",
          defaultMessage: "Behaviour",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.next.action",
              defaultMessage: "Next Action",
            }),
            field: "chNextAction",
            width: 110,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer",
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.Auth",
              defaultMessage: "Auth Reqd",
            }),
            field: "chAuthYn",
            width: 100,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer",
          },
        ],
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.contact",
          defaultMessage: "Contact",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szpartycontacted",
              defaultMessage: "Party Contacted",
            }),
            field: "szPartyContacted",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.ADDRESSEES || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.ADDRESSEES || []),
          },
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szmodecontact",
              defaultMessage: "Mode Contacted",
            }),
            field: "szModeContact",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CONTACTMODE || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.CONTACTMODE || []),
          }, 
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.szplacecontact",
              defaultMessage: "Place Contacted",
            }),
            field: "szPlaceContact",
            width: 140,
            editable: true,
            filter: false,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: (dropdownOptions.CONTACTPLACE || []).map((o) => o.value),
            },
            valueFormatter: makeFormatter(dropdownOptions.CONTACTPLACE || []),
          },
        ],
      },
      {
        headerName: intl.formatMessage({
          id: "label.globalActions.group.status",
          defaultMessage: "Status",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.actionmaster.active",
              defaultMessage: "Active",
            }),
            field: "chActive",
            width: 80,
            editable: true,
            filter: false,
            isCheckbox: true,
            cellRenderer: "agCheckboxCellRenderer"
          },
        ],
      },
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
  }, [intl, handleResultClick,dropdownOptions]);


  const overlayNoRowsTemplate = intl.formatMessage({
    id: "label.globalActions.noRowsMatch",
    defaultMessage: "No actions match your filter.",
  });

  return (
    <HBox className="ga-page">
      <HBox className="action-master-header-card" >

        <HBreadCrumb />

        <HBox styles={{ display: "flex",width: "100%", justifyContent: "space-between" }}>
          <HBox >
            <TitleBar title={intl.formatMessage({ id: "label.globalActions.title", defaultMessage: "Global Actions", })} />
            <HLabel value={intl.formatMessage({
              id: "label.globalActions.description",
              defaultMessage: "Manual actions a collector can take. Configure fees, contact info, and authorisation behaviour.",
            })}
              align="left"
              colon={false}
            />
          </HBox>

          <HBox styles={{ marginTop: "8px" }}>
            <HButton
              variant="outlined"
              size="small"
              label={intl.formatMessage({ id: "label.globalActions.filtersToggle", defaultMessage: "Filters", })}
              onClick={() => setFiltersOpen((o) => !o)}
            />
          </HBox>
        </HBox>
      </HBox>

      <HBox styles={{ display: "flex", flexDirection: "column" }}>

       {filtersOpen? (<HBox className="ga-filter-panel">
          <HBox sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <HLabel
              value="label.globalActions.filterAction"
              colon={false}
              align="left"
            />
            <HTextField
              name="filterAction"
              editable={true}
              value={filterDraft.action}
              width="100%"
              onChange={(e) =>
                setFilterDraft((d) => ({ ...d, action: e.target.value }))
              }
            />
          </HBox>
          <HBox sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}>
            <HLabel
              value="label.globalActions.filterDescription"
              colon={false}
              align="left"
            />
            <HTextField
              name="filterDescription"
              editable={true}
              value={filterDraft.description}
              width="100%"
              onChange={(e) =>
                setFilterDraft((d) => ({ ...d, description: e.target.value }))
              }
            />
          </HBox>
          <HBox>
            <HLabel
              value="label.globalActions.filterActionType"
              colon={false}
              align="left"
            />
            <HDropdown
              name="filterActionType"
              options={actionTypeFilterOptions}
              value={filterDraft.actionType}
              onChange={(e) =>
                setFilterDraft((d) => ({ ...d, actionType: e.target.value }))
              }
              width="100%"
            />
          </HBox>
          <HBox>
            <HLabel
              value="label.globalActions.filterParty"
              colon={false}
              align="left"
            />
            <HDropdown
              name="filterParty"
              options={partyFilterOptions}
              value={filterDraft.party}
              onChange={(e) =>
                setFilterDraft((d) => ({ ...d, party: e.target.value }))
              }
              width="100%"
            />
          </HBox>
          <HBox>
            <HLabel
              value="label.globalActions.filterMode"
              colon={false}
              align="left"
            />
            <HDropdown
              name="filterMode"
              options={modeFilterOptions}
              value={filterDraft.mode}
              onChange={(e) =>
                setFilterDraft((d) => ({ ...d, mode: e.target.value }))
              }
              width="100%"
            />
          </HBox>
          <HBox styles={{ display: "flex", gap: "5px" }} >
            <HButton
              size="small"
              align="right"
              label={intl.formatMessage({
                id: "label.globalActions.fetch",
                defaultMessage: "Fetch",
              })}
              onClick={() => {
                setAppliedFilter({ ...filterDraft });
              }}
            />
            <HButton
              variant="text"
              startIcon={<CloseIcon />}
              onClick={() => {
                setFilterDraft(EMPTY_FILTER);
                setAppliedFilter(EMPTY_FILTER);
              }}
            />
          </HBox>
        </HBox>)  : null}

        <HBox className="ga-grid-wrap">
          <HAgGrid
            ref={gridRef}
            key={intl.locale}
            SearchCommonBoxRenderer={FeeCodeSearchRenderer}
            rowData={filteredRows}
            columnDefs={columnDefs}
            gridStyle={{ width: "100%", height: "min(50vh, 520px)" }}
            pagination
            paginationPageSize={5}
            sort
            globalSearch={false}
            allowAdd
            allowDelete
            allowUpdate
            rowDragging={false}
            onSave={handleSave}
            embeddedInSection
            overlayNoRowsTemplate={overlayNoRowsTemplate}
          />
        </HBox>

        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          onReset={handleReset}
        />
      </HBox>

      <ActionResultDialog
        open={openResultPopup}
        onClose={() => setOpenResultPopup(false)}
        parentType="ACTION"
        parentData={selectedAction}
        mappingList={resultsList}
        onSave={handleSaveResults}
      />
    </HBox>
  );
};

export default GlobalActions;
