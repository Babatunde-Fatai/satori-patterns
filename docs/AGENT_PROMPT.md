# AGENT TASK: Build satori-patterns
> Version: 1.1.0 | Last Updated: 2026-02-21

---

## ROLE AND OPERATING MODE

You are a senior TypeScript engineer working inside an existing monorepo fork of `megh-bari/pattern-craft` that is already on disk.

Your job is to build and validate a production-grade `satori-patterns` pipeline and browser catalogue, using the skill file as the conversion authority.

This is a strict execution task, not an exploration task.

---

## BEFORE STARTING ANYTHING (MANDATORY)

1. Read `.babs-memo/skills/pattern-conversion/SKILL.md` IN FULL before taking any action.
   - This file defines all conversion decisions, parsing rules, SVG fallback rules, render pipeline behavior, manifest rules, and learned overrides.
   - This task file defines WHAT to build and in what order.
   - Never re-derive conversion rules from memory.
   - If the skill file does not cover a case, mark it `UNCLASSIFIED`, log it, and continue safely without inventing unsupported behavior.

2. Confirm the current working directory is the existing fork.
   - Do NOT clone upstream.
   - Do NOT re-fork.
   - Do NOT replace the repo contents.
   - Build on top of the current project.

3. Before editing files for any checklist item, output:
   - Checklist item ID
   - Plan (3 to 7 bullets)
   - Files to create/modify
   - Commands to run
   - Risks or blockers

4. After every render batch, execute:
   - `npx tsx scripts/update-skill.ts`
   - This appends empirical findings to Section G of the skill file
   - Commit the updated skill file together with `compatibility.json`

---

## EXECUTION PROTOCOL (MANDATORY)

### Progress Tracking
Create and maintain `scripts/progress.json` with one record per checklist item:
- `id`
- `status` (`todo` | `in_progress` | `done` | `blocked`)
- `filesTouched`
- `commandsRun`
- `artifactOutputs`
- `notes`
- `updatedAt`

Update this file after each checklist item.

### Completion Rules (No Fake Completion)
Do NOT mark any checklist item as complete unless all are true:
- Implementation is complete
- Required commands ran successfully
- Required artifacts exist (if applicable)
- Generated files were updated (if applicable)
- No new TypeScript or build errors were introduced

If blocked:
- Mark `blocked`
- Record exact blocker
- Record what is already complete
- Stop claiming downstream items are done

### Idempotency Rules
All generator and pipeline scripts must be deterministic:
- Re-running without source changes should produce no unexpected diffs
- `translate.ts --only-changed` must only touch changed patterns
- `render-all.ts --only-changed` must only render changed patterns
- `update-skill.ts` must dedupe learned findings and avoid duplicate Section G entries
- Scripts must exit with non-zero code on failure

---

## ENVIRONMENT ASSUMPTIONS (LOCK THESE)

- Runtime: Node.js >= 20
- Language: TypeScript
- Package manager: npm (unless root workspace already uses pnpm, then use existing manager consistently)
- Monorepo: use existing workspace configuration if present, do not replace it
- Testing framework for new tests: use the existing repo standard, if none exists use Vitest

If the actual repo paths differ from this prompt:
- Resolve equivalent paths
- Log the resolved paths in `scripts/progress.json`
- Continue using the actual paths consistently

---

## GOAL

Produce two published outputs:

1. `packages/satori-patterns`
   - NPM package of Satori-compatible patterns
   - Typed exports
   - CSS translations + SVG fallbacks
   - Auto-generated index from `compatibility.json`

2. `apps/browser`
   - Next.js App Router visual catalogue
   - Side-by-side CSS vs Satori previews
   - Detail pages
   - Live render API endpoint using `@vercel/og`

Code quality, TypeScript types, scripts, and docs must be production-grade.

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
│       │   ├── pattern/[id]/page.tsx
│       │   └── api/render/[id]/route.ts
│       └── public/thumbnails/       # Build-time rendered PNGs (gitignored)
│
├── scripts/
│   ├── assets/Inter.ttf             # Font required by Satori
│   ├── utils/cssParser.ts           # Depth-0 comma splitter
│   ├── translate.ts                 # Main translator
│   ├── render-all.ts                # Batch renderer (satori + resvg-js)
│   ├── classify.ts                  # Feature scanner
│   ├── diff-upstream.ts             # Upstream drift detector
│   ├── update-skill.ts              # Appends findings to skill file Section G
│   ├── diff-report.json             # Output of diff-upstream.ts (gitignored)
│   ├── review-queue.txt             # Human review queue (generated)
│   └── progress.json                # Execution progress (generated)
│
├── vendor/
│   └── patterns.ts                  # Snapshot of upstream patterns.ts
│
├── skills/
│   └── pattern-conversion.skill.md  # Conversion authority
│
├── compatibility.json               # Source of truth manifest
├── compatibility.schema.json        # Manifest schema (create this)
├── upstream.lock                    # { commitSha, date, patternCount, upstreamUrl }
└── README.md

---

## COMPATIBILITY MANIFEST CONTRACT (MANDATORY)

Create `compatibility.schema.json` and validate `compatibility.json` against it.

Manifest shape must be explicit and stable. Use this top-level shape:

{
  "meta": {
    "upstreamCommitSha": "string",
    "generatedAt": "ISO date string",
    "satoriVersion": "string"
  },
  "patterns": [
    {
      "id": "string",
      "name": "string",
      "category": "gradients|geometric|decorative|effects",
      "status": "PASS|PARTIAL|FAIL|SILENT_FAIL|SVG_FALLBACK_REQUIRED|SKIP|DEPRECATED",
      "skipReason": "string|null",
      "renderMethod": "css|svg-fallback|none",
      "features": ["string"],
      "preliminaryStatus": "string|null",
      "satoriStyle": "object|null",
      "suitableForSocialBg": "boolean|null",
      "notes": "string"
    }
  ]
}

Rules:
- `compatibility.json` is the source of truth for package exports and browser display
- All scripts that modify it must preserve ordering and formatting consistency
- Stable sort order: category, then name (or original upstream order, pick one and use it everywhere)

---

## TASK CHECKLIST (STRICT ORDER)

Complete in strict order. Do not skip ahead.
All conversion decisions must come from `skills/pattern-conversion.skill.md`.

### PHASE 1: SOURCE ANALYSIS

[ ] 1.1 Read `src/data/patterns.ts` and `src/types/pattern.ts` (or resolved equivalents).
        - Count exact number of patterns per category
        - Run `git rev-parse HEAD`
        - Write `upstream.lock` with:
          `{ commitSha, date, patternCount, upstreamUrl }`
        - Copy `src/data/patterns.ts` → `vendor/patterns.ts`
        - Initialize `compatibility.json` with all patterns as baseline records

Acceptance:
- `vendor/patterns.ts` exists
- `upstream.lock` exists with valid values
- `compatibility.json` exists and validates against schema

[ ] 1.2 Download Inter font for Satori.
        - Source: Google Fonts
        - Save as `scripts/assets/Inter.ttf`
        - Verify file exists and can be loaded by Node fs

Acceptance:
- `scripts/assets/Inter.ttf` exists
- Font loading test passes

---

### PHASE 2: TRANSLATION PIPELINE

[ ] 2.1 Implement depth-0 comma splitter in `scripts/utils/cssParser.ts`
        - Add unit tests (minimum 5 cases) including:
          - 3-layer backgroundImage with comma-heavy radial gradients
          - repeating-linear-gradient with calc() in size
          - 4+ layer pattern with backgroundPosition
          - nested functions with spaces
          - malformed input guard behavior

Acceptance:
- Tests pass
- Splitter handles depth-0 correctly

[ ] 2.2 Implement `featureScanner(styleObj)` in `scripts/classify.ts`
        - Detect all features listed in Skill File Section A
        - Return:
          `{ features: string[], preliminaryStatus: string, skipReason: string | null }`
        - Scan `pattern.style.*` only
        - Never inspect `pattern.code`

Acceptance:
- Scanner returns deterministic results
- Feature names align with Section A categories

[ ] 2.3 Implement `scripts/translate.ts`
        For each pattern in `vendor/patterns.ts`:
          a. Run `featureScanner`
          b. If SKIP, write manifest entry with status `SKIP`
          c. If `SVG_FALLBACK_REQUIRED`, write status and skip CSS translation
          d. Otherwise translate to `satoriStyle` using Section B rules
          e. Write category outputs to `packages/satori-patterns/src/patterns/[category].ts`
        Must support `--only-changed` using `scripts/diff-report.json`

Acceptance:
- Category files are generated
- Manifest entries updated with features/status/satoriStyle
- Re-run without changes gives no unexpected diff

[ ] 2.4 Implement `scripts/render-all.ts`
        - Batch-render all non-SKIP, non-SVG_FALLBACK patterns using Satori
        - Apply Skill Section D render rules
        - Convert SVG to PNG using `@resvg/resvg-js`
        - Write thumbnails to `apps/browser/public/thumbnails/[id].png`
        - Detect `FAIL` and `SILENT_FAIL`
        - Update `compatibility.json` with render results and Satori version
        - Run `npx tsx scripts/update-skill.ts` after render batch
        - Support `--only-changed`

Performance and safety:
- Respect batching rules
- Do not crash entire run if one pattern fails
- Record per-pattern error messages in notes

Acceptance:
- Thumbnails generated for attempted patterns
- PASS/PARTIAL/FAIL/SILENT_FAIL reflected in manifest
- Skill file Section G updated (deduped)
- Render summary printed: counts by status

---

### PHASE 3: NPM PACKAGE TYPES AND EXPORTS

[ ] 3.1 Write `packages/satori-patterns/src/types.ts`

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

Acceptance:
- TypeScript compiles
- Types are exported and consumable

[ ] 3.2 Auto-generate `packages/satori-patterns/src/index.ts` from `compatibility.json`
        - Add npm script: `build:index`
        - Apply Skill File Section F, Rule F-1
        - Named exports use camelCase of pattern id (Skill Rule B-4)
        - Also export arrays:
          `allPatterns[]`, `gradientPatterns[]`, `geometricPatterns[]`,
          `decorativePatterns[]`, `effectsPatterns[]`

Acceptance:
- `npm run build:index` generates deterministic output
- Only eligible patterns are exported
- Build passes

---

### PHASE 4: SVG FALLBACKS

[ ] 4.1 Implement SVG fallback components for all patterns with
        `status === "SVG_FALLBACK_REQUIRED"`
        Use Skill File Section C templates.
        V1 priority fallbacks first:
          - dot-grid
          - line-grid
          - diagonal-crosshatch
          - halftone-radial-dots
          - noise-grain

Acceptance:
- Components exist in `src/svg-fallbacks/`
- Export names are PascalCase from pattern id
- Props conform to `SVGPatternProps`

[ ] 4.2 Render each SVG fallback via Satori and save PNG thumbnail
        - Write `apps/browser/public/thumbnails/[id].png`
        - Update manifest:
          - `renderMethod: "svg-fallback"`
          - `status: "PASS"` or `PARTIAL` if visual mismatch remains
          - notes if tradeoffs were made

Acceptance:
- V1 fallback thumbnails exist
- Manifest reflects actual render method/status

---

### PHASE 5: VISUAL BROWSER (NEXT.JS)

[ ] 5.1 Scaffold `apps/browser` as Next.js 14+ App Router project
        Install:
        - `@vercel/og`
        - local workspace reference to `satori-patterns`

Acceptance:
- App runs locally
- Build passes

[ ] 5.2 Build `app/page.tsx` (Pattern Grid)
        Source: `compatibility.json`
        Each card shows:
          - CSS native preview
          - Satori PNG thumbnail
          - Status badge
          - Category chip
          - "Copy satoriStyle" button
        Filters:
          - category
          - status
          - suitableForSocialBg
        Search by name

Acceptance:
- All manifest patterns appear
- Filters and search compose correctly
- Copy button copies valid JSON
- Missing thumbnail fallback UI is handled

[ ] 5.3 Build `app/pattern/[id]/page.tsx` (Detail Page)
        Show:
          - 1200x630 side-by-side preview
          - `satoriStyle` JSON
          - SVG component code if fallback
          - compatibility notes
          - skipReason explanation if SKIP

Acceptance:
- Route works for CSS, fallback, and SKIP entries
- No crash on missing thumbnail

[ ] 5.4 Build `app/api/render/[id]/route.ts` (Live Render Endpoint)
        - Render pattern live using `@vercel/og` and package exports
        - Return PNG
        - Cache-Control: max-age=86400

Acceptance:
- Endpoint returns PNG for at least 10 known patterns locally
- Endpoint errors are handled cleanly (404 for unknown id)

[ ] 5.5 HUMAN STEP: Deploy to Vercel
        Agent must prepare deployment config and docs only.
        Human performs deploy.
        After human provides deployed URL, verify 10 live patterns manually.

Acceptance:
- `README` or deployment notes include exact deploy steps
- Live URL verification recorded in `scripts/progress.json` after human provides URL

---

### PHASE 6: REVIEW PREP AND SOCIAL BG FLAGGING

[ ] 6.1 Generate `scripts/review-queue.txt`
        - Include all pattern IDs with `suitableForSocialBg === null`

Acceptance:
- File exists and matches manifest state

[ ] 6.2 Implement social background suitability scorer
        - Run on PASS/PARTIAL patterns
        - Use luminance variance heuristic:
          - score > 65 → true
          - score < 35 → false
          - else → null
        - Update manifest

Acceptance:
- Manifest updated deterministically
- Review queue regenerated

[ ] 6.3 HUMAN REVIEW STEP (cannot be automated)
        Human opens visual browser and reviews `review-queue.txt`
        For each pattern:
          - Compare CSS vs Satori
          - Set `suitableForSocialBg`
          - Downgrade PASS to PARTIAL if visually wrong
        Then rebuild `index.ts`

Acceptance:
- Human-reviewed manifest committed
- `build:index` rerun after review

---

### PHASE 7: PACKAGE READINESS AND PUBLISH

[ ] 7.1 Check NPM name availability
        Use:
        - `npm view satori-patterns name`
        - fallback names:
          - `satori-pattern-catalogue`
          - `og-patterns`
          - `patterncraft-satori`
        Record chosen name in package.json and README

Acceptance:
- One available name selected and recorded

[ ] 7.2 Create `packages/satori-patterns/package.json`
        Must include:
        - name
        - version
        - license
        - main/types exports
        - peer dependency on satori
        - keywords
        - build scripts

Acceptance:
- Package metadata valid
- Local pack/build works

[ ] 7.3 HUMAN STEP: Publish package
        Agent prepares package and publish commands
        Human runs:
          - `npm run build`
          - `npm publish --access public`

Acceptance:
- Publish instructions documented
- Versioning notes added to README

[ ] 7.4 Write root `README.md`
        Must cover:
        - What Satori is and why CSS translation is needed
        - Installation and usage
        - Named import and array import
        - SVG fallback usage
        - PatternCraft attribution (MIT credit to megh-bari)
        - Visual browser link (placeholder until deployed URL exists)
        - Contribution flow
        - Satori compatibility notes and limitations

Acceptance:
- README is complete and copy-paste usable
- Examples compile conceptually with package API

---

### PHASE 8: UPSTREAM SYNC AUTOMATION

[ ] 8.1 Create `.github/workflows/sync-upstream.yml`
        Schedule:
        - Every Monday, 6:00 AM UTC
        - `workflow_dispatch`
        Steps:
          a. Fetch upstream `patterns.ts` from raw GitHub URL
          b. Diff against `vendor/patterns.ts`
          c. If changed:
             - run `translate.ts --only-changed`
             - run `render-all.ts --only-changed`
             - run `update-skill.ts`
          d. Open PR with `diff-report.json` summary
          e. Commit updated `vendor/patterns.ts` + `upstream.lock`

Acceptance:
- Workflow YAML is valid
- Secrets/permissions are documented
- PR body generation uses `diff-report.json`

[ ] 8.2 Test workflow manually via `workflow_dispatch`
        HUMAN STEP if GitHub permissions are required.
        Agent prepares docs and validation checklist.

Acceptance:
- Test procedure documented
- Expected outputs documented

---

## DO NOT ATTEMPT (SATORI HARD BLOCKERS)

These must be pre-filtered by `featureScanner` and surfaced in browser as incompatible:

- Framer Motion / CSS animation / `@keyframes`
- Canvas-based patterns
- `backdrop-filter`
- Tailwind `before:` / `after:` pseudo modifiers
- `conic-gradient()`
- `background-blend-mode`
- shadcn animated backgrounds

---

## V1 PRIORITY PATTERNS (SHIP THESE FIRST)

| Category   | Pattern                  | Expected Method  |
|------------|--------------------------|------------------|
| gradients  | Subtle mesh gradient     | css              |
| gradients  | Radial gradient glow     | css              |
| geometric  | Dot grid                 | svg-fallback     |
| geometric  | Line grid (square)       | svg-fallback     |
| geometric  | Diagonal crosshatch      | svg-fallback     |
| effects    | Noise grain (SVG-based)  | svg-fallback     |
| decorative | Halftone radial dots     | svg-fallback     |

Rule:
- V1 release is allowed when all V1 priority patterns meet release gate, even if non-priority patterns remain SKIP or PARTIAL.

---

## COMMIT PROTOCOL

Use small commits at phase boundaries and after render batches.

Required render-run commit message format:
- `chore: render run, update compatibility + skill [run-YYYYMMDD]`

Recommended additional checkpoint commits:
- `chore: scaffold satori-patterns workspace`
- `feat: add css parser and feature scanner`
- `feat: add translation pipeline and manifest`
- `feat: add render pipeline and thumbnails`
- `feat: add svg fallbacks v1`
- `feat: add browser catalogue`
- `chore: add upstream sync workflow`

---

## V1 RELEASE GATE (MANDATORY)

V1 is complete only when all are true:

1. All V1 priority patterns are implemented and rendered
2. `compatibility.json` validates against `compatibility.schema.json`
3. `packages/satori-patterns` builds cleanly
4. `apps/browser` builds and runs locally
5. Pattern grid, detail page, and live render endpoint work locally
6. `README.md` is complete
7. `update-skill.ts` has run at least once after a render batch
8. `scripts/progress.json` is fully updated with no false DONE entries

Stop only when the release gate is satisfied, or clearly mark blockers with exact reasons.