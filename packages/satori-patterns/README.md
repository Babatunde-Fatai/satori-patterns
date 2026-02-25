# satori-patterns

Background patterns for [Satori](https://github.com/vercel/satori)
and [@vercel/og](https://vercel.com/docs/functions/og-image-generation).

By [Babatunde Fatai](https://babatunde.ng) — hand-reviewed CSS background styles that work
reliably in Satori's constrained rendering environment. Translated from
[PatternCraft](https://github.com/megh-bari/pattern-craft) (MIT).

## Install

```bash
npm install satori-patterns
```

## Quick start

```ts
import { lavenderCosmicGlow } from 'satori-patterns'
import { ImageResponse } from '@vercel/og'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        ...lavenderCosmicGlow.style,
      }}
    >
      <h1 style={{ color: 'white', fontSize: 64, margin: 'auto' }}>
        Your title here
      </h1>
    </div>,
    { width: 1200, height: 630 }
  )
}
```

## Available exports

```ts
import {
  allPatterns,           // all approved patterns as array
  gradientPatterns,      // filtered by category
  geometricPatterns,
  decorativePatterns,
  effectsPatterns,
  lavenderCosmicGlow,    // named pattern (camelCase of id)
  mysticPurpleOrb,
  // ... all approved patterns
} from 'satori-patterns'
```

## What patterns are included

161 approved patterns across four categories:

- **gradients** — radial and linear gradient backgrounds (glows, orbs, fades, mesh)
- **geometric** — grid lines, dot arrays, circuit boards, diagonal crosshatches
- **decorative** — soft glows, tinted fades, layered radials
- **effects** — noise overlays, neon lines, blurred focal points

Patterns are selected through a render pipeline: each pattern is translated from
PatternCraft's Tailwind-based source into explicit inline CSS, rendered through Satori,
and approved by human review. Only patterns that render correctly and look good as
social media backgrounds make it into the package.

## Compatible with

- [@vercel/og](https://vercel.com/docs/functions/og-image-generation) — Next.js `ImageResponse`
- [satori](https://github.com/vercel/satori) — directly via JSX
- Next.js `app/opengraph-image.tsx` routes

## Why this exists

Satori does not support Tailwind classes, CSS variables, or many
modern CSS features. PatternCraft patterns require these. This library
provides the translated subset (`radial-gradient`, `linear-gradient`,
`repeating-linear-gradient`) that passes Satori's render pipeline,
tested against Satori 0.19.x.

## Browse patterns

[Live catalogue](https://satori.babatunde.ng) — side-by-side CSS and Satori render previews,
with one-click copy of import statements and style objects.

[![npm version](https://img.shields.io/npm/v/satori-patterns)](https://npmjs.com/package/satori-patterns)

## License

MIT — includes patterns from
[Babatunde-Fatai/satori-patterns](https://github.com/Babatunde-Fatai/satori-patterns)
(MIT, copyright Babatunde Fatai)

MIT — includes original patterns from
[megh-bari/pattern-craft](https://github.com/megh-bari/pattern-craft)
(MIT, copyright Megh Bari)
