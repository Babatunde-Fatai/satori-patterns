# Curated Font Pairings

Each pairing includes a display font (headlines), a body font (paragraphs, UI labels), and an optional accent font (quotes, callouts, editorial moments). All fonts are available via Google Fonts or direct download unless marked (self-host).

**Rules:**
- Display font: must be distinctive, characterful, memorable at large sizes
- Body font: must be highly legible at 14-18px, neutral enough to not compete with display
- Accent font: optional, used sparingly for pullquotes, section intros, and emotional moments
- Never use Inter, Roboto, Arial, or system-ui as a display font

---

## Editorial / Bold Pairings

### P01. The Manifesto
**Personality:** Authoritative, provocative, editorial. Like a magazine that means business.
**Best for:** Personal brands, innovation leaders, thought leadership platforms.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Satoshi | Black (900) | Self-host via fontsource |
| Body | Manrope | Regular (400), Medium (500) | Google Fonts |
| Accent | TT Norms Pro | Light Italic | Self-host |

**Usage:** Display at 72-96px, tight tracking (-0.03em). Body at 16-18px, line-height 1.6. Accent at 20-24px italic for pullquotes only.

---

### P02. The Architect
**Personality:** Structured precision, geometric confidence. Like a great building.
**Best for:** Design studios, tech products, engineering brands.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Space Grotesk | Bold (700) | Google Fonts |
| Body | DM Sans | Regular (400) | Google Fonts |
| Accent | — | — | No accent needed |

**Usage:** Display at 64-80px, normal tracking. Body at 16px, line-height 1.5. The geometry of both fonts creates natural harmony.

---

### P03. The Journalist
**Personality:** Sharp, credible, serious. Like a premier newspaper's digital edition.
**Best for:** Publications, writers, journalists, analysts.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Playfair Display | Bold (700), Black (900) | Google Fonts |
| Body | Source Serif 4 | Regular (400) | Google Fonts |
| Accent | Playfair Display | Italic (400) | Same as display |

**Usage:** Display at 56-80px. Body at 17-19px, line-height 1.75 (editorial reading). Accent italic for pullquotes and bylines.

---

## Minimal / Refined Pairings

### P04. The Strategist
**Personality:** Clean, confident, premium restraint. Like a McKinsey deck made beautiful.
**Best for:** Consultants, strategists, executive personal brands, B2B.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Neue Haas Grotesk | Bold (700) | Self-host or substitute: Helvetica Now |
| Body | Lato | Regular (400) | Google Fonts |
| Accent | Cormorant Garamond | Italic (400) | Google Fonts |

**Usage:** Display at 64-72px, tight tracking. Body at 16px. Accent italic for quotes and intros creates a luxury tension against the clean grotesque.

---

### P05. The Modernist
**Personality:** European minimal, gallery-quality white space, precise.
**Best for:** Art directors, architects, luxury brands, cultural institutions.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Bebas Neue | Regular (400) | Google Fonts — all caps only |
| Body | Nunito Sans | Light (300), Regular (400) | Google Fonts |
| Accent | Cormorant | Light Italic | Google Fonts |

**Usage:** Display ALL CAPS at 96-120px, very wide tracking (0.15em). Body at 16px light weight. The contrast between ultra-wide display and delicate body is the statement.

---

## Warm / Human Pairings

### P06. The Builder
**Personality:** Approachable expertise, honest craft, trustworthy warmth.
**Best for:** Makers, indie founders, community builders, educators.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Cabinet Grotesk | ExtraBold (800) | Self-host via fontsource |
| Body | General Sans | Regular (400), Medium (500) | Self-host via fontsource |
| Accent | — | — | No accent needed |

**Usage:** Display at 56-72px. Body at 16-18px. Both fonts have slight humanist warmth that feels designed but accessible.

---

### P07. The Storyteller
**Personality:** Narrative-forward, warm authority, human connection.
**Best for:** Authors, coaches, community leaders, mission-driven brands.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Fraunces | Black (900) | Google Fonts — optical size variable |
| Body | Lora | Regular (400) | Google Fonts |
| Accent | Fraunces | Italic (400) | Same as display |

**Usage:** Display at 64-80px. Body at 17px, line-height 1.7. The serif across all three roles creates cohesion; the contrast comes from weight variation.

---

## Technical / Product Pairings

### P08. The Engineer
**Personality:** Code-adjacent, monospaced confidence, builder credibility.
**Best for:** Developer tools, technical blogs, SaaS products, open source.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | JetBrains Mono | ExtraBold (800) | Google Fonts |
| Body | IBM Plex Sans | Regular (400) | Google Fonts |
| Accent | IBM Plex Mono | Light (300) | Google Fonts — for code snippets and callouts |

**Usage:** Display at 56-72px. Body at 15-16px. Monospaced display is unexpected and memorable for a tech audience.

---

### P09. The Product
**Personality:** Clean system design, functional beauty, Apple-adjacent precision.
**Best for:** SaaS products, productivity tools, mobile apps, dashboards.

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display | Geist | Bold (700) | Self-host — Vercel's font |
| Body | Geist | Regular (400) | Same family |
| Accent | — | — | Single family creates system coherence |

**Usage:** Display at 48-64px. Body at 14-16px. Using one family with intentional weight contrast creates a design system feel.

---

## Pairing Combination Rules

When mixing elements from two pairings:
1. Never mix two serif display fonts
2. Never mix two grotesque display fonts unless weights are extremely different
3. The body font should always be the most neutral of the pair
4. If combining, always test at actual sizes (72px headline, 16px body) before deciding

**Self-hosted fonts:** For Satoshi, Cabinet Grotesk, General Sans, and other Fontshare/Fontsource fonts, use Next.js `localFont` from `next/font/local`. Store font files in `/public/fonts/`.

**Google Fonts:** Use Next.js `next/font/google` for zero-layout-shift loading.