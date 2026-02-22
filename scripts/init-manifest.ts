import fs from "node:fs"
import path from "node:path"
import { featureScanner, type PatternStyleInput } from "./classify"
import {
  writeManifest,
  sortManifestPatternsStable,
  type CompatibilityManifest,
  type CompatibilityPattern,
  type PatternCategory,
} from "./utils/manifest"

interface UpstreamPattern {
  id: string
  name: string
  category: PatternCategory
  style: Record<string, unknown>
}

async function loadPatterns(): Promise<UpstreamPattern[]> {
  const filePath = path.join(process.cwd(), "src", "data", "patterns.ts")
  const content = fs.readFileSync(filePath, "utf8")

  // Extract pattern objects using regex — the file exports `gridPatterns: Pattern[]`
  const patterns: UpstreamPattern[] = []
  const idRegex = /id:\s*"([^"]+)"/g
  const nameRegex = /name:\s*"([^"]+)"/g
  const categoryRegex = /category:\s*"([^"]+)"/g

  // Find all pattern blocks by locating each `{` after array items
  // We'll parse sequentially: for each id match, grab the next name and category
  const ids: string[] = []
  const names: string[] = []
  const categories: string[] = []

  let match: RegExpExecArray | null
  while ((match = idRegex.exec(content))) ids.push(match[1])
  while ((match = nameRegex.exec(content))) names.push(match[1])
  while ((match = categoryRegex.exec(content))) categories.push(match[1])

  if (ids.length !== names.length || ids.length !== categories.length) {
    throw new Error(
      `Pattern count mismatch: ids=${ids.length}, names=${names.length}, categories=${categories.length}`
    )
  }

  // Now extract style objects for each pattern
  // Split content into pattern blocks
  const patternBlocks = content.split(/\n\s*\{[\s\n]*id:/).slice(1)
  // First block includes the initial part before the first `id:`
  const firstIdIdx = content.indexOf("id:")
  const preamble = content.slice(0, firstIdIdx)
  const firstBlock = content.slice(firstIdIdx)

  // Re-split to get all blocks cleanly
  const allBlocks: string[] = []
  let currentIdx = 0
  for (let i = 0; i < ids.length; i++) {
    const searchStart = i === 0 ? 0 : currentIdx
    const idStr = `id: "${ids[i]}"`
    const blockStart = content.indexOf(idStr, searchStart)
    if (blockStart < 0) {
      throw new Error(`Could not find block for pattern id: ${ids[i]}`)
    }
    // Find the end of this block - next `id:` or end of content
    const nextIdStr = i < ids.length - 1 ? `id: "${ids[i + 1]}"` : null
    const blockEnd = nextIdStr
      ? content.indexOf(nextIdStr, blockStart + idStr.length)
      : content.length
    allBlocks.push(content.slice(blockStart, blockEnd))
    currentIdx = blockEnd
  }

  for (let i = 0; i < ids.length; i++) {
    const block = allBlocks[i]
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

function extractStyle(block: string): Record<string, unknown> {
  // Find the style: { ... } block
  const styleStart = block.indexOf("style:")
  if (styleStart < 0) return {}

  // Find the opening brace after `style:`
  const braceStart = block.indexOf("{", styleStart)
  if (braceStart < 0) return {}

  // Find matching closing brace
  let depth = 0
  let end = braceStart
  for (let i = braceStart; i < block.length; i++) {
    if (block[i] === "{") depth++
    else if (block[i] === "}") {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }

  const styleStr = block.slice(braceStart, end + 1)

  // Parse the style object manually — it's JS object literal, not JSON
  // Convert to something parseable
  const result: Record<string, string> = {}

  // Match key: value pairs (handling multiline template literals and quotes)
  // Keys can be camelCase, values can be strings
  const propRegex =
    /(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)/g
  let propMatch: RegExpExecArray | null
  while ((propMatch = propRegex.exec(styleStr))) {
    const key = propMatch[1]
    const value = propMatch[2] ?? propMatch[3] ?? propMatch[4] ?? ""
    result[key] = value
  }

  return result
}

function main(): void {
  const patternsData = (() => {
    try {
      return loadPatternsSync()
    } catch {
      throw new Error("Failed to load patterns")
    }
  })()

  const now = new Date().toISOString()
  const commitSha = "17a4d3c7b5c923e52dfd4d32420aa9ca3bdfa41e"

  const manifest: CompatibilityManifest = {
    meta: {
      upstreamCommitSha: commitSha,
      generatedAt: now,
      satoriVersion: "0.19.2",
    },
    patterns: [],
  }

  for (const p of patternsData) {
    const scanResult = featureScanner(p.style as PatternStyleInput, p.id)

    let status: CompatibilityPattern["status"]
    let renderMethod: CompatibilityPattern["renderMethod"]
    let skipReason = scanResult.skipReason

    if (scanResult.preliminaryStatus === "SKIP") {
      status = "SKIP"
      renderMethod = "none"
    } else if (scanResult.preliminaryStatus === "SVG_FALLBACK_REQUIRED") {
      status = "SVG_FALLBACK_REQUIRED"
      renderMethod = "svg-fallback"
    } else if (scanResult.preliminaryStatus === "UNCLASSIFIED") {
      status = "UNCLASSIFIED"
      renderMethod = "none"
    } else {
      status = "UNCLASSIFIED" // Will be resolved by translate + render
      renderMethod = "css"
    }

    const entry: CompatibilityPattern = {
      id: p.id,
      name: p.name,
      category: p.category,
      status,
      skipReason,
      renderMethod,
      features: scanResult.features,
      preliminaryStatus: scanResult.preliminaryStatus,
      satoriStyle: null,
      satoriVersion: "0.19.2",
      suitableForSocialBg: null,
      notes: [],
      updatedAt: now,
    }

    manifest.patterns.push(entry)
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  // Summary
  const counts: Record<string, number> = {}
  for (const p of manifest.patterns) {
    counts[p.status] = (counts[p.status] ?? 0) + 1
  }

  console.log(`[init-manifest] Initialized ${manifest.patterns.length} patterns`)
  console.log("[init-manifest] Status counts:", JSON.stringify(counts))

  const catCounts: Record<string, number> = {}
  for (const p of manifest.patterns) {
    catCounts[p.category] = (catCounts[p.category] ?? 0) + 1
  }
  console.log("[init-manifest] Category counts:", JSON.stringify(catCounts))
}

function loadPatternsSync(): UpstreamPattern[] {
  const filePath = path.join(process.cwd(), "src", "data", "patterns.ts")
  const content = fs.readFileSync(filePath, "utf8")

  const patterns: UpstreamPattern[] = []

  // Find all pattern objects by their `id:` field
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
    throw new Error(
      `Pattern count mismatch: ids=${ids.length}, names=${names.length}, categories=${categories.length}`
    )
  }

  // Extract style objects for each pattern
  for (let i = 0; i < ids.length; i++) {
    const idStr = `id: "${ids[i]}"`
    const searchStart = i === 0 ? 0 : content.indexOf(`id: "${ids[i - 1]}"`) + 1
    const blockStart = content.indexOf(idStr, searchStart)

    const nextIdStr = i < ids.length - 1 ? `id: "${ids[i + 1]}"` : null
    let blockEnd: number
    if (nextIdStr) {
      blockEnd = content.indexOf(nextIdStr, blockStart + idStr.length)
      if (blockEnd < 0) blockEnd = content.length
    } else {
      blockEnd = content.length
    }

    const block = content.slice(blockStart, blockEnd)
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

main()
