import { NextResponse } from "next/server";
import { requestAgentGardenPlan, requestAgentPlan } from "@/lib/agent/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.garden) {
      const { garden, anchor, source } = await requestAgentGardenPlan({
        user: body.user,
        message: String(body.message ?? "pemula mau aman"),
        amount: String(body.amount),
        riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
        execute: Boolean(body.execute),
      });
      const anchorTxHash = anchor?.txHash ?? garden.decision.anchorTxHash ?? null;
      return NextResponse.json({ ok: true, garden, decision: { ...garden.decision, anchorTxHash }, anchor, source });
    }

    const { decision, anchor, execution, outcome, source } = await requestAgentPlan({
      user: body.user,
      crop: body.crop,
      amount: String(body.amount),
      riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
      execute: Boolean(body.execute),
      currentPositionId: body.currentPositionId != null ? String(body.currentPositionId) : undefined,
      policy: body.policy,
    });

    const anchorTxHash = anchor?.txHash ?? null;
    return NextResponse.json({ ok: true, decision: { ...decision, anchorTxHash }, anchor, execution, outcome, source });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
