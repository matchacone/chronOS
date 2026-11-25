import type { FormStatus } from "../../simulator/types";

interface StatusMessageProps {
  status: FormStatus;
}

/** Result of the last Run Simulation click. Errors are announced immediately to screen readers. */
export function StatusMessage({ status }: StatusMessageProps) {
  if (!status) return null;

  const isError = status.kind === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={`m-0 rounded-lg border bg-station p-3 ${
        isError ? "border-2 border-accent" : "border-station-border"
      }`}
    >
      {status.message}
    </p>
  );
}
