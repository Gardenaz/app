import { Logo } from "@/components/base/logo";
import { navItems } from "@/lib/gardena-content";

export function LandingFooter() {
  return (
    <footer className="divider bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-[var(--text-muted)]">
            AI × RWA yield garden on Mantle. Grow crops, earn yield, let the agent prove its work.
          </p>
        </div>

        {/* Nav */}
        <div>
          <p className="kicker mb-4">Navigation</p>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text)]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="kicker mb-4">Status</p>
          <p className="text-sm leading-6 text-[var(--text-muted)]">
            MVP: app + LangGraph agent + contracts. Focus: Privy wallet, on-chain execution proof, and consumer-friendly DeFi.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="divider">
        <div className="container-page py-4">
          <p className="text-xs text-[var(--text-subtle)]">© 2025 Gardena. Built on Mantle.</p>
        </div>
      </div>
    </footer>
  );
}
