# AGENT TASK: Build satori-patterns
> Version: 1.0.0 | Last Updated: 2026-02-21

---

## BEFORE STARTING ANYTHING

1. Read `skills/pattern-conversion.skill.md` IN FULL before taking any action.
   All conversion decisions, CSS compatibility verdicts, parsing rules, SVG
   fallback templates, and render pipeline rules are defined there.
   This document (AGENT_PROMPT.md) defines WHAT to build and in what order.
   The skill file defines HOW to make conversion decisions. Never re-derive
   conversion rules — always consult the skill file.

2. After every render run, execute:
     npx tsx scripts/update-skill.ts
   This appends empirical findings from the run to Section G of the skill file.
   The updated skill file must be committed alongside compatibility.json.

---

## CONTEXT

You are working inside a fork of megh-bari/pattern-craft that already exists
on disk. Do NOT re-fork. Do NOT clone the upstream repo.
Your working directory IS the project. Build the satori-patterns system
on top of it.

Goal: Produce two outputs:
  1. `packages/satori-patterns` — an NPM package of Satori-compatible patterns
  2. `apps/browser` — a visual testing browser and public pattern catalogue

These are published outputs. Code quality, TypeScript types, and documentation
must be production-grade.

---

## MONOREPO STRUCTURE TO CREATE

/
├── packages/
│   └── satori-patterns/
│       ├── src/
│       │   ├── patterns/            # One .ts file per category (auto-generated)
│       │   ├── svg-fallbacks/       # SVG components (hand-written per pattern)
│       │   ├── types.ts             # All exported types
│       │   └── index.ts             # Auto-generated from compatibility.json
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   └── browser/                     # Next.js 14+ (App Router)
│       ├── app/
│       │   ├── page.tsx             # Pattern grid (all patterns)
│       │   ├── pattern/[id]/        # Detail page (side-by-side comparison)
│       │   └── api/render/[id]/     # Live Satori render endpoint
│       └── public/thumbnails/       # Build-time rendered PNGs (gitignored)
│
├── scripts/
│   ├── assets/Inter.ttf             # Font required by Satori (download once)
│   ├── translate.ts                 # Main translator: patterns.ts → satoriStyle
│   ├── render-all.ts                # Batch PNG renderer (satori + resvg-js)
│   ├── classify.ts                  # Feature scanner (pre-render classification)
│   ├── diff-upstream.ts             # Upstream drift detector
│   ├── update-skill.ts              # Appends findings to skill file Section G
│   └── diff-report.json             # Output of diff-upstream.ts (gitignored)
│
├── vendor/
│   └── patterns.ts                  # Snapshot of upstream patterns.ts
│
├── skills/
│   └── pattern-conversion.skill.md  # THE SKILL FILE — always load before converting
│
├── compatibility.json               # Source of truth for all pattern statuses
├── upstream.lock                    # { commitSha, date, patternCount }
└── README.md

---

## TASK CHECKLIST

Complete in strict order. Do not skip ahead.
Consult skills/pattern-conversion.skill.md for all conversion decisions.

### PHASE 1 — SOURCE ANALYSIS

[ ] 1.1 Read src/data/patterns.ts and src/types/pattern.ts.
         Count exact number of patterns per category.
         Run: git rev-parse HEAD
         Write upstream.lock: { commitSha, date, patternCount }
         Copy src/data/patterns.ts → vendor/patterns.ts

[ ] 1.2 Download Inter.ttf (any weight) from Google Fonts.
         Save to scripts/assets/Inter.ttf.
         This is required for all Satori render calls — even text-free ones.

### PHASE 2 — TRANSLATION PIPELINE

[ ] 2.1 Implement the depth-0 comma splitter in scripts/utils/cssParser.ts.
         Unit test against minimum 5 multi-layer gradient strings including:
           - 3-layer backgroundImage with comma-heavy radial gradients
           - repeating-linear-gradient with calc() in size
           - 4+ layer pattern with backgroundPosition

[ ] 2.2 Implement featureScanner(styleObj) in scripts/classify.ts.
         Detects all features listed in Skill File Section A.
         Returns: { features: string[], preliminaryStatus: string, skipReason: string|null }
         Do NOT look at pattern.code — scan only style.* fields.

[ ] 2.3 Implement scripts/translate.ts.
         For each pattern in vendor/patterns.ts:
           a. Run featureScanner
           b. If SKIP: write to compatibility.json with status SKIP, skip translation
           c. If SVG_FALLBACK_REQUIRED: write status, skip CSS translation
              (SVG fallback written separately in Phase 4)
           d. Otherwise: extract satoriStyle using rules in Skill File Section B
              Output to packages/satori-patterns/src/patterns/[category].ts
         Respect --only-changed flag (reads scripts/diff-report.json if present)

[ ] 2.4 Implement scripts/render-all.ts.
         Batch-render all non-SKIP, non-SVG_FALLBACK patterns using Satori.
         Apply all render rules from Skill File Section D.
         Write thumbnails to apps/browser/public/thumbnails/[id].png.
         Detect FAIL and SILENT_FAIL (pixel whiteness check).
         Update compatibility.json with results and satoriVersion.
         After render completes, run: npx tsx scripts/update-skill.ts
         Respect --only-changed flag.

### PHASE 3 — NPM PACKAGE TYPES

[ ] 3.1 Write packages/satori-patterns/src/types.ts:

        export interface SatoriPatternStyle {
          backgroundColor?: string
          backgroundImage: string
          backgroundSize?: string
          backgroundPosition?: string
        }

        export interface SatoriPattern {
          id: string
          name: string
          category: 'gradients' | 'geometric' | 'decorative' | 'effects'
          renderMethod: 'css' | 'svg-fallback'
          style: SatoriPatternStyle
          Component?: (props: SVGPatternProps) => JSX.Element
        }

        export interface SVGPatternProps {
          width?: number
          height?: number
          foreground?: string
          background?: string
          [key: string]: unknown
        }

[ ] 3.2 Auto-generate packages/satori-patterns/src/index.ts from compatibility.json.
         Add this as an npm script: "build:index".
         Export rules: Skill File Section F, Rule F-1.
         Named exports: camelCase of pattern id (Rule B-4 in skill file).
         Also export: allPatterns[], gradientPatterns[], geometricPatterns[],
                      decorativePatterns[], effectsPatterns[]

### PHASE 4 — SVG FALLBACKS

[ ] 4.1 Write SVG fallback components for all patterns with
         status === "SVG_FALLBACK_REQUIRED".
         Use templates from Skill File Section C.
         V1 priority fallbacks (ship these first):
           - dot-grid (circle dots)
           - line-grid (square grid)
           - diagonal-crosshatch (±45° lines)
           - halftone-radial-dots (radially scaled dots)
           - noise-grain (feTurbulence)

[ ] 4.2 After writing each SVG fallback, render it via Satori and save
         the PNG to apps/browser/public/thumbnails/[id].png.
         Update compatibility.json: renderMethod: "svg-fallback", status: "PASS".

### PHASE 5 — VISUAL BROWSER

[ ] 5.1 Scaffold apps/browser as a Next.js 14+ App Router project.
         Install: @vercel/og, satori-patterns (local workspace reference).

[ ] 5.2 Build app/page.tsx — Pattern Grid:
         Source: compatibility.json (all patterns, all statuses)
         Each card shows:
           - Left half: CSS native preview (div with original style object)
           - Right half: Satori PNG thumbnail from /thumbnails/[id].png
           - Status badge (color-coded: green=PASS, yellow=PARTIAL,
             red=FAIL/SILENT_FAIL, grey=SKIP)
           - Category chip
           - "Copy satoriStyle" button
         Filters: by category, by status, by suitableForSocialBg
         Search by name

[ ] 5.3 Build app/pattern/[id]/page.tsx — Detail Page:
         Full 1200×630 side-by-side (CSS vs Satori PNG)
         satoriStyle JSON code block with copy button
         SVG component code (if renderMethod === 'svg-fallback')
         Compatibility notes from compatibility.json
         skipReason explanation if status === SKIP

[ ] 5.4 Build app/api/render/[id]/route.ts — Live Render Endpoint:
         Uses @vercel/og (ImageResponse) to render pattern live from
         the satori-patterns package. Returns PNG. Cache: max-age 86400.
         This validates that the NPM package actually works end-to-end.

[ ] 5.5 Deploy to Vercel. Confirm live render endpoint works on 10 patterns
         manually before proceeding.

### PHASE 6 — REVIEW PREP & MANIFEST

[ ] 6.1 Generate scripts/review-queue.txt: list of all pattern IDs where
         suitableForSocialBg === null (needs human judgment).

[ ] 6.2 Run the social-bg suitability scorer on all PASS/PARTIAL patterns.
         Pre-flag suitableForSocialBg based on luminance variance:
           score > 65 → true, score < 35 → false, else → null (human review)
         Update compatibility.json.

[ ] 6.3 HUMAN REVIEW STEP (cannot be automated):
         Open deployed visual browser.
         For each pattern in review-queue.txt:
           - Compare left (CSS) vs right (Satori PNG)
           - Update suitableForSocialBg in compatibility.json
           - If Satori PNG looks wrong despite PASS status: downgrade to PARTIAL
         When done: rebuild index.ts from updated compatibility.json.

### PHASE 7 — PUBLISH

[ ] 7.1 Check NPM name availability: satori-patterns
         If taken, check: satori-pattern-catalogue, og-patterns, patterncraft-satori
         Set chosen name in packages/satori-patterns/package.json

[ ] 7.2 packages/satori-patterns/package.json:
         {
           "name": "satori-patterns",
           "version": "1.0.0",
           "license": "MIT",
           "main": "dist/index.js",
           "types": "dist/index.d.ts",
           "peerDependencies": { "satori": ">=0.10.0" },
           "keywords": ["satori", "og-image", "patterns", "background",
                        "open-graph", "next.js", "vercel"]
         }

[ ] 7.3 Build and publish:
           npm run build
           npm publish --access public

[ ] 7.4 Write README.md at repo root. Must cover:
         - What Satori is and why CSS translation was needed
         - Installation and usage (named import + array import + SVG fallback)
         - What PatternCraft is and attribution to megh-bari (MIT credit)
         - Link to visual browser (Vercel URL)
         - How to contribute new patterns (run render-all, check browser,
           update compatibility.json, open PR)
         - Satori version compatibility matrix (from skill file Section A)

### PHASE 8 — UPSTREAM SYNC AUTOMATION

[ ] 8.1 Create .github/workflows/sync-upstream.yml:
         Schedule: every Monday 6 AM UTC + workflow_dispatch
         Steps:
           a. Fetch upstream patterns.ts from raw GitHub URL
           b. Diff against vendor/patterns.ts
           c. If changed: run translate.ts --only-changed, render-all.ts
              --only-changed, update-skill.ts
           d. Open a PR with diff-report.json as PR body
           e. Commit updated vendor/patterns.ts + upstream.lock

[ ] 8.2 Test the workflow manually via workflow_dispatch before shipping.

---

## DO NOT ATTEMPT (hard blockers — Satori incompatible)

- Framer Motion / CSS animation / @keyframes patterns
- Canvas-based patterns
- Patterns using backdrop-filter
- Patterns using before:/after: Tailwind pseudo-class modifiers
- Patterns using conic-gradient()
- Patterns using background-blend-mode
- shadcn.io/backgrounds animated backgrounds

These are pre-filtered by featureScanner (Phase 2.2). They appear in the
visual browser as "Not Satori Compatible" with the skipReason shown.

---

## V1 PRIORITY PATTERNS (ship these working — others are best-effort)

| Category   | Pattern                  | Expected Method  |
|------------|--------------------------|------------------|
| gradients  | Subtle mesh gradient     | css              |
| gradients  | Radial gradient glow     | css              |
| geometric  | Dot grid                 | svg-fallback     |
| geometric  | Line grid (square)       | svg-fallback     |
| geometric  | Diagonal crosshatch      | svg-fallback     |
| effects    | Noise grain (SVG-based)  | svg-fallback     |
| decorative | Halftone radial dots     | svg-fallback     |

---

## SKILL FILE UPDATE PROTOCOL

scripts/update-skill.ts must be run after EVERY render batch.
It reads compatibility.json, looks for FAIL and SILENT_FAIL entries,
cross-references against Section A rules, and appends a LEARNED_PATTERNS
entry to Section G of skills/pattern-conversion.skill.md if a NEW
failure pattern is discovered (one not already documented).

Entry format:
  {
    "date": "<ISO date>",
    "runId": "<git commit of run>",
    "finding": "<what failed and why>",
    "action": "<rule to apply going forward for this pattern type>",
    "affectedPatternIds": ["id1", "id2"],
    "overridesRule": "<Section+Rule ID or null>"
  }

Commit both compatibility.json and the updated skill file together
in the same git commit with message:
  "chore: render run — update compatibility + skill [run-YYYYMMDD]"
