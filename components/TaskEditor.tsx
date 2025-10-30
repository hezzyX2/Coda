"use client";
import { useState } from "react";
import { Task } from "@/lib/models";

export function TaskEditor({ tasks, onChange }: { tasks: Task[]; onChange: (next: Task[]) => void; }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(2);
  const [estimateMins, setEstimateMins] = useState<number>(30);

  function addTask() {
    if (!title.trim()) return;
    const next: Task = {
      id: crypto.randomUUID(),
      title,
      due: due || undefined,
      difficulty,
      estimateMins,
      done: false
    };
    onChange([next, ...tasks]);
    setTitle("");
    setDue("");
    setDifficulty(2);
    setEstimateMins(30);
  }

  return (
    <div className="form-grid">
      <label>
        <span>Title</span>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Read chapter 3" />
      </label>
      <label>
        <span>Due</span>
        <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
      </label>
      <label>
        <span>Difficulty</span>
        <input className="input" type="range" min={1} max={5} value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />
      </label>
      <label>
        <span>Estimate (mins)</span>
        <input className="input" type="number" min={5} max={480} value={estimateMins} onChange={(e) => setEstimateMins(Number(e.target.value))} />
      </label>
      <button className="btn primary" onClick={addTask}>Add Task</button>
    </div>
  );
}


