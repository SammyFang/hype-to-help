"use client";

import { calculateImpactMetrics } from "@/lib/scoring";
import type { ImpactEvent } from "@/types";

const key = "hype-local-impact-events";

function readEvents(): ImpactEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]") as ImpactEvent[];
  } catch {
    return [];
  }
}

function writeEvents(events: ImpactEvent[]) {
  window.localStorage.setItem(key, JSON.stringify(events));
}

export function getLocalImpactMetrics(userId?: string) {
  const events = readEvents().filter((event) => !userId || event.userId === userId);
  return calculateImpactMetrics(events);
}

export function saveLocalImpactEvent(event: Omit<ImpactEvent, "id" | "createdAt">) {
  const nextEvent: ImpactEvent = {
    ...event,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `local-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  const events = [...readEvents(), nextEvent];
  writeEvents(events);
  return {
    event: nextEvent,
    metrics: calculateImpactMetrics(events.filter((item) => item.userId === event.userId))
  };
}
