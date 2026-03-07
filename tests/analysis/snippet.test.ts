import { describe, it, expect } from "vitest";
import { extractSnippet } from "../../src/analysis/snippet";

describe("extractSnippet", () => {
  it("prefers meta description over other sources", () => {
    const result = extractSnippet(
      "Meta description",
      "OG description",
      "Readability excerpt",
      "Markdown content"
    );
    expect(result).toBe("Meta description");
  });

  it("falls back to og:description when meta is empty", () => {
    const result = extractSnippet(
      "",
      "OG description",
      "Readability excerpt",
      "Markdown content"
    );
    expect(result).toBe("OG description");
  });

  it("falls back to readability excerpt when meta and og are empty", () => {
    const result = extractSnippet(
      "",
      "",
      "Readability excerpt",
      "Markdown content"
    );
    expect(result).toBe("Readability excerpt");
  });

  it("falls back to truncated markdown when all descriptions are empty", () => {
    const markdown =
      "This is the beginning of a long markdown document that should be truncated to approximately fifty tokens by the extraction function.";
    const result = extractSnippet("", "", "", markdown);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(markdown.length + 1);
  });

  it("returns empty string when all sources are empty", () => {
    const result = extractSnippet("", "", "", "");
    expect(result).toBe("");
  });

  it("trims whitespace from meta description", () => {
    const result = extractSnippet("  Padded meta  ", "", "", "");
    expect(result).toBe("Padded meta");
  });

  it("skips whitespace-only meta and falls through", () => {
    const result = extractSnippet("   ", "OG fallback", "", "");
    expect(result).toBe("OG fallback");
  });
});
