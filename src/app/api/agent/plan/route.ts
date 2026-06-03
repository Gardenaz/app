import { NextResponse } from "next/server";
import { maybeAnchorDecision } from "@/lib/agent/anchor";
import { requestAgentGardenPlan, requestAgentPlan } from "@/lib/agent/service";
import { saveDecision } from "@/lib/agent/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.garden) {
      const { garden, source } = await requestAgentGardenPlan({
        user: body.user,
        message: String(body.message ?? "pemula mau aman"),
        amount: String(body.amount),
        riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
        execute: Boolean(body.execute),
      });
      await saveDecision(garden.decision);
      return NextResponse.json({ ok: true, garden, decision: garden.decision, source });
    }

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
