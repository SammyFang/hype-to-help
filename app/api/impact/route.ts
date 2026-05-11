import { NextResponse } from "next/server";
import { getImpactMetrics } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId") || undefined;
  const metrics = await getImpactMetrics(userId);
  return NextResponse.json({ metrics });
}
