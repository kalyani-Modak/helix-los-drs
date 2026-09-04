// src/components/LintIssueRow.jsx
import { getFriendlyMessage, formatRuleName } from "../linting/userfriendlyMessages";

export default function LintIssueRow({ issue, onClick }) {
  const isError = issue.category === "error";

  return (
    <div
      onClick={() => onClick(issue.elementId, issue.category)}
      style={{
        display: "flex",
        gap: 8,
        padding: "8px 10px",
        marginBottom: 4,
        borderRadius: 6,
        cursor: "pointer",
        background: isError ? "#fdecea" : "#fff4e5",
        border: `1px solid ${isError ? "#f5c6c6" : "#ffe0b2"}`,
        transition: "background 0.15s"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = isError ? "#fbd9d7" : "#ffe8c7")}
      onMouseLeave={(e) => (e.currentTarget.style.background = isError ? "#fdecea" : "#fff4e5")}
    >
      <span style={{ fontSize: 14, lineHeight: "18px" }}>{isError ? "🔴" : "🟠"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>
          {formatRuleName(issue.rule)}
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
          {getFriendlyMessage(issue)}
        </div>
        <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>
          on <strong>{issue.elementName || issue.elementId}</strong>
        </div>
      </div>
    </div>
  );
}
