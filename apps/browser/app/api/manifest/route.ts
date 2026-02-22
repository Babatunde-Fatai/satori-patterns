import { NextResponse } from "next/server"
import fs from "node:fs"
import path from "node:path"

export async function GET() {
  const manifestPath = path.join(process.cwd(), "..", "..", "compatibility.json")
  try {
    const raw = fs.readFileSync(manifestPath, "utf8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ error: "Manifest not found" }, { status: 500 })
  }
}
