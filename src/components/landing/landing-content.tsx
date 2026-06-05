"use client";

import { HeroCloudReveal } from "@/components/sections/hero-cloud-reveal";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { NodeDiagramSection } from "@/components/sections/node-diagram";
import { ProblemSolutionSection } from "@/components/sections/problem-solution-section";
import { FeaturesGridSection } from "@/components/sections/features-grid";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ProofTransparencySection } from "@/components/sections/proof-transparency-section";
import { PaintingDecor } from "@/components/landing/painting-decor";

export function LandingContent() {
  return (
    <div className="flex flex-col bg-white">
      <HeroCloudReveal />
      <PaintingDecor variant="floral-top" />
      <ManifestoSection />
      <NodeDiagramSection />
      <ProblemSolutionSection />
      <FeaturesGridSection />
      <HowItWorksSection />
      <ProofTransparencySection />
      <PaintingDecor variant="waves-bottom" />
    </div>
  );
}
