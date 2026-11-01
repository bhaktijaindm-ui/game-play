# 💄 Glam Blocks — Makeup-Themed Block Puzzle Game

A complete, production-quality, mobile-first block puzzle game built with **React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and Firebase**.

---

## 🌟 Game Highlights

- **Chic Makeup Theme**: Blocks represent iconic beauty essentials (Velvet Lipstick, Shimmer Eyeshadow, Peach Cheek Blush, Lustre Nail Polish, Golden Highlighter, Precision Eyeliner, Mint Skincare).
- **Smooth 60fps Performance**: Pure DOM/CSS 8x8 grid with zero heavy 3D game engines, engineered to run smoothly on low-end mobile devices.
- **Fairness Spawning Engine**: Spawns 3 blocks at a time, ensuring at least one shape can be placed on the board whenever space permits.
- **Meta Layer (Avatar & Looks Studio)**: Score points and level up to unlock and equip collectible cosmetic looks.
- **Audio & Haptics**: Pure Web Audio API synthesis (organic "pop" on placement, pentatonic chimes on clears, combo scales) and `navigator.vibrate` haptic feedback with browser autoplay compliance.
- **100% Offline PWA**: Installable PWA with service worker caching and instant local state resumption.
- **Regional Pricing**: Auto-adapts between India (INR ₹99), US/Tier 1 ($1.99), and Rest of World ($1.49) with Google Play Billing and Sandbox fallbacks.
- **GDPR & India DPDP Compliance**: Explicit opt-in marketing consent, age restriction notice (13+), and one-click in-app "Delete My Account & Data" functionality.

---

## 📁 Project Architecture

```
game-play/
├── public/
│   ├── favicon.png
│   ├── manifest.json            # PWA Web App Manifest
│   ├── sw.js                    # Offline Service Worker
│   ├── icons/                   # App icons (48, 72, 96, 144, 192, 512, maskable)
│   └── store/                   # Play Store Feature Graphic (1024x500) & 4 Screenshots
├── src/
│   ├── components/
│   │   ├── avatar/              # GlamAvatar custom SVG cosmetic renderer
│   │   ├── game/                # GridCell, PowerUpBar, PauseModal
│   │   ├── icons/               # Makeup item SVG icons
│   │   └── ui/                  # Reusable Button, Card, Modal, BottomSheet, Toast, etc.
│   ├── config/
│   │   ├── pricing.config.ts    # Single source of truth for products & regional tiers
│   │   └── product.config.ts    # Makeup themes, collectible looks, and game rules
│   ├── game/
│   │   ├── board.ts             # Pure board operations, placement, line clears, fairness
│   │   ├── shapes.ts            # 25 classic shapes library with rotations
│   │   └── types.ts             # TypeScript definitions
│   ├── i18n/
│   │   ├── en.json              # English string table
│   │   ├── hi.json              # Hindi string table
│   │   └── i18nContext.tsx      # Language provider & interpolation hook
│   ├── screens/                 # 12 Mobile screens (Splash, Onboarding, Auth, Home, Game, etc.)
│   ├── services/
│   │   ├── ads.ts               # Ads provider with frequency capping & reward flow
│   │   ├── authContext.tsx      # User profile, currency, and offline sync
│   │   ├── billing.ts           # PlayBillingProvider & MockBillingProvider
│   │   ├── firebase.ts          # Firebase Client, Firestore sync, rate limiter
│   │   ├── soundSystem.ts       # Web Audio API synthesizer & haptics
│   │   └── themeContext.tsx     # Light/Dark/System CSS variables manager
│   ├── App.tsx                  # Screen navigator & Android back-button handler
│   ├── index.css                # Tailwind base, CSS variables, safe areas
│   └── main.tsx                 # App mount & service worker registration
├── functions/
│   ├── package.json
│   ├── server.ts                # Standalone Express server alternative
│   └── src/index.ts             # Firebase Cloud Functions (validateScore, verifyPurchase)
├── scripts/
│   ├── exportMarketingEmails.js # GDPR/DPDP compliant CSV customer list exporter
│   └── generateIcons.js         # Sharp-based SVG/PNG icon generator
├── tests/                       # Vitest and React Testing Library test suites
├── firestore.rules              # Strict Firestore security rules
├── firebase.json                # Firebase hosting & security headers configuration
├── DECISIONS.md                 # Architectural log of all choices made
├── TESTING.md                   # Automated results & manual mobile test matrix
├── PRIVACY_POLICY.md            # Plain language GDPR & DPDP privacy policy
├── TERMS.md                     # Terms of Service & virtual currency rules
└── STORE_LISTING.md             # Google Play Store descriptions, keywords & captions
```

---

## 🚀 Beginner Setup Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18+ or v20+ installed on your system.

### 2. Clone and Install
```bash
git clone <repository-url>
cd "game play"
npm install
```

### 3. Configure Firebase
1. Open the [Firebase Console](https://console.firebase.google.com/) and click **Add project**. Name it `glam-blocks-puzzle`.
2. Under **Build**, enable **Authentication**:
   - Turn on **Google** and **Email/Password**.
   - Turn on **Anonymous** (for Guest mode).
3. Under **Build**, enable **Cloud Firestore**:
   - Create database in production mode.
4. Go to **Project Settings** -> **General** -> **Your apps** -> Click the **Web** icon (`</>`).
5. Copy your Firebase configuration into `.env` (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
*(Note: If you run locally without Firebase credentials, the game automatically operates in offline sandbox mode with full functionality!)*

### 4. Deploy Firestore Security Rules
```bash
npx firebase deploy --only firestore:rules
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Open DevTools and switch to Mobile Device View (Pixel 5 or iPhone 12) for the designed experience.

### 6. Run Automated Test Suite
```bash
npm run test
```
Executes all 26 unit and component tests covering game logic, board bounds, line clears, combo multipliers, fairness rules, regional pricing, and security rules.

### 7. Deploy to Firebase Hosting
```bash
npm run build
npx firebase deploy --only hosting
```

---

## 📊 Marketing Email Export (Admin Script)

In compliance with GDPR and India DPDP regulations, marketing emails are exported **only** for users who explicitly checked the optional promotional box:

```bash
node scripts/exportMarketingEmails.js
```
This generates a formatted CSV in `exports/` ready for immediate upload to Meta Ads Manager (Custom Audiences) or Google Ads Customer Match.

---

## 📜 Licenses & Attribution
- All artwork, sound synthesis algorithms, and icons are original and created specifically for Glam Blocks.
- Rated for ages 13+.
