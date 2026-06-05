"use client";

import { motion } from "framer-motion";
import type { RefObject } from "react";
import { ThinkingBubble as ThinkingBubbleView, MarkdownMessage as AssistantMarkdown } from "@/components/base/farmer-companion-parts";

export type ChatMessage = { id: string; role: "assistant" | "user"; text: string };

type FarmerCompanionChatThreadProps = {
  messages: ChatMessage[];
  endRef: RefObject<HTMLDivElement | null>;
};

export function FarmerCompanionChatThread({ messages, endRef }: FarmerCompanionChatThreadProps) {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto px-4 py-3" style={{ maxHeight: 300 }}>
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.18 }}
          className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          {msg.role === "assistant" && (
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-sm">
              🌿
            </span>
          )}
          <div
            className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-5 ${
              msg.role === "user"
                ? "rounded-tr-sm bg-[var(--primary)] font-medium text-white"
                : "rounded-tl-sm bg-[var(--surface-soft)] font-medium text-[var(--text)]"
            }`}
          >
            {msg.role === "assistant" && msg.text === "…" ? (
              <ThinkingBubbleView />
            ) : msg.role === "assistant" ? (
              <AssistantMarkdown text={msg.text} />
            ) : (
              msg.text
            )}
          </div>
        </motion.div>
      ))}

      <div ref={endRef} />
    </div>
  );
}
