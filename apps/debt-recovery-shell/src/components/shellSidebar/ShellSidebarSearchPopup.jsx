import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  InputBase,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  Keyboard as KeyboardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { groupByParentMenu, filterGroupsByName } from "./menuTransforms";
import { useDebouncedValue } from "./useDebouncedValue";
import { getParentMenuIcon } from "./parentMenuIcon";
import { getSearchPopupTokens } from "./shellSidebarTokens";

const DEBOUNCE_MS = 200;

export default function ShellSidebarSearchPopup({
  open,
  onClose,
  hangingFunctions = [],
  onNavigate,
  mode,
  colors,
}) {
  const theme = useTheme();
  const popup = useMemo(() => getSearchPopupTokens(mode, colors), [mode, colors]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const allGroups = useMemo(
    () => groupByParentMenu(hangingFunctions || []),
    [hangingFunctions]
  );

  const filteredGroups = useMemo(
    () => filterGroupsByName(allGroups, debouncedQuery),
    [allGroups, debouncedQuery]
  );

  const flatItems = useMemo(
    () =>
      filteredGroups.flatMap((g) =>
        g.items.map((item) => ({ ...item, _parentMenu: g.parentMenu }))
      ),
    [filteredGroups]
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
      return;
    }
    setQuery("");
    setSelectedIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

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
    setSelectedIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[selectedIndex];
    el?.scrollIntoView?.({ block: "nearest" });
  }, [selectedIndex, open, flatItems.length]);

  const handleSelect = (path) => {
    onNavigate(path);
    onClose();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!flatItems.length) return;
      setSelectedIndex((i) => (i + 1 >= flatItems.length ? 0 : i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!flatItems.length) return;
      setSelectedIndex((i) => (i <= 0 ? flatItems.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      const item = flatItems[selectedIndex];
      if (item) {
        e.preventDefault();
        handleSelect(item.path);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  const z = theme.zIndex.modal;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: z,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: { xs: "14vh", sm: "18vh", md: "20vh" },
        px: 2,
        pointerEvents: "auto",
      }}
    >
      {/* Backdrop — click outside panel closes (Interface Delight pattern) */}
      <Box
        onClick={onClose}
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: popup.backdrop,
          backdropFilter: "blur(6px)",
        }}
      />

      <Paper
        elevation={0}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: popup.cardBg,
          color: popup.fg,
          border: `1px solid ${popup.cardBorder}`,
          boxShadow:
            mode === "dark"
              ? "0 25px 50px -12px rgba(0,0,0,0.65)"
              : "0 25px 50px -12px rgba(15, 23, 42, 0.18)",
          animation: "shellSearchPopIn 0.2s ease-out",
          "@keyframes shellSearchPopIn": {
            from: { opacity: 0, transform: "translateY(-8px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Header — search + close (Delight command row) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${popup.cardBorder}`,
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: popup.mutedFg, flexShrink: 0 }} />
          <InputBase
            inputRef={inputRef}
            fullWidth
            placeholder="Search menu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            spellCheck={false}
            sx={{
              fontSize: 14,
              fontFamily: '"Inter", system-ui, sans-serif',
              color: popup.fg,
              "& input::placeholder": { color: popup.mutedFg, opacity: 1 },
            }}
          />
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              fontSize: 10,
              fontFamily: "ui-monospace, monospace",
              color: popup.mutedFg,
              bgcolor: popup.kbdBg,
              border: `1px solid ${popup.kbdBorder}`,
              flexShrink: 0,
            }}
          >
            ESC
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close search"
            sx={{
              color: popup.mutedFg,
              "&:hover": { bgcolor: alpha(popup.mutedFg, 0.12), color: popup.fg },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Results */}
        <Box
          ref={listRef}
          sx={{
            maxHeight: 280,
            overflowY: "auto",
            py: 0.5,
          }}
        >
          {flatItems.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                px: 2,
                py: 4,
                textAlign: "center",
                color: popup.mutedFg,
                fontSize: 12,
              }}
            >
              {debouncedQuery.trim()
                ? "No matching menu items."
                : "Type to filter menu items."}
            </Typography>
          ) : (
            flatItems.map((item, i) => {
              const ItemIcon = getParentMenuIcon(item._parentMenu || item.parentMenu);
              const selected = i === selectedIndex;
              return (
                <ListItemButton
                  key={`${item.menuId}-${item.path}-${i}`}
                  dense
                  selected={selected}
                  onClick={() => handleSelect(item.path)}
                  sx={{
                    py: 1,
                    px: 2,
                    alignItems: "flex-start",
                    bgcolor: selected ? popup.rowSelected : "transparent",
                    "&:hover": {
                      bgcolor: selected ? popup.rowSelected : popup.rowHover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, mt: 0.25, color: selected ? colors.primary : popup.mutedFg }}>
                    <ItemIcon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={item._parentMenu || item.parentMenu}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 13,
                        fontWeight: selected ? 600 : 500,
                        fontFamily: '"Inter", system-ui, sans-serif',
                        color: popup.fg,
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: 10,
                        color: popup.mutedFg,
                        fontFamily: '"Inter", system-ui, sans-serif',
                      },
                    }}
                  />
                </ListItemButton>
              );
            })
          )}
        </Box>

        {/* Footer hints — Delight-style */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.25,
            borderTop: `1px solid ${popup.cardBorder}`,
            fontSize: 10,
            color: popup.mutedFg,
            fontFamily: '"Inter", system-ui, sans-serif',
          }}
        >
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <KeyboardIcon sx={{ fontSize: 12 }} />
            Navigate: ↑↓
          </Box>
          <span>Select: Enter</span>
          <span>Close: Esc</span>
          <Typography
            component="span"
            variant="caption"
            sx={{ ml: "auto", fontSize: 10, color: popup.mutedFg }}
          >
            <Box
              component="span"
              sx={{
                px: 0.5,
                py: 0.125,
                mr: 0.5,
                borderRadius: 0.75,
                fontFamily: "ui-monospace, monospace",
                bgcolor: popup.kbdBg,
                border: `1px solid ${popup.kbdBorder}`,
              }}
            >
              Ctrl
            </Box>
            +
            <Box
              component="span"
              sx={{
                px: 0.5,
                py: 0.125,
                ml: 0.5,
                borderRadius: 0.75,
                fontFamily: "ui-monospace, monospace",
                bgcolor: popup.kbdBg,
                border: `1px solid ${popup.kbdBorder}`,
              }}
            >
              K
            </Box>
            toggle
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

ShellSidebarSearchPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hangingFunctions: PropTypes.array,
  onNavigate: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  colors: PropTypes.object.isRequired,
};

