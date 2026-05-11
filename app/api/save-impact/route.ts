import { NextResponse } from "next/server";
import { getImpactMetricsWithPersistence, saveImpactEvent } from "@/lib/firebase";
import { impactEventRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = impactEventRequestSchema.parse(await request.json());
    const { record: event, persistence } = await saveImpactEvent(body);
    const { metrics, persistence: metricsPersistence } = await getImpactMetricsWithPersistence(body.userId);
    return NextResponse.json({ event, metrics, persistence, metricsPersistence });
  } catch (error) {
    console.error("Save impact route failed", error);
    return NextResponse.json(
      { error: "Could not save that impact action." },
      { status: 500 }
    );
  }
}
