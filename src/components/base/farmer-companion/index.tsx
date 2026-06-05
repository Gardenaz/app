"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import type { WeatherMood } from "@/components/sections/farm-scene";
import { getFarmerCompanionMood } from "@/lib/farmer-companion";
import { FarmerCompanionChatComposer } from "@/components/base/farmer-companion/chat-composer";
import { FarmerCompanionChatHeader } from "@/components/base/farmer-companion/chat-header";
import { FarmerCompanionChatThread, type ChatMessage } from "@/components/base/farmer-companion/chat-thread";
import { FarmerSprite as FarmerSpriteView } from "@/components/base/farmer-companion-parts";

export type FarmerCompanionContext = {
  mode: "guided" | "autopilot";
  view: "canvas" | "shop" | "audit";
  marketLabel: string;
  weatherReason: string;
  gUsdBalance: string;
  plantedCount: number;
  positionCount: number;
  activePositions: Array<{ id: number; title: string; value: string; status: string }>;
  latestDecision: string | null;
  proofRows: ReadonlyArray<readonly [string, string]>;
  seedCatalog: Array<{ name: string; price: string; returnLabel: string; asset: string; risk: string }>;
};

const GREETINGS: Record<WeatherMood, string[]> = {
  sunny: [
    "Clear market. I can explain the next move, the current positions, or the proof trail.",
    "Conditions are favorable. If you want a safer path, start with the most stable route first.",
    "Momentum is positive. I can help review what the agent sees before any action.",
  ],
  cloudy: [
    "The market is neutral. Good time to check balances, routes, or proof before moving.",
    "Conditions are mixed. We can review the setup before taking the next step.",
    "Nothing urgent right now. I can help read the current state of the page.",
  ],
  rainy: [
    "The market is defensive. I will focus on safer positions and proof first.",
    "Pressure is rising. Let’s inspect positions and risk before another move.",
    "Conditions are weak. I can explain what still protects the portfolio.",
  ],
  stormy: [
    "Stress conditions. Protection comes first.",
    "The market is unstable. Start with proof and current positions before doing anything else.",
    "Conditions are chaotic. Review the latest record before a new move.",
  ],
};

const QUICK_ACTIONS = [
  { id: "analyze" as const, emoji: "📊", label: "Review plan", desc: "Plan only" },
  { id: "plant" as const, emoji: "🌱", label: "Open position", desc: "Use vault cash" },
  { id: "protect" as const, emoji: "🛡️", label: "Check safety", desc: "Policy only" },
  { id: "harvest" as const, emoji: "🌾", label: "Close position", desc: "Return to cash" },
] as const;

function classifyPrompt(text: string) {
  const normalized = text.toLowerCase();
  if (/(tanam|plant|panen|harvest|analisa|analyze|protect|lindungi|plan|execute|rebal)/.test(normalized)) {
    return "action" as const;
  }
  return "question" as const;
}

function resolveActionFromPrompt(text: string): "plant" | "analyze" | "protect" | "harvest" {
  const normalized = text.toLowerCase();
  if (/(panen|harvest)/.test(normalized)) return "harvest";
  if (/(lindungi|protect|guard|risk)/.test(normalized)) return "protect";
  if (/(tanam|plant|execute|rebal)/.test(normalized)) return "plant";
  return "analyze";
}

interface FarmerCompanionProps {
  weather: WeatherMood;
  agentData?: GardenAgentResult | null;
  pageContext?: FarmerCompanionContext;
  isPending?: boolean;
  onSendMessage?: (msg: string) => void;
  onAction?: (
    action: "plant" | "analyze" | "protect" | "harvest",
    message: string,
  ) => Promise<string | null | undefined> | string | null | undefined;
}

export function FarmerCompanion({
  weather,
  agentData,
  pageContext,
  isPending = false,
  onSendMessage,
  onAction,
}: FarmerCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);
  const isAskingRef = useRef(false);
  const mood = getFarmerCompanionMood(weather, isPending);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildGreeting = useCallback(() => {
    const pool = GREETINGS[weather];
    const base = pool[Math.floor(Math.random() * pool.length)];
    const contextHint = pageContext ? ` You are in ${pageContext.view} mode.` : "";
    return `${base}${contextHint}`;
  }, [pageContext, weather]);

  const createMessage = useCallback((role: ChatMessage["role"], text: string): ChatMessage => {
    const id = `${Date.now()}-${messageCounterRef.current++}`;
    return { id, role, text };
  }, []);

  const runActionPrompt = useCallback(
    async (action: "plant" | "analyze" | "protect" | "harvest", userText: string) => {
      setMessages((prev) => [...prev, createMessage("user", userText)]);
      setInput("");
      isAskingRef.current = true;
      setIsAsking(true);
      const replyMessage = createMessage("assistant", "…");
      setMessages((prev) => [...prev, replyMessage]);

      try {
        const summary = await Promise.resolve(onAction?.(action, userText));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === replyMessage.id
              ? {
                  ...msg,
                  text: summary?.trim() || "I turned that into a clear decision summary.",
                }
              : msg,
          ),
        );
      } catch {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === replyMessage.id
              ? { ...msg, text: "I couldn’t build the decision summary just now." }
              : msg,
          ),
        );
      } finally {
        isAskingRef.current = false;
        setIsAsking(false);
      }
    },
    [createMessage, onAction],
  );

  const submitPrompt = useCallback(
    async (rawText: string) => {
      const txt = rawText.trim();
      if (!txt || isAskingRef.current) return;

      if (classifyPrompt(txt) === "action") {
        await runActionPrompt(resolveActionFromPrompt(txt), txt);
        return;
      }

      setMessages((prev) => [...prev, createMessage("user", txt)]);
      setInput("");
      isAskingRef.current = true;
      setIsAsking(true);
      const replyMessage = createMessage("assistant", "…");
      setMessages((prev) => [...prev, replyMessage]);

      void fetch("/api/agent/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stream: true,
          message: txt,
          view: pageContext?.view,
          mode: pageContext?.mode,
          context: pageContext,
        }),
      })
        .then(async (res) => {
          if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            accumulated += decoder.decode(value, { stream: true });
            setMessages((prev) => prev.map((msg) => (msg.id === replyMessage.id ? { ...msg, text: accumulated } : msg)));
          }

          if (!accumulated) {
            throw new Error("empty assistant reply");
          }
        })
        .catch(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === replyMessage.id
                ? { ...msg, text: "I couldn't reach the assistant right now. Please try again." }
                : msg,
            ),
          );
        })
        .finally(() => {
          isAskingRef.current = false;
          setIsAsking(false);
        });
    },
    [createMessage, pageContext, runActionPrompt],
  );

  const runQuickAction = useCallback(
    (action: "plant" | "analyze" | "protect" | "harvest", label: string) => {
      if (isPending || isAsking) return;
      void runActionPrompt(action, label);
    },
    [isAsking, isPending, runActionPrompt],
  );

  const open = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setMessages((prev) => (prev.length > 0 ? prev : [createMessage("assistant", buildGreeting())]));
  };

  const close = () => setIsOpen(false);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open assistant"
        onClick={open}
        className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1"
        initial={false}
        animate={isOpen ? { scale: 0, opacity: 0, pointerEvents: "none" } : { scale: 1, opacity: 1, pointerEvents: "auto" }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        <motion.div
          className="absolute -right-1 -top-1.5 rounded-full bg-[var(--primary)] px-1.5 py-px text-[9px] font-black text-white shadow"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Ask
        </motion.div>

        <div className="flex items-center justify-center rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_6px_28px_rgba(22,163,74,0.18)]">
          <FarmerSpriteView mood={mood} size={52} />
        </div>

        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-black text-[var(--primary)] shadow-sm backdrop-blur-sm">
          Assistant
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-5 right-5 z-50 flex w-[min(96vw,380px)] flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_72px_rgba(13,118,110,0.16)] backdrop-blur-xl"
            style={{ maxHeight: "min(86svh, 620px)" }}
          >
            <FarmerCompanionChatHeader
              isPending={isPending}
              isMinimized={isMinimized}
              pageViewLabel={pageContext ? pageContext.view : "context"}
              agentData={agentData ?? null}
              moodIcon={mood === "happy" ? "😊" : mood === "thinking" ? "🤔" : mood === "worried" ? "😟" : "🤩"}
              onToggleMinimized={() => setIsMinimized((v) => !v)}
              onClose={close}
            />

            <AnimatePresence initial={false}>
              {!isMinimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex flex-col overflow-hidden"
                >
                  <FarmerCompanionChatThread messages={messages} endRef={chatEndRef} />

                  <div className="shrink-0 border-t border-[var(--border)] px-4 py-2.5">
                    <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Quick actions</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {QUICK_ACTIONS.map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          disabled={isPending || isAsking}
                          onClick={() => runQuickAction(act.id, `${act.emoji} ${act.label}`)}
                          className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-left transition hover:border-[var(--primary)] hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="text-[11px] font-black text-[var(--text)]">
                            {act.emoji} {act.label}
                          </span>
                          <span className="mt-0.5 text-[9px] text-[var(--text-muted)]">{act.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <FarmerCompanionChatComposer
                    input={input}
                    isPending={isPending}
                    isAsking={isAsking}
                    onInputChange={setInput}
                    onSubmit={() => submitPrompt(input)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
