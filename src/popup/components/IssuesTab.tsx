import type { Issue } from "../../analysis/types";

interface Props {
  issues: Issue[];
}

const SEVERITY_STYLES = {
  critical: {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.15)",
    color: "#fca5a5",
    icon: "🔴",
  },
  warning: {
    bg: "rgba(234,179,8,0.04)",
    border: "rgba(234,179,8,0.1)",
    color: "#fde68a",
    icon: "🟡",
  },
  info: {
    bg: "rgba(34,197,94,0.04)",
    border: "rgba(34,197,94,0.1)",
    color: "#86efac",
    icon: "🟢",
  },
} as const;

export default function IssuesTab({ issues }: Props) {
  return (
    <div
      style={{
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
        Issues that affect how AI systems see your content.
      </div>
      {issues.length === 0 && (
        <div
          style={{
            padding: "20px 12px",
            textAlign: "center",
            color: "#22c55e",
            fontSize: 12,
          }}
        >
          No issues detected — your page looks good for AI consumption!
        </div>
      )}
      {issues.map((issue) => {
        const style = SEVERITY_STYLES[issue.severity];
        return (
          <div
            key={`${issue.severity}-${issue.text.slice(0, 30)}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "10px 12px",
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>
              {style.icon}
            </span>
            <span
              style={{
                fontSize: 12,
                color: style.color,
                lineHeight: 1.5,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {issue.text}
            </span>
          </div>
        );
      })}
      <div
        style={{
          marginTop: 8,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.06)",
          fontSize: 11,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: "#94a3b8" }}>Why this matters:</strong> AI
        search systems make decisions based on what they can extract in
        milliseconds. Content behind JavaScript, buried deep in the page, or
        missing from your meta description may never enter the AI's context
        window.
      </div>
    </div>
  );
}
