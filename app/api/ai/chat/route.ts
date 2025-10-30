import { NextRequest } from "next/server";
import OpenAI from "openai";

type ChatRequest = {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  tone?: "encouraging" | "direct" | "gentle";
  premium?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error("[AI Chat] Missing OPENAI_API_KEY environment variable");
      return Response.json(
        { error: "API key not configured. Please set OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    if (!body.messages || body.messages.length === 0) {
      return Response.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });
    const tone = body.tone || "encouraging";

    const isPremium = body.premium === true;
    const system = isPremium
      ? `You are Coda, an expert and ${tone} AI life coach for students. You provide comprehensive, detailed, and deeply thoughtful advice on academics, relationships, personal growth, stress management, and life challenges. Be extremely supportive, practical, and insightful. Provide in-depth analysis, actionable strategies, specific examples, and nuanced guidance. Your responses should be thorough, well-structured, and comprehensive (400-600 words). Include multiple perspectives, practical steps, and detailed explanations.`
      : `You are Coda, a wise and ${tone} AI life coach for students. You provide thoughtful, empathetic advice on academics, relationships, personal growth, stress management, and life challenges. Be supportive, practical, and help students navigate their challenges with clarity and encouragement. Keep responses conversational and under 150 words.`;

    const messages = [
      { role: "system" as const, content: system },
      ...body.messages
        .filter((m) => m.content && m.content.trim().length > 0)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.trim()
        }))
    ];

    if (messages.length <= 1) {
      return Response.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8,
      max_tokens: isPremium ? 800 : 300
    });

    const response = chat.choices[0]?.message?.content || "I'm here to help! What's on your mind?";

    return Response.json({ message: response });
  } catch (err: any) {
    console.error("[AI Chat] Error:", err);
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

