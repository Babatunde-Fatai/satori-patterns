# PATTERN CONVERSION SKILL
> Version: 1.0.0 | Created: 2026-02-21
> Maintained by: scripts/update-skill.ts (auto) + manual edits (Section A only)
> Load this file in full before any conversion, translation, or render task.

---

## SECTION A: SATORI CSS COMPATIBILITY RULES
> These rules are derived from Satori's CSS spec. Do not modify without
> re-testing against the current Satori version in package.json.

### Feature Verdict Table

| CSS Feature                     | Satori Support | Action on Detection       |
|---------------------------------|---------------|---------------------------|
| linear-gradient()               | FULL          | translate directly (CSS)  |
| repeating-linear-gradient()     | FULL          | translate directly (CSS)  |
| radial-gradient()               | FULL          | translate directly (CSS)  |
| repeating-radial-gradient()     | FULL          | translate directly (CSS)  |
| conic-gradient()                | NONE          | status: SKIP, skipReason: conic-gradient |
| background-repeat: repeat       | BUGGY         | status: SVG_FALLBACK_REQUIRED |
| background-blend-mode           | NONE          | status: SKIP, skipReason: blend-mode |
| mix-blend-mode                  | NONE          | status: SKIP, skipReason: blend-mode |
| backdrop-filter                 | NONE          | status: SKIP, skipReason: backdrop-filter |
| CSS filter: blur()              | PARTIAL       | do not pre-skip; render-test individually |
| CSS filter: (other)             | NONE          | status: SKIP, skipReason: css-filter |
| var() custom properties         | NONE          | attempt to resolve; if unresolvable: SKIP |
| before: / after: pseudo         | NONE          | status: SKIP, skipReason: pseudo-element |
| animation / @keyframes          | NONE          | status: SKIP, skipReason: animation |
| canvas / <canvas                | NONE          | status: SKIP, skipReason: canvas |
| calc() in backgroundSize        | UNCERTAIN     | do not pre-skip; render-test individually |
| background-clip                 | NONE          | status: SKIP, skipReason: background-clip |

### Status Values
- PASS: Renders correctly, visually faithful to original
- PARTIAL: Renders but with minor visual difference; usable
- FAIL: Satori throws an error during render
- SILENT_FAIL: Satori returns output but result is blank/white/solid
- SVG_FALLBACK_REQUIRED: CSS render not viable; SVG component needed
- SKIP: Incompatible feature detected pre-render; do not attempt
- DEPRECATED: Was in package but removed from upstream PatternCraft

---

## SECTION B: CSS PARSING RULES

### Rule B-1: Depth-0 Comma Splitter (CRITICAL)
Never split backgroundImage on all commas. Commas appear inside
gradient color stops. You MUST only split at commas where parenthesis
depth is 0.

Correct algorithm:
  function splitAtDepthZero(str: string): string[] {
    const parts = []; let current = ''; let depth = 0;
    for (const ch of str) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (ch === ',' && depth === 0) {
        parts.push(current.trim()); current = ''; continue;
      }
      current += ch;
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  }

Use this for: backgroundImage layer splitting, backgroundSize
layer splitting. Pair layers: backgroundImage[i] ↔ backgroundSize[i].

### Rule B-2: Style Property Output Format
NEVER output background shorthand in satoriStyle.
ALWAYS use explicit properties:
  backgroundColor: pattern.style.background,
  backgroundImage: pattern.style.backgroundImage,
  backgroundSize: pattern.style.backgroundSize ?? 'auto',
  backgroundPosition: pattern.style.backgroundPosition ?? 'center',

### Rule B-3: Source of Truth
ALWAYS read from pattern.style.* fields.
NEVER use the pattern.code field (it is a pre-formatted display string).

### Rule B-4: Named Export Identifier Generation
Convert pattern.id (kebab-case) to camelCase for named exports.
  "dot-grid-light" → dotGridLight
  "mesh-gradient-purple" → meshGradientPurple

---

## SECTION C: SVG FALLBACK RULES

Use SVG fallbacks for any pattern with:
  - background-repeat that creates a tile grid
  - status: SVG_FALLBACK_REQUIRED

### SVG Fallback Component Template
All SVG fallback components must follow this interface:

  interface SVGPatternProps {
    width?: number       // default: 1200
    height?: number      // default: 630
    foreground?: string  // default: pattern's dominant line/dot color
    background?: string  // default: pattern's background color
    [key: string]: unknown
  }

  // File location: packages/satori-patterns/src/svg-fallbacks/[id].tsx
  // Export name: PascalCase of pattern id
  //   "dot-grid-light" → DotGridLight

### Dot Grid Template
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="p" x="0" y="0" width={spacing} height={spacing}
               patternUnits="userSpaceOnUse">
        <circle cx={spacing/2} cy={spacing/2} r={dotSize} fill={foreground}/>
      </pattern>
    </defs>
    <rect width={width} height={height} fill={background}/>
    <rect width={width} height={height} fill="url(#p)"/>
  </svg>

### Line Grid Template
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="p" x="0" y="0" width={spacing} height={spacing}
               patternUnits="userSpaceOnUse">
        <path d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
              fill="none" stroke={foreground} strokeWidth={strokeWidth}/>
      </pattern>
    </defs>
    <rect width={width} height={height} fill={background}/>
    <rect width={width} height={height} fill="url(#p)"/>
  </svg>

### Diagonal Crosshatch Template
  Use two rotated line patterns at +45° and -45° using transform="rotate(45, ...)"
  on the pattern element.

### Noise Grain Template
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65"
                    numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width={width} height={height} fill={background}/>
    <rect width={width} height={height} filter="url(#noise)"
          opacity={noiseOpacity ?? 0.15}/>
  </svg>

---

## SECTION D: RENDER PIPELINE RULES

### Rule D-1: Font Loading
Satori requires at least one font even for no-text renders.
Always load a font. Recommended: use Inter or Geist as a local .ttf.
Place a font file at scripts/assets/Inter.ttf.
  fonts: [{ name: 'Inter', data: fs.readFileSync('scripts/assets/Inter.ttf') }]

### Rule D-2: Batch Rendering
Render in batches of 15 patterns with a 100ms delay between batches.
Do not fire all 250+ renders concurrently. This prevents OOM in Node.

### Rule D-3: Failure Mode Detection
Detect three distinct failure modes:
  (a) FAIL: satori() throws → catch error, log message
  (b) SILENT_FAIL: output renders as mostly blank
      → Sample 100 random pixels from PNG buffer
      → If >90% are rgb(255,255,255) → SILENT_FAIL
  (c) PASS/PARTIAL: normal render → flag for human review

### Rule D-4: Canvas Dimensions
Always render at: width: 1200, height: 630 (standard OG image)
Thumbnails: 600x315 (50% scale, generated from the 1200x630 PNG)

### Rule D-5: PNG Conversion
Use @resvg/resvg-js to convert Satori's SVG output to PNG.
Do NOT use sharp for SVG-to-PNG — resvg is more faithful to SVG spec.

### Rule D-6: --only-changed Flag
All render and translate scripts must accept --only-changed as a CLI arg.
When set, read scripts/diff-report.json and only process pattern IDs
listed in added[] and modified[]. Skip all others.

---

## SECTION E: UPSTREAM DIFF RULES

### Rule E-1: Upstream Source
Upstream file location (raw GitHub):
  https://raw.githubusercontent.com/megh-bari/pattern-craft/main/src/data/patterns.ts

### Rule E-2: Snapshot Location
Local snapshot: vendor/patterns.ts
Lock file: upstream.lock { commitSha, date, patternCount }

### Rule E-3: Diff Report Schema
scripts/diff-upstream.ts must output scripts/diff-report.json:
  {
    "added": string[],
    "modified": string[],
    "removed": string[],
    "upstreamCommit": string,
    "localCommit": string,
    "date": string
  }

### Rule E-4: Removed Patterns
Do NOT delete removed patterns from the NPM package immediately.
Set their status to "DEPRECATED" in compatibility.json.
Remove from NPM exports only on the next semver major bump.

---

## SECTION F: COMPATIBILITY MANIFEST RULES

### Schema
File: compatibility.json (repo root)
  [
    {
      "id": string,
      "name": string,
      "category": "gradients" | "geometric" | "decorative" | "effects",
      "status": "PASS"|"PARTIAL"|"FAIL"|"SILENT_FAIL"|"SVG_FALLBACK_REQUIRED"|"SKIP"|"DEPRECATED",
      "skipReason": null | "conic-gradient" | "backdrop-filter" | "animation"
                         | "pseudo-element" | "canvas" | "blend-mode"
                         | "css-filter" | "background-clip",
      "renderMethod": "css" | "svg-fallback" | "none",
      "satoriVersion": string,
      "suitableForSocialBg": true | false | null,
      "notes": string
    }
  ]

### Rule F-1: NPM Export Filter
Only export patterns where:
  status === "PASS" || status === "PARTIAL"
  AND renderMethod === "css" || renderMethod === "svg-fallback"

### Rule F-2: Manual Review Queue
After each render run, log patterns with suitableForSocialBg === null
to scripts/review-queue.txt for human review in the visual browser.

---

## SECTION G: LEARNED PATTERNS
> Auto-appended by scripts/update-skill.ts after each render run.
> Do NOT edit manually. Entries are additive.
> Agents must read this section — it contains empirical findings that
> override or supplement Section A rules.

<!-- LEARNED_PATTERNS_START -->
<!-- Entries will be appended here automatically after each render run. -->
<!-- Format per entry:
{
  "date": "YYYY-MM-DD",
  "runId": "string",
  "finding": "description of what was discovered",
  "action": "what rule to apply going forward",
  "affectedPatternIds": [],
  "overridesRule": "A|B|C|D|E|F | null"
}
-->
<!-- LEARNED_PATTERNS_END -->
