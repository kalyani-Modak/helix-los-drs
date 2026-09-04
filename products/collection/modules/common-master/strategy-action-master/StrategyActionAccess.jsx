import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import { HAgGrid, HBox, HButton, HAxiosService, useToast, readCache, writeCache } from "@helix/component-library";
import { StrategyActionMasterAPI } from "../apiEndpoints";


const ACCESS_SELECTION_CACHE_KEY = "strategyActionAccessCache";

const normalizeValue = (value) => String(value ?? "").trim().toUpperCase();
const ALLOWED_AUDIENCE_ROLE_KEYS = new Set([
  "EARLY-COLLECTIONS"
]);

const getSingleActionCode = (value) => {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }
  return String(value ?? "")
    .split(/[.,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)[0] || "";
};

const pickFirstArray = (source, keys) => {
  if (!source || typeof source !== "object") return [];
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key];
  }
  return [];
};

const getAccessList = (data) => {
  if (Array.isArray(data)) return data;
  const responseJson = data?.responseJson;
  if (Array.isArray(responseJson?.lstStrategyActionAccess)) {
    return responseJson.lstStrategyActionAccess;
  }
  if (Array.isArray(responseJson)) return responseJson;
  return pickFirstArray(responseJson || data, [
    "accessList",
    "strategyActionAccessList",
    "lstStrategyActionAccess",
    "data",
  ]);
};

const getRolesFromToken = () => {
  const token = sessionStorage.getItem("SEC_TOKEN");
  let payload = null;
  try {
    payload = token ? jwtDecode(token) : null;
  } catch {
    payload = null;
  }
  if (!payload || typeof payload !== "object") return [];

  const audList = Array.isArray(payload?.aud)
    ? payload.aud
    : payload?.aud
      ? [payload.aud]
      : [];
  const allowedAudienceKeys = new Set(
    audList
      .map((aud) => String(aud || "").trim())
      .filter((aud) => ALLOWED_AUDIENCE_ROLE_KEYS.has(aud)),
  );

  const roleSet = new Set();
  const pushRoles = (roles) => {
    if (!Array.isArray(roles)) return;
    roles.forEach((role) => {
      const code = String(role || "").trim();
      if (code) roleSet.add(code);
    });
  };

  if (payload?.resource_access && typeof payload.resource_access === "object") {
    allowedAudienceKeys.forEach((clientKey) => {
      pushRoles(payload.resource_access?.[clientKey]?.roles);
    });
  }

  return Array.from(roleSet).map((role) => ({
    name: role,
    description: "",
  }));
};

const StrategyActionAccess = forwardRef(({
  actionCode,
  onClose,
}, ref) => {
  const intl = useIntl();
  const location = useLocation();
  const screenMenuId = location?.state?.menuId;
  const toast = useToast();
  const gridRef = useRef(null);
  const inFlightRef = useRef(false);

  const [rowData, setRowData] = useState([]);
  const [previousSavedCodes, setPreviousSavedCodes] = useState(new Set());
  const [loadingData, setLoadingData] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [accessMappings, setAccessMappings] = useState([]);
  const [hasLoadedMappings, setHasLoadedMappings] = useState(false);

  const columnDefs = [
    {
      headerName: "",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
    },
    {
      headerName: intl.formatMessage({
        id: "label.StrategyActionAccess.profileCode",
        defaultMessage: "Profile Code",
      }),
      field: "profileCode",
      flex: 1,
      editable: false,
      filter: false,
    },
  ];

  const buildSavedCodesForAction = useCallback((selectedActionCode, mappings) => {
    const normalizedActionCode = normalizeValue(selectedActionCode);
    return new Set(
      (Array.isArray(mappings) ? mappings : [])
        .filter(
          (item) => normalizeValue(item?.szActionCode) === normalizedActionCode,
        )
        .map((item) => normalizeValue(item?.szGroupId))
        .filter(Boolean),
    );
  }, []);

  const getCachedSelectedProfileCodes = useCallback((selectedActionCode) => {
    const cacheData = readCache(ACCESS_SELECTION_CACHE_KEY);
    console.log("Cached access selection data:", cacheData);
    const actionKey = normalizeValue(selectedActionCode);
    const selectedRows =
      cacheData && typeof cacheData === "object" ? cacheData[actionKey] : undefined;

    if (!Array.isArray(selectedRows)) {
      return null;
    }

    const selectedCodes = selectedRows
      .map((row) => String(row?.profileCode || row?.szGroupId || "").trim())
      .filter(Boolean);

    return selectedCodes;
  }, []);

  const applySelectionForAction = useCallback((selectedActionCode, roles, mappings, cachedProfileCodes) => {
    const hasCachedSelection = Array.isArray(cachedProfileCodes);
    const savedCodes = hasCachedSelection
      ? new Set(
        cachedProfileCodes
          .map((code) => normalizeValue(code))
          .filter(Boolean),
      )
      : buildSavedCodesForAction(selectedActionCode, mappings);
    const mappedData = (Array.isArray(roles) ? roles : []).map((role) => {
      const profileCode = String(
        role.name || role.profileCode || role.szGroupId || "",
      ).trim();
      return {
        profileCode,
        availableTo: role.description || role.availableTo || "",
        isChecked: savedCodes.has(normalizeValue(profileCode)),
      };
    });

    setRowData(mappedData);
    setPreviousSavedCodes(savedCodes);
  }, [buildSavedCodesForAction]);

  const loadAccessData = useCallback(async (force = false) => {
    if (!force && hasLoadedMappings) return;
    if (inFlightRef.current) return;

    try {
      inFlightRef.current = true;
      setLoadingData(true);
      const response = await HAxiosService.GET(
        StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, 'fetchStrategyActionAccess'),
      );

      const data = response?.data;
      const accessList = getAccessList(data);

      const nextMappings = Array.isArray(accessList) ? accessList : [];
      setAccessMappings(nextMappings);
      setHasLoadedMappings(true);
    } catch (error) {
      console.error("Error fetching saved access data:", error);
      setRowData([]);
      setPreviousSavedCodes(new Set());
      setHasLoadedMappings(true);
      toast.error(
        intl.formatMessage({
          id: "message.StrategyActionAccess.fetchError",
          defaultMessage: "Error fetching saved access data.",
        }),
      );
    } finally {
      inFlightRef.current = false;
      setLoadingData(false);
    }
  }, [hasLoadedMappings, intl, toast]);

  useEffect(() => {
    const rolesFromToken = getRolesFromToken();
    setAvailableRoles(rolesFromToken);
  }, []);

  useEffect(() => {
    const selectedActionCode = getSingleActionCode(actionCode);
    if (!selectedActionCode) {
      setRowData([]);
      setPreviousSavedCodes(new Set());
      return;
    }

    if (availableRoles.length === 0) {
      setRowData([]);
      setPreviousSavedCodes(new Set());
      return;
    }

    const cachedSelectedProfileCodes = getCachedSelectedProfileCodes(selectedActionCode);

    applySelectionForAction(
      selectedActionCode,
      availableRoles,
      accessMappings,
      cachedSelectedProfileCodes,
    );
    if (!hasLoadedMappings) {
      loadAccessData(true);
    }
  }, [accessMappings, actionCode, applySelectionForAction, availableRoles, getCachedSelectedProfileCodes, hasLoadedMappings, loadAccessData]);

  useEffect(() => {
    if (rowData.length > 0 && gridRef.current?.api) {
      setTimeout(() => {
        gridRef.current.api.deselectAll();
        gridRef.current.api.forEachNode((node) => {
          if (previousSavedCodes.has(normalizeValue(node.data.profileCode))) {
            node.setSelected(true, false);
          }
        });
      }, 100);
    }
  }, [rowData, previousSavedCodes]);

  const categorizeChangedRows = (currentSelected) => {
    const newProfileCodes = new Set(currentSelected.map((row) => normalizeValue(row.profileCode)));
    const normalizedActionCode = normalizeValue(getSingleActionCode(actionCode));
    const previousMappingsForAction = accessMappings
      .filter((item) => normalizeValue(item?.szActionCode) === normalizedActionCode)
      .map((item) => String(item?.szGroupId || "").trim())
      .filter(Boolean);

    const previousMappingCodeSet = new Set(
      previousMappingsForAction.map((code) => normalizeValue(code)),
    );

    const rowsToCreate = currentSelected.filter(
      (row) => !previousMappingCodeSet.has(normalizeValue(row.profileCode)),
    );

    const rowsToDelete = previousMappingsForAction
      .filter((code) => !newProfileCodes.has(normalizeValue(code)))
      .map((profileCode) => ({
        profileCode,
        availableTo: "",
        isChecked: false,
      }));

    return { rowsToCreate, rowsToDelete };
  };

  const buildPayload = (rowsToCreate, rowsToDelete) => {
    const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
    const selectedActionCode = getSingleActionCode(actionCode);

    if (!selectedActionCode) return [];

    const createPayload = rowsToCreate.map((row) => ({
      szActionCode: selectedActionCode,
      szGroupId: row.profileCode?.trim(),
      szUser: userCode,
      szMode: "N",
    }));

    const deletePayload = rowsToDelete.map((row) => ({
      szActionCode: selectedActionCode,
      szGroupId: row.profileCode?.trim(),
      szUser: userCode,
      szMode: "D",
    }));

    return [...createPayload, ...deletePayload];
  };

  const saveAccessChanges = useCallback(async () => {
    try {
      const currentSelected = gridRef.current?.api?.getSelectedRows?.() || [];
      const { rowsToCreate, rowsToDelete } =
        categorizeChangedRows(currentSelected);

      if (rowsToCreate.length === 0 && rowsToDelete.length === 0) {
        toast.info(
          intl.formatMessage({
            id: "message.StrategyActionAccess.noChanges",
            defaultMessage: "No changes to save.",
          }),
        );
        return false;
      }

      const payload = buildPayload(rowsToCreate, rowsToDelete);
      if (!payload.length) {
        toast.info(
          intl.formatMessage({
            id: "message.StrategyActionAccess.noChanges",
            defaultMessage: "No changes to save.",
          }),
        );
        return false;
      }
      const response = await HAxiosService.POST(
        StrategyActionMasterAPI.StrategyActionAccess(screenMenuId, 'saveStrategyActionAccess'),
        payload,
      );
      const result = response?.data || {};

      if (response?.status >= 400) {
        throw new Error(result?.message || "Save failed");
      }

      await loadAccessData(true);
      gridRef.current?.api?.deselectAll?.();
      return true;
    } catch (error) {
      toast.error(
        error?.message ||
        intl.formatMessage({
          id: "message.StrategyActionAccess.saveError",
          defaultMessage: "Failed to save Strategy Action Access.",
        }),
      );
      return false;
    }
  }, [categorizeChangedRows, intl, loadAccessData, toast]);

  useImperativeHandle(ref, () => ({
    submitAccessChanges: saveAccessChanges,
  }), [saveAccessChanges]);

  const handleDone = useCallback(() => {
    const selectedActionCode = getSingleActionCode(actionCode);
    if (!selectedActionCode) {
      if (typeof onClose === "function") onClose();
      return;
    }

    const normalizedActionCode = normalizeValue(selectedActionCode);
    const cacheData = readCache(ACCESS_SELECTION_CACHE_KEY);
    const nextCacheData =
      cacheData && typeof cacheData === "object" ? { ...cacheData } : {};

    nextCacheData[normalizedActionCode] = gridRef.current?.api?.getSelectedRows?.() || [];
    writeCache(ACCESS_SELECTION_CACHE_KEY, nextCacheData);

    if (typeof onClose === "function") {
      onClose();
    }
  }, [actionCode, onClose]);

  return (
    <HBox className="strategy-action-master-access-panel">
      <HAgGrid
        ref={gridRef}
        rowData={rowData}
        setRowData={setRowData}
        loading={loadingData}
        domLayout="normal"
        columnDefs={columnDefs}
        gridClassName="strategy-action-master-access-grid"
        pagination
        paginationPageSize={6}
        sort
        globalSearch={false}
        suppressRowClickSelection
        rowSelection="multiple"
        allowAdd={false}
        allowDelete={false}
        allowUpdate={false}
        hideInternalSaveButton
      />

      <HBox className="strategy-action-master-access-actions">
        <HButton
          label={intl.formatMessage({
            id: "label.StrategyActionAccess.done",
            defaultMessage: "Done",
          }) || "Done"}
          variant="contained"
          color="primary"
          onClick={handleDone}
        />
      </HBox>
    </HBox>
  );
});

StrategyActionAccess.displayName = "StrategyActionAccess";

export default StrategyActionAccess;
