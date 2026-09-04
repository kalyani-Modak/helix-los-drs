import React, { useState, useCallback, useRef, useMemo } from "react";
import {Typography, Chip, IconButton,CircularProgress, Alert, Stack,} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useIntl } from "react-intl";
import { HAxiosService, HBox, SearchCommonBox, HBreadCrumb, TitleBar, HPaper, HButtonBar, HAgGrid, useToast } from "@helix/component-library";


import { SEARCH_API_ENDPOINTS } from "../../../../shared/config/apiConstants.jsx";
import { ConfigurationAPI } from "./apiEndpoints";


const gridConditionTypeDefObj = [
  { gridMappingName: "szCondition", gridHeaderDesc: "Condition", gridHeaderId: "label.search.condition", gridColumnWidth: 180 },
  { gridMappingName: "szDesc", gridHeaderDesc: "Condition Desc", gridHeaderId: "label.search.conditiontype.description", gridColumnWidth: 200 },
  { gridMappingName: "szParentGroup", gridHeaderDesc: "Parent Group", gridHeaderId: "label.search.conditiontype.parentgroup", gridColumnWidth: 220 },
  { gridMappingName: "cAllowUpdate", gridHeaderDesc: "Allow Update", gridHeaderId: "label.search.conditiontype.allowupdate", gridColumnWidth: 150, gridColumnHeight: 20, hidden: true },
];

export default function SystemParametersPage() {
  const intl     = useIntl();
  const muiTheme = useTheme();
  const toast    = useToast();
  const gridRef  = useRef(null);

  const [selectedType, setSelectedType] = useState(null);
  const [paramValues,  setParamValues]  = useState([]);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState(null);
  const [searchValue,  setSearchValue]  = useState("");
  const [allowUpdate,  setAllowUpdate]  = useState(false);

  const selectedTypeRef = useRef(null);
  const allowUpdateRef  = useRef(false);

  // ── i18n helper ──────────────────────────────────────────────────────────
  const resolveLabel = useCallback((key) => {
    if (!key) return "—";
    try { return intl.formatMessage({ id: key, defaultMessage: key }); }
    catch { return key; }
  }, [intl]);

  // ── Column defs — Code locked for EXISTING rows, editable for NEW rows ───
  const columnDefs = useMemo(() => {
    const editable = allowUpdate;

    return [
      {
        field: "szCondition",
        headerName: intl.formatMessage({ id: "label.code", defaultMessage: "Code" }),
        width: 140,
        cellStyle: { fontWeight: 600 },
        suppressSizeToFit: true,
        editable: (params) => {
          if (!editable) return false;
          const isExistingRow = Boolean(params.data?.szCondition?.trim());
          return !isExistingRow;
        },
        cellClassRules: {
          "drs-locked-cell": (params) =>
            editable && Boolean(params.data?.szCondition?.trim()),
        },
      },
      {
        field: "szDescription",
        headerName: intl.formatMessage({ id: "label.description", defaultMessage: "Description" }),
        flex: 1,
        editable,
        valueGetter: (params) =>
          editable
            ? (params.data?.szDescription ?? "")
            : resolveLabel(params.data?.szi18nDesc),
      },
    ];
  }, [intl, resolveLabel, allowUpdate]);

  // ── Refresh grid data ────────────────────────────────────────────────────
  const refreshGridData = useCallback(async (code, rowMeta) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await HAxiosService.GET(
        `${ConfigurationAPI.fetchSystemParamValues()}?conditionType=${code}`
      );
      const data      = response.data;
      const isSuccess = String(data?.status ?? "").toLowerCase() === "success";
      if (isSuccess) {
        const rows = (data.responseJson ?? []).map((item) => ({
          ...item,
          szDescription: item.szDescription || item.szi18nDesc || "",
          szConditionType: code,
          cAllowUpdate:    rowMeta?.cAllowUpdate ?? (allowUpdateRef.current ? "Y" : "N"),
        }));
        setParamValues(rows);
      } else {
        setError(data?.message || "Failed to load parameter values.");
      }
    } catch (err) {
      console.error("fetchSystemParamValues error:", err);
      setError("Error fetching parameter values.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── SearchCommonBox row click ─────────────────────────────────────────────
  const handleConditionTypeSelect = useCallback(async (conditionTypeCode, row) => {
    if (!conditionTypeCode) return;

    const isAllowUpdate = String(row?.cAllowUpdate ?? "N").toUpperCase() === "Y";

    const meta = {
      code:        conditionTypeCode,
      desc:        row?.szConditionTypeDesc ?? conditionTypeCode,
      tab:         row?.szParentGroup       ?? "System Tab",
      allowUpdate: isAllowUpdate,
      cAllowUpdate: row?.cAllowUpdate ?? "N",
    };

    setSelectedType(meta);
    setAllowUpdate(isAllowUpdate);
    selectedTypeRef.current = meta;
    allowUpdateRef.current  = isAllowUpdate;

    setParamValues([]);
    setError(null);

    await refreshGridData(conditionTypeCode, row);
  }, [refreshGridData]);

  // ── HAgGrid onSave callback — aligned with ReasonMasterScreen.handleSave() ──
  // HAgGrid tags every changed row with `.mode`:
  //   "N" = new row added via "+"
  //   "E" = existing row edited
  //   "D" = existing row marked for deletion
  // We trust row.mode directly instead of re-deriving it per bucket.
  const handleSave = useCallback(async ({ newRows = [], updatedRows = [], deletedRows = [] }) => {

    const conditionType = selectedTypeRef.current?.code;
    if (!conditionType) return { success: false };

    if (!allowUpdateRef.current) {
      toast.warning(intl.formatMessage({
        id: "label.systemparams.readonly",
        defaultMessage: "This parameter type is read-only.",
      }));
      return { success: false };
    }

    // ── Single combined map — handleSave() ──
    const payload = [...newRows, ...updatedRows, ...deletedRows].map((row) => ({
      szConditionType:   conditionType,
      szCondition:       (row.szCondition   || "").trim(),
      szDescription:     (row.szDescription || "").trim(),
      szi18nDescription: row.szi18nDesc ?? "",
      cAllowUpdate:      selectedTypeRef.current?.cAllowUpdate ?? "N",
      szMode:            row.mode,   
    }));

    if (payload.length === 0) {
      toast.info(intl.formatMessage({
        id: "label.systemparams.noChanges",
        defaultMessage: "No changes to save.",
      }));
      return { success: false };
    }

    try {
      setIsLoading(true);
      const response = await HAxiosService.POST(
        ConfigurationAPI.saveSystemParamValues(),
        payload
      );

      const data      = response.data;
      const isSuccess = String(data?.status ?? "").toLowerCase() === "success";

      if (isSuccess) {
        toast.success(intl.formatMessage({
          id: "label.systemparams.saveSuccess",
          defaultMessage: "Parameters saved successfully.",
        }));
        await refreshGridData(conditionType, {
          cAllowUpdate: selectedTypeRef.current?.cAllowUpdate ?? "N",
        });
        return { success: true };
      } else {
        const msg = data?.message || "Failed to save parameters.";
        toast.error(msg);
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      console.error("saveSystemParamValues error:", err);
      const msg = err.response?.data?.message || "Error saving parameter values.";
      toast.error(msg);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  }, [intl, toast, refreshGridData]);

  const handleButtonBarSave = useCallback(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.stopEditing();
    }
    if (typeof gridRef.current?.save === "function") {
      gridRef.current.save();
    } else if (typeof gridRef.current?.submitChanges === "function") {
      gridRef.current.submitChanges();
    }
  }, []);

  const handleReset = useCallback(async () => {
    if (selectedTypeRef.current) {
      await refreshGridData(selectedTypeRef.current.code, {
        cAllowUpdate: selectedTypeRef.current.cAllowUpdate,
      });
    }
    return { success: true };
  }, [refreshGridData]);

  const handleClose = () => {
    setSelectedType(null);
    setParamValues([]);
    setAllowUpdate(false);
    setError(null);
    setSearchValue("");
    selectedTypeRef.current = null;
    allowUpdateRef.current  = false;
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const panelBorder = `1px solid ${alpha(muiTheme.palette.divider, 1)}`;

  const tabChipSx = {
    height: 22, fontSize: 11, fontWeight: 500, borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.primary.main, 0.08),
    color: muiTheme.palette.primary.main,
    border: `1px solid ${alpha(muiTheme.palette.primary.main, 0.2)}`,
    "& .MuiChip-label": { px: 1 },
  };

  const readonlyChipSx = {
    height: 22, fontSize: 11, fontWeight: 500, borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.warning.main, 0.08),
    color: muiTheme.palette.warning.dark,
    border: `1px solid ${alpha(muiTheme.palette.warning.main, 0.25)}`,
    "& .MuiChip-label": { px: 1 },
  };

  const editableChipSx = {
    height: 22, fontSize: 11, fontWeight: 500, borderRadius: "6px",
    bgcolor: alpha(muiTheme.palette.success.main, 0.08),
    color: muiTheme.palette.success.dark,
    border: `1px solid ${alpha(muiTheme.palette.success.main, 0.25)}`,
    "& .MuiChip-label": { px: 1 },
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <HBox styles={{ display: "flex", flexDirection: "column", width: "100%", padding: "16px 24px", gap: "16px" }}>

      <HBox styles={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
        <HBox className="portfolio-master-breadcrumb-text">
          <HBreadCrumb />
        </HBox>

        <TitleBar title={intl.formatMessage({ id: "label.systemparameters.title", defaultMessage: "System Parameters" })} />

        <Typography variant="body1" sx={{ color: "text.secondary", fontSize: 14, mb: 0.5 }}>
          {intl.formatMessage({
            id: "label.systemparameters.description",
            defaultMessage: "Configure system parameters and their values",
          })}
        </Typography>
      </HBox>

      <HBox styles={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: 1 }}>
        <HBox sx={{ width: "100%", maxWidth: 500 }}>
          <SearchCommonBox
            apiEndpoint={SEARCH_API_ENDPOINTS.COMMON_MASTER()}
            searchCode="CONDITIONTYPE"
            setSelectedValue={handleConditionTypeSelect}
            selectedValue={searchValue}
            selectedColumn="szCondition"
            gridDefObj={gridConditionTypeDefObj}
            gridWidth={400}
            gridHeight={320}
            gridNoOfRowsPerPage={3}
            searchBoxWidth="100%"
            searchBoxHeight={40}
            searchBoxFontSize={13}
            placeholder={intl.formatMessage({
              id: "label.systemparams.searchPlaceholder",
              defaultMessage: "Find a parameter by name, group, or description...",
            })}
          />
        </HBox>
      </HBox>

      {selectedType && (
        <HPaper elevation={0} sx={{ width: "100%", border: panelBorder, borderRadius: 2, overflow: "hidden" }}>

          <HBox sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 3, py: 2, borderBottom: panelBorder,
            bgcolor: alpha(muiTheme.palette.primary.main, 0.02),
          }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary" }}>
                {selectedType.code}
              </Typography>
              <Chip label={selectedType.tab} size="small" sx={tabChipSx} />
              {allowUpdate ? (
                <Chip
                  icon={<EditIcon sx={{ fontSize: "13px !important" }} />}
                  label={intl.formatMessage({ id: "label.editable", defaultMessage: "Editable" })}
                  size="small"
                  sx={editableChipSx}
                />
              ) : (
                <Chip
                  icon={<LockOutlinedIcon sx={{ fontSize: "13px !important" }} />}
                  label={intl.formatMessage({ id: "label.readonly", defaultMessage: "Read-only" })}
                  size="small"
                  sx={readonlyChipSx}
                />
              )}
            </Stack>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </HBox>

          {!isLoading && !error && (
            <HBox sx={{ px: 3, py: 1, borderBottom: panelBorder }}>
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                {paramValues.length}{" "}
                {intl.formatMessage({ id: "label.records", defaultMessage: paramValues.length !== 1 ? "records" : "record" })}
              </Typography>
            </HBox>
          )}

          {isLoading && (
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 4 }}>
              <CircularProgress size={20} />
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {intl.formatMessage({ id: "label.loading", defaultMessage: "Loading..." })}
              </Typography>
            </HBox>
          )}

          {error && !isLoading && (
            <HBox sx={{ px: 3, py: 2 }}>
              <Alert severity="error" sx={{ fontSize: 13 }}>{error}</Alert>
            </HBox>
          )}

          {!isLoading && !error && (
  <HBox sx={{ height: "35vh", minHeight: "260px", width: "100%" }}>
    <HAgGrid
      ref={gridRef}
      key={`${selectedType.code}-${intl.locale}-${allowUpdate}`}
      rowData={paramValues}
      columnDefs={columnDefs}
      gridStyle={{ width: "100%", height: "100%" }}
      gridClassName="drs-list-grid"
      embeddedInSection
      pagination
      paginationPageSize={5}
      globalSearch={false}
      isLoading={isLoading}
      getRowId={(params) => params.data.szCondition ?? String(Math.random())}
      suppressRowClickSelection
      allowAdd={allowUpdate}
      allowDelete={allowUpdate}
      allowUpdate={allowUpdate}
      addCheckBoxes={allowUpdate}
      rowSelection={allowUpdate ? "multiple" : "single"}
      onSave={handleSave}
      hideInternalSaveButton={allowUpdate}
    />
  </HBox>
)}

          {!isLoading && !error && paramValues.length === 0 && (
            <HBox sx={{ px: 3, py: 6, textAlign: "center" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {intl.formatMessage({ id: "label.systemparams.empty", defaultMessage: "No values found for this parameter type." })}
              </Typography>
            </HBox>
          )}
        </HPaper>
      )}

      {selectedType && allowUpdate && (
        <HButtonBar
          onSave={handleButtonBarSave}
          onReset={handleReset}
          disableToast={{ reset: true }}
        />
      )}
    </HBox>
  );
}
