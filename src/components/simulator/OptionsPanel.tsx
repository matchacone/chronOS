import { SCHEDULING_ALGORITHMS, type AlgorithmId } from "../../algorithms";
import { fieldClass, fieldLabelClass, panelClass, panelTitleClass } from "../styles";

interface OptionsPanelProps {
  algorithm: AlgorithmId;
  onAlgorithmChange: (algorithm: AlgorithmId) => void;

  showPriority: boolean;
  priorityRequired: boolean;
  onPriorityChange: (checked: boolean) => void;

  showTimeQuantum: boolean;
  timeQuantum: string;
  timeQuantumInvalid: boolean;
  onTimeQuantumChange: (value: string) => void;
}

export function OptionsPanel({
  algorithm,
  onAlgorithmChange,
  showPriority,
  priorityRequired,
  onPriorityChange,
  showTimeQuantum,
  timeQuantum,
  timeQuantumInvalid,
  onTimeQuantumChange,
}: OptionsPanelProps) {
  return (
    <fieldset className={panelClass}>
      <legend className={panelTitleClass}>Options</legend>

      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end md:gap-x-8">
        <div className="flex flex-col gap-1.5 md:w-80">
          <label htmlFor="algorithm" className={fieldLabelClass}>
            Algorithm
          </label>
          <select
            id="algorithm"
            className={fieldClass}
            value={algorithm}
            onChange={(event) => onAlgorithmChange(event.target.value as AlgorithmId)}
          >
            {SCHEDULING_ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        <label className="inline-flex min-h-11 w-fit flex-wrap items-center gap-x-2 md:min-h-9">
          <input
            type="checkbox"
            className="h-5 w-5 accent-[var(--accent)]"
            checked={showPriority}
            disabled={priorityRequired}
            onChange={(event) => onPriorityChange(event.target.checked)}
          />
          Include Priority
          {priorityRequired && (
            <span className="text-[0.8125rem] text-muted">(required for Priority Scheduling)</span>
          )}
        </label>

        {showTimeQuantum && (
          <div className="flex flex-col gap-1.5 md:w-36">
            <label htmlFor="time-quantum" className={fieldLabelClass}>
              Time Quantum
            </label>
            <input
              id="time-quantum"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              className={fieldClass}
              value={timeQuantum}
              aria-invalid={timeQuantumInvalid}
              onChange={(event) => onTimeQuantumChange(event.target.value)}
            />
          </div>
        )}
      </div>
    </fieldset>
  );
}
