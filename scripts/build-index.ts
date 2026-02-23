/**
 * build-index.ts
 * Generates packages/satori-patterns/src/index.ts from data/approved.json.
 * Only patterns in approved.json are exported — nothing more, nothing less.
 * Do NOT change this to read from compatibility.json. approved.json is the
 * authoritative source of what ships in the NPM package.
 */
import fs from "node:fs"
import path from "node:path"

// We still need the category type from manifest for type safety
type PatternCategory = "gradients" | "geometric" | "decorative" | "effects"

interface ApprovedPattern {
  id: string
  name: string
  category: string
  approvedAt: string
  satoriStyle: Record<string, unknown> | null
  renderMethod: string
  notes: string[]
}

interface ApprovedFile {
  meta: { updatedAt: string; count: number }
  patterns: ApprovedPattern[]
}

function readApproved(): ApprovedFile {
  const p = path.join(process.cwd(), "data", "approved.json")
  return JSON.parse(fs.readFileSync(p, "utf8")) as ApprovedFile
}

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
  const approved = readApproved()
  const eligible = approved.patterns

  if (eligible.length === 0) {
    console.log("[build-index] No approved patterns in data/approved.json — writing empty index")
  }

  // Validate no duplicate export identifiers
  const seen = new Set<string>()
  for (const p of eligible) {
    const name = toCamelCase(p.id)
    if (seen.has(name)) {
      throw new Error(`Duplicate export identifier generated: ${name} (from id: ${p.id})`)
    }
    seen.add(name)
  }

  const byCategory: Record<PatternCategory, typeof eligible> = {
    gradients: eligible.filter((p) => p.category === "gradients"),
    geometric: eligible.filter((p) => p.category === "geometric"),
    decorative: eligible.filter((p) => p.category === "decorative"),
    effects: eligible.filter((p) => p.category === "effects"),
  }

  const lines: string[] = []
  lines.push(`/* AUTO-GENERATED FILE. DO NOT EDIT. */`)
  lines.push(`/* Source: data/approved.json (${eligible.length} approved patterns) */`)
  lines.push(`export * from "./types"`)
  lines.push(``)

  // Named imports from category files for array construction (CSS only)
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

  console.log(`[build-index] Wrote ${outPath} (${eligible.length} approved patterns, ${cssPatterns.length} CSS, ${fallbackPatterns.length} SVG fallback)`)
}

main()
