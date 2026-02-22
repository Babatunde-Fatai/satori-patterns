import fs from "node:fs"
import path from "node:path"
import { Resvg } from "@resvg/resvg-js"
import {
  readManifest,
  writeManifest,
  sortManifestPatternsStable,
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

function main(): void {
  const manifest = readManifest()
  const now = new Date().toISOString()
  let scored = 0

  for (const p of manifest.patterns) {
    if (p.status !== "PASS" && p.status !== "PARTIAL") continue

    const thumbPath = path.join(THUMB_DIR, `${p.id}.png`)
    const score = scoreLuminanceVariance(thumbPath)

    if (score === null) continue

    if (score > 65) {
      p.suitableForSocialBg = true
    } else if (score < 35) {
      p.suitableForSocialBg = false
    } else {
      p.suitableForSocialBg = null // needs manual review
    }

    p.updatedAt = now
    scored++
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  const suitable = manifest.patterns.filter((p) => p.suitableForSocialBg === true).length
  const notSuitable = manifest.patterns.filter((p) => p.suitableForSocialBg === false).length
  const unreviewed = manifest.patterns.filter((p) => p.suitableForSocialBg === null).length

  console.log(`[score-social-bg] Scored ${scored} patterns`)
  console.log(`  Suitable: ${suitable}`)
  console.log(`  Not suitable: ${notSuitable}`)
  console.log(`  Needs review: ${unreviewed}`)
}

main()
