"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { navItems } from "@/lib/gardena-content";

const navTargets: Record<string, string> = {
  Product: "features",
  "What is Gardenaz?": "what-is-gardenaz",
  Solution: "solution",
  "How it works": "how-it-works",
  Proof: "proof",
};

function SparkleParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 10 + Math.random() * 80,
      size: 1 + Math.random() * 2.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      opacity: 0.25 + Math.random() * 0.5,
    })), []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#B3DF46]/50"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [p.opacity, 0, p.opacity], scale: [1, 1.4, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex justify-center px-4 pt-3">
      <motion.div
        animate={scrolled ? "scrolled" : "top"}
        variants={{
          top: {
            width: "min(92%, 56rem)",
            background: "rgba(255,255,255,0.10)",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "0 0 0 0 transparent",
          },
          scrolled: {
            width: "min(92%, 56rem)",
            background: "rgba(255,255,255,0.88)",
            borderColor: "rgba(13,26,23,0.09)",
            boxShadow: "0 8px 32px rgba(13,26,23,0.07), 0 1px 3px rgba(13,26,23,0.04)",
          },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-[1.75rem] border backdrop-blur-xl"
      >
        <div className="relative flex h-14 items-center justify-between gap-4 px-5">
          <Link href="/" className="shrink-0">
            <Logo compact />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${navTargets[item]}`}
                className={`text-[13px] font-semibold transition-all duration-300 ${
                  scrolled
                    ? "text-[var(--text-muted)] hover:text-[var(--text)]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:block">
              <PrivyConnectButton compact />
            </div>
            <Link
              href="/app"
              className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition-all duration-300 ${
                scrolled
                  ? "bg-[var(--primary)] text-white shadow-[0_2px_8px_rgba(13,127,118,0.25)] hover:bg-[var(--primary-hover)] hover:shadow-[0_4px_16px_rgba(13,127,118,0.3)]"
                  : "bg-white/[0.14] text-white backdrop-blur-sm hover:bg-white/[0.22]"
              }`}
            >
              Launch app
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {!scrolled && <SparkleParticles />}
        </div>
      </motion.div>
    </header>
  );
}
