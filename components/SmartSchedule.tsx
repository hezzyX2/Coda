"use client";
import { useState, useEffect } from "react";
import { Task } from "@/lib/models";
import { loadPreferences } from "@/lib/storage";

export function SmartSchedule({ tasks }: { tasks: Task[] }) {
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const prefs = loadPreferences();
  const pendingTasks = tasks.filter(t => !t.done);

  useEffect(() => {
    if (pendingTasks.length === 0) {
      setSchedule(null);
    }
  }, [tasks]);

  async function generateSchedule() {
    if (pendingTasks.length === 0) {
      setError("No pending tasks to schedule");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/smart-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tasks: pendingTasks,
          preferences: prefs 
        }),
      });
      if (!res.ok) throw new Error("Failed to generate schedule");
      const data = await res.json();
      setSchedule(data.schedule);
    } catch (err: any) {
      setError(err.message || "Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  }

  if (pendingTasks.length === 0) {
    return (
      <div className="smart-schedule-empty">
        <p>🎉 All tasks completed! No schedule needed.</p>
      </div>
    );
  }

  if (schedule) {
    return (
      <div className="smart-schedule">
        <div className="schedule-header">
          <h4>📅 AI-Generated Schedule</h4>
          <button className="btn compact" onClick={() => setSchedule(null)}>Reset</button>
        </div>
        <div className="schedule-timeline">
          {schedule.schedule?.map((block: any, i: number) => (
            <div key={i} className={`schedule-block ${block.type}`}>
              <div className="schedule-time">
                <span className="time-start">{block.startTime}</span>
                <span className="time-arrow">→</span>
                <span className="time-end">{block.endTime}</span>
              </div>
              {block.type === "focus" ? (
                  <div className="schedule-task">
                  <div className="schedule-task-title">{block.taskTitle}</div>
                  <div className={`schedule-priority priority-${block.priority}`}>
                    {block.priority}
                  </div>
                  {block.reason && (
                    <div className="schedule-reason">💡 {block.reason}</div>
                  )}
                </div>
              ) : (
                <div className="schedule-break">☕ Break time</div>
              )}
            </div>
          ))}
        </div>
        {schedule.productivityTips && schedule.productivityTips.length > 0 && (
          <div className="schedule-tips">
            <h5>💡 Productivity Tips</h5>
            <ul>
              {schedule.productivityTips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        {schedule.estimatedCompletion && (
          <div className="schedule-completion">
            <strong>Estimated completion:</strong> {schedule.estimatedCompletion}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="smart-schedule-trigger">
      <button
        className="btn primary"
        onClick={generateSchedule}
        disabled={loading}
      >
        {loading ? "🤖 Creating Schedule..." : "🤖 Generate AI Schedule"}
      </button>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

