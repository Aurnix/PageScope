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
    description: "Everything your browser downloads",
    detail:
      "Nav bars, CSS classes, scripts, ads, cookie banners, tracking pixels, footer links — the full page weight.",
  },
  {
    id: "nojs",
    label: "Without JavaScript",
    color: "#f97316",
    description: "What most AI crawlers actually receive",
    detail:
      "ChatGPT, Claude, and Gemini don't run JavaScript. Any content loaded by React, Vue, or Angular is invisible to them.",
  },
  {
    id: "cleaned",
    label: "Content Only",
    color: "#eab308",
    description: "After removing page chrome",
    detail:
      "Navigation, sidebars, footers, ads, and boilerplate stripped. Just the article body and meaningful content remain.",
  },
  {
    id: "markdown",
    label: "AI-Ready Text",
    color: "#22c55e",
    description: "Clean text the AI can actually use",
    detail:
      "Structured markdown with headings preserved. This is close to what enters the AI's 'brain' for processing.",
  },
  {
    id: "snippet",
    label: "Your 50-Token Pitch",
    color: "#06b6d4",
    description: "Often the ONLY thing the AI reads",
    detail:
      "Your meta description or Google's snippet. In many cases, this is your entire representation in the AI's answer.",
  },
];

export const CHUNK_SIZE_TOKENS = 512;

export const GRADE_THRESHOLDS = [
  { min: 90, grade: "A", color: "#22c55e" },
  { min: 75, grade: "B", color: "#22c55e" },
  { min: 50, grade: "C", color: "#eab308" },
  { min: 25, grade: "D", color: "#f97316" },
  { min: 0, grade: "F", color: "#ef4444" },
] as const;
