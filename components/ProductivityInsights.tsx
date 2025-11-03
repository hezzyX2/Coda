"use client";
import { useState, useEffect } from "react";
import { Task } from "@/lib/models";
import { JournalEntry } from "@/lib/models";

export function ProductivityInsights({ tasks, journalEntries }: { tasks: Task[]; journalEntries: JournalEntry[] }) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tasks.length > 0 || journalEntries.length > 0) {
      generateInsights();
    }
  }, [tasks.length, journalEntries.length]);

  async function generateInsights() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/productivity-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, journalEntries }),
      });
      if (!res.ok) throw new Error("Failed to generate insights");
      const data = await res.json();
      setInsights(data.insights);
    } catch (err: any) {
      setError(err.message || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="insights-loading">
        <div className="loading-spinner">🤖 Analyzing your productivity...</div>
      </div>
    );
  }

  if (error && !insights) {
    return (
      <div className="insights-error">
        <p>{error}</p>
        <button className="btn compact" onClick={generateInsights}>Retry</button>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const scoreColor = insights.productivityScore > 0.7 
    ? "var(--accent-2)" 
    : insights.productivityScore > 0.4 
    ? "var(--accent)" 
    : "var(--danger)";

  return (
    <div className="productivity-insights">
      <div className="insights-header">
        <h4>🎯 AI Productivity Insights</h4>
        <button className="btn compact" onClick={generateInsights}>🔄 Refresh</button>
      </div>

      {insights.productivityScore !== undefined && (
        <div className="productivity-score">
          <div className="score-label">Your Productivity Score</div>
          <div className="score-value" style={{ color: scoreColor }}>
            {Math.round(insights.productivityScore * 100)}%
          </div>
        </div>
      )}

      {insights.motivationalMessage && (
        <div className="motivational-message">
          {insights.motivationalMessage}
        </div>
      )}

      {insights.strengths && insights.strengths.length > 0 && (
        <div className="insights-section">
          <h5>💪 Your Strengths</h5>
          <ul className="strengths-list">
            {insights.strengths.map((strength: string, i: number) => (
              <li key={i}>✨ {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.insights && insights.insights.length > 0 && (
        <div className="insights-section">
          <h5>💡 Key Insights</h5>
          <ul className="insights-list">
            {insights.insights.map((insight: string, i: number) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="insights-section">
          <h5>🚀 Recommendations</h5>
          <ul className="recommendations-list">
            {insights.recommendations.map((rec: string, i: number) => (
              <li key={i}>→ {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {insights.areasForImprovement && insights.areasForImprovement.length > 0 && (
        <div className="insights-section">
          <h5>📈 Areas for Improvement</h5>
          <ul className="improvement-list">
            {insights.areasForImprovement.map((area: string, i: number) => (
              <li key={i}>🎯 {area}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

