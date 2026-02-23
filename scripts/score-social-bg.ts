import fs from "node:fs"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import {
  readManifest,
  writeManifest,
  sortManifestPatternsStable,
  type CompatibilityPattern,
} from "./utils/manifest"

const THUMB_DIR = path.join(process.cwd(), "apps", "browser", "public", "thumbnails")

function scoreLuminanceVariance(pngPath: string): number | null {
  try {
    if (!fs.existsSync(pngPath)) return null

    const pngBuf = fs.readFileSync(pngPath)
    // Wrap in SVG to decode via resvg
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="315"><image href="data:image/png;base64,${pngBuf.toString("base64")}" width="600" height="315"/></svg>`
    const resvg = new Resvg(svgStr, { fitTo: { mode: "width", value: 200 } })
    const rendered = resvg.render()
    const pixels = rendered.pixels
    const totalPixels = rendered.width * rendered.height
    const step = Math.max(1, Math.floor(totalPixels / 300))

    let lumSum = 0
    let lumSqSum = 0
    let count = 0

    for (let i = 0; i < totalPixels; i += step) {
      const offset = i * 4
      if (offset + 3 >= pixels.length) break
      const a = pixels[offset + 3]
      if (a < 10) continue
      const r = pixels[offset]
      const g = pixels[offset + 1]
      const b = pixels[offset + 2]
      const lum = 0.299 * r + 0.587 * g + 0.114 * b
      lumSum += lum
      lumSqSum += lum * lum
      count++
    }

    if (count < 10) return null
    const mean = lumSum / count
    const variance = lumSqSum / count - mean * mean
    // Normalize to 0-100 scale
    return Math.min(100, Math.sqrt(variance))
  } catch {
    return null
  }
}

/**
 * Check whether a gradient pattern has visible depth/movement.
 * A radial-gradient in backgroundImage qualifies as having depth.
 */
function gradientHasDepth(p: CompatibilityPattern): boolean {
  const bg = p.satoriStyle?.backgroundImage
  if (typeof bg !== "string") return false
  return bg.includes("radial-gradient")
}

/**
 * Check whether a geometric pattern has a small tile structure (< 64px in either dimension).
 * Small backgroundSize values indicate a repeating tile grid, which is a good social bg candidate.
 */
function hasSmallTileStructure(p: CompatibilityPattern): boolean {
  const size = p.satoriStyle?.backgroundSize
  if (typeof size !== "string") return false
  // 100% 100% means no tile repeat — not a structured pattern
  if (size === "100% 100%") return false
  const matches = size.match(/(\d+(?:\.\d+)?)px/g)
  if (!matches) return false
  return matches.some((m) => parseFloat(m) < 64)
}

/**
 * Category-aware social background scorer.
 *
 * The scorer's job is to NARROW the human review queue by confidently
 * eliminating obviously unsuitable patterns. It never auto-approves (never returns true).
 *
 * Returns:
 *   null  → send to human review queue
 *   false → confidently not suitable (auto-rejected, skip human review)
 */
function categoricalScore(p: CompatibilityPattern, variance: number | null): boolean | null {
  switch (p.category) {
    case "gradients": {
      // Dark gradients with low variance are still valid social media aesthetics.
      // Only reject completely flat single-colour outputs (no radial depth, near-zero variance).
      if (variance === null) return null
      if (gradientHasDepth(p)) {
        // Has a radial-gradient layer — potential visual depth → human review
        return null
      }
      // Flat gradient: no radial layer AND effectively zero variance → auto-reject
      if (variance < 5) return false
      // Everything else goes to human review
      return null
    }

    case "geometric": {
      // Grids and dot arrays have inherently low variance by design.
      // Do NOT penalize for low variance. Check tile structure instead.
      if (hasSmallTileStructure(p)) {
        // Discernible small tile → candidate for social bg → human review
        return null
      }
      // 100% 100% with no tile structure → flat fallback, no discernible pattern
      const size = p.satoriStyle?.backgroundSize
      if (size === "100% 100%") return false
      // Default: send to review (variance is irrelevant for geometric)
      return null
    }

    case "decorative":
    case "effects": {
      // Keep variance heuristic but with a lower auto-rejection threshold.
      // Old threshold was < 35 (too aggressive, rejected dark patterns incorrectly).
      // New threshold: only confidently reject truly featureless outputs (variance < 15).
      if (variance === null) return null
      if (variance < 15) return false
      // variance 15–100: needs human review (never auto-approve)
      return null
    }

    default:
      return null
  }
}

function main(): void {
  const manifest = readManifest()
  const now = new Date().toISOString()
  let scored = 0

  for (const p of manifest.patterns) {
    if (p.status !== "PASS" && p.status !== "PARTIAL") continue

    const thumbPath = path.join(THUMB_DIR, `${p.id}.png`)
    const variance = scoreLuminanceVariance(thumbPath)

    p.suitableForSocialBg = categoricalScore(p, variance)
    p.updatedAt = now
    scored++
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  const suitable = manifest.patterns.filter((p) => p.suitableForSocialBg === true).length
  const notSuitable = manifest.patterns.filter((p) => p.suitableForSocialBg === false).length
  const unreviewed = manifest.patterns.filter((p) => p.suitableForSocialBg === null).length

  console.log(`[score-social-bg] Scored ${scored} patterns (category-aware heuristic)`)
  console.log(`  Suitable (true):       ${suitable}`)
  console.log(`  Not suitable (false):  ${notSuitable}`)
  console.log(`  Needs review (null):   ${unreviewed}`)
}

main()
