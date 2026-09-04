import React from "react";
import { useIntl } from "react-intl";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import DiamondOutlined from "@mui/icons-material/DiamondOutlined";
import DirectionsCarOutlined from "@mui/icons-material/DirectionsCarOutlined";
import Inventory2 from "@mui/icons-material/Inventory2";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";

import { normalizeAssetApiType } from "./addAssetFieldConfig";
import AddAssetFormFields from "./AddAssetFormFields";
import { HButton, HPaper } from "@helix/component-library";

import styles from "./addAssetScreen.module.css";

function TypeIcon({ apiCode, formType }) {
  const t = normalizeAssetApiType(formType || apiCode);
  if (t === "AUTO") return <DirectionsCarOutlined fontSize="small" />;
  if (t === "MACHINE") return <SettingsOutlined fontSize="small" />;
  if (t === "JEWEL") return <DiamondOutlined fontSize="small" />;
  if (t === "PROPERTY") return <ApartmentOutlined fontSize="small" />;
  return <Inventory2 fontSize="small" />;
}

function typeTileSx(selected) {
  return {
    justifyContent: "flex-start",
    gap: "8px",
    minHeight: 38,
    padding: "10px 12px",
    borderRadius: "8px",
    borderColor: selected ? "var(--drs-color-primary, #2563eb)" : "var(--drs-border-divider, #e2e8f0)",
    backgroundColor: selected ? "var(--drs-action-selected, rgba(37, 99, 235, 0.12))" : "var(--drs-bg-paper, #ffffff)",
    boxShadow: selected ? "0 0 0 2px var(--drs-soft-accent, rgba(37, 99, 235, 0.2))" : "none",
    color: selected ? "var(--drs-color-primary-dark, #1d4ed8)" : "var(--drs-text-primary, #141923)",
    fontSize: "12px",
    fontWeight: selected ? 600 : 500,
    lineHeight: 1.25,
    textTransform: "none",
    "& .MuiButton-startIcon": {
      color: selected ? "var(--drs-color-primary, #2563eb)" : "var(--drs-text-secondary, #64748b)",
      marginLeft: 0,
      marginRight: "8px",
    },
    "&:hover": {
      borderColor: "var(--drs-control-hover-border, #2563eb)",
      backgroundColor: selected ? "var(--drs-action-selected, rgba(37, 99, 235, 0.12))" : "var(--drs-hover-bg, rgba(37, 99, 235, 0.08))",
      boxShadow: selected ? "0 0 0 2px var(--drs-soft-accent, rgba(37, 99, 235, 0.2))" : "none",
    },
  };
}

export default function AddAssetEntrySection({
  assetTypeOptions,
  selectedApiCode,
  selectedFormType,
  onSelectType,
  entryData,
  onEntryChange,
  ownerTypeOptions,
}) {
  const intl = useIntl();

  const titleForType = () => {
    const opt = assetTypeOptions.find((o) => o.apiCode === selectedApiCode);
    if (!opt) return intl.formatMessage({ id: "label.addAsset.entry.addNewAsset" });
    return intl.formatMessage({ id: "label.addAsset.entry.addNewType" }, { type: opt.label });
  };

  return (
    <div className={styles.entryColumn}>
      <HPaper className={styles.card} elevation={0}>
        <div className={styles.cardContent}>
          <div className={styles.typeSection}>
            <div className={styles.sectionLabel}>
              {intl.formatMessage({ id: "label.Assets.Asset Type" })}
              <span className={styles.sectionLabelRequired}> *</span>
            </div>
            <div className={styles.typeGrid}>
              {assetTypeOptions.map((opt) => {
                const selected = selectedApiCode === opt.apiCode;
                return (
                  <HButton
                    key={opt.apiCode}
                    variant="outlined"
                    size="small"
                    fullWidth
                    label={opt.label}
                    startIcon={<TypeIcon apiCode={opt.apiCode} formType={opt.formType} />}
                    onClick={() => onSelectType(opt.apiCode)}
                    sx={typeTileSx(selected)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </HPaper>

      {selectedApiCode && (
        <HPaper className={styles.card} elevation={0}>
          <div className={styles.cardContent}>
            <div className={styles.formHeader}>
              <Inventory2 className={styles.primaryIcon} fontSize="small" />
              <div className={styles.formHeaderTitle}>{titleForType()}</div>
            </div>
            <AddAssetFormFields
              apiAssetType={selectedFormType || selectedApiCode}
              data={entryData}
              onChange={onEntryChange}
              readOnly={false}
              ownerTypeOptions={ownerTypeOptions}
            />
          </div>
        </HPaper>
      )}
    </div>
  );
}
