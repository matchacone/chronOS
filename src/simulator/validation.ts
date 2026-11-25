import type { ProcessField, ProcessRow } from "./types";

export const TIME_QUANTUM_FIELD = "time-quantum";

/** Identifies one table cell in the set of invalid fields, e.g. "3-burst". */
export function processFieldId(rowKey: number, field: ProcessField): string {
  return `${rowKey}-${field}`;
}

function isWholeNumberAtLeast(raw: string, min: number): boolean {
  const trimmed = raw.trim();
  const value = Number(trimmed);
  return trimmed !== "" && Number.isInteger(value) && value >= min;
}

interface ValidationInput {
  rows: ProcessRow[];
  timeQuantum: string;
  needsTimeQuantum: boolean;
  needsPriority: boolean;
}

/**
 * Returns the ids of every field that fails validation (empty set = all valid).
 * Arrival and priority start at 0; burst and time quantum start at 1.
 */
export function findInvalidFields({
  rows,
  timeQuantum,
  needsTimeQuantum,
  needsPriority,
}: ValidationInput): Set<string> {
  const invalid = new Set<string>();

  if (needsTimeQuantum && !isWholeNumberAtLeast(timeQuantum, 1)) {
    invalid.add(TIME_QUANTUM_FIELD);
  }

  for (const row of rows) {
    if (!isWholeNumberAtLeast(row.arrival, 0)) invalid.add(processFieldId(row.key, "arrival"));
    if (!isWholeNumberAtLeast(row.burst, 1)) invalid.add(processFieldId(row.key, "burst"));
    if (needsPriority && !isWholeNumberAtLeast(row.priority, 0)) {
      invalid.add(processFieldId(row.key, "priority"));
    }
  }

  return invalid;
}
