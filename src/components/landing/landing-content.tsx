"use client";

import { HeroCloudReveal } from "@/components/sections/hero-cloud-reveal";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { NodeDiagramSection } from "@/components/sections/node-diagram";
import { TrustFeaturesSection } from "@/components/sections/trust-features-section";
import { OrbitalFeaturesSection } from "@/components/sections/orbital-features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ProofTransparencySection } from "@/components/sections/proof-transparency-section";

export function LandingContent() {
  return (
    <div className="flex flex-col bg-[var(--bg)]">
      <HeroCloudReveal />
      <ManifestoSection />
      <NodeDiagramSection />
      <TrustFeaturesSection />
      <OrbitalFeaturesSection />
      <HowItWorksSection />
      <ProofTransparencySection />
    </div>
  );
}
