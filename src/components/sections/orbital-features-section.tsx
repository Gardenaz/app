"use client";

import { Bot, Fingerprint, Network, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Live Executions",
    date: "Real-time",
    content: "Monitor every agent run in real-time. See the plan, gate checks, and execution flow as they happen.",
    category: "Execution",
    icon: Radio,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 92,
  },
  {
    id: 2,
    title: "Human Approvals",
    date: "On-demand",
    content: "Route sensitive actions to the right people. Approval queues keep humans in the loop.",
    category: "Governance",
    icon: ShieldCheck,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "AI Advisor",
    date: "Continuous",
    content: "LangGraph ranks opportunities and writes rationale before any funds move.",
    category: "Intelligence",
    icon: Bot,
    relatedIds: [1, 2, 5],
    status: "in-progress" as const,
    energy: 78,
  },
  {
    id: 4,
    title: "Connected Agents",
    date: "Live",
    content: "Map your entire agent graph. See which models connect to which tools and how data flows.",
    category: "Network",
    icon: Network,
    relatedIds: [2, 5, 6],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 5,
    title: "On-Chain Proof",
    date: "Per-action",
    content: "Decision hash, Mantle tx, and benchmark outcome become verifiable proof.",
    category: "Verification",
    icon: Fingerprint,
    relatedIds: [3, 4, 6],
    status: "in-progress" as const,
    energy: 65,
  },
  {
    id: 6,
    title: "Analytics & Trends",
    date: "Ongoing",
    content: "Track confidence trends, approval rates, and output quality over time.",
    category: "Analytics",
    icon: Sparkles,
    relatedIds: [4, 5],
    status: "in-progress" as const,
    energy: 72,
  },
];

export function OrbitalFeaturesSection() {
  return (
    <section id="features" className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-[520px] px-5 pt-16 text-center"
      >
        <p className="mb-2 text-[10.5px] font-bold tracking-[2.5px] text-[#8ab83a]">
          EVERYTHING YOU NEED
        </p>
        <h2 className="text-[28px] font-extrabold -tracking-[1px] text-[#0e1a10] leading-[1.15]">
          One platform for every agent in production
        </h2>
      </motion.div>

      <RadialOrbitalTimeline timelineData={timelineData} />
    </section>
  );
}
