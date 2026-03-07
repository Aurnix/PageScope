import type { FetchRawHtmlResponse } from "../shared/messages";

chrome.runtime.onMessage.addListener(
  (msg, _sender, sendResponse: (response: FetchRawHtmlResponse) => void) => {
    if (msg.type === "FETCH_RAW_HTML") {
      fetch(msg.url)
        .then((r) => r.text())
        .then((html) => sendResponse({ html }))
        .catch((err: unknown) =>
          sendResponse({
            error:
              err instanceof Error ? err.message : "Unknown fetch error",
          })
        );
      return true; // keep port open for async response
    }
  }
);
