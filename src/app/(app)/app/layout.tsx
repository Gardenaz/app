"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GardenProvider, useGarden } from "./garden-context";
import { GameNav } from "@/components/app/game-nav";
import { FarmerCompanion } from "@/components/base/farmer-companion";
import { LaunchSettingsDrawer } from "@/components/launch/settings-drawer";
import { XpFloat } from "@/components/gamification/xp-float";

function OnboardingSplash() {
  return (
    <div
      className="grid min-h-svh place-items-center"
      style={{ background: "linear-gradient(180deg,#5BC8F5 0%,#A8E4FF 35%,#C8F0A8 100%)" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl"
      >
        🌱
      </motion.div>
    </div>
  );
}

function GameShell({ children }: { children: ReactNode }) {
  const g = useGarden();
  const router = useRouter();

  const hydrated = g.launchSettings.hydrated;
  const welcomeComplete = g.launchSettings.draft.welcomeComplete;

  // Resolve wallet state once Privy is ready, or after a short fallback so an
  // unconfigured/slow Privy never traps the user on the splash.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 1500);
    return () => clearTimeout(t);
  }, []);
  const resolved = g.walletReady || timedOut;

  // New users (no welcome flag, no connected wallet) are sent to the onboarding wizard.
  useEffect(() => {
    if (!hydrated || welcomeComplete) return;
    if (!resolved) return;
    if (!g.authenticated) router.replace("/welcome");
  }, [hydrated, welcomeComplete, resolved, g.authenticated, router]);

  const undecided = !hydrated || (!welcomeComplete && !resolved);
  const willRedirect = hydrated && !welcomeComplete && resolved && !g.authenticated;
  if (undecided || willRedirect) return <OnboardingSplash />;

  return (
    <>
      <LaunchSettingsDrawer
        open={g.settingsDrawerOpen}
        onOpenChange={(open) => { if (!open) g.closeSettingsDrawer(); }}
        draft={g.settingsDraft}
        onDraftChange={g.setSettingsDraft}
        onSave={g.handleSettingsSave}
        onReset={g.handleSettingsReset}
        readinessLabel={g.readinessLabel}
        saveDisabled={g.saveDisabled}
      />

      {/* XP float — viewport overlay */}
      <div className="pointer-events-none fixed inset-0 z-[60]">
        <XpFloat visible={g.showXp} label="+25 XP" x={50} y={35} />
      </div>

      {/* Page content — padded above game nav */}
      <div className="pb-16">{children}</div>

      {/* Floating farmer companion */}
      <FarmerCompanion
        weather={g.weather}
        agentData={g.data}
        pageContext={g.assistantContext}
        isPending={g.isPending}
        onOpenSettings={g.openSettingsDrawer}
        onSendMessage={g.handleFarmerMessage}
        onAction={g.handleFarmerAction}
      />

      <GameNav />
    </>
  );
}

export default function AppGameLayout({ children }: { children: ReactNode }) {
  return (
    <GardenProvider>
      <GameShell>{children}</GameShell>
    </GardenProvider>
  );
}
