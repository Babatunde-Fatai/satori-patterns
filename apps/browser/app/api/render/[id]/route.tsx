import { ImageResponse } from "@vercel/og"
import { NextRequest, NextResponse } from "next/server"
import approvedData from "../../../../../../data/approved.json"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const pattern = approvedData.patterns.find((p) => p.id === id)

  if (!pattern) {
    return NextResponse.json({ error: `Pattern not found: ${id}` }, { status: 404 })
  }

  if (!pattern.satoriStyle || pattern.renderMethod !== "css") {
    return NextResponse.json(
      { error: `Pattern ${id} is not CSS-renderable (method: ${pattern.renderMethod})` },
      { status: 400 }
    )
  }

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            ...(pattern.satoriStyle as Record<string, unknown>),
          }}
        />
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      }
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Render failed: ${msg}` }, { status: 500 })
  }
}
