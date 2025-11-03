"use client";
import { useState } from "react";

export function WritingAssistant({ initialText = "", onSave }: { initialText?: string; onSave?: (text: string) => void }) {
  const [text, setText] = useState(initialText);
  const [type, setType] = useState<"essay" | "journal" | "assignment" | "note">("essay");
  const [tone, setTone] = useState<"academic" | "casual" | "professional" | "reflective">("academic");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getFeedback() {
    if (!text.trim() || text.length < 10) {
      setError("Please enter at least 10 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/writing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type, tone, goal }),
      });
      if (!res.ok) throw new Error("Failed to get feedback");
      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to get feedback");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="writing-assistant-result">
        <div className="result-header">
          <h4>✍️ AI Writing Feedback</h4>
          <button className="btn compact" onClick={() => setResult(null)}>New Analysis</button>
        </div>

        <div className="result-section">
          <h5>Improved Version</h5>
          <div className="improved-text">{result.improvedText}</div>
          {onSave && (
            <button className="btn compact" onClick={() => onSave(result.improvedText)}>Use This Version</button>
          )}
        </div>

        {result.clarityScore !== undefined && (
          <div className="result-section">
            <h5>Clarity Score</h5>
            <div className="score-bar">
              <div 
                className="score-fill" 
                style={{ width: `${result.clarityScore * 100}%`, backgroundColor: result.clarityScore > 0.7 ? "var(--accent-2)" : result.clarityScore > 0.4 ? "var(--accent)" : "var(--danger)" }}
              >
                {Math.round(result.clarityScore * 100)}%
              </div>
            </div>
          </div>
        )}

        {result.strengths && result.strengths.length > 0 && (
          <div className="result-section">
            <h5>✨ Strengths</h5>
            <ul>
              {result.strengths.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {result.suggestions && result.suggestions.length > 0 && (
          <div className="result-section">
            <h5>💡 Suggestions</h5>
            <ul>
              {result.suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {result.nextSteps && result.nextSteps.length > 0 && (
          <div className="result-section">
            <h5>🚀 Next Steps</h5>
            <ul>
              {result.nextSteps.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="writing-assistant">
      <div className="writing-controls">
        <label>
          <span>Writing Type</span>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="essay">Essay</option>
            <option value="journal">Journal Entry</option>
            <option value="assignment">Assignment</option>
            <option value="note">Note</option>
          </select>
        </label>
        <label>
          <span>Tone</span>
          <select className="input" value={tone} onChange={(e) => setTone(e.target.value as any)}>
            <option value="academic">Academic</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="reflective">Reflective</option>
          </select>
        </label>
      </div>
      <label className="form-group-full">
        <span>Goal (Optional)</span>
        <input
          className="input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Improve argumentation, enhance clarity..."
        />
      </label>
      <textarea
        className="input textarea"
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your writing here..."
      />
      <button
        className="btn primary"
        onClick={getFeedback}
        disabled={loading || text.length < 10}
      >
        {loading ? "🤖 Analyzing..." : "🤖 Get AI Feedback"}
      </button>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

