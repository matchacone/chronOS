# Design

## Context

See `proposal.md` for motivation and `specs/chronos-landing/spec.md` and `specs/clock-wheel-selector/spec.md` for behavior contracts.

The repository uses Bun + React 19 + TypeScript (`src/frontend.tsx` mounts `App` into `#root`; `src/index.ts` serves `src/index.html` and sample `/api/hello` routes; `src/index.css` holds plain CSS with custom properties). There is no router, animation library, icon package, or CSS framework installed, and none are needed.

The visual direction comes from the project's horological reference set:
1. **Dark Celestial Clockwork (Default):** Deep midnight/obsidian cosmic canvas (`#070a12` / `#0c1322`), subtle starfield, concentric antique gold/brass astrolabe rings (`#d8b25c`), Roman numerals, and ornate skeleton hands.
2. **Warm Parchment Clockwork (Light Mode):** Aged ivory/parchment dial (`#f4efe4` / `#e8decb`), deep espresso/sepia ink (`#231a12`), and bronze/brass interlocking gears (`#8a6328`), toggled cleanly from the landing header.

## Goals / Non-Goals

**Goals:**
- Deliver an unmistakable horological ChronOS landing page with `ChronOS` + `Scheduling Algorithms` on the left and a right-edge-protruding Ferris-wheel clock dial on the right.
- Support smooth, responsive Ferris-wheel rotation (mouse wheel, trackpad, touch drag, click-to-focus, and keyboard arrows) across all 10 CPU scheduling algorithms while keeping every option label upright and readable.
- Ship both Dark Celestial (default) and Warm Parchment (light toggle) themes with verified WCAG AA contrast in both modes.
- Keep everything dependency-free in React + TypeScript + inline SVG + CSS custom properties, preserving `src/index.ts` untouched.

**Non-Goals:**
- CPU scheduling simulation, process tables, Gantt charts, metrics, or URL routing.
- Backend API changes or persistence of selected algorithm.
- External web font dependencies that block first paint or fail offline (prefer a refined serif/display + crisp sans/mono system stack with optional non-blocking enhancement or pure local typography).

## Design Read & Aesthetic Rationale (Antislop Alignment)

- **Design Read:** Reading this as an interactive horological landing surface for OS students and learners, in a Celestial Astrolabe / Mechanical Clockwork style, dial **ENERGY 3 / RHYTHM 2 / MOTION 3**.
- **Color Palette (capped per R-29):**
  - *Dark Celestial:* Canvas `#070a12`, Elevated dial surface `#0e1628`, Primary ivory text `#f4efe2`, Muted brass-slate text `#b8b2a2`, Accent antique gold `#deb864`, Accent ink `#130e04`.
  - *Warm Parchment:* Canvas `#f4efe3`, Elevated dial surface `#e9dfcc`, Primary sepia ink `#231a12`, Muted bronze-umber text `#5c4b37`, Accent burnished bronze `#8c5f1b`, Accent ink `#fbf7ee`.
  - Only 1 focal radial illumination behind the clock hub (R-01 / R-13 dose cap); no multi-color neon gradients or card-wide glassmorphism.
- **Typography (R-06):** Editorial serif display (`"Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif` or crisp fallback stack) for `ChronOS` and Roman numerals to evoke horological engravings, paired with clean sans (`system-ui, -apple-system, "Segoe UI", sans-serif`) for `"Scheduling Algorithms"` and readable wheel labels. No large decorative monospace headings or wide-tracked `HOW IT WORKS` headers.
- **Copywriting & Controls (R-02, R-26):** Zero em dashes (`—`) in UI copy. Clicking an algorithm rotates and focuses that option on the clock dial (`// TODO` in code for future simulator routing). Below `ChronOS` and `Scheduling Algorithms`, the left column displays the active algorithm's Roman index, scheduling type, name, and summary in an anchored readout (`position: absolute` on desktop, fixed `min-height` on mobile) so varying text lengths never shift the `ChronOS` title vertically.
- **Header Placement:** An icon-only `ThemeToggle` (`44x44px`, accessible `aria-label` + `aria-pressed`) sits on the top-right of the header across desktop and mobile.
- **No Acronyms or Prev/Next Chrome:** Wheel stations and the active readout display full algorithm names without acronym badges (`FCFS`, `RR`, etc.) and without auxiliary `Prev`/`Next` stepper buttons.

## Decisions

### 1. Ferris-Wheel Clock Geometry & Counter-Rotation Math

The clock dial is rendered inside a clipped right-hand stage (`overflow: hidden` on the right stage or page shell so the viewport never scrolls horizontally).
- On desktop (`>= 960px`), the circular clock has diameter `clamp(640px, 78vh, 960px)` and is centered vertically (`top: 50%`) with its center positioned near or slightly past the right viewport edge (`right: calc(-1 * dialRadius * 0.42)` or equivalent transform), so the left ~58% arc of the clock protrudes cleanly into the right side of the screen.
- Ten algorithm stations are spaced evenly at `step = 360 / 10 = 36deg` around a concentric orbital ring (`stationRadius`).
- The **active focal position** sits at **9 o'clock** (`180deg` in standard trig where `0deg` is 3 o'clock, `90deg` is 6 o'clock, `180deg` is 9 o'clock, `270deg` is 12 o'clock), pointing directly toward the left-side `ChronOS` title area.
- Given a continuous `rotationDeg` state (and `activeIndex` derived from the nearest station to 9 o'clock), station `i` sits at angle:
  - `theta = i * 36 + rotationDeg + 180` (so `i = 0` starts at 9 o'clock when `rotationDeg = 0`).
  - Rather than rotating text labels with the wheel (which turns labels upside down), each station wrapper is positioned at `(cx + R * cos(theta), cy + R * sin(theta))` or rotated by `theta` and counter-rotated by `-theta` (`transform: rotate(theta) translateX(R) rotate(-theta)`), ensuring every algorithm label remains **strictly horizontal and upright** like a Ferris-wheel gondola!
- **Visibility & hierarchy on the arc:** Stations along the visible left arc (`cos(theta) <= 0.25`) are crisp and interactive; stations tucked off the right edge fade smoothly (`opacity` and `pointer-events: none` when off-canvas) so screen readers and keyboard focus only target or cycle cleanly without visual clutter. Wait: for keyboard `ArrowUp`/`ArrowDown` and accessibility, the wheel uses a roving/radio or `listbox` model that updates `rotationDeg` to bring the newly selected `i` smoothly to 9 o'clock, so all 10 items remain reachable by keyboard!
- **Clock Hands & Gears:** Inside the dial SVG, ornate filigree hour/minute hands and concentric Roman-numeral / astrolabe rings rotate proportionally (e.g., minute hand tracks `rotationDeg`, inner gear ring counter-rotates at `-0.5 * rotationDeg`) so scrolling feels mechanically connected to the timepiece.

*Alternatives considered:*
- *CSS 3D cylinder (`rotateX`) picker* — feels like an iOS picker drum rather than a protruding giant face-on clock dial. Rejected in favor of 2D orbital Ferris-wheel trigonometry.
- *Rotating radial text along spokes* — upside-down labels on the lower half hurt readability. Rejected in favor of upright counter-rotated Ferris-wheel stations.

### 2. Scroll, Drag, Click, and Keyboard Interaction Model

- **Wheel / Trackpad Scroll:** Listening to `onWheel` (with `preventDefault()` on the landing viewport when the wheel handles vertical scroll, or listening on the main landing container so scrolling anywhere on the landing screen turns the Ferris wheel!) accumulates `deltaY` into `targetAngle`.
  - Scrolling **down** (`deltaY > 0`) rotates the wheel so subsequent indices (`0 -> 1 -> 2 ...`) advance into the 9-o'clock pointer.
  - Scrolling **up** (`deltaY < 0`) reverses rotation.
  - A gentle settle/snap (via `requestAnimationFrame` interpolation or debounced snap-to-nearest-`36deg` after scroll stops) aligns the closest algorithm cleanly to the 9-o'clock pointer while preserving continuous multi-step scrolling.
- **Touch / Pointer Drag:** On touch screens and mobile, vertical swipe/drag on the dial maps `deltaY` to wheel rotation and snaps to the nearest station on release.
- **Hover & Click:** Hovering any visible station highlights its dial marker and label (`cursor: pointer`). Clicking a visible station calculates the shortest angular delta to bring that station to 9 o'clock, rotates to it, and marks it as the active focused algorithm (updating the quiet readout on the left with the algorithm's full name, abbreviation, and `"Simulator coming soon"` badge/note, with a `// TODO` comment for future simulator routing).
- **Keyboard:** A semantic `role="radiogroup"` (or native radio inputs synced with `activeIndex`) on the wheel lets `Tab` focus the active option and `ArrowDown`/`ArrowRight` (next) and `ArrowUp`/`ArrowLeft` (previous) step through all 10 algorithms with wraparound, rotating the wheel to match.

### 3. Component & File Structure

- `src/algorithms.ts` — Typed `AlgorithmId` union and ordered `SCHEDULING_ALGORITHMS` array of all 10 algorithms (`id`, `name`, `roman`).
- `src/components/ClockArtwork.tsx` — Theme-aware inline SVG layers for the horological clockwork: outer Roman-numeral bezel, celestial astrolabe arcs / compass ticks (Dark Celestial), interlocking mechanical cogs (Warm Parchment & Dark Celestial), and ornate filigree hands driven by `rotationDeg`.
- `src/components/ClockWheelSelector.tsx` — The Ferris-wheel orbital selector housing `ClockArtwork` and the 10 upright interactive algorithm stations, handling wheel, touch/drag, click, hover, and keyboard arrow controls.
- `src/components/ThemeToggle.tsx` — Accessible `<button>` toggling `data-theme="dark" | "light"` on `document.documentElement` (defaulting to `"dark"`), positioned at top-right with 44x44px hit target.
- `src/App.tsx` — Landing shell with semantic `<header>` (right-aligned `ThemeToggle`), `<main>`, static left brand region (`<h1>ChronOS</h1>`, subtext `Scheduling Algorithms`, and screen-reader-only `aria-live` announcement), and right `ClockWheelSelector` stage.
- `src/index.css` — CSS custom properties for `[data-theme="dark"]` and `[data-theme="light"]`, responsive layout (desktop split -> tablet -> mobile stacked), focus rings, hover/active states, and `@media (prefers-reduced-motion: reduce)` rules.
- `src/index.html` & `src/favicon.svg` — Updated `<title>ChronOS — Scheduling Algorithms</title>` (wait: avoid em dash if desired, use `ChronOS | Scheduling Algorithms`), meta description, and horological astrolabe favicon.

### 4. Responsive Strategy (Desktop -> Tablet -> 320px Mobile)

- **Desktop (`>= 960px`):** Full-viewport (`min-height: 100svh`, `overflow-x: clip`) two-zone stage. Left zone holds `ChronOS` (`clamp(3rem, 6vw, 5.5rem)`), `Scheduling Algorithms`, and the subtle active selection readout; right zone holds the oversized clock protruding from the right edge.
- **Tablet (`640px – 959px`):** Left brand block shifts higher or narrower (`~42%` width) and clock radius scales down proportionally while still protruding from the right edge so labels never collide with `ChronOS`.
- **Mobile (`< 640px`, down to `320px`):** Stacked layout (`min-height: auto`): compact header with `ChronOS`, `Scheduling Algorithms`, and `ThemeToggle` at the top, followed by a centered/bottom-anchored half-clock or arc Ferris wheel (`44x44px` minimum tap targets on options + Prev/Next accessible step buttons for effortless thumb control alongside touch swipe), with zero horizontal overflow.

### 5. Accessibility & Contrast Verification Plan

- Use native `<button role="radio" aria-checked={isActive}>` inside a `role="radiogroup" aria-label="CPU Scheduling Algorithms"` container (or native radios) so keyboard focus, `Arrow` keys, `Enter`/`Space`, and screen readers work reliably.
- Verify computed foreground/background contrast ratios in **both** Dark Celestial and Warm Parchment themes against WCAG AA (`>= 4.5:1` for normal text, `>= 3:1` for large text and focus outlines).
- Under `@media (prefers-reduced-motion: reduce)`, disable CSS transitions, disable any subtle ambient star twinkle or slow gear idle drift, and snap `rotationDeg` immediately on step/scroll.

## Risks / Trade-offs

- **Scrolling hijacking on future multi-section pages** → Currently the landing page is a single screen (`100svh` on desktop); binding `wheel` on the landing canvas works naturally here. Adding a clear handler boundary on the landing wrapper keeps future scrollable pages unobstructed.
- **Long algorithm names (`Multilevel Feedback Queue Scheduling`) colliding with the clock hub or left title** → Measure max label width (`~22ch` or compact two-line wrap) and keep `stationRadius` large enough with radial clearance on desktop, scaling cleanly on tablet/mobile.
- **SVG complexity hurting frame rate during rapid wheel rotation** → Keep rotating SVG layers as 2–3 GPU-promoted `<g>` transforms (`transform: rotate(...)`, `will-change: transform`) rather than mutating dozens of DOM nodes per frame.
- **Dual-theme contrast drift** → Define explicit semantic tokens (`--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-ink`, `--ring-stroke`, `--focus-ring`) per `[data-theme]` and audit every element in both modes.
