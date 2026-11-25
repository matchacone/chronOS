import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { SCHEDULING_ALGORITHMS, type SchedulingAlgorithm } from "../algorithms";
import { ClockArtwork } from "./ClockArtwork";

interface ClockWheelSelectorProps {
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  wheelDeltaRef?: MutableRefObject<((deltaY: number) => void) | null>;
}

const STEP_DEG = 360 / SCHEDULING_ALGORITHMS.length;
const TOTAL = SCHEDULING_ALGORITHMS.length;
const DESKTOP_BREAKPOINT = 960;

function modIndex(index: number): number {
  return ((index % TOTAL) + TOTAL) % TOTAL;
}

function shortestSignedOffset(index: number, centerIndex: number): number {
  let diff = index - centerIndex;
  while (diff > TOTAL / 2) diff -= TOTAL;
  while (diff < -TOTAL / 2) diff += TOTAL;
  return diff;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Ferris-wheel horological clock selector protruding from the right edge (desktop)
 * or bottom arc (mobile/tablet) with upright counter-rotated algorithm stations.
 */
export function ClockWheelSelector({
  activeIndex,
  onSelectIndex,
  wheelDeltaRef,
}: ClockWheelSelectorProps) {
  const [rotationDeg, setRotationDeg] = useState<number>(() => activeIndex * STEP_DEG);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < DESKTOP_BREAKPOINT : false,
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const rotationRef = useRef<number>(rotationDeg);
  const targetDegRef = useRef<number>(rotationDeg);
  const activeIndexRef = useRef<number>(activeIndex);
  const animFrameRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const draggedRef = useRef<boolean>(false);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < DESKTOP_BREAKPOINT);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const syncNearestIndex = useCallback(
    (deg: number) => {
      const snappedSteps = Math.round(deg / STEP_DEG);
      const nextIndex = modIndex(snappedSteps);
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        onSelectIndex(nextIndex);
      }
    },
    [onSelectIndex],
  );

  const animateToTarget = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (prefersReducedMotion()) {
      rotationRef.current = targetDegRef.current;
      setRotationDeg(targetDegRef.current);
      syncNearestIndex(targetDegRef.current);
      return;
    }

    const tick = () => {
      const diff = targetDegRef.current - rotationRef.current;
      if (Math.abs(diff) < 0.08) {
        rotationRef.current = targetDegRef.current;
        setRotationDeg(targetDegRef.current);
        syncNearestIndex(targetDegRef.current);
        animFrameRef.current = null;
        return;
      }

      const next = rotationRef.current + diff * 0.22;
      rotationRef.current = next;
      setRotationDeg(next);
      syncNearestIndex(next);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [syncNearestIndex]);

  const scheduleSnap = useCallback(() => {
    if (snapTimeoutRef.current !== null) {
      window.clearTimeout(snapTimeoutRef.current);
    }
    snapTimeoutRef.current = window.setTimeout(() => {
      const snappedSteps = Math.round(targetDegRef.current / STEP_DEG);
      targetDegRef.current = snappedSteps * STEP_DEG;
      animateToTarget();
    }, 110);
  }, [animateToTarget]);

  const rotateByDelta = useCallback(
    (delta: number) => {
      const clamped = Math.max(-90, Math.min(90, delta * 0.22));
      targetDegRef.current += clamped;
      animateToTarget();
      scheduleSnap();
    },
    [animateToTarget, scheduleSnap],
  );

  useEffect(() => {
    if (wheelDeltaRef) {
      wheelDeltaRef.current = rotateByDelta;
    }
    return () => {
      if (wheelDeltaRef) {
        wheelDeltaRef.current = null;
      }
    };
  }, [rotateByDelta, wheelDeltaRef]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
      if (snapTimeoutRef.current !== null) window.clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  const rotateToIndex = useCallback(
    (index: number) => {
      const normalized = modIndex(index);
      const currentVirtual = Math.round(targetDegRef.current / STEP_DEG);
      const currentMod = modIndex(currentVirtual);
      const offset = shortestSignedOffset(normalized, currentMod);
      targetDegRef.current = (currentVirtual + offset) * STEP_DEG;

      if (snapTimeoutRef.current !== null) {
        window.clearTimeout(snapTimeoutRef.current);
        snapTimeoutRef.current = null;
      }
      onSelectIndex(normalized);
      animateToTarget();
    },
    [animateToTarget, onSelectIndex],
  );

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    rotateByDelta(event.deltaY);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStartYRef.current = event.clientY;
    pointerStartXRef.current = event.clientX;
    draggedRef.current = false;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerStartYRef.current === null || pointerStartXRef.current === null) return;
    const dy = pointerStartYRef.current - event.clientY;
    const dx = pointerStartXRef.current - event.clientX;
    const primaryDelta = isMobile ? dx : dy;
    if (Math.abs(primaryDelta) > 4) {
      draggedRef.current = true;
      pointerStartYRef.current = event.clientY;
      pointerStartXRef.current = event.clientX;
      rotateByDelta(primaryDelta * 1.35);
    }
  };

  const handlePointerEnd = () => {
    pointerStartYRef.current = null;
    pointerStartXRef.current = null;
  };

  const handleOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = modIndex(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = modIndex(index - 1);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = TOTAL - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      rotateToIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
    }
  };

  const focalAngleDeg = isMobile ? 270 : 180;
  const stationRadiusPct = isMobile ? 43 : 46.5;

  return (
    <section
      className="clock-stage relative flex h-auto w-full min-w-0 touch-none flex-col items-center justify-end overflow-hidden pt-16 select-none [--dial-size:min(88vw,520px)] min-[960px]:h-full min-[960px]:min-h-[calc(var(--dial-size)+2rem)] min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-end min-[960px]:overflow-visible min-[960px]:pt-0 min-[960px]:[--dial-size:clamp(460px,min(78vh,56vw),820px)] max-[1180px]:min-[960px]:[--dial-size:clamp(440px,54vw,600px)]"
      aria-label="Scheduling algorithm clock wheel"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div className="clock-assembly relative mb-[calc(var(--dial-size)*-0.44)] h-[var(--dial-size)] w-[var(--dial-size)] shrink-0 translate-x-0 min-[960px]:mb-0 min-[960px]:translate-x-[38%] max-[1180px]:min-[960px]:translate-x-[42%]">
        <ClockArtwork rotationDeg={rotationDeg} focalAngleDeg={focalAngleDeg} />

        {/* Fixed focal pointer marker */}
        <div
          className={`clock-focal-pointer pointer-events-none absolute z-12 -translate-x-1/2 -translate-y-1/2 ${
            isMobile ? "is-top top-[1.5%] left-1/2 rotate-90" : "is-left top-1/2 left-[1.2%]"
          }`}
          aria-hidden="true"
        >
          <span className="clock-focal-needle block h-[2.5px] w-6 rounded-[2px] bg-accent" />
        </div>

        {/* Ferris-wheel algorithm stations */}
        <div
          className="clock-stations absolute inset-0 z-14"
          role="radiogroup"
          aria-label="CPU Scheduling Algorithms"
        >
          {SCHEDULING_ALGORITHMS.map((algo: SchedulingAlgorithm, index: number) => {
            const thetaDeg = focalAngleDeg - index * STEP_DEG + rotationDeg;
            const thetaRad = (thetaDeg * Math.PI) / 180;
            const xPct = 50 + stationRadiusPct * Math.cos(thetaRad);
            const yPct = 50 + stationRadiusPct * Math.sin(thetaRad);

            const normalizedDelta =
              ((((thetaDeg - focalAngleDeg) % 360) + 540) % 360) - 180;
            const absDelta = Math.abs(normalizedDelta);

            const isSelected = index === activeIndex;
            const isHovered = hoveredId === algo.id;
            const isVisibleArc = isMobile ? absDelta <= 76 : absDelta <= 102;
            const visibilityWeight = Math.max(0, 1 - absDelta / (isMobile ? 84 : 112));

            return (
              <div
                key={algo.id}
                className={`clock-station-anchor absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-160 ${
                  isSelected ? "is-selected" : ""
                } ${isHovered ? "is-hovered" : ""} ${
                  isVisibleArc ? "is-visible-arc" : "is-hidden-arc pointer-events-none"
                }`}
                style={{
                  left: `${xPct.toFixed(3)}%`,
                  top: `${yPct.toFixed(3)}%`,
                  opacity: isVisibleArc ? Math.max(0.28, visibilityWeight) : 0,
                }}
              >
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  aria-hidden={!isVisibleArc && !isSelected}
                  className="clock-station-btn group relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center border-0 bg-transparent p-0 text-ink"
                  onClick={() => {
                    if (draggedRef.current) return;
                    rotateToIndex(index);
                  }}
                  onMouseEnter={() => setHoveredId(algo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onKeyDown={(e) => handleOptionKeyDown(e, index)}
                >
                  <span
                    className={`station-pip inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] font-display text-[0.72rem] font-bold transition-[transform,border-color,background-color,color] duration-180 ${
                      isSelected
                        ? "scale-[1.14] border-accent bg-accent text-accent-ink"
                        : isHovered
                          ? "scale-[1.08] border-station-hover-border bg-station text-brass-bright"
                          : "border-station-border bg-station text-brass-bright group-hover:scale-[1.08] group-hover:border-station-hover-border"
                    }`}
                    aria-hidden="true"
                  >
                    <span className="station-roman">{algo.roman}</span>
                  </span>

                  <span
                    className={`station-label-wrap absolute items-center gap-2 rounded-lg border transition-[border-color,background-color,color,transform,box-shadow] duration-180 ${
                      isSelected
                        ? "station-label-selected-shadow z-30 inline-flex border-accent bg-accent font-bold text-accent-ink"
                        : isHovered
                          ? "inline-flex border-station-hover-border bg-station-hover font-medium text-ink"
                          : "border-station-border bg-station font-medium text-ink group-hover:border-station-hover-border group-hover:bg-station-hover"
                    } ${
                      isSelected
                        ? "bottom-[calc(100%+8px)] left-1/2 w-max max-w-[min(260px,calc(100vw-2rem))] -translate-x-1/2 justify-center px-[0.65rem] py-[0.35rem] text-center text-[0.78rem] whitespace-normal min-[960px]:top-1/2 min-[960px]:right-[calc(100%+10px)] min-[960px]:bottom-auto min-[960px]:left-auto min-[960px]:w-auto min-[960px]:max-w-none min-[960px]:translate-x-0 min-[960px]:-translate-y-1/2 min-[960px]:px-[0.85rem] min-[960px]:py-2 min-[960px]:text-left min-[960px]:text-[0.9rem] min-[960px]:whitespace-nowrap max-[1180px]:min-[960px]:px-[0.7rem] max-[1180px]:min-[960px]:py-[0.42rem] max-[1180px]:min-[960px]:text-[0.82rem]"
                        : "hidden min-[960px]:top-1/2 min-[960px]:right-[calc(100%+10px)] min-[960px]:bottom-auto min-[960px]:left-auto min-[960px]:inline-flex min-[960px]:-translate-y-1/2 min-[960px]:px-[0.85rem] min-[960px]:py-2 min-[960px]:text-[0.9rem] min-[960px]:whitespace-nowrap max-[1180px]:min-[960px]:px-[0.7rem] max-[1180px]:min-[960px]:py-[0.42rem] max-[1180px]:min-[960px]:text-[0.82rem]"
                    }`}
                  >
                    <span className="station-name">{algo.name}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
