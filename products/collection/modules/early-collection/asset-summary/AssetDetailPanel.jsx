import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { HButton, HPaper, HLabel, HTextField } from "@helix/component-library";
import {
  getNormalizedTypeFromAsset,
  getDetailLayoutForNormalizedType,
} from "./assetDetailLayouts";
import styles from "./AssetSummary.module.css";

function formatDisplayValue(val) {
  if (val == null) return "";
  if (typeof val === "object") return JSON.stringify(val);
  const s = String(val);
  if (s.includes("T") && s.length >= 10 && /\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.replace("T", " ").replace(/\.\d+Z?$/, "").substring(0, 19);
  }
  return s;
}

function getFieldValue(data, fieldDef) {
  const ownValue = data?.[fieldDef.key];
  if (ownValue != null && ownValue !== "") return ownValue;

  const fallbackKey = fieldDef.fallbackKeys?.find((key) => {
    const fallbackValue = data?.[key];
    return fallbackValue != null && fallbackValue !== "";
  });

  return fallbackKey ? data[fallbackKey] : ownValue;
}

function DetailField({ fieldDef, value }) {
  const display = formatDisplayValue(value);
  return (
    <div className={styles.fieldBlock}>
      <HLabel value={fieldDef.labelId} align="left" colon={false} />
      <HTextField editable={false} value={display} translate={false} width="100%" />
    </div>
  );
}

function FieldGrid({ fields, data }) {
  return (
    <div className={styles.detailFieldGrid}>
      {fields.map((f) => {
        const span = f.colSpan === 3 ? styles.span3 : f.colSpan === 2 ? styles.span2 : "";
        return (
          <div key={f.key} className={span}>
            <DetailField fieldDef={f} value={getFieldValue(data, f)} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {object} props
 * @param {object | null} props.selectedAsset
 */
export default function AssetDetailPanel({ selectedAsset }) {
  const intl = useIntl();
  const [autoTab, setAutoTab] = useState("details");

  const normalized = useMemo(
    () => getNormalizedTypeFromAsset(selectedAsset),
    [selectedAsset],
  );

  const layout = useMemo(() => getDetailLayoutForNormalizedType(normalized), [normalized]);

  if (!selectedAsset) {
    return (
      <HPaper variant="outlined" elevation={0} className={styles.detailCard}>
        <div className={styles.detailBody}>
          <p className={styles.bannerMuted}>
            {intl.formatMessage({ id: "label.AssetSummary.detail.selectRow" })}
          </p>
        </div>
      </HPaper>
    );
  }

  const typeLabel = String(selectedAsset.assetTypeMeta?.label ?? selectedAsset.szAssetType ?? "");
  const code = String(selectedAsset.szAssetCode ?? "");

  if (normalized === "UNKNOWN") {
    return (
      <HPaper variant="outlined" elevation={0} className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <h2 className={styles.detailTitle}>
            {intl.formatMessage({ id: "label.AssetSummary.detail.unsupportedTitle" })}
          </h2>
        </div>
        <div className={styles.detailBody}>
          <p className={styles.bannerMuted}>
            {intl.formatMessage(
              { id: "label.AssetSummary.detail.unsupportedBody" },
              { type: typeLabel },
            )}
          </p>
        </div>
      </HPaper>
    );
  }

  return (
    <HPaper variant="outlined" elevation={0} className={styles.detailCard}>
      <div className={styles.detailHeader}>
        <h2 className={styles.detailTitle}>
          {intl.formatMessage(
            { id: "label.AssetSummary.detail.titleWithType" },
            { type: typeLabel },
          )}
        </h2>
        {code ? <span className={styles.codeBadge}>{code}</span> : null}
      </div>

      <div className={styles.detailBody}>
        {layout.kind === "AUTO_TABS" ? (
          <>
            <div className={styles.tabsRoot}>
              <HButton
                label="label.AssetSummary.tab.assetDetails"
                variant={autoTab === "details" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAutoTab("details")}
                sx={{ minHeight: 28, fontSize: 10, textTransform: "none" }}
              />
              <HButton
                label="label.AssetSummary.tab.assetIdentification"
                variant={autoTab === "identification" ? "contained" : "outlined"}
                size="small"
                onClick={() => setAutoTab("identification")}
                sx={{ minHeight: 28, fontSize: 10, textTransform: "none" }}
              />
            </div>
            {autoTab === "details" ? (
              <FieldGrid fields={layout.fields} data={selectedAsset} />
            ) : (
              <FieldGrid fields={layout.identification} data={selectedAsset} />
            )}
          </>
        ) : (
          <FieldGrid fields={layout.fields} data={selectedAsset} />
        )}
      </div>
    </HPaper>
  );
}
