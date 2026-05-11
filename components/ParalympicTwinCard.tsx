import { Link2, Sparkles } from "lucide-react";
import type { HypeScanResult, ParalympicTwinResult } from "@/types";
import { Badge } from "@/components/Badge";

type ParalympicTwinCardProps = {
  scan?: HypeScanResult;
  twin?: ParalympicTwinResult;
};

export function ParalympicTwinCard({ scan, twin }: ParalympicTwinCardProps) {
  const title = twin?.paralympicTwin ?? scan?.paralympicTwin.sportOrTopic ?? "Paralympic Team USA discovery";
  const explanation =
    twin?.whyThisConnectionMatters ??
    scan?.paralympicTwin.explanation ??
    "Every Team USA topic should include a meaningful Paralympic connection whenever possible.";

  return (
    <article className="rally-surface rounded-lg p-5 shadow-rally-card" aria-labelledby="twin-card-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-rally-blue text-white">
            <Link2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 id="twin-card-title" className="text-xl font-black text-slate-950 dark:text-white">
              Paralympic Twin Card
            </h2>
            <p className="text-sm rally-muted">Parity link</p>
          </div>
        </div>
        <Badge tone="blue" icon={<Sparkles aria-hidden="true" className="h-3.5 w-3.5" />}>
          unlocked
        </Badge>
      </div>
      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/30 dark:bg-blue-500/10">
        <p className="text-xs font-black uppercase text-rally-blue">Twin</p>
        <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{title}</p>
        <p className="mt-3 text-sm leading-6 rally-muted clamp-3">{explanation}</p>
      </div>
      {twin ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-black text-slate-950 dark:text-white">Rule</p>
            <p className="mt-1 text-sm rally-muted clamp-2">{twin.classificationOrRuleInsight}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-black text-slate-950 dark:text-white">Mission</p>
            <p className="mt-1 text-sm rally-muted clamp-2">{twin.fanDiscoveryMission}</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
