import type { TranscriptItem, AIInsight, NextMove, SummaryItem, PastComm } from "./types";

export const SCRIPTED_TRANSCRIPT: Omit<TranscriptItem, "ts">[] = [
  { id: "t1", speaker: "agent", text: "Hello, am I speaking with Raj Patel?", sentiment: "neutral" },
  { id: "t2", speaker: "customer", text: "Yes, speaking. Who is this?", sentiment: "neutral" },
  { id: "t3", speaker: "agent", text: "This is Priya from the collections team regarding your auto loan installment.", sentiment: "neutral" },
  { id: "t4", speaker: "customer", text: "Right, I know it's overdue. Things have been tight this month.", sentiment: "negative" },
  { id: "t5", speaker: "agent", text: "I understand. Would you be able to commit to a partial payment this week?", sentiment: "positive" },
  { id: "t6", speaker: "customer", text: "I can pay half by Friday and the rest by month end.", sentiment: "positive" },
  { id: "t7", speaker: "agent", text: "Great — I'll log a promise to pay for that arrangement.", sentiment: "positive" },
];

export const SCRIPTED_INSIGHTS: Omit<AIInsight, "ts">[] = [
  { id: "i1", type: "intent", text: "Customer acknowledges the debt — soft intent to pay.", priority: "medium" },
  { id: "i2", type: "sentiment", text: "Financial stress detected — tone shifted to negative at 00:12.", priority: "medium" },
  { id: "i3", type: "policy", text: "Eligible for split PTP under Auto Finance bucket 6 policy.", priority: "high" },
  { id: "i4", type: "suggestion", text: "Offer 50/50 split PTP: Fri + month-end.", priority: "high" },
  { id: "i5", type: "alert", text: "Customer has 1 broken PTP in last 90 days — verify commitment.", priority: "high" },
];

export const SCRIPTED_NEXT_MOVES: Omit<NextMove, "ts">[] = [
  {
    id: "n1",
    headline: "Acknowledge & empathize",
    detail: "Customer signaled financial stress. Slow the pace, acknowledge, then bridge to solution.",
    script: "I hear you — a lot of families are managing tight months. Let's find something workable.",
  },
  {
    id: "n2",
    headline: "Propose split PTP",
    detail: "50% by Friday, 50% by month-end is inside policy for bucket 6.",
    script: "How about ₹17,500 this Friday and the balance by the 30th? I can lock that in now.",
  },
  {
    id: "n3",
    headline: "Confirm & set expectations",
    detail: "Reconfirm dates, note payment channel, warn about broken-PTP consequences politely.",
    script: "I'll send you a confirmation SMS. Missing either date will move the account to field visit.",
  },
];

export const SCRIPTED_SUMMARY: Omit<SummaryItem, "ts">[] = [
  { text: "Customer verified identity." },
  { text: "Customer cited financial stress this month." },
  { text: "Agreed on split PTP: 50% Friday, 50% month-end." },
  { text: "Agent to send confirmation SMS post-call." },
];

export const PAST_COMMUNICATIONS: PastComm[] = [
  { date: "05 Jun", channel: "Call", agent: "Ankit S.", summary: "PTP taken for 10 Jun, broken", outcome: "Broken PTP", agentSentiment: "neutral", customerSentiment: "negative" },
  { date: "12 Jun", channel: "SMS", agent: "System", summary: "Reminder sent", outcome: "Delivered", agentSentiment: "neutral", customerSentiment: "neutral" },
  { date: "18 Jun", channel: "Call", agent: "Priya M.", summary: "No answer, voicemail left", outcome: "No Contact", agentSentiment: "neutral", customerSentiment: "neutral" },
  { date: "24 Jun", channel: "WhatsApp", agent: "Priya M.", summary: "Customer requested callback", outcome: "Callback", agentSentiment: "positive", customerSentiment: "positive" },
];

export const CALL_BEHAVIOUR = {
  bestTimeToCall: "10:00 – 12:00",
  preferredChannel: "WhatsApp then Call",
  languagePref: "English / Hindi",
  cooperationScore: 62,
};
