# Proposal

## Why

The project currently displays the default Bun + React API tester instead of an interface for CPU scheduling education. ChronOS needs a distinctive horological and celestial-clockwork landing page so users immediately recognize the product and can browse and select from ten CPU scheduling algorithms on an interactive clock dial before simulation views are built.

## What Changes

- Replace the starter landing view with the ChronOS landing page built on the existing React 19 + Bun setup.
- Present a split composition: the left side displays the `ChronOS` title and `Scheduling Algorithms` subtext; the right side features an oversized horological clock dial protruding from the right viewport edge.
- Implement a Ferris-wheel-style algorithm selector around the clock dial where scrolling down rotates the dial to cycle through ten CPU scheduling algorithms:
  1. First Come First Serve (FCFS)
  2. Shortest Job First (SJF)
  3. Shortest Remaining Time (SRT)
  4. Priority Scheduling
  5. Round Robin (RR)
  6. Longest Job First (LJF)
  7. Highest Response Ratio Next (HRRN)
  8. Multilevel Queue Scheduling (MLQ)
  9. Multilevel Feedback Queue Scheduling (MLFQ)
  10. Longest Remaining Time First (LRTF)
- Support hover and click interactions on the clock options (highlighting/focusing the option on the dial) without launching a simulation, collecting process inputs, navigating away, or making backend calls.
- Ship two complete visual themes matching the project's horological reference direction: a **Dark Celestial Clockwork** default (deep midnight/obsidian sky, starfield, antique gold/brass Roman-numeral astrolabe rings) and a **Warm Parchment Clockwork** light mode (ivory dial, sepia/bronze interlocking gears, Roman numerals), switched via an accessible theme toggle.
- Update document title, description, and favicon metadata for ChronOS.
- Replace the previously drafted, unstarted terminal-themed `add-chrono-os-frontend` proposal with this change.
- Out of scope for this change: process input forms, CPU scheduling execution/simulation, Gantt charts, metrics, persistence, routing, and backend API changes.

## Capabilities

### New Capabilities

- `chronos-landing`: The ChronOS landing page shell, brand presentation (`ChronOS` / `Scheduling Algorithms`), Dark Celestial default theme with Warm Parchment light-mode toggle, responsive layout, and metadata.
- `clock-wheel-selector`: The right-edge-protruding horological clock dial and Ferris-wheel-style scroll-rotatable selector exposing the ten CPU scheduling algorithms with hover, click, and keyboard support in a selection-only landing state.

### Modified Capabilities

_None. No existing specs exist in the repository._

## Impact

- `src/App.tsx`, `src/index.css`, and `src/index.html` are updated/replaced for the ChronOS landing page, dual-theme styling, and metadata.
- New frontend modules are added under `src/` for algorithm data, the Ferris-wheel clock dial component, horological SVG artwork/gears, and theme state.
- The starter `APITester` component is removed from the rendered page (may remain unimported on disk or be cleaned up without touching backend routes in `src/index.ts`).
- `src/index.ts` server routes remain unchanged; no new runtime dependencies or backend changes are required.
