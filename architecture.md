# Gardenaz — Island UI Architecture

## Overview

The dashboard (`/app`) renders a **layered island scene** viewed from a gentle top-down perspective. All DeFi logic (hooks, agent calls, blockchain) is preserved; only the presentation layer was replaced with gamified island components.

---

## Layer Model — IslandCanvas

```
┌──────────────────────────────────────────────────────────┐
│  Layer 9 — IslandHud (fixed top bar overlay)             │
├──────────────────────────────────────────────────────────┤
│  Layer 8 — CloudLayer (slow-moving SVG clouds)           │
│  Layer 7 — BirdLayer (AnimatePresence, random spawns)    │
│  Layer 6 — ParticleSystem (floating pollen dots)         │
├──────────────────────────────────────────────────────────┤
│  Layer 5 — FarmZones (3 interactive crop zones)          │
├──────────────────────────────────────────────────────────┤
│  Layer 4 — SVG Decorations                               │
│             Farmhouse (center), Windmill (left of rice)  │
│             Dock (right edge), Bridges, Fence rows       │
│             Pine trees, Flower clusters, Rocks           │
├──────────────────────────────────────────────────────────┤
│  Layer 3 — SVG Paths (curved dirt paths, bridges)        │
│  Layer 2 — Island Base (ellipse clip-path, grass)        │
│  Layer 1 — Island Earth (soil tones, bottom)             │
│  Layer 0 — OceanLayer (animated water, ripples, foam)    │
└──────────────────────────────────────────────────────────┘
```

All layers are absolutely positioned within a `relative` container. The island base uses CSS `clip-path: ellipse()` to create the organic island shape.

---

## Component Tree

```
Page (page.tsx)
├── IslandHud                          ← XP bar, coins, weather badge
├── IslandCanvas                       ← Main interactive scene
│   ├── OceanLayer                     ← Animated ocean (CSS + Framer)
│   ├── Island base div (clip-path)    ← Grass-colored ellipse
│   ├── SVG layer                      ← Paths, bridges, all decorations
│   │   ├── Farmhouse
│   │   ├── Windmill (spinning blades)
│   │   ├── Dock + Boat
│   │   ├── Bridge
│   │   ├── PineTrees (swaying)
│   │   ├── FlowerClusters
│   │   └── Rocks, FenceRows
│   ├── CloudLayer (×4 clouds)
│   ├── Sun / RainLayer (weather-based)
│   ├── ParticleSystem
│   ├── BirdLayer (random spawns)
│   ├── FarmZones                      ← 3 interactive zones
│   │   ├── Rice Zone (center-left)
│   │   ├── Corn Zone (top-center-right)
│   │   └── Chili Zone (bottom-right)
│   ├── Market badge overlay
│   ├── Agent explanation banner
│   └── Loading overlay
├── SignpostNav                         ← Garden / Proof tab toggle
├── [view === "canvas"]
│   ├── ParchmentPanel: Crop Lane
│   │   └── WoodenButton × 3 (crop options)
│   ├── ParchmentPanel: Farm Slots
│   │   ├── CropZoneCard × 3
│   │   └── PlantedSummary
│   └── XpFloat (triggered on crop plant)
├── [view === "audit"]
│   └── AgentHistorySection
├── Right sidebar
│   ├── QuestBoard (4 quest steps)
│   ├── ParchmentPanel: Farm Policy
│   │   ├── Amount input
│   │   ├── Lane selector (3 buttons)
│   │   ├── Execution authority (2 buttons)
│   │   └── Policy contract info
│   ├── ParchmentPanel: Live Preview
│   ├── ParchmentPanel: Proof Trail
│   └── Quick action WoodenButtons
└── FarmerCompanion (floating AI chat)
```

---

## Farm Zones Layout

Zones are absolutely positioned within IslandCanvas as percentages:

| Zone         | CropId    | Position          | Size      |
|--------------|-----------|-------------------|-----------|
| Rice Paddy   | `steady`  | left:8%, top:38%  | 130×110px |
| Corn Farm    | `growth`  | left:38%, top:20% | 140×115px |
| Chili Garden | `boost`   | left:65%, top:44% | 128×100px |

Each zone renders:
1. Background (soil → crop color gradient based on state)
2. `GrowthVisual` — state-dependent: `+` pulse / 🌱 / swaying crop / ready glow
3. APY chip (when planted)
4. Zone label tag above
5. "Ready to harvest" badge below
6. `ZoneCropPicker` overlay (when empty + selected)

---

## Gamification → DeFi Mapping

| Game Element       | DeFi Concept               | Code Location              |
|--------------------|---------------------------|----------------------------|
| Island HUD XP bar  | Flow progress (0–4 steps) | `flowState.hasConnectedWallet` etc |
| Coins display      | Amount in gUSD             | `amount` state             |
| Quest board steps  | 4-step DeFi flow           | `questSteps` array in page |
| Crop growth stages | `PotSlot.state`            | `farm-scene.tsx`           |
| Harvest burst      | `state === "ready"`        | `harvest-burst.tsx`        |
| +XP float          | Crop planted               | `handleCropPick` → `setShowXp` |
| Weather            | Fear & Greed Index score   | `fearGreedToWeather()`     |
| Windmill speed     | Currently fixed 6s/rotation | Can tie to APY later      |

---

## Animation System

All animations use **Framer Motion**. Constants should be added to `src/lib/motion.ts`.

### Spring presets
```ts
const SPRING_CROP   = { type: "spring", stiffness: 280, damping: 22 }; // crop interactions
const SPRING_UI     = { type: "spring", stiffness: 340, damping: 26 }; // overlays, pickers
const SPRING_BUTTON = { type: "spring", stiffness: 400, damping: 20 }; // button feedback
```

### Keyframes (globals.css)
| Name               | Used by               |
|--------------------|-----------------------|
| `ocean-swell`      | OceanLayer            |
| `windmill-spin`    | Windmill SVG          |
| `crop-sway`        | FarmZone growth stage |
| `particle-float`   | ParticleSystem        |
| `harvest-pop`      | HarvestBurst          |
| `xp-rise`          | XpFloat               |
| `island-entrance`  | IslandCanvas mount    |
| `water-ripple`     | OceanLayer rings      |
| `bird-fly`         | BirdLayer             |

---

## Weather System

Weather is derived from the **Fear & Greed Index** (0–100 score):

| Score  | Weather | Ocean tone     | Sky tone    | Effect               |
|--------|---------|----------------|-------------|----------------------|
| 60–100 | sunny   | Bright blue    | Light blue  | Sun glow, no rain    |
| 40–59  | cloudy  | Mid blue-grey  | Grey-blue   | Dimmed, clouds       |
| 20–39  | rainy   | Dark teal      | Dark grey   | Rain layer active    |
| 0–19   | stormy  | Near-black     | Very dark   | Heavy rain + filter  |

Weather affects: sky gradient, cloud opacity/color, sun visibility, rain layer, and `ambientFilter` CSS on the canvas.

---

## Design Token Reference

See `src/app/globals.css` for full values. Key island-specific tokens:

```css
/* Typography */
--font-island-heading: 'Nunito', serif;
--font-island-body:    'Nunito', system-ui, sans-serif;

/* Island palette */
--island-ocean-deep / --island-ocean-mid / --island-ocean-foam
--island-grass / --island-grass-dark
--island-earth / --island-earth-dark
--island-wood / --island-wood-light
--island-parchment / --island-parchment-dark
--island-gold / --island-gold-dark
--island-sign-bg / --island-sign-text

/* Crop accents */
--zone-corn / --zone-rice / --zone-chili

/* Gamification */
--xp-bar / --coin-gold / --quest-complete / --harvest-burst
```

---

## Future Extension Points

1. **More farm slots** — add slots 4 and 5 to `FarmZones` positions array
2. **Windmill speed tied to APY** — pass `apy` to `Windmill` and vary `duration`
3. **Night mode** — `stormy` weather already darkens; full night palette is next
4. **Harvest animation per zone** — mount `HarvestBurst` inside `FarmZones` on `state === "ready"` click
5. **Leaderboard** — render as a wooden noticeboard overlay on the island
6. **Seasonal themes** — swap SVG decorations and palette per quarter
