# satori-patterns — Run Commands

## Prerequisites

- Node.js 20+
- npm

## Install Dependencies

```bash
npm install
cd apps/browser && npm install && cd ../..
```

## Full Pipeline (from scratch)

Runs all steps end-to-end: init manifest → translate → render → fallbacks → scoring → index build.

```bash
npm run pipeline:full
```

## Individual Pipeline Steps

Run steps individually if you need to re-run a specific stage:

```bash
# 1. Initialize compatibility.json from upstream patterns
npm run pipeline:init

# 2. Translate CSS patterns to Satori-compatible styles
npm run pipeline:translate

# 3. Render all CSS patterns (produces thumbnails + detects silent fails)
npm run pipeline:render

# 4. Add V1 SVG fallback pattern entries to manifest
npm run pipeline:add-fallbacks

# 5. Render SVG fallback components
npm run pipeline:render-fallbacks

# 6. Patch UNCLASSIFIED rendered patterns → SILENT_FAIL
npm run pipeline:patch-silent-fails

# 7. Score patterns for social background suitability
npm run pipeline:score-social

# 8. Generate human review queue (review-queue.txt)
npm run pipeline:review-queue

# 9. Build the package index (auto-generates src/index.ts)
npm run build:index
```

## Incremental Pipeline (after upstream changes)

```bash
npm run pipeline:diff-upstream          # generates diff-report.json
npm run pipeline:translate -- --only-changed
npm run pipeline:render -- --only-changed
npm run build:index
```

## Browser App (Local Dev)

```bash
npm run dev:browser
# → http://localhost:3000
```

Or directly:

```bash
cd apps/browser && npm run dev
```

## Package Build & Typecheck

```bash
# Type-check (no emit)
npm run typecheck

# Build dist/ for publishing
npm run build:package
```

## Tests

```bash
# CSS parser unit tests
npm run test:css-parser

# Manifest schema validation
npm run validate:manifest
```

## Skill File Update

After a render run, update learned patterns in the skill file:

```bash
npm run skill:update
```

## Deploy (Vercel)

The browser app at `apps/browser/` is a standard Next.js 15 app. Deploy via:

```bash
cd apps/browser && npx vercel
```

Or connect the repo to Vercel and set the root directory to `apps/browser`.

## Environment Variables (render tuning)

| Variable | Default | Description |
|---|---|---|
| `BATCH_SIZE` | 15 | Patterns per render batch |
| `BATCH_DELAY_MS` | 100 | Delay between batches (ms) |
| `RENDER_TIMEOUT_MS` | 10000 | Max render time per pattern (ms) |

## Project Structure

```
├── compatibility.json          # Single source of truth (manifest)
├── compatibility.schema.json   # JSON Schema for manifest
├── upstream.lock               # Tracks upstream commit
├── vendor/patterns.ts          # Snapshot of upstream patterns
├── scripts/                    # Pipeline scripts
├── packages/satori-patterns/   # NPM package (dist/)
│   └── src/
│       ├── index.ts            # Auto-generated exports
│       ├── types.ts            # SatoriPattern, SVGPatternProps
│       ├── patterns/           # Per-category pattern files
│       └── svg-fallbacks/      # Hand-written SVG components
├── apps/browser/               # Next.js 15 catalogue app
└── .babs-memo/                 # Agent memory & skill files
```
