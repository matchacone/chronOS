import { useRef, useState, type WheelEvent as ReactWheelEvent } from "react";
import { SCHEDULING_ALGORITHMS } from "./algorithms";
import { ClockWheelSelector } from "./components/ClockWheelSelector";
import { CreateSimulationLink } from "./components/CreateSimulationLink";
import { ThemeToggle } from "./components/ThemeToggle";
import { useTheme } from "./theme";
import "./index.css";

export function App() {
  const [theme, toggleTheme] = useTheme();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const wheelDeltaRef = useRef<((deltaY: number) => void) | null>(null);

  const activeAlgorithm = SCHEDULING_ALGORITHMS[activeIndex] ?? SCHEDULING_ALGORITHMS[0]!;

  const handleCanvasWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    if (wheelDeltaRef.current) {
      event.preventDefault();
      wheelDeltaRef.current(event.deltaY);
    }
  };

  return (
    <div
      className="landing-shell relative flex min-h-svh w-full flex-col overflow-hidden bg-canvas text-ink transition-colors duration-250"
      onWheel={handleCanvasWheel}
    >
      <div className="celestial-sky pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <header className="site-header relative z-20 flex items-center justify-end px-[clamp(1rem,4vw,4.5rem)] pt-[clamp(1rem,2.5vw,2rem)]">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <main className="landing-main relative z-10 grid w-full flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr] items-end gap-6 px-[clamp(1rem,4vw,2rem)] min-[960px]:grid-cols-[minmax(280px,44%)_minmax(0,1fr)] min-[960px]:grid-rows-none min-[960px]:items-center min-[960px]:gap-0 min-[960px]:pl-[clamp(1.25rem,5vw,4.5rem)] min-[960px]:pr-0 max-[1180px]:min-[960px]:grid-cols-[minmax(260px,40%)_minmax(0,1fr)]">
        <section
          className="brand-column relative z-15 flex max-w-full min-w-0 flex-col gap-5 self-start pt-2 min-[960px]:max-w-[34rem] min-[960px]:gap-7 min-[960px]:pt-[clamp(2rem,8vh,5.5rem)] min-[960px]:pb-8"
          aria-labelledby="chronos-title"
        >
          <div className="mt-25 brand-lockup flex flex-col gap-2">
            <h1
              id="chronos-title"
              className="brand-title m-0 font-display text-[clamp(2.5rem,11vw,4rem)] leading-[0.96] font-bold tracking-[-0.02em] text-ink min-[960px]:text-[clamp(3.25rem,6.8vw,6.25rem)]"
            >
              Chron<span className="brand-title-accent text-accent">OS</span>
            </h1>
            <p className="brand-subtitle m-0 font-display text-[clamp(1.15rem,1.9vw,1.65rem)] font-medium tracking-[0.04em] text-muted">
              Scheduling Algorithms
            </p>
          </div>

          <div
            className="selection-readout flex min-h-[8.5rem] flex-col gap-[0.45rem] border-t border-rule pt-3.5 min-[960px]:min-h-[8.75rem] min-[960px]:pt-5"
            aria-live="polite"
          >
            <div className="selection-meta-row flex flex-wrap items-center gap-[0.65rem] text-[0.8125rem] text-muted">
              <span className="selection-roman min-w-[2.2ch] font-display font-bold text-accent">
                {activeAlgorithm.roman}
              </span>
              <span className="selection-kind font-semibold text-muted">
                {activeAlgorithm.preemptive}
              </span>
            </div>
            <p className="selection-name m-0 font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.25] font-semibold text-ink">
              {activeAlgorithm.name}
            </p>
            <p className="selection-summary m-0 max-w-[44ch] text-[0.95rem] text-muted">
              {activeAlgorithm.summary}
            </p>
          </div>

          <CreateSimulationLink algorithmId={activeAlgorithm.id} />
        </section>

        <ClockWheelSelector
          activeIndex={activeIndex}
          onSelectIndex={setActiveIndex}
          wheelDeltaRef={wheelDeltaRef}
        />
      </main>
    </div>
  );
}

export default App;
