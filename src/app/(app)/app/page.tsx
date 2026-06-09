"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import {
  CROP_OPTIONS,
  FarmScene,
  INITIAL_SLOTS,
  type PotSlot,
  type WeatherMood,
} from "@/components/sections/farm-scene";
import { FarmerCompanion, type FarmerCompanionContext } from "@/components/base/farmer-companion";
import { AgentHistorySection } from "@/components/sections/agent-history";
import { PlantedSummary } from "@/components/launch/canvas/planted-summary";
import { LaunchSettingsDrawer } from "@/components/launch/settings-drawer";
import { WelcomeModal } from "@/components/launch/welcome-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGardenAgent } from "@/hooks/use-garden-agent";
import { useAgentPlan } from "@/hooks/use-agent-plan";
import { useAgniExecution } from "@/hooks/use-agni-execution";
import { useAgentHistory } from "@/hooks/use-agent-history";
import { useAgentReadiness } from "@/hooks/use-agent-readiness";
import { useAutopilotPolicy } from "@/hooks/use-autopilot-policy";
import { useFearGreedIndex } from "@/hooks/use-fear-greed";
import { useManagedAgniExecution } from "@/hooks/use-managed-agni-execution";
import { useManagedGardenAccount } from "@/hooks/use-managed-garden-account";
import { useLaunchSettings } from "@/hooks/use-launch-settings";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import type { CropId, RiskLevel } from "@/lib/agent/types";
import { buildAutopilotPolicy } from "@/lib/agent/autopilot";
import { buildAssistantSummary } from "@/lib/agent/assistant-summary";
import {
  APP_ONBOARDING_STEPS,
  buildAssistantContext,
  marketEmoji,
  marketLabel,
  toWeatherMood,
} from "@/lib/launch/app-page";
import { shouldShowWelcomeModal } from "@/lib/launch/settings-state";
import { fearGreedToLabel, fearGreedToReason, fearGreedToWeather } from "@/lib/fear-greed";
import {
  buildFlowState,
  buildPlantedSlot,
  getActionRiskPreference,
  getCropOption,
  getCropRisk,
  getExecutionGardenLabel,
  getNextEmptySlotId,
  getOperationLabel,
  getPreviewStepLabel,
  type CropOptionId,
  type FarmerAction,
} from "@/lib/launch/launch-actions";

const pageTheme: Record<WeatherMood, { bg: string }> = {
  sunny: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(240,248,243,0.98)_40%,_rgba(231,240,234,0.96)_100%)]" },
  cloudy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(244,246,244,0.98)_40%,_rgba(232,236,233,0.96)_100%)]" },
  rainy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(239,244,246,0.98)_40%,_rgba(227,235,238,0.96)_100%)]" },
  stormy: { bg: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(239,241,241,0.98)_40%,_rgba(226,230,229,0.96)_100%)]" },
};

function money(value?: string | null) {
  const number = Number(value ?? "0");
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function assistantGuide(input: {
  welcomeSeen: boolean;
  connected: boolean;
  depositReady: boolean;
  policyReady: boolean;
  previewReady: boolean;
  executionMode?: "disabled" | "blocked" | "prepared" | "sent";
}) {
  if (!input.welcomeSeen) {
    return {
      title: "Welcome",
      body: "Managed mode comes first. The welcome modal explains the garden deposit, on-chain benchmarking, and ERC-8004 identity before anything moves.",
      note: "Preview summaries stay in assistant chat, not as live garden state.",
    };
  }

  if (!input.connected) {
    return {
      title: "Connect wallet",
      body: "Start with your wallet so the garden can tie every preview and proof record to a real owner.",
      note: "No wallet means no live Agni move request.",
    };
  }

  if (!input.depositReady) {
    return {
      title: "Deposit to garden",
      body: "Move USDC into the garden account before the assistant shapes a route around it.",
      note: "Deposit comes before policy so the flow stays managed-mode-first.",
    };
  }

  if (!input.policyReady) {
    return {
      title: "Set policy",
      body: "Pick a safe, growth, or dynamic lane so Agni previews stay inside beginner-friendly guardrails.",
      note: "This phase keeps the policy transparent in-app instead of pretending it is already synced everywhere.",
    };
  }

  if (!input.previewReady) {
    return {
      title: "Preview plan",
      body: "Ask the agent for an Agni-first route preview before sending anything on-chain. The preview summary stays in chat, not as live garden state.",
      note: "You will see whether the next move is swap/add liquidity/remove liquidity/rebalance liquidity.",
    };
  }

  if (input.executionMode === "prepared") {
    return {
      title: "Execute move",
      body: "The route is prepared. Review the proof note and only send the move when it still matches your intent.",
      note: "Prepared is not sent. No fake execution claim is shown here.",
    };
  }

  if (input.executionMode === "sent") {
    return {
      title: "Move sent",
      body: "The agent has a real execution result to report, so the proof trail can point to an actual Mantle transaction.",
      note: "Wait for confirmation in your wallet and the proof history.",
    };
  }

  return {
    title: "Check the route",
    body: "The planner returned a route status that still needs review before any move should be treated as live.",
    note: "Blocked and disabled paths stay explicit.",
  };
}

export default function Page() {
  const [view, setView] = useState<"canvas" | "audit">("canvas");
  const [mode, setMode] = useState<"guided" | "autopilot">("guided");
  const [message, setMessage] = useState("Help me choose the safest Agni-first crop and explain the next move in plain language.");
  const [manualAddr] = useState("0x1111111111111111111111111111111111111111");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<PotSlot[]>(INITIAL_SLOTS);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const { address, authenticated, login } = usePrivyWalletAddress();
  const managedAccount = useManagedGardenAccount();
  const garden = useGardenAgent();
  const autopilot = useAgentPlan();
  const agniExecution = useAgniExecution();
  const autopilotPolicy = useAutopilotPolicy();
  const managedAgniExecution = useManagedAgniExecution();
  const history = useAgentHistory();
  const readiness = useAgentReadiness();
  const fearGreed = useFearGreedIndex();
  const data = garden.data;

  const userAddress = useMemo(
    () => (address ?? manualAddr) as `0x${string}`,
    [address, manualAddr],
  );
  const depositReady = managedAccount.depositReady;
  const onchainPolicyReady = Boolean(managedAccount.snapshot?.executorAuthorized);
  const launchSettings = useLaunchSettings({
    walletConnected: Boolean(address),
    depositReady,
    policyReady: onchainPolicyReady,
  });
  const shouldShowWelcome = shouldShowWelcomeModal(launchSettings.draft, {
    walletConnected: Boolean(address),
    depositReady,
    policyReady: onchainPolicyReady,
  });
  useEffect(() => {
    if (!shouldShowWelcome) {
      setWelcomeDismissed(false);
    }
  }, [shouldShowWelcome]);
  const shouldOpenWelcome = shouldShowWelcome && !welcomeDismissed;
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState(launchSettings.draft);
  const launchDraftRef = useRef(launchSettings.draft);
  const settingsBaselineRef = useRef(launchSettings.draft);

  useEffect(() => {
    launchDraftRef.current = launchSettings.draft;
  }, [launchSettings.draft]);

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#launch-settings") {
        const snapshot = launchDraftRef.current;
        settingsBaselineRef.current = snapshot;
        setSettingsDraft(snapshot);
        setSettingsDrawerOpen(true);
        return;
      }

      setSettingsDrawerOpen(false);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const openSettingsDrawer = useCallback(() => {
    const snapshot = launchDraftRef.current;
    settingsBaselineRef.current = snapshot;
    setSettingsDraft(snapshot);
    setSettingsDrawerOpen(true);
    window.location.hash = "launch-settings";
  }, []);

  const closeSettingsDrawer = useCallback(() => {
    setSettingsDrawerOpen(false);
    if (window.location.hash === "#launch-settings") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  const handleSettingsSave = useCallback(async () => {
    launchSettings.updateDraft(settingsDraft);
    launchSettings.saveDraft();
    closeSettingsDrawer();
  }, [closeSettingsDrawer, launchSettings, settingsDraft]);

  const handleSettingsReset = useCallback(() => {
    setSettingsDraft(settingsBaselineRef.current);
    closeSettingsDrawer();
  }, [closeSettingsDrawer]);

  const backendExecutorAddress = process.env.NEXT_PUBLIC_AUTOPILOT_EXECUTOR_ADDRESS as `0x${string}` | undefined;
  const amount = launchSettings.draft.defaultAmount;
  const risk = launchSettings.draft.riskPreference;
  const activeCrop = launchSettings.draft.selectedLane;
  const executionAuthority = launchSettings.draft.executionAuthority;
  const policyInput = useMemo(
    () =>
      buildAutopilotPolicy({
        user: userAddress,
        amount,
        crop: data?.intent.parsedStrategy ?? activeCrop,
        riskPreference: risk,
        enabled: true,
        rebalanceIntervalHours: 24,
        oracleHeartbeatMinutes: 15,
        executionAuthority,
        executorAddress: backendExecutorAddress,
        selectedProtocols: [activeCrop === "boost" ? "0x71959543c31EC4d68D9D6C492Bf69A1C174bb394" : "0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16"],
      }),
    [activeCrop, amount, backendExecutorAddress, data?.intent.parsedStrategy, executionAuthority, risk, userAddress],
  );
  const managedModeMismatch = executionAuthority === "managed"
    && Boolean(backendExecutorAddress)
    && userAddress.toLowerCase() !== (backendExecutorAddress ?? "").toLowerCase();
  const preview = autopilot.data;
  const hasPolicyReady = launchSettings.draft.policyConfirmed || onchainPolicyReady;
  const previewMode = preview?.execution?.mode;
  const previewOperation = preview?.execution?.operation ?? null;
  const previewReady = Boolean(preview);
  const previewAssistantSummary = preview
    ? buildAssistantSummary("autopilot", preview.decision, preview.anchor?.txHash ?? preview.decision.anchorTxHash ?? null)
    : null;
  const modeReadiness = readiness.data?.executionModes[executionAuthority];
  const readinessNotes = readiness.data?.benchmarking.notes ?? [];
  const executionReady = (previewMode === "prepared" || previewMode === "sent") && (modeReadiness?.ready ?? false);
  const flowState = useMemo(
    () =>
      buildFlowState({
        connected: Boolean(address),
        policyReady: hasPolicyReady,
        planPreviewed: previewReady,
        hasExecutionTarget: executionReady,
      }),
    [address, executionReady, hasPolicyReady, previewReady],
  );

  const executionStatus = useMemo<"READY" | "PLANNED" | "PENDING" | "SENT" | "CONFIRMED" | "BLOCKED">(() => {
    if (garden.isPending || autopilot.isPending || agniExecution.isPending || autopilotPolicy.isPending || managedAgniExecution.isPending || readiness.isLoading) return "PENDING";
    if (!preview) return "READY";
    if (preview.execution?.mode === "blocked" || preview.decision.policy?.allow === false || modeReadiness?.ready === false) return "BLOCKED";
    if (preview.execution?.mode === "sent") return "SENT";
    if (preview.anchor?.mode === "sent" || preview.decision.anchorTxHash) return "CONFIRMED";
    return "PLANNED";
  }, [agniExecution.isPending, autopilot.isPending, autopilotPolicy.isPending, garden.isPending, managedAgniExecution.isPending, modeReadiness?.ready, preview, readiness.isLoading]);

  const fearGreedReading = fearGreed.data ?? null;
  const weather: WeatherMood = fearGreedReading ? fearGreedToWeather(fearGreedReading.score) : toWeatherMood(data?.marketMood.mood);
  const theme = pageTheme[weather];
  const marketLabelText = fearGreedReading ? fearGreedToLabel(fearGreedReading) : marketLabel(weather);
  const marketEmojiText = marketEmoji(weather);
  const selectedCrop = getCropOption(activeCrop);
  const guide = assistantGuide({
    welcomeSeen: launchSettings.draft.onboardingComplete,
    connected: flowState.hasConnectedWallet,
    depositReady,
    policyReady: hasPolicyReady,
    previewReady: flowState.hasPreview,
    executionMode: previewMode,
  });

  const assistantContext: FarmerCompanionContext = useMemo(
    () =>
        buildAssistantContext({
          mode,
          view,
          weather,
          marketLabel: marketLabelText,
          weatherReason: `${fearGreedReading ? fearGreedToReason(fearGreedReading) : ""} ${data?.marketMood.reason ?? "The garden is waiting for your Agni-first choices."}`.trim(),
          gUsdBalance: money(amount),
          plantedCount: slots.filter((slot) => slot.state !== "empty").length,
          historyRows: history.data ?? [],
          onchainPositions: [],
          data,
          latestDecision: previewAssistantSummary ?? data?.decision.summary ?? data?.beginnerExplanation ?? null,
        }),
    [amount, data, fearGreedReading, history.data, marketLabelText, mode, previewAssistantSummary, slots, view, weather],
  );

  const buildPlanRequest = useCallback(
    (execute: boolean) =>
      autopilot.mutateAsync({
        user: userAddress,
        crop: data?.intent.parsedStrategy ?? activeCrop,
        amount,
        riskPreference: risk,
        execute,
        policy: policyInput,
      }),
    [activeCrop, amount, autopilot, data?.intent.parsedStrategy, policyInput, risk, userAddress],
  );

  const handleCropPick = useCallback((slotId: string, cropId: CropOptionId) => {
    const option = getCropOption(cropId);
    if (!option) return;

    const nextRisk = getCropRisk(cropId);
    launchSettings.setLane(cropId);
    launchSettings.setRisk(nextRisk);
    setSlots((prev) => prev.map((slot) => (slot.id === slotId ? buildPlantedSlot(slot, cropId) : slot)));
    setSelectedId(null);
    setTimeout(() => {
      setSlots((prev) => prev.map((slot) => (slot.id === slotId ? { ...slot, state: "growing" } : slot)));
    }, 900);

    const intent = `plant ${option.crop} with ${option.asset} using ${amount}`;
    setMessage(intent);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: nextRisk, execute: false });
  }, [amount, garden, launchSettings, userAddress]);

  const handleClearSlot = useCallback((slotId: string) => {
    setSlots((prev) => prev.map((slot) => (slot.id === slotId ? { ...INITIAL_SLOTS.find((item) => item.id === slotId)! } : slot)));
  }, []);

  const handleSlotClick = useCallback((slot: PotSlot) => {
    setSelectedId((prev) => (prev === slot.id ? null : slot.id));
  }, []);

  const handleConnectWallet = useCallback(() => {
    if (!authenticated) {
      void login();
    }
  }, [authenticated, login]);

  const handleDepositToGarden = useCallback(() => {
    if (!address) {
      void login();
      return;
    }

    setView("canvas");
    const intent = `Explain the deposit to garden step for ${amount} in beginner language.`;
    setMessage(intent);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: risk, execute: false });
  }, [address, amount, garden, login, risk, userAddress]);

  const handlePolicyReady = useCallback(async () => {
    if (!address) {
      void login();
      return;
    }
    await autopilotPolicy.mutateAsync({ policy: policyInput });
    launchSettings.setPolicyConfirmed(true);
    setMode("autopilot");
  }, [address, autopilotPolicy, launchSettings, login, policyInput]);

  const handlePreviewPlan = useCallback(async () => {
    if (!address) {
      void login();
      return;
    }
    if (!hasPolicyReady) {
      setMode("autopilot");
      return;
    }
    setView("canvas");
    await buildPlanRequest(false);
  }, [address, buildPlanRequest, hasPolicyReady, login]);

  const handleExecuteMove = useCallback(async () => {
    if (!address) {
      void login();
      return;
    }
    if (!hasPolicyReady) {
      setMode("autopilot");
      return;
    }
    if (modeReadiness?.ready === false) {
      throw new Error(modeReadiness.note);
    }
    const response = await buildPlanRequest(true);
    if (executionAuthority === "managed") {
      await managedAgniExecution.mutateAsync({
        user: userAddress,
        crop: data?.intent.parsedStrategy ?? activeCrop,
        amount,
        riskPreference: risk,
        policy: policyInput,
      });
      await buildPlanRequest(false);
      await history.refetch();
      return;
    }

    if (response.execution?.mode === "blocked" || response.execution?.mode === "prepared") {
      await agniExecution.mutateAsync({
        decision: response.decision,
        execution: response.execution,
      });
      await buildPlanRequest(false);
      await history.refetch();
    }
  }, [activeCrop, address, agniExecution, amount, buildPlanRequest, data?.intent.parsedStrategy, executionAuthority, hasPolicyReady, history, login, managedAgniExecution, modeReadiness?.note, modeReadiness?.ready, policyInput, risk, userAddress]);

  async function handleFarmerAction(action: FarmerAction, promptText?: string) {
    if (promptText) setMessage(promptText);

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

    if (!hasPolicyReady) {
      return "Set policy first so I can keep the Agni move inside your beginner guardrails.";
    }

    const response = await autopilot.mutateAsync({
      user: userAddress,
      crop: data?.intent.parsedStrategy ?? activeCrop,
      amount,
      riskPreference: getActionRiskPreference(action, risk),
      execute: true,
      policy: policyInput,
    });

    const summary = buildAssistantSummary(
      "autopilot",
      response.decision,
      response.anchor?.txHash ?? response.decision.anchorTxHash ?? null,
    );

    const moveLine = `\n\n**Move:** ${getExecutionGardenLabel(response.execution?.operation ?? null)} (${getOperationLabel(response.execution?.operation ?? null)}).`;
    const executionLine =
      response.execution?.mode === "sent"
        ? `\n\n**Execution:** sent on-chain. ${response.execution.note}`
        : response.execution?.mode === "prepared"
          ? `\n\n**Execution:** prepared only. ${response.execution.note}`
          : response.execution?.mode === "blocked"
            ? `\n\n**Execution:** blocked. ${response.execution.note}`
            : response.execution?.mode === "disabled"
              ? `\n\n**Execution:** disabled. ${response.execution.note}`
              : "";

    return `${summary}${moveLine}${executionLine}`;
  }

  function handleFarmerMessage(nextMessage: string) {
    setMessage(nextMessage);
    garden.mutate({ user: userAddress, message: nextMessage, amount, riskPreference: risk, execute: false });
  }

  const steps = APP_ONBOARDING_STEPS.map((step) => {
    if (step.id === "welcome") {
      return {
        ...step,
        complete: launchSettings.draft.onboardingComplete,
        disabled: false,
        action: () => launchSettings.markOnboardingComplete(),
        cta: launchSettings.draft.onboardingComplete ? "Setup saved" : step.cta,
      };
    }

    if (step.id === "connect-wallet") {
      return {
        ...step,
        complete: flowState.hasConnectedWallet,
        disabled: flowState.hasConnectedWallet,
        action: handleConnectWallet,
        cta: flowState.hasConnectedWallet ? "Connected" : step.cta,
      };
    }

    if (step.id === "deposit-to-garden") {
      return {
        ...step,
        complete: depositReady,
        disabled: !flowState.hasConnectedWallet || depositReady || garden.isPending,
        action: handleDepositToGarden,
        cta: depositReady ? "Deposit ready" : step.cta,
      };
    }

    if (step.id === "set-policy") {
      return {
        ...step,
        complete: hasPolicyReady,
        disabled: !flowState.hasConnectedWallet || hasPolicyReady || autopilotPolicy.isPending,
        action: () => void handlePolicyReady(),
        cta: hasPolicyReady ? "Policy ready" : step.cta,
      };
    }

    if (step.id === "preview-plan") {
      return {
        ...step,
        complete: flowState.hasPreview,
        disabled:
          !flowState.hasPolicy || autopilot.isPending || agniExecution.isPending || managedAgniExecution.isPending || autopilotPolicy.isPending,
        action: () => void handlePreviewPlan(),
        cta: step.cta,
      };
    }

    return {
      ...step,
      complete: previewMode === "sent",
      disabled:
        !flowState.canExecute || autopilot.isPending || agniExecution.isPending || managedAgniExecution.isPending || autopilotPolicy.isPending || readiness.isLoading,
      action: () => void handleExecuteMove(),
      cta: executionAuthority === "managed" ? "Run managed move" : preview?.execution?.mode === "blocked" ? "Approve token" : step.cta,
    };
  });

  return (
    <>
      <LaunchSettingsDrawer
        open={settingsDrawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeSettingsDrawer();
          }
        }}
        draft={settingsDraft}
        onDraftChange={setSettingsDraft}
        onSave={handleSettingsSave}
        onReset={handleSettingsReset}
        readinessLabel={modeReadiness?.note ?? "Live readiness checks still need a pass."}
        saveDisabled={autopilotPolicy.isPending || readiness.isLoading || !settingsDraft.defaultAmount.trim()}
      />
      <WelcomeModal
        open={shouldOpenWelcome}
        onOpenChange={(open) => {
          if (!open) {
            setWelcomeDismissed(true);
          }
        }}
        onContinue={() => launchSettings.markOnboardingComplete()}
        draft={launchSettings.draft}
        readiness={{
          walletConnected: Boolean(address),
          depositReady,
          policyReady: onchainPolicyReady,
        }}
      />
      <div className={`shell min-h-svh ${theme.bg}`}>
      <div className="mx-auto max-w-screen-xl px-4 py-4 sm:px-6">
        <Card className="overflow-hidden border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,249,247,0.98))] p-5 shadow-[var(--shadow-md)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Gardenaz
                </span>
                <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
                  Agni-first
                </span>
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text)]">
                  AI x RWA
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-black text-[var(--text)] sm:text-4xl">
                Welcome, connect wallet, deposit to garden, set policy, preview the route, then execute the move.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Managed mode comes first. Preview summaries stay in assistant chat; the garden only shows state that is actually planted or executed on-chain.
              </p>
            </div>

            <div className="grid gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-3 lg:w-[420px]">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                <p className="font-black text-[var(--text)]">{marketEmojiText} {marketLabelText}</p>
                <p className="mt-1">Market weather</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                <p className="font-black text-[var(--text)]">{executionStatus}</p>
                <p className="mt-1">Agent status</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                <p className="font-black text-[var(--text)]">{flowState.hasPolicy ? "Policy ready" : "Need policy"}</p>
                <p className="mt-1">Setup state</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_380px]">
          <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,244,0.98))] p-5 shadow-[var(--shadow-md)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker">Start Here</p>
                <h2 className="mt-1 text-2xl font-black text-[var(--text)]">Managed-mode-first flow for first-time growers</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                  The welcome modal explains managed mode, on-chain benchmarking, ERC-8004 identity, and the deposit-to-garden idea in plain language before the rest of the flow starts.
                </p>
              </div>
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">Progress</p>
                <p className="mt-1 text-2xl font-black text-[var(--text)]">{steps.filter((step) => step.complete).length}/6</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {steps.map((step, index) => (
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
                  <Button type="button" variant={step.id === "execute-move" ? "primary" : "secondary"} disabled={step.disabled} onClick={step.action}>
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
              <div className="flex items-center gap-2">
                <Wallet className="size-4 text-[var(--text-muted)]" />
                <p className="text-sm font-black text-[var(--text)]">Launch settings</p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs text-[var(--text-muted)]">
                  Default amount
                  <input
                    value={amount}
                    onChange={(event) => launchSettings.setAmount(event.target.value)}
                    className="mt-2 w-full bg-transparent text-lg font-black text-[var(--text)] outline-none"
                  />
                </label>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                  <p className="text-xs text-[var(--text-muted)]">Selected lane</p>
                  <p className="mt-2 text-lg font-black text-[var(--text)]">
                    {selectedCrop?.crop ?? "Rice"} · {selectedCrop?.asset ?? "USDC"}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                {[
                  { id: "steady" as const, label: "Safe lane", note: "Lower risk, stable crop" },
                  { id: "growth" as const, label: "Growth lane", note: "Balanced yield path" },
                  { id: "boost" as const, label: "Dynamic lane", note: "Higher-risk rebalance path" },
                ].map((lane) => (
                  <button
                    key={lane.id}
                    type="button"
                    onClick={() => {
                      launchSettings.setLane(lane.id);
                      launchSettings.setRisk(getCropRisk(lane.id));
                    }}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      activeCrop === lane.id
                        ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                        : "border-[var(--border)] bg-[var(--surface-soft)]"
                    }`}
                  >
                    <p className="text-sm font-black text-[var(--text)]">{lane.label}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{lane.note}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                {[
                  { id: "wallet" as const, label: "Wallet execution", note: "You approve and send each Agni move yourself." },
                  { id: "managed" as const, label: "Managed autopilot", note: "Only works when the connected wallet is the managed executor wallet." },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => launchSettings.setExecutionAuthority(option.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      executionAuthority === option.id
                        ? "border-[var(--primary-border)] bg-[var(--primary-soft)]"
                        : "border-[var(--border)] bg-[var(--surface-soft)]"
                    }`}
                  >
                    <p className="text-sm font-black text-[var(--text)]">{option.label}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{option.note}</p>
                  </button>
                ))}
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs text-[var(--text-muted)]">
                <p className="font-black text-[var(--text)]">Policy target</p>
                <p className="mt-1 break-all">AutopilotPolicy: {process.env.NEXT_PUBLIC_AUTOPILOT_POLICY_ADDRESS ?? "from deployment config"}</p>
                <p className="mt-1">
                  Executor mode: {executionAuthority === "managed" ? "Managed autopilot" : "Wallet execution"}
                </p>
                {managedModeMismatch ? (
                  <p className="mt-2 text-[var(--danger,#b42318)]">
                    Managed mode only works when the connected wallet matches the configured executor wallet.
                  </p>
                ) : null}
                {autopilotPolicy.data?.hash ? <p className="mt-2 break-all">Last policy tx: {autopilotPolicy.data.hash}</p> : null}
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-xs text-[var(--text-muted)]">
                <p className="font-black text-[var(--text)]">Ready check</p>
                <p className="mt-1">
                  {readiness.data
                    ? `${executionAuthority === "managed" ? "Managed" : "Wallet"} mode: ${modeReadiness?.status ?? "blocked"}`
                    : readiness.isLoading
                      ? "Checking relayer, on-chain writer, and policy caller..."
                      : "Readiness not loaded yet."}
                </p>
                <p className="mt-1">{modeReadiness?.note ?? readiness.error?.message ?? "Preview can load before live execution is fully ready."}</p>
                {readiness.data?.relayer.signerAddress ? <p className="mt-2 break-all">Relayer signer: {readiness.data.relayer.signerAddress}</p> : null}
                {readiness.data?.relayer.executorAddress ? <p className="mt-1 break-all">Managed executor: {readiness.data.relayer.executorAddress}</p> : null}
                {readinessNotes.length ? (
                  <div className="mt-2 space-y-1">
                    {readinessNotes.slice(0, 3).map((note) => (
                      <p key={note}>- {note}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="button" variant={view === "canvas" ? "primary" : "secondary"} onClick={() => setView("canvas")}>
            Garden
          </Button>
          <Button type="button" variant={view === "audit" ? "primary" : "secondary"} onClick={() => setView("audit")}>
            Proof
          </Button>
          <Button type="button" variant="secondary" onClick={() => void handlePreviewPlan()} disabled={!flowState.hasPolicy || autopilot.isPending || agniExecution.isPending || managedAgniExecution.isPending || autopilotPolicy.isPending}>
            <ShieldCheck className="size-4" />
            Preview plan
          </Button>
          <Button type="button" variant="primary" onClick={() => void handleExecuteMove()} disabled={!flowState.canExecute || autopilot.isPending || agniExecution.isPending || managedAgniExecution.isPending || autopilotPolicy.isPending || readiness.isLoading}>
            {executionAuthority === "managed" ? "Run managed move" : preview?.execution?.mode === "blocked" ? "Approve token" : "Execute move"}
          </Button>
          {modeReadiness?.ready === false ? (
            <span className="text-xs text-[var(--danger,#b42318)]">
              Live execution blocked: {modeReadiness.note}
            </span>
          ) : null}
        </div>

        {view === "canvas" ? (
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_360px]">
            <div className="space-y-4">
              <Card className="overflow-hidden p-0">
                <div className="p-3 sm:p-4">
                  <FarmScene
                    weather={weather}
                    slots={slots}
                    agentData={data}
                    selectedSlotId={selectedId}
                    isLoading={garden.isPending || autopilot.isPending || agniExecution.isPending}
                    onSlotClick={handleSlotClick}
                    onCropPick={handleCropPick}
                  />
                </div>
              </Card>

              <Card className="border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,245,0.96))] p-4 shadow-[var(--shadow-md)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="kicker">Garden Plan</p>
                    <p className="mt-1 text-sm font-black text-[var(--text)]">Pick a lane, then ask the assistant for the preview note.</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      The page keeps lane choice simple. The full preview summary appears in the assistant chat so the main canvas stays focused on the garden.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3 lg:max-w-[520px]">
                    {CROP_OPTIONS.map((option) => (
                      <Button
                        key={option.id}
                        type="button"
                        variant={activeCrop === option.id ? "primary" : "secondary"}
                        className="justify-between"
                        onClick={() => {
                          const nextSlot = getNextEmptySlotId(slots);
                          if (!nextSlot) {
                            launchSettings.setLane(option.id);
                            launchSettings.setRisk(getCropRisk(option.id));
                            return;
                          }
                          handleCropPick(nextSlot, option.id);
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span>{option.emoji}</span>
                          {option.crop}
                        </span>
                        <span className="text-xs opacity-80">{option.apy}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              <PlantedSummary slots={slots} historyRows={history.data ?? []} onClear={handleClearSlot} />
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <p className="kicker">Assistant preview</p>
                <h3 className="mt-1 text-sm font-black text-[var(--text)]">{preview ? "Assistant summary ready" : "No route preview yet"}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {preview ? "The assistant chat shows the route summary, policy checks, and proof note. It is not treated as live garden state until execution happens." : "Preview a plan to ask the assistant what the agent sees next."}
                </p>

                <div className="mt-4 grid gap-2 text-xs text-[var(--text-muted)]">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Move kind</p>
                    <p className="mt-1">
                      {getExecutionGardenLabel(previewOperation)} / {getOperationLabel(previewOperation)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Preview state</p>
                    <p className="mt-1">{previewMode ? getPreviewStepLabel(previewMode) : "Waiting for preview"}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Amount</p>
                    <p className="mt-1">{money(amount)}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">ERC-8004 agent</p>
                    <p className="mt-1">#{preview?.decision.erc8004.agentId ?? data?.decision.erc8004.agentId ?? "pending"}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <p className="kicker">On-chain proof</p>
                <h3 className="mt-1 text-sm font-black text-[var(--text)]">Mantle record and execution note</h3>
                <div className="mt-3 space-y-3 text-xs text-[var(--text-muted)]">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Anchor</p>
                    <p className="mt-1">{preview?.anchor?.note ?? "No proof note yet."}</p>
                    {preview?.anchor?.txHash ? <p className="mt-1 break-all">{preview.anchor.txHash}</p> : null}
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Execution</p>
                    <p className="mt-1">{preview?.execution?.note ?? "No execution request yet."}</p>
                    {preview?.execution?.executionTxHash ? <p className="mt-1 break-all">{preview.execution.executionTxHash}</p> : null}
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Benchmark readiness</p>
                    <p className="mt-1">
                      {readiness.data?.benchmarking.ready
                        ? "Relayer can write DecisionLog outcomes and record AutopilotPolicy execution on-chain."
                        : readiness.data
                          ? "Execution preview is available, but on-chain benchmark writing is still incomplete."
                          : "Waiting for readiness check."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Policy result</p>
                    <p className="mt-1">{preview?.decision.policy.reason ?? "No policy result yet."}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                    <p className="font-black text-[var(--text)]">Assistant note</p>
                    <p className="mt-1">The full markdown preview lives in the assistant bubble.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <AgentHistorySection rows={history.data} isLoading={history.isLoading} />
          </div>
        )}
      </div>

      <FarmerCompanion
        weather={weather}
        agentData={data}
        pageContext={assistantContext}
        isPending={garden.isPending || autopilot.isPending || agniExecution.isPending || managedAgniExecution.isPending || autopilotPolicy.isPending}
        onOpenSettings={openSettingsDrawer}
        onSendMessage={handleFarmerMessage}
        onAction={handleFarmerAction}
      />
      </div>
    </>
  );
}
