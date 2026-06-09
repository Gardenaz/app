import { NextResponse } from "next/server";
import { requestLiveReadiness } from "@/lib/agent/service";

export async function GET() {
  try {
    const result = await requestLiveReadiness();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "failed to read live readiness" },
      { status: 502 },
    );
  }
}
