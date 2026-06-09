import { NextResponse } from "next/server";
import { fetchOnchainDecisionHistory } from "@/lib/agent/history";

export async function GET() {
  try {
    const rows = await fetchOnchainDecisionHistory();
    return NextResponse.json({ ok: true, rows, source: "onchain" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, rows: [], source: "onchain", error: error instanceof Error ? error.message : "failed to read on-chain history" },
      { status: 502 },
    );
  }
}
