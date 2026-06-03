"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Loader2, Minus, Send, TrendingDown, TrendingUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";
import type { WeatherMood } from "@/components/sections/farm-scene";

/* ─────────────────────────────────────────────────────────────────
   Farmer pixel-art sprite — SVG, mood-reactive
───────────────────────────────────────────────────────────────── */
function FarmerSprite({
  mood,
  size = 56,
}: {
  mood: "happy" | "thinking" | "worried" | "excited";
  size?: number;
}) {
  const hatColor = mood === "worried" ? "#7c3aed" : "#92400e";
  const skin = mood === "excited" ? "#fcd34d" : "#f5d0a9";
  const eyeChar = mood === "thinking" ? "–" : mood === "worried" ? ">" : "•";

  return (
    <svg
      width={size}
      height={size * 1.125}
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="7" width="24" height="3" rx="1.5" fill={hatColor} />
      <rect x="8" y="1" width="16" height="8" rx="3" fill={hatColor} />
      <rect x="8" y="7" width="16" height="2" rx="1" fill="#d97706" />
      <ellipse cx="16" cy="16" rx="9" ry="10" fill={skin} />
      <text x="11.5" y="16.5" fontSize="3.8" fill="#374151" fontWeight="bold">
        {eyeChar}
      </text>
      <text x="18" y="16.5" fontSize="3.8" fill="#374151" fontWeight="bold">
        {eyeChar}
      </text>
      {mood === "happy" || mood === "excited" ? (
        <path d="M12 20 Q16 24 20 20" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : mood === "worried" ? (
        <path d="M12 22 Q16 19 20 22" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="12" y="20" width="8" height="1.5" rx="0.75" fill="#374151" />
      )}
      <ellipse cx="9" cy="18" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="23" cy="18" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.5" />
      <rect x="9" y="25" width="14" height="10" rx="3" fill="#16a34a" />
      <rect x="10" y="24" width="4" height="10" rx="2" fill="#15803d" />
      <rect x="18" y="24" width="4" height="10" rx="2" fill="#15803d" />
      <rect x="10" y="29" width="4" height="4" rx="1" fill="#15803d" />
      <rect x="18" y="29" width="4" height="4" rx="1" fill="#15803d" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Types & helpers
───────────────────────────────────────────────────────────────── */
function getMood(
  weather: WeatherMood,
  isPending: boolean,
): "happy" | "thinking" | "worried" | "excited" {
  if (isPending) return "thinking";
  if (weather === "sunny") return "happy";
  if (weather === "cloudy") return "thinking";
  if (weather === "rainy") return "worried";
  return "excited";
}

type ChatMessage = { role: "farmer" | "user"; text: string; ts: number };

export type FarmerCompanionContext = {
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
    "Clear weather. The market is bullish and the audit log is ready anytime.",
    "The market is hot. If you want safety, start with a seed that has clear returns.",
    "Bull market is active. I can explain positions, proof, or help plant.",
  ],
  cloudy: [
    "The market is neutral. Good time to inspect the data before moving.",
    "Cloudy weather. We can check balance, seeds, or onchain history.",
    "Neutral market. I can help read the page state.",
  ],
  rainy: [
    "The market is bearish. I’ll focus on the safest positions.",
    "Rain is falling. Let’s inspect risk, positions, and proof before planting again.",
    "Red market. I can explain why and what is still safe.",
  ],
  stormy: [
    "Storm. Protection mode is active.",
    "Crash mode. I’ll help read the proof and the current positions.",
    "The market is chaotic. Check the audit log before making a new move.",
  ],
};

const QUICK_ACTIONS = [
  { id: "analyze" as const, emoji: "📊", label: "Analyze market", desc: "Check current conditions" },
  { id: "plant" as const, emoji: "🌱", label: "Auto plant", desc: "Let me choose" },
  { id: "protect" as const, emoji: "🛡️", label: "Protect position", desc: "Enable risk guard" },
  { id: "harvest" as const, emoji: "🌾", label: "Harvest now", desc: "Take the gains" },
] as const;

function classifyPrompt(text: string) {
  const normalized = text.toLowerCase();
  if (/(tanam|plant|panen|harvest|analisa|analyze|protect|lindungi|plan|execute|rebal)/.test(normalized)) {
    return "action" as const;
  }
  return "question" as const;
}

function buildContextReply(
  text: string,
  context: FarmerCompanionContext | undefined,
  agentData: GardenAgentResult | null | undefined,
) {
  const normalized = text.toLowerCase();
  if (!context) return "I need the page context first to answer accurately.";

  if (/(balance|saldo|gusd|usd)/.test(normalized)) {
    return `Your current gUSD balance is ${context.gUsdBalance}. There are ${context.positionCount} active onchain positions.`;
  }

  if (/(weather|market|cuaca|bull|bear|neutral|mood)/.test(normalized)) {
    return `The market is now ${context.marketLabel}. ${context.weatherReason}`;
  }

  if (/(position|posisi|pot|tanam|garden|portfolio)/.test(normalized)) {
    if (!context.activePositions.length) {
      return "There are no active onchain positions yet. If you want, we can start from the Seed shop.";
    }
    const top = context.activePositions
      .slice(0, 2)
      .map((item) => `${item.title} (${item.value}, ${item.status})`)
      .join("; ");
    return `There are ${context.positionCount} onchain positions. ${top}.`;
  }

  if (/(audit|proof|hash|anchor|tx|decision|history|log)/.test(normalized)) {
    const latestProof = context.proofRows
      .slice(0, 2)
      .map(([label, value]) => `${label}: ${value}`)
      .join(" | ");
    return `Audit room active. ${latestProof}${context.latestDecision ? ` Latest decision: ${context.latestDecision}` : ""}`;
  }

  if (/(seed|shop|price|return|apy|crop)/.test(normalized)) {
    const seedSummary = context.seedCatalog
      .map((seed) => `${seed.name} ${seed.price} / ${seed.returnLabel}`)
      .join(" • ");
    return `The seed shop includes: ${seedSummary}. Pick the one that matches your risk, then Pak Tani can help continue.`;
  }

  if (agentData?.beginnerExplanation) {
    return agentData.beginnerExplanation;
  }

  return `You are in ${context.view.toUpperCase()} mode. Ask about balance, positions, market, seed shop, or audit proof.`;
}

/* ─────────────────────────────────────────────────────────────────
   Market badge
───────────────────────────────────────────────────────────────── */
function MarketBadge({ agentData }: { agentData: GardenAgentResult | null }) {
  if (!agentData) return null;
  const moodVal = agentData.marketMood.mood;
  const Icon = moodVal === "bullish" ? TrendingUp : moodVal === "bearish" ? TrendingDown : Minus;
  const styles = {
    bullish: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-amber-200 bg-amber-50 text-amber-700",
    bearish: "border-red-200 bg-red-50 text-red-700",
  }[moodVal];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${styles}`}>
      <Icon className="size-3" />
      {moodVal.charAt(0).toUpperCase() + moodVal.slice(1)}
    </span>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-[var(--surface-soft)] px-3 py-2.5">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.span
          key={delay}
          className="block size-1.5 rounded-full bg-[var(--text-muted)]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}

interface FarmerCompanionProps {
  weather: WeatherMood;
  agentData?: GardenAgentResult | null;
  pageContext?: FarmerCompanionContext;
  isPending?: boolean;
  onSendMessage?: (msg: string) => void;
  onAction?: (action: "plant" | "analyze" | "protect" | "harvest") => void;
}

function PromptChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="h-8 rounded-full px-3 text-[10px] font-bold"
      onClick={onClick}
    >
      {label}
    </Button>
  );
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
  const [greeted, setGreeted] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mood = getMood(weather, isPending);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !greeted) {
      const pool = GREETINGS[weather];
      const base = pool[Math.floor(Math.random() * pool.length)];
      const contextHint = pageContext ? ` You are in ${pageContext.view} mode.` : "";
      setMessages([{ role: "farmer", text: `${base}${contextHint}`, ts: Date.now() }]);
      setGreeted(true);
    }
  }, [isOpen, greeted, pageContext, weather]);

  const postFarmerReply = useCallback((text: string) => {
    setMessages((prev) => [...prev, { role: "farmer", text, ts: Date.now() }]);
  }, []);

  const submitPrompt = useCallback(
    (rawText: string) => {
      const txt = rawText.trim();
      if (!txt) return;

      setMessages((prev) => [...prev, { role: "user", text: txt, ts: Date.now() }]);
      setInput("");

      if (classifyPrompt(txt) === "action") {
        onSendMessage?.(txt);
        setTimeout(() => {
          postFarmerReply("Okay, I’ll send it to the agent and check the result.");
        }, 420);
        return;
      }

      setIsAsking(true);
      const replyAt = Date.now() + 1;
      setMessages((prev) => [...prev, { role: "farmer", text: "…", ts: replyAt }]);

      void fetch("/api/agent/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stream: true,
          message: txt,
          view: pageContext?.view,
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
            setMessages((prev) => prev.map((msg) => (msg.ts === replyAt ? { ...msg, text: accumulated } : msg)));
          }

          if (!accumulated) {
            throw new Error("empty assistant reply");
          }
        })
        .catch(() => {
          const reply = buildContextReply(txt, pageContext, agentData ?? null);
          setMessages((prev) => prev.map((msg) => (msg.ts === replyAt ? { ...msg, text: reply } : msg)));
        })
        .finally(() => setIsAsking(false));
    },
    [agentData, onSendMessage, pageContext, postFarmerReply],
  );

  const open = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <motion.button
        type="button"
        aria-label="Open Pak Tani"
        onClick={open}
        className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1"
        initial={false}
        animate={
          isOpen
            ? { scale: 0, opacity: 0, pointerEvents: "none" }
            : { scale: 1, opacity: 1, pointerEvents: "auto" }
        }
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
          <FarmerSprite mood={mood} size={52} />
        </div>

        <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-[10px] font-black text-[var(--primary)] shadow-sm backdrop-blur-sm">
          Pak Tani
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
            <div className="flex shrink-0 items-center gap-2.5 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface-soft)] to-[var(--surface)] px-4 py-3">
              <motion.div
                className="relative shrink-0 rounded-[1.2rem] border border-[var(--border)] bg-[var(--surface-soft)] p-1.5 shadow-inner"
                animate={isPending ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
                transition={{ duration: 0.45, repeat: isPending ? Infinity : 0 }}
              >
                <FarmerSprite mood={mood} size={44} />
                <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-[var(--surface)] bg-[var(--surface)] text-[11px] leading-none">
                  {mood === "happy" ? "😊" : mood === "thinking" ? "🤔" : mood === "worried" ? "😟" : "🤩"}
                </span>
              </motion.div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-black text-[var(--text)]">Pak Tani</p>
                  <Badge className="px-1.5 py-0.5 text-[9px]">AI Agent</Badge>
                  <Badge className="px-1.5 py-0.5 text-[9px]">
                    {pageContext ? pageContext.view : "context"}
                  </Badge>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <MarketBadge agentData={agentData ?? null} />
                  {isPending && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                      <Loader2 className="size-3 animate-spin" /> Analyzing…
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                  onClick={() => setIsMinimized((v) => !v)}
                  className="flex size-7 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                >
                  <ChevronDown className={`size-4 transition-transform duration-200 ${isMinimized ? "rotate-180" : ""}`} />
                </button>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={close}
                  className="flex size-7 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

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
                  <div className="flex flex-col gap-2 overflow-y-auto px-4 py-3" style={{ maxHeight: 300 }}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {msg.role === "farmer" && (
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
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                  {(isPending || isAsking) && messages.at(-1)?.role === "user" && (
                    <div className="flex gap-2">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-sm">
                        🌿
                      </span>
                      <TypingDots />
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="shrink-0 border-t border-[var(--border)] px-4 py-2.5">
                    <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Quick actions</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {QUICK_ACTIONS.map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => {
                            onAction?.(act.id);
                            setMessages((prev) => [
                              ...prev,
                              { role: "user", text: `${act.emoji} ${act.label}`, ts: Date.now() },
                            ]);
                          }}
                          className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-2 text-left transition hover:border-[var(--primary)] hover:bg-white active:scale-95"
                        >
                          <span className="text-[11px] font-black text-[var(--text)]">
                            {act.emoji} {act.label}
                          </span>
                          <span className="mt-0.5 text-[9px] text-[var(--text-muted)]">{act.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 border-t border-[var(--border)] px-4 py-3">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submitPrompt(input)}
                        placeholder="Tanya Pak Tani..."
                        className="flex-1 text-xs"
                      />
                      <Button
                        type="button"
                        onClick={() => submitPrompt(input)}
                        disabled={!input.trim() || isPending || isAsking}
                        aria-label="Kirim"
                        className="size-9 shrink-0 !p-0"
                      >
                        {isPending || isAsking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
