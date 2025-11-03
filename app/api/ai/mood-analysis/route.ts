import { NextRequest } from "next/server";
import OpenAI from "openai";
import { JournalEntry } from "@/lib/models";

type MoodAnalysisRequest = {
  entries: JournalEntry[];
  recentEntry?: JournalEntry;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MoodAnalysisRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    if (!body.entries || body.entries.length === 0) {
      return Response.json(
        { error: "Journal entries required" },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const recentEntries = body.entries.slice(0, 5).map(e => ({
      date: new Date(e.createdAt).toLocaleDateString(),
      prompt: e.prompt,
      text: e.text.substring(0, 200) + "..."
    }));

    const systemPrompt = `You are a compassionate mental health AI that analyzes journal entries to identify emotional patterns, mood trends, and provides supportive insights. Be empathetic and encouraging.`;

    const userPrompt = `Analyze these journal entries for mood patterns and insights:

${JSON.stringify(recentEntries, null, 2)}

${body.recentEntry ? `\nMost Recent Entry:\n"${body.recentEntry.text}"` : ""}

Provide a JSON response:
{
  "moodTrend": "improving" | "stable" | "declining" | "fluctuating",
  "dominantEmotions": ["emotion1", "emotion2", "emotion3"],
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2"],
  "sentimentScore": 0.0 to 1.0,
  "growthAreas": ["area1", "area2"]
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
    const analysis = JSON.parse(content);

    return Response.json({ analysis });
  } catch (err: any) {
    console.error("[Mood Analysis] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to analyze mood" },
      { status: 500 }
    );
  }
}

