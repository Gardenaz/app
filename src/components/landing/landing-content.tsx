"use client";

import { HeroCloudReveal } from "@/components/sections/hero-cloud-reveal";
import { ManifestoSection } from "@/components/sections/manifesto-section";
import { FeatureModern } from "@/components/ui/feature-modern";
import { NodeDiagramSection } from "@/components/sections/node-diagram";
import { BentoFeaturesSection } from "@/components/sections/bento-features-section";
import { AgniIntegrationSection } from "@/components/sections/agni-integration-section";

export function LandingContent() {
  return (
    <div className="landing-flow bg-(--bg)">
      <HeroCloudReveal />
      <ManifestoSection />
      <FeatureModern />
      <NodeDiagramSection />
      <BentoFeaturesSection />
      <AgniIntegrationSection />
    </div>
  );
}
