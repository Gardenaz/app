"use client";

import { ChevronDown, LogOut, ShieldCheck, Wallet } from "lucide-react";
import { usePrivyWalletAddress } from "@/hooks/use-privy-wallet-address";
import { getPrivyAddressLabel, getPrivyChainLabel } from "@/lib/privy";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function initialsFromAddress(address?: string | null) {
  if (!address) return "GZ";
  return `${address.slice(2, 4)}${address.slice(-2)}`.toUpperCase();
}

export function PrivyConnectButton({ compact = false }: { compact?: boolean }) {
  const { ready, authenticated, login, logout, address, chainId, walletCount } = usePrivyWalletAddress();

  if (!authenticated) {
    return (
      <Button
        type="button"
        onClick={() => login()}
        disabled={!ready}
        className="btn-secondary disabled:pointer-events-none disabled:opacity-50"
      >
        <Wallet className="size-4 text-[var(--primary)]" />
        <span>{compact ? "Connect" : "Connect wallet"}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          disabled={!ready}
          className="gap-2 rounded-full border border-[var(--border)] bg-white px-2 py-1.5 shadow-none disabled:pointer-events-none disabled:opacity-50"
        >
          <Avatar size="sm">
            <AvatarFallback className="bg-[var(--primary-soft)] text-[10px] font-black text-[var(--text)]">
              {initialsFromAddress(address)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-semibold text-[var(--text)] sm:inline">
            {getPrivyAddressLabel(address)}
          </span>
          <ChevronDown className="size-4 text-[var(--text-muted)]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel className="px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--text-subtle)]">Wallet profile</p>
          <p className="mt-1 text-sm font-black text-[var(--text)]">{getPrivyAddressLabel(address)}</p>
          <p className="mt-1 break-all text-xs font-medium text-[var(--text-muted)]">{address}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid gap-2 px-2 py-1">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-subtle)]">Chain</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
              <ShieldCheck className="size-4 text-emerald-600" />
              {getPrivyChainLabel(chainId)}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-subtle)]">Wallets</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">{walletCount} connected source{walletCount === 1 ? "" : "s"}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()} variant="destructive">
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
