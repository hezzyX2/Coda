"use client";
import { TipsPanel } from "@/components/TipsPanel";
import { Planner } from "@/components/Planner";
import { useEffect, useState } from "react";
import { loadTasks, loadJournal } from "@/lib/storage";
import { Task } from "@/lib/models";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    journalEntries: 0
  });
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const allTasks = loadTasks();
    setTasks(allTasks);
    const journal = loadJournal();
    setStats({
      total: allTasks.length,
      completed: allTasks.filter(t => t.done).length,
      pending: allTasks.filter(t => !t.done).length,
      journalEntries: journal.length
    });
  }, [router]);

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your productivity hub and daily overview</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{stats.journalEntries}</div>
            <div className="stat-label">Journal Entries</div>
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <section className="card glass progress-card">
          <h3>Progress</h3>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${completionRate}%` }}>
              <span className="progress-text">{completionRate}%</span>
            </div>
          </div>
          <p className="progress-description">
            You've completed {stats.completed} of {stats.total} tasks. Keep it up!
          </p>
        </section>
      )}

      <div className="grid two">
        <section className="card glass">
          <div className="card-header">
            <h2>📅 Today's Plan</h2>
            <Link href="/tasks" className="link-button">Manage Tasks →</Link>
          </div>
          <Planner tasks={tasks} />
        </section>
        <section className="card glass">
          <div className="card-header">
            <h2>🤖 AI Tips</h2>
            <span className="card-subtitle">Personalized guidance for your tasks</span>
          </div>
          <TipsPanel tasks={tasks} />
        </section>
      </div>

      {/* Quick Actions */}
      <section className="card glass quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <Link href="/tasks" className="action-card">
            <div className="action-icon">➕</div>
            <div className="action-text">Add New Task</div>
          </Link>
          <Link href="/journal" className="action-card">
            <div className="action-icon">📔</div>
            <div className="action-text">Write Journal Entry</div>
          </Link>
          <Link href="/chat" className="action-card">
            <div className="action-icon">💬</div>
            <div className="action-text">Chat with Coda</div>
          </Link>
          <Link href="/wisdom" className="action-card">
            <div className="action-icon">✨</div>
            <div className="action-text">Read Wisdom</div>
          </Link>
        </div>
      </section>
    </div>
  );
}


