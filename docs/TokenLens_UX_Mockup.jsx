import { useState, useEffect } from "react";

const STAGES = [
  {
    id: "raw",
    label: "Raw HTML",
    tokens: 16180,
    color: "#ef4444",
    icon: "🌐",
    description: "Everything your browser downloads",
    detail: "Nav bars, CSS classes, scripts, ads, cookie banners, tracking pixels, footer links — the full page weight.",
  },
  {
    id: "nojs",
    label: "Without JavaScript",
    tokens: 11420,
    color: "#f97316",
    icon: "⚡",
    description: "What most AI crawlers actually receive",
    detail: "ChatGPT, Claude, and Gemini don't run JavaScript. Any content loaded by React, Vue, or Angular is invisible to them.",
  },
  {
    id: "cleaned",
    label: "Content Only",
    tokens: 6840,
    color: "#eab308",
    icon: "🧹",
    description: "After removing page chrome",
    detail: "Navigation, sidebars, footers, ads, and boilerplate stripped. Just the article body and meaningful content remain.",
  },
  {
    id: "markdown",
    label: "AI-Ready Text",
    tokens: 3150,
    color: "#22c55e",
    icon: "📄",
    description: "Clean text the AI can actually use",
    detail: "Structured markdown with headings preserved. This is close to what enters the AI's 'brain' for processing.",
  },
  {
    id: "snippet",
    label: "Your 50-Token Pitch",
    tokens: 48,
    color: "#06b6d4",
    icon: "🎯",
    description: "Often the ONLY thing the AI reads",
    detail: "Your meta description or Google's snippet. In many cases, this is your entire representation in the AI's answer.",
  },
];

const SCORES = [
  { label: "Content Density", value: 19, grade: "D", color: "#ef4444", tip: "Only 19% of your page tokens are actual content. The rest is packaging." },
  { label: "JS Independence", value: 71, grade: "B", color: "#22c55e", tip: "71% of content visible without JavaScript. Good, but 29% is invisible to most AI crawlers." },
  { label: "Front-Loading", value: 34, grade: "D", color: "#f97316", tip: "Key claims don't appear until paragraph 4. AI may never see them." },
  { label: "Chunk Quality", value: 82, grade: "A", color: "#22c55e", tip: "Content splits cleanly at 512-token boundaries with good heading context." },
  { label: "Freshness Signals", value: 45, grade: "C", color: "#eab308", tip: "dateModified is 7 months old. AI systems favor recent content." },
];

const SNIPPET_TEXT = "Best project management tools for remote teams in 2026. Compare Monday.com, Asana, Notion pricing, features, and integrations for distributed teams of 10-50 people.";

const MARKDOWN_PREVIEW = `# Best Project Management Tools for Remote Teams

Choosing the right project management tool for a remote 
team depends on three factors: async collaboration 
features, integration ecosystem, and per-seat pricing 
at your team size.

## Quick Comparison

Monday.com starts at $8/seat/month. Best for visual 
workflows and automations. Strongest Gantt charts.

Asana premium is $10.99/seat/month. Best for complex 
projects with dependencies. Superior subtask handling.

Notion offers free tier, paid from $8/member/month. 
Best for teams that combine docs + projects. Most 
flexible but steepest learning curve.

## What Remote Teams Actually Need

The features that matter for distributed teams aren't 
the ones vendors highlight. Async updates, timezone-
aware deadlines, and offline mobile access matter more 
than real-time collaboration...`;

const ISSUES = [
  { severity: "critical", icon: "🔴", text: "Pricing table is JS-rendered — invisible to ChatGPT, Claude, and Gemini" },
  { severity: "critical", icon: "🔴", text: "Customer testimonials load via API call — AI crawlers see empty section" },
  { severity: "warning", icon: "🟡", text: "Meta description is 186 chars — Google will truncate, front-load key info" },
  { severity: "warning", icon: "🟡", text: "H1 doesn't contain primary topic — AI may misjudge page subject" },
  { severity: "info", icon: "🟢", text: "FAQ schema detected — good for AI extraction" },
  { severity: "info", icon: "🟢", text: "dateModified present in JSON-LD" },
];

function AnimatedNumber({ target, duration = 1200 }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{current.toLocaleString()}</span>;
}

function FunnelBar({ stage, maxTokens, index, isActive, onClick }) {
  const widthPct = Math.max((stage.tokens / maxTokens) * 100, 3);
  const reduction = index === 0 ? 0 : Math.round((1 - stage.tokens / STAGES[0].tokens) * 100);

  return (
    <button
      onClick={() => onClick(stage.id)}
      style={{
        width: "100%",
        background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
        border: "none",
        borderLeft: isActive ? `3px solid ${stage.color}` : "3px solid transparent",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textAlign: "left",
        borderRadius: "0 6px 6px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>{stage.icon}</span>
          <span style={{ color: "#e2e8f0", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: isActive ? 600 : 400 }}>
            {stage.label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            color: stage.color,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
          }}>
            {stage.tokens.toLocaleString()}
          </span>
          <span style={{ color: "#64748b", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>tok</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
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
      {reduction > 0 && (
        <div style={{ marginTop: 4, fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
          {stage.description} · <span style={{ color: stage.color }}>−{reduction}%</span>
        </div>
      )}
      {reduction === 0 && (
        <div style={{ marginTop: 4, fontSize: 11, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
          {stage.description}
        </div>
      )}
    </button>
  );
}

function ScoreCard({ score }) {
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
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="22" cy="22" r="18" fill="none"
          stroke={score.color} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <text x="22" y="24" textAnchor="middle" fill={score.color} fontSize="13" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
          {score.grade}
        </text>
      </svg>
      <div>
        <div style={{ fontSize: 12, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{score.label}</div>
        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>{score.tip}</div>
      </div>
    </div>
  );
}

export default function TokenLens() {
  const [activeStage, setActiveStage] = useState("markdown");
  const [activeTab, setActiveTab] = useState("funnel");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const currentStage = STAGES.find((s) => s.id === activeStage);

  const tabs = [
    { id: "funnel", label: "Token Funnel", icon: "📊" },
    { id: "preview", label: "AI View", icon: "👁" },
    { id: "scores", label: "Scores", icon: "📋" },
    { id: "issues", label: "Issues", icon: "⚠️" },
  ];

  return (
    <div style={{
      width: 400,
      margin: "20px auto",
      fontFamily: "'DM Sans', sans-serif",
      background: "#0f1219",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "16px 16px 12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>
              🔍
            </div>
            <span style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>
              TokenLens
            </span>
            <span style={{
              fontSize: 10, color: "#06b6d4", background: "rgba(6,182,212,0.1)",
              padding: "2px 6px", borderRadius: 4, fontWeight: 600,
            }}>
              BETA
            </span>
          </div>
          <div style={{
            fontSize: 10, color: "#64748b", fontFamily: "'JetBrains Mono', monospace",
          }}>
            v0.1.0
          </div>
        </div>

        {/* URL bar */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 6,
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{ color: "#22c55e", fontSize: 10 }}>●</span>
          <span style={{
            color: "#94a3b8", fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            example.com/blog/best-pm-tools-remote-teams
          </span>
        </div>

        {/* Big number hero */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: 16,
          marginTop: 14, padding: "0 4px",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Page Weight
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>
                {loaded ? <AnimatedNumber target={16180} /> : "—"}
              </span>
              <span style={{ fontSize: 12, color: "#64748b" }}>tokens</span>
            </div>
          </div>
          <div style={{ color: "#334155", fontSize: 20 }}>→</div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              AI Sees
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.03em" }}>
                {loaded ? <AnimatedNumber target={3150} duration={1400} /> : "—"}
              </span>
              <span style={{ fontSize: 12, color: "#64748b" }}>tokens</span>
            </div>
          </div>
          <div style={{
            marginLeft: "auto",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 6,
            padding: "6px 10px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>80%</div>
            <div style={{ fontSize: 9, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>wasted</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: "10px 0",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #06b6d4" : "2px solid transparent",
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

      {/* Content */}
      <div style={{ maxHeight: 420, overflowY: "auto" }}>
        {/* Token Funnel Tab */}
        {activeTab === "funnel" && (
          <div style={{ padding: "8px 4px" }}>
            <div style={{ padding: "4px 12px 8px", fontSize: 11, color: "#64748b" }}>
              Click any stage to see details. Each bar shows how many tokens survive.
            </div>
            {STAGES.map((stage, i) => (
              <FunnelBar
                key={stage.id}
                stage={stage}
                maxTokens={STAGES[0].tokens}
                index={i}
                isActive={activeStage === stage.id}
                onClick={setActiveStage}
              />
            ))}
            {currentStage && (
              <div style={{
                margin: "8px 12px 12px",
                padding: 12,
                background: `linear-gradient(135deg, ${currentStage.color}08, ${currentStage.color}04)`,
                border: `1px solid ${currentStage.color}22`,
                borderRadius: 8,
                fontSize: 12,
                color: "#cbd5e1",
                lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 600, color: currentStage.color, marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  {currentStage.icon} {currentStage.label}
                </div>
                {currentStage.detail}
              </div>
            )}
          </div>
        )}

        {/* AI View Tab */}
        {activeTab === "preview" && (
          <div style={{ padding: 12 }}>
            {/* Snippet section */}
            <div style={{
              marginBottom: 16,
              padding: 12,
              background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.02))",
              border: "1px solid rgba(6,182,212,0.15)",
              borderRadius: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  🎯 Your 50-Token Pitch
                </div>
                <div style={{
                  fontSize: 10, color: "#06b6d4", background: "rgba(6,182,212,0.15)",
                  padding: "2px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  48 tokens
                </div>
              </div>
              <div style={{
                fontSize: 13, color: "#e2e8f0", lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {SNIPPET_TEXT}
              </div>
              <div style={{
                marginTop: 8, padding: "8px 0 0",
                borderTop: "1px solid rgba(6,182,212,0.1)",
                fontSize: 11, color: "#94a3b8", lineHeight: 1.5,
              }}>
                ⚡ This meta description may be the <strong style={{ color: "#06b6d4" }}>only thing</strong> the AI reads about your page. Make every word count.
              </div>
            </div>

            {/* Markdown preview */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  📄 What the AI actually reads
                </div>
                <div style={{
                  fontSize: 10, color: "#22c55e", background: "rgba(34,197,94,0.1)",
                  padding: "2px 6px", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace",
                }}>
                  3,150 tokens
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "#94a3b8",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                maxHeight: 260,
                overflowY: "auto",
              }}>
                {MARKDOWN_PREVIEW}
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 6, fontStyle: "italic" }}>
                Showing first ~300 tokens. No images. No layout. No styling. Just text.
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === "scores" && (
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
              How well your page is optimized for AI consumption. Hover for details.
            </div>
            {SCORES.map((score) => (
              <ScoreCard key={score.label} score={score} />
            ))}
            <div style={{
              marginTop: 8,
              padding: 12,
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: 8,
              fontSize: 11,
              color: "#c4b5fd",
              lineHeight: 1.6,
            }}>
              💡 <strong>Biggest opportunity:</strong> Move your pricing comparison and key recommendations into the first two paragraphs. AI systems often only read the top of the page.
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === "issues" && (
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
              Issues that affect how AI systems see your content.
            </div>
            {ISSUES.map((issue, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "10px 12px",
                  background: issue.severity === "critical"
                    ? "rgba(239,68,68,0.06)"
                    : issue.severity === "warning"
                    ? "rgba(234,179,8,0.04)"
                    : "rgba(34,197,94,0.04)",
                  border: `1px solid ${
                    issue.severity === "critical"
                      ? "rgba(239,68,68,0.15)"
                      : issue.severity === "warning"
                      ? "rgba(234,179,8,0.1)"
                      : "rgba(34,197,94,0.1)"
                  }`,
                  borderRadius: 8,
                }}
              >
                <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>{issue.icon}</span>
                <span style={{
                  fontSize: 12,
                  color: issue.severity === "critical" ? "#fca5a5" : issue.severity === "warning" ? "#fde68a" : "#86efac",
                  lineHeight: 1.5,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {issue.text}
                </span>
              </div>
            ))}
            <div style={{
              marginTop: 8,
              padding: "10px 12px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 11,
              color: "#64748b",
              lineHeight: 1.5,
            }}>
              <strong style={{ color: "#94a3b8" }}>Why this matters:</strong> AI search systems make decisions based on what they can extract in milliseconds. Content behind JavaScript, buried deep in the page, or missing from your meta description may never enter the AI's context window — regardless of how good it is.
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.02)",
      }}>
        <span style={{ fontSize: 10, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
          Analyzed in 1.2s · {new Date().toLocaleDateString()}
        </span>
        <button style={{
          background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
          border: "none",
          borderRadius: 5,
          padding: "5px 12px",
          color: "white",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Export Report
        </button>
      </div>
    </div>
  );
}
