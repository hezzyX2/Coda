import { Task } from "./models";

export interface AIProvider {
  generateTaskTips(tasks: Task[], tone?: "encouraging" | "direct" | "gentle", premium?: boolean): Promise<string[]>;
}

class MockAI implements AIProvider {
  async generateTaskTips(tasks: Task[], tone?: "encouraging" | "direct" | "gentle", premium?: boolean): Promise<string[]> {
    if (tasks.length === 0) return [
      "Add a few tasks and I'll suggest a plan.",
      "Try setting clear estimates to improve planning accuracy."
    ];
    const tips: string[] = [];
    const pending = tasks.filter(t => !t.done);
    const soon = pending.filter(t => t.due).slice(0, 2);
    if (soon.length) tips.push(`Start with: ${soon.map(s => '"' + s.title + '"').join(", ")}`);
    const longest = pending.sort((a,b)=>b.estimateMins-a.estimateMins)[0];
    if (longest) tips.push(`Break "${longest.title}" into ${Math.max(2, Math.round(longest.estimateMins/40))} chunks.`);
    tips.push("Use 50/10 focus-break cycles to maintain energy.");
    return tips;
  }
}

let provider: AIProvider | null = null;

export function ai(): AIProvider {
  if (provider) return provider;
  provider = new (class implements AIProvider {
    async generateTaskTips(tasks: Task[], tone?: "encouraging" | "direct" | "gentle", premium?: boolean): Promise<string[]> {
      try {
        const res = await fetch("/api/ai/tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks, tone, premium })
        });
        if (!res.ok) throw new Error("AI route failed");
        const data = (await res.json()) as { tips?: string[] };
        if (data?.tips && data.tips.length) return data.tips;
        throw new Error("Empty tips");
      } catch {
        // Fallback to mock on any failure
        return new MockAI().generateTaskTips(tasks, tone, premium);
      }
    }
  })();
  return provider;
}

