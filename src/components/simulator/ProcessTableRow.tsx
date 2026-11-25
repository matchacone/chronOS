import type { ProcessField, ProcessRow } from "../../simulator/types";
import { fieldClass, secondaryButtonClass } from "../styles";

interface ProcessTableRowProps {
  row: ProcessRow;
  /** Display name, e.g. "P3". */
  name: string;
  showPriority: boolean;
  canRemove: boolean;
  isInvalid: (field: ProcessField) => boolean;
  onChange: (field: ProcessField, value: string) => void;
  onRemove: () => void;
}

export function ProcessTableRow({
  row,
  name,
  showPriority,
  canRemove,
  isInvalid,
  onChange,
  onRemove,
}: ProcessTableRowProps) {
  const numberCell = (field: ProcessField, label: string, min: number) => (
    <td className="px-1 py-1.5 md:px-2">
      <input
        type="number"
        inputMode="numeric"
        min={min}
        step={1}
        aria-label={`${name} ${label}`}
        aria-invalid={isInvalid(field)}
        className={`${fieldClass} min-w-14`}
        value={row[field]}
        onChange={(event) => onChange(field, event.target.value)}
      />
    </td>
  );

  return (
    <tr className="border-b border-rule last:border-b-0">
      <th scope="row" className="px-2 py-1.5 font-display font-bold text-accent">
        {name}
      </th>
      {numberCell("arrival", "arrival time", 0)}
      {numberCell("burst", "burst time", 1)}
      {showPriority && numberCell("priority", "priority", 0)}
      <td className="py-1.5 pl-1 text-right">
        <button
          type="button"
          className={`${secondaryButtonClass} w-11 px-0 md:w-9`}
          aria-label={`Remove ${name}`}
          disabled={!canRemove}
          onClick={onRemove}
        >
          <span aria-hidden="true">×</span>
        </button>
      </td>
    </tr>
  );
}
