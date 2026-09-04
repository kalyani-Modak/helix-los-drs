/**
 * Normalize conversation summary payloads from STOMP `/topic/call/{sessionId}/summary`
 * and REST `GET /transcript/{sessionId}/summary`.
 *
 * Expected shape per INTEGRATION.md: `{ summaryItems, insightItems }`.
 */

const toText = (item) => {
  if (item == null) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    return (
      item.text ||
      item.headline ||
      item.summary ||
      item.content ||
      item.value ||
      item.detail ||
      item.description ||
      ""
    );
  }
  return String(item);
};

export const normalizeSummaryEntry = (item, kind = "summary") => {
  if (item == null) return null;

  const text = toText(item);
  if (!text) return null;

  if (typeof item === "object") {
    return {
      text,
      ts: item.ts || item.timestamp || item.time || "",
      kind,
      raw: item,
    };
  }

  return { text, ts: "", kind };
};

/** Normalize insight objects from GET /transcript/{sessionId}/summary insightItems */
export const normalizeInsightFromApi = (item) => {
  if (!item || typeof item !== "object") return null;
  const text = toText(item);
  if (!text) return null;

  return {
    id: item.insightId || item.id || `insight-${text.slice(0, 24)}`,
    type: item.type || "insight",
    text,
    priority: item.priority || item.priorityLevel || "medium",
    ts: item.time || item.ts || item.timestamp || "",
    raw: item,
  };
};

/** True when payload is a full call-end / next-action envelope, not a summary-only message. */
const isCallEndEnvelope = (payload) =>
  payload &&
  typeof payload === "object" &&
  (payload.transcript != null ||
    payload.disposition != null ||
    payload.sessionId != null ||
    payload.customerContext != null);

/**
 * Resolve the block that carries summaryItems / insightItems.
 * Handles both INTEGRATION.md summary-only shape and nested summary on call-end payloads.
 */
const resolveSummaryBlock = (payload) => {
  if (!payload || typeof payload !== "object") return payload;

  if (
    payload.summary &&
    typeof payload.summary === "object" &&
    !Array.isArray(payload.summary) &&
    (Array.isArray(payload.summary.summaryItems) || Array.isArray(payload.summary.insightItems))
  ) {
    return payload.summary;
  }

  if (isCallEndEnvelope(payload) && payload.summary && typeof payload.summary === "object") {
    return payload.summary;
  }

  return payload;
};

/**
 * Parse summary API / STOMP payload into separate arrays.
 * @param {unknown} message
 * @returns {{ summaryItems: import("./types").SummaryItem[], insightItems: import("./types").AIInsight[] }}
 */
export const parseConversationSummary = (message) => {
  if (!message) return { summaryItems: [], insightItems: [] };

  const payload = message?.data ?? message;
  const summaryBlock = resolveSummaryBlock(payload);

  const rawSummaryItems = Array.isArray(summaryBlock?.summaryItems)
    ? summaryBlock.summaryItems
    : Array.isArray(summaryBlock?.items)
    ? summaryBlock.items
    : typeof summaryBlock?.summaryText === "string"
    ? [summaryBlock.summaryText]
    : typeof summaryBlock?.text === "string" && !isCallEndEnvelope(payload)
    ? [summaryBlock.text]
    : typeof summaryBlock?.summary === "string"
    ? [summaryBlock.summary]
    : [];

  const rawInsightItems = Array.isArray(summaryBlock?.insightItems)
    ? summaryBlock.insightItems
    : [];

  return {
    summaryItems: rawSummaryItems
      .map((item) => normalizeSummaryEntry(item, "summary"))
      .filter(Boolean),
    insightItems: rawInsightItems.map(normalizeInsightFromApi).filter(Boolean),
  };
};

/**
 * @param {unknown} message - raw STOMP or REST payload
 * @returns {import("./types").SummaryItem[]}
 */
export const parseSummaryPayload = (message) => {
  const { summaryItems, insightItems } = parseConversationSummary(message);
  return [
    ...summaryItems,
    ...insightItems.map((item) => ({
      text: item.text,
      ts: item.ts,
      kind: "insight",
      raw: item.raw,
    })),
  ].filter(Boolean);
};
