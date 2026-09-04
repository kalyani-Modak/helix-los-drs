import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Lightweight UI-only context for the Assisted Calling panel.
 *
 * Tracks only the state needed to drive the UI:
 *  - Panel open/close
 *  - Visual call-active flag (no real telephony)
 *  - Timer display
 *  - Mic toggle
 *  - Disposition draft form values
 *
 * Real transcript / WebSocket / call-control logic can be integrated later
 * by replacing the stubs here without touching any UI components.
 */
import { useSelector } from "react-redux";
import { AssistedCallingAPI } from "../apiEndpoints";

const PANEL_KEY = "drs.assistedCalling.panelOpen";

const EMPTY_DISPOSITION = {
  result: "",
  reasonCode: "",
  ptpAmount: "",
  ptpDate: "",
  nextAction: "",
  nextActionDate: "",
  notes: "",
};

const parseMeetUrl = (rawMeetUrl) => {
  if (!rawMeetUrl) return "";
  const value = String(rawMeetUrl).trim();

  // Supports markdown-like payloads: [url](url)
  const markdownMatch = value.match(/\((https?:\/\/[^)]+)\)/i);
  if (markdownMatch?.[1]) return markdownMatch[1];

  // Supports bracket-only payloads: [url]
  const bracketMatch = value.match(/^\[(https?:\/\/[^\]]+)\]$/i);
  if (bracketMatch?.[1]) return bracketMatch[1];

  return value;
};

const getLiveKitConnectionDetails = (rawMeetUrl) => {
  const normalizedMeetUrl = parseMeetUrl(rawMeetUrl);
  const url = new URL(normalizedMeetUrl);
  const token = url.searchParams.get("token") || "";
  const liveKitUrlRaw = url.searchParams.get("liveKitUrl") || "";
  const liveKitUrl = liveKitUrlRaw ? decodeURIComponent(liveKitUrlRaw) : "";

  if (!token || !liveKitUrl) {
    throw new Error("LiveKit meetUrl is missing token or liveKitUrl");
  }

  return { token, liveKitUrl, normalizedMeetUrl };
};

const normalizeCallEvent = (statusPayload) => {
  const raw =
    statusPayload?.event ||
    statusPayload?.status ||
    statusPayload?.state ||
    statusPayload?.callStatus ||
    "";
  return String(raw).trim().toLowerCase();
};

const isAnsweredEvent = (eventKey) =>
  /answer|connected|pickup|in[_-]?progress|talk/i.test(eventKey);

const isRingingEvent = (eventKey) =>
  /ring|dial|initiated|calling|progress|trying|alerting|active/i.test(eventKey);

const isEndedEvent = (eventKey) =>
  /end|ended|hangup|hanguped|completed|failed|busy|no[_-]?answer|cancel|disconnect|dropped/i.test(eventKey);

const AssistedCallingUIContext = createContext(null);
let assistedCallingMissingProviderWarned = false;

const ASSISTED_CALLING_FALLBACK_CONTEXT = {
  panelOpen: false,
  setPanelOpen: () => {},
  togglePanel: () => {},
  callActive: false,
  callPhase: "idle",
  callSeconds: 0,
  toggleCall: () => {},
  micEnabled: false,
  micError: "",
  toggleMic: async () => {},
  sessionId: null,
  meetUrl: null,
  activeCustomerMobile: "",
  liveKitConnected: false,
  handleCallStatusUpdate: () => {},
  startCallServer: async () => ({ success: false, message: "AssistedCallingUIProvider missing" }),
  endCallServer: async () => ({ success: false, message: "AssistedCallingUIProvider missing" }),
  disposition: EMPTY_DISPOSITION,
  setDisposition: () => {},
  resetDisposition: () => {},
};

export const AssistedCallingUIProvider = ({ children }) => {
  // ── Panel state ──────────────────────────────────────────────────────
  const [panelOpen, setPanelOpenRaw] = useState(() => {
    try {
      return localStorage.getItem(PANEL_KEY) === "1";
    } catch {
      return false;
    }
  });

  const setPanelOpen = useCallback((v) => {
    setPanelOpenRaw(v);
    try {
      localStorage.setItem(PANEL_KEY, v ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const togglePanel = useCallback(() => setPanelOpen((prev) => !prev), [setPanelOpen]);

  // ── Call state (UI-only) ──────────────────────────────────────────────
  const [callActive, setCallActive] = useState(false);
  const [callPhase, setCallPhase] = useState("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const { selectedRow } = useSelector((state) => state.account);

  // Track server sessionId from POST /call/start when a real call is started
  const [sessionId, setSessionId] = useState(null);
  const [meetUrl, setMeetUrl] = useState(null);
  const [activeCustomerMobile, setActiveCustomerMobile] = useState("");
  const [liveKitConnected, setLiveKitConnected] = useState(false);
  const [micError, setMicError] = useState("");
  const micStreamRef = useRef(null);
  const remoteAudioElementsRef = useRef(new Map());
  const liveKitRoomRef = useRef(null);
  const liveKitConnectVersionRef = useRef(0);
  const micBlockedPopupShownRef = useRef(false);

  const timerRef = useRef(null);

  const toggleCall = useCallback(() => {
    setCallActive((prev) => {
      const next = !prev;
      if (next) {
        setCallSeconds(0);
      }
      return next;
    });
  }, []);

  // Start / stop display timer when callActive changes
  useEffect(() => {
    if (callPhase === "connected") {
      timerRef.current = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callPhase]);

  const stopMicStream = useCallback(() => {
    if (!micStreamRef.current) return;
    micStreamRef.current.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;
  }, []);

  const setMicTracksEnabled = useCallback((enabled) => {
    if (!micStreamRef.current) return;
    micStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  }, []);

  const ensureMicStream = useCallback(async () => {
    if (micStreamRef.current && micStreamRef.current.active) {
      return micStreamRef.current;
    }

    if (!window.isSecureContext) {
      const secureErr = new Error("Microphone access requires HTTPS or localhost.");
      secureErr.name = "SecurityError";
      throw secureErr;
    }

    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error("Browser microphone API is not available");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    if (!stream.getAudioTracks || stream.getAudioTracks().length === 0) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error("No audio track available from microphone stream.");
    }

    micStreamRef.current = stream;
    return stream;
  }, []);

  const detachRemoteAudioTrack = useCallback((track, publication) => {
    const key = track?.sid || publication?.trackSid;
    const el = key ? remoteAudioElementsRef.current.get(key) : null;

    if (track?.detach) {
      try {
        const detached = track.detach();
        detached.forEach((node) => {
          try {
            node.pause?.();
            node.srcObject = null;
            node.remove?.();
          } catch {
            // no-op
          }
        });
      } catch {
        // no-op
      }
    }

    if (el) {
      try {
        el.pause?.();
        el.srcObject = null;
        el.remove?.();
      } catch {
        // no-op
      }
      remoteAudioElementsRef.current.delete(key);
    }
  }, []);

  const attachRemoteAudioTrack = useCallback((track, publication) => {
    if (!track || track.kind !== "audio") return;

    const key = track?.sid || publication?.trackSid;
    if (key && remoteAudioElementsRef.current.has(key)) return;

    const audioEl = track.attach();
    audioEl.autoplay = true;
    audioEl.muted = false;
    audioEl.playsInline = true;
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);

    const playPromise = audioEl.play?.();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        console.warn("Remote audio playback blocked", err);
      });
    }

    if (key) {
      remoteAudioElementsRef.current.set(key, audioEl);
    }
  }, []);

  const cleanupRemoteAudioElements = useCallback(() => {
    remoteAudioElementsRef.current.forEach((el) => {
      try {
        el.pause?.();
        el.srcObject = null;
        el.remove?.();
      } catch {
        // no-op
      }
    });
    remoteAudioElementsRef.current.clear();
  }, []);

  const disconnectLiveKit = useCallback(() => {
    const room = liveKitRoomRef.current;
    liveKitRoomRef.current = null;
    setLiveKitConnected(false);
    cleanupRemoteAudioElements();
    if (!room) return;
    try {
      room.disconnect();
    } catch (err) {
      console.warn("LiveKit disconnect warning", err);
    }
  }, [cleanupRemoteAudioElements]);

  const handleCallStatusUpdate = useCallback((statusPayload) => {
    const eventKey = normalizeCallEvent(statusPayload);
    if (!eventKey) return;

    if (isEndedEvent(eventKey)) {
      setCallPhase("disconnected");
      setCallActive(false);
      setMeetUrl(null);
      disconnectLiveKit();
      stopMicStream();
      setMicEnabled(false);
      return;
    }

    if (isAnsweredEvent(eventKey)) {
      setCallPhase((prev) => {
        if (prev !== "connected") {
          setCallSeconds(0);
        }
        return "connected";
      });
      setCallActive(true);
      return;
    }

    if (isRingingEvent(eventKey)) {
      setCallPhase((prev) => (prev === "connected" ? prev : "ringing"));
      setCallActive(true);
    }
  }, [disconnectLiveKit, stopMicStream]);

  const connectLiveKit = useCallback(async (rawMeetUrl, micState) => {
    const connectVersion = ++liveKitConnectVersionRef.current;
    disconnectLiveKit();

    const { Room, RoomEvent } = await import("livekit-client");
    const { token, liveKitUrl } = getLiveKitConnectionDetails(rawMeetUrl);

    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
    });

    room.on(RoomEvent.Disconnected, () => {
      if (liveKitRoomRef.current === room) {
        setLiveKitConnected(false);
      }
    });

    room.on(RoomEvent.TrackSubscribed, (track, publication) => {
      if (track?.kind === "audio") {
        setCallPhase((prev) => {
          if (prev !== "connected") {
            setCallSeconds(0);
          }
          return "connected";
        });
      }
      attachRemoteAudioTrack(track, publication);
    });

    room.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
      detachRemoteAudioTrack(track, publication);
    });

    await room.connect(liveKitUrl, token, {
      autoSubscribe: true,
    });

    try {
      await room.startAudio();
    } catch (err) {
      console.warn("Unable to start LiveKit audio context", err);
    }

    room.remoteParticipants.forEach((participant) => {
      participant.trackPublications.forEach((publication) => {
        const track = publication?.track;
        if (track?.kind === "audio") {
          attachRemoteAudioTrack(track, publication);
        }
      });
    });

    // Ignore stale connection attempts.
    if (connectVersion !== liveKitConnectVersionRef.current) {
      room.disconnect();
      return;
    }

    liveKitRoomRef.current = room;
    await room.localParticipant.setMicrophoneEnabled(Boolean(micState));
    setCallPhase((prev) => {
      if (prev !== "connected") {
        setCallSeconds(0);
      }
      return "connected";
    });
    setLiveKitConnected(true);
    setMicEnabled(Boolean(micState));
    setMicError("");
  }, [attachRemoteAudioTrack, detachRemoteAudioTrack, disconnectLiveKit]);

  const toggleMic = useCallback(async () => {
    if (!callActive) return;
    const nextMicState = !micEnabled;

    try {
      const room = liveKitRoomRef.current;
      if (room) {
        await room.localParticipant.setMicrophoneEnabled(nextMicState);
      } else {
        await ensureMicStream();
        setMicTracksEnabled(nextMicState);
      }
      setMicEnabled(nextMicState);
      setMicError("");
    } catch (err) {
      const micMsg =
        err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
          ? "Microphone permission denied. Please allow microphone access in browser settings."
          : err?.message || "Unable to change microphone state.";
      setMicError(micMsg);
      setMicEnabled(false);
      console.error("Unable to toggle microphone", micMsg, err);
    }
  }, [callActive, micEnabled, ensureMicStream, setMicTracksEnabled]);

  // ----- server integration helpers (async) -----
  const startCallServer = useCallback(async (customerData = {}) => {
    try {
      micBlockedPopupShownRef.current = false;
      setCallPhase("ringing");
      setCallSeconds(0);

      // Ask permission before call API so browser shows prompt in click gesture context.
      await ensureMicStream();

      const agreementIdFromRow =
        selectedRow?.szLegacyAccountNo ||
        selectedRow?.agreementNo ||
        selectedRow?.ACNT_SEQNO ||
        customerData?.agreementId ||
        customerData?.customer?.agreementId;
      const agreementId = agreementIdFromRow;
      let payloadCustomerData = customerData;
      try {
        const url = AssistedCallingAPI.fetchCustomerDetails(agreementId);
        const { HAxiosService } = await import("@helix/component-library");
        const resp = await HAxiosService.GET(url);
        if (resp) {
          payloadCustomerData = resp.data ?? resp;
        }
      } catch (e) {
        console.warn("early-collection HAxios fetch failed", e);
      }

      const { startCall } = await import("./assistedCallingApi");
      const res = await startCall({
        agreementId: agreementId || payloadCustomerData?.customer?.agreementId || payloadCustomerData?.agreementId || "",
        customerMobile: payloadCustomerData?.customer?.mobile || payloadCustomerData?.customerMobile || "",
        customerData: payloadCustomerData,
      });
      if (res?.success && res.data?.sessionId) {
        const meetUrlFromServer = res.data.meetUrl || res.data.customerJoinUrl || null;
        const customerMobileFromServer =
          String(
            res.data.customerMobile ||
            payloadCustomerData?.customer?.mobile ||
            payloadCustomerData?.customerMobile ||
            "",
          ).trim();

        setSessionId(res.data.sessionId);
        setMeetUrl(meetUrlFromServer);
        setActiveCustomerMobile(customerMobileFromServer);
        setCallPhase("ringing");

        if (meetUrlFromServer) {
          try {
            await connectLiveKit(meetUrlFromServer, true);
            stopMicStream();
          } catch (lkErr) {
            const lkMsg = lkErr?.message || "Unable to connect LiveKit audio room.";
            setMicError(lkMsg);
            setMicEnabled(false);
            console.error("LiveKit connect error", lkMsg, lkErr);
          }
        }

        setCallActive(true);
        setCallSeconds(0);
      } else {
        setCallPhase("idle");
      }
      return res;
    } catch (err) {
      const micMsg =
        err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError"
          ? "Microphone permission denied. Please allow microphone access in browser settings."
          : err?.message || "Unable to start call.";
      setMicError(micMsg);
      setMicEnabled(false);
      setCallPhase("idle");
      console.error("startCallServer error", micMsg, err);

      if (
        (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") &&
        !micBlockedPopupShownRef.current
      ) {
        micBlockedPopupShownRef.current = true;
        window.alert("Microphone blocked. Please allow microphone permission and try again.");
      }

      throw err;
    }
  }, [connectLiveKit, ensureMicStream, selectedRow, stopMicStream]);

  const endCallServer = useCallback(async (payload = {}) => {
    try {
      const { endCall } = await import("./assistedCallingApi");
      const body = { sessionId, ...payload };
      const res = await endCall(body);
      if (res?.success) {
        setCallActive(false);
        setCallPhase("idle");
        setCallSeconds(0);
        // Keep sessionId so STOMP can receive post-call summary
        setMeetUrl(null);
        setActiveCustomerMobile("");
        disconnectLiveKit();
        stopMicStream();
      }
      return res;
    } catch (err) {
      console.error("endCallServer error", err);
      throw err;
    }
  }, [disconnectLiveKit, sessionId, stopMicStream]);

  useEffect(() => {
    if (!callActive) {
      disconnectLiveKit();
      stopMicStream();
      if (callPhase === "idle") {
        setMicEnabled(true);
        setActiveCustomerMobile("");
        setCallSeconds(0);
      }
    }
  }, [callActive, callPhase, disconnectLiveKit, stopMicStream]);

  useEffect(() => {
    return () => {
      disconnectLiveKit();
      stopMicStream();
    };
  }, [disconnectLiveKit, stopMicStream]);

  // ── Disposition draft ─────────────────────────────────────────────────
  const [disposition, setDispositionState] = useState(EMPTY_DISPOSITION);

  const setDisposition = useCallback((patch) => {
    setDispositionState((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDisposition = useCallback(() => setDispositionState(EMPTY_DISPOSITION), []);

  // ── Context value ─────────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      panelOpen,
      setPanelOpen,
      togglePanel,
      callActive,
      callPhase,
      callSeconds,
      toggleCall,
      micEnabled,
      micError,
      toggleMic,
      sessionId,
      meetUrl,
      activeCustomerMobile,
      liveKitConnected,
      handleCallStatusUpdate,
      startCallServer,
      endCallServer,
      disposition,
      setDisposition,
      resetDisposition,
    }),
    [
      panelOpen, setPanelOpen, togglePanel,
      callActive, callPhase, callSeconds, toggleCall,
      micEnabled, micError, toggleMic,
      sessionId, startCallServer, endCallServer,
      activeCustomerMobile,
      liveKitConnected,
      handleCallStatusUpdate,
      disposition, setDisposition, resetDisposition,
    ]
  );

  return (
    <AssistedCallingUIContext.Provider value={value}>
      {children}
    </AssistedCallingUIContext.Provider>
  );
};

export const useAssistedCallingUI = () => {
  const ctx = useContext(AssistedCallingUIContext);
  if (!ctx) {
    if (!assistedCallingMissingProviderWarned) {
      assistedCallingMissingProviderWarned = true;
      console.warn("useAssistedCallingUI used outside AssistedCallingUIProvider. Returning fallback context.");
    }
    return ASSISTED_CALLING_FALLBACK_CONTEXT;
  }
  return ctx;
};
