# Satori Patterns

> 161 hand-reviewed background patterns for use with Satori,
> @vercel/og, and ImageResponse. Drop-in CSS styles for OG images,
> social cards, and hero sections.

[Live catalogue][catalogue] · [![npm](https://img.shields.io/npm/v/satori-patterns)](https://www.npmjs.com/package/satori-patterns) · [![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[catalogue]: https://satori-patterns.vercel.app

---

## What this is

A curated library of background patterns done by Babatunde Fatai translated from
[PatternCraft](https://github.com/megh-bari/pattern-craft) (MIT) into
Satori-compatible inline CSS objects. Each pattern is:

- Rendered and verified against Satori 0.19.x
- Screened for use as social media backgrounds
- Exported as named TypeScript constants

Satori requires inline styles (no Tailwind, no external CSS).
PatternCraft's patterns use Tailwind class wrappers and CSS variables
that Satori cannot process. This library translates the subset that
works into ready-to-paste `satoriStyle` objects.

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

## Live catalogue

Browse all approved patterns with side-by-side CSS and Satori previews:
[deployed Vercel URL — add when available]

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

This translation library is independently maintained and not affiliated
with the PatternCraft project.

---

## Contributing

To add new patterns or update compatibility:

```bash
# Run the full pipeline (requires Node 20+):
npm run pipeline:full

# Start the review tool:
npm run dev:browser   # port 3000 — pattern catalogue with thumbnails
npm run dev:review    # port 3001 — local approval tool

# After approvals, commit data/approved.json and push.
```

See [COMMANDS.md](COMMANDS.md) for the complete command reference.

---

## License

MIT
