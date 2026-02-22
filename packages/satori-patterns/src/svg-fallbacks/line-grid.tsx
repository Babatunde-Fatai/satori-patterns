import React from "react"

/* SVG Fallback: Line Grid (Skill Rule C-4) */
import type { SVGPatternProps } from "../types"

export function LineGrid({
  width = 1200,
  height = 630,
  foreground = "#e4e4e7",
  background = "#ffffff",
  idPrefix,
  ...rest
}: SVGPatternProps) {
  const spacing = (rest.spacing as number) ?? 32
  const strokeWidth = (rest.strokeWidth as number) ?? 1
  const baseId = idPrefix ?? `line-grid-${width}x${height}`
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
          <path
            d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
            fill="none"
            stroke={foreground}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
    </svg>
  )
}
