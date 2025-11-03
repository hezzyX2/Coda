"use client";
import { useState } from "react";
import { Habit } from "@/lib/models";

export function HabitAnalysis({ habits }: { habits: Habit[] }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeHabits() {
    if (habits.length === 0) {
      setError("Add habits first to get AI insights");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habits: habits.map(h => ({
            name: h.name,
            streak: h.streak,
            totalDays: h.totalDays,
            completedDates: h.completedDates,
            category: h.category
          })),
          timeframe: "all"
        }),
      });
      if (!res.ok) throw new Error("Failed to analyze habits");
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze habits");
    } finally {
      setLoading(false);
    }
  }

  if (habits.length === 0) {
    return (
      <div className="habit-analysis-empty">
        <p>📊 Add habits to unlock AI-powered habit analysis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="habit-analysis-loading">
        <div className="loading-spinner">🤖 Analyzing your habits...</div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="habit-analysis-error">
        <p>{error}</p>
        <button className="btn compact" onClick={analyzeHabits}>Retry</button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="habit-analysis-trigger">
        <button className="btn primary" onClick={analyzeHabits}>
          🤖 Get AI Habit Insights
        </button>
      </div>
    );
  }

  return (
    <div className="habit-analysis">
      <div className="analysis-header">
        <h4>📊 AI Habit Analysis</h4>
        <button className="btn compact" onClick={() => setAnalysis(null)}>Refresh</button>
      </div>

      {analysis.patterns && analysis.patterns.length > 0 && (
        <div className="analysis-section">
          <h5>🔍 Patterns Identified</h5>
          <ul>
            {analysis.patterns.map((pattern: string, i: number) => (
              <li key={i}>{pattern}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="analysis-section">
          <h5>💪 Strengths</h5>
          <ul>
            {analysis.strengths.map((strength: string, i: number) => (
              <li key={i}>✨ {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="analysis-section">
          <h5>🚀 Recommendations</h5>
          <ul>
            {analysis.recommendations.map((rec: string, i: number) => (
              <li key={i}>→ {rec}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.optimalTimes && Object.keys(analysis.optimalTimes).length > 0 && (
        <div className="analysis-section">
          <h5>⏰ Optimal Times</h5>
          <div className="optimal-times">
            {Object.entries(analysis.optimalTimes).map(([habit, time]: [string, any]) => (
              <div key={habit} className="time-item">
                <strong>{habit}:</strong> {time}
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.nextSteps && analysis.nextSteps.length > 0 && (
        <div className="analysis-section">
          <h5>🎯 Next Steps</h5>
          <ul>
            {analysis.nextSteps.map((step: string, i: number) => (
              <li key={i}>📌 {step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

