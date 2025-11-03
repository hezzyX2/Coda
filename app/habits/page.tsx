"use client";
import { useEffect, useState } from "react";
import { Habit } from "@/lib/models";
import { loadHabits, saveHabits } from "@/lib/storage";
import { DiamondLogo } from "@/components/DiamondLogo";
import { HabitAnalysis } from "@/components/HabitAnalysis";

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  function updateHabits(next: Habit[]) {
    setHabits(next);
    saveHabits(next);
  }

  function addHabit() {
    if (!newHabitName.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName.trim(),
      category: selectedCategory || undefined,
      streak: 0,
      totalDays: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      targetFrequency: "daily",
      color: getRandomColor()
    };
    updateHabits([newHabit, ...habits]);
    setNewHabitName("");
    setSelectedCategory("");
  }

  function toggleHabit(id: string) {
    const today = new Date().toISOString().split("T")[0];
    updateHabits(habits.map(h => {
      if (h.id !== id) return h;
      const isCompleted = h.completedDates.includes(today);
      if (isCompleted) {
        return {
          ...h,
          completedDates: h.completedDates.filter(d => d !== today),
          streak: Math.max(0, h.streak - 1),
          totalDays: Math.max(0, h.totalDays - 1)
        };
      } else {
        const newStreak = calculateStreak([...h.completedDates, today]);
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: newStreak,
          totalDays: h.totalDays + 1
        };
      }
    }));
  }

  function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0;
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const date = new Date(sorted[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  function getRandomColor(): string {
    const colors = ["#9b87f5", "#00ffd1", "#ff9d6b", "#7ab8ff", "#6fc89e"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const activeHabits = habits.filter(h => h.streak > 0);

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">Habits</h1>
        <p className="page-subtitle">Build better habits with AI-powered insights</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{totalStreak}</div>
            <div className="stat-label">Total Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{habits.length}</div>
            <div className="stat-label">Total Habits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{activeHabits.length}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{habits.length > 0 ? Math.round((activeHabits.length / habits.length) * 100) : 0}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>➕ Add Habit</h2>
            <span className="card-subtitle">Track daily habits and build streaks</span>
          </div>
          <div className="form-grid">
            <label className="form-group-full">
              <span>Habit Name</span>
              <input
                className="input"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Exercise, Study, Meditate..."
                onKeyPress={(e) => e.key === "Enter" && addHabit()}
              />
            </label>
            <label>
              <span>Category (Optional)</span>
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">None</option>
                <option value="health">Health</option>
                <option value="study">Study</option>
                <option value="wellness">Wellness</option>
                <option value="personal">Personal</option>
              </select>
            </label>
            <button className="btn primary" onClick={addHabit} disabled={!newHabitName.trim()}>
              ➕ Add Habit
            </button>
          </div>
        </section>

        <section className="card glass">
          <div className="card-header">
            <h2>🔥 Your Habits</h2>
            <span className="card-subtitle">{habits.length} habits tracked</span>
          </div>
          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-text">No habits yet. Start building better habits today!</p>
            </div>
          ) : (
            <div className="habits-list">
              {habits.map(habit => {
                const today = new Date().toISOString().split("T")[0];
                const isCompleted = habit.completedDates.includes(today);
                return (
                  <div key={habit.id} className={`habit-card ${isCompleted ? "completed" : ""}`}>
                    <div className="habit-main">
                      <div className="habit-icon" style={{ backgroundColor: habit.color || "#9b87f5" }}>
                        {isCompleted ? "✅" : "⭕"}
                      </div>
                      <div className="habit-content">
                        <div className="habit-name">{habit.name}</div>
                        <div className="habit-meta">
                          <span className="streak-badge">🔥 {habit.streak} day streak</span>
                          {habit.category && (
                            <span className="category-badge">{habit.category}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`btn ${isCompleted ? "success" : "primary"}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {isCompleted ? "✓ Done" : "Mark Done"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* AI Habit Analysis */}
      {habits.length > 0 && (
        <section className="card glass habit-analysis-section" style={{ marginTop: "32px" }}>
          <div className="card-header">
            <h2>🤖 AI Habit Analysis</h2>
            <span className="card-subtitle">Get personalized insights on your habits</span>
          </div>
          <HabitAnalysis habits={habits} />
        </section>
      )}
    </div>
  );
}

