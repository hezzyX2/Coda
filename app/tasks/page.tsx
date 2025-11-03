"use client";
import { useEffect, useState } from "react";
import { Task } from "@/lib/models";
import { loadTasks, saveTasks } from "@/lib/storage";
import { TaskEditor } from "@/components/TaskEditor";
import { TaskList } from "@/components/TaskList";
import { SmartSchedule } from "@/components/SmartSchedule";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  function updateTasks(next: Task[]) {
    setTasks(next);
    saveTasks(next);
  }

  const filteredTasks = filter === "all" 
    ? tasks 
    : filter === "completed"
    ? tasks.filter(t => t.done)
    : tasks.filter(t => !t.done);

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);
  const urgentTasks = pendingTasks.filter(t => t.due && new Date(t.due) <= new Date(Date.now() + 86400000 * 2));

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">Manage your tasks and stay organized</p>
      </div>

      {/* Task Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{pendingTasks.length}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{completedTasks.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">{urgentTasks.length}</div>
            <div className="stat-label">Urgent</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </button>
        <button 
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({pendingTasks.length})
        </button>
        <button 
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed ({completedTasks.length})
        </button>
      </div>

      {urgentTasks.length > 0 && (
        <section className="card glass urgent-tasks">
          <h3>🔥 Urgent Tasks (Due Soon)</h3>
          <p className="urgent-description">These tasks are due within the next 2 days</p>
          <TaskList tasks={urgentTasks} onChange={updateTasks} />
        </section>
      )}

      {/* AI Smart Schedule Section */}
      {pendingTasks.length > 0 && (
        <section className="card glass smart-schedule-section">
          <div className="card-header">
            <h2>🤖 AI Smart Schedule</h2>
            <span className="card-subtitle">Let AI create the perfect schedule for your day</span>
          </div>
          <SmartSchedule tasks={tasks} />
        </section>
      )}

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>➕ Add / Edit Task</h2>
            <span className="card-subtitle">Create and manage your tasks</span>
          </div>
          <TaskEditor onChange={updateTasks} tasks={tasks} />
        </section>
        <section className="card glass">
          <div className="card-header">
            <h2>📝 Your Tasks</h2>
            <span className="card-subtitle">
              {filteredTasks.length} {filter === "all" ? "total" : filter} task{filteredTasks.length !== 1 ? "s" : ""}
              {filteredTasks.length > 0 && !filteredTasks[0].done && (
                <span className="pending-count"> · {pendingTasks.length} pending</span>
              )}
            </span>
          </div>
          <TaskList tasks={filteredTasks} onChange={updateTasks} />
        </section>
      </div>
    </div>
  );
}


