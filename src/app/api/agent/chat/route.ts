import { NextResponse } from "next/server";
import { requestAgentAssistantReply } from "@/lib/agent/service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.stream) {
      const { answer } = await requestAgentAssistantReply({
        user: body.user,
        message: String(body.message ?? ""),
        context: body.context,
        view: body.view,
      });

      const encoder = new TextEncoder();
      const chunks = answer.match(/.{1,24}(\s|$)/g) ?? [answer];
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 18));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-cache, no-transform",
        },
      });
    }

    const { answer, source } = await requestAgentAssistantReply({
      user: body.user,
      message: String(body.message ?? ""),
      context: body.context,
      view: body.view,
    });
    return NextResponse.json({ ok: true, answer, source });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "invalid request" }, { status: 400 });
  }
}
