import { describe, it, expect } from "vitest";
import {
  computeContentDensity,
  computeJsIndependence,
  computeFrontLoading,
  computeExtractability,
} from "../../src/analysis/scores";

describe("computeContentDensity", () => {
  it("returns 0 when raw tokens is 0", () => {
    const score = computeContentDensity(0, 0);
    expect(score.value).toBe(0);
  });

  it("computes correct ratio", () => {
    const score = computeContentDensity(10000, 2000);
    expect(score.value).toBe(20);
    expect(score.grade).toBe("F");
  });

  it("assigns correct grades", () => {
    expect(computeContentDensity(100, 95).grade).toBe("A");
    expect(computeContentDensity(100, 80).grade).toBe("B");
    expect(computeContentDensity(100, 55).grade).toBe("C");
    expect(computeContentDensity(100, 30).grade).toBe("D");
    expect(computeContentDensity(100, 10).grade).toBe("F");
  });
});

describe("computeJsIndependence", () => {
  it("returns 100 when fetched equals rendered", () => {
    const score = computeJsIndependence(5000, 5000);
    expect(score.value).toBe(100);
    expect(score.grade).toBe("A");
  });

  it("returns low score when fetched has much less content", () => {
    const score = computeJsIndependence(1000, 5000);
    expect(score.value).toBe(20);
  });

  it("handles 0 rendered content", () => {
    const score = computeJsIndependence(0, 0);
    expect(score.value).toBe(0);
  });
});

describe("computeFrontLoading", () => {
  it("returns 0 when title is empty", () => {
    const score = computeFrontLoading("", "Some content");
    expect(score.value).toBe(0);
  });

  it("returns high score when title words appear early", () => {
    const score = computeFrontLoading(
      "Best Project Management Tools",
      "Best project management tools for remote teams. These tools help your team collaborate effectively."
    );
    expect(score.value).toBeGreaterThan(50);
  });

  it("returns low score when title words are absent", () => {
    const score = computeFrontLoading(
      "Best Project Management Tools",
      "Introduction to our comprehensive review of software solutions available today."
    );
    expect(score.value).toBeLessThan(50);
  });
});

describe("computeExtractability", () => {
  it("returns 0 for empty content", () => {
    const score = computeExtractability("");
    expect(score.value).toBe(0);
  });

  it("scores well for clear declarative sentences", () => {
    const content = [
      "Monday.com costs $8 per seat per month.",
      "Asana Premium costs $10.99 per seat per month.",
      "Notion offers a free tier for small teams.",
    ].join(" ");
    const score = computeExtractability(content);
    expect(score.value).toBeGreaterThan(50);
  });

  it("scores lower for vague pronoun-heavy text", () => {
    const content = [
      "It is something that many people find useful in various situations.",
      "This can be applied to different contexts depending on needs.",
      "They often recommend it for those who want something better.",
    ].join(" ");
    const score = computeExtractability(content);
    expect(score.value).toBeLessThan(50);
  });
});
