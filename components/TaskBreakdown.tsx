"use client";
import { useState } from "react";
import { Task } from "@/lib/models";

export function TaskBreakdown({ task }: { task: Task }) {
  const [breakdown, setBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateBreakdown() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/task-breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      if (!res.ok) throw new Error("Failed to generate breakdown");
      const data = await res.json();
      setBreakdown(data.breakdown);
    } catch (err: any) {
      setError(err.message || "Failed to generate breakdown");
    } finally {
      setLoading(false);
    }
  }

  if (breakdown) {
    return (
      <div className="task-breakdown">
        <div className="breakdown-header">
          <h4>📋 Task Breakdown</h4>
          <button className="btn compact" onClick={() => setBreakdown(null)}>Close</button>
        </div>
        <div className="breakdown-steps">
          {breakdown.steps?.map((step: any, i: number) => (
            <div key={i} className="breakdown-step">
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                <div className="step-title">{step.step}</div>
                <div className="step-meta">
                  <span className="step-time">⏱️ {step.estimatedTime} mins</span>
                  <span className={`step-priority ${step.priority}`}>{step.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {breakdown.tips && breakdown.tips.length > 0 && (
          <div className="breakdown-tips">
            <h5>💡 Tips</h5>
            <ul>
              {breakdown.tips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        {breakdown.resources && breakdown.resources.length > 0 && (
          <div className="breakdown-resources">
            <h5>📚 Suggested Resources</h5>
            <ul>
              {breakdown.resources.map((resource: string, i: number) => (
                <li key={i}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="task-breakdown-trigger">
      <button
        className="btn compact primary"
        onClick={generateBreakdown}
        disabled={loading}
      >
        {loading ? "🤖 Analyzing..." : "🤖 AI Breakdown"}
      </button>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

