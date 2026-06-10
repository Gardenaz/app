# Gardenaz — CLAUDE.md

## Project Overview
Gardenaz is an AI-powered DeFi dashboard on Mantle/Agni Finance, styled as a cozy farming-island game (Hay Day × Animal Crossing × Studio Ghibli aesthetic). Users plant "crops" (DeFi strategies), watch them grow, and harvest yield.

## Stack
- **Framework**: Next.js 16 + React 19 (App Router, `"use client"`)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4 (CSS-first, no `tailwind.config.js`) — config lives in `src/app/globals.css`
- **Animations**: Framer Motion 11
- **Data fetching**: TanStack React Query 5
- **Wallet**: Privy (`@privy-io/react-auth`)
- **Web3**: Viem (Mantle Sepolia)
- **Icons**: Lucide React

## Scope Rule — DASHBOARD ONLY
All future UI changes affecting the gamified island aesthetic apply **only** to:
- `src/app/(app)/app/page.tsx` — main dashboard page
- `src/components/island/` — island canvas components
- `src/components/gamification/` — gamification UI primitives
- `src/app/globals.css` (island design tokens section only)

**Do not touch**: landing page, navbar, API routes, hooks, lib/, blockchain logic.

## Key File Map
```
src/
├── app/
│   ├── globals.css                      ← Design tokens + utility classes
│   └── (app)/app/page.tsx               ← Dashboard (island layout)
├── components/
│   ├── island/
│   │   ├── island-canvas.tsx            ← Main layered island scene
│   │   ├── island-zones.tsx             ← 3 interactive farm zones
│   │   ├── ocean-layer.tsx              ← Animated water background
│   │   ├── decorations.tsx              ← SVG: farmhouse, windmill, dock, trees
│   │   ├── particle-system.tsx          ← Floating pollen particles
│   │   ├── birds.tsx                    ← Occasional bird flocks
│   │   └── harvest-burst.tsx            ← Harvest reward animation
│   ├── gamification/
│   │   ├── island-hud.tsx               ← Top bar: XP, coins, weather
│   │   ├── quest-board.tsx              ← 4-step flow as wooden quest board
│   │   ├── wooden-button.tsx            ← Wood-textured button component
│   │   ├── parchment-panel.tsx          ← Parchment-styled card
│   │   ├── speech-bubble.tsx            ← Tooltip / notification bubbles
│   │   ├── signpost-nav.tsx             ← Wooden signpost tab toggle
│   │   ├── crop-zone-card.tsx           ← Slot card with growth meter
│   │   └── xp-float.tsx                ← Floating +XP animation
│   ├── sections/
│   │   └── farm-scene.tsx               ← Legacy FarmScene + PotSlot types (keep)
│   └── base/
│       └── farmer-companion.tsx         ← AI chat companion (floating)
├── hooks/                               ← All DeFi/agent hooks (do not modify)
└── lib/                                 ← Agent logic, contracts (do not modify)
```

## Design System
All island design tokens are CSS custom properties defined in `globals.css` under the `/* Island / Ghibli palette */` section.

Key tokens:
- `--island-wood`, `--island-wood-light` — wooden UI elements
- `--island-parchment`, `--island-parchment-dark` — parchment panels
- `--island-grass`, `--island-grass-dark` — crop/growth colors
- `--zone-corn`, `--zone-rice`, `--zone-chili` — per-crop accents
- `--font-island-heading` — Nunito (rounded, game-feel)
- `--font-island-body` — Nunito (body text)

Utility classes:
- `.btn-wood` — wood-textured button
- `.panel-parchment` — parchment card background
- `.bubble-speech` — speech bubble with tail
- `.crop-meter` — crop growth progress bar
- `.island-hud` — HUD bar styling

## Tailwind 4 Notes
- No `tailwind.config.js` — all custom properties use `@theme inline` or CSS variables
- PostCSS config: `postcss.config.mjs` with `@tailwindcss/postcss`
- Add new design tokens to `:root {}` in `globals.css`, not a config file

## Crop → DeFi Mapping
| Crop   | CropId    | Risk | Asset       | APY    |
|--------|-----------|------|-------------|--------|
| Rice   | `steady`  | Low  | USDC        | 4–6%   |
| Corn   | `growth`  | Med  | WMNT        | 7–11%  |
| Chili  | `boost`   | High | USDC/WMNT LP| 12–20% |

## Animation Conventions
- All animations use Framer Motion (`motion.div`, `AnimatePresence`)
- Constants/presets live in `src/lib/motion.ts`
- Island entrance: `scale 0.9→1, opacity 0→1`
- Crop interactions: spring physics (`stiffness: 280–340, damping: 22–26`)
- Windmill: continuous `rotate: 0→360` on `<motion.g>`
- Never use raw CSS `animation:` for interactive elements — use Framer Motion
