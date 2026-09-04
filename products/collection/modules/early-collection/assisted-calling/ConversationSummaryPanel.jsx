import React, { useEffect, useRef } from "react";
import { Box, Chip, Typography } from "@mui/material";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { HBox, HLabel, HPaper } from "@helix/component-library";
import { useAssistedCallingUI } from "./useAssistedCallingUI";
import TranscriptBubble from "./TranscriptBubble";

/**
 * Live Transcript panel (summary lives in AI Assistant sticky section).
 *
 * @param {object}  props
 * @param {import("./types").TranscriptItem[]} props.transcript
 */
const ConversationSummaryPanel = ({ transcript = [] }) => {
  const { callActive } = useAssistedCallingUI();
  const transcriptRef = useRef(null);

  const getTranscriptKey = (item, index) =>
    item?.id || `${item?.ts || "na"}-${item?.speaker || "na"}-${index}`;

  useEffect(() => {
    if (transcriptRef.current && transcript.length > 0) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript.length]);

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
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 0.75,
          background: "transparent",
        }}
      >
        <MessageOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} />
        <HLabel
          value="label.assistedCalling.liveTranscript"
          colon={false}
          align="left"
          sx={{ fontSize: 12, fontWeight: 500 }}
          translate
        />
        {callActive && (
          <Chip
            label="Streaming"
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

      <Box
        ref={transcriptRef}
        sx={{ minHeight: 120, maxHeight: 280, overflowY: "auto", pr: 0.5 }}
      >
        {transcript.length === 0 ? (
          <Typography sx={{ fontSize: 11, fontWeight: 400, color: "text.disabled", fontStyle: "italic" }}>
            Transcript will appear here once the call starts.
          </Typography>
        ) : (
          transcript.map((item, index) => (
            <TranscriptBubble key={getTranscriptKey(item, index)} item={item} />
          ))
        )}
      </Box>
    </HPaper>
  );
};

export default ConversationSummaryPanel;
