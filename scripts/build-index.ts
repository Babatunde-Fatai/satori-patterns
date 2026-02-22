import fs from "node:fs"
import path from "node:path"
import { readManifest } from "./utils/manifest"
import type { PatternCategory } from "./utils/manifest"

function toCamelCase(id: string): string {
  return id
    .toLowerCase()
    .replace(/[\s-]+([a-z0-9])/g, (_, c) => c.toUpperCase())
}

function toPascalCase(id: string): string {
  const camel = toCamelCase(id)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function main(): void {
  const manifest = readManifest()

  const eligible = manifest.patterns.filter(
    (p) =>
      (p.status === "PASS" || p.status === "PARTIAL") &&
      (p.renderMethod === "css" || p.renderMethod === "svg-fallback")
  )

  const byCategory: Record<PatternCategory, typeof eligible> = {
    gradients: eligible.filter((p) => p.category === "gradients"),
    geometric: eligible.filter((p) => p.category === "geometric"),
    decorative: eligible.filter((p) => p.category === "decorative"),
    effects: eligible.filter((p) => p.category === "effects"),
  }

  const seen = new Set<string>()
  for (const p of eligible) {
    const name = toCamelCase(p.id)
    if (seen.has(name)) {
      throw new Error(`Duplicate export identifier generated: ${name}`)
    }
    seen.add(name)
  }

  const lines: string[] = []
  lines.push(`/* AUTO-GENERATED FILE. DO NOT EDIT. */`)
  lines.push(`export * from "./types"`)
  lines.push(``)

  // Named imports from category files for array construction
  const categories: PatternCategory[] = ["decorative", "effects", "geometric", "gradients"]
  for (const cat of categories) {
    const names = byCategory[cat].filter((p) => p.renderMethod === "css").map((p) => toCamelCase(p.id))
    if (names.length > 0) {
      lines.push(`import {`)
      for (const n of names) {
        lines.push(`  ${n},`)
      }
      lines.push(`} from "./patterns/${cat}"`)
    }
  }
  lines.push(``)

  // Re-export category modules
  for (const cat of categories) {
    lines.push(`export * from "./patterns/${cat}"`)
  }
  lines.push(``)

  // SVG fallback component exports
  const fallbackPatterns = eligible.filter((p) => p.renderMethod === "svg-fallback")
  for (const p of fallbackPatterns) {
    lines.push(`export { ${toPascalCase(p.id)} } from "./svg-fallbacks/${p.id}"`)
  }
  if (fallbackPatterns.length) lines.push(``)

  // Import SVG fallback patterns for array inclusion
  // (SVG fallbacks export components, not SatoriPattern objects, so skip them in arrays for now)

  // Arrays of CSS-rendered patterns
  const cssPatterns = eligible.filter((p) => p.renderMethod === "css")
  const allNames = cssPatterns.map((p) => toCamelCase(p.id))
  const gradients = byCategory.gradients.filter((p) => p.renderMethod === "css").map((p) => toCamelCase(p.id))
  const geometric = byCategory.geometric.filter((p) => p.renderMethod === "css").map((p) => toCamelCase(p.id))
  const decorative = byCategory.decorative.filter((p) => p.renderMethod === "css").map((p) => toCamelCase(p.id))
  const effects = byCategory.effects.filter((p) => p.renderMethod === "css").map((p) => toCamelCase(p.id))

  lines.push(`export const allPatterns = [`)
  for (const n of allNames) {
    lines.push(`  ${n},`)
  }
  lines.push(`]`)
  lines.push(``)

  lines.push(`export const gradientPatterns = [${gradients.join(", ")}]`)
  lines.push(`export const geometricPatterns = [${geometric.join(", ")}]`)
  lines.push(`export const decorativePatterns = [${decorative.join(", ")}]`)
  lines.push(`export const effectsPatterns = [${effects.join(", ")}]`)
  lines.push(``)

  const outPath = path.join(
    process.cwd(),
    "packages",
    "satori-patterns",
    "src",
    "index.ts"
  )
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8")

  console.log(`[build-index] Wrote ${outPath} (${eligible.length} eligible patterns, ${cssPatterns.length} CSS, ${fallbackPatterns.length} SVG fallback)`)
}

main()
