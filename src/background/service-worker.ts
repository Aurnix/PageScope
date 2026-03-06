import type { FetchRawHtmlResponse } from "../shared/messages";

chrome.runtime.onMessage.addListener(
  (msg, _sender, sendResponse: (response: FetchRawHtmlResponse) => void) => {
    if (msg.type === "FETCH_RAW_HTML") {
      fetch(msg.url)
        .then((r) => r.text())
        .then((html) => sendResponse({ html }))
        .catch((err: Error) => sendResponse({ error: err.message }));
    }
    return true;
  }
);
