import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import FunctionLayout from "../FunctionLayout.jsx";
import { HAxiosService, HBox, HButtonBar, useDrsTheme, useToast } from "@helix/component-library";

import { AssetsAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";


import AddAssetEntrySection from "./AddAssetEntrySection.jsx";
import { buildSaveAssetPayload } from "./addAssetPayload.js";
import { normalizeAssetApiType, validateAssetPayload } from "./addAssetFieldConfig.js";
import { Typography } from "@mui/material";

import styles from "./addAssetScreen.module.css";

function formatAssetTypeTileLabel(apiCode, intl, szDesc, szi18nDesc) {
  const labelKey = szi18nDesc || szDesc;
  const raw = intl.messages?.[labelKey]
    ? intl.formatMessage({ id: labelKey, defaultMessage: szDesc || apiCode })
    : (szDesc || apiCode);
  return String(raw)
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .filter(Boolean)
    .join(" ");
}

function mapApiDropdownOptions(list = [], intl) {
  return (Array.isArray(list) ? list : [])
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const value = String(
        item.szCondition ?? item.value ?? item.szCode ?? item.code ?? item.id ?? "",
      ).trim();
      if (!value) return null;
      const labelSource =
        item.szi18nDesc ?? item.szDesc ?? item.label ?? item.description ?? item.name ?? value;
      const label =
        typeof labelSource === "string" && intl.messages?.[labelSource]
          ? intl.formatMessage({ id: labelSource, defaultMessage: item.szDesc || value })
          : labelSource;
      return { value, label: String(label) };
    })
    .filter(Boolean);
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

function findOwnerTypeList(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];

  const directKeys = [
    "addressees",
    "ownerType",
    "ownerTypes",
    "lstOwnerType",
    "lstOwnerTypes",
    "ownerTypeList",
    "lstAssetOwnerType",
  ];

  const direct = directKeys.find((key) => Array.isArray(payload[key]));
  if (direct) return payload[direct];

  return findListByKey(payload, ["ownertype"]);
}

function isApiSuccess(res) {
  const s = res?.data?.status;
  return typeof s === "string" && s.toLowerCase() === "success";
}

export default function AddAssetScreen() {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((state) => state.account);

  const [assetTypeOptions, setAssetTypeOptions] = useState([]);
  const [ownerTypeOptions, setOwnerTypeOptions] = useState([]);
  const [selectedApiCode, setSelectedApiCode] = useState("");
  const [entryData, setEntryData] = useState({});
  const [saving, setSaving] = useState(false);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const loadAssetTypes = useCallback(() => {
    return HAxiosService.GET(AssetsAPI.Assets(screenMenuId))
      .then((res) => {
        const payload = res?.data?.responseJson ?? {};
        const assetTypeList = Array.isArray(payload)
          ? payload
          : findListByKey(payload, ["assettype", "asset"]);
        const ownerTypeList = findOwnerTypeList(payload);

        if (isApiSuccess(res) && Array.isArray(assetTypeList)) {
          const options = assetTypeList.map((item) => {
            const apiCode = String(item.szCondition || "").trim();
            return {
              apiCode,
              formType: normalizeAssetApiType(`${apiCode} ${item.szDesc || ""}`),
              label: formatAssetTypeTileLabel(apiCode, intl, item.szDesc, item.szi18nDesc),
            };
          });
          setAssetTypeOptions(options);
          setOwnerTypeOptions(mapApiDropdownOptions(ownerTypeList, intl));
        } else {
          toast.warn(intl.formatMessage({ id: "label.addAsset.warn.noAssetTypes" }));
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || intl.formatMessage({ id: "label.addAsset.error.fetchTypes" }));
      });
  }, [intl, toast]);

  useEffect(() => {
    loadAssetTypes();
  }, [loadAssetTypes, intl.locale]);

  useEffect(() => {
    setEntryData({});
    setSelectedApiCode("");
  }, [selectedRow]);

  const onSelectType = (apiCode) => {
    setSelectedApiCode(apiCode);
    setEntryData({ szAssetType: apiCode });
  };

  const onEntryChange = (key, value) => {
    setEntryData((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setEntryData({});
    setSelectedApiCode("");
    return Promise.resolve({ data: { status: "Success" } });
  };

  const handleSaveNew = () => {
    if (!selectedRow) {
      toast.error(intl.formatMessage({ id: "label.addAsset.error.noAccount" }));
      return Promise.reject(new Error("no account"));
    }
    if (!selectedApiCode) {
      toast.error(intl.formatMessage({ id: "error.asset.assetType.mandatory" }));
      return Promise.reject(new Error("type"));
    }
    
    const selectedOption = assetTypeOptions.find((opt) => opt.apiCode === selectedApiCode);
    const apiAssetType = selectedOption?.apiCode || selectedApiCode;
    const validationType = selectedOption?.formType || apiAssetType;
    const err = validateAssetPayload(validationType, entryData, intl);
    if (err) {
      toast.error(err);
      return Promise.reject(new Error("validation"));
    }
    setSaving(true);
    const payload = buildSaveAssetPayload({
      selectedRow,
      assetType: apiAssetType,
      assetData: entryData,
      lnAssetSeqNo: null,
    });
    return HAxiosService.POST(AssetsAPI.Assets(screenMenuId), payload)
      .then((res) => {
        if (isApiSuccess(res)) {
          setEntryData({});
          setSelectedApiCode("");
          return { success: true };
        }
        if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          toast.error(res.data.msg || intl.formatMessage({ id: "label.addAsset.error.save" }));
        }
        return Promise.reject(new Error("save"));
      })
      .catch((err) => {
        console.error(err);
        if (err?.message !== "save" && err?.message !== "validation") {
          const data = err.response?.data;
          if (data?.message === "Validation Failed" && data?.responseJson) {
            handleValidationErrors(intl, toast, data.responseJson);
          } else {
            toast.error(data?.message || data?.msg || intl.formatMessage({ id: "label.addAsset.error.save" }));
          }
        }
        throw err;
      })
      .finally(() => setSaving(false));
  };

  const canSaveNew = selectedRow && selectedApiCode && !saving;

  const { themeVars, surfaces, text } = useDrsTheme();

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.addAsset.screenTitle" })}
      contentPaddingTop={0}
      scrollMode="contain"
    >
      <HBox
        sx={{
          ...themeVars,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: surfaces.panel,
          color: text.primary,
        }}
      >
        <div className={styles.scrollBody}>
          <div className={styles.stack}>
            {!selectedRow ? (
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <Typography className={styles.mutedNote}>
                    {intl.formatMessage({ id: "label.addAsset.error.noAccount" })}
                  </Typography>
                </div>
              </div>
            ) : (
              <AddAssetEntrySection
                assetTypeOptions={assetTypeOptions}
                selectedApiCode={selectedApiCode}
                selectedFormType={assetTypeOptions.find((opt) => opt.apiCode === selectedApiCode)?.formType || selectedApiCode}
                onSelectType={onSelectType}
                entryData={entryData}
                onEntryChange={onEntryChange}
                ownerTypeOptions={ownerTypeOptions}
              />
            )}
          </div>
        </div>

        <div className={styles.barWrap}>
          <HButtonBar
            onSave={canSaveNew ? handleSaveNew : undefined}
            onReset={(selectedApiCode || Object.keys(entryData).length > 0) && !saving ? resetAll : undefined}
            onClose={() => navigate("/homelayout/welcomepage")}
            disableToast={{ close: true }}
          />
        </div>
      </HBox>
    </FunctionLayout>
  );
}
