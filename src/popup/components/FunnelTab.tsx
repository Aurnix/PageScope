import { useState } from "react";
import type { StageResult } from "../../analysis/types";
import { STAGE_HINTS } from "../../shared/constants";
import FunnelBar from "./FunnelBar";
import CrawlerInfo from "./CrawlerInfo";

interface Props {
  stages: StageResult[];
}

export default function FunnelTab({ stages }: Props) {
  const [activeStage, setActiveStage] = useState("markdown");
  const firstStageTokens = stages[0]?.tokens ?? 1;
  // Both used by FunnelBar: maxTokens for bar width scaling, rawTokens for reduction %
  const maxTokens = firstStageTokens;
  const rawTokens = firstStageTokens;
  const currentStage = stages.find((s) => s.id === activeStage);

  const hint = currentStage ? STAGE_HINTS[currentStage.id] : "";

  return (
    <div style={{ padding: "8px 4px" }}>
      <div style={{ padding: "4px 12px 8px", fontSize: 11, color: "#64748b" }}>
        Click any stage to see details. Each bar shows how many tokens survive.
      </div>
      {stages.map((stage, i) => (
        <FunnelBar
          key={stage.id}
          stage={stage}
          maxTokens={maxTokens}
          index={i}
          rawTokens={rawTokens}
          isActive={activeStage === stage.id}
          onClick={setActiveStage}
        />
      ))}
      {currentStage && (
        <div
          style={{
            margin: "8px 12px 12px",
            padding: 12,
            background: `linear-gradient(135deg, ${currentStage.color}08, ${currentStage.color}04)`,
            border: `1px solid ${currentStage.color}22`,
            borderRadius: 8,
            fontSize: 12,
            color: "#cbd5e1",
            lineHeight: 1.6,
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: currentStage.color,
              marginBottom: 4,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {currentStage.label}
          </div>
          {currentStage.detail}
          {hint && (
            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: `1px solid ${currentStage.color}15`,
                fontSize: 11,
                color: "#94a3b8",
              }}
            >
              <span style={{ color: currentStage.color, fontWeight: 600 }}>
                Tip:{" "}
              </span>
              {hint}
            </div>
          )}
        </div>
      )}
      <CrawlerInfo />
    </div>
  );
}
