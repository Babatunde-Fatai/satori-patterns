import fs from "node:fs"
import path from "node:path"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import {
  readManifest,
  writeManifest,
  sortManifestPatternsStable,
  type CompatibilityPattern,
} from "./utils/manifest"

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE ?? "15", 10)
const BATCH_DELAY_MS = parseInt(process.env.BATCH_DELAY_MS ?? "100", 10)
const RENDER_TIMEOUT_MS = parseInt(process.env.RENDER_TIMEOUT_MS ?? "10000", 10)
const RENDER_WIDTH = 1200
const RENDER_HEIGHT = 630
const THUMB_WIDTH = 600
const THUMB_HEIGHT = 315

const FONT_PATH = path.join(process.cwd(), "scripts", "assets", "Inter.ttf")
const THUMB_DIR = path.join(process.cwd(), "apps", "browser", "public", "thumbnails")

function loadFont(): ArrayBuffer {
  if (!fs.existsSync(FONT_PATH)) {
    console.error(`[render-all] FATAL: Font file missing at ${FONT_PATH}`)
    process.exit(1)
  }
  const buf = fs.readFileSync(FONT_PATH)
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

function buildSatoriElement(style: Record<string, unknown>): React.ReactNode {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        ...style,
      },
      children: [],
    },
  } as unknown as React.ReactNode
}

async function renderPattern(
  pattern: CompatibilityPattern,
  fontData: ArrayBuffer
): Promise<{ png: Buffer; svgStr: string; pixels: Uint8Array; pixelWidth: number; pixelHeight: number }> {
  const element = buildSatoriElement(pattern.satoriStyle ?? {})

  const svgStr = await satori(element as React.ReactElement, {
    width: RENDER_WIDTH,
    height: RENDER_HEIGHT,
    fonts: [
      {
        name: "Inter",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  })

  const resvg = new Resvg(svgStr, {
    fitTo: { mode: "width", value: THUMB_WIDTH },
  })
  const rendered = resvg.render()
  const png = rendered.asPng()

  return {
    png: Buffer.from(png),
    svgStr,
    pixels: rendered.pixels,
    pixelWidth: rendered.width,
    pixelHeight: rendered.height,
  }
}

function detectSilentFail(
  pixels: Uint8Array,
  width: number,
  height: number
): boolean {
  // Rule D-5/D-6: Detect effectively blank output
  // Sample at least 100 pixels across the image
  const totalPixels = width * height
  const step = Math.max(1, Math.floor(totalPixels / 200))
  let whiteCount = 0
  let blackCount = 0
  let alphaEmptyCount = 0
  let sampleCount = 0
  let lumSum = 0
  let lumSqSum = 0

  for (let i = 0; i < totalPixels; i += step) {
    const offset = i * 4
    if (offset + 3 >= pixels.length) break
    const r = pixels[offset]
    const g = pixels[offset + 1]
    const b = pixels[offset + 2]
    const a = pixels[offset + 3]

    sampleCount++

    if (a < 10) {
      alphaEmptyCount++
      continue
    }

    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    lumSum += lum
    lumSqSum += lum * lum

    if (r >= 250 && g >= 250 && b >= 250) whiteCount++
    if (r <= 5 && g <= 5 && b <= 5) blackCount++
  }

  if (sampleCount === 0) return true

  const pctWhite = whiteCount / sampleCount
  const pctAlphaEmpty = alphaEmptyCount / sampleCount

  // Only flag as silent fail for truly blank output
  if (pctWhite > 0.95) return true
  if (pctAlphaEmpty > 0.95) return true

  // Compute luminance variance — only flag very low variance
  const nonEmptySamples = sampleCount - alphaEmptyCount
  if (nonEmptySamples > 10) {
    const mean = lumSum / nonEmptySamples
    const variance = lumSqSum / nonEmptySamples - mean * mean
    // Very low threshold: patterns with dark backgrounds still have some variance
    if (variance < 2) return true
  }

  return false
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main(): Promise<void> {
  const onlyChanged = process.argv.includes("--only-changed")

  let changedIds: Set<string> | null = null
  if (onlyChanged) {
    const diffPath = path.join(process.cwd(), "scripts", "diff-report.json")
    if (!fs.existsSync(diffPath)) {
      console.error("[render-all] --only-changed requires scripts/diff-report.json")
      process.exit(1)
    }
    const diff = JSON.parse(fs.readFileSync(diffPath, "utf8"))
    changedIds = new Set([...(diff.added ?? []), ...(diff.modified ?? [])])
  }

  const fontData = loadFont()
  const manifest = readManifest()
  const now = new Date().toISOString()

  // Only render CSS patterns that have satoriStyle (UNCLASSIFIED after translate)
  const toRender = manifest.patterns.filter((p) => {
    if (changedIds && !changedIds.has(p.id)) return false
    return (
      p.renderMethod === "css" &&
      p.satoriStyle != null &&
      p.status !== "SKIP" &&
      p.status !== "DEPRECATED"
    )
  })

  console.log(`[render-all] Rendering ${toRender.length} CSS patterns (batch=${BATCH_SIZE})`)

  fs.mkdirSync(THUMB_DIR, { recursive: true })

  const counts = { PASS: 0, PARTIAL: 0, FAIL: 0, SILENT_FAIL: 0 }

  for (let i = 0; i < toRender.length; i += BATCH_SIZE) {
    const batch = toRender.slice(i, i + BATCH_SIZE)

    const results = await Promise.allSettled(
      batch.map(async (pattern) => {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("render-timeout")), RENDER_TIMEOUT_MS)
        )

        try {
          const { png, pixels, pixelWidth, pixelHeight } = await Promise.race([
            renderPattern(pattern, fontData),
            timeout,
          ])
          const thumbPath = path.join(THUMB_DIR, `${pattern.id}.png`)
          fs.writeFileSync(thumbPath, png)

          const isSilentFail = detectSilentFail(pixels, pixelWidth, pixelHeight)

          return {
            id: pattern.id,
            status: isSilentFail ? "SILENT_FAIL" as const : "PASS" as const,
            notes: isSilentFail ? ["silent-fail-detected:low-variance"] : [],
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          return {
            id: pattern.id,
            status: "FAIL" as const,
            notes: [`render-error:${msg.slice(0, 200)}`],
          }
        }
      })
    )

    for (const result of results) {
      if (result.status === "rejected") continue

      const { id, status, notes } = result.value
      const entry = manifest.patterns.find((p) => p.id === id)
      if (!entry) continue

      entry.status = status
      entry.notes = [...new Set([...entry.notes, ...notes])]
      entry.satoriVersion = `satori@${getSatoriVersion()}`
      entry.updatedAt = now
      counts[status]++
    }

    if (i + BATCH_SIZE < toRender.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  // Update manifest
  manifest.meta.satoriVersion = `satori@${getSatoriVersion()}`
  manifest.meta.generatedAt = now
  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  console.log(`[render-all] Render summary:`)
  console.log(`  PASS: ${counts.PASS}`)
  console.log(`  PARTIAL: ${counts.PARTIAL}`)
  console.log(`  FAIL: ${counts.FAIL}`)
  console.log(`  SILENT_FAIL: ${counts.SILENT_FAIL}`)
  console.log(`  Total rendered: ${toRender.length}`)
}

function getSatoriVersion(): string {
  try {
    const pkgPath = require.resolve("satori/package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
    return pkg.version ?? "unknown"
  } catch {
    return "unknown"
  }
}

main().catch((err) => {
  console.error("[render-all] Fatal error:", err)
  process.exit(1)
})
