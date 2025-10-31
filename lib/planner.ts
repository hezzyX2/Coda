import { Plan, PlanBlock, Preferences, Task } from "./models";

function formatTime(date: Date): string {
  // Check if date is a valid Date object
  if (!date || !(date instanceof Date)) return "";
  
  // Get timestamp and check if it's valid
  const ms = date.getTime();
  if (!Number.isFinite(ms) || isNaN(ms)) return "";
  
  // Create a new Date from the valid timestamp to ensure it's properly formatted
  const validDate = new Date(ms);
  if (isNaN(validDate.getTime())) return "";
  
  try {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(validDate);
  } catch (error) {
    // Fallback if formatting fails
    return "";
  }
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
  
  // Validate preference values to prevent invalid dates
  const focusMins = prefs.focusBlocksMins || 25;
  const breakMins = prefs.breakMins || 5;
  
  if (!Number.isFinite(focusMins) || !Number.isFinite(breakMins)) {
    return { blocks: [] };
  }
  
  const start = new Date();
  if (isNaN(start.getTime())) return { blocks: [] };
  
  const blocks: PlanBlock[] = [];
  let cursor = new Date(start);
  if (isNaN(cursor.getTime())) return { blocks: [] };
  
  const sorted = sortTasks(tasks, prefs.difficultyBias);

  for (const t of sorted) {
    // Focus block
    const focusStart = new Date(cursor);
    if (isNaN(focusStart.getTime())) break;
    
    const focusEnd = new Date(cursor.getTime() + focusMins * 60000);
    if (isNaN(focusEnd.getTime())) break;
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
    if (isNaN(cursor.getTime())) break;

    // Break block
    const breakStart = new Date(cursor);
    if (isNaN(breakStart.getTime())) break;
    
    const breakEnd = new Date(cursor.getTime() + breakMins * 60000);
    if (isNaN(breakEnd.getTime())) break;
    blocks.push({
      id: `${t.id}-break-${breakStart.getTime()}`,
      type: "break",
      startTime: formatTime(breakStart),
      endTime: formatTime(breakEnd)
    });
    cursor = breakEnd;
    if (isNaN(cursor.getTime())) break;

    // Cap plan to roughly 8 blocks for readability
    if (blocks.length >= 8) break;
  }

  return { blocks };
}

