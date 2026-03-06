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

export interface FetchRawHtmlResponse {
  html?: string;
  error?: string;
}

export type MessageRequest = AnalyzePageRequest | FetchRawHtmlRequest;
