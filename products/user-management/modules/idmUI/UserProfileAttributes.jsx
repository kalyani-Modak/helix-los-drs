import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Grid,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { FiPlus, FiAlertTriangle, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { HAxiosService, HBox, HButton, HLabel, HPaper, HTextField, HToggle, HBreadCrumb, TitleBar, HAgGrid, useToast, useDrsTheme, withAlpha } from "@helix/component-library";
import { UserManagementAPI } from "./apiEndpoints";
import { isApiSuccess, isHttpSuccess, getApiMsg } from "./apiResponse";


const paperSx = {
  borderRadius: "12px",
  backgroundColor: "var(--drs-bg-paper)",
  border: "1px solid var(--drs-border-divider)",
  boxShadow: "0 1px 3px rgba(15,23,42,0.06),0 8px 24px rgba(15,23,42,0.06)",
};


const dialogPaperSx = {
  borderRadius: "14px",
  border: "1px solid var(--drs-border-divider)",
  overflow: "hidden",
  boxShadow: "0 18px 48px rgba(15,23,42,0.14)",
};


const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: 12,
    borderRadius: "8px",
  },
  "& .MuiInputLabel-root": { fontSize: 12, mb: 1 },
  "& .MuiFormHelperText-root": { fontSize: 10, mb: 1 },
};


const dialogSectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  color: "var(--drs-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: 0.6,
  mb: 1,
};


const ATTR_VALUE_LENGTH_ABS_MAX = 2048;

const extractApiError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.msg ||
  err?.response?.data?.errorMessage ||
  err?.response?.data?.error ||
  err?.message;

const parseServiceResponse = (res) => {
  if (res == null) return { ok: false, status: null, message: "No response", data: null };
  const body = res.data || {};
  return {
    ok: isHttpSuccess(res),
    status: body.status,
    message: body.message || body.msg || "",
    data: body.data,
  };
};

const StatCard = ({ label, value, accent }) => {
  const { surfaces, text, border, colors } = useDrsTheme();
  return (
  <HBox
    sx={{
      borderRadius: "16px",
      bgcolor: surfaces.paper,
      border: `1px solid ${border.divider}`,
      boxShadow: `0 12px 30px -10px ${withAlpha(colors.primary, 0.25)}`,
      overflow: "hidden",
      px: 2,
      py: 1.5,
      flex: 1,
      minWidth: 120,
      borderTop: `3px solid ${accent}`,
      mb: 0,
      "&:hover": {
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        transform: "translateY(-1px)",
      },
      flexDirection: "column",
    }}
  >
    <HLabel
      value={label}
      translate={false}
      colon={false}
      align="left"
      sx={{
        fontSize: 10,
        fontWeight: 600,
        color: colors.text.light,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    />
    <HLabel
      value={value}
      translate={false}
      colon={false}
      align="left"
      sx={{
        fontSize: 22,
        fontWeight: 700,
        color: colors.text.primary,
        mt: 0.3,
      }}
    />
  </HBox>
  );
};

const emptyForm = () => ({
  name: "",
  displayName: "",
  required: false,
  minLength: "",
  maxLength: "",
});

/** @returns {string|null} error message or null */
const validateLengthBounds = (minRaw, maxRaw, intl) => {
  const minEmpty = minRaw === "" || minRaw == null;
  const maxEmpty = maxRaw === "" || maxRaw == null;
  if (minEmpty && maxEmpty) return null;
  const min = minEmpty ? null : Number(minRaw);
  const max = maxEmpty ? null : Number(maxRaw);
  if (!minEmpty && (Number.isNaN(min) || min < 0)) {
    return intl.formatMessage({ id: "label.userProfileAttributes.toast.lenMinNeg", defaultMessage: "Minimum length cannot be negative." });
  }
  if (!maxEmpty && (Number.isNaN(max) || max < 1)) {
    return intl.formatMessage({ id: "label.userProfileAttributes.toast.lenMaxMin", defaultMessage: "Maximum length must be at least 1 when set." });
  }
  if (min != null && max != null && min > max) {
    return intl.formatMessage({ id: "label.userProfileAttributes.toast.lenMinExceedsMax", defaultMessage: "Minimum length cannot exceed maximum length." });
  }
  if (max != null && max > ATTR_VALUE_LENGTH_ABS_MAX) {
    return intl.formatMessage({ id: "label.userProfileAttributes.toast.lenMaxAbs", defaultMessage: "Maximum length cannot exceed {max}." }, { max: ATTR_VALUE_LENGTH_ABS_MAX });
  }
  if (min != null && min > ATTR_VALUE_LENGTH_ABS_MAX) {
    return intl.formatMessage({ id: "label.userProfileAttributes.toast.lenMinAbs", defaultMessage: "Minimum length cannot exceed {max}." }, { max: ATTR_VALUE_LENGTH_ABS_MAX });
  }
  return null;
};

const formatLengthCell = (v) => (v == null || v === "" ? "—" : String(v));

const UserProfileAttributes = () => {
  const { surfaces, text, border, action, colors } = useDrsTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const theme = useTheme();
  const realm = sessionStorage.getItem("SEC_REALM");

  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const loadAttributes = useCallback(async () => {
    if (!realm) {
      setAttributes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await HAxiosService.GET(UserManagementAPI.user_profile_attributes_cru_operation());
      if (res == null) {
        setAttributes([]);
        return;
      }
      const parsed = parseServiceResponse(res);
      if (!parsed.ok || parsed.status === "ERROR") {
        toast.error(parsed.message || intl.formatMessage({ id: "label.userProfileAttributes.toast.loadError", defaultMessage: "Failed to load profile attributes." }));
        setAttributes([]);
        return;
      }
      if (parsed.status === "WARNING" && parsed.message) {
        toast.warning(parsed.message);
      }
      const list = Array.isArray(parsed.data) ? parsed.data : [];
      setAttributes(list);
    } catch (err) {
      toast.error(extractApiError(err) || intl.formatMessage({ id: "label.userProfileAttributes.toast.loadError", defaultMessage: "Failed to load profile attributes." }));
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  }, [realm, toast, intl]);

  useEffect(() => {
    loadAttributes();
  }, [loadAttributes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attributes.filter((a) => {
      if (!a?.name) return false;
      if (!q) return true;
      const dn = (a.displayName || "").toLowerCase();
      return a.name.toLowerCase().includes(q) || dn.includes(q);
    });
  }, [attributes, search]);

  const requiredCount = useMemo(() => attributes.filter((a) => a?.required).length, [attributes]);
  const optionalCount = useMemo(
    () => attributes.filter((a) => !a?.required).length,
    [attributes],
  );

  const openAdd = () => {
    setForm(emptyForm());
    setAddOpen(true);
  };

  const openEdit = (row) => {
    setForm({
      name: row.name || "",
      displayName: row.displayName || "",
      required: Boolean(row.required),
      minLength: row.minLength != null && row.minLength !== "" ? row.minLength : "",
      maxLength: row.maxLength != null && row.maxLength !== "" ? row.maxLength : "",
    });
    setEditOpen(true);
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const openDelete = () => {
    const row = selectedRow;
    setAnchorEl(null);
    setSelectedRow(null);
    if (!row) return;
    setForm({ ...emptyForm(), name: row.name, displayName: row.displayName || "" });
    setDeleteOpen(true);
  };

  const payloadFromForm = () => {
    const minEmpty = form.minLength === "" || form.minLength == null;
    const maxEmpty = form.maxLength === "" || form.maxLength == null;
    const min = minEmpty ? null : Number(form.minLength);
    const max = maxEmpty ? null : Number(form.maxLength);
    const body = {
      name: form.name?.trim() || "",
      displayName: form.displayName?.trim() || "",
      required: Boolean(form.required),
    };
    if (min != null && !Number.isNaN(min)) body.minLength = min;
    if (max != null && !Number.isNaN(max)) body.maxLength = max;
    return body;
  };

  const handleCreate = async () => {
    const name = form.name?.trim();
    if (!name) {
      toast.error(intl.formatMessage({ id: "label.userProfileAttributes.toast.nameRequired", defaultMessage: "Attribute name is required." }));
      return;
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
      toast.error(intl.formatMessage({ id: "label.userProfileAttributes.toast.namePatternError", defaultMessage: "Use a letter-first name with letters, numbers, underscore, or hyphen." }));
      return;
    }
    const lenErr = validateLengthBounds(form.minLength, form.maxLength, intl);
    if (lenErr) {
      toast.error(lenErr);
      return;
    }
    setSaving(true);
    try {
      const res = await HAxiosService.POST(
        UserManagementAPI.user_profile_attributes_cru_operation(),
        payloadFromForm(),
      );
      if (res == null) return;
      const parsed = parseServiceResponse(res);
      if (isApiSuccess(res)) {
        toast.success(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.createSuccess", defaultMessage: "Attribute created." })));
        setAddOpen(false);
        setForm(emptyForm());
        await loadAttributes();
      } else if (parsed.status === "WARNING") {
        toast.warning(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.createWarning", defaultMessage: "Could not create attribute." })));
      } else {
        toast.error(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.createError", defaultMessage: "Failed to create attribute." })));
      }
    } catch (err) {
      toast.error(extractApiError(err) || intl.formatMessage({ id: "label.userProfileAttributes.toast.createError", defaultMessage: "Failed to create attribute." }));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    const name = form.name?.trim();
    if (!name) {
      toast.error(intl.formatMessage({ id: "label.userProfileAttributes.toast.nameMissing", defaultMessage: "Attribute name is missing." }));
      return;
    }
    const lenErr = validateLengthBounds(form.minLength, form.maxLength, intl);
    if (lenErr) {
      toast.error(lenErr);
      return;
    }
    setSaving(true);
    try {
      const res = await HAxiosService.PUT(
        UserManagementAPI.user_profile_attributes_cru_operation(),
        payloadFromForm(),
      );
      if (res == null) return;
      const parsed = parseServiceResponse(res);
      if (isApiSuccess(res)) {
        toast.success(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.updateSuccess", defaultMessage: "Attribute updated." })));
        setEditOpen(false);
        setForm(emptyForm());
        await loadAttributes();
      } else if (parsed.status === "WARNING") {
        toast.warning(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.updateWarning", defaultMessage: "No changes applied." })));
      } else {
        toast.error(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.updateError", defaultMessage: "Failed to update attribute." })));
      }
    } catch (err) {
      toast.error(extractApiError(err) || intl.formatMessage({ id: "label.userProfileAttributes.toast.updateError", defaultMessage: "Failed to update attribute." }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const key = form.name?.trim();
    if (!key) return;
    setDeleting(true);
    try {
      const url = UserManagementAPI.user_profile_attributes_delete_operation(encodeURIComponent(key));
      const res = await HAxiosService.DELETE(url);
      if (res == null) return;
      const parsed = parseServiceResponse(res);
      if (isApiSuccess(res)) {
        toast.success(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.deleteSuccess", defaultMessage: "Attribute deleted." })));
        setDeleteOpen(false);
        setForm(emptyForm());
        await loadAttributes();
      } else if (parsed.status === "WARNING") {
        toast.warning(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.deleteWarning", defaultMessage: "Could not delete attribute." })));
      } else {
        toast.error(getApiMsg(res, intl.formatMessage({ id: "label.userProfileAttributes.toast.deleteError", defaultMessage: "Failed to delete attribute." })));
      }
  } catch (err) {
      toast.error(extractApiError(err) || intl.formatMessage({ id: "label.userProfileAttributes.toast.deleteError", defaultMessage: "Failed to delete attribute." }));
    } finally {
      setDeleting(false);
    }
  };

  const RequiredBadge = useCallback(({ required }) => {
    const label = required
      ? intl.formatMessage({ id: "label.userProfileAttributes.required", defaultMessage: "Required" })
      : intl.formatMessage({ id: "label.userProfileAttributes.optional", defaultMessage: "Optional" });

    return (
      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.6, background: "transparent" }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            background: required ? colors.accent : theme.palette.text.secondary,
            boxShadow: required ? `0 0 0 3px ${colors.accent}22` : "none",
          }}
        />
        <HLabel
          value={label}
          translate={false}
          colon={false}
          align="left"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: required ? colors.accentDark : theme.palette.text.secondary,
          }}
        />
      </HBox>
    );
  }, [intl, colors, theme]);

  const columnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.name", defaultMessage: "Name/Key/Id" }),
      field: "name",
      flex: 1.2,
      sortable: true,
      filter: true,
      cellStyle: { fontWeight: 600,  },
    },
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.displayName", defaultMessage: "Display name" }),
      field: "displayName",
      flex: 1.2,
      sortable: true,
      filter: true,
      valueFormatter: (params) => params.value || "—",
      cellStyle: {  },
    },
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.minLen", defaultMessage: "Min len" }),
      field: "minLength",
      width: 100,
      sortable: true,
      valueFormatter: (params) => formatLengthCell(params.value),
      cellStyle: {  },
    },
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.maxLen", defaultMessage: "Max len" }),
      field: "maxLength",
      width: 100,
      sortable: true,
      valueFormatter: (params) => formatLengthCell(params.value),
      cellStyle: {  },
    },
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.required", defaultMessage: "Required" }),
      field: "required",
      width: 120,
      sortable: true,
      cellRenderer: (params) => <RequiredBadge required={Boolean(params.value)} />,
    },
    {
      headerName: intl.formatMessage({ id: "label.userProfileAttributes.col.actions", defaultMessage: "Actions" }),
      field: "actions",
      width: 90,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
            setSelectedRow(params.data);
          }}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { color: theme.palette.text.primary },
          }}
        >
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </IconButton>
      ),
    },
  ], [intl, RequiredBadge]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  return (
    <div>
      <HBox
        sx={{
          boxSizing: "border-box",
          flexDirection: "column",
          alignItems: "stretch",
          mt: 2,
        }}
      >
          <div>
            <HPaper
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                backdropFilter: "blur(16px)",
                mb: 0,
              }}
            >
              <HBox
                sx={{
                  px: 2.5,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${colors.border}`,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0, background: "transparent" }}>
                  <HBreadCrumb />
                  <HBox sx={{ display: "flex", alignItems: "center", gap: 1, background: "transparent" }}>
                    <IconButton
                      onClick={() => navigate("/homelayout/welcomepage")}
                      size="small"
                      sx={{
                        color: colors.text.secondary,
                        borderRadius: "8px",
                      }}
                    >
                      <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <TitleBar
                      title={intl.formatMessage({
                        id: "label.userProfileAttributes.title",
                        defaultMessage: "User profile attributes",
                      })}
                    />
                  </HBox>
                </HBox>
                <HButton
                  variant="contained"
                  onClick={openAdd}
                  disabled={!realm}
                  startIcon={<FiPlus size={12} />}
                  label="label.userProfileAttributes.addAttribute"
                />
              </HBox>

              <Box sx={{ p: { xs: 1.5, sm: 2.5 }, bgcolor: "transparent" }}>
                {!realm ? (
                  <HPaper
                    elevation={0}
                    sx={{
                      borderRadius: "16px",
      bgcolor: surfaces.paper,
      border: `1px solid ${border.divider}`,
                      boxShadow: `0 12px 30px -10px ${withAlpha(colors.primary, 0.25)}`,
                      overflow: "hidden",
                      py: 6,
                      px: 3,
                      textAlign: "center",
                      borderStyle: "dashed",
                      borderColor: `${colors.primary}35`,
                      mb: 0,
                    }}
                  >
                    <FiAlertTriangle size={32} color={colors.accent} style={{ marginBottom: 16 }} />
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.sessionRequired", defaultMessage: "Session required" })}
                      translate={false}
                      colon={false}
                      align="center"
                      sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: theme.palette.text.primary,
                        mb: 0.75,
                      }}
                    />
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.sessionRequiredDesc", defaultMessage: "Your session is missing required context. Sign in again to view and manage user profile attributes." })}
                      translate={false}
                      colon={false}
                      align="center"
                      sx={{
                        fontSize: 13,
                        color: colors.text.secondary,
                        maxWidth: 420,
                        mx: "auto",
                        lineHeight: 1.55,
                        mb: 2,
                      }}
                    />
                  </HPaper>
                ) : (
                  <>
                    {!loading && (
                      <Grid container spacing={1.5} sx={{ mb: 2 }}>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <StatCard label={intl.formatMessage({ id: "label.userProfileAttributes.total", defaultMessage: "Total" })} value={attributes.length} accent={colors.primary} />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 4 }}>
                          <StatCard label={intl.formatMessage({ id: "label.userProfileAttributes.required", defaultMessage: "Required" })} value={requiredCount} accent={colors.accent} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <StatCard label={intl.formatMessage({ id: "label.userProfileAttributes.optional", defaultMessage: "Optional" })} value={optionalCount} accent={colors.secondary} />
                        </Grid>
                      </Grid>
                    )}

                    <HBox
                      sx={{
                        borderRadius: "12px",
                        border: `1px solid ${colors.border}`,
                        overflow: "hidden",
                        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                        flexDirection: "column",
                      }}
                    >
                      <HBox
                        sx={{
                          px: 2,
                          py: 1.35,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                          flexWrap: "wrap",
                          borderBottom: `1px solid ${colors.border}`,
                          background: "transparent",
                        }}
                      >
                        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1, background: "transparent" }}>
                          <HBox
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "8px",
                              flexShrink: 0,
                              background: `linear-gradient(135deg,${colors.primary}18,${colors.primaryLight}12)`,
                              border: `1px solid ${colors.primary}22`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ViewListOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.primary }} />
                          </HBox>
                          <HBox sx={{ minWidth: 0, flexDirection: "column", background: "transparent" }}>
                            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", background: "transparent" }}>
                              <HLabel
                                value={intl.formatMessage({ id: "label.userProfileAttributes.attributeList", defaultMessage: "Attribute list" })}
                                translate={false}
                                colon={false}
                                align="left"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 14,
                                  color: theme.palette.text.primary,
                                }}
                              />
                              <Chip
                                label={
                                  loading
                                    ? "—"
                                    : search.trim()
                                      ? `${filtered.length} / ${attributes.length}`
                                      : attributes.length
                                }
                                size="small"
                                sx={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  height: 20,
                                  background: `${colors.primary}12`,
                                }}
                              />
                            </HBox>
                            <HLabel
                              value={intl.formatMessage({ id: "label.userProfileAttributes.searchDesc", defaultMessage: "Search filters the table below by name or display name" })}
                              translate={false}
                              colon={false}
                              align="left"
                              sx={{
                                fontSize: 11,
                                color: theme.palette.text.secondary,
                                mt: 0.2,
                              }}
                            />
                          </HBox>
                        </HBox>
                        <HTextField
                          size="small"
                          placeholder={intl.formatMessage({ id: "label.userProfileAttributes.searchPlaceholder", defaultMessage: "Search by name or label…" })}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          disabled={loading}
                          editable
                          InputProps={{
                            startAdornment: <FiSearch size={13} color={theme.palette.text.secondary} style={{ marginRight: 6 }} />,
                          }}
                          sx={{
                            minWidth: { xs: "100%", sm: 240 },
                            flexShrink: 0,
                            ...textFieldSx,
                          }}
                        />
                      </HBox>

                      <HBox sx={{ p: 2, pt: 1.5, background: "transparent", flexDirection: "column" }}>
                        <HAgGrid
                          rowData={filtered}
                          columnDefs={columnDefs}
                          gridStyle={{ width: "100%", height: "100%","--ag-borders": "none" }}
                          gridClassName="drs-list-grid"
                          loading={loading}
                          pagination
                          paginationPageSize={10}
                        />
                      </HBox>
                    </HBox>
                  </>
                )}
              </Box>
            </HPaper>
          </div>
      </HBox>
      {/* ── Context Menu ──────────────────────────────────────────────────── */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: {
          sx: {
            borderRadius: "10px",
            border: `1px solid ${colors.border}`,
            boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            p: 0.5,
            minWidth: 140,
            backgroundColor: surfaces.paper,
          },
        } }}>
        <MenuItem
          onClick={() => selectedRow && openEdit(selectedRow)}
          disabled={!selectedRow}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            borderRadius: "6px",
            color: colors.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 1,
            "&:hover": { backgroundColor: colors.hover, color: colors.primary },
          }}
        >
          <FiEdit2 size={13} />
          {intl.formatMessage({ id: "label.userProfileAttributes.menu.edit", defaultMessage: "Edit attribute" })}
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: colors.border }} />
        <MenuItem
          onClick={openDelete}
          disabled={!selectedRow}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            borderRadius: "6px",
            color: colors.accent,
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 1,
            "&:hover": {
              backgroundColor: `${colors.accent}08`,
            },
          }}
        >
          <FiTrash2 size={13} />
          {intl.formatMessage({ id: "label.userProfileAttributes.menu.delete", defaultMessage: "Delete" })}
        </MenuItem>
      </Menu>

      {/* ── Dialogs ───────────────────────────────────────────────────────── */}
      <Dialog
        open={addOpen}
        onClose={() => !saving && setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              border: `1px solid ${border.divider}`,
              boxShadow: `0 12px 30px ${withAlpha(colors.primary, 0.19)}`,
              overflow: "hidden",
            }
          }, transition: { timeout: 260 }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: 16,
          color: text.primary,
          borderBottom: `1px solid ${border.divider}`,
        }}>
          <HBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, width: "100%", background: "transparent" }}>
            <HBox sx={{ minWidth: 0, flexDirection: "column", background: "transparent" }}>
              <HLabel
                value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.addTitle", defaultMessage: "Add profile attribute" })}
                translate={false}
                colon={false}
                align="left"
                sx={{  fontWeight: 700, fontSize: 15, color: theme.palette.text.primary }}
              />
              <HLabel
                value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.addDesc", defaultMessage: "Creates a user profile field." })}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontSize: 11,
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                  lineHeight: 1.45,
                }}
              />
            </HBox>
            <IconButton
              size="small"
              onClick={() => setAddOpen(false)}
              disabled={saving}
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              <MdClose size={16} />
            </IconButton>
          </HBox>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, px: 2.5, pb: 2, mt: 1 }}>
          <Alert
            severity="info"
            variant="outlined"
            icon={false}
            sx={{
              mb: 2.5,
              fontSize: 12,
              borderRadius: "10px",
              borderColor: `${colors.primary}35`,
              color: theme.palette.text.primary,
              backgorund: "transparent",
            }}
          >
            {intl.formatMessage({ id: "label.userProfileAttributes.dialog.infoAlert", defaultMessage: "The internal name must be unique in your environment and is stored as the attribute key." })}
          </Alert>
          <HLabel
            value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.definition", defaultMessage: "Definition" })}
            translate={false}
            colon={false}
            align="left"
            sx={{ ...dialogSectionLabel, color: theme.palette.text.primary }}
          />
          <HTextField
            label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldName", defaultMessage: "Name (key)" })}
            fullWidth
            required
            size="small"
            editable
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            disabled={saving}
            sx={{ mb: 2, ...textFieldSx }}
          />
          <HTextField
            label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldDisplayName", defaultMessage: "Display name" })}
            fullWidth
            size="small"
            editable
            value={form.displayName}
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            disabled={saving}
            sx={{ mb: 2, ...textFieldSx }}
          />
          <HLabel
            value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.valueLength", defaultMessage: "Value length (optional)" })}
            translate={false}
            colon={false}
            align="left"
            sx={{ ...dialogSectionLabel, mt: 0.5, color: theme.palette.text.primary }}
          />
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMinLength", defaultMessage: "Min length" })}
                type="number"
                fullWidth
                size="small"
                editable
                inputProps={{ min: 0, max: ATTR_VALUE_LENGTH_ABS_MAX, step: 1 }}
                value={form.minLength}
                onChange={(e) => setForm((f) => ({ ...f, minLength: e.target.value }))}
                disabled={saving}
                helperText={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMinLengthHelper", defaultMessage: "Optional. Server-side length validation." })}
                sx={{ ...textFieldSx, mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMaxLength", defaultMessage: "Max length" })}
                type="number"
                fullWidth
                size="small"
                editable
                inputProps={{ min: 1, max: ATTR_VALUE_LENGTH_ABS_MAX, step: 1 }}
                value={form.maxLength}
                onChange={(e) => setForm((f) => ({ ...f, maxLength: e.target.value }))}
                disabled={saving}
                helperText={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMaxLengthHelper", defaultMessage: "Cap {val}" }, { val: ATTR_VALUE_LENGTH_ABS_MAX })}
                sx={textFieldSx}
              />
            </Grid>
          </Grid>
          <HPaper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: "10px",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
              display: "flex",
              flexDirection: "column",
              background: "transparent",
            }}
          >
            <HLabel
              value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldBehavior", defaultMessage: "Field behavior" })}
              translate={false}
              colon={false}
              align="left"
              sx={{ ...dialogSectionLabel, mb: 1.5, color: theme.palette.text.primary }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <HBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    py: 0.5,
                    background: "transparent",
                  }}
                >
                  <HBox
                    sx={{
                      background: "transparent",
                    }}
                  >
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldRequired", defaultMessage: "Required" })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{  fontSize: 12, fontWeight: 600, color: theme.palette.text.primary }}
                    />
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldRequiredHelper", defaultMessage: "User must provide a value" })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{  fontSize: 10, color: theme.palette.text.secondary, mt: 0.25 }}
                    />
                  </HBox>
                  <HToggle
                    checked={form.required}
                    onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))}
                    disabled={saving}
                    sx={{ ml: 2 }}
                  />
                </HBox>
              </Grid>
            </Grid>
          </HPaper>
        </DialogContent>
        <DialogActions sx={{
          px: 3,
          pb: 2,
          gap: 1,
          borderTop: `1px solid ${border.divider}`,
        }}>
          <HButton
            variant="outlined"
            onClick={() => setAddOpen(false)}
            disabled={saving}
            label="label.userProfileAttributes.dialog.cancel"
          />
          <HButton
            onClick={handleCreate}
            loading={saving}
            variant="contained"
            label="label.userProfileAttributes.dialog.createBtn"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={() => !saving && setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ transition: { timeout: 260 } }}
      >
        <DialogTitle sx={{ fontWeight: 700,
          fontSize: 16,
          color: text.primary,
          borderBottom: `1px solid ${border.divider}`}}>
          <HBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, width: "100%", background: "transparent" }}>
            <HBox sx={{ minWidth: 0, flexDirection: "column", background: "transparent" }}>
              <HLabel
                value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.editTitle", defaultMessage: "Edit attribute" })}
                translate={false}
                colon={false}
                align="left"
                sx={{  fontWeight: 700, fontSize: 15, color: theme.palette.text.primary }}
              />
              <HLabel
                value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.editDesc", defaultMessage: "Changes apply to the shared user profile configuration." })}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontSize: 11,
                  color: theme.palette.text.secondary,
                  mt: 0.5,
                  lineHeight: 1.45,
                }}
              />
            </HBox>
            <IconButton
              size="small"
              onClick={() => setEditOpen(false)}
              disabled={saving}
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              <MdClose size={16} />
            </IconButton>
          </HBox>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5, px: 2.5, pb: 2, mt: 1 }}>
          <HLabel
            value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.definition", defaultMessage: "Definition" })}
            translate={false}
            colon={false}
            align="left"
            sx={{ ...dialogSectionLabel, color: theme.palette.text.primary }}
          />
          <HTextField
            label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldName", defaultMessage: "Name (key)" })}
            fullWidth
            required
            size="small"
            editable
            value={form.name}
            disabled
            helperText={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldNameEditHelper", defaultMessage: "Attribute key cannot be changed after creation" })}
            sx={{ mb: 5, ...textFieldSx }}
          />
          <HTextField
            label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldDisplayName", defaultMessage: "Display name" })}
            fullWidth
            size="small"
            value={form.displayName}
            editable
            onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
            disabled={saving}
            sx={{ mb: 2, ...textFieldSx }}
          />
          <HLabel
            value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.valueLength", defaultMessage: "Value length (optional)" })}
            translate={false}
            colon={false}
            align="left"
            sx={{ ...dialogSectionLabel, mt: 0.5, color: theme.palette.text.primary }}
          />
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMinLength", defaultMessage: "Min length" })}
                type="number"
                fullWidth
                size="small"
                inputProps={{ min: 0, max: ATTR_VALUE_LENGTH_ABS_MAX, step: 1 }}
                value={form.minLength}
                editable
                onChange={(e) => setForm((f) => ({ ...f, minLength: e.target.value }))}
                disabled={saving}
                helperText={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMinLengthEditHelper", defaultMessage: "Clear both min and max to remove limits" })}
                sx={{ ...textFieldSx, mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HTextField
                label={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMaxLength", defaultMessage: "Max length" })}
                type="number"
                fullWidth
                size="small"
                editable
                inputProps={{ min: 1, max: ATTR_VALUE_LENGTH_ABS_MAX, step: 1 }}
                value={form.maxLength}
                onChange={(e) => setForm((f) => ({ ...f, maxLength: e.target.value }))}
                disabled={saving}
                helperText={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldMaxLengthHelper", defaultMessage: "Cap {val}" }, { val: ATTR_VALUE_LENGTH_ABS_MAX })}
                sx={textFieldSx}
              />
            </Grid>
          </Grid>
          <HPaper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: "10px",
              borderColor: colors.border,
              boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
              display: "flex",
              flexDirection: "column",
              background: "transparent",
            }}
          >
            <HLabel
              value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldBehavior", defaultMessage: "Field behavior" })}
              translate={false}
              colon={false}
              align="left"
              sx={{ ...dialogSectionLabel, mb: 1.5 }}
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <HBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    py: 0.5,
                    background: "transparent",
                  }}
                >
                  <HBox
                    sx={{
                      background: "transparent",
                    }}
                  >
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldRequired", defaultMessage: "Required" })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{  fontSize: 12, fontWeight: 600, color: theme.palette.text.primary }}
                    />
                    <HLabel
                      value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.fieldRequiredHelper", defaultMessage: "User must provide a value" })}
                      translate={false}
                      colon={false}
                      align="left"
                      sx={{  fontSize: 10, color: theme.palette.text.secondary, mt: 0.25 }}
                    />
                  </HBox>
                  <HToggle
                    checked={form.required}
                    onChange={(e) => setForm((f) => ({ ...f, required: e.target.checked }))}
                    disabled={saving}
                    sx={{ ml: 2 }}
                  />
                </HBox>
              </Grid>
            </Grid>
          </HPaper>
        </DialogContent>
        <DialogActions sx={{
          px: 3,
          pb: 2,
          gap: 1,
          borderTop: `1px solid ${border.divider}`,
        }}>
          <HButton
            variant="outlined"
            onClick={() => setEditOpen(false)}
            disabled={saving}
            label="label.userProfileAttributes.dialog.cancel"
          />
          <HButton
            onClick={handleUpdate}
            loading={saving}
            variant="contained"
            label="label.userProfileAttributes.dialog.saveBtn"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              border: `1px solid ${border.divider}`,
              boxShadow: `0 12px 30px ${withAlpha(colors.primary, 0.19)}`,
              overflow: "hidden",
            }
          }, transition: { timeout: 220 }
        }}
      >
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: 16,
          color: text.primary,
          borderBottom: `1px solid ${border.divider}`,
        }}>
          <HBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, width: "100%", background: "transparent" }}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, background: "transparent" }}>
              <FiAlertTriangle color={colors.accent} size={18} />
              <HLabel
                value={intl.formatMessage({ id: "label.userProfileAttributes.dialog.deleteTitle", defaultMessage: "Delete profile attribute" })}
                translate={false}
                colon={false}
                align="left"
                sx={{  fontWeight: 700, fontSize: 14, color: theme.palette.text.primary }}
              />
            </HBox>
            <IconButton
              size="small"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              sx={{ color: theme.palette.text.secondary }}
            >
              <MdClose size={16} />
            </IconButton>
          </HBox>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 2.5, pb: 2.5 }}>
          <HLabel
            value={intl.formatMessage(
              { id: "label.userProfileAttributes.dialog.deleteConfirmAlert", defaultMessage: "Permanently remove attribute {name}? Users will lose this field from the account profile. This cannot be undone from the UI." },
              { name: form.name }
            )}
            translate={false}
            colon={false}
            align="left"
            sx={{
              fontSize: 12.5,
              color: theme.palette.text.secondary,
              lineHeight: 1.55,
            }}
          />
        </DialogContent>
        <DialogActions sx={{
          px: 3,
          pb: 2,
          gap: 1,
          borderTop: `1px solid ${border.divider}`,
        }}>
          <HButton
            variant="outlined"
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
            label="label.userProfileAttributes.dialog.cancel"
          />
          <HButton
            onClick={handleDelete}
            loading={deleting}
            variant="contained"
            label="label.userProfileAttributes.dialog.deleteBtn"
            sx={{
              fontWeight: 600, fontSize: 13, borderRadius: "8px", textTransform: "none",
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfileAttributes;
