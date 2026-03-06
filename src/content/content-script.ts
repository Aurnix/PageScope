import type { AnalyzePageResponse } from "../shared/messages";

chrome.runtime.onMessage.addListener(
  (msg, _sender, sendResponse: (response: AnalyzePageResponse) => void) => {
    if (msg.type === "ANALYZE_PAGE") {
      const rawHtml = document.documentElement.outerHTML;
      const url = window.location.href;
      const meta =
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") ?? "";
      const jsonLd = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((el) => el.textContent ?? "");

      sendResponse({ rawHtml, url, meta, jsonLd });
    }
    return true;
  }
);
