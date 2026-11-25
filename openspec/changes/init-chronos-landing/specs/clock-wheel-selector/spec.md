# Spec Delta

## Purpose

Defines the right-edge-protruding horological clock dial and its Ferris-wheel-style scroll-rotatable selector for ten CPU scheduling algorithms on the ChronOS landing page.

## ADDED Requirements

### Requirement: Right-side protruding horological clock dial
The landing page SHALL render an oversized horological clock dial on the right side of the desktop layout that visually extends beyond the right edge of the viewport so only its interactive arc and face project into the canvas, styled consistently with the active Dark Celestial or Warm Parchment theme.

#### Scenario: Clock geometry on desktop viewport
- **WHEN** the landing page renders on a desktop screen
- **THEN** a large circular clock assembly with Roman numerals, astrolabe/gear rings, and ornate clock hands is anchored on the right side and protrudes off the right viewport edge
- **AND** the page itself does not introduce horizontal scrollbars due to the protruding clock

### Requirement: Ten CPU scheduling algorithms arranged around the clock wheel
The clock dial SHALL expose ten CPU scheduling algorithms as selectable stations around the wheel, each maintaining an upright readable label orientation as the wheel rotates in Ferris-wheel fashion.

#### Scenario: All ten algorithms are reachable and upright
- **WHEN** the user rotates through a full revolution of the clock wheel
- **THEN** all ten algorithms appear sequentially along the visible arc with upright, non-overlapping labels: `First Come First Serve`, `Shortest Job First`, `Shortest Remaining Time`, `Priority Scheduling`, `Round Robin`, `Longest Job First`, `Highest Response Ratio Next`, `Multilevel Queue Scheduling`, `Multilevel Feedback Queue Scheduling`, and `Longest Remaining Time First`

### Requirement: Scroll-driven Ferris-wheel rotation
Scrolling downward (via mouse wheel, trackpad scroll, or vertical touch swipe on the wheel) SHALL rotate the clock dial to bring subsequent algorithms into the active focal position (e.g. the 9-o'clock pointer), and scrolling upward SHALL rotate in the opposite direction to revisit earlier algorithms, wrapping continuously around the circle.

#### Scenario: Scrolling down rotates to subsequent algorithms
- **WHEN** the user scrolls down over the clock wheel (or landing canvas)
- **THEN** the clock dial and its algorithm stations rotate smoothly in Ferris-wheel fashion so the next algorithm advances into the active focal position

#### Scenario: Scrolling up rotates in reverse
- **WHEN** the user scrolls up
- **THEN** the clock dial rotates in the opposite direction to bring the previous algorithm into the active focal position

### Requirement: Hover, click, and keyboard selection without simulation or navigation
Each algorithm option on the wheel SHALL support hover feedback, click selection, and keyboard navigation (`Tab` into the wheel control, `ArrowUp`/`ArrowDown` or `ArrowLeft`/`ArrowRight` to step through options, `Enter`/`Space` to activate). Selecting or clicking an option SHALL keep the user on the landing page without launching a simulation, collecting process inputs, changing the URL, or issuing backend requests.

#### Scenario: Hovering an algorithm option
- **WHEN** the user moves the pointer over a visible algorithm option on the clock dial
- **THEN** that option displays a clear hover highlight and pointer cursor distinct from inactive options

#### Scenario: Clicking an algorithm option
- **WHEN** the user clicks an algorithm option on the clock dial
- **THEN** the wheel focuses/highlights that algorithm as the active choice on the clock dial without changing the height or position of the left-side brand title
- **AND** no navigation, simulation start, form display, or network request occurs

#### Scenario: Keyboard operation of the clock wheel
- **WHEN** a keyboard user tabs to the algorithm wheel and presses `ArrowDown` or `ArrowUp`
- **THEN** the active algorithm advances or steps back around the wheel, rotating the dial accordingly, with a clearly visible focus indicator and screen-reader-accessible label
