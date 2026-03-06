import { describe, it, expect } from "vitest";
import { chunkMarkdown } from "../../src/analysis/chunker";

describe("chunkMarkdown", () => {
  it("returns empty array for empty input", () => {
    expect(chunkMarkdown("")).toEqual([]);
  });

  it("creates a single chunk for short content", () => {
    const chunks = chunkMarkdown("# Hello\n\nShort content here.");
    expect(chunks.length).toBe(1);
    expect(chunks[0].headingContext).toBe("Hello");
    expect(chunks[0].tokens).toBeGreaterThan(0);
  });

  it("preserves heading context across chunks", () => {
    // Create content long enough to need multiple chunks
    const longParagraph = "This is a sentence with several words. ".repeat(100);
    const markdown = `# Main Title\n\n${longParagraph}\n\n## Section Two\n\n${longParagraph}`;
    const chunks = chunkMarkdown(markdown, 512);

    expect(chunks.length).toBeGreaterThan(1);
    // First chunk should have "Main Title" as heading context
    expect(chunks[0].headingContext).toBe("Main Title");
  });

  it("respects max token limit", () => {
    const longParagraph = "Word ".repeat(1000);
    const chunks = chunkMarkdown(`# Test\n\n${longParagraph}`, 512);

    for (const chunk of chunks) {
      // Allow some overflow since we split at line boundaries
      expect(chunk.tokens).toBeLessThan(600);
    }
  });

  it("splits at heading boundaries", () => {
    const markdown = [
      "# First Section",
      "Content of first section.",
      "",
      "## Second Section",
      "Content of second section.",
    ].join("\n");

    const chunks = chunkMarkdown(markdown, 512);
    expect(chunks.length).toBe(2);
    expect(chunks[0].headingContext).toBe("First Section");
    expect(chunks[1].headingContext).toBe("Second Section");
  });
});
