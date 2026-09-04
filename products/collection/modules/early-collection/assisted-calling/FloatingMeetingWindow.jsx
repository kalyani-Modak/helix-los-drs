import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import MinimizeIcon from "@mui/icons-material/Remove";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { useDrsTheme, HBox, HLabel } from "@helix/component-library";

import { useAssistedCallingUI } from "./useAssistedCallingUI";

/**
 * Expanded (PiP) dimensions of the floating window.
 * Keeping a 3:2 aspect ratio gives a compact but usable video frame.
 */
const WINDOW_W = 420;
const WINDOW_H = 252;

/** Height of the drag-handle title bar (always visible). */
const HEADER_H = 36;

/** How far from the right/bottom edge the window spawns. */
const SPAWN_OFFSET = 24;

/**
 * Clamp a position so the window never escapes the viewport.
 *
 * @param {number} x   – proposed left (px)
 * @param {number} y   – proposed top (px)
 * @param {boolean} minimised – if true, only header height is needed
 */
function clamp(x, y, minimised) {
  const maxX = window.innerWidth - WINDOW_W;
  const maxY = window.innerHeight - (minimised ? HEADER_H : WINDOW_H);
  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
  };
}

/**
 * FloatingMeetingWindow
 *
 * A draggable, minimisable, closeable floating window that renders a meeting
 * URL inside an iframe, similar to the PiP windows in Microsoft Teams /
 * Google Meet.
 *
 * It is rendered via `ReactDOM.createPortal` into `document.body` so it
 * floats above all other application UI regardless of scroll or panel state.
 *
 * Auto-closes when `callActive` becomes `false` (call ended).
 *
 * @param {object}   props
 * @param {string}   props.meetUrl – iframe src URL
 * @param {Function} props.onClose – called when the window should be removed
 */
const FloatingMeetingWindow = ({ meetUrl, onClose }) => {
  const { callActive } = useAssistedCallingUI();
  const { themeVars, surfaces, theme } = useDrsTheme();

  // ── Derive an iframe-safe URL with video disabled ──────────────────────────
  // Appends `videoEnabled=false` (LiveKit standard param) so the meeting
  // frontend hides the camera button. The browser-level `allow` attribute
  // already omits `camera`, so this is a belt-and-suspenders approach that
  // also hides the UI control where the LiveKit frontend respects the param.
  const iframeSrc = useMemo(() => {
    if (!meetUrl) return meetUrl;
    try {
      const url = new URL(meetUrl);
      url.searchParams.set("videoEnabled", "false");
      url.searchParams.set("video", "false");
      return url.toString();
    } catch {
      // If the URL is relative or malformed, fall back to the original
      const sep = meetUrl.includes("?") ? "&" : "?";
      return `${meetUrl}${sep}videoEnabled=false&video=false`;
    }
  }, [meetUrl]);

  // ── Window position ────────────────────────────────────────────────────────
  const [pos, setPos] = useState(() => {
    const x = window.innerWidth - WINDOW_W - SPAWN_OFFSET;
    const y = window.innerHeight - WINDOW_H - SPAWN_OFFSET;
    return { x, y };
  });

  // ── Minimised / expanded ───────────────────────────────────────────────────
  const [minimised, setMinimised] = useState(false);
  const toggleMinimise = useCallback(() => setMinimised((v) => !v), []);

  // ── iframe load / error tracking ───────────────────────────────────────────
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const iframeTimeoutRef = useRef(null);

  // Track iframeLoaded in a ref so the timeout callback can read latest value
  const iframeLoadedRef = useRef(false);
  useEffect(() => {
    iframeLoadedRef.current = iframeLoaded;
  }, [iframeLoaded]);

  useEffect(() => {
    setIframeLoaded(false);
    setIframeError(false);
    iframeLoadedRef.current = false;
    if (iframeTimeoutRef.current) {
      clearTimeout(iframeTimeoutRef.current);
      iframeTimeoutRef.current = null;
    }
    if (!meetUrl) return;
    iframeTimeoutRef.current = setTimeout(() => {
      if (!iframeLoadedRef.current) {
        setIframeError(true);
      }
    }, 4000);
    return () => {
      if (iframeTimeoutRef.current) {
        clearTimeout(iframeTimeoutRef.current);
        iframeTimeoutRef.current = null;
      }
    };
  }, [meetUrl]);

  // ── Auto-close when call ends ──────────────────────────────────────────────
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!callActive) {
      onCloseRef.current?.();
    }
  }, [callActive]);

  // ── Drag logic ─────────────────────────────────────────────────────────────
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  const handleMouseDown = useCallback(
    (e) => {
      // Only drag on primary mouse button; ignore clicks on icon buttons
      if (e.button !== 0) return;
      if (e.target.closest("button")) return;

      e.preventDefault();
      const drag = dragRef.current;
      drag.dragging = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.originX = pos.x;
      drag.originY = pos.y;

      const onMouseMove = (moveEvt) => {
        if (!dragRef.current.dragging) return;
        const dx = moveEvt.clientX - drag.startX;
        const dy = moveEvt.clientY - drag.startY;
        setPos(clamp(drag.originX + dx, drag.originY + dy, minimised));
      };

      const onMouseUp = () => {
        dragRef.current.dragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [pos, minimised],
  );

  // ── Styles ─────────────────────────────────────────────────────────────────
  const isDark = theme.palette.mode === "dark";

  const windowStyle = {
    position: "fixed",
    left: pos.x,
    top: pos.y,
    width: WINDOW_W,
    zIndex: 9999,
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: isDark
      ? "0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)"
      : "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
    border: `1px solid ${theme.palette.divider}`,
    background: surfaces.paper,
    display: "flex",
    flexDirection: "column",
    // Smooth height transition when minimising / expanding
    transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    height: minimised ? HEADER_H : WINDOW_H,
  };

  const headerStyle = {
    height: HEADER_H,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    px: "10px",
    cursor: "grab",
    background: isDark
      ? "linear-gradient(90deg, #1a2035 0%, #1e2540 100%)"
      : "linear-gradient(90deg, #e8edf8 0%, #f0f4fc 100%)",
    borderBottom: minimised ? "none" : `1px solid ${theme.palette.divider}`,
    userSelect: "none",
    ...themeVars,
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const content = (
    <HBox sx={windowStyle}>
      {/* ── Drag-handle header ──────────────────────────────────────────── */}
      <HBox sx={headerStyle} onMouseDown={handleMouseDown}>
        {/* Drag indicator */}
        <DragIndicatorIcon sx={{ fontSize: 14, color: "text.disabled", flexShrink: 0 }} />

        {/* Video icon + label */}
        <VideoCallOutlinedIcon sx={{ fontSize: 15, color: "primary.main", flexShrink: 0 }} />
        <HLabel
          value="Meeting"
          colon={false}
          translate={false}
          sx={{ fontSize: 11, fontWeight: 700, color: "text.primary", flex: 1, minWidth: 0 }}
        />

        {/* Pulse indicator when call is active */}
        {callActive && (
          <HBox
            component="span"
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: "error.main",
              flexShrink: 0,
              animation: "fmwPulse 1.4s ease-in-out infinite",
              "@keyframes fmwPulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.3 },
              },
            }}
          />
        )}

        {/* Open in new tab */}
        <Tooltip title="Open in new tab">
          <IconButton
            size="small"
            onClick={() => window.open(meetUrl, "_blank", "noopener,noreferrer")}
            sx={{ width: 22, height: 22, ml: 0.5, "&:hover": { bgcolor: "action.hover" } }}
          >
            <OpenInNewIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tooltip>

        {/* Minimise / restore */}
        <Tooltip title={minimised ? "Restore" : "Minimise"}>
          <IconButton
            size="small"
            onClick={toggleMinimise}
            sx={{ width: 22, height: 22, "&:hover": { bgcolor: "action.hover" } }}
          >
            {minimised ? (
              <OpenInFullIcon sx={{ fontSize: 11 }} />
            ) : (
              <MinimizeIcon sx={{ fontSize: 14 }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Close */}
        <Tooltip title="Close">
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              width: 22,
              height: 22,
              "&:hover": { bgcolor: "error.main", "& svg": { color: "white" } },
            }}
          >
            <CloseIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Tooltip>
      </HBox>

      {/* ── iframe body (hidden when minimised) ─────────────────────────── */}
      {!minimised && (
        <HBox sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Actual iframe */}
          <iframe
            title="LiveKit Meeting"
            src={iframeSrc}
            allow="microphone; autoplay; display-capture"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
            onLoad={() => {
              iframeLoadedRef.current = true;
              setIframeLoaded(true);
              setIframeError(false);
              if (iframeTimeoutRef.current) {
                clearTimeout(iframeTimeoutRef.current);
                iframeTimeoutRef.current = null;
              }
            }}
            onError={() => setIframeError(true)}
          />

          {/* Loading skeleton — visible until iframe fires onLoad */}
          {!iframeLoaded && !iframeError && (
            <HBox
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: isDark ? "rgba(10,14,26,0.92)" : "rgba(240,244,252,0.92)",
              }}
            >
              {/* Animated ring */}
              <HBox
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `3px solid ${theme.palette.primary.main}`,
                  borderTopColor: "transparent",
                  animation: "fmwSpin 0.8s linear infinite",
                  "@keyframes fmwSpin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                  },
                }}
              />
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                Connecting to meeting…
              </Typography>
            </HBox>
          )}

          {/* CSP / X-Frame-Options fallback */}
          {iframeError && (
            <HBox
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                bgcolor: isDark ? "rgba(10,14,26,0.95)" : "rgba(255,255,255,0.95)",
                p: 2,
              }}
            >
              <VideoCallOutlinedIcon sx={{ fontSize: 28, color: "text.disabled" }} />
              <Typography
                sx={{ fontSize: 11, fontWeight: 700, color: "text.primary", textAlign: "center" }}
              >
                Meeting can't be embedded
              </Typography>
              <Typography
                sx={{ fontSize: 10, color: "text.secondary", textAlign: "center", lineHeight: 1.4 }}
              >
                The meeting URL blocked embedding via X-Frame-Options or CSP.
              </Typography>
              <HBox
                component="button"
                onClick={() => window.open(meetUrl, "_blank", "noopener,noreferrer")}
                sx={{
                  mt: 0.5,
                  px: 2,
                  py: 0.75,
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 1,
                  border: "none",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  cursor: "pointer",
                  "&:hover": { opacity: 0.88 },
                  transition: "opacity 150ms",
                }}
              >
                Open in new tab ↗
              </HBox>
            </HBox>
          )}
        </HBox>
      )}
    </HBox>
  );

  // Render into body via portal so it floats above all other UI layers
  return ReactDOM.createPortal(content, document.body);
};

export default FloatingMeetingWindow;
