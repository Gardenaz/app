export const crops = [
  {
    name: "Steady Field",
    risk: "LOW RISK",
    apy: "3-5%",
    description: "A calm lending route for first deposits, designed around capital care and clear exits.",
    accent: "bg-emerald-50 text-[var(--primary-strong)] border border-emerald-200",
    tone: "steady",
  },
  {
    name: "Growth Row",
    risk: "MEDIUM",
    apy: "8-12%",
    description: "A balanced liquidity route that explains tradeoffs before the agent moves funds.",
    accent: "bg-amber-50 text-amber-700 border border-amber-200",
    tone: "balanced",
  },
  {
    name: "Boost Plot",
    risk: "HIGHER",
    apy: "15-25%",
    description: "A sharper yield route for users who accept more volatility and tighter monitoring.",
    accent: "bg-red-50 text-red-700 border border-red-200",
    tone: "bold",
  },
] as const;
