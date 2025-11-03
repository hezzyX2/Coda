"use client";
import { useEffect, useState } from "react";
import { getLoginLogs } from "@/lib/verification";
import { LoginLog } from "@/lib/models";
import { getCurrentUser } from "@/lib/auth";

export default function LoginLogsPage() {
  const user = getCurrentUser();
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  function loadLogs() {
    const allLogs = getLoginLogs();
    setLogs(allLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }

  // Check if user is admin
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
    user?.email?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_EMAIL.toLowerCase();

  if (!isAdmin) {
    return (
      <div className="page fade-in">
        <div className="empty-state">
          <h2>🔒 Access Denied</h2>
          <p>You must be an administrator to view login logs.</p>
        </div>
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    if (searchEmail && !log.email.toLowerCase().includes(searchEmail.toLowerCase())) {
      return false;
    }
    if (filter === "all") return true;
    if (filter === "success") return log.success;
    if (filter === "failed") return !log.success;
    return log.type === filter;
  });

  const stats = {
    total: logs.length,
    successes: logs.filter(l => l.success).length,
    failures: logs.filter(l => !l.success).length,
    uniqueUsers: new Set(logs.map(l => l.email.toLowerCase())).size,
  };

  function getStatusColor(type: LoginLog["type"], success: boolean) {
    if (success) return "var(--accent)";
    return "var(--danger)";
  }

  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className="page fade-in">
      <div className="dashboard-header">
        <h1 className="page-title">📊 Login Audit Logs</h1>
        <p className="page-subtitle">View all login attempts and verification events</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: "32px" }}>
        <div className="stat-card glass">
          <div className="stat-icon">📈</div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">✅</div>
          <div>
            <div className="stat-value">{stats.successes}</div>
            <div className="stat-label">Successful</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">❌</div>
          <div>
            <div className="stat-value">{stats.failures}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">👥</div>
          <div>
            <div className="stat-value">{stats.uniqueUsers}</div>
            <div className="stat-label">Unique Users</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card glass" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <input
              className="input"
              type="text"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ minWidth: "200px" }}
          >
            <option value="all">All Events</option>
            <option value="success">Success Only</option>
            <option value="failed">Failed Only</option>
            <option value="login_attempt">Login Attempts</option>
            <option value="verification_sent">Verification Sent</option>
            <option value="verification_success">Verification Success</option>
            <option value="verification_failed">Verification Failed</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card glass">
        <div className="card-header">
          <h2>Login Events ({filteredLogs.length})</h2>
        </div>
        
        {filteredLogs.length === 0 ? (
          <div className="empty-state" style={{ padding: "40px" }}>
            <p>No login events found matching your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Timestamp</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Type</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>IP Address</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", color: "var(--muted)", fontWeight: "600" }}>Error</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    style={{ 
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px", fontSize: "13px" }}>
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td style={{ padding: "12px", fontSize: "13px", fontWeight: "500" }}>
                      {log.email}
                    </td>
                    <td style={{ padding: "12px", fontSize: "13px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "6px", 
                        fontSize: "11px",
                        background: "rgba(255,255,255,0.1)",
                        textTransform: "uppercase"
                      }}>
                        {log.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: getStatusColor(log.type, log.success),
                        marginRight: "8px"
                      }}></span>
                      <span style={{ fontSize: "13px" }}>
                        {log.success ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "var(--muted)" }}>
                      {log.ipAddress || "N/A"}
                    </td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "var(--danger)" }}>
                      {log.error || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        className="btn"
        onClick={loadLogs}
        style={{ marginTop: "24px" }}
      >
        🔄 Refresh Logs
      </button>
    </div>
  );
}

