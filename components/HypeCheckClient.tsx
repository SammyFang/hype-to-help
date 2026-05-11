"use client";

import { useState } from "react";
import { CheckCircle2, Clipboard, Loader2, MessageSquareText } from "lucide-react";
import { SafetyCard } from "@/components/SafetyCard";
import { getDemoUserId } from "@/lib/clientUser";
import { createDemoHypeCheck, demoScenarios } from "@/lib/demoData";
import { saveLocalImpactEvent } from "@/lib/localImpact";
import type { HypeCheckResult, ImpactMetrics } from "@/types";

export function HypeCheckClient() {
  const [comment, setComment] = useState(demoScenarios[1].text);
  const [result, setResult] = useState<HypeCheckResult>();
  const [metrics, setMetrics] = useState<ImpactMetrics>();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  async function runCheck() {
    setLoading(true);
    setSaved(false);
    setError(undefined);

    try {
      try {
        const response = await fetch("/api/hypecheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment, userId: getDemoUserId() })
        });

        if (!response.ok) {
          throw new Error("HypeCheck API unavailable.");
        }

        const data = (await response.json()) as { result: HypeCheckResult };
        setResult(data.result);
      } catch {
        setResult(createDemoHypeCheck(comment));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function saveRewriteImpact() {
    if (!result || saved) return;
    const payload = {
        userId: getDemoUserId(),
        eventType: "HypeCheck",
        points: result.safetyRating === "harmful" ? 40 : 25,
        sport: "Team USA",
        paralympicIncluded: true,
        supportImpact: "Generated or confirmed a safer Team USA fan message before posting.",
        badge: result.safetyRating === "safe" ? "Safe Signal" : "Respect Rewrite"
      } as const;

    try {
      const response = await fetch("/api/save-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Impact API unavailable.");
      const data = (await response.json()) as { metrics: ImpactMetrics };
      setMetrics(data.metrics);
      setSaved(true);
    } catch {
      const data = saveLocalImpactEvent(payload);
      setMetrics(data.metrics);
      setSaved(true);
    }
  }

  return (
    <div className="arena-page mx-auto grid max-w-[96rem] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <section className="arena-panel rounded-lg p-5" aria-labelledby="hypecheck-title">
        <div className="relative z-10 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
            <MessageSquareText aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <p className="hud-label">Gate</p>
            <h1 id="hypecheck-title" className="text-3xl font-black text-white">
              HypeCheck
            </h1>
          </div>
        </div>
        <label htmlFor="comment" className="relative z-10 mt-5 block text-sm font-black text-white">
          Comment
        </label>
        <textarea
          id="comment"
          rows={10}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          className="relative z-10 mt-2 w-full rounded-lg border border-blue-300/25 bg-slate-950/74 p-4 text-base font-semibold leading-7 text-white shadow-inner focus:outline focus:outline-2"
        />
        <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            aria-label="Analyze comment with Gemini"
            onClick={runCheck}
            disabled={loading}
            className="arena-command inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
            {loading ? "Checking..." : "Check"}
          </button>
          <button
            type="button"
            onClick={() => setComment(demoScenarios[1].text)}
            className="rounded-md border border-blue-300/25 bg-white/10 px-5 py-3 text-sm font-bold text-slate-100 transition hover:bg-blue-400/20"
          >
            Demo
          </button>
        </div>
        {error ? <p className="mt-4 text-sm font-semibold text-red-700 dark:text-red-200">{error}</p> : null}
      </section>
      <div className="space-y-5" aria-live="polite">
        {result ? (
          <>
            <SafetyCard check={result} />
            <article className="arena-panel rounded-lg p-5">
              <div className="relative z-10">
              <p className="hud-label">Rewrite</p>
              <h2 className="text-xl font-black text-white">Supportive rewrite</h2>
              <p className="mt-3 rounded-lg border border-blue-300/25 bg-blue-500/10 p-4 text-base font-semibold leading-7 text-blue-50 clamp-3">
                {result.supportiveRewrite}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-black text-white">Short</p>
                  <p className="mt-1 text-sm rally-muted clamp-2">{result.shortTeamUSAMessage}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/10 p-3">
                  <p className="text-sm font-black text-white">Post</p>
                  <p className="mt-1 text-sm rally-muted clamp-2">{result.postingGuidance}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={saved ? "Safe rewrite counted" : "Count Safe Rewrite Impact"}
                onClick={saveRewriteImpact}
                disabled={saved}
                className="arena-command mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black text-white disabled:bg-emerald-600"
              >
                <Clipboard aria-hidden="true" className="h-4 w-4" />
                {saved ? "Safe rewrite counted" : "Count"}
              </button>
              </div>
            </article>
            {metrics ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-950 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-50">
                Rally Score updated to {metrics.teamUSARallyScore}.
              </div>
            ) : null}
          </>
        ) : (
          <div className="arena-panel rounded-lg p-6">
            <div className="relative z-10">
              <p className="hud-label">Ready</p>
              <h2 className="text-xl font-black text-white">Check to unlock</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
