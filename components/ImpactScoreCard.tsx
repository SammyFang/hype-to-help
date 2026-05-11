import { Trophy } from "lucide-react";
import type { ImpactMetrics } from "@/types";
import { ProgressScore } from "@/components/ProgressScore";

type ImpactScoreCardProps = {
  metrics?: ImpactMetrics;
};

export function ImpactScoreCard({ metrics }: ImpactScoreCardProps) {
  if (!metrics) {
    return (
      <article className="rally-surface rounded-lg p-5 shadow-rally-card">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-rally-red text-white">
            <Trophy aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Impact</h2>
            <p className="text-sm rally-muted">Complete missions.</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rally-surface rounded-lg p-5 shadow-rally-card" aria-labelledby="impact-score-card-title">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-rally-red text-white">
            <Trophy aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 id="impact-score-card-title" className="text-xl font-black text-slate-950 dark:text-white">
              Impact
            </h2>
            <p className="text-sm rally-muted">Live score</p>
          </div>
        </div>
        <p className="rounded-md bg-rally-navy px-4 py-2 text-2xl font-black text-white">
          {metrics.teamUSARallyScore}
        </p>
      </div>
      <div className="mt-5 grid gap-4">
        <ProgressScore label="Learning" value={metrics.learningScore} tone="blue" />
        <ProgressScore label="Inclusion" value={metrics.inclusionScore} tone="gold" />
        <ProgressScore label="Support" value={metrics.supportScore} tone="green" />
        <ProgressScore label="Safety" value={metrics.safetyScore} tone="red" />
      </div>
    </article>
  );
}
