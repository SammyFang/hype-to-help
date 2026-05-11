import { BarChart3, CheckCircle2, Eye, MessageSquareText, MousePointerClick, Sparkles, Users } from "lucide-react";
import type { ImpactMetrics } from "@/types";
import { Badge } from "@/components/Badge";
import { ProgressScore } from "@/components/ProgressScore";

type ImpactDashboardProps = {
  metrics: ImpactMetrics;
};

export function ImpactDashboard({ metrics }: ImpactDashboardProps) {
  const counters = [
    { label: "Safe", value: metrics.safeCommentsGenerated, icon: MessageSquareText },
    { label: "Twin", value: metrics.paralympicDiscoveries, icon: Sparkles },
    { label: "Done", value: metrics.fanMissionsCompleted, icon: CheckCircle2 },
    { label: "Verify", value: metrics.verifiedSupportClicks, icon: MousePointerClick },
    { label: "Watch", value: metrics.officialViewingActions, icon: Eye },
    { label: "Support", value: metrics.grassrootsSupportActions, icon: Users }
  ];

  return (
    <section className="space-y-5" aria-labelledby="impact-dashboard-title">
      <div className="arena-panel rounded-lg p-5">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-red-300/30 bg-red-500/20 text-red-100">
              <BarChart3 aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="hud-label text-red-100">Score</p>
              <h2 id="impact-dashboard-title" className="text-2xl font-black text-white">
                Rally Score
              </h2>
              <p className="text-sm rally-muted">Live impact</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-300/35 bg-amber-400/15 px-5 py-3 text-center text-white">
            <p className="hud-label text-amber-100">Score</p>
            <p className="text-4xl font-black">{metrics.teamUSARallyScore}</p>
          </div>
        </div>
        <div className="relative z-10 mt-6 grid gap-4 lg:grid-cols-2">
          <ProgressScore label="Learn" value={metrics.learningScore} tone="blue" />
          <ProgressScore label="Include" value={metrics.inclusionScore} tone="gold" />
          <ProgressScore label="Support" value={metrics.supportScore} tone="green" />
          <ProgressScore label="Safety" value={metrics.safetyScore} tone="red" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counters.map((counter) => {
          const Icon = counter.icon;
          return (
            <div key={counter.label} className="arena-panel rounded-lg p-4">
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold rally-muted">{counter.label}</p>
                  <p className="mt-1 text-3xl font-black text-white">{counter.value}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-md border border-blue-300/30 bg-blue-500/20 text-blue-100">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="arena-panel rounded-lg p-5">
          <div className="relative z-10">
          <h3 className="text-lg font-black text-white">Badges</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {metrics.badges.length ? (
              metrics.badges.map((badge) => (
                <Badge key={badge} tone="gold">
                  {badge}
                </Badge>
              ))
            ) : (
              <p className="text-sm rally-muted">Complete one mission.</p>
            )}
          </div>
          </div>
        </div>
        <div className="arena-panel rounded-lg p-5">
          <div className="relative z-10">
          <h3 className="text-lg font-black text-white">Recent</h3>
          <div className="mt-4 space-y-3">
            {metrics.recentEvents.length ? (
              metrics.recentEvents.map((event) => (
                <div key={event.id} className="rounded-md border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-white">{event.eventType}</p>
                    <Badge tone="green">{event.points} pts</Badge>
                  </div>
                  <p className="mt-1 text-sm rally-muted clamp-2">{event.supportImpact}</p>
                </div>
              ))
            ) : (
              <p className="text-sm rally-muted">No events yet.</p>
            )}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
