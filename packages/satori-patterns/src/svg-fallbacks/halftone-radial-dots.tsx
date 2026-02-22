import React from "react"

/* SVG Fallback: Halftone Radial Dots (Skill Rule C-6) */
import type { SVGPatternProps } from "../types"

export function HalftoneRadialDots({
  width = 1200,
  height = 630,
  foreground = "#71717a",
  background = "#ffffff",
  idPrefix,
  ...rest
}: SVGPatternProps) {
  const baseId = idPrefix ?? `halftone-radial-${width}x${height}`
  const maxRadius = (rest.maxRadius as number) ?? 4
  const minRadius = (rest.minRadius as number) ?? 0.5
  const spacing = (rest.spacing as number) ?? 16

  // Generate deterministic dot field with radially scaled circles
  const cx = width / 2
  const cy = height / 2
  const maxDist = Math.sqrt(cx * cx + cy * cy)

  const dots: { x: number; y: number; r: number }[] = []
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const t = Math.min(dist / maxDist, 1)
      // Radius increases toward center (halftone effect)
      const r = maxRadius - t * (maxRadius - minRadius)
      dots.push({ x, y, r })
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <rect width={width} height={height} fill={background} />
      <g id={`${baseId}-dots`}>
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={foreground}
          />
        ))}
      </g>
    </svg>
  )
}
