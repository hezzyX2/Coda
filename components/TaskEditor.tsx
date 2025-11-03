"use client";
import { useState } from "react";
import { Task } from "@/lib/models";

export function TaskEditor({ tasks, onChange }: { tasks: Task[]; onChange: (next: Task[]) => void; }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(2);
  const [estimateMins, setEstimateMins] = useState<number>(30);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [category, setCategory] = useState<string>("");

  function addTask() {
    if (!title.trim()) return;
    const next: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
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
    setPriority("medium");
    setCategory("");
  }

  const difficultyLabels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard"];

  return (
    <div className="task-editor-enhanced">
      <div className="form-grid">
        <label className="form-group-full">
          <span>Task Title</span>
          <input 
            className="input" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g., Study for biology exam, Complete essay draft..."
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
        </label>

        <label>
          <span>Due Date</span>
          <input 
            className="input" 
            type="date" 
            value={due} 
            onChange={(e) => setDue(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label>
          <span>Priority</span>
          <select 
            className="input" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as any)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label>
          <span>Difficulty: {difficultyLabels[difficulty - 1]}</span>
          <div className="range-container">
            <input 
              className="input range-input" 
              type="range" 
              min={1} 
              max={5} 
              value={difficulty} 
              onChange={(e) => setDifficulty(Number(e.target.value))} 
            />
            <div className="range-labels">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
        </label>

        <label>
          <span>Estimated Time</span>
          <div className="time-input-group">
            <input 
              className="input" 
              type="number" 
              min={5} 
              max={480} 
              step={5}
              value={estimateMins} 
              onChange={(e) => setEstimateMins(Number(e.target.value))} 
            />
            <span className="time-unit">minutes</span>
          </div>
        </label>

        <label className="form-group-full">
          <span>Category (Optional)</span>
          <input 
            className="input" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="e.g., School, Work, Personal..."
          />
        </label>
      </div>
      
      <button 
        className="btn primary large task-add-button" 
        onClick={addTask}
        disabled={!title.trim()}
      >
        ➕ Add Task
      </button>

      {tasks.length > 0 && (
        <div className="task-quick-stats">
          <span className="quick-stat">📋 {tasks.filter(t => !t.done).length} pending</span>
          <span className="quick-stat">✅ {tasks.filter(t => t.done).length} completed</span>
        </div>
      )}
    </div>
  );
}


