"use client";
import { useEffect, useMemo, useState } from "react";
import { JournalEntry } from "@/lib/models";
import { loadJournal, saveJournal, loadPreferences } from "@/lib/storage";
import { prompts } from "@/data/prompts";
import { JournalAdvice } from "@/components/JournalAdvice";
import { MoodAnalysis } from "@/components/MoodAnalysis";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);

  const prefs = loadPreferences();

  useEffect(() => {
    const existing = loadJournal();
    setEntries(existing);
    setQuestionIndex(existing.length % prompts.length);
  }, []);

  const currentPrompt = useMemo(() => {
    const base = prompts[questionIndex] ?? prompts[0];
    if (!prefs?.tone) return base;
    return `${base} (${prefs.tone} tone)`;
  }, [questionIndex, prefs]);

  function submitEntry() {
    if (!text.trim()) return;
    const next: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      prompt: currentPrompt,
      text
    };
    const all = [next, ...entries];
    setEntries(all);
    saveJournal(all);
    setText("");
    setQuestionIndex((prev) => (prev + 1) % prompts.length);
  }

  const weeklyEntries = entries.filter(e => {
    const entryDate = new Date(e.createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return entryDate >= weekAgo;
  });

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">Journal</h1>
        <p className="page-subtitle">Reflect on your journey and track your growth</p>
      </div>

      {/* Journal Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{entries.length}</div>
            <div className="stat-label">Total Entries</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{weeklyEntries.length}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💭</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(entries.reduce((sum, e) => sum + e.text.length, 0) / 100)}</div>
            <div className="stat-label">Words Written</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{entries.length > 0 ? Math.round((weeklyEntries.length / 7) * 100) : 0}%</div>
            <div className="stat-label">Weekly Goal</div>
          </div>
        </div>
      </div>

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>✍️ Today's Reflection</h2>
            <span className="card-subtitle">Prompts rotate daily</span>
          </div>
          <div className="prompt-display">
            <div className="prompt-icon">💫</div>
            <p className="prompt-text">{currentPrompt}</p>
          </div>
          <textarea
            className="input textarea"
            rows={10}
            placeholder="Write your thoughts, feelings, and reflections here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn primary" onClick={submitEntry} disabled={!text.trim()}>
            💾 Save Entry
          </button>
        </section>
        <section className="card glass">
          <div className="card-header">
            <h2>📚 Your Entries</h2>
            <span className="card-subtitle">{entries.length} total entries</span>
          </div>
          <div className="entries-container">
            {entries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-text">No entries yet. Start your journaling journey!</p>
              </div>
            ) : (
              <ul className="list vertical">
                {entries.map((e) => (
                  <li key={e.id} className="item journal-entry">
                    <div className="entry-header">
                      <div className="item-title">{new Date(e.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="item-subtitle">{e.prompt}</div>
                    <p className="item-body">{e.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* AI Mood Analysis Section */}
      {entries.length > 0 && (
        <section className="card glass mood-analysis-section">
          <div className="card-header">
            <h2>📊 AI Mood Analysis</h2>
            <span className="card-subtitle">Discover patterns in your emotional journey</span>
          </div>
          <MoodAnalysis entries={entries} recentEntry={entries[0]} />
        </section>
      )}

      <JournalAdvice entries={entries} />
    </div>
  );
}


