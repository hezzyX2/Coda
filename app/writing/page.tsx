"use client";
import { WritingAssistant } from "@/components/WritingAssistant";

export default function WritingPage() {
  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">✍️ AI Writing Assistant</h1>
        <p className="page-subtitle">Get AI-powered feedback to improve your essays, assignments, and writing</p>
      </div>

      <div className="grid one">
        <section className="card glass">
          <div className="card-header">
            <h2>🤖 Improve Your Writing</h2>
            <span className="card-subtitle">Paste your text and get instant AI feedback</span>
          </div>
          <WritingAssistant />
        </section>
      </div>

      <div className="card glass" style={{ marginTop: "32px" }}>
        <h3>💡 How It Works</h3>
        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <div>
              <strong>Paste Your Writing</strong>
              <p>Simply paste your essay, assignment, journal entry, or notes into the editor.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <div>
              <strong>Choose Type & Tone</strong>
              <p>Select the writing type (essay, journal, assignment, note) and desired tone.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <div>
              <strong>Get AI Feedback</strong>
              <p>Receive detailed feedback including improved version, clarity score, strengths, and suggestions.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <div>
              <strong>Improve & Learn</strong>
              <p>Use the suggestions to enhance your writing and learn from the AI's insights.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

