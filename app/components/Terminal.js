"use client";

import { useState, useEffect, useRef } from "react";

export default function Terminal({ logSessionId }) {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const logsEndRef = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/logs/stream");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onmessage = (event) => {
      try {
        const logEntry = JSON.parse(event.data);
        if (logEntry.level === "HEARTBEAT") return;
        const isForThisSession = !logEntry.sessionId || logEntry.sessionId === logSessionId;
        if (isForThisSession) setLogs((prev) => [...prev, logEntry]);
      } catch (_) {}
    };
    eventSource.onerror = () => setIsConnected(false);

    return () => {
      eventSource.close();
    };
  }, [logSessionId]);

  useEffect(() => {
    if (!isCollapsed) logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isCollapsed]);

  const getLogClass = (level) =>
    ({ INFO: "log-info", PRINT: "log-print", ERROR: "log-error", WARNING: "log-warning", DEBUG: "log-debug" }[level] || "log-default");

  if (isCollapsed) {
    return (
      <div className="terminal-collapsed">
        <button className="terminal-expand-btn" onClick={() => setIsCollapsed(false)} type="button">
          <span className="terminal-icon">📟</span>
          <span>Show Terminal</span>
          {isConnected && <span className="status-indicator connected" />}
        </button>
      </div>
    );
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="terminal-icon">📟</span>
          <span>Backend Terminal</span>
          <span className={`status-indicator ${isConnected ? "connected" : "disconnected"}`} />
        </div>
        <div className="terminal-actions">
          <button className="terminal-btn" onClick={() => setLogs([])} title="Clear logs" type="button">🗑️</button>
          <button className="terminal-btn" onClick={() => setIsCollapsed(true)} title="Collapse" type="button">◀</button>
        </div>
      </div>
      <div className="terminal-content">
        {logs.length === 0 ? (
          <div className="terminal-empty">
            <p>Waiting for logs...</p>
            {!isConnected && <p className="terminal-error">⚠️ Not connected to server</p>}
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`terminal-line ${getLogClass(log.level)}${log.name === "guardrails-on" ? " log-guardrails-on" : log.name === "guardrails-off" ? " log-guardrails-off" : log.name === "guardrails-triggered" ? " log-guardrails-triggered" : ""}`}
            >
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
