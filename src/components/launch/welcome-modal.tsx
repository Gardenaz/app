"use client";

import { ShieldCheck, Sparkles, Wallet, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_WELCOME_COPY } from "@/lib/launch/app-page";
import type { LaunchSettingsDraft, LaunchSetupReadiness } from "@/lib/launch/settings-state";

type WelcomeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  draft: LaunchSettingsDraft;
  readiness: LaunchSetupReadiness;
};

function readinessLabel(value: boolean) {
  return value ? "Ready" : "Pending";
}

export function WelcomeModal({ open, onOpenChange, onContinue, draft, readiness }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Managed mode first
            </span>
            <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
              Beginner guide
            </span>
          </div>
          <DialogTitle className="text-2xl font-black">{APP_WELCOME_COPY.title}</DialogTitle>
          <DialogDescription className="max-w-xl text-sm leading-6">
            {APP_WELCOME_COPY.body}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Current draft</p>
            <p className="mt-1 text-sm font-black text-[var(--text)]">
              {draft.selectedLane} · {draft.defaultAmount} · risk {draft.riskPreference} · {draft.executionAuthority} mode
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Setup readiness</p>
            <p className="mt-1 text-sm font-black text-[var(--text)]">
              Wallet {readinessLabel(readiness.walletConnected)} · Deposit {readinessLabel(readiness.depositReady)} · Policy {readinessLabel(readiness.policyReady)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "On-chain benchmarking", text: APP_WELCOME_COPY.bullets[0] },
            { icon: ShieldCheck, title: "ERC-8004 identity", text: APP_WELCOME_COPY.bullets[1] },
            { icon: Waypoints, title: "Deposit to garden", text: APP_WELCOME_COPY.bullets[2] },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <div className="flex items-center gap-2">
                <div className="grid size-9 place-items-center rounded-xl bg-white text-[var(--text)]">
                  <item.icon className="size-4" />
                </div>
                <p className="text-sm font-black text-[var(--text)]">{item.title}</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs leading-5 text-[var(--text-muted)]">
          <p className="font-black text-[var(--text)]">How the flow works</p>
          <p className="mt-1">
            Welcome, connect wallet, deposit to garden, set policy, preview the plan in chat, then execute the move only if the summary still looks right.
          </p>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Close for now
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              onContinue();
              onOpenChange(false);
            }}
          >
            {APP_WELCOME_COPY.cta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
