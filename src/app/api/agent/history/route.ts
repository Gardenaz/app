import { NextResponse } from "next/server";
import { fetchOnchainDecisionHistory } from "@/lib/agent/history";

const SIMULATE = process.env.NEXT_PUBLIC_SIMULATE !== "false";

export async function GET() {
  if (SIMULATE) {
    return NextResponse.json({ ok: true, rows: [], source: "sim" });
  }
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
