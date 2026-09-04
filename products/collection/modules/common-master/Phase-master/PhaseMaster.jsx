
import React, {useCallback,useEffect,useMemo,useRef,useState,} from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { HBox, HButtonBar, TitleBar, HLabel, HBreadCrumb, HAgGrid, HAxiosService, useToast } from "@helix/component-library";
import {PhasesAPI} from "../../common-master/apiEndpoints"
import { buildPhaseMasterColumnDefs } from "./phaseMasterGridConfig"
import "./phaseMaster.css"
import { useLocation } from "react-router-dom";




const DESCRIPTION_KEY_PREFIX = "label.PhaseMaster.phase.";


function resolveDescription(intl, rawValue) {
  if (!rawValue) return { display: "", isI18nKey: false };

  const trimmed = rawValue.trim();
  const looksLikeKey = /^\S+\./.test(trimmed);

  if (!looksLikeKey) {
    return { display: trimmed, isI18nKey: false };
  }

  try {
    const translated = intl.formatMessage(
      { id: trimmed, defaultMessage: "__MISS__" },
    );

    if (translated !== "__MISS__") {
      return { display: translated, isI18nKey: true };
    }
  } catch {
  }

  let extracted;

  if (trimmed.startsWith(DESCRIPTION_KEY_PREFIX)) {
    extracted = trimmed.slice(DESCRIPTION_KEY_PREFIX.length).trim();
  } else {
    const lastDot = trimmed.lastIndexOf(".");
    extracted = lastDot !== -1 ? trimmed.slice(lastDot + 1).trim() : trimmed;
  }

  return { display: extracted || trimmed, isI18nKey: false };
}

function normalizeRows(intl, payload) {
  const raw = Array.isArray(payload)
    ? payload
    : (payload?.responseJson ?? payload?.data ?? []);

  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const rawDesc = (item.szDescription ?? "").trim();
    const { display, isI18nKey } = resolveDescription(intl, rawDesc);

    return {
      ...item,
      szCondition:         (item.szCondition ?? "").trim(),
      szDescription:       display,       
      _rawDescription:     rawDesc,      
      _isPlainDescription: !isI18nKey,    
      key: (item.szCondition ?? "").trim() || `row-${index}`,
      mode: "E",
    };
  });
}

function findDuplicateCodes(rows) {
  const seen = new Set();
  const dupes = new Set();
  rows.forEach((r) => {
    const code = (r.szCondition ?? "").trim().toLowerCase();
    if (code) {
      if (seen.has(code)) dupes.add(r.szCondition.trim());
      else seen.add(code);
    }
  });
  return [...dupes];
}

function Phases() {
    const intl = useIntl();
    const toast = useToast();
    const navigate = useNavigate();
    const gridRef = useRef(null);
  
    const [rowData, setRowData]                 = useState([]);
    const [originalRowData, setOriginalRowData] = useState([]);
    const [loading, setLoading]                 = useState(false);
    const [isFetched, setIsFetched]             = useState(false);
    const location = useLocation();
    const ScreenMenuId =  location.state.menuId;

    const formatMessage = useCallback(
      (opts) => intl.formatMessage(opts),
      [intl],
    );
    
    const columnDefs = useMemo(
      () => buildPhaseMasterColumnDefs(formatMessage),
      [formatMessage],
    );
        
    const handleFetch = useCallback(async () => {
      try {
        setLoading(true);
        const res  = await HAxiosService.GET(PhasesAPI.Phases(ScreenMenuId));
        const body = res?.data ?? {};
        const rows = normalizeRows(intl, body); 
        setRowData(rows);
        setOriginalRowData(rows);
        setIsFetched(true); 
        if (rows.length === 0) {
          toast.info(
            intl.formatMessage({
              id: "label.PhaseMaster.noData",
              defaultMessage: "No Phases Found.",
            }),
          );
        }
      } catch {
        setIsFetched(false);
        setRowData([]);
        setOriginalRowData([]);
        toast.error(
          intl.formatMessage({
            id: "label.PhaseMaster.fetchError",
            defaultMessage: "Error while fetching Phases.",
          }),
        );
      } finally {
        setLoading(false);
      }
    }, [intl, toast]);
    
    useEffect(() => {
       handleFetch(); 
    }, [handleFetch]);


    const handleCellEdit = useCallback((params) => {
      const { data, colDef, newValue, oldValue } = params;
      if (newValue === oldValue) return;

      setRowData((prev) =>
        prev.map((row) => {
          if (row.key !== data.key) return row;

          const updated = {
            ...row,
            [colDef.field]: newValue,
            mode: row.mode !== "N" ? "E" : row.mode,
          };

          if (colDef.field === "szDescription") {
            updated._rawDescription     = newValue;
            updated._isPlainDescription = true;
          }

          return updated;
        }),
      );
    }, []);

    const handleAddRow = useCallback(
      (newRow) => ({
        ...newRow,
        key:                 newRow.key || `new-${Date.now()}-${Math.random()}`,
        szCondition:         newRow.szCondition  ?? "",
        szDescription:       newRow.szDescription ?? "",
        _rawDescription:     newRow.szDescription ?? "",
        _isPlainDescription: true,
        mode: "N",
      }),
      [],
    );

    const toBackendRow = useCallback((row) => {
      const descriptionToSend =
        row.mode === "N" || row._isPlainDescription
          ? (row.szDescription  ?? "").trim()     
          : (row._rawDescription ?? row.szDescription ?? "").trim(); 

      return {
        szCondition:   (row.szCondition ?? "").trim(),
        szDescription: descriptionToSend,
        szMode:        row.mode,
      };
    }, []);


    const handleSave = useCallback(
      async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {
        const hasChanges = [...newRows, ...updatedRows, ...deletedRows].length > 0;

        if (!hasChanges) {
          toast.info(
            intl.formatMessage({
              id: "info.no.changes.save",
              defaultMessage: "No changes to save.",
            }),
          );
          return;
        }

        const allActiveRows = [...rowData, ...newRows].filter(
          (r) => !deletedRows.some((d) => d.key === r.key),
        );
        const duplicates = findDuplicateCodes(allActiveRows);
        if (duplicates.length > 0) {
          toast.error(
            intl.formatMessage(
              {
                id: "label.PhaseMaster.duplicateCode",
                defaultMessage: "Duplicate Phase code: {code}",
              },
              { code: duplicates.join(", ") },
            ),
          );
          return { success: false };
        }

        try {
          setLoading(true);

          const payload = [
            ...newRows.map(toBackendRow),
            ...updatedRows.map(toBackendRow),
            ...deletedRows.map(toBackendRow),
          ];

          const res  = await HAxiosService.POST(PhasesAPI.Phases(ScreenMenuId), payload);
          const body = res?.data ?? {};

          if (body.status === "Success") {
            await handleFetch();
            return { success: true };
          }

          if (body.message?.toLowerCase() === "validation failed") {
            handleValidationErrors(intl, toast, body.errors);
            return { success: false };
          }
          return { success: false };
        } catch (e) {
          toast.error(
            intl.formatMessage({id: "label.PhaseMaster.saveError",
              defaultMessage: "Error while saving Phase.",
            }),
          );
          return { success: false };
        } finally {
          setLoading(false);
        }
      },
      [handleFetch, intl, rowData, toast, toBackendRow],
    );

    const handleReset = useCallback(() => {
      setRowData([...originalRowData]);
      return { success: true };
    }, [originalRowData]);



    return (
      <>

        <HBox className="phase-master-header-card">
          <HBreadCrumb/>

          <TitleBar title="label.PhaseMaster.title" />

          <HLabel
            value={intl.formatMessage({
              id: "label.PhaseMaster.titleDesc",
              defaultMessage:
                "Define the phases of an account life-cycle, stamped on accounts via collection strategy.",
            })}
            align="left"
            colon={false}
          />
        </HBox>
        
        <HBox className="phase-master-grid-section">
          <HAgGrid
            ref={gridRef}
            key={intl.locale}
            rowData={rowData}
            columnDefs={columnDefs}
            gridClassName="drs-phase-master-grid"
            gridStyle={{ width: "100%", height: "55vh", minHeight: "360px" }}
            embeddedInSection
            pagination
            paginationPageSize={10}
            globalSearch={false}
            allowAdd
            allowDelete
            allowUpdate
            onSave={handleSave}
            onAddRow={handleAddRow}
            onCellValueChanged={handleCellEdit}
            getRowId={(params) => params.data.key}
            isLoading={loading}
            hideInternalSaveButton
          />

          <HButtonBar
            onSave={() => gridRef.current?.submitChanges?.()}
            onReset={handleReset}
            onClose={() => navigate("/homelayout/welcomepage")}
          />
        </HBox>
        
      </>
    )
}

export default Phases
