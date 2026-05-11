import { NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { createDemoAccessibility } from "@/lib/demoData";
import { ACCESSIBILITY_PROMPT } from "@/lib/prompts";
import { accessibilityRequestSchema, accessibilitySchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = accessibilityRequestSchema.parse(await request.json());
    const input = [body.text, body.imageDescription].filter(Boolean).join("\n");
    const fallback = createDemoAccessibility(input);
    const { data, source } = await generateStructuredJson({
      systemPrompt: ACCESSIBILITY_PROMPT,
      payload: {
        text: body.text,
        imageDescription: body.imageDescription,
        task: "Improve accessibility and inclusive language for fan-facing content."
      },
      schema: accessibilitySchema,
      fallback
    });

    return NextResponse.json({ result: data, source });
  } catch (error) {
    console.error("Accessibility route failed", error);
    return NextResponse.json(
      { error: "Could not generate accessibility support for that content." },
      { status: 500 }
    );
  }
}
