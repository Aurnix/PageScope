import type { ScoreSet } from "../../analysis/types";
import ScoreCard from "./ScoreCard";

interface Props {
  scores: ScoreSet;
}

export default function ScoresTab({ scores }: Props) {
  const scoreList = [
    scores.contentDensity,
    scores.jsIndependence,
    scores.frontLoading,
    scores.extractability,
  ];

  // Find lowest score for the opportunity tip
  const lowest = scoreList.reduce((min, s) =>
    s.value < min.value ? s : min
  );

  return (
    <div
      style={{
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
        How well your page is optimized for AI consumption. Hover for details.
      </div>
      {scoreList.map((score) => (
        <ScoreCard key={score.label} score={score} />
      ))}
      <div
        style={{
          marginTop: 8,
          padding: 12,
          background: "rgba(139,92,246,0.06)",
          border: "1px solid rgba(139,92,246,0.15)",
          borderRadius: 8,
          fontSize: 11,
          color: "#c4b5fd",
          lineHeight: 1.6,
        }}
      >
        <strong>Biggest opportunity:</strong> Your weakest area is{" "}
        <strong>{lowest.label}</strong> ({lowest.grade}). {lowest.tip}
      </div>
    </div>
  );
}
