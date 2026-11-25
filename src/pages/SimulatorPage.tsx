import { useEffect } from "react";
import { OptionsPanel } from "../components/simulator/OptionsPanel";
import { ProcessPanel } from "../components/simulator/ProcessPanel";
import { SimulatorHeader } from "../components/simulator/SimulatorHeader";
import { Toast, ToastViewport } from "../components/Toast";
import { useSimulationForm } from "../simulator/useSimulationForm";
import { TIME_QUANTUM_FIELD } from "../simulator/validation";
import { useTheme } from "../theme";
import "../index.css";

export function SimulatorPage() {
  const [theme, toggleTheme] = useTheme();
  const form = useSimulationForm();

  useEffect(() => {
    document.title = "Create scheduling simulation | ChronOS";
  }, []);

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-canvas text-ink transition-colors duration-250">
      <div className="celestial-sky pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      <SimulatorHeader theme={theme} onToggleTheme={toggleTheme} />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-[clamp(1rem,4vw,4.5rem)] pt-6 pb-12 md:pb-36">
        <h1 className="m-0 mb-6 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-bold tracking-[-0.01em]">
          Create scheduling simulation
        </h1>

        <form onSubmit={form.submit} noValidate className="flex flex-col gap-5">
          <OptionsPanel
            algorithm={form.algorithm}
            onAlgorithmChange={form.setAlgorithm}
            showPriority={form.showPriority}
            priorityRequired={form.priorityRequired}
            onPriorityChange={form.setPriorityChecked}
            showTimeQuantum={form.needsTimeQuantum}
            timeQuantum={form.timeQuantum}
            timeQuantumInvalid={form.invalidFields.has(TIME_QUANTUM_FIELD)}
            onTimeQuantumChange={form.setTimeQuantum}
          />

          <ProcessPanel
            rows={form.rows}
            showPriority={form.showPriority}
            invalidFields={form.invalidFields}
            canAddRow={form.canAddRow}
            canRemoveRow={form.canRemoveRow}
            onAddRow={form.addRow}
            onRemoveRow={form.removeRow}
            onUpdateRow={form.updateRow}
          />
        </form>
      </main>

      <ToastViewport>
        {/* No autoDismissMs: the error stays until dismissed, since the highlighted fields still need fixing. */}
        {form.error && (
          <Toast
            key={form.error.id}
            kind="error"
            title={form.error.title}
            message={form.error.message}
            onDismiss={form.dismissError}
          />
        )}
      </ToastViewport>
    </div>
  );
}
