"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CROP_OPTIONS } from "@/components/sections/farm-scene";
import { getCropRisk } from "@/lib/launch/launch-actions";
import { ParchmentPanel } from "@/components/gamification/parchment-panel";
import { WoodenButton } from "@/components/gamification/wooden-button";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { Input } from "@/components/ui/input";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { useLaunchSettings } from "@/hooks/use-launch-settings";
import type { LaunchExperienceLevel } from "@/lib/launch/settings-state";

const STEPS = [
  { key: "agent", label: "Farmer" },
  { key: "settings", label: "Plot" },
  { key: "survey", label: "About you" },
  { key: "wallet", label: "Wallet" },
] as const;

const AUTHORITY_OPTIONS = [
  { id: "managed" as const, emoji: "🤖", label: "Managed mode", note: "The agent farms for you inside your limits." },
  { id: "wallet" as const, emoji: "✋", label: "Wallet mode", note: "You approve every move yourself." },
];

const EXPERIENCE_OPTIONS: Array<{ id: LaunchExperienceLevel; emoji: string; label: string; note: string }> = [
  { id: "new", emoji: "🌱", label: "New to DeFi", note: "Just getting started — keep it simple." },
  { id: "some", emoji: "🌿", label: "Some experience", note: "I've used DeFi apps before." },
  { id: "pro", emoji: "🌳", label: "Pro farmer", note: "I know my way around yield." },
];

function ProgressTrail({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black transition-all"
              style={{
                fontFamily: "var(--font-island-heading)",
                background: active
                  ? "var(--island-wood)"
                  : done
                    ? "color-mix(in srgb, var(--island-grass) 80%, white)"
                    : "#f1f5f9",
                color: active ? "var(--island-sign-text)" : "var(--island-sign-bg)",
                boxShadow: active ? "0 3px 10px rgba(0,0,0,0.22)" : "none",
                border: active || done ? "none" : "1.5px solid #e2e8f0",
              }}
            >
              <span className="grid size-4 place-items-center rounded-full bg-white/30 text-[9px]">
                {done ? <Check className="size-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-0.5 w-3 rounded-full sm:w-5"
                style={{ background: done ? "var(--island-grass)" : "#e2e8f0" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Splash() {
  return (
    <div className="grid min-h-svh place-items-center bg-white">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl"
      >
        🌱
      </motion.div>
    </div>
  );
}

const cardBase =
  "flex w-full flex-col gap-1 rounded-2xl border-2 px-4 py-3 text-left transition-all";

function selectableStyle(selected: boolean) {
  return selected
    ? "border-[var(--island-grass-dark)] bg-[color-mix(in_srgb,var(--island-grass)_22%,white)] shadow-[0_4px_14px_rgba(0,0,0,0.12)]"
    : "border-[var(--island-parchment-dark)] bg-white hover:bg-[#fafaf8]";
}

export function WelcomeWizard() {
  const router = useRouter();
  const { ready, authenticated, address } = usePrivyWalletAddress();
  const ls = useLaunchSettings({ walletConnected: authenticated, depositReady: false, policyReady: false });

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [redirecting, setRedirecting] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const decidedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const resolved = ready || timedOut;

  // One-shot entry decision: returning users (flag set OR already authenticated) skip the wizard.
  useEffect(() => {
    if (decidedRef.current) return;
    if (!ls.hydrated || !resolved) return;
    decidedRef.current = true;
    if (ls.draft.welcomeComplete || authenticated) {
      router.replace("/app/garden");
      return;
    }
    setRedirecting(false);
  }, [ls.hydrated, resolved, authenticated, ls.draft.welcomeComplete, router]);

  if (redirecting) return <Splash />;

  const draft = ls.draft;
  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const finish = () => {
    ls.markWelcomeComplete();
    router.replace("/app/garden");
  };

  const agentName = draft.selectedLane === "steady" ? "Rice" : draft.selectedLane === "growth" ? "Corn" : "Chili";

  const headings = [
    { title: "Choose your farmer", emoji: "🧑‍🌾", sub: "Each crop is an AI agent tuned to a risk level." },
    { title: "Set up your plot", emoji: "🪴", sub: "How much to farm with, and who pulls the levers." },
    { title: "Tell us about you", emoji: "📋", sub: "We tune the guidance to your experience." },
    { title: "Connect your wallet", emoji: "👛", sub: "The last step before your garden comes alive." },
  ];
  const heading = headings[step];

  return (
    <div className="grid min-h-svh place-items-center bg-white px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-5">
          <ProgressTrail step={step} />
        </div>

        <ParchmentPanel title={heading.title} titleEmoji={heading.emoji}>
          <p className="mb-4 text-xs font-semibold" style={{ color: "var(--island-sign-bg)", opacity: 0.75 }}>
            {heading.sub}
          </p>

          <div className="relative min-h-[260px]">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {/* Step 0 — choose agent */}
              {step === 0 && (
                <div className="grid gap-2.5">
                  {CROP_OPTIONS.map((opt) => {
                    const selected = draft.selectedLane === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          ls.setLane(opt.id);
                          ls.setRisk(getCropRisk(opt.id));
                        }}
                        className={`${cardBase} ${selectableStyle(selected)}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{opt.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black" style={{ fontFamily: "var(--font-island-heading)", color: "var(--island-sign-bg)" }}>
                                {opt.crop}
                              </p>
                              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${opt.riskColor}`}>
                                {opt.risk} risk
                              </span>
                              <span className="ml-auto text-xs font-black text-[var(--island-grass-dark)]">{opt.apy} APY</span>
                            </div>
                            <p className="mt-1 text-[11px] leading-snug" style={{ color: "var(--island-sign-bg)", opacity: 0.7 }}>
                              {opt.desc}
                            </p>
                          </div>
                          {selected && (
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--island-grass-dark)] text-white">
                              <Check className="size-3.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 1 — settings */}
              {step === 1 && (
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--island-sign-bg)", opacity: 0.7 }}>
                      Starting amount
                    </p>
                    <Input
                      inputMode="decimal"
                      value={draft.defaultAmount}
                      onChange={(e) => ls.setAmount(e.target.value)}
                      className="h-12 rounded-2xl border-2 border-[var(--island-parchment-dark)] bg-white text-base font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.14em]" style={{ color: "var(--island-sign-bg)", opacity: 0.7 }}>
                      Who farms?
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {AUTHORITY_OPTIONS.map((opt) => {
                        const selected = draft.executionAuthority === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => ls.setExecutionAuthority(opt.id)}
                            className={`${cardBase} ${selectableStyle(selected)}`}
                          >
                            <span className="text-2xl">{opt.emoji}</span>
                            <p className="text-sm font-black" style={{ fontFamily: "var(--font-island-heading)", color: "var(--island-sign-bg)" }}>
                              {opt.label}
                            </p>
                            <p className="text-[11px] leading-snug" style={{ color: "var(--island-sign-bg)", opacity: 0.7 }}>
                              {opt.note}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — survey */}
              {step === 2 && (
                <div className="grid gap-2.5">
                  {EXPERIENCE_OPTIONS.map((opt) => {
                    const selected = draft.experienceLevel === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => ls.setExperienceLevel(opt.id)}
                        className={`${cardBase} ${selectableStyle(selected)}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm font-black" style={{ fontFamily: "var(--font-island-heading)", color: "var(--island-sign-bg)" }}>
                              {opt.label}
                            </p>
                            <p className="text-[11px] leading-snug" style={{ color: "var(--island-sign-bg)", opacity: 0.7 }}>
                              {opt.note}
                            </p>
                          </div>
                          {selected && (
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--island-grass-dark)] text-white">
                              <Check className="size-3.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 3 — connect wallet */}
              {step === 3 && (
                <div className="grid place-items-center gap-4 py-6 text-center">
                  <motion.div
                    animate={authenticated ? { scale: [1, 1.15, 1] } : { rotate: [0, -8, 8, 0] }}
                    transition={{ duration: authenticated ? 0.5 : 2, repeat: authenticated ? 0 : Infinity, ease: "easeInOut" }}
                    className="text-5xl"
                  >
                    {authenticated ? "🌻" : "👛"}
                  </motion.div>

                  {authenticated && address ? (
                    <>
                      <p className="text-sm font-black" style={{ fontFamily: "var(--font-island-heading)", color: "var(--island-sign-bg)" }}>
                        Wallet connected!
                      </p>
                      <code className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--island-sign-bg)]">
                        {address.slice(0, 6)}…{address.slice(-4)}
                      </code>
                      <WoodenButton size="lg" onClick={finish} className="mt-2">
                        Enter the garden <ArrowRight className="ml-1.5 inline size-4" />
                      </WoodenButton>
                    </>
                  ) : (
                    <>
                      <p className="max-w-xs text-xs font-semibold" style={{ color: "var(--island-sign-bg)", opacity: 0.75 }}>
                        Connect a wallet so your {agentName} agent can start farming.
                      </p>
                      {/* Reuse the same connect button as the navbar — avoids duplicate login logic */}
                      <PrivyConnectButton />
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer nav */}
          <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--island-parchment-dark)" }}>
            <WoodenButton
              variant="secondary"
              size="sm"
              onClick={() => go(step - 1)}
              disabled={step === 0}
              className={step === 0 ? "pointer-events-none opacity-40" : ""}
            >
              <ArrowLeft className="mr-1 inline size-3.5" /> Back
            </WoodenButton>

            {step < STEPS.length - 1 ? (
              <WoodenButton size="sm" onClick={() => go(step + 1)}>
                Next <ArrowRight className="ml-1 inline size-3.5" />
              </WoodenButton>
            ) : (
              <span className="text-[11px] font-bold" style={{ color: "var(--island-sign-bg)", opacity: 0.6 }}>
                {authenticated ? "Ready to grow 🌾" : "Connect to finish"}
              </span>
            )}
          </div>
        </ParchmentPanel>
      </div>
    </div>
  );
}
