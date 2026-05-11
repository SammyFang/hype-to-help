import { NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { createDemoHypeCheck } from "@/lib/demoData";
import { HYPE_CHECK_PROMPT } from "@/lib/prompts";
import { hypeCheckRequestSchema, hypeCheckSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = hypeCheckRequestSchema.parse(await request.json());
    const fallback = createDemoHypeCheck(body.comment);
    const { data, source } = await generateStructuredJson({
      systemPrompt: HYPE_CHECK_PROMPT,
      payload: {
        comment: body.comment,
        task: "Check whether this fan comment is respectful, accurate, inclusive, and safe."
      },
      schema: hypeCheckSchema,
      fallback
    });

    return NextResponse.json({ result: data, source });
  } catch (error) {
    console.error("HypeCheck route failed", error);
    return NextResponse.json(
      { error: "HypeCheck could not review that comment. Try a shorter comment." },
      { status: 500 }
    );
  }
}
