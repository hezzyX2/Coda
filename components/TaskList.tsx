"use client";
import { Task } from "@/lib/models";

export function TaskList({ tasks, onChange }: { tasks: Task[]; onChange: (next: Task[]) => void; }) {
  function toggle(id: string) {
    onChange(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id: string) {
    onChange(tasks.filter(t => t.id !== id));
  }
  return (
    <ul className="list vertical">
      {tasks.map(t => (
        <li key={t.id} className={`item ${t.done ? "done" : ""}`}>
          <div className="item-title">{t.title}</div>
          <div className="item-subtitle">
            {t.due ? `Due ${new Date(t.due).toLocaleDateString()}` : "No due date"} · 
            Difficulty {t.difficulty} · {t.estimateMins} mins
          </div>
          <div className="item-actions">
            <button className="btn" onClick={() => toggle(t.id)}>{t.done ? "Undo" : "Done"}</button>
            <button className="btn danger" onClick={() => remove(t.id)}>Delete</button>
          </div>
        </li>
      ))}
      {tasks.length === 0 && <li className="muted">No tasks yet.</li>}
    </ul>
  );
}


