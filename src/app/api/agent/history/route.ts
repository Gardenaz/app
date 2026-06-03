import { NextResponse } from "next/server";
import { fetchOnchainDecisionHistory, toHistoryRow } from "@/lib/agent/history";
import { listDecisions } from "@/lib/agent/store";

export async function GET() {
  try {
    const rows = await fetchOnchainDecisionHistory();
    return NextResponse.json({ ok: true, rows, source: "onchain" });
  } catch {
    const rows = (await listDecisions()).map(toHistoryRow);
    return NextResponse.json({ ok: true, rows, source: "local-fallback" });
  }
}
