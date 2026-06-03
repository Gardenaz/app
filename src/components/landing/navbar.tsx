"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { navItems } from "@/lib/gardena-content";

const navTargets: Record<string, string> = {
  Product: "product",
  "What is Gardenaz?": "what-is-gardenaz",
  Solution: "solution",
  "How it works": "how-it-works",
  Proof: "proof",
};

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/92 backdrop-blur-lg">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Logo compact />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${navTargets[item]}`}
              className="text-sm font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden lg:block">
            <PrivyConnectButton compact />
          </div>
          <Link href="/app" className="btn-primary !py-2 !px-4 text-sm">
            Launch app <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
