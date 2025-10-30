"use client";
import { JournalEntry, Preferences, Task } from "./models";

const KEYS = {
  tasks: "coda.tasks.v1",
  journal: "coda.journal.v1",
  prefs: "coda.prefs.v1"
};

function safeParse<T>(text: string | null, fallback: T): T {
  if (!text) return fallback;
  try { return JSON.parse(text) as T; } catch { return fallback; }
}

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEYS.tasks), [] as Task[]);
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.tasks, JSON.stringify(tasks));
}

export function loadJournal(): JournalEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEYS.journal), [] as JournalEntry[]);
}

export function saveJournal(entries: JournalEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.journal, JSON.stringify(entries));
}

export function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(KEYS.prefs), null as unknown as Preferences | null);
}

export function savePreferences(prefs: Preferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.prefs, JSON.stringify(prefs));
}


