import { GRADE_THRESHOLDS } from "../shared/constants";
import type { Score, ScoreSet } from "./types";

function toGrade(value: number): { grade: string; color: string } {
  for (const t of GRADE_THRESHOLDS) {
    if (value >= t.min) return { grade: t.grade, color: t.color };
  }
  return { grade: "F", color: "#ef4444" };
}

function makeScore(
  label: string,
  value: number,
  tip: string
): Score {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const { grade, color } = toGrade(clamped);
  return { value: clamped, grade, label, color, tip };
}

export function computeContentDensity(
  rawTokens: number,
  markdownTokens: number
): Score {
  const ratio = rawTokens > 0 ? (markdownTokens / rawTokens) * 100 : 0;
  return makeScore(
    "Content Density",
    ratio,
    `Only ${Math.round(ratio)}% of your page tokens are actual content. The rest is packaging.`
  );
}

export function computeJsIndependence(
  fetchedContentTokens: number,
  renderedContentTokens: number
): Score {
  if (renderedContentTokens === 0) {
    return makeScore(
      "JS Independence",
      0,
      "Could not extract content from the rendered page."
    );
  }
  const ratio = (fetchedContentTokens / renderedContentTokens) * 100;
  const capped = Math.min(ratio, 100);
  return makeScore(
    "JS Independence",
    capped,
    `${Math.round(capped)}% of content visible without JavaScript. ${
      capped >= 90
        ? "Excellent — AI crawlers see almost everything."
        : capped >= 70
          ? "Good, but some content is invisible to most AI crawlers."
          : "Significant content requires JavaScript — invisible to most AI crawlers."
    }`
  );
}

export function computeFrontLoading(
  title: string,
  markdownContent: string
): Score {
  if (!title || !markdownContent) {
    return makeScore(
      "Front-Loading",
      0,
      "Could not analyze front-loading — missing title or content."
    );
  }

  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const first150 = markdownContent.slice(0, 150).toLowerCase();
  const firstParagraph = markdownContent.split(/\n\n/)[0]?.toLowerCase() ?? "";

  let found = 0;
  for (const word of titleWords) {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (pattern.test(first150) || pattern.test(firstParagraph)) {
      found++;
    }
  }

  const ratio = titleWords.length > 0 ? (found / titleWords.length) * 100 : 0;
  return makeScore(
    "Front-Loading",
    ratio,
    ratio >= 75
      ? "Key claims appear early in the content. AI systems will find them quickly."
      : ratio >= 50
        ? "Some key terms appear early, but consider front-loading more critical information."
        : "Key claims don't appear until later in the content. AI may never see them."
  );
}

export function computeExtractability(markdownContent: string): Score {
  if (!markdownContent) {
    return makeScore("Extractability", 0, "No content to analyze.");
  }

  const sentences = markdownContent
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  if (sentences.length === 0) {
    return makeScore("Extractability", 0, "No extractable sentences found.");
  }

  let goodSentences = 0;
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    const hasReasonableLength = words.length <= 30;
    const hasNumber = /\d/.test(sentence);
    const hasMidCap = words.slice(1).some((w) => /^[A-Z]/.test(w));
    const hasQuoted = /["\u201C].+?["\u201D]/.test(sentence);
    const hasSpecifics = hasNumber || hasMidCap || hasQuoted;
    const doesntStartWithPronoun =
      !/^(it|this|that|they|we|he|she)\b/i.test(sentence);

    if (hasReasonableLength && hasSpecifics && doesntStartWithPronoun) {
      goodSentences++;
    }
  }

  const ratio = (goodSentences / sentences.length) * 100;
  return makeScore(
    "Extractability",
    ratio,
    ratio >= 75
      ? "Content is structured as clear, extractable statements. Great for AI systems."
      : ratio >= 50
        ? "Content is reasonably extractable but could benefit from more declarative statements."
        : "Content uses complex prose that AI systems may struggle to extract claims from."
  );
}

export function computeScores(params: {
  rawTokens: number;
  markdownTokens: number;
  fetchedContentTokens: number;
  renderedContentTokens: number;
  title: string;
  markdownContent: string;
}): ScoreSet {
  return {
    contentDensity: computeContentDensity(
      params.rawTokens,
      params.markdownTokens
    ),
    jsIndependence: computeJsIndependence(
      params.fetchedContentTokens,
      params.renderedContentTokens
    ),
    frontLoading: computeFrontLoading(params.title, params.markdownContent),
    extractability: computeExtractability(params.markdownContent),
  };
}
