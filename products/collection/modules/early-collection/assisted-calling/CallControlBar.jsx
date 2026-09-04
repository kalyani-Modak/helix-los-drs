import React from "react";
import { Button, IconButton, Tooltip } from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PhoneDisabledOutlinedIcon from "@mui/icons-material/PhoneDisabledOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { HBox, HLabel } from "@helix/component-library";
import { useAssistedCallingUI } from "./useAssistedCallingUI";
import Waveform from "./Waveform";

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * Compact call controls embedded in the Assisted Calling panel header.
 */
const CallControlBar = ({ phone = "" }) => {
  const {
    callActive,
    callPhase,
    callSeconds,
    micEnabled,
    toggleMic,
    startCallServer,
    endCallServer,
    activeCustomerMobile,
  } =
    useAssistedCallingUI();
  const displayPhone = activeCustomerMobile || phone;

  return (
    <HBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0.75,
        px: 0,
        py: 0,
        flexWrap: "nowrap",
        flexShrink: 0,
      }}
    >
      <Button
        size="small"
        variant="contained"
        color={callActive ? "error" : "primary"}
        startIcon={
          callActive
            ? <PhoneDisabledOutlinedIcon sx={{ fontSize: 12 }} />
            : <PhoneOutlinedIcon sx={{ fontSize: 12 }} />
        }
        onClick={async () => {
          if (!callActive) {
            try {
              await startCallServer({ customer: { mobile: phone } });
            } catch (e) {
              console.error(e);
            }
          } else {
            try {
              await endCallServer({ result: null, notes: "Ended from UI" });
            } catch (e) {
              console.error(e);
            }
          }
        }}
        sx={{
          whiteSpace: "nowrap",
          fontSize: 10,
          fontWeight: 500,
          lineHeight: 1.2,
          px: 1,
          py: 0.25,
          minWidth: 0,
          minHeight: 24,
          "& .MuiButton-startIcon": { mr: 0.5, ml: 0 },
          "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: 12 },
        }}
      >
        {callActive ? "End Call" : "Start Call"}
      </Button>

      <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 48, flexShrink: 0 }}>
        <HBox
          component="span"
          sx={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            bgcolor: callActive ? "error.main" : "action.disabled",
            flexShrink: 0,
            animation: callActive ? "acPulse 1.4s ease-in-out infinite" : "none",
            "@keyframes acPulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.35 },
            },
          }}
        />
        <HLabel
          value={callPhase === "connected" ? formatTime(callSeconds) : "--:--"}
          colon={false}
          translate={false}
          sx={{
            fontSize: 10,
            fontWeight: 400,
            fontFamily: "monospace",
            color: callPhase === "connected" ? "error.main" : "text.disabled",
            fontVariantNumeric: "tabular-nums",
          }}
        />
      </HBox>

      {callPhase === "ringing" ? (
        <HLabel
          value="Ringing..."
          colon={false}
          translate={false}
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "warning.main",
            whiteSpace: "nowrap",
          }}
        />
      ) : null}

      {callPhase === "disconnected" ? (
        <HLabel
          value="Disconnected"
          colon={false}
          translate={false}
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "error.main",
            whiteSpace: "nowrap",
          }}
        />
      ) : null}

      {displayPhone ? (
        <HLabel
          value={displayPhone}
          colon={false}
          translate={false}
          sx={{
            fontSize: 10,
            fontWeight: 400,
            color: "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            minWidth: 0,
          }}
        />
      ) : null}

      <Waveform active={callActive && micEnabled} sx={{ ml: 0.25, height: 12 }} />

      <Tooltip title={micEnabled ? "Mute" : "Unmute"}>
        <span>
          <IconButton
            size="small"
            disabled={!callActive}
            onClick={toggleMic}
            sx={{
              width: 22,
              height: 22,
              p: 0.25,
              flexShrink: 0,
              border: "1px solid",
              borderColor: micEnabled ? "divider" : "error.light",
              bgcolor: micEnabled ? "transparent" : (t) => `${t.palette.error.main}12`,
            }}
          >
            {micEnabled
              ? <MicOutlinedIcon sx={{ fontSize: 12 }} />
              : <MicOffOutlinedIcon sx={{ fontSize: 12, color: "error.main" }} />}
          </IconButton>
        </span>
      </Tooltip>
    </HBox>
  );
};

export default CallControlBar;
