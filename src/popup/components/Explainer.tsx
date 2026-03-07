import { useState, useEffect } from "react";

const STORAGE_KEY = "tokenlens_explainer_dismissed";

export default function Explainer() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        setDismissed(result[STORAGE_KEY] === true);
      });
    } catch {
      // If storage is unavailable, show the explainer
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      chrome.storage.local.set({ [STORAGE_KEY]: true });
    } catch {
      // Best-effort persist
    }
  };

  return (
    <div
      style={{
        margin: "8px 12px",
        padding: 12,
        background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.06))",
        border: "1px solid rgba(6,182,212,0.15)",
        borderRadius: 8,
        fontSize: 12,
        color: "#cbd5e1",
        lineHeight: 1.6,
        position: "relative",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          color: "#e2e8f0",
          marginBottom: 6,
          fontSize: 12,
        }}
      >
        How TokenLens works
      </div>
      <div>
        Your website is built for browsers — with JavaScript, styling, and
        interactivity that makes it work for humans. But when an AI like ChatGPT
        or Perplexity reads your page, it strips all of that away. TokenLens
        shows you what survives that translation: the exact content AI systems
        actually see, score, and cite.
      </div>
      <button
        onClick={handleDismiss}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          fontSize: 14,
          padding: "2px 6px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
