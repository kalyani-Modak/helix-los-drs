import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HAxiosService, HBox, HButtonBar, HCheckBox, TitleBar, HLabel, HBreadCrumb, HAgGrid, useToast } from "@helix/component-library";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { ResultCategoryMasterAPI } from "../apiEndpoints.jsx"; 
import "./result-category-master.screen.css";
import { handleValidationErrors } from './../ValidationUtils';
import { useLocation } from "react-router-dom";


const isSuccessFlag = (v) => v === "Y" || v === true;

const checkboxCellStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const ResultCategoryMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const ScreenMenuId =  location.state.menuId;

  const pageHeaderTitle = intl.formatMessage({
    id: "label.ResultCategoryMaster.pageHeaderTitle",
    defaultMessage: "Result Categories",
  });

  const fetchResultCategoryData = useCallback(() => {
    HAxiosService.GET(ResultCategoryMasterAPI.ResultCategoryDetails(ScreenMenuId))
      .then((res) => {
        const payload = res.data;
        const responseArray = Array.isArray(payload)
          ? payload
          : payload?.responseJson || [];

        if (Array.isArray(responseArray)) {
          const enrichedData = responseArray.map((item) => ({
            ...item,
            szSuccess: item.szSuccess ?? "N",
            szValidPTP: item.szValidPTP ?? item.szPTP ?? "N",
            szRPCYN: item.szRPCYN ?? "N",
          }));
          setRowData(enrichedData);
        } else {
          toast.warn(
            intl.formatMessage({
              id: "label.ResultCategoryMaster.fetch.invalidResponse",
              defaultMessage: "Could not load result categories data.",
            })
          );
        }
      })
      .catch((error) => {
        console.error("Failed to fetch Result Categories:", error);
        toast.error(
          intl.formatMessage({
            id: "label.ResultCategoryMaster.fetch.error",
            defaultMessage: "Error while fetching result categories.",
          })
        );
      });
  }, [intl, toast]);

  useEffect(() => {
    fetchResultCategoryData();
  }, [fetchResultCategoryData]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.ResultCategory",
          defaultMessage: "Result Category",
        }),
        field: "szCategoryCode",
        width: 160,
        editable: true,
        sortable: true,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.Description",
          defaultMessage: "Description",
        }),
        field: "szCategoryDesc",
        flex: 1,
        minWidth: 200,
        editable: true,
        sortable: true,
        required: true,
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.Successful",
          defaultMessage: "Successful",
        }),
        field: "szSuccess",
        width: 120,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => (
          <HCheckBox
            label=""
            align="center"
            margin="15px"
            checked={isSuccessFlag(params.value)}
            onChange={(e) => {
              const checked = e.target.checked;
              if (!checked) {
                params.node.setDataValue("szValidPTP", "N");
                params.node.setDataValue("szRPCYN", "N");
              }
              params.node.setDataValue("szSuccess", checked ? "Y" : "N");
            }}
          />
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.PTP",
          defaultMessage: "PTP",
        }),
        field: "szValidPTP",
        width: 90,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => {
          const successful = isSuccessFlag(params.data?.szSuccess);
          return (
            <HCheckBox
              label=""
              align="center"
              margin="15px"
              checked={isSuccessFlag(params.value)}
              disabled={!successful}
              onChange={(e) => {
                params.node.setDataValue(
                  "szValidPTP",
                  e.target.checked ? "Y" : "N"
                );
              }}
            />
          );
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.ResultCategoryMaster.RightPartyContacted",
          defaultMessage: "Right Party Contacted",
        }),
        field: "szRPCYN",
        width: 160,
        editable: false,
        isCheckbox: true,
        sortable: true,
        filter: false,
        cellStyle: checkboxCellStyle,
        cellRenderer: (params) => {
          const successful = isSuccessFlag(params.data?.szSuccess);
          return (
            <HCheckBox
              label=""
              align="center"
              margin="15px"
              checked={isSuccessFlag(params.value)}
              disabled={!successful}
              onChange={(e) => {
                params.node.setDataValue(
                  "szRPCYN",
                  e.target.checked ? "Y" : "N"
                );
              }}
            />
          );
        },
      },
    ],
    [intl.locale]
  );

  const handleSave = ({ newRows, updatedRows, deletedRows }) => {
    const allChanges = [...newRows, ...updatedRows, ...deletedRows];

    const activeRows = allChanges.filter((row) => row.mode !== "D");

    const seenCodes = new Set();
    for (const row of activeRows) {
      const codeKey = (row.szCategoryCode ?? "").trim().toUpperCase();
      if (seenCodes.has(codeKey)) {
        toast.error(
          intl.formatMessage(
            {
              id: "error.resultCategory.duplicateCategory",
              defaultMessage: "Duplicate result category: {code}",
            },
            { code: (row.szCategoryCode ?? "").trim() }
          )
        );
      }
      seenCodes.add(codeKey);
    }

    const lstResultCategories = allChanges.map((row) => {
      const successY = isSuccessFlag(row.szSuccess);
      let ptp =
        row.szValidPTP === "Y" || row.szValidPTP === true ? "Y" : "N";
      let rpc = row.szRPCYN === "Y" || row.szRPCYN === true ? "Y" : "N";
      if (!successY) {
        ptp = "N";
        rpc = "N";
      }
      return {
        szCategoryCode: row.szCategoryCode?.trim() || "",
        szCategoryDesc: row.szCategoryDesc?.trim() || "",
        szSuccess: successY ? "Y" : "N",
        szValidPTP: ptp,
        szRPCYN: rpc,
        szMode: row.mode || "E",
      };
    });

    return HAxiosService.POST(
      ResultCategoryMasterAPI.ResultCategoryDetails(ScreenMenuId),
      lstResultCategories
    )
      .then((response) => {
        const resData = response.data;

        if (resData.status === "Success") {
          fetchResultCategoryData();
          return { success: true };
        }
        if (resData?.errors) {
          handleValidationErrors(intl, toast, resData.errors);
        }
        toast.error(
          resData.message ||
            intl.formatMessage({
              id: "label.ResultCategoryMaster.save.failed",
              defaultMessage: "Failed to save Result Category Master",
            })
        );
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            intl.formatMessage({
              id: "label.ResultCategoryMaster.save.error",
              defaultMessage: "Error while saving result categories.",
            })
        );
      });
  };

  return (
    <HBox className="result-category-master-page">
      <HBox className="result-category-master-header-card">
      <HBreadCrumb />
      <TitleBar title={"label.ResultCategoryMaster.pageHeaderTitle"} />
    <HLabel
      value={intl.formatMessage({
        id: "label.ResultCategoryMaster.pageHeaderDescription",
        defaultMessage:
          "Group result codes by category. PTP and Right Party Contacted only apply when the category is Successful.",
      })}
      align="left"
      colon={false}
    />
  </HBox>

  <HBox className="result-category-master-grid-wrap">
    <HAgGrid
      ref={gridRef}
      key={intl.locale}
      rowData={rowData}
      columnDefs={columnDefs}
      gridStyle={{ width: "100%", height: "55vh", minHeight: "360px" }}
      pagination
      paginationPageSize={10}
      sort
      allowAdd
      allowDelete
      allowUpdate
      rowDragging={false}
      onSave={handleSave}
      addCheckBoxes={false}
      gridClassName="drs-list-grid"
      embeddedInSection
    />
  </HBox>

  <HButtonBar
    onSave={() => gridRef.current?.submitChanges?.()}
    onClose={() => navigate("/homelayout/welcomepage")}
  />
</HBox>
  );
};
export default ResultCategoryMaster;
