"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { WoodenButton } from "./wooden-button";

export interface QuestStep {
  id: string;
  title: string;
  body: string;
  complete: boolean;
  disabled: boolean;
  action: () => void;
  cta: string;
  icon?: string;
}

interface QuestBoardProps {
  steps: readonly QuestStep[];
}

const STEP_ICONS = ["🔑", "📜", "🔮", "⚔️"];

export function QuestBoard({ steps }: QuestBoardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(180deg, #6B4423 0%, #5C3518 100%)",
        border: "3px solid color-mix(in srgb, #6B4423 70%, black)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        fontFamily: "var(--font-island-heading)",
      }}
    >
      {/* Board header plank */}
      <div
        className="relative border-b px-5 py-3"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)",
        }}
      >
        {/* Nail decorations */}
        <div className="absolute left-3 top-3 size-2 rounded-full" style={{ background: "rgba(245,200,66,0.7)", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
        <div className="absolute right-3 top-3 size-2 rounded-full" style={{ background: "rgba(245,200,66,0.7)", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.22em] text-amber-200/60">
              Adventure Board
            </p>
            <h2 className="text-base font-black text-amber-100">
              📋 Farm Quests
            </h2>
          </div>
          <div
            className="rounded-full px-3 py-1 text-xs font-black"
            style={{ background: "rgba(245,200,66,0.2)", color: "#F5C842", border: "1px solid rgba(245,200,66,0.35)" }}
          >
            {steps.filter((s) => s.complete).length}/{steps.length} done
          </div>
        </div>
      </div>

      {/* Quest cards */}
      <div className="space-y-2 p-3">
        {steps.map((step, index) => {
          const isActive = !step.complete && !steps.slice(0, index).some((s) => !s.complete);

          return (
            <motion.div
              key={step.id}
              className="quest-card relative flex items-start gap-3 p-3"
              animate={isActive ? {
                boxShadow: [
                  "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                  "0 2px 16px rgba(245,200,66,0.3), inset 0 1px 0 rgba(255,255,255,0.7)",
                  "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
                ],
              } : {}}
              transition={isActive ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
            >
              {/* Step number / icon */}
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{
                  background: step.complete
                    ? "linear-gradient(135deg, #4CAF50, #2E7D32)"
                    : isActive
                    ? "linear-gradient(135deg, var(--island-gold) 0%, var(--island-gold-dark) 100%)"
                    : "rgba(0,0,0,0.12)",
                  boxShadow: step.complete || isActive ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
                }}
              >
                {step.complete ? (
                  <CheckCircle2 className="size-5 text-white" />
                ) : (
                  <span>{STEP_ICONS[index] ?? <Circle className="size-4 text-gray-400" />}</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: "var(--island-earth)" }}>
                      Step {index + 1}
                    </p>
                    <h4 className="text-sm font-black leading-tight" style={{ color: "var(--island-sign-bg)" }}>
                      {step.title}
                    </h4>
                    <p className="mt-0.5 text-[11px] leading-4" style={{ color: "var(--island-earth-dark)", fontFamily: "var(--font-island-body)", fontWeight: 500 }}>
                      {step.body}
                    </p>
                  </div>

                  {/* Complete seal */}
                  <AnimatePresence>
                    {step.complete && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black text-white"
                        style={{ background: "var(--quest-complete)" }}
                      >
                        ✓ Done
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!step.complete && (
                  <div className="mt-2">
                    <WoodenButton
                      size="sm"
                      variant={index === 3 ? "primary" : "secondary"}
                      disabled={step.disabled}
                      onClick={step.action}
                    >
                      {step.cta}
                    </WoodenButton>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom wood grain texture */}
      <div className="h-2" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(255,255,255,0.04) 100%)" }} />
    </div>
  );
}
