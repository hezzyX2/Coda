import { NextRequest } from "next/server";
import OpenAI from "openai";

type WritingAssistantRequest = {
  text: string;
  type: "essay" | "journal" | "assignment" | "note";
  goal?: string;
  requirements?: string;
  tone?: "academic" | "casual" | "professional" | "reflective";
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WritingAssistantRequest;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    if (!body.text || body.text.trim().length < 10) {
      return Response.json(
        { error: "Text is too short. Please provide at least 10 characters." },
        { status: 400 }
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    const systemPrompts = {
      essay: "You are an expert academic writing coach. Help improve essays with structure, clarity, argumentation, and academic style.",
      journal: "You are a reflective writing coach. Help deepen journal entries with thoughtful prompts, emotional insights, and self-discovery questions.",
      assignment: "You are a study coach. Help students complete assignments effectively with clear structure and comprehensive answers.",
      note: "You are a note-taking expert. Help organize and optimize notes for better retention and understanding."
    };

    const systemPrompt = systemPrompts[body.type] || systemPrompts.note;

    const userPrompt = `Review and improve this ${body.type}:

"${body.text}"

${body.goal ? `Goal: ${body.goal}` : ""}
${body.requirements ? `Requirements: ${body.requirements}` : ""}
${body.tone ? `Tone: ${body.tone}` : ""}

Provide JSON response:
{
  "improvedText": "enhanced version",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "structureAnalysis": "analysis of structure",
  "clarityScore": 0.0 to 1.0,
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
    const result = JSON.parse(content);

    return Response.json({ result });
  } catch (err: any) {
    console.error("[Writing Assistant] Error:", err);
    return Response.json(
      { error: err?.message || "Failed to assist with writing" },
      { status: 500 }
    );
  }
}

