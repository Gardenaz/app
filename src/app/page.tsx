import { CropCard } from "@/components/farm/crop-card";
import { SystemStatus } from "@/components/agent/system-status";
import { crops } from "@/lib/crops/data";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#173117_0%,#0a1a0a_55%)] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300/80">Gardena</p>
            <h1 className="mt-2 text-4xl font-black leading-tight md:text-6xl">AI Farming for DeFi Beginners</h1>
            <p className="mt-3 max-w-2xl text-white/70">Pick crop strategy. AI agent executes with bounded autonomy. Every decision logged.</p>
          </div>
          <div className="hidden md:block"><SystemStatus /></div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {crops.map((crop) => (
            <CropCard key={crop.name} {...crop} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button>Connect Wallet</Button>
          <Button variant="secondary">Open Agent Diary</Button>
          <Button variant="secondary">Set Risk Policy</Button>
        </div>

        <div className="mt-4 md:hidden">
          <SystemStatus />
        </div>
      </section>
    </main>
  );
}
