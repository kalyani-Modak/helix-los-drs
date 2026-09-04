import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { HAxiosService, HBox, HDatePicker, HDropdown, HLabel, HTextField, HTextarea, HButton, HAgGrid, useDrsTheme, useToast, HDrawer } from "@helix/component-library";


import { CollateralAPI } from "./apiEndpoints.jsx";
import FunctionLayout from "./FunctionLayout.jsx";

import { handleValidationErrors } from "../early-collection/ValidationUtils.jsx";

// ─── Params ───────────────────────────────────────────────────────────────────

const COLLATERAL_STATUS = {
  NEW:      "NEW",
  ISSUED:   "ISSUED",
  RETURNED: "RETURNED",
  RELEASED: "RELEASED",
};

const COLLATERAL_STATUS_COLOR_MAP = {
  [COLLATERAL_STATUS.NEW]:      "info",
  [COLLATERAL_STATUS.ISSUED]:   "warning",
  [COLLATERAL_STATUS.RETURNED]: "success",
  [COLLATERAL_STATUS.RELEASED]: "error",
};

const COLLATERAL_TAB_ACCESS = {
  [COLLATERAL_STATUS.NEW]:      { Issue: true,  Return: false, Release: false },
  [COLLATERAL_STATUS.ISSUED]:   { Issue: false, Return: true,  Release: false },
  [COLLATERAL_STATUS.RETURNED]: { Issue: false, Return: false, Release: true  },
  [COLLATERAL_STATUS.RELEASED]: { Issue: false, Return: false, Release: false },
};

function getTabAccess(status) {
  const normalized = String(status || "").toUpperCase();
  return COLLATERAL_TAB_ACCESS[normalized] ?? { Issue: false, Return: false, Release: false };
}

const DRAWER_TABS = [
  { key: "Details", labelId: "label.ListOfCollateral.tabs.details", defaultLabel: "Details" },
  { key: "Issue", labelId: "label.ListOfCollateral.tabs.issue", defaultLabel: "Issue" },
  { key: "Return", labelId: "label.ListOfCollateral.tabs.return", defaultLabel: "Return" },
  { key: "Release", labelId: "label.ListOfCollateral.tabs.release", defaultLabel: "Release" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function firstDefined(obj, keys) {
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (obj?.[key] != null && obj[key] !== "") return obj[key];
  }
  return undefined;
}

function extractCollateralRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.responseJson)) return data.responseJson;
  if (Array.isArray(data?.responsejson)) return data.responsejson;
  return [];
}

function mapCollateralRow(item, index) {
  return {
    srNo:           firstDefined(item, ["inSrNo", "srNo"]) ?? index + 1,
    collateralType: firstDefined(item, ["szCtlType", "collateralType"]),
    collateralSeqNo:firstDefined(item, ["lnCtlSeqNo", "collateralSeqNo"]),
    docId:          firstDefined(item, ["szDocId", "docId"]),
    description:    firstDefined(item, ["szDocDesc", "description"]),
    level:          firstDefined(item, ["szAcLevel", "level"]),
    status:         firstDefined(item, ["szStatus", "status"]),
    statusDate:     firstDefined(item, ["dtStatusDate", "statusDate"]),
    additionalInfo: firstDefined(item, ["szAddInf", "additionalInfo"]),
  };
}

function formatSystemParamLabel(intl, label, value) {
  const fallback = label && !String(label).startsWith("label.")
    ? label
    : String(value || "")
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

  if (!label) return fallback;

  return String(label).startsWith("label.")
    ? intl.formatMessage({ id: label, defaultMessage: fallback })
    : label;
}

function inferSystemParamValue(label) {
  const rawLabel = String(label || "");
  if (!rawLabel) return undefined;

  const lastSegment = rawLabel.split(".").pop();
  return lastSegment ? lastSegment.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase() : undefined;
}

function mapSystemParamOptions(items, intl) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const rawValue = firstDefined(item, ["szCondition", "szcondition", "condition", "code", "value"]);
      const label = firstDefined(item, ["szDesc", "szdesc", "szi18nDesc", "szi18ndesc", "label", "description"]) ?? rawValue;
      const value = rawValue ?? inferSystemParamValue(label);

      return value ? { value, label: formatSystemParamLabel(intl, label, value) } : null;
    })
    .filter(Boolean);
}

function filterOptionsByValue(options, value) {
  const normalizedValue = String(value || "").toUpperCase();
  return options.filter((option) => String(option.value || "").toUpperCase() === normalizedValue);
}

function getActionStatusForTab(tab) {
  if (tab === "Issue") return COLLATERAL_STATUS.ISSUED;
  if (tab === "Return") return COLLATERAL_STATUS.RETURNED;
  if (tab === "Release") return COLLATERAL_STATUS.RELEASED;
  return "";
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function chipBaseSx() {
  return {
    height: 22,
    borderRadius: 11,
    fontSize: 10,
    fontWeight: 700,
    "& .MuiChip-label": { px: 0.9 },
  };
}

function statusChipSx(theme, status) {
  const normalized = String(status || "").toUpperCase();
  const colorKey   = COLLATERAL_STATUS_COLOR_MAP[normalized] ?? "info";
  const palette    = theme.palette[colorKey];

  return {
    bgcolor:     alpha(palette.main, 0.12),
    borderColor: alpha(palette.main, 0.35),
    color: theme.palette.mode === "dark" ? palette.light : palette.dark,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CollateralDrawerField({ label, value }) {
  return (
    <HBox sx={{ background: "transparent" }}>
      <HLabel value={label} translate={false} align="left" colon={false} sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.25 }} />
      <HLabel value={value || "-"} translate={false} align="left" colon={false} sx={{ mt: 0.25, fontSize: 13, color: "text.primary", lineHeight: 1.35 }} />
    </HBox>
  );
}

function FormField({ name, label, placeholder, select = false, multiline = false, date = false, value, options = [], onChange }) {
  return (
    <HBox sx={{ background: "transparent" }}>
      <HLabel value={label} translate={false} align="left" colon={false} sx={{ mb: 0.6, fontSize: 12, color: "text.primary", lineHeight: 1.25 }} />
      {select && (
        <HDropdown name={name} value={value || ""} options={options} placeholder={placeholder} width="100%"
          onChange={(e) => onChange(name, e.target.value)} />
      )}
      {date && (
        <HDatePicker
          value={value ? dayjs(value) : null}
          onChange={(v) => onChange(name, v ? dayjs(v).format("YYYY-MM-DD") : "")}
          width="100%"
        />
      )}
      {multiline && (
        <HTextarea value={value || ""} placeholder={placeholder} width="100%" maxLines={3}
          onChange={(e) => onChange(name, e.target.value)} />
      )}
      {!select && !date && !multiline && (
        <HTextField editable value={value || ""} placeholder={placeholder} width="100%"
          onChange={(e) => onChange(name, e.target.value)} />
      )}
    </HBox>
  );
}

function DrawerActions({ onClose, onSave, showSave = true }) {
  const intl = useIntl();
  return (
    <>
      <Divider sx={{ my: 1.5 }} />
      <HBox sx={{ display: "flex", flexDirection: "row", gap: 1, background: "transparent" }}>
        {showSave && (
          <HButton fullWidth variant="contained" 
            label={intl.formatMessage({id: "label.collateral.save", defaultMessage: "Save"})}
            onClick={onSave}
            startIcon={<SaveOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{ minHeight: 36, borderRadius: 1, fontSize: 12, fontWeight: 700, textTransform: "none" }}
          />
        )}
        <HButton label={intl.formatMessage({id: "label.collateral.close", defaultMessage: "Close"})}
          variant="outlined" 
          onClick={onClose}
          sx={{ minHeight: 36, borderRadius: 1, fontSize: 12, textTransform: "none", borderColor: "divider" }}
        />
      </HBox>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ListOfCollateral() {
  const intl = useIntl();
  const theme = useTheme();
  const toast = useToast();
  const { themeVars, text } = useDrsTheme();
  const { selectedRow } = useSelector((state) => state.account);

  const [collateralRows, setCollateralRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const [reason1Options, setReason1Options] = useState([]);
  const [reason2Options, setReason2Options] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  
  const location = useLocation();
  const screenMenuId =  location.state.menuId;
  
  const cardBorder   = alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.5 : 0.9);
  const viewLabel    = intl.formatMessage({ id: "label.ListOfCollateral.view", defaultMessage: "View" });
  const isDrawerOpen = Boolean(selectedCollateral);

  // Derive tab access from selected collateral's status
  const tabAccess = useMemo(
    () => selectedCollateral ? getTabAccess(selectedCollateral.status) : { Issue: false, Return: false, Release: false },
    [selectedCollateral]
  );

  const [formData, setFormData] = useState({
    dtIssueDate: null,
    szIssuedBy: "",
    szIssuedTo: "",
    szReason1: "",
    szRemark1: "",

    dtReturnedOn: null,
    szReturnedBy: "",
    szReturnedTo: "",
    szRemark2: "",

    dtReleasedOn: null,
    szReleasedTo: "",
    szRemark3: "",

    szStatus: ""
  });

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSaveCollateral = () => {
    if (!selectedCollateral) {
      return;
    }

    let requestBody = {
      lnCtlSeqNo: selectedCollateral.collateralSeqNo
    };

    switch (activeTab) {
      case "Issue":
        requestBody = {
          ...requestBody,
          dtIssueDate: formData.dtIssueDate,
          szIssuedBy: formData.szIssuedBy,
          szIssuedTo: formData.szIssuedTo,
          szReason1: formData.szReason1,
          szRemark1: formData.szRemark1,
          szStatus: formData.szStatus || getActionStatusForTab(activeTab),
        };
        break;

      case "Return":
        requestBody = {
          ...requestBody,
          dtReturnedOn: formData.dtReturnedOn,
          szReturnedBy: formData.szReturnedBy,
          szReturnedTo: formData.szReturnedTo,
          szRemark2: formData.szRemark2,
          szStatus: formData.szStatus || getActionStatusForTab(activeTab),
        };
        break;

      case "Release":
        requestBody = {
          ...requestBody,
          dtReleasedOn: formData.dtReleasedOn,
          szReleasedTo: formData.szReleasedTo,
          szReason1: formData.szReason1,
          szRemark3: formData.szRemark3,
          szStatus: formData.szStatus || getActionStatusForTab(activeTab),
        };
        break;

      default:
        return;
    }

    HAxiosService.POST(
      `${CollateralAPI.Collaterals(screenMenuId)}/updateCollateralAction`,
      requestBody
    )
      .then((res) => {
        if (res?.data?.status === "Success") {
          toast.success(
            res.data.message || intl.formatMessage({ id: "label.collateral.updateSuccess", defaultMessage: "Collateral updated successfully" })
          );

          closeDrawer();
          fetchCollateralList();
        } else {
          toast.error(
            res?.data?.message || intl.formatMessage({ id: "label.collateral.updateError", defaultMessage: "Unable to update collateral" })
          );
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(intl.formatMessage({ id: "label.collateral.updateError", defaultMessage: "Unable to update collateral" }));
      });
  };

  const fetchCollateralReasons = useCallback(() => {
  
    HAxiosService.GET(CollateralAPI.Collaterals(screenMenuId))
      .then((res) => {
        if (res?.data?.status === "Success") {
          const responseData = res.data.responseJson || res.data.responsejson || {};

          // ── Reasons — use szDesc directly (no i18n key, plain text from DB)
          setReason1Options(
            (responseData.collateralReason1 || []).map((item) => ({
              value: item.szCondition,
              label: item.szDesc,
            }))
          );
          setReason2Options(
            (responseData.collateralReason2 || []).map((item) => ({
              value: item.szCondition,
              label: item.szDesc,
            }))
          );

          // ── Status & Level — still use mapSystemParamOptions (resolves szi18nDesc via intl)
          setStatusOptions(
            mapSystemParamOptions(responseData.collateralStatus, intl)
          );

        } else {
          setReason1Options([]);
          setReason2Options([]);
          setStatusOptions([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching collateral reasons", err);
      });
  }, [intl]);

  const fetchCollateralList = useCallback(() => {
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");
    setSelectedCollateral(null);
    setActiveTab("Details");

    HAxiosService.GET(`${CollateralAPI.Collaterals(screenMenuId)}/fetchCollateralList`)
      .then((res) => {
        if (res.data.status === "Success") {
          const rows = extractCollateralRows(res.data).map((item, index) => mapCollateralRow(item, index));
          setCollateralRows(rows);
          if (rows.length === 0) {
            setInfoMessage(intl.formatMessage({ id: "label.ListOfCollateral.info.noRows", defaultMessage: "No collateral details found." }));
          }
        } else if (res.data.status === "Failure" && res.data.message === "Validation Failed") {
          handleValidationErrors(intl, toast, res.data.responseJson);
        } else {
          setCollateralRows([]);
          setInfoMessage(intl.formatMessage({ id: "label.ListOfCollateral.info.noRows", defaultMessage: "No collateral details found." }));
        }
      })
      .catch(() => {
        setCollateralRows([]);
        setErrorMessage(intl.formatMessage({ id: "label.ListOfCollateral.error.generic", defaultMessage: "Unable to fetch collateral details." }));
      })
      .finally(() => setLoading(false));
  }, [selectedRow, intl, toast]);

  useEffect(() => { fetchCollateralList(); }, [fetchCollateralList]);
  useEffect(() => {
    if (isDrawerOpen) {
      fetchCollateralReasons();
    }
  }, [isDrawerOpen, fetchCollateralReasons]);

  useEffect(() => {
    const actionStatus = getActionStatusForTab(activeTab);
    if (!actionStatus) return;

    setFormData((prev) => ({
      ...prev,
      szStatus: actionStatus,
      szReason1: "",
    }));
  }, [activeTab]);

  const closeDrawer          = useCallback(() => { setSelectedCollateral(null); setActiveTab("Details"); }, []);
  const openCollateralDrawer = useCallback((row) => {
    setSelectedCollateral(row);
    setActiveTab("Details");
    setFormData({
      dtIssueDate: null,
      szIssuedBy: "",
      szIssuedTo: "",
      szReason1: "",
      szRemark1: "",

      dtReturnedOn: null,
      szReturnedBy: "",
      szReturnedTo: "",
      szRemark2: "",

      dtReleasedOn: null,
      szReleasedTo: "",
      szRemark3: "",

      szStatus: ""
    });
  }, [intl]);
  const gridStyle            = useMemo(() => ({ width: "100%", height: "318px" }), []);

  const issueReasonOptions = useMemo(() => {
    return reason1Options;
  }, [reason1Options]);

  const releaseReasonOptions = useMemo(() => {
    return reason2Options;
  }, [reason2Options]);

  const issueStatusOptions = useMemo(() => {
    return filterOptionsByValue(statusOptions, COLLATERAL_STATUS.ISSUED);
  }, [statusOptions]);

  const returnStatusOptions = useMemo(() => {
    return filterOptionsByValue(statusOptions, COLLATERAL_STATUS.RETURNED);
  }, [statusOptions]);

  const releaseStatusOptions = useMemo(() => {
    return filterOptionsByValue(statusOptions, COLLATERAL_STATUS.RELEASED);
  }, [statusOptions]);

  const columnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.srNo", defaultMessage: "Sr." }),
      field: "srNo", width: 72, filter: false, sortable: false,
      cellStyle: { fontSize: 12 },
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.collateralType", defaultMessage: "Collateral Type" }),
      field: "collateralType", flex: 1.15, minWidth: 160, filter: false, sortable: false,
      cellStyle: { fontSize: 12, fontWeight: 600 },
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.docId", defaultMessage: "Doc ID" }),
      field: "docId", flex: 0.95, minWidth: 150, filter: false, sortable: false,
      cellStyle: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12 },
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.description", defaultMessage: "Description" }),
      field: "description", flex: 1.4, minWidth: 190, filter: false, sortable: false,
      cellStyle: { fontSize: 12 },
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.level", defaultMessage: "Level" }),
      field: "level", flex: 0.85, minWidth: 120, filter: false, sortable: false,
      cellRenderer: (params) => (
        <Chip label={params.value || "-"} size="small" variant="outlined"
          sx={{ ...chipBaseSx(), bgcolor: "background.paper", borderColor: alpha(theme.palette.text.secondary, 0.22), color: "text.primary" }}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.status", defaultMessage: "Status" }),
      field: "status", flex: 0.8, minWidth: 120, filter: false, sortable: false,
      cellRenderer: (params) => (
        <Chip label={params.value || "-"} size="small" variant="outlined"
          sx={{ ...chipBaseSx(), ...statusChipSx(theme, params.value) }}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "label.ListOfCollateral.statusDate", defaultMessage: "Status Date" }),
      field: "statusDate", flex: 0.85, minWidth: 130, type: "date", filter: false, sortable: false,
      cellStyle: { fontSize: 12 },
    },
    {
      headerName: viewLabel, field: "view", width: 82, filter: false, sortable: false,
      cellRenderer: (params) => (
        <Tooltip title={viewLabel}>
          <IconButton size="small" aria-label={viewLabel}
            onClick={(e) => { e.stopPropagation(); openCollateralDrawer(params.data); }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ], [intl, openCollateralDrawer, theme, viewLabel]);

  const title = selectedCollateral
    ? `${selectedCollateral.collateralType} - ${selectedCollateral.docId}`
    : intl.formatMessage({ id: "label.ListOfCollateral.title", defaultMessage: "List of Collateral" });

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.ListOfCollateral.title", defaultMessage: "List of Collateral" })}
      breadcrumbMid={intl.formatMessage({ id: "Assets", defaultMessage: "Assets" })}
      contentPaddingTop={2}
    >
      <HBox sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "background.paper", border: "1px solid", borderColor: cardBorder, boxShadow: "none" }}>
        <HBox sx={{ px: 2, py: 1.5 }}>
          <HLabel value={intl.formatMessage({ id: "label.ListOfCollateral.collateralInventory", defaultMessage: "Collateral Inventory" })}
            translate={false} align="left" colon={false} sx={{ fontSize: 12, fontWeight: 700, color: "text.primary" }} />
        </HBox>
        <HBox sx={{ px: 0 }}>
          {loading && (
            <HBox loading
              loadingText={intl.formatMessage({ id: "label.ListOfCollateral.loading", defaultMessage: "Loading collateral details" })}
              loaderSx={{ minHeight: 220 }} sx={{ minHeight: 220, background: "transparent" }} />
          )}
          {!loading && errorMessage && (
            <Alert severity="error" sx={{ m: 2, borderRadius: 1 }}>{errorMessage}</Alert>
          )}
          {!loading && !errorMessage && infoMessage && (
            <HLabel value={infoMessage} translate={false} colon={false} align="center" sx={{ py: 3, fontSize: 13 }} />
          )}
          {!loading && !errorMessage && !infoMessage && (
            <HAgGrid 
              rowData={collateralRows}
              columnDefs={columnDefs}
              gridStyle={gridStyle}
              pagination
              paginationPageSize={5}
              sort={false}
              allowUpdate={false}
              allowAdd={false}
              allowDelete={false}
              hideInternalSaveButton
              showTitle={false}
              embeddedInSection
            />
          )}
        </HBox>
      </HBox>

      <HDrawer anchor="right" open={isDrawerOpen} onClose={closeDrawer} slotProps={{ paper: { sx: { width: { xs: "100vw", sm: 508 }, p: 3, bgcolor: "background.paper", boxShadow: "-10px 0 30px rgba(15, 23, 42, 0.18)" } } }}>
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, background: "transparent" }}>
          <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, background: "transparent" }}>
            <HLabel value={title} translate={false} align="left" colon={false}
              sx={{ flex: 1, fontSize: 16, fontWeight: 700, color: "text.primary" }} />
            <IconButton size="small" aria-label="Close" onClick={closeDrawer}>
              <CloseOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </HBox>

          {/* ── Tabs ── */}
          <HBox sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, p: 0.4, borderRadius: 1, bgcolor: "action.hover" }}>
            {DRAWER_TABS.map((tab) => {
              const isActionTab = ["Issue", "Return", "Release"].includes(tab.key);
              const isDisabled  = isActionTab && !tabAccess[tab.key];
              const tabLabel = intl.formatMessage({ id: tab.labelId, defaultMessage: tab.defaultLabel });

              return (
                <HButton
                  key={tab.key}
                  label={tabLabel}
                  variant="text"
                  fullWidth
                  disabled={isDisabled}
                  onClick={() => !isDisabled && setActiveTab(tab.key)}
                  sx={{
                    minHeight: 30,
                    borderRadius: 0.8,
                    fontSize: 12,
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    textTransform: "none",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    color: isDisabled
                      ? theme.palette.text.disabled
                      : activeTab === tab.key
                        ? text.inverse
                        : "var(--drs-button-outline-text, inherit)",
                    bgcolor: activeTab === tab.key ? "var(--drs-control-hover-border, currentColor)" : "var(--drs-button-outline-bg, transparent)",
                    boxShadow: activeTab === tab.key ? "0 1px 4px rgba(15, 23, 42, 0.08)" : "none",
                    "&:hover": {
                      bgcolor: isDisabled
                        ? "transparent"
                        : activeTab === tab.key
                          ? "var(--drs-control-hover-border, currentColor)"
                          : "var(--drs-button-outline-hover, transparent)",
                    },
                  }}
                />
              );
            })}
          </HBox>

          {/* ── Details Tab ── */}
          {activeTab === "Details" && selectedCollateral && (
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, background: "transparent" }}>
              <HBox sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5, background: "transparent" }}>
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.collateralType", defaultMessage: "Collateral Type" })} value={selectedCollateral.collateralType} />
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.collateralSeqNo", defaultMessage: "Collateral Seq No" })} value={selectedCollateral.collateralSeqNo} />
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.docId", defaultMessage: "Doc ID" })} value={selectedCollateral.docId} />
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.level", defaultMessage: "Level" })} value={selectedCollateral.level} />
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.status", defaultMessage: "Status" })} value={selectedCollateral.status} />
                <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.description", defaultMessage: "Description" })} value={selectedCollateral.description} />
              </HBox>
              <CollateralDrawerField label={intl.formatMessage({ id: "label.ListOfCollateral.addinfo", defaultMessage: "Additional Info" })} value={selectedCollateral.additionalInfo} />
              <DrawerActions onClose={closeDrawer} showSave={false} />
            </HBox>
          )}

          {/* ── Issue Tab ── */}
          {activeTab === "Issue" && (
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.6, background: "transparent" }}>
              <FormField name="dtIssueDate" value={formData.dtIssueDate} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.issuedOn", defaultMessage: "Issued On" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.selectdate", defaultMessage: "Select Date" })} date />
              <FormField name="szIssuedBy" value={formData.szIssuedBy} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.issuedBy", defaultMessage: "Issued By" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.entername", defaultMessage: "Enter Name" })} />
              <FormField name="szIssuedTo" value={formData.szIssuedTo} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.issuedTo", defaultMessage: "Issued To" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.entername", defaultMessage: "Enter Name" })} />
              <FormField name="szReason1" value={formData.szReason1} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.reason", defaultMessage: "Reason" })}
                select options={issueReasonOptions} />
              <FormField name="szRemark1" value={formData.szRemark1} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.remarks", defaultMessage: "Remarks" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.enterremarks", defaultMessage: "Enter Remarks" })} multiline />
              <FormField name="szStatus" value={formData.szStatus || getActionStatusForTab(activeTab)} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.issue.status", defaultMessage: "Status" })}
                select options={issueStatusOptions} />
              <DrawerActions onClose={closeDrawer} onSave={handleSaveCollateral} />
            </HBox>
          )}

          {/* ── Return Tab ── */}
          {activeTab === "Return" && (
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.6, background: "transparent" }}>
              <FormField name="dtReturnedOn" value={formData.dtReturnedOn} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.return.returnedOn", defaultMessage: "Returned On" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.selectdate", defaultMessage: "Select Date" })} date />
              <FormField name="szReturnedBy" value={formData.szReturnedBy} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.return.returnedBy", defaultMessage: "Returned By" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.entername", defaultMessage: "Enter Name" })} />
              <FormField name="szReturnedTo" value={formData.szReturnedTo} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.return.returnedTo", defaultMessage: "Returned To" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.entername", defaultMessage: "Enter Name" })} />
              <FormField name="szRemark2" value={formData.szRemark2} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.return.remarks", defaultMessage: "Remarks" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.enterremarks", defaultMessage: "Enter Remarks" })} multiline />
              <FormField name="szStatus" value={formData.szStatus || getActionStatusForTab(activeTab)} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.return.status", defaultMessage: "Status" })}
                select options={returnStatusOptions} />
              <DrawerActions onClose={closeDrawer} onSave={handleSaveCollateral} />
            </HBox>
          )}

          {/* ── Release Tab ── */}
          {activeTab === "Release" && (
            <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.6, background: "transparent" }}>
              <FormField name="dtReleasedOn" value={formData.dtReleasedOn} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.release.releasedOn", defaultMessage: "Released On" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.selectdate", defaultMessage: "Select Date" })} date />
              <FormField name="szReleasedTo" value={formData.szReleasedTo} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.release.releasedTo", defaultMessage: "Released To" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.entername", defaultMessage: "Enter Name" })} />
              <FormField name="szReason1" value={formData.szReason1} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.release.reason", defaultMessage: "Reason" })}
                select options={releaseReasonOptions} />
              <FormField name="szRemark3" value={formData.szRemark3} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.release.remarks", defaultMessage: "Remarks" })}
                placeholder={intl.formatMessage({ id: "label.placeholder.enterremarks", defaultMessage: "Enter Remarks" })} multiline />
              <FormField name="szStatus" value={formData.szStatus || getActionStatusForTab(activeTab)} onChange={handleFieldChange}
                label={intl.formatMessage({ id: "label.ListOfCollateral.release.status", defaultMessage: "Status" })}
                select options={releaseStatusOptions} />
              <DrawerActions onClose={closeDrawer} onSave={handleSaveCollateral} />
            </HBox>
          )}
        </HBox>
      </HDrawer>
    </FunctionLayout>
  );
}
