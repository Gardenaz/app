import { CropCard } from "@/components/farm/crop-card";
import { SectionTitle } from "@/components/ui/section-title";
import { crops } from "@/lib/crops/data";

export function CropGridSection() {
  return (
    <section className="space-y-6">
      <SectionTitle
        title="Choose Your Strategy Garden"
        subtitle="From low-risk rice to high-yield chili. Same clean flow, different risk profile."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {crops.map((crop) => (
          <CropCard key={crop.name} {...crop} />
        ))}
      </div>
    </section>
  );
}
