import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BoltIcon from "@mui/icons-material/Bolt";
import { useIntl } from "react-intl";
import AddEventTypesModal from "./AddEventTypesModal";
import { EventTypesAPI } from "./apiEndpoints";
import { HAxiosService, HAgGrid, HBox, HLabel, HTextField, HDropdown, HButton, HToggle, HBreadCrumb, TitleBar, useToast } from "@helix/component-library";

// ── Design tokens ──────────────────────────────────────────────────────────────
const colors = {
  primary: "#0378A6",
  secondary: "#8dbf41",
  accent: "#bf0404",
  primaryLight: "#4aa3d9",
  primaryDark: "#025a8c",
  secondaryLight: "#a8d173",
  secondaryDark: "#6b9c2c",
  accentLight: "#f44336",
  accentDark: "#a30404",
  warning: "#f59e0b",
  info: "#3b82f6",
  success: "#10b981",
  background: {
    start: "#f8fafc",
    end: "#f1f5f9",
    gradient: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
  },
  cardBg: "rgba(255, 255, 255, 0.98)",
  text: { primary: "#0f172a", secondary: "#334155", light: "#64748b", muted: "#94a3b8" },
  border: "#e2e8f0",
  hover: "#f1f5f9",
};

// ── Shared button style ────────────────────────────────────────────────────────
const primaryBtnSx = {
  fontWeight: 600,
  fontSize: "12px",
  borderRadius: "8px",
  textTransform: "none",
  boxShadow: "0 4px 10px rgba(3,120,166,0.25)",
  py: 0.7,
  px: 1.5,
};

// ── EventCard ──────────────────────────────────────────────────────────────────
function EventCard({ icon, title, description, stats = null, controls, onCardClick, active = false, color }) {
  const theme = useTheme();
  return (
    <HBox onClick={onCardClick} sx={{ height: "100%", width: "100%", cursor: onCardClick ? "pointer" : "default" }}>
      <Card
        sx={{
          borderRadius: "16px",
          border: active ? `2px solid ${color}` : `1px solid ${colors.border}`,
          boxShadow: active ? `0 8px 28px ${alpha(color, 0.18)}` : "0 8px 25px rgba(0,0,0,0.08)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ p: 2.5, display: "flex", flexDirection: "column", height: "100%" }}>
          <HBox sx={{ display: "flex", alignItems: "center", mb: 1.5, background: "transparent" }}>
            <Avatar
              className="card-icon"
              sx={{
                bgcolor: alpha(color, 0.1),
                color,
                width: 40,
                height: 40,
                borderRadius: "10px",
                mr: 1.5,
                transition: "all 0.3s ease",
              }}
            >
              {icon}
            </Avatar>
            <HBox sx={{ flex: 1, minWidth: 0, background: "transparent" }}>
              <HLabel
                value={title}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "0.95rem",
                  lineHeight: 1.3,
                  mb: 0.25,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
              <HLabel
                value={description}
                translate={false}
                colon={false}
                align="left"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.7rem",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </HBox>
          </HBox>

          {stats && (
            <HBox sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, my: 1, background: "transparent" }}>
              <HBox sx={{ textAlign: "center", background: "transparent" }}>
                <HLabel
                  value={String(stats.value)}
                  translate={false}
                  colon={false}
                  align="center"
                  sx={{ fontWeight: 700, color, fontSize: "1.8rem", lineHeight: 1.2, mb: 0.5 }}
                />
                <HLabel
                  value={stats.label}
                  translate={false}
                  colon={false}
                  align="center"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontWeight: 500,
                  }}
                />
              </HBox>
            </HBox>
          )}

          <HBox onClick={(e) => e.stopPropagation()} sx={{ mt: stats ? 0 : "auto", background: "transparent" }}>
            {controls}
          </HBox>
        </CardContent>
      </Card>
    </HBox>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
const EventSettingsScreen = () => {
  const toast = useToast();
  const intl = useIntl();
  const theme = useTheme();

  const t = (id, defaultMessage = id, values) =>
    intl.formatMessage({ id, defaultMessage }, values);

  const [userCardOpen, setUserCardOpen] = useState(false);
  const [eventListeners, setEventListeners] = useState([]);
  const [allKnownListeners, setAllKnownListeners] = useState([]);
  const [selectedListeners, setSelectedListeners] = useState([]);
  const [saveUserEvents, setSaveUserEvents] = useState(false);
  const [expiration, setExpiration] = useState(600); // in seconds
  const [unit, setUnit] = useState("Minutes");
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [saveAdminEvents, setSaveAdminEvents] = useState(false);
  const [adminEventsDetailsEnabled, setAdminEventsDetailsEnabled] = useState(false);
  const [savingListenerSettings, setSavingListenerSettings] = useState(false);
  const [savingAdminSettings, setSavingAdminSettings] = useState(false);
  const [savingUserSettings, setSavingUserSettings] = useState(false);

  const realm = sessionStorage.getItem("SEC_REALM");

  // ── Fetch listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchListeners = async () => {
      try {
        const selRes = await HAxiosService.GET(EventTypesAPI.EVENT_LISTENER_CONFIG());
        const selectedFromApi = selRes?.data?.enabledEventListeners || [];
        setSelectedListeners(selectedFromApi);
        const availRes = await HAxiosService.GET(EventTypesAPI.FETCH_AVAILABLE_LISTENERS());
        const availableFromApi = Array.isArray(availRes?.data) ? availRes.data : [];
        setEventListeners(availableFromApi);
        setAllKnownListeners(Array.from(new Set([...(availableFromApi || []), ...(selectedFromApi || [])])));
      } catch (e) { console.error(e); }
    };
    fetchListeners();
  }, []);

  // ── Fetch config + events ──────────────────────────────────────────────────
  useEffect(() => {
    if (!realm) return;
    const fetchConfig = async () => {
      try {
        const [userRes, adminRes] = await Promise.all([
          HAxiosService.GET(EventTypesAPI.FETCH_EVENT_CONFIG()),
          HAxiosService.GET(EventTypesAPI.FETCH_ADMIN_EVENT_CONFIG()),
        ]);
        setSaveUserEvents(Boolean(userRes?.data?.eventsEnabled));
        setExpiration(userRes?.data?.eventsExpiration != null ? userRes.data.eventsExpiration : 0);
        setSaveAdminEvents(Boolean(adminRes?.data?.adminEventsEnabled));
        setAdminEventsDetailsEnabled(Boolean(adminRes?.data?.adminEventsDetailsEnabled));
      } catch (e) { console.error(e); }
    };
    fetchConfig();
    fetchEvents(0, rowsPerPage);
  }, [realm]);

  const fetchEvents = async (pageNumber = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await HAxiosService.GET(EventTypesAPI.GET_ENABLED_EVENTS_LIST(pageNumber, pageSize));
      const content = res?.data?.content || [];
      setFilteredEvents(content);
      setEventTypes(content);
      setTotalPages(res?.data?.totalPages || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(page - 1, rowsPerPage); }, [page]);

  const handleSearch = (e) => {
    const v = e.target.value.toLowerCase();
    setSearch(e.target.value);
    setFilteredEvents((eventTypes || []).filter((ev) =>
      (ev?.eventName?.toLowerCase() || "").includes(v) ||
      (ev?.eventType?.toLowerCase() || "").includes(v)
    ));
    setPage(1);
  };

  // ── Save handlers ──────────────────────────────────────────────────────────
  const handleSaveListener = useCallback(async () => {
    setSavingListenerSettings(true);
    try {
      const payload = {
        enabledEventListeners: selectedListeners,
        eventListeners: selectedListeners,
      };
      const res = await HAxiosService.PUT(EventTypesAPI.EVENT_LISTENER_CONFIG(), payload);
      res.data?.status === "SUCCESS"
        ? toast.success(t("label.eventSettings.listenersSaved"), { autoClose: 1000 })
        : toast.error(t("label.eventSettings.saveFailed"));
    } catch { toast.error(t("label.eventSettings.errorSavingListeners")); }
    finally { setSavingListenerSettings(false); }
  }, [selectedListeners, toast, intl]);

  const handleSaveAdminSettings = useCallback(async () => {
    setSavingAdminSettings(true);
    try {
      await HAxiosService.PUT(EventTypesAPI.UPDATE_ADMIN_EVENT_CONFIG(), {
        adminEventsEnabled: saveAdminEvents,
        adminEventsDetailsEnabled,
      });
      toast.success(
        t("label.eventSettings.adminEventSaving", undefined, { state: saveAdminEvents ? t("label.eventSettings.on") : t("label.eventSettings.off") }),
        { autoClose: 1000 }
      );
    } catch (err) {
      console.error(err);
      toast.error(t("label.eventSettings.errorSavingAdmin"));
    } finally {
      setSavingAdminSettings(false);
    }
  }, [saveAdminEvents, adminEventsDetailsEnabled, toast, intl]);

  const handleSaveUserSettings = useCallback(async () => {
    setSavingUserSettings(true);
    try {
      await HAxiosService.PUT(EventTypesAPI.UPDATE_EVENT_CONFIG(), {
        eventsEnabled: saveUserEvents,
        eventsExpiration: saveUserEvents ? expiration : 0,
      });
      toast.success(t("label.eventSettings.userSettingsSaved"), { autoClose: 1000 });
    } catch (err) {
      console.error(err);
      toast.error(t("label.eventSettings.errorSavingUser"));
    } finally {
      setSavingUserSettings(false);
    }
  }, [saveUserEvents, expiration, toast, intl]);

  const handleListenerChange = (e) => {
    const nextSelected = e.target.value;
    setSelectedListeners(nextSelected);
    setAllKnownListeners((prev) => Array.from(new Set([...(prev || []), ...(nextSelected || [])])));
  };

  const handleAdminToggle = (e) => {
    setSaveAdminEvents(e.target.checked);
  };

  const handleUserToggle = (e) => {
    setSaveUserEvents(e.target.checked);
  };

  const handleExpirationChange = (e) => {
    const minutes = Number.parseInt(e.target.value, 10) || 0;
    setExpiration(minutes * 60);
  };

  const handleUnitChange = (val) => { setUnit(val); };

  const handleDeleteListener = (v) => {
    const newListeners = selectedListeners.filter((l) => l !== v);
    setSelectedListeners(newListeners);
  };

  const handleRemoveEvent = (name) => {
    setSelected((prev) => prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]);
  };

  useEffect(() => {
    if (selected.length > 0) saveSelectedEventTypes(selected);
  }, [selected]);

  const saveSelectedEventTypes = async (upd) => {
    if (!upd.length) return;
    try {
      const res = await HAxiosService.PUT(EventTypesAPI.UPDATE_ENABLED(), { eventList: upd, enableEventsList: false });
      res?.data?.status === "SUCCESS"
        ? toast.success(res?.data?.msg || t("label.eventSettings.removed"), { position: "top-right", autoClose: 1000 })
        : toast.error(t("label.eventSettings.saveFailed"));
    } catch { console.error("Error"); }
  };

  // ── Grid column defs ───────────────────────────────────────────────────────
  const eventColumnDefs = useMemo(() => [
    {
      field: "eventName",
      headerName: t("label.eventSettings.col.eventType"),
      flex: 2,
      minWidth: 180,
      sortable: true,
      filter: true,
    },
    {
      field: "description",
      headerName: t("label.eventSettings.col.description"),
      flex: 3,
      minWidth: 200,
      sortable: true,
      filter: true,
    },
    // {
    //   field: "__remove__",
    //   headerName: t("label.eventSettings.col.actions"),
    //   width: 90,
    //   sortable: false,
    //   filter: false,
    //   editable: false,
    //   cellRenderer: (params) => (
    //     <HBox
    //       sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
    //       onClick={() => handleRemoveEvent(params.data.type)}
    //     >
    //       <HButton
    //         label={t("label.eventSettings.remove")}
    //         size="small"
    //         variant="text"
    //         sx={{
    //           color: "#D21B8F",
    //           fontSize: "11px",
    //           minWidth: "unset",
    //           p: "2px 6px",
    //           "&:hover": { color: "#a0106e" },
    //         }}
    //       />
    //     </HBox>
    //   ),
    // },
  ], [intl]);

  // ── Unit options for HDropdown ─────────────────────────────────────────────
  const unitOptions = useMemo(() => [
    { value: "Minutes", label: t("label.eventSettings.unit.minutes") },
    { value: "Seconds", label: t("label.eventSettings.unit.seconds") },
    { value: "Hours",   label: t("label.eventSettings.unit.hours") },
    { value: "Days",    label: t("label.eventSettings.unit.days") },
  ], [intl]);

  const allListenerOptions = useMemo(
    () => Array.from(new Set([...(allKnownListeners || []), ...(eventListeners || []), ...(selectedListeners || [])])),
    [allKnownListeners, eventListeners, selectedListeners]
  );

  const selectableListenerOptions = useMemo(
    () => allListenerOptions.filter((listener) => !selectedListeners.includes(listener)),
    [allListenerOptions, selectedListeners]
  );

  return (
    <HBox sx={{ minHeight: "72.5vh", width: "100%", mx: "auto", mt: 2 }}>
      <HBox sx={{
        mb: 4,
        boxShadow: "0 4px 24px rgba(3,120,166,0.10)",
        overflow: "hidden",
      }}>
        {/* Breadcrumb + TitleBar */}
        <HBox sx={{ flexShrink: 0, height: "8%" }}>
          <HBreadCrumb />
          <HBox sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
            <HBox
              sx={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoltIcon sx={{ fontSize: { xs: 17, sm: 20 } }} />
            </HBox>
            <TitleBar
              title={intl.formatMessage({
                id: "label.eventSettings.title",
                defaultMessage: "Events",
              })}
            />
          </HBox>
        </HBox>

        {/* ── Body ── */}
        <HBox sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>

          {/* 3-card grid */}
          <HBox sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3, mb: 3 }}>

            {/* Card 1: Event Listeners */}
            <EventCard
              icon={<SettingsInputAntennaIcon />}
              title={t("label.eventSettings.card.listeners.title")}
              description={t("label.eventSettings.card.listeners.description")}
              color={theme.palette.text.primary}
              stats={{ label: t("label.eventSettings.card.listeners.stat"), value: selectedListeners.length }}
              onCardClick={() => setUserCardOpen(false)}
              active={false}
              controls={
                <HBox sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, width: "100%", background: "transparent" }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: "12px" }}>{t("label.eventSettings.selectListeners")}</InputLabel>
                    <Select
                      multiple
                      value={selectedListeners}
                      onChange={handleListenerChange}
                      input={<OutlinedInput label={t("label.eventSettings.selectListeners")} />}
                      sx={{ fontSize: "12px" }}
                      renderValue={(sel) => (
                        <HBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, background: "transparent" }}>
                          {sel.map((v) => (
                            <Chip
                              key={v} label={v} size="small"
                              onMouseDown={(e) => e.stopPropagation()}
                              onDelete={(e) => { e.stopPropagation(); handleDeleteListener(v); }}
                            />
                          ))}
                        </HBox>
                      )}
                    >
                      {selectableListenerOptions.map((l) => (
                        <MenuItem key={l} value={l} sx={{ fontSize: "13px" }}>{l}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <HButton
                    label={savingListenerSettings ? t("label.eventSettings.saving", "Saving...") : t("label.eventSettings.save", "Save")}
                    variant="contained"
                    size="small"
                    onClick={handleSaveListener}
                    disabled={savingListenerSettings}
                    sx={{ ...primaryBtnSx, width: "fit-content" }}
                  />
                </HBox>
              }
            />

            {/* Card 2: Admin Event Settings */}
            <EventCard
              icon={<AdminPanelSettingsIcon />}
              title={t("label.eventSettings.card.admin.title")}
              description={t("label.eventSettings.card.admin.description")}
              color={colors.secondary}
              stats={{ label: t("label.eventSettings.card.admin.stat"), value: saveAdminEvents ? t("label.eventSettings.on") : t("label.eventSettings.off") }}
              onCardClick={() => setUserCardOpen(false)}
              active={false}
              controls={
                <HBox sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, flexWrap: "wrap", background: "transparent" }}>
                  <HToggle
                    label="label.eventSettings.saveAdminEvents"
                    checked={saveAdminEvents}
                    onChange={handleAdminToggle}
                    size="small"
                    labelPlacement="start"
                  />
                  <HButton
                    label={savingAdminSettings ? t("label.eventSettings.saving", "Saving...") : t("label.eventSettings.save", "Save")}
                    variant="contained"
                    size="small"
                    onClick={handleSaveAdminSettings}
                    disabled={savingAdminSettings}
                    sx={{ ...primaryBtnSx, width: "fit-content" }}
                  />
                </HBox>
              }
            />

            {/* Card 3: User Event Settings */}
            <EventCard
              icon={<PersonIcon />}
              title={t("label.eventSettings.card.user.title")}
              description={t("label.eventSettings.card.user.description")}
              color={colors.warning}
              stats={{ label: t("label.eventSettings.card.user.stat"), value: saveUserEvents ? t("label.eventSettings.on") : t("label.eventSettings.off") }}
              onCardClick={() => setUserCardOpen((prev) => !prev)}
              active={userCardOpen}
              controls={
                <HBox sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexWrap: "wrap", gap: 1, background: "transparent" }}>
                  <HToggle
                    label="label.eventSettings.saveEvents"
                    checked={saveUserEvents}
                    onChange={handleUserToggle}
                    size="small"
                    labelPlacement="start"
                  />
                  {saveUserEvents && (
                    <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 1, background: "transparent" }}>
                      <HLabel value="label.eventSettings.expiration" sx={{ fontWeight: 600, fontSize: "12px", whiteSpace: "nowrap" }} />
                      <HTextField
                        type="number"
                        size="small"
                        value={expiration != null ? Math.floor(expiration / 60) : 0}
                        onChange={handleExpirationChange}
                        editable
                        sx={{ width: 70, mb: { xs: 1, sm: 1 } }}
                        width="70px"
                      />
                      <HDropdown
                        value={unit}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        options={unitOptions}
                        width="150px"
                        size="small"
                      />
                    </HBox>
                  )}
                  <HButton
                    label={savingUserSettings ? t("label.eventSettings.saving", "Saving...") : t("label.eventSettings.save", "Save")}
                    variant="contained"
                    size="small"
                    onClick={handleSaveUserSettings}
                    disabled={savingUserSettings}
                    sx={{ ...primaryBtnSx, width: "fit-content" }}
                  />
                </HBox>
              }
            />
          </HBox>

          {/* ── Event Types grid (shown when User card is open) ── */}
          {userCardOpen && (
            <HBox sx={{
              borderRadius: "12px",
              p: { xs: 1.5, sm: 2.5 },
              boxShadow: "0 4px 16px rgba(3,120,166,0.08)",
              border: "1px solid #e2e8f0",
            }}>
              {/* Controls row */}
              <HBox sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5, mb: 2,
                alignItems: { xs: "stretch", sm: "center" },
              }}>
                <HTextField
                  placeholder={t("label.eventSettings.searchPlaceholder")}
                  value={search}
                  onChange={handleSearch}
                  editable
                  translate={false}
                  sx={{ flex: 1, minWidth: 0 }}
                />
                <HBox sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <HButton
                    label={t("label.eventSettings.addSavedTypes")}
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ ...primaryBtnSx, flex: { xs: 1, sm: "none" } }}
                    onClick={() => setModalOpen(true)}
                  />
                  <AddEventTypesModal open={modalOpen} onClose={() => setModalOpen(false)} />
                  <HButton
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => fetchEvents(page - 1, rowsPerPage)}
                    sx={{
                      borderRadius: "8px",
                      flexShrink: 0,
                      minWidth: "unset",
                    }}
                  />
                </HBox>
              </HBox>

              {/* HAgGrid replacing Table */}
              {loading ? (
                <HBox sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress size={20} sx={{ color: colors.primary }} />
                </HBox>
              ) : (
                <HAgGrid
                  rowData={filteredEvents}
                  columnDefs={eventColumnDefs}
                  gridStyle={{ width: "100%", height: "100%" }}
                  gridClassName="drs-list-grid"
                  allowDelete={true}
                  pagination
                  paginationPageSize={10}
                  globalSearch={false}
                  overlayNoRowsTemplate={t("label.eventSettings.noResults")}
                />
              )}
            </HBox>
          )}
        </HBox>
      </HBox>
    </HBox>
  );
};

export default EventSettingsScreen;
