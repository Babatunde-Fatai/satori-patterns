import React from "react"

/* SVG Fallback: Dot Grid (Skill Rule C-3) */
import type { SVGPatternProps } from "../types"

export function DotGrid({
  width = 1200,
  height = 630,
  foreground = "#d4d4d8",
  background = "#ffffff",
  idPrefix,
  ...rest
}: SVGPatternProps) {
  const spacing = (rest.spacing as number) ?? 24
  const dotSize = (rest.dotSize as number) ?? 2
  const baseId = idPrefix ?? `dot-grid-${width}x${height}`
  const patternId = `${baseId}-pattern`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect width={width} height={height} fill={background} />
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={dotSize}
            fill={foreground}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
    </svg>
  )
}
