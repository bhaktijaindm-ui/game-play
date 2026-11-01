# Architectural and Design Decisions (DECISIONS.md)

This document tracks all design, architectural, and implementation choices made throughout the development of **Glam Blocks**, adhering to the rule: *choose the simplest reliable option and document it*.

---

## 1. Product & Theme Architecture (Phase 1)
- **Theme Concept**: Makeup & Glamour. Rather than abstract geometric blocks, each block color represents an iconic beauty/makeup product:
  - Pink (`#E91E8C` / `#FF4DAF`): **Lipstick** (Bullet icon, sleek rounded case)
  - Purple (`#9B5DE5` / `#B388FF`): **Eyeshadow** (Compact palette icon)
  - Peach (`#FF8A65` / `#FFAB91`): **Blush** (Swirl powder compact icon)
  - Red (`#E5484D` / `#FF6B6B`): **Nail Polish** (Bottle & brush cap icon)
  - Gold (`#F5B700` / `#FFD166`): **Highlighter** (Sunburst / glow shimmer compact)
  - Black/Noir (`#2B1B2E` / `#4A3B4E`): **Eyeliner** (Precision wing pen icon)
  - Mint (`#2FBF71` / `#3DD68C`): **Skincare Mask / Serum** (Dropper / botanical leaf icon)
- **Avatar & Looks Meta Layer**:
  - The avatar represents the player's canvas. As players accumulate score points (XP), they level up and unlock distinct "Looks" (e.g., *Natural Glow*, *Berry Pop*, *Sunset Shimmer*, *Golden Goddess*, *Cyber Glam*, *Gothic Velvet*, *Rose Garden*).
  - Players can equip any unlocked look, which dynamically updates their avatar across the top bar, profile, leaderboard, and celebration screens.
- **Save State Storage**:
  - Offline-first: Full local persistence in `localStorage` with atomic keys (`glam_blocks_state`, `glam_blocks_user`, `glam_blocks_settings`).
  - Cloud sync: When online and authenticated, state smoothly reconciles with Firestore (`users/{uid}`). Conflict resolution follows the "keep the higher score / latest unlock" rule.

---

## 2. Audio & Haptics (Phase 2)
- **Web Audio API Synthesis**:
  - Instead of depending on external `.mp3` or `.wav` files that could fail to load on flaky mobile connections or violate autoplay policies, we implement a custom, high-fidelity Web Audio API sound synthesizer (`soundSystem.ts`).
  - Synthesizes:
    - Soft "pop" on block placement (pitch-dropped sine wave with gentle lowpass).
    - "Sparkle" on line clear (high-frequency arpeggiated chimes with decaying resonance).
    - "Combo" chime (musical ascending chord progression up to 5x multiplier).
    - "Power-up" swoosh (frequency-swept triangle wave).
  - Autoplay compliance: Sound is lazily initialized and unlocked upon the first user interaction event (`pointerdown` or `click`).
  - Haptics: `navigator.vibrate` with distinct vibration patterns (`[15]` for placement, `[30, 40, 30]` for line clear, `[50, 60, 80]` for combo), guarded by a capability check and settings toggle.

---

## 3. Game Board & Drag-and-Drop (Phase 3 & Phase 4)
- **DOM / CSS Grid over Canvas**:
  - CSS Grid (8x8) allows pure DOM rendering, sharp vector rendering on high-DPI retina screens, accessibility labels, and zero memory leaks.
  - Drag and Drop uses unified **Pointer Events** (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) with `setPointerCapture`.
  - **Finger Offset**: The dragged piece is elevated 60px above the touch contact point so the player's thumb/finger never obstructs the placement preview.
  - **Snapping & Preview**: Live coordinate projection maps touch to grid coordinates (0..7, 0..7). Ghost cells highlight green (`valid`) or red (`invalid`). Grid cells are memoized to avoid re-rendering untouched cells.

---

## 4. Backend & Security (Phase 5 & Phase 6)
- **Firebase Authentication**: Supports Google Sign-In, Email/Password (with email verification and password reset), and Anonymous Guest mode. Guest accounts can link credentials to upgrade to permanent accounts without progress loss.
- **Firebase Security Rules**:
  - Read/Write restricted to authenticated user's own document.
  - Client cannot mutate currency (`coins`, `gems`) or entitlement flags (`adsRemoved`, `glamPassUntil`) directly; these are guarded and altered exclusively through authorized cloud logic.
- **Server Functions**: Cloud Functions (with local Express fallback for emulator/dev) handle score validation (rejecting physically impossible moves/time ratios) and mock/Play purchase verification.
- **GDPR & India DPDP Compliance**: Explicit separate checkboxes for Terms/Privacy (mandatory) vs. Marketing emails (optional). "Delete my account and data" irreversibly wipes both Firebase Auth and Firestore user data.

---

## 5. Monetization & Ads (Phase 7)
- **Region-Tiered Pricing**: `pricing.config.ts` acts as the single source of truth for INR, USD, and Rest-of-World pricing tiers. Region is detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` and `navigator.language`.
- **Billing Provider**: Dual-engine architecture:
  - `PlayBillingProvider` for TWA / Google Play Digital Goods API.
  - `MockBillingProvider` for web/browser sandbox with clear "Demo mode: no real charge" indicator.
- **AdMob vs Web Ads**: Documented requirement that Google AdMob requires a native wrapper (Capacitor/Cordova/TWA with native bridges), whereas web browser deployments use web ad providers or `MockAdsProvider` (3-second polite countdown with skip/close).
