import { NextRequest } from "next/server";
import OpenAI from "openai";
import { Task } from "@/lib/models";
import { JournalEntry } from "@/lib/models";

type ProductivityInsightsRequest = {
  tasks: Task[];
  journalEntries: JournalEntry[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProductivityInsightsRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const completedTasks = body.tasks.filter(t => t.done);
    const pendingTasks = body.tasks.filter(t => !t.done);
    const completionRate = body.tasks.length > 0 
      ? Math.round((completedTasks.length / body.tasks.length) * 100) 
      : 0;

    const recentEntries = body.journalEntries.slice(0, 5);

    const systemPrompt = `You are an expert productivity coach analyzing student data to provide actionable insights and personalized recommendations.`;

    const userPrompt = `Analyze this student's productivity data:

Tasks:
- Total: ${body.tasks.length}
- Completed: ${completedTasks.length}
- Pending: ${pendingTasks.length}
- Completion Rate: ${completionRate}%

${pendingTasks.length > 0 ? `Pending Tasks:\n${pendingTasks.map(t => `- ${t.title} (${t.estimateMins} mins, difficulty ${t.difficulty}/5)`).join('\n')}` : 'No pending tasks'}

Journal Activity:
- Total Entries: ${body.journalEntries.length}
${recentEntries.length > 0 ? `- Recent activity: ${recentEntries.length} entries in last period` : '- No recent journal entries'}

Provide a JSON response:
{
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "productivityScore": 0.0 to 1.0,
  "motivationalMessage": "personalized message"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content || "{}";
    const insights = JSON.parse(content);

    return Response.json({ insights });
  } catch (err: any) {
    console.error("[Productivity Insights] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to generate insights" },
      { status: 500 }
    );
  }
}

