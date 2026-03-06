interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "funnel", label: "Token Funnel", icon: "📊" },
  { id: "preview", label: "AI View", icon: "👁" },
  { id: "scores", label: "Scores", icon: "📋" },
  { id: "issues", label: "Issues", icon: "⚠️" },
];

export default function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            flex: 1,
            padding: "10px 0",
            background: "none",
            border: "none",
            borderBottom:
              activeTab === tab.id
                ? "2px solid #06b6d4"
                : "2px solid transparent",
            color: activeTab === tab.id ? "#e2e8f0" : "#64748b",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: activeTab === tab.id ? 600 : 400,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 12 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
