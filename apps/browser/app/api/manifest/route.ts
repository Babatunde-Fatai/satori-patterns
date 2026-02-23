import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

function resolveApprovedPath(): string {
  const envPath = process.env.APPROVED_PATH
  if (envPath) {
    return path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath)
  }
  // Local dev fallback: data/approved.json copied by prebuild
  return path.join(process.cwd(), "data", "approved.json")
}

export async function GET() {
  const approvedPath = resolveApprovedPath()
  try {
    const raw = fs.readFileSync(approvedPath, "utf8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ error: "approved.json not found" }, { status: 500 })
  }
}
