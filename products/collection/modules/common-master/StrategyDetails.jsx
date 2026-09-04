import { useEffect, useState, useMemo, useRef } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { useToast, HAxiosService, HBox, HDropdown, HLabel, SearchCommonBox, TitleBar, HAgGrid } from "@helix/component-library";
import { StrategyDetailsMasterAPI } from "./apiEndpoints";
import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";

import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";


import { gridStrategyActionDefObj } from "../../../common/components/SearchGridDefObj";

const ActionCodeSearchRenderer = (props) => {
  const { value, node } = props;
  return (
    <SearchCommonBox
      apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
      searchCode="STRACT"
      setSelectedValue={(dataValue) =>
        node.setDataValue("szActionCode", dataValue || value)
      }
      selectedValue={value}
      selectedColumn="szactioncode"
      gridDefObj={gridStrategyActionDefObj}
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

const StrategyDetails = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const [strategyCode, setStrategyCode] = useState("");
  const [strategyOptions, setStrategyOptions] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [iStrategySeqNo, setIStrategySeqNo] = useState(null);

  const [holidayOptions, setHolidayOptions] = useState([]);
  const [exclusionOptions, setExclusionOptions] = useState([]);
  const [referenceDateOptions, setReferenceDateOptions] = useState([]);

  const t = (key) =>
    key ? intl.formatMessage({ id: key, defaultMessage: key }) : "";

  const normalize = (item) => ({
    code: item.code ?? "",
    desc: item.szi18nDesc || item.description || "",
  });

  // ─── Fetch dropdown options ────────────────────────────────────────────────
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setDropdownLoading(true);
      try {
        const res = await HAxiosService.GET(StrategyDetailsMasterAPI.fetchDropdown()); // ✅

        if (res.data?.status === "Success") {
          const rj = res.data.responseJson;
          setHolidayOptions((rj?.lstHolidayTreatmentOptions || []).map(normalize));
          setExclusionOptions((rj?.lstOnExclusionOptions || []).map(normalize));
          setReferenceDateOptions((rj?.lstReferenceDateOptions || []).map(normalize));
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
        const res = await HAxiosService.POST( // ✅
          StrategyDetailsMasterAPI.fetchAllStrategyDetails("C"),
          { szType: "C" }
        );

        if (res.data?.status === "Success") {
          const strategies = res.data.responseJson || [];
          const activeStrategies = strategies.map((item) => ({
            value: item.szStrategyCode || "",
            label: `${item.szStrategyCode} - ${item.szDescription || ""}`,
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
              intl.formatMessage({ id: "collection.strategy.load.failed" })
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(intl.formatMessage({ id: "collection.strategy.load.error" }));
      } finally {
        setLoading(false);
      }
    };

    fetchStrategyOptions();
  }, []);

  const handleStrategyChange = (e) => {
    const selected = strategyOptions.find((opt) => opt.value === e.target.value);
    setStrategyCode(e.target.value);
    setIStrategySeqNo(selected?.iStrategySeqNo);
    setRowData([]);
  };

  const columnDefs = useMemo(() => [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      pinned: "left",
      filter: false,
      headerName: intl.formatMessage({ id: "collection.grid.select" }),
    },
    {
      headerName: intl.formatMessage({ id: "label.Payment.SrNo", defaultMessage: "Sr No." }),
      field: "inSrNo",
      width: 80,
      pinned: "left",
      filter: false,
      editable: false,
      valueFormatter: (params) =>
        params.value == null || params.value === "" ? "" : params.value,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.action", defaultMessage: "Action Code" }),
      field: "szActionCode",
      width: 150,
      filter: false,
      editable: false,
      cellRenderer: ActionCodeSearchRenderer,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.action", defaultMessage: "Action Code" }),
      field: "szActionCode",
      width: 110,
      editable: true,
      hide: true,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.onDay", defaultMessage: "On Day" }),
      field: "nOnDay",
      editable: true,
      width: 100,
      filter: false,
      valueFormatter: (params) =>
        params.value == null || params.value === "" ? "" : params.value,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.requiresAuth", defaultMessage: "Requires Authorization" }),
      field: "nRequiresAuthorization",
      editable: true,
      width: 150,
      cellDataType: "boolean",
      cellRenderer: "agCheckboxCellRenderer",
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.allocate", defaultMessage: "Allocate" }),
      field: "bAllocate",
      editable: true,
      width: 90,
      cellDataType: "boolean",
      cellRenderer: "agCheckboxCellRenderer",
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.dependsOn", defaultMessage: "Depends On" }),
      field: "szDependsOn",
      editable: true,
      width: 120,
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.successors", defaultMessage: "Successors" }),
      field: "szSuccessors",
      editable: true,
      width: 110,
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.phase", defaultMessage: "Phase" }),
      field: "szPhase",
      editable: true,
      width: 80,
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.includeCases", defaultMessage: "Include Cases With" }),
      field: "includeCases",
      width: 150,
      editable: false,
      filter: false,
      cellRenderer: () => (
        <span style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 500 }}>
          {intl.formatMessage({ id: "collection.grid.define" })}
        </span>
      ),
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.holidayTreatment", defaultMessage: "Holiday Treatment" }),
      field: "szHolidayTreatmentBehavior",
      editable: true,
      width: 150,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: holidayOptions.map((o) => o.code),
      },
      valueFormatter: (params) => {
        const opt = holidayOptions.find((o) => String(o.code) === String(params.value));
        return opt ? t(opt.desc) : params.value ?? "";
      },
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.performOnNWD", defaultMessage: "Perform On NWD" }),
      field: "szPerformOnNWD",
      editable: true,
      width: 150,
      cellDataType: "boolean",
      cellRenderer: "agCheckboxCellRenderer",
      filter: false,
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.onExclusion", defaultMessage: "On Exclusion" }),
      field: "szOnExclusion",
      editable: true,
      width: 130,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: exclusionOptions.map((o) => o.code),
      },
      valueFormatter: (params) => {
        const opt = exclusionOptions.find((o) => String(o.code) === String(params.value));
        return opt ? t(opt.desc) : params.value ?? "";
      },
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.referenceDate", defaultMessage: "Reference Date" }),
      field: "szReferenceDate",
      editable: true,
      width: 150,
      filter: false,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: referenceDateOptions.map((o) => o.code),
      },
      valueFormatter: (params) => {
        const opt = referenceDateOptions.find((o) => String(o.code) === String(params.value));
        return opt ? t(opt.desc) : params.value ?? "";
      },
    },
    {
      headerName: intl.formatMessage({ id: "collection.grid.excludeCases", defaultMessage: "Exclude Cases With" }),
      field: "excludeCases",
      width: 150,
      editable: false,
      filter: false,
      cellRenderer: () => (
        <span style={{ color: "#1976d2", textDecoration: "underline", fontWeight: 500 }}>
          {intl.formatMessage({ id: "collection.grid.define" })}
        </span>
      ),
    },
  ],
  [intl.locale, holidayOptions, exclusionOptions, referenceDateOptions]);

  const gridStyle = { width: "100%", height: "55vh", marginTop: "20px" };

  // ─── Fetch strategy rows ───────────────────────────────────────────────────
  const handleFetch = async (strategySeqNo = iStrategySeqNo) => {
    try {
      if (!strategyCode && !strategySeqNo) {
        toast.error(intl.formatMessage({ id: "collection.strategy.code.required" }));
        return;
      }
      const seqNo = strategySeqNo || iStrategySeqNo;
      if (!seqNo) {
        toast.error(intl.formatMessage({ id: "collection.strategy.invalid" }));
        return;
      }

      setLoading(true);
      const res = await HAxiosService.POST( // ✅
        StrategyDetailsMasterAPI.fetchStrategyDetails(),
        { inStrategySeqNo: seqNo }
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
          toast.error(res.data?.message || intl.formatMessage({ id: "collection.fetch.failed" }));
        }
        return;
      }

      const scheduleData = res.data.responseJson || [];
      if (!scheduleData.length) {
        setRowData([]);
        toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
        return;
      }

      const sortedData = [...scheduleData].sort((a, b) => (a.inSrNo || 0) - (b.inSrNo || 0));

      const mappedRows = sortedData.map((item, index) => ({
        key: `row-${item.inSrNo}-${item.szActionCode}-${index}`,
        inSrNo: item.inSrNo,
        iwfRuleSeqNo: item.inWfRuleSeqNo,
        szActionCode: item.szActionCode || "",
        nOnDay: item.inDays || 0,
        szPhase: item.szPhase || "",
        szDependsOn: item.szDependsOn || "",
        szSuccessors: item.szSuccessors || "",
        nRequiresAuthorization: item.chAuthRequiredYn === "Y",
        bAllocate: item.chAllocateYn === "Y",
        szPerformOnNWD: item.chPerformOnNxtWrkngDayYn === "Y",
        szHolidayTreatmentBehavior: item.szSkipHoliday || "",
        szOnExclusion: item.szExclusionTreatment || "",
        szReferenceDate: item.szRefDateField || "",
        szAllocateTo: item.szAllocateTo || "",
        bExclude: false,
      }));

      setRowData(mappedRows);
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "collection.fetch.error" }));
    } finally {
      setLoading(false);
    }
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const mapRowToDto = (row, szMode) => ({
    szMode,
    inSrNo: row.inSrNo ?? null,
    szPhase: row.szPhase || "",
    szActionCode: row.szActionCode || "",
    inDays: row.nOnDay ? Number(row.nOnDay) : 0,
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

  const handleSave = async ({ newRows = [], updatedRows = [], deletedRows = [] } = {}) => {
    if (!strategyCode) {
      toast.error(intl.formatMessage({ id: "collection.strategy.code.required" }));
      return { success: false };
    }

    const selectedStrategy = strategyOptions.find((opt) => opt.value === strategyCode);
    const seqNo = selectedStrategy?.iStrategySeqNo;
    if (!seqNo) {
      toast.error(intl.formatMessage({ id: "collection.strategy.invalid" }));
      return { success: false };
    }

    const currentGridRows = gridRef.current?.getCurrentData() || [];
    const deletedGridRowIds = new Set(deletedRows.map((r) => r.gridRowId));
    const deletedActionCodes = new Set(deletedRows.map((r) => r.szActionCode));
    const remainingRows = currentGridRows.filter(
      (r) =>
        !r._deleted &&
        !deletedGridRowIds.has(r.gridRowId) &&
        !deletedActionCodes.has(r.szActionCode)
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
      toast.info(intl.formatMessage({ id: "collection.no.changes" }));
      return { success: false };
    }

    const payload = { inStrategySeqNo: seqNo, lstStrategyDetailsMasterDto };

    try {
      setLoading(true);
      const res = await HAxiosService.POST( // ✅
        StrategyDetailsMasterAPI.saveStrategyDetails(),
        payload
      );

      if (res.data?.status === "Success") {
        toast.success(res.data.message || intl.formatMessage({ id: "collection.save.success" }));
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
          toast.error(res.data?.message || intl.formatMessage({ id: "collection.save.failed" }));
        }
        return { success: false };
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(intl.formatMessage({ id: "collection.save.error" }));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ mt: 2 }}>
      <TitleBar title={intl.formatMessage({ id: "collection.strategy.title" })} />

      <Box sx={{ display: "flex", gap: 2, p: "10px 20px", alignItems: "center" }}>
        <HLabel value={intl.formatMessage({ id: "collection.strategy.code" })} />
        <HDropdown
          name="strategyCode"
          value={strategyCode}
          onChange={handleStrategyChange}
          options={strategyOptions}
          width="310px"
          required
          disabled={loading || dropdownLoading}
        />
        <Button
          variant="contained"
          onClick={() => handleFetch()}
          sx={{ width: "180px" }}
          disabled={loading || dropdownLoading}
        >
          {loading || dropdownLoading
            ? intl.formatMessage({ id: "collection.button.loading" })
            : intl.formatMessage({ id: "collection.button.fetch" })}
        </Button>
      </Box>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
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

export default StrategyDetails;
