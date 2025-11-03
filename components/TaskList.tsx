"use client";
import { Task } from "@/lib/models";
import { TaskBreakdown } from "./TaskBreakdown";
import { useState } from "react";

export function TaskList({ tasks, onChange }: { tasks: Task[]; onChange: (next: Task[]) => void; }) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  
  function toggle(id: string) {
    onChange(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id: string) {
    onChange(tasks.filter(t => t.id !== id));
  }

  function getPriority(task: Task): "high" | "medium" | "low" {
    if (task.done) return "low";
    if (!task.due) return "medium";
    const dueDate = new Date(task.due);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue <= 1) return "high";
    if (daysUntilDue <= 3) return "medium";
    return "low";
  }

  function getDifficultyColor(difficulty: number): string {
    if (difficulty <= 2) return "var(--accent-2)";
    if (difficulty <= 3) return "var(--accent)";
    return "var(--danger)";
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const aPriority = getPriority(a);
    const bPriority = getPriority(b);
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  });

  return (
    <ul className="task-list-enhanced">
      {sortedTasks.map(t => {
        const priority = getPriority(t);
        const isExpanded = expandedTask === t.id;
        return (
          <li key={t.id} className={`task-card ${t.done ? "done" : ""} priority-${priority}`}>
            <div className="task-card-header">
              <div className="task-main">
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggle(t.id)}
                    className="task-check"
                  />
                </div>
                <div className="task-content">
                  <div className={`item-title ${t.done ? "strikethrough" : ""}`}>{t.title}</div>
                  <div className="task-meta">
                    <span className="task-meta-item">
                      {t.due ? (
                        <span className={`due-date ${priority === "high" ? "urgent" : ""}`}>
                          📅 {new Date(t.due).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="no-due">No due date</span>
                      )}
                    </span>
                    <span className="task-meta-item">
                      <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(t.difficulty) }}>
                        Difficulty {t.difficulty}/5
                      </span>
                    </span>
                    <span className="task-meta-item">
                      ⏱️ {t.estimateMins} mins
                    </span>
                  </div>
                </div>
              </div>
              <div className="task-actions">
                {!t.done && (
                  <button 
                    className="btn compact"
                    onClick={() => setExpandedTask(isExpanded ? null : t.id)}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                )}
                <button className="btn compact danger" onClick={() => remove(t.id)}>🗑️</button>
              </div>
            </div>
            {isExpanded && !t.done && (
              <div className="task-expanded">
                <TaskBreakdown task={t} />
              </div>
            )}
          </li>
        );
      })}
      {tasks.length === 0 && (
        <li className="empty-state-task">
          <div className="empty-icon">📝</div>
          <p className="empty-text">No tasks yet. Create one to get started!</p>
        </li>
      )}
    </ul>
  );
}


