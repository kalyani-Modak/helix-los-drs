import { Box, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HDropdown, HLabel, SearchCommonBox, TitleBar, HButtonBar, HBreadCrumb, HAgGrid } from "@helix/component-library";
import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";
import { CollectionStrategiesAPI } from "./apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";


import { gridProvisioningAcionDefObj } from "../../../common/components/SearchGridDefObj";

const ActionCodeSearchRenderer = (props) => {
  const { value, node } = props;
  return (
    <SearchCommonBox
    apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
    searchCode="PRACTCDE"
      setSelectedValue={(dataValue) =>
        node.setDataValue("szCode", dataValue || value)
      }
      selectedValue={value}
      selectedColumn="szCode"
      gridDefObj={gridProvisioningAcionDefObj}
      gridWidth={350}
      gridHeight={300}
      gridNoOfRowsPerPage={2}
      searchBoxWidth={125}
      searchBoxHeight={25}
      searchBoxFontSize={12}
      error={false}
    />
  );
};

const ExposureStrategies = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const [strategyCode, setStrategyCode] = useState("");
  const [strategyOptions, setStrategyOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [holidayOptions, setHolidayOptions] = useState([]);
  const [exclusionOptions, setExclusionOptions] = useState([]);
  const [referenceDateOptions, setReferenceDateOptions] = useState([]);
  const [iStrategySeqNo, setIStrategySeqNo] = useState(null);
  const [gridKey, setGridKey] = useState(Date.now());

  // ─── Fetch dropdown options ────────────────────────────────────────────────
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setDropdownLoading(true);
      try {
        const res = await HAxiosService.GET(CollectionStrategiesAPI.StrategyDetails(screenMenuId)); 

        if (res.data?.status === "Success") {
          const responseJson = res.data.responseJson;
          setHolidayOptions(
            (responseJson?.lstHolidayTreatmentOptions || []).map((o) => ({
              code: o.code,
              description: o.description,
            })),
          );
          setExclusionOptions(
            (responseJson?.lstOnExclusionOptions || []).map((o) => ({
              code: o.code,
              description: o.description,
            })),
          );
          setReferenceDateOptions(
            (responseJson?.lstReferenceDateOptions || []).map((o) => ({
              code: o.code,
              description: o.description,
            })),
          );
        } else {
          toast.error(res.data?.message || "Failed to load dropdown options");
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
        toast.error("Error loading dropdown options");
      } finally {
        setDropdownLoading(false);
      }
    };
    fetchDropdownOptions();
  }, []);

  // ─── Fetch strategy list ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchStrategyOptions = async () => {
      setLoading(true);
      try {
        const res = await HAxiosService.GET(
          `${CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId)}?szType=${("E")}`,
        );
        

        if (res.data?.status === "Success") {
          const strategies = res.data.responseJson || [];
          const activeStrategies = strategies.map((item) => ({
            value: item.szStrategyCode || "",
            label: item.szStrategyCode + " - " + (item.szDescription || ""),
            description: item.szDescription || "",
            iStrategySeqNo: item.inStrategySeqNo,
          }));
          if (activeStrategies.length > 0) {
            setStrategyCode(activeStrategies[0].value);
            setIStrategySeqNo(activeStrategies[0].iStrategySeqNo);
          }
          setStrategyOptions(activeStrategies);
        } else {
          toast.error(
            res.data?.message ||
              intl.formatMessage({
                id: "label.exposure.strategies.load.failed",
                defaultMessage: "Failed to load exposure strategies",
              }),
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(
          intl.formatMessage({
            id: "label.exposure.strategies.load.error",
            defaultMessage: "Error loading exposure strategies",
          }),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStrategyOptions();
  }, []);

  const handleStrategyChange = (e) => {
    const selected = strategyOptions.find(
      (opt) => opt.value === e.target.value,
    );
    setStrategyCode(e.target.value);
    setIStrategySeqNo(selected?.iStrategySeqNo);
    setRowData([]);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "",
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        pinned: "left",
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.serialNo",
          defaultMessage: "Sr No",
        }),
        field: "inSrNo",
        width: 75,
        pinned: "left",
        filter: false,
        editable: false,
        valueFormatter: (params) => {
          if (
            params.value === undefined ||
            params.value === null ||
            params.value === ""
          )
            return "";
          return params.value;
        },
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.actionCode",
          defaultMessage: "Action Code",
        }),
        field: "szCode",
        width: 150,
        filter: false,
        editable: false,
        cellRenderer: ActionCodeSearchRenderer,
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.exposurePercentage",
          defaultMessage: "Exposure Percentage",
        }),
        field: "fExposurePerc",
        editable: true,
        width: 130,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.dependsOn",
          defaultMessage: "Depends On",
        }),
        field: "szDependsOn",
        editable: true,
        width: 120,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.successors",
          defaultMessage: "Successors",
        }),
        field: "szSuccessors",
        editable: true,
        width: 110,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.requiresAuthorization",
          defaultMessage: "Requires Authorization",
        }),
        field: "nRequiresAuthorization",
        editable: true,
        width: 100,
        sortable: true,
        filter: false,
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        cellRenderer: (params) => (
          <input
            type="checkbox"
            checked={params.value === "Y" || params.value === true}
            onChange={(e) => {
              const newValue = e.target.checked ? "Y" : "N";
              params.node.setDataValue("nRequiresAuthorization", newValue);
            }}
            style={{ cursor: "pointer" }}
          />
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.IncludeCasesWith",
          defaultMessage: "Include Cases With",
        }),
        field: "includeCases",
        width: 150,
        editable: false,
        filter: false,
        cellRenderer: () => (
          <span
            style={{
              color: "#1976d2",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            {intl.formatMessage({ id: "collection.grid.define" })}
          </span>
        ),
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.holidayTreatment",
          defaultMessage: "Holiday Treatment",
        }),
        headerClass: "centered-parent-header",
        children: [
          {
            headerName: intl.formatMessage({
              id: "label.exposure.strategies.Behavior",
              defaultMessage: "Behavior",
            }),
            field: "szSkipHoliday",
            editable: true,
            width: 150,
            valueGetter: (params) => params.data.szHolidayTreatmentBehaviorDesc,
            valueSetter: (params) => {
              const selectedOption = holidayOptions.find(
                (o) => o.description === params.newValue,
              );
              if (selectedOption) {
                params.data.szHolidayTreatmentBehavior = selectedOption.code;
                params.data.szHolidayTreatmentBehaviorDesc =
                  selectedOption.description;
              }
              return true;
            },
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: holidayOptions.map((o) => o.description),
            },
            filter: false,
          },
          {
            headerName: intl.formatMessage({
              id: "label.exposure.strategies.performOnNWD",
              defaultMessage: "Perform On NWD",
            }),
            field: "szPerformOnNWD",
            editable: true,
            width: 150,
            filter: false,
            cellStyle: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            cellRenderer: (params) => (
              <input
                type="checkbox"
                checked={params.value === "Y" || params.value === true}
                onChange={(e) => {
                  const newValue = e.target.checked ? "Y" : "N";
                  params.node.setDataValue("szPerformOnNWD", newValue);
                }}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        ],
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.onExclusion",
          defaultMessage: "On Exclusion",
        }),
        field: "szOnExclusionDesc",
        editable: true,
        width: 130,
        valueGetter: (params) => params.data.szOnExclusionDesc,
        valueSetter: (params) => {
          const selectedOption = exclusionOptions.find(
            (o) => o.description === params.newValue,
          );
          if (selectedOption) {
            params.data.szOnExclusion = selectedOption.code;
            params.data.szOnExclusionDesc = selectedOption.description;
          }
          return true;
        },
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: exclusionOptions.map((o) => o.description),
        },
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.exposure.strategies.excludeCasesWith",
          defaultMessage: "Exclude Cases With",
        }),
        field: "excludeCases",
        width: 150,
        editable: false,
        cellRenderer: () => (
          <span
            style={{
              color: "#1976d2",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            {intl.formatMessage({ id: "collection.grid.define" })}
          </span>
        ),
        filter: false,
      },
    ],
    [intl, holidayOptions, exclusionOptions, referenceDateOptions],
  );

  const gridStyle = { width: "100%", height: "55vh", marginTop: "20px" };

  // ─── Fetch strategy rows ───────────────────────────────────────────────────
  const handleFetch = async (strategySeqNo = iStrategySeqNo) => {
    try {
      if (!strategyCode && !strategySeqNo) {
        toast.error(
          intl.formatMessage({
            id: "label.exposure.strategies.code.required",
            defaultMessage: "Strategy code is required",
          }),
        );
        return;
      }
      const seqNo = strategySeqNo || iStrategySeqNo;
      if (!seqNo) {
        toast.error(
          intl.formatMessage({
            id: "label.exposure.strategies.invalid",
            defaultMessage: "Invalid strategy sequence number",
          }),
        );
        return;
      }
      setLoading(true);
      const res = await HAxiosService.GET( `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/fetchStrategyDetails?inStrategySeqNo=${seqNo}`,
      );

      if (res.data?.status !== "Success") {
        setRowData([]);
        if (
          res.data?.responseJson &&
          typeof res.data.responseJson === "object" &&
          !Array.isArray(res.data.responseJson)
        ) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data?.message ||
              intl.formatMessage({
                id: "label.exposure.strategies.fetch.failed",
                defaultMessage: "Failed to fetch exposure strategy details",
              }),
          );
        }
        return;
      }

      const scheduleData = res.data.responseJson || [];
      if (!scheduleData.length) {
        setRowData([]);
        toast.info(
          intl.formatMessage({
            id: "label.exposure.strategies.no.data",
            defaultMessage: "No exposure strategy data available",
          }),
        );
        return;
      }
      const sortedData = [...scheduleData].sort(
        (a, b) => (a.inSrNo || 0) - (b.inSrNo || 0),
      );
      const mappedRows = sortedData.map((item, index) => ({
        key: `row-${item.inSrNo}-${item.szActionCode}-${index}`,
        inSrNo: item.inSrNo,
        iwfRuleSeqNo: item.inWfRuleSeqNo,
        szCode: item.szActionCode || "",
        szDependsOn: item.szDependsOn || "",
        szSuccessors: item.szSuccessors || "",
        fExposurePerc: item.bdExposurePerc || 0.0,
        nRequiresAuthorization: item.chAuthRequiredYn === "Y",
        bAllocate: item.chAllocateYn === "Y",
        szPerformOnNWD: item.chPerformOnNxtWrkngDayYn === "Y",
        szHolidayTreatmentBehavior: item.szSkipHoliday || "",
        szHolidayTreatmentBehaviorDesc:
          holidayOptions.find(
            (o) => String(o.code) === String(item.szSkipHoliday),
          )?.description ||
          item.szSkipHoliday ||
          "",
        szOnExclusion: item.szExclusionTreatment || "",
        szOnExclusionDesc:
          exclusionOptions.find(
            (o) => String(o.code) === String(item.szExclusionTreatment),
          )?.description ||
          item.szExclusionTreatment ||
          "",
        bExclude: false,
      }));
      setRowData(mappedRows);
      setGridKey(Date.now());
    } catch (error) {
      console.error(error);
      toast.error(
        intl.formatMessage({
          id: "label.exposure.strategies.fetch.error",
          defaultMessage: "Failed to fetch exposure strategy details",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const mapRowToDto = (row, szMode) => ({
    szMode,
    inSrNo: row.inSrNo ?? null,
    szPhase: row.szPhase || "",
    szActionCode: row.szCode || "",
    inDays: row.nOnDay ? Number(row.nOnDay) : 0,
    bgExposurePerc: row.fExposurePerc || 0.0,
    szSkipHoliday: row.szHolidayTreatmentBehavior || "",
    chPerformOnNxtWrkngDayYn: row.szPerformOnNWD ? "Y" : "N",
    szExclusionTreatment: row.szOnExclusion || "",
    chAuthRequiredYn: row.nRequiresAuthorization ? "Y" : "N",
    szRefDateField: row.szReferenceDate || "",
    chAllocateYn: row.bAllocate ? "Y" : "N",
    szAllocateTo: row.bAllocate ? row.szAllocateTo || "AGENT" : null,
    szSuccessors: row.szSuccessors || "",
    szDependsOn: row.szDependsOn || "",
  });

  // ─── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  } = {}) => {
    if (!strategyCode) {
      toast.error(
        intl.formatMessage({
          id: "label.exposure.strategies.code.required",
          defaultMessage: "Strategy code is required",
        }),
      );
      return { success: false };
    }
    const selectedStrategy = strategyOptions.find(
      (opt) => opt.value === strategyCode,
    );
    const seqNo = selectedStrategy?.iStrategySeqNo;
    if (!seqNo) {
      toast.error(
        intl.formatMessage({
          id: "label.exposure.strategies.invalid",
          defaultMessage: "Invalid strategy sequence number",
        }),
      );
      return { success: false };
    }

    const currentGridRows = gridRef.current?.getCurrentData() || [];
    const deletedGridRowIds = new Set(deletedRows.map((r) => r.gridRowId));
    const deletedActionCodes = new Set(deletedRows.map((r) => r.szCode));
    const remainingRows = currentGridRows.filter(
      (r) =>
        !r._deleted &&
        !deletedGridRowIds.has(r.gridRowId) &&
        !deletedActionCodes.has(r.szCode),
    );

    const newIds = new Set(newRows.map((r) => r.gridRowId));
    const updatedIds = new Set(updatedRows.map((r) => r.gridRowId));

    const remainingDtos = remainingRows.map((r, index) => {
      let mode = "B";
      if (newIds.has(r.gridRowId)) mode = "N";
      else if (updatedIds.has(r.gridRowId)) mode = "E";
      return mapRowToDto({ ...r, inSrNo: index + 1 }, mode);
    });

    const deletedDtos = deletedRows.map((r) => mapRowToDto(r, "D"));
    const lstStrategyDetailsMasterDto = [...deletedDtos, ...remainingDtos];

    if (lstStrategyDetailsMasterDto.length === 0) {
      toast.info(
        intl.formatMessage({
          id: "label.exposure.strategies.no.changes",
          defaultMessage: "No changes to save",
        }),
      );
      return { success: false };
    }

    const payload = { inStrategySeqNo: seqNo, lstStrategyDetailsMasterDto };
    console.log("Final Save Payload:", JSON.stringify(payload, null, 2));

    try {
      setLoading(true);
      const res = await HAxiosService.POST(
        CollectionStrategiesAPI.StrategyDetails(screenMenuId),
        payload,
      );

      console.log("Save response:", res.data);

      if (res.data?.status === "Success") {
        toast.success(
          res.data.message ||
            intl.formatMessage({
              id: "label.exposure.strategies.save.success",
              defaultMessage: "Exposure strategy details saved successfully",
            }),
        );
        await handleFetch();
        return { success: true };
      } else {
        if (
          res.data?.responseJson &&
          typeof res.data.responseJson === "object" &&
          !Array.isArray(res.data.responseJson)
        ) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data?.message ||
              intl.formatMessage({
                id: "label.exposure.strategies.save.failed",
                defaultMessage: "Failed to save exposure strategy details",
              }),
          );
        }
        return { success: false };
      }
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar
        title={intl.formatMessage({
          id: "label.exposure.strategies.title",
          defaultMessage: "Exposure Strategies",
        })}
      />
      <Box
        sx={{ display: "flex", p: "10px 20px", gap: 3, alignItems: "center" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.exposure.strategies.code",
              defaultMessage: "Strategy Code",
            })}
          />
          <HDropdown
            name="strategyCode"
            value={strategyCode}
            onChange={handleStrategyChange}
            options={strategyOptions}
            width="250px"
            required
            disabled={loading || dropdownLoading}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => handleFetch()}
          sx={{ width: "100px" }}
        >
          {intl.formatMessage({
            id: "label.exposure.strategies.fetch",
            defaultMessage: "Fetch",
          })}
        </Button>
      </Box>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          key={gridKey}
          SearchCommonBoxRenderer={ActionCodeSearchRenderer}
          rowData={rowData}
          setRowData={setRowData}
          columnDefs={columnDefs}
          gridStyle={gridStyle}
          pagination={true}
          paginationPageSize={10}
          globalSearch={false}
          allowAdd={true}
          allowDelete={true}
          allowUpdate={true}
          onSave={handleSave}
          getRowId={(params) =>
            String(params.data.tempId || params.data.inSrNo || params.data.key)
          }
          suppressHorizontalScroll={false}
          alwaysShowHorizontalScroll={true}
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default ExposureStrategies;
