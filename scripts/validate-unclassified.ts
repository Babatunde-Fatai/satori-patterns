/**
 * validate-unclassified.ts
 *
 * Post-render validation: exits non-zero if any UNCLASSIFIED pattern with
 * satoriStyle still exists in the manifest after render-all.ts runs.
 *
 * This means render-all.ts failed to classify one or more patterns.
 * Investigate render-all.ts output before continuing the pipeline.
 */
import { readManifest } from "./utils/manifest"

function main(): void {
  const manifest = readManifest()

  const unclassified = manifest.patterns.filter(
    (p) =>
      p.status === "UNCLASSIFIED" &&
      p.satoriStyle != null &&
      p.renderMethod === "css"
  )

  if (unclassified.length > 0) {
    console.error(
      `[validate-unclassified] FAIL: ${unclassified.length} UNCLASSIFIED pattern(s) with satoriStyle remain after render-all.`
    )
    console.error(
      `  IDs: ${unclassified.map((p) => p.id).join(", ")}`
    )
    console.error(
      `  render-all.ts did not classify these patterns. Do NOT run patch-silent-fails.ts as a fix — investigate the root cause.`
    )
    process.exit(1)
  }

  console.log(`[validate-unclassified] OK: no UNCLASSIFIED patterns with satoriStyle found`)
}

main()
