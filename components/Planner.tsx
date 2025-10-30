"use client";
import { Task } from "@/lib/models";
import { buildPlan } from "@/lib/planner";
import { loadPreferences } from "@/lib/storage";

export function Planner({ tasks }: { tasks: Task[] }) {
  const prefs = loadPreferences();
  const plan = buildPlan(tasks, prefs);
  return (
    <div className="planner">
      {plan.blocks.map((b) => (
        <div key={b.id} className={`plan-block ${b.type}`}>
          <div className="time">{b.startTime} – {b.endTime}</div>
          <div className="title">{b.type === "focus" ? b.taskTitle : "Break"}</div>
          {b.type === "focus" && <div className="subtitle">{b.estimateMins} mins</div>}
        </div>
      ))}
      {plan.blocks.length === 0 && <div className="muted">No plan yet. Add tasks to get started.</div>}
    </div>
  );
}


