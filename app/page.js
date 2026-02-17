"use client";

import { useRef, useState } from "react";
import Terminal from "./components/Terminal";

function scrollToEnd(messagesEndRef) {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

function ChatWidget() {
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
        body: JSON.stringify({ userInput: text }),
      });
      const data = await res.json();

      if (res.ok) {
        addMessage("assistant", data.response, data.response?.includes("**"));
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
          <p className="header-subtitle">
            Powered by <span className="provider-badge">Amazon Bedrock</span> ·
            Triage only
          </p>
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
  return (
    <>
      <Terminal />
      <div className="homepage-background terminal-offset">
        <img src="/health/backgrounds/health-homepage-background-left.svg" alt="" className="bg-left" />
        <img src="/health/backgrounds/health-homepage-background-right.svg" alt="" className="bg-right" />
      </div>
      <div className="homepage-wrapper terminal-offset">
        <nav className="health-nav">
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
      <ChatWidget />
    </>
  );
}
