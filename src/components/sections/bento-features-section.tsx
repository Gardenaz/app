"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldCheck, Globe, Sprout, CheckCircle2, DatabaseZap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

function GuideTyping() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.4 : 1));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div className="relative" animate={{ scale }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <Sprout className="w-16 h-16 md:w-20 md:h-20 text-[var(--primary)]" />
        <motion.div
          className="absolute -inset-4 rounded-full bg-[var(--primary-glow)]"
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

function StepFlow() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const icons = [Sprout, Bot, ShieldCheck, CheckCircle2];
  const labels = ["Guide", "Plan", "Check", "Prove"];
  const Icon = icons[step];

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[rgba(179,223,70,0.15)]">
            <Icon className="size-7 text-[var(--primary)]" />
          </div>
          <span className="text-lg font-bold text-[var(--text)]">{labels[step]}</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2 mt-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-1.5 rounded-full bg-[var(--primary)]"
            animate={{ width: i === step ? 16 : 6, opacity: i === step ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

function MantleProofPulse() {
  const [pulses] = useState([0, 1, 2, 3]);

  return (
    <div className="flex items-center justify-center h-full relative">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[rgba(179,223,70,0.15)] z-10">
        <DatabaseZap className="size-8 text-[var(--primary)]" />
      </div>
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          className="absolute w-16 h-16 border-2 border-[var(--primary-border)] rounded-2xl"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: pulse * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function SpeedBadge() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="h-10 flex items-center justify-center overflow-hidden relative w-full">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="h-8 w-20 bg-[var(--surface-soft)] rounded-lg"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              exit={{ opacity: 0, y: -16, position: "absolute" }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <motion.span
              key="text"
              initial={{ y: 16, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              className="text-3xl md:text-4xl font-mono font-bold text-[var(--text)]"
            >
              &lt;1s
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm text-[var(--text-muted)]">Decision time</span>
      <div className="w-full max-w-[120px] h-1.5 bg-[var(--surface-soft)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[var(--primary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
        />
      </div>
    </div>
  );
}

function PolicyShields() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        if (prev === null || prev >= 4) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const rules = [
    { icon: ShieldCheck, label: "Max size" },
    { icon: ShieldCheck, label: "Slippage" },
    { icon: ShieldCheck, label: "Protocol" },
    { icon: ShieldCheck, label: "Token list" },
    { icon: ShieldCheck, label: "Frequency" },
  ];

  return (
    <div className="h-full flex flex-wrap items-center justify-center gap-2 py-2">
      {rules.map((rule, i) => (
        <motion.div
          key={rule.label}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-bold ${
            active !== null && i <= active
              ? "bg-[rgba(179,223,70,0.18)] text-[var(--primary)]"
              : "bg-[var(--surface-soft)] text-[var(--text-muted)]"
          }`}
          animate={{ scale: active !== null && i === active ? 1.08 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <rule.icon className="size-3" />
          {rule.label}
        </motion.div>
      ))}
    </div>
  );
}

function GlowingGlobe() {
  return (
    <div className="flex items-center justify-center h-full relative">
      <motion.div
        className="absolute inset-0 rounded-full bg-[var(--primary-glow)]"
        animate={{ opacity: [0.08, 0.28, 0.08], scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <Globe className="w-16 h-16 text-[var(--primary)] z-10" />
    </div>
  );
}

const lightCard = [
  "bg-white border border-[var(--border)]",
  "rounded-2xl",
  "flex flex-col",
  "cursor-pointer overflow-hidden",
  "transition-colors duration-150",
  "hover:border-[var(--primary-border)]",
  "shadow-[var(--shadow-sm)]",
].join(" ");

export function BentoFeaturesSection() {
  return (
    <section id="solution" className="landing-section section-landing w-full bg-[var(--surface)]">
      <div className="landing-inner">

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="landing-section-head landing-section-head--center relative mx-auto max-w-[40rem]"
        >
          <motion.p variants={staggerItem} className="landing-eyebrow">
            HOW IT WORKS
          </motion.p>
          <motion.h2 variants={staggerItem} className="landing-title">
            Explain, check, execute, prove — all in one place.
          </motion.h2>
          <motion.p variants={staggerItem} className="landing-subtitle mx-auto max-w-[38rem]">
            Gardenaz combines an AI agent with on-chain proof so every move is transparent, auditable, and under your control.
          </motion.p>
          <div className="mx-auto mt-3 h-[2px] w-10 rounded-full bg-gradient-to-r from-transparent via-[var(--primary-border)] to-transparent" />
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[260px]">

          <motion.div
            className={`${lightCard} md:col-span-2 md:row-span-2 p-6 md:p-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex-1">
              <GuideTyping />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-xl text-[var(--text)] font-medium flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--primary)]" />
                Agent Guide
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Start with a simple flow instead of a DeFi terminal — the agent explains every move in plain language.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={`${lightCard} md:col-span-2 p-6 md:p-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <PolicyShields />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-xl text-[var(--text)] flex items-center gap-2 font-medium">
                <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                Policy Gate
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Your rules stay in control — policies can block any move outside approved boundaries.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={`${lightCard} md:col-span-2 md:row-span-2 p-6`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex-1 flex items-center justify-center">
              <MantleProofPulse />
            </div>
            <div className="mt-auto relative z-20 bg-[var(--surface-soft)] rounded-lg p-2">
              <h3 className="font-display text-xl text-[var(--text)] flex items-center gap-2 font-medium">
                <DatabaseZap className="w-5 h-5 text-[var(--primary)]" />
                Mantle Proof Layer
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Every decision and result is written to Mantle — checkable, verifiable, permanent.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={`${lightCard} md:col-span-2 p-6 md:p-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <SpeedBadge />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-xl text-[var(--text)] font-medium">
                Real-time Execution
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Decisions happen in under a second — the agent plans, policy checks, and execution follows instantly.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={`${lightCard} md:col-span-3 p-6 md:p-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <StepFlow />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-xl text-[var(--text)] flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
                Guide → Plan → Check → Prove
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                The 4-step loop that keeps you in control: the agent proposes, policy validates, execution follows, and Mantle stores the record.
              </p>
            </div>
          </motion.div>

          <motion.div
            className={`${lightCard} md:col-span-3 p-6 md:p-8`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1 flex items-center justify-center">
              <GlowingGlobe />
            </div>
            <div className="mt-3">
              <h3 className="font-display text-xl text-[var(--text)] flex items-center gap-2 font-medium">
                <Globe className="w-5 h-5 text-[var(--primary)]" />
                Always Auditable
              </h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Agent identity, decision logs, and on-chain records stay visible — readable for people first, verifiable when details matter.
              </p>
            </div>
          </motion.div>

        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/app" className="btn-primary inline-flex">
            Launch App <ArrowRight className="size-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}