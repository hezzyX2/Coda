export type Task = {
  id: string;
  title: string;
  due?: string;
  difficulty: number; // 1-5
  estimateMins: number;
  done: boolean;
};

export type Preferences = {
  focusBlocksMins: number;
  breakMins: number;
  difficultyBias: "easy-first" | "hard-first" | "balanced";
  notifications: boolean;
  tone: "encouraging" | "direct" | "gentle";
  theme: string;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  prompt: string;
  text: string;
};

export type PlanBlock = {
  id: string;
  type: "focus" | "break";
  startTime: string;
  endTime: string;
  taskId?: string;
  taskTitle?: string;
  estimateMins?: number;
};

export type Plan = {
  blocks: PlanBlock[];
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  streak: number;
  totalDays: number;
  completedDates: string[];
  createdAt: string;
  targetFrequency: "daily" | "weekly" | "custom";
  color?: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: "tasks" | "journal" | "habits" | "streak" | "milestone";
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type Streak = {
  type: "tasks" | "journal" | "habits";
  current: number;
  longest: number;
  lastDate: string;
};

export type UserProfile = {
  email: string;
  name: string;
  bio?: string;
  school?: string;
  grade?: string;
  goals?: string[];
  interests?: string[];
  timezone?: string;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacySettings?: {
    shareAnalytics: boolean;
    shareProgress: boolean;
  };
};

export type LoginLog = {
  id: string;
  email: string;
  timestamp: string;
  type: "login_attempt" | "login_success" | "login_failed" | "verification_sent" | "verification_success" | "verification_failed";
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
};

export type VerificationCode = {
  email: string;
  code: string;
  expiresAt: number;
  attempts: number;
};
