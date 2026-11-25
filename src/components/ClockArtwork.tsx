import { memo } from "react";

interface ClockArtworkProps {
  rotationDeg: number;
  focalAngleDeg: number;
}

const ROMAN_NUMERALS = [
  "XII",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
] as const;

const DEGREE_TICKS = Array.from({ length: 60 }, (_, index) => index);

/**
 * Generates an SVG path string for a mechanical clockwork gear centered at (cx, cy).
 */
function buildGearPath(
  cx: number,
  cy: number,
  outerRadius: number,
  rootRadius: number,
  teeth: number,
): string {
  const step = (Math.PI * 2) / teeth;
  const segments: string[] = [];

  for (let i = 0; i < teeth; i += 1) {
    const a0 = i * step;
    const a1 = a0 + step * 0.18;
    const a2 = a0 + step * 0.34;
    const a3 = a0 + step * 0.66;
    const a4 = a0 + step * 0.82;

    const p0x = cx + rootRadius * Math.cos(a0);
    const p0y = cy + rootRadius * Math.sin(a0);
    const p1x = cx + outerRadius * Math.cos(a1);
    const p1y = cy + outerRadius * Math.sin(a1);
    const p2x = cx + outerRadius * Math.cos(a2);
    const p2y = cy + outerRadius * Math.sin(a2);
    const p3x = cx + outerRadius * Math.cos(a3);
    const p3y = cy + outerRadius * Math.sin(a3);
    const p4x = cx + rootRadius * Math.cos(a4);
    const p4y = cy + rootRadius * Math.sin(a4);

    segments.push(
      `${i === 0 ? "M" : "L"}${p0x.toFixed(1)},${p0y.toFixed(1)}`,
      `L${p1x.toFixed(1)},${p1y.toFixed(1)}`,
      `L${p2x.toFixed(1)},${p2y.toFixed(1)}`,
      `L${p3x.toFixed(1)},${p3y.toFixed(1)}`,
      `L${p4x.toFixed(1)},${p4y.toFixed(1)}`,
    );
  }

  segments.push("Z");
  return segments.join(" ");
}

const OUTER_RING_GEAR = buildGearPath(400, 400, 314, 298, 48);
const UPPER_SUB_GEAR = buildGearPath(0, 0, 96, 82, 18);
const LOWER_SUB_GEAR = buildGearPath(0, 0, 74, 62, 14);
const CENTER_ESC_GEAR = buildGearPath(0, 0, 48, 39, 12);

/**
 * Renders the theme-aware horological astrolabe and mechanical gear assembly.
 */
export const ClockArtwork = memo(function ClockArtwork({
  rotationDeg,
  focalAngleDeg,
}: ClockArtworkProps) {
  const bezelRotation = rotationDeg * 0.35;
  const upperGearRotation = -rotationDeg * 0.9;
  const lowerGearRotation = rotationDeg * 1.25;
  const centerGearRotation = -rotationDeg * 1.5;
  const selectorHandRotation = focalAngleDeg + 90;
  const sweepHandRotation = rotationDeg + focalAngleDeg + 90;

  return (
    <svg
      className="clock-svg block h-full w-full overflow-visible"
      viewBox="0 0 800 800"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="clock-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--dial-glow-core)" />
          <stop offset="55%" stopColor="var(--dial-glow-mid)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="brass-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--dial-brass-bright)" />
          <stop offset="50%" stopColor="var(--dial-brass)" />
          <stop offset="100%" stopColor="var(--dial-brass-dim)" />
        </linearGradient>
      </defs>

      {/* Single focal dial illumination */}
      <circle cx="400" cy="400" r="370" fill="url(#clock-hub-glow)" />

      {/* Base dial plate */}
      <circle
        cx="400"
        cy="400"
        r="376"
        fill="var(--dial-surface)"
        fillOpacity="0.92"
        stroke="url(#brass-stroke)"
        strokeWidth="2.5"
      />
      <circle
        cx="400"
        cy="400"
        r="364"
        fill="none"
        stroke="var(--dial-brass-dim)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* Epicyclic mechanical gears behind astrolabe rings */}
      <g
        transform={`translate(285 268) rotate(${upperGearRotation.toFixed(2)})`}
        className="clock-gear-layer"
      >
        <path
          d={UPPER_SUB_GEAR}
          fill="var(--dial-gear-fill)"
          stroke="var(--dial-gear-stroke)"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="54"
          fill="none"
          stroke="var(--dial-gear-stroke)"
          strokeWidth="1.5"
        />
        <line x1="-54" y1="0" x2="54" y2="0" stroke="var(--dial-gear-stroke)" strokeWidth="2" />
        <line x1="0" y1="-54" x2="0" y2="54" stroke="var(--dial-gear-stroke)" strokeWidth="2" />
        <circle cx="0" cy="0" r="12" fill="var(--dial-surface)" stroke="var(--dial-gear-stroke)" strokeWidth="2" />
      </g>

      <g
        transform={`translate(495 512) rotate(${lowerGearRotation.toFixed(2)})`}
        className="clock-gear-layer"
      >
        <path
          d={LOWER_SUB_GEAR}
          fill="var(--dial-gear-fill)"
          stroke="var(--dial-gear-stroke)"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="38"
          fill="none"
          stroke="var(--dial-gear-stroke)"
          strokeWidth="1.5"
        />
        <line x1="-38" y1="0" x2="38" y2="0" stroke="var(--dial-gear-stroke)" strokeWidth="1.5" />
        <line x1="0" y1="-38" x2="0" y2="38" stroke="var(--dial-gear-stroke)" strokeWidth="1.5" />
      </g>

      {/* Main rotating Roman-numeral bezel & toothed ring */}
      <g transform={`rotate(${bezelRotation.toFixed(2)} 400 400)`}>
        <path
          d={OUTER_RING_GEAR}
          fill="none"
          stroke="var(--dial-brass-dim)"
          strokeOpacity="0.6"
          strokeWidth="1.25"
        />
        <circle
          cx="400"
          cy="400"
          r="282"
          fill="none"
          stroke="url(#brass-stroke)"
          strokeWidth="1.5"
        />

        {DEGREE_TICKS.map((tick) => {
          const angle = tick * 6;
          const isMajor = tick % 5 === 0;
          const y1 = isMajor ? 28 : 34;
          return (
            <line
              key={tick}
              x1="400"
              y1={y1}
              x2="400"
              y2="46"
              stroke="var(--dial-brass)"
              strokeOpacity={isMajor ? 0.9 : 0.4}
              strokeWidth={isMajor ? 1.8 : 1}
              transform={`rotate(${angle} 400 400)`}
            />
          );
        })}

        {ROMAN_NUMERALS.map((numeral, index) => {
          const angle = index * 30;
          return (
            <text
              key={numeral}
              x="400"
              y="88"
              textAnchor="middle"
              dominantBaseline="central"
              className="clock-roman"
              transform={`rotate(${angle} 400 400)`}
            >
              {numeral}
            </text>
          );
        })}
      </g>

      {/* Astrolabe orbital rings & compass rose */}
      <g transform={`rotate(${(rotationDeg * 0.6).toFixed(2)} 400 400)`}>
        <circle
          cx="400"
          cy="400"
          r="214"
          fill="none"
          stroke="var(--dial-brass)"
          strokeOpacity="0.45"
          strokeWidth="1.2"
          strokeDasharray="10 6"
        />
        <circle
          cx="400"
          cy="380"
          r="156"
          fill="none"
          stroke="var(--dial-brass)"
          strokeOpacity="0.32"
          strokeWidth="1"
        />
        <circle
          cx="400"
          cy="400"
          r="128"
          fill="none"
          stroke="url(#brass-stroke)"
          strokeOpacity="0.7"
          strokeWidth="1.25"
        />

        {/* Compass rose points */}
        <path
          d="M400 264 L413 387 L536 400 L413 413 L400 536 L387 413 L264 400 L387 387 Z"
          fill="var(--dial-gear-fill)"
          stroke="var(--dial-brass)"
          strokeOpacity="0.75"
          strokeWidth="1.2"
        />
        <path
          d="M326 326 L400 385 L474 326 L415 400 L474 474 L400 415 L326 474 L385 400 Z"
          fill="none"
          stroke="var(--dial-brass-dim)"
          strokeOpacity="0.65"
          strokeWidth="1"
        />
      </g>

      {/* Center escapement gear */}
      <g transform={`translate(400 400) rotate(${centerGearRotation.toFixed(2)})`}>
        <path
          d={CENTER_ESC_GEAR}
          fill="var(--dial-surface)"
          stroke="url(#brass-stroke)"
          strokeWidth="1.5"
        />
      </g>

      {/* Sweeping mechanical hour hand */}
      <g transform={`rotate(${sweepHandRotation.toFixed(2)} 400 400)`}>
        <path
          d="M400 442 L393 404 L396 276 L400 226 L404 276 L407 404 Z"
          fill="var(--dial-brass-dim)"
          stroke="var(--dial-brass-bright)"
          strokeWidth="1"
        />
        <circle cx="400" cy="272" r="7" fill="var(--dial-surface)" stroke="var(--dial-brass-bright)" strokeWidth="1.5" />
      </g>

      {/* Ornate selector hand anchored toward active focal station */}
      <g transform={`rotate(${selectorHandRotation.toFixed(2)} 400 400)`}>
        <path
          d="M400 462 L394 400 L397 154 L400 108 L403 154 L406 400 Z"
          fill="url(#brass-stroke)"
          stroke="var(--dial-ink-contrast)"
          strokeWidth="0.75"
        />
        <circle cx="400" cy="184" r="9" fill="var(--dial-surface)" stroke="var(--dial-brass-bright)" strokeWidth="1.75" />
        <circle cx="400" cy="450" r="6" fill="var(--dial-brass)" />
      </g>

      {/* Center jewel / pivot */}
      <circle cx="400" cy="400" r="14" fill="var(--dial-surface)" stroke="var(--dial-brass-bright)" strokeWidth="2.5" />
      <circle cx="400" cy="400" r="5" fill="var(--dial-brass-bright)" />
    </svg>
  );
});
