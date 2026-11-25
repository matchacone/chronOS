export const MAX_PROCESSES = 10;

export interface ProcessRow {
  key: number;
  arrival: string;
  burst: string;
  priority: string;
}

export type ProcessField = "arrival" | "burst" | "priority";

export type FormError = {
  id: number;
  title: string;
  message: string;
} | null;
