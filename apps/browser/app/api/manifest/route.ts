import { NextResponse } from "next/server"
import approvedData from "../../../../../data/approved.json"

export async function GET() {
  return NextResponse.json(approvedData)
}
