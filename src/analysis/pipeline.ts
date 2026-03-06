import { countTokens } from "./tokenizer";
import { extractContent } from "./readability";
import { htmlToMarkdown } from "./markdown";
import { extractSnippet } from "./snippet";
import { computeScores } from "./scores";
import { detectIssues } from "./issues";
import { STAGE_META } from "../shared/constants";
import type { PipelineResult, StageResult } from "./types";

export interface PipelineInput {
  renderedHtml: string;
  fetchedHtml: string;
  url: string;
  meta: string;
  jsonLd: string[];
}

export function analyzePage(input: PipelineInput): PipelineResult {
  const start = performance.now();

  // Stage 1: Raw HTML (rendered DOM)
  const rawTokens = countTokens(input.renderedHtml);

  // Stage 2: Without JavaScript (fetched HTML)
  const fetchedHtml = input.fetchedHtml || input.renderedHtml;
  const noJsTokens = countTokens(fetchedHtml);

  // Stage 3: Content only (Readability on fetched HTML)
  const renderedArticle = extractContent(input.renderedHtml);
  const fetchedArticle = extractContent(fetchedHtml);
  const cleanedHtml = fetchedArticle.content || renderedArticle.content;
  const cleanedTokens = countTokens(cleanedHtml);
  const title = fetchedArticle.title || renderedArticle.title;

  // Stage 4: Markdown conversion
  const markdown = htmlToMarkdown(cleanedHtml);
  const markdownTokens = countTokens(markdown);

  // Stage 5: 50-token pitch
  const ogDescription = extractOgDescription(input.renderedHtml);
  const snippetText = extractSnippet(
    input.meta,
    ogDescription,
    fetchedArticle.excerpt,
    markdown
  );
  const snippetTokens = countTokens(snippetText);

  // Token counts for scoring
  const renderedContentTokens = countTokens(renderedArticle.content);
  const fetchedContentTokens = countTokens(fetchedArticle.content);

  // Scores
  const scores = computeScores({
    rawTokens,
    markdownTokens,
    fetchedContentTokens,
    renderedContentTokens,
    title,
    markdownContent: markdown,
  });

  // Issues
  const issues = detectIssues({
    renderedHtml: input.renderedHtml,
    fetchedHtml: fetchedHtml,
    meta: input.meta,
    jsonLd: input.jsonLd,
    title,
    markdownContent: markdown,
    renderedContentTokens,
    fetchedContentTokens,
  });

  const stages: StageResult[] = [
    { ...STAGE_META[0], tokens: rawTokens, content: input.renderedHtml },
    { ...STAGE_META[1], tokens: noJsTokens, content: fetchedHtml },
    { ...STAGE_META[2], tokens: cleanedTokens, content: cleanedHtml },
    { ...STAGE_META[3], tokens: markdownTokens, content: markdown },
    { ...STAGE_META[4], tokens: snippetTokens, content: snippetText },
  ];

  const durationMs = performance.now() - start;

  return {
    url: input.url,
    stages,
    scores,
    issues,
    markdownContent: markdown,
    snippetText,
    analyzedAt: Date.now(),
    durationMs,
  };
}

function extractOgDescription(html: string): string {
  const match = html.match(
    /<meta\s+(?:property|name)="og:description"\s+content="([^"]*)"/i
  );
  return match?.[1] ?? "";
}
