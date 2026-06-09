"use client";

import Link from "next/link";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="shrink-0">
            <Logo compact />
          </Link>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
              Mantle Testnet
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)] opacity-70">
              Mantle Mainnet Soon
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <PrivyConnectButton />
        </div>
      </div>
    </header>
  );
}
