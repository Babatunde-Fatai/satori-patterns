import { NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs"
import { spawn } from "node:child_process"

const REPO_ROOT = path.resolve(process.cwd(), "..", "..")

interface ReconvertQueueFile {
  meta: { updatedAt: string; count: number }
  patterns: { id: string; queuedAt: string; reason: string }[]
}

function readJson<T>(p: string): T { return JSON.parse(fs.readFileSync(p, "utf8")) as T }
function writeJson<T extends { meta: { updatedAt: string; count: number }; patterns: unknown[] }>(p: string, data: T): void {
  data.meta.count = data.patterns.length
  data.meta.updatedAt = new Date().toISOString()
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8")
}

export async function POST() {
  const reconvertPath = path.join(REPO_ROOT, "data", "reconvert-queue.json")
  const diffReportPath = path.join(REPO_ROOT, "scripts", "diff-report.json")

  const queue = readJson<ReconvertQueueFile>(reconvertPath)

  if (queue.patterns.length === 0) {
    return NextResponse.json({ skipped: true, reason: "queue is empty" })
  }

  const ids = queue.patterns.map((p) => p.id)

  // Write a temporary diff-report.json containing only queued IDs
  const diffReport = {
    added: [],
    modified: ids,
    removed: [],
    upstreamCommit: "reconvert-trigger",
    localCommit: "reconvert-trigger",
    date: new Date().toISOString(),
  }
  fs.writeFileSync(diffReportPath, JSON.stringify(diffReport, null, 2) + "\n", "utf8")

  // Run the pipeline steps
  const cmd = "npm run pipeline:translate -- --only-changed && npm run pipeline:render -- --only-changed && npm run build:index"
  const log: string[] = []

  await new Promise<void>((resolve, reject) => {
    const child = spawn("sh", ["-c", cmd], { cwd: REPO_ROOT, env: process.env })

    child.stdout.on("data", (chunk: Buffer) => { log.push(chunk.toString()) })
    child.stderr.on("data", (chunk: Buffer) => { log.push(chunk.toString()) })

    child.on("close", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Pipeline exited with code ${code}`))
    })
  }).catch((err) => {
    return NextResponse.json({ success: false, log: log.join(""), error: (err as Error).message }, { status: 500 })
  })

  // After reconversion, remove successfully re-rendered patterns from the queue.
  // A pattern is considered processed if it now has status PASS or PARTIAL in the manifest.
  const compatPath = path.join(REPO_ROOT, "compatibility.json")
  const manifest = readJson<{ patterns: { id: string; status: string }[] }>(compatPath)

  const updatedQueue = readJson<ReconvertQueueFile>(reconvertPath)
  const remaining = updatedQueue.patterns.filter((entry) => {
    const m = manifest.patterns.find((p) => p.id === entry.id)
    // Keep in queue if manifest still shows FAIL/SILENT_FAIL/UNCLASSIFIED
    if (!m) return true
    return m.status !== "PASS" && m.status !== "PARTIAL"
  })
  updatedQueue.patterns = remaining
  writeJson(reconvertPath, updatedQueue)

  const processed = ids.length - remaining.length

  return NextResponse.json({ success: true, processed, log: log.join("") })
}
