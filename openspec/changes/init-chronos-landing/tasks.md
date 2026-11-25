# Tasks

## 1. Metadata and Algorithm Catalog

- [x] 1.1 Create `src/algorithms.ts` exporting the `AlgorithmId` union and ordered `SCHEDULING_ALGORITHMS` list with all ten algorithms (FCFS, SJF, SRT, Priority Scheduling, Round Robin, LJF, HRRN, MLQ, MLFQ, LRTF), verifying `bun run typecheck` passes and all 10 entries have unique IDs and spelled-correctly labels.
- [x] 1.2 Create `src/favicon.svg` with an astrolabe/clockwork emblem and update `src/index.html` (`<html lang="en">`, `ChronOS | Scheduling Algorithms` title, meta description, favicon link). Verify `bun run build` emits `dist/index.html` with the updated title and icon reference.

## 2. Horological Artwork and Ferris-Wheel Clock Selector

- [x] 2.1 Create `src/components/ClockArtwork.tsx` rendering theme-aware inline SVG layers (Roman-numeral bezel, celestial astrolabe arcs, interlocking clockwork gears, and rotating filigree hands driven by wheel rotation angle). Verify `bun run typecheck` passes and SVG transforms accept arbitrary rotation angles cleanly.
- [x] 2.2 Create `src/components/ClockWheelSelector.tsx` implementing the right-edge-protruding circular Ferris-wheel selector with 10 counter-rotated upright algorithm stations, wheel/trackpad scroll rotation, touch drag support, click-to-focus selection, hover styling, and keyboard navigation (`Tab`, `ArrowUp`/`ArrowDown`/`ArrowLeft`/`ArrowRight`, `Enter`/`Space`). Verify in browser DevTools that scrolling down advances options sequentially, labels remain upright through a full 360-degree revolution, and clicking or pressing keys selects an option without triggering navigation or network requests.

## 3. Landing Shell and Dual-Theme Styling

- [x] 3.1 Create `src/components/ThemeToggle.tsx` with an accessible icon-only toggle button switching `data-theme` between `"dark"` (Dark Celestial Clockwork default) and `"light"` (Warm Parchment Clockwork), meeting 44x44px minimum target sizing and keyboard operability (`Enter`/`Space`). Verify toggling updates `document.documentElement.dataset.theme` and button ARIA state accurately.
- [x] 3.2 Replace `src/App.tsx` with the ChronOS landing shell (`<header>`, `<main>`, left-side `<h1>ChronOS</h1>`, `Scheduling Algorithms` subtext, fixed-position active algorithm description readout without shifting `ChronOS`, top-right icon `ThemeToggle`, and right-side `ClockWheelSelector` without acronyms, `"Simulator coming soon"`, or Prev/Next buttons), removing `APITester` from render. Verify `bun run dev` renders the split layout cleanly with zero console errors.
- [ ] 3.3 Replace `src/index.css` with Dark Celestial and Warm Parchment theme tokens, editorial horological typography, split desktop layout (clock protruding from the right edge without page horizontal overflow), hover/focus/selected states, responsive tablet and mobile (`320px`) stacked layouts, and `@media (prefers-reduced-motion: reduce)` rules. Verify at `1440x900`, `820x1024`, and `320x568` in both themes that zero horizontal overflow occurs, contrast meets WCAG AA (`>= 4.5:1` body, `>= 3:1` large text/focus), and reduced-motion stops ambient motion.

## 4. Integration Verification and Audit

- [ ] 4.1 Run `bun run typecheck` and `bun run build` cleanly, then verify all scenarios from `specs/chronos-landing/spec.md` and `specs/clock-wheel-selector/spec.md` in a running browser across both Dark Celestial and Warm Parchment themes, keyboard-only navigation, and mobile breakpoints.
- [ ] 4.2 Run the antislop Mode 2 (After) audit against the built UI and generate `anti-slop/audit-001-YYYY-MM-DD.md` plus the Delivery Gate check once implementation is complete, then run `openspec validate init-chronos-landing --strict` and confirm zero errors or warnings.

## Workflow follow-up

- Archive `init-chronos-landing` with `/opsx-archive` once implementation and user review are complete.
- Re-verify the archived main specs under `openspec/specs/`.
