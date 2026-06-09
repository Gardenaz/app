import { NextResponse } from "next/server";
import { recordAgentOutcome } from "@gardenaz/agent-sdk";
import type { OutcomeRecordRequest } from "@gardenaz/agent-types";
import type { AgentDecision } from "@/lib/agent/types";

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      decision: AgentDecision;
      executionTxHash: `0x${string}`;
      quotedInputAmount?: string;
      quotedOutputAmount?: string;
    };
    const agentUrl = process.env.AGENT_SERVICE_URL;
    if (!agentUrl) {
      return NextResponse.json({ ok: false, error: "AGENT_SERVICE_URL required for outcome recording" }, { status: 500 });
    }

    const result = await recordAgentOutcome(agentUrl, body satisfies OutcomeRecordRequest);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "failed to record outcome" }, { status: 400 });
  }
}
