import fs from "node:fs"
import path from "node:path"
import { featureScanner, type PatternStyleInput } from "./classify"
import { splitAtDepthZero, normalizeLayerValues, CssParseError } from "./utils/cssParser"
import {
  readManifest,
  writeManifest,
  upsertPattern,
  sortManifestPatternsStable,
  type CompatibilityManifest,
  type CompatibilityPattern,
  type PatternCategory,
} from "./utils/manifest"

interface UpstreamPattern {
  id: string
  name: string
  category: PatternCategory
  style: Record<string, string>
}

interface SatoriStyle {
  backgroundColor?: string
  backgroundImage: string
  backgroundSize?: string
  backgroundPosition?: string
}

const CATEGORIES: PatternCategory[] = ["gradients", "geometric", "decorative", "effects"]

function toCamelCase(id: string): string {
  return id
    .toLowerCase()
    .replace(/[\s-]+([a-z0-9])/g, (_, c) => c.toUpperCase())
}

function loadPatternsFromVendor(): UpstreamPattern[] {
  const filePath = path.join(process.cwd(), "vendor", "patterns.ts")
  if (!fs.existsSync(filePath)) {
    const srcPath = path.join(process.cwd(), "src", "data", "patterns.ts")
    if (!fs.existsSync(srcPath)) {
      throw new Error("Neither vendor/patterns.ts nor src/data/patterns.ts found")
    }
    return loadPatternsFromFile(srcPath)
  }
  return loadPatternsFromFile(filePath)
}

function loadPatternsFromFile(filePath: string): UpstreamPattern[] {
  const content = fs.readFileSync(filePath, "utf8")
  const patterns: UpstreamPattern[] = []

  const idRegex = /id:\s*"([^"]+)"/g
  const nameRegex = /name:\s*"([^"]+)"/g
  const categoryRegex = /category:\s*"([^"]+)"/g

  const ids: string[] = []
  const names: string[] = []
  const categories: string[] = []

  let m: RegExpExecArray | null
  while ((m = idRegex.exec(content))) ids.push(m[1])
  while ((m = nameRegex.exec(content))) names.push(m[1])
  while ((m = categoryRegex.exec(content))) categories.push(m[1])

  if (ids.length !== names.length || ids.length !== categories.length) {
    throw new Error(`Pattern count mismatch: ids=${ids.length}, names=${names.length}, categories=${categories.length}`)
  }

  for (let i = 0; i < ids.length; i++) {
    const idStr = `id: "${ids[i]}"`
    const searchStart = i === 0 ? 0 : content.indexOf(`id: "${ids[i - 1]}"`) + 1
    const blockStart = content.indexOf(idStr, searchStart)
    const nextIdStr = i < ids.length - 1 ? `id: "${ids[i + 1]}"` : null
    const blockEnd = nextIdStr ? content.indexOf(nextIdStr, blockStart + idStr.length) : content.length
    const block = content.slice(blockStart, blockEnd < 0 ? content.length : blockEnd)
    const styleObj = extractStyle(block)

    patterns.push({
      id: ids[i],
      name: names[i],
      category: categories[i] as PatternCategory,
      style: styleObj,
    })
  }

  return patterns
}

function extractStyle(block: string): Record<string, string> {
  const styleStart = block.indexOf("style:")
  if (styleStart < 0) return {}

  const braceStart = block.indexOf("{", styleStart)
  if (braceStart < 0) return {}

  let depth = 0
  let end = braceStart
  for (let i = braceStart; i < block.length; i++) {
    if (block[i] === "{") depth++
    else if (block[i] === "}") {
      depth--
      if (depth === 0) { end = i; break }
    }
  }

  const styleStr = block.slice(braceStart, end + 1)
  const result: Record<string, string> = {}

  const propRegex = /(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g
  let propMatch: RegExpExecArray | null
  while ((propMatch = propRegex.exec(styleStr))) {
    const key = propMatch[1]
    const value = propMatch[2] ?? propMatch[3] ?? propMatch[4] ?? ""
    result[key] = value
  }

  return result
}

function translateToSatoriStyle(
  style: Record<string, string>
): { satoriStyle: SatoriStyle | null; notes: string[] } {
  const notes: string[] = []

  // Rule B-3: Always use explicit properties, never background shorthand
  // Rule B-4: Read from pattern.style.* fields
  // Normalize whitespace and strip CSS comments
  const normalizeWs = (s: string) => s.replace(/\s+/g, " ").trim()
  const stripComments = (s: string) => s.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "")
  const clean = (s: string) => normalizeWs(stripComments(s))

  let backgroundImage = clean(style.backgroundImage ?? "")
  let backgroundColor = clean(style.background ?? style.backgroundColor ?? "")

  // If only `background` is set and it contains gradient, treat it as backgroundImage
  if (!backgroundImage && backgroundColor) {
    const bgLower = backgroundColor.toLowerCase()
    if (bgLower.includes("gradient(") || bgLower.includes("url(")) {
      backgroundImage = backgroundColor
      backgroundColor = ""
    }
  }

  if (!backgroundImage) {
    // No backgroundImage to translate — simple solid color only
    if (backgroundColor) {
      return {
        satoriStyle: {
          backgroundColor,
          backgroundImage: "",
        },
        notes: ["solid-color-only"],
      }
    }
    return { satoriStyle: null, notes: ["no-style-data"] }
  }

  // Split layers using depth-0 splitter (Rule B-1)
  let imageLayers: string[]
  try {
    imageLayers = splitAtDepthZero(backgroundImage)
  } catch (e) {
    if (e instanceof CssParseError) {
      return { satoriStyle: null, notes: ["depth0-split-parse-error"] }
    }
    throw e
  }

  // Normalize layer values (Rule B-2)
  const rawSizes = style.backgroundSize
    ? splitAtDepthZero(clean(style.backgroundSize))
    : []
  const rawPositions = style.backgroundPosition
    ? splitAtDepthZero(clean(style.backgroundPosition))
    : []

  const { values: sizes, normalized: sizeNormalized } = normalizeLayerValues(imageLayers, rawSizes)
  const { values: positions, normalized: posNormalized } = normalizeLayerValues(imageLayers, rawPositions)

  if (sizeNormalized || posNormalized) {
    notes.push(`normalized-layer-counts:${imageLayers.length}/${rawSizes.length}/${rawPositions.length}`)
  }

  // For gradient backgrounds without explicit size, default to "100% 100%"
  // Satori requires explicit sizing for gradients to fill the container
  const finalSizes = sizes.map((s, i) => {
    if (s === "auto" && imageLayers[i]?.toLowerCase().includes("gradient(")) {
      return "100% 100%"
    }
    return s
  })

  const satoriStyle: SatoriStyle = {
    backgroundImage: imageLayers.join(", "),
    backgroundSize: finalSizes.join(", ") || "100% 100%",
    backgroundPosition: positions.join(", ") || "center",
  }

  if (backgroundColor && !backgroundColor.toLowerCase().includes("gradient(")) {
    satoriStyle.backgroundColor = backgroundColor
  }

  return { satoriStyle, notes }
}

function writeCategoryFile(category: PatternCategory, patterns: CompatibilityPattern[]): void {
  const eligible = patterns.filter(
    (p) =>
      p.category === category &&
      p.renderMethod === "css" &&
      p.satoriStyle != null
  )

  const lines: string[] = [
    `/* AUTO-GENERATED FILE. DO NOT EDIT. */`,
    `import type { SatoriPattern } from "../types"`,
    ``,
  ]

  for (const p of eligible) {
    const name = toCamelCase(p.id)
    lines.push(`export const ${name}: SatoriPattern = {`)
    lines.push(`  id: ${JSON.stringify(p.id)},`)
    lines.push(`  name: ${JSON.stringify(p.name)},`)
    lines.push(`  category: ${JSON.stringify(p.category)},`)
    lines.push(`  renderMethod: "css",`)
    lines.push(`  style: ${JSON.stringify(p.satoriStyle, null, 4).replace(/\n/g, "\n  ")},`)
    lines.push(`}`)
    lines.push(``)
  }

  const outDir = path.join(process.cwd(), "packages", "satori-patterns", "src", "patterns")
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `${category}.ts`)
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8")
}

function main(): void {
  const onlyChanged = process.argv.includes("--only-changed")

  let changedIds: Set<string> | null = null
  if (onlyChanged) {
    const diffPath = path.join(process.cwd(), "scripts", "diff-report.json")
    if (!fs.existsSync(diffPath)) {
      console.error("[translate] --only-changed requires scripts/diff-report.json")
      process.exit(1)
    }
    const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"))
    changedIds = new Set([...(diff.added ?? []), ...(diff.modified ?? [])])
    console.log(`[translate] --only-changed: processing ${changedIds.size} patterns`)
  }

  const allPatterns = loadPatternsFromVendor()
  const manifest = readManifest()
  const now = new Date().toISOString()

  let translated = 0
  let skipped = 0
  let svgFallback = 0
  let parseErrors = 0

  for (const p of allPatterns) {
    if (changedIds && !changedIds.has(p.id)) continue

    const scan = featureScanner(p.style as PatternStyleInput, p.id)

    // Find existing manifest entry or create new one
    const existing = manifest.patterns.find((mp) => mp.id === p.id)

    if (scan.preliminaryStatus === "SKIP") {
      const entry: CompatibilityPattern = {
        id: p.id,
        name: p.name,
        category: p.category,
        status: "SKIP",
        skipReason: scan.skipReason,
        renderMethod: "none",
        features: scan.features,
        preliminaryStatus: scan.preliminaryStatus,
        satoriStyle: null,
        satoriVersion: "0.19.2",
        suitableForSocialBg: existing?.suitableForSocialBg ?? null,
        notes: [`skip-reason:${scan.skipReason}`],
        updatedAt: now,
      }
      upsertPattern(manifest, entry)
      skipped++
      continue
    }

    if (scan.preliminaryStatus === "SVG_FALLBACK_REQUIRED") {
      const entry: CompatibilityPattern = {
        id: p.id,
        name: p.name,
        category: p.category,
        status: "SVG_FALLBACK_REQUIRED",
        skipReason: null,
        renderMethod: "svg-fallback",
        features: scan.features,
        preliminaryStatus: scan.preliminaryStatus,
        satoriStyle: null,
        satoriVersion: "0.19.2",
        suitableForSocialBg: existing?.suitableForSocialBg ?? null,
        notes: [],
        updatedAt: now,
      }
      upsertPattern(manifest, entry)
      svgFallback++
      continue
    }

    // CSS_TRANSLATE_CANDIDATE — attempt translation
    const { satoriStyle, notes } = translateToSatoriStyle(p.style)

    if (!satoriStyle) {
      const entry: CompatibilityPattern = {
        id: p.id,
        name: p.name,
        category: p.category,
        status: "SKIP",
        skipReason: "parse-error",
        renderMethod: "none",
        features: scan.features,
        preliminaryStatus: scan.preliminaryStatus,
        satoriStyle: null,
        satoriVersion: "0.19.2",
        suitableForSocialBg: existing?.suitableForSocialBg ?? null,
        notes,
        updatedAt: now,
      }
      upsertPattern(manifest, entry)
      parseErrors++
      continue
    }

    // Successfully translated — status will be confirmed by render-all.ts
    // For now mark as UNCLASSIFIED (awaiting render verification)
    const entry: CompatibilityPattern = {
      id: p.id,
      name: p.name,
      category: p.category,
      status: existing?.status === "PASS" || existing?.status === "PARTIAL" ? existing.status : "UNCLASSIFIED",
      skipReason: null,
      renderMethod: "css",
      features: scan.features,
      preliminaryStatus: scan.preliminaryStatus,
      satoriStyle: satoriStyle as Record<string, unknown>,
      satoriVersion: "0.19.2",
      suitableForSocialBg: existing?.suitableForSocialBg ?? null,
      notes,
      updatedAt: now,
    }
    upsertPattern(manifest, entry)
    translated++
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  // Write category files
  for (const cat of CATEGORIES) {
    writeCategoryFile(cat, manifest.patterns)
  }

  console.log(`[translate] Summary:`)
  console.log(`  translated (css): ${translated}`)
  console.log(`  skipped: ${skipped}`)
  console.log(`  svg-fallback: ${svgFallback}`)
  console.log(`  parse-errors: ${parseErrors}`)
  console.log(`  total: ${allPatterns.length}`)
}

main()
