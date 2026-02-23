import { NextRequest, NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs"

// Next.js dev server sets cwd to the app directory (apps/review/).
// ".., .." resolves to the repo root from there.
const REPO_ROOT = path.resolve(process.cwd(), "..", "..")

interface ApprovedPattern {
  id: string; name: string; category: string; approvedAt: string
  satoriStyle: Record<string, unknown> | null; renderMethod: string; notes: string[]
}
interface StateFile<T> { _comment?: string; meta: { updatedAt: string; count: number }; patterns: T[] }

function readJson<T>(p: string): T { return JSON.parse(fs.readFileSync(p, "utf8")) as T }
function writeJson<T extends { meta: { updatedAt: string; count: number }; patterns: unknown[] }>(p: string, data: T): void {
  data.meta.count = data.patterns.length
  data.meta.updatedAt = new Date().toISOString()
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8")
}

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json() as { id: string }
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const compatPath = path.join(REPO_ROOT, "compatibility.json")
    const approvedPath = path.join(REPO_ROOT, "data", "approved.json")
    const rejectedPath = path.join(REPO_ROOT, "data", "rejected.json")
    const reconvertPath = path.join(REPO_ROOT, "data", "reconvert-queue.json")

    const manifest = readJson<{ patterns: { id: string; name: string; category: string; satoriStyle: Record<string, unknown> | null; renderMethod: string }[] }>(compatPath)
    const entry = manifest.patterns.find((p) => p.id === id)
    if (!entry) return NextResponse.json({ error: `Pattern "${id}" not found` }, { status: 404 })

    const now = new Date().toISOString()

    const approved = readJson<StateFile<ApprovedPattern>>(approvedPath)
    if (!approved.patterns.some((p) => p.id === id)) {
      approved.patterns.push({
        id: entry.id, name: entry.name, category: entry.category,
        approvedAt: now, satoriStyle: entry.satoriStyle,
        renderMethod: entry.renderMethod, notes: [],
      })
      writeJson(approvedPath, approved)
    }

    const rejected = readJson<StateFile<{ id: string }>>(rejectedPath)
    const ri = rejected.patterns.findIndex((p) => p.id === id)
    if (ri >= 0) { rejected.patterns.splice(ri, 1); writeJson(rejectedPath, rejected) }

    const queue = readJson<StateFile<{ id: string }>>(reconvertPath)
    const qi = queue.patterns.findIndex((p) => p.id === id)
    if (qi >= 0) { queue.patterns.splice(qi, 1); writeJson(reconvertPath, queue) }

    return NextResponse.json({ success: true, pattern: { id: entry.id, name: entry.name } })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
