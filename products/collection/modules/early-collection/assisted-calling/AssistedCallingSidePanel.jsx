import React, { useCallback, useRef, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { HBox, useDrsTheme } from "@helix/component-library";

import { useIntl } from "react-intl";
import { AssistedCallingUIProvider, useAssistedCallingUI } from "./useAssistedCallingUI";
import AssistedCallingPanel from "./AssistedCallingPanel";
import CallControlBar from "./CallControlBar";
// Open wider by default so the panel matches the expected workspace layout.
export const ASSISTED_CALLING_PANEL_WIDTH = 600;

const MIN_WIDTH = 280;
const MAX_WIDTH = 700;

// ─── Inner component (needs context) ──────────────────────────────────────────

const AssistedCallingSidePanelInner = ({ open, onToggle, panelProps = {}, onWidthChange }) => {
  const { themeVars, surfaces, theme } = useDrsTheme();
  const { callActive } = useAssistedCallingUI();
  const intl = useIntl();

  const [panelWidth, setPanelWidth] = useState(ASSISTED_CALLING_PANEL_WIDTH);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(ASSISTED_CALLING_PANEL_WIDTH);
  const [phone, setPhone] = useState("");

  const handlePhoneChange = useCallback((value) => {
    setPhone(value || "");
  }, []);

  const title = intl.formatMessage({
    id: "label.assistedCalling.title",
    defaultMessage: "Assisted Calling",
  });

  // ── Drag handle handlers ──────────────────────────────────────────────────
  const handleDragMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = panelWidth;

      const onMouseMove = (moveEvt) => {
        if (!isDragging.current) return;
        // Dragging left edge: moving mouse left increases width, right decreases
        const delta = startX.current - moveEvt.clientX;
        const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
        setPanelWidth(newWidth);
        if (typeof onWidthChange === "function") onWidthChange(newWidth);
      };

      const onMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [panelWidth, onWidthChange],
  );

  return (
    <HBox
      sx={{
        width: open ? panelWidth : 0,
        flexShrink: 0,
        transition: isDragging.current ? "none" : "width 225ms cubic-bezier(0, 0, 0.2, 1)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${theme.palette.divider}`,
        backgroundColor: surfaces.paper,
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      {/* ── Drag handle (left edge) ─────────────────────────────────────── */}
      {open && (
        <Box
          onMouseDown={handleDragMouseDown}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: "ew-resize",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              "& .drag-indicator": {
                opacity: 1,
              },
            },
          }}
        >
          <DragIndicatorIcon
            className="drag-indicator"
            sx={{
              fontSize: 14,
              color: "text.disabled",
              opacity: 0,
              transition: "opacity 150ms",
              pointerEvents: "none",
            }}
          />
        </Box>
      )}

      {/* ── Collapsed tab ─────────────────────────────────────────────── */}
      {!open && (
        <button
          onClick={onToggle}
          style={{
            position: "fixed",
            right: 0,
            top: "40%",
            transform: "translateY(-50%)",
            zIndex: 1300,
            borderRadius: "8px 0 0 8px",
            border: `1px solid ${theme.palette.divider}`,
            borderRight: "none",
            backgroundColor: surfaces.paper,
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            boxShadow: "-2px 0 8px rgba(0,0,0,0.08)",
          }}
          title={title}
        >
          <ChevronLeftIcon sx={{ fontSize: 15, color: "text.primary" }} />
          <Box sx={{ position: "relative" }}>
            <PhoneInTalkOutlinedIcon sx={{ fontSize: 15, color: "primary.main" }} />
            {callActive && (
              <FiberManualRecordIcon
                sx={{
                  fontSize: 7,
                  color: "error.main",
                  position: "absolute",
                  top: -2,
                  right: -2,
                  animation: "acPulse 1.4s ease-in-out infinite",
                  "@keyframes acPulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                  },
                }}
              />
            )}
          </Box>
        </button>
      )}

      {/* ── Panel header ──────────────────────────────────────────────── */}
      {open && (
        <>
          <HBox
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.25,
              py: 0.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
              background: surfaces.paper,
              ...themeVars,
            }}
          >
            <PhoneInTalkOutlinedIcon sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: "text.primary", flexShrink: 0 }}>
              {title}
            </Typography>

            {/* Live indicator badge */}
            {callActive && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.35, flexShrink: 0 }}>
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 7,
                    color: "error.main",
                    animation: "acPulse 1.4s ease-in-out infinite",
                    "@keyframes acPulse": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.35 },
                    },
                  }}
                />
                <Typography sx={{ fontSize: 9, fontWeight: 500, color: "error.main" }}>
                  Live
                </Typography>
              </Box>
            )}
            <Box sx={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
              <CallControlBar phone={phone} />
            </Box>

            {/* Close button */}
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={onToggle}
                sx={{
                  ml: 0.5,
                  flexShrink: 0,
                  width: 20,
                  height: 20,
                  p: 0,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          </HBox>

          {/* ── Panel body (scrollable) ──────────────────────────────── */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: 1.5,
              py:0.5
            }}
          >
           
            <AssistedCallingPanel {...panelProps} onPhoneChange={handlePhoneChange} />
          </Box>
        </>
      )}
    </HBox>
  );
};

// ─── Exported component (wraps provider) ──────────────────────────────────────

/**
 * Assisted Calling side panel — mirrors the FollowUpSidePanel pattern.
 *
 * Wraps AssistedCallingUIProvider so the panel is self-contained and can be
 * dropped into EarlyCollectionAccountWorkspaceLayout alongside FollowUpSidePanel.
 *
 * @param {object}   props
 * @param {boolean}  props.open        – controlled open state
 * @param {Function} props.onToggle    – toggle callback (parent manages open state)
 * @param {object}   [props.panelProps] – forwarded to AssistedCallingPanel
 * @param {Function} [props.onWidthChange] – called with new pixel width when user drags
 */
const AssistedCallingSidePanel = ({ open, onToggle, panelProps = {}, onWidthChange }) => (
  <AssistedCallingUIProvider>
    <AssistedCallingSidePanelInner
      open={open}
      onToggle={onToggle}
      panelProps={panelProps}
      onWidthChange={onWidthChange}
    />
  </AssistedCallingUIProvider>
);

export default AssistedCallingSidePanel;
