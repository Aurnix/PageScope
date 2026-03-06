import type { Score } from "../../analysis/types";

interface Props {
  score: Score;
}

export default function ScoreCard({ score }: Props) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score.value / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      title={score.tip}
    >
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={score.color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          style={{
            transition:
              "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        <text
          x="22"
          y="24"
          textAnchor="middle"
          fill={score.color}
          fontSize="13"
          fontWeight="700"
          fontFamily="'JetBrains Mono', monospace"
        >
          {score.grade}
        </text>
      </svg>
      <div>
        <div
          style={{
            fontSize: 12,
            color: "#e2e8f0",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          {score.label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            fontFamily: "'DM Sans', sans-serif",
            marginTop: 1,
          }}
        >
          {score.tip}
        </div>
      </div>
    </div>
  );
}
