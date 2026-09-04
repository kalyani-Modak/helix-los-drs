import React from "react";
import { Box } from "@mui/material";

const BAR_COUNT = 14;

/**
 * Animated waveform bars that pulse when the mic is active.
 *
 * @param {object} props
 * @param {boolean} props.active  – true while a call is live and mic is enabled
 * @param {object}  [props.sx]    – additional MUI sx overrides
 */
const Waveform = ({ active, sx = {} }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-end",
      gap: "1.5px",
      height: 12,
      ...sx,
    }}
  >
    {Array.from({ length: BAR_COUNT }).map((_, i) => (
      <Box
        key={i}
        sx={{
          width: 2,
          borderRadius: 99,
          bgcolor: "primary.main",
          opacity: active ? 1 : 0.35,
          height: active ? `${20 + ((i * 37) % 70)}%` : "20%",
          transition: "height 0.3s ease, opacity 0.3s ease",
          animation: active ? "pulse 1.2s ease-in-out infinite" : "none",
          animationDelay: active ? `${i * 60}ms` : "0ms",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.5 },
          },
        }}
      />
    ))}
  </Box>
);

export default Waveform;
