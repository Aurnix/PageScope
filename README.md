# TokenLens

Your website talks to browsers — TokenLens shows you what it says to AI.

TokenLens is a Chrome extension that shows publishers what AI systems actually see when they read a webpage. It visualizes the 5-stage token reduction pipeline from raw HTML to AI-ready text, with diagnostic scores and actionable insights.

## The Problem

Publishers are told to "optimize for AI search" but have no way to see what AI systems actually ingest from their pages. A typical blog post drops from ~16,000 tokens (HTML) to ~3,200 tokens (markdown) — an 80% reduction that's invisible to the publisher. TokenLens makes that translation visible.

## What It Does

Analyzes the current page through a 5-stage reduction pipeline:

| Stage | What It Shows |
|-------|--------------|
| **Raw HTML** | Your full page as browsers see it — all the structure that makes your site work for humans |
| **Without JavaScript** | What AI crawlers actually receive (ChatGPT, Claude, Perplexity, Gemini don't run JS) |
| **Content Only** | After stripping layout and navigation — the same extraction AI systems perform |
| **AI-Ready Text** | Clean structured text with headings — what actually enters the AI's context window |
| **50-Token Pitch** | Your meta description — often the only thing that represents you in AI answers |

### Four Diagnostic Views

- **Token Funnel** — Bar chart showing token counts at each pipeline stage, with per-stage actionable hints
- **AI View** — The actual text an AI would process, plus your 50-token pitch
- **Scores** — Content density, JS independence, front-loading, and extractability ratings (A-F)
- **Issues** — Diagnostic findings like JS-rendered content, missing meta descriptions, stale dates

### First-Run Experience

A dismissible explainer panel introduces new users to what TokenLens does and why. An expandable "Which AI crawlers?" reference lists known AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) and their JavaScript execution behavior.

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
│   └── components/ # Header, FunnelTab, ScoresTab, IssuesTab, AIViewTab, Explainer, CrawlerInfo
└── shared/         # Types, stage metadata, stage hints, and grade constants
```
