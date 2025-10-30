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


