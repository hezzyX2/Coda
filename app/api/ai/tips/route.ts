import { NextRequest } from "next/server";
import OpenAI from "openai";
import { Task } from "@/lib/models";

type TipsRequest = { tasks: Task[]; tone?: "encouraging" | "direct" | "gentle"; premium?: boolean };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TipsRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error("[AI Tips] Missing OPENAI_API_KEY environment variable");
      return Response.json(
        { error: "API key not configured. Please set OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });
    const pending = (body.tasks || []).filter((t) => !t.done);

    if (pending.length === 0) {
      return Response.json({
        tips: [
          "Add some tasks to get personalized step-by-step instructions!",
          "Try breaking large tasks into smaller, manageable steps.",
          "Set realistic time estimates to improve your planning."
        ]
      });
    }

    const tone = body.tone || "encouraging";

    const isPremium = body.premium === true;
    const system = isPremium
      ? `You are Coda, an expert AI coach for students. Be ${tone}, comprehensive, and highly detailed. For each task, provide EXTREMELY SPECIFIC, DETAILED STEP-BY-STEP instructions. Include: exact actions, required resources, time breakdowns, potential challenges, tips, alternative approaches, and success criteria. Output 5-7 comprehensive instructions per task, each 4-6 sentences. Format as clear numbered sections with sub-steps. Be thorough and leave no important detail unaddressed.`
      : `You are Coda, an AI coach for students. Be ${tone}, concise, and actionable. For each task, provide SPECIFIC, STEP-BY-STEP instructions on HOW to complete it. Include concrete actions, resources needed, and time breakdowns. Output 3-5 detailed instructions (one per task), each 2-3 sentences. Format as clear numbered steps.`;
    const taskDetails = pending.map(({ title, due, difficulty, estimateMins }) => ({
      title,
      due: due || "No deadline",
      difficulty: `${difficulty}/5`,
      estimatedMinutes: estimateMins
    }));
    const user = `Here are my pending tasks:\n${JSON.stringify(taskDetails, null, 2)}\n\nFor each task, give me SPECIFIC step-by-step instructions on HOW to complete it. Include what to do first, what materials I need, and how to break it down.`;

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.7,
      max_tokens: isPremium ? 1000 : 500
    });

    const content = chat.choices[0]?.message?.content || "";
    const tips = content
      .split(/\n|\r/)
      .map((s) => s.replace(/^[-*\d\.\)\s]+/, "").trim())
      .filter((s) => s.length > 0)
      .slice(0, 5);

    if (tips.length === 0) {
      tips.push("Focus on one task at a time for best results.", "Take breaks between tasks to maintain productivity.");
    }

    return Response.json({ tips });
  } catch (err: any) {
    console.error("[AI Tips] Error:", err);
    const errorMessage = err?.message || "Unknown error";
    const isApiKeyError = errorMessage.includes("api key") || errorMessage.includes("401") || errorMessage.includes("authentication");
    
    return Response.json(
      { 
        error: isApiKeyError 
          ? "Invalid API key. Please check your OPENAI_API_KEY in .env.local" 
          : `AI service error: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}


