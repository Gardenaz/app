export type LaunchLane = "steady" | "growth" | "boost";
export type LaunchExecutionAuthority = "wallet" | "managed";

export type LaunchSettingsDraft = {
  onboardingComplete: boolean;
  selectedLane: LaunchLane;
  defaultAmount: string;
  riskPreference: 1 | 2 | 3;
  executionAuthority: LaunchExecutionAuthority;
  managedAccountAddress: `0x${string}` | "";
  managedExecutorAddress: `0x${string}` | "";
  policyConfirmed: boolean;
  depositConfirmed: boolean;
  lastSavedAt: string | null;
};

export type LaunchSetupReadiness = {
  walletConnected: boolean;
  depositReady: boolean;
  policyReady: boolean;
};

export const LAUNCH_SETTINGS_STORAGE_KEY = "gardenaz.launch.settings";

function isHexAddress(value: unknown): value is `0x${string}` {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

function normalizeLane(value: unknown): LaunchLane {
  return value === "growth" || value === "boost" ? value : "steady";
}

function normalizeRisk(value: unknown): 1 | 2 | 3 {
  return value === 2 || value === 3 ? value : 1;
}

function normalizeAuthority(value: unknown): LaunchExecutionAuthority {
  return value === "wallet" ? "wallet" : "managed";
}

function normalizeAmount(value: unknown): string {
  if (typeof value !== "string") return "1000";
  const trimmed = value.trim();
  return trimmed ? trimmed : "1000";
}

function normalizeBoolean(value: unknown): boolean {
  return value === true;
}

function normalizeLastSavedAt(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function buildDraft(overrides: Partial<LaunchSettingsDraft> = {}): LaunchSettingsDraft {
  return {
    onboardingComplete: false,
    selectedLane: "steady",
    defaultAmount: "1000",
    riskPreference: 1,
    executionAuthority: "managed",
    managedAccountAddress: "",
    managedExecutorAddress: "",
    policyConfirmed: false,
    depositConfirmed: false,
    lastSavedAt: null,
    ...overrides,
  };
}

export function createDefaultLaunchSettings(overrides: Partial<LaunchSettingsDraft> = {}): LaunchSettingsDraft {
  return normalizeLaunchSettings(buildDraft(overrides));
}

export function normalizeLaunchSettings(input: Partial<LaunchSettingsDraft>): LaunchSettingsDraft {
  return {
    onboardingComplete: normalizeBoolean(input.onboardingComplete),
    selectedLane: normalizeLane(input.selectedLane),
    defaultAmount: normalizeAmount(input.defaultAmount),
    riskPreference: normalizeRisk(input.riskPreference),
    executionAuthority: normalizeAuthority(input.executionAuthority),
    managedAccountAddress: isHexAddress(input.managedAccountAddress) ? input.managedAccountAddress : "",
    managedExecutorAddress: isHexAddress(input.managedExecutorAddress) ? input.managedExecutorAddress : "",
    policyConfirmed: normalizeBoolean(input.policyConfirmed),
    depositConfirmed: normalizeBoolean(input.depositConfirmed),
    lastSavedAt: normalizeLastSavedAt(input.lastSavedAt),
  };
}

export function serializeLaunchSettings(draft: LaunchSettingsDraft): string {
  return JSON.stringify(normalizeLaunchSettings(draft));
}

export function parseLaunchSettings(raw: string | null): LaunchSettingsDraft {
  if (!raw) {
    return createDefaultLaunchSettings();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LaunchSettingsDraft> | null;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultLaunchSettings();
    }
    return normalizeLaunchSettings(parsed);
  } catch {
    return createDefaultLaunchSettings();
  }
}

export function shouldShowWelcomeModal(draft: LaunchSettingsDraft, readiness: LaunchSetupReadiness): boolean {
  if (!readiness.walletConnected || !readiness.depositReady || !readiness.policyReady) {
    return true;
  }

  return !draft.onboardingComplete;
}
