"use client";

import { TabsContent } from "@/components/ui/tabs";
import { GardenRwaVaultSection } from "@/components/sections/garden-rwa-vault";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

type ShopProps = {
  agentData?: GardenAgentResult | null;
  amount: string;
};

export function LaunchShopTab({ agentData, amount }: ShopProps) {
  return (
    <TabsContent value="shop" className="mt-0">
      {/* CropGridSection intentionally removed from the visible layout to keep the vault flow concise. */}
      <GardenRwaVaultSection agentData={agentData} amount={amount} className="p-4" />
    </TabsContent>
  );
}
