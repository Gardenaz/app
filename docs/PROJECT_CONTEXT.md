# Gardenaz App Context

Read this before modifying the app.

## Product Role

The app is the player-facing Gardenaz experience. It should hide DeFi complexity behind a clean paper garden/RPG UI where the user asks a farmer agent to plant safe/growth/boost crops.

## Current Direction

- Design: Paper (`DESIGN.md`), white/cream surfaces, black outline, green energy accent.
- Avoid generic SaaS dashboard look.
- Garden console should be main UX, not side decoration.
- Privy wallet is current wallet stack.

## Key Files

- `src/app/app/page.tsx` — launch app page.
- `src/components/sections/garden-agent-console.tsx` — current primary Paper garden UI.
- `src/hooks/use-garden-agent.ts` — garden mutation hook.
- `src/app/api/agent/plan/route.ts` — Next API route; dispatches garden and autopilot plan requests.
- `src/lib/agent/service.ts` — talks to external agent service via `AGENT_SERVICE_URL`.
- `src/lib/agent/types.ts` — shared client decision types.
- `src/lib/agent/store.ts` — local runtime decision persistence.
- `DESIGN.md` — TypeUI Paper design reference.
- `docs/AUDIT.md` — latest app audit.

## Current Runtime Flow

```text
GardenAgentConsole -> useGardenAgent -> POST /api/agent/plan garden=true -> requestAgentGardenPlan -> AGENT_SERVICE_URL/garden/plan
```

## Known Gaps

- Full typecheck blocked by type mismatch and missing UI deps.
- Garden flow fails if `AGENT_SERVICE_URL` missing.
- Proof anchoring is simulated/incomplete.
- Decision persistence is local JSON.
- Some old UI helpers remain unused in `page.tsx`.
- Rest of app needs Paper design migration.

## Do Next

1. Fix typecheck.
2. Add validation/error handling.
3. Add config guard or local fallback for garden agent.
4. Replace hardcoded diary with live history.
5. Continue Paper design conversion.
