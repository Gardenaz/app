import { NextResponse } from "next/server";
import { listDecisions } from "@/lib/agent/store";

export async function GET() {
  const rows = await listDecisions();
  return NextResponse.json({ ok: true, rows });
}
