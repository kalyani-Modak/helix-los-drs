import { useCallback, useEffect, useRef } from "react";
import type { AIInsight, NextMove, SummaryItem, TranscriptItem } from "./types";
import {
  SCRIPTED_TRANSCRIPT,
  SCRIPTED_INSIGHTS,
  SCRIPTED_NEXT_MOVES,
  SCRIPTED_SUMMARY,
} from "./assistedCallingSeedData";

const nowTs = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

interface Params {
  active: boolean;
  onTranscript: (t: TranscriptItem) => void;
  onInsight: (i: AIInsight) => void;
  onNextMove: (n: NextMove) => void;
  onSummary: (s: SummaryItem) => void;
  onSuggestedDisposition: () => void;
}

export const useSimulatedCall = ({
  active,
  onTranscript,
  onInsight,
  onNextMove,
  onSummary,
  onSuggestedDisposition,
}: Params) => {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    if (!active) {
      clearAll();
      return;
    }

    SCRIPTED_TRANSCRIPT.forEach((item, idx) => {
      const t = setTimeout(() => onTranscript({ ...item, ts: nowTs() }), 1500 + idx * 2500);
      timers.current.push(t);
    });

    SCRIPTED_INSIGHTS.forEach((item, idx) => {
      const t = setTimeout(() => onInsight({ ...item, ts: nowTs() }), 3000 + idx * 3500);
      timers.current.push(t);
    });

    SCRIPTED_NEXT_MOVES.forEach((item, idx) => {
      const t = setTimeout(() => onNextMove({ ...item, ts: nowTs() }), 4000 + idx * 5000);
      timers.current.push(t);
    });

    SCRIPTED_SUMMARY.forEach((item, idx) => {
      const t = setTimeout(() => onSummary({ ...item, ts: nowTs() }), 6000 + idx * 4000);
      timers.current.push(t);
    });

    const dispTimer = setTimeout(onSuggestedDisposition, 18000);
    timers.current.push(dispTimer);

    return clearAll;
  }, [active, onTranscript, onInsight, onNextMove, onSummary, onSuggestedDisposition, clearAll]);
};
