import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  DialogTitle,
  DialogContent,
  Fade,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import {
  HAxiosService,
  HBox,
  HLabel,
  HButton,
  HTextField,
  HDatePicker,
  HDropdown,
  HDialog,
  TitleBar,
  HBreadCrumb,
  useToast,
} from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";
import { getApiMsg, getApiMsgFromBlob } from "./apiResponse";
import * as XLSX from "xlsx";
import jspreadsheet from "jspreadsheet-ce";
import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";

const DEFAULT_VIEWER_SIZE = { width: 960, height: 640 };

const REPORT_TYPES = [
  {
    id: "user-details",
    label: "User details report",
    description: "User info, roles, status & login state",
    icon: <PersonOutlineIcon sx={{ fontSize: 16 }} />,
    fields: ["userName", "email", "fromDate", "toDate", "roles", "userAttribute", "userStatus", "loggedOn"],
  },
  {
    id: "password-change",
    label: "Password change report",
    description: "Who changed which password and when",
    icon: <LockOutlinedIcon sx={{ fontSize: 16 }} />,
    fields: ["userName", "fromDate", "toDate"],
  },
  {
    id: "login",
    label: "Login report",
    description: "Login, logout & failed login events",
    icon: <LoginIcon sx={{ fontSize: 16 }} />,
    fields: ["userName", "fromDate", "toDate"],
  },
];

const FILTER_FIELDS = {
  userName: { label: "Username", type: "text", placeholder: "e.g. john.doe" },
  email: { label: "Email", type: "text", placeholder: "e.g. user@company.com" },
  fromDate: { label: "From date", type: "date" },
  toDate: { label: "To date", type: "date" },
  roles: { label: "Role", type: "text", placeholder: "e.g. Collector-admin" },
  userAttribute: { label: "User attribute value", type: "text", placeholder: "e.g. Finance" },
  userStatus: {
    label: "Status",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "Enabled", label: "Enabled" },
      { value: "Disabled", label: "Disabled" },
    ],
  },
  loggedOn: {
    label: "Currently logged in",
    type: "select",
    options: [
      { value: "", label: "All" },
      { value: "Y", label: "Yes" },
      { value: "N", label: "No" },
    ],
  },
};

const EMPTY_FILTERS = {
  userName: "",
  email: "",
  fromDate: "",
  toDate: "",
  roles: "",
  userAttribute: "",
  userStatus: "",
  loggedOn: "",
  exportType: "EXCEL",
};

const EXPORT_OPTIONS = [
  { value: "EXCEL", label: "Excel (.xlsx)" },
  { value: "PDF", label: "PDF (.pdf)" },
];

const REPORT_URL_MAP = {
  "user-details": () => UserManagementAPI.user_filter_reports(),
  "password-change": () => UserManagementAPI.password_change_report(),
  login: () => UserManagementAPI.login_report(),
};

const FL = ({ label }) => {
  const theme = useTheme();
  return (
    <HLabel
      value={label}
      translate={false}
      colon={false}
      align="left"
      sx={{
        fontFamily: "'Inter',sans-serif",
        fontWeight: 700,
        fontSize: 10.5,
        color: theme.palette.text.secondary,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        mb: 0.4,
      }}
    />
  );
};

const SectionHeading = ({ icon, label }) => {
  const theme = useTheme();
  return (
    <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      <HBox
        sx={{
          width: 26,
          height: 26,
          borderRadius: "7px",
          background: alpha(theme.palette.primary.main, 0.12),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 14 } })}
      </HBox>
      <HLabel
        value={label}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontFamily: "'Inter',sans-serif",
          fontWeight: 700,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      />
      <HBox sx={{ flex: 1, height: "1px", background: alpha(theme.palette.primary.main, 0.2) }} />
    </HBox>
  );
};

const NavItem = ({ icon, label, active, onClick }) => {
  const theme = useTheme();
  return (
    <HBox
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        px: 2,
        py: 1,
        mx: 1,
        mb: 0.5,
        borderRadius: "10px",
        cursor: "pointer",
        background: active ? alpha(theme.palette.primary.main, 0.16) : "transparent",
        borderLeft: active ? `3px solid ${theme.palette.common.white}` : "3px solid transparent",
        transition: "all 0.18s",
      }}
    >
      <HBox sx={{ display: "flex", alignItems: "center" }}>{icon}</HBox>
      <HLabel
        value={label}
        translate={false}
        colon={false}
        align="left"
        sx={{
          fontFamily: "'Inter',sans-serif",
          fontWeight: active ? 700 : 500,
          fontSize: 12.5,
        }}
      />
      {active && (
        <HBox
          sx={{
            ml: "auto",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: theme.palette.common.white,
          }}
        />
      )}
    </HBox>
  );
};

function getActiveFilters(filters, fields) {
  return fields
    .filter((f) => filters[f] && filters[f] !== "")
    .map((f) => ({ key: f, label: `${FILTER_FIELDS[f]?.label ?? f}: ${filters[f]}` }));
}

function buildParams(filters, fields) {
  const params = {};
  fields.forEach((f) => {
    const raw = filters[f];
    const val = typeof raw === "string" ? raw.trim() : raw;
    if (val) params[f] = val;
  });
  if (filters.exportType) params.exportType = filters.exportType;
  return params;
}

function normalizeDateValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.format === "function") return value.format("YYYY-MM-DD");
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function getDatePickerValue(value) {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

function safeDestroyJspreadsheet(instanceRef) {
  const val = instanceRef.current;
  if (!val) return;
  try {
    const inst = Array.isArray(val) ? val[0] : val;
    if (inst && typeof inst.destroy === "function") inst.destroy();
  } catch (e) {
    console.warn("jspreadsheet destroy failed harmlessly:", e);
  } finally {
    instanceRef.current = null;
  }
}

async function isJsonErrorBlob(blob) {
  if (!(blob instanceof Blob)) return false;
  if (blob.type && blob.type.includes("application/json")) return true;
  if (blob.size > 0 && blob.size < 4096) {
    try {
      const text = await blob.slice(0, 64).text();
      return text.trim().startsWith("{") || text.trim().startsWith("[");
    } catch {
      return false;
    }
  }
  return false;
}

class ViewerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Viewer crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: "12px", color: "var(--drs-color-accent)" }}>
            Couldn't render the preview. The file may not be in the expected format.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default function Reports() {
  const toast = useToast();
  const theme = useTheme();
  const palette = theme.palette;
  const intl = useIntl();

  const [selectedReportId, setSelectedReportId] = useState(REPORT_TYPES[0].id);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [downloadState, setDownloadState] = useState("idle");
  const [viewState, setViewState] = useState("idle");

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerType, setViewerType] = useState(null);
  const [viewerPdfUrl, setViewerPdfUrl] = useState(null);
  const [viewerExcelData, setViewerExcelData] = useState(null);
  const [viewerMaximized, setViewerMaximized] = useState(true);
  const [viewerReady, setViewerReady] = useState(false);
  const [pdfFrameReady, setPdfFrameReady] = useState(false);
  const [pdfFrameError, setPdfFrameError] = useState(false);

  const excelContainerRef = useRef(null);
  const jspreadsheetInstance = useRef(null);

  const selectedReport = useMemo(
    () => REPORT_TYPES.find((r) => r.id === selectedReportId) || REPORT_TYPES[0],
    [selectedReportId],
  );

  const closeViewer = () => {
    if (viewerPdfUrl) URL.revokeObjectURL(viewerPdfUrl);
    safeDestroyJspreadsheet(jspreadsheetInstance);
    setViewerOpen(false);
    setViewerReady(false);
    setViewerType(null);
    setViewerPdfUrl(null);
    setViewerExcelData(null);
    setViewerMaximized(true);
    setPdfFrameReady(false);
    setPdfFrameError(false);
  };

  const handleReportSelect = (reportId) => {
    setSelectedReportId(reportId || REPORT_TYPES[0].id);
    setFilters(EMPTY_FILTERS);
    setDownloadState("idle");
    closeViewer();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ ...EMPTY_FILTERS, exportType: filters.exportType });
  };

  const fetchReportBlob = async () => {
    if (!selectedReport) {
      toast.error("Please select a report type");
      return null;
    }

    const params = buildParams(filters, selectedReport.fields);
    if (selectedReport.id === "user-details") {
      params.page = 0;
      params.size = 10000;
    }

    const urlFactory = REPORT_URL_MAP[selectedReport.id];
    if (!urlFactory) {
      toast.error("Unknown report type");
      return null;
    }

    const fallback = "Failed to fetch report. Please try again.";

    try {
      const response = await HAxiosService.GET(urlFactory(), {
        responseType: "blob",
        params,
      });

      if (!response || !response.data || response.data.size === 0) {
        toast.error(fallback);
        return null;
      }

      const blob =
        response.data instanceof Blob ? response.data : new Blob([response.data]);

      if (response.status >= 400 || (await isJsonErrorBlob(blob))) {
        toast.error(await getApiMsgFromBlob(blob, fallback));
        return null;
      }

      return blob;
    } catch (error) {
      console.error("Report fetch error:", error);
      const errData = error?.response?.data;
      if (errData instanceof Blob) {
        toast.error(await getApiMsgFromBlob(errData, fallback));
      } else {
        toast.error(getApiMsg(error?.response, fallback));
      }
      return null;
    }
  };

  const handleDownload = async () => {
    setDownloadState("loading");
    try {
      const blob = await fetchReportBlob();
      if (!blob) {
        setDownloadState("idle");
        return;
      }

      const ext = filters.exportType === "PDF" ? "pdf" : "xlsx";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      link.download = `${selectedReport.id}-report-${timestamp}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setDownloadState("done");
      toast.success(getApiMsg(null, "Report downloaded successfully"));
      setTimeout(() => setDownloadState("idle"), 2000);
    } catch (error) {
      console.error("Report download error:", error);
      toast.error(getApiMsg(error?.response, "Failed to download report. Please try again."));
      setDownloadState("idle");
    }
  };

  const handleView = async () => {
    setViewState("loading");
    closeViewer();
    try {
      const blob = await fetchReportBlob();
      if (!blob) {
        setViewState("idle");
        return;
      }

      if (filters.exportType === "PDF") {
        const pdfBlob =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });
        setViewerType("PDF");
        setViewerPdfUrl(URL.createObjectURL(pdfBlob));
        setPdfFrameReady(false);
        setPdfFrameError(false);
        setViewerMaximized(true);
        setViewerReady(false);
        setViewerOpen(true);
      } else {
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const rowsBySheet = {};
        workbook.SheetNames.forEach((name) => {
          rowsBySheet[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
            defval: "",
          });
        });
        setViewerMaximized(true);
        setViewerReady(false);
        setViewerType("EXCEL");
        setViewerExcelData({
          sheetNames: workbook.SheetNames,
          active: workbook.SheetNames[0],
          rowsBySheet,
        });
        setViewerOpen(true);
      }
      toast.success(getApiMsg(null, "Report loaded in viewer"));
    } catch (error) {
      console.error("Report view error:", error);
      toast.error(getApiMsg(error?.response, "Failed to load report in viewer."));
    } finally {
      setViewState("idle");
    }
  };

  useEffect(() => {
    if (!viewerReady || viewerType !== "EXCEL" || !viewerExcelData) return undefined;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const mountSpreadsheet = () => {
      if (cancelled || !excelContainerRef.current) return;
      safeDestroyJspreadsheet(jspreadsheetInstance);

      const rows = viewerExcelData.rowsBySheet[viewerExcelData.active] || [];
      const [header, ...bodyRows] = rows.length ? rows : [[]];
      const columns = (header || []).map((h) => {
        const label = String(h ?? "");
        const wideFields = ["User Id", "Roles", "Email", "Ip Address"];
        return { title: label, width: wideFields.includes(label) ? 220 : 140, wordWrap: true };
      });

      const container = excelContainerRef.current;
      container.innerHTML = "";
      const measured = container.clientHeight;
      const fallback = viewerMaximized
        ? Math.floor(window.innerHeight * 0.78)
        : DEFAULT_VIEWER_SIZE.height - 140;
      const tableHeight = Math.max(280, measured > 40 ? measured - 8 : fallback);

      jspreadsheetInstance.current = jspreadsheet(container, {
        worksheets: [
          {
            data: bodyRows.length ? bodyRows : [Array(columns.length || 1).fill("")],
            columns: columns.length ? columns : [{ title: "", width: 140 }],
            minDimensions: [Math.max(columns.length, 1), 10],
            tableOverflow: true,
            tableHeight: `${tableHeight}px`,
            editable: false,
            allowInsertRow: false,
            allowInsertColumn: false,
            allowDeleteRow: false,
            allowDeleteColumn: false,
          },
        ],
      });
    };

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(mountSpreadsheet);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      safeDestroyJspreadsheet(jspreadsheetInstance);
    };
  }, [viewerReady, viewerType, viewerExcelData, viewerMaximized]);

  const activeFilters = getActiveFilters(filters, selectedReport.fields);

  const dialogPaperSx = viewerMaximized
    ? {
        borderRadius: "16px",
        border: `1px solid ${alpha(palette.divider, 1)}`,
        boxShadow: `0 12px 30px ${alpha(palette.primary.main, 0.19)}`,
        overflow: "hidden",
        width: "96vw",
        height: "94vh",
        maxWidth: "96vw",
        maxHeight: "94vh",
        m: 1,
        display: "flex",
        flexDirection: "column",
      }
    : {
        borderRadius: "16px",
        border: `1px solid ${alpha(palette.divider, 1)}`,
        boxShadow: `0 12px 30px ${alpha(palette.primary.main, 0.19)}`,
        overflow: "hidden",
        width: DEFAULT_VIEWER_SIZE.width,
        height: DEFAULT_VIEWER_SIZE.height,
        maxWidth: "96vw",
        maxHeight: "94vh",
        m: 1,
        display: "flex",
        flexDirection: "column",
      };

  return (
    <>
      <Fade in timeout={500}>
        <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <HBox sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Breadcrumb + TitleBar — CreateUser pattern */}
            <HBox sx={{ flexShrink: 0, height: "8%" }}>
              <HBreadCrumb />
              <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                <AssessmentIcon sx={{ fontSize: 18, color: palette.text.secondary }} />
                <TitleBar
                  title={intl.formatMessage({
                    id: "label.reports.title",
                    defaultMessage: "Reports",
                  })}
                />
              </HBox>
            </HBox>

            {/* Body */}
            <HBox sx={{ flex: 1, display: "flex", overflow: "hidden", bgcolor: palette.primary.main }}>

              {/* Sidebar — report types */}
              <HBox
                sx={{
                  width: 210,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "2px 0 12px rgba(0,0,0,0.12)",
                }}
              >
                <HBox
                  sx={{
                    px: 2,
                    pb: 2,
                    mb: 0,
                    flexDirection: "column",
                    background: "var(--drs-button-outline-bg, transparent)",
                  }}
                >
                  <HLabel
                    value={intl.formatMessage({
                      id: "label.reports.sidebarTitle",
                      defaultMessage: "Report types",
                    })}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      lineHeight: 1.3,
                    }}
                  />
                  <HLabel
                    value={selectedReport.description}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: 11,
                    }}
                  />
                </HBox>

                <HBox
                  sx={{
                    flex: 1,
                    pt: 0,
                    flexDirection: "column",
                    background: "var(--drs-button-outline-bg, transparent)",
                  }}
                >
                  {REPORT_TYPES.map((r) => (
                    <NavItem
                      key={r.id}
                      icon={r.icon}
                      label={r.label}
                      active={selectedReportId === r.id}
                      onClick={() => handleReportSelect(r.id)}
                    />
                  ))}
                </HBox>
              </HBox>

              {/* Content area */}
              <HBox sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

                {/* Section title strip */}
                <HBox
                  sx={{
                    px: 3,
                    py: 1.2,
                    borderBottom: `1px solid ${alpha(palette.divider, 1)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                  }}
                >
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {React.cloneElement(selectedReport.icon, { sx: { fontSize: 17 } })}
                    <HLabel
                      value={selectedReport.label}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: 15,
                        color: palette.text.primary,
                      }}
                    />
                  </HBox>

                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HButton
                      variant="outlined"
                      size="small"
                      onClick={handleReset}
                      translate={false}
                      label={intl.formatMessage({
                        id: "label.reports.resetFilters",
                        defaultMessage: "Reset filters",
                      })}
                      sx={{
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        borderRadius: "7px",
                        textTransform: "none",
                        height: 30,
                        px: 2,
                      }}
                    />
                    <HButton
                      variant="outlined"
                      size="small"
                      onClick={handleView}
                      disabled={viewState === "loading"}
                      translate={false}
                      label={intl.formatMessage({
                        id: viewState === "loading" ? "label.reports.loading" : "label.reports.view",
                        defaultMessage: viewState === "loading" ? "Loading..." : "View report",
                      })}
                      startIcon={
                        viewState === "loading" ? (
                          <CircularProgress size={12} color="inherit" />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: 14 }} />
                        )
                      }
                      sx={{
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        borderRadius: "7px",
                        textTransform: "none",
                        height: 30,
                        px: 2,
                      }}
                    />
                    <HButton
                      variant="contained"
                      size="small"
                      onClick={handleDownload}
                      disabled={downloadState === "loading"}
                      translate={false}
                      label={intl.formatMessage({
                        id:
                          downloadState === "loading"
                            ? "label.reports.generating"
                            : downloadState === "done"
                              ? "label.reports.downloaded"
                              : "label.reports.download",
                        defaultMessage:
                          downloadState === "loading"
                            ? "Generating..."
                            : downloadState === "done"
                              ? "Downloaded!"
                              : "Download report",
                      })}
                      startIcon={
                        downloadState === "loading" ? (
                          <CircularProgress size={12} sx={{ color: "#fff" }} />
                        ) : downloadState === "done" ? (
                          <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                        ) : (
                          <DownloadIcon sx={{ fontSize: 14 }} />
                        )
                      }
                      sx={{
                        fontFamily: "'Inter',sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        borderRadius: "7px",
                        textTransform: "none",
                        height: 30,
                        px: 2,
                        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                        boxShadow: `0 3px 8px ${alpha(palette.primary.main, 0.35)}`,
                      }}
                    />
                  </HBox>
                </HBox>

                {/* Scrollable content */}
                <HBox sx={{ flex: 1, overflowY: "auto", px: 3, py: 2.5 }}>
                  <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <SectionHeading
                      icon={<FilterListIcon />}
                      label={intl.formatMessage({
                        id: "label.reports.filters",
                        defaultMessage: "Filters",
                      })}
                    />

                    <HBox
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2,minmax(0,1fr))",
                          md: "repeat(3,minmax(0,1fr))",
                        },
                        gap: 4,
                        alignItems: "start",
                      }}
                    >
                      <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <FL
                          label={intl.formatMessage({
                            id: "label.reports.exportFormat",
                            defaultMessage: "Export format",
                          })}
                        />
                        <HDropdown
                          options={EXPORT_OPTIONS}
                          value={filters.exportType}
                          onChange={(e) => handleFilterChange("exportType", e.target.value)}
                          width="100%"
                        />
                      </HBox>

                      {selectedReport.fields.map((fieldKey) => {
                        const cfg = FILTER_FIELDS[fieldKey];
                        if (!cfg) return null;
                        return (
                          <HBox key={fieldKey} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <FL label={cfg.label} />
                            {cfg.type === "select" ? (
                              <HDropdown
                                options={cfg.options}
                                value={filters[fieldKey]}
                                onChange={(e) => handleFilterChange(fieldKey, e.target.value)}
                                width="100%"
                              />
                            ) : cfg.type === "date" ? (
                              <HDatePicker
                                value={getDatePickerValue(filters[fieldKey])}
                                onChange={(value) => handleFilterChange(fieldKey, normalizeDateValue(value))}
                                width="100%"
                              />
                            ) : (
                              <HTextField
                                type={cfg.type}
                                value={filters[fieldKey]}
                                onChange={(e) => handleFilterChange(fieldKey, e.target.value)}
                                placeholder={cfg.placeholder || ""}
                                editable
                                fullWidth
                                size="small"
                                sx={{ width: "100%" }}
                                width="100%"
                              />
                            )}
                          </HBox>
                        );
                      })}
                    </HBox>

                    {activeFilters.length > 0 && (
                      <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mt: 1 }}>
                        <HLabel
                          value={intl.formatMessage({
                            id: "label.reports.activeFilters",
                            defaultMessage: "Active filters",
                          })}
                          translate={false}
                          colon={false}
                          align="left"
                          sx={{
                            fontFamily: "'Inter',sans-serif",
                            fontWeight: 700,
                            fontSize: 10.5,
                            color: palette.text.secondary,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            mr: 0.5,
                          }}
                        />
                        {activeFilters.map((f) => (
                          <Chip
                            key={f.key}
                            label={f.label}
                            size="small"
                            onDelete={() => handleFilterChange(f.key, "")}
                            sx={{
                              fontFamily: "'Inter',sans-serif",
                              fontSize: "11px",
                              height: 24,
                              fontWeight: 500,
                              background: alpha(palette.primary.main, 0.08),
                              border: `1px solid ${alpha(palette.primary.main, 0.2)}`,
                              color: palette.primary.main,
                            }}
                          />
                        ))}
                      </HBox>
                    )}
                  </HBox>
                </HBox>
              </HBox>
            </HBox>
          </HBox>
        </div>
      </Fade>

      <HDialog
        disableContentWrapper
        open={viewerOpen}
        onClose={closeViewer}
        maxWidth={false}
        slotProps={{
          paper: { sx: dialogPaperSx },
          transition: {
            onEntered: () => setViewerReady(true),
            onExit: () => setViewerReady(false),
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 16,
            color: palette.text.primary,
            borderBottom: `1px solid ${alpha(palette.divider, 1)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.25,
            px: 2,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon sx={{ fontSize: 18, color: palette.secondary.main }} />
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Report preview</Typography>
            {viewerType === "PDF" && (
              <PictureAsPdfIcon titleAccess="PDF" sx={{ fontSize: 18, color: palette.error.main }} />
            )}
            {viewerType === "EXCEL" && (
              <GridOnIcon titleAccess="Excel" sx={{ fontSize: 18, color: palette.secondary.main }} />
            )}
            <Typography sx={{ fontSize: 12, color: palette.text.secondary, ml: 0.5 }}>
              {selectedReport.label}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => {
                setViewerReady(false);
                setViewerMaximized((v) => !v);
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => setViewerReady(true));
                });
              }}
              title={viewerMaximized ? "Restore size" : "Maximize"}
              sx={{ color: palette.text.secondary }}
            >
              {viewerMaximized ? (
                <CloseFullscreenIcon sx={{ fontSize: 18 }} />
              ) : (
                <OpenInFullIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
            <IconButton size="small" onClick={closeViewer} sx={{ color: palette.text.secondary }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            p: "0 !important",
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ViewerErrorBoundary>
            {viewerType === "PDF" && viewerPdfUrl && (
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  minHeight: 0,
                  flex: 1,
                  overflow: "hidden",
                  background: "#525659",
                }}
              >
                {!pdfFrameReady && !pdfFrameError && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.25,
                      background: "rgba(82, 86, 89, 0.92)",
                    }}
                  >
                    <CircularProgress size={28} sx={{ color: "#fff" }} />
                    <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                      Loading PDF preview…
                    </Typography>
                  </Box>
                )}

                {pdfFrameError ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      px: 3,
                      textAlign: "center",
                      background: palette.background.paper,
                    }}
                  >
                    <PictureAsPdfIcon sx={{ fontSize: 40, color: palette.text.secondary, opacity: 0.7 }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: palette.text.primary }}>
                      Couldn&apos;t embed the PDF in this browser
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: palette.text.secondary, maxWidth: 420 }}>
                      Please use Download report to open the file.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    component="iframe"
                    src={`${viewerPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    title="report-pdf-viewer"
                    onLoad={() => setPdfFrameReady(true)}
                    onError={() => {
                      setPdfFrameReady(true);
                      setPdfFrameError(true);
                    }}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                      background: "#525659",
                    }}
                  />
                )}
              </Box>
            )}

            {viewerType === "EXCEL" && viewerExcelData && (
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", minHeight: 0 }}>
                {viewerExcelData.sheetNames.length > 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      px: 1.5,
                      pt: 1.5,
                      pb: 1,
                      borderBottom: `1px solid ${alpha(palette.divider, 1)}`,
                      flexWrap: "wrap",
                      flexShrink: 0,
                    }}
                  >
                    {viewerExcelData.sheetNames.map((name) => (
                      <Chip
                        key={name}
                        label={name}
                        size="small"
                        onClick={() => setViewerExcelData((prev) => ({ ...prev, active: name }))}
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          background:
                            viewerExcelData.active === name
                              ? alpha(palette.primary.main, 0.12)
                              : "transparent",
                          color:
                            viewerExcelData.active === name
                              ? palette.primary.main
                              : palette.text.secondary,
                        }}
                      />
                    ))}
                  </Box>
                )}
                <Box
                  ref={excelContainerRef}
                  sx={{
                    p: 1,
                    flex: 1,
                    height: "100%",
                    minHeight: 280,
                    overflow: "auto",
                    "& .jexcel td, & .jexcel th": {
                      fontSize: "12px !important",
                      padding: "4px 8px !important",
                    },
                  }}
                />
              </Box>
            )}
          </ViewerErrorBoundary>
        </DialogContent>
      </HDialog>
    </>
  );
}
