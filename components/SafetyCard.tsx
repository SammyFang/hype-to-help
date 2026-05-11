import { CheckCircle2, ShieldAlert } from "lucide-react";
import type { HypeCheckResult, HypeScanResult } from "@/types";
import { Badge } from "@/components/Badge";

type SafetyCardProps = {
  scan?: HypeScanResult;
  check?: HypeCheckResult;
};

export function SafetyCard({ scan, check }: SafetyCardProps) {
  const risk = check?.safetyRating ?? scan?.riskLevel ?? "low";
  const issues = check?.issuesDetected ?? scan?.possibleIssues ?? [];
  const title = check ? "HypeCheck Safety Card" : "Safety Card";
  const safe = risk === "safe" || risk === "low";

  return (
    <article className="rally-surface rounded-lg p-5 shadow-rally-card" aria-labelledby="safety-card-title">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid h-11 w-11 place-items-center rounded-md text-white ${safe ? "bg-emerald-600" : "bg-rally-red"}`}>
            {safe ? <CheckCircle2 aria-hidden="true" className="h-5 w-5" /> : <ShieldAlert aria-hidden="true" className="h-5 w-5" />}
          </span>
          <div>
            <h2 id="safety-card-title" className="text-xl font-black text-slate-950 dark:text-white">
              {title}
            </h2>
            <p className="text-sm rally-muted">Respect check</p>
          </div>
        </div>
        <Badge tone={safe ? "green" : risk === "medium" || risk === "needs_context" ? "gold" : "red"}>
          {String(risk).replace("_", " ")}
        </Badge>
      </div>
      <div className="mt-5 space-y-3">
        {issues.length ? (
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">Issues</p>
            <ul className="mt-2 space-y-2 text-sm rally-muted">
              {issues.map((issue) => (
                <li key={issue} className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5 clamp-2">
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-50">
            Clear.
          </p>
        )}
        {check ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/30 dark:bg-blue-500/10">
            <p className="text-sm font-black text-slate-950 dark:text-white">Why</p>
            <p className="mt-1 text-sm rally-muted clamp-3">{check.whyItMatters}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
