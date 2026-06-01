import { NextResponse } from "next/server";
import { runAgent } from "@gardena/agent";
import { maybeAnchorDecision } from "@/lib/agent/anchor";
import { saveDecision } from "@/lib/agent/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const decision = runAgent({
      user: body.user,
      crop: body.crop,
      amount: String(body.amount),
      riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
    });

    const anchor = await maybeAnchorDecision(decision);
    await saveDecision({ ...decision, anchorTxHash: anchor.txHash });

    return NextResponse.json({ ok: true, decision: { ...decision, anchorTxHash: anchor.txHash }, anchor });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
