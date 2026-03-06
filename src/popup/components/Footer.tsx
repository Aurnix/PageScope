import type { PipelineResult } from "../../analysis/types";

interface Props {
  result: PipelineResult;
}

export default function Footer({ result }: Props) {
  const date = new Date(result.analyzedAt).toLocaleDateString();
  const duration = (result.durationMs / 1000).toFixed(1);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tokenlens-report-${new Date(result.analyzedAt).toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        padding: "10px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: "#475569",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Analyzed in {duration}s · {date}
      </span>
      <button
        onClick={handleExport}
        style={{
          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
          border: "none",
          borderRadius: 5,
          padding: "5px 12px",
          color: "white",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Export Report
      </button>
    </div>
  );
}
