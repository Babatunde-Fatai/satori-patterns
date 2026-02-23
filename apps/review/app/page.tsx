"use client"

import { useEffect, useState, useCallback } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ManifestPattern {
  id: string
  name: string
  category: string
  status: string
  satoriStyle: Record<string, unknown> | null
  renderMethod: string
  notes: string[]
  thumbnailExists: boolean
}

interface ApprovedPattern {
  id: string
  name: string
  category: string
  approvedAt: string
}

interface RejectedPattern {
  id: string
  name: string
  category: string
  rejectedAt: string
}

interface ReconvertEntry {
  id: string
  queuedAt: string
  reason: string
}

interface AppState {
  stats: {
    total: number
    pendingReview: number
    approved: number
    rejected: number
    inReconvertQueue: number
  }
  pending: ManifestPattern[]
  approved: ApprovedPattern[]
  rejected: RejectedPattern[]
  reconvertQueue: ReconvertEntry[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CAT_COLORS: Record<string, string> = {
  gradients: "#8b6fcf",
  geometric: "#3a8fd4",
  decorative: "#c89a30",
  effects: "#c060a0",
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PASS: { bg: "#052e16", text: "#4ade80" },
  PARTIAL: { bg: "#1a1200", text: "#fbbf24" },
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------

interface Toast { id: number; msg: string; ok: boolean }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 1000 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          role="alert"
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            background: t.ok ? "#052e16" : "#230f0f",
            border: `1px solid ${t.ok ? "#1e4030" : "#3d1818"}`,
            color: t.ok ? "#4ade80" : "#f87171",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            maxWidth: 360,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>{t.ok ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// PatternCard (Pending tab)
// ---------------------------------------------------------------------------

function PatternCard({
  pattern,
  onApprove,
  onReject,
  onReconvert,
}: {
  pattern: ManifestPattern
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onReconvert: (id: string) => Promise<void>
}) {
  const [styleExpanded, setStyleExpanded] = useState(false)
  const [busy, setBusy] = useState(false)

  async function handle(fn: (id: string) => Promise<void>) {
    setBusy(true)
    try { await fn(pattern.id) } finally { setBusy(false) }
  }

  const statusStyle = STATUS_COLORS[pattern.status] ?? { bg: "#111", text: "#a0a0a0" }

  return (
    <div
      style={{
        background: "#111111",
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 4px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
        transition: "border-color 140ms ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#444" }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a" }}
    >
      {/* Thumbnail area */}
      <div style={{ position: "relative", height: 164, background: "#0a0a0a", overflow: "hidden" }}>
        <img
          src={`/api/thumbnail/${pattern.id}`}
          alt={pattern.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
        {/* CSS live preview overlay (right half) */}
        <div
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: "50%", height: "100%",
            ...(pattern.satoriStyle as React.CSSProperties ?? {}),
            opacity: 0.88,
          }}
        />
        {/* Label bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(14,14,12,0.75))",
          padding: "12px 10px 6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 9,
          color: "rgba(232,228,220,0.5)",
        }}>
          <span>Satori PNG</span>
          <span>CSS →</span>
        </div>
        {/* Missing thumbnail warning */}
        {!pattern.thumbnailExists && (
          <div style={{
            position: "absolute",
            top: 6,
            left: 6,
            background: "#1a1200",
            border: "1px solid #4a3800",
            color: "#fbbf24",
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            letterSpacing: "0.05em",
          }}>
            ⚠ NO PNG
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 12px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 13,
            color: "#e8e4dc",
            lineHeight: 1.3,
            flex: 1,
            marginRight: 8,
          }}>
            {pattern.name}
          </span>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: 4,
            background: statusStyle.bg,
            color: statusStyle.text,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {pattern.status}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 10 }}>
          <span style={{
            fontSize: 10, padding: "1px 7px", borderRadius: 4,
            border: `1px solid ${CAT_COLORS[pattern.category] ?? "#444444"}22`,
            background: `${CAT_COLORS[pattern.category] ?? "#888"}18`,
            color: CAT_COLORS[pattern.category] ?? "#a0a0a0",
            fontWeight: 600,
          }}>
            {pattern.category}
          </span>
          <span style={{ fontSize: 10, color: "#6e6a62" }}>{pattern.renderMethod}</span>
        </div>

        {/* Collapsible satoriStyle */}
        {pattern.satoriStyle && (
          <div style={{ marginBottom: 10 }}>
            <button
              onClick={() => setStyleExpanded((v) => !v)}
              style={{
                fontSize: 10,
                color: "#a68a64",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font-body)",
                fontWeight: 500,
              }}
            >
              {styleExpanded ? "Hide style ▲" : "Show satoriStyle ▼"}
            </button>
            {styleExpanded && (
              <pre style={{
                marginTop: 8,
                background: "#0a0a0a",
                color: "#a68a64",
                padding: 10,
                borderRadius: 6,
                fontSize: 10,
                overflow: "auto",
                maxHeight: 160,
                border: "1px solid #222",
                fontFamily: "monospace",
              }}>
                {JSON.stringify(pattern.satoriStyle, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
          <button
            disabled={busy}
            onClick={() => handle(onApprove)}
            style={actionBtnStyle("approve", busy)}
          >
            {busy ? "…" : "Approve"}
          </button>
          <button
            disabled={busy}
            onClick={() => handle(onReject)}
            style={actionBtnStyle("reject", busy)}
          >
            {busy ? "…" : "Reject"}
          </button>
          <button
            disabled={busy}
            onClick={() => handle(onReconvert)}
            style={actionBtnStyle("reconvert", busy)}
          >
            {busy ? "…" : "Reconvert"}
          </button>
        </div>
      </div>
    </div>
  )
}

function actionBtnStyle(variant: "approve" | "reject" | "reconvert", disabled: boolean): React.CSSProperties {
  const configs = {
    approve: { bg: "#1a3a1a", text: "#4ade80", border: "#2d5a2d" },
    reject: { bg: "#3a1a1a", text: "#f87171", border: "#5a2d2d" },
    reconvert: { bg: "#2a2000", text: "#fbbf24", border: "#4a3800" },
  }
  const c = configs[variant]
  return {
    flex: 1,
    padding: "6px 0",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 6,
    border: `1px solid ${c.border}`,
    cursor: disabled ? "not-allowed" : "pointer",
    background: c.bg,
    color: c.text,
    opacity: disabled ? 0.4 : 1,
    transition: "background 140ms ease, opacity 140ms ease",
    fontFamily: "var(--font-body)",
  }
}

// ---------------------------------------------------------------------------
// StatPill
// ---------------------------------------------------------------------------

function StatPill({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: "10px 16px",
      background: "#111",
      borderRadius: 6,
      border: "1px solid #2a2a2a",
      minWidth: 72,
    }}>
      <span style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)", color: color ?? "#e8e4dc", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 12, color: "#6e6a62", fontWeight: 500, letterSpacing: "0.04em" }}>
        {label}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type Tab = "pending" | "reconvert" | "approved" | "rejected"

export default function ReviewPage() {
  const [state, setState] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("pending")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [reconvertLog, setReconvertLog] = useState<string | null>(null)
  const [reconvertRunning, setReconvertRunning] = useState(false)
  const [reconvertDone, setReconvertDone] = useState(false)

  const addToast = useCallback((msg: string, ok: boolean) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, ok }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  async function loadState() {
    setLoading(true)
    try {
      const res = await fetch("/api/state")
      const data = await res.json() as AppState
      setState(data)
    } catch {
      addToast("Failed to load state", false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadState() }, [])

  async function postAction(url: string, body: Record<string, unknown>): Promise<boolean> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.ok
  }

  function optimisticRemove(id: string) {
    setState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        pending: prev.pending.filter((p) => p.id !== id),
        reconvertQueue: prev.reconvertQueue.filter((p) => p.id !== id),
        approved: prev.approved.filter((p) => p.id !== id),
        rejected: prev.rejected.filter((p) => p.id !== id),
        stats: { ...prev.stats },
      }
    })
  }

  async function handleApprove(id: string) {
    const pattern = state?.pending.find((p) => p.id === id)
    optimisticRemove(id)
    const ok = await postAction("/api/approve", { id })
    if (ok) {
      addToast(`Approved: ${pattern?.name ?? id}`, true)
    } else {
      addToast(`Failed to approve: ${id}`, false)
    }
    await loadState()
  }

  async function handleReject(id: string) {
    const pattern = state?.pending.find((p) => p.id === id)
    optimisticRemove(id)
    const ok = await postAction("/api/reject", { id })
    if (ok) {
      addToast(`Rejected: ${pattern?.name ?? id}`, true)
    } else {
      addToast(`Failed to reject: ${id}`, false)
    }
    await loadState()
  }

  async function handleReconvert(id: string) {
    const pattern = state?.pending.find((p) => p.id === id)
    optimisticRemove(id)
    const ok = await postAction("/api/queue-reconvert", { id, reason: "manual" })
    if (ok) {
      addToast(`Queued for reconvert: ${pattern?.name ?? id}`, true)
    } else {
      addToast(`Failed to queue: ${id}`, false)
    }
    await loadState()
  }

  async function handleRunReconversion() {
    setReconvertRunning(true)
    setReconvertDone(false)
    setReconvertLog("Starting reconversion pipeline…\n")
    try {
      const res = await fetch("/api/trigger-reconvert", { method: "POST" })
      const data = await res.json() as { skipped?: boolean; reason?: string; success?: boolean; processed?: number; log?: string; error?: string }
      if (data.skipped) {
        setReconvertLog(`Skipped: ${data.reason ?? "queue is empty"}`)
        addToast("Queue is empty — nothing to reconvert", true)
      } else if (data.success) {
        setReconvertLog(data.log ?? "Done")
        addToast(`Reconversion done — ${data.processed ?? 0} patterns processed`, true)
        setReconvertDone(true)
        setTimeout(() => setReconvertDone(false), 2000)
        await loadState()
      } else {
        setReconvertLog(`Error: ${data.error ?? "unknown"}\n${data.log ?? ""}`)
        addToast(`Reconversion failed: ${data.error ?? "unknown"}`, false)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setReconvertLog(`Network error: ${msg}`)
      addToast("Reconversion request failed", false)
    } finally {
      setReconvertRunning(false)
    }
  }

  if (loading && !state) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0e0e0c" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            border: "2px solid #2a2a2a",
            borderTopColor: "#a68a64",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 13, color: "#6e6a62", fontWeight: 500 }}>Loading review state…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const s = state?.stats

  const tabDefs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Pending", count: state?.pending.length ?? 0 },
    { id: "reconvert", label: "Reconvert Queue", count: state?.reconvertQueue.length ?? 0 },
    { id: "approved", label: "Approved", count: state?.approved.length ?? 0 },
    { id: "rejected", label: "Rejected", count: state?.rejected.length ?? 0 },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#0e0e0c" }}>
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* Header */}
      <header style={{
        background: "#0f1410",
        borderBottom: "1px solid #1e2a1e",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Top bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0 12px",
            borderBottom: "1px solid #1a2318",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "-0.02em",
                color: "#ffffff",
              }}>
                Satori Patterns
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#656d4a",
                padding: "2px 8px",
                borderRadius: 4,
                background: "#1a2318",
              }}>
                Review Tool
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handleRunReconversion}
                disabled={reconvertRunning}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: reconvertDone ? "#1a3a1a" : (reconvertRunning ? "#1a1a16" : "#a68a64"),
                  color: reconvertDone ? "#4ade80" : (reconvertRunning ? "#6e6a62" : "#ffffff"),
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: reconvertRunning ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all 200ms ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: reconvertRunning ? 0.7 : 1,
                }}
              >
                {reconvertRunning && (
                  <span style={{
                    display: "inline-block",
                    width: 10, height: 10,
                    border: "1.5px solid #6e6a62",
                    borderTopColor: "#a68a64",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }} />
                )}
                {reconvertRunning ? "Running…" : reconvertDone ? "Done ✓" : "Run Reconversion"}
              </button>
              <button
                onClick={loadState}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: "1px solid #444",
                  background: "transparent",
                  color: "#ede0d4",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "background 140ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats strip */}
          {s && (
            <div style={{ display: "flex", gap: 10, padding: "12px 0", overflowX: "auto" }}>
              <StatPill label="Total" value={s.total} />
              <StatPill label="Pending" value={s.pendingReview} color="#d4a574" />
              <StatPill label="Approved" value={s.approved} color="#4ade80" />
              <StatPill label="Rejected" value={s.rejected} color="#f87171" />
              <StatPill label="Reconvert" value={s.inReconvertQueue} color="#fbbf24" />
            </div>
          )}
        </div>
      </header>

      {/* Reconversion log */}
      {reconvertLog && (
        <div style={{ background: "#0a0a0a", borderBottom: "1px solid #222", padding: "0 24px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 0" }}>
            <pre style={{
              background: "#0a0a0a",
              color: "#a0a0a0",
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 12,
              overflow: "auto",
              maxHeight: 240,
              border: "1px solid #222",
              fontFamily: "monospace",
              margin: 0,
              lineHeight: 1.6,
            }}>
              {reconvertLog}
            </pre>
          </div>
        </div>
      )}

      {/* Tabs + content */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px" }}>
        {/* Tab bar — border-bottom indicator style */}
        <div style={{
          display: "flex",
          gap: 0,
          marginBottom: 20,
          borderBottom: "1px solid #222",
          overflowX: "auto",
        }}>
          {tabDefs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 0,
                border: "none",
                borderBottom: tab === t.id ? "2px solid #a68a64" : "2px solid transparent",
                background: "transparent",
                color: tab === t.id ? "#ffffff" : "#6e6a62",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "color 140ms ease",
                whiteSpace: "nowrap",
                marginBottom: -1,
              }}
              onMouseEnter={(e) => { if (tab !== t.id) e.currentTarget.style.color = "#a8a49a" }}
              onMouseLeave={(e) => { if (tab !== t.id) e.currentTarget.style.color = "#6e6a62" }}
            >
              {t.label}
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "0 5px",
                borderRadius: 10,
                background: "#222",
                color: "#a0a0a0",
                minWidth: 18,
                textAlign: "center",
                lineHeight: "16px",
              }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Pending tab */}
        {tab === "pending" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
            {state?.pending.length === 0 && (
              <div style={{
                gridColumn: "1/-1",
                padding: "48px 32px",
                textAlign: "center",
                color: "#6e6a62",
                fontSize: 14,
                background: "#111",
                borderRadius: 10,
                border: "1px dashed #2a2a2a",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                <div style={{ fontWeight: 600, color: "#a8a49a", marginBottom: 4 }}>All done!</div>
                <div>No patterns pending review.</div>
              </div>
            )}
            {state?.pending.map((p) => (
              <PatternCard
                key={p.id}
                pattern={p}
                onApprove={handleApprove}
                onReject={handleReject}
                onReconvert={handleReconvert}
              />
            ))}
          </div>
        )}

        {/* Reconvert Queue tab */}
        {tab === "reconvert" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {state?.reconvertQueue.length === 0 && (
              <div style={{ color: "#6e6a62", fontSize: 14, padding: "32px", textAlign: "center", background: "#111", borderRadius: 10, border: "1px solid #2a2a2a" }}>
                Reconvert queue is empty.
              </div>
            )}
            {state?.reconvertQueue.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  background: "#111",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                }}
              >
                <img
                  src={`/api/thumbnail/${entry.id}`}
                  alt={entry.id}
                  style={{ width: 64, height: 34, objectFit: "cover", borderRadius: 5, background: "#0a0a0a", flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e8e4dc", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.id}</div>
                  <div style={{ fontSize: 11, color: "#6e6a62", marginTop: 2 }}>
                    Reason: <span style={{ color: "#a68a64" }}>{entry.reason}</span> · {new Date(entry.queuedAt).toLocaleString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "#1a1200", color: "#fbbf24",
                  border: "1px solid #4a3800", whiteSpace: "nowrap",
                }}>
                  QUEUED
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Approved tab */}
        {tab === "approved" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {state?.approved.length === 0 && (
              <div style={{ color: "#6e6a62", fontSize: 14, padding: "32px", textAlign: "center", background: "#111", borderRadius: 10, border: "1px solid #2a2a2a" }}>
                No approved patterns yet.
              </div>
            )}
            {state?.approved.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 14px",
                  background: "#111",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                }}
              >
                <img
                  src={`/api/thumbnail/${p.id}`}
                  alt={p.name}
                  style={{ width: 64, height: 34, objectFit: "cover", borderRadius: 5, background: "#0a0a0a", flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e8e4dc", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#6e6a62", marginTop: 2 }}>
                    {p.category} · {new Date(p.approvedAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "#052e16", color: "#4ade80",
                  border: "1px solid #1e4030", whiteSpace: "nowrap",
                }}>
                  APPROVED
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Rejected tab */}
        {tab === "rejected" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {state?.rejected.length === 0 && (
              <div style={{ color: "#6e6a62", fontSize: 14, padding: "32px", textAlign: "center", background: "#111", borderRadius: 10, border: "1px solid #2a2a2a" }}>
                No rejected patterns.
              </div>
            )}
            {state?.rejected.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 14px",
                  background: "#111",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#e8e4dc", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#6e6a62", marginTop: 2 }}>
                    {p.category} · {new Date(p.rejectedAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "#230f0f", color: "#f87171",
                  border: "1px solid #3d1818", whiteSpace: "nowrap",
                }}>
                  REJECTED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          header { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  )
}
