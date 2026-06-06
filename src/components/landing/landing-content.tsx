"use client";

import { HeroCloudReveal } from "@/components/sections/hero-cloud-reveal";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { ProblemSolutionSection } from "@/components/sections/problem-solution-section";
import { NodeDiagramSection } from "@/components/sections/node-diagram";
import { TrustFeaturesSection } from "@/components/sections/trust-features-section";
import { OrbitalFeaturesSection } from "@/components/sections/orbital-features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ProofTransparencySection } from "@/components/sections/proof-transparency-section";
import { CtaSection } from "@/components/sections/cta-section";

export function LandingContent() {
  return (
    <div className="landing-flow bg-[var(--bg)]">
      <HeroCloudReveal />
      <ManifestoSection />
      <ProblemSolutionSection />
      <NodeDiagramSection />
      <TrustFeaturesSection />
      <OrbitalFeaturesSection />
      <HowItWorksSection />
      <ProofTransparencySection />
      <CtaSection />
    </div>
  );
}
