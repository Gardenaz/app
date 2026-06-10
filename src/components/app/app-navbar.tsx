"use client";

import Link from "next/link";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="shrink-0">
            <Logo compact />
          </Link>
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-emerald-700 sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.16em]">
            <span className="hidden min-[400px]:inline">Mantle </span>Testnet
          </span>
        </div>

        <div className="flex items-center">
          <PrivyConnectButton compact />
        </div>
      </div>
    </header>
  );
}
