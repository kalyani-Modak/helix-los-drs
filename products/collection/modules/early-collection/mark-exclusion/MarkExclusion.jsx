import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { HAxiosService, HBox, HButtonBar, useToast } from "@helix/component-library";

import { MarkExclusionAPI } from "../apiEndpoints.jsx";
import FunctionLayout from "../FunctionLayout.jsx";


import MarkExclusionActiveSection from "./MarkExclusionActiveSection.jsx";
import MarkExclusionHistoryGrid from "./MarkExclusionHistoryGrid.jsx";
import {
  buildExclusionSaveList,
  buildFetchWrapper,
  buildSaveWrapper,
  isApiSuccess,
  mapExclusionEntityToRow,
  mapHistoryEntityToGridRow,
  newEmptyRow,
  normalizeFetchPayload,
  rowNeedsValidation,
  isDateOrderInvalid,
  serializeRowsForCompare,
} from "./markExclusionApi.js";
import {
  MARK_EXCLUSION_ACTION_TYPES,
  MARK_EXCLUSION_CATEGORY_BY_TYPE,
} from "./markExclusionConstants.js";
import { useLocation } from "react-router-dom";

function unwrapDropdownPayload(data) {
  const raw = data?.responseJson ?? data?.data?.responseJson ?? data;
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

function optionValue(item) {
  if (item == null) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(
    item.szReasonCode ||
      item.szreasontype ||
      item.szReasonType ||
      item.reasonCode ||
      item.reasonType ||
      item.szActionCode ||
      item.szCondition ||
      item.code ||
      item.szCode ||
      item.value ||
      item.label ||
      ""
  );
}

function optionLabel(item, value, intl) {
  if (item && typeof item === "object") {
    const label =
      item.szReasonDesc ||
      item.szreasondesc ||
      item.reasonDesc ||
      item.reasonDescription ||
      item.szActionDesc ||
      item.szDesc ||
      item.szi18nDesc ||
      item.szi18nDescription ||
      item.szDescription ||
      item.description ||
      item.label ||
      value;
    return intl.messages?.[label]
      ? intl.formatMessage({ id: label, defaultMessage: label })
      : String(label);
  }
  return value;
}

function normalizedKey(value) {
  return String(value || "").toLowerCase();
}

function findDropdownRows(source, keys) {
  if (Array.isArray(source)) return source;
  if (!source || typeof source !== "object") return [];

  const wanted = new Set(keys.map(normalizedKey));

  for (const [key, value] of Object.entries(source)) {
    if (!wanted.has(normalizedKey(key))) continue;
    const parsed = unwrapDropdownPayload(value);
    if (Array.isArray(parsed)) return parsed;
  }

  for (const value of Object.values(source)) {
    const parsed = unwrapDropdownPayload(value);
    if (parsed && typeof parsed === "object") {
      const nested = findDropdownRows(parsed, keys);
      if (nested.length) return nested;
    }
  }

  return [];
}

function mapDropdownOptions(payload, keys, intl) {
  const rows = findDropdownRows(payload, keys);

  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => {
      const value = optionValue(item).trim();
      if (!value) return null;
      return {
        value,
        label: optionLabel(item, value, intl),
      };
    })
    .filter(Boolean);
}

function sortHistoryDesc(rows) {
  return [...(rows || [])].sort((a, b) => {
    const ta = dayjs(a.dtCreatedOn).valueOf();
    const tb = dayjs(b.dtCreatedOn).valueOf();
    return tb - ta;
  });
}

export default function MarkExclusion() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);

  const [rows, setRows] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leafOptions, setLeafOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const snapshotRef = useRef("");

  const realmHeaders = useMemo(() => {
    const tenantId = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
    return {
      "X-Tenant-Id": tenantId,
      TenantId: tenantId,
      tenantId,
      "Content-Type": "application/json",
    };
  }, []);

  const actionOptions = useMemo(
    () =>
      MARK_EXCLUSION_ACTION_TYPES.map((o) => ({
        value: o.value,
        label: intl.formatMessage({ id: o.labelId, defaultMessage: o.value }),
      })),
    [intl],
  );

  const categoryOptions = useMemo(
    () => {
      return Object.entries(MARK_EXCLUSION_CATEGORY_BY_TYPE).reduce(
        (acc, [actionType, categories]) => {
          acc[actionType] = categories.map((value) => ({
            value,
            label: intl.formatMessage({
              id: `markExclusion.category.${String(value)
                .toLowerCase()
                .replace(/\s+/g, "")}`,
              defaultMessage: value,
            }),
          }));
          return acc;
        },
        {},
      );
    },
    [intl],
  );

  const applyHydration = useCallback((exclusions, history) => {
    const mapped = (exclusions || []).map(mapExclusionEntityToRow);
    const his = sortHistoryDesc((history || []).map(mapHistoryEntityToGridRow));
    setRows(mapped);
    setHistoryRows(his);
    snapshotRef.current = serializeRowsForCompare(mapped);
  }, []);

  const loadData = useCallback(async () => {
    if (!selectedRow?.ACNT_SEQNO) {
      setRows([]);
      setHistoryRows([]);
      setLeafOptions([]);
      setReasonOptions([]);
      snapshotRef.current = serializeRowsForCompare([]);
      return;
    }

    setLoading(true);
    try {
      const body = buildFetchWrapper();
      const res = await HAxiosService.GET(
        MarkExclusionAPI.MarkExclusionApi(screenMenuId),
        body,
        {},
        false,
        realmHeaders,
      );

      if (res.status === 204) {
        setLeafOptions([]);
        setReasonOptions([]);
        applyHydration([], []);
        return;
      }

      const data = res.data ?? {};
      if (isApiSuccess(data)) {
        const { exclusions, exclusionHistory } = normalizeFetchPayload(data);
        const nextReasonOptions = mapDropdownOptions(
          unwrapDropdownPayload(data),
          [
            "reasonTypes",
            "lstReasonType",
            "lstReasonTypes",
            "reasons",
            "lstReason",
            "lstReasons",
            "lstReasonMaster",
            "lstReasonMasters",
          ],
          intl,
        );
        const nextLeafOptions = mapDropdownOptions(
          unwrapDropdownPayload(data),
          ["leafTypes"],
          intl,
        );
        setLeafOptions(nextLeafOptions);
        setReasonOptions(nextReasonOptions);
        applyHydration(exclusions, exclusionHistory);
        return;
      }

      const msg = data?.message || "";
      if (
        String(msg).toLowerCase().includes("no data") ||
        res.status === 404
      ) {
        setLeafOptions([]);
        setReasonOptions([]);
        applyHydration([], []);
        return;
      }

      toast.error(
        msg ||
          intl.formatMessage({
            id: "markExclusion.error.fetch",
            defaultMessage: "Could not load exclusions.",
          }),
      );
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.fetch",
          defaultMessage: "Could not load exclusions.",
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [applyHydration, intl, realmHeaders, selectedRow, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isDirty = useMemo(
    () => serializeRowsForCompare(rows) !== snapshotRef.current,
    [rows],
  );

  const handleRowChange = useCallback((rowKey, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.rowKey !== rowKey) return r;
        const next = { ...r, [field]: value };
        if (r.lnExclSeqNo != null) {
          next.dirty = true;
        }
        if (field === "szActionType") {
          next.szActionCategory = "";
        }
        return next;
      }),
    );
  }, []);

  const handleAddRow = useCallback(() => {
    setRows((prev) => [...prev, newEmptyRow()]);
  }, []);

  const handleRemoveRow = useCallback((rowKey) => {
    setRows((prev) => prev.filter((r) => r.rowKey !== rowKey));
  }, []);

  const handleReset = useCallback(async () => {
    await loadData();
    toast.success(
      intl.formatMessage({
        id: "markExclusion.reset.done",
        defaultMessage: "Form reset.",
      }),
    );
    return { data: { status: "Success", success: true } };
  }, [intl, loadData, toast]);

  const validateForSave = useCallback(() => {
    if (!selectedRow?.ACNT_SEQNO) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.noAccount",
          defaultMessage: "Select an account first.",
        }),
      );
      return false;
    }

    for (const row of rows) {
      if (rowNeedsValidation(row)) {
        toast.error(
          intl.formatMessage({
            id: "markExclusion.error.requiredFields",
            defaultMessage: "Fill all required fields on each active exclusion row.",
          }),
        );
        return false;
      }
      if (isDateOrderInvalid(row)) {
        toast.error(
          intl.formatMessage({
            id: "markExclusion.error.dateOrder",
            defaultMessage: "Till date must be on or after From date.",
          }),
        );
        return false;
      }
    }

    const payload = buildExclusionSaveList(rows);
    if (payload.length === 0) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.nothingToSave",
          defaultMessage: "No changes to save.",
        }),
      );
      return false;
    }

    return true;
  }, [intl, rows, selectedRow, toast]);

  const handleSave = useCallback(async () => {
    if (!validateForSave()) {
      return { data: { status: "Failure", success: false, message: "validation" } };
    }

    const lst = buildExclusionSaveList(rows);
    setSaving(true);
    try {
      const body = buildSaveWrapper(lst);
      const res = await HAxiosService.POST(
        `${MarkExclusionAPI.MarkExclusionApi(screenMenuId)}/saveExclusion`,
        body,
        {},
        false,
        realmHeaders,
      );
      const data = res.data ?? {};

      if (res.status === 406 || res.status === 400) {
        toast.error(
          data?.message ||
            intl.formatMessage({
              id: "markExclusion.error.saveRejected",
              defaultMessage: "Save was rejected.",
            }),
        );
        return { data: { status: "Failure", success: false, message: data?.message } };
      }

      if (res.status === 204) {
        toast.warning(
          data?.message ||
            intl.formatMessage({
              id: "markExclusion.warn.noChanges",
              defaultMessage: "No changes were saved.",
            }),
        );
        return { data: { status: "Failure", success: false } };
      }

      if (isApiSuccess(data)) {
        toast.success(
          data?.message ||
            intl.formatMessage({
              id: "markExclusion.save.success",
              defaultMessage: "Exclusions saved.",
            }),
        );
        await loadData();
        return { data: { status: "Success", success: true, message: data?.message } };
      }

      toast.error(
        data?.message ||
          intl.formatMessage({
            id: "markExclusion.error.save",
            defaultMessage: "Save failed.",
          }),
      );
      return { data: { status: "Failure", success: false, message: data?.message } };
    } catch (e) {
      console.error(e);
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.save",
          defaultMessage: "Save failed.",
        }),
      );
      return { data: { status: "Failure", success: false } };
    } finally {
      setSaving(false);
    }
  }, [intl, loadData, realmHeaders, rows, toast, validateForSave]);

  const handleSaveWrapped = useCallback(async () => {
    if (!isDirty) {
      toast.error(
        intl.formatMessage({
          id: "markExclusion.error.nothingToSave",
          defaultMessage: "No changes to save.",
        }),
      );
      return { data: { status: "Failure", success: false } };
    }
    if (saving) {
      return { data: { status: "Failure", success: false } };
    }
    return handleSave();
  }, [handleSave, intl, isDirty, saving, toast]);

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "markExclusion.title",
        defaultMessage: "Mark Exclusion",
      })}
      contentPaddingTop={0}
    >
      <Stack
        spacing={3}
        sx={{
          px: { xs: 1, sm: 2, md: 2 },
          pb: 10,
          pt: 1,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          background: "var(--drs-bg-page)",
          "& > *": {
            minWidth: 0,
          },
        }}
      >
        <MarkExclusionActiveSection
          rows={rows}
          onRowChange={handleRowChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          loading={loading}
          actionOptions={actionOptions}
          categoryOptions={categoryOptions}
          leafOptions={leafOptions}
          reasonOptions={reasonOptions}
        />
        <MarkExclusionHistoryGrid
          rowData={historyRows}
          loading={loading}
          leafOptions={leafOptions}
        />
        <HBox sx={{ position: "relative", zIndex: 2000 }}>
          <HButtonBar
            onSave={handleSaveWrapped}
            onReset={handleReset}
            onClose={() => navigate("/homelayout/welcomepage")}
            disableToast={{ save: true, reset: true }}
          />
        </HBox>
      </Stack>
    </FunctionLayout>
  );
}
