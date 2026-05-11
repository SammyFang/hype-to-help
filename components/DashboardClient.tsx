"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCcw } from "lucide-react";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { getDemoUserId } from "@/lib/clientUser";
import { getLocalImpactMetrics } from "@/lib/localImpact";
import type { ImpactMetrics } from "@/types";

export function DashboardClient() {
  const [metrics, setMetrics] = useState<ImpactMetrics>();
  const [loading, setLoading] = useState(false);

  async function loadMetrics() {
    setLoading(true);
    const userId = getDemoUserId();
    try {
      const response = await fetch(`/api/impact?userId=${encodeURIComponent(userId)}`, {
        cache: "no-store"
      });
      if (!response.ok) throw new Error("Impact API unavailable.");
      const data = (await response.json()) as { metrics: ImpactMetrics };
      setMetrics(data.metrics);
    } catch {
      setMetrics(getLocalImpactMetrics(userId));
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  return (
    <div className="arena-page mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8">
      <div className="arena-panel mb-5 rounded-lg p-5">
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
              <Activity aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="hud-label">Telemetry</p>
              <h1 className="text-3xl font-black text-white">Impact</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={loadMetrics}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-300/25 bg-white/10 px-4 py-3 text-sm font-black text-white"
          >
            <RefreshCcw aria-hidden="true" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Sync
          </button>
        </div>
      </div>
      {metrics ? (
        <ImpactDashboard metrics={metrics} />
      ) : (
        <div className="arena-panel rounded-lg p-8 text-center">
          <p className="relative z-10 text-lg font-black text-white">Loading...</p>
        </div>
      )}
    </div>
  );
}
