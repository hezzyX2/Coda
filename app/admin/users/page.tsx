"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

interface User {
  email: string;
  name: string;
  createdAt: string;
  isPremium: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
}

export default function AdminUsersPage() {
  const user = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    try {
      // Get all users from localStorage
      const stored = localStorage.getItem("codak.users.v1") || localStorage.getItem("coda.users.v1");
      if (stored) {
        const allUsers = JSON.parse(stored) as User[];
        setUsers(allUsers.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to load users:", err);
      setLoading(false);
    }
  }

  // Check if user is admin
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
    user?.email?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <h2>🔒 Access Denied</h2>
          <p>You must be an administrator to view user accounts.</p>
        </div>
      </div>
    );
  }

  function getPasswordHash(email: string): string | null {
    const key = `codak.password.${email.toLowerCase()}`;
    const legacyKey = `coda.password.${email.toLowerCase()}`;
    return localStorage.getItem(key) || localStorage.getItem(legacyKey);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">👥 User Accounts</h1>
        <p className="page-subtitle">View all registered users and their account information</p>
      </div>

      {loading ? (
        <div className="loading-spinner-container">
          <p className="loading-text">Loading users...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: "32px" }}>
            <div className="stat-card glass">
              <div className="stat-icon">👤</div>
              <div>
                <div className="stat-value">{users.length}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">✨</div>
              <div>
                <div className="stat-value">
                  {users.filter(u => u.isPremium).length}
                </div>
                <div className="stat-label">Premium Users</div>
              </div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon">📅</div>
              <div>
                <div className="stat-value">
                  {users.filter(u => {
                    const created = new Date(u.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return created > weekAgo;
                  }).length}
                </div>
                <div className="stat-label">New This Week</div>
              </div>
            </div>
          </div>

          <div className="card glass">
            <div className="card-header">
              <h2>All Registered Users ({users.length})</h2>
              <button className="btn secondary" onClick={loadUsers}>
                🔄 Refresh
              </button>
            </div>

            {users.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px" }}>
                <p>No users registered yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Name</th>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Email</th>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Account Type</th>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Created</th>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Password Hash</th>
                      <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => {
                      const passwordHash = getPasswordHash(u.email);
                      return (
                        <tr 
                          key={index}
                          style={{ 
                            borderBottom: "1px solid var(--border)",
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "12px", fontSize: "13px", fontWeight: "500" }}>
                            {u.name}
                          </td>
                          <td style={{ padding: "12px", fontSize: "13px" }}>
                            {u.email}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              background: u.isPremium ? "rgba(88, 176, 140, 0.2)" : "rgba(255,255,255,0.1)",
                              color: u.isPremium ? "var(--accent)" : "var(--muted)",
                              textTransform: "uppercase"
                            }}>
                              {u.isPremium ? "✨ Premium" : "Free"}
                            </span>
                          </td>
                          <td style={{ padding: "12px", fontSize: "12px", color: "var(--muted)" }}>
                            {formatDate(u.createdAt)}
                          </td>
                          <td style={{ padding: "12px", fontSize: "11px", fontFamily: "monospace", color: "var(--muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {passwordHash ? `${passwordHash.substring(0, 16)}...` : "❌ Not found"}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              display: "inline-block",
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: passwordHash ? "var(--accent)" : "var(--danger)",
                              marginRight: "8px"
                            }}></span>
                            <span style={{ fontSize: "13px" }}>
                              {passwordHash ? "Active" : "No Password"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card glass" style={{ marginTop: "24px" }}>
            <div className="card-header">
              <h2>📋 Storage Information</h2>
            </div>
            <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
              <p><strong>Storage Location:</strong> Browser localStorage</p>
              <p><strong>Users List Key:</strong> <code>codak.users.v1</code></p>
              <p><strong>Password Hash Keys:</strong> <code>codak.password.&#123;email&#125;</code></p>
              <p><strong>Total Users:</strong> {users.length}</p>
              <p><strong>Storage Type:</strong> Client-side (browser localStorage)</p>
              <p style={{ marginTop: "16px", color: "var(--muted)", fontSize: "13px" }}>
                ⚠️ Note: Data is stored locally in the browser. If users clear their browser data, accounts will be lost. 
                For production, consider migrating to a backend database.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

