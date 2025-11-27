"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { loadPreferences, savePreferences } from "@/lib/storage";
import { isAuthenticated, logout, getCurrentUser, isPremium } from "@/lib/auth";
import { DiamondLogo } from "./DiamondLogo";

export function Nav() {
  const [theme, setTheme] = useState("lilac-mist");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const prefs = loadPreferences();
    const next = prefs?.theme ?? "lilac-mist";
    setTheme(next);

    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function changeTheme(next: string) {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    const prefs = loadPreferences() ?? ({} as any);
    savePreferences({ ...prefs, theme: next });
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  // Don't show nav on auth pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <>
      <header className="top-nav glass">
        <Link href="/home" className="brand-link" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-text-nav">Cod</span>
          <DiamondLogo size={32} animated={true} />
          <span className="brand-text-nav" style={{ marginLeft: "1px" }}>k</span>
        </Link>
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        <nav className={`links desktop-nav`}>
          <Link href="/home" className={pathname === "/home" ? "active" : ""}>Home</Link>
          <Link href="/" className={pathname === "/" ? "active" : ""}>Dashboard</Link>
          <Link href="/tasks" className={pathname === "/tasks" ? "active" : ""}>Tasks</Link>
          <Link href="/journal" className={pathname === "/journal" ? "active" : ""}>Journal</Link>
          <Link href="/habits" className={pathname === "/habits" ? "active" : ""}>Habits</Link>
          <Link href="/study" className={pathname === "/study" ? "active" : ""}>Study</Link>
          <Link href="/writing" className={pathname === "/writing" ? "active" : ""}>Writing</Link>
          <Link href="/analytics" className={pathname === "/analytics" ? "active" : ""}>Analytics</Link>
          <Link href="/chat" className={pathname === "/chat" ? "active" : ""}>Chat {!isPremium() && <span className="premium-icon">✨</span>}</Link>
          <Link href="/wisdom" className={pathname === "/wisdom" ? "active" : ""}>Wisdom</Link>
          <Link href="/profile" className={pathname === "/profile" ? "active" : ""}>Profile</Link>
          <Link href="/premium" className={`premium-link ${pathname === "/premium" ? "active" : ""}`}>
            {isPremium() ? "✨ Premium" : "Upgrade"}
          </Link>
          {process.env.NEXT_PUBLIC_ADMIN_EMAIL && getCurrentUser()?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <>
              <Link href="/admin" className="admin-link">Admin</Link>
              <Link href="/admin/users" className="admin-link">Users</Link>
              <Link href="/admin/logins" className="admin-link">Login Logs</Link>
            </>
          )}
        </nav>
        <div className="nav-actions desktop-only">
          {user && (
            <span className="user-name" title={user.email}>
              {user.name}
            </span>
          )}
          <select className="input compact" value={theme} onChange={(e) => changeTheme(e.target.value)}>
            <option value="lilac-mist">Lilac</option>
            <option value="midnight-neon">Neon</option>
            <option value="sunset-glow">Sunset</option>
            <option value="ocean-breeze">Ocean</option>
            <option value="forest-fog">Forest</option>
          </select>
          <button className="btn compact" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      <nav className={`mobile-nav ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="mobile-nav-content">
          <Link href="/home" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link href="/tasks" onClick={() => setMobileMenuOpen(false)}>Tasks</Link>
          <Link href="/journal" onClick={() => setMobileMenuOpen(false)}>Journal</Link>
          <Link href="/habits" onClick={() => setMobileMenuOpen(false)}>Habits</Link>
          <Link href="/study" onClick={() => setMobileMenuOpen(false)}>Study</Link>
          <Link href="/writing" onClick={() => setMobileMenuOpen(false)}>Writing</Link>
          <Link href="/analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</Link>
          <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>Chat {!isPremium() && <span className="premium-icon">✨</span>}</Link>
          <Link href="/wisdom" onClick={() => setMobileMenuOpen(false)}>Wisdom</Link>
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
          <Link href="/premium" className="premium-link" onClick={() => setMobileMenuOpen(false)}>
            {isPremium() ? "✨ Premium" : "Upgrade"}
          </Link>
          {process.env.NEXT_PUBLIC_ADMIN_EMAIL && getCurrentUser()?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
            <>
              <Link href="/admin" className="admin-link" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              <Link href="/admin/users" className="admin-link" onClick={() => setMobileMenuOpen(false)}>Users</Link>
              <Link href="/admin/logins" className="admin-link" onClick={() => setMobileMenuOpen(false)}>Login Logs</Link>
            </>
          )}
          <div className="mobile-nav-footer">
            {user && (
              <div className="mobile-user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            )}
            <select className="input mobile-theme-select" value={theme} onChange={(e) => changeTheme(e.target.value)}>
              <option value="lilac-mist">💜 Royal Purple</option>
              <option value="midnight-neon">💎 Cyber Matrix</option>
              <option value="sunset-glow">🔥 Fire Ember</option>
              <option value="ocean-breeze">🌊 Ocean Abyss</option>
              <option value="forest-fog">🌿 Forest Canopy</option>
            </select>
            <button className="btn primary mobile-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}
