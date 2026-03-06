interface Props {
  analyzedAt: number;
  durationMs: number;
}

export default function Footer({ analyzedAt, durationMs }: Props) {
  const date = new Date(analyzedAt).toLocaleDateString();
  const duration = (durationMs / 1000).toFixed(1);

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
