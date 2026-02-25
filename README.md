# Satori Patterns

> 161 hand-reviewed background patterns for use with Satori,
> @vercel/og, and ImageResponse. Drop-in CSS styles for OG images,
> social cards, and hero sections.
>
> Built by [Babatunde Fatai](https://babatunde.ng).

[Live catalogue](https://satori.babatunde.ng) · [![npm](https://img.shields.io/npm/v/satori-patterns)](https://www.npmjs.com/package/satori-patterns) · [![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## What this is

A curated library of background patterns built by [Babatunde Fatai](https://babatunde.ng), translated from
[PatternCraft](https://github.com/megh-bari/pattern-craft) (MIT) into
Satori-compatible inline CSS objects. Each pattern is rendered and verified against Satori 0.19.x,
screened for use as social media backgrounds, and exported as named TypeScript constants.

Satori requires inline styles — no Tailwind, no external CSS. PatternCraft's patterns use
Tailwind class wrappers and CSS variables that Satori cannot process. This library translates
the working subset into ready-to-paste `satoriStyle` objects.

---

## Monorepo structure

```
apps/browser/       — Public pattern catalogue, deployed to Vercel (satori.babatunde.ng)
apps/review/        — Local-only approval tool (port 3001). NOT deployed. Requires the full
                      monorepo cloned locally to function (reads filesystem for thumbnails).
packages/satori-patterns/ — The NPM package published to npmjs.com/package/satori-patterns
scripts/            — Conversion and render pipeline (translate, render, score, build-index)
data/               — Version-controlled approval state (approved.json, rejected.json)
```

> **Note:** `apps/review` is intentionally local-only. It cannot be deployed to Vercel or any
> serverless environment — it requires direct filesystem access to the monorepo's thumbnails and
> data files. Always run it with `npm run dev:review` on your local machine.

---

## Quick start (contributors)

```bash
# Install all dependencies (from repo root)
npm install

# Run the public catalogue (port 3000)
npm run dev:browser

# Run the local review/approval tool (port 3001)
npm run dev:review
```

### Adding new patterns

1. Run the conversion pipeline to translate and render new patterns:
   ```bash
   npm run pipeline:full
   ```
2. Open the review tool at `http://localhost:3001` to approve or reject patterns.
3. Approvals are written to `data/approved.json`.
4. Commit `data/approved.json` — Vercel redeploys the catalogue automatically.
5. To publish the NPM package with new patterns:
   ```bash
   npm run build:index && npm run build:package && npm publish
   ```

See [COMMANDS.md](COMMANDS.md) for the complete command reference.

---

## Installation

```bash
npm install satori-patterns
```

---

## Usage

### Named import (recommended)

```ts
import { lavenderCosmicGlow } from 'satori-patterns'

// In @vercel/og or satori JSX:
<div style={{ width: '100%', height: '100%', ...lavenderCosmicGlow.style }} />
```

### Browse all patterns

```ts
import { allPatterns } from 'satori-patterns'

// allPatterns is an array of SatoriPattern objects
```

### Filter by category

```ts
import { gradientPatterns, geometricPatterns } from 'satori-patterns'
```

---

## Pattern type

```ts
interface SatoriPattern {
  id: string
  name: string
  category: 'gradients' | 'geometric' | 'decorative' | 'effects'
  renderMethod: 'css' | 'svg-fallback'
  style: {
    backgroundColor?: string
    backgroundImage: string
    backgroundSize?: string
    backgroundPosition?: string
  }
  Component?: (props: SVGPatternProps) => JSX.Element // svg-fallback only
}
```

---

## Compatibility

| Satori version | Tested |
|---|---|
| 0.19.x | ✓ |

The patterns in this library use only CSS features supported by Satori:
`linear-gradient`, `repeating-linear-gradient`, and `radial-gradient`
in forms that pass render testing. Patterns requiring `conic-gradient`,
`backdrop-filter`, `animation`, or `CSS variables` are excluded.

---

## Attribution

Pattern data translated from
[megh-bari/pattern-craft](https://github.com/megh-bari/pattern-craft)
(MIT License). Original patterns by Megh Bari.

This translation library was created by and is independently maintained by [Babatunde Fatai](https://babatunde.ng)
and is not affiliated with the PatternCraft project.

---

## License

MIT
