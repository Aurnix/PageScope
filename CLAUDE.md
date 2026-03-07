# CLAUDE.md

## Project Overview

TokenLens is a Chrome extension (Manifest V3) that shows publishers what AI systems actually see when they read a webpage. Your website talks to browsers — TokenLens shows you what it says to AI. It visualizes a 5-stage token reduction pipeline with diagnostic scores and actionable issues, framed as a diagnostic tool (not a criticism of site design).

## Commands

- `npm run dev` — Start Vite dev server (load `dist/` as unpacked extension)
- `npm run build` — Production build (runs `tsc && vite build`, output in `dist/`)
- `npm test` — Run all tests (`vitest run`)
- `npm run test:watch` — Run tests in watch mode

## Architecture

**Extension structure:**
- `src/content/content-script.ts` — Injected into pages, captures rendered DOM + meta + JSON-LD on `ANALYZE_PAGE` message
- `src/background/service-worker.ts` — Re-fetches page URL via `fetch()` to get raw HTML (what LLM crawlers see without JS) on `FETCH_RAW_HTML` message
- `src/popup/` — React popup UI, entry point is `index.html` → `main.tsx` → `App.tsx`
- `src/analysis/` — Pure analysis engine with no browser API dependencies (testable in Node)
- `src/shared/` — Type definitions and constants shared across all contexts

**Analysis pipeline** (`src/analysis/pipeline.ts`):
1. Raw HTML → count tokens on rendered DOM
2. Without JS → count tokens on fetched HTML (service worker)
3. Content Only → `@mozilla/readability` strips boilerplate
4. Markdown → `turndown` converts to clean text
5. 50-Token Pitch → extract meta description or fallback

**Scoring** (`src/analysis/scores.ts`): Content density, JS independence, front-loading, extractability — each 0-100 with letter grades (A/B/C/D/F).

**Issue detection** (`src/analysis/issues.ts`): 7 rule-based diagnostics sorted by severity (critical/warning/info).

## Key Technical Decisions

- `gpt-tokenizer` (pure JS) over `tiktoken` (WASM) to avoid MV3 Content Security Policy issues
- Analysis runs in popup context (has DOMParser needed by Readability), not in service worker
- Content script is minimal — only captures data, never runs analysis
- Inline styles in React components to match the design mockup exactly (`docs/TokenLens_UX_Mockup.jsx`)

## Testing

Tests use Vitest. Pipeline tests require jsdom environment (annotated with `@vitest-environment jsdom`). Analysis modules are pure functions tested directly. Test fixtures in `tests/fixtures/`.

## Style Guide

- TypeScript strict mode
- React functional components with hooks
- Inline styles (matching mockup design, dark theme `#0f1219`)
- Fonts: DM Sans (UI text), JetBrains Mono (numbers/code)
