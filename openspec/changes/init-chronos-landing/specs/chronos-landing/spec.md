# Spec Delta

## Purpose

Defines the ChronOS landing page shell, left-side brand identity, dual horological themes (Dark Celestial default and Warm Parchment light mode), responsive layout, and document metadata.

## ADDED Requirements

### Requirement: ChronOS brand presentation on the landing page
The landing page SHALL display the website title `ChronOS` and the subtext `Scheduling Algorithms` on the left side of the desktop viewport, replacing the starter API tester interface.

#### Scenario: Initial page render on desktop
- **WHEN** a user opens the application at desktop width
- **THEN** the left region displays `ChronOS` as the primary heading (`h1`) and `Scheduling Algorithms` directly beneath it
- **AND** the starter API tester controls and logos are not rendered

#### Scenario: Page metadata identifies ChronOS
- **WHEN** the document loads in a browser
- **THEN** the document title identifies `ChronOS` and CPU scheduling algorithms, the HTML root declares `lang="en"`, and the document includes a non-empty meta description and horological favicon

### Requirement: Dual horological themes with a working theme toggle
The landing page SHALL default to the Dark Celestial Clockwork theme (deep midnight/obsidian sky, subtle starfield, and antique gold/brass dial accents) and SHALL provide an accessible toggle to switch to the Warm Parchment Clockwork light theme (warm ivory/parchment dial surface with sepia/bronze ink and mechanical gear accents) and back.

#### Scenario: Default theme on load
- **WHEN** a user visits the landing page for the first time
- **THEN** the page renders in the Dark Celestial Clockwork theme with high-contrast ivory/gold text against the dark sky canvas

#### Scenario: Switching to Warm Parchment light mode
- **WHEN** the user activates the theme toggle control (by mouse, touch, or keyboard)
- **THEN** the entire page, including the left brand panel, active indicator, and right-side clock dial, switches to the Warm Parchment Clockwork palette while preserving legible WCAG AA text contrast
- **AND** activating the toggle again restores the Dark Celestial Clockwork theme

### Requirement: Responsive layout across desktop, tablet, and mobile viewports
The landing page SHALL adapt cleanly from wide desktop screens down to 320px mobile viewports without horizontal page scrolling, clipped text, or overlapping controls.

#### Scenario: Mobile and narrow viewport layout
- **WHEN** the viewport width narrows below the desktop split threshold (down to 320px)
- **THEN** the `ChronOS` title and `Scheduling Algorithms` subtext stack cleanly with the clock dial remaining usable and readable
- **AND** the page exhibits zero horizontal overflow and all interactive controls meet minimum 44x44px touch-target sizing

### Requirement: Reduced-motion support
The landing page SHALL respect the user's `prefers-reduced-motion: reduce` setting by suppressing non-essential ambient motion while keeping all content, state changes, and selection interactions functional.

#### Scenario: Reduced motion enabled
- **WHEN** `prefers-reduced-motion: reduce` is active in the browser or OS
- **THEN** ambient background or decorative gear/star animations are disabled or paused, and rotating or selecting algorithms updates immediately without motion discomfort
