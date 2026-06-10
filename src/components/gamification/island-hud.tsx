"use client";

import { motion } from "framer-motion";
import type { WeatherMood } from "@/components/sections/farm-scene";

interface IslandHudProps {
  weather: WeatherMood;
  stepsComplete: number;
  totalSteps: number;
  amount: string;
  executionStatus: string;
  isConnected: boolean;
}

export function IslandHud({ weather, stepsComplete, totalSteps, amount, executionStatus, isConnected }: IslandHudProps) {
  const progress = totalSteps > 0 ? (stepsComplete / totalSteps) * 100 : 0;
  const coins = Number(amount || 0).toLocaleString();

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Left: avatar pill with name */}
      <div
        className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4"
        style={{ background: "#F5F5F5" }}
      >
        {/* Avatar circle */}
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-base"
          style={{ background: "linear-gradient(135deg, #FF9A5C 0%, #FF6B2F 100%)" }}
        >
          🧑‍🌾
        </div>
        <div>
          <p className="text-[11px] font-black leading-none text-gray-800">
            My Garden
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[9px] leading-none text-gray-400">
            <span
              className="inline-block size-1.5 rounded-full"
              style={{ background: isConnected ? "#22C55E" : "#D1D5DB" }}
            />
            {isConnected ? "Connected" : "Connect wallet"}
          </p>
        </div>
      </div>

      {/* Right: coin badge */}
      <motion.div
        className="flex items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5"
        style={{ background: "#F5F5F5" }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <span className="text-[13px] font-black text-gray-800">{coins}</span>
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-base shadow-sm"
          style={{ background: "linear-gradient(135deg, #FFD94A 0%, #FFAB00 100%)" }}
        >
          🪙
        </div>
      </motion.div>
    </div>
  );
}
