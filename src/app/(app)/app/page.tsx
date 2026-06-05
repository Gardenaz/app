"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, Sparkles, Wallet, ShieldCheck } from "lucide-react";
import {
  INITIAL_SLOTS,
  type PotSlot,
  type WeatherMood,
} from "@/components/sections/farm-scene";
import { FarmerCompanion, type FarmerCompanionContext } from "@/components/base/farmer-companion";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGardenAgent } from "@/hooks/use-garden-agent";
import { useAgentPlan } from "@/hooks/use-agent-plan";
import { useFearGreedIndex } from "@/hooks/use-fear-greed";
import { useGardenRwaVault } from "@/hooks/use-garden-rwa-vault";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import type { RiskLevel } from "@/lib/agent/types";
import { buildAssistantSummary } from "@/lib/agent/assistant-summary";
import { buildAssistantContext, marketEmoji, marketLabel, toWeatherMood } from "@/lib/launch/app-page";
import { fearGreedToLabel, fearGreedToReason, fearGreedToWeather } from "@/lib/fear-greed";
import {
  buildPlantedSlot,
  buildStartHereState,
  getActionRiskPreference,
  getCropOption,
  getCropRisk,
  getNextEmptySlotId,
  type FarmerAction,
  type CropOptionId,
} from "@/lib/launch/launch-actions";
import {
  LaunchAuditTab,
  LaunchCanvasTab,
  LaunchHeaderCard,
  LaunchShopTab,
} from "@/components/launch/page-sections";

const pageTheme: Record<WeatherMood, { bg: string }> = {
  sunny: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(240,248,243,0.98)_40%,_rgba(231,240,234,0.96)_100%)]" },
  cloudy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,246,244,0.98)_40%,_rgba(232,236,233,0.96)_100%)]" },
  rainy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(239,244,246,0.98)_40%,_rgba(227,235,238,0.96)_100%)]" },
  stormy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(239,241,241,0.98)_40%,_rgba(226,230,229,0.96)_100%)]" },
};

const onboardingStoragePrefix = "gardenaz.start-here.complete";

function money(value?: string | null) {
  const number = Number(value ?? "0");
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function onboardingStorageKey(address?: string) {
  return address ? `${onboardingStoragePrefix}:${address.toLowerCase()}` : null;
}

function readOnboardingComplete(address?: string) {
  if (typeof window === "undefined") return false;
  const key = onboardingStorageKey(address);
  if (!key) return false;
  return window.localStorage.getItem(key) === "true";
}

function writeOnboardingComplete(address: string, value: boolean) {
  if (typeof window === "undefined") return;
  const key = onboardingStorageKey(address);
  if (!key) return;
  if (value) {
    window.localStorage.setItem(key, "true");
  } else {
    window.localStorage.removeItem(key);
  }
}

function assistantGuide(state: ReturnType<typeof buildStartHereState>, walletBalance: string, vaultBalance: string, operatorApproved: boolean) {
  if (!state.hasWalletFunds) {
    return {
      title: "Claim test funds",
      body: "This gives you safe test money to try the full flow without risking real assets.",
      note: "Nothing moves until funds exist in your wallet.",
    };
  }
  if (!state.hasVaultFunds) {
    return {
      title: "Move funds into vault",
      body: `You have ${walletBalance} gUSD in your wallet. Move some into the vault so the agent has money it can manage.`,
      note: `Vault balance is ${vaultBalance} gUSD right now.`,
    };
  }
  if (!state.hasAuthorizedOperator) {
    return {
      title: "Allow agent",
      body: "You still own the money. This only lets the agent act inside your policy when working with vault funds.",
      note: operatorApproved ? "Agent access is already active." : "Agent access is still off.",
    };
  }
  if (!state.hasRequestedAutopilotStart) {
    return {
      title: "Start autopilot",
      body: "This creates the first plan immediately so the user can see what the agent wants to do before background automation takes over.",
      note: "First run will plan now, not force an on-chain move.",
    };
  }
  return {
    title: "Setup complete",
    body: "The app now switches to a simpler dashboard and keeps the vault workflow in the shop tab when needed.",
    note: "You can still withdraw or manage positions manually at any time.",
  };
}

export default function Page() {
  const [view, setView] = useState<"canvas" | "shop" | "audit">("canvas");
  const [mode, setMode] = useState<"guided" | "autopilot">("guided");
  const [message, setMessage] = useState("Help me set up my vault and explain the safest next move.");
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<RiskLevel>(1);
  const [manualAddr] = useState("0x1111111111111111111111111111111111111111");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<PotSlot[]>(INITIAL_SLOTS);
  const [autopilotStarted, setAutopilotStarted] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const { address, authenticated, login } = usePrivyWalletAddress();
  const garden = useGardenAgent();
  const autopilot = useAgentPlan();
  const fearGreed = useFearGreedIndex();
  const gardenVault = useGardenRwaVault();

  const userAddress = useMemo(
    () => (address ?? manualAddr) as `0x${string}`,
    [address, manualAddr],
  );

  useEffect(() => {
    setOnboardingCompleted(readOnboardingComplete(address));
  }, [address]);

  const data = garden.data;
  const visiblePositions = gardenVault.snapshot?.positions.length ? gardenVault.snapshot.positions : gardenVault.allSnapshot?.positions ?? [];
  const walletBalance = gardenVault.snapshot?.tokenBalance ?? gardenVault.allSnapshot?.tokenBalance ?? "0";
  const vaultBalance = gardenVault.snapshot?.vaultCashBalance ?? gardenVault.allSnapshot?.vaultCashBalance ?? "0";
  const operatorApproved = gardenVault.snapshot?.operatorApproved ?? gardenVault.allSnapshot?.operatorApproved ?? false;
  const policyEnabled = Boolean(
    (gardenVault.snapshot?.autopilotPolicyEnabled ?? gardenVault.allSnapshot?.autopilotPolicyEnabled) &&
    (gardenVault.snapshot?.autopilotProtocolAllowed ?? gardenVault.allSnapshot?.autopilotProtocolAllowed) &&
    !(gardenVault.snapshot?.autopilotEmergencyPaused ?? gardenVault.allSnapshot?.autopilotEmergencyPaused),
  );
  const weatherReasonBase = data?.marketMood.reason ?? "The agent is waiting for your setup choices before giving stronger recommendations.";

  const executionStatus = useMemo<"READY" | "PLANNED" | "PENDING" | "SENT" | "CONFIRMED" | "BLOCKED">(() => {
    if (garden.isPending || autopilot.isPending) return "PENDING";
    const response = autopilot.data;
    if (!response) return "READY";
    if (response.execution?.mode === "blocked" || response.decision.policy?.allow === false) return "BLOCKED";
    if (response.execution?.mode === "sent") return "SENT";
    if (response.anchor?.mode === "sent" || response.decision.anchorTxHash) return "CONFIRMED";
    return "PLANNED";
  }, [autopilot.data, autopilot.isPending, garden.isPending]);

  const fearGreedReading = fearGreed.data ?? null;
  const weather: WeatherMood = fearGreedReading ? fearGreedToWeather(fearGreedReading.score) : toWeatherMood(data?.marketMood.mood);
  const theme = pageTheme[weather];
  const marketLabelText = fearGreedReading ? fearGreedToLabel(fearGreedReading) : marketLabel(weather);
  const marketEmojiText = marketEmoji(weather);

  const startHereState = useMemo(
    () => buildStartHereState({
      walletBalance,
      vaultBalance,
      operatorApproved,
      autopilotStarted,
      onboardingCompleted,
    }),
    [autopilotStarted, onboardingCompleted, operatorApproved, vaultBalance, walletBalance],
  );

  const guide = assistantGuide(startHereState, money(walletBalance), money(vaultBalance), operatorApproved);
  const agentReady = onboardingCompleted && startHereState.hasVaultFunds && startHereState.hasAuthorizedOperator && policyEnabled;

  const assistantContext: FarmerCompanionContext = useMemo(
    () =>
      buildAssistantContext({
        mode,
        view,
        weather,
        marketLabel: marketLabelText,
        weatherReason: `${fearGreedReading ? fearGreedToReason(fearGreedReading) : ""} ${weatherReasonBase}`.trim(),
        gUsdBalance: money(walletBalance),
        plantedCount: visiblePositions.length,
        onchainPositions: visiblePositions,
        data,
      }),
    [data, fearGreedReading, marketLabelText, mode, view, visiblePositions, walletBalance, weather, weatherReasonBase],
  );

  const setupSteps = [
    {
      id: "claim",
      title: "Claim test funds",
      body: "Get trial gUSD in your wallet.",
      complete: startHereState.hasWalletFunds,
      action: () => gardenVault.faucet("1000"),
      disabled: !gardenVault.canInteract || gardenVault.isFauceting || !gardenVault.canFaucet,
      cta: "Claim test funds",
    },
    {
      id: "deposit",
      title: "Move funds into vault",
      body: "The vault is what the agent can manage.",
      complete: startHereState.hasVaultFunds,
      action: () => gardenVault.deposit(amount),
      disabled: !gardenVault.canInteract || gardenVault.isDepositing || !startHereState.hasWalletFunds,
      cta: "Move funds into vault",
    },
    {
      id: "authorize",
      title: "Allow agent",
      body: "Allow the agent to act inside your rules.",
      complete: startHereState.hasAuthorizedOperator,
      action: () => gardenVault.setVaultOperator(true),
      disabled: !gardenVault.canInteract || gardenVault.isSettingOperator || !startHereState.hasVaultFunds,
      cta: "Allow agent",
    },
    {
      id: "autopilot",
      title: "Start autopilot",
      body: "Turn on the on-chain policy and create the first plan now.",
      complete: startHereState.hasRequestedAutopilotStart,
      action: async () => {
        await gardenVault.setAutopilotPolicy({
          amount: String(Math.max(Number(vaultBalance || "0"), Number(amount))),
          maxDailyLossAmount: String(Math.max(Number(vaultBalance || "0"), Number(amount))),
          riskLevel: risk,
        });
        const response = await autopilot.mutateAsync({
          user: userAddress,
          crop: data?.intent.parsedStrategy ?? "steady",
          amount: String(Math.max(Number(vaultBalance || "0"), Number(amount))),
          riskPreference: risk,
          execute: false,
        });
        setAutopilotStarted(true);
        if (address) {
          writeOnboardingComplete(address, true);
        }
        setOnboardingCompleted(true);
        return response;
      },
      disabled: autopilot.isPending || gardenVault.isSettingPolicy || !startHereState.hasAuthorizedOperator,
      cta: "Start autopilot",
    },
  ] as const;

  const handleCropPick = useCallback((slotId: string, cropId: CropOptionId) => {
    const option = getCropOption(cropId);
    if (!option) return;

    const lvl: RiskLevel = getCropRisk(cropId);
    setSlots((prev) => prev.map((slot) => (slot.id === slotId ? buildPlantedSlot(slot, cropId) : slot)));
    setSelectedId(null);
    setTimeout(() => {
      setSlots((prev) => prev.map((slot) => (slot.id === slotId ? { ...slot, state: "growing" } : slot)));
    }, 900);

    const intent = `tanam ${option.crop} ${option.asset} ${amount}`;
    setMessage(intent);
    setRisk(lvl);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: lvl, execute: false });
  }, [amount, garden, userAddress]);

  const handleClearSlot = useCallback((slotId: string) => {
    setSlots((prev) => prev.map((slot) => (slot.id === slotId ? { ...INITIAL_SLOTS.find((item) => item.id === slotId)! } : slot)));
  }, []);

  const handleSlotClick = useCallback((slot: PotSlot) => {
    setSelectedId((prev) => (prev === slot.id ? null : slot.id));
  }, []);

  async function handleFarmerAction(action: FarmerAction, promptText?: string) {
    if (promptText) setMessage(promptText);

    if (mode === "autopilot") {
      const response = await autopilot.mutateAsync({
        user: userAddress,
        crop: data?.intent.parsedStrategy ?? "steady",
        amount: String(Math.max(Number(vaultBalance || "0"), Number(amount))),
        riskPreference: risk,
        execute: true,
      });
      const summary = buildAssistantSummary("autopilot", response.decision, response.anchor?.txHash ?? response.decision.anchorTxHash ?? null);
      const executionLine =
        response.execution?.mode === "sent"
          ? `\n\n**Execution:** sent on-chain. ${response.execution.note}`
          : response.execution?.mode === "prepared"
            ? `\n\n**Execution:** prepared only. ${response.execution.note}`
            : response.execution?.mode === "blocked"
              ? `\n\n**Execution:** blocked. ${response.execution.note}`
              : "";
      return `${summary}${executionLine}`;
    }

    if (action === "analyze" || action === "protect") {
      const result = await garden.mutateAsync({
        user: userAddress,
        message: promptText ?? message,
        amount,
        riskPreference: getActionRiskPreference(action, risk),
        execute: false,
      });
      return buildAssistantSummary("guided", result.decision, result.decision.anchorTxHash ?? null);
    }

    const guidance = await garden.mutateAsync({
      user: userAddress,
      message: promptText ?? message,
      amount,
      riskPreference: getActionRiskPreference(action, risk),
      execute: false,
    });
    const summary = buildAssistantSummary("guided", guidance.decision, guidance.decision.anchorTxHash ?? null);

    if (action === "harvest") {
      const harvestablePosition = visiblePositions.find((position) => position.owner.toLowerCase() === gardenVault.walletAddress?.toLowerCase() && !position.harvested);
      if (!harvestablePosition) {
        return `${summary}\n\n**Execution:** no position is ready to close manually.`;
      }
      const harvestTx = await gardenVault.harvest(harvestablePosition.positionId);
      return `${summary}\n\n**Execution:** manual close sent on-chain with tx \`${harvestTx}\`.`;
    }

    const cropKey = (guidance.intent.parsedStrategy ?? data?.intent.parsedStrategy ?? "steady") as "steady" | "growth" | "boost";
    const plantTx = await gardenVault.plant({ cropKey, amount });
    return `${summary}\n\n**Execution:** manual open sent on-chain with tx \`${plantTx}\`.`;
  }

  function handleFarmerMessage(msg: string) {
    setMessage(msg);
    garden.mutate({ user: userAddress, message: msg, amount, riskPreference: risk, execute: false });
  }

  const handleTopUp = useCallback(() => {
    if (!authenticated || !gardenVault.canInteract) {
      void login();
      return;
    }
    void gardenVault.faucet("1000");
  }, [authenticated, gardenVault, login]);

  return (
    <div className={`shell min-h-svh ${theme.bg}`}>
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
        <LaunchHeaderCard
          view={view}
          mode={mode}
          executionStatus={executionStatus}
          plantedCount={visiblePositions.length}
          isPending={garden.isPending || autopilot.isPending}
          onPlanSafeMove={() => {
            void setupSteps[3].action();
          }}
          onTopUp={handleTopUp}
          canTopUp={gardenVault.canFaucet}
          onViewChange={(nextView) => setView(nextView)}
          onModeChange={setMode}
          marketLabel={marketLabelText}
          marketEmoji={marketEmojiText}
          agentReady={agentReady}
        />

        {!onboardingCompleted ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
            <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,244,0.98))] p-5 shadow-[var(--shadow-md)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="kicker">Start Here</p>
                  <h2 className="mt-1 text-2xl font-black text-[var(--text)]">Set up your vault in one guided flow</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                    Claim test funds, move them into the vault, allow agent access, and create the first autopilot plan. This page stays light on DeFi jargon so a new user can move confidently.
                  </p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Progress</p>
                  <p className="mt-1 text-2xl font-black text-[var(--text)]">{setupSteps.filter((step) => step.complete).length}/4</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {setupSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${step.complete ? "bg-emerald-100 text-emerald-700" : "bg-white text-[var(--text-muted)]"}`}>
                        {step.complete ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Step {index + 1}</p>
                        <h3 className="mt-1 text-sm font-black text-[var(--text)]">{step.title}</h3>
                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{step.body}</p>
                      </div>
                    </div>
                    <Button type="button" variant={step.id === "autopilot" ? "primary" : "secondary"} disabled={step.disabled || step.complete} onClick={() => void step.action()}>
                      {step.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-black text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="kicker">Assistant Guide</p>
                    <h3 className="text-sm font-black text-[var(--text)]">{guide.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{guide.body}</p>
                <p className="mt-2 text-xs leading-5 text-[var(--text-subtle)]">{guide.note}</p>
              </Card>

              <Card className="p-5">
                <p className="kicker">Your money</p>
                <div className="mt-3 grid gap-3">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="size-4 text-[var(--text-muted)]" />
                      <p className="text-sm font-black text-[var(--text)]">Wallet balance</p>
                    </div>
                    <p className="mt-2 text-2xl font-black text-[var(--text)]">{money(walletBalance)} gUSD</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-[var(--text-muted)]" />
                      <p className="text-sm font-black text-[var(--text)]">Vault balance</p>
                    </div>
                    <p className="mt-2 text-2xl font-black text-[var(--text)]">{money(vaultBalance)} gUSD</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          <Tabs value={view} onValueChange={(value) => setView(value as typeof view)} className="mt-0">
            <LaunchCanvasTab
              weather={weather}
              slots={slots}
              agentData={data}
              selectedId={selectedId}
              isLoading={garden.isPending || autopilot.isPending}
              onSlotClick={handleSlotClick}
              onCropPick={handleCropPick}
              onQuickPick={(cropId) => {
                const slot = getNextEmptySlotId(slots);
                if (!slot) return;
                handleCropPick(slot, cropId);
              }}
              onClearSlot={handleClearSlot}
              onOpenShop={() => setView("shop")}
              onOpenAudit={() => setView("audit")}
            />
            <LaunchShopTab agentData={data} amount={amount} />
            <LaunchAuditTab assistantContext={assistantContext} />
          </Tabs>
        </div>
      </div>

      <FarmerCompanion
        weather={weather}
        agentData={data}
        pageContext={assistantContext}
        isPending={garden.isPending || autopilot.isPending}
        onSendMessage={handleFarmerMessage}
        onAction={handleFarmerAction}
      />
    </div>
  );
}
