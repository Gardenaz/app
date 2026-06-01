import { SystemStatus } from "@/components/base/system-status";
import { CropGridSection } from "@/components/sections/crop-grid";
import { AgentPlannerSection } from "@/components/sections/agent-planner";
import { HeroEnergy } from "@/components/sections/hero-energy";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-full border border-white/80 bg-white/75 px-4 py-3 shadow-sm shadow-emerald-900/5 backdrop-blur md:px-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--primary-soft)] text-sm font-black text-[var(--primary-strong)] shadow-inner">
              G
            </div>
            <div>
              <div className="text-sm font-black text-[var(--text)]">Gardena</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">AI farming on Mantle</div>
            </div>
          </div>
          <SystemStatus compact />
        </header>
        <HeroEnergy />
        <CropGridSection />
        <AgentPlannerSection />
      </div>
    </main>
  );
}
