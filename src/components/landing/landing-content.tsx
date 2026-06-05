"use client";

import { HeroCloudReveal } from "@/components/sections/hero-cloud-reveal";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { TrustFeaturesSection } from "@/components/sections/trust-features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ProofTransparencySection } from "@/components/sections/proof-transparency-section";
import { ProblemSolutionSection } from "@/components/sections/problem-solution-section";
import { CtaSection } from "@/components/sections/cta-section";

export function LandingContent() {
  return (
    <div className="landing-flow bg-[var(--bg)]">
      <HeroCloudReveal />
      <ManifestoSection />
      <ProblemSolutionSection />
      <TrustFeaturesSection />
      <HowItWorksSection />
      {/* <ProofTransparencySection /> */}
      {/* <CtaSection /> */}
    </div>
  );
}
