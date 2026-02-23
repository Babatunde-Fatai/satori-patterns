import { NextResponse } from "next/server"
import path from "node:path"
import fs from "node:fs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Sanitize id: no path traversal
  if (!id || id.includes("/") || id.includes("..") || id.includes("\0")) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 })
  }

  const thumbPath = path.join(
    process.cwd(),
    "..",
    "browser",
    "public",
    "thumbnails",
    `${id}.png`
  )

  if (!fs.existsSync(thumbPath)) {
    return NextResponse.json({ error: "thumbnail not found" }, { status: 404 })
  }

  const buffer = fs.readFileSync(thumbPath)
  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300",
      "Content-Length": String(buffer.byteLength),
    },
  })
}
