import { useState } from "react";

const CRAWLERS = [
  { name: "ChatGPT (OpenAI)", bot: "GPTBot", js: false },
  { name: "Claude (Anthropic)", bot: "ClaudeBot", js: false },
  { name: "Perplexity", bot: "PerplexityBot", js: false },
  { name: "Gemini (Google)", bot: "Google-Extended", js: null },
  { name: "Common Crawl", bot: "CCBot", js: false },
] as const;

export default function CrawlerInfo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ margin: "4px 12px 8px" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          fontSize: 11,
          padding: 0,
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 10 }}>{expanded ? "\u25BC" : "\u25B6"}</span>
        Which AI crawlers?
      </button>
      {expanded && (
        <div
          style={{
            marginTop: 6,
            padding: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 6,
            fontSize: 11,
            color: "#94a3b8",
            lineHeight: 1.7,
          }}
        >
          {CRAWLERS.map((c) => (
            <div
              key={c.bot}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "2px 0",
              }}
            >
              <span>
                <span style={{ color: "#cbd5e1" }}>{c.name}</span>
                <span style={{ color: "#475569" }}> \u2014 {c.bot}</span>
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: c.js === null ? "#eab308" : c.js ? "#22c55e" : "#ef4444",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {c.js === null ? "partial" : c.js ? "runs JS" : "no JS"}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: 6,
              paddingTop: 6,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: 10,
              color: "#64748b",
            }}
          >
            Note: Gemini may see JS-rendered content via Google\u2019s rendering
            infrastructure. All others definitely don\u2019t execute JavaScript.
          </div>
        </div>
      )}
    </div>
  );
}
