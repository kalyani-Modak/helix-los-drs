import React, { useEffect, useRef, useState } from "react";
import { Button, Popover, Typography } from "@mui/material";
import { KeyboardOutlined } from "@mui/icons-material";
import { HBox } from "@helix/component-library";

function shortcutMatches(event, keyCombination) {
  const parts = keyCombination.toLowerCase().split("+");
  const key = parts.find((part) => !["ctrl", "control", "alt", "shift", "meta", "cmd"].includes(part));
  const normalizedEventKey = event.key?.toLowerCase();

  return (
    Boolean(key) &&
    normalizedEventKey === key &&
    event.ctrlKey === (parts.includes("ctrl") || parts.includes("control")) &&
    event.altKey === parts.includes("alt") &&
    event.shiftKey === parts.includes("shift") &&
    event.metaKey === (parts.includes("meta") || parts.includes("cmd"))
  );
}

export default function ShortCut({ shortcuts = [], onNavigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const closeTimerRef = useRef(null);
  const open = Boolean(anchorEl);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openShortcuts = (event) => {
    clearCloseTimer();
    setAnchorEl(event.currentTarget);
  };

  const closeShortcuts = () => {
    clearCloseTimer();
    setAnchorEl(null);
  };

  const scheduleCloseShortcuts = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setAnchorEl(null);
      closeTimerRef.current = null;
    }, 250);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const shortcut = shortcuts.find((item) => shortcutMatches(event, item.keyCombination));
      if (!shortcut?.path) return;

      event.preventDefault();
      onNavigate?.({ path: shortcut.path , parentIds: shortcut.parentIds, funId: shortcut.funId});
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate, shortcuts]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <HBox
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button
        size="small"
        variant="text"
        aria-label="Account workspace keyboard shortcuts"
        aria-haspopup="true"
        aria-controls="account-workspace-shortcuts-popover"
        aria-expanded={open ? "true" : undefined}
        disabled={!shortcuts.length}
        onClick={(event) => {
          if (open) {
            closeShortcuts();
          } else {
            openShortcuts(event);
          }
        }}
        onMouseEnter={openShortcuts}
        onMouseLeave={scheduleCloseShortcuts}
        startIcon={<KeyboardOutlined sx={{ fontSize: 14 }} />}
        sx={{
          textTransform: "none",
          fontSize: 11,
          minHeight: 26,
          px: 1,
          borderRadius: 1,
          color: "text.secondary",
          "& .MuiButton-startIcon": { mr: 0.5 },
        }}
      >
        Know Your Shortcuts
      </Button>
      <Popover
        disableScrollLock
        id="account-workspace-shortcuts-popover"
        anchorEl={anchorEl}
        open={open}
        onClose={closeShortcuts}
        disableRestoreFocus
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ pointerEvents: "none" }}
        slotProps={{
          paper: {
            onMouseEnter: clearCloseTimer,
            onMouseLeave: scheduleCloseShortcuts,
            sx: {
              mt: 0.5,
              minWidth: 230,
              maxWidth: 280,
              borderRadius: 1,
              border: 1,
              borderColor: "divider",
              boxShadow: 3,
              pointerEvents: "auto",
            },
          },
        }}
      >
        <HBox
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 1,
            gap: 0.25,
            backgroundColor: "background.paper",
          }}
        >
          {shortcuts.map((shortcut) => (
            <Button
              key={`${shortcut.funId}-${shortcut.keyCombination}`}
              variant="text"
              onClick={() => {return null}}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                minHeight: 30,
                px: 0.75,
                py: 0.5,
                borderRadius: 1,
                textTransform: "none",
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&.MuiButtonBase-root": {
                  cursor: "default",
                },
              }}
            >
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 700 }}>
                {shortcut.label}
              </Typography>
              <Typography
                component="kbd"
                variant="caption"
                sx={{
                  flexShrink: 0,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 0.75,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "action.hover",
                  color: "text.secondary",
                  fontSize: 10,
                  fontFamily: "monospace",
                  lineHeight: 1.3,
                }}
              >
                {shortcut.keyCombination}
              </Typography>
            </Button>
          ))}
        </HBox>
      </Popover>
    </HBox>
  );
}
