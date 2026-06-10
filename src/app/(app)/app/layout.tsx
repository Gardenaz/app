"use client";

import type { ReactNode } from "react";
import { GardenProvider, useGarden } from "./garden-context";
import { GameNav } from "@/components/app/game-nav";
import { FarmerCompanion } from "@/components/base/farmer-companion";
import { LaunchSettingsDrawer } from "@/components/launch/settings-drawer";
import { WelcomeModal } from "@/components/launch/welcome-modal";
import { XpFloat } from "@/components/gamification/xp-float";

function GameShell({ children }: { children: ReactNode }) {
  const g = useGarden();

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
      <WelcomeModal
        open={g.shouldOpenWelcome}
        onOpenChange={(open) => { if (!open) g.setWelcomeDismissed(true); }}
        onContinue={() => g.launchSettings.markOnboardingComplete()}
        draft={g.launchSettings.draft}
        readiness={{
          walletConnected: Boolean(g.address),
          depositReady: g.depositReady,
          policyReady: g.onchainPolicyReady,
        }}
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
