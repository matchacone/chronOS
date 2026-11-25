import { useState, type FormEvent } from "react";

type RequestState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; statusCode: number; statusText: string; durationMs: number; body: string }
  | { kind: "error"; message: string };

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

type StatusTone = "ok" | "info" | "error";

function statusTone(statusCode: number): StatusTone {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "error";
  if (statusCode >= 300) return "info";
  return "ok";
}

export function APITester() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/hello");
  const [state, setState] = useState<RequestState>({ kind: "idle" });
  const [sending, setSending] = useState(false);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setState({ kind: "loading" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const path = (formData.get("endpoint") as string)?.trim() || "/api/hello";
    const httpMethod = (formData.get("method") as string) || "GET";
    const url = new URL(path, location.href);
    const startedAt = performance.now();

    try {
      const res = await fetch(url, { method: httpMethod });
      const durationMs = Math.round(performance.now() - startedAt);
      const raw = await res.text();
      let body = raw;
      try {
        body = JSON.stringify(JSON.parse(raw), null, 2);
      } catch {
        // Not JSON — surface the raw payload as-is.
      }
      setState({
        kind: "success",
        statusCode: res.status,
        statusText: res.statusText,
        durationMs,
        body,
      });
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setSending(false);
    }
  };

  const tone: StatusTone | null =
    state.kind === "success" ? statusTone(state.statusCode) : null;
  const statusLabel = state.kind === "success" ? `${state.statusCode} ${state.statusText}`.trim() : "";

  return (
    <div className="api-tester">
      <form onSubmit={testEndpoint} className="endpoint-bar">
        <select
          name="method"
          className="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="endpoint"
          className="url-input"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="/api/hello"
        />
        <button type="submit" className="send-button" disabled={sending}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>

      <div className={`response-pane response-${state.kind}`}>
        <div className="response-header">
          <span className="response-label">Response</span>
          {state.kind === "success" && (
            <span className={`status-badge status-${tone}`}>{statusLabel}</span>
          )}
          {state.kind === "success" && <span className="response-meta">{state.durationMs}ms</span>}
          {state.kind === "loading" && <span className="response-meta">Sending…</span>}
        </div>
        <div className="response-body">
          {state.kind === "idle" && (
            <p className="response-placeholder">No response yet — send a request to see the JSON.</p>
          )}
          {state.kind === "loading" && (
            <p className="response-placeholder">Waiting for the server…</p>
          )}
          {state.kind === "error" && (
            <div className="response-error">
              <p>{state.message}</p>
              <p className="response-error-hint">
                Check that the dev server is running, then send the request again.
              </p>
            </div>
          )}
          {state.kind === "success" && <pre>{state.body}</pre>}
        </div>
      </div>
    </div>
  );
}
