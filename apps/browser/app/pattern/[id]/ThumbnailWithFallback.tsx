"use client"

import { useState } from "react"

interface Props {
  id: string
  name: string
  satoriStyle: Record<string, unknown> | null
}

export function ThumbnailWithFallback({ id, name, satoriStyle }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !id) {
    if (!satoriStyle) {
      return (
        <div style={{
          width: "100%",
          aspectRatio: "1200/630",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card)",
          background: "var(--bg-base)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>No Satori render available</span>
        </div>
      )
    }
    return (
      <div
        title="CSS native preview (no Satori PNG)"
        style={{
          width: "100%",
          aspectRatio: "1200/630",
          borderRadius: "var(--radius-md)",
          border: "1px dashed var(--border-dark)",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
          position: "relative",
          ...(satoriStyle as React.CSSProperties),
        }}
      >
        <div style={{
          position: "absolute",
          bottom: 6,
          right: 8,
          fontSize: 10,
          color: "rgba(255,255,255,0.6)",
          background: "rgba(0,0,0,0.35)",
          padding: "2px 6px",
          borderRadius: 4,
        }}>
          CSS fallback
        </div>
      </div>
    )
  }

  return (
    <img
      src={`/thumbnails/${id}.png`}
      alt={`${name} rendered by Satori`}
      style={{
        width: "100%",
        aspectRatio: "1200/630",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-card)",
        objectFit: "cover",
        display: "block",
        background: "var(--bg-base)",
      }}
      onError={() => setFailed(true)}
    />
  )
}
