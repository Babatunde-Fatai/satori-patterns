/**
 * HISTORICAL RECOVERY SCRIPT — 2026-02-21 batch only.
 *
 * This script was a one-time workaround for a pipeline ordering failure that
 * occurred during the initial 2026-02-21 render run: render-all.ts detected
 * SILENT_FAIL patterns correctly but did not write the status to the manifest
 * before the pipeline continued, leaving 31 patterns as UNCLASSIFIED.
 *
 * As of the fix applied 2026-02-22, render-all.ts writes `entry.status`
 * atomically in the same batch loop where pixels are analysed, so this script
 * is NO LONGER NEEDED for new render runs.
 *
 * DO NOT add this to pipeline:full or any automated pipeline.
 * Only run manually if recovering from a specific pipeline ordering failure
 * where render-all.ts ran but crashed before writing the manifest.
 */
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
