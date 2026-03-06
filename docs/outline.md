# LLM Tokenomics Analyzer — Product Concept Document

**Working Title:** TokenLens (or similar — TBD)
**Author:** Joseph Sherman
**Date:** March 2026
**Status:** Concept / Pre-Development

---

## The One-Liner

"View Source" for the AI era — shows publishers exactly what LLMs actually see when they consume a webpage, with token counts at every stage of the extraction pipeline.

---

## The Problem

The entire GEO/AEO industry tells publishers to "optimize for AI search" but nobody can show them what AI systems actually ingest from their pages. Publishers are optimizing blind.

The reality of how LLM systems consume web content:

1. Most LLM crawlers don't execute JavaScript (RESONEO confirmed: ChatGPT, Claude, Gemini all skip JS)
2. Content enters the LLM context as either a Google snippet (~50 tokens), a truncated page fetch (~500-1500 tokens), or parametric knowledge (uncontrollable)
3. Every AI search provider optimizes for minimum token spend per query — economic pressure pushes toward LESS content ingestion, not more
4. Cloudflare demonstrated that a typical blog post drops from ~16,000 tokens (HTML) to ~3,200 tokens (markdown) — an 80% reduction. The LLM never needed that other 80%.
5. No existing tool shows publishers this progressive reduction or helps them understand what survives into the LLM's context window

**Current state of the art for publishers:** Manually disabling JavaScript in Chrome DevTools and squinting. Or using Google's Rich Results Test. That's it.

---

## The Product

A browser extension (Chrome/Firefox) and/or web app that takes any URL and shows the progressive reduction from raw HTML to what an LLM actually ingests, with token counts, content density scoring, and actionable diagnostics at every stage.

### Core Visualization: The Reduction Pipeline

For any given URL, show side-by-side (or stepped) views:

```
Stage 1: Raw HTML
├── Total tokens: ~16,000
├── Includes: nav, footer, scripts, CSS classes, ads, cookie banners
├── This is what a browser renders for humans
│
Stage 2: JS-Disabled HTML  
├── Total tokens: ~12,000
├── What you lose: dynamically loaded content, SPA-rendered text
├── HIGHLIGHT what's missing (red overlay or diff view)
├── This is what most LLM crawlers actually receive
│
Stage 3: Boilerplate Removed
├── Total tokens: ~6,000-8,000
├── Stripped: nav, footer, sidebar, ads, cookie consent, scripts
├── Method: content density heuristics (text-to-tag ratio, position)
├── This approximates what extraction pipelines produce
│
Stage 4: Markdown Conversion
├── Total tokens: ~3,000-4,000
├── Clean structured text with heading hierarchy preserved
├── Comparable to Cloudflare Markdown for Agents output
├── This is close to what enters a RAG pipeline
│
Stage 5: Chunked for RAG
├── Chunks at 512-token boundaries
├── Show chunk breaks with heading context preserved
├── Highlight which chunks contain your key claims/products/differentiators
├── This is the unit of retrieval — each chunk lives or dies independently
│
Stage 6: The Snippet (Google SERP representation)
├── Total tokens: ~40-50
├── Your meta description (or Google's rewrite)
├── THIS MIGHT BE YOUR ENTIRE REPRESENTATION in the LLM context
├── Front-loaded info check: are your key claims in the first 150 chars?
```

### Key Metrics Dashboard

For each URL analyzed:

- **Token count at each stage** (raw → JS-disabled → cleaned → markdown → chunked)
- **Content density score** — ratio of meaningful content tokens to total HTML tokens (higher = better for LLMs)
- **JS dependency score** — percentage of visible content that requires JavaScript to render (lower = better)
- **Front-loading score** — are key claims, product names, differentiators in the first 150 chars / first paragraph?
- **Extractability score** — are claims structured as clear declarative sentences vs. buried in complex prose?
- **Freshness signals** — is dateModified present in structured data? When was it last updated?
- **Chunk quality assessment** — do chunks at 512-token boundaries create semantically coherent units?
- **Static HTML coverage** — what percentage of the page's core value proposition is in the raw HTML vs. requiring JS?
- **Meta description quality** — token count, information density, front-loaded claims check
- **Structured data presence** — JSON-LD, microformats, FAQ schema detected

### Diagnostic Outputs

**"What the LLM Sees" view:**
Rendered markdown output — the actual text an LLM would work with. Not your beautiful website. Not your carefully designed layout. Just the text, in the order and structure it would be extracted.

**"What You're Losing" view:**
Diff overlay showing content that exists in the full rendered page but disappears at each extraction stage. Highlighted in red. This makes the invisible visible.

**"Your 50-Token Pitch" view:**
Just the meta description / Google snippet representation. Framed as: "This might be the ONLY thing the LLM reads about your page. Is it enough?"

**"Chunk Map" view:**
Visual representation of how the page would be chunked for a RAG pipeline. Each chunk color-coded by estimated relevance. Shows heading context that would be carried with each chunk.

**Competitor comparison:**
Enter your URL and a competitor URL. See side-by-side extraction. Who has better content density? Whose key claims survive the reduction better? Who front-loads more effectively?

---

## Technical Architecture

### Option A: Browser Extension (Chrome/Firefox)

```
┌─────────────────────────────────────────┐
│         Browser Extension UI            │
│  (popup panel or devtools tab)          │
├─────────────────────────────────────────┤
│                                         │
│  Content Script                         │
│  ├── Captures rendered DOM              │
│  ├── Captures raw HTML (pre-JS)         │
│  └── Extracts structured data/meta      │
│                                         │
│  Analysis Engine (runs client-side)     │
│  ├── HTML tokenizer (tiktoken-js or     │
│  │   similar for token counting)        │
│  ├── Boilerplate removal                │
│  │   (readability.js / custom)          │
│  ├── HTML-to-markdown conversion        │
│  │   (turndown.js)                      │
│  ├── Chunking simulator                 │
│  │   (fixed-size with heading context)  │
│  ├── Content density calculator         │
│  └── JS dependency detector             │
│      (compare source HTML vs rendered)  │
│                                         │
│  Visualization Layer                    │
│  ├── Side-by-side / stepped view        │
│  ├── Token counts per stage             │
│  ├── Diff overlays                      │
│  └── Metrics dashboard                  │
└─────────────────────────────────────────┘
```

**Advantages:** No server needed. Privacy-friendly (all processing local). Instant results on current page. Low barrier to adoption.

**Key libraries:**
- `@mozilla/readability` — content extraction (same algo as Firefox Reader View)
- `turndown` — HTML to markdown conversion
- `tiktoken` (js port) or `gpt-tokenizer` — accurate token counting for various models
- Custom boilerplate detection (nav/footer/sidebar heuristics)
- Diff visualization for "what you're losing" overlay

### Option B: Web App

```
┌──────────────┐     ┌──────────────────────────┐
│   Frontend   │────▶│   Backend (Python/Fast   │
│   (React)    │◀────│   API)                    │
│              │     │                            │
│  URL input   │     │  ├── requests/httpx        │
│  Results     │     │  │   (fetch raw HTML)      │
│  Viz/Charts  │     │  ├── Playwright/Puppeteer  │
│              │     │  │   (fetch rendered HTML)  │
│              │     │  ├── readability/trafilatura│
│              │     │  │   (content extraction)   │
│              │     │  ├── markdownify            │
│              │     │  │   (HTML→markdown)         │
│              │     │  ├── tiktoken               │
│              │     │  │   (token counting)       │
│              │     │  ├── chunking engine         │
│              │     │  └── scoring/analysis       │
│              │     │                            │
└──────────────┘     └──────────────────────────┘
```

**Advantages:** Can do real JS rendering via headless browser. Can compare rendered vs. unrendered. Can offer API for programmatic access. Can integrate with Crawl4AI.

**Disadvantages:** Requires hosting. Headless browser adds latency/cost. Privacy concerns (you're fetching their pages server-side).

### Recommended Approach: Start with Extension, Add Web App Later

The extension is the MVP. It runs on the page you're already looking at, needs no server, and provides instant value. The web app comes later for batch analysis, API access, and the competitor comparison feature (which needs to fetch external URLs).

---

## Existing Tools / Landscape

| Tool | What it does | What it doesn't do |
|------|-------------|-------------------|
| Cloudflare Markdown for Agents | Converts HTML→markdown at CDN edge | No visualization, no diagnostics, server-side only, requires CF |
| Crawl4AI | Open-source LLM-friendly crawler with markdown output | Developer tool, no publisher-facing UI, no diagnostic view |
| RESONEO Chrome Plugin | Captures ChatGPT fan-out queries and citations | Monitors output side (what ChatGPT cited), not input side (what it ingested) |
| Google Rich Results Test | Shows rendered HTML as Googlebot sees it | No token counting, no LLM-specific extraction, no markdown view |
| Screaming Frog | Crawls sites, can compare rendered vs. raw | SEO tool, no LLM-specific analysis, no token economics |
| Various token counters | Count tokens in pasted text | No URL analysis, no extraction pipeline, just raw counting |

**Gap:** Nobody shows the progressive reduction from HTML → what-the-LLM-sees with token counts and diagnostics at each stage. That's the product.

---

## Market / Users

### Primary Users

1. **SEO/GEO practitioners** — need to audit client sites for AI search readiness. Currently have no diagnostic tool for this. Would use daily.
2. **Content strategists at publishers** — need to understand how AI systems consume their content. Cloudflare's Markdown for Agents launch signals growing awareness.
3. **Marketing ops / technical marketers** — the profile that understands both content strategy and technical implementation. (This is your own profile.)
4. **DevRel / documentation teams** — need to ensure docs are LLM-accessible. Especially relevant as AI coding assistants consume documentation heavily.

### Secondary Users

5. **RAG pipeline developers** — want to preview how their extraction would work on a given page before building the pipeline.
6. **AI search startups** — building their own indexes, need to evaluate content quality/extractability at scale.

### Distribution Channels

- Chrome Web Store (free extension, freemium model)
- LinkedIn post announcing it alongside the fan-out article
- SEO community channels: Traffic Think Tank, Online Geniuses, Superpath
- Product Hunt launch
- Integrate with / complement GeoTrack (your existing project)

---

## Monetization Thoughts (Future)

- **Free tier:** Single URL analysis, basic metrics, extension functionality
- **Pro tier:** Batch analysis, competitor comparison, historical tracking, API access
- **Agency tier:** White-label reports, client dashboards, bulk URL scanning
- **Integration play:** Becomes a module within GeoTrack (AI visibility monitoring + content diagnostic in one platform)

---

## Relationship to Fan-Out Post

The LinkedIn post argues that fan-out optimization is repackaged long-tail SEO and that the real optimization is understanding tokenomics — how AI systems minimize what they ingest from your content.

This tool is the concrete embodiment of that argument. "Don't optimize for fan-out. Optimize for the 50 tokens the LLM actually reads. Here's a tool that shows you what those 50 tokens are."

The post gets attention. The tool converts that attention into something people use. The combination establishes credibility that goes beyond either piece alone.

---

## MVP Scope (What to Build First)

### Phase 1: Chrome Extension MVP
- Single-page analysis of current tab
- Raw HTML token count vs. extracted content token count vs. markdown token count
- Meta description isolation with token count ("your 50-token pitch")
- JS dependency check (what's missing without JS)
- Content density score
- Basic "what the LLM sees" markdown view
- Clean, minimal UI in extension popup or sidebar panel

### Phase 2: Enhanced Diagnostics  
- Chunk visualization at configurable token boundaries
- Front-loading analysis
- Structured data detection
- "What you're losing" diff overlay
- Exportable report (PDF or shareable link)

### Phase 3: Web App + Batch Analysis
- URL input for any page (server-side fetching + rendering)
- Competitor side-by-side comparison
- Batch URL scanning
- API endpoint for programmatic access
- Integration with GeoTrack dashboard

---

## Key Technical Decisions to Research

- **Token counting accuracy:** tiktoken (OpenAI's tokenizer) vs. Claude's tokenizer vs. generic approximation. Different models tokenize differently. Might need to show counts for multiple models or use a reasonable average.
- **Boilerplate removal approach:** Mozilla Readability (battle-tested, used in Firefox Reader View) vs. Trafilatura (Python, good for extraction) vs. custom heuristics. Need to test which most closely matches what LLM crawlers actually extract.
- **Markdown conversion fidelity:** How close can we get to Cloudflare's Markdown for Agents output? Their conversion happens at the edge with proprietary logic. Turndown.js is the standard open-source option.
- **Chunking simulation:** Fixed-size (512 tokens) is the standard starting point per Pinecone/Azure recommendations. Show heading context preservation. May want to simulate semantic chunking as a premium feature.
- **JS rendering for web app:** Playwright vs. Puppeteer. Playwright has better cross-browser support. Both work for the web app version. Extension doesn't need this (browser already rendered the page).

---

## Competitive Moat

The moat isn't the technology — the individual pieces (readability extraction, markdown conversion, token counting) are all open source. The moat is:

1. **The framing.** "What does the LLM see?" is a question nobody has packaged into a tool. The concept is the product.
2. **The progressive reduction visualization.** Showing the pipeline stages with token counts at each step. This is the insight that makes it click for non-technical users.
3. **The tokenomics framework.** Tying it back to the economic argument (inference costs drive everything) gives it intellectual depth that competitors would have to adopt your framing to replicate.
4. **Integration with GeoTrack.** Diagnostic (TokenLens) + monitoring (GeoTrack) = a complete AI visibility platform. Neither tool alone has the same value.

---

## References & Prior Art

- RESONEO reverse engineering of ChatGPT Search (https://think.resoneo.com/chatgpt/) — confirmed architecture, fan-out mechanics, provider ecosystem
- Cloudflare Markdown for Agents (Feb 2026) — validates the markdown-as-lingua-franca thesis, provides token reduction benchmarks
- Crawl4AI (https://github.com/unclecode/crawl4ai) — open-source LLM-friendly crawler, potential backend component
- Mozilla Readability (https://github.com/mozilla/readability) — content extraction library used in Firefox Reader View
- Turndown (https://github.com/mixmark-io/turndown) — HTML to markdown conversion
- tiktoken / gpt-tokenizer — token counting libraries
- Query decomposition in RAG literature (Haystack, LlamaIndex, NVIDIA RAG Blueprint) — establishes that "fan-out" is standard ML engineering, not novel
- Google I/O 2025 keynote (Elizabeth Reid) — origin of "query fan-out" terminology

---

## Notes

- This concept emerged from a conversation analyzing why "query fan-out optimization" is largely repackaged long-tail SEO. The tokenomics argument — that inference cost constraints determine how much of your content an LLM processes — led to the realization that nobody has built a tool showing publishers the actual token economics of their pages.
- The name "TokenLens" is a placeholder. Other options: TokenView, LLMLens, PageScope, IngestView, ContextView, etc.
- The fan-out LinkedIn post and this tool should be developed in parallel and launched together for maximum impact.
