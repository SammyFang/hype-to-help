import { NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { createDemoHypeScan } from "@/lib/demoData";
import { saveAnalysisRecord } from "@/lib/firebase";
import { HYPE_SCAN_PROMPT } from "@/lib/prompts";
import { analyzeRequestSchema, hypeScanSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = analyzeRequestSchema.parse(await request.json());
    const text = body.text?.trim() || "";

    if (!text && !body.imageDataUrl) {
      return NextResponse.json(
        { error: "Add text or upload an image before running HypeScan." },
        { status: 400 }
      );
    }

    const fallback = createDemoHypeScan(text || "Uploaded Team USA fan image", Boolean(body.imageDataUrl));
    const { data, source } = await generateStructuredJson({
      systemPrompt: HYPE_SCAN_PROMPT,
      payload: {
        text,
        hasImage: Boolean(body.imageDataUrl),
        task: "Analyze fan content for HypeScan and preserve Olympic and Paralympic parity."
      },
      schema: hypeScanSchema,
      fallback,
      imageDataUrl: body.imageDataUrl
    });

    const userId = body.userId || "demo-server-user";
    const analysis = await saveAnalysisRecord({
      ...data,
      userId,
      inputType: body.imageDataUrl && text ? "multimodal" : body.imageDataUrl ? "image" : "text",
      originalContent: text || "[image upload]"
    });

    return NextResponse.json({ result: data, analysisId: analysis.id, source });
  } catch (error) {
    console.error("Analyze route failed", error);
    return NextResponse.json(
      { error: "HypeScan could not process that input. Try a shorter post or a smaller image." },
      { status: 500 }
    );
  }
}
