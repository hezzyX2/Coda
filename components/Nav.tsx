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
    <header className="top-nav glass">
      <Link href="/home" className="brand-link">
        <span className="brand-text-nav">Cod</span>
        <DiamondLogo size={32} animated={true} />
        <span className="brand-text-nav" style={{ marginLeft: "1px" }}>k AI</span>
      </Link>
      <nav className="links">
        <Link href="/home">Home</Link>
        <Link href="/">Dashboard</Link>
        <Link href="/tasks">Tasks</Link>
        <Link href="/journal">Journal</Link>
        <Link href="/habits">Habits</Link>
        <Link href="/study">Study</Link>
        <Link href="/writing">Writing</Link>
        <Link href="/analytics">Analytics</Link>
        <Link href="/chat">Chat {!isPremium() && <span className="premium-icon">✨</span>}</Link>
        <Link href="/wisdom">Wisdom</Link>
        <Link href="/premium" className="premium-link">
          {isPremium() ? "✨ Premium" : "Upgrade"}
        </Link>
        {process.env.NEXT_PUBLIC_ADMIN_EMAIL && getCurrentUser()?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <Link href="/admin" className="admin-link">Admin</Link>
        )}
      </nav>
      <div className="nav-actions">
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
  );
}


