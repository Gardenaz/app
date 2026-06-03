# Gardenaz App Audit

Last updated: 2026-06-03

## Scope

Repo: `/root/projects/Gardenaz/app`

Purpose: Next.js user app for Gardenaz. It should present a beginner-friendly paper/garden RPG investing experience, connect wallet with Privy, collect user intent, call the agent runtime, and show safe plan/proof/history.

## Current Status

Working:

- Paper garden console exists: `src/components/sections/garden-agent-console.tsx`.
- Garden hook exists: `src/hooks/use-garden-agent.ts`.
- Next API route can dispatch garden calls through `src/app/api/agent/plan/route.ts`.
- Normal agent planner still exists in `src/components/sections/agent-planner.tsx`.
- Focused tests pass: `pnpm test -- src/app/app/page.test.ts`.

Not production-ready:

- Full typecheck is blocked.
- Garden flow requires `AGENT_SERVICE_URL`; no local fallback.
- On-chain proof is simulated/local in several paths.
- Large parts of app still look like generic SaaS dashboard, not Paper garden game.

## Findings

### P0: Typecheck blocked

- File: `src/app/api/agent/plan/route.ts`
- Issue: `saveDecision(garden.decision)` conflicts with `anchorTxHash` type.
- Current `AgentDecision.anchorTxHash?: string` in `src/lib/agent/types.ts` is too broad for store expectation.
- Fix: standardize `anchorTxHash` as `` `0x${string}` | null `` across types and persistence.

### P0: Missing dependencies or unused shadcn files

Missing packages used by `src/components/ui/*`:

- `@radix-ui/react-checkbox`
- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-tabs`
- `@radix-ui/react-tooltip`
- `class-variance-authority`

Fix options:

1. Add deps if components are intended to stay.
2. Delete unused shadcn components and imports.

### P0: Garden runtime requires agent service

- File: `src/lib/agent/service.ts`
- `requestAgentGardenPlan()` throws if `AGENT_SERVICE_URL` is missing.
- UI shows fallback visual state, but submit fails without runtime service.

Fix:

- Add local fallback using `@gardena/agent/garden-agent` when package export/build supports it, or disable submit with clear config warning.

### P1: Garden plan not anchored like legacy flow

- File: `src/app/api/agent/plan/route.ts`
- Garden branch saves decision but does not call `maybeAnchorDecision()`.
- Legacy fallback branch simulates anchor.

Fix:

- Decide proof parity. Either garden plans get same anchor behavior or UI labels them as unanchored preview.

### P1: Simulated on-chain proof

- File: `src/lib/agent/anchor.ts`
- `maybeAnchorDecision()` creates a fake tx hash from decision hash.

Fix:

- Wire real DecisionLog ABI, signer/relayer, receipt handling, explorer links.

### P1: Validation gaps

- File: `src/components/sections/garden-agent-console.tsx`
- Manual wallet cast to `` `0x${string}` `` without runtime validation.
- No validation for amount, empty message, risk bounds.

Fix:

- Use address validation, positive decimal amount validation, and inline errors before mutation.

### P1: Error messages lose server context

- Files:
  - `src/hooks/use-garden-agent.ts`
  - `src/hooks/use-agent-plan.ts`
- Both throw generic `HTTP ${status}` before parsing JSON error body.

Fix:

- Parse error JSON first and show `json.error`.

### P1: Persistence weak

- File: `src/lib/agent/store.ts`
- Current storage: `.runtime-data/agent-decisions.json`.
- Problems: race-prone read/write, no user scoping, not serverless-safe, no schema validation.

Fix:

- Move to Supabase/KV/database with user address scoping.

### P1: UI functionality gaps

- File: `src/app/app/page.tsx`
- “Run autopilot” button has no handler.
- “AI Farmer Diary” is hardcoded and not connected to history.
- Old `GardenScene` and `FarmerAgentCompanion` helpers remain unused after Paper console.

Fix:

- Connect button to garden/agent action or remove.
- Render real `AgentHistorySection` / saved decision history.
- Delete unused helpers.

### P1: Design system inconsistent

- `DESIGN.md` says Paper, Montserrat/Roboto/PT Mono, black/white minimal surface.
- `src/app/globals.css` still uses Inter/Newsreader and teal SaaS tokens.
- Paper console is good direction, but rest of app is generic teal dashboard.

Fix:

- Consolidate tokens around Paper + green-energy accent.
- Convert planner/history/sidebar to same tactile paper style.

### P2: Docs stale

- `README.md` references RainbowKit/wagmi.
- Current wallet stack uses Privy.

Fix:

- Update README with Privy, agent service URL, garden flow, current build caveats.

## Verification Snapshot

- `pnpm test -- src/app/app/page.test.ts` passes.
- `pnpm typecheck` fails due known type/dependency issues.

## Next App Work Order

1. Fix typecheck and missing deps.
2. Add input validation and better error handling.
3. Add local garden fallback or config guard for `AGENT_SERVICE_URL`.
4. Remove unused old UI helpers.
5. Wire live history/proof status.
6. Convert full app to Paper garden design.
