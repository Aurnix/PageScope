import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Remove images but keep alt text
turndown.addRule("images", {
  filter: "img",
  replacement: (_content, node) => {
    const alt = (node as HTMLImageElement).getAttribute("alt");
    return alt ? `[${alt}]` : "";
  },
});

export function htmlToMarkdown(html: string): string {
  if (!html) return "";
  return turndown.turndown(html).trim();
}
