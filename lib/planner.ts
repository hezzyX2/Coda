import { Plan, PlanBlock, Preferences, Task } from "./models";

function formatTime(date: Date): string {
  const ms = typeof (date as any)?.getTime === "function" ? (date as any).getTime() : NaN;
  if (!Number.isFinite(ms)) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);
}

function sortTasks(tasks: Task[], bias: Preferences["difficultyBias"]): Task[] {
  const items = tasks.filter(t => !t.done);
  const byDue = (a: Task, b: Task) => {
    const ad = a.due ? new Date(a.due).getTime() : Infinity;
    const bd = b.due ? new Date(b.due).getTime() : Infinity;
    return ad - bd;
  };
  items.sort(byDue);
  if (bias === "easy-first") items.sort((a, b) => a.difficulty - b.difficulty);
  if (bias === "hard-first") items.sort((a, b) => b.difficulty - a.difficulty);
  return items;
}

export function buildPlan(tasks: Task[], prefs: Preferences | null): Plan {
  if (!prefs) return { blocks: [] };
  const start = new Date();
  const blocks: PlanBlock[] = [];
  let cursor = new Date(start);
  const sorted = sortTasks(tasks, prefs.difficultyBias);

  for (const t of sorted) {
    // Focus block
    const focusStart = new Date(cursor);
    const focusEnd = new Date(cursor.getTime() + prefs.focusBlocksMins * 60000);
    blocks.push({
      id: `${t.id}-focus-${focusStart.getTime()}`,
      type: "focus",
      startTime: formatTime(focusStart),
      endTime: formatTime(focusEnd),
      taskId: t.id,
      taskTitle: t.title,
      estimateMins: t.estimateMins
    });
    cursor = focusEnd;

    // Break block
    const breakStart = new Date(cursor);
    const breakEnd = new Date(cursor.getTime() + prefs.breakMins * 60000);
    blocks.push({
      id: `${t.id}-break-${breakStart.getTime()}`,
      type: "break",
      startTime: formatTime(breakStart),
      endTime: formatTime(breakEnd)
    });
    cursor = breakEnd;

    // Cap plan to roughly 8 blocks for readability
    if (blocks.length >= 8) break;
  }

  return { blocks };
}

