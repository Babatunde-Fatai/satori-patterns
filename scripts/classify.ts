import type { SkipReason } from "./utils/manifest"

export interface PatternStyleInput {
  background?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  filter?: string
  [key: string]: unknown
}

export interface FeatureScanResult {
  features: string[]
  preliminaryStatus:
    | "SKIP"
    | "SVG_FALLBACK_REQUIRED"
    | "CSS_TRANSLATE_CANDIDATE"
    | "UNCLASSIFIED"
  skipReason: SkipReason
}

function hasValue(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0
}

export function featureScanner(
  styleObj: PatternStyleInput,
  patternId?: string
): FeatureScanResult {
  const features = new Set<string>()
  const haystack = Object.values(styleObj)
    .filter((v): v is string => typeof v === "string")
    .join(" | ")
    .toLowerCase()

  // Gradients
  if (haystack.includes("linear-gradient(")) features.add("linear-gradient")
  if (haystack.includes("repeating-linear-gradient(")) features.add("repeating-linear-gradient")
  if (haystack.includes("radial-gradient(")) features.add("radial-gradient")
  if (haystack.includes("repeating-radial-gradient(")) features.add("repeating-radial-gradient")
  if (haystack.includes("conic-gradient(")) {
    features.add("conic-gradient")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "conic-gradient" }
  }

  // Blend / filters
  if (haystack.includes("background-blend-mode")) {
    features.add("background-blend-mode")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "blend-mode" }
  }
  if (haystack.includes("mix-blend-mode")) {
    features.add("mix-blend-mode")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "blend-mode" }
  }
  if (haystack.includes("backdrop-filter")) {
    features.add("backdrop-filter")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "backdrop-filter" }
  }
  if (haystack.includes("background-clip")) {
    features.add("background-clip")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "background-clip" }
  }
  if (haystack.includes("mask") || haystack.includes("-webkit-mask")) {
    features.add("mask")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "mask" }
  }
  if (haystack.includes("background-attachment")) {
    features.add("background-attachment")
    return { features: [...features], preliminaryStatus: "SKIP", skipReason: "background-attachment" }
  }

  // CSS filters
  if (hasValue(styleObj.filter)) {
    const f = styleObj.filter.toLowerCase()
    if (f.includes("blur(")) {
      features.add("filter-blur")
    } else {
      features.add("filter-other")
      return { features: [...features], preliminaryStatus: "SKIP", skipReason: "css-filter" }
    }
  }

  // Variables / calc
  if (haystack.includes("var(")) features.add("css-var")
  if (haystack.includes("calc(")) features.add("calc")

  // Tile/grid heuristic (Skill Rule A-1)
  // Check CSS signals: repeating gradients, small backgroundSize, explicit repeat
  const hasRepeatingGradient =
    haystack.includes("repeating-linear-gradient(") ||
    haystack.includes("repeating-radial-gradient(")

  const hasExplicitRepeat =
    typeof styleObj.backgroundRepeat === "string" &&
    styleObj.backgroundRepeat.toLowerCase().includes("repeat")

  // Detect small tiled backgroundSize (e.g. "24px 24px", "32px 32px")
  const hasSmallTileSize = (() => {
    const bs = typeof styleObj.backgroundSize === "string" ? styleObj.backgroundSize : ""
    const sizeMatch = bs.match(/(\d+)px\s+(\d+)px/)
    if (sizeMatch) {
      const w = parseInt(sizeMatch[1], 10)
      const h = parseInt(sizeMatch[2], 10)
      return w <= 80 && h <= 80
    }
    return false
  })()

  // Pattern ID signals for tile/grid patterns
  const idLower = (patternId ?? "").toLowerCase()
  const idSignalsGrid =
    idLower.includes("dot-grid") ||
    idLower.includes("dot-matrix") ||
    idLower.includes("line-grid") ||
    idLower.includes("crosshatch") ||
    idLower.includes("halftone") ||
    idLower.includes("noise-grain") ||
    idLower.includes("pixel-grid")

  const cssSignalsTile =
    (hasRepeatingGradient && hasSmallTileSize) ||
    (hasExplicitRepeat && hasSmallTileSize)

  if (cssSignalsTile || idSignalsGrid) {
    features.add("tile-grid-repeat")
    return {
      features: [...features],
      preliminaryStatus: "SVG_FALLBACK_REQUIRED",
      skipReason: null
    }
  }

  return {
    features: [...features],
    preliminaryStatus: "CSS_TRANSLATE_CANDIDATE",
    skipReason: null
  }
}