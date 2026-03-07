export type StageId = "raw" | "nojs" | "cleaned" | "markdown" | "snippet";

export interface StageResult {
  id: StageId;
  label: string;
  tokens: number;
  content: string;
  color: string;
  description: string;
  detail: string;
}

export interface PipelineResult {
  url: string;
  stages: StageResult[];
  scores: ScoreSet;
  issues: Issue[];
  markdownContent: string;
  snippetText: string;
  analyzedAt: number;
  durationMs: number;
}

export interface ScoreSet {
  contentDensity: Score;
  jsIndependence: Score;
  frontLoading: Score;
  extractability: Score;
}

export interface Score {
  value: number;
  grade: string;
  label: string;
  color: string;
  tip: string;
}

export interface Issue {
  severity: "critical" | "warning" | "info";
  text: string;
}
