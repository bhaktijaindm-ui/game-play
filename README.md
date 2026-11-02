# Glam Blocks: The Gulab Mahal Salon 🌹✨💄

> **"The Face is Your Board"** — A complete mobile-first puzzle game with a story-driven salon restoration meta-game, 60 handcrafted levels, live vector makeup mechanics, seasonal pass, and adventure map.

[![Live on Vercel](https://img.shields.io/badge/Live%20Demo-game--play--theta.vercel.app-brightgreen?logo=vercel)](https://game-play-theta.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-94%20Passed-brightgreen.svg)](https://vitest.dev/)
[![Security Audit](https://img.shields.io/badge/Security-0%20Vulnerabilities-success.svg)](https://github.com/bhaktijaindm-ui/game-play)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)](https://web.dev/progressive-web-apps/)

---

## 📖 Table of Contents
1. [Overview & Narrative](#-overview--narrative)
2. [Unique Mechanics & Game Core](#-unique-mechanics--game-core)
3. [Meta-Game Features](#-meta-game-features)
4. [Tech Stack & Architecture](#-tech-stack--architecture)
5. [Getting Started & Development](#-getting-started--development)
6. [Testing & Quality Assurance](#-testing--quality-assurance)
7. [Design System & UI Tokens](#-design-system--ui-tokens)
8. [Monetization, Regional Pricing & Ads](#-monetization-regional-pricing--ads)
9. [Backend, Security & Privacy Compliance](#-backend-security--privacy-compliance)
10. [Documentation Sitemap](#-documentation-sitemap)

---

## 🌹 Overview & Narrative

Set in **Rangpur**, a vibrant heritage Indian town. **Anaya Sharma** (26, warm, determined) inherits her late grandmother Nani's faded beauty salon, **"Gulab Mahal Salon"**, and Nani's legendary **"Rang Book"** (a diary of 7 secret signature looks). With the support of her community, Anaya restores the salon room by room.

### Key Characters (100% Original IP)
* **Anaya Sharma**: Long wavy dark-brown hair with a signature magenta streak, rose-pink salon apron over black tee, gold bangles.
* **Zoya**: Best friend and bubbly nail artist, short curly hair, trendy mint-green jumpsuit.
* **Kabir**: Cheerful handyman and lifelong friend, glasses, denim jacket, tool belt.
* **Tara-ji**: Retired veteran makeup artist and mentor, elegant silk saree, silver bob.
* **Kajal**: The salon's sleek black cat with a tiny gold collar and bell.
* **Rhea Mehra**: Sleek bob, tailored blazer; friendly rival owner of the "Lumiere" beauty chain who becomes a partner.
* **12 Recurring Customers**: Comic personalities ordering bespoke looks (e.g., Mrs. Kapoor, Priya, Simran).

### Wholesome Story Arc
* **4 Chapters, 12 Scenes Each (48 Scenes Total)**:
  1. *Reopening the Doors*
  2. *Bridal Season*
  3. *Festival of Colors*
  4. *The Grand Beauty Fair*
* Dialogue cards are strictly capped at <= 3 lines, fast-paced, wholesome (strictly 13+), and skippable.
* Unlocks 7 secret looks in Nani's Rang Book and 7 salon rooms.

---

## 💄 Unique Mechanics & Game Core

1. **The Face is Your Board**:
   - The 8x8 glass puzzle matrix rests over an elegant stylized vector portrait.
   - **Rows 1–3**: Eyes (eyeshadow, liner).
   - **Rows 4–6**: Cheeks (blush, highlighter).
   - **Rows 7–8**: Lips (lipstick, gloss).
   - Clearing rows or columns applies soft animated brush sweeps (SVG mask, 600ms ease-out) stacking into a finished makeup look.
2. **Customer Order Bubbles**:
   - Every level mounts 3 customer order cards displaying portrait, name, objective (e.g. *Clear 3 Pink Lines*, *2-Line Combo*, *Score 1200*), and coin bounty with live progress.
3. **Pure Shade Multiplier**:
   - Lines cleared with blocks of one uniform color trigger **x2 score**, golden burst particles, and fill a pan in the 12-pan Eyeshadow Palette.
4. **Fairness Spawning Guarantee**:
   - Pointer drag lifted 60px above finger with real-time green/red snap ghost preview.
   - Occupancy heuristic (>75% shifts to small shapes) and guaranteed placeable shape fallback prevent premature deadlocks.
5. **Autosave**:
   - Game state automatically persists after every move to resume seamlessly upon reopen.

---

## 🏛 Meta-Game Features

* **Adventure Map (`AdventureMapScreen`)**: 5 themed regions (Salon Street, Bazaar Quarter, Palace Gardens, Heritage Fort, Royal Haveli) with 25 stops, star gates, and progress chests.
* **Salon Renovation (`RenovationScreen`)**: 7 rooms with interactive Before/After slider reveals and permanent passive perks:
  - Reception (+5% coins)
  - Makeup Studio (+5% score)
  - Nail Bar (+10% customer coins)
  - Hair Lounge (+1 undo per game)
  - Herbal Spa (15% faster energy regen)
  - Rooftop Cafe (+15% combo points)
  - Bridal Suite (+25% all rewards)
* **Festival Match Event (`FestivalMatchScreen`)**: 6x6 match-3 swap puzzle with 3 mascots (Anaya, Zoya, Kabir) tracking collection objectives.
* **Festival Pass (`FestivalPassScreen`)**: 30 diamond progression nodes, Free & Gold reward tracks, and seasonal event banners (Diwali, Winter, Holi, Eid).
* **Daily Beauty Brief**: Deterministic daily puzzle seeded by calendar date, global shared challenge, and dedicated leaderboard.
* **Shareable Look Card**: High-res canvas export for Instagram Stories (1080x1920) or Feed posts (1080x1080) with Before/After comparison and optional "Hide Name" toggle.

---

## 🛠 Tech Stack & Architecture

- **Frontend Core**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS v4 with semantic CSS variable tokens.
- **Motion**: Framer Motion with reduced-motion support.
- **Audio & Haptics**: Synthesized Web Audio API oscillators (0 byte external audio) + `navigator.vibrate`.
- **Backend**: Firebase Auth (Google, Email, Guest), Firestore with Security Rules, Cloud Functions (`validateScore`, `verifyPurchase`, `weeklyReset`, `claimReward`, `syncEnergy`, `deleteUserData`).
- **PWA**: `manifest.json`, Service Worker caching (`sw.js`), 100% offline gameplay.

---

## 🚀 Getting Started & Development

### Prerequisites
- Node.js 18+ (tested on Node 26.x on Vercel)
- npm or pnpm

### Setup
```bash
# Clone the repository
git clone https://github.com/bhaktijaindm-ui/game-play.git
cd game-play

# Install dependencies
npm install

# Run local development server
npm run dev

# Run full automated test suite
npm test -- --run

# Build production bundle
npm run build
```

---

## 🧪 Testing & Quality Assurance

All 94 automated tests pass with 100% success rate:
```bash
npm test -- --run
```
- `tests/unit/board.test.ts` (14 tests)
- `tests/unit/scoring.test.ts` (6 tests)
- `tests/unit/goals.test.ts` (8 tests)
- `tests/unit/spawning.test.ts` (6 tests)
- `tests/unit/engine.test.ts` (8 tests)
- `src/game/__tests__/game.test.ts` (21 tests)
- `tests/unit/story.test.ts` (6 tests)
- `tests/component/design-system.test.tsx` (6 tests)
- `tests/component/screens.test.tsx` (5 tests)
- `tests/unit/handcrafted-levels.test.ts` (2 tests)
- `tests/unit/meta-features.test.ts` (6 tests)
- `tests/unit/pricing-and-ads.test.ts` (6 tests)

Security Audit: `npm audit` reports **0 vulnerabilities**.

---

## 💎 Monetization, Regional Pricing & Ads

* **10 Product Catalog**: Starter Glam Bundle, 4 Gem Packs (100, 550, 1200, 3000), Remove Ads, Glam Pass Monthly, Energy Booster Pack, Royal Bridal Look Pack, Salon Grand Master Bundle.
* **3 Regional Pricing Tiers**:
  - `IN` (India): INR (₹)
  - `TIER_1` (US, UK, EU, AU, CA): USD ($)
  - `ROW` (Rest of World): USD ($)
* **Billing Provider**: `PlayBillingProvider` (Google Play Digital Goods API for Android/TWA) + `MockBillingProvider` (3s simulated web testing).
* **Ad Rules**: Interstitials capped strictly to every 3rd game-over; never shown in the first 3 games; never shown to pass or no-ads purchasers. Rewarded ads for Continue, Energy Refill, and Double Coins.
* **Gem Protection**: `ConfirmSheet` confirmation modal with exact gem price and remaining balance before spending.

---

## 🛡 Backend, Security & Privacy Compliance

* **DPDP Act 2023 & GDPR Compliant**: Explicit opt-in marketing consent with ISO timestamps, verified data deletion ("Delete My Account & Data"), and export script `scripts/export_consenting_emails.js`.
* **Firestore Security Rules**: Client writes to currencies (`coins`, `gems`), `energy`, `adsRemoved`, `hasGoldPass`, `unlockedLooks`, and `rooms` are forbidden.
* **Server-Side Validation**: Cloud functions validate score thresholds, moves played, and purchase tokens to prevent cheating.

---

## 📚 Documentation Sitemap

* [`STORY.md`](STORY.md) — Complete 48-scene script, 7 Rang Book looks, character bibles, and comic customers.
* [`DECISIONS.md`](DECISIONS.md) — Architecture, algorithms, performance, and game design decision records.
* [`TESTING.md`](TESTING.md) — QA test matrix, device resolutions, touch offsets, and vitest results.
* [`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md) — 13 production image generation prompts with mandatory STYLE ANCHOR.
* [`PRIVACY_POLICY.md`](PRIVACY_POLICY.md) — DPDP Act 2023 & GDPR compliant privacy policy.
* [`TERMS.md`](TERMS.md) — Casual puzzle terms of service & virtual currency guidelines.
* [`STORE_LISTING.md`](STORE_LISTING.md) — Google Play Store description, metadata, promo copy, and keywords.
* [`assets/manifest.json`](assets/manifest.json) — Catalog of all game assets, dimensions, transparency, and target screens.
