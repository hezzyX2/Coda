"use client";
import { Chat } from "@/components/Chat";

export default function ChatPage() {
  const suggestions = [
    "How can I manage stress during exam season?",
    "I'm feeling unmotivated, what should I do?",
    "Help me plan my study schedule",
    "How do I balance school and personal life?",
    "I'm struggling with time management",
    "Give me tips for staying focused"
  ];

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">Chat with Codak AI</h1>
        <p className="page-subtitle">Get personalized advice and support from your advanced AI life coach</p>
      </div>

      <div className="grid two">
        <section className="card glass chat-section">
          <div className="card-header">
            <h2>💬 Conversation</h2>
            <span className="card-subtitle">Ask me anything</span>
          </div>
          <Chat />
        </section>
        <section className="card glass">
          <h2>💡 Conversation Starters</h2>
          <p className="chat-description">
            Need inspiration? Try one of these conversation starters:
          </p>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-icon">✨</div>
                <p className="suggestion-text">{suggestion}</p>
              </div>
            ))}
          </div>
          <div className="chat-tips">
            <h3>💡 Tips for great conversations</h3>
            <ul className="tips-list">
              <li>Be specific about your situation</li>
              <li>Ask follow-up questions</li>
              <li>Share your goals and challenges</li>
              <li>Request actionable advice</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

