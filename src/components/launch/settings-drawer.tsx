"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LaunchSettingsDraft } from "@/lib/launch/settings-state";

type SettingsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: LaunchSettingsDraft;
  onDraftChange: (next: LaunchSettingsDraft) => void;
  onSave: () => Promise<void> | void;
  onReset: () => void;
  readinessLabel: string;
  saveDisabled: boolean;
};

const LANE_OPTIONS = [
  { id: "steady" as const, label: "Safe lane", note: "Simple and steady." },
  { id: "growth" as const, label: "Growth lane", note: "Balanced yield path." },
  { id: "boost" as const, label: "Dynamic lane", note: "Higher-variance route." },
];

const RISK_OPTIONS = [
  { value: 1 as const, label: "Low" },
  { value: 2 as const, label: "Medium" },
  { value: 3 as const, label: "High" },
];

const AUTHORITY_OPTIONS = [
  { id: "managed" as const, label: "Managed mode", note: "Agent manages the delegated garden." },
  { id: "wallet" as const, label: "Wallet mode", note: "You approve each move yourself." },
];

export function LaunchSettingsDrawer({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  onSave,
  onReset,
  readinessLabel,
  saveDisabled,
}: SettingsDrawerProps) {
  function updateDraft(patch: Partial<LaunchSettingsDraft>) {
    onDraftChange({ ...draft, ...patch });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 h-dvh w-full max-w-[540px] translate-x-0 translate-y-0 rounded-none border-l border-[var(--border)] bg-[var(--surface)] p-0 shadow-[var(--shadow-xl)]">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b border-[var(--border)] px-6 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Quick settings
              </span>
              <span className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
                Managed mode
              </span>
            </div>
            <DialogTitle className="text-xl font-black text-[var(--text)]">Quick settings</DialogTitle>
            <DialogDescription className="max-w-xl text-sm leading-6">
              Tune the beginner-friendly defaults without leaving the current flow. Save changes when the draft looks right.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="grid gap-5">
              <section className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Managed mode</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {AUTHORITY_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateDraft({ executionAuthority: option.id })}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        draft.executionAuthority === option.id
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)]"
                      }`}
                    >
                      <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{option.note}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <Label htmlFor="launch-default-amount" className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Default amount
                </Label>
                <Input
                  id="launch-default-amount"
                  inputMode="decimal"
                  value={draft.defaultAmount}
                  onChange={(event) => updateDraft({ defaultAmount: event.target.value })}
                  className="h-12 rounded-2xl border-[var(--border)] bg-white text-sm font-semibold text-[var(--text)]"
                />
              </section>

              <section className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Risk level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {RISK_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateDraft({ riskPreference: option.value })}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        draft.riskPreference === option.value
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)]"
                      }`}
                    >
                      <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                      <p className="mt-1 text-[11px] text-[var(--text-muted)]">Level {option.value}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Lane</Label>
                <div className="grid gap-2">
                  {LANE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => updateDraft({ selectedLane: option.id })}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        draft.selectedLane === option.id
                          ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                          : "border-[var(--border)] bg-[var(--surface-soft)]"
                      }`}
                    >
                      <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{option.note}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-4 text-xs leading-5 text-[var(--text-muted)]">
                <p className="font-black text-[var(--text)]">Policy summary</p>
                <p className="mt-1">
                  {readinessLabel}. The current draft uses {draft.executionAuthority} mode, {draft.selectedLane} lane, and amount {draft.defaultAmount}.
                </p>
                <p className="mt-2 break-all">Managed account: {draft.managedAccountAddress || "from deployment config"}</p>
                <p className="mt-1 break-all">Managed executor: {draft.managedExecutorAddress || "from deployment config"}</p>
              </section>
            </div>
          </div>

          <DialogFooter className="border-t border-[var(--border)] px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onReset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={saveDisabled}
              onClick={async () => {
                await onSave();
                onOpenChange(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
