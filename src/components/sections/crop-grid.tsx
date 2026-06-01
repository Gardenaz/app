import { CropCard } from "@/components/base/crop-card";
import { SectionTitle } from "@/components/ui/section-title";
import { crops } from "@/lib/crops/data";

export function CropGridSection() {
  return (
    <section className="space-y-6 pb-10">
      <SectionTitle
        title="Choose a farming lane"
        subtitle="Start with plain-language risk tiers. Gardena translates your choice into guarded DeFi actions and readable agent notes."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {crops.map((crop) => (
          <CropCard key={crop.name} {...crop} />
        ))}
      </div>
    </section>
  );
}
