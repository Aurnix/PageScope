import { countTokens } from "./tokenizer";

export function extractSnippet(
  meta: string,
  ogDescription: string,
  excerpt: string,
  markdown: string
): string {
  // Priority: meta description > og:description > readability excerpt > first ~50 tokens of markdown
  if (meta && meta.trim()) return meta.trim();
  if (ogDescription && ogDescription.trim()) return ogDescription.trim();
  if (excerpt && excerpt.trim()) return excerpt.trim();

  // Fall back to first ~50 tokens of markdown
  if (!markdown) return "";
  const words = markdown.split(/\s+/);
  let result = "";
  for (const word of words) {
    const candidate = result ? result + " " + word : word;
    if (countTokens(candidate) > 50) break;
    result = candidate;
  }
  return result;
}
