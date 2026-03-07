import type { Issue } from "./types";

interface IssueContext {
  renderedHtml: string;
  fetchedHtml: string;
  meta: string;
  jsonLd: string[];
  title: string;
  markdownContent: string;
  renderedContentTokens: number;
  fetchedContentTokens: number;
}

type IssueRule = (ctx: IssueContext) => Issue | null;

const rules: IssueRule[] = [
  // JS-dependent content
  (ctx) => {
    if (ctx.renderedContentTokens === 0) return null;
    const jsDependentPct = Math.max(
      0,
      1 - ctx.fetchedContentTokens / ctx.renderedContentTokens
    );
    if (jsDependentPct > 0.3) {
      return {
        severity: "critical",
        text: `${Math.round(jsDependentPct * 100)}% of your content requires JavaScript to render \u2014 AI crawlers from ChatGPT, Claude, Perplexity, and Gemini won\u2019t see it`,
      };
    }
    if (jsDependentPct > 0.1) {
      return {
        severity: "warning",
        text: `${Math.round(jsDependentPct * 100)}% of content requires JavaScript — some AI crawlers won't see it`,
      };
    }
    return null;
  },

  // Meta description issues
  (ctx) => {
    if (!ctx.meta) {
      return {
        severity: "critical",
        text: "No meta description found \u2014 when AI cites your page, it has no summary to pull from. This is your most important AI-facing content.",
      };
    }
    if (ctx.meta.length > 160) {
      return {
        severity: "warning",
        text: `Meta description is ${ctx.meta.length} chars — search engines will truncate it, front-load key info`,
      };
    }
    if (ctx.meta.length < 50) {
      return {
        severity: "warning",
        text: `Meta description is only ${ctx.meta.length} chars — you have room for more information`,
      };
    }
    return null;
  },

  // H1 missing or unhelpful
  (ctx) => {
    const h1Match = ctx.renderedHtml.match(/<h1[\s\S]*?<\/h1>/i);
    if (!h1Match) {
      return {
        severity: "warning",
        text: "No H1 tag found — AI systems may misjudge the page topic",
      };
    }
    return null;
  },

  // JSON-LD structured data
  (ctx) => {
    if (ctx.jsonLd.length === 0) {
      return {
        severity: "warning",
        text: "No JSON-LD structured data found. Schema markup helps AI systems understand what your page is about and extract structured facts.",
      };
    }
    return null;
  },

  // FAQ schema (positive)
  (ctx) => {
    const hasFaq = ctx.jsonLd.some((ld) => {
      try {
        const obj = JSON.parse(ld);
        const type = obj["@type"];
        if (Array.isArray(type)) {
          return type.some((t: string) => t === "FAQPage" || t === "Question");
        }
        return type === "FAQPage" || type === "Question";
      } catch {
        return false;
      }
    });
    if (hasFaq) {
      return {
        severity: "info",
        text: "FAQ schema detected — good for AI extraction",
      };
    }
    return null;
  },

  // dateModified freshness
  (ctx) => {
    for (const ld of ctx.jsonLd) {
      try {
        const obj = JSON.parse(ld);
        if (obj.dateModified) {
          const date = new Date(obj.dateModified);
          if (isNaN(date.getTime())) continue;
          const monthsAgo =
            (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
          if (monthsAgo > 6) {
            return {
              severity: "warning",
              text: `dateModified is ${Math.round(monthsAgo)} months old — AI systems favor recent content`,
            };
          }
          return {
            severity: "info",
            text: "dateModified present in JSON-LD",
          };
        }
      } catch {
        continue;
      }
    }
    return null;
  },

  // Front-loading check
  (ctx) => {
    if (!ctx.markdownContent || !ctx.title) return null;
    const titleWords = ctx.title
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const first150 = ctx.markdownContent.slice(0, 150).toLowerCase();
    const found = titleWords.filter((w) => {
      const pattern = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      return pattern.test(first150);
    }).length;
    const ratio =
      titleWords.length > 0 ? found / titleWords.length : 0;
    if (ratio < 0.3) {
      return {
        severity: "warning",
        text: "Key topic terms don't appear in the first 150 characters — AI may miss your core message",
      };
    }
    return null;
  },
];

export function detectIssues(ctx: IssueContext): Issue[] {
  const issues: Issue[] = [];
  for (const rule of rules) {
    const issue = rule(ctx);
    if (issue) issues.push(issue);
  }
  // Sort: critical first, then warning, then info
  const order = { critical: 0, warning: 1, info: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);
  return issues;
}
