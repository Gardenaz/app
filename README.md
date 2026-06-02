# Gardena App

Standalone App project for Gardena.

Current local path: `apps/web`

Target standalone repo: `gardena-app`

Gardena App is the user-facing web product. It lets users connect a wallet, choose DeFi crops by risk/return profile, request an agent strategy plan, view decision history, and optionally anchor decisions on-chain through Gardena Contracts.

## Project boundary

This repo owns only App concerns:

- product UI.
- wallet connection.
- crop selection UX.
- agent planning API integration.
- decision history display.
- on-chain anchor UI/trigger.

It should not own:

- agent planning internals.
- LangGraph orchestration.
- smart contract source code.
- contract deployment scripts.

Those belong to:

- `gardena-agent` / current `apps/agent`
- `gardena-contracts` / current `contracts`

## Stack

- Next.js 16
- React 19
- Tailwind v4
- RainbowKit
- wagmi
- viem
- Framer Motion
- Lucide React

## Architecture

```mermaid
flowchart TD
    User[User] --> UI[Gardena App UI]
    UI --> Wallet[RainbowKit wallet]
    UI --> Crops[Crop selection]
    Crops --> PlanAPI[/api/agent/plan]
    PlanAPI --> Agent[Gardena Agent]
    Agent --> Decision[AgentDecision]
    Decision --> History[/api/agent/history]
    Decision --> Anchor[On-chain anchor helper]
    Anchor --> Contracts[Gardena Contracts]
```

<details>
<summary>ASCII version</summary>

```text
User
  |
  v
Gardena App UI
  |-- Wallet connection
  |-- Crop selection
  |-- /api/agent/plan --> Gardena Agent
  |-- /api/agent/history
  |-- anchor helper --> Gardena Contracts
```
</details>

## Key files

- `src/app/page.tsx`: main app page.
- `src/app/layout.tsx`: root layout.
- `src/app/globals.css`: global theme/styles.
- `src/app/api/agent/plan/route.ts`: agent planning API route.
- `src/app/api/agent/history/route.ts`: agent decision history API route.
- `src/app/api/health/route.ts`: health route.
- `src/components/sections/hero-energy.tsx`: hero section.
- `src/components/sections/crop-grid.tsx`: crop cards/grid.
- `src/components/sections/agent-planner.tsx`: planner UX.
- `src/components/sections/agent-history.tsx`: decision history UX.
- `src/lib/agent/*`: agent integration, persistence, and anchor helpers.
- `src/lib/wagmi.ts`: wallet client config.

## Integration contracts

### App -> Agent

Current local integration imports `@gardena/agent` as a workspace package.

In standalone repo mode, choose one:

- package integration: install/publish `@gardena/agent`.
- service integration: call hosted Agent API.

Input payload:

```ts
type AgentIntent = {
  user: `0x${string}`;
  crop: "steady" | "growth" | "boost";
  amount: string;
  riskPreference: 1 | 2 | 3;
};
```

Expected response:

```ts
type AgentDecision = {
  intent: AgentIntent;
  plan: AgentPlan;
  policy: PolicyDecision;
  decisionHash: `0x${string}`;
  summary: string;
  createdAt: string;
  deployment?: DeploymentConfig;
};
```

### App -> Contracts

App uses contract addresses from env or agent deployment config to anchor/read decision proofs.

Expected contracts:

- `AgentIdentity`
- `RiskPolicy`
- `DecisionLog`

## Environment

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_MANTLE_RPC_URL=
```

## Development

From current system root:

```bash
pnpm --filter web dev
```

From standalone repo root after split:

```bash
pnpm install
pnpm dev
```

## Build

From current system root:

```bash
pnpm --filter web build
pnpm --filter web typecheck
```

From standalone repo root after split:

```bash
pnpm build
pnpm typecheck
```

## Package scripts

```json
{
  "dev": "next dev --port 3000",
  "build": "next build --webpack",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

## Standalone split notes

When this folder becomes its own repo:

1. Move contents of `apps/web/*` to repo root.
2. Keep `src/`, `public/` if present, `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, and `components.json` at root.
3. Replace workspace-only imports with package or HTTP service integration.
4. Keep this README as App-only docs.
5. Do not include Agent or Contracts implementation files in this repo.
