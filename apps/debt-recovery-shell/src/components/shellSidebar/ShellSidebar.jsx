import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { groupByParentMenu } from "./menuTransforms";
import { isPathActive } from "./pathUtils";
import {
  getShellSidebarTokens,
  RAIL_LOGO_BOX_PX,
  RAIL_LOGO_FONT_PX,
  RAIL_SEARCH_ICON_PX,
  SHELL_SIDEBAR_RAIL_SCALE,
  SHELL_SIDEBAR_WIDTH_COLLAPSED,
} from "./shellSidebarTokens";
import ShellSidebarSearchPopup from "./ShellSidebarSearchPopup";
import ShellSidebarMenuGroup from "./ShellSidebarMenuGroup";
import PopupDrawer from "./PopupDrawer";

export default function ShellSidebar({
  hangingFunctions = [],
  mode,
  colors,
  appShortTitle,
  onCollapsedChange,
  sx,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sidebarRef = useRef(null);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [activeParentMenu, setActiveParentMenu] = useState(null);

  const tokens = useMemo(() => getShellSidebarTokens(mode, colors), [mode, colors]);

  const allGroups = useMemo(
    () => groupByParentMenu(hangingFunctions || []),
    [hangingFunctions]
  );

  const popupItems = useMemo(() => {
    if (!activeParentMenu) return [];
    return allGroups.find((g) => g.parentMenu === activeParentMenu)?.items ?? [];
  }, [activeParentMenu, allGroups]);

  useEffect(() => {
    setActiveParentMenu(null);
  }, [pathname]);

  /** Sidebar width is fixed compact; notify layout consumers once. */
  useEffect(() => {
    onCollapsedChange?.(true);
  }, [onCollapsedChange]);

  /** Ctrl+K / Cmd+K — global menu search palette */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSearchPanelOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isItemActive = useCallback((path) => isPathActive(pathname, path), [pathname]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleParentClick = (parentMenu) => {
    setActiveParentMenu((prev) => (prev === parentMenu ? null : parentMenu));
  };

  const closePopup = () => setActiveParentMenu(null);

  const badgeInitials = (appShortTitle || "DR").slice(0, 2).toUpperCase();

  const searchIconBtnSx = {
    color: tokens.railFg,
    border: `1px solid ${tokens.railBorder}`,
    borderRadius: 2,
    bgcolor: tokens.searchBg,
    p: 0.35,
    "&:hover": { bgcolor: tokens.hoverBg, color: tokens.activeFg },
    "& .MuiSvgIcon-root": { fontSize: RAIL_SEARCH_ICON_PX },
  };

  return (
    <Box
      ref={sidebarRef}
      component="aside"
      aria-label="Main navigation"
      sx={{
        width: SHELL_SIDEBAR_WIDTH_COLLAPSED,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: tokens.railBg,
        color: tokens.railFg,
        borderRight: `1px solid ${tokens.railBorder}`,
        overflow: "hidden",
        ...sx,
      }}
    >
      <ShellSidebarSearchPopup
        open={searchPanelOpen}
        onClose={() => setSearchPanelOpen(false)}
        hangingFunctions={hangingFunctions}
        onNavigate={handleNavigate}
        mode={mode}
        colors={colors}
      />

      <PopupDrawer
        open={Boolean(activeParentMenu)}
        parentMenu={activeParentMenu}
        items={popupItems}
        onClose={closePopup}
        onNavigate={handleNavigate}
        isItemActive={isItemActive}
        mode={mode}
        colors={colors}
        sidebarRef={sidebarRef}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          px: 0.5,
          py: 1.5,
          borderBottom: `1px solid ${tokens.railBorder}`,
        }}
      >
        {/* <Tooltip title="Navigation">
          <Box
            component="span"
            sx={{
              width: RAIL_LOGO_BOX_PX,
              height: RAIL_LOGO_BOX_PX,
              borderRadius: 2,
              bgcolor: tokens.activeBg,
              color: tokens.activeFg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: RAIL_LOGO_FONT_PX,
              flexShrink: 0,
            }}
          >
            {badgeInitials}
          </Box>
        </Tooltip> */}

        <Tooltip title="Search menu (Ctrl+K)">
          <span>
            <IconButton
              size="small"
              onClick={() => setSearchPanelOpen(true)}
              aria-label="Open menu search"
              sx={searchIconBtnSx}
            >
              <SearchIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box
        id="shell-sidebar-menu-panel"
        component="nav"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          py: 0.5,
        }}
      >
        {allGroups.map((group) => (
          <ShellSidebarMenuGroup
            key={group.parentMenu}
            parentMenu={group.parentMenu}
            items={group.items}
            hasActiveChild={group.items.some((i) => isItemActive(i.path))}
            isPopupOpen={activeParentMenu === group.parentMenu}
            onParentClick={handleParentClick}
            tokens={tokens}
          />
        ))}
      </Box>

      <Box sx={{ px: 0.75, py: 1, borderTop: `1px solid ${tokens.railBorder}` }}>
        <Button
          fullWidth
          size="small"
          variant="text"
          onClick={() => setSearchPanelOpen(true)}
          sx={{
            minWidth: 0,
            px: 0.5,
            py: 0.5,
            fontSize: Math.max(7, Math.round(9 * SHELL_SIDEBAR_RAIL_SCALE)),
            lineHeight: 1.2,
            fontFamily: "ui-monospace, monospace",
            textTransform: "none",
            color: tokens.railFgMuted,
            "&:hover": { bgcolor: tokens.hoverBg, color: tokens.activeFg },
          }}
        >
          Ctrl+K
        </Button>
      </Box>
    </Box>
  );
}

ShellSidebar.propTypes = {
  hangingFunctions: PropTypes.arrayOf(
    PropTypes.shape({
      parentMenu: PropTypes.string,
      menuId: PropTypes.string,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      uris: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  colors: PropTypes.object.isRequired,
  /** Optional 2-letter badge; defaults to "DR" (not tenant-specific). */
  appShortTitle: PropTypes.string,
  onCollapsedChange: PropTypes.func,
  sx: PropTypes.object,
};

