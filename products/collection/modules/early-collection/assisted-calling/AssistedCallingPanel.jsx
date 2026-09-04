import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import { HBox } from "@helix/component-library";
import AIInsightsPanel from "./AIInsightsPanel";
import ConversationSummaryPanel from "./ConversationSummaryPanel";
import DispositionPanel from "./DispositionPanel";
import { useAssistedCallingUI } from "./useAssistedCallingUI";
import { useStompClient } from "./useStompClient";
import { getTranscript, getTranscriptSummary } from "./assistedCallingApi";
import { normalizeSummaryEntry, parseConversationSummary } from "./summaryUtils";

/**
 * Inner content of the Assisted Calling side panel.
 *
 * Manages STOMP message data (transcript, insights, summary, etc.) from backend.
 * Subscriptions are established when callActive is true; data is received via STOMP handlers.
 *
 * @param {object}  props
 * @param {string}  [props.sessionId]   – account session ID for STOMP topic subscription
 * @param {Function}[props.onSave]      – disposition save callback
 * @param {Function}[props.onReset]     – disposition reset callback
 */
const AssistedCallingPanel = ({
  sessionId: propSessionId,
  onSave,
  onReset,
  onPhoneChange,
}) => {
  const { callActive, sessionId: hookSessionId, handleCallStatusUpdate } = useAssistedCallingUI();
  const sessionId = hookSessionId || propSessionId;
  
  // Local state for STOMP-sourced data
  const [transcript, setTranscript] = useState([]);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState([]);
  const [nextMoves, setNextMoves] = useState([]);
  const [nextActionPayload, setNextActionPayload] = useState(null);
  const [dispositionResetKey, setDispositionResetKey] = useState(0);
  const prevCallActiveRef = useRef(false);
  const postCallDisconnectRef = useRef(null);

  const mergeTranscriptItems = useCallback((prev, incoming) => {
    const merged = [...prev];
    for (const item of incoming) {
      if (!item || typeof item !== "object") continue;
      if (!item.text || !item.speaker) continue;

      const normalized = {
        ...item,
        id: item.id || `${item.ts || ""}-${item.speaker}-${item.text}`,
      };
      const exists = merged.some(
        (t) =>
          (normalized.id && t.id === normalized.id) ||
          (t.ts === normalized.ts && t.speaker === normalized.speaker && t.text === normalized.text)
      );
      if (!exists) merged.push(normalized);
    }
    return merged;
  }, []);

  const mergeInsights = useCallback((prev, incoming) => {
    const merged = [...prev];
    for (const item of incoming) {
      if (!item?.text) continue;
      const exists = merged.some((i) => i.id === item.id);
      if (!exists) merged.push(item);
    }
    return merged;
  }, []);

  const applyConversationSummary = useCallback((message) => {
    const { summaryItems, insightItems } = parseConversationSummary(message);
    if (summaryItems.length > 0) {
      setSummary(summaryItems);
    }
    if (insightItems.length > 0) {
      setInsights((prev) => mergeInsights(prev, insightItems));
    }
  }, [mergeInsights]);

  const fetchPostCallSummary = useCallback(async (sid) => {
    const retryDelaysMs = [0, 2000, 5000, 10000];
    for (const delay of retryDelaysMs) {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      try {
        const res = await getTranscriptSummary(sid);
        if (!res?.success || !res?.data) continue;
        const { summaryItems, insightItems } = parseConversationSummary(res.data);
        if (summaryItems.length > 0 || insightItems.length > 0) {
          applyConversationSummary(res.data);
          return;
        }
      } catch (err) {
        console.warn("getTranscriptSummary post-call fetch failed", err);
      }
    }
  }, [applyConversationSummary]);

  // STOMP message handlers
  const handleTranscript = useCallback((data) => {
    if (!data) return;

    // Per-turn: `{ speaker, text, ts, sentiment }`
    // Batch replay: `{ transcript: [...] }` or full call-end envelope
    const transcriptData = data?.body ?? data?.transcript ?? data;
    const items = Array.isArray(transcriptData)
      ? transcriptData
      : Array.isArray(transcriptData?.transcript)
      ? transcriptData.transcript
      : [transcriptData];

    setTranscript((prev) => mergeTranscriptItems(prev, items));
  }, [mergeTranscriptItems]);

  const handleMeetUrl = useCallback((data) => {
    console.log("STOMP meet-url", data);
    // Meet URL is consumed by native LiveKit integration (no iframe rendering).
  }, []);

  const handleInsights = useCallback((data) => {
    // Backend multiplexes insights: message may be
    //  - { type, sessionId, data: {...} }
    //  - { insights: [...] }
    //  - raw array or single object
    if (!data) return;

    // If message carries a top-level `type` (e.g., copilot:next-move), normalize into an item
    if (data?.type) {
      const d = data.data || {};

      // Live copilot summary snippets also belong in the Summary section
      if (data.type === "copilot:summary") {
        const summaryText = d.summary || d.text || (Array.isArray(d.points) ? d.points.join("; ") : "");
        if (summaryText) {
          const entry = normalizeSummaryEntry({ text: summaryText, ts: d.ts || d.timestamp }, "summary");
          if (entry) {
            setSummary((prev) => {
              const existing = prev || [];
              const duplicate = existing.some((item) => item.text === entry.text);
              return duplicate ? existing : [...existing, entry];
            });
          }
        }
      }

      const item = {
        id: d.id || d.insightId || `${data.type}-${Date.now()}`,
        type: data.type,
        text: Array.isArray(d.points) ? d.points.join("; ") : d.text || d.points && String(d.points) || d.summary || d.detail || "",
        priority: d.priority || d.priorityLevel || "",
        raw: d,
      };
      setInsights((prev) => {
        const existing = prev || [];
        const exists = item.id ? existing.some(i => i.id === item.id) : false;
        return exists ? existing : [...existing, item];
      });

      // If this next-move includes actionable points, also set nextMoves
      if (Array.isArray(d.points) && d.points.length) {
        setNextMoves(d.points.map(p => ({ action: p, headline: p, detail: "" })));
      }
      return;
    }

    const payload = data?.data || data?.insights || data;
    if (!payload) return;

    if (Array.isArray(payload)) {
      setInsights((prev) => {
        const existing = prev || [];
        const merged = [...existing];
        for (const item of payload) {
          if (!item) continue;
          const normalized = {
            id: item.id || item.insightId || `${item.type || 'insight'}-${Math.random().toString(36).slice(2,9)}`,
            type: item.type || item.kind || "insight",
            text: item.text || (item.points ? (Array.isArray(item.points) ? item.points.join('; ') : String(item.points)) : ""),
            priority: item.priority || item.priorityLevel || "",
            raw: item,
          };
          const exists = merged.some(i => i.id === normalized.id);
          if (!exists) merged.push(normalized);
        }
        return merged;
      });
    } else if (typeof payload === 'object') {
      const item = payload;
      const normalized = {
        id: item.id || item.insightId || `insight-${Math.random().toString(36).slice(2,9)}`,
        type: item.type || item.kind || "insight",
        text: item.text || (item.points ? (Array.isArray(item.points) ? item.points.join('; ') : String(item.points)) : ""),
        priority: item.priority || item.priorityLevel || "",
        raw: item,
      };
      setInsights((prev) => {
        const existing = prev || [];
        const exists = existing.some(i => i.id === normalized.id);
        return exists ? existing : [...existing, normalized];
      });
    }
  }, []);

  const handleStatus = useCallback((data) => {
    // Status payloads may include customerMobile, event, message
    const statusData = data?.status || data?.data || data;
    handleCallStatusUpdate(statusData);

    const phoneValue = statusData?.customerMobile || statusData?.phone || "";
    if (typeof onPhoneChange === "function") {
      onPhoneChange(phoneValue);
    }

    const event = statusData?.event || data?.event;
    if (event === "call_ended" && sessionId) {
      getTranscript(sessionId)
        .then((res) => {
          if (!res?.success) return;
          const items = Array.isArray(res?.data) ? res.data : res?.data?.transcript;
          if (!Array.isArray(items) || items.length === 0) return;
          setTranscript((prev) => mergeTranscriptItems(prev, items));
        })
        .catch((err) => {
          console.warn("getTranscript REST fallback failed", err);
        });

      getTranscriptSummary(sessionId)
        .then((res) => {
          if (!res?.success || !res?.data) return;
          applyConversationSummary(res.data);
        })
        .catch((err) => {
          console.warn("getTranscriptSummary REST fallback failed", err);
        });
    }
  }, [sessionId, mergeTranscriptItems, onPhoneChange, applyConversationSummary, handleCallStatusUpdate]);

  const handleSummary = useCallback((message) => {
    if (!message) {
      setSummary([]);
      return;
    }
    applyConversationSummary(message);
  }, [applyConversationSummary]);

  const handleNextAction = useCallback((data) => {
    console.log("STOMP next-action", data);
    setNextActionPayload(data);
    applyConversationSummary(data);
  }, [applyConversationSummary]);

  const handleIncomingCall = useCallback((data) => {
    // TODO: Trigger incoming call notification/modal
  }, []);

  const { connect, disconnect } = useStompClient({
    autoConnect: false,
    sessionId,
    onIncomingCall: handleIncomingCall,
    onTranscript: handleTranscript,
    onMeetUrl: handleMeetUrl,
    onInsights: handleInsights,
    onStatus: handleStatus,
    onSummary: handleSummary,
    onNextAction: handleNextAction,
  });

  useEffect(() => {
    const becameActive = callActive && !prevCallActiveRef.current;
    const becameInactive = !callActive && prevCallActiveRef.current;
    prevCallActiveRef.current = callActive;

    if (becameActive) {
      if (postCallDisconnectRef.current) {
        clearTimeout(postCallDisconnectRef.current);
        postCallDisconnectRef.current = null;
      }
      setTranscript([]);
      setInsights([]);
      setNextMoves([]);
      setSummary([]);
      setNextActionPayload(null);
      setDispositionResetKey((prev) => prev + 1);
    }

    if (callActive && sessionId) {
      connect();
    } else if (becameInactive) {
      if (sessionId) {
        fetchPostCallSummary(sessionId);
      }
      if (postCallDisconnectRef.current) {
        clearTimeout(postCallDisconnectRef.current);
      }
      postCallDisconnectRef.current = setTimeout(() => {
        postCallDisconnectRef.current = null;
        disconnect();
      }, 30000);
    }
  }, [callActive, sessionId, connect, disconnect, fetchPostCallSummary]);

  // Replay transcript history via REST when session starts (covers missed STOMP messages)
  useEffect(() => {
    if (!callActive || !sessionId) return undefined;

    let cancelled = false;
    getTranscript(sessionId)
      .then((res) => {
        if (cancelled || !res?.success) return;
        const items = Array.isArray(res?.data) ? res.data : res?.data?.transcript;
        if (!Array.isArray(items) || items.length === 0) return;
        setTranscript((prev) => mergeTranscriptItems(prev, items));
      })
      .catch((err) => {
        console.warn("getTranscript failed", err);
      });

    return () => {
      cancelled = true;
    };
  }, [callActive, sessionId, mergeTranscriptItems]);

  useEffect(() => {
    return () => {
      if (postCallDisconnectRef.current) {
        clearTimeout(postCallDisconnectRef.current);
        postCallDisconnectRef.current = null;
      }
    };
  }, []);

  // Load any existing summary via REST when a session starts (replay / reconnect)
  useEffect(() => {
    if (!callActive || !sessionId) return undefined;

    let cancelled = false;
    getTranscriptSummary(sessionId)
      .then((res) => {
        if (cancelled || !res?.success || !res?.data) return;
        applyConversationSummary(res.data);
      })
      .catch((err) => {
        console.warn("getTranscriptSummary failed", err);
      });

    return () => {
      cancelled = true;
    };
  }, [callActive, sessionId, applyConversationSummary]);

  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        width: "100%",
        minHeight: "100%",
        background: "transparent",
      }}
    >
      {/* Sticky AI Assistant: Next Best Move + Summary (left) | Insights (right) */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          bgcolor: "background.paper",
          pb: 0.75,
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <AIInsightsPanel nextMoves={nextMoves} insights={insights} summary={summary} />
      </Box>

      {/* Live Transcript + Disposition — scroll with panel body below sticky section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          pt: 1.25,
          flex: 1,
          minHeight: 0,
        }}
      >
        <ConversationSummaryPanel transcript={transcript} />
        <DispositionPanel
          onSave={onSave}
          onReset={onReset}
          summary={summary}
          nextActionData={nextActionPayload}
          resetKey={dispositionResetKey}
        />
      </Box>
    </HBox>
  );
};

export default AssistedCallingPanel;
