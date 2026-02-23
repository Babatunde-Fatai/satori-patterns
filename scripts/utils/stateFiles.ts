/**
 * stateFiles.ts — typed read/write helpers for data/approved.json,
 * data/rejected.json, and data/reconvert-queue.json.
 *
 * These files ARE committed to the repo. They are the human-approval source
 * of truth. Do NOT add data/ to .gitignore.
 *
 * Mirrors the pattern from scripts/utils/manifest.ts.
 */
import fs from "node:fs"
import path from "node:path"
import { readManifest } from "./manifest"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApprovedPattern {
  id: string
  name: string
  category: string
  approvedAt: string
  satoriStyle: Record<string, unknown> | null
  renderMethod: "css" | "svg-fallback"
  notes: string[]
}

export interface RejectedPattern {
  id: string
  name: string
  category: string
  rejectedAt: string
  satoriStyle: Record<string, unknown> | null
  renderMethod: "css" | "svg-fallback"
  notes: string[]
}

export interface ReconvertQueueEntry {
  id: string
  queuedAt: string
  reason: string
}

export interface ApprovedFile {
  _comment?: string
  meta: { updatedAt: string; count: number }
  patterns: ApprovedPattern[]
}

export interface RejectedFile {
  _comment?: string
  meta: { updatedAt: string; count: number }
  patterns: RejectedPattern[]
}

export interface ReconvertQueueFile {
  _comment?: string
  meta: { updatedAt: string; count: number }
  patterns: ReconvertQueueEntry[]
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(process.cwd())
const DATA_DIR = path.join(ROOT, "data")

const APPROVED_PATH = path.join(DATA_DIR, "approved.json")
const REJECTED_PATH = path.join(DATA_DIR, "rejected.json")
const RECONVERT_PATH = path.join(DATA_DIR, "reconvert-queue.json")

// ---------------------------------------------------------------------------
// Low-level read/write
// ---------------------------------------------------------------------------

export function readApproved(): ApprovedFile {
  const raw = fs.readFileSync(APPROVED_PATH, "utf8")
  return JSON.parse(raw) as ApprovedFile
}

export function writeApproved(data: ApprovedFile): void {
  data.meta.count = data.patterns.length
  data.meta.updatedAt = new Date().toISOString()
  fs.writeFileSync(APPROVED_PATH, JSON.stringify(data, null, 2) + "\n", "utf8")
}

export function readRejected(): RejectedFile {
  const raw = fs.readFileSync(REJECTED_PATH, "utf8")
  return JSON.parse(raw) as RejectedFile
}

export function writeRejected(data: RejectedFile): void {
  data.meta.count = data.patterns.length
  data.meta.updatedAt = new Date().toISOString()
  fs.writeFileSync(REJECTED_PATH, JSON.stringify(data, null, 2) + "\n", "utf8")
}

export function readReconvertQueue(): ReconvertQueueFile {
  const raw = fs.readFileSync(RECONVERT_PATH, "utf8")
  return JSON.parse(raw) as ReconvertQueueFile
}

export function writeReconvertQueue(data: ReconvertQueueFile): void {
  data.meta.count = data.patterns.length
  data.meta.updatedAt = new Date().toISOString()
  fs.writeFileSync(RECONVERT_PATH, JSON.stringify(data, null, 2) + "\n", "utf8")
}

// ---------------------------------------------------------------------------
// High-level state operations
// ---------------------------------------------------------------------------

/**
 * Approve a pattern by ID.
 * - Reads the pattern from compatibility.json manifest.
 * - Appends to approved.json (no-op if already present).
 * - Removes from rejected.json and reconvert-queue.json if present.
 */
export function approvePattern(id: string): ApprovedPattern {
  const manifest = readManifest()
  const entry = manifest.patterns.find((p) => p.id === id)
  if (!entry) {
    throw new Error(`approvePattern: pattern "${id}" not found in compatibility.json`)
  }
  if (entry.renderMethod === "none") {
    throw new Error(`approvePattern: pattern "${id}" has renderMethod "none", cannot approve`)
  }

  const now = new Date().toISOString()

  // Add to approved if not already there
  const approved = readApproved()
  const alreadyApproved = approved.patterns.some((p) => p.id === id)
  if (!alreadyApproved) {
    const record: ApprovedPattern = {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      approvedAt: now,
      satoriStyle: entry.satoriStyle,
      renderMethod: entry.renderMethod as "css" | "svg-fallback",
      notes: [],
    }
    approved.patterns.push(record)
    writeApproved(approved)
  }

  // Remove from rejected if present
  const rejected = readRejected()
  const rejectedIdx = rejected.patterns.findIndex((p) => p.id === id)
  if (rejectedIdx >= 0) {
    rejected.patterns.splice(rejectedIdx, 1)
    writeRejected(rejected)
  }

  // Remove from reconvert-queue if present
  const queue = readReconvertQueue()
  const queueIdx = queue.patterns.findIndex((p) => p.id === id)
  if (queueIdx >= 0) {
    queue.patterns.splice(queueIdx, 1)
    writeReconvertQueue(queue)
  }

  return approved.patterns.find((p) => p.id === id)!
}

/**
 * Reject a pattern by ID.
 * - Removes from approved.json if present.
 * - Appends to rejected.json (no-op if already present).
 */
export function rejectPattern(id: string): void {
  const manifest = readManifest()
  const entry = manifest.patterns.find((p) => p.id === id)
  if (!entry) {
    throw new Error(`rejectPattern: pattern "${id}" not found in compatibility.json`)
  }

  const now = new Date().toISOString()

  // Remove from approved if present
  const approved = readApproved()
  const approvedIdx = approved.patterns.findIndex((p) => p.id === id)
  if (approvedIdx >= 0) {
    approved.patterns.splice(approvedIdx, 1)
    writeApproved(approved)
  }

  // Add to rejected if not already there
  const rejected = readRejected()
  const alreadyRejected = rejected.patterns.some((p) => p.id === id)
  if (!alreadyRejected) {
    const record: RejectedPattern = {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      rejectedAt: now,
      satoriStyle: entry.satoriStyle,
      renderMethod: entry.renderMethod as "css" | "svg-fallback",
      notes: [],
    }
    rejected.patterns.push(record)
    writeRejected(rejected)
  }
}

/**
 * Queue a pattern for reconversion.
 * - Removes from approved.json if present.
 * - Appends to reconvert-queue.json (no-op if already queued).
 */
export function queueForReconvert(id: string, reason: string): void {
  const manifest = readManifest()
  const entry = manifest.patterns.find((p) => p.id === id)
  if (!entry) {
    throw new Error(`queueForReconvert: pattern "${id}" not found in compatibility.json`)
  }

  const now = new Date().toISOString()

  // Remove from approved if present
  const approved = readApproved()
  const approvedIdx = approved.patterns.findIndex((p) => p.id === id)
  if (approvedIdx >= 0) {
    approved.patterns.splice(approvedIdx, 1)
    writeApproved(approved)
  }

  // Add to queue if not already there
  const queue = readReconvertQueue()
  const alreadyQueued = queue.patterns.some((p) => p.id === id)
  if (!alreadyQueued) {
    queue.patterns.push({ id, queuedAt: now, reason })
    writeReconvertQueue(queue)
  }
}
