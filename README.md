# TokenLens

"View Source" for the AI era — see exactly what LLMs actually read when they consume your webpage.

TokenLens is a Chrome extension that shows publishers the progressive token reduction from raw HTML to what an AI system actually ingests, with token counts at every stage and actionable diagnostics.

## The Problem

Publishers are told to "optimize for AI search" but have no way to see what LLMs actually ingest from their pages. A typical blog post drops from ~16,000 tokens (HTML) to ~3,200 tokens (markdown) — an 80% reduction. TokenLens makes that invisible process visible.

## What It Does

Analyzes the current page through a 5-stage reduction pipeline:

| Stage | What It Shows |
|-------|--------------|
| **Raw HTML** | Everything the browser downloads — nav, scripts, CSS, ads, the works |
| **Without JavaScript** | What AI crawlers actually receive (ChatGPT, Claude, Gemini skip JS) |
| **Content Only** | After stripping navigation, sidebars, footers, and boilerplate |
| **AI-Ready Text** | Clean markdown with heading hierarchy — what enters the AI's context |
| **50-Token Pitch** | Your meta description — often the ONLY thing the AI reads |

### Four Diagnostic Views

- **Token Funnel** — Bar chart showing token counts at each pipeline stage
- **AI View** — The actual markdown text an LLM would process, plus your 50-token pitch
- **Scores** — Content density, JS independence, front-loading, and extractability ratings (A-F)
- **Issues** — Diagnostic warnings like JS-rendered content, missing meta descriptions, stale dates

## Quick Start (pre-built)

No build step required — a pre-built version is included in the repo.

1. Clone or download this repository
2. Open `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the **`extension/`** folder
6. Navigate to any webpage and click the TokenLens icon

## Development

### Prerequisites

- Node.js 18+
- Chrome browser

### Install & Build

```bash
npm install
npm run build
```

Then load the `dist/` folder as an unpacked extension (same steps as above, but use `dist/` instead of `extension/`).

### Development

```bash
npm run dev
```

Load the `dist/` folder as an unpacked extension. Vite provides hot module reload for the popup UI.

### Tests

```bash
npm test
```

## Tech Stack

- **Chrome Extension** — Manifest V3, popup UI
- **React** — Popup interface
- **Vite + @crxjs/vite-plugin** — Build toolchain with HMR
- **@mozilla/readability** — Content extraction (Firefox Reader View algorithm)
- **Turndown** — HTML to markdown conversion
- **gpt-tokenizer** — Token counting (pure JS, no WASM)
- **Vitest** — Testing

## Architecture

```
Popup (React)
  ├── sends ANALYZE_PAGE message to Content Script
  │     └── returns rendered DOM + meta + JSON-LD
  ├── sends FETCH_RAW_HTML message to Service Worker
  │     └── returns raw server HTML (no JS)
  └── runs analysis pipeline locally
        ├── tokenizer (gpt-tokenizer)
        ├── readability (@mozilla/readability)
        ├── markdown (turndown)
        ├── scoring (content density, JS independence, front-loading, extractability)
        └── issue detection (7 diagnostic rules)
```

All processing runs client-side. No data leaves the browser.

## Project Structure

```
src/
├── analysis/       # Pure analysis engine (tokenizer, readability, markdown, scoring, issues)
├── background/     # MV3 service worker (fetches raw HTML)
├── content/        # Content script (captures rendered DOM)
├── popup/          # React popup UI (components, hooks, styles)
└── shared/         # Types and constants
```

## License

MIT
