import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CropCardProps = { name: string; icon: string; risk: string; apy: string; description: string; accent: string };

export function CropCard({ name, icon, risk, apy, description, accent }: CropCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-4xl">{icon}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${accent}`}>{risk}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--text)]">{name}</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-muted)]">Target APY</span>
        <span className="text-lg font-black text-[var(--primary-strong)]">{apy}</span>
      </div>
      <Button className="w-full">Plant Strategy</Button>
    </Card>
  );
}
