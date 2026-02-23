# PATTERN CONVERSION SKILL
> Version: 1.1.0 | Updated: 2026-02-21
> Maintained by: scripts/update-skill.ts (auto) + manual edits (Sections A-F, H)
> Load this file in full before any conversion, translation, render, or export task.

---

## PURPOSE AND PRECEDENCE

This skill file is the conversion authority for translating PatternCraft patterns into
Satori-compatible outputs.

- The agent task prompt defines WHAT to build and execution order.
- This skill file defines HOW conversion, parsing, fallback, rendering, manifest updates,
  and validation decisions must be made.
- If an instruction in the task prompt conflicts with this skill file, this skill file wins.
- If a case is not covered here, mark it `UNCLASSIFIED`, log it in manifest notes, and
  continue safely without inventing unsupported behavior.

### Rule P-1: Section Precedence
If a learned rule in Section G conflicts with a general rule in Section A-F, Section G takes
precedence for the affected pattern IDs or feature signatures until Sections A-F are manually updated.

---

## SECTION A: SATORI CSS COMPATIBILITY RULES
> These rules are derived from Satori docs and empirical rendering. Do not modify support
> verdicts without retesting against the current `satori` version used by the package.

### Support Verdict Levels
- `SUPPORTED`: expected to work in common forms
- `SUPPORTED_WITH_CAVEATS`: often works, but syntax/edge cases may fail
- `EMPIRICAL_REQUIRED`: do not pre-skip, render-test individually
- `UNSUPPORTED`: pre-skip or route to fallback

### Feature Verdict Table

| CSS Feature / Pattern Signal              | Support Verdict          | Action on Detection |
|------------------------------------------|--------------------------|---------------------|
| linear-gradient()                         | SUPPORTED                | translate directly (CSS) |
| repeating-linear-gradient()               | SUPPORTED_WITH_CAVEATS   | translate directly, render-test |
| radial-gradient()                         | SUPPORTED_WITH_CAVEATS   | translate directly, render-test |
| repeating-radial-gradient()               | EMPIRICAL_REQUIRED       | translate directly, render-test |
| conic-gradient()                          | UNSUPPORTED              | status: SKIP, skipReason: conic-gradient |
| background-repeat: repeat (tile grids)    | SUPPORTED_WITH_CAVEATS   | prefer SVG_FALLBACK_REQUIRED for grid/tile patterns |
| background-blend-mode                     | UNSUPPORTED              | status: SKIP, skipReason: blend-mode |
| mix-blend-mode                            | UNSUPPORTED              | status: SKIP, skipReason: blend-mode |
| backdrop-filter                           | UNSUPPORTED              | status: SKIP, skipReason: backdrop-filter |
| filter: blur()                            | EMPIRICAL_REQUIRED       | do not pre-skip, render-test individually |
| filter: any non-blur function             | UNSUPPORTED              | status: SKIP, skipReason: css-filter |
| var() custom properties                   | SUPPORTED_WITH_CAVEATS   | resolve first, if unresolved: SKIP (unresolved-var) |
| before:/after: pseudo usage               | UNSUPPORTED              | status: SKIP, skipReason: pseudo-element |
| animation / @keyframes                    | UNSUPPORTED              | status: SKIP, skipReason: animation |
| canvas / `<canvas`                        | UNSUPPORTED              | status: SKIP, skipReason: canvas |
| calc() in backgroundSize/backgroundPos    | EMPIRICAL_REQUIRED       | translate, render-test; if parse fails: SKIP |
| background-clip                           | UNSUPPORTED              | status: SKIP, skipReason: background-clip |
| mask-image / mask / -webkit-mask          | UNSUPPORTED              | status: SKIP, skipReason: mask |
| background-attachment                     | UNSUPPORTED              | status: SKIP, skipReason: background-attachment |
| unsupported color functions (oklch/lab)   | EMPIRICAL_REQUIRED       | normalize if possible, else SKIP |
| Tailwind before:/after: modifiers         | UNSUPPORTED              | status: SKIP, skipReason: pseudo-element |
| shadcn animated background patterns       | UNSUPPORTED              | status: SKIP, skipReason: animation |

### Rule A-1: Tile/Grid Heuristic
If a pattern visually depends on repeated tiles or repeated dot/line lattice behavior, prefer
`SVG_FALLBACK_REQUIRED` even if Satori may parse the CSS. This improves fidelity and avoids
repeat bugs.

### Rule A-2: var() Resolution
If `var(...)` appears:
1. Attempt to resolve from `pattern.style` or local constants if present.
2. If all variables resolve cleanly, continue.
3. If any remain unresolved, set:
   - `status: SKIP`
   - `skipReason: unresolved-var`
   - add manifest note with unresolved variable names.

### Rule A-3: Unknown Feature Handling
If featureScanner detects a feature not covered by this table:
- Set `preliminaryStatus: UNCLASSIFIED`
- Do not silently translate
- Add note: `unclassified-feature:<name>`
- Render only if the feature is syntactically safe and non-blocking, otherwise SKIP with `skipReason: unknown-feature`

### Status Values
- `PASS`: Renders correctly, visually faithful to original
- `PARTIAL`: Renders, minor visual differences, usable
- `FAIL`: Satori or render pipeline throws an error
- `SILENT_FAIL`: Render succeeds but output is effectively blank, flat, or wrong
- `SVG_FALLBACK_REQUIRED`: CSS render path not viable, use SVG component
- `SKIP`: Incompatible feature detected pre-render, do not attempt CSS render
- `DEPRECATED`: Removed from upstream, retained for compatibility until major version
- `UNCLASSIFIED`: Needs manual rule addition before safe classification (intermediate only)

---

## SECTION B: CSS PARSING AND TRANSLATION RULES

### Rule B-1: Depth-0 Comma Splitter (CRITICAL)
Never split `backgroundImage`, `backgroundSize`, or `backgroundPosition` on all commas.
Commas appear inside gradients and function arguments.

You MUST split only at commas where parenthesis depth is 0.

Reference algorithm:
```ts
function splitAtDepthZero(str: string): string[] {
  const parts: string[] = []
  let current = ''
  let depth = 0

  for (const ch of str) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (depth < 0) throw new Error('parse-error: negative depth')

    if (ch === ',' && depth === 0) {
      if (current.trim()) parts.push(current.trim())
      current = ''
      continue
    }

    current += ch
  }

  if (depth !== 0) throw new Error('parse-error: unbalanced parentheses')
  if (current.trim()) parts.push(current.trim())
  return parts
}

Use this for:

backgroundImage layer splitting

backgroundSize layer splitting

backgroundPosition layer splitting

If parsing throws:

status: SKIP

skipReason: parse-error

note: depth0-split-parse-error

Rule B-2: Layer Pairing and Normalization

Layered properties must align by index:

backgroundImage[i] ↔ backgroundSize[i] ↔ backgroundPosition[i]

If counts mismatch:

If a property has exactly 1 value, replicate it across all image layers.

If a property has fewer values than image layers, repeat the last value until lengths match.

If a property has more values than image layers, truncate extras.

Add manifest note:

normalized-layer-counts:<images>/<sizes>/<positions>

Rule B-3: Style Property Output Format (CSS renderMethod only)

NEVER output background shorthand in satoriStyle.

ALWAYS use explicit properties for renderMethod: "css":

backgroundColor: pattern.style.background

backgroundImage: pattern.style.backgroundImage

backgroundSize: pattern.style.backgroundSize ?? 'auto'

backgroundPosition: pattern.style.backgroundPosition ?? 'center'

If pattern.style.background is absent, omit backgroundColor.

Rule B-4: Source of Truth

ALWAYS read from pattern.style.* fields.

NEVER use pattern.code for translation or classification.
pattern.code is presentation text, not canonical style data.

Rule B-5: Export Identifier Naming

Named export identifier: camelCase of pattern.id

dot-grid-light → dotGridLight

mesh-gradient-purple → meshGradientPurple

SVG fallback component name: PascalCase of pattern.id

dot-grid-light → DotGridLight

Rule B-6: Color Syntax Normalization

If unsupported color syntax appears (for example oklch(), lab(), slash alpha variants):

Attempt safe normalization to rgb(), rgba(), hex, or supported format.

If normalization succeeds, add note normalized-color-syntax.

If normalization fails, SKIP with skipReason: unsupported-color.

Rule B-7: CSS vs SVG Manifest Rules

For renderMethod: "css", satoriStyle must be a non-null object using explicit properties.

For renderMethod: "svg-fallback", satoriStyle may be null.

Browser and export code must rely on renderMethod to decide whether to use CSS or Component.

SECTION C: SVG FALLBACK RULES

Use SVG fallbacks for any pattern that:

depends on repeated tile/grid behavior, or

is classified SVG_FALLBACK_REQUIRED, or

has a learned-rule override requiring SVG fallback.

Rule C-1: SVG Fallback Component Interface

All SVG fallback components must implement this interface:

interface SVGPatternProps {
  width?: number       // default: 1200
  height?: number      // default: 630
  foreground?: string  // default: dominant line/dot color
  background?: string  // default: pattern background color
  idPrefix?: string    // optional unique prefix for defs IDs
  [key: string]: unknown
}

File path:

packages/satori-patterns/src/svg-fallbacks/[id].tsx

Export name:

PascalCase of pattern ID

Rule C-2: Unique SVG IDs (MANDATORY)

Never hardcode reusable IDs like id="p" or id="noise".

All <pattern>, <filter>, <clipPath>, and <mask> IDs must be unique per SVG instance.

Use:

idPrefix prop if provided, otherwise

deterministic fallback such as ${patternId}-${width}x${height}

Example:

const patternId = ${baseId}-pattern``

const noiseId = ${baseId}-noise``

Rule C-3: Dot Grid Template

Use tiled SVG pattern with circles.

Structure:

Background rect

<defs><pattern ...><circle ... /></pattern></defs>

Foreground tile fill rect with url(#patternId)

Defaults:

spacing: 24

dotSize: 1.5 to 2.5 (match source visual intent)

Rule C-4: Line Grid Template

Use tiled SVG pattern with stroke path.

Recommended path:

M {spacing} 0 L 0 0 0 {spacing}

Defaults:

spacing: 32

strokeWidth: 1

Rule C-5: Diagonal Crosshatch Template

Implement as one of these approved methods:

A single <pattern> containing two line paths (one rising, one falling), or

Two stacked pattern fills with different line directions

Preferred defaults:

spacing: 24

strokeWidth: 1

opacity: 0.35 to 0.65 depending on source

If using transforms, keep line alignment deterministic and avoid clipping seams.

Rule C-6: Halftone Radial Dots Template

Use a generated dot field with radially scaled circles or grouped circles whose radius changes
with distance from a focal point.

Requirements:

deterministic layout

no random placement unless seeded

preserve a clear radial density/size gradient

Rule C-7: Noise Grain Template

Use SVG turbulence filter.

Reference structure:

If Satori or resvg has filter issues for a specific variant, downgrade to PARTIAL and note:

svg-noise-filter-variance

Rule C-8: Fallback Fidelity Notes

If a fallback is visually simplified compared to source CSS:

allow status: PARTIAL

record exact tradeoff in manifest notes, for example:

fallback-simplified: reduced-layer-density

fallback-simplified: approximated-radial-dot-scaling

SECTION D: RENDER PIPELINE RULES
Rule D-1: Font Loading (MANDATORY)

Satori requires at least one font, even for text-free renders.

Always load a local .ttf:

preferred path: scripts/assets/Inter.ttf

Example:

fonts: [
  {
    name: 'Inter',
    data: fs.readFileSync('scripts/assets/Inter.ttf'),
    weight: 400,
    style: 'normal',
  },
]

If font file is missing:

fail fast with clear error message

do not continue render run

Rule D-2: Batch Rendering Defaults

Do not render all patterns concurrently.

Defaults:

batchSize = 15

batchDelayMs = 100

renderTimeoutMs = 10000

These may be overridden by CLI flags or env vars, but defaults must be applied if unspecified.

Rule D-3: Render Dimensions

Always render OG size:

width: 1200

height: 630

Thumbnails:

600x315 generated from the rendered 1200x630 image (50% scale)

Rule D-4: PNG Conversion

Convert Satori SVG output to PNG using @resvg/resvg-js.

Do not use sharp for SVG→PNG conversion in this pipeline.

Rule D-5: Failure Mode Detection

Detect these cases per pattern:

FAIL

satori() throws, resvg throws, or pipeline throws

record error summary in manifest notes

SILENT_FAIL

render completes but image is effectively wrong, using image analysis:

all or mostly white

all or mostly black

near-solid low variance output

mostly transparent/alpha-empty

use a variance-based heuristic, not white-only check

sample at least 100 pixels across the image

if low variance or blank condition is triggered, mark SILENT_FAIL

PASS / PARTIAL

render output present and non-blank

human review may later downgrade PASS to PARTIAL

Rule D-6: Whiteness and Variance Heuristic (Reference)

Use a combined heuristic:

sample >=100 pixels

compute:

percent white (rgb >= 250)

percent black (rgb <= 5)

alpha coverage

luminance variance

mark SILENT_FAIL if any:

white > 90%

black > 90% (unless source is intended near-black and notes confirm)

alpha-empty > 90%

luminance variance below threshold for a pattern expected to contain detail

If uncertain, mark PARTIAL and note manual-review-required: ambiguous-silent-fail.

Rule D-7: Render Method Selection

render-all.ts must render:

CSS patterns directly via satoriStyle

SVG fallback patterns via their SVG component rendered through Satori-compatible wrapper

Do not attempt CSS render for:

SKIP

DEPRECATED

UNCLASSIFIED (unless manually allowed)

SVG_FALLBACK_REQUIRED before fallback component exists

Rule D-8: --only-changed Flag

translate.ts and render-all.ts must accept --only-changed.

When set:

read scripts/diff-report.json

process only added[] and modified[]

skip unchanged pattern IDs

If diff-report.json is missing or malformed:

fail with clear message

do not silently process all patterns

Rule D-9: Post-Render Skill Update

After every render batch (full or only-changed), run:

npx tsx scripts/update-skill.ts

This step is mandatory.

SECTION E: UPSTREAM DIFF RULES
Rule E-1: Upstream Source

Canonical upstream raw file:

https://raw.githubusercontent.com/megh-bari/pattern-craft/main/src/data/patterns.ts

Rule E-2: Snapshot and Lock Files

Local snapshot: vendor/patterns.ts

Lock file: upstream.lock

upstream.lock schema:

{
  "commitSha": "string",
  "date": "ISO date",
  "patternCount": 0,
  "upstreamUrl": "string",
  "upstreamSourceRef": "string"
}
Rule E-3: Commit SHA Source

Do not invent upstream commit SHA.

Use one of these approved methods:

GitHub API commit lookup for src/data/patterns.ts

A pinned raw URL containing a commit SHA

If only local fork SHA is available, store it as local commit and set upstreamSourceRef accordingly

Record in upstream.lock which method/source was used.

Rule E-4: Diff Report Schema

scripts/diff-upstream.ts must output scripts/diff-report.json:

{
  "added": ["id"],
  "modified": ["id"],
  "removed": ["id"],
  "upstreamCommit": "string",
  "localCommit": "string",
  "date": "ISO date"
}
Rule E-5: Removed Patterns

Do not delete removed patterns immediately.

If upstream removes a pattern:

set status: "DEPRECATED" in manifest

set renderMethod: "none" unless historical asset retained

keep it out of exports (Rule F-4)

remove only on next semver major

SECTION F: COMPATIBILITY MANIFEST RULES
Rule F-1: Manifest File and Shape

Manifest file: compatibility.json (repo root)

Use top-level object shape:

{
  "meta": {
    "upstreamCommitSha": "string",
    "generatedAt": "ISO date",
    "satoriVersion": "string"
  },
  "patterns": []
}
Rule F-2: Pattern Record Schema

Each patterns[] item must follow:

{
  "id": "string",
  "name": "string",
  "category": "gradients|geometric|decorative|effects",
  "status": "PASS|PARTIAL|FAIL|SILENT_FAIL|SVG_FALLBACK_REQUIRED|SKIP|DEPRECATED|UNCLASSIFIED",
  "skipReason": "conic-gradient|backdrop-filter|animation|pseudo-element|canvas|blend-mode|css-filter|background-clip|unresolved-var|unsupported-calc|unknown-feature|parse-error|mask|background-attachment|unsupported-color|null",
  "renderMethod": "css|svg-fallback|none",
  "features": ["string"],
  "preliminaryStatus": "string|null",
  "satoriStyle": "object|null",
  "satoriVersion": "string",
  "suitableForSocialBg": "boolean|null",
  "notes": ["string"],
  "updatedAt": "ISO date"
}
Rule F-3: Ordering and Determinism

Manifest updates must be deterministic:

preserve stable order (pick one and use consistently):

upstream source order, or

category + name

preserve field order within each record

do not rewrite untouched records unnecessarily

Rule F-4: NPM Export Filter

Only export patterns where:

status === "PASS" || status === "PARTIAL"

and renderMethod === "css" || renderMethod === "svg-fallback"

Do NOT export:

SKIP

FAIL

SILENT_FAIL

DEPRECATED

UNCLASSIFIED

Rule F-5: Manual Review Queue

After each render run, write scripts/review-queue.txt with all pattern IDs where:

suitableForSocialBg === null

One ID per line, stable order.

Rule F-6: Notes Usage

notes is an array of machine-readable or human-readable strings.

Recommended note formats:

normalized-layer-counts:4/1/2

render-error:<message>

fallback-simplified:<reason>

manual-review-required:<reason>

unclassified-feature:<name>

SECTION G: LEARNED PATTERNS

Auto-appended by scripts/update-skill.ts after each render run.
Do NOT edit manually.
Agents must read this section. It contains empirical findings that override or supplement
Section A-F rules.

Rule G-1: Deduplication

update-skill.ts must not append duplicate learned entries.

Deduplication key (normalized):

finding + action + overridesRule

If a new run repeats an existing learned pattern with the same action, do not append.

Rule G-2: Scope of Override

A learned entry may override:

specific pattern IDs (affectedPatternIds)

a feature signature (described in finding and action)

Section G overrides apply immediately during subsequent runs.

<!-- LEARNED_PATTERNS_START --> <!-- Entries will be appended here automatically after each render run. --> <!-- Format per entry: { "date": "YYYY-MM-DD", "runId": "string", "finding": "description of what was discovered", "action": "what rule to apply going forward", "affectedPatternIds": [], "overridesRule": "A|B|C|D|E|F | null" } --> 
```json
{
  "date": "2026-02-21",
  "runId": "unknown-run",
  "finding": "Patterns with feature radial-gradient produced silent-fail outputs in current render batch",
  "action": "Flag radial-gradient patterns for stricter silent-fail variance checks and manual review",
  "affectedPatternIds": [
    "azure-depths-top",
    "volcanic-ember",
    "dark-dotted-grid",
    "dark-white-dotted-grid"
  ],
  "overridesRule": "D"
}
```

```json
{
  "date": "2026-02-21",
  "runId": "unknown-run",
  "finding": "Patterns with feature linear-gradient produced silent-fail outputs in current render batch",
  "action": "Flag linear-gradient patterns for stricter silent-fail variance checks and manual review",
  "affectedPatternIds": [
    "basic-grid",
    "black-basic-grid",
    "black-grid-white-dots",
    "bottom-fade-grid",
    "circuit-board",
    "dark-basic-grid-slate",
    "dark-basic-grid-faded",
    "dark-circuit-board",
    "dark-grid-lines",
    "dark-grid-white-dots",
    "diagonal-fade-bottom-grid-Left",
    "diagonal-fade-bottom-grid-right",
    "diagonal-fade-center-grid",
    "diagonal-fade-grid-left",
    "diagonal-fade-grid-right",
    "diagonal-lines",
    "left-masked-basic-grid",
    "left-masked-circuit-board",
    "left-masked-white-grid-with-dots",
    "neon-vertical-lines",
    "right-masked-basic-grid",
    "right-masked-circuit-board",
    "right-masked-white-grid-with-dots",
    "small-grid",
    "top-fade-grid",
    "vercel-grid-subtle",
    "white-grid-with-dots"
  ],
  "overridesRule": "D"
}
```
### Learned Pattern 3: Silent-fail status must be persisted atomically
```json
{
  "date": "2026-02-21",
  "runId": "review-pass-1",
  "finding": "render-all.ts detected 31 SILENT_FAIL patterns but status was not persisted to manifest when scripts ran out of order. UNCLASSIFIED patterns with satoriStyle+satoriVersion set should be treated as SILENT_FAIL.",
  "action": "Added patch-silent-fails.ts to fix status. Pipeline order must be: init → translate → render → patch-silent-fails → fallbacks → score.",
  "overridesRule": "D"
}
```

### Learned Pattern 4: Upstream ID data quality issues
```json
{
  "date": "2026-02-21",
  "runId": "review-pass-1",
  "finding": "Upstream pattern IDs contain spaces and special chars: 'orchid -depths', 'soft lavender-center-glow', 'diagonal-electric erange', 'diagonal-red/blue-glow'. These cause filesystem and URL routing issues.",
  "action": "toCamelCase in translate.ts and build-index.ts normalizes these for export identifiers. Manifest preserves original IDs for upstream traceability. Browser app should URL-encode pattern IDs.",
  "overridesRule": "B"
}
```

### Learned Pattern 5: CSS comments in gradient values
```json
{
  "date": "2026-02-21",
  "runId": "initial-pipeline",
  "finding": "Upstream patterns contain CSS comments (/* ... */) inside gradient values which Satori rejects as parse errors.",
  "action": "translate.ts strips comments via stripComments() before processing. This is idempotent.",
  "overridesRule": "B"
}
```

### Learned Pattern 6: backgroundSize defaults for gradients
```json
{
  "date": "2026-02-21",
  "runId": "initial-pipeline",
  "finding": "Satori renders gradients as blank when backgroundSize is 'auto'. Full-bleed gradients need explicit '100% 100%'.",
  "action": "translate.ts defaults gradient layers to backgroundSize '100% 100%' when no explicit size is set. Tile-repeat patterns retain their small sizes.",
  "overridesRule": "B"
}
```
### Learned Pattern 7: Category-aware social background scoring (2026-02-22)
```json
{
  "date": "2026-02-22",
  "runId": "score-social-rewrite",
  "finding": "The original variance-only heuristic (threshold < 35 = false) scored 192/200 PASS patterns as not suitable for social backgrounds, with 0 going to human review. Dark grids and dark dot arrays were auto-rejected because low luminance variance is inherent to their design, not a sign of being unsuitable. Many dark patterns are exactly the kind of clean backgrounds used in social media graphics.",
  "action": "Replaced global variance heuristic with a category-aware dispatcher in score-social-bg.ts: (1) gradients: reject only truly flat outputs (variance < 5, no radial-gradient layer); (2) geometric: never penalise for low variance — check backgroundSize for small tile structure instead; reject only 100% 100% with no tile; (3) decorative/effects: keep variance heuristic but lower auto-reject threshold from < 35 to < 15. Never auto-approve (never return true). Result: null count 8 → 218, false count 192 → 44.",
  "affectedPatternIds": [],
  "overridesRule": "D"
}
```
<!-- LEARNED_PATTERNS_END -->
SECTION H: VALIDATION RULES
Rule H-1: Manifest Validation

Validate compatibility.json against compatibility.schema.json:

before translation/render scripts modify it (load validation)

after any script writes to it (save validation)

Fail the script on schema errors.

Rule H-2: Export Validation

When generating packages/satori-patterns/src/index.ts:

ensure all named export identifiers are unique

ensure all exports satisfy Rule F-4

fail on duplicates or invalid export candidates

Rule H-3: SVG Fallback Validation

For every svg-fallback pattern:

component file must exist

component must compile

thumbnail must exist after render

manifest renderMethod must be "svg-fallback"

If any are missing, do not mark pattern PASS.

Rule H-4: Thumbnail Validation

For every pattern marked PASS or PARTIAL:

corresponding thumbnail file must exist at apps/browser/public/thumbnails/[id].png

If missing:

downgrade status to FAIL

add note missing-thumbnail

Rule H-5: Script Exit Codes

All scripts in this workflow must exit non-zero on failure conditions, including:

malformed manifest

missing font

parse errors not handled

invalid diff-report on --only-changed

export generation conflicts

Do not swallow errors and continue silently.

Rule H-6: Idempotency Validation

Generator scripts (translate.ts, build:index, manifest writers) must be idempotent.
Re-running without source changes should not produce unexpected diffs.

If a script rewrites files with no logical changes, treat it as a bug and fix serialization/output ordering.