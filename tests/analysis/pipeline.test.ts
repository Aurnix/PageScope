/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { analyzePage } from "../../src/analysis/pipeline";

const sampleHtml = readFileSync(
  join(__dirname, "../fixtures/sample-blog.html"),
  "utf-8"
);

describe("analyzePage", () => {
  it("produces a complete pipeline result", () => {
    const result = analyzePage({
      renderedHtml: sampleHtml,
      fetchedHtml: sampleHtml,
      url: "https://example.com/blog/best-pm-tools-remote-teams",
      meta: "Best project management tools for remote teams in 2026. Compare Monday.com, Asana, Notion pricing, features, and integrations for distributed teams of 10-50 people.",
      jsonLd: [
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Best Project Management Tools for Remote Teams",
          dateModified: "2026-02-15T10:00:00Z",
        }),
      ],
    });

    // Should have 5 stages
    expect(result.stages).toHaveLength(5);

    // Stages should have decreasing token counts (generally)
    expect(result.stages[0].tokens).toBeGreaterThan(0);
    expect(result.stages[0].id).toBe("raw");
    expect(result.stages[3].id).toBe("markdown");
    expect(result.stages[4].id).toBe("snippet");

    // Raw should be larger than markdown
    expect(result.stages[0].tokens).toBeGreaterThan(result.stages[3].tokens);

    // Snippet should be small
    expect(result.stages[4].tokens).toBeLessThan(100);

    // Scores should exist
    expect(result.scores.contentDensity.value).toBeGreaterThanOrEqual(0);
    expect(result.scores.contentDensity.value).toBeLessThanOrEqual(100);
    expect(result.scores.jsIndependence.value).toBeGreaterThanOrEqual(0);
    expect(result.scores.frontLoading.value).toBeGreaterThanOrEqual(0);
    expect(result.scores.extractability.value).toBeGreaterThanOrEqual(0);

    // Should have at least some issues
    expect(result.issues).toBeDefined();
    expect(Array.isArray(result.issues)).toBe(true);

    // Markdown content should exist
    expect(result.markdownContent.length).toBeGreaterThan(0);

    // Snippet should be the meta description
    expect(result.snippetText).toContain("project management");

    // Duration should be recorded
    expect(result.durationMs).toBeGreaterThan(0);

    // URL should be passed through
    expect(result.url).toBe(
      "https://example.com/blog/best-pm-tools-remote-teams"
    );
  });

  it("detects JS dependency when fetchedHtml has less content", () => {
    const result = analyzePage({
      renderedHtml: sampleHtml,
      fetchedHtml: "<html><head></head><body><p>Minimal content</p></body></html>",
      url: "https://example.com/spa-page",
      meta: "A page that relies on JavaScript for content.",
      jsonLd: [],
    });

    // JS Independence should be low since fetched HTML has much less content
    expect(result.scores.jsIndependence.value).toBeLessThan(80);

    // Should produce a JS-dependency issue
    const jsIssue = result.issues.find((i) => i.text.includes("JavaScript"));
    expect(jsIssue).toBeDefined();
  });

  it("falls back to rendered HTML when fetchedHtml is empty", () => {
    const result = analyzePage({
      renderedHtml: sampleHtml,
      fetchedHtml: "",
      url: "https://example.com/fallback",
      meta: "Test fallback behavior.",
      jsonLd: [],
    });

    // When fetchedHtml is empty, pipeline falls back to renderedHtml
    // So noJs stage should equal raw stage
    expect(result.stages[0].tokens).toBe(result.stages[1].tokens);
  });

  it("handles empty HTML gracefully", () => {
    const result = analyzePage({
      renderedHtml: "<html><head></head><body></body></html>",
      fetchedHtml: "<html><head></head><body></body></html>",
      url: "https://example.com",
      meta: "",
      jsonLd: [],
    });

    expect(result.stages).toHaveLength(5);
    expect(result.stages[0].tokens).toBeGreaterThan(0);
  });
});
