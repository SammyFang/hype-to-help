"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, ArrowRight, CheckCircle2, Gauge, Loader2, Sparkles, Trophy } from "lucide-react";
import { AnalysisResultCard } from "@/components/AnalysisResultCard";
import { ContentInputCard } from "@/components/ContentInputCard";
import { ImpactScoreCard } from "@/components/ImpactScoreCard";
import { MissionCard } from "@/components/MissionCard";
import { ParalympicTwinCard } from "@/components/ParalympicTwinCard";
import { SafetyCard } from "@/components/SafetyCard";
import { SupportRouterCard } from "@/components/SupportRouterCard";
import { getDemoUserId } from "@/lib/clientUser";
import { createDemoHypeScan, createDemoMissions, demoScenarios } from "@/lib/demoData";
import { saveLocalImpactEvent } from "@/lib/localImpact";
import type { HypeScanResult, ImpactMetrics, MissionGenerationResult, MissionItem } from "@/types";

type AnalyzeResponse = {
  result: HypeScanResult;
  analysisId: string;
  source: string;
};

type MissionResponse = {
  result: MissionGenerationResult;
  missionId: string;
  source: string;
};

export function FanQuestClient() {
  const [text, setText] = useState(demoScenarios[0].text);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [imageName, setImageName] = useState<string>();
  const [scan, setScan] = useState<HypeScanResult>();
  const [missions, setMissions] = useState<MissionGenerationResult>();
  const [metrics, setMetrics] = useState<ImpactMetrics>();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [source, setSource] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function analyze() {
    setLoading(true);
    setError(undefined);
    setCompleted({});

    try {
      const userId = getDemoUserId();
      let analysisData: AnalyzeResponse;
      let missionData: MissionResponse;

      try {
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, imageDataUrl, userId })
        });

        if (!analysisResponse.ok) {
          throw new Error("Analyze API unavailable.");
        }

        analysisData = (await analysisResponse.json()) as AnalyzeResponse;
      } catch {
        analysisData = {
          result: createDemoHypeScan(text || "Team USA fan image upload", Boolean(imageDataUrl)),
          analysisId: "static-demo-analysis",
          source: "static demo fallback"
        };
      }

      try {
        const missionResponse = await fetch("/api/generate-mission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hypeScanResult: analysisData.result,
            analysisId: analysisData.analysisId,
            userId
          })
        });

        if (!missionResponse.ok) {
          throw new Error("Mission API unavailable.");
        }

        missionData = (await missionResponse.json()) as MissionResponse;
      } catch {
        missionData = {
          result: createDemoMissions(analysisData.result),
          missionId: "static-demo-mission",
          source: "static demo fallback"
        };
      }

      setScan(analysisData.result);
      setSource(analysisData.source);
      setMissions(missionData.result);
      window.localStorage.setItem(
        "hype-last-quest",
        JSON.stringify({
          scan: analysisData.result,
          missions: missionData.result,
          savedAt: new Date().toISOString()
        })
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function completeMission(mission: MissionItem) {
    if (completed[mission.title]) return;
    const userId = getDemoUserId();
    const payload = {
        userId,
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

  const completedCount = Object.values(completed).filter(Boolean).length;
  const missionCount = missions?.missions.length ?? 0;
  const activeStage = completedCount
    ? "Impact"
    : missions
      ? "Mission"
      : scan
        ? "Twin"
        : loading
          ? "Analyze"
          : "Scout";
  const rallyScore = metrics?.teamUSARallyScore ?? (scan ? 42 + completedCount * 18 : 12);
  const stages = [
    { label: "Scout", mobileLabel: "Scout" },
    { label: "Analyze", mobileLabel: "Scan" },
    { label: "Twin", mobileLabel: "Twin" },
    { label: "Mission", mobileLabel: "Mission" },
    { label: "Impact", mobileLabel: "Impact" }
  ];

  return (
    <div className="arena-page mx-auto max-w-[96rem] px-3 py-5 sm:px-6 lg:px-8">
      <section className="mb-4 grid gap-4 sm:mb-5 lg:grid-cols-[1fr_auto]">
        <div className="arena-panel rounded-lg p-3.5 sm:p-5">
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-blue-300/40 bg-white/10">
                <Image src="/fan-impact-badge.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
              </span>
              <div className="min-w-0">
                <p className="hud-label">Live</p>
                <h1 className="mt-1 truncate text-3xl font-black leading-tight text-white sm:text-4xl">Fan Arena</h1>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-0 rounded-md border border-blue-300/30 bg-slate-900/72 p-2.5 sm:p-3">
                <p className="hud-label">Stage</p>
                <p className="mt-1 truncate text-base font-black text-white sm:text-lg">{activeStage}</p>
              </div>
              <div className="min-w-0 rounded-md border border-amber-200/35 bg-slate-900/72 p-2.5 sm:p-3">
                <p className="hud-label text-amber-100">Rally</p>
                <p className="mt-1 truncate text-base font-black text-white sm:text-lg">{rallyScore}</p>
              </div>
              <div className="min-w-0 rounded-md border border-emerald-200/35 bg-slate-900/72 p-2.5 sm:p-3">
                <p className="hud-label text-emerald-100">Missions</p>
                <p className="mt-1 truncate text-base font-black text-white sm:text-lg">
                  {completedCount}/{missionCount || 4}
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-4 grid grid-cols-5 gap-1.5 sm:mt-5 sm:gap-2">
            {stages.map((stage, index) => {
              const currentIndex = stages.findIndex((item) => item.label === activeStage);
              const done = index <= currentIndex;
              return (
                <div key={stage.label} className="min-w-0 text-center">
                  <div className="mb-2 flex flex-col items-center gap-1">
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                        done ? "border-blue-100 bg-blue-500 text-white" : "border-white/20 bg-slate-800 text-slate-300"
                      }`}
                    >
                      {done ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : <Gauge aria-hidden="true" className="h-4 w-4" />}
                    </span>
                    <span className="block w-full text-[0.64rem] font-black leading-tight text-slate-100 sm:text-xs">
                      <span className="sm:hidden">{stage.mobileLabel}</span>
                      <span className="hidden sm:inline">{stage.label}</span>
                    </span>
                  </div>
                  <div className="hud-meter h-1.5 rounded-md">
                    <span style={{ width: done ? "100%" : "0%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="arena-panel rounded-lg p-3.5 sm:min-w-[16rem] sm:p-4">
          <div className="relative z-10 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md bg-amber-400/20 text-amber-100">
              <Trophy aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="hud-label text-amber-100">Energy</p>
              <p className="text-2xl font-black text-white">{scan ? "Charged" : "Ready"}</p>
            </div>
          </div>
          <div className="hud-meter relative z-10 mt-4 h-2 rounded-md">
            <span style={{ width: scan ? "86%" : loading ? "58%" : "24%" }} />
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <ContentInputCard
            value={text}
            onValueChange={setText}
            onAnalyze={analyze}
            loading={loading}
            imageName={imageName}
            onImageChange={(dataUrl, name) => {
              setImageDataUrl(dataUrl);
              setImageName(name);
            }}
          />
          <SupportRouterCard result={scan} />
          <ImpactScoreCard metrics={metrics} />
        </div>
        <div className="space-y-5" aria-live="polite">
          {loading ? (
            <div className="arena-panel flex min-h-80 items-center justify-center rounded-lg p-8 text-center">
              <div className="relative z-10">
                <div className="arena-pulse mx-auto grid h-20 w-20 place-items-center rounded-full border border-blue-300/40 bg-blue-500/20">
                  <Loader2 aria-hidden="true" className="h-10 w-10 animate-spin text-blue-100" />
                </div>
                <p className="mt-4 text-lg font-black text-white">Building quest</p>
                <p className="mt-1 text-sm rally-muted">Scan. Twin. Mission.</p>
              </div>
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-50">
              <div className="flex items-start gap-3">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            </div>
          ) : null}
          {scan ? (
            <>
              <AnalysisResultCard result={scan} source={source} />
              <SafetyCard scan={scan} />
              <ParalympicTwinCard scan={scan} />
            </>
          ) : (
            <div className="arena-panel rounded-lg p-6">
              <div className="relative z-10 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-blue-500/20 text-blue-100">
                  <Sparkles aria-hidden="true" className="h-6 w-6" />
                </span>
                <div>
                  <p className="hud-label">Ready</p>
                  <h2 className="text-xl font-black text-white">Scan to unlock</h2>
                </div>
              </div>
            </div>
          )}
          {missions ? (
            <section className="space-y-4" aria-labelledby="mission-card-title">
              <div className="rally-surface rounded-lg p-5 shadow-rally-card">
                <h2 id="mission-card-title" className="text-xl font-black text-slate-950 dark:text-white">
                  Missions
                </h2>
                <p className="mt-1 text-sm rally-muted clamp-2">{missions.missionTheme}</p>
                <p className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-950 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-50 clamp-2">
                  {missions.teamUSARallyMessage}
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {missions.missions.map((mission) => (
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
                aria-label="Open Impact Dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-rally-red px-5 py-3 text-sm font-black text-white shadow-rally-glow"
              >
                Impact
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
