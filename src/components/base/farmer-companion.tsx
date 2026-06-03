"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Send, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
      {/* Hat */}
      <rect x="4"  y="7"  width="24" height="3"  rx="1.5" fill={hatColor} />
      <rect x="8"  y="1"  width="16" height="8"  rx="3"   fill={hatColor} />
      <rect x="8"  y="7"  width="16" height="2"  rx="1"   fill="#d97706" />
      {/* Face */}
      <ellipse cx="16" cy="16" rx="9" ry="10" fill={skin} />
      {/* Eyes */}
      <text x="11.5" y="16.5" fontSize="3.8" fill="#374151" fontWeight="bold">{eyeChar}</text>
      <text x="18"   y="16.5" fontSize="3.8" fill="#374151" fontWeight="bold">{eyeChar}</text>
      {/* Mouth */}
      {mood === "happy" || mood === "excited" ? (
        <path d="M12 20 Q16 24 20 20" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : mood === "worried" ? (
        <path d="M12 22 Q16 19 20 22" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="12" y="20" width="8" height="1.5" rx="0.75" fill="#374151" />
      )}
      {/* Rosy cheeks */}
      <ellipse cx="9"  cy="18" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.5" />
      <ellipse cx="23" cy="18" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.5" />
      {/* Body */}
      <rect x="9" y="25" width="14" height="10" rx="3" fill="#16a34a" />
      <rect x="10" y="24" width="4"  height="10" rx="2" fill="#15803d" />
      <rect x="18" y="24" width="4"  height="10" rx="2" fill="#15803d" />
      <rect x="10" y="29" width="4"  height="4"  rx="1" fill="#15803d" />
      <rect x="18" y="29" width="4"  height="4"  rx="1" fill="#15803d" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────── */
function getMood(
  weather: WeatherMood,
  isPending: boolean,
): "happy" | "thinking" | "worried" | "excited" {
  if (isPending) return "thinking";
  if (weather === "sunny")  return "happy";
  if (weather === "cloudy") return "thinking";
  if (weather === "rainy")  return "worried";
  return "excited"; // stormy
}

type ChatMessage = { role: "farmer" | "user"; text: string; ts: number };

const GREETINGS: Record<WeatherMood, string[]> = {
  sunny: [
    "Wah, cuacanya cerah banget! ☀️ Pasar lagi bull — yuk kita tanam bareng!",
    "Market lagi panas! Waktu yang oke buat buka posisi. Mau pilih crop apa?",
    "Bull market nih! Slot mana yang mau kamu isi duluan?",
  ],
  cloudy: [
    "Cuaca agak mendung, pasar sideways. Tapi masih aman kok. ⛅",
    "Hmm… pasar lagi nunggu arah. Saranin tanam yang safe dulu ya.",
    "Neutral market. Gue pantau terus, ada sinyal bagus langsung kasih tahu.",
  ],
  rainy: [
    "Aduh, hujan deras… 🌧️ Pasar bear. Jangan panik, tahan posisi dulu!",
    "Market lagi merah. Jangan FOMO, jangan buka posisi baru sekarang.",
    "Rain shield aktif! Lagi jagain semua pot kamu dari risiko.",
  ],
  stormy: [
    "⚠️ BAHAYA! Pasar crash! Emergency mode aktif sekarang!",
    "Badai! Semua posisi lagi di-lock buat perlindungan. Hold dulu!",
    "Market crash — protokol darurat aktif, aset kamu aman.",
  ],
};

const QUICK_ACTIONS = [
  { id: "analyze"  as const, emoji: "📊", label: "Analisa Pasar",    desc: "Cek kondisi sekarang" },
  { id: "plant"    as const, emoji: "🌱", label: "Tanam Otomatis",   desc: "Biar gue yang pilih" },
  { id: "protect"  as const, emoji: "🛡️", label: "Lindungi Posisi", desc: "Aktifin risk guard" },
  { id: "harvest"  as const, emoji: "🌾", label: "Panen Sekarang",   desc: "Ambil hasil" },
] as const;

/* ─────────────────────────────────────────────────────────────────
   Market badge
───────────────────────────────────────────────────────────────── */
function MarketBadge({ agentData }: { agentData: GardenAgentResult | null }) {
  if (!agentData) return null;
  const moodVal = agentData.marketMood.mood;
  const Icon = moodVal === "bullish" ? TrendingUp : moodVal === "bearish" ? TrendingDown : Minus;
  const styles = {
    bullish: "border-emerald-200 bg-emerald-50 text-emerald-700",
    neutral: "border-amber-200  bg-amber-50  text-amber-700",
    bearish: "border-red-200    bg-red-50    text-red-700",
  }[moodVal];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-black ${styles}`}>
      <Icon className="size-3" />
      {moodVal.charAt(0).toUpperCase() + moodVal.slice(1)}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Typing indicator
───────────────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2.5">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.span
          key={delay}
          className="block size-1.5 rounded-full bg-gray-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.65, repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────── */
interface FarmerCompanionProps {
  weather: WeatherMood;
  agentData?: GardenAgentResult | null;
  isPending?: boolean;
  onSendMessage?: (msg: string) => void;
  onAction?: (action: "plant" | "analyze" | "protect" | "harvest") => void;
}

export function FarmerCompanion({
  weather,
  agentData,
  isPending = false,
  onSendMessage,
  onAction,
}: FarmerCompanionProps) {
  const [isOpen,       setIsOpen]       = useState(false);
  const [isMinimized,  setIsMinimized]  = useState(false);
  const [input,        setInput]        = useState("");
  const [messages,     setMessages]     = useState<ChatMessage[]>([]);
  const [greeted,      setGreeted]      = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mood = getMood(weather, isPending);

  /* auto-scroll */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* greet on open */
  useEffect(() => {
    if (isOpen && !greeted) {
      const pool = GREETINGS[weather];
      const text = pool[Math.floor(Math.random() * pool.length)];
      setMessages([{ role: "farmer", text, ts: Date.now() }]);
      setGreeted(true);
    }
  }, [isOpen, greeted, weather]);

  /* weather change update (only if chat open and last msg >5 s old) */
  useEffect(() => {
    if (!isOpen || !greeted) return;
    const last = messages.at(-1);
    if (last && Date.now() - last.ts > 5000) {
      const pool = GREETINGS[weather];
      const text = pool[Math.floor(Math.random() * pool.length)];
      setMessages((prev) => [...prev, { role: "farmer", text, ts: Date.now() }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  /* agent reply */
  useEffect(() => {
    if (agentData?.beginnerExplanation && isOpen) {
      setMessages((prev) => [
        ...prev,
        { role: "farmer", text: `✅ Udah gue analisa! ${agentData.beginnerExplanation}`, ts: Date.now() },
      ]);
    }
  }, [agentData, isOpen]);

  const send = useCallback(() => {
    const txt = input.trim();
    if (!txt) return;
    setMessages((prev) => [...prev, { role: "user", text: txt, ts: Date.now() }]);
    onSendMessage?.(txt);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "farmer", text: "Oke, gue cek dulu ya!", ts: Date.now() },
      ]);
    }, 420);
  }, [input, onSendMessage]);

  const open  = () => { setIsOpen(true);  setIsMinimized(false); };
  const close = () => setIsOpen(false);

  return (
    <>
      {/* ════════════════════════════════
          Floating avatar button
      ════════════════════════════════ */}
      <motion.button
        type="button"
        aria-label="Buka Pak Tani assistant"
        onClick={open}
        className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-1"
        initial={false}
        animate={isOpen
          ? { scale: 0, opacity: 0, pointerEvents: "none" }
          : { scale: 1, opacity: 1, pointerEvents: "auto" }}
        whileHover={{ scale: 1.07, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
      >
        {/* ping badge */}
        <motion.div
          className="absolute -right-1 -top-1.5 rounded-full bg-teal-500 px-1.5 py-px text-[9px] font-black text-white shadow"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          Chat!
        </motion.div>

        {/* avatar shell */}
        <div className="flex items-center justify-center rounded-[1.75rem] border-2 border-emerald-200 bg-gradient-to-b from-[#f3fdf4] to-[#d8f2e0] p-2 shadow-[0_6px_28px_rgba(22,163,74,0.28)]">
          <FarmerSprite mood={mood} size={52} />
        </div>

        <span className="rounded-full border border-white/70 bg-white/90 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 shadow-sm backdrop-blur-sm">
          Pak Tani 🌿
        </span>
      </motion.button>

      {/* ════════════════════════════════
          Chat panel
      ════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={  { opacity: 0, scale: 0.88, y: 20  }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-5 right-5 z-50 flex w-[min(96vw,356px)] flex-col overflow-hidden rounded-[1.75rem] border border-emerald-100/80 bg-white shadow-[0_20px_72px_rgba(13,118,110,0.2)] backdrop-blur-xl"
            style={{ maxHeight: "min(88svh, 620px)" }}
          >
            {/* ── Header ── */}
            <div className="flex shrink-0 items-center gap-2.5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 px-4 py-3">
              {/* avatar */}
              <motion.div
                className="relative shrink-0 rounded-[1.2rem] border-2 border-emerald-100 bg-gradient-to-b from-[#f3fdf4] to-[#d8f2e0] p-1.5 shadow-inner"
                animate={isPending ? { rotate: [-3, 3, -3] } : { rotate: 0 }}
                transition={{ duration: 0.45, repeat: isPending ? Infinity : 0 }}
              >
                <FarmerSprite mood={mood} size={44} />
                <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-white text-[11px] leading-none">
                  {mood === "happy" ? "😊" : mood === "thinking" ? "🤔" : mood === "worried" ? "😟" : "🤩"}
                </span>
              </motion.div>

              {/* name + status */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-black text-gray-800">Pak Tani</p>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                    AI Agent
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <MarketBadge agentData={agentData ?? null} />
                  {isPending && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                      <Loader2 className="size-3 animate-spin" /> Analisa…
                    </span>
                  )}
                </div>
              </div>

              {/* controls */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                  onClick={() => setIsMinimized((v) => !v)}
                  className="flex size-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                >
                  <ChevronDown className={`size-4 transition-transform duration-200 ${isMinimized ? "rotate-180" : ""}`} />
                </button>
                <button
                  type="button"
                  aria-label="Tutup"
                  onClick={close}
                  className="flex size-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* ── Collapsible body ── */}
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
                  {/* chat messages */}
                  <div className="flex flex-col gap-2 overflow-y-auto px-4 py-3" style={{ maxHeight: 220 }}>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {msg.role === "farmer" && (
                          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm">
                            🌿
                          </span>
                        )}
                        <div
                          className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-5 ${
                            msg.role === "user"
                              ? "rounded-tr-sm bg-teal-600 font-medium text-white"
                              : "rounded-tl-sm bg-gray-100 font-medium text-gray-800"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {/* typing indicator */}
                    {isPending && messages.at(-1)?.role === "user" && (
                      <div className="flex gap-2">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm">🌿</span>
                        <TypingDots />
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* quick actions grid */}
                  <div className="shrink-0 border-t border-gray-50 px-4 py-2.5">
                    <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-gray-400">Aksi Cepat</p>
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
                          className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 px-2.5 py-2 text-left transition hover:border-emerald-200 hover:bg-emerald-50 active:scale-95"
                        >
                          <span className="text-[11px] font-black text-gray-800">{act.emoji} {act.label}</span>
                          <span className="mt-0.5 text-[9px] text-gray-400">{act.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* input row */}
                  <div className="shrink-0 border-t border-gray-50 px-4 py-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                        placeholder="Tanya petani… (Enter kirim)"
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      />
                      <button
                        type="button"
                        onClick={send}
                        disabled={!input.trim() || isPending}
                        aria-label="Kirim"
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-40 active:scale-95"
                      >
                        {isPending
                          ? <Loader2 className="size-4 animate-spin" />
                          : <Send className="size-4" />}
                      </button>
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
