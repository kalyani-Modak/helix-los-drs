import React from "react";
import { useIntl } from "react-intl";
import Apartment from "@mui/icons-material/Apartment";
import DiamondOutlined from "@mui/icons-material/DiamondOutlined";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import Inventory2 from "@mui/icons-material/Inventory2";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import { getNormalizedTypeFromAsset } from "./assetDetailLayouts.js";
import styles from "./AssetSummary.module.css";

function pickIcon(asset) {
  switch (getNormalizedTypeFromAsset(asset)) {
    case "AUTO":
      return DirectionsCar;
    case "JEWEL":
      return DiamondOutlined;
    case "MACHINE":
      return SettingsOutlined;
    case "PROPERTY":
      return Apartment;
    default:
      return Inventory2;
  }
}

function isSameAsset(a, b) {
  if (!a || !b) return false;
  const sa = a.lnAssetSeqNo;
  const sb = b.lnAssetSeqNo;
  if (sa != null && sb != null) return sa === sb;
  return a === b;
}

/**
 * Interface Delight–style asset summary row: cards (not grid). Click selects asset for detail panel.
 *
 * @param {object} props
 * @param {object[]} props.assets
 * @param {boolean} props.loading
 * @param {object | null} props.selectedAsset
 * @param {(row: object) => void} props.onSelect
 */
export default function AssetSummaryCardPicker({
  assets,
  loading,
  selectedAsset,
  onSelect,
}) {
  const intl = useIntl();

  if (!assets?.length) {
    if (loading) {
      return (
        <div className={styles.summaryLoading} aria-busy="true">
          <span className={styles.summarySpinner} aria-hidden />
          <span className={styles.summaryLoadingLabel}>
            {intl.formatMessage({ id: "label.AssetSummary.cards.loading" })}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`${styles.cardGridWrap} ${loading ? styles.cardGridWrapBusy : ""}`}
      aria-busy={loading ? "true" : "false"}
    >
      {loading ? (
        <div className={styles.cardGridBusyOverlay} aria-hidden>
          <span className={styles.summarySpinner} />
        </div>
      ) : null}
      <div
        className={styles.cardGrid}
        role="list"
        aria-label={intl.formatMessage({ id: "label.AssetSummary.cards.ariaList" })}
      >
      {assets.map((asset, index) => {
        const Icon = pickIcon(asset);
        const active = isSameAsset(selectedAsset, asset);
        const key = asset.lnAssetSeqNo ?? `asset-${index}`;
        const typeLabel = String(asset.assetTypeMeta?.label ?? asset.szAssetType ?? "").trim() || "-";
        const descriptionLabel = String(asset.szDesc ?? "").trim() || "-";

        return (
          <div
            key={key}
            role="listitem"
            className={`${styles.assetCard} ${active ? styles.assetCardActive : ""}`}
            onClick={() => onSelect(asset)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(asset);
              }
            }}
            tabIndex={0}
          >
            <div
              className={`${styles.assetCardIconWrap} ${active ? styles.assetCardIconWrapActive : ""}`}
            >
              <Icon className={styles.assetCardIcon} aria-hidden />
            </div>
            <div className={styles.assetCardText}>
              <p className={styles.assetCardType}>{typeLabel}</p>
              <p className={styles.assetCardCode}>{descriptionLabel}</p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
