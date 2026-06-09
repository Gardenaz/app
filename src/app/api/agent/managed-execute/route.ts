import { NextResponse } from "next/server";
import { requestManagedAgentExecution } from "@/lib/agent/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await requestManagedAgentExecution({
      user: body.user,
      crop: body.crop,
      amount: String(body.amount),
      riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
      execute: true,
      currentPositionId: body.currentPositionId != null ? String(body.currentPositionId) : undefined,
      policy: body.policy,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
