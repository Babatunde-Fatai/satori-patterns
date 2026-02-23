import { NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs"

const REPO_ROOT = path.resolve(process.cwd(), "..", "..")

function readJson<T>(p: string): T { return JSON.parse(fs.readFileSync(p, "utf8")) as T }

interface ManifestPattern {
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

interface StateFile<T> { meta: { updatedAt: string; count: number }; patterns: T[] }

export async function GET() {
  try {
    const compatPath = path.join(REPO_ROOT, "compatibility.json")
    const approvedPath = path.join(REPO_ROOT, "data", "approved.json")
    const rejectedPath = path.join(REPO_ROOT, "data", "rejected.json")
    const reconvertPath = path.join(REPO_ROOT, "data", "reconvert-queue.json")

    const manifest = readJson<{ meta: Record<string, string>; patterns: ManifestPattern[] }>(compatPath)
    const approved = readJson<StateFile<{ id: string }>>(approvedPath)
    const rejected = readJson<StateFile<{ id: string }>>(rejectedPath)
    const reconvert = readJson<StateFile<{ id: string; queuedAt: string; reason: string }>>(reconvertPath)

    const approvedIds = new Set(approved.patterns.map((p) => p.id))
    const rejectedIds = new Set(rejected.patterns.map((p) => p.id))
    const reconvertIds = new Set(reconvert.patterns.map((p) => p.id))

    // Pending = PASS or PARTIAL, not yet in any decision bucket
    const pending = manifest.patterns.filter(
      (p) =>
        (p.status === "PASS" || p.status === "PARTIAL") &&
        !approvedIds.has(p.id) &&
        !rejectedIds.has(p.id) &&
        !reconvertIds.has(p.id)
    )

    return NextResponse.json({
      manifestMeta: manifest.meta,
      total: manifest.patterns.length,
      pending,
      approved: approved.patterns,
      rejected: rejected.patterns,
      reconvertQueue: reconvert.patterns,
      stats: {
        total: manifest.patterns.length,
        pendingReview: pending.length,
        approved: approved.patterns.length,
        rejected: rejected.patterns.length,
        inReconvertQueue: reconvert.patterns.length,
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
