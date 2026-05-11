import { NextResponse } from "next/server";
import { getImpactMetricsWithPersistence } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || undefined;
  const { metrics, persistence } = await getImpactMetricsWithPersistence(userId);
  return NextResponse.json({ metrics, persistence });
}
