import { NextResponse } from "next/server";
import { generateStructuredJson } from "@/lib/gemini";
import { createDemoMissions } from "@/lib/demoData";
import { saveMissionRecord } from "@/lib/firebase";
import { FAN_MISSION_PROMPT } from "@/lib/prompts";
import { missionGenerationSchema, missionRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = missionRequestSchema.parse(await request.json());
    const fallback = createDemoMissions(body.hypeScanResult);
    const { data, source } = await generateStructuredJson({
      systemPrompt: FAN_MISSION_PROMPT,
      payload: {
        hypeScanResult: body.hypeScanResult,
        task: "Generate three to five short measurable Fan Impact Missions."
      },
      schema: missionGenerationSchema,
      fallback
    });

    const { record: missionRecord, persistence } = await saveMissionRecord({
      ...data,
      userId: body.userId || "demo-server-user",
      analysisId: body.analysisId,
      completed: false,
      score: data.missions.reduce((sum, mission) => sum + mission.points, 0),
      badges: data.missions.map((mission) => mission.badge)
    });

    return NextResponse.json({ result: data, missionId: missionRecord.id, source, persistence });
  } catch (error) {
    console.error("Generate mission route failed", error);
    return NextResponse.json(
      { error: "Could not generate missions from that HypeScan result." },
      { status: 500 }
    );
  }
}
