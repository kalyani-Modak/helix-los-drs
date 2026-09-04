import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box, AppBar, Toolbar, Typography, Avatar, Tooltip, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Badge, Paper, InputBase, Drawer as MuiDrawer, RadioGroup, FormControlLabel, Radio, ClickAwayListener, Divider, Menu, MenuItem, useTheme
} from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { ThemeContext, SessionContext, useToast } from "@helix/component-library";
import { useColorTheme } from "../themeSelectionConfig";
import { createPaletteCssVars } from "../colors";
import lightLogo from "@images/Ebix_logo.png";
import darkLogo from "@images/Dark-mode-Logo.png";
import SideAppBar from "./SideAppBar";


import {
  DashboardOutlined as Dashboard, AssignmentOutlined as Assignment, BusinessCenterOutlined as BusinessCenter, BuildOutlined as Build, SettingsOutlined as Settings, SecurityOutlined as Security,
  BoltOutlined as Bolt, MonetizationOnOutlined as MonetizationOn, DescriptionOutlined as Description, TuneOutlined as Tune, StarOutline as Star, AssessmentOutlined as Assessment, BarChartOutlined as BarChart,
  TrendingUpOutlined as TrendingUp, FormatListBulleted as ListIcon, NotificationsOutlined as Notifications, ContentCutOutlined as ContentCut, Sync,
  FolderOpenOutlined as FolderOpen, UploadFileOutlined as UploadFile, CampaignOutlined as Campaign, PeopleOutline as People, ShieldOutlined as Shield, CreditCardOutlined as CreditCard,
  LocalOfferOutlined as LocalOffer, ScheduleOutlined as Schedule, Search, PhoneOutlined as Phone, KeyboardArrowDown, LightModeOutlined as LightMode, DarkModeOutlined as DarkMode, Close, Check, Logout
} from "@mui/icons-material";

const themeLabels = {
  "ADCB": "Corporate Blue",
  "AL-HILAL": "Ocean Breeze",
  "pastel-rose": "Pastel Rose",
  "sage-professional": "Sage Professional",
};

const FUNID_MENU_STORAGE_KEY = "SEC_MENUS_FUNID_ITEMS";
const FUNID_MENU_LABEL_SESSION_KEY = "SEC_MENUS_FUNID_LABEL_ITEMS";

const filterItemsRemovingFunId = (items, collector, labelCollector, parentIds = []) => {
  if (!Array.isArray(items)) return [];

  return items.reduce((acc, item) => {
    const cloned = { ...item , parentIds};
    if (Array.isArray(cloned.children)) {
      cloned.children = filterItemsRemovingFunId(cloned.children, collector, labelCollector, [...parentIds, cloned.menuId]);
    }

    if (cloned.funId) {
      collector.push(cloned.funId);
      labelCollector.push({
        key: cloned.funId,
        label: cloned.label || cloned.name || cloned.menuId || cloned.funId,
      });
      return acc;
    }

    acc.push(cloned);
    return acc;
  }, []);
};

const themeColors = {
  "ADCB": { preview: ["#3B82F6", "#EFF6FF", "#1E293B"], description: "Clean blue professional theme" },
  "AL-HILAL": { preview: ["#0891B2", "#ECFEFF", "#164E63"], description: "Cool cyan ocean palette" },
  "pastel-rose": { preview: ["#E11D48", "#FFF1F2", "#1C1917"], description: "Warm rose pastel tones" },
  "sage-professional": { preview: ["#059669", "#F0FDF4", "#1B2E1B"], description: "Natural sage green theme" },
};

const TICKER_MESSAGE = "Collections resolution for MTD is 45% and the team need to increase the pace by 5% Run Rate";

// Sub-component: TickerBar
const TickerBar = () => {
  return (
    <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative', height: 24, mx: 4 }}>
      <Box sx={{
        position: 'absolute', whiteSpace: 'nowrap', animation: 'ticker 60s linear infinite',
        typography: 'caption', color: 'text.secondary', fontWeight: 500, display: 'flex'
      }}>
        <Typography component="span" sx={{ mr: 8, fontSize: '0.75rem' }}>📢 {TICKER_MESSAGE}</Typography>
        <Typography component="span" sx={{ mr: 8, fontSize: '0.75rem' }}>📢 {TICKER_MESSAGE}</Typography>
      </Box>
      <style>
        {`
          @keyframes ticker {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </Box>
  );
};

// Sub-component: ActionHistoryCenter (Mock)
const ActionHistoryCenter = () => {
  return (
    <Tooltip title="Action History">
      <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: 2 }}>
        <Assignment fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};



function AppDrawLayoutMain({ setLanguage, language }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useContext(ThemeContext);
  const { selectedTheme, setSelectedTheme, colors } = useColorTheme();
  const { logout } = useContext(SessionContext);
  const toast = useToast();

  const realm = sessionStorage.getItem("SEC_REALM") || "CSS";
  const username = sessionStorage.getItem("SEC_USERNAME") || "Admin";

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerModule, setDrawerModule] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const isActive = (mod) => location.pathname === mod.route;

    const menusRaw = sessionStorage.getItem("SEC_MENUS");
  const parsedMenus = React.useMemo(() => (menusRaw ? JSON.parse(menusRaw) : null), [menusRaw]);

  const { filteredParsedMenus, funIdMenus, funIdMenuLabels } = React.useMemo(() => {
    if (!parsedMenus || typeof parsedMenus !== "object") {
      return { filteredParsedMenus: {}, funIdMenus: [], funIdMenuLabels: [] };
    }

    const collector = [];
    const labelCollector = [];
    const filtered = Object.entries(parsedMenus).reduce((acc, [groupKey, groupValue]) => {
      acc[groupKey] = {
        ...groupValue,
        hangingFunctions: filterItemsRemovingFunId(groupValue?.hangingFunctions || [], collector, labelCollector),
        children: filterItemsRemovingFunId(groupValue?.children || [], collector, labelCollector),
      };
      return acc;
    }, {});

    return { filteredParsedMenus: filtered, funIdMenus: collector, funIdMenuLabels: labelCollector };
  }, [parsedMenus]);

  React.useEffect(() => {
    if (funIdMenus.length > 0) {
      localStorage.setItem(FUNID_MENU_STORAGE_KEY, JSON.stringify(funIdMenus));
      sessionStorage.setItem(FUNID_MENU_LABEL_SESSION_KEY, JSON.stringify(funIdMenuLabels));
    } else {
      localStorage.removeItem(FUNID_MENU_STORAGE_KEY);
      sessionStorage.removeItem(FUNID_MENU_LABEL_SESSION_KEY);
    }
  }, [funIdMenus, funIdMenuLabels]);

  const flatMenus = React.useMemo(() => {
    return Object.entries(filteredParsedMenus).flatMap(([groupKey, groupValue]) => {
      const hangingFunctions = Array.isArray(groupValue?.hangingFunctions)
        ? groupValue.hangingFunctions
        : [];
      const childMenus = Array.isArray(groupValue?.children)
        ? groupValue.children
        : [];

      return [...hangingFunctions, ...childMenus].map((item) => ({
        group: groupKey,
        ...item,
      }));
    });
  }, [filteredParsedMenus]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful");
  };

  const handleModuleClick = useCallback((mod) => {
    if (mod.subItems) {
      setDrawerModule((prev) => (prev?.id === mod.id ? null : mod));
    } else if (mod.route) {
      setDrawerModule(null);
      navigate(mod.route);
    }
  }, [navigate]);



  useEffect(() => {
    const root = document.documentElement;
    const cssVars = createPaletteCssVars(colors, mode);

    root.setAttribute("data-theme", mode);
    root.setAttribute("data-color-theme", selectedTheme);
    Object.entries(cssVars).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });
  }, [colors, mode, selectedTheme]);

  const currentLogo = mode === "light" ? lightLogo : darkLogo;
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--drs-bg-page, linear-gradient(180deg, #f4f8fd 0%, #edf4fb 52%, #eaf1fb 100%))' }}>
      {/* AppHeader Component Inline */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: 56,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          bgcolor: 'var(--drs-bg-paper)',
          borderBottom: '1px solid',
          borderColor: 'var(--drs-border-divider)',
          color: 'var(--drs-text-primary)'
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important', px: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                width: 42, height: 42, borderRadius: 2, border: '1px solid', borderColor: 'var(--drs-border-divider)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--drs-bg-paper)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <Box
                component="img"
                src={currentLogo}
                alt="Logo"
                sx={{ width: 28, height: 28, objectFit: "contain", cursor: 'pointer' }}
                onClick={() => navigate("/")}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--drs-text-primary)', lineHeight: 1.1, letterSpacing: 0.5 }}>
                {realm}
              </Typography>
              <Box sx={{ bgcolor: 'var(--drs-chip-bg)', px: 1, pb: 0.25, pt: 0.25, borderRadius: 1.5, mt: 0.25 }}>
                <Typography sx={{ color: 'var(--drs-chip-text)', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '0.65rem', lineHeight: 1 }}>
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Box>

          <TickerBar />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <Paper
                elevation={0}
                sx={{
                  display: 'flex', alignItems: 'center', px: 1, bgcolor: 'var(--drs-search-bg)',
                  borderRadius: 1.5, height: 36, width: 220,
                  border: '1px solid',
                  borderColor: 'var(--drs-search-border)'
                }}
              >
                <Search fontSize="small" sx={{ color: 'var(--drs-text-secondary)', mr: 1 }} />
                <InputBase placeholder="Search Account No..." sx={{ fontSize: '0.875rem', flex: 1, color: 'var(--drs-text-primary)' }} />
              </Paper>
            </Box>

            <ActionHistoryCenter />

            <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
              <IconButton onClick={toggleMode} size="small" sx={{ width: 36, height: 36, borderRadius: 2, color: 'var(--drs-color-primary)', '&:hover': { bgcolor: 'var(--drs-hover-bg)' } }}>
                {mode === "light" ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings">
              <IconButton onClick={() => setSettingsOpen(true)} size="small" sx={{ width: 36, height: 36, borderRadius: 2, color: 'var(--drs-color-primary)', '&:hover': { bgcolor: 'var(--drs-hover-bg)' } }}>
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Settings Sheet Drawer */}
            <MuiDrawer anchor="right" open={settingsOpen} onClose={() => setSettingsOpen(false)}>
              <Box sx={{ width: { xs: 300, sm: 380 }, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Settings</Typography>

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Color Theme</Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {Object.keys(themeLabels).map((key) => (
                    <Box
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      sx={{
                        border: '1px solid', borderColor: selectedTheme === key ? 'var(--drs-color-primary)' : 'var(--drs-border-divider)',
                        borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                        bgcolor: selectedTheme === key ? 'var(--drs-action-selected)' : 'transparent',
                        textAlign: 'left',
                        '&:hover': { bgcolor: 'var(--drs-hover-bg)', borderColor: 'var(--drs-color-primary-light)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {themeColors[key].preview.map((c, i) => (
                          <Box
                            key={i}
                            sx={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid', borderColor: 'var(--drs-border-divider)', bgcolor: c }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--drs-text-primary)', mb: 0.5, lineHeight: 1 }}>
                          {themeLabels[key]}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '11px', color: 'var(--drs-text-secondary)', display: 'block', lineHeight: 1 }}>
                          {themeColors[key].description}
                        </Typography>
                      </Box>
                      {selectedTheme === key && (
                        <Check sx={{ fontSize: 16, color: 'var(--drs-color-primary)', flexShrink: 0 }} />
                      )}
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Language</Typography>
                <RadioGroup
                  value={language || "en"}
                  onChange={(e) => setLanguage && setLanguage(e.target.value)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                >
                  {[
                    { key: "en", native: "English", flag: "🇺🇸" },
                    { key: "es", native: "Español", flag: "🇪🇸" },
                    { key: "fr", native: "Français", flag: "🇫🇷" },
                    { key: "de", native: "Deutsch", flag: "🇩🇪" }
                  ].map((lang) => (
                    <Box
                      key={lang.key}
                      sx={{
                        border: '1px solid', borderColor: (language || "en") === lang.key ? 'var(--drs-color-primary)' : 'var(--drs-border-divider)',
                        borderRadius: 2, p: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer',
                        bgcolor: (language || "en") === lang.key ? 'var(--drs-action-selected)' : 'transparent',
                        '&:hover': { bgcolor: 'var(--drs-hover-bg)' }
                      }}
                      onClick={() => setLanguage && setLanguage(lang.key)}
                    >
                      <FormControlLabel
                        value={lang.key}
                        control={<Radio sx={{ display: 'none' }} />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ fontSize: '1.25rem' }}>{lang.flag}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{lang.native}</Typography>
                          </Box>
                        }
                        sx={{ m: 0, flex: 1 }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Box>
            </MuiDrawer>

            <Box
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, ml: 1, pl: 2,
                borderLeft: '1px solid', borderColor: 'var(--drs-border-divider)', cursor: 'pointer',
                py: 0.5, borderRadius: 1, '&:hover': { bgcolor: 'var(--drs-hover-bg)' }
              }}
            >
              <Box
                key={`${selectedTheme}-${mode}`}
                sx={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: colors.text.white,
                  backgroundColor: colors.primary,
                  border: '1px solid',
                  borderColor: colors.primaryLight,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.04) inset',
                }}
              >
                {username.charAt(0)}
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{username}</Typography>
              <KeyboardArrowDown fontSize="small" sx={{ color: 'var(--drs-text-secondary)' }} />
            </Box>

            <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={() => setProfileAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }} slotProps={{ paper: { sx: { mt: 1, minWidth: 160, boxShadow: 3, borderRadius: 2 } } }}>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontSize: '0.875rem' }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MainSidebar Component Inline */}
     <SideAppBar flatMenus={flatMenus}/>


      <Box
        component="main"
        className={mode === "dark" ? "theme-dark" : ""}
        data-theme={mode}
        sx={{ flexGrow: 1, mt: '56px', ml: 0, height: 'calc(100vh - 56px)', overflow: 'auto' }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default function AppDrawLayout(props) {
  return <AppDrawLayoutMain {...props} />;
}
