import { NextResponse } from "next/server";
import { runAgent } from "@gardena/agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const decision = runAgent({
      user: body.user,
      crop: body.crop,
      amount: String(body.amount),
      riskPreference: Number(body.riskPreference) as 1 | 2 | 3,
    });

    return NextResponse.json({ ok: true, decision });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
