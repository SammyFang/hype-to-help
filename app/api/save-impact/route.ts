import { NextResponse } from "next/server";
import { getImpactMetrics, saveImpactEvent } from "@/lib/firebase";
import { impactEventRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = impactEventRequestSchema.parse(await request.json());
    const event = await saveImpactEvent(body);
    const metrics = await getImpactMetrics(body.userId);
    return NextResponse.json({ event, metrics });
  } catch (error) {
    console.error("Save impact route failed", error);
    return NextResponse.json(
      { error: "Could not save that impact action." },
      { status: 500 }
    );
  }
}
