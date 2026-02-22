import {
  readManifest,
  writeManifest,
  sortManifestPatternsStable,
} from "./utils/manifest"

/**
 * Patch: Set UNCLASSIFIED patterns that have satoriStyle + satoriVersion
 * (meaning they were rendered) but never had their status updated to SILENT_FAIL.
 * These patterns produced blank/low-variance output during render-all.
 */
function main(): void {
  const manifest = readManifest()
  const now = new Date().toISOString()
  let patched = 0

  for (const p of manifest.patterns) {
    if (
      p.status === "UNCLASSIFIED" &&
      p.satoriStyle != null &&
      p.satoriVersion !== "" &&
      p.renderMethod === "css"
    ) {
      p.status = "SILENT_FAIL"
      p.notes = [...new Set([...p.notes, "silent-fail-detected:low-variance"])]
      p.updatedAt = now
      patched++
    }
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  console.log(`[patch-silent-fails] Patched ${patched} UNCLASSIFIED → SILENT_FAIL`)
}

main()
