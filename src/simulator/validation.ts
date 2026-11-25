import { simInputSchema, type SimInput } from "./schema";
import type { ProcessField, ProcessRow } from "./types";

export const TIME_QUANTUM_FIELD = "time-quantum";

/** Identifies one table cell in the set of invalid fields, e.g. "3-burst". */
export function processFieldId(rowKey: number, field: ProcessField): string {
  return `${rowKey}-${field}`;
}

interface FormState {
  algorithm: SimInput["algorithm"];
  rows: ProcessRow[];
  timeQuantum: string;
  showTimeQuantum: boolean;
  showPriority: boolean;
}

type ValidationResult =
  | { success: true; input: SimInput }
  | { success: false; invalidFields: Set<string> };

/**
 * Runs the form through the zod schema. On failure, returns the ids of the fields to highlight.
 * Hidden fields (time quantum outside Round Robin, priority when unchecked) are left out entirely.
 */
export function validateForm({
  algorithm,
  rows,
  timeQuantum,
  showTimeQuantum,
  showPriority,
}: FormState): ValidationResult {
  const result = simInputSchema.safeParse({
    algorithm,
    timeQuantum: showTimeQuantum ? timeQuantum : undefined,
    processes: rows.map((row) => ({
      arrival: row.arrival,
      burst: row.burst,
      priority: showPriority ? row.priority : undefined,
    })),
  });

  if (result.success) return { success: true, input: result.data };

  const invalidFields = new Set<string>();
  for (const issue of result.error.issues) {
    const [first, index, field] = issue.path;

    if (first === "timeQuantum") {
      invalidFields.add(TIME_QUANTUM_FIELD);
    } else if (first === "processes" && typeof index === "number" && typeof field === "string") {
      const row = rows[index];
      if (row) invalidFields.add(processFieldId(row.key, field as ProcessField));
    }
  }

  return { success: false, invalidFields };
}
