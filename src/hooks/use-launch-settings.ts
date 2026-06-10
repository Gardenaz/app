"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createDefaultLaunchSettings,
  LAUNCH_SETTINGS_STORAGE_KEY,
  parseLaunchSettings,
  serializeLaunchSettings,
  shouldShowWelcomeModal,
  type LaunchExecutionAuthority,
  type LaunchExperienceLevel,
  type LaunchLane,
  type LaunchSettingsDraft,
  type LaunchSetupReadiness,
} from "@/lib/launch/settings-state";

function readEnvAddress(value: string | undefined) {
  return value && /^0x[a-fA-F0-9]{40}$/.test(value) ? (value as `0x${string}`) : "";
}

function createInitialDraft(): LaunchSettingsDraft {
  return createDefaultLaunchSettings({
    managedAccountAddress: readEnvAddress(process.env.NEXT_PUBLIC_GARDEN_MANAGED_ACCOUNT_ADDRESS),
    managedExecutorAddress: readEnvAddress(process.env.NEXT_PUBLIC_AUTOPILOT_EXECUTOR_ADDRESS),
  });
}

export function useLaunchSettings(readiness: LaunchSetupReadiness) {
  const [draft, setDraft] = useState<LaunchSettingsDraft>(() => createInitialDraft());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const parsed = parseLaunchSettings(window.localStorage.getItem(LAUNCH_SETTINGS_STORAGE_KEY));
      setDraft((current) =>
        createDefaultLaunchSettings({
          ...current,
          ...parsed,
          managedAccountAddress: parsed.managedAccountAddress || current.managedAccountAddress,
          managedExecutorAddress: parsed.managedExecutorAddress || current.managedExecutorAddress,
        }),
      );
    } catch {
      // Ignore storage failures and keep the defaults.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(LAUNCH_SETTINGS_STORAGE_KEY, serializeLaunchSettings(draft));
    } catch {
      // Ignore storage failures and keep the flow moving.
    }
  }, [draft, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (!readiness.walletConnected || !readiness.depositReady || !readiness.policyReady) return;
    if (draft.onboardingComplete) return;

    setDraft((current) =>
      createDefaultLaunchSettings({
        ...current,
        onboardingComplete: true,
        lastSavedAt: new Date().toISOString(),
      }),
    );
  }, [draft.onboardingComplete, hydrated, readiness.depositReady, readiness.policyReady, readiness.walletConnected]);

  const updateDraft = useCallback((patch: Partial<LaunchSettingsDraft>) => {
    setDraft((current) =>
      createDefaultLaunchSettings({
        ...current,
        ...patch,
        lastSavedAt: new Date().toISOString(),
      }),
    );
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(createInitialDraft());
  }, []);

  const saveDraft = useCallback(() => {
    setDraft((current) =>
      createDefaultLaunchSettings({
        ...current,
        lastSavedAt: new Date().toISOString(),
      }),
    );
  }, []);

  const markWelcomeComplete = useCallback(() => {
    setDraft((current) =>
      createDefaultLaunchSettings({
        ...current,
        welcomeComplete: true,
        lastSavedAt: new Date().toISOString(),
      }),
    );
  }, []);

  const markOnboardingComplete = useCallback(() => {
    if (!readiness.walletConnected || !readiness.depositReady || !readiness.policyReady) {
      return;
    }

    setDraft((current) =>
      createDefaultLaunchSettings({
        ...current,
        onboardingComplete: true,
        lastSavedAt: new Date().toISOString(),
      }),
    );
  }, [readiness.depositReady, readiness.policyReady, readiness.walletConnected]);

  const showWelcomeModal = useMemo(() => shouldShowWelcomeModal(draft, readiness), [draft, readiness]);

  return {
    draft,
    hydrated,
    showWelcomeModal,
    updateDraft,
    resetDraft,
    saveDraft,
    markOnboardingComplete,
    markWelcomeComplete,
    setLane: (lane: LaunchLane) => updateDraft({ selectedLane: lane }),
    setAmount: (amount: string) => updateDraft({ defaultAmount: amount }),
    setRisk: (riskPreference: LaunchSettingsDraft["riskPreference"]) => updateDraft({ riskPreference }),
    setExperienceLevel: (experienceLevel: LaunchExperienceLevel) => updateDraft({ experienceLevel }),
    setExecutionAuthority: (executionAuthority: LaunchExecutionAuthority) => updateDraft({ executionAuthority }),
    setPolicyConfirmed: (policyConfirmed: boolean) => updateDraft({ policyConfirmed }),
    setDepositConfirmed: (depositConfirmed: boolean) => updateDraft({ depositConfirmed }),
  };
}
