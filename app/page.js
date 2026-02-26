"use client";

import { useRef, useState, useEffect } from "react";
import Terminal from "./components/Terminal";

function scrollToEnd(messagesEndRef) {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}

function UserMenu({ sessionSdkKey, setSessionSdkKey }) {
  const [open, setOpen] = useState(false);
  const [sdkKey, setSdkKey] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const runAction = async (action) => {
    setActionStatus({ action, status: "loading" });
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sdkKey: sdkKey.trim() || undefined }),
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
            <label htmlFor="user-menu-sdk-key">SDK key</label>
            <input
              id="user-menu-sdk-key"
              type="password"
              placeholder="Server-side SDK key (sdk-...)"
              value={sdkKey}
              onChange={(e) => setSdkKey(e.target.value)}
              className="user-dropdown-input"
            />
          </div>
          <div className="user-dropdown-actions">
            <button
              type="button"
              className="user-dropdown-btn user-dropdown-btn-primary"
              onClick={() => {
                const key = sdkKey.trim();
                if (key) setSessionSdkKey(key);
              }}
              disabled={!sdkKey.trim()}
            >
              Use for chat
            </button>
            <button type="button" className="user-dropdown-btn" onClick={() => runAction("create-ai-configs")} disabled={actionStatus?.status === "loading"}>
              Create AI configs
            </button>
          </div>
          {actionStatus && (
            <div className={`user-dropdown-status ${actionStatus.status}`} role="status">
              {actionStatus.status === "loading" && "Running…"}
              {actionStatus.status === "success" && (actionStatus.message || "Done.")}
              {actionStatus.status === "error" && (actionStatus.message || "Error.")}
            </div>
          )}
        </div>
      )}
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
  );
}

export default function Home() {
  const [sessionSdkKey, setSessionSdkKey] = useState("");
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
            <UserMenu sessionSdkKey={sessionSdkKey} setSessionSdkKey={setSessionSdkKey} />
            <span className="nav-connection-status" aria-live="polite">
              {sessionSdkKey ? `Connected …${sessionSdkKey.slice(-4)}` : "Set SDK key to connect"}
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
