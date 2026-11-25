import { useEffect, useRef, useState, type ReactNode } from "react";
import { secondaryButtonClass } from "./styles";

interface ToastProps {
  kind: "error" | "success";
  title: string;
  message: string;
  onDismiss: () => void;
  /** Close automatically after this many ms. Leave out to keep the toast until it is dismissed. */
  autoDismissMs?: number;
}

/**
 * A single notification card. Render it inside <ToastViewport> and give it a new `key`
 * for each new message so screen readers announce it again.
 */
export function Toast({ kind, title, message, onDismiss, autoDismissMs }: ToastProps) {
  const [paused, setPaused] = useState(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // The timer stops while the toast is hovered or focused, so it never vanishes mid-read.
  useEffect(() => {
    if (autoDismissMs === undefined || paused) return;
    const timer = window.setTimeout(() => onDismissRef.current(), autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [autoDismissMs, paused]);

  const isError = kind === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`toast-enter pointer-events-auto flex w-full items-start gap-3 rounded-lg bg-[var(--bg-elevated)] p-4 text-ink shadow-[0_12px_32px_rgba(0,0,0,0.28)] ${
        isError ? "border-2 border-accent" : "border border-station-border"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onDismiss();
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="m-0 font-display font-semibold">{title}</p>
        <p className="m-0 mt-1 text-[0.9rem] text-muted">{message}</p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className={`${secondaryButtonClass} w-11 shrink-0 px-0 md:w-9`}
        onClick={onDismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

interface ToastViewportProps {
  children: ReactNode;
}

/**
 * Fixed slot for toasts: full width along the top on phones (so it never covers the form's
 * bottom actions), bottom-right from md up. --toast-from sets which edge they slide in from.
 */
export function ToastViewport({ children }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-end gap-2 [--toast-from:-0.75rem] md:inset-x-auto md:top-auto md:right-8 md:bottom-8 md:w-[26rem] md:[--toast-from:0.75rem]">
      {children}
    </div>
  );
}
