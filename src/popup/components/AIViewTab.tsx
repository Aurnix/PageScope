interface Props {
  snippetText: string;
  snippetTokens: number;
  markdownContent: string;
  markdownTokens: number;
}

export default function AIViewTab({
  snippetText,
  snippetTokens,
  markdownContent,
  markdownTokens,
}: Props) {
  return (
    <div style={{ padding: 12 }}>
      {/* Snippet section */}
      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.02))",
          border: "1px solid rgba(6,182,212,0.15)",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#06b6d4",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            🎯 Your 50-Token Pitch
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#06b6d4",
              background: "rgba(6,182,212,0.15)",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {snippetTokens} tokens
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#e2e8f0",
            lineHeight: 1.6,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {snippetText || (
            <span style={{ color: "#64748b", fontStyle: "italic" }}>
              No meta description found
            </span>
          )}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: "8px 0 0",
            borderTop: "1px solid rgba(6,182,212,0.1)",
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.5,
          }}
        >
          This meta description may be the{" "}
          <strong style={{ color: "#06b6d4" }}>only thing</strong> the AI reads
          about your page. Make every word count.
        </div>
      </div>

      {/* Markdown preview */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            What the AI actually reads
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#22c55e",
              background: "rgba(34,197,94,0.1)",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {markdownTokens.toLocaleString()} tokens
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8,
            padding: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {markdownContent || "No content extracted."}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#475569",
            marginTop: 6,
            fontStyle: "italic",
          }}
        >
          No images. No layout. No styling. Just text.
        </div>
      </div>
    </div>
  );
}
