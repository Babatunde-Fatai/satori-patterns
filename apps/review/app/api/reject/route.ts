import { NextRequest, NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs"

const REPO_ROOT = path.resolve(process.cwd(), "..", "..")

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

    const manifest = readJson<{ patterns: { id: string; name: string; category: string; satoriStyle: Record<string, unknown> | null; renderMethod: string }[] }>(compatPath)
    const entry = manifest.patterns.find((p) => p.id === id)
    if (!entry) return NextResponse.json({ error: `Pattern "${id}" not found` }, { status: 404 })

    const now = new Date().toISOString()

    // Remove from approved
    const approved = readJson<StateFile<{ id: string }>>(approvedPath)
    const ai = approved.patterns.findIndex((p) => p.id === id)
    if (ai >= 0) { approved.patterns.splice(ai, 1); writeJson(approvedPath, approved) }

    // Add to rejected
    const rejected = readJson<StateFile<{ id: string; name: string; category: string; rejectedAt: string; satoriStyle: Record<string, unknown> | null; renderMethod: string; notes: string[] }>>(rejectedPath)
    if (!rejected.patterns.some((p) => p.id === id)) {
      rejected.patterns.push({
        id: entry.id, name: entry.name, category: entry.category,
        rejectedAt: now, satoriStyle: entry.satoriStyle,
        renderMethod: entry.renderMethod, notes: [],
      })
      writeJson(rejectedPath, rejected)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
