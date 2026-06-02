"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { useMobile } from "@/hooks/useMobile";

export function LandingNavbar() {
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo compact />
        </Link>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/app" className="btn-primary">
            Launch app
          </Link>
        </div>
      </div>
    </header>
  );
}
