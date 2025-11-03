import { NextRequest } from "next/server";
import OpenAI from "openai";
import { JournalEntry } from "@/lib/models";

type JournalAdviceRequest = {
  entries: JournalEntry[];
  tone?: "encouraging" | "direct" | "gentle";
  premium?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as JournalAdviceRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error("[Journal Advice] Missing OPENAI_API_KEY environment variable");
      return Response.json(
        { error: "API key not configured. Please set OPENAI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });
    const tone = body.tone || "encouraging";
    const recentEntries = body.entries.slice(0, 5);

    const isPremium = body.premium === true;
    const system = isPremium
      ? `You are Codak AI, an expert AI life coach. The user has consented to share their journal entries. Conduct a deep, comprehensive analysis of patterns, emotions, themes, growth trajectories, and underlying motivations across their entries. Provide ${tone}, detailed, insightful, and highly actionable advice. Include specific observations, multiple perspectives, detailed strategies, and nuanced recommendations. Structure your response with clear sections: Key Patterns, Emotional Insights, Growth Opportunities, and Actionable Recommendations. Your response should be thorough and comprehensive (400-600 words).`
      : `You are Codak AI, a thoughtful AI life coach. The user has consented to share their journal entries. Analyze patterns, emotions, and themes across their entries. Provide ${tone}, constructive, and empathetic advice. Focus on growth, self-awareness, and actionable insights. Keep it under 200 words.`;

    const entriesText = recentEntries
      .map((e, i) => `Entry ${i + 1} (${new Date(e.createdAt).toLocaleDateString()}):\nPrompt: ${e.prompt}\nResponse: ${e.text}`)
      .join("\n\n---\n\n");

    const user = `Here are my recent journal entries:\n\n${entriesText}\n\nPlease provide thoughtful advice based on these reflections.`;

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      temperature: 0.7,
      max_tokens: isPremium ? 700 : 300
    });

    const advice = chat.choices[0]?.message?.content || "Thank you for sharing. Keep reflecting!";

    return Response.json({ advice });
  } catch (err: any) {
    console.error("[Journal Advice] Error:", err);
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

