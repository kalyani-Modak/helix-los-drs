import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HButton, HButtonBar, HBox, HDropdown, HLabel, HTextField, TitleBar, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";
import { ResultCategoryMasterAPI, ResultMasterAPI } from "../apiEndpoints.jsx";
import { useIntl } from "react-intl";

import { useNavigate } from "react-router-dom";


import "./ResultMaster.css";
import ActionResultDialog from "./../ActionResultDialog";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";	


const ResultMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const ResultsActiveRequestDto = { chActive: "Y" };

  const [rowData, setRowData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [categoryInput, setCategoryInput] = useState("");
  const [resultInput, setResultInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

 {/* const [openActionPopup, setOpenActionPopup] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [actionList, setActionList] = useState([]); */}

  const fetchCategories = useCallback(async () => {
    try {
      const res = await HAxiosService.GET(
        ResultCategoryMasterAPI.ResultCategoryDetails("EC-ResultCategories")
      );
      const payload = res.data;
      const categoryArray = Array.isArray(payload)
        ? payload
        : payload?.responseJson || [];

      if (Array.isArray(categoryArray)) {
        const normalized = categoryArray.map((item) => ({
          value: item.szCategoryCode ?? "",
          label: item.szCategoryDesc ?? item.szCategoryCode ?? "",
        }));
        setCategoryOptions(normalized);
      } else {
        setCategoryOptions([]);
      }
    } catch (error) {
      toast.warn(
        intl.formatMessage({
          id: "label.ResultMaster.categories.fetchError",
          defaultMessage: "Failed to fetch result categories",
        })
      );
      setCategoryOptions([]);
    }
  }, [intl, toast]);

  const handleSearch = () => {
    setCategoryFilter(categoryInput);
    setResultFilter(resultInput);
    setDescriptionFilter(descriptionInput);
  };

  const filteredRowData = useMemo(() => {
    return rowData.filter((row) => {
      const categoryMatches =
        !categoryFilter ||
        String(row.szCategoryCode ?? "")
          .toLowerCase()
          .includes(categoryFilter.toLowerCase());
      const resultMatches =
        !resultFilter ||
        String(row.szResultCode ?? "")
          .toLowerCase()
          .includes(resultFilter.toLowerCase());
      const descriptionMatches =
        !descriptionFilter ||
        String(row.szResultName ?? "")
          .toLowerCase()
          .includes(descriptionFilter.toLowerCase());
      return categoryMatches && resultMatches && descriptionMatches;
    });
  }, [rowData, categoryFilter, resultFilter, descriptionFilter]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Result",
          defaultMessage: "Result",
        }),
        field: "szResultCode",
        width: 120,
        editable: true,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Description",
          defaultMessage: "Description",
        }),
        field: "szResultName",
        width: 500,
        editable: true,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.Category",
          defaultMessage: "Category",
        }),
        field: "szCategoryCode",
        width: 130,
        editable: true,
        cellEditor: "agSelectCellEditor",
        required: true,
        cellEditorParams: {
          values: categoryOptions.map((opt) => opt.value),
        },
        valueFormatter: (params) => {
          const option = categoryOptions.find(
            opt => opt.value === params.value
          );
          return option ? option.label : params.value;
        }
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.daysLimit",
          defaultMessage: "Days Limit",
        }),
        field: "inNextActionLimitDays",
        width: 130,
        editable: true,
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
          id: "label.ResultMaster.escalationDays",
          defaultMessage: "Escalation Days",
        }),
        field: "inNoActionEscalate",
        width: 180,
        editable: true,
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
          id: "label.ResultMaster.active",
          defaultMessage: "Active",
        }),
        field: "chActive",
        width: 120,
        editable: true,
        isCheckbox: true,
        cellRenderer: "agCheckboxCellRenderer",
      },

      /* Commented-out "Available Actions" column kept below for reference:
      {
        headerName: intl.formatMessage({
          id: "label.ResultMaster.AvailableActions",
          defaultMessage: "Available Actions",
        }),
        width: 182,
        editable: false,
        filter: false,
        cellRenderer: (params) => {
          const isDisabled = !params.data?.isPersisted;
          return (
            <span
              style={{
                color: isDisabled ? "#999" : "#1976d2",
                cursor: isDisabled ? "not-allowed" : "pointer",
                textDecoration: isDisabled ? "none" : "underline",
                fontWeight: 500,
              }}
              onClick={() => { if (!isDisabled) handleActionClick(params.data); }}
            >
              Edit
            </span>
          );
        },
      },
      */
    ],
    [intl.locale, categoryOptions]
  );

  const fetchResults = () => {
    HAxiosService.GET(`${ResultMasterAPI.Result(screenMenuId)}?chActive=${ResultsActiveRequestDto.chActive}`)
      .then((res) => {
        const responseArray = res.data?.responseJson;
        if (Array.isArray(responseArray)) {
          const enrichedData = responseArray.map((item, index) => ({
            id: item.szResultCode || index + 1,
            ...item,
            chActive: item.chActive === "Y",
            isPersisted: true,
          }));
          setRowData(enrichedData);
        } else {
          setRowData([]);
        }
      })
      .catch(() => {
        toast.error("Error while fetching Results.");
      });
  };

  useEffect(() => {
    fetchResults();
    fetchCategories();
  }, []);

  const handleSave = ({ newRows, updatedRows, deletedRows }) => {
    const lstResults = [...newRows, ...updatedRows, ...deletedRows]
      .filter((row) => row.szResultCode && row.szResultCode.trim() !== "")
      .map((row) => ({
        szResultCode: row.szResultCode,
        szResultName: row.szResultName,
        szCategoryCode: row.szCategoryCode,
        inNextActionLimitDays:
          row.inNextActionLimitDays !== undefined &&
          row.inNextActionLimitDays !== ""
            ? Number(row.inNextActionLimitDays)
            : null,
        inNoActionEscalate:
          row.inNoActionEscalate !== undefined && row.inNoActionEscalate !== ""
            ? Number(row.inNoActionEscalate)
            : null,
        chActive: row.chActive ? "Y" : "N",
        szRstMode: row.mode || "U",
        chGlobalyn: "Y",
      }));

    return HAxiosService.POST(ResultMasterAPI.Result(screenMenuId), lstResults)
      .then((response) => {
        const resData = response.data;
        const backendPayload = resData?.responseJson;
        const status = String(backendPayload?.statusCode || "");

        if (status === "200") {
          fetchResults();
          return { success: true };
        } else {
          toast.error(backendPayload?.responseMsg || "Failed to save changes.");
          return { success: false };
        }
      })
      .catch(() => {
        toast.error("Error while saving data.");
        return { success: false };
      });
  };

  /* ─── Action handlers (commented-out feature) ────────────────────── */
 { /*
  const handleActionClick = (resultRow) => {
    setSelectedResult(resultRow);
    HAxiosService.POST(`${ResultMasterAPI.Result(screenMenuId)}/fetchResultActions`, { szResultCode: resultRow.szResultCode })
      .then((res) => {
        const list = res.data?.responseJson || res.data?.data || res.data || [];
        setActionList(list);
        setOpenActionPopup(true);
      })
      .catch(() => { toast.error("Failed to fetch actions"); });
  };
  

  const handleSaveActions = (payload) => {
    HAxiosService.POST(`${ResultMasterAPI.Result(screenMenuId)}/saveResultActions`, payload)
      .then(() => {
        toast.success("Actions saved successfully");
        setOpenActionPopup(false);
      })
      .catch(() => {
        toast.error("Failed to save actions");
      });
  }; */}

  return (
    <HBox sx={{ mt: 2 }}>
      <HBox className="result-master-header-card">
        <HBreadCrumb />
        <TitleBar
          title={intl.formatMessage({
            id: "label.ResultMaster.title",
            defaultMessage: "Global Results",
          })}
        />
        <HLabel
          value={intl.formatMessage({
            id: "label.resultMaster.description",
            defaultMessage:
              "Outcome codes that can be recorded against an action. Days Limit drives Show Limit on Followup; Esc Days triggers no-action escalation.",
          })}
          colon={false}
          align="left"
        />
      </HBox>
      
      <HBox className="result-master-search">
        <HBox sx={{flexDirection: "column", gap: 0.5}}>
          <HLabel
            value={intl.formatMessage({
              id: "label.ResultMaster.searchLabel",
              defaultMessage: "Category",
            })}
            colon={false}
            sx={{ fontSize: "12px", textAlign: "left"}}
          />
          <HDropdown
            name="Category"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            options={categoryOptions}
            width="160px"
          />
        </HBox>
        <HBox sx={{ flexDirection: "column", gap: 0.5 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.ResultMaster.ResultLabel",
              defaultMessage: "Result",
            })}
            colon={false}
            sx={{ fontSize: "12px", textAlign: "left"}}
          />
          <HTextField
            value={resultInput}
            onChange={(e) => setResultInput(e.target.value)}
            editable
            placeholder=""
            width="160px"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </HBox>

        <HBox sx={{  flexDirection: "column", gap: 0.5 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.ResultMaster.DescriptionLabel",
              defaultMessage: "Description",
            })}
            colon={false}
            sx={{ fontSize: "12px", textAlign: "left"}}
          />
          <HTextField

            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            editable
            placeholder=""
            width="200px"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </HBox>

        <HButton
          label={intl.formatMessage({
            id: "label.ResultMaster.searchBtn",
            defaultMessage: "Search",
          })}
          size="medium"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          sx={{ width: "120px" }}
        />

      </HBox>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          rowData={filteredRowData}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "57vh", minHeight: "360px" }}
          buttonStyle={{ paddingLeft: "0px", marginTop: "20px" }}
          pagination={true}
          paginationPageSize={10}
          sort={true}
          globalSearch={false}
          allowAdd={true}
          allowDelete={true}
          allowUpdate={true}
          rowDragging={false}
          onSave={handleSave}
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, close: true }}
        />

        {/* Commented-out ActionResultDialog kept for reference:
        <ActionResultDialog
          open={openActionPopup}
          onClose={() => setOpenActionPopup(false)}
          parentType="RESULT"
          parentData={selectedResult}
          mappingList={actionList}
          onSave={handleSaveActions}
        />
        */}
      </HBox>
    </HBox>
  );
};

export default ResultMaster;
