import { NextResponse } from "next/server";
import { getFirestoreHealth } from "@/lib/firebase";

export const runtime = "nodejs";

export async function GET() {
  const health = await getFirestoreHealth();
  return NextResponse.json(health, { status: health.ok ? 200 : 503 });
}
