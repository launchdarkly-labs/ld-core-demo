"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Terminal from "./components/Terminal";
import { useSession } from "./SessionContext";

function scrollToEnd(messagesEndRef) {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}

const DOCS = [
  { id: "how-it-works", label: "How it works", src: "/docs/How-it-works.png" },
  { id: "ld-architecture", label: "LD Architecture", src: "/docs/LD-Architecture.png" },
];

function UserMenu({ sessionProjectKey, sessionSdkKey, setSession }) {
  const [open, setOpen] = useState(false);
  const [projectKeyInput, setProjectKeyInput] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!viewingDoc) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") setViewingDoc(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [viewingDoc]);

  const handleConnect = async () => {
    const key = projectKeyInput.trim();
    if (!key) return;
    setConnectError(null);
    setConnecting(true);
    try {
      const res = await fetch("/api/admin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectKey: key }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.projectKey && data.sdkKey) {
        setSession(data);
      } else {
        setConnectError(data.error || "Could not connect to project.");
      }
    } catch (e) {
      setConnectError(e.message || "Request failed");
    } finally {
      setConnecting(false);
    }
  };

  const runAction = async (action) => {
    setActionStatus({ action, status: "loading" });
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectKey: sessionProjectKey || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionStatus({ action, status: "success", message: data.message });
      } else {
        setActionStatus({ action, status: "error", message: data.error || data.message || res.statusText });
      }
    } catch (e) {
      setActionStatus({ action, status: "error", message: e.message || "Request failed" });
    }
  };

  return (
    <div className="nav-user-wrap" ref={menuRef}>
      <button
        type="button"
        className="user-icon-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Settings"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-field">
            <label htmlFor="user-menu-project-key">Project key</label>
            <input
              id="user-menu-project-key"
              type="text"
              placeholder="e.g. nteixeira-ld-demo"
              value={projectKeyInput}
              onChange={(e) => setProjectKeyInput(e.target.value)}
              className="user-dropdown-input"
            />
          </div>
          <div className="user-dropdown-actions">
            <button
              type="button"
              className="user-dropdown-btn user-dropdown-btn-primary"
              onClick={handleConnect}
              disabled={!projectKeyInput.trim() || connecting}
            >
              {connecting ? "Connecting…" : "Connect"}
            </button>
            <button
              type="button"
              className="user-dropdown-btn"
              onClick={() => runAction("create-ai-configs")}
              disabled={!sessionProjectKey || actionStatus?.status === "loading"}
              title={!sessionProjectKey ? "Connect to a project first" : undefined}
            >
              Create AI configs
            </button>
          </div>
          {connectError && (
            <div className="user-dropdown-status error" role="alert">
              {connectError}
            </div>
          )}
          {actionStatus && (
            <div className={`user-dropdown-status ${actionStatus.status}`} role="status">
              {actionStatus.status === "loading" && "Running…"}
              {actionStatus.status === "success" && (actionStatus.message || "Done.")}
              {actionStatus.status === "error" && (actionStatus.message || "Error.")}
            </div>
          )}
          <div className="user-dropdown-docs">
            <div className="user-dropdown-docs-label">
              <svg className="user-dropdown-docs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Reference</span>
            </div>
            {DOCS.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className="user-dropdown-doc-btn"
                onClick={() => {
                  setViewingDoc(doc.id);
                  setOpen(false);
                }}
              >
                {doc.label}
              </button>
            ))}
            <a
              href="https://app.launchdarkly.com/projects/mpoliks-ld-demo/experiments/toggle-health-policy-agent-prompt-impact_l09nJ1_M3ARtd_T3uzV6_IIIbgV/results?env=production&selected-env=production"
              target="_blank"
              rel="noopener noreferrer"
              className="user-dropdown-doc-btn"
            >
              Experiments
            </a>
            <a
              href="https://www.loom.com/share/c318015371e64fd1a4c2a3fbb2323d3d"
              target="_blank"
              rel="noopener noreferrer"
              className="user-dropdown-doc-btn"
            >
              AI Configs E2E Demo
            </a>
          </div>
        </div>
      )}
      {viewingDoc && (() => {
        const doc = DOCS.find((d) => d.id === viewingDoc);
        if (!doc || typeof document === "undefined") return null;
        return createPortal(
          <div
            className="doc-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Viewing ${doc.label}`}
            onClick={() => setViewingDoc(null)}
          >
            <div className="doc-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="doc-modal-close"
                onClick={() => setViewingDoc(null)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="doc-modal-title">{doc.label}</h3>
              <img src={doc.src} alt={doc.label} className="doc-modal-img" />
            </div>
          </div>,
          document.body
        );
      })()}
    </div>
  );
}

function MessageRow({ role, content, markdown }) {
  const isUser = role === "user";
  const className = "message-row" + (isUser ? " message-row-user" : "");
  const msgClass = "message message-" + (isUser ? "user" : "assistant");
  const contentClass = markdown ? "message-assistant markdown-content" : msgClass;

  return (
    <div className={className}>
      {!isUser && (
        <img src="/assets/ToggleAvatar.png" alt="" className="message-avatar" />
      )}
      {markdown && !isUser ? (
        <div
          className={contentClass}
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n/g, "<br>"),
          }}
        />
      ) : (
        <div
          className={msgClass}
          style={!isUser ? { whiteSpace: "pre-wrap" } : undefined}
        >
          {content}
        </div>
      )}
    </div>
  );
}

function ChatWidget({ sessionSdkKey, logSessionId }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your ToggleHealth assistant. Send a message and I'll classify it with the triage agent.",
      markdown: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [guardrailsOn, setGuardrailsOn] = useState(true);
  const [lastJudgeResults, setLastJudgeResults] = useState([]);
  const [judgeDropdownOpen, setJudgeDropdownOpen] = useState(false);
  const chatContentRef = useRef(null);
  const messagesEndRef = useRef(null);

  const addMessage = (role, content, markdown = false) => {
    setMessages((prev) => [...prev, { role, content, markdown }]);
    setTimeout(() => scrollToEnd(messagesEndRef), 50);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setSending(true);
    addMessage("user", text);
    setLastJudgeResults([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: text,
          guardrails: guardrailsOn,
          ...(sessionSdkKey && { sdkKey: sessionSdkKey }),
          ...(logSessionId && { sessionId: logSessionId }),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        const reply = (data.response ?? "").trim() || "No response received.";
        addMessage("assistant", reply, reply.includes("**"));
        setLastJudgeResults(Array.isArray(data.judgeResults) ? data.judgeResults : []);
      } else {
        addMessage(
          "assistant",
          data.response || data.error || "Something went wrong."
        );
      }
    } catch {
      addMessage("assistant", "Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget-wrap">
      {lastJudgeResults.length > 0 && (
        <>
          <div
            id="judge-panel"
            role="region"
            aria-labelledby="judge-tab-btn"
            className={`judge-panel ${judgeDropdownOpen ? "open" : ""}`}
          >
            <div className="judge-panel-header">
              <span>LLM Judges – Brand Voice ({lastJudgeResults.length})</span>
              <button
                type="button"
                className="judge-panel-close"
                onClick={() => setJudgeDropdownOpen(false)}
                aria-label="Close judges panel"
              >
                ×
              </button>
            </div>
            <div className="judge-panel-content">
              {lastJudgeResults.map((jr, idx) => {
                const name = jr.judgeConfigKey ?? jr.judge_config_key ?? `Judge ${idx + 1}`;
                const evals = jr.evals && typeof jr.evals === "object" && !Array.isArray(jr.evals) ? jr.evals : {};
                const hasEvals = Object.keys(evals).length > 0;
                const friendlyMetric = (key) => (typeof key === "string" && key.includes(":") ? key.split(":").pop() : key);
                return (
                  <div key={idx} className="judge-metrics-judge">
                    {jr.runLabel && (
                      <div className="judge-metrics-run-label">{jr.runLabel}</div>
                    )}
                    <div className="judge-metrics-judge-name">{name}</div>
                    {hasEvals
                      ? Object.entries(evals).map(([metric, evalScore]) => (
                          <div key={metric} className="judge-metrics-metric">
                            <span className="judge-metrics-metric-name">{friendlyMetric(metric)}</span>
                            <span className="judge-metrics-metric-score">
                              Score: {evalScore?.score ?? "—"}
                            </span>
                            {(evalScore?.reasoning ?? "") && (
                              <p className="judge-metrics-reasoning">{evalScore.reasoning}</p>
                            )}
                          </div>
                        ))
                      : (
                          <div className="judge-metrics-metric judge-metrics-metric-empty">
                            {jr.error ? `Error: ${jr.error}` : "No evaluation scores"}
                          </div>
                        )}
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            id="judge-tab-btn"
            className={`judge-tab ${judgeDropdownOpen ? "open" : ""}`}
            onClick={() => setJudgeDropdownOpen((o) => !o)}
            aria-expanded={judgeDropdownOpen}
            aria-controls="judge-panel"
            title="LLM Judges – Brand Voice"
          >
            <span className="judge-tab-label">LLM Judges ({lastJudgeResults.length})</span>
          </button>
        </>
      )}
      <div className="app-container">
      <header className="chat-header">
        <div className="header-content">
          <h2 className="chat-title">Coverage Concierge</h2>
          <div className="header-subtitle-row">
            <p className="header-subtitle">
              Powered by <span className="provider-badge">Amazon Bedrock</span> ·
              Guardrails {guardrailsOn ? "on" : "off"}
            </p>
            <button
              type="button"
              className={`guardrails-btn ${guardrailsOn ? "guardrails-on" : ""}`}
              onClick={() => {
                const next = !guardrailsOn;
                setGuardrailsOn(next);
                fetch("/api/logs/stream", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ guardrails: next, ...(logSessionId && { sessionId: logSessionId }) }),
                }).catch(() => {});
              }}
              title="Guardrails"
              aria-label="Toggle guardrails"
            >
              <svg
                className="guardrails-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="chat-content" ref={chatContentRef}>
        {messages.map((m, i) => (
          <MessageRow
            key={i}
            role={m.role}
            content={m.content}
            markdown={m.markdown}
          />
        ))}
        {sending && (
          <div className="message-row">
            <img src="/assets/ToggleAvatar.png" alt="" className="message-avatar" />
            <div className="message message-assistant">
              <div className="loading-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
      <div className="chat-footer">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          type="button"
          className="send-button"
          onClick={sendMessage}
          disabled={sending}
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
}

export default function Home() {
  const { projectKey: sessionProjectKey, sdkKey: sessionSdkKey, setSession } = useSession();
  const [logSessionId] = useState(
    () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  );
  return (
    <>
      <Terminal logSessionId={logSessionId} />
      <div className="homepage-background terminal-offset">
        <img src="/health/backgrounds/health-homepage-background-left.svg" alt="" className="bg-left" />
        <img src="/health/backgrounds/health-homepage-background-right.svg" alt="" className="bg-right" />
      </div>
      <div className="homepage-wrapper terminal-offset">
        <nav className="health-nav">
          <div className="nav-right">
            <UserMenu
              sessionProjectKey={sessionProjectKey}
              sessionSdkKey={sessionSdkKey}
              setSession={setSession}
            />
            <span className="nav-connection-status" aria-live="polite">
              {sessionProjectKey ? (
                <>
                  Connected{" "}
                  <a
                    href={`https://app.launchdarkly.com/projects/${sessionProjectKey}/ai-configs`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-connection-link"
                  >
                    {sessionProjectKey}
                  </a>
                </>
              ) : (
                "Set project to connect"
              )}
            </span>
          </div>
          <img src="/health/toggleHealth_logo_horizontal.svg" alt="ToggleHealth" className="nav-logo" />
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your health, simplified with ToggleHealth
            </h1>
            <p className="hero-subtitle">
              Trusted by over 100,000 patients nationwide
            </p>
            <div className="hero-buttons">
              <button type="button" className="btn-primary">
                Get Started
              </button>
              <button type="button" className="btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </header>
        <section className="services-section">
          <h2 className="services-title">OUR HEALTH SERVICES</h2>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <img src="/health/icons/prescriptions.svg" alt="" />
              </div>
              <p>Prescriptions</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/health/icons/telemedicine.svg" alt="" />
              </div>
              <p>Telemedicine</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/health/icons/pharmacy.svg" alt="" />
              </div>
              <p>Pharmacy</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/health/icons/wellness.svg" alt="" />
              </div>
              <p>Wellness</p>
            </div>
            <div className="service-item">
              <div className="service-icon">
                <img src="/health/icons/insurance.svg" alt="" />
              </div>
              <p>Insurance</p>
            </div>
          </div>
        </section>
      </div>
      <ChatWidget sessionSdkKey={sessionSdkKey} logSessionId={logSessionId} />
    </>
  );
}
