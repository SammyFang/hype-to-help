import { NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { createDemoTwin } from "@/lib/demoData";
import { PARALYMPIC_TWIN_PROMPT } from "@/lib/prompts";
import { paralympicTwinSchema, twinRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = twinRequestSchema.parse(await request.json());
    const input = [body.topic, body.sport].filter(Boolean).join(" ");
    const fallback = createDemoTwin(input);
    const { data, source } = await generateStructuredJson({
      systemPrompt: PARALYMPIC_TWIN_PROMPT,
      payload: {
        topic: body.topic,
        sport: body.sport,
        task: "Create a meaningful Paralympic Twin with neutral rule or classification context."
      },
      schema: paralympicTwinSchema,
      fallback
    });

    return NextResponse.json({ result: data, source });
  } catch (error) {
    console.error("Paralympic Twin route failed", error);
    return NextResponse.json(
      { error: "Could not generate a Paralympic Twin for that topic." },
      { status: 500 }
    );
  }
}
