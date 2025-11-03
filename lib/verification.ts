"use client";

import { LoginLog } from "./models";

export type { LoginLog };

const LOGS_KEY = "codak.login_logs.v1";
const MAX_LOGS = 1000; // Keep last 1000 login events

export function logLoginEvent(log: LoginLog): void {
  if (typeof window === "undefined") return;
  
  try {
    const existing = localStorage.getItem(LOGS_KEY);
    const logs: LoginLog[] = existing ? JSON.parse(existing) : [];
    
    logs.push(log);
    
    // Keep only the most recent logs
    if (logs.length > MAX_LOGS) {
      logs.splice(0, logs.length - MAX_LOGS);
    }
    
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error("[Login Log] Failed to save log:", err);
  }
}

export function getLoginLogs(): LoginLog[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getLoginLogsForEmail(email: string): LoginLog[] {
  return getLoginLogs().filter(log => 
    log.email.toLowerCase() === email.toLowerCase()
  );
}

export function clearLoginLogs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGS_KEY);
}

