import fs from "node:fs"
import path from "node:path"
import Ajv from "ajv"
import addFormats from "ajv-formats"

export type PatternCategory = "gradients" | "geometric" | "decorative" | "effects"
export type PatternStatus =
  | "PASS"
  | "PARTIAL"
  | "FAIL"
  | "SILENT_FAIL"
  | "SVG_FALLBACK_REQUIRED"
  | "SKIP"
  | "DEPRECATED"
  | "UNCLASSIFIED"

export type SkipReason =
  | "conic-gradient"
  | "backdrop-filter"
  | "animation"
  | "pseudo-element"
  | "canvas"
  | "blend-mode"
  | "css-filter"
  | "background-clip"
  | "unresolved-var"
  | "unsupported-calc"
  | "unknown-feature"
  | "parse-error"
  | "mask"
  | "background-attachment"
  | "unsupported-color"
  | null

export interface CompatibilityPattern {
  id: string
  name: string
  category: PatternCategory
  status: PatternStatus
  skipReason: SkipReason
  renderMethod: "css" | "svg-fallback" | "none"
  features: string[]
  preliminaryStatus: string | null
  satoriStyle: Record<string, unknown> | null
  satoriVersion: string
  suitableForSocialBg: boolean | null
  notes: string[]
  updatedAt: string
}

export interface CompatibilityManifest {
  meta: {
    upstreamCommitSha: string
    generatedAt: string
    satoriVersion: string
  }
  patterns: CompatibilityPattern[]
}

const ROOT = process.cwd()
const MANIFEST_PATH = path.join(ROOT, "compatibility.json")
const SCHEMA_PATH = path.join(ROOT, "compatibility.schema.json")

export function readManifest(): CompatibilityManifest {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf8")
  const parsed = JSON.parse(raw) as CompatibilityManifest
  validateManifest(parsed)
  return parsed
}

export function writeManifest(manifest: CompatibilityManifest): void {
  validateManifest(manifest)
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8")
}

export function validateManifest(manifest: unknown): void {
  const schemaRaw = fs.readFileSync(SCHEMA_PATH, "utf8")
  const schema = JSON.parse(schemaRaw)

  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)

  const ok = validate(manifest)
  if (!ok) {
    const messages = (validate.errors ?? [])
      .map((e) => `${e.instancePath || "/"} ${e.message}`)
      .join("; ")
    throw new Error(`compatibility.json validation failed: ${messages}`)
  }
}

export function upsertPattern(
  manifest: CompatibilityManifest,
  pattern: CompatibilityPattern
): void {
  const idx = manifest.patterns.findIndex((p) => p.id === pattern.id)
  if (idx >= 0) {
    manifest.patterns[idx] = pattern
  } else {
    manifest.patterns.push(pattern)
  }
}

export function sortManifestPatternsStable(manifest: CompatibilityManifest): void {
  manifest.patterns.sort((a, b) => {
    const cat = a.category.localeCompare(b.category)
    if (cat !== 0) return cat
    return a.name.localeCompare(b.name)
  })
}