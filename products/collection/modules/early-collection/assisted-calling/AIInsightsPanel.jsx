import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import GppBadOutlinedIcon from "@mui/icons-material/GppBadOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { HBox, HLabel, HPaper, useDrsTheme } from "@helix/component-library";

import { useAssistedCallingUI } from "./useAssistedCallingUI";
import { normalizeSummaryEntry } from "./summaryUtils";

const ICON_FOR_TYPE = {
  intent: TrackChangesOutlinedIcon,
  suggestion: LightbulbOutlinedIcon,
  policy: GppBadOutlinedIcon,
  alert: NotificationsActiveOutlinedIcon,
  sentiment: FavoriteOutlinedIcon,
};

const PRIORITY_COLOR = {
  high: "error.main",
  medium: "warning.main",
  low: "primary.light",
};

const toText = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map((i) => (typeof i === "string" ? i : String(i))).join("; ");
  return String(v);
};

const SectionLabel = ({ children }) => (
  <Typography
    sx={{ fontSize: 10, textTransform: "uppercase", color: "text.disabled", fontWeight: 500, mb: 0.5 }}
  >
    {children}
  </Typography>
);

/**
 * AI Assistant panel — sticky two-column layout:
 *   Left:  Next Best Move + Summary
 *   Right: Insights
 */
const AIInsightsPanel = ({ nextMoves = [], insights = [], summary = [] }) => {
  const { callActive } = useAssistedCallingUI();
  const { surfaces } = useDrsTheme();
  const latestMove = nextMoves[0];

  const summaryItems = summary.filter((item) => !item?.kind || item.kind === "summary");
  const allInsights = insights.filter((item) => item?.text);

  const renderSummaryText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    return normalizeSummaryEntry(item, "summary")?.text || item.text || "";
  };

  return (
    <HPaper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.75,
          background: "transparent",
          flexShrink: 0,
        }}
      >
        <AutoAwesomeOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
        <HLabel
          value="label.assistedCalling.aiAssistant"
          colon={false}
          align="left"
          sx={{ fontSize: 12, fontWeight: 500 }}
          translate
        />
        {callActive && (
          <Chip
            label="Live"
            size="small"
            variant="outlined"
            color="primary"
            sx={{
              ml: "auto",
              fontSize: 9,
              height: 18,
              animation: "acPulse 1.4s ease-in-out infinite",
              "@keyframes acPulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.4 },
              },
            }}
          />
        )}
      </HBox>

      {/* Two-column body */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          minHeight: 110,
          maxHeight: 200,
          overflow: "hidden",
        }}
      >
        {/* Left: Next Best Move + Summary */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <SectionLabel>Next Best Move</SectionLabel>
            {latestMove ? (
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "primary.light",
                  bgcolor: (t) => `${t.palette.primary.main}0D`,
                  borderRadius: 1.5,
                  p: 0.75,
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 400, mb: 0.25 }}>
                  {toText(latestMove?.headline)}
                </Typography>
                <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.secondary", mb: latestMove?.script ? 0.75 : 0 }}>
                  {toText(latestMove?.detail)}
                </Typography>
                {latestMove.script && (
                  <Box
                    sx={{
                      fontSize: 11,
                      fontStyle: "italic",
                      bgcolor: surfaces.panel,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography component="span" sx={{ fontSize: 11, fontWeight: 400, fontStyle: "italic" }}>
                      &ldquo;{latestMove.script}&rdquo;
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 1,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.disabled", fontStyle: "italic" }}>
                  {callActive
                    ? "Listening… next best move will appear here."
                    : "Start a call to receive AI guidance."}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <SectionLabel>Summary</SectionLabel>
            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
              {summaryItems.length === 0 ? (
                <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.disabled", fontStyle: "italic" }}>
                  No summary yet.
                </Typography>
              ) : (
                summaryItems.map((s, i) => {
                  const text = renderSummaryText(s);
                  const tsText = s?.ts || s?.timestamp || "";
                  if (!text) return null;
                  return (
                    <Box key={`summary-${i}`} sx={{ display: "flex", gap: 0.75, mb: 0.75 }}>
                      <FiberManualRecordIcon
                        sx={{ fontSize: 8, mt: 0.5, color: "primary.main", flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 11, fontWeight: 400, wordBreak: "break-word" }}>{text}</Typography>
                      </Box>
                      {tsText ? (
                        <Typography sx={{ fontSize: 9, color: "text.disabled", whiteSpace: "nowrap" }}>
                          {tsText}
                        </Typography>
                      ) : null}
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>

        {/* Right: Insights */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid",
            borderColor: "divider",
            pl: 1,
            overflow: "hidden",
          }}
        >
          <SectionLabel>Insights</SectionLabel>
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
            {allInsights.length === 0 ? (
              <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.disabled", fontStyle: "italic" }}>
                No insights yet.
              </Typography>
            ) : (
              allInsights.map((insight, idx) => {
                const IconComponent = ICON_FOR_TYPE[insight.type] || LightbulbOutlinedIcon;
                return (
                  <Box
                    key={insight.id ?? idx}
                    sx={{
                      borderLeft: "3px solid",
                      borderLeftColor: PRIORITY_COLOR[insight.priority] || "primary.light",
                      borderRadius: "0 6px 6px 0",
                      bgcolor: (t) => {
                        const color =
                          insight.priority === "high"
                            ? t.palette.error.main
                            : insight.priority === "medium"
                            ? t.palette.warning.main
                            : t.palette.primary.main;
                        return `${color}0A`;
                      },
                      px: 1,
                      py: 0.75,
                      mb: 0.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                      <IconComponent sx={{ fontSize: 11 }} />
                      <Typography sx={{ fontSize: 9, textTransform: "uppercase", fontWeight: 500 }}>
                        {insight.type || "insight"}
                      </Typography>
                      {(insight.ts || insight.raw?.time) ? (
                        <Typography sx={{ fontSize: 9, color: "text.disabled", ml: "auto" }}>
                          {insight.ts || insight.raw?.time}
                        </Typography>
                      ) : null}
                    </Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 400 }}>{toText(insight.text)}</Typography>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </Box>
    </HPaper>
  );
};

export default AIInsightsPanel;
