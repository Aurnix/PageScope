import { Readability } from "@mozilla/readability";

export interface ReadabilityResult {
  content: string;
  title: string;
  excerpt: string;
}

export function extractContent(html: string): ReadabilityResult {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const reader = new Readability(doc);
  const article = reader.parse();
  return {
    content: article?.content ?? "",
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
  };
}
