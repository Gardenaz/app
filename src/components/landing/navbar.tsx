"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/base/logo";
import { PrivyConnectButton } from "@/components/base/privy-connect-button";
import { navItems } from "@/lib/gardena-content";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo compact />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--text-muted)] lg:flex">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              className="transition hover:text-[var(--text)]"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <PrivyConnectButton compact />
          <Link href="/app" className="btn-primary">
            Launch app <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Mobile hamburger — only visible below lg */}
        <button
          type="button"
          className="btn-ghost !p-2 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[var(--border)] bg-white lg:hidden"
          >
            <nav className="container-page grid gap-1 py-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                >
                  {item}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
                <PrivyConnectButton />
                <Link
                  href="/app"
                  className="btn-primary w-full justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Launch app <ArrowRight className="size-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
