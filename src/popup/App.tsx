import { useState } from "react";
import { usePageAnalysis } from "./hooks/usePageAnalysis";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import FunnelTab from "./components/FunnelTab";
import AIViewTab from "./components/AIViewTab";
import ScoresTab from "./components/ScoresTab";
import IssuesTab from "./components/IssuesTab";
import Footer from "./components/Footer";

export default function App() {
  const { result, loading, error } = usePageAnalysis();
  const [activeTab, setActiveTab] = useState("funnel");

  return (
    <div
      style={{
        width: 400,
        fontFamily: "'DM Sans', sans-serif",
        background: "#0f1219",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      {loading && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
          }}
        >
          <div
            style={{
              fontSize: 24,
              marginBottom: 12,
            }}
          >
            🔍
          </div>
          Analyzing page...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#ef4444",
            fontSize: 13,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
          {error}
        </div>
      )}

      {result && (
        <>
          <Header result={result} />
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {activeTab === "funnel" && <FunnelTab stages={result.stages} />}
            {activeTab === "preview" && (
              <AIViewTab
                snippetText={result.snippetText}
                snippetTokens={result.stages[result.stages.length - 1].tokens}
                markdownContent={result.markdownContent}
                markdownTokens={
                  result.stages.find((s) => s.id === "markdown")?.tokens ?? 0
                }
              />
            )}
            {activeTab === "scores" && <ScoresTab scores={result.scores} />}
            {activeTab === "issues" && <IssuesTab issues={result.issues} />}
          </div>
          <Footer analyzedAt={result.analyzedAt} durationMs={result.durationMs} />
        </>
      )}
    </div>
  );
}
