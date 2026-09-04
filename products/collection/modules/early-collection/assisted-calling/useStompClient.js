import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { getBaseApiPath } from "@shared/config/apiConstants";

const AI_ASSISTANT_BASE_URL = import.meta.env.VITE_ASSISTED_CALLING_BASE_URL || "https://aiassistant.yutrix.io/collassistantapi";
const AI_ASSISTANT_API_KEY = import.meta.env.VITE_ASSISTED_CALLING_API_KEY || "ebix_918b0035585dba494da93b3781683b9b21c6a3e2fcca5ec0";
//const wsUrl = API_BASE.replace(/^http/, "ws") + "/ws";

const LOCAL_API_FALLBACK = AI_ASSISTANT_BASE_URL;

const getApiBaseUrl = () =>
    getBaseApiPath() || process?.env?.NEXT_PUBLIC_API_URL || import.meta.env?.VITE_BASE_API_PATH || LOCAL_API_FALLBACK;

const deriveWebSocketUrl = (baseUrl, tenant) => {
    const raw = String(baseUrl || AI_ASSISTANT_BASE_URL).trim().replace(/\/+$|\\/g, "");
    const isSecure = /^https:/i.test(raw);
    const protocol = isSecure ? "wss" : "ws";
    const path = raw.replace(/^https?:\/\//i, "");
    const base = `${protocol}://${path}/ws`;
    if (!tenant) return base;
    // Append tenant as query param so the HTTP upgrade request carries tenant info
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}tenantId=${encodeURIComponent(tenant)}`;
};

const parseStompMessageBody = (message) => {
    const body = message.body || "";
    try {
        return JSON.parse(body);
    } catch {
        return body;
    }
};

export const useStompClient = ({
    sessionId,
    autoConnect = true,
    reconnectDelayMs = 5000,
    onIncomingCall,
    onTranscript,
    onMeetUrl,
    onInsights,
    onStatus,
    onSummary,
    onNextAction,
    onError,
} = {}) => {
    const [connected, setConnected] = useState(false);
    const [lastError, setLastError] = useState(null);

    const clientRef = useRef(null);
    const sessionSubsRef = useRef([]);
    const incomingCallSubRef = useRef(null);

    const brokerUrl = useMemo(() => {
        return deriveWebSocketUrl(AI_ASSISTANT_BASE_URL);
    }, []);

    const parseMessage = useCallback(
        (handler) => (message) => {
            if (!message) return;
            const parsed = parseStompMessageBody(message);
            if (!handler) return;
            handler(parsed);
        },
        []
    );

    const disconnectSessionSubscriptions = useCallback(() => {
        sessionSubsRef.current.forEach((sub) => sub.unsubscribe());
        sessionSubsRef.current = [];
    }, []);

    const unsubscribeIncomingCall = useCallback(() => {
        incomingCallSubRef.current?.unsubscribe();
        incomingCallSubRef.current = null;
    }, []);

    const subscribeSessionTopics = useCallback(() => {
        disconnectSessionSubscriptions();

        if (!sessionId || !clientRef.current?.connected) {
            return;
        }

        const client = clientRef.current;

        const subscribe = (topic, handler) => {
            if (!handler) return;
            const sub = client.subscribe(topic, parseMessage(handler));
            sessionSubsRef.current.push(sub);
        };
        subscribe(`/topic/call/${sessionId}/transcript`, onTranscript);
        subscribe(`/topic/call/${sessionId}/meet-url`, onMeetUrl);
        subscribe(`/topic/call/${sessionId}/insights`, onInsights);
        subscribe(`/topic/call/${sessionId}/status`, onStatus);
        subscribe(`/topic/call/${sessionId}/summary`, onSummary);
        subscribe(`/topic/call/${sessionId}/next-action`, onNextAction);
    }, [sessionId, onTranscript, onMeetUrl, onInsights, onStatus, onSummary, onNextAction, parseMessage, disconnectSessionSubscriptions]);

    const subscribeIncomingCall = useCallback(() => {
        if (!clientRef.current?.connected || !onIncomingCall) {
            return;
        }

        unsubscribeIncomingCall();
        incomingCallSubRef.current = clientRef.current.subscribe(
            "/topic/agent/incoming-call",
            parseMessage(onIncomingCall)
        );
    }, [onIncomingCall, parseMessage, unsubscribeIncomingCall]);

    const disconnect = useCallback(() => {
        disconnectSessionSubscriptions();
        unsubscribeIncomingCall();

        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        setConnected(false);
    }, [disconnectSessionSubscriptions, unsubscribeIncomingCall]);

    const buildConnectHeaders = () => ({
        "X-API-KEY": AI_ASSISTANT_API_KEY,
    });
    // Ensure we subscribe to session topics as soon as sessionId becomes available

    const connect = useCallback(() => {
        if (clientRef.current?.connected) {
            subscribeSessionTopics();
            return;
        }
        if (clientRef.current) {
            console.log("useStompClient: connect() called but client already exists", { brokerUrl });
            return;
        }
        const headers = buildConnectHeaders();
        console.log("useStompClient: connect() called");
        console.log("useStompClient: connecting with headers", headers);
        const client = new Client({
            brokerURL: brokerUrl,
            reconnectDelay: reconnectDelayMs,
            connectHeaders: headers,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                console.log("STOMP CONNECTED");
                console.log("sessionId =", sessionId);
                console.log("client.connected =", client.connected);

                setConnected(true);
                disconnectSessionSubscriptions();
                subscribeIncomingCall();
                subscribeSessionTopics();
            },

            onStompError: (frame) => {
                console.error("STOMP ERROR", frame);
            },

            onWebSocketError: (event) => {
                console.error("WEBSOCKET ERROR", event);
            },

            onWebSocketClose: () => {
                console.log("WebSocket Closed");
                setConnected(false);
            }
        });

        clientRef.current = client;
        client.activate();
    }, [autoConnect, brokerUrl, disconnectSessionSubscriptions, onError, reconnectDelayMs, sessionId, subscribeIncomingCall, subscribeSessionTopics]);
    useEffect(() => {
        if (!sessionId) {
            // nothing to do
            return;
        }
        // If client exists and is connected, subscribe now
        if (clientRef.current?.connected) {
            subscribeSessionTopics();
            return;
        }

        // If client not created/connected yet and autoConnect is false,
        // you might want to activate the client when you get a sessionId:
        // (optional behavior — uncomment if you want)
        // if (!clientRef.current && autoConnect) {
        //   connect();
        // }
    }, [sessionId, subscribeSessionTopics, connect, autoConnect, connected]);

    useEffect(() => {
        if (!sessionId && clientRef.current?.connected) {
            disconnect();
        }
    }, [sessionId, disconnect]);
    useEffect(() => {
        if (!autoConnect) {
            return undefined;
        }

        connect();
        return disconnect;
    }, [autoConnect, connect, disconnect]);

    useEffect(() => {
        if (!sessionId || !clientRef.current?.connected) {
            return;
        }
        subscribeSessionTopics();
    }, [sessionId, connected, subscribeSessionTopics]);

    useEffect(() => {
        if (!clientRef.current?.connected) {
            return;
        }

        subscribeIncomingCall();
        return unsubscribeIncomingCall;
    }, [onIncomingCall, subscribeIncomingCall, unsubscribeIncomingCall]);

    return {
        connected,
        lastError,
        brokerUrl,
        connect,
        disconnect,
    };
};
