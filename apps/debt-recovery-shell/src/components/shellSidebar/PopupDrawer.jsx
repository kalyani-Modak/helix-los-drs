import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  InputAdornment,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { getSearchPopupTokens, SHELL_SIDEBAR_WIDTH_COLLAPSED } from "./shellSidebarTokens";

const APP_BAR_OFFSET_PX = 56;

/**
 * Overlay panel fixed to the right of the compact sidebar (does not resize main content).
 */
export default function PopupDrawer({
  open,
  parentMenu = null,
  items = [],
  onClose,
  onNavigate,
  isItemActive,
  mode,
  colors,
  sidebarRef,
}) {
  const theme = useTheme();
  const popup = useMemo(() => getSearchPopupTokens(mode, colors), [mode, colors]);
  const panelRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) setQuery("");
  }, [open, parentMenu]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items || [];
    return (items || []).filter((i) => i.name.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onEsc, true);
    return () => window.removeEventListener("keydown", onEsc, true);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (sidebarRef?.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose, sidebarRef]);

  if (!open || !parentMenu) return null;

  const handleChildClick = (path) => {
    onNavigate(path);
    onClose();
  };

  return (
    <Paper
      ref={panelRef}
      elevation={12}
      role="dialog"
      aria-label={`${parentMenu} menu`}
      sx={{
        position: "fixed",
        top: APP_BAR_OFFSET_PX,
        left: SHELL_SIDEBAR_WIDTH_COLLAPSED,
        width: 300,
        maxWidth: `min(300px, calc(100vw - ${SHELL_SIDEBAR_WIDTH_COLLAPSED}px - 16px))`,
        height: `calc(100vh - ${APP_BAR_OFFSET_PX}px)`,
        zIndex: theme.zIndex.modal,
        display: "flex",
        flexDirection: "column",
        borderRadius: "0 12px 12px 0",
        overflow: "hidden",
        bgcolor: popup.cardBg,
        color: popup.fg,
        border: `1px solid ${popup.cardBorder}`,
        borderLeft: "none",
        boxShadow:
          mode === "dark"
            ? "8px 0 32px rgba(0,0,0,0.45)"
            : "8px 0 32px rgba(15, 23, 42, 0.12)",
        animation: "shellPopupDrawerIn 0.25s ease-out",
        "@keyframes shellPopupDrawerIn": {
          from: {
            opacity: 0.9,
            transform: "translateX(-14px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.75,
          borderBottom: `1px solid ${popup.cardBorder}`,
          flexShrink: 0,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            color: popup.fg,
            letterSpacing: "0.02em",
          }}
        >
          {parentMenu}
        </Typography>
      </Box>

      <Box sx={{ px: 2, pt: 1.5, pb: 1, flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search in this section…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: popup.mutedFg }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: 13,
              fontFamily: '"Inter", system-ui, sans-serif',
              bgcolor: popup.inputBg,
              color: popup.fg,
              "& fieldset": { borderColor: popup.cardBorder },
              "&:hover fieldset": { borderColor: colors.primary },
              "&.Mui-focused fieldset": { borderColor: colors.primary, borderWidth: 2 },
            },
            "& .MuiInputBase-input::placeholder": {
              color: popup.mutedFg,
              opacity: 1,
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 1, pb: 2 }}>
        {filteredItems.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              px: 1,
              py: 4,
              textAlign: "center",
              color: popup.mutedFg,
              fontSize: 12,
            }}
          >
            No results found
          </Typography>
        ) : (
          filteredItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <ListItemButton
                key={`${item.menuId}-${item.path}`}
                dense
                onClick={() => handleChildClick(item.path)}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 1.5,
                  mb: 0.25,
                  color: active ? colors.text?.white || "#fff" : popup.fg,
                  bgcolor: active ? colors.primary : "transparent",
                  "&:hover": {
                    bgcolor: active ? colors.primary : alpha(colors.primary, mode === "dark" ? 0.15 : 0.08),
                    color: active ? colors.text?.white || "#fff" : popup.fg,
                  },
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: {
                      fontSize: 13,
                      fontWeight: active ? 600 : 500,
                      fontFamily: '"Inter", system-ui, sans-serif',
                    },
                  }}
                />
              </ListItemButton>
            );
          })
        )}
      </Box>
    </Paper>
  );
}

PopupDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  parentMenu: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  isItemActive: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  colors: PropTypes.object.isRequired,
  sidebarRef: PropTypes.shape({ current: PropTypes.any }),
};

