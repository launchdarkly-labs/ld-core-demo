/**
 * In-memory log broadcast for SSE terminal. Subscribers (e.g. /api/logs/stream)
 * receive entries when pushLog() is called from anywhere (e.g. chat route, triage).
 * Uses globalThis so the same Set is shared across Next.js route bundles/workers.
 */
const KEY = "__policy_agent_log_subscribers__";
function getSubscribers() {
  if (!globalThis[KEY]) globalThis[KEY] = new Set();
  return globalThis[KEY];
}

export function subscribe(sendFn) {
  const subscribers = getSubscribers();
  subscribers.add(sendFn);
  return () => subscribers.delete(sendFn);
}

export function pushLog(entry) {
  const subscribers = getSubscribers();
  const payload = {
    timestamp: new Date().toISOString(),
    level: entry.level ?? "INFO",
    message: entry.message ?? "",
    name: entry.name ?? "app",
  };
  if (entry.sessionId != null) payload.sessionId = entry.sessionId;
  const dead = [];
  subscribers.forEach((send) => {
    try {
      send(payload);
    } catch (_) {
      dead.push(send);
    }
  });
  dead.forEach((s) => subscribers.delete(s));
}
