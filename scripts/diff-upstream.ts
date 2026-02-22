import fs from "node:fs"
import path from "node:path"

/**
 * Compare vendor/patterns.ts (our snapshot) with src/data/patterns.ts (upstream).
 * Outputs diff-report.json with added/removed/modified pattern IDs.
 *
 * Usage: npx tsx scripts/diff-upstream.ts
 */

const VENDOR_PATH = path.join(process.cwd(), "vendor", "patterns.ts")
const UPSTREAM_PATH = path.join(process.cwd(), "src", "data", "patterns.ts")
const REPORT_PATH = path.join(process.cwd(), "scripts", "diff-report.json")

interface PatternEntry {
  id: string
  name: string
  style: string // raw CSS style block as string for diffing
}

function extractPatterns(source: string): PatternEntry[] {
  const results: PatternEntry[] = []
  const idRe = /id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/g
  let match: RegExpExecArray | null = null

  while ((match = idRe.exec(source)) !== null) {
    const id = match[1]
    const name = match[2]
    // Find the style block after this id/name — look for `style:` then match braces
    const after = source.slice(match.index + match[0].length)
    const styleIdx = after.indexOf("style:")
    if (styleIdx === -1) continue
    const braceStart = after.indexOf("{", styleIdx)
    if (braceStart === -1) continue

    let depth = 0
    let end = braceStart
    for (let i = braceStart; i < after.length; i++) {
      if (after[i] === "{") depth++
      else if (after[i] === "}") {
        depth--
        if (depth === 0) {
          end = i + 1
          break
        }
      }
    }

    const styleBlock = after.slice(braceStart, end).replace(/\s+/g, " ").trim()
    results.push({ id, name, style: styleBlock })
  }

  return results
}

function main(): void {
  if (!fs.existsSync(VENDOR_PATH)) {
    console.error(`[diff-upstream] vendor/patterns.ts not found`)
    process.exit(1)
  }
  if (!fs.existsSync(UPSTREAM_PATH)) {
    console.error(`[diff-upstream] src/data/patterns.ts not found`)
    process.exit(1)
  }

  const vendorSource = fs.readFileSync(VENDOR_PATH, "utf8")
  const upstreamSource = fs.readFileSync(UPSTREAM_PATH, "utf8")

  const vendorPatterns = extractPatterns(vendorSource)
  const upstreamPatterns = extractPatterns(upstreamSource)

  const vendorMap = new Map(vendorPatterns.map((p) => [p.id, p]))
  const upstreamMap = new Map(upstreamPatterns.map((p) => [p.id, p]))

  const added: string[] = []
  const removed: string[] = []
  const modified: string[] = []

  // Find added and modified
  for (const [id, upEntry] of upstreamMap) {
    const vendorEntry = vendorMap.get(id)
    if (!vendorEntry) {
      added.push(id)
    } else if (vendorEntry.style !== upEntry.style) {
      modified.push(id)
    }
  }

  // Find removed
  for (const id of vendorMap.keys()) {
    if (!upstreamMap.has(id)) {
      removed.push(id)
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    vendorCount: vendorPatterns.length,
    upstreamCount: upstreamPatterns.length,
    added: added.sort(),
    removed: removed.sort(),
    modified: modified.sort(),
    unchanged: upstreamPatterns.length - added.length - modified.length,
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n")

  console.log(`[diff-upstream] Diff report:`)
  console.log(`  Vendor: ${report.vendorCount} patterns`)
  console.log(`  Upstream: ${report.upstreamCount} patterns`)
  console.log(`  Added: ${added.length}`)
  console.log(`  Removed: ${removed.length}`)
  console.log(`  Modified: ${modified.length}`)
  console.log(`  Unchanged: ${report.unchanged}`)
  console.log(`  Report saved to ${REPORT_PATH}`)
}

main()
