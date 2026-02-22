import {
  readManifest,
  writeManifest,
  upsertPattern,
  sortManifestPatternsStable,
  type CompatibilityPattern,
} from "./utils/manifest"

const now = new Date().toISOString()

const v1Fallbacks: CompatibilityPattern[] = [
  {
    id: "dot-grid",
    name: "Dot Grid",
    category: "geometric",
    status: "SVG_FALLBACK_REQUIRED",
    skipReason: null,
    renderMethod: "svg-fallback",
    features: ["tile-grid-repeat"],
    preliminaryStatus: "SVG_FALLBACK_REQUIRED",
    satoriStyle: null,
    satoriVersion: "0.19.2",
    suitableForSocialBg: null,
    notes: ["v1-priority-fallback"],
    updatedAt: now,
  },
  {
    id: "line-grid",
    name: "Line Grid",
    category: "geometric",
    status: "SVG_FALLBACK_REQUIRED",
    skipReason: null,
    renderMethod: "svg-fallback",
    features: ["tile-grid-repeat"],
    preliminaryStatus: "SVG_FALLBACK_REQUIRED",
    satoriStyle: null,
    satoriVersion: "0.19.2",
    suitableForSocialBg: null,
    notes: ["v1-priority-fallback"],
    updatedAt: now,
  },
  {
    id: "diagonal-crosshatch",
    name: "Diagonal Crosshatch",
    category: "geometric",
    status: "SVG_FALLBACK_REQUIRED",
    skipReason: null,
    renderMethod: "svg-fallback",
    features: ["tile-grid-repeat"],
    preliminaryStatus: "SVG_FALLBACK_REQUIRED",
    satoriStyle: null,
    satoriVersion: "0.19.2",
    suitableForSocialBg: null,
    notes: ["v1-priority-fallback"],
    updatedAt: now,
  },
  {
    id: "halftone-radial-dots",
    name: "Halftone Radial Dots",
    category: "decorative",
    status: "SVG_FALLBACK_REQUIRED",
    skipReason: null,
    renderMethod: "svg-fallback",
    features: ["tile-grid-repeat"],
    preliminaryStatus: "SVG_FALLBACK_REQUIRED",
    satoriStyle: null,
    satoriVersion: "0.19.2",
    suitableForSocialBg: null,
    notes: ["v1-priority-fallback"],
    updatedAt: now,
  },
  {
    id: "noise-grain",
    name: "Noise Grain",
    category: "effects",
    status: "SVG_FALLBACK_REQUIRED",
    skipReason: null,
    renderMethod: "svg-fallback",
    features: ["svg-turbulence-filter"],
    preliminaryStatus: "SVG_FALLBACK_REQUIRED",
    satoriStyle: null,
    satoriVersion: "0.19.2",
    suitableForSocialBg: null,
    notes: ["v1-priority-fallback"],
    updatedAt: now,
  },
]

function main(): void {
  const manifest = readManifest()

  for (const fb of v1Fallbacks) {
    upsertPattern(manifest, fb)
  }

  sortManifestPatternsStable(manifest)
  writeManifest(manifest)

  console.log(`[add-v1-fallbacks] Added/updated ${v1Fallbacks.length} V1 fallback patterns`)
}

main()
