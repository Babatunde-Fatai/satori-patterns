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
    const body = await req.json() as { id: string; reason?: string }
    const { id, reason = "manual" } = body
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const compatPath = path.join(REPO_ROOT, "compatibility.json")
    const approvedPath = path.join(REPO_ROOT, "data", "approved.json")
    const reconvertPath = path.join(REPO_ROOT, "data", "reconvert-queue.json")

    const manifest = readJson<{ patterns: { id: string }[] }>(compatPath)
    if (!manifest.patterns.find((p) => p.id === id)) {
      return NextResponse.json({ error: `Pattern "${id}" not found` }, { status: 404 })
    }

    const now = new Date().toISOString()

    // Remove from approved
    const approved = readJson<StateFile<{ id: string }>>(approvedPath)
    const ai = approved.patterns.findIndex((p) => p.id === id)
    if (ai >= 0) { approved.patterns.splice(ai, 1); writeJson(approvedPath, approved) }

    // Add to queue
    const queue = readJson<StateFile<{ id: string; queuedAt: string; reason: string }>>(reconvertPath)
    if (!queue.patterns.some((p) => p.id === id)) {
      queue.patterns.push({ id, queuedAt: now, reason })
      writeJson(reconvertPath, queue)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
