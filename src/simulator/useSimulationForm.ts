import { useRef, useState, type FormEvent } from "react";
import type { AlgorithmId } from "../algorithms";
import { algorithmIdSchema } from "./schema";
import { MAX_PROCESSES, type FormError, type ProcessField, type ProcessRow } from "./types";
import { validateForm } from "./validation";

function algorithmFromUrl(): AlgorithmId {
  const requested = new URLSearchParams(window.location.search).get("algorithm");
  const parsed = algorithmIdSchema.safeParse(requested);
  return parsed.success ? parsed.data : "fcfs";
}

function emptyRow(key: number): ProcessRow {
  return { key, arrival: "", burst: "", priority: "" };
}

export function useSimulationForm() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>(algorithmFromUrl);
  const [priorityChecked, setPriorityChecked] = useState(false);
  const [timeQuantum, setTimeQuantum] = useState("");
  const nextRowKey = useRef(1);
  const [rows, setRows] = useState<ProcessRow[]>(() => [emptyRow(nextRowKey.current++)]);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [error, setError] = useState<FormError>(null);
  const nextErrorId = useRef(1);

  const showError = (title: string, message: string) => {
    setError({ id: nextErrorId.current++, title, message });
  };

  const dismissError = () => setError(null);

  const needsTimeQuantum = algorithm === "rr";
  const priorityRequired = algorithm === "priority";
  const showPriority = priorityChecked || priorityRequired;
  const canAddRow = rows.length < MAX_PROCESSES;
  const canRemoveRow = rows.length > 1;

  const addRow = () => {
    if (!canAddRow) return;
    setRows((prev) => [...prev, emptyRow(nextRowKey.current++)]);
  };

  const removeRow = (key: number) => {
    if (!canRemoveRow) return;
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const updateRow = (key: number, field: ProcessField, value: string) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateForm({
      algorithm,
      rows,
      timeQuantum,
      showTimeQuantum: needsTimeQuantum,
      showPriority,
    });

    if (!result.success) {
      setInvalidFields(result.invalidFields);
      showError(
        "Some fields need fixing",
        "Use whole numbers with no negatives or decimals. Burst time and time quantum must be at least 1.",
      );
      return;
    }

    setInvalidFields(new Set());
    dismissError();
  };

  return {
    algorithm,
    setAlgorithm,
    showPriority,
    priorityRequired,
    setPriorityChecked,
    needsTimeQuantum,
    timeQuantum,
    setTimeQuantum,
    rows,
    canAddRow,
    canRemoveRow,
    addRow,
    removeRow,
    updateRow,
    invalidFields,
    error,
    dismissError,
    submit,
  };
}
