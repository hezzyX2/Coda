import { NextRequest } from "next/server";
import OpenAI from "openai";

type TaskBreakdownRequest = {
  task: {
    title: string;
    difficulty: number;
    estimateMins: number;
    due?: string;
  };
  allTasks?: Array<{ title: string; difficulty: number }>;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TaskBreakdownRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    if (!body.task) {
      return Response.json(
        { error: "Task information required" },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `You are an expert productivity coach specializing in breaking down complex tasks into actionable steps. Provide practical, actionable breakdowns that help students complete tasks efficiently.`;

    const userPrompt = `Break down this task into 3-5 specific, actionable steps:

Task: "${body.task.title}"
Difficulty: ${body.task.difficulty}/5
Estimated Time: ${body.task.estimateMins} minutes
${body.task.due ? `Due Date: ${new Date(body.task.due).toLocaleDateString()}` : "No due date"}

Provide a JSON response with:
{
  "steps": [
    {
      "step": "Step description",
      "estimatedTime": minutes as number,
      "priority": "high" | "medium" | "low"
    }
  ],
  "tips": ["tip1", "tip2"],
  "resources": ["resource suggestion 1", "resource suggestion 2"]
}

Make it practical and student-focused.`;

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
    const breakdown = JSON.parse(content);

    return Response.json({ breakdown });
  } catch (err: any) {
    console.error("[Task Breakdown] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to generate breakdown" },
      { status: 500 }
    );
  }
}

