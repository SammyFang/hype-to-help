"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { MissionCard } from "@/components/MissionCard";
import { getDemoUserId } from "@/lib/clientUser";
import { createDemoHypeScan, createDemoMissions, demoScenarios } from "@/lib/demoData";
import { saveLocalImpactEvent } from "@/lib/localImpact";
import type { HypeScanResult, ImpactMetrics, MissionGenerationResult, MissionItem } from "@/types";

export function MissionsClient() {
  const [scan, setScan] = useState<HypeScanResult>();
  const [missions, setMissions] = useState<MissionGenerationResult>();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [metrics, setMetrics] = useState<ImpactMetrics>();

  useEffect(() => {
    const stored = window.localStorage.getItem("hype-last-quest");
    if (stored) {
      const parsed = JSON.parse(stored) as { scan: HypeScanResult; missions: MissionGenerationResult };
      setScan(parsed.scan);
      setMissions(parsed.missions);
      return;
    }

    const fallbackScan = createDemoHypeScan(demoScenarios[2].text);
    setScan(fallbackScan);
    setMissions(createDemoMissions(fallbackScan));
  }, []);

  async function completeMission(mission: MissionItem) {
    if (completed[mission.title]) return;
    const payload = {
        userId: getDemoUserId(),
        eventType: mission.type,
        points: mission.points,
        sport: scan?.sport || "Team USA",
        paralympicIncluded: mission.type === "Discover" || Boolean(missions?.paralympicRepresentationIncluded),
        supportImpact: mission.supportImpact,
        badge: mission.badge
      };

    try {
      const response = await fetch("/api/save-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Impact API unavailable.");
      const data = (await response.json()) as { metrics: ImpactMetrics };
      setCompleted((current) => ({ ...current, [mission.title]: true }));
      setMetrics(data.metrics);
    } catch {
      const data = saveLocalImpactEvent(payload);
      setCompleted((current) => ({ ...current, [mission.title]: true }));
      setMetrics(data.metrics);
    }
  }

  return (
    <div className="arena-page mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8">
      <section className="arena-panel mb-6 rounded-lg p-5">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-red-300/30 bg-red-500/20 text-red-100">
              <Target aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="hud-label text-red-100">Board</p>
              <h1 className="text-3xl font-black text-white clamp-2">
                {missions?.missionTitle || "Fan Impact Missions"}
              </h1>
              <p className="text-sm rally-muted clamp-2">
                {missions?.missionTheme || "Complete missions to earn points, badges, and measurable support impact."}
              </p>
            </div>
          </div>
          {metrics ? (
            <p className="rounded-md border border-amber-300/40 bg-amber-400/15 px-4 py-2 text-sm font-black text-amber-100">
              Score {metrics.teamUSARallyScore}
            </p>
          ) : null}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {missions?.missions.map((mission) => (
          <MissionCard
            key={mission.title}
            mission={mission}
            completed={completed[mission.title]}
            onComplete={completeMission}
          />
        ))}
      </div>
      <Link
        href="/dashboard"
        className="arena-command mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white"
      >
        Impact
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}
