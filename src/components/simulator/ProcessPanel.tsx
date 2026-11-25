import { MAX_PROCESSES, type ProcessField, type ProcessRow } from "../../simulator/types";
import { processFieldId } from "../../simulator/validation";
import { panelClass, panelTitleClass, primaryButtonClass, secondaryButtonClass } from "../styles";
import { ProcessTableRow } from "./ProcessTableRow";

interface ProcessPanelProps {
  rows: ProcessRow[];
  showPriority: boolean;
  invalidFields: Set<string>;
  canAddRow: boolean;
  canRemoveRow: boolean;
  onAddRow: () => void;
  onRemoveRow: (key: number) => void;
  onUpdateRow: (key: number, field: ProcessField, value: string) => void;
}

const headCellClass = "px-2 pb-2 text-[0.8125rem] font-semibold text-muted md:whitespace-nowrap";

/** The process table, plus the Add Process and Run Simulation buttons under it. */
export function ProcessPanel({
  rows,
  showPriority,
  invalidFields,
  canAddRow,
  canRemoveRow,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}: ProcessPanelProps) {
  return (
    <fieldset className={`${panelClass} min-w-0`}>
      <legend className={panelTitleClass}>Processes</legend>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-rule">
              <th scope="col" className={`${headCellClass} w-14`}>Process</th>
              <th scope="col" className={headCellClass}>Arrival Time</th>
              <th scope="col" className={headCellClass}>Burst Time</th>
              {showPriority && <th scope="col" className={headCellClass}>Priority</th>}
              <th scope="col" className={`${headCellClass} w-12`}>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <ProcessTableRow
                key={row.key}
                row={row}
                name={`P${index + 1}`}
                showPriority={showPriority}
                canRemove={canRemoveRow}
                isInvalid={(field) => invalidFields.has(processFieldId(row.key, field))}
                onChange={(field, value) => onUpdateRow(row.key, field, value)}
                onRemove={() => onRemoveRow(row.key)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" className={secondaryButtonClass} disabled={!canAddRow} onClick={onAddRow}>
            + Add Process
          </button>
          <span className="text-[0.8125rem] text-muted">
            {rows.length} / {MAX_PROCESSES}
          </span>
        </div>

        <button type="submit" className={primaryButtonClass}>
          Run Simulation
        </button>
      </div>
    </fieldset>
  );
}
