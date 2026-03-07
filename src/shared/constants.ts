import type { StageId } from "../analysis/types";

export interface StageMeta {
  id: StageId;
  label: string;
  color: string;
  description: string;
  detail: string;
}

export const STAGE_META: StageMeta[] = [
  {
    id: "raw",
    label: "Raw HTML",
    color: "#ef4444",
    description: "Your full page as browsers see it",
    detail:
      "All the structure that makes your site work for humans \u2014 navigation, styling, scripts, interactivity, layout. None of this is waste; it\u2019s just not what AI reads.",
  },
  {
    id: "nojs",
    label: "Without JavaScript",
    color: "#f97316",
    description: "What most AI crawlers actually receive",
    detail:
      "Most AI crawlers \u2014 including ChatGPT, Claude, Perplexity, and Gemini \u2014 don\u2019t execute JavaScript. Content loaded dynamically by React, Vue, or Angular won\u2019t reach them. This stage shows what they actually receive.",
  },
  {
    id: "cleaned",
    label: "Content Only",
    color: "#eab308",
    description: "After stripping layout and navigation",
    detail:
      "Navigation, sidebars, footers, and boilerplate removed \u2014 the same extraction that AI systems perform. What remains is the content they\u2019ll actually process.",
  },
  {
    id: "markdown",
    label: "AI-Ready Text",
    color: "#22c55e",
    description: "What actually enters the AI\u2019s context window",
    detail:
      "Your content converted to clean structured text with headings preserved. This is what an LLM actually processes when it reads your page. The AI View tab shows you exactly what this looks like.",
  },
  {
    id: "snippet",
    label: "Your 50-Token Pitch",
    color: "#06b6d4",
    description: "Often the only thing that represents you",
    detail:
      "Your meta description is often the only thing an AI cites about your page. When ChatGPT or Perplexity answer a question and link to you, this is frequently all they read. Make it count.",
  },
];

export const STAGE_HINTS: Record<StageId, string> = {
  raw: "",
  nojs: "If this drop is large, your content relies on client-side rendering. Consider server-side rendering (SSR) or static generation for key content pages.",
  cleaned:
    "This reduction is normal \u2014 it\u2019s your site\u2019s layout being stripped. A large gap here is expected for complex sites.",
  markdown:
    "If significant content is lost here, check for content inside iframes, embedded widgets, or non-standard HTML that parsers can\u2019t extract.",
  snippet:
    "This is your meta description. Write it as if it\u2019s the only thing an AI will ever read about this page \u2014 because often it is.",
};

export const GRADE_THRESHOLDS = [
  { min: 90, grade: "A", color: "#22c55e" },
  { min: 75, grade: "B", color: "#22c55e" },
  { min: 50, grade: "C", color: "#eab308" },
  { min: 25, grade: "D", color: "#f97316" },
  { min: 0, grade: "F", color: "#ef4444" },
] as const;
