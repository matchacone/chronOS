export const MAX_PROCESSES = 10;

/** One process as typed into the table. Values stay strings until validation. */
export interface ProcessRow {
  /** Stable React key. Not the process number: P1..PN come from the row's position. */
  key: number;
  arrival: string;
  burst: string;
  priority: string;
}

export type ProcessField = "arrival" | "burst" | "priority";

export type FormStatus = { kind: "error" | "success"; message: string } | null;
