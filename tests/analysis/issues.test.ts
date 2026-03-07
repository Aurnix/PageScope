import { describe, it, expect } from "vitest";
import { detectIssues } from "../../src/analysis/issues";

function makeCtx(overrides: Partial<Parameters<typeof detectIssues>[0]> = {}) {
  return {
    renderedHtml:
      "<html><head></head><body><h1>Title</h1><p>Content here</p></body></html>",
    fetchedHtml:
      "<html><head></head><body><h1>Title</h1><p>Content here</p></body></html>",
    meta: "A valid meta description that is between 50 and 160 characters long for testing purposes here.",
    jsonLd: [
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        dateModified: new Date().toISOString(),
      }),
    ],
    title: "Title",
    markdownContent: "Title appears in the first 150 characters of content.",
    renderedContentTokens: 100,
    fetchedContentTokens: 100,
    ...overrides,
  };
}

describe("detectIssues", () => {
  describe("JS-dependent content rule", () => {
    it("returns critical when >30% content requires JS", () => {
      const issues = detectIssues(
        makeCtx({ renderedContentTokens: 100, fetchedContentTokens: 50 })
      );
      const jsIssue = issues.find((i) => i.text.includes("JavaScript"));
      expect(jsIssue).toBeDefined();
      expect(jsIssue!.severity).toBe("critical");
    });

    it("returns warning when 10-30% content requires JS", () => {
      const issues = detectIssues(
        makeCtx({ renderedContentTokens: 100, fetchedContentTokens: 85 })
      );
      const jsIssue = issues.find((i) => i.text.includes("JavaScript"));
      expect(jsIssue).toBeDefined();
      expect(jsIssue!.severity).toBe("warning");
    });

    it("returns nothing when content is JS-independent", () => {
      const issues = detectIssues(
        makeCtx({ renderedContentTokens: 100, fetchedContentTokens: 100 })
      );
      const jsIssue = issues.find((i) => i.text.includes("JavaScript"));
      expect(jsIssue).toBeUndefined();
    });

    it("handles 0 rendered tokens without crashing", () => {
      const issues = detectIssues(
        makeCtx({ renderedContentTokens: 0, fetchedContentTokens: 0 })
      );
      const jsIssue = issues.find((i) => i.text.includes("JavaScript"));
      expect(jsIssue).toBeUndefined();
    });

    it("clamps negative percentage when fetched > rendered", () => {
      const issues = detectIssues(
        makeCtx({ renderedContentTokens: 50, fetchedContentTokens: 100 })
      );
      const jsIssue = issues.find((i) => i.text.includes("JavaScript"));
      expect(jsIssue).toBeUndefined();
    });
  });

  describe("meta description rule", () => {
    it("returns critical when meta is missing", () => {
      const issues = detectIssues(makeCtx({ meta: "" }));
      const metaIssue = issues.find((i) => i.text.includes("meta description"));
      expect(metaIssue).toBeDefined();
      expect(metaIssue!.severity).toBe("critical");
    });

    it("returns warning when meta is too long", () => {
      const issues = detectIssues(makeCtx({ meta: "a".repeat(161) }));
      const metaIssue = issues.find((i) => i.text.includes("161 chars"));
      expect(metaIssue).toBeDefined();
      expect(metaIssue!.severity).toBe("warning");
    });

    it("returns warning when meta is too short", () => {
      const issues = detectIssues(makeCtx({ meta: "Short." }));
      const metaIssue = issues.find((i) => i.text.includes("6 chars"));
      expect(metaIssue).toBeDefined();
      expect(metaIssue!.severity).toBe("warning");
    });

    it("returns nothing for a good meta description", () => {
      const issues = detectIssues(
        makeCtx({
          meta: "A valid meta description that is between 50 and 160 characters long for testing purposes here.",
        })
      );
      const metaIssue = issues.find((i) =>
        i.text.includes("No meta description")
      );
      expect(metaIssue).toBeUndefined();
    });
  });

  describe("H1 rule", () => {
    it("returns warning when no H1 tag", () => {
      const issues = detectIssues(
        makeCtx({ renderedHtml: "<html><body><p>No heading</p></body></html>" })
      );
      const h1Issue = issues.find((i) => i.text.includes("H1"));
      expect(h1Issue).toBeDefined();
      expect(h1Issue!.severity).toBe("warning");
    });

    it("returns nothing when H1 exists", () => {
      const issues = detectIssues(
        makeCtx({
          renderedHtml: "<html><body><h1>My Heading</h1></body></html>",
        })
      );
      const h1Issue = issues.find((i) => i.text.includes("H1"));
      expect(h1Issue).toBeUndefined();
    });
  });

  describe("JSON-LD rule", () => {
    it("returns warning when no JSON-LD", () => {
      const issues = detectIssues(makeCtx({ jsonLd: [] }));
      const ldIssue = issues.find((i) => i.text.includes("JSON-LD"));
      expect(ldIssue).toBeDefined();
      expect(ldIssue!.severity).toBe("warning");
    });
  });

  describe("FAQ schema rule", () => {
    it("returns info when FAQ schema detected", () => {
      const issues = detectIssues(
        makeCtx({
          jsonLd: [JSON.stringify({ "@type": "FAQPage" })],
        })
      );
      const faqIssue = issues.find((i) => i.text.includes("FAQ"));
      expect(faqIssue).toBeDefined();
      expect(faqIssue!.severity).toBe("info");
    });
  });

  describe("dateModified freshness rule", () => {
    it("returns warning for old dateModified", () => {
      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 1);
      const issues = detectIssues(
        makeCtx({
          jsonLd: [
            JSON.stringify({
              "@type": "Article",
              dateModified: oldDate.toISOString(),
            }),
          ],
        })
      );
      const dateIssue = issues.find((i) => i.text.includes("months old"));
      expect(dateIssue).toBeDefined();
      expect(dateIssue!.severity).toBe("warning");
    });

    it("returns info for recent dateModified", () => {
      const issues = detectIssues(
        makeCtx({
          jsonLd: [
            JSON.stringify({
              "@type": "Article",
              dateModified: new Date().toISOString(),
            }),
          ],
        })
      );
      const dateIssue = issues.find((i) =>
        i.text.includes("dateModified present")
      );
      expect(dateIssue).toBeDefined();
      expect(dateIssue!.severity).toBe("info");
    });
  });

  describe("front-loading rule", () => {
    it("returns warning when title words are absent from opening", () => {
      const issues = detectIssues(
        makeCtx({
          title: "Advanced Quantum Computing Research",
          markdownContent:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
        })
      );
      const frontIssue = issues.find((i) =>
        i.text.includes("first 150 characters")
      );
      expect(frontIssue).toBeDefined();
      expect(frontIssue!.severity).toBe("warning");
    });

    it("returns nothing when title words appear early", () => {
      const issues = detectIssues(
        makeCtx({
          title: "Project Management Tools",
          markdownContent:
            "Project management tools help remote teams collaborate effectively.",
        })
      );
      const frontIssue = issues.find((i) =>
        i.text.includes("first 150 characters")
      );
      expect(frontIssue).toBeUndefined();
    });
  });

  describe("sorting", () => {
    it("sorts issues by severity: critical first, then warning, then info", () => {
      const issues = detectIssues(
        makeCtx({
          meta: "",
          renderedContentTokens: 100,
          fetchedContentTokens: 50,
          jsonLd: [JSON.stringify({ "@type": "FAQPage" })],
        })
      );
      const severities = issues.map((i) => i.severity);
      const criticalIdx = severities.indexOf("critical");
      const warningIdx = severities.indexOf("warning");
      const infoIdx = severities.indexOf("info");

      if (criticalIdx !== -1 && warningIdx !== -1) {
        expect(criticalIdx).toBeLessThan(warningIdx);
      }
      if (warningIdx !== -1 && infoIdx !== -1) {
        expect(warningIdx).toBeLessThan(infoIdx);
      }
    });
  });
});
