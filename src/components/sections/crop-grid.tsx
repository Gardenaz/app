import { CropCard } from "@/components/base/crop-card";
import { crops } from "@/lib/crops/data";

export function CropGridSection() {
  return (
    <section className="space-y-5">
      <div>
        <p className="kicker">Seed market</p>
        <h2 className="mt-1 text-2xl font-black text-[var(--text)]">Choose an RWA farming lane</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Start with USDC, WMNT, or a dynamic USDC/WMNT crop. Gardenaz translates each choice into guarded agent actions, on-chain proof, and shareable harvest notes.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {crops.map((crop) => (
          <CropCard key={crop.name} {...crop} />
        ))}
      </div>
    </section>
  );
}
