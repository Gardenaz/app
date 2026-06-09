import { keccak256, stringToHex, type Address } from "viem";

export const gardenRwaMockVaultAbi = [] as const;

export const gardenRwaCropKeys = ["steady", "growth", "boost"] as const;
export type GardenRwaCropKey = typeof gardenRwaCropKeys[number];

const cropKeyHashes = Object.fromEntries(
  gardenRwaCropKeys.map((key) => [key, keccak256(stringToHex(key))]),
) as Record<GardenRwaCropKey, `0x${string}`>;

export function getGardenRwaCropKey(hash: `0x${string}`): GardenRwaCropKey | null {
  const found = (Object.entries(cropKeyHashes) as Array<[GardenRwaCropKey, `0x${string}`]>)
    .find(([, value]) => value === hash);
  return found?.[0] ?? null;
}

export function getGardenRwaCropHash(cropKey: GardenRwaCropKey): `0x${string}` {
  return cropKeyHashes[cropKey];
}

// Compatibility shim while the mock vault flow is being removed from the visible app.
export function getGardenRwaVaultAddress(): Address | undefined {
  return undefined;
}

export function getGardenRwaRouteAdapterAddress(): Address | undefined {
  return undefined;
}
