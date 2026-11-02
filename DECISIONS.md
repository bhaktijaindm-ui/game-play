# Architecture & Technical Decisions (DECISIONS.md)

This document records the foundational architectural, design, performance, and monetization decisions made during the development of **Glam Blocks**.

---

## 1. Engine & Rendering Architecture

### Decision: Plain DOM/CSS Grid + Inline SVG Makeup Canvas over Heavy Game Engines
* **Context**: Block puzzle games often reach for Canvas or WebGL engines (Phaser, PixiJS, Unity WebGL).
* **Rationale**:
  - Target audience includes players on budget and entry-level Android devices (2GB RAM, Android Go).
  - Canvas/WebGL engines introduce 1.5MB–10MB in runtime overhead, draw call batching complexity, and high battery consumption.
  - Plain DOM grid with CSS hardware-accelerated transforms (`transform: translate3d`) runs at a steady 60fps with zero engine overhead.
  - The Live Makeup Canvas uses layered inline SVGs with radial/linear gradient masks for Eyes (rows 1–3), Cheeks (rows 4–6), and Lips (rows 7–8). Layered SVG enables declarative stacking, CSS opacity blend modes (`multiply`, `screen`, `overlay`), and precise vector sharpness on high-DPI displays (3x–4x retina).

---

## 2. Audio & Haptics

### Decision: Zero-Latency Synthesized Web Audio API over Audio Files
* **Context**: Pre-recorded audio files (`.mp3`, `.wav`) require network preloading, have decode latency on Android WebViews, and increase initial bundle size.
* **Rationale**:
  - Synthesized audio using Web Audio API oscillators (`sine`, `triangle`, `gainNode`, `exponentialRampToValueAtTime`) produces clean, crisp, luxury cosmetic sound effects (placement pop, line clear glassy chime, combo ascending arpeggio, client complete fanfare) with 0 bytes of external assets.
  - Audio context is initialized lazily upon the first user interaction to comply with modern browser autoplay policies.
  - Dual toggles (Sound, Music, Haptics) are independently managed and persisted in `localStorage` and `UserProfile`.

---

## 3. Fair Shape Spawning & Pure Shade Mechanics

### Decision: Dynamic Occupancy-Based Probabilities + Deterministic Daily Seeding
* **Context**: Block Blast-style puzzles can feel unfair if unwieldy 3x3 blocks spawn when the board is almost full, causing abrupt game-over states.
* **Rationale**:
  - **Spawning Algorithm**:
    - Default: Generates 3 shapes from the complete 18-shape polyomino catalogue.
    - Occupancy heuristic: When board occupancy exceeds 75% (48+ cells filled), 70% probability per slot shifts to small shapes (1–3 cells: `I1`, `I2`, `L3`, `V3`).
    - Anti-deadlock safeguard: Validates that at least one shape can fit on the current board (up to 10 regeneration attempts).
    - Pure Shade encouragement: 30% random batch chance where all 3 spawned shapes share the exact same shade.
  - **Daily Beauty Brief**:
    - Uses daily date string (e.g. `2026-11-02`) mapped via hash function into a deterministic PRNG seed (`seedrandom`).
    - All players globally encounter the exact same board challenges and sequence of shapes.

---

## 4. Monetization & Regional Pricing (India & Global)

### Decision: Tiered Regional Pricing Catalogue with Abstract Provider Pattern
* **Context**: Glam Blocks is targeted heavily at the Indian demographic (festive collections, bridal themes) alongside a global audience. Flat US dollar pricing leads to poor conversion in emerging markets.
* **Rationale**:
  - Implemented 3 regional tiers:
    - `IN` (India): Microtransactions starting at ₹19 (50 Gems), ₹79 (Glam Pass), up to ₹799 (Bridal Red Vault).
    - `TIER_1` (US, UK, EU, Canada, Australia): Standard pricing starting at $0.99.
    - `ROW` (Rest of World): Calibrated PPP pricing.
  - **Provider Architecture**:
    - `BillingProvider` interface supports `PlayBillingProvider` (for TWA / Google Play Digital Goods API) and `MockBillingProvider` (for instant local testing with simulated success/failure).
    - `AdsProvider` supports `GoogleAdMobProvider` (interstitials, rewarded ads) and `MockAdsProvider` (3-second interactive countdown modal).
    - Interstitial rules: Never shown in the first 3 games; never shown to users with "No Ads" or active "Glam Pass"; capped strictly to game over after every 3rd completed session.

---

## 5. Offline-First Progression & Cloud Synchronization

### Decision: Local-First Storage with Optimistic Firestore Sync
* **Context**: Mobile puzzle players frequently play on commutes, flights, or in areas with intermittent connectivity.
* **Rationale**:
  - The game loop, state saving, level generation, and daily brief work 100% offline via `localStorage` and PWA service worker caching (`sw.js`).
  - When network connection is established or restored (`useOnlineStatus` hook):
    - Guest profiles are preserved locally.
    - Authenticated users automatically synchronize coins, gems, level progress, unlocked collections, and portfolio looks with Firebase Firestore using merge semantics (`setDoc(..., { merge: true })`).
    - Higher score / level takes precedence to prevent data loss.

---

## 6. Inclusive Face Models & Accessibility

### Decision: Inclusive Vector Models with Dual-Coded Colorblind Visuals
* **Context**: Cosmetics are deeply personal; players must see themselves represented across diverse skin tones and facial aesthetics.
* **Rationale**:
  - 6 stylized face models spanning fair, wheatish, medium, tan, deep, and dark tones.
  - All shades are dual-coded with distinct micro-icons and SVG patterns (`lips`, `sparkle`, `heart`, `drop`, `star`, `leaf`, `diamond`).
  - Accessible high-contrast colorblind toggle increases icon scale by 125% and adds high-contrast text labels.
  - Full WCAG AA contrast compliance in both "Rose Quartz Morning" (light) and "Midnight Vanity" (dark) themes.
