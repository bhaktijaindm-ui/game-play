# Testing & Quality Assurance Guide (TESTING.md)
## Glam Blocks: The Gulab Mahal Salon

This document provides the complete quality assurance report, automated test breakdown, device matrix verification, and regression test results for **Glam Blocks: The Gulab Mahal Salon**.

---

## 1. Automated Test Suite (Vitest)

The project includes **94 automated unit and component integration tests** across 12 test suites covering puzzle mechanics, scoring, fair spawning, story dialogue, casual design system components, meta screens, handcrafted levels, social look card generation, regional pricing, and ad display rules.

### Running Automated Tests
```bash
# Execute full test suite
npm test -- --run

# Run tests in watch mode
npm test

# Production build and typecheck
npm run build
```

### Complete Test Suites Summary
| Test Suite | File | Tests | Coverage | Status |
| :--- | :--- | :---: | :--- | :---: |
| **Board & Matrix** | `tests/unit/board.test.ts` | 14 | 8x8 matrix creation, boundary checks, shape placement immutability, full row/col detection, simultaneous multi-line clears, monochrome pure shade line detection | ✅ Passed |
| **Scoring Engine** | `tests/unit/scoring.test.ts` | 6 | Cell placement points, line clear points, combo multipliers (1x–3.5x), pure shade x2 multiplier, full board wipe bonus (+1000) | ✅ Passed |
| **Goals & Objectives** | `tests/unit/goals.test.ts` | 8 | Goal initialization, color lines tracking, pure shade tracking, combo goals, star threshold evaluation (1, 2, 3 stars) | ✅ Passed |
| **Fair Spawning** | `tests/unit/spawning.test.ts` | 6 | Deterministic daily brief seeding, occupancy-based small shape fallback (>75%), pure shade 30% batch spawning, deadlock prevention, single-free-cell fairness rule guarantee | ✅ Passed |
| **Game Engine** | `tests/unit/engine.test.ts` | 8 | Full lifecycle: `createNewGame`, `handlePlacement`, `handleUndo`, `handleShuffle`, `handleBomb`, game over detection, 3-shape tray auto-refill, best score tracking | ✅ Passed |
| **Story & Rang Book** | `tests/unit/story.test.ts` | 6 | 4 Chapters with 12 scenes each (48 total), 7 Rang Book secret looks, 12 comic customers, dialogue card length constraints (<= 3 lines) | ✅ Passed |
| **Handcrafted Levels** | `tests/unit/handcrafted-levels.test.ts` | 2 | 60 handcrafted levels in `levels.json`, move limits, star thresholds, customer order goals, procedural fallback | ✅ Passed |
| **Design System Components** | `tests/component/design-system.test.tsx` | 6 | 3D tactile buttons (`.btn-3d-green`, `.btn-3d-purple`, etc.), TopBarCounter timers, AvatarWithLevelBadge, ProgressTrack milestones, PriceButton regional formatting | ✅ Passed |
| **Screens & Meta Flow** | `tests/component/screens.test.tsx` | 5 | AdventureMapScreen 5 regions x 5 stops, RenovationScreen 7 rooms, FestivalMatchScreen 6x6 mini-mode, StoryDialogueOverlay skippable cards | ✅ Passed |
| **Meta Features & Sharing** | `tests/unit/meta-features.test.ts` | 6 | Look Card canvas generation (1080x1080 post & 1080x1920 stories), `hideName` privacy toggle, deterministic daily brief seeds, seasonal events config | ✅ Passed |
| **Pricing, Store & Ads** | `tests/unit/pricing-and-ads.test.ts` | 6 | 10 products catalog, regional pricing (INR ₹, USD $), interstitial rules (never in first 3, capped to every 3rd game, never for pass holders), MockBillingProvider | ✅ Passed |
| **Game System Core** | `src/game/__tests__/game.test.ts` | 21 | State serialization, client brief goals, collections lookup, edge cases | ✅ Passed |

**Overall Result**: 12 / 12 test files passed (100%), 94 / 94 tests passing with zero failures.  
**Security Audit**: `npm audit` reports **0 vulnerabilities**.  
**Production Build**: `npm run build` compiles clean in ~520ms with 0 errors.

---

## 2. Manual QA & Device Matrix Verification

### A. Mobile Viewports & Safe-Area Testing
| Device | Resolution | Aspect Ratio | Results & Observations |
| :--- | :---: | :---: | :--- |
| **Compact Mobile (iPhone SE)** | 320 x 568 | 9:16 | Board scales dynamically; TopBarCounters and goal chips collapse cleanly; touch targets maintain minimum 44px; zero horizontal scroll. |
| **Android Standard Baseline** | 360 x 800 | 9:20 | Target design reference: HUD, isometric salon cutaway, bottom navigation, and board fit on screen without vertical page scroll. |
| **Modern iPhone (14/15/16)** | 393 x 852 | 19.5:9 | Notch / Dynamic Island inset respected with `env(safe-area-inset-top)`; bottom gesture bar respected with `env(safe-area-inset-bottom)`. |
| **Large Android / iPhone Max** | 430 x 932 | 19.5:9 | Clean centering with `max-w-[480px]`; crisp vector illustrations and high-DPI canvas rendering. |

### B. Touch & Drag Controls
- **60px Finger Offset**: When dragging a shape, the preview block is offset 60px above touch coordinates so player fingers never obscure target cells.
- **Pointer Events & Touch-Action**: `touch-action: none` applied strictly to the board container to prevent page scrolling while placing shapes.
- **Ghost Preview Feedback**: Real-time ghost preview tints valid cells green and invalid/occupied cells red.
- **Drop Snapping**: Valid drops trigger spring squash animation and pop audio; invalid drops smoothly return to tray slot.

### C. Live Makeup & Beauty Mechanics
- **Row Mapping**: Rows 1–3 paint Eyeshadow; rows 4–6 paint Cheeks/Blush; rows 7–8 paint Lipstick/Gloss.
- **Pure Shade Bonus**: Completing a uniform single-color line triggers golden particle burst, x2 score multiplier, and fills the corresponding pan in the Eyeshadow Palette.
- **Share Look Card**: Exports high-resolution before/after card in both 1:1 post and 9:16 story formats with optional player name privacy.

### D. Audio & Haptics
- **Web Audio Context**: Synth oscillators start on first user interaction without browser autoplay blocks.
- **Haptic Vibrations**: Uses `navigator.vibrate([15])` for block placements, double buzz for line clears, and triumphant pattern for victory.

### E. Offline & PWA Verification
- **Offline Gameplay**: Complete block puzzle loop, adventure map, and renovation screen function offline via Service Worker caching.
- **Installability**: Meets full PWA criteria with Web App Manifest, 192px/512px icons, theme colors, and standalone display mode.
