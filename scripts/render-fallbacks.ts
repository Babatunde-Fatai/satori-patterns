import fs from "node:fs"
import path from "node:path"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import {
  readManifest,
  writeManifest,
  sortManifestPatternsStable,
} from "./utils/manifest"

// Import SVG fallback components
import { DotGrid } from "../packages/satori-patterns/src/svg-fallbacks/dot-grid"
import { LineGrid } from "../packages/satori-patterns/src/svg-fallbacks/line-grid"
import { DiagonalCrosshatch } from "../packages/satori-patterns/src/svg-fallbacks/diagonal-crosshatch"
import { HalftoneRadialDots } from "../packages/satori-patterns/src/svg-fallbacks/halftone-radial-dots"
import { NoiseGrain } from "../packages/satori-patterns/src/svg-fallbacks/noise-grain"

const FONT_PATH = path.join(process.cwd(), "scripts", "assets", "Inter.ttf")
const THUMB_DIR = path.join(process.cwd(), "apps", "browser", "public", "thumbnails")
const RENDER_WIDTH = 1200
const RENDER_HEIGHT = 630
const THUMB_WIDTH = 600

const componentMap: Record<string, (props: Record<string, unknown>) => React.ReactElement> = {
  "dot-grid": DotGrid as unknown as (props: Record<string, unknown>) => React.ReactElement,
  "line-grid": LineGrid as unknown as (props: Record<string, unknown>) => React.ReactElement,
  "diagonal-crosshatch": DiagonalCrosshatch as unknown as (props: Record<string, unknown>) => React.ReactElement,
  "halftone-radial-dots": HalftoneRadialDots as unknown as (props: Record<string, unknown>) => React.ReactElement,
  "noise-grain": NoiseGrain as unknown as (props: Record<string, unknown>) => React.ReactElement,
}

async function main(): Promise<void> {
  if (!fs.existsSync(FONT_PATH)) {
    console.error(`[render-fallbacks] FATAL: Font missing at ${FONT_PATH}`)
    process.exit(1)
  }

  const fontData = fs.readFileSync(FONT_PATH)
  const manifest = readManifest()
  const now = new Date().toISOString()

  fs.mkdirSync(THUMB_DIR, { recursive: true })

  const fallbackIds = Object.keys(componentMap)
  let pass = 0
  let partial = 0
  let fail = 0

  for (const id of fallbackIds) {
    const Component = componentMap[id]
    const entry = manifest.patterns.find((p) => p.id === id)
    if (!entry) {
      console.warn(`[render-fallbacks] Pattern ${id} not in manifest, skipping`)
      continue
    }

    try {
      const element = Component({ width: RENDER_WIDTH, height: RENDER_HEIGHT })

      const svgStr = await satori(element, {
        width: RENDER_WIDTH,
        height: RENDER_HEIGHT,
        fonts: [
          {
            name: "Inter",
            data: fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength),
            weight: 400,
            style: "normal",
          },
        ],
      })

      const resvg = new Resvg(svgStr, {
        fitTo: { mode: "width", value: THUMB_WIDTH },
      })
      const rendered = resvg.render()
      const png = Buffer.from(rendered.asPng())

      const thumbPath = path.join(THUMB_DIR, `${id}.png`)
      fs.writeFileSync(thumbPath, png)

      entry.status = "PASS"
      entry.renderMethod = "svg-fallback"
      entry.notes = [...new Set([...entry.notes, "rendered-via-svg-fallback"])]
      entry.updatedAt = now
      pass++

      console.log(`  [PASS] ${id} (${png.byteLength} bytes)`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      entry.status = "PARTIAL"
      entry.notes = [...new Set([...entry.notes, `render-error:${msg.slice(0, 200)}`])]
      entry.updatedAt = now

      // Try to at least note the issue
      if (msg.includes("filter") || msg.includes("feTurbulence")) {
        entry.notes.push("svg-noise-filter-variance")
        partial++
        console.log(`  [PARTIAL] ${id}: ${msg.slice(0, 100)}`)
      } else {
        fail++
        console.log(`  [FAIL] ${id}: ${msg.slice(0, 100)}`)
      }
    }
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  console.log(`[render-fallbacks] Summary: PASS=${pass}, PARTIAL=${partial}, FAIL=${fail}`)
}

main().catch((err) => {
  console.error("[render-fallbacks] Fatal:", err)
  process.exit(1)
})
