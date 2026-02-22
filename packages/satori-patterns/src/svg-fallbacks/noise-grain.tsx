import React from "react"

/* SVG Fallback: Noise Grain (Skill Rule C-7) */
import type { SVGPatternProps } from "../types"

export function NoiseGrain({
  width = 1200,
  height = 630,
  foreground = "#000000",
  background = "#f4f4f5",
  idPrefix,
  ...rest
}: SVGPatternProps) {
  const baseId = idPrefix ?? `noise-grain-${width}x${height}`
  const filterId = `${baseId}-noise`
  const opacity = (rest.opacity as number) ?? 0.4
  const baseFrequency = (rest.baseFrequency as number) ?? 0.65

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={4}
            stitchTiles="stitch"
          />
        </filter>
      </defs>
      <rect width={width} height={height} fill={background} />
      <rect
        width={width}
        height={height}
        filter={`url(#${filterId})`}
        opacity={opacity}
      />
    </svg>
  )
}
