import { NextRequest } from "next/server";
import OpenAI from "openai";

type StudyPlanRequest = {
  subjects: Array<{
    name: string;
    difficulty: number;
    hoursNeeded: number;
    examDate?: string;
    currentProgress?: number;
  }>;
  availableHours: number;
  learningStyle?: "visual" | "auditory" | "kinesthetic" | "reading";
  preferences?: {
    studyBlocks: number;
    breakMinutes: number;
    timeOfDay?: "morning" | "afternoon" | "evening" | "flexible";
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StudyPlanRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompt = `You are an expert educational psychologist and study coach. Create personalized, adaptive study plans that optimize learning based on subjects, available time, learning styles, and cognitive science principles.`;

    const userPrompt = `Create a comprehensive study plan:

Subjects:
${JSON.stringify(body.subjects, null, 2)}

Available Hours Per Week: ${body.availableHours}
Learning Style: ${body.learningStyle || "not specified"}
Preferences: ${JSON.stringify(body.preferences || {}, null, 2)}

Provide JSON response:
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "sessions": [
        {
          "subject": "subject name",
          "duration": minutes,
          "time": "HH:MM",
          "method": "study method",
          "focusAreas": ["area1", "area2"],
          "resources": ["resource1", "resource2"]
        }
      ]
    }
  ],
  "studyMethods": {
    "subject": ["method1 optimized for learning style", "method2"]
  },
  "optimizationTips": ["tip1", "tip2", "tip3"],
  "retentionStrategies": ["strategy1", "strategy2"],
  "estimatedProgress": {
    "subject": "expected progress percentage"
  },
  "adaptations": ["adaptation1 based on learning style"]
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
    const plan = JSON.parse(content);

    return Response.json({ plan });
  } catch (err: any) {
    console.error("[Study Plan] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to create study plan" },
      { status: 500 }
    );
  }
}

