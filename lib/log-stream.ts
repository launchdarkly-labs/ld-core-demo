/**
 * In-memory log broadcast for SSE terminal. Subscribers (e.g. /api/logs/stream)
 * receive entries when pushLog() is called from anywhere (e.g. chat route, triage).
 * Uses globalThis so the same Set is shared across Next.js route bundles/workers.
 */

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  name: string;
  sessionId?: string;
}

type SendFn = (entry: LogEntry) => void;

const KEY = "__backend_log_subscribers__";

function getSubscribers(): Set<SendFn> {
  if (!(globalThis as any)[KEY]) (globalThis as any)[KEY] = new Set<SendFn>();
  return (globalThis as any)[KEY];
}

export function subscribe(sendFn: SendFn): () => void {
  const subscribers = getSubscribers();
  subscribers.add(sendFn);
  return () => subscribers.delete(sendFn);
}

export function pushLog(entry: Partial<LogEntry> & { message: string }): void {
  const subscribers = getSubscribers();
  const payload: LogEntry = {
    timestamp: new Date().toISOString(),
    level: entry.level ?? "INFO",
    message: entry.message,
    name: entry.name ?? "app",
  };
  if (entry.sessionId != null) payload.sessionId = entry.sessionId;

  const dead: SendFn[] = [];
  subscribers.forEach((send) => {
    try {
      send(payload);
    } catch {
      dead.push(send);
    }
  });
  dead.forEach((s) => subscribers.delete(s));
}
