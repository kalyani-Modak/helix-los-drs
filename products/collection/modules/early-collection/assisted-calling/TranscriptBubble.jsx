import React from "react";
import { Box, Typography } from "@mui/material";
import { HBox, useDrsTheme } from "@helix/component-library";


/**
 * A single chat-bubble row in the live transcript panel.
 *
 * @param {object} props
 * @param {import("./types").TranscriptItem} props.item
 */
const SENTIMENT_COLOR = {
  positive: "success.main",
  neutral:  "text.disabled",
  negative: "error.main",
};

const TranscriptBubble = ({ item }) => {
  const { surfaces, border } = useDrsTheme();
  if (!item?.text) return null;

  const isAgent = item.speaker === "agent";

  return (
    <HBox
      sx={{
        display: "flex",
        justifyContent: isAgent ? "flex-end" : "flex-start",
        mb: 0.5,
        background: "transparent",
      }}
    >
      <Box
        sx={{
          maxWidth: "85%",
          borderRadius: 2,
          px: 1.5,
          py: 1,
          fontSize: 12,
          border: `1px solid`,
          borderColor: isAgent ? "primary.light" : "divider",
          bgcolor: isAgent
            ? (theme) => `${theme.palette.primary.main}18`
            : surfaces.panel,
        }}
      >
        {/* Speaker row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: SENTIMENT_COLOR[item.sentiment] || "text.disabled",
              flexShrink: 0,
            }}
          />
          <Typography
            component="span"
            sx={{ fontSize: 9, fontWeight: 500, textTransform: "uppercase", color: "text.secondary" }}
          >
            {isAgent ? "Agent" : "Customer"}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 9, color: "text.disabled", ml: "auto" }}
          >
            {item.ts}
          </Typography>
        </Box>

        {/* Bubble text */}
        <Typography sx={{ fontSize: 12, fontWeight: 400, color: "text.primary" }}>
          {item.text}
        </Typography>
      </Box>
    </HBox>
  );
};

export default TranscriptBubble;
