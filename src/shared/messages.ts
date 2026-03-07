export interface AnalyzePageRequest {
  type: "ANALYZE_PAGE";
}

export interface AnalyzePageResponse {
  rawHtml: string;
  url: string;
  meta: string;
  jsonLd: string[];
}

export interface FetchRawHtmlRequest {
  type: "FETCH_RAW_HTML";
  url: string;
}

export type FetchRawHtmlResponse =
  | { html: string; error?: undefined }
  | { html?: undefined; error: string };

export type MessageRequest = AnalyzePageRequest | FetchRawHtmlRequest;
