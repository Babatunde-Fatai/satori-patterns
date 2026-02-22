import React from "react"

/* SVG Fallback: Diagonal Crosshatch (Skill Rule C-5) */
import type { SVGPatternProps } from "../types"

export function DiagonalCrosshatch({
  width = 1200,
  height = 630,
  foreground = "#a1a1aa",
  background = "#ffffff",
  idPrefix,
  ...rest
}: SVGPatternProps) {
  const spacing = (rest.spacing as number) ?? 24
  const strokeWidth = (rest.strokeWidth as number) ?? 1
  const opacity = (rest.opacity as number) ?? 0.5
  const baseId = idPrefix ?? `diagonal-crosshatch-${width}x${height}`
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
          {/* Rising diagonal */}
          <line
            x1="0"
            y1={spacing}
            x2={spacing}
            y2="0"
            stroke={foreground}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
          {/* Falling diagonal */}
          <line
            x1="0"
            y1="0"
            x2={spacing}
            y2={spacing}
            stroke={foreground}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
    </svg>
  )
}
