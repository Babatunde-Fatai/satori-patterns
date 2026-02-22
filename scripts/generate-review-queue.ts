import fs from "node:fs"
import path from "node:path"
import { readManifest } from "./utils/manifest"

function main(): void {
  const manifest = readManifest()
  const unreviewed = manifest.patterns
    .filter((p) => p.suitableForSocialBg === null)
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
    .map((p) => p.id)

  const outPath = path.join(process.cwd(), "scripts", "review-queue.txt")
  fs.writeFileSync(outPath, unreviewed.join("\n") + "\n", "utf8")

  console.log(`[review-queue] Wrote ${unreviewed.length} pattern IDs to review-queue.txt`)
}

main()
