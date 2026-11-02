# Glam Blocks: Beauty Puzzle 💄✨

> **"The Face is Your Board"** — A production-quality, mobile-first block puzzle game blending tactical tile placement with high-fashion makeup artistry.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-59%20Passed-brightgreen.svg)](https://vitest.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable%20%26%20Offline-orange.svg)](https://web.dev/progressive-web-apps/)

---

## 📖 Table of Contents
1. [Product Concept & Core Loop](#-product-concept--core-loop)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Getting Started & Local Development](#-getting-started--local-development)
6. [Testing & Quality Assurance](#-testing--quality-assurance)
7. [Design System & Theming](#-design-system--theming)
8. [Monetization & Regional Pricing](#-monetization--regional-pricing)
9. [Backend, Security Rules & Cloud Functions](#-backend-security-rules--cloud-functions)
10. [Documentation Sitemap](#-documentation-sitemap)

---

## 💄 Product Concept & Core Loop

Players are presented with 3 random geometric block shapes on cards, drag them onto an 8x8 glass matrix board, and complete full rows or columns to clear them. 

What makes Glam Blocks unique:
1. **Live Makeup Canvas**: The 8x8 puzzle grid sits as a semi-transparent glass layer over an elegant vector face portrait. Rows correspond to facial zones:
   - **Rows 1–3**: Eyes (eyeshadow, eyeliner)
   - **Rows 4–6**: Cheeks (blush, cheekbone highlighter)
   - **Rows 7–8**: Lips (lipstick, lip gloss)
   When lines clear, the block's cosmetic color is applied to the corresponding zone with an animated brush sweep (600ms ease-out). Layers stack and blend, yielding a unique finished makeup look upon game completion.
2. **Client Briefs (Level Progression)**: 30 hand-crafted client briefs plus infinite procedural scaling stages. Each client presents an occasion and 2–3 objectives (e.g., *"Clear 2 pink lines"*, *"Do a 3-line combo"*, *"Reach 2,500 points"*).
3. **Pure Shade Multiplier**: Clearing a line of one uniform color grants `x2` score multiplier, a golden ring particle pulse, and fills one pan in the player's 12-pan Eyeshadow Palette.
4. **Indian Occasion Collections**: Festive styling themes including *Everyday Glow*, *Haldi Day*, *Mehendi Night*, *Sangeet Sparkle*, *Bridal Red*, and *Diwali Gold*.
5. **Daily Beauty Brief**: Seeded daily challenge identical for all players globally, featuring daily leaderboards and streak multipliers.
6. **Shareable Look Card**: Instant Before & After image generation for Instagram Stories (1080x1920) or Feed posts (1080x1080) via Web Share API with PNG download fallback.
7. **Inclusive Face Models**: 6 stylized models with fair, wheatish, medium, tan, deep, and dark skin tones.

---

## 🛠 Tech Stack

- **Frontend Core**: React 19, TypeScript, Vite.
- **Styling & Tokens**: Tailwind CSS v4 with CSS variables for light/dark themes.
- **Motion & Interaction**: Framer Motion (respects `prefers-reduced-motion` and battery saver).
- **Audio & Haptics**: Zero-latency synthesized Web Audio API (no external mp3/wav files) + `navigator.vibrate`.
- **Canvas & Artwork**: Plain DOM/CSS grid with inline SVG masks (no heavy canvas game engine; 60fps on 2GB RAM phones).
- **Backend & Cloud**: Firebase Auth (Google Sign-In, Email/Password, Guest Mode), Cloud Firestore with security rules, Cloud Functions.
- **PWA**: `manifest.json`, Service Worker caching (`sw.js`), installable, 100% offline gameplay.

---

## 📁 Project Structure

```
glam-blocks/
├── public/
│   ├── manifest.json            # PWA manifest (app name, colors, icons, shortcuts)
│   └── sw.js                    # Service worker (offline cache & network fallback)
├── src/
│   ├── assets/
│   │   └── faces/
│   │       └── FaceModel.tsx    # 6 vector face models with layered SVG masks
│   ├── components/              # 22 reusable atomic UI & game components
│   │   ├── GameBoard.tsx        # 8x8 glass grid with ghost previews & cell animations
│   │   ├── ShapeTray.tsx        # 3-shape draggable tray with 60px lift offset
│   │   ├── MakeupBrush.tsx      # Animated SVG brush sweep
│   │   ├── PureShadeBurst.tsx   # Celebratory pure shade particle burst
│   │   ├── ComboMeter.tsx       # Rising combo multiplier indicator
│   │   ├── GoalChip.tsx         # Live goal progress chip
│   │   ├── PauseModal.tsx       # Pause menu with resume, restart, and home
│   │   ├── StarRating.tsx       # 1-3 star rating with count-up animation
│   │   └── ...                  # Button, IconButton, Modal, Toast, Skeleton, etc.
│   ├── config/
│   │   ├── pricing.config.ts    # Regional catalogue (IN, TIER_1, ROW) + Billing providers
│   │   ├── shades.ts            # 7 primary + 6 festive beauty shade palettes
│   │   ├── theme.ts             # Light ("Rose Quartz Morning") & Dark ("Midnight Vanity") tokens
│   │   └── firebase.ts          # Firebase SDK client initialization
│   ├── context/
│   │   └── GameContext.tsx      # Unified React game state & user profile provider
│   ├── game/                    # Pure, framework-agnostic puzzle engine
│   │   ├── board.ts             # 8x8 matrix logic, line detection, cell checks
│   │   ├── shapes.ts            # 18 polyomino shape definitions & rotations
│   │   ├── scoring.ts           # Placement points, clear points, combo multipliers
│   │   ├── spawning.ts          # Fair spawning heuristic (>75% small shapes, 30% pure)
│   │   ├── goals.ts             # Objective tracking & star thresholds
│   │   ├── faceMapping.ts       # Facial zone mapping & opacity accumulation
│   │   ├── engine.ts            # Game loop: handlePlacement, undo, shuffle, bomb
│   │   └── levels.ts            # 30 hand-crafted client briefs + procedural generator
│   ├── hooks/                   # Custom hooks: useSound, useHaptics, useTheme, etc.
│   ├── i18n/                    # Zero-dependency translation provider & English strings
│   ├── screens/                 # 15 complete, mobile-first screens
│   │   ├── SplashScreen.tsx     # 1.5s brand intro with luxury shimmer sweep
│   │   ├── OnboardingScreen.tsx # 3 interactive swipe tutorial cards
│   │   ├── AuthScreen.tsx       # Google Sign-In, Email/Password, Guest mode, DPDP consent
│   │   ├── HomeScreen.tsx       # Hero today's client, play button, hardware back trap
│   │   ├── GameScreen.tsx       # The core puzzle screen with glass board over face portrait
│   │   ├── ClientResultScreen.tsx# Stars, coins, before/after slider, portfolio save
│   │   ├── GameOverScreen.tsx   # Score, rewarded ad continue, 50 gems revival
│   │   ├── PortfolioScreen.tsx  # Gallery of saved looks with export modal
│   │   ├── PaletteScreen.tsx    # 12-pan Eyeshadow Palette progress & rewards
│   │   ├── CollectionsScreen.tsx# 6 festive Indian collections & couture muse looks
│   │   ├── ShopScreen.tsx       # Gem packs, Glam Pass, regional currency display
│   │   ├── DailyRewardScreen.tsx# 7-day login streak reward calendar
│   │   ├── LeaderboardScreen.tsx# Global rankings with pinned user rank bar
│   │   ├── SettingsScreen.tsx   # Audio, haptics, theme, colorblind, reduced motion toggles
│   │   └── ProfileScreen.tsx    # User stats, model selector, data management
│   ├── services/                # Backend & platform bridges (auth, billing, ads, share, firestore)
│   ├── types/                   # Unified strictly-typed interfaces
│   ├── App.tsx                  # React Router setup with safe fallback loading
│   ├── main.tsx                 # Entrypoint with PWA service worker registration
│   └── index.css                # Tailwind directives, theme variables, glassmorphism utilities
├── functions/                   # Firebase Cloud Functions (Node.js/TypeScript)
│   ├── src/index.ts             # Callable functions: grantDailyReward, verifyPurchaseToken
│   └── scripts/exportMarketingEmails.ts # Marketing consent CSV export script
├── tests/unit/                  # Vitest automated test suite
├── firestore.rules              # Production Cloud Firestore security rules
├── DECISIONS.md                 # Technical decision log
├── TESTING.md                   # QA & manual device verification guide
├── PRIVACY_POLICY.md            # GDPR & India DPDP compliant privacy policy
├── TERMS.md                     # Terms of Service & virtual currency rules
└── STORE_LISTING.md             # Complete Google Play Store metadata & copy
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository and install dependencies
cd "glam-blocks"
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase credentials if integrating with a live Firebase backend. When Firebase keys are omitted or invalid, the game automatically operates in **standalone offline mode** using local mocks.

### Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Use Mobile Emulation mode (360x800) in Chrome DevTools for the ideal portrait mobile experience.

### Production Build
```bash
npm run build
```
Builds the optimized production bundle to the `dist/` directory with code splitting, CSS minification, and asset hashing.

---

## 🧪 Testing & Quality Assurance

```bash
# Run all 59 unit and integration tests
npm test
```
See [TESTING.md](./TESTING.md) for manual QA checklists covering low-end Android phones, viewport boundaries (320px–430px), notch safe-areas, and airplane mode testing.

---

## 🎨 Design System & Theming

Glam Blocks features two fully-specified luxury themes:
- **Light: "Rose Quartz Morning"**: Rose gold accents, dewy surfaces (`#FFF6F9`), soft hot rose (`#E6177F`).
- **Dark: "Midnight Vanity"**: Deep obsidian purple (`#140E19`), neon pink glow (`#FF4FA8`), radiant gold (`#FFD166`).

### Typography
- **Headings & Numbers**: `Fredoka` (600/700) with tabular figures for score animations.
- **Body & UI**: `Poppins` (400/500/600).

### Colorblind Accessibility
Each of the 7 cosmetic shades features a distinct dual-coded icon:
- **Rose Pink**: Lipstick 💄 (`lips`)
- **Lavender Violet**: Sparkle ✨ (`sparkle`)
- **Peach Blush**: Heart 💖 (`heart`)
- **Ruby Red**: Water Drop 💧 (`drop`)
- **Champagne Gold**: Star ⭐ (`star`)
- **Mint Green**: Leaf 🌿 (`leaf`)
- **Sky Blue**: Diamond 💎 (`diamond`)

---

## 💰 Monetization & Regional Pricing

Configured in `src/config/pricing.config.ts`:
- **Tiered Catalogue**:
  - `IN` (India): Micro-packs starting at ₹19 (50 Gems) to ₹799 (Bridal Red Vault).
  - `TIER_1` (US, UK, EU, CA, AU): Starting at $0.99.
  - `ROW`: Calibrated purchasing-power-parity pricing.
- **Provider Architecture**:
  - `PlayBillingProvider`: Native Google Play Billing / Digital Goods API bridge.
  - `MockBillingProvider`: In-browser simulation for development and testing.
  - `GoogleAdMobProvider` / `MockAdsProvider`: Interstitials and rewarded video ads with a 3-second interactive countdown overlay.

---

## 🔒 Backend, Security Rules & Cloud Functions

- **Cloud Firestore Security**: Rules strictly enforce that users can only read and write their own documents (`/users/{userId}`). Leaderboards are read-only for players and updated via verified cloud calls.
- **Cloud Functions**:
  - `grantDailyReward`: Server-side streak validation preventing client clock tampering.
  - `verifyPurchaseToken`: Validates Google Play purchase tokens before dispensing gems.
  - `exportMarketingEmails`: CLI script to export opted-in marketing email addresses with consent timestamps for DPDP/GDPR compliance.

---

## 📚 Documentation Sitemap

- [DECISIONS.md](./DECISIONS.md) — Rationale for Web Audio, SVG canvas, fair spawning, and regional pricing.
- [TESTING.md](./TESTING.md) — Complete automated test report and manual device testing matrix.
- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) — GDPR & DPDP 2023 compliant privacy policy.
- [TERMS.md](./TERMS.md) — Terms of service, virtual items, and intellectual property.
- [STORE_LISTING.md](./STORE_LISTING.md) — Google Play Store titles, descriptions, and screenshot captions.

---

**Glam Blocks** © 2026 Glam Blocks Studio. All rights reserved. Original artwork & gameplay.
