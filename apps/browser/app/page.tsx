"use client"

import { useEffect, useState, useMemo } from "react"

interface PatternRecord {
  id: string
  name: string
  category: string
  status: string
  skipReason: string | null
  renderMethod: string
  features: string[]
  satoriStyle: Record<string, unknown> | null
  suitableForSocialBg: boolean | null
  notes: string[]
}

interface Manifest {
  meta: { upstreamCommitSha: string; generatedAt: string; satoriVersion: string }
  patterns: PatternRecord[]
}

const STATUS_COLORS: Record<string, string> = {
  PASS: "#16a34a",
  PARTIAL: "#ca8a04",
  FAIL: "#dc2626",
  SILENT_FAIL: "#9333ea",
  SVG_FALLBACK_REQUIRED: "#2563eb",
  SKIP: "#6b7280",
  DEPRECATED: "#78716c",
  UNCLASSIFIED: "#a3a3a3",
}

const CAT_COLORS: Record<string, string> = {
  gradients: "#8b5cf6",
  geometric: "#0ea5e9",
  decorative: "#f59e0b",
  effects: "#ec4899",
}

export default function PatternGrid() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [socialFilter, setSocialFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/manifest")
      .then((r) => r.json())
      .then(setManifest)
      .catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    if (!manifest) return []
    return manifest.patterns.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.id.includes(search.toLowerCase())) return false
      if (catFilter !== "all" && p.category !== catFilter) return false
      if (statusFilter !== "all" && p.status !== statusFilter) return false
      if (socialFilter === "true" && p.suitableForSocialBg !== true) return false
      if (socialFilter === "false" && p.suitableForSocialBg !== false) return false
      if (socialFilter === "null" && p.suitableForSocialBg !== null) return false
      return true
    })
  }, [manifest, search, catFilter, statusFilter, socialFilter])

  async function copyStyle(p: PatternRecord) {
    if (!p.satoriStyle) return
    await navigator.clipboard.writeText(JSON.stringify(p.satoriStyle, null, 2))
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  if (!manifest) return <div style={{ padding: 40, textAlign: "center" }}>Loading manifest...</div>

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 16px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Satori Patterns Browser</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        {manifest.patterns.length} patterns | {manifest.meta.satoriVersion} | Generated {new Date(manifest.meta.generatedAt).toLocaleDateString()}
      </p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #d4d4d8", borderRadius: 6, fontSize: 14, width: 220 }}
        />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selectStyle}>
          <option value="all">All categories</option>
          <option value="gradients">Gradients</option>
          <option value="geometric">Geometric</option>
          <option value="decorative">Decorative</option>
          <option value="effects">Effects</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="all">All statuses</option>
          <option value="PASS">PASS</option>
          <option value="PARTIAL">PARTIAL</option>
          <option value="FAIL">FAIL</option>
          <option value="SILENT_FAIL">SILENT_FAIL</option>
          <option value="SVG_FALLBACK_REQUIRED">SVG_FALLBACK</option>
          <option value="SKIP">SKIP</option>
        </select>
        <select value={socialFilter} onChange={(e) => setSocialFilter(e.target.value)} style={selectStyle}>
          <option value="all">Social BG: all</option>
          <option value="true">Suitable</option>
          <option value="false">Not suitable</option>
          <option value="null">Unreviewed</option>
        </select>
        <span style={{ alignSelf: "center", fontSize: 13, color: "#888" }}>
          {filtered.length} results
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map((p) => (
          <a
            key={p.id}
            href={`/pattern/${p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ border: "1px solid #e4e4e7", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
              {/* CSS Preview */}
              <div style={{ display: "flex", height: 160 }}>
                <div
                  style={{
                    flex: 1,
                    ...(p.satoriStyle as React.CSSProperties ?? {}),
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", bottom: 4, left: 6, fontSize: 9, color: "#999" }}>CSS</span>
                </div>
                {/* Satori PNG */}
                <div style={{ flex: 1, position: "relative", background: "#f4f4f5" }}>
                  {(p.status === "PASS" || p.status === "PARTIAL" || p.renderMethod === "svg-fallback") ? (
                    <img
                      src={`/thumbnails/${p.id}.png`}
                      alt={p.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 11, color: "#aaa" }}>
                      No thumbnail
                    </div>
                  )}
                  <span style={{ position: "absolute", bottom: 4, right: 6, fontSize: 9, color: "#999" }}>Satori</span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: STATUS_COLORS[p.status] ?? "#999",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "1px 6px",
                      borderRadius: 3,
                      border: `1px solid ${CAT_COLORS[p.category] ?? "#ccc"}`,
                      color: CAT_COLORS[p.category] ?? "#666",
                    }}
                  >
                    {p.category}
                  </span>
                  <span style={{ fontSize: 10, color: "#999" }}>{p.renderMethod}</span>
                  {p.satoriStyle && (
                    <button
                      onClick={(e) => { e.preventDefault(); copyStyle(p) }}
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        border: "1px solid #d4d4d8",
                        background: copiedId === p.id ? "#16a34a" : "#fff",
                        color: copiedId === p.id ? "#fff" : "#333",
                        cursor: "pointer",
                      }}
                    >
                      {copiedId === p.id ? "Copied!" : "Copy Style"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d4d4d8",
  borderRadius: 6,
  fontSize: 14,
  background: "#fff",
}
