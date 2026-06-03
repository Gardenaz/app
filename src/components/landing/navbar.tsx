"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { navItems } from "@/lib/gardena-content";
import { useMobile } from "@/hooks/useMobile";

const navTargets: Record<string, string> = {
  Product: "product",
  "What is Gardena?": "what-is-gardena",
  Solution: "solution",
  "How it works": "how-it-works",
  Proof: "proof",
};

export function LandingNavbar() {
  const isMobile = useMobile();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Logo compact />
        </Link>

        {!isMobile && (
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--text-muted)] lg:flex">
            {navItems.map((item) => (
              <a key={item} href={`#${navTargets[item]}`} className="transition hover:text-[var(--text)]">
                {item}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <PrivyConnectButton compact />
          </div>
          <Link href="/app" className="btn-primary">
            Launch app <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
