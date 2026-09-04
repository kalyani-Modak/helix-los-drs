export type Sentiment = "positive" | "neutral" | "negative";

export interface TranscriptItem {
  id: string;
  speaker: "agent" | "customer";
  text: string;
  ts: string;
  sentiment: Sentiment;
}

export type InsightPriority = "high" | "medium" | "low";
export type InsightType = "intent" | "suggestion" | "policy" | "alert" | "sentiment";

export interface AIInsight {
  id: string;
  type: InsightType;
  text: string;
  priority: InsightPriority;
  ts: string;
}

export interface NextMove {
  id: string;
  headline: string;
  detail: string;
  script?: string;
  ts: string;
}

export interface SummaryItem {
  text: string;
  ts: string;
  kind?: "summary" | "insight";
  raw?: unknown;
}

export interface DispositionDraft {
  result: string;
  reasonCode: string;
  ptpAmount: string;
  ptpDate: string;
  nextAction: string;
  nextActionDate: string;
  notes: string;
}

export interface PastComm {
  date: string;
  channel: "Call" | "SMS" | "Email" | "WhatsApp" | "Field";
  agent: string;
  summary: string;
  outcome: string;
  agentSentiment: Sentiment;
  customerSentiment: Sentiment;
}
