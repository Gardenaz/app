"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
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
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden lg:block">
            <PrivyConnectButton compact />
          </div> 
        </div>
      </div>
    </header>
  );
}
