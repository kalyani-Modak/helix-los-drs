import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { HBox, HLabel, HPaper } from "@helix/component-library";
import { CALL_BEHAVIOUR, PAST_COMMUNICATIONS } from "../../assisted-calling/assistedCallingSeedData";
import { Divider } from "@mui/material";
// ── Helpers ───────────────────────────────────────────────────────────────────

const initials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

/** Collapses a sentiment string to a theme colour token. */
const sentimentColor = (sentiment, theme) => {
  if (sentiment === "positive") return theme.palette.success.main;
  if (sentiment === "negative") return theme.palette.error.main;
  return theme.palette.text.disabled;
};

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Small icon + label + value field (Best Time / Preferred / Language).
 */
const MiniField = ({ icon: Icon, label, value }) => (
  <HBox
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.75,
      minWidth: 0,
      background: "transparent",
    }}
  >
    <Icon sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }} />
    <HBox sx={{ minWidth: 0, background: "transparent" }}>
      <HLabel
        value={label}
        colon={false}
        translate={false}
        align="left"
        sx={{
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "text.secondary",
          lineHeight: 1.2,
          display: "block",
        }}
      />
      <HLabel
        value={value}
        colon={false}
        translate={false}
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: "text.primary",
          lineHeight: 1.2,
          display: "block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      />
    </HBox>
  </HBox>
);

// ── Main component ────────────────────────────────────────────────────────────

const CustomerProfileSummary = () => {
  const theme = useTheme();
  const { headerData } = useSelector((s) => s.account);

  // Customer name from live account header data; fall back gracefully
  const name = headerData?.szName || "Customer";

  // Cooperation score & derived badge colour
  const score = CALL_BEHAVIOUR.cooperationScore;
  const scoreColor =
    score > 70
      ? { bg: `${theme.palette.success.main}18`, border: `${theme.palette.success.main}50`, text: theme.palette.success.dark }
      : score > 45
      ? { bg: `${theme.palette.warning.main}18`, border: `${theme.palette.warning.main}50`, text: theme.palette.warning.dark }
      : { bg: `${theme.palette.error.main}14`, border: `${theme.palette.error.main}40`, text: theme.palette.error.dark };

  // Last 3 communications in reverse-chronological order
  const recent = PAST_COMMUNICATIONS.slice(-3).reverse();

  return (
    <HPaper
      elevation={0}
      sx={{
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
      }}
    >
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.25,
          py: 0.625,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <PersonOutlineOutlinedIcon sx={{ fontSize: 12, color: "primary.main" }} />
        <HLabel
          value="Customer Profile"
          colon={false}
          translate={false}
          sx={{ fontSize: 11, fontWeight: 600, color: "text.primary" }}
        />
      </HBox>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          px: 1,
          py: 0.75,
          background: "transparent",
        }}
      >
        {/* Identity — avatar + name + score badge */}
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
            background: "transparent",
          }}
        >
          {/* Avatar circle */}
          <HBox
            sx={{
              height: 32,
              width: 32,
              borderRadius: "50%",
              bgcolor: (t) => `${t.palette.primary.main}18`,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials(name)}
          </HBox>

          <HBox sx={{ minWidth: 0, background: "transparent" }}>
            {/* Customer name */}
            <HLabel
              value={name}
              colon={false}
              translate={false}
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "text.primary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            />

            {/* Cooperation score badge */}
            <HBox
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 9,
                fontWeight: 600,
                px: 0.75,
                height: 16,
                borderRadius: 0.75,
                border: "1px solid",
                bgcolor: scoreColor.bg,
                borderColor: scoreColor.border,
                color: scoreColor.text,
                letterSpacing: "0.04em",
              }}
            >
              {`Cooperation ${score}%`}
            </HBox>
          </HBox>
        </HBox>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Behaviour fields */}
        <HBox
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
            flex: 1,
            minWidth: 280,
            background: "transparent",
          }}
        >
          <MiniField icon={AccessTimeOutlinedIcon} label="Best Time" value={CALL_BEHAVIOUR.bestTimeToCall} />
          <MiniField icon={ChatBubbleOutlineOutlinedIcon} label="Preferred" value={CALL_BEHAVIOUR.preferredChannel} />
          <MiniField icon={TranslateOutlinedIcon} label="Language" value={CALL_BEHAVIOUR.languagePref} />
        </HBox>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />


        {/* Recent comms chips */}
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexWrap: "wrap",
            background: "transparent",
          }}
        >
          <HLabel
            value="Recent"
            colon={false}
            translate={false}
            sx={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
            }}
          />

          {recent.map((c, i) => (
            <HBox
              key={i}
              title={c.summary}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.75,
                px: 0.75,
                py: 0.25,
                bgcolor: "background.paper",
                cursor: "default",
              }}
            >
              {/* Sentiment dot */}
              <HBox
                component="span"
                sx={{
                  height: 6,
                  width: 6,
                  borderRadius: "50%",
                  bgcolor: sentimentColor(c.customerSentiment, theme),
                  flexShrink: 0,
                }}
              />

              <HLabel
                value={c.channel}
                colon={false}
                translate={false}
                sx={{ fontSize: 10, fontWeight: 600, color: "text.primary" }}
              />
              <HLabel
                value={c.date}
                colon={false}
                translate={false}
                sx={{ fontSize: 10, color: "text.secondary" }}
              />
              <HLabel
                value="·"
                colon={false}
                translate={false}
                sx={{ fontSize: 10, color: "text.secondary" }}
              />
              <HLabel
                value={c.outcome}
                colon={false}
                translate={false}
                sx={{ fontSize: 10, color: "text.primary" }}
              />
            </HBox>
          ))}
        </HBox>
      </HBox>
    </HPaper>
  );
};

export default CustomerProfileSummary;
