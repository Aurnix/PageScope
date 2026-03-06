import type { PipelineResult } from "../../analysis/types";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  result: PipelineResult;
}

export default function Header({ result }: Props) {
  const rawTokens = result.stages[0]?.tokens ?? 0;
  const aiTokens = result.stages.find((s) => s.id === "markdown")?.tokens ?? 0;
  const wastePct = rawTokens > 0 ? Math.round((1 - aiTokens / rawTokens) * 100) : 0;

  // Truncate URL for display
  const displayUrl = result.url
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <div
      style={{
        padding: "16px 16px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            🔍
          </div>
          <span
            style={{
              color: "#e2e8f0",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            TokenLens
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#06b6d4",
              background: "rgba(6,182,212,0.1)",
              padding: "2px 6px",
              borderRadius: 4,
              fontWeight: 600,
            }}
          >
            BETA
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: "#64748b",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {`v${chrome.runtime.getManifest().version}`}
        </div>
      </div>

      {/* URL bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 6,
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span style={{ color: "#22c55e", fontSize: 10 }}>●</span>
        <span
          style={{
            color: "#94a3b8",
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayUrl}
        </span>
      </div>

      {/* Hero numbers */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          marginTop: 14,
          padding: "0 4px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              marginBottom: 2,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Page Weight
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#ef4444",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "-0.03em",
              }}
            >
              <AnimatedNumber target={rawTokens} />
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>tokens</span>
          </div>
        </div>
        <div style={{ color: "#334155", fontSize: 20 }}>→</div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              marginBottom: 2,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            AI Sees
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#22c55e",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "-0.03em",
              }}
            >
              <AnimatedNumber target={aiTokens} duration={1400} />
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>tokens</span>
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 6,
            padding: "6px 10px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#ef4444",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {wastePct}%
          </div>
          <div
            style={{
              fontSize: 9,
              color: "#ef4444",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            wasted
          </div>
        </div>
      </div>
    </div>
  );
}
