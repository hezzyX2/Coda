"use client";
import { useState } from "react";
import { DiamondLogo } from "@/components/DiamondLogo";

export default function StudyPage() {
  const [subjects, setSubjects] = useState<Array<{name: string; difficulty: number; hoursNeeded: number; examDate?: string}>>([]);
  const [newSubject, setNewSubject] = useState("");
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [availableHours, setAvailableHours] = useState(20);
  const [learningStyle, setLearningStyle] = useState<string>("flexible");

  function addSubject() {
    if (!newSubject.trim()) return;
    setSubjects([...subjects, {
      name: newSubject.trim(),
      difficulty: 3,
      hoursNeeded: 10
    }]);
    setNewSubject("");
  }

  async function generateStudyPlan() {
    if (subjects.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects,
          availableHours,
          learningStyle,
          preferences: {
            studyBlocks: 25,
            breakMinutes: 5
          }
        }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setStudyPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">🤖 AI Study Planner</h1>
        <p className="page-subtitle">Get a personalized, adaptive study plan powered by AI</p>
      </div>

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>📚 Your Subjects</h2>
            <span className="card-subtitle">Add subjects you need to study</span>
          </div>
          <div className="form-grid">
            <label className="form-group-full">
              <span>Subject Name</span>
              <input
                className="input"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g., Biology, Calculus, History..."
                onKeyPress={(e) => e.key === "Enter" && addSubject()}
              />
            </label>
            <label>
              <span>Available Hours/Week</span>
              <input
                className="input"
                type="number"
                min={1}
                max={40}
                value={availableHours}
                onChange={(e) => setAvailableHours(Number(e.target.value))}
              />
            </label>
            <label>
              <span>Learning Style</span>
              <select className="input" value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
                <option value="flexible">Flexible</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="kinesthetic">Kinesthetic</option>
                <option value="reading">Reading</option>
              </select>
            </label>
            <button className="btn primary" onClick={addSubject} disabled={!newSubject.trim()}>
              ➕ Add Subject
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="subjects-list" style={{ marginTop: "20px" }}>
              {subjects.map((s, i) => (
                <div key={i} className="subject-card">
                  <span>{s.name}</span>
                  <button className="btn compact danger" onClick={() => setSubjects(subjects.filter((_, idx) => idx !== i))}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {subjects.length > 0 && (
            <button
              className="btn primary large"
              onClick={generateStudyPlan}
              disabled={loading}
              style={{ marginTop: "20px", width: "100%" }}
            >
              {loading ? "🤖 Generating Plan..." : "🤖 Generate AI Study Plan"}
            </button>
          )}
        </section>

        <section className="card glass">
          <div className="card-header">
            <h2>📅 Study Schedule</h2>
            <span className="card-subtitle">AI-generated personalized plan</span>
          </div>
          {!studyPlan ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <p className="empty-text">Add subjects and generate your AI study plan!</p>
            </div>
          ) : (
            <div className="study-plan-display">
              {studyPlan.weeklySchedule?.map((day: any, i: number) => (
                <div key={i} className="study-day">
                  <h4>{day.day}</h4>
                  {day.sessions?.map((session: any, j: number) => (
                    <div key={j} className="study-session">
                      <div className="session-time">{session.time} ({session.duration} mins)</div>
                      <div className="session-subject">{session.subject}</div>
                      <div className="session-method">Method: {session.method}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

