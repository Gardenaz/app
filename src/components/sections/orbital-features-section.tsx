"use client";

import { Bot, Fingerprint, Network, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Live activity",
    date: "As it happens",
    content: "Watch the agent move from plan to execution without losing sight of what is being changed in the vault.",
    category: "Execution",
    icon: Radio,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 92,
  },
  {
    id: 2,
    title: "User control",
    date: "When needed",
    content: "The user decides the rules up front, and can still step in whenever they want to review or change direction.",
    category: "Governance",
    icon: ShieldCheck,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "Agent guidance",
    date: "Continuous",
    content: "The agent compares choices, explains the best fit, and records the reason before funds are deployed.",
    category: "Intelligence",
    icon: Bot,
    relatedIds: [1, 2, 5],
    status: "in-progress" as const,
    energy: 78,
  },
  {
    id: 4,
    title: "Connected system",
    date: "Always on",
    content: "Vault, policy, execution, and proof work together so the user sees one clear flow instead of scattered tools.",
    category: "Network",
    icon: Network,
    relatedIds: [2, 5, 6],
    status: "completed" as const,
    energy: 80,
  },
  {
    id: 5,
    title: "Onchain proof",
    date: "Per action",
    content: "Each important action leaves a record that can be checked later without relying on hidden back-office logs.",
    category: "Verification",
    icon: Fingerprint,
    relatedIds: [3, 4, 6],
    status: "in-progress" as const,
    energy: 65,
  },
  {
    id: 6,
    title: "Progress over time",
    date: "Ongoing",
    content: "Users can follow how the agent has been performing instead of judging automation from a single moment.",
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
        <p className="mb-2 text-[10.5px] font-bold tracking-[2.5px] text-[var(--primary)]">
          EVERYTHING YOU NEED
        </p>
        <h2 className="text-[28px] font-extrabold -tracking-[1px] text-[var(--text)] leading-[1.15]">
          One place to set up, watch, and review your agent
        </h2>
      </motion.div>

      <RadialOrbitalTimeline timelineData={timelineData} />
    </section>
  );
}
