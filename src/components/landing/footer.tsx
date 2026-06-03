import Link from "next/link";
import { Leaf } from "lucide-react";
import { Logo } from "@/components/base/logo";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Launch app", href: "/app" },
      { label: "Live proof", href: "/app/live" },
      { label: "Garden console", href: "/app#agent-planner" },
    ],
  },
  {
    title: "Protocol",
    links: [
      { label: "USDY route", href: "#solution" },
      { label: "mETH route", href: "#solution" },
      { label: "Policy gate", href: "#what-is-gardenaz" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Proof layer", href: "#proof" },
      { label: "Agent identity", href: "#proof" },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <footer className="divider bg-white">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="max-w-[28ch] text-sm leading-6 text-[var(--text-muted)]">
              AI × RWA yield garden on Mantle. Grow crops, earn yield, let the agent prove its work.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 w-fit">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-[var(--text-muted)]">Mantle Sepolia · Testnet</span>
            </div>
          </div>

          {/* Link groups */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="kicker mb-4">{group.title}</p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="divider">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--text-subtle)]">© 2025 Gardenaz · Built on Mantle</p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-subtle)]">
            <Leaf className="size-3 text-[var(--primary)]" />
            <span>AI × RWA · Powered by LangGraph</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
