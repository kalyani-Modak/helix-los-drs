import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  MenuItem,
  Divider,
  CircularProgress,
  LinearProgress,
  Backdrop,
  InputAdornment,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useIntl } from "react-intl";
import { utilityAPI } from "./apiEndpoints";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HBox, HButton, HLabel, HPaper, HTextField, HDropdown, HToggle, HTextarea, HAgGrid, TitleBar, HBreadCrumb, HAxiosService, useToast, HDialog } from "@helix/component-library";
import { idmLayoutColors, idmFontFamily } from "./userScreenTokens";

function parseFilenameFromContentDisposition(header, fallback) {
  if (!header) return fallback;
  const utf8 = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      /* use ascii fallback */
    }
  }
  const ascii = /filename\s*=\s*("?)([^";\n]+)\1/i.exec(header);
  if (ascii?.[2]) return ascii[2].trim();
  return fallback;
}

function rowIsTextMedia(row) {
  const v = (row.isTextMedia ?? "N").toString().trim().toUpperCase();
  return v === "Y";
}

function showEmailBodyPreviewButton(row) {
  const ch = (row.channel || "").trim().toUpperCase();
  const ty = (row.templateType || "").trim().toLowerCase();
  return ch === "EMAIL" && ty === "body" && !rowIsTextMedia(row);
}

function defaultEmailPreviewPayloadJson(templateId) {
  return JSON.stringify(
    {
      to: "madhav.kushwaha@ebixcash.com",
      subject: "Test",
      body: {
        templateId,
        data: {
          name: "Madhav",
          bankname: "IDFC",
          items: [
            { accountno: "23423423", osamount: "43534", odamount: "534", bucketcode: "CODE54" },
            { accountno: "3423423", osamount: "3443", odamount: "2342", bucketcode: "CDF45" },
          ],
        },
      },
    },
    null,
    2
  );
}

function getSelectableTemplateTypes(channel, allTypes, channelTemplateTypes) {
  const ch = (channel || "").trim().toUpperCase();
  const perChannel = ch && channelTemplateTypes?.[ch];
  return perChannel && perChannel.length > 0 ? perChannel : allTypes;
}

const dialogPaperProps = {
  sx: {
    borderRadius: "16px",
    boxShadow: `0 12px 30px ${idmLayoutColors.primary}20`,
  },
};

export default function TemplatesList() {
  const toast = useToast();
  const navigate = useNavigate();
  const listLocation = useLocation();
  const intl = useIntl();
  const theme = useTheme();

  const [templates, setTemplates] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [channels, setChannels] = useState([]);
  const [channelTemplateTypes, setChannelTemplateTypes] = useState({});
  const [channel, setChannel] = useState("");

  const [templateTypes, setTemplateTypes] = useState([]);
  const [templateType, setTemplateType] = useState("");
  const [filterType, setFilterType] = useState("");

  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterChannel, setFilterChannel] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serverTotalElements, setServerTotalElements] = useState(0);

  const [templateName, setTemplateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [textMediaSwitchingId, setTextMediaSwitchingId] = useState(null);
  const [isTextMediaCU, setIsTextMediaCU] = useState("N");
  const [confirmSwitch, setConfirmSwitch] = useState(null);

  const [emailPreviewDialogRow, setEmailPreviewDialogRow] = useState(null);
  const [emailPreviewJson, setEmailPreviewJson] = useState("");
  const [emailPreviewPrimaryName, setEmailPreviewPrimaryName] = useState("");
  const [emailPreviewBusy, setEmailPreviewBusy] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(id);
  }, [search]);

  useLayoutEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const reloadTemplates = useCallback(async () => {
    try {
      const res = await HAxiosService.GET(
        utilityAPI.templatesPage({
          page,
          size: rowsPerPage,
          moduleId: filterModule,
          channel: filterChannel,
          templateType: filterType,
          q: debouncedSearch,
        })
      );
      if ((res.data.status || "").toLowerCase() === "success" && res.data.data) {
        setTemplates(res.data.data.content || []);
        setServerTotalElements(res.data.data.totalElements ?? 0);
      } else {
        toast.error(res.data.message || "Failed to fetch templates");
      }
    } catch {
      toast.error("Failed to fetch templates");
    }
  }, [page, rowsPerPage, debouncedSearch, filterModule, filterChannel, filterType, toast]);

  const listTotalCount = serverTotalElements;

  const fetchConfig = async () => {
    try {
      const res = await HAxiosService.GET(utilityAPI.getChannelsModulesAndTypes());
      if ((res.data.status || "").toLowerCase() === "success") {
        const data = res.data.data;
        setChannels(data.channels || []);
        setModules(data.modules || []);
        setTemplateTypes(data.templateTypes || []);
        setChannelTemplateTypes(data.channelTemplateTypes || {});

        const firstCh = data.channels?.[0] || "";
        setChannel(firstCh);
        setModuleId(data.modules?.[0]?.moduleId || "");
        const types = data.templateTypes || [];
        setTemplateType(
          getSelectableTemplateTypes(firstCh, types, data.channelTemplateTypes || {})[0] ?? types[0] ?? ""
        );
      } else {
        toast.error(res.data.message || "Failed to load configuration");
      }
    } catch {
      toast.error("Failed to load configuration");
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await HAxiosService.GET(
          utilityAPI.templatesPage({
            page,
            size: rowsPerPage,
            moduleId: filterModule,
            channel: filterChannel,
            templateType: filterType,
            q: debouncedSearch,
          })
        );
        if (cancelled) return;
        if ((res.data.status || "").toLowerCase() === "success" && res.data.data) {
          setTemplates(res.data.data.content || []);
          setServerTotalElements(res.data.data.totalElements ?? 0);
        } else {
          toast.error(res.data.message || "Failed to fetch templates");
        }
      } catch {
        if (!cancelled) toast.error("Failed to fetch templates");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage, debouncedSearch, filterModule, filterChannel, filterType, toast]);

  const handleCreateTemplate = async () => {
    if (!templateName || !fileName || !channel || !moduleId || !templateType) {
      toast.warning("Please fill all fields");
      return;
    }

    const payload = {
      templateName,
      fileName,
      channel,
      moduleId,
      templateType,
      isTextMedia: isTextMediaCU,
    };

    try {
      const res = await HAxiosService.POST(
        utilityAPI.templates() + "/create",
        payload
      );

      if ((res.data.status || "").toLowerCase() === "success") {
        toast.success(res.data.message || "Template created successfully");

        setOpenCreateDialog(false);
        setTemplateName("");
        setFileName("");
        const ch = channels[0] || "";
        setChannel(ch);
        setTemplateType(getSelectableTemplateTypes(ch, templateTypes, channelTemplateTypes)[0] ?? "");
        const created = res.data.data;
        navigate(`/homelayout/editor?id=${encodeURIComponent(created.id)}`);
      } else {
        toast.error(res.data.message || "Create failed");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Create failed");
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await HAxiosService.DELETE(`${utilityAPI.templates()}/${id}`);
      if ((res.data.status || "").toLowerCase() === "success") {
        toast.success(res.data.message || "Template deleted");
        await reloadTemplates();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setConfirmDelete(null);
    }
  };

  const onDownload = async (id, fileName) => {
    try {
      const res = await HAxiosService.GET(`${utilityAPI.templates()}/download/${id}`, {
        responseType: "blob",
      });
      const cd = res.headers["content-disposition"];
      const name = parseFilenameFromContentDisposition(cd, fileName);
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Failed to download template");
    }
  };

  const submitEmailPreviewPrepare = async () => {
    if (!emailPreviewDialogRow) return;
    const primaryNameTrim = emailPreviewPrimaryName.trim();
    if (!primaryNameTrim) {
      toast.warning("Enter primary_Name (preview path / PDF name prefix)");
      return;
    }
    setEmailPreviewBusy(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(emailPreviewJson);
      } catch {
        toast.error("Invalid JSON");
        return;
      }
      const payload = {
        ...parsed,
        primary_Name: primaryNameTrim,
        returnPath: `${listLocation.pathname}${listLocation.search}`,
      };
      const res = await HAxiosService.POST(
        utilityAPI.templateEmailPreviewPrepare(),
        payload
      );
      if (!res?.data) {
        toast.error("No response from server");
        return;
      }
      const ok = (res.data.status || "").toLowerCase() === "success";
      if (ok && res.data.data?.redirectUrl) {
        window.location.assign(res.data.data.redirectUrl);
        return;
      }
      toast.error(res.data.message || "Validation failed");
    } catch {
      toast.error("Prepare preview failed");
    } finally {
      setEmailPreviewBusy(false);
    }
  };

  const confirmSwitchEditor = async () => {
    if (!confirmSwitch) return;

    const { row, next } = confirmSwitch;
    await handleTemplateTextMediaChange(row, next === "Y");
  };

  const handleTemplateTextMediaChange = async (row, checked) => {
    const next = checked ? "Y" : "N";
    if (rowIsTextMedia(row) === (next === "Y")) {
      return;
    }
    setTextMediaSwitchingId(row.id);
    try {
      const res = await HAxiosService.PUT(utilityAPI.templateTextMedia(row.id), {
        isTextMedia: next,
      });
      if ((res.data.status || "").toLowerCase() === "success") {
        toast.success(res.data.message || "Editor mode updated");
        setConfirmSwitch(null);
        navigate(`/homelayout/editor?id=${encodeURIComponent(row.id)}`);
      } else {
        toast.error(res.data.message || "Failed to update editor mode");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update editor mode");
    } finally {
      setTextMediaSwitchingId(null);
    }
  };

  const columnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.module", defaultMessage: "Module" }),
      field: "moduleId",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (params) => {
        return modules.find((m) => m.moduleId === params.data?.moduleId)?.moduleName || params.data?.moduleId || "";
      }
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.channel", defaultMessage: "Channel" }),
      field: "channel",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.templateName", defaultMessage: "Template Name" }),
      field: "templateName",
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.templateType", defaultMessage: "Template Type" }),
      field: "templateType",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.switchEditor", defaultMessage: "Switch editor" }),
      field: "switchEditor",
      flex: 1.2,
      minWidth: 120,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: (params) => {
        const t = params.data;
        if (!t) return null;
        return (
          <Tooltip
            title={
              rowIsTextMedia(t)
                ? intl.formatMessage({ id: "utility.templatesList.tooltip.plainTextEditor", defaultMessage: "Plain text editor — turn off to use OnlyOffice (DOCX)" })
                : intl.formatMessage({ id: "utility.templatesList.tooltip.onlyOfficeEditor", defaultMessage: "OnlyOffice (DOCX) — turn on for plain text editor" })
            }
          >
            <HBox component="span" sx={{ display: "inline-flex", verticalAlign: "middle", background: "transparent" }}>
              <HToggle
                size="small"
                checked={rowIsTextMedia(t)}
                disabled={textMediaSwitchingId === t.id}
                onChange={(e) => {
                  setConfirmSwitch({
                    row: t,
                    next: e.target.checked ? "Y" : "N",
                  });
                }}
              />
            </HBox>
          </Tooltip>
        );
      }
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.version", defaultMessage: "Version" }),
      field: "version",
      flex: 0.8,
      minWidth: 80,
      valueFormatter: (params) => {
        return params.value != null && params.value !== "" ? String(params.value) : "—";
      }
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.actions", defaultMessage: "Actions" }),
      field: "actions",
      flex: 2,
      minWidth: 180,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: (params) => {
        const t = params.data;
        if (!t) return null;
        return (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ height: "100%" }}>
            {showEmailBodyPreviewButton(t) ? (
              <Tooltip title={intl.formatMessage({ id: "utility.templatesList.tooltip.preview", defaultMessage: "Preview — validate JSON, then open editor" })}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEmailPreviewJson(defaultEmailPreviewPayloadJson(t.id));
                    setEmailPreviewPrimaryName("AccNoOrCustNo");
                    setEmailPreviewDialogRow(t);
                  }}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
            <Tooltip
              title={
                rowIsTextMedia(t)
                  ? intl.formatMessage({ id: "utility.templatesList.tooltip.downloadTxt", defaultMessage: "Download .txt" })
                  : intl.formatMessage({ id: "utility.templatesList.tooltip.downloadDocx", defaultMessage: "Download .docx" })
              }
            >
              <IconButton
                size="small"
                onClick={() => onDownload(t.id, t.fileName)}
                sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                rowIsTextMedia(t)
                  ? intl.formatMessage({ id: "utility.templatesList.tooltip.editText", defaultMessage: "Edit text template" })
                  : intl.formatMessage({ id: "utility.templatesList.tooltip.editOnlyOffice", defaultMessage: "Edit in OnlyOffice" })
              }
            >
              <IconButton
                component={Link}
                to={`/homelayout/editor?id=${encodeURIComponent(t.id)}`}
                size="small"
                sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={intl.formatMessage({ id: "utility.templatesList.tooltip.delete", defaultMessage: "Delete" })}>
              <IconButton
                size="small"
                onClick={() => setConfirmDelete(t.id)}
                sx={{ color: idmLayoutColors.text.muted, "&:hover": { color: idmLayoutColors.accent, background: `${idmLayoutColors.accent}12` } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    },
    {
      headerName: intl.formatMessage({ id: "utility.templatesList.status", defaultMessage: "Status" }),
      field: "isPublish",
      flex: 1.5,
      minWidth: 140,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: (params) => {
        const t = params.data;
        if (!t) return null;
        return (
          <Tooltip title={intl.formatMessage({ id: "utility.templatesList.tooltip.statusInfo", defaultMessage: "Use the template editor to publish, save draft, or discard changes" })}>
            {t.isPublish === "Y" ? (
              <Chip
                icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
                label={intl.formatMessage({ id: "utility.templatesList.published", defaultMessage: "Published" })}
                size="small"
                sx={{
                  fontFamily: idmFontFamily,
                  fontSize: 11,
                  fontWeight: 600,
                  borderColor: "#86efac",
                  color: "#15803d",
                  backgroundColor: "#dcfce7",
                }}
                variant="outlined"
              />
            ) : (
              <Chip
                label={intl.formatMessage({ id: "utility.templatesList.unpublished", defaultMessage: "Unpublished" })}
                size="small"
                sx={{
                  fontFamily: idmFontFamily,
                  fontSize: 11,
                  fontWeight: 600,
                  borderColor: idmLayoutColors.border,
                  color: theme.palette.text.secondary,
                  backgroundColor: idmLayoutColors.hover,
                }}
                variant="outlined"
              />
            )}
          </Tooltip>
        );
      }
    }
  ], [intl, modules, textMediaSwitchingId, showEmailBodyPreviewButton]);

  return (
      <HBox
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          mt: 2
        }}
      >
            <HPaper
              elevation={2}
              sx={{
                borderRadius: "2px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <HBox
                sx={{
                  px: 3,
                  py: 1.5,
                  backgroundSize: "300% 300%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Breadcrumb + TitleBar */}
                <HBox sx={{ flexShrink: 0 }}>
                  <HBreadCrumb />
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
                    <HBox
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArticleOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.primary }} />
                    </HBox>
                    <TitleBar
                      title={intl.formatMessage({
                        id: "utility.templatesList.title",
                        defaultMessage: "Templates",
                      })}
                    />
                  </HBox>
                </HBox>
                {listTotalCount > 0 && (
                  <Chip
                    icon={<DescriptionIcon sx={{ fontSize: 18, ml: 0.5 }} />}
                    label={intl.formatMessage(
                      { id: "utility.templatesList.templatesCount", defaultMessage: "{count} {count, plural, one {Template} other {Templates}}" },
                      { count: listTotalCount }
                    )}
                    size="small"
                    sx={{
                      color: theme.palette.text.primary,
                      fontFamily: idmFontFamily,
                      fontWeight: 600,
                      fontSize: 12,
                      "& .MuiChip-icon": { color: theme.palette.text.primary },
                    }}
                  />
                )}
              </HBox>

              <HBox
                sx={{
                  px: 2.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderBottom: `1px solid ${idmLayoutColors.border}`,
                  flexWrap: "wrap",
                }}
              >
                <HTextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="utility.templatesList.searchPlaceholder"
                  translate={true}
                  editable={true}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearch("")}
                          sx={{ p: 0.2, color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
                        >
                          <ClearIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }}
                  sx={{
                    width: { xs: "100%", sm: 260 },
                    maxWidth: "100%",
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: 34,
                    }
                  }}
                />

                <HBox sx={{ width: "1px", height: 22, background: idmLayoutColors.border, flexShrink: 0, display: { xs: "none", sm: "block" } }} />

                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ flex: 1, minWidth: 0 }}>
                  <FilterListIcon sx={{ fontSize: 15, color: idmLayoutColors.text.muted, display: { xs: "none", md: "inline-flex" } }} />
                  
                  <HDropdown
                    options={[{ value: "", label: intl.formatMessage({ id: "utility.templatesList.filterAll", defaultMessage: "All" }) }, ...modules.map((m) => ({ value: m.moduleId, label: m.moduleName }))] }
                    value={filterModule}
                    onChange={(e) => {
                      setFilterModule(e.target.value);
                      setPage(0);
                    }}
                    name="filterModule"
                    placeholder={intl.formatMessage({ id: "utility.templatesList.module", defaultMessage: "Module" })}
                    width="180px"
                  />

                  <HDropdown
                    options={[{ value: "", label: intl.formatMessage({ id: "utility.templatesList.filterAll", defaultMessage: "All" }) }, ...channels.map((ch) => ({ value: ch, label: ch }))] }
                    value={filterChannel}
                    onChange={(e) => {
                      setFilterChannel(e.target.value);
                      setPage(0);
                    }}
                    name="filterChannel"
                    placeholder={intl.formatMessage({ id: "utility.templatesList.channel", defaultMessage: "Channel" })}
                    width="180px"
                  />

                  <HDropdown
                    options={[{ value: "", label: intl.formatMessage({ id: "utility.templatesList.filterAll", defaultMessage: "All" }) }, ...getSelectableTemplateTypes(filterChannel, templateTypes, channelTemplateTypes).map((t) => ({ value: t, label: t }))] }
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setPage(0);
                    }}
                    name="filterType"
                    placeholder={intl.formatMessage({ id: "utility.templatesList.templateType", defaultMessage: "Template Type" })}
                    width="180px"
                  />
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ ml: { xs: 0, md: "auto" } }}>
                  <HButton
                    variant="contained"
                    size="small"
                    startIcon={<NoteAddIcon sx={{ fontSize: "15px !important" }} />}
                    onClick={() => setOpenCreateDialog(true)}
                    label="utility.templatesList.createBtn"
                    sx={{
                      fontWeight: 600,
                      fontSize: 12.5,
                      borderRadius: "8px",
                      textTransform: "none",
                      height: 34,
                      px: 1.8,
                    }}
                  />

                  <Tooltip title={intl.formatMessage({ id: "utility.templatesList.testEmail", defaultMessage: "Test Email" })}>
                    <IconButton
                      component={Link}
                      to="/homelayout/testcomservice/EMAIL"
                      size="small"
                      sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
                    >
                      <MailIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={intl.formatMessage({ id: "utility.templatesList.testSms", defaultMessage: "Test SMS" })}>
                    <IconButton
                      component={Link}
                      to="/homelayout/testcomservice/SMS"
                      size="small"
                      sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
                    >
                      <SmsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={intl.formatMessage({ id: "utility.templatesList.testWhatsApp", defaultMessage: "Test WhatsApp" })}>
                    <IconButton
                      component={Link}
                      to="/homelayout/testcomservice/WHATSAPP"
                      size="small"
                      sx={{ color: theme.palette.text.secondary, "&:hover": { color: theme.palette.text.primary } }}
                    >
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </HBox>

              <HBox
                sx={{
                  flex: 1,
                  minHeight: 0,
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <HPaper
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "none",
                  }}
                >
                  {loading ? (
                    <HBox sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                      <CircularProgress sx={{ color: idmLayoutColors.primary }} />
                    </HBox>
                  ) : templates.length === 0 ? (
                    <HBox sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                      <HLabel
                        value={intl.formatMessage({ id: "utility.templatesList.noTemplates", defaultMessage: "No templates found." })}
                        translate={false}
                        colon={false}
                        sx={{ fontFamily: idmFontFamily, fontSize: 13, color: theme.palette.text.secondary }}
                      />
                    </HBox>
                  ) : (
                    <HBox sx={{ flex: 1, width: "100%", height: "100%", minHeight: 280 }}>
                      <HAgGrid
                        rowData={templates}
                        columnDefs={columnDefs}
                        pagination
                        paginationSize={10}
                        gridClassName="drs-list-grid"
                      />
                    </HBox>
                  )}

                </HPaper>
              </HBox>
            </HPaper>

        <HDialog disableContentWrapper
          open={Boolean(emailPreviewDialogRow)}
          onClose={(_, reason) => {
            if (emailPreviewBusy) return;
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
              setEmailPreviewDialogRow(null);
            }
          }}
          disableEscapeKeyDown={emailPreviewBusy}
          fullWidth
          maxWidth="md"
          scroll="paper"
          PaperProps={{
            sx: {
              ...dialogPaperProps.sx,
              position: "relative",
              overflow: "hidden",
            },
          }}
        >
          {emailPreviewBusy ? (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                height: 3,
                borderRadius: "16px 16px 0 0",
              }}
            />
          ) : null}
          <DialogTitle
            sx={{
              fontFamily: idmFontFamily,
              fontWeight: 700,
              fontSize: 16,
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              pr: 1,
              pt: 2,
              pb: 1.5,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <HBox
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 20, color: theme.palette.text.primary }} />
              </HBox>
              <HBox sx={{ minWidth: 0, flexDirection: 'column', background: "transparent" }}>
                <HLabel
                  value={intl.formatMessage({ id: 'utility.previewAndDocxEditor.title', defaultMessage: 'Email preview' })}
                  translate={false}
                  colon={false}
                  sx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, lineHeight: 1.3, color: theme.palette.text.primary }}
                />
                {emailPreviewDialogRow ? (
                  <HLabel
                    value={`${emailPreviewDialogRow.templateName}${emailPreviewDialogRow.channel ? ` · ${emailPreviewDialogRow.channel}` : ""}`}
                    translate={false}
                    colon={false}
                    align="left"
                    sx={{
                      fontFamily: idmFontFamily,
                      fontSize: 12,
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                      mt: 0.25,
                    }}
                    title={emailPreviewDialogRow.templateName}
                  />
                ) : null}
              </HBox>
            </Stack>
            <IconButton
              aria-label="Close preview dialog"
              onClick={() => setEmailPreviewDialogRow(null)}
              disabled={emailPreviewBusy}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.text.primary },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              borderColor: idmLayoutColors.border,
              pt: 2.5,
              position: "relative",
              minHeight: 320,
            }}
          >
            <Backdrop
              open={emailPreviewBusy}
              sx={{
                position: "absolute",
                zIndex: 3,
                borderRadius: 0,
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <CircularProgress size={44} thickness={4} sx={{ color: idmLayoutColors.primary }} />
              <HLabel
                value={intl.formatMessage({ id: "utility.templatesList.validatePayload", defaultMessage: "Validating payload…" })}
                translate={false}
                colon={false}
                sx={{
                  fontFamily: idmFontFamily,
                  fontSize: 14,
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                }}
              />
              <HLabel
                value={intl.formatMessage({ id: "utility.templatesList.validatePayloadSubtitle", defaultMessage: "Checking attributes against the database. You will be redirected when ready." })}
                translate={false}
                colon={false}
                sx={{ fontFamily: idmFontFamily, fontSize: 12, color: theme.palette.text.secondary, maxWidth: 280, textAlign: "center" }}
              />
            </Backdrop>

            <HTextField
              label={intl.formatMessage({ id: "utility.templatesList.primaryName", defaultMessage: "primary_Name" })}
              value={emailPreviewPrimaryName}
              onChange={(e) => setEmailPreviewPrimaryName(e.target.value)}
              placeholder="e.g. primary"
              fullWidth
              editable
              size="small"
              disabled={emailPreviewBusy}
              sx={{ mb: 2 }}
            />
            {/* <HTextarea
              label={intl.formatMessage({ id: "utility.templatesList.inputJson", defaultMessage: "Input JSON" })}
              value={emailPreviewJson}
              onChange={(e) => setEmailPreviewJson(e.target.value)}
              multiline
              minRows={14}
              fullWidth
              size="small"
              disabled={emailPreviewBusy}
              InputProps={{ sx: { fontFamily: "ui-monospace, monospace", fontSize: 12 } }}
            /> */}
            <HTextarea
              value={emailPreviewJson}
              onChange={(e) => setEmailPreviewJson(e.target.value)}
              placeholder={intl.formatMessage({ id: "utility.templatesList.inputJson", defaultMessage: "Input JSON" })}
              width="100%"
              maxLines={10}
              maxLength={250}
              disabled={emailPreviewBusy}
            />
          </DialogContent>
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              gap: 1,
              borderTop: `1px ${idmLayoutColors.border}`,
              justifyContent: "flex-end",
            }}
          >
            <HButton
              onClick={() => setEmailPreviewDialogRow(null)}
              disabled={emailPreviewBusy}
              variant="outlined"
              label="utility.templatesList.cancel"
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
              }}
            />
            <HButton
              onClick={() => void submitEmailPreviewPrepare()}
              disabled={emailPreviewBusy}
              variant="contained"
              startIcon={
                emailPreviewBusy ? (
                  <CircularProgress size={18} thickness={4} color="inherit" sx={{ display: "block" }} />
                ) : undefined
              }
              label={emailPreviewBusy ? "utility.templatesList.validating" : "utility.templatesList.validateBtn"}
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
                minWidth: 200,
              }}
            />
          </DialogActions>
        </HDialog>

        <HDialog disableContentWrapper
          open={Boolean(confirmSwitch)}
          disableEscapeKeyDown={textMediaSwitchingId !== null}
          title={intl.formatMessage({ id: "utility.templatesList.confirmSwitchTitle", defaultMessage: "Switch Editor" })}
          titleSx={{
            fontFamily: idmFontFamily,
            fontWeight: 700,
            fontSize: 16,
            borderBottom: `1px solid ${idmLayoutColors.border}`,
          }}
          onClose={(event, reason) => {
            if (
              textMediaSwitchingId !== null ||
              reason === "backdropClick" ||
              reason === "escapeKeyDown"
            ) {
              return;
            }
            setConfirmSwitch(null);
          }}
        >
          <DialogContent sx={{ pt: 2 }}>
            <HLabel
              value="utility.templatesList.confirmSwitchMsg"
              colon={false}
              align="left"
              sx={{
                fontFamily: idmFontFamily,
                fontSize: 14,
                color: theme.palette.text.secondary,
              }}
            />

            <HLabel
              value={intl.formatMessage({ id: "utility.templatesList.confirmSwitchWarning", defaultMessage: "⚠️ Note: You will lose formatting if the current content format is not same." })}
              translate={false}
              colon={false}
              sx={{
                mt: 1.5,
                fontFamily: idmFontFamily,
                fontSize: 13,
                color: idmLayoutColors.accent,
                fontWeight: 600,
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <HButton
              onClick={() => setConfirmSwitch(null)}
              variant="outlined"
              label="utility.templatesList.cancel"
              sx={{
                fontFamily: idmFontFamily,
                textTransform: "none",
              }}
            />

            <HButton
              onClick={confirmSwitchEditor}
              disabled={textMediaSwitchingId !== null}
              variant="contained"
              label={textMediaSwitchingId ? "utility.templatesList.switching" : "utility.templatesList.switchBtn"}
            />
          </DialogActions>
        </HDialog>

        <HDialog
          disableContentWrapper
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={dialogPaperProps}
          title={intl.formatMessage({ id: "utility.templatesList.createTitle", defaultMessage: "Create Template" })}
          titleSx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: theme.palette.text.primary, borderBottom: `1px solid ${idmLayoutColors.border}` }}
          actions={
            <>
            <HButton
              onClick={() => setOpenCreateDialog(false)}
              variant="outlined"
              label="utility.templatesList.cancel"
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
              }}
            />
            <HButton
              variant="contained"
              onClick={handleCreateTemplate}
              label="utility.templatesList.createLabel"
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
              }}
            />
          </>
          }
        >

          <DialogContent dividers >
            <Stack spacing={3}>
              <HDropdown
                options={modules.map((m) => ({ value: m.moduleId, label: m.moduleName }))}
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                name="moduleId"
                placeholder={intl.formatMessage({ id: "utility.templatesList.module", defaultMessage: "Module" })}
                width="100%"
              />

              <HTextField placeholder="utility.templatesList.templateName" translate={true} value={templateName} onChange={(e) => setTemplateName(e.target.value)} fullWidth editable size="small" />

              <HTextField placeholder="utility.templatesList.fileName" translate={true} value={fileName} onChange={(e) => setFileName(e.target.value)} fullWidth editable size="small" />

              <HDropdown
                options={channels.map((ch) => ({ value: ch, label: ch }))}
                value={channel}
                onChange={(e) => {
                  const ch = e.target.value;
                  setChannel(ch);
                  const allowed = getSelectableTemplateTypes(ch, templateTypes, channelTemplateTypes);
                  setTemplateType(allowed[0] ?? "");
                }}
                name="channel"
                placeholder={intl.formatMessage({ id: "utility.templatesList.channel", defaultMessage: "Channel" })}
                width="100%"
              />

              <HDropdown
                options={getSelectableTemplateTypes(channel, templateTypes, channelTemplateTypes).map((t) => ({ value: t, label: t }))}
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                name="templateType"
                placeholder={intl.formatMessage({ id: "utility.templatesList.templateType", defaultMessage: "Template Type" })}
                width="100%"
              />

              <HDropdown
                options={[
                  { value: "N", label: intl.formatMessage({ id: "utility.templatesList.no", defaultMessage: "No" }) },
                  { value: "Y", label: intl.formatMessage({ id: "utility.templatesList.yes", defaultMessage: "Yes" }) }
                ]}
                value={isTextMediaCU}
                onChange={(e) => setIsTextMediaCU(e.target.value)}
                name="isTextMediaCU"
                placeholder={intl.formatMessage({ id: "utility.templatesList.textMedia", defaultMessage: "Text Media" })}
                width="100%"
              />
            </Stack>
          </DialogContent>

        </HDialog>

        <HDialog
          disableContentWrapper
          open={Boolean(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
          PaperProps={dialogPaperProps}
          title={intl.formatMessage({ id: "utility.templatesList.confirmDeleteTitle", defaultMessage: "Delete Template" })}
          titleSx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: theme.palette.text.primary, borderBottom: `1px solid ${idmLayoutColors.border}` }}
        >
          <DialogContent sx={{ pt: 2.5 }}>
            <HLabel
              value={intl.formatMessage({ id: "utility.templatesList.confirmDeleteMsg", defaultMessage: "Are you sure you want to delete this template?" })}
              translate={false}
              colon={false}
              sx={{ fontFamily: idmFontFamily, fontSize: 14, color: theme.palette.text.secondary }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <HButton
              onClick={() => setConfirmDelete(null)}
              variant="outlined"
              label="utility.templatesList.cancel"
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
              }}
            />
            <HButton
              color="error"
              variant="contained"
              onClick={() => confirmDelete && onDelete(confirmDelete)}
              label="utility.templatesList.deleteBtn"
              sx={{
                fontFamily: idmFontFamily,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "8px",
                textTransform: "none",
              }}
            />
          </DialogActions>
        </HDialog>
      </HBox>
  );
}