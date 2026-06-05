import { Bot, CheckCircle2, Fingerprint, Network, Radio, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const featureCards = [
  {
    icon: Radio,
    title: "Live Executions",
    text: "Monitor every agent run in real-time. See the plan, gate checks, and execution flow as they happen across your RWA strategies.",
  },
  {
    icon: CheckCircle2,
    title: "Human Approvals",
    text: "Route sensitive actions to the right people. Build approval queues that keep humans in the loop without slowing things down.",
  },
  {
    icon: Bot,
    title: "AI Advisor",
    text: "LangGraph ranks opportunities and writes rationale. You see the thinking before any funds move toward USDY or mETH lanes.",
  },
  {
    icon: Network,
    title: "Connected Agents",
    text: "Map your entire agent graph. See which models are connected to which tools and how yield data flows between them.",
  },
  {
    icon: Fingerprint,
    title: "On-Chain Proof",
    text: "Every decision hash, Mantle tx, and benchmark outcome becomes verifiable proof. No black-box yield claims.",
  },
  {
    icon: Sparkles,
    title: "Analytics & Trends",
    text: "Track confidence trends, approval rates, and output quality over time. Spot regressions before they reach production.",
  },
];

export function FeaturesGridSection() {
  return (
    <section id="features" className="w-full px-9 py-16">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="relative mx-auto max-w-[520px] text-center"
      >
        <motion.p
          variants={staggerItem}
          className="mb-[10px] text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]"
        >
          EVERYTHING YOU NEED
        </motion.p>
        <motion.h2
          variants={staggerItem}
          className="text-[28px] font-extrabold -tracking-[1px] text-[#0e1a10] leading-[1.15]"
        >
          One platform for every agent in production
        </motion.h2>

        {/* Anime-style accent line */
        }
        <div className="mx-auto mt-3 h-[2px] w-12 rounded-full bg-gradient-to-r from-transparent via-[#B3DF46]/60 to-transparent" />
      </motion.div>

      <div className="relative mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => (
          <motion.div
            key={card.title}
            variants={staggerItem}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl border border-[#e8e8e4] bg-white p-[22px] transition-all duration-300 hover:border-[#b0d060] hover:shadow-[0_4px_20px_rgba(179,223,70,0.08)]"
          >
            {/* Subtle gradient glow on hover */
            }
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#B3DF46]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative mb-[14px] flex size-9 items-center justify-center rounded-xl bg-[#f4f9ec] transition-colors duration-300 group-hover:bg-[#e8f5ce]">
              <card.icon className="size-4 text-[var(--primary)]" />
            </div>
            <h3 className="relative mb-[6px] text-sm font-bold text-[#111]">{card.title}</h3>
            <p className="relative text-[12.5px] leading-[1.6] text-[#777]">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
