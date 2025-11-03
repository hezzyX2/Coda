import { NextRequest } from "next/server";
import OpenAI from "openai";

type SmartScheduleRequest = {
  tasks: Array<{
    id: string;
    title: string;
    difficulty: number;
    estimateMins: number;
    due?: string;
    done: boolean;
  }>;
  preferences?: {
    focusBlocksMins?: number;
    breakMins?: number;
    difficultyBias?: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SmartScheduleRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    if (!body.tasks || body.tasks.length === 0) {
      return Response.json(
        { error: "Tasks required" },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const pendingTasks = body.tasks.filter(t => !t.done);
    
    const systemPrompt = `You are an AI scheduling assistant that creates optimal daily schedules for students. Consider task urgency, difficulty, energy levels, and breaks.`;

    const userPrompt = `Create an optimal schedule for these tasks:

${pendingTasks.map((t, i) => 
  `${i + 1}. ${t.title} (Difficulty: ${t.difficulty}/5, ${t.estimateMins} mins${t.due ? `, Due: ${new Date(t.due).toLocaleDateString()}` : ""})`
).join('\n')}

Preferences:
- Focus blocks: ${body.preferences?.focusBlocksMins || 25} minutes
- Breaks: ${body.preferences?.breakMins || 5} minutes
- Difficulty bias: ${body.preferences?.difficultyBias || "balanced"}

Provide a JSON response:
{
  "schedule": [
    {
      "taskId": "task id",
      "taskTitle": "task title",
      "startTime": "HH:MM",
      "endTime": "HH:MM",
      "type": "focus" | "break",
      "priority": "high" | "medium" | "low",
      "reason": "why this time slot"
    }
  ],
  "productivityTips": ["tip1", "tip2", "tip3"],
  "estimatedCompletion": "when all tasks will be done"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "{}";
    const schedule = JSON.parse(content);

    return Response.json({ schedule });
  } catch (err: any) {
    console.error("[Smart Schedule] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to generate schedule" },
      { status: 500 }
    );
  }
}

