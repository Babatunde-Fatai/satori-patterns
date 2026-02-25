"use client"

import { useEffect, useState, useMemo, useCallback } from "react"

interface ApprovedPattern {
  id: string
  name: string
  category: string
  approvedAt: string
  satoriStyle: Record<string, unknown> | null
  renderMethod: string
  notes: string[]
}

interface ApprovedFile {
  meta: { updatedAt: string; count: number }
  patterns: ApprovedPattern[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Fallback for non-secure contexts or missing API
  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.cssText = "position:absolute;left:-9999px;top:-9999px"
  document.body.appendChild(ta)
  ta.select()
  document.execCommand("copy")
  document.body.removeChild(ta)
}

function toCamelCase(id: string): string {
  return id
    .toLowerCase()
    .replace(/[\s-]+([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  gradients: { bg: "#f0ecfa", text: "#7c5cbf" },
  geometric: { bg: "#e8f4ff", text: "#1d6fa8" },
  decorative: { bg: "#fef7e8", text: "#8a5e1a" },
  effects: { bg: "#fdf0f7", text: "#924070" },
}

// ---------------------------------------------------------------------------
// NpmInstallChip — copy-on-click terminal command chip
// ---------------------------------------------------------------------------

function NpmInstallChip() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await copyToClipboard("npm install satori-patterns")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(0,0,0,0.35)",
        border: "1px solid rgba(166,138,100,0.4)",
        borderRadius: 8,
        padding: "8px 16px",
        fontFamily: "monospace",
      }}
    >
      <span style={{ fontSize: 13, color: "#ede0d4" }}>
        npm install satori-patterns
      </span>
      <button
        onClick={handleCopy}
        title="Click to copy"
        style={{
          fontSize: 11,
          color: copied ? "#ffffff" : "#a68a64",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "sans-serif",
          transition: "color 160ms ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#ffffff" }}
        onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#a68a64" }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ThumbnailImage — handles error fallback
// ---------------------------------------------------------------------------

function ThumbnailImage({ pattern }: { pattern: ApprovedPattern }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    if (!pattern.satoriStyle) {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          background: "#f0ede8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <span style={{ fontSize: 11, color: "#8a8a7a" }}>No render</span>
        </div>
      )
    }
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          ...(pattern.satoriStyle as React.CSSProperties),
        }}
      />
    )
  }

  return (
    <img
      src={`/thumbnails/${pattern.id}.png`}
      alt={pattern.name}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      onError={() => setFailed(true)}
    />
  )
}

// ---------------------------------------------------------------------------
// Detail Modal
// ---------------------------------------------------------------------------

function DetailModal({ pattern, onClose }: { pattern: ApprovedPattern; onClose: () => void }) {
  const [copiedStyle, setCopiedStyle] = useState(false)
  const [copiedImport, setCopiedImport] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const camelName = toCamelCase(pattern.id)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  async function copyStyle() {
    if (!pattern.satoriStyle) return
    await copyToClipboard(JSON.stringify(pattern.satoriStyle, null, 2))
    setCopiedStyle(true)
    setTimeout(() => setCopiedStyle(false), 1500)
  }

  async function copyImport() {
    await copyToClipboard(`import { ${camelName} } from 'satori-patterns'`)
    setCopiedImport(true)
    setTimeout(() => setCopiedImport(false), 1500)
  }

  const catColor = CAT_COLORS[pattern.category] ?? { bg: "#f0ede8", text: "#5a5a52" }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 16,
          maxWidth: 900,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 32,
          position: "relative",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #e0dbd4",
            background: "#f5f2ee",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#5a5a52",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24, paddingRight: 48 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: catColor.bg,
              color: catColor.text,
              textTransform: "capitalize",
            }}>
              {pattern.category}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "#f0f7f0",
              color: "#2d6a2d",
            }}>
              Approved
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: 20,
              background: "#f5f2ee",
              color: "#8a8a7a",
            }}>
              {pattern.renderMethod}
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#1a1a18",
            margin: 0,
          }}>
            {pattern.name}
          </h2>
        </div>

        {/* Side-by-side previews */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}>
          {/* CSS preview */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8a7a", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
              CSS Preview
            </div>
            <div style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: 10,
              border: "1px solid #e0dbd4",
              overflow: "hidden",
              background: "#f5f2ee",
              ...(pattern.satoriStyle as React.CSSProperties ?? {}),
            }} />
          </div>

          {/* Satori PNG */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8a7a", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
              Satori PNG
            </div>
            {thumbFailed ? (
              <div style={{
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: 10,
                border: "1px dashed #e0dbd4",
                background: "#f5f2ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ fontSize: 13, color: "#8a8a7a" }}>No Satori render available</span>
              </div>
            ) : (
              <img
                src={`/thumbnails/${pattern.id}.png`}
                alt={`${pattern.name} Satori render`}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 10,
                  border: "1px solid #e0dbd4",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={() => setThumbFailed(true)}
              />
            )}
          </div>
        </div>

        {/* satoriStyle code block */}
        {pattern.satoriStyle && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#8a8a7a", letterSpacing: "0.05em", textTransform: "uppercase" }}>satoriStyle</span>
              <button
                onClick={copyStyle}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: "1px solid #e0dbd4",
                  background: copiedStyle ? "#656d4a" : "#f5f2ee",
                  color: copiedStyle ? "#fff" : "#5a5a52",
                  cursor: "pointer",
                  transition: "all 160ms ease",
                }}
              >
                {copiedStyle ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre style={{
              background: "#1a1a18",
              color: "#e0dbd4",
              padding: "16px 20px",
              borderRadius: 10,
              fontSize: 12,
              lineHeight: 1.7,
              overflow: "auto",
              margin: 0,
              border: "1px solid #2a2a26",
              fontFamily: "monospace",
              maxHeight: 280,
            }}>
              {JSON.stringify(pattern.satoriStyle, null, 2)}
            </pre>
          </div>
        )}

        {/* Import statement */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#8a8a7a", letterSpacing: "0.05em", textTransform: "uppercase" }}>Import</span>
            <button
              onClick={copyImport}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 6,
                border: "1px solid #e0dbd4",
                background: copiedImport ? "#656d4a" : "#f5f2ee",
                color: copiedImport ? "#fff" : "#5a5a52",
                cursor: "pointer",
                transition: "all 160ms ease",
              }}
            >
              {copiedImport ? "Copied!" : "Copy"}
            </button>
          </div>
          <code style={{
            display: "block",
            background: "#1a1a18",
            color: "#a68a64",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "monospace",
            border: "1px solid #2a2a26",
          }}>
            {`import { ${camelName} } from 'satori-patterns'`}
          </code>
        </div>

        {/* Notes */}
        {pattern.notes.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8a8a7a", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Notes</div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {pattern.notes.map((n, i) => (
                <li key={i} style={{
                  fontSize: 13,
                  color: "#5a5a52",
                  display: "flex",
                  gap: 8,
                  background: "#f5f2ee",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #e0dbd4",
                }}>
                  <span style={{ color: "#a68a64", flexShrink: 0 }}>•</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pattern Card
// ---------------------------------------------------------------------------

function PatternCard({ p, onOpen, copiedId, copiedImportId, onCopyStyle, onCopyImport }: {
  p: ApprovedPattern
  onOpen: (p: ApprovedPattern) => void
  copiedId: string | null
  copiedImportId: string | null
  onCopyStyle: (p: ApprovedPattern) => void
  onCopyImport: (p: ApprovedPattern) => void
}) {
  const catColor = CAT_COLORS[p.category] ?? { bg: "#f0ede8", text: "#5a5a52" }

  return (
    <div
      onClick={() => onOpen(p)}
      className="pattern-card"
      style={{
        background: "#ffffff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "box-shadow 200ms ease, transform 200ms ease",
        cursor: "pointer",
        border: "1px solid #ede9e3",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"
        e.currentTarget.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)"
        e.currentTarget.style.transform = "translateY(0)"
      }}
    >
      {/* Thumbnail — 16/9 aspect, full bleed PNG */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        overflow: "hidden",
        background: "#f0ede8",
      }}>
        <ThumbnailImage pattern={p} />
        {/* Render method badge */}
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 7px",
          borderRadius: 20,
          background: "rgba(0,0,0,0.45)",
          color: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(4px)",
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}>
          {p.renderMethod === "svg-fallback" ? "SVG" : "CSS"}
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: "12px 14px 14px" }}>
        {/* Name + category */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#1a1a18",
            fontFamily: "var(--font-display)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 5,
          }}>
            {p.name}
          </div>
          <span style={{
            display: "inline-flex",
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 20,
            background: catColor.bg,
            color: catColor.text,
            textTransform: "capitalize",
          }}>
            {p.category}
          </span>
        </div>

        {/* Action row */}
        {p.satoriStyle && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", gap: 8 }}
          >
            <button
              onClick={(e) => { e.preventDefault(); onCopyStyle(p) }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: copiedId === p.id ? "#3d6a3d" : "#656d4a",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-body)",
                transition: "color 160ms ease",
              }}
            >
              {copiedId === p.id ? "Copied!" : "Copy style"}
            </button>
            <span style={{ color: "#d8d3cc", fontSize: 12 }}>·</span>
            <button
              onClick={(e) => { e.preventDefault(); onCopyImport(p) }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: copiedImportId === p.id ? "#3d6a3d" : "#656d4a",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-body)",
                transition: "color 160ms ease",
              }}
            >
              {copiedImportId === p.id ? "Copied!" : "Copy import"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PatternGrid() {
  const [data, setData] = useState<ApprovedFile | null>(null)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedImportId, setCopiedImportId] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<ApprovedPattern | null>(null)

  useEffect(() => {
    fetch("/api/manifest")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    return data.patterns.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.includes(search.toLowerCase())) return false
      if (catFilter !== "all" && p.category !== catFilter) return false
      return true
    })
  }, [data, search, catFilter])

  const copyStyle = useCallback(async (p: ApprovedPattern) => {
    if (!p.satoriStyle) return
    await copyToClipboard(JSON.stringify(p.satoriStyle, null, 2))
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  const copyImport = useCallback(async (p: ApprovedPattern) => {
    const name = toCamelCase(p.id)
    await copyToClipboard(`import { ${name} } from 'satori-patterns'`)
    setCopiedImportId(p.id)
    setTimeout(() => setCopiedImportId(null), 1500)
  }, [])

  const categories = ["all", "gradients", "geometric", "decorative", "effects"]

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf8" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "2.5px solid #e0dbd4",
            borderTopColor: "#656d4a",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 14, color: "#8a8a7a", fontWeight: 500 }}>Loading patterns…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8" }}>
      {/* Detail Modal */}
      {activeModal && (
        <DetailModal pattern={activeModal} onClose={() => setActiveModal(null)} />
      )}

      {/* ── HERO ── */}
      <header style={{ background: "#2f3e46" }}>
        {/* Top strip */}
        <div style={{
          height: 64,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 40,
          paddingRight: 40,
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.12em",
            color: "#a68a64",
            textTransform: "uppercase",
          }}>
            Open Source
          </span>
          <NpmInstallChip />
        </div>

        {/* Title zone */}
        <div style={{
          padding: "64px 40px 72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 32,
        }}>
          {/* Left: title + subtitle */}
          <div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(56px, 6vw, 88px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              margin: 0,
            }}>
              <span style={{ color: "#ffffff", display: "block" }}>Satori</span>
              <span style={{ color: "#a68a64", display: "block" }}>Patterns</span>
            </h1>
            <p style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: "rgba(237,224,212,0.7)",
              maxWidth: 480,
              marginTop: 20,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            }}>
              Hand-reviewed patterns confirmed to render correctly in Satori.
              Drop-in styles for OG images, social cards, and hero sections.
            </p>
          </div>

          {/* Right: stats */}
          <div style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}>
            <span style={{
              fontSize: 13,
              color: "rgba(237,224,212,0.5)",
              fontVariantNumeric: "tabular-nums",
            }}>
              {data.meta.count} approved · updated {new Date(data.meta.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>
      </header>

      {/* ── FILTER BAR (sticky) ── */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          {/* Search */}
          <div style={{ position: "relative", width: 280, flexShrink: 0 }}>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search patterns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px 7px 32px",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                fontSize: 13,
                background: "#ffffff",
                color: "#1a1a18",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#656d4a" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb" }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1, justifyContent: "center" }}>
            {categories.map((cat) => {
              const active = catFilter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    padding: "5px 16px",
                    borderRadius: 20,
                    border: active ? "1px solid transparent" : "1px solid #e5e7eb",
                    background: active ? "#656d4a" : "#ffffff",
                    color: active ? "#ffffff" : "#4b5563",
                    cursor: "pointer",
                    transition: "all 160ms ease",
                    textTransform: cat === "all" ? "none" : "capitalize",
                    fontFamily: "var(--font-body)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              )
            })}
          </div>

          {/* Result count */}
          <span style={{ fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0, marginLeft: "auto" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── PATTERN GRID ── */}
      <main style={{ background: "#fafaf8", padding: "32px 24px 64px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {data.patterns.length === 0 ? (
            <div style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "#8a8a7a",
              fontSize: 15,
              border: "1px dashed #d8d3cc",
              borderRadius: 16,
              background: "#ffffff",
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>∅</div>
              <div style={{ fontWeight: 600, marginBottom: 4, color: "#5a5a52" }}>No patterns approved yet</div>
              <div style={{ fontSize: 13 }}>Run the review tool locally to approve patterns.</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              padding: "60px 40px",
              textAlign: "center",
              color: "#8a8a7a",
              fontSize: 14,
            }}>
              No patterns match your search.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}>
              {filtered.map((p) => (
                <PatternCard
                  key={p.id}
                  p={p}
                  onOpen={setActiveModal}
                  copiedId={copiedId}
                  copiedImportId={copiedImportId}
                  onCopyStyle={copyStyle}
                  onCopyImport={copyImport}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "#2f3e46",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <div style={{ fontSize: 13, color: "rgba(237,224,212,0.5)" }}>
          By{" "}
          <a
            href="https://babatunde.ng"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(237,224,212,0.8)", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#ede0d4" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(237,224,212,0.8)" }}
          >
            Babatunde Fatai
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(237,224,212,0.35)", letterSpacing: "0.04em" }}>
            satori-patterns
          </span>
          <a
            href="https://npmjs.com/package/satori-patterns"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="https://img.shields.io/npm/v/satori-patterns?style=flat-square&colorA=2f3e46&colorB=a68a64&label=npm"
              alt="npm version"
              style={{ height: 18, display: "block" }}
            />
          </a>
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          main > div > div[style*="repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          main > div > div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          main { padding: 20px 16px 40px !important; }
          header { padding: 36px 16px 32px !important; }
        }
      `}</style>
    </div>
  )
}
