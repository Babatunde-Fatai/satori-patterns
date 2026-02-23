import fs from "node:fs"
import path from "node:path"
import Link from "next/link"
import { unstable_cache } from "next/cache"
import { ThumbnailWithFallback } from "./ThumbnailWithFallback"

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

function resolveApprovedPath(): string {
  const envPath = process.env.APPROVED_PATH
  if (envPath) {
    return path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath)
  }
  return path.join(process.cwd(), "data", "approved.json")
}

const getApproved = unstable_cache(
  async (): Promise<ApprovedFile> => {
    return JSON.parse(fs.readFileSync(resolveApprovedPath(), "utf8"))
  },
  ["approved-patterns"],
  { revalidate: false }
)

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const data = await getApproved()
  return data.patterns.map((p) => ({ id: p.id }))
}

function toCamelCase(id: string): string {
  return id
    .toLowerCase()
    .replace(/[\s-]+([a-z0-9])/g, (_, c: string) => c.toUpperCase())
}

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  gradients: { bg: "#f3f0fa", text: "#6d42c9", border: "#d4c8f5" },
  geometric: { bg: "#ebf7ff", text: "#0369a1", border: "#bae0fd" },
  decorative: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  effects: { bg: "#fdf2f8", text: "#9d174d", border: "#f9a8d4" },
}

export default async function PatternDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getApproved()
  const pattern = data.patterns.find((p) => p.id === id)
  const camelName = toCamelCase(id)

  if (!pattern) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg-base)", padding: "40px 24px" }}>
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          color: "var(--accent)", fontSize: 13, fontWeight: 600,
          textDecoration: "none", marginBottom: 24,
        }}>
          ← Back to catalogue
        </Link>
        <h1 style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Pattern not found: <code>{id}</code>
        </h1>
      </div>
    )
  }

  const catColors = CAT_COLORS[pattern.category] ?? { bg: "#f0ede8", text: "#5a5a52", border: "#d4cfc8" }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      {/* Breadcrumb nav */}
      <div style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            Satori Patterns
          </Link>
          <span style={{ color: "var(--text-muted)" }}>›</span>
          <span style={{ color: "var(--text-secondary)" }}>{pattern.name}</span>
        </div>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        {/* Page title block */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "2px 8px", borderRadius: 4,
              background: catColors.bg,
              color: catColors.text,
              border: `1px solid ${catColors.border}`,
            }}>
              {pattern.category}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
              textTransform: "uppercase",
              padding: "2px 8px", borderRadius: 4,
              background: "#eef6ee",
              color: "#166534",
              border: "1px solid #bbf7d0",
            }}>
              Approved
            </span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px", borderRadius: 4,
              background: "var(--bg-base)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}>
              {pattern.renderMethod}
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(22px, 3.5vw, 32px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            margin: 0,
          }}>
            {pattern.name}
          </h1>
        </div>

        {/* Preview section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 32,
        }}>
          {/* CSS live preview */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                CSS Preview
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>1200 × 630</span>
            </div>
            <div
              style={{
                width: "100%",
                aspectRatio: "1200/630",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                overflow: "hidden",
                ...(pattern.satoriStyle as React.CSSProperties ?? {}),
              }}
            />
          </div>

          {/* Satori render — with client-side fallback */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Satori Render
              </span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>PNG output</span>
            </div>
            <ThumbnailWithFallback
              id={pattern.id}
              name={pattern.name}
              satoriStyle={pattern.satoriStyle}
            />
          </div>
        </div>

        {/* Usage section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {/* Import snippet */}
          <div style={{
            background: "var(--bg-dark)",
            borderRadius: "var(--radius-md)",
            padding: "20px 20px 16px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(245,242,238,0.4)", marginBottom: 8 }}>
              Import
            </div>
            <pre style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 13,
              color: "#a68a64",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}>
              {`import { ${camelName} } from 'satori-patterns'`}
            </pre>
          </div>

          {/* Usage snippet */}
          <div style={{
            background: "var(--bg-dark)",
            borderRadius: "var(--radius-md)",
            padding: "20px 20px 16px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(245,242,238,0.4)", marginBottom: 8 }}>
              Usage
            </div>
            <pre style={{
              margin: 0,
              fontFamily: "monospace",
              fontSize: 13,
              color: "#a68a64",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}>
              {`<div style={${camelName}} />`}
            </pre>
          </div>
        </div>

        {/* satoriStyle JSON */}
        {pattern.satoriStyle && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              margin: "0 0 10px",
            }}>
              satoriStyle
            </h2>
            <pre style={{
              background: "#1a1a18",
              color: "#e0dbd4",
              padding: "16px 20px",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              lineHeight: 1.7,
              overflow: "auto",
              margin: 0,
              border: "1px solid #2a2a26",
              fontFamily: "monospace",
            }}>
              {JSON.stringify(pattern.satoriStyle, null, 2)}
            </pre>
          </div>
        )}

        {/* Notes */}
        {pattern.notes.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              margin: "0 0 10px",
            }}>
              Notes
            </h2>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {pattern.notes.map((n, i) => (
                <li key={i} style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  display: "flex",
                  gap: 8,
                  background: "var(--bg-surface)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                }}>
                  <span style={{ color: "var(--accent-warm)", flexShrink: 0 }}>•</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meta */}
        <div style={{ fontSize: 12, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          Approved {new Date(pattern.approvedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </main>

      <style>{`
        @media (max-width: 640px) {
          main > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          main { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  )
}
