# Testing & Quality Assurance Guide (TESTING.md)

This document outlines automated test suites, manual verification matrices, device test scenarios, and regression checklists for **Glam Blocks**.

---

## 1. Automated Test Suite (Vitest)

The project includes 63 automated unit and integration tests across core puzzle engine, matrix calculation, procedural generation, fairness guarantees, and scoring logic.

### Running Automated Tests
```bash
# Execute full test suite
npm test

# Run tests in watch mode
npx vitest

# Generate test coverage report
npx vitest run --coverage
```

### Test Suite Structure
| Test Suite | File | Tests | Coverage |
| :--- | :--- | :--- | :--- |
| **Board & Matrix** | `tests/unit/board.test.ts` | 14 | 8x8 matrix creation, boundary checks, shape placement immutability, full row/col detection, simultaneous multi-line clears, monochrome line detection |
| **Scoring Engine** | `tests/unit/scoring.test.ts` | 6 | Cell placement points, line clear points, combo multipliers (1x–3.5x), pure shade x2 multiplier, full board wipe bonus (+1000) |
| **Goals & Objectives** | `tests/unit/goals.test.ts` | 8 | Goal initialization, color lines tracking, pure shade tracking, combo goals, star threshold evaluation (1, 2, 3 stars) |
| **Fair Spawning** | `tests/unit/spawning.test.ts` | 6 | Deterministic daily brief seeding, occupancy-based small shape fallback (>75%), pure shade 30% batch spawning, deadlock prevention, single-free-cell fairness rule guarantee |
| **Game Engine** | `tests/unit/engine.test.ts` | 8 | Full lifecycle: `createNewGame`, `handlePlacement`, `handleUndo`, `handleShuffle`, `handleBomb`, game over detection, 3-shape tray auto-refill, best score tracking |
| **Comprehensive** | `src/game/__tests__/game.test.ts` | 21 | Serialization/deserialization, level catalog (1–30), procedural level generation (>30), collection lookups |

**Status**: 6 / 6 test files passed, 63 / 63 tests passing (100% pass rate). Zero high or critical vulnerabilities (`npm audit`: 0 vulnerabilities).

---

## 2. Manual QA & Device Matrix Checklist

### A. Viewport & Safe-Area Testing
- [x] **360 x 800 (Standard Android Baseline)**:
  - Tray, board, HUD, and power-up buttons fit completely on screen without page vertical scroll.
  - Touch targets measure at least 48x48px.
- [x] **320 x 568 (Compact Screen / iPhone SE)**:
  - Board scales dynamically via `aspect-square max-w-[340px]`.
  - Goal chips horizontally scroll smoothly with `.no-scrollbar`.
  - Font sizes remain readable; no button label wrapping.
- [x] **393 x 852 & 430 x 932 (Modern Notch / Dynamic Island / Gesture Bar)**:
  - Top HUD respects `env(safe-area-inset-top)`.
  - Bottom navigation and primary action buttons respect `env(safe-area-inset-bottom)`.
  - Centered layout with subtle luxury vanity backdrop on screens > 480px wide.

### B. Touch, Drag & Drop Interaction
- [x] **60px Finger Lift Offset**:
  - Dragging a block lifts the piece 60px above the touch contact point so the player's finger never obscures placement targets.
- [x] **Drop Validity Detection**:
  - Dropping over a valid board region places the piece with a tactile squash-and-settle animation and `pop` sound.
  - Dropping over invalid cells or releasing outside the grid snaps the shape smoothly back into its tray slot with spring physics.
- [x] **Cell Hover Feedback**:
  - Real-time ghost preview highlights targeted cells green (valid) or red (occupied/out-of-bounds).

### C. Live Makeup Canvas & Visual Aesthetics
- [x] **Face Zone Mapping**:
  - Clearing rows 1–3 paints eyeshadow/liner.
  - Clearing rows 4–6 applies blush/highlighter.
  - Clearing rows 7–8 applies velvet lipstick/gloss.
  - Clearing columns applies multi-zone contour across matching rows.
- [x] **Pure Shade Bonus**:
  - Clearing a line of 1 uniform color triggers a golden ring pulse, `x2` points, and fills the corresponding pan in the Eyeshadow Palette.
- [x] **Brush Sweep Animation**:
  - Cleared lines sweep a soft gradient across the vector face portrait (600ms ease-out).

### D. Audio & Haptics Verification
- [x] **Web Audio Initialization**:
  - Audio starts only after the player's first explicit touch/click (no browser console autoplay warnings).
  - Sound effects toggle immediately silences all synth oscillators.
  - Music toggle controls ambient luxury counter melody.
  - Haptics invoke `navigator.vibrate([15])` on supported Android devices; fails gracefully on iOS.

### E. Hardware Back Button & Lifecycle (Android)
- [x] **Hardware Back Button Trap**:
  - On sub-screens (`/palette`, `/collections`, `/shop`, `/settings`), back button navigates to Home.
  - In active `/game`, back button triggers the Pause modal.
  - On `/` (Home), back button triggers the bottom-sheet "Exit Glam Blocks? Don't lose your streak!" confirmation modal. Accidental app exit is prevented.

### F. PWA & Offline Play Verification
- [x] **Airplane Mode Verification**:
  - Disconnecting WiFi/cellular displays the non-intrusive `OfflineBanner`.
  - Full game loop, levels, procedural mode, and Daily Beauty Brief function seamlessly.
  - Service worker caches all static scripts, stylesheets, fonts, and icons.
  - Reconnecting to internet synchronizes profile stats to Firestore without loss of progress.

### G. Accessibility & Theming
- [x] **Theme Switching**:
  - Instant transition between "Rose Quartz Morning" (light) and "Midnight Vanity" (dark) with 250ms cross-fade.
  - High WCAG AA contrast ratio (> 4.5:1) maintained for all text tokens in both modes.
- [x] **Colorblind Friendly Mode**:
  - Toggling in Settings enlarges shade pattern micro-icons by 125% and provides distinct icons (lips, sparkle, heart, drop, star, leaf, diamond).
- [x] **Reduced Motion**:
  - Respects OS `prefers-reduced-motion` and user in-game toggle; disables particle bursts and replaces spring animations with subtle cross-fades.
