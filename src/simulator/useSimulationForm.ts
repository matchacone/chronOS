import { useRef, useState, type FormEvent } from "react";
import type { AlgorithmId } from "../algorithms";
import { algorithmIdSchema } from "./schema";
import { MAX_PROCESSES, type FormStatus, type ProcessField, type ProcessRow } from "./types";
import { validateForm } from "./validation";

/** Reads ?algorithm= from the URL (set by the homepage button), falling back to FCFS. */
function algorithmFromUrl(): AlgorithmId {
  const requested = new URLSearchParams(window.location.search).get("algorithm");
  const parsed = algorithmIdSchema.safeParse(requested);
  return parsed.success ? parsed.data : "fcfs";
}

function emptyRow(key: number): ProcessRow {
  return { key, arrival: "", burst: "", priority: "" };
}

/** All state and actions for the simulator's input form. */
export function useSimulationForm() {
  const [algorithm, setAlgorithm] = useState<AlgorithmId>(algorithmFromUrl);
  const [priorityChecked, setPriorityChecked] = useState(false);
  const [timeQuantum, setTimeQuantum] = useState("");
  const nextRowKey = useRef(1);
  const [rows, setRows] = useState<ProcessRow[]>(() => [emptyRow(nextRowKey.current++)]);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<FormStatus>(null);

  const needsTimeQuantum = algorithm === "rr";
  // Priority Scheduling can't run without priorities, so the checkbox is forced on.
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
      setStatus({
        kind: "error",
        message: "Fill in every highlighted field with a whole number. Burst time and time quantum start at 1.",
      });
      return;
    }

    setInvalidFields(new Set());
    // TODO: pass result.input (a SimInput) to the scheduling engine once it exists, then render its output.
    const count = `${result.input.processes.length} process${result.input.processes.length === 1 ? "" : "es"}`;
    setStatus({
      kind: "success",
      message: `Input is valid for ${count}. The simulation engine is not built yet, so there is nothing to show.`,
    });
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
    status,
    submit,
  };
}
