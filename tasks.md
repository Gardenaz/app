# Gardenaz — Island UI Tasks

## Phase 1: Design System ✅
- [x] Add Ghibli island CSS tokens to `globals.css` (`:root` section)
- [x] Add Nunito font import to `globals.css`
- [x] Add `.btn-wood`, `.panel-parchment`, `.bubble-speech`, `.crop-meter` utility classes
- [x] Add island keyframes: `ocean-swell`, `windmill-spin`, `crop-sway`, `particle-float`, `harvest-pop`, `xp-rise`, `island-entrance`, `water-ripple`, `bird-fly`

## Phase 2: Island Components ✅
- [x] `src/components/island/ocean-layer.tsx` — animated ocean with foam, ripples, shimmer
- [x] `src/components/island/decorations.tsx` — Farmhouse, Windmill, Dock, Bridge, PineTree, FlowerCluster, Rocks, FenceRow
- [x] `src/components/island/particle-system.tsx` — floating pollen particle system
- [x] `src/components/island/birds.tsx` — occasional bird flocks with random spawning
- [x] `src/components/island/harvest-burst.tsx` — harvest reward particle explosion + +XP label
- [x] `src/components/island/island-zones.tsx` — 3 interactive crop zones with growth stages + picker overlay
- [x] `src/components/island/island-canvas.tsx` — main scene assembling all 9 layers

## Phase 3: Gamification Components ✅
- [x] `src/components/gamification/wooden-button.tsx` — wood-textured button (3 variants)
- [x] `src/components/gamification/parchment-panel.tsx` — parchment card + ParchmentInset
- [x] `src/components/gamification/speech-bubble.tsx` — speech bubble tooltip + FloatingNotification
- [x] `src/components/gamification/island-hud.tsx` — top bar: weather, XP bar, coins, status
- [x] `src/components/gamification/quest-board.tsx` — 4-step flow as wooden quest board
- [x] `src/components/gamification/signpost-nav.tsx` — wooden signpost Garden/Proof toggle
- [x] `src/components/gamification/crop-zone-card.tsx` — slot card with growth meter
- [x] `src/components/gamification/xp-float.tsx` — floating +XP animation

## Phase 4: Dashboard Rewrite ✅
- [x] Rewrite `src/app/(app)/app/page.tsx` with island layout
- [x] Replace step cards → QuestBoard
- [x] Replace FarmScene → IslandCanvas
- [x] Replace navigation buttons → SignpostNav
- [x] Replace standard cards → ParchmentPanel
- [x] Replace buttons → WoodenButton
- [x] Add IslandHud at top of page
- [x] Add XpFloat triggered on crop plant
- [x] Preserve all hooks, blockchain logic, and agent integration

## Phase 5: Documentation ✅
- [x] `app/CLAUDE.md` — project conventions for future Claude sessions
- [x] `app/architecture.md` — island UI architecture reference
- [x] `app/tasks.md` — this file

---

## Backlog / Future Enhancements

### Visual Polish
- [ ] Add `HarvestBurst` component activation when zone `state === "ready"` and user clicks
- [ ] Add night/starfield layer for `stormy` weather
- [ ] Animate Windmill speed proportional to current best APY
- [ ] Add water lily / lily pad decorations to rice zone
- [ ] Add corn stalk row visual inside corn zone

### Gamification
- [ ] Persistent XP counter stored in localStorage
- [ ] Achievement popup (reached 100 XP → unlock badge)
- [ ] Leaderboard wooden noticeboard overlay
- [ ] Farm level (Level 1→5 based on total positions managed)

### UX
- [ ] Onboarding tour — speech bubbles guiding first-time users
- [ ] Animated tutorial arrow pointing to empty zones
- [ ] Mobile layout — stack island + panels vertically below 768px
- [ ] Keyboard navigation within quest board

### Technical
- [ ] Extract Framer Motion spring presets to `src/lib/motion.ts`
- [ ] Add Storybook stories for island/ and gamification/ components
- [ ] Add visual regression tests (Playwright screenshots)
- [ ] Lazy-load BirdLayer (only import when `view === "canvas"`)
