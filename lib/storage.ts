"use client";
import { JournalEntry, Preferences, Task } from "./models";
import { getCurrentUser } from "./auth";

function safeParse<T>(text: string | null, fallback: T): T {
  if (!text) return fallback;
  try { return JSON.parse(text) as T; } catch { return fallback; }
}

// Get storage keys for current user
function getUserKeys() {
  const user = getCurrentUser();
  if (!user) {
    // Return temporary keys if no user (will be discarded)
    return {
      tasks: "coda.tasks.temp",
      journal: "coda.journal.temp",
      prefs: "coda.prefs.temp"
    };
  }
  
  // Use email as part of key for user-specific storage
  const userKey = user.email.replace(/[^a-zA-Z0-9]/g, "_");
  return {
    tasks: `coda.tasks.${userKey}`,
    journal: `coda.journal.${userKey}`,
    prefs: `coda.prefs.${userKey}`
  };
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const user = getCurrentUser();
  if (!user) return []; // No user = no data
  
  const keys = getUserKeys();
  return safeParse(localStorage.getItem(keys.tasks), [] as Task[]);
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  const user = getCurrentUser();
  if (!user) return; // Can't save without user
  
  const keys = getUserKeys();
  localStorage.setItem(keys.tasks, JSON.stringify(tasks));
}

export function loadJournal(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  const user = getCurrentUser();
  if (!user) return []; // No user = no data
  
  const keys = getUserKeys();
  return safeParse(localStorage.getItem(keys.journal), [] as JournalEntry[]);
}

export function saveJournal(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  const user = getCurrentUser();
  if (!user) return; // Can't save without user
  
  const keys = getUserKeys();
  localStorage.setItem(keys.journal, JSON.stringify(entries));
}

export function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;
  const user = getCurrentUser();
  if (!user) return null; // No user = no preferences
  
  const keys = getUserKeys();
  return safeParse(localStorage.getItem(keys.prefs), null as unknown as Preferences | null);
}

export function savePreferences(prefs: Preferences): void {
  if (typeof window === "undefined") return;
  const user = getCurrentUser();
  if (!user) return; // Can't save without user
  
  const keys = getUserKeys();
  localStorage.setItem(keys.prefs, JSON.stringify(prefs));
}

// Helper function to migrate old global data to user-specific storage (one-time migration)
export function migrateUserData(userEmail: string): void {
  if (typeof window === "undefined") return;
  
  const userKey = userEmail.replace(/[^a-zA-Z0-9]/g, "_");
  const oldKeys = {
    tasks: "coda.tasks.v1",
    journal: "coda.journal.v1",
    prefs: "coda.prefs.v1"
  };
  const newKeys = {
    tasks: `coda.tasks.${userKey}`,
    journal: `coda.journal.${userKey}`,
    prefs: `coda.prefs.${userKey}`
  };
  
  // Only migrate if new keys don't exist but old keys do
  const hasOldTasks = localStorage.getItem(oldKeys.tasks);
  const hasNewTasks = localStorage.getItem(newKeys.tasks);
  
  if (hasOldTasks && !hasNewTasks) {
    // Migrate tasks
    localStorage.setItem(newKeys.tasks, localStorage.getItem(oldKeys.tasks)!);
  }
  
  if (localStorage.getItem(oldKeys.journal) && !localStorage.getItem(newKeys.journal)) {
    // Migrate journal
    localStorage.setItem(newKeys.journal, localStorage.getItem(oldKeys.journal)!);
  }
  
  if (localStorage.getItem(oldKeys.prefs) && !localStorage.getItem(newKeys.prefs)) {
    // Migrate preferences
    localStorage.setItem(newKeys.prefs, localStorage.getItem(oldKeys.prefs)!);
  }
}


