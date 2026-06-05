"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "gardenaz.active-privy-wallet";

function readStoredAddress() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function writeStoredAddress(address: string | null) {
  if (typeof window === "undefined") return;
  if (address) {
    window.localStorage.setItem(STORAGE_KEY, address);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event("gardenaz:privy-wallet-change"));
}

export function usePrivyActiveWalletAddress() {
  const [activeWalletAddress, setActiveWalletAddressState] = useState<string | null>(() => readStoredAddress());

  useEffect(() => {
    function syncFromStorage() {
      setActiveWalletAddressState(readStoredAddress());
    }

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("gardenaz:privy-wallet-change", syncFromStorage as EventListener);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("gardenaz:privy-wallet-change", syncFromStorage as EventListener);
    };
  }, []);

  const setActiveWalletAddress = useMemo(
    () => (address: string | null) => {
      setActiveWalletAddressState(address);
      writeStoredAddress(address);
    },
    [],
  );

  return {
    activeWalletAddress,
    setActiveWalletAddress,
  };
}
