import { readManifest } from "./utils/manifest"

function main(): void {
  const manifest = readManifest()
  console.log(
    `[validate-manifest] OK: ${manifest.patterns.length} patterns, generatedAt=${manifest.meta.generatedAt}`
  )
}

main()