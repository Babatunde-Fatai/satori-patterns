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

const THUMBNAIL_BASE = process.env.NEXT_PUBLIC_THUMBNAIL_BASE_URL ?? "http://localhost:3000/thumbnails"

const CAT_COLORS: Record<string, string> = {
  gradients: "#8b6fcf",
  geometric: "#3a8fd4",
  decorative: "#c89a30",
  effects: "#c060a0",
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PASS: { bg: "var(--green-bg)", text: "#5aaa78" },
  PARTIAL: { bg: "var(--amber-bg)", text: "#c8a030" },
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
            borderRadius: "var(--radius-md)",
            background: t.ok ? "var(--green-bg)" : "var(--red-bg)",
            border: `1px solid ${t.ok ? "var(--green-border)" : "var(--red-border)"}`,
            color: t.ok ? "#5aaa78" : "#e06060",
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

  const statusStyle = STATUS_COLORS[pattern.status] ?? { bg: "var(--bg-elevated)", text: "var(--text-muted)" }

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        border: "1px solid var(--bg-border)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-card)",
        transition: "border-color var(--transition)",
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", height: 164, background: "var(--bg-base)", overflow: "hidden" }}>
        <img
          src={`${THUMBNAIL_BASE}/${pattern.id}.png`}
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
      </div>

      {/* Info */}
      <div style={{ padding: "12px 12px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: 13,
            color: "var(--text-primary)",
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
            border: `1px solid ${CAT_COLORS[pattern.category] ?? "var(--bg-border-light)"}22`,
            background: `${CAT_COLORS[pattern.category] ?? "#888"}18`,
            color: CAT_COLORS[pattern.category] ?? "var(--text-muted)",
            fontWeight: 600,
          }}>
            {pattern.category}
          </span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{pattern.renderMethod}</span>
        </div>

        {/* Collapsible satoriStyle */}
        {pattern.satoriStyle && (
          <div style={{ marginBottom: 10 }}>
            <button
              onClick={() => setStyleExpanded((v) => !v)}
              style={{
                fontSize: 10,
                color: "var(--accent-warm)",
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
                background: "var(--bg-base)",
                color: "var(--accent-warm)",
                padding: 10,
                borderRadius: "var(--radius-sm)",
                fontSize: 10,
                overflow: "auto",
                maxHeight: 160,
                border: "1px solid var(--bg-border)",
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
    approve: { bg: "var(--green-bg)", text: "#5aaa78", border: "var(--green-border)", hoverBg: "#163826" },
    reject: { bg: "var(--red-bg)", text: "#e06060", border: "var(--red-border)", hoverBg: "#3d1818" },
    reconvert: { bg: "var(--amber-bg)", text: "#c8a030", border: "var(--amber-border)", hoverBg: "#2e2010" },
  }
  const c = configs[variant]
  return {
    flex: 1,
    padding: "6px 0",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${c.border}`,
    cursor: disabled ? "not-allowed" : "pointer",
    background: c.bg,
    color: c.text,
    opacity: disabled ? 0.4 : 1,
    transition: "opacity var(--transition)",
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
      gap: 2,
      padding: "8px 14px",
      background: "var(--bg-elevated)",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--bg-border)",
    }}>
      <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)", color: color ?? "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.04em" }}>
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-base)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            border: "2px solid var(--bg-border)",
            borderTopColor: "var(--accent-warm)",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Loading review state…</span>
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
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* Header */}
      <header style={{
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--bg-border)",
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
            borderBottom: "1px solid var(--bg-border)",
            flexWrap: "wrap",
            gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "var(--accent-warm)",
                boxShadow: "0 0 6px var(--accent-warm)",
              }} />
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}>
                Satori Patterns
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                padding: "2px 6px",
                borderRadius: 4,
                border: "1px solid var(--bg-border-light)",
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
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--amber-border)",
                  background: reconvertRunning ? "var(--bg-elevated)" : "var(--amber-bg)",
                  color: reconvertRunning ? "var(--text-muted)" : "#c8a030",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: reconvertRunning ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "all var(--transition)",
                  opacity: reconvertRunning ? 0.6 : 1,
                }}
              >
                {reconvertRunning ? "Running…" : "Run Reconversion"}
              </button>
              <button
                onClick={loadState}
                style={{
                  padding: "7px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--bg-border-light)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "border-color var(--transition)",
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Stats strip */}
          {s && (
            <div style={{ display: "flex", gap: 10, padding: "10px 0", overflowX: "auto" }}>
              <StatPill label="Total" value={s.total} />
              <StatPill label="Pending" value={s.pendingReview} color="#c8a030" />
              <StatPill label="Approved" value={s.approved} color="#5aaa78" />
              <StatPill label="Rejected" value={s.rejected} color="#e06060" />
              <StatPill label="Reconvert" value={s.inReconvertQueue} color="#c8a030" />
            </div>
          )}
        </div>
      </header>

      {/* Reconversion log */}
      {reconvertLog && (
        <div style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--bg-border)", padding: "0 24px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 0" }}>
            <pre style={{
              background: "var(--bg-base)",
              color: "var(--accent-warm)",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 11,
              overflow: "auto",
              maxHeight: 180,
              border: "1px solid var(--bg-border)",
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
        {/* Tab bar */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "var(--bg-surface)", padding: 4, borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)", width: "fit-content", overflowX: "auto" }}>
          {tabDefs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: tab === t.id ? "var(--bg-elevated)" : "transparent",
                color: tab === t.id ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all var(--transition)",
                whiteSpace: "nowrap",
                boxShadow: tab === t.id ? "var(--shadow-card)" : "none",
              }}
            >
              {t.label}
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "0 5px",
                borderRadius: 10,
                background: tab === t.id ? "var(--accent)" : "var(--bg-border)",
                color: tab === t.id ? "#fff" : "var(--text-muted)",
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
                color: "var(--text-muted)",
                fontSize: 14,
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--bg-border-light)",
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>All done!</div>
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
              <div style={{ color: "var(--text-muted)", fontSize: 14, padding: "32px", textAlign: "center", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
                Reconvert queue is empty.
              </div>
            )}
            {state?.reconvertQueue.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                <img
                  src={`${THUMBNAIL_BASE}/${entry.id}.png`}
                  alt={entry.id}
                  style={{ width: 64, height: 34, objectFit: "cover", borderRadius: 5, background: "var(--bg-base)", flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.id}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    Reason: <span style={{ color: "var(--accent-warm)" }}>{entry.reason}</span> · {new Date(entry.queuedAt).toLocaleString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "var(--amber-bg)", color: "#c8a030",
                  border: "1px solid var(--amber-border)", whiteSpace: "nowrap",
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
              <div style={{ color: "var(--text-muted)", fontSize: 14, padding: "32px", textAlign: "center", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
                No approved patterns yet.
              </div>
            )}
            {state?.approved.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 14px",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                <img
                  src={`${THUMBNAIL_BASE}/${p.id}.png`}
                  alt={p.name}
                  style={{ width: 64, height: 34, objectFit: "cover", borderRadius: 5, background: "var(--bg-base)", flexShrink: 0 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {p.category} · {new Date(p.approvedAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "var(--green-bg)", color: "#5aaa78",
                  border: "1px solid var(--green-border)", whiteSpace: "nowrap",
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
              <div style={{ color: "var(--text-muted)", fontSize: 14, padding: "32px", textAlign: "center", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
                No rejected patterns.
              </div>
            )}
            {state?.rejected.map((p) => (
              <div
                key={p.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 14px",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 600, fontFamily: "var(--font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {p.category} · {new Date(p.rejectedAt).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 4, background: "var(--red-bg)", color: "#e06060",
                  border: "1px solid var(--red-border)", whiteSpace: "nowrap",
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
          div[style*="max-width: 1400px"] { padding-left: 16px !important; padding-right: 16px !important; }
        }
      `}</style>
    </div>
  )
}
