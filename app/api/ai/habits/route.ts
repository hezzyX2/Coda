import { NextRequest } from "next/server";
import OpenAI from "openai";

type HabitAnalysisRequest = {
  habits: Array<{
    name: string;
    streak: number;
    totalDays: number;
    completedDates: string[];
    category?: string;
  }>;
  timeframe: "week" | "month" | "all";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HabitAnalysisRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `You are an expert habit coach and behavioral scientist. Analyze habit data to provide actionable insights, identify patterns, and offer personalized strategies for building better habits.`;

    const userPrompt = `Analyze these habits and provide comprehensive insights:

${JSON.stringify(body.habits, null, 2)}

Timeframe: ${body.timeframe}

Provide JSON response:
{
  "patterns": ["pattern1", "pattern2"],
  "strengths": ["strength1", "strength2"],
  "challenges": ["challenge1", "challenge2"],
  "recommendations": ["rec1", "rec2", "rec3"],
  "motivationalInsights": ["insight1", "insight2"],
  "optimalTimes": {
    "habitName": "best time to do it"
  },
  "successProbability": {
    "habitName": 0.0 to 1.0
  },
  "nextSteps": ["step1", "step2"]
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
    console.error("[Habit Analysis] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to analyze habits" },
      { status: 500 }
    );
  }
}

