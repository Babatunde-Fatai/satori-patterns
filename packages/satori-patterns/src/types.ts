import type { ReactElement } from "react"

export interface SatoriPatternStyle {
  backgroundColor?: string
  backgroundImage: string
  backgroundSize?: string
  backgroundPosition?: string
}

export interface SVGPatternProps {
  width?: number
  height?: number
  foreground?: string
  background?: string
  idPrefix?: string
  [key: string]: unknown
}

export interface SatoriPattern {
  id: string
  name: string
  category: "gradients" | "geometric" | "decorative" | "effects"
  renderMethod: "css" | "svg-fallback"
  style?: SatoriPatternStyle
  Component?: (props: SVGPatternProps) => ReactElement
}