import type { ThemeMode } from "../../theme";
import { ThemeToggle } from "../ThemeToggle";

interface SimulatorHeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function SimulatorHeader({ theme, onToggleTheme }: SimulatorHeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4 px-[clamp(1rem,4vw,4.5rem)] pt-[clamp(1rem,2.5vw,2rem)]">
      <a
        href="/"
        aria-label="Back to ChronOS home"
        className="inline-flex min-h-11 items-center font-display text-2xl font-bold tracking-[-0.02em] text-ink decoration-1 underline-offset-4 hover:underline"
      >
        Chron<span className="text-accent">OS</span>
      </a>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
