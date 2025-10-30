"use client";
import { useState, useEffect } from "react";
import { getCurrentUser, isPremium } from "@/lib/auth";
import { DiamondLogo } from "@/components/DiamondLogo";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AppStats {
  totalUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  totalTasks: number;
  totalJournalEntries: number;
  aiRequests: number;
  timestamp: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    // Only allow admin access (you can add email check here)
    if (!user) {
      router.push("/login");
      return;
    }

    loadStats();
    const interval = setInterval(loadStats, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [router, user]);

  async function loadStats() {
    try {
      setLoading(true);
      // In production, this would call your backend API
      // For now, calculate from localStorage
      const stats = calculateLocalStats();
      setStats(stats);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function calculateLocalStats() {
    // Calculate stats from localStorage (client-side)
    // In production, this should come from a backend API
    const users = JSON.parse(localStorage.getItem("coda.users.v1") || "[]");
    const tasks = JSON.parse(localStorage.getItem("coda.tasks.v1") || "[]");
    const journals = JSON.parse(localStorage.getItem("coda.journal.v1") || "[]");
    
    const premiumUsers = users.filter((u: any) => u.isPremium).length;
    const activeSubs = users.filter((u: any) => 
      u.subscriptionStatus === "active" || u.subscriptionStatus === "trialing"
    ).length;

    return {
      totalUsers: users.length,
      premiumUsers,
      totalRevenue: premiumUsers * 9.99, // Estimate
      monthlyRecurringRevenue: activeSubs * 9.99,
      activeSubscriptions: activeSubs,
      canceledSubscriptions: users.filter((u: any) => u.subscriptionStatus === "canceled").length,
      totalTasks: tasks.length,
      totalJournalEntries: journals.length,
      aiRequests: 0, // Would track separately
      timestamp: new Date().toISOString(),
    };
  }

  if (!user) return null;

  return (
    <div className="page fade-in">
      <div className="admin-header">
        <div className="admin-brand">
          <DiamondLogo size={48} animated={true} />
          <h1 className="page-title">Admin Dashboard</h1>
        </div>
        <Link href="/" className="btn secondary">← Back to App</Link>
      </div>

      {error && (
        <div className="auth-error">{error}</div>
      )}

      {loading ? (
        <div className="loading-spinner-container">
          <DiamondLogo size={48} animated={true} />
          <p className="loading-text">Loading statistics...</p>
        </div>
      ) : stats ? (
        <>
          {/* Revenue Overview */}
          <section className="card glass">
            <h2>💰 Revenue Overview</h2>
            <div className="stats-grid">
              <div className="stat-card revenue-card">
                <div className="stat-icon">💵</div>
                <div className="stat-content">
                  <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
              </div>
              <div className="stat-card revenue-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <div className="stat-value">${stats.monthlyRecurringRevenue.toFixed(2)}</div>
                  <div className="stat-label">Monthly Recurring Revenue</div>
                </div>
              </div>
              <div className="stat-card revenue-card">
                <div className="stat-icon">✨</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.activeSubscriptions}</div>
                  <div className="stat-label">Active Subscriptions</div>
                </div>
              </div>
              <div className="stat-card revenue-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.canceledSubscriptions}</div>
                  <div className="stat-label">Canceled</div>
                </div>
              </div>
            </div>
          </section>

          {/* User Metrics */}
          <section className="card glass">
            <h2>👥 User Metrics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✨</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.premiumUsers}</div>
                  <div className="stat-label">Premium Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalTasks}</div>
                  <div className="stat-label">Total Tasks Created</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📖</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalJournalEntries}</div>
                  <div className="stat-label">Journal Entries</div>
                </div>
              </div>
            </div>
            <div className="conversion-rate">
              <p>
                <strong>Conversion Rate:</strong>{" "}
                {stats.totalUsers > 0
                  ? ((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)
                  : "0"}
                %
              </p>
            </div>
          </section>

          {/* AI Usage */}
          <section className="card glass">
            <h2>🤖 AI Usage</h2>
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <div className="stat-value">{stats.aiRequests}</div>
                <div className="stat-label">Total AI Requests</div>
              </div>
            </div>
            <p className="muted" style={{ marginTop: "16px" }}>
              Track AI API usage to monitor costs and usage patterns.
            </p>
          </section>

          {/* Last Updated */}
          <div className="admin-footer">
            <p className="muted">
              Last updated: {new Date(stats.timestamp).toLocaleString()}
            </p>
            <button className="btn secondary" onClick={loadStats}>
              🔄 Refresh Stats
            </button>
          </div>
        </>
      ) : null}

      {/* Stripe Integration Info */}
      <section className="card glass">
        <h2>🔧 Payment Setup</h2>
        <div className="setup-info">
          <h3>Stripe Configuration</h3>
          <p>To receive payments, you need to:</p>
          <ol className="setup-steps">
            <li>Sign up at <a href="https://stripe.com" target="_blank" rel="noopener">stripe.com</a></li>
            <li>Get your API keys from Stripe Dashboard</li>
            <li>Set environment variables:
              <ul>
                <li><code>STRIPE_SECRET_KEY</code> - Your Stripe secret key</li>
                <li><code>STRIPE_WEBHOOK_SECRET</code> - Webhook signing secret</li>
              </ul>
            </li>
            <li>Set up webhook endpoint: <code>/api/stripe/webhook</code></li>
            <li>Configure webhook events in Stripe Dashboard:
              <ul>
                <li><code>checkout.session.completed</code></li>
                <li><code>customer.subscription.updated</code></li>
                <li><code>customer.subscription.deleted</code></li>
                <li><code>invoice.payment_succeeded</code></li>
                <li><code>invoice.payment_failed</code></li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      {/* Stripe Dashboard Links */}
      <section className="card glass">
        <h2>📊 Stripe Dashboard</h2>
        <div className="dashboard-links">
          <a
            href="https://dashboard.stripe.com/payments"
            target="_blank"
            rel="noopener"
            className="btn secondary"
          >
            View Payments →
          </a>
          <a
            href="https://dashboard.stripe.com/subscriptions"
            target="_blank"
            rel="noopener"
            className="btn secondary"
          >
            View Subscriptions →
          </a>
          <a
            href="https://dashboard.stripe.com/customers"
            target="_blank"
            rel="noopener"
            className="btn secondary"
          >
            View Customers →
          </a>
        </div>
      </section>
    </div>
  );
}

