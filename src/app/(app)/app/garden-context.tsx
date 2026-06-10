"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  INITIAL_SLOTS,
  type PotSlot,
  type WeatherMood,
} from "@/components/sections/farm-scene";
import type { FarmerCompanionContext } from "@/components/base/farmer-companion";
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
import type { AgentDecision, AgentHistoryRow, RiskLevel } from "@/lib/agent/types";
import { buildAutopilotPolicy } from "@/lib/agent/autopilot";
import { buildAssistantSummary } from "@/lib/agent/assistant-summary";
import {
  APP_ONBOARDING_STEPS,
  buildAssistantContext,
  marketEmoji,
  marketLabel,
  toWeatherMood,
} from "@/lib/launch/app-page";
import { shouldShowWelcomeModal, type LaunchSettingsDraft } from "@/lib/launch/settings-state";
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
  type CropOptionId,
  type ExecutionMode,
  type ExecutionOperation,
  type FarmerAction,
  type FlowState,
} from "@/lib/launch/launch-actions";
import type { QuestStep } from "@/components/gamification/quest-board";
import type { GardenAgentResult } from "@/hooks/use-garden-agent";

function money(v?: string | null) {
  const n = Number(v ?? "0");
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

type AgentPlanData = {
  ok: boolean;
  decision: AgentDecision;
  anchor?: {
    enabled: boolean;
    txHash: `0x${string}` | null;
    note: string;
    mode?: "prepared" | "sent";
    calldata?: `0x${string}`;
  };
  execution?: {
    enabled: boolean;
    mode: ExecutionMode;
    note: string;
    operation: ExecutionOperation;
    approval?: { token: `0x${string}`; spender: `0x${string}`; amount: string; calldata: `0x${string}` };
    target?: `0x${string}`;
    calldata?: `0x${string}`;
    executionTxHash?: `0x${string}`;
  };
  outcome?: { txHash: `0x${string}` } | null;
  source?: string;
};

type ModeReadiness = { status: string; note: string; ready: boolean };
type ExStatus = "READY" | "PLANNED" | "PENDING" | "SENT" | "CONFIRMED" | "BLOCKED";

export interface GardenContextValue {
  view: "canvas" | "audit";
  setView: (v: "canvas" | "audit") => void;

  slots: PotSlot[];
  weather: WeatherMood;
  showXp: boolean;
  selectedSlotId: string | null;

  executionStatus: ExStatus;
  steps: readonly QuestStep[];
  preview: AgentPlanData | null | undefined;
  marketLabelText: string;
  marketEmojiText: string;
  previewMode: ExecutionMode | undefined;
  previewOperation: ExecutionOperation | null;
  modeReadiness: ModeReadiness | undefined;
  managedModeMismatch: boolean;
  depositReady: boolean;
  hasPolicyReady: boolean;
  onchainPolicyReady: boolean;
  flowState: FlowState;
  previewAssistantSummary: string | null;

  data: GardenAgentResult | undefined | null;
  historyData: AgentHistoryRow[] | undefined;
  historyLoading: boolean;
  isPending: boolean;
  readiness: ReturnType<typeof useAgentReadiness>;

  address: string | null | undefined;
  authenticated: boolean;

  launchSettings: ReturnType<typeof useLaunchSettings>;
  activeCrop: CropOptionId;
  amount: string;
  risk: RiskLevel;
  executionAuthority: "wallet" | "managed";
  selectedCrop: ReturnType<typeof getCropOption>;

  settingsDrawerOpen: boolean;
  settingsDraft: LaunchSettingsDraft;
  setSettingsDraft: (d: LaunchSettingsDraft) => void;
  openSettingsDrawer: () => void;
  closeSettingsDrawer: () => void;
  handleSettingsSave: () => Promise<void>;
  handleSettingsReset: () => void;
  saveDisabled: boolean;

  shouldOpenWelcome: boolean;
  setWelcomeDismissed: (v: boolean) => void;

  assistantContext: FarmerCompanionContext;
  readinessLabel: string;
  readinessNotes: string[];

  handleCropPick: (slotId: string, cropId: CropOptionId) => void;
  handleClearSlot: (slotId: string) => void;
  handleSlotClick: (slot: PotSlot) => void;
  handleConnectWallet: () => void;
  handleDepositToGarden: () => void;
  handlePolicyReady: () => Promise<void>;
  handlePreviewPlan: () => Promise<void>;
  handleExecuteMove: () => Promise<void>;
  handleFarmerAction: (action: FarmerAction, prompt?: string) => Promise<string | null | undefined>;
  handleFarmerMessage: (msg: string) => void;
}

const GardenContext = createContext<GardenContextValue | null>(null);

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext);
  if (!ctx) throw new Error("useGarden must be used within GardenProvider");
  return ctx;
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<"canvas" | "audit">("canvas");
  const [mode, setMode] = useState<"guided" | "autopilot">("guided");
  const [message, setMessage] = useState(
    "Help me choose the safest Agni-first crop and explain the next move in plain language.",
  );
  const [manualAddr] = useState("0x1111111111111111111111111111111111111111");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slots, setSlots] = useState<PotSlot[]>(INITIAL_SLOTS);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

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
    if (!shouldShowWelcome) setWelcomeDismissed(false);
  }, [shouldShowWelcome]);
  const shouldOpenWelcome = shouldShowWelcome && !welcomeDismissed;

  const [settingsDraft, setSettingsDraft] = useState(launchSettings.draft);
  const launchDraftRef = useRef(launchSettings.draft);
  const settingsBaselineRef = useRef(launchSettings.draft);

  useEffect(() => {
    launchDraftRef.current = launchSettings.draft;
  }, [launchSettings.draft]);

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === "#launch-settings") {
        const snap = launchDraftRef.current;
        settingsBaselineRef.current = snap;
        setSettingsDraft(snap);
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
    const snap = launchDraftRef.current;
    settingsBaselineRef.current = snap;
    setSettingsDraft(snap);
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
        selectedProtocols: [
          activeCrop === "boost"
            ? "0x71959543c31EC4d68D9D6C492Bf69A1C174bb394"
            : "0xe38cfa32cCd918d94E2e20230dFaD1A4Fd8aEF16",
        ],
      }),
    [activeCrop, amount, backendExecutorAddress, data?.intent.parsedStrategy, executionAuthority, risk, userAddress],
  );

  const managedModeMismatch =
    executionAuthority === "managed" &&
    Boolean(backendExecutorAddress) &&
    userAddress.toLowerCase() !== (backendExecutorAddress ?? "").toLowerCase();

  const preview = autopilot.data as AgentPlanData | null | undefined;
  const hasPolicyReady = launchSettings.draft.policyConfirmed || onchainPolicyReady;
  const previewMode = preview?.execution?.mode;
  const previewOperation = preview?.execution?.operation ?? null;
  const previewReady = Boolean(preview);
  const previewAssistantSummary = preview
    ? buildAssistantSummary(
        "autopilot",
        preview.decision,
        preview.anchor?.txHash ?? preview.decision.anchorTxHash ?? null,
      )
    : null;
  const modeReadiness = readiness.data?.executionModes[executionAuthority] as ModeReadiness | undefined;
  const readinessNotes = readiness.data?.benchmarking.notes ?? [];
  const readinessLabel =
    modeReadiness?.note ?? readiness.error?.message ?? "Preview can load before live execution is fully ready.";
  const executionReady =
    (previewMode === "prepared" || previewMode === "sent") && (modeReadiness?.ready ?? false);

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

  const executionStatus = useMemo<ExStatus>(() => {
    if (
      garden.isPending ||
      autopilot.isPending ||
      agniExecution.isPending ||
      autopilotPolicy.isPending ||
      managedAgniExecution.isPending ||
      readiness.isLoading
    )
      return "PENDING";
    if (!preview) return "READY";
    if (
      preview.execution?.mode === "blocked" ||
      preview.decision.policy?.allow === false ||
      modeReadiness?.ready === false
    )
      return "BLOCKED";
    if (preview.execution?.mode === "sent") return "SENT";
    if (preview.anchor?.mode === "sent" || preview.decision.anchorTxHash) return "CONFIRMED";
    return "PLANNED";
  }, [
    agniExecution.isPending,
    autopilot.isPending,
    autopilotPolicy.isPending,
    garden.isPending,
    managedAgniExecution.isPending,
    modeReadiness?.ready,
    preview,
    readiness.isLoading,
  ]);

  const fearGreedReading = fearGreed.data ?? null;
  const weather: WeatherMood = fearGreedReading
    ? fearGreedToWeather(fearGreedReading.score)
    : toWeatherMood(data?.marketMood.mood);
  const marketLabelText = fearGreedReading ? fearGreedToLabel(fearGreedReading) : marketLabel(weather);
  const marketEmojiText = marketEmoji(weather);
  const selectedCrop = getCropOption(activeCrop);

  const assistantContext: FarmerCompanionContext = useMemo(
    () =>
      buildAssistantContext({
        mode,
        view,
        weather,
        marketLabel: marketLabelText,
        weatherReason: `${fearGreedReading ? fearGreedToReason(fearGreedReading) : ""} ${data?.marketMood.reason ?? "The garden is waiting for your Agni-first choices."}`.trim(),
        gUsdBalance: money(amount),
        plantedCount: slots.filter((s) => s.state !== "empty").length,
        historyRows: history.data ?? [],
        onchainPositions: [],
        data,
        latestDecision:
          previewAssistantSummary ?? data?.decision.summary ?? data?.beginnerExplanation ?? null,
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

  const handleCropPick = useCallback(
    (slotId: string, cropId: CropOptionId) => {
      const option = getCropOption(cropId);
      if (!option) return;
      const nextRisk = getCropRisk(cropId);
      launchSettings.setLane(cropId);
      launchSettings.setRisk(nextRisk);
      setSlots((prev) =>
        prev.map((slot) => (slot.id === slotId ? buildPlantedSlot(slot, cropId) : slot)),
      );
      setSelectedId(null);
      setShowXp(true);
      setTimeout(() => setShowXp(false), 1500);
      setTimeout(() => {
        setSlots((prev) =>
          prev.map((slot) => (slot.id === slotId ? { ...slot, state: "growing" } : slot)),
        );
      }, 900);
      const intent = `plant ${option.crop} with ${option.asset} using ${amount}`;
      setMessage(intent);
      garden.mutate({ user: userAddress, message: intent, amount, riskPreference: nextRisk, execute: false });
    },
    [amount, garden, launchSettings, userAddress],
  );

  const handleClearSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => (slot.id === slotId ? { ...INITIAL_SLOTS.find((s) => s.id === slotId)! } : slot)),
    );
  }, []);

  const handleSlotClick = useCallback((slot: PotSlot) => {
    setSelectedId((prev) => (prev === slot.id ? null : slot.id));
  }, []);

  const handleConnectWallet = useCallback(() => {
    if (!authenticated) void login();
  }, [authenticated, login]);

  const handleDepositToGarden = useCallback(() => {
    if (!address) { void login(); return; }
    setView("canvas");
    const intent = `Explain the deposit to garden step for ${amount} in beginner language.`;
    setMessage(intent);
    garden.mutate({ user: userAddress, message: intent, amount, riskPreference: risk, execute: false });
  }, [address, amount, garden, login, risk, userAddress]);

  const handlePolicyReady = useCallback(async () => {
    if (!address) { void login(); return; }
    await autopilotPolicy.mutateAsync({ policy: policyInput });
    launchSettings.setPolicyConfirmed(true);
    setMode("autopilot");
  }, [address, autopilotPolicy, launchSettings, login, policyInput]);

  const handlePreviewPlan = useCallback(async () => {
    if (!address) { void login(); return; }
    if (!hasPolicyReady) { setMode("autopilot"); return; }
    setView("canvas");
    await buildPlanRequest(false);
  }, [address, buildPlanRequest, hasPolicyReady, login]);

  const handleExecuteMove = useCallback(async () => {
    if (!address) { void login(); return; }
    if (!hasPolicyReady) { setMode("autopilot"); return; }
    if (modeReadiness?.ready === false) throw new Error(modeReadiness.note);
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
      await agniExecution.mutateAsync({ decision: response.decision, execution: response.execution });
      await buildPlanRequest(false);
      await history.refetch();
    }
  }, [
    activeCrop, address, agniExecution, amount, buildPlanRequest,
    data?.intent.parsedStrategy, executionAuthority, hasPolicyReady, history,
    login, managedAgniExecution, modeReadiness?.note, modeReadiness?.ready,
    policyInput, risk, userAddress,
  ]);

  const handleFarmerAction = useCallback(
    async (action: FarmerAction, promptText?: string) => {
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
      if (!hasPolicyReady) return "Set policy first so I can keep the Agni move inside your beginner guardrails.";
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
    },
    [activeCrop, amount, autopilot, data?.intent.parsedStrategy, garden, hasPolicyReady, message, policyInput, risk, userAddress],
  );

  const handleFarmerMessage = useCallback(
    (nextMessage: string) => {
      setMessage(nextMessage);
      garden.mutate({ user: userAddress, message: nextMessage, amount, riskPreference: risk, execute: false });
    },
    [amount, garden, risk, userAddress],
  );

  const steps = useMemo(
    () =>
      APP_ONBOARDING_STEPS.map((step) => {
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
              !flowState.hasPolicy ||
              autopilot.isPending ||
              agniExecution.isPending ||
              managedAgniExecution.isPending ||
              autopilotPolicy.isPending,
            action: () => void handlePreviewPlan(),
            cta: step.cta,
          };
        }
        return {
          ...step,
          complete: previewMode === "sent",
          disabled:
            !flowState.canExecute ||
            autopilot.isPending ||
            agniExecution.isPending ||
            managedAgniExecution.isPending ||
            autopilotPolicy.isPending ||
            readiness.isLoading,
          action: () => void handleExecuteMove(),
          cta:
            executionAuthority === "managed"
              ? "Run managed move"
              : preview?.execution?.mode === "blocked"
                ? "Approve token"
                : step.cta,
        };
      }) as readonly QuestStep[],
    [
      agniExecution.isPending, autopilot.isPending, autopilotPolicy.isPending,
      depositReady, executionAuthority, flowState, garden.isPending, hasPolicyReady,
      handleConnectWallet, handleDepositToGarden, handleExecuteMove, handlePolicyReady,
      handlePreviewPlan, launchSettings, managedAgniExecution.isPending,
      preview?.execution?.mode, previewMode, readiness.isLoading,
    ],
  );

  const isPending =
    garden.isPending ||
    autopilot.isPending ||
    agniExecution.isPending ||
    managedAgniExecution.isPending ||
    autopilotPolicy.isPending;

  const saveDisabled = autopilotPolicy.isPending || readiness.isLoading || !settingsDraft.defaultAmount.trim();

  const value: GardenContextValue = {
    view, setView,
    slots, weather, showXp, selectedSlotId: selectedId,
    executionStatus, steps, preview, marketLabelText, marketEmojiText,
    previewMode, previewOperation, modeReadiness, managedModeMismatch,
    depositReady, hasPolicyReady, onchainPolicyReady, flowState, previewAssistantSummary,
    data, historyData: history.data, historyLoading: history.isLoading,
    isPending, readiness,
    address, authenticated,
    launchSettings, activeCrop, amount, risk, executionAuthority, selectedCrop,
    settingsDrawerOpen, settingsDraft, setSettingsDraft, saveDisabled,
    openSettingsDrawer, closeSettingsDrawer, handleSettingsSave, handleSettingsReset,
    shouldOpenWelcome, setWelcomeDismissed,
    assistantContext, readinessLabel, readinessNotes,
    handleCropPick, handleClearSlot, handleSlotClick,
    handleConnectWallet, handleDepositToGarden,
    handlePolicyReady, handlePreviewPlan, handleExecuteMove,
    handleFarmerAction, handleFarmerMessage,
  };

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>;
}
