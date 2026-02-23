"use client"

import { useEffect, useState, useMemo } from "react"

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

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  gradients: { bg: "#f3f0fa", text: "#6d42c9", border: "#d4c8f5" },
  geometric: { bg: "#ebf7ff", text: "#0369a1", border: "#bae0fd" },
  decorative: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  effects: { bg: "#fdf2f8", text: "#9d174d", border: "#f9a8d4" },
}

function toCamelCase(id: string): string {
  return id
    .toLowerCase()
    .replace(/[\s-]+([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

function CategoryBadge({ category }: { category: string }) {
  const colors = CAT_COLORS[category] ?? { bg: "#f0ede8", text: "#5a5a52", border: "#d4cfc8" }
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      padding: "2px 8px",
      borderRadius: 4,
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
    }}>
      {category}
    </span>
  )
}

function CopyButton({ label, onCopy, active }: { label: string; onCopy: () => void; active: boolean }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onCopy() }}
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: "var(--radius-sm)",
        border: active ? "none" : "1px solid var(--border-dark)",
        background: active ? "var(--accent)" : "var(--bg-surface)",
        color: active ? "#fff" : "var(--text-secondary)",
        cursor: "pointer",
        transition: "all var(--transition)",
        display: "flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      {active ? (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function PatternCard({ p, copiedId, copiedImportId, onCopyStyle, onCopyImport }: {
  p: ApprovedPattern
  copiedId: string | null
  copiedImportId: string | null
  onCopyStyle: (p: ApprovedPattern) => void
  onCopyImport: (p: ApprovedPattern) => void
}) {
  return (
    <a
      href={`/pattern/${p.id}`}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <div
        className="pattern-card"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          boxShadow: "var(--shadow-card)",
          transition: "box-shadow var(--transition), transform var(--transition), border-color var(--transition)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.boxShadow = "var(--shadow-hover)"
          el.style.transform = "translateY(-2px)"
          el.style.borderColor = "var(--border-dark)"
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.boxShadow = "var(--shadow-card)"
          el.style.transform = "translateY(0)"
          el.style.borderColor = "var(--border)"
        }}
      >
        {/* Pattern preview — full bleed */}
        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              ...(p.satoriStyle as React.CSSProperties ?? { background: "#f0ede8" }),
            }}
          />
          {/* Overlay with pattern name for preview context */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(26,26,24,0.18)",
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              letterSpacing: "-0.01em",
              background: "rgba(0,0,0,0.28)",
              padding: "4px 10px",
              borderRadius: 6,
              backdropFilter: "blur(4px)",
            }}>
              {p.name}
            </span>
          </div>
          {/* Satori render thumbnail — bottom right corner pip */}
          <div style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 52,
            height: 28,
            borderRadius: 5,
            overflow: "hidden",
            border: "1.5px solid rgba(255,255,255,0.5)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}>
            <img
              src={`/thumbnails/${p.id}.png`}
              alt={`${p.name} satori render`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          </div>
        </div>

        {/* Card footer */}
        <div style={{ padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginRight: 8,
            }}>
              {p.name}
            </span>
            <CategoryBadge category={p.category} />
          </div>

          {p.satoriStyle && (
            <div style={{ display: "flex", gap: 6 }}>
              <CopyButton
                label="Copy style"
                active={copiedId === p.id}
                onCopy={() => onCopyStyle(p)}
              />
              <CopyButton
                label="Copy import"
                active={copiedImportId === p.id}
                onCopy={() => onCopyImport(p)}
              />
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

export default function PatternGrid() {
  const [data, setData] = useState<ApprovedFile | null>(null)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedImportId, setCopiedImportId] = useState<string | null>(null)

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

  async function copyStyle(p: ApprovedPattern) {
    if (!p.satoriStyle) return
    await navigator.clipboard.writeText(JSON.stringify(p.satoriStyle, null, 2))
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  async function copyImport(p: ApprovedPattern) {
    const name = toCamelCase(p.id)
    await navigator.clipboard.writeText(`import { ${name} } from 'satori-patterns'`)
    setCopiedImportId(p.id)
    setTimeout(() => setCopiedImportId(null), 1500)
  }

  const categories = ["all", "gradients", "geometric", "decorative", "effects"]

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "2.5px solid var(--border-dark)",
            borderTopColor: "var(--accent)",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>Loading patterns…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Hero header */}
      <header style={{
        background: "var(--bg-dark)",
        padding: "40px 24px 36px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent-warm)",
                }}>
                  Open Source
                </span>
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 4vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#f5f2ee",
                margin: "0 0 10px",
                lineHeight: 1.15,
              }}>
                Satori Patterns
              </h1>
              <p style={{
                fontSize: 15,
                color: "rgba(245,242,238,0.6)",
                margin: 0,
                maxWidth: 540,
                lineHeight: 1.6,
              }}>
                Hand-reviewed patterns confirmed to render correctly in Satori.
                Drop-in styles for OG images, social cards, and hero sections.
              </p>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
              justifyContent: "center",
            }}>
              <code style={{
                fontFamily: "monospace",
                fontSize: 13,
                background: "rgba(245,242,238,0.08)",
                color: "var(--accent-warm)",
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(245,242,238,0.12)",
                whiteSpace: "nowrap",
              }}>
                npm install satori-patterns
              </code>
              <span style={{ fontSize: 12, color: "rgba(245,242,238,0.35)" }}>
                {data.patterns.length} approved · updated {new Date(data.meta.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 280 }}>
            <svg
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            >
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search patterns…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px 7px 32px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                background: "var(--bg-base)",
                color: "var(--text-primary)",
                outline: "none",
                fontFamily: "var(--font-body)",
                transition: "border-color var(--transition)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                style={{
                  fontSize: 12,
                  fontWeight: catFilter === cat ? 600 : 400,
                  padding: "5px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: catFilter === cat ? "none" : "1px solid var(--border)",
                  background: catFilter === cat ? "var(--accent)" : "transparent",
                  color: catFilter === cat ? "#fff" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                  textTransform: cat === "all" ? "none" : "capitalize",
                }}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {data.patterns.length === 0 ? (
          <div style={{
            padding: "60px 40px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 15,
            border: "1px dashed var(--border-dark)",
            borderRadius: "var(--radius-lg)",
            background: "var(--bg-surface)",
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>∅</div>
            <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>No patterns approved yet</div>
            <div style={{ fontSize: 13 }}>Run the review tool locally to approve patterns.</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: "60px 40px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 14,
          }}>
            No patterns match your search.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {filtered.map((p) => (
              <PatternCard
                key={p.id}
                p={p}
                copiedId={copiedId}
                copiedImportId={copiedImportId}
                onCopyStyle={copyStyle}
                onCopyImport={copyImport}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: 12,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          Satori Patterns · Open source · MIT License
        </div>
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          main { padding: 20px 16px !important; }
          header { padding: 28px 16px 24px !important; }
        }
      `}</style>
    </div>
  )
}
