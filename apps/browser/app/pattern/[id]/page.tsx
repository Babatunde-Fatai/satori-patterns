import fs from "node:fs"
import path from "node:path"
import Link from "next/link"

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

function loadManifest(): Manifest {
  const p = path.join(process.cwd(), "..", "..", "compatibility.json")
  return JSON.parse(fs.readFileSync(p, "utf8"))
}

export default async function PatternDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const manifest = loadManifest()
  const pattern = manifest.patterns.find((p) => p.id === id)

  if (!pattern) {
    return (
      <div style={{ padding: 40 }}>
        <Link href="/" style={{ color: "#2563eb" }}>Back</Link>
        <h1>Pattern not found: {id}</h1>
      </div>
    )
  }

  const hasThumbnail = pattern.status === "PASS" || pattern.status === "PARTIAL" || pattern.renderMethod === "svg-fallback"

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <Link href="/" style={{ color: "#2563eb", fontSize: 14 }}>Back to grid</Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 16, marginBottom: 8 }}>{pattern.name}</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#e4e4e7" }}>{pattern.category}</span>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#e4e4e7" }}>{pattern.status}</span>
        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#e4e4e7" }}>{pattern.renderMethod}</span>
      </div>

      {/* Side-by-side preview */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 13, marginBottom: 8, color: "#666" }}>CSS Native (1200x630)</h3>
          <div
            style={{
              width: "100%",
              aspectRatio: "1200/630",
              borderRadius: 8,
              border: "1px solid #e4e4e7",
              ...(pattern.satoriStyle as React.CSSProperties ?? {}),
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 13, marginBottom: 8, color: "#666" }}>Satori Render</h3>
          {hasThumbnail ? (
            <img
              src={`/thumbnails/${pattern.id}.png`}
              alt={pattern.name}
              style={{ width: "100%", aspectRatio: "1200/630", borderRadius: 8, border: "1px solid #e4e4e7", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%",
              aspectRatio: "1200/630",
              borderRadius: 8,
              border: "1px solid #e4e4e7",
              background: "#f4f4f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 14,
            }}>
              No Satori render available
            </div>
          )}
        </div>
      </div>

      {/* Satori Style JSON */}
      {pattern.satoriStyle && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>satoriStyle</h3>
          <pre style={{
            background: "#18181b",
            color: "#e4e4e7",
            padding: 16,
            borderRadius: 8,
            fontSize: 12,
            overflow: "auto",
          }}>
            {JSON.stringify(pattern.satoriStyle, null, 2)}
          </pre>
        </div>
      )}

      {/* Skip reason */}
      {pattern.skipReason && (
        <div style={{ marginBottom: 24, padding: 16, background: "#fef3c7", borderRadius: 8 }}>
          <strong>Skip Reason:</strong> {pattern.skipReason}
        </div>
      )}

      {/* Notes */}
      {pattern.notes.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, marginBottom: 8 }}>Notes</h3>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#666" }}>
            {pattern.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}

      {/* Features */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, marginBottom: 8 }}>Features</h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {pattern.features.map((f) => (
            <span key={f} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#e4e4e7" }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Live render link */}
      {(pattern.status === "PASS" || pattern.status === "PARTIAL") && (
        <div>
          <a
            href={`/api/render/${pattern.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#2563eb", fontSize: 14 }}
          >
            View live render (PNG)
          </a>
        </div>
      )}
    </div>
  )
}
