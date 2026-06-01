import { SystemStatus } from "@/components/agent/system-status";
import { HeroEnergy } from "@/components/organisms/hero-energy";
import { CropGridSection } from "@/components/sections/crop-grid";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <HeroEnergy />
        <CropGridSection />
        <section className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <SystemStatus />
        </section>
      </div>
    </main>
  );
}
