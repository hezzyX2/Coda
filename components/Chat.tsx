"use client";
import { useState, useRef, useEffect } from "react";
import { loadPreferences } from "@/lib/storage";
import { PremiumGate } from "./PremiumGate";
import { isPremium } from "@/lib/auth";

type Message = { role: "user" | "assistant"; content: string };

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Coda, your AI life coach. What would you like to talk about today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prefs = loadPreferences();
  const premium = isPremium();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          tone: prefs?.tone || "encouraging",
          premium: premium
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }
      const data = (await res.json()) as { message?: string; error?: string };
      if (data.error) {
        throw new Error(data.error);
      }
      setMessages([...updated, { role: "assistant", content: data.message || "I'm here to help!" }]);
    } catch (err: any) {
      const errorMsg = err?.message || "Sorry, I'm having trouble right now. Try again!";
      setMessages([...updated, { role: "assistant", content: `⚠️ ${errorMsg}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PremiumGate feature="AI Chat">
      {premium && (
        <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="premium-badge">✨ Premium</span>
          <span style={{ fontSize: "14px", color: "var(--muted)" }}>Enhanced AI responses enabled</span>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="chat-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="chat-bubble loading">
                <span className="typing-indicator">●</span>
                <span className="typing-indicator">●</span>
                <span className="typing-indicator">●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-wrapper">
          <input
            className="input chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Type your message..."
            disabled={loading || !premium}
          />
          <button className="btn primary chat-send" onClick={sendMessage} disabled={loading || !input.trim() || !premium}>
            Send
          </button>
        </div>
      </div>
    </PremiumGate>
  );
}

