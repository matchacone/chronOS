interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

/**
 * Icon-only toggle between Dark Celestial Clockwork and Warm Parchment Clockwork themes.
 */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-full border border-station-border bg-station p-0 text-ink transition-[border-color,background-color,transform] duration-200 hover:border-station-hover-border hover:bg-station-hover active:translate-y-px"
      onClick={onToggle}
      aria-pressed={!isDark}
      aria-label={
        isDark
          ? "Switch to Warm Parchment light theme"
          : "Switch to Dark Celestial theme"
      }
      title={isDark ? "Switch to Warm Parchment" : "Switch to Dark Celestial"}
    >
      <span className="theme-toggle-glyph inline-flex text-accent" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
