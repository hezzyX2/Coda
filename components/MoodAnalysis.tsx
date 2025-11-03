"use client";
import { useState, useEffect } from "react";
import { JournalEntry } from "@/lib/models";

export function MoodAnalysis({ entries, recentEntry }: { entries: JournalEntry[]; recentEntry?: JournalEntry }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (entries.length >= 3) {
      analyzeMood();
    }
  }, [entries.length]);

  async function analyzeMood() {
    if (entries.length < 3) {
      setError("Need at least 3 entries for mood analysis");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/mood-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, recentEntry }),
      });
      if (!res.ok) throw new Error("Failed to analyze mood");
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to analyze mood");
    } finally {
      setLoading(false);
    }
  }

  if (entries.length < 3) {
    return (
      <div className="mood-analysis-empty">
        <p>📊 Write at least 3 journal entries to unlock mood analysis</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mood-analysis-loading">
        <div className="loading-spinner">🤖 Analyzing your mood patterns...</div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="mood-analysis-error">
        <p>{error}</p>
        <button className="btn compact" onClick={analyzeMood}>Retry</button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mood-analysis-trigger">
        <button className="btn primary" onClick={analyzeMood}>
          🤖 Analyze My Mood Patterns
        </button>
      </div>
    );
  }

  const sentimentColor = analysis.sentimentScore > 0.7 
    ? "var(--accent-2)" 
    : analysis.sentimentScore > 0.4 
    ? "var(--accent)" 
    : "var(--danger)";

  const moodTrendEmoji = {
    improving: "📈",
    stable: "➡️",
    declining: "📉",
    fluctuating: "🌊"
  };

  return (
    <div className="mood-analysis">
      <div className="mood-header">
        <h4>📊 Mood Analysis</h4>
        <button className="btn compact" onClick={() => setAnalysis(null)}>Refresh</button>
      </div>

      <div className="mood-overview">
        <div className="mood-stat">
          <div className="mood-stat-label">Mood Trend</div>
          <div className="mood-stat-value">
            {moodTrendEmoji[analysis.moodTrend as keyof typeof moodTrendEmoji] || "📊"} 
            {analysis.moodTrend?.charAt(0).toUpperCase() + analysis.moodTrend?.slice(1)}
          </div>
        </div>
        <div className="mood-stat">
          <div className="mood-stat-label">Sentiment Score</div>
          <div className="mood-stat-value" style={{ color: sentimentColor }}>
            {Math.round(analysis.sentimentScore * 100)}%
          </div>
        </div>
      </div>

      {analysis.dominantEmotions && analysis.dominantEmotions.length > 0 && (
        <div className="mood-section">
          <h5>💭 Dominant Emotions</h5>
          <div className="emotions-list">
            {analysis.dominantEmotions.map((emotion: string, i: number) => (
              <span key={i} className="emotion-tag">{emotion}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.insights && analysis.insights.length > 0 && (
        <div className="mood-section">
          <h5>💡 Key Insights</h5>
          <ul className="insights-list">
            {analysis.insights.map((insight: string, i: number) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="mood-section">
          <h5>✨ Recommendations</h5>
          <ul className="recommendations-list">
            {analysis.recommendations.map((rec: string, i: number) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.growthAreas && analysis.growthAreas.length > 0 && (
        <div className="mood-section">
          <h5>🌱 Growth Areas</h5>
          <div className="growth-areas">
            {analysis.growthAreas.map((area: string, i: number) => (
              <div key={i} className="growth-tag">{area}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

