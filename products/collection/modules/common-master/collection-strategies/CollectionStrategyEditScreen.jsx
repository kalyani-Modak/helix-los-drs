import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import dayjs from "dayjs";
import { useToast, HAxiosService, HBox, HButton, HButtonBar, HCheckBox, HDatePicker, HDropdown, HLabel, HTab, HTabs, HTextField, HTextarea, TitleBar, HBreadCrumb, ALIGNMENT, HAgGrid, FilterMaster } from "@helix/component-library";

import { CollectionStrategiesAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../../early-collection/ValidationUtils.jsx";


import { ActionCodeSearchRenderer, collectionStrategiesGridStyle, getCollectionStrategiesColumnDefs, DependsOnSearchRenderer, SuccessorOnSearchRenderer  } from "./collectionStrategies.columnDefs.jsx";
import { buildDependencyMatrix, emptyHeader, findStrategyInList, mapHeaderFromApi, mapScheduleRowFromApi, mapScheduleRowToDto, parseActionList, STRATEGY_TYPE_COLLECTION, mapHeaderToDto} from "./collectionStrategies.mappers.js";
import { emptyScheduleRow } from "./collectionStrategyConstants.js";
import "./collection-strategies.screen.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { flushSync } from 'react-dom';

const TAB_BASIC = "basic";
const TAB_SCHEDULE = "schedule";
const TAB_VISUAL = "visual";
const TAB_ENTRY = "entry";
const TAB_EXIT = "exit";
const TAB_EXCLUSION = "exclusion";
const TAB_RULES = "rules";
const TAB_DEPS = "deps";

const LIST_PATH = "/homelayout/collectionStrategies";

const CollectionStrategyEditScreen = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { strategyCode: strategyCodeParam } = useParams();
  const gridRef = useRef(null);

  const strategyCode = decodeURIComponent(strategyCodeParam || "");
  const isNew = strategyCode.toLowerCase() === "new";
  const location = useLocation();
  const screenMenuId  = location.state?.menuId ;

  const [activeTab, setActiveTab] = useState(TAB_BASIC);
  const [header, setHeader] = useState(emptyHeader);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [copyFromVersion, setCopyFromVersion] = useState("");
  const [entryCriteria, setEntryCriteria] = useState([]);
  const [exitCriteria, setExitCriteria] = useState([]);
  const [exclusionCriteria, setExclusionCriteria] = useState([]);
  const [holidayOptions, setHolidayOptions] = useState([]);
  const [exclusionOptions, setExclusionOptions] = useState([]);
  const [referenceDateOptions, setReferenceDateOptions] = useState([]);
  const [phaseOptions, setPhaseOptions] = useState([]);
  const [entryDmnContext, setEntryDmnContext] = useState(null);
  const [exitDmnContext, setExitDmnContext] = useState(null);
  const [exclusionDmnContext, setExclusionDmnContext] = useState(null);

  const translateMessage = useCallback(
    (key) =>
      key ? intl.formatMessage({ id: key, defaultMessage: key }) : "",
    [intl],
  );

  const getDateValue = (dateStr) => {
    if (!dateStr) return null;
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed : null;
  };

  const updateHeader = useCallback((field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  }, []);

  const versionOptions = useMemo(() => {
    if (isNew || !header.versionNo || header.versionNo <= 1) return [];
    return Array.from({ length: header.versionNo - 1 }, (_, index) => {
      const versionNo = index + 1;
      return { value: String(versionNo), label: `v${versionNo}` };
    });
  }, [header.versionNo, isNew]);

  const fetchScheduleRows = useCallback(async (seqNo) => {
    const res = await HAxiosService.GET(
      `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/fetchStrategyDetails?inStrategySeqNo=${seqNo}`,
    );
    if (res.data?.status !== "Success") {
      setRowData([]);
      return [];
    }
    const scheduleData = res.data.responseJson || [];
    const sorted = [...scheduleData].sort(
      (a, b) => (a.inSrNo || 0) - (b.inSrNo || 0),
    );
    const mapped = sorted.map(mapScheduleRowFromApi);
    setRowData(mapped);
    return mapped;
  }, []);

  const loadStrategy = useCallback(async () => {
    if (!strategyCode) {
      toast.error(
        intl.formatMessage({
          id: "collection.strategy.code.required",
        }),
      );
      navigate(LIST_PATH, {
        state: {
          menuId: screenMenuId,
        },
      });
      return;
    }

    if (isNew) {
      setHeader(emptyHeader());
      setRowData([]);
      setEntryCriteria([]);
      setExitCriteria([]);
      setExclusionCriteria([]);
      setCopyFromVersion("");
      setChangeReason("");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = `${CollectionStrategiesAPI.StrategyMasterDetails(
        screenMenuId,
      )}?szType=${STRATEGY_TYPE_COLLECTION}`;

      const res = await HAxiosService.GET(url);

      if (res.data.status !== "Success") {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.invalid",
          }),
        );
        return;
      }
      const strategyList = res.data.responseJson?.content ?? [];
      const match = findStrategyInList(strategyList, strategyCode);

      if (!match) {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.invalid",
          }),
        );
        navigate(LIST_PATH, {
          state: {
            menuId: screenMenuId,
          },
        });

        return;
      }
      const mappedHeader = mapHeaderFromApi(match);
      setHeader(mappedHeader);
      setChangeReason(mappedHeader.remarks || "");
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: "collection.fetch.error",
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [strategyCode, isNew, screenMenuId, intl, navigate, toast]);

  const translateKey = (t, key) => {
    if (!key) return key;
      let translated = t(key);

    if (translated === key) {
      const allKeys = Object.keys(intl.messages || {});
      const matchedKey = allKeys.find(k => k.toLowerCase() === key.toLowerCase());
      if (matchedKey) {
        translated = t(matchedKey);
      }
    }
    return translated;
  };

const loadScheduleData = useCallback(async () => {
  console.log("loadScheduleData called", {
    inStrategySeqNo: header.inStrategySeqNo,
    isNew: isNew,
    activeTab: activeTab
  });

  if (!header.inStrategySeqNo) {
    console.log("No strategy seq no found");
    toast.error(
      intl.formatMessage({ id: "collection.strategy.invalid" })
    );
    return;
  }

  try {
    setLoading(true);
    const initialApiUrl = CollectionStrategiesAPI.StrategyDetails(screenMenuId);
    const initialRes = await HAxiosService.GET(initialApiUrl);

    if (initialRes.data?.status === "Success" && initialRes.data?.responseJson) {
      const responseJson = initialRes.data.responseJson;

      if (responseJson.lstHolidayTreatmentOptions) {
        const mappedHolidayOptions = responseJson.lstHolidayTreatmentOptions.map(item => ({
          code: item.code,
          desc: translateKey(translateMessage, item.description) 
        }));
        setHolidayOptions(mappedHolidayOptions);
        console.log("Holiday options set:", mappedHolidayOptions);
      }

      if (responseJson.lstOnExclusionOptions) {
        const mappedExclusionOptions = responseJson.lstOnExclusionOptions.map(item => ({
          code: item.code,
          desc: translateKey(translateMessage, item.description) 
        }));
        setExclusionOptions(mappedExclusionOptions);
        console.log("Exclusion options set:", mappedExclusionOptions);
      }

      if (responseJson.lstReferenceDateOptions) {
        const mappedReferenceDateOptions = responseJson.lstReferenceDateOptions.map(item => ({
          code: item.code,
          desc: translateKey(translateMessage, item.description) 
        }));
        setReferenceDateOptions(mappedReferenceDateOptions);
        console.log("Reference date options set:", mappedReferenceDateOptions);
      }
    
      if (responseJson.lstPhasesOptions) {
        const mappedPhaseOptions = responseJson.lstPhasesOptions.map(item => ({
          code: item.code,
          desc: translateKey(translateMessage, item.description) 
        }));
        setPhaseOptions(mappedPhaseOptions);
        console.log("Phase options set:", mappedPhaseOptions);
      }
    }
    
    const apiUrl = `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/fetchStrategyDetails?inStrategySeqNo=${header.inStrategySeqNo}`;

    const res = await HAxiosService.GET(
      apiUrl
    );

    if (res.data?.status === "Success") {
      const scheduleData = res.data.responseJson || [];
      console.log("Schedule data received:", scheduleData);

      if (scheduleData.length === 0) {
        toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
        setRowData([]);
      } else {
        const sorted = [...scheduleData].sort(
          (a, b) => (a.inSrNo || 0) - (b.inSrNo || 0)
        );
        const mapped = sorted.map(mapScheduleRowFromApi);
        console.log("Mapped rows:", mapped);
        setRowData(mapped);
      }
    } else {
      console.error("API returned error:", res.data);

      if (res.status === 204 || res.data?.status === "Failure") {
        toast.info(intl.formatMessage({ id: "collection.strategy.data" }));
        setRowData([]);
      } else {
        toast.error(
          res.data?.message || 
          intl.formatMessage({ id: "collection.schedule.load.error" })
        );
        setRowData([]);
      }
    }
  } catch (error) {
    console.error("Error loading schedule:", error);
    toast.error(
      intl.formatMessage({ id: "collection.schedule.load.error" })
    );
    setRowData([]);
  } finally {
    setLoading(false);
  }
}, [header.inStrategySeqNo, toast, intl, isNew, activeTab]);

useEffect(() => {
  if (
    activeTab === TAB_SCHEDULE &&
    header.inStrategySeqNo &&
    !isNew &&
    rowData.length === 0
  ) {
    loadScheduleData();
  } else {
    console.log("❌ Conditions NOT met, skipping loadScheduleData");
  }
}, [activeTab, header.inStrategySeqNo, isNew, rowData.length, loadScheduleData]);

  useEffect(() => {
    loadStrategy();
  }, [loadStrategy]);

const columnDefs = useMemo(
  () =>
    getCollectionStrategiesColumnDefs(
      intl,
      holidayOptions,
      exclusionOptions,
      referenceDateOptions,
      phaseOptions,  
      translateMessage,
    ),
  [intl, holidayOptions, exclusionOptions, referenceDateOptions, phaseOptions, translateMessage], 
);

  const visualRows = useMemo(
    () => [...rowData].sort((a, b) => (a.nOnDay || 0) - (b.nOnDay || 0)),
    [rowData],
  );

  const dependencyMatrix = useMemo(
    () => buildDependencyMatrix(rowData),
    [rowData],
  );

  const handleScheduleSave = async ({
    newRows = [],
    updatedRows = [],
    deletedRows = [],
  } = {}) => {
    const seqNo = header.inStrategySeqNo;
    if (!seqNo) {
      toast.error(
        intl.formatMessage({ id: "collection.strategy.invalid" }),
      );
      return { success: false };
    }

    const currentGridRows = gridRef.current?.getCurrentData() || [];
    const deletedGridRowIds = new Set(deletedRows.map((r) => r.gridRowId));
    const deletedActionCodes = new Set(deletedRows.map((r) => r.szActionCode),);
    const remainingRows = currentGridRows.filter(
      (r) =>
        !r._deleted &&
        !deletedGridRowIds.has(r.gridRowId) &&
        !deletedActionCodes.has(r.szActionCode),
    );

    const newIds = new Set(newRows.map((r) => r.gridRowId));
    const updatedIds = new Set(updatedRows.map((r) => r.gridRowId));

    const remainingDtos = remainingRows.map((r, index) => {
      let mode = "B";
      if (newIds.has(r.gridRowId)) mode = "N";
      else if (updatedIds.has(r.gridRowId)) mode = "E";
      return mapScheduleRowToDto(
        { ...r, inSrNo: index + 1 },
        mode,
        index + 1,
      );
    });

    const deletedDtos = deletedRows.map((r) =>
      mapScheduleRowToDto(r, "D"),
    );
    const lstStrategyDetailsMasterDto = [...deletedDtos, ...remainingDtos];

    if (lstStrategyDetailsMasterDto.length === 0) {
      toast.info(intl.formatMessage({ id: "collection.no.changes" }));
      return { success: false };
    }

    const payload = {
      inStrategySeqNo: seqNo,
      lstStrategyDetailsMasterDto,
    };

    try {
      setLoading(true);
      const res = await HAxiosService.POST(
        CollectionStrategiesAPI.StrategyDetails(screenMenuId),
        payload,
      );

      if (res.data?.status === "Success") {
       loadScheduleData();
       fetchScheduleRows();
        toast.success(
          res.data.message ||
            intl.formatMessage({ id: "collection.save.success" }),
        );
        return { success: true };
      }

      if (
        res.data?.responseJson &&
        typeof res.data.responseJson === "object" &&
        !Array.isArray(res.data.responseJson)
      ) {
        handleValidationErrors(intl, toast, res.data.responseJson);
      } else {
        toast.error(
          res.data?.message ||
            intl.formatMessage({ id: "collection.save.failed" }),
        );
      }
     // return { success: false };
    } catch (error) {
      console.error(error);
      toast.error(intl.formatMessage({ id: "collection.save.error" }));
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = () => {
    if (isNew) {
      toast.info(
        intl.formatMessage({
          id: "message.CollectionStrategies.createNotAvailable",
        }),
      );
      return;
    }
    gridRef.current?.submitChanges?.();
  };

  const handleSaveDmn = useCallback(
    async (szCriteria, dmnRequestContext) => {
      if (!dmnRequestContext) {
        toast.error(
          intl.formatMessage({
            id: "collection.strategy.criteria.required",
          }),
        );
        return { success: false };
      }

      const dmnPayload = {
        szScreenName:szCriteria,
        szStrategyCode:strategyCode,
        szType:STRATEGY_TYPE_COLLECTION,
        dmnTableRequestDto: dmnRequestContext,
      };

      try {
        setLoading(true);
        const res = await HAxiosService.POST(
          `${CollectionStrategiesAPI.StrategyDetails(screenMenuId)}/saveCriteria`,
          dmnPayload,
        );

        if (res.data?.status === "Success") {
          toast.success(
            res.data.message ||
              intl.formatMessage({ id: "collection.save.success" }),
          );
          return { success: true };
        }
      } catch (error) {
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [intl, toast],
  );

  const handleSaveEntryCriteria = useCallback(
    () => handleSaveDmn(TAB_ENTRY, entryDmnContext),
    [handleSaveDmn, entryDmnContext],
  );
  const handleSaveExitCriteria = useCallback(
    () => handleSaveDmn(TAB_EXIT, exitDmnContext),
    [handleSaveDmn, exitDmnContext],
  );
  const handleSaveExclusionCriteria = useCallback(
    () => handleSaveDmn(TAB_EXCLUSION, exclusionDmnContext),
    [handleSaveDmn, exclusionDmnContext],
  );

  const handleTopSave = useCallback(() => {
    switch (activeTab) {
      case TAB_SCHEDULE:
        handleSaveAll();
        break;
      case TAB_ENTRY:
        handleSaveEntryCriteria();
        break;
      case TAB_EXIT:
        handleSaveExitCriteria();
        break;
      case TAB_EXCLUSION:
        handleSaveExclusionCriteria();
        break;
      default:
        break;
    }
  }, [ activeTab, handleSaveAll, handleSaveEntryCriteria, handleSaveExitCriteria, handleSaveExclusionCriteria,]);

  const displayCode = isNew ? header.szStrategyCode : strategyCode || header.szStrategyCode;

  const editTitle = isNew ? intl.formatMessage({ id: "label.CollectionStrategies.addTitle" })
    : intl.formatMessage(
        { id: "label.CollectionStrategies.editTitle" },
        { code: displayCode },
      );

  // ── Tab renderers ─────────────────────────────────────────────────────────

  const renderBasicInfo = () => (
    <HBox className="collection-strategies-basic-grid">
      <HBox sx={{ mt: "10px" }}>
        <HLabel
          value={intl.formatMessage({ id: "collection.strategy.code" })}
          required
        />
      </HBox>
      <HBox sx={{ mt: "10px" }}>
        <HTextField
          id="collection-strategy-code"
          value={isNew ? header.szStrategyCode : displayCode}
          editable={isNew}
          onChange={(e) =>
            updateHeader(
              "szStrategyCode",
              String(e.target.value || "").toUpperCase(),
            )
          }
          width="100%"
        />
      </HBox>

      <HBox sx={{ mt: "10px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.description",
          })}
          required
        />
      </HBox>
      <HBox sx={{ mt: "10px" }}>
        <HTextField
          id="collection-strategy-description"
          value={header.szDescription}
          editable={true}
          onChange={(e) => updateHeader("szDescription", e.target.value)}
          width="100%"
        />
      </HBox>

      <HBox sx={{ mt: "6px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.active",
          })}
        />
      </HBox>
      <HBox sx={{ mt: "6px" }}>
        <HCheckBox
          checked={header.cActiveYn}
          disabled={false}
          onChange={(e) => updateHeader("cActiveYn", e.target.checked)}
        />
      </HBox>

      <HBox sx={{ mt: "10px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.versionNo",
          })}
        />
      </HBox>
      <HTextField
        id="collection-strategy-version"
        value={`v${header.versionNo || 1}`}
        editable={false}
        width="120px"
      />

      <HBox sx={{ mt: "15px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.effectiveFrom",
          })}
          required
        />
      </HBox>
      <HBox sx={{ mt: "15px" }}>
        <HDatePicker
          value={getDateValue(header.effectiveFrom)}
          onChange={(newVal) => {
            const formattedDate =
              newVal && newVal.isValid ? newVal.format("YYYY-MM-DD") : "";
            updateHeader("effectiveFrom", formattedDate);
          }}
          align={ALIGNMENT.DATE}
          width="100%"
          required
          disabled={false}
        />
      </HBox>

      <HBox sx={{ mt: "5px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.effectiveTo",
          })}
        />
      </HBox>
      <HBox sx={{ mt: "5px" }}>
        <HTextField
          id="collection-strategy-effective-to"
          value={header.effectiveTo || "—"}
          editable={false}
          width="100%"
        />
      </HBox>

      {!isNew && versionOptions.length > 0 && (
        <>
          <HLabel
            value={intl.formatMessage({
              id: "label.CollectionStrategies.copyFromVersion",
            })}
          />
          <HDropdown
            id="collection-strategy-copy-version"
            value={copyFromVersion}
            onChange={(e) => setCopyFromVersion(e.target.value)}
            options={versionOptions}
            placeholder="label.CollectionStrategies.copyFromVersionPlaceholder"
            width="100%"
          />
        </>
      )}

      <HBox sx={{ mt: "10px" }}>
        <HLabel
          value={intl.formatMessage({
            id: "label.CollectionStrategies.changeReason",
          })}
        />
      </HBox>
      <HBox sx={{ mt: "10px" }}>
        <HBox className="collection-strategies-change-reason-field">
          <HTextarea
            id="collection-strategy-remarks"
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            placeholder="label.CollectionStrategies.changeReasonPlaceholder"
            maxLines={3}
            width="100%"
          />
        </HBox>
      </HBox>
    </HBox>
  );


const handleAddScheduleRow = useCallback(() => {
  const defaults = emptyScheduleRow();
  if (referenceDateOptions.length) {
    defaults.szReferenceDate = referenceDateOptions[0].code;
  }
  if (holidayOptions.length) {
    defaults.szHolidayTreatmentBehavior = holidayOptions[0].code;
  }
  if (exclusionOptions.length) {
    defaults.szOnExclusion = exclusionOptions[0].code;
  }
  
  const newIndex = rowData.length;
  
  // Use flushSync to ensure the state update is processed immediately
  flushSync(() => {
    setRowData((prev) => [...prev, defaults]);
  });

  // Now the grid should have the new row
  setTimeout(() => {
    try {
      const api = gridRef.current?.api;
      if (api) {
        api.startEditingCell({
          rowIndex: newIndex,
          colKey: "szActionCode"
        });
      }
    } catch (err) {
      console.warn("Could not auto-focus new row action cell:", err);
    }
  }, 50);
}, [referenceDateOptions, holidayOptions, exclusionOptions, rowData.length]);

  const renderScheduleTab = () => {
  // Create a wrapper renderer that delegates to the appropriate renderer
  const SearchRendererWrapper = (props) => {
    // Check which column this renderer is being used for
    const colId = props.column?.colId;
    
    if (colId === 'szDependsOn') {
      return <DependsOnSearchRenderer {...props} />;
    }else if (colId === 'szSuccessorOn') {
      return <SuccessorOnSearchRenderer {...props} />;
    }
    
    // Default to ActionCodeSearchRenderer for all other columns
    return <ActionCodeSearchRenderer {...props} />;
  };

  return (
    <HBox className="collection-strategies-schedule-panel">
      <HBox className="collection-strategies-schedule-toolbar">
        <HButton
          label="label.CollectionStrategies.schedule.addRow"
          onClick={handleAddScheduleRow}
          variant="outlined"
          inline
        />
        {rowData.length === 0 && (
          <span className="collection-strategies-schedule-hint">
            {intl.formatMessage({
              id: "label.CollectionStrategies.noSchedule",
            })}
          </span>
        )}
      </HBox>
      <HBox className="collection-strategies-grid-host">
        <HAgGrid
          ref={gridRef}
          key={intl.locale}
          SearchCommonBoxRenderer={SearchRendererWrapper}  
          rowData={rowData}
          setRowData={setRowData}
          columnDefs={columnDefs}
          gridStyle={collectionStrategiesGridStyle}
          paginationgetColDef
          paginationPageSize={10}
          globalSearch={false}
          allowAdd
          allowDelete
          allowUpdate
          onSave={handleScheduleSave}
          getRowId={(params) =>
            String(
              params.data.tempId || params.data.inSrNo || params.data.key,
            )
          }
          suppressHorizontalScroll={false}
          alwaysShowHorizontalScroll
        />
        <HButtonBar
          onSave={() => gridRef.current?.submitChanges?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
        />
      </HBox>
    </HBox>
  );
};

  const renderEntryCriteriaTab = () => (
    <HBox className="collection-strategies-criteria-panel">
      <FilterMaster
        ruleName={
          header?.szStrategyCode
            ? `Col_Str_Ent_${header.szStrategyCode}`: "CollectionStrategiesEntry"
        }
        moduleName="COL"
        entityCode="ACNT"
        filterTitle="Entry Criteria"
        filterSavedDescription="Collection Strategy Entry Filter"
        isPopedUp={false}
        IsRuleEngBased={true}
        ruleEngineDmnContext={(dmnContext) => {
          setEntryDmnContext(dmnContext);
        }}
      />
    </HBox>
  );
  const renderExitCriteriaTab = () => (
    <HBox className="collection-strategies-criteria-panel">
      <FilterMaster
        ruleName={
          header?.szStrategyCode 
            ? `Col_Str_Exit_${header.szStrategyCode}` : "CollectionStrategiesExit_"
        }
        moduleName="COL"
        entityCode="ACNT"
        filterTitle="Exit Criteria"
        filterSavedDescription="Collection Strategy Exit Filter"
        isPopedUp={false}
        IsRuleEngBased={true}
        ruleEngineDmnContext={(dmnContext) => {
          setExitDmnContext(dmnContext);
        }}
      />
    </HBox>
  );
  const renderExclusionCriteriaTab = () => (
    <HBox className="collection-strategies-criteria-panel">
      <FilterMaster
        ruleName={
          header?.szStrategyCode
            ? `Col_Str_Excl_${header.szStrategyCode}` : "CollectionStrategiesExclusion_"
        }
        moduleName="COL"
        entityCode="ACNT"
        filterTitle="Exclusion Criteria"
        filterSavedDescription="Collection Strategy Exclusion Filter"
        isPopedUp={false}
        IsRuleEngBased={true}
        ruleEngineDmnContext={(dmnContext) => {
          setExclusionDmnContext(dmnContext);
        }}
      />
    </HBox>
  );

  const renderVisualSchedule = () => {
    if (!visualRows.length) {
      return (
        <div className="collection-strategies-empty">
          {intl.formatMessage({
            id: "label.CollectionStrategies.noSchedule",
          })}
        </div>
      );
    }
    return (
      <div className="collection-strategies-visual-list">
        {visualRows.map((row) => (
          <div
            key={row.key}
            className="collection-strategies-visual-row"
          >
            <span className="collection-strategies-visual-day">
              {intl.formatMessage(
                { id: "label.CollectionStrategies.dayLabel" },
                { day: row.nOnDay ?? 0 },
              )}
            </span>
            <span className="collection-strategies-visual-action">
              {row.szActionCode}
            </span>
            <span className="collection-strategies-visual-meta">
              {row.szPhase ? `${row.szPhase} · ` : ""}
              {row.szReferenceDate || ""}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderDependencies = () => {
    const { actions } = dependencyMatrix;
    if (actions.length < 2) {
      return (
        <div className="collection-strategies-empty">
          {intl.formatMessage({
            id: "label.CollectionStrategies.depsMinActions",
          })}
        </div>
      );
    }
    return (
      <table className="collection-strategies-deps-table">
        <thead>
          <tr>
            <th>
              {intl.formatMessage({
                id: "label.CollectionStrategies.depsAction",
              })}
            </th>
            <th>
              {intl.formatMessage({ id: "collection.grid.dependsOn" })}
            </th>
            <th>
              {intl.formatMessage({ id: "collection.grid.successors" })}
            </th>
          </tr>
        </thead>
        <tbody>
          {actions.map((action) => {
            const row = rowData.find((r) => r.szActionCode === action);
            return (
              <tr key={action}>
                <td>{action}</td>
                <td>
                  {parseActionList(row?.szDependsOn).join(", ") || "—"}
                </td>
                <td>
                  {parseActionList(row?.szSuccessors).join(", ") || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const handleSaveBasicInfo = async () => {
    if (!header.szStrategyCode) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.strategyCode.required",
        }),
      );
      return;
    }
    if (!header.szDescription) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.description.required",
        }),
      );
      return;
    }
    if (!header.effectiveFrom) {
      toast.error(
        intl.formatMessage({
          id: "label.CollectionStrategies.effectiveFrom.required",
        }),
      );
      return;
    }

    try {
      setLoading(true);

      const payload = mapHeaderToDto({
        ...header,
        remarks: changeReason || header.remarks || "",
      });
      payload.szType = STRATEGY_TYPE_COLLECTION;

      const res = isNew
        ? await HAxiosService.POST(
            CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId),
            payload,
          )
        : await HAxiosService.PUT(
            CollectionStrategiesAPI.StrategyMasterDetails(screenMenuId),
            payload,
          );

      if (res.data?.status === "Success") {
        toast.success(
          res.data.message ||
            intl.formatMessage({
              id: isNew
                ? "collection.save.success"
                : "collection.update.success",
            }),
        );

        if (isNew && res.data?.responseJson?.szStrategyCode) {
          const newCode = res.data.responseJson.szStrategyCode;

          navigate(
            `/homelayout/collectionStrategies/${encodeURIComponent(newCode)}`,
            {
              state: {
                menuId: screenMenuId,
              },
            },
          );
        } else {
          await loadStrategy();
        }

        return { success: true };
      }

      if (res.data?.responseJson) {
        if (
          typeof res.data.responseJson === "object" &&
          !Array.isArray(res.data.responseJson)
        ) {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(
            res.data.message ||
              intl.formatMessage({
                id: isNew
                  ? "collection.save.failed"
                  : "collection.update.failed",
              }),
          );
        }
      } else {
        toast.error(
          res.data?.message ||
            intl.formatMessage({
              id: isNew ? "collection.save.failed" : "collection.update.failed",
            }),
        );
      }
      return { success: false };
    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: isNew ? "collection.save.error" : "collection.update.error",
        }),
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <HBox className="collection-strategies-page">
      <HBox className="collection-strategies-header-card">
        <HBreadCrumb />
        <HBox className="collection-strategies-edit-title-row">
          <HButton
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(LIST_PATH, {
              state: {
                menuId: screenMenuId,
              },
            })}
          />
          <HBox className="collection-strategies-edit-title-group">
            <TitleBar title={editTitle} />
            {!isNew && (
              <span className="collection-strategies-version-badge">
                v{header.versionNo || 1}
              </span>
            )}
          </HBox>
          {activeTab !== TAB_BASIC && (
            <HButton
              label="common.buttonBar.save"
              onClick={handleTopSave}
              variant="contained"
              color="primary"
              inline
            />
          )}
        </HBox>
      </HBox>

      <HBox className="collection-strategies-tabs-host">
        <HTabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.basic",
            })}
            value={TAB_BASIC}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.schedule",
            })}
            value={TAB_SCHEDULE}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.visual",
            })}
            value={TAB_VISUAL}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.entry",
            })}
            value={TAB_ENTRY}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.exit",
            })}
            value={TAB_EXIT}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.exclusion",
            })}
            value={TAB_EXCLUSION}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.rules",
            })}
            value={TAB_RULES}
          />
          <HTab
            label={intl.formatMessage({
              id: "label.CollectionStrategies.tab.dependencies",
            })}
            value={TAB_DEPS}
          />
        </HTabs>
      </HBox>

      <HBox className="collection-strategies-tab-panel">
        {loading || dropdownLoading ? (
          <div className="collection-strategies-empty">
            {intl.formatMessage({ id: "collection.button.loading" })}
          </div>
        ) : (
          <>
            {activeTab === TAB_BASIC && renderBasicInfo()}
            {activeTab === TAB_SCHEDULE && renderScheduleTab()}
            {activeTab === TAB_VISUAL && renderVisualSchedule()}
            {activeTab === TAB_ENTRY && renderEntryCriteriaTab()}
            {activeTab === TAB_EXIT && renderExitCriteriaTab()}
            {activeTab === TAB_EXCLUSION && renderExclusionCriteriaTab()}
            {activeTab === TAB_RULES && (
              <p className="collection-strategies-rules-note">
                {intl.formatMessage({
                  id: "label.CollectionStrategies.rulesNote",
                })}
              </p>
            )}
            {activeTab === TAB_DEPS && renderDependencies()}
          </>
        )}
      </HBox>

      {activeTab === TAB_BASIC && (
        <HButtonBar
          onSave={handleSaveBasicInfo}
          onClose={() => navigate(LIST_PATH, {
            state: {
              menuId: screenMenuId,
            },
          })}
          disableToast={{ save: true, close: true }}
        />
      )}
    </HBox>
  );
};

export default CollectionStrategyEditScreen;
