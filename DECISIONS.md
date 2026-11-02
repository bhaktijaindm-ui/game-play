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

---

## 7. Mobile UX Audit, QA & Performance Decisions

### Decision: Localized Board Touch-Action & FaceModel Memoization
* **Context**: Low-end phones previously experienced frame drops during block dragging when pointermove triggered full React tree evaluation. In addition, viewport-wide `user-scalable=no` blocked legitimate pinch-zoom on legal and settings screens.
* **Rationale**:
  - `user-scalable=no` was removed from the global viewport tag in `index.html`. Pinch-zoom is now permitted on all non-game screens for accessibility and reading comfort.
  - `touch-action: none` is strictly bound to the 8x8 `GameBoard` container, guaranteeing that dragging blocks never scrolls or shifts the page viewport.
  - `FaceModel` is memoized via `React.memo` to isolate the 790-line vector SVG from pointer drag coordinate updates, securing a continuous 60fps drag experience.
  - `onShapeDrag` streams touch coordinates lifted 60px above the finger to display a real-time green/red ghost preview on the board.
  - Tray Fairness Guarantee: If 10 random procedural attempts yield no placeable shape on a board with < 64 filled cells, the spawning engine actively selects and places a guaranteed fitting small shape (`I1` 1x1 dot fallback) to eliminate premature unfair game-overs.

---

## 8. Story & Character Architecture ("The Gulab Mahal Salon")

### Decision: Narrative-Driven Salon Restoration Meta-Game with 100% Original IP
* **Context**: Transition to "Glam Blocks: The Gulab Mahal Salon" incorporating a rich story-meta game, daily tasks, adventure map, and salon restoration.
* **Decisions**:
  - **Original Wholesome Narrative**: Set in Rangpur. Follows Anaya Sharma (26), Zoya (nail artist), Kabir (handyman), Tara-ji (mentor), Kajal (cat), Rhea Mehra (rival-to-partner), and 12 distinct recurring comic customers. 100% original names, characters, dialogue, and lore. Zero competitor IP references. Wholesome content strictly rated 13+ (no violence, cheating, or mature themes).
  - **Structure**: 4 Chapters, 12 scenes each (48 scenes total). Every dialogue card is strictly capped at <= 3 lines, fast-paced, and skippable.
  - **Meta Progression**: Unlocks 7 salon rooms (Reception, Makeup Studio, Nail Bar, Hair Lounge, Spa, Rooftop Cafe, Bridal Suite) and 7 secret signature looks from Nani's "Rang Book" (Gulab Dawn, Rangpur Radiance, Mehendi Glow, Sangeet Sparkle, Holi Bloom, Diwali Gold, Royal Gulab Bride).
  - **Data Representation**: Typed models in `src/game/story.ts` paired with `STORY.md` human-readable story bible. Fully verified with Vitest unit tests in `tests/unit/story.test.ts`.

---

## 9. Design System ("Glam Day" & "Glam Night")

### Decision: Casual Story-Game Glossy Visual Language with Strict Tokens
* **Context**: The game requires a rich, cartoon-illustrated casual meta-game aesthetic (thick colored outlines, inner highlights, soft drop shadows, chunky rounded panels).
* **Decisions**:
  - **Light Theme "Glam Day" (Default)**: Splash purple `#A774F0`, deep purple `#6A3FC8`, header purple `#5B2E9E`, board frame `#6FADD4`, checker A `#96BAEB`, checker B `#A9C6F2`, dark bar `rgba(25,18,40,0.72)`, blush pink `#FF8FB8`, hot pink `#E6177F`, rose gold `#D9A28E`, cream `#FFF4E4`, soft cream panel `#F8E7C9`, gold `#F5B53C`, ruby-pink `#FF4F7B`, success green `#3FBF4F`, energy blue `#3DA9FC`, text dark `#2A1630`.
  - **Dark Theme "Glam Night"**: Background `#140E26`, panel `#231A45`, frame `#3D5E86`, checker A `#2C3A66`, checker B `#35467A`, text `#F8EBFA`.
  - **Typography & Numbers**: `Fredoka` for game titles, numbers, and 3D buttons (with dark stroke `.game-stroke`); `Poppins` for body and UI descriptions.
  - **Currencies**: Sparkle Energy (blue lightning-lipstick, 12m regen, max 30), Coins (gold compact mirror), Gems (pink diamond).
  - **Standard Reusable Components**: `TopBarCounter`, `AvatarWithLevelBadge`, `EventIconWithTimer`, `OrnateModal`, `ProgressTrack`, `RewardChip`, `PriceButton`, `BottomNav`.

---

## 10. Screens & Meta-Game Flow (Phase 3)

### Decision: Full Meta Screen Loop with Dedicated Casual Story Game Navigation
* **Context**: Implementation of the 17 mobile screens defined in the specification.
* **Decisions**:
  - **Multi-Stage Splash Flow**: Stage 1 Publisher Splash (1.2s branded "Gulab Mahal Original Studios"), Stage 2 Game Splash (purple stripes, 3D candy logo, Anaya/Zoya/Kabir/Kajal key art, big round Play button), Stage 3 Loading (shimmer pill progress bar + 6 rotating beauty tips carousel).
  - **Salon Hub (HomeScreen)**: Isometric salon cutaway with interactive characters (Anaya, Zoya, Kabir, Kajal) showing comic dialogue speech bubbles, floating "Renovate!" bubble, right-side event column with timers (`FestivalMatch`, `BridalRush`, `DailyBrief`), quest notebook modal (`SalonGoalsModal`), and big round pulsing Play button.
  - **Adventure Map (`AdventureMapScreen`)**: Treasure-map parchment on a wooden table, 5 regions (Salon Street, Bridal Bazaar, Mela Grounds, Rooftop Garden, Lumiere Mall) with 5 stops each (puzzles & story cards), star progression gates, backpack & tasks tools, and blue GO button.
  - **Salon Renovation (`RenovationScreen`)**: 7 rooms with interactive Before/After toggle, coin pricing, before/after descriptions, and permanent bonuses (+5% coins, +5% score, +10% order coins, +1 undo, 15% energy regen, +15% combo points, +25% royal bonus).
  - **Festival Pass (`FestivalPassScreen`)**: Free & Gold Pass columns, 30 diamond level nodes, season countdown banner, and Gold Pass gem unlock.
  - **Festival Match (`FestivalMatchScreen`)**: Limited-time event mini-game with purple curtain header, 3 original mascots (Gobi, Chikoo, Piku) tracking collection goals, 6x6 match-3 swap puzzle grid, and swap limit counter.
  - **Interactive Dialogues (`StoryDialogueOverlay`)**: Cinematic cutscene overlay with character avatars, max 3 lines per card, Next button, and instant Skip control.

---

## 11. Core Gameplay & Customer Orders (Phase 4)

### Decision: 3-Customer Order Bubbles with Handcrafted Progression
* **Context**: The game requires 60 handcrafted levels with 3 customer orders per level, live vector makeup application, fair spawning, 60px lift, snap ghost preview, and autosave.
* **Decisions**:
  - **Level Architecture**: 60 handcrafted levels stored in `src/data/levels.json` with gentle difficulty ramp, balanced move limits (18-30), custom titles, star thresholds, and procedural scaling beyond level 60 via `getLevelData`.
  - **Customer Order Bubbles**: Each level displays 3 customer order cards in the HUD showing the customer's avatar, name, order goal (e.g. `clearLines`, `clearColor`, `pureShade`, `combo`, `score`), coin payout, and live progress bar with completion celebration checkmark.
  - **Live Vector Makeup Layer**: Front-facing front customer face model rendered in background SVG with distinct zone mapping (Rows 1-3 Eyes, 4-6 Cheeks, 7-8 Lips), receiving 600ms brush-sweeps upon line clears and saving looks to the player's Portfolio.
  - **Fairness & Dragging**: Pointer events with `touch-action: none` bound strictly to the board, piece lifted 60px above finger with real-time green/red snap ghost preview, and intelligent tray regeneration to guarantee at least one placeable piece when the board has empty space.

---

## 12. Meta Features & Social Look Sharing (Phase 5)

### Decision: Client-Side Look Card Generation with Privacy Controls
* **Context**: Players want to share their finished makeup creations on social platforms, but must have complete control over whether their player name is shown.
* **Decisions**:
  - `generateLookCard` renders an offscreen HTMLCanvasElement in two standard social formats: 'post' (1080x1080) and 'stories' (1080x1920).
  - Side-by-side comparison displays natural bare skin (Before) alongside the complete styled look (After) with active color recipe swatches.
  - An explicit `hideName` toggle allows players to mask their username, displaying "The Gulab Mahal Salon • Glam Look" instead of their personal name.
  - Native Web Share API integration with automatic fallback to high-resolution PNG download.
  - Deterministic Daily Beauty Brief seeded by calendar date (`YYYY-MM-DD`) generates an identical puzzle challenge for all players worldwide, with a dedicated daily leaderboard tab.
  - Explicit notification and marketing consent flags added to `SettingsScreen` and `UserProfile` with DPDP Act 2023 compliance.

---

## 13. Backend Architecture, Security & Privacy (Phase 6)

### Decision: Strict Server-Side Validation & DPDP Act 2023 Compliance
* **Context**: Secure currency management, leaderboard anti-cheat, and compliance with Indian DPDP Act 2023 and European GDPR.
* **Decisions**:
  - **Firestore Security Rules**: Strict schema validation on `/users/{uid}`, `/scores`, `/dailyBrief/{date}`, `/purchases`, and `/events`. Client writes to currencies (`coins`, `gems`), `energy`, `adsRemoved`, `hasGoldPass`, `unlockedLooks`, `unlockedRangPages`, and `rooms` are strictly forbidden. Only trusted Cloud Functions can update currency balances.
  - **Cloud Functions Suite**:
    - `validateScore`: Rate-limits submissions (1 per 10s), verifies theoretical maximum score per move, writes scores, and awards coins.
    - `verifyPurchase`: Validates Google Play and platform tokens, prevents replay attacks, and grants digital goods.
    - `syncEnergy`: Server-side reconciliation of energy regeneration (1 per 12m, max 30).
    - `weeklyReset`: Scheduled Cloud Function resetting weekly leaderboard scores older than 7 days.
    - `deleteUserData`: Complete GDPR/DPDPA data wipe across users, scores, and purchases.
  - **Privacy & User Rights**: Complete `PRIVACY_POLICY.md` and `TERMS.md`. Export script `scripts/export_consenting_emails.js` extracts only users with `marketingConsent === true`.

---

## 14. Monetization, Regional Pricing & Ad Policies (Phase 7)

### Decision: Multi-Tier Regional Pricing with Strict Non-Intrusive Ad Rules
* **Context**: Fair casual monetization tailored to both Indian (INR ₹) and international markets (USD $).
* **Decisions**:
  - **10-Product Catalog**: Starter Glam Bundle (₹99 / $1.99), 4 Gem Packs (100, 550, 1200, 3000 gems), Ad-Free Luxury (₹149 / $2.99), Glam Pass Monthly (₹79 / $2.99), Energy Booster Pack (₹49 / $0.99), Royal Bridal Look Pack (₹149 / $2.99), and Salon Grand Master Bundle (₹499 / $9.99).
  - **Regional Pricing**: Auto-detects `IN` (India), `TIER_1` (US, UK, EU, CA, AU), and `ROW`.
  - **Billing Abstraction**: `PlayBillingProvider` (Google Play Digital Goods API for Android/TWA) + `MockBillingProvider` (3s simulated web checkout for development).
  - **Ad Display Rules**:
    - Rewarded ads strictly opt-in for Continue Game, Energy Refill (+10), and Double Coins.
    - Interstitial ads capped strictly to every 3rd game-over session.
    - Never shown during active gameplay, never in the first 3 games for new players, and never for pass or no-ads owners.
  - **Gem Spend Confirmation**: `ConfirmSheet` bottom modal required before spending gems on revivals or energy.

---

## 15. Asset System & Visual Cohesion (Phase 8)

### Decision: Central Asset Catalog with Mandatory Prompt Style Anchor
* **Context**: Cohesive 2D cartoon art direction across 13 core game assets without IP infringement.
* **Decisions**:
  - `assets/manifest.json`: Structured catalog recording dimensions, formats, transparency flags, roles, and target screens for all 14 assets.
  - `IMAGE_PROMPTS.md`: 13 production image generation prompts, each strictly prepended with the mandatory `STYLE ANCHOR` enforcing 2D casual vector art, warm saturated lighting, cel-shaded gradients, crisp ink lines, Indian aesthetic (marigold, brass, pink sandstone), and 100% original wholesome characters.

---

## 16. Verification, Testing & Self-Review (Phase 9 & 10)

### Decision: Comprehensive Vitest Suite with Full Build Verification
* **Context**: Ensuring zero regressions, clean builds, and robust device compatibility across all resolutions.
* **Decisions**:
  - 94 automated tests across 12 test suites passing with 100% success rate.
  - Production build compiled clean via `tsc -b && vite build` in ~520ms with 0 errors.
  - `npm audit` verified with 0 vulnerabilities.
  - All documentation deliverables finalized and kept in sync.


