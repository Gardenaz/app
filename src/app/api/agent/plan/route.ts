import { NextResponse } from "next/server";
import { maybeAnchorDecision } from "@/lib/agent/anchor";
import { requestAgentPlan } from "@/lib/agent/service";
import { saveDecision } from "@/lib/agent/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { decision, anchor, source } = await requestAgentPlan({
      user: body.user,
      crop: body.crop,
      amount: String(body.amount),
      riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
    });

    const fallbackAnchor = source === "local-fallback" ? await maybeAnchorDecision(decision) : anchor;
    const anchorTxHash = fallbackAnchor?.txHash ?? undefined;
    await saveDecision({ ...decision, anchorTxHash });

    return NextResponse.json({ ok: true, decision: { ...decision, anchorTxHash }, anchor: fallbackAnchor, source });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
