import { useState, useEffect } from "react";
import { analyzePage } from "../../analysis/pipeline";
import type { PipelineResult } from "../../analysis/types";
import type {
  AnalyzePageResponse,
  FetchRawHtmlResponse,
} from "../../shared/messages";

export function usePageAnalysis() {
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyze() {
      try {
        // 1. Get active tab
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (!tab?.id || !tab.url) {
          throw new Error("Cannot access the current tab.");
        }

        // Skip restricted pages
        if (
          tab.url.startsWith("chrome://") ||
          tab.url.startsWith("chrome-extension://") ||
          tab.url.startsWith("about:")
        ) {
          throw new Error(
            "Cannot analyze browser internal pages. Navigate to a website first."
          );
        }

        // 2. Get rendered HTML from content script
        const pageData: AnalyzePageResponse = await chrome.tabs.sendMessage(
          tab.id,
          { type: "ANALYZE_PAGE" }
        );

        // 3. Fetch raw HTML via service worker
        let fetchedHtml = "";
        try {
          const rawData: FetchRawHtmlResponse =
            await chrome.runtime.sendMessage({
              type: "FETCH_RAW_HTML",
              url: tab.url,
            });
          if (rawData.error) {
            console.warn(`Raw HTML fetch failed: ${rawData.error}`);
            fetchedHtml = pageData.rawHtml;
          } else {
            fetchedHtml = rawData.html ?? "";
          }
        } catch {
          // If fetch fails (CORS, auth, etc.), fall back to rendered HTML
          fetchedHtml = pageData.rawHtml;
        }

        // 4. Run analysis pipeline
        const pipelineResult = analyzePage({
          renderedHtml: pageData.rawHtml,
          fetchedHtml,
          url: pageData.url,
          meta: pageData.meta,
          jsonLd: pageData.jsonLd,
        });

        setResult(pipelineResult);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("Could not establish connection")) {
          setError("Could not connect to this page. Try reloading it first.");
        } else if (msg.includes("Cannot access")) {
          setError(
            "Cannot analyze this page type. Navigate to a website first."
          );
        } else {
          setError(msg || "An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    analyze();
  }, []);

  return { result, loading, error };
}
