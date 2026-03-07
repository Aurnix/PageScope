import { describe, it, expect } from "vitest";
import { countTokens } from "../../src/analysis/tokenizer";

describe("countTokens", () => {
  it("returns 0 for empty string", () => {
    expect(countTokens("")).toBe(0);
  });

  it("returns 0 for falsy input", () => {
    // countTokens guards against falsy values at runtime even though TS types require string
    expect(countTokens("")).toBe(0);
  });

  it("counts tokens for simple text", () => {
    const tokens = countTokens("Hello, world!");
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(10);
  });

  it("counts more tokens for longer text", () => {
    const short = countTokens("Hello");
    const long = countTokens(
      "This is a much longer piece of text that should have significantly more tokens than just a single word."
    );
    expect(long).toBeGreaterThan(short);
  });

  it("handles HTML content", () => {
    const html = "<div><h1>Title</h1><p>Some paragraph text.</p></div>";
    const tokens = countTokens(html);
    expect(tokens).toBeGreaterThan(0);
  });
});
