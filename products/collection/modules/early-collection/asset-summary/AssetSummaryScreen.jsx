import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import FunctionLayout from "../FunctionLayout.jsx";
import { HAxiosService, HButtonBar, useToast } from "@helix/component-library";

import { AssetSummaryAPI, AssetsAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";


import AssetSummaryCardPicker from "./AssetSummaryCardPicker.jsx";
import AssetDetailPanel from "./AssetDetailPanel.jsx";
import { normalizeAssetType } from "./assetDetailLayouts.js";
import styles from "./AssetSummary.module.css";
import { Typography } from "@mui/material";

function normalizeComparableAssetType(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/^LABEL\.ASSET\./, "")
    .replace(/[\s_-]+/g, "");
}

function formatAssetTypeTileLabel(apiCode, intl, szDesc) {
  const raw = intl.formatMessage({ id: szDesc, defaultMessage: szDesc || apiCode });
  return String(raw)
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .filter(Boolean)
    .join(" ");
}

function findListByKey(payload, matchers) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const entries = Object.entries(payload);
  const found = entries.find(([key, value]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return Array.isArray(value) && matchers.some((matcher) => normalizedKey.includes(matcher));
  });
  return found ? found[1] : [];
}

function getAssetTypeList(payload) {
  return Array.isArray(payload) ? payload : findListByKey(payload, ["assettype", "asset"]);
}

function buildAssetTypeMeta(item, intl) {
  const labelId = item?.szi18nDesc || item?.szDesc || "";
  const code = String(
    item?.szCondition ?? item?.value ?? item?.szCode ?? item?.code ?? item?.id ?? "",
  ).trim();
  const label = formatAssetTypeTileLabel(code, intl, labelId);

  return {
    code,
    labelId,
    label,
    normalizedType: normalizeAssetType(`${code} ${labelId} ${label}`),
  };
}

function findAssetTypeMeta(assetType, assetTypeMetas) {
  const assetTypeKey = normalizeComparableAssetType(assetType);
  return assetTypeMetas.find((meta) => {
    const keys = [
      meta.code,
      meta.label,
      meta.labelId,
      meta.labelId?.split(".").pop(),
    ];

    return (
      keys.some((key) => normalizeComparableAssetType(key) === assetTypeKey) ||
      normalizeAssetType(assetType) === meta.normalizedType
    );
  }) ?? null;
}

function enrichRow(item, index, assetTypeMetas) {
  const assetTypeMeta = findAssetTypeMeta(item?.szAssetType, assetTypeMetas);
  return {
    ...item,
    assetTypeMeta,
    gridRowId: item.lnAssetSeqNo ?? index,
  };
}

function isSuccessStatus(data) {
  if (!data) return false;
  const s = data.status;
  if (typeof s === "string") return s.toLowerCase() === "success";
  return s === 200 || s === "200";
}

export default function AssetSummaryScreen() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [rowData, setRowData] = useState([]);
  const [assetTypeMetas, setAssetTypeMetas] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const loadSummary = useCallback(
    async (preserveSeqNo) => {
      if (!selectedRow) {
        setRowData([]);
        setSelectedAsset(null);
        setSummaryError(null);
        setSummaryLoading(false);
        return;
      }

      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const res = await HAxiosService.GET(
          `${AssetSummaryAPI.AssetSummary(screenMenuId)}/fetchAssetSummary`,
        );
        const data = res.data;

        if (isSuccessStatus(data) && Array.isArray(data.responseJson)) {
          const mapped = data.responseJson.map((item, idx) =>
            enrichRow(item, idx, assetTypeMetas),
          );
          setRowData(mapped);

          if (preserveSeqNo != null) {
            const found = mapped.find((r) => r.lnAssetSeqNo === preserveSeqNo);
            setSelectedAsset(found ?? (mapped[0] ?? null));
          } else {
            setSelectedAsset(mapped[0] ?? null);
          }
        } else if (
          data?.status === "Failure" &&
          data?.message === "Validation Failed"
        ) {
          setRowData([]);
          setSelectedAsset(null);
          handleValidationErrors(intl, toast, data.responseJson);
        } else {
          setRowData([]);
          setSelectedAsset(null);
          setSummaryError(null);
        }
      } catch (error) {
        console.error("Asset Summary fetch error:", error);
        setRowData([]);
        setSelectedAsset(null);
        setSummaryError(
          intl.formatMessage({ id: "label.AssetSummary.error.loadFailed" }),
        );
        toast.error(
          error?.response?.data?.message ||
            intl.formatMessage({ id: "label.AssetSummary.error.network" }),
        );
      } finally {
        setSummaryLoading(false);
      }
    },
    [assetTypeMetas, selectedRow, intl, toast],
  );

  useEffect(() => {
    let cancelled = false;

    HAxiosService.GET(AssetsAPI.Assets(screenMenuId))
      .then((res) => {
        const data = res.data;
        const assetTypeList = getAssetTypeList(data?.responseJson);
        if (!cancelled && isSuccessStatus(data) && Array.isArray(assetTypeList)) {
          setAssetTypeMetas(assetTypeList.map((item) => buildAssetTypeMeta(item, intl)));
        }
      })
      .catch((error) => {
        console.error("Asset type fetch error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [intl]);

  useEffect(() => {
    loadSummary(undefined);
  }, [selectedRow, loadSummary]);

  const handleRefresh = useCallback(() => {
    const seq = selectedAsset?.lnAssetSeqNo;
    return loadSummary(seq);
  }, [loadSummary, selectedAsset?.lnAssetSeqNo]);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.AssetSummary.title" })}
      contentPaddingTop={0}
    >
      <div className={styles.page}>
        {!selectedRow ? (
        <Typography className={styles.bannerMuted}>
            {intl.formatMessage({ id: "label.AssetSummary.noAccount" })}
          </Typography>
        ) : null}

        {summaryError ? <Typography className={styles.bannerError}>{summaryError}</Typography> : null}

        {selectedRow && !summaryLoading && rowData.length === 0 && !summaryError ? (
          <Typography className={styles.bannerMuted}>
            {intl.formatMessage({ id: "label.AssetSummary.empty" })}
          </Typography>
        ) : null}

        {selectedRow ? (
          <AssetSummaryCardPicker
            assets={rowData}
            loading={summaryLoading}
            selectedAsset={selectedAsset}
            onSelect={setSelectedAsset}
          />
        ) : null}

        {selectedRow ? <AssetDetailPanel selectedAsset={selectedAsset} /> : null}

        <div className={styles.floatingBarSlot}>
          <HButtonBar
            onReset={handleRefresh}
            onClose={() => navigate("/homelayout/welcomepage")}
            disableToast={{ reset: true, close: true }}
          />
        </div>
      </div>
    </FunctionLayout>
  );
}
