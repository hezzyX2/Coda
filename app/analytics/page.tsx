"use client";
import { useEffect, useState } from "react";
import { loadTasks, loadJournal, loadHabits } from "@/lib/storage";
import { Task, JournalEntry, Habit } from "@/lib/models";

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("month");

  useEffect(() => {
    setTasks(loadTasks());
    setJournalEntries(loadJournal());
    setHabits(loadHabits());
  }, []);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const filterByTimeframe = <T extends { createdAt?: string; due?: string }>(items: T[]): T[] => {
    if (timeframe === "all") return items;
    if (timeframe === "week") {
      return items.filter(item => {
        const date = item.createdAt ? new Date(item.createdAt) : (item.due ? new Date(item.due) : null);
        return date && date >= weekAgo;
      });
    }
    return items.filter(item => {
      const date = item.createdAt ? new Date(item.createdAt) : (item.due ? new Date(item.due) : null);
      return date && date >= monthAgo;
    });
  };

  const filteredTasks = filterByTimeframe(tasks);
  const filteredEntries = filterByTimeframe(journalEntries);
  const completedTasks = filteredTasks.filter(t => t.done);
  const completionRate = filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0;
  const totalTimeSpent = completedTasks.reduce((sum, t) => sum + t.estimateMins, 0);
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  // Weekly activity chart data
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split("T")[0];
    return {
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      tasks: filteredTasks.filter(t => t.due === dateStr || new Date(t.due || "").toDateString() === date.toDateString()).length,
      entries: filteredEntries.filter(e => e.createdAt.startsWith(dateStr)).length,
    };
  });

  const maxActivity = Math.max(...weeklyActivity.map(d => d.tasks + d.entries), 1);

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">📊 Analytics Dashboard</h1>
        <p className="page-subtitle">Track your productivity and see your progress</p>
      </div>

      <div className="analytics-controls">
        <button
          className={`btn ${timeframe === "week" ? "primary" : "secondary"}`}
          onClick={() => setTimeframe("week")}
        >
          Week
        </button>
        <button
          className={`btn ${timeframe === "month" ? "primary" : "secondary"}`}
          onClick={() => setTimeframe("month")}
        >
          Month
        </button>
        <button
          className={`btn ${timeframe === "all" ? "primary" : "secondary"}`}
          onClick={() => setTimeframe("all")}
        >
          All Time
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card enhanced">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedTasks.length}</div>
            <div className="stat-label">Tasks Completed</div>
            <div className="stat-change">+{completionRate.toFixed(1)}% completion rate</div>
          </div>
        </div>
        <div className="stat-card enhanced">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(totalTimeSpent / 60)}</div>
            <div className="stat-label">Hours Spent</div>
            <div className="stat-change">{totalTimeSpent} minutes total</div>
          </div>
        </div>
        <div className="stat-card enhanced">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{filteredEntries.length}</div>
            <div className="stat-label">Journal Entries</div>
            <div className="stat-change">Words: {filteredEntries.reduce((sum, e) => sum + e.text.length, 0)}</div>
          </div>
        </div>
        <div className="stat-card enhanced">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{totalStreak}</div>
            <div className="stat-label">Total Streak</div>
            <div className="stat-change">{habits.length} habits tracked</div>
          </div>
        </div>
      </div>

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>📈 Completion Rate</h2>
            <span className="card-subtitle">Task completion over time</span>
          </div>
          <div className="chart-container">
            <div className="progress-ring">
              <svg width="200" height="200" className="progress-svg">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className="progress-circle"
                />
              </svg>
              <div className="progress-center">
                <div className="progress-percentage">{completionRate.toFixed(0)}%</div>
                <div className="progress-label">Complete</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card glass">
          <div className="card-header">
            <h2>📊 Weekly Activity</h2>
            <span className="card-subtitle">Tasks and journal entries</span>
          </div>
          <div className="activity-chart">
            {weeklyActivity.map((day, i) => (
              <div key={i} className="activity-day">
                <div className="activity-bar-container">
                  <div
                    className="activity-bar tasks"
                    style={{ height: `${(day.tasks / maxActivity) * 100}%` }}
                    title={`${day.tasks} tasks`}
                  />
                  <div
                    className="activity-bar entries"
                    style={{ height: `${(day.entries / maxActivity) * 100}%` }}
                    title={`${day.entries} entries`}
                  />
                </div>
                <div className="activity-label">{day.date}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color tasks"></div>
              <span>Tasks</span>
            </div>
            <div className="legend-item">
              <div className="legend-color entries"></div>
              <span>Entries</span>
            </div>
          </div>
        </section>
      </div>

      <section className="card glass">
        <div className="card-header">
          <h2>🎯 Productivity Insights</h2>
          <span className="card-subtitle">AI-powered analysis</span>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <div className="insight-content">
              <h4>Average Task Time</h4>
              <p>{filteredTasks.length > 0 ? Math.round(filteredTasks.reduce((sum, t) => sum + t.estimateMins, 0) / filteredTasks.length) : 0} minutes</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <h4>Most Productive Day</h4>
              <p>{weeklyActivity.reduce((max, day) => (day.tasks + day.entries) > (max.tasks + max.entries) ? day : max, weeklyActivity[0])?.date || "N/A"}</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Consistency Score</h4>
              <p>{habits.length > 0 ? Math.round((habits.filter(h => h.streak > 0).length / habits.length) * 100) : 0}%</p>
            </div>
          </div>
          <div className="insight-card">
            <div className="insight-icon">💪</div>
            <div className="insight-content">
              <h4>Longest Streak</h4>
              <p>{habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0} days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

