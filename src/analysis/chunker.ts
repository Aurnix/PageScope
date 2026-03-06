import { countTokens } from "./tokenizer";
import type { ChunkResult } from "./types";
import { CHUNK_SIZE_TOKENS } from "../shared/constants";

export function chunkMarkdown(
  markdown: string,
  maxTokens: number = CHUNK_SIZE_TOKENS
): ChunkResult[] {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const chunks: ChunkResult[] = [];
  let currentHeading = "";
  let currentContent = "";

  function flushChunk() {
    const trimmed = currentContent.trim();
    if (trimmed) {
      chunks.push({
        headingContext: currentHeading,
        content: trimmed,
        tokens: countTokens(trimmed),
      });
    }
    currentContent = "";
  }

  for (const line of lines) {
    // Detect headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      // Flush whatever we've accumulated before this heading
      flushChunk();
      currentHeading = headingMatch[2];
    }

    const prospective = currentContent + (currentContent ? "\n" : "") + line;
    if (countTokens(prospective) > maxTokens && currentContent.trim()) {
      flushChunk();
      // If the single line itself exceeds maxTokens, split it by words
      if (countTokens(line) > maxTokens) {
        const words = line.split(/\s+/);
        for (const word of words) {
          const wordProspective = currentContent
            ? currentContent + " " + word
            : word;
          if (
            countTokens(wordProspective) > maxTokens &&
            currentContent.trim()
          ) {
            flushChunk();
            currentContent = word;
          } else {
            currentContent = wordProspective;
          }
        }
      } else {
        currentContent = line;
      }
    } else {
      currentContent = prospective;
    }
  }

  flushChunk();
  return chunks;
}
