import { SEARCH_API_ENDPOINTS } from "../../../../../shared/config/apiConstants.jsx";
import { SearchCommonBox, HAxiosService } from "@helix/component-library";
import { gridStrategyActionDefObj, gridGroupCodeDefObj } from "../../../../common/components/SearchGridDefObj";

import React from 'react';

const actionTypeCache = new Map();

 const GroupCodeSearchRenderer = (props) => {
        const { value, node } = props;
        const handleSetGroupSelectedValue = (dataValue, selectedRow) => {
          if (selectedRow && selectedRow.szgroupcode) {
            node.setDataValue("szAllocateTo", selectedRow.szgroupcode);
          }
        };
  
        return (
          <SearchCommonBox
            apiEndpoint={SEARCH_API_ENDPOINTS.ALLOCATION()}
            searchCode="GRPCD"
            setSelectedValue={handleSetGroupSelectedValue}
            selectedValue={value}
            selectedColumn="szgroupcode"
            gridDefObj={gridGroupCodeDefObj}
            gridWidth={350}
            gridHeight={300}
            gridNoOfRowsPerPage={2}
            searchBoxWidth="100%"
            searchBoxHeight={30}
            searchBoxFontSize={12}
            error={false}
          />
        );
      };

export const ActionCodeSearchRenderer = (props) => {
  const { value, node } = props;
  
  React.useEffect(() => {
    if (value && node) {

      const fetchActionType = async () => {
        try {
          const response = await HAxiosService.POST(
            SEARCH_API_ENDPOINTS.COMMON_MASTER(),
            {
              searchCode: "STRACT",
              szactioncode: value
            }
          );
          
          if (response.data?.status === "Success" && response.data?.responseJson) {
            const data = response.data.responseJson;
            const matchedItem = Array.isArray(data) 
              ? data.find(item => item.szactioncode === value)
              : null;
              
            if (matchedItem && matchedItem.szactiontype) {
              actionTypeCache.set(value, matchedItem.szactiontype);
              node.setDataValue("szChannel", matchedItem.szactiontype);
            }
          }
        } catch (error) {
          console.error("Error fetching action type:", error);
        }
      };
      
      fetchActionType();
    }
  }, [value, node]);
  
  const handleSetSelectedValue = (dataValue, selectedRow) => {
    if (selectedRow && selectedRow.szactiontype) {
      actionTypeCache.set(selectedRow.szactioncode, selectedRow.szactiontype);
      
      node.setDataValue("szChannel", selectedRow.szactiontype);
      node.setDataValue("szActionCode", selectedRow.szactioncode);
    } 
  };

  return (
    <SearchCommonBox
      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
      searchCode="STRACT"
      setSelectedValue={handleSetSelectedValue}
      selectedValue={value}
      selectedColumn="szactioncode"
      gridDefObj={gridStrategyActionDefObj}
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={2}
      searchBoxWidth="100%"
      searchBoxHeight={30}
      searchBoxFontSize={12}
      error={false}
    />
  );
};


// Add this component after your existing renderers
export const DependsOnSearchRenderer = (props) => {
  const { value, node } = props;
  
  // Convert the comma-separated string to an array for multi-select
  const getSelectedValues = (val) => {
    if (!val) return [];
    return val.split(',').map(item => item.trim()).filter(Boolean);
  };

  // Convert array back to comma-separated string
  const formatDependentIds = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return '';
    return selectedIds.join(',');
  };

  const handleSetSelectedValue = (selectedIds) => {
    // selectedIds is an array of values from the multi-select
    // Format them back to comma-separated string
    const formattedValue = formatDependentIds(selectedIds);
    node.setDataValue("szDependsOn", formattedValue);
  };

  

  return (
    <SearchCommonBox
      multiSelect={true}
      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
      searchCode="STRACT" 
      setSelectedValue={handleSetSelectedValue}
      selectedValue={getSelectedValues(value)}
      selectedColumn="szactioncode"
      gridDefObj={gridStrategyActionDefObj} 
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={5}
      searchBoxWidth="100%"
      searchBoxHeight={30}
      searchBoxFontSize={12}
      error={false}
    />
  );
};

export const SuccessorOnSearchRenderer = (props) => {
  const { value, node } = props;
  
  // Convert the comma-separated string to an array for multi-select
  const getSelectedValues = (val) => {
    if (!val) return [];
    return val.split(',').map(item => item.trim()).filter(Boolean);
  };

  // Convert array back to comma-separated string
  const formatDependentIds = (selectedIds) => {
    if (!selectedIds || selectedIds.length === 0) return '';
    return selectedIds.join(',');
  };

  const handleSetSelectedValue = (selectedIds) => {
    // selectedIds is an array of values from the multi-select
    // Format them back to comma-separated string
    const formattedValue = formatDependentIds(selectedIds);
    node.setDataValue("szSuccessors", formattedValue);
  };

  

  return (
    <SearchCommonBox
      multiSelect={true}
      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
      searchCode="STRACT" 
      setSelectedValue={handleSetSelectedValue}
      selectedValue={getSelectedValues(value)}
      selectedColumn="szactioncode"
      gridDefObj={gridStrategyActionDefObj} 
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={5}
      searchBoxWidth="100%"
      searchBoxHeight={30}
      searchBoxFontSize={12}
      error={false}
    />
  );
};



export const getCollectionStrategiesColumnDefs = (
  intl,
  holidayOptions,
  exclusionOptions,
  referenceDateOptions,
  phaseOptions,
  t
) => [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 48,
    pinned: "left",
    filter: false,
    sortable: false,
    suppressMenu: true,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.action",
      defaultMessage: "Action",
    }),
    field: "szActionCode",
    width: 140,
    pinned: "left",
    filter: false,
    editable: false,
    cellRenderer: ActionCodeSearchRenderer,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.channel",
      defaultMessage: "Channel",
    }),
    field: "szChannel",
    width: 130,
    filter: false,
    editable: false,

  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.onDay",
      defaultMessage: "On Day",
    }),
    field: "nOnDay",
    editable: true,
    width: 90,
    filter: false,
    cellEditor: "agTextCellEditor",
    // Accept empty value and parse numeric input; preserve old value on invalid input
    valueParser: (params) => {
      const v = params.newValue;
      if (v === null || v === undefined || String(v).trim() === "") return null;
      const num = Number(String(v).trim());
      return isNaN(num) ? params.oldValue : num;
    },
    valueFormatter: (params) => {
      if (params.value === null || params.value === undefined || params.value === "") return "";
      return String(params.value);
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.refDate",
      defaultMessage: "Ref Date",
    }),
    field: "szReferenceDate",
    editable: true,
    width: 150,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...referenceDateOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = referenceDateOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.auth",
      defaultMessage: "Auth",
    }),
    field: "nRequiresAuthorization",
    editable: true,
    width: 80,
    cellDataType: "boolean",
    cellRenderer: "agCheckboxCellRenderer",
    filter: false,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.allocate",
      defaultMessage: "Allocate",
    }),
    field: "szAllocateTo",
    width: 140,
    pinned: "left",
    editable: false,
    cellRenderer: GroupCodeSearchRenderer
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.holiday",
      defaultMessage: "Holiday",
    }),
    field: "szHolidayTreatmentBehavior",
    editable: true,
    width: 150,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...holidayOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = holidayOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.onExcl",
      defaultMessage: "On Excl.",
    }),
    field: "szOnExclusion",
    editable: true,
    width: 120,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["", ...exclusionOptions.map((o) => o.code)] },
    valueFormatter: (params) => {
      const opt = exclusionOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.phase",
      defaultMessage: "Phase",
    }),
    field: "szPhase",
    editable: true,
    width: 130,
    filter: false,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { 
      values: ["", ...phaseOptions.map((o) => o.code)]
    },
    valueFormatter: (params) => {
      const opt = phaseOptions.find((o) => String(o.code) === String(params.value));
      return opt ? t(opt.desc) : params.value ?? "";
    },
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.dependsOn",
      defaultMessage: "Depends On",
    }),
    field: "szDependsOn",
    editable: false,
    width: 190,
    filter: false,
    cellRenderer: DependsOnSearchRenderer,
  },
  {
    headerName: intl.formatMessage({
      id: "label.CollectionStrategies.grid.successor",
      defaultMessage: "Successor",
    }),
    field: "szSuccessors",
    editable: false,
    width: 190,
    filter: false,
    cellRenderer: SuccessorOnSearchRenderer
  },
  {
    headerName: intl.formatMessage({ id: "label.Payment.SrNo", defaultMessage: "Sr No." }),
    field: "inSrNo",
    width: 70,
    filter: false,
    editable: false,
    hide: true,
    valueFormatter: (params) =>
      params.value == null || params.value === "" ? "" : params.value,
  },
  {
    headerName: intl.formatMessage({
      id: "collection.grid.performOnNWD",
      defaultMessage: "Perform On NWD",
    }),
    field: "szPerformOnNWD",
    editable: true,
    width: 130,
    hide: true,
    cellDataType: "boolean",
    cellRenderer: "agCheckboxCellRenderer",
    filter: false,
  },
];

export const collectionStrategiesGridStyle = { width: "100%", height: "50vh" };
