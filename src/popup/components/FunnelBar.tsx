import type { StageResult } from "../../analysis/types";

interface Props {
  stage: StageResult;
  maxTokens: number;
  index: number;
  rawTokens: number;
  isActive: boolean;
  onClick: (id: string) => void;
}

export default function FunnelBar({
  stage,
  maxTokens,
  index,
  rawTokens,
  isActive,
  onClick,
}: Props) {
  const widthPct = Math.max((stage.tokens / maxTokens) * 100, 3);
  const reduction =
    index === 0 ? 0 : Math.round((1 - stage.tokens / rawTokens) * 100);

  return (
    <button
      onClick={() => onClick(stage.id)}
      style={{
        width: "100%",
        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
        border: "none",
        borderLeft: isActive
          ? `3px solid ${stage.color}`
          : "3px solid transparent",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        borderRadius: "0 6px 6px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            color: "#e2e8f0",
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: isActive ? 600 : 400,
          }}
        >
          {stage.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              color: stage.color,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
            }}
          >
            {stage.tokens.toLocaleString()}
          </span>
          <span
            style={{
              color: "#64748b",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            tok
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 8,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${widthPct}%`,
            background: `linear-gradient(90deg, ${stage.color}dd, ${stage.color}88)`,
            borderRadius: 4,
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            transitionDelay: `${index * 0.1}s`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 11,
          color: "#94a3b8",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {stage.description}
        {reduction > 0 && (
          <>
            {" "}
            · <span style={{ color: stage.color }}>−{reduction}%</span>
          </>
        )}
      </div>
    </button>
  );
}
